// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme01 暖炭暗色编辑风 · espresso+terracotta — PPTX 版式专属渲染器（全量）。
// 方法论对齐 theme09：双基底（light / tint）按版式预分配、共享原语层、callback 注入避免循环依赖。
// 外观翻成 theme01 自有暖炭暗色（accent C56A43 陶土），不复制 theme09 纸/墨/朱砂或 #46e3c6/#4a86ff。
//
// 本文件完全自包含（仅依赖 pptxgenjs 与 node 内置模块），由 export-pptx.ts 通过
// `registerTheme01Renderers(registerPptxLayoutRenderer)` 注入注册表，不反向 import export-pptx。

import { type Slide as PptxSlide } from 'pptxgenjs';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { tmpdir } from 'node:os';

interface T01Fonts {
  heading: string;
  body: string;
  mono: string;
}

interface T01Pal {
  sub: 'light' | 'tint';
  isTint: boolean;
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  white: string;
  light: string;
  border: string;
  surface: string;
  surfaceElevated: string;
  fonts: T01Fonts;
  chartColors: string[];
}

type T01RenderFn = (slide: PptxSlide, props: unknown) => void;

// ────────────────────────────────────────────────────────────────
// 暖炭暗色编辑风调色板（与 templates 端 theme01Tokens 同源，PPTX 不支持 color-mix 故固化）
// ────────────────────────────────────────────────────────────────
const FONTS: T01Fonts = { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' };
// 与 templates 端 theme01ColorSequence 同源（9 色大地序列，PPTX 不支持 color-mix 故固化）
const CHART_COLORS = ['6E9BC4', '8FAE84', 'D9A441', 'C76B5A', 'A07CAE', 'C98BA0', '5FA8A0', 'C97E4E', 'A7A85F'];

const LIGHT: Omit<T01Pal, 'sub' | 'isTint'> = {
  bg: '1E1B16',
  primary: 'F2E9DC',
  secondary: 'C9BCA8',
  accent: 'C56A43',
  white: 'F2E9DC',
  light: '2C2820',
  border: '3A342A',
  surface: '28231C',
  surfaceElevated: '322C23',
  fonts: FONTS,
  chartColors: CHART_COLORS,
};

// tint 基底：深墨 ink（仅背景节奏变化，强调色与明暗不翻转）
const TINT: Omit<T01Pal, 'sub' | 'isTint'> = {
  ...LIGHT,
  bg: '16130F',
  surfaceElevated: '2C271F',
};

// 双基底预分配：每个版式固定基底，翻页形成呼吸节奏
const SUBSTRATE: Record<string, 'light' | 'tint'> = {
  'theme01_appendix_v1': 'light',
  'theme01_bento_v1': 'light',
  'theme01_case_study': 'light',
  'theme01_chapter_v1': 'light',
  'theme01_chapter_v2': 'light',
  'theme01_chapter_v3': 'light',
  'theme01_chart_bar3d': 'light',
  'theme01_chart_donut': 'light',
  'theme01_chart_funnel': 'light',
  'theme01_chart_gauge': 'light',
  'theme01_chart_graph': 'light',
  'theme01_chart_heatmap': 'light',
  'theme01_chart_radar': 'light',
  'theme01_chart_sankey': 'light',
  'theme01_chart_sunburst': 'light',
  'theme01_chart_treemap': 'light',
  'theme01_chart_v1': 'light',
  'theme01_chart_wordcloud': 'light',
  'theme01_closing_v2': 'tint',
  'theme01_comparison_v1': 'light',
  'theme01_comparison_v2': 'light',
  'theme01_comparison_v3': 'light',
  'theme01_conclusion_v1': 'light',
  'theme01_content_v1': 'light',
  'theme01_content_v2': 'light',
  'theme01_content_v3': 'light',
  'theme01_content_v4': 'light',
  'theme01_cover_v1': 'light',
  'theme01_cover_v2': 'light',
  'theme01_cover_v3': 'light',
  'theme01_cover_v4': 'light',
  'theme01_diptych_contrast': 'light',
  'theme01_faq_v1': 'light',
  'theme01_feature_v1': 'light',
  'theme01_feature_v2': 'light',
  'theme01_filmstrip_v1': 'light',
  'theme01_gallery_v1': 'light',
  'theme01_gantt_v1': 'light',
  'theme01_image_v1': 'light',
  'theme01_metric_big': 'light',
  'theme01_metric_triptych': 'light',
  'theme01_metric_v1': 'light',
  'theme01_metric_v2': 'light',
  'theme01_metric_v3': 'light',
  'theme01_outlook_v1': 'light',
  'theme01_partners_v1': 'light',
  'theme01_pest_v1': 'light',
  'theme01_pricing_v1': 'light',
  'theme01_process_v1': 'light',
  'theme01_quadrant_v1': 'light',
  'theme01_quote_v1': 'light',
  'theme01_quote_v2': 'light',
  'theme01_quote_v3': 'light',
  'theme01_ranking_v1': 'light',
  'theme01_region_v1': 'light',
  'theme01_risk_v1': 'light',
  'theme01_roadmap_v1': 'light',
  'theme01_scorecard_v1': 'light',
  'theme01_spotlight_grid': 'light',
  'theme01_stats_v1': 'light',
  'theme01_swot_v1': 'light',
  'theme01_table_data': 'light',
  'theme01_table_of_contents_v1': 'light',
  'theme01_table_of_contents_v2': 'light',
  'theme01_table_v1': 'light',
  'theme01_tags_v1': 'light',
  'theme01_team_v1': 'light',
  'theme01_team_v2': 'light',
  'theme01_testimonial_v1': 'light',
  'theme01_timeline_v1': 'light',
  'theme01_trend_v1': 'light',
  'theme01_components_v1': 'light',
};

function P(layoutId: string): T01Pal {
  const sub = SUBSTRATE[layoutId] ?? 'light';
  const base = sub === 'tint' ? TINT : LIGHT;
  return { sub, isTint: sub === 'tint', ...base };
}

// 模块级当前调色板（按版式在 registerTheme01Renderers 的包装器里注入 COLORS = P(id)）
let COLORS: T01Pal = { sub: 'light', isTint: false, ...LIGHT };

// ────────────────────────────────────────────────────────────────
// 画布常量（16:9，10 × 5.625 英寸）
// ────────────────────────────────────────────────────────────────
const MX = 0.8;

function applyBackground(slide: PptxSlide): void {
  (slide as any).background = { color: COLORS.bg };
  if (COLORS.isTint) {
    slide.addShape('rect', {
      x: 0, y: 0, w: 10, h: 5.625,
      fill: {
        color: '241C14',
        gradient: { type: 'linear' as any, angle: 90, stops: [{ position: 0, color: '241C14' }, { position: 100, color: '16130F' }] },
      },
      line: { type: 'none' as any },
    } as any);
  }
}

// ────────────────────────────────────────────────────────────────
// 临时图片（data: URI → 临时文件，pptxgenjs 在 Node 环境只能读取本地路径）
// ────────────────────────────────────────────────────────────────
let exportTmpDir: string | null = null;
const dataUriToTempPath = new Map<string, string>();

function getExportTmpDir(): string | null {
  if (!exportTmpDir) {
    try { exportTmpDir = mkdtempSync(path.join(tmpdir(), 'lemonppt-t01-')); } catch { return null; }
  }
  return exportTmpDir;
}

function dataUriToTempFile(url: string): string | undefined {
  const cached = dataUriToTempPath.get(url);
  if (cached) return cached;
  const match = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return undefined;
  const mime = match[1];
  const base64 = match[2];
  const ext = mime === 'image/svg+xml' ? 'svg' : mime === 'image/png' ? 'png' : mime === 'image/jpeg' ? 'jpg' : mime === 'image/webp' ? 'webp' : 'bin';
  try {
    const buffer = Buffer.from(base64, 'base64');
    const tmpDir = getExportTmpDir();
    if (!tmpDir) return undefined;
    const fileName = `img-${crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 16)}.${ext}`;
    const filePath = path.join(tmpDir, fileName);
    writeFileSync(filePath, buffer);
    dataUriToTempPath.set(url, filePath);
    return filePath;
  } catch { return undefined; }
}

function addImageMaybe(slide: PptxSlide, url: string | undefined, x: number, y: number, w: number, h: number): void {
  if (!url) return;
  let pathOrUrl = url;
  if (url.startsWith('data:')) {
    const tempPath = dataUriToTempFile(url);
    if (!tempPath) { slide.addText('[图片]', { x, y, w, h, fontSize: 14, color: '6E6E73', align: 'center', valign: 'middle' } as any); return; }
    pathOrUrl = tempPath;
  }
  try {
    slide.addImage({ path: pathOrUrl, x, y, w, h, sizing: { type: 'crop', w, h } } as any);
  } catch {
    slide.addText('[图片]', { x, y, w, h, fontSize: 14, color: '6E6E73', align: 'center', valign: 'middle' } as any);
  }
}

export function cleanupTheme01TempImages(): void {
  dataUriToTempPath.clear();
  if (exportTmpDir) {
    try { rmSync(exportTmpDir, { recursive: true, force: true }); } catch { /* ignore */ }
    exportTmpDir = null;
  }
}

// ────────────────────────────────────────────────────────────────
// 共享原语助手（COLORS 风格，对齐 theme09 的 kicker/title/footer 写法）
// ────────────────────────────────────────────────────────────────
function addKicker(slide: PptxSlide, kicker: string | undefined, x = MX, y = 0.8): void {
  if (!kicker) return;
  slide.addText(kicker, { x, y, w: 8.4, h: 0.4, fontSize: 14, color: COLORS.accent, align: 'left', fontFace: FONTS.mono } as any);
}

function addTitle(slide: PptxSlide, title: string, x = MX, y = 1.3, w = 8.4, h = 0.9, fontSize = 44): void {
  slide.addText(title, { x, y, w, h, fontSize, color: COLORS.primary, bold: true, align: 'left', valign: 'top', fontFace: FONTS.heading } as any);
}

function addBulletList(slide: PptxSlide, items: string[], x: number, y: number, w: number, maxItems = 8): number {
  const list = (items || []).slice(0, maxItems);
  let cy = y;
  for (const item of list) {
    slide.addShape('ellipse', { x: x + 0.05, y: cy + 0.16, w: 0.1, h: 0.1, fill: { color: COLORS.accent } } as any);
    slide.addText(item, { x: x + 0.3, y: cy, w: w - 0.3, h: 0.55, fontSize: 20, color: COLORS.primary, align: 'left', valign: 'top', fontFace: FONTS.body } as any);
    cy += 0.7;
  }
  return cy;
}

function renderInsightPanel(slide: PptxSlide, insight: any, x: number, y: number, w: number, h: number): void {
  if (!insight || (!insight.value && !insight.label && !insight.description)) return;
  slide.addShape('roundRect', { x, y, w, h, fill: { color: COLORS.surfaceElevated }, line: { color: COLORS.border, width: 1 }, rectRadius: 0.15 } as any);
  let cursorY = y + 0.25;
  if (insight.value) {
    slide.addText(insight.value, { x: x + 0.2, y: cursorY, w: w - 0.4, h: 0.65, fontSize: 36, color: COLORS.accent, bold: true, align: 'left', valign: 'top', fontFace: FONTS.heading } as any);
    cursorY += 0.62;
  }
  if (insight.label) {
    slide.addText(insight.label, { x: x + 0.2, y: cursorY, w: w - 0.4, h: 0.3, fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body } as any);
    cursorY += 0.38;
  }
  if (insight.description) {
    slide.addText(insight.description, { x: x + 0.2, y: cursorY, w: w - 0.4, h: h - (cursorY - y) - 0.25, fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body } as any);
  }
}

// ────────────────────────────────────────────────────────────────
// 试点版式渲染器（COLORS 风格，逻辑与 export-pptx 原实现一致）
// ────────────────────────────────────────────────────────────────

export function renderCoverV1(slide: PptxSlide, props: unknown): void {
  const p = props as any;
  COLORS = P('theme01_cover_v1');
  applyBackground(slide);
  if (p.image) addImageMaybe(slide, p.image, 0, 0, 10, 5.625);
  if (p.kicker) addKicker(slide, p.kicker, 1, 2.0);
  addTitle(slide, p.title, 1, 2.5, 8, 1.2, 54);
  if (p.subtitle) {
    slide.addText(p.subtitle, { x: 1.5, y: 3.8, w: 7, h: 0.8, fontSize: 22, color: COLORS.secondary, align: 'center', fontFace: FONTS.body } as any);
  }
  if (p.date) {
    slide.addText(p.date, { x: 1, y: 5.0, w: 8, h: 0.3, fontSize: 14, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono } as any);
  }
}

export function renderChartV1(slide: PptxSlide, props: unknown): void {
  const p = props as any;
  COLORS = P('theme01_chart_v1');
  applyBackground(slide);
  if (p.kicker) addKicker(slide, p.kicker);
  if (p.title) addTitle(slide, p.title);
  const labels = p.labels || [];
  const data = p.data || [];
  const insight = p.insight || {};
  const hasInsight = !!insight.headline || !!insight.subheadline || (insight.items && insight.items.length > 0) || !!insight.badge?.text;
  if (labels.length === 0 || data.length === 0) {
    slide.addText('（暂无图表数据）', { x: 2, y: 3.2, w: 6, h: 0.8, fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body } as any);
    return;
  }
  const chartType = p.type || 'bar';
  const chartColors = chartType === 'pie'
    ? data.map((_: unknown, i: number) => COLORS.chartColors[i % COLORS.chartColors.length])
    : [COLORS.accent];
  const chartData = [{ name: p.title || '', labels, values: data }];
  const chartW = hasInsight ? 5.6 : 8.4;
  slide.addChart(chartType as 'bar' | 'line' | 'pie', chartData, {
    x: 0.6, y: 2.3, w: chartW, h: 3.2, chartColors, showValue: true, dataLabelColor: COLORS.primary, dataLabelFontSize: 10,
  } as any);
  if (hasInsight) {
    slide.addShape('roundRect', { x: 6.5, y: 2.3, w: 3.0, h: 3.2, fill: { color: 'F2E9DC', transparency: 90 }, line: { color: '3A342A', width: 1 }, rectRadius: 0.15 } as any);
    let cursorY = 2.5;
    if (insight.headline) {
      slide.addText(insight.headline, { x: 6.7, y: cursorY, w: 2.6, h: 0.6, fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.primary } as any);
      cursorY += 0.6;
    }
    if (insight.subheadline) {
      slide.addText(insight.subheadline, { x: 6.7, y: cursorY, w: 2.6, h: 0.3, fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary } as any);
      cursorY += 0.45;
    }
    if (insight.items && insight.items.length > 0) {
      cursorY += 0.1;
      insight.items.forEach((item: any) => {
        slide.addText(item.label || '', { x: 6.7, y: cursorY, w: 1.3, h: 0.28, fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary } as any);
        slide.addText(item.value || '', { x: 8.0, y: cursorY, w: 1.3, h: 0.28, fontSize: 12, fontFace: FONTS.body, bold: true, color: COLORS.primary, align: 'right' } as any);
        cursorY += 0.34;
      });
    }
    if (insight.badge?.text) {
      const badgeColor = insight.badge.tone === 'success' ? '8FAE84' : insight.badge.tone === 'warning' ? 'D9A441' : COLORS.accent;
      cursorY += 0.1;
      slide.addShape('roundRect', { x: 6.7, y: cursorY, w: 2.0, h: 0.32, fill: { color: badgeColor }, rectRadius: 0.16 } as any);
      slide.addText(insight.badge.text, { x: 6.7, y: cursorY, w: 2.0, h: 0.32, fontSize: 10, fontFace: FONTS.body, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' } as any);
    }
  }
  if (p.footnote || p.unit) {
    const footerText = [p.unit ? `单位：${p.unit}` : '', p.footnote || ''].filter(Boolean).join(' · ');
    slide.addText(footerText, { x: 0.6, y: 5.75, w: 8.9, h: 0.3, fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary } as any);
  }
}

export function renderContentV1(slide: PptxSlide, props: unknown): void {
  const p = props as any;
  COLORS = P('theme01_content_v1');
  applyBackground(slide);
  if (p.kicker) addKicker(slide, p.kicker);
  if (p.title) addTitle(slide, p.title);
  addBulletList(slide, p.points || [], MX, 2.8, 8.4);
}

export function renderComparisonV1(slide: PptxSlide, props: unknown): void {
  const p = props as any;
  COLORS = P('theme01_comparison_v1');
  applyBackground(slide);
  if (p.kicker) addKicker(slide, p.kicker);
  if (p.title) addTitle(slide, p.title);
  renderComparisonColumns(slide, p.leftTitle || '方案 A', p.leftPoints || [], p.rightTitle || '方案 B', p.rightPoints || []);
}

function renderComparisonColumns(
  slide: PptxSlide,
  leftTitle: string,
  leftPoints: string[],
  rightTitle: string,
  rightPoints: string[],
): void {
  slide.addText(leftTitle, { x: MX, y: 2.4, w: 4.0, h: 0.5, fontSize: 24, color: COLORS.primary, bold: true, align: 'left', fontFace: FONTS.heading } as any);
  slide.addText(rightTitle, { x: 5.2, y: 2.4, w: 4.0, h: 0.5, fontSize: 24, color: COLORS.primary, bold: true, align: 'left', fontFace: FONTS.heading } as any);
  addBulletList(slide, leftPoints, MX, 3.0, 4.0);
  addBulletList(slide, rightPoints, 5.2, 3.0, 4.0);
}

export function renderClosing(slide: PptxSlide, props: unknown): void {
  const p = props as any;
  COLORS = P('theme01_closing_v2');
  applyBackground(slide);
  let y = 2.2;
  if (p.kicker) {
    slide.addText(p.kicker, { x: 1, y, w: 8, h: 0.4, fontSize: 14, color: COLORS.accent, align: 'center', fontFace: FONTS.mono } as any);
    y += 0.5;
  }
  slide.addText(p.title, { x: 1, y, w: 8, h: 1.0, fontSize: 48, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading } as any);
  y += 1.1;
  if (p.subtitle) {
    slide.addText(p.subtitle, { x: 1.5, y, w: 7, h: 0.6, fontSize: 22, color: COLORS.secondary, align: 'center', fontFace: FONTS.body } as any);
    y += 0.9;
  }
  if (p.cta) {
    slide.addShape('roundRect', { x: 3.5, y, w: 3, h: 0.6, fill: { color: COLORS.accent }, rectRadius: 0.3 } as any);
    slide.addText(p.cta, { x: 3.5, y, w: 3, h: 0.6, fontSize: 16, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body } as any);
    y += 0.9;
  }
  const lines = [p.contact, p.email, p.link].filter(Boolean) as string[];
  lines.forEach((line) => {
    slide.addText(line, { x: 1, y, w: 8, h: 0.35, fontSize: 16, color: COLORS.accent, align: 'center', fontFace: FONTS.mono } as any);
    y += 0.45;
  });
}


// ────────────────────────────────────────────────────────────────
// 全量版式渲染器（从 export-pptx.ts 搬移，逻辑逐字一致，props 改为 any）
// ────────────────────────────────────────────────────────────────
function render2x2Grid(slide: PptxSlide, cells: { title: string; text: string }[]): void {
  const positions = [
    { x: 0.8, y: 2.5 },
    { x: 5.2, y: 2.5 },
    { x: 0.8, y: 4.1 },
    { x: 5.2, y: 4.1 },
  ];
  cells.forEach((cell, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 4.0, h: 1.4,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(cell.title, {
      x: pos.x + 0.15, y: pos.y + 0.1, w: 3.7, h: 0.35,
      fontSize: 16, color: COLORS.accent, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(cell.text, {
      x: pos.x + 0.15, y: pos.y + 0.5, w: 3.7, h: 0.8,
      fontSize: 13, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderChartBar3d(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const labels = props.labels || [];
  const data = props.data || [];
  if (labels.length === 0 || data.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const chartColors = data.map((_: any, i: any) => CHART_COLORS[i % CHART_COLORS.length]);
  slide.addChart('bar', [{ name: props.title || '数值', labels, values: data }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

function renderChartFunnel(slide: PptxSlide, props: any): void {
  if (props.kicker) addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const insight = props.insight || {};
  const hasInsight = !!insight.value || !!insight.label || !!insight.description;

  if (raw.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = raw.map((d: any) => d.name);
  const values = raw.map((d: any) => d.value);
  const chartColors = raw.map((_: any, i: any) => CHART_COLORS[i % CHART_COLORS.length]);
  const chartW = hasInsight ? 5.6 : 8.4;

  // PptxGenJS 没有真正的漏斗图，使用横向柱状图模拟漏斗层级
  slide.addChart('bar', [{ name: props.title || '漏斗', labels, values }], {
    x: 0.6, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: 'F2E9DC', transparency: 90 },
      line: { color: '3A342A', width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.primary,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.6, y: 5.75, w: 8.9, h: 0.3,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
    });
  }
}

function renderChartGauge(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const value = props.value ?? 0;
  const min = props.min ?? 0;
  const max = Math.max(props.max ?? 100, min + 1);
  const unit = props.unit || '';
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  slide.addText(`${value}${unit}`, {
    x: 0, y: 2.4, w: 10, h: 1.0,
    fontSize: 48, bold: true, color: COLORS.accent,
    align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
  slide.addText(`${percentage.toFixed(1)}%`, {
    x: 0, y: 3.4, w: 10, h: 0.5,
    fontSize: 18, color: COLORS.secondary,
    align: 'center', valign: 'middle', fontFace: FONTS.body,
  });

  // pptxgenjs 3.12 运行时支持 doughnut，但当前类型定义较旧，使用 as any 绕过。
  slide.addChart('doughnut' as 'pie', [
    { name: '已完成', labels: ['已完成', '未完成'], values: [percentage, 100 - percentage] },
  ], {
    x: 3, y: 4.0, w: 4, h: 1.5,
    chartColors: [COLORS.accent, COLORS.border],
    showValue: false,
    holeSize: 60,
  } as any);

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);
  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }
}

function renderChartGraph(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const nodes = props.nodes || [];
  if (nodes.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const sorted = [...nodes]
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .slice(0, 12);
  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value ?? 0);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '节点权重', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

function renderChartHeatmap(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const flat = raw.map((cell: any) => ({ name: `${cell[0]} / ${cell[1]}`, value: cell[2] }));
  const sorted = flat.sort((a: any, b: any) => b.value - a.value).slice(0, 12);

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);

  if (sorted.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = sorted.map((d: any) => d.name);
  const values = sorted.map((d: any) => d.value);
  const chartColors = sorted.map((_: any, i: any) => CHART_COLORS[i % CHART_COLORS.length]);
  const chartW = hasInsight ? 5.6 : 8.4;

  slide.addChart('bar', [{ name: props.title || '热度', labels, values }], {
    x: 0.8, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }
}

function renderChartRadar(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const indicators = props.indicators || [];
  const datasets = props.data || [];

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);

  if (indicators.length === 0 || datasets.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = indicators.map((i: any) => i.name);
  const chartData = datasets.map((d: any) => ({
    name: d.name,
    labels,
    values: d.value,
  }));
  const chartColors = datasets.map((_: any, i: any) => CHART_COLORS[i % CHART_COLORS.length]);
  const chartW = hasInsight ? 5.6 : 8.4;

  // pptxgenjs 3.12 运行时支持 radar，但当前类型定义较旧，使用 as any 绕过。
  slide.addChart('radar' as any, chartData, {
    x: 0.8, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  } as any);

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }
}

function renderChartSankey(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const aggregated = new Map<string, number>();
  raw.forEach((link: any) => {
    const key = `${link.source} → ${link.target}`;
    aggregated.set(key, (aggregated.get(key) ?? 0) + link.value);
  });
  const sorted = Array.from(aggregated.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  if (sorted.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '流量', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

function renderChartSunburst(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const flat = raw.flatMap((item: any) => {
    if (item.children && item.children.length > 0) {
      return item.children.map((child: any) => ({ name: `${item.name} / ${child.name}`, value: child.value }));
    }
    return [{ name: item.name, value: item.value }];
  });
  const sorted = flat.sort((a: any, b: any) => b.value - a.value).slice(0, 10);

  if (sorted.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = sorted.map((d: any) => d.name);
  const values = sorted.map((d: any) => d.value);
  const chartColors = sorted.map((_: any, i: any) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '数据', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

function renderChartTreemap(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  // 把树状数据拍平为 (name, value) 列表，按 value 降序取前 10
  const flat = raw.flatMap((item: any) => {
    if (item.children && item.children.length > 0) {
      return item.children.map((child: any) => ({ name: `${item.name} / ${child.name}`, value: child.value }));
    }
    return [{ name: item.name, value: item.value }];
  });
  const sorted = flat.sort((a: any, b: any) => b.value - a.value).slice(0, 10);

  if (sorted.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = sorted.map((d: any) => d.name);
  const values = sorted.map((d: any) => d.value);
  const chartColors = sorted.map((_: any, i: any) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '数据', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

function renderChartWordcloud(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const words = props.words || [];
  if (words.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const sorted = [...words].sort((a, b) => b.value - a.value).slice(0, 12);
  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '词频', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

function renderComparisonV3(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'ComparisonV3');

  const rows = (props.rows ?? []).slice(0, 3);
  const startY = 2.5;
  const rowH = 0.75;
  const col1W = 3.2;
  const col2W = 2.8;
  const col3W = 2.8;
  const gap = 0.1;
  const startX = 0.8;

  slide.addShape('rect', {
    x: startX, y: startY, w: col1W, h: 0.5,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
  });
  slide.addShape('rect', {
    x: startX + col1W + gap, y: startY, w: col2W, h: 0.5,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent, width: 1 },
  });
  slide.addShape('rect', {
    x: startX + col1W + gap + col2W + gap, y: startY, w: col3W, h: 0.5,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
  });

  slide.addText('维度', {
    x: startX, y: startY, w: col1W, h: 0.5,
    fontSize: 12, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.body,
  });
  slide.addText(props.leftTitle ?? '方案 A', {
    x: startX + col1W + gap, y: startY, w: col2W, h: 0.5,
    fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(props.rightTitle ?? '方案 B', {
    x: startX + col1W + gap + col2W + gap, y: startY, w: col3W, h: 0.5,
    fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  rows.forEach((row: any, index: any) => {
    const y = startY + 0.6 + index * rowH;
    const bg = index % 2 === 0 ? COLORS.surface : COLORS.surfaceElevated;

    slide.addShape('rect', {
      x: startX, y, w: col1W, h: rowH,
      fill: { color: bg },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addShape('rect', {
      x: startX + col1W + gap, y, w: col2W, h: rowH,
      fill: { color: bg },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addShape('rect', {
      x: startX + col1W + gap + col2W + gap, y, w: col3W, h: rowH,
      fill: { color: bg },
      line: { color: COLORS.border, width: 1 },
    });

    slide.addText(row.feature ?? '', {
      x: startX + 0.15, y, w: col1W - 0.3, h: rowH,
      fontSize: 13, color: COLORS.primary, align: 'left', valign: 'middle',
      fontFace: FONTS.body,
    });
    slide.addText(row.left ?? '', {
      x: startX + col1W + gap + 0.1, y, w: col2W - 0.2, h: rowH,
      fontSize: 13, color: COLORS.primary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    slide.addText(row.right ?? '', {
      x: startX + col1W + gap + col2W + gap + 0.1, y, w: col3W - 0.2, h: rowH,
      fontSize: 13, color: COLORS.primary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
  });
}

function renderContentV2(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  slide.addText('左栏', {
    x: 0.8, y: 2.4, w: 4.0, h: 0.4,
    fontSize: 18, color: COLORS.accent, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });
  slide.addText('右栏', {
    x: 5.2, y: 2.4, w: 4.0, h: 0.4,
    fontSize: 18, color: COLORS.accent, bold: true, align: 'left',
    fontFace: FONTS.heading,
  });
  addBulletList(slide, props.leftPoints || [], 0.8, 2.9, 4.0);
  addBulletList(slide, props.rightPoints || [], 5.2, 2.9, 4.0);
}

function renderFaqV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const items = (props.items || []).slice(0, 4);
  let y = 2.0;
  items.forEach((item: any) => {
    slide.addText(`Q: ${item.q || ''}`, {
      x: 0.8, y, w: 8.4, h: 0.32,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`A: ${item.a || ''}`, {
      x: 0.8, y: y + 0.37, w: 8.4, h: 0.43,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.85;
  });
}

function renderFeatureV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const features = (props.features || []).slice(0, 3);
  const cardWidth = 2.6;
  const gap = 0.3;
  const startX = (10 - (features.length * cardWidth + (features.length - 1) * gap)) / 2;
  features.forEach((feature: any, index: any) => {
    const x = startX + index * (cardWidth + gap);
    slide.addShape('rect', {
      x, y: 2.8, w: cardWidth, h: 2.2,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(feature.title || '', {
      x: x + 0.15, y: 3.0, w: cardWidth - 0.3, h: 0.5,
      fontSize: 20, color: COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText(feature.description || '', {
      x: x + 0.15, y: 3.6, w: cardWidth - 0.3, h: 1.2,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderFeatureV2(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.6, y: 1.5, w: 8.8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, valign: 'top',
      fontFace: FONTS.body,
    });
  }
  if (props.imageUrl) addImageMaybe(slide, props.imageUrl, 0.6, 2.2, 4.2, 3.0);
  const items = (props.items || []).slice(0, 5);
  items.forEach((item: any, index: any) => {
    const y = 2.2 + index * 0.95;
    slide.addShape('rect', {
      x: 5.2, y, w: 4.2, h: 0.85,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(item.title || '', {
      x: 5.35, y: y + 0.08, w: 3.9, h: 0.3,
      fontSize: 15, color: COLORS.primary, bold: true,
      fontFace: FONTS.heading,
    });
    slide.addText(item.description || '', {
      x: 5.35, y: y + 0.36, w: 3.9, h: 0.4,
      fontSize: 11, color: COLORS.secondary, valign: 'top',
      fontFace: FONTS.body,
    });
  });
  if (props.footer) {
    slide.addText(props.footer, {
      x: 0.6, y: 5.4, w: 8.8, h: 0.3,
      fontSize: 11, color: COLORS.secondary,
      fontFace: FONTS.mono,
    });
  }
}

function renderImageV1(slide: PptxSlide, props: any): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
    slide.addShape('rect', {
      x: 0, y: 0, w: 10, h: 5.625,
      fill: { color: '000000', transparency: 40 },
    });
  }
  slide.addText(props.title, {
    x: 1, y: 2.4, w: 8, h: 1.0,
    fontSize: 48, color: COLORS.white, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.5, w: 7, h: 0.7,
      fontSize: 22, color: COLORS.white, align: 'center',
      fontFace: FONTS.body,
    });
  }
}

function renderMetricV1(slide: PptxSlide, props: any): void {
  if (props.label) {
    slide.addText(props.label, {
      x: 1, y: 1.8, w: 8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
  const metricText = props.unit ? `${props.value} ${props.unit}` : props.value;
  slide.addText(metricText, {
    x: 1, y: 2.4, w: 8, h: 1.4,
    fontSize: 90, color: COLORS.primary, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.description) {
    slide.addText(props.description, {
      x: 1.5, y: 4.1, w: 7, h: 0.8,
      fontSize: 20, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  }
}

function renderPartnersV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const partners = (props.partners || []).slice(0, 8);
  const cols = 4;
  const cellW = 2.0;
  const cellH = 1.1;
  const gapX = 0.4;
  const gapY = 0.3;
  const startX = (10 - (cols * cellW + (cols - 1) * gapX)) / 2;
  partners.forEach((partner: any, index: any) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + col * (cellW + gapX);
    const y = 2.5 + row * (cellH + gapY);
    slide.addShape('rect', {
      x, y, w: cellW, h: cellH,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    if (partner.logoUrl) addImageMaybe(slide, partner.logoUrl, x + 0.25, y + 0.15, cellW - 0.5, cellH - 0.5);
    slide.addText(partner.name || '', {
      x, y: y + cellH - 0.25, w: cellW, h: 0.25,
      fontSize: 12, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  });
}

function renderPestV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  render2x2Grid(slide, [
    { title: '政治 Political', text: props.political || '' },
    { title: '经济 Economic', text: props.economic || '' },
    { title: '社会 Social', text: props.social || '' },
    { title: '技术 Technological', text: props.technological || '' },
  ]);
}

function renderPricingV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const tiers = (props.tiers || []).slice(0, 3);
  const cardWidth = 2.5;
  const gap = 0.35;
  const startX = (10 - (tiers.length * cardWidth + (tiers.length - 1) * gap)) / 2;
  tiers.forEach((tier: any, index: any) => {
    const x = startX + index * (cardWidth + gap);
    const isHighlight = index === 1;
    slide.addShape('rect', {
      x, y: 2.6, w: cardWidth, h: 2.6,
      fill: { color: isHighlight ? COLORS.accent : COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(tier.name || '', {
      x, y: 2.8, w: cardWidth, h: 0.4,
      fontSize: 18, color: isHighlight ? COLORS.white : COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText([tier.price, tier.period].filter(Boolean).join(' '), {
      x, y: 3.25, w: cardWidth, h: 0.5,
      fontSize: 24, color: isHighlight ? COLORS.white : COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    const features = (tier.features || []).slice(0, 3);
    let fy = 3.85;
    features.forEach((feature: any) => {
      slide.addText(feature, {
        x: x + 0.15, y: fy, w: cardWidth - 0.3, h: 0.3,
        fontSize: 12, color: isHighlight ? COLORS.white : COLORS.secondary, align: 'center',
        fontFace: FONTS.body,
      });
      fy += 0.35;
    });
    if (tier.cta) {
      slide.addText(tier.cta, {
        x: x + 0.3, y: 4.8, w: cardWidth - 0.6, h: 0.3,
        fontSize: 12, color: isHighlight ? COLORS.accent : COLORS.white,
        fill: isHighlight ? { color: COLORS.white } : { color: COLORS.accent },
        align: 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    }
  });
}

function renderProcessV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const steps = props.steps || [];
  const count = steps.length;
  if (count === 0) {
    slide.addText('（暂无流程步骤）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const stepWidth = 8.4 / count;
  steps.forEach((step: any, index: any) => {
    const x = 0.8 + index * stepWidth;
    slide.addShape('ellipse', {
      x: x + stepWidth / 2 - 0.3, y: 2.6, w: 0.6, h: 0.6,
      fill: { color: COLORS.accent },
    });
    slide.addText(String(index + 1), {
      x: x + stepWidth / 2 - 0.3, y: 2.6, w: 0.6, h: 0.6,
      fontSize: 22, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(step, {
      x: x + 0.1, y: 3.5, w: stepWidth - 0.2, h: 1.2,
      fontSize: 18, color: COLORS.primary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderQuoteV1(slide: PptxSlide, props: any): void {
  slide.addText(`“${props.quote}”`, {
    x: 1, y: 2.0, w: 8, h: 2.2,
    fontSize: 36, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  const attribution = [props.author, props.source].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1, y: 4.4, w: 8, h: 0.4,
      fontSize: 18, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

function renderQuoteV2(slide: PptxSlide, props: any): void {
  slide.addShape('rect', {
    x: 0.6, y: 1.5, w: 0.15, h: 2.8,
    fill: { color: COLORS.accent },
  });
  slide.addText(`“${props.quote}”`, {
    x: 1.0, y: 1.8, w: 8.0, h: 2.0,
    fontSize: 34, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
  const attribution = [props.author, props.role].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1.0, y: 4.0, w: 8.0, h: 0.4,
      fontSize: 18, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

function renderQuoteV3(slide: PptxSlide, props: any): void {
  slide.addText('"', {
    x: 0.8, y: 1.0, w: 1.5, h: 1.5,
    fontSize: 120, color: COLORS.accent, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
  slide.addText(props.quote, {
    x: 2.0, y: 1.6, w: 7.2, h: 2.6,
    fontSize: 28, color: COLORS.primary, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
  const meta = [props.author, props.role].filter(Boolean).join(' · ');
  if (meta) {
    slide.addText(meta, {
      x: 2.0, y: 4.4, w: 7.2, h: 0.4,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.body,
    });
  }
  if (props.source) {
    slide.addText(props.source, {
      x: 2.0, y: 4.85, w: 7.2, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

function renderRoadmapV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const phases = (props.phases || []).slice(0, 4);
  let y = 2.1;
  phases.forEach((phase: any, index: any) => {
    const statusColor = phase.status === '已完成' ? COLORS.accent : COLORS.secondary;
    slide.addShape('rect', {
      x: 0.8, y, w: 0.2, h: 0.7,
      fill: { color: statusColor },
    });
    slide.addText(`${index + 1}. ${phase.title || ''}`, {
      x: 1.1, y, w: 7.8, h: 0.35,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(phase.description || '', {
      x: 1.1, y: y + 0.38, w: 7.8, h: 0.45,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.8;
  });
}

function renderStatsV1(slide: PptxSlide, props: any): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const cardW = (mainW - 0.4) / 2;
  const startX = 0.8;

  addKicker(slide, props.kicker);
  addTitle(slide, props.title, startX, 1.3, mainW);
  const stats = (props.stats || []).slice(0, 4);
  const positions = [
    { x: startX, y: 2.5 },
    { x: startX + cardW + 0.2, y: 2.5 },
    { x: startX, y: 4.0 },
    { x: startX + cardW + 0.2, y: 4.0 },
  ];
  stats.forEach((stat: any, index: any) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: cardW, h: 1.3,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    const valueText = [stat.value, stat.unit].filter(Boolean).join(' ');
    slide.addText(valueText || '-', {
      x: pos.x + 0.2, y: pos.y + 0.15, w: cardW - 0.4, h: 0.55,
      fontSize: 30, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(stat.label || '', {
      x: pos.x + 0.2, y: pos.y + 0.75, w: cardW - 1.0, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.body,
    });
    if (stat.change) {
      slide.addText(stat.change, {
        x: pos.x + cardW - 1.0, y: pos.y + 0.75, w: 0.8, h: 0.35,
        fontSize: 14, color: COLORS.accent, align: 'right',
        fontFace: FONTS.mono,
      });
    }
  });

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

function renderSwotV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  render2x2Grid(slide, [
    { title: '优势 Strengths', text: props.strength || '' },
    { title: '劣势 Weaknesses', text: props.weakness || '' },
    { title: '机会 Opportunities', text: props.opportunity || '' },
    { title: '威胁 Threats', text: props.threat || '' },
  ]);
}

function renderTableOfContentsV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const items = (props.items || []).slice(0, 4);
  let y = 2.4;
  items.forEach((item: any, index: any) => {
    const number = String(index + 1).padStart(2, '0');
    slide.addText(number, {
      x: 0.8, y, w: 0.8, h: 0.45,
      fontSize: 18, color: COLORS.accent, align: 'left', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(item, {
      x: 1.7, y, w: 7.8, h: 0.45,
      fontSize: 26, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.75;
  });
}

function renderTeamV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const members = (props.members || []).slice(0, 4);
  const cardWidth = 2.0;
  const gap = 0.4;
  const startX = (10 - (members.length * cardWidth + (members.length - 1) * gap)) / 2;
  members.forEach((member: any, index: any) => {
    const x = startX + index * (cardWidth + gap);
    if (member.imageUrl) addImageMaybe(slide, member.imageUrl, x + 0.5, 2.7, 1, 1);
    slide.addText(member.name || '', {
      x, y: 3.85, w: cardWidth, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText(member.role || '', {
      x, y: 4.2, w: cardWidth, h: 0.3,
      fontSize: 12, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
    slide.addText(member.bio || '', {
      x, y: 4.55, w: cardWidth, h: 0.55,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderTeamV2(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Team');
  const members = props.members ?? [];
  const maxMembers = 4;
  const cardW = 2.05;
  const gap = 0.3;
  const startX = 0.6;
  const y = 2.4;
  const h = 3.2;
  members.slice(0, maxMembers).forEach((member: any, index: any) => {
    const x = startX + index * (cardW + gap);
    slide.addShape('rect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    slide.addShape('ellipse', {
      x: x + cardW / 2 - 0.35, y: y + 0.25, w: 0.7, h: 0.7,
      fill: { color: COLORS.border },
    });
    slide.addText(member.name ?? `Member ${index + 1}`, {
      x: x + 0.15, y: y + 1.05, w: cardW - 0.3, h: 0.35,
      fontSize: 17, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(member.role ?? '', {
      x: x + 0.15, y: y + 1.45, w: cardW - 0.3, h: 0.3,
      fontSize: 13, color: COLORS.accent, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(member.bio ?? '', {
      x: x + 0.15, y: y + 1.85, w: cardW - 0.3, h: 1.25,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderTestimonialV1(slide: PptxSlide, props: any): void {
  slide.addText(`“${props.quote}”`, {
    x: 1, y: 1.8, w: 8, h: 2.2,
    fontSize: 34, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  if (props.avatarUrl) addImageMaybe(slide, props.avatarUrl, 4.5, 4.1, 1, 1);
  const attribution = [props.author, props.role, props.company].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1, y: 5.0, w: 8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme01AppendixV1(slide: PptxSlide, props: any): void {
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 0.8, w: 8.4, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'left', fontFace: FONTS.mono,
    });
  }
  addTitle(slide, props.title ?? '附录 / 数据来源', 0.8, 1.25);
  const sources = (props.sources || []).slice(0, 8);
  if (sources.length === 0) return;

  let cy = 2.4;
  for (const source of sources) {
    const label = source.label ? `[${source.label}] ` : '';
    slide.addText(`${label}${source.value || ''}`, {
      x: 0.8, y: cy, w: 8.4, h: 0.55,
      fontSize: 15, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    cy += 0.65;
  }
}

function renderTheme01BentoV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Bento');
  const items = (props.items || []).slice(0, 4);
  if (items.length === 0) {
    slide.addText('（暂无 Bento 内容）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const positions = [
    { x: 0.8, y: 2.4, w: 4.0, h: 2.8 },
    { x: 5.2, y: 2.4, w: 4.0, h: 1.3 },
    { x: 5.2, y: 3.9, w: 1.9, h: 1.3 },
    { x: 7.3, y: 3.9, w: 1.9, h: 1.3 },
  ];

  items.forEach((item: any, index: any) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: pos.w, h: pos.h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    });
    if (item.imageUrl) addImageMaybe(slide, item.imageUrl, pos.x + 0.08, pos.y + 0.08, pos.w - 0.16, pos.h * 0.45);
    slide.addText(item.title || '', {
      x: pos.x + 0.15, y: pos.y + pos.h * 0.55, w: pos.w - 0.3, h: 0.45,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(item.description || '', {
      x: pos.x + 0.15, y: pos.y + pos.h * 0.55 + 0.45, w: pos.w - 0.3, h: 0.6,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderTheme01CaseStudy(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '案例');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.05, w: 8.4, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  if (props.intro) {
    slide.addText(props.intro, {
      x: 0.8, y: 2.45, w: 8.4, h: 0.6,
      fontSize: 14, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const rounds = (props.rounds || [])
    .filter((r: any) => r != null && (r.date || r.round || r.amount))
    .slice(0, 6);

  if (rounds.length > 0) {
    const startY = props.intro ? 3.2 : 2.55;
    const rowH = 0.55;
    const colW = 8.4 / 4;
    const startX = 0.8;

    const headers = ['日期', '轮次', '估值', '金额'];
    headers.forEach((header, index) => {
      const x = startX + index * colW;
      slide.addShape('rect', {
        x, y: startY, w: colW, h: 0.35,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(header, {
        x, y: startY, w: colW, h: 0.35,
        fontSize: 11, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle',
        fontFace: FONTS.heading,
      });
    });

    rounds.forEach((round: any, rowIndex: any) => {
      const y = startY + 0.35 + rowIndex * rowH;
      const cells = [round.date || '', round.round || '', round.valuation || '', round.amount || ''];
      cells.forEach((cell, colIndex) => {
        const x = startX + colIndex * colW;
        const bg = rowIndex % 2 === 0 ? COLORS.surface : COLORS.surfaceElevated;
        slide.addShape('rect', {
          x, y, w: colW, h: rowH,
          fill: { color: bg },
          line: { color: COLORS.border, width: 1 },
        });
        slide.addText(cell, {
          x: x + 0.06, y, w: colW - 0.12, h: rowH,
          fontSize: 11, color: COLORS.primary, align: 'center', valign: 'middle',
          fontFace: FONTS.body,
        });
      });
    });
  }

  if (props.quote) {
    slide.addText(`“${props.quote}”`, {
      x: 0.8, y: 4.85, w: 8.4, h: 0.55,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    if (props.quoteAuthor) {
      slide.addText(`—— ${props.quoteAuthor}`, {
        x: 0.8, y: 5.35, w: 8.4, h: 0.25,
        fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.mono,
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.7, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme01ChapterV3(slide: PptxSlide, props: any): void {
  addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: '000000', transparency: 40 },
  });

  const titleH = 0.9;
  const subtitleH = props.subtitle ? 0.45 : 0;
  const cardH = 0.9 + titleH + subtitleH + 0.7;
  const cardY = (5.625 - cardH) / 2;

  slide.addShape('rect', {
    x: 1.5, y: cardY, w: 7, h: cardH,
    fill: { color: 'F2E9DC', transparency: 92 },
    line: { color: '3A342A', width: 1 },
    rectRadius: 0.15,
  });

  let cy = cardY + 0.35;
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 1.75, y: cy, w: 6.5, h: 0.35,
      fontSize: 13, color: COLORS.accent, align: 'center', valign: 'top',
      fontFace: FONTS.mono,
    });
    cy += 0.45;
  }
  slide.addText(props.title, {
    x: 1.75, y: cy, w: 6.5, h: titleH,
    fontSize: 40, color: COLORS.white, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  cy += titleH + 0.1;
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.75, y: cy, w: 6.5, h: subtitleH,
      fontSize: 18, color: COLORS.white, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }
}

function renderTheme01ChartDonut(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '环形图');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.05, w: 8.4, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const rawSegments = (props.segments || [])
    .filter((s: any) => s != null && !!(s.label || s.value))
    .map((s: any) => ({ ...s }))
    .sort((a: any, b: any) => {
      const na = parseFloat(String(a.value || '0').replace(/,/g, ''));
      const nb = parseFloat(String(b.value || '0').replace(/,/g, ''));
      return nb - na;
    });

  if (rawSegments.length === 0) {
    slide.addText('（暂无环形图数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const totalValue = rawSegments.reduce((sum: any, s: any) => {
    return sum + parseFloat(String(s.value || '0').replace(/,/g, ''));
  }, 0);

  const segments = rawSegments.map((s: any, i: any) => {
    const n = parseFloat(String(s.value || '0').replace(/,/g, ''));
    const pct = totalValue > 0 ? Math.round((n / totalValue) * 1000) / 10 : 0;
    return {
      ...s,
      percent: s.percent || `${pct}%`,
      numericValue: n,
      color: s.color || `var(--lp-${['blue', 'green', 'amber', 'red', 'violet'][i % 5]})`,
    };
  });

  const labels = segments.map((s: any) => s.label || '');
  const values = segments.map((s: any) => s.numericValue);
  const chartColors = segments.map((_: any, i: any) => CHART_COLORS[i % CHART_COLORS.length]);

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const chartW = hasInsight ? 4.2 : 4.8;
  slide.addChart('doughnut' as 'pie', [
    { name: props.title || '', labels, values },
  ], {
    x: 0.6, y: 2.4, w: chartW, h: 3.0,
    chartColors,
    showValue: false,
    holeSize: 60,
  } as any);

  const total = props.total || { value: String(totalValue), label: '合计' };
  const centerX = 0.6 + chartW / 2;
  slide.addText(total.value || String(totalValue), {
    x: centerX - 1.8, y: 3.4, w: 3.6, h: 0.6,
    fontSize: 28, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(total.label || '合计', {
    x: centerX - 1.8, y: 4.0, w: 3.6, h: 0.3,
    fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
    fontFace: FONTS.body,
  });

  // 右侧图例列表
  const legendX = hasInsight ? 5.0 : 5.7;
  const legendW = hasInsight ? 2.6 : 3.3;
  let legendY = 2.5;
  segments.forEach((segment: any, index: any) => {
    const color = chartColors[index % chartColors.length];
    slide.addShape('ellipse', {
      x: legendX, y: legendY + 0.08, w: 0.18, h: 0.18,
      fill: { color },
    });
    slide.addText(segment.label || '', {
      x: legendX + 0.3, y: legendY, w: legendW - 1.4, h: 0.28,
      fontSize: 13, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    if (segment.labelEn) {
      slide.addText(segment.labelEn, {
        x: legendX + 0.3, y: legendY + 0.26, w: legendW - 1.4, h: 0.22,
        fontSize: 10, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
    slide.addText(segment.percent || '', {
      x: legendX + legendW - 1.0, y: legendY, w: 0.9, h: 0.28,
      fontSize: 13, color: COLORS.accent, bold: true, align: 'right', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(segment.value || '', {
      x: legendX + legendW - 1.0, y: legendY + 0.26, w: 0.9, h: 0.22,
      fontSize: 10, color: COLORS.secondary, align: 'right', valign: 'top',
      fontFace: FONTS.mono,
    });
    legendY += segment.labelEn ? 0.65 : 0.5;
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 8.0, y: 2.3, w: 2.4, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 8.2, y: cursorY, w: 2.0, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 8.2, y: cursorY, w: 2.0, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 8.2, y: cursorY, w: 2.0, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.6, y: 5.7, w: 8.8, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme01ComparisonV2(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '评分对比');
  const cards = (props.cards || []).slice(0, 4);
  const count = cards.length || 1;
  const gap = 0.25;
  const cardW = (8.4 - gap * (count - 1)) / count;
  const startX = 0.8;
  const y = 2.5;
  const h = 3.0;

  cards.forEach((card: any, index: any) => {
    const score = typeof card.score === 'number' ? card.score : 0;
    const max = typeof card.max === 'number' && card.max > 0 ? card.max : 100;
    const pct = Math.min(100, Math.max(0, (score / max) * 100));
    const x = startX + index * (cardW + gap);
    slide.addShape('rect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(card.label || '', {
      x: x + 0.16, y: y + 0.2, w: cardW - 0.32, h: 0.45,
      fontSize: 17, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`${score} / ${max}`, {
      x: x + 0.16, y: y + 0.75, w: cardW - 0.32, h: 0.4,
      fontSize: 22, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addShape('rect', {
      x: x + 0.16, y: y + 1.25, w: cardW - 0.32, h: 0.12,
      fill: { color: COLORS.light },
    });
    slide.addShape('rect', {
      x: x + 0.16, y: y + 1.25, w: (cardW - 0.32) * (pct / 100), h: 0.12,
      fill: { color: COLORS.accent },
    });
    if (card.note) {
      slide.addText(card.note, {
        x: x + 0.16, y: y + 1.55, w: cardW - 0.32, h: 1.15,
        fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme01ConclusionV1(slide: PptxSlide, props: any): void {
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 0.8, w: 8.4, h: 0.4,
      fontSize: 14, color: COLORS.accent, align: 'left', fontFace: FONTS.mono,
    });
  }
  addTitle(slide, props.title ?? '结论', 0.8, 1.25);
  const points = (props.points || []).slice(0, 4);
  if (points.length === 0) return;

  const count = points.length;
  const gap = 0.25;
  const cardW = (8.4 - gap * (count - 1)) / count;
  const startX = 0.8;
  const y = 2.6;
  const h = 2.6;

  points.forEach((point: any, index: any) => {
    const x = startX + index * (cardW + gap);
    slide.addShape('rect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(String(index + 1), {
      x: x + 0.16, y: y + 0.16, w: 0.6, h: 0.5,
      fontSize: 28, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(point, {
      x: x + 0.16, y: y + 0.85, w: cardW - 0.32, h: 1.55,
      fontSize: 16, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderTheme01ContentV3(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '内容');
  const columns = (props.columns || []).slice(0, 3);
  const count = columns.length || 1;
  const gap = 0.25;
  const cardW = (8.4 - gap * (count - 1)) / count;
  const startX = 0.8;
  const y = 2.5;
  const h = 3.0;

  columns.forEach((column: any, index: any) => {
    const x = startX + index * (cardW + gap);
    slide.addShape('rect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(column.title || '', {
      x: x + 0.16, y: y + 0.2, w: cardW - 0.32, h: 0.45,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(column.text || '', {
      x: x + 0.16, y: y + 0.75, w: cardW - 0.32, h: 1.9,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderTheme01DiptychContrast(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '双联对比');
  const left = props.left || {};
  const right = props.right || {};
  const centerCard = props.centerCard || {};
  const comparisons = (centerCard.comparisons || []).slice(0, 3);

  // 左右背景区
  slide.addShape('rect', {
    x: 0.8, y: 2.3, w: 4.0, h: 3.6,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  });
  slide.addShape('rect', {
    x: 5.2, y: 2.3, w: 4.0, h: 3.6,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  });
  if (left.imageUrl) addImageMaybe(slide, left.imageUrl, 0.9, 2.4, 3.8, 2.6);
  if (right.imageUrl) addImageMaybe(slide, right.imageUrl, 5.3, 2.4, 3.8, 2.6);

  slide.addText(left.labelEn || '', {
    x: 0.8, y: 2.45, w: 4.0, h: 0.25,
    fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
    fontFace: FONTS.mono,
  });
  slide.addText(left.label || '', {
    x: 0.8, y: 5.1, w: 4.0, h: 0.5,
    fontSize: 22, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(right.labelEn || '', {
    x: 5.2, y: 2.45, w: 4.0, h: 0.25,
    fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
    fontFace: FONTS.mono,
  });
  slide.addText(right.label || '', {
    x: 5.2, y: 5.1, w: 4.0, h: 0.5,
    fontSize: 22, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  // 中央结论卡
  slide.addShape('rect', {
    x: 3.3, y: 2.7, w: 3.4, h: 2.8,
    fill: { color: COLORS.surface },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  });
  if (centerCard.title) {
    slide.addText(centerCard.title, {
      x: 3.5, y: 2.85, w: 3.0, h: 0.4,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
  }
  comparisons.forEach((item: any, index: any) => {
    const y = 3.35 + index * 0.55;
    slide.addText(item.leftValue || '', {
      x: 3.5, y, w: 1.0, h: 0.25,
      fontSize: 13, color: COLORS.primary, bold: true, align: 'right', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(item.leftLabel || '', {
      x: 3.5, y: y + 0.22, w: 1.0, h: 0.18,
      fontSize: 9, color: COLORS.secondary, align: 'right', valign: 'middle',
      fontFace: FONTS.body,
    });
    slide.addText('VS', {
      x: 4.6, y, w: 0.8, h: 0.25,
      fontSize: 10, color: COLORS.accent, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
    slide.addText(item.rightValue || '', {
      x: 5.5, y, w: 1.0, h: 0.25,
      fontSize: 13, color: COLORS.primary, bold: true, align: 'left', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(item.rightLabel || '', {
      x: 5.5, y: y + 0.22, w: 1.0, h: 0.18,
      fontSize: 9, color: COLORS.secondary, align: 'left', valign: 'middle',
      fontFace: FONTS.body,
    });
  });
  if (centerCard.conclusion) {
    slide.addText(centerCard.conclusion, {
      x: 3.5, y: 4.95, w: 3.0, h: 0.45,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.85, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme01FilmstripV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Filmstrip');
  const images = (props.images || []).slice(0, 5);
  if (images.length === 0) {
    slide.addText('（暂无影像）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const gap = 0.2;
  const frameW = (8.4 - gap * (images.length - 1)) / images.length;
  const startX = 0.8;
  const y = 2.5;
  const imgH = 2.2;

  images.forEach((image: any, index: any) => {
    const x = startX + index * (frameW + gap);
    slide.addShape('rect', {
      x, y, w: frameW, h: imgH + 0.5,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    if (image.url) addImageMaybe(slide, image.url, x + 0.06, y + 0.06, frameW - 0.12, imgH);
    if (image.caption) {
      slide.addText(image.caption, {
        x, y: y + imgH + 0.08, w: frameW, h: 0.35,
        fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme01GalleryV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Gallery');
  const images = (props.images || []).slice(0, 4);
  const positions = [
    { x: 0.8, y: 2.5 },
    { x: 5.2, y: 2.5 },
    { x: 0.8, y: 4.0 },
    { x: 5.2, y: 4.0 },
  ];
  images.forEach((image: any, index: any) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 4.0, h: 1.3,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    if (image.url) addImageMaybe(slide, image.url, pos.x + 0.08, pos.y + 0.08, 3.84, 0.9);
    if (image.caption) {
      slide.addText(image.caption, {
        x: pos.x, y: pos.y + 1.05, w: 4.0, h: 0.25,
        fontSize: 12, color: COLORS.secondary, align: 'center',
        fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme01GanttV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '甘特排期');
  const tasks = (props.tasks || []).slice(0, 8);
  const phases = (props.phases?.length ? props.phases : ['Q1', 'Q2', 'Q3', 'Q4']).slice(0, 6);
  const chartColors = ['6E9BC4', '8FAE84', 'D9A441', 'C76B5A', 'A07CAE', 'C98BA0', '5FA8A0', 'A7A85F'];

  if (tasks.length === 0) {
    slide.addText('（暂无排期数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const endX = 9.2;
  const totalW = endX - startX;
  const headerY = 2.3;
  const bodyY = 2.85;
  const rowH = 0.42;
  const phaseW = totalW / phases.length;

  // phase header
  phases.forEach((phase: any, i: any) => {
    const x = startX + i * phaseW;
    slide.addText(phase, {
      x, y: headerY, w: phaseW, h: 0.35,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
    if (i > 0) {
      slide.addShape('line', {
        x1: x, y1: headerY, x2: x, y2: bodyY + tasks.length * rowH,
        line: { color: COLORS.border, width: 1 },
      });
    }
  });

  // tasks
  tasks.forEach((task: any, index: any) => {
    const y = bodyY + index * rowH;
    const start = Math.max(0, Math.min(100, task.start ?? 0));
    const end = Math.max(start, Math.min(100, task.end ?? 100));
    const barX = startX + (start / 100) * totalW;
    const barW = ((end - start) / 100) * totalW;
    const color = task.color ? task.color.replace('#', '') : chartColors[index % chartColors.length];

    slide.addText(task.name || '', {
      x: 0.8, y, w: 2.0, h: rowH,
      fontSize: 12, color: COLORS.primary, align: 'left', valign: 'middle',
      fontFace: FONTS.body,
    });
    slide.addShape('rect', {
      x: barX, y: y + 0.08, w: Math.max(0.05, barW), h: 0.26,
      fill: { color },
      rectRadius: 0.05,
    });
  });
}

function renderTheme01MetricBig(slide: PptxSlide, props: any): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const mainX = 0.8;

  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '核心指标', mainX, 1.3, mainW);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: mainX, y: 2.05, w: mainW, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const valueText = [props.value, props.unit].filter(Boolean).join(' ') || '0';
  slide.addText(valueText, {
    x: mainX, y: 2.7, w: mainW, h: 1.2,
    fontSize: hasInsight ? 60 : 72, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  if (props.context) {
    slide.addText(props.context, {
      x: mainX + (hasInsight ? 0.7 : 0.7), y: 4.0, w: hasInsight ? mainW - 1.4 : 7.0, h: 0.6,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).filter((m: any) => m != null && (m.value || m.label)).slice(0, 4);
  if (metrics.length > 0) {
    const count = metrics.length;
    const gap = 0.25;
    const cardW = (mainW - gap * (count - 1)) / count;
    const startX = mainX;
    const y = 4.85;
    const h = 0.65;

    metrics.forEach((metric: any, index: any) => {
      const x = startX + index * (cardW + gap);
      const bg = metric.accent ? COLORS.accent : COLORS.surfaceElevated;
      const textColor = metric.accent ? COLORS.white : COLORS.primary;
      slide.addShape('rect', {
        x, y, w: cardW, h,
        fill: { color: bg },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      });
      slide.addText(metric.value || '', {
        x: x + 0.1, y: y + 0.08, w: cardW - 0.2, h: 0.32,
        fontSize: 18, color: textColor, bold: true, align: 'center', valign: 'top',
        fontFace: FONTS.heading,
      });
      slide.addText(metric.label || '', {
        x: x + 0.1, y: y + 0.36, w: cardW - 0.2, h: 0.24,
        fontSize: 11, color: metric.accent ? COLORS.white : COLORS.secondary, align: 'center', valign: 'top',
        fontFace: FONTS.body,
      });
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: mainX, y: 5.7, w: mainW, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

function renderTheme01MetricTriptych(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '指标总览');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.15, w: 8.4, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const panels = (props.panels || []).slice(0, 3);
  if (panels.length === 0) {
    slide.addText('（暂无指标）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  const panelW = 8.4 / panels.length;
  const startX = 0.8;
  const startY = 2.7;
  const cardH = 3.0;
  panels.forEach((panel: any, index: any) => {
    const x = startX + index * panelW;
    slide.addShape('rect', {
      x, y: startY, w: panelW - 0.15, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(panel.index || String(index + 1).padStart(2, '0'), {
      x: x + 0.15, y: startY + 0.15, w: 0.6, h: 0.35,
      fontSize: 14, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(panel.title || '', {
      x: x + 0.15, y: startY + 0.55, w: panelW - 0.45, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(panel.value || '', {
      x: x + 0.15, y: startY + 0.95, w: panelW - 0.45, h: 0.6,
      fontSize: 32, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    // 简化迷你图：用一组小方块表示趋势
    const values = (panel.chartData || []).filter((v: any): v is number => typeof v === 'number');
    if (values.length > 1) {
      const max = Math.max(...values, 1);
      const min = Math.min(...values, 0);
      const range = max - min || 1;
      const barW = (panelW - 0.6) / values.length * 0.7;
      const gap = (panelW - 0.6) / values.length * 0.3;
      values.forEach((v: any, i: any) => {
        const barH = Math.max(((v - min) / range) * 0.6, 0.08);
        slide.addShape('rect', {
          x: x + 0.15 + i * (barW + gap),
          y: startY + 2.4 - barH,
          w: barW,
          h: barH,
          fill: { color: COLORS.accent },
        });
      });
    }
    slide.addText(panel.subtitle || '', {
      x: x + 0.15, y: startY + 2.45, w: panelW - 0.45, h: 0.4,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.85, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme01MetricV2(slide: PptxSlide, props: any): void {
  const stats = (props.metrics || []).map((m: any) => ({
    label: m.label || '',
    value: m.value || '0',
    unit: m.unit || '',
  }));
  renderStatsV1(slide, { kicker: props.kicker, title: props.title ?? '关键指标', stats });
}

function renderTheme01OutlookV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '投资展望');
  const items = (props.items || []).slice(0, 3);

  if (items.length === 0) {
    slide.addText('（暂无展望数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const y = 2.35;
  const gap = 0.2;
  const cardW = (8.4 - gap * (items.length - 1)) / items.length;
  const cardH = 2.8;

  items.forEach((item: any, index: any) => {
    const x = startX + index * (cardW + gap);

    slide.addShape('rect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addShape('ellipse', {
      x: x + cardW / 2 - 0.2, y: y + 0.18, w: 0.4, h: 0.4,
      fill: { color: COLORS.accent },
    });
    slide.addText(String(index + 1), {
      x: x + cardW / 2 - 0.2, y: y + 0.18, w: 0.4, h: 0.4,
      fontSize: 16, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(item.title || '', {
      x: x + 0.14, y: y + 0.72, w: cardW - 0.28, h: 0.45,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`趋势：${item.trend || ''}`, {
      x: x + 0.14, y: y + 1.25, w: cardW - 0.28, h: 0.55,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(`行动：${item.action || ''}`, {
      x: x + 0.14, y: y + 1.85, w: cardW - 0.28, h: cardH - 2.05,
      fontSize: 12, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderTheme01QuadrantV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '四象限分析');
  const quadrants = (props.quadrants || []).slice(0, 4);
  const defaultLabels = ['高价值 / 高可行性', '高价值 / 低可行性', '低价值 / 高可行性', '低价值 / 低可行性'];
  const colors = ['6E9BC4', '8FAE84', 'D9A441', 'C76B5A'];

  if (quadrants.length === 0) {
    slide.addText('（暂无四象限数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const startY = 2.4;
  const gap = 0.2;
  const cardW = (8.4 - gap) / 2;
  const cardH = (2.8 - gap) / 2;

  quadrants.forEach((q: any, index: any) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    const color = colors[index % colors.length];

    slide.addShape('rect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addShape('rect', {
      x, y, w: cardW, h: 0.08,
      fill: { color },
      rectRadius: 0.1,
    });
    slide.addText(q.label || defaultLabels[index] || '', {
      x: x + 0.14, y: y + 0.2, w: cardW - 0.28, h: 0.4,
      fontSize: 15, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    const items = (q.items || []).slice(0, 4);
    if (items.length > 0) {
      slide.addText(items.join('\n'), {
        x: x + 0.14, y: y + 0.65, w: cardW - 0.28, h: cardH - 0.8,
        fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
  });

  if (props.xAxis) {
    slide.addText(props.xAxis, {
      x: startX, y: 5.35, w: 8.4, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.mono,
    });
  }
  if (props.yAxis) {
    slide.addText(props.yAxis, {
      x: 0.2, y: startY + 1.25, w: 0.4, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme01RankingV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '排名');
  const items = (props.items || [])
    .filter((item: any) => typeof item.value === 'number')
    .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0))
    .slice(0, 8);

  if (items.length === 0) {
    slide.addText('（暂无排名数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = items.map((item: any) => item.label || '');
  const values = items.map((item: any) => item.value ?? 0);
  const chartColors = items.map((_: any, i: any) => CHART_COLORS[i % CHART_COLORS.length]);

  slide.addChart('bar', [{ name: props.title || '数值', labels, values }], {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 11,
  });
}

function renderTheme01RegionV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '地区/市场分布');
  const regions = (props.regions || []).slice(0, 6);

  if (regions.length === 0) {
    slide.addText('（暂无地区数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const startY = 2.35;
  const gap = 0.2;
  const cols = regions.length <= 4 ? 3 : 3;
  const rows = Math.ceil(regions.length / cols);
  const cardW = (8.4 - gap * (cols - 1)) / cols;
  const cardH = (2.8 - gap * (rows - 1)) / rows;

  regions.forEach((region: any, index: any) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);

    slide.addShape('rect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(region.name || '', {
      x: x + 0.12, y: y + 0.12, w: cardW - 0.24, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(region.value || '', {
      x: x + 0.12, y: y + 0.5, w: cardW - 0.24, h: 0.55,
      fontSize: 24, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    if (region.change) {
      slide.addText(region.change, {
        x: x + 0.12, y: y + 1.05, w: cardW - 0.24, h: 0.3,
        fontSize: 12, color: COLORS.accent, align: 'left', valign: 'top',
        fontFace: FONTS.mono,
      });
    }
    if (region.note) {
      slide.addText(region.note, {
        x: x + 0.12, y: y + 1.4, w: cardW - 0.24, h: cardH - 1.55,
        fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme01RiskV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '风险研判');
  const items = (props.items || []).slice(0, 4);

  if (items.length === 0) {
    slide.addText('（暂无风险数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const startX = 0.8;
  const startY = 2.35;
  const gap = 0.22;
  const cardW = (8.4 - gap) / 2;
  const cardH = (2.8 - gap) / 2;

  items.forEach((item: any, index: any) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);

    slide.addShape('rect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    slide.addText(String(index + 1).padStart(2, '0'), {
      x: x + cardW - 0.55, y: y + 0.12, w: 0.45, h: 0.35,
      fontSize: 14, color: COLORS.accent, align: 'right', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(item.risk || '', {
      x: x + 0.14, y: y + 0.12, w: cardW - 0.7, h: 0.45,
      fontSize: 15, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`影响：${item.impact || ''}`, {
      x: x + 0.14, y: y + 0.62, w: cardW - 0.28, h: 0.35,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(`应对：${item.response || ''}`, {
      x: x + 0.14, y: y + 1.0, w: cardW - 0.28, h: cardH - 1.15,
      fontSize: 12, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderTheme01RoadmapV1(slide: PptxSlide, props: any): void {
  const phases = (props.phases || []).map((p: any) => ({
    title: p.phase || '',
    description: (p.items || []).join('\n'),
  }));
  renderRoadmapV1(slide, { kicker: props.kicker, title: props.title ?? '路线图', phases });
}

function renderTheme01ScorecardV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '评分卡');
  const items = (props.items || []).slice(0, 5);
  if (items.length === 0) return;

  const startY = 2.3;
  const rowH = 0.65;
  const barH = 0.12;
  const maxW = 8.4;

  items.forEach((item: any, index: any) => {
    const y = startY + index * rowH;
    const score = typeof item.score === 'number' ? item.score : 0;
    const max = typeof item.max === 'number' && item.max > 0 ? item.max : 100;
    const pct = Math.min(100, Math.max(0, (score / max) * 100));

    slide.addText(item.label || '', {
      x: 0.8, y, w: 4.5, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`${score} / ${max}`, {
      x: 5.4, y, w: 1.8, h: 0.35,
      fontSize: 16, color: COLORS.accent, bold: true, align: 'right', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addShape('rect', {
      x: 0.8, y: y + 0.4, w: maxW, h: barH,
      fill: { color: COLORS.light },
    });
    slide.addShape('rect', {
      x: 0.8, y: y + 0.4, w: maxW * (pct / 100), h: barH,
      fill: { color: COLORS.accent },
    });
  });
}

function renderTheme01SpotlightGrid(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '主题聚焦');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.15, w: 8.4, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const columns = (props.columns || []).slice(0, 4);
  if (columns.length === 0) {
    slide.addText('（暂无内容）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  const colW = 8.4 / columns.length;
  const startX = 0.8;
  const startY = 2.7;
  const cardH = 3.0;
  columns.forEach((col: any, index: any) => {
    const x = startX + index * colW;
    slide.addShape('rect', {
      x, y: startY, w: colW - 0.15, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    });
    if (col.tag) {
      slide.addText(col.tag, {
        x: x + 0.15, y: startY + 0.15, w: colW - 0.45, h: 0.3,
        fontSize: 12, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
        fontFace: FONTS.mono,
      });
    }
    if (col.imageUrl) {
      addImageMaybe(slide, col.imageUrl, x + 0.15, startY + 0.55, colW - 0.45, 1.0);
    }
    slide.addText(col.title || '', {
      x: x + 0.15, y: startY + 1.65, w: colW - 0.45, h: 0.45,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(col.description || '', {
      x: x + 0.15, y: startY + 2.1, w: colW - 0.45, h: 0.75,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.85, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme01TableData(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '数据表格');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.05, w: 8.4, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const columns = (props.columns || []).filter((c: any) => c.key && c.label);
  const rows = (props.rows || []).filter((r: any) => r != null).slice(0, 12);
  const effectiveHighlightRow = props.highlightRow ?? (Array.isArray(props.highlightRows) && props.highlightRows.length ? props.highlightRows[0] : undefined);

  if (columns.length === 0 || rows.length === 0) {
    slide.addText('（暂无表格数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const tableW = 8.4;
  const startX = 0.8;
  const startY = 2.55;
  const rowH = 0.42;
  const colW = tableW / columns.length;

  columns.forEach((column: any, index: any) => {
    const x = startX + index * colW;
    slide.addShape('rect', {
      x, y: startY, w: colW, h: rowH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(column.label || '', {
      x, y: startY, w: colW, h: rowH,
      fontSize: 12, color: COLORS.primary, bold: true, align: column.align || 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
  });

  rows.forEach((row: any, rowIndex: any) => {
    const y = startY + rowH * (rowIndex + 1);
    const isHighlight = effectiveHighlightRow === rowIndex;
    const bg = isHighlight ? '3A2A20' : (rowIndex % 2 === 0 ? COLORS.surface : COLORS.surfaceElevated);
    columns.forEach((column: any, colIndex: any) => {
      const x = startX + colIndex * colW;
      slide.addShape('rect', {
        x, y, w: colW, h: rowH,
        fill: { color: bg },
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(row[column.key || ''] ?? '', {
        x: x + 0.06, y, w: colW - 0.12, h: rowH,
        fontSize: 11, color: isHighlight ? COLORS.accent : COLORS.primary,
        bold: isHighlight,
        align: column.align || 'left', valign: 'middle',
        fontFace: FONTS.body,
      });
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.75, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme01TableV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Table');
  const headers = props.headers || [];
  const rows = (props.rows || []).slice(0, 6);
  if (rows.length === 0) {
    slide.addText('（暂无表格数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const colCount = Math.max(headers.length, rows[0]?.length || 1);
  const tableW = 8.4;
  const startX = 0.8;
  const startY = 2.5;
  const rowH = 0.45;
  const colW = tableW / colCount;

  // Header
  headers.forEach((header: any, index: any) => {
    const x = startX + index * colW;
    slide.addShape('rect', {
      x, y: startY, w: colW, h: rowH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(header, {
      x, y: startY, w: colW, h: rowH,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
  });

  // Rows
  rows.forEach((row: any, rowIndex: any) => {
    const y = startY + rowH * (rowIndex + 1);
    const bg = rowIndex % 2 === 0 ? COLORS.surface : COLORS.surfaceElevated;
    row.forEach((cell: any, colIndex: any) => {
      const x = startX + colIndex * colW;
      slide.addShape('rect', {
        x, y, w: colW, h: rowH,
        fill: { color: bg },
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(cell ?? '', {
        x: x + 0.06, y, w: colW - 0.12, h: rowH,
        fontSize: 11, color: props.highlightFirstColumn && colIndex === 0 ? COLORS.primary : COLORS.secondary,
        bold: props.highlightFirstColumn && colIndex === 0,
        align: colIndex === 0 ? 'left' : 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    });
  });
}

function renderTheme01TagsV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Tags');
  const tags = (props.tags || []).slice(0, 18);
  if (tags.length === 0) {
    slide.addText('（暂无标签）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const toneColors: Record<string, { text: string; bg: string }> = {
    positive: { text: '8FAE84', bg: '1E2A1E' },
    negative: { text: 'C76B5A', bg: '2A1C19' },
    accent: { text: COLORS.accent, bg: '2A1E18' },
  };

  let x = 0.8;
  let y = 2.5;
  const maxW = 8.4;
  const gap = 0.15;
  const tagH = 0.42;

  tags.forEach((tag: any) => {
    const label = tag.label ?? '';
    const valueText = tag.value !== undefined && tag.value > 0 ? ` ${tag.value}` : '';
    const text = `${label}${valueText}`;
    const textW = Math.min(Math.max(text.length * 0.09 + 0.3, 0.7), 2.2);
    const tone = toneColors[tag.tone ?? ''] ?? { text: COLORS.secondary, bg: COLORS.surfaceElevated };
    const color = tone.text;
    const bgColor = tone.bg;

    if (x + textW > 0.8 + maxW) {
      x = 0.8;
      y += tagH + gap;
    }

    slide.addShape('roundRect', {
      x, y, w: textW, h: tagH,
      fill: { color: bgColor },
      line: { color: tag.tone ? color : COLORS.border, width: 1 },
      rectRadius: 0.21,
    });
    slide.addText(text, {
      x, y, w: textW, h: tagH,
      fontSize: 11, color, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    x += textW + gap;
  });
}

function renderTheme01TeamV2(slide: PptxSlide, props: any): void {
  const members = (props.members || []).map((m: any) => ({ ...m, avatar: m.imageUrl }));
  renderTeamV2(slide, { kicker: props.kicker, title: props.title ?? '团队', members });
}

function renderTheme01TimelineV1(slide: PptxSlide, props: any): void {
  const milestones = props.events || [];
  renderTimelineV1(slide, { kicker: props.kicker, title: props.title ?? '时间轴', milestones });
}

function renderTheme01TrendV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '趋势');
  const series = (props.series || []).slice(0, 4);
  const allLabels = Array.from(
    new Set(series.flatMap((s: any) => (s.data || []).map((p: any) => p.label || '')))
  ).filter(Boolean);

  if (allLabels.length === 0 || series.length === 0) {
    slide.addText('（暂无趋势数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const chartData = series.map((s: any) => ({
    name: s.name || '系列',
    labels: allLabels,
    values: allLabels.map((label) => {
      const point = (s.data || []).find((p: any) => p.label === label);
      return typeof point?.value === 'number' ? point.value : 0;
    }),
  }));

  slide.addChart('line' as 'line', chartData, {
    x: 0.8, y: 2.3, w: 8.4, h: 3.2,
    chartColors: CHART_COLORS,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
}

function renderTimelineV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const milestones = (props.milestones || []).slice(0, 4);
  const count = milestones.length || 1;
  const stepWidth = 8.4 / count;
  milestones.forEach((m: any, index: any) => {
    const cx = 0.8 + stepWidth * index + stepWidth / 2;
    slide.addShape('ellipse', {
      x: cx - 0.2, y: 3.0, w: 0.4, h: 0.4,
      fill: { color: COLORS.accent },
    });
    slide.addShape('line', {
      x1: 0.8 + stepWidth * index, y1: 3.2, x2: 0.8 + stepWidth * (index + 1), y2: 3.2,
      line: { color: COLORS.border, width: 2 },
    });
    slide.addText(m.date || '', {
      x: cx - stepWidth / 2 + 0.1, y: 2.4, w: stepWidth - 0.2, h: 0.4,
      fontSize: 12, color: COLORS.accent, align: 'center', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(m.title || '', {
      x: cx - stepWidth / 2 + 0.1, y: 3.6, w: stepWidth - 0.2, h: 0.4,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(m.description || '', {
      x: cx - stepWidth / 2 + 0.1, y: 4.05, w: stepWidth - 0.2, h: 0.8,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

function renderTheme01ComponentsV1(slide: PptxSlide, props: any): void {
  addKicker(slide, props.kicker ?? 'DESIGN SYSTEM');
  addTitle(slide, props.title ?? '暖炭暗色编辑风');

  const swatches: Array<[string, string]> = [
    [COLORS.accent, '陶土'],
    [CHART_COLORS[0], '岩蓝'],
    [CHART_COLORS[1], '鼠尾草'],
    [CHART_COLORS[2], '黄铜'],
    [CHART_COLORS[3], '赤陶红'],
    [CHART_COLORS[4], '梅紫'],
    [CHART_COLORS[5], '陶玫瑰'],
    [CHART_COLORS[6], '青'],
    [CHART_COLORS[7], '焦橙'],
    [CHART_COLORS[8], '橄榄'],
  ];
  const chipW = 0.92;
  const chipH = 0.5;
  const gap = 0.12;
  const startX = 0.8;
  const startY = 2.5;
  swatches.forEach(([color, name], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = startX + col * (chipW + gap);
    const y = startY + row * (chipH + 0.42);
    slide.addShape('roundRect', {
      x, y, w: chipW, h: chipH,
      fill: { color },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    } as any);
    slide.addText(name, {
      x, y: y + chipH + 0.04, w: chipW, h: 0.32,
      fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
  });

  // 标签三型 + 样本柱图
  const labelY = 4.5;
  slide.addShape('roundRect', { x: 4.4, y: labelY, w: 0.8, h: 0.36, fill: { color: COLORS.accent }, line: { type: 'none' as any }, rectRadius: 0.18 } as any);
  slide.addText('01', { x: 4.4, y: labelY, w: 0.8, h: 0.36, fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono } as any);
  slide.addShape('roundRect', { x: 5.35, y: labelY, w: 0.9, h: 0.36, fill: { color: COLORS.surfaceElevated }, line: { color: COLORS.border, width: 1 }, rectRadius: 0.18 } as any);
  slide.addText('KEYWORD', { x: 5.35, y: labelY, w: 0.9, h: 0.36, fontSize: 10, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono } as any);

  const barData = [38, 64, 52, 80, 46, 70];
  const barW = 0.46;
  const bGap = 0.18;
  const baseY = 5.0;
  const bx0 = 4.4;
  barData.forEach((h, i) => {
    const x = bx0 + i * (barW + bGap);
    const hgt = (h / 100) * 0.9;
    slide.addShape('rect', {
      x, y: baseY - hgt, w: barW, h: hgt,
      fill: { color: i % 2 === 0 ? COLORS.accent : CHART_COLORS[0] },
      line: { type: 'none' as any },
      rectRadius: 0.06,
    } as any);
  });
}


// ────────────────────────────────────────────────────────────────
// 注册表（供 export-pptx 通过 registerTheme01Renderers 注入）
// ────────────────────────────────────────────────────────────────
const RENDERERS: Record<string, T01RenderFn> = {
  'theme01_appendix_v1': renderTheme01AppendixV1,
  'theme01_bento_v1': renderTheme01BentoV1,
  'theme01_case_study': renderTheme01CaseStudy,
  'theme01_chapter_v1': renderCoverV1,
  'theme01_chapter_v2': renderCoverV1,
  'theme01_chapter_v3': renderTheme01ChapterV3,
  'theme01_chart_bar3d': renderChartBar3d,
  'theme01_chart_donut': renderTheme01ChartDonut,
  'theme01_chart_funnel': renderChartFunnel,
  'theme01_chart_gauge': renderChartGauge,
  'theme01_chart_graph': renderChartGraph,
  'theme01_chart_heatmap': renderChartHeatmap,
  'theme01_chart_radar': renderChartRadar,
  'theme01_chart_sankey': renderChartSankey,
  'theme01_chart_sunburst': renderChartSunburst,
  'theme01_chart_treemap': renderChartTreemap,
  'theme01_chart_v1': renderChartV1,
  'theme01_chart_wordcloud': renderChartWordcloud,
  'theme01_closing_v2': renderClosing,
  'theme01_comparison_v1': renderComparisonV1,
  'theme01_comparison_v2': renderTheme01ComparisonV2,
  'theme01_comparison_v3': renderComparisonV3,
  'theme01_conclusion_v1': renderTheme01ConclusionV1,
  'theme01_content_v1': renderContentV1,
  'theme01_content_v2': renderContentV2,
  'theme01_content_v3': renderTheme01ContentV3,
  'theme01_content_v4': renderContentV1,
  'theme01_cover_v1': renderCoverV1,
  'theme01_cover_v2': renderCoverV1,
  'theme01_cover_v3': renderCoverV1,
  'theme01_cover_v4': renderCoverV1,
  'theme01_diptych_contrast': renderTheme01DiptychContrast,
  'theme01_faq_v1': renderFaqV1,
  'theme01_feature_v1': renderFeatureV1,
  'theme01_feature_v2': renderFeatureV2,
  'theme01_filmstrip_v1': renderTheme01FilmstripV1,
  'theme01_gallery_v1': renderTheme01GalleryV1,
  'theme01_gantt_v1': renderTheme01GanttV1,
  'theme01_image_v1': renderImageV1,
  'theme01_metric_big': renderTheme01MetricBig,
  'theme01_metric_triptych': renderTheme01MetricTriptych,
  'theme01_metric_v1': renderMetricV1,
  'theme01_metric_v2': renderTheme01MetricV2,
  'theme01_metric_v3': renderMetricV1,
  'theme01_outlook_v1': renderTheme01OutlookV1,
  'theme01_partners_v1': renderPartnersV1,
  'theme01_pest_v1': renderPestV1,
  'theme01_pricing_v1': renderPricingV1,
  'theme01_process_v1': renderProcessV1,
  'theme01_quadrant_v1': renderTheme01QuadrantV1,
  'theme01_quote_v1': renderQuoteV1,
  'theme01_quote_v2': renderQuoteV2,
  'theme01_quote_v3': renderQuoteV3,
  'theme01_ranking_v1': renderTheme01RankingV1,
  'theme01_region_v1': renderTheme01RegionV1,
  'theme01_risk_v1': renderTheme01RiskV1,
  'theme01_roadmap_v1': renderTheme01RoadmapV1,
  'theme01_scorecard_v1': renderTheme01ScorecardV1,
  'theme01_spotlight_grid': renderTheme01SpotlightGrid,
  'theme01_stats_v1': renderStatsV1,
  'theme01_swot_v1': renderSwotV1,
  'theme01_table_data': renderTheme01TableData,
  'theme01_table_of_contents_v1': renderTableOfContentsV1,
  'theme01_table_of_contents_v2': renderTableOfContentsV1,
  'theme01_table_v1': renderTheme01TableV1,
  'theme01_tags_v1': renderTheme01TagsV1,
  'theme01_team_v1': renderTeamV1,
  'theme01_team_v2': renderTheme01TeamV2,
  'theme01_testimonial_v1': renderTestimonialV1,
  'theme01_timeline_v1': renderTheme01TimelineV1,
  'theme01_trend_v1': renderTheme01TrendV1,
  'theme01_components_v1': renderTheme01ComponentsV1,
};

/** 将全部 theme01 渲染器注册到导出管线的按 layoutId 索引注册表（按版式注入双基底 COLORS）。 */
export function registerTheme01Renderers(register: (layoutId: string, fn: T01RenderFn) => void): void {
  for (const [id, fn] of Object.entries(RENDERERS)) {
    register(id, (s, p) => { COLORS = P(id); fn(s, p); });
  }
}
