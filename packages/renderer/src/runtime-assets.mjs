// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 浏览器端导出所需的运行时 vendor 资源清单。
 *
 * 当服务端无法启动 Chromium（沙箱环境）时，前端依赖这些库完成截图与 PPTX/PDF 组装，
 * 服务端只做文件 I/O。参考 Dashi 的浏览器兜底设计。
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');

/**
 * vendor bundle 清单：名称 -> 目标路径（相对于包根）。
 */
export const VENDOR_BUNDLES = {
  'html-to-image': path.join(pkgRoot, 'assets', 'vendor', 'html-to-image.js'),
  'pdf-lib': path.join(pkgRoot, 'assets', 'vendor', 'pdf-lib.min.js'),
  'pptxgenjs': path.join(pkgRoot, 'assets', 'vendor', 'pptxgen.bundle.js'),
};

/**
 * 需要暴露给浏览器端导出脚本的全局变量名。
 */
export const VENDOR_GLOBALS = {
  'html-to-image': 'htmlToImage',
  'pdf-lib': 'PDFLib',
  'pptxgenjs': 'PptxGenJS',
};

/**
 * 获取 vendor 资源在 HTTP 服务中的公开路径。
 */
export function getVendorPublicPath(name) {
  if (!VENDOR_BUNDLES[name]) {
    throw new Error(`未知 vendor: ${name}`);
  }
  return `/assets/vendor/${name}.js`;
}

/**
 * 列出所有必需的 vendor 文件路径。
 */
export function listVendorBundlePaths() {
  return Object.values(VENDOR_BUNDLES);
}
