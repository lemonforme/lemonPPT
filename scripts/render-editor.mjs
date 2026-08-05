#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { renderDeck } from '@lemonppt/renderer';
import { copyFile, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const inputFile = process.argv[2] || path.join(rootDir, 'examples/sample-goal.json');
const outFile = process.argv[3] || path.join(rootDir, 'output/editor.html');

async function main() {
  const goal = JSON.parse(await readFile(inputFile, 'utf-8'));
  const result = renderDeck(goal, { editable: true });

  const outDir = path.dirname(outFile);
  const assetsDir = path.join(outDir, 'assets');
  await mkdir(assetsDir, { recursive: true });

  const themes = ['theme01', 'theme02', 'theme03', 'theme04', 'theme05', 'theme06'];
  for (const theme of themes) {
    const cssSource = path.join(rootDir, 'packages/themes/src', theme, 'styles.css');
    const cssDest = path.join(assetsDir, `${theme}.css`);
    await copyFile(cssSource, cssDest);
  }

  // 复制客户端离线渲染脚本，使静态文件模式下也能增删幻灯片
  const clientRenderSource = path.join(rootDir, 'packages/renderer/dist/client/client-render.js');
  const clientRenderDest = path.join(assetsDir, 'client-render.js');
  await copyFile(clientRenderSource, clientRenderDest);

  // 复制主题化 ECharts 初始化脚本，使 editor 中的图表能按需初始化
  const themeEchartsSource = path.join(rootDir, 'packages/renderer/dist/client/theme-echarts.js');
  const themeEchartsDest = path.join(assetsDir, 'theme-echarts.js');
  await copyFile(themeEchartsSource, themeEchartsDest);

  // 复制字体资源，使 @font-face 引用可用
  const fontsSource = path.join(rootDir, 'packages/renderer/assets/fonts');
  const fontsDest = path.join(assetsDir, 'fonts');
  await cp(fontsSource, fontsDest, { recursive: true, force: true });

  await writeFile(outFile, result.html, 'utf-8');

  console.log(`已生成可编辑预览: ${outFile}`);
  console.log(`提示：用浏览器打开后可直接编辑文字，点击顶部按钮下载 goal.json 或导出 PPTX。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
