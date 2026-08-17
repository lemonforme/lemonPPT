// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// 回归测试：确保每个 theme03 版式都已注册专属 PPTX 渲染器。
// 防止「版式落到 Unknown layout 红字占位」的问题复发（此前 409 个内联渲染器已拆到专属文件）。

import { describe, it, expect } from 'vitest';
// 确保 export-pptx.ts（真实入口）先完成求值，避免 themeNN-pptx ↔ export-pptx 循环依赖在测试入口顺序下触发 TDZ。
import './export-pptx.js';
import { registerTheme03Renderers } from './theme03-pptx.js';

const EXPECTED_LAYOUTS = [
  'theme03_cover_v1',
  'theme03_chapter_v1',
  'theme03_content_v1',
  'theme03_metric_big',
  'theme03_ranking_v1',
  'theme03_quote_v1',
  'theme03_case_v1',
  'theme03_closing_v1',
  'theme03_table_of_contents_v1',
  'theme03_metrics_v1',
  'theme03_feature_v1',
  'theme03_image_v1',
  'theme03_chart_donut',
  'theme03_chart_bar',
  'theme03_chart_v1',
  'theme03_trend_v1',
  'theme03_chart_radar',
  'theme03_chart_funnel',
  'theme03_chart_gauge',
  'theme03_chart_heatmap',
  'theme03_chart_treemap',
  'theme03_chart_wordcloud',
  'theme03_chart_bar3d',
  'theme03_chart_graph',
  'theme03_chart_sankey',
  'theme03_chart_sunburst',
  'theme03_team_v1',
  'theme03_partners_v1',
  'theme03_pricing_v1',
  'theme03_comparison_v1',
  'theme03_faq_v1',
  'theme03_gallery_v1',
  'theme03_number_showcase_v1',
  'theme03_bento_v1',
  'theme03_quadrant_v1',
  'theme03_table_v1',
  'theme03_testimonial_v1',
  'theme03_tags_v1',
  'theme03_progress_v1',
  'theme03_process_v1',
  'theme03_timeline_v1',
  'theme03_roadmap_v1',
  'theme03_swot_v1',
  'theme03_metric_v1',
  'theme03_metric_v2',
  'theme03_metric_v3',
  'theme03_metric_triptych',
  'theme03_scorecard_v1',
  'theme03_appendix_v1',
  'theme03_case_study',
  'theme03_outlook_v1',
  'theme03_region_v1',
  'theme03_risk_v1',
  'theme03_spotlight_grid',
  'theme03_conclusion_v1',
  'theme03_diptych_contrast',
  'theme03_filmstrip_v1',
  'theme03_gantt_v1',
  'theme03_pest_v1',
  'theme03_stats_v1',
  'theme03_table_data',
  'theme03_chapter_v2',
  'theme03_chapter_v3',
  'theme03_closing_v2',
  'theme03_comparison_v2',
  'theme03_comparison_v3',
  'theme03_content_v2',
  'theme03_content_v3',
  'theme03_content_v4',
  'theme03_cover_v2',
  'theme03_cover_v3',
  'theme03_cover_v4',
  'theme03_feature_v2',
  'theme03_quote_v2',
  'theme03_quote_v3',
  'theme03_table_of_contents_v2',
  'theme03_team_v2',
];

describe('theme03 PPTX 渲染器注册', () => {
  it('应注册全部 77 个 theme03 版式，且渲染函数均非空', () => {
    const registered = new Map<string, unknown>();
    registerTheme03Renderers((id, fn) => registered.set(id, fn));
    for (const id of EXPECTED_LAYOUTS) {
      expect(registered.has(id), `缺少渲染器: ${id}`).toBe(true);
      expect(typeof registered.get(id), `${id} 渲染函数为空`).toBe('function');
    }
    expect(registered.size).toBe(EXPECTED_LAYOUTS.length);
  });

  it('注册表只应含 theme03_ 前缀的版式', () => {
    const registered = new Map<string, unknown>();
    registerTheme03Renderers((id, fn) => registered.set(id, fn));
    for (const id of registered.keys()) {
      expect(id.startsWith('theme03_'), `非预期前缀: ${id}`).toBe(true);
    }
  });
});
