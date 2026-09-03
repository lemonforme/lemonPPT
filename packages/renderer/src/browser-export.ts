// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 浏览器端导出兜底脚本。
 *
 * 运行环境：用户浏览器。
 * 依赖全局变量：
 *   - htmlToImage (html-to-image)
 *   - PDFLib (pdf-lib)
 *   - PptxGenJS (pptxgenjs)
 *
 * 提供能力：
 *   - 将 .lp-slide-wrapper 逐页截图为 PNG dataURL
 *   - 用 pdf-lib 将图片合成为 PDF
 *   - 用 pptxgenjs 将图片合成为 PPTX（每页一张全屏图）
 */

export interface BrowserExportOptions {
  width?: number;
  height?: number;
  pixelRatio?: number;
  title?: string;
  subject?: string;
  author?: string;
}

export interface BrowserExportResult {
  /** MIME 类型 */
  mimeType: string;
  /** Base64 编码的文件内容 */
  base64: string;
  /** 文件名 */
  filename: string;
}

interface VendorGlobals {
  htmlToImage: typeof import('html-to-image');
  PDFLib: typeof import('pdf-lib');
  PptxGenJS: typeof import('pptxgenjs').default;
}

function getVendors(): VendorGlobals {
  const htmlToImage = (window as any).htmlToImage;
  const PDFLib = (window as any).PDFLib;
  const PptxGenJS = (window as any).PptxGenJS;

  if (!htmlToImage) {
    throw new Error('缺少 html-to-image 全局变量，请先加载 assets/vendor/html-to-image.js');
  }
  if (!PDFLib) {
    throw new Error('缺少 pdf-lib 全局变量，请先加载 assets/vendor/pdf-lib.js');
  }
  if (!PptxGenJS) {
    throw new Error('缺少 pptxgenjs 全局变量，请先加载 assets/vendor/pptxgenjs.js');
  }

  return { htmlToImage, PDFLib, PptxGenJS };
}

/**
 * 获取所有幻灯片 DOM 节点。
 */
function getSlideElements(): HTMLElement[] {
  const nodes = document.querySelectorAll('.lp-slide-wrapper');
  if (nodes.length === 0) {
    throw new Error('未找到 .lp-slide-wrapper 幻灯片节点');
  }
  return Array.from(nodes) as HTMLElement[];
}

/**
 * 将单页幻灯片截图为 PNG dataURL。
 */
export async function captureSlideAsImage(
  slide: HTMLElement,
  options: BrowserExportOptions = {},
): Promise<string> {
  const { pixelRatio = 2 } = options;
  const { htmlToImage } = getVendors();

  // 确保当前 slide 可见，其余隐藏，避免叠加。
  const allSlides = getSlideElements();
  allSlides.forEach((el) => {
    el.style.opacity = el === slide ? '1' : '0';
    el.style.visibility = el === slide ? 'visible' : 'hidden';
    el.style.position = el === slide ? 'relative' : 'absolute';
    el.style.zIndex = el === slide ? 'auto' : '-1';
  });

  try {
    const dataUrl = await htmlToImage.toPng(slide, {
      pixelRatio,
      cacheBust: true,
    });
    return dataUrl;
  } finally {
    allSlides.forEach((el) => {
      el.style.opacity = '';
      el.style.visibility = '';
      el.style.position = '';
      el.style.zIndex = '';
    });
  }
}

/**
 * 将所有幻灯片逐页截图为 PNG dataURL 数组。
 */
export async function captureSlidesAsImages(
  options: BrowserExportOptions = {},
): Promise<string[]> {
  const slides = getSlideElements();
  const images: string[] = [];
  for (let i = 0; i < slides.length; i++) {
    const dataUrl = await captureSlideAsImage(slides[i], options);
    images.push(dataUrl);
  }
  return images;
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1];
  if (!base64) {
    throw new Error('非法 dataURL 格式');
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * 将截图数组组装为 PDF。
 */
export async function assemblePdfFromImages(
  images: string[],
  options: BrowserExportOptions = {},
): Promise<BrowserExportResult> {
  const { width = 1280, height = 720, title = 'Presentation', author = 'lemonPPT' } = options;
  const { PDFLib } = getVendors();

  const pdfDoc = await PDFLib.PDFDocument.create();
  pdfDoc.setTitle(title);
  pdfDoc.setAuthor(author);

  const pageWidth = PDFLib.PageSizes.A4[0];
  const pageHeight = PDFLib.PageSizes.A4[1];

  for (const dataUrl of images) {
    const imageBytes = dataUrlToUint8Array(dataUrl);
    const image = await pdfDoc.embedPng(imageBytes);

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    const scale = Math.min(pageWidth / width, pageHeight / height);
    const drawWidth = width * scale;
    const drawHeight = height * scale;
    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    page.drawImage(image, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const base64 = btoa(
    Array.from(pdfBytes)
      .map((byte) => String.fromCharCode(byte))
      .join(''),
  );

  return {
    mimeType: 'application/pdf',
    base64,
    filename: 'presentation.pdf',
  };
}

/**
 * 将截图数组组装为 PPTX（每页一张全屏图）。
 */
export async function assemblePptxFromImages(
  images: string[],
  options: BrowserExportOptions = {},
): Promise<BrowserExportResult> {
  const { width = 1280, height = 720, title = 'Presentation', subject, author } = options;
  const { PptxGenJS } = getVendors();

  const pptx = new PptxGenJS();
  (pptx as any).defineLayout({ name: 'CUSTOM', width: (width * 10) / 1280, height: (height * 10) / 1280 });
  (pptx as any).layout = 'CUSTOM';
  if (title) pptx.title = title;
  if (subject) pptx.subject = subject;
  if (author) pptx.author = author;

  for (const dataUrl of images) {
    const slide = pptx.addSlide();
    slide.addImage({
      data: dataUrl,
      x: 0,
      y: 0,
      w: (width * 10) / 1280,
      h: (height * 10) / 1280,
      sizing: { type: 'crop', w: (width * 10) / 1280, h: (height * 10) / 1280 },
    } as any);
  }

  const base64 = await (pptx as any).write({ outputType: 'base64' });
  return {
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    base64,
    filename: 'presentation.pptx',
  };
}

/**
 * 一键导出：截图并组装为 PDF。
 */
export async function exportDeckToPdfInBrowser(
  options: BrowserExportOptions = {},
): Promise<BrowserExportResult> {
  const images = await captureSlidesAsImages(options);
  return assemblePdfFromImages(images, options);
}

/**
 * 一键导出：截图并组装为 PPTX。
 */
export async function exportDeckToPptxInBrowser(
  options: BrowserExportOptions = {},
): Promise<BrowserExportResult> {
  const images = await captureSlidesAsImages(options);
  return assemblePptxFromImages(images, options);
}

// 暴露到全局，供非模块化页面调用
declare global {
  interface Window {
    __lemonPPT_browserExport?: {
      captureSlidesAsImages: typeof captureSlidesAsImages;
      assemblePdfFromImages: typeof assemblePdfFromImages;
      assemblePptxFromImages: typeof assemblePptxFromImages;
      exportDeckToPdfInBrowser: typeof exportDeckToPdfInBrowser;
      exportDeckToPptxInBrowser: typeof exportDeckToPptxInBrowser;
    };
  }
}

if (typeof window !== 'undefined') {
  window.__lemonPPT_browserExport = {
    captureSlidesAsImages,
    assemblePdfFromImages,
    assemblePptxFromImages,
    exportDeckToPdfInBrowser,
    exportDeckToPptxInBrowser,
  };
}
