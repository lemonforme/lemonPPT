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
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const galleryDir = path.join(rootDir, 'output', 'gallery');
const snapshotDir = path.join(rootDir, 'output', 'snapshots');

const THEMES = ['theme01', 'theme02', 'theme03', 'theme04', 'theme05', 'theme06', 'theme07', 'theme08', 'theme09', 'theme10', 'theme11'];

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

async function waitForECharts(page) {
  // 等待 ECharts 异步脚本加载并初始化完成：每个 data-lp-echart-type 容器内都应出现 SVG/Canvas。
  try {
    await page.waitForFunction(
      () => {
        const containers = document.querySelectorAll('[data-lp-echart-type]');
        if (containers.length === 0) return true;
        const rendered = document.querySelectorAll('[data-lp-echart-type] svg, [data-lp-echart-type] canvas');
        return rendered.length >= containers.length;
      },
      { timeout: 10000, polling: 100 }
    );
  } catch {
    // 超时仅作警告，不影响后续截图
    console.warn('  ⚠️ 部分 ECharts 图表未在超时内完成渲染');
  }
}

async function captureTheme(browser, theme) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const url = fileUrl(theme);
  // CI 中 networkidle 容易因字体/异步资源pending而超时，改用 load + 固定等待
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  // 禁用进入动画，避免截图时机不同导致像素差异
  await page.addStyleTag({
    content: '*, *::before, *::after { animation: none !important; transition: none !important; } .lp-rise, .lp-theme11 .lp-rise { opacity: 1 !important; transform: none !important; }',
  });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await waitForECharts(page);
  // 额外等待 ECharts 内部动画（力导向图布局、入场动画）稳定，避免截图时节点/线条尚未到位。
  await page.waitForTimeout(500);

  const items = await page.locator('.lp-gallery-item').all();
  const themeSnapshotDir = path.join(snapshotDir, theme);
  await mkdir(themeSnapshotDir, { recursive: true });

  // 清理旧快照，避免已废弃版式残留影响回归统计。
  const oldEntries = await readdir(themeSnapshotDir);
  for (const entry of oldEntries) {
    if (entry === 'baseline' || entry === 'diff') continue;
    await rm(path.join(themeSnapshotDir, entry), { recursive: true, force: true });
  }

  const manifest = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const label = await item.locator('.lp-gallery-label').textContent();
    const layout = label.trim();
    const slideEl = item.locator('.lp-gallery-slide');
    const screenshotPath = path.join(themeSnapshotDir, `${layout}.png`);
    // 对每个包含图表的 slide，再次确保其内部 ECharts 已渲染（长页面中可能出现 lazy 渲染）
    await item.locator('[data-lp-echart-type]').first().waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
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
    await Promise.race([
      browser.close(),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('快照生成失败：', err);
  process.exit(1);
});
