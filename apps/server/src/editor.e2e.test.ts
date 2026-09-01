// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { chromium, type Browser, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createServer as createApp } from './server.js';

describe('editor e2e', () => {
  let server: ReturnType<typeof createServer>;
  let port: number;
  let browser: Browser;
  let page: Page;
  const baseUrl = () => `http://localhost:${port}`;

  beforeAll(async () => {
    const app = createApp({ port: 0, outputDir: '/tmp/lemonppt-e2e' });
    server = createServer(app);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    port = (server.address() as AddressInfo).port;

    browser = await chromium.launch();
    page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  }, 120000);

  afterAll(async () => {
    await page?.close();
    await browser?.close();
    await new Promise<void>((resolve) => server?.close(() => resolve()));
  });

  it('loads single-page editor and switches theme without reload', async () => {
    await page.goto(`${baseUrl()}/editor?theme=theme01`, { waitUntil: 'load' });

    // 等待编辑器渲染完成
    await page.waitForSelector('#lp-editor-root', { state: 'visible' });
    await page.waitForSelector('#lp-slides .lp-slide-wrapper', { state: 'visible' });
    await page.waitForTimeout(500);

    const initialTheme = await page.$eval('#lp-theme-select', (el) => (el as HTMLSelectElement).value);
    expect(initialTheme).toBe('theme01');

    // 切换主题
    await page.selectOption('#lp-theme-select', 'theme03');
    await page.waitForFunction(
      () => {
        const link = document.getElementById('lp-theme-css') as HTMLLinkElement | null;
        return link?.href.includes('theme03.css');
      },
      { timeout: 10000 }
    );

    const switchedTheme = await page.$eval('#lp-theme-select', (el) => (el as HTMLSelectElement).value);
    expect(switchedTheme).toBe('theme03');

    const url = page.url();
    expect(url).toContain('theme=theme03');
  }, 60000);

  it('edits slide content and persists after reload', async () => {
    await page.goto(`${baseUrl()}/editor?theme=theme01`, { waitUntil: 'load' });
    await page.waitForSelector('#lp-editor-root', { state: 'visible' });

    // 定位第一个可编辑标题
    const titleSelector = '[data-lp-slide-idx="0"][data-lp-prop="title"]'; 
    await page.waitForSelector(titleSelector, { state: 'visible' });

    const newTitle = 'E2E 测试标题 ' + Date.now();
    await page.fill(titleSelector, newTitle);
    await page.press(titleSelector, 'Enter');

    // 点击保存按钮触发手动保存
    await page.click('#lp-save-deck');
    await page.waitForTimeout(600);

    // 刷新页面，验证 localStorage 恢复
    await page.reload({ waitUntil: 'load' });
    await page.waitForSelector(titleSelector, { state: 'visible' });

    // 等待 editor-script 从 localStorage 恢复并重新渲染标题
    await page.waitForFunction(
      ({ sel, expected }: { sel: string; expected: string }) => {
        const el = document.querySelector(sel);
        return el !== null && el.textContent === expected;
      },
      { sel: titleSelector, expected: newTitle },
      { timeout: 5000 }
    );

    const persistedTitle = await page.$eval(titleSelector, (el) => el.textContent);
    expect(persistedTitle).toBe(newTitle);
  }, 60000);
});
