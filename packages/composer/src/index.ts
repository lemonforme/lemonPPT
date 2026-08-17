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
 * 覆盖 theme01~theme10，selectLayoutForRole 会按当前主题过滤。
 * 每个角色内保持去重。
 */
const ROLE_LAYOUT_CANDIDATES: Record<SlideRole, string[]> = {
  cover: ['theme01_cover_v1', 'theme01_cover_v2', 'theme01_cover_v3', 'theme01_cover_v4', 'theme02_cover_v1', 'theme04_cover_v1', 'theme04_cover_ghost_v1', 'theme04_cover_bento_v1', 'theme04_cover_magazine_v1', 'theme04_cover_hero_v1', 'theme05_cover_v1', 'theme05_cover_ex_v1', 'theme05_cover_ex_v2', 'theme05_cover_hero_v1', 'theme06_cover_v1', 'theme06_cover_product_v1', 'theme06_cover_business_v1', 'theme06_cover_manufacturing_v1', 'theme06_cover_brand_v1', 'theme07_cover_v1', 'theme07_cover_lean_v1', 'theme07_cover_supply_chain_v1', 'theme07_cover_retail_trend_v1', 'theme07_cover_supply_strategy_v1', 'theme08_cover_v1', 'theme08_cover_v2', 'theme08_cover_v3', 'theme08_cover_v4', 'theme08_cover_v5', 'theme09_cover_masthead_v1', 'theme09_cover_bleed_v1', 'theme09_cover_dossier_v1', 'theme09_cover_colorbar_v1', 'theme09_cover_aperture_v1', 'theme09_cover_colophon_v1', 'theme09_cover_photo_v1', 'theme10_cover_dusk_v1', 'theme10_cover_field_v1', 'theme10_cover_atmos_v1', 'theme10_cover_horizon_v1', 'theme10_cover_standard_v1', 'theme10_cover_dawn_v1'],
  tableOfContents: ['theme01_table_of_contents_v1', 'theme01_table_of_contents_v2', 'theme02_table_of_contents_v1', 'theme04_table_of_contents_v1', 'theme05_table_of_contents_v1', 'theme05_table_of_contents_v2', 'theme06_table_of_contents_v1', 'theme07_table_of_contents_v1', 'theme08_contents_v1', 'theme09_contents_v1'],
  metric: ['theme01_metric_v1', 'theme01_metric_v2', 'theme01_metric_v3', 'theme01_metric_big', 'theme02_metric_big', 'theme02_progress_v1', 'theme02_delta_v1', 'theme04_metric_v1', 'theme04_metric_big', 'theme04_gauges_v1', 'theme04_delta_v1', 'theme04_versus_v1', 'theme04_scorecards_v1', 'theme05_metric_v1', 'theme05_metric_hero_v1', 'theme05_metric_delta_v1', 'theme05_metric_capacity_v1', 'theme05_scorecards_v1', 'theme06_metric_hero_v1', 'theme06_metric_grid_v1', 'theme06_metric_showcase_v1', 'theme06_big_number_v1', 'theme07_cold_start_v1', 'theme07_accelerate_v1', 'theme08_gauge_v1', 'theme08_metric_big_v1', 'theme08_metrics_v1', 'theme08_ranking_v1', 'theme08_scorecard_v1', 'theme08_early_stage_v1', 'theme09_gauge_v1'],
  chart: ['theme01_chart_v1', 'theme02_chart_v1', 'theme02_chart_funnel', 'theme02_chart_donut', 'theme02_chart_heatmap', 'theme02_chart_radar', 'theme02_chart_gauge', 'theme04_chart_v1', 'theme04_chart_donut', 'theme04_radar_v1', 'theme04_heatmap_v1', 'theme04_treemap_v1', 'theme04_groupbars_v1', 'theme04_scatter_v1', 'theme04_slope_v1', 'theme04_waterfall_v1', 'theme04_region_v1', 'theme04_valuechart_v1', 'theme04_dumbbell_v1', 'theme04_pyramid_v1', 'theme04_monthchart_v1', 'theme04_stacked_v1', 'theme04_spread_v1', 'theme05_chart_v1', 'theme05_bubble_v1', 'theme05_map_v1', 'theme05_heatmap_v1', 'theme05_waterfall_v1', 'theme05_chart_share_v1', 'theme05_chart_stacked_v1', 'theme05_chart_curve_v1', 'theme05_chart_peak_v1', 'theme05_chart_peaktrough_v1', 'theme05_chart_cumulative_v1', 'theme05_chart_funnel_v1', 'theme05_chart_gauge_v1', 'theme05_donut_v1', 'theme05_radar_v1', 'theme05_treemap_v1', 'theme06_chart_v1', 'theme06_rank_v1', 'theme06_chart_radar_v1', 'theme06_chart_waterfall_v1', 'theme06_chart_peak_v1', 'theme06_chart_graph_v1', 'theme06_map_v1', 'theme06_chart_heatmap_v1', 'theme06_geo_distribution_v1', 'theme06_geo_heatmap_v1', 'theme06_ecosystem_graph_v1', 'theme06_trend_v1', 'theme06_cumulative_v1', 'theme06_agent_v1', 'theme06_quarter_q1_v1', 'theme06_quarter_q2_v1', 'theme06_quarter_q3_v1', 'theme06_quarter_q4_v1', 'theme06_deal_map_v1', 'theme06_size_split_v1', 'theme06_capital_flow_v1', 'theme06_region_risk_v1', 'theme06_avg_ticket_v1', 'theme07_monthly_v1', 'theme07_peak_v1', 'theme07_cooldown_v1', 'theme07_peak_trough_v1', 'theme07_waterfall_v1', 'theme07_deal_size_v1', 'theme07_avg_ticket_v1', 'theme07_deal_map_v1', 'theme07_concentration_v1', 'theme08_chart_bar_v1', 'theme08_chart_donut_v1', 'theme08_trend_v1', 'theme08_cross_v1', 'theme08_peak_v1', 'theme08_pullback_v1', 'theme08_peak_trough_v1', 'theme08_capital_curve_v1', 'theme08_size_split_v1', 'theme09_dotmatrix_v1', 'theme09_market_overview_v1', 'theme09_streamgraph_v1', 'theme09_chord_v1', 'theme09_sunburst_v1', 'theme09_ribbon_v1', 'theme09_rounds_v1', 'theme09_ranking_v1', 'theme09_bump_v1', 'theme09_hero_number_v1', 'theme09_versus_v1', 'theme09_spiral_v1', 'theme09_funnel_v1', 'theme09_stat_grid_v1', 'theme09_arc_v1', 'theme09_network_v1', 'theme09_area_v1', 'theme09_mega_number_v1', 'theme09_radar_v1', 'theme09_radialbar_v1', 'theme09_honeycomb_v1', 'theme09_tornado_v1', 'theme09_matrix_v1', 'theme09_quadrant_v1', 'theme09_bubble_v1', 'theme09_marimekko_v1', 'theme09_meter_v1', 'theme09_parallel_v1', 'theme09_grade_v1', 'theme09_slope_v1', 'theme09_dumbbell_v1', 'theme09_crosstab_v1', 'theme09_tier_v1', 'theme09_ledger_v1', 'theme09_alloc_v1', 'theme09_venn_v1', 'theme09_treemap_v1', 'theme09_icicle_v1', 'theme09_waterfall_v1', 'theme09_heatmap_v1', 'theme09_flow_v1', 'theme09_trend_v1', 'theme09_histogram_v1', 'theme09_forecast_fan_v1', 'theme09_stacked_v1', 'theme09_score_v1', 'theme10_bar_v1', 'theme10_hbar_v1', 'theme10_line_v1', 'theme10_area_v1', 'theme10_grouped_v1', 'theme10_stack_v1', 'theme10_donut_v1', 'theme10_pie_v1', 'theme10_waterfall_v1', 'theme10_scatter_v1', 'theme10_bubble_v1', 'theme10_radar_v1', 'theme10_radial_v1', 'theme10_heat_v1', 'theme10_trend_v1', 'theme10_range_v1', 'theme10_candlestick_v1', 'theme10_ridgeline_v1', 'theme10_calendar_v1', 'theme10_funnel_v1', 'theme10_gauge_v1', 'theme10_bullet_v1', 'theme10_box_v1', 'theme10_treemap_v1', 'theme10_sankey_v1', 'theme10_dumbbell_v1', 'theme10_histogram_v1', 'theme10_slope_v1', 'theme10_waffle_v1', 'theme10_gantt_v1', 'theme10_bump_v1', 'theme10_rose_v1', 'theme10_dotplot_v1', 'theme10_timeline_v1', 'theme10_orgchart_v1', 'theme10_parallel_v1', 'theme10_circlepack_v1', 'theme10_cscatter_v1', 'theme10_marimekko_v1', 'theme10_small_multiples_v1'],
  comparison: ['theme01_comparison_v1', 'theme01_comparison_v2', 'theme01_comparison_v3', 'theme02_comparison_v1', 'theme05_versus_v1', 'theme05_quadrant_v1', 'theme05_comparison_v1', 'theme06_company_comparison_v1', 'theme08_compare_v1', 'theme08_range_v1', 'theme09_cross_perspective_v1', 'theme09_plans_v1', 'theme09_compare_v1', 'theme10_compareimg_v1'],
  pricing: ['theme01_pricing_v1', 'theme02_pricing_v1'],
  process: ['theme01_process_v1', 'theme02_process_v1', 'theme04_process_v1', 'theme04_layers_v1', 'theme04_riskchain_v1', 'theme04_metro_v1', 'theme04_chainflow_v1', 'theme05_process_v1', 'theme05_process_v2', 'theme05_roadmap_v1', 'theme06_process_v1', 'theme06_chain_flow_v1', 'theme06_search_v1', 'theme08_process_v1', 'theme09_thesis_v1', 'theme09_value_chain_v1', 'theme09_stair_v1', 'theme09_process_v1'],
  timeline: ['theme01_timeline_v1', 'theme02_timeline_v1', 'theme05_timeline_v1', 'theme06_timeline_v1', 'theme06_milestone_v1', 'theme06_company_rounds_v1', 'theme07_active_capital_v1', 'theme07_repricing_v1', 'theme08_timeline_v1', 'theme09_timeline_photo_v1', 'theme09_journey_v1', 'theme09_orbit_v1', 'theme09_calendar_v1', 'theme09_era_v1'],
  roadmap: ['theme01_roadmap_v1', 'theme02_roadmap_v1', 'theme04_gantt_v1', 'theme08_roadmap_v1', 'theme09_phases_v1', 'theme09_roadmap_v1'],
  quote: ['theme01_quote_v1', 'theme01_quote_v2', 'theme01_quote_v3', 'theme02_quote_v1', 'theme04_quote_v1', 'theme04_voices_v1', 'theme05_quote_v1', 'theme05_quote_v2', 'theme06_quote_v1', 'theme07_quote_v1', 'theme08_quote_v1', 'theme08_quote_statement_v1', 'theme08_quote_resources_v1', 'theme08_quote_verdict_v1', 'theme08_quote_twofield_v1', 'theme08_quote_manifesto_v1', 'theme09_photo_quote_v1', 'theme09_epigraph_v1', 'theme09_quote_portrait_v1', 'theme09_typeriver_v1', 'theme10_statement_v1', 'theme10_quote_v1', 'theme10_quoteimg_v1', 'theme10_quote_stat_v1'],
  content: ['theme01_content_v1', 'theme01_content_v2', 'theme01_content_v3', 'theme01_content_v4', 'theme02_chapter_v1', 'theme02_content_v1', 'theme04_chapter_v1', 'theme04_content_v1', 'theme04_editorial_v1', 'theme04_chapter_split_v1', 'theme04_chapter_numbered_v1', 'theme04_trio_v1', 'theme04_matrix_v1', 'theme04_diptych_v1', 'theme05_chapter_v1', 'theme05_content_v1', 'theme05_matrix_v1', 'theme05_risk_v1', 'theme05_chapter_big_v1', 'theme05_chapter_split_v1', 'theme05_chapter_numbered_v1', 'theme05_chapter_image_v1', 'theme05_case_v1', 'theme05_profile_v1', 'theme05_bento_v1', 'theme06_chapter_v1', 'theme06_content_v1', 'theme06_content_numbered_v1', 'theme06_matrix_v1', 'theme06_case_v1', 'theme06_case_v2', 'theme06_risk_v1', 'theme06_risk_v2', 'theme06_summary_v1', 'theme06_sources_v1', 'theme06_bento_v1', 'theme06_comparison_v1', 'theme06_sector_spotlight_v1', 'theme06_tech_landscape_v1', 'theme06_company_profile_v1', 'theme06_quarter_table_v1', 'theme06_risk_matrix_v1', 'theme06_sector_comparison_v1', 'theme06_chapter_numbered_v1', 'theme06_chapter_split_v1', 'theme06_chapter_focus_v1', 'theme06_chapter_image_v1', 'theme06_chapter_minimal_v1', 'theme06_triad_v1', 'theme06_revenue_risk_v1', 'theme06_open_risk_v1', 'theme06_legal_v1', 'theme06_outlook_v1', 'theme06_recap_v1', 'theme06_quadrant_v1', 'theme06_company_investors_v1', 'theme06_geo_cities_v1', 'theme06_method_v1', 'theme06_industry_vertical_v1', 'theme06_industry_infrastructure_v1', 'theme06_industry_finance_v1', 'theme06_industry_growth_v1', 'theme06_industry_safety_v1', 'theme06_company_spotlight_v1', 'theme06_ipo_watch_v1', 'theme06_statement_v1', 'theme06_deal_structure_v1', 'theme06_alliance_v1', 'theme06_compute_v1', 'theme06_megadeals_v1', 'theme07_chapter_v1', 'theme07_chapter_capital_v1', 'theme07_chapter_risk_v1', 'theme07_chapter_appendix_v1', 'theme07_content_v1', 'theme07_summary_v1', 'theme07_ranking_v1', 'theme07_case_v1', 'theme07_sources_v1', 'theme07_method_v1', 'theme07_matrix_v1', 'theme07_risk_v1', 'theme07_outlook_v1', 'theme07_repricing_v1', 'theme07_investor_v1', 'theme07_active_capital_v1', 'theme07_syndicate_v1', 'theme07_knowledge_v1', 'theme07_legal_v1', 'theme07_healthcare_v1', 'theme07_finance_v1', 'theme07_compute_v1', 'theme07_chip_v1', 'theme07_robotics_v1', 'theme07_autonomy_v1', 'theme07_safety_v1', 'theme07_content_gen_v1', 'theme07_education_v1', 'theme07_support_v1', 'theme07_sales_v1', 'theme07_low_code_v1', 'theme07_open_source_v1', 'theme07_alignment_v1', 'theme07_early_stage_v1', 'theme07_deal_structure_v1', 'theme07_investor_mix_v1', 'theme07_resource_v1', 'theme07_alliance_v1', 'theme07_ecosystem_v1', 'theme07_geo_center_v1', 'theme07_region_cluster_v1', 'theme07_resource_triad_v1', 'theme07_company_openai_v1', 'theme07_company_figure_v1', 'theme07_company_ssi_v1', 'theme07_revenue_v1', 'theme07_compliance_v1', 'theme07_margin_v1', 'theme07_moat_v1', 'theme07_strategy_infra_v1', 'theme07_strategy_vertical_v1', 'theme08_chapter_v1', 'theme08_content_v1', 'theme08_hero_split_v1', 'theme08_funding_v1', 'theme08_case_v1', 'theme08_chain_v1', 'theme08_workflow_v1', 'theme08_chapter_v2', 'theme08_chapter_v3', 'theme08_chapter_v4', 'theme08_case_card_v1', 'theme08_case_card_v2', 'theme08_case_table_v1', 'theme08_case_study_v1', 'theme08_case_grid_v1', 'theme08_case_list_v1', 'theme08_region_anchor_v1', 'theme08_region_card_ny_v1', 'theme08_region_dotmap_v1', 'theme08_segment_v1', 'theme08_pipeline_v1', 'theme08_architecture_v1', 'theme08_supply_v1', 'theme08_compute_v1', 'theme08_revenue_v1', 'theme08_regulation_v1', 'theme08_squeeze_v1', 'theme08_investor_mix_v1', 'theme08_resource_map_v1', 'theme08_closed_loop_v1', 'theme08_triptych_v1', 'theme08_scene_split_v1', 'theme08_budget_card_v1', 'theme08_mainlines_v1', 'theme08_migration_v1', 'theme09_abstract_v1', 'theme09_section_v1', 'theme09_section_card_v1', 'theme09_specimen_v1', 'theme09_manifesto_v1', 'theme09_annotated_v1', 'theme09_case_folio_v1', 'theme09_zine_spread_v1', 'theme09_spotlight_v1', 'theme09_outlook_v1', 'theme09_conclusion_v1', 'theme09_bracket_v1', 'theme09_takeaway_v1', 'theme10_chapter_v1', 'theme10_divider_v1', 'theme10_statement_section_v1', 'theme10_principles_v1', 'theme10_editorial_v1', 'theme10_steps_v1', 'theme10_cycle_v1', 'theme10_swimlane_v1', 'theme10_checklist_v1', 'theme10_plans_v1', 'theme10_journey_v1', 'theme10_goals_v1', 'theme10_glossary_v1', 'theme10_faq_v1', 'theme10_isotype_v1', 'theme10_venn_v1'],
  faq: ['theme01_faq_v1', 'theme02_faq_v1', 'theme09_faq_v1'],
  feature: ['theme01_feature_v1', 'theme02_feature_v1', 'theme04_feature_v1', 'theme04_cards_v1', 'theme08_feature_v1', 'theme08_ecosystem_v1', 'theme08_strategy_v1', 'theme09_photo_feature_v1', 'theme09_vertical_v1', 'theme10_profile_v1', 'theme10_magazine_v1', 'theme10_feature_v1'],
  team: ['theme01_team_v1', 'theme01_team_v2', 'theme02_team_v1', 'theme04_team_v1', 'theme08_team_v1', 'theme09_team_v1', 'theme09_profile_v1'],
  partners: ['theme01_partners_v1', 'theme02_partners_v1', 'theme08_partners_v1'],
  image: ['theme01_image_v1', 'theme02_image_v1', 'theme04_image_v1', 'theme04_annotated_v1', 'theme04_imagestory_v1', 'theme04_showcase_v1', 'theme05_image_v1', 'theme05_editorial_v1', 'theme05_gallery_v1', 'theme08_region_v1', 'theme09_photo_duo_v1', 'theme09_photo_panorama_v1', 'theme09_photo_stage_v1', 'theme09_divider_photo_v1', 'theme09_coverstory_v1', 'theme09_diptych_v1', 'theme09_split_diagonal_v1', 'theme09_photo_scene_v1', 'theme10_team_v1', 'theme10_triptych_v1', 'theme10_strata_v1', 'theme10_inset_v1', 'theme10_poster_v1', 'theme10_annotated_v1', 'theme10_exhibit_v1'],
  gallery: ['theme01_gallery_v1', 'theme02_gallery_v1', 'theme02_filmstrip_v1', 'theme04_gallery_v1', 'theme04_triptych_v1', 'theme04_polaroid_v1', 'theme04_filmstrip_v1', 'theme08_gallery_v1', 'theme08_collage_v1', 'theme09_photo_grid_v1', 'theme09_storyboard_v1', 'theme09_snapshot_tape_v1', 'theme09_mosaic_v1', 'theme09_photo_ring_v1', 'theme09_exhibit_wall_v1', 'theme09_masonry_v1', 'theme09_photo_cards_v1', 'theme09_gallery_wall_v1', 'theme10_spark_v1', 'theme10_pinboard_v1', 'theme10_gallery2_v1', 'theme10_mosaic_v1', 'theme10_collage_v1', 'theme10_captioned_v1', 'theme10_showcase_v1', 'theme10_quilt_v1', 'theme10_medallions_v1'],
  bento: ['theme01_bento_v1', 'theme02_bento_v1', 'theme04_bento_v1', 'theme09_photo_bento_v1'],
  table: ['theme01_table_v1', 'theme02_table_v1', 'theme04_scoreboard_v1', 'theme04_table_v1', 'theme04_quartertable_v1', 'theme04_chaintable_v1', 'theme04_ledger_v1', 'theme05_rank_v1', 'theme08_table_v1', 'theme09_scoreboard_v1'],
  tags: ['theme01_tags_v1', 'theme02_tags_v1'],
  filmstrip: ['theme01_filmstrip_v1', 'theme02_filmstrip_v1', 'theme09_filmstrip_v1', 'theme10_filmstrip_v1'],
  swot: ['theme01_swot_v1', 'theme02_swot_v1', 'theme08_matrix_v1', 'theme08_quadrant_v1', 'theme09_risk_v1'],
  testimonial: ['theme01_testimonial_v1', 'theme02_testimonial_v1', 'theme09_testimonial_v1', 'theme10_testimonials_v1'],
  pest: ['theme01_pest_v1', 'theme02_pest_v1'],
  stats: ['theme01_stats_v1', 'theme02_stats_v1', 'theme02_metrics_v1', 'theme08_overview_v1', 'theme08_bubble_v1', 'theme08_heatmap_v1', 'theme08_radar_v1', 'theme08_waterfall_v1', 'theme10_kpis_v1', 'theme10_metric_hero_v1', 'theme10_scorecard_v1', 'theme10_comparison_stat_v1', 'theme10_stat_strip_v1', 'theme10_index_board_v1'],
  closing: ['theme01_closing_v2', 'theme02_closing_v1', 'theme04_closing_v1', 'theme04_verdict_v1', 'theme05_closing_v1', 'theme06_closing_v1', 'theme07_closing_v1', 'theme07_forward_v1', 'theme07_about_lab_v1', 'theme08_closing_v1', 'theme09_closing_v1', 'theme10_closing_v1'],
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
