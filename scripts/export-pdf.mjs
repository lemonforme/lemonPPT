// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { exportDeckToPdf } from '@lemonppt/renderer';
import { mkdir } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const inputFile = process.argv[2] || path.join(rootDir, 'examples/sample-goal.json');
const outFile = process.argv[3] || path.join(rootDir, 'output/presentation.pdf');

async function main() {
  const goal = JSON.parse(await readFile(inputFile, 'utf-8'));
  await mkdir(path.dirname(outFile), { recursive: true });

  await exportDeckToPdf(goal, { outFile });

  console.log(`已生成 PDF: ${outFile}`);
  console.log(`页数: ${goal.slides.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
