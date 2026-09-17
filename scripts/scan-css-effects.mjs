#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 扫描 theme gallery 中 CSS 渐变/阴影/clip-path 使用情况，
 * 评估矢量化可行性。
 *
 * 用法：
 *   node scripts/scan-css-effects.mjs --theme theme02
 *   node scripts/scan-css-effects.mjs --theme theme04
 *   node scripts/scan-css-effects.mjs --theme theme02 --pages 5
 */

import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { renderDeck } from '@lemonppt/renderer';
import { validateDeckGoal, validateDeckGoalContent } from '@lemonppt/core';
import { classifyGradient, parseBoxShadow, parseClipPath, parseLinearGradient } from '@lemonppt/dom-to-pptx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const themeArg = args.find((a) => a.startsWith('--theme='));
const theme = themeArg ? themeArg.replace('--theme=', '') : 'theme02';
const pagesArg = args.find((a) => a.startsWith('--pages='));
const maxPages = pagesArg ? parseInt(pagesArg.replace('--pages=', ''), 10) : undefined;

async function prepareHtml(goal) {
  const result = renderDeck(goal, { width: 1280, height: 720 });
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'lemonppt-css-effects-'));
  const assetsDest = path.join(tempDir, 'assets');
  await mkdir(assetsDest, { recursive: true });

  const rendererAssets = path.join(rootDir, 'packages', 'renderer', 'assets');
  await cp(rendererAssets, assetsDest, { recursive: true, force: true });

  const themeCss = path.join(rootDir, 'packages', 'themes', 'src', goal.theme || theme, 'styles.css');
  await cp(themeCss, path.join(assetsDest, `${goal.theme || theme}.css`), { force: true });

  const html = result.html.replace(/\.\/assets\//g, './assets/');
  const htmlPath = path.join(tempDir, 'index.html');
  await writeFile(htmlPath, html, 'utf-8');

  return { htmlPath, tempDir };
}

async function main() {
  const goalPath = path.join(rootDir, 'output', `${theme}-gallery-goal.json`);
  const raw = await import('node:fs/promises').then((m) => m.readFile(goalPath, 'utf-8'));
  const goal = JSON.parse(raw);

  const validation = validateDeckGoal(goal);
  if (!validation.success) {
    console.error('goal.json 校验失败');
    process.exit(1);
  }

  const contentErrors = validateDeckGoalContent(validation.data);
  if (contentErrors.length > 0) {
    console.warn('内容字段缺失:', contentErrors.join(', '));
  }

  const { htmlPath, tempDir } = await prepareHtml(validation.data);
  console.log(`🍋 扫描主题: ${theme}`);
  console.log(`   临时页面: ${htmlPath}\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  try {
    await page.goto('file://' + htmlPath, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: '* { animation: none !important; transition: none !important; }' });

    // 初始化 ECharts。
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

    const totals = {
      gradientElements: 0,
      gradientLinear: 0,
      gradientLinearVectorizable: 0,
      gradientRadial: 0,
      gradientMultiple: 0,
      gradientUnsupported: 0,
      shadowElements: 0,
      shadowVectorizable: 0,
      clipPathElements: 0,
      clipPathVectorizable: 0,
    };

    const perSlide = [];

    for (let i = 0; i < pages; i++) {
      // 仅显示当前页。
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

      // 扫描当前页元素。
      const scanResult = await page.evaluate(() => {
        const wrapper = document.querySelector('.lp-slide-wrapper[data-slide-index="' + window.__lemonPPT_currentSlide + '"]') ||
          document.querySelectorAll('.lp-slide-wrapper')[window.__lemonPPT_currentSlide];
        if (!wrapper) return [];

        const results = [];
        const walk = (el) => {
          if (el.getAttribute?.('data-lp-fallback-region')) return; // 跳过复杂区域内部
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) return;

          const bg = style.backgroundImage;
          const hasGradient = bg && /linear-gradient|radial-gradient|conic-gradient/.test(bg);
          const hasShadow = style.boxShadow && style.boxShadow !== 'none';
          const hasClipPath = style.clipPath && style.clipPath !== 'none';

          if (hasGradient || hasShadow || hasClipPath) {
            results.push({
              tag: el.tagName,
              gradient: hasGradient ? bg : undefined,
              shadow: hasShadow ? style.boxShadow : undefined,
              clipPath: hasClipPath ? style.clipPath : undefined,
              rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            });
          }

          for (const child of Array.from(el.children)) walk(child);
        };

        window.__lemonPPT_currentSlide = 0; // placeholder, actual index passed differently
        walk(wrapper);
        return results;
      });

      // 修正：重新执行扫描并传入当前索引，避免上面 placeholder 问题。
      const items = await page.evaluate((idx) => {
        const all = document.querySelectorAll('.lp-slide-wrapper');
        const wrapper = all[idx];
        if (!wrapper) return [];

        const results = [];
        const walk = (el) => {
          if (el.getAttribute?.('data-lp-fallback-region')) return;
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) return;

          const bg = style.backgroundImage;
          const hasGradient = bg && /linear-gradient|radial-gradient|conic-gradient/.test(bg);
          const hasShadow = style.boxShadow && style.boxShadow !== 'none';
          const hasClipPath = style.clipPath && style.clipPath !== 'none';

          if (hasGradient || hasShadow || hasClipPath) {
            results.push({
              tag: el.tagName,
              gradient: hasGradient ? bg : undefined,
              shadow: hasShadow ? style.boxShadow : undefined,
              clipPath: hasClipPath ? style.clipPath : undefined,
            });
          }

          for (const child of Array.from(el.children)) walk(child);
        };
        walk(wrapper);
        return results;
      }, i);

      let slideGradients = 0;
      let slideGradientLinear = 0;
      let slideGradientLinearVectorizable = 0;
      let slideGradientRadial = 0;
      let slideGradientMultiple = 0;
      let slideGradientUnsupported = 0;
      let slideShadows = 0;
      let slideShadowVectorizable = 0;
      let slideClips = 0;
      let slideClipVectorizable = 0;
      const gradientSamples = [];

      for (const item of items) {
        if (item.gradient) {
          slideGradients++;
          if (gradientSamples.length < 3) gradientSamples.push(item.gradient);
          const kind = classifyGradient(item.gradient);
          if (kind === 'linear') {
            slideGradientLinear++;
            const parsed = parseLinearGradient(item.gradient);
            if (parsed && parsed.stops.length >= 2) slideGradientLinearVectorizable++;
          } else if (kind === 'radial') {
            slideGradientRadial++;
          } else if (kind === 'multiple') {
            slideGradientMultiple++;
          } else {
            slideGradientUnsupported++;
          }
        }
        if (item.shadow) {
          slideShadows++;
          const parsed = parseBoxShadow(item.shadow);
          // inset shadow PPTX 原生不支持；outer shadow 可矢量化。
          if (parsed && parsed.type === 'outer') slideShadowVectorizable++;
        }
        if (item.clipPath) {
          slideClips++;
          const parsed = parseClipPath(item.clipPath);
          if (parsed.vectorizable) slideClipVectorizable++;
        }
      }

      totals.gradientElements += slideGradients;
      totals.gradientLinear += slideGradientLinear;
      totals.gradientLinearVectorizable += slideGradientLinearVectorizable;
      totals.gradientRadial += slideGradientRadial;
      totals.gradientMultiple += slideGradientMultiple;
      totals.gradientUnsupported += slideGradientUnsupported;
      totals.shadowElements += slideShadows;
      totals.shadowVectorizable += slideShadowVectorizable;
      totals.clipPathElements += slideClips;
      totals.clipPathVectorizable += slideClipVectorizable;

      perSlide.push({
        slide: i + 1,
        gradients: {
          total: slideGradients,
          linear: slideGradientLinear,
          linearVectorizable: slideGradientLinearVectorizable,
          radial: slideGradientRadial,
          multiple: slideGradientMultiple,
          unsupported: slideGradientUnsupported,
        },
        shadows: { total: slideShadows, vectorizable: slideShadowVectorizable },
        clipPaths: { total: slideClips, vectorizable: slideClipVectorizable },
      });

      if (slideGradients + slideShadows + slideClips > 0) {
        console.log(
          `[slide ${String(i + 1).padStart(2, '0')}] ` +
          `gradient: ${slideGradientLinearVectorizable}/${slideGradients} (linear=${slideGradientLinear}) | ` +
          `shadow: ${slideShadowVectorizable}/${slideShadows} | ` +
          `clipPath: ${slideClipVectorizable}/${slideClips}`,
        );
        if (gradientSamples.length > 0) {
          gradientSamples.forEach((g) => {
            const kind = classifyGradient(g);
            const parsed = kind === 'linear' ? parseLinearGradient(g) : undefined;
            console.log(`   gradient sample [${kind}]: ${g.slice(0, 120)}`);
            if (kind === 'linear' && !parsed) console.log(`   ⚠️ linear gradient parse failed`);
          });
        }
      }
    }

    console.log('\n📊 汇总');
    console.log(`   渐变: ${totals.gradientLinearVectorizable}/${totals.gradientElements} 可矢量化 (linear=${totals.gradientLinear}, radial=${totals.gradientRadial}, multiple=${totals.gradientMultiple}, unsupported=${totals.gradientUnsupported})`);
    console.log(`   阴影: ${totals.shadowVectorizable}/${totals.shadowElements} 可矢量化`);
    console.log(`   clip-path: ${totals.clipPathVectorizable}/${totals.clipPathElements} 可矢量化`);

    const reportPath = path.join(rootDir, 'output', `css-effects-scan-${theme}.json`);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(
      reportPath,
      JSON.stringify({ theme, slides: pages, totals, perSlide }, null, 2),
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
