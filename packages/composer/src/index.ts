// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal, LayoutMeta, RawDeckGoal, Slide, SlideRole } from '@lemonppt/core';
import { getLayout, listLayoutsByRoleAndTheme } from '@lemonppt/templates';
import { normalizeDeck } from '@lemonppt/view-model';

export interface ComposeSlideInput {
  /** 页面角色；提供 role 时 composer 会自动挑选版式 */
  role: SlideRole;
  /** 具体版式 ID；优先级高于自动选择 */
  layout?: string;
  /** 页面属性 */
  props?: Record<string, unknown>;
}

export interface ComposeInput {
  title: string;
  goal: string;
  audience: string;
  owner?: string;
  theme: string;
  language?: 'zh' | 'en';
  pageCount?: number;
  randomSeed?: string;
  slides: ComposeSlideInput[];
}

/**
 * 角色到候选版式的映射。
 * 包含 theme01 与 theme02 的候选版式；selectLayoutForRole 会按当前主题过滤。
 */
const ROLE_LAYOUT_CANDIDATES: Record<SlideRole, string[]> = {
  cover: ['theme01_cover_v1', 'theme01_cover_v2', 'theme01_cover_v3', 'theme01_cover_v4', 'theme02_cover_v1', 'theme04_cover_v1', 'theme04_cover_ghost_v1', 'theme04_cover_bento_v1', 'theme04_cover_magazine_v1', 'theme04_cover_hero_v1'],
  tableOfContents: ['theme01_table_of_contents_v1', 'theme01_table_of_contents_v2', 'theme02_table_of_contents_v1', 'theme04_table_of_contents_v1'],
  metric: ['theme01_metric_v1', 'theme01_metric_v2', 'theme01_metric_v3', 'theme01_metric_big', 'theme02_metric_big', 'theme02_progress_v1', 'theme02_delta_v1', 'theme04_metric_v1', 'theme04_metric_big', 'theme04_gauges_v1', 'theme04_delta_v1', 'theme04_versus_v1', 'theme04_scorecards_v1'],
  chart: ['theme01_chart_v1', 'theme02_chart_v1', 'theme02_chart_funnel', 'theme02_chart_donut', 'theme02_chart_heatmap', 'theme02_chart_radar', 'theme02_chart_gauge', 'theme04_chart_v1', 'theme04_chart_donut', 'theme04_radar_v1', 'theme04_heatmap_v1', 'theme04_treemap_v1', 'theme04_groupbars_v1', 'theme04_scatter_v1', 'theme04_slope_v1', 'theme04_waterfall_v1', 'theme04_region_v1', 'theme04_valuechart_v1', 'theme04_dumbbell_v1', 'theme04_pyramid_v1', 'theme04_monthchart_v1', 'theme04_stacked_v1', 'theme04_spread_v1'],
  comparison: ['theme01_comparison_v1', 'theme01_comparison_v2', 'theme01_comparison_v3', 'theme02_comparison_v1'],
  pricing: ['theme01_pricing_v1', 'theme02_pricing_v1'],
  process: ['theme01_process_v1', 'theme02_process_v1', 'theme04_process_v1', 'theme04_layers_v1', 'theme04_riskchain_v1', 'theme04_metro_v1', 'theme04_chainflow_v1'],
  timeline: ['theme01_timeline_v1', 'theme02_timeline_v1'],
  roadmap: ['theme01_roadmap_v1', 'theme02_roadmap_v1', 'theme04_gantt_v1'],
  quote: ['theme01_quote_v1', 'theme01_quote_v2', 'theme01_quote_v3', 'theme02_quote_v1', 'theme04_quote_v1', 'theme04_voices_v1'],
  content: ['theme01_content_v1', 'theme01_content_v2', 'theme01_content_v3', 'theme01_content_v4', 'theme02_chapter_v1', 'theme02_content_v1', 'theme04_chapter_v1', 'theme04_content_v1', 'theme04_editorial_v1', 'theme04_chapter_split_v1', 'theme04_chapter_numbered_v1', 'theme04_trio_v1', 'theme04_matrix_v1', 'theme04_diptych_v1'],
  faq: ['theme01_faq_v1', 'theme02_faq_v1'],
  feature: ['theme01_feature_v1', 'theme02_feature_v1', 'theme04_feature_v1', 'theme04_cards_v1'],
  team: ['theme01_team_v1', 'theme01_team_v2', 'theme02_team_v1', 'theme04_team_v1'],
  partners: ['theme01_partners_v1', 'theme02_partners_v1'],
  image: ['theme01_image_v1', 'theme02_image_v1', 'theme04_image_v1', 'theme04_annotated_v1', 'theme04_imagestory_v1', 'theme04_showcase_v1'],
  gallery: ['theme01_gallery_v1', 'theme02_gallery_v1', 'theme02_filmstrip_v1', 'theme04_gallery_v1', 'theme04_triptych_v1', 'theme04_polaroid_v1', 'theme04_filmstrip_v1'],
  bento: ['theme01_bento_v1', 'theme02_bento_v1', 'theme04_bento_v1'],
  table: ['theme01_table_v1', 'theme02_table_v1', 'theme04_scoreboard_v1', 'theme04_table_v1', 'theme04_quartertable_v1', 'theme04_chaintable_v1', 'theme04_ledger_v1'],
  tags: ['theme01_tags_v1', 'theme02_tags_v1'],
  filmstrip: ['theme01_filmstrip_v1', 'theme02_filmstrip_v1'],
  swot: ['theme01_swot_v1', 'theme02_swot_v1'],
  testimonial: ['theme01_testimonial_v1', 'theme02_testimonial_v1'],
  pest: ['theme01_pest_v1', 'theme02_pest_v1'],
  stats: ['theme01_stats_v1', 'theme02_stats_v1', 'theme02_metrics_v1'],
  closing: ['theme01_closing_v2', 'theme02_closing_v1', 'theme04_closing_v1', 'theme04_verdict_v1'],
};

/**
 * 基于字符串种子生成伪随机数生成器（xorshift）。
 */
function createSeededRandom(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  }
  if (s === 0) s = 123456789;
  let x = s;
  let y = 362436069;
  let z = 521288629;
  let w = 88675123;
  return () => {
    const t = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    w = (w ^ (w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;
    return w / 0xffffffff;
  };
}

/**
 * 为指定角色挑选一个版式。
 * 从候选版式中筛选出真实注册的版式，然后随机/按 seed 选择。
 * 无可用候选时返回兜底版式。
 */
export function selectLayoutForRole(role: SlideRole, seed?: string, index = 0, theme = 'theme01'): string {
  const candidates = ROLE_LAYOUT_CANDIDATES[role] ?? [];
  const availableIds = listLayoutsByRoleAndTheme(role, theme).map((m: LayoutMeta) => m.id);
  const validCandidates = candidates.filter((id) => availableIds.includes(id));

  const pool = validCandidates.length > 0 ? validCandidates : availableIds.length > 0 ? availableIds : ['theme01_content_v1'];

  const random = seed ? createSeededRandom(`${seed}-${index}`) : Math.random;
  const idx = Math.floor(random() * pool.length);
  return pool[idx]!;
}

/**
 * 将角色/版式输入编排成完整的 DeckGoal，并通过 view-model 规范化。
 */
export function composeDeck(input: ComposeInput): DeckGoal {
  const slides: Slide[] = input.slides.map((s, index) => {
    const layout = s.layout ?? selectLayoutForRole(s.role, input.randomSeed, index, input.theme);
    return {
      role: s.role,
      layout,
      props: s.props ?? {},
    };
  });

  const draft: DeckGoal = {
    title: input.title,
    goal: input.goal,
    audience: input.audience,
    owner: input.owner,
    theme: input.theme,
    language: input.language ?? 'zh',
    pageCount: input.pageCount ?? slides.length,
    randomSeed: input.randomSeed ?? `lemon-${Date.now()}`,
    slides,
  };

  return normalizeDeck(draft);
}

/**
 * 将 Agent 原始输出（只含 role，可省略 layout）编排成完整 DeckGoal。
 */
export function composeDeckFromRaw(raw: RawDeckGoal): DeckGoal {
  const draft = composeDeck({
    title: raw.title,
    goal: raw.goal,
    audience: raw.audience,
    owner: raw.owner,
    theme: raw.theme,
    language: raw.language,
    pageCount: raw.pageCount,
    randomSeed: raw.randomSeed,
    slides: raw.slides.map((s) => ({ role: s.role, layout: s.layout, props: s.props })),
  });

  // 若 slide 指向不存在的版式，则按角色重新选择当前主题版式
  const slides = draft.slides.map((slide) => {
    if (getLayout(slide.layout)) {
      return slide;
    }
    const replacement = selectLayoutForRole(slide.role, draft.randomSeed, slide.props._slideIdx as number | undefined, draft.theme);
    return { ...slide, layout: replacement };
  });

  return normalizeDeck({ ...draft, slides });
}

/**
 * 对已有的 DeckGoal 重新执行规范化（页码注入、文本截断等）。
 */
export function recomposeDeck(goal: DeckGoal): DeckGoal {
  return normalizeDeck(goal);
}
