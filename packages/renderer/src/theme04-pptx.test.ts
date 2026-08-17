// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// 回归测试：确保每个 theme04 版式都已注册专属 PPTX 渲染器。
// 防止「版式落到 Unknown layout 红字占位」的问题复发（此前 409 个内联渲染器已拆到专属文件）。

import { describe, it, expect } from 'vitest';
// 确保 export-pptx.ts（真实入口）先完成求值，避免 themeNN-pptx ↔ export-pptx 循环依赖在测试入口顺序下触发 TDZ。
import './export-pptx.js';
import { registerTheme04Renderers } from './theme04-pptx.js';

const EXPECTED_LAYOUTS = [
  'theme04_cover_v1',
  'theme04_chapter_v1',
  'theme04_content_v1',
  'theme04_metric_v1',
  'theme04_chart_v1',
  'theme04_quote_v1',
  'theme04_image_v1',
  'theme04_closing_v1',
  'theme04_table_of_contents_v1',
  'theme04_feature_v1',
  'theme04_bento_v1',
  'theme04_team_v1',
  'theme04_chart_donut',
  'theme04_metric_big',
  'theme04_process_v1',
  'theme04_gallery_v1',
  'theme04_stats_v1',
  'theme04_comparison_v1',
  'theme04_table_v1',
  'theme04_timeline_v1',
  'theme04_roadmap_v1',
  'theme04_ranking_v1',
  'theme04_case_v1',
  'theme04_quadrant_v1',
  'theme04_agenda_v1',
  'theme04_cover_index_v1',
  'theme04_chapter_v2',
  'theme04_image_quote_v1',
  'theme04_editorial_v1',
  'theme04_triptych_v1',
  'theme04_gantt_v1',
  'theme04_radar_v1',
  'theme04_heatmap_v1',
  'theme04_cover_ghost_v1',
  'theme04_cards_v1',
  'theme04_gauges_v1',
  'theme04_cover_bento_v1',
  'theme04_cover_magazine_v1',
  'theme04_chapter_split_v1',
  'theme04_chapter_numbered_v1',
  'theme04_delta_v1',
  'theme04_versus_v1',
  'theme04_trio_v1',
  'theme04_polaroid_v1',
  'theme04_verdict_v1',
  'theme04_treemap_v1',
  'theme04_scoreboard_v1',
  'theme04_scorecards_v1',
  'theme04_matrix_v1',
  'theme04_layers_v1',
  'theme04_groupbars_v1',
  'theme04_scatter_v1',
  'theme04_slope_v1',
  'theme04_waterfall_v1',
  'theme04_region_v1',
  'theme04_valuechart_v1',
  'theme04_filmstrip_v1',
  'theme04_diptych_v1',
  'theme04_voices_v1',
  'theme04_annotated_v1',
  'theme04_imagestory_v1',
  'theme04_dumbbell_v1',
  'theme04_pyramid_v1',
  'theme04_riskchain_v1',
  'theme04_metro_v1',
  'theme04_showcase_v1',
  'theme04_calendar_v1',
  'theme04_chainflow_v1',
  'theme04_chaintable_v1',
  'theme04_cover_hero_v1',
  'theme04_ledger_v1',
  'theme04_monthchart_v1',
  'theme04_quartertable_v1',
  'theme04_spread_v1',
  'theme04_stacked_v1',
];

describe('theme04 PPTX 渲染器注册', () => {
  it('应注册全部 75 个 theme04 版式，且渲染函数均非空', () => {
    const registered = new Map<string, unknown>();
    registerTheme04Renderers((id, fn) => registered.set(id, fn));
    for (const id of EXPECTED_LAYOUTS) {
      expect(registered.has(id), `缺少渲染器: ${id}`).toBe(true);
      expect(typeof registered.get(id), `${id} 渲染函数为空`).toBe('function');
    }
    expect(registered.size).toBe(EXPECTED_LAYOUTS.length);
  });

  it('注册表只应含 theme04_ 前缀的版式', () => {
    const registered = new Map<string, unknown>();
    registerTheme04Renderers((id, fn) => registered.set(id, fn));
    for (const id of registered.keys()) {
      expect(id.startsWith('theme04_'), `非预期前缀: ${id}`).toBe(true);
    }
  });
});
