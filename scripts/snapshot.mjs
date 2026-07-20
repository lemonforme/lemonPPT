#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 视觉回归快照脚本
 * 基于 gallery 生成的 HTML 为每个版式截图，保存为 PNG 基线。
 *
 * 用法：
 *   node scripts/snapshot.mjs [theme]
 * 输出：
 *   output/snapshots/<theme>/<layout>.png
 *   output/snapshots/<theme>/manifest.json
 */

import { chromium } from 'playwright';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const galleryDir = path.join(rootDir, 'output', 'gallery');
const snapshotDir = path.join(rootDir, 'output', 'snapshots');

const THEMES = ['base', 'dark-tech', 'warm-business'];

function fileUrl(theme) {
  return 'file://' + path.join(galleryDir, theme, 'index.html');
}

async function ensureBrowser() {
  try {
    await chromium.launch();
  } catch (err) {
    if (err.message && err.message.includes('Executable doesn\'t exist')) {
      console.error('未找到 Chromium，请运行：npx playwright install chromium');
      process.exit(1);
    }
    throw err;
  }
}

async function captureTheme(browser, theme) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const url = fileUrl(theme);
  await page.goto(url, { waitUntil: 'networkidle' });

  const items = await page.locator('.lp-gallery-item').all();
  const themeSnapshotDir = path.join(snapshotDir, theme);
  await mkdir(themeSnapshotDir, { recursive: true });

  const manifest = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const label = await item.locator('.lp-gallery-label').textContent();
    const layout = label.trim();
    const slideEl = item.locator('.lp-gallery-slide');
    const screenshotPath = path.join(themeSnapshotDir, `${layout}.png`);
    await slideEl.screenshot({ path: screenshotPath, type: 'png' });
    manifest.push({ layout, screenshot: path.relative(rootDir, screenshotPath) });
    console.log(`  ✅ ${layout}`);
  }

  await writeFile(
    path.join(themeSnapshotDir, 'manifest.json'),
    JSON.stringify({ theme, capturedAt: new Date().toISOString(), slides: manifest }, null, 2),
    'utf-8'
  );

  await page.close();
}

async function main() {
  const requestedTheme = process.argv[2];
  const themes = requestedTheme ? [requestedTheme] : THEMES;
  const invalid = themes.filter((t) => !THEMES.includes(t));
  if (invalid.length) {
    console.error(`未知主题: ${invalid.join(', ')}，可选: ${THEMES.join(', ')}`);
    process.exit(1);
  }

  await ensureBrowser();

  const browser = await chromium.launch();
  try {
    for (const theme of themes) {
      console.log(`\n📸 正在生成 ${theme} 主题快照...`);
      await captureTheme(browser, theme);
    }
    console.log(`\n全部完成：${path.join(snapshotDir)}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('快照生成失败：', err);
  process.exit(1);
});
