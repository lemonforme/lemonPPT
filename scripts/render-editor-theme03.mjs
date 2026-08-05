#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Theme03 全组件编辑器脚本
 *
 * 为 theme03 生成一个包含全部版式的可编辑预览页面，
 * 用于在编辑器中快速查看、编辑和调试所有组件。
 *
 * 用法：
 *   node scripts/render-editor-theme03.mjs
 * 输出：
 *   output/editor-theme03.html
 *   output/editor-theme03/assets/
 */

import { renderDeck } from '@lemonppt/renderer';
import { listLayoutsByTheme } from '@lemonppt/templates';
import { copyFile, cp, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sampleProps } from './lib/sample-props.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outFile = path.join(rootDir, 'output/editor-theme03.html');
const theme = 'theme03';

async function main() {
  const layouts = listLayoutsByTheme(theme);
  layouts.sort((a, b) => a.id.localeCompare(b.id));

  const slides = layouts.map((meta) => ({
    role: meta.role,
    layout: meta.id,
    props: sampleProps(meta),
  }));

  const goal = {
    title: 'lemonPPT Theme03 全组件编辑器',
    goal: '预览并编辑 theme03 全部版式组件',
    audience: '设计师 / 开发者',
    owner: 'lemonPPT 团队',
    theme,
    language: 'zh',
    pageCount: slides.length,
    randomSeed: `theme03-editor-${Date.now()}`,
    colorScheme: 'scheme-a',
    appearance: 'dark',
    slides,
  };

  const result = renderDeck(goal, { editable: true });

  const outDir = path.dirname(outFile);
  const assetsDir = path.join(outDir, 'assets');
  await mkdir(assetsDir, { recursive: true });

  // 复制主题样式
  const cssSource = path.join(rootDir, 'packages/themes/src', theme, 'styles.css');
  const cssDest = path.join(assetsDir, `${theme}.css`);
  await copyFile(cssSource, cssDest);

  // 复制客户端离线渲染脚本
  const clientRenderSource = path.join(rootDir, 'packages/renderer/dist/client/client-render.js');
  const clientRenderDest = path.join(assetsDir, 'client-render.js');
  await copyFile(clientRenderSource, clientRenderDest);

  // 复制主题化 ECharts 初始化脚本
  const themeEchartsSource = path.join(rootDir, 'packages/renderer/dist/client/theme-echarts.js');
  const themeEchartsDest = path.join(assetsDir, 'theme-echarts.js');
  await copyFile(themeEchartsSource, themeEchartsDest);

  // 复制字体资源
  const fontsSource = path.join(rootDir, 'packages/renderer/assets/fonts');
  const fontsDest = path.join(assetsDir, 'fonts');
  await cp(fontsSource, fontsDest, { recursive: true, force: true });

  // 复制 jQuery
  const jquerySource = path.join(rootDir, 'output/assets/jquery.min.js');
  const jqueryDest = path.join(assetsDir, 'jquery.min.js');
  await copyFile(jquerySource, jqueryDest);

  await writeFile(outFile, result.html, 'utf-8');

  console.log(`✅ 已生成 theme03 全组件编辑器: ${outFile}`);
  console.log(`   共包含 ${slides.length} 个版式`);
  console.log(`   打开预览：file://${outFile}`);
}

main().catch((err) => {
  console.error('生成 theme03 编辑器失败：', err);
  process.exit(1);
});
