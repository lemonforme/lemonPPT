// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal } from '@lemonppt/core';
import { normalizeDeckGoal } from '@lemonppt/core';
import { cp, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { renderDeck } from './render.js';

declare global {
  interface Window {
    __lemonPPT_initECharts?: (theme?: string, root?: Element | null) => Promise<void>;
  }
}

export interface ExportPdfOptions {
  /** 输出 PDF 文件路径 */
  outFile: string;
  /** 页面宽度（像素），默认 1280 */
  width?: number;
  /** 页面高度（像素），默认 720 */
  height?: number;
}

export async function exportDeckToPdf(goal: DeckGoal, options: ExportPdfOptions): Promise<void> {
  goal = normalizeDeckGoal(goal);
  const { outFile, width = 1280, height = 720 } = options;

  const result = renderDeck(goal);
  const theme = goal.theme || 'theme01';

  // 在临时目录中准备 HTML 和主题/字体资源，确保相对引用可用
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-'));
  const tempHtml = path.join(tempDir, 'index.html');
  const assetsDir = path.join(tempDir, 'assets');
  await mkdir(assetsDir, { recursive: true });
  await writeFile(tempHtml, result.html, 'utf-8');

  const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const themesRoot = path.join(pkgRoot, '..', 'themes', 'src');
  await cp(
    path.join(themesRoot, theme, 'styles.css'),
    path.join(assetsDir, `${theme}.css`)
  );

  const fontsSource = path.join(pkgRoot, 'assets', 'fonts');
  const fontsDest = path.join(assetsDir, 'fonts');
  await cp(fontsSource, fontsDest, { recursive: true, force: true });

  // 复制客户端渲染脚本与 ECharts 主题分包脚本，使 PDF 中的图表页能正常初始化。
  const clientDir = path.join(pkgRoot, 'dist', 'client');
  await cp(path.join(clientDir, 'client-render.js'), path.join(assetsDir, 'client-render.js'), { force: true });
  await cp(path.join(clientDir, 'theme-echarts.js'), path.join(assetsDir, 'theme-echarts.js'), { force: true });

  // jQuery 在 renderDeck 生成的 HTML 中被引用，复制它可避免 404 干扰脚本加载。
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

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('file://' + tempHtml, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    // 显式等待并执行 ECharts 初始化，确保异步图表渲染完成后再生成 PDF。
    await page.evaluate(async () => {
      if (typeof window.__lemonPPT_initECharts === 'function') {
        await window.__lemonPPT_initECharts();
      }
    });
    await page.waitForTimeout(600);
    await page.pdf({
      path: outFile,
      width: `${width}px`,
      height: `${height}px`,
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}
