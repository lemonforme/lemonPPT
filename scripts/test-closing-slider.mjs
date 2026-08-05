import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:8768/');
await page.waitForSelector('.lp-thumbnail', { timeout: 10000 });

async function selectSlide(idx) {
  const thumbs = await page.locator('.lp-thumbnail').all();
  await thumbs[idx].click();
  await page.waitForTimeout(800);
}

async function getActiveContentText(selector) {
  return await page.locator('.lp-slide-wrapper.active ' + selector).innerText().catch(() => 'EMPTY');
}

async function logSlider(label, index) {
  const slider = page.locator('.lp-property-slider').nth(index);
  const badge = page.locator('.lp-property-slider-value').nth(index);
  console.log(label, `[${index}] value:`, await slider.inputValue(), 'badge:', await badge.textContent(), 'max:', await slider.evaluate(el => el.max));
}

async function dragSlider(index, targetValue) {
  const slider = page.locator('.lp-property-slider').nth(index);
  const box = await slider.boundingBox();
  const padding = 9;
  const availW = box.width - padding * 2;
  const min = Number(await slider.evaluate(el => el.min));
  const max = Number(await slider.evaluate(el => el.max));
  const ratio = (targetValue - min) / (max - min);
  const x = padding + ratio * availW;
  const y = box.height / 2;
  await slider.hover({ position: { x: 0, y } });
  await page.mouse.move(box.x + 0, box.y + y);
  await page.mouse.down();
  await page.mouse.move(box.x + x, box.y + y, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(300);
}

console.log('=== content_v1 ===');
await selectSlide(2);
console.log('initial:', (await getActiveContentText('.lp-theme03-content-main')).slice(0, 200));

// slider 2 = col1.points, slider 3 = col2.points
await logSlider('col1 initial', 2);
await dragSlider(2, 1);
await logSlider('col1 to 1', 2);
console.log('after col1 to 1:', (await getActiveContentText('.lp-theme03-content-main')).slice(0, 200));
await dragSlider(2, 3);
await logSlider('col1 to 3', 2);
console.log('after col1 to 3:', (await getActiveContentText('.lp-theme03-content-main')).slice(0, 200));

await logSlider('col2 initial', 3);
await dragSlider(3, 1);
await logSlider('col2 to 1', 3);
console.log('after col2 to 1:', (await getActiveContentText('.lp-theme03-content-main')).slice(0, 200));
await dragSlider(3, 3);
await logSlider('col2 to 3', 3);
console.log('after col2 to 3:', (await getActiveContentText('.lp-theme03-content-main')).slice(0, 200));

await browser.close();
