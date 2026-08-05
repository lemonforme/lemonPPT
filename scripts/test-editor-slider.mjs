import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const editorUrl = 'http://localhost:8081/editor.html';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', (msg) => {
    console.log('CONSOLE', msg.type(), msg.text());
  });
  page.on('pageerror', (err) => {
    console.log('PAGEERROR', err.message);
  });

  await page.goto(editorUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.waitForSelector('.lp-slide-wrapper');

  // 1. metric-v2：指标数调到最大
  await testSlider(page, '3', 'metric-v2');

  // 2. table-of-contents-v1：条目数调到 4
  await testSlider(page, '1', 'table-of-contents-v1');

  // 3. process-v1：步骤数调整
  await testSlider(page, '8', 'process-v1');

  // 4. trend-v1：系列数和数据点调整
  await page.locator('.lp-thumbnail[data-index="11"]').click();
  await page.waitForTimeout(800);
  await page.waitForSelector('.lp-property-slider');
  await page.screenshot({ path: path.join(__dirname, '../output/test-trend-v1.png'), fullPage: false });

  const trendSliders = page.locator('.lp-property-slider');
  await trendSliders.nth(0).evaluate((el) => { el.value = '3'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(300);
  await trendSliders.nth(1).evaluate((el) => { el.value = '5'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, '../output/test-trend-v1-slider.png'), fullPage: false });

  // 5. chart-v1：切换类型
  await page.locator('.lp-thumbnail[data-index="4"]').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, '../output/test-chart-v1.png'), fullPage: false });

  await page.locator('.lp-property-segmented button', { hasText: '折线' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, '../output/test-chart-v1-line.png'), fullPage: false });

  await page.locator('.lp-property-segmented button', { hasText: '饼图' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(__dirname, '../output/test-chart-v1-pie.png'), fullPage: false });

  // 6. 外观模式切换：切到深色，验证背景与文字色变化且无需刷新
  await page.screenshot({ path: path.join(__dirname, '../output/test-theme-light.png'), fullPage: false });
  await page.locator('.lp-appearance-btn[data-appearance="dark"]').click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, '../output/test-theme-dark.png'), fullPage: false });

  const activeScheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  const bgVar = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lp-bg').trim());
  const inkVar = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--lp-ink').trim());
  if (activeScheme !== 'dark' || bgVar !== '#1a1a20' || inkVar !== '#f0f0f5') {
    throw new Error(`外观切换后未生效: scheme=${activeScheme}, bg=${bgVar}, ink=${inkVar}`);
  }

  await browser.close();
  console.log('screenshots saved');
}

async function testSlider(page, dataIndex, name) {
  await page.locator(`.lp-thumbnail[data-index="${dataIndex}"]`).click();
  await page.waitForTimeout(800);
  await page.waitForSelector('.lp-property-slider');
  await page.screenshot({ path: path.join(__dirname, `../output/test-${name}-before.png`), fullPage: false });

  const slider = page.locator('.lp-property-slider').first();
  const max = await slider.evaluate((el) => Number(el.max));
  await slider.evaluate((el, value) => { el.value = String(value); el.dispatchEvent(new Event('input', { bubbles: true })); }, max);
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(__dirname, `../output/test-${name}-after.png`), fullPage: false });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
