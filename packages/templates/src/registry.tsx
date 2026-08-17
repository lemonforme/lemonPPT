// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema, Slide } from '@lemonppt/core';
import type { ComponentType, ReactElement } from 'react';
import {
  Theme01AppendixV1,
  theme01AppendixV1Meta,
  theme01AppendixV1Schema,
  type Theme01AppendixV1Props,
} from './themes/theme01/appendix-v1.js';
import {
  Theme01ComponentsV1,
  theme01ComponentsV1Meta,
  theme01ComponentsV1Schema,
  type Theme01ComponentsV1Props,
} from './themes/theme01/components-v1.js';
import {
  Theme01BentoV1,
  theme01BentoV1Meta,
  theme01BentoV1Schema,
  type Theme01BentoV1Props,
} from './themes/theme01/bento-v1.js';
import {
  Theme01ChapterV1,
  theme01ChapterV1Meta,
  theme01ChapterV1Schema,
  type Theme01ChapterV1Props,
} from './themes/theme01/chapter-v1.js';
import {
  Theme01ChapterV2,
  theme01ChapterV2Meta,
  theme01ChapterV2Schema,
  type Theme01ChapterV2Props,
} from './themes/theme01/chapter-v2.js';
import {
  Theme01ChapterV3,
  theme01ChapterV3Meta,
  theme01ChapterV3Schema,
  type Theme01ChapterV3Props,
} from './themes/theme01/chapter-v3.js';
import {
  Theme01ChartBar3d,
  theme01ChartBar3dMeta,
  theme01ChartBar3dSchema,
  type Theme01ChartBar3dProps,
} from './themes/theme01/chart-bar3d.js';
import {
  Theme01ChartDonut,
  theme01ChartDonutMeta,
  theme01ChartDonutSchema,
  type Theme01ChartDonutProps,
} from './themes/theme01/chart-donut.js';
import {
  Theme01ChartFunnel,
  theme01ChartFunnelMeta,
  theme01ChartFunnelSchema,
  type Theme01ChartFunnelProps,
} from './themes/theme01/chart-funnel.js';
import {
  Theme01ChartGauge,
  theme01ChartGaugeMeta,
  theme01ChartGaugeSchema,
  type Theme01ChartGaugeProps,
} from './themes/theme01/chart-gauge.js';
import {
  Theme01ChartGraph,
  theme01ChartGraphMeta,
  theme01ChartGraphSchema,
  type Theme01ChartGraphProps,
} from './themes/theme01/chart-graph.js';
import {
  Theme01ChartHeatmap,
  theme01ChartHeatmapMeta,
  theme01ChartHeatmapSchema,
  type Theme01ChartHeatmapProps,
} from './themes/theme01/chart-heatmap.js';
import {
  Theme01ChartRadar,
  theme01ChartRadarMeta,
  theme01ChartRadarSchema,
  type Theme01ChartRadarProps,
} from './themes/theme01/chart-radar.js';
import {
  Theme01ChartSankey,
  theme01ChartSankeyMeta,
  theme01ChartSankeySchema,
  type Theme01ChartSankeyProps,
} from './themes/theme01/chart-sankey.js';
import {
  Theme01ChartSunburst,
  theme01ChartSunburstMeta,
  theme01ChartSunburstSchema,
  type Theme01ChartSunburstProps,
} from './themes/theme01/chart-sunburst.js';
import {
  Theme01ChartTreemap,
  theme01ChartTreemapMeta,
  theme01ChartTreemapSchema,
  type Theme01ChartTreemapProps,
} from './themes/theme01/chart-treemap.js';
import {
  Theme01ChartV1,
  theme01ChartV1Meta,
  theme01ChartV1Schema,
  type Theme01ChartV1Props,
} from './themes/theme01/chart-v1.js';
import {
  Theme01ChartWordcloud,
  theme01ChartWordcloudMeta,
  theme01ChartWordcloudSchema,
  type Theme01ChartWordcloudProps,
} from './themes/theme01/chart-wordcloud.js';
import {
  Theme01CaseStudy,
  theme01CaseStudyMeta,
  theme01CaseStudySchema,
  type Theme01CaseStudyProps,
} from './themes/theme01/case-study.js';
import {
  Theme01ClosingV2,
  theme01ClosingV2Meta,
  theme01ClosingV2Schema,
  type Theme01ClosingV2Props,
} from './themes/theme01/closing-v2.js';
import {
  Theme01ComparisonV1,
  theme01ComparisonV1Meta,
  theme01ComparisonV1Schema,
  type Theme01ComparisonV1Props,
} from './themes/theme01/comparison-v1.js';
import {
  Theme01ComparisonV2,
  theme01ComparisonV2Meta,
  theme01ComparisonV2Schema,
  type Theme01ComparisonV2Props,
} from './themes/theme01/comparison-v2.js';
import {
  Theme01ComparisonV3,
  theme01ComparisonV3Meta,
  theme01ComparisonV3Schema,
  type Theme01ComparisonV3Props,
} from './themes/theme01/comparison-v3.js';
import {
  Theme01ConclusionV1,
  theme01ConclusionV1Meta,
  theme01ConclusionV1Schema,
  type Theme01ConclusionV1Props,
} from './themes/theme01/conclusion-v1.js';
import {
  Theme01DiptychContrast,
  theme01DiptychContrastMeta,
  theme01DiptychContrastSchema,
  type Theme01DiptychContrastProps,
} from './themes/theme01/diptych-contrast.js';
import {
  Theme01ContentV1,
  theme01ContentV1Meta,
  theme01ContentV1Schema,
  type Theme01ContentV1Props,
} from './themes/theme01/content-v1.js';
import {
  Theme01ContentV2,
  theme01ContentV2Meta,
  theme01ContentV2Schema,
  type Theme01ContentV2Props,
} from './themes/theme01/content-v2.js';
import {
  Theme01ContentV3,
  theme01ContentV3Meta,
  theme01ContentV3Schema,
  type Theme01ContentV3Props,
} from './themes/theme01/content-v3.js';
import {
  Theme01ContentV4,
  theme01ContentV4Meta,
  theme01ContentV4Schema,
  type Theme01ContentV4Props,
} from './themes/theme01/content-v4.js';
import {
  Theme01CoverV1,
  theme01CoverV1Meta,
  theme01CoverV1Schema,
  type Theme01CoverV1Props,
} from './themes/theme01/cover-v1.js';
import {
  Theme01CoverV2,
  theme01CoverV2Meta,
  theme01CoverV2Schema,
  type Theme01CoverV2Props,
} from './themes/theme01/cover-v2.js';
import {
  Theme01CoverV3,
  theme01CoverV3Meta,
  theme01CoverV3Schema,
  type Theme01CoverV3Props,
} from './themes/theme01/cover-v3.js';
import {
  Theme01CoverV4,
  theme01CoverV4Meta,
  theme01CoverV4Schema,
  type Theme01CoverV4Props,
} from './themes/theme01/cover-v4.js';
import {
  Theme01FaqV1,
  theme01FaqV1Meta,
  theme01FaqV1Schema,
  type Theme01FaqV1Props,
} from './themes/theme01/faq-v1.js';
import {
  Theme01FeatureV1,
  theme01FeatureV1Meta,
  theme01FeatureV1Schema,
  type Theme01FeatureV1Props,
} from './themes/theme01/feature-v1.js';
import {
  Theme01FeatureV2,
  theme01FeatureV2Meta,
  theme01FeatureV2Schema,
  type Theme01FeatureV2Props,
} from './themes/theme01/feature-v2.js';
import {
  Theme01FilmstripV1,
  theme01FilmstripV1Meta,
  theme01FilmstripV1Schema,
  type Theme01FilmstripV1Props,
} from './themes/theme01/filmstrip-v1.js';
import {
  Theme01GalleryV1,
  theme01GalleryV1Meta,
  theme01GalleryV1Schema,
  type Theme01GalleryV1Props,
} from './themes/theme01/gallery-v1.js';
import {
  Theme01GanttV1,
  theme01GanttV1Meta,
  theme01GanttV1Schema,
  type Theme01GanttV1Props,
} from './themes/theme01/gantt-v1.js';
import {
  Theme01ImageV1,
  theme01ImageV1Meta,
  theme01ImageV1Schema,
  type Theme01ImageV1Props,
} from './themes/theme01/image-v1.js';
import {
  Theme01MetricBig,
  theme01MetricBigMeta,
  theme01MetricBigSchema,
  type Theme01MetricBigProps,
} from './themes/theme01/metric-big.js';
import {
  Theme01MetricTriptych,
  theme01MetricTriptychMeta,
  theme01MetricTriptychSchema,
  type Theme01MetricTriptychProps,
} from './themes/theme01/metric-triptych.js';
import {
  Theme01MetricV1,
  theme01MetricV1Meta,
  theme01MetricV1Schema,
  type Theme01MetricV1Props,
} from './themes/theme01/metric-v1.js';
import {
  Theme01MetricV2,
  theme01MetricV2Meta,
  theme01MetricV2Schema,
  type Theme01MetricV2Props,
} from './themes/theme01/metric-v2.js';
import {
  Theme01MetricV3,
  theme01MetricV3Meta,
  theme01MetricV3Schema,
  type Theme01MetricV3Props,
} from './themes/theme01/metric-v3.js';
import {
  Theme01OutlookV1,
  theme01OutlookV1Meta,
  theme01OutlookV1Schema,
  type Theme01OutlookV1Props,
} from './themes/theme01/outlook-v1.js';
import {
  Theme01PartnersV1,
  theme01PartnersV1Meta,
  theme01PartnersV1Schema,
  type Theme01PartnersV1Props,
} from './themes/theme01/partners-v1.js';
import {
  Theme01PestV1,
  theme01PestV1Meta,
  theme01PestV1Schema,
  type Theme01PestV1Props,
} from './themes/theme01/pest-v1.js';
import {
  Theme01PricingV1,
  theme01PricingV1Meta,
  theme01PricingV1Schema,
  type Theme01PricingV1Props,
} from './themes/theme01/pricing-v1.js';
import {
  Theme01ProcessV1,
  theme01ProcessV1Meta,
  theme01ProcessV1Schema,
  type Theme01ProcessV1Props,
} from './themes/theme01/process-v1.js';
import {
  Theme01QuadrantV1,
  theme01QuadrantV1Meta,
  theme01QuadrantV1Schema,
  type Theme01QuadrantV1Props,
} from './themes/theme01/quadrant-v1.js';
import {
  Theme01QuoteV1,
  theme01QuoteV1Meta,
  theme01QuoteV1Schema,
  type Theme01QuoteV1Props,
} from './themes/theme01/quote-v1.js';
import {
  Theme01QuoteV2,
  theme01QuoteV2Meta,
  theme01QuoteV2Schema,
  type Theme01QuoteV2Props,
} from './themes/theme01/quote-v2.js';
import {
  Theme01QuoteV3,
  theme01QuoteV3Meta,
  theme01QuoteV3Schema,
  type Theme01QuoteV3Props,
} from './themes/theme01/quote-v3.js';
import {
  Theme01RankingV1,
  theme01RankingV1Meta,
  theme01RankingV1Schema,
  type Theme01RankingV1Props,
} from './themes/theme01/ranking-v1.js';
import {
  Theme01RegionV1,
  theme01RegionV1Meta,
  theme01RegionV1Schema,
  type Theme01RegionV1Props,
} from './themes/theme01/region-v1.js';
import {
  Theme01RiskV1,
  theme01RiskV1Meta,
  theme01RiskV1Schema,
  type Theme01RiskV1Props,
} from './themes/theme01/risk-v1.js';
import {
  Theme01RoadmapV1,
  theme01RoadmapV1Meta,
  theme01RoadmapV1Schema,
  type Theme01RoadmapV1Props,
} from './themes/theme01/roadmap-v1.js';
import {
  Theme01ScorecardV1,
  theme01ScorecardV1Meta,
  theme01ScorecardV1Schema,
  type Theme01ScorecardV1Props,
} from './themes/theme01/scorecard-v1.js';
import {
  Theme01SpotlightGrid,
  theme01SpotlightGridMeta,
  theme01SpotlightGridSchema,
  type Theme01SpotlightGridProps,
} from './themes/theme01/spotlight-grid.js';
import {
  Theme01StatsV1,
  theme01StatsV1Meta,
  theme01StatsV1Schema,
  type Theme01StatsV1Props,
} from './themes/theme01/stats-v1.js';
import {
  Theme01SwotV1,
  theme01SwotV1Meta,
  theme01SwotV1Schema,
  type Theme01SwotV1Props,
} from './themes/theme01/swot-v1.js';
import {
  Theme01TableOfContentsV1,
  theme01TableOfContentsV1Meta,
  theme01TableOfContentsV1Schema,
  type Theme01TableOfContentsV1Props,
} from './themes/theme01/table-of-contents-v1.js';
import {
  Theme01TableOfContentsV2,
  theme01TableOfContentsV2Meta,
  theme01TableOfContentsV2Schema,
  type Theme01TableOfContentsV2Props,
} from './themes/theme01/table-of-contents-v2.js';
import {
  Theme01TableData,
  theme01TableDataMeta,
  theme01TableDataSchema,
  type Theme01TableDataProps,
} from './themes/theme01/table-data.js';
import {
  Theme01TableV1,
  theme01TableV1Meta,
  theme01TableV1Schema,
  type Theme01TableV1Props,
} from './themes/theme01/table-v1.js';
import {
  Theme01TagsV1,
  theme01TagsV1Meta,
  theme01TagsV1Schema,
  type Theme01TagsV1Props,
} from './themes/theme01/tags-v1.js';
import {
  Theme01TeamV1,
  theme01TeamV1Meta,
  theme01TeamV1Schema,
  type Theme01TeamV1Props,
} from './themes/theme01/team-v1.js';
import {
  Theme01TeamV2,
  theme01TeamV2Meta,
  theme01TeamV2Schema,
  type Theme01TeamV2Props,
} from './themes/theme01/team-v2.js';
import {
  Theme01TestimonialV1,
  theme01TestimonialV1Meta,
  theme01TestimonialV1Schema,
  type Theme01TestimonialV1Props,
} from './themes/theme01/testimonial-v1.js';
import {
  Theme01TimelineV1,
  theme01TimelineV1Meta,
  theme01TimelineV1Schema,
  type Theme01TimelineV1Props,
} from './themes/theme01/timeline-v1.js';
import {
  Theme01TrendV1,
  theme01TrendV1Meta,
  theme01TrendV1Schema,
  type Theme01TrendV1Props,
} from './themes/theme01/trend-v1.js';
import {
  Theme02ChapterV1,
  theme02ChapterV1Meta,
  theme02ChapterV1Schema,
  type Theme02ChapterV1Props,
} from './themes/theme02/chapter-v1.js';
import {
  Theme02ChapterV2,
  theme02ChapterV2Meta,
  theme02ChapterV2Schema,
  type Theme02ChapterV2Props,
} from './themes/theme02/chapter-v2.js';
import {
  Theme02ChartV1,
  theme02ChartV1Meta,
  theme02ChartV1Schema,
  type Theme02ChartV1Props,
} from './themes/theme02/chart-v1.js';
import {
  Theme02ChartFunnel,
  theme02ChartFunnelMeta,
  theme02ChartFunnelSchema,
  type Theme02ChartFunnelProps,
} from './themes/theme02/chart-funnel.js';
import {
  Theme02ChartDonut,
  theme02ChartDonutMeta,
  theme02ChartDonutSchema,
  type Theme02ChartDonutProps,
} from './themes/theme02/chart-donut.js';
import {
  Theme02ChartHeatmap,
  theme02ChartHeatmapMeta,
  theme02ChartHeatmapSchema,
  type Theme02ChartHeatmapProps,
} from './themes/theme02/chart-heatmap.js';
import {
  Theme02ChartRadar,
  theme02ChartRadarMeta,
  theme02ChartRadarSchema,
  type Theme02ChartRadarProps,
} from './themes/theme02/chart-radar.js';
import {
  Theme02ChartGauge,
  theme02ChartGaugeMeta,
  theme02ChartGaugeSchema,
  type Theme02ChartGaugeProps,
} from './themes/theme02/chart-gauge.js';
import {
  Theme02ClosingV1,
  theme02ClosingV1Meta,
  theme02ClosingV1Schema,
  type Theme02ClosingV1Props,
} from './themes/theme02/closing-v1.js';
import {
  Theme02ContentV1,
  theme02ContentV1Meta,
  theme02ContentV1Schema,
  type Theme02ContentV1Props,
} from './themes/theme02/content-v1.js';
import {
  Theme02CoverV1,
  theme02CoverV1Meta,
  theme02CoverV1Schema,
  type Theme02CoverV1Props,
} from './themes/theme02/cover-v1.js';
import {
  Theme02CoverV2,
  theme02CoverV2Meta,
  theme02CoverV2Schema,
  type Theme02CoverV2Props,
} from './themes/theme02/cover-v2.js';
import {
  Theme02DeltaV1,
  theme02DeltaV1Meta,
  theme02DeltaV1Schema,
  type Theme02DeltaV1Props,
} from './themes/theme02/delta-v1.js';
import {
  Theme02MetricBig,
  theme02MetricBigMeta,
  theme02MetricBigSchema,
  type Theme02MetricBigProps,
} from './themes/theme02/metric-big.js';
import {
  Theme02NumberShowcaseV1,
  theme02NumberShowcaseV1Meta,
  theme02NumberShowcaseV1Schema,
  type Theme02NumberShowcaseV1Props,
} from './themes/theme02/number-showcase-v1.js';
import {
  Theme02TableOfContentsV1,
  theme02TableOfContentsV1Meta,
  theme02TableOfContentsV1Schema,
  type Theme02TableOfContentsV1Props,
} from './themes/theme02/table-of-contents-v1.js';
import {
  Theme02MetricsV1,
  theme02MetricsV1Meta,
  theme02MetricsV1Schema,
  type Theme02MetricsV1Props,
} from './themes/theme02/metrics-v1.js';
import {
  Theme02TeamV1,
  theme02TeamV1Meta,
  theme02TeamV1Schema,
  type Theme02TeamV1Props,
} from './themes/theme02/team-v1.js';
import {
  Theme02TimelineV1,
  theme02TimelineV1Meta,
  theme02TimelineV1Schema,
  type Theme02TimelineV1Props,
} from './themes/theme02/timeline-v1.js';
import {
  Theme02ComparisonV1,
  theme02ComparisonV1Meta,
  theme02ComparisonV1Schema,
  type Theme02ComparisonV1Props,
} from './themes/theme02/comparison-v1.js';
import {
  Theme02ImageV1,
  theme02ImageV1Meta,
  theme02ImageV1Schema,
  type Theme02ImageV1Props,
} from './themes/theme02/image-v1.js';
import {
  Theme02QuoteV1,
  theme02QuoteV1Meta,
  theme02QuoteV1Schema,
  type Theme02QuoteV1Props,
} from './themes/theme02/quote-v1.js';
import {
  Theme02QuoteV2,
  theme02QuoteV2Meta,
  theme02QuoteV2Schema,
  type Theme02QuoteV2Props,
} from './themes/theme02/quote-v2.js';
import {
  Theme02BentoV1,
  theme02BentoV1Meta,
  theme02BentoV1Schema,
  type Theme02BentoV1Props,
} from './themes/theme02/bento-v1.js';
import {
  Theme02FeatureV1,
  theme02FeatureV1Meta,
  theme02FeatureV1Schema,
  type Theme02FeatureV1Props,
} from './themes/theme02/feature-v1.js';
import {
  Theme02GalleryV1,
  theme02GalleryV1Meta,
  theme02GalleryV1Schema,
  type Theme02GalleryV1Props,
} from './themes/theme02/gallery-v1.js';
import {
  Theme02PricingV1,
  theme02PricingV1Meta,
  theme02PricingV1Schema,
  type Theme02PricingV1Props,
} from './themes/theme02/pricing-v1.js';
import {
  Theme02ProcessV1,
  theme02ProcessV1Meta,
  theme02ProcessV1Schema,
  type Theme02ProcessV1Props,
} from './themes/theme02/process-v1.js';
import {
  Theme02ProgressV1,
  theme02ProgressV1Meta,
  theme02ProgressV1Schema,
  type Theme02ProgressV1Props,
} from './themes/theme02/progress-v1.js';
import {
  Theme02RoadmapV1,
  theme02RoadmapV1Meta,
  theme02RoadmapV1Schema,
  type Theme02RoadmapV1Props,
} from './themes/theme02/roadmap-v1.js';
import {
  Theme02SwotV1,
  theme02SwotV1Meta,
  theme02SwotV1Schema,
  type Theme02SwotV1Props,
} from './themes/theme02/swot-v1.js';
import {
  Theme02FaqV1,
  theme02FaqV1Meta,
  theme02FaqV1Schema,
  type Theme02FaqV1Props,
} from './themes/theme02/faq-v1.js';
import {
  Theme02FilmstripV1,
  theme02FilmstripV1Meta,
  theme02FilmstripV1Schema,
  type Theme02FilmstripV1Props,
} from './themes/theme02/filmstrip-v1.js';
import {
  Theme02PartnersV1,
  theme02PartnersV1Meta,
  theme02PartnersV1Schema,
  type Theme02PartnersV1Props,
} from './themes/theme02/partners-v1.js';
import {
  Theme02PestV1,
  theme02PestV1Meta,
  theme02PestV1Schema,
  type Theme02PestV1Props,
} from './themes/theme02/pest-v1.js';
import {
  Theme02StatsV1,
  theme02StatsV1Meta,
  theme02StatsV1Schema,
  type Theme02StatsV1Props,
} from './themes/theme02/stats-v1.js';
import {
  Theme02TableV1,
  theme02TableV1Meta,
  theme02TableV1Schema,
  type Theme02TableV1Props,
} from './themes/theme02/table-v1.js';
import {
  Theme02TagsV1,
  theme02TagsV1Meta,
  theme02TagsV1Schema,
  type Theme02TagsV1Props,
} from './themes/theme02/tags-v1.js';
import {
  Theme02TestimonialV1,
  theme02TestimonialV1Meta,
  theme02TestimonialV1Schema,
  type Theme02TestimonialV1Props,
} from './themes/theme02/testimonial-v1.js';
import {
  Theme02FeatureV2,
  theme02FeatureV2Meta,
  theme02FeatureV2Schema,
  type Theme02FeatureV2Props,
} from './themes/theme02/feature-v2.js';
import {
  Theme02ChecklistV1,
  theme02ChecklistV1Meta,
  theme02ChecklistV1Schema,
  type Theme02ChecklistV1Props,
} from './themes/theme02/checklist-v1.js';
import {
  Theme02StepsV1,
  theme02StepsV1Meta,
  theme02StepsV1Schema,
  type Theme02StepsV1Props,
} from './themes/theme02/steps-v1.js';
import {
  Theme02CardGridV1,
  theme02CardGridV1Meta,
  theme02CardGridV1Schema,
  type Theme02CardGridV1Props,
} from './themes/theme02/card-grid-v1.js';
import {
  Theme02HighlightV1,
  theme02HighlightV1Meta,
  theme02HighlightV1Schema,
  type Theme02HighlightV1Props,
} from './themes/theme02/highlight-v1.js';
import {
  Theme02ComparisonV2,
  theme02ComparisonV2Meta,
  theme02ComparisonV2Schema,
  type Theme02ComparisonV2Props,
} from './themes/theme02/comparison-v2.js';
import {
  Theme02MatrixV1,
  theme02MatrixV1Meta,
  theme02MatrixV1Schema,
  type Theme02MatrixV1Props,
} from './themes/theme02/matrix-v1.js';
import {
  Theme02StatGridV1,
  theme02StatGridV1Meta,
  theme02StatGridV1Schema,
  type Theme02StatGridV1Props,
} from './themes/theme02/stat-grid-v1.js';
import {
  Theme02CoverV3,
  theme02CoverV3Meta,
  theme02CoverV3Schema,
  type Theme02CoverV3Props,
} from './themes/theme02/cover-v3.js';
import {
  Theme02ClosingV2,
  theme02ClosingV2Meta,
  theme02ClosingV2Schema,
  type Theme02ClosingV2Props,
} from './themes/theme02/closing-v2.js';
import {
  Theme02ChartBarV1,
  theme02ChartBarV1Meta,
  theme02ChartBarV1Schema,
  type Theme02ChartBarV1Props,
} from './themes/theme02/chart-bar-v1.js';
import {
  Theme02ChartLineV1,
  theme02ChartLineV1Meta,
  theme02ChartLineV1Schema,
  type Theme02ChartLineV1Props,
} from './themes/theme02/chart-line-v1.js';
import {
  Theme02ChartAreaV1,
  theme02ChartAreaV1Meta,
  theme02ChartAreaV1Schema,
  type Theme02ChartAreaV1Props,
} from './themes/theme02/chart-area-v1.js';
import {
  Theme02ChartStackV1,
  theme02ChartStackV1Meta,
  theme02ChartStackV1Schema,
  type Theme02ChartStackV1Props,
} from './themes/theme02/chart-stack-v1.js';
import {
  Theme02KpiStripV1,
  theme02KpiStripV1Meta,
  theme02KpiStripV1Schema,
  type Theme02KpiStripV1Props,
} from './themes/theme02/kpi-strip-v1.js';
import {
  Theme02BigStatV1,
  theme02BigStatV1Meta,
  theme02BigStatV1Schema,
  type Theme02BigStatV1Props,
} from './themes/theme02/big-stat-v1.js';
import {
  Theme02CycleV1,
  theme02CycleV1Meta,
  theme02CycleV1Schema,
  type Theme02CycleV1Props,
} from './themes/theme02/cycle-v1.js';
import {
  Theme02SwimlaneV1,
  theme02SwimlaneV1Meta,
  theme02SwimlaneV1Schema,
  type Theme02SwimlaneV1Props,
} from './themes/theme02/swimlane-v1.js';
import {
  Theme02PyramidV1,
  theme02PyramidV1Meta,
  theme02PyramidV1Schema,
  type Theme02PyramidV1Props,
} from './themes/theme02/pyramid-v1.js';
import {
  Theme02OrgChartV1,
  theme02OrgChartV1Meta,
  theme02OrgChartV1Schema,
  type Theme02OrgChartV1Props,
} from './themes/theme02/org-chart-v1.js';
import {
  Theme02FlowV1,
  theme02FlowV1Meta,
  theme02FlowV1Schema,
  type Theme02FlowV1Props,
} from './themes/theme02/flow-v1.js';
import {
  Theme02TableV2,
  theme02TableV2Meta,
  theme02TableV2Schema,
  type Theme02TableV2Props,
} from './themes/theme02/table-v2.js';
import {
  Theme02ImageSplitV1,
  theme02ImageSplitV1Meta,
  theme02ImageSplitV1Schema,
  type Theme02ImageSplitV1Props,
} from './themes/theme02/image-split-v1.js';
import {
  Theme02ImageGridV2,
  theme02ImageGridV2Meta,
  theme02ImageGridV2Schema,
  type Theme02ImageGridV2Props,
} from './themes/theme02/image-grid-v2.js';
import {
  Theme02SpotlightV1,
  theme02SpotlightV1Meta,
  theme02SpotlightV1Schema,
  type Theme02SpotlightV1Props,
} from './themes/theme02/spotlight-v1.js';
import {
  Theme02ChapterV3,
  theme02ChapterV3Meta,
  theme02ChapterV3Schema,
  type Theme02ChapterV3Props,
} from './themes/theme02/chapter-v3.js';
import {
  Theme02SectionDividerV1,
  theme02SectionDividerV1Meta,
  theme02SectionDividerV1Schema,
  type Theme02SectionDividerV1Props,
} from './themes/theme02/section-divider-v1.js';
import {
  Theme02LogoWallV1,
  theme02LogoWallV1Meta,
  theme02LogoWallV1Schema,
  type Theme02LogoWallV1Props,
} from './themes/theme02/logo-wall-v1.js';
import {
  Theme03CaseV1,
  theme03CaseV1Meta,
  theme03CaseV1Schema,
  type Theme03CaseV1Props,
} from './themes/theme03/case-v1.js';
import {
  Theme03ChartDonut,
  theme03ChartDonutMeta,
  theme03ChartDonutSchema,
  type Theme03ChartDonutProps,
} from './themes/theme03/chart-donut.js';
import {
  Theme03ChartBar,
  theme03ChartBarMeta,
  theme03ChartBarSchema,
  type Theme03ChartBarProps,
} from './themes/theme03/chart-bar.js';
import {
  Theme03ChartV1,
  theme03ChartV1Meta,
  theme03ChartV1Schema,
  type Theme03ChartV1Props,
} from './themes/theme03/chart-v1.js';
import {
  Theme03TrendV1,
  theme03TrendV1Meta,
  theme03TrendV1Schema,
  type Theme03TrendV1Props,
} from './themes/theme03/trend-v1.js';
import {
  Theme03ChartRadar,
  theme03ChartRadarMeta,
  theme03ChartRadarSchema,
  type Theme03ChartRadarProps,
} from './themes/theme03/chart-radar.js';
import {
  Theme03ChartFunnel,
  theme03ChartFunnelMeta,
  theme03ChartFunnelSchema,
  type Theme03ChartFunnelProps,
} from './themes/theme03/chart-funnel.js';
import {
  Theme03ChartGauge,
  theme03ChartGaugeMeta,
  theme03ChartGaugeSchema,
  type Theme03ChartGaugeProps,
} from './themes/theme03/chart-gauge.js';
import {
  Theme03ChartHeatmap,
  theme03ChartHeatmapMeta,
  theme03ChartHeatmapSchema,
  type Theme03ChartHeatmapProps,
} from './themes/theme03/chart-heatmap.js';
import {
  Theme03ChartTreemap,
  theme03ChartTreemapMeta,
  theme03ChartTreemapSchema,
  type Theme03ChartTreemapProps,
} from './themes/theme03/chart-treemap.js';
import {
  Theme03ChartWordcloud,
  theme03ChartWordcloudMeta,
  theme03ChartWordcloudSchema,
  type Theme03ChartWordcloudProps,
} from './themes/theme03/chart-wordcloud.js';
import {
  Theme03ChartBar3d,
  theme03ChartBar3dMeta,
  theme03ChartBar3dSchema,
  type Theme03ChartBar3dProps,
} from './themes/theme03/chart-bar3d.js';
import {
  Theme03ChartGraph,
  theme03ChartGraphMeta,
  theme03ChartGraphSchema,
  type Theme03ChartGraphProps,
} from './themes/theme03/chart-graph.js';
import {
  Theme03ChartSankey,
  theme03ChartSankeyMeta,
  theme03ChartSankeySchema,
  type Theme03ChartSankeyProps,
} from './themes/theme03/chart-sankey.js';
import {
  Theme03ChartSunburst,
  theme03ChartSunburstMeta,
  theme03ChartSunburstSchema,
  type Theme03ChartSunburstProps,
} from './themes/theme03/chart-sunburst.js';
import {
  Theme03ProcessV1,
  theme03ProcessV1Meta,
  theme03ProcessV1Schema,
  type Theme03ProcessV1Props,
} from './themes/theme03/process-v1.js';
import {
  Theme03TimelineV1,
  theme03TimelineV1Meta,
  theme03TimelineV1Schema,
  type Theme03TimelineV1Props,
} from './themes/theme03/timeline-v1.js';
import {
  Theme03RoadmapV1,
  theme03RoadmapV1Meta,
  theme03RoadmapV1Schema,
  type Theme03RoadmapV1Props,
} from './themes/theme03/roadmap-v1.js';
import {
  Theme03SwotV1,
  theme03SwotV1Meta,
  theme03SwotV1Schema,
  type Theme03SwotV1Props,
} from './themes/theme03/swot-v1.js';
import {
  Theme03ChapterV1,
  theme03ChapterV1Meta,
  theme03ChapterV1Schema,
  type Theme03ChapterV1Props,
} from './themes/theme03/chapter-v1.js';
import {
  Theme03ClosingV1,
  theme03ClosingV1Meta,
  theme03ClosingV1Schema,
  type Theme03ClosingV1Props,
} from './themes/theme03/closing-v1.js';
import {
  Theme03ContentV1,
  theme03ContentV1Meta,
  theme03ContentV1Schema,
  type Theme03ContentV1Props,
} from './themes/theme03/content-v1.js';
import {
  Theme03CoverV1,
  theme03CoverV1Meta,
  theme03CoverV1Schema,
  type Theme03CoverV1Props,
} from './themes/theme03/cover-v1.js';
import {
  Theme03MetricBig,
  theme03MetricBigMeta,
  theme03MetricBigSchema,
  type Theme03MetricBigProps,
} from './themes/theme03/metric-big.js';
import {
  Theme03QuoteV1,
  theme03QuoteV1Meta,
  theme03QuoteV1Schema,
  type Theme03QuoteV1Props,
} from './themes/theme03/quote-v1.js';
import {
  Theme03RankingV1,
  theme03RankingV1Meta,
  theme03RankingV1Schema,
  type Theme03RankingV1Props,
} from './themes/theme03/ranking-v1.js';
import {
  Theme03TableOfContentsV1,
  theme03TableOfContentsV1Meta,
  theme03TableOfContentsV1Schema,
  type Theme03TableOfContentsV1Props,
} from './themes/theme03/table-of-contents-v1.js';
import {
  Theme03MetricsV1,
  theme03MetricsV1Meta,
  theme03MetricsV1Schema,
  type Theme03MetricsV1Props,
} from './themes/theme03/metrics-v1.js';
import {
  Theme03FeatureV1,
  theme03FeatureV1Meta,
  theme03FeatureV1Schema,
  type Theme03FeatureV1Props,
} from './themes/theme03/feature-v1.js';
import {
  Theme03ImageV1,
  theme03ImageV1Meta,
  theme03ImageV1Schema,
  type Theme03ImageV1Props,
} from './themes/theme03/image-v1.js';
import {
  Theme03TeamV1,
  theme03TeamV1Meta,
  theme03TeamV1Schema,
  type Theme03TeamV1Props,
} from './themes/theme03/team-v1.js';
import {
  Theme03PartnersV1,
  theme03PartnersV1Meta,
  theme03PartnersV1Schema,
  type Theme03PartnersV1Props,
} from './themes/theme03/partners-v1.js';
import {
  Theme03PricingV1,
  theme03PricingV1Meta,
  theme03PricingV1Schema,
  type Theme03PricingV1Props,
} from './themes/theme03/pricing-v1.js';
import {
  Theme03ComparisonV1,
  theme03ComparisonV1Meta,
  theme03ComparisonV1Schema,
  type Theme03ComparisonV1Props,
} from './themes/theme03/comparison-v1.js';
import {
  Theme03FaqV1,
  theme03FaqV1Meta,
  theme03FaqV1Schema,
  type Theme03FaqV1Props,
} from './themes/theme03/faq-v1.js';
import {
  Theme03GalleryV1,
  theme03GalleryV1Meta,
  theme03GalleryV1Schema,
  type Theme03GalleryV1Props,
} from './themes/theme03/gallery-v1.js';
import {
  Theme03NumberShowcaseV1,
  theme03NumberShowcaseV1Meta,
  theme03NumberShowcaseV1Schema,
  type Theme03NumberShowcaseV1Props,
} from './themes/theme03/number-showcase-v1.js';
import {
  Theme03BentoV1,
  theme03BentoV1Meta,
  theme03BentoV1Schema,
  type Theme03BentoV1Props,
} from './themes/theme03/bento-v1.js';
import {
  Theme03QuadrantV1,
  theme03QuadrantV1Meta,
  theme03QuadrantV1Schema,
  type Theme03QuadrantV1Props,
} from './themes/theme03/quadrant-v1.js';
import {
  Theme03TableV1,
  theme03TableV1Meta,
  theme03TableV1Schema,
  type Theme03TableV1Props,
} from './themes/theme03/table-v1.js';
import {
  Theme03TestimonialV1,
  theme03TestimonialV1Meta,
  theme03TestimonialV1Schema,
  type Theme03TestimonialV1Props,
} from './themes/theme03/testimonial-v1.js';
import {
  Theme03TagsV1,
  theme03TagsV1Meta,
  theme03TagsV1Schema,
  type Theme03TagsV1Props,
} from './themes/theme03/tags-v1.js';
import {
  Theme03ProgressV1,
  theme03ProgressV1Meta,
  theme03ProgressV1Schema,
  type Theme03ProgressV1Props,
} from './themes/theme03/progress-v1.js';
import {
  Theme03MetricV1,
  theme03MetricV1Meta,
  theme03MetricV1Schema,
  type Theme03MetricV1Props,
} from './themes/theme03/metric-v1.js';
import {
  Theme03MetricV2,
  theme03MetricV2Meta,
  theme03MetricV2Schema,
  type Theme03MetricV2Props,
} from './themes/theme03/metric-v2.js';
import {
  Theme03MetricV3,
  theme03MetricV3Meta,
  theme03MetricV3Schema,
  type Theme03MetricV3Props,
} from './themes/theme03/metric-v3.js';
import {
  Theme03MetricTriptych,
  theme03MetricTriptychMeta,
  theme03MetricTriptychSchema,
  type Theme03MetricTriptychProps,
} from './themes/theme03/metric-triptych.js';
import {
  Theme03ScorecardV1,
  theme03ScorecardV1Meta,
  theme03ScorecardV1Schema,
  type Theme03ScorecardV1Props,
} from './themes/theme03/scorecard-v1.js';
import {
  Theme03AppendixV1,
  theme03AppendixV1Meta,
  theme03AppendixV1Schema,
  type Theme03AppendixV1Props,
} from './themes/theme03/appendix-v1.js';
import {
  Theme03CaseStudy,
  theme03CaseStudyMeta,
  theme03CaseStudySchema,
  type Theme03CaseStudyProps,
} from './themes/theme03/case-study.js';
import {
  Theme03OutlookV1,
  theme03OutlookV1Meta,
  theme03OutlookV1Schema,
  type Theme03OutlookV1Props,
} from './themes/theme03/outlook-v1.js';
import {
  Theme03RegionV1,
  theme03RegionV1Meta,
  theme03RegionV1Schema,
  type Theme03RegionV1Props,
} from './themes/theme03/region-v1.js';
import {
  Theme03RiskV1,
  theme03RiskV1Meta,
  theme03RiskV1Schema,
  type Theme03RiskV1Props,
} from './themes/theme03/risk-v1.js';
import {
  Theme03SpotlightGrid,
  theme03SpotlightGridMeta,
  theme03SpotlightGridSchema,
  type Theme03SpotlightGridProps,
} from './themes/theme03/spotlight-grid.js';
import {
  Theme03ConclusionV1,
  theme03ConclusionV1Meta,
  theme03ConclusionV1Schema,
  type Theme03ConclusionV1Props,
} from './themes/theme03/conclusion-v1.js';
import {
  Theme03DiptychContrast,
  theme03DiptychContrastMeta,
  theme03DiptychContrastSchema,
  type Theme03DiptychContrastProps,
} from './themes/theme03/diptych-contrast.js';
import {
  Theme03FilmstripV1,
  theme03FilmstripV1Meta,
  theme03FilmstripV1Schema,
  type Theme03FilmstripV1Props,
} from './themes/theme03/filmstrip-v1.js';
import {
  Theme03GanttV1,
  theme03GanttV1Meta,
  theme03GanttV1Schema,
  type Theme03GanttV1Props,
} from './themes/theme03/gantt-v1.js';
import {
  Theme03PestV1,
  theme03PestV1Meta,
  theme03PestV1Schema,
  type Theme03PestV1Props,
} from './themes/theme03/pest-v1.js';
import {
  Theme03StatsV1,
  theme03StatsV1Meta,
  theme03StatsV1Schema,
  type Theme03StatsV1Props,
} from './themes/theme03/stats-v1.js';
import {
  Theme03TableData,
  theme03TableDataMeta,
  theme03TableDataSchema,
  type Theme03TableDataProps,
} from './themes/theme03/table-data.js';
import {
  Theme03ChapterV2,
  theme03ChapterV2Meta,
  theme03ChapterV2Schema,
  type Theme03ChapterV2Props,
} from './themes/theme03/chapter-v2.js';
import {
  Theme03ChapterV3,
  theme03ChapterV3Meta,
  theme03ChapterV3Schema,
  type Theme03ChapterV3Props,
} from './themes/theme03/chapter-v3.js';
import {
  Theme03ClosingV2,
  theme03ClosingV2Meta,
  theme03ClosingV2Schema,
  type Theme03ClosingV2Props,
} from './themes/theme03/closing-v2.js';
import {
  Theme03ComparisonV2,
  theme03ComparisonV2Meta,
  theme03ComparisonV2Schema,
  type Theme03ComparisonV2Props,
} from './themes/theme03/comparison-v2.js';
import {
  Theme03ComparisonV3,
  theme03ComparisonV3Meta,
  theme03ComparisonV3Schema,
  type Theme03ComparisonV3Props,
} from './themes/theme03/comparison-v3.js';
import {
  Theme03ContentV2,
  theme03ContentV2Meta,
  theme03ContentV2Schema,
  type Theme03ContentV2Props,
} from './themes/theme03/content-v2.js';
import {
  Theme03ContentV3,
  theme03ContentV3Meta,
  theme03ContentV3Schema,
  type Theme03ContentV3Props,
} from './themes/theme03/content-v3.js';
import {
  Theme03ContentV4,
  theme03ContentV4Meta,
  theme03ContentV4Schema,
  type Theme03ContentV4Props,
} from './themes/theme03/content-v4.js';
import {
  Theme03CoverV2,
  theme03CoverV2Meta,
  theme03CoverV2Schema,
  type Theme03CoverV2Props,
} from './themes/theme03/cover-v2.js';
import {
  Theme03CoverV3,
  theme03CoverV3Meta,
  theme03CoverV3Schema,
  type Theme03CoverV3Props,
} from './themes/theme03/cover-v3.js';
import {
  Theme03CoverV4,
  theme03CoverV4Meta,
  theme03CoverV4Schema,
  type Theme03CoverV4Props,
} from './themes/theme03/cover-v4.js';
import {
  Theme03FeatureV2,
  theme03FeatureV2Meta,
  theme03FeatureV2Schema,
  type Theme03FeatureV2Props,
} from './themes/theme03/feature-v2.js';
import {
  Theme03QuoteV2,
  theme03QuoteV2Meta,
  theme03QuoteV2Schema,
  type Theme03QuoteV2Props,
} from './themes/theme03/quote-v2.js';
import {
  Theme03QuoteV3,
  theme03QuoteV3Meta,
  theme03QuoteV3Schema,
  type Theme03QuoteV3Props,
} from './themes/theme03/quote-v3.js';
import {
  Theme03TableOfContentsV2,
  theme03TableOfContentsV2Meta,
  theme03TableOfContentsV2Schema,
  type Theme03TableOfContentsV2Props,
} from './themes/theme03/table-of-contents-v2.js';
import {
  Theme03TeamV2,
  theme03TeamV2Meta,
  theme03TeamV2Schema,
  type Theme03TeamV2Props,
} from './themes/theme03/team-v2.js';
import {
  Theme04CoverV1,
  theme04CoverV1Meta,
  theme04CoverV1Schema,
  type Theme04CoverV1Props,
} from './themes/theme04/cover-v1.js';
import {
  Theme04ChapterV1,
  theme04ChapterV1Meta,
  theme04ChapterV1Schema,
  type Theme04ChapterV1Props,
} from './themes/theme04/chapter-v1.js';
import {
  Theme04ContentV1,
  theme04ContentV1Meta,
  theme04ContentV1Schema,
  type Theme04ContentV1Props,
} from './themes/theme04/content-v1.js';
import {
  Theme04MetricV1,
  theme04MetricV1Meta,
  theme04MetricV1Schema,
  type Theme04MetricV1Props,
} from './themes/theme04/metric-v1.js';
import {
  Theme04ChartV1,
  theme04ChartV1Meta,
  theme04ChartV1Schema,
  type Theme04ChartV1Props,
} from './themes/theme04/chart-v1.js';
import {
  Theme04QuoteV1,
  theme04QuoteV1Meta,
  theme04QuoteV1Schema,
  type Theme04QuoteV1Props,
} from './themes/theme04/quote-v1.js';
import {
  Theme04ImageV1,
  theme04ImageV1Meta,
  theme04ImageV1Schema,
  type Theme04ImageV1Props,
} from './themes/theme04/image-v1.js';
import {
  Theme04ClosingV1,
  theme04ClosingV1Meta,
  theme04ClosingV1Schema,
  type Theme04ClosingV1Props,
} from './themes/theme04/closing-v1.js';
import {
  Theme04TableOfContentsV1,
  theme04TableOfContentsV1Meta,
  theme04TableOfContentsV1Schema,
  type Theme04TableOfContentsV1Props,
} from './themes/theme04/table-of-contents-v1.js';
import {
  Theme04FeatureV1,
  theme04FeatureV1Meta,
  theme04FeatureV1Schema,
  type Theme04FeatureV1Props,
} from './themes/theme04/feature-v1.js';
import {
  Theme04BentoV1,
  theme04BentoV1Meta,
  theme04BentoV1Schema,
  type Theme04BentoV1Props,
} from './themes/theme04/bento-v1.js';
import {
  Theme04TeamV1,
  theme04TeamV1Meta,
  theme04TeamV1Schema,
  type Theme04TeamV1Props,
} from './themes/theme04/team-v1.js';
import {
  Theme04ChartDonut,
  theme04ChartDonutMeta,
  theme04ChartDonutSchema,
  type Theme04ChartDonutProps,
} from './themes/theme04/chart-donut.js';
import {
  Theme04MetricBig,
  theme04MetricBigMeta,
  theme04MetricBigSchema,
  type Theme04MetricBigProps,
} from './themes/theme04/metric-big.js';
import {
  Theme04ProcessV1,
  theme04ProcessV1Meta,
  theme04ProcessV1Schema,
  type Theme04ProcessV1Props,
} from './themes/theme04/process-v1.js';
import {
  Theme04GalleryV1,
  theme04GalleryV1Meta,
  theme04GalleryV1Schema,
  type Theme04GalleryV1Props,
} from './themes/theme04/gallery-v1.js';
import {
  Theme04StatsV1,
  theme04StatsV1Meta,
  theme04StatsV1Schema,
  type Theme04StatsV1Props,
} from './themes/theme04/stats-v1.js';
import {
  Theme04ComparisonV1,
  theme04ComparisonV1Meta,
  theme04ComparisonV1Schema,
  type Theme04ComparisonV1Props,
} from './themes/theme04/comparison-v1.js';
import {
  Theme04TableV1,
  theme04TableV1Meta,
  theme04TableV1Schema,
  type Theme04TableV1Props,
} from './themes/theme04/table-v1.js';
import {
  Theme04TimelineV1,
  theme04TimelineV1Meta,
  theme04TimelineV1Schema,
  type Theme04TimelineV1Props,
} from './themes/theme04/timeline-v1.js';
import {
  Theme04RoadmapV1,
  theme04RoadmapV1Meta,
  theme04RoadmapV1Schema,
  type Theme04RoadmapV1Props,
} from './themes/theme04/roadmap-v1.js';
import {
  Theme04RankingV1,
  theme04RankingV1Meta,
  theme04RankingV1Schema,
  type Theme04RankingV1Props,
} from './themes/theme04/ranking-v1.js';
import {
  Theme04CaseV1,
  theme04CaseV1Meta,
  theme04CaseV1Schema,
  type Theme04CaseV1Props,
} from './themes/theme04/case-v1.js';
import {
  Theme04QuadrantV1,
  theme04QuadrantV1Meta,
  theme04QuadrantV1Schema,
  type Theme04QuadrantV1Props,
} from './themes/theme04/quadrant-v1.js';
import {
  Theme04AgendaV1,
  theme04AgendaV1Meta,
  theme04AgendaV1Schema,
  type Theme04AgendaV1Props,
} from './themes/theme04/agenda-v1.js';
import {
  Theme04CoverIndexV1,
  theme04CoverIndexV1Meta,
  theme04CoverIndexV1Schema,
  type Theme04CoverIndexV1Props,
} from './themes/theme04/cover-index-v1.js';
import {
  Theme04ChapterV2,
  theme04ChapterV2Meta,
  theme04ChapterV2Schema,
  type Theme04ChapterV2Props,
} from './themes/theme04/chapter-v2.js';
import {
  Theme04ImageQuoteV1,
  theme04ImageQuoteV1Meta,
  theme04ImageQuoteV1Schema,
  type Theme04ImageQuoteV1Props,
} from './themes/theme04/image-quote-v1.js';
import {
  Theme04EditorialV1,
  theme04EditorialV1Meta,
  theme04EditorialV1Schema,
  type Theme04EditorialV1Props,
} from './themes/theme04/editorial-v1.js';
import {
  Theme04TriptychV1,
  theme04TriptychV1Meta,
  theme04TriptychV1Schema,
  type Theme04TriptychV1Props,
} from './themes/theme04/triptych-v1.js';
import {
  Theme04GanttV1,
  theme04GanttV1Meta,
  theme04GanttV1Schema,
  type Theme04GanttV1Props,
} from './themes/theme04/gantt-v1.js';
import {
  Theme04RadarV1,
  theme04RadarV1Meta,
  theme04RadarV1Schema,
  type Theme04RadarV1Props,
} from './themes/theme04/radar-v1.js';
import {
  Theme04HeatmapV1,
  theme04HeatmapV1Meta,
  theme04HeatmapV1Schema,
  type Theme04HeatmapV1Props,
} from './themes/theme04/heatmap-v1.js';
import {
  Theme04CoverGhostV1,
  theme04CoverGhostV1Meta,
  theme04CoverGhostV1Schema,
  type Theme04CoverGhostV1Props,
} from './themes/theme04/cover-ghost-v1.js';
import {
  Theme04CardsV1,
  theme04CardsV1Meta,
  theme04CardsV1Schema,
  type Theme04CardsV1Props,
} from './themes/theme04/cards-v1.js';
import {
  Theme04GaugesV1,
  theme04GaugesV1Meta,
  theme04GaugesV1Schema,
  type Theme04GaugesV1Props,
} from './themes/theme04/gauges-v1.js';
import {
  Theme04CoverBentoV1,
  theme04CoverBentoV1Meta,
  theme04CoverBentoV1Schema,
  type Theme04CoverBentoV1Props,
} from './themes/theme04/cover-bento-v1.js';
import {
  Theme04CoverMagazineV1,
  theme04CoverMagazineV1Meta,
  theme04CoverMagazineV1Schema,
  type Theme04CoverMagazineV1Props,
} from './themes/theme04/cover-magazine-v1.js';
import {
  Theme04ChapterSplitV1,
  theme04ChapterSplitV1Meta,
  theme04ChapterSplitV1Schema,
  type Theme04ChapterSplitV1Props,
} from './themes/theme04/chapter-split-v1.js';
import {
  Theme04ChapterNumberedV1,
  theme04ChapterNumberedV1Meta,
  theme04ChapterNumberedV1Schema,
  type Theme04ChapterNumberedV1Props,
} from './themes/theme04/chapter-numbered-v1.js';
import {
  Theme04DeltaV1,
  theme04DeltaV1Meta,
  theme04DeltaV1Schema,
  type Theme04DeltaV1Props,
} from './themes/theme04/delta-v1.js';
import {
  Theme04VersusV1,
  theme04VersusV1Meta,
  theme04VersusV1Schema,
  type Theme04VersusV1Props,
} from './themes/theme04/versus-v1.js';
import {
  Theme04TrioV1,
  theme04TrioV1Meta,
  theme04TrioV1Schema,
  type Theme04TrioV1Props,
} from './themes/theme04/trio-v1.js';
import {
  Theme04PolaroidV1,
  theme04PolaroidV1Meta,
  theme04PolaroidV1Schema,
  type Theme04PolaroidV1Props,
} from './themes/theme04/polaroid-v1.js';
import {
  Theme04VerdictV1,
  theme04VerdictV1Meta,
  theme04VerdictV1Schema,
  type Theme04VerdictV1Props,
} from './themes/theme04/verdict-v1.js';
import {
  Theme04TreemapV1,
  theme04TreemapV1Meta,
  theme04TreemapV1Schema,
  type Theme04TreemapV1Props,
} from './themes/theme04/treemap-v1.js';
import {
  Theme04ScoreboardV1,
  theme04ScoreboardV1Meta,
  theme04ScoreboardV1Schema,
  type Theme04ScoreboardV1Props,
} from './themes/theme04/scoreboard-v1.js';
import {
  Theme04ScorecardsV1,
  theme04ScorecardsV1Meta,
  theme04ScorecardsV1Schema,
  type Theme04ScorecardsV1Props,
} from './themes/theme04/scorecards-v1.js';
import {
  Theme04MatrixV1,
  theme04MatrixV1Meta,
  theme04MatrixV1Schema,
  type Theme04MatrixV1Props,
} from './themes/theme04/matrix-v1.js';
import {
  Theme04LayersV1,
  theme04LayersV1Meta,
  theme04LayersV1Schema,
  type Theme04LayersV1Props,
} from './themes/theme04/layers-v1.js';
import {
  Theme04GroupbarsV1,
  theme04GroupbarsV1Meta,
  theme04GroupbarsV1Schema,
  type Theme04GroupbarsV1Props,
} from './themes/theme04/groupbars-v1.js';
import {
  Theme04ScatterV1,
  theme04ScatterV1Meta,
  theme04ScatterV1Schema,
  type Theme04ScatterV1Props,
} from './themes/theme04/scatter-v1.js';
import {
  Theme04SlopeV1,
  theme04SlopeV1Meta,
  theme04SlopeV1Schema,
  type Theme04SlopeV1Props,
} from './themes/theme04/slope-v1.js';
import {
  Theme04WaterfallV1,
  theme04WaterfallV1Meta,
  theme04WaterfallV1Schema,
  type Theme04WaterfallV1Props,
} from './themes/theme04/waterfall-v1.js';
import {
  Theme04RegionV1,
  theme04RegionV1Meta,
  theme04RegionV1Schema,
  type Theme04RegionV1Props,
} from './themes/theme04/region-v1.js';
import {
  Theme04ValuechartV1,
  theme04ValuechartV1Meta,
  theme04ValuechartV1Schema,
  type Theme04ValuechartV1Props,
} from './themes/theme04/valuechart-v1.js';
import {
  Theme04FilmstripV1,
  theme04FilmstripV1Meta,
  theme04FilmstripV1Schema,
  type Theme04FilmstripV1Props,
} from './themes/theme04/filmstrip-v1.js';
import {
  Theme04DiptychV1,
  theme04DiptychV1Meta,
  theme04DiptychV1Schema,
  type Theme04DiptychV1Props,
} from './themes/theme04/diptych-v1.js';
import {
  Theme04VoicesV1,
  theme04VoicesV1Meta,
  theme04VoicesV1Schema,
  type Theme04VoicesV1Props,
} from './themes/theme04/voices-v1.js';
import {
  Theme04AnnotatedV1,
  theme04AnnotatedV1Meta,
  theme04AnnotatedV1Schema,
  type Theme04AnnotatedV1Props,
} from './themes/theme04/annotated-v1.js';
import {
  Theme04ImagestoryV1,
  theme04ImagestoryV1Meta,
  theme04ImagestoryV1Schema,
  type Theme04ImagestoryV1Props,
} from './themes/theme04/imagestory-v1.js';
import {
  Theme04DumbbellV1,
  theme04DumbbellV1Meta,
  theme04DumbbellV1Schema,
  type Theme04DumbbellV1Props,
} from './themes/theme04/dumbbell-v1.js';
import {
  Theme04PyramidV1,
  theme04PyramidV1Meta,
  theme04PyramidV1Schema,
  type Theme04PyramidV1Props,
} from './themes/theme04/pyramid-v1.js';
import {
  Theme04RiskchainV1,
  theme04RiskchainV1Meta,
  theme04RiskchainV1Schema,
  type Theme04RiskchainV1Props,
} from './themes/theme04/riskchain-v1.js';
import {
  Theme04MetroV1,
  theme04MetroV1Meta,
  theme04MetroV1Schema,
  type Theme04MetroV1Props,
} from './themes/theme04/metro-v1.js';
import {
  Theme04ShowcaseV1,
  theme04ShowcaseV1Meta,
  theme04ShowcaseV1Schema,
  type Theme04ShowcaseV1Props,
} from './themes/theme04/showcase-v1.js';
import {
  Theme04CoverHeroV1,
  theme04CoverHeroV1Meta,
  theme04CoverHeroV1Schema,
  type Theme04CoverHeroV1Props,
} from './themes/theme04/cover-hero-v1.js';
import {
  Theme04MonthchartV1,
  theme04MonthchartV1Meta,
  theme04MonthchartV1Schema,
  type Theme04MonthchartV1Props,
} from './themes/theme04/monthchart-v1.js';
import {
  Theme04StackedV1,
  theme04StackedV1Meta,
  theme04StackedV1Schema,
  type Theme04StackedV1Props,
} from './themes/theme04/stacked-v1.js';
import {
  Theme04CalendarV1,
  theme04CalendarV1Meta,
  theme04CalendarV1Schema,
  type Theme04CalendarV1Props,
} from './themes/theme04/calendar-v1.js';
import {
  Theme04QuartertableV1,
  theme04QuartertableV1Meta,
  theme04QuartertableV1Schema,
  type Theme04QuartertableV1Props,
} from './themes/theme04/quartertable-v1.js';
import {
  Theme04SpreadV1,
  theme04SpreadV1Meta,
  theme04SpreadV1Schema,
  type Theme04SpreadV1Props,
} from './themes/theme04/spread-v1.js';
import {
  Theme04ChaintableV1,
  theme04ChaintableV1Meta,
  theme04ChaintableV1Schema,
  type Theme04ChaintableV1Props,
} from './themes/theme04/chaintable-v1.js';
import {
  Theme04ChainflowV1,
  theme04ChainflowV1Meta,
  theme04ChainflowV1Schema,
  type Theme04ChainflowV1Props,
} from './themes/theme04/chainflow-v1.js';
import {
  Theme04LedgerV1,
  theme04LedgerV1Meta,
  theme04LedgerV1Schema,
  type Theme04LedgerV1Props,
} from './themes/theme04/ledger-v1.js';
import {
  Theme05ChapterV1,
  theme05ChapterV1Meta,
  theme05ChapterV1Schema,
  type Theme05ChapterV1Props,
} from './themes/theme05/chapter-v1.js';
import {
  Theme05ChartV1,
  theme05ChartV1Meta,
  theme05ChartV1Schema,
  type Theme05ChartV1Props,
} from './themes/theme05/chart-v1.js';
import {
  Theme05ClosingV1,
  theme05ClosingV1Meta,
  theme05ClosingV1Schema,
  type Theme05ClosingV1Props,
} from './themes/theme05/closing-v1.js';
import {
  Theme05ContentV1,
  theme05ContentV1Meta,
  theme05ContentV1Schema,
  type Theme05ContentV1Props,
} from './themes/theme05/content-v1.js';
import {
  Theme05CoverV1,
  theme05CoverV1Meta,
  theme05CoverV1Schema,
  type Theme05CoverV1Props,
} from './themes/theme05/cover-v1.js';
import {
  Theme05HeatmapV1,
  theme05HeatmapV1Meta,
  theme05HeatmapV1Schema,
  type Theme05HeatmapV1Props,
} from './themes/theme05/heatmap-v1.js';
import {
  Theme05ImageV1,
  theme05ImageV1Meta,
  theme05ImageV1Schema,
  type Theme05ImageV1Props,
} from './themes/theme05/image-v1.js';
import {
  Theme05MatrixV1,
  theme05MatrixV1Meta,
  theme05MatrixV1Schema,
  type Theme05MatrixV1Props,
} from './themes/theme05/matrix-v1.js';
import {
  Theme05MetricV1,
  theme05MetricV1Meta,
  theme05MetricV1Schema,
  type Theme05MetricV1Props,
} from './themes/theme05/metric-v1.js';
import {
  Theme05BubbleV1,
  theme05BubbleV1Meta,
  theme05BubbleV1Schema,
  type Theme05BubbleV1Props,
} from './themes/theme05/bubble-v1.js';
import {
  Theme05MapV1,
  theme05MapV1Meta,
  theme05MapV1Schema,
  type Theme05MapV1Props,
} from './themes/theme05/map-v1.js';
import {
  Theme05ProcessV1,
  theme05ProcessV1Meta,
  theme05ProcessV1Schema,
  type Theme05ProcessV1Props,
} from './themes/theme05/process-v1.js';
import {
  Theme05QuoteV1,
  theme05QuoteV1Meta,
  theme05QuoteV1Schema,
  type Theme05QuoteV1Props,
} from './themes/theme05/quote-v1.js';
import {
  Theme05QuadrantV1,
  theme05QuadrantV1Meta,
  theme05QuadrantV1Schema,
  type Theme05QuadrantV1Props,
} from './themes/theme05/quadrant-v1.js';
import {
  Theme05RankV1,
  theme05RankV1Meta,
  theme05RankV1Schema,
  type Theme05RankV1Props,
} from './themes/theme05/rank-v1.js';
import {
  Theme05DonutV1,
  theme05DonutV1Meta,
  theme05DonutV1Schema,
  type Theme05DonutV1Props,
} from './themes/theme05/donut-v1.js';
import {
  Theme05RadarV1,
  theme05RadarV1Meta,
  theme05RadarV1Schema,
  type Theme05RadarV1Props,
} from './themes/theme05/radar-v1.js';
import {
  Theme05RiskV1,
  theme05RiskV1Meta,
  theme05RiskV1Schema,
  type Theme05RiskV1Props,
} from './themes/theme05/risk-v1.js';
import {
  Theme05TableOfContentsV1,
  theme05TableOfContentsV1Meta,
  theme05TableOfContentsV1Schema,
  type Theme05TableOfContentsV1Props,
} from './themes/theme05/table-of-contents-v1.js';
import {
  Theme05TreemapV1,
  theme05TreemapV1Meta,
  theme05TreemapV1Schema,
  type Theme05TreemapV1Props,
} from './themes/theme05/treemap-v1.js';
import {
  Theme05TimelineV1,
  theme05TimelineV1Meta,
  theme05TimelineV1Schema,
  type Theme05TimelineV1Props,
} from './themes/theme05/timeline-v1.js';
import {
  Theme05VersusV1,
  theme05VersusV1Meta,
  theme05VersusV1Schema,
  type Theme05VersusV1Props,
} from './themes/theme05/versus-v1.js';
import {
  Theme05WaterfallV1,
  theme05WaterfallV1Meta,
  theme05WaterfallV1Schema,
  type Theme05WaterfallV1Props,
} from './themes/theme05/waterfall-v1.js';
import {
  Theme05ScorecardsV1,
  theme05ScorecardsV1Meta,
  theme05ScorecardsV1Schema,
  type Theme05ScorecardsV1Props,
} from './themes/theme05/scorecards-v1.js';
import {
  Theme05ProfileV1,
  theme05ProfileV1Meta,
  theme05ProfileV1Schema,
  type Theme05ProfileV1Props,
} from './themes/theme05/profile-v1.js';
import {
  Theme05CaseV1,
  theme05CaseV1Meta,
  theme05CaseV1Schema,
  type Theme05CaseV1Props,
} from './themes/theme05/case-v1.js';
import {
  Theme05BentoV1,
  theme05BentoV1Meta,
  theme05BentoV1Schema,
  type Theme05BentoV1Props,
} from './themes/theme05/bento-v1.js';
import {
  Theme05GalleryV1,
  theme05GalleryV1Meta,
  theme05GalleryV1Schema,
  type Theme05GalleryV1Props,
} from './themes/theme05/gallery-v1.js';
import {
  Theme05RoadmapV1,
  theme05RoadmapV1Meta,
  theme05RoadmapV1Schema,
  type Theme05RoadmapV1Props,
} from './themes/theme05/roadmap-v1.js';
import {
  Theme05EditorialV1,
  theme05EditorialV1Meta,
  theme05EditorialV1Schema,
  type Theme05EditorialV1Props,
} from './themes/theme05/editorial-v1.js';
import {
  Theme05CoverExV1,
  theme05CoverExV1Meta,
  theme05CoverExV1Schema,
  type Theme05CoverExV1Props,
} from './themes/theme05/cover-ex-v1.js';
import {
  Theme05CoverExV2,
  theme05CoverExV2Meta,
  theme05CoverExV2Schema,
  type Theme05CoverExV2Props,
} from './themes/theme05/cover-ex-v2.js';
import {
  Theme05CoverHeroV1,
  theme05CoverHeroV1Meta,
  theme05CoverHeroV1Schema,
  type Theme05CoverHeroV1Props,
} from './themes/theme05/cover-hero-v1.js';
import {
  Theme05ChapterBigV1,
  theme05ChapterBigV1Meta,
  theme05ChapterBigV1Schema,
  type Theme05ChapterBigV1Props,
} from './themes/theme05/chapter-big-v1.js';
import {
  Theme05ChapterSplitV1,
  theme05ChapterSplitV1Meta,
  theme05ChapterSplitV1Schema,
  type Theme05ChapterSplitV1Props,
} from './themes/theme05/chapter-split-v1.js';
import {
  Theme05ChapterNumberedV1,
  theme05ChapterNumberedV1Meta,
  theme05ChapterNumberedV1Schema,
  type Theme05ChapterNumberedV1Props,
} from './themes/theme05/chapter-numbered-v1.js';
import {
  Theme05ChapterImageV1,
  theme05ChapterImageV1Meta,
  theme05ChapterImageV1Schema,
  type Theme05ChapterImageV1Props,
} from './themes/theme05/chapter-image-v1.js';
import {
  Theme05MetricHeroV1,
  theme05MetricHeroV1Meta,
  theme05MetricHeroV1Schema,
  type Theme05MetricHeroV1Props,
} from './themes/theme05/metric-hero-v1.js';
import {
  Theme05MetricDeltaV1,
  theme05MetricDeltaV1Meta,
  theme05MetricDeltaV1Schema,
  type Theme05MetricDeltaV1Props,
} from './themes/theme05/metric-delta-v1.js';
import {
  Theme05MetricCapacityV1,
  theme05MetricCapacityV1Meta,
  theme05MetricCapacityV1Schema,
  type Theme05MetricCapacityV1Props,
} from './themes/theme05/metric-capacity-v1.js';
import {
  Theme05ChartShareV1,
  theme05ChartShareV1Meta,
  theme05ChartShareV1Schema,
  type Theme05ChartShareV1Props,
} from './themes/theme05/chart-share-v1.js';
import {
  Theme05ChartStackedV1,
  theme05ChartStackedV1Meta,
  theme05ChartStackedV1Schema,
  type Theme05ChartStackedV1Props,
} from './themes/theme05/chart-stacked-v1.js';
import {
  Theme05ChartCurveV1,
  theme05ChartCurveV1Meta,
  theme05ChartCurveV1Schema,
  type Theme05ChartCurveV1Props,
} from './themes/theme05/chart-curve-v1.js';
import {
  Theme05ChartPeakV1,
  theme05ChartPeakV1Meta,
  theme05ChartPeakV1Schema,
  type Theme05ChartPeakV1Props,
} from './themes/theme05/chart-peak-v1.js';
import {
  Theme05ChartPeaktroughV1,
  theme05ChartPeaktroughV1Meta,
  theme05ChartPeaktroughV1Schema,
  type Theme05ChartPeaktroughV1Props,
} from './themes/theme05/chart-peaktrough-v1.js';
import {
  Theme05ChartCumulativeV1,
  theme05ChartCumulativeV1Meta,
  theme05ChartCumulativeV1Schema,
  type Theme05ChartCumulativeV1Props,
} from './themes/theme05/chart-cumulative-v1.js';
import {
  Theme05TableOfContentsV2,
  theme05TableOfContentsV2Meta,
  theme05TableOfContentsV2Schema,
  type Theme05TableOfContentsV2Props,
} from './themes/theme05/table-of-contents-v2.js';
import {
  Theme05ProcessV2,
  theme05ProcessV2Meta,
  theme05ProcessV2Schema,
  type Theme05ProcessV2Props,
} from './themes/theme05/process-v2.js';
import {
  Theme05ComparisonV1,
  theme05ComparisonV1Meta,
  theme05ComparisonV1Schema,
  type Theme05ComparisonV1Props,
} from './themes/theme05/comparison-v1.js';
import {
  Theme05ChartFunnelV1,
  theme05ChartFunnelV1Meta,
  theme05ChartFunnelV1Schema,
  type Theme05ChartFunnelV1Props,
} from './themes/theme05/chart-funnel-v1.js';
import {
  Theme05QuoteV2,
  theme05QuoteV2Meta,
  theme05QuoteV2Schema,
  type Theme05QuoteV2Props,
} from './themes/theme05/quote-v2.js';
import {
  Theme05ChartGaugeV1,
  theme05ChartGaugeV1Meta,
  theme05ChartGaugeV1Schema,
  type Theme05ChartGaugeV1Props,
} from './themes/theme05/chart-gauge-v1.js';
import {
  Theme06CoverV1,
  theme06CoverV1Meta,
  theme06CoverV1Schema,
  type Theme06CoverV1Props,
} from './themes/theme06/cover-v1.js';
import {
  Theme06ChapterV1,
  theme06ChapterV1Meta,
  theme06ChapterV1Schema,
  type Theme06ChapterV1Props,
} from './themes/theme06/chapter-v1.js';
import {
  Theme06ContentV1,
  theme06ContentV1Meta,
  theme06ContentV1Schema,
  type Theme06ContentV1Props,
} from './themes/theme06/content-v1.js';
import {
  Theme06ContentNumberedV1,
  theme06ContentNumberedV1Meta,
  theme06ContentNumberedV1Schema,
  type Theme06ContentNumberedV1Props,
} from './themes/theme06/content-numbered-v1.js';
import {
  Theme06MetricHeroV1,
  theme06MetricHeroV1Meta,
  theme06MetricHeroV1Schema,
  type Theme06MetricHeroV1Props,
} from './themes/theme06/metric-hero-v1.js';
import {
  Theme06VerticalBarV1,
  theme06VerticalBarV1Meta,
  theme06VerticalBarV1Schema,
  type Theme06VerticalBarV1Props,
} from './themes/theme06/vertical-bar-v1.js';
import {
  Theme06ChartV1,
  theme06ChartV1Meta,
  theme06ChartV1Schema,
  type Theme06ChartV1Props,
} from './themes/theme06/chart-v1.js';
import {
  Theme06QuoteV1,
  theme06QuoteV1Meta,
  theme06QuoteV1Schema,
  type Theme06QuoteV1Props,
} from './themes/theme06/quote-v1.js';
import {
  Theme06MetricGridV1,
  theme06MetricGridV1Meta,
  theme06MetricGridV1Schema,
  type Theme06MetricGridV1Props,
} from './themes/theme06/metric-grid-v1.js';
import {
  Theme06RankV1,
  theme06RankV1Meta,
  theme06RankV1Schema,
  type Theme06RankV1Props,
} from './themes/theme06/rank-v1.js';
import {
  Theme06MatrixV1,
  theme06MatrixV1Meta,
  theme06MatrixV1Schema,
  type Theme06MatrixV1Props,
} from './themes/theme06/matrix-v1.js';
import {
  Theme06ChartRadarV1,
  theme06ChartRadarV1Meta,
  theme06ChartRadarV1Schema,
  type Theme06ChartRadarV1Props,
} from './themes/theme06/chart-radar-v1.js';
import {
  Theme06ChartWaterfallV1,
  theme06ChartWaterfallV1Meta,
  theme06ChartWaterfallV1Schema,
  type Theme06ChartWaterfallV1Props,
} from './themes/theme06/chart-waterfall-v1.js';
import {
  Theme06ChartPeakV1,
  theme06ChartPeakV1Meta,
  theme06ChartPeakV1Schema,
  type Theme06ChartPeakV1Props,
} from './themes/theme06/chart-peak-v1.js';
import {
  Theme06ProcessV1,
  theme06ProcessV1Meta,
  theme06ProcessV1Schema,
  type Theme06ProcessV1Props,
} from './themes/theme06/process-v1.js';
import {
  Theme06TimelineV1,
  theme06TimelineV1Meta,
  theme06TimelineV1Schema,
  type Theme06TimelineV1Props,
} from './themes/theme06/timeline-v1.js';
import {
  Theme06CaseV1,
  theme06CaseV1Meta,
  theme06CaseV1Schema,
  type Theme06CaseV1Props,
} from './themes/theme06/case-v1.js';
import {
  Theme06CaseV2,
  theme06CaseV2Meta,
  theme06CaseV2Schema,
  type Theme06CaseV2Props,
} from './themes/theme06/case-v2.js';
import {
  Theme06RiskV1,
  theme06RiskV1Meta,
  theme06RiskV1Schema,
  type Theme06RiskV1Props,
} from './themes/theme06/risk-v1.js';
import {
  Theme06RiskV2,
  theme06RiskV2Meta,
  theme06RiskV2Schema,
  type Theme06RiskV2Props,
} from './themes/theme06/risk-v2.js';
import {
  Theme06ChartGraphV1,
  theme06ChartGraphV1Meta,
  theme06ChartGraphV1Schema,
  type Theme06ChartGraphV1Props,
} from './themes/theme06/chart-graph-v1.js';
import {
  Theme06MapV1,
  theme06MapV1Meta,
  theme06MapV1Schema,
  type Theme06MapV1Props,
} from './themes/theme06/map-v1.js';
import {
  Theme06TableOfContentsV1,
  theme06TableOfContentsV1Meta,
  theme06TableOfContentsV1Schema,
  type Theme06TableOfContentsV1Props,
} from './themes/theme06/table-of-contents-v1.js';
import {
  Theme06SummaryV1,
  theme06SummaryV1Meta,
  theme06SummaryV1Schema,
  type Theme06SummaryV1Props,
} from './themes/theme06/summary-v1.js';
import {
  Theme06ClosingV1,
  theme06ClosingV1Meta,
  theme06ClosingV1Schema,
  type Theme06ClosingV1Props,
} from './themes/theme06/closing-v1.js';
import {
  Theme06SourcesV1,
  theme06SourcesV1Meta,
  theme06SourcesV1Schema,
  type Theme06SourcesV1Props,
} from './themes/theme06/sources-v1.js';
import {
  Theme06ChartHeatmapV1,
  theme06ChartHeatmapV1Meta,
  theme06ChartHeatmapV1Schema,
  type Theme06ChartHeatmapV1Props,
} from './themes/theme06/chart-heatmap-v1.js';
import {
  Theme06BentoV1,
  theme06BentoV1Meta,
  theme06BentoV1Schema,
  type Theme06BentoV1Props,
} from './themes/theme06/bento-v1.js';
import {
  Theme06ComparisonV1,
  theme06ComparisonV1Meta,
  theme06ComparisonV1Schema,
  type Theme06ComparisonV1Props,
} from './themes/theme06/comparison-v1.js';
import {
  Theme06SectorSpotlightV1,
  theme06SectorSpotlightV1Meta,
  theme06SectorSpotlightV1Schema,
  type Theme06SectorSpotlightV1Props,
} from './themes/theme06/sector-spotlight-v1.js';
import {
  Theme06TechLandscapeV1,
  theme06TechLandscapeV1Meta,
  theme06TechLandscapeV1Schema,
  type Theme06TechLandscapeV1Props,
} from './themes/theme06/tech-landscape-v1.js';
import {
  Theme06CompanyProfileV1,
  theme06CompanyProfileV1Meta,
  theme06CompanyProfileV1Schema,
  type Theme06CompanyProfileV1Props,
} from './themes/theme06/company-profile-v1.js';
import {
  Theme06ChainFlowV1,
  theme06ChainFlowV1Meta,
  theme06ChainFlowV1Schema,
  type Theme06ChainFlowV1Props,
} from './themes/theme06/chain-flow-v1.js';
import {
  Theme06QuarterTableV1,
  theme06QuarterTableV1Meta,
  theme06QuarterTableV1Schema,
  type Theme06QuarterTableV1Props,
} from './themes/theme06/quarter-table-v1.js';
import {
  Theme06MetricShowcaseV1,
  theme06MetricShowcaseV1Meta,
  theme06MetricShowcaseV1Schema,
  type Theme06MetricShowcaseV1Props,
} from './themes/theme06/metric-showcase-v1.js';
import {
  Theme06MilestoneV1,
  theme06MilestoneV1Meta,
  theme06MilestoneV1Schema,
  type Theme06MilestoneV1Props,
} from './themes/theme06/milestone-v1.js';
import {
  Theme06RiskMatrixV1,
  theme06RiskMatrixV1Meta,
  theme06RiskMatrixV1Schema,
  type Theme06RiskMatrixV1Props,
} from './themes/theme06/risk-matrix-v1.js';
import {
  Theme06SectorComparisonV1,
  theme06SectorComparisonV1Meta,
  theme06SectorComparisonV1Schema,
  type Theme06SectorComparisonV1Props,
} from './themes/theme06/sector-comparison-v1.js';
import {
  Theme06GeoDistributionV1,
  theme06GeoDistributionV1Meta,
  theme06GeoDistributionV1Schema,
  type Theme06GeoDistributionV1Props,
} from './themes/theme06/geo-distribution-v1.js';
import {
  Theme06GeoHeatmapV1,
  theme06GeoHeatmapV1Meta,
  theme06GeoHeatmapV1Schema,
  type Theme06GeoHeatmapV1Props,
} from './themes/theme06/geo-heatmap-v1.js';
import {
  Theme06EcosystemGraphV1,
  theme06EcosystemGraphV1Meta,
  theme06EcosystemGraphV1Schema,
  type Theme06EcosystemGraphV1Props,
} from './themes/theme06/ecosystem-graph-v1.js';
import {
  Theme06CoverProductV1,
  theme06CoverProductV1Meta,
  theme06CoverProductV1Schema,
  type Theme06CoverProductV1Props,
} from './themes/theme06/cover-product-v1.js';
import {
  Theme06CoverBusinessV1,
  theme06CoverBusinessV1Meta,
  theme06CoverBusinessV1Schema,
  type Theme06CoverBusinessV1Props,
} from './themes/theme06/cover-business-v1.js';
import {
  Theme06ChapterNumberedV1,
  theme06ChapterNumberedV1Meta,
  theme06ChapterNumberedV1Schema,
  type Theme06ChapterNumberedV1Props,
} from './themes/theme06/chapter-numbered-v1.js';
import {
  Theme06ChapterSplitV1,
  theme06ChapterSplitV1Meta,
  theme06ChapterSplitV1Schema,
  type Theme06ChapterSplitV1Props,
} from './themes/theme06/chapter-split-v1.js';
import {
  Theme06TrendV1,
  theme06TrendV1Meta,
  theme06TrendV1Schema,
  type Theme06TrendV1Props,
} from './themes/theme06/trend-v1.js';
import {
  Theme06CumulativeV1,
  theme06CumulativeV1Meta,
  theme06CumulativeV1Schema,
  type Theme06CumulativeV1Props,
} from './themes/theme06/cumulative-v1.js';
import {
  Theme06QuadrantV1,
  theme06QuadrantV1Meta,
  theme06QuadrantV1Schema,
  type Theme06QuadrantV1Props,
} from './themes/theme06/quadrant-v1.js';
import {
  Theme06OutlookV1,
  theme06OutlookV1Meta,
  theme06OutlookV1Schema,
  type Theme06OutlookV1Props,
} from './themes/theme06/outlook-v1.js';
import {
  Theme06RecapV1,
  theme06RecapV1Meta,
  theme06RecapV1Schema,
  type Theme06RecapV1Props,
} from './themes/theme06/recap-v1.js';
import {
  Theme06CompanyRoundsV1,
  theme06CompanyRoundsV1Meta,
  theme06CompanyRoundsV1Schema,
  type Theme06CompanyRoundsV1Props,
} from './themes/theme06/company-rounds-v1.js';
import {
  Theme06CompanyInvestorsV1,
  theme06CompanyInvestorsV1Meta,
  theme06CompanyInvestorsV1Schema,
  type Theme06CompanyInvestorsV1Props,
} from './themes/theme06/company-investors-v1.js';
import {
  Theme06CompanyComparisonV1,
  theme06CompanyComparisonV1Meta,
  theme06CompanyComparisonV1Schema,
  type Theme06CompanyComparisonV1Props,
} from './themes/theme06/company-comparison-v1.js';
import {
  Theme06GeoCitiesV1,
  theme06GeoCitiesV1Meta,
  theme06GeoCitiesV1Schema,
  type Theme06GeoCitiesV1Props,
} from './themes/theme06/geo-cities-v1.js';
import {
  Theme06AgentV1,
  theme06AgentV1Meta,
  theme06AgentV1Schema,
  type Theme06AgentV1Props,
} from './themes/theme06/agent-v1.js';
import {
  Theme06SearchV1,
  theme06SearchV1Meta,
  theme06SearchV1Schema,
  type Theme06SearchV1Props,
} from './themes/theme06/search-v1.js';
import {
  Theme06CoverManufacturingV1,
  theme06CoverManufacturingV1Meta,
  theme06CoverManufacturingV1Schema,
  type Theme06CoverManufacturingV1Props,
} from './themes/theme06/cover-manufacturing-v1.js';
import {
  Theme06CoverBrandV1,
  theme06CoverBrandV1Meta,
  theme06CoverBrandV1Schema,
  type Theme06CoverBrandV1Props,
} from './themes/theme06/cover-brand-v1.js';
import {
  Theme06MethodV1,
  theme06MethodV1Meta,
  theme06MethodV1Schema,
  type Theme06MethodV1Props,
} from './themes/theme06/method-v1.js';
import {
  Theme06QuarterQ1V1,
  theme06QuarterQ1V1Meta,
  theme06QuarterQ1V1Schema,
  type Theme06QuarterQ1V1Props,
} from './themes/theme06/quarter-q1-v1.js';
import {
  Theme06QuarterQ2V1,
  theme06QuarterQ2V1Meta,
  theme06QuarterQ2V1Schema,
  type Theme06QuarterQ2V1Props,
} from './themes/theme06/quarter-q2-v1.js';
import {
  Theme06QuarterQ3V1,
  theme06QuarterQ3V1Meta,
  theme06QuarterQ3V1Schema,
  type Theme06QuarterQ3V1Props,
} from './themes/theme06/quarter-q3-v1.js';
import {
  Theme06QuarterQ4V1,
  theme06QuarterQ4V1Meta,
  theme06QuarterQ4V1Schema,
  type Theme06QuarterQ4V1Props,
} from './themes/theme06/quarter-q4-v1.js';
import {
  Theme06BigNumberV1,
  theme06BigNumberV1Meta,
  theme06BigNumberV1Schema,
  type Theme06BigNumberV1Props,
} from './themes/theme06/big-number-v1.js';
import {
  Theme06ChapterFocusV1,
  theme06ChapterFocusV1Meta,
  theme06ChapterFocusV1Schema,
  type Theme06ChapterFocusV1Props,
} from './themes/theme06/chapter-focus-v1.js';
import {
  Theme06ChapterImageV1,
  theme06ChapterImageV1Meta,
  theme06ChapterImageV1Schema,
  type Theme06ChapterImageV1Props,
} from './themes/theme06/chapter-image-v1.js';
import {
  Theme06ChapterMinimalV1,
  theme06ChapterMinimalV1Meta,
  theme06ChapterMinimalV1Schema,
  type Theme06ChapterMinimalV1Props,
} from './themes/theme06/chapter-minimal-v1.js';
import {
  Theme06DealMapV1,
  theme06DealMapV1Meta,
  theme06DealMapV1Schema,
  type Theme06DealMapV1Props,
} from './themes/theme06/deal-map-v1.js';
import {
  Theme06SizeSplitV1,
  theme06SizeSplitV1Meta,
  theme06SizeSplitV1Schema,
  type Theme06SizeSplitV1Props,
} from './themes/theme06/size-split-v1.js';
import {
  Theme06TriadV1,
  theme06TriadV1Meta,
  theme06TriadV1Schema,
  type Theme06TriadV1Props,
} from './themes/theme06/triad-v1.js';
import {
  Theme06CapitalFlowV1,
  theme06CapitalFlowV1Meta,
  theme06CapitalFlowV1Schema,
  type Theme06CapitalFlowV1Props,
} from './themes/theme06/capital-flow-v1.js';
import {
  Theme06LegalV1,
  theme06LegalV1Meta,
  theme06LegalV1Schema,
  type Theme06LegalV1Props,
} from './themes/theme06/legal-v1.js';
import {
  Theme06OpenRiskV1,
  theme06OpenRiskV1Meta,
  theme06OpenRiskV1Schema,
  type Theme06OpenRiskV1Props,
} from './themes/theme06/open-risk-v1.js';
import {
  Theme06RegionRiskV1,
  theme06RegionRiskV1Meta,
  theme06RegionRiskV1Schema,
  type Theme06RegionRiskV1Props,
} from './themes/theme06/region-risk-v1.js';
import {
  Theme06RevenueRiskV1,
  theme06RevenueRiskV1Meta,
  theme06RevenueRiskV1Schema,
  type Theme06RevenueRiskV1Props,
} from './themes/theme06/revenue-risk-v1.js';
import {
  Theme06AvgTicketV1,
  theme06AvgTicketV1Meta,
  theme06AvgTicketV1Schema,
  type Theme06AvgTicketV1Props,
} from './themes/theme06/avg-ticket-v1.js';
import {
  Theme06IndustryVerticalV1,
  theme06IndustryVerticalV1Meta,
  theme06IndustryVerticalV1Schema,
  type Theme06IndustryVerticalV1Props,
} from './themes/theme06/industry-vertical-v1.js';
import {
  Theme06IndustryFinanceV1,
  theme06IndustryFinanceV1Meta,
  theme06IndustryFinanceV1Schema,
  type Theme06IndustryFinanceV1Props,
} from './themes/theme06/industry-finance-v1.js';
import {
  Theme06IndustryGrowthV1,
  theme06IndustryGrowthV1Meta,
  theme06IndustryGrowthV1Schema,
  type Theme06IndustryGrowthV1Props,
} from './themes/theme06/industry-growth-v1.js';
import {
  Theme06IndustryInfrastructureV1,
  theme06IndustryInfrastructureV1Meta,
  theme06IndustryInfrastructureV1Schema,
  type Theme06IndustryInfrastructureV1Props,
} from './themes/theme06/industry-infrastructure-v1.js';
import {
  Theme06IndustrySafetyV1,
  theme06IndustrySafetyV1Meta,
  theme06IndustrySafetyV1Schema,
  type Theme06IndustrySafetyV1Props,
} from './themes/theme06/industry-safety-v1.js';
import {
  Theme06CompanySpotlightV1,
  theme06CompanySpotlightV1Meta,
  theme06CompanySpotlightV1Schema,
  type Theme06CompanySpotlightV1Props,
} from './themes/theme06/company-spotlight-v1.js';
import {
  Theme06IpoWatchV1,
  theme06IpoWatchV1Meta,
  theme06IpoWatchV1Schema,
  type Theme06IpoWatchV1Props,
} from './themes/theme06/ipo-watch-v1.js';
import {
  Theme06StatementV1,
  theme06StatementV1Meta,
  theme06StatementV1Schema,
  type Theme06StatementV1Props,
} from './themes/theme06/statement-v1.js';
import {
  Theme06AllianceV1,
  theme06AllianceV1Meta,
  theme06AllianceV1Schema,
  type Theme06AllianceV1Props,
} from './themes/theme06/alliance-v1.js';
import {
  Theme06ComputeV1,
  theme06ComputeV1Meta,
  theme06ComputeV1Schema,
  type Theme06ComputeV1Props,
} from './themes/theme06/compute-v1.js';
import {
  Theme06DealStructureV1,
  theme06DealStructureV1Meta,
  theme06DealStructureV1Schema,
  type Theme06DealStructureV1Props,
} from './themes/theme06/deal-structure-v1.js';
import {
  Theme06MegadealsV1,
  theme06MegadealsV1Meta,
  theme06MegadealsV1Schema,
  type Theme06MegadealsV1Props,
} from './themes/theme06/megadeals-v1.js';
import {
  Theme08CoverV1,
  theme08CoverV1Meta,
  theme08CoverV1Schema,
  type Theme08CoverV1Props,
} from './themes/theme08/cover-v1.js';
import {
  Theme08ChapterV1,
  theme08ChapterV1Meta,
  theme08ChapterV1Schema,
  type Theme08ChapterV1Props,
} from './themes/theme08/chapter-v1.js';
import {
  Theme08OverviewV1,
  theme08OverviewV1Meta,
  theme08OverviewV1Schema,
  type Theme08OverviewV1Props,
} from './themes/theme08/overview-v1.js';
import {
  Theme08ContentsV1,
  theme08ContentsV1Meta,
  theme08ContentsV1Schema,
  type Theme08ContentsV1Props,
} from './themes/theme08/contents-v1.js';
import {
  Theme08ContentV1,
  theme08ContentV1Meta,
  theme08ContentV1Schema,
  type Theme08ContentV1Props,
} from './themes/theme08/content-v1.js';
import {
  Theme08QuoteV1,
  theme08QuoteV1Meta,
  theme08QuoteV1Schema,
  type Theme08QuoteV1Props,
} from './themes/theme08/quote-v1.js';
import {
  Theme08FeatureV1,
  theme08FeatureV1Meta,
  theme08FeatureV1Schema,
  type Theme08FeatureV1Props,
} from './themes/theme08/feature-v1.js';
import {
  Theme08MetricsV1,
  theme08MetricsV1Meta,
  theme08MetricsV1Schema,
  type Theme08MetricsV1Props,
} from './themes/theme08/metrics-v1.js';
import {
  Theme08MetricBigV1,
  theme08MetricBigV1Meta,
  theme08MetricBigV1Schema,
  type Theme08MetricBigV1Props,
} from './themes/theme08/metric-big-v1.js';
import {
  Theme08CaseV1,
  theme08CaseV1Meta,
  theme08CaseV1Schema,
  type Theme08CaseV1Props,
} from './themes/theme08/case-v1.js';
import {
  Theme08CompareV1,
  theme08CompareV1Meta,
  theme08CompareV1Schema,
  type Theme08CompareV1Props,
} from './themes/theme08/compare-v1.js';
import {
  Theme08RankingV1,
  theme08RankingV1Meta,
  theme08RankingV1Schema,
  type Theme08RankingV1Props,
} from './themes/theme08/ranking-v1.js';
import {
  Theme08TableV1,
  theme08TableV1Meta,
  theme08TableV1Schema,
  type Theme08TableV1Props,
} from './themes/theme08/table-v1.js';
import {
  Theme08TimelineV1,
  theme08TimelineV1Meta,
  theme08TimelineV1Schema,
  type Theme08TimelineV1Props,
} from './themes/theme08/timeline-v1.js';
import {
  Theme08ProcessV1,
  theme08ProcessV1Meta,
  theme08ProcessV1Schema,
  type Theme08ProcessV1Props,
} from './themes/theme08/process-v1.js';
import {
  Theme08RoadmapV1,
  theme08RoadmapV1Meta,
  theme08RoadmapV1Schema,
  type Theme08RoadmapV1Props,
} from './themes/theme08/roadmap-v1.js';
import {
  Theme08StrategyV1,
  theme08StrategyV1Meta,
  theme08StrategyV1Schema,
  type Theme08StrategyV1Props,
} from './themes/theme08/strategy-v1.js';
import {
  Theme08QuadrantV1,
  theme08QuadrantV1Meta,
  theme08QuadrantV1Schema,
  type Theme08QuadrantV1Props,
} from './themes/theme08/quadrant-v1.js';
import {
  Theme08ChartBarV1,
  theme08ChartBarV1Meta,
  theme08ChartBarV1Schema,
  type Theme08ChartBarV1Props,
} from './themes/theme08/chart-bar-v1.js';
import {
  Theme08ChartDonutV1,
  theme08ChartDonutV1Meta,
  theme08ChartDonutV1Schema,
  type Theme08ChartDonutV1Props,
} from './themes/theme08/chart-donut-v1.js';
import {
  Theme08RegionV1,
  theme08RegionV1Meta,
  theme08RegionV1Schema,
  type Theme08RegionV1Props,
} from './themes/theme08/region-v1.js';
import {
  Theme08GalleryV1,
  theme08GalleryV1Meta,
  theme08GalleryV1Schema,
  type Theme08GalleryV1Props,
} from './themes/theme08/gallery-v1.js';
import {
  Theme08CollageV1,
  theme08CollageV1Meta,
  theme08CollageV1Schema,
  type Theme08CollageV1Props,
} from './themes/theme08/collage-v1.js';
import {
  Theme08TeamV1,
  theme08TeamV1Meta,
  theme08TeamV1Schema,
  type Theme08TeamV1Props,
} from './themes/theme08/team-v1.js';
import {
  Theme08PartnersV1,
  theme08PartnersV1Meta,
  theme08PartnersV1Schema,
  type Theme08PartnersV1Props,
} from './themes/theme08/partners-v1.js';
import {
  Theme08ClosingV1,
  theme08ClosingV1Meta,
  theme08ClosingV1Schema,
  type Theme08ClosingV1Props,
} from './themes/theme08/closing-v1.js';
import {
  Theme08RangeV1,
  theme08RangeV1Meta,
  theme08RangeV1Schema,
  type Theme08RangeV1Props,
} from './themes/theme08/range-v1.js';
import {
  Theme08ScorecardV1,
  theme08ScorecardV1Meta,
  theme08ScorecardV1Schema,
  type Theme08ScorecardV1Props,
} from './themes/theme08/scorecard-v1.js';
import {
  Theme08EcosystemV1,
  theme08EcosystemV1Meta,
  theme08EcosystemV1Schema,
  type Theme08EcosystemV1Props,
} from './themes/theme08/ecosystem-v1.js';
import {
  Theme08RadarV1,
  theme08RadarV1Meta,
  theme08RadarV1Schema,
  type Theme08RadarV1Props,
} from './themes/theme08/radar-v1.js';
import {
  Theme08WaterfallV1,
  theme08WaterfallV1Meta,
  theme08WaterfallV1Schema,
  type Theme08WaterfallV1Props,
} from './themes/theme08/waterfall-v1.js';
import {
  Theme08GaugeV1,
  theme08GaugeV1Meta,
  theme08GaugeV1Schema,
  type Theme08GaugeV1Props,
} from './themes/theme08/gauge-v1.js';
import {
  Theme08ChainV1,
  theme08ChainV1Meta,
  theme08ChainV1Schema,
  type Theme08ChainV1Props,
} from './themes/theme08/chain-v1.js';
import {
  Theme08BubbleV1,
  theme08BubbleV1Meta,
  theme08BubbleV1Schema,
  type Theme08BubbleV1Props,
} from './themes/theme08/bubble-v1.js';
import {
  Theme08HeatmapV1,
  theme08HeatmapV1Meta,
  theme08HeatmapV1Schema,
  type Theme08HeatmapV1Props,
} from './themes/theme08/heatmap-v1.js';
import {
  Theme08FundingV1,
  theme08FundingV1Meta,
  theme08FundingV1Schema,
  type Theme08FundingV1Props,
} from './themes/theme08/funding-v1.js';
import {
  Theme08MatrixV1,
  theme08MatrixV1Meta,
  theme08MatrixV1Schema,
  type Theme08MatrixV1Props,
} from './themes/theme08/matrix-v1.js';
import {
  Theme08WorkflowV1,
  theme08WorkflowV1Meta,
  theme08WorkflowV1Schema,
  type Theme08WorkflowV1Props,
} from './themes/theme08/workflow-v1.js';
import {
  Theme08HeroSplitV1,
  theme08HeroSplitV1Meta,
  theme08HeroSplitV1Schema,
  type Theme08HeroSplitV1Props,
} from './themes/theme08/hero-split-v1.js';
import {
  Theme08Cover_v2,
  theme08Cover_v2Meta,
  theme08Cover_v2Schema,
  type Theme08Cover_v2Props,
} from './themes/theme08/cover_v2.js';
import {
  Theme08Cover_v3,
  theme08Cover_v3Meta,
  theme08Cover_v3Schema,
  type Theme08Cover_v3Props,
} from './themes/theme08/cover_v3.js';
import {
  Theme08Cover_v4,
  theme08Cover_v4Meta,
  theme08Cover_v4Schema,
  type Theme08Cover_v4Props,
} from './themes/theme08/cover_v4.js';
import {
  Theme08Cover_v5,
  theme08Cover_v5Meta,
  theme08Cover_v5Schema,
  type Theme08Cover_v5Props,
} from './themes/theme08/cover_v5.js';
import {
  Theme08Chapter_v2,
  theme08Chapter_v2Meta,
  theme08Chapter_v2Schema,
  type Theme08Chapter_v2Props,
} from './themes/theme08/chapter_v2.js';
import {
  Theme08Chapter_v3,
  theme08Chapter_v3Meta,
  theme08Chapter_v3Schema,
  type Theme08Chapter_v3Props,
} from './themes/theme08/chapter_v3.js';
import {
  Theme08Chapter_v4,
  theme08Chapter_v4Meta,
  theme08Chapter_v4Schema,
  type Theme08Chapter_v4Props,
} from './themes/theme08/chapter_v4.js';
import {
  Theme08Quote_statement,
  theme08Quote_statementMeta,
  theme08Quote_statementSchema,
  type Theme08Quote_statementProps,
} from './themes/theme08/quote_statement.js';
import {
  Theme08Quote_resources,
  theme08Quote_resourcesMeta,
  theme08Quote_resourcesSchema,
  type Theme08Quote_resourcesProps,
} from './themes/theme08/quote_resources.js';
import {
  Theme08Quote_verdict,
  theme08Quote_verdictMeta,
  theme08Quote_verdictSchema,
  type Theme08Quote_verdictProps,
} from './themes/theme08/quote_verdict.js';
import {
  Theme08Quote_twofield,
  theme08Quote_twofieldMeta,
  theme08Quote_twofieldSchema,
  type Theme08Quote_twofieldProps,
} from './themes/theme08/quote_twofield.js';
import {
  Theme08Quote_manifesto,
  theme08Quote_manifestoMeta,
  theme08Quote_manifestoSchema,
  type Theme08Quote_manifestoProps,
} from './themes/theme08/quote_manifesto.js';
import {
  Theme08Case_card,
  theme08Case_cardMeta,
  theme08Case_cardSchema,
  type Theme08Case_cardProps,
} from './themes/theme08/case_card.js';
import {
  Theme08Case_card_v2,
  theme08Case_card_v2Meta,
  theme08Case_card_v2Schema,
  type Theme08Case_card_v2Props,
} from './themes/theme08/case_card_v2.js';
import {
  Theme08Case_table,
  theme08Case_tableMeta,
  theme08Case_tableSchema,
  type Theme08Case_tableProps,
} from './themes/theme08/case_table.js';
import {
  Theme08Case_study,
  theme08Case_studyMeta,
  theme08Case_studySchema,
  type Theme08Case_studyProps,
} from './themes/theme08/case_study.js';
import {
  Theme08Case_grid,
  theme08Case_gridMeta,
  theme08Case_gridSchema,
  type Theme08Case_gridProps,
} from './themes/theme08/case_grid.js';
import {
  Theme08Case_list,
  theme08Case_listMeta,
  theme08Case_listSchema,
  type Theme08Case_listProps,
} from './themes/theme08/case_list.js';
import {
  Theme08Region_anchor,
  theme08Region_anchorMeta,
  theme08Region_anchorSchema,
  type Theme08Region_anchorProps,
} from './themes/theme08/region_anchor.js';
import {
  Theme08Region_card_ny,
  theme08Region_card_nyMeta,
  theme08Region_card_nySchema,
  type Theme08Region_card_nyProps,
} from './themes/theme08/region_card_ny.js';
import {
  Theme08Region_dotmap,
  theme08Region_dotmapMeta,
  theme08Region_dotmapSchema,
  type Theme08Region_dotmapProps,
} from './themes/theme08/region_dotmap.js';
import {
  Theme08Segment,
  theme08SegmentMeta,
  theme08SegmentSchema,
  type Theme08SegmentProps,
} from './themes/theme08/segment.js';
import {
  Theme08Pipeline,
  theme08PipelineMeta,
  theme08PipelineSchema,
  type Theme08PipelineProps,
} from './themes/theme08/pipeline.js';
import {
  Theme08Architecture,
  theme08ArchitectureMeta,
  theme08ArchitectureSchema,
  type Theme08ArchitectureProps,
} from './themes/theme08/architecture.js';
import {
  Theme08Supply,
  theme08SupplyMeta,
  theme08SupplySchema,
  type Theme08SupplyProps,
} from './themes/theme08/supply.js';
import {
  Theme08Compute,
  theme08ComputeMeta,
  theme08ComputeSchema,
  type Theme08ComputeProps,
} from './themes/theme08/compute.js';
import {
  Theme08Trend,
  theme08TrendMeta,
  theme08TrendSchema,
  type Theme08TrendProps,
} from './themes/theme08/trend.js';
import {
  Theme08Cross,
  theme08CrossMeta,
  theme08CrossSchema,
  type Theme08CrossProps,
} from './themes/theme08/cross.js';
import {
  Theme08Peak,
  theme08PeakMeta,
  theme08PeakSchema,
  type Theme08PeakProps,
} from './themes/theme08/peak.js';
import {
  Theme08Pullback,
  theme08PullbackMeta,
  theme08PullbackSchema,
  type Theme08PullbackProps,
} from './themes/theme08/pullback.js';
import {
  Theme08Peak_trough,
  theme08Peak_troughMeta,
  theme08Peak_troughSchema,
  type Theme08Peak_troughProps,
} from './themes/theme08/peak_trough.js';
import {
  Theme08Capital_curve,
  theme08Capital_curveMeta,
  theme08Capital_curveSchema,
  type Theme08Capital_curveProps,
} from './themes/theme08/capital_curve.js';
import {
  Theme08Revenue,
  theme08RevenueMeta,
  theme08RevenueSchema,
  type Theme08RevenueProps,
} from './themes/theme08/revenue.js';
import {
  Theme08Regulation,
  theme08RegulationMeta,
  theme08RegulationSchema,
  type Theme08RegulationProps,
} from './themes/theme08/regulation.js';
import {
  Theme08Squeeze,
  theme08SqueezeMeta,
  theme08SqueezeSchema,
  type Theme08SqueezeProps,
} from './themes/theme08/squeeze.js';
import {
  Theme08Early_stage,
  theme08Early_stageMeta,
  theme08Early_stageSchema,
  type Theme08Early_stageProps,
} from './themes/theme08/early_stage.js';
import {
  Theme08Investor_mix,
  theme08Investor_mixMeta,
  theme08Investor_mixSchema,
  type Theme08Investor_mixProps,
} from './themes/theme08/investor_mix.js';
import {
  Theme08Resource_map,
  theme08Resource_mapMeta,
  theme08Resource_mapSchema,
  type Theme08Resource_mapProps,
} from './themes/theme08/resource_map.js';
import {
  Theme08Closed_loop,
  theme08Closed_loopMeta,
  theme08Closed_loopSchema,
  type Theme08Closed_loopProps,
} from './themes/theme08/closed_loop.js';
import {
  Theme08Triptych,
  theme08TriptychMeta,
  theme08TriptychSchema,
  type Theme08TriptychProps,
} from './themes/theme08/triptych.js';
import {
  Theme08Scene_split,
  theme08Scene_splitMeta,
  theme08Scene_splitSchema,
  type Theme08Scene_splitProps,
} from './themes/theme08/scene_split.js';
import {
  Theme08Budget_card,
  theme08Budget_cardMeta,
  theme08Budget_cardSchema,
  type Theme08Budget_cardProps,
} from './themes/theme08/budget_card.js';
import {
  Theme08Mainlines,
  theme08MainlinesMeta,
  theme08MainlinesSchema,
  type Theme08MainlinesProps,
} from './themes/theme08/mainlines.js';
import {
  Theme08Migration,
  theme08MigrationMeta,
  theme08MigrationSchema,
  type Theme08MigrationProps,
} from './themes/theme08/migration.js';
import {
  Theme08Size_split,
  theme08Size_splitMeta,
  theme08Size_splitSchema,
  type Theme08Size_splitProps,
} from './themes/theme08/size_split.js';

import {
  Theme07CoverV1,
  theme07CoverV1Meta,
  theme07CoverV1Schema,
  type Theme07CoverV1Props,
} from './themes/theme07/cover-v1.js';
import {
  Theme07TableOfContentsV1,
  theme07TableOfContentsV1Meta,
  theme07TableOfContentsV1Schema,
  type Theme07TableOfContentsV1Props,
} from './themes/theme07/table-of-contents-v1.js';
import {
  Theme07ChapterV1,
  theme07ChapterV1Meta,
  theme07ChapterV1Schema,
  type Theme07ChapterV1Props,
} from './themes/theme07/chapter-v1.js';
import {
  Theme07ContentV1,
  theme07ContentV1Meta,
  theme07ContentV1Schema,
  type Theme07ContentV1Props,
} from './themes/theme07/content-v1.js';
import {
  Theme07SummaryV1,
  theme07SummaryV1Meta,
  theme07SummaryV1Schema,
  type Theme07SummaryV1Props,
} from './themes/theme07/summary-v1.js';
import {
  Theme07RankingV1,
  theme07RankingV1Meta,
  theme07RankingV1Schema,
  type Theme07RankingV1Props,
} from './themes/theme07/ranking-v1.js';
import {
  Theme07CaseV1,
  theme07CaseV1Meta,
  theme07CaseV1Schema,
  type Theme07CaseV1Props,
} from './themes/theme07/case-v1.js';
import {
  Theme07CaseGridV1,
  theme07CaseGridV1Meta,
  theme07CaseGridV1Schema,
  type Theme07CaseGridV1Props,
} from './themes/theme07/case-grid-v1.js';
import {
  Theme07SourcesV1,
  theme07SourcesV1Meta,
  theme07SourcesV1Schema,
  type Theme07SourcesV1Props,
} from './themes/theme07/sources-v1.js';
import {
  Theme07ChapterCapitalV1,
  theme07ChapterCapitalV1Meta,
  theme07ChapterCapitalV1Schema,
  type Theme07ChapterCapitalV1Props,
} from './themes/theme07/chapter-capital-v1.js';
import {
  Theme07ChapterRiskV1,
  theme07ChapterRiskV1Meta,
  theme07ChapterRiskV1Schema,
  type Theme07ChapterRiskV1Props,
} from './themes/theme07/chapter-risk-v1.js';
import {
  Theme07ChapterAppendixV1,
  theme07ChapterAppendixV1Meta,
  theme07ChapterAppendixV1Schema,
  type Theme07ChapterAppendixV1Props,
} from './themes/theme07/chapter-appendix-v1.js';
import {
  Theme07MethodV1,
  theme07MethodV1Meta,
  theme07MethodV1Schema,
  type Theme07MethodV1Props,
} from './themes/theme07/method-v1.js';
import {
  Theme07MonthlyV1,
  theme07MonthlyV1Meta,
  theme07MonthlyV1Schema,
  type Theme07MonthlyV1Props,
} from './themes/theme07/monthly-v1.js';
import {
  Theme07WaterfallV1,
  theme07WaterfallV1Meta,
  theme07WaterfallV1Schema,
  type Theme07WaterfallV1Props,
} from './themes/theme07/waterfall-v1.js';
import {
  Theme07MatrixV1,
  theme07MatrixV1Meta,
  theme07MatrixV1Schema,
  type Theme07MatrixV1Props,
} from './themes/theme07/matrix-v1.js';
import {
  Theme07RiskV1,
  theme07RiskV1Meta,
  theme07RiskV1Schema,
  type Theme07RiskV1Props,
} from './themes/theme07/risk-v1.js';
import {
  Theme07CoverLeanV1,
  theme07CoverLeanV1Meta,
  theme07CoverLeanV1Schema,
  type Theme07CoverLeanV1Props,
} from './themes/theme07/cover-lean-v1.js';
import {
  Theme07CoverSupplyChainV1,
  theme07CoverSupplyChainV1Meta,
  theme07CoverSupplyChainV1Schema,
  type Theme07CoverSupplyChainV1Props,
} from './themes/theme07/cover-supply-chain-v1.js';
import {
  Theme07CoverRetailTrendV1,
  theme07CoverRetailTrendV1Meta,
  theme07CoverRetailTrendV1Schema,
  type Theme07CoverRetailTrendV1Props,
} from './themes/theme07/cover-retail-trend-v1.js';
import {
  Theme07CoverSupplyStrategyV1,
  theme07CoverSupplyStrategyV1Meta,
  theme07CoverSupplyStrategyV1Schema,
  type Theme07CoverSupplyStrategyV1Props,
} from './themes/theme07/cover-supply-strategy-v1.js';
import {
  Theme07PeakV1,
  theme07PeakV1Meta,
  theme07PeakV1Schema,
  type Theme07PeakV1Props,
} from './themes/theme07/peak-v1.js';
import {
  Theme07CooldownV1,
  theme07CooldownV1Meta,
  theme07CooldownV1Schema,
  type Theme07CooldownV1Props,
} from './themes/theme07/cooldown-v1.js';
import {
  Theme07PeakTroughV1,
  theme07PeakTroughV1Meta,
  theme07PeakTroughV1Schema,
  type Theme07PeakTroughV1Props,
} from './themes/theme07/peak-trough-v1.js';
import {
  Theme07DealSizeV1,
  theme07DealSizeV1Meta,
  theme07DealSizeV1Schema,
  type Theme07DealSizeV1Props,
} from './themes/theme07/deal-size-v1.js';
import {
  Theme07AvgTicketV1,
  theme07AvgTicketV1Meta,
  theme07AvgTicketV1Schema,
  type Theme07AvgTicketV1Props,
} from './themes/theme07/avg-ticket-v1.js';
import {
  Theme07OutlookV1,
  theme07OutlookV1Meta,
  theme07OutlookV1Schema,
  type Theme07OutlookV1Props,
} from './themes/theme07/outlook-v1.js';
import {
  Theme07RepricingV1,
  theme07RepricingV1Meta,
  theme07RepricingV1Schema,
  type Theme07RepricingV1Props,
} from './themes/theme07/repricing-v1.js';
import {
  Theme07DealMapV1,
  theme07DealMapV1Meta,
  theme07DealMapV1Schema,
  type Theme07DealMapV1Props,
} from './themes/theme07/deal-map-v1.js';
import {
  Theme07ColdStartV1,
  theme07ColdStartV1Meta,
  theme07ColdStartV1Schema,
  type Theme07ColdStartV1Props,
} from './themes/theme07/cold-start-v1.js';
import {
  Theme07AccelerateV1,
  theme07AccelerateV1Meta,
  theme07AccelerateV1Schema,
  type Theme07AccelerateV1Props,
} from './themes/theme07/accelerate-v1.js';
import {
  Theme07InvestorV1,
  theme07InvestorV1Meta,
  theme07InvestorV1Schema,
  type Theme07InvestorV1Props,
} from './themes/theme07/investor-v1.js';
import {
  Theme07ActiveCapitalV1,
  theme07ActiveCapitalV1Meta,
  theme07ActiveCapitalV1Schema,
  type Theme07ActiveCapitalV1Props,
} from './themes/theme07/active-capital-v1.js';
import {
  Theme07ConcentrationV1,
  theme07ConcentrationV1Meta,
  theme07ConcentrationV1Schema,
  type Theme07ConcentrationV1Props,
} from './themes/theme07/concentration-v1.js';
import {
  Theme07SyndicateV1,
  theme07SyndicateV1Meta,
  theme07SyndicateV1Schema,
  type Theme07SyndicateV1Props,
} from './themes/theme07/syndicate-v1.js';
import {
  Theme07KnowledgeV1,
  theme07KnowledgeV1Meta,
  theme07KnowledgeV1Schema,
  type Theme07KnowledgeV1Props,
} from './themes/theme07/knowledge-v1.js';
import {
  Theme07LegalV1,
  theme07LegalV1Meta,
  theme07LegalV1Schema,
  type Theme07LegalV1Props,
} from './themes/theme07/legal-v1.js';
import {
  Theme07HealthcareV1,
  theme07HealthcareV1Meta,
  theme07HealthcareV1Schema,
  type Theme07HealthcareV1Props,
} from './themes/theme07/healthcare-v1.js';
import {
  Theme07FinanceV1,
  theme07FinanceV1Meta,
  theme07FinanceV1Schema,
  type Theme07FinanceV1Props,
} from './themes/theme07/finance-v1.js';
import {
  Theme07ComputeV1,
  theme07ComputeV1Meta,
  theme07ComputeV1Schema,
  type Theme07ComputeV1Props,
} from './themes/theme07/compute-v1.js';
import {
  Theme07ChipV1,
  theme07ChipV1Meta,
  theme07ChipV1Schema,
  type Theme07ChipV1Props,
} from './themes/theme07/chip-v1.js';
import {
  Theme07RoboticsV1,
  theme07RoboticsV1Meta,
  theme07RoboticsV1Schema,
  type Theme07RoboticsV1Props,
} from './themes/theme07/robotics-v1.js';
import {
  Theme07AutonomyV1,
  theme07AutonomyV1Meta,
  theme07AutonomyV1Schema,
  type Theme07AutonomyV1Props,
} from './themes/theme07/autonomy-v1.js';
import {
  Theme07SafetyV1,
  theme07SafetyV1Meta,
  theme07SafetyV1Schema,
  type Theme07SafetyV1Props,
} from './themes/theme07/safety-v1.js';
import {
  Theme07ContentGenV1,
  theme07ContentGenV1Meta,
  theme07ContentGenV1Schema,
  type Theme07ContentGenV1Props,
} from './themes/theme07/content_gen-v1.js';
import {
  Theme07EducationV1,
  theme07EducationV1Meta,
  theme07EducationV1Schema,
  type Theme07EducationV1Props,
} from './themes/theme07/education-v1.js';
import {
  Theme07SupportV1,
  theme07SupportV1Meta,
  theme07SupportV1Schema,
  type Theme07SupportV1Props,
} from './themes/theme07/support-v1.js';
import {
  Theme07SalesV1,
  theme07SalesV1Meta,
  theme07SalesV1Schema,
  type Theme07SalesV1Props,
} from './themes/theme07/sales-v1.js';
import {
  Theme07LowCodeV1,
  theme07LowCodeV1Meta,
  theme07LowCodeV1Schema,
  type Theme07LowCodeV1Props,
} from './themes/theme07/low_code-v1.js';
import {
  Theme07OpenSourceV1,
  theme07OpenSourceV1Meta,
  theme07OpenSourceV1Schema,
  type Theme07OpenSourceV1Props,
} from './themes/theme07/open_source-v1.js';
import {
  Theme07AlignmentV1,
  theme07AlignmentV1Meta,
  theme07AlignmentV1Schema,
  type Theme07AlignmentV1Props,
} from './themes/theme07/alignment-v1.js';
import {
  Theme07EarlyStageV1,
  theme07EarlyStageV1Meta,
  theme07EarlyStageV1Schema,
  type Theme07EarlyStageV1Props,
} from './themes/theme07/early_stage-v1.js';
import {
  Theme07DealStructureV1,
  theme07DealStructureV1Meta,
  theme07DealStructureV1Schema,
  type Theme07DealStructureV1Props,
} from './themes/theme07/deal_structure-v1.js';
import {
  Theme07InvestorMixV1,
  theme07InvestorMixV1Meta,
  theme07InvestorMixV1Schema,
  type Theme07InvestorMixV1Props,
} from './themes/theme07/investor_mix-v1.js';
import {
  Theme07ResourceV1,
  theme07ResourceV1Meta,
  theme07ResourceV1Schema,
  type Theme07ResourceV1Props,
} from './themes/theme07/resource-v1.js';
import {
  Theme07AllianceV1,
  theme07AllianceV1Meta,
  theme07AllianceV1Schema,
  type Theme07AllianceV1Props,
} from './themes/theme07/alliance-v1.js';
import {
  Theme07EcosystemV1,
  theme07EcosystemV1Meta,
  theme07EcosystemV1Schema,
  type Theme07EcosystemV1Props,
} from './themes/theme07/ecosystem-v1.js';
import {
  Theme07GeoCenterV1,
  theme07GeoCenterV1Meta,
  theme07GeoCenterV1Schema,
  type Theme07GeoCenterV1Props,
} from './themes/theme07/geo_center-v1.js';
import {
  Theme07RegionClusterV1,
  theme07RegionClusterV1Meta,
  theme07RegionClusterV1Schema,
  type Theme07RegionClusterV1Props,
} from './themes/theme07/region_cluster-v1.js';
import {
  Theme07ResourceTriadV1,
  theme07ResourceTriadV1Meta,
  theme07ResourceTriadV1Schema,
  type Theme07ResourceTriadV1Props,
} from './themes/theme07/resource_triad-v1.js';
import {
  Theme07CompanyOpenaiV1,
  theme07CompanyOpenaiV1Meta,
  theme07CompanyOpenaiV1Schema,
  type Theme07CompanyOpenaiV1Props,
} from './themes/theme07/company_openai-v1.js';
import {
  Theme07CompanyFigureV1,
  theme07CompanyFigureV1Meta,
  theme07CompanyFigureV1Schema,
  type Theme07CompanyFigureV1Props,
} from './themes/theme07/company_figure-v1.js';
import {
  Theme07CompanySsiV1,
  theme07CompanySsiV1Meta,
  theme07CompanySsiV1Schema,
  type Theme07CompanySsiV1Props,
} from './themes/theme07/company_ssi-v1.js';
import {
  Theme07RevenueV1,
  theme07RevenueV1Meta,
  theme07RevenueV1Schema,
  type Theme07RevenueV1Props,
} from './themes/theme07/revenue-v1.js';
import {
  Theme07ComplianceV1,
  theme07ComplianceV1Meta,
  theme07ComplianceV1Schema,
  type Theme07ComplianceV1Props,
} from './themes/theme07/compliance-v1.js';
import {
  Theme07MarginV1,
  theme07MarginV1Meta,
  theme07MarginV1Schema,
  type Theme07MarginV1Props,
} from './themes/theme07/margin-v1.js';
import {
  Theme07MoatV1,
  theme07MoatV1Meta,
  theme07MoatV1Schema,
  type Theme07MoatV1Props,
} from './themes/theme07/moat-v1.js';
import {
  Theme07StrategyInfraV1,
  theme07StrategyInfraV1Meta,
  theme07StrategyInfraV1Schema,
  type Theme07StrategyInfraV1Props,
} from './themes/theme07/strategy_infra-v1.js';
import {
  Theme07StrategyVerticalV1,
  theme07StrategyVerticalV1Meta,
  theme07StrategyVerticalV1Schema,
  type Theme07StrategyVerticalV1Props,
} from './themes/theme07/strategy_vertical-v1.js';
import {
  Theme07QuoteV1,
  theme07QuoteV1Meta,
  theme07QuoteV1Schema,
  type Theme07QuoteV1Props,
} from './themes/theme07/quote-v1.js';
import {
  Theme07ClosingV1,
  theme07ClosingV1Meta,
  theme07ClosingV1Schema,
  type Theme07ClosingV1Props,
} from './themes/theme07/closing-v1.js';
import {
  Theme07ClosingQuoteV1,
  theme07ClosingQuoteV1Meta,
  theme07ClosingQuoteV1Schema,
  type Theme07ClosingQuoteV1Props,
} from './themes/theme07/closing-quote-v1.js';
import {
  Theme07ForwardV1,
  theme07ForwardV1Meta,
  theme07ForwardV1Schema,
  type Theme07ForwardV1Props,
} from './themes/theme07/forward-v1.js';
import {
  Theme07AboutLabV1,
  theme07AboutLabV1Meta,
  theme07AboutLabV1Schema,
  type Theme07AboutLabV1Props,
} from './themes/theme07/about_lab-v1.js';
import {
  Theme07StatHeroV1,
  theme07StatHeroV1Meta,
  theme07StatHeroV1Schema,
  type Theme07StatHeroV1Props,
} from './themes/theme07/stat_hero-v1.js';
import {
  Theme07StatRowV1,
  theme07StatRowV1Meta,
  theme07StatRowV1Schema,
  type Theme07StatRowV1Props,
} from './themes/theme07/stat_row-v1.js';
import {
  Theme07StatChartV1,
  theme07StatChartV1Meta,
  theme07StatChartV1Schema,
  type Theme07StatChartV1Props,
} from './themes/theme07/stat_chart-v1.js';
import {
  Theme07StatCompareV1,
  theme07StatCompareV1Meta,
  theme07StatCompareV1Schema,
  type Theme07StatCompareV1Props,
} from './themes/theme07/stat_compare-v1.js';

export interface RegisteredLayout<P extends Record<string, unknown>> {
  meta: LayoutMeta;
  component: ComponentType<P>;
  /** 版式 Props Schema，用于编辑器属性面板精确渲染 */
  schema?: PropsSchema;
}

/** 按版式 ID 索引。 */
const registryById = new Map<string, RegisteredLayout<Record<string, unknown>>>();

/** 按 (role, theme) 二维索引，支持同一角色主题下的多个版式变体。 */
const registryByRoleTheme = new Map<string, Map<string, RegisteredLayout<Record<string, unknown>>[]>>();

export function registerLayout<P extends Record<string, unknown>>(
  layout: RegisteredLayout<P>
): void {
  const normalized = layout as RegisteredLayout<Record<string, unknown>>;
  registryById.set(normalized.meta.id, normalized);

  const role = normalized.meta.role;
  const theme = normalized.meta.theme;
  if (!registryByRoleTheme.has(role)) {
    registryByRoleTheme.set(role, new Map());
  }
  const themeMap = registryByRoleTheme.get(role)!;
  if (!themeMap.has(theme)) {
    themeMap.set(theme, []);
  }
  themeMap.get(theme)!.push(normalized);
}

export function getLayout(id: string): RegisteredLayout<Record<string, unknown>> | undefined {
  return registryById.get(id);
}

/**
 * 获取指定版式的 Props Schema。
 */
export function getLayoutSchema(id: string): PropsSchema | undefined {
  return registryById.get(id)?.schema;
}

/**
 * 根据页面角色和主题解析版式。
 */
export function resolveLayout(role: string, theme?: string): RegisteredLayout<Record<string, unknown>> | undefined {
  const byTheme = registryByRoleTheme.get(role);
  if (!byTheme || !theme) {
    return undefined;
  }
  return byTheme.get(theme)?.[0];
}

export function listLayouts(): LayoutMeta[] {
  return Array.from(registryById.values()).map((l) => l.meta);
}

export function listLayoutsByTheme(theme: string): LayoutMeta[] {
  return listLayouts().filter((l) => l.theme === theme);
}

export function listLayoutsByRole(role: LayoutMeta['role']): LayoutMeta[] {
  return listLayouts().filter((l) => l.role === role);
}

/**
 * 返回指定角色在指定主题下可用的版式元数据。
 */
export function listLayoutsByRoleAndTheme(role: LayoutMeta['role'], theme?: string): LayoutMeta[] {
  return listLayouts().filter((l) => l.role === role && l.theme === theme);
}

export interface RenderSlideOptions {
  slideIdx?: number;
  editable?: boolean;
  /** 当前 deck 主题，用于未来支持主题专属渲染回退。 */
  theme?: string;
}

export function renderSlide(slide: Slide, options: RenderSlideOptions = {}): ReactElement | null {
  const registered = getLayout(slide.layout) ?? resolveLayout(slide.role, options.theme);
  if (!registered) {
    return null;
  }
  const Component = registered.component;
  return <Component {...slide.props} _slideIdx={options.slideIdx} _editable={options.editable} />;
}

// 注册 Theme01 主题专属版式
registerLayout<Theme01AppendixV1Props>({ meta: theme01AppendixV1Meta, component: Theme01AppendixV1, schema: theme01AppendixV1Schema });
registerLayout<Theme01BentoV1Props>({ meta: theme01BentoV1Meta, component: Theme01BentoV1, schema: theme01BentoV1Schema });
registerLayout<Theme01ChapterV1Props>({ meta: theme01ChapterV1Meta, component: Theme01ChapterV1, schema: theme01ChapterV1Schema });
registerLayout<Theme01ChapterV2Props>({ meta: theme01ChapterV2Meta, component: Theme01ChapterV2, schema: theme01ChapterV2Schema });
registerLayout<Theme01ChapterV3Props>({ meta: theme01ChapterV3Meta, component: Theme01ChapterV3, schema: theme01ChapterV3Schema });
registerLayout<Theme01ChartBar3dProps>({
  meta: theme01ChartBar3dMeta,
  component: Theme01ChartBar3d,
  schema: theme01ChartBar3dSchema,
});
registerLayout<Theme01ChartDonutProps>({
  meta: theme01ChartDonutMeta,
  component: Theme01ChartDonut,
  schema: theme01ChartDonutSchema,
});
registerLayout<Theme01ChartFunnelProps>({
  meta: theme01ChartFunnelMeta,
  component: Theme01ChartFunnel,
  schema: theme01ChartFunnelSchema,
});
registerLayout<Theme01ChartGaugeProps>({
  meta: theme01ChartGaugeMeta,
  component: Theme01ChartGauge,
  schema: theme01ChartGaugeSchema,
});
registerLayout<Theme01ChartGraphProps>({
  meta: theme01ChartGraphMeta,
  component: Theme01ChartGraph,
  schema: theme01ChartGraphSchema,
});
registerLayout<Theme01ChartHeatmapProps>({
  meta: theme01ChartHeatmapMeta,
  component: Theme01ChartHeatmap,
  schema: theme01ChartHeatmapSchema,
});
registerLayout<Theme01ChartRadarProps>({
  meta: theme01ChartRadarMeta,
  component: Theme01ChartRadar,
  schema: theme01ChartRadarSchema,
});
registerLayout<Theme01ChartSankeyProps>({
  meta: theme01ChartSankeyMeta,
  component: Theme01ChartSankey,
  schema: theme01ChartSankeySchema,
});
registerLayout<Theme01ChartSunburstProps>({
  meta: theme01ChartSunburstMeta,
  component: Theme01ChartSunburst,
  schema: theme01ChartSunburstSchema,
});
registerLayout<Theme01ChartTreemapProps>({
  meta: theme01ChartTreemapMeta,
  component: Theme01ChartTreemap,
  schema: theme01ChartTreemapSchema,
});
registerLayout<Theme01ChartV1Props>({ meta: theme01ChartV1Meta, component: Theme01ChartV1, schema: theme01ChartV1Schema });
registerLayout<Theme01ChartWordcloudProps>({
  meta: theme01ChartWordcloudMeta,
  component: Theme01ChartWordcloud,
  schema: theme01ChartWordcloudSchema,
});
registerLayout<Theme01CaseStudyProps>({
  meta: theme01CaseStudyMeta,
  component: Theme01CaseStudy,
  schema: theme01CaseStudySchema,
});
registerLayout<Theme01ClosingV2Props>({ meta: theme01ClosingV2Meta, component: Theme01ClosingV2, schema: theme01ClosingV2Schema });
registerLayout<Theme01ComparisonV1Props>({
  meta: theme01ComparisonV1Meta,
  component: Theme01ComparisonV1,
  schema: theme01ComparisonV1Schema,
});
registerLayout<Theme01ComparisonV2Props>({
  meta: theme01ComparisonV2Meta,
  component: Theme01ComparisonV2,
  schema: theme01ComparisonV2Schema,
});
registerLayout<Theme01ComparisonV3Props>({
  meta: theme01ComparisonV3Meta,
  component: Theme01ComparisonV3,
  schema: theme01ComparisonV3Schema,
});
registerLayout<Theme01DiptychContrastProps>({
  meta: theme01DiptychContrastMeta,
  component: Theme01DiptychContrast,
  schema: theme01DiptychContrastSchema,
});
registerLayout<Theme01ConclusionV1Props>({ meta: theme01ConclusionV1Meta, component: Theme01ConclusionV1, schema: theme01ConclusionV1Schema });
registerLayout<Theme01ContentV1Props>({ meta: theme01ContentV1Meta, component: Theme01ContentV1, schema: theme01ContentV1Schema });
registerLayout<Theme01ContentV2Props>({ meta: theme01ContentV2Meta, component: Theme01ContentV2, schema: theme01ContentV2Schema });
registerLayout<Theme01ContentV3Props>({ meta: theme01ContentV3Meta, component: Theme01ContentV3, schema: theme01ContentV3Schema });
registerLayout<Theme01ContentV4Props>({ meta: theme01ContentV4Meta, component: Theme01ContentV4, schema: theme01ContentV4Schema });
registerLayout<Theme01CoverV1Props>({ meta: theme01CoverV1Meta, component: Theme01CoverV1, schema: theme01CoverV1Schema });
registerLayout<Theme01CoverV2Props>({ meta: theme01CoverV2Meta, component: Theme01CoverV2, schema: theme01CoverV2Schema });
registerLayout<Theme01CoverV3Props>({ meta: theme01CoverV3Meta, component: Theme01CoverV3, schema: theme01CoverV3Schema });
registerLayout<Theme01CoverV4Props>({ meta: theme01CoverV4Meta, component: Theme01CoverV4, schema: theme01CoverV4Schema });
registerLayout<Theme01FaqV1Props>({ meta: theme01FaqV1Meta, component: Theme01FaqV1, schema: theme01FaqV1Schema });
registerLayout<Theme01FeatureV1Props>({ meta: theme01FeatureV1Meta, component: Theme01FeatureV1, schema: theme01FeatureV1Schema });
registerLayout<Theme01FeatureV2Props>({ meta: theme01FeatureV2Meta, component: Theme01FeatureV2, schema: theme01FeatureV2Schema });
registerLayout<Theme01FilmstripV1Props>({ meta: theme01FilmstripV1Meta, component: Theme01FilmstripV1, schema: theme01FilmstripV1Schema });
registerLayout<Theme01GalleryV1Props>({ meta: theme01GalleryV1Meta, component: Theme01GalleryV1, schema: theme01GalleryV1Schema });
registerLayout<Theme01GanttV1Props>({ meta: theme01GanttV1Meta, component: Theme01GanttV1, schema: theme01GanttV1Schema });
registerLayout<Theme01ImageV1Props>({ meta: theme01ImageV1Meta, component: Theme01ImageV1, schema: theme01ImageV1Schema });
registerLayout<Theme01MetricBigProps>({
  meta: theme01MetricBigMeta,
  component: Theme01MetricBig,
  schema: theme01MetricBigSchema,
});
registerLayout<Theme01MetricTriptychProps>({
  meta: theme01MetricTriptychMeta,
  component: Theme01MetricTriptych,
  schema: theme01MetricTriptychSchema,
});
registerLayout<Theme01MetricV1Props>({ meta: theme01MetricV1Meta, component: Theme01MetricV1, schema: theme01MetricV1Schema });
registerLayout<Theme01MetricV2Props>({ meta: theme01MetricV2Meta, component: Theme01MetricV2, schema: theme01MetricV2Schema });
registerLayout<Theme01MetricV3Props>({ meta: theme01MetricV3Meta, component: Theme01MetricV3, schema: theme01MetricV3Schema });
registerLayout<Theme01OutlookV1Props>({ meta: theme01OutlookV1Meta, component: Theme01OutlookV1, schema: theme01OutlookV1Schema });
registerLayout<Theme01PartnersV1Props>({ meta: theme01PartnersV1Meta, component: Theme01PartnersV1, schema: theme01PartnersV1Schema });
registerLayout<Theme01PestV1Props>({ meta: theme01PestV1Meta, component: Theme01PestV1, schema: theme01PestV1Schema });
registerLayout<Theme01PricingV1Props>({ meta: theme01PricingV1Meta, component: Theme01PricingV1, schema: theme01PricingV1Schema });
registerLayout<Theme01ProcessV1Props>({ meta: theme01ProcessV1Meta, component: Theme01ProcessV1, schema: theme01ProcessV1Schema });
registerLayout<Theme01QuadrantV1Props>({ meta: theme01QuadrantV1Meta, component: Theme01QuadrantV1, schema: theme01QuadrantV1Schema });
registerLayout<Theme01QuoteV1Props>({ meta: theme01QuoteV1Meta, component: Theme01QuoteV1, schema: theme01QuoteV1Schema });
registerLayout<Theme01QuoteV2Props>({ meta: theme01QuoteV2Meta, component: Theme01QuoteV2, schema: theme01QuoteV2Schema });
registerLayout<Theme01QuoteV3Props>({ meta: theme01QuoteV3Meta, component: Theme01QuoteV3, schema: theme01QuoteV3Schema });
registerLayout<Theme01RankingV1Props>({ meta: theme01RankingV1Meta, component: Theme01RankingV1, schema: theme01RankingV1Schema });
registerLayout<Theme01RegionV1Props>({ meta: theme01RegionV1Meta, component: Theme01RegionV1, schema: theme01RegionV1Schema });
registerLayout<Theme01RiskV1Props>({ meta: theme01RiskV1Meta, component: Theme01RiskV1, schema: theme01RiskV1Schema });
registerLayout<Theme01RoadmapV1Props>({ meta: theme01RoadmapV1Meta, component: Theme01RoadmapV1, schema: theme01RoadmapV1Schema });
registerLayout<Theme01ScorecardV1Props>({
  meta: theme01ScorecardV1Meta,
  component: Theme01ScorecardV1,
  schema: theme01ScorecardV1Schema,
});
registerLayout<Theme01SpotlightGridProps>({
  meta: theme01SpotlightGridMeta,
  component: Theme01SpotlightGrid,
  schema: theme01SpotlightGridSchema,
});
registerLayout<Theme01StatsV1Props>({ meta: theme01StatsV1Meta, component: Theme01StatsV1, schema: theme01StatsV1Schema });
registerLayout<Theme01SwotV1Props>({ meta: theme01SwotV1Meta, component: Theme01SwotV1, schema: theme01SwotV1Schema });
registerLayout<Theme01TableOfContentsV1Props>({
  meta: theme01TableOfContentsV1Meta,
  component: Theme01TableOfContentsV1,
  schema: theme01TableOfContentsV1Schema,
});
registerLayout<Theme01TableOfContentsV2Props>({
  meta: theme01TableOfContentsV2Meta,
  component: Theme01TableOfContentsV2,
  schema: theme01TableOfContentsV2Schema,
});
registerLayout<Theme01TableDataProps>({
  meta: theme01TableDataMeta,
  component: Theme01TableData,
  schema: theme01TableDataSchema,
});
registerLayout<Theme01TableV1Props>({ meta: theme01TableV1Meta, component: Theme01TableV1, schema: theme01TableV1Schema });
registerLayout<Theme01TagsV1Props>({ meta: theme01TagsV1Meta, component: Theme01TagsV1, schema: theme01TagsV1Schema });
registerLayout<Theme01TeamV1Props>({ meta: theme01TeamV1Meta, component: Theme01TeamV1, schema: theme01TeamV1Schema });
registerLayout<Theme01TeamV2Props>({ meta: theme01TeamV2Meta, component: Theme01TeamV2, schema: theme01TeamV2Schema });
registerLayout<Theme01TestimonialV1Props>({ meta: theme01TestimonialV1Meta, component: Theme01TestimonialV1, schema: theme01TestimonialV1Schema });
registerLayout<Theme01TimelineV1Props>({ meta: theme01TimelineV1Meta, component: Theme01TimelineV1, schema: theme01TimelineV1Schema });
registerLayout<Theme01TrendV1Props>({ meta: theme01TrendV1Meta, component: Theme01TrendV1, schema: theme01TrendV1Schema });
registerLayout<Theme01ComponentsV1Props>({ meta: theme01ComponentsV1Meta, component: Theme01ComponentsV1, schema: theme01ComponentsV1Schema });

// 注册 Theme02 主题专属版式
registerLayout<Theme02CoverV1Props>({ meta: theme02CoverV1Meta, component: Theme02CoverV1, schema: theme02CoverV1Schema });
registerLayout<Theme02CoverV2Props>({ meta: theme02CoverV2Meta, component: Theme02CoverV2, schema: theme02CoverV2Schema });
registerLayout<Theme02ChapterV1Props>({ meta: theme02ChapterV1Meta, component: Theme02ChapterV1, schema: theme02ChapterV1Schema });
registerLayout<Theme02ChapterV2Props>({ meta: theme02ChapterV2Meta, component: Theme02ChapterV2, schema: theme02ChapterV2Schema });
registerLayout<Theme02MetricBigProps>({ meta: theme02MetricBigMeta, component: Theme02MetricBig, schema: theme02MetricBigSchema });
registerLayout<Theme02NumberShowcaseV1Props>({ meta: theme02NumberShowcaseV1Meta, component: Theme02NumberShowcaseV1, schema: theme02NumberShowcaseV1Schema });
registerLayout<Theme02ChartV1Props>({ meta: theme02ChartV1Meta, component: Theme02ChartV1, schema: theme02ChartV1Schema });
registerLayout<Theme02ChartFunnelProps>({ meta: theme02ChartFunnelMeta, component: Theme02ChartFunnel, schema: theme02ChartFunnelSchema });
registerLayout<Theme02ChartDonutProps>({ meta: theme02ChartDonutMeta, component: Theme02ChartDonut, schema: theme02ChartDonutSchema });
registerLayout<Theme02ChartHeatmapProps>({ meta: theme02ChartHeatmapMeta, component: Theme02ChartHeatmap, schema: theme02ChartHeatmapSchema });
registerLayout<Theme02ChartRadarProps>({ meta: theme02ChartRadarMeta, component: Theme02ChartRadar, schema: theme02ChartRadarSchema });
registerLayout<Theme02ChartGaugeProps>({ meta: theme02ChartGaugeMeta, component: Theme02ChartGauge, schema: theme02ChartGaugeSchema });
registerLayout<Theme02ContentV1Props>({ meta: theme02ContentV1Meta, component: Theme02ContentV1, schema: theme02ContentV1Schema });
registerLayout<Theme02DeltaV1Props>({ meta: theme02DeltaV1Meta, component: Theme02DeltaV1, schema: theme02DeltaV1Schema });
registerLayout<Theme02ClosingV1Props>({ meta: theme02ClosingV1Meta, component: Theme02ClosingV1, schema: theme02ClosingV1Schema });
registerLayout<Theme02TableOfContentsV1Props>({ meta: theme02TableOfContentsV1Meta, component: Theme02TableOfContentsV1, schema: theme02TableOfContentsV1Schema });
registerLayout<Theme02MetricsV1Props>({ meta: theme02MetricsV1Meta, component: Theme02MetricsV1, schema: theme02MetricsV1Schema });
registerLayout<Theme02TeamV1Props>({ meta: theme02TeamV1Meta, component: Theme02TeamV1, schema: theme02TeamV1Schema });
registerLayout<Theme02TimelineV1Props>({ meta: theme02TimelineV1Meta, component: Theme02TimelineV1, schema: theme02TimelineV1Schema });
registerLayout<Theme02ComparisonV1Props>({ meta: theme02ComparisonV1Meta, component: Theme02ComparisonV1, schema: theme02ComparisonV1Schema });
registerLayout<Theme02ImageV1Props>({ meta: theme02ImageV1Meta, component: Theme02ImageV1, schema: theme02ImageV1Schema });
registerLayout<Theme02QuoteV1Props>({ meta: theme02QuoteV1Meta, component: Theme02QuoteV1, schema: theme02QuoteV1Schema });
registerLayout<Theme02QuoteV2Props>({ meta: theme02QuoteV2Meta, component: Theme02QuoteV2, schema: theme02QuoteV2Schema });
registerLayout<Theme02BentoV1Props>({ meta: theme02BentoV1Meta, component: Theme02BentoV1, schema: theme02BentoV1Schema });
registerLayout<Theme02FeatureV1Props>({ meta: theme02FeatureV1Meta, component: Theme02FeatureV1, schema: theme02FeatureV1Schema });
registerLayout<Theme02GalleryV1Props>({ meta: theme02GalleryV1Meta, component: Theme02GalleryV1, schema: theme02GalleryV1Schema });
registerLayout<Theme02PricingV1Props>({ meta: theme02PricingV1Meta, component: Theme02PricingV1, schema: theme02PricingV1Schema });
registerLayout<Theme02ProcessV1Props>({ meta: theme02ProcessV1Meta, component: Theme02ProcessV1, schema: theme02ProcessV1Schema });
registerLayout<Theme02ProgressV1Props>({ meta: theme02ProgressV1Meta, component: Theme02ProgressV1, schema: theme02ProgressV1Schema });
registerLayout<Theme02RoadmapV1Props>({ meta: theme02RoadmapV1Meta, component: Theme02RoadmapV1, schema: theme02RoadmapV1Schema });
registerLayout<Theme02SwotV1Props>({ meta: theme02SwotV1Meta, component: Theme02SwotV1, schema: theme02SwotV1Schema });
registerLayout<Theme02FaqV1Props>({ meta: theme02FaqV1Meta, component: Theme02FaqV1, schema: theme02FaqV1Schema });
registerLayout<Theme02FilmstripV1Props>({ meta: theme02FilmstripV1Meta, component: Theme02FilmstripV1, schema: theme02FilmstripV1Schema });
registerLayout<Theme02PartnersV1Props>({ meta: theme02PartnersV1Meta, component: Theme02PartnersV1, schema: theme02PartnersV1Schema });
registerLayout<Theme02PestV1Props>({ meta: theme02PestV1Meta, component: Theme02PestV1, schema: theme02PestV1Schema });
registerLayout<Theme02StatsV1Props>({ meta: theme02StatsV1Meta, component: Theme02StatsV1, schema: theme02StatsV1Schema });
registerLayout<Theme02TableV1Props>({ meta: theme02TableV1Meta, component: Theme02TableV1, schema: theme02TableV1Schema });
registerLayout<Theme02TagsV1Props>({ meta: theme02TagsV1Meta, component: Theme02TagsV1, schema: theme02TagsV1Schema });
registerLayout<Theme02TestimonialV1Props>({ meta: theme02TestimonialV1Meta, component: Theme02TestimonialV1, schema: theme02TestimonialV1Schema });
registerLayout<Theme02FeatureV2Props>({ meta: theme02FeatureV2Meta, component: Theme02FeatureV2, schema: theme02FeatureV2Schema });
registerLayout<Theme02ChecklistV1Props>({ meta: theme02ChecklistV1Meta, component: Theme02ChecklistV1, schema: theme02ChecklistV1Schema });
registerLayout<Theme02StepsV1Props>({ meta: theme02StepsV1Meta, component: Theme02StepsV1, schema: theme02StepsV1Schema });
registerLayout<Theme02CardGridV1Props>({ meta: theme02CardGridV1Meta, component: Theme02CardGridV1, schema: theme02CardGridV1Schema });
registerLayout<Theme02HighlightV1Props>({ meta: theme02HighlightV1Meta, component: Theme02HighlightV1, schema: theme02HighlightV1Schema });
registerLayout<Theme02ComparisonV2Props>({ meta: theme02ComparisonV2Meta, component: Theme02ComparisonV2, schema: theme02ComparisonV2Schema });
registerLayout<Theme02MatrixV1Props>({ meta: theme02MatrixV1Meta, component: Theme02MatrixV1, schema: theme02MatrixV1Schema });
registerLayout<Theme02StatGridV1Props>({ meta: theme02StatGridV1Meta, component: Theme02StatGridV1, schema: theme02StatGridV1Schema });
registerLayout<Theme02CoverV3Props>({ meta: theme02CoverV3Meta, component: Theme02CoverV3, schema: theme02CoverV3Schema });
registerLayout<Theme02ClosingV2Props>({ meta: theme02ClosingV2Meta, component: Theme02ClosingV2, schema: theme02ClosingV2Schema });
registerLayout<Theme02ChartBarV1Props>({ meta: theme02ChartBarV1Meta, component: Theme02ChartBarV1, schema: theme02ChartBarV1Schema });
registerLayout<Theme02ChartLineV1Props>({ meta: theme02ChartLineV1Meta, component: Theme02ChartLineV1, schema: theme02ChartLineV1Schema });
registerLayout<Theme02ChartAreaV1Props>({ meta: theme02ChartAreaV1Meta, component: Theme02ChartAreaV1, schema: theme02ChartAreaV1Schema });
registerLayout<Theme02ChartStackV1Props>({ meta: theme02ChartStackV1Meta, component: Theme02ChartStackV1, schema: theme02ChartStackV1Schema });
registerLayout<Theme02KpiStripV1Props>({ meta: theme02KpiStripV1Meta, component: Theme02KpiStripV1, schema: theme02KpiStripV1Schema });
registerLayout<Theme02BigStatV1Props>({ meta: theme02BigStatV1Meta, component: Theme02BigStatV1, schema: theme02BigStatV1Schema });
registerLayout<Theme02CycleV1Props>({ meta: theme02CycleV1Meta, component: Theme02CycleV1, schema: theme02CycleV1Schema });
registerLayout<Theme02SwimlaneV1Props>({ meta: theme02SwimlaneV1Meta, component: Theme02SwimlaneV1, schema: theme02SwimlaneV1Schema });
registerLayout<Theme02PyramidV1Props>({ meta: theme02PyramidV1Meta, component: Theme02PyramidV1, schema: theme02PyramidV1Schema });
registerLayout<Theme02OrgChartV1Props>({ meta: theme02OrgChartV1Meta, component: Theme02OrgChartV1, schema: theme02OrgChartV1Schema });
registerLayout<Theme02FlowV1Props>({ meta: theme02FlowV1Meta, component: Theme02FlowV1, schema: theme02FlowV1Schema });
registerLayout<Theme02TableV2Props>({ meta: theme02TableV2Meta, component: Theme02TableV2, schema: theme02TableV2Schema });
registerLayout<Theme02ImageSplitV1Props>({ meta: theme02ImageSplitV1Meta, component: Theme02ImageSplitV1, schema: theme02ImageSplitV1Schema });
registerLayout<Theme02ImageGridV2Props>({ meta: theme02ImageGridV2Meta, component: Theme02ImageGridV2, schema: theme02ImageGridV2Schema });
registerLayout<Theme02SpotlightV1Props>({ meta: theme02SpotlightV1Meta, component: Theme02SpotlightV1, schema: theme02SpotlightV1Schema });
registerLayout<Theme02ChapterV3Props>({ meta: theme02ChapterV3Meta, component: Theme02ChapterV3, schema: theme02ChapterV3Schema });
registerLayout<Theme02SectionDividerV1Props>({ meta: theme02SectionDividerV1Meta, component: Theme02SectionDividerV1, schema: theme02SectionDividerV1Schema });
registerLayout<Theme02LogoWallV1Props>({ meta: theme02LogoWallV1Meta, component: Theme02LogoWallV1, schema: theme02LogoWallV1Schema });
registerLayout<Theme03CoverV1Props>({ meta: theme03CoverV1Meta, component: Theme03CoverV1, schema: theme03CoverV1Schema });
registerLayout<Theme03ChapterV1Props>({ meta: theme03ChapterV1Meta, component: Theme03ChapterV1, schema: theme03ChapterV1Schema });
registerLayout<Theme03ContentV1Props>({ meta: theme03ContentV1Meta, component: Theme03ContentV1, schema: theme03ContentV1Schema });
registerLayout<Theme03MetricBigProps>({ meta: theme03MetricBigMeta, component: Theme03MetricBig, schema: theme03MetricBigSchema });
registerLayout<Theme03RankingV1Props>({ meta: theme03RankingV1Meta, component: Theme03RankingV1, schema: theme03RankingV1Schema });
registerLayout<Theme03QuoteV1Props>({ meta: theme03QuoteV1Meta, component: Theme03QuoteV1, schema: theme03QuoteV1Schema });
registerLayout<Theme03CaseV1Props>({ meta: theme03CaseV1Meta, component: Theme03CaseV1, schema: theme03CaseV1Schema });
registerLayout<Theme03ChartDonutProps>({
  meta: theme03ChartDonutMeta,
  component: Theme03ChartDonut,
  schema: theme03ChartDonutSchema,
});
registerLayout<Theme03ChartBarProps>({
  meta: theme03ChartBarMeta,
  component: Theme03ChartBar,
  schema: theme03ChartBarSchema,
});
registerLayout<Theme03ChartV1Props>({
  meta: theme03ChartV1Meta,
  component: Theme03ChartV1,
  schema: theme03ChartV1Schema,
});
registerLayout<Theme03TrendV1Props>({
  meta: theme03TrendV1Meta,
  component: Theme03TrendV1,
  schema: theme03TrendV1Schema,
});
registerLayout<Theme03ChartRadarProps>({
  meta: theme03ChartRadarMeta,
  component: Theme03ChartRadar,
  schema: theme03ChartRadarSchema,
});
registerLayout<Theme03ChartFunnelProps>({
  meta: theme03ChartFunnelMeta,
  component: Theme03ChartFunnel,
  schema: theme03ChartFunnelSchema,
});
registerLayout<Theme03ChartGaugeProps>({
  meta: theme03ChartGaugeMeta,
  component: Theme03ChartGauge,
  schema: theme03ChartGaugeSchema,
});
registerLayout<Theme03ChartHeatmapProps>({
  meta: theme03ChartHeatmapMeta,
  component: Theme03ChartHeatmap,
  schema: theme03ChartHeatmapSchema,
});
registerLayout<Theme03ChartTreemapProps>({
  meta: theme03ChartTreemapMeta,
  component: Theme03ChartTreemap,
  schema: theme03ChartTreemapSchema,
});
registerLayout<Theme03ChartWordcloudProps>({
  meta: theme03ChartWordcloudMeta,
  component: Theme03ChartWordcloud,
  schema: theme03ChartWordcloudSchema,
});
registerLayout<Theme03ChartBar3dProps>({
  meta: theme03ChartBar3dMeta,
  component: Theme03ChartBar3d,
  schema: theme03ChartBar3dSchema,
});
registerLayout<Theme03ChartGraphProps>({
  meta: theme03ChartGraphMeta,
  component: Theme03ChartGraph,
  schema: theme03ChartGraphSchema,
});
registerLayout<Theme03ChartSankeyProps>({
  meta: theme03ChartSankeyMeta,
  component: Theme03ChartSankey,
  schema: theme03ChartSankeySchema,
});
registerLayout<Theme03ChartSunburstProps>({
  meta: theme03ChartSunburstMeta,
  component: Theme03ChartSunburst,
  schema: theme03ChartSunburstSchema,
});
registerLayout<Theme03ProcessV1Props>({
  meta: theme03ProcessV1Meta,
  component: Theme03ProcessV1,
  schema: theme03ProcessV1Schema,
});
registerLayout<Theme03TimelineV1Props>({
  meta: theme03TimelineV1Meta,
  component: Theme03TimelineV1,
  schema: theme03TimelineV1Schema,
});
registerLayout<Theme03RoadmapV1Props>({
  meta: theme03RoadmapV1Meta,
  component: Theme03RoadmapV1,
  schema: theme03RoadmapV1Schema,
});
registerLayout<Theme03SwotV1Props>({
  meta: theme03SwotV1Meta,
  component: Theme03SwotV1,
  schema: theme03SwotV1Schema,
});
registerLayout<Theme03ClosingV1Props>({ meta: theme03ClosingV1Meta, component: Theme03ClosingV1, schema: theme03ClosingV1Schema });
registerLayout<Theme03TableOfContentsV1Props>({
  meta: theme03TableOfContentsV1Meta,
  component: Theme03TableOfContentsV1,
  schema: theme03TableOfContentsV1Schema,
});
registerLayout<Theme03MetricsV1Props>({
  meta: theme03MetricsV1Meta,
  component: Theme03MetricsV1,
  schema: theme03MetricsV1Schema,
});
registerLayout<Theme03FeatureV1Props>({
  meta: theme03FeatureV1Meta,
  component: Theme03FeatureV1,
  schema: theme03FeatureV1Schema,
});
registerLayout<Theme03ImageV1Props>({
  meta: theme03ImageV1Meta,
  component: Theme03ImageV1,
  schema: theme03ImageV1Schema,
});
registerLayout<Theme03TeamV1Props>({
  meta: theme03TeamV1Meta,
  component: Theme03TeamV1,
  schema: theme03TeamV1Schema,
});
registerLayout<Theme03PartnersV1Props>({
  meta: theme03PartnersV1Meta,
  component: Theme03PartnersV1,
  schema: theme03PartnersV1Schema,
});
registerLayout<Theme03PricingV1Props>({
  meta: theme03PricingV1Meta,
  component: Theme03PricingV1,
  schema: theme03PricingV1Schema,
});
registerLayout<Theme03ComparisonV1Props>({
  meta: theme03ComparisonV1Meta,
  component: Theme03ComparisonV1,
  schema: theme03ComparisonV1Schema,
});
registerLayout<Theme03FaqV1Props>({
  meta: theme03FaqV1Meta,
  component: Theme03FaqV1,
  schema: theme03FaqV1Schema,
});
registerLayout<Theme03GalleryV1Props>({
  meta: theme03GalleryV1Meta,
  component: Theme03GalleryV1,
  schema: theme03GalleryV1Schema,
});
registerLayout<Theme03NumberShowcaseV1Props>({
  meta: theme03NumberShowcaseV1Meta,
  component: Theme03NumberShowcaseV1,
  schema: theme03NumberShowcaseV1Schema,
});
registerLayout<Theme03BentoV1Props>({
  meta: theme03BentoV1Meta,
  component: Theme03BentoV1,
  schema: theme03BentoV1Schema,
});
registerLayout<Theme03QuadrantV1Props>({
  meta: theme03QuadrantV1Meta,
  component: Theme03QuadrantV1,
  schema: theme03QuadrantV1Schema,
});
registerLayout<Theme03TableV1Props>({
  meta: theme03TableV1Meta,
  component: Theme03TableV1,
  schema: theme03TableV1Schema,
});
registerLayout<Theme03TestimonialV1Props>({
  meta: theme03TestimonialV1Meta,
  component: Theme03TestimonialV1,
  schema: theme03TestimonialV1Schema,
});
registerLayout<Theme03TagsV1Props>({
  meta: theme03TagsV1Meta,
  component: Theme03TagsV1,
  schema: theme03TagsV1Schema,
});
registerLayout<Theme03ProgressV1Props>({
  meta: theme03ProgressV1Meta,
  component: Theme03ProgressV1,
  schema: theme03ProgressV1Schema,
});
registerLayout<Theme03MetricV1Props>({ meta: theme03MetricV1Meta, component: Theme03MetricV1, schema: theme03MetricV1Schema });
registerLayout<Theme03MetricV2Props>({ meta: theme03MetricV2Meta, component: Theme03MetricV2, schema: theme03MetricV2Schema });
registerLayout<Theme03MetricV3Props>({ meta: theme03MetricV3Meta, component: Theme03MetricV3, schema: theme03MetricV3Schema });
registerLayout<Theme03MetricTriptychProps>({ meta: theme03MetricTriptychMeta, component: Theme03MetricTriptych, schema: theme03MetricTriptychSchema });
registerLayout<Theme03ScorecardV1Props>({ meta: theme03ScorecardV1Meta, component: Theme03ScorecardV1, schema: theme03ScorecardV1Schema });
registerLayout<Theme03AppendixV1Props>({ meta: theme03AppendixV1Meta, component: Theme03AppendixV1, schema: theme03AppendixV1Schema });
registerLayout<Theme03CaseStudyProps>({ meta: theme03CaseStudyMeta, component: Theme03CaseStudy, schema: theme03CaseStudySchema });
registerLayout<Theme03OutlookV1Props>({ meta: theme03OutlookV1Meta, component: Theme03OutlookV1, schema: theme03OutlookV1Schema });
registerLayout<Theme03RegionV1Props>({ meta: theme03RegionV1Meta, component: Theme03RegionV1, schema: theme03RegionV1Schema });
registerLayout<Theme03RiskV1Props>({ meta: theme03RiskV1Meta, component: Theme03RiskV1, schema: theme03RiskV1Schema });
registerLayout<Theme03SpotlightGridProps>({ meta: theme03SpotlightGridMeta, component: Theme03SpotlightGrid, schema: theme03SpotlightGridSchema });
registerLayout<Theme03ConclusionV1Props>({ meta: theme03ConclusionV1Meta, component: Theme03ConclusionV1, schema: theme03ConclusionV1Schema });
registerLayout<Theme03DiptychContrastProps>({ meta: theme03DiptychContrastMeta, component: Theme03DiptychContrast, schema: theme03DiptychContrastSchema });
registerLayout<Theme03FilmstripV1Props>({ meta: theme03FilmstripV1Meta, component: Theme03FilmstripV1, schema: theme03FilmstripV1Schema });
registerLayout<Theme03GanttV1Props>({ meta: theme03GanttV1Meta, component: Theme03GanttV1, schema: theme03GanttV1Schema });
registerLayout<Theme03PestV1Props>({ meta: theme03PestV1Meta, component: Theme03PestV1, schema: theme03PestV1Schema });
registerLayout<Theme03StatsV1Props>({ meta: theme03StatsV1Meta, component: Theme03StatsV1, schema: theme03StatsV1Schema });
registerLayout<Theme03TableDataProps>({ meta: theme03TableDataMeta, component: Theme03TableData, schema: theme03TableDataSchema });
registerLayout<Theme03ChapterV2Props>({ meta: theme03ChapterV2Meta, component: Theme03ChapterV2, schema: theme03ChapterV2Schema });
registerLayout<Theme03ChapterV3Props>({ meta: theme03ChapterV3Meta, component: Theme03ChapterV3, schema: theme03ChapterV3Schema });
registerLayout<Theme03ClosingV2Props>({ meta: theme03ClosingV2Meta, component: Theme03ClosingV2, schema: theme03ClosingV2Schema });
registerLayout<Theme03ComparisonV2Props>({ meta: theme03ComparisonV2Meta, component: Theme03ComparisonV2, schema: theme03ComparisonV2Schema });
registerLayout<Theme03ComparisonV3Props>({ meta: theme03ComparisonV3Meta, component: Theme03ComparisonV3, schema: theme03ComparisonV3Schema });
registerLayout<Theme03ContentV2Props>({ meta: theme03ContentV2Meta, component: Theme03ContentV2, schema: theme03ContentV2Schema });
registerLayout<Theme03ContentV3Props>({ meta: theme03ContentV3Meta, component: Theme03ContentV3, schema: theme03ContentV3Schema });
registerLayout<Theme03ContentV4Props>({ meta: theme03ContentV4Meta, component: Theme03ContentV4, schema: theme03ContentV4Schema });
registerLayout<Theme03CoverV2Props>({ meta: theme03CoverV2Meta, component: Theme03CoverV2, schema: theme03CoverV2Schema });
registerLayout<Theme03CoverV3Props>({ meta: theme03CoverV3Meta, component: Theme03CoverV3, schema: theme03CoverV3Schema });
registerLayout<Theme03CoverV4Props>({ meta: theme03CoverV4Meta, component: Theme03CoverV4, schema: theme03CoverV4Schema });
registerLayout<Theme03FeatureV2Props>({ meta: theme03FeatureV2Meta, component: Theme03FeatureV2, schema: theme03FeatureV2Schema });
registerLayout<Theme03QuoteV2Props>({ meta: theme03QuoteV2Meta, component: Theme03QuoteV2, schema: theme03QuoteV2Schema });
registerLayout<Theme03QuoteV3Props>({ meta: theme03QuoteV3Meta, component: Theme03QuoteV3, schema: theme03QuoteV3Schema });
registerLayout<Theme03TableOfContentsV2Props>({ meta: theme03TableOfContentsV2Meta, component: Theme03TableOfContentsV2, schema: theme03TableOfContentsV2Schema });
registerLayout<Theme03TeamV2Props>({ meta: theme03TeamV2Meta, component: Theme03TeamV2, schema: theme03TeamV2Schema });

// 注册 Theme04 主题专属版式
registerLayout<Theme04CoverV1Props>({ meta: theme04CoverV1Meta, component: Theme04CoverV1, schema: theme04CoverV1Schema });
registerLayout<Theme04ChapterV1Props>({ meta: theme04ChapterV1Meta, component: Theme04ChapterV1, schema: theme04ChapterV1Schema });
registerLayout<Theme04ContentV1Props>({ meta: theme04ContentV1Meta, component: Theme04ContentV1, schema: theme04ContentV1Schema });
registerLayout<Theme04MetricV1Props>({ meta: theme04MetricV1Meta, component: Theme04MetricV1, schema: theme04MetricV1Schema });
registerLayout<Theme04ChartV1Props>({ meta: theme04ChartV1Meta, component: Theme04ChartV1, schema: theme04ChartV1Schema });
registerLayout<Theme04QuoteV1Props>({ meta: theme04QuoteV1Meta, component: Theme04QuoteV1, schema: theme04QuoteV1Schema });
registerLayout<Theme04ImageV1Props>({ meta: theme04ImageV1Meta, component: Theme04ImageV1, schema: theme04ImageV1Schema });
registerLayout<Theme04ClosingV1Props>({ meta: theme04ClosingV1Meta, component: Theme04ClosingV1, schema: theme04ClosingV1Schema });
registerLayout<Theme04TableOfContentsV1Props>({ meta: theme04TableOfContentsV1Meta, component: Theme04TableOfContentsV1, schema: theme04TableOfContentsV1Schema });
registerLayout<Theme04FeatureV1Props>({ meta: theme04FeatureV1Meta, component: Theme04FeatureV1, schema: theme04FeatureV1Schema });
registerLayout<Theme04BentoV1Props>({ meta: theme04BentoV1Meta, component: Theme04BentoV1, schema: theme04BentoV1Schema });
registerLayout<Theme04TeamV1Props>({ meta: theme04TeamV1Meta, component: Theme04TeamV1, schema: theme04TeamV1Schema });
registerLayout<Theme04ChartDonutProps>({ meta: theme04ChartDonutMeta, component: Theme04ChartDonut, schema: theme04ChartDonutSchema });
registerLayout<Theme04MetricBigProps>({ meta: theme04MetricBigMeta, component: Theme04MetricBig, schema: theme04MetricBigSchema });
registerLayout<Theme04ProcessV1Props>({ meta: theme04ProcessV1Meta, component: Theme04ProcessV1, schema: theme04ProcessV1Schema });
registerLayout<Theme04GalleryV1Props>({ meta: theme04GalleryV1Meta, component: Theme04GalleryV1, schema: theme04GalleryV1Schema });
registerLayout<Theme04StatsV1Props>({ meta: theme04StatsV1Meta, component: Theme04StatsV1, schema: theme04StatsV1Schema });
registerLayout<Theme04ComparisonV1Props>({ meta: theme04ComparisonV1Meta, component: Theme04ComparisonV1, schema: theme04ComparisonV1Schema });
registerLayout<Theme04TableV1Props>({ meta: theme04TableV1Meta, component: Theme04TableV1, schema: theme04TableV1Schema });
registerLayout<Theme04TimelineV1Props>({ meta: theme04TimelineV1Meta, component: Theme04TimelineV1, schema: theme04TimelineV1Schema });
registerLayout<Theme04RoadmapV1Props>({ meta: theme04RoadmapV1Meta, component: Theme04RoadmapV1, schema: theme04RoadmapV1Schema });
registerLayout<Theme04RankingV1Props>({ meta: theme04RankingV1Meta, component: Theme04RankingV1, schema: theme04RankingV1Schema });
registerLayout<Theme04CaseV1Props>({ meta: theme04CaseV1Meta, component: Theme04CaseV1, schema: theme04CaseV1Schema });
registerLayout<Theme04QuadrantV1Props>({ meta: theme04QuadrantV1Meta, component: Theme04QuadrantV1, schema: theme04QuadrantV1Schema });
registerLayout<Theme04AgendaV1Props>({ meta: theme04AgendaV1Meta, component: Theme04AgendaV1, schema: theme04AgendaV1Schema });
registerLayout<Theme04CoverIndexV1Props>({ meta: theme04CoverIndexV1Meta, component: Theme04CoverIndexV1, schema: theme04CoverIndexV1Schema });
registerLayout<Theme04ChapterV2Props>({ meta: theme04ChapterV2Meta, component: Theme04ChapterV2, schema: theme04ChapterV2Schema });
registerLayout<Theme04ImageQuoteV1Props>({ meta: theme04ImageQuoteV1Meta, component: Theme04ImageQuoteV1, schema: theme04ImageQuoteV1Schema });
registerLayout<Theme04EditorialV1Props>({ meta: theme04EditorialV1Meta, component: Theme04EditorialV1, schema: theme04EditorialV1Schema });
registerLayout<Theme04TriptychV1Props>({ meta: theme04TriptychV1Meta, component: Theme04TriptychV1, schema: theme04TriptychV1Schema });
registerLayout<Theme04GanttV1Props>({ meta: theme04GanttV1Meta, component: Theme04GanttV1, schema: theme04GanttV1Schema });
registerLayout<Theme04RadarV1Props>({ meta: theme04RadarV1Meta, component: Theme04RadarV1, schema: theme04RadarV1Schema });
registerLayout<Theme04HeatmapV1Props>({ meta: theme04HeatmapV1Meta, component: Theme04HeatmapV1, schema: theme04HeatmapV1Schema });
registerLayout<Theme04CoverGhostV1Props>({ meta: theme04CoverGhostV1Meta, component: Theme04CoverGhostV1, schema: theme04CoverGhostV1Schema });
registerLayout<Theme04CardsV1Props>({ meta: theme04CardsV1Meta, component: Theme04CardsV1, schema: theme04CardsV1Schema });
registerLayout<Theme04GaugesV1Props>({ meta: theme04GaugesV1Meta, component: Theme04GaugesV1, schema: theme04GaugesV1Schema });
registerLayout<Theme04CoverBentoV1Props>({ meta: theme04CoverBentoV1Meta, component: Theme04CoverBentoV1, schema: theme04CoverBentoV1Schema });
registerLayout<Theme04CoverMagazineV1Props>({ meta: theme04CoverMagazineV1Meta, component: Theme04CoverMagazineV1, schema: theme04CoverMagazineV1Schema });
registerLayout<Theme04ChapterSplitV1Props>({ meta: theme04ChapterSplitV1Meta, component: Theme04ChapterSplitV1, schema: theme04ChapterSplitV1Schema });
registerLayout<Theme04ChapterNumberedV1Props>({ meta: theme04ChapterNumberedV1Meta, component: Theme04ChapterNumberedV1, schema: theme04ChapterNumberedV1Schema });
registerLayout<Theme04DeltaV1Props>({ meta: theme04DeltaV1Meta, component: Theme04DeltaV1, schema: theme04DeltaV1Schema });
registerLayout<Theme04VersusV1Props>({ meta: theme04VersusV1Meta, component: Theme04VersusV1, schema: theme04VersusV1Schema });
registerLayout<Theme04TrioV1Props>({ meta: theme04TrioV1Meta, component: Theme04TrioV1, schema: theme04TrioV1Schema });
registerLayout<Theme04PolaroidV1Props>({ meta: theme04PolaroidV1Meta, component: Theme04PolaroidV1, schema: theme04PolaroidV1Schema });
registerLayout<Theme04VerdictV1Props>({ meta: theme04VerdictV1Meta, component: Theme04VerdictV1, schema: theme04VerdictV1Schema });
registerLayout<Theme04TreemapV1Props>({ meta: theme04TreemapV1Meta, component: Theme04TreemapV1, schema: theme04TreemapV1Schema });
registerLayout<Theme04ScoreboardV1Props>({ meta: theme04ScoreboardV1Meta, component: Theme04ScoreboardV1, schema: theme04ScoreboardV1Schema });
registerLayout<Theme04ScorecardsV1Props>({ meta: theme04ScorecardsV1Meta, component: Theme04ScorecardsV1, schema: theme04ScorecardsV1Schema });
registerLayout<Theme04MatrixV1Props>({ meta: theme04MatrixV1Meta, component: Theme04MatrixV1, schema: theme04MatrixV1Schema });
registerLayout<Theme04LayersV1Props>({ meta: theme04LayersV1Meta, component: Theme04LayersV1, schema: theme04LayersV1Schema });
registerLayout<Theme04GroupbarsV1Props>({ meta: theme04GroupbarsV1Meta, component: Theme04GroupbarsV1, schema: theme04GroupbarsV1Schema });
registerLayout<Theme04ScatterV1Props>({ meta: theme04ScatterV1Meta, component: Theme04ScatterV1, schema: theme04ScatterV1Schema });
registerLayout<Theme04SlopeV1Props>({ meta: theme04SlopeV1Meta, component: Theme04SlopeV1, schema: theme04SlopeV1Schema });
registerLayout<Theme04WaterfallV1Props>({ meta: theme04WaterfallV1Meta, component: Theme04WaterfallV1, schema: theme04WaterfallV1Schema });
registerLayout<Theme04RegionV1Props>({ meta: theme04RegionV1Meta, component: Theme04RegionV1, schema: theme04RegionV1Schema });
registerLayout<Theme04ValuechartV1Props>({ meta: theme04ValuechartV1Meta, component: Theme04ValuechartV1, schema: theme04ValuechartV1Schema });
registerLayout<Theme04FilmstripV1Props>({ meta: theme04FilmstripV1Meta, component: Theme04FilmstripV1, schema: theme04FilmstripV1Schema });
registerLayout<Theme04DiptychV1Props>({ meta: theme04DiptychV1Meta, component: Theme04DiptychV1, schema: theme04DiptychV1Schema });
registerLayout<Theme04VoicesV1Props>({ meta: theme04VoicesV1Meta, component: Theme04VoicesV1, schema: theme04VoicesV1Schema });
registerLayout<Theme04AnnotatedV1Props>({ meta: theme04AnnotatedV1Meta, component: Theme04AnnotatedV1, schema: theme04AnnotatedV1Schema });
registerLayout<Theme04ImagestoryV1Props>({ meta: theme04ImagestoryV1Meta, component: Theme04ImagestoryV1, schema: theme04ImagestoryV1Schema });
registerLayout<Theme04DumbbellV1Props>({ meta: theme04DumbbellV1Meta, component: Theme04DumbbellV1, schema: theme04DumbbellV1Schema });
registerLayout<Theme04PyramidV1Props>({ meta: theme04PyramidV1Meta, component: Theme04PyramidV1, schema: theme04PyramidV1Schema });
registerLayout<Theme04RiskchainV1Props>({ meta: theme04RiskchainV1Meta, component: Theme04RiskchainV1, schema: theme04RiskchainV1Schema });
registerLayout<Theme04MetroV1Props>({ meta: theme04MetroV1Meta, component: Theme04MetroV1, schema: theme04MetroV1Schema });
registerLayout<Theme04ShowcaseV1Props>({ meta: theme04ShowcaseV1Meta, component: Theme04ShowcaseV1, schema: theme04ShowcaseV1Schema });
registerLayout<Theme04CoverHeroV1Props>({ meta: theme04CoverHeroV1Meta, component: Theme04CoverHeroV1, schema: theme04CoverHeroV1Schema });
registerLayout<Theme04MonthchartV1Props>({ meta: theme04MonthchartV1Meta, component: Theme04MonthchartV1, schema: theme04MonthchartV1Schema });
registerLayout<Theme04StackedV1Props>({ meta: theme04StackedV1Meta, component: Theme04StackedV1, schema: theme04StackedV1Schema });
registerLayout<Theme04CalendarV1Props>({ meta: theme04CalendarV1Meta, component: Theme04CalendarV1, schema: theme04CalendarV1Schema });
registerLayout<Theme04QuartertableV1Props>({ meta: theme04QuartertableV1Meta, component: Theme04QuartertableV1, schema: theme04QuartertableV1Schema });
registerLayout<Theme04SpreadV1Props>({ meta: theme04SpreadV1Meta, component: Theme04SpreadV1, schema: theme04SpreadV1Schema });
registerLayout<Theme04ChaintableV1Props>({ meta: theme04ChaintableV1Meta, component: Theme04ChaintableV1, schema: theme04ChaintableV1Schema });
registerLayout<Theme04ChainflowV1Props>({ meta: theme04ChainflowV1Meta, component: Theme04ChainflowV1, schema: theme04ChainflowV1Schema });
registerLayout<Theme04LedgerV1Props>({ meta: theme04LedgerV1Meta, component: Theme04LedgerV1, schema: theme04LedgerV1Schema });

// Theme05 光谱报告风版式
registerLayout<Theme05CoverV1Props>({ meta: theme05CoverV1Meta, component: Theme05CoverV1, schema: theme05CoverV1Schema });
registerLayout<Theme05TableOfContentsV1Props>({ meta: theme05TableOfContentsV1Meta, component: Theme05TableOfContentsV1, schema: theme05TableOfContentsV1Schema });
registerLayout<Theme05ChapterV1Props>({ meta: theme05ChapterV1Meta, component: Theme05ChapterV1, schema: theme05ChapterV1Schema });
registerLayout<Theme05ContentV1Props>({ meta: theme05ContentV1Meta, component: Theme05ContentV1, schema: theme05ContentV1Schema });
registerLayout<Theme05MetricV1Props>({ meta: theme05MetricV1Meta, component: Theme05MetricV1, schema: theme05MetricV1Schema });
registerLayout<Theme05ChartV1Props>({ meta: theme05ChartV1Meta, component: Theme05ChartV1, schema: theme05ChartV1Schema });
registerLayout<Theme05BubbleV1Props>({ meta: theme05BubbleV1Meta, component: Theme05BubbleV1, schema: theme05BubbleV1Schema });
registerLayout<Theme05MapV1Props>({ meta: theme05MapV1Meta, component: Theme05MapV1, schema: theme05MapV1Schema });
registerLayout<Theme05RankV1Props>({ meta: theme05RankV1Meta, component: Theme05RankV1, schema: theme05RankV1Schema });
registerLayout<Theme05HeatmapV1Props>({ meta: theme05HeatmapV1Meta, component: Theme05HeatmapV1, schema: theme05HeatmapV1Schema });
registerLayout<Theme05WaterfallV1Props>({ meta: theme05WaterfallV1Meta, component: Theme05WaterfallV1, schema: theme05WaterfallV1Schema });
registerLayout<Theme05QuoteV1Props>({ meta: theme05QuoteV1Meta, component: Theme05QuoteV1, schema: theme05QuoteV1Schema });
registerLayout<Theme05ImageV1Props>({ meta: theme05ImageV1Meta, component: Theme05ImageV1, schema: theme05ImageV1Schema });
registerLayout<Theme05VersusV1Props>({ meta: theme05VersusV1Meta, component: Theme05VersusV1, schema: theme05VersusV1Schema });
registerLayout<Theme05ProcessV1Props>({ meta: theme05ProcessV1Meta, component: Theme05ProcessV1, schema: theme05ProcessV1Schema });
registerLayout<Theme05TimelineV1Props>({ meta: theme05TimelineV1Meta, component: Theme05TimelineV1, schema: theme05TimelineV1Schema });
registerLayout<Theme05MatrixV1Props>({ meta: theme05MatrixV1Meta, component: Theme05MatrixV1, schema: theme05MatrixV1Schema });
registerLayout<Theme05QuadrantV1Props>({ meta: theme05QuadrantV1Meta, component: Theme05QuadrantV1, schema: theme05QuadrantV1Schema });
registerLayout<Theme05RiskV1Props>({ meta: theme05RiskV1Meta, component: Theme05RiskV1, schema: theme05RiskV1Schema });
registerLayout<Theme05DonutV1Props>({ meta: theme05DonutV1Meta, component: Theme05DonutV1, schema: theme05DonutV1Schema });
registerLayout<Theme05TreemapV1Props>({ meta: theme05TreemapV1Meta, component: Theme05TreemapV1, schema: theme05TreemapV1Schema });
registerLayout<Theme05RadarV1Props>({ meta: theme05RadarV1Meta, component: Theme05RadarV1, schema: theme05RadarV1Schema });
registerLayout<Theme05ClosingV1Props>({ meta: theme05ClosingV1Meta, component: Theme05ClosingV1, schema: theme05ClosingV1Schema });
registerLayout<Theme05ScorecardsV1Props>({ meta: theme05ScorecardsV1Meta, component: Theme05ScorecardsV1, schema: theme05ScorecardsV1Schema });
registerLayout<Theme05ProfileV1Props>({ meta: theme05ProfileV1Meta, component: Theme05ProfileV1, schema: theme05ProfileV1Schema });
registerLayout<Theme05CaseV1Props>({ meta: theme05CaseV1Meta, component: Theme05CaseV1, schema: theme05CaseV1Schema });
registerLayout<Theme05BentoV1Props>({ meta: theme05BentoV1Meta, component: Theme05BentoV1, schema: theme05BentoV1Schema });
registerLayout<Theme05GalleryV1Props>({ meta: theme05GalleryV1Meta, component: Theme05GalleryV1, schema: theme05GalleryV1Schema });
registerLayout<Theme05RoadmapV1Props>({ meta: theme05RoadmapV1Meta, component: Theme05RoadmapV1, schema: theme05RoadmapV1Schema });
registerLayout<Theme05EditorialV1Props>({ meta: theme05EditorialV1Meta, component: Theme05EditorialV1, schema: theme05EditorialV1Schema });

// Theme05 Phase A 新增版式
registerLayout<Theme05CoverExV1Props>({ meta: theme05CoverExV1Meta, component: Theme05CoverExV1, schema: theme05CoverExV1Schema });
registerLayout<Theme05CoverExV2Props>({ meta: theme05CoverExV2Meta, component: Theme05CoverExV2, schema: theme05CoverExV2Schema });
registerLayout<Theme05CoverHeroV1Props>({ meta: theme05CoverHeroV1Meta, component: Theme05CoverHeroV1, schema: theme05CoverHeroV1Schema });
registerLayout<Theme05ChapterBigV1Props>({ meta: theme05ChapterBigV1Meta, component: Theme05ChapterBigV1, schema: theme05ChapterBigV1Schema });
registerLayout<Theme05ChapterSplitV1Props>({ meta: theme05ChapterSplitV1Meta, component: Theme05ChapterSplitV1, schema: theme05ChapterSplitV1Schema });
registerLayout<Theme05ChapterNumberedV1Props>({ meta: theme05ChapterNumberedV1Meta, component: Theme05ChapterNumberedV1, schema: theme05ChapterNumberedV1Schema });
registerLayout<Theme05ChapterImageV1Props>({ meta: theme05ChapterImageV1Meta, component: Theme05ChapterImageV1, schema: theme05ChapterImageV1Schema });
registerLayout<Theme05MetricHeroV1Props>({ meta: theme05MetricHeroV1Meta, component: Theme05MetricHeroV1, schema: theme05MetricHeroV1Schema });
registerLayout<Theme05MetricDeltaV1Props>({ meta: theme05MetricDeltaV1Meta, component: Theme05MetricDeltaV1, schema: theme05MetricDeltaV1Schema });
registerLayout<Theme05MetricCapacityV1Props>({ meta: theme05MetricCapacityV1Meta, component: Theme05MetricCapacityV1, schema: theme05MetricCapacityV1Schema });
registerLayout<Theme05ChartShareV1Props>({ meta: theme05ChartShareV1Meta, component: Theme05ChartShareV1, schema: theme05ChartShareV1Schema });
registerLayout<Theme05ChartStackedV1Props>({ meta: theme05ChartStackedV1Meta, component: Theme05ChartStackedV1, schema: theme05ChartStackedV1Schema });
registerLayout<Theme05ChartCurveV1Props>({ meta: theme05ChartCurveV1Meta, component: Theme05ChartCurveV1, schema: theme05ChartCurveV1Schema });
registerLayout<Theme05ChartPeakV1Props>({ meta: theme05ChartPeakV1Meta, component: Theme05ChartPeakV1, schema: theme05ChartPeakV1Schema });
registerLayout<Theme05ChartPeaktroughV1Props>({ meta: theme05ChartPeaktroughV1Meta, component: Theme05ChartPeaktroughV1, schema: theme05ChartPeaktroughV1Schema });
registerLayout<Theme05ChartCumulativeV1Props>({ meta: theme05ChartCumulativeV1Meta, component: Theme05ChartCumulativeV1, schema: theme05ChartCumulativeV1Schema });

// Phase B 新版式
registerLayout<Theme05TableOfContentsV2Props>({ meta: theme05TableOfContentsV2Meta, component: Theme05TableOfContentsV2, schema: theme05TableOfContentsV2Schema });
registerLayout<Theme05ProcessV2Props>({ meta: theme05ProcessV2Meta, component: Theme05ProcessV2, schema: theme05ProcessV2Schema });
registerLayout<Theme05ComparisonV1Props>({ meta: theme05ComparisonV1Meta, component: Theme05ComparisonV1, schema: theme05ComparisonV1Schema });
registerLayout<Theme05ChartFunnelV1Props>({ meta: theme05ChartFunnelV1Meta, component: Theme05ChartFunnelV1, schema: theme05ChartFunnelV1Schema });
registerLayout<Theme05QuoteV2Props>({ meta: theme05QuoteV2Meta, component: Theme05QuoteV2, schema: theme05QuoteV2Schema });
registerLayout<Theme05ChartGaugeV1Props>({ meta: theme05ChartGaugeV1Meta, component: Theme05ChartGaugeV1, schema: theme05ChartGaugeV1Schema });

// Theme06 深色图谱风版式（Phase 1）
registerLayout<Theme06CoverV1Props>({ meta: theme06CoverV1Meta, component: Theme06CoverV1, schema: theme06CoverV1Schema });
registerLayout<Theme06ChapterV1Props>({ meta: theme06ChapterV1Meta, component: Theme06ChapterV1, schema: theme06ChapterV1Schema });
registerLayout<Theme06ContentV1Props>({ meta: theme06ContentV1Meta, component: Theme06ContentV1, schema: theme06ContentV1Schema });
registerLayout<Theme06ContentNumberedV1Props>({ meta: theme06ContentNumberedV1Meta, component: Theme06ContentNumberedV1, schema: theme06ContentNumberedV1Schema });
registerLayout<Theme06MetricHeroV1Props>({ meta: theme06MetricHeroV1Meta, component: Theme06MetricHeroV1, schema: theme06MetricHeroV1Schema });
registerLayout<Theme06VerticalBarV1Props>({ meta: theme06VerticalBarV1Meta, component: Theme06VerticalBarV1, schema: theme06VerticalBarV1Schema });
registerLayout<Theme06ChartV1Props>({ meta: theme06ChartV1Meta, component: Theme06ChartV1, schema: theme06ChartV1Schema });
registerLayout<Theme06QuoteV1Props>({ meta: theme06QuoteV1Meta, component: Theme06QuoteV1, schema: theme06QuoteV1Schema });
// Theme06 深色图谱风版式（Phase 2）
registerLayout<Theme06MetricGridV1Props>({ meta: theme06MetricGridV1Meta, component: Theme06MetricGridV1, schema: theme06MetricGridV1Schema });
registerLayout<Theme06RankV1Props>({ meta: theme06RankV1Meta, component: Theme06RankV1, schema: theme06RankV1Schema });
registerLayout<Theme06MatrixV1Props>({ meta: theme06MatrixV1Meta, component: Theme06MatrixV1, schema: theme06MatrixV1Schema });
registerLayout<Theme06ChartRadarV1Props>({ meta: theme06ChartRadarV1Meta, component: Theme06ChartRadarV1, schema: theme06ChartRadarV1Schema });
registerLayout<Theme06ChartWaterfallV1Props>({ meta: theme06ChartWaterfallV1Meta, component: Theme06ChartWaterfallV1, schema: theme06ChartWaterfallV1Schema });
registerLayout<Theme06ChartPeakV1Props>({ meta: theme06ChartPeakV1Meta, component: Theme06ChartPeakV1, schema: theme06ChartPeakV1Schema });
// Theme06 深色图谱风版式（Phase 3）
registerLayout<Theme06ProcessV1Props>({ meta: theme06ProcessV1Meta, component: Theme06ProcessV1, schema: theme06ProcessV1Schema });
registerLayout<Theme06TimelineV1Props>({ meta: theme06TimelineV1Meta, component: Theme06TimelineV1, schema: theme06TimelineV1Schema });
registerLayout<Theme06CaseV1Props>({ meta: theme06CaseV1Meta, component: Theme06CaseV1, schema: theme06CaseV1Schema });
registerLayout<Theme06CaseV2Props>({ meta: theme06CaseV2Meta, component: Theme06CaseV2, schema: theme06CaseV2Schema });
registerLayout<Theme06RiskV1Props>({ meta: theme06RiskV1Meta, component: Theme06RiskV1, schema: theme06RiskV1Schema });
registerLayout<Theme06RiskV2Props>({ meta: theme06RiskV2Meta, component: Theme06RiskV2, schema: theme06RiskV2Schema });
registerLayout<Theme06ChartGraphV1Props>({ meta: theme06ChartGraphV1Meta, component: Theme06ChartGraphV1, schema: theme06ChartGraphV1Schema });
registerLayout<Theme06MapV1Props>({ meta: theme06MapV1Meta, component: Theme06MapV1, schema: theme06MapV1Schema });
registerLayout<Theme06TableOfContentsV1Props>({ meta: theme06TableOfContentsV1Meta, component: Theme06TableOfContentsV1, schema: theme06TableOfContentsV1Schema });
registerLayout<Theme06SummaryV1Props>({ meta: theme06SummaryV1Meta, component: Theme06SummaryV1, schema: theme06SummaryV1Schema });
registerLayout<Theme06ClosingV1Props>({ meta: theme06ClosingV1Meta, component: Theme06ClosingV1, schema: theme06ClosingV1Schema });
registerLayout<Theme06SourcesV1Props>({ meta: theme06SourcesV1Meta, component: Theme06SourcesV1, schema: theme06SourcesV1Schema });
registerLayout<Theme06ChartHeatmapV1Props>({ meta: theme06ChartHeatmapV1Meta, component: Theme06ChartHeatmapV1, schema: theme06ChartHeatmapV1Schema });
registerLayout<Theme06BentoV1Props>({ meta: theme06BentoV1Meta, component: Theme06BentoV1, schema: theme06BentoV1Schema });
registerLayout<Theme06ComparisonV1Props>({ meta: theme06ComparisonV1Meta, component: Theme06ComparisonV1, schema: theme06ComparisonV1Schema });
// Theme06 深色图谱风版式（扩展）
registerLayout<Theme06SectorSpotlightV1Props>({ meta: theme06SectorSpotlightV1Meta, component: Theme06SectorSpotlightV1, schema: theme06SectorSpotlightV1Schema });
registerLayout<Theme06TechLandscapeV1Props>({ meta: theme06TechLandscapeV1Meta, component: Theme06TechLandscapeV1, schema: theme06TechLandscapeV1Schema });
registerLayout<Theme06CompanyProfileV1Props>({ meta: theme06CompanyProfileV1Meta, component: Theme06CompanyProfileV1, schema: theme06CompanyProfileV1Schema });
registerLayout<Theme06ChainFlowV1Props>({ meta: theme06ChainFlowV1Meta, component: Theme06ChainFlowV1, schema: theme06ChainFlowV1Schema });
registerLayout<Theme06QuarterTableV1Props>({ meta: theme06QuarterTableV1Meta, component: Theme06QuarterTableV1, schema: theme06QuarterTableV1Schema });
registerLayout<Theme06MetricShowcaseV1Props>({ meta: theme06MetricShowcaseV1Meta, component: Theme06MetricShowcaseV1, schema: theme06MetricShowcaseV1Schema });
registerLayout<Theme06MilestoneV1Props>({ meta: theme06MilestoneV1Meta, component: Theme06MilestoneV1, schema: theme06MilestoneV1Schema });
registerLayout<Theme06RiskMatrixV1Props>({ meta: theme06RiskMatrixV1Meta, component: Theme06RiskMatrixV1, schema: theme06RiskMatrixV1Schema });
registerLayout<Theme06SectorComparisonV1Props>({ meta: theme06SectorComparisonV1Meta, component: Theme06SectorComparisonV1, schema: theme06SectorComparisonV1Schema });
registerLayout<Theme06GeoDistributionV1Props>({ meta: theme06GeoDistributionV1Meta, component: Theme06GeoDistributionV1, schema: theme06GeoDistributionV1Schema });
registerLayout<Theme06GeoHeatmapV1Props>({ meta: theme06GeoHeatmapV1Meta, component: Theme06GeoHeatmapV1, schema: theme06GeoHeatmapV1Schema });
registerLayout<Theme06EcosystemGraphV1Props>({ meta: theme06EcosystemGraphV1Meta, component: Theme06EcosystemGraphV1, schema: theme06EcosystemGraphV1Schema });
registerLayout<Theme06CoverProductV1Props>({ meta: theme06CoverProductV1Meta, component: Theme06CoverProductV1, schema: theme06CoverProductV1Schema });
registerLayout<Theme06CoverBusinessV1Props>({ meta: theme06CoverBusinessV1Meta, component: Theme06CoverBusinessV1, schema: theme06CoverBusinessV1Schema });
registerLayout<Theme06ChapterNumberedV1Props>({ meta: theme06ChapterNumberedV1Meta, component: Theme06ChapterNumberedV1, schema: theme06ChapterNumberedV1Schema });
registerLayout<Theme06ChapterSplitV1Props>({ meta: theme06ChapterSplitV1Meta, component: Theme06ChapterSplitV1, schema: theme06ChapterSplitV1Schema });
registerLayout<Theme06TrendV1Props>({ meta: theme06TrendV1Meta, component: Theme06TrendV1, schema: theme06TrendV1Schema });
registerLayout<Theme06CumulativeV1Props>({ meta: theme06CumulativeV1Meta, component: Theme06CumulativeV1, schema: theme06CumulativeV1Schema });
registerLayout<Theme06QuadrantV1Props>({ meta: theme06QuadrantV1Meta, component: Theme06QuadrantV1, schema: theme06QuadrantV1Schema });
registerLayout<Theme06OutlookV1Props>({ meta: theme06OutlookV1Meta, component: Theme06OutlookV1, schema: theme06OutlookV1Schema });
registerLayout<Theme06RecapV1Props>({ meta: theme06RecapV1Meta, component: Theme06RecapV1, schema: theme06RecapV1Schema });
registerLayout<Theme06CompanyRoundsV1Props>({ meta: theme06CompanyRoundsV1Meta, component: Theme06CompanyRoundsV1, schema: theme06CompanyRoundsV1Schema });
registerLayout<Theme06CompanyInvestorsV1Props>({ meta: theme06CompanyInvestorsV1Meta, component: Theme06CompanyInvestorsV1, schema: theme06CompanyInvestorsV1Schema });
registerLayout<Theme06CompanyComparisonV1Props>({ meta: theme06CompanyComparisonV1Meta, component: Theme06CompanyComparisonV1, schema: theme06CompanyComparisonV1Schema });
registerLayout<Theme06GeoCitiesV1Props>({ meta: theme06GeoCitiesV1Meta, component: Theme06GeoCitiesV1, schema: theme06GeoCitiesV1Schema });
registerLayout<Theme06AgentV1Props>({ meta: theme06AgentV1Meta, component: Theme06AgentV1, schema: theme06AgentV1Schema });
registerLayout<Theme06SearchV1Props>({ meta: theme06SearchV1Meta, component: Theme06SearchV1, schema: theme06SearchV1Schema });
registerLayout<Theme06CoverManufacturingV1Props>({ meta: theme06CoverManufacturingV1Meta, component: Theme06CoverManufacturingV1, schema: theme06CoverManufacturingV1Schema });
registerLayout<Theme06CoverBrandV1Props>({ meta: theme06CoverBrandV1Meta, component: Theme06CoverBrandV1, schema: theme06CoverBrandV1Schema });
registerLayout<Theme06MethodV1Props>({ meta: theme06MethodV1Meta, component: Theme06MethodV1, schema: theme06MethodV1Schema });
registerLayout<Theme06QuarterQ1V1Props>({ meta: theme06QuarterQ1V1Meta, component: Theme06QuarterQ1V1, schema: theme06QuarterQ1V1Schema });
registerLayout<Theme06QuarterQ2V1Props>({ meta: theme06QuarterQ2V1Meta, component: Theme06QuarterQ2V1, schema: theme06QuarterQ2V1Schema });
registerLayout<Theme06QuarterQ3V1Props>({ meta: theme06QuarterQ3V1Meta, component: Theme06QuarterQ3V1, schema: theme06QuarterQ3V1Schema });
registerLayout<Theme06QuarterQ4V1Props>({ meta: theme06QuarterQ4V1Meta, component: Theme06QuarterQ4V1, schema: theme06QuarterQ4V1Schema });
registerLayout<Theme06BigNumberV1Props>({ meta: theme06BigNumberV1Meta, component: Theme06BigNumberV1, schema: theme06BigNumberV1Schema });
registerLayout<Theme06ChapterFocusV1Props>({ meta: theme06ChapterFocusV1Meta, component: Theme06ChapterFocusV1, schema: theme06ChapterFocusV1Schema });
registerLayout<Theme06ChapterImageV1Props>({ meta: theme06ChapterImageV1Meta, component: Theme06ChapterImageV1, schema: theme06ChapterImageV1Schema });
registerLayout<Theme06ChapterMinimalV1Props>({ meta: theme06ChapterMinimalV1Meta, component: Theme06ChapterMinimalV1, schema: theme06ChapterMinimalV1Schema });
registerLayout<Theme06DealMapV1Props>({ meta: theme06DealMapV1Meta, component: Theme06DealMapV1, schema: theme06DealMapV1Schema });
registerLayout<Theme06SizeSplitV1Props>({ meta: theme06SizeSplitV1Meta, component: Theme06SizeSplitV1, schema: theme06SizeSplitV1Schema });
registerLayout<Theme06TriadV1Props>({ meta: theme06TriadV1Meta, component: Theme06TriadV1, schema: theme06TriadV1Schema });
registerLayout<Theme06CapitalFlowV1Props>({ meta: theme06CapitalFlowV1Meta, component: Theme06CapitalFlowV1, schema: theme06CapitalFlowV1Schema });
registerLayout<Theme06LegalV1Props>({ meta: theme06LegalV1Meta, component: Theme06LegalV1, schema: theme06LegalV1Schema });
registerLayout<Theme06OpenRiskV1Props>({ meta: theme06OpenRiskV1Meta, component: Theme06OpenRiskV1, schema: theme06OpenRiskV1Schema });
registerLayout<Theme06RegionRiskV1Props>({ meta: theme06RegionRiskV1Meta, component: Theme06RegionRiskV1, schema: theme06RegionRiskV1Schema });
registerLayout<Theme06RevenueRiskV1Props>({ meta: theme06RevenueRiskV1Meta, component: Theme06RevenueRiskV1, schema: theme06RevenueRiskV1Schema });
// Theme06 深色图谱风版式（继续补充）
registerLayout<Theme06AvgTicketV1Props>({ meta: theme06AvgTicketV1Meta, component: Theme06AvgTicketV1, schema: theme06AvgTicketV1Schema });
registerLayout<Theme06IndustryVerticalV1Props>({ meta: theme06IndustryVerticalV1Meta, component: Theme06IndustryVerticalV1, schema: theme06IndustryVerticalV1Schema });
registerLayout<Theme06IndustryInfrastructureV1Props>({ meta: theme06IndustryInfrastructureV1Meta, component: Theme06IndustryInfrastructureV1, schema: theme06IndustryInfrastructureV1Schema });
registerLayout<Theme06IndustryFinanceV1Props>({ meta: theme06IndustryFinanceV1Meta, component: Theme06IndustryFinanceV1, schema: theme06IndustryFinanceV1Schema });
registerLayout<Theme06IndustryGrowthV1Props>({ meta: theme06IndustryGrowthV1Meta, component: Theme06IndustryGrowthV1, schema: theme06IndustryGrowthV1Schema });
registerLayout<Theme06IndustrySafetyV1Props>({ meta: theme06IndustrySafetyV1Meta, component: Theme06IndustrySafetyV1, schema: theme06IndustrySafetyV1Schema });
registerLayout<Theme06CompanySpotlightV1Props>({ meta: theme06CompanySpotlightV1Meta, component: Theme06CompanySpotlightV1, schema: theme06CompanySpotlightV1Schema });
registerLayout<Theme06IpoWatchV1Props>({ meta: theme06IpoWatchV1Meta, component: Theme06IpoWatchV1, schema: theme06IpoWatchV1Schema });
registerLayout<Theme06StatementV1Props>({ meta: theme06StatementV1Meta, component: Theme06StatementV1, schema: theme06StatementV1Schema });
registerLayout<Theme06AllianceV1Props>({ meta: theme06AllianceV1Meta, component: Theme06AllianceV1, schema: theme06AllianceV1Schema });
registerLayout<Theme06ComputeV1Props>({ meta: theme06ComputeV1Meta, component: Theme06ComputeV1, schema: theme06ComputeV1Schema });
registerLayout<Theme06DealStructureV1Props>({ meta: theme06DealStructureV1Meta, component: Theme06DealStructureV1, schema: theme06DealStructureV1Schema });
registerLayout<Theme06MegadealsV1Props>({ meta: theme06MegadealsV1Meta, component: Theme06MegadealsV1, schema: theme06MegadealsV1Schema });

// Theme07 冷白调研风版式（Phase 1：8 个核心版式 + Phase 2：扩展版式）
registerLayout<Theme07CoverV1Props>({ meta: theme07CoverV1Meta, component: Theme07CoverV1, schema: theme07CoverV1Schema });
registerLayout<Theme07TableOfContentsV1Props>({ meta: theme07TableOfContentsV1Meta, component: Theme07TableOfContentsV1, schema: theme07TableOfContentsV1Schema });
registerLayout<Theme07ChapterV1Props>({ meta: theme07ChapterV1Meta, component: Theme07ChapterV1, schema: theme07ChapterV1Schema });
registerLayout<Theme07ChapterCapitalV1Props>({ meta: theme07ChapterCapitalV1Meta, component: Theme07ChapterCapitalV1, schema: theme07ChapterCapitalV1Schema });
registerLayout<Theme07ChapterRiskV1Props>({ meta: theme07ChapterRiskV1Meta, component: Theme07ChapterRiskV1, schema: theme07ChapterRiskV1Schema });
registerLayout<Theme07ChapterAppendixV1Props>({ meta: theme07ChapterAppendixV1Meta, component: Theme07ChapterAppendixV1, schema: theme07ChapterAppendixV1Schema });
registerLayout<Theme07ContentV1Props>({ meta: theme07ContentV1Meta, component: Theme07ContentV1, schema: theme07ContentV1Schema });
registerLayout<Theme07SummaryV1Props>({ meta: theme07SummaryV1Meta, component: Theme07SummaryV1, schema: theme07SummaryV1Schema });
registerLayout<Theme07RankingV1Props>({ meta: theme07RankingV1Meta, component: Theme07RankingV1, schema: theme07RankingV1Schema });
registerLayout<Theme07CaseV1Props>({ meta: theme07CaseV1Meta, component: Theme07CaseV1, schema: theme07CaseV1Schema });
registerLayout<Theme07CaseGridV1Props>({ meta: theme07CaseGridV1Meta, component: Theme07CaseGridV1, schema: theme07CaseGridV1Schema });
registerLayout<Theme07SourcesV1Props>({ meta: theme07SourcesV1Meta, component: Theme07SourcesV1, schema: theme07SourcesV1Schema });
registerLayout<Theme07MethodV1Props>({ meta: theme07MethodV1Meta, component: Theme07MethodV1, schema: theme07MethodV1Schema });
registerLayout<Theme07MonthlyV1Props>({ meta: theme07MonthlyV1Meta, component: Theme07MonthlyV1, schema: theme07MonthlyV1Schema });
registerLayout<Theme07WaterfallV1Props>({ meta: theme07WaterfallV1Meta, component: Theme07WaterfallV1, schema: theme07WaterfallV1Schema });
registerLayout<Theme07MatrixV1Props>({ meta: theme07MatrixV1Meta, component: Theme07MatrixV1, schema: theme07MatrixV1Schema });
registerLayout<Theme07RiskV1Props>({ meta: theme07RiskV1Meta, component: Theme07RiskV1, schema: theme07RiskV1Schema });
registerLayout<Theme07CoverLeanV1Props>({ meta: theme07CoverLeanV1Meta, component: Theme07CoverLeanV1, schema: theme07CoverLeanV1Schema });
registerLayout<Theme07CoverSupplyChainV1Props>({ meta: theme07CoverSupplyChainV1Meta, component: Theme07CoverSupplyChainV1, schema: theme07CoverSupplyChainV1Schema });
registerLayout<Theme07CoverRetailTrendV1Props>({ meta: theme07CoverRetailTrendV1Meta, component: Theme07CoverRetailTrendV1, schema: theme07CoverRetailTrendV1Schema });
registerLayout<Theme07CoverSupplyStrategyV1Props>({ meta: theme07CoverSupplyStrategyV1Meta, component: Theme07CoverSupplyStrategyV1, schema: theme07CoverSupplyStrategyV1Schema });
registerLayout<Theme07PeakV1Props>({ meta: theme07PeakV1Meta, component: Theme07PeakV1, schema: theme07PeakV1Schema });
registerLayout<Theme07CooldownV1Props>({ meta: theme07CooldownV1Meta, component: Theme07CooldownV1, schema: theme07CooldownV1Schema });
registerLayout<Theme07PeakTroughV1Props>({ meta: theme07PeakTroughV1Meta, component: Theme07PeakTroughV1, schema: theme07PeakTroughV1Schema });
registerLayout<Theme07DealSizeV1Props>({ meta: theme07DealSizeV1Meta, component: Theme07DealSizeV1, schema: theme07DealSizeV1Schema });
registerLayout<Theme07AvgTicketV1Props>({ meta: theme07AvgTicketV1Meta, component: Theme07AvgTicketV1, schema: theme07AvgTicketV1Schema });
registerLayout<Theme07OutlookV1Props>({ meta: theme07OutlookV1Meta, component: Theme07OutlookV1, schema: theme07OutlookV1Schema });
registerLayout<Theme07RepricingV1Props>({ meta: theme07RepricingV1Meta, component: Theme07RepricingV1, schema: theme07RepricingV1Schema });
registerLayout<Theme07DealMapV1Props>({ meta: theme07DealMapV1Meta, component: Theme07DealMapV1, schema: theme07DealMapV1Schema });
registerLayout<Theme07ColdStartV1Props>({ meta: theme07ColdStartV1Meta, component: Theme07ColdStartV1, schema: theme07ColdStartV1Schema });
registerLayout<Theme07AccelerateV1Props>({ meta: theme07AccelerateV1Meta, component: Theme07AccelerateV1, schema: theme07AccelerateV1Schema });
registerLayout<Theme07InvestorV1Props>({ meta: theme07InvestorV1Meta, component: Theme07InvestorV1, schema: theme07InvestorV1Schema });
registerLayout<Theme07ActiveCapitalV1Props>({ meta: theme07ActiveCapitalV1Meta, component: Theme07ActiveCapitalV1, schema: theme07ActiveCapitalV1Schema });
registerLayout<Theme07ConcentrationV1Props>({ meta: theme07ConcentrationV1Meta, component: Theme07ConcentrationV1, schema: theme07ConcentrationV1Schema });
registerLayout<Theme07SyndicateV1Props>({ meta: theme07SyndicateV1Meta, component: Theme07SyndicateV1, schema: theme07SyndicateV1Schema });

// Theme07 冷白调研风版式（Phase 3/4）
registerLayout<Theme07KnowledgeV1Props>({ meta: theme07KnowledgeV1Meta, component: Theme07KnowledgeV1, schema: theme07KnowledgeV1Schema });
registerLayout<Theme07LegalV1Props>({ meta: theme07LegalV1Meta, component: Theme07LegalV1, schema: theme07LegalV1Schema });
registerLayout<Theme07HealthcareV1Props>({ meta: theme07HealthcareV1Meta, component: Theme07HealthcareV1, schema: theme07HealthcareV1Schema });
registerLayout<Theme07FinanceV1Props>({ meta: theme07FinanceV1Meta, component: Theme07FinanceV1, schema: theme07FinanceV1Schema });
registerLayout<Theme07ComputeV1Props>({ meta: theme07ComputeV1Meta, component: Theme07ComputeV1, schema: theme07ComputeV1Schema });
registerLayout<Theme07ChipV1Props>({ meta: theme07ChipV1Meta, component: Theme07ChipV1, schema: theme07ChipV1Schema });
registerLayout<Theme07RoboticsV1Props>({ meta: theme07RoboticsV1Meta, component: Theme07RoboticsV1, schema: theme07RoboticsV1Schema });
registerLayout<Theme07AutonomyV1Props>({ meta: theme07AutonomyV1Meta, component: Theme07AutonomyV1, schema: theme07AutonomyV1Schema });
registerLayout<Theme07SafetyV1Props>({ meta: theme07SafetyV1Meta, component: Theme07SafetyV1, schema: theme07SafetyV1Schema });
registerLayout<Theme07ContentGenV1Props>({ meta: theme07ContentGenV1Meta, component: Theme07ContentGenV1, schema: theme07ContentGenV1Schema });
registerLayout<Theme07EducationV1Props>({ meta: theme07EducationV1Meta, component: Theme07EducationV1, schema: theme07EducationV1Schema });
registerLayout<Theme07SupportV1Props>({ meta: theme07SupportV1Meta, component: Theme07SupportV1, schema: theme07SupportV1Schema });
registerLayout<Theme07SalesV1Props>({ meta: theme07SalesV1Meta, component: Theme07SalesV1, schema: theme07SalesV1Schema });
registerLayout<Theme07LowCodeV1Props>({ meta: theme07LowCodeV1Meta, component: Theme07LowCodeV1, schema: theme07LowCodeV1Schema });
registerLayout<Theme07OpenSourceV1Props>({ meta: theme07OpenSourceV1Meta, component: Theme07OpenSourceV1, schema: theme07OpenSourceV1Schema });
registerLayout<Theme07AlignmentV1Props>({ meta: theme07AlignmentV1Meta, component: Theme07AlignmentV1, schema: theme07AlignmentV1Schema });
registerLayout<Theme07EarlyStageV1Props>({ meta: theme07EarlyStageV1Meta, component: Theme07EarlyStageV1, schema: theme07EarlyStageV1Schema });
registerLayout<Theme07DealStructureV1Props>({ meta: theme07DealStructureV1Meta, component: Theme07DealStructureV1, schema: theme07DealStructureV1Schema });
registerLayout<Theme07InvestorMixV1Props>({ meta: theme07InvestorMixV1Meta, component: Theme07InvestorMixV1, schema: theme07InvestorMixV1Schema });
registerLayout<Theme07ResourceV1Props>({ meta: theme07ResourceV1Meta, component: Theme07ResourceV1, schema: theme07ResourceV1Schema });
registerLayout<Theme07AllianceV1Props>({ meta: theme07AllianceV1Meta, component: Theme07AllianceV1, schema: theme07AllianceV1Schema });
registerLayout<Theme07EcosystemV1Props>({ meta: theme07EcosystemV1Meta, component: Theme07EcosystemV1, schema: theme07EcosystemV1Schema });
registerLayout<Theme07GeoCenterV1Props>({ meta: theme07GeoCenterV1Meta, component: Theme07GeoCenterV1, schema: theme07GeoCenterV1Schema });
registerLayout<Theme07RegionClusterV1Props>({ meta: theme07RegionClusterV1Meta, component: Theme07RegionClusterV1, schema: theme07RegionClusterV1Schema });
registerLayout<Theme07ResourceTriadV1Props>({ meta: theme07ResourceTriadV1Meta, component: Theme07ResourceTriadV1, schema: theme07ResourceTriadV1Schema });
registerLayout<Theme07CompanyOpenaiV1Props>({ meta: theme07CompanyOpenaiV1Meta, component: Theme07CompanyOpenaiV1, schema: theme07CompanyOpenaiV1Schema });
registerLayout<Theme07CompanyFigureV1Props>({ meta: theme07CompanyFigureV1Meta, component: Theme07CompanyFigureV1, schema: theme07CompanyFigureV1Schema });
registerLayout<Theme07CompanySsiV1Props>({ meta: theme07CompanySsiV1Meta, component: Theme07CompanySsiV1, schema: theme07CompanySsiV1Schema });
registerLayout<Theme07RevenueV1Props>({ meta: theme07RevenueV1Meta, component: Theme07RevenueV1, schema: theme07RevenueV1Schema });
registerLayout<Theme07ComplianceV1Props>({ meta: theme07ComplianceV1Meta, component: Theme07ComplianceV1, schema: theme07ComplianceV1Schema });
registerLayout<Theme07MarginV1Props>({ meta: theme07MarginV1Meta, component: Theme07MarginV1, schema: theme07MarginV1Schema });
registerLayout<Theme07MoatV1Props>({ meta: theme07MoatV1Meta, component: Theme07MoatV1, schema: theme07MoatV1Schema });
registerLayout<Theme07StrategyInfraV1Props>({ meta: theme07StrategyInfraV1Meta, component: Theme07StrategyInfraV1, schema: theme07StrategyInfraV1Schema });
registerLayout<Theme07StrategyVerticalV1Props>({ meta: theme07StrategyVerticalV1Meta, component: Theme07StrategyVerticalV1, schema: theme07StrategyVerticalV1Schema });
registerLayout<Theme07QuoteV1Props>({ meta: theme07QuoteV1Meta, component: Theme07QuoteV1, schema: theme07QuoteV1Schema });
registerLayout<Theme07ClosingV1Props>({ meta: theme07ClosingV1Meta, component: Theme07ClosingV1, schema: theme07ClosingV1Schema });
registerLayout<Theme07ClosingQuoteV1Props>({ meta: theme07ClosingQuoteV1Meta, component: Theme07ClosingQuoteV1, schema: theme07ClosingQuoteV1Schema });
registerLayout<Theme07ForwardV1Props>({ meta: theme07ForwardV1Meta, component: Theme07ForwardV1, schema: theme07ForwardV1Schema });
registerLayout<Theme07AboutLabV1Props>({ meta: theme07AboutLabV1Meta, component: Theme07AboutLabV1, schema: theme07AboutLabV1Schema });
registerLayout<Theme07StatHeroV1Props>({ meta: theme07StatHeroV1Meta, component: Theme07StatHeroV1, schema: theme07StatHeroV1Schema });
registerLayout<Theme07StatRowV1Props>({ meta: theme07StatRowV1Meta, component: Theme07StatRowV1, schema: theme07StatRowV1Schema });
registerLayout<Theme07StatChartV1Props>({ meta: theme07StatChartV1Meta, component: Theme07StatChartV1, schema: theme07StatChartV1Schema });
registerLayout<Theme07StatCompareV1Props>({ meta: theme07StatCompareV1Meta, component: Theme07StatCompareV1, schema: theme07StatCompareV1Schema });

// ===== theme08 黑金实验风（Phase 0 脚手架 + MVP 版式） =====
registerLayout<Theme08CoverV1Props>({ meta: theme08CoverV1Meta, component: Theme08CoverV1, schema: theme08CoverV1Schema });
registerLayout<Theme08ChapterV1Props>({ meta: theme08ChapterV1Meta, component: Theme08ChapterV1, schema: theme08ChapterV1Schema });
registerLayout<Theme08OverviewV1Props>({ meta: theme08OverviewV1Meta, component: Theme08OverviewV1, schema: theme08OverviewV1Schema });
registerLayout<Theme08ContentsV1Props>({ meta: theme08ContentsV1Meta, component: Theme08ContentsV1, schema: theme08ContentsV1Schema });
registerLayout<Theme08ContentV1Props>({ meta: theme08ContentV1Meta, component: Theme08ContentV1, schema: theme08ContentV1Schema });
registerLayout<Theme08QuoteV1Props>({ meta: theme08QuoteV1Meta, component: Theme08QuoteV1, schema: theme08QuoteV1Schema });
registerLayout<Theme08FeatureV1Props>({ meta: theme08FeatureV1Meta, component: Theme08FeatureV1, schema: theme08FeatureV1Schema });
registerLayout<Theme08MetricsV1Props>({ meta: theme08MetricsV1Meta, component: Theme08MetricsV1, schema: theme08MetricsV1Schema });
registerLayout<Theme08MetricBigV1Props>({ meta: theme08MetricBigV1Meta, component: Theme08MetricBigV1, schema: theme08MetricBigV1Schema });
registerLayout<Theme08CaseV1Props>({ meta: theme08CaseV1Meta, component: Theme08CaseV1, schema: theme08CaseV1Schema });
registerLayout<Theme08CompareV1Props>({ meta: theme08CompareV1Meta, component: Theme08CompareV1, schema: theme08CompareV1Schema });
registerLayout<Theme08RankingV1Props>({ meta: theme08RankingV1Meta, component: Theme08RankingV1, schema: theme08RankingV1Schema });
registerLayout<Theme08TableV1Props>({ meta: theme08TableV1Meta, component: Theme08TableV1, schema: theme08TableV1Schema });
registerLayout<Theme08TimelineV1Props>({ meta: theme08TimelineV1Meta, component: Theme08TimelineV1, schema: theme08TimelineV1Schema });
registerLayout<Theme08ProcessV1Props>({ meta: theme08ProcessV1Meta, component: Theme08ProcessV1, schema: theme08ProcessV1Schema });
registerLayout<Theme08RoadmapV1Props>({ meta: theme08RoadmapV1Meta, component: Theme08RoadmapV1, schema: theme08RoadmapV1Schema });
registerLayout<Theme08StrategyV1Props>({ meta: theme08StrategyV1Meta, component: Theme08StrategyV1, schema: theme08StrategyV1Schema });
registerLayout<Theme08QuadrantV1Props>({ meta: theme08QuadrantV1Meta, component: Theme08QuadrantV1, schema: theme08QuadrantV1Schema });
registerLayout<Theme08ChartBarV1Props>({ meta: theme08ChartBarV1Meta, component: Theme08ChartBarV1, schema: theme08ChartBarV1Schema });
registerLayout<Theme08ChartDonutV1Props>({ meta: theme08ChartDonutV1Meta, component: Theme08ChartDonutV1, schema: theme08ChartDonutV1Schema });
registerLayout<Theme08RegionV1Props>({ meta: theme08RegionV1Meta, component: Theme08RegionV1, schema: theme08RegionV1Schema });
registerLayout<Theme08GalleryV1Props>({ meta: theme08GalleryV1Meta, component: Theme08GalleryV1, schema: theme08GalleryV1Schema });
registerLayout<Theme08CollageV1Props>({ meta: theme08CollageV1Meta, component: Theme08CollageV1, schema: theme08CollageV1Schema });
registerLayout<Theme08TeamV1Props>({ meta: theme08TeamV1Meta, component: Theme08TeamV1, schema: theme08TeamV1Schema });
registerLayout<Theme08PartnersV1Props>({ meta: theme08PartnersV1Meta, component: Theme08PartnersV1, schema: theme08PartnersV1Schema });
registerLayout<Theme08ClosingV1Props>({ meta: theme08ClosingV1Meta, component: Theme08ClosingV1, schema: theme08ClosingV1Schema });
registerLayout<Theme08RangeV1Props>({ meta: theme08RangeV1Meta, component: Theme08RangeV1, schema: theme08RangeV1Schema });
registerLayout<Theme08ScorecardV1Props>({ meta: theme08ScorecardV1Meta, component: Theme08ScorecardV1, schema: theme08ScorecardV1Schema });
registerLayout<Theme08EcosystemV1Props>({ meta: theme08EcosystemV1Meta, component: Theme08EcosystemV1, schema: theme08EcosystemV1Schema });
registerLayout<Theme08RadarV1Props>({ meta: theme08RadarV1Meta, component: Theme08RadarV1, schema: theme08RadarV1Schema });
registerLayout<Theme08WaterfallV1Props>({ meta: theme08WaterfallV1Meta, component: Theme08WaterfallV1, schema: theme08WaterfallV1Schema });
registerLayout<Theme08GaugeV1Props>({ meta: theme08GaugeV1Meta, component: Theme08GaugeV1, schema: theme08GaugeV1Schema });
registerLayout<Theme08ChainV1Props>({ meta: theme08ChainV1Meta, component: Theme08ChainV1, schema: theme08ChainV1Schema });
registerLayout<Theme08BubbleV1Props>({ meta: theme08BubbleV1Meta, component: Theme08BubbleV1, schema: theme08BubbleV1Schema });
registerLayout<Theme08HeatmapV1Props>({ meta: theme08HeatmapV1Meta, component: Theme08HeatmapV1, schema: theme08HeatmapV1Schema });
registerLayout<Theme08FundingV1Props>({ meta: theme08FundingV1Meta, component: Theme08FundingV1, schema: theme08FundingV1Schema });
registerLayout<Theme08MatrixV1Props>({ meta: theme08MatrixV1Meta, component: Theme08MatrixV1, schema: theme08MatrixV1Schema });
registerLayout<Theme08WorkflowV1Props>({ meta: theme08WorkflowV1Meta, component: Theme08WorkflowV1, schema: theme08WorkflowV1Schema });
registerLayout<Theme08HeroSplitV1Props>({ meta: theme08HeroSplitV1Meta, component: Theme08HeroSplitV1, schema: theme08HeroSplitV1Schema });
registerLayout<Theme08Cover_v2Props>({ meta: theme08Cover_v2Meta, component: Theme08Cover_v2, schema: theme08Cover_v2Schema });
registerLayout<Theme08Cover_v3Props>({ meta: theme08Cover_v3Meta, component: Theme08Cover_v3, schema: theme08Cover_v3Schema });
registerLayout<Theme08Cover_v4Props>({ meta: theme08Cover_v4Meta, component: Theme08Cover_v4, schema: theme08Cover_v4Schema });
registerLayout<Theme08Cover_v5Props>({ meta: theme08Cover_v5Meta, component: Theme08Cover_v5, schema: theme08Cover_v5Schema });
registerLayout<Theme08Chapter_v2Props>({ meta: theme08Chapter_v2Meta, component: Theme08Chapter_v2, schema: theme08Chapter_v2Schema });
registerLayout<Theme08Chapter_v3Props>({ meta: theme08Chapter_v3Meta, component: Theme08Chapter_v3, schema: theme08Chapter_v3Schema });
registerLayout<Theme08Chapter_v4Props>({ meta: theme08Chapter_v4Meta, component: Theme08Chapter_v4, schema: theme08Chapter_v4Schema });
registerLayout<Theme08Quote_statementProps>({ meta: theme08Quote_statementMeta, component: Theme08Quote_statement, schema: theme08Quote_statementSchema });
registerLayout<Theme08Quote_resourcesProps>({ meta: theme08Quote_resourcesMeta, component: Theme08Quote_resources, schema: theme08Quote_resourcesSchema });
registerLayout<Theme08Quote_verdictProps>({ meta: theme08Quote_verdictMeta, component: Theme08Quote_verdict, schema: theme08Quote_verdictSchema });
registerLayout<Theme08Quote_twofieldProps>({ meta: theme08Quote_twofieldMeta, component: Theme08Quote_twofield, schema: theme08Quote_twofieldSchema });
registerLayout<Theme08Quote_manifestoProps>({ meta: theme08Quote_manifestoMeta, component: Theme08Quote_manifesto, schema: theme08Quote_manifestoSchema });
registerLayout<Theme08Case_cardProps>({ meta: theme08Case_cardMeta, component: Theme08Case_card, schema: theme08Case_cardSchema });
registerLayout<Theme08Case_card_v2Props>({ meta: theme08Case_card_v2Meta, component: Theme08Case_card_v2, schema: theme08Case_card_v2Schema });
registerLayout<Theme08Case_tableProps>({ meta: theme08Case_tableMeta, component: Theme08Case_table, schema: theme08Case_tableSchema });
registerLayout<Theme08Case_studyProps>({ meta: theme08Case_studyMeta, component: Theme08Case_study, schema: theme08Case_studySchema });
registerLayout<Theme08Case_gridProps>({ meta: theme08Case_gridMeta, component: Theme08Case_grid, schema: theme08Case_gridSchema });
registerLayout<Theme08Case_listProps>({ meta: theme08Case_listMeta, component: Theme08Case_list, schema: theme08Case_listSchema });
registerLayout<Theme08Region_anchorProps>({ meta: theme08Region_anchorMeta, component: Theme08Region_anchor, schema: theme08Region_anchorSchema });
registerLayout<Theme08Region_card_nyProps>({ meta: theme08Region_card_nyMeta, component: Theme08Region_card_ny, schema: theme08Region_card_nySchema });
registerLayout<Theme08Region_dotmapProps>({ meta: theme08Region_dotmapMeta, component: Theme08Region_dotmap, schema: theme08Region_dotmapSchema });
registerLayout<Theme08SegmentProps>({ meta: theme08SegmentMeta, component: Theme08Segment, schema: theme08SegmentSchema });
registerLayout<Theme08PipelineProps>({ meta: theme08PipelineMeta, component: Theme08Pipeline, schema: theme08PipelineSchema });
registerLayout<Theme08ArchitectureProps>({ meta: theme08ArchitectureMeta, component: Theme08Architecture, schema: theme08ArchitectureSchema });
registerLayout<Theme08SupplyProps>({ meta: theme08SupplyMeta, component: Theme08Supply, schema: theme08SupplySchema });
registerLayout<Theme08ComputeProps>({ meta: theme08ComputeMeta, component: Theme08Compute, schema: theme08ComputeSchema });
registerLayout<Theme08TrendProps>({ meta: theme08TrendMeta, component: Theme08Trend, schema: theme08TrendSchema });
registerLayout<Theme08CrossProps>({ meta: theme08CrossMeta, component: Theme08Cross, schema: theme08CrossSchema });
registerLayout<Theme08PeakProps>({ meta: theme08PeakMeta, component: Theme08Peak, schema: theme08PeakSchema });
registerLayout<Theme08PullbackProps>({ meta: theme08PullbackMeta, component: Theme08Pullback, schema: theme08PullbackSchema });
registerLayout<Theme08Peak_troughProps>({ meta: theme08Peak_troughMeta, component: Theme08Peak_trough, schema: theme08Peak_troughSchema });
registerLayout<Theme08Capital_curveProps>({ meta: theme08Capital_curveMeta, component: Theme08Capital_curve, schema: theme08Capital_curveSchema });
registerLayout<Theme08RevenueProps>({ meta: theme08RevenueMeta, component: Theme08Revenue, schema: theme08RevenueSchema });
registerLayout<Theme08RegulationProps>({ meta: theme08RegulationMeta, component: Theme08Regulation, schema: theme08RegulationSchema });
registerLayout<Theme08SqueezeProps>({ meta: theme08SqueezeMeta, component: Theme08Squeeze, schema: theme08SqueezeSchema });
registerLayout<Theme08Early_stageProps>({ meta: theme08Early_stageMeta, component: Theme08Early_stage, schema: theme08Early_stageSchema });
registerLayout<Theme08Investor_mixProps>({ meta: theme08Investor_mixMeta, component: Theme08Investor_mix, schema: theme08Investor_mixSchema });
registerLayout<Theme08Resource_mapProps>({ meta: theme08Resource_mapMeta, component: Theme08Resource_map, schema: theme08Resource_mapSchema });
registerLayout<Theme08Closed_loopProps>({ meta: theme08Closed_loopMeta, component: Theme08Closed_loop, schema: theme08Closed_loopSchema });
registerLayout<Theme08TriptychProps>({ meta: theme08TriptychMeta, component: Theme08Triptych, schema: theme08TriptychSchema });
registerLayout<Theme08Scene_splitProps>({ meta: theme08Scene_splitMeta, component: Theme08Scene_split, schema: theme08Scene_splitSchema });
registerLayout<Theme08Budget_cardProps>({ meta: theme08Budget_cardMeta, component: Theme08Budget_card, schema: theme08Budget_cardSchema });
registerLayout<Theme08MainlinesProps>({ meta: theme08MainlinesMeta, component: Theme08Mainlines, schema: theme08MainlinesSchema });
registerLayout<Theme08MigrationProps>({ meta: theme08MigrationMeta, component: Theme08Migration, schema: theme08MigrationSchema });
registerLayout<Theme08Size_splitProps>({ meta: theme08Size_splitMeta, component: Theme08Size_split, schema: theme08Size_splitSchema });

registerLayout<Theme08Cover_v2Props>({ meta: theme08Cover_v2Meta, component: Theme08Cover_v2, schema: theme08Cover_v2Schema });
registerLayout<Theme08Cover_v3Props>({ meta: theme08Cover_v3Meta, component: Theme08Cover_v3, schema: theme08Cover_v3Schema });
registerLayout<Theme08Cover_v4Props>({ meta: theme08Cover_v4Meta, component: Theme08Cover_v4, schema: theme08Cover_v4Schema });
registerLayout<Theme08Cover_v5Props>({ meta: theme08Cover_v5Meta, component: Theme08Cover_v5, schema: theme08Cover_v5Schema });
registerLayout<Theme08Chapter_v2Props>({ meta: theme08Chapter_v2Meta, component: Theme08Chapter_v2, schema: theme08Chapter_v2Schema });
registerLayout<Theme08Chapter_v3Props>({ meta: theme08Chapter_v3Meta, component: Theme08Chapter_v3, schema: theme08Chapter_v3Schema });
registerLayout<Theme08Chapter_v4Props>({ meta: theme08Chapter_v4Meta, component: Theme08Chapter_v4, schema: theme08Chapter_v4Schema });
registerLayout<Theme08Quote_statementProps>({ meta: theme08Quote_statementMeta, component: Theme08Quote_statement, schema: theme08Quote_statementSchema });
registerLayout<Theme08Quote_resourcesProps>({ meta: theme08Quote_resourcesMeta, component: Theme08Quote_resources, schema: theme08Quote_resourcesSchema });
registerLayout<Theme08Quote_verdictProps>({ meta: theme08Quote_verdictMeta, component: Theme08Quote_verdict, schema: theme08Quote_verdictSchema });
registerLayout<Theme08Quote_twofieldProps>({ meta: theme08Quote_twofieldMeta, component: Theme08Quote_twofield, schema: theme08Quote_twofieldSchema });
registerLayout<Theme08Quote_manifestoProps>({ meta: theme08Quote_manifestoMeta, component: Theme08Quote_manifesto, schema: theme08Quote_manifestoSchema });
registerLayout<Theme08Case_cardProps>({ meta: theme08Case_cardMeta, component: Theme08Case_card, schema: theme08Case_cardSchema });
registerLayout<Theme08Case_card_v2Props>({ meta: theme08Case_card_v2Meta, component: Theme08Case_card_v2, schema: theme08Case_card_v2Schema });
registerLayout<Theme08Case_tableProps>({ meta: theme08Case_tableMeta, component: Theme08Case_table, schema: theme08Case_tableSchema });
registerLayout<Theme08Case_studyProps>({ meta: theme08Case_studyMeta, component: Theme08Case_study, schema: theme08Case_studySchema });
registerLayout<Theme08Case_gridProps>({ meta: theme08Case_gridMeta, component: Theme08Case_grid, schema: theme08Case_gridSchema });
registerLayout<Theme08Case_listProps>({ meta: theme08Case_listMeta, component: Theme08Case_list, schema: theme08Case_listSchema });
registerLayout<Theme08Region_anchorProps>({ meta: theme08Region_anchorMeta, component: Theme08Region_anchor, schema: theme08Region_anchorSchema });
registerLayout<Theme08Region_card_nyProps>({ meta: theme08Region_card_nyMeta, component: Theme08Region_card_ny, schema: theme08Region_card_nySchema });
registerLayout<Theme08Region_dotmapProps>({ meta: theme08Region_dotmapMeta, component: Theme08Region_dotmap, schema: theme08Region_dotmapSchema });
registerLayout<Theme08SegmentProps>({ meta: theme08SegmentMeta, component: Theme08Segment, schema: theme08SegmentSchema });
registerLayout<Theme08PipelineProps>({ meta: theme08PipelineMeta, component: Theme08Pipeline, schema: theme08PipelineSchema });
registerLayout<Theme08ArchitectureProps>({ meta: theme08ArchitectureMeta, component: Theme08Architecture, schema: theme08ArchitectureSchema });
registerLayout<Theme08SupplyProps>({ meta: theme08SupplyMeta, component: Theme08Supply, schema: theme08SupplySchema });
registerLayout<Theme08ComputeProps>({ meta: theme08ComputeMeta, component: Theme08Compute, schema: theme08ComputeSchema });
registerLayout<Theme08TrendProps>({ meta: theme08TrendMeta, component: Theme08Trend, schema: theme08TrendSchema });
registerLayout<Theme08CrossProps>({ meta: theme08CrossMeta, component: Theme08Cross, schema: theme08CrossSchema });
registerLayout<Theme08PeakProps>({ meta: theme08PeakMeta, component: Theme08Peak, schema: theme08PeakSchema });
registerLayout<Theme08PullbackProps>({ meta: theme08PullbackMeta, component: Theme08Pullback, schema: theme08PullbackSchema });
registerLayout<Theme08Peak_troughProps>({ meta: theme08Peak_troughMeta, component: Theme08Peak_trough, schema: theme08Peak_troughSchema });
registerLayout<Theme08Capital_curveProps>({ meta: theme08Capital_curveMeta, component: Theme08Capital_curve, schema: theme08Capital_curveSchema });
registerLayout<Theme08RevenueProps>({ meta: theme08RevenueMeta, component: Theme08Revenue, schema: theme08RevenueSchema });
registerLayout<Theme08RegulationProps>({ meta: theme08RegulationMeta, component: Theme08Regulation, schema: theme08RegulationSchema });
registerLayout<Theme08SqueezeProps>({ meta: theme08SqueezeMeta, component: Theme08Squeeze, schema: theme08SqueezeSchema });
registerLayout<Theme08Early_stageProps>({ meta: theme08Early_stageMeta, component: Theme08Early_stage, schema: theme08Early_stageSchema });
registerLayout<Theme08Investor_mixProps>({ meta: theme08Investor_mixMeta, component: Theme08Investor_mix, schema: theme08Investor_mixSchema });
registerLayout<Theme08Resource_mapProps>({ meta: theme08Resource_mapMeta, component: Theme08Resource_map, schema: theme08Resource_mapSchema });
registerLayout<Theme08Closed_loopProps>({ meta: theme08Closed_loopMeta, component: Theme08Closed_loop, schema: theme08Closed_loopSchema });
registerLayout<Theme08TriptychProps>({ meta: theme08TriptychMeta, component: Theme08Triptych, schema: theme08TriptychSchema });
registerLayout<Theme08Scene_splitProps>({ meta: theme08Scene_splitMeta, component: Theme08Scene_split, schema: theme08Scene_splitSchema });
registerLayout<Theme08Budget_cardProps>({ meta: theme08Budget_cardMeta, component: Theme08Budget_card, schema: theme08Budget_cardSchema });
registerLayout<Theme08MainlinesProps>({ meta: theme08MainlinesMeta, component: Theme08Mainlines, schema: theme08MainlinesSchema });
registerLayout<Theme08MigrationProps>({ meta: theme08MigrationMeta, component: Theme08Migration, schema: theme08MigrationSchema });
registerLayout<Theme08Size_splitProps>({ meta: theme08Size_splitMeta, component: Theme08Size_split, schema: theme08Size_splitSchema });

registerLayout<Theme08Cover_v2Props>({ meta: theme08Cover_v2Meta, component: Theme08Cover_v2, schema: theme08Cover_v2Schema });
registerLayout<Theme08Cover_v3Props>({ meta: theme08Cover_v3Meta, component: Theme08Cover_v3, schema: theme08Cover_v3Schema });
registerLayout<Theme08Cover_v4Props>({ meta: theme08Cover_v4Meta, component: Theme08Cover_v4, schema: theme08Cover_v4Schema });
registerLayout<Theme08Cover_v5Props>({ meta: theme08Cover_v5Meta, component: Theme08Cover_v5, schema: theme08Cover_v5Schema });
registerLayout<Theme08Chapter_v2Props>({ meta: theme08Chapter_v2Meta, component: Theme08Chapter_v2, schema: theme08Chapter_v2Schema });
registerLayout<Theme08Chapter_v3Props>({ meta: theme08Chapter_v3Meta, component: Theme08Chapter_v3, schema: theme08Chapter_v3Schema });
registerLayout<Theme08Chapter_v4Props>({ meta: theme08Chapter_v4Meta, component: Theme08Chapter_v4, schema: theme08Chapter_v4Schema });
registerLayout<Theme08Quote_statementProps>({ meta: theme08Quote_statementMeta, component: Theme08Quote_statement, schema: theme08Quote_statementSchema });
registerLayout<Theme08Quote_resourcesProps>({ meta: theme08Quote_resourcesMeta, component: Theme08Quote_resources, schema: theme08Quote_resourcesSchema });
registerLayout<Theme08Quote_verdictProps>({ meta: theme08Quote_verdictMeta, component: Theme08Quote_verdict, schema: theme08Quote_verdictSchema });
registerLayout<Theme08Quote_twofieldProps>({ meta: theme08Quote_twofieldMeta, component: Theme08Quote_twofield, schema: theme08Quote_twofieldSchema });
registerLayout<Theme08Quote_manifestoProps>({ meta: theme08Quote_manifestoMeta, component: Theme08Quote_manifesto, schema: theme08Quote_manifestoSchema });
registerLayout<Theme08Case_cardProps>({ meta: theme08Case_cardMeta, component: Theme08Case_card, schema: theme08Case_cardSchema });
registerLayout<Theme08Case_card_v2Props>({ meta: theme08Case_card_v2Meta, component: Theme08Case_card_v2, schema: theme08Case_card_v2Schema });
registerLayout<Theme08Case_tableProps>({ meta: theme08Case_tableMeta, component: Theme08Case_table, schema: theme08Case_tableSchema });
registerLayout<Theme08Case_studyProps>({ meta: theme08Case_studyMeta, component: Theme08Case_study, schema: theme08Case_studySchema });
registerLayout<Theme08Case_gridProps>({ meta: theme08Case_gridMeta, component: Theme08Case_grid, schema: theme08Case_gridSchema });
registerLayout<Theme08Case_listProps>({ meta: theme08Case_listMeta, component: Theme08Case_list, schema: theme08Case_listSchema });
registerLayout<Theme08Region_anchorProps>({ meta: theme08Region_anchorMeta, component: Theme08Region_anchor, schema: theme08Region_anchorSchema });
registerLayout<Theme08Region_card_nyProps>({ meta: theme08Region_card_nyMeta, component: Theme08Region_card_ny, schema: theme08Region_card_nySchema });
registerLayout<Theme08Region_dotmapProps>({ meta: theme08Region_dotmapMeta, component: Theme08Region_dotmap, schema: theme08Region_dotmapSchema });
registerLayout<Theme08SegmentProps>({ meta: theme08SegmentMeta, component: Theme08Segment, schema: theme08SegmentSchema });
registerLayout<Theme08PipelineProps>({ meta: theme08PipelineMeta, component: Theme08Pipeline, schema: theme08PipelineSchema });
registerLayout<Theme08ArchitectureProps>({ meta: theme08ArchitectureMeta, component: Theme08Architecture, schema: theme08ArchitectureSchema });
registerLayout<Theme08SupplyProps>({ meta: theme08SupplyMeta, component: Theme08Supply, schema: theme08SupplySchema });
registerLayout<Theme08ComputeProps>({ meta: theme08ComputeMeta, component: Theme08Compute, schema: theme08ComputeSchema });
registerLayout<Theme08TrendProps>({ meta: theme08TrendMeta, component: Theme08Trend, schema: theme08TrendSchema });
registerLayout<Theme08CrossProps>({ meta: theme08CrossMeta, component: Theme08Cross, schema: theme08CrossSchema });
registerLayout<Theme08PeakProps>({ meta: theme08PeakMeta, component: Theme08Peak, schema: theme08PeakSchema });
registerLayout<Theme08PullbackProps>({ meta: theme08PullbackMeta, component: Theme08Pullback, schema: theme08PullbackSchema });
registerLayout<Theme08Peak_troughProps>({ meta: theme08Peak_troughMeta, component: Theme08Peak_trough, schema: theme08Peak_troughSchema });
registerLayout<Theme08Capital_curveProps>({ meta: theme08Capital_curveMeta, component: Theme08Capital_curve, schema: theme08Capital_curveSchema });
registerLayout<Theme08RevenueProps>({ meta: theme08RevenueMeta, component: Theme08Revenue, schema: theme08RevenueSchema });
registerLayout<Theme08RegulationProps>({ meta: theme08RegulationMeta, component: Theme08Regulation, schema: theme08RegulationSchema });
registerLayout<Theme08SqueezeProps>({ meta: theme08SqueezeMeta, component: Theme08Squeeze, schema: theme08SqueezeSchema });
registerLayout<Theme08Early_stageProps>({ meta: theme08Early_stageMeta, component: Theme08Early_stage, schema: theme08Early_stageSchema });
registerLayout<Theme08Investor_mixProps>({ meta: theme08Investor_mixMeta, component: Theme08Investor_mix, schema: theme08Investor_mixSchema });
registerLayout<Theme08Resource_mapProps>({ meta: theme08Resource_mapMeta, component: Theme08Resource_map, schema: theme08Resource_mapSchema });
registerLayout<Theme08Closed_loopProps>({ meta: theme08Closed_loopMeta, component: Theme08Closed_loop, schema: theme08Closed_loopSchema });
registerLayout<Theme08TriptychProps>({ meta: theme08TriptychMeta, component: Theme08Triptych, schema: theme08TriptychSchema });
registerLayout<Theme08Scene_splitProps>({ meta: theme08Scene_splitMeta, component: Theme08Scene_split, schema: theme08Scene_splitSchema });
registerLayout<Theme08Budget_cardProps>({ meta: theme08Budget_cardMeta, component: Theme08Budget_card, schema: theme08Budget_cardSchema });
registerLayout<Theme08MainlinesProps>({ meta: theme08MainlinesMeta, component: Theme08Mainlines, schema: theme08MainlinesSchema });
registerLayout<Theme08MigrationProps>({ meta: theme08MigrationMeta, component: Theme08Migration, schema: theme08MigrationSchema });
registerLayout<Theme08Size_splitProps>({ meta: theme08Size_splitMeta, component: Theme08Size_split, schema: theme08Size_splitSchema });

/* ═══════════════ theme09 · 墨韵专色 · 杂志印刷风（P0 骨架 12 版式）═══════════════ */

import {
  Theme09CoverMastheadV1,
  theme09CoverMastheadV1Meta,
  theme09CoverMastheadV1Schema,
  type Theme09CoverMastheadV1Props,
} from './themes/theme09/cover-masthead-v1.js';
import {
  Theme09CoverBleedV1,
  theme09CoverBleedV1Meta,
  theme09CoverBleedV1Schema,
  type Theme09CoverBleedV1Props,
} from './themes/theme09/cover-bleed-v1.js';
import {
  Theme09CoverDossierV1,
  theme09CoverDossierV1Meta,
  theme09CoverDossierV1Schema,
  type Theme09CoverDossierV1Props,
} from './themes/theme09/cover-dossier-v1.js';
import {
  Theme09CoverColorbarV1,
  theme09CoverColorbarV1Meta,
  theme09CoverColorbarV1Schema,
  type Theme09CoverColorbarV1Props,
} from './themes/theme09/cover-colorbar-v1.js';
import {
  Theme09CoverApertureV1,
  theme09CoverApertureV1Meta,
  theme09CoverApertureV1Schema,
  type Theme09CoverApertureV1Props,
} from './themes/theme09/cover-aperture-v1.js';
import {
  Theme09CoverColophonV1,
  theme09CoverColophonV1Meta,
  theme09CoverColophonV1Schema,
  type Theme09CoverColophonV1Props,
} from './themes/theme09/cover-colophon-v1.js';
import {
  Theme09CoverPhotoV1,
  theme09CoverPhotoV1Meta,
  theme09CoverPhotoV1Schema,
  type Theme09CoverPhotoV1Props,
} from './themes/theme09/cover-photo-v1.js';
import {
  Theme09AbstractV1,
  theme09AbstractV1Meta,
  theme09AbstractV1Schema,
  type Theme09AbstractV1Props,
} from './themes/theme09/abstract-v1.js';
import {
  Theme09ContentsV1,
  theme09ContentsV1Meta,
  theme09ContentsV1Schema,
  type Theme09ContentsV1Props,
} from './themes/theme09/contents-v1.js';
import {
  Theme09SectionV1,
  theme09SectionV1Meta,
  theme09SectionV1Schema,
  type Theme09SectionV1Props,
} from './themes/theme09/section-v1.js';
import {
  Theme09SectionCardV1,
  theme09SectionCardV1Meta,
  theme09SectionCardV1Schema,
  type Theme09SectionCardV1Props,
} from './themes/theme09/section-card-v1.js';
import {
  Theme09ClosingV1,
  theme09ClosingV1Meta,
  theme09ClosingV1Schema,
  type Theme09ClosingV1Props,
} from './themes/theme09/closing-v1.js';
import {
  Theme09SpecimenV1,
  theme09SpecimenV1Meta,
  theme09SpecimenV1Schema,
  type Theme09SpecimenV1Props,
} from './themes/theme09/specimen-v1.js';
import {
  Theme09PhotoFeatureV1,
  theme09PhotoFeatureV1Meta,
  theme09PhotoFeatureV1Schema,
  type Theme09PhotoFeatureV1Props,
} from './themes/theme09/photo-feature-v1.js';
import {
  Theme09PhotoGridV1,
  theme09PhotoGridV1Meta,
  theme09PhotoGridV1Schema,
  type Theme09PhotoGridV1Props,
} from './themes/theme09/photo-grid-v1.js';
import {
  Theme09PhotoQuoteV1,
  theme09PhotoQuoteV1Meta,
  theme09PhotoQuoteV1Schema,
  type Theme09PhotoQuoteV1Props,
} from './themes/theme09/photo-quote-v1.js';
import {
  Theme09PhotoDuoV1,
  theme09PhotoDuoV1Meta,
  theme09PhotoDuoV1Schema,
  type Theme09PhotoDuoV1Props,
} from './themes/theme09/photo-duo-v1.js';
import {
  Theme09PhotoPanoramaV1,
  theme09PhotoPanoramaV1Meta,
  theme09PhotoPanoramaV1Schema,
  type Theme09PhotoPanoramaV1Props,
} from './themes/theme09/photo-panorama-v1.js';
import {
  Theme09PhotoStageV1,
  theme09PhotoStageV1Meta,
  theme09PhotoStageV1Schema,
  type Theme09PhotoStageV1Props,
} from './themes/theme09/photo-stage-v1.js';
import {
  Theme09StoryboardV1,
  theme09StoryboardV1Meta,
  theme09StoryboardV1Schema,
  type Theme09StoryboardV1Props,
} from './themes/theme09/storyboard-v1.js';
import {
  Theme09SnapshotTapeV1,
  theme09SnapshotTapeV1Meta,
  theme09SnapshotTapeV1Schema,
  type Theme09SnapshotTapeV1Props,
} from './themes/theme09/snapshot-tape-v1.js';
import {
  Theme09EpigraphV1,
  theme09EpigraphV1Meta,
  theme09EpigraphV1Schema,
  type Theme09EpigraphV1Props,
} from './themes/theme09/epigraph-v1.js';
import {
  Theme09PhotoBentoV1,
  theme09PhotoBentoV1Meta,
  theme09PhotoBentoV1Schema,
  type Theme09PhotoBentoV1Props,
} from './themes/theme09/photo-bento-v1.js';
import {
  Theme09TimelinePhotoV1,
  theme09TimelinePhotoV1Meta,
  theme09TimelinePhotoV1Schema,
  type Theme09TimelinePhotoV1Props,
} from './themes/theme09/timeline-photo-v1.js';
import {
  Theme09FilmstripV1,
  theme09FilmstripV1Meta,
  theme09FilmstripV1Schema,
  type Theme09FilmstripV1Props,
} from './themes/theme09/filmstrip-v1.js';
import {
  Theme09MosaicV1,
  theme09MosaicV1Meta,
  theme09MosaicV1Schema,
  type Theme09MosaicV1Props,
} from './themes/theme09/mosaic-v1.js';
import {
  Theme09TestimonialV1,
  theme09TestimonialV1Meta,
  theme09TestimonialV1Schema,
  type Theme09TestimonialV1Props,
} from './themes/theme09/testimonial-v1.js';
import {
  Theme09TeamV1,
  theme09TeamV1Meta,
  theme09TeamV1Schema,
  type Theme09TeamV1Props,
} from './themes/theme09/team-v1.js';
import {
  Theme09PhotoRingV1,
  theme09PhotoRingV1Meta,
  theme09PhotoRingV1Schema,
  type Theme09PhotoRingV1Props,
} from './themes/theme09/photo-ring-v1.js';
import {
  Theme09DividerPhotoV1,
  theme09DividerPhotoV1Meta,
  theme09DividerPhotoV1Schema,
  type Theme09DividerPhotoV1Props,
} from './themes/theme09/divider-photo-v1.js';
import {
  Theme09CoverStoryV1,
  theme09CoverStoryV1Meta,
  theme09CoverStoryV1Schema,
  type Theme09CoverStoryV1Props,
} from './themes/theme09/coverstory-v1.js';
import {
  Theme09QuotePortraitV1,
  theme09QuotePortraitV1Meta,
  theme09QuotePortraitV1Schema,
  type Theme09QuotePortraitV1Props,
} from './themes/theme09/quote-portrait-v1.js';
import {
  Theme09ManifestoV1,
  theme09ManifestoV1Meta,
  theme09ManifestoV1Schema,
  type Theme09ManifestoV1Props,
} from './themes/theme09/manifesto-v1.js';
import {
  Theme09AnnotatedV1,
  theme09AnnotatedV1Meta,
  theme09AnnotatedV1Schema,
  type Theme09AnnotatedV1Props,
} from './themes/theme09/annotated-v1.js';
import {
  Theme09DiptychV1,
  theme09DiptychV1Meta,
  theme09DiptychV1Schema,
  type Theme09DiptychV1Props,
} from './themes/theme09/diptych-v1.js';
import {
  Theme09CaseFolioV1,
  theme09CaseFolioV1Meta,
  theme09CaseFolioV1Schema,
  type Theme09CaseFolioV1Props,
} from './themes/theme09/case-folio-v1.js';
import {
  Theme09SplitDiagonalV1,
  theme09SplitDiagonalV1Meta,
  theme09SplitDiagonalV1Schema,
  type Theme09SplitDiagonalV1Props,
} from './themes/theme09/split-diagonal-v1.js';

registerLayout<Theme09CoverMastheadV1Props>({ meta: theme09CoverMastheadV1Meta, component: Theme09CoverMastheadV1, schema: theme09CoverMastheadV1Schema });
registerLayout<Theme09CoverBleedV1Props>({ meta: theme09CoverBleedV1Meta, component: Theme09CoverBleedV1, schema: theme09CoverBleedV1Schema });
registerLayout<Theme09CoverDossierV1Props>({ meta: theme09CoverDossierV1Meta, component: Theme09CoverDossierV1, schema: theme09CoverDossierV1Schema });
registerLayout<Theme09CoverColorbarV1Props>({ meta: theme09CoverColorbarV1Meta, component: Theme09CoverColorbarV1, schema: theme09CoverColorbarV1Schema });
registerLayout<Theme09CoverApertureV1Props>({ meta: theme09CoverApertureV1Meta, component: Theme09CoverApertureV1, schema: theme09CoverApertureV1Schema });
registerLayout<Theme09CoverColophonV1Props>({ meta: theme09CoverColophonV1Meta, component: Theme09CoverColophonV1, schema: theme09CoverColophonV1Schema });
registerLayout<Theme09CoverPhotoV1Props>({ meta: theme09CoverPhotoV1Meta, component: Theme09CoverPhotoV1, schema: theme09CoverPhotoV1Schema });
registerLayout<Theme09AbstractV1Props>({ meta: theme09AbstractV1Meta, component: Theme09AbstractV1, schema: theme09AbstractV1Schema });
registerLayout<Theme09ContentsV1Props>({ meta: theme09ContentsV1Meta, component: Theme09ContentsV1, schema: theme09ContentsV1Schema });
registerLayout<Theme09SectionV1Props>({ meta: theme09SectionV1Meta, component: Theme09SectionV1, schema: theme09SectionV1Schema });
registerLayout<Theme09SectionCardV1Props>({ meta: theme09SectionCardV1Meta, component: Theme09SectionCardV1, schema: theme09SectionCardV1Schema });
registerLayout<Theme09ClosingV1Props>({ meta: theme09ClosingV1Meta, component: Theme09ClosingV1, schema: theme09ClosingV1Schema });
registerLayout<Theme09SpecimenV1Props>({ meta: theme09SpecimenV1Meta, component: Theme09SpecimenV1, schema: theme09SpecimenV1Schema });
registerLayout<Theme09PhotoFeatureV1Props>({ meta: theme09PhotoFeatureV1Meta, component: Theme09PhotoFeatureV1, schema: theme09PhotoFeatureV1Schema });
registerLayout<Theme09PhotoGridV1Props>({ meta: theme09PhotoGridV1Meta, component: Theme09PhotoGridV1, schema: theme09PhotoGridV1Schema });
registerLayout<Theme09PhotoQuoteV1Props>({ meta: theme09PhotoQuoteV1Meta, component: Theme09PhotoQuoteV1, schema: theme09PhotoQuoteV1Schema });
registerLayout<Theme09PhotoDuoV1Props>({ meta: theme09PhotoDuoV1Meta, component: Theme09PhotoDuoV1, schema: theme09PhotoDuoV1Schema });
registerLayout<Theme09PhotoPanoramaV1Props>({ meta: theme09PhotoPanoramaV1Meta, component: Theme09PhotoPanoramaV1, schema: theme09PhotoPanoramaV1Schema });
registerLayout<Theme09PhotoStageV1Props>({ meta: theme09PhotoStageV1Meta, component: Theme09PhotoStageV1, schema: theme09PhotoStageV1Schema });
registerLayout<Theme09StoryboardV1Props>({ meta: theme09StoryboardV1Meta, component: Theme09StoryboardV1, schema: theme09StoryboardV1Schema });
registerLayout<Theme09SnapshotTapeV1Props>({ meta: theme09SnapshotTapeV1Meta, component: Theme09SnapshotTapeV1, schema: theme09SnapshotTapeV1Schema });
registerLayout<Theme09EpigraphV1Props>({ meta: theme09EpigraphV1Meta, component: Theme09EpigraphV1, schema: theme09EpigraphV1Schema });
registerLayout<Theme09PhotoBentoV1Props>({ meta: theme09PhotoBentoV1Meta, component: Theme09PhotoBentoV1, schema: theme09PhotoBentoV1Schema });
registerLayout<Theme09TimelinePhotoV1Props>({ meta: theme09TimelinePhotoV1Meta, component: Theme09TimelinePhotoV1, schema: theme09TimelinePhotoV1Schema });
registerLayout<Theme09FilmstripV1Props>({ meta: theme09FilmstripV1Meta, component: Theme09FilmstripV1, schema: theme09FilmstripV1Schema });
registerLayout<Theme09MosaicV1Props>({ meta: theme09MosaicV1Meta, component: Theme09MosaicV1, schema: theme09MosaicV1Schema });
registerLayout<Theme09TestimonialV1Props>({ meta: theme09TestimonialV1Meta, component: Theme09TestimonialV1, schema: theme09TestimonialV1Schema });
registerLayout<Theme09TeamV1Props>({ meta: theme09TeamV1Meta, component: Theme09TeamV1, schema: theme09TeamV1Schema });
registerLayout<Theme09PhotoRingV1Props>({ meta: theme09PhotoRingV1Meta, component: Theme09PhotoRingV1, schema: theme09PhotoRingV1Schema });
registerLayout<Theme09DividerPhotoV1Props>({ meta: theme09DividerPhotoV1Meta, component: Theme09DividerPhotoV1, schema: theme09DividerPhotoV1Schema });
registerLayout<Theme09CoverStoryV1Props>({ meta: theme09CoverStoryV1Meta, component: Theme09CoverStoryV1, schema: theme09CoverStoryV1Schema });
registerLayout<Theme09QuotePortraitV1Props>({ meta: theme09QuotePortraitV1Meta, component: Theme09QuotePortraitV1, schema: theme09QuotePortraitV1Schema });
registerLayout<Theme09ManifestoV1Props>({ meta: theme09ManifestoV1Meta, component: Theme09ManifestoV1, schema: theme09ManifestoV1Schema });
registerLayout<Theme09AnnotatedV1Props>({ meta: theme09AnnotatedV1Meta, component: Theme09AnnotatedV1, schema: theme09AnnotatedV1Schema });
registerLayout<Theme09DiptychV1Props>({ meta: theme09DiptychV1Meta, component: Theme09DiptychV1, schema: theme09DiptychV1Schema });
registerLayout<Theme09CaseFolioV1Props>({ meta: theme09CaseFolioV1Meta, component: Theme09CaseFolioV1, schema: theme09CaseFolioV1Schema });
registerLayout<Theme09SplitDiagonalV1Props>({ meta: theme09SplitDiagonalV1Meta, component: Theme09SplitDiagonalV1, schema: theme09SplitDiagonalV1Schema });

// ── P1 收官批（10 个） ──
import {
  Theme09TyperiverV1,
  theme09TyperiverV1Meta,
  theme09TyperiverV1Schema,
  type Theme09TyperiverV1Props,
} from './themes/theme09/typeriver-v1.js';
import {
  Theme09ExhibitWallV1,
  theme09ExhibitWallV1Meta,
  theme09ExhibitWallV1Schema,
  type Theme09ExhibitWallV1Props,
} from './themes/theme09/exhibit-wall-v1.js';
import {
  Theme09MasonryV1,
  theme09MasonryV1Meta,
  theme09MasonryV1Schema,
  type Theme09MasonryV1Props,
} from './themes/theme09/masonry-v1.js';
import {
  Theme09JourneyV1,
  theme09JourneyV1Meta,
  theme09JourneyV1Schema,
  type Theme09JourneyV1Props,
} from './themes/theme09/journey-v1.js';
import {
  Theme09PhotoCardsV1,
  theme09PhotoCardsV1Meta,
  theme09PhotoCardsV1Schema,
  type Theme09PhotoCardsV1Props,
} from './themes/theme09/photo-cards-v1.js';
import {
  Theme09ZineSpreadV1,
  theme09ZineSpreadV1Meta,
  theme09ZineSpreadV1Schema,
  type Theme09ZineSpreadV1Props,
} from './themes/theme09/zine-spread-v1.js';
import {
  Theme09PhotoSceneV1,
  theme09PhotoSceneV1Meta,
  theme09PhotoSceneV1Schema,
  type Theme09PhotoSceneV1Props,
} from './themes/theme09/photo-scene-v1.js';
import {
  Theme09SpotlightV1,
  theme09SpotlightV1Meta,
  theme09SpotlightV1Schema,
  type Theme09SpotlightV1Props,
} from './themes/theme09/spotlight-v1.js';
import {
  Theme09ProfileV1,
  theme09ProfileV1Meta,
  theme09ProfileV1Schema,
  type Theme09ProfileV1Props,
} from './themes/theme09/profile-v1.js';
import {
  Theme09GalleryWallV1,
  theme09GalleryWallV1Meta,
  theme09GalleryWallV1Schema,
  type Theme09GalleryWallV1Props,
} from './themes/theme09/gallery-wall-v1.js';
import {
  Theme09DotMatrixV1,
  theme09DotMatrixV1Meta,
  theme09DotMatrixV1Schema,
  type Theme09DotMatrixV1Props,
} from './themes/theme09/dotmatrix-v1.js';
import {
  Theme09MarketOverviewV1,
  theme09MarketOverviewV1Meta,
  theme09MarketOverviewV1Schema,
  type Theme09MarketOverviewV1Props,
} from './themes/theme09/market-overview-v1.js';
import {
  Theme09StreamgraphV1,
  theme09StreamgraphV1Meta,
  theme09StreamgraphV1Schema,
  type Theme09StreamgraphV1Props,
} from './themes/theme09/streamgraph-v1.js';
import {
  Theme09ChordV1,
  theme09ChordV1Meta,
  theme09ChordV1Schema,
  type Theme09ChordV1Props,
} from './themes/theme09/chord-v1.js';
import {
  Theme09SunburstV1,
  theme09SunburstV1Meta,
  theme09SunburstV1Schema,
  type Theme09SunburstV1Props,
} from './themes/theme09/sunburst-v1.js';
import {
  Theme09RibbonV1,
  theme09RibbonV1Meta,
  theme09RibbonV1Schema,
  type Theme09RibbonV1Props,
} from './themes/theme09/ribbon-v1.js';
import {
  Theme09RoundsV1,
  theme09RoundsV1Meta,
  theme09RoundsV1Schema,
  type Theme09RoundsV1Props,
} from './themes/theme09/rounds-v1.js';
import {
  Theme09RankingV1,
  theme09RankingV1Meta,
  theme09RankingV1Schema,
  type Theme09RankingV1Props,
} from './themes/theme09/ranking-v1.js';

/* ═════════════════ theme09 · P3 批次一 · 推演与结构（9 版式）════════════════ */
import {
  Theme09CrossPerspectiveV1,
  theme09CrossPerspectiveV1Meta,
  theme09CrossPerspectiveV1Schema,
  type Theme09CrossPerspectiveV1Props,
} from './themes/theme09/cross-perspective-v1.js';
import {
  Theme09ThesisV1,
  theme09ThesisV1Meta,
  theme09ThesisV1Schema,
  type Theme09ThesisV1Props,
} from './themes/theme09/thesis-v1.js';
import {
  Theme09ValueChainV1,
  theme09ValueChainV1Meta,
  theme09ValueChainV1Schema,
  type Theme09ValueChainV1Props,
} from './themes/theme09/value-chain-v1.js';
import {
  Theme09RiskV1,
  theme09RiskV1Meta,
  theme09RiskV1Schema,
  type Theme09RiskV1Props,
} from './themes/theme09/risk-v1.js';
import {
  Theme09OutlookV1,
  theme09OutlookV1Meta,
  theme09OutlookV1Schema,
  type Theme09OutlookV1Props,
} from './themes/theme09/outlook-v1.js';
import {
  Theme09ConclusionV1,
  theme09ConclusionV1Meta,
  theme09ConclusionV1Schema,
  type Theme09ConclusionV1Props,
} from './themes/theme09/conclusion-v1.js';
import {
  Theme09BracketV1,
  theme09BracketV1Meta,
  theme09BracketV1Schema,
  type Theme09BracketV1Props,
} from './themes/theme09/bracket-v1.js';
import {
  Theme09FlowV1,
  theme09FlowV1Meta,
  theme09FlowV1Schema,
  type Theme09FlowV1Props,
} from './themes/theme09/flow-v1.js';
import {
  Theme09OrbitV1,
  theme09OrbitV1Meta,
  theme09OrbitV1Schema,
  type Theme09OrbitV1Props,
} from './themes/theme09/orbit-v1.js';

/* ═════════════════ theme09 · P3 批次二 · 时序与量化（9 版式）════════════════ */
import {
  Theme09VerticalV1,
  theme09VerticalV1Meta,
  theme09VerticalV1Schema,
  type Theme09VerticalV1Props,
} from './themes/theme09/vertical-v1.js';
import {
  Theme09CalendarV1,
  theme09CalendarV1Meta,
  theme09CalendarV1Schema,
  type Theme09CalendarV1Props,
} from './themes/theme09/calendar-v1.js';
import {
  Theme09PhasesV1,
  theme09PhasesV1Meta,
  theme09PhasesV1Schema,
  type Theme09PhasesV1Props,
} from './themes/theme09/phases-v1.js';
import {
  Theme09GaugeV1,
  theme09GaugeV1Meta,
  theme09GaugeV1Schema,
  type Theme09GaugeV1Props,
} from './themes/theme09/gauge-v1.js';
import {
  Theme09ScoreboardV1,
  theme09ScoreboardV1Meta,
  theme09ScoreboardV1Schema,
  type Theme09ScoreboardV1Props,
} from './themes/theme09/scoreboard-v1.js';
import {
  Theme09TrendV1,
  theme09TrendV1Meta,
  theme09TrendV1Schema,
  type Theme09TrendV1Props,
} from './themes/theme09/trend-v1.js';
import {
  Theme09HistogramV1,
  theme09HistogramV1Meta,
  theme09HistogramV1Schema,
  type Theme09HistogramV1Props,
} from './themes/theme09/histogram-v1.js';
import {
  Theme09ForecastFanV1,
  theme09ForecastFanV1Meta,
  theme09ForecastFanV1Schema,
  type Theme09ForecastFanV1Props,
} from './themes/theme09/forecast-fan-v1.js';
import {
  Theme09PlansV1,
  theme09PlansV1Meta,
  theme09PlansV1Schema,
  type Theme09PlansV1Props,
} from './themes/theme09/plans-v1.js';

/* ═══════════════ theme09 · P2 数据图表（剩余 32 版式）═══════════════ */
import {
  Theme09BumpV1,
  theme09BumpV1Meta,
  theme09BumpV1Schema,
  type Theme09BumpV1Props,
} from './themes/theme09/bump-v1.js';
import {
  Theme09HeroNumberV1,
  theme09HeroNumberV1Meta,
  theme09HeroNumberV1Schema,
  type Theme09HeroNumberV1Props,
} from './themes/theme09/hero-number-v1.js';
import {
  Theme09VersusV1,
  theme09VersusV1Meta,
  theme09VersusV1Schema,
  type Theme09VersusV1Props,
} from './themes/theme09/versus-v1.js';
import {
  Theme09SpiralV1,
  theme09SpiralV1Meta,
  theme09SpiralV1Schema,
  type Theme09SpiralV1Props,
} from './themes/theme09/spiral-v1.js';
import {
  Theme09FunnelV1,
  theme09FunnelV1Meta,
  theme09FunnelV1Schema,
  type Theme09FunnelV1Props,
} from './themes/theme09/funnel-v1.js';
import {
  Theme09StatGridV1,
  theme09StatGridV1Meta,
  theme09StatGridV1Schema,
  type Theme09StatGridV1Props,
} from './themes/theme09/stat-grid-v1.js';
import {
  Theme09ArcV1,
  theme09ArcV1Meta,
  theme09ArcV1Schema,
  type Theme09ArcV1Props,
} from './themes/theme09/arc-v1.js';
import {
  Theme09NetworkV1,
  theme09NetworkV1Meta,
  theme09NetworkV1Schema,
  type Theme09NetworkV1Props,
} from './themes/theme09/network-v1.js';
import {
  Theme09AreaV1,
  theme09AreaV1Meta,
  theme09AreaV1Schema,
  type Theme09AreaV1Props,
} from './themes/theme09/area-v1.js';
import {
  Theme09MegaNumberV1,
  theme09MegaNumberV1Meta,
  theme09MegaNumberV1Schema,
  type Theme09MegaNumberV1Props,
} from './themes/theme09/mega-number-v1.js';
import {
  Theme09RadarV1,
  theme09RadarV1Meta,
  theme09RadarV1Schema,
  type Theme09RadarV1Props,
} from './themes/theme09/radar-v1.js';
import {
  Theme09RadialbarV1,
  theme09RadialbarV1Meta,
  theme09RadialbarV1Schema,
  type Theme09RadialbarV1Props,
} from './themes/theme09/radialbar-v1.js';
import {
  Theme09HoneycombV1,
  theme09HoneycombV1Meta,
  theme09HoneycombV1Schema,
  type Theme09HoneycombV1Props,
} from './themes/theme09/honeycomb-v1.js';
import {
  Theme09TornadoV1,
  theme09TornadoV1Meta,
  theme09TornadoV1Schema,
  type Theme09TornadoV1Props,
} from './themes/theme09/tornado-v1.js';
import {
  Theme09MatrixV1,
  theme09MatrixV1Meta,
  theme09MatrixV1Schema,
  type Theme09MatrixV1Props,
} from './themes/theme09/matrix-v1.js';
import {
  Theme09QuadrantV1,
  theme09QuadrantV1Meta,
  theme09QuadrantV1Schema,
  type Theme09QuadrantV1Props,
} from './themes/theme09/quadrant-v1.js';
import {
  Theme09BubbleV1,
  theme09BubbleV1Meta,
  theme09BubbleV1Schema,
  type Theme09BubbleV1Props,
} from './themes/theme09/bubble-v1.js';
import {
  Theme09MarimekkoV1,
  theme09MarimekkoV1Meta,
  theme09MarimekkoV1Schema,
  type Theme09MarimekkoV1Props,
} from './themes/theme09/marimekko-v1.js';
import {
  Theme09MeterV1,
  theme09MeterV1Meta,
  theme09MeterV1Schema,
  type Theme09MeterV1Props,
} from './themes/theme09/meter-v1.js';
import {
  Theme09ParallelV1,
  theme09ParallelV1Meta,
  theme09ParallelV1Schema,
  type Theme09ParallelV1Props,
} from './themes/theme09/parallel-v1.js';
import {
  Theme09GradeV1,
  theme09GradeV1Meta,
  theme09GradeV1Schema,
  type Theme09GradeV1Props,
} from './themes/theme09/grade-v1.js';
import {
  Theme09SlopeV1,
  theme09SlopeV1Meta,
  theme09SlopeV1Schema,
  type Theme09SlopeV1Props,
} from './themes/theme09/slope-v1.js';
import {
  Theme09DumbbellV1,
  theme09DumbbellV1Meta,
  theme09DumbbellV1Schema,
  type Theme09DumbbellV1Props,
} from './themes/theme09/dumbbell-v1.js';
import {
  Theme09CrosstabV1,
  theme09CrosstabV1Meta,
  theme09CrosstabV1Schema,
  type Theme09CrosstabV1Props,
} from './themes/theme09/crosstab-v1.js';
import {
  Theme09TierV1,
  theme09TierV1Meta,
  theme09TierV1Schema,
  type Theme09TierV1Props,
} from './themes/theme09/tier-v1.js';
import {
  Theme09LedgerV1,
  theme09LedgerV1Meta,
  theme09LedgerV1Schema,
  type Theme09LedgerV1Props,
} from './themes/theme09/ledger-v1.js';
import {
  Theme09AllocV1,
  theme09AllocV1Meta,
  theme09AllocV1Schema,
  type Theme09AllocV1Props,
} from './themes/theme09/alloc-v1.js';
import {
  Theme09VennV1,
  theme09VennV1Meta,
  theme09VennV1Schema,
  type Theme09VennV1Props,
} from './themes/theme09/venn-v1.js';
import {
  Theme09TreemapV1,
  theme09TreemapV1Meta,
  theme09TreemapV1Schema,
  type Theme09TreemapV1Props,
} from './themes/theme09/treemap-v1.js';
import {
  Theme09IcicleV1,
  theme09IcicleV1Meta,
  theme09IcicleV1Schema,
  type Theme09IcicleV1Props,
} from './themes/theme09/icicle-v1.js';
import {
  Theme09WaterfallV1,
  theme09WaterfallV1Meta,
  theme09WaterfallV1Schema,
  type Theme09WaterfallV1Props,
} from './themes/theme09/waterfall-v1.js';
import {
  Theme09HeatmapV1,
  theme09HeatmapV1Meta,
  theme09HeatmapV1Schema,
  type Theme09HeatmapV1Props,
} from './themes/theme09/heatmap-v1.js';
import {
  Theme09CompareV1,
  theme09CompareV1Meta,
  theme09CompareV1Schema,
  type Theme09CompareV1Props,
} from './themes/theme09/compare-v1.js';
import {
  Theme09EraV1,
  theme09EraV1Meta,
  theme09EraV1Schema,
  type Theme09EraV1Props,
} from './themes/theme09/era-v1.js';
import {
  Theme09FaqV1,
  theme09FaqV1Meta,
  theme09FaqV1Schema,
  type Theme09FaqV1Props,
} from './themes/theme09/faq-v1.js';
import {
  Theme09ProcessV1,
  theme09ProcessV1Meta,
  theme09ProcessV1Schema,
  type Theme09ProcessV1Props,
} from './themes/theme09/process-v1.js';
import {
  Theme09RoadmapV1,
  theme09RoadmapV1Meta,
  theme09RoadmapV1Schema,
  type Theme09RoadmapV1Props,
} from './themes/theme09/roadmap-v1.js';
import {
  Theme09ScoreV1,
  theme09ScoreV1Meta,
  theme09ScoreV1Schema,
  type Theme09ScoreV1Props,
} from './themes/theme09/score-v1.js';
import {
  Theme09StackedV1,
  theme09StackedV1Meta,
  theme09StackedV1Schema,
  type Theme09StackedV1Props,
} from './themes/theme09/stacked-v1.js';
import {
  Theme09StairV1,
  theme09StairV1Meta,
  theme09StairV1Schema,
  type Theme09StairV1Props,
} from './themes/theme09/stair-v1.js';
import {
  Theme09TakeawayV1,
  theme09TakeawayV1Meta,
  theme09TakeawayV1Schema,
  type Theme09TakeawayV1Props,
} from './themes/theme09/takeaway-v1.js';

// theme10 版式（P0 骨架 12 个）— 金色指数 · 金融编辑风
import {
  Theme10CoverDuskV1,
  theme10CoverDuskV1Meta,
  theme10CoverDuskV1Schema,
  type Theme10CoverDuskV1Props,
} from './themes/theme10/cover-dusk-v1.js';
import {
  Theme10CoverFieldV1,
  theme10CoverFieldV1Meta,
  theme10CoverFieldV1Schema,
  type Theme10CoverFieldV1Props,
} from './themes/theme10/cover-field-v1.js';
import {
  Theme10CoverAtmosV1,
  theme10CoverAtmosV1Meta,
  theme10CoverAtmosV1Schema,
  type Theme10CoverAtmosV1Props,
} from './themes/theme10/cover-atmos-v1.js';
import {
  Theme10CoverHorizonV1,
  theme10CoverHorizonV1Meta,
  theme10CoverHorizonV1Schema,
  type Theme10CoverHorizonV1Props,
} from './themes/theme10/cover-horizon-v1.js';
import {
  Theme10CoverStandardV1,
  theme10CoverStandardV1Meta,
  theme10CoverStandardV1Schema,
  type Theme10CoverStandardV1Props,
} from './themes/theme10/cover-standard-v1.js';
import {
  Theme10CoverDawnV1,
  theme10CoverDawnV1Meta,
  theme10CoverDawnV1Schema,
  type Theme10CoverDawnV1Props,
} from './themes/theme10/cover-dawn-v1.js';
import {
  Theme10ChapterV1,
  theme10ChapterV1Meta,
  theme10ChapterV1Schema,
  type Theme10ChapterV1Props,
} from './themes/theme10/chapter-v1.js';
import {
  Theme10DividerV1,
  theme10DividerV1Meta,
  theme10DividerV1Schema,
  type Theme10DividerV1Props,
} from './themes/theme10/divider-v1.js';
import {
  Theme10StatementSectionV1,
  theme10StatementSectionV1Meta,
  theme10StatementSectionV1Schema,
  type Theme10StatementSectionV1Props,
} from './themes/theme10/statement-section-v1.js';
import {
  Theme10StatementV1,
  theme10StatementV1Meta,
  theme10StatementV1Schema,
  type Theme10StatementV1Props,
} from './themes/theme10/statement-v1.js';
import {
  Theme10PrinciplesV1,
  theme10PrinciplesV1Meta,
  theme10PrinciplesV1Schema,
  type Theme10PrinciplesV1Props,
} from './themes/theme10/principles-v1.js';
import {
  Theme10ClosingV1,
  theme10ClosingV1Meta,
  theme10ClosingV1Schema,
  type Theme10ClosingV1Props,
} from './themes/theme10/closing-v1.js';
import {
  Theme10ProfileV1,
  theme10ProfileV1Meta,
  theme10ProfileV1Schema,
  type Theme10ProfileV1Props,
} from './themes/theme10/profile-v1.js';
import {
  Theme10TeamV1,
  theme10TeamV1Meta,
  theme10TeamV1Schema,
  type Theme10TeamV1Props,
} from './themes/theme10/team-v1.js';
import {
  Theme10QuoteV1,
  theme10QuoteV1Meta,
  theme10QuoteV1Schema,
  type Theme10QuoteV1Props,
} from './themes/theme10/quote-v1.js';
import {
  Theme10EditorialV1,
  theme10EditorialV1Meta,
  theme10EditorialV1Schema,
  type Theme10EditorialV1Props,
} from './themes/theme10/editorial-v1.js';
import {
  Theme10MagazineV1,
  theme10MagazineV1Meta,
  theme10MagazineV1Schema,
  type Theme10MagazineV1Props,
} from './themes/theme10/magazine-v1.js';
import {
  Theme10TriptychV1,
  theme10TriptychV1Meta,
  theme10TriptychV1Schema,
  type Theme10TriptychV1Props,
} from './themes/theme10/triptych-v1.js';
import {
  Theme10StrataV1,
  theme10StrataV1Meta,
  theme10StrataV1Schema,
  type Theme10StrataV1Props,
} from './themes/theme10/strata-v1.js';
import {
  Theme10SparkV1,
  theme10SparkV1Meta,
  theme10SparkV1Schema,
  type Theme10SparkV1Props,
} from './themes/theme10/spark-v1.js';
import {
  Theme10TestimonialsV1,
  theme10TestimonialsV1Meta,
  theme10TestimonialsV1Schema,
  type Theme10TestimonialsV1Props,
} from './themes/theme10/testimonials-v1.js';
import {
  Theme10FeatureV1,
  theme10FeatureV1Meta,
  theme10FeatureV1Schema,
  type Theme10FeatureV1Props,
} from './themes/theme10/feature-v1.js';
import {
  Theme10CompareImgV1,
  theme10CompareImgV1Meta,
  theme10CompareImgV1Schema,
  type Theme10CompareImgV1Props,
} from './themes/theme10/compareimg-v1.js';
import {
  Theme10PinboardV1,
  theme10PinboardV1Meta,
  theme10PinboardV1Schema,
  type Theme10PinboardV1Props,
} from './themes/theme10/pinboard-v1.js';
import {
  Theme10FilmstripV1,
  theme10FilmstripV1Meta,
  theme10FilmstripV1Schema,
  type Theme10FilmstripV1Props,
} from './themes/theme10/filmstrip-v1.js';
import {
  Theme10InsetV1,
  theme10InsetV1Meta,
  theme10InsetV1Schema,
  type Theme10InsetV1Props,
} from './themes/theme10/inset-v1.js';
import {
  Theme10Gallery2V1,
  theme10Gallery2V1Meta,
  theme10Gallery2V1Schema,
  type Theme10Gallery2V1Props,
} from './themes/theme10/gallery2-v1.js';
import {
  Theme10MosaicV1,
  theme10MosaicV1Meta,
  theme10MosaicV1Schema,
  type Theme10MosaicV1Props,
} from './themes/theme10/mosaic-v1.js';
import {
  Theme10CollageV1,
  theme10CollageV1Meta,
  theme10CollageV1Schema,
  type Theme10CollageV1Props,
} from './themes/theme10/collage-v1.js';
import {
  Theme10CaptionedV1,
  theme10CaptionedV1Meta,
  theme10CaptionedV1Schema,
  type Theme10CaptionedV1Props,
} from './themes/theme10/captioned-v1.js';
import {
  Theme10ShowcaseV1,
  theme10ShowcaseV1Meta,
  theme10ShowcaseV1Schema,
  type Theme10ShowcaseV1Props,
} from './themes/theme10/showcase-v1.js';
import {
  Theme10PosterV1,
  theme10PosterV1Meta,
  theme10PosterV1Schema,
  type Theme10PosterV1Props,
} from './themes/theme10/poster-v1.js';
import {
  Theme10AnnotatedV1,
  theme10AnnotatedV1Meta,
  theme10AnnotatedV1Schema,
  type Theme10AnnotatedV1Props,
} from './themes/theme10/annotated-v1.js';
import {
  Theme10QuoteImgV1,
  theme10QuoteImgV1Meta,
  theme10QuoteImgV1Schema,
  type Theme10QuoteImgV1Props,
} from './themes/theme10/quoteimg-v1.js';
import {
  Theme10QuiltV1,
  theme10QuiltV1Meta,
  theme10QuiltV1Schema,
  type Theme10QuiltV1Props,
} from './themes/theme10/quilt-v1.js';
import {
  Theme10ExhibitV1,
  theme10ExhibitV1Meta,
  theme10ExhibitV1Schema,
  type Theme10ExhibitV1Props,
} from './themes/theme10/exhibit-v1.js';
import {
  Theme10MedallionsV1,
  theme10MedallionsV1Meta,
  theme10MedallionsV1Schema,
  type Theme10MedallionsV1Props,
} from './themes/theme10/medallions-v1.js';
import {
  Theme10BarV1,
  theme10BarV1Meta,
  theme10BarV1Schema,
  type Theme10BarV1Props,
} from './themes/theme10/bar-v1.js';
import {
  Theme10HBarV1,
  theme10HBarV1Meta,
  theme10HBarV1Schema,
  type Theme10HBarV1Props,
} from './themes/theme10/hbar-v1.js';
import {
  Theme10LineV1,
  theme10LineV1Meta,
  theme10LineV1Schema,
  type Theme10LineV1Props,
} from './themes/theme10/line-v1.js';
import {
  Theme10AreaV1,
  theme10AreaV1Meta,
  theme10AreaV1Schema,
  type Theme10AreaV1Props,
} from './themes/theme10/area-v1.js';
import {
  Theme10KpisV1,
  theme10KpisV1Meta,
  theme10KpisV1Schema,
  type Theme10KpisV1Props,
} from './themes/theme10/kpis-v1.js';
import {
  Theme10GroupedV1,
  theme10GroupedV1Meta,
  theme10GroupedV1Schema,
  type Theme10GroupedV1Props,
} from './themes/theme10/grouped-v1.js';
import {
  Theme10StackV1,
  theme10StackV1Meta,
  theme10StackV1Schema,
  type Theme10StackV1Props,
} from './themes/theme10/stack-v1.js';
import {
  Theme10DonutV1,
  theme10DonutV1Meta,
  theme10DonutV1Schema,
  type Theme10DonutV1Props,
} from './themes/theme10/donut-v1.js';
import {
  Theme10PieV1,
  theme10PieV1Meta,
  theme10PieV1Schema,
  type Theme10PieV1Props,
} from './themes/theme10/pie-v1.js';
import {
  Theme10WaterfallV1,
  theme10WaterfallV1Meta,
  theme10WaterfallV1Schema,
  type Theme10WaterfallV1Props,
} from './themes/theme10/waterfall-v1.js';
import {
  Theme10ScatterV1,
  theme10ScatterV1Meta,
  theme10ScatterV1Schema,
  type Theme10ScatterV1Props,
} from './themes/theme10/scatter-v1.js';
import {
  Theme10BubbleV1,
  theme10BubbleV1Meta,
  theme10BubbleV1Schema,
  type Theme10BubbleV1Props,
} from './themes/theme10/bubble-v1.js';
import {
  Theme10RadarV1,
  theme10RadarV1Meta,
  theme10RadarV1Schema,
  type Theme10RadarV1Props,
} from './themes/theme10/radar-v1.js';
import {
  Theme10RadialV1,
  theme10RadialV1Meta,
  theme10RadialV1Schema,
  type Theme10RadialV1Props,
} from './themes/theme10/radial-v1.js';
import {
  Theme10HeatV1,
  theme10HeatV1Meta,
  theme10HeatV1Schema,
  type Theme10HeatV1Props,
} from './themes/theme10/heat-v1.js';
// theme10 金色指数 · P2 数据图表 · 批次I（趋势与时间 5 版式）
import {
  Theme10TrendV1,
  theme10TrendV1Meta,
  theme10TrendV1Schema,
  type Theme10TrendV1Props,
} from './themes/theme10/trend-v1.js';
import {
  Theme10RangeV1,
  theme10RangeV1Meta,
  theme10RangeV1Schema,
  type Theme10RangeV1Props,
} from './themes/theme10/range-v1.js';
import {
  Theme10CandlestickV1,
  theme10CandlestickV1Meta,
  theme10CandlestickV1Schema,
  type Theme10CandlestickV1Props,
} from './themes/theme10/candlestick-v1.js';
import {
  Theme10RidgelineV1,
  theme10RidgelineV1Meta,
  theme10RidgelineV1Schema,
  type Theme10RidgelineV1Props,
} from './themes/theme10/ridgeline-v1.js';
import {
  Theme10CalendarV1,
  theme10CalendarV1Meta,
  theme10CalendarV1Schema,
  type Theme10CalendarV1Props,
} from './themes/theme10/calendar-v1.js';
import {
  Theme10FunnelV1,
  theme10FunnelV1Meta,
  theme10FunnelV1Schema,
  type Theme10FunnelV1Props,
} from './themes/theme10/funnel-v1.js';
import {
  Theme10GaugeV1,
  theme10GaugeV1Meta,
  theme10GaugeV1Schema,
  type Theme10GaugeV1Props,
} from './themes/theme10/gauge-v1.js';
import {
  Theme10BulletV1,
  theme10BulletV1Meta,
  theme10BulletV1Schema,
  type Theme10BulletV1Props,
} from './themes/theme10/bullet-v1.js';
import {
  Theme10BoxV1,
  theme10BoxV1Meta,
  theme10BoxV1Schema,
  type Theme10BoxV1Props,
} from './themes/theme10/box-v1.js';
import {
  Theme10TreemapV1,
  theme10TreemapV1Meta,
  theme10TreemapV1Schema,
  type Theme10TreemapV1Props,
} from './themes/theme10/treemap-v1.js';
import {
  Theme10GanttV1,
  theme10GanttV1Meta,
  theme10GanttV1Schema,
  type Theme10GanttV1Props,
} from './themes/theme10/gantt-v1.js';
import {
  Theme10BumpV1,
  theme10BumpV1Meta,
  theme10BumpV1Schema,
  type Theme10BumpV1Props,
} from './themes/theme10/bump-v1.js';
import {
  Theme10RoseV1,
  theme10RoseV1Meta,
  theme10RoseV1Schema,
  type Theme10RoseV1Props,
} from './themes/theme10/rose-v1.js';
import {
  Theme10DotplotV1,
  theme10DotplotV1Meta,
  theme10DotplotV1Schema,
  type Theme10DotplotV1Props,
} from './themes/theme10/dotplot-v1.js';
import {
  Theme10TimelineV1,
  theme10TimelineV1Meta,
  theme10TimelineV1Schema,
  type Theme10TimelineV1Props,
} from './themes/theme10/timeline-v1.js';
import {
  Theme10OrgchartV1,
  theme10OrgchartV1Meta,
  theme10OrgchartV1Schema,
  type Theme10OrgchartV1Props,
} from './themes/theme10/orgchart-v1.js';
import {
  Theme10ParallelV1,
  theme10ParallelV1Meta,
  theme10ParallelV1Schema,
  type Theme10ParallelV1Props,
} from './themes/theme10/parallel-v1.js';
import {
  Theme10CirclepackV1,
  theme10CirclepackV1Meta,
  theme10CirclepackV1Schema,
  type Theme10CirclepackV1Props,
} from './themes/theme10/circlepack-v1.js';
import {
  Theme10CscatterV1,
  theme10CscatterV1Meta,
  theme10CscatterV1Schema,
  type Theme10CscatterV1Props,
} from './themes/theme10/cscatter-v1.js';
import {
  Theme10MarimekkoV1,
  theme10MarimekkoV1Meta,
  theme10MarimekkoV1Schema,
  type Theme10MarimekkoV1Props,
} from './themes/theme10/marimekko-v1.js';
import {
  Theme10SankeyV1,
  theme10SankeyV1Meta,
  theme10SankeyV1Schema,
  type Theme10SankeyV1Props,
} from './themes/theme10/sankey-v1.js';
import {
  Theme10DumbbellV1,
  theme10DumbbellV1Meta,
  theme10DumbbellV1Schema,
  type Theme10DumbbellV1Props,
} from './themes/theme10/dumbbell-v1.js';
import {
  Theme10HistogramV1,
  theme10HistogramV1Meta,
  theme10HistogramV1Schema,
  type Theme10HistogramV1Props,
} from './themes/theme10/histogram-v1.js';
import {
  Theme10SlopeV1,
  theme10SlopeV1Meta,
  theme10SlopeV1Schema,
  type Theme10SlopeV1Props,
} from './themes/theme10/slope-v1.js';
import {
  Theme10WaffleV1,
  theme10WaffleV1Meta,
  theme10WaffleV1Schema,
  type Theme10WaffleV1Props,
} from './themes/theme10/waffle-v1.js';
// theme10 P3 结构 / 流程 / 长尾（11 版式）
import {
  Theme10StepsV1,
  theme10StepsV1Meta,
  theme10StepsV1Schema,
  type Theme10StepsV1Props,
} from './themes/theme10/steps-v1.js';
import {
  Theme10CycleV1,
  theme10CycleV1Meta,
  theme10CycleV1Schema,
  type Theme10CycleV1Props,
} from './themes/theme10/cycle-v1.js';
import {
  Theme10SwimlaneV1,
  theme10SwimlaneV1Meta,
  theme10SwimlaneV1Schema,
  type Theme10SwimlaneV1Props,
} from './themes/theme10/swimlane-v1.js';
import {
  Theme10ChecklistV1,
  theme10ChecklistV1Meta,
  theme10ChecklistV1Schema,
  type Theme10ChecklistV1Props,
} from './themes/theme10/checklist-v1.js';
import {
  Theme10PlansV1,
  theme10PlansV1Meta,
  theme10PlansV1Schema,
  type Theme10PlansV1Props,
} from './themes/theme10/plans-v1.js';
import {
  Theme10JourneyV1,
  theme10JourneyV1Meta,
  theme10JourneyV1Schema,
  type Theme10JourneyV1Props,
} from './themes/theme10/journey-v1.js';
import {
  Theme10GoalsV1,
  theme10GoalsV1Meta,
  theme10GoalsV1Schema,
  type Theme10GoalsV1Props,
} from './themes/theme10/goals-v1.js';
import {
  Theme10GlossaryV1,
  theme10GlossaryV1Meta,
  theme10GlossaryV1Schema,
  type Theme10GlossaryV1Props,
} from './themes/theme10/glossary-v1.js';
import {
  Theme10FaqV1,
  theme10FaqV1Meta,
  theme10FaqV1Schema,
  type Theme10FaqV1Props,
} from './themes/theme10/faq-v1.js';
import {
  Theme10IsotypeV1,
  theme10IsotypeV1Meta,
  theme10IsotypeV1Schema,
  type Theme10IsotypeV1Props,
} from './themes/theme10/isotype-v1.js';
import {
  Theme10VennV1,
  theme10VennV1Meta,
  theme10VennV1Schema,
  type Theme10VennV1Props,
} from './themes/theme10/venn-v1.js';
import {
  Theme10MetricHeroV1,
  theme10MetricHeroV1Meta,
  theme10MetricHeroV1Schema,
  type Theme10MetricHeroV1Props,
} from './themes/theme10/metric-hero-v1.js';
import {
  Theme10ScorecardV1,
  theme10ScorecardV1Meta,
  theme10ScorecardV1Schema,
  type Theme10ScorecardV1Props,
} from './themes/theme10/scorecard-v1.js';
import {
  Theme10ComparisonStatV1,
  theme10ComparisonStatV1Meta,
  theme10ComparisonStatV1Schema,
  type Theme10ComparisonStatV1Props,
} from './themes/theme10/comparison-stat-v1.js';
import {
  Theme10SmallMultiplesV1,
  theme10SmallMultiplesV1Meta,
  theme10SmallMultiplesV1Schema,
  type Theme10SmallMultiplesV1Props,
} from './themes/theme10/small-multiples-v1.js';
import {
  Theme10StatStripV1,
  theme10StatStripV1Meta,
  theme10StatStripV1Schema,
  type Theme10StatStripV1Props,
} from './themes/theme10/stat-strip-v1.js';
import {
  Theme10QuoteStatV1,
  theme10QuoteStatV1Meta,
  theme10QuoteStatV1Schema,
  type Theme10QuoteStatV1Props,
} from './themes/theme10/quote-stat-v1.js';
import {
  Theme10IndexBoardV1,
  theme10IndexBoardV1Meta,
  theme10IndexBoardV1Schema,
  type Theme10IndexBoardV1Props,
} from './themes/theme10/index-board-v1.js';

registerLayout<Theme09TyperiverV1Props>({ meta: theme09TyperiverV1Meta, component: Theme09TyperiverV1, schema: theme09TyperiverV1Schema });
registerLayout<Theme09ExhibitWallV1Props>({ meta: theme09ExhibitWallV1Meta, component: Theme09ExhibitWallV1, schema: theme09ExhibitWallV1Schema });
registerLayout<Theme09MasonryV1Props>({ meta: theme09MasonryV1Meta, component: Theme09MasonryV1, schema: theme09MasonryV1Schema });
registerLayout<Theme09JourneyV1Props>({ meta: theme09JourneyV1Meta, component: Theme09JourneyV1, schema: theme09JourneyV1Schema });
registerLayout<Theme09PhotoCardsV1Props>({ meta: theme09PhotoCardsV1Meta, component: Theme09PhotoCardsV1, schema: theme09PhotoCardsV1Schema });
registerLayout<Theme09ZineSpreadV1Props>({ meta: theme09ZineSpreadV1Meta, component: Theme09ZineSpreadV1, schema: theme09ZineSpreadV1Schema });
registerLayout<Theme09PhotoSceneV1Props>({ meta: theme09PhotoSceneV1Meta, component: Theme09PhotoSceneV1, schema: theme09PhotoSceneV1Schema });
registerLayout<Theme09SpotlightV1Props>({ meta: theme09SpotlightV1Meta, component: Theme09SpotlightV1, schema: theme09SpotlightV1Schema });
registerLayout<Theme09ProfileV1Props>({ meta: theme09ProfileV1Meta, component: Theme09ProfileV1, schema: theme09ProfileV1Schema });
registerLayout<Theme09GalleryWallV1Props>({ meta: theme09GalleryWallV1Meta, component: Theme09GalleryWallV1, schema: theme09GalleryWallV1Schema });
registerLayout<Theme09DotMatrixV1Props>({ meta: theme09DotMatrixV1Meta, component: Theme09DotMatrixV1, schema: theme09DotMatrixV1Schema });
registerLayout<Theme09MarketOverviewV1Props>({ meta: theme09MarketOverviewV1Meta, component: Theme09MarketOverviewV1, schema: theme09MarketOverviewV1Schema });
registerLayout<Theme09StreamgraphV1Props>({ meta: theme09StreamgraphV1Meta, component: Theme09StreamgraphV1, schema: theme09StreamgraphV1Schema });
registerLayout<Theme09ChordV1Props>({ meta: theme09ChordV1Meta, component: Theme09ChordV1, schema: theme09ChordV1Schema });
registerLayout<Theme09SunburstV1Props>({ meta: theme09SunburstV1Meta, component: Theme09SunburstV1, schema: theme09SunburstV1Schema });
registerLayout<Theme09RibbonV1Props>({ meta: theme09RibbonV1Meta, component: Theme09RibbonV1, schema: theme09RibbonV1Schema });
registerLayout<Theme09RoundsV1Props>({ meta: theme09RoundsV1Meta, component: Theme09RoundsV1, schema: theme09RoundsV1Schema });
registerLayout<Theme09RankingV1Props>({ meta: theme09RankingV1Meta, component: Theme09RankingV1, schema: theme09RankingV1Schema });

/* theme09 · P2 数据图表（剩余 32 版式） */
registerLayout<Theme09BumpV1Props>({ meta: theme09BumpV1Meta, component: Theme09BumpV1, schema: theme09BumpV1Schema });
registerLayout<Theme09HeroNumberV1Props>({ meta: theme09HeroNumberV1Meta, component: Theme09HeroNumberV1, schema: theme09HeroNumberV1Schema });
registerLayout<Theme09VersusV1Props>({ meta: theme09VersusV1Meta, component: Theme09VersusV1, schema: theme09VersusV1Schema });
registerLayout<Theme09SpiralV1Props>({ meta: theme09SpiralV1Meta, component: Theme09SpiralV1, schema: theme09SpiralV1Schema });
registerLayout<Theme09FunnelV1Props>({ meta: theme09FunnelV1Meta, component: Theme09FunnelV1, schema: theme09FunnelV1Schema });
registerLayout<Theme09StatGridV1Props>({ meta: theme09StatGridV1Meta, component: Theme09StatGridV1, schema: theme09StatGridV1Schema });
registerLayout<Theme09ArcV1Props>({ meta: theme09ArcV1Meta, component: Theme09ArcV1, schema: theme09ArcV1Schema });
registerLayout<Theme09NetworkV1Props>({ meta: theme09NetworkV1Meta, component: Theme09NetworkV1, schema: theme09NetworkV1Schema });
registerLayout<Theme09AreaV1Props>({ meta: theme09AreaV1Meta, component: Theme09AreaV1, schema: theme09AreaV1Schema });
registerLayout<Theme09MegaNumberV1Props>({ meta: theme09MegaNumberV1Meta, component: Theme09MegaNumberV1, schema: theme09MegaNumberV1Schema });
registerLayout<Theme09RadarV1Props>({ meta: theme09RadarV1Meta, component: Theme09RadarV1, schema: theme09RadarV1Schema });
registerLayout<Theme09RadialbarV1Props>({ meta: theme09RadialbarV1Meta, component: Theme09RadialbarV1, schema: theme09RadialbarV1Schema });
registerLayout<Theme09HoneycombV1Props>({ meta: theme09HoneycombV1Meta, component: Theme09HoneycombV1, schema: theme09HoneycombV1Schema });
registerLayout<Theme09TornadoV1Props>({ meta: theme09TornadoV1Meta, component: Theme09TornadoV1, schema: theme09TornadoV1Schema });
registerLayout<Theme09MatrixV1Props>({ meta: theme09MatrixV1Meta, component: Theme09MatrixV1, schema: theme09MatrixV1Schema });
registerLayout<Theme09QuadrantV1Props>({ meta: theme09QuadrantV1Meta, component: Theme09QuadrantV1, schema: theme09QuadrantV1Schema });
registerLayout<Theme09BubbleV1Props>({ meta: theme09BubbleV1Meta, component: Theme09BubbleV1, schema: theme09BubbleV1Schema });
registerLayout<Theme09MarimekkoV1Props>({ meta: theme09MarimekkoV1Meta, component: Theme09MarimekkoV1, schema: theme09MarimekkoV1Schema });
registerLayout<Theme09MeterV1Props>({ meta: theme09MeterV1Meta, component: Theme09MeterV1, schema: theme09MeterV1Schema });
registerLayout<Theme09ParallelV1Props>({ meta: theme09ParallelV1Meta, component: Theme09ParallelV1, schema: theme09ParallelV1Schema });
registerLayout<Theme09GradeV1Props>({ meta: theme09GradeV1Meta, component: Theme09GradeV1, schema: theme09GradeV1Schema });
registerLayout<Theme09SlopeV1Props>({ meta: theme09SlopeV1Meta, component: Theme09SlopeV1, schema: theme09SlopeV1Schema });
registerLayout<Theme09DumbbellV1Props>({ meta: theme09DumbbellV1Meta, component: Theme09DumbbellV1, schema: theme09DumbbellV1Schema });
registerLayout<Theme09CrosstabV1Props>({ meta: theme09CrosstabV1Meta, component: Theme09CrosstabV1, schema: theme09CrosstabV1Schema });
registerLayout<Theme09TierV1Props>({ meta: theme09TierV1Meta, component: Theme09TierV1, schema: theme09TierV1Schema });
registerLayout<Theme09LedgerV1Props>({ meta: theme09LedgerV1Meta, component: Theme09LedgerV1, schema: theme09LedgerV1Schema });
registerLayout<Theme09AllocV1Props>({ meta: theme09AllocV1Meta, component: Theme09AllocV1, schema: theme09AllocV1Schema });
registerLayout<Theme09VennV1Props>({ meta: theme09VennV1Meta, component: Theme09VennV1, schema: theme09VennV1Schema });
registerLayout<Theme09TreemapV1Props>({ meta: theme09TreemapV1Meta, component: Theme09TreemapV1, schema: theme09TreemapV1Schema });
registerLayout<Theme09IcicleV1Props>({ meta: theme09IcicleV1Meta, component: Theme09IcicleV1, schema: theme09IcicleV1Schema });
registerLayout<Theme09WaterfallV1Props>({ meta: theme09WaterfallV1Meta, component: Theme09WaterfallV1, schema: theme09WaterfallV1Schema });
registerLayout<Theme09HeatmapV1Props>({ meta: theme09HeatmapV1Meta, component: Theme09HeatmapV1, schema: theme09HeatmapV1Schema });

/* theme09 · P3 批次一（9 版式） */
registerLayout<Theme09CrossPerspectiveV1Props>({ meta: theme09CrossPerspectiveV1Meta, component: Theme09CrossPerspectiveV1, schema: theme09CrossPerspectiveV1Schema });
registerLayout<Theme09ThesisV1Props>({ meta: theme09ThesisV1Meta, component: Theme09ThesisV1, schema: theme09ThesisV1Schema });
registerLayout<Theme09ValueChainV1Props>({ meta: theme09ValueChainV1Meta, component: Theme09ValueChainV1, schema: theme09ValueChainV1Schema });
registerLayout<Theme09RiskV1Props>({ meta: theme09RiskV1Meta, component: Theme09RiskV1, schema: theme09RiskV1Schema });
registerLayout<Theme09OutlookV1Props>({ meta: theme09OutlookV1Meta, component: Theme09OutlookV1, schema: theme09OutlookV1Schema });
registerLayout<Theme09ConclusionV1Props>({ meta: theme09ConclusionV1Meta, component: Theme09ConclusionV1, schema: theme09ConclusionV1Schema });
registerLayout<Theme09BracketV1Props>({ meta: theme09BracketV1Meta, component: Theme09BracketV1, schema: theme09BracketV1Schema });
registerLayout<Theme09FlowV1Props>({ meta: theme09FlowV1Meta, component: Theme09FlowV1, schema: theme09FlowV1Schema });
registerLayout<Theme09OrbitV1Props>({ meta: theme09OrbitV1Meta, component: Theme09OrbitV1, schema: theme09OrbitV1Schema });

/* theme09 · P3 批次二（9 版式） */
registerLayout<Theme09VerticalV1Props>({ meta: theme09VerticalV1Meta, component: Theme09VerticalV1, schema: theme09VerticalV1Schema });
registerLayout<Theme09CalendarV1Props>({ meta: theme09CalendarV1Meta, component: Theme09CalendarV1, schema: theme09CalendarV1Schema });
registerLayout<Theme09PhasesV1Props>({ meta: theme09PhasesV1Meta, component: Theme09PhasesV1, schema: theme09PhasesV1Schema });
registerLayout<Theme09GaugeV1Props>({ meta: theme09GaugeV1Meta, component: Theme09GaugeV1, schema: theme09GaugeV1Schema });
registerLayout<Theme09ScoreboardV1Props>({ meta: theme09ScoreboardV1Meta, component: Theme09ScoreboardV1, schema: theme09ScoreboardV1Schema });
registerLayout<Theme09TrendV1Props>({ meta: theme09TrendV1Meta, component: Theme09TrendV1, schema: theme09TrendV1Schema });
registerLayout<Theme09HistogramV1Props>({ meta: theme09HistogramV1Meta, component: Theme09HistogramV1, schema: theme09HistogramV1Schema });
registerLayout<Theme09ForecastFanV1Props>({ meta: theme09ForecastFanV1Meta, component: Theme09ForecastFanV1, schema: theme09ForecastFanV1Schema });
registerLayout<Theme09PlansV1Props>({ meta: theme09PlansV1Meta, component: Theme09PlansV1, schema: theme09PlansV1Schema });

/* theme09 · P3 批次三（9 版式） */
registerLayout<Theme09StairV1Props>({ meta: theme09StairV1Meta, component: Theme09StairV1, schema: theme09StairV1Schema });
registerLayout<Theme09StackedV1Props>({ meta: theme09StackedV1Meta, component: Theme09StackedV1, schema: theme09StackedV1Schema });
registerLayout<Theme09EraV1Props>({ meta: theme09EraV1Meta, component: Theme09EraV1, schema: theme09EraV1Schema });
registerLayout<Theme09RoadmapV1Props>({ meta: theme09RoadmapV1Meta, component: Theme09RoadmapV1, schema: theme09RoadmapV1Schema });
registerLayout<Theme09ScoreV1Props>({ meta: theme09ScoreV1Meta, component: Theme09ScoreV1, schema: theme09ScoreV1Schema });
registerLayout<Theme09TakeawayV1Props>({ meta: theme09TakeawayV1Meta, component: Theme09TakeawayV1, schema: theme09TakeawayV1Schema });
registerLayout<Theme09CompareV1Props>({ meta: theme09CompareV1Meta, component: Theme09CompareV1, schema: theme09CompareV1Schema });
registerLayout<Theme09ProcessV1Props>({ meta: theme09ProcessV1Meta, component: Theme09ProcessV1, schema: theme09ProcessV1Schema });
registerLayout<Theme09FaqV1Props>({ meta: theme09FaqV1Meta, component: Theme09FaqV1, schema: theme09FaqV1Schema });

// theme10 金色指数 · 金融编辑风（P0 骨架 12 个版式）
registerLayout<Theme10CoverDuskV1Props>({ meta: theme10CoverDuskV1Meta, component: Theme10CoverDuskV1, schema: theme10CoverDuskV1Schema });
registerLayout<Theme10CoverFieldV1Props>({ meta: theme10CoverFieldV1Meta, component: Theme10CoverFieldV1, schema: theme10CoverFieldV1Schema });
registerLayout<Theme10CoverAtmosV1Props>({ meta: theme10CoverAtmosV1Meta, component: Theme10CoverAtmosV1, schema: theme10CoverAtmosV1Schema });
registerLayout<Theme10CoverHorizonV1Props>({ meta: theme10CoverHorizonV1Meta, component: Theme10CoverHorizonV1, schema: theme10CoverHorizonV1Schema });
registerLayout<Theme10CoverStandardV1Props>({ meta: theme10CoverStandardV1Meta, component: Theme10CoverStandardV1, schema: theme10CoverStandardV1Schema });
registerLayout<Theme10CoverDawnV1Props>({ meta: theme10CoverDawnV1Meta, component: Theme10CoverDawnV1, schema: theme10CoverDawnV1Schema });
registerLayout<Theme10ChapterV1Props>({ meta: theme10ChapterV1Meta, component: Theme10ChapterV1, schema: theme10ChapterV1Schema });
registerLayout<Theme10DividerV1Props>({ meta: theme10DividerV1Meta, component: Theme10DividerV1, schema: theme10DividerV1Schema });
registerLayout<Theme10StatementSectionV1Props>({ meta: theme10StatementSectionV1Meta, component: Theme10StatementSectionV1, schema: theme10StatementSectionV1Schema });
registerLayout<Theme10StatementV1Props>({ meta: theme10StatementV1Meta, component: Theme10StatementV1, schema: theme10StatementV1Schema });
registerLayout<Theme10PrinciplesV1Props>({ meta: theme10PrinciplesV1Meta, component: Theme10PrinciplesV1, schema: theme10PrinciplesV1Schema });
registerLayout<Theme10ClosingV1Props>({ meta: theme10ClosingV1Meta, component: Theme10ClosingV1, schema: theme10ClosingV1Schema });

// theme10 金色指数 · 金融编辑风（P1 影像图文 批次A · 5 版式）
registerLayout<Theme10ProfileV1Props>({ meta: theme10ProfileV1Meta, component: Theme10ProfileV1, schema: theme10ProfileV1Schema });
registerLayout<Theme10TeamV1Props>({ meta: theme10TeamV1Meta, component: Theme10TeamV1, schema: theme10TeamV1Schema });
registerLayout<Theme10QuoteV1Props>({ meta: theme10QuoteV1Meta, component: Theme10QuoteV1, schema: theme10QuoteV1Schema });
registerLayout<Theme10EditorialV1Props>({ meta: theme10EditorialV1Meta, component: Theme10EditorialV1, schema: theme10EditorialV1Schema });
registerLayout<Theme10MagazineV1Props>({ meta: theme10MagazineV1Meta, component: Theme10MagazineV1, schema: theme10MagazineV1Schema });
// theme10 金色指数 · 金融编辑风（P1 影像图文 批次B · 5 版式）
registerLayout<Theme10TriptychV1Props>({ meta: theme10TriptychV1Meta, component: Theme10TriptychV1, schema: theme10TriptychV1Schema });
registerLayout<Theme10StrataV1Props>({ meta: theme10StrataV1Meta, component: Theme10StrataV1, schema: theme10StrataV1Schema });
registerLayout<Theme10SparkV1Props>({ meta: theme10SparkV1Meta, component: Theme10SparkV1, schema: theme10SparkV1Schema });
registerLayout<Theme10TestimonialsV1Props>({ meta: theme10TestimonialsV1Meta, component: Theme10TestimonialsV1, schema: theme10TestimonialsV1Schema });
registerLayout<Theme10FeatureV1Props>({ meta: theme10FeatureV1Meta, component: Theme10FeatureV1, schema: theme10FeatureV1Schema });
// theme10 金色指数 · 金融编辑风（P1 影像图文 批次C · 5 版式）
registerLayout<Theme10CompareImgV1Props>({ meta: theme10CompareImgV1Meta, component: Theme10CompareImgV1, schema: theme10CompareImgV1Schema });
registerLayout<Theme10PinboardV1Props>({ meta: theme10PinboardV1Meta, component: Theme10PinboardV1, schema: theme10PinboardV1Schema });
registerLayout<Theme10FilmstripV1Props>({ meta: theme10FilmstripV1Meta, component: Theme10FilmstripV1, schema: theme10FilmstripV1Schema });
registerLayout<Theme10InsetV1Props>({ meta: theme10InsetV1Meta, component: Theme10InsetV1, schema: theme10InsetV1Schema });
registerLayout<Theme10Gallery2V1Props>({ meta: theme10Gallery2V1Meta, component: Theme10Gallery2V1, schema: theme10Gallery2V1Schema });
// theme10 金色指数 · 金融编辑风（P1 影像图文 批次D · 5 版式）
registerLayout<Theme10MosaicV1Props>({ meta: theme10MosaicV1Meta, component: Theme10MosaicV1, schema: theme10MosaicV1Schema });
registerLayout<Theme10CollageV1Props>({ meta: theme10CollageV1Meta, component: Theme10CollageV1, schema: theme10CollageV1Schema });
registerLayout<Theme10CaptionedV1Props>({ meta: theme10CaptionedV1Meta, component: Theme10CaptionedV1, schema: theme10CaptionedV1Schema });
registerLayout<Theme10ShowcaseV1Props>({ meta: theme10ShowcaseV1Meta, component: Theme10ShowcaseV1, schema: theme10ShowcaseV1Schema });
registerLayout<Theme10PosterV1Props>({ meta: theme10PosterV1Meta, component: Theme10PosterV1, schema: theme10PosterV1Schema });
// theme10 金色指数 · 金融编辑风（P1 影像图文 批次E · 5 版式）
registerLayout<Theme10AnnotatedV1Props>({ meta: theme10AnnotatedV1Meta, component: Theme10AnnotatedV1, schema: theme10AnnotatedV1Schema });
registerLayout<Theme10QuoteImgV1Props>({ meta: theme10QuoteImgV1Meta, component: Theme10QuoteImgV1, schema: theme10QuoteImgV1Schema });
registerLayout<Theme10QuiltV1Props>({ meta: theme10QuiltV1Meta, component: Theme10QuiltV1, schema: theme10QuiltV1Schema });
registerLayout<Theme10ExhibitV1Props>({ meta: theme10ExhibitV1Meta, component: Theme10ExhibitV1, schema: theme10ExhibitV1Schema });
registerLayout<Theme10MedallionsV1Props>({ meta: theme10MedallionsV1Meta, component: Theme10MedallionsV1, schema: theme10MedallionsV1Schema });
// theme10 金色指数 · P2 数据图表 · 批次F（基础图表 5 版式）
registerLayout<Theme10BarV1Props>({ meta: theme10BarV1Meta, component: Theme10BarV1, schema: theme10BarV1Schema });
registerLayout<Theme10HBarV1Props>({ meta: theme10HBarV1Meta, component: Theme10HBarV1, schema: theme10HBarV1Schema });
registerLayout<Theme10LineV1Props>({ meta: theme10LineV1Meta, component: Theme10LineV1, schema: theme10LineV1Schema });
registerLayout<Theme10AreaV1Props>({ meta: theme10AreaV1Meta, component: Theme10AreaV1, schema: theme10AreaV1Schema });
registerLayout<Theme10KpisV1Props>({ meta: theme10KpisV1Meta, component: Theme10KpisV1, schema: theme10KpisV1Schema });
// theme10 金色指数 · P2 数据图表 · 批次G（对比与构成 5 版式）
registerLayout<Theme10GroupedV1Props>({ meta: theme10GroupedV1Meta, component: Theme10GroupedV1, schema: theme10GroupedV1Schema });
registerLayout<Theme10StackV1Props>({ meta: theme10StackV1Meta, component: Theme10StackV1, schema: theme10StackV1Schema });
registerLayout<Theme10DonutV1Props>({ meta: theme10DonutV1Meta, component: Theme10DonutV1, schema: theme10DonutV1Schema });
registerLayout<Theme10PieV1Props>({ meta: theme10PieV1Meta, component: Theme10PieV1, schema: theme10PieV1Schema });
registerLayout<Theme10WaterfallV1Props>({ meta: theme10WaterfallV1Meta, component: Theme10WaterfallV1, schema: theme10WaterfallV1Schema });
// theme10 金色指数 · P2 数据图表 · 批次H（分布与关系 5 版式）
registerLayout<Theme10ScatterV1Props>({ meta: theme10ScatterV1Meta, component: Theme10ScatterV1, schema: theme10ScatterV1Schema });
registerLayout<Theme10BubbleV1Props>({ meta: theme10BubbleV1Meta, component: Theme10BubbleV1, schema: theme10BubbleV1Schema });
registerLayout<Theme10RadarV1Props>({ meta: theme10RadarV1Meta, component: Theme10RadarV1, schema: theme10RadarV1Schema });
registerLayout<Theme10RadialV1Props>({ meta: theme10RadialV1Meta, component: Theme10RadialV1, schema: theme10RadialV1Schema });
registerLayout<Theme10HeatV1Props>({ meta: theme10HeatV1Meta, component: Theme10HeatV1, schema: theme10HeatV1Schema });
// theme10 金色指数 · P2 数据图表 · 批次I（趋势与时间 5 版式）
registerLayout<Theme10TrendV1Props>({ meta: theme10TrendV1Meta, component: Theme10TrendV1, schema: theme10TrendV1Schema });
registerLayout<Theme10RangeV1Props>({ meta: theme10RangeV1Meta, component: Theme10RangeV1, schema: theme10RangeV1Schema });
registerLayout<Theme10CandlestickV1Props>({ meta: theme10CandlestickV1Meta, component: Theme10CandlestickV1, schema: theme10CandlestickV1Schema });
registerLayout<Theme10RidgelineV1Props>({ meta: theme10RidgelineV1Meta, component: Theme10RidgelineV1, schema: theme10RidgelineV1Schema });
registerLayout<Theme10CalendarV1Props>({ meta: theme10CalendarV1Meta, component: Theme10CalendarV1, schema: theme10CalendarV1Schema });
// theme10 金色指数 · P2 数据图表 · 批次J（分布与构成进阶 5 版式）
registerLayout<Theme10FunnelV1Props>({ meta: theme10FunnelV1Meta, component: Theme10FunnelV1, schema: theme10FunnelV1Schema });
registerLayout<Theme10GaugeV1Props>({ meta: theme10GaugeV1Meta, component: Theme10GaugeV1, schema: theme10GaugeV1Schema });
registerLayout<Theme10BulletV1Props>({ meta: theme10BulletV1Meta, component: Theme10BulletV1, schema: theme10BulletV1Schema });
registerLayout<Theme10BoxV1Props>({ meta: theme10BoxV1Meta, component: Theme10BoxV1, schema: theme10BoxV1Schema });
registerLayout<Theme10TreemapV1Props>({ meta: theme10TreemapV1Meta, component: Theme10TreemapV1, schema: theme10TreemapV1Schema });
// theme10 金色指数 · P2 数据图表 · 批次K（关系与构成进阶 5 版式）
registerLayout<Theme10SankeyV1Props>({ meta: theme10SankeyV1Meta, component: Theme10SankeyV1, schema: theme10SankeyV1Schema });
registerLayout<Theme10DumbbellV1Props>({ meta: theme10DumbbellV1Meta, component: Theme10DumbbellV1, schema: theme10DumbbellV1Schema });
registerLayout<Theme10HistogramV1Props>({ meta: theme10HistogramV1Meta, component: Theme10HistogramV1, schema: theme10HistogramV1Schema });
registerLayout<Theme10SlopeV1Props>({ meta: theme10SlopeV1Meta, component: Theme10SlopeV1, schema: theme10SlopeV1Schema });
registerLayout<Theme10WaffleV1Props>({ meta: theme10WaffleV1Meta, component: Theme10WaffleV1, schema: theme10WaffleV1Schema });
// theme10 金色指数 · P2 数据图表 · 批次L（时序与分布 5 版式）
registerLayout<Theme10GanttV1Props>({ meta: theme10GanttV1Meta, component: Theme10GanttV1, schema: theme10GanttV1Schema });
registerLayout<Theme10BumpV1Props>({ meta: theme10BumpV1Meta, component: Theme10BumpV1, schema: theme10BumpV1Schema });
registerLayout<Theme10RoseV1Props>({ meta: theme10RoseV1Meta, component: Theme10RoseV1, schema: theme10RoseV1Schema });
registerLayout<Theme10DotplotV1Props>({ meta: theme10DotplotV1Meta, component: Theme10DotplotV1, schema: theme10DotplotV1Schema });
registerLayout<Theme10TimelineV1Props>({ meta: theme10TimelineV1Meta, component: Theme10TimelineV1, schema: theme10TimelineV1Schema });
// theme10 金色指数 · P2 数据图表 · 批次M（结构与关系 5 版式）
registerLayout<Theme10OrgchartV1Props>({ meta: theme10OrgchartV1Meta, component: Theme10OrgchartV1, schema: theme10OrgchartV1Schema });
registerLayout<Theme10ParallelV1Props>({ meta: theme10ParallelV1Meta, component: Theme10ParallelV1, schema: theme10ParallelV1Schema });
registerLayout<Theme10CirclepackV1Props>({ meta: theme10CirclepackV1Meta, component: Theme10CirclepackV1, schema: theme10CirclepackV1Schema });
registerLayout<Theme10CscatterV1Props>({ meta: theme10CscatterV1Meta, component: Theme10CscatterV1, schema: theme10CscatterV1Schema });
registerLayout<Theme10MarimekkoV1Props>({ meta: theme10MarimekkoV1Meta, component: Theme10MarimekkoV1, schema: theme10MarimekkoV1Schema });
// theme10 P3 结构 / 流程 / 长尾（11 版式）
registerLayout<Theme10StepsV1Props>({ meta: theme10StepsV1Meta, component: Theme10StepsV1, schema: theme10StepsV1Schema });
registerLayout<Theme10CycleV1Props>({ meta: theme10CycleV1Meta, component: Theme10CycleV1, schema: theme10CycleV1Schema });
registerLayout<Theme10SwimlaneV1Props>({ meta: theme10SwimlaneV1Meta, component: Theme10SwimlaneV1, schema: theme10SwimlaneV1Schema });
registerLayout<Theme10ChecklistV1Props>({ meta: theme10ChecklistV1Meta, component: Theme10ChecklistV1, schema: theme10ChecklistV1Schema });
registerLayout<Theme10PlansV1Props>({ meta: theme10PlansV1Meta, component: Theme10PlansV1, schema: theme10PlansV1Schema });
registerLayout<Theme10JourneyV1Props>({ meta: theme10JourneyV1Meta, component: Theme10JourneyV1, schema: theme10JourneyV1Schema });
registerLayout<Theme10GoalsV1Props>({ meta: theme10GoalsV1Meta, component: Theme10GoalsV1, schema: theme10GoalsV1Schema });
registerLayout<Theme10GlossaryV1Props>({ meta: theme10GlossaryV1Meta, component: Theme10GlossaryV1, schema: theme10GlossaryV1Schema });
registerLayout<Theme10FaqV1Props>({ meta: theme10FaqV1Meta, component: Theme10FaqV1, schema: theme10FaqV1Schema });
registerLayout<Theme10IsotypeV1Props>({ meta: theme10IsotypeV1Meta, component: Theme10IsotypeV1, schema: theme10IsotypeV1Schema });
registerLayout<Theme10VennV1Props>({ meta: theme10VennV1Meta, component: Theme10VennV1, schema: theme10VennV1Schema });
registerLayout<Theme10MetricHeroV1Props>({ meta: theme10MetricHeroV1Meta, component: Theme10MetricHeroV1, schema: theme10MetricHeroV1Schema });
registerLayout<Theme10ScorecardV1Props>({ meta: theme10ScorecardV1Meta, component: Theme10ScorecardV1, schema: theme10ScorecardV1Schema });
registerLayout<Theme10ComparisonStatV1Props>({ meta: theme10ComparisonStatV1Meta, component: Theme10ComparisonStatV1, schema: theme10ComparisonStatV1Schema });
registerLayout<Theme10SmallMultiplesV1Props>({ meta: theme10SmallMultiplesV1Meta, component: Theme10SmallMultiplesV1, schema: theme10SmallMultiplesV1Schema });
registerLayout<Theme10StatStripV1Props>({ meta: theme10StatStripV1Meta, component: Theme10StatStripV1, schema: theme10StatStripV1Schema });
registerLayout<Theme10QuoteStatV1Props>({ meta: theme10QuoteStatV1Meta, component: Theme10QuoteStatV1, schema: theme10QuoteStatV1Schema });
registerLayout<Theme10IndexBoardV1Props>({ meta: theme10IndexBoardV1Meta, component: Theme10IndexBoardV1, schema: theme10IndexBoardV1Schema });
