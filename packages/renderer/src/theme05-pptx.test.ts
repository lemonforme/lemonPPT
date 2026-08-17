// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// 回归测试：确保每个 theme05 版式都已注册专属 PPTX 渲染器。
// 防止「版式落到 Unknown layout 红字占位」的问题复发（此前 409 个内联渲染器已拆到专属文件）。

import { describe, it, expect } from 'vitest';
// 确保 export-pptx.ts（真实入口）先完成求值，避免 themeNN-pptx ↔ export-pptx 循环依赖在测试入口顺序下触发 TDZ。
import './export-pptx.js';
import { registerTheme05Renderers } from './theme05-pptx.js';

const EXPECTED_LAYOUTS = [
  'theme05_cover_v1',
  'theme05_table_of_contents_v1',
  'theme05_chapter_v1',
  'theme05_content_v1',
  'theme05_metric_v1',
  'theme05_chart_v1',
  'theme05_bubble_v1',
  'theme05_map_v1',
  'theme05_rank_v1',
  'theme05_heatmap_v1',
  'theme05_waterfall_v1',
  'theme05_quote_v1',
  'theme05_image_v1',
  'theme05_versus_v1',
  'theme05_process_v1',
  'theme05_timeline_v1',
  'theme05_matrix_v1',
  'theme05_quadrant_v1',
  'theme05_risk_v1',
  'theme05_closing_v1',
  'theme05_cover_ex_v1',
  'theme05_cover_ex_v2',
  'theme05_cover_hero_v1',
  'theme05_chapter_big_v1',
  'theme05_chapter_split_v1',
  'theme05_chapter_numbered_v1',
  'theme05_chapter_image_v1',
  'theme05_metric_hero_v1',
  'theme05_metric_capacity_v1',
  'theme05_metric_delta_v1',
  'theme05_chart_share_v1',
  'theme05_chart_stacked_v1',
  'theme05_chart_curve_v1',
  'theme05_chart_peak_v1',
  'theme05_chart_peaktrough_v1',
  'theme05_chart_cumulative_v1',
  'theme05_table_of_contents_v2',
  'theme05_process_v2',
  'theme05_comparison_v1',
  'theme05_chart_funnel_v1',
  'theme05_quote_v2',
  'theme05_chart_gauge_v1',
  'theme05_bento_v1',
  'theme05_case_v1',
  'theme05_donut_v1',
  'theme05_editorial_v1',
  'theme05_gallery_v1',
  'theme05_profile_v1',
  'theme05_radar_v1',
  'theme05_roadmap_v1',
  'theme05_scorecards_v1',
  'theme05_treemap_v1',
];

describe('theme05 PPTX 渲染器注册', () => {
  it('应注册全部 52 个 theme05 版式，且渲染函数均非空', () => {
    const registered = new Map<string, unknown>();
    registerTheme05Renderers((id, fn) => registered.set(id, fn));
    for (const id of EXPECTED_LAYOUTS) {
      expect(registered.has(id), `缺少渲染器: ${id}`).toBe(true);
      expect(typeof registered.get(id), `${id} 渲染函数为空`).toBe('function');
    }
    expect(registered.size).toBe(EXPECTED_LAYOUTS.length);
  });

  it('注册表只应含 theme05_ 前缀的版式', () => {
    const registered = new Map<string, unknown>();
    registerTheme05Renderers((id, fn) => registered.set(id, fn));
    for (const id of registered.keys()) {
      expect(id.startsWith('theme05_'), `非预期前缀: ${id}`).toBe(true);
    }
  });
});
