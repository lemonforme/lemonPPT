// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { cp, mkdir, mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import PptxGenJS from 'pptxgenjs';
import { withPPTXEmbedFonts } from 'pptx-embed-fonts/pptxgenjs';

declare global {
  interface Window {
    __lemonPPT_initECharts?: (theme?: string, root?: Element | null) => Promise<void>;
  }

  function extractTextBoxes(slideIndex: number, markElements?: boolean): TextBox[];
  function extractVectorizableShapes(slideIndex: number, markElements?: boolean): ShapeOverlay[];
  function extractImages(slideIndex: number, markElements?: boolean): ImageOverlay[];
  function restoreOverlayStyles(): void;
}

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

export interface ExportProgress {
  phase: 'prepare' | 'render' | 'extract' | 'screenshot' | 'build' | 'embed' | 'done';
  current?: number;
  total?: number;
  message: string;
}

export interface ExportDomToPptxOptions {
  /** 待导出的 HTML 字符串 */
  html: string;
  /** HTML 引用的静态资源目录（会被复制到临时目录的 assets/ 下），可选 */
  assetsDir?: string;
  /** 页面宽度（像素），默认 1280 */
  width?: number;
  /** 页面高度（像素），默认 720 */
  height?: number;
  /** PPTX 元数据：标题 */
  title?: string;
  /** PPTX 元数据：主题 */
  subject?: string;
  /** PPTX 元数据：作者 */
  author?: string;
  /** 是否在截图上叠加可编辑文字，默认 true */
  editableText?: boolean;
  /** 是否将简单图形（圆角矩形、圆形、线条）矢量化，默认 true */
  vectorizeShapes?: boolean;
  /** 是否将 <img> 元素提取为 PPTX 图片，默认 true */
  extractImages?: boolean;
  /** 复杂区域选择器（预留），默认 '.lp-slide-wrapper' */
  fallbackSelector?: string;
  /** 需要嵌入的字体目录，可选。提供后会按 CSS font-family 自动匹配并嵌入 */
  fontDir?: string;
  /** 在 Playwright 中初始化 ECharts，默认 true */
  initECharts?: boolean;
  /** ECharts 初始化后等待毫秒数，默认 600 */
  echartsWaitMs?: number;
  /** 页面加载超时毫秒数，默认 30000 */
  navigationTimeout?: number;
  /** 截图超时毫秒数，默认 30000 */
  screenshotTimeout?: number;
  /** 结构化日志器，默认 console */
  logger?: Logger;
  /** 进度回调 */
  onProgress?: (progress: ExportProgress) => void;
}

interface TextBox {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontFamilies: string[];
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
}

interface ShapeOverlay {
  type: 'roundRect' | 'ellipse' | 'line';
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  fillTransparency?: number;
  rectRadius?: number;
  lineColor?: string;
  lineWidth?: number;
  lineTransparency?: number;
  lineDirection?: 'horizontal' | 'vertical';
}

interface ImageOverlay {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SlideData {
  path: string;
  textBoxes: TextBox[];
  shapes: ShapeOverlay[];
  images: ImageOverlay[];
}

/**
 * DOM-to-PPTX 导出引擎（阶段 5）。
 *
 * 输入已渲染好的 HTML 字符串（含 CSS 变量、字体、脚本引用），
 * 用 Playwright 渲染后逐页截图，并将文字/简单图形/图片抽回为可编辑 PPTX 元素。
 * 返回 PPTX 文件 Buffer。
 */
export async function exportDomToPptx(options: ExportDomToPptxOptions): Promise<Buffer> {
  const {
    html,
    assetsDir,
    width = 1280,
    height = 720,
    title,
    subject,
    author,
    editableText = true,
    vectorizeShapes = true,
    extractImages: extractImagesEnabled = true,
    fontDir,
    initECharts = true,
    echartsWaitMs = 600,
    navigationTimeout = 30000,
    screenshotTimeout = 30000,
    logger = console,
    onProgress,
  } = options;

  const log = logger;
  const progress = (p: ExportProgress) => {
    log.debug(p.message);
    onProgress?.(p);
  };

  progress({ phase: 'prepare', message: '准备临时目录与静态资源' });

  // 在临时目录中准备 HTML 和静态资源，确保相对引用可用。
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-dom-to-pptx-'));
  const tempHtml = path.join(tempDir, 'index.html');
  const assetsDest = path.join(tempDir, 'assets');
  await mkdir(assetsDest, { recursive: true });
  await writeFile(tempHtml, html, 'utf-8');

  if (assetsDir) {
    log.info(`复制静态资源: ${assetsDir} -> ${assetsDest}`);
    await cp(assetsDir, assetsDest, { recursive: true, force: true });
  }

  let browser;
  try {
    log.info('启动 Playwright Chromium');
    browser = await chromium.launch();
    const page = await browser.newPage();

    const screenshotDir = path.join(tempDir, 'screenshots');
    await mkdir(screenshotDir, { recursive: true });
    const slides: SlideData[] = [];

    page.setDefaultNavigationTimeout(navigationTimeout);
    page.setDefaultTimeout(screenshotTimeout);

    log.info(`加载页面: file://${tempHtml}`);
    progress({ phase: 'render', message: '加载 HTML 并等待字体就绪' });
    await page.goto('file://' + tempHtml, { waitUntil: 'domcontentloaded' });
    await page.setViewportSize({ width, height });

    // 等待字体就绪，避免文字截断或 fallback 字体导致排版偏差。
    try {
      await page.evaluate(() => document.fonts.ready);
      log.debug('document.fonts.ready 已触发');
    } catch (err) {
      log.warn('等待字体就绪失败，继续使用当前字体渲染', err);
    }

    if (initECharts) {
      progress({ phase: 'render', message: '初始化 ECharts 图表' });
      try {
        await page.evaluate(async () => {
          if (typeof window.__lemonPPT_initECharts === 'function') {
            await window.__lemonPPT_initECharts();
          }
        });
        if (echartsWaitMs > 0) {
          await page.waitForTimeout(echartsWaitMs);
        }
      } catch (err) {
        log.warn('ECharts 初始化失败或超时，将继续导出', err);
      }
    }

    // 隐藏翻页导航、页码、提示，这些不属于单页内容。
    await page.addStyleTag({
      content: '.lp-nav, .lp-page-counter, .lp-hint { display: none !important; }',
    });

    // 注入浏览器端文字/图形/图片提取与样式恢复函数
    await page.addScriptTag({ content: EXTRACT_SCRIPT });

    const slideCount = await page.evaluate(() =>
      document.querySelectorAll('.lp-slide-wrapper').length,
    );

    if (slideCount === 0) {
      throw new Error('未找到任何 .lp-slide-wrapper 幻灯片节点，请检查 HTML 结构');
    }

    log.info(`共 ${slideCount} 页幻灯片，开始逐页处理`);

    for (let i = 0; i < slideCount; i++) {
      progress({ phase: 'extract', current: i + 1, total: slideCount, message: `处理第 ${i + 1}/${slideCount} 页` });

      // 只显示当前 slide，其余隐藏，避免叠加和透明度干扰截图。
      await page.evaluate(
        (idx) => {
          document.querySelectorAll('.lp-slide-wrapper').forEach((el, index) => {
            const wrapper = el as HTMLElement;
            if (index === idx) {
              wrapper.style.opacity = '1';
              wrapper.style.visibility = 'visible';
              wrapper.style.zIndex = '9999';
            } else {
              wrapper.style.opacity = '0';
              wrapper.style.visibility = 'hidden';
              wrapper.style.zIndex = '0';
            }
          });
        },
        i,
      );

      const wrapper = page.locator(`.lp-slide-wrapper[data-slide-index="${i}"]`);
      const screenshotPath = path.join(screenshotDir, `slide-${i}.png`);

      let textBoxes: TextBox[] = [];
      let shapes: ShapeOverlay[] = [];
      let images: ImageOverlay[] = [];

      if (editableText) {
        // 先提取文字并隐藏原始文字，再截图，避免底层截图文字与叠加文字重影。
        textBoxes = await page.evaluate((idx) => extractTextBoxes(idx, true), i);
      }
      if (vectorizeShapes) {
        // 在文字提取之后提取简单图形，避免隐藏父容器后无法获取内部文字。
        shapes = await page.evaluate((idx) => extractVectorizableShapes(idx, true), i);
      }
      if (extractImagesEnabled) {
        // 提取 <img> 并在截图中隐藏，避免重复绘制。
        images = await page.evaluate((idx) => extractImages(idx, true), i);
      }

      progress({ phase: 'screenshot', current: i + 1, total: slideCount, message: `截取第 ${i + 1}/${slideCount} 页` });
      try {
        await wrapper.screenshot({ path: screenshotPath, type: 'png', timeout: screenshotTimeout });
      } catch (err) {
        log.error(`第 ${i + 1} 页截图失败`, err);
        throw new Error(`第 ${i + 1} 页截图失败: ${err instanceof Error ? err.message : String(err)}`);
      }

      if (editableText || vectorizeShapes || extractImagesEnabled) {
        // 恢复被隐藏的文字/图形/图片样式，避免影响下一页提取。
        await page.evaluate(() => restoreOverlayStyles());
      }

      log.debug(`第 ${i + 1} 页: ${textBoxes.length} 文本框, ${shapes.length} 形状, ${images.length} 图片`);
      slides.push({ path: screenshotPath, textBoxes, shapes, images });
    }

    progress({ phase: 'build', message: '组装 PPTX' });
    const buffer = await buildPPTX({
      slides,
      width,
      height,
      title,
      subject,
      author,
      fontDir,
      log,
      progress,
    });

    progress({ phase: 'done', message: 'PPTX 生成完成' });
    return buffer;
  } finally {
    if (browser) {
      await browser.close().catch((err) => log.warn('关闭浏览器失败', err));
    }
    await rm(tempDir, { recursive: true, force: true }).catch((err) => log.warn('清理临时目录失败', err));
  }
}

interface BuildPPTXOptions {
  slides: SlideData[];
  width: number;
  height: number;
  title?: string;
  subject?: string;
  author?: string;
  fontDir?: string;
  log: Logger;
  progress: (p: ExportProgress) => void;
}

async function buildPPTX(options: BuildPPTXOptions): Promise<Buffer> {
  const { slides, width, height, title, subject, author, fontDir, log, progress } = options;

  const EnhancedPptxGenJS = withPPTXEmbedFonts(PptxGenJS);
  const pptx = new EnhancedPptxGenJS();

  // 按实际像素尺寸设置幻灯片大小：1280x720 -> 10 x 5.625 inch。
  pptx.defineLayout({ name: 'CUSTOM', width: pxToIn(width), height: pxToIn(height) });
  pptx.layout = 'CUSTOM';

  if (title) pptx.title = title;
  if (subject) pptx.subject = subject;
  if (author) pptx.author = author;

  const fontRegistry = fontDir ? buildFontRegistry(fontDir) : {};
  const embeddableFonts = new Map<string, string>();
  const missingFonts = new Set<string>();

  for (let i = 0; i < slides.length; i++) {
    const { path: screenshotPath, textBoxes, shapes, images } = slides[i];
    const slide = pptx.addSlide();

    // 截图作为背景
    slide.addImage({
      path: screenshotPath,
      x: 0,
      y: 0,
      w: pxToIn(width),
      h: pxToIn(height),
      sizing: { type: 'crop', w: pxToIn(width), h: pxToIn(height) },
    });

    // 绘制矢量化的简单图形，确保它们在截图之上、文字之下。
    for (const shape of shapes) {
      const opts: Record<string, any> = {
        x: pxToIn(shape.x),
        y: pxToIn(shape.y),
        w: pxToIn(shape.w),
        h: pxToIn(shape.h),
      };
      if (shape.fill) {
        opts.fill = { color: shape.fill };
        if (shape.fillTransparency !== undefined) {
          opts.fill.transparency = shape.fillTransparency;
        }
      }
      if (shape.lineColor && shape.lineWidth) {
        opts.line = { color: shape.lineColor, width: shape.lineWidth };
        if (shape.lineTransparency !== undefined) {
          opts.line.transparency = shape.lineTransparency;
        }
      }
      if (shape.type === 'roundRect' && shape.rectRadius !== undefined) {
        opts.rectRadius = shape.rectRadius;
      }

      const ShapeType = (pptx as any).ShapeType;
      const shapeType =
        shape.type === 'roundRect'
          ? ShapeType.roundRect
          : shape.type === 'ellipse'
            ? ShapeType.ellipse
            : ShapeType.line;
      slide.addShape(shapeType, opts);
    }

    // 添加图片覆盖层
    for (const img of images) {
      try {
        slide.addImage({
          path: img.src,
          x: pxToIn(img.x),
          y: pxToIn(img.y),
          w: pxToIn(img.w),
          h: pxToIn(img.h),
        });
      } catch (err) {
        log.warn(`第 ${i + 1} 页图片添加失败: ${img.src}`, err);
      }
    }

    // 添加可编辑文字
    for (const box of textBoxes) {
      const { fontFace, fontFile } = resolveEmbeddableFont(box.fontFamilies, fontRegistry);
      if (fontFile) {
        embeddableFonts.set(fontFace, fontFile);
      } else if (fontDir) {
        const firstFamily = box.fontFamilies[0]?.replace(/['"]/g, '').trim();
        if (firstFamily) missingFonts.add(firstFamily);
      }

      slide.addText(box.text, {
        x: pxToIn(box.x),
        y: pxToIn(box.y),
        w: pxToIn(box.w),
        h: pxToIn(box.h),
        fontFace,
        fontSize: box.fontSize,
        color: box.color,
        bold: box.bold,
        italic: box.italic,
        align: box.align,
        valign: box.valign,
      } as any);
    }
  }

  if (missingFonts.size > 0) {
    log.warn(`以下字体未在 fontDir 中找到，将使用系统 fallback: ${[...missingFonts].join(', ')}`);
  }

  progress({ phase: 'embed', message: `嵌入 ${embeddableFonts.size} 种字体` });
  for (const [fontFace, fontFile] of embeddableFonts) {
    try {
      const buffer = await readFile(fontFile);
      const ext = path.extname(fontFile).slice(1).toLowerCase() as 'ttf' | 'otf' | 'woff' | 'eot';
      await (pptx as any).addFont({ fontFace, fontFile: buffer, fontType: ext });
      log.debug(`嵌入字体: ${fontFace}`);
    } catch (err) {
      log.warn(`嵌入字体失败: ${fontFace} -> ${fontFile}`, err);
    }
  }

  const outFile = path.join(os.tmpdir(), `lemonppt-dom-to-pptx-output-${Date.now()}.pptx`);
  await (pptx as any).writeFile({ fileName: outFile });
  return await readFile(outFile);
}

function pxToIn(px: number): number {
  return (px * 10) / 1280;
}

function buildFontRegistry(fontDir: string): Record<string, string> {
  return {
    Anton: path.join(fontDir, 'Anton', 'Anton-Regular.ttf'),
    Archivo: path.join(fontDir, 'Archivo', 'Archivo[wdth,wght].ttf'),
    Caveat: path.join(fontDir, 'Caveat', 'Caveat[wght].ttf'),
    'IBM Plex Sans': path.join(fontDir, 'IBMPlexSans', 'IBMPlexSans[wdth,wght].ttf'),
    Inter: path.join(fontDir, 'Inter', 'Inter[opsz,wght].ttf'),
    'JetBrains Mono': path.join(fontDir, 'JetBrainsMono', 'JetBrainsMono[wght].ttf'),
    Newsreader: path.join(fontDir, 'Newsreader', 'Newsreader[opsz,wght].ttf'),
    'Noto Sans SC': path.join(fontDir, 'NotoSansSC', 'NotoSansSC[wght].ttf'),
    'Noto Serif SC': path.join(fontDir, 'NotoSerifSC', 'NotoSerifSC[wght].ttf'),
    'Space Grotesk': path.join(fontDir, 'SpaceGrotesk', 'SpaceGrotesk[wght].ttf'),
    'Space Mono': path.join(fontDir, 'SpaceMono', 'SpaceMono-Regular.ttf'),
  };
}

function resolveEmbeddableFont(
  fontFamilies: string[],
  fontRegistry: Record<string, string>,
): { fontFace: string; fontFile?: string } {
  for (const raw of fontFamilies) {
    const name = raw.replace(/['"]/g, '').trim();
    if (fontRegistry[name]) {
      return { fontFace: name, fontFile: fontRegistry[name] };
    }
  }
  return { fontFace: fontFamilies[0]?.replace(/['"]/g, '').trim() || 'Arial' };
}

const EXTRACT_SCRIPT = `
const LP_ORIGINAL_PROPS = ['color', 'fill', 'stroke', 'webkitTextFillColor', 'textShadow', 'textDecoration', 'opacity', 'backgroundColor', 'borderColor', 'borderWidth', 'boxShadow'];

function getWrapper(slideIndex) {
  return document.querySelector('.lp-slide-wrapper[data-slide-index="' + slideIndex + '"]');
}

function isIgnoredElement(el) {
  return el.matches && el.matches('.lp-nav, .lp-page-counter, .lp-hint');
}

function walkElements(root, callback) {
  function walk(el) {
    for (const child of Array.from(el.children)) {
      if (isIgnoredElement(child)) continue;
      callback(child);
      walk(child);
    }
  }
  walk(root);
}

function rgbToHex(rgb) {
  if (!rgb || rgb === 'none') return null;
  const m = rgb.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/);
  if (!m) return null;
  const toHex = (n) => parseInt(n, 10).toString(16).padStart(2, '0');
  return '#' + toHex(m[1]) + toHex(m[2]) + toHex(m[3]);
}

function extractTextBoxes(slideIndex, markElements) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return [];

  const wrapperRect = wrapper.getBoundingClientRect();
  const candidates = [];

  walkElements(wrapper, (el) => {
    const hasDirectText = Array.from(el.childNodes).some(
      (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim().length > 0
    );
    if (hasDirectText) candidates.push(el);
  });

  const kept = candidates.filter((el) =>
    !candidates.some((other) => other !== el && other.contains(el))
  );

  const boxes = [];
  for (const el of kept) {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;

    const text = (el.innerText || '').trim();
    if (!text) continue;

    const isSvg = el.namespaceURI === 'http://www.w3.org/2000/svg';
    const color = rgbToHex(isSvg ? style.fill : style.color);
    if (!color) continue;

    const fontSizePx = parseFloat(style.fontSize);
    if (!fontSizePx || fontSizePx <= 0) continue;

    const fontFamilies = style.fontFamily.split(',').map((s) => s.replace(/['"]/g, '').trim()).filter(Boolean);
    const fontWeight = style.fontWeight;
    const bold = fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600;
    const italic = style.fontStyle === 'italic';

    let align = 'left';
    if (style.textAlign === 'center') align = 'center';
    else if (style.textAlign === 'right' || style.textAlign === 'end') align = 'right';

    let valign = 'top';
    if (style.display === 'flex' || style.display === 'grid' || style.display === 'inline-flex') {
      if (style.alignItems === 'center') valign = 'middle';
      else if (style.alignItems === 'flex-end' || style.alignItems === 'end') valign = 'bottom';
    }

    if (markElements) {
      hideElementText(el);
    }

    boxes.push({
      text,
      x: rect.left - wrapperRect.left,
      y: rect.top - wrapperRect.top,
      w: rect.width,
      h: rect.height,
      fontFamilies,
      fontSize: fontSizePx * 0.75,
      color,
      bold,
      italic,
      align,
      valign,
    });
  }

  return boxes;
}

function hideElementText(el) {
  const style = window.getComputedStyle(el);
  const isSvg = el.namespaceURI === 'http://www.w3.org/2000/svg';
  const usesGradientText = style.backgroundClip === 'text' || style.webkitBackgroundClip === 'text';
  const original = JSON.parse(el.getAttribute('data-lp-overlay') || '{}');

  if (isSvg) {
    original.fill = el.style.getPropertyValue('fill');
    original.stroke = el.style.getPropertyValue('stroke');
    el.style.setProperty('fill', 'transparent', 'important');
    el.style.setProperty('stroke', 'none', 'important');
  } else if (usesGradientText) {
    original.opacity = el.style.getPropertyValue('opacity');
    el.style.setProperty('opacity', '0', 'important');
  } else {
    original.color = el.style.getPropertyValue('color');
    original.webkitTextFillColor = el.style.getPropertyValue('-webkit-text-fill-color');
    original.textShadow = el.style.getPropertyValue('text-shadow');
    original.textDecoration = el.style.getPropertyValue('text-decoration');
    el.style.setProperty('color', 'transparent', 'important');
    el.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
    el.style.setProperty('text-shadow', 'none', 'important');
    el.style.setProperty('text-decoration', 'none', 'important');
  }

  el.setAttribute('data-lp-overlay', JSON.stringify(original));
}

function shouldKeepShape(el) {
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return false;
  // 跳过包含复杂子元素的节点（图标、图片、图表等仍走截图）。
  if (el.querySelector('svg, img, canvas, video, iframe')) return false;
  // 跳过渐变/图片背景与毛玻璃等无法简单矢量化的效果。
  const bgImage = style.backgroundImage;
  if (bgImage && bgImage !== 'none') return false;
  if (style.backdropFilter && style.backdropFilter !== 'none') return false;
  const bg = style.backgroundColor;
  const hasFill = bg && bg !== 'none' && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
  const hasBorder = parseFloat(style.borderBottomWidth) > 0 || parseFloat(style.borderTopWidth) > 0;
  if (!hasFill && !hasBorder) return false;
  return true;
}

function extractVectorizableShapes(slideIndex, markElements) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return [];

  const wrapperRect = wrapper.getBoundingClientRect();
  const candidates = [];
  walkElements(wrapper, (el) => candidates.push(el));

  const passing = candidates.filter(shouldKeepShape);
  // 仅保留最外层可矢量化的形状，避免父容器和子元素重复绘制。
  const kept = passing.filter((el) => !passing.some((other) => other !== el && other.contains(el)));

  const shapes = [];
  for (const el of kept) {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;

    const bg = style.backgroundColor;
    const hasFill = bg && bg !== 'none' && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    const borderColor = rgbToHex(style.borderBottomColor || style.borderTopColor);
    const borderWidth = parseFloat(style.borderBottomWidth) || parseFloat(style.borderTopWidth) || 0;

    const fill = hasFill ? rgbToHex(bg) : undefined;
    const fillOpacity = hasFill ? parseFloat(style.opacity) : undefined;

    const br = parseFloat(style.borderRadius);
    const minDim = Math.min(rect.width, rect.height);
    const isCircle = Math.abs(rect.width - rect.height) < 2 && (style.borderRadius === '50%' || br >= minDim / 2 - 1);

    // 线条：长宽比悬殊且仅含边框。
    const isHorizontalLine = rect.width >= rect.height * 4 && borderWidth > 0 && !hasFill;
    const isVerticalLine = rect.height >= rect.width * 4 && borderWidth > 0 && !hasFill;

    let type = 'roundRect';
    if (isCircle) type = 'ellipse';
    else if (isHorizontalLine || isVerticalLine) type = 'line';

    const shape = {
      type,
      x: rect.left - wrapperRect.left,
      y: rect.top - wrapperRect.top,
      w: rect.width,
      h: rect.height,
    };
    if (fill) {
      shape.fill = fill;
      if (fillOpacity !== undefined && fillOpacity < 1) {
        shape.fillTransparency = Math.round((1 - fillOpacity) * 100);
      }
    }
    if (borderColor && borderWidth) {
      shape.lineColor = borderColor;
      shape.lineWidth = borderWidth;
    }
    if (type === 'roundRect' && br > 0 && !isCircle) {
      shape.rectRadius = Math.min(br / minDim, 0.5);
    }
    if (type === 'line') {
      shape.lineDirection = isHorizontalLine ? 'horizontal' : 'vertical';
    }

    if (markElements) {
      hideElementShape(el);
    }

    shapes.push(shape);
  }

  return shapes;
}

function hideElementShape(el) {
  const original = JSON.parse(el.getAttribute('data-lp-overlay') || '{}');
  original.backgroundColor = el.style.getPropertyValue('background-color');
  original.borderColor = el.style.getPropertyValue('border-color');
  original.borderWidth = el.style.getPropertyValue('border-width');
  original.boxShadow = el.style.getPropertyValue('box-shadow');
  el.style.setProperty('background-color', 'transparent', 'important');
  el.style.setProperty('border-color', 'transparent', 'important');
  el.style.setProperty('border-width', '0px', 'important');
  el.style.setProperty('box-shadow', 'none', 'important');
  el.setAttribute('data-lp-overlay', JSON.stringify(original));
}

function extractImages(slideIndex, markElements) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return [];

  const wrapperRect = wrapper.getBoundingClientRect();
  const images = [];

  walkElements(wrapper, (el) => {
    if (el.tagName !== 'IMG') return;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return;

    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    const src = el.getAttribute('src');
    if (!src || src.startsWith('data:')) return; // data URI 暂不支持直接引用

    images.push({
      src,
      x: rect.left - wrapperRect.left,
      y: rect.top - wrapperRect.top,
      w: rect.width,
      h: rect.height,
    });

    if (markElements) {
      hideElementImage(el);
    }
  });

  return images;
}

function hideElementImage(el) {
  const original = JSON.parse(el.getAttribute('data-lp-overlay') || '{}');
  original.opacity = el.style.getPropertyValue('opacity');
  original.visibility = el.style.getPropertyValue('visibility');
  el.style.setProperty('opacity', '0', 'important');
  el.style.setProperty('visibility', 'hidden', 'important');
  el.setAttribute('data-lp-overlay', JSON.stringify(original));
}

function restoreOverlayStyles() {
  document.querySelectorAll('[data-lp-overlay]').forEach((el) => {
    const original = JSON.parse(el.getAttribute('data-lp-overlay') || '{}');
    for (const prop of LP_ORIGINAL_PROPS) {
      const cssProp = prop === 'webkitTextFillColor' ? '-webkit-text-fill-color' : prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      if (original[prop] === undefined || original[prop] === '') {
        el.style.removeProperty(cssProp);
      } else {
        el.style.setProperty(cssProp, original[prop], 'important');
      }
    }
    el.removeAttribute('data-lp-overlay');
  });
}
`;
