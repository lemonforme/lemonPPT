import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const outputDir = path.resolve(process.cwd(), 'output');

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/editor.html' : req.url;
  const filePath = path.join(outputDir, url.split('?')[0]);
  if (!filePath.startsWith(outputDir)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    const ct = ext === '.js' ? 'application/javascript' : ext === '.css' ? 'text/css' : 'text/html';
    res.setHeader('Content-Type', ct);
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(8099, resolve));
console.log('server listening on http://localhost:8099');

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto('http://localhost:8099/editor.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);

async function clickThumbnailByTitle(title) {
  const thumb = await page.locator('.lp-thumbnail').filter({ hasText: title }).first();
  if (await thumb.count() === 0) throw new Error('thumbnail not found: ' + title);
  await thumb.click();
  await page.waitForTimeout(300);
}

async function getActiveSlideHtml() {
  return page.locator('.lp-slide-wrapper.active').first().innerHTML();
}

// === 测试 chart-v1 图表切换和数据修改 ===
await clickThumbnailByTitle('用户增长趋势');
const barSvg = await page.locator('.lp-slide-wrapper.active svg').first().innerHTML();
console.log('chart bar svg contains rect:', barSvg.includes('<rect'));

await page.locator('.lp-property-segmented button:has-text("折线")').first().click();
await page.waitForTimeout(300);
const lineSvg = await page.locator('.lp-slide-wrapper.active svg').first().innerHTML();
console.log('chart after line click, contains polyline:', lineSvg.includes('<polyline'));

const dataInput = await page.locator('.lp-property-section:has(.lp-property-section-title:has-text("数据")) .lp-property-array-item input').first();
await dataInput.fill('9999');
await page.waitForTimeout(300);
const updatedSvg = await page.locator('.lp-slide-wrapper.active svg').first().innerHTML();
console.log('chart after data change, contains 9999:', updatedSvg.includes('9999'));

// === 测试 process-v1 步骤新增条目 ===
await clickThumbnailByTitle('从想法到成稿');
const beforeSteps = await getActiveSlideHtml();
console.log('process step count before:', (beforeSteps.match(/lp-process-step-text/g) || []).length);

const stepSlider = await page.locator('.lp-property-section:has(.lp-property-section-title:has-text("步骤")) .lp-property-slider').first();
await stepSlider.evaluate((el) => { el.value = '5'; el.dispatchEvent(new Event('input', { bubbles: true })); });
await page.waitForTimeout(300);
const afterSteps = await getActiveSlideHtml();
console.log('process step count after slider to 5:', (afterSteps.match(/lp-process-step-text/g) || []).length);
console.log('process new step has sample text:', afterSteps.includes('示例项'));

// === 测试 risk-v1 新增条目 ===
await clickThumbnailByTitle('项目关键风险与应对');
const beforeRisk = await getActiveSlideHtml();
console.log('risk card count before:', (beforeRisk.match(/lp-risk-v1-card/g) || []).length);

const itemSlider = await page.locator('.lp-property-section:has(.lp-property-section-title:has-text("目录项")) .lp-property-slider').first();
await itemSlider.evaluate((el) => { el.value = '3'; el.dispatchEvent(new Event('input', { bubbles: true })); });
await page.waitForTimeout(300);
await itemSlider.evaluate((el) => { el.value = '4'; el.dispatchEvent(new Event('input', { bubbles: true })); });
await page.waitForTimeout(300);
const afterRisk = await getActiveSlideHtml();
console.log('risk card count after slider to 4:', (afterRisk.match(/lp-risk-v1-card/g) || []).length);
console.log('risk new card has sample text:', afterRisk.includes('示例文字'));

await browser.close();
server.close();
