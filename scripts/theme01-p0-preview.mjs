#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Theme01 阶段 P0 预览
 * 渲染 P0 阶段新增与覆盖的 theme01 专属版式，输出静态 HTML 用于视觉验证。
 */

import { cp, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSlide } from '@lemonppt/templates';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'output');
const assetsDir = path.join(outDir, 'assets');

const P0_LAYOUTS = [
  'theme01_cover_v1',
  'theme01_cover_v2',
  'theme01_cover_v3',
  'theme01_cover_v4',
  'theme01_table_of_contents_v1',
  'theme01_table_of_contents_v2',
  'theme01_content_v1',
  'theme01_content_v2',
  'theme01_content_v3',
  'theme01_content_v4',
  'theme01_metric_v1',
  'theme01_metric_v2',
  'theme01_metric_v3',
];

const sampleProps = {
  cover: {
    kicker: 'P0 PREVIEW',
    title: 'Theme 01 阶段 P0 预览',
    subtitle: '骨架 + 高频页组件视觉验证',
    date: '2026.07.22',
    presenter: 'lemonPPT Team',
    edition: 'P0',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1280&q=80',
  },
  tableOfContents: {
    title: '目录',
    items: ['产品愿景', '市场洞察', '核心能力', '数据表现', '团队介绍'],
  },
  content: {
    kicker: 'CONTENT',
    title: '内容页示例标题',
    bullets: ['要点一：玻璃质感卡片', '要点二：弥散渐变背景', '要点三：入场动效'],
    leftPoints: ['左侧要点一', '左侧要点二'],
    rightPoints: ['右侧要点一', '右侧要点二'],
    columns: [
      { title: '卡片一', text: '第一栏内容描述，用于说明主要特性。' },
      { title: '卡片二', text: '第二栏内容描述，用于补充关键信息。' },
      { title: '卡片三', text: '第三栏内容描述，用于展示扩展价值。' },
    ],
    subtitle: '把核心主张放在最显眼的位置。',
  },
  metric: {
    kicker: 'METRIC',
    title: '核心指标',
    value: '128,000',
    unit: '人',
    description: '较去年同期增长 42%，保持稳健上升。',
    icon: '01',
    metrics: [
      { value: '12', unit: '万', label: '月活跃用户' },
      { value: '98', unit: '%', label: '用户满意度' },
      { value: '3.2', unit: 'x', label: '效率提升' },
    ],
  },
};

function getProps(role, layout) {
  const base = sampleProps[role] || sampleProps.content;
  if (layout.includes('cover')) return { ...sampleProps.cover };
  if (layout.includes('table_of_contents')) return { ...sampleProps.tableOfContents };
  if (layout.includes('metric')) return { ...sampleProps.metric };
  return { ...base };
}

function renderSlideHtml(slide, index) {
  const element = renderSlide(slide, { slideIdx: index, editable: false, theme: 'theme01' });
  const errorElement = React.createElement(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fee2e2',
        color: '#991b1b',
        fontFamily: 'system-ui, sans-serif',
      },
    },
    `未找到版式: ${slide.layout}`
  );
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(
      'div',
      { style: { width: '1280px', height: '720px', boxSizing: 'border-box' } },
      element ?? errorElement
    )
  );
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(assetsDir, { recursive: true });

  const cssSource = path.join(rootDir, 'packages', 'themes', 'src', 'theme01', 'styles.css');
  const cssDest = path.join(assetsDir, 'theme01.css');
  await cp(cssSource, cssDest);

  const fontsSource = path.join(rootDir, 'packages', 'renderer', 'assets', 'fonts');
  const fontsDest = path.join(assetsDir, 'fonts');
  await cp(fontsSource, fontsDest, { recursive: true, force: true });

  const slides = P0_LAYOUTS.map((layout) => {
    const role = layout.replace(/^theme01_/, '').split('_')[0];
    // table_of_contents 包含下划线，特殊处理
    const resolvedRole = layout.includes('table_of_contents') ? 'tableOfContents' : role;
    return {
      role: resolvedRole,
      layout,
      props: getProps(resolvedRole, layout),
    };
  });

  const items = slides
    .map((slide, index) => {
      const markup = renderSlideHtml(slide, index);
      return `
        <section class="lp-p0-item">
          <div class="lp-p0-label">${slide.layout}</div>
          <div class="lp-p0-slide">${markup}</div>
        </section>
      `;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1280, initial-scale=1.0">
  <title>Theme 01 阶段 P0 预览</title>
  <link rel="stylesheet" href="assets/theme01.css">
  <link rel="stylesheet" href="assets/fonts/fonts.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; min-height: 100%; background: #111; color: #e5e5e5; font-family: system-ui, sans-serif; }
    body { padding: 40px 24px; }
    .lp-p0-header { max-width: 1280px; margin: 0 auto 32px; }
    .lp-p0-header h1 { font-size: 24px; font-weight: 700; }
    .lp-p0-list { max-width: 1280px; margin: 0 auto; display: flex; flex-direction: column; gap: 48px; }
    .lp-p0-item { display: flex; flex-direction: column; gap: 12px; }
    .lp-p0-label { font-size: 14px; color: #9ca3af; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .lp-p0-slide { width: 1280px; height: 720px; box-shadow: 0 24px 80px rgba(0,0,0,0.5); border-radius: 12px; overflow: hidden; }
    .lp-error { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #fee2e2; color: #991b1b; }
  </style>
</head>
<body>
  <div class="lp-p0-header">
    <h1>Theme 01 阶段 P0 组件预览</h1>
  </div>
  <div class="lp-p0-list">
    ${items}
  </div>
</body>
</html>`;

  const outFile = path.join(outDir, 'theme01-p0-preview.html');
  await writeFile(outFile, html, 'utf-8');
  console.log(`✅ 已生成 P0 预览：file://${outFile}`);
}

main().catch((err) => {
  console.error('生成 P0 预览失败：', err);
  process.exit(1);
});
