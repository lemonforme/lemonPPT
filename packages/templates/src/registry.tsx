// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, Slide } from '@lemonppt/core';
import { TimelineV2, timelineV2Meta, type TimelineV2Props } from './base/timeline-v2.js';
import type { ComponentType, ReactElement } from 'react';
import { ClosingV1, closingV1Meta, type ClosingV1Props } from './base/closing-v1.js';
import { ClosingV2, closingV2Meta, type ClosingV2Props } from './base/closing-v2.js';
import { ChartV1, chartV1Meta, type ChartV1Props } from './base/chart-v1.js';
import { ChartV2, chartV2Meta, type ChartV2Props } from './base/chart-v2.js';
import { ComparisonV1, comparisonV1Meta, type ComparisonV1Props } from './base/comparison-v1.js';
import { ComparisonV2, comparisonV2Meta, type ComparisonV2Props } from './base/comparison-v2.js';
import { ContentV1, contentV1Meta, type ContentV1Props } from './base/content-v1.js';
import { ContentV2, contentV2Meta, type ContentV2Props } from './base/content-v2.js';
import { ContentV3, contentV3Meta, type ContentV3Props } from './base/content-v3.js';
import { CoverV1, coverV1Meta, type CoverV1Props } from './base/cover-v1.js';
import { FaqV1, faqV1Meta, type FaqV1Props } from './base/faq-v1.js';
import { FeatureV1, featureV1Meta, type FeatureV1Props } from './base/feature-v1.js';
import { GalleryV1, galleryV1Meta, type GalleryV1Props } from './base/gallery-v1.js';
import { GalleryV2, galleryV2Meta, type GalleryV2Props } from './base/gallery-v2.js';
import { ImageV1, imageV1Meta, type ImageV1Props } from './base/image-v1.js';
import { MetricV1, metricV1Meta, type MetricV1Props } from './base/metric-v1.js';
import { PartnersV1, partnersV1Meta, type PartnersV1Props } from './base/partners-v1.js';
import { PricingV1, pricingV1Meta, type PricingV1Props } from './base/pricing-v1.js';
import { RoadmapV1, roadmapV1Meta, type RoadmapV1Props } from './base/roadmap-v1.js';
import { SplitV1, splitV1Meta, type SplitV1Props } from './base/split-v1.js';
import { StatsV1, statsV1Meta, type StatsV1Props } from './base/stats-v1.js';
import { TeamV1, teamV1Meta, type TeamV1Props } from './base/team-v1.js';
import { TestimonialV1, testimonialV1Meta, type TestimonialV1Props } from './base/testimonial-v1.js';
import { TestimonialV2, testimonialV2Meta, type TestimonialV2Props } from './base/testimonial-v2.js';
import { TimelineV1, timelineV1Meta, type TimelineV1Props } from './base/timeline-v1.js';
import { MetricV2, metricV2Meta, type MetricV2Props } from './base/metric-v2.js';
import { PestV1, pestV1Meta, type PestV1Props } from './base/pest-v1.js';
import { ProcessV1, processV1Meta, type ProcessV1Props } from './base/process-v1.js';
import { ProcessV2, processV2Meta, type ProcessV2Props } from './base/process-v2.js';
import { QuoteV1, quoteV1Meta, type QuoteV1Props } from './base/quote-v1.js';
import { QuoteV2, quoteV2Meta, type QuoteV2Props } from './base/quote-v2.js';
import { SwotV1, swotV1Meta, type SwotV1Props } from './base/swot-v1.js';
import { TableOfContentsV1, tableOfContentsV1Meta, type TableOfContentsV1Props } from './base/table-of-contents-v1.js';

export interface RegisteredLayout<P extends Record<string, unknown>> {
  meta: LayoutMeta;
  component: ComponentType<P>;
}

const registry = new Map<string, RegisteredLayout<Record<string, unknown>>>();

export function registerLayout<P extends Record<string, unknown>>(
  layout: RegisteredLayout<P>
): void {
  registry.set(layout.meta.id, layout as RegisteredLayout<Record<string, unknown>>);
}

export function getLayout(id: string): RegisteredLayout<Record<string, unknown>> | undefined {
  return registry.get(id);
}

export function listLayouts(): LayoutMeta[] {
  return Array.from(registry.values()).map((l) => l.meta);
}

export function listLayoutsByTheme(theme: string): LayoutMeta[] {
  return listLayouts().filter((l) => l.theme === theme);
}

export function listLayoutsByRole(role: LayoutMeta['role']): LayoutMeta[] {
  return listLayouts().filter((l) => l.role === role);
}

export interface RenderSlideOptions {
  slideIdx?: number;
  editable?: boolean;
}

export function renderSlide(slide: Slide, options: RenderSlideOptions = {}): ReactElement | null {
  const registered = getLayout(slide.layout);
  if (!registered) {
    return null;
  }
  const Component = registered.component;
  return <Component {...slide.props} _slideIdx={options.slideIdx} _editable={options.editable} />;
}

// 注册内置版式
registerLayout<TimelineV2Props>({ meta: timelineV2Meta, component: TimelineV2 });
registerLayout<CoverV1Props>({ meta: coverV1Meta, component: CoverV1 });
registerLayout<MetricV1Props>({ meta: metricV1Meta, component: MetricV1 });
registerLayout<MetricV2Props>({ meta: metricV2Meta, component: MetricV2 });
registerLayout<TableOfContentsV1Props>({ meta: tableOfContentsV1Meta, component: TableOfContentsV1 });
registerLayout<ChartV1Props>({ meta: chartV1Meta, component: ChartV1 });
registerLayout<ChartV2Props>({ meta: chartV2Meta, component: ChartV2 });
registerLayout<ComparisonV1Props>({ meta: comparisonV1Meta, component: ComparisonV1 });
registerLayout<ComparisonV2Props>({ meta: comparisonV2Meta, component: ComparisonV2 });
registerLayout<ProcessV1Props>({ meta: processV1Meta, component: ProcessV1 });
registerLayout<ProcessV2Props>({ meta: processV2Meta, component: ProcessV2 });
registerLayout<QuoteV1Props>({ meta: quoteV1Meta, component: QuoteV1 });
registerLayout<QuoteV2Props>({ meta: quoteV2Meta, component: QuoteV2 });
registerLayout<ContentV1Props>({ meta: contentV1Meta, component: ContentV1 });
registerLayout<ContentV2Props>({ meta: contentV2Meta, component: ContentV2 });
registerLayout<ContentV3Props>({ meta: contentV3Meta, component: ContentV3 });
registerLayout<ImageV1Props>({ meta: imageV1Meta, component: ImageV1 });
registerLayout<TeamV1Props>({ meta: teamV1Meta, component: TeamV1 });
registerLayout<FeatureV1Props>({ meta: featureV1Meta, component: FeatureV1 });
registerLayout<TimelineV1Props>({ meta: timelineV1Meta, component: TimelineV1 });
registerLayout<PricingV1Props>({ meta: pricingV1Meta, component: PricingV1 });
registerLayout<SplitV1Props>({ meta: splitV1Meta, component: SplitV1 });
registerLayout<StatsV1Props>({ meta: statsV1Meta, component: StatsV1 });
registerLayout<GalleryV1Props>({ meta: galleryV1Meta, component: GalleryV1 });
registerLayout<GalleryV2Props>({ meta: galleryV2Meta, component: GalleryV2 });
registerLayout<FaqV1Props>({ meta: faqV1Meta, component: FaqV1 });
registerLayout<PartnersV1Props>({ meta: partnersV1Meta, component: PartnersV1 });
registerLayout<TestimonialV1Props>({ meta: testimonialV1Meta, component: TestimonialV1 });
registerLayout<TestimonialV2Props>({ meta: testimonialV2Meta, component: TestimonialV2 });
registerLayout<RoadmapV1Props>({ meta: roadmapV1Meta, component: RoadmapV1 });
registerLayout<ClosingV1Props>({ meta: closingV1Meta, component: ClosingV1 });
registerLayout<ClosingV2Props>({ meta: closingV2Meta, component: ClosingV2 });
registerLayout<SwotV1Props>({ meta: swotV1Meta, component: SwotV1 });
registerLayout<PestV1Props>({ meta: pestV1Meta, component: PestV1 });
