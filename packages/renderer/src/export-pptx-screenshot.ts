// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal } from '@lemonppt/core';
import { normalizeGoal } from './normalize-goal.js';
import { exportDomToPptx, type Logger, type ExportProgress } from '@lemonppt/dom-to-pptx';
import { cp, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderDeck } from './render.js';
import { startPreviewServer } from './preview-server.js';

export interface ExportPptxScreenshotOptions {
  /** 输出 PPTX 文件路径 */
  outFile: string;
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
  overlayText?: boolean;
  /** 是否将简单图形（圆角矩形、圆形、线条）矢量化，默认 true */
  vectorizeShapes?: boolean;
  /** 是否将 <img> 元素提取为 PPTX 图片，默认 true */
  extractImages?: boolean;
  /** 是否自动下载远程图片（http/https），默认 true */
  downloadRemoteImages?: boolean;
  /** 是否对复杂区域（图表、复杂 SVG、表格等）单独截图并叠加，默认 true */
  regionFallback?: boolean;
  /** 结构化日志器 */
  logger?: Logger;
  /** 进度回调 */
  onProgress?: (progress: ExportProgress) => void;
}

/**
 * 截图式 PPTX 导出（DOM-to-PPTX 阶段 4 封装）。
 *
 * 复用 renderDeck() 生成的 HTML + CSS，调用 @lemonppt/dom-to-pptx
 * 生成与网页预览视觉一致的 .pptx。
 */
export async function exportDeckToPptxScreenshot(
  goal: DeckGoal,
  options: ExportPptxScreenshotOptions,
): Promise<void> {
  goal = normalizeGoal(goal);
  const {
    outFile,
    width = 1280,
    height = 720,
    title,
    subject,
    author,
    overlayText = true,
    vectorizeShapes = true,
    extractImages = true,
    downloadRemoteImages = true,
    regionFallback = true,
    logger,
    onProgress,
  } = options;

  const result = renderDeck(goal);
  const theme = goal.theme || 'theme01';

  // 在临时目录中准备静态资源，确保 HTML 中的相对引用可用。
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-renderer-pptx-'));
  const assetsDir = path.join(tempDir, 'assets');
  await mkdir(assetsDir, { recursive: true });

  const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const themesRoot = path.join(pkgRoot, '..', 'themes', 'src');

  try {
    await cp(
      path.join(themesRoot, theme, 'styles.css'),
      path.join(assetsDir, `${theme}.css`),
    );

    const fontsSource = path.join(pkgRoot, 'assets', 'fonts');
    const fontsDest = path.join(assetsDir, 'fonts');
    await cp(fontsSource, fontsDest, { recursive: true, force: true });

    const clientDir = path.join(pkgRoot, 'dist', 'client');
    await cp(path.join(clientDir, 'client-render.js'), path.join(assetsDir, 'client-render.js'), { force: true });
    await cp(path.join(clientDir, 'theme-echarts.js'), path.join(assetsDir, 'theme-echarts.js'), { force: true });

    try {
      const rootDir = path.resolve(pkgRoot, '..', '..');
      await cp(
        path.join(rootDir, 'output', 'assets', 'jquery.min.js'),
        path.join(assetsDir, 'jquery.min.js'),
        { force: true },
      );
    } catch {
      // 可选资源，忽略复制失败
    }

    await writeFile(path.join(tempDir, 'index.html'), result.html, 'utf-8');

    const previewServer = await startPreviewServer(tempDir);
    try {
      const buffer = await exportDomToPptx({
        html: result.html,
        previewUrl: `${previewServer.url}/index.html`,
        width,
        height,
        title,
        subject,
        author,
        editableText: overlayText,
        vectorizeShapes,
        extractImages,
        downloadRemoteImages,
        regionFallback,
        fontDir: fontsDest,
        initECharts: true,
        logger,
        onProgress,
      });

      await writeFile(outFile, buffer);
    } finally {
      await previewServer.close();
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
