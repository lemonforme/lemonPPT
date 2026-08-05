import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../output');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto('http://localhost:8080/editor.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const thumbs = await page.$$('.lp-thumbnail');
  console.log('thumbnails', thumbs.length);

  const targets = [4, 5, 6, 7].filter(i => i < thumbs.length);

  for (const idx of targets) {
    await thumbs[idx].click();
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(outDir, `editor-slide-${idx}.png`),
      fullPage: false,
    });
    console.log('saved editor-slide-' + idx + '.png');
  }

  await browser.close();
  console.log('done');
})();
