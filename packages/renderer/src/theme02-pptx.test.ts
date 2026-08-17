// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// 回归测试：确保每个 theme02 版式都已注册专属 PPTX 渲染器。
// 防止「版式落到 Unknown layout 红字占位」的问题复发（此前 409 个内联渲染器已拆到专属文件）。

import { describe, it, expect } from 'vitest';
// 确保 export-pptx.ts（真实入口）先完成求值，避免 themeNN-pptx ↔ export-pptx 循环依赖在测试入口顺序下触发 TDZ。
import './export-pptx.js';
import { registerTheme02Renderers } from './theme02-pptx.js';

const EXPECTED_LAYOUTS = [
  'theme02_cover_v1',
  'theme02_cover_v2',
  'theme02_chapter_v1',
  'theme02_chapter_v2',
  'theme02_metric_big',
  'theme02_number_showcase_v1',
  'theme02_chart_v1',
  'theme02_chart_funnel',
  'theme02_chart_donut',
  'theme02_chart_heatmap',
  'theme02_chart_radar',
  'theme02_chart_gauge',
  'theme02_content_v1',
  'theme02_delta_v1',
  'theme02_closing_v1',
  'theme02_table_of_contents_v1',
  'theme02_metrics_v1',
  'theme02_team_v1',
  'theme02_timeline_v1',
  'theme02_comparison_v1',
  'theme02_image_v1',
  'theme02_quote_v1',
  'theme02_quote_v2',
  'theme02_bento_v1',
  'theme02_feature_v1',
  'theme02_gallery_v1',
  'theme02_pricing_v1',
  'theme02_process_v1',
  'theme02_progress_v1',
  'theme02_roadmap_v1',
  'theme02_swot_v1',
  'theme02_faq_v1',
  'theme02_filmstrip_v1',
  'theme02_partners_v1',
  'theme02_pest_v1',
  'theme02_stats_v1',
  'theme02_table_v1',
  'theme02_tags_v1',
  'theme02_testimonial_v1',
  'theme02_feature_v2',
  'theme02_checklist_v1',
  'theme02_steps_v1',
  'theme02_card_grid_v1',
  'theme02_highlight_v1',
  'theme02_comparison_v2',
  'theme02_matrix_v1',
  'theme02_stat_grid_v1',
  'theme02_cover_v3',
  'theme02_closing_v2',
  'theme02_chart_bar_v1',
  'theme02_chart_line_v1',
  'theme02_chart_area_v1',
  'theme02_chart_stack_v1',
  'theme02_kpi_strip_v1',
  'theme02_big_stat_v1',
  'theme02_cycle_v1',
  'theme02_swimlane_v1',
  'theme02_pyramid_v1',
  'theme02_org_chart_v1',
  'theme02_flow_v1',
  'theme02_table_v2',
  'theme02_image_split_v1',
  'theme02_image_grid_v2',
  'theme02_spotlight_v1',
  'theme02_chapter_v3',
  'theme02_section_divider_v1',
  'theme02_logo_wall_v1',
];

describe('theme02 PPTX 渲染器注册', () => {
  it('应注册全部 67 个 theme02 版式，且渲染函数均非空', () => {
    const registered = new Map<string, unknown>();
    registerTheme02Renderers((id, fn) => registered.set(id, fn));
    for (const id of EXPECTED_LAYOUTS) {
      expect(registered.has(id), `缺少渲染器: ${id}`).toBe(true);
      expect(typeof registered.get(id), `${id} 渲染函数为空`).toBe('function');
    }
    expect(registered.size).toBe(EXPECTED_LAYOUTS.length);
  });

  it('注册表只应含 theme02_ 前缀的版式', () => {
    const registered = new Map<string, unknown>();
    registerTheme02Renderers((id, fn) => registered.set(id, fn));
    for (const id of registered.keys()) {
      expect(id.startsWith('theme02_'), `非预期前缀: ${id}`).toBe(true);
    }
  });
});
