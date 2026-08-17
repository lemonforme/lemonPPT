// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// 回归测试：确保每个 theme07 版式都已注册专属 PPTX 渲染器。
// 防止「版式落到 Unknown layout 红字占位」的问题复发（此前 409 个内联渲染器已拆到专属文件）。

import { describe, it, expect } from 'vitest';
// 确保 export-pptx.ts（真实入口）先完成求值，避免 themeNN-pptx ↔ export-pptx 循环依赖在测试入口顺序下触发 TDZ。
import './export-pptx.js';
import { registerTheme07Renderers } from './theme07-pptx.js';

const EXPECTED_LAYOUTS = [
  'theme07_cover_v1',
  'theme07_table_of_contents_v1',
  'theme07_chapter_v1',
  'theme07_chapter_capital_v1',
  'theme07_chapter_risk_v1',
  'theme07_chapter_appendix_v1',
  'theme07_content_v1',
  'theme07_summary_v1',
  'theme07_ranking_v1',
  'theme07_case_v1',
  'theme07_case_grid_v1',
  'theme07_sources_v1',
  'theme07_method_v1',
  'theme07_monthly_v1',
  'theme07_waterfall_v1',
  'theme07_matrix_v1',
  'theme07_risk_v1',
  'theme07_cover_lean_v1',
  'theme07_cover_supply_chain_v1',
  'theme07_cover_retail_trend_v1',
  'theme07_cover_supply_strategy_v1',
  'theme07_peak_v1',
  'theme07_cooldown_v1',
  'theme07_peak_trough_v1',
  'theme07_deal_size_v1',
  'theme07_avg_ticket_v1',
  'theme07_outlook_v1',
  'theme07_repricing_v1',
  'theme07_deal_map_v1',
  'theme07_cold_start_v1',
  'theme07_accelerate_v1',
  'theme07_investor_v1',
  'theme07_active_capital_v1',
  'theme07_concentration_v1',
  'theme07_syndicate_v1',
  'theme07_company_openai_v1',
  'theme07_company_figure_v1',
  'theme07_company_ssi_v1',
  'theme07_geo_center_v1',
  'theme07_region_cluster_v1',
  'theme07_resource_triad_v1',
  'theme07_quote_v1',
  'theme07_closing_v1',
  'theme07_closing_quote_v1',
  'theme07_forward_v1',
  'theme07_about_lab_v1',
  'theme07_stat_hero_v1',
  'theme07_stat_row_v1',
  'theme07_stat_chart_v1',
  'theme07_stat_compare_v1',
];

describe('theme07 PPTX 渲染器注册', () => {
  it('应注册全部 theme07 版式，且渲染函数均非空', () => {
    const registered = new Map<string, unknown>();
    registerTheme07Renderers((id, fn) => registered.set(id, fn));
    for (const id of EXPECTED_LAYOUTS) {
      expect(registered.has(id), `缺少渲染器: ${id}`).toBe(true);
      expect(typeof registered.get(id), `${id} 渲染函数为空`).toBe('function');
    }
    // 注册总数应不少于预期列表；主题迭代时会新增版式，列表只保留核心回归检查点。
    expect(registered.size).toBeGreaterThanOrEqual(EXPECTED_LAYOUTS.length);
  });

  it('注册表只应含 theme07_ 前缀的版式', () => {
    const registered = new Map<string, unknown>();
    registerTheme07Renderers((id, fn) => registered.set(id, fn));
    for (const id of registered.keys()) {
      expect(id.startsWith('theme07_'), `非预期前缀: ${id}`).toBe(true);
    }
  });
});
