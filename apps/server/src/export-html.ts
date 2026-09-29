// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { renderGoalToDir } from '@lemonppt/cli';
import type { DeckGoal } from '@lemonppt/core';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 生成自包含的独立 HTML 演示文件。
 * 将 renderGoalToDir 生成的 deck 中的主题 CSS 与 JS 资源内联为 data URI，
 * 并移除对字体 CSS 的引用，避免 file:// 打开时因外部资源缺失而卡住。
 */
export async function buildStandaloneHtml(goal: DeckGoal): Promise<string> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-html-export-'));
  try {
    const { indexPath, assetsDir } = await renderGoalToDir(goal, { outDir: tempDir });
    let html = await readFile(indexPath, 'utf-8');
    const assetsAbs = path.resolve(assetsDir);
    const theme = goal.theme || 'theme01';

    // 内联主题 CSS
    const themeHref = `./assets/${theme}.css`;
    const themeCssPath = path.join(assetsAbs, `${theme}.css`);
    if (html.includes(themeHref)) {
      const css = await readFile(themeCssPath, 'utf-8');
      const b64 = Buffer.from(css).toString('base64');
      html = html.replace(
        new RegExp(`<link[^>]*href=["']${escapeRegExp(themeHref)}["'][^>]*>`, 'i'),
        `<link rel="stylesheet" href="data:text/css;base64,${b64}">`,
      );
    }

    // 移除字体 CSS，避免离线打开时加载失败；系统字体作为降级
    html = html.replace(/<link[^>]*href=["']\.\/assets\/fonts\/fonts\.css["'][^>]*>\s*/i, '');

    // 内联 JS 为 base64 data URI
    const scripts = [
      { src: './assets/jquery.min.js' },
      { src: './assets/client-render.js' },
      { src: './assets/theme-echarts.js' },
    ];
    for (const { src } of scripts) {
      if (html.includes(src)) {
        const filePath = path.join(assetsAbs, path.basename(src));
        const js = await readFile(filePath, 'utf-8');
        const b64 = Buffer.from(js).toString('base64');
        html = html.replace(
          new RegExp(`<script[^>]*src=["']${escapeRegExp(src)}["'][^>]*></script>`, 'i'),
          `<script src="data:application/javascript;base64,${b64}"></script>`,
        );
      }
    }

    return html;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}
