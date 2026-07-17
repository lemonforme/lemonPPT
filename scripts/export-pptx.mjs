#!/usr/bin/env node
/**
 * 将 goal.json 导出为 PPTX
 * 用法: node scripts/export-pptx.mjs [path/to/goal.json] [path/to/output.pptx]
 */
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDeckToPptx } from '@lemonppt/renderer';
import { validateDeckGoal } from '@lemonppt/core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const goalPath = process.argv[2] ?? path.join(rootDir, 'examples', 'sample-goal.json');
const outFile = process.argv[3] ?? path.join(rootDir, 'output', 'presentation.pptx');

async function main() {
  const raw = await readFile(goalPath, 'utf-8');
  const goal = JSON.parse(raw);

  const validation = validateDeckGoal(goal);
  if (!validation.success) {
    console.error('goal.json 校验失败:');
    console.error(validation.errors?.format());
    process.exit(1);
  }

  await mkdir(path.dirname(outFile), { recursive: true });

  await exportDeckToPptx(validation.data, {
    outFile,
    title: validation.data.title,
    subject: validation.data.goal,
    author: validation.data.owner || 'lemonPPT',
  });

  console.log(`已导出 PPTX: ${outFile}`);
  console.log(`页数: ${validation.data.slides.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
