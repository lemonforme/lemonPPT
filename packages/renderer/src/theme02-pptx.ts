// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme02 深色霓虹科技风 — PPTX 版式专属渲染器（从 export-pptx.ts 抽出）。
// 共享基础设施（全局 helper + 通用渲染器 + 类型 + theme02 局部 helper/const）从 export-pptx.ts 导入；
// theme01 通用渲染器从 theme01-pptx.ts 复用。注册通过 registerTheme02Renderers 回调注入。

import { type Slide as PptxSlide } from 'pptxgenjs';
import { addKicker, addTitle, COLORS, FONTS, addTheme02Card, renderInsightPanel, renderTableOfContentsV1, renderImageV1, renderTestimonialV1, renderProcessV1, T2_CHART, addImageMaybe, renderTheme01MetricBig, renderChartFunnel, renderTheme01ChartDonut, renderChartHeatmap, renderChartRadar, renderChartGauge, renderStatsV1, renderTeamV1, renderTimelineV1, renderFeatureV1, renderTheme01GalleryV1, renderPricingV1, renderTheme01RoadmapV1, renderSwotV1, renderFaqV1, renderTheme01FilmstripV1, renderPartnersV1, renderPestV1, renderTheme01TableV1, renderTheme01TagsV1 } from './export-pptx.js';
import type { Theme02ChapterV1Props, Theme02ChapterV2Props, Theme02QuoteV2Props, Theme02NumberShowcaseV1Props, Theme02ChartV1Props, ChartV1Props, Theme02ContentV1Props, Theme02DeltaV1Props, Theme02TableOfContentsV1Props, Theme02ImageV1Props, Theme02QuoteV1Props, Theme02BentoV1Props, Theme02ProcessV1Props, Theme02ProgressV1Props, Theme02FeatureV2Props, Theme02ChecklistV1Props, Theme02StepsV1Props, Theme02CardGridV1Props, Theme02HighlightV1Props, Theme02ComparisonV2Props, Theme02MatrixV1Props, Theme02StatGridV1Props, Theme02CoverV3Props, Theme02ClosingV2Props, Theme02ChartBarV1Props, Theme02ChartLineV1Props, Theme02ChartAreaV1Props, Theme02ChartStackV1Props, Theme02KpiStripV1Props, Theme02BigStatV1Props, Theme02CycleV1Props, Theme02SwimlaneV1Props, Theme02PyramidV1Props, Theme02OrgChartV1Props, Theme02FlowV1Props, Theme02TableV2Props, Theme02ImageSplitV1Props, Theme02ImageGridV2Props, Theme02SpotlightV1Props, Theme02ChapterV3Props, Theme02SectionDividerV1Props, Theme02LogoWallV1Props } from './export-pptx.js';
import { renderChartV1, renderContentV1, renderCoverV1, renderClosing, renderComparisonV1 } from './export-pptx.js';

function renderTheme02ChapterV1(slide: PptxSlide, props: Theme02ChapterV1Props): void {
  if (props.kicker) addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  if (props.number) {
    slide.addText(props.number, {
      x: 0.8, y: 2.4, w: 8.4, h: 1.0,
      fontSize: 72, color: COLORS.accent, bold: true, align: 'left',
      fontFace: FONTS.mono,
    });
  }
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: props.number ? 3.6 : 2.4, w: 8.4, h: 0.8,
      fontSize: 22, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
}

function renderTheme02ChapterV2(slide: PptxSlide, props: Theme02ChapterV2Props): void {
  addTheme02Card(slide, 0.8, 1.0, 8.4, 3.8, 0.2);
  if (props.kicker) addKicker(slide, props.kicker, 0.8, 1.2);
  if (props.number) {
    slide.addText(props.number, {
      x: 0.8, y: 1.8, w: 8.4, h: 1.4,
      fontSize: 96, color: COLORS.accent, bold: true, align: 'center',
      fontFace: FONTS.mono,
    });
  }
  if (props.title) {
    slide.addText(props.title, {
      x: 0.8, y: props.number ? 3.3 : 1.8, w: 8.4, h: 0.9,
      fontSize: 48, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
  }
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.2, y: props.title ? 4.3 : 3.0, w: 7.6, h: 0.6,
      fontSize: 20, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }
}

function renderTheme02QuoteV2(slide: PptxSlide, props: Theme02QuoteV2Props): void {
  addTheme02Card(slide, 0.9, 1.4, 8.2, 3.2, 0.15);
  slide.addText(`“${props.quote}”`, {
    x: 1.1, y: 1.7, w: 7.8, h: 2.0,
    fontSize: 32, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  const attribution = [props.author, props.role, props.source].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1.1, y: 3.85, w: 7.8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme02NumberShowcaseV1(slide: PptxSlide, props: Theme02NumberShowcaseV1Props): void {
  addTheme02Card(slide, 1.2, 1.1, 7.6, 3.8, 0.2);
  if (props.kicker) addKicker(slide, props.kicker, 0.8, 1.0);
  if (props.title) {
    slide.addText(props.title, {
      x: 0.8, y: 1.5, w: 8.4, h: 0.7,
      fontSize: 36, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
  }
  const valueY = props.title ? 2.35 : 1.7;
  slide.addText(props.value ?? '', {
    x: 0.8, y: valueY, w: 8.4, h: 1.5,
    fontSize: 80, color: COLORS.accent, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.mono,
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: 0.8, y: valueY + 1.35, w: 8.4, h: 0.35,
      fontSize: 22, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 1.2, y: props.unit ? valueY + 1.85 : valueY + 1.55, w: 7.6, h: 0.7,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.8, y: 5.35, w: 8.4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme02ChartV1(slide: PptxSlide, props: Theme02ChartV1Props): void {
  const adapted: ChartV1Props = {
    ...props,
    type: props.type === 'area' ? 'line' : props.type,
  };
  renderChartV1(slide, adapted);
}

function renderTheme02ContentV1(slide: PptxSlide, props: Theme02ContentV1Props): void {
  renderContentV1(slide, {
    kicker: props.kicker,
    title: props.title ?? '',
    points: props.bullets || [],
  });
}

function renderTheme02DeltaV1(slide: PptxSlide, props: Theme02DeltaV1Props): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const startX = 0.8;

  if (props.kicker) addKicker(slide, props.kicker, startX);
  if (props.title) addTitle(slide, props.title, startX, 1.3, mainW);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: startX, y: 2.05, w: mainW, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const items = (props.items || []).slice(0, 6);
  if (items.length === 0) {
    slide.addText('（暂无对照数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  const cols = Math.min(items.length, 3);
  const rows = Math.ceil(items.length / cols);
  const cardW = (mainW - 0.25 * (cols - 1)) / cols;
  const cardH = rows === 1 ? 2.6 : 1.25;
  const startY = 2.5;
  items.forEach((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = startX + col * (cardW + 0.25);
    const y = startY + row * (cardH + 0.25);
    const previous = Number(item.previous) || 0;
    const current = Number(item.current) || 0;
    const delta = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    const positive = delta >= 0;
    addTheme02Card(slide, x, y, cardW, cardH, 0.1);
    slide.addText(item.label || '', {
      x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(`${current}${item.unit ? ` ${item.unit}` : ''}`, {
      x: x + 0.12, y: y + 0.5, w: cardW - 0.24, h: 0.45,
      fontSize: 24, color: positive ? COLORS.accent : 'FF6B6B', bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`${positive ? '+' : ''}${delta.toFixed(1)}%`, {
      x: x + 0.12, y: y + 1.0, w: cardW - 0.24, h: 0.3,
      fontSize: 12, color: positive ? COLORS.accent : 'FF6B6B', align: 'left', valign: 'top',
      fontFace: FONTS.mono,
    });
  });
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: startX, y: 5.75, w: mainW, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

function renderTheme02TableOfContentsV1(slide: PptxSlide, props: Theme02TableOfContentsV1Props): void {
  renderTableOfContentsV1(slide, {
    title: props.title ?? '目录',
    kicker: props.subtitle,
    items: (props.items || []).map((item) => item.title),
  });
}

function renderTheme02ImageV1(slide: PptxSlide, props: Theme02ImageV1Props): void {
  renderImageV1(slide, {
    title: props.title ?? '',
    subtitle: props.subtitle,
    imageUrl: props.image,
  });
  if (props.caption) {
    slide.addText(props.caption, {
      x: 0.8, y: 5.25, w: 8.4, h: 0.3,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}

function renderTheme02QuoteV1(slide: PptxSlide, props: Theme02QuoteV1Props): void {
  renderTestimonialV1(slide, {
    quote: props.quote,
    author: props.author,
    role: props.role,
    avatarUrl: props.avatar,
  });
}

function renderTheme02BentoV1(slide: PptxSlide, props: Theme02BentoV1Props): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const startX = 0.8;

  if (props.kicker) addKicker(slide, props.kicker, startX);
  if (props.title) addTitle(slide, props.title, startX, 1.3, mainW);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: startX, y: 2.05, w: mainW, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const items = (props.items || []).slice(0, 6);
  if (items.length === 0) {
    slide.addText('（暂无数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  const cardW = (mainW - 0.4) / 2;
  const positions = [
    { x: startX, y: 2.5, w: cardW, h: 1.3 },
    { x: startX + cardW + 0.2, y: 2.5, w: cardW, h: 1.3 },
    { x: startX, y: 4.0, w: cardW, h: 1.3 },
    { x: startX + cardW + 0.2, y: 4.0, w: cardW, h: 1.3 },
    { x: startX, y: 5.5, w: cardW, h: 1.3 },
    { x: startX + cardW + 0.2, y: 5.5, w: cardW, h: 1.3 },
  ];
  items.forEach((item, index) => {
    const pos = positions[index];
    if (!pos) return;
    addTheme02Card(slide, pos.x, pos.y, pos.w, pos.h, 0.1);
    const valueText = `${item.value}${item.unit ? ` ${item.unit}` : ''}`;
    slide.addText(valueText, {
      x: pos.x + 0.12, y: pos.y + 0.12, w: pos.w - 0.24, h: 0.45,
      fontSize: 24, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(item.label, {
      x: pos.x + 0.12, y: pos.y + 0.62, w: pos.w - 0.24, h: 0.35,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

function renderTheme02ProcessV1(slide: PptxSlide, props: Theme02ProcessV1Props): void {
  const steps = (props.steps || []).map((s) => s.title || '').filter(Boolean);
  renderProcessV1(slide, {
    kicker: props.kicker,
    title: props.title,
    steps,
  });
}

function renderTheme02ProgressV1(slide: PptxSlide, props: Theme02ProgressV1Props): void {
  if (props.kicker) addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.05, w: 8.4, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
  const items = (props.items || []).slice(0, 6);
  if (items.length === 0) {
    slide.addText('（暂无进度数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }
  let y = 2.5;
  items.forEach((item) => {
    const value = Number(item.value) || 0;
    const max = Number(item.max) || 100;
    const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    slide.addText(item.label || '', {
      x: 0.8, y, w: 5.0, h: 0.3,
      fontSize: 14, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    slide.addText(`${value}${item.unit ? ` ${item.unit}` : ''} (${pct.toFixed(1)}%)`, {
      x: 5.8, y, w: 3.4, h: 0.3,
      fontSize: 14, color: COLORS.accent, bold: true, align: 'right', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addShape('rect', {
      x: 0.8, y: y + 0.35, w: 8.4, h: 0.12,
      fill: { color: COLORS.light },
    });
    slide.addShape('rect', {
      x: 0.8, y: y + 0.35, w: 8.4 * (pct / 100), h: 0.12,
      fill: { color: COLORS.accent },
    });
    y += 0.65;
  });
}

function renderTheme02FeatureV2(slide: PptxSlide, props: Theme02FeatureV2Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.4, fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  const features = (props.features || []).slice(0, 6);
  if (features.length === 0) return;
  const cols = 3;
  const rows = Math.ceil(features.length / cols);
  const cardW = (w - 0.4 * (cols - 1)) / cols;
  const cardH = rows >= 2 ? 1.25 : 2.2;
  const startY = 2.55;
  features.forEach((f, i) => {
    const c = i % cols; const r = Math.floor(i / cols);
    const cx = x + c * (cardW + 0.4);
    const cy = startY + r * (cardH + 0.28);
    addTheme02Card(slide, cx, cy, cardW, cardH, 0.12);
    let ty = cy + 0.16;
    if (f.icon) { slide.addText(f.icon, { x: cx + 0.22, y: ty, w: cardW - 0.44, h: 0.38, fontSize: 22, align: 'left', valign: 'top', fontFace: FONTS.body }); ty += 0.44; }
    slide.addText(f.title || '', { x: cx + 0.22, y: ty, w: cardW - 0.44, h: 0.36, fontSize: 15, bold: true, color: COLORS.primary, align: 'left', valign: 'top', fontFace: FONTS.heading }); ty += 0.38;
    if (f.desc) slide.addText(f.desc, { x: cx + 0.22, y: ty, w: cardW - 0.44, h: cardH - (ty - cy) - 0.12, fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  });
}

function renderTheme02ChecklistV1(slide: PptxSlide, props: Theme02ChecklistV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.4, fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  const items = (props.items || []).slice(0, 8);
  if (items.length === 0) return;
  let y = 2.65;
  const rowH = Math.min(0.5, (5.05 - 2.65) / items.length);
  items.forEach((it) => {
    slide.addText('✓', { x, y, w: 0.42, h: rowH, fontSize: 18, bold: true, color: COLORS.accent, align: 'center', valign: 'middle', fontFace: FONTS.body });
    slide.addText(it.text || '', { x: x + 0.55, y, w: w - 0.55, h: rowH, fontSize: 16, bold: true, color: COLORS.primary, align: 'left', valign: 'middle', fontFace: FONTS.heading });
    if (it.note && items.length <= 5) slide.addText(it.note, { x: x + 0.55, y: y + rowH - 0.22, w: w - 0.55, h: 0.2, fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
    y += rowH + 0.05;
  });
}

function renderTheme02StepsV1(slide: PptxSlide, props: Theme02StepsV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.4, fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  const steps = (props.steps || []).slice(0, 6);
  if (steps.length === 0) return;
  const cols = 3;
  const rows = Math.ceil(steps.length / cols);
  const cardW = (w - 0.4 * (cols - 1)) / cols;
  const cardH = rows >= 2 ? 1.4 : 2.4;
  const startY = 2.6;
  steps.forEach((s, i) => {
    const c = i % cols; const r = Math.floor(i / cols);
    const cx = x + c * (cardW + 0.4);
    const cy = startY + r * (cardH + 0.28);
    addTheme02Card(slide, cx, cy, cardW, cardH, 0.12);
    slide.addText(String(i + 1), { x: cx + 0.2, y: cy + 0.16, w: 0.6, h: 0.5, fontSize: 22, bold: true, color: COLORS.accent, align: 'left', valign: 'top', fontFace: FONTS.heading });
    slide.addText(s.title || '', { x: cx + 0.2, y: cy + 0.72, w: cardW - 0.4, h: 0.4, fontSize: 15, bold: true, color: COLORS.primary, align: 'left', valign: 'top', fontFace: FONTS.heading });
    if (s.desc) slide.addText(s.desc, { x: cx + 0.2, y: cy + 1.12, w: cardW - 0.4, h: cardH - 1.2, fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  });
}

function renderTheme02CardGridV1(slide: PptxSlide, props: Theme02CardGridV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.4, fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  const cards = (props.cards || []).slice(0, 9);
  if (cards.length === 0) return;
  const cols = 3;
  const rows = Math.ceil(cards.length / cols);
  const cardW = (w - 0.36 * (cols - 1)) / cols;
  const cardH = (5.05 - 2.55) / rows - 0.28;
  const startY = 2.55;
  cards.forEach((cd, i) => {
    const c = i % cols; const r = Math.floor(i / cols);
    const cx = x + c * (cardW + 0.36);
    const cy = startY + r * (cardH + 0.28);
    addTheme02Card(slide, cx, cy, cardW, cardH, 0.12);
    let ty = cy + 0.16;
    if (cd.tag) { slide.addText(cd.tag, { x: cx + 0.2, y: ty, w: cardW - 0.4, h: 0.26, fontSize: 11, bold: true, color: COLORS.accent, align: 'left', valign: 'top', fontFace: FONTS.mono }); ty += 0.32; }
    slide.addText(cd.title || '', { x: cx + 0.2, y: ty, w: cardW - 0.4, h: 0.4, fontSize: 15, bold: true, color: COLORS.primary, align: 'left', valign: 'top', fontFace: FONTS.heading }); ty += 0.42;
    if (cd.desc) slide.addText(cd.desc, { x: cx + 0.2, y: ty, w: cardW - 0.4, h: cardH - (ty - cy) - 0.12, fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  });
}

function renderTheme02HighlightV1(slide: PptxSlide, props: Theme02HighlightV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) slide.addText(props.kicker, { x, y: 1.5, w, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, align: 'center', valign: 'top', fontFace: FONTS.mono });
  if (props.title) slide.addText(props.title, { x, y: 2.0, w, h: 0.4, fontSize: 18, bold: true, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.heading });
  if (props.statement) slide.addText(props.statement, { x: x + 0.4, y: 2.5, w: w - 0.8, h: 1.8, fontSize: 30, bold: true, color: COLORS.primary, align: 'center', valign: 'middle', fontFace: FONTS.heading });
  if (props.footnote) slide.addText(props.footnote, { x, y: 4.5, w, h: 0.4, fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body });
}

function renderTheme02ComparisonV2(slide: PptxSlide, props: Theme02ComparisonV2Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.2, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 1.95, w, h: 0.4, fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  const cols = (props.columns || []).slice(0, 2);
  if (cols.length === 0) return;
  const colW = (w - 0.4) / 2;
  const startY = 2.5;
  const colH = 2.4;
  cols.forEach((col, i) => {
    const cx = x + i * (colW + 0.4);
    addTheme02Card(slide, cx, startY, colW, colH, 0.12);
    slide.addText(col.title || '', { x: cx + 0.25, y: startY + 0.2, w: colW - 0.5, h: 0.4, fontSize: 18, bold: true, color: i === 1 ? COLORS.accent : COLORS.primary, align: 'left', valign: 'top', fontFace: FONTS.heading });
    const points = (col.points || []).slice(0, 6);
    let py = startY + 0.75;
    const ph = (colH - 0.95) / Math.max(points.length, 1);
    points.forEach((p) => {
      slide.addText('• ' + p, { x: cx + 0.25, y: py, w: colW - 0.5, h: ph, fontSize: 13, color: COLORS.primary, align: 'left', valign: 'top', fontFace: FONTS.body });
      py += ph;
    });
  });
}

function renderTheme02MatrixV1(slide: PptxSlide, props: Theme02MatrixV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.2, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 1.95, w, h: 0.35, fontSize: 15, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  const startY = 2.5;
  const gridH = 2.4; const gridW = w - 0.5;
  const qColors = ['00E5B0', 'FFD166', '00B4FF', 'FF6B6B'];
  const quads = props.quadrants || [];
  for (let qi = 0; qi < 4; qi++) {
    const c = qi % 2; const r = Math.floor(qi / 2);
    const qx = x + 0.5 + c * (gridW / 2 + 0.1);
    const qy = startY + r * (gridH / 2 + 0.12);
    addTheme02Card(slide, qx, qy, gridW / 2 - 0.05, gridH / 2 - 0.06, 0.1);
    const q = quads[qi];
    if (q) {
      slide.addText(q.title || '', { x: qx + 0.18, y: qy + 0.12, w: gridW / 2 - 0.36, h: 0.35, fontSize: 15, bold: true, color: qColors[qi] || COLORS.accent, align: 'left', valign: 'top', fontFace: FONTS.heading });
      if (q.desc) slide.addText(q.desc, { x: qx + 0.18, y: qy + 0.5, w: gridW / 2 - 0.36, h: gridH / 2 - 0.6, fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
    }
  }
  if (props.axisY) slide.addText(props.axisY, { x: x - 0.05, y: startY + gridH / 2 - 0.2, w: 0.5, h: 0.4, fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.mono });
  if (props.axisX) slide.addText(props.axisX, { x: x + 0.5, y: startY + gridH + 0.02, w: gridW, h: 0.3, fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.mono });
}

function renderTheme02StatGridV1(slide: PptxSlide, props: Theme02StatGridV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.4, fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.body });
  const stats = (props.stats || []).slice(0, 8);
  if (stats.length === 0) return;
  const cols = 4;
  const rows = Math.ceil(stats.length / cols);
  const cardW = (w - 0.36 * (cols - 1)) / cols;
  const cardH = (5.05 - 2.55) / rows - 0.26;
  const startY = 2.55;
  stats.forEach((s, i) => {
    const c = i % cols; const r = Math.floor(i / cols);
    const cx = x + c * (cardW + 0.36);
    const cy = startY + r * (cardH + 0.26);
    addTheme02Card(slide, cx, cy, cardW, cardH, 0.1);
    let ty = cy + 0.16;
    const valStr = (s.value || '') + (s.unit ? ' ' + s.unit : '');
    slide.addText(valStr, { x: cx + 0.2, y: ty, w: cardW - 0.4, h: 0.5, fontSize: 26, bold: true, color: COLORS.accent, align: 'left', valign: 'top', fontFace: FONTS.heading }); ty += 0.55;
    if (s.label) slide.addText(s.label, { x: cx + 0.2, y: ty, w: cardW - 0.4, h: 0.3, fontSize: 12, color: COLORS.primary, align: 'left', valign: 'top', fontFace: FONTS.body }); ty += 0.32;
    if (s.delta) slide.addText(s.delta, { x: cx + 0.2, y: ty, w: cardW - 0.4, h: 0.3, fontSize: 12, bold: true, color: COLORS.secondary, align: 'left', valign: 'top', fontFace: FONTS.mono });
  });
}

function renderTheme02CoverV3(slide: PptxSlide, props: Theme02CoverV3Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) slide.addText(props.kicker, { x, y: 1.7, w, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, align: 'center', valign: 'top', fontFace: FONTS.mono });
  if (props.title) slide.addText(props.title, { x, y: 2.2, w, h: 1.6, fontSize: 44, bold: true, color: COLORS.primary, align: 'center', valign: 'middle', fontFace: FONTS.heading });
  if (props.subtitle) slide.addText(props.subtitle, { x: x + 0.5, y: 3.9, w: w - 1, h: 0.8, fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body });
  if (props.date) slide.addText(props.date, { x, y: 4.8, w, h: 0.4, fontSize: 13, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.mono });
}

function renderTheme02ClosingV2(slide: PptxSlide, props: Theme02ClosingV2Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) slide.addText(props.kicker, { x, y: 1.9, w, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, align: 'center', valign: 'top', fontFace: FONTS.mono });
  if (props.title) slide.addText(props.title, { x, y: 2.4, w, h: 1.4, fontSize: 40, bold: true, color: COLORS.primary, align: 'center', valign: 'middle', fontFace: FONTS.heading });
  if (props.subtitle) slide.addText(props.subtitle, { x: x + 0.5, y: 3.9, w: w - 1, h: 0.8, fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body });
  if (props.cta) {
    const ctaW = 3.2;
    slide.addText(props.cta, { x: (10 - ctaW) / 2, y: 4.85, w: ctaW, h: 0.5, fontSize: 16, bold: true, color: COLORS.white, fill: { color: COLORS.accent }, align: 'center', valign: 'middle', fontFace: FONTS.heading });
  }
}

function renderTheme02ChartBarV1(slide: PptxSlide, props: Theme02ChartBarV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const labels = props.labels || [];
  const series = (props.series || []).slice(0, 3);
  if (labels.length === 0 || series.length === 0) return;
  slide.addChart('bar', series.map((s) => ({ name: s.name || '', labels, values: (s.values || []) as number[] })), {
    x, y: 2.5, w, h: 2.9, chartColors: T2_CHART,
    showValue: true, dataLabelColor: COLORS.primary, dataLabelFontSize: 9,
    catAxisLabelColor: COLORS.secondary, valAxisLabelColor: COLORS.secondary,
    catAxisLabelFontFace: FONTS.body, valAxisLabelFontFace: FONTS.body,
  } as any);
}

function renderTheme02ChartLineV1(slide: PptxSlide, props: Theme02ChartLineV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const labels = props.labels || [];
  const series = (props.series || []).slice(0, 4);
  if (labels.length === 0 || series.length === 0) return;
  slide.addChart('line', series.map((s) => ({ name: s.name || '', labels, values: (s.values || []) as number[] })), {
    x, y: 2.5, w, h: 2.9, chartColors: T2_CHART,
    lineDataSymbol: 'circle', lineDataSymbolSize: 6,
    catAxisLabelColor: COLORS.secondary, valAxisLabelColor: COLORS.secondary,
    catAxisLabelFontFace: FONTS.body, valAxisLabelFontFace: FONTS.body,
  } as any);
}

function renderTheme02ChartAreaV1(slide: PptxSlide, props: Theme02ChartAreaV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const labels = props.labels || [];
  const series = (props.series || []).slice(0, 3);
  if (labels.length === 0 || series.length === 0) return;
  slide.addChart('area' as any, series.map((s) => ({ name: s.name || '', labels, values: (s.values || []) as number[] })), {
    x, y: 2.5, w, h: 2.9, chartColors: T2_CHART,
    catAxisLabelColor: COLORS.secondary, valAxisLabelColor: COLORS.secondary,
    catAxisLabelFontFace: FONTS.body, valAxisLabelFontFace: FONTS.body,
  } as any);
}

function renderTheme02ChartStackV1(slide: PptxSlide, props: Theme02ChartStackV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const labels = props.labels || [];
  const series = (props.series || []).slice(0, 4);
  if (labels.length === 0 || series.length === 0) return;
  slide.addChart('bar' as any, series.map((s) => ({ name: s.name || '', labels, values: (s.values || []) as number[] })), {
    x, y: 2.5, w, h: 2.9, chartColors: T2_CHART, barDir: 'bar', barGrouping: 'percentStacked',
    showValue: true, dataLabelColor: COLORS.white, dataLabelFontSize: 9,
    catAxisLabelColor: COLORS.secondary, valAxisLabelColor: COLORS.secondary,
    catAxisLabelFontFace: FONTS.body, valAxisLabelFontFace: FONTS.body,
  } as any);
}

function renderTheme02KpiStripV1(slide: PptxSlide, props: Theme02KpiStripV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.4, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const items = (props.items || []).slice(0, 5);
  if (items.length === 0) return;
  const cols = items.length;
  const cardW = (w - 0.3 * (cols - 1)) / cols;
  const startY = 2.6; const cardH = 2.2;
  items.forEach((it, i) => {
    const cx = x + i * (cardW + 0.3);
    addTheme02Card(slide, cx, startY, cardW, cardH, 0.12);
    let ty = startY + 0.2;
    const valStr = (it.value || '') + (it.unit ? ' ' + it.unit : '');
    slide.addText(valStr, { x: cx + 0.2, y: ty, w: cardW - 0.4, h: 0.6, fontSize: 28, bold: true, color: COLORS.accent, align: 'left', fontFace: FONTS.heading }); ty += 0.62;
    if (it.label) slide.addText(it.label || '', { x: cx + 0.2, y: ty, w: cardW - 0.4, h: 0.3, fontSize: 12, color: COLORS.primary, align: 'left', fontFace: FONTS.body }); ty += 0.32;
    if (it.delta) slide.addText(it.delta || '', { x: cx + 0.2, y: ty, w: cardW - 0.4, h: 0.3, fontSize: 12, bold: true, color: COLORS.secondary, align: 'left', fontFace: FONTS.mono });
  });
}

function renderTheme02BigStatV1(slide: PptxSlide, props: Theme02BigStatV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) slide.addText(props.kicker, { x, y: 1.5, w, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, align: 'center', fontFace: FONTS.mono });
  if (props.title) slide.addText(props.title, { x, y: 2.0, w, h: 0.4, fontSize: 18, bold: true, color: COLORS.secondary, align: 'center', fontFace: FONTS.heading });
  const valStr = (props.value || '') + (props.unit ? ' ' + props.unit : '');
  if (valStr) slide.addText(valStr, { x: x + 0.5, y: 2.5, w: w - 1, h: 1.4, fontSize: 60, bold: true, color: COLORS.primary, align: 'center', valign: 'middle', fontFace: FONTS.heading });
  let ty = 4.0;
  if (props.label) slide.addText(props.label, { x, y: ty, w, h: 0.35, fontSize: 16, color: COLORS.primary, align: 'center', fontFace: FONTS.body }); ty += 0.4;
  if (props.delta) slide.addText(props.delta, { x, y: ty, w, h: 0.3, fontSize: 14, bold: true, color: COLORS.accent, align: 'center', fontFace: FONTS.mono }); ty += 0.35;
  if (props.footnote) slide.addText(props.footnote, { x, y: ty, w, h: 0.3, fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body });
}

function renderTheme02CycleV1(slide: PptxSlide, props: Theme02CycleV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const steps = (props.steps || []).slice(0, 6);
  if (steps.length === 0) return;
  const n = steps.length;
  const cardW = (w - 0.3 * (n - 1)) / n;
  const startY = 2.6; const cardH = 2.0;
  steps.forEach((s, i) => {
    const cx = x + i * (cardW + 0.3);
    addTheme02Card(slide, cx, startY, cardW, cardH, 0.12);
    slide.addText(String(i + 1), { x: cx + 0.2, y: startY + 0.16, w: 0.6, h: 0.5, fontSize: 22, bold: true, color: COLORS.accent, fontFace: FONTS.heading });
    slide.addText(s.title || '', { x: cx + 0.2, y: startY + 0.7, w: cardW - 0.4, h: 0.4, fontSize: 14, bold: true, color: COLORS.primary, fontFace: FONTS.heading });
    if (s.desc) slide.addText(s.desc || '', { x: cx + 0.2, y: startY + 1.1, w: cardW - 0.4, h: cardH - 1.2, fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body });
  });
  slide.addText('↻ 闭环循环', { x, y: startY + cardH + 0.2, w, h: 0.3, fontSize: 13, color: COLORS.accent, align: 'center', fontFace: FONTS.mono });
}

function renderTheme02SwimlaneV1(slide: PptxSlide, props: Theme02SwimlaneV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const phases = (props.phases || []).slice(0, 5);
  const lanes = (props.lanes || []).slice(0, 4);
  if (phases.length === 0 || lanes.length === 0) return;
  const startY = 2.55; const nameW = 1.4; const gridX = x + nameW; const gridW = w - nameW;
  const colW = gridW / phases.length;
  const laneH = Math.min(0.9, (5.0 - startY) / lanes.length);
  phases.forEach((p, i) => slide.addText(p, { x: gridX + i * colW, y: startY, w: colW, h: 0.35, fontSize: 12, bold: true, color: COLORS.accent, align: 'center', fontFace: FONTS.heading }));
  let ly = startY + 0.4;
  lanes.forEach((lane) => {
    slide.addText(lane.name || '', { x, y: ly, w: nameW, h: laneH, fontSize: 12, bold: true, color: COLORS.primary, align: 'left', valign: 'middle', fontFace: FONTS.heading });
    (lane.items || []).slice(0, phases.length).forEach((it, i) => {
      slide.addText(it || '', { x: gridX + i * colW + 0.1, y: ly, w: colW - 0.2, h: laneH, fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body });
    });
    ly += laneH;
  });
}

function renderTheme02PyramidV1(slide: PptxSlide, props: Theme02PyramidV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const levels = (props.levels || []).slice(0, 5);
  if (levels.length === 0) return;
  const startY = 2.6; const totalH = 2.4; const bandH = totalH / levels.length;
  const denom = Math.max(levels.length - 1, 1);
  levels.forEach((lv, i) => {
    const topW = w * (0.5 + 0.5 * (i / denom));
    const cx = x + (w - topW) / 2;
    const cy = startY + i * bandH;
    slide.addShape('rect', { x: cx, y: cy, w: topW, h: bandH * 0.92, fill: { color: T2_CHART[i % T2_CHART.length] }, line: { color: COLORS.border, width: 1 } });
    slide.addText(lv.title || '', { x: cx, y: cy, w: topW, h: bandH * 0.92, fontSize: 14, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: FONTS.heading });
  });
}

function renderTheme02OrgChartV1(slide: PptxSlide, props: Theme02OrgChartV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const root = props.root;
  const children = (props.children || []).slice(0, 5);
  if (!root) return;
  const cx = x + w / 2; const rootW = 3.0; const rootH = 1.0; const rootY = 2.5;
  addTheme02Card(slide, cx - rootW / 2, rootY, rootW, rootH, 0.12);
  slide.addText(root.title || '', { x: cx - rootW / 2, y: rootY + 0.12, w: rootW, h: 0.4, fontSize: 16, bold: true, color: COLORS.primary, align: 'center', fontFace: FONTS.heading });
  if (root.sub) slide.addText(root.sub, { x: cx - rootW / 2, y: rootY + 0.52, w: rootW, h: 0.35, fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.body });
  if (children.length) {
    const childY = rootY + rootH + 0.6; const childW = (w - 0.3 * (children.length - 1)) / children.length; const childH = 1.2;
    children.forEach((c, i) => {
      const ccx = x + i * (childW + 0.3);
      addTheme02Card(slide, ccx, childY, childW, childH, 0.12);
      slide.addText(c.title || '', { x: ccx, y: childY + 0.12, w: childW, h: 0.4, fontSize: 14, bold: true, color: COLORS.primary, align: 'center', fontFace: FONTS.heading });
      if (c.sub) slide.addText(c.sub, { x: ccx, y: childY + 0.52, w: childW, h: 0.5, fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body });
    });
  }
}

function renderTheme02FlowV1(slide: PptxSlide, props: Theme02FlowV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const steps = (props.steps || []).slice(0, 5);
  if (steps.length === 0) return;
  const arrowW = 0.4; const n = steps.length; const cardW = (w - arrowW * (n - 1)) / n;
  const startY = 2.7; const cardH = 1.9;
  steps.forEach((s, i) => {
    const cx = x + i * (cardW + arrowW);
    addTheme02Card(slide, cx, startY, cardW, cardH, 0.12);
    slide.addText(String(i + 1), { x: cx + 0.2, y: startY + 0.16, w: 0.6, h: 0.5, fontSize: 22, bold: true, color: COLORS.accent, fontFace: FONTS.heading });
    slide.addText(s.title || '', { x: cx + 0.2, y: startY + 0.7, w: cardW - 0.4, h: 0.4, fontSize: 14, bold: true, color: COLORS.primary, fontFace: FONTS.heading });
    if (s.desc) slide.addText(s.desc || '', { x: cx + 0.2, y: startY + 1.1, w: cardW - 0.4, h: cardH - 1.2, fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body });
    if (i < n - 1) slide.addText('→', { x: cx + cardW, y: startY, w: arrowW, h: cardH, fontSize: 24, bold: true, color: COLORS.accent, align: 'center', valign: 'middle', fontFace: FONTS.body });
  });
}

function renderTheme02TableV2(slide: PptxSlide, props: Theme02TableV2Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.35, fontSize: 16, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  const columns = (props.columns || []).slice(0, 5);
  const rows = (props.rows || []).slice(0, 8);
  if (columns.length === 0) return;
  const startY = 2.55; const colW = w / columns.length; const headerH = 0.4;
  const rowH = Math.min(0.42, (5.0 - startY - headerH) / Math.max(rows.length, 1));
  columns.forEach((c, i) => slide.addText(c, { x: x + i * colW, y: startY, w: colW, h: headerH, fontSize: 13, bold: true, color: COLORS.accent, align: 'left', valign: 'middle', fontFace: FONTS.heading }));
  slide.addShape('rect', { x, y: startY + headerH, w, h: 0.02, fill: { color: COLORS.border } });
  let ry = startY + headerH;
  rows.forEach((row, r) => {
    if (r % 2 === 1) slide.addShape('rect', { x, y: ry, w, h: rowH, fill: { color: COLORS.surfaceElevated } });
    columns.forEach((_, i) => slide.addText((row && row[i]) || '', { x: x + i * colW + 0.05, y: ry, w: colW - 0.1, h: rowH, fontSize: 11, color: COLORS.primary, align: 'left', valign: 'middle', fontFace: FONTS.body }));
    ry += rowH;
  });
}

function renderTheme02ImageSplitV1(slide: PptxSlide, props: Theme02ImageSplitV1Props): void {
  const x = 0.8; const w = 8.4; const textW = 4.0; const imgX = x + textW + 0.4; const imgW = w - textW - 0.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, textW);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w: textW, h: 0.6, fontSize: 16, color: COLORS.secondary, fontFace: FONTS.body });
  const bullets = (props.bullets || []).slice(0, 5);
  let by = 2.8;
  bullets.forEach((b) => { slide.addText('✓ ' + b, { x, y: by, w: textW, h: 0.45, fontSize: 14, color: COLORS.primary, fontFace: FONTS.body }); by += 0.5; });
  if (props.image) addImageMaybe(slide, props.image, imgX, 2.0, imgW, 3.2);
  else { slide.addShape('rect', { x: imgX, y: 2.0, w: imgW, h: 3.2, fill: { color: COLORS.surfaceElevated }, line: { color: COLORS.border, width: 1 } }); slide.addText('图片占位', { x: imgX, y: 2.0, w: imgW, h: 3.2, fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body }); }
}

function renderTheme02ImageGridV2(slide: PptxSlide, props: Theme02ImageGridV2Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.3, fontSize: 16, color: COLORS.secondary, fontFace: FONTS.body });
  const imgs = (props.images || []).slice(0, 4);
  const caps = (props.captions || []).slice(0, 4);
  const tileW = (w - 0.3) / 2; const tileH = 1.4; const startY = 2.5;
  imgs.forEach((im, i) => {
    const tx = x + (i % 2) * (tileW + 0.3);
    const ty = startY + Math.floor(i / 2) * (tileH + 0.3);
    if (im) addImageMaybe(slide, im, tx, ty, tileW, tileH);
    else { slide.addShape('rect', { x: tx, y: ty, w: tileW, h: tileH, fill: { color: COLORS.surfaceElevated }, line: { color: COLORS.border, width: 1 } }); slide.addText('图片占位', { x: tx, y: ty, w: tileW, h: tileH, fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body }); }
    if (caps[i]) slide.addText(caps[i], { x: tx, y: ty + tileH + 0.02, w: tileW, h: 0.28, fontSize: 11, color: COLORS.secondary, align: 'left', fontFace: FONTS.body });
  });
}

function renderTheme02SpotlightV1(slide: PptxSlide, props: Theme02SpotlightV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.image) addImageMaybe(slide, props.image, 0, 0, 10, 5.625);
  else slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: COLORS.surfaceElevated } });
  slide.addShape('rect', { x: 0, y: 0, w: 10, h: 5.625, fill: { color: '080A0E', transparency: 45 } });
  if (props.kicker) slide.addText(props.kicker, { x, y: 1.5, w, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, align: 'center', fontFace: FONTS.mono });
  if (props.title) slide.addText(props.title, { x, y: 2.1, w, h: 1.0, fontSize: 40, bold: true, color: COLORS.white, align: 'center', valign: 'middle', fontFace: FONTS.heading });
  if (props.subtitle) slide.addText(props.subtitle, { x: x + 0.5, y: 3.3, w: w - 1, h: 0.8, fontSize: 18, color: COLORS.white, align: 'center', fontFace: FONTS.body });
  if (props.caption) slide.addText(props.caption, { x, y: 5.0, w, h: 0.3, fontSize: 12, color: COLORS.white, align: 'center', fontFace: FONTS.mono });
}

function renderTheme02ChapterV3(slide: PptxSlide, props: Theme02ChapterV3Props): void {
  const x = 0.8; const w = 8.4;
  if (props.number) slide.addText(props.number, { x, y: 1.6, w, h: 1.6, fontSize: 96, bold: true, color: COLORS.accent, align: 'center', valign: 'middle', fontFace: FONTS.heading });
  if (props.kicker) slide.addText(props.kicker, { x, y: 3.3, w, h: 0.4, fontSize: 14, bold: true, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono });
  if (props.title) slide.addText(props.title, { x, y: 3.75, w, h: 0.6, fontSize: 32, bold: true, color: COLORS.primary, align: 'center', fontFace: FONTS.heading });
  slide.addShape('rect', { x: x + w / 2 - 1.0, y: 4.5, w: 2.0, h: 0.02, fill: { color: COLORS.accent } });
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 4.65, w, h: 0.4, fontSize: 15, color: COLORS.secondary, align: 'center', fontFace: FONTS.body });
}

function renderTheme02SectionDividerV1(slide: PptxSlide, props: Theme02SectionDividerV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.index) slide.addText(props.index, { x, y: 1.9, w, h: 0.4, fontSize: 14, bold: true, color: COLORS.accent, align: 'center', fontFace: FONTS.mono });
  if (props.kicker) slide.addText(props.kicker, { x, y: 2.35, w, h: 0.4, fontSize: 13, bold: true, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono });
  if (props.title) slide.addText(props.title, { x, y: 2.8, w, h: 0.8, fontSize: 36, bold: true, color: COLORS.primary, align: 'center', fontFace: FONTS.heading });
  slide.addShape('rect', { x: x + w / 2 - 1.2, y: 3.7, w: 2.4, h: 0.02, fill: { color: COLORS.accent } });
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 3.9, w, h: 0.5, fontSize: 16, color: COLORS.secondary, align: 'center', fontFace: FONTS.body });
}

function renderTheme02LogoWallV1(slide: PptxSlide, props: Theme02LogoWallV1Props): void {
  const x = 0.8; const w = 8.4;
  if (props.kicker) addKicker(slide, props.kicker, x);
  if (props.title) addTitle(slide, props.title, x, 1.25, w);
  if (props.subtitle) slide.addText(props.subtitle, { x, y: 2.05, w, h: 0.3, fontSize: 16, color: COLORS.secondary, fontFace: FONTS.body });
  const logos = (props.logos || []).slice(0, 8);
  if (logos.length === 0) return;
  const cols = 4; const rows = Math.ceil(logos.length / cols);
  const cardW = (w - 0.3 * (cols - 1)) / cols;
  const cardH = Math.min(1.1, (5.0 - 2.5) / rows - 0.2);
  logos.forEach((lg, i) => {
    const cx = x + (i % cols) * (cardW + 0.3);
    const cy = 2.55 + Math.floor(i / cols) * (cardH + 0.25);
    addTheme02Card(slide, cx, cy, cardW, cardH, 0.12);
    slide.addText(lg.name || '', { x: cx + 0.15, y: cy + 0.18, w: cardW - 0.3, h: 0.4, fontSize: 15, bold: true, color: COLORS.primary, align: 'center', fontFace: FONTS.heading });
    if (lg.sub) slide.addText(lg.sub, { x: cx + 0.15, y: cy + 0.58, w: cardW - 0.3, h: 0.3, fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.body });
  });
}

type PptxRenderFn = (slide: PptxSlide, props: unknown) => void;

export function registerTheme02Renderers(registerPptxLayoutRenderer: (id: string, fn: PptxRenderFn) => void): void {
  registerPptxLayoutRenderer('theme02_cover_v1', renderCoverV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_cover_v2', renderCoverV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chapter_v1', renderTheme02ChapterV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chapter_v2', renderTheme02ChapterV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_metric_big', renderTheme01MetricBig as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_number_showcase_v1', renderTheme02NumberShowcaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_v1', renderTheme02ChartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_funnel', renderChartFunnel as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_donut', renderTheme01ChartDonut as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_heatmap', renderChartHeatmap as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_radar', renderChartRadar as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_gauge', renderChartGauge as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_content_v1', renderTheme02ContentV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_delta_v1', renderTheme02DeltaV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_closing_v1', renderClosing as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_table_of_contents_v1', renderTheme02TableOfContentsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_metrics_v1', renderStatsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_team_v1', renderTeamV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_timeline_v1', renderTimelineV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_comparison_v1', renderComparisonV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_image_v1', renderTheme02ImageV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_quote_v1', renderTheme02QuoteV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_quote_v2', renderTheme02QuoteV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_bento_v1', renderTheme02BentoV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_feature_v1', renderFeatureV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_gallery_v1', renderTheme01GalleryV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_pricing_v1', renderPricingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_process_v1', renderTheme02ProcessV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_progress_v1', renderTheme02ProgressV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_roadmap_v1', renderTheme01RoadmapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_swot_v1', renderSwotV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_faq_v1', renderFaqV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_filmstrip_v1', renderTheme01FilmstripV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_partners_v1', renderPartnersV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_pest_v1', renderPestV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_stats_v1', renderStatsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_table_v1', renderTheme01TableV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_tags_v1', renderTheme01TagsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_testimonial_v1', renderTestimonialV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_feature_v2', renderTheme02FeatureV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_checklist_v1', renderTheme02ChecklistV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_steps_v1', renderTheme02StepsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_card_grid_v1', renderTheme02CardGridV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_highlight_v1', renderTheme02HighlightV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_comparison_v2', renderTheme02ComparisonV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_matrix_v1', renderTheme02MatrixV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_stat_grid_v1', renderTheme02StatGridV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_cover_v3', renderTheme02CoverV3 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_closing_v2', renderTheme02ClosingV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_bar_v1', renderTheme02ChartBarV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_line_v1', renderTheme02ChartLineV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_area_v1', renderTheme02ChartAreaV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chart_stack_v1', renderTheme02ChartStackV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_kpi_strip_v1', renderTheme02KpiStripV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_big_stat_v1', renderTheme02BigStatV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_cycle_v1', renderTheme02CycleV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_swimlane_v1', renderTheme02SwimlaneV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_pyramid_v1', renderTheme02PyramidV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_org_chart_v1', renderTheme02OrgChartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_flow_v1', renderTheme02FlowV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_table_v2', renderTheme02TableV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_image_split_v1', renderTheme02ImageSplitV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_image_grid_v2', renderTheme02ImageGridV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_spotlight_v1', renderTheme02SpotlightV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_chapter_v3', renderTheme02ChapterV3 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_section_divider_v1', renderTheme02SectionDividerV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme02_logo_wall_v1', renderTheme02LogoWallV1 as PptxRenderFn);
}
