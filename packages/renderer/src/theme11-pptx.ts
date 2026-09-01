// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme11 流光科技 · 浅色扁平科技风 — PPTX 版式渲染器。
// 采用「按角色通用渲染」策略：所有 theme11 版式共享同一渲染入口，
// 按布局 ID 与 props 字段自动分发封面/章节/内容/数据/图表/影像/结束页，
// 避免导出时落到 "Unknown layout" 占位。

import { type Slide as PptxSlide } from 'pptxgenjs';

type T11Mood = 'aurora' | 'daylight' | 'sunset';

interface T11Fonts {
  heading: string;
  body: string;
  mono: string;
}

interface T11State {
  appearance: 'primary' | 'muted';
  fonts: T11Fonts;
  chartColors: string[];
}

let S: T11State = {
  appearance: 'primary',
  fonts: { heading: 'Noto Sans SC', body: 'Noto Sans SC', mono: 'Space Mono' },
  chartColors: ['00BCD4', '7C4DFF', '2979FF', 'FF9100', '00C853', 'FF5252'],
};

/** 每次导出开始时由 export-pptx.ts 注入 appearance / 字体 / 图表色。 */
export function configureTheme11(state: T11State): void {
  S = state;
}

// ────────────────────────────────────────────────────────────────
// 情绪基底（PPTX 不支持复杂弥散渐变，取情绪主色作为页面底色）
// ────────────────────────────────────────────────────────────────
const MOOD_BG: Record<T11Mood, string> = {
  aurora: 'E0F7FA',
  daylight: 'F8FAFC',
  sunset: 'FFF8E1',
};

const PALETTE = {
  primary: {
    ink: '1A202C',
    ink2: '5A6578',
    ink3: '8B95A5',
    accent: '00BCD4',
    accent2: '7C4DFF',
    accent3: '2979FF',
    orange: 'FF9100',
    red: 'FF5252',
    green: '00C853',
    surface: 'FFFFFF',
    border: 'E2E8F0',
  },
  muted: {
    ink: '4A5568',
    ink2: '718096',
    ink3: 'A0AEC0',
    accent: '4DD0E1',
    accent2: '9575CD',
    accent3: '5C9CFF',
    orange: 'FFB74D',
    red: 'FF8A80',
    green: '69F0AE',
    surface: 'FFFFFF',
    border: 'E2E8F0',
  },
} as const;

function pal() {
  return PALETTE[S.appearance];
}

// ────────────────────────────────────────────────────────────────
// 小工具
// ────────────────────────────────────────────────────────────────
function applyBackground(slide: PptxSlide, mood: T11Mood): void {
  (slide as unknown as { background: { color: string } }).background = { color: MOOD_BG[mood] };
}

function fitText(text: unknown): string {
  if (text === undefined || text === null) return '';
  return String(text);
}

function parseValues(values: unknown): number[] {
  if (Array.isArray(values)) {
    return values
      .map((v) => (typeof v === 'number' ? v : Number.parseFloat(String(v).replace(/[, %]/g, ''))))
      .filter((v) => Number.isFinite(v));
  }
  if (typeof values === 'string' && values.length > 0) {
    return values
      .split(/[,，]/)
      .map((s) => Number.parseFloat(s.trim().replace(/[%\s]/g, '')))
      .filter((v) => Number.isFinite(v));
  }
  return [];
}

function normalizeCategories(cats: unknown): string[] {
  if (!cats) return [];
  if (Array.isArray(cats)) {
    return cats.map((c) => (typeof c === 'string' ? c : fitText((c as { text?: string }).text)));
  }
  return [];
}

function getToneColor(tone: string | undefined): string {
  const p = pal();
  switch (tone) {
    case 'violet':
    case 'purple':
      return p.accent2;
    case 'blue':
      return p.accent3;
    case 'orange':
      return p.orange;
    case 'green':
      return p.green;
    case 'red':
      return p.red;
    case 'accent':
    default:
      return p.accent;
  }
}

function getDefaultMood(layoutId: string): T11Mood {
  const id = layoutId.toLowerCase();
  if (id.includes('sunset') || id.includes('closing_cta') || id.includes('risk') || id.includes('pyramid')) return 'sunset';
  if (id.includes('aurora') || id.includes('cover') || id.includes('divider') || id.includes('statement')) return 'aurora';
  return 'daylight';
}

// ────────────────────────────────────────────────────────────────
// 基础排版元素
// ────────────────────────────────────────────────────────────────
function addEyebrow(slide: PptxSlide, text: string, y = 0.85): void {
  if (!text) return;
  slide.addText(text, {
    x: 0.6,
    y,
    w: 8.8,
    h: 0.35,
    fontSize: 12,
    fontFace: S.fonts.mono,
    color: pal().accent,
    bold: true,
    letterSpacing: 1,
    charSpacing: 1,
  } as any);
}

function addTitle(slide: PptxSlide, text: string, y = 1.25, opts?: { align?: 'left' | 'center' | 'right'; x?: number; w?: number; fontSize?: number }): void {
  if (!text) return;
  slide.addText(text, {
    x: opts?.x ?? 0.6,
    y,
    w: opts?.w ?? 8.8,
    h: 1.0,
    fontSize: opts?.fontSize ?? 36,
    fontFace: S.fonts.heading,
    color: pal().ink,
    bold: true,
    align: opts?.align ?? 'left',
  } as any);
}

function addSubtitle(slide: PptxSlide, text: string, y = 2.15, opts?: { align?: 'left' | 'center' | 'right'; x?: number; w?: number }): void {
  if (!text) return;
  slide.addText(text, {
    x: opts?.x ?? 0.6,
    y,
    w: opts?.w ?? 8.8,
    h: 0.7,
    fontSize: 18,
    fontFace: S.fonts.body,
    color: pal().ink2,
    align: opts?.align ?? 'left',
  } as any);
}

function addBody(slide: PptxSlide, text: string, y: number, h = 1.2): void {
  if (!text) return;
  slide.addText(text, {
    x: 0.6,
    y,
    w: 8.8,
    h,
    fontSize: 15,
    fontFace: S.fonts.body,
    color: pal().ink,
  } as any);
}

function addBulletList(slide: PptxSlide, items: unknown[], yStart: number, x = 0.6, w = 8.8): number {
  const p = pal();
  let y = yStart;
  const list = Array.isArray(items) ? items : [];
  list.forEach((item) => {
    const text = typeof item === 'string' ? item : fitText((item as { text?: string }).text);
    if (!text) return;
    slide.addText('●', { x, y, w: 0.25, h: 0.35, fontSize: 11, color: p.accent } as any);
    slide.addText(text, { x: x + 0.3, y, w: w - 0.3, h: 0.35, fontSize: 14, fontFace: S.fonts.body, color: p.ink } as any);
    y += 0.42;
  });
  return y;
}

function isImageSrc(url: string): boolean {
  return /^(https?:|data:|file:|\/|[A-Za-z]:\\)/.test(url) || /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(url);
}

function addImageFromProp(slide: PptxSlide, url: string | undefined, x: number, y: number, w: number, h: number): void {
  if (!url || !isImageSrc(url)) return;
  try {
    slide.addImage({ path: url, x, y, w, h, sizing: { type: 'crop', w, h } } as any);
  } catch {
    slide.addText('[图片]', { x, y, w, h, fontSize: 14, color: pal().ink2, align: 'center', valign: 'middle' } as any);
  }
}

// ────────────────────────────────────────────────────────────────
// 图表渲染（抽取常见字段，复杂图表降级为文本占位）
// ────────────────────────────────────────────────────────────────
function inferChartType(layoutId: string): string {
  if (layoutId.includes('hbar')) return 'bar';
  if (layoutId.includes('line')) return 'line';
  if (layoutId.includes('area')) return 'line';
  if (layoutId.includes('pie')) return 'pie';
  if (layoutId.includes('donut')) return 'doughnut';
  if (layoutId.includes('radar')) return 'radar';
  if (layoutId.includes('scatter')) return 'scatter';
  if (layoutId.includes('bubble')) return 'bubble';
  return 'bar';
}

function renderChart(slide: PptxSlide, props: Record<string, unknown>, layoutId: string): boolean {
  const p = props;
  const categories = normalizeCategories(p.categories ?? p.labels ?? p.xAxis);
  const values = parseValues(p.values ?? p.data ?? p.series);
  const title = fitText(p.title);
  const subtitle = fitText(p.subtitle);

  // 复杂/ unsupported 图表直接降级
  const unsupported =
    /treemap|sunburst|sankey|graph|network|parallel|funnel|gauge|candlestick|heatmap|bump|radian|waterfall|quadrant|matrix|venn|orgchart|gantt|calendar|small_multiples|swimlane/.test(
      layoutId,
    );

  let y = 1.35;
  if (title) {
    addTitle(slide, title, y);
    y += 0.85;
  }
  if (subtitle) {
    addSubtitle(slide, subtitle, y);
    y += 0.55;
  }

  if (unsupported || categories.length === 0 || values.length === 0) {
    slide.addShape('roundRect', {
      x: 0.8,
      y,
      w: 8.4,
      h: 3.6,
      fill: { color: pal().surface },
      line: { color: pal().border, width: 1 },
      rectRadius: 0.15,
    } as any);
    slide.addText('（图表数据将在导出后由编辑器渲染）', {
      x: 0.8,
      y,
      w: 8.4,
      h: 3.6,
      fontSize: 16,
      color: pal().ink2,
      align: 'center',
      valign: 'middle',
      fontFace: S.fonts.body,
    } as any);
    return true;
  }

  const type = inferChartType(layoutId);
  const chartColors =
    type === 'pie' || type === 'doughnut'
      ? categories.map((_, i) => S.chartColors[i % S.chartColors.length])
      : [S.chartColors[0]];
  const data = [{ name: title || '数据', labels: categories.slice(0, values.length), values }];

  slide.addChart(type as any, data, {
    x: 0.7,
    y,
    w: 8.6,
    h: 3.6,
    chartColors,
    showValue: true,
    dataLabelColor: pal().ink,
    dataLabelFontSize: 10,
  } as any);
  return true;
}

// ────────────────────────────────────────────────────────────────
// 数据表格
// ────────────────────────────────────────────────────────────────
function renderTable(slide: PptxSlide, props: Record<string, unknown>): boolean {
  const columns = (props.columns as unknown[]) || (props.headers as unknown[]) || [];
  const rows = (props.rows as unknown[][]) || (props.data as unknown[][]) || [];
  if (columns.length === 0 && rows.length === 0) return false;

  const headers = columns.map((c) => (typeof c === 'string' ? c : fitText((c as { title?: string; label?: string; text?: string }).title ?? (c as any).label ?? (c as any).text)));
  const body = rows.map((row) =>
    Array.isArray(row)
      ? row.map((cell) => (typeof cell === 'string' ? cell : fitText((cell as { text?: string; value?: string }).text ?? (cell as any).value)))
      : [],
  );

  if (headers.length === 0 && body.length === 0) return false;

  const tableData = [headers, ...body].filter((r) => r.length > 0);
  if (tableData.length === 0) return false;

  (slide as any).addTable(tableData as any, {
    x: 0.6,
    y: 2.3,
    w: 8.8,
    h: 3.2,
    fontSize: 12,
    fontFace: S.fonts.body,
    color: pal().ink,
    border: { type: 'solid', pt: 0.5, color: pal().border },
    fill: { color: pal().surface },
    colW: headers.map(() => 8.8 / Math.max(headers.length, 1)),
  } as any);
  return true;
}

// ────────────────────────────────────────────────────────────────
// 通用卡片/指标网格
// ────────────────────────────────────────────────────────────────
function renderItemCards(slide: PptxSlide, items: unknown[], yStart: number, columns = 4): number {
  const list = Array.isArray(items) ? items.slice(0, 6) : [];
  if (list.length === 0) return yStart;
  const p = pal();
  const colCount = Math.min(list.length, columns);
  const gap = 0.25;
  const cardW = (8.8 - gap * (colCount - 1)) / colCount;
  let y = yStart;
  list.forEach((item, i) => {
    const row = Math.floor(i / colCount);
    const col = i % colCount;
    const x = 0.6 + col * (cardW + gap);
    const cy = y + row * 1.45;
    const value = fitText((item as any).value ?? (item as any).metric ?? (item as any).number);
    const label = fitText((item as any).label ?? (item as any).title ?? (item as any).name);
    const change = fitText((item as any).change ?? (item as any).delta);
    const tone = fitText((item as any).tone);
    const color = getToneColor(tone || (i % 2 === 0 ? 'accent' : 'violet'));

    slide.addShape('roundRect', {
      x,
      y: cy,
      w: cardW,
      h: 1.25,
      fill: { color: p.surface },
      line: { color: p.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    if (value) {
      slide.addText(value, { x: x + 0.12, y: cy + 0.12, w: cardW - 0.24, h: 0.45, fontSize: 24, fontFace: S.fonts.heading, bold: true, color } as any);
    }
    if (change) {
      slide.addText(change, { x: x + cardW - 0.9, y: cy + 0.16, w: 0.78, h: 0.35, fontSize: 11, fontFace: S.fonts.mono, color: p.ink2, align: 'right' } as any);
    }
    if (label) {
      slide.addText(label, { x: x + 0.12, y: cy + 0.58, w: cardW - 0.24, h: 0.45, fontSize: 12, fontFace: S.fonts.body, color: p.ink2 } as any);
    }
  });
  return y + Math.ceil(list.length / colCount) * 1.45 + 0.2;
}

function renderFeatureCards(slide: PptxSlide, items: unknown[], yStart: number, columns = 3): number {
  const list = Array.isArray(items) ? items.slice(0, 6) : [];
  if (list.length === 0) return yStart;
  const p = pal();
  const colCount = Math.min(list.length, columns);
  const gap = 0.25;
  const cardW = (8.8 - gap * (colCount - 1)) / colCount;
  let y = yStart;
  list.forEach((item, i) => {
    const row = Math.floor(i / colCount);
    const col = i % colCount;
    const x = 0.6 + col * (cardW + gap);
    const cy = y + row * 1.65;
    const title = fitText((item as any).title ?? (item as any).label);
    const desc = fitText((item as any).desc ?? (item as any).description ?? (item as any).text);
    const icon = fitText((item as any).icon);
    const tone = fitText((item as any).tone);
    const color = getToneColor(tone || 'accent');

    slide.addShape('roundRect', {
      x,
      y: cy,
      w: cardW,
      h: 1.45,
      fill: { color: p.surface },
      line: { color: p.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    if (icon) {
      slide.addShape('roundRect', { x: x + 0.12, y: cy + 0.12, w: 0.38, h: 0.38, fill: { color: color }, rectRadius: 0.08 } as any);
      slide.addText(icon, { x: x + 0.12, y: cy + 0.12, w: 0.38, h: 0.38, fontSize: 14, color: 'FFFFFF', align: 'center', valign: 'middle' } as any);
    }
    if (title) {
      slide.addText(title, { x: x + 0.12, y: cy + 0.55, w: cardW - 0.24, h: 0.35, fontSize: 14, fontFace: S.fonts.heading, bold: true, color: p.ink } as any);
    }
    if (desc) {
      slide.addText(desc, { x: x + 0.12, y: cy + 0.9, w: cardW - 0.24, h: 0.45, fontSize: 10, fontFace: S.fonts.body, color: p.ink3 } as any);
    }
  });
  return y + Math.ceil(list.length / colCount) * 1.65 + 0.2;
}

function renderComparisonCards(slide: PptxSlide, props: Record<string, unknown>): void {
  const p = pal();
  const leftTitle = fitText(props.leftTitle ?? '方案 A');
  const rightTitle = fitText(props.rightTitle ?? '方案 B');
  const leftItems = (props.leftItems ?? props.leftPoints ?? []) as unknown[];
  const rightItems = (props.rightItems ?? props.rightPoints ?? []) as unknown[];

  slide.addShape('roundRect', { x: 0.6, y: 2.5, w: 4.1, h: 3.0, fill: { color: p.surface }, line: { color: p.border }, rectRadius: 0.12 } as any);
  slide.addShape('roundRect', { x: 5.3, y: 2.5, w: 4.1, h: 3.0, fill: { color: p.surface }, line: { color: p.border }, rectRadius: 0.12 } as any);

  slide.addText(leftTitle, { x: 0.8, y: 2.65, w: 3.7, h: 0.4, fontSize: 18, fontFace: S.fonts.heading, bold: true, color: p.accent } as any);
  slide.addText(rightTitle, { x: 5.5, y: 2.65, w: 3.7, h: 0.4, fontSize: 18, fontFace: S.fonts.heading, bold: true, color: p.accent2 } as any);

  addBulletList(slide, leftItems, 3.15, 0.85, 3.6);
  addBulletList(slide, rightItems, 3.15, 5.55, 3.6);
}

// ────────────────────────────────────────────────────────────────
// 影像/画廊
// ────────────────────────────────────────────────────────────────
function renderGallery(slide: PptxSlide, props: Record<string, unknown>): void {
  const images = (props.images ?? props.items ?? []) as unknown[];
  if (images.length === 0 && props.image) {
    addImageFromProp(slide, fitText(props.image), 0, 0, 10, 5.625);
    return;
  }
  const cols = Math.min(images.length, 3);
  const gap = 0.2;
  const imgW = (8.8 - gap * (cols - 1)) / cols;
  const imgH = 2.4;
  images.slice(0, 6).forEach((img, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const url = typeof img === 'string' ? img : fitText((img as { src?: string; image?: string; url?: string }).src ?? (img as any).image ?? (img as any).url);
    addImageFromProp(slide, url, 0.6 + col * (imgW + gap), 2.3 + row * (imgH + gap), imgW, imgH);
  });
}

function renderPhotoSplit(slide: PptxSlide, props: Record<string, unknown>): void {
  const image = fitText(props.image);
  if (image) {
    addImageFromProp(slide, image, 5.0, 0, 5.0, 5.625);
  }
  const p = pal();
  slide.addShape('rect', { x: 0, y: 0, w: 5.0, h: 5.625, fill: { color: p.surface } } as any);
  addTitle(slide, fitText(props.title), 1.8, { x: 0.6, w: 4.0, fontSize: 32 });
  addSubtitle(slide, fitText(props.subtitle), 2.7, { x: 0.6, w: 4.0 });
}

function renderTeam(slide: PptxSlide, props: Record<string, unknown>): void {
  const members = (props.members ?? props.items ?? []) as unknown[];
  renderMemberCards(slide, members, 2.4);
}

function renderMemberCards(slide: PptxSlide, members: unknown[], yStart: number): number {
  const list = Array.isArray(members) ? members.slice(0, 6) : [];
  if (list.length === 0) return yStart;
  const p = pal();
  const cols = Math.min(list.length, 4);
  const gap = 0.25;
  const cardW = (8.8 - gap * (cols - 1)) / cols;
  let y = yStart;
  list.forEach((m, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = 0.6 + col * (cardW + gap);
    const cy = y + row * 1.75;
    const name = fitText((m as any).name ?? (m as any).title);
    const role = fitText((m as any).role ?? (m as any).label);
    const avatar = fitText((m as any).avatar ?? (m as any).image);

    slide.addShape('roundRect', { x, y: cy, w: cardW, h: 1.55, fill: { color: p.surface }, line: { color: p.border }, rectRadius: 0.12 } as any);
    if (avatar) {
      addImageFromProp(slide, avatar, x + cardW / 2 - 0.32, cy + 0.12, 0.64, 0.64);
    } else {
      slide.addShape('ellipse', { x: x + cardW / 2 - 0.32, y: cy + 0.12, w: 0.64, h: 0.64, fill: { color: p.border } } as any);
    }
    if (name) slide.addText(name, { x, y: cy + 0.82, w: cardW, h: 0.35, fontSize: 13, fontFace: S.fonts.heading, bold: true, color: p.ink, align: 'center' } as any);
    if (role) slide.addText(role, { x, y: cy + 1.12, w: cardW, h: 0.3, fontSize: 10, fontFace: S.fonts.body, color: p.ink2, align: 'center' } as any);
  });
  return y + Math.ceil(list.length / cols) * 1.75 + 0.2;
}

// ────────────────────────────────────────────────────────────────
// 流程/时间线/步骤
// ────────────────────────────────────────────────────────────────
function renderTimeline(slide: PptxSlide, items: unknown[], yStart: number): number {
  const list = Array.isArray(items) ? items.slice(0, 6) : [];
  if (list.length === 0) return yStart;
  const p = pal();
  const gap = 8.8 / list.length;
  let y = yStart;
  list.forEach((item, i) => {
    const x = 0.6 + i * gap + gap / 2 - 0.2;
    const title = fitText((item as any).label ?? (item as any).title ?? (item as any).phase);
    const desc = fitText((item as any).desc ?? (item as any).description);
    const number = fitText((item as any).number ?? String(i + 1));
    slide.addShape('ellipse', { x, y, w: 0.4, h: 0.4, fill: { color: p.accent } } as any);
    slide.addText(number, { x, y, w: 0.4, h: 0.4, fontSize: 11, color: 'FFFFFF', align: 'center', valign: 'middle', bold: true } as any);
    if (i < list.length - 1) {
      slide.addShape('line', { x1: x + 0.4, y1: y + 0.2, x2: x + gap - 0.4, y2: y + 0.2, line: { color: p.border, width: 2 } } as any);
    }
    if (title) slide.addText(title, { x: x - 0.8, y: y + 0.55, w: 2.0, h: 0.35, fontSize: 12, fontFace: S.fonts.heading, bold: true, color: p.ink, align: 'center' } as any);
    if (desc) slide.addText(desc, { x: x - 0.8, y: y + 0.95, w: 2.0, h: 0.7, fontSize: 10, fontFace: S.fonts.body, color: p.ink2, align: 'center' } as any);
  });
  return y + 1.8;
}

function renderSteps(slide: PptxSlide, items: unknown[], yStart: number): number {
  const list = Array.isArray(items) ? items.slice(0, 5) : [];
  if (list.length === 0) return yStart;
  const p = pal();
  let y = yStart;
  list.forEach((item, i) => {
    const title = fitText((item as any).title ?? (item as any).label);
    const desc = fitText((item as any).desc ?? (item as any).description);
    slide.addShape('roundRect', { x: 0.6, y, w: 0.4, h: 0.4, fill: { color: p.accent }, rectRadius: 0.08 } as any);
    slide.addText(String(i + 1), { x: 0.6, y, w: 0.4, h: 0.4, fontSize: 14, color: 'FFFFFF', align: 'center', valign: 'middle', bold: true } as any);
    if (title) slide.addText(title, { x: 1.15, y, w: 8.2, h: 0.35, fontSize: 15, fontFace: S.fonts.heading, bold: true, color: p.ink } as any);
    if (desc) slide.addText(desc, { x: 1.15, y: y + 0.35, w: 8.2, h: 0.35, fontSize: 12, fontFace: S.fonts.body, color: p.ink2 } as any);
    y += 0.9;
  });
  return y;
}

// ────────────────────────────────────────────────────────────────
// 定价/方案
// ────────────────────────────────────────────────────────────────
function renderPricing(slide: PptxSlide, props: Record<string, unknown>): void {
  const plans = (props.plans ?? props.items ?? props.cards ?? []) as unknown[];
  const list = Array.isArray(plans) ? plans.slice(0, 3) : [];
  if (list.length === 0) return;
  const p = pal();
  const cols = list.length;
  const gap = 0.25;
  const cardW = (8.8 - gap * (cols - 1)) / cols;
  const y = 2.4;
  list.forEach((plan, i) => {
    const x = 0.6 + i * (cardW + gap);
    const name = fitText((plan as any).name ?? (plan as any).title);
    const price = fitText((plan as any).price ?? (plan as any).value);
    const features = ((plan as any).features ?? (plan as any).items ?? []) as unknown[];
    const active = !!(plan as any).active || !!(plan as any).highlight;
    slide.addShape('roundRect', {
      x,
      y,
      w: cardW,
      h: 3.2,
      fill: { color: active ? p.accent : p.surface },
      line: { color: active ? p.accent : p.border, width: 1.5 },
      rectRadius: 0.15,
    } as any);
    const textColor = active ? 'FFFFFF' : p.ink;
    if (name) slide.addText(name, { x, y: y + 0.2, w: cardW, h: 0.4, fontSize: 16, fontFace: S.fonts.heading, bold: true, color: textColor, align: 'center' } as any);
    if (price) slide.addText(price, { x, y: y + 0.65, w: cardW, h: 0.5, fontSize: 28, fontFace: S.fonts.heading, bold: true, color: active ? 'FFFFFF' : p.accent, align: 'center' } as any);
    features.slice(0, 4).forEach((f, idx) => {
      const text = typeof f === 'string' ? f : fitText((f as { text?: string }).text);
      slide.addText(text, { x: x + 0.15, y: y + 1.25 + idx * 0.35, w: cardW - 0.3, h: 0.32, fontSize: 11, fontFace: S.fonts.body, color: textColor, align: 'center' } as any);
    });
  });
}

// ────────────────────────────────────────────────────────────────
// FAQ / 检查清单 / 引用
// ────────────────────────────────────────────────────────────────
function renderFaq(slide: PptxSlide, props: Record<string, unknown>): void {
  const items = (props.items ?? props.qa ?? []) as unknown[];
  const p = pal();
  let y = 2.3;
  items.slice(0, 4).forEach((item) => {
    const q = fitText((item as any).question ?? (item as any).q ?? (item as any).title);
    const a = fitText((item as any).answer ?? (item as any).a ?? (item as any).desc);
    slide.addShape('roundRect', { x: 0.6, y, w: 8.8, h: 0.7, fill: { color: p.surface }, line: { color: p.border }, rectRadius: 0.1 } as any);
    slide.addText(q, { x: 0.8, y: y + 0.1, w: 8.4, h: 0.28, fontSize: 13, fontFace: S.fonts.heading, bold: true, color: p.ink } as any);
    slide.addText(a, { x: 0.8, y: y + 0.36, w: 8.4, h: 0.28, fontSize: 11, fontFace: S.fonts.body, color: p.ink2 } as any);
    y += 0.82;
  });
}

function renderQuote(slide: PptxSlide, props: Record<string, unknown>): void {
  const quote = fitText(props.quote ?? props.text ?? props.statement);
  const author = fitText(props.author ?? props.name ?? props.source);
  const p = pal();
  if (quote) {
    slide.addText('“', { x: 0.6, y: 1.9, w: 0.6, h: 0.6, fontSize: 48, fontFace: S.fonts.heading, color: p.accent } as any);
    slide.addText(quote, { x: 1.2, y: 2.1, w: 7.8, h: 1.6, fontSize: 24, fontFace: S.fonts.heading, color: p.ink, italic: true } as any);
  }
  if (author) {
    slide.addText(`— ${author}`, { x: 1.2, y: 3.8, w: 7.8, h: 0.4, fontSize: 14, fontFace: S.fonts.body, color: p.ink2 } as any);
  }
}

// ────────────────────────────────────────────────────────────────
// 主入口：按角色分发
// ────────────────────────────────────────────────────────────────
export function renderTheme11Slide(slide: PptxSlide, props: unknown, layoutId: string): void {
  const p = props as Record<string, unknown>;
  const mood: T11Mood = (p.mood as T11Mood) || getDefaultMood(layoutId);
  applyBackground(slide, mood);

  const id = layoutId.toLowerCase();
  const title = fitText(p.title);
  const subtitle = fitText(p.subtitle);
  const eyebrow = fitText(p.eyebrow ?? p.tagline ?? p.kicker ?? p.label);

  // 封面
  if (id.includes('cover')) {
    if (p.image) {
      addImageFromProp(slide, fitText(p.image), 0, 0, 10, 5.625);
      slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: 'FFFFFF', transparency: 70 } } as any);
    }
    if (eyebrow) addEyebrow(slide, eyebrow, 1.3);
    addTitle(slide, title, 1.8, { align: 'center', x: 0.6, w: 8.8, fontSize: 44 });
    addSubtitle(slide, subtitle, 2.9, { align: 'center', x: 1, w: 8 });
    if (p.date) {
      slide.addText(fitText(p.date), { x: 0.6, y: 4.9, w: 8.8, h: 0.3, fontSize: 12, fontFace: S.fonts.mono, color: pal().ink3, align: 'center' } as any);
    }
    return;
  }

  // 章节 / 分隔 / 金句 / 过渡
  if (id.includes('chapter') || id.includes('divider') || id.includes('statement') || id.includes('transition')) {
    if (eyebrow) addEyebrow(slide, eyebrow, 1.8);
    if (p.number || p.keyword) {
      slide.addText(fitText(p.number ?? p.keyword), {
        x: 0.6,
        y: 2.0,
        w: 8.8,
        h: 1.0,
        fontSize: 72,
        fontFace: S.fonts.heading,
        bold: true,
        color: pal().accent,
        align: 'center',
      } as any);
      addTitle(slide, title, 3.1, { align: 'center', x: 0.6, w: 8.8, fontSize: 32 });
    } else {
      addTitle(slide, title, 2.4, { align: 'center', x: 0.6, w: 8.8, fontSize: 40 });
    }
    addSubtitle(slide, subtitle, 3.4, { align: 'center', x: 1, w: 8 });
    if (p.image) {
      addImageFromProp(slide, fitText(p.image), 2, 3.8, 6, 1.4);
    }
    return;
  }

  // 结束页
  if (id.includes('closing') || id.includes('back_cover')) {
    addTitle(slide, title, 1.8, { align: 'center', x: 0.6, w: 8.8, fontSize: 42 });
    addSubtitle(slide, subtitle, 2.8, { align: 'center', x: 1, w: 8 });
    if (p.cta) {
      slide.addShape('roundRect', { x: 3.5, y: 3.6, w: 3, h: 0.6, fill: { color: pal().accent }, rectRadius: 0.3 } as any);
      slide.addText(fitText(p.cta), { x: 3.5, y: 3.6, w: 3, h: 0.6, fontSize: 16, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle' } as any);
    }
    const contacts = [p.contact, p.email, p.link, p.phone, p.website].filter(Boolean).map(fitText);
    let cy = 4.5;
    contacts.forEach((c) => {
      slide.addText(c, { x: 0.6, y: cy, w: 8.8, h: 0.3, fontSize: 13, fontFace: S.fonts.mono, color: pal().accent2, align: 'center' } as any);
      cy += 0.38;
    });
    return;
  }

  // 通用头部
  let cursorY = 1.25;
  if (eyebrow) {
    addEyebrow(slide, eyebrow, cursorY);
    cursorY += 0.45;
  }
  if (title) {
    addTitle(slide, title, cursorY);
    cursorY += 0.9;
  }
  if (subtitle) {
    addSubtitle(slide, subtitle, cursorY);
    cursorY += 0.6;
  }

  // 图表
  if (id.includes('chart') || id.includes('quadrant') || id.includes('matrix')) {
    renderChart(slide, p, layoutId);
    return;
  }

  // 表格
  if (id.includes('table')) {
    renderTable(slide, p);
    return;
  }

  // 影像与分屏
  if (id.includes('photo_split')) {
    renderPhotoSplit(slide, p);
    return;
  }
  if (id.includes('photo_feature') && p.image) {
    addImageFromProp(slide, fitText(p.image), 0, 0, 10, 5.625);
    slide.addShape('rect', { x: 0, y: 4.0, w: 10, h: 1.625, fill: { color: 'FFFFFF', transparency: 80 } } as any);
    addTitle(slide, title, 4.15, { x: 0.6, w: 8.8, fontSize: 28 });
    return;
  }

  // 画廊
  if (id.includes('gallery') || id.includes('showcase')) {
    renderGallery(slide, p);
    return;
  }

  // 团队
  if (id.includes('team')) {
    renderTeam(slide, p);
    return;
  }

  // 引用/证言
  if (id.includes('quote') || id.includes('testimonial')) {
    if (id.includes('portrait') && p.image) {
      addImageFromProp(slide, fitText(p.image), 0.6, 2.2, 2.5, 2.5);
      renderQuote(slide, { ...p, quote: p.quote ?? p.text });
    } else {
      renderQuote(slide, p);
    }
    return;
  }

  // 定价/方案
  if (id.includes('pricing') || id.includes('plans')) {
    renderPricing(slide, p);
    return;
  }

  // 对比
  if (id.includes('comparison') || id.includes('swot') || id.includes('pest')) {
    renderComparisonCards(slide, p);
    return;
  }

  // FAQ
  if (id.includes('faq')) {
    renderFaq(slide, p);
    return;
  }

  // 检查清单
  if (id.includes('checklist')) {
    const items = (p.items ?? p.checklist ?? []) as unknown[];
    addBulletList(slide, items, cursorY);
    return;
  }

  // 时间线/路线图/流程/步骤
  if (id.includes('timeline') || id.includes('roadmap')) {
    renderTimeline(slide, (p.items ?? p.chapters ?? p.milestones ?? []) as unknown[], cursorY + 0.2);
    return;
  }
  if (id.includes('process') || id.includes('steps') || id.includes('cycle')) {
    renderSteps(slide, (p.items ?? p.steps ?? p.phases ?? []) as unknown[], cursorY + 0.2);
    return;
  }

  // 指标/数据
  if (id.includes('metric') || id.includes('stats') || id.includes('kpi') || id.includes('scorecard') || id.includes('index_board') || id.includes('progress') || id.includes('ranking') || id.includes('hero_number') || id.includes('big_number')) {
    if (p.value || p.number || p.metric) {
      slide.addText(fitText(p.value ?? p.number ?? p.metric), {
        x: 0.6,
        y: cursorY,
        w: 8.8,
        h: 1.0,
        fontSize: 56,
        fontFace: S.fonts.heading,
        bold: true,
        color: pal().accent,
      } as any);
      cursorY += 1.0;
    }
    renderItemCards(slide, (p.items ?? p.metrics ?? p.data ?? []) as unknown[], cursorY + 0.2, 4);
    return;
  }

  // 特性卡片
  if (id.includes('feature') || id.includes('card') || id.includes('principles') || id.includes('glossary') || id.includes('case') || id.includes('editorial')) {
    renderFeatureCards(slide, (p.items ?? p.cards ?? p.features ?? p.terms ?? p.points ?? []) as unknown[], cursorY + 0.2, 3);
    return;
  }

  // 目录
  if (id.includes('contents') || id.includes('toc')) {
    const items = (p.items ?? p.sections ?? p.chapters ?? []) as unknown[];
    addBulletList(slide, items, cursorY);
    return;
  }

  // 通用内容兜底：body / bullets / image
  if (p.body) {
    addBody(slide, fitText(p.body), cursorY);
  } else if (p.points || p.items || p.bullets) {
    addBulletList(slide, ((p.points ?? p.items ?? p.bullets) as unknown[]), cursorY);
  } else if (p.image) {
    addImageFromProp(slide, fitText(p.image), 2.5, cursorY, 5, 2.8);
  } else if (!title && !subtitle) {
    slide.addText(`Theme 11 · ${layoutId}`, { x: 0.6, y: 2.5, w: 8.8, h: 0.5, fontSize: 14, color: pal().ink2, align: 'center' } as any);
  }
}

// ────────────────────────────────────────────────────────────────
// 注册全部 theme11 版式
// ────────────────────────────────────────────────────────────────
const THEME11_LAYOUTS = [
  'theme11_back_cover_v1',
  'theme11_bento_v1',
  'theme11_big_number_v1',
  'theme11_calendar_v1',
  'theme11_case_study_v1',
  'theme11_case_v1',
  'theme11_chapter_cards_v1',
  'theme11_chapter_hero_v1',
  'theme11_chapter_numbered_v1',
  'theme11_chapter_split_v1',
  'theme11_chapter_timeline_v1',
  'theme11_chapter_v1',
  'theme11_chart_area_v1',
  'theme11_chart_bar_v1',
  'theme11_chart_bubble_v1',
  'theme11_chart_bump_v1',
  'theme11_chart_candlestick_v1',
  'theme11_chart_donut_v1',
  'theme11_chart_funnel_v1',
  'theme11_chart_gauge_v1',
  'theme11_chart_graph_v1',
  'theme11_chart_grouped_v1',
  'theme11_chart_hbar_v1',
  'theme11_chart_heatmap_v1',
  'theme11_chart_line_v1',
  'theme11_chart_parallel_v1',
  'theme11_chart_pie_v1',
  'theme11_chart_radar_v1',
  'theme11_chart_radian_v1',
  'theme11_chart_sankey_v1',
  'theme11_chart_scatter_v1',
  'theme11_chart_stack_v1',
  'theme11_chart_sunburst_v1',
  'theme11_chart_treemap_v1',
  'theme11_chart_waterfall_v1',
  'theme11_checklist_v1',
  'theme11_closing_contact_v1',
  'theme11_closing_cta_v1',
  'theme11_closing_minimal_v1',
  'theme11_closing_quote_v1',
  'theme11_closing_social_v1',
  'theme11_closing_split_v1',
  'theme11_closing_v1',
  'theme11_comparison_cards_v1',
  'theme11_comparison_v1',
  'theme11_components_showcase_v1',
  'theme11_contents_v1',
  'theme11_cover_aurora_v1',
  'theme11_cover_daylight_v1',
  'theme11_cover_product_v1',
  'theme11_cover_split_v1',
  'theme11_cover_sunset_v1',
  'theme11_cycle_v1',
  'theme11_divider_v1',
  'theme11_editorial_v1',
  'theme11_faq_v1',
  'theme11_feature_cards_v1',
  'theme11_feature_grid_v1',
  'theme11_feature_v1',
  'theme11_gallery_v1',
  'theme11_gallery_wall_v1',
  'theme11_gantt_v1',
  'theme11_glossary_v1',
  'theme11_hero_number_v1',
  'theme11_index_board_v1',
  'theme11_kpi_strip_v1',
  'theme11_matrix_v1',
  'theme11_metric_big_v1',
  'theme11_metrics_v1',
  'theme11_network_v1',
  'theme11_orgchart_v1',
  'theme11_partners_v1',
  'theme11_pest_v1',
  'theme11_photo_feature_v1',
  'theme11_photo_split_v1',
  'theme11_plans_v1',
  'theme11_pricing_v1',
  'theme11_principles_v1',
  'theme11_process_v1',
  'theme11_progress_v1',
  'theme11_pyramid_v1',
  'theme11_quadrant_v1',
  'theme11_quote_portrait_v1',
  'theme11_quote_v1',
  'theme11_ranking_v1',
  'theme11_risk_v1',
  'theme11_roadmap_v1',
  'theme11_scorecard_v1',
  'theme11_showcase_v1',
  'theme11_small_multiples_v1',
  'theme11_stat_strip_v1',
  'theme11_statement_v1',
  'theme11_steps_v1',
  'theme11_summary_v1',
  'theme11_swimlane_v1',
  'theme11_swot_v1',
  'theme11_table_data_v1',
  'theme11_table_of_contents_v1',
  'theme11_table_v1',
  'theme11_team_v1',
  'theme11_testimonial_v1',
  'theme11_timeline_v1',
  'theme11_transition_image_v1',
  'theme11_transition_minimal_v1',
  'theme11_trend_v1',
  'theme11_venn_v1',
];

const THEME11_RENDERERS: Record<string, (slide: PptxSlide, props: unknown) => void> =
  Object.fromEntries(
    THEME11_LAYOUTS.map((id) => [id, (slide: PptxSlide, props: unknown) => renderTheme11Slide(slide, props, id)]),
  );

const RENDERERS = {
  ...THEME11_RENDERERS,
};

export function registerTheme11Renderers(
  register: (layoutId: string, fn: (slide: PptxSlide, props: unknown) => void) => void,
): void {
  for (const [id, fn] of Object.entries(RENDERERS)) {
    register(id, fn);
  }
}
