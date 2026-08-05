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
