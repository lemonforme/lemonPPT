#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 版式画廊脚本：为每个主题生成一个包含所有版式的静态 HTML 页面，
 * 用于快速预览和跨主题回归测试。
 *
 * 用法：
 *   node scripts/gallery.mjs
 * 输出：
 *   output/gallery/<theme>/index.html
 *   output/gallery/assets/<theme>.css
 */

import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateThemeCssVariablesWithDark,
  generateTheme02CssVariablesWithSchemes,
  generateTheme03CssVariablesWithSchemes,
  generateTheme04CssVariablesWithAppearance,
  generateTheme05CssVariablesWithSchemesAndAppearance,
  generateTheme06CssVariablesWithSchemesAndAppearance,
  generateTheme07CssVariablesWithSchemesAndAppearance,
  generateTheme08CssVariablesWithSchemesAndAppearance,
  generateTheme09CssVariablesWithSchemesAndAppearance,
  generateTheme10CssVariables,
  getLayoutSchema,
  listLayoutsByTheme,
  renderSlide,
} from '@lemonppt/templates';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'output', 'gallery');
const assetsDir = path.join(outDir, 'assets');
const themesDir = path.join(rootDir, 'packages', 'themes', 'src');

const THEMES = ['theme01', 'theme02', 'theme03', 'theme04', 'theme05', 'theme06', 'theme07', 'theme08', 'theme09', 'theme10'];

import { sampleProps } from './lib/sample-props.mjs';

function schemaDefaultsToProps(schema) {
  if (!schema || !Array.isArray(schema.fields)) return {};
  const props = {};
  for (const f of schema.fields) {
    if (f.defaultValue !== undefined) props[f.key] = f.defaultValue;
  }
  return props;
}

function renderSlideHtml(slide, index, theme) {
  const element = renderSlide(slide, { slideIdx: index, editable: false, theme });
  const errorElement = React.createElement('div', {
    style: {
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#fee2e2', color: '#991b1b', fontFamily: 'system-ui, sans-serif'
    }
  }, `未找到版式: ${slide.layout}`);
  const markup = ReactDOMServer.renderToStaticMarkup(
    React.createElement('div', { style: { width: '1280px', height: '720px', boxSizing: 'border-box' } }, element ?? errorElement)
  );
  return markup;
}

function buildGalleryHtml(theme, slides, themeCssVars, colorScheme, appearance) {
  const slideItems = slides.map((slide, index) => `
    <section class="lp-gallery-item">
      <div class="lp-gallery-label">${slide.layout}</div>
      <div class="lp-gallery-slide">${renderSlideHtml(slide, index, theme)}</div>
    </section>
  `).join('\n');

  const appearanceAttr = appearance ? ` data-appearance="${appearance}"` : '';

  return `<!DOCTYPE html>
<html lang="zh" data-theme="${colorScheme}"${appearanceAttr}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1280, initial-scale=1.0">
  <title>lemonPPT Gallery - ${theme}</title>
  <link rel="stylesheet" href="../assets/${theme}.css">
  <link rel="stylesheet" href="../assets/fonts/fonts.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
${themeCssVars}
    html, body { width: 100%; min-height: 100%; overflow-x: hidden; overflow-y: auto; background: #111; color: #e5e5e5; font-family: system-ui, sans-serif; }
    body { padding: 40px 24px; }
    .lp-gallery-header { max-width: 1280px; margin: 0 auto 32px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .lp-gallery-header h1 { font-size: 24px; font-weight: 700; }
    .lp-gallery-themes { display: flex; gap: 8px; }
    .lp-gallery-themes a { padding: 6px 12px; border-radius: 6px; background: #222; color: #e5e5e5; text-decoration: none; font-size: 14px; }
    .lp-gallery-themes a.active { background: #3B82F6; }
    .lp-gallery-list { max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; }
    .lp-gallery-item { display: flex; flex-direction: column; gap: 12px; }
    .lp-gallery-label { font-size: 14px; color: #9ca3af; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .lp-gallery-slide { width: 1280px; height: 720px; box-shadow: 0 24px 80px rgba(0,0,0,0.5); border-radius: 12px; overflow: hidden; }
    .lp-error { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #fee2e2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="lp-gallery-header">
    <h1>lemonPPT 版式画廊 · ${theme}</h1>
    <nav class="lp-gallery-themes">
      ${THEMES.map((t) => `<a href="../${t}/index.html" class="${t === theme ? 'active' : ''}">${t}</a>`).join('')}
    </nav>
  </div>
  <div class="lp-gallery-list">
    ${slideItems}
  </div>
  <script src="../assets/client-render.js"></script>
  <script src="../assets/theme-echarts.js"></script>
  <script>
    if (typeof window.__lemonPPT_initECharts === 'function') {
      window.__lemonPPT_initECharts('${theme}');
    }
  </script>
</body>
</html>`;
}

async function main() {
  await mkdir(assetsDir, { recursive: true });

  let totalLayouts = 0;
  // 复制字体资源，使 gallery 中的 @font-face 引用可用
  const fontsSource = path.join(rootDir, 'packages', 'renderer', 'assets', 'fonts');
  const fontsDest = path.join(assetsDir, 'fonts');
  await cp(fontsSource, fontsDest, { recursive: true, force: true });

  // 复制 client-render.js，使 gallery 中的版式能在浏览器端重新渲染
  const clientRenderSource = path.join(rootDir, 'packages', 'renderer', 'dist', 'client', 'client-render.js');
  const clientRenderDest = path.join(assetsDir, 'client-render.js');
  await cp(clientRenderSource, clientRenderDest);

  // 复制 theme-echarts.js，使 gallery 中的 ECharts 图表能按需初始化
  const themeEchartsSource = path.join(rootDir, 'packages', 'renderer', 'dist', 'client', 'theme-echarts.js');
  const themeEchartsDest = path.join(assetsDir, 'theme-echarts.js');
  await cp(themeEchartsSource, themeEchartsDest);

  // theme01 画廊使用一套连贯的真实演示数据（output/theme01-data-goal.json），而非占位 sampleProps
  let t01DataMap = new Map();
  try {
    const t01Goal = JSON.parse(await readFile(path.join(rootDir, 'output', 'theme01-data-goal.json'), 'utf-8'));
    t01DataMap = new Map(t01Goal.slides.map((s) => [s.layout, s.props]));
    console.log(`ℹ️ theme01 画廊已载入真实数据：${t01DataMap.size} 个版式`);
  } catch (e) {
    console.warn('⚠️ 未找到 output/theme01-data-goal.json，theme01 画廊回退到 sampleProps：', e.message);
  }

  for (const theme of THEMES) {
    const themeDir = path.join(outDir, theme);
    await mkdir(themeDir, { recursive: true });

    const cssSource = path.join(themesDir, theme, 'styles.css');
    const cssDest = path.join(assetsDir, `${theme}.css`);
    await cp(cssSource, cssDest);

    const colorScheme = theme === 'theme01' ? 'light' : theme === 'theme04' ? 'green' : theme === 'theme05' ? 'coral' : theme === 'theme06' ? 'volt' : theme === 'theme07' ? 'cold-white' : theme === 'theme08' ? 'obsidian-gold' : theme === 'theme09' ? 'ink-editorial' : theme === 'theme10' ? 'gold-index' : 'scheme-a';
    const appearance = theme === 'theme03' || theme === 'theme04' || theme === 'theme05' || theme === 'theme06' ? 'dark' : theme === 'theme08' ? 'primary' : theme === 'theme09' ? 'primary' : theme === 'theme10' ? 'primary' : undefined;
    const themeCssVars = theme === 'theme01'
      ? generateThemeCssVariablesWithDark()
      : theme === 'theme02'
        ? generateTheme02CssVariablesWithSchemes()
        : theme === 'theme03'
          ? generateTheme03CssVariablesWithSchemes()
          : theme === 'theme04'
            ? generateTheme04CssVariablesWithAppearance()
            : theme === 'theme05'
              ? generateTheme05CssVariablesWithSchemesAndAppearance()
              : theme === 'theme06'
                ? generateTheme06CssVariablesWithSchemesAndAppearance()
                : theme === 'theme07'
                  ? generateTheme07CssVariablesWithSchemesAndAppearance()
                  : theme === 'theme08'
                    ? generateTheme08CssVariablesWithSchemesAndAppearance()
                    : theme === 'theme09'
                      ? generateTheme09CssVariablesWithSchemesAndAppearance()
                      : theme === 'theme10'
                        ? generateTheme10CssVariables()
                        : '';

    const layouts = listLayoutsByTheme(theme);
    layouts.sort((a, b) => a.id.localeCompare(b.id));
    totalLayouts = Math.max(totalLayouts, layouts.length);

    const slides = layouts.map((meta) => ({
      role: meta.role,
      layout: meta.id,
      props: theme === 'theme01'
        ? (t01DataMap.get(meta.id) || sampleProps(meta))
        : theme === 'theme08'
          ? schemaDefaultsToProps(getLayoutSchema(meta.id))
          : sampleProps(meta),
    }));

    const html = buildGalleryHtml(theme, slides, themeCssVars, colorScheme, appearance);
    await writeFile(path.join(themeDir, 'index.html'), html, 'utf-8');
    console.log(`✅ 已生成 ${path.relative(rootDir, themeDir)}/index.html`);
  }

  console.log('');
  console.log(`已生成 ${THEMES.length} 套主题图库，每套最多 ${totalLayouts} 个版式`);
  console.log(`打开查看：file://${path.join(outDir, THEMES[0], 'index.html')}`);
}

main().catch((err) => {
  console.error('生成画廊失败：', err);
  process.exit(1);
});
