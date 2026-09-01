#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'node:fs';

const outDir = 'output/theme11-verification';
fs.mkdirSync(outDir, { recursive: true });

async function fetchDebugLogs() {
  try {
    const res = await fetch('http://127.0.0.1:7777/logs');
    const data = await res.json();
    return data || [];
  } catch (e) {
    return [];
  }
}

function writeLogs(name, logs) {
  fs.writeFileSync(`${outDir}/${name}.ndjson`, logs.map((l) => JSON.stringify(l)).join('\n'));
}

function attachConsole(page, allConsole) {
  page.on('console', (msg) => allConsole.push({ url: page.url().slice(-80), type: msg.type(), text: msg.text() }));
  page.on('pageerror', (err) => allConsole.push({ url: page.url().slice(-80), type: 'pageerror', text: String(err) }));
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });

const allConsole = [];

// 1. Gallery theme11
const galleryPage = await context.newPage();
attachConsole(galleryPage, allConsole);
await galleryPage.goto('http://localhost:8080/gallery/theme11/index.html', { waitUntil: 'networkidle' });
await galleryPage.waitForTimeout(3000);
await galleryPage.screenshot({ path: `${outDir}/gallery-theme11.png`, fullPage: true });

// 2. Editor
const editorPage = await context.newPage();
attachConsole(editorPage, allConsole);
await editorPage.goto('http://localhost:8080/theme11-insight/editor.html', { waitUntil: 'networkidle' });
await editorPage.waitForTimeout(2000);
await editorPage.screenshot({ path: `${outDir}/editor-initial.png` });

const thumbs = await editorPage.locator('.lp-thumbnail').all();
console.log('thumbnails count:', thumbs.length);

// Screenshot each chart slide
for (let i = 0; i < thumbs.length; i++) {
  const thumb = editorPage.locator('.lp-thumbnail').nth(i);
  const layout = await thumb.getAttribute('data-layout');
  await thumb.click();
  await editorPage.waitForTimeout(700);
  const active = editorPage.locator('.lp-slide-wrapper.active');
  await active.screenshot({ path: `${outDir}/slide-${String(i).padStart(2, '0')}-${layout}.png` });
}

// Open bar chart (index 0 likely theme11_chart_bar_v1)
const barThumb = editorPage.locator('.lp-thumbnail').nth(0);
await barThumb.click();
await editorPage.waitForTimeout(500);

// Edit a chart data text field in the right panel: values
const valuesHandle = await editorPage.evaluateHandle(() => {
  const inputs = Array.from(document.querySelectorAll('#lp-property-content input[type="text"]'));
  return inputs.find((inp) => inp.value === '24,38,52,67');
});
const valuesField = valuesHandle.asElement();
if (valuesField && await valuesField.isVisible().catch(() => false)) {
  await valuesField.fill('10,20,30,40');
  await valuesField.press('Tab');
  await editorPage.waitForTimeout(800);
  await editorPage.screenshot({ path: `${outDir}/editor-after-values-edit.png` });
}

// Interact with categories array: reduce to 2 then increase to 4
const categoriesSection = editorPage.locator('.lp-property-section', { has: editorPage.locator('.lp-property-section-title:has-text("类目")') }).first();
if (await categoriesSection.isVisible().catch(() => false)) {
  const range = categoriesSection.locator('input[type="range"]').first();
  await range.fill('2');
  await range.dispatchEvent('input');
  await editorPage.waitForTimeout(500);
  await range.fill('4');
  await range.dispatchEvent('input');
  await editorPage.waitForTimeout(500);
  // Screenshot right panel showing array items
  const panel = editorPage.locator('#lp-property-content');
  await panel.screenshot({ path: `${outDir}/editor-categories-array.png` });
}

// Open parallel chart slide and screenshot
const parallelThumb = editorPage.locator('.lp-thumbnail[data-layout="theme11_chart_parallel_v1"]').first();
if (await parallelThumb.isVisible().catch(() => false)) {
  await parallelThumb.click();
  await editorPage.waitForTimeout(800);
  const active = editorPage.locator('.lp-slide-wrapper.active');
  await active.screenshot({ path: `${outDir}/slide-parallel-postfix.png` });
}

await browser.close();

const logs = await fetchDebugLogs();
writeLogs('debug-logs', logs);
fs.writeFileSync(`${outDir}/console.ndjson`, allConsole.map((c) => JSON.stringify(c)).join('\n'));

console.log('verification done');
console.log('screenshots in', outDir);
console.log('debug logs count:', logs.length);
console.log('console messages count:', allConsole.length);
