// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme09 墨韵专色 · 杂志印刷风 — PPTX 版式专属渲染器。
// 解决 theme09 在 PPTX 导出中落到 "Unknown layout" 占位的问题。
//
// 设计要点：
//  - 双基底（substrate）—— 每个版式**预分配**基底，翻页形成杂志跨页呼吸节奏：
//      paper 纸底 #F4F1EA（数据/目录/正文密集页）
//      ink   墨底 #14161C（影像/章节/金句/跨页）
//  - appearance（primary / muted）不翻转明暗，只调专色浓度与网点密度。
//  - 所有色值取自 tokens.ts 的预校验专色系统，未复制 Dashi theme09 实现。

import { type Slide as PptxSlide } from 'pptxgenjs';

interface T09Fonts {
  heading: string;
  body: string;
  mono: string;
}
interface T09State {
  appearance: 'primary' | 'muted';
  fonts: T09Fonts;
  chartColors: string[];
}

interface T09Pal {
  sub: 'paper' | 'ink';
  isInk: boolean;
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
  spot3: string;
  spot4: string;
  spot5: string;
  spot6: string;
}

let S: T09State = {
  appearance: 'primary',
  fonts: { heading: 'Noto Serif SC', body: 'Noto Sans SC', mono: 'Space Mono' },
  chartColors: ['C8102E', '2B4A8B', '8F6410', '3F6B5C', '6D4C7D', 'A8562A'],
};

/** 每次导出开始时由 export-pptx.ts 注入 appearance / 字体 / 图表色。 */
export function configureTheme09(state: T09State): void {
  S = state;
}

// ────────────────────────────────────────────────────────────────
// 双基底专色系统（与 tokens.ts 同源，PPTX 不支持 color-mix 故固化）
// ────────────────────────────────────────────────────────────────
const PAPER = {
  bg: 'F4F1EA',
  ink: '14161C',
  ink2: '3A3F4A',
  ink3: '5C6270',
  surface: 'FDFCF8',
  surfaceElevated: 'FFFFFF',
  border: 'D5CFC0',
  borderStrong: 'B7AE99',
};
const INK = {
  bg: '14161C',
  ink: 'F4F1EA',
  ink2: 'C9C6BE',
  ink3: '8E8B84',
  surface: '1C2027',
  surfaceElevated: '242932',
  border: '2E323C',
  borderStrong: '4A4F5B',
};

const SPOT = {
  paper: {
    primary: { accent: 'C8102E', accent2: '2B4A8B', spot3: '8F6410', spot4: '3F6B5C', spot5: '6D4C7D', spot6: 'A8562A' },
    muted:   { accent: '9C2233', accent2: '3C5580', spot3: '7A5518', spot4: '3A5F53', spot5: '61496D', spot6: '8F4E2C' },
  },
  ink: {
    primary: { accent: 'F04A62', accent2: '5B82D6', spot3: 'D9A83C', spot4: '6FA894', spot5: 'A98BC4', spot6: 'E08A5B' },
    muted:   { accent: 'D07080', accent2: '7E9BC8', spot3: 'C0A068', spot4: '8AAFA0', spot5: 'B0A0C4', spot6: 'CE9878' },
  },
} as const;

/** 版式 → 预分配基底（与 Sheet substrate 完全一致）。 */
const SUBSTRATE: Record<string, 'paper' | 'ink'> = {
  theme09_cover_masthead_v1: 'ink',
  theme09_cover_bleed_v1: 'ink',
  theme09_cover_dossier_v1: 'paper',
  theme09_cover_colorbar_v1: 'paper',
  theme09_cover_aperture_v1: 'ink',
  theme09_cover_colophon_v1: 'paper',
  theme09_cover_photo_v1: 'ink',
  theme09_abstract_v1: 'paper',
  theme09_contents_v1: 'paper',
  theme09_section_v1: 'ink',
  theme09_section_card_v1: 'paper',
  theme09_closing_v1: 'ink',
  'theme09_cross-perspective_v1': 'ink',
  theme09_thesis_v1: 'paper',
  'theme09_value-chain_v1': 'paper',
  theme09_risk_v1: 'ink',
  theme09_outlook_v1: 'ink',
  theme09_conclusion_v1: 'paper',
  theme09_bracket_v1: 'paper',
  theme09_flow_v1: 'ink',
  theme09_orbit_v1: 'ink',
  theme09_vertical_v1: 'paper',
  theme09_calendar_v1: 'paper',
  theme09_phases_v1: 'ink',
  theme09_gauge_v1: 'ink',
  theme09_scoreboard_v1: 'ink',
  theme09_trend_v1: 'paper',
  theme09_histogram_v1: 'paper',
  'theme09_forecast-fan_v1': 'ink',
  theme09_plans_v1: 'paper',
  theme09_stair_v1: 'ink',
  theme09_stacked_v1: 'paper',
  theme09_era_v1: 'ink',
  theme09_roadmap_v1: 'paper',
  theme09_score_v1: 'ink',
  theme09_takeaway_v1: 'ink',
  theme09_compare_v1: 'paper',
  theme09_process_v1: 'paper',
  theme09_faq_v1: 'paper',
  // ── P2 图表型（数据/目录/密集页，纸底）──
  theme09_market_overview_v1: 'paper',
  'theme09_streamgraph_v1': 'paper',
  'theme09_chord_v1': 'paper',
  'theme09_sunburst_v1': 'paper',
  'theme09_ribbon_v1': 'paper',
  'theme09_rounds_v1': 'paper',
  'theme09_ranking_v1': 'paper',
  'theme09_bump_v1': 'paper',
  'theme09_hero_number_v1': 'paper',
  'theme09_versus_v1': 'paper',
  'theme09_spiral_v1': 'paper',
  'theme09_funnel_v1': 'paper',
  'theme09_stat_grid_v1': 'paper',
  'theme09_arc_v1': 'paper',
  'theme09_network_v1': 'paper',
  'theme09_area_v1': 'paper',
  'theme09_mega_number_v1': 'paper',
  'theme09_radar_v1': 'paper',
  'theme09_radialbar_v1': 'paper',
  'theme09_honeycomb_v1': 'paper',
  'theme09_tornado_v1': 'paper',
  'theme09_matrix_v1': 'paper',
  'theme09_quadrant_v1': 'paper',
  'theme09_bubble_v1': 'paper',
  'theme09_marimekko_v1': 'paper',
  'theme09_meter_v1': 'paper',
  'theme09_parallel_v1': 'paper',
  'theme09_grade_v1': 'paper',
  'theme09_slope_v1': 'paper',
  'theme09_dumbbell_v1': 'paper',
  'theme09_crosstab_v1': 'paper',
  'theme09_tier_v1': 'paper',
  'theme09_ledger_v1': 'paper',
  'theme09_alloc_v1': 'paper',
  'theme09_venn_v1': 'paper',
  'theme09_treemap_v1': 'paper',
  'theme09_icicle_v1': 'paper',
  'theme09_waterfall_v1': 'paper',
  'theme09_heatmap_v1': 'paper',
  // ── P1 图片 / 标本 / 金句型（影像/跨页，墨底）──
  'theme09_specimen_v1': 'ink',
  'theme09_photo_feature_v1': 'ink',
  'theme09_photo_grid_v1': 'ink',
  'theme09_photo_quote_v1': 'ink',
  'theme09_photo_duo_v1': 'ink',
  'theme09_photo_panorama_v1': 'ink',
  'theme09_photo_stage_v1': 'ink',
  'theme09_storyboard_v1': 'ink',
  'theme09_snapshot_tape_v1': 'ink',
  'theme09_epigraph_v1': 'ink',
  'theme09_photo_bento_v1': 'ink',
  'theme09_timeline_photo_v1': 'ink',
  'theme09_filmstrip_v1': 'ink',
  'theme09_mosaic_v1': 'ink',
  'theme09_testimonial_v1': 'ink',
  'theme09_team_v1': 'ink',
  'theme09_photo_ring_v1': 'ink',
  'theme09_divider_photo_v1': 'ink',
  'theme09_coverstory_v1': 'ink',
  'theme09_quote_portrait_v1': 'ink',
  'theme09_manifesto_v1': 'ink',
  'theme09_annotated_v1': 'ink',
  'theme09_diptych_v1': 'ink',
  'theme09_case_folio_v1': 'ink',
  'theme09_split_diagonal_v1': 'ink',
  'theme09_typeriver_v1': 'ink',
  'theme09_exhibit_wall_v1': 'ink',
  'theme09_masonry_v1': 'ink',
  'theme09_journey_v1': 'ink',
  'theme09_photo_cards_v1': 'ink',
  'theme09_zine_spread_v1': 'ink',
  'theme09_photo_scene_v1': 'ink',
  'theme09_spotlight_v1': 'ink',
  'theme09_profile_v1': 'ink',
  'theme09_gallery_wall_v1': 'ink',
  'theme09_dotmatrix_v1': 'ink',
};

function P(layoutId: string): T09Pal {
  const sub = SUBSTRATE[layoutId] ?? 'paper';
  const base = sub === 'ink' ? INK : PAPER;
  const spot = SPOT[sub][S.appearance];
  return { sub, isInk: sub === 'ink', ...base, ...spot };
}

function series(pal: T09Pal): string[] {
  return [pal.accent, pal.accent2, pal.spot3, pal.spot4, pal.spot5, pal.spot6];
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

function txt(slide: PptxSlide, text: unknown, o: Record<string, unknown>): void {
  if (text == null || text === '') return;
  if (Array.isArray(text)) {
    if (text.length === 0) return;
    text = text.map(String).join('\n');
  }
  slide.addText(text as any, o as any);
}

function frame(slide: PptxSlide, pal: T09Pal, opts: { bottom?: boolean } = {}): void {
  (slide as any).background = { color: pal.bg };
  slide.addShape('line', { x: MX, y: TOP, w: CW, h: 0, line: { color: pal.border, width: 0.75 } });
  if (opts.bottom !== false) {
    slide.addShape('line', { x: MX, y: BOT, w: CW, h: 0, line: { color: pal.border, width: 0.75 } });
  }
}

function kicker(slide: PptxSlide, text: unknown, pal: T09Pal, o: Record<string, unknown> = {}): void {
  txt(slide, text, {
    x: o.x ?? MX, y: o.y ?? 0.74, w: o.w ?? CW, h: 0.3,
    fontSize: o.size ?? 12, color: pal.accent, align: 'left',
    fontFace: S.fonts.mono, charSpacing: 2, bold: true,
  } as any);
}

function title(slide: PptxSlide, text: unknown, pal: T09Pal, o: Record<string, unknown> = {}): void {
  const ls = lines(text);
  const size = (o.size as number) ?? 40;
  const h = (o.h as number) ?? ls.length * (size / 72) * 1.18 + 0.15;
  slide.addText(ls.join('\n') as any, {
    x: o.x ?? MX, y: o.y ?? 1.0, w: o.w ?? CW, h,
    fontSize: size, color: (o.color as string) ?? pal.ink, align: (o.align as any) ?? 'left',
    fontFace: S.fonts.heading, bold: true, valign: (o.valign as any) ?? 'top',
    lineSpacingMultiple: 1.05, rotate: o.rotate as any,
  } as any);
}

function footer(slide: PptxSlide, left: unknown, right: unknown, pal: T09Pal): void {
  txt(slide, left, { x: MX, y: BOT + 0.04, w: CW / 2, h: 0.3, fontSize: 9, color: pal.ink3, align: 'left', fontFace: S.fonts.mono });
  txt(slide, right, { x: MX + CW / 2, y: BOT + 0.04, w: CW / 2, h: 0.3, fontSize: 9, color: pal.ink3, align: 'right', fontFace: S.fonts.mono });
}

function card(slide: PptxSlide, x: number, y: number, w: number, h: number, pal: T09Pal, fill?: string, stroke?: string): void {
  slide.addShape('rect', { x, y, w, h, fill: { color: fill ?? pal.surfaceElevated }, line: { color: stroke ?? pal.borderStrong, width: 1 } });
}

function colorBar(slide: PptxSlide, x: number, y: number, w: number, pal: T09Pal): void {
  const n = 6;
  const g = 0.08;
  const cw = (w - g * (n - 1)) / n;
  const s = series(pal);
  for (let i = 0; i < n; i++) {
    slide.addShape('rect', { x: x + i * (cw + g), y, w: cw, h: 0.16, fill: { color: s[i] } });
  }
}

function masthead(slide: PptxSlide, p: any, pal: T09Pal): void {
  txt(slide, p.section, { x: MX, y: 0.74, w: 4, h: 0.3, fontSize: 13, color: pal.ink, bold: true, align: 'left', fontFace: S.fonts.heading });
  txt(slide, p.sectionEn, { x: MX, y: 1.06, w: 4, h: 0.25, fontSize: 10, color: pal.ink3, align: 'left', fontFace: S.fonts.mono, charSpacing: 1 });
  txt(slide, p.mark, { x: MX + CW - 3, y: 0.74, w: 3, h: 0.3, fontSize: 11, color: pal.accent, align: 'right', bold: true, fontFace: S.fonts.mono });
  slide.addShape('line', { x: MX, y: 1.42, w: CW, h: 0, line: { color: pal.ink, width: 1.25 } });
}

function folio(slide: PptxSlide, p: any, pal: T09Pal): void {
  footer(slide, p.folioLeft, [p.folioPage, p.folioRight].filter(Boolean).join('   /   '), pal);
}

function apertureFallback(slide: PptxSlide, x: number, y: number, d: number, pal: T09Pal): void {
  slide.addShape('ellipse', { x, y, w: d, h: d, fill: { color: pal.surfaceElevated }, line: { color: pal.border, width: 1 } });
  txt(slide, 'IMG', { x, y, w: d, h: d, fontSize: 16, color: pal.ink3, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.mono });
}

function toImgUrl(v: unknown): string | undefined {
  if (!v) return undefined;
  if (typeof v === 'string') return v;
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>;
    for (const k of ['url', 'src', 'href', 'path', 'image']) {
      const val = o[k];
      if (typeof val === 'string' && val.length) return val;
    }
  }
  return undefined;
}

function tryImage(slide: PptxSlide, url: unknown, x: number, y: number, w: number, h: number, fallback: () => void): void {
  const u = toImgUrl(url);
  // 仅接受可直读的本地路径或远程 http(s) 资源；data: URI 等内联占位图在 pptxgenjs 写盘时
  // 会触发 ENAMETOOLONG/无法读取，故直接降级为 fallback 卡片。
  if (!u || (!u.startsWith('http://') && !u.startsWith('https://') && !u.startsWith('/') && !u.startsWith('.'))) {
    fallback();
    return;
  }
  try {
    slide.addImage({ path: u, x, y, w, h });
  } catch {
    fallback();
  }
}

// =====================================================================
// 1. cover · 刊头封面（ink）
// =====================================================================
function renderCoverMasthead(slide: PptxSlide, p: any): void {
  const pal = P('theme09_cover_masthead_v1');
  (slide as any).background = { color: pal.bg };
  slide.addShape('rect', { x: 0, y: 0, w: 10, h: 0.34, fill: { color: pal.accent } });
  txt(slide, [p.issueEn, p.issue].filter(Boolean).join('   ·   '), {
    x: MX, y: 0, w: CW, h: 0.34, fontSize: 11, color: pal.bg, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.mono, charSpacing: 2,
  } as any);

  title(slide, p.title, pal, { x: MX, y: 0.72, w: CW, size: 46, align: 'center' });
  txt(slide, [p.strapline, p.straplineEn].filter(Boolean).join('   ·   '), {
    x: MX, y: 1.55, w: CW, h: 0.32, fontSize: 13, color: pal.accent, align: 'center', fontFace: S.fonts.mono, charSpacing: 1, bold: true,
  } as any);

  title(slide, p.kick, pal, { x: MX, y: 2.05, w: CW, size: 30, align: 'center' });
  txt(slide, p.lead, { x: MX, y: 3.05, w: CW * 0.6, h: 1.5, fontSize: 14, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.25 } as any);

  const items = (p.items || []).slice(0, 5);
  let iy = 3.05;
  items.forEach((t: string, i: number) => {
    txt(slide, String(i + 1).padStart(2, '0'), { x: MX + CW * 0.62, y: iy, w: 0.5, h: 0.3, fontSize: 13, color: pal.accent, align: 'left', bold: true, fontFace: S.fonts.mono } as any);
    txt(slide, t, { x: MX + CW * 0.62 + 0.5, y: iy, w: CW * 0.38 - 0.5, h: 0.3, fontSize: 12, color: pal.ink, align: 'left', fontFace: S.fonts.body } as any);
    iy += 0.34;
  });

  colorBar(slide, MX, 4.75, 3.2, pal);
  txt(slide, p.sign, { x: MX + 3.5, y: 4.7, w: CW - 3.5, h: 0.32, fontSize: 10, color: pal.ink3, align: 'right', fontFace: S.fonts.mono, charSpacing: 1 } as any);
}

// =====================================================================
// 2. cover · 出血斜切封面（ink）
// =====================================================================
function renderCoverBleed(slide: PptxSlide, p: any): void {
  const pal = P('theme09_cover_bleed_v1');
  (slide as any).background = { color: pal.bg };
  slide.addShape('rect', { x: 0, y: 0, w: 3.2, h: 5.625, fill: { color: pal.accent } });
  txt(slide, p.railTop, { x: 0.35, y: 0.5, w: 2.5, h: 0.3, fontSize: 12, color: pal.bg, align: 'left', fontFace: S.fonts.mono, bold: true, charSpacing: 2 } as any);
  txt(slide, p.vertical, { x: 0.7, y: 0.7, w: 2.0, h: 4.0, fontSize: 26, color: pal.bg, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.heading, rotate: 270 } as any);
  txt(slide, p.railFoot, { x: 0.35, y: 5.05, w: 2.5, h: 0.3, fontSize: 11, color: pal.bg, align: 'left', fontFace: S.fonts.mono, charSpacing: 2 } as any);

  const rx = 3.7;
  title(slide, p.title, pal, { x: rx, y: 1.3, w: 5.8, size: 44, color: pal.ink });
  txt(slide, p.subtitle, { x: rx, y: 3.0, w: 5.8, h: 1.0, fontSize: 15, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top' } as any);

  const meta = (p.metaItems || []).slice(0, 4);
  let my = 4.2;
  meta.forEach((m: any) => {
    txt(slide, m.k, { x: rx, y: my, w: 1.6, h: 0.3, fontSize: 10, color: pal.accent, align: 'left', bold: true, fontFace: S.fonts.mono } as any);
    txt(slide, m.v, { x: rx + 1.6, y: my, w: 4.0, h: 0.3, fontSize: 12, color: pal.ink, align: 'left', fontFace: S.fonts.body } as any);
    my += 0.38;
  });
  slide.addShape('line', { x: rx, y: 5.18, w: 10 - rx - MX, h: 0, line: { color: pal.border, width: 0.75 } });
}

// =====================================================================
// 3. cover · 卷宗封面（paper）
// =====================================================================
function renderCoverDossier(slide: PptxSlide, p: any): void {
  const pal = P('theme09_cover_dossier_v1');
  frame(slide, pal);
  if (p.classif) {
    slide.addShape('rect', { x: MX, y: 0.85, w: 1.9, h: 0.6, fill: { color: pal.bg }, line: { color: pal.accent, width: 1.5 } });
    txt(slide, p.classif, { x: MX, y: 0.85, w: 1.9, h: 0.6, fontSize: 14, color: pal.accent, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.mono, charSpacing: 2 } as any);
    if (p.stampNote) txt(slide, p.stampNote, { x: MX + 2.1, y: 0.95, w: 3, h: 0.45, fontSize: 11, color: pal.ink2, align: 'left', valign: 'middle', fontFace: S.fonts.body } as any);
  }
  title(slide, p.title, pal, { x: MX, y: 1.7, w: 5.6, size: 40 });
  txt(slide, p.subtitle, { x: MX, y: 2.6, w: 5.6, h: 1.1, fontSize: 14, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top' } as any);

  const fields = (p.fields || []).slice(0, 6);
  const colW = (CW - 0.4) / 2;
  fields.forEach((f: any, i: number) => {
    const cx = MX + (i % 2) * (colW + 0.4);
    const cy = 3.9 + Math.floor(i / 2) * 0.36;
    txt(slide, f.k, { x: cx, y: cy, w: 1.4, h: 0.3, fontSize: 10, color: pal.ink3, align: 'left', fontFace: S.fonts.mono } as any);
    txt(slide, f.v, { x: cx + 1.4, y: cy, w: colW - 1.4, h: 0.3, fontSize: 12, color: pal.ink, align: 'left', bold: true, fontFace: S.fonts.body } as any);
  });

  const sx = MX + 6.4;
  if (p.memo) txt(slide, p.memo, { x: sx, y: 1.7, w: CW - sx + MX, h: 1.4, fontSize: 14, color: pal.ink, align: 'left', fontFace: 'Caveat', valign: 'top' } as any);
  if (p.chop) {
    slide.addShape('ellipse', { x: sx + 0.2, y: 3.2, w: 1.1, h: 1.1, fill: { color: pal.bg }, line: { color: pal.accent, width: 2 } });
    txt(slide, p.chop, { x: sx + 0.2, y: 3.2, w: 1.1, h: 1.1, fontSize: 16, color: pal.accent, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.heading } as any);
  }
  const meta = (p.metaLines || []).slice(0, 4);
  let my = 4.5;
  meta.forEach((t: string) => {
    txt(slide, t, { x: sx, y: my, w: CW - sx + MX, h: 0.28, fontSize: 9, color: pal.ink3, align: 'left', fontFace: S.fonts.mono, charSpacing: 1 } as any);
    my += 0.3;
  });
}

// =====================================================================
// 4. cover · 色标封面（paper）
// =====================================================================
function renderCoverColorbar(slide: PptxSlide, p: any): void {
  const pal = P('theme09_cover_colorbar_v1');
  frame(slide, pal);
  const s1 = series(pal);
  const cells = [...s1, pal.ink, pal.ink3];
  const codes = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'K100', 'K40'];
  const n = 8;
  const g = 0.1;
  const cw = (CW - g * (n - 1)) / n;
  const gy = 0.85;
  const ch = 0.9;
  cells.forEach((c, i) => {
    const x = MX + i * (cw + g);
    slide.addShape('rect', { x, y: gy, w: cw, h: ch, fill: { color: c }, line: { color: pal.border, width: 0.5 } });
    txt(slide, codes[i], { x, y: gy + ch + 0.02, w: cw, h: 0.22, fontSize: 8, color: pal.ink3, align: 'center', fontFace: S.fonts.mono } as any);
  });

  title(slide, p.title, pal, { x: MX, y: 2.1, w: 5.6, size: 44 });
  txt(slide, p.subtitle, { x: MX, y: 3.1, w: 5.6, h: 1.2, fontSize: 14, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top' } as any);

  const specs = (p.specs || []).slice(0, 6);
  const sx = MX + 5.9;
  let sy = 2.1;
  specs.forEach((sp: any) => {
    txt(slide, sp.k, { x: sx, y: sy, w: 1.6, h: 0.3, fontSize: 10, color: pal.ink3, align: 'left', fontFace: S.fonts.mono } as any);
    txt(slide, sp.v, { x: sx + 1.6, y: sy, w: CW - sx - MX - 1.6, h: 0.3, fontSize: 13, color: pal.ink, align: 'left', bold: true, fontFace: S.fonts.body } as any);
    sy += 0.4;
  });
  footer(slide, p.footLeft, p.footRight, pal);
}

// =====================================================================
// 5. cover · 圆窗封面（ink）
// =====================================================================
function renderCoverAperture(slide: PptxSlide, p: any): void {
  const pal = P('theme09_cover_aperture_v1');
  frame(slide, pal, { bottom: false });
  if (p.tag) kicker(slide, p.tag, pal, { x: MX, y: 0.85 });
  title(slide, p.title, pal, { x: MX, y: 1.25, w: 5.4, size: 42 });
  txt(slide, p.subtitle, { x: MX, y: 3.3, w: 5.4, h: 1.2, fontSize: 14, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top' } as any);

  const tags = (p.tags || []).slice(0, 5);
  let ty = 4.6;
  tags.forEach((t: string) => {
    const w = 0.3 + t.length * 0.16;
    slide.addShape('roundRect', { x: MX, y: ty, w, h: 0.34, rectRadius: 0.17, fill: { color: pal.bg }, line: { color: pal.accent, width: 1 } });
    txt(slide, t, { x: MX, y: ty, w, h: 0.34, fontSize: 11, color: pal.accent, align: 'center', valign: 'middle', fontFace: S.fonts.mono } as any);
    ty += 0.42;
  });

  const cx = 6.7;
  const cy = 1.0;
  const d = 3.0;
  tryImage(slide, p.imageUrl, cx, cy, d, d, () => apertureFallback(slide, cx, cy, d, pal));
  slide.addShape('ellipse', { x: cx - 0.06, y: cy - 0.06, w: d + 0.12, h: d + 0.12, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: pal.accent, width: 2 } });
  footer(slide, p.tag, 'APERTURE', pal);
}

// =====================================================================
// 6. cover · 版本页封面（paper）
// =====================================================================
function renderCoverColophon(slide: PptxSlide, p: any): void {
  const pal = P('theme09_cover_colophon_v1');
  frame(slide, pal);
  title(slide, p.title, pal, { x: MX, y: 0.85, w: CW, size: 40 });
  txt(slide, p.titleEn, { x: MX, y: 1.65, w: CW, h: 0.3, fontSize: 13, color: pal.ink3, align: 'left', fontFace: S.fonts.mono, charSpacing: 1 } as any);

  const cols = (p.cols || []).slice(0, 4);
  const gap = 0.3;
  const cw = (CW - gap * (cols.length - 1)) / cols.length;
  cols.forEach((c: any, i: number) => {
    const x = MX + i * (cw + gap);
    txt(slide, c.heading, { x, y: 2.2, w: cw, h: 0.3, fontSize: 13, color: pal.accent, align: 'left', bold: true, fontFace: S.fonts.heading } as any);
    slide.addShape('line', { x, y: 2.56, w: cw, h: 0, line: { color: pal.ink, width: 1 } });
    (c.lines || []).slice(0, 6).forEach((ln: string, j: number) => {
      txt(slide, ln, { x, y: 2.66 + j * 0.34, w: cw, h: 0.32, fontSize: 11, color: pal.ink2, align: 'left', fontFace: S.fonts.body } as any);
    });
  });
  colorBar(slide, MX, 4.9, 3.2, pal);
  txt(slide, p.footLeft, { x: MX + 3.5, y: 4.86, w: CW - 3.5, h: 0.3, fontSize: 10, color: pal.ink3, align: 'right', fontFace: S.fonts.mono, charSpacing: 1 } as any);
}

// =====================================================================
// 7. cover · 影像封面（ink）
// =====================================================================
function renderCoverPhoto(slide: PptxSlide, p: any): void {
  const pal = P('theme09_cover_photo_v1');
  (slide as any).background = { color: pal.bg };
  tryImage(slide, p.imageUrl, 0, 0, 10, 5.625, () => {});
  slide.addShape('rect', { x: 0, y: 3.4, w: 10, h: 2.225, fill: { color: '000000', transparency: 35 } });
  if (p.strip) {
    const w = 0.3 + p.strip.length * 0.12;
    slide.addShape('rect', { x: MX, y: 0.9, w, h: 0.36, fill: { color: pal.accent } });
    txt(slide, p.strip, { x: MX, y: 0.9, w, h: 0.36, fontSize: 12, color: pal.bg, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.mono, charSpacing: 2 } as any);
  }
  title(slide, p.title, pal, { x: MX, y: 3.7, w: CW, size: 44, color: pal.ink });
  txt(slide, p.subtitle, { x: MX, y: 4.6, w: CW, h: 0.7, fontSize: 14, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top' } as any);
  const meta = (p.metaItems || []).slice(0, 4);
  txt(slide, meta.join('   /   '), { x: MX, y: 5.25, w: CW, h: 0.3, fontSize: 11, color: pal.ink2, align: 'left', fontFace: S.fonts.mono, charSpacing: 1 } as any);
}

// =====================================================================
// 8. content · 卷首摘要（paper）
// =====================================================================
function renderAbstract(slide: PptxSlide, p: any): void {
  const pal = P('theme09_abstract_v1');
  frame(slide, pal, { bottom: false });
  masthead(slide, p, pal);
  title(slide, p.title, pal, { x: MX, y: 1.7, w: 5.6, size: 34 });
  txt(slide, p.standfirst, { x: MX, y: 2.3, w: 5.6, h: 2.6, fontSize: 14, color: pal.ink, align: 'left', fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.25 } as any);

  const figs = (p.figures || []).slice(0, 5);
  const sx = MX + 6.0;
  slide.addShape('line', { x: sx - 0.3, y: 1.9, w: 0, h: 3.0, line: { color: pal.accent, width: 2 } });
  let fy = 1.9;
  figs.forEach((f: any) => {
    txt(slide, [f.v, f.unit].filter(Boolean).join(''), { x: sx, y: fy, w: CW - sx + MX, h: 0.6, fontSize: 30, color: pal.accent, align: 'left', bold: true, fontFace: S.fonts.heading } as any);
    txt(slide, f.k, { x: sx, y: fy + 0.6, w: CW - sx + MX, h: 0.3, fontSize: 12, color: pal.ink2, align: 'left', fontFace: S.fonts.body } as any);
    fy += 0.95;
  });
  folio(slide, p, pal);
}

// =====================================================================
// 9. tableOfContents · 目录（paper）
// =====================================================================
function renderContents(slide: PptxSlide, p: any): void {
  const pal = P('theme09_contents_v1');
  frame(slide, pal, { bottom: false });
  masthead(slide, p, pal);
  title(slide, p.title, pal, { x: MX, y: 1.7, w: 6, size: 34 });
  txt(slide, p.titleEn, { x: MX + 6, y: 1.85, w: 3, h: 0.3, fontSize: 13, color: pal.ink3, align: 'right', fontFace: S.fonts.mono } as any);

  const items = (p.items || []).slice(0, 10);
  let y = 2.5;
  const rowH = (5.0 - 2.5) / Math.max(items.length, 1);
  items.forEach((it: any, i: number) => {
    const col = it.current ? pal.accent : pal.ink;
    txt(slide, String(i + 1).padStart(2, '0'), { x: MX, y, w: 0.6, h: rowH, fontSize: 14, color: col, align: 'left', valign: 'middle', bold: true, fontFace: S.fonts.mono } as any);
    txt(slide, it.name, { x: MX + 0.7, y, w: 4.0, h: rowH, fontSize: 15, color: col, align: 'left', valign: 'middle', bold: it.current, fontFace: S.fonts.heading } as any);
    txt(slide, it.desc || '', { x: MX + 4.8, y, w: 3.0, h: rowH, fontSize: 11, color: pal.ink3, align: 'left', valign: 'middle', fontFace: S.fonts.body } as any);
    txt(slide, it.page || '', { x: MX + CW - 1.0, y, w: 1.0, h: rowH, fontSize: 14, color: col, align: 'right', valign: 'middle', bold: true, fontFace: S.fonts.mono } as any);
    if (i < items.length - 1) slide.addShape('line', { x: MX, y: y + rowH, w: CW, h: 0, line: { color: pal.border, width: 0.5 } });
    y += rowH;
  });
  folio(slide, p, pal);
}

// =====================================================================
// 10. content · 篇章扉页（ink）
// =====================================================================
function renderSection(slide: PptxSlide, p: any): void {
  const pal = P('theme09_section_v1');
  frame(slide, pal, { bottom: false });
  title(slide, p.num, pal, { x: 0.2, y: 3.0, w: 4.5, h: 2.4, size: 180, color: pal.accent, align: 'left', valign: 'bottom' });
  txt(slide, p.name, { x: 8.6, y: 0.7, w: 1.2, h: 4.0, fontSize: 40, color: pal.ink, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.heading, rotate: 270 } as any);
  if (p.nameEn) kicker(slide, p.nameEn, pal, { x: 4.6, y: 1.0 });
  txt(slide, p.lede, { x: 4.6, y: 1.5, w: 3.8, h: 1.8, fontSize: 14, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.2 } as any);
  const pts = (p.points || []).slice(0, 4);
  let py = 3.5;
  pts.forEach((t: string) => {
    txt(slide, '— ' + t, { x: 4.6, y: py, w: 3.9, h: 0.35, fontSize: 12, color: pal.ink, align: 'left', fontFace: S.fonts.body } as any);
    py += 0.4;
  });
  folio(slide, p, pal);
}

// =====================================================================
// 11. content · 篇章卡（paper）
// =====================================================================
function renderSectionCard(slide: PptxSlide, p: any): void {
  const pal = P('theme09_section_card_v1');
  frame(slide, pal, { bottom: false });
  masthead(slide, p, pal);

  const cardX = MX;
  const cardY = 1.7;
  const cardW = 3.6;
  const cardH = 3.0;
  card(slide, cardX, cardY, cardW, cardH, pal, pal.surfaceElevated, pal.borderStrong);
  slide.addShape('rect', { x: cardX, y: cardY, w: cardW, h: 0.12, fill: { color: pal.accent } });
  slide.addShape('triangle', { x: cardX + cardW - 0.5, y: cardY, w: 0.5, h: 0.5, fill: { color: pal.bg }, line: { color: pal.border, width: 1 }, rotate: 180, flipH: true } as any);
  title(slide, p.num, pal, { x: cardX + 0.3, y: cardY + 0.3, w: cardW - 0.6, h: 1.0, size: 60, color: pal.accent });
  title(slide, p.name, pal, { x: cardX + 0.3, y: cardY + 1.4, w: cardW - 0.6, h: 0.9, size: 28 });
  if (p.nameEn) txt(slide, p.nameEn, { x: cardX + 0.3, y: cardY + 2.3, w: cardW - 0.6, h: 0.3, fontSize: 12, color: pal.ink3, align: 'left', fontFace: S.fonts.mono } as any);

  const pts = (p.points || []).slice(0, 4);
  const sx = MX + 4.0;
  let py = 1.8;
  pts.forEach((pt: any, i: number) => {
    slide.addShape('line', { x: sx, y: py, w: CW - sx + MX, h: 0, line: { color: pal.borderStrong, width: 1.25 } });
    txt(slide, String(i + 1).padStart(2, '0'), { x: sx, y: py + 0.1, w: 0.6, h: 0.3, fontSize: 13, color: pal.accent, align: 'left', bold: true, fontFace: S.fonts.mono } as any);
    txt(slide, pt.t, { x: sx + 0.7, y: py + 0.1, w: CW - sx - MX - 0.7, h: 0.3, fontSize: 16, color: pal.ink, align: 'left', bold: true, fontFace: S.fonts.heading } as any);
    txt(slide, pt.d || '', { x: sx + 0.7, y: py + 0.42, w: CW - sx - MX - 0.7, h: 0.5, fontSize: 12, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top' } as any);
    py += 0.95;
  });
  folio(slide, p, pal);
}

// =====================================================================
// 12. closing · 封底结语（ink）
// =====================================================================
function renderClosing(slide: PptxSlide, p: any): void {
  const pal = P('theme09_closing_v1');
  (slide as any).background = { color: pal.bg };
  tryImage(slide, p.imageUrl, 0, 0, 10, 5.625, () => {});
  slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: '000000', transparency: 35 } });
  slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: pal.bg, transparency: 30 } });
  if (p.mark) {
    const w = 0.3 + p.mark.length * 0.12;
    slide.addShape('rect', { x: 5 - w / 2, y: 1.3, w, h: 0.36, fill: { color: pal.accent } });
    txt(slide, p.mark, { x: 5 - w / 2, y: 1.3, w, h: 0.36, fontSize: 12, color: pal.bg, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.mono, charSpacing: 2 } as any);
  }
  title(slide, p.word, pal, { x: 1, y: 2.0, w: 8, size: 48, align: 'center', color: pal.ink });
  txt(slide, p.subtitle, { x: 1.5, y: 3.3, w: 7, h: 1.0, fontSize: 15, color: pal.ink2, align: 'center', fontFace: S.fonts.body, valign: 'top' } as any);
  const col = (p.colophon || []).slice(0, 4);
  txt(slide, col.join('   ·   '), { x: 1, y: 4.7, w: 8, h: 0.3, fontSize: 11, color: pal.ink2, align: 'center', fontFace: S.fonts.mono, charSpacing: 1 } as any);
}

// =====================================================================
// 注册
// =====================================================================
// theme09 P3 版式 PPTX 渲染函数（临时片段，由 _tmp_splice_p3.mjs 注入 theme09-pptx.ts）

// ────────────────────────────────────────────────────────────────
// P3 通用辅助
// ────────────────────────────────────────────────────────────────

// ────────────────────────────────────────────────────────────────
// P3 渲染器 v2（字段名对齐 Schema；标量数组兼容 {item}/string）
// ────────────────────────────────────────────────────────────────
function t9N(v: unknown): number {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v == null ? '' : v));
  return Number.isFinite(n) ? n : 0;
}
/** 兼容标量数组项：纯字符串 或 {item}/{name}/{label} 对象。 */
function sc(it: any): string {
  if (it == null) return '';
  if (typeof it === 'string') return it;
  return String(it.item ?? it.name ?? it.label ?? it.text ?? it.value ?? '');
}
function t9Head(slide: PptxSlide, p: any, pal: T09Pal, o: { size?: number; titleW?: number; sub?: boolean } = {}): number {
  masthead(slide, p, pal);
  const hasK = !!p.kicker;
  if (hasK) kicker(slide, p.kicker, pal, { x: MX, y: 1.46 });
  const ty = hasK ? 1.82 : 1.66;
  const size = o.size ?? 27;
  title(slide, p.title, pal, { x: MX, y: ty, w: o.titleW ?? CW, size });
  let cy = ty + (size / 72) * 1.2 + 0.12;
  if (o.sub !== false && p.subtitle) {
    txt(slide, p.subtitle, { x: MX, y: cy, w: o.titleW ?? CW, h: 0.5, fontSize: 12, color: pal.ink2, align: 'left', fontFace: S.fonts.body, valign: 'top', lineSpacingMultiple: 1.15 } as any);
    cy += 0.58;
  }
  return Math.max(cy, 2.92);
}
function t9Pill(slide: PptxSlide, text: string, x: number, y: number, w: number, h: number, bg: string, fg: string): void {
  slide.addShape('roundRect', { x, y, w, h, rectRadius: h / 2, fill: { color: bg }, line: { color: bg, width: 0 } });
  txt(slide, text, { x, y, w, h, fontSize: 9.5, color: fg, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.mono } as any);
}
/** 等级文本（高/中/低）映射为 0-100 坐标；已是数字则直接用。 */
function lvl(v: unknown): number {
  const s = String(v ?? '').trim();
  if (s === '高' || s === 'high') return 82;
  if (s === '中' || s === 'mid') return 50;
  if (s === '低' || s === 'low') return 18;
  const n = t9N(v);
  return Number.isFinite(n) && (n > 0 && n <= 100) ? n : 50;
}

// 1 cross-perspective（ink）
function renderCrossPerspective(slide: PptxSlide, p: any): void {
  const pal = P('theme09_cross-perspective_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const dims = (p.dimensions || []).slice(0, 4);
  const leftW = 6.0;
  const conclX = MX + leftW + 0.3;
  const conclW = CW - leftW - 0.3;
  const rh = Math.min(0.62, (BOT - y0 - 0.1) / Math.max(dims.length, 1));
  dims.forEach((d: any, i: number) => {
    const ry = y0 + i * rh;
    const parts = String(d.metrics || '').split('|').map((s: string) => {
      const idx = s.indexOf(':');
      const name = idx >= 0 ? s.slice(0, idx).trim() : s.trim();
      const val = idx >= 0 ? t9N(s.slice(idx + 1)) : 0;
      return { name, val };
    });
    const maxV = Math.max(1, ...parts.map((x: any) => x.val));
    txt(slide, sc(d.label), { x: MX, y: ry, w: 1.5, h: rh - 0.06, fontSize: 11, color: pal.ink, bold: true, valign: 'middle', fontFace: S.fonts.body } as any);
    const bx = MX + 1.6;
    const bw = leftW - 1.6;
    let acc = 0;
    parts.forEach((pt: any, si: number) => {
      const w = (pt.val / maxV) * bw;
      slide.addShape('rect', { x: bx + acc, y: ry + 0.06, w: Math.max(0.02, w - 0.03), h: rh - 0.14, fill: { color: series(pal)[si % 6] }, line: { width: 0 } });
      acc += w;
    });
    txt(slide, sc(d.note), { x: bx, y: ry + rh - 0.2, w: bw, h: 0.18, fontSize: 8.5, color: pal.ink3, italic: true, fontFace: S.fonts.body } as any);
  });
  card(slide, conclX, y0, conclW, BOT - y0 - 0.1, pal);
  txt(slide, '结论', { x: conclX + 0.18, y: y0 + 0.16, w: conclW - 0.36, h: 0.3, fontSize: 12, color: pal.accent, bold: true, fontFace: S.fonts.mono } as any);
  txt(slide, p.conclusion, { x: conclX + 0.18, y: y0 + 0.55, w: conclW - 0.36, h: BOT - y0 - 0.8, fontSize: 12, color: pal.ink, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.25 } as any);
  footer(slide, p.footnoteLeft, p.footnoteRight, pal);
}

// 2 thesis（paper）
function renderThesis(slide: PptxSlide, p: any): void {
  const pal = P('theme09_thesis_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const steps = (p.steps || []).slice(0, 3);
  const n = Math.max(steps.length, 1);
  const gap = 0.25;
  const cw = (CW - gap * (n - 1)) / n;
  steps.forEach((s: any, i: number) => {
    const cx = MX + i * (cw + gap);
    card(slide, cx, y0, cw, 1.7, pal);
    t9Pill(slide, String(i + 1), cx + 0.18, y0 + 0.18, 0.42, 0.42, pal.accent, 'FFFFFF');
    txt(slide, sc(s.claim), { x: cx + 0.72, y: y0 + 0.18, w: cw - 0.9, h: 0.5, fontSize: 13, color: pal.ink, bold: true, valign: 'top', fontFace: S.fonts.heading } as any);
    txt(slide, sc(s.evidence), { x: cx + 0.18, y: y0 + 0.72, w: cw - 0.36, h: 0.9, fontSize: 10.5, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.15 } as any);
  });
  const by = y0 + 1.95;
  if (p.conclusion) {
    slide.addShape('rect', { x: MX, y: by, w: 0.08, h: BOT - by - 0.2, fill: { color: pal.accent } });
    txt(slide, p.conclusion, { x: MX + 0.22, y: by, w: CW - 0.22, h: BOT - by - 0.2, fontSize: 12.5, color: pal.ink, valign: 'top', bold: true, fontFace: S.fonts.body, lineSpacingMultiple: 1.25 } as any);
  }
  folio(slide, p, pal);
}

// 3 value-chain（paper）
function renderValueChain(slide: PptxSlide, p: any): void {
  const pal = P('theme09_value-chain_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const cols = [
    { label: p.upstreamLabel, items: p.upstream },
    { label: p.midstreamLabel, items: p.midstream },
    { label: p.downstreamLabel, items: p.downstream },
  ];
  const gap = 0.3;
  const cw = (CW - gap * 2) / 3;
  const ch = BOT - y0 - 0.1;
  cols.forEach((c, i) => {
    const cx = MX + i * (cw + gap);
    card(slide, cx, y0, cw, ch, pal);
    slide.addShape('rect', { x: cx, y: y0, w: cw, h: 0.42, fill: { color: series(pal)[i] } });
    txt(slide, String(c.label || ''), { x: cx + 0.15, y: y0, w: cw - 0.3, h: 0.42, fontSize: 12, color: 'FFFFFF', bold: true, valign: 'middle', fontFace: S.fonts.heading } as any);
    const items = (c.items || []).slice(0, 4);
    let iy = y0 + 0.55;
    items.forEach((it: any) => {
      txt(slide, sc(it.name), { x: cx + 0.15, y: iy, w: cw - 0.3, h: 0.26, fontSize: 11.5, color: pal.ink, bold: true, fontFace: S.fonts.body } as any);
      txt(slide, sc(it.desc), { x: cx + 0.15, y: iy + 0.26, w: cw - 0.3, h: 0.4, fontSize: 9.5, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.1 } as any);
      iy += 0.74;
    });
  });
  folio(slide, p, pal);
}

// 4 risk（ink）
function renderRisk(slide: PptxSlide, p: any): void {
  const pal = P('theme09_risk_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const gx = MX + 1.3;
  const gy = y0 + 0.2;
  const gw = 6.4;
  const gh = BOT - y0 - 0.9;
  card(slide, gx, gy, gw, gh, pal);
  // quadrant lines at 50%
  slide.addShape('line', { x: gx + gw / 2, y: gy, w: 0, h: gh, line: { color: pal.borderStrong, width: 0.75, dashType: 'dash' } as any });
  slide.addShape('line', { x: gx, y: gy + gh / 2, w: gw, h: 0, line: { color: pal.borderStrong, width: 0.75, dashType: 'dash' } as any });
  txt(slide, p.axisProbability, { x: gx, y: gy + gh + 0.02, w: gw, h: 0.2, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono } as any);
  txt(slide, p.axisImpact, { x: gx - 1.25, y: gy, w: 1.1, h: gh, fontSize: 9, color: pal.ink3, align: 'center', valign: 'middle', rotate: 270, fontFace: S.fonts.mono } as any);
  (p.risks || []).slice(0, 8).forEach((r: any) => {
    const x = gx + (lvl(r.probability) / 100) * gw;
    const y = gy + (1 - lvl(r.impact) / 100) * gh;
    const col = r.level === '高' ? pal.accent : r.level === '中' ? pal.accent2 : series(pal)[3];
    slide.addShape('ellipse', { x: x - 0.11, y: y - 0.11, w: 0.22, h: 0.22, fill: { color: col }, line: { color: pal.bg, width: 1 } });
    txt(slide, sc(r.name), { x: x - 0.9, y: y - 0.32, w: 1.8, h: 0.2, fontSize: 8.5, color: pal.ink, align: 'center', fontFace: S.fonts.body } as any);
  });
  folio(slide, p, pal);
}

// 5 outlook（ink）
function renderOutlook(slide: PptxSlide, p: any): void {
  const pal = P('theme09_outlook_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const items = (p.outlooks || []).slice(0, 3);
  const n = Math.max(items.length, 1);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  items.forEach((o: any, i: number) => {
    const cx = MX + i * (cw + gap);
    card(slide, cx, y0, cw, 2.5, pal);
    txt(slide, sc(o.title), { x: cx + 0.18, y: y0 + 0.18, w: cw - 0.36, h: 0.5, fontSize: 13, color: pal.ink, bold: true, valign: 'top', fontFace: S.fonts.heading } as any);
    txt(slide, sc(o.description), { x: cx + 0.18, y: y0 + 0.75, w: cw - 0.36, h: 1.4, fontSize: 10.5, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.15 } as any);
    const trend = String(o.trend || '');
    const tc = trend.includes('上行') ? series(pal)[3] : trend.includes('下行') ? pal.accent : pal.accent2;
    t9Pill(slide, trend, cx + 0.18, y0 + 2.1, cw - 0.36, 0.32, tc, 'FFFFFF');
  });
  folio(slide, p, pal);
}

// 6 conclusion（paper）
function renderConclusion(slide: PptxSlide, p: any): void {
  const pal = P('theme09_conclusion_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  if (p.showBand) colorBar(slide, MX, y0 - 0.02, CW, pal);
  const items = (p.conclusions || []).slice(0, 4);
  const n = Math.max(items.length, 1);
  const gap = 0.22;
  const cw = (CW - gap * (n - 1)) / n;
  items.forEach((c: any, i: number) => {
    const cx = MX + i * (cw + gap);
    txt(slide, String(i + 1).padStart(2, '0'), { x: cx, y: y0 + 0.12, w: cw, h: 0.4, fontSize: 22, color: pal.accent, bold: true, align: 'left', fontFace: S.fonts.mono } as any);
    txt(slide, sc(c.title), { x: cx, y: y0 + 0.6, w: cw - 0.1, h: 0.5, fontSize: 12.5, color: pal.ink, bold: true, valign: 'top', fontFace: S.fonts.heading } as any);
    txt(slide, sc(c.summary), { x: cx, y: y0 + 1.1, w: cw - 0.1, h: 1.6, fontSize: 10, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.15 } as any);
  });
  folio(slide, p, pal);
}

// 7 bracket（paper）
function renderBracket(slide: PptxSlide, p: any): void {
  const pal = P('theme09_bracket_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const items = (p.items || []).slice(0, 6);
  const n = Math.max(items.length, 1);
  const iw = Math.min(1.7, (CW - 0.6) / n);
  const gap = (CW - iw * n) / (n + 1);
  items.forEach((it: any, i: number) => {
    const ix = MX + gap + i * (iw + gap);
    card(slide, ix, y0, iw, 0.7, pal);
    txt(slide, sc(it.item), { x: ix + 0.05, y: y0, w: iw - 0.1, h: 0.7, fontSize: 10.5, color: pal.ink, bold: true, align: 'center', valign: 'middle', fontFace: S.fonts.body } as any);
    if (i < n - 1) slide.addShape('line', { x: ix + iw, y: y0 + 0.35, w: gap, h: 0, line: { color: pal.borderStrong, width: 1, endArrowType: 'triangle' } as any });
  });
  const sy = y0 + 1.0;
  slide.addShape('line', { x: MX + gap, y: sy, w: 0, h: 0.5, line: { color: pal.accent, width: 2 } });
  slide.addShape('line', { x: MX + gap, y: sy + 0.5, w: CW - 2 * gap, h: 0, line: { color: pal.accent, width: 2 } });
  slide.addShape('line', { x: MX + CW - gap, y: sy, w: 0, h: 0.5, line: { color: pal.accent, width: 2 } });
  txt(slide, p.summary, { x: MX, y: sy + 0.7, w: CW, h: BOT - sy - 0.9, fontSize: 14, color: pal.ink, bold: true, valign: 'top', fontFace: S.fonts.heading, lineSpacingMultiple: 1.3 } as any);
  folio(slide, p, pal);
}

// 8 flow（ink）
function renderFlow(slide: PptxSlide, p: any): void {
  const pal = P('theme09_flow_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal);
  const nodes = (p.nodes || []).slice(0, 6);
  const links = (p.links || []).slice(0, 8);
  const colW = (CW - 1.0) / Math.max(nodes.length, 1);
  const nodeBoxes: { x: number; y: number; w: number; h: number; name: string }[] = [];
  nodes.forEach((nd: any, i: number) => {
    const bx = MX + 0.2 + i * colW;
    const by = y0 + 0.3 + (i % 2) * 0.9;
    const bw = colW - 0.3;
    nodeBoxes.push({ x: bx, y: by, w: bw, h: 0.5, name: sc(nd.name) });
    card(slide, bx, by, bw, 0.5, pal, pal.surfaceElevated);
    txt(slide, sc(nd.name), { x: bx + 0.05, y: by, w: bw - 0.1, h: 0.5, fontSize: 10, color: pal.ink, align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.body } as any);
  });
  links.forEach((lk: any, i: number) => {
    const a = nodeBoxes[Math.min(t9N(lk.source), nodeBoxes.length - 1)];
    const b = nodeBoxes[Math.min(t9N(lk.target), nodeBoxes.length - 1)];
    if (!a || !b) return;
    const v = t9N(lk.value);
    const w = Math.max(0.5, Math.min(4, v / 30));
    slide.addShape('line', { x: a.x + a.w, y: a.y + a.h / 2, w: b.x - (a.x + a.w), h: b.y + b.h / 2 - (a.y + a.h / 2), line: { color: series(pal)[i % 6], width: w, endArrowType: 'triangle' } as any });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight, pal);
}

// 9 orbit（ink）
function renderOrbit(slide: PptxSlide, p: any): void {
  const pal = P('theme09_orbit_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const cx = MX + CW / 2;
  const cy = (y0 + BOT) / 2 + 0.1;
  const R = Math.min((BOT - y0) / 2 - 0.3, CW / 2 - 1.0);
  slide.addShape('ellipse', { x: cx - R, y: cy - R, w: R * 2, h: R * 2, fill: { color: pal.surface }, line: { color: pal.borderStrong, width: 1.25 } });
  slide.addShape('ellipse', { x: cx - 0.9, y: cy - 0.9, w: 1.8, h: 1.8, fill: { color: pal.accent }, line: { width: 0 } });
  txt(slide, p.centerText, { x: cx - 0.9, y: cy - 0.9, w: 1.8, h: 1.8, fontSize: 12, color: 'FFFFFF', align: 'center', valign: 'middle', bold: true, fontFace: S.fonts.heading } as any);
  const evs = (p.events || []).slice(0, 8);
  const n = Math.max(evs.length, 1);
  evs.forEach((e: any, i: number) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
    const ex = cx + Math.cos(ang) * R;
    const ey = cy + Math.sin(ang) * R;
    slide.addShape('ellipse', { x: ex - 0.09, y: ey - 0.09, w: 0.18, h: 0.18, fill: { color: series(pal)[i % 6] }, line: { color: pal.bg, width: 1 } });
    const lx = cx + Math.cos(ang) * (R + 0.35);
    const ly = cy + Math.sin(ang) * (R + 0.35);
    txt(slide, sc(e.year), { x: lx - 0.5, y: ly - 0.34, w: 1.0, h: 0.18, fontSize: 9, color: pal.accent, align: 'center', bold: true, fontFace: S.fonts.mono } as any);
    txt(slide, sc(e.label), { x: lx - 0.6, y: ly - 0.16, w: 1.2, h: 0.5, fontSize: 9, color: pal.ink, align: 'center', valign: 'top', fontFace: S.fonts.body } as any);
  });
  folio(slide, p, pal);
}

// 10 vertical（paper）
function renderVertical(slide: PptxSlide, p: any): void {
  const pal = P('theme09_vertical_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const cards = (p.cards || []).slice(0, 3);
  const n = Math.max(cards.length, 1);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  cards.forEach((c: any, i: number) => {
    const cx = MX + i * (cw + gap);
    card(slide, cx, y0, cw, 2.5, pal);
    slide.addShape('rect', { x: cx, y: y0, w: cw, h: 1.0, fill: { color: pal.surfaceElevated }, line: { color: pal.border, width: 1 } });
    txt(slide, '影像', { x: cx, y: y0, w: cw, h: 1.0, fontSize: 10, color: pal.ink3, align: 'center', valign: 'middle', italic: true, fontFace: S.fonts.body } as any);
    txt(slide, sc(c.title), { x: cx + 0.18, y: y0 + 1.12, w: cw - 0.36, h: 0.4, fontSize: 13, color: pal.ink, bold: true, fontFace: S.fonts.heading } as any);
    txt(slide, sc(c.description), { x: cx + 0.18, y: y0 + 1.55, w: cw - 0.36, h: 0.85, fontSize: 10.5, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.15 } as any);
  });
  folio(slide, p, pal);
}

// 11 calendar（paper）
function renderCalendar(slide: PptxSlide, p: any): void {
  const pal = P('theme09_calendar_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const year = t9N(p.year) || 2026;
  const month = Math.max(1, Math.min(12, t9N(p.month) || 8));
  const days = new Date(year, month, 0).getDate();
  const cols = 7;
  const rows = Math.ceil(days / cols);
  const gridX = MX + 1.4;
  const gridW = CW - 1.4;
  const cell = gridW / cols;
  const gridH = (BOT - y0 - 0.2);
  const cellH = Math.min(0.55, gridH / rows);
  const evByDate: Record<string, any[]> = {};
  (p.events || []).forEach((e: any) => { (evByDate[String(sc(e.date))] = evByDate[String(sc(e.date))] || []).push(e); });
  for (let d = 1; d <= days; d++) {
    const r = Math.floor((d - 1) / cols);
    const c = (d - 1) % cols;
    const x = gridX + c * cell;
    const y = y0 + r * cellH;
    const has = evByDate[String(d)];
    slide.addShape('rect', { x, y, w: cell - 0.03, h: cellH - 0.03, fill: { color: has ? pal.accent : pal.surfaceElevated }, line: { color: pal.border, width: 0.75 } });
    txt(slide, String(d), { x: x + 0.04, y: y + 0.02, w: cell - 0.1, h: 0.18, fontSize: 9, color: has ? 'FFFFFF' : pal.ink3, bold: true, fontFace: S.fonts.mono } as any);
    if (has) txt(slide, String(sc(has[0].name)).slice(0, 6), { x: x + 0.04, y: y + 0.2, w: cell - 0.08, h: cellH - 0.24, fontSize: 7, color: 'FFFFFF', valign: 'top', fontFace: S.fonts.body } as any);
  }
  txt(slide, year + '.' + String(month).padStart(2, '0'), { x: MX, y: y0, w: 1.3, h: 0.4, fontSize: 16, color: pal.ink, bold: true, fontFace: S.fonts.mono } as any);
  folio(slide, p, pal);
}

// 12 phases（ink）
function renderPhases(slide: PptxSlide, p: any): void {
  const pal = P('theme09_phases_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const phases = (p.phases || []).slice(0, 4);
  const n = Math.max(phases.length, 1);
  const gap = 0.25;
  const cw = (CW - gap * (n - 1)) / n;
  phases.forEach((ph: any, i: number) => {
    const cx = MX + i * (cw + gap);
    card(slide, cx, y0, cw, 2.6, pal);
    t9Pill(slide, String(i + 1), cx + 0.18, y0 + 0.18, 0.4, 0.4, series(pal)[i % 6], 'FFFFFF');
    txt(slide, sc(ph.name), { x: cx + 0.66, y: y0 + 0.18, w: cw - 0.8, h: 0.4, fontSize: 12, color: pal.ink, bold: true, valign: 'middle', fontFace: S.fonts.heading } as any);
    txt(slide, [sc(ph.start), sc(ph.end)].filter(Boolean).join(' – '), { x: cx + 0.18, y: y0 + 0.66, w: cw - 0.36, h: 0.2, fontSize: 9, color: pal.accent, fontFace: S.fonts.mono } as any);
    const ms = (ph.milestones || []).slice(0, 3);
    let my = y0 + 0.95;
    ms.forEach((m: any) => {
      txt(slide, '• ' + sc(m), { x: cx + 0.18, y: my, w: cw - 0.36, h: 0.5, fontSize: 9.5, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.1 } as any);
      my += 0.52;
    });
  });
  folio(slide, p, pal);
}

// 13 gauge（ink）
function renderGauge(slide: PptxSlide, p: any): void {
  const pal = P('theme09_gauge_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal);
  const min = t9N(p.min) || 0;
  const max = t9N(p.max) || 100;
  const val = t9N(p.value);
  const span = Math.max(1, max - min);
  const gx = MX + 0.3;
  const gw = 6.0;
  const gy = y0 + 0.3;
  const gh = 0.5;
  (p.ranges || []).forEach((rg: any) => {
    const a = (t9N(rg.min) - min) / span;
    const b = (t9N(rg.max) - min) / span;
    const col = rg.color === '绿' ? series(pal)[3] : rg.color === '黄' ? series(pal)[2] : pal.accent;
    slide.addShape('rect', { x: gx + a * gw, y: gy, w: Math.max(0.02, (b - a) * gw), h: gh, fill: { color: col }, line: { width: 0 } });
  });
  const xp = gx + ((val - min) / span) * gw;
  slide.addShape('line', { x: xp, y: gy - 0.15, w: 0, h: gh + 0.3, line: { color: pal.ink, width: 2.5 } });
  txt(slide, p.readingLabel, { x: gx, y: gy + gh + 0.05, w: gw, h: 0.2, fontSize: 9, color: pal.ink3, align: 'left', fontFace: S.fonts.mono } as any);
  txt(slide, val.toFixed(1) + (p.unit ? ' ' + p.unit : ''), { x: gx + gw + 0.3, y: y0 + 0.1, w: CW - gw - 0.6, h: 0.9, fontSize: 40, color: pal.accent, bold: true, align: 'left', valign: 'middle', fontFace: S.fonts.heading } as any);
  txt(slide, p.subtitle, { x: gx + gw + 0.3, y: y0 + 1.0, w: CW - gw - 0.6, h: 1.2, fontSize: 11, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.2 } as any);
  footer(slide, p.footnoteLeft, p.footnoteRight, pal);
}

// 14 scoreboard（ink）
function renderScoreboard(slide: PptxSlide, p: any): void {
  const pal = P('theme09_scoreboard_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal);
  const headers = (p.headers || []).slice(0, 5);
  const rows = (p.rows || []).slice(0, 6);
  const hn = Math.max(headers.length, 1);
  const nameW = 2.2;
  const tblW = CW - nameW;
  const colW = tblW / hn;
  const rh = 0.42;
  // header
  slide.addShape('rect', { x: MX, y: y0, w: nameW, h: rh, fill: { color: pal.accent } });
  txt(slide, '参赛者', { x: MX + 0.1, y: y0, w: nameW - 0.2, h: rh, fontSize: 10, color: 'FFFFFF', bold: true, valign: 'middle', fontFace: S.fonts.body } as any);
  headers.forEach((h: any, i: number) => {
    const hx = MX + nameW + i * colW;
    slide.addShape('rect', { x: hx, y: y0, w: colW, h: rh, fill: { color: pal.surfaceElevated } });
    txt(slide, sc(h.label), { x: hx + 0.04, y: y0, w: colW - 0.08, h: rh, fontSize: 9, color: pal.ink, bold: true, align: 'center', valign: 'middle', fontFace: S.fonts.body } as any);
  });
  rows.forEach((r: any, ri: number) => {
    const ry = y0 + (ri + 1) * rh;
    const hl = String(r.name) === String(p.highlightRow);
    slide.addShape('rect', { x: MX, y: ry, w: nameW, h: rh, fill: { color: hl ? pal.accent : pal.surface } });
    txt(slide, sc(r.name), { x: MX + 0.1, y: ry, w: nameW - 0.2, h: rh, fontSize: 10, color: hl ? 'FFFFFF' : pal.ink, bold: true, valign: 'middle', fontFace: S.fonts.body } as any);
    (r.scores || []).slice(0, hn).forEach((s: any, i: number) => {
      const hx = MX + nameW + i * colW;
      txt(slide, sc(s), { x: hx + 0.04, y: ry, w: colW - 0.08, h: rh, fontSize: 10, color: pal.ink2, align: 'center', valign: 'middle', fontFace: S.fonts.mono } as any);
    });
  });
  footer(slide, p.footnoteLeft, p.footnoteRight, pal);
}

// 15 trend（paper）
function renderTrend(slide: PptxSlide, p: any): void {
  const pal = P('theme09_trend_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal);
  const qs = (p.quarters || []).map(sc);
  const main = (p.mainSeries || []).map(t9N);
  const yoy = (p.yoySeries || []).map(t9N);
  const n = Math.max(qs.length, 1);
  const plotX = MX + 0.3;
  const plotW = CW - 1.0;
  const plotY = y0 + 0.2;
  const plotH = 2.7;
  const maxM = Math.max(1, ...main);
  const baseY = plotY + plotH;
  const bw = (plotW / n) * 0.5;
  qs.forEach((q: string, i: number) => {
    const cx = plotX + (i + 0.5) * (plotW / n);
    const h = (main[i] / maxM) * (plotH - 0.3);
    slide.addShape('rect', { x: cx - bw / 2, y: baseY - h, w: bw, h, fill: { color: pal.accent }, line: { width: 0 } });
    txt(slide, q, { x: cx - plotW / n / 2, y: baseY + 0.02, w: plotW / n, h: 0.2, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono } as any);
  });
  // yoy line (right axis, scaled to -20..40)
  const ly = (v: number) => baseY - ((v + 20) / 60) * (plotH - 0.3);
  let prev: { x: number; y: number } | null = null;
  qs.forEach((_q: string, i: number) => {
    const cx = plotX + (i + 0.5) * (plotW / n);
    const py = ly(yoy[i]);
    if (prev) slide.addShape('line', { x: prev.x, y: prev.y, w: cx - prev.x, h: py - prev.y, line: { color: pal.accent2, width: 2 } });
    prev = { x: cx, y: py };
  });
  t9Pill(slide, p.mainName + ' · ' + (p.unit || ''), plotX, plotY - 0.05, 2.4, 0.26, pal.accent, 'FFFFFF');
  t9Pill(slide, p.yoyName, plotX + 2.6, plotY - 0.05, 2.2, 0.26, pal.accent2, 'FFFFFF');
  footer(slide, p.footnoteLeft, p.footnoteRight, pal);
}

// 16 histogram（paper）
function renderHistogram(slide: PptxSlide, p: any): void {
  const pal = P('theme09_histogram_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal);
  const bins = (p.bins || []).slice(0, 12);
  const n = Math.max(bins.length, 1);
  const plotX = MX;
  const plotW = CW - 1.2;
  const plotY = y0 + 0.2;
  const plotH = 2.7;
  const maxC = Math.max(1, ...bins.map((b: any) => t9N(b.count)));
  const baseY = plotY + plotH;
  const bw = plotW / n;
  bins.forEach((b: any, i: number) => {
    const h = (t9N(b.count) / maxC) * (plotH - 0.3);
    slide.addShape('rect', { x: plotX + i * bw + 0.04, y: baseY - h, w: bw - 0.08, h, fill: { color: series(pal)[i % 6] }, line: { width: 0 } });
    txt(slide, String(sc(b.range)).slice(0, 6), { x: plotX + i * bw, y: baseY + 0.02, w: bw, h: 0.2, fontSize: 8, color: pal.ink3, align: 'center', fontFace: S.fonts.mono } as any);
  });
  if (p.mean != null) {
    const mx = plotX + (t9N(p.mean) / Math.max(1, ...bins.map((b: any) => t9N(b.count)))) * plotW;
    slide.addShape('line', { x: mx, y: plotY, w: 0, h: plotH, line: { color: pal.accent, width: 2, dashType: 'dash' } as any });
    txt(slide, '均值 ' + p.mean, { x: Math.min(mx + 0.05, plotX + plotW - 1.5), y: plotY + 0.02, w: 1.5, h: 0.2, fontSize: 9, color: pal.accent, bold: true, fontFace: S.fonts.mono } as any);
  }
  footer(slide, p.footnoteLeft, p.footnoteRight, pal);
}

// 17 forecast-fan（ink）
function renderForecastFan(slide: PptxSlide, p: any): void {
  const pal = P('theme09_forecast-fan_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal);
  const seriesArr = (p.series || []).slice(0, 3);
  const cats = Math.max(1, ...seriesArr.map((s: any) => String(s.data || '').split('|').length));
  const plotX = MX + 0.3;
  const plotW = CW - 1.0;
  const plotY = y0 + 0.2;
  const plotH = 2.6;
  const baseY = plotY + plotH;
  const all = seriesArr.flatMap((s: any) => String(s.data || '').split('|').map(t9N));
  const maxV = Math.max(1, ...all);
  const xAt = (i: number) => plotX + ((i + 0.5) / cats) * plotW;
  const yAt = (v: number) => baseY - (v / maxV) * (plotH - 0.3);
  // draw outer two series as a filled band (fan) via thin rects
  if (seriesArr.length >= 2) {
    const lo = String(seriesArr[0].data || '').split('|').map(t9N);
    const hi = String(seriesArr[seriesArr.length - 1].data || '').split('|').map(t9N);
    lo.forEach((v: number, i: number) => {
      const yLo = yAt(Math.min(v, hi[i]));
      const yHi = yAt(Math.max(v, hi[i]));
      slide.addShape('rect', { x: xAt(i) - 0.12, y: yHi, w: 0.24, h: Math.max(0.02, yLo - yHi), fill: { color: pal.accent, transparency: 78 }, line: { width: 0 } });
    });
  }
  // each series as line
  seriesArr.forEach((s: any, si: number) => {
    const vals = String(s.data || '').split('|').map(t9N);
    let prev: { x: number; y: number } | null = null;
    vals.forEach((v: number, i: number) => {
      const px = xAt(i), py = yAt(v);
      if (prev) slide.addShape('line', { x: prev.x, y: prev.y, w: px - prev.x, h: py - prev.y, line: { color: series(pal)[si % 6], width: 2 } });
      prev = { x: px, y: py };
    });
  });
  (p.annotations || []).slice(0, 3).forEach((a: any, i: number) => {
    const ax = plotX + (t9N(a.period) / cats) * plotW;
    txt(slide, sc(a.text), { x: Math.min(ax, plotX + plotW - 2), y: plotY + 0.05 + i * 0.22, w: 2.0, h: 0.2, fontSize: 8.5, color: pal.ink2, italic: true, fontFace: S.fonts.body } as any);
  });
  footer(slide, p.footnoteLeft, p.footnoteRight, pal);
}

// 18 plans（paper）
function renderPlans(slide: PptxSlide, p: any): void {
  const pal = P('theme09_plans_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const plans = (p.plans || []).slice(0, 3);
  const n = Math.max(plans.length, 1);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  plans.forEach((pl: any, i: number) => {
    const cx = MX + i * (cw + gap);
    const rec = !!pl.recommended;
    card(slide, cx, y0, cw, 2.7, pal, rec ? pal.accent : pal.surfaceElevated, rec ? pal.accent : pal.border);
    txt(slide, sc(pl.name), { x: cx + 0.18, y: y0 + 0.18, w: cw - 0.36, h: 0.4, fontSize: 13, color: rec ? pal.accent : pal.ink, bold: true, fontFace: S.fonts.heading } as any);
    txt(slide, sc(pl.summary), { x: cx + 0.18, y: y0 + 0.62, w: cw - 0.36, h: 0.5, fontSize: 10, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.1 } as any);
    (pl.points || []).slice(0, 3).forEach((pt: any, k: number) => {
      txt(slide, '– ' + sc(pt), { x: cx + 0.18, y: y0 + 1.15 + k * 0.42, w: cw - 0.36, h: 0.4, fontSize: 9.5, color: pal.ink, valign: 'top', fontFace: S.fonts.body } as any);
    });
    if (rec) t9Pill(slide, '推荐', cx + cw - 1.0, y0 + 0.2, 0.82, 0.3, pal.accent, 'FFFFFF');
  });
  if (p.conclusion) txt(slide, p.conclusion, { x: MX, y: y0 + 2.85, w: CW, h: 0.5, fontSize: 11, color: pal.ink, bold: true, fontFace: S.fonts.body } as any);
  folio(slide, p, pal);
}

// 19 stair（ink）
function renderStair(slide: PptxSlide, p: any): void {
  const pal = P('theme09_stair_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const steps = (p.steps || []).slice(0, 5);
  const n = Math.max(steps.length, 1);
  const stepW = (CW - 0.6) / n;
  const baseY = BOT - 0.3;
  const stepH = (baseY - y0 - 0.3) / n;
  steps.forEach((s: any, i: number) => {
    const sx = MX + i * stepW + 0.1;
    const sy = baseY - (i + 1) * stepH;
    card(slide, sx, sy, stepW - 0.2, (i + 1) * stepH, pal, pal.surfaceElevated);
    t9Pill(slide, String(i + 1), sx + 0.12, sy + 0.12, 0.36, 0.36, series(pal)[i % 6], 'FFFFFF');
    txt(slide, sc(s.name), { x: sx + 0.55, y: sy + 0.12, w: stepW - 0.7, h: 0.4, fontSize: 12, color: pal.ink, bold: true, valign: 'middle', fontFace: S.fonts.heading } as any);
    txt(slide, sc(s.description), { x: sx + 0.14, y: sy + 0.55, w: stepW - 0.34, h: (i + 1) * stepH - 0.7, fontSize: 9.5, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.1 } as any);
  });
  folio(slide, p, pal);
}

// 20 stacked（paper）
function renderStacked(slide: PptxSlide, p: any): void {
  const pal = P('theme09_stacked_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const periods = (p.periods || []).map(sc);
  const seriesArr = (p.series || []).slice(0, 6);
  const n = Math.max(periods.length, 1);
  const plotX = MX;
  const plotW = CW;
  const plotY = y0 + 0.2;
  const plotH = 2.4;
  const baseY = plotY + plotH;
  const maxTot = Math.max(1, ...seriesArr.map((s: any) => String(s.data || '').split('|').reduce((a: number, x: string) => a + t9N(x), 0)));
  const bw = (plotW / n) * 0.6;
  periods.forEach((pr: string, i: number) => {
    const cx = plotX + (i + 0.5) * (plotW / n);
    let acc = 0;
    seriesArr.forEach((s: any, si: number) => {
      const v = t9N(String(s.data || '').split('|')[i]);
      const h = (v / maxTot) * (plotH - 0.2);
      slide.addShape('rect', { x: cx - bw / 2, y: baseY - acc - h, w: bw, h: Math.max(0.01, h), fill: { color: series(pal)[si % 6] }, line: { color: pal.bg, width: 0.5 } });
      acc += h;
    });
    txt(slide, pr, { x: cx - plotW / n / 2, y: baseY + 0.02, w: plotW / n, h: 0.2, fontSize: 9, color: pal.ink3, align: 'center', fontFace: S.fonts.mono } as any);
  });
  seriesArr.forEach((s: any, si: number) => {
    const lx = MX + (si % 3) * 2.6;
    const ly = baseY + 0.32 + Math.floor(si / 3) * 0.28;
    slide.addShape('rect', { x: lx, y: ly, w: 0.18, h: 0.18, fill: { color: series(pal)[si % 6] } });
    txt(slide, sc(s.name), { x: lx + 0.24, y: ly - 0.02, w: 2.3, h: 0.22, fontSize: 9.5, color: pal.ink2, fontFace: S.fonts.body } as any);
  });
  footer(slide, p.footnoteLeft, p.footnoteRight, pal);
}

// 21 era（ink）
function renderEra(slide: PptxSlide, p: any): void {
  const pal = P('theme09_era_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const eras = (p.eras || []).slice(0, 3);
  const n = Math.max(eras.length, 1);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  eras.forEach((e: any, i: number) => {
    const cx = MX + i * (cw + gap);
    card(slide, cx, y0, cw, BOT - y0 - 0.1, pal);
    slide.addShape('rect', { x: cx, y: y0, w: 0.1, h: BOT - y0 - 0.1, fill: { color: series(pal)[i % 6] } });
    txt(slide, sc(e.year), { x: cx + 0.22, y: y0 + 0.15, w: cw - 0.4, h: 0.3, fontSize: 16, color: pal.accent, bold: true, fontFace: S.fonts.mono } as any);
    txt(slide, sc(e.label), { x: cx + 0.22, y: y0 + 0.5, w: cw - 0.4, h: 0.5, fontSize: 13, color: pal.ink, bold: true, fontFace: S.fonts.heading } as any);
    (e.events || []).slice(0, 4).forEach((ev: any, k: number) => {
      txt(slide, '· ' + sc(ev), { x: cx + 0.22, y: y0 + 1.1 + k * 0.42, w: cw - 0.44, h: 0.4, fontSize: 10, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.1 } as any);
    });
  });
  folio(slide, p, pal);
}

// 22 roadmap（paper）
function renderRoadmap(slide: PptxSlide, p: any): void {
  const pal = P('theme09_roadmap_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const stages = (p.stages || []).slice(0, 4);
  const n = Math.max(stages.length, 1);
  const gap = 0.3;
  const cw = (CW - gap * (n - 1)) / n;
  const lineY = y0 + 0.5;
  slide.addShape('line', { x: MX, y: lineY, w: CW, h: 0, line: { color: pal.borderStrong, width: 1.5 } });
  stages.forEach((st: any, i: number) => {
    const cx = MX + i * (cw + gap);
    const col = st.status === '已完成' ? series(pal)[3] : st.status === '进行中' ? pal.accent : pal.ink3;
    slide.addShape('ellipse', { x: cx + cw / 2 - 0.14, y: lineY - 0.14, w: 0.28, h: 0.28, fill: { color: col }, line: { color: pal.bg, width: 1.5 } });
    card(slide, cx, y0 + 0.95, cw, 1.9, pal);
    txt(slide, sc(st.name), { x: cx + 0.15, y: y0 + 1.1, w: cw - 0.3, h: 0.4, fontSize: 12, color: pal.ink, bold: true, fontFace: S.fonts.heading } as any);
    t9Pill(slide, sc(st.status), cx + 0.15, y0 + 1.5, cw - 0.3, 0.28, col, 'FFFFFF');
    txt(slide, sc(st.time), { x: cx + 0.15, y: y0 + 1.85, w: cw - 0.3, h: 0.2, fontSize: 9, color: pal.accent, fontFace: S.fonts.mono } as any);
    txt(slide, sc(st.description), { x: cx + 0.15, y: y0 + 2.1, w: cw - 0.3, h: 0.7, fontSize: 9.5, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.1 } as any);
  });
  if (p.endCaption) txt(slide, p.endCaption, { x: MX, y: y0 + 0.2, w: CW, h: 0.25, fontSize: 10, color: pal.ink3, align: 'right', italic: true, fontFace: S.fonts.body } as any);
  folio(slide, p, pal);
}

// 23 score（ink）
function renderScore(slide: PptxSlide, p: any): void {
  const pal = P('theme09_score_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal);
  const crit = (p.criteria || []).slice(0, 6);
  const n = Math.max(crit.length, 1);
  const labelW = 2.2;
  const plotX = MX + labelW;
  const plotW = CW - labelW - 1.2;
  const rowH = Math.min(0.5, (BOT - y0 - 0.2) / n);
  crit.forEach((c: any, i: number) => {
    const ry = y0 + 0.1 + i * rowH;
    txt(slide, sc(c.name), { x: MX, y: ry, w: labelW - 0.1, h: rowH, fontSize: 10.5, color: pal.ink, bold: true, valign: 'middle', fontFace: S.fonts.body } as any);
    const max = t9N(c.maxScore) || 10;
    const sc2 = t9N(c.score);
    const w = Math.max(0.02, (sc2 / max) * plotW);
    slide.addShape('rect', { x: plotX, y: ry + rowH / 2 - 0.1, w: plotW, h: 0.2, fill: { color: pal.surfaceElevated }, line: { width: 0 } });
    slide.addShape('rect', { x: plotX, y: ry + rowH / 2 - 0.1, w, h: 0.2, fill: { color: series(pal)[i % 6] }, line: { width: 0 } });
    txt(slide, sc2.toFixed(1) + '/' + max, { x: plotX + plotW + 0.05, y: ry, w: 1.1, h: rowH, fontSize: 9.5, color: pal.ink2, valign: 'middle', fontFace: S.fonts.mono } as any);
  });
  if (p.totalScore) txt(slide, '总分 ' + sc(p.totalScore), { x: MX, y: BOT - 0.1, w: CW, h: 0.25, fontSize: 11, color: pal.accent, bold: true, fontFace: S.fonts.mono } as any);
  footer(slide, p.footnoteLeft, p.footnoteRight, pal);
}

// 24 takeaway（ink）
function renderTakeaway(slide: PptxSlide, p: any): void {
  const pal = P('theme09_takeaway_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const pts = (p.points || []).slice(0, 4);
  const n = Math.max(pts.length, 1);
  const rh = (BOT - y0 - 0.1) / n;
  pts.forEach((pt: any, i: number) => {
    const ry = y0 + i * rh;
    slide.addShape('ellipse', { x: MX, y: ry + rh / 2 - 0.25, w: 0.5, h: 0.5, fill: { color: series(pal)[i % 6] }, line: { width: 0 } });
    txt(slide, sc(pt.number) || String(i + 1), { x: MX, y: ry + rh / 2 - 0.25, w: 0.5, h: 0.5, fontSize: 14, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle', fontFace: S.fonts.mono } as any);
    txt(slide, sc(pt.title), { x: MX + 0.65, y: ry + 0.05, w: CW - 0.65, h: 0.3, fontSize: 13, color: pal.ink, bold: true, fontFace: S.fonts.heading } as any);
    txt(slide, sc(pt.summary), { x: MX + 0.65, y: ry + 0.38, w: CW - 0.65, h: rh - 0.45, fontSize: 10.5, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.15 } as any);
  });
  folio(slide, p, pal);
}

// 25 compare（paper）
function renderCompare(slide: PptxSlide, p: any): void {
  const pal = P('theme09_compare_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const dims = (p.dimensions || []).slice(0, 6);
  const colW = (CW - 0.4) / 2;
  const leftX = MX;
  const rightX = MX + colW + 0.4;
  const headerH = 0.5;
  slide.addShape('rect', { x: leftX, y: y0, w: colW, h: headerH, fill: { color: pal.accent } });
  slide.addShape('rect', { x: rightX, y: y0, w: colW, h: headerH, fill: { color: pal.accent2 } });
  txt(slide, p.leftTitle, { x: leftX + 0.15, y: y0, w: colW - 0.3, h: headerH, fontSize: 13, color: 'FFFFFF', bold: true, valign: 'middle', fontFace: S.fonts.heading } as any);
  txt(slide, p.rightTitle, { x: rightX + 0.15, y: y0, w: colW - 0.3, h: headerH, fontSize: 13, color: 'FFFFFF', bold: true, valign: 'middle', fontFace: S.fonts.heading } as any);
  const rh = Math.min(0.6, (BOT - y0 - headerH - 0.1) / Math.max(dims.length, 1));
  dims.forEach((d: any, i: number) => {
    const ry = y0 + headerH + 0.05 + i * rh;
    const winL = String(d.winner) === 'left';
    slide.addShape('rect', { x: leftX, y: ry, w: colW, h: rh - 0.05, fill: { color: winL ? pal.accent : pal.surfaceElevated }, line: { color: pal.border, width: 0.75 } });
    slide.addShape('rect', { x: rightX, y: ry, w: colW, h: rh - 0.05, fill: { color: !winL ? pal.accent2 : pal.surfaceElevated }, line: { color: pal.border, width: 0.75 } });
    if (i === 0) {
      txt(slide, sc(d.name), { x: leftX, y: y0 + headerH + 0.05, w: colW, h: 0.22, fontSize: 8.5, color: pal.ink3, align: 'center', fontFace: S.fonts.mono } as any);
    }
    txt(slide, sc(d.leftValue), { x: leftX + 0.15, y: ry + 0.22, w: colW - 0.3, h: rh - 0.3, fontSize: 10.5, color: winL ? 'FFFFFF' : pal.ink, bold: winL, valign: 'middle', fontFace: S.fonts.body } as any);
    txt(slide, sc(d.rightValue), { x: rightX + 0.15, y: ry + 0.22, w: colW - 0.3, h: rh - 0.3, fontSize: 10.5, color: !winL ? 'FFFFFF' : pal.ink, bold: !winL, valign: 'middle', fontFace: S.fonts.body } as any);
  });
  folio(slide, p, pal);
}

// 26 process（paper）
function renderProcess(slide: PptxSlide, p: any): void {
  const pal = P('theme09_process_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const steps = (p.steps || []).slice(0, 5);
  const n = Math.max(steps.length, 1);
  const gap = 0.25;
  const cw = (CW - gap * (n - 1)) / n;
  steps.forEach((s: any, i: number) => {
    const cx = MX + i * (cw + gap);
    card(slide, cx, y0, cw, 2.4, pal);
    t9Pill(slide, String(i + 1), cx + 0.18, y0 + 0.18, 0.4, 0.4, series(pal)[i % 6], 'FFFFFF');
    txt(slide, sc(s.name), { x: cx + 0.66, y: y0 + 0.18, w: cw - 0.8, h: 0.4, fontSize: 12, color: pal.ink, bold: true, valign: 'middle', fontFace: S.fonts.heading } as any);
    txt(slide, sc(s.description), { x: cx + 0.18, y: y0 + 0.7, w: cw - 0.36, h: 1.5, fontSize: 10, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.15 } as any);
    if (i < n - 1) slide.addShape('line', { x: cx + cw, y: y0 + 1.2, w: gap, h: 0, line: { color: pal.accent, width: 1.5, endArrowType: 'triangle' } as any });
  });
  folio(slide, p, pal);
}

// 27 faq（paper）
function renderFaq(slide: PptxSlide, p: any): void {
  const pal = P('theme09_faq_v1');
  frame(slide, pal, { bottom: false });
  const y0 = t9Head(slide, p, pal, { size: 26 });
  const faqs = (p.faqs || []).slice(0, 6);
  const colN = 2;
  const colW = (CW - 0.4) / 2;
  const rowH = Math.min(0.85, (BOT - y0 - 0.1) / Math.ceil(faqs.length / colN));
  faqs.forEach((f: any, i: number) => {
    const col = i % colN;
    const row = Math.floor(i / colN);
    const cx = MX + col * (colW + 0.4);
    const cy = y0 + row * rowH;
    txt(slide, 'Q  ' + sc(f.question), { x: cx, y: cy, w: colW - 0.1, h: 0.3, fontSize: 11, color: pal.accent, bold: true, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.1 } as any);
    txt(slide, 'A  ' + sc(f.answer), { x: cx, y: cy + 0.32, w: colW - 0.1, h: rowH - 0.36, fontSize: 9.5, color: pal.ink2, valign: 'top', fontFace: S.fonts.body, lineSpacingMultiple: 1.1 } as any);
  });
  folio(slide, p, pal);
}

type T09RenderFn = (slide: PptxSlide, props: any) => void;

// ────────────────────────────────────────────────────────────────
// 通用渲染器（补齐 P1/P2 共 78 个版式，避免导出落入 "Unknown layout" 占位）
// 数据感知：能读到 chart/series/image/quote 字段即渲染真实内容，否则渲染带版式名的标注卡。
// ────────────────────────────────────────────────────────────────
function toNums(v: unknown): number[] {
  if (v == null) return [];
  if (typeof v === 'string') return v.split(/[|,\n]/).map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
  if (Array.isArray(v)) return v.map((x) => parseFloat(Array.isArray(x) ? x[0] : x)).filter((n) => !isNaN(n));
  return [];
}

function normChart(p: any): { cats: string[]; s: { name: string; values: number[] }[] } {
  let cats: string[] = [];
  if (Array.isArray(p.categories)) cats = p.categories.map(String);
  else if (Array.isArray(p.labels)) cats = p.labels.map(String);
  else if (Array.isArray(p.quarters)) cats = p.quarters.map(String);
  else if (Array.isArray(p.periods)) cats = p.periods.map(String);
  else if (Array.isArray(p.bins)) cats = p.bins.map((b: any) => String(b.range ?? b.label ?? b));
  let s: { name: string; values: number[] }[] = [];
  if (Array.isArray(p.series)) s = p.series.map((x: any) => ({ name: x.name || '', values: toNums(x.data ?? x.values ?? x.points) }));
  else if (Array.isArray(p.mainSeries)) s = [{ name: p.mainName || '主序列', values: toNums(p.mainSeries) }];
  if (!cats.length && s.length) cats = s[0].values.map((_: number, i: number) => String(i + 1));
  return { cats, s };
}

function renderT09ChartGeneric(slide: PptxSlide, p: any, layoutId: string): void {
  const pal = P(layoutId);
  frame(slide, pal);
  const y0 = t9Head(slide, p, pal);
  const plotX = MX, plotW = CW, plotY = y0 + 0.2, plotH = Math.max(1.6, BOT - plotY - 0.2);
  const { cats, s } = normChart(p);
  if (s.length && cats.length) {
    const data = s.slice(0, 6).map((se, i) => ({ name: se.name || '系列 ' + (i + 1), labels: cats.slice(0, 12), values: se.values.slice(0, 12) }));
    slide.addChart('bar', data as any, {
      x: plotX, y: plotY, w: plotW, h: plotH,
      barDir: 'col', barGrouping: 'clustered',
      chartColors: s.slice(0, 6).map((_, i) => series(pal)[i % 6]),
      showLegend: s.length > 1, legendPos: 'b', legendFontSize: 9, legendColor: pal.ink3,
      catAxisLabelColor: pal.ink3, valAxisLabelColor: pal.ink3,
      catAxisLabelFontSize: 9, valAxisLabelFontSize: 9, chartColorsOpacity: 95,
    } as any);
  } else {
    card(slide, plotX, plotY, plotW, plotH, pal);
    txt(slide, '图表版式 · ' + layoutId.replace('theme09_', '').replace('_v1', ''), {
      x: plotX + 0.2, y: plotY + plotH / 2 - 0.2, w: plotW - 0.4, h: 0.4,
      fontSize: 13, color: pal.ink3, align: 'center', fontFace: S.fonts.mono,
    } as any);
  }
  folio(slide, p, pal);
}

function renderT09MediaGeneric(slide: PptxSlide, p: any, layoutId: string): void {
  const pal = P(layoutId);
  frame(slide, pal);
  const y0 = t9Head(slide, p, pal);
  const h = Math.max(1.6, BOT - y0 - 1.15);
  const src: unknown[] = [];
  if (p.image) src.push(p.image);
  if (Array.isArray(p.images)) src.push(...p.images);
  else if (Array.isArray(p.photos)) src.push(...p.photos);
  const imgs: string[] = src.map(toImgUrl).filter((u): u is string => typeof u === 'string' && u.length > 0).slice(0, 4);
  if (imgs.length) {
    const gap = 0.15;
    const cw = (CW - gap * (imgs.length - 1)) / imgs.length;
    imgs.forEach((u, i) => {
      const x = MX + i * (cw + gap);
      tryImage(slide, u, x, y0 + 0.2, cw, h, () => card(slide, x, y0 + 0.2, cw, h, pal));
    });
  } else {
    card(slide, MX, y0 + 0.2, CW, h, pal);
    txt(slide, '影像版式 · ' + layoutId.replace('theme09_', '').replace('_v1', ''), {
      x: MX + 0.2, y: y0 + 0.2 + h / 2 - 0.2, w: CW - 0.4, h: 0.4,
      fontSize: 13, color: pal.ink3, align: 'center', fontFace: S.fonts.mono,
    } as any);
  }
  let iy = y0 + 0.2 + h + 0.12;
  if (p.quote) txt(slide, p.quote, { x: MX, y: iy, w: CW, h: 0.5, fontSize: 14, color: pal.accent, bold: true, fontFace: S.fonts.heading, italic: true } as any);
  const items = (p.items || p.points || []).slice(0, 5);
  items.forEach((t: any, i: number) => {
    const s2 = typeof t === 'string' ? t : (t.text || t.label || t.title || '');
    txt(slide, '– ' + s2, { x: MX, y: iy + (p.quote ? 0.55 : 0) + i * 0.3, w: CW, h: 0.3, fontSize: 11, color: pal.ink2, fontFace: S.fonts.body } as any);
  });
  folio(slide, p, pal);
}

const CHART_LAYOUTS = [
  'theme09_market_overview_v1', 'theme09_streamgraph_v1', 'theme09_chord_v1', 'theme09_sunburst_v1',
  'theme09_ribbon_v1', 'theme09_rounds_v1', 'theme09_ranking_v1', 'theme09_bump_v1',
  'theme09_hero_number_v1', 'theme09_versus_v1', 'theme09_spiral_v1', 'theme09_funnel_v1',
  'theme09_stat_grid_v1', 'theme09_arc_v1', 'theme09_network_v1', 'theme09_area_v1',
  'theme09_mega_number_v1', 'theme09_radar_v1', 'theme09_radialbar_v1', 'theme09_honeycomb_v1',
  'theme09_tornado_v1', 'theme09_matrix_v1', 'theme09_quadrant_v1', 'theme09_bubble_v1',
  'theme09_marimekko_v1', 'theme09_meter_v1', 'theme09_parallel_v1', 'theme09_grade_v1',
  'theme09_slope_v1', 'theme09_dumbbell_v1', 'theme09_crosstab_v1', 'theme09_tier_v1',
  'theme09_ledger_v1', 'theme09_alloc_v1', 'theme09_venn_v1', 'theme09_treemap_v1',
  'theme09_icicle_v1', 'theme09_waterfall_v1', 'theme09_heatmap_v1',
];
const MEDIA_LAYOUTS = [
  'theme09_specimen_v1', 'theme09_photo_feature_v1', 'theme09_photo_grid_v1', 'theme09_photo_quote_v1',
  'theme09_photo_duo_v1', 'theme09_photo_panorama_v1', 'theme09_photo_stage_v1', 'theme09_storyboard_v1',
  'theme09_snapshot_tape_v1', 'theme09_epigraph_v1', 'theme09_photo_bento_v1', 'theme09_timeline_photo_v1',
  'theme09_filmstrip_v1', 'theme09_mosaic_v1', 'theme09_testimonial_v1', 'theme09_team_v1',
  'theme09_photo_ring_v1', 'theme09_divider_photo_v1', 'theme09_coverstory_v1', 'theme09_quote_portrait_v1',
  'theme09_manifesto_v1', 'theme09_annotated_v1', 'theme09_diptych_v1', 'theme09_case_folio_v1',
  'theme09_split_diagonal_v1', 'theme09_typeriver_v1', 'theme09_exhibit_wall_v1', 'theme09_masonry_v1',
  'theme09_journey_v1', 'theme09_photo_cards_v1', 'theme09_zine_spread_v1', 'theme09_photo_scene_v1',
  'theme09_spotlight_v1', 'theme09_profile_v1', 'theme09_gallery_wall_v1', 'theme09_dotmatrix_v1',
];
const bindChart = (id: string): T09RenderFn => (s, p) => renderT09ChartGeneric(s, p, id);
const bindMedia = (id: string): T09RenderFn => (s, p) => renderT09MediaGeneric(s, p, id);
const CHART_RENDERERS = Object.fromEntries(CHART_LAYOUTS.map((id) => [id, bindChart(id)])) as Record<string, T09RenderFn>;
const MEDIA_RENDERERS = Object.fromEntries(MEDIA_LAYOUTS.map((id) => [id, bindMedia(id)])) as Record<string, T09RenderFn>;

const RENDERERS: Record<string, T09RenderFn> = {
  theme09_cover_masthead_v1: renderCoverMasthead,
  theme09_cover_bleed_v1: renderCoverBleed,
  theme09_cover_dossier_v1: renderCoverDossier,
  theme09_cover_colorbar_v1: renderCoverColorbar,
  theme09_cover_aperture_v1: renderCoverAperture,
  theme09_cover_colophon_v1: renderCoverColophon,
  theme09_cover_photo_v1: renderCoverPhoto,
  theme09_abstract_v1: renderAbstract,
  theme09_contents_v1: renderContents,
  theme09_section_v1: renderSection,
  theme09_section_card_v1: renderSectionCard,
  theme09_closing_v1: renderClosing,
  theme09_thesis_v1: renderThesis,
  theme09_risk_v1: renderRisk,
  theme09_outlook_v1: renderOutlook,
  theme09_conclusion_v1: renderConclusion,
  theme09_bracket_v1: renderBracket,
  theme09_flow_v1: renderFlow,
  theme09_orbit_v1: renderOrbit,
  theme09_vertical_v1: renderVertical,
  theme09_calendar_v1: renderCalendar,
  theme09_phases_v1: renderPhases,
  theme09_gauge_v1: renderGauge,
  theme09_scoreboard_v1: renderScoreboard,
  theme09_trend_v1: renderTrend,
  theme09_histogram_v1: renderHistogram,
  theme09_plans_v1: renderPlans,
  theme09_stair_v1: renderStair,
  theme09_stacked_v1: renderStacked,
  theme09_era_v1: renderEra,
  theme09_roadmap_v1: renderRoadmap,
  theme09_score_v1: renderScore,
  theme09_takeaway_v1: renderTakeaway,
  theme09_compare_v1: renderCompare,
  theme09_process_v1: renderProcess,
  theme09_faq_v1: renderFaq,
  // 模板版式 id 用下划线（cross_perspective / value_chain / forecast_fan），
  // 与源码 hyphen 键别名对齐，避免导出落到 Unknown layout。
  'theme09_cross_perspective_v1': renderCrossPerspective,
  'theme09_value_chain_v1': renderValueChain,
  'theme09_forecast_fan_v1': renderForecastFan,
  // ── P2 图表型（按 layoutId 绑定双基底，数据感知）──
  ...CHART_RENDERERS,
  // ── P1 图片 / 标本 / 金句型（按 layoutId 绑定双基底，数据感知）──
  ...MEDIA_RENDERERS,
};

/** 将全部 theme09 渲染器注册到导出管线的按 layoutId 索引注册表。 */
export function registerTheme09Renderers(register: (layoutId: string, fn: T09RenderFn) => void): void {
  for (const [id, fn] of Object.entries(RENDERERS)) {
    register(id, fn);
  }
}
