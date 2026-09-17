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
import { buildFontRegistry } from './fonts/font-cache.js';

declare global {
  interface Window {
    __lemonPPT_initECharts?: (theme?: string, root?: Element | null) => Promise<void>;
    echarts?: any;
  }

  interface HTMLElement {
    __lpEChartInstance?: any;
  }

  function extractTextBoxes(slideIndex: number, markElements?: boolean): {
    boxes: TextBox[];
    warnings: Array<{ slide: number; type: string; detail?: string }>;
  };
  function extractVectorizableShapes(slideIndex: number, markElements?: boolean, applyCssEffects?: boolean): ShapeOverlay[];
  function extractImages(slideIndex: number, markElements?: boolean): ImageOverlay[];
  function detectFallbackRegions(slideIndex: number): {
    regions: Array<{ x: number; y: number; w: number; h: number; selector?: string }>;
    warnings: Array<{ slide: number; type: string; detail?: string }>;
  };
  function computeSlideSignature(slideIndex: number): string;
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

/** 导出警告类型（质量报告可观测性） */
export type ExportWarningType =
  | 'region-screenshot-failed' // 区域单独截图失败（已回退整页裁剪）
  | 'region-cropped-from-fullpage' // 区域走整页裁剪降级
  | 'region-skipped' // 区域截图与裁剪均失败（页面可能出现空白洞）
  | 'region-decorative-skipped' // 装饰性元素被排除出 fallback 区域
  | 'complex-svg-unsupported' // SVG 命中无法矢量化的复杂特性，走截图
  | 'chart-region-text-kept' // 图表区域内小字保留在截图中（未抽文本框）
  | 'decorative-text-skipped' // 装饰性文本被过滤（不导出为文本框）
  | 'font-not-embedded' // 字体未在 fontDir 中找到，使用安全映射/系统回退
  | 'content-unstable'; // 内容签名在轮询窗口内未稳定（可能截到加载/动画中间态）

export interface ExportWarning {
  /** 1-based 页码 */
  slide: number;
  type: ExportWarningType;
  detail?: string;
}

export interface SlideSummary {
  slide: number;
  textBoxes: number;
  shapes: number;
  images: number;
  fallbackRegions: number;
  /** 页面可编辑保真度 = 1 - min(1, 内容区域截图面积/页面面积)。装饰保护区(kind=decoration)不计入，避免 fidelity 被 blur blob 等设计元素低估。 */
  fidelity: number;
}

export interface ExportReport {
  captureMode: 'dom-to-pptx';
  slideCount: number;
  slideSummaries: SlideSummary[];
  warnings: ExportWarning[];
  /** 全局 fidelity = 各页平均 */
  fidelity: number;
  textObjects: number;
  shapeObjects: number;
  imageObjects: number;
  regionObjects: number;
  /** 实际嵌入的字体家族列表（阶段 4 字体缓存增强后可观测性） */
  embeddedFonts?: string[];
}

export interface ExportDomToPptxResult {
  buffer: Buffer;
  report: ExportReport;
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
  /** 是否将 CSS 高级效果（box-shadow 等）同步矢量化到 shape，默认 true */
  vectorizeCssEffects?: boolean;
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
  /** 字体缓存目录，可选。作为 fontDir 的补充 fallback，常用于内置公共字体缓存 */
  fontCacheDir?: string;
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
  /** 是否在截图前进行内容签名稳定检测（连续两次签名一致才截图），默认 true */
  stabilityCheck?: boolean;
  /** 内容签名轮询间隔毫秒数，默认 120 */
  stabilityPollMs?: number;
  /** 内容签名轮询最大次数，默认 25（约 3 秒）。超时记录 content-unstable 警告并继续导出 */
  stabilityMaxPolls?: number;
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
  /** 字距（pt），letterSpacing px × 0.5625 换算 */
  charSpacing?: number;
  /** 行距倍数，lineHeight px / fontSize px */
  lineSpacingMultiple?: number;
  underline?: boolean;
  strike?: boolean;
  /** 透明度 0-100，颜色 alpha × opacity 合成 */
  transparency?: number;
  /** 是否含 CJK 字符（字号系数选择依据） */
  hasCJK?: boolean;
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
  /** 矢量化 outer box-shadow（阶段 3） */
  shadow?: {
    type: 'outer';
    color: string;
    opacity: number;
    blur: number;
    angle: number;
    offset: number;
  };
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
  /** 区域类型，用于 fidelity 计算区分内容区与装饰保护区 */
  kind?: 'chart' | 'table' | 'decoration' | 'generic';
}

interface SlideData {
  path: string;
  textBoxes: TextBox[];
  shapes: ShapeOverlay[];
  images: ImageOverlay[];
  fallbackRegions: FallbackRegion[];
  /** 本页质量警告（区域降级、装饰过滤等） */
  warnings: ExportWarning[];
}

export { validatePptxOutput };
export type { PptxValidationOptions, PptxValidationResult } from './validate.js';

// 阶段 2 CDP 提取 POC（实验性）
export * as cdpExtraction from './extraction/cdp.js';

// 阶段 3 CSS 高级效果矢量化（实验性）
export {
  classifyGradient,
  parseBoxShadow,
  parseClipPath,
  parseCssColor,
  parseCssLength,
  parseLinearGradient,
  gradientToPptxFill,
  shadowToPptxOptions,
  type GradientKind,
  type ParsedGradient,
  type ParsedGradientStop,
  type ParsedShadow,
  type ParsedClipPath,
  type PptxGradientFill,
  type PptxShadowOptions,
} from './css-effects.js';

/**
 * DOM-to-PPTX 导出引擎（阶段 5）。
 *
 * 输入已渲染好的 HTML 字符串（含 CSS 变量、字体、脚本引用），
 * 用 Playwright 渲染后逐页截图，并将文字/简单图形/图片抽回为可编辑 PPTX 元素。
 * 返回 PPTX 文件 Buffer。
 */
export async function exportDomToPptx(options: ExportDomToPptxOptions): Promise<ExportDomToPptxResult> {
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
    vectorizeCssEffects = true,
    extractImages: extractImagesEnabled = true,
    downloadRemoteImages = true,
    regionFallback = false,
    fontDir,
    fontCacheDir,
    initECharts = true,
    echartsWaitMs = 600,
    navigationTimeout = 30000,
    screenshotTimeout = 30000,
    deviceScaleFactor = 2,
    stabilityCheck = true,
    stabilityPollMs = 120,
    stabilityMaxPolls = 25,
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
      let slideWarnings: ExportWarning[] = [];

      // P1-2 内容签名稳定检测：轮询签名直至连续两次一致，避免截到懒加载/字体迟到/动画中间态。
      // 注意：必须在任何 DOM 修改（隐藏文字/标记区域）之前采集，否则签名必然不一致。
      if (stabilityCheck) {
        let stable = false;
        let lastSig = await page.evaluate((idx) => computeSlideSignature(idx), i);
        for (let poll = 1; poll <= stabilityMaxPolls; poll++) {
          await page.waitForTimeout(stabilityPollMs);
          const sig = await page.evaluate((idx) => computeSlideSignature(idx), i);
          if (sig === lastSig) {
            stable = true;
            break;
          }
          lastSig = sig;
        }
        if (!stable) {
          slideWarnings.push({
            slide: i + 1,
            type: 'content-unstable',
            detail: `签名在 ${stabilityMaxPolls} 次轮询（${stabilityPollMs}ms 间隔）内未稳定`,
          });
          log.warn(`第 ${i + 1} 页内容签名未稳定，继续导出（可能存在未完成的懒加载或动画）`);
        }
      }

      if (regionFallback) {
        // 先识别复杂区域，后续文字/形状/图片提取会据此决定是否在区域内隐藏。
        const regionResult = await page.evaluate((idx) => detectFallbackRegions(idx), i);
        fallbackRegions = regionResult.regions;
        slideWarnings.push(...(regionResult.warnings as ExportWarning[]));
      }
      if (editableText) {
        // 先提取文字并隐藏原始文字，再截图，避免底层截图文字与叠加文字重影。
        // 复杂区域内部的文字也会被提取，稍后区域截图中文字保持隐藏，再通过文本框叠加恢复可编辑性。
        // P0-2：装饰性文本（水印/描边字/旋转小字）与图表区域内小字被过滤并记录警告。
        const textResult = await page.evaluate((idx) => extractTextBoxes(idx, true), i);
        textBoxes = textResult.boxes;
        slideWarnings.push(...(textResult.warnings as ExportWarning[]));
      }
      if (vectorizeShapes) {
        // 在文字提取之后提取简单图形，避免隐藏父容器后无法获取内部文字。
        shapes = await page.evaluate(
          ({ idx, applyCssEffects }) => extractVectorizableShapes(idx, true, applyCssEffects),
          { idx: i, applyCssEffects: vectorizeCssEffects },
        );
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
          await wrapper.screenshot({ path: screenshotPath, type: 'jpeg', quality: 90, timeout: screenshotTimeout, animations: 'disabled' });
        } else {
          await wrapper.screenshot({ path: screenshotPath, type: 'png', timeout: screenshotTimeout, animations: 'disabled' });
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
            await regionEl.screenshot({ path: regionPath, type: 'png', timeout: screenshotTimeout, animations: 'disabled' });
            region.path = regionPath;
          } catch (err) {
            log.warn(`第 ${i + 1} 页区域 ${r + 1} 单独截图失败，将回退到整页裁剪`, err);
            slideWarnings.push({
              slide: i + 1,
              type: 'region-screenshot-failed',
              detail: `region ${r + 1}`,
            });
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
            slideWarnings.push({
              slide: i + 1,
              type: 'region-cropped-from-fullpage',
              detail: `region ${r + 1}`,
            });
          } catch (err) {
            log.warn(`第 ${i + 1} 页区域 ${r + 1} 整页裁剪也失败，跳过该区域`, err);
            region.path = '';
            slideWarnings.push({
              slide: i + 1,
              type: 'region-skipped',
              detail: `region ${r + 1}`,
            });
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
      slides.push({ path: screenshotPath, textBoxes, shapes, images, fallbackRegions, warnings: slideWarnings });
    }

    progress({ phase: 'build', message: '组装 PPTX' });
    const { buffer, report } = await buildPPTX({
      slides,
      width,
      height,
      title,
      subject,
      author,
      fontDir,
      fontCacheDir,
      log,
      progress,
      imageResolver: resolveImagePath,
    });

    progress({ phase: 'done', message: 'PPTX 生成完成' });
    log.info(
      `导出报告: ${report.slideCount} 页, 平均保真度 ${(report.fidelity * 100).toFixed(1)}%, ` +
        `文本 ${report.textObjects} / 形状 ${report.shapeObjects} / 图片 ${report.imageObjects} / 区域 ${report.regionObjects}` +
        (report.warnings.length > 0 ? `, 警告 ${report.warnings.length} 条` : ''),
    );
    return { buffer, report };
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
  fontCacheDir?: string;
  log: Logger;
  progress: (p: ExportProgress) => void;
  imageResolver?: (src: string, slideNo: number) => Promise<string | undefined>;
}

async function buildPPTX(options: BuildPPTXOptions): Promise<{ buffer: Buffer; report: ExportReport }> {
  const { slides, width, height, title, subject, author, fontDir, fontCacheDir, log, progress, imageResolver } = options;

  // 设计稿以 1280×720 为基准，1280px 对应 10 英寸；高分辨率导出时保持相同像素密度。
  const pxToIn = (px: number) => (px * 10) / 1280;

  const EnhancedPptxGenJS = withPPTXEmbedFonts(PptxGenJS);
  const pptx = new EnhancedPptxGenJS();

  pptx.defineLayout({ name: 'CUSTOM', width: pxToIn(width), height: pxToIn(height) });
  pptx.layout = 'CUSTOM';

  if (title) pptx.title = title;
  if (subject) pptx.subject = subject;
  if (author) pptx.author = author;

  const fontRegistry = await buildFontRegistryWithFallback(fontDir, fontCacheDir);
  const embeddableFonts = new Map<string, string>();
  const missingFonts = new Set<string>();
  const fontWarnings: ExportWarning[] = [];
  const reportedFontKeys = new Set<string>();

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
      if (shape.shadow) {
        opts.shadow = {
          type: 'outer',
          color: shape.shadow.color,
          opacity: shape.shadow.opacity,
          blur: shape.shadow.blur,
          angle: shape.shadow.angle,
          offset: shape.shadow.offset,
        };
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
      } else if (fontDir || fontCacheDir) {
        const firstFamily = box.fontFamilies[0]?.replace(/['"]/g, '').trim();
        // 已命中安全字体映射或首字体本身就在安全栈中 → 不报 missing（系统回退可接受）
        if (firstFamily && (fontFace !== firstFamily || findSafeFontFace(firstFamily))) {
          // safe-mapped, no warning
        } else if (firstFamily) {
          missingFonts.add(firstFamily);
          const key = `${i + 1}:${firstFamily}`;
          if (!reportedFontKeys.has(key)) {
            reportedFontKeys.add(key);
            fontWarnings.push({ slide: i + 1, type: 'font-not-embedded', detail: firstFamily });
          }
        }
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
        ...(box.charSpacing ? { charSpacing: box.charSpacing } : {}),
        ...(box.lineSpacingMultiple ? { lineSpacingMultiple: box.lineSpacingMultiple } : {}),
        ...(box.underline ? { underline: { style: 'sng' } } : {}),
        ...(box.strike ? { strike: true } : {}),
        ...(box.transparency ? { transparency: box.transparency } : {}),
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
  const buffer = await readFile(outFile);

  // 生成质量报告：每页 fidelity = 1 - min(1, 内容区域截图面积 / 页面面积)，全局取各页平均。
  // 装饰保护区（kind='decoration'，如 blur Blob、复杂滤镜装饰）不计入，避免 fidelity 被设计装饰低估。
  const pageArea = width * height;
  const slideSummaries: SlideSummary[] = slides.map((s, idx) => {
    const contentRegionArea = s.fallbackRegions.reduce((sum, r) => {
      if (r.kind === 'decoration') return sum;
      return sum + (r.w || 0) * (r.h || 0);
    }, 0);
    const fidelity = 1 - Math.min(1, contentRegionArea / pageArea);
    return {
      slide: idx + 1,
      textBoxes: s.textBoxes.length,
      shapes: s.shapes.length,
      images: s.images.length,
      fallbackRegions: s.fallbackRegions.length,
      fidelity: Math.round(fidelity * 1000) / 1000,
    };
  });
  const report: ExportReport = {
    captureMode: 'dom-to-pptx',
    slideCount: slides.length,
    slideSummaries,
    warnings: [...slides.flatMap((s) => s.warnings), ...fontWarnings],
    fidelity:
      slideSummaries.length > 0
        ? Math.round((slideSummaries.reduce((sum, s) => sum + s.fidelity, 0) / slideSummaries.length) * 1000) / 1000
        : 1,
    textObjects: slideSummaries.reduce((sum, s) => sum + s.textBoxes, 0),
    shapeObjects: slideSummaries.reduce((sum, s) => sum + s.shapes, 0),
    imageObjects: slideSummaries.reduce((sum, s) => sum + s.images, 0),
    regionObjects: slideSummaries.reduce((sum, s) => sum + s.fallbackRegions, 0),
    embeddedFonts: Array.from(embeddableFonts.keys()).sort(),
  };
  return { buffer, report };
}

/** 保留少量硬编码映射作为最终 fallback（目录扫描失败时仍可命中常见字体）。 */
const KNOWN_FONT_FILES: Record<string, string[]> = {
  Anton: ['Anton', 'Anton-Regular.ttf'],
  Archivo: ['Archivo', 'Archivo[wdth,wght].ttf'],
  Caveat: ['Caveat', 'Caveat[wght].ttf'],
  'IBM Plex Sans': ['IBMPlexSans', 'IBMPlexSans[wdth,wght].ttf'],
  Inter: ['Inter', 'Inter[opsz,wght].ttf'],
  'JetBrains Mono': ['JetBrainsMono', 'JetBrainsMono[wght].ttf'],
  Newsreader: ['Newsreader', 'Newsreader[opsz,wght].ttf'],
  'Noto Sans SC': ['NotoSansSC', 'NotoSansSC[wght].ttf'],
  'Noto Serif SC': ['NotoSerifSC', 'NotoSerifSC[wght].ttf'],
  'Space Grotesk': ['SpaceGrotesk', 'SpaceGrotesk[wght].ttf'],
  'Space Mono': ['SpaceMono', 'SpaceMono-Regular.ttf'],
};

async function buildFontRegistryWithFallback(fontDir?: string, fontCacheDir?: string): Promise<Record<string, string>> {
  const registry = await buildFontRegistry({ fontDir, fontCacheDir });
  // 若扫描未命中但某个目录存在，补充硬编码路径作为兜底。
  const baseDirs = [fontDir, fontCacheDir].filter(Boolean) as string[];
  for (const [family, parts] of Object.entries(KNOWN_FONT_FILES)) {
    if (registry[family]) continue;
    for (const base of baseDirs) {
      const candidate = path.join(base, ...parts);
      if (existsSync(candidate)) {
        registry[family] = candidate;
        break;
      }
    }
  }
  return registry;
}

/**
 * 字体安全映射：嵌入字体未命中时，将网页字体映射到 PPT 通用安全字体栈，
 * 避免目标机器字体缺失导致乱码/回退（中文 → 微软雅黑/宋体，等宽 → Courier New）。
 */
const PPTX_SAFE_FONT_MAP: Array<[RegExp, string]> = [
  [/^(Noto Sans SC|PingFang SC|Source Han Sans.*|思源黑体|Hiragino Sans GB|Microsoft YaHei|微软雅黑)$/i, 'Microsoft YaHei'],
  [/^(Noto Serif SC|Songti SC|Source Han Serif.*|思源宋体|SimSun|宋体)$/i, 'SimSun'],
  [/^(Space Mono|JetBrains Mono|IBM Plex Mono|Menlo|Consolas|Courier New)$/i, 'Courier New'],
  [/^(Inter|Helvetica Neue|Helvetica|Arial)$/i, 'Arial'],
  // Georgia 等经典 Web 衬线字体映射到 Times New Roman（PPT 通用安全衬线字体）
  [/^(Georgia|Times New Roman|Times|Palatino|Garamond)$/i, 'Times New Roman'],
];

function findSafeFontFace(name: string): string | undefined {
  for (const [pattern, safeFace] of PPTX_SAFE_FONT_MAP) {
    if (pattern.test(name)) return safeFace;
  }
  return undefined;
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
  // 嵌入字体未命中 → 安全栈映射（跨平台稳定）
  for (const raw of fontFamilies) {
    const name = raw.replace(/['"]/g, '').trim();
    const safeFace = findSafeFontFace(name);
    if (safeFace) {
      return { fontFace: safeFace };
    }
  }
  // 最终 fallback：即使首字体命中安全映射也要转换为安全字体
  const firstFamily = fontFamilies[0]?.replace(/['"]/g, '').trim() || 'Arial';
  return { fontFace: findSafeFontFace(firstFamily) || firstFamily };
}

const EXTRACT_SCRIPT = `
const LP_ORIGINAL_PROPS = ['color', 'fill', 'stroke', 'webkitTextFillColor', 'textShadow', 'textDecoration', 'opacity', 'backgroundColor', 'borderColor', 'borderWidth', 'boxShadow'];

function rgbToHex(rgb) {
  if (!rgb || rgb === 'none') return null;
  const m = rgb.match(/rgba?\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)/);
  if (!m) return null;
  const toHex = (n) => parseInt(n, 10).toString(16).padStart(2, '0');
  return '#' + toHex(m[1]) + toHex(m[2]) + toHex(m[3]);
}

function parseCssColor(value) {
  if (!value || value === 'transparent' || value === 'none') return undefined;
  const clean = value.trim();

  if (clean.startsWith('#')) {
    let hex = clean.slice(1);
    if (hex.length === 3 || hex.length === 4) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    if (hex.length === 6) return { hex: hex.toUpperCase(), alpha: 1 };
    if (hex.length === 8) return { hex: hex.slice(0, 6).toUpperCase(), alpha: parseInt(hex.slice(6, 8), 16) / 255 };
    return undefined;
  }

  const rgbMatch = clean.match(/rgba?\\(\\s*([\\d.]+)\\s*,\\s*([\\d.]+)\\s*,\\s*([\\d.]+)\\s*(?:,\\s*([\\d.]+)\\s*)?\\)/);
  if (rgbMatch) {
    const r = Math.round(parseFloat(rgbMatch[1]));
    const g = Math.round(parseFloat(rgbMatch[2]));
    const b = Math.round(parseFloat(rgbMatch[3]));
    const alpha = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return { hex: (toHex(r) + toHex(g) + toHex(b)).toUpperCase(), alpha: Number.isNaN(alpha) ? 1 : alpha };
  }

  const srgbMatch = clean.match(/color\\(\\s*srgb\\s+([\\d.]+)\\s+([\\d.]+)\\s+([\\d.]+)\\s*(?:\\/\\s*([\\d.]+))?\\s*\\)/);
  if (srgbMatch) {
    const r = Math.round(parseFloat(srgbMatch[1]) * 255);
    const g = Math.round(parseFloat(srgbMatch[2]) * 255);
    const b = Math.round(parseFloat(srgbMatch[3]) * 255);
    const alpha = srgbMatch[4] !== undefined ? parseFloat(srgbMatch[4]) : 1;
    const toHex = (n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return { hex: (toHex(r) + toHex(g) + toHex(b)).toUpperCase(), alpha: Number.isNaN(alpha) ? 1 : alpha };
  }

  const namedColors = {
    black: '000000', white: 'FFFFFF', red: 'FF0000', green: '008000', blue: '0000FF',
    yellow: 'FFFF00', cyan: '00FFFF', magenta: 'FF00FF', orange: 'FFA500', purple: '800080',
    pink: 'FFC0CB', gray: '808080', grey: '808080', transparent: '000000',
  };
  if (namedColors[clean.toLowerCase()]) {
    return { hex: namedColors[clean.toLowerCase()], alpha: clean.toLowerCase() === 'transparent' ? 0 : 1 };
  }
  return undefined;
}

function parseCssLength(value, base) {
  if (!base) base = 16;
  if (!value || value === '0') return 0;
  const clean = value.trim().toLowerCase();
  const num = parseFloat(clean);
  if (Number.isNaN(num)) return undefined;
  if (clean.endsWith('px')) return num;
  if (clean.endsWith('em')) return num * base;
  if (clean.endsWith('rem')) return num * 16;
  if (clean.endsWith('pt')) return num * 1.333;
  if (clean.endsWith('%')) return num / 100 * base;
  if (clean.endsWith('cm')) return num * 37.795;
  if (clean.endsWith('mm')) return num * 3.78;
  if (clean.endsWith('in')) return num * 96;
  return num;
}

function parseBoxShadow(value) {
  if (!value || value === 'none') return undefined;
  const clean = value.trim();
  function splitTopLevel(input) {
    const result = [];
    let depth = 0;
    let current = '';
    for (const char of input) {
      if (char === '(') depth++;
      else if (char === ')') depth--;
      if (char === ',' && depth === 0) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    if (current) result.push(current);
    return result;
  }
  const firstShadow = splitTopLevel(clean)[0]?.trim();
  if (!firstShadow) return undefined;
  const tokens = firstShadow.split(/\s+/).filter(Boolean);
  let inset = false;
  let color;
  const lengths = [];
  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (lower === 'inset') { inset = true; continue; }
    const parsedColor = parseCssColor(token);
    if (parsedColor) { color = parsedColor; continue; }
    const len = parseCssLength(token);
    if (len !== undefined) lengths.push(len);
  }
  if (lengths.length < 2) return undefined;
  const offsetX = lengths[0];
  const offsetY = lengths[1];
  const blur = lengths[2] || 0;
  const angle = (Math.atan2(offsetY, offsetX) * 180) / Math.PI;
  const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
  return {
    type: inset ? 'inner' : 'outer',
    color: color ? color.hex : '000000',
    transparency: Math.round((1 - (color ? color.alpha : 1)) * 100),
    blur,
    angle,
    distance,
  };
}

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

// P1-2 内容签名：轻量级页面稳定态指纹（元素数 + innerHTML 内容哈希 + 图片加载态 + canvas 尺寸 + 字体状态）。
// 两次采集一致 → 页面无进行中的渲染变化（懒加载/异步图表/字体迟到），可以安全截图。
function computeSlideSignature(slideIndex) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return 'missing';
  const parts = [];
  parts.push('el:' + wrapper.getElementsByTagName('*').length);
  // djb2 哈希 innerHTML：比 length 更强，能捕获等长内容变化（tick-5 -> tick-6）
  let hash = 5381;
  const html = wrapper.innerHTML;
  for (let k = 0; k < html.length; k++) {
    hash = ((hash << 5) + hash + html.charCodeAt(k)) | 0;
  }
  parts.push('html:' + hash + ':' + html.length);
  const imgs = wrapper.querySelectorAll('img');
  for (let k = 0; k < imgs.length; k++) {
    const img = imgs[k];
    parts.push('img' + k + ':' + (img.complete ? img.naturalWidth + 'x' + img.naturalHeight : 'loading'));
  }
  const canvases = wrapper.querySelectorAll('canvas');
  for (let k = 0; k < canvases.length; k++) {
    parts.push('cv' + k + ':' + canvases[k].width + 'x' + canvases[k].height);
  }
  parts.push('chart:' + wrapper.querySelectorAll('[data-lp-echart-type]').length);
  parts.push('font:' + (document.fonts && document.fonts.status ? document.fonts.status : 'n/a'));
  return parts.join('|');
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

function parseColorAlpha(colorStr) {
  if (!colorStr || colorStr === 'none') return 1;
  const m = colorStr.match(/,\\s*([\\d.]+)\\s*\\)\\s*$/);
  return m ? parseFloat(m[1]) : 1;
}

// 检测元素是否带旋转：computed transform 会把 rotate() 归一为 matrix()，需分解 a/b 分量判断。
function hasRotation(transformStr) {
  if (!transformStr || transformStr === 'none') return false;
  if (/rotate[3XY]?\\(/i.test(transformStr)) return true;
  const m = transformStr.match(/matrix\\(\\s*([-\\d.eE+]+)\\s*,\\s*([-\\d.eE+]+)/);
  if (m) {
    const angle = Math.atan2(parseFloat(m[2]), parseFloat(m[1]));
    return Math.abs(angle) > 0.01; // 约 0.57° 以上视为旋转
  }
  return false;
}

// P0-2 装饰性文本识别：返回跳过原因（不抽为文本框，保留在截图中），否则返回 null。
function getDecorativeTextSkipReason(el, style, fontSizePx, isSvg, scale) {
  // 1. 描边空心字：stroke-only 大字（水印/装饰标题）
  const strokeW = parseFloat(style.webkitTextStrokeWidth) || 0;
  const fillTransparent = style.webkitTextFillColor === 'rgba(0, 0, 0, 0)';
  if (strokeW >= 1 && fillTransparent) {
    return { type: 'decorative-text-skipped', detail: 'stroke-only' };
  }
  // 2. 低透明度水印字（color alpha × opacity）
  const colorStr = isSvg ? style.fill : style.color;
  const opacity = parseFloat(style.opacity);
  const effectiveAlpha = parseColorAlpha(colorStr) * (Number.isNaN(opacity) ? 1 : opacity);
  if (effectiveAlpha > 0 && effectiveAlpha < 0.08) {
    return { type: 'decorative-text-skipped', detail: 'low-alpha(' + effectiveAlpha.toFixed(3) + ')' };
  }
  // 3. 旋转小字（装饰性标签），字号按设计稿 scale 还原后判断
  const designFontSize = fontSizePx / (scale || 1);
  if (hasRotation(style.transform) && designFontSize < 12) {
    return { type: 'decorative-text-skipped', detail: 'rotated-small' };
  }
  // 4. 图表区域内小字：区域截图已包含这些文字，抽出必然重影/漂浮。
  //    SVG text（ECharts 轴标签/刻度）一律保留；HTML 小字（<14px）保留；标题（≥14px）仍抽为文本框。
  if (isInsideFallbackRegion(el)) {
    if (isSvg) {
      return { type: 'chart-region-text-kept', detail: 'svg-text' };
    }
    if (designFontSize < 14) {
      return { type: 'chart-region-text-kept', detail: 'small(' + Math.round(designFontSize) + 'px)' };
    }
  }
  return null;
}

// P1-1 逐行文本拆分：用 Range 逐字符测量元素子树内所有文本节点，
// 按行顶坐标分组还原浏览器实际折行位置（含 inline 子元素如 <b>/<span> 跨节点同行），
// 每行返回 { text, left, top, width, height }（视觉坐标）。
// 返回 null 表示无需/无法拆分：单行、无文本或超长（3000 字符，防最坏情况性能）。
function extractTextLines(el) {
  const rawText = el.innerText || el.textContent || '';
  const text = rawText.trim();
  if (!text || text.length > 3000) return null;

  const textNodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = walker.nextNode())) {
    if (node.textContent && node.textContent.trim().length > 0) textNodes.push(node);
  }
  if (textNodes.length === 0) return null;

  const range = document.createRange();
  const lines = [];
  let current = null; // { text, top, height, segments: [{ node, start, end }] }

  function flush() {
    if (current && current.text.trim()) {
      // 行矩形 = 该行所有文本段 rect 的并集
      let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
      for (const seg of current.segments) {
        try {
          range.setStart(seg.node, seg.start);
          range.setEnd(seg.node, seg.end);
        } catch (e) { continue; }
        const rects = range.getClientRects();
        for (let k = 0; k < rects.length; k++) {
          const r = rects[k];
          if (r.width < 0.5 || r.height < 0.5) continue;
          if (r.left < left) left = r.left;
          if (r.top < top) top = r.top;
          if (r.right > right) right = r.right;
          if (r.bottom > bottom) bottom = r.bottom;
        }
      }
      if (left !== Infinity && right > left && bottom > top) {
        lines.push({ text: current.text.trim(), left, top, width: right - left, height: bottom - top });
      }
    }
    current = null;
  }

  for (const tn of textNodes) {
    const content = tn.textContent;
    for (let i = 0; i < content.length; i++) {
      const ch = content[i];
      if (ch === '\\n' || ch === '\\r') { flush(); continue; }
      range.setStart(tn, i);
      range.setEnd(tn, i + 1);
      const rects = range.getClientRects();
      if (!rects.length) { flush(); continue; }
      const r = rects[0];
      // 折行产生的不可见空白字符（宽 <0.5px）：行首时丢弃，行中保留
      if (r.width < 0.5 && ch.trim() === '' && !current) continue;
      // 行顶坐标跳变超过半个行高 → 新行
      if (current && Math.abs(r.top - current.top) > Math.max(2, r.height * 0.5)) {
        flush();
      }
      if (!current) {
        current = { text: '', top: r.top, height: r.height, segments: [] };
      }
      const lastSeg = current.segments[current.segments.length - 1];
      if (lastSeg && lastSeg.node === tn && lastSeg.end === i) {
        lastSeg.end = i + 1;
      } else {
        current.segments.push({ node: tn, start: i, end: i + 1 });
      }
      current.text += ch;
      if (r.height > current.height) current.height = r.height;
    }
  }
  flush();

  return lines.length > 1 ? lines : null;
}

function extractTextBoxes(slideIndex, markElements) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return { boxes: [], warnings: [] };

  const scale = getExportScale();
  const wrapperRect = wrapper.getBoundingClientRect();
  const slideNo = slideIndex + 1;
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
  const warnings = [];
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
    const opacityValue = parseFloat(style.opacity);

    // P0-2 装饰性文本过滤：跳过的文字不抽为文本框、不隐藏，原样保留在截图中。
    const skipReason = getDecorativeTextSkipReason(el, style, fontSizePx, isSvg, scale);
    if (skipReason) {
      warnings.push({
        slide: slideNo,
        type: skipReason.type,
        detail: (skipReason.detail || '') + ': ' + text.slice(0, 40),
      });
      continue;
    }

    const fontFamilies = style.fontFamily.split(',').map((s) => s.replace(/['"]/g, '').trim()).filter(Boolean);
    const fontWeight = style.fontWeight;
    const bold = fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600;
    const italic = style.fontStyle === 'italic';

    // P0-3 字号系数：CJK 0.5625（128px/in 几何精确值，修复中文爆框）；等宽 0.62；其他拉丁 0.75（视觉补偿）
    const hasCJK = /[\\u4e00-\\u9fff\\u3400-\\u4dbf\\u3000-\\u303f\\uff00-\\uffef]/.test(text);
    const isMono = /mono|menlo|consolas|courier|jetbrains/i.test(style.fontFamily);
    const fontCoeff = hasCJK ? 0.5625 : isMono ? 0.62 : 0.75;

    // P0-3 文本样式采集：字距 / 行距倍数 / 下划线删除线 / 透明度
    let charSpacing;
    const ls = parseFloat(style.letterSpacing);
    if (!Number.isNaN(ls) && ls !== 0) {
      charSpacing = Math.round(ls * 0.5625 * 1000) / 1000;
    }
    let lineSpacingMultiple;
    const lhPx = parseFloat(style.lineHeight);
    if (!Number.isNaN(lhPx) && lhPx > 0 && fontSizePx > 0) {
      const multiple = lhPx / fontSizePx;
      if (Math.abs(multiple - 1) > 0.05) lineSpacingMultiple = Math.round(multiple * 100) / 100;
    }
    const deco = style.textDecorationLine || '';
    const underline = deco.indexOf('underline') !== -1;
    const strike = deco.indexOf('line-through') !== -1;
    const effAlpha = parseColorAlpha(isSvg ? style.fill : style.color) * (Number.isNaN(opacityValue) ? 1 : opacityValue);
    const transparency = effAlpha < 1 ? Math.round((1 - effAlpha) * 100) : undefined;

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

    // P1-1 逐行拆分：多行文本按浏览器实际折行位置拆成独立文本框，避免 PPT 整框重排错位。
    // 单行/无法拆分（SVG、超长、单行）仍用整元素矩形（容器 rect，避免行高测量偏差）。
    if (!isSvg) {
      const lines = extractTextLines(el);
      if (lines) {
        const lineBoxes = [];
        for (const line of lines) {
          // 与 wrapper 求交集：越界行（被裁剪隐藏的部分）丢弃
          const overflow = 5;
          if (
            line.left < wrapperRect.left - overflow ||
            line.top < wrapperRect.top - overflow ||
            line.left + line.width > wrapperRect.right + overflow ||
            line.top + line.height > wrapperRect.bottom + overflow
          ) {
            continue;
          }
          lineBoxes.push({
            text: line.text,
            x: line.left - wrapperRect.left,
            y: line.top - wrapperRect.top,
            w: line.width,
            h: line.height,
            fontFamilies,
            fontSize: fontSizePx * fontCoeff * scale,
            color,
            bold,
            italic,
            align,
            valign: 'top',
            charSpacing,
            underline,
            strike,
            transparency,
            hasCJK,
          });
        }
        // 至少一行有效才走行拆分路径（原文已隐藏，不能丢字）；否则回退整元素框
        if (lineBoxes.length > 0) {
          boxes.push(...lineBoxes);
          continue;
        }
      }
    }

    boxes.push({
      text,
      x: rect.left - wrapperRect.left,
      y: rect.top - wrapperRect.top,
      w: rect.width,
      h: rect.height,
      fontFamilies,
      fontSize: fontSizePx * fontCoeff * scale,
      color,
      bold,
      italic,
      align,
      valign,
      charSpacing,
      lineSpacingMultiple,
      underline,
      strike,
      transparency,
      hasCJK,
    });
  }

  return { boxes, warnings };
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

function isComplexSvg(svg) {
  // 返回命中的复杂特性描述（用于质量报告），未命中返回 null
  const complexSelectors = [
    'linearGradient', 'radialGradient', 'filter', 'mask',
    'clipPath', 'pattern', 'marker', 'symbol', 'use',
    '[fill^="url(#"]', '[stroke^="url(#"]', '[filter^="url(#"]',
    '[mask^="url(#"]', '[clip-path^="url(#"]', '[fill-opacity]',
    '[stroke-opacity]', 'foreignObject', 'textPath',
  ];
  for (const sel of complexSelectors) {
    if (svg.querySelector(sel)) return sel;
  }

  // 嵌套 SVG：transform 组合导致无法简单映射
  if (svg.querySelectorAll('svg').length > 0) return 'nested-svg';

  // 复杂贝塞尔曲线命令（C/S/Q/T/A），当前 parseSimpleSvgPath 无法正确处理
  const paths = svg.querySelectorAll('path[d]');
  for (const p of paths) {
    const d = p.getAttribute('d') || '';
    if (/[CQSTA]/.test(d)) return 'bezier-path';
  }

  // 大量形状元素（>30个），大概率是复杂图表，直接截图
  const shapeEls = svg.querySelectorAll('path, rect, circle, ellipse, line, polygon, polyline');
  if (shapeEls.length > 30) return 'too-many-shapes(' + shapeEls.length + ')';

  return null;
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

function pushFallbackRegion(regions, regionEls, el, wrapperRect, force = false, warnings, slideNo, kind = 'generic') {
  if (isInsideFallbackRegion(el)) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width < 4 || rect.height < 4) return false;

  // 跳过几乎覆盖整页的元素（通常是背景/容器截图无意义），但 ECharts 等强制截图的元素例外。
  if (!force && rect.width > wrapperRect.width * 0.98 && rect.height > wrapperRect.height * 0.98) return false;

  // 处理主体溢出 slide 的装饰元素：不直接丢弃，而是裁剪到 slide 可见区域后截图。
  // 这样可保留部分可见的装饰（如 theme01 的 Blob），同时避免生成无意义的超大截图。
  const overflow = 10;
  let useRect = rect;
  const overflowLeft = rect.left < wrapperRect.left - overflow;
  const overflowTop = rect.top < wrapperRect.top - overflow;
  const overflowRight = rect.right > wrapperRect.right + overflow;
  const overflowBottom = rect.bottom > wrapperRect.bottom + overflow;
  if (!force && (overflowLeft || overflowTop || overflowRight || overflowBottom)) {
    const left = Math.max(rect.left, wrapperRect.left);
    const top = Math.max(rect.top, wrapperRect.top);
    const right = Math.min(rect.right, wrapperRect.right);
    const bottom = Math.min(rect.bottom, wrapperRect.bottom);
    const cw = right - left;
    const ch = bottom - top;
    // 完全在 slide 外，或裁剪后过小（<40px）才跳过
    if (cw < 40 || ch < 40) {
      if (warnings) {
        warnings.push({
          slide: slideNo,
          type: 'region-decorative-skipped',
          detail: 'off-slide: ' + (el.className || el.tagName.toLowerCase() || '').toString().slice(0, 60),
        });
      }
      return false;
    }
    useRect = { left, top, right, bottom, width: cw, height: ch };
  }

  regions.push({
    x: useRect.left - wrapperRect.left,
    y: useRect.top - wrapperRect.top,
    w: useRect.width,
    h: useRect.height,
    selector: el.className || el.tagName.toLowerCase(),
    kind,
  });

  el.setAttribute('data-lp-region-fallback', 'true');
  regionEls.push(el);
  return true;
}

function detectFallbackRegions(slideIndex) {
  const wrapper = getWrapper(slideIndex);
  const slideNo = slideIndex + 1;
  if (!wrapper) return { regions: [], warnings: [] };
  const wrapperRect = wrapper.getBoundingClientRect();
  const regions = [];
  const regionEls = [];
  const warnings = [];
  const declaredEls = [];

  // P1-3 声明式 fallback 协议：模板通过 data-lp-fallback-region="chart|table" 显式声明复杂区域，
  // 引擎优先消费声明（消除选择器硬编码的猜测）；未声明内容仍走下方启发式检测兜底。
  // 嵌套声明取最内层（最具体）；声明区域强制截图（force），信任模板的复杂度判断。
  const declared = Array.from(wrapper.querySelectorAll('[data-lp-fallback-region]'));
  for (const el of declared) {
    if (declared.some((d) => d !== el && el.contains(d))) continue;
    if (regionEls.some((r) => r === el || r.contains(el))) continue;
    const kind = el.getAttribute('data-lp-fallback-region') === 'table' ? 'table' : 'chart';
    if (pushFallbackRegion(regions, regionEls, el, wrapperRect, true, warnings, slideNo, kind)) {
      declaredEls.push(el);
    }
  }

  const selectors = [
    '.lp-fallback-region',
    'canvas',
    'svg',
    '[data-lp-region-fallback]',
    // ECharts 容器
    '[data-lp-echart-type]',
    // 主题自带的 HTML/CSS 图表内容容器（lp-chart-body 是实际绘制区域，lp-chart-card 是卡片容器）
    '.lp-chart-body', '.lp-chart-card',
    '.lp-chart-wrapper:not(.lp-slide)', '.lp-echart-wrapper',
    // 数据表格/对比表格类容器统一走截图，避免被拆成零散文本框
    'table',
    '.lp-table-data-wrap',
    '.lp-comparison-v3-table',
    '.lp-comparison-table',
    // 特定图表类型容器
    '.lp-chart-donut-chart', '.lp-chart-line-chart', '.lp-chart-bar-chart',
    '.lp-chart-pie-chart', '.lp-chart-funnel-chart', '.lp-chart-radar-chart',
    '.lp-chart-gauge-chart', '.lp-chart-heatmap-chart',
    '.lp-trend-chart', '.lp-bar-chart', '.lp-pie-chart', '.lp-line-chart',
    '.lp-donut-chart', '.lp-funnel-chart', '.lp-radar-chart', '.lp-gauge-chart',
  ];
  const candidateEls = selectors.length > 0 ? Array.from(wrapper.querySelectorAll(selectors.join(','))) : [];
  candidateEls.forEach((el) => {
    // 优先把 ECharts/图表容器本身作为 fallback 区域（ECharts/HTML图表强制走截图）。
    const echartContainer = el.closest('[data-lp-echart-type]');

    // 对于非 ECharts 的元素，向上查找最合适的图表/表格容器，避免对子元素重复截图
    let target = echartContainer || el;
    if (!echartContainer) {
      // 如果是 svg/table/canvas 内部元素，向上找到有意义的容器（排除 slide 根元素）
      const containerSelectors = [
        '[data-lp-echart-type]',
        '.lp-chart-body', '.lp-chart-card',
        '.lp-chart-wrapper', '.lp-echart-wrapper',
        'table', '.lp-table-data-wrap', '.lp-comparison-v3-table', '.lp-comparison-table',
        '.lp-chart-donut-chart', '.lp-chart-line-chart', '.lp-chart-bar-chart',
        '.lp-chart-pie-chart', '.lp-chart-funnel-chart', '.lp-chart-radar-chart',
      ];
      let container = el.closest(containerSelectors.join(','));
      // 如果找到的容器是 slide 根（接近整页大小），则跳过它，使用 el 本身
      if (container) {
        const cRect = container.getBoundingClientRect();
        if (cRect.width > wrapperRect.width * 0.95 && cRect.height > wrapperRect.height * 0.95) {
          container = null;
        }
      }
      if (container) target = container;
    }

    // 过滤掉过小的元素（如轴标签、图例文字等），避免产生大量无效区域
    const targetRect = target.getBoundingClientRect();
    if (targetRect.width < 80 || targetRect.height < 60) return;

    // 已在其他 fallback 区域内则跳过，避免重复截图。
    if (regionEls.some((r) => r === target || r.contains(target))) return;

    // P1-3：候选容器内部已有声明式区域（图表/表格本体）时，跳过容器级截图——声明优先，
    // 容器内声明区域之外的标题/图例等内容保持可编辑（「能编辑的尽量编辑」）。
    if (declaredEls.some((d) => target !== d && target.contains(d))) return;

    // SVG：ECharts 图表已在上面被其容器接管；其它 SVG 仅当无法简单矢量化时才作为 fallback region。
    if (!echartContainer && el.tagName.toLowerCase() === 'svg' && target === el) {
      // 如果 SVG 使用了渐变/滤镜/复杂路径等特性，或形状数量过多，直接走截图
      const complexReason = isComplexSvg(el);
      if (complexReason) {
        warnings.push({ slide: slideNo, type: 'complex-svg-unsupported', detail: complexReason });
        // 对于复杂 SVG，尝试向上查找包含它的图表容器（不能是 slide 根），对整个容器截图
        let chartWrapper = el.closest('.lp-chart-wrapper, .lp-echart-wrapper, .lp-chart-body, .lp-chart-card, [class*="-chart"]');
        if (chartWrapper) {
          const cwRect = chartWrapper.getBoundingClientRect();
          if (cwRect.width > wrapperRect.width * 0.95 && cwRect.height > wrapperRect.height * 0.95) {
            chartWrapper = null;
          }
        }
        const svgTarget = chartWrapper || el;
        if (regionEls.some((r) => r === svgTarget || r.contains(svgTarget))) return;
        pushFallbackRegion(regions, regionEls, svgTarget, wrapperRect, true, warnings, slideNo, 'chart');
        return;
      }
      const shapes = extractSvgShapes(slideIndex, false);
      if (shapes.length > 0) return; // 已可矢量化，不再截图
    }

    // 表格/图表容器强制截图
    const isChartOrTable = !!target.closest(
      '[data-lp-echart-type], .lp-chart-body, .lp-chart-card, ' +
      '.lp-chart-wrapper, .lp-echart-wrapper, ' +
      'table, .lp-table-data-wrap, .lp-comparison-v3-table, .lp-comparison-table, canvas, ' +
      '.lp-chart-donut-chart, .lp-chart-line-chart, .lp-chart-bar-chart, ' +
      '.lp-chart-pie-chart, .lp-chart-funnel-chart, .lp-chart-radar-chart'
    ) || ['table', 'canvas'].includes(target.tagName.toLowerCase());

    const kind = ['table', '.lp-table-data-wrap', '.lp-comparison-v3-table', '.lp-comparison-table'].some((sel) =>
      target.matches && target.matches(sel)
    ) || target.tagName.toLowerCase() === 'table'
      ? 'table'
      : 'chart';
    pushFallbackRegion(regions, regionEls, target, wrapperRect, !!echartContainer || isChartOrTable, warnings, slideNo, kind);
  });

  // 补充识别未显式标记但带有滤镜、复杂裁剪等效果的元素（渐变背景暂不走自动 fallback，避免主题装饰被过度截图）。
  wrapper.querySelectorAll('*').forEach((el) => {
    if (regionEls.some((r) => r !== el && r.contains(el))) return;
    if (!hasFilterOrComplexClip(el)) return;
    const parent = el.parentElement;
    if (parent && hasFilterOrComplexClip(parent)) return;
    pushFallbackRegion(regions, regionEls, el, wrapperRect, false, warnings, slideNo, 'decoration');
  });

  return { regions, warnings };
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

function extractVectorizableShapes(slideIndex, markElements, applyCssEffects) {
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

    // 阶段 3：将 outer box-shadow 矢量化到 shape。
    if (applyCssEffects) {
      const parsedShadow = parseBoxShadow(style.boxShadow);
      if (parsedShadow && parsedShadow.type === 'outer') {
        shape.shadow = {
          type: 'outer',
          color: parsedShadow.color,
          opacity: Math.max(0, Math.min(1, 1 - parsedShadow.transparency / 100)),
          blur: parsedShadow.blur,
          angle: parsedShadow.angle,
          offset: parsedShadow.distance,
        };
      }
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
