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

import { cp, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listLayouts, renderSlide } from '@lemonppt/templates';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'output', 'gallery');
const assetsDir = path.join(outDir, 'assets');
const themesDir = path.join(rootDir, 'packages', 'themes', 'src');

const THEMES = ['base', 'dark-tech', 'warm-business'];

function sampleProps(role) {
  const base = { title: `${role} 示例标题`, kicker: '示例标签' };
  switch (role) {
    case 'cover':
      return { title: '产品发布会', subtitle: '用 AI 快速生成专业 PPT', date: '2026.07' };
    case 'tableOfContents':
      return { title: '目录', items: ['产品概述', '市场分析', '技术架构', '路线图', '团队介绍'] };
    case 'metric':
      return { label: '月活跃用户', value: '128,000', unit: '人', description: '较去年同期增长 42%' };
    case 'stats':
      return {
        title: '核心数据',
        stats: [
          { label: '用户', value: '120K' },
          { label: '收入', value: '¥3.2M' },
          { label: '满意度', value: '96%' },
        ],
      };
    case 'chart':
      return {
        title: '季度增长',
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{ label: '2025', data: [12, 19, 25, 32], color: '#3B82F6' }],
        unit: '万',
      };
    case 'comparison':
      return {
        title: '竞品对比',
        leftTitle: 'lemonPPT',
        rightTitle: '传统工具',
        leftItems: ['AI 生成', '一键导出', '开源可扩展'],
        rightItems: ['手动排版', '多步操作', '闭源受限'],
      };
    case 'pricing':
      return {
        title: '定价方案',
        plans: [
          { name: '免费版', price: '¥0', features: ['每月 10 次生成', '3 套主题'] },
          { name: '专业版', price: '¥99', features: ['无限生成', '全部主题'] },
        ],
      };
    case 'process':
      return {
        title: '工作流程',
        steps: ['输入目标', 'AI 生成大纲', '选择主题', '导出 PPTX'],
      };
    case 'timeline':
      return {
        title: '发展历程',
        milestones: [
          { date: '2026 Q1', title: '立项', description: '确定产品方向' },
          { date: '2026 Q2', title: 'MVP', description: '完成核心功能' },
          { date: '2026 Q3', title: '公测', description: '收集用户反馈' },
        ],
      };
    case 'roadmap':
      return {
        title: '产品路线图',
        quarters: [
          { quarter: 'Q1', title: '基础版式', status: '已完成' },
          { quarter: 'Q2', title: '主题系统', status: '进行中' },
          { quarter: 'Q3', title: '社区贡献', status: '规划中' },
        ],
      };
    case 'quote':
      return { quote: '简单是终极的复杂。', author: '列奥纳多·达·芬奇', role: '艺术家' };
    case 'testimonial':
      return { quote: 'lemonPPT 让我们的汇报效率提升了 3 倍。', author: '张三', role: '产品经理' };
    case 'content':
      return { title: '内容页示例', bullets: ['要点一', '要点二', '要点三'] };
    case 'faq':
      return {
        title: '常见问题',
        items: [
          { question: '支持哪些格式？', answer: 'PPTX、PDF、HTML' },
          { question: '是否开源？', answer: '是，采用 AGPL-3.0 协议' },
        ],
      };
    case 'feature':
      return {
        title: '核心能力',
        features: [
          { title: 'AI 生成', description: '一句话生成完整大纲' },
          { title: '多主题', description: '一键切换视觉风格' },
        ],
      };
    case 'team':
      return {
        title: '团队介绍',
        members: [
          { name: '李四', role: '创始人' },
          { name: '王五', role: '技术负责人' },
        ],
      };
    case 'partners':
      return { title: '合作伙伴', logos: [{ name: 'A 公司' }, { name: 'B 公司' }] };
    case 'image':
      return { title: '图片页示例', caption: '说明文字' };
    case 'gallery':
      return {
        title: '图片墙示例',
        images: [
          { url: '', caption: '图一' },
          { url: '', caption: '图二' },
          { url: '', caption: '图三' },
        ],
      };
    case 'swot':
      return {
        title: 'SWOT 分析',
        strengths: ['技术积累', '社区活跃'],
        weaknesses: ['品牌知名度低'],
        opportunities: ['AI 市场增长'],
        threats: ['大厂入场'],
      };
    case 'pest':
      return {
        title: 'PEST 分析',
        political: ['政策支持开源'],
        economic: ['企业降本需求'],
        social: ['远程办公常态化'],
        technological: ['大模型成熟'],
      };
    case 'closing':
      return { title: '感谢观看', subtitle: '让每一次演示都更有力量' };
    default:
      return base;
  }
}

function renderSlideHtml(slide, index) {
  const element = renderSlide(slide, { slideIdx: index, editable: false });
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

function buildGalleryHtml(theme, slides) {
  const slideItems = slides.map((slide, index) => `
    <section class="lp-gallery-item">
      <div class="lp-gallery-label">${slide.layout}</div>
      <div class="lp-gallery-slide">${renderSlideHtml(slide, index)}</div>
    </section>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1280, initial-scale=1.0">
  <title>lemonPPT Gallery - ${theme}</title>
  <link rel="stylesheet" href="../assets/${theme}.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; min-height: 100%; background: #111; color: #e5e5e5; font-family: system-ui, sans-serif; }
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
</body>
</html>`;
}

async function main() {
  const layouts = listLayouts();
  layouts.sort((a, b) => a.id.localeCompare(b.id));

  const slides = layouts.map((meta) => ({
    role: meta.role,
    layout: meta.id,
    props: sampleProps(meta.role),
  }));

  await mkdir(assetsDir, { recursive: true });

  for (const theme of THEMES) {
    const themeDir = path.join(outDir, theme);
    await mkdir(themeDir, { recursive: true });

    const cssSource = path.join(themesDir, theme, 'styles.css');
    const cssDest = path.join(assetsDir, `${theme}.css`);
    await cp(cssSource, cssDest);

    const html = buildGalleryHtml(theme, slides);
    await writeFile(path.join(themeDir, 'index.html'), html, 'utf-8');
    console.log(`✅ 已生成 ${path.relative(rootDir, themeDir)}/index.html`);
  }

  console.log('');
  console.log(`共 ${layouts.length} 个版式 × ${THEMES.length} 套主题`);
  console.log(`打开查看：file://${path.join(outDir, 'base', 'index.html')}`);
}

main().catch((err) => {
  console.error('生成画廊失败：', err);
  process.exit(1);
});
