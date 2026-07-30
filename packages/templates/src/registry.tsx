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

