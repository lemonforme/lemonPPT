// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme10 金色指数 · 金融编辑风 — PPTX 版式专属渲染器。
// 解决 theme10 在 PPTX 导出中落到 "Unknown layout" 占位的问题。
//
// 设计要点：
//  - 单一深色基底（墨黑金线底），但按 mood（aurora / obsidian / ember）给三档背景色，
//    翻页形成金融终端的明暗呼吸（与 Web 端三情绪渐变同源，PPTX 不支持渐变故取渐变首色）。
//  - 强调色系统：冰蓝主 #4A7FD4 + 香槟金 #D9B977 / 铜 #C97A52 点睛，
//    全部经 WCAG 预校验，未复制 Dashi theme10 实现。
//  - appearance（primary / muted）仅调强调色浓度，不翻转明暗。

import { type Slide as PptxSlide } from 'pptxgenjs';

type T10Mood = 'aurora' | 'obsidian' | 'ember';

interface T10Fonts {
  heading: string;
  body: string;
  mono: string;
}
interface T10State {
  appearance: 'primary' | 'muted';
  fonts: T10Fonts;
  chartColors: string[];
}

interface T10Pal {
  mood: T10Mood;
  bg: string;
  ink: string;
  ink2: string;
  ink3: string;
  surface: string;
  surfaceElevated: string;
  border: string;
  borderStrong: string;
  accent: string;
  accent2: string;
  gold: string;
  goldAmber: string;
  copper: string;
  violet: string;
  red: string;
  green: string;
}

let S: T10State = {
  appearance: 'primary',
  fonts: { heading: 'Noto Sans SC', body: 'Noto Sans SC', mono: 'Space Mono' },
  chartColors: ['4A7FD4', 'D9B977', 'E8A23A', 'C97A52', '9A82DC', '6F9BD8'],
};

/** 每次导出开始时由 export-pptx.ts 注入 appearance / 字体 / 图表色。 */
export function configureTheme10(state: T10State): void {
  S = state;
}

// ────────────────────────────────────────────────────────────────
// 三情绪基底背景（取 Web 端渐变首色，PPTX 不支持渐变故固化）
// ────────────────────────────────────────────────────────────────
const MOOD_BG: Record<T10Mood, Omit<T10Pal, 'mood' | 'accent' | 'accent2' | 'gold' | 'goldAmber' | 'copper' | 'violet' | 'red' | 'green'>> = {
  aurora: {
    bg: '0A0E14', ink: 'EEF1F6', ink2: 'A9B2C0', ink3: '6E7889',
    surface: '121823', surfaceElevated: '1A2230', border: '2A3340', borderStrong: '3D4A5C',
  },
  obsidian: {
    bg: '05070B', ink: 'EEF1F6', ink2: 'A9B2C0', ink3: '6E7889',
    surface: '0E141E', surfaceElevated: '16202C', border: '1F2733', borderStrong: '33404F',
  },
  ember: {
    bg: '171320', ink: 'F3EDE6', ink2: 'C9B6AE', ink3: '8A7A82',
    surface: '211A2B', surfaceElevated: '2E2438', border: '3A2F44', borderStrong: '4E3F5C',
  },
};

const SPOT = {
  primary: {
    accent: '4A7FD4', accent2: '6F9BD8', gold: 'D9B977', goldAmber: 'E8A23A',
    copper: 'C97A52', violet: '9A82DC', red: 'E0615A', green: '5FB89A',
  },
  muted: {
    accent: '7CA0DE', accent2: '94B4E2', gold: 'C9AE83', goldAmber: 'D4943C',
    copper: 'B97A5C', violet: 'AE9AE0', red: 'E07E78', green: '84C2AC',
  },
} as const;

/** 版式 → 默认 mood（与 Web 端组件默认情绪一致；props.mood 优先）。 */
const SUBSTRATE: Record<string, T10Mood> = {
  theme10_cover_dusk_v1: 'aurora',
  theme10_cover_field_v1: 'aurora',
  theme10_cover_atmos_v1: 'obsidian',
  theme10_cover_horizon_v1: 'ember',
  theme10_cover_standard_v1: 'aurora',
  theme10_cover_dawn_v1: 'ember',
  theme10_chapter_v1: 'obsidian',
  theme10_divider_v1: 'ember',
  theme10_statement_section_v1: 'obsidian',
  theme10_statement_v1: 'ember',
  theme10_principles_v1: 'obsidian',
  theme10_closing_v1: 'aurora',
  // P1 影像图文 批次A
  theme10_profile_v1: 'obsidian',
  theme10_team_v1: 'ember',
  theme10_quote_v1: 'obsidian',
  theme10_editorial_v1: 'ember',
  theme10_magazine_v1: 'obsidian',
  // P1 影像图文 批次B
  theme10_triptych_v1: 'ember',
  theme10_strata_v1: 'obsidian',
  theme10_spark_v1: 'obsidian',
  theme10_testimonials_v1: 'ember',
  theme10_feature_v1: 'obsidian',
  // P1 影像图文 批次C
  theme10_compareimg_v1: 'ember',
  theme10_pinboard_v1: 'obsidian',
  theme10_filmstrip_v1: 'obsidian',
  theme10_inset_v1: 'aurora',
  theme10_gallery2_v1: 'ember',
  // P1 影像图文 批次D
  theme10_mosaic_v1: 'aurora',
  theme10_collage_v1: 'ember',
  theme10_captioned_v1: 'obsidian',
  theme10_showcase_v1: 'aurora',
  theme10_poster_v1: 'ember',
  // P1 影像图文 批次E
  theme10_annotated_v1: 'aurora',
  theme10_quoteimg_v1: 'ember',
  theme10_quilt_v1: 'obsidian',
  theme10_exhibit_v1: 'aurora',
  theme10_medallions_v1: 'ember',
  // P2 数据图表 批次F（基础图表 5 版式）
  theme10_bar_v1: 'aurora',
  theme10_hbar_v1: 'aurora',
  theme10_line_v1: 'obsidian',
  theme10_area_v1: 'aurora',
  theme10_kpis_v1: 'ember',
  // P2 数据图表 批次G（对比与构成 5 版式）
  theme10_grouped_v1: 'aurora',
  theme10_stack_v1: 'aurora',
  theme10_donut_v1: 'ember',
  theme10_pie_v1: 'ember',
  theme10_waterfall_v1: 'obsidian',
  // P2 数据图表 批次H（分布与关系 5 版式）
  theme10_scatter_v1: 'obsidian',
  theme10_bubble_v1: 'aurora',
  theme10_radar_v1: 'obsidian',
  theme10_radial_v1: 'ember',
  theme10_heat_v1: 'aurora',
  // P2 数据图表 批次I（趋势与时间 5 版式）
  theme10_trend_v1: 'aurora',
  theme10_range_v1: 'aurora',
  theme10_candlestick_v1: 'obsidian',
  theme10_ridgeline_v1: 'aurora',
  theme10_calendar_v1: 'ember',
  // P2 数据图表 批次J（分布与构成进阶 5 版式）
  theme10_funnel_v1: 'aurora',
  theme10_gauge_v1: 'ember',
  theme10_bullet_v1: 'aurora',
  theme10_box_v1: 'obsidian',
  theme10_treemap_v1: 'aurora',
  // P2 数据图表 批次K（关系与构成进阶 5 版式）
  theme10_sankey_v1: 'aurora',
  theme10_dumbbell_v1: 'obsidian',
  theme10_histogram_v1: 'aurora',
  theme10_slope_v1: 'aurora',
  theme10_waffle_v1: 'ember',
  // P2 数据图表 批次L（时序与分布 5 版式）
  theme10_gantt_v1: 'aurora',
  theme10_bump_v1: 'obsidian',
  theme10_rose_v1: 'aurora',
  theme10_dotplot_v1: 'obsidian',
  theme10_timeline_v1: 'ember',
  // P2 数据图表 批次M（结构与关系 5 版式）
  theme10_orgchart_v1: 'aurora',
  theme10_parallel_v1: 'obsidian',
  theme10_circlepack_v1: 'aurora',
  theme10_cscatter_v1: 'obsidian',
  theme10_marimekko_v1: 'ember',
  // P3 结构 / 流程 / 长尾（11 版式）
  theme10_steps_v1: 'obsidian',
  theme10_cycle_v1: 'obsidian',
  theme10_swimlane_v1: 'ember',
  theme10_checklist_v1: 'obsidian',
  theme10_plans_v1: 'ember',
  theme10_journey_v1: 'ember',
  theme10_goals_v1: 'ember',
  theme10_glossary_v1: 'obsidian',
  theme10_faq_v1: 'ember',
  theme10_isotype_v1: 'obsidian',
  theme10_venn_v1: 'ember',
};

function P(layoutId: string, p: any): T10Pal {
  const mood: T10Mood = (p && p.mood) || SUBSTRATE[layoutId] || 'obsidian';
  const base = MOOD_BG[mood];
  const spot = SPOT[S.appearance];
  return { mood, ...base, ...spot };
}

function series(pal: T10Pal): string[] {
  return [pal.accent, pal.gold, pal.goldAmber, pal.copper, pal.violet, pal.accent2];
}

// ────────────────────────────────────────────────────────────────
// P2 图表辅助（手绘 SVG 图表的 PPTX 等价渲染）
// ────────────────────────────────────────────────────────────────
function t10Fmt(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(a >= 1e10 ? 0 : 1) + 'B';
  if (a >= 1e6) return (n / 1e6).toFixed(a >= 1e7 ? 0 : 1) + 'M';
  if (a >= 1e3) return (n / 1e3).toFixed(a >= 1e4 ? 0 : 1) + 'k';
  return String(Math.round(n * 100) / 100);
}
function t10Nice(min: number, max: number, ticks = 4): { min: number; max: number; step: number; ticks: number[] } {
  if (!isFinite(min) || !isFinite(max)) return { min: 0, max: 1, step: 1, ticks: [0, 1] };
  if (min === max) max = min + 1;
  const lo = Math.min(min, 0), hi = Math.max(max, 0);
  const range = hi - lo, raw = range / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  const norm = raw / mag;
  let nn: number;
  if (norm <= 1) nn = 1; else if (norm <= 2) nn = 2; else if (norm <= 2.5) nn = 2.5; else if (norm <= 5) nn = 5; else nn = 10;
  const step = nn * mag;
  const nmin = Math.floor(lo / step) * step, nmax = Math.ceil(hi / step) * step;
  const arr: number[] = [];
  for (let v = nmin; v <= nmax + step * 1e-6; v += step) arr.push(Number(v.toFixed(6)));
  return { min: nmin, max: nmax, step, ticks: arr };
}
/** 横向网格线 + 左轴刻度标签（值越大越靠上） */
function t10Grid(slide: PptxSlide, pal: T10Pal, x0: number, x1: number, yTop: number, yBot: number, sc: { min: number; max: number; ticks: number[] }): void {
  for (const t of sc.ticks) {
    const y = yBot - (t - sc.min) / (sc.max - sc.min || 1) * (yBot - yTop);
    const zero = Math.abs(t) < 1e-9;
    slide.addShape('line', { x: x0, y, w: x1 - x0, h: 0, line: { color: zero ? pal.borderStrong : pal.border, width: zero ? 1 : 0.75 } });
    txt(slide, t10Fmt(t), { x: x0 - 0.05, y: y - 0.12, w: 0.82, h: 0.24, fontSize: 9, color: pal.ink3, align: 'right', fontFace: S.fonts.mono });
  }
}
/** 折线线段（含上行翻转） */
function t10Seg(slide: PptxSlide, x1: number, y1: number, x2: number, y2: number, color: string, width: number): void {
  const top = Math.min(y1, y2), bot = Math.max(y1, y2);
  slide.addShape('line', { x: x1, y: top, w: Math.abs(x2 - x1), h: bot - top, line: { color, width }, flipV: y2 < y1 } as any);
}
function t10Legend(slide: PptxSlide, pal: T10Pal, items: { name: string; color: string }[], x: number, y: number): void {
  let cx = x;
  for (const it of items) {
    slide.addShape('rect', { x: cx, y: y + 0.02, w: 0.16, h: 0.16, fill: { color: it.color } });
    txt(slide, it.name, { x: cx + 0.22, y: y - 0.05, w: 1.5, h: 0.26, fontSize: 10, color: pal.ink2, fontFace: S.fonts.body });
    cx += 0.22 + Math.min(String(it.name).length * 0.08 + 0.5, 1.7) + 0.28;
  }
}
function t10NormCats(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? ''))).filter(Boolean);
}
function t10ParseVals(s?: string): number[] {
  if (!s) return [];
  return s.split(',').map((x) => Number(x.trim())).filter((n) => isFinite(n));
}
function t10ParseXY(s?: string): [number, number][] {
  if (!s) return [];
  return s.split(/[\s;]+/).map((p) => p.split(',').map(Number)).filter((q) => q.length >= 2 && isFinite(q[0]) && isFinite(q[1])) as [number, number][];
}
function t10ParseXYS(s?: string): [number, number, number][] {
  if (!s) return [];
  return s.split(/[\s;]+/).map((p) => p.split(',').map(Number)).filter((q) => q.length >= 3 && q.every((n: number) => isFinite(n))) as [number, number, number][];
}
/** 两个 hex 之间线性插值（热力顺色阶） */
function t10MixHex(a: string, b: string, t: number): string {
  const pa = t10Hex(a), pb = t10Hex(b);
  if (!pa || !pb) return a;
  const k = Math.max(0, Math.min(1, t));
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * k);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * k);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * k);
  return '#' + [r, g, bl].map((x) => x.toString(16).padStart(2, '0')).join('');
}
function t10Hex(h: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(h).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function t10Lum(hex: string): number {
  const c = t10Hex(hex);
  if (!c) return 0.5;
  return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
}

// ────────────────────────────────────────────────────────────────
// 画布常量（16:9，10 × 5.625 英寸）
// ────────────────────────────────────────────────────────────────
const MX = 0.7;
const CW = 10 - MX * 2;
const TOP = 0.62;
const BOT = 5.18;

function lines(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v)) return v.map(String);
  return String(v).split(/\r?\n/).filter((s) => s.length > 0);
}

/** 归一化数组字段（编辑器可能存成 {item} 对象数组或纯字符串数组）。 */
function normStrings(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((t) => (typeof t === 'string' ? t : ((t as { item?: string })?.item ?? '')))
    .filter(Boolean);
}

/** 行情带单项 → mono 串（▲ 涨金 / ▼ 跌铜）。 */
function tickStr(t: unknown): string {
  if (t == null) return '';
  if (typeof t === 'string') return t;
  const o = t as { code?: string; value?: string; delta?: number };
  const code = o.code ?? '';
  const val = o.value ?? '';
  const d = o.delta == null ? '' : ` ${o.delta >= 0 ? '▲' : '▼'}${Math.abs(o.delta).toFixed(2)}%`;
  return [code, val, d].filter(Boolean).join(' ');
}
function tickLine(v: unknown): string {
  if (!Array.isArray(v)) return '';
  return v.map(tickStr).filter(Boolean).join('      ');
}

function txt(slide: PptxSlide, text: unknown, o: Record<string, unknown>): void {
  if (text == null || text === '') return;
  if (Array.isArray(text)) {
    if (text.length === 0) return;
    text = text.map(String).join('\n');
  }
  slide.addText(text as any, o as any);
}

function frame(slide: PptxSlide, pal: T10Pal, opts: { bottom?: boolean } = {}): void {
  (slide as any).background = { color: pal.bg };
  slide.addShape('line', { x: MX, y: TOP, w: CW, h: 0, line: { color: pal.border, width: 0.75 } });
  if (opts.bottom !== false) {
    slide.addShape('line', { x: MX, y: BOT, w: CW, h: 0, line: { color: pal.border, width: 0.75 } });
  }
}

function kicker(slide: PptxSlide, text: unknown, pal: T10Pal, o: Record<string, unknown> = {}): void {
  txt(slide, text, {
    x: o.x ?? MX, y: o.y ?? 0.74, w: o.w ?? CW, h: 0.3,
    fontSize: o.size ?? 12, color: pal.gold, align: 'left',
    fontFace: S.fonts.mono, charSpacing: 2, bold: true,
  } as any);
}

function title(slide: PptxSlide, text: unknown, pal: T10Pal, o: Record<string, unknown> = {}): void {
  const ls = lines(text);
  const size = (o.size as number) ?? 40;
  const h = (o.h as number) ?? ls.length * (size / 72) * 1.18 + 0.15;
  slide.addText(ls.join('\n') as any, {
    x: o.x ?? MX, y: o.y ?? 1.0, w: o.w ?? CW, h,
    fontSize: size, color: (o.color as string) ?? pal.ink, align: (o.align as any) ?? 'left',
    fontFace: S.fonts.heading, bold: true, valign: (o.valign as any) ?? 'top',
    lineSpacingMultiple: 1.05, rotate: o.rotate as any, italic: o.italic as any,
  } as any);
}

function footer(slide: PptxSlide, left: unknown, right: unknown, pal: T10Pal): void {
  txt(slide, left, { x: MX, y: BOT + 0.04, w: CW / 2, h: 0.3, fontSize: 9, color: pal.ink3, align: 'left', fontFace: S.fonts.mono });
  txt(slide, right, { x: MX + CW / 2, y: BOT + 0.04, w: CW / 2, h: 0.3, fontSize: 9, color: pal.ink3, align: 'right', fontFace: S.fonts.mono });
}

function card(slide: PptxSlide, x: number, y: number, w: number, h: number, pal: T10Pal, fill?: string, stroke?: string): void {
  slide.addShape('rect', { x, y, w, h, fill: { color: fill ?? pal.surfaceElevated }, line: { color: stroke ?? pal.borderStrong, width: 1 } });
}

function colorBar(slide: PptxSlide, x: number, y: number, w: number, pal: T10Pal): void {
  const n = 6;
  const g = 0.08;
  const cw = (w - g * (n - 1)) / n;
  const s = series(pal);
  for (let i = 0; i < n; i++) {
    slide.addShape('rect', { x: x + i * (cw + g), y, w: cw, h: 0.16, fill: { color: s[i] } });
  }
}

function tryImage(slide: PptxSlide, url: string | undefined, x: number, y: number, w: number, h: number, fallback: () => void): void {
  if (!url) { fallback(); return; }
  try {
    slide.addImage({ path: url, x, y, w, h });
  } catch {
    fallback();
  }
}

/** 内容页通用页眉（栏标 + 标题），返回正文起始 y。 */
function t10Head(slide: PptxSlide, p: any, pal: T10Pal, o: { size?: number } = {}): number {
  kicker(slide, p.kicker, pal, { y: 0.78 });
  const size = o.size ?? 30;
  title(slide, p.title, pal, { x: MX, y: 1.14, w: CW, size });
  return 1.14 + size / 72 * 1.18 + 0.45;
}

// =====================================================================
// 1. cover_dusk · 暮光对角封面（aurora）
// =====================================================================
function renderCoverDusk(slide: PptxSlide, p: any): void {
  const pal = P('theme10_cover_dusk_v1', p);
  (slide as any).background = { color: pal.bg };
  // 顶部行情带
  const tk = tickLine(p.ticker);
  if (tk) txt(slide, tk, { x: MX, y: 0.2, w: CW, h: 0.3, fontSize: 11, color: pal.ink3, align: 'left', fontFace: S.fonts.mono });
  // 右侧金线（呼应 Web 端对角金线）
  slide.addShape('line', { x: 6.6, y: 0, w: 0, h: 5.625, line: { color: pal.gold, width: 1.25 } });
  kicker(slide, p.kicker, pal, { y: 1.25 });
  title(slide, p.title, pal, { x: MX, y: 1.75, w: CW * 0.62, size: 44 });
  txt(slide, p.subtitle, { x: MX, y: 3.5, w: CW * 0.56, h: 1.2, fontSize: 14, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.25 } as any);
}

// =====================================================================
// 2. cover_field · 色场分栏封面（aurora）
// =====================================================================
function renderCoverField(slide: PptxSlide, p: any): void {
  const pal = P('theme10_cover_field_v1', p);
  (slide as any).background = { color: pal.bg };
  kicker(slide, p.kicker, pal, { y: 1.0 });
  title(slide, p.title, pal, { x: MX, y: 1.5, w: CW * 0.5, size: 40 });
  txt(slide, p.subtitle, { x: MX, y: 3.4, w: CW * 0.48, h: 1.2, fontSize: 13, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
  // 右侧色场卡（冰蓝→金渐变以纯色金线描边近似）
  card(slide, 5.9, 1.0, 3.4, 3.6, pal, pal.surface, pal.gold);
  txt(slide, p.fieldLabel ?? 'FIELD', { x: 6.1, y: 1.2, w: 3.0, h: 0.3, fontSize: 11, color: pal.ink3, align: 'left', fontFace: S.fonts.mono, charSpacing: 2 });
  txt(slide, String(p.fieldNo ?? '10'), { x: 6.1, y: 1.7, w: 3.0, h: 1.7, fontSize: 72, color: pal.ink, bold: true, align: 'left', fontFace: S.fonts.mono });
}

// =====================================================================
// 3. cover_atmos · 满版渐变大字（obsidian）
// =====================================================================
function renderCoverAtmos(slide: PptxSlide, p: any): void {
  const pal = P('theme10_cover_atmos_v1', p);
  (slide as any).background = { color: pal.bg };
  kicker(slide, p.kicker, pal, { y: 1.0 });
  title(slide, p.title, pal, { x: MX, y: 2.0, w: CW, size: 54 });
  if (p.en) txt(slide, p.en, { x: MX, y: 3.8, w: CW, h: 0.4, fontSize: 16, color: pal.gold, italic: true, align: 'left', fontFace: S.fonts.mono } as any);
}

// =====================================================================
// 4. cover_horizon · 地平线封面（ember）
// =====================================================================
function renderCoverHorizon(slide: PptxSlide, p: any): void {
  const pal = P('theme10_cover_horizon_v1', p);
  (slide as any).background = { color: pal.bg };
  txt(slide, p.issue ?? '', { x: MX + CW - 2, y: 0.55, w: 2, h: 0.3, fontSize: 12, color: pal.ink2, align: 'right', fontFace: S.fonts.mono });
  // 地平线金线
  slide.addShape('line', { x: 0, y: 3.35, w: 10, h: 0, line: { color: pal.gold, width: 1 } });
  kicker(slide, p.kicker, pal, { y: 1.0 });
  title(slide, p.title, pal, { x: MX, y: 3.7, w: CW, size: 40 });
  txt(slide, p.subtitle, { x: MX, y: 4.5, w: CW * 0.7, h: 0.6, fontSize: 13, color: pal.ink2, align: 'left', fontFace: S.fonts.body, lineSpacingMultiple: 1.2 } as any);
}

// =====================================================================
// 5. cover_standard · 标准封面（aurora）
// =====================================================================
function renderCoverStandard(slide: PptxSlide, p: any): void {
  const pal = P('theme10_cover_standard_v1', p);
  (slide as any).background = { color: pal.bg };
  if (p.stamp) txt(slide, p.stamp, { x: MX + CW - 3, y: 0.55, w: 3, h: 0.3, fontSize: 11, color: pal.gold, align: 'right', bold: true, fontFace: S.fonts.mono });
  kicker(slide, p.kicker, pal, { y: 1.7 });
  title(slide, p.title, pal, { x: MX, y: 2.2, w: CW, size: 46, align: 'center' });
  txt(slide, p.subtitle, { x: MX + CW * 0.15, y: 3.5, w: CW * 0.7, h: 0.8, fontSize: 14, color: pal.ink2, align: 'center', fontFace: S.fonts.body, lineSpacingMultiple: 1.2 } as any);
  const tk = tickLine(p.ticker);
  if (tk) txt(slide, tk, { x: MX, y: 4.7, w: CW, h: 0.3, fontSize: 11, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  colorBar(slide, MX, 4.98, CW, pal);
}

// =====================================================================
// 6. cover_dawn · 晨光卡封面（ember，含角嵌影像）
// =====================================================================
function renderCoverDawn(slide: PptxSlide, p: any): void {
  const pal = P('theme10_cover_dawn_v1', p);
  (slide as any).background = { color: pal.bg };
  // 角嵌影像
  tryImage(slide, p.imageUrl, 7.5, 0.7, 1.8, 1.35, () => {
    card(slide, 7.5, 0.7, 1.8, 1.35, pal, pal.surface, pal.borderStrong);
  });
  card(slide, MX, 1.5, CW - 0.1, 3.2, pal, pal.surface, pal.borderStrong);
  kicker(slide, p.kicker, pal, { y: 1.75 });
  title(slide, p.title, pal, { x: MX + 0.2, y: 2.2, w: CW * 0.6, size: 38 });
  txt(slide, p.subtitle, { x: MX + 0.2, y: 3.7, w: CW * 0.6, h: 0.8, fontSize: 13, color: pal.ink2, align: 'left', fontFace: S.fonts.body, lineSpacingMultiple: 1.2 } as any);
}

// =====================================================================
// 7. chapter · 章节索引（obsidian）
// =====================================================================
function renderChapter(slide: PptxSlide, p: any): void {
  const pal = P('theme10_chapter_v1', p);
  frame(slide, pal);
  const no = p.no || '01';
  txt(slide, no, { x: MX, y: 0.85, w: 3, h: 1.9, fontSize: 96, color: pal.gold, bold: true, align: 'left', fontFace: S.fonts.mono });
  title(slide, p.name, pal, { x: MX, y: 2.95, w: CW, size: 38 });
  const items = normStrings(p.items);
  items.forEach((it, i) => {
    const y = 3.55 + i * 0.42;
    txt(slide, String(i + 1).padStart(2, '0'), { x: MX, y, w: 0.5, h: 0.3, fontSize: 12, color: pal.accent, bold: true, fontFace: S.fonts.mono });
    txt(slide, it, { x: MX + 0.6, y, w: CW - 0.6, h: 0.3, fontSize: 13, color: pal.ink, fontFace: S.fonts.body });
    slide.addShape('line', { x: MX, y: y + 0.34, w: CW, h: 0, line: { color: pal.border, width: 0.5 } });
  });
  footer(slide, 'CHAPTER', p.no ? `No. ${no}` : '', pal);
}

// =====================================================================
// 8. divider · 序号分章（ember）
// =====================================================================
function renderDivider(slide: PptxSlide, p: any): void {
  const pal = P('theme10_divider_v1', p);
  (slide as any).background = { color: pal.bg };
  txt(slide, p.no || '01', { x: CW / 2 - 1.2, y: 1.5, w: 2.4, h: 1.5, fontSize: 90, color: pal.gold, bold: true, align: 'center', fontFace: S.fonts.mono });
  slide.addShape('rect', { x: 4.0, y: 3.15, w: 2.0, h: 0.06, fill: { color: pal.gold } });
  title(slide, p.name, pal, { x: CW / 2 - 3, y: 3.35, w: 6, size: 32, align: 'center' });
}

// =====================================================================
// 9. statement_section · 宣言章节（obsidian，左宣言右索引）
// =====================================================================
function renderStatementSection(slide: PptxSlide, p: any): void {
  const pal = P('theme10_statement_section_v1', p);
  frame(slide, pal);
  title(slide, p.quote, pal, { x: MX, y: 1.5, w: CW * 0.5, size: 28, valign: 'top' });
  const items = normStrings(p.items);
  const rx = 5.4;
  const rw = CW - (rx - MX);
  items.forEach((it, i) => {
    const y = 1.5 + i * 0.52;
    txt(slide, String(i + 1).padStart(2, '0'), { x: rx, y, w: 0.5, h: 0.3, fontSize: 12, color: pal.accent, bold: true, fontFace: S.fonts.mono });
    txt(slide, it, { x: rx + 0.6, y, w: rw - 0.6, h: 0.3, fontSize: 14, color: pal.ink, fontFace: S.fonts.body });
    slide.addShape('line', { x: rx, y: y + 0.38, w: rw, h: 0, line: { color: pal.border, width: 0.5 } });
  });
}

// =====================================================================
// 10. statement · 声明金句（ember）
// =====================================================================
function renderStatement(slide: PptxSlide, p: any): void {
  const pal = P('theme10_statement_v1', p);
  (slide as any).background = { color: pal.bg };
  title(slide, p.word, pal, { x: MX, y: 1.8, w: CW * 0.82, size: 40, valign: 'top' });
  if (p.sign) txt(slide, p.sign, { x: MX, y: 4.5, w: CW, h: 0.3, fontSize: 13, color: pal.gold, align: 'left', fontFace: S.fonts.mono });
}

// =====================================================================
// 11. principles · 投资原则（obsidian，编号 + 刻度尺）
// =====================================================================
function renderPrinciples(slide: PptxSlide, p: any): void {
  const pal = P('theme10_principles_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = (Array.isArray(p.items) ? p.items : []).slice(0, 6);
  const colW = (CW - 0.8) / 3;
  items.forEach((it: any, i: number) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = MX + col * (colW + 0.4);
    const y = y0 + row * (BOT - y0 - 0.3) / 2;
    slide.addShape('rect', { x, y, w: colW, h: 0.04, fill: { color: pal.gold } });
    txt(slide, it.no ?? String(i + 1).padStart(2, '0'), { x, y: y + 0.12, w: colW, h: 0.4, fontSize: 24, color: pal.accent, bold: true, fontFace: S.fonts.mono });
    txt(slide, it.name ?? '', { x, y: y + 0.58, w: colW, h: 0.3, fontSize: 16, color: pal.ink, bold: true, fontFace: S.fonts.heading });
    txt(slide, it.desc ?? '', { x, y: y + 0.92, w: colW, h: 0.9, fontSize: 11, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
  });
}

// =====================================================================
// 12. closing · 封底结语（aurora，含满版影像）
// =====================================================================
function renderClosing(slide: PptxSlide, p: any): void {
  const pal = P('theme10_closing_v1', p);
  (slide as any).background = { color: pal.bg };
  // 满版影像 + 压暗
  tryImage(slide, p.imageUrl, 0, 0, 10, 5.625, () => {
    slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: pal.surface } });
  });
  slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: pal.bg, transparency: 38 } });
  kicker(slide, p.mark, pal, { y: 1.7, align: 'center' as any, x: CW / 2 - 1.5, w: 3 } as any);
  title(slide, p.word, pal, { x: CW / 2 - 3.5, y: 2.2, w: 7, size: 40, align: 'center' });
  txt(slide, p.subtitle, { x: CW / 2 - 3, y: 3.5, w: 6, h: 0.8, fontSize: 13, color: pal.ink2, align: 'center', fontFace: S.fonts.body, lineSpacingMultiple: 1.2 } as any);
  const colophon = normStrings(p.colophon);
  if (colophon.length) {
    txt(slide, colophon.join('      ·      '), { x: CW / 2 - 3, y: 4.5, w: 6, h: 0.3, fontSize: 11, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  }
}

// =====================================================================
// 13. profile · 人物特写（obsidian，左肖像出血 + 右履历条）
// =====================================================================
function renderProfile(slide: PptxSlide, p: any): void {
  const pal = P('theme10_profile_v1', p);
  (slide as any).background = { color: pal.bg };
  tryImage(slide, p.imageUrl, 0, 0, 4.2, 5.625, () => {
    slide.addShape('rect', { x: 0, y: 0, w: 4.2, h: 5.625, fill: { color: pal.surface } });
  });
  slide.addShape('line', { x: 4.2, y: 0, w: 0, h: 5.625, line: { color: pal.gold, width: 1 } });
  kicker(slide, p.section, pal, { x: 4.6, y: 0.55 });
  title(slide, p.name, pal, { x: 4.6, y: 1.0, w: 5.0, size: 34 });
  txt(slide, p.en, { x: 4.6, y: 1.95, w: 5.0, h: 0.3, fontSize: 13, color: pal.ink2, fontFace: S.fonts.mono });
  txt(slide, p.title, { x: 4.6, y: 2.35, w: 5.0, h: 0.4, fontSize: 16, color: pal.gold, bold: true, fontFace: S.fonts.heading });
  const rows: [string, unknown][] = [['职务', p.role], ['年限', p.years], ['方向', p.focus]];
  rows.forEach((r, i) => {
    const y = 2.95 + i * 0.62;
    txt(slide, r[0], { x: 4.6, y, w: 1.0, h: 0.3, fontSize: 11, color: pal.ink3, fontFace: S.fonts.mono });
    txt(slide, r[1], { x: 5.7, y, w: 3.9, h: 0.3, fontSize: 13, color: pal.ink, fontFace: S.fonts.body });
    slide.addShape('line', { x: 4.6, y: y + 0.42, w: 5.0, h: 0, line: { color: pal.border, width: 0.5 } });
  });
  txt(slide, p.bio, { x: 4.6, y: 4.95, w: 5.0, h: 0.55, fontSize: 11, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.15 } as any);
}

// =====================================================================
// 14. team · 内容墙 / 团队（ember，3×2 网格 + 展签）
// =====================================================================
function renderTeam(slide: PptxSlide, p: any): void {
  const pal = P('theme10_team_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const cols = 3, rows = 2, gx = 0.3, gy = 0.3;
  const cw = (CW - gx * (cols - 1)) / cols;
  const areaH = BOT - y0 - 0.15;
  const ch = (areaH - gy * (rows - 1)) / rows;
  for (let i = 0; i < 6; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cw + gx);
    const y = y0 + r * (ch + gy);
    card(slide, x, y, cw, ch, pal);
    const imgH = ch * 0.6;
    tryImage(slide, p.images?.[i]?.url, x + 0.12, y + 0.12, cw - 0.24, imgH, () => {});
    txt(slide, p.images?.[i]?.name ?? '', { x: x + 0.12, y: y + imgH + 0.2, w: cw - 0.24, h: 0.3, fontSize: 14, color: pal.ink, bold: true, fontFace: S.fonts.heading });
    txt(slide, p.images?.[i]?.role ?? '', { x: x + 0.12, y: y + imgH + 0.52, w: cw - 0.24, h: 0.3, fontSize: 11, color: pal.gold, fontFace: S.fonts.mono });
  }
}

// =====================================================================
// 15. quote · 引言（obsidian，巨型引号 + mono 署名）
// =====================================================================
function renderQuote(slide: PptxSlide, p: any): void {
  const pal = P('theme10_quote_v1', p);
  (slide as any).background = { color: pal.bg };
  kicker(slide, p.section, pal, { y: 0.7 });
  txt(slide, '“', { x: MX - 0.05, y: 0.95, w: 2, h: 1.1, fontSize: 86, color: pal.gold, bold: true, fontFace: S.fonts.heading, align: 'left' } as any);
  title(slide, p.quote, pal, { x: MX, y: 2.05, w: CW, size: 30, valign: 'top' });
  txt(slide, p.sign, { x: MX, y: 4.45, w: CW, h: 0.3, fontSize: 15, color: pal.gold, bold: true, fontFace: S.fonts.heading });
  if (p.source) txt(slide, p.source, { x: MX, y: 4.8, w: CW, h: 0.3, fontSize: 12, color: pal.ink3, fontFace: S.fonts.mono });
}

// =====================================================================
// 16. editorial · 编排图文（ember，三栏文字 + 右出血图）
// =====================================================================
function renderEditorial(slide: PptxSlide, p: any): void {
  const pal = P('theme10_editorial_v1', p);
  (slide as any).background = { color: pal.bg };
  tryImage(slide, p.imageUrl, 6.2, 0, 3.8, 5.625, () => {
    slide.addShape('rect', { x: 6.2, y: 0, w: 3.8, h: 5.625, fill: { color: pal.surface } });
  });
  slide.addShape('line', { x: 6.2, y: 0, w: 0, h: 5.625, line: { color: pal.gold, width: 1 } });
  kicker(slide, p.section, pal, { x: MX, y: 0.6 });
  title(slide, p.title, pal, { x: MX, y: 1.05, w: 5.0, size: 28 });
  txt(slide, p.lead, { x: MX, y: 2.1, w: 5.0, h: 0.9, fontSize: 13, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
  const body = normStrings(p.body).slice(0, 3);
  const colW = (5.0 - 0.6) / 3;
  body.forEach((t, i) => {
    const x = MX + i * (colW + 0.3);
    txt(slide, String(i + 1).padStart(2, '0'), { x, y: 3.3, w: colW, h: 0.3, fontSize: 12, color: pal.accent, bold: true, fontFace: S.fonts.mono });
    txt(slide, t, { x, y: 3.65, w: colW, h: 1.4, fontSize: 11, color: pal.ink, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.15 } as any);
  });
}

// =====================================================================
// 17. magazine · 杂志图文（obsidian，左大图 + 右文 + 右下小图）
// =====================================================================
function renderMagazine(slide: PptxSlide, p: any): void {
  const pal = P('theme10_magazine_v1', p);
  (slide as any).background = { color: pal.bg };
  tryImage(slide, p.images?.[0]?.url, 0, 0, 4.6, 5.625, () => {
    slide.addShape('rect', { x: 0, y: 0, w: 4.6, h: 5.625, fill: { color: pal.surface } });
  });
  slide.addShape('line', { x: 4.6, y: 0, w: 0, h: 5.625, line: { color: pal.gold, width: 1 } });
  kicker(slide, p.section, pal, { x: 4.9, y: 0.5 });
  title(slide, p.title, pal, { x: 4.9, y: 0.95, w: 4.6, size: 26 });
  txt(slide, p.lead, { x: 4.9, y: 2.0, w: 4.6, h: 1.3, fontSize: 12, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
  if (p.pull) txt(slide, p.pull, { x: 4.9, y: 3.5, w: 4.6, h: 0.9, fontSize: 15, color: pal.gold, italic: true, fontFace: S.fonts.heading, valign: 'top', lineSpacingMultiple: 1.15 } as any);
  if (p.images?.[1]?.url) tryImage(slide, p.images[1].url, 4.9, 4.55, 2.2, 0.9, () => {});
}

// =====================================================================
// 18. triptych · 三联影像（ember，3 等高图 + 图注）
// =====================================================================
function renderTriptych(slide: PptxSlide, p: any): void {
  const pal = P('theme10_triptych_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const cols = 3, gx = 0.3;
  const cw = (CW - gx * (cols - 1)) / cols;
  const areaH = BOT - y0 - 0.5;
  for (let i = 0; i < 3; i++) {
    const x = MX + i * (cw + gx);
    card(slide, x, y0, cw, areaH, pal);
    tryImage(slide, p.images?.[i]?.url, x + 0.12, y0 + 0.12, cw - 0.24, areaH - 0.6, () => {});
    txt(slide, p.images?.[i]?.caption ?? '', { x: x + 0.12, y: y0 + areaH - 0.42, w: cw - 0.24, h: 0.34, fontSize: 11, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.1 } as any);
  }
}

// =====================================================================
// 19. strata · 横向影像带（obsidian，满宽 4 联 + 图注）
// =====================================================================
function renderStrata(slide: PptxSlide, p: any): void {
  const pal = P('theme10_strata_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const cols = 4, gx = 0.22;
  const cw = (CW - gx * (cols - 1)) / cols;
  const bandH = BOT - y0 - 0.5;
  for (let i = 0; i < 4; i++) {
    const x = MX + i * (cw + gx);
    tryImage(slide, p.images?.[i]?.url, x, y0, cw, bandH - 0.4, () => {
      card(slide, x, y0, cw, bandH - 0.4, pal);
    });
    txt(slide, String(i + 1).padStart(2, '0'), { x, y: y0 + bandH - 0.34, w: 0.5, h: 0.28, fontSize: 11, color: pal.gold, bold: true, fontFace: S.fonts.mono });
    txt(slide, p.images?.[i]?.caption ?? '', { x: x + 0.4, y: y0 + bandH - 0.34, w: cw - 0.4, h: 0.28, fontSize: 10, color: pal.ink2, fontFace: S.fonts.body });
  }
}

// =====================================================================
// 20. spark · 持仓小图集（obsidian，2×3 + 涨跌幅）
// =====================================================================
function renderSpark(slide: PptxSlide, p: any): void {
  const pal = P('theme10_spark_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const cols = 3, rows = 2, gx = 0.3, gy = 0.3;
  const cw = (CW - gx * (cols - 1)) / cols;
  const areaH = BOT - y0 - 0.55;
  const ch = (areaH - gy * (rows - 1)) / rows;
  for (let i = 0; i < 6; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cw + gx);
    const y = y0 + r * (ch + gy);
    card(slide, x, y, cw, ch, pal);
    const imgH = ch * 0.6;
    tryImage(slide, p.images?.[i]?.url, x + 0.12, y + 0.12, cw - 0.24, imgH, () => {});
    const up = !/^-/.test(String(p.images?.[i]?.value ?? '').trim());
    txt(slide, p.images?.[i]?.name ?? '', { x: x + 0.12, y: y + imgH + 0.18, w: cw - 0.24, h: 0.28, fontSize: 13, color: pal.ink, bold: true, fontFace: S.fonts.heading });
    txt(slide, p.images?.[i]?.value ?? '', { x: x + 0.12, y: y + imgH + 0.46, w: cw - 0.24, h: 0.26, fontSize: 12, color: up ? pal.green : pal.copper, bold: true, fontFace: S.fonts.mono });
  }
  txt(slide, '组合表现 · SPARK', { x: MX, y: BOT + 0.02, w: CW, h: 0.3, fontSize: 9, color: pal.ink3, align: 'left', fontFace: S.fonts.mono, charSpacing: 2 });
}

// =====================================================================
// 21. testimonials · 引述清单（ember，头像卡 + 三联短引述）
// =====================================================================
function renderTestimonials(slide: PptxSlide, p: any): void {
  const pal = P('theme10_testimonials_v1', p);
  frame(slide, pal);
  kicker(slide, p.section, pal, { y: 0.78 });
  // 主引述：左头像 + 右金句
  tryImage(slide, p.imageUrl, MX, 1.25, 1.5, 1.5, () => {
    card(slide, MX, 1.25, 1.5, 1.5, pal);
  });
  txt(slide, '“', { x: 2.1, y: 1.05, w: 1, h: 0.8, fontSize: 54, color: pal.gold, bold: true, fontFace: S.fonts.heading } as any);
  txt(slide, p.quote, { x: 2.4, y: 1.35, w: 7.0, h: 1.2, fontSize: 17, color: pal.ink, fontFace: S.fonts.heading, bold: true, valign: 'top', lineSpacingMultiple: 1.15 } as any);
  txt(slide, p.name, { x: 2.4, y: 2.6, w: 7.0, h: 0.3, fontSize: 14, color: pal.gold, bold: true, fontFace: S.fonts.heading });
  txt(slide, p.title, { x: 2.4, y: 2.92, w: 7.0, h: 0.3, fontSize: 11, color: pal.ink2, fontFace: S.fonts.mono });
  // 底部三联短引述
  const sec = (Array.isArray(p.quotes) ? p.quotes : []).slice(0, 3);
  const yS = 3.55;
  const scw = (CW - 0.6) / 3;
  sec.forEach((q: any, i: number) => {
    const x = MX + i * (scw + 0.3);
    slide.addShape('line', { x, y: yS, w: scw, h: 0, line: { color: pal.gold, width: 1 } });
    txt(slide, q?.text ?? '', { x, y: yS + 0.12, w: scw, h: 1.0, fontSize: 11, color: pal.ink, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.15 } as any);
    if (q?.who) txt(slide, q.who, { x, y: yS + 1.15, w: scw, h: 0.28, fontSize: 10, color: pal.ink3, fontFace: S.fonts.mono });
  });
}

// =====================================================================
// 22. feature · 图文特写（obsidian，左大图出血 + 右批注）
// =====================================================================
function renderFeature(slide: PptxSlide, p: any): void {
  const pal = P('theme10_feature_v1', p);
  (slide as any).background = { color: pal.bg };
  tryImage(slide, p.imageUrl, 0, 0, 4.6, 5.625, () => {
    slide.addShape('rect', { x: 0, y: 0, w: 4.6, h: 5.625, fill: { color: pal.surface } });
  });
  slide.addShape('line', { x: 4.6, y: 0, w: 0, h: 5.625, line: { color: pal.gold, width: 1 } });
  kicker(slide, p.section, pal, { x: 4.9, y: 0.5 });
  title(slide, p.title, pal, { x: 4.9, y: 0.95, w: 4.6, size: 26 });
  txt(slide, p.lead, { x: 4.9, y: 2.0, w: 4.6, h: 1.1, fontSize: 12, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
  const notes = (Array.isArray(p.notes) ? p.notes : []).slice(0, 3);
  notes.forEach((n: any, i: number) => {
    const y = 3.25 + i * 0.62;
    slide.addShape('rect', { x: 4.9, y, w: 0.12, h: 0.5, fill: { color: pal.gold } });
    txt(slide, n?.label ?? '', { x: 5.15, y, w: 4.35, h: 0.26, fontSize: 11, color: pal.gold, bold: true, fontFace: S.fonts.mono, charSpacing: 1 });
    txt(slide, n?.text ?? '', { x: 5.15, y: y + 0.26, w: 4.35, h: 0.3, fontSize: 12, color: pal.ink, fontFace: S.fonts.body });
  });
}

// =====================================================================
// 23. compareimg · 对照双图（ember，左右双图 + 角标图注）
// =====================================================================
function renderCompareImg(slide: PptxSlide, p: any): void {
  const pal = P('theme10_compareimg_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const list = Array.isArray(p.images) ? p.images : [];
  const cols = list.length >= 2 ? 2 : 1;
  const gx = 0.4;
  const cw = (CW - gx * (cols - 1)) / cols;
  const areaH = BOT - y0 - 0.5;
  list.forEach((img: any, i: number) => {
    const x = MX + i * (cw + gx);
    card(slide, x, y0, cw, areaH, pal);
    txt(slide, img?.tag ?? (i === 0 ? '对比 A' : '对比 B'), { x: x + 0.12, y: y0 + 0.12, w: cw - 0.24, h: 0.28, fontSize: 11, color: pal.gold, bold: true, fontFace: S.fonts.mono, charSpacing: 1 });
    tryImage(slide, img?.url, x + 0.12, y0 + 0.46, cw - 0.24, areaH - 0.9, () => {});
    txt(slide, img?.caption ?? '', { x: x + 0.12, y: y0 + areaH - 0.34, w: cw - 0.24, h: 0.3, fontSize: 11, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.1 } as any);
  });
}

// =====================================================================
// 24. pinboard · 钉板九宫格（obsidian，3×3 + 图注）
// =====================================================================
function renderPinboard(slide: PptxSlide, p: any): void {
  const pal = P('theme10_pinboard_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const cols = 3, rows = 3, gx = 0.22, gy = 0.22;
  const cw = (CW - gx * (cols - 1)) / cols;
  const areaH = BOT - y0 - 0.45;
  const ch = (areaH - gy * (rows - 1)) / rows;
  for (let i = 0; i < 9; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cw + gx);
    const y = y0 + r * (ch + gy);
    card(slide, x, y, cw, ch, pal);
    tryImage(slide, p.images?.[i]?.url, x + 0.1, y + 0.1, cw - 0.2, ch - 0.42, () => {});
    txt(slide, p.images?.[i]?.caption ?? '', { x: x + 0.1, y: y + ch - 0.3, w: cw - 0.2, h: 0.26, fontSize: 9, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.05 } as any);
  }
}

// =====================================================================
// 25. filmstrip · 横向胶片条（obsidian，满宽七联 + 帧号）
// =====================================================================
function renderFilmstrip(slide: PptxSlide, p: any): void {
  const pal = P('theme10_filmstrip_v1', p);
  (slide as any).background = { color: pal.bg };
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const n = 7, gx = 0.16;
  const cw = (CW - gx * (n - 1)) / n;
  const areaH = BOT - y0 - 0.55;
  slide.addShape('line', { x: MX, y: y0 - 0.08, w: CW, h: 0, line: { color: pal.gold, width: 1 } });
  for (let i = 0; i < n; i++) {
    const x = MX + i * (cw + gx);
    txt(slide, String(i + 1).padStart(2, '0'), { x, y: y0 + 0.02, w: cw, h: 0.26, fontSize: 10, color: pal.gold, bold: true, fontFace: S.fonts.mono, align: 'left' });
    tryImage(slide, p.images?.[i]?.url, x, y0 + 0.32, cw, areaH - 0.4, () => {
      card(slide, x, y0 + 0.32, cw, areaH - 0.4, pal);
    });
    txt(slide, p.images?.[i]?.caption ?? '', { x, y: y0 + areaH - 0.04, w: cw, h: 0.28, fontSize: 8.5, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.0 } as any);
  }
  slide.addShape('line', { x: MX, y: y0 + areaH + 0.04, w: CW, h: 0, line: { color: pal.gold, width: 1 } });
}

// =====================================================================
// 26. inset · 满版内嵌（aurora，满版影像 + 内嵌文字卡）
// =====================================================================
function renderInset(slide: PptxSlide, p: any): void {
  const pal = P('theme10_inset_v1', p);
  (slide as any).background = { color: pal.bg };
  tryImage(slide, p.imageUrl, 0, 0, 10, 5.625, () => {
    slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: pal.surface } });
  });
  slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: pal.bg, transparency: 34 } });
  // 内嵌文字卡（左下）
  const cx = MX, cw = 5.6;
  kicker(slide, p.section, pal, { x: cx, y: 1.5 });
  title(slide, p.title, pal, { x: cx, y: 1.95, w: cw, size: 30 });
  txt(slide, p.lead, { x: cx, y: 3.15, w: cw, h: 0.95, fontSize: 13, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
  const notes = (Array.isArray(p.notes) ? p.notes : []).slice(0, 3).filter((n: any) => n && n.text);
  notes.forEach((n: any, i: number) => {
    const y = 4.25 + i * 0.42;
    slide.addShape('rect', { x: cx, y, w: 0.1, h: 0.34, fill: { color: pal.gold } });
    txt(slide, n.label, { x: cx + 0.2, y, w: cw - 0.2, h: 0.22, fontSize: 9, color: pal.gold, bold: true, fontFace: S.fonts.mono, charSpacing: 1 });
    txt(slide, n.text, { x: cx + 0.2, y: y + 0.2, w: cw - 0.2, h: 0.22, fontSize: 11, color: pal.ink, fontFace: S.fonts.body });
  });
}

// =====================================================================
// 27. gallery2 · 画廊六格（ember，3×2 + 图注）
// =====================================================================
function renderGallery2(slide: PptxSlide, p: any): void {
  const pal = P('theme10_gallery2_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const cols = 3, rows = 2, gx = 0.3, gy = 0.3;
  const cw = (CW - gx * (cols - 1)) / cols;
  const areaH = BOT - y0 - 0.5;
  const ch = (areaH - gy * (rows - 1)) / rows;
  for (let i = 0; i < 6; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cw + gx);
    const y = y0 + r * (ch + gy);
    card(slide, x, y, cw, ch, pal);
    tryImage(slide, p.images?.[i]?.url, x + 0.12, y + 0.12, cw - 0.24, ch - 0.55, () => {});
    txt(slide, p.images?.[i]?.caption ?? '', { x: x + 0.12, y: y + ch - 0.38, w: cw - 0.24, h: 0.3, fontSize: 10, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.1 } as any);
  }
}

// =====================================================================
// 28. mosaic · 马赛克拼贴（aurora，第一列加宽的不规则 3×2）
// =====================================================================
function renderMosaic(slide: PptxSlide, p: any): void {
  const pal = P('theme10_mosaic_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const gx = 0.22, gy = 0.22;
  const cw0 = (CW - gx * 2) * 0.42;
  const cw1 = (CW - gx * 2 - cw0) / 2;
  const xs = [MX, MX + cw0 + gx, MX + cw0 + gx + cw1 + gx];
  const cws = [cw0, cw1, cw1];
  const areaH = BOT - y0 - 0.45;
  const ch = (areaH - gy) / 2;
  for (let i = 0; i < 6; i++) {
    const c = i % 3, r = Math.floor(i / 3);
    const x = xs[c], y = y0 + r * (ch + gy), w = cws[c];
    card(slide, x, y, w, ch, pal);
    tryImage(slide, p.images?.[i]?.url, x + 0.1, y + 0.1, w - 0.2, ch - 0.42, () => {});
    txt(slide, p.images?.[i]?.caption ?? '', { x: x + 0.1, y: y + ch - 0.3, w: w - 0.2, h: 0.26, fontSize: 9, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.05 } as any);
  }
}

// =====================================================================
// 29. collage · 自由拼贴（ember，主图左通栏高 + 右三图竖叠）
// =====================================================================
function renderCollage(slide: PptxSlide, p: any): void {
  const pal = P('theme10_collage_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const gx = 0.3;
  const areaH = BOT - y0 - 0.45;
  const cw0 = (CW - gx) * 0.58;
  const cw1 = CW - gx - cw0;
  const x1 = MX + cw0 + gx;
  card(slide, MX, y0, cw0, areaH, pal);
  tryImage(slide, p.images?.[0]?.url, MX + 0.12, y0 + 0.12, cw0 - 0.24, areaH - 0.42, () => {});
  txt(slide, p.images?.[0]?.caption ?? '', { x: MX + 0.12, y: y0 + areaH - 0.3, w: cw0 - 0.24, h: 0.26, fontSize: 10, color: pal.gold, bold: true, fontFace: S.fonts.mono, valign: 'top' } as any);
  const gy = 0.22;
  const ch = (areaH - gy * 2) / 3;
  for (let i = 0; i < 3; i++) {
    const y = y0 + i * (ch + gy);
    card(slide, x1, y, cw1, ch, pal);
    tryImage(slide, p.images?.[i + 1]?.url, x1 + 0.1, y + 0.1, cw1 - 0.2, ch - 0.4, () => {});
    txt(slide, p.images?.[i + 1]?.caption ?? '', { x: x1 + 0.1, y: y + ch - 0.28, w: cw1 - 0.2, h: 0.24, fontSize: 9, color: pal.ink2, fontFace: S.fonts.body, valign: 'top' } as any);
  }
}

// =====================================================================
// 30. captioned · 图注组（obsidian，三联大图 + 标题/说明图注）
// =====================================================================
function renderCaptioned(slide: PptxSlide, p: any): void {
  const pal = P('theme10_captioned_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const gx = 0.3, cols = 3;
  const cw = (CW - gx * (cols - 1)) / cols;
  const areaH = BOT - y0 - 0.45;
  const imgH = areaH * 0.66;
  const capH = areaH - imgH;
  for (let i = 0; i < 3; i++) {
    const x = MX + i * (cw + gx);
    card(slide, x, y0, cw, areaH, pal);
    tryImage(slide, p.images?.[i]?.url, x + 0.12, y0 + 0.12, cw - 0.24, imgH - 0.24, () => {});
    txt(slide, p.images?.[i]?.caption ?? '', { x: x + 0.12, y: y0 + imgH, w: cw - 0.24, h: 0.28, fontSize: 11, bold: true, color: pal.ink, fontFace: S.fonts.heading, valign: 'top' } as any);
    txt(slide, p.images?.[i]?.note ?? '', { x: x + 0.12, y: y0 + imgH + 0.3, w: cw - 0.24, h: capH - 0.36, fontSize: 9.5, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.08 } as any);
  }
}

// =====================================================================
// 31. showcase · 陈列橱窗（aurora，主图左 + 右 2×2 缩略）
// =====================================================================
function renderShowcase(slide: PptxSlide, p: any): void {
  const pal = P('theme10_showcase_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const gx = 0.3;
  const areaH = BOT - y0 - 0.45;
  const cw0 = (CW - gx) * 0.6;
  const cw1 = CW - gx - cw0;
  const x1 = MX + cw0 + gx;
  card(slide, MX, y0, cw0, areaH, pal);
  tryImage(slide, p.images?.[0]?.url, MX + 0.12, y0 + 0.12, cw0 - 0.24, areaH - 0.42, () => {});
  txt(slide, p.images?.[0]?.caption ?? '', { x: MX + 0.12, y: y0 + areaH - 0.3, w: cw0 - 0.24, h: 0.26, fontSize: 10, color: pal.gold, bold: true, fontFace: S.fonts.mono, valign: 'top' } as any);
  const gy = 0.2;
  const ch = (areaH - gy) / 2;
  const w = (cw1 - gy) / 2;
  for (let i = 0; i < 4; i++) {
    const r = Math.floor(i / 2), c = i % 2;
    const x = x1 + c * (w + gy);
    const y = y0 + r * (ch + gy);
    card(slide, x, y, w, ch, pal);
    tryImage(slide, p.images?.[i + 1]?.url, x + 0.08, y + 0.08, w - 0.16, ch - 0.32, () => {});
    txt(slide, p.images?.[i + 1]?.caption ?? '', { x: x + 0.08, y: y + ch - 0.24, w: w - 0.16, h: 0.2, fontSize: 8, color: pal.ink2, fontFace: S.fonts.body, valign: 'top' } as any);
  }
}

// =====================================================================
// 32. poster · 海报（ember，满版影像 + 底部压字大标题）
// =====================================================================
function renderPoster(slide: PptxSlide, p: any): void {
  const pal = P('theme10_poster_v1', p);
  (slide as any).background = { color: pal.bg };
  tryImage(slide, p.imageUrl, 0, 0, 10, 5.625, () => {
    slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: pal.surface } });
  });
  slide.addShape('rect', { x: 0, y: 3.35, w: 10, h: 2.275, fill: { color: pal.bg, transparency: 35 } });
  const cx = MX, cw = 8.4;
  kicker(slide, p.section, pal, { x: cx, y: 3.5 });
  title(slide, p.title, pal, { x: cx, y: 3.85, w: cw, size: 38 });
  txt(slide, p.tagline, { x: cx, y: 4.95, w: cw, h: 0.7, fontSize: 13, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 33. annotated · 注解图（aurora，底图 + 编号注解列表）
// =====================================================================
function renderAnnotated(slide: PptxSlide, p: any): void {
  const pal = P('theme10_annotated_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const areaH = BOT - y0 - 0.45;
  const imgW = (CW - 0.4) * 0.62;
  const noteX = MX + imgW + 0.4;
  const noteW = CW - imgW - 0.4;
  card(slide, MX, y0, imgW, areaH, pal);
  tryImage(slide, p.imageUrl, MX + 0.12, y0 + 0.12, imgW - 0.24, areaH - 0.24, () => {});
  const notes = (Array.isArray(p.annotations) ? p.annotations : []).slice(0, 3);
  notes.forEach((n: any, i: number) => {
    const y = y0 + i * ((areaH - 0.2) / 3) + 0.1;
    slide.addShape('rect', { x: noteX, y: y + 0.04, w: 0.34, h: 0.34, fill: { color: pal.gold } });
    txt(slide, String(i + 1), { x: noteX, y: y + 0.04, w: 0.34, h: 0.34, fontSize: 14, bold: true, color: pal.bg, align: 'center', fontFace: S.fonts.mono } as any);
    txt(slide, n?.text ?? '', { x: noteX + 0.46, y, w: noteW - 0.46, h: areaH / 3 - 0.2, fontSize: 12, color: pal.ink, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.15 } as any);
  });
}

// =====================================================================
// 34. quoteimg · 引言图（ember，满版影像 + 居中大引述）
// =====================================================================
function renderQuoteImg(slide: PptxSlide, p: any): void {
  const pal = P('theme10_quoteimg_v1', p);
  (slide as any).background = { color: pal.bg };
  tryImage(slide, p.imageUrl, 0, 0, 10, 5.625, () => {
    slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: pal.surface } });
  });
  slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: pal.bg, transparency: 38 } });
  kicker(slide, p.section, pal, { x: MX, y: 1.0 });
  txt(slide, p.quote, { x: MX, y: 1.7, w: CW, h: 2.6, fontSize: 30, bold: true, color: pal.ink, fontFace: S.fonts.heading, valign: 'top', lineSpacingMultiple: 1.12 } as any);
  txt(slide, p.attribution, { x: MX, y: 4.5, w: CW, h: 0.4, fontSize: 13, color: pal.gold, fontFace: S.fonts.mono, charSpacing: 1 } as any);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 35. quilt · 拼布（obsidian，4×2 紧凑影像拼布）
// =====================================================================
function renderQuilt(slide: PptxSlide, p: any): void {
  const pal = P('theme10_quilt_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const cols = 4, rows = 2, gx = 0.14, gy = 0.14;
  const cw = (CW - gx * (cols - 1)) / cols;
  const areaH = BOT - y0 - 0.45;
  const ch = (areaH - gy * (rows - 1)) / rows;
  for (let i = 0; i < 8; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cw + gx);
    const y = y0 + r * (ch + gy);
    card(slide, x, y, cw, ch, pal);
    tryImage(slide, p.images?.[i]?.url, x + 0.06, y + 0.06, cw - 0.12, ch - 0.12, () => {});
  }
}

// =====================================================================
// 36. exhibit · 陈列展（aurora，带框展品 + 展签文本）
// =====================================================================
function renderExhibit(slide: PptxSlide, p: any): void {
  const pal = P('theme10_exhibit_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const areaH = BOT - y0 - 0.45;
  const imgW = (CW - 0.4) * 0.6;
  const labelX = MX + imgW + 0.4;
  const labelW = CW - imgW - 0.4;
  card(slide, MX, y0, imgW, areaH, pal);
  tryImage(slide, p.imageUrl, MX + 0.12, y0 + 0.12, imgW - 0.24, areaH - 0.24, () => {});
  txt(slide, p.meta, { x: labelX, y: y0 + 0.1, w: labelW, h: 0.3, fontSize: 11, color: pal.gold, bold: true, fontFace: S.fonts.mono, charSpacing: 1 } as any);
  slide.addShape('line', { x: labelX, y: y0 + 0.5, w: labelW, h: 0, line: { color: pal.gold, width: 1 } });
  txt(slide, p.desc, { x: labelX, y: y0 + 0.66, w: labelW, h: areaH - 0.8, fontSize: 14, color: pal.ink, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.4 } as any);
}

// =====================================================================
// 37. medallions · 徽章墙（ember，3×2 圆形徽章 + 标签）
// =====================================================================
function renderMedallions(slide: PptxSlide, p: any): void {
  const pal = P('theme10_medallions_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const cols = 3, gx = 0.5;
  const cw = (CW - gx * (cols - 1)) / cols;
  const areaH = BOT - y0 - 0.45;
  const rowH = (areaH - 0.4) / 2;
  const d = Math.min(cw, rowH - 0.4);
  for (let i = 0; i < 6; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const cx = MX + c * (cw + gx) + cw / 2;
    const cy = y0 + r * rowH + d / 2;
    const x = cx - d / 2, y = cy - d / 2;
    slide.addShape('oval', { x, y, w: d, h: d, fill: { color: pal.surfaceElevated }, line: { color: pal.gold, width: 1.5 } });
    tryImage(slide, p.images?.[i]?.url, x + 0.08, y + 0.08, d - 0.16, d - 0.16, () => {});
    txt(slide, p.images?.[i]?.label ?? '', { x: cx - cw / 2, y: y + d + 0.08, w: cw, h: 0.3, fontSize: 12, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.heading, valign: 'top' } as any);
  }
}

// =====================================================================
// 38. bar · 竖向柱状图（aurora，1–3 序列分组）
// =====================================================================
function renderBar(slide: PptxSlide, p: any): void {
  const pal = P('theme10_bar_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const cats = t10NormCats(p.categories);
  const sers: { name: string; values: number[]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({
    name: sr?.name ?? `序列 ${i + 1}`, values: t10ParseVals(sr?.values), color: sr?.color,
  }));
  const n = Math.max(cats.length, 1), m = Math.max(sers.length, 1);
  const all = sers.flatMap((s) => s.values);
  const max = all.length ? Math.max(...all) : 1;
  const min = all.length ? Math.min(...all, 0) : 0;
  const sc = t10Nice(min, max, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, sc);
  const band = (x1 - x0) / n, inner = band * 0.6, barW = inner / m;
  const yOf = (v: number) => plotBot - (v - sc.min) / (sc.max - sc.min || 1) * (plotBot - plotTop);
  const colors = series(pal);
  for (let i = 0; i < n; i++) {
    const bx = x0 + i * band + (band - inner) / 2;
    for (let si = 0; si < m; si++) {
      const s = sers[si], v = s.values[i] ?? 0;
      const top = yOf(v), base = yOf(0), h = Math.abs(top - base);
      slide.addShape('rect', {
        x: bx + si * barW + 0.02, y: Math.min(top, base), w: Math.max(barW - 0.04, 0.04), h: Math.max(h, 0.02),
        fill: { color: s.color ?? colors[si] },
      });
    }
    if (cats[i]) txt(slide, cats[i], { x: x0 + i * band, y: plotBot + 0.05, w: band, h: 0.26, fontSize: 9, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  }
  if (m > 1) t10Legend(slide, pal, sers.map((s, i) => ({ name: s.name, color: s.color ?? colors[i] })), x0, y0 - 0.34);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 39. hbar · 横向排名条（aurora，降序）
// =====================================================================
function renderHBar(slide: PptxSlide, p: any): void {
  const pal = P('theme10_hbar_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const xL = MX + 1.7, xR = MX + CW - 0.2, yTop = y0 + 0.12, yBot = BOT - 0.3;
  const rows: { name: string; value: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any) => ({ name: it?.name ?? '', value: Number(it?.value ?? 0) }))
    .sort((a: any, b: any) => b.value - a.value).slice(0, 8);
  const max = rows.length ? Math.max(...rows.map((r) => r.value), 1) : 1;
  const sc = t10Nice(0, max, 4);
  const xOf = (v: number) => xL + (v - sc.min) / (sc.max - sc.min || 1) * (xR - xL);
  for (const t of sc.ticks) {
    const px = xOf(t), zero = Math.abs(t) < 1e-9;
    slide.addShape('line', { x: px, y: yTop - 0.1, w: 0, h: yBot - yTop + 0.2, line: { color: zero ? pal.borderStrong : pal.border, width: zero ? 1 : 0.75 } });
    txt(slide, t10Fmt(t), { x: px - 0.4, y: yBot + 0.04, w: 0.8, h: 0.24, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  }
  const colors = series(pal);
  const rowH = (yBot - yTop) / Math.max(rows.length, 1);
  rows.forEach((r: any, i: number) => {
    const cy = yTop + i * rowH + rowH / 2;
    txt(slide, r.name, { x: MX, y: cy - 0.12, w: 1.55, h: 0.26, fontSize: 10, color: pal.ink2, align: 'left', fontFace: S.fonts.body });
    const bw = Math.max(xOf(r.value) - xL, 0.04);
    slide.addShape('rect', { x: xL, y: cy - rowH * 0.3, w: bw, h: rowH * 0.6, fill: { color: colors[i % 6] }, line: { color: pal.border, width: 0.5 } });
    txt(slide, t10Fmt(r.value), { x: xL + bw + 0.08, y: cy - 0.12, w: 1.2, h: 0.26, fontSize: 10, bold: true, color: pal.ink, align: 'left', fontFace: S.fonts.mono });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 40. line · 折线趋势（obsidian，多序列）
// =====================================================================
function renderLine(slide: PptxSlide, p: any): void {
  const pal = P('theme10_line_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const cats = t10NormCats(p.categories);
  const sers: { name: string; values: number[]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({
    name: sr?.name ?? `序列 ${i + 1}`, values: t10ParseVals(sr?.values), color: sr?.color,
  }));
  const n = Math.max(cats.length, 1), m = Math.max(sers.length, 1);
  const all = sers.flatMap((s) => s.values);
  const max = all.length ? Math.max(...all) : 1;
  const min = all.length ? Math.min(...all, 0) : 0;
  const sc = t10Nice(min, max, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, sc);
  const band = (x1 - x0) / n;
  const yOf = (v: number) => plotBot - (v - sc.min) / (sc.max - sc.min || 1) * (plotBot - plotTop);
  const xs = cats.map((_, i) => (n === 1 ? (x0 + x1) / 2 : x0 + (i / (n - 1)) * (x1 - x0)));
  const colors = series(pal);
  sers.forEach((s, si) => {
    const col = s.color ?? colors[si];
    const ys = s.values.map((v) => yOf(v));
    for (let i = 0; i < ys.length - 1; i++) t10Seg(slide, xs[i], ys[i], xs[i + 1], ys[i + 1], col, 2.2);
    ys.forEach((yy, i) => slide.addShape('oval', { x: xs[i] - 0.05, y: yy - 0.05, w: 0.1, h: 0.1, fill: { color: col } }));
  });
  cats.forEach((c, i) => txt(slide, c, { x: xs[i] - band / 2, y: plotBot + 0.05, w: band, h: 0.26, fontSize: 9, color: pal.ink2, align: 'center', fontFace: S.fonts.body }));
  if (m > 1) t10Legend(slide, pal, sers.map((s, i) => ({ name: s.name, color: s.color ?? colors[i] })), x0, y0 - 0.34);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 41. area · 面积图（aurora，单序列渐变填充近似为折线+端点）
// =====================================================================
function renderArea(slide: PptxSlide, p: any): void {
  const pal = P('theme10_area_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const cats = t10NormCats(p.categories);
  const sers: { name: string; values: number[]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({
    name: sr?.name ?? `序列 ${i + 1}`, values: t10ParseVals(sr?.values), color: sr?.color,
  }));
  const vals = sers[0]?.values ?? [];
  const n = Math.max(cats.length, 1);
  const max = vals.length ? Math.max(...vals) : 1;
  const min = vals.length ? Math.min(...vals, 0) : 0;
  const sc = t10Nice(min, max, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, sc);
  if (vals.length) {
    const yOf = (v: number) => plotBot - (v - sc.min) / (sc.max - sc.min || 1) * (plotBot - plotTop);
    const xs = vals.map((_, i) => (n === 1 ? (x0 + x1) / 2 : x0 + (i / (n - 1)) * (x1 - x0)));
    const col = sers[0]?.color ?? pal.accent;
    const ys = vals.map((v) => yOf(v));
    for (let i = 0; i < ys.length - 1; i++) t10Seg(slide, xs[i], ys[i], xs[i + 1], ys[i + 1], col, 2.4);
    ys.forEach((yy, i) => slide.addShape('oval', { x: xs[i] - 0.05, y: yy - 0.05, w: 0.1, h: 0.1, fill: { color: col } }));
    cats.forEach((c, i) => txt(slide, c, { x: xs[i] - (x1 - x0) / n / 2, y: plotBot + 0.05, w: (x1 - x0) / n, h: 0.26, fontSize: 9, color: pal.ink2, align: 'center', fontFace: S.fonts.body }));
  }
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 42. kpis · 指标卡（ember，2×2 大数字）
// =====================================================================
function renderKpis(slide: PptxSlide, p: any): void {
  const pal = P('theme10_kpis_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const areaH = BOT - y0 - 0.45, gx = 0.3, gy = 0.3;
  const cw = (CW - gx) / 2, ch = (areaH - gy) / 2;
  const items = (Array.isArray(p.items) ? p.items : []).slice(0, 4);
  for (let i = 0; i < 4; i++) {
    const c = i % 2, r = Math.floor(i / 2);
    const x = MX + c * (cw + gx), y = y0 + r * (ch + gy);
    const it = items[i] ?? {};
    card(slide, x, y, cw, ch, pal);
    txt(slide, it.label ?? '', { x: x + 0.25, y: y + 0.2, w: cw - 0.5, h: 0.3, fontSize: 12, color: pal.ink2, fontFace: S.fonts.body });
    const up = it.delta != null && !/^-/.test(String(it.delta).trim());
    const valStr = `${it.value ?? ''}${it.unit ? ' ' + it.unit : ''}`;
    txt(slide, valStr, { x: x + 0.25, y: y + 0.52, w: cw - 0.5, h: 0.9, fontSize: 40, bold: true, color: pal.ink, fontFace: S.fonts.mono });
    slide.addShape('line', { x: x + 0.25, y: y + 1.5, w: cw - 0.5, h: 0, line: { color: pal.gold, width: 1 } });
    txt(slide, it.delta ?? '', { x: x + 0.25, y: y + 1.6, w: cw - 0.5, h: 0.3, fontSize: 13, bold: true, color: up ? pal.green : pal.red, fontFace: S.fonts.mono });
  }
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 43. grouped · 分组柱状图（aurora，柱顶数值）
// =====================================================================
function renderGrouped(slide: PptxSlide, p: any): void {
  const pal = P('theme10_grouped_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const cats = t10NormCats(p.categories);
  const sers: { name: string; values: number[]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({
    name: sr?.name ?? `序列 ${i + 1}`, values: t10ParseVals(sr?.values), color: sr?.color,
  }));
  const n = Math.max(cats.length, 1), m = Math.max(sers.length, 1);
  const all = sers.flatMap((s) => s.values);
  const max = all.length ? Math.max(...all) : 1;
  const min = all.length ? Math.min(...all, 0) : 0;
  const sc = t10Nice(min, max, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, sc);
  const band = (x1 - x0) / n, inner = band * 0.58, barW = inner / m;
  const yOf = (v: number) => plotBot - (v - sc.min) / (sc.max - sc.min || 1) * (plotBot - plotTop);
  const colors = series(pal);
  for (let i = 0; i < n; i++) {
    const bx = x0 + i * band + (band - inner) / 2;
    for (let si = 0; si < m; si++) {
      const s = sers[si], v = s.values[i] ?? 0;
      const top = yOf(v), base = yOf(0), h = Math.abs(top - base);
      const col = s.color ?? colors[si];
      slide.addShape('rect', { x: bx + si * barW + 0.02, y: Math.min(top, base), w: Math.max(barW - 0.04, 0.04), h: Math.max(h, 0.02), fill: { color: col } });
      txt(slide, t10Fmt(v), { x: bx + si * barW, y: Math.min(top, base) - 0.28, w: barW, h: 0.24, fontSize: 8, color: pal.ink2, align: 'center', fontFace: S.fonts.mono });
    }
    if (cats[i]) txt(slide, cats[i], { x: x0 + i * band, y: plotBot + 0.05, w: band, h: 0.26, fontSize: 9, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  }
  if (m > 1) t10Legend(slide, pal, sers.map((s, i) => ({ name: s.name, color: s.color ?? colors[i] })), x0, y0 - 0.34);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 44. stack · 堆叠柱状图（aurora，柱顶合计）
// =====================================================================
function renderStack(slide: PptxSlide, p: any): void {
  const pal = P('theme10_stack_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const cats = t10NormCats(p.categories);
  const sers: { name: string; values: number[]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({
    name: sr?.name ?? `序列 ${i + 1}`, values: t10ParseVals(sr?.values), color: sr?.color,
  }));
  const n = Math.max(cats.length, 1), m = Math.max(sers.length, 1);
  const totals = cats.map((_, i) => sers.reduce((a: number, s: any) => a + (s.values[i] ?? 0), 0));
  const max = totals.length ? Math.max(...totals, 1) : 1;
  const sc = t10Nice(0, max, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, sc);
  const band = (x1 - x0) / n, barW = band * 0.5;
  const yOf = (v: number) => plotBot - (v - sc.min) / (sc.max - sc.min || 1) * (plotBot - plotTop);
  const colors = series(pal);
  for (let i = 0; i < n; i++) {
    const bx = x0 + i * band + (band - barW) / 2;
    let cum = 0;
    for (let si = 0; si < m; si++) {
      const s = sers[si], v = s.values[i] ?? 0, col = s.color ?? colors[si];
      const yTop = yOf(cum + v), yBot = yOf(cum);
      slide.addShape('rect', { x: bx, y: yTop, w: barW, h: Math.max(yBot - yTop, 0.02), fill: { color: col } });
      cum += v;
    }
    txt(slide, t10Fmt(cum), { x: bx, y: yOf(cum) - 0.28, w: barW, h: 0.24, fontSize: 8, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
    if (cats[i]) txt(slide, cats[i], { x: x0 + i * band, y: plotBot + 0.05, w: band, h: 0.26, fontSize: 9, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  }
  if (m > 1) t10Legend(slide, pal, sers.map((s, i) => ({ name: s.name, color: s.color ?? colors[i] })), x0, y0 - 0.34);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 45. donut · 环形图（ember，圆心合计 + 右侧图例）
//     angleRange 约定：0°=正东(3 点钟)，顺时针为正（与 SVG 一致）
// =====================================================================
function renderDonut(slide: PptxSlide, p: any): void {
  const pal = P('theme10_donut_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { name: string; value: number }[] = (Array.isArray(p.items) ? p.items : []).map((it: any, i: number) => ({ name: it?.name ?? `项 ${i + 1}`, value: Number(it?.value ?? 0) }));
  const total = items.reduce((a: number, it: any) => a + Math.max(it.value, 0), 0) || 1;
  const cx = 3.4, cy = y0 + (BOT - y0 - 0.4) / 2, R = 1.3, rIn = 0.82;
  const colors = series(pal);
  let acc = 0;
  items.forEach((it, i) => {
    const f0 = acc / total; acc += Math.max(it.value, 0); const f1 = acc / total;
    const a0 = ((270 + f0 * 360) % 360 + 360) % 360;
    const sweep = (f1 - f0) * 360;
    slide.addShape('pie', { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, fill: { color: colors[i % 6] }, angleRange: [a0, sweep] } as any);
  });
  slide.addShape('oval', { x: cx - rIn, y: cy - rIn, w: 2 * rIn, h: 2 * rIn, fill: { color: pal.bg } });
  txt(slide, t10Fmt(total), { x: cx - 1.0, y: cy - 0.16, w: 2.0, h: 0.5, fontSize: 26, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
  txt(slide, p.centerLabel ?? '总计', { x: cx - 1.0, y: cy + 0.36, w: 2.0, h: 0.3, fontSize: 11, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
  const lx = cx + R + 0.38, ly0 = y0 + 0.35, lrow = 0.62;
  items.forEach((it, i) => {
    const ly = ly0 + i * lrow, pct = Math.round((Math.max(it.value, 0) / total) * 100);
    slide.addShape('rect', { x: lx, y: ly + 0.02, w: 0.18, h: 0.18, fill: { color: colors[i % 6] } });
    txt(slide, it.name, { x: lx + 0.26, y: ly - 0.04, w: 3.0, h: 0.28, fontSize: 12, color: pal.ink2, align: 'left', fontFace: S.fonts.body });
    txt(slide, pct + '%', { x: lx + 0.26, y: ly + 0.26, w: 3.0, h: 0.26, fontSize: 11, bold: true, color: pal.ink, align: 'left', fontFace: S.fonts.mono });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 46. pie · 饼图（ember，全扇区 + 右侧图例）
// =====================================================================
function renderPie(slide: PptxSlide, p: any): void {
  const pal = P('theme10_pie_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { name: string; value: number }[] = (Array.isArray(p.items) ? p.items : []).map((it: any, i: number) => ({ name: it?.name ?? `项 ${i + 1}`, value: Number(it?.value ?? 0) }));
  const total = items.reduce((a: number, it: any) => a + Math.max(it.value, 0), 0) || 1;
  const cx = 3.4, cy = y0 + (BOT - y0 - 0.4) / 2, R = 1.5;
  const colors = series(pal);
  let acc = 0;
  items.forEach((it, i) => {
    const f0 = acc / total; acc += Math.max(it.value, 0); const f1 = acc / total;
    const a0 = ((270 + f0 * 360) % 360 + 360) % 360;
    const sweep = (f1 - f0) * 360;
    slide.addShape('pie', { x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, fill: { color: colors[i % 6] }, angleRange: [a0, sweep] } as any);
  });
  const lx = cx + R + 0.38, ly0 = y0 + 0.35, lrow = 0.62;
  items.forEach((it, i) => {
    const ly = ly0 + i * lrow, pct = Math.round((Math.max(it.value, 0) / total) * 100);
    slide.addShape('rect', { x: lx, y: ly + 0.02, w: 0.18, h: 0.18, fill: { color: colors[i % 6] } });
    txt(slide, it.name, { x: lx + 0.26, y: ly - 0.04, w: 3.0, h: 0.28, fontSize: 12, color: pal.ink2, align: 'left', fontFace: S.fonts.body });
    txt(slide, pct + '%', { x: lx + 0.26, y: ly + 0.26, w: 3.0, h: 0.26, fontSize: 11, bold: true, color: pal.ink, align: 'left', fontFace: S.fonts.mono });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 47. waterfall · 瀑布图（obsidian，浮动柱 + 连接线）
// =====================================================================
function renderWaterfall(slide: PptxSlide, p: any): void {
  const pal = P('theme10_waterfall_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const items: { name: string; value: number }[] = (Array.isArray(p.items) ? p.items : []).map((it: any, i: number) => ({ name: it?.name ?? `项 ${i + 1}`, value: Number(it?.value ?? 0) }));
  const n = Math.max(items.length, 1);
  const run: number[] = []; let cur = 0;
  for (const it of items) { run.push(cur); cur += it.value; }
  const all = [0, ...run.map((_, i) => run[i] + items[i].value), cur];
  const minV = Math.min(...all, 0), maxV = Math.max(...all, 1);
  const sc = t10Nice(minV, maxV, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, sc);
  const band = (x1 - x0) / n, inner = band * 0.56;
  const yOf = (v: number) => plotBot - (v - sc.min) / (sc.max - sc.min || 1) * (plotBot - plotTop);
  for (let i = 1; i < n; i++) {
    const afterPrev = run[i - 1] + items[i - 1].value, ya = yOf(afterPrev);
    const xS = x0 + (i - 1) * band + (band - inner) / 2 + inner;
    const xE = x0 + i * band + (band - inner) / 2;
    t10Seg(slide, xS, ya, xE, ya, pal.borderStrong, 0.75);
  }
  items.forEach((it, i) => {
    const before = run[i], after = before + it.value;
    const yTop = yOf(Math.max(before, after)), yBot = yOf(Math.min(before, after));
    const bx = x0 + i * band + (band - inner) / 2, up = it.value >= 0;
    const col = up ? pal.green : pal.red;
    slide.addShape('rect', { x: bx, y: yTop, w: inner, h: Math.max(yBot - yTop, 0.02), fill: { color: col } });
    txt(slide, t10Fmt(it.value), { x: bx, y: up ? yTop - 0.28 : yBot + 0.02, w: inner, h: 0.24, fontSize: 8, bold: true, color: col, align: 'center', fontFace: S.fonts.mono });
    txt(slide, it.name, { x: x0 + i * band, y: plotBot + 0.05, w: band, h: 0.26, fontSize: 9, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 48. scatter · 散点图（obsidian，双数值轴）
// =====================================================================
function renderScatter(slide: PptxSlide, p: any): void {
  const pal = P('theme10_scatter_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const sers: { name: string; pts: [number, number][]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({ name: sr?.name ?? `序列 ${i + 1}`, pts: t10ParseXY(sr?.points), color: sr?.color }));
  const flat = sers.flatMap((s) => s.pts);
  const allX = flat.map((q) => q[0]); const allY = flat.map((q) => q[1]);
  const scx = t10Nice(allX.length ? Math.min(...allX) : 0, allX.length ? Math.max(...allX, 1) : 1, 5);
  const scy = t10Nice(allY.length ? Math.min(...allY, 0) : 0, allY.length ? Math.max(...allY, 1) : 1, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, scy);
  const xOf = (v: number) => x0 + (v - scx.min) / (scx.max - scx.min || 1) * (x1 - x0);
  const yOf = (v: number) => plotBot - (v - scy.min) / (scy.max - scy.min || 1) * (plotBot - plotTop);
  const colors = series(pal);
  for (const t of scx.ticks) {
    const x = xOf(t); const zero = Math.abs(t) < 1e-9;
    slide.addShape('line', { x, y: plotTop, w: 0, h: plotBot - plotTop, line: { color: zero ? pal.borderStrong : pal.border, width: zero ? 1 : 0.5 } });
    txt(slide, t10Fmt(t), { x: x - 0.4, y: plotBot + 0.04, w: 0.8, h: 0.24, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  }
  sers.forEach((s, si) => {
    const col = s.color ?? colors[si];
    s.pts.forEach((q) => {
      const cx = xOf(q[0]), cy = yOf(q[1]);
      slide.addShape('oval', { x: cx - 0.07, y: cy - 0.07, w: 0.14, h: 0.14, fill: { color: col } });
    });
  });
  if (sers.length > 1) t10Legend(slide, pal, sers.map((s, i) => ({ name: s.name, color: s.color ?? colors[i] })), x0, y0 - 0.34);
  if (p.xLabel) txt(slide, p.xLabel, { x: (x0 + x1) / 2 - 0.5, y: plotBot + 0.32, w: 1.0, h: 0.24, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
  if (p.yLabel) txt(slide, p.yLabel, { x: MX - 0.05, y: plotTop - 0.02, w: 1.0, h: 0.24, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 49. bubble · 气泡图（aurora，x/y/尺寸）
// =====================================================================
function renderBubble(slide: PptxSlide, p: any): void {
  const pal = P('theme10_bubble_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const sers: { name: string; pts: [number, number, number][]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({ name: sr?.name ?? `序列 ${i + 1}`, pts: t10ParseXYS(sr?.points), color: sr?.color }));
  const flat = sers.flatMap((s) => s.pts);
  const allX = flat.map((q) => q[0]); const allY = flat.map((q) => q[1]); const allS = flat.map((q) => q[2]);
  const scx = t10Nice(allX.length ? Math.min(...allX) : 0, allX.length ? Math.max(...allX, 1) : 1, 5);
  const scy = t10Nice(allY.length ? Math.min(...allY, 0) : 0, allY.length ? Math.max(...allY, 1) : 1, 4);
  const minS = allS.length ? Math.min(...allS) : 0; const maxS = allS.length ? Math.max(...allS, 1) : 1;
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, scy);
  const xOf = (v: number) => x0 + (v - scx.min) / (scx.max - scx.min || 1) * (x1 - x0);
  const yOf = (v: number) => plotBot - (v - scy.min) / (scy.max - scy.min || 1) * (plotBot - plotTop);
  const rOf = (sz: number) => 0.08 + ((sz - minS) / (maxS - minS || 1)) * 0.34;
  const colors = series(pal);
  for (const t of scx.ticks) {
    const x = xOf(t); const zero = Math.abs(t) < 1e-9;
    slide.addShape('line', { x, y: plotTop, w: 0, h: plotBot - plotTop, line: { color: zero ? pal.borderStrong : pal.border, width: zero ? 1 : 0.5 } });
    txt(slide, t10Fmt(t), { x: x - 0.4, y: plotBot + 0.04, w: 0.8, h: 0.24, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  }
  sers.forEach((s, si) => {
    const col = s.color ?? colors[si];
    s.pts.forEach((q) => {
      const cx = xOf(q[0]), cy = yOf(q[1]), r = rOf(q[2]);
      slide.addShape('oval', { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, fill: { color: col }, line: { color: col, width: 0.75 } } as any);
    });
  });
  if (sers.length > 1) t10Legend(slide, pal, sers.map((s, i) => ({ name: s.name, color: s.color ?? colors[i] })), x0, y0 - 0.34);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 50. radar · 雷达图（obsidian，多维多边形）
// =====================================================================
function renderRadar(slide: PptxSlide, p: any): void {
  const pal = P('theme10_radar_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const axes = t10NormCats(p.axes);
  const n = Math.max(axes.length, 3);
  const sers: { name: string; values: number[]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({ name: sr?.name ?? `序列 ${i + 1}`, values: t10ParseVals(sr?.values), color: sr?.color }));
  const allV = sers.flatMap((s) => s.values);
  const sc = t10Nice(0, allV.length ? Math.max(...allV, 1) : 100, 4);
  const xL = MX + 0.5, xR = MX + CW - 0.5, yT = y0 + 0.15, yB = BOT - 0.35;
  const cx = (xL + xR) / 2, cy = (yT + yB) / 2, R = (Math.min(xR - xL, yB - yT) / 2) * 0.82, rings = 4;
  const ang = (i: number) => ((-90 + (i * 360) / n) * Math.PI) / 180;
  const ptAt = (v: number, i: number): [number, number] => { const r = (v / (sc.max || 1)) * R; return [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))]; };
  for (let k = 1; k <= rings; k++) {
    const f = (k / rings) * sc.max;
    for (let i = 0; i < n; i++) { const a = ptAt(f, i), b = ptAt(f, (i + 1) % n); t10Seg(slide, a[0], a[1], b[0], b[1], pal.border, 0.5); }
  }
  for (let i = 0; i < n; i++) {
    const o = ptAt(0, i), e = ptAt(sc.max, i);
    t10Seg(slide, o[0], o[1], e[0], e[1], pal.border, 0.5);
    if (axes[i]) { const lx = cx + (R + 0.3) * Math.cos(ang(i)), ly = cy + (R + 0.3) * Math.sin(ang(i)); txt(slide, axes[i], { x: lx - 0.7, y: ly - 0.13, w: 1.4, h: 0.26, fontSize: 10, color: pal.ink2, align: 'center', fontFace: S.fonts.body }); }
  }
  const colors = series(pal);
  sers.forEach((s, si) => {
    const col = s.color ?? colors[si];
    for (let i = 0; i < n; i++) { const a = ptAt(s.values[i] ?? 0, i), b = ptAt(s.values[(i + 1) % n] ?? 0, (i + 1) % n); t10Seg(slide, a[0], a[1], b[0], b[1], col, 1.5); }
  });
  if (sers.length > 1) t10Legend(slide, pal, sers.map((s, i) => ({ name: s.name, color: s.color ?? colors[i] })), MX + 0.5, y0 - 0.34);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 51. radial · 径向柱图（ember，玫瑰扇区）
//     angleRange 约定：0°=正东(3 点钟)，顺时针为正（与 SVG 一致）
// =====================================================================
function renderRadial(slide: PptxSlide, p: any): void {
  const pal = P('theme10_radial_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { name: string; value: number }[] = (Array.isArray(p.items) ? p.items : []).map((it: any, i: number) => ({ name: it?.name ?? `项 ${i + 1}`, value: Number(it?.value ?? 0) })).slice(0, 8);
  const n = Math.max(items.length, 1);
  const maxV = items.length ? Math.max(...items.map((it) => it.value), 1) : 1;
  const xL = MX + 0.5, xR = MX + CW - 0.5, yT = y0 + 0.2, yB = BOT - 0.35;
  const cx = (xL + xR) / 2, cy = (yT + yB) / 2, Rmax = (Math.min(xR - xL, yB - yT) / 2) * 0.9, rIn = Rmax * 0.2;
  const step = 360 / n, gap = Math.min(6, step * 0.18);
  const colors = series(pal);
  items.forEach((it, i) => {
    const f = it.value / (maxV || 1);
    const rOut = rIn + Math.max(f, 0.04) * (Rmax - rIn);
    const a0 = 270 + i * step + gap / 2;
    const sweep = step - gap;
    slide.addShape('pie', { x: cx - rOut, y: cy - rOut, w: 2 * rOut, h: 2 * rOut, fill: { color: colors[i % 6] }, angleRange: [a0, sweep] } as any);
  });
  slide.addShape('oval', { x: cx - rIn, y: cy - rIn, w: 2 * rIn, h: 2 * rIn, fill: { color: pal.bg } });
  items.forEach((it, i) => {
    const mid = ((270 + i * step + gap / 2 + (step - gap) / 2) * Math.PI) / 180;
    const lx = cx + (Rmax + 0.28) * Math.cos(mid), ly = cy + (Rmax + 0.28) * Math.sin(mid);
    txt(slide, it.name, { x: lx - 0.6, y: ly - 0.13, w: 1.2, h: 0.26, fontSize: 10, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
    txt(slide, t10Fmt(it.value), { x: lx - 0.6, y: ly + 0.14, w: 1.2, h: 0.24, fontSize: 10, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 52. heat · 热力图（aurora，行×列矩阵）
// =====================================================================
function renderHeat(slide: PptxSlide, p: any): void {
  const pal = P('theme10_heat_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const rows = t10NormCats(p.rows);
  const cols = t10NormCats(p.cols);
  const matrix: number[][] = (p.values ?? '').split(';').map((r: string) => r.split(',').map((x: string) => Number(x.trim())).filter((nn: number) => isFinite(nn)));
  const nR = Math.max(rows.length, matrix.length, 1);
  const nC = Math.max(cols.length, matrix[0]?.length ?? 1, 1);
  const flat = matrix.flat();
  const minV = flat.length ? Math.min(...flat) : 0;
  const maxV = flat.length ? Math.max(...flat, 1) : 1;
  const xL = MX + 1.3, xR = MX + CW - 0.2, yT = y0 + 0.5, yB = BOT - 0.25;
  const cellW = (xR - xL) / nC, cellH = (yB - yT) / nR;
  cols.forEach((c, j) => { if (c) txt(slide, c, { x: xL + j * cellW, y: yT - 0.2, w: cellW, h: 0.24, fontSize: 9, color: pal.ink2, align: 'center', fontFace: S.fonts.body }); });
  for (let i = 0; i < nR; i++) {
    if (rows[i]) txt(slide, rows[i], { x: xL - 0.1, y: yT + i * cellH + cellH / 2 - 0.12, w: 1.05, h: 0.24, fontSize: 9, color: pal.ink2, align: 'right', fontFace: S.fonts.body });
    for (let j = 0; j < nC; j++) {
      const v = (matrix[i] ?? [])[j] ?? 0;
      const t = (v - minV) / (maxV - minV || 1);
      const hex = t10MixHex('#4a7fd4', '#d9b977', t);
      const dark = t10Lum(hex) > 0.6;
      slide.addShape('rect', { x: xL + j * cellW + 0.02, y: yT + i * cellH + 0.02, w: cellW - 0.04, h: cellH - 0.04, fill: { color: hex } });
      txt(slide, t10Fmt(v), { x: xL + j * cellW, y: yT + i * cellH + cellH / 2 - 0.12, w: cellW, h: 0.24, fontSize: 9, bold: true, color: dark ? '#05070b' : pal.ink, align: 'center', fontFace: S.fonts.mono });
    }
  }
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 53. trend · 趋势图（aurora，面积+折线，PPTX 近似：折线+端点+末值）
// =====================================================================
function renderTrend(slide: PptxSlide, p: any): void {
  const pal = P('theme10_trend_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const sers: { name: string; values: number[]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({ name: sr?.name ?? `序列 ${i + 1}`, values: t10ParseVals(sr?.values), color: sr?.color }));
  const n = Math.max(...sers.map((s) => s.values.length), 1);
  const all = sers.flatMap((s) => s.values);
  const sc = t10Nice(all.length ? Math.min(...all, 0) : 0, all.length ? Math.max(...all, 1) : 1, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, sc);
  const xOf = (i: number) => x0 + (i / (n - 1 || 1)) * (x1 - x0);
  const yOf = (v: number) => plotBot - (v - sc.min) / (sc.max - sc.min || 1) * (plotBot - plotTop);
  const colors = series(pal);
  sers.forEach((s, si) => {
    const col = s.color ?? colors[si];
    const pts: [number, number][] = s.values.map((v, i) => [xOf(i), yOf(v)]);
    for (let i = 0; i < pts.length - 1; i++) t10Seg(slide, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], col, 2.4);
    s.values.forEach((_v, i) => { const [cx, cy] = pts[i]; slide.addShape('oval', { x: cx - 0.06, y: cy - 0.06, w: 0.12, h: 0.12, fill: { color: col } }); });
    const last = pts[pts.length - 1];
    txt(slide, t10Fmt(s.values[s.values.length - 1] ?? 0), { x: last[0] + 0.06, y: last[1] - 0.22, w: 0.9, h: 0.24, fontSize: 9, bold: true, color: col, align: 'left', fontFace: S.fonts.mono });
  });
  t10NormCats(p.categories).forEach((c, i) => { if (c) txt(slide, c, { x: xOf(i) - 0.5, y: plotBot + 0.04, w: 1.0, h: 0.24, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.body }); });
  if (sers.length > 1) t10Legend(slide, pal, sers.map((s, i) => ({ name: s.name, color: s.color ?? colors[i] })), x0, y0 - 0.34);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 54. range · 区间图（aurora，浮动带 + 中枢线）
// =====================================================================
function renderRange(slide: PptxSlide, p: any): void {
  const pal = P('theme10_range_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 1.0, x1 = MX + CW - 0.2, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const items: { label: string; low: number; high: number; mid?: number }[] = (Array.isArray(p.items) ? p.items : []).map((it: any, i: number) => ({ label: it?.label ?? `项 ${i + 1}`, low: Number(it?.low ?? 0), high: Number(it?.high ?? 0), mid: it?.mid === undefined ? undefined : Number(it?.mid) }));
  const n = Math.max(items.length, 1);
  const lo = Math.min(0, ...items.map((x) => x.low), ...items.map((x) => x.mid ?? 0));
  const hi = Math.max(1, ...items.map((x) => x.high), ...items.map((x) => x.mid ?? 0));
  const sc = t10Nice(lo, hi, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, sc);
  const yOf = (v: number) => plotBot - (v - sc.min) / (sc.max - sc.min || 1) * (plotBot - plotTop);
  const band = (x1 - x0) / n;
  const inner = Math.min(band * 0.5, 0.9);
  const colors = series(pal);
  items.forEach((it, i) => {
    const col = colors[i % 6];
    const cx = x0 + (i + 0.5) * band;
    const yH = yOf(it.high), yL = yOf(it.low), yM = yOf(it.mid ?? (it.low + it.high) / 2);
    slide.addShape('rect', { x: cx - inner / 2, y: yH, w: inner, h: Math.max(yL - yH, 0.02), fill: { color: col, transparency: 82 }, line: { color: col, width: 0.75, transparency: 50 } } as any);
    slide.addShape('line', { x: cx - inner / 2 - 0.12, y: yM, w: inner + 0.24, h: 0, line: { color: pal.ink, width: 1.5 } });
    slide.addShape('oval', { x: cx - 0.05, y: yM - 0.05, w: 0.1, h: 0.1, fill: { color: pal.ink } });
    txt(slide, t10Fmt(it.high), { x: cx + inner / 2 + 0.05, y: yH - 0.12, w: 0.8, h: 0.24, fontSize: 9, bold: true, color: col, align: 'left', fontFace: S.fonts.mono });
    txt(slide, t10Fmt(it.low), { x: cx + inner / 2 + 0.05, y: yL - 0.12, w: 0.8, h: 0.24, fontSize: 9, bold: true, color: col, align: 'left', fontFace: S.fonts.mono });
    txt(slide, it.label, { x: cx - 0.6, y: plotBot + 0.04, w: 1.2, h: 0.24, fontSize: 9, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 55. candlestick · K线图（obsidian，OHLC；红涨绿跌 A股惯例）
// =====================================================================
function renderCandlestick(slide: PptxSlide, p: any): void {
  const pal = P('theme10_candlestick_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 0.95, x1 = MX + CW - 0.15, plotTop = y0 + 0.05, plotBot = BOT - 0.4;
  const items: { open: number; high: number; low: number; close: number }[] = (Array.isArray(p.items) ? p.items : []).map((it: any) => ({ open: Number(it?.open ?? 0), high: Number(it?.high ?? 0), low: Number(it?.low ?? 0), close: Number(it?.close ?? 0) }));
  const n = Math.max(items.length, 1);
  const all = items.flatMap((x) => [x.open, x.high, x.low, x.close]);
  const sc = t10Nice(all.length ? Math.min(...all) : 0, all.length ? Math.max(...all, 1) : 1, 4);
  t10Grid(slide, pal, x0, x1, plotTop, plotBot, sc);
  const yOf = (v: number) => plotBot - (v - sc.min) / (sc.max - sc.min || 1) * (plotBot - plotTop);
  const band = (x1 - x0) / n;
  const inner = Math.min(band * 0.56, 0.5);
  const cats = t10NormCats(p.categories);
  items.forEach((it, i) => {
    const cx = x0 + (i + 0.5) * band;
    const up = it.close >= it.open;
    const col = up ? pal.green : pal.red;
    const yO = yOf(it.open), yC = yOf(it.close), yTop = Math.min(yO, yC), bodyH = Math.max(Math.abs(yC - yO), 0.03);
    slide.addShape('line', { x: cx, y: yOf(it.high), w: 0, h: yOf(it.low) - yOf(it.high), line: { color: col, width: 1.4 } });
    slide.addShape('rect', { x: cx - inner / 2, y: yTop, w: inner, h: bodyH, fill: { color: col } });
    if (cats[i]) txt(slide, cats[i], { x: cx - 0.6, y: plotBot + 0.04, w: 1.2, h: 0.24, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 56. ridgeline · 山脊线（aurora，叠加密度曲线，PPTX 近似：折线）
// =====================================================================
function renderRidgeline(slide: PptxSlide, p: any): void {
  const pal = P('theme10_ridgeline_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const x0 = MX + 1.1, x1 = MX + CW - 0.6, plotTop = y0 + 0.1, plotBot = BOT - 0.35;
  const sers: { name: string; values: number[]; color?: string }[] = (Array.isArray(p.series) ? p.series : []).map((sr: any, i: number) => ({ name: sr?.name ?? `序列 ${i + 1}`, values: t10ParseVals(sr?.values), color: sr?.color }));
  const m = Math.max(...sers.map((s) => s.values.length), 1);
  const k = Math.max(sers.length, 1);
  const dx = (x1 - x0) / (m - 1 || 1);
  const stepY = (plotBot - plotTop) / k;
  const amp = stepY * 0.62;
  const colors = series(pal);
  sers.forEach((s, si) => {
    const col = s.color ?? colors[si];
    const baseY = plotTop + (si + 0.5) * stepY;
    const maxV = Math.max(1, ...s.values);
    const xs = s.values.map((_v, j) => x0 + j * dx);
    const ys = s.values.map((v) => baseY - (v / maxV) * amp);
    for (let i = 0; i < ys.length - 1; i++) t10Seg(slide, xs[i], ys[i], xs[i + 1], ys[i + 1], col, 2.2);
    txt(slide, s.name, { x: x1 + 0.08, y: baseY - 0.12, w: 0.9, h: 0.24, fontSize: 9, bold: true, color: col, align: 'left', fontFace: S.fonts.body });
  });
  t10NormCats(p.axis).forEach((a, j) => { if (a) txt(slide, a, { x: x0 + j * dx - 0.5, y: plotBot + 0.04, w: 1.0, h: 0.24, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.body }); });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 57. calendar · 日历热力（ember，GitHub 式网格）
// =====================================================================
function renderCalendar(slide: PptxSlide, p: any): void {
  const pal = P('theme10_calendar_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const weeks = Math.max(1, (Number(p.weeks ?? 18) | 0));
  const flat = t10ParseVals(p.values);
  const cells = Array.from({ length: weeks * 7 }, (_u, i) => flat[i] ?? 0);
  const minV = cells.length ? Math.min(...cells) : 0;
  const maxV = cells.length ? Math.max(...cells, 1) : 1;
  const xL = MX + 1.3, xR = MX + CW - 0.2, yT = y0 + 0.5, yB = BOT - 0.45;
  const cellW = (xR - xL) / weeks, cellH = (yB - yT) / 7;
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const v = cells[w * 7 + d] ?? 0;
      const t = (v - minV) / (maxV - minV || 1);
      const hex = t10MixHex('#c97a52', '#d9b977', t);
      slide.addShape('rect', { x: xL + w * cellW + 0.02, y: yT + d * cellH + 0.02, w: cellW - 0.04, h: cellH - 0.04, fill: { color: hex } });
    }
  }
  footer(slide, p.folioLeft, p.folioRight, pal);
}

type T10RenderFn = (slide: PptxSlide, props: any) => void;

// =====================================================================
// 41. funnel · 漏斗图（aurora）
// =====================================================================
function renderFunnel(slide: PptxSlide, p: any): void {
  const pal = P('theme10_funnel_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; value: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `层 ${i + 1}`, value: Number(it?.value ?? 0) }));
  const n = Math.max(items.length, 1);
  const maxV = items.length ? Math.max(...items.map((it) => it.value), 1) : 1;
  const sumV = items.reduce((a: number, it: { value: number }) => a + it.value, 0) || 1;
  const cx = 5.0, xL = MX + 0.2, xR = MX + CW - 0.2, top = y0 + 0.12, bot = BOT - 0.3;
  const layerH = (bot - top) / n;
  const wOf = (v: number) => (v / maxV) * (xR - xL);
  const colors = series(pal);
  for (let i = 0; i < n; i++) {
    const it = items[i];
    const yTop = top + i * layerH, yBot = yTop + layerH - 0.06;
    const wTop = wOf(it.value), wBot = wOf(i < n - 1 ? items[i + 1].value : it.value);
    const wMid = Math.max((wTop + wBot) / 2, 0.1);
    const x = cx - wMid / 2;
    slide.addShape('rect', { x, y: yTop, w: wMid, h: yBot - yTop, fill: { color: colors[i % colors.length] } });
    const pct = ((it.value / sumV) * 100).toFixed(1);
    txt(slide, it.label, { x: cx - wMid / 2, y: yTop + (yBot - yTop) / 2 - 0.16, w: wMid, h: 0.26, fontSize: 11, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.body });
    txt(slide, String(it.value), { x: cx - wMid / 2, y: yTop + (yBot - yTop) / 2 + 0.04, w: wMid, h: 0.26, fontSize: 10, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
    txt(slide, pct + '%', { x: x + wMid + 0.1, y: yTop + (yBot - yTop) / 2 - 0.05, w: 0.9, h: 0.26, fontSize: 10, color: pal.ink2, align: 'left', fontFace: S.fonts.mono });
  }
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 42. gauge · 仪表盘（ember）
// =====================================================================
function renderGauge(slide: PptxSlide, p: any): void {
  const pal = P('theme10_gauge_v1', p);
  frame(slide, pal);
  t10Head(slide, p, pal, { size: 26 });
  const v = Math.max(0, Math.min(100, Number(p.value) || 0));
  const boxW = 3.4, cx = 5.0, boxY = 1.6, boxX = cx - boxW / 2;
  const ccx = cx, ccy = boxY + boxW / 2, R = boxW / 2;
  const ang = (a: number) => ((180 + 1.8 * a) * Math.PI) / 180;
  const ex = (a: number) => ccx + (R - 0.18) * Math.cos(ang(a));
  const ey = (a: number) => ccy + (R - 0.18) * Math.sin(ang(a));
  slide.addShape('pie', { x: boxX, y: boxY, w: boxW, h: boxW, fill: { color: pal.border }, angleRange: [180, 180] } as any);
  slide.addShape('pie', { x: boxX, y: boxY, w: boxW, h: boxW, fill: { color: pal.red }, angleRange: [180, 72] } as any);
  slide.addShape('pie', { x: boxX, y: boxY, w: boxW, h: boxW, fill: { color: pal.goldAmber }, angleRange: [252, 54] } as any);
  slide.addShape('pie', { x: boxX, y: boxY, w: boxW, h: boxW, fill: { color: pal.green }, angleRange: [306, 54] } as any);
  t10Seg(slide, ccx, ccy, ex(v), ey(v), pal.ink, 2.5);
  slide.addShape('oval', { x: ccx - 0.09, y: ccy - 0.09, w: 0.18, h: 0.18, fill: { color: pal.ink }, line: { color: pal.gold, width: 1.5 } });
  txt(slide, `${v}${p.unit || '%'}`, { x: cx - 1.0, y: ccy - 0.72, w: 2.0, h: 0.6, fontSize: 30, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
  if (p.gaugeLabel) txt(slide, p.gaugeLabel, { x: cx - 1.2, y: ccy + 0.36, w: 2.4, h: 0.3, fontSize: 11, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 43. bullet · 子弹图（aurora）
// =====================================================================
function renderBullet(slide: PptxSlide, p: any): void {
  const pal = P('theme10_bullet_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; value: number; target: number; range: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `指标 ${i + 1}`, value: Number(it?.value ?? 0), target: Number(it?.target ?? 0), range: Number(it?.range ?? 0) }));
  const n = Math.max(items.length, 1);
  const maxV = items.length ? Math.max(...items.flatMap((it) => [it.value, it.target, it.range].filter((x) => x > 0)), 1) : 1;
  const xL = MX + 1.6, xR = MX + CW - 0.2, top = y0 + 0.15, bot = BOT - 0.3;
  const rowH = (bot - top) / n;
  const xOf = (v: number) => xL + (v / maxV) * (xR - xL);
  for (let i = 0; i < n; i++) {
    const it = items[i], yc = top + i * rowH + rowH / 2;
    const trackH = rowH * 0.62, barH = rowH * 0.4;
    if (it.range > 0) slide.addShape('rect', { x: xL, y: yc - trackH / 2, w: Math.max(xOf(it.range) - xL, 0.02), h: trackH, fill: { color: pal.surfaceElevated } });
    slide.addShape('rect', { x: xL, y: yc - barH / 2, w: Math.max(xOf(it.value) - xL, 0.02), h: barH, fill: { color: pal.accent } });
    const tx = xOf(it.target);
    slide.addShape('line', { x: tx, y: yc - trackH / 2 - 0.02, w: 0, h: trackH + 0.04, line: { color: pal.gold, width: 2.5 } });
    txt(slide, it.label, { x: MX, y: yc - 0.13, w: 1.5, h: 0.26, fontSize: 10, color: pal.ink2, align: 'right', fontFace: S.fonts.body });
    txt(slide, String(it.value), { x: Math.min(xOf(it.value), xR) + 0.06, y: yc - 0.13, w: 1.0, h: 0.26, fontSize: 10, bold: true, color: pal.ink, align: 'left', fontFace: S.fonts.mono });
  }
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 44. box · 箱线图（obsidian）
// =====================================================================
function renderBox(slide: PptxSlide, p: any): void {
  const pal = P('theme10_box_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; min: number; q1: number; median: number; q3: number; max: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `组 ${i + 1}`, min: Number(it?.min ?? 0), q1: Number(it?.q1 ?? 0), median: Number(it?.median ?? 0), q3: Number(it?.q3 ?? 0), max: Number(it?.max ?? 0) }));
  const n = Math.max(items.length, 1);
  const allMin = items.length ? Math.min(...items.map((it) => it.min)) : 0;
  const allMax = items.length ? Math.max(...items.map((it) => it.max), 1) : 1;
  const sc = t10Nice(allMin, allMax, 4);
  const xL = MX + 1.6, xR = MX + CW - 0.2, top = y0 + 0.15, bot = BOT - 0.4;
  const xOf = (v: number) => xL + (v - sc.min) / (sc.max - sc.min || 1) * (xR - xL);
  for (const t of sc.ticks) {
    const x = xOf(t), zero = Math.abs(t) < 1e-9;
    slide.addShape('line', { x, y: top, w: 0, h: bot - top, line: { color: zero ? pal.borderStrong : pal.border, width: zero ? 1 : 0.75 } });
    txt(slide, t10Fmt(t), { x: x - 0.4, y: bot + 0.04, w: 0.8, h: 0.24, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  }
  const rowH = (bot - top) / n;
  for (let i = 0; i < n; i++) {
    const it = items[i], yc = top + i * rowH + rowH / 2, bandH = rowH * 0.42;
    const xMin = xOf(it.min), xMax = xOf(it.max), xQ1 = xOf(it.q1), xQ3 = xOf(it.q3), xMed = xOf(it.median);
    slide.addShape('line', { x: xMin, y: yc, w: xMax - xMin, h: 0, line: { color: pal.ink2, width: 1.5 } });
    slide.addShape('line', { x: xMin, y: yc - 0.06, w: 0, h: 0.12, line: { color: pal.ink2, width: 1.5 } });
    slide.addShape('line', { x: xMax, y: yc - 0.06, w: 0, h: 0.12, line: { color: pal.ink2, width: 1.5 } });
    slide.addShape('rect', { x: Math.min(xQ1, xQ3), y: yc - bandH / 2, w: Math.max(Math.abs(xQ3 - xQ1), 0.02), h: bandH, fill: { color: pal.accent, transparency: 78 }, line: { color: pal.accent, width: 1.2 } });
    slide.addShape('line', { x: xMed, y: yc - bandH / 2, w: 0, h: bandH, line: { color: pal.gold, width: 2.5 } });
    txt(slide, it.label, { x: MX, y: yc - 0.13, w: 1.5, h: 0.26, fontSize: 10, color: pal.ink2, align: 'right', fontFace: S.fonts.body });
  }
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// =====================================================================
// 45. treemap · 矩形树图（aurora）
// =====================================================================
interface T10TRect { x: number; y: number; w: number; h: number; }
function t10Squarify(items: { value: number }[], X: number, Y: number, W: number, H: number): T10TRect[] {
  const total = items.reduce((s, it) => s + Math.max(it.value, 0), 0) || 1;
  const totalArea = W * H;
  const data = items.map((it, idx) => ({ idx, area: Math.max(it.value, 0) / total * totalArea })).sort((a, b) => b.area - a.area);
  const out: T10TRect[] = new Array(items.length);
  let x = X, y = Y, w = W, h = H, i = 0, row: { idx: number; area: number }[] = [];
  const sumA = (r: { area: number }[]) => r.reduce((s, a) => s + a.area, 0);
  const worst = (r: { area: number }[], side: number) => {
    let mx = 0, mn = Infinity;
    for (const a of r) { mx = Math.max(mx, a.area); mn = Math.min(mn, a.area); }
    const s = sumA(r), s2 = s * s, side2 = side * side;
    return Math.max((side2 * mx) / s2, s2 / (side2 * mn));
  };
  const placeRow = (r: { area: number; idx: number }[]) => {
    const s = sumA(r);
    if (w >= h) {
      const colW = s / h; let cy = y;
      for (const a of r) { const ih = a.area / colW; out[a.idx] = { x, y: cy, w: colW, h: ih }; cy += ih; }
      x += colW; w -= colW;
    } else {
      const bandH = s / w; let cx = x;
      for (const a of r) { const iw = a.area / bandH; out[a.idx] = { x: cx, y, w: iw, h: bandH }; cx += iw; }
      y += bandH; h -= bandH;
    }
  };
  while (i < data.length) {
    const next = [...row, data[i]];
    const side = Math.min(w, h);
    if (row.length === 0 || worst(next, side) <= worst(row, side)) { row = next; i++; continue; }
    placeRow(row); row = [];
  }
  if (row.length) placeRow(row);
  return out;
}
function renderTreemap(slide: PptxSlide, p: any): void {
  const pal = P('theme10_treemap_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; value: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `区块 ${i + 1}`, value: Number(it?.value ?? 0) }));
  const xL = MX + 0.1, xR = MX + CW - 0.1, top = y0 + 0.12, bot = BOT - 0.3;
  const rects = t10Squarify(items, xL, top, xR - xL, bot - top);
  const colors = series(pal);
  items.forEach((it, i) => {
    const r = rects[i];
    if (!r || r.w < 0.02 || r.h < 0.02) return;
    slide.addShape('rect', { x: r.x + 0.02, y: r.y + 0.02, w: Math.max(r.w - 0.04, 0.02), h: Math.max(r.h - 0.04, 0.02), fill: { color: colors[i % colors.length] }, line: { color: pal.ink, width: 0.75 } });
    if (r.w > 0.7 && r.h > 0.34) {
      txt(slide, it.label, { x: r.x + 0.1, y: r.y + 0.1, w: r.w - 0.2, h: 0.26, fontSize: 11, bold: true, color: pal.ink, align: 'left', fontFace: S.fonts.body });
      txt(slide, String(it.value), { x: r.x + 0.1, y: r.y + 0.34, w: r.w - 0.2, h: 0.26, fontSize: 10, color: pal.ink, align: 'left', fontFace: S.fonts.mono });
    }
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// ────────────────────────────────────────────────────────────────
// P2 数据图表 · 批次K（关系与构成进阶 5 版式）
// sankey / dumbbell / histogram / slope / waffle
// ────────────────────────────────────────────────────────────────
function renderSankey(slide: PptxSlide, p: any): void {
  const pal = P('theme10_sankey_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const links: { from: string; to: string; value: number }[] = (Array.isArray(p.links) ? p.links : [])
    .map((l: any) => ({ from: String(l?.from ?? ''), to: String(l?.to ?? ''), value: Number(l?.value ?? 0) }));
  const sources = [...new Set(links.map((l) => l.from))].filter(Boolean);
  const targets = [...new Set(links.map((l) => l.to))].filter(Boolean);
  const srcOut: Record<string, number> = {}, tgtIn: Record<string, number> = {};
  links.forEach((l) => { srcOut[l.from] = (srcOut[l.from] ?? 0) + l.value; tgtIn[l.to] = (tgtIn[l.to] ?? 0) + l.value; });
  const colors = series(pal);
  const srcColor = (k: string) => colors[sources.indexOf(k) % colors.length];
  const tgtColor = (k: string) => colors[(targets.indexOf(k) + 3) % colors.length];
  const leftX = MX + 0.1, rightX = MX + CW - 0.1;
  const top = y0 + 0.18, bot = BOT - 0.3;
  const H = bot - top, nodeW = 0.18;
  const srcScale = (H * 0.92) / (sources.reduce((a, k) => a + srcOut[k], 0) || 1);
  const tgtScale = (H * 0.92) / (targets.reduce((a, k) => a + tgtIn[k], 0) || 1);
  const srcY: Record<string, number> = {}, srcNodeH: Record<string, number> = {};
  let cy = top; const sgap = sources.length > 1 ? (H * 0.08) / (sources.length - 1) : 0;
  sources.forEach((k) => { const h = srcOut[k] * srcScale; srcNodeH[k] = h; srcY[k] = cy; cy += h + sgap; });
  const tgtY: Record<string, number> = {}, tgtNodeH: Record<string, number> = {};
  cy = top; const tgap = targets.length > 1 ? (H * 0.08) / (targets.length - 1) : 0;
  targets.forEach((k) => { const h = tgtIn[k] * tgtScale; tgtNodeH[k] = h; tgtY[k] = cy; cy += h + tgap; });
  const bandX0 = leftX + nodeW, bandX1 = rightX - nodeW;
  links.forEach((l) => {
    const ys = srcY[l.from], ye = tgtY[l.to];
    const my = (ys + ye) / 2;
    const thk = Math.max(0.05, ((l.value * srcScale) + (l.value * tgtScale)) * 0.5);
    slide.addShape('rect', { x: bandX0, y: my - thk / 2, w: bandX1 - bandX0, h: thk, fill: { color: srcColor(l.from), transparency: 58 } } as any);
  });
  sources.forEach((k) => {
    slide.addShape('rect', { x: leftX, y: srcY[k], w: nodeW, h: Math.max(srcNodeH[k], 0.03), fill: { color: srcColor(k) } });
    txt(slide, k, { x: leftX - 1.45, y: srcY[k] + srcNodeH[k] / 2 - 0.13, w: 1.35, h: 0.26, fontSize: 10, color: pal.ink2, align: 'right', fontFace: S.fonts.body });
  });
  targets.forEach((k) => {
    slide.addShape('rect', { x: rightX - nodeW, y: tgtY[k], w: nodeW, h: Math.max(tgtNodeH[k], 0.03), fill: { color: tgtColor(k) } });
    txt(slide, k, { x: rightX + 0.05, y: tgtY[k] + tgtNodeH[k] / 2 - 0.13, w: 1.45, h: 0.26, fontSize: 10, color: pal.ink2, align: 'left', fontFace: S.fonts.body });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderDumbbell(slide: PptxSlide, p: any): void {
  const pal = P('theme10_dumbbell_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; start: number; end: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `项 ${i + 1}`, start: Number(it?.start ?? 0), end: Number(it?.end ?? 0) }));
  const all = items.flatMap((it) => [it.start, it.end]);
  const min = all.length ? Math.min(...all, 0) : 0;
  const max = all.length ? Math.max(...all, 1) : 1;
  const sc = t10Nice(min, max, 5);
  const labelW = 1.5, x0 = MX + labelW, x1 = MX + CW;
  const top = y0 + 0.22, bot = BOT - 0.3;
  const xOf = (v: number) => x0 + (v - sc.min) / (sc.max - sc.min || 1) * (x1 - x0);
  const colors = series(pal), blue = colors[0], amber = colors[2];
  sc.ticks.forEach((t) => {
    const x = xOf(t), zero = Math.abs(t) < 1e-9;
    slide.addShape('line', { x, y: top - 0.1, w: 0, h: bot - top + 0.2, line: { color: zero ? pal.borderStrong : pal.border, width: zero ? 1.4 : 0.75 } } as any);
    txt(slide, t10Fmt(t), { x: x - 0.45, y: bot + 0.06, w: 0.9, h: 0.26, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  });
  const n = Math.max(items.length, 1), rowH = (bot - top) / n;
  items.forEach((it, i) => {
    const y = top + rowH * (i + 0.5);
    const xs = xOf(it.start), xe = xOf(it.end), up = it.end >= it.start;
    const col = up ? blue : amber;
    t10Seg(slide, xs, y, xe, y, col, 3);
    slide.addShape('oval', { x: xs - 0.09, y: y - 0.09, w: 0.18, h: 0.18, fill: { color: amber } });
    slide.addShape('oval', { x: xe - 0.09, y: y - 0.09, w: 0.18, h: 0.18, fill: { color: blue } });
    txt(slide, it.label, { x: MX, y: y - 0.13, w: labelW - 0.12, h: 0.26, fontSize: 11, color: pal.ink2, align: 'right', fontFace: S.fonts.body });
    txt(slide, t10Fmt(it.start), { x: xs - 0.6, y: y - 0.4, w: 0.6, h: 0.26, fontSize: 10, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
    txt(slide, t10Fmt(it.end), { x: xe - 0.6, y: y - 0.4, w: 0.6, h: 0.26, fontSize: 10, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
  });
  if (p.startLabel) txt(slide, '● ' + p.startLabel, { x: x0, y: top - 0.34, w: 2, h: 0.26, fontSize: 11, color: amber, align: 'left', fontFace: S.fonts.body });
  if (p.endLabel) txt(slide, '● ' + p.endLabel, { x: x1, y: top - 0.34, w: 2, h: 0.26, fontSize: 11, color: blue, align: 'right', fontFace: S.fonts.body });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderHistogram(slide: PptxSlide, p: any): void {
  const pal = P('theme10_histogram_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; value: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `箱 ${i + 1}`, value: Number(it?.value ?? 0) }));
  const max = items.length ? Math.max(...items.map((it) => it.value), 1) : 1;
  const sc = t10Nice(0, max, 4);
  const x0 = MX + 0.1, x1 = MX + CW - 0.1;
  const top = y0 + 0.2, bot = BOT - 0.4;
  t10Grid(slide, pal, x0, x1, top, bot, sc);
  const n = Math.max(items.length, 1), band = (x1 - x0) / n, bw = band * 0.86;
  const yOf = (v: number) => bot - (v - sc.min) / (sc.max - sc.min || 1) * (bot - top);
  const colors = series(pal);
  items.forEach((it, i) => {
    const bx = x0 + i * band + (band - bw) / 2;
    const topY = yOf(it.value), h = Math.max(bot - topY, 0.02);
    slide.addShape('rect', { x: bx, y: topY, w: bw, h, fill: { color: colors[i % colors.length], transparency: 12 } } as any);
    txt(slide, t10Fmt(it.value), { x: bx, y: topY - 0.3, w: bw, h: 0.26, fontSize: 9, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
    txt(slide, it.label, { x: bx - band * 0.25, y: bot + 0.06, w: band * 1.5, h: 0.26, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
  });
  if (p.xLabel) txt(slide, p.xLabel, { x: (x0 + x1) / 2 - 1, y: bot + 0.34, w: 2, h: 0.26, fontSize: 10, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderSlope(slide: PptxSlide, p: any): void {
  const pal = P('theme10_slope_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; before: number; after: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `项 ${i + 1}`, before: Number(it?.before ?? 0), after: Number(it?.after ?? 0) }));
  const all = items.flatMap((it) => [it.before, it.after]);
  const min = all.length ? Math.min(...all, 0) : 0;
  const max = all.length ? Math.max(...all, 1) : 1;
  const sc = t10Nice(min, max, 4);
  const leftX = MX + 1.7, rightX = MX + CW - 1.7;
  const top = y0 + 0.32, bot = BOT - 0.3;
  const yOf = (v: number) => bot - (v - sc.min) / (sc.max - sc.min || 1) * (bot - top);
  const colors = series(pal), blue = colors[0], amber = colors[2];
  for (const t of sc.ticks) {
    const y = yOf(t), zero = Math.abs(t) < 1e-9;
    slide.addShape('line', { x: leftX - 0.4, y, w: rightX - leftX + 0.8, h: 0, line: { color: zero ? pal.borderStrong : pal.border, width: zero ? 1 : 0.75 } });
    txt(slide, t10Fmt(t), { x: leftX - 1.5, y: y - 0.13, w: 1.0, h: 0.26, fontSize: 9, color: pal.ink3, align: 'right', fontFace: S.fonts.mono });
  }
  slide.addShape('line', { x: leftX, y: top - 0.1, w: 0, h: bot - top + 0.2, line: { color: pal.borderStrong, width: 1.2 } } as any);
  slide.addShape('line', { x: rightX, y: top - 0.1, w: 0, h: bot - top + 0.2, line: { color: pal.borderStrong, width: 1.2 } } as any);
  const n = Math.max(items.length, 1), rowH = (bot - top) / n;
  items.forEach((it, i) => {
    const yb = yOf(it.before), ya = yOf(it.after), up = it.after >= it.before, col = up ? blue : amber;
    const my = top + rowH * (i + 0.5);
    t10Seg(slide, leftX, yb, rightX, ya, col, 2.6);
    slide.addShape('oval', { x: leftX - 0.08, y: yb - 0.08, w: 0.16, h: 0.16, fill: { color: col } });
    slide.addShape('oval', { x: rightX - 0.08, y: ya - 0.08, w: 0.16, h: 0.16, fill: { color: col } });
    txt(slide, it.label, { x: (leftX + rightX) / 2 - 1, y: my - 0.13, w: 2, h: 0.26, fontSize: 10, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
    txt(slide, t10Fmt(it.before), { x: leftX - 0.7, y: yb - 0.13, w: 0.6, h: 0.26, fontSize: 9, color: pal.ink, align: 'right', fontFace: S.fonts.mono });
    txt(slide, t10Fmt(it.after), { x: rightX + 0.1, y: ya - 0.13, w: 0.6, h: 0.26, fontSize: 9, color: pal.ink, align: 'left', fontFace: S.fonts.mono });
  });
  if (p.beforeLabel) txt(slide, p.beforeLabel, { x: leftX - 1, y: top - 0.36, w: 2, h: 0.26, fontSize: 11, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  if (p.afterLabel) txt(slide, p.afterLabel, { x: rightX - 1, y: top - 0.36, w: 2, h: 0.26, fontSize: 11, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderWaffle(slide: PptxSlide, p: any): void {
  const pal = P('theme10_waffle_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; value: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `项 ${i + 1}`, value: Number(it?.value ?? 0) }));
  const total = items.reduce((a, it) => a + it.value, 0) || 1;
  let counts = items.map((it) => Math.round((it.value / total) * 100));
  const diff = 100 - counts.reduce((a, b) => a + b, 0);
  if (diff !== 0 && counts.length) { const mi = counts.indexOf(Math.max(...counts)); counts[mi] += diff; }
  const colors = series(pal);
  const cols = 10, rows = 10, cell = 0.22, gap = 0.03;
  const ox = MX + 0.2, oy = y0 + 0.25;
  let filled = 0, ci = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let color: string, empty = false;
      if (ci < items.length && filled < counts[ci]) { color = colors[ci % colors.length]; filled++; if (filled >= counts[ci]) { ci++; filled = 0; } }
      else { color = pal.ink3; empty = true; }
      slide.addShape('rect', { x: ox + c * (cell + gap), y: oy + r * (cell + gap), w: cell, h: cell, fill: { color, transparency: empty ? 88 : 8 } } as any);
    }
  }
  const lx = ox + cols * cell + (cols - 1) * gap + 0.45;
  let ly = oy + 0.08;
  items.forEach((it, i) => {
    slide.addShape('rect', { x: lx, y: ly + 0.02, w: 0.16, h: 0.16, fill: { color: colors[i % colors.length] } });
    txt(slide, `${it.label}  ${Math.round((it.value / total) * 100)}%`, { x: lx + 0.26, y: ly - 0.04, w: 2.6, h: 0.26, fontSize: 11, color: pal.ink2, align: 'left', fontFace: S.fonts.body });
    ly += 0.44;
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// ────────────────────────────────────────────────────────────────
// P2 数据图表 · 批次L（时序与分布 5 版式）
// gantt / bump / rose / dotplot / timeline
// ────────────────────────────────────────────────────────────────
function renderGantt(slide: PptxSlide, p: any): void {
  const pal = P('theme10_gantt_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const tasks: { name: string; start: number; end: number }[] = (Array.isArray(p.tasks) ? p.tasks : [])
    .map((t: any, i: number) => ({ name: t?.name ?? `任务 ${i + 1}`, start: Number(t?.start ?? 0), end: Number(t?.end ?? 0) }));
  const maxWeek = Math.max(1, ...tasks.map((t) => t.end), ...tasks.map((t) => t.start));
  const labelW = 1.5, x0 = MX + labelW, x1 = MX + CW - 0.1;
  const top = y0 + 0.2, bot = BOT - 0.3;
  const xOf = (v: number) => x0 + (v / (maxWeek || 1)) * (x1 - x0);
  const colors = series(pal);
  for (let w = 0; w <= maxWeek; w++) {
    const x = xOf(w);
    slide.addShape('line', { x, y: top - 0.1, w: 0, h: bot - top + 0.2, line: { color: w === 0 ? pal.borderStrong : pal.border, width: w === 0 ? 1.4 : 0.75 } } as any);
    txt(slide, 'W' + w, { x: x - 0.3, y: bot + 0.04, w: 0.6, h: 0.26, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  }
  const n = Math.max(tasks.length, 1), rowH = (bot - top) / n;
  tasks.forEach((t, i) => {
    const y = top + rowH * (i + 0.5);
    const xs = xOf(t.start), xe = xOf(t.end), bw = Math.max(xe - xs, 0.06);
    slide.addShape('rect', { x: xs, y: y - rowH * 0.3, w: bw, h: rowH * 0.6, fill: { color: colors[i % colors.length] } });
    txt(slide, t.name, { x: MX, y: y - 0.13, w: labelW - 0.12, h: 0.26, fontSize: 11, color: pal.ink2, align: 'right', fontFace: S.fonts.body });
    txt(slide, String(t.end - t.start) + 'w', { x: xe + 0.08, y: y - 0.13, w: 0.8, h: 0.26, fontSize: 9, color: pal.ink, align: 'left', fontFace: S.fonts.mono });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderBump(slide: PptxSlide, p: any): void {
  const pal = P('theme10_bump_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const labels = (Array.isArray(p.periodLabels) ? p.periodLabels : []).map(String);
  const items: { name: string; ranks: number[] }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ name: it?.name ?? `项 ${i + 1}`, ranks: [Number(it?.r1 ?? 0), Number(it?.r2 ?? 0), Number(it?.r3 ?? 0), Number(it?.r4 ?? 0)] }));
  const cols = 4;
  const allR = items.flatMap((it) => it.ranks).filter((r) => r > 0);
  const maxRank = Math.max(1, ...allR);
  const x0 = MX + 0.7, x1 = MX + CW - 0.7, top = y0 + 0.25, bot = BOT - 0.3;
  const colX = (c: number) => x0 + (c / (cols - 1)) * (x1 - x0);
  const yOf = (r: number) => top + ((r - 1) / (maxRank - 1 || 1)) * (bot - top);
  const colors = series(pal);
  for (let r = 1; r <= maxRank; r++) {
    const y = yOf(r);
    slide.addShape('line', { x: x0, y, w: x1 - x0, h: 0, line: { color: r === 1 ? pal.borderStrong : pal.border, width: r === 1 ? 1.3 : 0.75 } });
    txt(slide, '#' + r, { x: MX - 0.05, y: y - 0.13, w: 0.6, h: 0.26, fontSize: 9, color: pal.ink3, align: 'right', fontFace: S.fonts.mono });
  }
  labels.forEach((lab: string, c: number) => txt(slide, lab, { x: colX(c) - 0.6, y: top - 0.34, w: 1.2, h: 0.26, fontSize: 11, color: pal.ink2, align: 'center', fontFace: S.fonts.body }));
  items.forEach((it, i) => {
    const col = colors[i % colors.length];
    const pts = it.ranks.map((r, c) => ({ x: colX(c), y: yOf(r) }));
    for (let c = 0; c < pts.length - 1; c++) t10Seg(slide, pts[c].x, pts[c].y, pts[c + 1].x, pts[c + 1].y, col, 3);
    pts.forEach((pt) => { slide.addShape('oval', { x: pt.x - 0.09, y: pt.y - 0.09, w: 0.18, h: 0.18, fill: { color: col }, line: { color: pal.ink, width: 1 } } as any); });
    txt(slide, it.name, { x: x1 + 0.1, y: pts[pts.length - 1].y - 0.13, w: 1.4, h: 0.26, fontSize: 10, color: pal.ink2, align: 'left', fontFace: S.fonts.body });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderRose(slide: PptxSlide, p: any): void {
  const pal = P('theme10_rose_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; value: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `项 ${i + 1}`, value: Number(it?.value ?? 0) }));
  const n = Math.max(items.length, 1);
  const maxV = Math.max(1, ...items.map((it) => it.value));
  const cx = 5, cy = (y0 + BOT) / 2 + 0.2, rMax = 1.75;
  const sweep = 360 / n;
  const colors = series(pal);
  items.forEach((it, i) => {
    const r = Math.max(rMax * Math.sqrt(it.value / maxV), 0.18);
    const a0 = i * sweep;
    slide.addShape('pie', { x: cx - r, y: cy - r, w: r * 2, h: r * 2, fill: { color: colors[i % colors.length] }, angleRange: [a0, sweep], line: { color: pal.bg, width: 1.5 } } as any);
  });
  items.forEach((it, i) => {
    const a = i * sweep + sweep / 2;
    const lx = cx + (rMax + 0.25) * Math.sin((a * Math.PI) / 180);
    const ly = cy - (rMax + 0.25) * Math.cos((a * Math.PI) / 180);
    txt(slide, `${it.label} ${t10Fmt(it.value)}`, { x: lx - 1, y: ly - 0.13, w: 2, h: 0.26, fontSize: 10, color: pal.ink2, align: (a > 90 && a < 270) ? 'right' : 'left', fontFace: S.fonts.body });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderDotplot(slide: PptxSlide, p: any): void {
  const pal = P('theme10_dotplot_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; value: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `项 ${i + 1}`, value: Number(it?.value ?? 0) }));
  const all = items.map((it) => it.value);
  const min = all.length ? Math.min(...all, 0) : 0;
  const max = all.length ? Math.max(...all, 1) : 1;
  const sc = t10Nice(min, max, 5);
  const labelW = 1.3, x0 = MX + labelW, x1 = MX + CW - 0.1;
  const top = y0 + 0.2, bot = BOT - 0.3;
  const xOf = (v: number) => x0 + (v - sc.min) / (sc.max - sc.min || 1) * (x1 - x0);
  const colors = series(pal);
  for (const t of sc.ticks) {
    const x = xOf(t), zero = Math.abs(t) < 1e-9;
    slide.addShape('line', { x, y: top - 0.1, w: 0, h: bot - top + 0.2, line: { color: zero ? pal.borderStrong : pal.border, width: zero ? 1.4 : 0.75 } } as any);
    txt(slide, t10Fmt(t), { x: x - 0.45, y: bot + 0.04, w: 0.9, h: 0.26, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  }
  const n = Math.max(items.length, 1), rowH = (bot - top) / n;
  items.forEach((it, i) => {
    const y = top + rowH * (i + 0.5), x = xOf(it.value);
    slide.addShape('line', { x: x0, y, w: x - x0, h: 0, line: { color: pal.border, width: 0.75, dashType: 'dash' } } as any);
    slide.addShape('oval', { x: x - 0.11, y: y - 0.11, w: 0.22, h: 0.22, fill: { color: colors[i % colors.length] }, line: { color: pal.ink, width: 1 } } as any);
    txt(slide, it.label, { x: MX, y: y - 0.13, w: labelW - 0.12, h: 0.26, fontSize: 11, color: pal.ink2, align: 'right', fontFace: S.fonts.body });
    txt(slide, t10Fmt(it.value), { x: x + 0.16, y: y - 0.13, w: 0.9, h: 0.26, fontSize: 10, color: pal.ink, align: 'left', fontFace: S.fonts.mono });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderTimeline(slide: PptxSlide, p: any): void {
  const pal = P('theme10_timeline_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const events: { year: string; text: string }[] = (Array.isArray(p.events) ? p.events : [])
    .map((ev: any) => ({ year: String(ev?.year ?? ''), text: String(ev?.text ?? '') }));
  const n = Math.max(events.length, 1);
  const x0 = MX + 0.7, x1 = MX + CW - 0.7;
  const axisY = (y0 + BOT) / 2 + 0.25;
  const xOf = (i: number) => (n === 1 ? (x0 + x1) / 2 : x0 + (i / (n - 1)) * (x1 - x0));
  slide.addShape('line', { x: x0, y: axisY, w: x1 - x0, h: 0, line: { color: pal.gold, width: 2.4 } });
  events.forEach((ev, i) => {
    const x = xOf(i), up = i % 2 === 0;
    const ty = up ? axisY - 1.0 : axisY + 0.55;
    const my = up ? axisY - 0.32 : axisY + 0.32;
    slide.addShape('line', { x, y: up ? axisY - 0.32 : axisY, w: 0, h: 0.32, line: { color: pal.gold, width: 1.2 } } as any);
    slide.addShape('oval', { x: x - 0.11, y: axisY - 0.11, w: 0.22, h: 0.22, fill: { color: pal.gold }, line: { color: pal.ink, width: 1.4 } } as any);
    txt(slide, ev.year, { x: x - 0.8, y: ty, w: 1.6, h: 0.3, fontSize: 13, bold: true, color: pal.gold, align: 'center', fontFace: S.fonts.mono });
    txt(slide, ev.text, { x: x - 1.2, y: my + (up ? -0.28 : 0.05), w: 2.4, h: 0.5, fontSize: 11, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// ────────────────────────────────────────────────────────────────
// P2 数据图表 · 批次M（结构与关系 5 版式）
// orgchart / parallel / circlepack / cscatter / marimekko
// ────────────────────────────────────────────────────────────────
function renderOrgChart(slide: PptxSlide, p: any): void {
  const pal = P('theme10_orgchart_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const kids: { name: string; role: string }[] = (Array.isArray(p.children) ? p.children : [])
    .map((c: any) => ({ name: c?.name ?? '', role: String(c?.role ?? '') }));
  const n = Math.max(kids.length, 1);
  const rw = 2.3, rh = 0.78, rx = 5 - rw / 2, ry = y0 + 0.2;
  const cw = 1.78, ch = 0.84, gap = 0.28;
  const totW = n * cw + (n - 1) * gap;
  const startX = 5 - totW / 2;
  const cy = y0 + 2.0;
  const rootBottom = ry + rh, cx = 5, midY = rootBottom + (cy - rootBottom) / 2;
  const colors = series(pal);
  kids.forEach((k, i) => {
    const kx = startX + i * (cw + gap), kMidX = kx + cw / 2, kTop = cy;
    slide.addShape('line', { x: cx, y: rootBottom, w: 0, h: midY - rootBottom, line: { color: pal.borderStrong, width: 1.4 } } as any);
    slide.addShape('line', { x: Math.min(cx, kMidX), y: midY, w: Math.abs(kMidX - cx), h: 0, line: { color: pal.borderStrong, width: 1.4 } } as any);
    slide.addShape('line', { x: kMidX, y: midY, w: 0, h: kTop - midY, line: { color: pal.borderStrong, width: 1.4 } } as any);
    slide.addShape('rect', { x: kx, y: kTop, w: cw, h: ch, fill: { color: colors[i % colors.length], transparency: 84 }, line: { color: colors[i % colors.length], width: 1.4 } } as any);
    txt(slide, k.name, { x: kx + 0.05, y: kTop + 0.16, w: cw - 0.1, h: 0.3, fontSize: 12, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.body });
    if (k.role) txt(slide, k.role, { x: kx + 0.05, y: kTop + 0.46, w: cw - 0.1, h: 0.3, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
  });
  slide.addShape('rect', { x: rx, y: ry, w: rw, h: rh, fill: { color: pal.accent, transparency: 78 }, line: { color: pal.accent, width: 2 } } as any);
  txt(slide, String(p.rootName ?? '根'), { x: rx + 0.05, y: ry + 0.18, w: rw - 0.1, h: 0.3, fontSize: 13, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.body });
  if (p.rootRole) txt(slide, String(p.rootRole), { x: rx + 0.05, y: ry + 0.46, w: rw - 0.1, h: 0.3, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderParallel(slide: PptxSlide, p: any): void {
  const pal = P('theme10_parallel_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const ax = (Array.isArray(p.axes) ? p.axes : []).map(String);
  const m = Math.max(ax.length, 1);
  const items: { name: string; vals: number[] }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ name: it?.name ?? `项 ${i + 1}`, vals: [Number(it?.v1 ?? 0), Number(it?.v2 ?? 0), Number(it?.v3 ?? 0)].slice(0, m) }));
  const x0 = MX + 0.8, x1 = MX + CW - 0.8, top = y0 + 0.3, bot = BOT - 0.3;
  const axisX = (c: number) => (m === 1 ? (x0 + x1) / 2 : x0 + (c / (m - 1)) * (x1 - x0));
  const colors = series(pal);
  for (let c = 0; c < m; c++) {
    slide.addShape('line', { x: axisX(c), y: top, w: 0, h: bot - top, line: { color: pal.borderStrong, width: 1.4 } } as any);
    txt(slide, ax[c] ?? `轴${c + 1}`, { x: axisX(c) - 0.8, y: top - 0.34, w: 1.6, h: 0.26, fontSize: 11, color: pal.ink2, align: 'center', fontFace: S.fonts.body });
  }
  items.forEach((it, i) => {
    const col = colors[i % colors.length];
    const pts = it.vals.map((v, c) => {
      const col2 = items.map((q) => q.vals[c]);
      const min = Math.min(...col2, v), max = Math.max(...col2, v), span = max - min || 1;
      return { x: axisX(c), y: bot - ((v - min) / span) * (bot - top) };
    });
    for (let c = 0; c < pts.length - 1; c++) t10Seg(slide, pts[c].x, pts[c].y, pts[c + 1].x, pts[c + 1].y, col, 2.6);
    pts.forEach((pt) => { slide.addShape('oval', { x: pt.x - 0.08, y: pt.y - 0.08, w: 0.16, h: 0.16, fill: { color: col }, line: { color: pal.ink, width: 1 } } as any); });
    txt(slide, it.name, { x: pts[pts.length - 1].x + 0.12, y: pts[pts.length - 1].y - 0.13, w: 1.4, h: 0.26, fontSize: 10, color: pal.ink2, align: 'left', fontFace: S.fonts.body });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderCirclepack(slide: PptxSlide, p: any): void {
  const pal = P('theme10_circlepack_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; value: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `项 ${i + 1}`, value: Number(it?.value ?? 0) }))
    .sort((a: { label: string; value: number }, b: { label: string; value: number }) => b.value - a.value);
  const cx = 5, cy = (y0 + BOT) / 2 + 0.2, rMax = 1.55;
  const total = items.reduce((a, it) => a + Math.sqrt(it.value), 0) || 1;
  const colors = series(pal);
  items.forEach((it, i) => {
    const rr = Math.max((Math.sqrt(it.value) / total) * rMax, 0.18);
    const ang = (i / Math.max(items.length, 1)) * Math.PI * 2;
    const ring = items.length > 1 ? rMax * 0.6 + rr : 0;
    const px = i === 0 ? cx : cx + ring * Math.cos(ang);
    const py = i === 0 ? cy : cy + ring * Math.sin(ang);
    slide.addShape('oval', { x: px - rr, y: py - rr, w: rr * 2, h: rr * 2, fill: { color: colors[i % colors.length], transparency: 8 }, line: { color: pal.ink, width: 1.2 } } as any);
    if (rr > 0.28) {
      txt(slide, it.label, { x: px - rr, y: py - 0.14, w: rr * 2, h: 0.28, fontSize: 10, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.body });
      txt(slide, t10Fmt(it.value), { x: px - rr, y: py + 0.16, w: rr * 2, h: 0.28, fontSize: 9, color: pal.ink2, align: 'center', fontFace: S.fonts.mono });
    }
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderCscatter(slide: PptxSlide, p: any): void {
  const pal = P('theme10_cscatter_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const pts: { x: number; y: number; label: string }[] = (Array.isArray(p.points) ? p.points : [])
    .map((q: any, i: number) => ({ x: Number(q?.x ?? 0), y: Number(q?.y ?? 0), label: String(q?.label ?? `点 ${i + 1}`) }));
  const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y);
  const scx = t10Nice(Math.min(...xs, 0), Math.max(...xs, 1), 4);
  const scy = t10Nice(Math.min(...ys, 0), Math.max(...ys, 1), 4);
  const x0 = MX + 0.8, x1 = MX + CW - 0.3, top = y0 + 0.2, bot = BOT - 0.4;
  const xOf = (v: number) => x0 + (v - scx.min) / (scx.max - scx.min || 1) * (x1 - x0);
  const yOf = (v: number) => bot - (v - scy.min) / (scy.max - scy.min || 1) * (bot - top);
  const colors = series(pal);
  for (const t of scx.ticks) {
    const x = xOf(t);
    slide.addShape('line', { x, y: top, w: 0, h: bot - top, line: { color: t === 0 ? pal.borderStrong : pal.border, width: t === 0 ? 1.4 : 0.75 } } as any);
    txt(slide, t10Fmt(t), { x: x - 0.4, y: bot + 0.04, w: 0.8, h: 0.26, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono });
  }
  for (const t of scy.ticks) {
    const y = yOf(t);
    slide.addShape('line', { x: x0, y, w: x1 - x0, h: 0, line: { color: t === 0 ? pal.borderStrong : pal.border, width: t === 0 ? 1.4 : 0.75 } } as any);
    txt(slide, t10Fmt(t), { x: x0 - 0.45, y: y - 0.13, w: 0.4, h: 0.26, fontSize: 9, color: pal.ink3, align: 'right', fontFace: S.fonts.mono });
  }
  for (let i = 0; i < pts.length - 1; i++) t10Seg(slide, xOf(pts[i].x), yOf(pts[i].y), xOf(pts[i + 1].x), yOf(pts[i + 1].y), pal.accent, 2.4);
  pts.forEach((q, i) => {
    const x = xOf(q.x), y = yOf(q.y);
    slide.addShape('oval', { x: x - 0.11, y: y - 0.11, w: 0.22, h: 0.22, fill: { color: colors[i % colors.length] }, line: { color: pal.ink, width: 1.4 } } as any);
    if (q.label) txt(slide, q.label, { x: x + 0.16, y: y - 0.13, w: 1.6, h: 0.26, fontSize: 10, color: pal.ink2, align: 'left', fontFace: S.fonts.body });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

function renderMarimekko(slide: PptxSlide, p: any): void {
  const pal = P('theme10_marimekko_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 26 });
  const items: { label: string; share: number; value: number }[] = (Array.isArray(p.items) ? p.items : [])
    .map((it: any, i: number) => ({ label: it?.label ?? `项 ${i + 1}`, share: Number(it?.share ?? 0), value: Number(it?.value ?? 0) }));
  const totalShare = items.reduce((a, it) => a + it.share, 0) || 1;
  const maxV = Math.max(1, ...items.map((it) => it.value));
  const x0 = MX + 0.1, x1 = MX + CW - 0.1, top = y0 + 0.2, bot = BOT - 0.3;
  const plotH = bot - top;
  const colors = series(pal);
  let cx = x0;
  items.forEach((it, i) => {
    const w = (it.share / totalShare) * (x1 - x0);
    const h = (it.value / maxV) * plotH;
    const by = bot - h;
    slide.addShape('rect', { x: cx + 0.015, y: by, w: Math.max(w - 0.03, 0.02), h, fill: { color: colors[i % colors.length], transparency: 8 }, line: { color: pal.ink, width: 1 } } as any);
    if (w > 0.7 && h > 0.4) {
      txt(slide, it.label, { x: cx + 0.05, y: by + 0.06, w: w - 0.1, h: 0.3, fontSize: 11, bold: true, color: pal.ink, align: 'left', fontFace: S.fonts.body });
      txt(slide, t10Fmt(it.value), { x: cx + 0.05, y: by + 0.36, w: w - 0.1, h: 0.3, fontSize: 10, color: pal.ink2, align: 'left', fontFace: S.fonts.mono });
    }
    txt(slide, `${it.label} ${Math.round((it.share / totalShare) * 100)}%`, { x: cx, y: bot + 0.04, w: w, h: 0.26, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
    cx += w;
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// ════════════════════════════════════════════════════════════════
// P3 结构 / 流程 / 长尾（11 版式）
// ════════════════════════════════════════════════════════════════

function t10Arr(v: unknown): any[] {
  return Array.isArray(v) ? v : [];
}

function renderSteps(slide: PptxSlide, p: any): void {
  const pal = P('theme10_steps_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 5);
  const n = Math.max(1, items.length);
  const gx = 0.35;
  const cw = (CW - (n - 1) * gx) / n;
  items.forEach((it: any, i: number) => {
    const x = MX + i * (cw + gx);
    slide.addShape('rect', { x, y: y0, w: cw, h: 0.04, fill: { color: pal.gold } });
    txt(slide, it.no ?? String(i + 1).padStart(2, '0'), { x, y: y0 + 0.12, w: cw, h: 0.4, fontSize: 24, color: pal.accent, bold: true, fontFace: S.fonts.mono });
    txt(slide, it.name ?? '', { x, y: y0 + 0.58, w: cw, h: 0.32, fontSize: 16, color: pal.ink, bold: true, fontFace: S.fonts.heading });
    txt(slide, it.desc ?? '', { x, y: y0 + 0.94, w: cw, h: 1.1, fontSize: 11, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
    if (i < n - 1) txt(slide, '→', { x: x + cw + 0.02, y: y0 + 0.2, w: gx, h: 0.4, fontSize: 18, color: pal.gold, align: 'center', valign: 'middle' });
  });
}

function renderCycle(slide: PptxSlide, p: any): void {
  const pal = P('theme10_cycle_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 6);
  const n = Math.max(1, items.length);
  const cols = n <= 3 ? n : 3;
  const rows = Math.ceil(n / cols);
  const gx = 0.4, gy = 0.5;
  const cw = (CW - (cols - 1) * gx) / cols;
  const ch = (BOT - y0 - 0.3 - (rows - 1) * gy) / rows;
  items.forEach((it: any, i: number) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cw + gx), y = y0 + 0.3 + r * (ch + gy);
    card(slide, x, y, cw, ch, pal);
    slide.addShape('oval', { x: x + 0.18, y: y + 0.18, w: 0.5, h: 0.5, fill: { color: pal.surface }, line: { color: pal.gold, width: 1 } });
    txt(slide, String(i + 1).padStart(2, '0'), { x: x + 0.18, y: y + 0.18, w: 0.5, h: 0.5, align: 'center', valign: 'middle', fontSize: 14, bold: true, color: pal.accent, fontFace: S.fonts.mono });
    txt(slide, it.name ?? '', { x: x + 0.8, y: y + 0.2, w: cw - 0.95, h: 0.4, fontSize: 15, bold: true, color: pal.ink, fontFace: S.fonts.heading });
    txt(slide, it.desc ?? '', { x: x + 0.2, y: y + 0.78, w: cw - 0.4, h: ch - 0.9, fontSize: 10, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.15 } as any);
  });
}

function renderSwimlane(slide: PptxSlide, p: any): void {
  const pal = P('theme10_swimlane_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 4);
  const n = Math.max(1, items.length);
  const rh = (BOT - y0 - 0.2) / n;
  items.forEach((ln: any, i: number) => {
    const y = y0 + 0.2 + i * rh;
    slide.addShape('line', { x: MX, y, w: CW, h: 0, line: { color: pal.border, width: 0.75 } });
    txt(slide, ln.role ?? '', { x: MX, y: y + 0.12, w: 1.6, h: 0.4, fontSize: 15, bold: true, color: pal.gold, fontFace: S.fonts.heading });
    const tasks = normStrings(ln.tasks).slice(0, 4).join('    ·    ');
    txt(slide, tasks, { x: MX + 1.8, y: y + 0.12, w: CW - 1.8, h: 0.4, fontSize: 13, color: pal.ink, fontFace: S.fonts.body });
  });
}

function renderChecklist(slide: PptxSlide, p: any): void {
  const pal = P('theme10_checklist_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 8);
  const half = Math.ceil(items.length / 2);
  const colW = (CW - 0.6) / 2;
  items.forEach((it: any, i: number) => {
    const c = i < half ? 0 : 1;
    const row = c === 0 ? i : i - half;
    const x = MX + c * (colW + 0.6);
    const y = y0 + 0.1 + row * ((BOT - y0 - 0.2) / half);
    txt(slide, it.done ? '✓' : '○', { x, y, w: 0.4, h: 0.34, fontSize: 16, color: it.done ? pal.green : pal.ink3, bold: true, fontFace: S.fonts.mono });
    txt(slide, it.text ?? '', { x: x + 0.45, y, w: colW - 0.45, h: 0.34, fontSize: 14, color: pal.ink, fontFace: S.fonts.body, valign: 'top' });
  });
}

function renderPlans(slide: PptxSlide, p: any): void {
  const pal = P('theme10_plans_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 3);
  const n = Math.max(1, items.length);
  const gx = 0.4;
  const cw = (CW - (n - 1) * gx) / n;
  items.forEach((pl: any, i: number) => {
    const x = MX + i * (cw + gx);
    card(slide, x, y0 + 0.1, cw, BOT - y0 - 0.2, pal);
    slide.addShape('rect', { x, y: y0 + 0.1, w: cw, h: 0.06, fill: { color: pal.gold } });
    txt(slide, pl.tag ?? '', { x: x + 0.22, y: y0 + 0.28, w: cw - 0.44, h: 0.28, fontSize: 11, color: pal.gold, fontFace: S.fonts.mono, charSpacing: 1 });
    txt(slide, pl.name ?? '', { x: x + 0.22, y: y0 + 0.56, w: cw - 0.44, h: 0.4, fontSize: 20, bold: true, color: pal.ink, fontFace: S.fonts.heading });
    const pts = normStrings(pl.points).slice(0, 5);
    pts.forEach((t: string, j: number) => {
      const ty = y0 + 1.1 + j * 0.42;
      txt(slide, '▸', { x: x + 0.22, y: ty, w: 0.3, h: 0.3, fontSize: 12, color: pal.accent });
      txt(slide, t, { x: x + 0.52, y: ty, w: cw - 0.74, h: 0.3, fontSize: 13, color: pal.ink2, fontFace: S.fonts.body });
    });
  });
}

function renderJourney(slide: PptxSlide, p: any): void {
  const pal = P('theme10_journey_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 6);
  const n = Math.max(1, items.length);
  const gx = 0.5;
  const cw = (CW - (n - 1) * gx) / n;
  items.forEach((it: any, i: number) => {
    const x = MX + i * (cw + gx);
    const lv = Math.max(0, Math.min(100, Number(it.level ?? 50)));
    const bh = (lv / 100) * (BOT - y0 - 0.9);
    slide.addShape('rect', { x: x + cw / 2 - 0.18, y: BOT - 0.7 - bh, w: 0.36, h: bh, fill: { color: i % 2 ? pal.gold : pal.accent } });
    txt(slide, String(it.level ?? ''), { x, y: BOT - 0.7 - bh - 0.32, w: cw, h: 0.3, fontSize: 12, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
    txt(slide, it.stage ?? '', { x, y: BOT - 0.62, w: cw, h: 0.3, fontSize: 14, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.heading });
    txt(slide, it.action ?? '', { x: x - 0.1, y: BOT - 0.32, w: cw + 0.2, h: 0.3, fontSize: 10, color: pal.ink3, align: 'center', fontFace: S.fonts.body });
  });
}

function renderGoals(slide: PptxSlide, p: any): void {
  const pal = P('theme10_goals_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 4);
  const n = Math.max(1, items.length);
  const gx = 0.4, gy = 0.4;
  const cols = n <= 2 ? n : 2;
  const rows = Math.ceil(n / cols);
  const cw = (CW - (cols - 1) * gx) / cols;
  const ch = (BOT - y0 - 0.2 - (rows - 1) * gy) / rows;
  items.forEach((it: any, i: number) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cw + gx), y = y0 + 0.2 + r * (ch + gy);
    card(slide, x, y, cw, ch, pal);
    txt(slide, it.name ?? '', { x: x + 0.22, y: y + 0.18, w: cw * 0.6, h: 0.34, fontSize: 16, bold: true, color: pal.ink, fontFace: S.fonts.heading });
    txt(slide, it.target ?? '', { x: x + cw - 1.6, y: y + 0.18, w: 1.4, h: 0.34, fontSize: 13, color: pal.ink2, align: 'right', fontFace: S.fonts.mono });
    const pct = Math.max(0, Math.min(100, Number(it.progress ?? 0)));
    slide.addShape('rect', { x: x + 0.22, y: y + ch / 2, w: cw - 0.44, h: 0.12, fill: { color: pal.surfaceElevated } });
    slide.addShape('rect', { x: x + 0.22, y: y + ch / 2, w: (cw - 0.44) * pct / 100, h: 0.12, fill: { color: pal.gold } });
    txt(slide, `${pct}%`, { x: x + 0.22, y: y + ch / 2 + 0.2, w: cw - 0.44, h: 0.3, fontSize: 13, bold: true, color: pal.gold, fontFace: S.fonts.mono });
  });
}

function renderGlossary(slide: PptxSlide, p: any): void {
  const pal = P('theme10_glossary_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 8);
  const half = Math.ceil(items.length / 2);
  const colW = (CW - 0.6) / 2;
  items.forEach((it: any, i: number) => {
    const c = i < half ? 0 : 1;
    const row = c === 0 ? i : i - half;
    const x = MX + c * (colW + 0.6);
    const y = y0 + 0.1 + row * ((BOT - y0 - 0.2) / half);
    slide.addShape('line', { x, y, w: colW, h: 0, line: { color: pal.border, width: 0.75 } });
    txt(slide, it.term ?? '', { x, y: y + 0.06, w: colW, h: 0.32, fontSize: 15, bold: true, color: pal.gold, fontFace: S.fonts.heading });
    txt(slide, it.def ?? '', { x, y: y + 0.4, w: colW, h: 0.6, fontSize: 12, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.15 } as any);
  });
}

function renderFaq(slide: PptxSlide, p: any): void {
  const pal = P('theme10_faq_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 5);
  const n = Math.max(1, items.length);
  const rh = (BOT - y0 - 0.2) / n;
  items.forEach((it: any, i: number) => {
    const y = y0 + 0.2 + i * rh;
    slide.addShape('line', { x: MX, y, w: CW, h: 0, line: { color: pal.border, width: 0.75 } });
    txt(slide, `Q${String(i + 1).padStart(2, '0')}`, { x: MX, y: y + 0.08, w: 0.7, h: 0.3, fontSize: 12, bold: true, color: pal.gold, fontFace: S.fonts.mono });
    txt(slide, it.q ?? '', { x: MX + 0.8, y: y + 0.06, w: CW - 0.8, h: 0.32, fontSize: 15, bold: true, color: pal.ink, fontFace: S.fonts.heading });
    txt(slide, it.a ?? '', { x: MX + 0.8, y: y + 0.4, w: CW - 0.8, h: rh - 0.5, fontSize: 11, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.15 } as any);
  });
}

function renderIsotype(slide: PptxSlide, p: any): void {
  const pal = P('theme10_isotype_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 5);
  const maxV = Math.max(1, ...items.map((it: any) => Number(it.value ?? 0)));
  const n = Math.max(1, items.length);
  const rh = (BOT - y0 - 0.2) / n;
  items.forEach((it: any, i: number) => {
    const y = y0 + 0.2 + i * rh;
    txt(slide, it.label ?? '', { x: MX, y: y + 0.04, w: 1.4, h: 0.32, fontSize: 14, bold: true, color: pal.ink, fontFace: S.fonts.heading });
    const v = Math.round(Number(it.value ?? 0));
    const gn = Math.max(1, Math.round((v / maxV) * 16));
    const gw = 0.16, gg = 0.06;
    for (let j = 0; j < gn; j++) {
      slide.addShape('rect', { x: MX + 1.5 + j * (gw + gg), y: y + 0.06, w: gw, h: gw, fill: { color: i % 2 ? pal.gold : pal.accent } });
    }
    txt(slide, String(v), { x: 9.0, y: y + 0.02, w: 0.3, h: 0.32, fontSize: 16, bold: true, color: pal.ink, align: 'right', fontFace: S.fonts.mono });
  });
}

function renderVenn(slide: PptxSlide, p: any): void {
  const pal = P('theme10_venn_v1', p);
  frame(slide, pal);
  const y0 = t10Head(slide, p, pal, { size: 30 });
  const items = t10Arr(p.items).slice(0, 3);
  const names = [items[0]?.name ?? 'A', items[1]?.name ?? 'B', items[2]?.name ?? 'C'];
  const cols = [pal.accent, pal.gold, pal.copper];
  const R = 1.15;
  const cx = [3.7, 6.3, 5.0];
  const cy = [y0 + 1.7, y0 + 1.7, y0 + 2.9];
  cx.forEach((x, i) => {
    slide.addShape('oval', { x: x - R, y: cy[i] - R, w: R * 2, h: R * 2, fill: { color: cols[i], transparency: 80 }, line: { color: cols[i], width: 1.25 } });
  });
  txt(slide, names[0], { x: cx[0] - R, y: cy[0] - R - 0.3, w: R * 2, h: 0.3, align: 'center', fontSize: 14, bold: true, color: pal.ink, fontFace: S.fonts.heading });
  txt(slide, names[1], { x: cx[1] - R, y: cy[1] - R - 0.3, w: R * 2, h: 0.3, align: 'center', fontSize: 14, bold: true, color: pal.ink, fontFace: S.fonts.heading });
  txt(slide, names[2], { x: cx[2] - R, y: cy[2] + R + 0.05, w: R * 2, h: 0.3, align: 'center', fontSize: 14, bold: true, color: pal.ink, fontFace: S.fonts.heading });
  txt(slide, '交集 = 共同诉求', { x: 3.3, y: y0 + 2.2, w: 3.4, h: 0.3, align: 'center', fontSize: 12, color: pal.ink2, fontFace: S.fonts.body });
}

// ────────────────────────────────────────────────────────────────
// W4 扩展版式（7 个）· PPTX 渲染器
// ────────────────────────────────────────────────────────────────

/** 涨跌色（红涨绿跌：A股惯例；与 index_board 网页端一致）。 */
function t10DeltaColor(pal: T10Pal, delta: unknown, redUp = false): string {
  const up = delta != null && !/^-/.test(String(delta).trim());
  if (redUp) return up ? pal.red : pal.green;
  return up ? pal.green : pal.red;
}

/** 内容页页眉（栏标=section + 标题），返回正文起始 y。 */
function t10HeadX(slide: PptxSlide, p: any, pal: T10Pal, size = 30): number {
  kicker(slide, p.section, pal, { y: 0.78 });
  title(slide, p.title, pal, { x: MX, y: 1.14, w: CW, size });
  return 1.14 + size / 72 * 1.18 + 0.45;
}

// 76. metric-hero · 英雄指标
function renderMetricHero(slide: PptxSlide, p: any): void {
  const pal = P('theme10_metric_hero_v1', p);
  frame(slide, pal);
  kicker(slide, p.section, pal, { y: 0.78 });
  title(slide, p.title, pal, { x: MX, y: 1.2, w: CW * 0.82, size: 24 });
  const y0 = 2.5;
  txt(slide, p.label, { x: MX, y: y0, w: CW, h: 0.3, fontSize: 14, color: pal.ink3, fontFace: S.fonts.mono, charSpacing: 1 } as any);
  txt(slide, `${p.value ?? ''}${p.unit ? ' ' + p.unit : ''}`, { x: MX, y: y0 + 0.32, w: CW, h: 1.4, fontSize: 84, bold: true, color: pal.ink, fontFace: S.fonts.mono });
  if (p.delta) txt(slide, p.delta, { x: MX, y: y0 + 1.78, w: CW, h: 0.36, fontSize: 16, bold: true, color: t10DeltaColor(pal, p.delta), fontFace: S.fonts.mono } as any);
  if (p.context) txt(slide, p.context, { x: MX, y: y0 + 2.2, w: CW * 0.82, h: 0.9, fontSize: 14, color: pal.ink2, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.25 } as any);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// 77. scorecard · 记分卡
function renderScorecard(slide: PptxSlide, p: any): void {
  const pal = P('theme10_scorecard_v1', p);
  frame(slide, pal);
  const y0 = t10HeadX(slide, p, pal, 26);
  const items = (Array.isArray(p.items) ? p.items : []).slice(0, 6);
  const gx = 0.28, gy = 0.28;
  const cols = Math.min(Math.max(items.length, 1), 3);
  const rows = Math.ceil(items.length / cols);
  const areaH = BOT - y0 - 0.4;
  const cw = (CW - gx * (cols - 1)) / cols, ch = (areaH - gy * (rows - 1)) / rows;
  items.forEach((it: any, i: number) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cw + gx), y = y0 + r * (ch + gy);
    card(slide, x, y, cw, ch, pal);
    txt(slide, it.label ?? '', { x: x + 0.24, y: y + 0.2, w: cw - 0.48, h: 0.3, fontSize: 12, color: pal.ink2, fontFace: S.fonts.body });
    txt(slide, `${it.score ?? ''}${it.total ? ' / ' + it.total : ''}`, { x: x + 0.24, y: y + 0.56, w: cw - 0.48, h: ch - 1.2, fontSize: 36, bold: true, color: pal.ink, fontFace: S.fonts.mono });
    if (it.note) txt(slide, it.note, { x: x + 0.24, y: y + ch - 0.6, w: cw - 0.48, h: 0.5, fontSize: 11, color: pal.ink3, fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// 78. comparison-stat · 对比指标
function renderComparisonStat(slide: PptxSlide, p: any): void {
  const pal = P('theme10_comparison_stat_v1', p);
  frame(slide, pal);
  const y0 = t10HeadX(slide, p, pal, 26);
  const left = p.left ?? {}, right = p.right ?? {};
  const midY = (y0 + BOT) / 2 - 0.3;
  const sideW = 3.0, gapC = 0.6;
  const lx = MX + (CW - 2 * sideW - gapC) / 2;
  const rx = lx + sideW + gapC;
  const drawSide = (it: any, x: number) => {
    txt(slide, it.label ?? '', { x, y: midY - 0.9, w: sideW, h: 0.3, fontSize: 13, color: pal.ink2, align: 'center', fontFace: S.fonts.body } as any);
    txt(slide, `${it.value ?? ''}${it.unit ? ' ' + it.unit : ''}`, { x, y: midY - 0.55, w: sideW, h: 1.0, fontSize: 52, bold: true, color: pal.ink, align: 'center', fontFace: S.fonts.mono });
    if (it.delta) txt(slide, it.delta, { x, y: midY + 0.55, w: sideW, h: 0.34, fontSize: 15, bold: true, color: t10DeltaColor(pal, it.delta), align: 'center', fontFace: S.fonts.mono } as any);
  };
  drawSide(left, lx);
  drawSide(right, rx);
  slide.addShape('oval', { x: MX + CW / 2 - 0.32, y: midY - 0.32, w: 0.64, h: 0.64, fill: { color: pal.bg }, line: { color: pal.gold, width: 1.25 } });
  txt(slide, p.versus ?? 'VS', { x: MX + CW / 2 - 0.32, y: midY - 0.12, w: 0.64, h: 0.3, fontSize: 14, bold: true, color: pal.gold, align: 'center', fontFace: S.fonts.mono } as any);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// 79. small-multiples · 小多图（PPTX 近似：每格迷你柱+标题）
function renderSmallMultiples(slide: PptxSlide, p: any): void {
  const pal = P('theme10_small_multiples_v1', p);
  frame(slide, pal);
  const y0 = t10HeadX(slide, p, pal, 26);
  const panels = (Array.isArray(p.panels) ? p.panels : []).slice(0, 6);
  const gx = 0.26, gy = 0.26;
  const cols = panels.length > 1 ? 2 : 1;
  const rows = Math.ceil(panels.length / cols);
  const areaH = BOT - y0 - 0.4;
  const cw = (CW - gx * (cols - 1)) / cols, ch = (areaH - gy * (rows - 1)) / rows;
  const colors = series(pal);
  panels.forEach((pn: any, i: number) => {
    const c = i % cols, r = Math.floor(i / cols);
    const x = MX + c * (cw + gx), y = y0 + r * (ch + gy);
    card(slide, x, y, cw, ch, pal, pal.surface, pal.border);
    const vals = t10ParseVals(pn.values);
    txt(slide, pn.title ?? '', { x: x + 0.22, y: y + 0.16, w: cw - 0.44, h: 0.3, fontSize: 13, bold: true, color: pal.ink2, fontFace: S.fonts.body });
    if (vals.length) {
      const plotX = x + 0.3, plotW = cw - 0.6, plotY = y + 0.6, plotH = ch - 1.0;
      const mx = Math.max(...vals, 1), mn = Math.min(...vals, 0);
      const n = vals.length, bw = plotW / n * 0.7, gap = plotW / n * 0.3;
      vals.forEach((v: number, k: number) => {
        const bh = (v - mn) / (mx - mn || 1) * plotH;
        const bx = plotX + k * (bw + gap) + gap / 2;
        slide.addShape('rect', { x: bx, y: plotY + plotH - bh, w: Math.max(bw, 0.04), h: Math.max(bh, 0.02), fill: { color: colors[k % colors.length] } });
      });
    }
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// 80. stat-strip · 指标长条
function renderStatStrip(slide: PptxSlide, p: any): void {
  const pal = P('theme10_stat_strip_v1', p);
  frame(slide, pal);
  const y0 = t10HeadX(slide, p, pal, 26);
  const items = (Array.isArray(p.items) ? p.items : []).slice(0, 6);
  const n = Math.max(items.length, 1);
  const cw = CW / n;
  const y = (y0 + BOT) / 2 - 0.7;
  items.forEach((it: any, i: number) => {
    const x = MX + i * cw;
    if (i > 0) slide.addShape('line', { x, y: y + 0.1, w: 0, h: 1.2, line: { color: pal.border, width: 0.75 } });
    const px = x + 0.22;
    txt(slide, it.label ?? '', { x: px, y, w: cw - 0.44, h: 0.3, fontSize: 12, color: pal.ink2, fontFace: S.fonts.body } as any);
    txt(slide, `${it.value ?? ''}${it.unit ? ' ' + it.unit : ''}`, { x: px, y: y + 0.34, w: cw - 0.44, h: 0.7, fontSize: 34, bold: true, color: pal.ink, fontFace: S.fonts.mono });
    if (it.delta) txt(slide, it.delta, { x: px, y: y + 1.06, w: cw - 0.44, h: 0.3, fontSize: 13, bold: true, color: t10DeltaColor(pal, it.delta), fontFace: S.fonts.mono } as any);
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// 81. quote-stat · 金句指标
function renderQuoteStat(slide: PptxSlide, p: any): void {
  const pal = P('theme10_quote_stat_v1', p);
  frame(slide, pal);
  kicker(slide, p.section, pal, { y: 0.78 });
  const qy = 1.4;
  txt(slide, p.quote, { x: MX, y: qy, w: CW * 0.82, h: 2.0, fontSize: 34, bold: true, color: pal.ink, fontFace: S.fonts.heading, valign: 'top', lineSpacingMultiple: 1.25 } as any);
  if (p.sign) txt(slide, p.sign, { x: MX, y: qy + 2.0, w: CW * 0.82, h: 0.3, fontSize: 13, color: pal.gold, fontFace: S.fonts.mono } as any);
  const cy = 2.9;
  slide.addShape('line', { x: MX, y: cy, w: 0, h: 1.4, line: { color: pal.gold, width: 2.5 } });
  txt(slide, p.statLabel, { x: MX + 0.22, y: cy, w: 3.4, h: 0.3, fontSize: 13, color: pal.ink3, fontFace: S.fonts.mono, charSpacing: 1 } as any);
  txt(slide, `${p.statValue ?? ''}${p.statUnit ? ' ' + p.statUnit : ''}`, { x: MX + 0.22, y: cy + 0.32, w: 3.4, h: 0.8, fontSize: 40, bold: true, color: pal.ink, fontFace: S.fonts.mono });
  if (p.statDelta) txt(slide, p.statDelta, { x: MX + 0.22, y: cy + 1.12, w: 3.4, h: 0.3, fontSize: 14, bold: true, color: t10DeltaColor(pal, p.statDelta), fontFace: S.fonts.mono } as any);
  footer(slide, p.folioLeft, p.folioRight, pal);
}

// 82. index-board · 指数看板（红涨绿跌）
function renderIndexBoard(slide: PptxSlide, p: any): void {
  const pal = P('theme10_index_board_v1', p);
  frame(slide, pal);
  const y0 = t10HeadX(slide, p, pal, 26);
  const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, 8);
  const hy = y0 + 0.05;
  const cols = [0, 2.2, 4.0, 6.6].map((x) => MX + x);
  txt(slide, '代码', { x: cols[0], y: hy, w: 2.0, h: 0.26, fontSize: 10, color: pal.ink3, charSpacing: 1, fontFace: S.fonts.mono } as any);
  txt(slide, '名称', { x: cols[1], y: hy, w: 1.8, h: 0.26, fontSize: 10, color: pal.ink3, charSpacing: 1, fontFace: S.fonts.mono } as any);
  txt(slide, '最新价', { x: cols[2], y: hy, w: 2.6, h: 0.26, fontSize: 10, color: pal.ink3, align: 'right', charSpacing: 1, fontFace: S.fonts.mono } as any);
  txt(slide, '涨跌', { x: cols[3], y: hy, w: 2.6, h: 0.26, fontSize: 10, color: pal.ink3, align: 'right', charSpacing: 1, fontFace: S.fonts.mono } as any);
  slide.addShape('line', { x: MX, y: hy + 0.34, w: CW, h: 0, line: { color: pal.border, width: 0.75 } });
  const rh = (BOT - hy - 0.5) / Math.max(rows.length, 1);
  rows.forEach((r: any, i: number) => {
    const y = hy + 0.42 + i * rh;
    txt(slide, r.code ?? '', { x: cols[0], y, w: 2.0, h: rh - 0.1, fontSize: 15, bold: true, color: pal.ink, fontFace: S.fonts.mono, valign: 'middle' } as any);
    txt(slide, r.name ?? '', { x: cols[1], y, w: 1.8, h: rh - 0.1, fontSize: 15, color: pal.ink2, fontFace: S.fonts.body, valign: 'middle' } as any);
    txt(slide, r.value ?? '', { x: cols[2], y, w: 2.6, h: rh - 0.1, fontSize: 18, bold: true, color: pal.ink, align: 'right', fontFace: S.fonts.mono, valign: 'middle' } as any);
    txt(slide, r.delta ?? '', { x: cols[3], y, w: 2.6, h: rh - 0.1, fontSize: 15, bold: true, color: t10DeltaColor(pal, r.delta, true), align: 'right', fontFace: S.fonts.mono, valign: 'middle' } as any);
    if (i < rows.length - 1) slide.addShape('line', { x: MX, y: y + rh, w: CW, h: 0, line: { color: pal.border, width: 0.5 } });
  });
  footer(slide, p.folioLeft, p.folioRight, pal);
}

const RENDERERS: Record<string, T10RenderFn> = {
  theme10_cover_dusk_v1: renderCoverDusk,
  theme10_cover_field_v1: renderCoverField,
  theme10_cover_atmos_v1: renderCoverAtmos,
  theme10_cover_horizon_v1: renderCoverHorizon,
  theme10_cover_standard_v1: renderCoverStandard,
  theme10_cover_dawn_v1: renderCoverDawn,
  theme10_chapter_v1: renderChapter,
  theme10_divider_v1: renderDivider,
  theme10_statement_section_v1: renderStatementSection,
  theme10_statement_v1: renderStatement,
  theme10_principles_v1: renderPrinciples,
  theme10_closing_v1: renderClosing,
  // P1 影像图文 批次A
  theme10_profile_v1: renderProfile,
  theme10_team_v1: renderTeam,
  theme10_quote_v1: renderQuote,
  theme10_editorial_v1: renderEditorial,
  theme10_magazine_v1: renderMagazine,
  // P1 影像图文 批次B
  theme10_triptych_v1: renderTriptych,
  theme10_strata_v1: renderStrata,
  theme10_spark_v1: renderSpark,
  theme10_testimonials_v1: renderTestimonials,
  theme10_feature_v1: renderFeature,
  // P1 影像图文 批次C
  theme10_compareimg_v1: renderCompareImg,
  theme10_pinboard_v1: renderPinboard,
  theme10_filmstrip_v1: renderFilmstrip,
  theme10_inset_v1: renderInset,
  theme10_gallery2_v1: renderGallery2,
  // P1 影像图文 批次D
  theme10_mosaic_v1: renderMosaic,
  theme10_collage_v1: renderCollage,
  theme10_captioned_v1: renderCaptioned,
  theme10_showcase_v1: renderShowcase,
  theme10_poster_v1: renderPoster,
  // P1 影像图文 批次E
  theme10_annotated_v1: renderAnnotated,
  theme10_quoteimg_v1: renderQuoteImg,
  theme10_quilt_v1: renderQuilt,
  theme10_exhibit_v1: renderExhibit,
  theme10_medallions_v1: renderMedallions,
  // P2 数据图表 批次F（基础图表 5 版式）
  theme10_bar_v1: renderBar,
  theme10_hbar_v1: renderHBar,
  theme10_line_v1: renderLine,
  theme10_area_v1: renderArea,
  theme10_kpis_v1: renderKpis,
  // P2 数据图表 批次G（对比与构成 5 版式）
  theme10_grouped_v1: renderGrouped,
  theme10_stack_v1: renderStack,
  theme10_donut_v1: renderDonut,
  theme10_pie_v1: renderPie,
  theme10_waterfall_v1: renderWaterfall,
  // P2 数据图表 批次H（分布与关系 5 版式）
  theme10_scatter_v1: renderScatter,
  theme10_bubble_v1: renderBubble,
  theme10_radar_v1: renderRadar,
  theme10_radial_v1: renderRadial,
  theme10_heat_v1: renderHeat,
  // P2 数据图表 批次I（趋势与时间 5 版式）
  theme10_trend_v1: renderTrend,
  theme10_range_v1: renderRange,
  theme10_candlestick_v1: renderCandlestick,
  theme10_ridgeline_v1: renderRidgeline,
  theme10_calendar_v1: renderCalendar,
  // P2 数据图表 批次J（分布与构成进阶 5 版式）
  theme10_funnel_v1: renderFunnel,
  theme10_gauge_v1: renderGauge,
  theme10_bullet_v1: renderBullet,
  theme10_box_v1: renderBox,
  theme10_treemap_v1: renderTreemap,
  // P2 数据图表 批次K（关系与构成进阶 5 版式）
  theme10_sankey_v1: renderSankey,
  theme10_dumbbell_v1: renderDumbbell,
  theme10_histogram_v1: renderHistogram,
  theme10_slope_v1: renderSlope,
  theme10_waffle_v1: renderWaffle,
  // P2 数据图表 批次L（时序与分布 5 版式）
  theme10_gantt_v1: renderGantt,
  theme10_bump_v1: renderBump,
  theme10_rose_v1: renderRose,
  theme10_dotplot_v1: renderDotplot,
  theme10_timeline_v1: renderTimeline,
  // P2 数据图表 批次M（结构与关系 5 版式）
  theme10_orgchart_v1: renderOrgChart,
  theme10_parallel_v1: renderParallel,
  theme10_circlepack_v1: renderCirclepack,
  theme10_cscatter_v1: renderCscatter,
  theme10_marimekko_v1: renderMarimekko,
  // P3 结构 / 流程 / 长尾（11 版式）
  theme10_steps_v1: renderSteps,
  theme10_cycle_v1: renderCycle,
  theme10_swimlane_v1: renderSwimlane,
  theme10_checklist_v1: renderChecklist,
  theme10_plans_v1: renderPlans,
  theme10_journey_v1: renderJourney,
  theme10_goals_v1: renderGoals,
  theme10_glossary_v1: renderGlossary,
  theme10_faq_v1: renderFaq,
  theme10_isotype_v1: renderIsotype,
  theme10_venn_v1: renderVenn,
  // W4 扩展版式（7 个）
  theme10_metric_hero_v1: renderMetricHero,
  theme10_scorecard_v1: renderScorecard,
  theme10_comparison_stat_v1: renderComparisonStat,
  theme10_small_multiples_v1: renderSmallMultiples,
  theme10_stat_strip_v1: renderStatStrip,
  theme10_quote_stat_v1: renderQuoteStat,
  theme10_index_board_v1: renderIndexBoard,
};

/** 将全部 theme10 渲染器注册到导出管线的按 layoutId 索引注册表。 */
export function registerTheme10Renderers(register: (layoutId: string, fn: T10RenderFn) => void): void {
  for (const [id, fn] of Object.entries(RENDERERS)) {
    register(id, fn);
  }
}
