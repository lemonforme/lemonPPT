import type { DeckGoal } from '@lemonppt/core';
import { normalizeDeckGoal } from '@lemonppt/core';
import { writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium } from 'playwright';
import { renderDeck } from './render.js';

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

  const tempDir = await os.tmpdir();
  const tempHtml = path.join(tempDir, `lemonppt-${Date.now()}.html`);
  await writeFile(tempHtml, result.html, 'utf-8');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto('file://' + tempHtml, { waitUntil: 'networkidle' });
    await page.pdf({
      path: outFile,
      width: `${width}px`,
      height: `${height}px`,
      printBackground: true,
      preferCSSPageSize: false,
    });
  } finally {
    await browser.close();
  }
}
