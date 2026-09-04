// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { cp, mkdir, mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import PptxGenJS from 'pptxgenjs';
import { withPPTXEmbedFonts } from 'pptx-embed-fonts/pptxgenjs';
import { validatePptxOutput } from './validate.js';

declare global {
  interface Window {
    __lemonPPT_initECharts?: (theme?: string, root?: Element | null) => Promise<void>;
    echarts?: any;
  }

  interface HTMLElement {
    __lpEChartInstance?: any;
  }

  function extractTextBoxes(slideIndex: number, markElements?: boolean): TextBox[];
  function extractVectorizableShapes(slideIndex: number, markElements?: boolean): ShapeOverlay[];
  function extractImages(slideIndex: number, markElements?: boolean): ImageOverlay[];
  function detectFallbackRegions(slideIndex: number): Array<{ x: number; y: number; w: number; h: number; selector?: string }>;
  function hideFallbackRegions(slideIndex: number): void;
  function showFallbackRegions(slideIndex: number): void;
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
  /** 是否自动下载远程图片（http/https）到本地临时文件，默认 true */
  downloadRemoteImages?: boolean;
  /** 复杂区域选择器（预留），默认 '.lp-slide-wrapper' */
  fallbackSelector?: string;
  /** 是否启用区域级 alpha-matte 截图，对无法矢量化的复杂区域单独截图并叠加，默认 false */
  regionFallback?: boolean;
  /** 需要嵌入的字体目录，可选。提供后会按 CSS font-family 自动匹配并嵌入 */
  fontDir?: string;
  /** 外部预览服务器 URL，提供时优先于本地 file:// 加载 HTML */
  previewUrl?: string;
  /** 在 Playwright 中初始化 ECharts，默认 true */
  initECharts?: boolean;
  /** ECharts 初始化后等待毫秒数，默认 600 */
  echartsWaitMs?: number;
  /** 页面加载超时毫秒数，默认 30000 */
  navigationTimeout?: number;
  /** 截图超时毫秒数，默认 30000 */
  screenshotTimeout?: number;
  /** Playwright 截图设备像素比，默认 2（Retina）。设置为 1 可减小文件体积 */
  deviceScaleFactor?: number;
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
  type: 'roundRect' | 'ellipse' | 'line' | 'customPath';
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
  /** 自定义路径点（仅 customPath），坐标为相对于 shape 自身 bounding box 的百分比 [0,1] */
  points?: Array<
    | { x: number; y: number; moveTo?: boolean }
    | { x: number; y: number; curve: { type: 'arc'; hR: number; wR: number; stAng: number; swAng: number } }
    | { x: number; y: number; curve: { type: 'cubic'; x1: number; y1: number; x2: number; y2: number } }
    | { x: number; y: number; curve: { type: 'quadratic'; x1: number; y1: number } }
    | { close: true }
  >;
}

interface ImageOverlay {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface FallbackRegion {
  path?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** 区域单独截图失败时，回退到整页截图裁剪，此时区域内文字/图形/图片不应再叠加，避免重复。 */
  imageOnly?: boolean;
}

interface SlideData {
  path: string;
  textBoxes: TextBox[];
  shapes: ShapeOverlay[];
  images: ImageOverlay[];
  fallbackRegions: FallbackRegion[];
}

export { validatePptxOutput };
export type { PptxValidationOptions, PptxValidationResult } from './validate.js';

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
    previewUrl,
    width = 1920,
    height = 1080,
    title,
    subject,
    author,
    editableText = true,
    vectorizeShapes = true,
    extractImages: extractImagesEnabled = true,
    downloadRemoteImages = true,
    regionFallback = false,
    fontDir,
    initECharts = true,
    echartsWaitMs = 600,
    navigationTimeout = 30000,
    screenshotTimeout = 30000,
    deviceScaleFactor = 2,
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
  const remoteImageCacheDir = path.join(tempDir, 'remote-images');
  await mkdir(remoteImageCacheDir, { recursive: true });
  const remoteImageCache = new Map<string, string>();

  if (previewUrl) {
    log.info(`使用外部预览服务器: ${previewUrl}`);
  } else {
    await mkdir(assetsDest, { recursive: true });
    await writeFile(tempHtml, html, 'utf-8');

    if (assetsDir) {
      log.info(`复制静态资源: ${assetsDir} -> ${assetsDest}`);
      await cp(assetsDir, assetsDest, { recursive: true, force: true });
    }
  }

  const resolveImagePath = async (src: string, slideNo: number): Promise<string | undefined> => {
    if (src.startsWith('file:')) {
      return fileURLToPath(src);
    }

    if (/^https?:/.test(src)) {
      if (!downloadRemoteImages) {
        log.warn(`第 ${slideNo} 页跳过远程图片: ${src}`);
        return undefined;
      }
      const cached = remoteImageCache.get(src);
      if (cached) return cached;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(src, { signal: controller.signal });
        clearTimeout(timeout);
        if (!res.ok) {
          log.warn(`第 ${slideNo} 页远程图片下载失败 (${res.status}): ${src}`);
          return undefined;
        }
        const buf = Buffer.from(await res.arrayBuffer());
        const ext = inferImageExt(res.headers.get('content-type') || '', src);
        const name = `${createHash('sha256').update(src).digest('hex').slice(0, 16)}.${ext}`;
        const dest = path.join(remoteImageCacheDir, name);
        await writeFile(dest, buf);
        remoteImageCache.set(src, dest);
        log.debug(`第 ${slideNo} 页下载远程图片: ${src} -> ${dest}`);
        return dest;
      } catch (err) {
        log.warn(`第 ${slideNo} 页远程图片下载异常: ${src}`, err);
        return undefined;
      }
    }

    if (src.startsWith('data:')) {
      log.warn(`第 ${slideNo} 页跳过 data URI 图片`);
      return undefined;
    }

    return src;
  };

  function inferImageExt(contentType: string, url: string): string {
    const mime = contentType.split(';')[0].trim().toLowerCase();
    if (mime === 'image/png') return 'png';
    if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpg';
    if (mime === 'image/webp') return 'webp';
    if (mime === 'image/gif') return 'gif';
    if (mime === 'image/svg+xml') return 'svg';
    const ext = path.extname(new URL(url, 'http://localhost').pathname).slice(1).toLowerCase();
    if (ext) return ext;
    return 'png';
  }

  let browser;
  try {
    log.info('启动 Playwright Chromium');
    browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor });
    const page = await context.newPage();

    const screenshotDir = path.join(tempDir, 'screenshots');
    await mkdir(screenshotDir, { recursive: true });
    const slides: SlideData[] = [];

    page.setDefaultNavigationTimeout(navigationTimeout);
    page.setDefaultTimeout(screenshotTimeout);

    const targetUrl = previewUrl || 'file://' + tempHtml;
    log.info(`加载页面: ${targetUrl}`);
    progress({ phase: 'render', message: '加载 HTML 并等待资源就绪' });
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    // 等待字体就绪，避免文字截断或 fallback 字体导致排版偏差。
    try {
      await page.evaluate(() => document.fonts.ready);
      log.debug('document.fonts.ready 已触发');
    } catch (err) {
      log.warn('等待字体就绪失败，继续使用当前字体渲染', err);
    }

    // 全局禁用 CSS 动画/过渡，并将 theme11 的 lp-rise 固定到最终状态，
    // 避免入场动画、脉冲点等动效导致截图不稳定。
    await page.addStyleTag({
      content: `
        *, *::before, *::after { animation: none !important; transition: none !important; }
        .lp-rise, [class*="lp-rise"] { opacity: 1 !important; transform: none !important; }
      `,
    });

    // 等待所有 <img> 图片加载完成，避免占位图与真实图切换导致像素漂移。
    try {
      await page.evaluate(async () => {
        const imgs = Array.from(document.images).filter((img) => !img.complete);
        await Promise.all(
          imgs.map(
            (img) =>
              new Promise<void>((resolve) => {
                img.addEventListener('load', () => resolve(), { once: true });
                img.addEventListener('error', () => resolve(), { once: true });
              }),
          ),
        );
      });
      log.debug('图片资源已加载');
    } catch (err) {
      log.warn('等待图片加载失败，继续导出', err);
    }

    if (initECharts) {
      progress({ phase: 'render', message: '初始化 ECharts 图表' });
      try {
        await page.evaluate(async () => {
          if (typeof window.__lemonPPT_initECharts === 'function') {
            await window.__lemonPPT_initECharts();
          }
        });
        // 等待每个 ECharts 容器真正出现 SVG/Canvas，确保异步渲染完成。
        try {
          await page.waitForFunction(
            () => {
              const containers = document.querySelectorAll('[data-lp-echart-type]');
              if (containers.length === 0) return true;
              const rendered = document.querySelectorAll('[data-lp-echart-type] svg, [data-lp-echart-type] canvas');
              return rendered.length >= containers.length;
            },
            { timeout: 10000, polling: 100 },
          );
        } catch {
          log.warn('等待 ECharts 渲染完成超时');
        }
        // 关闭所有 ECharts 动画，并强制重绘到最终状态，避免入场动画导致像素漂移。
        try {
          await page.evaluate(() => {
            document.querySelectorAll('[data-lp-echart-type]').forEach((el) => {
              const inst = (el as HTMLElement).__lpEChartInstance;
              if (!inst) return;
              const opt = inst.getOption?.();
              if (!opt) return;
              opt.animation = false;
              opt.animationDuration = 0;
              inst.clear?.();
              inst.setOption?.(opt, true);
            });
          });
          log.debug('已禁用 ECharts 动画并重绘');
        } catch (err) {
          log.warn('禁用 ECharts 动画失败', err);
        }
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
          // 强制结束当前页所有 CSS 动画/过渡，避免入场动画导致元素仍不可见。
          void document.body.offsetHeight;
          document.getAnimations().forEach((animation) => {
            try { animation.finish(); } catch {}
          });
        },
        i,
      );

      // 给浏览器一帧时间，让 finish() 与全局禁用样式生效后再继续提取/截图。
      await new Promise((resolve) => setTimeout(resolve, 200));

      const wrapper = page.locator(`.lp-slide-wrapper[data-slide-index="${i}"]`);

      let textBoxes: TextBox[] = [];
      let shapes: ShapeOverlay[] = [];
      let images: ImageOverlay[] = [];
      let fallbackRegions: FallbackRegion[] = [];

      if (regionFallback) {
        // 先识别复杂区域，后续文字/形状/图片提取会据此决定是否在区域内隐藏。
        fallbackRegions = await page.evaluate((idx) => detectFallbackRegions(idx), i);
      }
      if (editableText) {
        // 先提取文字并隐藏原始文字，再截图，避免底层截图文字与叠加文字重影。
        // 复杂区域内部的文字也会被提取，稍后区域截图中文字保持隐藏，再通过文本框叠加恢复可编辑性。
        textBoxes = await page.evaluate((idx) => extractTextBoxes(idx, true), i);
      }
      if (vectorizeShapes) {
        // 在文字提取之后提取简单图形，避免隐藏父容器后无法获取内部文字。
        shapes = await page.evaluate((idx) => extractVectorizableShapes(idx, true), i);
      }
      if (extractImagesEnabled) {
        // 提取 <img> 并在截图中隐藏，避免重复绘制；复杂区域内的图片由区域截图保留。
        images = await page.evaluate((idx) => extractImages(idx, true), i);
      }
      if (regionFallback && fallbackRegions.length > 0) {
        // 整页截图前隐藏复杂区域，稍后单独截图并叠加。
        await page.evaluate((idx) => hideFallbackRegions(idx), i);
      }

      // 启用区域级 fallback 且有复杂区域时，整页背景改用 JPEG 压缩，复杂区域单独用 PNG 保留质量，从而整体体积下降。
      const useJpegBackground = regionFallback && fallbackRegions.length > 0;
      const screenshotPath = path.join(screenshotDir, useJpegBackground ? `slide-${i}.jpg` : `slide-${i}.png`);

      progress({ phase: 'screenshot', current: i + 1, total: slideCount, message: `截取第 ${i + 1}/${slideCount} 页` });
      try {
        if (useJpegBackground) {
          await wrapper.screenshot({ path: screenshotPath, type: 'jpeg', quality: 90, timeout: screenshotTimeout });
        } else {
          await wrapper.screenshot({ path: screenshotPath, type: 'png', timeout: screenshotTimeout });
        }
      } catch (err) {
        log.error(`第 ${i + 1} 页截图失败`, err);
        throw new Error(`第 ${i + 1} 页截图失败: ${err instanceof Error ? err.message : String(err)}`);
      }

      // 区域级 alpha-matte：对复杂区域单独截图并叠加。
      const failedRegionIndices: number[] = [];
      if (regionFallback && fallbackRegions.length > 0) {
        // 恢复复杂区域可见性；文字仍保持隐藏（将在最后统一恢复并叠加为文本框）。
        await page.evaluate((idx) => showFallbackRegions(idx), i);

        for (let r = 0; r < fallbackRegions.length; r++) {
          const region = fallbackRegions[r];
          const regionPath = path.join(screenshotDir, `slide-${i}-region-${r}.png`);
          try {
            // 通过 data-lp-region-fallback 属性定位到具体元素并截图。
            const regionEl = page.locator(`.lp-slide-wrapper[data-slide-index="${i}"] [data-lp-region-fallback="true"]`).nth(r);
            await regionEl.screenshot({ path: regionPath, type: 'png', timeout: screenshotTimeout });
            region.path = regionPath;
          } catch (err) {
            log.warn(`第 ${i + 1} 页区域 ${r + 1} 单独截图失败，将回退到整页裁剪`, err);
            failedRegionIndices.push(r);
          }
        }
      }

      // 对单独截图失败的区域，回退到恢复所有样式后按整页裁剪，保证不出现空白。
      if (failedRegionIndices.length > 0) {
        await page.evaluate(() => restoreOverlayStyles());
        for (const r of failedRegionIndices) {
          const region = fallbackRegions[r];
          const regionPath = path.join(screenshotDir, `slide-${i}-region-${r}-fallback.png`);
          try {
            await page.screenshot({
              path: regionPath,
              type: 'png',
              clip: { x: region.x, y: region.y, width: region.w, height: region.h },
              timeout: screenshotTimeout,
            });
            region.path = regionPath;
            region.imageOnly = true;
          } catch (err) {
            log.warn(`第 ${i + 1} 页区域 ${r + 1} 整页裁剪也失败，跳过该区域`, err);
            region.path = '';
          }
        }

        // 回退区域已包含文字/图形/图片，避免再叠加造成重影。
        const isInsideFailedRegion = (item: { x: number; y: number; w: number; h: number }) => {
          const cx = item.x + item.w / 2;
          const cy = item.y + item.h / 2;
          return failedRegionIndices.some((idx) => {
            const r = fallbackRegions[idx];
            return cx >= r.x && cx <= r.x + r.w && cy >= r.y && cy <= r.y + r.h;
          });
        };
        textBoxes = textBoxes.filter((t) => !isInsideFailedRegion(t));
        shapes = shapes.filter((s) => !isInsideFailedRegion(s));
        images = images.filter((img) => !isInsideFailedRegion(img));
      }

      if (editableText || vectorizeShapes || extractImagesEnabled || regionFallback) {
        // 恢复被隐藏的文字/图形/图片/区域样式，避免影响下一页提取。
        await page.evaluate(() => restoreOverlayStyles());
      }

      log.debug(`第 ${i + 1} 页: ${textBoxes.length} 文本框, ${shapes.length} 形状, ${images.length} 图片, ${fallbackRegions.length} 区域`);
      slides.push({ path: screenshotPath, textBoxes, shapes, images, fallbackRegions });
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
      imageResolver: resolveImagePath,
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
  imageResolver?: (src: string, slideNo: number) => Promise<string | undefined>;
}

async function buildPPTX(options: BuildPPTXOptions): Promise<Buffer> {
  const { slides, width, height, title, subject, author, fontDir, log, progress, imageResolver } = options;

  // 设计稿以 1280×720 为基准，1280px 对应 10 英寸；高分辨率导出时保持相同像素密度。
  const pxToIn = (px: number) => (px * 10) / 1280;

  const EnhancedPptxGenJS = withPPTXEmbedFonts(PptxGenJS);
  const pptx = new EnhancedPptxGenJS();

  pptx.defineLayout({ name: 'CUSTOM', width: pxToIn(width), height: pxToIn(height) });
  pptx.layout = 'CUSTOM';

  if (title) pptx.title = title;
  if (subject) pptx.subject = subject;
  if (author) pptx.author = author;

  const fontRegistry = fontDir ? buildFontRegistry(fontDir) : {};
  const embeddableFonts = new Map<string, string>();
  const missingFonts = new Set<string>();

  for (let i = 0; i < slides.length; i++) {
    const { path: screenshotPath, textBoxes, shapes, images, fallbackRegions } = slides[i];
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

      if (shape.type === 'customPath' && shape.points && shape.points.length >= 2) {
        const EMU = 914400;
        const pathW = pxToIn(shape.w) * EMU;
        const pathH = pxToIn(shape.h) * EMU;
        const points = shape.points.map((p) => {
          if ('close' in p) return { close: true };
          if ('curve' in p) return p;
          return { x: p.x * pathW, y: p.y * pathH, moveTo: p.moveTo };
        });
        slide.addShape('custGeom' as any, { ...opts, points: points as any });
      } else {
        const ShapeType = (pptx as any).ShapeType;
        const shapeType =
          shape.type === 'roundRect'
            ? ShapeType.roundRect
            : shape.type === 'ellipse'
              ? ShapeType.ellipse
              : ShapeType.line;
        slide.addShape(shapeType, opts);
      }
    }

    // 添加复杂区域截图覆盖层（alpha-matte），填补整页截图中的“洞”。
    if (fallbackRegions) {
      for (const region of fallbackRegions) {
        if (!region.path || !existsSync(region.path)) continue;
        try {
          slide.addImage({
            path: region.path,
            x: pxToIn(region.x),
            y: pxToIn(region.y),
            w: pxToIn(region.w),
            h: pxToIn(region.h),
          });
        } catch (err) {
          log.warn(`第 ${i + 1} 页区域截图添加失败: ${region.path}`, err);
        }
      }
    }

    // 添加图片覆盖层
    for (const img of images) {
      const imagePath = imageResolver ? await imageResolver(img.src, i + 1) : img.src;
      if (!imagePath) continue;

      try {
        slide.addImage({
          path: imagePath,
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

function isInsideFallbackRegion(el) {
  let node = el;
  while (node) {
    if (node.getAttribute && node.getAttribute('data-lp-region-fallback') === 'true') return true;
    node = node.parentElement;
  }
  return false;
}

function getExportScale() {
  const slide = document.querySelector('.lp-slide');
  if (!slide) return 1;
  const zoom = window.getComputedStyle(slide).zoom;
  return parseFloat(zoom) || 1;
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

  const scale = getExportScale();
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

    const text = (el.innerText || el.textContent || '').trim();
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
      fontSize: fontSizePx * 0.75 * scale,
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

function parseSimpleSvgPath(d) {
  if (!d) return null;
  const parts = d.trim().replace(/([MmLlHhVvZz])/g, ' $1 ').trim().split(/\s+/);
  const points = [];
  let x = 0, y = 0, startX = 0, startY = 0;
  let cmd = null;
  for (let i = 0; i < parts.length; i++) {
    const token = parts[i];
    if (/^[MmLlHhVvZz]$/.test(token)) {
      cmd = token;
      if (cmd === 'Z' || cmd === 'z') {
        points.push({ close: true });
        cmd = null;
      }
      continue;
    }
    const val = parseFloat(token);
    if (Number.isNaN(val)) continue;
    if (cmd === 'M' || cmd === 'm') {
      const isRel = cmd === 'm';
      x = isRel ? x + val : val;
      y = isRel ? y + parseFloat(parts[++i] || 0) : parseFloat(parts[++i] || 0);
      startX = x; startY = y;
      points.push({ x, y, moveTo: true });
      cmd = cmd === 'M' ? 'L' : 'l';
    } else if (cmd === 'L' || cmd === 'l') {
      const isRel = cmd === 'l';
      x = isRel ? x + val : val;
      y = isRel ? y + parseFloat(parts[++i] || 0) : parseFloat(parts[++i] || 0);
      points.push({ x, y });
    } else if (cmd === 'H' || cmd === 'h') {
      x = cmd === 'h' ? x + val : val;
      points.push({ x, y });
    } else if (cmd === 'V' || cmd === 'v') {
      y = cmd === 'v' ? y + val : val;
      points.push({ x, y });
    }
  }
  // 仅接受简单路径：只含 M/L/H/V/Z
  if (points.length < 2) return null;
  return points;
}

function extractSvgShapes(slideIndex, markElements) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return [];
  const wrapperRect = wrapper.getBoundingClientRect();
  const shapes = [];

  wrapper.querySelectorAll('svg').forEach((svg) => {
      if (isIgnoredElement(svg)) return;
      // ECharts 图表及已标记为 fallback 区域内部的 SVG 不做强制矢量化
      if (svg.hasAttribute('data-lp-echart-type')) return;
      if (isInsideFallbackRegion(svg)) return;
      const svgRect = svg.getBoundingClientRect();
    if (svgRect.width < 2 || svgRect.height < 2) return;

    const svgStyle = window.getComputedStyle(svg);
    if (svgStyle.display === 'none' || svgStyle.visibility === 'hidden' || parseFloat(svgStyle.opacity) === 0) return;

    const svgShapes = [];
    svg.querySelectorAll('path, rect, circle, ellipse, line, polygon, polyline').forEach((el) => {
      const tag = el.tagName.toLowerCase();
      let points = null;
      let fill = rgbToHex(el.getAttribute('fill') || svgStyle.fill);
      let stroke = rgbToHex(el.getAttribute('stroke') || svgStyle.stroke);
      let strokeWidth = parseFloat(el.getAttribute('stroke-width')) || parseFloat(svgStyle.strokeWidth) || 0;

      if (tag === 'rect') {
        const x = parseFloat(el.getAttribute('x')) || 0;
        const y = parseFloat(el.getAttribute('y')) || 0;
        const w = parseFloat(el.getAttribute('width')) || svgRect.width;
        const h = parseFloat(el.getAttribute('height')) || svgRect.height;
        points = [
          { x, y, moveTo: true },
          { x: x + w, y },
          { x: x + w, y: y + h },
          { x, y: y + h },
          { close: true },
        ];
      } else if (tag === 'circle') {
        const cx = parseFloat(el.getAttribute('cx')) || svgRect.width / 2;
        const cy = parseFloat(el.getAttribute('cy')) || svgRect.height / 2;
        const r = parseFloat(el.getAttribute('r')) || Math.min(svgRect.width, svgRect.height) / 2;
        // 用 8 段线段近似圆
        const seg = 8;
        for (let i = 0; i < seg; i++) {
          const a = (i * 2 * Math.PI) / seg;
          points = points || [];
          points.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), moveTo: i === 0 });
        }
        points.push({ close: true });
      } else if (tag === 'ellipse') {
        const cx = parseFloat(el.getAttribute('cx')) || svgRect.width / 2;
        const cy = parseFloat(el.getAttribute('cy')) || svgRect.height / 2;
        const rx = parseFloat(el.getAttribute('rx')) || svgRect.width / 2;
        const ry = parseFloat(el.getAttribute('ry')) || svgRect.height / 2;
        const seg = 8;
        for (let i = 0; i < seg; i++) {
          const a = (i * 2 * Math.PI) / seg;
          points = points || [];
          points.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), moveTo: i === 0 });
        }
        points.push({ close: true });
      } else if (tag === 'line') {
        points = [
          { x: parseFloat(el.getAttribute('x1')) || 0, y: parseFloat(el.getAttribute('y1')) || 0, moveTo: true },
          { x: parseFloat(el.getAttribute('x2')) || 0, y: parseFloat(el.getAttribute('y2')) || 0 },
        ];
      } else if (tag === 'polygon' || tag === 'polyline') {
        const raw = el.getAttribute('points') || '';
        const nums = raw.trim().split(/[\s,]+/).filter(Boolean).map(parseFloat);
        for (let i = 0; i < nums.length; i += 2) {
          points = points || [];
          points.push({ x: nums[i], y: nums[i + 1], moveTo: i === 0 });
        }
        if (tag === 'polygon') points.push({ close: true });
      } else if (tag === 'path') {
        points = parseSimpleSvgPath(el.getAttribute('d'));
      }

      if (!points || points.length < 2) return;

      // 计算局部 bbox
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of points) {
        if ('close' in p || 'curve' in p) continue;
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
      const pw = maxX - minX || 1;
      const ph = maxY - minY || 1;

      // 归一化为相对于局部 bbox 的百分比
      const normPoints = points.map((p) => {
        if ('close' in p) return { close: true };
        if ('curve' in p) return p;
        return { x: (p.x - minX) / pw, y: (p.y - minY) / ph, moveTo: p.moveTo };
      });

      svgShapes.push({
        type: 'customPath',
        x: svgRect.left - wrapperRect.left + (minX / svgRect.width) * svgRect.width,
        y: svgRect.top - wrapperRect.top + (minY / svgRect.height) * svgRect.height,
        w: pw,
        h: ph,
        fill,
        lineColor: stroke,
        lineWidth: strokeWidth,
        points: normPoints,
      });
    });

    if (svgShapes.length > 0) {
      shapes.push(...svgShapes);
      if (markElements) {
        const original = JSON.parse(svg.getAttribute('data-lp-overlay') || '{}');
        original.opacity = svg.style.getPropertyValue('opacity');
        svg.style.setProperty('opacity', '0', 'important');
        svg.setAttribute('data-lp-overlay', JSON.stringify(original));
      }
    }
  });

  return shapes;
}

function hasComplexGradient(el) {
  const style = window.getComputedStyle(el);
  const bg = style.backgroundImage;
  return bg && bg !== 'none' && /linear-gradient|radial-gradient|conic-gradient|repeating/.test(bg);
}

function splitFilterFunctions(filter) {
  const fns = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < filter.length; i++) {
    if (filter[i] === '(') depth++;
    else if (filter[i] === ')') {
      depth--;
      if (depth === 0) {
        fns.push(filter.slice(start, i + 1).trim());
        start = i + 1;
      }
    }
  }
  return fns;
}

function hasFilterOrComplexClip(el) {
  const style = window.getComputedStyle(el);
  if (style.clipPath && style.clipPath !== 'none') return true;
  if (!style.filter || style.filter === 'none') return false;
  // drop-shadow 在主题装饰中很常见，其效果可通过 PPTX 阴影近似；
  // 仅当存在其他滤镜（blur/brightness/hue-rotate/url 等）时才视为必须截图的复杂元素。
  const filters = splitFilterFunctions(style.filter);
  return filters.some((f) => !f.startsWith('drop-shadow'));
}

function pushFallbackRegion(regions, regionEls, el, wrapperRect) {
  if (isInsideFallbackRegion(el)) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width < 4 || rect.height < 4) return false;
  if (rect.width > wrapperRect.width * 0.98 && rect.height > wrapperRect.height * 0.98) return false;

  regions.push({
    x: rect.left - wrapperRect.left,
    y: rect.top - wrapperRect.top,
    w: rect.width,
    h: rect.height,
    selector: el.className || el.tagName.toLowerCase(),
  });

  el.setAttribute('data-lp-region-fallback', 'true');
  regionEls.push(el);
  return true;
}

function detectFallbackRegions(slideIndex) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return [];
  const wrapperRect = wrapper.getBoundingClientRect();
  const regions = [];
  const regionEls = [];

  const selectors = [
    '.lp-fallback-region',
    'canvas',
    'svg',
    '[data-lp-region-fallback]',
    // 数据表格/对比表格类容器统一走截图，避免被拆成零散文本框
    'table',
    '.lp-table-data-wrap',
    '.lp-comparison-v3-table',
  ];
  wrapper.querySelectorAll(selectors.join(',')).forEach((el) => {
    // 已在其他 fallback 区域内则跳过，避免重复截图。
    if (regionEls.some((r) => r !== el && r.contains(el))) return;

    // SVG：ECharts 图表强制走区域截图；其它 SVG 仅当无法简单矢量化时才作为 fallback region
    if (el.tagName.toLowerCase() === 'svg') {
      if (!el.hasAttribute('data-lp-echart-type')) {
        const shapes = extractSvgShapes(slideIndex, false);
        if (shapes.length > 0) return; // 已可矢量化，不再截图
      }
    }

    pushFallbackRegion(regions, regionEls, el, wrapperRect);
  });

  // 补充识别未显式标记但带有滤镜、复杂裁剪等效果的元素（渐变背景暂不走自动 fallback，避免主题装饰被过度截图）。
  wrapper.querySelectorAll('*').forEach((el) => {
    if (regionEls.some((r) => r !== el && r.contains(el))) return;
    if (!hasFilterOrComplexClip(el)) return;
    const parent = el.parentElement;
    if (parent && hasFilterOrComplexClip(parent)) return;
    pushFallbackRegion(regions, regionEls, el, wrapperRect);
  });

  return regions;
}

function hideFallbackRegions(slideIndex) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return;
  wrapper.querySelectorAll('[data-lp-region-fallback="true"]').forEach((el) => {
    const original = JSON.parse(el.getAttribute('data-lp-overlay') || '{}');
    original.opacity = el.style.getPropertyValue('opacity');
    el.style.setProperty('opacity', '0', 'important');
    el.setAttribute('data-lp-overlay', JSON.stringify(original));
  });
}

function showFallbackRegions(slideIndex) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return;
  wrapper.querySelectorAll('[data-lp-region-fallback="true"]').forEach((el) => {
    const original = JSON.parse(el.getAttribute('data-lp-overlay') || '{}');
    if (original.opacity !== undefined && original.opacity !== '') {
      el.style.setProperty('opacity', original.opacity, 'important');
    } else {
      el.style.removeProperty('opacity');
    }
  });
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
    // 已标记为复杂区域（表格/图表等）的元素将由区域截图保留，不再拆成矢量形状。
    if (isInsideFallbackRegion(el)) continue;

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

  // 叠加 SVG 可矢量化形状
  const svgShapes = extractSvgShapes(slideIndex, markElements);
  shapes.push(...svgShapes);

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
    // 复杂区域（如图表/表格）内部的图片由区域截图保留，不再单独提取。
    if (isInsideFallbackRegion(el)) return;
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return;

    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    const rawSrc = el.getAttribute('src');
    if (!rawSrc || rawSrc.startsWith('data:')) return; // data URI 暂不支持直接引用

    // 将相对路径解析为绝对 file:// URL，便于 Node 端读取。
    let src;
    try {
      src = new URL(rawSrc, window.location.href).href;
    } catch {
      src = rawSrc;
    }

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
