#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * JS 注入提取 vs CDP 提取对比脚本（阶段 2 POC）。
 *
 * 对指定 goal.json 渲染后，逐页对比：
 * - 提取耗时
 * - 文本框数量
 * - 图片数量
 * - 区域识别数量
 * - CDP 快照/层数据可用性
 *
 * 用法：
 *   node scripts/compare-extraction-modes.mjs
 *   node scripts/compare-extraction-modes.mjs --goal ./examples/sample-goal.json
 *   node scripts/compare-extraction-modes.mjs --goal ./examples/sample-goal.json --pages 5
 */

import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { renderDeck } from '@lemonppt/renderer';
import { validateDeckGoal, validateDeckGoalContent } from '@lemonppt/core';
import { cdpExtraction } from '@lemonppt/dom-to-pptx';

const {
  createCdpSession,
  captureDomSnapshot,
  captureLayers,
  convertCdpSnapshotToSlideData,
} = cdpExtraction;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const goalArgIndex = args.indexOf('--goal');
const goalPath = goalArgIndex !== -1 && args[goalArgIndex + 1]
  ? path.resolve(args[goalArgIndex + 1])
  : path.join(rootDir, 'examples', 'sample-goal.json');

const pagesArg = args.find((a) => a.startsWith('--pages='));
const maxPages = pagesArg ? parseInt(pagesArg.replace('--pages=', ''), 10) : undefined;
const enableLayers = args.includes('--layers');

const EXTRACT_SCRIPT = `
function getWrapper(slideIndex) {
  return document.querySelector('.lp-slide-wrapper[data-slide-index="' + slideIndex + '"]');
}

function extractTextBoxes(slideIndex) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return { boxes: [] };
  const boxes = [];
  const walk = (el) => {
    for (const child of Array.from(el.children)) {
      const hasText = Array.from(child.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim().length > 0
      );
      if (hasText) {
        const rect = child.getBoundingClientRect();
        const text = (child.innerText || child.textContent || '').trim();
        if (text && rect.width >= 1 && rect.height >= 1) {
          const style = window.getComputedStyle(child);
          if (style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) !== 0) {
            boxes.push({
              text: text.slice(0, 80),
              x: rect.x,
              y: rect.y,
              w: rect.width,
              h: rect.height,
              fontSize: parseFloat(style.fontSize) || 16,
            });
          }
        }
      }
      walk(child);
    }
  };
  walk(wrapper);
  return { boxes };
}

function extractImages(slideIndex) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return [];
  return Array.from(wrapper.querySelectorAll('img'))
    .filter((img) => img.complete && img.naturalWidth > 0)
    .map((img) => {
      const rect = img.getBoundingClientRect();
      return { src: img.src.slice(0, 80), x: rect.x, y: rect.y, w: rect.width, h: rect.height };
    });
}

function detectFallbackRegions(slideIndex) {
  const wrapper = getWrapper(slideIndex);
  if (!wrapper) return [];
  return Array.from(wrapper.querySelectorAll('[data-lp-fallback-region]')).map((el) => {
    const rect = el.getBoundingClientRect();
    return {
      kind: el.getAttribute('data-lp-fallback-region'),
      x: rect.x,
      y: rect.y,
      w: rect.width,
      h: rect.height,
    };
  });
}

window.__lemonPPT_compareExtract = { extractTextBoxes, extractImages, detectFallbackRegions };
`;

async function prepareHtml(goal) {
  const result = renderDeck(goal, { width: 1280, height: 720 });
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-compare-'));
  const assetsDest = path.join(tempDir, 'assets');
  await mkdir(assetsDest, { recursive: true });

  const rendererAssets = path.join(rootDir, 'packages', 'renderer', 'assets');
  await cp(rendererAssets, assetsDest, { recursive: true, force: true });

  const themeCss = path.join(rootDir, 'packages', 'themes', 'src', goal.theme || 'theme01', 'styles.css');
  await cp(themeCss, path.join(assetsDest, `${goal.theme || 'theme01'}.css`), { force: true });

  const html = result.html.replace(/\.\/assets\//g, './assets/');
  const htmlPath = path.join(tempDir, 'index.html');
  await writeFile(htmlPath, html, 'utf-8');

  return { htmlPath, tempDir, assets: result.assets };
}

async function main() {
  const raw = await readFile(goalPath, 'utf-8');
  const goal = JSON.parse(raw);

  const validation = validateDeckGoal(goal);
  if (!validation.success) {
    console.error('goal.json 校验失败:');
    console.error(validation.errors?.format());
    process.exit(1);
  }

  const contentErrors = validateDeckGoalContent(validation.data);
  if (contentErrors.length > 0) {
    console.warn('内容字段缺失（可能导致空白页或占位提示）:');
    contentErrors.forEach((e) => console.warn('  ⚠️ ' + e));
  }

  const { htmlPath, tempDir } = await prepareHtml(validation.data);
  console.log(`🍋 对比目标: ${goalPath}`);
  console.log(`   临时页面: ${htmlPath}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  try {
    await page.goto('file://' + htmlPath, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });
    await page.addScriptTag({ content: EXTRACT_SCRIPT });

    // 初始化 ECharts（若页面使用）。
    try {
      await page.evaluate(async () => {
        if (typeof window.__lemonPPT_initECharts === 'function') {
          await window.__lemonPPT_initECharts();
        }
      });
      await page.waitForTimeout(600);
    } catch {
      // ignore
    }

    const slideCount = await page.evaluate(() => document.querySelectorAll('.lp-slide-wrapper').length);
    const pages = Math.min(slideCount, maxPages ?? slideCount);

    console.log(`   总页数: ${slideCount}，本次对比: ${pages} 页\n`);

    const cdp = await createCdpSession(page);
    const results = [];

    for (let i = 0; i < pages; i++) {
      // 只显示当前页。
      await page.evaluate((idx) => {
        document.querySelectorAll('.lp-slide-wrapper').forEach((el, index) => {
          const wrapper = el;
          if (index === idx) {
            wrapper.style.opacity = '1';
            wrapper.style.visibility = 'visible';
            wrapper.style.zIndex = '9999';
          } else {
            wrapper.style.opacity = '0';
            wrapper.style.visibility = 'hidden';
            wrapper.style.zIndex = '0';
          }
        });
        void document.body.offsetHeight;
      }, i);
      await page.waitForTimeout(200);

      // JS 注入提取。
      const jsStart = performance.now();
      const jsText = await page.evaluate((idx) => window.__lemonPPT_compareExtract.extractTextBoxes(idx), i);
      const jsImages = await page.evaluate((idx) => window.__lemonPPT_compareExtract.extractImages(idx), i);
      const jsRegions = await page.evaluate((idx) => window.__lemonPPT_compareExtract.detectFallbackRegions(idx), i);
      const jsTime = performance.now() - jsStart;

      // CDP DOMSnapshot 提取。
      // 获取当前幻灯片边界框，用于 CDP 数据过滤。
      const slideBounds = await page.evaluate((idx) => {
        const wrapper = document.querySelector(`.lp-slide-wrapper[data-slide-index="${idx}"]`);
        if (!wrapper) return null;
        const rect = wrapper.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }, i);

      // CDP 提取前，临时隐藏其他幻灯片（保留 DOM，避免整页布局变化），
      // 使 DOMSnapshot 仅包含当前页内容，与 JS 注入范围对齐。
      const hiddenSlideIds = await page.evaluate((idx) => {
        const ids = [];
        document.querySelectorAll('.lp-slide-wrapper').forEach((el, index) => {
          if (index !== idx) {
            const wrapper = el;
            ids.push({ index, prevDisplay: wrapper.style.display });
            wrapper.style.display = 'none';
          }
        });
        void document.body.offsetHeight;
        return ids;
      }, i);

      const cdpStart = performance.now();
      const snapshot = await captureDomSnapshot(page, cdp);
      const cdpSnapshotTime = performance.now() - cdpStart;

      const layerStart = performance.now();
      const layers = enableLayers ? await captureLayers(page, cdp) : [];
      const cdpLayerTime = performance.now() - layerStart;

      // 恢复其他幻灯片显示。
      await page.evaluate((hidden) => {
        for (const { index, prevDisplay } of hidden) {
          const wrapper = document.querySelector(`.lp-slide-wrapper[data-slide-index="${index}"]`);
          if (wrapper) {
            wrapper.style.display = prevDisplay || '';
          }
        }
        void document.body.offsetHeight;
      }, hiddenSlideIds);

      const convertStart = performance.now();
      const slideData = convertCdpSnapshotToSlideData(snapshot, {
        screenshotPath: '',
        slideIndex: i,
        slideBounds: slideBounds ?? undefined,
      });
      const cdpConvertTime = performance.now() - convertStart;

      results.push({
        slide: i + 1,
        js: {
          time: Math.round(jsTime),
          textBoxes: jsText.boxes.length,
          images: jsImages.length,
          regions: jsRegions.length,
        },
        cdp: {
          snapshotTime: Math.round(cdpSnapshotTime),
          layerTime: Math.round(cdpLayerTime),
          convertTime: Math.round(cdpConvertTime),
          totalTime: Math.round(cdpSnapshotTime + cdpLayerTime + cdpConvertTime),
          textBoxes: slideData.textBoxes.length,
          images: slideData.images.length,
          layers: layers.length,
          regions: 0, // POC 未实现 CDP 区域识别
        },
      });

      console.log(
        `[slide ${String(i + 1).padStart(2, '0')}] ` +
        `JS: ${results[i].js.time.toString().padStart(4, ' ')}ms ` +
        `(text=${results[i].js.textBoxes}, img=${results[i].js.images}, region=${results[i].js.regions}) | ` +
        `CDP: ${results[i].cdp.totalTime.toString().padStart(4, ' ')}ms ` +
        `(snap=${results[i].cdp.snapshotTime}, layer=${results[i].cdp.layerTime}, text=${results[i].cdp.textBoxes}, img=${results[i].cdp.images}, layers=${results[i].cdp.layers})`,
      );
    }

    // 汇总。
    const totalJs = results.reduce((sum, r) => sum + r.js.time, 0);
    const totalCdp = results.reduce((sum, r) => sum + r.cdp.totalTime, 0);
    const totalJsText = results.reduce((sum, r) => sum + r.js.textBoxes, 0);
    const totalCdpText = results.reduce((sum, r) => sum + r.cdp.textBoxes, 0);
    const totalJsRegions = results.reduce((sum, r) => sum + r.js.regions, 0);
    const totalLayers = results.reduce((sum, r) => sum + r.cdp.layers, 0);

    console.log('\n📊 汇总');
    console.log(`   JS 注入总耗时: ${totalJs}ms，文本框: ${totalJsText}，区域: ${totalJsRegions}`);
    console.log(`   CDP 总耗时: ${totalCdp}ms，文本框: ${totalCdpText}，合成层: ${totalLayers}`);
    console.log(`   CDP/JS 耗时比: ${(totalCdp / Math.max(totalJs, 1)).toFixed(2)}`);

    const reportPath = path.join(rootDir, 'output', 'compare-extraction-report.json');
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(
      reportPath,
      JSON.stringify(
        {
          goal: goalPath,
          slides: pages,
          totalJs,
          totalCdp,
          jsTextBoxes: totalJsText,
          cdpTextBoxes: totalCdpText,
          jsRegions: totalJsRegions,
          cdpLayers: totalLayers,
          details: results,
        },
        null,
        2,
      ),
      'utf-8',
    );
    console.log(`\n📝 报告已保存: ${reportPath}`);
  } finally {
    await browser.close().catch(() => {});
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
