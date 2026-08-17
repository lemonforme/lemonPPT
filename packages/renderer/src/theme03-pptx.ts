// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme03 PPTX 版式专属渲染器（从 export-pptx.ts 抽出）。
// 共享基础设施（全局 helper + 通用渲染器 + 类型 + theme03 局部 helper/const）从 export-pptx.ts 导入；
// theme01 通用渲染器从 theme01-pptx.ts 复用；其他已抽出主题的渲染器从各自 theme<K>-pptx.ts 复用。
// 注册通过 registerTheme03Renderers 回调注入。

import { type Slide as PptxSlide } from 'pptxgenjs';
import { addTheme03Topbar, theme03TitleText, FONTS, COLORS, addTheme03Footer, addTheme02Card, CHART_COLORS, addImageMaybe, getTheme03PricingFeatureValue, getTheme03ComparisonValue } from './export-pptx.js';

function renderTheme03CoverV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.5, w: 7.0, h: 1.4,
    fontSize: 54, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.95, w: 6.5, h: 0.8,
      fontSize: 16, color: COLORS.secondary, fontFace: FONTS.body,
      valign: 'top',
    });
  }
  const metricX = 7.2;
  slide.addText(props.metricValue ?? '', {
    x: metricX, y: 2.2, w: 2.5, h: 0.8,
    fontSize: 72, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    valign: 'bottom',
  });
  slide.addText(props.metricUnit ?? '', {
    x: metricX + 1.4, y: 2.6, w: 1.0, h: 0.3,
    fontSize: 20, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'bottom',
  });
  if (props.metricLabel) {
    slide.addText(props.metricLabel, {
      x: metricX, y: 3.05, w: 2.5, h: 0.3,
      fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body,
    });
  }
  if (props.stats && props.stats.length > 0) {
    const statY = 4.1;
    const statW = 2.6;
    props.stats.slice(0, 3).forEach((stat: any, idx: number) => {
      const x = 0.84375 + idx * (statW + 0.3);
      slide.addText(`${stat.value}${stat.unit ?? ''}`, {
        x, y: statY, w: statW, h: 0.35,
        fontSize: 24, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(stat.label ?? '', {
        x, y: statY + 0.38, w: statW, h: 0.25,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ChapterV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(props.number ?? '', {
    x: 0.84375, y: 1.6, w: 2.2, h: 1.4,
    fontSize: 110, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  if (props.numberEnglish) {
    slide.addText(props.numberEnglish, {
      x: 2.6, y: 1.8, w: 0.3, h: 2.0,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      valign: 'top',
    } as any);
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 3.1, y: 1.7, w: 5.8, h: 0.9,
    fontSize: 42, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.description) {
    slide.addText(props.description, {
      x: 3.1, y: 2.65, w: 5.0, h: 0.8,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.items && props.items.length > 0) {
    const itemY = 3.8;
    props.items.slice(0, 4).forEach((item: any, idx: number) => {
      slide.addText(`${item.number ?? idx + 1}  ${item.title ?? ''}`, {
        x: 3.1 + idx * 2.1, y: itemY, w: 2.0, h: 0.3,
        fontSize: 12, color: COLORS.primary, fontFace: FONTS.body,
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ContentV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.columns && props.columns.length > 0) {
    const colW = 8.3 / Math.min(props.columns.length, 3);
    const startY = 2.9;
    props.columns.slice(0, 3).forEach((col: any, idx: number) => {
      const x = 0.84375 + idx * colW;
      addTheme02Card(slide, x, startY, colW - 0.25, 2.1, 0.08);
      slide.addText(col.title ?? '', {
        x: x + 0.15, y: startY + 0.15, w: colW - 0.55, h: 0.3,
        fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
      if (col.points && col.points.length > 0) {
        const points = Array.isArray(col.points[0]) ? col.points : col.points.map((p: any) => typeof p === 'string' ? p : p.value);
        slide.addText(points.map((p: string) => `• ${p}`).join('\n'), {
          x: x + 0.15, y: startY + 0.55, w: colW - 0.55, h: 1.4,
          fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricBig(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(`${props.value ?? ''}${props.unit ?? ''}`, {
    x: 0.84375, y: 1.7, w: 4.5, h: 1.1,
    fontSize: 88, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  if (props.label) {
    slide.addText(props.label, {
      x: 0.84375, y: 2.8, w: 4.5, h: 0.5,
      fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.84375, y: 3.3, w: 4.5, h: 0.6,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.showInsight && props.insight) {
    addTheme02Card(slide, 5.6, 1.7, 3.4, 2.3, 0.08);
    slide.addShape('line', {
      x1: 5.6, y1: 1.7, x2: 5.6, y2: 4.0,
      line: { color: COLORS.accent, width: 3 },
    });
    slide.addText(props.insight.label ?? '', {
      x: 5.8, y: 1.9, w: 3.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono,
    });
    slide.addText(props.insight.value ?? '', {
      x: 5.8, y: 2.2, w: 3.0, h: 0.5,
      fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(props.insight.description ?? '', {
      x: 5.8, y: 2.75, w: 3.0, h: 1.0,
      fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.metrics && props.metrics.length > 0) {
    const statY = 4.35;
    const statW = 8.3 / Math.min(props.metrics.length, 3);
    props.metrics.slice(0, 3).forEach((metric: any, idx: number) => {
      const x = 0.84375 + idx * statW;
      slide.addShape('line', {
        x1: x, y1: statY - 0.05, x2: x + statW - 0.3, y2: statY - 0.05,
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(`${metric.value}${metric.unit ?? ''}`, {
        x, y: statY + 0.05, w: statW - 0.3, h: 0.35,
        fontSize: 24, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(metric.label ?? '', {
        x, y: statY + 0.42, w: statW - 0.3, h: 0.25,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03RankingV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.35, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.05, w: 7.5, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.items && props.items.length > 0) {
    const max = Math.max(...props.items.map((i: any) => Number(i.maxValue || i.value) || 0));
    const rowH = 0.38;
    const startY = 2.55;
    props.items.slice(0, 6).forEach((item: any, idx: number) => {
      const y = startY + idx * rowH;
      const isTop = idx === 0;
      const value = Number(item.value) || 0;
      const pct = max ? value / max : 0;
      slide.addText(item.rank ?? `${idx + 1}`, {
        x: 0.84375, y, w: 0.4, h: 0.3,
        fontSize: 11, color: isTop ? COLORS.accent : COLORS.secondary, fontFace: FONTS.mono,
      });
      slide.addText(item.name ?? '', {
        x: 1.3, y, w: 1.8, h: 0.3,
        fontSize: 13, color: isTop ? COLORS.accent : COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      slide.addText(item.category ?? '', {
        x: 3.2, y, w: 1.2, h: 0.3,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
      });
      slide.addShape('roundRect', {
        x: 4.5, y: y + 0.1, w: 3.2, h: 0.12,
        fill: { color: COLORS.surfaceElevated },
        rectRadius: 0.06,
      } as any);
      if (pct > 0) {
        slide.addShape('roundRect', {
          x: 4.5, y: y + 0.1, w: 3.2 * pct, h: 0.12,
          fill: { color: isTop ? COLORS.accent : COLORS.secondary },
          rectRadius: 0.06,
        } as any);
      }
      slide.addText(`${item.value}${props.unit ?? ''}`, {
        x: 7.9, y, w: 0.8, h: 0.3,
        fontSize: 12, color: isTop ? COLORS.accent : COLORS.primary, bold: true, fontFace: FONTS.mono,
        align: 'right',
      });
    });
  }
  if (props.insightLabel || props.insightText) {
    const insightY = 4.85;
    slide.addText(props.insightLabel ?? '', {
      x: 0.84375, y: insightY, w: 1.0, h: 0.25,
      fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono,
    });
    slide.addText(props.insightText ?? '', {
      x: 1.8, y: insightY, w: 7.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03QuoteV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText('“', {
    x: 0.84375, y: 1.5, w: 1.0, h: 0.8,
    fontSize: 90, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
  });
  slide.addText(theme03TitleText(props.quote ?? ''), {
    x: 1.4, y: 2.0, w: 7.5, h: 1.4,
    fontSize: 38, fontFace: FONTS.heading, valign: 'top',
  });
  const attrParts = [props.author, props.title, props.source].filter(Boolean).join(' / ');
  if (attrParts) {
    slide.addText(attrParts, {
      x: 1.4, y: 3.55, w: 7.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03CaseV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 4.5, y: 1.4, w: 4.9, h: 0.7,
    fontSize: 34, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 4.5, y: 2.1, w: 4.9, h: 0.3,
      fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 4.5, y: 2.45, w: 4.9, h: 0.6,
      fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme02Card(slide, 0.84375, 1.4, 3.3, 3.6, 0.08);
  slide.addText('点击上传案例配图', {
    x: 0.84375, y: 2.9, w: 3.3, h: 0.3,
    fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
  });
  if (props.milestones && props.milestones.length > 0) {
    const startY = 3.2;
    props.milestones.slice(0, 3).forEach((m: any, idx: number) => {
      const y = startY + idx * 0.55;
      slide.addShape('ellipse', {
        x: 4.5, y: y + 0.05, w: 0.12, h: 0.12,
        fill: { color: COLORS.accent },
      });
      slide.addText(m.date ?? '', {
        x: 4.75, y, w: 1.0, h: 0.18,
        fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono,
      });
      slide.addText(m.title ?? '', {
        x: 4.75, y: y + 0.2, w: 2.5, h: 0.18,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 4.5, y: 4.55, w: 4.9, h: 0.4,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ClosingV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(props.title ?? '感谢阅读', {
    x: 0.84375, y: 1.7, w: 4.5, h: 1.0,
    fontSize: 54, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.7, w: 4.0, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.contact) {
    slide.addText(props.contact, {
      x: 0.84375, y: 3.3, w: 4.0, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  const columns = [
    { title: props.leftColumnTitle, items: props.leftColumnItems },
    { title: props.rightColumnTitle, items: props.rightColumnItems },
  ];
  const colW = 2.0;
  columns.forEach((col, idx) => {
    if (!col.title && (!col.items || col.items.length === 0)) return;
    const x = 5.4 + idx * (colW + 0.4);
    slide.addText(col.title ?? '', {
      x, y: 1.7, w: colW, h: 0.25,
      fontSize: 11, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
    });
    if (col.items && col.items.length > 0) {
      slide.addText(col.items.join('\n'), {
        x, y: 2.05, w: colW, h: 1.8,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    }
  });
  addTheme03Footer(slide, props);
}

function renderTheme03TableOfContentsV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.items && props.items.length > 0) {
    const startY = 2.85;
    const rowH = 0.52;
    props.items.slice(0, 8).forEach((item: any, idx: number) => {
      const y = startY + idx * rowH;
      addTheme02Card(slide, 0.84375, y, 8.3125, 0.42, 0.06);
      slide.addText(item.title ?? '', {
        x: 1.05, y: y + 0.09, w: 3.8, h: 0.24,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'middle',
      });
      slide.addText(item.page ?? '', {
        x: 8.0, y: y + 0.09, w: 0.9, h: 0.24,
        fontSize: 13, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'middle',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricsV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.stats && props.stats.length > 0) {
    const items = props.stats.slice(0, 8);
    const cols = items.length <= 4 ? Math.min(items.length, 4) : 4;
    const rows = Math.ceil(items.length / cols);
    const cardW = (8.3125 - (cols - 1) * 0.25) / cols;
    const cardH = rows === 1 ? 1.8 : 1.25;
    const startY = 2.9;
    items.forEach((stat: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + 0.25);
      const y = startY + row * (cardH + 0.25);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      const valueText = `${stat.value ?? ''}${stat.unit ?? ''}`;
      slide.addText(valueText, {
        x: x + 0.15, y: y + 0.25, w: cardW - 0.3, h: 0.4,
        fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      if (stat.change) {
        slide.addText(stat.change, {
          x: x + cardW - 1.1, y: y + 0.28, w: 0.95, h: 0.3,
          fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
        });
      }
      slide.addText(stat.label ?? '', {
        x: x + 0.15, y: y + 0.72, w: cardW - 0.3, h: 0.35,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03FeatureV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.features && props.features.length > 0) {
    const items = props.features.slice(0, 6);
    const cols = Math.min(items.length, 3);
    const rows = Math.ceil(items.length / cols);
    const cardW = (8.3125 - (cols - 1) * 0.28) / cols;
    const cardH = rows === 1 ? 2.2 : 1.55;
    const startY = 2.85;
    items.forEach((feature: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + 0.28);
      const y = startY + row * (cardH + 0.28);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addText(feature.number ?? String(idx + 1).padStart(2, '0'), {
        x: x + 0.15, y: y + 0.15, w: 0.8, h: 0.35,
        fontSize: 24, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(feature.title ?? '', {
        x: x + 0.15, y: y + 0.58, w: cardW - 0.3, h: 0.32,
        fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(feature.description ?? '', {
        x: x + 0.15, y: y + 0.95, w: cardW - 0.3, h: cardH - 1.1,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ImageV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const imgY = 2.85;
  const imgH = 2.6;
  addTheme02Card(slide, 0.84375, imgY, 8.3125, imgH, 0.1);
  if (props.image) {
    try {
      slide.addImage({ path: props.image, x: 0.94375, y: imgY + 0.1, w: 8.1125, h: imgH - 0.2 });
    } catch {
      slide.addText('（图片无法加载）', {
        x: 0.84375, y: imgY + 1.1, w: 8.3125, h: 0.4,
        fontSize: 14, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    }
  } else {
    slide.addText('点击上传架构图 / 系统图', {
      x: 0.84375, y: imgY + 1.1, w: 8.3125, h: 0.4,
      fontSize: 13, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
  if (props.caption) {
    slide.addText(props.caption, {
      x: 0.84375, y: imgY + imgH + 0.15, w: 8.3125, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ChartDonut(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? '环形图'), {
    x: 0.84375, y: 1.35, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.05, w: 7.5, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const rawSegments = (props.segments || [])
    .filter((s: any) => s != null && !!(s.label || s.value))
    .map((s: any) => ({ ...s }))
    .sort((a: any, b: any) => {
      const na = parseFloat(String(a.value || '0').replace(/,/g, ''));
      const nb = parseFloat(String(b.value || '0').replace(/,/g, ''));
      return nb - na;
    });

  if (rawSegments.length === 0) {
    slide.addText('（暂无环形图数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    addTheme03Footer(slide, props);
    return;
  }

  const totalValue = rawSegments.reduce((sum: number, s: any) => {
    return sum + parseFloat(String(s.value || '0').replace(/,/g, ''));
  }, 0);

  const segments = rawSegments.map((s: any) => {
    const n = parseFloat(String(s.value || '0').replace(/,/g, ''));
    const pct = totalValue > 0 ? Math.round((n / totalValue) * 1000) / 10 : 0;
    return { ...s, percent: `${pct}%`, numericValue: n };
  });

  const labels = segments.map((s: any) => s.label || '');
  const values = segments.map((s: any) => s.numericValue);
  const chartColors = segments.map((_: any, i: number) => CHART_COLORS[i % CHART_COLORS.length]);

  const showInsight = props.showInsight !== false;
  const insight = props.insight;
  const hasInsight = showInsight && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const chartW = hasInsight ? 4.0 : 4.8;
  slide.addChart('doughnut' as 'pie', [
    { name: props.title || '', labels, values },
  ], {
    x: 0.6, y: 2.4, w: chartW, h: 3.0,
    chartColors,
    showValue: false,
    holeSize: 60,
  } as any);

  const total = props.total || { value: String(totalValue), label: '合计' };
  const centerX = 0.6 + chartW / 2;
  slide.addText(total.value || String(totalValue), {
    x: centerX - 1.8, y: 3.4, w: 3.6, h: 0.6,
    fontSize: 28, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(total.label || '合计', {
    x: centerX - 1.8, y: 4.0, w: 3.6, h: 0.3,
    fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
    fontFace: FONTS.body,
  });

  const legendX = hasInsight ? 4.8 : 5.6;
  const legendW = hasInsight ? 2.6 : 3.2;
  let legendY = 2.5;
  segments.forEach((segment: any, index: number) => {
    const color = chartColors[index % chartColors.length];
    slide.addShape('ellipse', {
      x: legendX, y: legendY + 0.08, w: 0.18, h: 0.18,
      fill: { color },
    } as any);
    slide.addText(segment.label || '', {
      x: legendX + 0.3, y: legendY, w: legendW - 1.4, h: 0.28,
      fontSize: 13, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    if (segment.labelEn) {
      slide.addText(segment.labelEn, {
        x: legendX + 0.3, y: legendY + 0.26, w: legendW - 1.4, h: 0.22,
        fontSize: 10, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
    slide.addText(segment.percent || '', {
      x: legendX + legendW - 1.0, y: legendY, w: 0.9, h: 0.28,
      fontSize: 13, color: COLORS.accent, bold: true, align: 'right', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(segment.value || '', {
      x: legendX + legendW - 1.0, y: legendY + 0.26, w: 0.9, h: 0.22,
      fontSize: 10, color: COLORS.secondary, align: 'right', valign: 'top',
      fontFace: FONTS.mono,
    });
    legendY += segment.labelEn ? 0.65 : 0.5;
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 7.6, y: 2.3, w: 2.4, h: 3.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    } as any);

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 7.8, y: cursorY, w: 2.0, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 7.8, y: cursorY, w: 2.0, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 7.8, y: cursorY, w: 2.0, h: 1.5,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary, valign: 'top',
      });
    }
  }

  addTheme03Footer(slide, props);
}

function renderTheme03ChartBar(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? '柱状图'), {
    x: 0.84375, y: 1.35, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.05, w: 7.5, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const bars = (props.bars || [])
    .filter((b: any) => b != null && !!(b.label || b.value))
    .map((b: any) => ({ ...b }));

  if (bars.length === 0) {
    slide.addText('（暂无柱状图数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    addTheme03Footer(slide, props);
    return;
  }

  const values = bars.map((b: any) => parseFloat(String(b.value || '0').replace(/,/g, '')) || 0);
  const max = Math.max(...values, 1);
  const topIndex = values.indexOf(max);
  const labels = bars.map((b: any) => b.label || '');
  const chartColors = bars.map((_: any, i: number) => (i === topIndex ? COLORS.accent : COLORS.secondary));

  const showInsight = props.showInsight !== false;
  const insight = props.insight;
  const hasInsight = showInsight && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const chartW = hasInsight ? 6.4 : 8.4;
  const chartX = 0.84375;

  slide.addChart('bar' as 'bar', [
    { name: props.title || '', labels, values },
  ], {
    x: chartX, y: 2.55, w: chartW, h: 3.0,
    chartColors,
    barDir: 'col',
    barGrouping: 'clustered',
    showValue: true,
    dataLabelPosition: 'outEnd',
    dataLabelFontSize: 10,
    dataLabelColor: COLORS.primary,
  } as any);

  if (hasInsight) {
    const insightX = chartX + chartW + 0.3;
    slide.addShape('roundRect', {
      x: insightX, y: 2.55, w: 2.4, h: 3.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    } as any);

    let cursorY = 2.85;
    if (insight.value) {
      slide.addText(insight.value, {
        x: insightX + 0.2, y: cursorY, w: 2.0, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: insightX + 0.2, y: cursorY, w: 2.0, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: insightX + 0.2, y: cursorY, w: 2.0, h: 1.5,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary, valign: 'top',
      });
    }
  }

  addTheme03Footer(slide, props);
}

function renderTheme03ChartFallback(slide: PptxSlide, props: any, label: string): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? label), {
    x: 0.84375, y: 1.35, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.05, w: 7.5, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const insight = props.insight;
  const hasInsight = props.showInsight !== false && insight && (insight.value || insight.label || insight.description);
  const placeholderW = hasInsight ? 5.4 : 6;
  const placeholderX = hasInsight ? 1.1 : 2;
  slide.addText(`（${label}占位：请在编辑器中查看完整图表）`, {
    x: placeholderX, y: 3.2, w: placeholderW, h: 0.8,
    fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
    fontFace: FONTS.body,
  });
  if (hasInsight) {
    const panelX = 6.9;
    const panelY = 2.55;
    const panelW = 2.2;
    const panelH = 3.05;
    slide.addShape('roundRect', {
      x: panelX, y: panelY, w: panelW, h: panelH,
      fill: { color: COLORS.surface },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    } as any);
    slide.addShape('rect', {
      x: panelX, y: panelY, w: 0.05, h: panelH,
      fill: { color: COLORS.accent },
    } as any);
    let currentY = panelY + 0.25;
    if (insight.value) {
      slide.addText(insight.value, {
        x: panelX + 0.12, y: currentY, w: panelW - 0.24, h: 0.45,
        fontSize: 26, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      currentY += 0.45;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: panelX + 0.12, y: currentY, w: panelW - 0.24, h: 0.3,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      currentY += 0.35;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: panelX + 0.12, y: currentY, w: panelW - 0.24, h: panelH - (currentY - panelY) - 0.2,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    }
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ChartV1(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '通用图表');
}

function renderTheme03TrendV1(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '趋势图');
}

function renderTheme03ChartRadar(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '雷达图');
}

function renderTheme03ChartFunnel(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '漏斗图');
}

function renderTheme03ChartGauge(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '仪表盘');
}

function renderTheme03ChartHeatmap(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '热力图');
}

function renderTheme03ChartTreemap(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '矩形树图');
}

function renderTheme03ChartWordcloud(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '词云');
}

function renderTheme03ChartBar3d(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '3D 柱状图');
}

function renderTheme03ChartGraph(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '关系图');
}

function renderTheme03ChartSankey(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '桑基图');
}

function renderTheme03ChartSunburst(slide: PptxSlide, props: any): void {
  renderTheme03ChartFallback(slide, props, '旭日图');
}

function renderTheme03TeamV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const members = (props.members || []).filter((m: any) => m != null).slice(0, 6);
  if (members.length > 0) {
    const cols = members.length <= 4 ? 4 : 3;
    const rows = Math.ceil(members.length / cols);
    const gap = 0.25;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = rows === 1 ? 2.25 : 1.55;
    const startY = 2.85;
    members.forEach((member: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      const avatarSize = 0.6875;
      const avatarX = x + (cardW - avatarSize) / 2;
      const avatarY = y + 0.18;
      if (member.image) {
        addImageMaybe(slide, member.image, avatarX, avatarY, avatarSize, avatarSize);
      }
      slide.addText(member.name ?? '', {
        x, y: avatarY + avatarSize + 0.12, w: cardW, h: 0.28,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
      slide.addText(member.role ?? '', {
        x, y: avatarY + avatarSize + 0.42, w: cardW, h: 0.22,
        fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, align: 'center', valign: 'top',
      });
      if (member.bio) {
        slide.addText(member.bio, {
          x: x + 0.12, y: avatarY + avatarSize + 0.68, w: cardW - 0.24, h: cardH - (avatarY + avatarSize + 0.68 - y) - 0.12,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03PartnersV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const partners = (props.partners || []).filter((p: any) => p != null).slice(0, 8);
  if (partners.length > 0) {
    const cols = 4;
    const rows = Math.ceil(partners.length / cols);
    const gapX = 0.25;
    const gapY = 0.25;
    const cardW = (8.3125 - (cols - 1) * gapX) / cols;
    const cardH = rows === 1 ? 1.35 : 1.15;
    const startY = 2.85;
    partners.forEach((partner: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      const logoH = 0.55;
      if (partner.logo) {
        addImageMaybe(slide, partner.logo, x + 0.2, y + 0.15, cardW - 0.4, logoH);
      }
      slide.addText(partner.name ?? '', {
        x, y: y + logoH + 0.22, w: cardW, h: 0.22,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03PricingV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const tiers = (props.tiers || []).filter((t: any) => t != null).slice(0, 4);
  if (tiers.length > 0) {
    const cols = tiers.length <= 3 ? 3 : 4;
    const rows = Math.ceil(tiers.length / cols);
    const gap = 0.25;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = rows === 1 ? 2.5 : 1.9;
    const startY = 2.85;
    tiers.forEach((tier: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      const isHighlight = tier.highlight === true;
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: isHighlight ? COLORS.accent : COLORS.border }, rectRadius: 0.04,
      } as any);
      if (isHighlight) {
        slide.addText('推荐', {
          x: x + cardW - 0.6, y: y + 0.12, w: 0.5, h: 0.18,
          fontSize: 9, color: COLORS.accent, fontFace: FONTS.mono, align: 'right', valign: 'top',
        });
      }
      slide.addText(tier.name ?? '', {
        x, y: y + 0.22, w: cardW, h: 0.28,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
      slide.addText([tier.price, tier.period].filter(Boolean).join(' '), {
        x, y: y + 0.55, w: cardW, h: 0.32,
        fontSize: 20, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
      });
      const features = (tier.features || []).slice(0, 5).map(getTheme03PricingFeatureValue).filter(Boolean) as string[];
      let fy = y + 0.98;
      features.forEach((feature: string) => {
        slide.addText(feature, {
          x: x + 0.12, y: fy, w: cardW - 0.24, h: 0.24,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
        });
        fy += 0.26;
      });
      if (tier.cta) {
        slide.addText(tier.cta, {
          x: x + 0.2, y: y + cardH - 0.38, w: cardW - 0.4, h: 0.26,
          fontSize: 10, color: isHighlight ? COLORS.white : COLORS.accent,
          fill: isHighlight ? { color: COLORS.accent } : { color: COLORS.surfaceElevated },
          line: { color: isHighlight ? COLORS.accent : COLORS.border, width: 1 },
          align: 'center', valign: 'middle', fontFace: FONTS.body,
        } as any);
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ComparisonV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const colW = 3.75;
  const gap = 0.4;
  const vsW = 0.5;
  const totalW = colW * 2 + gap * 2 + vsW;
  const startX = (10 - totalW) / 2;
  const y = 2.9;
  const colH = 2.5;

  addTheme02Card(slide, startX, y, colW, colH, 0.08);
  slide.addShape('roundRect', {
    x: startX, y, w: colW, h: 0.08,
    fill: { color: COLORS.secondary }, rectRadius: 0.04,
  } as any);
  slide.addText(props.leftTitle ?? '方案 A', {
    x: startX, y: y + 0.18, w: colW, h: 0.32,
    fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
  });
  const leftItems = (props.leftItems || []).map(getTheme03ComparisonValue).filter(Boolean) as string[];
  slide.addText(leftItems.map((i) => `• ${i}`).join('\n'), {
    x: startX + 0.15, y: y + 0.62, w: colW - 0.3, h: colH - 0.8,
    fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
  });

  slide.addShape('ellipse', {
    x: startX + colW + gap + (vsW - 0.4) / 2, y: y + colH / 2 - 0.2, w: 0.4, h: 0.4,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
  } as any);
  slide.addText('VS', {
    x: startX + colW + gap, y: y + colH / 2 - 0.2, w: vsW, h: 0.4,
    fontSize: 12, color: COLORS.secondary, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
  });

  const rightX = startX + colW + gap + vsW + gap;
  addTheme02Card(slide, rightX, y, colW, colH, 0.08);
  slide.addShape('roundRect', {
    x: rightX, y, w: colW, h: 0.08,
    fill: { color: COLORS.accent }, rectRadius: 0.04,
  } as any);
  slide.addText(props.rightTitle ?? '方案 B', {
    x: rightX, y: y + 0.18, w: colW, h: 0.32,
    fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
  });
  const rightItems = (props.rightItems || []).map(getTheme03ComparisonValue).filter(Boolean) as string[];
  slide.addText(rightItems.map((i) => `• ${i}`).join('\n'), {
    x: rightX + 0.15, y: y + 0.62, w: colW - 0.3, h: colH - 0.8,
    fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
  });

  addTheme03Footer(slide, props);
}

function renderTheme03GalleryV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const images = (props.images || []).slice(0, 4);
  if (images.length > 0) {
    const cols = images.length <= 2 ? images.length : 2;
    const rows = Math.ceil(images.length / cols);
    const gapX = 0.28;
    const gapY = 0.24;
    const cardW = (8.3125 - (cols - 1) * gapX) / cols;
    const cardH = rows === 1 ? 2.6 : 1.55;
    const startY = 2.85;
    images.forEach((image: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + cardW - 0.55, y: y + 0.1, w: 0.45, h: 0.22,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      if (image.url) {
        try {
          slide.addImage({ path: image.url, x: x + 0.1, y: y + 0.22, w: cardW - 0.2, h: cardH - 0.54 });
        } catch {
          slide.addText('（图片）', {
            x: x + 0.1, y: y + 0.6, w: cardW - 0.2, h: 0.3,
            fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
          });
        }
      }
      if (image.caption) {
        slide.addText(image.caption, {
          x: x + 0.1, y: y + cardH - 0.28, w: cardW - 0.2, h: 0.22,
          fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03NumberShowcaseV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.7,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top', align: 'center',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.15, w: 8.3, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top', align: 'center',
    });
  }
  const value = props.value ?? '';
  const unit = props.unit ?? '';
  const valueWidth = value.length > 3 ? 6.0 : 4.0;
  slide.addText(value, {
    x: (10 - valueWidth) / 2, y: 2.7, w: valueWidth, h: 1.2,
    fontSize: 100, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    align: 'center', valign: 'middle',
  });
  if (unit) {
    slide.addText(unit, {
      x: (10 - valueWidth) / 2 + valueWidth + 0.1, y: 3.4, w: 1.2, h: 0.4,
      fontSize: 22, color: COLORS.secondary, bold: true, fontFace: FONTS.body,
      valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 1.5, y: 4.05, w: 7.0, h: 0.6,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top', align: 'center',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03BentoV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const gap = 0.22;
    const areaW = 8.3125;
    const areaH = 2.4;
    const startY = 2.85;
    items.forEach((item: any, idx: number) => {
      const size = item.size || 'medium';
      const isLarge = size === 'large';
      const isSmall = size === 'small';
      const w = isLarge ? (areaW - gap) / 2 : isSmall ? (areaW - gap * 3) / 4 : (areaW - gap) / 2;
      const h = isLarge ? areaH : (areaH - gap) / 2;
      const colSpan = isLarge ? 2 : isSmall ? 1 : 2;
      const col = idx % (4 / colSpan);
      const row = Math.floor(idx / (4 / colSpan));
      const x = 0.84375 + col * (w + gap);
      const y = startY + row * (h + gap);
      addTheme02Card(slide, x, y, w, h, 0.08);
      slide.addShape('roundRect', {
        x, y, w, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      const valueText = `${item.value ?? ''}${item.unit ?? ''}`;
      slide.addText(valueText, {
        x: x + 0.15, y: y + 0.25, w: w - 0.3, h: 0.5,
        fontSize: isLarge ? 36 : 24, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(item.label ?? '', {
        x: x + 0.15, y: y + h - 0.45, w: w - 0.3, h: 0.3,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03QuadrantV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.xAxis || props.yAxis) {
    slide.addText([props.xAxis, props.yAxis].filter(Boolean).join('   |   '), {
      x: 0.84375, y: 2.62, w: 7.5, h: 0.22,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
    });
  }
  const quadrants = (props.quadrants || []).slice(0, 4);
  const defaultLabels = ['高价值 / 高可行性', '高价值 / 低可行性', '低价值 / 高可行性', '低价值 / 低可行性'];
  const colors = [COLORS.accent, COLORS.secondary, CHART_COLORS[2] || COLORS.secondary, COLORS.secondary];
  if (quadrants.length > 0) {
    const cols = 2;
    const gap = 0.24;
    const cardW = (8.3125 - gap) / cols;
    const cardH = 1.35;
    const startY = 2.95;
    quadrants.forEach((q: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: colors[idx % colors.length] }, rectRadius: 0.04,
      } as any);
      slide.addText(q.label || defaultLabels[idx] || '', {
        x: x + 0.15, y: y + 0.16, w: cardW - 0.3, h: 0.3,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.mono, valign: 'top',
      });
      const items = (q.items || []).slice(0, 4).map((item: any) => typeof item === 'string' ? item : item?.value).filter(Boolean);
      if (items.length > 0) {
        slide.addText(items.map((i: string) => `> ${i}`).join('\n'), {
          x: x + 0.15, y: y + 0.52, w: cardW - 0.3, h: cardH - 0.65,
          fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TableV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const headers = (props.headers || []).slice(0, 8);
  const rows = (props.rows || []).slice(0, 8);
  if (headers.length > 0 || rows.length > 0) {
    const tableY = 2.85;
    const tableH = 2.6;
    addTheme02Card(slide, 0.84375, tableY, 8.3125, tableH, 0.08);
    const colCount = Math.max(headers.length, rows[0]?.length || 1);
    const colW = 8.3125 / colCount;
    const headerH = 0.42;
    const rowH = (tableH - headerH) / Math.max(rows.length, 1);
    if (headers.length > 0) {
      headers.forEach((header: string, idx: number) => {
        slide.addText(header, {
          x: 0.84375 + idx * colW + 0.1, y: tableY, w: colW - 0.2, h: headerH,
          fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'middle',
        });
      });
    }
    rows.forEach((row: string[], rIdx: number) => {
      const y = tableY + headerH + rIdx * rowH;
      row.forEach((cell: string, cIdx: number) => {
        const isHighlight = props.highlightFirstColumn && cIdx === 0;
        slide.addText(cell ?? '', {
          x: 0.84375 + cIdx * colW + 0.1, y, w: colW - 0.2, h: rowH,
          fontSize: 12, color: isHighlight ? COLORS.primary : COLORS.secondary, bold: isHighlight,
          fontFace: FONTS.body, valign: 'middle',
        });
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TestimonialV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  const cardX = 0.84375;
  const cardW = 8.3125;
  const cardY = 1.65;
  const cardH = 3.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addText('“', {
    x: cardX + 0.35, y: cardY + 0.25, w: 0.8, h: 0.7,
    fontSize: 72, color: COLORS.accent, fontFace: FONTS.heading,
    valign: 'top',
  });
  slide.addText(props.quote ?? '', {
    x: cardX + 0.7, y: cardY + 0.55, w: cardW - 1.4, h: 1.6,
    fontSize: 26, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.avatarUrl) {
    try {
      slide.addImage({ path: props.avatarUrl, x: cardX + 0.7, y: cardY + 2.35, w: 0.7, h: 0.7 });
    } catch {
      slide.addShape('ellipse', {
        x: cardX + 0.7, y: cardY + 2.35, w: 0.7, h: 0.7,
        fill: { color: COLORS.border },
      } as any);
    }
  } else {
    slide.addShape('ellipse', {
      x: cardX + 0.7, y: cardY + 2.35, w: 0.7, h: 0.7,
      fill: { color: COLORS.border },
    } as any);
  }
  const metaY = cardY + 2.45;
  if (props.author) {
    slide.addText(props.author, {
      x: cardX + 1.6, y: metaY, w: 4, h: 0.3,
      fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.role || props.company) {
    slide.addText([props.role, props.company].filter(Boolean).join(' · '), {
      x: cardX + 1.6, y: metaY + 0.28, w: 4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TagsV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const tags = (props.tags || []).slice(0, 24);
  if (tags.length > 0) {
    const cardY = 2.8;
    const cardH = 2.55;
    addTheme02Card(slide, 0.84375, cardY, 8.3125, cardH, 0.08);
    const cols = 4;
    const rows = Math.ceil(tags.length / cols);
    const tagW = 1.9;
    const tagH = 0.34;
    const gapX = (8.3125 - cols * tagW) / (cols + 1);
    const gapY = (cardH - rows * tagH) / (rows + 1);
    tags.forEach((tag: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + gapX + col * (tagW + gapX);
      const y = cardY + gapY + row * (tagH + gapY);
      const label = typeof tag === 'string' ? tag : tag.label ?? '';
      const value = typeof tag === 'string' ? undefined : tag.value;
      const text = value ? `${label}  ${value}` : label;
      slide.addShape('roundRect', {
        x, y, w: tagW, h: tagH,
        fill: { color: COLORS.surfaceElevated }, line: { color: COLORS.border, width: 1 }, rectRadius: 0.06,
      } as any);
      slide.addText(text, {
        x: x + 0.08, y, w: tagW - 0.16, h: tagH,
        fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ProgressV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || [])
    .filter((item: any) => item != null)
    .map((item: any) => {
      const value = Number(item.value) || 0;
      const max = Number(item.max) || 100;
      const pct = max > 0 ? Math.min(100, Math.round((value / max) * 1000) / 10) : 0;
      return { ...item, value, max, pct };
    })
    .slice(0, 6);
  if (items.length > 0) {
    const cardY = 2.8;
    const cardH = 2.55;
    addTheme02Card(slide, 0.84375, cardY, 8.3125, cardH, 0.08);
    const itemH = cardH / items.length;
    items.forEach((item: any, idx: number) => {
      const y = cardY + idx * itemH;
      const labelY = y + 0.12;
      slide.addText(item.label ?? '', {
        x: 0.99375, y: labelY, w: 4, h: 0.28,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(`${item.value}${item.unit ?? ''}`, {
        x: 5.5, y: labelY, w: 1.2, h: 0.28,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      slide.addText(`${item.pct}%`, {
        x: 6.8, y: labelY, w: 1.2, h: 0.28,
        fontSize: 13, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      const barY = y + 0.45;
      const barH = 0.1;
      const barW = 8.0125;
      slide.addShape('roundRect', {
        x: 0.99375, y: barY, w: barW, h: barH,
        fill: { color: COLORS.border }, rectRadius: 0.05,
      } as any);
      if (item.pct > 0) {
        slide.addShape('roundRect', {
          x: 0.99375, y: barY, w: barW * (item.pct / 100), h: barH,
          fill: { color: COLORS.accent }, rectRadius: 0.05,
        } as any);
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03FaqV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 8);
  if (items.length > 0) {
    const cols = 2;
    const rows = Math.ceil(items.length / cols);
    const gapX = 0.28;
    const gapY = 0.22;
    const cardW = (8.3125 - gapX) / cols;
    const cardH = rows <= 2 ? 1.35 : 1.05;
    const startY = 2.85;
    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('rect', {
        x, y, w: 0.06, h: cardH,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText('Q', {
        x: x + 0.12, y: y + 0.12, w: 0.22, h: 0.22,
        fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      slide.addText(item.q ?? '', {
        x: x + 0.4, y: y + 0.1, w: cardW - 0.55, h: 0.28,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText('A', {
        x: x + 0.12, y: y + 0.42, w: 0.22, h: 0.2,
        fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      slide.addText(item.a ?? '', {
        x: x + 0.4, y: y + 0.42, w: cardW - 0.55, h: cardH - 0.58,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ProcessV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const steps = (props.steps || []).filter((s: any) => s != null);
  if (steps.length > 0) {
    const items = steps.slice(0, 6);
    const count = items.length;
    const gap = 0.22;
    const cardW = (8.3125 - gap * (count - 1)) / count;
    const cardH = 1.95;
    const startY = 2.9;
    items.forEach((step: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.12, y: startY + 0.12, w: 0.5, h: 0.28,
        fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'top',
      });
      slide.addText(step.title ?? '', {
        x: x + 0.12, y: startY + 0.44, w: cardW - 0.24, h: 0.35,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(step.description ?? '', {
        x: x + 0.12, y: startY + 0.84, w: cardW - 0.24, h: cardH - 1.0,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
      if (idx < items.length - 1) {
        slide.addShape('line', {
          x1: x + cardW + 0.02, y1: startY + cardH / 2, x2: x + cardW + gap - 0.02, y2: startY + cardH / 2,
          line: { color: COLORS.accent, width: 2 },
        });
        slide.addShape('triangle', {
          x: x + cardW + gap - 0.08, y: startY + cardH / 2 - 0.08, w: 0.16, h: 0.16,
          fill: { color: COLORS.accent },
        } as any);
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TimelineV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const milestones = (props.milestones || []).filter((m: any) => m != null && !!(m.date || m.title)).slice(0, 6);
  if (milestones.length > 0) {
    const count = milestones.length;
    const stepWidth = 8.3125 / count;
    const lineY = 3.55;
    slide.addShape('line', {
      x1: 0.84375, y1: lineY, x2: 9.15625, y2: lineY,
      line: { color: COLORS.border, width: 2 },
    });
    milestones.forEach((m: any, idx: number) => {
      const cx = 0.84375 + stepWidth * idx + stepWidth / 2;
      const isTop = idx % 2 === 0;
      const cardW = Math.min(stepWidth - 0.2, 2.0);
      const cardH = 1.15;
      const cardY = isTop ? lineY - 1.35 : lineY + 0.35;
      slide.addShape('ellipse', {
        x: cx - 0.12, y: lineY - 0.12, w: 0.24, h: 0.24,
        fill: { color: COLORS.accent },
      });
      slide.addText(m.date ?? '', {
        x: cx - stepWidth / 2 + 0.05, y: isTop ? lineY + 0.35 : lineY - 0.65, w: stepWidth - 0.1, h: 0.3,
        fontSize: 11, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      addTheme02Card(slide, cx - cardW / 2, cardY, cardW, cardH, 0.08);
      slide.addText(m.title ?? '', {
        x: cx - cardW / 2 + 0.1, y: cardY + 0.1, w: cardW - 0.2, h: 0.3,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
      });
      slide.addText(m.description ?? '', {
        x: cx - cardW / 2 + 0.1, y: cardY + 0.44, w: cardW - 0.2, h: cardH - 0.58,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03RoadmapV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const phases = (props.phases || []).filter((p: any) => p != null && !!(p.phase || (p.items && p.items.length > 0))).slice(0, 6);
  if (phases.length > 0) {
    const count = phases.length;
    const gap = 0.22;
    const cardW = (8.3125 - gap * (count - 1)) / count;
    const cardH = 2.05;
    const startY = 2.9;
    phases.forEach((phase: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x: x + cardW / 2 - 0.22, y: startY - 0.18, w: 0.44, h: 0.36,
        fill: { color: COLORS.accent }, rectRadius: 0.18,
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + cardW / 2 - 0.22, y: startY - 0.18, w: 0.44, h: 0.36,
        fontSize: 12, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      slide.addText(phase.phase ?? '', {
        x: x + 0.12, y: startY + 0.28, w: cardW - 0.24, h: 0.35,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
      });
      const items = (phase.items || []).filter((i: any) => i != null).slice(0, 5);
      items.forEach((item: any, itemIdx: number) => {
        const value = typeof item === 'string' ? item : (item.value ?? '');
        slide.addText('• ' + value, {
          x: x + 0.12, y: startY + 0.72 + itemIdx * 0.24, w: cardW - 0.24, h: 0.22,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      });
      if (idx < phases.length - 1) {
        slide.addShape('line', {
          x1: x + cardW + 0.02, y1: startY + cardH / 2, x2: x + cardW + gap - 0.02, y2: startY + cardH / 2,
          line: { color: COLORS.accent, width: 2 },
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03SwotV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const cells = [
    { key: 'S', subtitle: '优势', value: props.strength ?? '' },
    { key: 'W', subtitle: '劣势', value: props.weakness ?? '' },
    { key: 'O', subtitle: '机会', value: props.opportunity ?? '' },
    { key: 'T', subtitle: '威胁', value: props.threat ?? '' },
  ];
  const positions = [
    { x: 0.84375, y: 2.85 },
    { x: 5.15625, y: 2.85 },
    { x: 0.84375, y: 4.25 },
    { x: 5.15625, y: 4.25 },
  ];
  cells.forEach((cell, idx) => {
    const pos = positions[idx];
    addTheme02Card(slide, pos.x, pos.y, 4.0, 1.25, 0.08);
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 0.06, h: 1.25,
      fill: { color: COLORS.accent },
    } as any);
    slide.addText(cell.key, {
      x: pos.x + 0.12, y: pos.y + 0.1, w: 0.35, h: 0.32,
      fontSize: 18, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'left', valign: 'top',
    });
    slide.addText(cell.subtitle, {
      x: pos.x + 0.5, y: pos.y + 0.12, w: 1.5, h: 0.28,
      fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
    });
    slide.addText(cell.value, {
      x: pos.x + 0.12, y: pos.y + 0.48, w: 3.76, h: 0.68,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03MetricV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  const value = props.value ?? '';
  const unit = props.unit ?? '';
  const valueWidth = value.length > 4 ? 5.0 : 3.5;
  slide.addText(value, {
    x: 0.84375, y: 2.2, w: valueWidth, h: 1.1,
    fontSize: 88, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
  });
  if (unit) {
    slide.addText(unit, {
      x: 0.84375 + valueWidth + 0.1, y: 2.8, w: 1.5, h: 0.4,
      fontSize: 24, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.84375, y: 3.45, w: 6.0, h: 0.7,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const metrics = (props.metrics || []).filter((m: any) => m != null).slice(0, 6);
  if (metrics.length > 0) {
    const cols = Math.min(metrics.length, 3);
    const rows = Math.ceil(metrics.length / cols);
    const gap = 0.24;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = rows === 1 ? 2.4 : 1.1;
    const startY = 2.85;
    metrics.forEach((metric: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addText(`${metric.value ?? ''}${metric.unit ?? ''}`, {
        x: x + 0.15, y: y + 0.18, w: cardW - 0.3, h: 0.45,
        fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      if (metric.change) {
        slide.addText(metric.change, {
          x: x + cardW - 0.95, y: y + 0.2, w: 0.8, h: 0.25,
          fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
        });
      }
      slide.addText(metric.label ?? '', {
        x: x + 0.15, y: y + cardH - 0.45, w: cardW - 0.3, h: 0.3,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  const cardX = 0.84375;
  const cardW = 8.3125;
  const cardY = 2.5;
  const cardH = 2.0;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.08);
  slide.addShape('roundRect', {
    x: cardX + 0.25, y: cardY + 0.45, w: 0.9, h: 0.9,
    fill: { color: COLORS.accent }, rectRadius: 0.12,
  } as any);
  slide.addText(props.icon ?? '01', {
    x: cardX + 0.25, y: cardY + 0.55, w: 0.9, h: 0.7,
    fontSize: 28, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
  });
  slide.addText(`${props.value ?? ''}${props.unit ?? ''}`, {
    x: cardX + 1.4, y: cardY + 0.35, w: 6.0, h: 0.7,
    fontSize: 54, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.description) {
    slide.addText(props.description, {
      x: cardX + 1.4, y: cardY + 1.1, w: 6.2, h: 0.7,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03MetricTriptych(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const panels = (props.panels || []).filter((p: any) => p != null).slice(0, 3);
  if (panels.length > 0) {
    const count = panels.length;
    const gap = 0.24;
    const cardW = (8.3125 - gap * (count - 1)) / count;
    const cardH = 2.4;
    const startY = 2.8;
    panels.forEach((panel: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addText(panel.index ?? String(idx + 1).padStart(2, '0'), {
        x: x + 0.12, y: startY + 0.12, w: 0.6, h: 0.25,
        fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, valign: 'top',
      });
      slide.addText(panel.title ?? '', {
        x: x + 0.75, y: startY + 0.12, w: cardW - 0.9, h: 0.3,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(`${panel.value ?? ''}`, {
        x: x + 0.12, y: startY + 0.55, w: cardW - 0.24, h: 0.55,
        fontSize: 32, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      const data = (panel.chartData || []).filter((v: any) => typeof v === 'number').slice(0, 8);
      if (data.length >= 2) {
        const chartY = startY + 1.2;
        const chartH = 0.55;
        const max = Math.max(...data, 1);
        const step = (cardW - 0.34) / data.length;
        const barW = step * 0.6;
        data.forEach((v: number, i: number) => {
          const h = chartH * (v / max);
          slide.addShape('roundRect', {
            x: x + 0.12 + i * step + (step - barW) / 2,
            y: chartY + chartH - h,
            w: barW,
            h: Math.max(h, 0.05),
            fill: { color: COLORS.accent },
            rectRadius: 0.02,
          } as any);
        });
      }
      if (panel.subtitle) {
        slide.addText(panel.subtitle, {
          x: x + 0.12, y: startY + cardH - 0.45, w: cardW - 0.24, h: 0.35,
          fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ScorecardV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 8);
  if (items.length > 0) {
    const cols = items.length > 4 ? 2 : 1;
    const gapX = 0.4;
    const gapY = 0.28;
    const colW = (8.3125 - gapX * (cols - 1)) / cols;
    const rows = Math.ceil(items.length / cols);
    const rowH = (2.6 - gapY * (rows - 1)) / rows;
    const startY = 2.8;
    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (colW + gapX);
      const y = startY + row * (rowH + gapY);
      const score = Number(item.score) || 0;
      const max = Number(item.max) || 100;
      const pct = max > 0 ? Math.min(100, Math.max(0, (score / max) * 100)) : 0;
      slide.addText(item.label ?? '', {
        x, y, w: colW - 1.2, h: 0.25,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(`${score} / ${max}`, {
        x: x + colW - 1.1, y, w: 1.1, h: 0.25,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      slide.addShape('roundRect', {
        x, y: y + 0.32, w: colW, h: 0.08,
        fill: { color: COLORS.border }, rectRadius: 0.04,
      } as any);
      if (pct > 0) {
        slide.addShape('roundRect', {
          x, y: y + 0.32, w: colW * (pct / 100), h: 0.08,
          fill: { color: COLORS.accent }, rectRadius: 0.04,
        } as any);
      }
      if (item.note) {
        slide.addText(item.note, {
          x, y: y + 0.5, w: colW, h: rowH - 0.6,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03AppendixV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const sources = (props.sources || []).filter((s: any) => s != null).slice(0, 10);
  if (sources.length > 0) {
    const startY = 2.85;
    sources.forEach((source: any, idx: number) => {
      const y = startY + idx * 0.34;
      slide.addShape('line', {
        x1: 0.84375, y1: y + 0.32, x2: 9.15625, y2: y + 0.32,
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(source.label ?? '', {
        x: 0.84375, y, w: 2.5, h: 0.25,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(source.value ?? '', {
        x: 3.5, y, w: 5.5, h: 0.25,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03CaseStudy(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.3,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const leftW = 5.0;
  if (props.intro) {
    slide.addText(props.intro, {
      x: 0.84375, y: 2.7, w: leftW, h: 0.7,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const rounds = (props.rounds || []).filter((r: any) => r != null && !!(r.date || r.round || r.amount)).slice(0, 6);
  if (rounds.length > 0) {
    const startY = 3.55;
    rounds.forEach((round: any, idx: number) => {
      const y = startY + idx * 0.5;
      slide.addShape('ellipse', {
        x: 0.84375, y: y + 0.05, w: 0.12, h: 0.12,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(round.date ?? '', {
        x: 1.05, y, w: 1.0, h: 0.2,
        fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono, valign: 'top',
      });
      slide.addText(round.round ?? '', {
        x: 1.05, y: y + 0.2, w: 1.8, h: 0.22,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(round.valuation ?? '', {
        x: 3.0, y: y + 0.05, w: 1.3, h: 0.2,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(round.amount ?? '', {
        x: 3.0, y: y + 0.25, w: 1.3, h: 0.22,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.mono, valign: 'top',
      });
    });
  }
  if (props.quote) {
    const cardX = 6.0;
    const cardY = 2.7;
    const cardW = 3.15625;
    const cardH = 1.9;
    addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.08);
    slide.addText('“', {
      x: cardX + 0.15, y: cardY + 0.1, w: 0.5, h: 0.4,
      fontSize: 36, color: COLORS.accent, fontFace: FONTS.heading, valign: 'top',
    });
    slide.addText(props.quote, {
      x: cardX + 0.25, y: cardY + 0.45, w: cardW - 0.45, h: 1.0,
      fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
    });
    if (props.quoteAuthor) {
      slide.addText(`—— ${props.quoteAuthor}`, {
        x: cardX + 0.25, y: cardY + cardH - 0.4, w: cardW - 0.45, h: 0.25,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
      });
    }
  }
  addTheme03Footer(slide, props);
}

function renderTheme03OutlookV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 3);
  if (items.length > 0) {
    const cols = items.length;
    const gap = 0.24;
    const cardW = (8.3125 - gap * (cols - 1)) / cols;
    const cardH = 2.3;
    const startY = 2.85;
    items.forEach((item: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x: x + 0.12, y: startY + 0.12, w: 0.4, h: 0.4,
        fill: { color: COLORS.accent }, rectRadius: 0.2,
      } as any);
      slide.addText(String(idx + 1), {
        x: x + 0.12, y: startY + 0.15, w: 0.4, h: 0.34,
        fontSize: 14, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
      slide.addText(item.title ?? '', {
        x: x + 0.62, y: startY + 0.15, w: cardW - 0.8, h: 0.3,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(`趋势：${item.trend ?? ''}`, {
        x: x + 0.12, y: startY + 0.65, w: cardW - 0.24, h: 0.25,
        fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(`行动：${item.action ?? ''}`, {
        x: x + 0.12, y: startY + 0.95, w: cardW - 0.24, h: 1.0,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03RegionV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const regions = (props.regions || []).filter((r: any) => r != null).slice(0, 6);
  if (regions.length > 0) {
    const cols = Math.min(regions.length, 3);
    const rows = Math.ceil(regions.length / cols);
    const gap = 0.24;
    const cardW = (8.3125 - gap * (cols - 1)) / cols;
    const cardH = rows === 1 ? 2.3 : 1.05;
    const startY = 2.85;
    regions.forEach((region: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addText(region.name ?? '', {
        x: x + 0.15, y: y + 0.12, w: cardW - 0.55, h: 0.3,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(region.change ?? '', {
        x: x + cardW - 0.9, y: y + 0.14, w: 0.75, h: 0.25,
        fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      slide.addText(`${region.value ?? ''}`, {
        x: x + 0.15, y: y + cardH - 0.7, w: cardW - 0.3, h: 0.5,
        fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      if (region.note) {
        slide.addText(region.note, {
          x: x + 0.15, y: y + cardH - 0.32, w: cardW - 0.3, h: 0.3,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03RiskV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 4);
  if (items.length > 0) {
    const cols = Math.min(items.length, 2);
    const rows = Math.ceil(items.length / cols);
    const gap = 0.24;
    const cardW = (8.3125 - gap * (cols - 1)) / cols;
    const cardH = rows === 1 ? 2.3 : 1.05;
    const startY = 2.85;
    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('rect', {
        x, y, w: 0.06, h: cardH,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + cardW - 0.55, y: y + 0.1, w: 0.45, h: 0.22,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
      slide.addText(item.risk ?? '', {
        x: x + 0.15, y: y + 0.12, w: cardW - 0.7, h: 0.3,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(`影响：${item.impact ?? ''}`, {
        x: x + 0.15, y: y + 0.5, w: cardW - 0.3, h: 0.22,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
      slide.addText(`应对：${item.response ?? ''}`, {
        x: x + 0.15, y: y + 0.76, w: cardW - 0.3, h: cardH - 1.0,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03SpotlightGrid(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const columns = (props.columns || []).filter((c: any) => c != null).slice(0, 4);
  if (columns.length > 0) {
    const cols = columns.length <= 2 ? columns.length : 2;
    const rows = Math.ceil(columns.length / cols);
    const gapX = 0.24;
    const gapY = 0.24;
    const cardW = (8.3125 - gapX * (cols - 1)) / cols;
    const cardH = rows === 1 ? 2.6 : 1.25;
    const startY = 2.85;
    columns.forEach((col: any, idx: number) => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const x = 0.84375 + c * (cardW + gapX);
      const y = startY + r * (cardH + gapY);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      if (col.tag) {
        slide.addText(col.tag, {
          x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.22,
          fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'top',
        });
      }
      slide.addShape('roundRect', {
        x: x + 0.12,
        y: y + 0.36,
        w: cardW - 0.24,
        h: cardH - 0.9,
        fill: { color: COLORS.surface },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.06,
      } as any);
      slide.addText('（图片）', {
        x: x + 0.12,
        y: y + 0.36 + (cardH - 0.9) / 2 - 0.12,
        w: cardW - 0.24,
        h: 0.24,
        fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono, valign: 'middle',
      });
      slide.addText(col.title ?? '', {
        x: x + 0.12, y: y + cardH - 0.45, w: cardW - 0.24, h: 0.25,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ConclusionV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const points = (props.points || [])
    .map((p: any) => typeof p === 'string' ? p : p?.item)
    .filter(Boolean)
    .slice(0, 4);
  if (points.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }
  const count = points.length;
  const gap = 0.22;
  const cardW = (8.3125 - gap * (count - 1)) / count;
  const startX = 0.84375;
  const y = 2.85;
  const h = 2.55;
  points.forEach((point: string, idx: number) => {
    const x = startX + idx * (cardW + gap);
    addTheme02Card(slide, x, y, cardW, h, 0.08);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: 0.08,
      fill: { color: COLORS.accent }, rectRadius: 0.04,
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + 0.12, y: y + 0.14, w: 0.6, h: 0.32,
      fontSize: 18, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'top',
    });
    slide.addText(point, {
      x: x + 0.12, y: y + 0.58, w: cardW - 0.24, h: h - 0.74,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03DiptychContrast(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const left = props.left || {};
  const right = props.right || {};
  const centerCard = props.centerCard || {};
  const comparisons = (centerCard.comparisons || []).slice(0, 3);

  // 左右背景区
  const sideY = 2.85;
  const sideW = 2.5;
  const sideH = 2.55;
  addTheme02Card(slide, 0.84375, sideY, sideW, sideH, 0.08);
  addTheme02Card(slide, 6.65625, sideY, sideW, sideH, 0.08);
  if (left.imageUrl) {
    try {
      slide.addImage({ path: left.imageUrl, x: 0.94375, y: sideY + 0.1, w: sideW - 0.2, h: sideH - 0.9 });
    } catch {
      // ignore
    }
  }
  if (right.imageUrl) {
    try {
      slide.addImage({ path: right.imageUrl, x: 6.75625, y: sideY + 0.1, w: sideW - 0.2, h: sideH - 0.9 });
    } catch {
      // ignore
    }
  }
  slide.addText(left.labelEn || '', {
    x: 0.84375, y: sideY + 0.12, w: sideW, h: 0.22,
    fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.mono,
  });
  slide.addText(left.label || '', {
    x: 0.84375, y: sideY + sideH - 0.6, w: sideW, h: 0.45,
    fontSize: 18, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
  slide.addText(right.labelEn || '', {
    x: 6.65625, y: sideY + 0.12, w: sideW, h: 0.22,
    fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.mono,
  });
  slide.addText(right.label || '', {
    x: 6.65625, y: sideY + sideH - 0.6, w: sideW, h: 0.45,
    fontSize: 18, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });

  // 中央结论卡
  const centerX = 3.59375;
  const centerW = 2.8125;
  const centerH = 2.55;
  addTheme02Card(slide, centerX, sideY, centerW, centerH, 0.08);
  if (centerCard.title) {
    slide.addText(centerCard.title, {
      x: centerX + 0.12, y: sideY + 0.14, w: centerW - 0.24, h: 0.32,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });
  }
  comparisons.forEach((item: any, index: number) => {
    const y = sideY + 0.55 + index * 0.58;
    slide.addText(item.leftValue || '', {
      x: centerX + 0.12, y, w: 0.9, h: 0.22,
      fontSize: 13, color: COLORS.secondary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.heading,
    });
    slide.addText(item.leftLabel || '', {
      x: centerX + 0.12, y: y + 0.2, w: 0.9, h: 0.16,
      fontSize: 9, color: COLORS.secondary, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText('VS', {
      x: centerX + centerW / 2 - 0.25, y, w: 0.5, h: 0.22,
      fontSize: 10, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
    slide.addText(item.rightValue || '', {
      x: centerX + centerW - 1.02, y, w: 0.9, h: 0.22,
      fontSize: 13, color: COLORS.accent, bold: true, align: 'left', valign: 'middle', fontFace: FONTS.heading,
    });
    slide.addText(item.rightLabel || '', {
      x: centerX + centerW - 1.02, y: y + 0.2, w: 0.9, h: 0.16,
      fontSize: 9, color: COLORS.secondary, align: 'left', valign: 'middle', fontFace: FONTS.body,
    });
  });
  if (centerCard.conclusion) {
    slide.addText(centerCard.conclusion, {
      x: centerX + 0.12, y: sideY + centerH - 0.55, w: centerW - 0.24, h: 0.45,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03FilmstripV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const images = (props.images || []).slice(0, 5);
  if (images.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }
  const gap = 0.2;
  const frameW = (8.3125 - gap * (images.length - 1)) / images.length;
  const startX = 0.84375;
  const y = 2.85;
  const imgH = 2.0;
  images.forEach((image: any, index: number) => {
    const x = startX + index * (frameW + gap);
    addTheme02Card(slide, x, y, frameW, imgH + 0.5, 0.08);
    slide.addShape('roundRect', {
      x, y, w: frameW, h: 0.08,
      fill: { color: COLORS.accent }, rectRadius: 0.04,
    } as any);
    slide.addText(String(index + 1).padStart(2, '0'), {
      x: x + frameW - 0.55, y: y + 0.1, w: 0.45, h: 0.22,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right', valign: 'top',
    });
    if (image.url) {
      try {
        slide.addImage({ path: image.url, x: x + 0.08, y: y + 0.22, w: frameW - 0.16, h: imgH - 0.22 });
      } catch {
        slide.addText('（图片）', {
          x: x + 0.08, y: y + imgH / 2, w: frameW - 0.16, h: 0.3,
          fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
        });
      }
    }
    if (image.caption) {
      slide.addText(image.caption, {
        x, y: y + imgH + 0.08, w: frameW, h: 0.3,
        fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
    }
  });
  addTheme03Footer(slide, props);
}

function renderTheme03GanttV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const tasks = (props.tasks || []).slice(0, 8);
  const phases = (props.phases?.length ? props.phases : ['Q1', 'Q2', 'Q3', 'Q4']).slice(0, 6);
  const chartColors = ['00B4FF', 'FF2A6D', '8B5CF6', '8A8F99', '22D3EE', 'FF9F1C', 'FF7B54', '6B21A8'];
  const cardY = 2.85;
  const cardH = 2.55;
  addTheme02Card(slide, 0.84375, cardY, 8.3125, cardH, 0.08);
  if (tasks.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }

  const startX = 0.84375;
  const endX = 9.15625;
  const totalW = endX - startX;
  const headerY = cardY + 0.2;
  const bodyY = cardY + 0.65;
  const rowH = (cardH - 0.85) / Math.max(tasks.length, 1);
  const phaseW = totalW / phases.length;

  phases.forEach((phase: string, i: number) => {
    const x = startX + i * phaseW;
    slide.addText(phase, {
      x, y: headerY, w: phaseW, h: 0.3,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
    if (i > 0) {
      slide.addShape('line', {
        x1: x, y1: headerY, x2: x, y2: cardY + cardH - 0.1,
        line: { color: COLORS.border, width: 1 },
      });
    }
  });

  tasks.forEach((task: any, index: number) => {
    const y = bodyY + index * rowH;
    const start = Math.max(0, Math.min(100, task.start ?? 0));
    const end = Math.max(start, Math.min(100, task.end ?? 100));
    const barX = startX + (start / 100) * totalW;
    const barW = ((end - start) / 100) * totalW;
    const color = task.color ? task.color.replace('#', '') : chartColors[index % chartColors.length];
    slide.addText(task.name || '', {
      x: startX + 0.1, y, w: 1.8, h: rowH,
      fontSize: 11, color: COLORS.primary, align: 'left', valign: 'middle', fontFace: FONTS.body,
    });
    slide.addShape('rect', {
      x: Math.max(startX + 2.0, barX), y: y + rowH * 0.25, w: Math.max(0.04, barW), h: rowH * 0.5,
      fill: { color }, rectRadius: 0.04,
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03PestV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const cells = [
    { key: 'P', subtitle: '政治环境', value: props.political ?? '', color: COLORS.accent },
    { key: 'E', subtitle: '经济环境', value: props.economic ?? '', color: COLORS.secondary },
    { key: 'S', subtitle: '社会环境', value: props.social ?? '', color: '8B5CF6' },
    { key: 'T', subtitle: '技术环境', value: props.technological ?? '', color: '8A8F99' },
  ];
  const positions = [
    { x: 0.84375, y: 2.85 },
    { x: 5.15625, y: 2.85 },
    { x: 0.84375, y: 4.25 },
    { x: 5.15625, y: 4.25 },
  ];
  cells.forEach((cell, idx) => {
    const pos = positions[idx];
    addTheme02Card(slide, pos.x, pos.y, 4.0, 1.25, 0.08);
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 0.06, h: 1.25,
      fill: { color: cell.color },
    } as any);
    slide.addText(cell.key, {
      x: pos.x + 0.12, y: pos.y + 0.1, w: 0.35, h: 0.32,
      fontSize: 18, color: cell.color, bold: true, fontFace: FONTS.mono, align: 'left', valign: 'top',
    });
    slide.addText(cell.subtitle, {
      x: pos.x + 0.5, y: pos.y + 0.12, w: 1.5, h: 0.28,
      fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
    });
    slide.addText(cell.value, {
      x: pos.x + 0.12, y: pos.y + 0.48, w: 3.76, h: 0.68,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03StatsV1(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const stats = (props.stats || []).filter((s: any) => s != null).slice(0, 6);
  if (stats.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }
  const cols = Math.min(stats.length, 3);
  const rows = Math.ceil(stats.length / cols);
  const gap = 0.24;
  const cardW = (8.3125 - (cols - 1) * gap) / cols;
  const cardH = rows === 1 ? 2.55 : 1.15;
  const startY = 2.85;
  stats.forEach((stat: any, idx: number) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = 0.84375 + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    addTheme02Card(slide, x, y, cardW, cardH, 0.08);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: 0.08,
      fill: { color: COLORS.accent }, rectRadius: 0.04,
    } as any);
    slide.addText(`${stat.value ?? ''}${stat.unit ?? ''}`, {
      x: x + 0.12, y: y + 0.14, w: cardW - 0.24, h: 0.45,
      fontSize: 26, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
    });
    if (stat.change) {
      slide.addText(stat.change, {
        x: x + cardW - 0.95, y: y + 0.16, w: 0.8, h: 0.25,
        fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right', valign: 'top',
      });
    }
    slide.addText(stat.label ?? '', {
      x: x + 0.12, y: y + cardH - 0.42, w: cardW - 0.24, h: 0.28,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03TableData(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const columns = (props.columns || []).filter((c: any) => c.key && c.label);
  const rows = (props.rows || []).filter((r: any) => r != null).slice(0, 12);
  const effectiveHighlightRow = props.highlightRow ?? (Array.isArray(props.highlightRows) && props.highlightRows.length ? props.highlightRows[0] : undefined);

  const tableY = 2.85;
  const tableH = 2.55;
  addTheme02Card(slide, 0.84375, tableY, 8.3125, tableH, 0.08);

  if (columns.length === 0 || rows.length === 0) {
    addTheme03Footer(slide, props);
    return;
  }

  const tableW = 8.3125;
  const startX = 0.84375;
  const headerH = 0.42;
  const rowH = (tableH - headerH) / Math.max(rows.length, 1);
  const colW = tableW / columns.length;

  columns.forEach((column: any, index: number) => {
    const x = startX + index * colW;
    slide.addText(column.label || '', {
      x: x + 0.1, y: tableY, w: colW - 0.2, h: headerH,
      fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: column.align || 'left', valign: 'middle',
    });
  });

  rows.forEach((row: any, rowIndex: number) => {
    const y = tableY + headerH + rowIndex * rowH;
    const isHighlight = effectiveHighlightRow === rowIndex;
    columns.forEach((column: any, colIndex: number) => {
      const x = startX + colIndex * colW;
      slide.addText(row[column.key || ''] ?? '', {
        x: x + 0.1, y, w: colW - 0.2, h: rowH,
        fontSize: 11, color: isHighlight ? COLORS.accent : COLORS.secondary,
        bold: isHighlight,
        align: column.align || 'left', valign: 'middle', fontFace: FONTS.body,
      });
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03ChapterV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(props.number ?? String(props._slideIdx ?? 1).padStart(2, '0'), {
    x: 0.84375, y: 1.55, w: 2.6, h: 1.5,
    fontSize: 120, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 3.6, y: 1.7, w: 5.5, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 3.6, y: props.kicker ? 2.0 : 1.7, w: 5.5, h: 1.0,
    fontSize: 46, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 3.6, y: 3.05, w: 5.0, h: 0.7,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ChapterV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: '05080D', transparency: 55 },
  } as any);
  const cardW = 6.5;
  const cardH = 2.4;
  const cardX = 0.84375;
  const cardY = 2.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 3 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: cardX + 0.25, y: cardY + 0.25, w: cardW - 0.5, h: 0.22,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: cardX + 0.25, y: cardY + (props.kicker ? 0.55 : 0.25), w: cardW - 0.5, h: 0.9,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: cardX + 0.25, y: cardY + 1.55, w: cardW - 0.5, h: 0.6,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ClosingV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  const centerX = 5.0;
  const cardW = 6.5;
  const cardH = 3.2;
  const cardX = centerX - cardW / 2;
  const cardY = 1.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 3 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: cardX + 0.3, y: cardY + 0.3, w: cardW - 0.6, h: 0.22,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, align: 'center',
    });
  }
  slide.addText(theme03TitleText(props.title ?? '感谢阅读'), {
    x: cardX + 0.3, y: cardY + (props.kicker ? 0.65 : 0.3), w: cardW - 0.6, h: 0.9,
    fontSize: 48, fontFace: FONTS.heading, align: 'center', valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: cardX + 0.5, y: cardY + 1.6, w: cardW - 1.0, h: 0.5,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
    });
  }
  if (props.cta) {
    slide.addText(props.cta, {
      x: cardX + 2.0, y: cardY + 2.2, w: 2.5, h: 0.35,
      fontSize: 13, color: COLORS.white, fill: { color: COLORS.accent },
      align: 'center', valign: 'middle', fontFace: FONTS.body,
    } as any);
  }
  const contacts = [props.contact, props.email, props.link].filter(Boolean).join('  ·  ');
  if (contacts) {
    slide.addText(contacts, {
      x: cardX + 0.3, y: cardY + 2.75, w: cardW - 0.6, h: 0.22,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center', valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ComparisonV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const cards = (props.cards || []).slice(0, 4);
  if (cards.length > 0) {
    const cols = cards.length <= 2 ? 2 : Math.min(cards.length, 4);
    const rows = Math.ceil(cards.length / cols);
    const gap = 0.25;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = rows === 1 ? 2.4 : 1.5;
    const startY = 2.85;
    cards.forEach((card: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.84375 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      addTheme02Card(slide, x, y, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      slide.addText(card.label ?? '', {
        x: x + 0.15, y: y + 0.18, w: cardW - 0.3, h: 0.3,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      const score = typeof card.score === 'number' ? card.score : Number(card.score) || 0;
      const max = (typeof card.max === 'number' && card.max > 0) ? card.max : Number(card.max) || 100;
      slide.addText(`${score} / ${max}`, {
        x: x + 0.15, y: y + 0.55, w: cardW - 0.3, h: 0.35,
        fontSize: 28, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      const pct = Math.min(100, Math.max(0, (score / max) * 100));
      addTheme02Card(slide, x + 0.15, y + 0.98, cardW - 0.3, 0.1, 0.05);
      slide.addShape('roundRect', {
        x: x + 0.15, y: y + 0.98, w: (cardW - 0.3) * (pct / 100), h: 0.1,
        fill: { color: COLORS.accent }, rectRadius: 0.05,
      } as any);
      if (card.note) {
        slide.addText(card.note, {
          x: x + 0.15, y: y + 1.2, w: cardW - 0.3, h: cardH - 1.35,
          fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ComparisonV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const rows = (props.rows || []).slice(0, 6);
  if (rows.length > 0) {
    const tableY = 2.85;
    const tableH = 2.5;
    const tableW = 8.3125;
    const rowH = tableH / (rows.length + 1);
    const colW = tableW / 3;
    addTheme02Card(slide, 0.84375, tableY, tableW, tableH, 0.08);
    const headers = ['维度', props.leftTitle ?? '方案 A', props.rightTitle ?? '方案 B'];
    headers.forEach((header: string, idx: number) => {
      slide.addText(header, {
        x: 0.84375 + idx * colW + 0.1, y: tableY, w: colW - 0.2, h: rowH,
        fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: idx === 0 ? 'left' : 'center', valign: 'middle',
      });
    });
    rows.forEach((row: any, rowIndex: number) => {
      const y = tableY + (rowIndex + 1) * rowH;
      [row.feature, row.left, row.right].forEach((cell: any, idx: number) => {
        slide.addText(cell ?? '', {
          x: 0.84375 + idx * colW + 0.1, y, w: colW - 0.2, h: rowH,
          fontSize: 12, color: idx === 0 ? COLORS.primary : COLORS.secondary,
          bold: idx === 0,
          align: idx === 0 ? 'left' : 'center', valign: 'middle', fontFace: FONTS.body,
        });
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ContentV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const left = (props.leftPoints || []).slice(0, 6);
  const right = (props.rightPoints || []).slice(0, 6);
  const colW = 3.9;
  const colH = 2.5;
  const startY = 2.85;
  const gap = 0.5;
  [left, right].forEach((points, colIdx) => {
    const x = 0.84375 + colIdx * (colW + gap);
    addTheme02Card(slide, x, startY, colW, colH, 0.08);
    slide.addText(points.map((p: any) => `• ${p}`).join('\n'), {
      x: x + 0.2, y: startY + 0.2, w: colW - 0.4, h: colH - 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme03Footer(slide, props);
}

function renderTheme03ContentV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const columns = (props.columns || []).slice(0, 3);
  if (columns.length > 0) {
    const colW = (8.3125 - (columns.length - 1) * 0.25) / columns.length;
    const startY = 2.85;
    columns.forEach((col: any, idx: number) => {
      const x = 0.84375 + idx * (colW + 0.25);
      addTheme02Card(slide, x, startY, colW, 2.4, 0.08);
      slide.addShape('roundRect', {
        x, y: startY, w: colW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      slide.addText(col.title ?? '', {
        x: x + 0.15, y: startY + 0.2, w: colW - 0.3, h: 0.35,
        fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      if (col.text) {
        slide.addText(col.text, {
          x: x + 0.15, y: startY + 0.65, w: colW - 0.3, h: 1.6,
          fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03ContentV4(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  const cardW = 8.3125;
  const cardH = 3.0;
  const cardX = 0.84375;
  const cardY = 1.6;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 4 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: cardX + 0.3, y: cardY + 0.3, w: cardW - 0.6, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: cardX + 0.3, y: cardY + (props.kicker ? 0.65 : 0.3), w: cardW - 0.6, h: 1.4,
    fontSize: 54, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: cardX + 0.3, y: cardY + 2.1, w: cardW - 0.6, h: 0.6,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03CoverV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  if (props.image) {
    addImageMaybe(slide, props.image, 0, 0, 10, 5.625);
  }
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: '05080D', transparency: 50 },
  } as any);
  const cardW = 5.2;
  const cardH = 3.2;
  const cardX = 0.84375;
  const cardY = 1.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 4 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: cardX + 0.25, y: cardY + 0.25, w: cardW - 0.5, h: 0.22,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: cardX + 0.25, y: cardY + (props.kicker ? 0.55 : 0.25), w: cardW - 0.5, h: 1.2,
    fontSize: 48, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: cardX + 0.25, y: cardY + 1.85, w: cardW - 0.5, h: 0.6,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.date) {
    slide.addText(props.date, {
      x: cardX + 0.25, y: cardY + 2.65, w: cardW - 0.5, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03CoverV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  const mainW = 5.4;
  const mainH = 3.2;
  const mainX = 0.84375;
  const mainY = 1.4;
  addTheme02Card(slide, mainX, mainY, mainW, mainH, 0.12);
  slide.addShape('line', {
    x1: mainX, y1: mainY, x2: mainX, y2: mainY + mainH,
    line: { color: COLORS.accent, width: 4 },
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: mainX + 0.25, y: mainY + 0.25, w: mainW - 0.5, h: 0.22,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: mainX + 0.25, y: mainY + (props.kicker ? 0.55 : 0.25), w: mainW - 0.5, h: 1.4,
    fontSize: 44, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: mainX + 0.25, y: mainY + 2.0, w: mainW - 0.5, h: 0.8,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const bentoW = 2.5;
  const bentoH = 1.5;
  const bentoX = mainX + mainW + 0.25;
  addTheme02Card(slide, bentoX, mainY, bentoW, bentoH, 0.08);
  slide.addText(props.presenter ?? 'lemonPPT Research', {
    x: bentoX + 0.15, y: mainY + 0.55, w: bentoW - 0.3, h: 0.4,
    fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.body, align: 'center', valign: 'middle',
  });
  addTheme02Card(slide, bentoX, mainY + bentoH + 0.2, bentoW, bentoH, 0.08);
  slide.addText([props.date, 'Theme 03'].filter(Boolean).join(' · '), {
    x: bentoX + 0.15, y: mainY + bentoH + 0.75, w: bentoW - 0.3, h: 0.4,
    fontSize: 13, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center', valign: 'middle',
  });
  addTheme03Footer(slide, props);
}

function renderTheme03CoverV4(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(props.kicker || 'FEATURED STORY', {
    x: 0.84375, y: 1.55, w: 4.0, h: 0.25,
    fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
  });
  slide.addText(props.edition || 'ED. 01', {
    x: 5.5, y: 1.55, w: 3.5, h: 0.25,
    fontSize: 12, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right',
  });
  slide.addShape('line', {
    x1: 0.84375, y1: 1.85, x2: 9.15625, y2: 1.85,
    line: { color: COLORS.border, width: 1 },
  });
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 2.05, w: 8.3125, h: 1.4,
    fontSize: 72, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 3.55, w: 6.5, h: 0.6,
      fontSize: 16, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addText([props.date, 'lemonPPT'].filter(Boolean).join(' · '), {
    x: 0.84375, y: 4.5, w: 4.0, h: 0.25,
    fontSize: 12, color: COLORS.secondary, fontFace: FONTS.mono,
  });
  addTheme03Footer(slide, props);
}

function renderTheme03FeatureV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.35,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const imgW = 3.4;
  const imgH = 2.6;
  const imgX = 0.84375;
  const imgY = 2.75;
  addTheme02Card(slide, imgX, imgY, imgW, imgH, 0.08);
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, imgX + 0.1, imgY + 0.1, imgW - 0.2, imgH - 0.2);
  } else {
    slide.addText('点击上传图片', {
      x: imgX, y: imgY + imgH / 2 - 0.15, w: imgW, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
  const cardsX = imgX + imgW + 0.35;
  const cardsW = 4.6;
  const items = (props.items || []).slice(0, 5);
  if (items.length > 0) {
    const cardH = items.length <= 3 ? 0.75 : 0.6;
    const gap = 0.12;
    items.forEach((item: any, idx: number) => {
      const y = imgY + idx * (cardH + gap);
      addTheme02Card(slide, cardsX, y, cardsW, cardH, 0.06);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: cardsX + 0.12, y: y + 0.12, w: 0.6, h: 0.4,
        fontSize: 18, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
      });
      slide.addText(item.title ?? '', {
        x: cardsX + 0.8, y: y + 0.08, w: cardsW - 0.95, h: 0.25,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      if (item.description) {
        slide.addText(item.description, {
          x: cardsX + 0.8, y: y + 0.32, w: cardsW - 0.95, h: cardH - 0.42,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
  if (props.footer) {
    slide.addText(props.footer, {
      x: 0.84375, y: 5.05, w: 8.3125, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03QuoteV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText('“', {
    x: 0.84375, y: 1.4, w: 1.0, h: 1.0,
    fontSize: 100, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    valign: 'top',
  });
  const cardX = 1.9;
  const cardW = 7.25;
  const cardH = 3.2;
  const cardY = 1.4;
  addTheme02Card(slide, cardX, cardY, cardW, cardH, 0.12);
  slide.addShape('line', {
    x1: cardX, y1: cardY, x2: cardX, y2: cardY + cardH,
    line: { color: COLORS.accent, width: 3 },
  });
  slide.addText(theme03TitleText(props.quote ?? ''), {
    x: cardX + 0.25, y: cardY + 0.25, w: cardW - 0.5, h: 1.6,
    fontSize: 34, fontFace: FONTS.heading, valign: 'top',
  });
  const attrParts = [props.author, props.role, props.source].filter(Boolean).join(' / ');
  if (attrParts) {
    slide.addText(attrParts, {
      x: cardX + 0.25, y: cardY + 2.6, w: cardW - 0.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03QuoteV3(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.quote ?? ''), {
    x: 0.84375, y: 1.5, w: 8.3125, h: 2.0,
    fontSize: 56, fontFace: FONTS.heading, valign: 'top',
  });
  slide.addShape('line', {
    x1: 0.84375, y1: 3.65, x2: 2.5, y2: 3.65,
    line: { color: COLORS.accent, width: 2 },
  });
  const attrParts = [props.author, props.role].filter(Boolean).join(' / ');
  if (attrParts) {
    slide.addText(attrParts, {
      x: 0.84375, y: 3.85, w: 6.0, h: 0.3,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TableOfContentsV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? '目录'), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).slice(0, 8);
  if (items.length > 0) {
    const startY = 2.85;
    const rowH = 0.48;
    items.forEach((item: any, idx: number) => {
      const y = startY + idx * rowH;
      addTheme02Card(slide, 0.84375, y, 8.3125, 0.4, 0.06);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: 1.05, y: y + 0.08, w: 0.5, h: 0.24,
        fontSize: 13, color: COLORS.accent, bold: true, fontFace: FONTS.mono, valign: 'middle',
      });
      slide.addText(item ?? '', {
        x: 1.6, y: y + 0.08, w: 6.8, h: 0.24,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'middle',
      });
    });
  }
  addTheme03Footer(slide, props);
}

function renderTheme03TeamV2(slide: PptxSlide, props: any): void {
  addTheme03Topbar(slide, props);
  slide.addText(theme03TitleText(props.title ?? ''), {
    x: 0.84375, y: 1.45, w: 8.3, h: 0.8,
    fontSize: 40, fontFace: FONTS.heading, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.84375, y: 2.25, w: 7.5, h: 0.4,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const members = (props.members || []).filter((m: any) => m != null).slice(0, 3);
  if (members.length > 0) {
    const cols = members.length;
    const gap = 0.3;
    const cardW = (8.3125 - (cols - 1) * gap) / cols;
    const cardH = 2.6;
    const startY = 2.85;
    members.forEach((member: any, idx: number) => {
      const x = 0.84375 + idx * (cardW + gap);
      addTheme02Card(slide, x, startY, cardW, cardH, 0.08);
      slide.addShape('roundRect', {
        x, y: startY, w: cardW, h: 0.08,
        fill: { color: COLORS.accent }, rectRadius: 0.04,
      } as any);
      const avatarSize = 0.9;
      const avatarX = x + (cardW - avatarSize) / 2;
      const avatarY = startY + 0.2;
      if (member.imageUrl) {
        addImageMaybe(slide, member.imageUrl, avatarX, avatarY, avatarSize, avatarSize);
      } else {
        slide.addShape('ellipse', {
          x: avatarX, y: avatarY, w: avatarSize, h: avatarSize,
          fill: { color: COLORS.surfaceElevated }, line: { color: COLORS.border, width: 1 },
        } as any);
        slide.addText((member.name ?? '?').charAt(0), {
          x: avatarX, y: avatarY + 0.25, w: avatarSize, h: 0.4,
          fontSize: 24, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.heading,
        });
      }
      slide.addText(member.name ?? '', {
        x: x, y: avatarY + avatarSize + 0.12, w: cardW, h: 0.28,
        fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.body, align: 'center', valign: 'top',
      });
      slide.addText(member.role ?? '', {
        x: x, y: avatarY + avatarSize + 0.45, w: cardW, h: 0.22,
        fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, align: 'center', valign: 'top',
      });
      if (member.bio) {
        slide.addText(member.bio, {
          x: x + 0.12, y: avatarY + avatarSize + 0.75, w: cardW - 0.24, h: 0.8,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
        });
      }
    });
  }
  addTheme03Footer(slide, props);
}

type PptxRenderFn = (slide: PptxSlide, props: unknown) => void;

export function registerTheme03Renderers(registerPptxLayoutRenderer: (id: string, fn: PptxRenderFn) => void): void {
  registerPptxLayoutRenderer('theme03_cover_v1', renderTheme03CoverV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chapter_v1', renderTheme03ChapterV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_content_v1', renderTheme03ContentV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_metric_big', renderTheme03MetricBig as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_ranking_v1', renderTheme03RankingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_quote_v1', renderTheme03QuoteV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_case_v1', renderTheme03CaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_closing_v1', renderTheme03ClosingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_table_of_contents_v1', renderTheme03TableOfContentsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_metrics_v1', renderTheme03MetricsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_feature_v1', renderTheme03FeatureV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_image_v1', renderTheme03ImageV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_donut', renderTheme03ChartDonut as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_bar', renderTheme03ChartBar as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_v1', renderTheme03ChartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_trend_v1', renderTheme03TrendV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_radar', renderTheme03ChartRadar as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_funnel', renderTheme03ChartFunnel as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_gauge', renderTheme03ChartGauge as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_heatmap', renderTheme03ChartHeatmap as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_treemap', renderTheme03ChartTreemap as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_wordcloud', renderTheme03ChartWordcloud as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_bar3d', renderTheme03ChartBar3d as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_graph', renderTheme03ChartGraph as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_sankey', renderTheme03ChartSankey as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chart_sunburst', renderTheme03ChartSunburst as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_team_v1', renderTheme03TeamV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_partners_v1', renderTheme03PartnersV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_pricing_v1', renderTheme03PricingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_comparison_v1', renderTheme03ComparisonV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_faq_v1', renderTheme03FaqV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_gallery_v1', renderTheme03GalleryV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_number_showcase_v1', renderTheme03NumberShowcaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_bento_v1', renderTheme03BentoV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_quadrant_v1', renderTheme03QuadrantV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_table_v1', renderTheme03TableV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_testimonial_v1', renderTheme03TestimonialV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_tags_v1', renderTheme03TagsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_progress_v1', renderTheme03ProgressV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_process_v1', renderTheme03ProcessV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_timeline_v1', renderTheme03TimelineV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_roadmap_v1', renderTheme03RoadmapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_swot_v1', renderTheme03SwotV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_metric_v1', renderTheme03MetricV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_metric_v2', renderTheme03MetricV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_metric_v3', renderTheme03MetricV3 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_metric_triptych', renderTheme03MetricTriptych as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_scorecard_v1', renderTheme03ScorecardV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_appendix_v1', renderTheme03AppendixV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_case_study', renderTheme03CaseStudy as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_outlook_v1', renderTheme03OutlookV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_region_v1', renderTheme03RegionV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_risk_v1', renderTheme03RiskV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_spotlight_grid', renderTheme03SpotlightGrid as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_conclusion_v1', renderTheme03ConclusionV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_diptych_contrast', renderTheme03DiptychContrast as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_filmstrip_v1', renderTheme03FilmstripV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_gantt_v1', renderTheme03GanttV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_pest_v1', renderTheme03PestV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_stats_v1', renderTheme03StatsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_table_data', renderTheme03TableData as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chapter_v2', renderTheme03ChapterV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_chapter_v3', renderTheme03ChapterV3 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_closing_v2', renderTheme03ClosingV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_comparison_v2', renderTheme03ComparisonV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_comparison_v3', renderTheme03ComparisonV3 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_content_v2', renderTheme03ContentV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_content_v3', renderTheme03ContentV3 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_content_v4', renderTheme03ContentV4 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_cover_v2', renderTheme03CoverV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_cover_v3', renderTheme03CoverV3 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_cover_v4', renderTheme03CoverV4 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_feature_v2', renderTheme03FeatureV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_quote_v2', renderTheme03QuoteV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_quote_v3', renderTheme03QuoteV3 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_table_of_contents_v2', renderTheme03TableOfContentsV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme03_team_v2', renderTheme03TeamV2 as PptxRenderFn);
}
