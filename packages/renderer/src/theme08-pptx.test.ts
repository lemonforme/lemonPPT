// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// 回归测试：确保每个 theme08 版式都已注册专属 PPTX 渲染器。
// 防止此前「37/39 版式落到 Unknown layout 红字占位」的问题复发。

import { describe, it, expect } from 'vitest';
import { registerTheme08Renderers } from './theme08-pptx.js';

const EXPECTED_LAYOUTS = [
  'theme08_cover_v1',
  'theme08_chapter_v1',
  'theme08_content_v1',
  'theme08_contents_v1',
  'theme08_metrics_v1',
  'theme08_metric_big_v1',
  'theme08_feature_v1',
  'theme08_overview_v1',
  'theme08_strategy_v1',
  'theme08_process_v1',
  'theme08_timeline_v1',
  'theme08_roadmap_v1',
  'theme08_workflow_v1',
  'theme08_team_v1',
  'theme08_partners_v1',
  'theme08_gallery_v1',
  'theme08_collage_v1',
  'theme08_bubble_v1',
  'theme08_quote_v1',
  'theme08_closing_v1',
  'theme08_hero_split_v1',
  'theme08_ecosystem_v1',
  'theme08_case_v1',
  'theme08_funding_v1',
  'theme08_matrix_v1',
  'theme08_quadrant_v1',
  'theme08_scorecard_v1',
  'theme08_region_v1',
  'theme08_range_v1',
  'theme08_heatmap_v1',
  'theme08_waterfall_v1',
  'theme08_chart_bar_v1',
  'theme08_chart_donut_v1',
  'theme08_gauge_v1',
  'theme08_radar_v1',
  'theme08_ranking_v1',
  'theme08_compare_v1',
  'theme08_table_v1',
  'theme08_chain_v1',
  // ---- v2 变体版式（对齐 84 组件页）----
  'theme08_cover_v2',
  'theme08_cover_v3',
  'theme08_cover_v4',
  'theme08_cover_v5',
  'theme08_chapter_v2',
  'theme08_chapter_v3',
  'theme08_chapter_v4',
  'theme08_quote_statement_v1',
  'theme08_quote_resources_v1',
  'theme08_quote_verdict_v1',
  'theme08_quote_twofield_v1',
  'theme08_quote_manifesto_v1',
  'theme08_case_card_v1',
  'theme08_case_card_v2',
  'theme08_case_table_v1',
  'theme08_case_study_v1',
  'theme08_case_grid_v1',
  'theme08_case_list_v1',
  'theme08_region_anchor_v1',
  'theme08_region_card_ny_v1',
  'theme08_region_dotmap_v1',
  'theme08_segment_v1',
  'theme08_pipeline_v1',
  'theme08_architecture_v1',
  'theme08_supply_v1',
  'theme08_compute_v1',
  'theme08_trend_v1',
  'theme08_cross_v1',
  'theme08_peak_v1',
  'theme08_pullback_v1',
  'theme08_peak_trough_v1',
  'theme08_capital_curve_v1',
  'theme08_revenue_v1',
  'theme08_regulation_v1',
  'theme08_squeeze_v1',
  'theme08_early_stage_v1',
  'theme08_investor_mix_v1',
  'theme08_resource_map_v1',
  'theme08_closed_loop_v1',
  'theme08_triptych_v1',
  'theme08_scene_split_v1',
  'theme08_budget_card_v1',
  'theme08_mainlines_v1',
  'theme08_migration_v1',
  'theme08_size_split_v1',
];

describe('theme08 PPTX 渲染器注册', () => {
  it('应注册全部 84 个 theme08 版式，且渲染函数均非空', () => {
    const registered = new Map<string, unknown>();
    registerTheme08Renderers((id, fn) => registered.set(id, fn));
    for (const id of EXPECTED_LAYOUTS) {
      expect(registered.has(id), `缺少渲染器: ${id}`).toBe(true);
      expect(typeof registered.get(id), `${id} 渲染函数为空`).toBe('function');
    }
    expect(registered.size).toBe(EXPECTED_LAYOUTS.length);
  });

  it('注册表只应含 theme08_ 前缀的版式', () => {
    const registered = new Map<string, unknown>();
    registerTheme08Renderers((id, fn) => registered.set(id, fn));
    for (const id of registered.keys()) {
      expect(id.startsWith('theme08_'), `非预期前缀: ${id}`).toBe(true);
    }
  });
});
