#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 渲染示例 goal.json 到 output/index.html
 * 用法: node scripts/render.mjs [path/to/goal.json]
 */
import { readFile, mkdir, copyFile, cp, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderDeck } from '@lemonppt/renderer';
import { validateDeckGoal, validateDeckGoalContent } from '@lemonppt/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const goalPath = process.argv[2] ?? path.join(rootDir, 'examples', 'sample-goal.json');
const outputDir = path.join(rootDir, 'output');
const assetsDir = path.join(outputDir, 'assets');

async function main() {
  const raw = await readFile(goalPath, 'utf-8');
  const goal = JSON.parse(raw);

  const validation = validateDeckGoal(goal);
  if (!validation.success) {
    console.error('goal.json 校验失败:');
    console.error(validation.errors?.format());
    process.exit(1);
  }

  const contentErrors = validateDeckGoalContent(validation.data);
  if (contentErrors.length > 0) {
    console.warn('内容字段缺失（可能导致空白页或占位提示）:');
    contentErrors.forEach((e) => console.warn('  ⚠️ ' + e));
  }

  const result = renderDeck(validation.data);
  const theme = validation.data.theme || 'theme01';

  await mkdir(assetsDir, { recursive: true });
  await copyFile(
    path.join(rootDir, 'packages', 'themes', 'src', theme, 'styles.css'),
    path.join(assetsDir, `${theme}.css`)
  );

  // 复制字体资源，使 @font-face 引用可用
  const fontsSource = path.join(rootDir, 'packages', 'renderer', 'assets', 'fonts');
  const fontsDest = path.join(assetsDir, 'fonts');
  await cp(fontsSource, fontsDest, { recursive: true, force: true });

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'index.html'), result.html, 'utf-8');

  console.log(`已生成: ${path.join(outputDir, 'index.html')}`);
  console.log(`页数: ${validation.data.slides.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
