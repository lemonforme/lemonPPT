// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

export * from './registry.js';
export { LpEditableImage, type LpEditableImageProps } from './editable-image.js';
// theme01 视觉 Token（CSS 变量与 SSR 兜底值）
export {
  theme01Tokens,
  theme01DarkTokens,
  generateThemeCssVariables,
  generateThemeCssVariablesWithDark,
  theme01ColorSequence,
  type Theme01Tokens,
  type Theme01ColorScheme,
} from './themes/theme01/tokens.js';
// theme02 视觉 Token（深色霓虹科技风，双强调色方案）
export {
  theme02TokensA,
  theme02TokensB,
  getTheme02Tokens,
  generateTheme02CssVariables,
  generateTheme02CssVariablesWithSchemes,
  type Theme02Tokens,
  type Theme02ColorScheme,
} from './themes/theme02/tokens.js';
// theme03 视觉 Token（代码编辑风，电光蓝与珊瑚橙双强调色方案）
export {
  theme03TokensA,
  theme03TokensB,
  getTheme03Tokens,
  generateTheme03CssVariables,
  generateTheme03CssVariablesWithSchemes,
  type Theme03Tokens,
  type Theme03ColorScheme,
  type Theme03Appearance,
} from './themes/theme03/tokens.js';
// theme04 视觉 Token（玻璃糖果风，green/yellow/blue/pink 多色调 + light/dark 外观）
export {
  generateTheme04CssVariables,
  generateTheme04CssVariablesWithAppearance,
  generateTheme04CssVariablesWithTonesAndAppearance,
  type Theme04Tokens,
  type Theme04Appearance,
  type Theme04Tone,
} from './themes/theme04/tokens.js';
// theme05 视觉 Token（光谱报告风，5 套光谱强调色 + light/dark 外观）
export {
  generateTheme05CssVariables,
  generateTheme05CssVariablesWithAppearance,
  generateTheme05CssVariablesWithSchemesAndAppearance,
  type Theme05Tokens,
  type Theme05Appearance,
  type Theme05ColorScheme,
} from './themes/theme05/tokens.js';
// theme06 视觉 Token（深色图谱风，4 套强调色方案 + light/dark 外观）
export {
  generateTheme06CssVariables,
  generateTheme06CssVariablesWithAppearance,
  generateTheme06CssVariablesWithSchemesAndAppearance,
  type Theme06Tokens,
  type Theme06Appearance,
  type Theme06ColorScheme,
} from './themes/theme06/tokens.js';
// 共享 LpEChart 组件（SSR 占位容器，不依赖 echarts 核心库）
export { LpEChart, type LpEChartProps, type LpEChartType } from './echarts/shared-chart.js';
// 按主题按需加载的 ECharts 初始化工具
export { initEChartsForTheme, disposeEChartsForTheme, loadEChartsTheme } from './echarts/theme-loader.js';
export * from './themes/theme01/pricing-v1.js';
export * from './themes/theme01/partners-v1.js';
export * from './themes/theme01/image-v1.js';
export * from './themes/theme01/swot-v1.js';
export * from './themes/theme01/pest-v1.js';
export * from './themes/theme01/testimonial-v1.js';
// theme02 版式
export * from './themes/theme02/cover-v1.js';
export * from './themes/theme02/cover-v2.js';
export * from './themes/theme02/chapter-v1.js';
export * from './themes/theme02/chapter-v2.js';
export * from './themes/theme02/metric-big.js';
export * from './themes/theme02/number-showcase-v1.js';
export * from './themes/theme02/chart-v1.js';
export * from './themes/theme02/content-v1.js';
export * from './themes/theme02/closing-v1.js';
export * from './themes/theme02/table-of-contents-v1.js';
export * from './themes/theme02/metrics-v1.js';
export * from './themes/theme02/team-v1.js';
export * from './themes/theme02/timeline-v1.js';
export * from './themes/theme02/comparison-v1.js';
export * from './themes/theme02/image-v1.js';
export * from './themes/theme02/quote-v1.js';
export * from './themes/theme02/quote-v2.js';
export * from './themes/theme02/bento-v1.js';
export * from './themes/theme02/feature-v1.js';
export * from './themes/theme02/process-v1.js';
export * from './themes/theme02/roadmap-v1.js';
export * from './themes/theme02/pricing-v1.js';
export * from './themes/theme02/gallery-v1.js';
export * from './themes/theme02/swot-v1.js';
export * from './themes/theme02/faq-v1.js';
export * from './themes/theme02/filmstrip-v1.js';
export * from './themes/theme02/partners-v1.js';
export * from './themes/theme02/pest-v1.js';
export * from './themes/theme02/stats-v1.js';
export * from './themes/theme02/table-v1.js';
export * from './themes/theme02/tags-v1.js';
export * from './themes/theme02/testimonial-v1.js';
// theme03 版式
export * from './themes/theme03/cover-v1.js';
export * from './themes/theme03/chapter-v1.js';
export * from './themes/theme03/content-v1.js';
export * from './themes/theme03/metric-big.js';
export * from './themes/theme03/ranking-v1.js';
export * from './themes/theme03/quote-v1.js';
export * from './themes/theme03/case-v1.js';
export * from './themes/theme03/chart-donut.js';
export * from './themes/theme03/chart-bar.js';
export * from './themes/theme03/chart-v1.js';
export * from './themes/theme03/trend-v1.js';
export * from './themes/theme03/chart-radar.js';
export * from './themes/theme03/chart-funnel.js';
export * from './themes/theme03/chart-gauge.js';
export * from './themes/theme03/chart-heatmap.js';
export * from './themes/theme03/chart-treemap.js';
export * from './themes/theme03/chart-wordcloud.js';
export * from './themes/theme03/chart-bar3d.js';
export * from './themes/theme03/chart-graph.js';
export * from './themes/theme03/chart-sankey.js';
export * from './themes/theme03/chart-sunburst.js';
export * from './themes/theme03/process-v1.js';
export * from './themes/theme03/timeline-v1.js';
export * from './themes/theme03/roadmap-v1.js';
export * from './themes/theme03/swot-v1.js';
export * from './themes/theme03/closing-v1.js';
export * from './themes/theme03/table-of-contents-v1.js';
export * from './themes/theme03/metrics-v1.js';
export * from './themes/theme03/feature-v1.js';
export * from './themes/theme03/image-v1.js';
export * from './themes/theme03/team-v1.js';
export * from './themes/theme03/partners-v1.js';
export * from './themes/theme03/pricing-v1.js';
export * from './themes/theme03/comparison-v1.js';
export * from './themes/theme03/faq-v1.js';
export * from './themes/theme03/gallery-v1.js';
export * from './themes/theme03/number-showcase-v1.js';
export * from './themes/theme03/bento-v1.js';
export * from './themes/theme03/quadrant-v1.js';
export * from './themes/theme03/table-v1.js';
export * from './themes/theme03/testimonial-v1.js';
export * from './themes/theme03/tags-v1.js';
export * from './themes/theme03/progress-v1.js';
export * from './themes/theme03/metric-v1.js';
export * from './themes/theme03/metric-v2.js';
export * from './themes/theme03/metric-v3.js';
export * from './themes/theme03/metric-triptych.js';
export * from './themes/theme03/scorecard-v1.js';
export * from './themes/theme03/appendix-v1.js';
export * from './themes/theme03/case-study.js';
export * from './themes/theme03/outlook-v1.js';
export * from './themes/theme03/region-v1.js';
export * from './themes/theme03/risk-v1.js';
export * from './themes/theme03/spotlight-grid.js';
export * from './themes/theme03/conclusion-v1.js';
export * from './themes/theme03/diptych-contrast.js';
export * from './themes/theme03/filmstrip-v1.js';
export * from './themes/theme03/gantt-v1.js';
export * from './themes/theme03/pest-v1.js';
export * from './themes/theme03/stats-v1.js';
export * from './themes/theme03/table-data.js';
// theme04 版式
export * from './themes/theme04/cover-v1.js';
export * from './themes/theme04/chapter-v1.js';
export * from './themes/theme04/content-v1.js';
export * from './themes/theme04/metric-v1.js';
export * from './themes/theme04/chart-v1.js';
export * from './themes/theme04/quote-v1.js';
export * from './themes/theme04/image-v1.js';
export * from './themes/theme04/closing-v1.js';
export * from './themes/theme04/table-of-contents-v1.js';
export * from './themes/theme04/feature-v1.js';
export * from './themes/theme04/bento-v1.js';
export * from './themes/theme04/team-v1.js';
export * from './themes/theme04/chart-donut.js';
export * from './themes/theme04/metric-big.js';
export * from './themes/theme04/process-v1.js';
export * from './themes/theme04/gallery-v1.js';
export * from './themes/theme04/stats-v1.js';
export * from './themes/theme04/comparison-v1.js';
export * from './themes/theme04/table-v1.js';
export * from './themes/theme04/timeline-v1.js';
export * from './themes/theme04/roadmap-v1.js';
export * from './themes/theme04/ranking-v1.js';
export * from './themes/theme04/case-v1.js';
export * from './themes/theme04/quadrant-v1.js';
export * from './themes/theme04/agenda-v1.js';
export * from './themes/theme04/cover-index-v1.js';
export * from './themes/theme04/chapter-v2.js';
export * from './themes/theme04/image-quote-v1.js';
export * from './themes/theme04/editorial-v1.js';
export * from './themes/theme04/triptych-v1.js';
export * from './themes/theme04/gantt-v1.js';
export * from './themes/theme04/radar-v1.js';
export * from './themes/theme04/heatmap-v1.js';
// theme05 版式
export * from './themes/theme05/cover-v1.js';
export * from './themes/theme05/table-of-contents-v1.js';
export * from './themes/theme05/chapter-v1.js';
export * from './themes/theme05/content-v1.js';
export * from './themes/theme05/metric-v1.js';
export * from './themes/theme05/chart-v1.js';
export * from './themes/theme05/bubble-v1.js';
export * from './themes/theme05/map-v1.js';
export * from './themes/theme05/rank-v1.js';
export * from './themes/theme05/heatmap-v1.js';
export * from './themes/theme05/waterfall-v1.js';
export * from './themes/theme05/quote-v1.js';
export * from './themes/theme05/image-v1.js';
export * from './themes/theme05/versus-v1.js';
export * from './themes/theme05/process-v1.js';
export * from './themes/theme05/timeline-v1.js';
export * from './themes/theme05/matrix-v1.js';
export * from './themes/theme05/quadrant-v1.js';
export * from './themes/theme05/risk-v1.js';
export * from './themes/theme05/donut-v1.js';
export * from './themes/theme05/treemap-v1.js';
export * from './themes/theme05/radar-v1.js';
export * from './themes/theme05/closing-v1.js';
export * from './themes/theme05/scorecards-v1.js';
export * from './themes/theme05/profile-v1.js';
export * from './themes/theme05/case-v1.js';
export * from './themes/theme05/bento-v1.js';
export * from './themes/theme05/gallery-v1.js';
export * from './themes/theme05/roadmap-v1.js';
export * from './themes/theme05/editorial-v1.js';
// theme06 版式
export * from './themes/theme06/cover-v1.js';
export * from './themes/theme06/chapter-v1.js';
export * from './themes/theme06/content-v1.js';
export * from './themes/theme06/content-numbered-v1.js';
export * from './themes/theme06/metric-hero-v1.js';
export * from './themes/theme06/vertical-bar-v1.js';
export * from './themes/theme06/chart-v1.js';
export * from './themes/theme06/quote-v1.js';
export * from './themes/theme06/metric-grid-v1.js';
export * from './themes/theme06/rank-v1.js';
export * from './themes/theme06/matrix-v1.js';
export * from './themes/theme06/chart-radar-v1.js';
export * from './themes/theme06/chart-waterfall-v1.js';
export * from './themes/theme06/chart-peak-v1.js';
export * from './themes/theme06/process-v1.js';
export * from './themes/theme06/timeline-v1.js';
export * from './themes/theme06/case-v1.js';
export * from './themes/theme06/case-v2.js';
export * from './themes/theme06/risk-v1.js';
export * from './themes/theme06/risk-v2.js';
export * from './themes/theme06/chart-graph-v1.js';
export * from './themes/theme06/map-v1.js';

// theme07 视觉 Token（冷白调研风，单一 light 外观，接口预留 dark 扩展）
export {
  generateTheme07CssVariables,
  generateTheme07CssVariablesWithAppearance,
  generateTheme07CssVariablesWithSchemesAndAppearance,
  type Theme07Tokens,
  type Theme07Appearance,
} from './themes/theme07/tokens.js';

// theme08 视觉 Token（黑金实验风，primary/muted 双外观）
export {
  theme08Tokens,
  getTheme08Tokens,
  generateTheme08CssVariables,
  generateTheme08CssVariablesWithAppearance,
  generateTheme08CssVariablesWithSchemesAndAppearance,
  type Theme08Tokens,
  type Theme08Appearance,
} from './themes/theme08/tokens.js';

// theme09 视觉 Token（墨韵专色 · 杂志印刷风，纸/墨双基底 + primary/muted 专色浓度）
export {
  theme09Tokens,
  getTheme09Tokens,
  generateTheme09CssVariables,
  generateTheme09CssVariablesWithAppearance,
  generateTheme09CssVariablesWithSchemesAndAppearance,
  type Theme09Tokens,
  type Theme09Appearance,
  type Theme09Substrate,
} from './themes/theme09/tokens.js';

// theme07 版式（Phase 1：8 个核心版式 + Phase 2：扩展版式）
export * from './themes/theme07/cover-v1.js';
export * from './themes/theme07/table-of-contents-v1.js';
export * from './themes/theme07/chapter-v1.js';
export * from './themes/theme07/chapter-capital-v1.js';
export * from './themes/theme07/chapter-risk-v1.js';
export * from './themes/theme07/chapter-appendix-v1.js';
export * from './themes/theme07/content-v1.js';
export * from './themes/theme07/summary-v1.js';
export * from './themes/theme07/ranking-v1.js';
export * from './themes/theme07/case-v1.js';
export * from './themes/theme07/sources-v1.js';
export * from './themes/theme07/method-v1.js';
export * from './themes/theme07/monthly-v1.js';
export * from './themes/theme07/waterfall-v1.js';
export * from './themes/theme07/matrix-v1.js';
export * from './themes/theme07/risk-v1.js';
export * from './themes/theme07/cover-lean-v1.js';
export * from './themes/theme07/cover-supply-chain-v1.js';
export * from './themes/theme07/cover-retail-trend-v1.js';
export * from './themes/theme07/cover-supply-strategy-v1.js';
export * from './themes/theme07/peak-v1.js';
export * from './themes/theme07/cooldown-v1.js';
export * from './themes/theme07/peak-trough-v1.js';
export * from './themes/theme07/deal-size-v1.js';
export * from './themes/theme07/avg-ticket-v1.js';
export * from './themes/theme07/outlook-v1.js';
export * from './themes/theme07/repricing-v1.js';
export * from './themes/theme07/deal-map-v1.js';
export * from './themes/theme07/cold-start-v1.js';
export * from './themes/theme07/accelerate-v1.js';
export * from './themes/theme07/investor-v1.js';
export * from './themes/theme07/active-capital-v1.js';
export * from './themes/theme07/concentration-v1.js';
export * from './themes/theme07/syndicate-v1.js';
// theme07 版式（Phase 3/4：垂直赛道、资本生态、地理、公司案例、风险策略、结尾页）
export * from './themes/theme07/knowledge-v1.js';
export * from './themes/theme07/legal-v1.js';
export * from './themes/theme07/healthcare-v1.js';
export * from './themes/theme07/finance-v1.js';
export * from './themes/theme07/compute-v1.js';
export * from './themes/theme07/chip-v1.js';
export * from './themes/theme07/robotics-v1.js';
export * from './themes/theme07/autonomy-v1.js';
export * from './themes/theme07/safety-v1.js';
export * from './themes/theme07/content_gen-v1.js';
export * from './themes/theme07/education-v1.js';
export * from './themes/theme07/support-v1.js';
export * from './themes/theme07/sales-v1.js';
export * from './themes/theme07/low_code-v1.js';
export * from './themes/theme07/open_source-v1.js';
export * from './themes/theme07/alignment-v1.js';
export * from './themes/theme07/early_stage-v1.js';
export * from './themes/theme07/deal_structure-v1.js';
export * from './themes/theme07/investor_mix-v1.js';
export * from './themes/theme07/resource-v1.js';
export * from './themes/theme07/alliance-v1.js';
export * from './themes/theme07/ecosystem-v1.js';
export * from './themes/theme07/geo_center-v1.js';
export * from './themes/theme07/region_cluster-v1.js';
export * from './themes/theme07/resource_triad-v1.js';
export * from './themes/theme07/company_openai-v1.js';
export * from './themes/theme07/company_figure-v1.js';
export * from './themes/theme07/company_ssi-v1.js';
export * from './themes/theme07/revenue-v1.js';
export * from './themes/theme07/compliance-v1.js';
export * from './themes/theme07/margin-v1.js';
export * from './themes/theme07/moat-v1.js';
export * from './themes/theme07/strategy_infra-v1.js';
export * from './themes/theme07/strategy_vertical-v1.js';
export * from './themes/theme07/quote-v1.js';
export * from './themes/theme07/closing-v1.js';
export * from './themes/theme07/forward-v1.js';
export * from './themes/theme07/about_lab-v1.js';
export * from './themes/theme07/stat_hero-v1.js';
export * from './themes/theme07/stat_row-v1.js';
export * from './themes/theme07/stat_chart-v1.js';
export * from './themes/theme07/stat_compare-v1.js';
export * from './themes/theme07/drop-media-placeholder.js';

// theme09 版式（P0 骨架 12 个）
export * from './themes/theme09/shared.js';
export * from './themes/theme09/cover-masthead-v1.js';
export * from './themes/theme09/cover-bleed-v1.js';
export * from './themes/theme09/cover-dossier-v1.js';
export * from './themes/theme09/cover-colorbar-v1.js';
export * from './themes/theme09/cover-aperture-v1.js';
export * from './themes/theme09/cover-colophon-v1.js';
export * from './themes/theme09/cover-photo-v1.js';
export * from './themes/theme09/abstract-v1.js';
export * from './themes/theme09/contents-v1.js';
export * from './themes/theme09/section-v1.js';
export * from './themes/theme09/section-card-v1.js';
export * from './themes/theme09/closing-v1.js';

// theme09 版式（P3 批次一 · 9 版式）
export * from './themes/theme09/cross-perspective-v1.js';
export * from './themes/theme09/thesis-v1.js';
export * from './themes/theme09/value-chain-v1.js';
export * from './themes/theme09/risk-v1.js';
export * from './themes/theme09/outlook-v1.js';
export * from './themes/theme09/conclusion-v1.js';
export * from './themes/theme09/bracket-v1.js';
export * from './themes/theme09/flow-v1.js';
export * from './themes/theme09/orbit-v1.js';
// theme09 版式（P3 批次二 · 9 版式）
export * from './themes/theme09/vertical-v1.js';
export * from './themes/theme09/calendar-v1.js';
export * from './themes/theme09/phases-v1.js';
export * from './themes/theme09/gauge-v1.js';
export * from './themes/theme09/scoreboard-v1.js';
export * from './themes/theme09/trend-v1.js';
export * from './themes/theme09/histogram-v1.js';
export * from './themes/theme09/forecast-fan-v1.js';
export * from './themes/theme09/plans-v1.js';

// theme09 版式（P3 批次三 · 9 版式）
export * from './themes/theme09/stair-v1.js';
export * from './themes/theme09/stacked-v1.js';
export * from './themes/theme09/era-v1.js';
export * from './themes/theme09/roadmap-v1.js';
export * from './themes/theme09/score-v1.js';
export * from './themes/theme09/takeaway-v1.js';
export * from './themes/theme09/compare-v1.js';
export * from './themes/theme09/process-v1.js';
export * from './themes/theme09/faq-v1.js';

// theme10 视觉 Token（金色指数 · 金融编辑风，mood 三情绪渐变）
export {
  theme10Tokens,
  getTheme10Tokens,
  generateTheme10CssVariables,
  type Theme10Tokens,
  type Theme10Mood,
} from './themes/theme10/tokens.js';

// theme10 版式（P0 骨架 12 个）— 金色指数 · 金融编辑风
export * from './themes/theme10/cover-dusk-v1.js';
export * from './themes/theme10/cover-field-v1.js';
export * from './themes/theme10/cover-atmos-v1.js';
export * from './themes/theme10/cover-horizon-v1.js';
export * from './themes/theme10/cover-standard-v1.js';
export * from './themes/theme10/cover-dawn-v1.js';
export * from './themes/theme10/chapter-v1.js';
export * from './themes/theme10/divider-v1.js';
export * from './themes/theme10/statement-section-v1.js';
export * from './themes/theme10/statement-v1.js';
export * from './themes/theme10/principles-v1.js';
export * from './themes/theme10/closing-v1.js';
export * from './themes/theme10/profile-v1.js';
export * from './themes/theme10/team-v1.js';
export * from './themes/theme10/quote-v1.js';
export * from './themes/theme10/editorial-v1.js';
export * from './themes/theme10/magazine-v1.js';
export * from './themes/theme10/triptych-v1.js';
export * from './themes/theme10/strata-v1.js';
export * from './themes/theme10/spark-v1.js';
export * from './themes/theme10/testimonials-v1.js';
export * from './themes/theme10/feature-v1.js';
export * from './themes/theme10/compareimg-v1.js';
export * from './themes/theme10/pinboard-v1.js';
export * from './themes/theme10/filmstrip-v1.js';
export * from './themes/theme10/inset-v1.js';
export * from './themes/theme10/gallery2-v1.js';
export * from './themes/theme10/mosaic-v1.js';
export * from './themes/theme10/collage-v1.js';
export * from './themes/theme10/captioned-v1.js';
export * from './themes/theme10/showcase-v1.js';
export * from './themes/theme10/poster-v1.js';
export * from './themes/theme10/annotated-v1.js';
export * from './themes/theme10/quoteimg-v1.js';
export * from './themes/theme10/quilt-v1.js';
export * from './themes/theme10/exhibit-v1.js';
export * from './themes/theme10/medallions-v1.js';
export * from './themes/theme10/chartkit.js';
export * from './themes/theme10/bar-v1.js';
export * from './themes/theme10/hbar-v1.js';
export * from './themes/theme10/line-v1.js';
export * from './themes/theme10/area-v1.js';
export * from './themes/theme10/kpis-v1.js';
export * from './themes/theme10/grouped-v1.js';
export * from './themes/theme10/stack-v1.js';
export * from './themes/theme10/donut-v1.js';
export * from './themes/theme10/pie-v1.js';
export * from './themes/theme10/waterfall-v1.js';
export * from './themes/theme10/scatter-v1.js';
export * from './themes/theme10/bubble-v1.js';
export * from './themes/theme10/radar-v1.js';
export * from './themes/theme10/radial-v1.js';
export * from './themes/theme10/heat-v1.js';
export * from './themes/theme10/trend-v1.js';
export * from './themes/theme10/range-v1.js';
export * from './themes/theme10/candlestick-v1.js';
export * from './themes/theme10/ridgeline-v1.js';
export * from './themes/theme10/calendar-v1.js';
export * from './themes/theme10/funnel-v1.js';
export * from './themes/theme10/gauge-v1.js';
export * from './themes/theme10/bullet-v1.js';
export * from './themes/theme10/box-v1.js';
export * from './themes/theme10/treemap-v1.js';
export * from './themes/theme10/sankey-v1.js';
export * from './themes/theme10/dumbbell-v1.js';
export * from './themes/theme10/histogram-v1.js';
export * from './themes/theme10/slope-v1.js';
export * from './themes/theme10/waffle-v1.js';
export * from './themes/theme10/gantt-v1.js';
export * from './themes/theme10/bump-v1.js';
export * from './themes/theme10/rose-v1.js';
export * from './themes/theme10/dotplot-v1.js';
export * from './themes/theme10/timeline-v1.js';
export * from './themes/theme10/orgchart-v1.js';
export * from './themes/theme10/parallel-v1.js';
export * from './themes/theme10/circlepack-v1.js';
export * from './themes/theme10/cscatter-v1.js';
export * from './themes/theme10/marimekko-v1.js';
export * from './themes/theme10/steps-v1.js';
export * from './themes/theme10/cycle-v1.js';
export * from './themes/theme10/swimlane-v1.js';
export * from './themes/theme10/checklist-v1.js';
export * from './themes/theme10/plans-v1.js';
export * from './themes/theme10/journey-v1.js';
export * from './themes/theme10/goals-v1.js';
export * from './themes/theme10/glossary-v1.js';
export * from './themes/theme10/faq-v1.js';
export * from './themes/theme10/isotype-v1.js';
export * from './themes/theme10/venn-v1.js';
