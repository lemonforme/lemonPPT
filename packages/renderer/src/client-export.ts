// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 浏览器端可编辑 PPTX 导出封装。
 *
 * 基于 dom-to-pptx (MIT) 的 UMD bundle，将 .lp-slide-wrapper 转换为可编辑
 * PowerPoint 形状/文本框。复杂元素（ECharts、自定义字体）仍可能走截图或失败，
 * 此时应回退到服务端导出。
 *
 * 运行环境：用户浏览器。
 */

export interface ClientExportOptions {
  /** 输出文件名 */
  fileName?: string;
  /** 幻灯片宽度（英寸），默认根据 DOM 实际尺寸自动计算 */
  width?: number;
  /** 幻灯片高度（英寸），默认根据 DOM 实际尺寸自动计算 */
  height?: number;
  /** PptxGenJS 布局名称，优先级低于 width/height */
  layout?: string;
  /** 是否将 SVG 保留为矢量，默认 false（截图更稳妥） */
  svgAsVector?: boolean;
  /** 是否自动嵌入检测到的字体，默认 false（避免跨域/路径问题，暂不开） */
  autoEmbedFonts?: boolean;
  /** 幻灯片背景色，默认取 DOM 计算样式 */
  background?: string;
  /** 文档标题 */
  title?: string;
  /** 文档作者 */
  author?: string;
  /** 文档主题 */
  subject?: string;
  /** dom-to-pptx bundle 地址，默认根据当前 assetsBase 推导 */
  bundleUrl?: string;
}

export interface ClientExportApi {
  exportToPptx: (target: string | Element | (string | Element)[], options?: Record<string, unknown>) => Promise<void>;
}

declare global {
  interface Window {
    domToPptx?: ClientExportApi;
    __lemonPPT_clientExport?: {
      loadDomToPptx: typeof loadDomToPptx;
      exportDeckToPptxClient: typeof exportDeckToPptxClient;
      exportCurrentSlideToPptxClient: typeof exportCurrentSlideToPptxClient;
    };
  }
}

const DEFAULT_BUNDLE_NAME = 'vendor/dom-to-pptx.bundle.js';

function resolveBundleUrl(explicitUrl?: string): string {
  if (explicitUrl) return explicitUrl;

  const base = (window as any).__lemonPPT_assetsBase || '/deck/assets/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return `${normalized}${DEFAULT_BUNDLE_NAME}`;
}

let bundleLoadPromise: Promise<ClientExportApi> | null = null;

/**
 * 动态加载 dom-to-pptx UMD bundle，返回全局 API。
 * 重复调用会复用已加载的实例。
 */
export function loadDomToPptx(explicitUrl?: string): Promise<ClientExportApi> {
  if (window.domToPptx) {
    return Promise.resolve(window.domToPptx);
  }

  if (bundleLoadPromise) {
    return bundleLoadPromise;
  }

  bundleLoadPromise = new Promise((resolve, reject) => {
    const url = resolveBundleUrl(explicitUrl);
    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = () => {
      if (window.domToPptx && typeof window.domToPptx.exportToPptx === 'function') {
        resolve(window.domToPptx);
      } else {
        reject(new Error('dom-to-pptx bundle 加载后未找到全局 domToPptx 对象'));
      }
    };

    script.onerror = () => {
      bundleLoadPromise = null;
      reject(new Error(`无法加载 dom-to-pptx bundle: ${url}`));
    };

    document.head.appendChild(script);
  });

  return bundleLoadPromise;
}

function getSlideElements(): HTMLElement[] {
  const nodes = document.querySelectorAll('.lp-slide-wrapper');
  if (nodes.length === 0) {
    throw new Error('未找到 .lp-slide-wrapper 幻灯片节点');
  }
  return Array.from(nodes) as HTMLElement[];
}

function buildExportOptions(options: ClientExportOptions, slides: HTMLElement[]) {
  const first = slides[0];
  const rect = first.getBoundingClientRect();
  const aspect = rect.width / rect.height;

  // 默认使用 15 x 8.4375 英寸（对应 1920x1080 16:9），与现有 PPTX 导出保持一致。
  // 如果 DOM 实际比例不是 16:9，则让 dom-to-pptx 自动按容器尺寸推断。
  const isWide16x9 = Math.abs(aspect - 16 / 9) < 0.05;
  const width = isWide16x9 ? 15 : options.width;
  const height = isWide16x9 ? 8.4375 : options.height;

  return {
    fileName: options.fileName || 'presentation.pptx',
    ...(width && height ? { width, height } : {}),
    ...(options.layout ? { layout: options.layout } : {}),
    svgAsVector: options.svgAsVector ?? false,
    autoEmbedFonts: options.autoEmbedFonts ?? false,
    ...(options.background ? { background: options.background } : {}),
    ...(options.title ? { title: options.title } : {}),
    ...(options.author ? { author: options.author } : {}),
    ...(options.subject ? { subject: options.subject } : {}),
  };
}

/**
 * 导出当前编辑器中所有幻灯片为可编辑 PPTX。
 */
export async function exportDeckToPptxClient(options: ClientExportOptions = {}): Promise<void> {
  const api = await loadDomToPptx(options.bundleUrl);
  const slides = getSlideElements();
  const exportOptions = buildExportOptions(options, slides);
  await api.exportToPptx(slides, exportOptions);
}

/**
 * 仅导出当前可见幻灯片为可编辑 PPTX。
 */
export async function exportCurrentSlideToPptxClient(options: ClientExportOptions = {}): Promise<void> {
  const api = await loadDomToPptx(options.bundleUrl);
  const slides = getSlideElements();
  const visible = slides.find((el) => el.style.display !== 'none' && el.style.visibility !== 'hidden');
  const target = visible || slides[0];
  if (!target) {
    throw new Error('未找到可导出的幻灯片');
  }
  const exportOptions = buildExportOptions(options, slides);
  await api.exportToPptx([target], exportOptions);
}

if (typeof window !== 'undefined') {
  window.__lemonPPT_clientExport = {
    loadDomToPptx,
    exportDeckToPptxClient,
    exportCurrentSlideToPptxClient,
  };
}
