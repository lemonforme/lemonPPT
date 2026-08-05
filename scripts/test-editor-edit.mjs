#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // 启动本地服务器
  const http = await import('node:http');
  const fs = await import('node:fs/promises');
  const server = http.createServer(async (req, res) => {
    const filePath = path.join(rootDir, 'output', req.url === '/' ? '/editor-theme06-audit.html' : req.url);
    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch (err) {
      res.writeHead(404);
      res.end(String(err));
    }
  });
  await new Promise((resolve) => server.listen(9877, resolve));

  try {
    await page.goto('http://localhost:9877/editor-theme06-audit.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // 点击封面主标题（限定在主编辑区 active slide 内，避免命中左侧缩略图）
    const titleEl = await page.locator('.lp-slide-wrapper.active h1.lp-theme06-cover-title').first();
    await titleEl.click();
    // 使用 fill 确保完全替换原有内容
    await titleEl.fill('theme06 编辑测试主标题');

    // 点击空白处 blur
    await page.locator('.lp-editor-stage').first().click({ position: { x: 50, y: 50 } });
    await page.waitForTimeout(800);

    // 读取 localStorage 中的 goal
    const goalJson = await page.evaluate(() => localStorage.getItem('lemonppt:editor:v2:theme06-audit'));
    if (!goalJson) {
      console.log('未在 localStorage 中找到保存的 goal');
      return;
    }

    const goal = JSON.parse(goalJson);
    console.log('保存的 goal keys:', Object.keys(goal).join(', '));
    const history = goal.history || [];
    console.log('历史栈长度:', history.length);
    if (history.length > 0) {
      const current = history[goal.historyIndex ?? history.length - 1];
      console.log('当前标题:', current?.slides?.[0]?.props?.title);
      console.log('撤销可用:', history.length > 1);
    } else {
      console.log('goal.slides 长度:', goal.slides?.length);
      console.log('goal.slides[0].props.title:', goal.slides?.[0]?.props?.title);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
