#!/usr/bin/env node
/**
 * 渲染示例 goal.json 到 output/index.html
 * 用法: node scripts/render.mjs [path/to/goal.json]
 */
import { readFile, mkdir, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderDeck } from '@lemonppt/renderer';
import { validateDeckGoal } from '@lemonppt/core';

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

  const result = renderDeck(validation.data);

  await mkdir(assetsDir, { recursive: true });
  await copyFile(
    path.join(rootDir, 'packages', 'themes', 'src', 'base', 'styles.css'),
    path.join(assetsDir, 'base.css')
  );

  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'index.html'), result.html, 'utf-8');

  console.log(`已生成: ${path.join(outputDir, 'index.html')}`);
  console.log(`页数: ${validation.data.slides.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
