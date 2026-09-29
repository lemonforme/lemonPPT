import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
const page = await context.newPage();
await page.goto('http://127.0.0.1:3457/theme02-test/editor.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'output/test-theme02-before.png' });
const inputHandle = await page.evaluateHandle(() => {
  const inputs = Array.from(document.querySelectorAll('#lp-property-content input[type="number"]'));
  return inputs.find(i => i.value === '20');
});
const el = inputHandle.asElement();
if (el && await el.isVisible().catch(()=>false)) {
  const oldVal = await el.inputValue();
  console.log('old', oldVal);
  await el.fill('99');
  await el.press('Tab');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'output/test-theme02-after.png' });
  console.log('done');
} else {
  console.log('no number values input', await page.evaluate(() => Array.from(document.querySelectorAll('#lp-property-content input')).map(i => i.value).slice(0,30)));
}
await browser.close();
