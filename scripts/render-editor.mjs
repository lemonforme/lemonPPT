// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { renderDeck } from '@lemonppt/renderer';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
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

  const cssSource = path.join(rootDir, 'packages/themes/src/base/styles.css');
  const cssDest = path.join(assetsDir, 'base.css');
  await copyFile(cssSource, cssDest);

  await writeFile(outFile, result.html, 'utf-8');

  console.log(`已生成可编辑预览: ${outFile}`);
  console.log(`提示：用浏览器打开后可直接编辑文字，点击顶部按钮下载 goal.json 或导出 PPTX。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
