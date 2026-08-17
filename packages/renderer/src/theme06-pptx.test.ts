// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// 回归测试：确保每个 theme06 版式都已注册专属 PPTX 渲染器。
// 防止「版式落到 Unknown layout 红字占位」的问题复发（此前 409 个内联渲染器已拆到专属文件）。

import { describe, it, expect } from 'vitest';
// 确保 export-pptx.ts（真实入口）先完成求值，避免 themeNN-pptx ↔ export-pptx 循环依赖在测试入口顺序下触发 TDZ。
import './export-pptx.js';
import { registerTheme06Renderers } from './theme06-pptx.js';

const EXPECTED_LAYOUTS = [
  'theme06_cover_v1',
  'theme06_chapter_v1',
  'theme06_content_v1',
  'theme06_content_numbered_v1',
  'theme06_vertical_bar_v1',
  'theme06_metric_hero_v1',
  'theme06_chart_v1',
  'theme06_quote_v1',
  'theme06_metric_grid_v1',
  'theme06_rank_v1',
  'theme06_matrix_v1',
  'theme06_chart_radar_v1',
  'theme06_chart_waterfall_v1',
  'theme06_chart_peak_v1',
  'theme06_process_v1',
  'theme06_timeline_v1',
  'theme06_case_v1',
  'theme06_case_v2',
  'theme06_risk_v1',
  'theme06_risk_v2',
  'theme06_chart_graph_v1',
  'theme06_map_v1',
  'theme06_table_of_contents_v1',
  'theme06_summary_v1',
  'theme06_closing_v1',
  'theme06_sources_v1',
  'theme06_chart_heatmap_v1',
  'theme06_bento_v1',
  'theme06_comparison_v1',
  'theme06_sector_spotlight_v1',
  'theme06_tech_landscape_v1',
  'theme06_company_profile_v1',
  'theme06_chain_flow_v1',
  'theme06_quarter_table_v1',
  'theme06_metric_showcase_v1',
  'theme06_milestone_v1',
  'theme06_risk_matrix_v1',
  'theme06_sector_comparison_v1',
  'theme06_geo_distribution_v1',
  'theme06_geo_heatmap_v1',
  'theme06_ecosystem_graph_v1',
  'theme06_cover_product_v1',
  'theme06_cover_business_v1',
  'theme06_chapter_numbered_v1',
  'theme06_chapter_split_v1',
  'theme06_trend_v1',
  'theme06_cumulative_v1',
  'theme06_quadrant_v1',
  'theme06_outlook_v1',
  'theme06_recap_v1',
  'theme06_company_rounds_v1',
  'theme06_company_investors_v1',
  'theme06_company_comparison_v1',
  'theme06_geo_cities_v1',
  'theme06_agent_v1',
  'theme06_search_v1',
  'theme06_cover_manufacturing_v1',
  'theme06_cover_brand_v1',
  'theme06_method_v1',
  'theme06_quarter_q1_v1',
  'theme06_quarter_q2_v1',
  'theme06_quarter_q3_v1',
  'theme06_quarter_q4_v1',
  'theme06_big_number_v1',
  'theme06_chapter_focus_v1',
  'theme06_chapter_image_v1',
  'theme06_chapter_minimal_v1',
  'theme06_triad_v1',
  'theme06_deal_map_v1',
  'theme06_size_split_v1',
  'theme06_revenue_risk_v1',
  'theme06_region_risk_v1',
  'theme06_open_risk_v1',
  'theme06_legal_v1',
  'theme06_capital_flow_v1',
  'theme06_avg_ticket_v1',
  'theme06_industry_vertical_v1',
  'theme06_industry_infrastructure_v1',
  'theme06_company_spotlight_v1',
  'theme06_ipo_watch_v1',
  'theme06_statement_v1',
  'theme06_industry_finance_v1',
  'theme06_industry_growth_v1',
  'theme06_industry_safety_v1',
  'theme06_deal_structure_v1',
  'theme06_alliance_v1',
  'theme06_compute_v1',
  'theme06_megadeals_v1',
];

describe('theme06 PPTX 渲染器注册', () => {
  it('应注册全部 88 个 theme06 版式，且渲染函数均非空', () => {
    const registered = new Map<string, unknown>();
    registerTheme06Renderers((id, fn) => registered.set(id, fn));
    for (const id of EXPECTED_LAYOUTS) {
      expect(registered.has(id), `缺少渲染器: ${id}`).toBe(true);
      expect(typeof registered.get(id), `${id} 渲染函数为空`).toBe('function');
    }
    expect(registered.size).toBe(EXPECTED_LAYOUTS.length);
  });

  it('注册表只应含 theme06_ 前缀的版式', () => {
    const registered = new Map<string, unknown>();
    registerTheme06Renderers((id, fn) => registered.set(id, fn));
    for (const id of registered.keys()) {
      expect(id.startsWith('theme06_'), `非预期前缀: ${id}`).toBe(true);
    }
  });
});
