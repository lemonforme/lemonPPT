import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../output');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto('http://localhost:8080/editor.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // switch to dark mode
  await page.click('[data-appearance="dark"], .lp-appearance-btn[value="dark"], .lp-appearance-btn:nth-child(2)');
  await page.waitForTimeout(800);

  const thumbs = await page.$$('.lp-thumbnail');
  const targets = [4, 5, 6];
  for (const idx of targets) {
    await thumbs[idx].click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, `editor-slide-dark-${idx}.png`), fullPage: false });
    console.log('saved dark', idx);
  }

  await browser.close();
})();
