// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme08 黑金实验风 — PPTX 版式专属渲染器。
// 解决此前 theme08 在 PPTX 导出中 37/39 版式落到 "Unknown layout" 占位的问题。
// 所有渲染器基于 theme08 设计语言：深黑底 + 荧光金主强调（primary）/ 象牙暖白 + 古铜金（muted）。

import { type Slide as PptxSlide } from 'pptxgenjs';

interface T08Fonts {
  heading: string;
  body: string;
  mono: string;
}
interface T08State {
  colors: any;
  fonts: T08Fonts;
  chartColors: string[];
  muted: boolean;
}

let S: T08State;

/** 每次导出开始时由 export-pptx.ts 注入当前主题的配色/字体/深浅模式。 */
export function configureTheme08(state: T08State): void {
  S = state;
}

// ---- 画布常量（16:9，10 x 5.625 英寸） ----
const MX = 0.7; // 左右页边距
const CW = 10 - MX * 2; // 内容宽度 8.6
const BODY_TOP = 2.05; // 正文区起始 y

// ---- 颜色速取 ----
const ink = (): string => S.colors.primary;
const ink2 = (): string => S.colors.secondary;
const gold = (): string => S.colors.accent;
const surface = (): string => S.colors.surface;
const surfaceElev = (): string => S.colors.surfaceElevated;
const border = (): string => S.colors.border;
const isDark = (): boolean => !S.muted;
const mono = (): string => S.fonts.mono;
const heading = (): string => S.fonts.heading;
const body = (): string => S.fonts.body;

// ---- 基础绘制 ----
function txt(slide: PptxSlide, text: string | undefined, o: Record<string, unknown>): void {
  if (text == null || text === '') return;
  slide.addText(text, o as any);
}

/** 设置主题背景 + 顶部金色装饰条。 */
function bg(slide: PptxSlide): void {
  (slide as any).background = { color: surface() };
  slide.addShape('rect', { x: 0, y: 0, w: 10, h: 0.1, fill: { color: gold() } });
  // 底部细线
  slide.addShape('line', {
    x: MX, y: 5.32, w: CW, h: 0,
    line: { color: border(), width: 0.75 },
  });
}

function kicker(slide: PptxSlide, text: string | undefined, x = MX, y = 0.45): void {
  txt(slide, text, {
    x, y, w: CW, h: 0.35, fontSize: 13, color: gold(), align: 'left',
    fontFace: mono(), charSpacing: 2, bold: true,
  });
}

function title(slide: PptxSlide, text: string | undefined, x = MX, y = 0.82, w = CW, size = 30): void {
  txt(slide, text, {
    x, y, w, h: 0.9, fontSize: size, color: ink(), align: 'left',
    fontFace: heading(), bold: true, valign: 'top',
  });
}

function subtitle(slide: PptxSlide, text: string | undefined, x = MX, y = 1.62, w = CW): void {
  txt(slide, text, {
    x, y, w, h: 0.4, fontSize: 15, color: ink2(), align: 'left', fontFace: body(),
  });
}

function footer(slide: PptxSlide, left?: string, right?: string): void {
  txt(slide, left, { x: MX, y: 5.34, w: CW / 2, h: 0.25, fontSize: 9, color: ink2(), align: 'left', fontFace: mono() });
  txt(slide, right, { x: MX + CW / 2, y: 5.34, w: CW / 2, h: 0.25, fontSize: 9, color: ink2(), align: 'right', fontFace: mono() });
}

/** 圆角卡片背景。 */
function card(slide: PptxSlide, x: number, y: number, w: number, h: number, fill?: string, stroke?: string): void {
  slide.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: fill || surfaceElev() },
    line: { color: stroke || border(), width: 1 },
  });
}

/** 网格列宽计算。 */
function cols(n: number, max = 4): number {
  return Math.min(n, max);
}

// =====================================================================
// 1. cover
// =====================================================================
function renderTheme08Cover(slide: PptxSlide, p: any): void {
  bg(slide);
  if (p.imageUrl) {
    slide.addImage({ path: p.imageUrl, x: 0, y: 0, w: 10, h: 5.625 });
    slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: isDark() ? '14130D' : 'FDFBF4', transparency: 35 } });
  }
  if (p.tag) {
    slide.addShape('roundRect', { x: MX, y: 1.0, w: 0.4 + p.tag.length * 0.16, h: 0.42, rectRadius: 0.21, fill: { color: gold() } });
    txt(slide, p.tag, { x: MX, y: 1.0, w: 0.4 + p.tag.length * 0.16, h: 0.42, fontSize: 13, color: isDark() ? '14130D' : 'FFFFFF', align: 'center', valign: 'middle', bold: true, fontFace: mono() });
  }
  txt(slide, p.title, { x: MX, y: 1.65, w: CW, h: 1.5, fontSize: 46, color: ink(), align: 'left', fontFace: heading(), bold: true, valign: 'top' });
  txt(slide, p.subtitle, { x: MX, y: 3.2, w: CW, h: 0.8, fontSize: 18, color: ink2(), align: 'left', fontFace: body() });

  const metrics = (p.metrics || []).slice(0, 4);
  if (metrics.length) {
    const mw = CW / metrics.length;
    metrics.forEach((m: any, i: number) => {
      const x = MX + i * mw;
      const val = [m.value, m.unit].filter(Boolean).join(' ');
      txt(slide, val, { x, y: 4.25, w: mw, h: 0.5, fontSize: 26, color: m.accent ? gold() : ink(), align: 'left', bold: true, fontFace: heading() });
      txt(slide, m.label, { x, y: 4.78, w: mw, h: 0.35, fontSize: 12, color: ink2(), align: 'left', fontFace: body() });
    });
  }
  if (p.tags && p.tags.length) {
    txt(slide, p.tags.join('   ·   '), { x: MX, y: 5.1, w: CW, h: 0.3, fontSize: 11, color: ink2(), align: 'left', fontFace: mono() });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 2. chapter
// =====================================================================
function renderTheme08Chapter(slide: PptxSlide, p: any): void {
  bg(slide);
  if (p.index) {
    txt(slide, p.index, { x: MX, y: 1.4, w: 3, h: 2.4, fontSize: 150, color: gold(), align: 'left', valign: 'middle', bold: true, fontFace: heading() });
  }
  if (p.kicker) {
    txt(slide, p.kicker, { x: 4.2, y: 1.9, w: 5, h: 0.4, fontSize: 14, color: gold(), align: 'left', fontFace: mono(), bold: true, charSpacing: 2 });
  }
  txt(slide, p.title, { x: 4.2, y: 2.35, w: 5.1, h: 1.0, fontSize: 38, color: ink(), align: 'left', valign: 'top', bold: true, fontFace: heading() });
  txt(slide, p.subtitle, { x: 4.2, y: 3.4, w: 5.1, h: 0.8, fontSize: 16, color: ink2(), align: 'left', fontFace: body() });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 3. content
// =====================================================================
function renderTheme08Content(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);

  const items = (p.items || []).slice(0, 4);
  const n = cols(items.length, 2);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  const ch = 1.35;
  items.forEach((it: any, i: number) => {
    const r = Math.floor(i / n);
    const c = i % n;
    const x = MX + c * (cw + gap);
    const y = BODY_TOP + r * (ch + 0.25);
    card(slide, x, y, cw, ch);
    txt(slide, it.title, { x: x + 0.25, y: y + 0.18, w: cw - 0.5, h: 0.45, fontSize: 17, color: ink(), bold: true, align: 'left', fontFace: heading() });
    txt(slide, it.desc, { x: x + 0.25, y: y + 0.65, w: cw - 0.5, h: ch - 0.8, fontSize: 12.5, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
  });

  const stats = (p.stats || []).slice(0, 4);
  if (stats.length) {
    const sy = BODY_TOP + 2 * (ch + 0.25) + 0.05;
    const sw = CW / stats.length;
    stats.forEach((st: any, i: number) => {
      const x = MX + i * sw;
      txt(slide, [st.num, st.label].filter(Boolean).join('  '), { x, y: sy, w: sw, h: 0.5, fontSize: 16, color: gold(), bold: true, align: 'left', fontFace: heading() });
    });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 4. contents（目录）
// =====================================================================
function renderTheme08Contents(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 6);
  let y = BODY_TOP;
  const rowH = (5.1 - BODY_TOP) / Math.max(items.length, 1);
  items.forEach((it: any, i: number) => {
    const num = String(i + 1).padStart(2, '0');
    txt(slide, num, { x: MX, y, w: 1.0, h: rowH, fontSize: 26, color: gold(), align: 'left', valign: 'middle', bold: true, fontFace: mono() });
    txt(slide, it.title, { x: MX + 1.1, y, w: CW - 1.1, h: rowH, fontSize: 22, color: ink(), align: 'left', valign: 'middle', fontFace: body() });
    slide.addShape('line', { x: MX + 1.1, y: y + rowH, w: CW - 1.1, h: 0, line: { color: border(), width: 0.5 } });
    y += rowH;
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 5. metrics（指标卡）
// =====================================================================
function renderTheme08Metrics(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 4);
  const n = cols(items.length, 4);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  const ch = 2.4;
  items.forEach((it: any, i: number) => {
    const x = MX + i * (cw + gap);
    card(slide, x, BODY_TOP, cw, ch, it.accent ? gold() : undefined);
    const tcol = it.accent ? (isDark() ? '14130D' : 'FFFFFF') : ink();
    txt(slide, [it.value, it.unit].filter(Boolean).join(' '), { x: x + 0.2, y: BODY_TOP + 0.4, w: cw - 0.4, h: 0.9, fontSize: 34, color: tcol, align: 'center', bold: true, fontFace: heading() });
    txt(slide, it.label, { x: x + 0.2, y: BODY_TOP + 1.4, w: cw - 0.4, h: 0.8, fontSize: 13, color: tcol, align: 'center', valign: 'top', fontFace: body() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 6. metric-big
// =====================================================================
function renderTheme08MetricBig(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker, MX, 1.4);
  const val = [p.value, p.unit].filter(Boolean).join(' ');
  txt(slide, val, { x: MX, y: 1.9, w: CW, h: 1.8, fontSize: 100, color: gold(), align: 'left', bold: true, fontFace: heading(), valign: 'middle' });
  txt(slide, p.title, { x: MX, y: 3.8, w: CW, h: 0.6, fontSize: 24, color: ink(), align: 'left', fontFace: heading(), bold: true });
  txt(slide, p.desc, { x: MX, y: 4.45, w: CW, h: 0.7, fontSize: 15, color: ink2(), align: 'left', fontFace: body() });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 7. feature
// =====================================================================
function renderTheme08Feature(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 6);
  const n = cols(items.length, 3);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  const ch = 2.55;
  items.forEach((it: any, i: number) => {
    const r = Math.floor(i / n);
    const c = i % n;
    const x = MX + c * (cw + gap);
    const y = BODY_TOP + r * (ch + 0.25);
    card(slide, x, y, cw, ch);
    if (it.icon) txt(slide, it.icon, { x: x + 0.25, y: y + 0.22, w: 0.8, h: 0.6, fontSize: 28, align: 'left', fontFace: body() });
    txt(slide, it.title, { x: x + 0.25, y: y + 0.95, w: cw - 0.5, h: 0.45, fontSize: 16, color: ink(), bold: true, align: 'left', fontFace: heading() });
    txt(slide, it.desc, { x: x + 0.25, y: y + 1.4, w: cw - 0.5, h: ch - 1.5, fontSize: 12, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 8. overview
// =====================================================================
function renderTheme08Overview(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 4);
  const n = cols(items.length, 2);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  const ch = 1.45;
  items.forEach((it: any, i: number) => {
    const r = Math.floor(i / n);
    const c = i % n;
    const x = MX + c * (cw + gap);
    const y = BODY_TOP + r * (ch + 0.25);
    card(slide, x, y, cw, ch);
    txt(slide, it.num, { x: x + 0.25, y: y + 0.2, w: 1.2, h: 1.0, fontSize: 40, color: gold(), align: 'left', valign: 'middle', bold: true, fontFace: heading() });
    txt(slide, it.label, { x: x + 1.55, y: y + 0.2, w: cw - 1.8, h: 0.5, fontSize: 16, color: ink(), bold: true, align: 'left', fontFace: heading() });
    txt(slide, it.desc, { x: x + 1.55, y: y + 0.7, w: cw - 1.8, h: ch - 0.85, fontSize: 12, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 9. strategy
// =====================================================================
function renderTheme08Strategy(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 4);
  const n = cols(items.length, 2);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  const ch = 1.4;
  items.forEach((it: any, i: number) => {
    const r = Math.floor(i / n);
    const c = i % n;
    const x = MX + c * (cw + gap);
    const y = BODY_TOP + r * (ch + 0.25);
    card(slide, x, y, cw, ch);
    slide.addShape('rect', { x, y, w: 0.08, h: ch, fill: { color: gold() } });
    txt(slide, it.title, { x: x + 0.3, y: y + 0.2, w: cw - 0.5, h: 0.45, fontSize: 17, color: ink(), bold: true, align: 'left', fontFace: heading() });
    txt(slide, it.desc, { x: x + 0.3, y: y + 0.68, w: cw - 0.5, h: ch - 0.8, fontSize: 12.5, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 10. process
// =====================================================================
function renderTheme08Process(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 5);
  const n = items.length;
  const gap = 0.4;
  const cw = (CW - gap * (n - 1)) / n;
  items.forEach((it: any, i: number) => {
    const x = MX + i * (cw + gap);
    card(slide, x, BODY_TOP, cw, 2.6);
    txt(slide, String(i + 1).padStart(2, '0'), { x: x + 0.2, y: BODY_TOP + 0.2, w: cw - 0.4, h: 0.6, fontSize: 28, color: gold(), align: 'left', bold: true, fontFace: mono() });
    txt(slide, it.title, { x: x + 0.2, y: BODY_TOP + 0.85, w: cw - 0.4, h: 0.6, fontSize: 15, color: ink(), bold: true, align: 'left', valign: 'top', fontFace: heading() });
    txt(slide, it.desc, { x: x + 0.2, y: BODY_TOP + 1.5, w: cw - 0.4, h: 1.0, fontSize: 11.5, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
    if (i < n - 1) {
      txt(slide, '→', { x: x + cw + 0.02, y: BODY_TOP + 1.0, w: gap, h: 0.5, fontSize: 20, color: gold(), align: 'center', valign: 'middle', bold: true });
    }
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 11. timeline
// =====================================================================
function renderTheme08Timeline(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 5);
  const n = items.length;
  const lineY = BODY_TOP + 0.35;
  slide.addShape('line', { x: MX, y: lineY, w: CW, h: 0, line: { color: gold(), width: 1.5 } });
  const step = CW / n;
  items.forEach((it: any, i: number) => {
    const cx = MX + step * i + step / 2;
    slide.addShape('ellipse', { x: cx - 0.09, y: lineY - 0.09, w: 0.18, h: 0.18, fill: { color: gold() } });
    txt(slide, it.year, { x: cx - step / 2, y: lineY + 0.15, w: step, h: 0.35, fontSize: 15, color: gold(), align: 'center', bold: true, fontFace: mono() });
    txt(slide, it.title, { x: cx - step / 2 + 0.1, y: lineY + 0.55, w: step - 0.2, h: 0.45, fontSize: 14, color: ink(), bold: true, align: 'center', fontFace: heading() });
    txt(slide, it.desc, { x: cx - step / 2 + 0.1, y: lineY + 1.0, w: step - 0.2, h: 1.4, fontSize: 11, color: ink2(), align: 'center', valign: 'top', fontFace: body() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 12. roadmap
// =====================================================================
function renderTheme08Roadmap(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 4);
  const n = items.length;
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  items.forEach((it: any, i: number) => {
    const x = MX + i * (cw + gap);
    card(slide, x, BODY_TOP, cw, 2.8);
    txt(slide, it.period, { x: x + 0.2, y: BODY_TOP + 0.2, w: cw - 0.4, h: 0.4, fontSize: 14, color: gold(), align: 'left', bold: true, fontFace: mono() });
    txt(slide, it.goal, { x: x + 0.2, y: BODY_TOP + 0.65, w: cw - 0.4, h: 0.6, fontSize: 15, color: ink(), bold: true, align: 'left', valign: 'top', fontFace: heading() });
    (it.points || []).slice(0, 4).forEach((pt: string, j: number) => {
      txt(slide, '· ' + pt, { x: x + 0.2, y: BODY_TOP + 1.3 + j * 0.36, w: cw - 0.4, h: 0.34, fontSize: 11, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
    });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 13. workflow
// =====================================================================
function renderTheme08Workflow(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const steps = (p.steps || []).slice(0, 5);
  const n = steps.length;
  const gap = 0.25;
  const cw = (CW - gap * (n - 1)) / n;
  steps.forEach((st: any, i: number) => {
    const x = MX + i * (cw + gap);
    card(slide, x, BODY_TOP, cw, 2.3);
    slide.addShape('ellipse', { x: x + cw / 2 - 0.3, y: BODY_TOP + 0.2, w: 0.6, h: 0.6, fill: { color: gold() } });
    txt(slide, st.num, { x: x + cw / 2 - 0.3, y: BODY_TOP + 0.2, w: 0.6, h: 0.6, fontSize: 20, color: isDark() ? '14130D' : 'FFFFFF', align: 'center', valign: 'middle', bold: true, fontFace: heading() });
    txt(slide, st.title, { x: x + 0.15, y: BODY_TOP + 0.95, w: cw - 0.3, h: 0.5, fontSize: 13.5, color: ink(), bold: true, align: 'center', valign: 'top', fontFace: heading() });
    txt(slide, st.desc, { x: x + 0.15, y: BODY_TOP + 1.45, w: cw - 0.3, h: 0.8, fontSize: 10.5, color: ink2(), align: 'center', valign: 'top', fontFace: body() });
  });
  const labels = p.timelineLabels || [];
  if (labels.length) {
    const step = CW / labels.length;
    labels.forEach((lb: string, i: number) => {
      txt(slide, lb, { x: MX + step * i, y: 4.85, w: step, h: 0.3, fontSize: 10, color: ink2(), align: 'center', fontFace: mono() });
    });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 14. team
// =====================================================================
function renderTheme08Team(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 4);
  const n = cols(items.length, 4);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  const ch = 2.5;
  items.forEach((m: any, i: number) => {
    const x = MX + i * (cw + gap);
    card(slide, x, BODY_TOP, cw, ch);
    const init = m.initial || (m.name ? m.name[0] : '?');
    slide.addShape('ellipse', { x: x + cw / 2 - 0.45, y: BODY_TOP + 0.25, w: 0.9, h: 0.9, fill: { color: gold() } });
    txt(slide, init, { x: x + cw / 2 - 0.45, y: BODY_TOP + 0.25, w: 0.9, h: 0.9, fontSize: 30, color: isDark() ? '14130D' : 'FFFFFF', align: 'center', valign: 'middle', bold: true, fontFace: heading() });
    txt(slide, m.name, { x: x + 0.1, y: BODY_TOP + 1.3, w: cw - 0.2, h: 0.4, fontSize: 15, color: ink(), bold: true, align: 'center', fontFace: heading() });
    txt(slide, m.role, { x: x + 0.1, y: BODY_TOP + 1.75, w: cw - 0.2, h: 0.6, fontSize: 11.5, color: ink2(), align: 'center', valign: 'top', fontFace: body() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 15. partners
// =====================================================================
function renderTheme08Partners(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 12);
  const n = cols(items.length, 4);
  const rows = Math.ceil(items.length / n);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  const ch = Math.min(1.0, (5.0 - BODY_TOP) / rows - 0.15);
  items.forEach((it: any, i: number) => {
    const r = Math.floor(i / n);
    const c = i % n;
    const x = MX + c * (cw + gap);
    const y = BODY_TOP + r * (ch + 0.15);
    card(slide, x, y, cw, ch);
    txt(slide, it.name, { x: x + 0.15, y, w: cw - 0.3, h: ch, fontSize: 14, color: ink(), align: 'center', valign: 'middle', bold: true, fontFace: heading() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 16. gallery
// =====================================================================
function renderTheme08Gallery(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 4);
  const n = cols(items.length, 2);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  const ch = 1.55;
  items.forEach((it: any, i: number) => {
    const r = Math.floor(i / n);
    const c = i % n;
    const x = MX + c * (cw + gap);
    const y = BODY_TOP + r * (ch + 0.3);
    const ih = ch - 0.35;
    if (it.imageUrl) {
      try { slide.addImage({ path: it.imageUrl, x, y, w: cw, h: ih }); } catch { slide.addShape('rect', { x, y, w: cw, h: ih, fill: { color: surfaceElev() }, line: { color: border(), width: 1 } }); }
    } else {
      slide.addShape('roundRect', { x, y, w: cw, h: ih, rectRadius: 0.05, fill: { color: surfaceElev() }, line: { color: gold(), width: 1 } });
      txt(slide, 'IMG', { x, y, w: cw, h: ih, fontSize: 14, color: gold(), align: 'center', valign: 'middle', fontFace: mono() });
    }
    txt(slide, it.caption, { x, y: y + ih + 0.05, w: cw, h: 0.3, fontSize: 12, color: ink2(), align: 'left', fontFace: body() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 17. collage
// =====================================================================
function renderTheme08Collage(slide: PptxSlide, p: any): void {
  bg(slide);
  if (p.tag) txt(slide, p.tag, { x: MX, y: 0.45, w: CW, h: 0.35, fontSize: 13, color: gold(), align: 'left', fontFace: mono(), bold: true, charSpacing: 2 });
  title(slide, p.title, MX, 0.82, CW, 28);
  txt(slide, p.subtitle, { x: MX, y: 1.5, w: 5.2, h: 0.8, fontSize: 14, color: ink2(), align: 'left', fontFace: body() });
  txt(slide, p.desc, { x: MX, y: 2.1, w: 5.2, h: 1.6, fontSize: 13, color: ink2(), align: 'left', valign: 'top', fontFace: body() });

  const photos = (p.photos || []).slice(0, 4);
  const gx = 6.1;
  const gw = 3.2;
  const positions = [
    { x: gx, y: BODY_TOP, w: gw, h: 1.3 },
    { x: gx, y: BODY_TOP + 1.45, w: gw / 2 - 0.1, h: 1.3 },
    { x: gx + gw / 2 + 0.1, y: BODY_TOP + 1.45, w: gw / 2 - 0.1, h: 1.3 },
    { x: gx, y: BODY_TOP + 2.9, w: gw, h: 1.3 },
  ];
  photos.forEach((ph: any, i: number) => {
    const pos = positions[i];
    if (!pos) return;
    if (ph.imageUrl) {
      try { slide.addImage({ path: ph.imageUrl, x: pos.x, y: pos.y, w: pos.w, h: pos.h }); } catch { slide.addShape('rect', { x: pos.x, y: pos.y, w: pos.w, h: pos.h, fill: { color: surfaceElev() }, line: { color: border(), width: 1 } }); }
    } else {
      slide.addShape('roundRect', { x: pos.x, y: pos.y, w: pos.w, h: pos.h, rectRadius: 0.05, fill: { color: surfaceElev() }, line: { color: (ph.labelColor || gold()), width: 1 } });
    }
    if (ph.label) txt(slide, ph.label, { x: pos.x + 0.1, y: pos.y + pos.h - 0.35, w: pos.w - 0.2, h: 0.3, fontSize: 10, color: ph.labelColor || gold(), align: 'left', bold: true, fontFace: mono() });
  });
  if (p.bigNumber) {
    txt(slide, p.bigNumber, { x: gx, y: 5.0, w: gw, h: 0.6, fontSize: 30, color: gold(), align: 'right', bold: true, fontFace: heading() });
    if (p.bigNumberLabel) txt(slide, p.bigNumberLabel, { x: gx, y: 5.55, w: gw, h: 0.25, fontSize: 10, color: ink2(), align: 'right', fontFace: mono() });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 18. bubble
// =====================================================================
function renderTheme08Bubble(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const groups = (p.groups || []).slice(0, 3);
  const n = groups.length;
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  groups.forEach((g: any, i: number) => {
    const x = MX + i * (cw + gap);
    card(slide, x, BODY_TOP, cw, 2.7);
    txt(slide, g.label, { x: x + 0.2, y: BODY_TOP + 0.2, w: cw - 0.4, h: 0.4, fontSize: 15, color: ink(), bold: true, align: 'left', fontFace: heading() });
    txt(slide, [g.count, g.total].filter(Boolean).join(' / '), { x: x + 0.2, y: BODY_TOP + 0.6, w: cw - 0.4, h: 0.5, fontSize: 24, color: gold(), align: 'left', bold: true, fontFace: heading() });
    (g.items || []).slice(0, 4).forEach((it: any, j: number) => {
      const label = typeof it === 'string' ? it : (it.label || it.name || '');
      txt(slide, '· ' + label, { x: x + 0.2, y: BODY_TOP + 1.2 + j * 0.36, w: cw - 0.4, h: 0.34, fontSize: 11, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
    });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 19. quote
// =====================================================================
function renderTheme08Quote(slide: PptxSlide, p: any): void {
  bg(slide);
  if (p.kicker) txt(slide, p.kicker, { x: MX, y: 1.0, w: CW, h: 0.35, fontSize: 13, color: gold(), align: 'center', fontFace: mono(), bold: true, charSpacing: 2 });
  txt(slide, '“', { x: MX, y: 1.2, w: 2, h: 1.2, fontSize: 90, color: gold(), align: 'left', fontFace: heading() });
  txt(slide, p.text, { x: 1.6, y: 1.7, w: CW - 1.8, h: 2.2, fontSize: 26, color: ink(), align: 'left', valign: 'top', bold: true, fontFace: heading() });
  if (p.author) txt(slide, '— ' + p.author, { x: 1.6, y: 4.0, w: CW - 1.8, h: 0.4, fontSize: 15, color: ink2(), align: 'left', fontFace: body() });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 20. closing
// =====================================================================
function renderTheme08Closing(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  txt(slide, p.title, { x: MX, y: 1.6, w: CW, h: 1.2, fontSize: 44, color: ink(), align: 'left', valign: 'middle', bold: true, fontFace: heading() });
  txt(slide, p.subtitle, { x: MX, y: 2.9, w: CW, h: 0.7, fontSize: 17, color: ink2(), align: 'left', fontFace: body() });
  const tags = (p.tags || []).slice(0, 5);
  let tx = MX;
  tags.forEach((t: string) => {
    const w = 0.4 + t.length * 0.18;
    slide.addShape('roundRect', { x: tx, y: 3.8, w, h: 0.45, rectRadius: 0.22, fill: { color: surfaceElev() }, line: { color: gold(), width: 1 } });
    txt(slide, t, { x: tx, y: 3.8, w, h: 0.45, fontSize: 12, color: gold(), align: 'center', valign: 'middle', fontFace: mono() });
    tx += w + 0.2;
  });
  if (p.contact) txt(slide, p.contact, { x: MX, y: 4.6, w: CW, h: 0.4, fontSize: 14, color: ink(), align: 'left', fontFace: body() });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 21. hero-split
// =====================================================================
function renderTheme08HeroSplit(slide: PptxSlide, p: any): void {
  bg(slide);
  const halfW = CW / 2 - 0.2;
  slide.addShape('line', { x: 5, y: BODY_TOP - 0.2, w: 0, h: 2.9, line: { color: gold(), width: 1.5 } });
  // left
  if (p.leftKicker) txt(slide, p.leftKicker, { x: MX, y: BODY_TOP, w: halfW, h: 0.35, fontSize: 13, color: gold(), align: 'left', fontFace: mono(), bold: true });
  txt(slide, p.leftTitle, { x: MX, y: BODY_TOP + 0.45, w: halfW, h: 1.0, fontSize: 26, color: ink(), align: 'left', valign: 'top', bold: true, fontFace: heading() });
  txt(slide, p.leftDesc, { x: MX, y: BODY_TOP + 1.5, w: halfW, h: 1.5, fontSize: 14, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
  // right
  const rx = 5.2;
  if (p.rightKicker) txt(slide, p.rightKicker, { x: rx, y: BODY_TOP, w: halfW, h: 0.35, fontSize: 13, color: gold(), align: 'left', fontFace: mono(), bold: true });
  txt(slide, p.rightTitle, { x: rx, y: BODY_TOP + 0.45, w: halfW, h: 1.0, fontSize: 26, color: ink(), align: 'left', valign: 'top', bold: true, fontFace: heading() });
  txt(slide, p.rightDesc, { x: rx, y: BODY_TOP + 1.5, w: halfW, h: 1.5, fontSize: 14, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
  if (p.watermarkNumber) txt(slide, p.watermarkNumber, { x: MX, y: 4.7, w: CW, h: 0.6, fontSize: 40, color: gold(), align: 'center', bold: true, fontFace: heading() });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 22. ecosystem
// =====================================================================
function renderTheme08Ecosystem(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title, MX, 0.82, 5, 26);
  // hub
  const hx = 3.6, hy = 3.0, hr = 1.3;
  slide.addShape('ellipse', { x: hx, y: hy - hr / 2, w: hr, h: hr, fill: { color: gold() } });
  txt(slide, p.hubName, { x: hx, y: hy - hr / 2 + 0.15, w: hr, h: 0.4, fontSize: 14, color: isDark() ? '14130D' : 'FFFFFF', align: 'center', bold: true, fontFace: heading() });
  txt(slide, [p.hubValue, p.hubUnit].filter(Boolean).join(' '), { x: hx, y: hy - hr / 2 + 0.5, w: hr, h: 0.5, fontSize: 20, color: isDark() ? '14130D' : 'FFFFFF', align: 'center', bold: true, fontFace: heading() });
  if (p.hubSub) txt(slide, p.hubSub, { x: hx, y: hy - hr / 2 + 0.95, w: hr, h: 0.3, fontSize: 9, color: isDark() ? '14130D' : 'FFFFFF', align: 'center', fontFace: mono() });
  const nodes = (p.nodes || []).slice(0, 6);
  const posMap: Record<string, [number, number]> = {
    top: [4.0, 1.7], right: [7.3, 2.8], bottom: [4.0, 4.3], left: [0.9, 2.8],
  };
  const order: Record<string, number> = { top: 0, right: 1, bottom: 2, left: 3 };
  nodes.sort((a: any, b: any) => (order[a.position] ?? 9) - (order[b.position] ?? 9));
  nodes.forEach((nd: any) => {
    const base = posMap[nd.position] || [4.0, 3.0];
    const nw = 2.2, nh = 0.9;
    card(slide, base[0], base[1], nw, nh);
    txt(slide, nd.name, { x: base[0] + 0.15, y: base[1] + 0.1, w: nw - 0.3, h: 0.35, fontSize: 13, color: ink(), bold: true, align: 'left', fontFace: heading() });
    txt(slide, [nd.value, nd.unit].filter(Boolean).join(' '), { x: base[0] + 0.15, y: base[1] + 0.45, w: nw - 0.3, h: 0.35, fontSize: 15, color: gold(), align: 'left', bold: true, fontFace: heading() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 23. case
// =====================================================================
function renderTheme08Case(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.name, MX, 0.95, 6, 30);
  if (p.logoText) {
    slide.addShape('roundRect', { x: 7.2, y: 0.95, w: 1.6, h: 0.7, rectRadius: 0.1, fill: { color: gold() } });
    txt(slide, p.logoText, { x: 7.2, y: 0.95, w: 1.6, h: 0.7, fontSize: 16, color: isDark() ? '14130D' : 'FFFFFF', align: 'center', valign: 'middle', bold: true, fontFace: heading() });
  }
  if (p.tag) txt(slide, p.tag, { x: MX, y: 1.6, w: CW, h: 0.35, fontSize: 13, color: gold(), align: 'left', fontFace: mono(), bold: true });
  txt(slide, p.desc, { x: MX, y: 2.0, w: CW, h: 1.2, fontSize: 14, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
  const metrics = (p.metrics || []).slice(0, 3);
  if (metrics.length) {
    const mw = CW / metrics.length;
    metrics.forEach((m: any, i: number) => {
      const x = MX + i * mw;
      txt(slide, [m.num].filter(Boolean).join(''), { x, y: 3.6, w: mw, h: 0.6, fontSize: 28, color: gold(), align: 'left', bold: true, fontFace: heading() });
      txt(slide, m.label, { x, y: 4.2, w: mw, h: 0.4, fontSize: 12, color: ink2(), align: 'left', fontFace: body() });
    });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 24. funding
// =====================================================================
function renderTheme08Funding(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const rows = (p.rows || []).slice(0, 5);
  let y = BODY_TOP;
  const rowH = (5.0 - BODY_TOP) / Math.max(rows.length, 1);
  rows.forEach((r: any) => {
    card(slide, MX, y, CW, rowH - 0.12, r.alt ? surfaceElev() : undefined);
    txt(slide, r.name, { x: MX + 0.2, y: y + 0.05, w: 2.4, h: rowH - 0.2, fontSize: 15, color: ink(), bold: true, align: 'left', valign: 'middle', fontFace: heading() });
    txt(slide, r.nameSub, { x: MX + 0.2, y: y + rowH / 2, w: 2.4, h: rowH / 2, fontSize: 10, color: ink2(), align: 'left', fontFace: body() });
    // dots
    const dotN = Math.min(r.dotCount || 0, 10);
    let dx = MX + 2.7;
    for (let k = 0; k < dotN; k++) {
      slide.addShape('ellipse', { x: dx, y: y + rowH / 2 - 0.05, w: 0.1, h: 0.1, fill: { color: gold() } });
      dx += 0.16;
    }
    txt(slide, r.count, { x: MX + 4.6, y, w: 1.2, h: rowH - 0.12, fontSize: 18, color: gold(), align: 'left', valign: 'middle', bold: true, fontFace: heading() });
    txt(slide, '均值 ' + (r.avg || ''), { x: MX + 5.8, y, w: 1.6, h: rowH - 0.12, fontSize: 11, color: ink2(), align: 'left', valign: 'middle', fontFace: body() });
    txt(slide, '信号 ' + (r.signalCount || 0), { x: MX + 7.4, y, w: 1.4, h: rowH - 0.12, fontSize: 11, color: ink2(), align: 'right', valign: 'middle', fontFace: body() });
    y += rowH;
  });
  if (p.summaryPct) {
    txt(slide, [p.summaryLabel, p.summaryPct].filter(Boolean).join('  '), { x: MX, y: 5.05, w: CW, h: 0.3, fontSize: 12, color: gold(), align: 'left', bold: true, fontFace: heading() });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 25. matrix（2x2）
// =====================================================================
function renderTheme08Matrix(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const cells = (p.cells || []).slice(0, 4);
  const gap = 0.25;
  const cw = (CW - gap) / 2;
  const ch = 1.45;
  const positions = [
    { x: MX, y: BODY_TOP },
    { x: MX + cw + gap, y: BODY_TOP },
    { x: MX, y: BODY_TOP + ch + gap },
    { x: MX + cw + gap, y: BODY_TOP + ch + gap },
  ];
  cells.forEach((c: any, i: number) => {
    const pos = positions[i];
    const fill = c.dark ? gold() : surfaceElev();
    const tcol = c.dark ? (isDark() ? '14130D' : 'FFFFFF') : ink();
    card(slide, pos.x, pos.y, cw, ch, fill);
    txt(slide, c.title, { x: pos.x + 0.2, y: pos.y + 0.15, w: cw - 0.4, h: 0.4, fontSize: 15, color: tcol, bold: true, align: 'left', fontFace: heading() });
    txt(slide, c.desc, { x: pos.x + 0.2, y: pos.y + 0.55, w: cw - 0.4, h: ch - 0.7, fontSize: 11, color: tcol, align: 'left', valign: 'top', fontFace: body() });
    if (c.cornerBadge) txt(slide, c.cornerBadge, { x: pos.x + cw - 1.0, y: pos.y + 0.1, w: 0.9, h: 0.3, fontSize: 10, color: tcol, align: 'right', bold: true, fontFace: mono() });
  });
  if (p.xAxisLabel || p.yAxisLabel) {
    txt(slide, [p.xAxisLabel, p.yAxisLabel].filter(Boolean).join('   ·   '), { x: MX, y: 5.05, w: CW, h: 0.3, fontSize: 10, color: ink2(), align: 'left', fontFace: mono() });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 26. quadrant（2x2）
// =====================================================================
function renderTheme08Quadrant(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 4);
  const gap = 0.25;
  const cw = (CW - gap) / 2;
  const ch = 1.45;
  const positions = [
    { x: MX, y: BODY_TOP },
    { x: MX + cw + gap, y: BODY_TOP },
    { x: MX, y: BODY_TOP + ch + gap },
    { x: MX + cw + gap, y: BODY_TOP + ch + gap },
  ];
  items.forEach((it: any, i: number) => {
    const pos = positions[i];
    card(slide, pos.x, pos.y, cw, ch);
    if (it.label) txt(slide, it.label, { x: pos.x + 0.2, y: pos.y + 0.12, w: cw - 0.4, h: 0.3, fontSize: 11, color: gold(), align: 'left', bold: true, fontFace: mono() });
    txt(slide, it.title, { x: pos.x + 0.2, y: pos.y + 0.42, w: cw - 0.4, h: 0.4, fontSize: 15, color: ink(), bold: true, align: 'left', fontFace: heading() });
    txt(slide, it.desc, { x: pos.x + 0.2, y: pos.y + 0.82, w: cw - 0.4, h: ch - 0.95, fontSize: 11, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 27. scorecard
// =====================================================================
function renderTheme08Scorecard(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const cards = (p.cards || []).slice(0, 4);
  const n = cards.length;
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  cards.forEach((c: any, i: number) => {
    const x = MX + i * (cw + gap);
    card(slide, x, BODY_TOP, cw, 2.7, c.highlight ? gold() : undefined);
    const tcol = c.highlight ? (isDark() ? '14130D' : 'FFFFFF') : ink();
    txt(slide, c.label, { x: x + 0.2, y: BODY_TOP + 0.2, w: cw - 0.4, h: 0.35, fontSize: 13, color: tcol, align: 'left', fontFace: body() });
    txt(slide, c.value, { x: x + 0.2, y: BODY_TOP + 0.55, w: cw - 0.4, h: 0.7, fontSize: 30, color: tcol, align: 'left', bold: true, fontFace: heading() });
    if (c.change) {
      const up = c.changeDir !== 'down';
      slide.addShape('roundRect', { x: x + 0.2, y: BODY_TOP + 1.35, w: 1.0, h: 0.35, rectRadius: 0.17, fill: { color: up ? (isDark() ? '1A1812' : 'E8F5E9') : (isDark() ? '2C1414' : 'FDECEA') } });
      txt(slide, (up ? '▲ ' : '▼ ') + c.change, { x: x + 0.2, y: BODY_TOP + 1.35, w: 1.0, h: 0.35, fontSize: 11, color: up ? (isDark() ? '3DDC84' : '1B7A3D') : (isDark() ? 'FF6B6B' : 'C0392B'), align: 'center', valign: 'middle', bold: true, fontFace: mono() });
    }
    if (c.desc) txt(slide, c.desc, { x: x + 0.2, y: BODY_TOP + 1.85, w: cw - 0.4, h: 0.8, fontSize: 11, color: tcol, align: 'left', valign: 'top', fontFace: body() });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 28. region
// =====================================================================
function renderTheme08Region(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const regions = (p.regions || []).slice(0, 7);
  let y = BODY_TOP;
  const rowH = (5.0 - BODY_TOP) / Math.max(regions.length, 1);
  // find max for bar scaling
  const maxV = Math.max(...regions.map((r: any) => parseFloat(r.value) || 0), 1);
  regions.forEach((r: any) => {
    txt(slide, r.city, { x: MX, y, w: 2.2, h: rowH - 0.1, fontSize: 14, color: ink(), bold: true, align: 'left', valign: 'middle', fontFace: heading() });
    const v = parseFloat(r.value) || 0;
    const bw = (CW - 2.4) * (v / maxV);
    slide.addShape('roundRect', { x: MX + 2.3, y: y + (rowH - 0.1) / 2 - 0.12, w: Math.max(bw, 0.1), h: 0.24, rectRadius: 0.12, fill: { color: gold() } });
    txt(slide, r.value, { x: MX + 2.3 + Math.max(bw, 0.1) + 0.1, y, w: 1.5, h: rowH - 0.1, fontSize: 13, color: ink2(), align: 'left', valign: 'middle', fontFace: mono() });
    y += rowH;
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 29. range
// =====================================================================
function renderTheme08Range(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const rows = (p.rows || []).slice(0, 5);
  let y = BODY_TOP;
  const rowH = (5.0 - BODY_TOP) / Math.max(rows.length, 1);
  const maxHigh = Math.max(...rows.map((r: any) => r.high || 0), 1);
  rows.forEach((r: any) => {
    txt(slide, r.name, { x: MX, y, w: 2.0, h: rowH - 0.1, fontSize: 13, color: ink(), bold: true, align: 'left', valign: 'middle', fontFace: heading() });
    txt(slide, r.nameSub, { x: MX, y: y + rowH / 2, w: 2.0, h: rowH / 2, fontSize: 9, color: ink2(), align: 'left', fontFace: body() });
    const trackX = MX + 2.2;
    const trackW = CW - 2.2 - 1.6;
    slide.addShape('roundRect', { x: trackX, y: y + (rowH - 0.1) / 2 - 0.09, w: trackW, h: 0.18, rectRadius: 0.09, fill: { color: surfaceElev() } });
    const lowX = trackX + trackW * (r.low / maxHigh);
    const highX = trackX + trackW * (r.high / maxHigh);
    slide.addShape('roundRect', { x: lowX, y: y + (rowH - 0.1) / 2 - 0.11, w: Math.max(highX - lowX, 0.1), h: 0.22, rectRadius: 0.11, fill: { color: r.highlight ? gold() : (isDark() ? 'B8AE98' : '524C3D') } });
    txt(slide, [r.lowVal, r.highVal].filter(Boolean).join(' – '), { x: MX + CW - 1.5, y, w: 1.5, h: rowH - 0.1, fontSize: 11, color: ink2(), align: 'right', valign: 'middle', fontFace: mono() });
    y += rowH;
  });
  if (p.midLabel) txt(slide, p.midLabel, { x: MX, y: 5.05, w: CW, h: 0.3, fontSize: 10, color: ink2(), align: 'left', fontFace: mono() });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 30. heatmap
// =====================================================================
function renderTheme08Heatmap(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const cells = (p.cells || []).slice(0, 12);
  const n = cols(cells.length, 6);
  const rowsN = Math.ceil(cells.length / n);
  const gap = 0.15;
  const cw = (CW - gap * (n - 1)) / n;
  const ch = Math.min(0.95, (5.0 - BODY_TOP) / rowsN - gap);
  cells.forEach((c: any, i: number) => {
    const r = Math.floor(i / n);
    const col = i % n;
    const x = MX + col * (cw + gap);
    const y = BODY_TOP + r * (ch + gap);
    slide.addShape('roundRect', { x, y, w: cw, h: ch, rectRadius: 0.05, fill: { color: c.color || gold() } });
    txt(slide, c.month, { x: x + 0.05, y: y + 0.02, w: cw - 0.1, h: 0.3, fontSize: 9, color: isDark() ? '14130D' : '1A1812', align: 'left', bold: true, fontFace: mono() });
    txt(slide, c.value + (c.unit || ''), { x: x + 0.05, y: y + ch - 0.4, w: cw - 0.1, h: 0.35, fontSize: 12, color: isDark() ? '14130D' : '1A1812', align: 'left', bold: true, fontFace: heading() });
  });
  if (p.scaleMin || p.scaleMax) {
    txt(slide, [p.scaleMin, p.scaleMax, p.scaleUnit].filter(Boolean).join('  '), { x: MX, y: 5.05, w: CW, h: 0.3, fontSize: 10, color: ink2(), align: 'left', fontFace: mono() });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 31. waterfall
// =====================================================================
function renderTheme08Waterfall(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const bars = (p.bars || []).slice(0, 7);
  const n = bars.length;
  const gap = 0.25;
  const cw = (CW - gap * (n - 1)) / n;
  const baseY = 4.6;
  const maxV = Math.max(...bars.map((b: any) => Math.abs(b.value)), 1);
  const scale = (baseY - BODY_TOP - 0.3) / maxV;
  let cum = 0;
  bars.forEach((b: any, i: number) => {
    const x = MX + i * (cw + gap);
    const startY = baseY - cum * scale;
    const h = Math.abs(b.value) * scale;
    const top = b.value >= 0 ? startY - h : startY;
    slide.addShape('roundRect', { x, y: top, w: cw, h: Math.max(h, 0.05), rectRadius: 0.03, fill: { color: b.color || (b.value >= 0 ? gold() : (isDark() ? 'FF6B6B' : 'C0392B')) } });
    txt(slide, b.value + (b.pct || ''), { x, y: top - 0.35, w: cw, h: 0.3, fontSize: 12, color: ink(), align: 'center', bold: true, fontFace: heading() });
    txt(slide, b.label, { x, y: baseY + 0.05, w: cw, h: 0.3, fontSize: 10, color: ink2(), align: 'center', fontFace: body() });
    if (b.sub) txt(slide, b.sub, { x, y: baseY + 0.33, w: cw, h: 0.25, fontSize: 8.5, color: ink2(), align: 'center', fontFace: mono() });
    cum += b.value;
  });
  if (p.totalValue) {
    txt(slide, [p.totalLabel, p.totalValue].filter(Boolean).join('：'), { x: MX, y: 5.05, w: CW, h: 0.3, fontSize: 12, color: gold(), align: 'left', bold: true, fontFace: heading() });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 32. chart-bar
// =====================================================================
function renderTheme08ChartBar(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const bars = (p.bars || []).slice(0, 8);
  if (bars.length) {
    slide.addChart('bar', [{ name: p.title || '数据', labels: bars.map((b: any) => b.label), values: bars.map((b: any) => parseFloat(b.value) || 0) }], {
      x: MX, y: BODY_TOP, w: CW, h: 2.9,
      chartColors: [gold()],
      barDir: 'col',
      showValue: true,
      dataLabelColor: ink(),
      dataLabelFontSize: 10,
      catAxisLabelColor: ink2(),
      valAxisLabelColor: ink2(),
      catAxisLabelFontFace: body(),
      valAxisLabelFontFace: body(),
    } as any);
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 33. chart-donut
// =====================================================================
function renderTheme08ChartDonut(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const segs = (p.segments || []).slice(0, 8);
  if (segs.length) {
    slide.addChart('doughnut' as 'pie', [{ name: p.title || '占比', labels: segs.map((s: any) => s.name), values: segs.map((s: any) => parseFloat(s.value) || 0) }], {
      x: 0.8, y: BODY_TOP, w: 5.2, h: 2.9,
      chartColors: S.chartColors,
      holeSize: 60,
      showValue: false,
      showLegend: true,
      legendColor: ink2(),
      legendFontFace: body(),
      legendFontSize: 10,
    } as any);
    if (p.centerNum) {
      txt(slide, p.centerNum, { x: 2.5, y: BODY_TOP + 1.0, w: 1.6, h: 0.6, fontSize: 24, color: gold(), align: 'center', valign: 'middle', bold: true, fontFace: heading() });
      if (p.centerLabel) txt(slide, p.centerLabel, { x: 2.5, y: BODY_TOP + 1.55, w: 1.6, h: 0.3, fontSize: 10, color: ink2(), align: 'center', fontFace: body() });
    }
    // legend values on right
    let ly = BODY_TOP + 0.2;
    segs.forEach((s: any) => {
      txt(slide, [s.name, s.value].filter(Boolean).join('  '), { x: 6.4, y: ly, w: 3, h: 0.35, fontSize: 12, color: ink(), align: 'left', fontFace: body() });
      ly += 0.45;
    });
  }
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 34. gauge
// =====================================================================
function renderTheme08Gauge(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  if (p.year) txt(slide, p.year, { x: MX, y: 1.5, w: CW, h: 0.35, fontSize: 13, color: gold(), align: 'left', fontFace: mono(), bold: true });
  // big value
  txt(slide, [p.value, p.unit].filter(Boolean).join(''), { x: MX, y: 2.0, w: 4.5, h: 1.4, fontSize: 80, color: gold(), align: 'left', valign: 'middle', bold: true, fontFace: heading() });
  if (p.desc) txt(slide, p.desc, { x: MX, y: 3.6, w: 4.5, h: 1.0, fontSize: 14, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
  // progress bar (value as percentage of 100)
  const pct = Math.max(0, Math.min(100, parseFloat(p.value) || 0));
  slide.addShape('roundRect', { x: 5.4, y: 2.4, w: 3.8, h: 0.3, rectRadius: 0.15, fill: { color: surfaceElev() } });
  slide.addShape('roundRect', { x: 5.4, y: 2.4, w: 3.8 * (pct / 100), h: 0.3, rectRadius: 0.15, fill: { color: gold() } });
  txt(slide, pct.toFixed(0) + '%', { x: 5.4, y: 2.75, w: 3.8, h: 0.3, fontSize: 12, color: ink2(), align: 'left', fontFace: mono() });
  const breakdown = (p.breakdown || []).slice(0, 5);
  let by = 3.3;
  breakdown.forEach((b: any) => {
    txt(slide, [b.label, b.value].filter(Boolean).join('  '), { x: 5.4, y: by, w: 3.8, h: 0.35, fontSize: 12, color: ink(), align: 'left', fontFace: body() });
    by += 0.42;
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 35. radar
// =====================================================================
function renderTheme08Radar(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const axes = (p.axes || []).slice(0, 8);
  if (axes.length) {
    slide.addChart('radar' as any, [{ name: p.title || '能力', labels: axes.map((a: any) => a.label), values: axes.map((a: any) => a.value || 0) }], {
      x: MX, y: BODY_TOP, w: 5.4, h: 2.9,
      chartColors: [gold()],
      showValue: false,
      catAxisLabelColor: ink2(),
      catAxisLabelFontFace: body(),
      catAxisLabelFontSize: 10,
    } as any);
  }
  const metrics = (p.metrics || []).slice(0, 6);
  let my = BODY_TOP + 0.1;
  metrics.forEach((m: any) => {
    txt(slide, m.label, { x: 6.4, y: my, w: 3, h: 0.3, fontSize: 12, color: ink(), bold: true, align: 'left', fontFace: heading() });
    txt(slide, String(m.value), { x: 6.4, y: my + 0.3, w: 1.5, h: 0.3, fontSize: 14, color: gold(), align: 'left', bold: true, fontFace: heading() });
    if (m.delta) txt(slide, (m.delta > 0 ? '▲' : '▼') + ' ' + m.delta, { x: 8.0, y: my + 0.3, w: 1.4, h: 0.3, fontSize: 11, color: m.delta > 0 ? (isDark() ? '3DDC84' : '1B7A3D') : (isDark() ? 'FF6B6B' : 'C0392B'), align: 'left', fontFace: mono() });
    my += 0.45;
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 36. ranking
// =====================================================================
function renderTheme08Ranking(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 6);
  const maxV = Math.max(...items.map((it: any) => parseFloat(it.value) || 0), 1);
  let y = BODY_TOP;
  const rowH = (5.0 - BODY_TOP) / Math.max(items.length, 1);
  items.forEach((it: any, i: number) => {
    const rank = String(i + 1).padStart(2, '0');
    txt(slide, rank, { x: MX, y, w: 0.7, h: rowH - 0.1, fontSize: 18, color: it.accent ? gold() : ink2(), align: 'left', valign: 'middle', bold: true, fontFace: mono() });
    txt(slide, it.name, { x: MX + 0.8, y, w: 3.2, h: rowH - 0.1, fontSize: 14, color: ink(), bold: true, align: 'left', valign: 'middle', fontFace: heading() });
    const trackX = MX + 4.1;
    const trackW = CW - 4.1 - 1.3;
    const v = parseFloat(it.value) || 0;
    slide.addShape('roundRect', { x: trackX, y: y + (rowH - 0.1) / 2 - 0.1, w: trackW, h: 0.2, rectRadius: 0.1, fill: { color: surfaceElev() } });
    slide.addShape('roundRect', { x: trackX, y: y + (rowH - 0.1) / 2 - 0.1, w: Math.max(trackW * (v / maxV), 0.1), h: 0.2, rectRadius: 0.1, fill: { color: it.accent ? gold() : (isDark() ? 'B8AE98' : '524C3D') } });
    txt(slide, (p.unit ? it.value + ' ' + p.unit : it.value), { x: MX + CW - 1.2, y, w: 1.2, h: rowH - 0.1, fontSize: 13, color: ink2(), align: 'right', valign: 'middle', fontFace: mono() });
    y += rowH;
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 37. compare
// =====================================================================
function renderTheme08Compare(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 6);
  const left = items.filter((it: any) => it.side !== 'right').slice(0, 3);
  const right = items.filter((it: any) => it.side === 'right').slice(0, 3);
  const halfW = CW / 2 - 0.2;
  slide.addShape('line', { x: 5, y: BODY_TOP - 0.1, w: 0, h: 2.9, line: { color: border(), width: 1 } });
  const drawCol = (arr: any[], x: number) => {
    let y = BODY_TOP;
    const rh = 2.9 / Math.max(arr.length, 1);
    arr.forEach((it: any) => {
      txt(slide, it.title, { x, y, w: halfW - 0.2, h: 0.4, fontSize: 15, color: gold(), bold: true, align: 'left', fontFace: heading() });
      txt(slide, it.desc, { x, y: y + 0.4, w: halfW - 0.2, h: rh - 0.45, fontSize: 12, color: ink2(), align: 'left', valign: 'top', fontFace: body() });
      y += rh;
    });
  };
  drawCol(left, MX);
  drawCol(right, 5.2);
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 38. table
// =====================================================================
function renderTheme08Table(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const headers = (p.headers || []).slice(0, 4);
  const rows = (p.rows || []).slice(0, 8);
  const colsN = Math.max(headers.length, 1);
  const gap = 0.1;
  const cw = (CW - gap * (colsN - 1)) / colsN;
  const headY = BODY_TOP;
  // header
  headers.forEach((h: string, i: number) => {
    const x = MX + i * (cw + gap);
    slide.addShape('rect', { x, y: headY, w: cw, h: 0.45, fill: { color: gold() } });
    txt(slide, h, { x: x + 0.15, y: headY, w: cw - 0.3, h: 0.45, fontSize: 13, color: isDark() ? '14130D' : 'FFFFFF', align: 'left', valign: 'middle', bold: true, fontFace: heading() });
  });
  const rowH = (5.0 - BODY_TOP - 0.55) / Math.max(rows.length, 1);
  rows.forEach((r: any, ri: number) => {
    const y = headY + 0.55 + ri * rowH;
    if (ri % 2 === 1) slide.addShape('rect', { x: MX, y, w: CW, h: rowH, fill: { color: surfaceElev() } });
    const cellsArr = [r.c1, r.c2, r.c3, r.c4].slice(0, colsN);
    cellsArr.forEach((c: string, i: number) => {
      const x = MX + i * (cw + gap);
      txt(slide, c, { x: x + 0.15, y, w: cw - 0.3, h: rowH, fontSize: 12, color: ink(), align: 'left', valign: 'middle', fontFace: body() });
    });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// 39. chain
// =====================================================================
function renderTheme08Chain(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const layers = (p.layers || []).slice(0, 5);
  const n = layers.length;
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  layers.forEach((l: any, i: number) => {
    const x = MX + i * (cw + gap);
    const fill = l.dark ? gold() : surfaceElev();
    const tcol = l.dark ? (isDark() ? '14130D' : 'FFFFFF') : ink();
    card(slide, x, BODY_TOP, cw, 2.6, fill);
    txt(slide, l.title, { x: x + 0.2, y: BODY_TOP + 0.25, w: cw - 0.4, h: 0.7, fontSize: 17, color: tcol, bold: true, align: 'left', valign: 'top', fontFace: heading() });
    txt(slide, l.subtitle, { x: x + 0.2, y: BODY_TOP + 1.0, w: cw - 0.4, h: 1.4, fontSize: 12, color: tcol, align: 'left', valign: 'top', fontFace: body() });
    if (i < n - 1) {
      txt(slide, '→', { x: x + cw + 0.02, y: BODY_TOP + 1.0, w: gap, h: 0.5, fontSize: 18, color: gold(), align: 'center', valign: 'middle', bold: true });
    }
  });
  footer(slide, p.footnoteLeft, p.footnoteRight);
}

// =====================================================================
// v2 变体版式家族渲染器（cover/chapter/quote/cards/bars/line/dumbbell/panels/statwall/arch/capital）
// =====================================================================

function foot(p: any): [string | undefined, string | undefined] {
  return [p.footnoteLeft || p.footerLeft, p.footnoteRight || p.footerRight];
}

function gridGeom(n: number, perRow: number, top = BODY_TOP, bottom = 5.0) {
  const rows = Math.max(1, Math.ceil(n / perRow));
  const gap = 0.18;
  const cw = (CW - gap * (perRow - 1)) / perRow;
  const ch = (bottom - top - gap * (rows - 1)) / rows;
  return { rows, perRow, gap, cw, ch, top, bottom };
}

function renderT08Cover2(slide: PptxSlide, p: any): void {
  bg(slide);
  if (p.tag) kicker(slide, p.tag);
  title(slide, p.title, MX, 1.5, CW, 40);
  subtitle(slide, p.subtitle);
  const stats = (p.stats || []).slice(0, 4);
  if (stats.length) {
    const mw = CW / stats.length;
    stats.forEach((m: any, i: number) => {
      const x = MX + i * mw;
      txt(slide, [m.value, m.unit].filter(Boolean).join(' '), { x, y: 3.7, w: mw, h: 0.5, fontSize: 24, color: m.accent ? gold() : ink(), bold: true, align: 'left', fontFace: heading() });
      txt(slide, m.label, { x, y: 4.22, w: mw, h: 0.35, fontSize: 12, color: ink2(), align: 'left' });
    });
  }
  footer(slide, ...foot(p));
}

function renderT08Chapter2(slide: PptxSlide, p: any): void {
  bg(slide);
  if (p.chapterNo) txt(slide, p.chapterNo, { x: MX, y: 1.3, w: CW, h: 1.7, fontSize: 100, color: gold(), bold: true, align: 'left', fontFace: heading() });
  title(slide, p.title, MX, 3.1, CW, 36);
  subtitle(slide, p.subtitle);
  footer(slide, ...foot(p));
}

function renderT08Quote2(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker);
  txt(slide, p.quote, { x: MX, y: 1.5, w: CW, h: 2.4, fontSize: 28, color: ink(), bold: true, align: 'left', valign: 'top', fontFace: heading() });
  if (p.fieldA) txt(slide, p.fieldA, { x: MX, y: 3.9, w: CW, h: 0.6, fontSize: 16, color: ink2(), valign: 'top' });
  if (p.cite) txt(slide, p.cite, { x: MX, y: 4.7, w: CW, h: 0.4, fontSize: 13, color: ink2(), italic: true });
  footer(slide, ...foot(p));
}

function renderT08GridCards(slide: PptxSlide, p: any, opts: { cols: number; list?: boolean }): void {
  bg(slide);
  kicker(slide, p.kicker);
  title(slide, p.title);
  subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, opts.list ? 6 : 12);
  const perRow = opts.list ? 1 : Math.min(opts.cols, items.length || 1);
  const g = gridGeom(items.length || 1, perRow);
  items.forEach((it: any, i: number) => {
    const r = Math.floor(i / perRow), c = i % perRow;
    const x = MX + c * (g.cw + g.gap);
    const y = g.top + r * (g.ch + g.gap);
    card(slide, x, y, g.cw, g.ch);
    let yy = y + 0.18;
    if (it.num != null && it.num !== '') { txt(slide, [it.num, it.unit].filter(Boolean).join(' '), { x: x + 0.2, y: yy, w: g.cw - 0.4, h: 0.4, fontSize: 22, color: gold(), bold: true, fontFace: heading() }); yy += 0.5; }
    if (it.title) { txt(slide, it.title, { x: x + 0.2, y: yy, w: g.cw - 0.4, h: 0.4, fontSize: 15, color: ink(), bold: true, fontFace: heading() }); yy += 0.45; }
    if (it.desc) { txt(slide, it.desc, { x: x + 0.2, y: yy, w: g.cw - 0.4, h: g.ch - (yy - y) - 0.2, fontSize: 11, color: ink2(), align: 'left', valign: 'top' }); }
  });
  footer(slide, ...foot(p));
}

function renderT08Bars(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker); title(slide, p.title); subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 7);
  const top = BODY_TOP + 0.1; const rowH = (4.95 - top) / Math.max(items.length, 1);
  const maxV = Math.max(1, ...items.map((d: any) => Number(d.value) || 0));
  items.forEach((d: any, i: number) => {
    const y = top + i * rowH;
    txt(slide, d.label, { x: MX, y, w: 2.0, h: rowH * 0.7, fontSize: 13, color: ink(), align: 'left', valign: 'middle', fontFace: body() });
    const trackX = MX + 2.1, trackW = CW - 2.1 - 1.0;
    slide.addShape('roundRect', { x: trackX, y: y + rowH * 0.18, w: trackW, h: rowH * 0.5, rectRadius: 0.04, fill: { color: surfaceElev() } });
    const fw = trackW * (Number(d.value) || 0) / maxV;
    slide.addShape('roundRect', { x: trackX, y: y + rowH * 0.18, w: Math.max(0.05, fw), h: rowH * 0.5, rectRadius: 0.04, fill: { color: i % 2 ? gold() : 'C9962E' } });
    txt(slide, String(d.value), { x: trackX + trackW + 0.05, y, w: 1.0, h: rowH * 0.7, fontSize: 14, color: ink(), bold: true, align: 'right', valign: 'middle', fontFace: heading() });
  });
  footer(slide, ...foot(p));
}

function renderT08Line(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker); title(slide, p.title); subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 10);
  const maxV = Math.max(1, ...items.map((d: any) => Number(d.value) || 0));
  const baseY = 4.85; const top = BODY_TOP + 0.2; const avail = baseY - top;
  const gap = 0.2; const cw = (CW - gap * (items.length - 1)) / items.length;
  items.forEach((d: any, i: number) => {
    const x = MX + i * (cw + gap);
    const h = avail * (Number(d.value) || 0) / maxV;
    slide.addShape('rect', { x, y: baseY - h, w: cw, h, fill: { color: i % 2 ? gold() : 'C9962E' } });
    txt(slide, String(d.value), { x, y: baseY - h - 0.3, w: cw, h: 0.3, fontSize: 11, color: ink(), align: 'center', bold: true, fontFace: heading() });
    txt(slide, d.label, { x, y: baseY + 0.05, w: cw, h: 0.3, fontSize: 10, color: ink2(), align: 'center' });
  });
  footer(slide, ...foot(p));
}

function renderT08Dumbbell(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker); title(slide, p.title); subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 7);
  const top = BODY_TOP + 0.2; const rowH = (4.85 - top) / Math.max(items.length, 1);
  const maxV = Math.max(1, ...items.flatMap((d: any) => [Number(d.a) || 0, Number(d.b) || 0]));
  items.forEach((d: any, i: number) => {
    const y = top + i * rowH + rowH * 0.4;
    txt(slide, d.label, { x: MX, y: y - 0.2, w: 1.8, h: 0.4, fontSize: 12, color: ink(), align: 'left', valign: 'middle' });
    const trackX = MX + 1.9, trackW = CW - 1.9 - 0.9;
    slide.addShape('roundRect', { x: trackX, y: y - 0.04, w: trackW, h: 0.08, rectRadius: 0.04, fill: { color: surfaceElev() } });
    const ax = trackX + trackW * (Number(d.a) || 0) / maxV;
    const bx = trackX + trackW * (Number(d.b) || 0) / maxV;
    slide.addShape('oval', { x: ax - 0.12, y: y - 0.12, w: 0.24, h: 0.24, fill: { color: gold() } });
    slide.addShape('oval', { x: bx - 0.12, y: y - 0.12, w: 0.24, h: 0.24, fill: { color: 'C9962E' } });
    txt(slide, [d.a, d.b].filter(Boolean).join('→'), { x: trackX + trackW + 0.05, y: y - 0.2, w: 0.9, h: 0.4, fontSize: 11, color: ink2(), align: 'left' });
  });
  footer(slide, ...foot(p));
}

function renderT08Panels(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker); title(slide, p.title); subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 5);
  const top = BODY_TOP + 0.1; const rowH = (4.9 - top) / Math.max(items.length, 1);
  items.forEach((it: any, i: number) => {
    const y = top + i * rowH;
    card(slide, MX, y, CW, rowH - 0.15);
    slide.addShape('rect', { x: MX, y, w: 0.08, h: rowH - 0.15, fill: { color: gold() } });
    if (it.name) txt(slide, it.name, { x: MX + 0.25, y: y + 0.12, w: 3.0, h: rowH - 0.3, fontSize: 16, color: ink(), bold: true, valign: 'middle', fontFace: heading() });
    if (it.note) txt(slide, it.note, { x: MX + 3.4, y: y + 0.12, w: CW - 3.6, h: rowH - 0.3, fontSize: 12, color: ink2(), valign: 'middle' });
  });
  footer(slide, ...foot(p));
}

function renderT08Statwall(slide: PptxSlide, p: any, opts: { cols: number }): void {
  bg(slide);
  kicker(slide, p.kicker); title(slide, p.title); subtitle(slide, p.subtitle);
  const items = (p.items || []).slice(0, 8);
  const perRow = Math.min(opts.cols, items.length || 1);
  const g = gridGeom(items.length || 1, perRow, BODY_TOP + 0.2);
  items.forEach((it: any, i: number) => {
    const r = Math.floor(i / perRow), c = i % perRow;
    const x = MX + c * (g.cw + g.gap), y = g.top + r * (g.ch + g.gap);
    card(slide, x, y, g.cw, g.ch);
    txt(slide, [it.value, it.unit].filter(Boolean).join(' '), { x: x + 0.2, y: y + 0.2, w: g.cw - 0.4, h: 0.6, fontSize: 30, color: gold(), bold: true, fontFace: heading() });
    txt(slide, it.label, { x: x + 0.2, y: y + 0.85, w: g.cw - 0.4, h: g.ch - 1.0, fontSize: 12, color: ink2(), valign: 'top' });
  });
  footer(slide, ...foot(p));
}

function renderT08ArchFlow(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker); title(slide, p.title); subtitle(slide, p.subtitle);
  const nodes = (p.nodes || p.items || []).slice(0, 6);
  const n = nodes.length || 1;
  const gap = 0.25; const cw = (CW - gap * (n - 1)) / n;
  nodes.forEach((nd: any, i: number) => {
    const x = MX + i * (cw + gap);
    card(slide, x, BODY_TOP + 0.2, cw, 2.6);
    if (nd.name) txt(slide, nd.name, { x: x + 0.2, y: BODY_TOP + 0.45, w: cw - 0.4, h: 0.5, fontSize: 15, color: ink(), bold: true, fontFace: heading() });
    if (nd.desc) txt(slide, nd.desc, { x: x + 0.2, y: BODY_TOP + 1.0, w: cw - 0.4, h: 1.6, fontSize: 11, color: ink2(), valign: 'top' });
    if (i < n - 1) txt(slide, '→', { x: x + cw + 0.01, y: BODY_TOP + 1.3, w: gap, h: 0.5, fontSize: 18, color: gold(), align: 'center', bold: true });
  });
  footer(slide, ...foot(p));
}

function renderT08CapitalLoop(slide: PptxSlide, p: any): void {
  bg(slide);
  kicker(slide, p.kicker); title(slide, p.title); subtitle(slide, p.subtitle);
  const steps = (p.steps || p.items || []).slice(0, 5);
  const n = steps.length || 1;
  const gap = 0.3; const cw = (CW - gap * (n - 1)) / n;
  steps.forEach((s: any, i: number) => {
    const x = MX + i * (cw + gap);
    card(slide, x, BODY_TOP + 0.4, cw, 2.2);
    if (s.title) txt(slide, s.title, { x: x + 0.15, y: BODY_TOP + 0.7, w: cw - 0.3, h: 0.5, fontSize: 14, color: ink(), bold: true, fontFace: heading() });
    if (s.note) txt(slide, s.note, { x: x + 0.15, y: BODY_TOP + 1.25, w: cw - 0.3, h: 1.2, fontSize: 11, color: ink2(), valign: 'top' });
    if (i < n - 1) txt(slide, '→', { x: x + cw + 0.01, y: BODY_TOP + 1.4, w: gap, h: 0.5, fontSize: 18, color: gold(), align: 'center', bold: true });
  });
  footer(slide, ...foot(p));
}

// =====================================================================
// 注册
// =====================================================================
type T08RenderFn = (slide: PptxSlide, props: any) => void;

const RENDERERS: Record<string, T08RenderFn> = {
  theme08_cover_v1: renderTheme08Cover,
  theme08_chapter_v1: renderTheme08Chapter,
  theme08_content_v1: renderTheme08Content,
  theme08_contents_v1: renderTheme08Contents,
  theme08_metrics_v1: renderTheme08Metrics,
  theme08_metric_big_v1: renderTheme08MetricBig,
  theme08_feature_v1: renderTheme08Feature,
  theme08_overview_v1: renderTheme08Overview,
  theme08_strategy_v1: renderTheme08Strategy,
  theme08_process_v1: renderTheme08Process,
  theme08_timeline_v1: renderTheme08Timeline,
  theme08_roadmap_v1: renderTheme08Roadmap,
  theme08_workflow_v1: renderTheme08Workflow,
  theme08_team_v1: renderTheme08Team,
  theme08_partners_v1: renderTheme08Partners,
  theme08_gallery_v1: renderTheme08Gallery,
  theme08_collage_v1: renderTheme08Collage,
  theme08_bubble_v1: renderTheme08Bubble,
  theme08_quote_v1: renderTheme08Quote,
  theme08_closing_v1: renderTheme08Closing,
  theme08_hero_split_v1: renderTheme08HeroSplit,
  theme08_ecosystem_v1: renderTheme08Ecosystem,
  theme08_case_v1: renderTheme08Case,
  theme08_funding_v1: renderTheme08Funding,
  theme08_matrix_v1: renderTheme08Matrix,
  theme08_quadrant_v1: renderTheme08Quadrant,
  theme08_scorecard_v1: renderTheme08Scorecard,
  theme08_region_v1: renderTheme08Region,
  theme08_range_v1: renderTheme08Range,
  theme08_heatmap_v1: renderTheme08Heatmap,
  theme08_waterfall_v1: renderTheme08Waterfall,
  theme08_chart_bar_v1: renderTheme08ChartBar,
  theme08_chart_donut_v1: renderTheme08ChartDonut,
  theme08_gauge_v1: renderTheme08Gauge,
  theme08_radar_v1: renderTheme08Radar,
  theme08_ranking_v1: renderTheme08Ranking,
  theme08_compare_v1: renderTheme08Compare,
  theme08_table_v1: renderTheme08Table,
  theme08_chain_v1: renderTheme08Chain,
  // ---- v2 变体版式（对齐参考 theme08 共 84 组件页） ----
  theme08_cover_v2: renderT08Cover2,
  theme08_cover_v3: renderT08Cover2,
  theme08_cover_v4: renderT08Cover2,
  theme08_cover_v5: renderT08Cover2,
  theme08_chapter_v2: renderT08Chapter2,
  theme08_chapter_v3: renderT08Chapter2,
  theme08_chapter_v4: renderT08Chapter2,
  theme08_quote_statement_v1: renderT08Quote2,
  theme08_quote_resources_v1: renderT08Quote2,
  theme08_quote_verdict_v1: renderT08Quote2,
  theme08_quote_twofield_v1: renderT08Quote2,
  theme08_quote_manifesto_v1: renderT08Quote2,
  theme08_case_card_v1: (s, p) => renderT08GridCards(s, p, { cols: 3 }),
  theme08_case_card_v2: (s, p) => renderT08GridCards(s, p, { cols: 2 }),
  theme08_case_table_v1: (s, p) => renderT08GridCards(s, p, { cols: 1, list: true }),
  theme08_case_study_v1: (s, p) => renderT08GridCards(s, p, { cols: 2 }),
  theme08_case_grid_v1: (s, p) => renderT08GridCards(s, p, { cols: 4 }),
  theme08_case_list_v1: (s, p) => renderT08GridCards(s, p, { cols: 1, list: true }),
  theme08_region_anchor_v1: (s, p) => renderT08Statwall(s, p, { cols: 1 }),
  theme08_region_card_ny_v1: (s, p) => renderT08GridCards(s, p, { cols: 3 }),
  theme08_region_dotmap_v1: (s, p) => renderT08GridCards(s, p, { cols: 4 }),
  theme08_segment_v1: renderT08ArchFlow,
  theme08_pipeline_v1: renderT08ArchFlow,
  theme08_architecture_v1: renderT08ArchFlow,
  theme08_supply_v1: renderT08ArchFlow,
  theme08_compute_v1: renderT08ArchFlow,
  theme08_trend_v1: renderT08Bars,
  theme08_cross_v1: renderT08Bars,
  theme08_peak_v1: renderT08Line,
  theme08_pullback_v1: renderT08Dumbbell,
  theme08_peak_trough_v1: renderT08Dumbbell,
  theme08_capital_curve_v1: renderT08Line,
  theme08_revenue_v1: renderT08Panels,
  theme08_regulation_v1: renderT08Panels,
  theme08_squeeze_v1: renderT08Panels,
  theme08_early_stage_v1: (s, p) => renderT08Statwall(s, p, { cols: 4 }),
  theme08_investor_mix_v1: (s, p) => renderT08GridCards(s, p, { cols: 3 }),
  theme08_resource_map_v1: renderT08ArchFlow,
  theme08_closed_loop_v1: renderT08CapitalLoop,
  theme08_triptych_v1: (s, p) => renderT08GridCards(s, p, { cols: 3 }),
  theme08_scene_split_v1: (s, p) => renderT08GridCards(s, p, { cols: 2 }),
  theme08_budget_card_v1: (s, p) => renderT08GridCards(s, p, { cols: 3 }),
  theme08_mainlines_v1: (s, p) => renderT08GridCards(s, p, { cols: 3 }),
  theme08_migration_v1: renderT08CapitalLoop,
  theme08_size_split_v1: renderT08Dumbbell,
};

/** 将全部 theme08 渲染器注册到导出管线的按 layoutId 索引注册表。 */
export function registerTheme08Renderers(register: (layoutId: string, fn: T08RenderFn) => void): void {
  for (const [id, fn] of Object.entries(RENDERERS)) {
    register(id, fn);
  }
}
