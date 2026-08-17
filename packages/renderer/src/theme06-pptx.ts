// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme06 PPTX 版式专属渲染器（从 export-pptx.ts 抽出）。
// 共享基础设施（全局 helper + 通用渲染器 + 类型 + theme06 局部 helper/const）从 export-pptx.ts 导入；
// theme01 通用渲染器从 theme01-pptx.ts 复用；其他已抽出主题的渲染器从各自 theme<K>-pptx.ts 复用。
// 注册通过 registerTheme06Renderers 回调注入。

import { type Slide as PptxSlide } from 'pptxgenjs';
import { getLayoutCoordinates, renderElementFromConfig, COLORS, FONTS, addImageMaybe, addTheme06GlowLine, addTheme06Card, addTheme06FooterBilingual, addTheme06Badge, CHART_COLORS, addTheme06ProgressCard, addTheme06QuadrantGrid, addTheme06Bubble, addTheme06TimelineNode, addTheme06StepCard } from './export-pptx.js';
import type { Theme06CoverProps, Theme06BigNumberProps, Theme06ChapterProps, Theme06ClosingProps, Theme06TimelineProps, Theme06MilestoneProps, Theme06MetricShowcaseProps, Theme06RiskMatrixProps, Theme06SummaryProps, Theme06QuoteProps, Theme06ProcessProps, Theme06ListBasedProps, Theme06StatementProps, Theme06SourcesProps, Theme06CaseProps, Theme06TocProps, Theme06CoverVariantProps, Theme06ContentNumberedProps, Theme06MatrixProps, Theme06RankProps, Theme06ComparisonProps, Theme06BentoProps, Theme06TriadProps, Theme06TechLandscapeProps, Theme06ChainFlowProps, Theme06DealMapProps, Theme06SectorSpotlightProps, Theme06CompanyProfileProps, Theme06CompanySpotlightProps } from './export-pptx.js';

export function renderTheme06Cover(slide: PptxSlide, props: Theme06CoverProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);
  
  // Tag (kicker)
  if (props.tag && coords.kicker) {
    renderElementFromConfig(slide, props.tag, coords.kicker, {
      color: COLORS.accent,
      fontFace: FONTS.mono,
    });
  }
  
  // Title
  if (coords.title) {
    renderElementFromConfig(slide, props.title, coords.title, {
      color: COLORS.primary,
      fontFace: FONTS.heading,
    });
  }
  
  // Subtitle
  if (props.subtitle && coords.subtitle) {
    renderElementFromConfig(slide, props.subtitle, coords.subtitle, {
      color: COLORS.secondary,
      fontFace: FONTS.body,
    });
  }
  
  // Image
  if (props.imageUrl && coords.image) {
    addImageMaybe(slide, props.imageUrl, coords.image.x, coords.image.y, coords.image.w, coords.image.h);
  }
  
  // Metrics (in the aside)
  if (props.metrics && props.metrics.length > 0 && coords.metrics) {
    const m = coords.metrics;
    const gap = m.gap || 0.11;
    const itemW = m.itemW || 1.59;
    const itemH = m.itemH || 1.0;
    
    let row = 0;
    let col = 0;
    props.metrics.forEach((metric) => {
      const x = m.startX + col * (itemW + gap);
      const y = m.startY + row * (itemH + gap);
      const isAccent = metric.accent;
      
      // Card background
      slide.addShape('rect', {
        x, y, w: itemW, h: itemH,
        fill: { color: isAccent ? COLORS.accent : COLORS.surfaceSolid || COLORS.surface },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.06,
      } as any);
      
      // Value
      const valueText = metric.value + (metric.unit || '');
      if (metric.value) {
        slide.addText(valueText, {
          x: x + 0.14, y: y + 0.14, w: itemW - 0.28, h: itemH / 2,
          fontSize: m.value?.fontSize || 22,
          bold: m.value?.bold || true,
          color: isAccent ? COLORS.white : COLORS.primary,
          fontFace: FONTS.heading,
        });
      }
      
      // Label
      if (metric.label) {
        slide.addText(metric.label, {
          x: x + 0.14, y: y + itemH / 2 + 0.05, w: itemW - 0.28, h: itemH / 2 - 0.1,
          fontSize: m.label?.fontSize || 10,
          color: isAccent ? COLORS.white : COLORS.light,
          fontFace: FONTS.body,
        });
      }
      
      col++;
      if (col >= (m.gridCols || 2)) {
        col = 0;
        row++;
      }
    });
  }
  
  // Footnote
  const footerBottom = coords.footnote?.bottom ?? 0;
  const footerHeight = coords.footnote?.height ?? 0.33;
  const footerPaddingX = coords.footnote?.paddingX ?? 0.44;
  const footerFontSize = coords.footnote?.fontSize || 9;
  
  if (props.footnoteLeft) {
    slide.addText(props.footnoteLeft, {
      x: footerPaddingX, y: footerBottom, w: 4, h: footerHeight,
      fontSize: footerFontSize, color: COLORS.light, align: 'left', fontFace: FONTS.mono,
    });
  }
  if (props.footnoteRight) {
    slide.addText(props.footnoteRight, {
      x: 6, y: footerBottom, w: 4 - footerPaddingX, h: footerHeight,
      fontSize: footerFontSize, color: COLORS.light, align: 'right', fontFace: FONTS.mono,
    });
  }
  
  // Glow line
  const glowBottom = coords.glowLine?.bottom ?? 0.33;
  const glowHeight = coords.glowLine?.height ?? 0.015;
  slide.addShape('rect', {
    x: 0, y: glowBottom, w: 10, h: glowHeight,
    fill: { color: COLORS.accent },
  } as any);
}

export function renderTheme06BigNumber(slide: PptxSlide, props: Theme06BigNumberProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);
  
  // Kicker
  if (props.kicker && coords.kicker) {
    renderElementFromConfig(slide, props.kicker, coords.kicker, {
      color: COLORS.accent,
      fontFace: FONTS.mono,
    });
  }
  
  // Title
  if (props.title && coords.title) {
    renderElementFromConfig(slide, props.title, coords.title, {
      color: COLORS.primary,
      fontFace: FONTS.heading,
    });
  }
  
  // Big number
  if (props.number && coords.number) {
    renderElementFromConfig(slide, props.number, coords.number, {
      color: COLORS.accent,
      fontFace: FONTS.heading,
    });
  }
  
  // Unit
  if (props.unit && coords.unit) {
    renderElementFromConfig(slide, props.unit, coords.unit, {
      color: COLORS.secondary,
      fontFace: FONTS.heading,
    });
  }
  
  // Label
  if (props.label && coords.label) {
    renderElementFromConfig(slide, props.label, coords.label, {
      color: COLORS.secondary,
      fontFace: FONTS.body,
    });
  }
  
  // Description
  if (props.description && coords.description) {
    renderElementFromConfig(slide, props.description, coords.description, {
      color: COLORS.secondary,
      fontFace: FONTS.body,
    });
  }
  
  // Supporting metrics
  if (props.supporting && props.supporting.length > 0 && coords.supporting) {
    const supporting = coords.supporting;
    const gap = supporting.gap || 0.22;
    const itemW = supporting.itemW || 2.8;
    const itemH = supporting.itemH || 0.7;
    const totalWidth = props.supporting.length * itemW + (props.supporting.length - 1) * gap;
    const startX = (10 - totalWidth) / 2;
    let x = startX;
    let y = supporting.startY || 4.7;
    
    props.supporting.forEach((item) => {
      if (item.value) {
        slide.addText(item.value, {
          x, y, w: itemW, h: itemH / 2,
          fontSize: supporting.value?.fontSize || 22,
          bold: supporting.value?.bold || true,
          color: COLORS.accent,
          align: 'center',
          fontFace: FONTS.heading,
        });
      }
      if (item.label) {
        slide.addText(item.label, {
          x, y: y + itemH / 2, w: itemW, h: itemH / 2,
          fontSize: supporting.label?.fontSize || 10,
          color: COLORS.light,
          align: 'center',
          fontFace: FONTS.body,
        });
      }
      x += itemW + gap;
    });
  }
}

export function renderTheme06Chapter(slide: PptxSlide, props: Theme06ChapterProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }

  const topLeftLabel = props.topLeftLabel ?? (props.tag ? `[CH] ${props.tag}` : '[CH] CHAPTER');
  const topRightLabel = props.topRightLabel ?? (props.tag ? `章节 / ${props.tag}` : '章节 / SECTION');

  if (coords.topLeftLabel) {
    slide.addText(topLeftLabel, {
      x: coords.topLeftLabel.x, y: coords.topLeftLabel.y, w: 4.0, h: 0.25,
      fontSize: coords.topLeftLabel.fontSize || 11,
      color: COLORS.accent, fontFace: coords.topLeftLabel.fontFamily || FONTS.mono,
      bold: coords.topLeftLabel.bold ?? true,
    });
  }
  if (coords.topRightLabel) {
    slide.addText(topRightLabel, {
      x: coords.topRightLabel.x, y: coords.topRightLabel.y, w: 4.0, h: 0.25,
      fontSize: coords.topRightLabel.fontSize || 11,
      color: COLORS.secondary, fontFace: coords.topRightLabel.fontFamily || FONTS.mono,
      bold: coords.topRightLabel.bold ?? true,
      align: coords.topRightLabel.align || 'right',
    });
  }

  if (props.number && coords.number) {
    slide.addText(props.number, {
      x: coords.number.x, y: coords.number.y, w: coords.number.w || 8.7, h: coords.number.h || 1.55,
      fontSize: coords.number.fontSize || 130,
      color: COLORS.accent, bold: coords.number.bold ?? true,
      fontFace: coords.number.fontFamily || FONTS.heading,
      align: coords.number.align || 'left',
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.85,
      fontSize: coords.title.fontSize || 46,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.35,
      fontSize: coords.subtitle.fontSize || 15,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  if (props.enSubtitle && coords.enSubtitle) {
    slide.addText(props.enSubtitle, {
      x: coords.enSubtitle.x, y: coords.enSubtitle.y, w: coords.enSubtitle.w || 8.7, h: coords.enSubtitle.h || 0.28,
      fontSize: coords.enSubtitle.fontSize || 11,
      color: COLORS.secondary,
      fontFace: coords.enSubtitle.fontFamily || FONTS.mono,
    });
  }

  const tags = (props.tags || []).map((t) => typeof t === 'string' ? t : t.item ?? '').filter(Boolean).slice(0, coords.tags?.maxItems || 6);
  if (tags.length > 0) {
    let tagX = 0.65;
    const tagY = coords.tags?.y || 4.78;
    const tagH = 0.32;
    tags.forEach((tag) => {
      const tagW = Math.min(1.6, (tag.length * 0.13) + 0.35);
      slide.addShape('roundRect', {
        x: tagX, y: tagY, w: tagW, h: tagH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: tagH / 2,
      } as any);
      slide.addText(tag, {
        x: tagX, y: tagY + 0.02, w: tagW, h: tagH - 0.04,
        fontSize: 9, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle',
        fontFace: FONTS.mono,
      });
      tagX += tagW + 0.12;
    });
  }

  if (props.nextHint && coords.nextHint) {
    slide.addText(props.nextHint, {
      x: coords.nextHint.x, y: coords.nextHint.y, w: coords.nextHint.w || 3.85, h: coords.nextHint.h || 0.32,
      fontSize: coords.nextHint.fontSize || 10,
      color: COLORS.accent,
      align: coords.nextHint.align || 'right',
      fontFace: coords.nextHint.fontFamily || FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Closing(slide: PptxSlide, props: Theme06ClosingProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.95,
      fontSize: coords.title.fontSize || 48,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.35,
      fontSize: coords.subtitle.fontSize || 15,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const links = (props.links || []).slice(0, 3);
  if (links.length > 0 && coords.links) {
    const lx = coords.links.startX || 0.65;
    const ly = coords.links.y || 3.45;
    const lgap = coords.links.gap || 0.3;
    const lcardW = coords.links.cardW || 2.7;
    const lcardH = coords.links.cardH || 1.0;
    links.forEach((link, idx) => {
      const x = lx + idx * (lcardW + lgap);
      addTheme06Card(slide, x, ly, lcardW, lcardH);
      slide.addText(link.label ?? '', {
        x: x + 0.12, y: ly + 0.12, w: lcardW - 0.24, h: 0.22,
        fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
      slide.addText(link.value ?? '', {
        x: x + 0.12, y: ly + 0.4, w: lcardW - 0.24, h: 0.45,
        fontSize: 14, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
      });
    });
  }

  if (props.cta && coords.cta) {
    slide.addShape('roundRect', {
      x: coords.cta.x, y: coords.cta.y, w: coords.cta.w || 2.6, h: coords.cta.h || 0.42,
      fill: { color: COLORS.accent },
      rectRadius: (coords.cta.h || 0.42) / 2,
    } as any);
    slide.addText(props.cta, {
      x: coords.cta.x, y: coords.cta.y, w: coords.cta.w || 2.6, h: coords.cta.h || 0.42,
      fontSize: coords.cta.fontSize || 12,
      color: COLORS.white, bold: coords.cta.bold ?? true,
      align: 'center', valign: 'middle',
      fontFace: coords.cta.fontFamily || FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Timeline(slide: PptxSlide, props: Theme06TimelineProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const phases = (props.phases || []).slice(0, 4).filter((p) => p != null);
  if (phases.length > 0 && coords.track && coords.cards) {
    const startX = coords.track.startX || 0.95;
    const endX = coords.track.endX || 9.35;
    const trackY = coords.track.y || 2.55;
    const stepX = phases.length > 1 ? (endX - startX) / (phases.length - 1) : 0;
    const cardW = coords.cards.cardW || 2.05;
    const cardY = coords.cards.cardY || 3.55;
    const cardH = coords.cards.cardH || 1.8;

    slide.addShape('line', {
      x1: startX, y1: trackY, x2: endX, y2: trackY,
      line: { color: COLORS.borderStrong, width: 2 },
    } as any);

    phases.forEach((phase, idx) => {
      const cx = startX + stepX * idx;
      slide.addShape('ellipse', {
        x: cx - 0.18, y: trackY - 0.18, w: 0.36, h: 0.36,
        fill: { color: COLORS.accent }, line: { color: COLORS.surfaceSolid, width: 3 },
      } as any);
      slide.addText(String(idx + 1), {
        x: cx - 0.18, y: trackY - 0.18, w: 0.36, h: 0.36,
        fontSize: 13, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
      slide.addText(phase.date ?? '', {
        x: cx - 0.9, y: trackY + 0.28, w: 1.8, h: 0.22,
        fontSize: 11, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.mono,
      });
      slide.addText(phase.title ?? '', {
        x: cx - 1.0, y: trackY + 0.55, w: 2.0, h: 0.45,
        fontSize: 13, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.body,
      });

      const cardX = cx - cardW / 2;
      addTheme06Card(slide, cardX, cardY, cardW, cardH);
      slide.addText(phase.title ?? '', {
        x: cardX + 0.12, y: cardY + 0.12, w: cardW - 0.24, h: 0.4,
        fontSize: 15, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (phase.description) {
        slide.addText(phase.description, {
          x: cardX + 0.12, y: cardY + 0.56, w: cardW - 0.24, h: cardH - 0.7,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.footnote) {
    addTheme06FooterBilingual(slide, props.footnote);
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Milestone(slide: PptxSlide, props: Theme06MilestoneProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const milestones = (props.milestones || []).filter((m) => m != null).slice(0, 6);
  if (milestones.length === 0) {
    addTheme06GlowLine(slide);
    return;
  }

  const gap = coords.gap || 0.18;
  const totalW = 8.7;
  const cardW = (totalW - gap * (milestones.length - 1)) / milestones.length;
  const cardH = coords.cardH || 2.2;
  const startX = coords.startX || 0.65;
  const startY = coords.startY || 2.35;

  slide.addShape('line', {
    x1: startX + cardW / 2, y1: startY + 0.42,
    x2: startX + (milestones.length - 1) * (cardW + gap) + cardW / 2, y2: startY + 0.42,
    line: { color: COLORS.border, width: 2 },
  } as any);

  milestones.forEach((m, idx) => {
    const x = startX + idx * (cardW + gap);
    const focus = !!m.focus;
    addTheme06Card(slide, x, startY, cardW, cardH, focus);

    slide.addShape('ellipse', {
      x: x + cardW / 2 - 0.16, y: startY + 0.26, w: 0.32, h: 0.32,
      fill: { color: focus ? COLORS.white : COLORS.accent },
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + cardW / 2 - 0.16, y: startY + 0.26, w: 0.32, h: 0.32,
      fontSize: 9, color: focus ? COLORS.accent : COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });

    if (m.date) {
      slide.addText(m.date, {
        x: x + 0.1, y: startY + 0.72, w: cardW - 0.2, h: 0.2,
        fontSize: 10, color: focus ? COLORS.white : COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
    }
    if (m.title) {
      slide.addText(m.title, {
        x: x + 0.1, y: startY + 0.96, w: cardW - 0.2, h: 0.32,
        fontSize: 13, color: focus ? COLORS.white : COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
    }
    if (m.value) {
      slide.addText(m.value, {
        x: x + 0.1, y: startY + 1.26, w: cardW - 0.2, h: 0.22,
        fontSize: 11, color: focus ? COLORS.white : COLORS.secondary, bold: true, fontFace: FONTS.mono,
      });
    }
    if (m.description) {
      slide.addText(m.description, {
        x: x + 0.1, y: startY + 1.5, w: cardW - 0.2, h: 0.56,
        fontSize: 9, color: focus ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  addTheme06GlowLine(slide);
}

export function renderTheme06MetricShowcase(slide: PptxSlide, props: Theme06MetricShowcaseProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  if (props.value && coords.value) {
    slide.addText(props.value, {
      x: coords.value.x, y: coords.value.y, w: coords.value.w || 8.7, h: coords.value.h || 1.1,
      fontSize: coords.value.fontSize || 90,
      color: COLORS.accent, bold: coords.value.bold ?? true,
      align: coords.value.align || 'center',
      fontFace: coords.value.fontFamily || FONTS.heading,
    });
  }

  if (props.unit && coords.unit) {
    slide.addText(props.unit, {
      x: coords.unit.x, y: coords.unit.y, w: coords.unit.w || 8.7, h: coords.unit.h || 0.35,
      fontSize: coords.unit.fontSize || 20,
      color: COLORS.secondary,
      align: 'center',
      fontFace: coords.unit.fontFamily || FONTS.heading,
    });
  }

  if (props.change && coords.change) {
    const badgeW = coords.change.badgeW || 2.6;
    const badgeX = coords.change.badgeX ?? (10 - badgeW) / 2;
    const badgeY = coords.change.badgeY || 3.85;
    slide.addShape('roundRect', {
      x: badgeX, y: badgeY, w: badgeW, h: 0.42,
      fill: { color: COLORS.accent }, rectRadius: 0.21,
    } as any);
    const text = [props.change, props.changeLabel].filter(Boolean).join('  ');
    slide.addText(text, {
      x: badgeX, y: badgeY, w: badgeW, h: 0.42,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const supporting = (props.supporting || []).filter((s) => s != null).slice(0, 4);
  if (supporting.length > 0 && coords.supporting) {
    const gapX = 0.18;
    const sStartX = coords.supporting.startX || 0.65;
    const sY = coords.supporting.y || 4.45;
    const cardW = (8.7 - gapX * (supporting.length - 1)) / supporting.length;
    const cardH = 0.55;
    supporting.forEach((item, idx) => {
      const x = sStartX + idx * (cardW + gapX);
      addTheme06Card(slide, x, sY, cardW, cardH);
      slide.addText(item.value ?? '', {
        x: x + 0.1, y: sY + 0.08, w: cardW - 0.2, h: 0.22,
        fontSize: 16, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.1, y: sY + 0.3, w: cardW - 0.2, h: 0.18,
        fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06RiskMatrix(slide: PptxSlide, props: Theme06RiskMatrixProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const cells = (props.cells || []).filter((c) => c != null).slice(0, 4);
  const cols = coords.cols || 2;
  const gap = coords.gap || 0.14;
  const cellW = (8.7 - gap) / cols;
  const cellH = coords.cellH || 1.25;
  const startX = coords.startX || 0.65;
  const startY = coords.startY || 2.35;
  const levelLabels: Record<string, string> = { high: 'HIGH RISK', medium: 'MEDIUM RISK', low: 'LOW RISK' };

  cells.forEach((cell, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = startX + col * (cellW + gap);
    const y = startY + row * (cellH + gap);
    const level = cell.level || 'medium';
    const accent = level === 'high' || !!cell.focus;
    addTheme06Card(slide, x, y, cellW, cellH, accent);
    slide.addText(levelLabels[level] ?? level.toUpperCase(), {
      x: x + 0.12, y: y + 0.12, w: cellW - 0.24, h: 0.2,
      fontSize: 9, color: accent ? 'FFFFFF' : COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });
    slide.addText(cell.title ?? '', {
      x: x + 0.12, y: y + 0.36, w: cellW - 0.24, h: 0.34,
      fontSize: 14, color: accent ? COLORS.white : COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (cell.description) {
      slide.addText(cell.description, {
        x: x + 0.12, y: y + 0.72, w: cellW - 0.24, h: cellH - 0.84,
        fontSize: 10, color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const axisY = startY + 2 * (cellH + gap) + 0.08;
  if (props.xAxisLabel || props.yAxisLabel) {
    slide.addText([props.xAxisLabel, props.yAxisLabel].filter(Boolean).join('    '), {
      x: 0.65, y: axisY, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Summary(slide: PptxSlide, props: Theme06SummaryProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const points = (props.points || []).filter((p) => p != null);
  if (points.length > 0 && coords.points) {
    const startX = coords.points.startX || 0.65;
    const startY = coords.points.startY || 2.35;
    const itemW = coords.points.itemW || 4.6;
    const itemH = coords.points.itemH || 0.55;
    const gap = coords.points.gap || 0.12;
    const numberCoord = coords.points.number || {};
    const textCoord = coords.points.text || {};

    points.forEach((pt, idx) => {
      const y = startY + idx * (itemH + gap);
      addTheme06Card(slide, startX, y, itemW, itemH);
      const numText = String(idx + 1).padStart(2, '0');
      const numX = startX + (numberCoord.x ?? 0.2);
      const numY = y + (numberCoord.y ?? 0.16);
      const numW = numberCoord.w ?? 0.22;
      const numH = numberCoord.h ?? 0.22;
      slide.addShape('ellipse', {
        x: numX, y: numY, w: numW, h: numH,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(numText, {
        x: numX, y: numY, w: numW, h: numH,
        fontSize: numberCoord.fontSize || 10, color: COLORS.white, bold: true,
        align: 'center', valign: 'middle', fontFace: numberCoord.fontFamily || FONTS.mono,
      });
      if (pt.text) {
        slide.addText(pt.text, {
          x: startX + (textCoord.x ?? 0.55), y: y + (textCoord.y ?? 0.08),
          w: textCoord.w ?? (itemW - 0.7), h: textCoord.h ?? (itemH - 0.16),
          fontSize: textCoord.fontSize || 12, color: COLORS.primary,
          fontFace: textCoord.fontFamily || FONTS.body, valign: 'middle',
        });
      }
    });
  }

  if (props.conclusion && coords.conclusion) {
    const c = coords.conclusion;
    addTheme06Card(slide, c.x, c.y, c.w, c.h, true);
    const conc = props.conclusion;
    if (conc.value && c.value) {
      slide.addText(conc.value, {
        x: c.value.x, y: c.value.y, w: c.value.w || (c.w - 0.4), h: c.value.h || 0.7,
        fontSize: c.value.fontSize || 40, color: COLORS.white, bold: c.value.bold ?? true,
        fontFace: c.value.fontFamily || FONTS.heading,
      });
    }
    if (conc.valueLabel && c.valueLabel) {
      slide.addText(conc.valueLabel, {
        x: c.valueLabel.x, y: c.valueLabel.y, w: c.valueLabel.w || (c.w - 0.4), h: c.valueLabel.h || 0.25,
        fontSize: c.valueLabel.fontSize || 11, color: COLORS.white, bold: c.valueLabel.bold ?? true,
        fontFace: c.valueLabel.fontFamily || FONTS.mono,
      });
    }
    if (conc.valueDescription && c.valueDescription) {
      slide.addText(conc.valueDescription, {
        x: c.valueDescription.x, y: c.valueDescription.y, w: c.valueDescription.w || (c.w - 0.4), h: 0.6,
        fontSize: c.valueDescription.fontSize || 11, color: COLORS.white,
        fontFace: c.valueDescription.fontFamily || FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Quote(slide: PptxSlide, props: Theme06QuoteProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.accentBar !== false && coords.accentBar) {
    slide.addShape('rect', {
      x: coords.accentBar.x, y: coords.accentBar.y,
      w: coords.accentBar.w || 0.12, h: coords.accentBar.h || 4.0,
      fill: { color: coords.accentBar.color || COLORS.accent },
    } as any);
  }

  if (props.quoteMark && coords.quoteMark) {
    slide.addText(props.quoteMark, {
      x: coords.quoteMark.x, y: coords.quoteMark.y, w: coords.quoteMark.w || 1.0, h: coords.quoteMark.h || 0.7,
      fontSize: coords.quoteMark.fontSize || 80,
      color: coords.quoteMark.color || COLORS.accent, bold: coords.quoteMark.bold ?? true,
      fontFace: coords.quoteMark.fontFamily || FONTS.heading,
    });
  }

  if (props.quote && coords.quote) {
    slide.addText(props.quote, {
      x: coords.quote.x, y: coords.quote.y, w: coords.quote.w || 7.5, h: coords.quote.h || 2.4,
      fontSize: coords.quote.fontSize || 32,
      color: COLORS.primary, bold: coords.quote.bold ?? true,
      fontFace: coords.quote.fontFamily || FONTS.heading,
    });
  }

  if (props.source && coords.source) {
    slide.addText(props.source, {
      x: coords.source.x, y: coords.source.y, w: coords.source.w || 7.5, h: coords.source.h || 0.3,
      fontSize: coords.source.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.source.fontFamily || FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Process(slide: PptxSlide, props: Theme06ProcessProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const steps = (props.steps || []).filter((s) => s != null).slice(0, 6);
  if (steps.length > 0 && coords.steps) {
    const sStartX = coords.steps.startX || 0.65;
    const sY = coords.steps.y || 2.35;
    const sH = coords.steps.h || 3.1;
    const sGap = coords.steps.gap || 0.24;
    const totalW = 8.7;
    const stepW = (totalW - sGap * (steps.length - 1)) / steps.length;

    const hasEllipse = coords.steps.numberEllipse != null;
    const numOffset = hasEllipse ? coords.steps.numberEllipse : coords.steps.number;
    const titleOffset = coords.steps.title || {};
    const descOffset = coords.steps.description || {};
    const connector = coords.steps.connector;

    steps.forEach((step, idx) => {
      const x = sStartX + idx * (stepW + sGap);
      addTheme06Card(slide, x, sY, stepW, sH);

      if (numOffset) {
        if (hasEllipse) {
          const ne = coords.steps.numberEllipse;
          const cx = x + (ne.xOffset ?? 0.22);
          const cy = sY + (ne.yOffset ?? 0.2);
          const size = ne.size ?? 0.44;
          slide.addShape('ellipse', {
            x: cx, y: cy, w: size, h: size,
            fill: { color: COLORS.accent },
          } as any);
          slide.addText(String(idx + 1), {
            x: cx, y: cy, w: size, h: size,
            fontSize: ne.fontSize || 14, color: COLORS.white, bold: true,
            align: 'center', valign: 'middle', fontFace: ne.fontFamily || FONTS.mono,
          });
        } else {
          const n = coords.steps.number;
          slide.addText(String(idx + 1), {
            x: x + (n.xOffset ?? 0.16), y: sY + (n.yOffset ?? 0.16), w: stepW - 0.32, h: 0.4,
            fontSize: n.fontSize || 22, color: COLORS.accent, bold: n.bold ?? true,
            fontFace: n.fontFamily || FONTS.mono,
          });
        }
      }

      if (step.title) {
        slide.addText(step.title, {
          x: x + (titleOffset.xOffset ?? 0.12), y: sY + (titleOffset.yOffset ?? 0.78),
          w: stepW - 0.24, h: 0.45,
          fontSize: titleOffset.fontSize || 16, color: COLORS.primary, bold: titleOffset.bold ?? true,
          align: titleOffset.align || 'center', fontFace: titleOffset.fontFamily || FONTS.heading,
        });
      }

      if (step.description) {
        slide.addText(step.description, {
          x: x + (descOffset.xOffset ?? 0.12), y: sY + (descOffset.yOffset ?? 1.38),
          w: stepW - 0.24, h: sH - (descOffset.yOffset ?? 1.38) - 0.12,
          fontSize: descOffset.fontSize || 11, color: COLORS.secondary,
          align: descOffset.align || 'center', fontFace: descOffset.fontFamily || FONTS.body, valign: 'top',
        });
      }

      if (connector && idx < steps.length - 1) {
        const lineY = sY + (connector.yOffset ?? 0.42);
        slide.addShape('line', {
          x1: x + stepW, y1: lineY,
          x2: x + stepW + sGap, y2: lineY,
          line: {
            color: connector.color || COLORS.accent,
            width: connector.width || 1.5,
            dashType: connector.dashType || 'dash',
          },
        } as any);
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ListBased(slide: PptxSlide, props: Theme06ListBasedProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.55,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const points = (props.points || []).filter((p) => p != null);
  if (points.length > 0 && coords.points) {
    const px = coords.points.x || 0.65;
    const pw = coords.points.w || 4.5;
    const pStartY = coords.points.startY || 2.2;
    const pRowH = coords.points.rowH || 0.7;
    const pGap = coords.points.gap || 0.1;
    const pNumber = coords.points.number;
    const pCheck = coords.points.check;
    const pText = coords.points.text;

    points.forEach((pt, idx) => {
      const y = pStartY + idx * (pRowH + pGap);
      if (pNumber) {
        const nx = px + (pNumber.x ?? 0.15);
        const ny = y + (pNumber.yOffset ?? 0.18);
        const size = pNumber.size ?? 0.34;
        slide.addShape('ellipse', {
          x: nx, y: ny, w: size, h: size,
          fill: { color: COLORS.accent },
        } as any);
        slide.addText(String(idx + 1), {
          x: nx, y: ny, w: size, h: size,
          fontSize: pNumber.fontSize || 12, color: COLORS.white, bold: true,
          align: 'center', valign: 'middle', fontFace: pNumber.fontFamily || FONTS.mono,
        });
      } else if (pCheck) {
        const cx = px + (pCheck.x ?? 0.2);
        const cy = y + (pCheck.yOffset ?? 0.16);
        const size = pCheck.size ?? 0.3;
        slide.addShape('roundRect', {
          x: cx, y: cy, w: size, h: size,
          fill: { color: COLORS.surfaceElevated },
          line: { color: COLORS.border, width: 1 },
          rectRadius: 0.04,
        } as any);
        slide.addText('✓', {
          x: cx, y: cy, w: size, h: size,
          fontSize: pCheck.fontSize || 11, color: COLORS.accent, bold: pCheck.bold ?? true,
          align: 'center', valign: 'middle', fontFace: pCheck.fontFamily || FONTS.body,
        });
      }
      if (pt.text && pText) {
        slide.addText(pt.text, {
          x: px + (pText.x ?? 0.57), y: y + (pText.yOffset ?? 0.1),
          w: pw - (pText.x ?? 0.57) - 0.15, h: pRowH - (pText.yOffset ?? 0.1) - 0.1,
          fontSize: pText.fontSize || 11, color: COLORS.primary,
          fontFace: pText.fontFamily || FONTS.body, valign: 'middle',
        });
      }
    });
  }

  const steps = (props.steps || []).filter((s) => s != null);
  if (steps.length > 0 && coords.steps) {
    const sx = coords.steps.x || 5.35;
    const sw = coords.steps.w || 4.0;
    const sStartY = coords.steps.startY || 2.2;
    const sRowH = coords.steps.rowH || 0.7;
    const sGap = coords.steps.gap || 0.12;
    const sDate = coords.steps.date;
    const sTitle = coords.steps.title;
    const sDesc = coords.steps.description;

    steps.forEach((step, idx) => {
      const y = sStartY + idx * (sRowH + sGap);
      addTheme06Card(slide, sx, y, sw, sRowH);
      if (step.date && sDate) {
        slide.addText(step.date, {
          x: sx + (sDate.xOffset ?? 0.1), y: y + (sDate.yOffset ?? 0.08),
          w: sw - 0.2, h: 0.2,
          fontSize: sDate.fontSize || 9, color: COLORS.accent, bold: sDate.bold ?? true,
          fontFace: sDate.fontFamily || FONTS.mono,
        });
      }
      if (step.title && sTitle) {
        slide.addText(step.title, {
          x: sx + (sTitle.xOffset ?? 0.1), y: y + (sTitle.yOffset ?? 0.28),
          w: sw - 0.2, h: 0.24,
          fontSize: sTitle.fontSize || 11, color: COLORS.primary, bold: sTitle.bold ?? true,
          fontFace: sTitle.fontFamily || FONTS.body,
        });
      }
      if (step.description && sDesc) {
        slide.addText(step.description, {
          x: sx + (sDesc.xOffset ?? 0.1), y: y + (sDesc.yOffset ?? 0.5),
          w: sw - 0.2, h: sRowH - (sDesc.yOffset ?? 0.5) - 0.08,
          fontSize: sDesc.fontSize || 9, color: COLORS.secondary,
          fontFace: sDesc.fontFamily || FONTS.body, valign: 'top',
        });
      }
    });
  }

  if (props.valueCard && coords.valueCard) {
    const vc = coords.valueCard;
    addTheme06Card(slide, vc.x, vc.y, vc.w, vc.h, true);
    const vcValue = coords.value?.value || vc.value;
    if (props.valueCard.value && vcValue) {
      slide.addText(props.valueCard.value, {
        x: vc.x + 0.1, y: vc.y + (vcValue.yOffset ?? 0.35), w: vc.w - 0.2, h: 0.8,
        fontSize: vcValue.fontSize || 54, color: COLORS.white, bold: vcValue.bold ?? true,
        align: vcValue.align || 'center', fontFace: vcValue.fontFamily || FONTS.heading,
      });
    }
    const vcLabel = coords.value?.valueLabel || vc.valueLabel;
    if (props.valueCard.valueLabel && vcLabel) {
      slide.addText(props.valueCard.valueLabel, {
        x: vc.x + 0.1, y: vc.y + (vcLabel.yOffset ?? 1.35), w: vc.w - 0.2, h: 0.3,
        fontSize: vcLabel.fontSize || 12, color: COLORS.white,
        align: vcLabel.align || 'center', fontFace: vcLabel.fontFamily || FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Statement(slide: PptxSlide, props: Theme06StatementProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.statement && coords.statement) {
    slide.addText(props.statement, {
      x: coords.statement.x, y: coords.statement.y, w: coords.statement.w || 8.7, h: coords.statement.h || 1.2,
      fontSize: coords.statement.fontSize || 36,
      color: COLORS.primary, bold: coords.statement.bold ?? true,
      fontFace: coords.statement.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.45,
      fontSize: coords.subtitle.fontSize || 14,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const points = (props.points || []).filter((p) => p != null);
  if (points.length > 0 && coords.points) {
    const pStartX = coords.points.startX || 0.65;
    const pStartY = coords.points.startY || 3.15;
    const pRowH = coords.points.rowH || 0.45;
    const pBullet = coords.points.bullet;
    const pText = coords.points.text;

    points.forEach((pt, idx) => {
      const y = pStartY + idx * pRowH;
      if (pBullet) {
        slide.addShape('ellipse', {
          x: pStartX + (pBullet.x ?? 0.1), y: y + (pBullet.yOffset ?? 0.12),
          w: pBullet.size ?? 0.12, h: pBullet.size ?? 0.12,
          fill: { color: pBullet.color || COLORS.accent },
        } as any);
      }
      if (pt.text && pText) {
        slide.addText(pt.text, {
          x: pStartX + (pText.x ?? 0.35), y: y + (pText.yOffset ?? 0),
          w: pText.w || 8.35, h: pRowH,
          fontSize: pText.fontSize || 13, color: COLORS.primary,
          fontFace: pText.fontFamily || FONTS.body, valign: 'middle',
        });
      }
    });
  }

  if (props.source && coords.source) {
    slide.addText(props.source, {
      x: coords.source.x, y: coords.source.y, w: coords.source.w || 8.7, h: coords.source.h || 0.2,
      fontSize: coords.source.fontSize || 10,
      color: COLORS.secondary,
      align: coords.source.align || 'right',
      fontFace: coords.source.fontFamily || FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Sources(slide: PptxSlide, props: Theme06SourcesProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const sources = (props.sources || []).filter((s) => s != null);
  if (sources.length > 0 && coords.sources) {
    const src = coords.sources;
    const cols = src.cols || 2;
    const startX = src.startX || 0.65;
    const startY = src.startY || 2.35;
    const cardW = src.cardW || 4.15;
    const cardH = src.cardH || 0.72;
    const gapX = src.gapX || 0.24;
    const gapY = src.gapY || 0.12;
    const numCoord = src.number || {};
    const textCoord = src.text || {};

    sources.forEach((source, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + (numCoord.xOffset ?? 0.14), y: y, w: 0.5, h: cardH,
        fontSize: numCoord.fontSize || 12, color: COLORS.accent, bold: numCoord.bold ?? true,
        align: 'center', valign: 'middle', fontFace: numCoord.fontFamily || FONTS.mono,
      });
      if (source.text) {
        slide.addText(source.text, {
          x: x + (textCoord.xOffset ?? 0.75), y: y, w: cardW - (textCoord.xOffset ?? 0.75) - 0.1, h: cardH,
          fontSize: textCoord.fontSize || 11, color: COLORS.primary,
          fontFace: textCoord.fontFamily || FONTS.body, valign: 'middle',
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Case(slide: PptxSlide, props: Theme06CaseProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  if (props.company && coords.company) {
    slide.addText(props.company, {
      x: coords.company.x, y: coords.company.y, w: coords.company.w || 5.2, h: coords.company.h || 0.7,
      fontSize: coords.company.fontSize || 36,
      color: COLORS.primary, bold: coords.company.bold ?? true,
      fontFace: coords.company.fontFamily || FONTS.heading,
    });
  }

  if (props.tagline && coords.tagline) {
    slide.addText(props.tagline, {
      x: coords.tagline.x, y: coords.tagline.y, w: coords.tagline.w || 5.2, h: coords.tagline.h || 0.6,
      fontSize: coords.tagline.fontSize || 14,
      color: COLORS.secondary,
      fontFace: coords.tagline.fontFamily || FONTS.body,
    });
  }

  const metrics = (props.metrics || []).filter((m) => m != null);
  if (metrics.length > 0 && coords.metrics) {
    const mStartX = coords.metrics.startX || 0.65;
    const mStartY = coords.metrics.startY || 4.0;
    const mCount = coords.metrics.count || 3;
    const mCardH = coords.metrics.cardH || 1.25;
    const mGap = 0.12;
    const mCardW = (5.2 - mGap * (mCount - 1)) / mCount;
    const mValue = coords.metrics.value || {};
    const mLabel = coords.metrics.label || {};

    metrics.slice(0, mCount).forEach((metric, idx) => {
      const x = mStartX + idx * (mCardW + mGap);
      addTheme06Card(slide, x, mStartY, mCardW, mCardH);
      if (metric.value) {
        slide.addText(metric.value, {
          x: x + (mValue.xOffset ?? 0.1), y: mStartY + (mValue.yOffset ?? 0.1),
          w: mCardW - 0.2, h: 0.55,
          fontSize: mValue.fontSize || 26, color: COLORS.primary, bold: mValue.bold ?? true,
          fontFace: mValue.fontFamily || FONTS.heading,
        });
      }
      if (metric.label) {
        slide.addText(metric.label, {
          x: x + (mLabel.xOffset ?? 0.1), y: mStartY + (mLabel.yOffset ?? 0.7),
          w: mCardW - 0.2, h: mCardH - (mLabel.yOffset ?? 0.7) - 0.1,
          fontSize: mLabel.fontSize || 10, color: COLORS.secondary,
          fontFace: mLabel.fontFamily || FONTS.body, valign: 'top',
        });
      }
    });
  }

  const cards = (props.cards || []).filter((c) => c != null);
  if (cards.length > 0 && coords.cards) {
    const cStartX = coords.cards.startX || 6.05;
    const cStartY = coords.cards.startY || 2.3;
    const cGap = coords.cards.gap || 0.12;
    const cLabel = coords.cards.label || {};
    const cText = coords.cards.text || {};
    const cCardH = 0.85;
    const cCardW = 3.3;

    cards.forEach((card, idx) => {
      const y = cStartY + idx * (cCardH + cGap);
      addTheme06Card(slide, cStartX, y, cCardW, cCardH);
      if (card.label && cLabel) {
        slide.addText(card.label, {
          x: cStartX + (cLabel.xOffset ?? 0.12), y: y + (cLabel.yOffset ?? 0.1),
          w: cCardW - 0.24, h: 0.2,
          fontSize: cLabel.fontSize || 10, color: COLORS.accent, bold: cLabel.bold ?? true,
          fontFace: cLabel.fontFamily || FONTS.mono,
        });
      }
      if (card.text && cText) {
        slide.addText(card.text, {
          x: cStartX + (cText.xOffset ?? 0.12), y: y + (cText.yOffset ?? 0.36),
          w: cCardW - 0.24, h: cCardH - (cText.yOffset ?? 0.36) - 0.1,
          fontSize: cText.fontSize || 11, color: COLORS.secondary,
          fontFace: cText.fontFamily || FONTS.body, valign: 'top',
        });
      }
    });
  }

  const items = (props.items || []).filter((i) => i != null);
  if (items.length > 0 && coords.items) {
    const iStartX = coords.items.startX || 0.65;
    const iStartY = coords.items.startY || 2.35;
    const iGap = coords.items.gap || 0.12;
    const iNumber = coords.items.number || {};
    const iTitle = coords.items.title || {};
    const iDesc = coords.items.description || {};
    const iMeta = coords.items.meta || {};
    const iRowH = 0.75;

    items.forEach((item, idx) => {
      const y = iStartY + idx * (iRowH + iGap);
      addTheme06Card(slide, iStartX, y, 4.35, iRowH);
      if (item.number && iNumber) {
        const nx = iStartX + (iNumber.xOffset ?? 0.18);
        const ny = y + (iNumber.yOffset ?? 0.12);
        const nw = iNumber.w ?? 0.6;
        const nh = iNumber.h ?? 0.32;
        slide.addShape('roundRect', {
          x: nx, y: ny, w: nw, h: nh,
          fill: { color: COLORS.surface },
          line: { color: COLORS.border, width: 1 },
          rectRadius: 0.04,
        } as any);
        slide.addText(item.number, {
          x: nx, y: ny, w: nw, h: nh,
          fontSize: iNumber.fontSize || 16, color: COLORS.accent, bold: iNumber.bold ?? true,
          align: 'center', valign: 'middle', fontFace: iNumber.fontFamily || FONTS.mono,
        });
      }
      if (item.title && iTitle) {
        slide.addText(item.title, {
          x: iStartX + (iTitle.xOffset ?? 0.82), y: y + (iTitle.yOffset ?? 0.12),
          w: iTitle.w ?? 3.5, h: iTitle.h ?? 0.36,
          fontSize: iTitle.fontSize || 16, color: COLORS.primary, bold: iTitle.bold ?? true,
          fontFace: iTitle.fontFamily || FONTS.heading,
        });
      }
      if (item.description && iDesc) {
        slide.addText(item.description, {
          x: iStartX + (iDesc.xOffset ?? 0.18), y: y + (iDesc.yOffset ?? 0.54),
          w: 4.35 - 0.36, h: iRowH - (iDesc.yOffset ?? 0.54) - 0.08,
          fontSize: iDesc.fontSize || 10, color: COLORS.secondary,
          fontFace: iDesc.fontFamily || FONTS.body, valign: 'top',
        });
      }
      if (item.meta && iMeta) {
        slide.addText(item.meta, {
          x: iStartX + (iMeta.xOffset ?? 0.18), y: y + iRowH - (iMeta.yOffsetBottom ?? 0.34),
          w: 4.35 - 0.36, h: 0.2,
          fontSize: iMeta.fontSize || 8, color: COLORS.secondary,
          fontFace: iMeta.fontFamily || FONTS.mono, valign: 'middle',
        });
      }
    });
  }

  if (props.imageUrl && coords.image) {
    addImageMaybe(slide, props.imageUrl, coords.image.x, coords.image.y, coords.image.w, coords.image.h);
  }

  if (props.insight && coords.insight) {
    slide.addText(props.insight, {
      x: coords.insight.x, y: coords.insight.y, w: coords.insight.w || 4.5, h: coords.insight.h || 0.25,
      fontSize: coords.insight.fontSize || 10, color: COLORS.accent,
      fontFace: coords.insight.fontFamily || FONTS.mono,
    });
  }

  if (props.footnote && coords.footnote) {
    slide.addText(props.footnote, {
      x: coords.footnote.x, y: coords.footnote.y, w: coords.footnote.w || 4.0, h: coords.footnote.h || 0.2,
      fontSize: coords.footnote.fontSize || 9, color: COLORS.secondary,
      align: coords.footnote.align || 'right',
      fontFace: coords.footnote.fontFamily || FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Toc(slide: PptxSlide, props: Theme06TocProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const items = (props.items || []).filter((i) => i != null);
  if (items.length > 0 && coords.items) {
    const t = coords.items;
    const cols = t.cols || 2;
    const startX = t.startX || 0.65;
    const startY = t.startY || 2.35;
    const cardW = t.cardW || 4.15;
    const cardH = t.cardH || 1.05;
    const gapX = t.gapX || 0.24;
    const gapY = t.gapY || 0.14;
    const numCoord = t.number || {};
    const titleCoord = t.title || {};
    const pageCoord = t.page || {};

    items.forEach((item, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH);

      if (item.number && numCoord) {
        slide.addText(item.number, {
          x: x + (numCoord.x ?? 0.14), y: y + (numCoord.y ?? 0.14),
          w: numCoord.w ?? 0.7, h: numCoord.h ?? 0.7,
          fontSize: numCoord.fontSize || 20, color: COLORS.accent, bold: numCoord.bold ?? true,
          fontFace: numCoord.fontFamily || FONTS.mono,
        });
      }
      if (item.title && titleCoord) {
        slide.addText(item.title, {
          x: x + (titleCoord.x ?? 1.0), y: y + (titleCoord.y ?? 0.16),
          w: titleCoord.w ?? 3.0, h: titleCoord.h ?? 0.42,
          fontSize: titleCoord.fontSize || 16, color: COLORS.primary, bold: titleCoord.bold ?? true,
          fontFace: titleCoord.fontFamily || FONTS.heading, valign: 'middle',
        });
      }
      if (item.page && pageCoord) {
        slide.addText(item.page, {
          x: x + (pageCoord.x ?? 1.0), y: y + (pageCoord.y ?? 0.58),
          w: pageCoord.w ?? 3.0, h: pageCoord.h ?? 0.24,
          fontSize: pageCoord.fontSize || 10, color: COLORS.secondary,
          fontFace: pageCoord.fontFamily || FONTS.mono,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06CoverVariant(slide: PptxSlide, props: Theme06CoverVariantProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.imageUrl && coords.image) {
    addImageMaybe(slide, props.imageUrl, coords.image.x, coords.image.y, coords.image.w, coords.image.h);
  }

  if (props.badge && coords.badge) {
    const b = coords.badge;
    const bx = b.cx != null ? b.cx - ((b.w ?? 1.8) / 2) : (b.x ?? 0.65);
    const by = b.cy != null ? b.cy - ((b.h ?? 0.28) / 2) : (b.y ?? 0.78);
    const bw = b.w ?? 1.8;
    const bh = b.h ?? 0.28;
    slide.addShape('roundRect', {
      x: bx, y: by, w: bw, h: bh,
      fill: { color: COLORS.accent },
      rectRadius: bh / 2,
    } as any);
    slide.addText(props.badge, {
      x: bx, y: by, w: bw, h: bh,
      fontSize: b.fontSize || 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: b.fontFamily || FONTS.mono,
    });
  }

  if (props.tag && coords.tag) {
    slide.addText(props.tag, {
      x: coords.tag.x, y: coords.tag.y, w: coords.tag.w || 4.0, h: coords.tag.h || 0.25,
      fontSize: coords.tag.fontSize || 11, color: COLORS.accent, bold: coords.tag.bold ?? true,
      fontFace: coords.tag.fontFamily || FONTS.mono,
    });
  }

  if (props.headline && coords.headline) {
    slide.addText(props.headline, {
      x: coords.headline.x, y: coords.headline.y, w: coords.headline.w || 6.5, h: coords.headline.h || 0.5,
      fontSize: coords.headline.fontSize || 18, color: COLORS.accent, bold: coords.headline.bold ?? true,
      fontFace: coords.headline.fontFamily || FONTS.mono,
    });
  }

  if (props.hero && coords.hero) {
    slide.addText(props.hero, {
      x: coords.hero.x, y: coords.hero.y, w: coords.hero.w || 8.7, h: coords.hero.h || 0.9,
      fontSize: coords.hero.fontSize || 56, color: COLORS.primary, bold: coords.hero.bold ?? true,
      align: coords.hero.align || 'center', fontFace: coords.hero.fontFamily || FONTS.heading,
    });
  }

  if (coords.title) {
    const tc = coords.title;
    const titleColor = tc.color === 'secondary' ? COLORS.secondary : COLORS.primary;
    slide.addText(props.title, {
      x: tc.x, y: tc.y, w: tc.w || 8.7, h: tc.h || 0.6,
      fontSize: tc.fontSize || 28, color: titleColor, bold: tc.bold ?? true,
      align: tc.align || 'center', fontFace: tc.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 7.0, h: coords.subtitle.h || 0.5,
      fontSize: coords.subtitle.fontSize || 14, color: COLORS.secondary,
      align: coords.subtitle.align || 'center', fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  if (props.kpis && props.kpis.length > 0 && coords.kpis) {
    const k = coords.kpis;
    const cardW = k.cardW || 2.6;
    const gap = k.gap || 0.2;
    const cardH = k.cardH || 0.9;
    const totalW = props.kpis.length * cardW + (props.kpis.length - 1) * gap;
    const startX = (10 - totalW) / 2;
    const y = k.y || 3.9;

    props.kpis.forEach((kpi, idx) => {
      const x = startX + idx * (cardW + gap);
      addTheme06Card(slide, x, y, cardW, cardH);
      const valueText = (kpi.value || '') + (kpi.unit || '');
      if (kpi.value) {
        slide.addText(valueText, {
          x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: cardH / 2,
          fontSize: k.value?.fontSize || 26, color: COLORS.primary, bold: k.value?.bold ?? true,
          align: k.value?.align || 'center', fontFace: FONTS.heading,
        });
      }
      if (kpi.label) {
        slide.addText(kpi.label, {
          x: x + 0.12, y: y + cardH / 2 + 0.05, w: cardW - 0.24, h: cardH / 2 - 0.1,
          fontSize: k.label?.fontSize || 10, color: COLORS.secondary,
          align: k.label?.align || 'center', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.bars && props.bars.length > 0 && coords.progressBars) {
    const pb = coords.progressBars;
    const startX = pb.startX || 6.1;
    const cardW = pb.cardW || 3.25;
    const startY = pb.startY || 0.9;
    const rowStep = pb.rowStep || 1.05;
    const cardH = pb.cardH || 0.9;

    props.bars.forEach((bar, idx) => {
      const x = startX;
      const y = startY + idx * rowStep;
      addTheme06Card(slide, x, y, cardW, cardH);
      if (bar.label) {
        slide.addText(bar.label, {
          x: x + 0.12, y: y + 0.08, w: cardW - 0.24, h: 0.22,
          fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.body,
        });
      }
      const valueText = (bar.value || '') + (bar.unit || '');
      if (bar.value) {
        slide.addText(valueText, {
          x: x + 0.12, y: y + 0.32, w: cardW - 0.24, h: 0.28,
          fontSize: 20, color: COLORS.accent, bold: true, align: 'right', fontFace: FONTS.heading,
        });
      }
      const trackY = y + cardH - 0.18;
      slide.addShape('roundRect', {
        x: x + 0.12, y: trackY, w: cardW - 0.24, h: 0.06,
        fill: { color: COLORS.white },
        rectRadius: 0.03,
      } as any);
      const progress = Math.max(0, Math.min(1, bar.progress ?? 0)) * (cardW - 0.24);
      if (progress > 0) {
        slide.addShape('roundRect', {
          x: x + 0.12, y: trackY, w: progress, h: 0.06,
          fill: { color: COLORS.accent },
          rectRadius: 0.03,
        } as any);
      }
    });
  }

  if (props.metrics && props.metrics.length > 0 && coords.metrics) {
    const m = coords.metrics;
    const startX = m.startX || 7.0;
    const cardW = m.cardW || 2.4;
    const startY = m.startY || 1.1;
    const rowStep = m.rowStep || 1.15;
    const cardH = m.cardH || 0.95;

    props.metrics.forEach((metric, idx) => {
      const x = startX;
      const y = startY + idx * rowStep;
      addTheme06Card(slide, x, y, cardW, cardH);
      const valueText = (metric.value || '') + (metric.unit || '');
      if (metric.value) {
        slide.addText(valueText, {
          x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: cardH / 2,
          fontSize: m.value?.fontSize || 28, color: COLORS.primary, bold: m.value?.bold ?? true,
          fontFace: m.value?.fontFamily || FONTS.heading,
        });
      }
      if (metric.label) {
        slide.addText(metric.label, {
          x: x + 0.12, y: y + cardH / 2 + 0.05, w: cardW - 0.24, h: cardH / 2 - 0.1,
          fontSize: m.label?.fontSize || 11, color: COLORS.secondary,
          fontFace: m.label?.fontFamily || FONTS.body,
        });
      }
    });
  }

  if (props.channels && props.channels.length > 0 && coords.channels) {
    const ch = coords.channels;
    const startX = ch.startX || 7.0;
    const startY = ch.startY || 1.1;
    const ringRadius = ch.ringRadius || 1.5;
    const chCount = props.channels.length;
    props.channels.forEach((channel, idx) => {
      const angle = (idx / chCount) * Math.PI * 2 - Math.PI / 2;
      const cx = startX + ringRadius + Math.cos(angle) * ringRadius;
      const cy = startY + ringRadius + Math.sin(angle) * ringRadius;
      slide.addShape('ellipse', {
        x: cx - 0.3, y: cy - 0.3, w: 0.6, h: 0.6,
        fill: { color: COLORS.surfaceSolid || COLORS.surface },
        line: { color: COLORS.accent, width: 1.5 },
      } as any);
      slide.addText(channel.name || '', {
        x: cx - 0.5, y: cy - 0.5, w: 1.0, h: 0.4,
        fontSize: 8, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
        fontFace: FONTS.mono,
      });
    });
  }

  if (props.footnoteLeft || props.footnoteRight) {
    const f = coords.footer || coords.footnote;
    if (f) {
      const fy = f.y ?? 5.32;
      const fh = f.h ?? 0.2;
      const ff = f.fontSize || 9;
      const ffam = f.fontFamily || FONTS.mono;
      if (props.footnoteLeft) {
        slide.addText(props.footnoteLeft, {
          x: f.x ?? 0.65, y: fy, w: (f.w || 8.7) / 2, h: fh,
          fontSize: ff, color: f.color || COLORS.secondary, align: 'left', fontFace: ffam,
        });
      }
      if (props.footnoteRight) {
        slide.addText(props.footnoteRight, {
          x: (f.x ?? 0.65) + (f.w || 8.7) / 2, y: fy, w: (f.w || 8.7) / 2, h: fh,
          fontSize: ff, color: f.color || COLORS.secondary, align: 'right', fontFace: ffam,
        });
      }
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ContentNumbered(slide: PptxSlide, props: Theme06ContentNumberedProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11, color: COLORS.accent, bold: coords.kicker.bold ?? true,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
    });
  }

  if (coords.title) {
    const tc = coords.title;
    let titleText = props.title;
    if (props.titleAccent) {
      titleText = `${props.title} ${props.titleAccent}`;
    }
    slide.addText(titleText, {
      x: tc.x, y: tc.y, w: tc.w || 4.2, h: tc.h || 1.0,
      fontSize: tc.fontSize || 40, color: COLORS.primary, bold: tc.bold ?? true,
      fontFace: tc.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 4.2, h: coords.subtitle.h || 0.7,
      fontSize: coords.subtitle.fontSize || 13, color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const items = (props.items || []).filter((i) => i != null);
  if (items.length > 0 && coords.items) {
    const ist = coords.items;
    const startX = ist.startX || 5.05;
    const startY = ist.startY || 0.78;
    const cardW = ist.cardW || 4.1;
    const cardH = ist.cardH || 0.78;
    const gap = ist.gap || 0.14;
    const numC = ist.number || {};
    const titleC = ist.title || {};
    const enC = ist.enLabel || {};

    items.forEach((item, idx) => {
      const y = startY + idx * (cardH + gap);
      const accent = !!item.active;
      addTheme06Card(slide, startX, y, cardW, cardH, accent);

      const numText = item.number || String(idx + 1).padStart(2, '0');
      const nx = startX + (numC.xOffset ?? 0.18);
      const ny = y + (numC.yOffset ?? 0.22);
      const nw = numC.w ?? 0.5;
      const nh = numC.h ?? 0.34;
      slide.addText(numText, {
        x: nx, y: ny, w: nw, h: nh,
        fontSize: numC.fontSize || 13, color: accent ? COLORS.white : COLORS.accent,
        bold: numC.bold ?? true, align: 'center', valign: 'middle',
        fontFace: numC.fontFamily || FONTS.mono,
      });

      if (item.title) {
        slide.addText(item.title, {
          x: startX + (titleC.xOffset ?? 0.75), y: y + (titleC.yOffset ?? 0.18),
          w: titleC.w ?? 2.0, h: titleC.h ?? 0.42,
          fontSize: titleC.fontSize || 18, color: accent ? COLORS.white : COLORS.primary,
          bold: titleC.bold ?? true, fontFace: titleC.fontFamily || FONTS.heading,
        });
      }

      if (item.enLabel && enC) {
        slide.addText(item.enLabel, {
          x: startX + (enC.xOffset ?? 2.8), y: y + (enC.yOffset ?? 0.24),
          w: enC.w ?? 1.1, h: enC.h ?? 0.3,
          fontSize: enC.fontSize || 8, color: accent ? COLORS.white : COLORS.secondary,
          bold: enC.bold ?? true, align: enC.align || 'right',
          fontFace: enC.fontFamily || FONTS.mono,
        });
      }
    });
  }

  if (props.footnote && coords.footnote) {
    const f = coords.footnote;
    slide.addText(props.footnote, {
      x: f.x, y: f.y, w: f.w || 8.7, h: f.h || 0.25,
      fontSize: f.fontSize || 9, color: f.color || COLORS.secondary,
      fontFace: f.fontFamily || FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Matrix(slide: PptxSlide, props: Theme06MatrixProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const cells = (props.cells || []).filter((c) => c != null).slice(0, 4);
  if (cells.length > 0 && coords.cells) {
    const c = coords.cells;
    const cols = c.gridCols || 2;
    const gap = c.gap || 0.3;
    const cellW = c.cellW || 2.85;
    const cellH = c.cellH || 1.4;
    const startX = c.startX || 1.65;
    const startY = c.startY || 2.35;
    const titleCfg = c.title || {};
    const descCfg = c.description || {};

    cells.forEach((cell, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cellW + gap);
      const y = startY + row * (cellH + gap);
      const accent = idx === 0 || !!cell.focus;
      addTheme06Card(slide, x, y, cellW, cellH, accent);
      if (cell.title) {
        slide.addText(cell.title, {
          x: x + (titleCfg.xOffset ?? 0.14), y: y + (titleCfg.yOffset ?? 0.12),
          w: titleCfg.w || cellW - 0.28, h: titleCfg.h || 0.35,
          fontSize: titleCfg.fontSize || 18,
          color: accent ? COLORS.white : COLORS.primary, bold: titleCfg.bold ?? true,
          valign: 'top', fontFace: titleCfg.fontFamily || FONTS.heading,
        });
      }
      if (cell.description) {
        slide.addText(cell.description, {
          x: x + (descCfg.xOffset ?? 0.14), y: y + (descCfg.yOffset ?? 0.5),
          w: descCfg.w || cellW - 0.28, h: descCfg.h || cellH - 0.62,
          fontSize: descCfg.fontSize || 11,
          color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top',
          fontFace: descCfg.fontFamily || FONTS.body,
        });
      }
    });
  }

  if (props.xAxisLabel && coords.xAxisLabel) {
    const xa = coords.xAxisLabel;
    slide.addText(props.xAxisLabel, {
      x: xa.x, y: xa.y, w: xa.w || 1.6, h: xa.h || 0.25,
      fontSize: xa.fontSize || 11,
      color: COLORS.secondary,
      align: xa.align || 'right',
      fontFace: xa.fontFamily || FONTS.mono,
    });
  }

  if (props.yAxisLabel && coords.yAxisLabel) {
    const ya = coords.yAxisLabel;
    slide.addText(props.yAxisLabel, {
      x: ya.x, y: ya.y, w: ya.w || 1.2, h: ya.h || 0.25,
      fontSize: ya.fontSize || 11,
      color: COLORS.secondary,
      align: ya.align || 'left',
      fontFace: ya.fontFamily || FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Rank(slide: PptxSlide, props: Theme06RankProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const rows = (props.rows || []).filter((r) => r != null).slice(0, 8);
  if (rows.length > 0 && coords.rows) {
    const r = coords.rows;
    const rowH = r.rowH || 0.42;
    const gap = r.gap || 0.08;
    const startY = r.startY || 2.3;
    const cardX = r.cardX || 0.65;
    const cardW = r.cardW || 8.7;
    const rankCfg = r.rank || {};
    const nameCfg = r.name || {};
    const valueCfg = r.value || {};
    const changeCfg = r.change || {};
    const colorNegative = changeCfg.colorNegative || 'E85D4E';

    rows.forEach((row, idx) => {
      const y = startY + idx * (rowH + gap);
      const focus = idx === 0 || !!row.highlight;
      addTheme06Card(slide, cardX, y, cardW, rowH, focus);

      slide.addText(String(idx + 1), {
        x: rankCfg.x || cardX + 0.2, y, w: rankCfg.w || 0.5, h: rowH,
        fontSize: rankCfg.fontSize || 18,
        color: focus ? COLORS.white : COLORS.accent, bold: rankCfg.bold ?? true,
        align: rankCfg.align || 'center', valign: 'middle',
        fontFace: rankCfg.fontFamily || FONTS.mono,
      });

      slide.addText(row.name ?? '', {
        x: nameCfg.x || cardX + 0.85, y, w: nameCfg.w || 4.5, h: rowH,
        fontSize: nameCfg.fontSize || 15,
        color: focus ? COLORS.white : COLORS.primary, bold: nameCfg.bold ?? true,
        valign: 'middle', fontFace: nameCfg.fontFamily || FONTS.body,
      });

      slide.addText(row.value ?? '', {
        x: valueCfg.x || 6.0, y, w: valueCfg.w || 1.5, h: rowH,
        fontSize: valueCfg.fontSize || 14,
        color: focus ? COLORS.white : COLORS.primary, bold: valueCfg.bold ?? true,
        align: valueCfg.align || 'right', valign: 'middle',
        fontFace: valueCfg.fontFamily || FONTS.mono,
      });

      if (row.change) {
        const isNegative = String(row.change).startsWith('-');
        const changeColor = isNegative ? colorNegative : (focus ? COLORS.white : COLORS.accent);
        slide.addText(row.change, {
          x: changeCfg.x || 7.7, y, w: changeCfg.w || 1.4, h: rowH,
          fontSize: changeCfg.fontSize || 12,
          color: changeColor, bold: changeCfg.bold ?? true,
          align: changeCfg.align || 'right', valign: 'middle',
          fontFace: changeCfg.fontFamily || FONTS.mono,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Comparison(slide: PptxSlide, props: Theme06ComparisonProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const leftCardX = coords.leftTitle?.x ?? 0.65;
  const rightCardX = coords.rightTitle?.x ?? 5.25;
  const colW = coords.leftTitle?.w ?? 4.1;

  if (props.leftTitle && coords.leftTitle) {
    const lt = coords.leftTitle;
    slide.addText(props.leftTitle, {
      x: lt.x, y: lt.y, w: lt.w || colW, h: lt.h || 0.45,
      fontSize: lt.fontSize || 18,
      color: COLORS.primary, bold: lt.bold ?? true,
      valign: 'bottom', fontFace: lt.fontFamily || FONTS.heading,
    });
  }
  if (coords.leftUnderline) {
    const lu = coords.leftUnderline;
    slide.addShape('rect', {
      x: lu.x, y: lu.y, w: lu.w || colW, h: lu.h || 0.03,
      fill: { color: COLORS.secondary },
    } as any);
  }
  if (props.rightTitle && coords.rightTitle) {
    const rt = coords.rightTitle;
    slide.addText(props.rightTitle, {
      x: rt.x, y: rt.y, w: rt.w || colW, h: rt.h || 0.45,
      fontSize: rt.fontSize || 18,
      color: COLORS.primary, bold: rt.bold ?? true,
      valign: 'bottom', fontFace: rt.fontFamily || FONTS.heading,
    });
  }
  if (coords.rightUnderline) {
    const ru = coords.rightUnderline;
    slide.addShape('rect', {
      x: ru.x, y: ru.y, w: ru.w || colW, h: ru.h || 0.03,
      fill: { color: COLORS.accent },
    } as any);
  }

  const points = (props.points || []).filter((p) => p != null).slice(0, 6);
  if (points.length > 0 && coords.points) {
    const p = coords.points;
    const rowH = p.rowH || 0.62;
    const gapY = p.gapY || 0.1;
    const startY = p.startY || 2.35;
    const leftTextCfg = p.leftText || {};
    const rightTextCfg = p.rightText || {};

    points.forEach((point, idx) => {
      const y = startY + idx * (rowH + gapY);
      const winner = point.winner;

      addTheme06Card(slide, leftCardX, y, colW, rowH, winner === 'left');
      if (point.left) {
        slide.addText(point.left, {
          x: leftTextCfg.x || leftCardX + 0.1, y, w: leftTextCfg.w || colW - 0.2, h: rowH,
          fontSize: leftTextCfg.fontSize || 11,
          color: winner === 'left' ? COLORS.white : COLORS.primary,
          valign: 'middle', fontFace: leftTextCfg.fontFamily || FONTS.body,
        });
      }

      addTheme06Card(slide, rightCardX, y, colW, rowH, winner === 'right');
      if (point.right) {
        slide.addText(point.right, {
          x: rightTextCfg.x || rightCardX + 0.1, y, w: rightTextCfg.w || colW - 0.2, h: rowH,
          fontSize: rightTextCfg.fontSize || 11,
          color: winner === 'right' ? COLORS.white : COLORS.primary,
          valign: 'middle', fontFace: rightTextCfg.fontFamily || FONTS.body,
        });
      }
    });

    if ((props.summaryLeft || props.summaryRight) && coords.summary) {
      const s = coords.summary;
      const summaryY = startY + points.length * (rowH + gapY) + (s.yOffsetFromRows ?? 0.2);
      const summaryH = s.cardH || 0.85;
      const leftTextSCfg = s.leftText || {};
      const rightTextSCfg = s.rightText || {};

      if (props.summaryLeft) {
        addTheme06Card(slide, leftCardX, summaryY, colW, summaryH);
        slide.addText(props.summaryLeft, {
          x: leftTextSCfg.x || leftCardX + 0.1, y: summaryY + (leftTextSCfg.yOffset ?? 0.08),
          w: leftTextSCfg.w || colW - 0.2, h: leftTextSCfg.h || 0.7,
          fontSize: leftTextSCfg.fontSize || 10,
          color: COLORS.secondary, valign: 'top',
          fontFace: leftTextSCfg.fontFamily || FONTS.body,
        });
      }
      if (props.summaryRight) {
        addTheme06Card(slide, rightCardX, summaryY, colW, summaryH);
        slide.addText(props.summaryRight, {
          x: rightTextSCfg.x || rightCardX + 0.1, y: summaryY + (rightTextSCfg.yOffset ?? 0.08),
          w: rightTextSCfg.w || colW - 0.2, h: rightTextSCfg.h || 0.7,
          fontSize: rightTextSCfg.fontSize || 10,
          color: COLORS.secondary, valign: 'top',
          fontFace: rightTextSCfg.fontFamily || FONTS.body,
        });
      }
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Bento(slide: PptxSlide, props: Theme06BentoProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const items = (props.items || []).filter((i) => i != null).slice(0, 6);
  if (items.length > 0 && coords.items) {
    const it = coords.items;
    const cols = it.cols || 3;
    const cardW = it.cardW || 2.75;
    const cardH = it.cardH || 1.55;
    const gapX = it.gapX || 0.18;
    const gapY = it.gapY || 0.14;
    const startX = it.startX || 0.65;
    const startY = it.startY || 2.35;
    const valueCfg = it.value || {};
    const titleCfg = it.title || {};
    const descCfg = it.description || {};

    items.forEach((item, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const accent = !!item.accent;
      addTheme06Card(slide, x, y, cardW, cardH, accent);

      if (item.value) {
        slide.addText(item.value, {
          x: x + (valueCfg.xOffset ?? 0.14), y: y + (valueCfg.yOffset ?? 0.14),
          w: valueCfg.w || cardW - 0.28, h: valueCfg.h || 0.28,
          fontSize: valueCfg.fontSize || 12,
          color: accent ? COLORS.white : COLORS.accent, bold: valueCfg.bold ?? true,
          fontFace: valueCfg.fontFamily || FONTS.mono,
        });
      }
      slide.addText(item.title ?? '', {
        x: x + (titleCfg.xOffset ?? 0.14), y: y + (titleCfg.yOffset ?? 0.48),
        w: titleCfg.w || cardW - 0.28, h: titleCfg.h || 0.42,
        fontSize: titleCfg.fontSize || 15,
        color: accent ? COLORS.white : COLORS.primary, bold: titleCfg.bold ?? true,
        valign: 'top', fontFace: titleCfg.fontFamily || FONTS.heading,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: x + (descCfg.xOffset ?? 0.14), y: y + (descCfg.yOffset ?? 0.92),
          w: descCfg.w || cardW - 0.28, h: descCfg.h || cardH - 1.0,
          fontSize: descCfg.fontSize || 10,
          color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top',
          fontFace: descCfg.fontFamily || FONTS.body,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06Triad(slide: PptxSlide, props: Theme06TriadProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const items = (props.items || []).filter((i) => i != null).slice(0, 3);
  if (items.length > 0 && coords.items) {
    const it = coords.items;
    const cardW = it.cardW || 2.65;
    const cardH = it.cardH || 2.4;
    const gap = it.gap || 0.28;
    const startX = it.startX || 0.65;
    const startY = it.y || 2.25;
    const valueCfg = it.value || {};
    const titleCfg = it.title || {};
    const descCfg = it.description || {};

    items.forEach((item, idx) => {
      const x = startX + idx * (cardW + gap);
      const accent = !!item.accent;
      addTheme06Card(slide, x, startY, cardW, cardH, accent);

      if (item.value) {
        slide.addText(item.value, {
          x: x + (valueCfg.xOffset ?? 0.14), y: startY + (valueCfg.yOffset ?? 0.16),
          w: valueCfg.w || cardW - 0.28, h: valueCfg.h || 0.45,
          fontSize: valueCfg.fontSize || 28,
          color: accent ? COLORS.white : COLORS.accent, bold: valueCfg.bold ?? true,
          fontFace: valueCfg.fontFamily || FONTS.heading,
        });
      }
      slide.addText(item.title ?? '', {
        x: x + (titleCfg.xOffset ?? 0.14), y: startY + (titleCfg.yOffset ?? 0.66),
        w: titleCfg.w || cardW - 0.28, h: titleCfg.h || 0.45,
        fontSize: titleCfg.fontSize || 18,
        color: accent ? COLORS.white : COLORS.primary, bold: titleCfg.bold ?? true,
        valign: 'top', fontFace: titleCfg.fontFamily || FONTS.heading,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: x + (descCfg.xOffset ?? 0.14), y: startY + (descCfg.yOffset ?? 1.21),
          w: descCfg.w || cardW - 0.28, h: descCfg.h || 1.0,
          fontSize: descCfg.fontSize || 11,
          color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top',
          fontFace: descCfg.fontFamily || FONTS.body,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06TechLandscape(slide: PptxSlide, props: Theme06TechLandscapeProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const topics = (props.topics || []).filter((t) => t != null).slice(0, 6);
  if (topics.length === 0) {
    addTheme06GlowLine(slide);
    return;
  }
  if (coords.topics) {
    const tp = coords.topics;
    const cols = tp.cols || 3;
    const cardW = tp.cardW || 2.78;
    const cardH = tp.cardH || 1.38;
    const gapX = tp.gapX || 0.18;
    const gapY = tp.gapY || 0.14;
    const startX = tp.startX || 0.65;
    const startY = tp.startY || 2.35;
    const valueCfg = tp.value || {};
    const titleCfg = tp.title || {};
    const descCfg = tp.description || {};

    topics.forEach((topic, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const accent = !!topic.accent;
      addTheme06Card(slide, x, y, cardW, cardH, accent);

      if (topic.value) {
        const vW = valueCfg.w || 0.5;
        slide.addText(topic.value, {
          x: x + cardW - vW - 0.12, y: y + (valueCfg.yOffset ?? 0.12),
          w: vW, h: valueCfg.h || 0.24,
          fontSize: valueCfg.fontSize || 10,
          color: accent ? COLORS.white : COLORS.accent, bold: valueCfg.bold ?? true,
          align: 'right', fontFace: valueCfg.fontFamily || FONTS.mono,
        });
      }
      slide.addText(topic.title ?? '', {
        x: x + (titleCfg.xOffset ?? 0.14), y: y + (titleCfg.yOffset ?? 0.38),
        w: titleCfg.w || cardW - 0.28, h: titleCfg.h || 0.36,
        fontSize: titleCfg.fontSize || 15,
        color: accent ? COLORS.white : COLORS.primary, bold: titleCfg.bold ?? true,
        valign: 'top', fontFace: titleCfg.fontFamily || FONTS.heading,
      });
      if (topic.description) {
        slide.addText(topic.description, {
          x: x + (descCfg.xOffset ?? 0.14), y: y + (descCfg.yOffset ?? 0.76),
          w: descCfg.w || cardW - 0.28, h: descCfg.h || cardH - 0.86,
          fontSize: descCfg.fontSize || 10,
          color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top',
          fontFace: descCfg.fontFamily || FONTS.body,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ChainFlow(slide: PptxSlide, props: Theme06ChainFlowProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const steps = (props.steps || []).filter((s) => s != null).slice(0, 6);
  if (steps.length > 0 && coords.steps) {
    const st = coords.steps;
    const gap = st.gap || 0.16;
    const cardH = st.cardH || 1.8;
    const startX = st.startX || 0.65;
    const startY = st.startY || 2.45;
    const cardW = (8.7 - gap * (steps.length - 1)) / steps.length;
    const numCfg = st.number || {};
    const labelCfg = st.label || {};
    const descCfg = st.description || {};
    const valueCfg = st.value || {};

    // connector line
    if (coords.connector) {
      const connY = coords.connector.y || (startY + 0.45);
      const connWidth = coords.connector.lineWidth || 1.5;
      slide.addShape('line', {
        x1: startX + cardW / 2, y1: connY,
        x2: startX + (steps.length - 1) * (cardW + gap) + cardW / 2, y2: connY,
        line: { color: COLORS.border, width: connWidth },
      } as any);
    }

    steps.forEach((step, idx) => {
      const x = startX + idx * (cardW + gap);
      const accent = idx === 0 || idx === steps.length - 1;
      addTheme06Card(slide, x, startY, cardW, cardH, accent);

      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + (numCfg.xOffset ?? 0.12), y: startY + (numCfg.yOffset ?? 0.12),
        w: numCfg.w || 0.5, h: numCfg.h || 0.24,
        fontSize: numCfg.fontSize || 10,
        color: accent ? COLORS.white : COLORS.accent, bold: numCfg.bold ?? true,
        fontFace: numCfg.fontFamily || FONTS.mono,
      });

      slide.addText(step.label ?? '', {
        x: x + (labelCfg.xOffset ?? 0.12), y: startY + (labelCfg.yOffset ?? 0.42),
        w: cardW - 0.24, h: labelCfg.h || 0.36,
        fontSize: labelCfg.fontSize || 14,
        color: accent ? COLORS.white : COLORS.primary, bold: labelCfg.bold ?? true,
        valign: 'top', fontFace: labelCfg.fontFamily || FONTS.heading,
      });

      if (step.description) {
        slide.addText(step.description, {
          x: x + (descCfg.xOffset ?? 0.12), y: startY + (descCfg.yOffset ?? 0.8),
          w: cardW - 0.24, h: descCfg.h || 0.5,
          fontSize: descCfg.fontSize || 9,
          color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top',
          fontFace: descCfg.fontFamily || FONTS.body,
        });
      }

      if (step.value) {
        slide.addText(step.value, {
          x: x + (valueCfg.xOffset ?? 0.12), y: startY + cardH - (valueCfg.yOffsetBottom ?? 0.36),
          w: cardW - 0.24, h: valueCfg.h || 0.24,
          fontSize: valueCfg.fontSize || 12,
          color: accent ? COLORS.white : COLORS.accent, bold: valueCfg.bold ?? true,
          align: valueCfg.align || 'right', fontFace: valueCfg.fontFamily || FONTS.mono,
        });
      }
    });
  }

  if (props.footnote && coords.footnote) {
    const f = coords.footnote;
    slide.addText(props.footnote, {
      x: f.x, y: f.y, w: f.w || 8.7, h: f.h || 0.2,
      fontSize: f.fontSize || 9, color: COLORS.secondary,
      align: f.align || 'center', fontFace: f.fontFamily || FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06DealMap(slide: PptxSlide, props: Theme06DealMapProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.6,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const nodes = (props.nodes || []).filter((n) => n != null && n.name).slice(0, 12);
  if (nodes.length > 0 && coords.nodes) {
    const n = coords.nodes;
    const maxCols = n.maxCols || 4;
    const maxRowsPerCol = n.maxRowsPerCol || 4;
    const colW = n.colW || 1.9;
    const colGap = n.colGap || 0.25;
    const rowGap = n.rowGap || 0.65;
    const rowH = n.rowH || 0.55;
    const startX = n.startX || 0.65;
    const startY = n.startY || 2.25;
    const nameCfg = n.name || {};

    // Group nodes by category
    const grouped: Record<number, Array<{ name?: string; category?: number }>> = {};
    nodes.forEach((node) => {
      const cat = node.category ?? 0;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(node);
    });
    const cats = Object.keys(grouped).slice(0, maxCols).map((k) => Number(k));

    cats.forEach((cat, colIdx) => {
      const x = startX + colIdx * (colW + colGap);
      grouped[cat].slice(0, maxRowsPerCol).forEach((node, rowIdx) => {
        const y = startY + rowIdx * rowGap;
        const accent = cat === 2;
        addTheme06Card(slide, x, y, colW, rowH, accent);
        slide.addText(node.name ?? '', {
          x: x + (nameCfg.xOffset ?? 0.1), y: y + (nameCfg.yOffset ?? 0.14),
          w: nameCfg.w || colW - 0.2, h: nameCfg.h || 0.32,
          fontSize: nameCfg.fontSize || 11,
          color: accent ? COLORS.white : COLORS.primary, bold: nameCfg.bold ?? true,
          align: nameCfg.align || 'center', fontFace: nameCfg.fontFamily || FONTS.heading,
        });
      });
    });
  }

  if (props.conclusion && coords.conclusion) {
    const c = coords.conclusion;
    const cardX = c.cardX || 6.8;
    const cardY = c.cardY || 2.25;
    const cardW = c.cardW || 2.55;
    const cardH = c.cardH || 2.4;
    const textCfg = c.text || {};
    addTheme06Card(slide, cardX, cardY, cardW, cardH, true);
    slide.addText(props.conclusion, {
      x: textCfg.x || cardX + 0.15, y: textCfg.y || cardY + 0.2,
      w: textCfg.w || cardW - 0.3, h: textCfg.h || cardH - 0.4,
      fontSize: textCfg.fontSize || 12,
      color: COLORS.white, valign: 'top', fontFace: textCfg.fontFamily || FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06SectorSpotlight(slide: PptxSlide, props: Theme06SectorSpotlightProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  if (props.title && coords.title) {
    slide.addText(props.title, {
      x: coords.title.x, y: coords.title.y, w: coords.title.w || 8.7, h: coords.title.h || 0.7,
      fontSize: coords.title.fontSize || 38,
      color: COLORS.primary, bold: coords.title.bold ?? true,
      fontFace: coords.title.fontFamily || FONTS.heading,
    });
  }

  if (props.subtitle && coords.subtitle) {
    slide.addText(props.subtitle, {
      x: coords.subtitle.x, y: coords.subtitle.y, w: coords.subtitle.w || 8.7, h: coords.subtitle.h || 0.3,
      fontSize: coords.subtitle.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.subtitle.fontFamily || FONTS.body,
    });
  }

  const takeaways = (props.takeaways || [])
    .map((t) => (typeof t === 'string' ? t : (t as any)?.text ?? ''))
    .filter(Boolean)
    .slice(0, 5);
  if (takeaways.length > 0 && coords.takeaways) {
    const t = coords.takeaways;
    const cardH = t.cardH || 0.62;
    const gap = t.gap || 0.12;
    const startX = t.startX || 0.65;
    const startY = t.startY || 2.35;
    const dotCfg = t.dot || {};
    const textCfg = t.text || {};
    const mainW = 4.6;

    takeaways.forEach((text, idx) => {
      const y = startY + idx * (cardH + gap);
      addTheme06Card(slide, startX, y, mainW, cardH);
      slide.addShape('ellipse', {
        x: startX + (dotCfg.xOffset ?? 0.14), y: y + (dotCfg.yOffset ?? 0.18),
        w: dotCfg.w || 0.14, h: dotCfg.h || 0.14,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(text, {
        x: startX + (textCfg.xOffset ?? 0.4), y: y + (textCfg.yOffset ?? 0.08),
        w: textCfg.w || mainW - 0.54, h: textCfg.h || cardH - 0.16,
        fontSize: textCfg.fontSize || 13,
        color: COLORS.primary, valign: 'middle',
        fontFace: textCfg.fontFamily || FONTS.body,
      });
    });
  }

  const highlights = (props.highlights || []).filter((h) => h != null).slice(0, 4);
  let highlightBottom = 2.35;
  if (highlights.length > 0 && coords.highlights) {
    const h = coords.highlights;
    const cols = h.cols || 2;
    const cellW = h.cellW || 1.81;
    const cellH = h.cellH || 0.9;
    const gapX = h.gapX || 0.18;
    const gapY = h.gapY || 0.14;
    const startX = h.startX || 5.55;
    const startY = h.startY || 2.35;
    const valueCfg = h.value || {};
    const labelCfg = h.label || {};

    highlights.forEach((item, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cellW + gapX);
      const y = startY + row * (cellH + gapY);
      highlightBottom = Math.max(highlightBottom, y + cellH);
      const accent = !!item.accent;
      addTheme06Card(slide, x, y, cellW, cellH, accent);
      slide.addText(item.value ?? '', {
        x: x + (valueCfg.xOffset ?? 0.12), y: y + (valueCfg.yOffset ?? 0.12),
        w: valueCfg.w || cellW - 0.24, h: valueCfg.h || 0.34,
        fontSize: valueCfg.fontSize || 22,
        color: accent ? COLORS.white : COLORS.primary, bold: valueCfg.bold ?? true,
        fontFace: valueCfg.fontFamily || FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + (labelCfg.xOffset ?? 0.12), y: y + (labelCfg.yOffset ?? 0.5),
        w: labelCfg.w || cellW - 0.24, h: labelCfg.h || 0.22,
        fontSize: labelCfg.fontSize || 9,
        color: accent ? 'FFFFFF' : COLORS.secondary,
        fontFace: labelCfg.fontFamily || FONTS.body,
      });
    });
  }

  if (props.insight && coords.insight) {
    const ins = props.insight;
    const hasInsight = ins.value || ins.label || ins.description;
    if (hasInsight) {
      const ic = coords.insight;
      const insightX = ic.x || 5.55;
      const insightW = 3.8;
      const insightY = highlightBottom + 0.18;
      const minH = ic.minH || 0.6;
      const insightH = Math.max(minH, 5.18 - insightY - 0.25);
      if (insightH > 0.6) {
        addTheme06Card(slide, insightX, insightY, insightW, insightH, true);
        const valueCfg = ic.value || {};
        const labelCfg = ic.label || {};
        const descCfg = ic.description || {};
        let cy = insightY + 0.16;
        if (ins.value) {
          slide.addText(ins.value, {
            x: insightX + (valueCfg.xOffset ?? 0.16), y: cy,
            w: valueCfg.w || insightW - 0.32, h: valueCfg.h || 0.42,
            fontSize: valueCfg.fontSize || 26,
            color: COLORS.white, bold: valueCfg.bold ?? true,
            fontFace: valueCfg.fontFamily || FONTS.heading,
          });
          cy += (valueCfg.h || 0.42) + 0.04;
        }
        if (ins.label) {
          slide.addText(ins.label, {
            x: insightX + (labelCfg.xOffset ?? 0.16), y: cy,
            w: labelCfg.w || insightW - 0.32, h: labelCfg.h || 0.2,
            fontSize: labelCfg.fontSize || 10,
            color: COLORS.white,
            fontFace: labelCfg.fontFamily || FONTS.body,
          });
          cy += (labelCfg.h || 0.2) + 0.04;
        }
        if (ins.description) {
          slide.addText(ins.description, {
            x: insightX + (descCfg.xOffset ?? 0.16), y: cy,
            w: descCfg.w || insightW - 0.32, h: Math.max(0.3, insightH - (cy - insightY) - 0.2),
            fontSize: descCfg.fontSize || 10,
            color: COLORS.white, valign: 'top',
            fontFace: descCfg.fontFamily || FONTS.body,
          });
        }
      }
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06CompanyProfile(slide: PptxSlide, props: Theme06CompanyProfileProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  const mainW = coords.company?.w || 5.0;

  if (props.company && coords.company) {
    slide.addText(props.company, {
      x: coords.company.x, y: coords.company.y, w: coords.company.w || mainW, h: coords.company.h || 0.7,
      fontSize: coords.company.fontSize || 34,
      color: COLORS.primary, bold: coords.company.bold ?? true,
      fontFace: coords.company.fontFamily || FONTS.heading,
    });
  }

  if (props.tagline && coords.tagline) {
    slide.addText(props.tagline, {
      x: coords.tagline.x, y: coords.tagline.y, w: coords.tagline.w || mainW, h: coords.tagline.h || 0.45,
      fontSize: coords.tagline.fontSize || 12,
      color: COLORS.secondary,
      fontFace: coords.tagline.fontFamily || FONTS.body,
    });
  }

  const facts = (props.facts || []).filter((f) => f != null).slice(0, 4);
  let metricsStartY = 2.45;
  if (facts.length > 0 && coords.facts) {
    const f = coords.facts;
    const cols = f.cols || 2;
    const cardW = f.cardW || 2.41;
    const cardH = f.cardH || 0.72;
    const gapX = f.gapX || 0.18;
    const gapY = f.gapY || 0.14;
    const startX = f.startX || 0.65;
    const startY = f.startY || 2.45;
    const labelCfg = f.label || {};
    const valueCfg = f.value || {};
    const factsRows = Math.ceil(facts.length / cols);
    metricsStartY = startY + factsRows * cardH + (factsRows - 1) * gapY + 0.18;

    facts.forEach((fact, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH);
      slide.addText(fact.label ?? '', {
        x: x + (labelCfg.xOffset ?? 0.12), y: y + (labelCfg.yOffset ?? 0.1),
        w: labelCfg.w || cardW - 0.24, h: labelCfg.h || 0.2,
        fontSize: labelCfg.fontSize || 9,
        color: COLORS.secondary,
        fontFace: labelCfg.fontFamily || FONTS.body,
      });
      slide.addText(fact.value ?? '', {
        x: x + (valueCfg.xOffset ?? 0.12), y: y + (valueCfg.yOffset ?? 0.3),
        w: valueCfg.w || cardW - 0.24, h: valueCfg.h || 0.28,
        fontSize: valueCfg.fontSize || 16,
        color: COLORS.primary, bold: valueCfg.bold ?? true,
        fontFace: valueCfg.fontFamily || FONTS.heading,
      });
    });
  }

  const metrics = (props.metrics || []).filter((m) => m != null).slice(0, 3);
  if (metrics.length > 0 && coords.metrics) {
    const m = coords.metrics;
    const gapX = m.gapX || 0.18;
    const cardH = m.cardH || 1.0;
    const startX = m.startX || 0.65;
    const startY = m.startY || metricsStartY;
    const cardW = (mainW - gapX * (metrics.length - 1)) / metrics.length;
    const valueCfg = m.value || {};
    const labelCfg = m.label || {};

    metrics.forEach((metric, idx) => {
      const x = startX + idx * (cardW + gapX);
      const accent = idx === 0;
      addTheme06Card(slide, x, startY, cardW, cardH, accent);
      slide.addText(metric.value ?? '', {
        x: x + (valueCfg.xOffset ?? 0.12), y: startY + (valueCfg.yOffset ?? 0.16),
        w: cardW - 0.24, h: valueCfg.h || 0.36,
        fontSize: valueCfg.fontSize || 22,
        color: accent ? COLORS.white : COLORS.primary, bold: valueCfg.bold ?? true,
        fontFace: valueCfg.fontFamily || FONTS.heading,
      });
      slide.addText(metric.label ?? '', {
        x: x + (labelCfg.xOffset ?? 0.12), y: startY + (labelCfg.yOffset ?? 0.56),
        w: cardW - 0.24, h: labelCfg.h || 0.26,
        fontSize: labelCfg.fontSize || 10,
        color: accent ? 'FFFFFF' : COLORS.secondary,
        fontFace: labelCfg.fontFamily || FONTS.body,
      });
    });
  }

  if (props.narrative && coords.narrative) {
    const nar = coords.narrative;
    const blocks: string[] = nar.blocks || ['challenge', 'solution', 'result'];
    const labels: string[] = nar.labels || ['挑战', '方案', '成果'];
    const blockH = nar.blockH || 1.25;
    const gap = nar.gap || 0.12;
    const startX = nar.startX || 5.9;
    const startY = nar.startY || 1.15;
    const blockW = nar.blockW || 3.45;
    const titleCfg = nar.title || {};
    const textCfg = nar.text || {};

    const narrative = props.narrative;
    const items = blocks.map((key: string, idx: number) => ({
      title: labels[idx],
      text: (narrative as any)[key],
    })).filter((b: any) => b.text);

    items.forEach((item, idx) => {
      const y = startY + idx * (blockH + gap);
      addTheme06Card(slide, startX, y, blockW, blockH);
      slide.addText(item.title, {
        x: startX + (titleCfg.xOffset ?? 0.14), y: y + (titleCfg.yOffset ?? 0.12),
        w: titleCfg.w || blockW - 0.28, h: titleCfg.h || 0.22,
        fontSize: titleCfg.fontSize || 10,
        color: COLORS.accent, bold: titleCfg.bold ?? true,
        fontFace: titleCfg.fontFamily || FONTS.mono,
      });
      slide.addText(item.text, {
        x: startX + (textCfg.xOffset ?? 0.14), y: y + (textCfg.yOffset ?? 0.36),
        w: textCfg.w || blockW - 0.28, h: textCfg.h || blockH - 0.48,
        fontSize: textCfg.fontSize || 11,
        color: COLORS.primary, valign: 'top',
        fontFace: textCfg.fontFamily || FONTS.body,
      });
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06CompanySpotlight(slide: PptxSlide, props: Theme06CompanySpotlightProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);

  if (props.kicker && coords.kicker) {
    slide.addText(props.kicker, {
      x: coords.kicker.x, y: coords.kicker.y, w: coords.kicker.w || 4.0, h: coords.kicker.h || 0.25,
      fontSize: coords.kicker.fontSize || 11,
      color: COLORS.accent,
      fontFace: coords.kicker.fontFamily || FONTS.mono,
      bold: coords.kicker.bold ?? true,
    });
  }

  const mainW = 5.0;

  if (props.company && coords.company) {
    slide.addText(props.company, {
      x: coords.company.x, y: coords.company.y, w: coords.company.w || mainW, h: coords.company.h || 0.7,
      fontSize: coords.company.fontSize || 36,
      color: COLORS.primary, bold: coords.company.bold ?? true,
      fontFace: coords.company.fontFamily || FONTS.heading,
    });
  }

  if (props.tagline && coords.tagline) {
    slide.addText(props.tagline, {
      x: coords.tagline.x, y: coords.tagline.y, w: coords.tagline.w || mainW, h: coords.tagline.h || 0.3,
      fontSize: coords.tagline.fontSize || 13,
      color: COLORS.secondary,
      fontFace: coords.tagline.fontFamily || FONTS.body,
    });
  }

  if (props.description && coords.description) {
    slide.addText(props.description, {
      x: coords.description.x, y: coords.description.y, w: coords.description.w || mainW, h: coords.description.h || 0.8,
      fontSize: coords.description.fontSize || 11,
      color: COLORS.primary,
      fontFace: coords.description.fontFamily || FONTS.body,
    });
  }

  // Meta badges (stage/location/founded)
  if (coords.metaBadges) {
    const mb = coords.metaBadges;
    const fields: string[] = mb.fields || ['stage', 'location', 'founded'];
    const badgeW = mb.badgeW || 1.35;
    const badgeH = mb.badgeH || 0.3;
    const gap = mb.gap || 1.45;
    const startX = mb.startX || 0.65;
    const badgeY = mb.y || 3.15;

    const metaTexts: string[] = [];
    fields.forEach((field: string) => {
      const val = (props as any)[field];
      if (val) {
        metaTexts.push(field === 'founded' ? `成立于 ${val}` : val);
      }
    });

    metaTexts.slice(0, mb.maxItems || 3).forEach((text, idx) => {
      const x = startX + idx * gap;
      addTheme06Badge(slide, x, badgeY, badgeW, badgeH, text);
    });
  }

  const metrics = (props.metrics || []).filter((m) => m != null).slice(0, 4);
  if (metrics.length > 0 && coords.metrics) {
    const m = coords.metrics;
    const cols = m.cols || 2;
    const cardW = m.cardW || 2.44;
    const cardH = m.cardH || 0.78;
    const gap = m.gap || 0.12;
    const startX = m.startX || 0.65;
    const startY = m.startY || 3.57;
    const valueCfg = m.value || {};
    const labelCfg = m.label || {};

    metrics.forEach((metric, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      const accent = idx === 0;
      addTheme06Card(slide, x, y, cardW, cardH, accent);
      slide.addText(metric.value ?? '', {
        x: x + (valueCfg.xOffset ?? 0.1), y: y + (valueCfg.yOffset ?? 0.1),
        w: valueCfg.w || cardW - 0.2, h: valueCfg.h || 0.32,
        fontSize: valueCfg.fontSize || 20,
        color: accent ? COLORS.white : COLORS.primary, bold: valueCfg.bold ?? true,
        fontFace: valueCfg.fontFamily || FONTS.heading,
      });
      slide.addText(metric.label ?? '', {
        x: x + (labelCfg.xOffset ?? 0.1), y: y + (labelCfg.yOffset ?? 0.44),
        w: labelCfg.w || cardW - 0.2, h: labelCfg.h || 0.2,
        fontSize: labelCfg.fontSize || 9,
        color: accent ? 'FFFFFF' : COLORS.secondary,
        fontFace: labelCfg.fontFamily || FONTS.body,
      });
    });
  }

  const highlights = (props.highlights || []).filter((h) => h != null).slice(0, 4);
  if (highlights.length > 0 && coords.highlights) {
    const h = coords.highlights;
    const blockH = h.blockH || 0.92;
    const gap = h.gap || 0.1;
    const startX = h.startX || 5.9;
    const startY = h.startY || 1.15;
    const blockW = 3.45;
    const titleCfg = h.title || {};
    const descCfg = h.description || {};

    highlights.forEach((item, idx) => {
      const y = startY + idx * (blockH + gap);
      addTheme06Card(slide, startX, y, blockW, blockH);
      slide.addText(item.title ?? '', {
        x: startX + (titleCfg.xOffset ?? 0.12), y: y + (titleCfg.yOffset ?? 0.1),
        w: titleCfg.w || blockW - 0.24, h: titleCfg.h || 0.22,
        fontSize: titleCfg.fontSize || 12,
        color: COLORS.accent, bold: titleCfg.bold ?? true,
        fontFace: titleCfg.fontFamily || FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: startX + (descCfg.xOffset ?? 0.12), y: y + (descCfg.yOffset ?? 0.34),
          w: descCfg.w || blockW - 0.24, h: descCfg.h || blockH - 0.46,
          fontSize: descCfg.fontSize || 10,
          color: COLORS.primary, valign: 'top',
          fontFace: descCfg.fontFamily || FONTS.body,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06CoverV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.3, w: 6.5, h: 1.4,
    fontSize: 52, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.75, w: 6.5, h: 0.6,
      fontSize: 18, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const asideX = 7.05;
  const asideW = 4.2;
  let metricsStartY = 0.9;

  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, asideX, 0.9, asideW, 2.3);
    metricsStartY = 3.35;
  }

  const metrics = (props.metrics || []).slice(0, 4);
  if (metrics.length > 0) {
    const cardW = 2.0;
    const gapX = 0.2;
    const gapY = 0.16;
    const cardH = 0.88;
    metrics.forEach((m: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = asideX + col * (cardW + gapX);
      const y = metricsStartY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH, !!m.accent);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x: x + 0.12, y: y + 0.12, w: cardW - 0.24, h: 0.38,
        fontSize: 24, color: m.accent ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x: x + 0.12, y: y + 0.5, w: cardW - 0.24, h: 0.22,
        fontSize: 10, color: m.accent ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  addTheme06GlowLine(slide);

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

export function renderTheme06ChapterV1(slide: PptxSlide, props: any): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }

  const topLeftLabel = props.topLeftLabel ?? (props.tag ? `[CH] ${props.tag}` : '[CH] CHAPTER');
  const topRightLabel = props.topRightLabel ?? (props.tag ? `章节 / ${props.tag}` : '章节 / SECTION');

  slide.addText(topLeftLabel, {
    x: 0.65, y: 0.58, w: 4.0, h: 0.25,
    fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
  });
  slide.addText(topRightLabel, {
    x: 5.35, y: 0.58, w: 4.0, h: 0.25,
    fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, bold: true, align: 'right',
  });

  slide.addText(props.number ?? '', {
    x: 0.65, y: 1.45, w: 8.7, h: 1.55,
    fontSize: 130, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(props.title ?? '', {
    x: 0.65, y: 3.05, w: 8.7, h: 0.85,
    fontSize: 46, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 3.9, w: 8.7, h: 0.35,
      fontSize: 15, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.enSubtitle) {
    slide.addText(props.enSubtitle, {
      x: 0.65, y: 4.28, w: 8.7, h: 0.28,
      fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.mono,
    });
  }

  const tags = (props.tags || []).map((t: any) => typeof t === 'string' ? t : t.item ?? '').filter(Boolean).slice(0, 6);
  if (tags.length > 0) {
    let tagX = 0.65;
    const tagY = 4.78;
    const tagH = 0.32;
    tags.forEach((tag: string) => {
      const tagW = Math.min(1.6, (tag.length * 0.13) + 0.35);
      slide.addShape('roundRect', {
        x: tagX, y: tagY, w: tagW, h: tagH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: tagH / 2,
      } as any);
      slide.addText(tag, {
        x: tagX, y: tagY + 0.02, w: tagW, h: tagH - 0.04,
        fontSize: 9, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
      tagX += tagW + 0.12;
    });
  }

  if (props.nextHint) {
    slide.addText(props.nextHint, {
      x: 5.5, y: 4.78, w: 3.85, h: 0.32,
      fontSize: 10, color: COLORS.accent, align: 'right', valign: 'middle', fontFace: FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ContentV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.2, w: 4.2, h: 0.9,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addShape('rect', {
    x: 0.65, y: 2.12, w: 1.4, h: 0.05,
    fill: { color: COLORS.accent },
  } as any);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.35, w: 4.2, h: 0.7,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const bullets = (props.bullets || []).slice(0, 8);
  if (bullets.length > 0) {
    const startX = 5.05;
    const cardW = 4.1;
    bullets.forEach((bullet: any, idx: number) => {
      const text = typeof bullet === 'string' ? bullet : bullet.item ?? '';
      const y = 0.85 + idx * 0.6;
      slide.addShape('ellipse', {
        x: startX + 0.05, y: y + 0.16, w: 0.1, h: 0.1,
        fill: { color: COLORS.accent },
      });
      slide.addText(text, {
        x: startX + 0.3, y, w: cardW - 0.3, h: 0.55,
        fontSize: 16, color: COLORS.primary, align: 'left', valign: 'top', fontFace: FONTS.body,
      });
    });
  }

  const showConclusion = props.showConclusion !== false;
  const conclusion = props.conclusion;
  const hasConclusion = showConclusion && conclusion && (conclusion.value || conclusion.label || conclusion.description);
  if (hasConclusion) {
    const y = 4.55;
    addTheme06Card(slide, 5.05, y, 4.1, 0.85, true);
    let cursorY = y + 0.12;
    if (conclusion.value) {
      slide.addText(conclusion.value, {
        x: 5.25, y: cursorY, w: 3.7, h: 0.35,
        fontSize: 24, color: COLORS.white, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.36;
    }
    if (conclusion.label) {
      slide.addText(conclusion.label, {
        x: 5.25, y: cursorY, w: 3.7, h: 0.2,
        fontSize: 10, color: 'FFFFFF', fontFace: FONTS.body,
      });
      cursorY += 0.22;
    }
    if (conclusion.description) {
      slide.addText(conclusion.description, {
        x: 5.25, y: cursorY, w: 3.7, h: 0.35,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ContentNumberedV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.2, w: 4.2, h: 1.0,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.35, w: 4.2, h: 0.7,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || [])
    .map((item: any) => ({
      number: item.number ?? '',
      title: item.title ?? '',
      enLabel: item.enLabel ?? '',
      active: item.active === true,
    }))
    .slice(0, 4);

  const startX = 5.05;
  const cardW = 4.1;
  const cardH = 0.78;
  const gap = 0.14;
  items.forEach((item: any, idx: number) => {
    const y = 0.78 + idx * (cardH + gap);
    addTheme06Card(slide, startX, y, cardW, cardH, item.active);
    const textColor = item.active ? COLORS.white : COLORS.primary;
    const numColor = item.active ? COLORS.white : COLORS.secondary;
    slide.addText(item.number, {
      x: startX + 0.18, y: y + 0.22, w: 0.5, h: 0.34,
      fontSize: 13, color: numColor, bold: true, align: 'left', valign: 'middle', fontFace: FONTS.mono,
    });
    slide.addText(item.title, {
      x: startX + 0.75, y: y + 0.18, w: 2.0, h: 0.42,
      fontSize: 18, color: textColor, bold: true, align: 'left', valign: 'middle', fontFace: FONTS.heading,
    });
    if (item.enLabel) {
      slide.addText(item.enLabel, {
        x: startX + 2.8, y: y + 0.24, w: 1.1, h: 0.3,
        fontSize: 8, color: item.active ? COLORS.white : COLORS.secondary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.1, w: 8.7, h: 0.25,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06MetricHeroV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.8,
    fontSize: 38, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.95, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  slide.addText(props.value ?? '', {
    x: 0.65, y: 2.6, w: 8.7, h: 1.2,
    fontSize: 84, color: COLORS.accent, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: 0.65, y: 3.6, w: 8.7, h: 0.35,
      fontSize: 22, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });
  }

  if (props.change || props.changeLabel) {
    const badgeW = 2.4;
    const badgeX = (10 - badgeW) / 2;
    slide.addShape('roundRect', {
      x: badgeX, y: 4.05, w: badgeW, h: 0.42,
      fill: { color: COLORS.accent },
      rectRadius: 0.21,
    } as any);
    const text = [props.change, props.changeLabel].filter(Boolean).join('  ');
    slide.addText(text, {
      x: badgeX, y: 4.07, w: badgeW, h: 0.38,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06VerticalBarV1(slide: PptxSlide, props: any): void {
  const topLeftLabel = props.topLeftLabel ?? '';
  const topRightLabel = props.topRightLabel ?? '';

  slide.addText(topLeftLabel, {
    x: 0.65, y: 0.58, w: 4.0, h: 0.25,
    fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
  });
  slide.addText(topRightLabel, {
    x: 5.35, y: 0.58, w: 4.0, h: 0.25,
    fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, bold: true, align: 'right',
  });

  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.05, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });

  const leftX = 0.65;
  const leftW = 4.0;
  const rightX = 5.05;
  const rightW = 4.1;

  if (props.badge) {
    const badgeW = 2.4;
    slide.addShape('roundRect', {
      x: leftX, y: 1.85, w: badgeW, h: 0.32,
      fill: { color: COLORS.accent },
      rectRadius: 0.16,
    } as any);
    slide.addText(props.badge, {
      x: leftX, y: 1.86, w: badgeW, h: 0.3,
      fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }

  slide.addText(props.value ?? '', {
    x: leftX, y: 2.35, w: leftW, h: 1.0,
    fontSize: 90, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: leftX + 2.0, y: 2.95, w: 1.5, h: 0.35,
      fontSize: 22, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.valueLabel) {
    slide.addText(props.valueLabel, {
      x: leftX, y: 3.35, w: leftW, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }

  const metrics = (props.metrics || [])
    .map((m: any) => ({
      value: m.value ?? '',
      enLabel: m.enLabel ?? '',
      label: m.label ?? '',
      accent: m.accent === true,
    }))
    .slice(0, 3);
  if (metrics.length > 0) {
    const metricW = leftW / metrics.length - 0.08;
    metrics.forEach((m: any, idx: number) => {
      const mx = leftX + idx * (metricW + 0.12);
      const my = 3.85;
      addTheme06Card(slide, mx, my, metricW, 0.9, m.accent);
      const textColor = m.accent ? COLORS.white : COLORS.primary;
      slide.addText(m.value, {
        x: mx + 0.1, y: my + 0.12, w: metricW - 0.2, h: 0.3,
        fontSize: 18, color: textColor, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (m.enLabel) {
        slide.addText(m.enLabel, {
          x: mx + 0.1, y: my + 0.42, w: metricW - 0.2, h: 0.16,
          fontSize: 7, color: m.accent ? COLORS.white : COLORS.secondary, fontFace: FONTS.mono,
        });
      }
      slide.addText(m.label, {
        x: mx + 0.1, y: my + 0.58, w: metricW - 0.2, h: 0.2,
        fontSize: 9, color: m.accent ? COLORS.white : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    });
  }

  if (props.segmentTitle) {
    slide.addText(props.segmentTitle, {
      x: rightX, y: 1.85, w: rightW, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, bold: true,
    });
  }

  const segments = (props.segments || [])
    .map((s: any) => ({
      label: s.label ?? '',
      enLabel: s.enLabel ?? '',
      value: Number(s.value) || 0,
      accent: s.accent === true,
    }))
    .slice(0, 6);
  if (segments.length > 0) {
    const maxValue = Math.max(1, ...segments.map((s: any) => s.value));
    segments.forEach((s: any, idx: number) => {
      const sy = 2.25 + idx * 0.55;
      slide.addText(s.label, {
        x: rightX, y: sy, w: 1.8, h: 0.2,
        fontSize: 12, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
      });
      slide.addText(`${s.value}%`, {
        x: rightX + 2.4, y: sy, w: 0.7, h: 0.2,
        fontSize: 10, color: s.accent ? COLORS.accent : COLORS.secondary, bold: true, align: 'right', fontFace: FONTS.mono,
      });
      if (s.enLabel) {
        slide.addText(s.enLabel, {
          x: rightX, y: sy + 0.2, w: 2.0, h: 0.14,
          fontSize: 7, color: COLORS.secondary, fontFace: FONTS.mono,
        });
      }
      const trackY = sy + (s.enLabel ? 0.36 : 0.22);
      slide.addShape('roundRect', {
        x: rightX, y: trackY, w: rightW, h: 0.06,
        fill: { color: COLORS.surfaceElevated },
        rectRadius: 0.03,
      } as any);
      const fillW = (s.value / maxValue) * rightW;
      if (fillW > 0) {
        slide.addShape('roundRect', {
          x: rightX, y: trackY, w: fillW, h: 0.06,
          fill: { color: s.accent ? COLORS.accent : COLORS.secondary },
          rectRadius: 0.03,
        } as any);
      }
    });
  }

  if (props.insight) {
    slide.addText(props.insight, {
      x: leftX, y: 4.95, w: 5.0, h: 0.25,
      fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 5.5, y: 4.95, w: 3.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ChartV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = props.labels || [];
  const data = props.data || [];
  const showConclusion = props.showConclusion !== false;
  const conclusion = props.conclusion;
  const hasConclusion = showConclusion && conclusion && (conclusion.value || conclusion.label || conclusion.description);
  const chartW = hasConclusion ? 5.6 : 8.7;

  if (labels.length > 0 && data.length > 0) {
    const chartType = props.type === 'line' ? 'line' : 'bar';
    slide.addChart(chartType as 'bar' | 'line', [{
      name: props.title || '',
      labels: labels.map((l: any) => (typeof l === 'string' ? l : l.item ?? '')),
      values: data.map((d: any) => (typeof d === 'number' ? d : Number(d.item ?? 0) || 0)),
    }], {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: [COLORS.accent],
      showValue: true,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 10,
    });
  } else {
    slide.addText('（暂无图表数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (props.unit) {
    addTheme06Card(slide, 6.45, 2.25, 2.9, 0.7);
    slide.addText('单位', {
      x: 6.6, y: 2.32, w: 2.6, h: 0.2,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
    });
    slide.addText(props.unit, {
      x: 6.6, y: 2.52, w: 2.6, h: 0.35,
      fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
  }

  if (hasConclusion) {
    const panelY = props.unit ? 3.05 : 2.25;
    const panelH = props.unit ? 2.2 : 3.0;
    addTheme06Card(slide, 6.45, panelY, 2.9, panelH, true);
    let cursorY = panelY + 0.18;
    if (conclusion.value) {
      slide.addText(conclusion.value, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.55,
        fontSize: 32, color: COLORS.white, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.58;
    }
    if (conclusion.label) {
      slide.addText(conclusion.label, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.25,
        fontSize: 10, color: 'FFFFFF', fontFace: FONTS.body,
      });
      cursorY += 0.32;
    }
    if (conclusion.description) {
      slide.addText(conclusion.description, {
        x: 6.65, y: cursorY, w: 2.5, h: panelH - (cursorY - panelY) - 0.25,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06QuoteV1(slide: PptxSlide, props: any): void {
  slide.addShape('rect', {
    x: 0.65, y: 0.9, w: 0.12, h: 4.0,
    fill: { color: COLORS.accent },
  } as any);
  slide.addText('“', {
    x: 1.0, y: 1.0, w: 1.0, h: 0.7,
    fontSize: 80, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(props.quote ?? '', {
    x: 1.0, y: 1.9, w: 7.5, h: 2.4,
    fontSize: 32, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.source) {
    slide.addText(props.source, {
      x: 1.0, y: 4.4, w: 7.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06MetricGridV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 4);
  if (metrics.length > 0) {
    const cardW = 4.2;
    const cardH = 1.5;
    const gapX = 0.4;
    const gapY = 0.2;
    const startX = 0.65;
    const startY = 2.3;
    metrics.forEach((m: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const accent = !!m.accent;
      addTheme06Card(slide, x, y, cardW, cardH, accent);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x: x + 0.16, y: y + 0.16, w: cardW - 0.32, h: 0.55,
        fontSize: 34, color: accent ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x: x + 0.16, y: y + 0.72, w: cardW - 0.32, h: 0.25,
        fontSize: 11, color: accent ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
      if (m.change) {
        const color = String(m.change).startsWith('-') ? 'E85D4E' : COLORS.accent;
        slide.addText(m.change, {
          x: x + 0.16, y: y + cardH - 0.42, w: cardW - 0.32, h: 0.24,
          fontSize: 12, color: accent ? 'FFFFFF' : color, bold: true, align: 'right', fontFace: FONTS.mono,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06RankV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const rows = (props.rows || []).slice(0, 8);
  const focusIndex = Number(props.focusIndex) || 0;
  if (rows.length > 0) {
    const rowH = 0.42;
    const gap = 0.08;
    const startY = 2.3;
    rows.forEach((row: any, idx: number) => {
      const y = startY + idx * (rowH + gap);
      const focus = row.focus || idx === focusIndex;
      addTheme06Card(slide, 0.65, y, 8.7, rowH, focus);
      slide.addText(String(idx + 1), {
        x: 0.85, y, w: 0.5, h: rowH,
        fontSize: 18, color: focus ? COLORS.white : COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
      slide.addText(row.name ?? '', {
        x: 1.5, y, w: 4.5, h: rowH,
        fontSize: 15, color: focus ? COLORS.white : COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
      });
      slide.addText(row.value ?? '', {
        x: 6.0, y, w: 1.5, h: rowH,
        fontSize: 14, color: focus ? COLORS.white : COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
      });
      if (row.change) {
        const color = String(row.change).startsWith('-') ? 'E85D4E' : (focus ? COLORS.white : COLORS.accent);
        slide.addText(row.change, {
          x: 7.7, y, w: 1.4, h: rowH,
          fontSize: 12, color, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06MatrixV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const cells = (props.cells || []).slice(0, 4);
  const focusIndex = Number(props.focusIndex) || 0;
  if (cells.length > 0) {
    const cellW = 2.85;
    const cellH = 1.4;
    const gap = 0.3;
    const startX = 1.65;
    const startY = 2.35;
    cells.forEach((cell: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (cellW + gap);
      const y = startY + row * (cellH + gap);
      const focus = cell.focus || idx === focusIndex;
      addTheme06Card(slide, x, y, cellW, cellH, focus);
      slide.addText(cell.title ?? '', {
        x: x + 0.14, y: y + 0.12, w: cellW - 0.28, h: 0.35,
        fontSize: 18, color: focus ? COLORS.white : COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (cell.description) {
        slide.addText(cell.description, {
          x: x + 0.14, y: y + 0.5, w: cellW - 0.28, h: cellH - 0.62,
          fontSize: 11, color: focus ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });

    if (props.xAxisLabel) {
      slide.addText(props.xAxisLabel, {
        x: startX + 2 * cellW + gap - 1.2, y: startY + 2 * cellH + gap + 0.05, w: 1.6, h: 0.25,
        fontSize: 11, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
      });
    }
    if (props.yAxisLabel) {
      slide.addText(props.yAxisLabel, {
        x: startX - 1.35, y: startY - 0.35, w: 1.2, h: 0.25,
        fontSize: 11, color: COLORS.secondary, align: 'left', fontFace: FONTS.mono,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ChartRadarV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const indicators = (props.indicators || []).slice(0, 8).map((it: any) => (typeof it === 'string' ? it : it?.item ?? ''));
  const data = (props.data || []).slice(0, indicators.length).map((it: any) => (typeof it === 'number' ? it : Number(it?.item ?? 0) || 0));
  const showConclusion = props.showConclusion !== false;
  const hasConclusion = showConclusion && (props.conclusionValue || props.conclusionLabel || props.conclusionDescription);
  const chartW = hasConclusion ? 5.6 : 8.7;

  if (indicators.length >= 3 && data.length >= 3) {
    slide.addChart('radar', [{
      name: props.title || '',
      labels: indicators,
      values: data,
    }], {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: [COLORS.accent],
      showValue: false,
      showLegend: false,
    } as any);
  } else {
    slide.addText('（暂无雷达图数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (props.unit) {
    addTheme06Card(slide, 6.45, 2.25, 2.9, 0.7);
    slide.addText('单位', {
      x: 6.6, y: 2.32, w: 2.6, h: 0.2,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
    });
    slide.addText(props.unit, {
      x: 6.6, y: 2.52, w: 2.6, h: 0.35,
      fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
  }

  if (hasConclusion) {
    const panelY = props.unit ? 3.05 : 2.25;
    const panelH = props.unit ? 2.2 : 3.0;
    addTheme06Card(slide, 6.45, panelY, 2.9, panelH, true);
    let cursorY = panelY + 0.18;
    if (props.conclusionValue) {
      slide.addText(props.conclusionValue, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.55,
        fontSize: 32, color: COLORS.white, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.58;
    }
    if (props.conclusionLabel) {
      slide.addText(props.conclusionLabel, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.25,
        fontSize: 10, color: 'FFFFFF', fontFace: FONTS.body,
      });
      cursorY += 0.32;
    }
    if (props.conclusionDescription) {
      slide.addText(props.conclusionDescription, {
        x: 6.65, y: cursorY, w: 2.5, h: panelH - (cursorY - panelY) - 0.25,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ChartWaterfallV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels || []).slice(0, 12).map((it: any) => (typeof it === 'string' ? it : it?.item ?? ''));
  const values = (props.values || []).slice(0, 12).map((it: any) => (typeof it === 'number' ? it : Number(it?.item ?? 0) || 0));
  const showConclusion = props.showConclusion !== false;
  const hasConclusion = showConclusion && (props.conclusionValue || props.conclusionLabel || props.conclusionDescription);
  const chartW = hasConclusion ? 5.6 : 8.7;

  if (labels.length >= 2 && values.length >= 2) {
    let cumulative = 0;
    const baseData: number[] = [];
    const positiveData: number[] = [];
    const negativeData: number[] = [];
    values.forEach((v: number) => {
      baseData.push(cumulative);
      if (v >= 0) {
        positiveData.push(v);
        negativeData.push(0);
      } else {
        positiveData.push(0);
        negativeData.push(Math.abs(v));
      }
      cumulative += v;
    });

    slide.addChart('bar' as 'bar', [
      { name: '基础', labels, values: baseData },
      { name: '增加', labels, values: positiveData },
      { name: '减少', labels, values: negativeData },
    ], {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: [COLORS.surface, '666666', 'E85D4E'],
      showValue: true,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 9,
      barGrouping: 'stacked',
      barDir: 'col',
      dataLabelPosition: 'outEnd',
    } as any);
  } else {
    slide.addText('（暂无瀑布图数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (props.unit) {
    addTheme06Card(slide, 6.45, 2.25, 2.9, 0.7);
    slide.addText('单位', {
      x: 6.6, y: 2.32, w: 2.6, h: 0.2,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
    });
    slide.addText(props.unit, {
      x: 6.6, y: 2.52, w: 2.6, h: 0.35,
      fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
  }

  if (hasConclusion) {
    const panelY = props.unit ? 3.05 : 2.25;
    const panelH = props.unit ? 2.2 : 3.0;
    addTheme06Card(slide, 6.45, panelY, 2.9, panelH, true);
    let cursorY = panelY + 0.18;
    if (props.conclusionValue) {
      slide.addText(props.conclusionValue, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.55,
        fontSize: 32, color: COLORS.white, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.58;
    }
    if (props.conclusionLabel) {
      slide.addText(props.conclusionLabel, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.25,
        fontSize: 10, color: 'FFFFFF', fontFace: FONTS.body,
      });
      cursorY += 0.32;
    }
    if (props.conclusionDescription) {
      slide.addText(props.conclusionDescription, {
        x: 6.65, y: cursorY, w: 2.5, h: panelH - (cursorY - panelY) - 0.25,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ChartPeakV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels || []).slice(0, 24).map((it: any) => (typeof it === 'string' ? it : it?.item ?? ''));
  const values = (props.data || []).slice(0, 24).map((it: any) => (typeof it === 'number' ? it : Number(it?.item ?? 0) || 0));
  const showTrough = !!props.showTrough;
  const showConclusion = props.showConclusion !== false;
  const hasConclusion = showConclusion && (props.conclusionValue || props.conclusionLabel || props.conclusionDescription);
  const chartW = hasConclusion ? 5.6 : 8.7;

  if (labels.length >= 2 && values.length >= 2) {
    slide.addChart('line', [{
      name: props.title || '',
      labels,
      values,
    }], {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: [COLORS.accent],
      lineDataSymbol: 'circle',
      lineSmooth: true,
      showLegend: false,
      showValue: false,
    } as any);

    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const maxIndex = values.indexOf(maxVal);
    const minIndex = values.indexOf(minVal);
    const span = Math.max(maxVal - minVal, 1);
    const pointX = (idx: number) => 0.65 + (chartW / Math.max(labels.length - 1, 1)) * idx;
    const pointY = (idx: number) => 2.25 + 3.0 * (1 - (values[idx] - minVal) / span);

    if (values[maxIndex] !== undefined) {
      const px = pointX(maxIndex);
      const py = pointY(maxIndex);
      slide.addText('PEAK', {
        x: px - 0.4, y: Math.max(2.25, py - 0.35), w: 0.8, h: 0.2,
        fontSize: 9, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.mono,
      });
    }
    if (showTrough && values[minIndex] !== undefined) {
      const tx = pointX(minIndex);
      const ty = pointY(minIndex);
      slide.addText('TROUGH', {
        x: tx - 0.45, y: Math.min(5.15, ty + 0.18), w: 0.9, h: 0.2,
        fontSize: 9, color: 'E85D4E', bold: true, align: 'center', fontFace: FONTS.mono,
      });
    }
  } else {
    slide.addText('（暂无峰值图数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (props.unit) {
    addTheme06Card(slide, 6.45, 2.25, 2.9, 0.7);
    slide.addText('单位', {
      x: 6.6, y: 2.32, w: 2.6, h: 0.2,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
    });
    slide.addText(props.unit, {
      x: 6.6, y: 2.52, w: 2.6, h: 0.35,
      fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
  }

  if (hasConclusion) {
    const panelY = props.unit ? 3.05 : 2.25;
    const panelH = props.unit ? 2.2 : 3.0;
    addTheme06Card(slide, 6.45, panelY, 2.9, panelH, true);
    let cursorY = panelY + 0.18;
    if (props.conclusionValue) {
      slide.addText(props.conclusionValue, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.55,
        fontSize: 32, color: COLORS.white, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.58;
    }
    if (props.conclusionLabel) {
      slide.addText(props.conclusionLabel, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.25,
        fontSize: 10, color: 'FFFFFF', fontFace: FONTS.body,
      });
      cursorY += 0.32;
    }
    if (props.conclusionDescription) {
      slide.addText(props.conclusionDescription, {
        x: 6.65, y: cursorY, w: 2.5, h: panelH - (cursorY - panelY) - 0.25,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ProcessV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps || []).slice(0, 6).filter((s: any) => s != null);
  if (steps.length > 0) {
    const gap = 0.24;
    const totalW = 8.7;
    const cardW = (totalW - gap * (steps.length - 1)) / steps.length;
    const startX = 0.65;
    const y = 2.35;
    const h = 3.1;

    steps.forEach((step: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      addTheme06Card(slide, x, y, cardW, h);
      slide.addShape('ellipse', {
        x: x + cardW / 2 - 0.22, y: y + 0.2, w: 0.44, h: 0.44,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + cardW / 2 - 0.22, y: y + 0.2, w: 0.44, h: 0.44,
        fontSize: 14, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
      slide.addText(step.title ?? '', {
        x: x + 0.12, y: y + 0.78, w: cardW - 0.24, h: 0.55,
        fontSize: 16, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
      });
      if (step.description) {
        slide.addText(step.description, {
          x: x + 0.12, y: y + 1.38, w: cardW - 0.24, h: h - 1.55,
          fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
        });
      }
      if (idx < steps.length - 1) {
        slide.addShape('line', {
          x1: x + cardW + 0.02, y1: y + 0.42, x2: x + cardW + gap - 0.02, y2: y + 0.42,
          line: { color: COLORS.accent, width: 1.5, dashType: 'dash' },
        } as any);
      }
    });
  }

  if (props.footnote) {
    addTheme06FooterBilingual(slide, props.footnote);
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06TimelineV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const phases = (props.phases || []).slice(0, 4).filter((p: any) => p != null);
  if (phases.length > 0) {
    const startX = 0.95;
    const endX = 9.35;
    const trackY = 2.55;
    const stepX = phases.length > 1 ? (endX - startX) / (phases.length - 1) : 0;

    slide.addShape('line', {
      x1: startX, y1: trackY, x2: endX, y2: trackY,
      line: { color: COLORS.borderStrong, width: 2 },
    } as any);

    phases.forEach((phase: any, idx: number) => {
      const cx = startX + stepX * idx;
      slide.addShape('ellipse', {
        x: cx - 0.18, y: trackY - 0.18, w: 0.36, h: 0.36,
        fill: { color: COLORS.accent }, line: { color: COLORS.surfaceSolid, width: 3 },
      } as any);
      slide.addText(String(idx + 1), {
        x: cx - 0.18, y: trackY - 0.18, w: 0.36, h: 0.36,
        fontSize: 13, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
      slide.addText(phase.date ?? '', {
        x: cx - 0.9, y: trackY + 0.28, w: 1.8, h: 0.22,
        fontSize: 11, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.mono,
      });
      slide.addText(phase.title ?? '', {
        x: cx - 1.0, y: trackY + 0.55, w: 2.0, h: 0.45,
        fontSize: 13, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.body,
      });

      const cardW = 2.05;
      const cardX = cx - cardW / 2;
      const cardY = 3.55;
      const cardH = 1.8;
      addTheme06Card(slide, cardX, cardY, cardW, cardH);
      slide.addText(phase.title ?? '', {
        x: cardX + 0.12, y: cardY + 0.12, w: cardW - 0.24, h: 0.4,
        fontSize: 15, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (phase.description) {
        slide.addText(phase.description, {
          x: cardX + 0.12, y: cardY + 0.56, w: cardW - 0.24, h: cardH - 0.7,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.footnote) {
    addTheme06FooterBilingual(slide, props.footnote);
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06CaseV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const leftX = 0.65;
  const leftW = 5.2;
  const rightX = 6.05;
  const rightW = 3.3;

  if (props.company) {
    slide.addText(props.company, {
      x: leftX, y: 2.4, w: leftW, h: 0.7,
      fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.tagline) {
    slide.addText(props.tagline, {
      x: leftX, y: 3.15, w: leftW, h: 0.6,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 3);
  if (metrics.length > 0) {
    const mW = (leftW - 0.28) / metrics.length;
    metrics.forEach((m: any, idx: number) => {
      const x = leftX + idx * mW;
      addTheme06Card(slide, x, 4.0, mW - 0.12, 1.25, idx === 0);
      slide.addText(m.value ?? '', {
        x: x + 0.1, y: 4.1, w: mW - 0.32, h: 0.55,
        fontSize: 26, color: idx === 0 ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x: x + 0.1, y: 4.7, w: mW - 0.32, h: 0.35,
        fontSize: 10, color: idx === 0 ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  const cards = [
    { label: '挑战', text: props.challenge },
    { label: '方案', text: props.solution },
    { label: '成果', text: props.result },
  ].filter((c) => c.text);
  const cardH = cards.length > 0 ? (3.35 - 0.12 * (cards.length - 1)) / cards.length : 0;
  cards.forEach((c, idx) => {
    const y = 2.3 + idx * (cardH + 0.12);
    addTheme06Card(slide, rightX, y, rightW, cardH);
    slide.addText(c.label, {
      x: rightX + 0.12, y: y + 0.1, w: rightW - 0.24, h: 0.22,
      fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
    });
    slide.addText(c.text, {
      x: rightX + 0.12, y: y + 0.36, w: rightW - 0.24, h: cardH - 0.48,
      fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  });

  addTheme06GlowLine(slide);
}

export function renderTheme06RiskV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 4);
  if (items.length > 0) {
    const cols = 2;
    const cardW = 4.15;
    const cardH = 1.85;
    const gap = 0.24;
    const startX = 0.65;
    const startY = 2.35;

    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      const level = item.level || 'medium';
      const levelColor = level === 'high' ? 'E85D4E' : level === 'low' ? COLORS.accent2 : COLORS.accent;

      addTheme06Card(slide, x, y, cardW, cardH);
      slide.addShape('rect', {
        x, y, w: 0.08, h: cardH,
        fill: { color: levelColor },
      } as any);
      slide.addText(item.risk ?? '', {
        x: x + 0.18, y: y + 0.14, w: cardW - 0.36, h: 0.4,
        fontSize: 18, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      slide.addText(level === 'high' ? '高风险' : level === 'low' ? '低风险' : '中风险', {
        x: x + 0.18, y: y + 0.56, w: cardW - 0.36, h: 0.22,
        fontSize: 10, color: levelColor, bold: true, fontFace: FONTS.mono,
      });
      if (item.response) {
        slide.addText(item.response, {
          x: x + 0.18, y: y + 0.84, w: cardW - 0.36, h: cardH - 0.98,
          fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.footnote) {
    addTheme06FooterBilingual(slide, props.footnote);
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06RiskV2(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const leftX = 0.65;
  const leftW = 4.5;
  const rightX = 5.35;
  const rightW = 4.0;

  const items = (props.items || [])
    .filter((item: any) => item != null && item.risk != null)
    .slice(0, 4);
  if (items.length > 0) {
    const cardH = (4.45 - 0.12 * (items.length - 1)) / items.length;
    items.forEach((item: any, idx: number) => {
      const y = 2.35 + idx * (cardH + 0.12);
      const level = item.level || 'medium';
      const levelColor = level === 'high' ? 'E85D4E' : level === 'low' ? COLORS.accent2 : COLORS.accent;

      addTheme06Card(slide, leftX, y, leftW, cardH);
      slide.addShape('rect', {
        x: leftX, y, w: 0.08, h: cardH,
        fill: { color: levelColor },
      } as any);
      slide.addText(item.number || String(idx + 1).padStart(2, '0'), {
        x: leftX + 0.18, y: y + 0.12, w: 0.6, h: 0.32,
        fontSize: 16, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
      slide.addText(item.risk ?? '', {
        x: leftX + 0.82, y: y + 0.12, w: leftW - 1.0, h: 0.36,
        fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      slide.addText(level === 'high' ? '高风险' : level === 'low' ? '低风险' : '中风险', {
        x: leftX + 0.82, y: y + 0.48, w: leftW - 1.0, h: 0.2,
        fontSize: 9, color: levelColor, bold: true, fontFace: FONTS.mono,
      });
      if (item.response) {
        slide.addText(item.response, {
          x: leftX + 0.18, y: y + 0.72, w: leftW - 0.36, h: cardH - 0.9,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
      if (item.meta) {
        slide.addText(item.meta, {
          x: leftX + 0.18, y: y + cardH - 0.34, w: leftW - 0.36, h: 0.22,
          fontSize: 8, color: COLORS.secondary, fontFace: FONTS.mono,
        });
      }
    });
  }

  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, rightX, 2.35, rightW, 2.6);
  } else {
    slide.addShape('roundRect', {
      x: rightX, y: 2.35, w: rightW, h: 2.6,
      fill: { color: COLORS.surfaceElevated },
      rectRadius: 0.12,
    } as any);
    slide.addText('DROP IMAGE', {
      x: rightX, y: 3.5, w: rightW, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono, bold: true,
    });
  }

  if (props.insight) {
    slide.addText(props.insight, {
      x: rightX, y: 5.1, w: rightW, h: 0.7,
      fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.1, w: leftW, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06CaseV2(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const leftX = 0.65;
  const leftW = 4.5;
  const rightX = 5.35;
  const rightW = 4.0;

  const items = (props.items || [])
    .filter((item: any) => item != null && item.title != null)
    .slice(0, 4);
  if (items.length > 0) {
    const cardH = (4.45 - 0.12 * (items.length - 1)) / items.length;
    items.forEach((item: any, idx: number) => {
      const y = 2.35 + idx * (cardH + 0.12);
      addTheme06Card(slide, leftX, y, leftW, cardH);
      slide.addText(item.number || String(idx + 1).padStart(2, '0'), {
        x: leftX + 0.18, y: y + 0.12, w: 0.6, h: 0.32,
        fontSize: 16, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
      slide.addText(item.title ?? '', {
        x: leftX + 0.82, y: y + 0.12, w: leftW - 1.0, h: 0.36,
        fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: leftX + 0.18, y: y + 0.54, w: leftW - 0.36, h: cardH - 0.78,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
      if (item.meta) {
        slide.addText(item.meta, {
          x: leftX + 0.18, y: y + cardH - 0.34, w: leftW - 0.36, h: 0.22,
          fontSize: 8, color: COLORS.secondary, fontFace: FONTS.mono,
        });
      }
    });
  }

  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, rightX, 2.35, rightW, 2.2);
  } else {
    slide.addShape('roundRect', {
      x: rightX, y: 2.35, w: rightW, h: 2.2,
      fill: { color: COLORS.surfaceElevated },
      rectRadius: 0.12,
    } as any);
    slide.addText('DROP IMAGE', {
      x: rightX, y: 3.25, w: rightW, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono, bold: true,
    });
  }

  if (props.company) {
    slide.addText(props.company, {
      x: rightX, y: 4.65, w: rightW, h: 0.42,
      fontSize: 24, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.tagline) {
    slide.addText(props.tagline, {
      x: rightX, y: 5.05, w: rightW, h: 0.42,
      fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  if (props.insight) {
    slide.addText(props.insight, {
      x: leftX, y: 5.1, w: leftW, h: 0.25,
      fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono,
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: rightX, y: 5.55, w: rightW, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ChartGraphV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const nodes = (props.nodes || []).filter((n: any) => n != null && n.name != null).slice(0, 8);
  const links = (props.links || []).filter((l: any) => l != null && l.source != null && l.target != null).slice(0, 24);
  const conclusion = props.conclusion;
  const hasConclusion = props.showConclusion !== false && !!conclusion && (conclusion.value || conclusion.label || conclusion.description);
  const chartW = hasConclusion ? 5.8 : 8.7;

  if (nodes.length > 0) {
    const cx = 0.65 + chartW / 2;
    const cy = 2.25 + 3.0 / 2;
    const radius = Math.min(chartW, 3.0) * 0.32;
    const nodeColors = [COLORS.accent, COLORS.accent2, COLORS.accentCool, 'E85D4E'];

    const positions: { x: number; y: number }[] = [];
    if (nodes.length === 1) {
      positions.push({ x: cx, y: cy });
    } else {
      const count = nodes.length;
      const startAngle = -Math.PI / 2;
      nodes.forEach((_: any, idx: number) => {
        const angle = startAngle + (idx * 2 * Math.PI) / count;
        positions.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
      });
    }

    const nodeMap: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n: any, idx: number) => {
      nodeMap[n.id ?? n.name] = positions[idx];
    });

    links.forEach((l: any) => {
      const s = nodeMap[l.source];
      const t = nodeMap[l.target];
      if (s && t) {
        slide.addShape('line', {
          x1: s.x, y1: s.y, x2: t.x, y2: t.y,
          line: { color: COLORS.edge, width: 1.2 },
        } as any);
      }
    });

    nodes.forEach((n: any, idx: number) => {
      const pos = positions[idx];
      const color = nodeColors[(n.category ?? idx) % nodeColors.length];
      const size = 0.22;
      slide.addShape('ellipse', {
        x: pos.x - size, y: pos.y - size, w: size * 2, h: size * 2,
        fill: { color },
      } as any);
      slide.addText(n.name, {
        x: pos.x - 0.9, y: pos.y + size + 0.04, w: 1.8, h: 0.32,
        fontSize: 10, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
      });
    });
  } else {
    slide.addText('（暂无图谱数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasConclusion) {
    addTheme06Card(slide, 6.75, 2.25, 2.6, 3.0, true);
    let cursorY = 2.43;
    if (conclusion.value) {
      slide.addText(conclusion.value, {
        x: 6.95, y: cursorY, w: 2.2, h: 0.55,
        fontSize: 32, color: COLORS.white, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.58;
    }
    if (conclusion.label) {
      slide.addText(conclusion.label, {
        x: 6.95, y: cursorY, w: 2.2, h: 0.25,
        fontSize: 10, color: 'FFFFFF', fontFace: FONTS.body,
      });
      cursorY += 0.32;
    }
    if (conclusion.description) {
      slide.addText(conclusion.description, {
        x: 6.95, y: cursorY, w: 2.2, h: 2.8 - (cursorY - 2.43),
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06MapV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 10).filter((it: any) => it != null && it.name != null);
  if (items.length === 0) {
    addTheme06GlowLine(slide);
    return;
  }

  const chartX = 0.65;
  const chartY = 2.35;
  const chartW = 8.7;
  const chartH = 3.1;
  addTheme06Card(slide, chartX, chartY, chartW, chartH);

  const sorted = [...items].sort((a: any, b: any) => (Number(b.value) || 0) - (Number(a.value) || 0));
  const maxValue = Math.max(1, ...sorted.map((it: any) => Number(it.value) || 0));
  const rowH = chartH / sorted.length;
  const labelW = 1.4;
  const plotX = chartX + labelW + 0.2;
  const plotW = chartW - labelW - 1.2;

  sorted.forEach((it: any, idx: number) => {
    const y = chartY + idx * rowH;
    const value = Number(it.value) || 0;
    const barW = (value / maxValue) * plotW;

    slide.addText(it.name ?? '', {
      x: chartX + 0.15, y, w: labelW, h: rowH,
      fontSize: 12, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });

    slide.addShape('roundRect', {
      x: plotX, y: y + rowH * 0.22, w: Math.max(0.04, barW), h: rowH * 0.56,
      fill: { color: COLORS.accent }, rectRadius: 0.04,
    } as any);

    slide.addText(`${value} ${props.unit ?? ''}`, {
      x: plotX + barW + 0.08, y, w: 1.0, h: rowH,
      fontSize: 10, color: COLORS.secondary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
  });

  addTheme06GlowLine(slide);
}

export function renderTheme06TableOfContentsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 8);
  if (items.length > 0) {
    const cols = 2;
    const cardW = 4.15;
    const cardH = 1.05;
    const gapX = 0.24;
    const gapY = 0.14;
    const startX = 0.65;
    const startY = 2.35;

    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.14, y: y + 0.14, w: 0.7, h: 0.7,
        fontSize: 20, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.mono,
      });
      slide.addText(item.title ?? '', {
        x: x + 1.0, y: y + 0.16, w: cardW - 1.2, h: 0.42,
        fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (item.page) {
        slide.addText(`第 ${item.page} 页`, {
          x: x + 1.0, y: y + 0.58, w: cardW - 1.2, h: 0.24,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.mono,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06SummaryV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const points = (props.points || []).slice(0, 6);
  const pointH = 0.55;
  const gap = 0.12;
  const startY = 2.35;
  points.forEach((point: any, idx: number) => {
    const y = startY + idx * (pointH + gap);
    addTheme06Card(slide, 0.65, y, 4.6, pointH);
    slide.addShape('ellipse', {
      x: 0.85, y: y + 0.16, w: 0.22, h: 0.22,
      fill: { color: COLORS.accent },
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: 0.85, y: y + 0.16, w: 0.22, h: 0.22,
      fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
    slide.addText(point.text ?? '', {
      x: 1.2, y: y + 0.08, w: 3.9, h: pointH - 0.16,
      fontSize: 12, color: COLORS.primary, valign: 'middle', fontFace: FONTS.body,
    });
  });

  const hasConclusion = props.value || props.valueLabel || props.valueDescription;
  if (hasConclusion) {
    addTheme06Card(slide, 5.55, 2.35, 3.8, 3.2, true);
    let cursorY = 2.55;
    if (props.value) {
      slide.addText(props.value, {
        x: 5.75, y: cursorY, w: 3.4, h: 0.7,
        fontSize: 40, color: COLORS.white, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      cursorY += 0.75;
    }
    if (props.valueLabel) {
      slide.addText(props.valueLabel, {
        x: 5.75, y: cursorY, w: 3.4, h: 0.25,
        fontSize: 11, color: 'FFFFFF', bold: true, fontFace: FONTS.mono,
      });
      cursorY += 0.32;
    }
    if (props.valueDescription) {
      slide.addText(props.valueDescription, {
        x: 5.75, y: cursorY, w: 3.4, h: 2.8 - (cursorY - 2.55),
        fontSize: 11, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ClosingV1(slide: PptxSlide, props: any): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.7, w: 8.7, h: 0.95,
    fontSize: 48, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.65, w: 8.7, h: 0.35,
      fontSize: 15, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const links = (props.links || []).slice(0, 3);
  if (links.length > 0) {
    const cardW = 2.7;
    const gap = 0.3;
    const startX = 0.65;
    const y = 3.45;
    links.forEach((link: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      addTheme06Card(slide, x, y, cardW, 1.0);
      slide.addText(link.label ?? '', {
        x: x + 0.12, y: y + 0.12, w: cardW - 0.24, h: 0.22,
        fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
      slide.addText(link.value ?? '', {
        x: x + 0.12, y: y + 0.4, w: cardW - 0.24, h: 0.45,
        fontSize: 14, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
      });
    });
  }

  if (props.cta) {
    slide.addShape('roundRect', {
      x: 0.65, y: 4.75, w: 2.6, h: 0.42,
      fill: { color: COLORS.accent }, rectRadius: 0.21,
    } as any);
    slide.addText(props.cta, {
      x: 0.65, y: 4.75, w: 2.6, h: 0.42,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06SourcesV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const sources = (props.sources || []).slice(0, 8);
  if (sources.length > 0) {
    const cols = 2;
    const cardW = 4.15;
    const cardH = 0.72;
    const gapX = 0.24;
    const gapY = 0.12;
    const startX = 0.65;
    const startY = 2.35;

    sources.forEach((source: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.14, y, w: 0.55, h: cardH,
        fontSize: 12, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
      slide.addText(source.text ?? '', {
        x: x + 0.75, y, w: cardW - 0.95, h: cardH,
        fontSize: 11, color: COLORS.primary, valign: 'middle', fontFace: FONTS.body,
      });
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ChartHeatmapV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const xAxis = (props.xAxis || []).map((x: any) => (typeof x === 'string' ? x : x.item ?? '')).filter(Boolean);
  const yAxis = (props.yAxis || []).map((y: any) => (typeof y === 'string' ? y : y.item ?? '')).filter(Boolean);
  const rawData = props.data || [];
  const parsed: Array<[string, string, number]> = [];
  for (const item of rawData) {
    if (Array.isArray(item) && item.length >= 3) {
      parsed.push([String(item[0]), String(item[1]), Number(item[2]) || 0]);
    } else if (typeof item === 'string') {
      const parts = item.split(',');
      if (parts.length >= 3) parsed.push([parts[0].trim(), parts[1].trim(), Number(parts[2]) || 0]);
    } else if (item && typeof item === 'object') {
      const text = String(item.item ?? item.value ?? '');
      const parts = text.split(',');
      if (parts.length >= 3) parsed.push([parts[0].trim(), parts[1].trim(), Number(parts[2]) || 0]);
    }
  }

  if (xAxis.length > 0 && yAxis.length > 0) {
    const values = parsed.map((d) => d[2]);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const startX = 0.65;
    const startY = 2.35;
    const cellW = 8.4 / (xAxis.length + 1);
    const cellH = 2.8 / (yAxis.length + 1);

    // Header row
    slide.addShape('rect', {
      x: startX + cellW, y: startY, w: cellW * xAxis.length, h: cellH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 0.5 },
    } as any);
    xAxis.forEach((label: string, idx: number) => {
      slide.addText(label, {
        x: startX + cellW * (idx + 1), y: startY, w: cellW, h: cellH,
        fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    });

    // Data rows
    yAxis.forEach((yLabel: string, yIdx: number) => {
      const y = startY + cellH * (yIdx + 1);
      slide.addShape('rect', {
        x: startX, y, w: cellW, h: cellH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 0.5 },
      } as any);
      slide.addText(yLabel, {
        x: startX, y, w: cellW, h: cellH,
        fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });

      xAxis.forEach((xLabel: string, xIdx: number) => {
        const point = parsed.find((d) => d[0] === xLabel && d[1] === yLabel);
        const value = point ? point[2] : 0;
        const ratio = max === min ? 0.5 : (value - min) / (max - min);
        const fill = ratio > 0.66 ? COLORS.accent : ratio > 0.33 ? COLORS.secondary : COLORS.surfaceElevated;
        const textColor = ratio > 0.5 ? COLORS.white : COLORS.primary;
        slide.addShape('rect', {
          x: startX + cellW * (xIdx + 1), y, w: cellW, h: cellH,
          fill: { color: fill },
          line: { color: COLORS.border, width: 0.5 },
        } as any);
        slide.addText(String(value), {
          x: startX + cellW * (xIdx + 1), y, w: cellW, h: cellH,
          fontSize: 10, color: textColor, align: 'center', valign: 'middle', fontFace: FONTS.mono, bold: true,
        });
      });
    });
  } else {
    slide.addText('（暂无热力图数据）', {
      x: 0.65, y: 3.0, w: 8.7, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06BentoV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const cols = 3;
    const cardW = 2.75;
    const cardH = 1.55;
    const gapX = 0.18;
    const gapY = 0.14;
    const startX = 0.65;
    const startY = 2.35;

    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH, !!item.accent);

      if (item.value) {
        slide.addText(item.value, {
          x: x + 0.14, y: y + 0.14, w: cardW - 0.28, h: 0.28,
          fontSize: 12, color: item.accent ? COLORS.white : COLORS.accent, bold: true, fontFace: FONTS.mono,
        });
      }
      slide.addText(item.title ?? '', {
        x: x + 0.14, y: y + 0.48, w: cardW - 0.28, h: 0.42,
        fontSize: 15, color: item.accent ? COLORS.white : COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: x + 0.14, y: y + 0.92, w: cardW - 0.28, h: cardH - 1.0,
          fontSize: 10, color: item.accent ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ComparisonV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const leftTitle = props.leftTitle ?? '左侧';
  const rightTitle = props.rightTitle ?? '右侧';
  const points = (props.points || []).slice(0, 6);
  const colW = 4.1;
  const startY = 2.35;
  const rowH = 0.62;
  const gapY = 0.1;

  // Column titles
  slide.addText(leftTitle, {
    x: 0.65, y: startY - 0.55, w: colW, h: 0.45,
    fontSize: 18, color: COLORS.primary, bold: true, valign: 'bottom', fontFace: FONTS.heading,
  });
  slide.addShape('rect', {
    x: 0.65, y: startY - 0.08, w: colW, h: 0.03,
    fill: { color: COLORS.secondary },
  } as any);
  slide.addText(rightTitle, {
    x: 5.25, y: startY - 0.55, w: colW, h: 0.45,
    fontSize: 18, color: COLORS.primary, bold: true, valign: 'bottom', fontFace: FONTS.heading,
  });
  slide.addShape('rect', {
    x: 5.25, y: startY - 0.08, w: colW, h: 0.03,
    fill: { color: COLORS.accent },
  } as any);

  points.forEach((point: any, idx: number) => {
    const y = startY + idx * (rowH + gapY);
    const winner = point.winner;
    const text = point.text ?? '';

    addTheme06Card(slide, 0.65, y, colW, rowH, winner === 'left');
    slide.addText(text, {
      x: 0.75, y, w: colW - 0.2, h: rowH,
      fontSize: 11, color: winner === 'left' ? COLORS.white : COLORS.primary, valign: 'middle', fontFace: FONTS.body,
    });

    addTheme06Card(slide, 5.25, y, colW, rowH, winner === 'right');
    slide.addText(text, {
      x: 5.35, y, w: colW - 0.2, h: rowH,
      fontSize: 11, color: winner === 'right' ? COLORS.white : COLORS.primary, valign: 'middle', fontFace: FONTS.body,
    });
  });

  // Summaries
  const summaryY = startY + points.length * (rowH + gapY) + 0.2;
  if (props.leftSummary) {
    addTheme06Card(slide, 0.65, summaryY, colW, 0.85);
    slide.addText(props.leftSummary, {
      x: 0.75, y: summaryY + 0.08, w: colW - 0.2, h: 0.7,
      fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.rightSummary) {
    addTheme06Card(slide, 5.25, summaryY, colW, 0.85);
    slide.addText(props.rightSummary, {
      x: 5.35, y: summaryY + 0.08, w: colW - 0.2, h: 0.7,
      fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06SectorSpotlightV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const takeaways = (props.takeaways || [])
    .map((t: any) => (typeof t === 'string' ? t : t?.text ?? ''))
    .filter(Boolean)
    .slice(0, 5);
  const mainX = 0.65;
  const mainW = 4.6;
  if (takeaways.length > 0) {
    const cardH = 0.62;
    const gap = 0.12;
    const startY = 2.35;
    takeaways.forEach((text: string, idx: number) => {
      const y = startY + idx * (cardH + gap);
      addTheme06Card(slide, mainX, y, mainW, cardH);
      slide.addShape('ellipse', {
        x: mainX + 0.14, y: y + 0.18, w: 0.14, h: 0.14,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(text, {
        x: mainX + 0.4, y: y + 0.08, w: mainW - 0.54, h: cardH - 0.16,
        fontSize: 13, color: COLORS.primary, valign: 'middle', fontFace: FONTS.body,
      });
    });
  }

  const asideX = 5.55;
  const asideW = 3.8;
  const highlights = (props.highlights || []).slice(0, 4);
  let highlightBottom = 2.35;
  if (highlights.length > 0) {
    const cols = 2;
    const gapX = 0.18;
    const gapY = 0.14;
    const cellW = (asideW - gapX) / cols;
    const cellH = 0.9;
    highlights.forEach((h: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = asideX + col * (cellW + gapX);
      const y = 2.35 + row * (cellH + gapY);
      highlightBottom = Math.max(highlightBottom, y + cellH);
      const accent = !!h.accent;
      addTheme06Card(slide, x, y, cellW, cellH, accent);
      slide.addText(h.value ?? '', {
        x: x + 0.12, y: y + 0.12, w: cellW - 0.24, h: 0.34,
        fontSize: 22, color: accent ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(h.label ?? '', {
        x: x + 0.12, y: y + 0.5, w: cellW - 0.24, h: 0.22,
        fontSize: 9, color: accent ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  const insight = props.insight;
  const hasInsight = insight && (insight.value || insight.label || insight.description);
  if (hasInsight) {
    const y = highlightBottom + 0.18;
    const h = 5.18 - y - 0.25;
    if (h > 0.6) {
      addTheme06Card(slide, asideX, y, asideW, h, true);
      let cy = y + 0.16;
      if (insight.value) {
        slide.addText(insight.value, {
          x: asideX + 0.16, y: cy, w: asideW - 0.32, h: 0.42,
          fontSize: 26, color: COLORS.white, bold: true, fontFace: FONTS.heading,
        });
        cy += 0.44;
      }
      if (insight.label) {
        slide.addText(insight.label, {
          x: asideX + 0.16, y: cy, w: asideW - 0.32, h: 0.2,
          fontSize: 10, color: 'FFFFFF', fontFace: FONTS.body,
        });
        cy += 0.24;
      }
      if (insight.description) {
        slide.addText(insight.description, {
          x: asideX + 0.16, y: cy, w: asideW - 0.32, h: h - (cy - y) - 0.2,
          fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
        });
      }
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06TechLandscapeV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const topics = (props.topics || []).filter((t: any) => t != null).slice(0, 6);
  if (topics.length === 0) {
    addTheme06GlowLine(slide);
    return;
  }

  const cols = 3;
  const gapX = 0.18;
  const gapY = 0.14;
  const cardW = (8.7 - gapX * (cols - 1)) / cols;
  const cardH = 1.38;
  const startX = 0.65;
  const startY = 2.35;

  topics.forEach((topic: any, idx: number) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    const accent = !!topic.accent;
    addTheme06Card(slide, x, y, cardW, cardH, accent);
    if (topic.value) {
      slide.addText(topic.value, {
        x: x + cardW - 0.62, y: y + 0.12, w: 0.5, h: 0.24,
        fontSize: 10, color: accent ? COLORS.white : COLORS.accent, bold: true, align: 'right', fontFace: FONTS.mono,
      });
    }
    slide.addText(topic.title ?? '', {
      x: x + 0.14, y: y + 0.38, w: cardW - 0.28, h: 0.36,
      fontSize: 15, color: accent ? COLORS.white : COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (topic.description) {
      slide.addText(topic.description, {
        x: x + 0.14, y: y + 0.76, w: cardW - 0.28, h: cardH - 0.86,
        fontSize: 10, color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  addTheme06GlowLine(slide);
}

export function renderTheme06CompanyProfileV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }

  const mainX = 0.65;
  const mainW = 5.0;
  slide.addText(props.company ?? '', {
    x: mainX, y: 1.15, w: mainW, h: 0.7,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.tagline) {
    slide.addText(props.tagline, {
      x: mainX, y: 1.85, w: mainW, h: 0.45,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const facts = (props.facts || []).filter((f: any) => f != null).slice(0, 4);
  if (facts.length > 0) {
    const gapX = 0.18;
    const gapY = 0.14;
    const cardW = (mainW - gapX) / 2;
    const cardH = 0.72;
    const startY = 2.45;
    facts.forEach((fact: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = mainX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH);
      slide.addText(fact.label ?? '', {
        x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.2,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body,
      });
      slide.addText(fact.value ?? '', {
        x: x + 0.12, y: y + 0.3, w: cardW - 0.24, h: 0.28,
        fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
    });
  }

  const metrics = (props.metrics || []).filter((m: any) => m != null).slice(0, 3);
  if (metrics.length > 0) {
    const gapX = 0.18;
    const cardW = (mainW - gapX * (metrics.length - 1)) / metrics.length;
    const cardH = 1.0;
    const factsBottom = facts.length > 0 ? 2.45 + Math.ceil(facts.length / 2) * (0.72 + 0.14) + 0.18 : 2.45;
    const y = factsBottom;
    metrics.forEach((m: any, idx: number) => {
      const x = mainX + idx * (cardW + gapX);
      addTheme06Card(slide, x, y, cardW, cardH, idx === 0);
      slide.addText(m.value ?? '', {
        x: x + 0.12, y: y + 0.16, w: cardW - 0.24, h: 0.36,
        fontSize: 22, color: idx === 0 ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x: x + 0.12, y: y + 0.56, w: cardW - 0.24, h: 0.26,
        fontSize: 10, color: idx === 0 ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  const narrative = props.narrative || {};
  const narrativeX = 5.9;
  const narrativeW = 3.45;
  const blocks = [
    { title: '挑战', text: narrative.challenge },
    { title: '方案', text: narrative.solution },
    { title: '成果', text: narrative.result },
  ].filter((b) => b.text);
  if (blocks.length > 0) {
    const blockH = 1.25;
    const gap = 0.12;
    const startY = 1.15;
    blocks.forEach((block: any, idx: number) => {
      const y = startY + idx * (blockH + gap);
      addTheme06Card(slide, narrativeX, y, narrativeW, blockH);
      slide.addText(block.title, {
        x: narrativeX + 0.14, y: y + 0.12, w: narrativeW - 0.28, h: 0.22,
        fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
      slide.addText(block.text, {
        x: narrativeX + 0.14, y: y + 0.36, w: narrativeW - 0.28, h: blockH - 0.48,
        fontSize: 11, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
      });
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ChainFlowV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps || []).filter((s: any) => s != null).slice(0, 6);
  if (steps.length === 0) {
    addTheme06GlowLine(slide);
    return;
  }

  const gap = 0.16;
  const cardW = (8.7 - gap * (steps.length - 1)) / steps.length;
  const cardH = 1.8;
  const startX = 0.65;
  const startY = 2.45;

  // connector line
  slide.addShape('line', {
    x1: startX + cardW / 2, y1: startY + 0.45,
    x2: startX + (steps.length - 1) * (cardW + gap) + cardW / 2, y2: startY + 0.45,
    line: { color: COLORS.border, width: 1.5 },
  } as any);

  steps.forEach((step: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const accent = idx === 0 || idx === steps.length - 1;
    addTheme06Card(slide, x, startY, cardW, cardH, accent);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + 0.12, y: startY + 0.12, w: 0.5, h: 0.24,
      fontSize: 10, color: accent ? COLORS.white : COLORS.accent, bold: true, fontFace: FONTS.mono,
    });
    slide.addText(step.label ?? '', {
      x: x + 0.12, y: startY + 0.42, w: cardW - 0.24, h: 0.36,
      fontSize: 14, color: accent ? COLORS.white : COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (step.description) {
      slide.addText(step.description, {
        x: x + 0.12, y: startY + 0.8, w: cardW - 0.24, h: 0.5,
        fontSize: 9, color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
    if (step.value) {
      slide.addText(step.value, {
        x: x + 0.12, y: startY + cardH - 0.36, w: cardW - 0.24, h: 0.24,
        fontSize: 12, color: accent ? COLORS.white : COLORS.accent, bold: true, align: 'right', fontFace: FONTS.mono,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 4.95, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06QuarterTableV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const columns = (props.columns || [])
    .map((c: any) => (typeof c === 'string' ? c : c?.item ?? ''))
    .filter(Boolean)
    .slice(0, 5);
  const displayColumns = columns.length >= 4 ? columns : ['季度', '指标 1', '指标 2', '指标 3', '环比'];
  const rows = (props.rows || []).filter((r: any) => r != null).slice(0, 6);

  const startX = 0.65;
  const startY = 2.35;
  const totalW = 8.7;
  const headerH = 0.45;
  const rowH = 0.42;
  const gapY = 0.08;
  const cellW = totalW / displayColumns.length;

  // header
  slide.addShape('rect', {
    x: startX, y: startY, w: totalW, h: headerH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 0.5 },
  } as any);
  displayColumns.forEach((col: string, idx: number) => {
    slide.addText(col, {
      x: startX + idx * cellW, y: startY, w: cellW, h: headerH,
      fontSize: 10, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  });

  rows.forEach((row: any, ridx: number) => {
    const y = startY + headerH + ridx * (rowH + gapY);
    const focus = !!row.focus;
    slide.addShape('rect', {
      x: startX, y, w: totalW, h: rowH,
      fill: { color: focus ? COLORS.accent : COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 0.5 },
    } as any);

    const cells = [row.quarter ?? '', row.metric1 ?? '', row.metric2 ?? '', row.metric3 ?? '', row.change ?? ''];
    cells.forEach((text: string, cidx: number) => {
      const isLast = cidx === cells.length - 1;
      const color = focus ? COLORS.white : (isLast && row.tone === 'positive' ? COLORS.accent : isLast && row.tone === 'negative' ? 'E85D4E' : COLORS.primary);
      slide.addText(text, {
        x: startX + cidx * cellW, y, w: cellW, h: rowH,
        fontSize: 10, color, bold: focus || isLast, align: 'center', valign: 'middle', fontFace: cidx === 0 || isLast ? FONTS.mono : FONTS.body,
      });
    });
  });

  const summary = props.summary;
  if (summary && (summary.label || summary.value)) {
    const tableBottom = startY + headerH + rows.length * (rowH + gapY) + 0.12;
    addTheme06Card(slide, 6.5, tableBottom, 2.85, 0.65, true);
    slide.addText(summary.label ?? '', {
      x: 6.64, y: tableBottom + 0.1, w: 1.2, h: 0.45,
      fontSize: 10, color: 'FFFFFF', valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText(summary.value ?? '', {
      x: 7.84, y: tableBottom + 0.1, w: 1.36, h: 0.45,
      fontSize: 18, color: COLORS.white, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.heading,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06MetricShowcaseV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  slide.addText(props.value ?? '', {
    x: 0.65, y: 2.45, w: 8.7, h: 1.1,
    fontSize: 90, color: COLORS.accent, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: 0.65, y: 3.45, w: 8.7, h: 0.35,
      fontSize: 20, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });
  }

  if (props.change) {
    const badgeW = 2.6;
    const badgeX = (10 - badgeW) / 2;
    const badgeY = 3.85;
    slide.addShape('roundRect', {
      x: badgeX, y: badgeY, w: badgeW, h: 0.42,
      fill: { color: COLORS.accent }, rectRadius: 0.21,
    } as any);
    const text = [props.change, props.changeLabel].filter(Boolean).join('  ');
    slide.addText(text, {
      x: badgeX, y: badgeY, w: badgeW, h: 0.42,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const supporting = (props.supporting || []).filter((s: any) => s != null).slice(0, 4);
  if (supporting.length > 0) {
    const gapX = 0.18;
    const cardW = (8.7 - gapX * (supporting.length - 1)) / supporting.length;
    const cardH = 0.55;
    const startX = 0.65;
    const y = 4.45;
    supporting.forEach((item: any, idx: number) => {
      const x = startX + idx * (cardW + gapX);
      addTheme06Card(slide, x, y, cardW, cardH);
      slide.addText(item.value ?? '', {
        x: x + 0.1, y: y + 0.08, w: cardW - 0.2, h: 0.22,
        fontSize: 16, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.1, y: y + 0.3, w: cardW - 0.2, h: 0.18,
        fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06MilestoneV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const milestones = (props.milestones || []).filter((m: any) => m != null).slice(0, 6);
  if (milestones.length === 0) {
    addTheme06GlowLine(slide);
    return;
  }

  const gap = 0.18;
  const totalW = 8.7;
  const cardW = (totalW - gap * (milestones.length - 1)) / milestones.length;
  const cardH = 2.2;
  const startX = 0.65;
  const startY = 2.35;

  // timeline connector
  slide.addShape('line', {
    x1: startX + cardW / 2, y1: startY + 0.42,
    x2: startX + (milestones.length - 1) * (cardW + gap) + cardW / 2, y2: startY + 0.42,
    line: { color: COLORS.border, width: 2 },
  } as any);

  milestones.forEach((m: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const focus = !!m.focus;
    addTheme06Card(slide, x, startY, cardW, cardH, focus);

    slide.addShape('ellipse', {
      x: x + cardW / 2 - 0.16, y: startY + 0.26, w: 0.32, h: 0.32,
      fill: { color: focus ? COLORS.white : COLORS.accent },
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + cardW / 2 - 0.16, y: startY + 0.26, w: 0.32, h: 0.32,
      fontSize: 9, color: focus ? COLORS.accent : COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });

    if (m.date) {
      slide.addText(m.date, {
        x: x + 0.1, y: startY + 0.72, w: cardW - 0.2, h: 0.2,
        fontSize: 10, color: focus ? COLORS.white : COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
    }
    if (m.title) {
      slide.addText(m.title, {
        x: x + 0.1, y: startY + 0.96, w: cardW - 0.2, h: 0.32,
        fontSize: 13, color: focus ? COLORS.white : COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
    }
    if (m.value) {
      slide.addText(m.value, {
        x: x + 0.1, y: startY + 1.26, w: cardW - 0.2, h: 0.22,
        fontSize: 11, color: focus ? COLORS.white : COLORS.secondary, bold: true, fontFace: FONTS.mono,
      });
    }
    if (m.description) {
      slide.addText(m.description, {
        x: x + 0.1, y: startY + 1.5, w: cardW - 0.2, h: 0.56,
        fontSize: 9, color: focus ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  addTheme06GlowLine(slide);
}

export function renderTheme06RiskMatrixV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const cells = (props.cells || []).filter((c: any) => c != null).slice(0, 4);
  const cols = 2;
  const gap = 0.14;
  const cellW = (8.7 - gap) / cols;
  const cellH = 1.25;
  const startX = 0.65;
  const startY = 2.35;
  const levelLabels: Record<string, string> = { high: 'HIGH RISK', medium: 'MEDIUM RISK', low: 'LOW RISK' };

  cells.forEach((cell: any, idx: number) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = startX + col * (cellW + gap);
    const y = startY + row * (cellH + gap);
    const level = cell.level || 'medium';
    const accent = level === 'high' || !!cell.focus;
    addTheme06Card(slide, x, y, cellW, cellH, accent);
    slide.addText(levelLabels[level] ?? level.toUpperCase(), {
      x: x + 0.12, y: y + 0.12, w: cellW - 0.24, h: 0.2,
      fontSize: 9, color: accent ? 'FFFFFF' : COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });
    slide.addText(cell.title ?? '', {
      x: x + 0.12, y: y + 0.36, w: cellW - 0.24, h: 0.34,
      fontSize: 14, color: accent ? COLORS.white : COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (cell.description) {
      slide.addText(cell.description, {
        x: x + 0.12, y: y + 0.72, w: cellW - 0.24, h: cellH - 0.84,
        fontSize: 10, color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const axisY = startY + 2 * (cellH + gap) + 0.08;
  if (props.xAxisLabel || props.yAxisLabel) {
    slide.addText([props.xAxisLabel, props.yAxisLabel].filter(Boolean).join('    '), {
      x: 0.65, y: axisY, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06SectorComparisonV1(slide: PptxSlide, props: any): void {
  renderTheme06ComparisonV1(slide, props);
}

export function renderTheme06GeoDistributionV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).filter((it: any) => it != null && it.name != null).slice(0, 8);
  if (items.length === 0) {
    addTheme06GlowLine(slide);
    return;
  }

  const sorted = [...items].sort((a: any, b: any) => (Number(b.value) || 0) - (Number(a.value) || 0));
  const maxValue = Math.max(1, ...sorted.map((it: any) => Number(it.value) || 0));
  const chartX = 0.65;
  const chartW = 6.2;
  const chartH = 3.0;
  const chartY = 2.35;
  addTheme06Card(slide, chartX, chartY, chartW, chartH);

  const rowH = chartH / sorted.length;
  const labelW = 1.5;
  const plotX = chartX + labelW + 0.2;
  const plotW = chartW - labelW - 1.0;

  sorted.forEach((it: any, idx: number) => {
    const y = chartY + idx * rowH;
    const value = Number(it.value) || 0;
    const barW = (value / maxValue) * plotW;
    slide.addText(it.name ?? '', {
      x: chartX + 0.15, y, w: labelW, h: rowH,
      fontSize: 11, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
    slide.addShape('roundRect', {
      x: plotX, y: y + rowH * 0.22, w: Math.max(0.04, barW), h: rowH * 0.56,
      fill: { color: COLORS.accent }, rectRadius: 0.04,
    } as any);
    slide.addText(`${value} ${props.unit ?? ''}`, {
      x: plotX + barW + 0.08, y, w: 0.9, h: rowH,
      fontSize: 10, color: COLORS.secondary, bold: true, valign: 'middle', fontFace: FONTS.mono,
    });
  });

  const asideX = 7.0;
  const asideW = 2.35;
  const total = sorted.reduce((sum: number, it: any) => sum + (Number(it.value) || 0), 0);
  addTheme06Card(slide, asideX, chartY, asideW, 0.85, true);
  slide.addText(String(total), {
    x: asideX + 0.12, y: chartY + 0.1, w: asideW - 0.24, h: 0.38,
    fontSize: 24, color: COLORS.white, bold: true, fontFace: FONTS.heading,
  });
  slide.addText(`${props.totalLabel ?? '总计'} ${props.unit ?? ''}`, {
    x: asideX + 0.12, y: chartY + 0.48, w: asideW - 0.24, h: 0.2,
    fontSize: 9, color: 'FFFFFF', fontFace: FONTS.body,
  });

  sorted.slice(0, 5).forEach((it: any, idx: number) => {
    const y = chartY + 1.05 + idx * 0.42;
    slide.addText(it.name ?? '', {
      x: asideX, y, w: asideW - 0.6, h: 0.36,
      fontSize: 10, color: COLORS.secondary, valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText(String(it.value), {
      x: asideX + asideW - 0.6, y, w: 0.6, h: 0.36,
      fontSize: 10, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
    });
  });

  addTheme06GlowLine(slide);
}

export function renderTheme06GeoHeatmapV1(slide: PptxSlide, props: any): void {
  renderTheme06ChartHeatmapV1(slide, props);
}

export function renderTheme06EcosystemGraphV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const categories = (props.categories || [])
    .map((c: any) => (typeof c === 'string' ? { name: c } : { name: c?.item ?? c?.name ?? '' }))
    .filter((c: any) => c.name);
  const nodes = (props.nodes || []).filter((n: any) => n != null && n.name != null).slice(0, 20);
  const links = (props.links || []).filter((l: any) => l != null && l.source != null && l.target != null).slice(0, 30);
  const nodeColors = CHART_COLORS.length ? CHART_COLORS : [COLORS.accent, COLORS.accent2, COLORS.accentCool, 'E85D4E', 'A855F7'];

  const mainX = 0.65;
  const mainW = 6.4;
  const mainY = 2.35;
  const mainH = 3.0;
  addTheme06Card(slide, mainX, mainY, mainW, mainH);

  if (nodes.length > 0) {
    const cx = mainX + mainW / 2;
    const cy = mainY + mainH / 2;
    const radius = Math.min(mainW, mainH) * 0.34;

    const positions: { x: number; y: number }[] = [];
    const count = nodes.length;
    const startAngle = -Math.PI / 2;
    nodes.forEach((_: any, idx: number) => {
      const angle = startAngle + (idx * 2 * Math.PI) / count;
      positions.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
    });

    const nodeMap: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n: any, idx: number) => {
      nodeMap[n.id ?? n.name] = positions[idx];
    });

    links.forEach((l: any) => {
      const s = nodeMap[l.source];
      const t = nodeMap[l.target];
      if (s && t) {
        slide.addShape('line', {
          x1: s.x, y1: s.y, x2: t.x, y2: t.y,
          line: { color: COLORS.edge || COLORS.border, width: 1 },
        } as any);
      }
    });

    nodes.forEach((n: any, idx: number) => {
      const pos = positions[idx];
      const color = nodeColors[(n.category ?? idx) % nodeColors.length];
      const size = 0.09;
      slide.addShape('ellipse', {
        x: pos.x - size, y: pos.y - size, w: size * 2, h: size * 2,
        fill: { color },
        line: { color: COLORS.white, width: 1 },
      } as any);
      slide.addText(n.name, {
        x: pos.x - 0.7, y: pos.y + size + 0.03, w: 1.4, h: 0.26,
        fontSize: 9, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
      });
    });
  } else {
    slide.addText('（暂无生态数据）', {
      x: mainX, y: mainY + 1.2, w: mainW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const legendX = 7.2;
  const legendW = 2.2;
  const legendY = 2.45;
  if (categories.length > 0) {
    addTheme06Card(slide, legendX, legendY, legendW, 0.42 + categories.length * 0.34);
    slide.addText('分类', {
      x: legendX + 0.12, y: legendY + 0.1, w: legendW - 0.24, h: 0.22,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });
    categories.forEach((cat: any, idx: number) => {
      const y = legendY + 0.36 + idx * 0.34;
      const color = nodeColors[idx % nodeColors.length];
      slide.addShape('ellipse', {
        x: legendX + 0.12, y: y + 0.06, w: 0.14, h: 0.14,
        fill: { color },
      } as any);
      slide.addText(cat.name, {
        x: legendX + 0.34, y, w: legendW - 0.5, h: 0.28,
        fontSize: 10, color: COLORS.primary, valign: 'middle', fontFace: FONTS.body,
      });
    });
  }

  if (props.conclusion) {
    const conclusionY = legendY + (categories.length > 0 ? 0.6 + categories.length * 0.34 : 0) + 0.14;
    const conclusionH = 5.18 - conclusionY - 0.25;
    if (conclusionH > 0.5) {
      addTheme06Card(slide, legendX, conclusionY, legendW, conclusionH, true);
      slide.addText('关键结论', {
        x: legendX + 0.12, y: conclusionY + 0.1, w: legendW - 0.24, h: 0.2,
        fontSize: 10, color: 'FFFFFF', bold: true, fontFace: FONTS.mono,
      });
      slide.addText(props.conclusion, {
        x: legendX + 0.12, y: conclusionY + 0.34, w: legendW - 0.24, h: conclusionH - 0.46,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06CoverProductV1(slide: PptxSlide, props: any): void {
  const cx = 5.0;
  const badgeH = 0.34;
  const badgeW = (props.badge?.length ?? 0) * 0.08 + 0.3;
  if (props.badge) {
    addTheme06Badge(slide, cx - badgeW / 2, 1.0, badgeW, badgeH, props.badge);
  }
  if (props.hero) {
    slide.addText(props.hero, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.9,
      fontSize: 56, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: props.hero ? 2.45 : 1.6, w: 8.7, h: 0.6,
    fontSize: 28, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: props.hero ? 3.1 : 2.25, w: 7.0, h: 0.5,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
  const kpis = (props.kpis || []).filter((k: any) => k != null).slice(0, 3);
  if (kpis.length > 0) {
    const cardW = 2.6;
    const gap = 0.2;
    const totalW = kpis.length * cardW + (kpis.length - 1) * gap;
    const startX = (10 - totalW) / 2;
    const y = 3.9;
    kpis.forEach((k: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      addTheme06Card(slide, x, y, cardW, 0.9);
      slide.addText(`${k.value ?? ''}${k.unit ?? ''}`, {
        x: x + 0.1, y: y + 0.12, w: cardW - 0.2, h: 0.36,
        fontSize: 26, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(k.label ?? '', {
        x: x + 0.1, y: y + 0.52, w: cardW - 0.2, h: 0.24,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }
  addTheme06GlowLine(slide);
  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

export function renderTheme06CoverBusinessV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.25, w: 5.0, h: 1.2,
    fontSize: 42, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.45, w: 5.0, h: 0.5,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const bars = (props.bars || []).filter((b: any) => b != null).slice(0, 4);
  if (bars.length > 0) {
    const startX = 6.1;
    const cardW = 3.25;
    bars.forEach((b: any, idx: number) => {
      const y = 0.9 + idx * 1.05;
      addTheme06ProgressCard(slide, startX, y, cardW, 0.9, b.label ?? '', b.value ?? '', b.progress ?? 0.5);
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06ChapterNumberedV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.number ?? '', {
    x: 0.65, y: 1.45, w: 8.7, h: 1.3,
    fontSize: 100, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(props.title ?? '', {
    x: 0.65, y: 2.85, w: 8.7, h: 0.9,
    fontSize: 44, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 3.75, w: 8.7, h: 0.5,
      fontSize: 16, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06ChapterSplitV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.number ?? '', {
    x: 0.65, y: 1.35, w: 5.0, h: 1.0,
    fontSize: 72, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(props.title ?? '', {
    x: 0.65, y: 2.35, w: 5.0, h: 1.0,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 3.35, w: 5.0, h: 0.5,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const items = (props.visualItems || []).filter((i: any) => i != null).slice(0, 4);
  if (items.length > 0) {
    const startX = 6.1;
    const cardW = 1.5;
    const gap = 0.16;
    items.forEach((item: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (cardW + gap);
      const y = 1.4 + row * 1.35;
      addTheme06Card(slide, x, y, cardW, 1.2);
      slide.addText(item.value ?? '', {
        x: x + 0.1, y: y + 0.2, w: cardW - 0.2, h: 0.42,
        fontSize: 28, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.1, y: y + 0.64, w: cardW - 0.2, h: 0.36,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06TrendV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06Card(slide, 0.65, 2.15, 8.7, 2.7);
  const labels = (props.labels || []).map((l: any) => (typeof l === 'string' ? l : l?.item ?? ''));
  const data = (props.data || []).map((d: any) => (typeof d === 'number' ? d : Number(d?.item ?? 0) || 0));
  if (labels.length > 0 && data.length > 0) {
    const chartW = 8.5;
    const chartH = 2.5;
    const chartX = 0.75;
    const chartY = 2.25;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const plotH = chartH - 0.7;
    const plotY = chartY + 0.35;
    const stepX = chartW / (labels.length - 1 || 1);
    const points = data.map((value: number, idx: number) => {
      const x = chartX + idx * stepX;
      const y = plotY + plotH - ((value - min * 0.9) / (max - min * 0.9 || 1)) * plotH;
      return { x, y };
    });
    for (let i = 0; i < points.length - 1; i++) {
      slide.addShape('line', {
        x1: points[i].x, y1: points[i].y, x2: points[i + 1].x, y2: points[i + 1].y,
        line: { color: COLORS.accent, width: 3 },
      } as any);
    }
    points.forEach((p: any, idx: number) => {
      slide.addShape('ellipse', {
        x: p.x - 0.06, y: p.y - 0.06, w: 0.12, h: 0.12,
        fill: { color: COLORS.accent },
        line: { color: COLORS.white, width: 1 },
      } as any);
      if (idx % 2 === 0) {
        slide.addText(labels[idx] ?? '', {
          x: p.x - 0.35, y: chartY + chartH - 0.32, w: 0.7, h: 0.22,
          fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
        });
      }
    });
  } else {
    slide.addText('（暂无趋势数据）', {
      x: 0.65, y: 3.2, w: 8.7, h: 0.5,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }
  const events = (props.events || []).filter((e: any) => e != null && e.label).slice(0, 4);
  if (events.length > 0) {
    const eventText = events.map((e: any) => `● ${e.label}`).join('   ');
    slide.addText(eventText, {
      x: 0.65, y: 4.95, w: 8.7, h: 0.22,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  }
  if (props.unit) {
    slide.addText(`单位：${props.unit}`, {
      x: 7.4, y: 4.95, w: 1.95, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06CumulativeV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 5.4, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 5.4, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06Card(slide, 0.65, 2.15, 5.4, 2.7);
  const labels = (props.labels || []).map((l: any) => (typeof l === 'string' ? l : l?.item ?? ''));
  const data = (props.data || []).map((d: any) => (typeof d === 'number' ? d : Number(d?.item ?? 0) || 0));
  if (labels.length > 0 && data.length > 0) {
    const chartX = 0.85;
    const chartY = 2.35;
    const chartW = 5.0;
    const chartH = 2.4;
    const max = Math.max(...data, 1);
    const barW = chartW / data.length * 0.7;
    const gap = chartW / data.length * 0.3;
    data.forEach((value: number, idx: number) => {
      const h = (value / max) * (chartH - 0.5);
      const x = chartX + idx * (barW + gap) + gap / 2;
      const y = chartY + chartH - 0.5 - h;
      slide.addShape('roundRect', {
        x, y, w: barW, h,
        fill: { color: idx === data.length - 1 ? COLORS.accent : COLORS.accent2 },
        rectRadius: 0.04,
      } as any);
      slide.addText(labels[idx] ?? '', {
        x: x - 0.05, y: chartY + chartH - 0.42, w: barW + 0.1, h: 0.22,
        fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  } else {
    slide.addText('（暂无累计数据）', {
      x: 0.65, y: 3.2, w: 5.4, h: 0.5,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }
  if (props.unit) {
    slide.addText(`单位：${props.unit}`, {
      x: 4.3, y: 4.95, w: 1.75, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }
  const conclusion = props.conclusion;
  if (conclusion) {
    const cx = 6.65;
    const cy = 2.15;
    const cw = 2.7;
    const ch = 2.7;
    addTheme06Card(slide, cx, cy, cw, ch, true);
    if (conclusion.label) {
      slide.addText(conclusion.label, {
        x: cx + 0.12, y: cy + 0.12, w: cw - 0.24, h: 0.22,
        fontSize: 10, color: 'FFFFFF', bold: true, fontFace: FONTS.mono,
      });
    }
    if (conclusion.value) {
      slide.addText(conclusion.value, {
        x: cx + 0.12, y: cy + 0.38, w: cw - 0.24, h: 0.5,
        fontSize: 32, color: 'FFFFFF', bold: true, fontFace: FONTS.heading,
      });
    }
    if (conclusion.description) {
      slide.addText(conclusion.description, {
        x: cx + 0.12, y: cy + (conclusion.value ? 0.92 : 0.38), w: cw - 0.24, h: ch - (conclusion.value ? 1.1 : 0.56),
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06QuadrantV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const gridX = 0.65;
  const gridY = 2.15;
  const gridW = 6.3;
  const gridH = 3.05;
  addTheme06QuadrantGrid(slide, gridX, gridY, gridW, gridH);
  slide.addText(props.xAxisLabel ?? '', {
    x: gridX + gridW - 1.8, y: gridY + gridH - 0.32, w: 1.8, h: 0.22,
    fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
  });
  slide.addText(props.yAxisLabel ?? '', {
    x: gridX + 0.08, y: gridY + 0.06, w: 1.8, h: 0.22,
    fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
  });
  const bubbles = (props.bubbles || []).filter((b: any) => b != null && typeof b.x === 'number' && typeof b.y === 'number').slice(0, 12);
  bubbles.forEach((b: any) => {
    const size = Math.max(0.25, (b.size ?? 30) / 100);
    const x = gridX + (b.x / 100) * gridW;
    const y = gridY + gridH - (b.y / 100) * gridH;
    addTheme06Bubble(slide, x, y, size, b.name ?? '', COLORS.accent);
  });
  const legendX = 7.1;
  const legendY = 2.15;
  const legendW = 2.25;
  if (bubbles.length > 0) {
    addTheme06Card(slide, legendX, legendY, legendW, 0.42 + bubbles.length * 0.34);
    slide.addText('图例', {
      x: legendX + 0.12, y: legendY + 0.1, w: legendW - 0.24, h: 0.22,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });
    bubbles.slice(0, 6).forEach((b: any, idx: number) => {
      const y = legendY + 0.36 + idx * 0.34;
      slide.addShape('ellipse', {
        x: legendX + 0.12, y: y + 0.06, w: 0.14, h: 0.14,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(b.name ?? '', {
        x: legendX + 0.34, y, w: legendW - 0.5, h: 0.28,
        fontSize: 10, color: COLORS.primary, valign: 'middle', fontFace: FONTS.body,
      });
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06OutlookV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const points = (props.points || []).filter((p: any) => p != null).slice(0, 4);
  const steps = (props.steps || []).filter((s: any) => s != null).slice(0, 4);
  const leftW = 4.5;
  const rightX = 5.35;
  const rightW = 4.0;
  const startY = 2.2;
  const rowH = 0.7;
  points.forEach((p: any, idx: number) => {
    const y = startY + idx * (rowH + 0.1);
    addTheme06Card(slide, 0.65, y, leftW, rowH);
    slide.addText(String(idx + 1), {
      x: 0.8, y: y + 0.18, w: 0.34, h: 0.34,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
    slide.addShape('ellipse', {
      x: 0.75, y: y + 0.13, w: 0.36, h: 0.36,
      fill: { color: COLORS.accent },
    } as any);
    slide.addText(p.text ?? '', {
      x: 1.22, y: y + 0.12, w: leftW - 0.6, h: 0.46,
      fontSize: 11, color: COLORS.primary, valign: 'middle', fontFace: FONTS.body,
    });
  });
  steps.forEach((s: any, idx: number) => {
    const y = startY + idx * (rowH + 0.12);
    addTheme06Card(slide, rightX, y, rightW, rowH + 0.08, idx === steps.length - 1);
    if (s.date) {
      slide.addText(s.date, {
        x: rightX + 0.1, y: y + 0.08, w: rightW - 0.2, h: 0.2,
        fontSize: 9, color: idx === steps.length - 1 ? 'FFFFFF' : COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
    }
    slide.addText(s.title ?? '', {
      x: rightX + 0.1, y: y + 0.28, w: rightW - 0.2, h: 0.22,
      fontSize: 11, color: idx === steps.length - 1 ? 'FFFFFF' : COLORS.primary, bold: true, fontFace: FONTS.body,
    });
    if (s.description) {
      slide.addText(s.description, {
        x: rightX + 0.1, y: y + 0.5, w: rightW - 0.2, h: 0.28,
        fontSize: 9, color: idx === steps.length - 1 ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });
  addTheme06GlowLine(slide);
}

export function renderTheme06RecapV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const points = (props.points || []).filter((p: any) => p != null).slice(0, 4);
  const leftW = 5.0;
  const startY = 2.25;
  const rowH = 0.62;
  points.forEach((p: any, idx: number) => {
    const y = startY + idx * (rowH + 0.1);
    addTheme06Card(slide, 0.65, y, leftW, rowH);
    slide.addText('✓', {
      x: 0.85, y: y + 0.16, w: 0.3, h: 0.3,
      fontSize: 11, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
    slide.addShape('ellipse', {
      x: 0.8, y: y + 0.11, w: 0.32, h: 0.32,
      fill: { color: COLORS.accent },
    } as any);
    slide.addText(p.text ?? '', {
      x: 1.22, y: y + 0.1, w: leftW - 0.6, h: 0.42,
      fontSize: 11, color: COLORS.primary, valign: 'middle', fontFace: FONTS.body,
    });
  });
  if (props.value || props.valueLabel) {
    const cardX = 6.0;
    const cardY = 2.25;
    const cardW = 3.35;
    const cardH = 2.78;
    addTheme06Card(slide, cardX, cardY, cardW, cardH, true);
    if (props.value) {
      slide.addText(props.value, {
        x: cardX + 0.12, y: cardY + 0.35, w: cardW - 0.24, h: 0.9,
        fontSize: 54, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
      });
    }
    if (props.valueLabel) {
      slide.addText(props.valueLabel, {
        x: cardX + 0.12, y: cardY + 1.35, w: cardW - 0.24, h: 1.0,
        fontSize: 12, color: 'FFFFFF', align: 'center', valign: 'top', fontFace: FONTS.body,
      });
    }
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06CompanyRoundsV1(slide: PptxSlide, props: any): void {
  slide.addText(props.company ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.65,
    fontSize: 44, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.tagline) {
    slide.addText(props.tagline, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const rounds = (props.rounds || []).filter((r: any) => r != null).slice(0, 6);
  if (rounds.length > 0) {
    const startX = 0.85;
    const totalW = 8.3;
    const step = totalW / rounds.length;
    const cy = 3.2;
    rounds.forEach((r: any, idx: number) => {
      const cx = startX + step * idx + step / 2;
      const focus = idx === rounds.length - 1;
      addTheme06TimelineNode(slide, cx, cy, r.round ?? '', r.date ?? '', focus);
      if (r.amount) {
        slide.addText(r.amount, {
          x: cx - 0.6, y: cy + 0.42, w: 1.2, h: 0.22,
          fontSize: 10, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.mono,
        });
      }
      if (r.investor) {
        slide.addText(r.investor, {
          x: cx - 0.65, y: cy + 0.66, w: 1.3, h: 0.36,
          fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
        });
      }
      if (idx > 0) {
        const prevX = startX + step * (idx - 1) + step / 2;
        slide.addShape('line', {
          x1: prevX + 0.18, y1: cy, x2: cx - 0.18, y2: cy,
          line: { color: COLORS.border, width: 2 },
        } as any);
      }
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06CompanyInvestorsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const investors = (props.investors || []).filter((i: any) => i != null).slice(0, 9);
  if (investors.length > 0) {
    const cols = 3;
    const cardW = 2.7;
    const cardH = 1.05;
    const gapX = 0.22;
    const gapY = 0.18;
    const startX = 0.65;
    const startY = 2.2;
    investors.forEach((inv: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH, idx === 0);
      slide.addText(inv.name ?? '', {
        x: x + 0.1, y: y + 0.15, w: cardW - 0.2, h: 0.3,
        fontSize: 15, color: idx === 0 ? 'FFFFFF' : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      const meta = [inv.type, inv.stage].filter(Boolean).join('  ·  ');
      slide.addText(meta, {
        x: x + 0.1, y: y + 0.5, w: cardW - 0.2, h: 0.36,
        fontSize: 10, color: idx === 0 ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.mono,
      });
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06CompanyComparisonV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const dimensions = (props.dimensions || []).map((d: any) => (typeof d === 'string' ? d : d?.item ?? '')).slice(0, 6);
  const companies = (props.companies || []).filter((c: any) => c != null).slice(0, 6);
  if (dimensions.length > 0 && companies.length > 0) {
    const tableX = 0.65;
    const tableY = 2.2;
    const tableW = 8.7;
    const rowH = 0.48;
    const headerH = 0.42;
    addTheme06Card(slide, tableX, tableY, tableW, headerH + companies.length * rowH);
    slide.addShape('rect', {
      x: tableX, y: tableY, w: tableW, h: headerH,
      fill: { color: COLORS.surfaceSolid },
    } as any);
    slide.addText('公司 / 维度', {
      x: tableX + 0.1, y: tableY + 0.08, w: 1.8, h: 0.26,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.body,
    });
    const colW = (tableW - 1.9) / dimensions.length;
    dimensions.forEach((dim: string, idx: number) => {
      slide.addText(dim, {
        x: tableX + 1.9 + idx * colW, y: tableY + 0.08, w: colW, h: 0.26,
        fontSize: 10, color: COLORS.secondary, bold: true, align: 'center', fontFace: FONTS.body,
      });
    });
    companies.forEach((company: any, rIdx: number) => {
      const y = tableY + headerH + rIdx * rowH;
      slide.addText(company.name ?? '', {
        x: tableX + 0.1, y: y + 0.1, w: 1.8, h: 0.28,
        fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      const values = (company.values || []).map((v: any) => (typeof v === 'string' ? v : v?.item ?? ''));
      dimensions.forEach((_: string, cIdx: number) => {
        const value = values[cIdx] ?? '';
        slide.addText(value, {
          x: tableX + 1.9 + cIdx * colW, y: y + 0.1, w: colW, h: 0.28,
          fontSize: 10, color: rIdx === 0 ? COLORS.accent : COLORS.primary, bold: rIdx === 0, align: 'center', fontFace: FONTS.body,
        });
      });
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06GeoCitiesV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const cities = (props.cities || []).filter((c: any) => c != null).slice(0, 8);
  if (cities.length > 0) {
    const maxValue = Math.max(...cities.map((c: any) => Number((c.value || '').replace(/,/g, '')) || 0), 1);
    const startY = 2.2;
    const rowH = 0.52;
    cities.forEach((city: any, idx: number) => {
      const y = startY + idx * (rowH + 0.1);
      addTheme06Card(slide, 0.65, y, 8.7, rowH);
      slide.addText(city.name ?? '', {
        x: 0.85, y: y + 0.12, w: 0.8, h: 0.28,
        fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
      slide.addShape('ellipse', {
        x: 0.8, y: y + 0.07, w: 0.36, h: 0.36,
        fill: { color: COLORS.surfaceSolid },
        line: { color: COLORS.border, width: 1 },
      } as any);
      const numeric = Number((city.value || '').replace(/,/g, '')) || 0;
      const barW = 5.2;
      const fillW = (numeric / maxValue) * barW;
      slide.addShape('roundRect', {
        x: 1.8, y: y + 0.18, w: barW, h: 0.16,
        fill: { color: COLORS.surface },
        rectRadius: 0.08,
      } as any);
      slide.addShape('roundRect', {
        x: 1.8, y: y + 0.18, w: fillW, h: 0.16,
        fill: { color: COLORS.accent },
        rectRadius: 0.08,
      } as any);
      slide.addText(`${city.value ?? ''}${city.unit ?? ''}`, {
        x: 7.2, y: y + 0.1, w: 1.2, h: 0.32,
        fontSize: 14, color: COLORS.primary, bold: true, align: 'right', fontFace: FONTS.heading,
      });
      if (city.change) {
        const positive = String(city.change).startsWith('+');
        slide.addText(city.change, {
          x: 8.5, y: y + 0.12, w: 0.7, h: 0.28,
          fontSize: 10, color: positive ? COLORS.accent2 : 'E85D4E', bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
        });
      }
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06AgentV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const mainX = 0.65;
  const mainY = 2.15;
  const mainW = 6.3;
  const mainH = 3.05;
  addTheme06Card(slide, mainX, mainY, mainW, mainH);
  const categories = (props.categories || []).map((c: any) => (typeof c === 'string' ? { name: c } : { name: c?.item ?? c?.name ?? '' })).filter((c: any) => c.name).slice(0, 4);
  const nodes = (props.nodes || []).filter((n: any) => n != null && (n.id || n.name)).slice(0, 20);
  const links = (props.links || []).filter((l: any) => l != null && l.source != null && l.target != null).slice(0, 30);
  const nodeColors = [COLORS.accent, COLORS.accent2, COLORS.accentCool, 'E85D4E'];
  if (nodes.length > 0) {
    const cx = mainX + mainW / 2;
    const cy = mainY + mainH / 2;
    const radius = Math.min(mainW, mainH) * 0.34;
    const positions: { x: number; y: number }[] = [];
    const count = nodes.length;
    const startAngle = -Math.PI / 2;
    nodes.forEach((_: any, idx: number) => {
      const angle = startAngle + (idx * 2 * Math.PI) / count;
      positions.push({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
    });
    const nodeMap: Record<string, { x: number; y: number }> = {};
    nodes.forEach((n: any, idx: number) => {
      nodeMap[n.id ?? n.name] = positions[idx];
    });
    links.forEach((l: any) => {
      const s = nodeMap[l.source];
      const t = nodeMap[l.target];
      if (s && t) {
        slide.addShape('line', {
          x1: s.x, y1: s.y, x2: t.x, y2: t.y,
          line: { color: COLORS.edge || COLORS.border, width: 1 },
        } as any);
      }
    });
    nodes.forEach((n: any, idx: number) => {
      const pos = positions[idx];
      const color = nodeColors[(n.category ?? idx) % nodeColors.length];
      const size = 0.09;
      slide.addShape('ellipse', {
        x: pos.x - size, y: pos.y - size, w: size * 2, h: size * 2,
        fill: { color },
        line: { color: COLORS.white, width: 1 },
      } as any);
      slide.addText(n.name ?? n.id ?? '', {
        x: pos.x - 0.7, y: pos.y + size + 0.03, w: 1.4, h: 0.26,
        fontSize: 9, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
      });
    });
  } else {
    slide.addText('（暂无 Agent 数据）', {
      x: mainX, y: mainY + 1.2, w: mainW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }
  const legendX = 7.1;
  const legendY = 2.15;
  const legendW = 2.25;
  if (categories.length > 0) {
    addTheme06Card(slide, legendX, legendY, legendW, 0.42 + categories.length * 0.34);
    slide.addText('分类', {
      x: legendX + 0.12, y: legendY + 0.1, w: legendW - 0.24, h: 0.22,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });
    categories.forEach((cat: any, idx: number) => {
      const y = legendY + 0.36 + idx * 0.34;
      const color = nodeColors[idx % nodeColors.length];
      slide.addShape('ellipse', {
        x: legendX + 0.12, y: y + 0.06, w: 0.14, h: 0.14,
        fill: { color },
      } as any);
      slide.addText(cat.name, {
        x: legendX + 0.34, y, w: legendW - 0.5, h: 0.28,
        fontSize: 10, color: COLORS.primary, valign: 'middle', fontFace: FONTS.body,
      });
    });
  }
  if (props.conclusion) {
    const conclusion = typeof props.conclusion === 'string' ? { text: props.conclusion } : props.conclusion;
    const conclusionY = legendY + (categories.length > 0 ? 0.6 + categories.length * 0.34 : 0) + 0.14;
    const conclusionH = 5.18 - conclusionY - 0.25;
    if (conclusionH > 0.5) {
      addTheme06Card(slide, legendX, conclusionY, legendW, conclusionH, true);
      if (conclusion.label) {
        slide.addText(conclusion.label, {
          x: legendX + 0.12, y: conclusionY + 0.1, w: legendW - 0.24, h: 0.2,
          fontSize: 10, color: 'FFFFFF', bold: true, fontFace: FONTS.mono,
        });
      }
      slide.addText(conclusion.text ?? '', {
        x: legendX + 0.12, y: conclusionY + (conclusion.label ? 0.34 : 0.1), w: legendW - 0.24, h: conclusionH - (conclusion.label ? 0.46 : 0.22),
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06SearchV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const steps = (props.steps || []).filter((s: any) => s != null).slice(0, 6);
  if (steps.length > 0) {
    const startX = 0.65;
    const totalW = 8.7;
    const gap = 0.16;
    const cardW = (totalW - (steps.length - 1) * gap) / steps.length;
    const y = 2.4;
    const h = 2.5;
    steps.forEach((step: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      addTheme06StepCard(slide, x, y, cardW, h, step, idx === steps.length - 1);
      if (idx < steps.length - 1) {
        slide.addText('→', {
          x: x + cardW + 0.01, y: y + h / 2 - 0.15, w: gap - 0.02, h: 0.3,
          fontSize: 14, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
        });
      }
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06CoverManufacturingV1(slide: PptxSlide, props: any): void {
  if (props.badge) {
    addTheme06Badge(slide, 0.65, 0.78, 1.8, 0.28, props.badge);
  }
  if (props.headline) {
    slide.addText(props.headline, {
      x: 0.65, y: 1.2, w: 6.5, h: 0.5,
      fontSize: 18, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.75, w: 6.5, h: 1.0,
    fontSize: 46, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.8, w: 6.0, h: 0.6,
      fontSize: 15, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const metrics = (props.metrics || []).filter((m: any) => m != null).slice(0, 3);
  if (metrics.length > 0) {
    const cardW = 2.4;
    const startX = 7.0;
    metrics.forEach((m: any, idx: number) => {
      const y = 1.1 + idx * 1.15;
      addTheme06Card(slide, startX, y, cardW, 0.95, idx === 0);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x: startX + 0.16, y: y + 0.16, w: cardW - 0.32, h: 0.42,
        fontSize: 28, color: idx === 0 ? COLORS.accent : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x: startX + 0.16, y: y + 0.58, w: cardW - 0.32, h: 0.22,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06CoverBrandV1(slide: PptxSlide, props: any): void {
  if (props.badge) {
    addTheme06Badge(slide, 0.65, 0.78, 1.8, 0.28, props.badge);
  }
  if (props.headline) {
    slide.addText(props.headline, {
      x: 0.65, y: 1.2, w: 6.5, h: 0.5,
      fontSize: 18, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.75, w: 6.5, h: 1.0,
    fontSize: 46, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.8, w: 6.0, h: 0.6,
      fontSize: 15, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const channels = (props.channels || []).filter((c: any) => c != null).slice(0, 6);
  if (channels.length > 0) {
    const cols = Math.min(2, channels.length);
    const cardW = 2.25;
    const cardH = 0.85;
    const gapX = 0.22;
    const gapY = 0.2;
    const startX = 6.8;
    const startY = 1.05;
    channels.forEach((c: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme06Card(slide, x, y, cardW, cardH, false);
      slide.addText(c.name ?? '', {
        x: x + 0.12, y: y + 0.12, w: cardW - 0.24, h: 0.28,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      slide.addText(c.metric ?? '', {
        x: x + 0.12, y: y + 0.44, w: cardW - 0.24, h: 0.24,
        fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono,
      });
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06MethodV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const steps = (props.steps || []).filter((s: any) => s != null).slice(0, 4);
  if (steps.length > 0) {
    const totalW = 8.7;
    const gap = 0.22;
    const cardW = (totalW - (steps.length - 1) * gap) / steps.length;
    const y = 2.35;
    const h = 2.5;
    steps.forEach((step: any, idx: number) => {
      const x = 0.65 + idx * (cardW + gap);
      addTheme06Card(slide, x, y, cardW, h, idx === steps.length - 1);
      slide.addText(step.number ?? String(idx + 1).padStart(2, '0'), {
        x: x + 0.16, y: y + 0.16, w: cardW - 0.32, h: 0.4,
        fontSize: 22, color: idx === steps.length - 1 ? COLORS.accent : COLORS.secondary, bold: true, fontFace: FONTS.mono,
      });
      slide.addText(step.title ?? '', {
        x: x + 0.16, y: y + 0.62, w: cardW - 0.32, h: 0.38,
        fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(step.description ?? '', {
        x: x + 0.16, y: y + 1.06, w: cardW - 0.32, h: 1.1,
        fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06QuarterQ1V1(slide: PptxSlide, props: any): void {
  renderTheme06QuarterCore(slide, props, COLORS.accent);
}

export function renderTheme06QuarterQ2V1(slide: PptxSlide, props: any): void {
  renderTheme06QuarterCore(slide, props, COLORS.accent2 ?? COLORS.accent);
}

export function renderTheme06QuarterQ3V1(slide: PptxSlide, props: any): void {
  renderTheme06QuarterCore(slide, props, COLORS.accentCool ?? COLORS.accent);
}

export function renderTheme06QuarterQ4V1(slide: PptxSlide, props: any): void {
  renderTheme06QuarterCore(slide, props, COLORS.accent);
}

export function renderTheme06QuarterCore(slide: PptxSlide, props: any, barColor: string): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.55,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.72, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06Card(slide, 0.65, 2.15, 5.6, 2.75, false);
  const labels = (props.labels || []).map((l: any) => (typeof l === 'string' ? l : l?.item ?? ''));
  const data = (props.data || []).map((v: any) => (typeof v === 'number' ? v : Number(v?.item ?? 0) || 0));
  const validLabels = labels.slice(0, data.length);
  const validData = data.slice(0, labels.length);
  if (validLabels.length > 0 && validData.length > 0) {
    const max = Math.max(...validData, 1);
    const chartY = 2.35;
    const chartH = 2.35;
    const chartX = 0.85;
    const chartW = 5.2;
    const barGap = chartW / validData.length;
    const barW = barGap * 0.55;
    validData.forEach((value: number, idx: number) => {
      const h = (value / max) * (chartH - 0.35);
      const x = chartX + idx * barGap + (barGap - barW) / 2;
      const y = chartY + chartH - h;
      slide.addShape('rect', { x, y, w: barW, h, fill: { color: barColor.replace('#', '') } });
      slide.addText(String(value), {
        x: x - 0.05, y: y - 0.28, w: barW + 0.1, h: 0.22,
        fontSize: 10, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.mono,
      });
      slide.addText(validLabels[idx] ?? '', {
        x: x - 0.05, y: chartY + chartH + 0.05, w: barW + 0.1, h: 0.22,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }
  if (props.highlight) {
    addTheme06Card(slide, 6.55, 2.15, 2.8, 1.25, true);
    slide.addText('关键事件', {
      x: 6.7, y: 2.3, w: 2.5, h: 0.22,
      fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
    slide.addText(props.highlight, {
      x: 6.7, y: 2.58, w: 2.5, h: 0.65,
      fontSize: 12, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.conclusion) {
    addTheme06Card(slide, 6.55, 3.55, 2.8, 1.35, false);
    slide.addText('季度结论', {
      x: 6.7, y: 3.7, w: 2.5, h: 0.22,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, bold: true,
    });
    slide.addText(props.conclusion, {
      x: 6.7, y: 3.98, w: 2.5, h: 0.75,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06BigNumberV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  if (props.title) {
    slide.addText(props.title, {
      x: 0.65, y: 1.15, w: 8.7, h: 0.45,
      fontSize: 32, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  const number = props.number ?? '0';
  const unit = props.unit ?? '';
  slide.addText(`${number}${unit}`, {
    x: 0.65, y: 1.95, w: 8.7, h: 1.2,
    fontSize: 80, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.label) {
    slide.addText(props.label, {
      x: 0.65, y: 3.05, w: 8.7, h: 0.32,
      fontSize: 20, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.65, y: 3.42, w: 6.0, h: 0.55,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const supporting = (props.supporting || []).filter((s: any) => s != null).slice(0, 3);
  if (supporting.length > 0) {
    const cardW = 2.0;
    const startX = 6.8;
    supporting.forEach((s: any, idx: number) => {
      const y = 1.95 + idx * 0.92;
      addTheme06Card(slide, startX, y, cardW, 0.75, idx === 0);
      slide.addText(s.value ?? '', {
        x: startX + 0.12, y: y + 0.12, w: cardW - 0.24, h: 0.34,
        fontSize: 22, color: idx === 0 ? COLORS.accent : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(s.label ?? '', {
        x: startX + 0.12, y: y + 0.48, w: cardW - 0.24, h: 0.18,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06ChapterFocusV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  if (props.title) {
    slide.addText(props.title, {
      x: 0.65, y: 1.15, w: 5.8, h: 1.2,
      fontSize: 44, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.35, w: 5.8, h: 0.6,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06Card(slide, 7.0, 1.15, 2.35, 2.4, true);
  const focusValue = `${props.focusValue ?? ''}${props.focusUnit ?? ''}`;
  slide.addText(focusValue, {
    x: 7.12, y: 1.45, w: 2.11, h: 0.85,
    fontSize: 46, color: COLORS.white, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.focusLabel) {
    slide.addText(props.focusLabel, {
      x: 7.12, y: 2.35, w: 2.11, h: 0.9,
      fontSize: 12, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06ChapterImageV1(slide: PptxSlide, props: any): void {
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.0, h: 5.4,
    fill: { color: '151C27' },
  } as any);
  if (props.imageUrl) {
    slide.addImage({ path: props.imageUrl, x: 0, y: 0, w: 5.0, h: 5.4 });
  }
  if (props.tag) {
    slide.addText(props.tag, {
      x: 5.4, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  if (props.title) {
    slide.addText(props.title, {
      x: 5.4, y: 1.35, w: 4.0, h: 1.2,
      fontSize: 44, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 5.4, y: 2.55, w: 4.0, h: 0.6,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06ChapterMinimalV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 1.8, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addShape('rect', {
    x: 0.65, y: 2.2, w: 1.1, h: 0.04,
    fill: { color: COLORS.accent },
  } as any);
  if (props.title) {
    slide.addText(props.title, {
      x: 0.65, y: 2.4, w: 8.7, h: 1.2,
      fontSize: 52, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 3.6, w: 6.5, h: 0.5,
      fontSize: 16, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06TriadV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 3);
  const cardW = 2.65;
  const gap = 0.28;
  const startX = 0.65;
  items.forEach((item: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const y = 2.25;
    addTheme06Card(slide, x, y, cardW, 2.4, !!item.accent);
    let cursorY = y + 0.16;
    if (item.value) {
      slide.addText(item.value, {
        x: x + 0.14, y: cursorY, w: cardW - 0.28, h: 0.45,
        fontSize: 28, color: item.accent ? COLORS.white : COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.5;
    }
    if (item.title) {
      slide.addText(item.title, {
        x: x + 0.14, y: cursorY, w: cardW - 0.28, h: 0.45,
        fontSize: 18, color: item.accent ? COLORS.white : COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      cursorY += 0.55;
    }
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.14, y: cursorY, w: cardW - 0.28, h: 1.0,
        fontSize: 11, color: item.accent ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });
  addTheme06GlowLine(slide);
}

export function renderTheme06DealMapV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const nodes = (props.nodes || []).filter((n: any) => n != null && n.name).slice(0, 12);
  const grouped: Record<number, any[]> = {};
  nodes.forEach((n: any) => {
    const cat = n.category ?? 0;
    grouped[cat] = grouped[cat] || [];
    grouped[cat].push(n);
  });
  const cols = Object.keys(grouped).slice(0, 4).map((k) => Number(k));
  const colW = 1.9;
  const startX = 0.65;
  const startY = 2.25;
  cols.forEach((cat, colIdx) => {
    const x = startX + colIdx * (colW + 0.25);
    grouped[cat].slice(0, 4).forEach((node: any, rowIdx: number) => {
      const y = startY + rowIdx * 0.65;
      addTheme06Card(slide, x, y, colW, 0.55, cat === 2);
      slide.addText(node.name, {
        x: x + 0.1, y: y + 0.14, w: colW - 0.2, h: 0.32,
        fontSize: 11, color: cat === 2 ? COLORS.white : COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
    });
  });
  if (props.conclusion) {
    addTheme06Card(slide, 6.8, 2.25, 2.55, 2.4, true);
    slide.addText(props.conclusion, {
      x: 6.95, y: 2.45, w: 2.25, h: 2.0,
      fontSize: 12, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06SizeSplitV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const items = (props.items || []).filter((i: any) => i != null && i.name).slice(0, 8);
  if (items.length > 0) {
    slide.addChart('pie', [{
      name: props.title || '',
      labels: items.map((i: any) => i.name),
      values: items.map((i: any) => Number(i.value) || 0),
    }], {
      x: 0.65, y: 2.25, w: 5.2, h: 2.9,
      chartColors: [COLORS.accent, COLORS.accent2 ?? COLORS.accent, COLORS.accentCool ?? COLORS.accent, COLORS.primary, COLORS.secondary, 'FF6B45'] as string[],
      showValue: true,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 10,
    });
  }
  if (props.conclusion) {
    addTheme06Card(slide, 6.15, 2.25, 3.2, 2.9, true);
    slide.addText(props.conclusion, {
      x: 6.3, y: 2.45, w: 2.9, h: 2.5,
      fontSize: 13, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06RevenueRiskV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const risks = (props.risks || []).filter((r: any) => r != null).slice(0, 6);
  risks.forEach((risk: any, idx: number) => {
    const y = 2.25 + idx * 0.55;
    const isHigh = risk.level === 'high';
    addTheme06Card(slide, 0.65, y, 5.8, 0.48, isHigh);
    slide.addText(risk.label ?? '', {
      x: 0.8, y: y + 0.12, w: 3.2, h: 0.28,
      fontSize: 12, color: isHigh ? COLORS.white : COLORS.primary, fontFace: FONTS.body,
    });
    slide.addText(risk.impact ?? '', {
      x: 4.1, y: y + 0.12, w: 0.9, h: 0.28,
      fontSize: 12, color: isHigh ? COLORS.white : COLORS.accent, bold: true, fontFace: FONTS.mono,
    });
    slide.addText(`概率 ${risk.probability ?? '-'}`, {
      x: 5.05, y: y + 0.12, w: 1.2, h: 0.28,
      fontSize: 11, color: isHigh ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
    });
  });
  addTheme06Card(slide, 6.8, 2.25, 2.55, 2.4, true);
  slide.addText(props.exposureLabel ?? '预计收入敞口', {
    x: 6.95, y: 2.45, w: 2.25, h: 0.25,
    fontSize: 11, color: 'FFFFFF', fontFace: FONTS.body,
  });
  slide.addText(props.totalExposure ?? '', {
    x: 6.95, y: 2.75, w: 2.25, h: 0.8,
    fontSize: 38, color: COLORS.white, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  addTheme06GlowLine(slide);
}

export function renderTheme06RegionRiskV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const regions = (props.regions || []).filter(Boolean).slice(0, 5);
  const risks = (props.risks || []).filter(Boolean).slice(0, 4);
  const items = (props.items || []).filter((i: any) => i != null && i.region && i.risk).slice(0, 20);
  const cellW = 1.05;
  const cellH = 0.45;
  const startX = 1.6;
  const startY = 2.25;
  risks.forEach((risk: string, rIdx: number) => {
    slide.addText(risk, {
      x: 0.65, y: startY + rIdx * cellH, w: 0.85, h: 0.4,
      fontSize: 10, color: COLORS.secondary, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
  });
  regions.forEach((region: string, cIdx: number) => {
    slide.addText(region, {
      x: startX + cIdx * cellW, y: startY - 0.38, w: cellW, h: 0.3,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  });
  items.forEach((item: any) => {
    const rIdx = risks.indexOf(item.risk);
    const cIdx = regions.indexOf(item.region);
    if (rIdx >= 0 && cIdx >= 0) {
      const value = Number(item.value) || 0;
      const intensity = Math.min(1, value / 10);
      const hex = intensity > 0.5 ? COLORS.accent : '2A3342';
      slide.addShape('rect', {
        x: startX + cIdx * cellW, y: startY + rIdx * cellH, w: cellW - 0.02, h: cellH - 0.02,
        fill: { color: hex },
      } as any);
      slide.addText(String(value), {
        x: startX + cIdx * cellW, y: startY + rIdx * cellH, w: cellW - 0.02, h: cellH - 0.02,
        fontSize: 11, color: intensity > 0.5 ? COLORS.white : COLORS.primary, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
    }
  });
  if (props.conclusion) {
    addTheme06Card(slide, 6.8, 2.25, 2.55, 2.4, true);
    slide.addText(props.conclusion, {
      x: 6.95, y: 2.45, w: 2.25, h: 2.0,
      fontSize: 12, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06OpenRiskV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const items = (props.uncertainties || []).filter((u: any) => u != null).slice(0, 6);
  items.forEach((item: any, idx: number) => {
    const y = 2.25 + idx * 0.72;
    slide.addText(item.horizon ?? '', {
      x: 0.65, y: y + 0.18, w: 1.4, h: 0.25,
      fontSize: 11, color: COLORS.accent, align: 'right', fontFace: FONTS.mono,
    });
    slide.addShape('ellipse', {
      x: 2.18, y: y + 0.22, w: 0.12, h: 0.12,
      fill: { color: COLORS.accent },
    } as any);
    addTheme06Card(slide, 2.45, y, 6.0, 0.58);
    slide.addText(item.scenario ?? '', {
      x: 2.6, y: y + 0.1, w: 3.8, h: 0.25,
      fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(`${item.impact ?? ''} · 概率 ${item.probability ?? '-'}`, {
      x: 2.6, y: y + 0.34, w: 3.8, h: 0.2,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
    });
  });
  if (props.conclusion) {
    addTheme06Card(slide, 6.8, 4.2, 2.55, 1.0, true);
    slide.addText(props.conclusion, {
      x: 6.95, y: 4.35, w: 2.25, h: 0.7,
      fontSize: 11, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06LegalV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const items = (props.items || []).filter((i: any) => i != null).slice(0, 6);
  items.forEach((item: any, idx: number) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 0.65 + col * 4.45;
    const y = 2.25 + row * 1.35;
    addTheme06Card(slide, x, y, 4.25, 1.2);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + 0.12, y: y + 0.1, w: 0.5, h: 0.35,
      fontSize: 20, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
    });
    slide.addText(item.title ?? '', {
      x: x + 0.7, y: y + 0.1, w: 3.35, h: 0.35,
      fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.12, y: y + 0.52, w: 4.01, h: 0.58,
        fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });
  if (props.conclusion) {
    addTheme06Card(slide, 0.65, 4.35, 8.7, 0.75, true);
    slide.addText(props.conclusion, {
      x: 0.8, y: 4.5, w: 8.4, h: 0.5,
      fontSize: 12, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06CapitalFlowV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  const sources = ['VC 基金', 'PE 基金', '战略投资'];
  const targets = ['基础模型', '基础设施', '应用层'];
  const links = (props.links || []).filter((l: any) => l != null && l.source && l.target).slice(0, 12);
  const grouped: Record<string, Record<string, number>> = {};
  sources.forEach((s) => { grouped[s] = {}; });
  links.forEach((l: any) => {
    if (grouped[l.source]) {
      grouped[l.source][l.target] = (grouped[l.source][l.target] || 0) + (Number(l.value) || 0);
    }
  });
  const series = targets.map((t) => ({ name: t, labels: sources, values: sources.map((s) => grouped[s][t] || 0) }));
  slide.addChart('bar', series, {
    x: 0.65, y: 2.25, w: 5.6, h: 2.9,
    chartColors: [COLORS.accent, COLORS.accent2 ?? COLORS.accent, COLORS.accentCool ?? COLORS.accent],
    barDir: 'col',
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });
  if (props.conclusion) {
    addTheme06Card(slide, 6.45, 2.25, 2.9, 2.9, true);
    slide.addText(props.conclusion, {
      x: 6.6, y: 2.45, w: 2.6, h: 2.5,
      fontSize: 12, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06AvgTicketV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const rawLabels = Array.isArray(props.intervals) ? props.intervals : [];
  const rawValues = Array.isArray(props.values) ? props.values : [];
  const labels = rawLabels.map((l: any) => (typeof l === 'string' ? l : l.item ?? '')).filter(Boolean);
  const values = rawValues.map((v: any) => (typeof v === 'number' ? v : Number(v.item ?? 0) || 0));
  const len = Math.min(labels.length, values.length, 8);
  const chartLabels = labels.slice(0, len);
  const chartValues = values.slice(0, len);

  if (chartLabels.length > 0) {
    slide.addChart('bar', [{
      name: props.unit || '数量',
      labels: chartLabels,
      values: chartValues,
    }], {
      x: 0.65, y: 2.25, w: 5.6, h: 2.9,
      chartColors: [COLORS.accent],
      barDir: 'col',
      showValue: true,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 10,
    });
  } else {
    slide.addText('（请在属性面板输入区间与数值）', {
      x: 0.65, y: 3.0, w: 5.6, h: 0.6,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (props.conclusion) {
    addTheme06Card(slide, 6.45, 2.25, 2.9, 2.9, true);
    slide.addText(props.conclusion, {
      x: 6.6, y: 2.45, w: 2.6, h: 2.5,
      fontSize: 12, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme06GlowLine(slide);
}

export function renderTheme06IndustryVerticalV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 6.5, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 6.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.industry) {
    addTheme06Badge(slide, 7.6, 1.25, 1.7, 0.36, props.industry);
  }

  const useCases = (props.useCases || []).filter((c: any) => c != null).slice(0, 4);
  const mainX = 0.65;
  const mainW = 5.0;
  const startY = 2.2;
  const caseH = useCases.length > 0 ? 2.9 / useCases.length - 0.1 : 0;
  useCases.forEach((item: any, idx: number) => {
    const y = startY + idx * (caseH + 0.1);
    addTheme06Card(slide, mainX, y, mainW, caseH, !!item.accent);
    slide.addText(item.title ?? '', {
      x: mainX + 0.12, y: y + 0.1, w: mainW - 0.24, h: 0.24,
      fontSize: 12, color: item.accent ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.body,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: mainX + 0.12, y: y + 0.36, w: mainW - 0.24, h: caseH - 0.48,
        fontSize: 10, color: item.accent ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const highlights = (props.highlights || []).filter((h: any) => h != null).slice(0, 4);
  const asideX = 5.9;
  const asideW = 3.45;
  if (highlights.length > 0) {
    const cols = 2;
    const cellW = (asideW - 0.12) / cols;
    const cellH = 0.92;
    highlights.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = asideX + col * (cellW + 0.12);
      const y = startY + row * (cellH + 0.12);
      addTheme06Card(slide, x, y, cellW, cellH, !!item.accent);
      slide.addText(item.value ?? '', {
        x: x + 0.1, y: y + 0.1, w: cellW - 0.2, h: 0.32,
        fontSize: 18, color: item.accent ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.1, y: y + 0.44, w: cellW - 0.2, h: 0.22,
        fontSize: 9, color: item.accent ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  if (props.insight) {
    const insightY = startY + 2 * (0.92 + 0.12) + 0.12;
    addTheme06Card(slide, asideX, insightY, asideW, 0.82);
    slide.addText(props.insight, {
      x: asideX + 0.12, y: insightY + 0.12, w: asideW - 0.24, h: 0.58,
      fontSize: 10, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06IndustryInfrastructureV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const segments = (props.segments || []).filter((s: any) => s != null).slice(0, 6);
  const mainX = 0.65;
  const mainW = 5.4;
  const startY = 2.2;
  const segH = segments.length > 0 ? (2.9 / segments.length) - 0.08 : 0;
  segments.forEach((item: any, idx: number) => {
    const y = startY + idx * (segH + 0.08);
    addTheme06Card(slide, mainX, y, mainW, segH, !!item.accent);
    const metaText = [item.value, item.title].filter(Boolean).join(' · ');
    slide.addText(metaText, {
      x: mainX + 0.12, y: y + 0.1, w: mainW - 0.24, h: 0.24,
      fontSize: 12, color: item.accent ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.body,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: mainX + 0.12, y: y + 0.36, w: mainW - 0.24, h: segH - 0.48,
        fontSize: 10, color: item.accent ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const metrics = (props.metrics || []).filter((m: any) => m != null).slice(0, 4);
  const asideX = 6.2;
  const asideW = 3.15;
  if (metrics.length > 0) {
    const metricH = 0.72;
    metrics.forEach((item: any, idx: number) => {
      const y = startY + idx * (metricH + 0.1);
      addTheme06Card(slide, asideX, y, asideW, metricH);
      slide.addText(item.value ?? '', {
        x: asideX + 0.12, y: y + 0.1, w: asideW - 0.24, h: 0.3,
        fontSize: 20, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: asideX + 0.12, y: y + 0.42, w: asideW - 0.24, h: 0.2,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  if (props.insight) {
    const insightY = startY + Math.max(metrics.length, 1) * (0.72 + 0.1) + 0.1;
    if (insightY + 0.8 <= 5.0) {
      addTheme06Card(slide, asideX, insightY, asideW, 0.8, true);
      slide.addText(props.insight, {
        x: asideX + 0.12, y: insightY + 0.12, w: asideW - 0.24, h: 0.56,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06CompanySpotlightV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }

  const mainX = 0.65;
  const mainW = 5.0;
  slide.addText(props.company ?? '', {
    x: mainX, y: 1.15, w: mainW, h: 0.7,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.tagline) {
    slide.addText(props.tagline, {
      x: mainX, y: 1.85, w: mainW, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: mainX, y: 2.25, w: mainW, h: 0.8,
      fontSize: 11, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const meta = [props.stage, props.location, props.founded ? `成立于 ${props.founded}` : ''].filter(Boolean);
  let cursorY = 3.15;
  if (meta.length > 0) {
    meta.forEach((text: string, idx: number) => {
      addTheme06Badge(slide, mainX + idx * 1.45, cursorY, 1.35, 0.3, text);
    });
    cursorY += 0.42;
  }

  const metrics = (props.metrics || []).filter((m: any) => m != null).slice(0, 4);
  if (metrics.length > 0) {
    const cols = 2;
    const gap = 0.12;
    const cardW = (mainW - gap) / cols;
    const cardH = 0.78;
    metrics.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = mainX + col * (cardW + gap);
      const y = cursorY + row * (cardH + gap);
      addTheme06Card(slide, x, y, cardW, cardH, idx === 0);
      slide.addText(item.value ?? '', {
        x: x + 0.1, y: y + 0.1, w: cardW - 0.2, h: 0.32,
        fontSize: 20, color: idx === 0 ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.1, y: y + 0.44, w: cardW - 0.2, h: 0.2,
        fontSize: 9, color: idx === 0 ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  const highlights = (props.highlights || []).filter((h: any) => h != null).slice(0, 4);
  const asideX = 5.9;
  const asideW = 3.45;
  if (highlights.length > 0) {
    const blockH = 0.92;
    const gap = 0.1;
    highlights.forEach((item: any, idx: number) => {
      const y = 1.15 + idx * (blockH + gap);
      addTheme06Card(slide, asideX, y, asideW, blockH);
      slide.addText(item.title ?? '', {
        x: asideX + 0.12, y: y + 0.1, w: asideW - 0.24, h: 0.22,
        fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: asideX + 0.12, y: y + 0.34, w: asideW - 0.24, h: blockH - 0.46,
          fontSize: 10, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06IpoWatchV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const companies = (props.companies || []).filter((c: any) => c != null).slice(0, 8);
  const colsX = [0.75, 2.4, 4.2, 5.6, 7.3];
  const colsW = [1.5, 1.6, 1.2, 1.5, 1.5];
  const headers = ['公司', '交易所', '预期时间', '估值', '状态'];
  const startY = 2.2;
  const rowH = 0.44;

  // header
  headers.forEach((h, idx) => {
    slide.addText(h, {
      x: colsX[idx], y: startY, w: colsW[idx], h: rowH,
      fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
    });
  });

  companies.forEach((item: any, idx: number) => {
    const y = startY + 0.5 + idx * rowH;
    const values = [item.name, item.exchange, item.expectedDate, item.valuation, item.status];
    values.forEach((val: any, cidx: number) => {
      slide.addText(String(val ?? ''), {
        x: colsX[cidx], y, w: colsW[cidx], h: rowH,
        fontSize: 11, color: COLORS.primary, fontFace: FONTS.body,
      });
    });
  });

  if (props.conclusion) {
    const conclusionY = startY + 0.6 + companies.length * rowH + 0.1;
    if (conclusionY + 0.7 <= 5.1) {
      addTheme06Card(slide, 0.65, conclusionY, 8.7, 0.7, true);
      slide.addText(props.conclusion, {
        x: 0.8, y: conclusionY + 0.15, w: 8.4, h: 0.4,
        fontSize: 12, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06StatementV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.statement ?? '', {
    x: 0.65, y: 1.35, w: 8.7, h: 1.2,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.55, w: 8.7, h: 0.45,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const points = (props.points || []).filter((p: any) => p != null).slice(0, 4);
  if (points.length > 0) {
    const startY = 3.15;
    const rowH = 0.45;
    points.forEach((item: any, idx: number) => {
      const y = startY + idx * rowH;
      slide.addShape('ellipse', {
        x: 0.75, y: y + 0.12, w: 0.12, h: 0.12,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(item.text ?? '', {
        x: 1.0, y, w: 8.35, h: rowH,
        fontSize: 13, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
      });
    });
  }

  if (props.source) {
    slide.addText(`— ${props.source}`, {
      x: 0.65, y: 4.85, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06IndustryFinanceV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 6.5, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 6.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.industry) {
    addTheme06Badge(slide, 7.6, 1.25, 1.7, 0.36, props.industry);
  }

  const highlights = (props.highlights || []).filter((h: any) => h != null).slice(0, 4);
  if (highlights.length > 0) {
    const startY = 2.2;
    const cellW = (8.7 - 0.36) / 4;
    highlights.forEach((item: any, idx: number) => {
      const x = 0.65 + idx * (cellW + 0.12);
      addTheme06Card(slide, x, startY, cellW, 0.82, !!item.accent);
      slide.addText(item.value ?? '', {
        x: x + 0.1, y: startY + 0.1, w: cellW - 0.2, h: 0.32,
        fontSize: 20, color: item.accent ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.1, y: startY + 0.46, w: cellW - 0.2, h: 0.2,
        fontSize: 9, color: item.accent ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  const useCases = (props.useCases || []).filter((c: any) => c != null).slice(0, 4);
  if (useCases.length > 0) {
    const startY = 3.18;
    const cols = 2;
    const gap = 0.12;
    const cellW = (8.7 - gap) / cols;
    const cellH = 0.88;
    useCases.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.65 + col * (cellW + gap);
      const y = startY + row * (cellH + gap);
      addTheme06Card(slide, x, y, cellW, cellH);
      slide.addText(item.title ?? '', {
        x: x + 0.1, y: y + 0.1, w: cellW - 0.2, h: 0.22,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: x + 0.1, y: y + 0.34, w: cellW - 0.2, h: cellH - 0.46,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.insight) {
    const insightY = 5.12;
    addTheme06Card(slide, 0.65, insightY, 8.7, 0.62, true);
    slide.addText(props.insight, {
      x: 0.8, y: insightY + 0.12, w: 8.4, h: 0.38,
      fontSize: 11, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06IndustryGrowthV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const stages = (props.stages || []).filter((s: any) => s != null).slice(0, 4);
  const mainX = 0.65;
  const mainW = 5.0;
  const startY = 2.2;
  const stageH = stages.length > 0 ? (2.9 / stages.length) - 0.08 : 0;
  stages.forEach((item: any, idx: number) => {
    const y = startY + idx * (stageH + 0.08);
    addTheme06Card(slide, mainX, y, mainW, stageH);
    slide.addText(`${item.period || ''}  ${item.value || ''}`, {
      x: mainX + 0.12, y: y + 0.1, w: mainW - 0.24, h: 0.24,
      fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.body,
    });
    if (item.milestone) {
      slide.addText(item.milestone, {
        x: mainX + 0.12, y: y + 0.36, w: mainW - 0.24, h: stageH - 0.48,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const levers = (props.levers || []).filter((l: any) => l != null).slice(0, 4);
  const asideX = 5.9;
  const asideW = 3.45;
  if (levers.length > 0) {
    const leverH = 0.72;
    levers.forEach((item: any, idx: number) => {
      const y = startY + idx * (leverH + 0.1);
      addTheme06Card(slide, asideX, y, asideW, leverH);
      slide.addText(item.metric ?? '', {
        x: asideX + 0.1, y: y + 0.08, w: asideW - 0.2, h: 0.18,
        fontSize: 9, color: COLORS.accent, fontFace: FONTS.mono,
      });
      slide.addText(item.title ?? '', {
        x: asideX + 0.1, y: y + 0.26, w: asideW - 0.2, h: 0.2,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: asideX + 0.1, y: y + 0.46, w: asideW - 0.2, h: 0.22,
          fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.insight) {
    const insightY = startY + Math.max(stages.length, levers.length) * (0.72 + 0.1) + 0.1;
    if (insightY + 0.7 <= 5.1) {
      addTheme06Card(slide, asideX, insightY, asideW, 0.7, true);
      slide.addText(props.insight, {
        x: asideX + 0.12, y: insightY + 0.12, w: asideW - 0.24, h: 0.46,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06IndustrySafetyV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const risks = (props.risks || []).filter((r: any) => r != null).slice(0, 4);
  const mainX = 0.65;
  const mainW = 5.0;
  const startY = 2.2;
  const riskH = risks.length > 0 ? (2.6 / risks.length) - 0.08 : 0;
  risks.forEach((item: any, idx: number) => {
    const y = startY + idx * (riskH + 0.08);
    const level = String(item.level ?? '').toLowerCase();
    const accent = level.includes('high') || level.includes('高');
    addTheme06Card(slide, mainX, y, mainW, riskH, accent);
    slide.addText(`${item.category || ''} · ${item.level || ''}`, {
      x: mainX + 0.12, y: y + 0.1, w: mainW - 0.24, h: 0.24,
      fontSize: 12, color: accent ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.body,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: mainX + 0.12, y: y + 0.36, w: mainW - 0.24, h: riskH - 0.48,
        fontSize: 10, color: accent ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const controls = (props.controls || []).filter((c: any) => c != null).slice(0, 4);
  const asideX = 5.9;
  const asideW = 3.45;
  if (controls.length > 0) {
    const controlH = 0.62;
    controls.forEach((item: any, idx: number) => {
      const y = startY + idx * (controlH + 0.1);
      addTheme06Card(slide, asideX, y, asideW, controlH);
      slide.addText(item.title ?? '', {
        x: asideX + 0.12, y: y + 0.12, w: asideW - 0.24, h: 0.2,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      slide.addText(item.status ?? '', {
        x: asideX + 0.12, y: y + 0.32, w: asideW - 0.24, h: 0.18,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      });
    });
  }

  if (props.insight) {
    const insightY = startY + Math.max(risks.length, controls.length) * (0.62 + 0.1) + 0.1;
    if (insightY + 0.7 <= 5.1) {
      addTheme06Card(slide, asideX, insightY, asideW, 0.7, true);
      slide.addText(props.insight, {
        x: asideX + 0.12, y: insightY + 0.12, w: asideW - 0.24, h: 0.46,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06DealStructureV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 6.5, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 6.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const mainX = 0.65;
  const mainW = 5.0;
  const startY = 2.18;

  addTheme06Card(slide, mainX, startY, mainW, 1.15, true);
  if (props.dealName) {
    slide.addText(props.dealName, {
      x: mainX + 0.14, y: startY + 0.12, w: mainW - 0.28, h: 0.3,
      fontSize: 16, color: 'FFFFFF', bold: true, fontFace: FONTS.heading,
    });
  }
  const partyY = startY + 0.48;
  const partyText = [props.buyer ?? '', '→', props.target ?? ''].filter(Boolean).join('  ');
  slide.addText(partyText, {
    x: mainX + 0.14, y: partyY, w: mainW - 0.28, h: 0.24,
    fontSize: 11, color: 'FFFFFF', fontFace: FONTS.body,
  });
  if (props.value) {
    slide.addText(props.value, {
      x: mainX + 0.14, y: partyY + 0.28, w: mainW - 0.28, h: 0.36,
      fontSize: 28, color: 'FFFFFF', bold: true, fontFace: FONTS.heading,
    });
  }
  if (props.valuation) {
    slide.addText(props.valuation, {
      x: mainX + 0.14, y: partyY + 0.62, w: mainW - 0.28, h: 0.22,
      fontSize: 10, color: 'FFFFFF', fontFace: FONTS.mono,
    });
  }

  const structure = (props.structure || []).filter((s: any) => s != null).slice(0, 4);
  if (structure.length > 0) {
    const barY = startY + 1.32;
    const barH = 0.18;
    const accentColors = [COLORS.accent, COLORS.accent2 ?? COLORS.accent, COLORS.accentCool ?? COLORS.accent, COLORS.secondary ?? COLORS.accent];
    let currentX = mainX;
    const total = structure.reduce((sum: number, item: any) => sum + (Number(item.percentage) || 0), 0) || 1;
    structure.forEach((item: any, idx: number) => {
      const ratio = (Number(item.percentage) || 0) / total;
      const segW = ratio * mainW;
      if (segW > 0.02) {
        slide.addShape('rect', {
          x: currentX, y: barY, w: segW, h: barH,
          fill: { color: accentColors[idx % accentColors.length] },
        } as any);
      }
      currentX += segW;
    });

    const legendY = barY + 0.32;
    const itemW = mainW / structure.length;
    structure.forEach((item: any, idx: number) => {
      const x = mainX + idx * itemW;
      slide.addShape('ellipse', {
        x: x + 0.08, y: legendY + 0.04, w: 0.08, h: 0.08,
        fill: { color: accentColors[idx % accentColors.length] },
      } as any);
      slide.addText(`${item.label || ''}  ${item.percentage || 0}%`, {
        x: x + 0.2, y: legendY, w: itemW - 0.24, h: 0.18,
        fontSize: 9, color: COLORS.primary, fontFace: FONTS.body,
      });
    });
  }

  const asideX = 5.9;
  const asideW = 3.45;
  const parties = (props.parties || []).filter((p: any) => p != null).slice(0, 4);
  if (parties.length > 0) {
    const partyH = 0.54;
    parties.forEach((item: any, idx: number) => {
      const y = startY + idx * (partyH + 0.08);
      addTheme06Card(slide, asideX, y, asideW, partyH);
      slide.addText(item.role ?? '', {
        x: asideX + 0.1, y: y + 0.08, w: asideW - 0.2, h: 0.18,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
      });
      slide.addText(item.name ?? '', {
        x: asideX + 0.1, y: y + 0.26, w: asideW - 0.2, h: 0.2,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
    });
  }

  const highlights = (props.highlights || []).filter((h: any) => h != null).slice(0, 4);
  if (highlights.length > 0) {
    const highlightY = startY + Math.max(parties.length, 0) * 0.62 + 0.14;
    const cols = 2;
    const gap = 0.1;
    const cellW = (asideW - gap) / cols;
    const cellH = 0.56;
    highlights.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = asideX + col * (cellW + gap);
      const y = highlightY + row * (cellH + gap);
      addTheme06Card(slide, x, y, cellW, cellH, true);
      slide.addText(item.value ?? '', {
        x: x + 0.08, y: y + 0.08, w: cellW - 0.16, h: 0.22,
        fontSize: 14, color: 'FFFFFF', bold: true, fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.08, y: y + 0.3, w: cellW - 0.16, h: 0.18,
        fontSize: 9, color: 'FFFFFF', fontFace: FONTS.body,
      });
    });
  }

  if (props.insight) {
    const insightY = 4.35;
    addTheme06Card(slide, asideX, insightY, asideW, 0.68, true);
    slide.addText(props.insight, {
      x: asideX + 0.12, y: insightY + 0.1, w: asideW - 0.24, h: 0.48,
      fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06AllianceV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const partners = (props.partners || []).filter((p: any) => p != null).slice(0, 4);
  if (partners.length > 0) {
    const startY = 2.18;
    const gap = 0.12;
    const cellW = (8.7 - gap * (partners.length - 1)) / partners.length;
    const cellH = 1.18;
    partners.forEach((item: any, idx: number) => {
      const x = 0.65 + idx * (cellW + gap);
      addTheme06Card(slide, x, startY, cellW, cellH, idx === 0);
      slide.addText(item.name ?? '', {
        x: x + 0.1, y: startY + 0.1, w: cellW - 0.2, h: 0.24,
        fontSize: 14, color: idx === 0 ? 'FFFFFF' : COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      slide.addText(item.role ?? '', {
        x: x + 0.1, y: startY + 0.36, w: cellW - 0.2, h: 0.18,
        fontSize: 10, color: idx === 0 ? 'FFFFFF' : COLORS.accent, fontFace: FONTS.mono,
      });
      if (item.contribution) {
        slide.addText(item.contribution, {
          x: x + 0.1, y: startY + 0.56, w: cellW - 0.2, h: 0.54,
          fontSize: 10, color: idx === 0 ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  const lowerY = 3.52;
  const mainX = 0.65;
  const mainW = 5.0;
  const resources = (props.resources || []).filter((r: any) => r != null).slice(0, 4);
  if (resources.length > 0) {
    const cellH = 0.62;
    resources.forEach((item: any, idx: number) => {
      const y = lowerY + idx * (cellH + 0.08);
      addTheme06Card(slide, mainX, y, mainW, cellH);
      slide.addText(item.title ?? '', {
        x: mainX + 0.12, y: y + 0.1, w: mainW - 0.24, h: 0.2,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: mainX + 0.12, y: y + 0.32, w: mainW - 0.24, h: 0.24,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  const asideX = 5.9;
  const asideW = 3.45;
  const outcomes = (props.outcomes || []).filter((o: any) => o != null).slice(0, 4);
  if (outcomes.length > 0) {
    const cols = 2;
    const gap = 0.1;
    const cellW = (asideW - gap) / cols;
    const cellH = 0.62;
    outcomes.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = asideX + col * (cellW + gap);
      const y = lowerY + row * (cellH + gap);
      addTheme06Card(slide, x, y, cellW, cellH, true);
      slide.addText(item.value ?? '', {
        x: x + 0.08, y: y + 0.08, w: cellW - 0.16, h: 0.26,
        fontSize: 16, color: 'FFFFFF', bold: true, fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.08, y: y + 0.34, w: cellW - 0.16, h: 0.2,
        fontSize: 9, color: 'FFFFFF', fontFace: FONTS.body,
      });
    });
  }

  if (props.insight) {
    const insightY = lowerY + 2 * (0.62 + 0.1) + 0.08;
    if (insightY + 0.6 <= 5.1) {
      addTheme06Card(slide, asideX, insightY, asideW, 0.6, true);
      slide.addText(props.insight, {
        x: asideX + 0.12, y: insightY + 0.1, w: asideW - 0.24, h: 0.4,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06ComputeV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const layers = (props.layers || []).filter((l: any) => l != null).slice(0, 5);
  const mainX = 0.65;
  const mainW = 5.0;
  const startY = 2.18;
  if (layers.length > 0) {
    const layerH = (2.9 / layers.length) - 0.06;
    layers.forEach((item: any, idx: number) => {
      const y = startY + idx * (layerH + 0.06);
      addTheme06Card(slide, mainX, y, mainW, layerH, idx === 0);
      slide.addText(item.metric ?? '', {
        x: mainX + 0.12, y: y + 0.08, w: mainW - 0.24, h: 0.18,
        fontSize: 9, color: idx === 0 ? 'FFFFFF' : COLORS.accent, fontFace: FONTS.mono,
      });
      slide.addText(item.name ?? '', {
        x: mainX + 0.12, y: y + 0.26, w: mainW - 0.24, h: 0.24,
        fontSize: 13, color: idx === 0 ? 'FFFFFF' : COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: mainX + 0.12, y: y + 0.5, w: mainW - 0.24, h: layerH - 0.6,
          fontSize: 10, color: idx === 0 ? 'FFFFFF' : COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  const asideX = 5.9;
  const asideW = 3.45;
  const metrics = (props.metrics || []).filter((m: any) => m != null).slice(0, 4);
  if (metrics.length > 0) {
    const cols = 2;
    const gap = 0.1;
    const cellW = (asideW - gap) / cols;
    const cellH = 0.78;
    metrics.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = asideX + col * (cellW + gap);
      const y = startY + row * (cellH + gap);
      addTheme06Card(slide, x, y, cellW, cellH, !!item.accent);
      slide.addText(item.value ?? '', {
        x: x + 0.08, y: y + 0.1, w: cellW - 0.16, h: 0.34,
        fontSize: 18, color: item.accent ? 'FFFFFF' : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.08, y: y + 0.46, w: cellW - 0.16, h: 0.22,
        fontSize: 10, color: item.accent ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  if (props.insight) {
    const insightY = startY + 2 * (0.78 + 0.1) + 0.1;
    if (insightY + 0.68 <= 5.1) {
      addTheme06Card(slide, asideX, insightY, asideW, 0.68, true);
      slide.addText(props.insight, {
        x: asideX + 0.12, y: insightY + 0.1, w: asideW - 0.24, h: 0.48,
        fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  addTheme06GlowLine(slide);
}

export function renderTheme06MegadealsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.6,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const heroX = 0.65;
  const heroW = 3.0;
  const startY = 2.18;
  addTheme06Card(slide, heroX, startY, heroW, 1.35, true);
  if (props.heroValue) {
    slide.addText(props.heroValue, {
      x: heroX + 0.14, y: startY + 0.12, w: heroW - 0.28, h: 0.56,
      fontSize: 42, color: 'FFFFFF', bold: true, fontFace: FONTS.heading,
    });
  }
  if (props.heroLabel) {
    slide.addText(props.heroLabel, {
      x: heroX + 0.14, y: startY + 0.7, w: heroW - 0.28, h: 0.22,
      fontSize: 11, color: 'FFFFFF', fontFace: FONTS.body,
    });
  }
  if (props.insight) {
    addTheme06Card(slide, heroX, startY + 1.53, heroW, 1.2, false);
    slide.addText('关键洞察', {
      x: heroX + 0.14, y: startY + 1.63, w: heroW - 0.28, h: 0.2,
      fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
    });
    slide.addText(props.insight, {
      x: heroX + 0.14, y: startY + 1.85, w: heroW - 0.28, h: 0.76,
      fontSize: 11, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const dealsX = 3.85;
  const dealsW = 5.5;
  const deals = (props.deals || []).filter((d: any) => d != null).slice(0, 5);
  if (deals.length > 0) {
    const itemH = (2.9 / deals.length) - 0.06;
    deals.forEach((item: any, idx: number) => {
      const y = startY + idx * (itemH + 0.06);
      addTheme06Card(slide, dealsX, y, dealsW, itemH);
      slide.addText(item.company ?? '', {
        x: dealsX + 0.12, y: y + 0.08, w: 2.2, h: 0.24,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      slide.addText(item.buyer ?? '', {
        x: dealsX + 0.12, y: y + 0.32, w: 2.2, h: 0.18,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
      if (item.rationale) {
        slide.addText(item.rationale, {
          x: dealsX + 2.4, y: y + 0.08, w: 2.4, h: itemH - 0.16,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
      slide.addText(item.value ?? '', {
        x: dealsX + dealsW - 1.25, y: y + 0.08, w: 1.1, h: 0.24,
        fontSize: 12, color: COLORS.accent, bold: true, align: 'right', fontFace: FONTS.heading,
      });
      slide.addText(item.date ?? '', {
        x: dealsX + dealsW - 1.25, y: y + 0.32, w: 1.1, h: 0.18,
        fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
      });
    });
  }

  addTheme06GlowLine(slide);
}

type PptxRenderFn = (slide: PptxSlide, props: unknown) => void;

export function registerTheme06Renderers(registerPptxLayoutRenderer: (id: string, fn: PptxRenderFn) => void): void {
  registerPptxLayoutRenderer('theme06_cover_v1', renderTheme06CoverV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chapter_v1', renderTheme06ChapterV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_content_v1', renderTheme06ContentV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_content_numbered_v1', renderTheme06ContentNumberedV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_vertical_bar_v1', renderTheme06VerticalBarV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_metric_hero_v1', renderTheme06MetricHeroV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chart_v1', renderTheme06ChartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_quote_v1', renderTheme06QuoteV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_metric_grid_v1', renderTheme06MetricGridV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_rank_v1', renderTheme06RankV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_matrix_v1', renderTheme06MatrixV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chart_radar_v1', renderTheme06ChartRadarV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chart_waterfall_v1', renderTheme06ChartWaterfallV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chart_peak_v1', renderTheme06ChartPeakV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_process_v1', renderTheme06ProcessV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_timeline_v1', renderTheme06TimelineV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_case_v1', renderTheme06CaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_case_v2', renderTheme06CaseV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_risk_v1', renderTheme06RiskV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_risk_v2', renderTheme06RiskV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chart_graph_v1', renderTheme06ChartGraphV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_map_v1', renderTheme06MapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_table_of_contents_v1', renderTheme06TableOfContentsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_summary_v1', renderTheme06SummaryV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_closing_v1', renderTheme06ClosingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_sources_v1', renderTheme06SourcesV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chart_heatmap_v1', renderTheme06ChartHeatmapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_bento_v1', renderTheme06BentoV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_comparison_v1', renderTheme06ComparisonV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_sector_spotlight_v1', renderTheme06SectorSpotlightV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_tech_landscape_v1', renderTheme06TechLandscapeV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_company_profile_v1', renderTheme06CompanyProfileV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chain_flow_v1', renderTheme06ChainFlowV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_quarter_table_v1', renderTheme06QuarterTableV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_metric_showcase_v1', renderTheme06MetricShowcaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_milestone_v1', renderTheme06MilestoneV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_risk_matrix_v1', renderTheme06RiskMatrixV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_sector_comparison_v1', renderTheme06SectorComparisonV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_geo_distribution_v1', renderTheme06GeoDistributionV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_geo_heatmap_v1', renderTheme06GeoHeatmapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_ecosystem_graph_v1', renderTheme06EcosystemGraphV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_cover_product_v1', renderTheme06CoverProductV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_cover_business_v1', renderTheme06CoverBusinessV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chapter_numbered_v1', renderTheme06ChapterNumberedV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chapter_split_v1', renderTheme06ChapterSplitV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_trend_v1', renderTheme06TrendV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_cumulative_v1', renderTheme06CumulativeV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_quadrant_v1', renderTheme06QuadrantV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_outlook_v1', renderTheme06OutlookV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_recap_v1', renderTheme06RecapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_company_rounds_v1', renderTheme06CompanyRoundsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_company_investors_v1', renderTheme06CompanyInvestorsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_company_comparison_v1', renderTheme06CompanyComparisonV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_geo_cities_v1', renderTheme06GeoCitiesV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_agent_v1', renderTheme06AgentV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_search_v1', renderTheme06SearchV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_cover_manufacturing_v1', renderTheme06CoverManufacturingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_cover_brand_v1', renderTheme06CoverBrandV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_method_v1', renderTheme06MethodV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_quarter_q1_v1', renderTheme06QuarterQ1V1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_quarter_q2_v1', renderTheme06QuarterQ2V1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_quarter_q3_v1', renderTheme06QuarterQ3V1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_quarter_q4_v1', renderTheme06QuarterQ4V1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_big_number_v1', renderTheme06BigNumberV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chapter_focus_v1', renderTheme06ChapterFocusV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chapter_image_v1', renderTheme06ChapterImageV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_chapter_minimal_v1', renderTheme06ChapterMinimalV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_triad_v1', renderTheme06TriadV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_deal_map_v1', renderTheme06DealMapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_size_split_v1', renderTheme06SizeSplitV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_revenue_risk_v1', renderTheme06RevenueRiskV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_region_risk_v1', renderTheme06RegionRiskV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_open_risk_v1', renderTheme06OpenRiskV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_legal_v1', renderTheme06LegalV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_capital_flow_v1', renderTheme06CapitalFlowV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_avg_ticket_v1', renderTheme06AvgTicketV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_industry_vertical_v1', renderTheme06IndustryVerticalV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_industry_infrastructure_v1', renderTheme06IndustryInfrastructureV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_company_spotlight_v1', renderTheme06CompanySpotlightV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_ipo_watch_v1', renderTheme06IpoWatchV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_statement_v1', renderTheme06StatementV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_industry_finance_v1', renderTheme06IndustryFinanceV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_industry_growth_v1', renderTheme06IndustryGrowthV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_industry_safety_v1', renderTheme06IndustrySafetyV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_deal_structure_v1', renderTheme06DealStructureV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_alliance_v1', renderTheme06AllianceV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_compute_v1', renderTheme06ComputeV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme06_megadeals_v1', renderTheme06MegadealsV1 as PptxRenderFn);
}
