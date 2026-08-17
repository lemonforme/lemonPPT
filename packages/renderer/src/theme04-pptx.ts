// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme04 PPTX 版式专属渲染器（从 export-pptx.ts 抽出）。
// 共享基础设施（全局 helper + 通用渲染器 + 类型 + theme04 局部 helper/const）从 export-pptx.ts 导入；
// theme01 通用渲染器从 theme01-pptx.ts 复用；其他已抽出主题的渲染器从各自 theme<K>-pptx.ts 复用。
// 注册通过 registerTheme04Renderers 回调注入。

import { type Slide as PptxSlide } from 'pptxgenjs';
import { COLORS, FONTS, addImageMaybe, CHART_COLORS, totalForSegments, addTheme04Background, layoutTreemap, dataUriToTempFile } from './export-pptx.js';

export function renderTheme04Title(title: string): string {
  return title.replace(/\{\{([^}]+)\}\}/g, '$1');
}

function renderTheme04CoverV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.75, w: 8, h: 1.2,
    fontSize: 52, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.0, w: 7, h: 0.6,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 3);
  if (metrics.length > 0) {
    const cardW = 2.4;
    const startX = (10 - metrics.length * cardW - (metrics.length - 1) * 0.25) / 2;
    metrics.forEach((m: any, idx: number) => {
      const x = startX + idx * (cardW + 0.25);
      slide.addShape('roundRect', {
        x, y: 4.0, w: cardW, h: 1.1,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: 4.15, w: cardW, h: 0.45,
        fontSize: 28, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x, y: 4.62, w: cardW, h: 0.25,
        fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ChapterV1(slide: PptxSlide, props: any): void {
  slide.addShape('ellipse', {
    x: 7.2, y: 1.6, w: 2.2, h: 2.2,
    fill: { color: COLORS.accent, transparency: 85 },
  } as any);

  if (props.tag) {
    slide.addShape('roundRect', {
      x: 4.0, y: 0.9, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(props.tag, {
      x: 4.0, y: 0.9, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(props.number ?? '', {
    x: 1, y: 1.6, w: 8, h: 1.4,
    fontSize: 110, color: COLORS.accent, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 3.05, w: 8, h: 0.8,
    fontSize: 44, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.85, w: 7, h: 0.5,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
}

function renderTheme04ContentV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 4.2, h: 1.0,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.25, w: 4.2, h: 0.7,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const cardW = 4.1;
    const startX = 5.05;
    items.forEach((item: any, idx: number) => {
      const y = 0.85 + idx * 0.78;
      slide.addShape('roundRect', {
        x: startX, y, w: cardW, h: 0.68,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      slide.addText(item.title ?? '', {
        x: startX + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.22,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: startX + 0.12, y: y + 0.34, w: cardW - 0.24, h: 0.26,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }
}

function renderTheme04MetricV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  slide.addText(props.value ?? '', {
    x: 0.65, y: 2.45, w: 4.0, h: 1.0,
    fontSize: 80, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: 3.2, y: 2.95, w: 1.5, h: 0.35,
      fontSize: 22, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.label) {
    slide.addText(props.label, {
      x: 0.65, y: 3.5, w: 4.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 4);
  if (metrics.length > 0) {
    const cardW = 2.05;
    const gap = 0.18;
    const startX = 0.65;
    metrics.forEach((m: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      slide.addShape('roundRect', {
        x, y: 4.05, w: cardW, h: 1.1,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: 4.2, w: cardW, h: 0.45,
        fontSize: 26, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x, y: 4.68, w: cardW, h: 0.25,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }
}

function renderTheme04ChartV1(slide: PptxSlide, props: any): void {
  const tagText = [props.kicker, props.topRightMeta].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.2, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.2, h: 0.32,
      fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
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
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const chartW = hasInsight ? 5.6 : 8.7;

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

  if (hasInsight) {
    const insight = props.insight;
    slide.addShape('roundRect', {
      x: 6.45, y: 2.25, w: 2.9, h: 3.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    let cursorY = 2.45;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.55,
        fontSize: 32, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.58;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.65, y: cursorY, w: 2.5, h: 0.25,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
      cursorY += 0.32;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: 6.65, y: cursorY, w: 2.5, h: 2.2 - cursorY + 2.25,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  }
}

function renderTheme04QuoteV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }

  slide.addText('“', {
    x: 0.65, y: 1.25, w: 1.0, h: 0.7,
    fontSize: 80, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(renderTheme04Title(props.quote ?? ''), {
    x: 0.65, y: 2.0, w: 4.6, h: 1.6,
    fontSize: 30, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });

  if (props.image) {
    addImageMaybe(slide, props.image, 5.4, 1.0, 3.95, 3.6);
  } else {
    slide.addShape('roundRect', {
      x: 5.4, y: 1.0, w: 3.95, h: 3.6,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
  }

  const attrParts = [props.author, props.role].filter(Boolean).join(' / ');
  if (attrParts) {
    slide.addText(attrParts, {
      x: 0.65, y: 3.75, w: 4.6, h: 0.25,
      fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
}

function renderTheme04ImageV1(slide: PptxSlide, props: any): void {
  if (props.image) {
    addImageMaybe(slide, props.image, 0.65, 0.65, 5.4, 4.45);
  } else {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.65, w: 5.4, h: 4.45,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
  }

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 6.35, y: 0.78, w: 3.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 6.35, y: 1.2, w: 3.0, h: 1.0,
    fontSize: 30, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 6.35, y: 2.25, w: 3.0, h: 0.9,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.caption) {
    slide.addText(props.caption, {
      x: 6.35, y: 3.4, w: 3.0, h: 0.4,
      fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
}

function renderTheme04ClosingV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addShape('roundRect', {
      x: 4.0, y: 0.9, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(props.tag, {
      x: 4.0, y: 0.9, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.7, w: 8, h: 1.0,
    fontSize: 48, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 2.75, w: 7, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.cta) {
    slide.addShape('roundRect', {
      x: 3.8, y: 3.65, w: 2.4, h: 0.42,
      fill: { color: COLORS.accent }, rectRadius: 0.21,
    } as any);
    slide.addText(props.cta, {
      x: 3.8, y: 3.65, w: 2.4, h: 0.42,
      fontSize: 13, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
  }
  if (props.contact) {
    slide.addText(props.contact, {
      x: 1, y: 4.45, w: 8, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04TableOfContentsV1(slide: PptxSlide, props: any): void {
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 4.2, h: 1.0,
    fontSize: 42, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });

  const items = (props.items || []).slice(0, 8);
  if (items.length > 0) {
    const cardW = 4.1;
    const startX = 5.05;
    items.forEach((item: any, idx: number) => {
      const y = 0.85 + idx * 0.58;
      slide.addShape('roundRect', {
        x: startX, y, w: cardW, h: 0.5,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: startX + 0.12, y: y + 0.08, w: 0.5, h: 0.34,
        fontSize: 16, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(item.title ?? '', {
        x: startX + 0.7, y: y + 0.08, w: cardW - 1.2, h: 0.34,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.page) {
        slide.addText(String(item.page), {
          x: startX + cardW - 0.5, y: y + 0.1, w: 0.4, h: 0.3,
          fontSize: 11, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
        });
      }
    });
  }
}

function renderTheme04FeatureV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
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
    const cols = Math.min(items.length, 3);
    const gap = 0.2;
    const cardW = (8.7 - gap * (cols - 1)) / cols;
    const startY = 2.35;
    const cardH = items.length > 3 ? 1.25 : 2.2;
    const toneColors: Record<string, string> = {
      green: COLORS.accent,
      pink: COLORS.secondary || 'FF6B9D',
      blue: CHART_COLORS[2] || '4ECDC4',
      yellow: CHART_COLORS[3] || 'FFD166',
    };

    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.65 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      const color = toneColors[item.tone ?? 'green'] || COLORS.accent;

      slide.addShape('roundRect', {
        x, y, w: cardW, h: cardH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);
      slide.addShape('roundRect', {
        x: x + 0.12, y: y + 0.12, w: 0.32, h: 0.18,
        fill: { color }, rectRadius: 0.09,
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.12, y: y + 0.1, w: 0.32, h: 0.22,
        fontSize: 10, color: COLORS.white, bold: true, align: 'center', fontFace: FONTS.mono,
      });
      slide.addText(item.title ?? '', {
        x: x + 0.12, y: y + 0.42, w: cardW - 0.24, h: 0.32,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: x + 0.12, y: y + 0.78, w: cardW - 0.24, h: cardH - 0.92,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }
}

function renderTheme04BentoV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
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
    const startY = 2.35;
    const cardH = items.length <= 4 ? 1.35 : 0.95;
    const gap = 0.18;

    if (items.length <= 2) {
      const cardW = (8.7 - gap) / 2;
      items.forEach((item: any, idx: number) => {
        const x = 0.65 + idx * (cardW + gap);
        renderTheme04BentoCard(slide, item, x, startY, cardW, cardH + 0.5);
      });
    } else if (items.length === 3) {
      renderTheme04BentoCard(slide, items[0], 0.65, startY, 4.25, 2.2 + 0.5);
      renderTheme04BentoCard(slide, items[1], 5.08, startY, 4.25, 1.05 + 0.25);
      renderTheme04BentoCard(slide, items[2], 5.08, startY + 1.35, 4.25, 1.05 + 0.25);
    } else if (items.length === 4) {
      const cardW = (8.7 - gap) / 2;
      items.forEach((item: any, idx: number) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 0.65 + col * (cardW + gap);
        const y = startY + row * (cardH + gap);
        renderTheme04BentoCard(slide, item, x, y, cardW, cardH);
      });
    } else {
      const cols = 3;
      const cardW = (8.7 - gap * (cols - 1)) / cols;
      items.forEach((item: any, idx: number) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = 0.65 + col * (cardW + gap);
        const y = startY + row * (cardH + gap);
        renderTheme04BentoCard(slide, item, x, y, cardW, cardH);
      });
    }
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04BentoCard(slide: PptxSlide, item: any, x: number, y: number, w: number, h: number): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);
  slide.addText(`${item.value ?? ''}${item.unit ?? ''}`, {
    x: x + 0.14, y: y + 0.16, w: w - 0.28, h: 0.55,
    fontSize: 32, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
  });
  slide.addText(item.label ?? '', {
    x: x + 0.14, y: y + 0.72, w: w - 0.28, h: 0.25,
    fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
  });
}

function renderTheme04TeamV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const members = (props.members || []).slice(0, 6);
  if (members.length > 0) {
    const cols = members.length <= 4 ? members.length : 4;
    const rows = members.length <= 4 ? 1 : 2;
    const gap = 0.18;
    const cardW = (8.7 - gap * (cols - 1)) / cols;
    const startY = 2.35;
    const cardH = rows === 1 ? 2.55 : 1.15;

    members.forEach((member: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.65 + col * (cardW + gap);
      const y = startY + row * (cardH + gap);
      renderTheme04TeamCard(slide, member, x, y, cardW, cardH);
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04TeamCard(slide: PptxSlide, member: any, x: number, y: number, w: number, h: number): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);

  const avatarSize = 0.8;
  const avatarX = x + (w - avatarSize) / 2;
  const avatarY = y + 0.22;
  if (member.image) {
    addImageMaybe(slide, member.image, avatarX, avatarY, avatarSize, avatarSize);
  } else {
    slide.addShape('ellipse', {
      x: avatarX, y: avatarY, w: avatarSize, h: avatarSize,
      fill: { color: COLORS.border },
    } as any);
  }

  slide.addText(member.name ?? '', {
    x, y: avatarY + avatarSize + 0.14, w, h: 0.28,
    fontSize: 14, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
  });
  slide.addText(member.role ?? '', {
    x, y: avatarY + avatarSize + 0.42, w, h: 0.22,
    fontSize: 10, color: COLORS.accent, align: 'center', fontFace: FONTS.mono,
  });
  if (member.bio) {
    slide.addText(member.bio, {
      x: x + 0.1, y: avatarY + avatarSize + 0.68, w: w - 0.2, h: 0.5,
      fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
}

function renderTheme04ChartDonut(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const segments = (props.segments || []).slice(0, 8).filter((s: any) => s && (s.label || s.value));
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const chartW = hasInsight ? 5.0 : 8.0;
  const chartX = 0.65;
  const chartY = 2.3;

  if (segments.length > 0) {
    const total = segments.reduce((sum: number, s: any) => sum + (Number(String(s.value || '0').replace(/,/g, '')) || 0), 0);
    const data = segments.map((s: any) => ({
      name: s.label || '',
      labels: [s.label || ''],
      values: [Number(String(s.value || '0').replace(/,/g, '')) || 0],
    }));

    slide.addChart('pie', data, {
      x: chartX, y: chartY, w: chartW, h: 3.0,
      chartColors: CHART_COLORS.slice(0, segments.length),
      holeSize: 55,
      showValue: false,
      showLegend: false,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 10,
    } as any);

    const centerText = props.total?.value ?? (total > 0 ? String(total) : '');
    const centerLabel = props.total?.label ?? '合计';
    if (centerText) {
      slide.addText(centerText, {
        x: chartX, y: chartY + 1.15, w: chartW, h: 0.5,
        fontSize: 28, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(centerLabel, {
        x: chartX, y: chartY + 1.6, w: chartW, h: 0.25,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
      });
    }
  } else {
    slide.addText('（暂无图表数据）', {
      x: chartX, y: chartY + 1.2, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const legendX = chartX + chartW + 0.25;
  const legendW = hasInsight ? 2.9 : 3.0;
  if (segments.length > 0) {
    segments.slice(0, 5).forEach((s: any, idx: number) => {
      const y = chartY + idx * 0.48;
      const color = CHART_COLORS[idx % CHART_COLORS.length];
      slide.addShape('ellipse', {
        x: legendX, y: y + 0.1, w: 0.16, h: 0.16,
        fill: { color },
      } as any);
      slide.addText(s.label || '', {
        x: legendX + 0.24, y, w: legendW - 0.24, h: 0.22,
        fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      const pct = totalForSegments(segments, s);
      slide.addText(`${pct}%`, {
        x: legendX + 0.24, y: y + 0.22, w: legendW - 0.24, h: 0.18,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  if (hasInsight) {
    const insight = props.insight;
    const insightY = chartY + 2.6;
    slide.addShape('roundRect', {
      x: legendX, y: insightY, w: legendW, h: 1.3,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    } as any);
    let cursorY = insightY + 0.14;
    if (insight.value) {
      slide.addText(insight.value, {
        x: legendX + 0.12, y: cursorY, w: legendW - 0.24, h: 0.4,
        fontSize: 24, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.42;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: legendX + 0.12, y: cursorY, w: legendW - 0.24, h: 0.2,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body,
      });
      cursorY += 0.22;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: legendX + 0.12, y: cursorY, w: legendW - 0.24, h: 1.3 - cursorY + insightY - 0.1,
        fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04MetricBig(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const heroW = hasInsight ? 5.8 : 8.7;

  slide.addText(`${props.value ?? ''}${props.unit ?? ''}${props.suffix ?? ''}`, {
    x: 0.65, y: 1.6, w: heroW, h: 1.0,
    fontSize: 68, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.label) {
    slide.addText(props.label, {
      x: 0.65, y: 2.55, w: heroW, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.65, y: 2.9, w: heroW - 0.5, h: 0.8,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  if (hasInsight) {
    const insight = props.insight;
    const ix = 6.65;
    const iw = 2.7;
    slide.addShape('roundRect', {
      x: ix, y: 1.6, w: iw, h: 2.1,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    let cursorY = 1.78;
    if (insight.label) {
      slide.addText(insight.label, {
        x: ix + 0.14, y: cursorY, w: iw - 0.28, h: 0.2,
        fontSize: 10, color: COLORS.accent, fontFace: FONTS.mono,
      });
      cursorY += 0.24;
    }
    if (insight.value) {
      slide.addText(insight.value, {
        x: ix + 0.14, y: cursorY, w: iw - 0.28, h: 0.5,
        fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.52;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: ix + 0.14, y: cursorY, w: iw - 0.28, h: 2.1 - cursorY + 1.6 - 0.2,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  }

  const metrics = (props.metrics || []).slice(0, 3);
  if (metrics.length > 0) {
    const gap = 0.18;
    const cardW = (8.7 - gap * (metrics.length - 1)) / metrics.length;
    const y = 4.05;
    metrics.forEach((m: any, idx: number) => {
      const x = 0.65 + idx * (cardW + gap);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: 1.05,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: y + 0.18, w: cardW, h: 0.42,
        fontSize: 26, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x, y: y + 0.62, w: cardW, h: 0.25,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ProcessV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps || []).slice(0, 6);
  if (steps.length > 0) {
    const gap = 0.14;
    const cardW = (8.7 - gap * (steps.length - 1)) / steps.length;
    const y = 2.6;
    const h = 2.2;

    steps.forEach((step: any, idx: number) => {
      const x = 0.65 + idx * (cardW + gap);
      slide.addShape('roundRect', {
        x, y, w: cardW, h,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);

      slide.addShape('ellipse', {
        x: x + 0.14, y: y + 0.16, w: 0.34, h: 0.34,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.14, y: y + 0.16, w: 0.34, h: 0.34,
        fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
        fontFace: FONTS.mono,
      });

      slide.addText(step.title ?? '', {
        x: x + 0.14, y: y + 0.6, w: cardW - 0.28, h: 0.5,
        fontSize: 14, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (step.description) {
        slide.addText(step.description, {
          x: x + 0.14, y: y + 1.1, w: cardW - 0.28, h: 0.9,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }

      if (idx < steps.length - 1) {
        const arrowX = x + cardW + gap / 2 - 0.1;
        slide.addShape('triangle', {
          x: arrowX, y: y + h / 2 - 0.12, w: 0.2, h: 0.24,
          fill: { color: COLORS.accent },
        } as any);
      }
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04GalleryV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.2, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const images = (props.images || []).slice(0, 4);
  if (images.length > 0) {
    const startY = 2.35;
    const areaH = 2.8;
    const gap = 0.16;

    if (images.length === 1) {
      addImageMaybe(slide, images[0].url, 0.65, startY, 8.7, areaH);
      if (images[0].caption) {
        slide.addText(images[0].caption, {
          x: 0.65, y: startY + areaH - 0.4, w: 8.7, h: 0.3,
          fontSize: 11, color: COLORS.primary, align: 'center', valign: 'middle', fontFace: FONTS.body,
        });
      }
    } else if (images.length === 2) {
      const w = (8.7 - gap) / 2;
      images.forEach((img: any, idx: number) => {
        addImageMaybe(slide, img.url, 0.65 + idx * (w + gap), startY, w, areaH);
      });
    } else if (images.length === 3) {
      const w = (8.7 - gap) / 2;
      addImageMaybe(slide, images[0].url, 0.65, startY, w, areaH);
      addImageMaybe(slide, images[1].url, 0.65 + w + gap, startY, w, (areaH - gap) / 2);
      addImageMaybe(slide, images[2].url, 0.65 + w + gap, startY + (areaH + gap) / 2, w, (areaH - gap) / 2);
    } else {
      const w = (8.7 - gap) / 2;
      const h = (areaH - gap) / 2;
      images.forEach((img: any, idx: number) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        addImageMaybe(slide, img.url, 0.65 + col * (w + gap), startY + row * (h + gap), w, h);
      });
    }
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04StatsV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.7,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.7, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const stats = (props.stats ?? []).slice(0, 3);
  const cardW = 2.7;
  const gap = 0.3;
  const startX = 0.65;
  const startY = 2.2;
  stats.forEach((stat: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    slide.addShape('roundRect', {
      x, y: startY, w: cardW, h: 2.6,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + 0.15, y: startY + 0.15, w: 0.6, h: 0.3,
      fontSize: 14, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(stat.label?.split('·')[0]?.trim() ?? '', {
      x: x + 0.8, y: startY + 0.18, w: 1.7, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
    });
    const valueText = `${stat.value ?? ''}${stat.unit ?? ''}`;
    slide.addText(valueText, {
      x: x + 0.15, y: startY + 0.7, w: 2.4, h: 0.7,
      fontSize: 52, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    slide.addText(stat.label ?? '', {
      x: x + 0.15, y: startY + 1.45, w: 2.4, h: 0.4,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
    if (stat.badge) {
      slide.addText(stat.badge, {
        x: x + 0.15, y: startY + 1.95, w: 1.6, h: 0.3,
        fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
      slide.addShape('roundRect', {
        x: x + 0.12, y: startY + 1.92, w: 1.66, h: 0.34,
        fill: { color: COLORS.accent }, rectRadius: 0.17,
      } as any);
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ComparisonV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const sides = (props.sides ?? []).slice(0, 2);
  const cardW = 4.15;
  const gap = 0.4;
  sides.forEach((side: any, idx: number) => {
    const x = 0.65 + idx * (cardW + gap);
    const toneColor = idx === 0 ? COLORS.accent : COLORS.secondary;
    slide.addShape('roundRect', {
      x, y: 2.05, w: cardW, h: 3.15,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    slide.addShape('ellipse', {
      x: x + 0.2, y: 2.3, w: 0.42, h: 0.42,
      fill: { color: toneColor },
    });
    slide.addText(side.icon === 'cross' ? '×' : '✓', {
      x: x + 0.2, y: 2.32, w: 0.42, h: 0.4,
      fontSize: 18, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText(side.label ?? '', {
      x: x + 0.75, y: 2.25, w: cardW - 1.0, h: 0.25,
      fontSize: 15, color: toneColor, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(side.title ?? '', {
      x: x + 0.75, y: 2.5, w: cardW - 1.0, h: 0.3,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });

    (side.items ?? []).slice(0, 5).forEach((item: any, itemIdx: number) => {
      const y = 2.95 + itemIdx * 0.42;
      slide.addShape('ellipse', {
        x: x + 0.28, y: y + 0.1, w: 0.08, h: 0.08,
        fill: { color: toneColor },
      });
      slide.addText(item.title ?? '', {
        x: x + 0.5, y, w: cardW - 0.7, h: 0.2,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: x + 0.5, y: y + 0.2, w: cardW - 0.7, h: 0.18,
          fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  });
}

function renderTheme04TableV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const cols = (props.columns ?? ['融资轮次', '事件笔数', '平均单笔', '规模对比']).slice(0, 4);
  const rows = (props.rows ?? []).slice(0, 8);
  const maxRatio = Math.max(1, ...rows.map((r: any) => Number(r.ratio) || 0));
  const startY = 2.0;
  const rowH = 0.35;
  const tableW = 8.7;

  slide.addShape('roundRect', {
    x: 0.65, y: startY, w: tableW, h: 0.35 + rows.length * rowH + (props.summary ? rowH : 0),
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.1,
  } as any);

  const colX = [0.75, 2.4, 4.1, 5.7];
  const colW = [1.5, 1.5, 1.4, 2.85];
  cols.forEach((col: string, idx: number) => {
    slide.addText(col, {
      x: colX[idx], y: startY + 0.05, w: colW[idx], h: 0.25,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });
  });

  rows.forEach((row: any, idx: number) => {
    const y = startY + 0.35 + idx * rowH;
    slide.addText(row.name ?? '', {
      x: colX[0], y: y + 0.05, w: colW[0], h: 0.25,
      fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.body,
    });
    slide.addText(row.count ?? '', {
      x: colX[1], y: y + 0.05, w: colW[1], h: 0.25,
      fontSize: 11, color: COLORS.primary, align: 'right', fontFace: FONTS.body,
    });
    slide.addText(row.avg ?? '', {
      x: colX[2], y: y + 0.05, w: colW[2], h: 0.25,
      fontSize: 11, color: COLORS.primary, align: 'right', fontFace: FONTS.body,
    });
    const barW = ((Number(row.ratio) || 0) / maxRatio) * (colW[3] - 0.2);
    if (barW > 0) {
      slide.addShape('roundRect', {
        x: colX[3], y: y + 0.12, w: barW, h: 0.1,
        fill: { color: COLORS.accent }, rectRadius: 0.05,
      } as any);
    }
  });

  if (props.summary) {
    const y = startY + 0.35 + rows.length * rowH;
    slide.addText(props.summary.label ?? '', {
      x: colX[0], y: y + 0.05, w: colW[0], h: 0.25,
      fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(props.summary.count ?? '', {
      x: colX[1], y: y + 0.05, w: colW[1], h: 0.25,
      fontSize: 12, color: COLORS.accent, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    slide.addText(props.summary.avg ?? '', {
      x: colX[2], y: y + 0.05, w: colW[2], h: 0.25,
      fontSize: 12, color: COLORS.accent, bold: true, align: 'right', fontFace: FONTS.heading,
    });
  }
}

function renderTheme04TimelineV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const phases = (props.phases ?? []).slice(0, 3);
  const cardW = 2.7;
  const gap = 0.3;
  const startX = 0.65;
  const trackY = 2.2;
  const cardY = 3.0;

  slide.addShape('line', {
    x1: startX + 0.3, y1: trackY, x2: startX + phases.length * (cardW + gap) - gap - 0.3, y2: trackY,
    line: { color: COLORS.border, width: 2 },
  } as any);

  phases.forEach((phase: any, idx: number) => {
    const cx = startX + idx * (cardW + gap) + cardW / 2;
    slide.addShape('ellipse', {
      x: cx - 0.18, y: trackY - 0.18, w: 0.36, h: 0.36,
      fill: { color: COLORS.accent },
      line: { color: COLORS.surface, width: 3 },
    });
    slide.addText(String(idx + 1), {
      x: cx - 0.18, y: trackY - 0.16, w: 0.36, h: 0.36,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
    slide.addText(phase.period ?? '', {
      x: startX + idx * (cardW + gap), y: trackY + 0.3, w: cardW, h: 0.2,
      fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });

    const x = startX + idx * (cardW + gap);
    slide.addShape('roundRect', {
      x, y: cardY, w: cardW, h: 1.9,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + cardW - 0.55, y: cardY + 0.1, w: 0.5, h: 0.4,
      fontSize: 22, color: COLORS.border, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    if (phase.badge) {
      slide.addShape('roundRect', {
        x: x + 0.12, y: cardY + 0.12, w: 1.0, h: 0.24,
        fill: { color: COLORS.accent }, rectRadius: 0.12,
      } as any);
      slide.addText(phase.badge, {
        x: x + 0.12, y: cardY + 0.12, w: 1.0, h: 0.24,
        fontSize: 9, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    }
    slide.addText(phase.title ?? '', {
      x: x + 0.12, y: cardY + 0.5, w: cardW - 0.24, h: 0.3,
      fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    if (phase.description) {
      slide.addText(phase.description, {
        x: x + 0.12, y: cardY + 0.85, w: cardW - 0.24, h: 0.85,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme04RoadmapV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps ?? []).slice(0, 3);
  const cardW = 2.7;
  const gap = 0.3;
  const startX = 0.65;
  const baseY = 2.2;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };

  steps.forEach((step: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const y = baseY + idx * 0.22;
    const color = toneColors[step.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y, w: cardW, h: 2.55,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(step.period ?? '', {
      x: x + 0.12, y: y + 0.12, w: 1.4, h: 0.2,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
    });
    slide.addText(String(idx + 1), {
      x: x + cardW - 0.45, y: y + 0.08, w: 0.35, h: 0.35,
      fontSize: 18, color, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    slide.addText(step.title ?? '', {
      x: x + 0.12, y: y + 0.5, w: cardW - 0.24, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    if (step.subtitle) {
      slide.addText(step.subtitle, {
        x: x + 0.12, y: y + 0.88, w: cardW - 0.24, h: 0.25,
        fontSize: 12, color, bold: true, fontFace: FONTS.body,
      });
    }
    if (step.description) {
      slide.addText(step.description, {
        x: x + 0.12, y: y + 1.2, w: cardW - 0.24, h: 0.95,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04RankingV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items ?? []).slice(0, 8);
  const maxScore = Math.max(1, ...items.map((i: any) => Number(i.score) || 0));
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const rowH = 0.46;
  const startY = 2.05;

  items.forEach((item: any, idx: number) => {
    const y = startY + idx * rowH;
    const color = toneColors[item.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x: 0.65, y: y + 0.06, w: 0.36, h: 0.36,
      fill: { color }, rectRadius: 0.18,
    } as any);
    slide.addText(String(item.rank ?? idx + 1), {
      x: 0.65, y: y + 0.08, w: 0.36, h: 0.34,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
    slide.addText(item.name ?? '', {
      x: 1.15, y: y + 0.05, w: 2.4, h: 0.22,
      fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body,
    });
    if (item.category) {
      slide.addText(item.category, {
        x: 1.15, y: y + 0.27, w: 2.4, h: 0.18,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body,
      });
    }
    slide.addShape('roundRect', {
      x: 3.7, y: y + 0.18, w: 3.6, h: 0.12,
      fill: { color: COLORS.border }, rectRadius: 0.06,
    } as any);
    const barW = ((Number(item.score) || 0) / maxScore) * 3.6;
    if (barW > 0) {
      slide.addShape('roundRect', {
        x: 3.7, y: y + 0.18, w: barW, h: 0.12,
        fill: { color }, rectRadius: 0.06,
      } as any);
    }
    slide.addText(`${item.value ?? ''}${props.unit ?? ''}`, {
      x: 7.45, y: y + 0.05, w: 1.9, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.heading,
    });
  });
}

function renderTheme04CaseV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 4.5, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 4.2, h: 0.55,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 4.2, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.badge) {
    slide.addShape('roundRect', {
      x: 0.65, y: 1.95, w: 2.2, h: 0.28,
      fill: { color: COLORS.accent }, rectRadius: 0.14,
    } as any);
    slide.addText(props.badge, {
      x: 0.65, y: 1.95, w: 2.2, h: 0.28,
      fontSize: 9, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }
  addImageMaybe(slide, props.imageUrl, 0.65, 2.35, 4.2, 1.4);
  if (props.quote) {
    slide.addText(props.quote, {
      x: 0.65, y: 3.85, w: 4.2, h: 0.85,
      fontSize: 11, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.author) {
    slide.addText(props.author, {
      x: 0.65, y: 4.75, w: 4.2, h: 0.2,
      fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const milestones = (props.milestones ?? []).slice(0, 5);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  if (milestones.length > 0) {
    const lineH = milestones.length * 0.85;
    slide.addShape('line', {
      x1: 5.55, y1: 1.0, x2: 5.55, y2: 1.0 + lineH,
      line: { color: COLORS.border, width: 2 },
    } as any);
    milestones.forEach((m: any, idx: number) => {
      const y = 1.0 + idx * 0.85;
      const color = toneColors[m.tone ?? 'green'] || COLORS.accent;
      slide.addShape('ellipse', {
        x: 5.42, y, w: 0.26, h: 0.26,
        fill: { color },
      } as any);
      slide.addText(m.date ?? '', {
        x: 5.85, y: y - 0.02, w: 3.5, h: 0.2,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      });
      slide.addText(m.title ?? '', {
        x: 5.85, y: y + 0.2, w: 3.5, h: 0.25,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      if (m.subtitle) {
        slide.addText(m.subtitle, {
          x: 5.85, y: y + 0.45, w: 3.5, h: 0.2,
          fontSize: 10, color, bold: true, fontFace: FONTS.body,
        });
      }
      if (m.description) {
        slide.addText(m.description, {
          x: 5.85, y: y + 0.65, w: 3.5, h: 0.2,
          fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }
}

function renderTheme04QuadrantV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const quadrants = (props.quadrants ?? []).slice(0, 4);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const gridX = 1.2;
  const gridY = 2.05;
  const gridW = 7.6;
  const gridH = 3.25;
  const cardW = (gridW - 0.2) / 2;
  const cardH = (gridH - 0.2) / 2;

  slide.addShape('line', {
    x1: gridX + gridW / 2, y1: gridY, x2: gridX + gridW / 2, y2: gridY + gridH,
    line: { color: COLORS.border, width: 1, dash: 'dash' },
  } as any);
  slide.addShape('line', {
    x1: gridX, y1: gridY + gridH / 2, x2: gridX + gridW, y2: gridY + gridH / 2,
    line: { color: COLORS.border, width: 1, dash: 'dash' },
  } as any);

  slide.addText(props.yAxisLabel ?? '资本热度', {
    x: 0.45, y: gridY + gridH / 2 - 0.3, w: 0.6, h: 0.6,
    fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.mono,
  });
  const yLabels = (props.yAxisLabels ?? ['低', '高']) as string[];
  const xLabels = (props.xAxisLabels ?? ['低 / 待验证', '高']) as string[];
  slide.addText(yLabels[1] ?? '', {
    x: gridX - 0.4, y: gridY - 0.2, w: 0.6, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(yLabels[0] ?? '', {
    x: gridX - 0.4, y: gridY + gridH - 0.2, w: 0.6, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(props.xAxisLabel ?? '商业兑现度', {
    x: gridX + gridW / 2 - 0.6, y: gridY + gridH + 0.1, w: 1.2, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
  });
  slide.addText(xLabels[0] ?? '', {
    x: gridX, y: gridY + gridH + 0.1, w: 0.6, h: 0.2,
    fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body,
  });
  slide.addText(xLabels[1] ?? '', {
    x: gridX + gridW - 0.6, y: gridY + gridH + 0.1, w: 0.6, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.body,
  });

  quadrants.forEach((q: any, idx: number) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = gridX + col * (cardW + 0.2);
    const y = gridY + row * (cardH + 0.2);
    const color = toneColors[q.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addShape('ellipse', {
      x: x + 0.12, y: y + 0.12, w: 0.16, h: 0.16,
      fill: { color },
    } as any);
    slide.addText(q.title ?? '', {
      x: x + 0.35, y: y + 0.08, w: cardW - 0.8, h: 0.3,
      fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + cardW - 0.5, y: y + 0.08, w: 0.4, h: 0.3,
      fontSize: 14, color: COLORS.border, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    if (q.description) {
      slide.addText(q.description, {
        x: x + 0.12, y: y + 0.42, w: cardW - 0.24, h: cardH - 0.9,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
    (q.tags ?? []).slice(0, 5).forEach((tag: string, tidx: number) => {
      const tx = x + 0.12 + tidx * 0.95;
      const ty = y + cardH - 0.35;
      slide.addShape('roundRect', {
        x: tx, y: ty, w: 0.9, h: 0.22,
        fill: { color: COLORS.surface },
        line: { color },
        rectRadius: 0.11,
      } as any);
      slide.addText(tag, {
        x: tx, y: ty, w: 0.9, h: 0.22,
        fontSize: 8, color, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    });
  });
}

function renderTheme04AgendaV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.6,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items ?? []).slice(0, 4);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const cardW = 2.05;
  const gap = 0.2;
  const startX = 0.65;
  const startY = 2.35;

  items.forEach((item: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const color = toneColors[item.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y: startY, w: cardW, h: 2.45,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(item.part ?? '', {
      x, y: startY + 0.12, w: cardW, h: 0.2,
      fontSize: 10, color, bold: true, align: 'center', fontFace: FONTS.mono,
    });
    slide.addText(String(idx + 1), {
      x: x + cardW - 0.4, y: startY + 0.1, w: 0.3, h: 0.3,
      fontSize: 16, color: COLORS.border, bold: true, align: 'right', fontFace: FONTS.heading,
    });
    slide.addText(item.title ?? '', {
      x: x + 0.1, y: startY + 0.45, w: cardW - 0.2, h: 0.35,
      fontSize: 15, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.1, y: startY + 0.85, w: cardW - 0.2, h: 1.25,
        fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const footnoteParts = [props.badge, props.footnote].filter(Boolean);
  if (footnoteParts.length > 0) {
    slide.addText(footnoteParts.join(' · '), {
      x: 0.65, y: 5.05, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CoverIndexV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.68, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.75, w: 4.2, h: 1.3,
    fontSize: 44, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 3.1, w: 4.2, h: 0.6,
      fontSize: 15, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items ?? []).slice(0, 4);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const cardW = 1.85;
  const gap = 0.15;
  const startX = 5.25;
  const startY = 1.3;

  items.forEach((item: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const color = toneColors[item.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y: startY, w: cardW, h: 3.65,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(item.number ?? '', {
      x, y: startY + 0.2, w: cardW, h: 0.5,
      fontSize: 28, color, bold: true, align: 'center', fontFace: FONTS.heading,
    });
    slide.addText(item.title ?? '', {
      x: x + 0.1, y: startY + 0.8, w: cardW - 0.2, h: 0.45,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.1, y: startY + 1.3, w: cardW - 0.2, h: 1.8,
        fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  if (props.footnoteLeft) {
    slide.addText(props.footnoteLeft, {
      x: 0.65, y: 5.35, w: 4.2, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  if (props.footnoteRight) {
    slide.addText(props.footnoteRight, {
      x: 5.25, y: 5.35, w: 4.1, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ChapterV2(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 4.8, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 4.8, h: 1.0,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.25, w: 4.8, h: 0.35,
      fontSize: 15, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.65, y: 2.8, w: 4.8, h: 1.2,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  slide.addShape('line', {
    x1: 5.5, y1: 1.0, x2: 5.5, y2: 4.6,
    line: { color: COLORS.border, width: 2 },
  } as any);
  slide.addText(props.number ?? '', {
    x: 5.6, y: 1.2, w: 3.8, h: 2.8,
    fontSize: 120, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
}

function renderTheme04ImageQuoteV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  slide.addText('"', {
    x: 0.55, y: 0.8, w: 0.6, h: 0.6,
    fontSize: 60, color: COLORS.accent, fontFace: FONTS.heading,
  });
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 1.0, w: 5.0, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.quote ?? ''), {
    x: 0.65, y: 1.3, w: 5.0, h: 2.4,
    fontSize: 26, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.source) {
    slide.addText(props.source, {
      x: 0.65, y: 3.85, w: 5.0, h: 0.35,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.author) {
    slide.addText(props.author, {
      x: 0.65, y: 4.25, w: 5.0, h: 0.2,
      fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const sealX = 6.2;
  const sealY = 1.4;
  const sealR = 1.2;
  slide.addShape('ellipse', {
    x: sealX, y: sealY, w: sealR * 2, h: sealR * 2,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.accent, width: 2 },
  } as any);
  slide.addText('资本大年 · CONFIRMED', {
    x: sealX, y: sealY + 0.35, w: sealR * 2, h: 0.2,
    fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
  });
  slide.addText(props.value ?? '', {
    x: sealX, y: sealY + 0.65, w: sealR * 2, h: 0.7,
    fontSize: 44, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: sealX, y: sealY + 1.35, w: sealR * 2, h: 0.2,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
    });
  }
  if (props.valueLabel) {
    slide.addText(props.valueLabel, {
      x: sealX, y: sealY + 1.6, w: sealR * 2, h: 0.2,
      fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04EditorialV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.68, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.05, w: 4.3, h: 0.55,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 4.3, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addImageMaybe(slide, props.imageUrl, 0.65, 2.0, 4.3, 1.65);
  if (props.quote) {
    slide.addText(props.quote, {
      x: 0.65, y: 3.75, w: 4.3, h: 0.85,
      fontSize: 13, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.author) {
    slide.addText(props.author, {
      x: 0.65, y: 4.65, w: 4.3, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }

  const items = (props.items ?? []).slice(0, 4);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  items.forEach((item: any, idx: number) => {
    const y = 1.05 + idx * 1.1;
    const color = toneColors[item.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x: 5.35, y, w: 4.0, h: 1.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color },
      rectRadius: 0.12,
    } as any);
    if (item.label) {
      slide.addText(item.label, {
        x: 5.47, y: y + 0.1, w: 0.5, h: 0.2,
        fontSize: 10, color, bold: true, fontFace: FONTS.mono,
      });
    }
    if (item.title) {
      slide.addText(item.title, {
        x: 5.47, y: y + 0.3, w: 3.75, h: 0.28,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
    }
    if (item.description) {
      slide.addText(item.description, {
        x: 5.47, y: y + 0.58, w: 3.75, h: 0.35,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const footerParts = [props.footnoteLeft, props.footnoteRight].filter(Boolean);
  if (footerParts.length > 0) {
    slide.addText(footerParts.join(' · '), {
      x: 0.65, y: 5.3, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04TriptychV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.6, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.68, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.05, w: 8.7, h: 0.5,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const panels = (props.panels ?? []).slice(0, 3);
  const gap = 0.25;
  const cardW = (8.7 - gap * (panels.length - 1)) / panels.length;
  const startX = 0.65;
  const startY = 1.95;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };

  panels.forEach((panel: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const color = toneColors[panel.tone ?? 'green'] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y: startY, w: cardW, h: 3.25,
      fill: { color: COLORS.surfaceElevated },
      line: { color },
      rectRadius: 0.12,
    } as any);
    addImageMaybe(slide, panel.imageUrl, x, startY, cardW, 2.05);
    if (panel.label) {
      slide.addShape('roundRect', {
        x: x + 0.12, y: startY + 0.12, w: 0.55, h: 0.24,
        fill: { color }, rectRadius: 0.12,
      } as any);
      slide.addText(panel.label, {
        x: x + 0.12, y: startY + 0.12, w: 0.55, h: 0.24,
        fontSize: 9, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
    }
    if (panel.title) {
      slide.addText(panel.title, {
        x: x + 0.12, y: startY + 2.15, w: cardW - 0.24, h: 0.3,
        fontSize: 15, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
    }
    if (panel.description) {
      slide.addText(panel.description, {
        x: x + 0.12, y: startY + 2.45, w: cardW - 0.24, h: 0.6,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  const footerParts = [props.footnoteLeft, props.footnoteRight].filter(Boolean);
  if (footerParts.length > 0) {
    slide.addText(footerParts.join(' · '), {
      x: 0.65, y: 5.3, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04GanttV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.5,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.5, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const periods = (props.periods ?? []).slice(0, 8);
  const lanes = (props.lanes ?? []).slice(0, 6);
  const colCount = Math.max(2, periods.length);
  const laneNameW = 1.5;
  const gridX = 0.65 + laneNameW;
  const gridW = 8.7 - laneNameW;
  const colW = gridW / colCount;
  const rowH = 0.55;
  const startY = 2.05;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };

  slide.addShape('roundRect', {
    x: 0.65, y: startY, w: 8.7, h: 0.45 + lanes.length * rowH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.1,
  } as any);

  periods.forEach((period: string, idx: number) => {
    slide.addText(period, {
      x: gridX + idx * colW, y: startY + 0.08, w: colW, h: 0.3,
      fontSize: 10, color: COLORS.secondary, bold: true, align: 'center', fontFace: FONTS.mono,
    });
  });

  lanes.forEach((lane: any, lidx: number) => {
    const y = startY + 0.45 + lidx * rowH;
    slide.addText(lane.name ?? '', {
      x: 0.75, y, w: laneNameW - 0.2, h: rowH,
      fontSize: 11, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
    for (let i = 0; i < colCount; i++) {
      slide.addShape('line', {
        x1: gridX + i * colW, y1: y, x2: gridX + i * colW, y2: y + rowH,
        line: { color: COLORS.border, width: 0.5 },
      } as any);
    }

    (lane.tasks || []).filter((t: any) => t != null).slice(0, 6).forEach((task: any) => {
      const start = Math.max(0, Math.min(colCount - 1, Number(task.start) || 0));
      const end = Math.max(start + 1, Math.min(colCount, Number(task.end) || start + 1));
      const color = toneColors[task.tone ?? 'green'] || COLORS.accent;
      const barX = gridX + start * colW + 0.05;
      const barW = (end - start) * colW - 0.1;
      slide.addShape('roundRect', {
        x: barX, y: y + 0.12, w: barW, h: rowH - 0.24,
        fill: { color }, rectRadius: 0.08,
      } as any);
      slide.addText(task.name ?? '', {
        x: barX, y: y + 0.12, w: barW, h: rowH - 0.24,
        fontSize: 9, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04RadarV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.5,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.5, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels ?? []).slice(0, 8);
  const datasets = (props.datasets ?? []).slice(0, 4);
  const centerX = 5.0;
  const centerY = 3.15;
  const radius = 1.45;
  const angleStep = (Math.PI * 2) / Math.max(labels.length, 1);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };

  // grid circles
  [0.25, 0.5, 0.75, 1].forEach((r) => {
    slide.addShape('ellipse', {
      x: centerX - radius * r, y: centerY - radius * r * 0.75, w: radius * 2 * r, h: radius * 2 * r * 0.75,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 0.5 },
    } as any);
  });

  // axis lines + labels
  labels.forEach((label: string, idx: number) => {
    const angle = -Math.PI / 2 + idx * angleStep;
    const x2 = centerX + Math.cos(angle) * radius;
    const y2 = centerY + Math.sin(angle) * radius * 0.75;
    slide.addShape('line', {
      x1: centerX, y1: centerY, x2: x2, y2: y2,
      line: { color: COLORS.border, width: 0.5 },
    } as any);
    const lx = centerX + Math.cos(angle) * (radius + 0.35);
    const ly = centerY + Math.sin(angle) * (radius + 0.35) * 0.75 - 0.08;
    slide.addText(label, {
      x: lx - 0.6, y: ly, w: 1.2, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  });

  // datasets
  datasets.forEach((ds: any) => {
    const color = toneColors[ds.tone ?? 'green'] || COLORS.accent;
    const data = (ds.data || []).slice(0, labels.length);
    const points = data.map((v: number, idx: number) => {
      const angle = -Math.PI / 2 + idx * angleStep;
      const r = (Math.max(0, Math.min(100, Number(v) || 0)) / 100) * radius;
      return { x: centerX + Math.cos(angle) * r, y: centerY + Math.sin(angle) * r * 0.75 };
    });
    if (points.length > 2) {
      points.forEach((p: any, idx: number) => {
        const next = points[(idx + 1) % points.length];
        slide.addShape('line', {
          x1: p.x, y1: p.y, x2: next.x, y2: next.y,
          line: { color, width: 2 },
        } as any);
      });
      points.forEach((p: any) => {
        slide.addShape('ellipse', {
          x: p.x - 0.04, y: p.y - 0.04, w: 0.08, h: 0.08,
          fill: { color },
        } as any);
      });
    }
  });

  // legend
  datasets.forEach((ds: any, idx: number) => {
    const color = toneColors[ds.tone ?? 'green'] || COLORS.accent;
    const y = 2.4 + idx * 0.28;
    slide.addShape('ellipse', {
      x: 7.3, y, w: 0.12, h: 0.12,
      fill: { color },
    } as any);
    slide.addText(ds.name ?? '', {
      x: 7.5, y: y - 0.02, w: 1.85, h: 0.18,
      fontSize: 11, color: COLORS.primary, fontFace: FONTS.body,
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04HeatmapV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.5,
    fontSize: 34, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.5, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const xLabels = (props.xLabels ?? []).slice(0, 8);
  const yLabels = (props.yLabels ?? []).slice(0, 8);
  const cells = (props.cells ?? []).filter((c: any) => c != null).slice(0, 64);
  const maxValue = Math.max(1, ...cells.map((c: any) => Number(c.value) || 0));
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: 'FF6B9D',
    blue: '4ECDC4',
    yellow: 'FFD166',
  };
  const mainColor = toneColors[props.colorTone ?? 'green'] || COLORS.accent;

  const labelW = 1.4;
  const gridX = 0.65 + labelW;
  const gridY = 2.0;
  const gridW = 8.7 - labelW - 0.65;
  const gridH = 2.8;
  const colW = gridW / Math.max(xLabels.length, 1);
  const rowH = gridH / Math.max(yLabels.length, 1);

  // x labels
  xLabels.forEach((label: string, idx: number) => {
    slide.addText(label, {
      x: gridX + idx * colW, y: gridY - 0.3, w: colW, h: 0.25,
      fontSize: 10, color: COLORS.secondary, bold: true, align: 'center', fontFace: FONTS.mono,
    });
  });

  // y labels
  yLabels.forEach((label: string, idx: number) => {
    slide.addText(label, {
      x: 0.65, y: gridY + idx * rowH + rowH / 2 - 0.1, w: labelW - 0.1, h: 0.25,
      fontSize: 10, color: COLORS.secondary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
  });

  // cells
  cells.forEach((cell: any) => {
    const cx = Math.max(0, Math.min(xLabels.length - 1, Number(cell.x) || 0));
    const cy = Math.max(0, Math.min(yLabels.length - 1, Number(cell.y) || 0));
    const value = Math.max(0, Math.min(maxValue, Number(cell.value) || 0));
    const ratio = value / maxValue;
    const x = gridX + cx * colW + 0.02;
    const y = gridY + cy * rowH + 0.02;
    const w = colW - 0.04;
    const h = rowH - 0.04;
    // interpolate color
    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    });
    const bgHex = COLORS.surfaceElevated.replace('#', '').replace(/^0x/, '');
    const fgHex = mainColor.replace('#', '').replace(/^0x/, '');
    const bg = hexToRgb(bgHex.length === 6 ? bgHex : '121212');
    const fg = hexToRgb(fgHex.length === 6 ? fgHex : '3ade80');
    const r = Math.round(bg.r + (fg.r - bg.r) * ratio);
    const g = Math.round(bg.g + (fg.g - bg.g) * ratio);
    const b = Math.round(bg.b + (fg.b - bg.b) * ratio);
    const fillColor = `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    slide.addShape('roundRect', {
      x, y, w, h,
      fill: { color: fillColor }, rectRadius: 0.04,
    } as any);
    slide.addText(String(value), {
      x, y, w, h,
      fontSize: 10, color: ratio > 0.5 ? COLORS.white : COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CoverGhostV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  // 超大幽灵数字
  slide.addText(props.ghostNumber ?? '', {
    x: 0, y: 1.2, w: 10, h: 3.0,
    fontSize: 220, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.9, w: 8, h: 1.2,
    fontSize: 52, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.1, w: 7, h: 0.6,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 3);
  if (metrics.length > 0) {
    const cardW = 2.4;
    const startX = (10 - metrics.length * cardW - (metrics.length - 1) * 0.25) / 2;
    metrics.forEach((m: any, idx: number) => {
      const x = startX + idx * (cardW + 0.25);
      slide.addShape('roundRect', {
        x, y: 4.0, w: cardW, h: 1.1,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: 4.15, w: cardW, h: 0.45,
        fontSize: 28, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x, y: 4.62, w: cardW, h: 0.25,
        fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CardsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.9,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.05, w: 8.7, h: 0.45,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const cards = (props.cards || []).slice(0, 4);
  if (cards.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const count = cards.length;
  const gap = 0.22;
  const cardW = (8.7 - (count - 1) * gap) / count;
  const startX = 0.65;
  const y = 2.75;
  const cardH = 2.6;

  cards.forEach((card: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const tone = card.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    // 卡片背景
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    // 顶部彩色条
    slide.addShape('roundRect', {
      x: x + 0.08, y: y + 0.08, w: cardW - 0.16, h: 0.06,
      fill: { color }, rectRadius: 0.03,
    } as any);

    // 标签与指标
    const tagText = [card.tag, card.value ? `${card.value}${card.unit || ''}` : ''].filter(Boolean).join(' · ');
    if (tagText) {
      slide.addShape('roundRect', {
        x: x + 0.12, y: y + 0.22, w: cardW - 0.24, h: 0.26,
        fill: { color: COLORS.border, transparency: 70 }, rectRadius: 0.13,
      } as any);
      slide.addText(tagText, {
        x: x + 0.12, y: y + 0.22, w: cardW - 0.24, h: 0.26,
        fontSize: 9, color, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
    }

    slide.addText(card.title ?? '', {
      x: x + 0.12, y: y + 0.6, w: cardW - 0.24, h: 0.5,
      fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
    });
    if (card.description) {
      slide.addText(card.description, {
        x: x + 0.12, y: y + 1.1, w: cardW - 0.24, h: 1.3,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme04GaugesV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.9,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.05, w: 8.7, h: 0.45,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const gauges = (props.gauges || []).slice(0, 3);
  if (gauges.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const count = gauges.length;
  const gap = 0.25;
  const cardW = (8.7 - (count - 1) * gap) / count;
  const startX = 0.65;
  const y = 2.75;
  const cardH = 2.6;

  gauges.forEach((g: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const tone = g.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    const value = Math.max(0, Math.min(100, Number(g.value) || 0));

    // 卡片背景
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    // 半圆仪表盘：使用 doughnut 图表并只取下半部分
    const chartSize = Math.min(cardW - 0.4, 1.6);
    const chartX = x + (cardW - chartSize) / 2;
    const chartY = y + 0.2;
    slide.addChart('doughnut' as 'pie', [
      { name: '已完成', labels: ['已完成', '未完成'], values: [value, 100 - value] },
    ], {
      x: chartX, y: chartY, w: chartSize, h: chartSize * 0.65,
      chartColors: [color, COLORS.border],
      showValue: false,
      holeSize: 60,
      showLegend: false,
      showTitle: false,
      dataLabelPosition: 'none',
    } as any);

    // 中心数值
    slide.addText(`${value}${g.unit || ''}`, {
      x, y: y + 0.85, w: cardW, h: 0.55,
      fontSize: 32, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });

    // 标签
    slide.addText(g.label ?? '', {
      x: x + 0.12, y: y + cardH - 0.6, w: cardW - 0.24, h: 0.4,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  });
}

function renderTheme04CoverBentoV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.55, w: 8, h: 0.9,
    fontSize: 48, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 2.45, w: 7, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 4);
  if (items.length > 0) {
    const isLight = COLORS.white === 'FAFAF8';
    const toneColors: Record<string, string> = {
      green: COLORS.accent,
      pink: isLight ? 'DB2777' : 'FF6B9D',
      blue: isLight ? '0D9488' : '4ECDC4',
      yellow: isLight ? 'D97706' : 'FFD166',
    };

    const gridW = 8.7;
    const gridH = 2.1;
    const gridX = 0.65;
    const gridY = 3.0;
    const gap = 0.16;

    // 2x2 bento: large cell spans left column, others stack on right
    const leftW = gridW * 0.55;
    const rightW = gridW - leftW - gap;
    const rightH = (gridH - gap) / 2;

    items.forEach((item: any, idx: number) => {
      const tone = item.tone || 'green';
      const color = toneColors[tone] ?? COLORS.accent;
      const size = item.size || 'medium';
      let x = gridX;
      let y = gridY;
      let w = leftW;
      let h = gridH;
      let valueSize = 38;

      if (idx === 0) {
        x = gridX;
        y = gridY;
        w = leftW;
        h = gridH;
        valueSize = size === 'large' ? 44 : 38;
      } else if (idx === 1) {
        x = gridX + leftW + gap;
        y = gridY;
        w = rightW;
        h = rightH;
        valueSize = size === 'large' ? 32 : 26;
      } else if (idx === 2) {
        const hasFourth = items.length > 3;
        x = gridX + leftW + gap;
        y = gridY + rightH + gap;
        w = hasFourth ? (rightW - gap) / 2 : rightW;
        h = rightH;
        valueSize = size === 'large' ? 28 : 24;
      } else {
        x = gridX + leftW + gap + (rightW + gap) / 2;
        y = gridY + rightH + gap;
        w = (rightW - gap) / 2;
        h = rightH;
        valueSize = 22;
      }

      slide.addShape('roundRect', {
        x, y, w, h,
        fill: { color: COLORS.surfaceElevated },
        line: { color, width: 1.5 },
        rectRadius: 0.12,
      } as any);

      const valueText = `${item.value ?? ''}${item.unit ?? ''}`;
      slide.addText(valueText, {
        x: x + 0.14, y: y + 0.18, w: w - 0.28, h: h * 0.55,
        fontSize: valueSize, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      slide.addText(item.label ?? '', {
        x: x + 0.14, y: y + h - 0.5, w: w - 0.28, h: 0.35,
        fontSize: 11, color: COLORS.secondary, valign: 'bottom', fontFace: FONTS.body,
      });
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CoverMagazineV1(slide: PptxSlide, props: any): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
    });
  }

  // Left column: title, subtitle, metadata
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.35, w: 4.3, h: 1.1,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.45, w: 4.3, h: 0.45,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const metadata = (props.metadata || []).slice(0, 4);
  if (metadata.length > 0) {
    metadata.forEach((m: any, idx: number) => {
      const y = 3.05 + idx * 0.42;
      slide.addText(m.label ?? '', {
        x: 0.65, y, w: 1.5, h: 0.22,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
      slide.addText(m.value ?? '', {
        x: 2.2, y, w: 2.75, h: 0.22,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      slide.addShape('line', {
        x1: 0.65, y1: y + 0.28, x2: 4.95, y2: y + 0.28,
        line: { color: COLORS.border, width: 0.5 },
      } as any);
    });
  }

  // Right column: image card + caption
  const imageX = 5.35;
  const imageY = 1.2;
  const imageW = 4.0;
  const imageH = 3.4;
  slide.addShape('roundRect', {
    x: imageX, y: imageY, w: imageW, h: imageH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);
  if (props.image) {
    addImageMaybe(slide, props.image, imageX + 0.12, imageY + 0.12, imageW - 0.24, imageH - 0.24);
  } else {
    slide.addShape('roundRect', {
      x: imageX + 0.12, y: imageY + 0.12, w: imageW - 0.24, h: imageH - 0.24,
      fill: { color: COLORS.surface },
      rectRadius: 0.08,
    } as any);
  }
  if (props.caption) {
    slide.addText(props.caption, {
      x: imageX, y: imageY + imageH + 0.12, w: imageW, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.35, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ChapterSplitV1(slide: PptxSlide, props: any): void {
  const visualX = 0;
  const visualY = 0;
  const visualW = 6.0;
  const visualH = 5.625;

  if (props.image) {
    addImageMaybe(slide, props.image, visualX, visualY, visualW, visualH);
  } else {
    slide.addShape('rect', {
      x: visualX, y: visualY, w: visualW, h: visualH,
      fill: { color: COLORS.surfaceElevated },
    } as any);
  }

  // Right content area
  slide.addText(props.number ?? '', {
    x: 6.45, y: 1.4, w: 3.1, h: 0.7,
    fontSize: 24, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
  });
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 6.45, y: 2.05, w: 3.1, h: 0.9,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 6.45, y: 3.0, w: 3.1, h: 0.7,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  slide.addShape('line', {
    x1: 6.45, y1: 3.85, x2: 8.95, y2: 3.85,
    line: { color: COLORS.accent, width: 3 },
  } as any);
}

function renderTheme04ChapterNumberedV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(props.tag, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(props.number ?? '', {
    x: 0.65, y: 1.5, w: 8.7, h: 1.6,
    fontSize: 140, color: COLORS.accent, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 3.25, w: 8, h: 0.8,
    fontSize: 42, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 4.05, w: 7, h: 0.45,
      fontSize: 15, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  // Decorative circle
  slide.addShape('ellipse', {
    x: 7.6, y: 0.6, w: 1.4, h: 1.4,
    fill: { color: COLORS.accent, transparency: 85 },
  } as any);
}

function renderTheme04DeltaV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };
  const tone = props.tone || 'green';
  const color = toneColors[tone] ?? COLORS.accent;

  const cardW = 5.0;
  const cardH = 2.2;
  const cardX = (10 - cardW) / 2;
  const cardY = 2.65;

  slide.addShape('roundRect', {
    x: cardX, y: cardY, w: cardW, h: cardH,
    fill: { color: COLORS.surfaceElevated },
    line: { color, width: 2 },
    rectRadius: 0.16,
  } as any);

  const valueText = `${props.value ?? ''}${props.unit ?? ''}`;
  slide.addText(valueText, {
    x: cardX, y: cardY + 0.25, w: cardW, h: 1.0,
    fontSize: 72, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.label) {
    slide.addText(props.label, {
      x: cardX, y: cardY + cardH - 0.55, w: cardW, h: 0.35,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const delta = props.delta ?? '';
  const isUp = !String(delta).startsWith('-');
  const arrow = isUp ? '▲' : '▼';
  slide.addText(`${arrow}  ${delta}`, {
    x: cardX + cardW + 0.35, y: cardY + 0.55, w: 2.2, h: 0.6,
    fontSize: 28, color, bold: true, fontFace: FONTS.heading,
  });
  if (props.deltaLabel) {
    slide.addText(props.deltaLabel, {
      x: cardX + cardW + 0.35, y: cardY + 1.15, w: 2.2, h: 0.3,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
}

function renderTheme04VersusV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const sides = [
    { key: 'left', side: props.left || {}, x: 0.65 },
    { key: 'right', side: props.right || {}, x: 5.45 },
  ];

  sides.forEach(({ side, x }: { side: any; x: number }) => {
    const tone = side.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y: 2.65, w: 4.0, h: 2.4,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 2 },
      rectRadius: 0.16,
    } as any);

    slide.addText(side.label ?? '', {
      x: x + 0.2, y: 2.85, w: 3.6, h: 0.35,
      fontSize: 14, color: COLORS.secondary, bold: true, fontFace: FONTS.body,
    });
    slide.addText(`${side.value ?? ''}${side.unit ?? ''}`, {
      x: x + 0.2, y: 3.25, w: 3.6, h: 0.85,
      fontSize: 52, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  });

  // VS badge
  slide.addShape('ellipse', {
    x: 4.35, y: 3.35, w: 1.3, h: 1.3,
    fill: { color: COLORS.accent },
  } as any);
  slide.addText('VS', {
    x: 4.35, y: 3.35, w: 1.3, h: 1.3,
    fontSize: 24, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04TrioV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 3);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const count = items.length;
  const gap = 0.22;
  const cardW = (8.7 - (count - 1) * gap) / count;
  const startX = 0.65;
  const y = 2.6;
  const cardH = 2.55;

  items.forEach((item: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    // Top colored bar
    slide.addShape('roundRect', {
      x: x + 0.08, y: y + 0.08, w: cardW - 0.16, h: 0.06,
      fill: { color }, rectRadius: 0.03,
    } as any);

    // Image placeholder or actual image
    const imgH = cardW * 0.55;
    if (item.image) {
      addImageMaybe(slide, item.image, x + 0.1, y + 0.22, cardW - 0.2, imgH);
    } else {
      slide.addShape('roundRect', {
        x: x + 0.1, y: y + 0.22, w: cardW - 0.2, h: imgH,
        fill: { color: COLORS.surface },
        line: { color: COLORS.border, width: 1, dash: 'dash' },
        rectRadius: 0.08,
      } as any);
    }

    const textY = y + 0.28 + imgH;
    if (item.role) {
      slide.addText(item.role, {
        x: x + 0.12, y: textY, w: cardW - 0.24, h: 0.22,
        fontSize: 9, color, bold: true, fontFace: FONTS.mono,
      });
    }
    slide.addText(item.name ?? '', {
      x: x + 0.12, y: textY + 0.22, w: cardW - 0.24, h: 0.32,
      fontSize: 15, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.12, y: textY + 0.54, w: cardW - 0.24, h: cardH - (textY + 0.54 - y) - 0.12,
        fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04PolaroidV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const images = (props.images || []).slice(0, 4);
  if (images.length === 0) return;

  const areaX = 0.65;
  const areaY = 2.45;
  const areaW = 8.7;
  const areaH = 2.6;
  const gap = 0.2;

  if (images.length === 1) {
    const cardW = 3.6;
    const cardH = 2.6;
    const x = areaX + (areaW - cardW) / 2;
    const y = areaY;
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    } as any);
    if (images[0].image) {
      addImageMaybe(slide, images[0].image, x + 0.14, y + 0.14, cardW - 0.28, cardH - 0.62);
    }
    if (images[0].caption) {
      slide.addText(images[0].caption, {
        x, y: y + cardH - 0.48, w: cardW, h: 0.34,
        fontSize: 11, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    }
  } else if (images.length === 2) {
    const cardW = (areaW - gap) / 2;
    const cardH = 2.6;
    images.forEach((img: any, idx: number) => {
      const x = areaX + idx * (cardW + gap);
      const y = areaY;
      slide.addShape('roundRect', {
        x, y, w: cardW, h: cardH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.08,
      } as any);
      if (img.image) {
        addImageMaybe(slide, img.image, x + 0.12, y + 0.12, cardW - 0.24, cardH - 0.62);
      }
      if (img.caption) {
        slide.addText(img.caption, {
          x, y: y + cardH - 0.46, w: cardW, h: 0.34,
          fontSize: 10, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
        });
      }
    });
  } else {
    const cardW = (areaW - gap) / 2;
    const cardH = (areaH - gap) / 2;
    images.forEach((img: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = areaX + col * (cardW + gap);
      const y = areaY + row * (cardH + gap);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: cardH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.06,
      } as any);
      if (img.image) {
        addImageMaybe(slide, img.image, x + 0.1, y + 0.1, cardW - 0.2, cardH - 0.52);
      }
      if (img.caption) {
        slide.addText(img.caption, {
          x, y: y + cardH - 0.4, w: cardW, h: 0.3,
          fontSize: 9, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
}

function renderTheme04VerdictV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(props.tag, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 1, y: 1.45, w: 8, h: 0.9,
    fontSize: 44, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 2.35, w: 7, h: 0.45,
      fontSize: 15, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  // Seal
  const sealX = 4.0;
  const sealY = 2.95;
  const sealR = 0.9;
  slide.addShape('ellipse', {
    x: sealX, y: sealY, w: sealR * 2, h: sealR * 2,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.accent, width: 3 },
  } as any);
  if (props.verdictLabel) {
    slide.addText(props.verdictLabel, {
      x: sealX, y: sealY + 0.35, w: sealR * 2, h: 0.25,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
  slide.addText(props.verdict ?? '', {
    x: sealX, y: sealY + 0.6, w: sealR * 2, h: 0.7,
    fontSize: 36, color: COLORS.accent, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });

  if (props.cta) {
    slide.addShape('roundRect', {
      x: 3.8, y: 4.85, w: 2.4, h: 0.42,
      fill: { color: COLORS.accent }, rectRadius: 0.21,
    } as any);
    slide.addText(props.cta, {
      x: 3.8, y: 4.85, w: 2.4, h: 0.42,
      fontSize: 13, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
  }
  if (props.contact) {
    slide.addText(props.contact, {
      x: 1, y: 5.35, w: 8, h: 0.2,
      fontSize: 11, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04TreemapV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 12);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const rects = layoutTreemap(items, chartX + 0.06, chartY + 0.06, chartW - 0.12, chartH - 0.12);
  rects.forEach(({ x, y, w, h, item }) => {
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    if (w < 0.15 || h < 0.15) return;

    slide.addShape('roundRect', {
      x, y, w, h,
      fill: { color },
      rectRadius: 0.06,
    } as any);

    const label = `${item.name ?? ''}\n${item.value ?? ''} ${props.unit ?? ''}`;
    const fontSize = Math.min(13, Math.max(8, Math.min(w, h) * 6));
    slide.addText(label, {
      x: x + 0.04, y: y + 0.04, w: w - 0.08, h: h - 0.08,
      fontSize, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  });
}

function renderTheme04ScoreboardV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).slice(0, 5);
  const rows = (props.rows || []).slice(0, 8);
  if (metrics.length === 0 || rows.length === 0) return;

  const tableX = 0.65;
  const tableY = 2.45;
  const tableW = 8.7;
  const tableH = 2.7;
  const rowH = tableH / (rows.length + 1);
  const rankW = 0.5;
  const nameW = 1.8;
  const metricW = (tableW - rankW - nameW) / metrics.length;

  // Header
  slide.addShape('roundRect', {
    x: tableX, y: tableY, w: tableW, h: rowH,
    fill: { color: COLORS.surface },
    rectRadius: 0.08,
  } as any);

  const headers = ['#', '玩家', ...metrics.map((m: any) => m.label)];
  headers.forEach((text, idx) => {
    const x = idx === 0 ? tableX : idx === 1 ? tableX + rankW : tableX + rankW + nameW + (idx - 2) * metricW;
    const w = idx === 0 ? rankW : idx === 1 ? nameW : metricW;
    slide.addText(text, {
      x: x + 0.06, y: tableY, w: w - 0.12, h: rowH,
      fontSize: 10, color: COLORS.secondary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
  });

  rows.forEach((row: any, ridx: number) => {
    const y = tableY + (ridx + 1) * rowH;
    const cells = [String(row.rank ?? ridx + 1), row.name ?? '', ...(row.values || []).slice(0, metrics.length)];
    cells.forEach((text, cidx) => {
      const x = cidx === 0 ? tableX : cidx === 1 ? tableX + rankW : tableX + rankW + nameW + (cidx - 2) * metricW;
      const w = cidx === 0 ? rankW : cidx === 1 ? nameW : metricW;
      slide.addText(String(text ?? ''), {
        x: x + 0.06, y, w: w - 0.12, h: rowH,
        fontSize: 10, color: COLORS.primary, bold: cidx === 1, valign: 'middle', fontFace: FONTS.body,
      });
    });

    if (ridx < rows.length - 1) {
      slide.addShape('line', {
        x1: tableX, y1: y + rowH, x2: tableX + tableW, y2: y + rowH,
        line: { color: COLORS.border, width: 0.5 },
      } as any);
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ScorecardsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const cards = (props.cards || []).slice(0, 6);
  if (cards.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const count = cards.length;
  const cols = count <= 2 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  const gap = 0.18;
  const cardW = (8.7 - (cols - 1) * gap) / cols;
  const cardH = (2.7 - (rows - 1) * gap) / rows;
  const startX = 0.65;
  const startY = 2.45;

  cards.forEach((card: any, idx: number) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);
    const tone = card.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 1.5 },
      rectRadius: 0.12,
    } as any);

    slide.addText(card.title ?? '', {
      x: x + 0.12, y: y + 0.12, w: cardW - 0.24, h: 0.28,
      fontSize: 11, color: COLORS.secondary, bold: true, fontFace: FONTS.body,
    });
    slide.addText(`${card.value ?? ''}${card.unit ?? ''}`, {
      x: x + 0.12, y: y + 0.45, w: cardW - 0.24, h: 0.55,
      fontSize: 32, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (card.subtitle) {
      slide.addText(card.subtitle, {
        x: x + 0.12, y: y + cardH - 0.45, w: cardW - 0.24, h: 0.32,
        fontSize: 10, color: COLORS.secondary, valign: 'bottom', fontFace: FONTS.body,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04MatrixV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 4);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const yAxisW = 0.35;
  const gridX = 1.0;
  const gridY = 2.45;
  const gridW = 8.0;
  const gridH = 2.65;

  // Y axis
  slide.addText(props.yAxis?.high || '高', {
    x: 0.6, y: gridY, w: yAxisW, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
  });
  slide.addShape('line', {
    x1: gridX - 0.08, y1: gridY + 0.15, x2: gridX - 0.08, y2: gridY + gridH - 0.15,
    line: { color: COLORS.border, width: 1 },
  } as any);
  slide.addText(props.yAxis?.low || '低', {
    x: 0.6, y: gridY + gridH - 0.35, w: yAxisW, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
  });

  // Cards grid
  const cols = 2;
  const rows = 2;
  const gap = 0.14;
  const cardW = (gridW - gap) / cols;
  const cardH = (gridH - gap) / rows;

  items.forEach((item: any, idx: number) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = gridX + col * (cardW + gap);
    const y = gridY + row * (cardH + gap);
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 1.5 },
      rectRadius: 0.12,
    } as any);

    slide.addText(item.title ?? '', {
      x: x + 0.1, y: y + 0.15, w: cardW - 0.2, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });
    if (item.description) {
      slide.addText(item.description, {
        x: x + 0.1, y: y + 0.5, w: cardW - 0.2, h: cardH - 0.6,
        fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  // X axis
  slide.addShape('line', {
    x1: gridX + 0.1, y1: gridY + gridH + 0.1, x2: gridX + gridW - 0.1, y2: gridY + gridH + 0.1,
    line: { color: COLORS.border, width: 1 },
  } as any);
  slide.addText(props.xAxis?.low || '低', {
    x: gridX, y: gridY + gridH + 0.14, w: 1.0, h: 0.2,
    fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
  });
  slide.addText(props.xAxis?.high || '高', {
    x: gridX + gridW - 1.0, y: gridY + gridH + 0.14, w: 1.0, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04LayersV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const layers = (props.layers || []).slice(0, 5);
  if (layers.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const startX = 1.0;
  const startY = 2.45;
  const maxW = 8.0;
  const gap = 0.12;
  const layerH = (2.75 - (layers.length - 1) * gap) / layers.length;

  layers.forEach((layer: any, idx: number) => {
    const tone = layer.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    const w = maxW * (1 - idx * 0.08);
    const x = startX + (maxW - w) / 2;
    const y = startY + idx * (layerH + gap);

    slide.addShape('roundRect', {
      x, y, w, h: layerH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 1.5 },
      rectRadius: 0.1,
    } as any);

    slide.addText(layer.title ?? '', {
      x: x + 0.2, y, w: 2.0, h: layerH,
      fontSize: 14, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.heading,
    });

    const items = (layer.items || []).slice(0, 5);
    const itemStartX = x + 2.2;
    const itemW = (w - 2.4) / Math.max(items.length, 1);
    items.forEach((item: string, iidx: number) => {
      slide.addShape('roundRect', {
        x: itemStartX + iidx * itemW + 0.04, y: y + 0.12, w: itemW - 0.08, h: layerH - 0.24,
        fill: { color: COLORS.surface },
        line: { color: COLORS.border, width: 0.5 },
        rectRadius: 0.06,
      } as any);
      slide.addText(item ?? '', {
        x: itemStartX + iidx * itemW + 0.04, y: y + 0.12, w: itemW - 0.08, h: layerH - 0.24,
        fontSize: 8, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ScatterV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 16);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const plotMargin = { top: 0.3, right: 0.3, bottom: 0.5, left: 0.7 };
  const plotX = chartX + plotMargin.left;
  const plotY = chartY + plotMargin.top;
  const plotW = chartW - plotMargin.left - plotMargin.right;
  const plotH = chartH - plotMargin.top - plotMargin.bottom;

  const xs = items.map((item: any) => Number(item.x) || 0);
  const ys = items.map((item: any) => Number(item.y) || 0);
  const maxX = Math.max(1, ...xs);
  const maxY = Math.max(1, ...ys);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const x = plotX + (i / 4) * plotW;
    const y = plotY + (i / 4) * plotH;
    slide.addShape('line', {
      x1: x, y1: plotY, x2: x, y2: plotY + plotH,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
    slide.addShape('line', {
      x1: plotX, y1: y, x2: plotX + plotW, y2: y,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
  }

  // Axis labels
  slide.addText(props.xAxisLabel || '', {
    x: plotX + plotW / 2 - 1, y: chartY + chartH - 0.38, w: 2, h: 0.2,
    fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(props.yAxisLabel || '', {
    x: chartX + 0.05, y: plotY + plotH / 2 - 0.25, w: 0.5, h: 0.5,
    fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
  });

  const maxValue = Math.max(1, ...items.map((item: any) => Number(item.value) || 0));
  items.forEach((item: any) => {
    const x = plotX + ((Number(item.x) || 0) / maxX) * plotW;
    const y = plotY + plotH - ((Number(item.y) || 0) / maxY) * plotH;
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    const size = Math.max(0.12, Math.min(0.34, ((Number(item.value) || 0) / maxValue) * 0.28 + 0.1));

    slide.addShape('ellipse', {
      x: x - size / 2, y: y - size / 2, w: size, h: size,
      fill: { color },
    } as any);

    slide.addText(item.name ?? '', {
      x: x - 0.6, y: y - size / 2 - 0.22, w: 1.2, h: 0.18,
      fontSize: 8, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
    });
  });
}

function renderTheme04SlopeV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 10);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const maxRank = Math.max(1, ...items.map((item: any) => Math.max(Number(item.previous) || 0, Number(item.current) || 0)));
  const leftX = chartX + 1.2;
  const rightX = chartX + chartW - 1.2;
  const axisTop = chartY + 0.3;
  const axisBottom = chartY + chartH - 0.4;
  const axisH = axisBottom - axisTop;

  // Axes
  slide.addShape('line', {
    x1: leftX, y1: axisTop, x2: leftX, y2: axisBottom,
    line: { color: COLORS.border, width: 2 },
  } as any);
  slide.addShape('line', {
    x1: rightX, y1: axisTop, x2: rightX, y2: axisBottom,
    line: { color: COLORS.border, width: 2 },
  } as any);

  slide.addText(props.previousLabel || '前期', {
    x: leftX - 0.8, y: axisTop - 0.25, w: 1.6, h: 0.2,
    fontSize: 12, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
  });
  slide.addText(props.currentLabel || '当期', {
    x: rightX - 0.8, y: axisTop - 0.25, w: 1.6, h: 0.2,
    fontSize: 12, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
  });

  items.forEach((item: any) => {
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    const y1 = axisTop + ((Number(item.previous) - 1) / Math.max(1, maxRank - 1)) * axisH;
    const y2 = axisTop + ((Number(item.current) - 1) / Math.max(1, maxRank - 1)) * axisH;

    slide.addShape('line', {
      x1: leftX, y1, x2: rightX, y2,
      line: { color, width: 2.5 },
    } as any);

    slide.addShape('ellipse', {
      x: leftX - 0.08, y: y1 - 0.08, w: 0.16, h: 0.16,
      fill: { color },
    } as any);
    slide.addShape('ellipse', {
      x: rightX - 0.08, y: y2 - 0.08, w: 0.16, h: 0.16,
      fill: { color },
    } as any);

    slide.addText(`${item.name} (${item.current})`, {
      x: rightX + 0.15, y: y2 - 0.1, w: 1.8, h: 0.2,
      fontSize: 9, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
  });
}

function renderTheme04WaterfallV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 8);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const startValue = Number(props.startValue) || 0;
  const positiveColor = isLight ? '22A55C' : '3ADE80';
  const negativeColor = isLight ? 'DB2777' : 'FF6B9D';
  const totalColor = COLORS.secondary;

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const plotMargin = { top: 0.3, right: 0.25, bottom: 0.6, left: 0.8 };
  const plotX = chartX + plotMargin.left;
  const plotY = chartY + plotMargin.top;
  const plotW = chartW - plotMargin.left - plotMargin.right;
  const plotH = chartH - plotMargin.top - plotMargin.bottom;

  const values = items.map((item: any) => Number(item.value) || 0);
  const running = [startValue];
  values.forEach((v: number) => running.push(running[running.length - 1] + v));
  const endValue = running[running.length - 1];
  const maxValue = Math.max(startValue, endValue, ...running);
  const minValue = Math.min(0, startValue, endValue, ...running);
  const valueRange = Math.max(1, maxValue - minValue);

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = plotY + plotH - (i / 4) * plotH;
    slide.addShape('line', {
      x1: plotX, y1: y, x2: plotX + plotW, y2: y,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
    slide.addText(String(Math.round(minValue + (valueRange * i) / 4)), {
      x: chartX + 0.05, y: y - 0.08, w: 0.7, h: 0.16,
      fontSize: 8, color: COLORS.secondary, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const barCount = items.length + 1;
  const slotW = plotW / barCount;
  const barW = slotW * 0.55;

  // Start bar
  const startH = ((startValue - minValue) / valueRange) * plotH;
  slide.addShape('roundRect', {
    x: plotX + (slotW - barW) / 2, y: plotY + plotH - startH, w: barW, h: startH,
    fill: { color: totalColor }, rectRadius: 0.04,
  } as any);
  slide.addText(props.startLabel || '起点', {
    x: plotX, y: plotY + plotH + 0.08, w: slotW, h: 0.2,
    fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(String(startValue), {
    x: plotX + (slotW - barW) / 2, y: plotY + plotH - startH - 0.22, w: barW, h: 0.18,
    fontSize: 9, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
  });

  let current = startValue;
  items.forEach((item: any, idx: number) => {
    const value = Number(item.value) || 0;
    const prevY = plotY + plotH - ((current - minValue) / valueRange) * plotH;
    current += value;
    const nextY = plotY + plotH - ((current - minValue) / valueRange) * plotH;
    const barH = Math.abs(nextY - prevY);
    const y = Math.min(prevY, nextY);
    const color = value >= 0 ? positiveColor : negativeColor;
    const x = plotX + (idx + 1) * slotW + (slotW - barW) / 2;

    slide.addShape('roundRect', {
      x, y, w: barW, h: barH,
      fill: { color }, rectRadius: 0.04,
    } as any);

    slide.addText(item.label ?? '', {
      x: plotX + (idx + 1) * slotW, y: plotY + plotH + 0.08, w: slotW, h: 0.2,
      fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
    slide.addText(String(value > 0 ? `+${value}` : value), {
      x, y: y - 0.22, w: barW, h: 0.18,
      fontSize: 9, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
    });
  });

  // End total
  const endH = ((endValue - minValue) / valueRange) * plotH;
  slide.addShape('roundRect', {
    x: plotX + (barCount - 1) * slotW + (slotW - barW) / 2, y: plotY + plotH - endH, w: barW, h: endH,
    fill: { color: totalColor }, rectRadius: 0.04,
  } as any);
  slide.addText(props.endLabel || '合计', {
    x: plotX + (barCount - 1) * slotW, y: plotY + plotH + 0.08, w: slotW, h: 0.2,
    fontSize: 8, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });
  slide.addText(String(endValue), {
    x: plotX + (barCount - 1) * slotW + (slotW - barW) / 2, y: plotY + plotH - endH - 0.22, w: barW, h: 0.18,
    fontSize: 9, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
  });
}

function renderTheme04RegionV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 10);
  if (items.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const sorted = [...items].sort((a: any, b: any) => (Number(b.value) || 0) - (Number(a.value) || 0));
  const maxValue = Math.max(1, ...sorted.map((item: any) => Number(item.value) || 0));
  const rowH = chartH / sorted.length;
  const labelW = 1.4;
  const plotX = chartX + labelW + 0.2;
  const plotW = chartW - labelW - 1.2;

  sorted.forEach((item: any, idx: number) => {
    const y = chartY + idx * rowH;
    const value = Number(item.value) || 0;
    const barW = (value / maxValue) * plotW;
    const tone = item.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addText(item.name ?? '', {
      x: chartX + 0.15, y, w: labelW, h: rowH,
      fontSize: 11, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });

    slide.addShape('roundRect', {
      x: plotX, y: y + rowH * 0.22, w: Math.max(0.04, barW), h: rowH * 0.56,
      fill: { color }, rectRadius: 0.04,
    } as any);

    slide.addText(`${value} ${props.unit ?? ''}`, {
      x: plotX + barW + 0.08, y, w: 1.0, h: rowH,
      fontSize: 10, color: COLORS.secondary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
  });
}

function renderTheme04ValuechartV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const stages = (props.stages || []).slice(0, 4);
  if (stages.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  if (props.name) {
    slide.addShape('roundRect', {
      x: 4.0, y: 2.15, w: 2.0, h: 0.38,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.19,
    } as any);
    slide.addText(props.name, {
      x: 4.0, y: 2.15, w: 2.0, h: 0.38,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
  }

  const count = stages.length;
  const gap = 0.22;
  const cardW = (8.7 - (count - 1) * gap) / count;
  const cardH = 2.4;
  const startX = 0.65;
  const startY = 2.75;

  stages.forEach((stage: any, idx: number) => {
    const x = startX + idx * (cardW + gap);
    const y = startY;
    const tone = stage.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 1.5 },
      rectRadius: 0.12,
    } as any);

    slide.addText(stage.label ?? '', {
      x: x + 0.12, y: y + 0.18, w: cardW - 0.24, h: 0.28,
      fontSize: 11, color: COLORS.secondary, bold: true, fontFace: FONTS.body,
    });
    slide.addText(String(stage.value ?? ''), {
      x: x + 0.12, y: y + 0.55, w: cardW - 0.24, h: 0.7,
      fontSize: 30, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (stage.description) {
      slide.addText(stage.description, {
        x: x + 0.12, y: y + 1.35, w: cardW - 0.24, h: 0.85,
        fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }

    if (idx < count - 1) {
      slide.addShape('arrow', {
        x: x + cardW + 0.04, y: y + cardH / 2 - 0.1, w: 0.14, h: 0.2,
        fill: { color: COLORS.secondary },
      } as any);
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04FilmstripV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const images = (props.images || []).slice(0, 8);
  if (images.length === 0) return;

  const count = images.length;
  const gap = 0.16;
  const frameW = (8.7 - (count - 1) * gap) / count;
  const frameH = 2.8;
  const startX = 0.65;
  const startY = 2.5;

  images.forEach((item: any, idx: number) => {
    const x = startX + idx * (frameW + gap);
    const y = startY;

    slide.addShape('roundRect', {
      x, y, w: frameW, h: frameH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    } as any);

    const imgUrl = item.image || '';
    if (imgUrl && imgUrl.startsWith('data:')) {
      const tmpPath = dataUriToTempFile(imgUrl);
      if (tmpPath) {
        slide.addImage({ path: tmpPath, x: x + 0.08, y: y + 0.08, w: frameW - 0.16, h: frameH - 0.5 });
      }
    } else {
      slide.addShape('rect', {
        x: x + 0.08, y: y + 0.08, w: frameW - 0.16, h: frameH - 0.5,
        fill: { color: COLORS.surface },
      } as any);
    }

    if (item.caption) {
      slide.addText(item.caption, {
        x, y: y + frameH - 0.4, w: frameW, h: 0.3,
        fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    }
  });
}

function renderTheme04GroupbarsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.75,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.9, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const rawLabels = (props.labels || []).slice(0, 8);
  const labels = rawLabels.map((label: any) => (typeof label === 'string' ? label : label?.item) ?? '');
  const series = (props.series || []).slice(0, 4).map((s: any) => ({
    ...s,
    data: (s.data || []).map((d: any) => Number(typeof d === 'number' ? d : d?.item) || 0),
  }));
  if (labels.length === 0 || series.length === 0) return;

  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const plotMargin = { top: 0.25, right: 0.2, bottom: 0.55, left: 0.6 };
  const plotX = chartX + plotMargin.left;
  const plotY = chartY + plotMargin.top;
  const plotW = chartW - plotMargin.left - plotMargin.right;
  const plotH = chartH - plotMargin.top - plotMargin.bottom;

  const allValues = series.flatMap((s: any) => (s.data || []).slice(0, labels.length));
  const maxValue = Math.max(1, ...allValues.map((v: any) => Number(v) || 0));

  // Y axis grid lines
  for (let i = 0; i <= 4; i++) {
    const y = plotY + plotH - (i / 4) * plotH;
    slide.addShape('line', {
      x1: plotX, y1: y, x2: plotX + plotW, y2: y,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
    slide.addText(String(Math.round((maxValue * i) / 4)), {
      x: chartX + 0.05, y: y - 0.08, w: 0.5, h: 0.16,
      fontSize: 8, color: COLORS.secondary, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
  }

  // Bars
  const groupW = plotW / labels.length;
  const barGap = groupW * 0.15;
  const barW = (groupW - barGap) / series.length;

  labels.forEach((label: any, gidx: number) => {
    const groupX = plotX + gidx * groupW + barGap / 2;
    series.forEach((s: any, sidx: number) => {
      const value = Number((s.data || [])[gidx]) || 0;
      const h = (value / maxValue) * plotH;
      const x = groupX + sidx * barW;
      const y = plotY + plotH - h;
      const tone = s.tone || 'green';
      const color = toneColors[tone] ?? COLORS.accent;

      slide.addShape('roundRect', {
        x, y, w: barW * 0.85, h,
        fill: { color },
        rectRadius: 0.03,
      } as any);
    });

    slide.addText(label ?? '', {
      x: plotX + gidx * groupW, y: plotY + plotH + 0.06, w: groupW, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  });

  // Legend
  const legendY = chartY + chartH - 0.35;
  const legendItemW = 1.6;
  const totalLegendW = series.length * legendItemW;
  let legendX = chartX + (chartW - totalLegendW) / 2;
  series.forEach((s: any) => {
    const tone = s.tone || 'green';
    const color = toneColors[tone] ?? COLORS.accent;
    slide.addShape('roundRect', {
      x: legendX, y: legendY + 0.04, w: 0.12, h: 0.12,
      fill: { color }, rectRadius: 0.02,
    } as any);
    slide.addText(s.name ?? '', {
      x: legendX + 0.18, y: legendY, w: 1.4, h: 0.2,
      fontSize: 9, color: COLORS.secondary, valign: 'middle', fontFace: FONTS.body,
    });
  legendX += legendItemW;
  });
}

function renderTheme04DiptychV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 3.5, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 3.8, h: 1.1,
    fontSize: 32, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.25, w: 3.8, h: 0.6,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.statement) {
    slide.addShape('roundRect', {
      x: 0.65, y: 3.05, w: 3.8, h: 1.4,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(props.statement, {
      x: 0.85, y: 3.2, w: 3.4, h: 1.1,
      fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
  }

  const rightX = 4.8;
  const rightW = 4.55;
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, rightX, 0.9, rightW, 2.2);
  }

  const items = (props.items || []).slice(0, 4);
  if (items.length > 0) {
    const cols = items.length <= 2 ? 1 : 2;
    const rows = Math.ceil(items.length / cols);
    const cardW = (rightW - (cols - 1) * 0.15) / cols;
    const cardH = (2.4 - (rows - 1) * 0.15) / rows;
    items.forEach((item: any, idx: number) => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const x = rightX + c * (cardW + 0.15);
      const y = 3.25 + r * (cardH + 0.15);
      slide.addShape('roundRect', {
        x, y, w: cardW, h: cardH,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      if (item.label) {
        slide.addText(item.label, {
          x: x + 0.1, y: y + 0.1, w: cardW - 0.2, h: 0.22,
          fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
        });
      }
      if (item.description) {
        slide.addText(item.description, {
          x: x + 0.1, y: y + 0.34, w: cardW - 0.2, h: cardH - 0.45,
          fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }
}

function renderTheme04VoicesV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const voices = (props.voices || []).slice(0, 3);
  if (voices.length > 0) {
    const cardW = 2.7;
    const gap = 0.25;
    const totalW = voices.length * cardW + (voices.length - 1) * gap;
    let x = (10 - totalW) / 2;
    voices.forEach((voice: any) => {
      slide.addShape('roundRect', {
        x, y: 2.45, w: cardW, h: 2.45,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.12,
      } as any);
      if (voice.quote) {
        slide.addText(voice.quote, {
          x: x + 0.2, y: 2.7, w: cardW - 0.4, h: 1.45,
          fontSize: 15, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
        });
      }
      if (voice.author) {
        slide.addText(voice.author, {
          x: x + 0.2, y: 4.25, w: cardW - 0.4, h: 0.22,
          fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
        });
      }
      if (voice.role) {
        slide.addText(voice.role, {
          x: x + 0.2, y: 4.48, w: cardW - 0.4, h: 0.2,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
        });
      }
      x += cardW + gap;
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.15, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04AnnotatedV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const imgX = 0.65;
  const imgY = 2.35;
  const imgW = 8.7;
  const imgH = 2.75;
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, imgX, imgY, imgW, imgH);
  } else {
    slide.addShape('roundRect', {
      x: imgX, y: imgY, w: imgW, h: imgH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
  }

  const annotations = (props.annotations || []).slice(0, 5);
  annotations.forEach((a: any, idx: number) => {
    const x = imgX + ((a.x ?? 50) / 100) * imgW;
    const y = imgY + ((a.y ?? 50) / 100) * imgH;
    slide.addShape('ellipse', {
      x: x - 0.1, y: y - 0.1, w: 0.2, h: 0.2,
      fill: { color: COLORS.accent },
    } as any);
    const labelY = idx % 2 === 0 ? y - 0.55 : y + 0.2;
    slide.addShape('roundRect', {
      x: x - 0.65, y: labelY, w: 1.3, h: 0.42,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.06,
    } as any);
    const text = a.label && a.description ? `${a.label} · ${a.description}` : (a.description || a.label || '');
    slide.addText(text, {
      x: x - 0.6, y: labelY + 0.05, w: 1.2, h: 0.32,
      fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ImagestoryV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps || []).slice(0, 4);
  if (steps.length > 0) {
    const cardW = 2.0;
    const gap = 0.28;
    const totalW = steps.length * cardW + (steps.length - 1) * gap;
    let x = (10 - totalW) / 2;
    steps.forEach((step: any, idx: number) => {
      slide.addShape('roundRect', {
        x, y: 2.45, w: cardW, h: 2.55,
        fill: { color: COLORS.surfaceElevated },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      } as any);
      if (step.image) {
        addImageMaybe(slide, step.image, x + 0.12, 2.6, cardW - 0.24, 1.35);
      }
      if (step.label) {
        slide.addText(step.label, {
          x: x + 0.12, y: 4.05, w: cardW - 0.24, h: 0.2,
          fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
        });
      }
      if (step.caption) {
        slide.addText(step.caption, {
          x: x + 0.12, y: 4.28, w: cardW - 0.24, h: 0.55,
          fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
      if (idx < steps.length - 1) {
        slide.addShape('arrow', {
          x: x + cardW + 0.04, y: 3.65, w: gap - 0.08, h: 0.14,
          fill: { color: COLORS.accent },
        } as any);
      }
      x += cardW + gap;
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.2, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04DumbbellV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 8);
  if (items.length === 0) return;

  const chartX = 0.65;
  const chartY = 2.4;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const plotX = chartX + 1.6;
  const plotY = chartY + 0.25;
  const plotW = chartW - 1.9;
  const plotH = chartH - 0.55;
  const allEnds = items.map((i: any) => Number(i.end) || 0);
  const maxValue = Math.max(1, ...allEnds) * 1.05;

  for (let i = 0; i <= 4; i++) {
    const y = plotY + plotH - (i / 4) * plotH;
    slide.addShape('line', {
      x1: plotX, y1: y, x2: plotX + plotW, y2: y,
      line: { color: COLORS.border, width: 0.5, dash: 'dash' },
    } as any);
    slide.addText(String(Math.round((maxValue * i) / 4)), {
      x: chartX + 0.1, y: y - 0.08, w: 1.4, h: 0.16,
      fontSize: 8, color: COLORS.secondary, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const rowH = plotH / items.length;
  const barH = rowH * 0.45;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  items.forEach((item: any, idx: number) => {
    const start = Number(item.start) || 0;
    const end = Number(item.end) || 0;
    const y = plotY + idx * rowH + (rowH - barH) / 2;
    const startW = (start / maxValue) * plotW;
    const endW = (end / maxValue) * plotW;
    const color = toneColors[item.tone || 'green'] ?? COLORS.accent;

    slide.addText(item.name ?? '', {
      x: chartX + 0.1, y, w: 1.4, h: barH,
      fontSize: 10, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });

    slide.addShape('roundRect', {
      x: plotX, y, w: startW, h: barH,
      fill: { color: COLORS.secondary },
      rectRadius: 0.03,
    } as any);
    if (endW > startW) {
      slide.addShape('roundRect', {
        x: plotX + startW, y, w: endW - startW, h: barH,
        fill: { color },
        rectRadius: [0, 0.03, 0.03, 0],
      } as any);
    }
    slide.addText(String(end), {
      x: plotX + endW + 0.06, y, w: 0.8, h: barH,
      fontSize: 10, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.heading,
    });
  });

  const legendY = chartY + chartH - 0.32;
  const legendItems = [props.startLabel || '起点', props.endLabel || '终点'];
  const legendColors = [COLORS.secondary, COLORS.accent];
  let legendX = chartX + (chartW - 2.4) / 2;
  legendItems.forEach((label: string, idx: number) => {
    slide.addShape('roundRect', {
      x: legendX, y: legendY + 0.04, w: 0.12, h: 0.12,
      fill: { color: legendColors[idx] }, rectRadius: 0.02,
    } as any);
    slide.addText(label, {
      x: legendX + 0.18, y: legendY, w: 0.9, h: 0.2,
      fontSize: 9, color: COLORS.secondary, valign: 'middle', fontFace: FONTS.body,
    });
    legendX += 1.2;
  });
}

function renderTheme04PyramidV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 6);
  if (items.length === 0) return;

  const chartX = 0.65;
  const chartY = 2.4;
  const chartW = 8.7;
  const chartH = 2.85;

  slide.addShape('roundRect', {
    x: chartX, y: chartY, w: chartW, h: chartH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  const maxValue = Math.max(1, ...items.map((i: any) => Number(i.value) || 0));
  const rowH = chartH / items.length;
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  items.forEach((item: any, idx: number) => {
    const value = Number(item.value) || 0;
    const ratio = value / maxValue;
    const y = chartY + idx * rowH + rowH * 0.1;
    const h = rowH * 0.8;
    const w = Math.max(0.6, chartW * 0.85 * ratio);
    const x = chartX + (chartW - w) / 2;
    const color = toneColors[item.tone || 'green'] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y, w, h,
      fill: { color },
      rectRadius: 0.06,
    } as any);
    slide.addText(`${item.label ?? ''} · ${value} ${props.unit ?? ''}`, {
      x, y, w, h,
      fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
    });
  });
}

function renderTheme04RiskchainV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const risks = (props.risks || []).slice(0, 6);
  if (risks.length === 0) return;

  const gap = 0.12;
  const cardW = (8.7 - gap * (risks.length - 1)) / risks.length;
  const y = 2.55;
  const h = 2.25;
  const impactColors: Record<string, string> = {
    high: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    medium: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
    low: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
  };
  const impactLabels: Record<string, string> = { high: '高风险', medium: '中风险', low: '低风险' };

  risks.forEach((risk: any, idx: number) => {
    const x = 0.65 + idx * (cardW + gap);
    slide.addShape('roundRect', {
      x, y, w: cardW, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + 0.12, y: y + 0.14, w: 0.34, h: 0.26,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });

    const impact = risk.impact || 'medium';
    const impactColor = impactColors[impact] ?? COLORS.accent;
    slide.addShape('roundRect', {
      x: x + cardW - 0.82, y: y + 0.14, w: 0.7, h: 0.24,
      fill: { color: impactColor }, rectRadius: 0.12,
    } as any);
    slide.addText(impactLabels[impact] ?? '', {
      x: x + cardW - 0.82, y: y + 0.14, w: 0.7, h: 0.24,
      fontSize: 8, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });

    slide.addText(risk.label ?? '', {
      x: x + 0.12, y: y + 0.54, w: cardW - 0.24, h: 0.42,
      fontSize: 13, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (risk.description) {
      slide.addText(risk.description, {
        x: x + 0.12, y: y + 0.98, w: cardW - 0.24, h: 0.9,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }

    if (idx < risks.length - 1) {
      const arrowX = x + cardW + gap / 2 - 0.1;
      slide.addShape('triangle', {
        x: arrowX, y: y + h / 2 - 0.12, w: 0.2, h: 0.24,
        fill: { color: COLORS.accent },
      } as any);
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.2, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04MetroV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const stops = (props.stops || []).slice(0, 6);
  if (stops.length === 0) return;

  const trackY = 3.15;
  const trackH = 0.12;
  slide.addShape('roundRect', {
    x: 0.65, y: trackY, w: 8.7, h: trackH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.06,
  } as any);

  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  const stepX = 8.7 / (stops.length > 1 ? stops.length - 1 : 1);
  stops.forEach((stop: any, idx: number) => {
    const x = 0.65 + (stops.length > 1 ? idx * stepX : 8.7 / 2);
    const color = toneColors[stop.tone || 'green'] ?? COLORS.accent;

    slide.addShape('ellipse', {
      x: x - 0.14, y: trackY + trackH / 2 - 0.14, w: 0.28, h: 0.28,
      fill: { color },
      line: { color: COLORS.white, width: 2 },
    } as any);

    const cardY = idx % 2 === 0 ? trackY - 1.35 : trackY + trackH + 0.2;
    slide.addShape('roundRect', {
      x: x - 0.85, y: cardY, w: 1.7, h: 1.1,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.1,
    } as any);
    slide.addText(stop.label ?? '', {
      x: x - 0.78, y: cardY + 0.12, w: 1.56, h: 0.32,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
    });
    if (stop.description) {
      slide.addText(stop.description, {
        x: x - 0.78, y: cardY + 0.46, w: 1.56, h: 0.55,
        fontSize: 9, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  if (props.lineLabel) {
    slide.addShape('roundRect', {
      x: 4.5, y: trackY - 0.22, w: 1.0, h: 0.24,
      fill: { color: COLORS.accent }, rectRadius: 0.12,
    } as any);
    slide.addText(props.lineLabel, {
      x: 4.5, y: trackY - 0.22, w: 1.0, h: 0.24,
      fontSize: 8, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.2, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ShowcaseV1(slide: PptxSlide, props: any): void {
  addTheme04Background(slide);

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 40, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const imgX = 0.65;
  const imgY = 2.35;
  const imgW = 8.7;
  const imgH = 2.75;

  slide.addShape('roundRect', {
    x: imgX, y: imgY, w: imgW, h: imgH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.16,
  } as any);

  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, imgX + 0.08, imgY + 0.08, imgW - 0.16, imgH - 0.16);
  }

  if (props.caption) {
    slide.addShape('roundRect', {
      x: imgX + 0.2, y: imgY + imgH - 0.62, w: imgW - 0.4, h: 0.42,
      fill: { color: '000000' },
      rectRadius: 0.08,
    } as any);
    slide.addText(props.caption, {
      x: imgX + 0.25, y: imgY + imgH - 0.6, w: imgW - 0.5, h: 0.38,
      fontSize: 11, color: COLORS.white, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CoverHeroV1(slide: PptxSlide, props: any): void {
  const isLight = COLORS.white === 'FAFAF8';
  const overlayColor = isLight ? 'FFFFFF' : '000000';
  const textColor = isLight ? COLORS.primary : 'FFFFFF';

  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  } else {
    slide.addShape('rect', {
      x: 0, y: 0, w: 10, h: 5.625,
      fill: { color: COLORS.surface },
    } as any);
  }

  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: overlayColor, transparency: isLight ? 65 : 55 },
  } as any);

  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fill: { color: COLORS.accent }, rectRadius: 0.16,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.7, w: 2.0, h: 0.32,
      fontSize: 11, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 6.5, y: 0.78, w: 2.85, h: 0.25,
      fontSize: 10, color: textColor, align: 'right', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.75, y: 2.0, w: 8.5, h: 1.2,
    fontSize: 50, color: textColor, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.25, y: 3.2, w: 7.5, h: 0.6,
      fontSize: 18, color: textColor, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
  if (props.caption) {
    slide.addShape('roundRect', {
      x: 3.25, y: 4.05, w: 3.5, h: 0.36,
      fill: { color: overlayColor, transparency: 40 }, rectRadius: 0.08,
    } as any);
    slide.addText(props.caption, {
      x: 3.25, y: 4.05, w: 3.5, h: 0.36,
      fontSize: 11, color: textColor, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.25, w: 8.7, h: 0.2,
      fontSize: 9, color: textColor, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04CalendarV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.55,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const events = (props.events || []).filter((e: any) => e && e.month >= 1 && e.month <= 12);
  const eventMap = new Map<number, any>();
  events.forEach((e: any) => eventMap.set(e.month, e));

  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  const gridX = 0.65;
  const gridY = 1.95;
  const gridW = 8.7;
  const gridH = 2.9;
  const cols = 4;
  const rows = 3;
  const cellW = gridW / cols;
  const cellH = gridH / rows;

  for (let month = 1; month <= 12; month++) {
    const col = (month - 1) % cols;
    const row = Math.floor((month - 1) / cols);
    const x = gridX + col * cellW + 0.03;
    const y = gridY + row * cellH + 0.03;
    const w = cellW - 0.06;
    const h = cellH - 0.06;
    const event = eventMap.get(month);
    const borderColor = event ? (toneColors[event.tone ?? 'green'] ?? COLORS.accent) : COLORS.border;

    slide.addShape('roundRect', {
      x, y, w, h,
      fill: { color: COLORS.surfaceElevated },
      line: { color: borderColor, width: 1.5 },
      rectRadius: 0.08,
    } as any);

    slide.addText(MONTH_NAMES[month - 1], {
      x: x + 0.08, y: y + 0.06, w: w * 0.5, h: 0.2,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });
    if (props.year) {
      slide.addText(String(props.year), {
        x: x + w - 0.55, y: y + 0.06, w: 0.5, h: 0.2,
        fontSize: 9, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
      });
    }

    if (event) {
      slide.addText(event.label ?? '', {
        x: x + 0.08, y: y + 0.32, w: w - 0.16, h: 0.42,
        fontSize: 11, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
      });
      if (event.value) {
        slide.addText(String(event.value), {
          x: x + 0.08, y: y + h - 0.32, w: w - 0.16, h: 0.2,
          fontSize: 10, color: toneColors[event.tone ?? 'green'] ?? COLORS.accent, bold: true, fontFace: FONTS.mono,
        });
      }
    } else {
      slide.addText('—', {
        x: x, y: y + h * 0.45, w, h: 0.2,
        fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.05, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ChainflowV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.55,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps || []).slice(0, 6);
  if (steps.length === 0) return;

  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  const trackY = 2.25;
  const trackH = 2.2;
  const totalW = 8.7;
  const arrowW = 0.22;
  const stepW = (totalW - (steps.length - 1) * arrowW) / steps.length;

  steps.forEach((step: any, idx: number) => {
    const x = 0.65 + idx * (stepW + arrowW);
    const color = toneColors[step.tone ?? 'green'] ?? COLORS.accent;

    slide.addShape('roundRect', {
      x, y: trackY, w: stepW, h: trackH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 2 },
      rectRadius: 0.12,
    } as any);

    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: x + stepW - 0.55, y: trackY + 0.08, w: 0.5, h: 0.3,
      fontSize: 20, color: COLORS.secondary, align: 'right', bold: true, fontFace: FONTS.mono,
    });
    slide.addText(step.label ?? '', {
      x: x + 0.1, y: trackY + 0.15, w: stepW - 0.2, h: 0.4,
      fontSize: 14, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (step.description) {
      slide.addText(step.description, {
        x: x + 0.1, y: trackY + 0.58, w: stepW - 0.2, h: 1.4,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }

    if (idx < steps.length - 1) {
      slide.addText('>', {
        x: x + stepW, y: trackY + trackH / 2 - 0.12, w: arrowW, h: 0.24,
        fontSize: 18, color: COLORS.accent, align: 'center', valign: 'middle', bold: true, fontFace: FONTS.heading,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.05, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04ChaintableV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.55,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const tiers = (props.tiers || []).slice(0, 6);
  if (tiers.length === 0) return;

  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  const cardY = 1.95;
  const gap = 0.12;
  const cardH = (3.0 - (tiers.length - 1) * gap) / tiers.length;

  tiers.forEach((tier: any, idx: number) => {
    const y = cardY + idx * (cardH + gap);
    const color = toneColors[tier.tone ?? 'green'] ?? COLORS.accent;
    const items = (tier.items || []).slice(0, 6).map((it: any) => (typeof it === 'string' ? it : it?.value ?? '')).filter(Boolean);

    slide.addShape('roundRect', {
      x: 0.65, y, w: 8.7, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color, width: 1.5 },
      rectRadius: 0.1,
    } as any);

    slide.addShape('roundRect', {
      x: 0.65, y, w: 0.08, h: cardH,
      fill: { color }, rectRadius: 0.04,
    } as any);

    slide.addText(tier.layer ?? '', {
      x: 0.85, y: y + 0.08, w: 4.5, h: 0.3,
      fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    if (tier.value) {
      slide.addText(String(tier.value), {
        x: 5.5, y: y + 0.08, w: 3.6, h: 0.3,
        fontSize: 14, color, bold: true, align: 'right', fontFace: FONTS.mono,
      });
    }
    if (items.length > 0) {
      slide.addText(items.join(' · '), {
        x: 0.85, y: y + 0.42, w: 8.2, h: cardH - 0.52,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.15, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04LedgerV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.55,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const investors = (props.investors || []).slice(0, 8);
  if (investors.length === 0) return;

  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };
  const trendIcons: Record<string, string> = { up: '↑', down: '↓', flat: '→' };
  const trendColors: Record<string, string> = { up: COLORS.accent, down: 'FF6B9D', flat: COLORS.secondary };

  const tableY = 1.95;
  const rowH = 0.36;
  const gap = 0.08;

  slide.addShape('roundRect', {
    x: 0.65, y: tableY, w: 8.7, h: investors.length * (rowH + gap) - gap + 0.2,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);

  investors.forEach((inv: any, idx: number) => {
    const y = tableY + 0.1 + idx * (rowH + gap);
    const rank = inv.rank || String(idx + 1).padStart(2, '0');
    const color = toneColors[inv.tone ?? 'green'] ?? COLORS.accent;

    slide.addShape('ellipse', {
      x: 0.85, y: y + 0.02, w: 0.32, h: 0.32,
      fill: { color },
    } as any);
    slide.addText(String(rank), {
      x: 0.85, y: y + 0.02, w: 0.32, h: 0.32,
      fontSize: 10, color: COLORS.white, align: 'center', valign: 'middle', bold: true, fontFace: FONTS.mono,
    });

    slide.addText(inv.name ?? '', {
      x: 1.35, y: y + 0.04, w: 3.6, h: 0.28,
      fontSize: 12, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText(inv.deals ?? '', {
      x: 5.1, y: y + 0.04, w: 1.2, h: 0.28,
      fontSize: 11, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText(inv.amount ?? '', {
      x: 6.4, y: y + 0.04, w: 1.3, h: 0.28,
      fontSize: 11, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
    });

    const trend = inv.trend ?? 'flat';
    slide.addText(trendIcons[trend] ?? '→', {
      x: 7.95, y: y + 0.04, w: 0.3, h: 0.28,
      fontSize: 16, color: trendColors[trend] ?? COLORS.secondary, align: 'center', valign: 'middle', bold: true, fontFace: FONTS.heading,
    });
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.15, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04MonthchartV1(slide: PptxSlide, props: any): void {
  const tagText = [props.kicker, props.topRightMeta].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.65, w: 2.2, h: 0.3,
      fill: { color: COLORS.accent }, rectRadius: 0.15,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.65, w: 2.2, h: 0.3,
      fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.1, w: 8.7, h: 0.55,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels || []).slice(0, 12).map((l: any) => (typeof l === 'string' ? l : l?.item) ?? '');
  const data = (props.data || []).slice(0, 12).map((d: any) => (typeof d === 'number' ? d : Number(d?.item) || 0));
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const chartW = hasInsight ? 5.7 : 8.7;

  if (labels.length > 0 && data.length > 0) {
    const chartType = props.type === 'line' ? 'line' : 'bar';
    slide.addChart(chartType as 'bar' | 'line', [{
      name: props.title || '',
      labels,
      values: data,
    }], {
      x: 0.65, y: 2.05, w: chartW, h: 3.0,
      chartColors: [COLORS.accent],
      showValue: true,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 9,
    } as any);
  } else {
    slide.addText('（暂无图表数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasInsight) {
    const insight = props.insight;
    slide.addShape('roundRect', {
      x: 6.55, y: 2.05, w: 2.8, h: 3.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    let cursorY = 2.25;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.75, y: cursorY, w: 2.4, h: 0.55,
        fontSize: 32, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.58;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.75, y: cursorY, w: 2.4, h: 0.25,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
      cursorY += 0.32;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: 6.75, y: cursorY, w: 2.4, h: 2.9 - cursorY + 2.05,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  }
}

function renderTheme04QuartertableV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.55,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const columns = (props.columns ?? ['季度', '事件数', '单笔均值', '核心指标', '环比变化']).slice(0, 5);
  const rows = (props.rows || []).slice(0, 8);
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  const tableY = 1.95;
  const rowH = 0.34;
  const colX = [0.75, 2.1, 3.55, 5.0, 6.45];
  const colW = [1.2, 1.3, 1.3, 1.3, 2.6];
  const tableH = 0.45 + rows.length * rowH + (props.summary ? rowH : 0);

  slide.addShape('roundRect', {
    x: 0.65, y: tableY, w: 8.7, h: tableH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);

  columns.forEach((col: string, idx: number) => {
    slide.addText(col, {
      x: colX[idx], y: tableY + 0.08, w: colW[idx], h: 0.25,
      fontSize: 10, color: COLORS.secondary, bold: true, fontFace: FONTS.mono,
    });
  });

  rows.forEach((row: any, idx: number) => {
    const y = tableY + 0.42 + idx * rowH;
    const values = [row.quarter ?? '', row.metric1 ?? '', row.metric2 ?? '', row.metric3 ?? ''];
    values.forEach((val: string, cidx: number) => {
      const align = cidx === 0 ? 'left' : 'right';
      slide.addText(val, {
        x: colX[cidx], y: y + 0.04, w: colW[cidx], h: 0.24,
        fontSize: 11, color: COLORS.primary, bold: cidx === 0, align, valign: 'middle', fontFace: cidx === 0 ? FONTS.body : FONTS.mono,
      });
    });

    if (row.change) {
      const color = toneColors[row.tone ?? 'green'] ?? COLORS.accent;
      slide.addShape('roundRect', {
        x: colX[4] + colW[4] - 0.85, y: y + 0.02, w: 0.8, h: 0.26,
        fill: { color }, rectRadius: 0.08,
      } as any);
      slide.addText(String(row.change), {
        x: colX[4] + colW[4] - 0.85, y: y + 0.02, w: 0.8, h: 0.26,
        fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
    }
  });

  if (props.summary) {
    const y = tableY + 0.42 + rows.length * rowH;
    slide.addText(props.summary.label ?? '', {
      x: colX[0], y: y + 0.06, w: 2.6, h: 0.24,
      fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(props.summary.value ?? '', {
      x: colX[4] + colW[4] - 2.4, y: y + 0.06, w: 2.4, h: 0.24,
      fontSize: 12, color: COLORS.accent, bold: true, align: 'right', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04SpreadV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.65, w: 8.7, h: 0.2,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.0, w: 8.7, h: 0.55,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 10);
  if (items.length === 0) return;

  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: COLORS.white === 'FAFAF8' ? 'DB2777' : 'FF6B9D',
    blue: COLORS.white === 'FAFAF8' ? '0D9488' : '4ECDC4',
    yellow: COLORS.white === 'FAFAF8' ? 'D97706' : 'FFD166',
  };

  const chartY = 2.0;
  const rowH = 0.32;
  const labelW = 1.35;
  const plotX = 2.15;
  const plotW = 6.0;
  const center = plotX + plotW / 2;
  const maxValue = Math.max(1, ...items.map((it: any) => Math.abs(Number(it.value) || 0)));

  slide.addShape('line', {
    x1: center, y1: chartY, x2: center, y2: chartY + items.length * rowH,
    line: { color: COLORS.border, width: 1, dash: 'dash' },
  } as any);

  items.forEach((it: any, idx: number) => {
    const y = chartY + idx * rowH;
    const value = Number(it.value) || 0;
    const abs = Math.abs(value);
    const barLen = (abs / maxValue) * (plotW / 2);
    const color = toneColors[it.tone ?? 'green'] ?? COLORS.accent;

    slide.addText(it.label ?? '', {
      x: 0.65, y: y + 0.02, w: labelW, h: 0.24,
      fontSize: 11, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.body,
    });

    if (value >= 0) {
      slide.addShape('roundRect', {
        x: center + 0.04, y: y + 0.04, w: Math.max(barLen, 0.02), h: 0.18,
        fill: { color }, rectRadius: 0.03,
      } as any);
      slide.addText(`${value} ${props.unit ?? ''}`, {
        x: center + barLen + 0.1, y: y + 0.02, w: 1.5, h: 0.24,
        fontSize: 10, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.mono,
      });
    } else {
      slide.addShape('roundRect', {
        x: center - barLen - 0.04, y: y + 0.04, w: Math.max(barLen, 0.02), h: 0.18,
        fill: { color }, rectRadius: 0.03,
      } as any);
      slide.addText(`${value} ${props.unit ?? ''}`, {
        x: center - barLen - 1.6, y: y + 0.02, w: 1.5, h: 0.24,
        fontSize: 10, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
      });
    }
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.1, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme04StackedV1(slide: PptxSlide, props: any): void {
  const tagText = [props.kicker, props.topRightMeta].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.65, w: 2.2, h: 0.3,
      fill: { color: COLORS.accent }, rectRadius: 0.15,
    } as any);
    slide.addText(tagText, {
      x: 0.65, y: 0.65, w: 2.2, h: 0.3,
      fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }

  slide.addText(renderTheme04Title(props.title ?? ''), {
    x: 0.65, y: 1.1, w: 8.7, h: 0.55,
    fontSize: 36, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.25,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const rawLabels = (props.labels || []).slice(0, 8);
  const labels = rawLabels.map((l: any) => (typeof l === 'string' ? l : l?.item) ?? '');
  const rawSeries = (props.series || []).slice(0, 4);
  const series = rawSeries.map((s: any) => ({
    name: s.name ?? '',
    labels,
    values: (s.data || []).slice(0, labels.length).map((d: any) => Number(typeof d === 'number' ? d : d?.item) || 0),
  }));

  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const chartW = hasInsight ? 5.7 : 8.7;
  const isLight = COLORS.white === 'FAFAF8';
  const toneColors: Record<string, string> = {
    green: COLORS.accent,
    pink: isLight ? 'DB2777' : 'FF6B9D',
    blue: isLight ? '0D9488' : '4ECDC4',
    yellow: isLight ? 'D97706' : 'FFD166',
  };

  if (labels.length > 0 && series.length > 0) {
    slide.addChart('bar' as 'bar', series, {
      x: 0.65, y: 2.05, w: chartW, h: 3.0,
      chartColors: rawSeries.map((s: any) => toneColors[s.tone ?? 'green'] ?? COLORS.accent),
      barGrouping: 'stacked',
      barDir: 'col',
      showValue: false,
    } as any);
  } else {
    slide.addText('（暂无图表数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasInsight) {
    const insight = props.insight;
    slide.addShape('roundRect', {
      x: 6.55, y: 2.05, w: 2.8, h: 3.0,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    let cursorY = 2.25;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.75, y: cursorY, w: 2.4, h: 0.55,
        fontSize: 32, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      cursorY += 0.58;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.75, y: cursorY, w: 2.4, h: 0.25,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
      cursorY += 0.32;
    }
    if (insight.description) {
      slide.addText(insight.description, {
        x: 6.75, y: cursorY, w: 2.4, h: 2.9 - cursorY + 2.05,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }
  }
}

type PptxRenderFn = (slide: PptxSlide, props: unknown) => void;

export function registerTheme04Renderers(registerPptxLayoutRenderer: (id: string, fn: PptxRenderFn) => void): void {
  registerPptxLayoutRenderer('theme04_cover_v1', renderTheme04CoverV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_chapter_v1', renderTheme04ChapterV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_content_v1', renderTheme04ContentV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_metric_v1', renderTheme04MetricV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_chart_v1', renderTheme04ChartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_quote_v1', renderTheme04QuoteV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_image_v1', renderTheme04ImageV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_closing_v1', renderTheme04ClosingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_table_of_contents_v1', renderTheme04TableOfContentsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_feature_v1', renderTheme04FeatureV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_bento_v1', renderTheme04BentoV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_team_v1', renderTheme04TeamV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_chart_donut', renderTheme04ChartDonut as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_metric_big', renderTheme04MetricBig as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_process_v1', renderTheme04ProcessV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_gallery_v1', renderTheme04GalleryV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_stats_v1', renderTheme04StatsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_comparison_v1', renderTheme04ComparisonV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_table_v1', renderTheme04TableV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_timeline_v1', renderTheme04TimelineV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_roadmap_v1', renderTheme04RoadmapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_ranking_v1', renderTheme04RankingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_case_v1', renderTheme04CaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_quadrant_v1', renderTheme04QuadrantV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_agenda_v1', renderTheme04AgendaV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_cover_index_v1', renderTheme04CoverIndexV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_chapter_v2', renderTheme04ChapterV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_image_quote_v1', renderTheme04ImageQuoteV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_editorial_v1', renderTheme04EditorialV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_triptych_v1', renderTheme04TriptychV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_gantt_v1', renderTheme04GanttV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_radar_v1', renderTheme04RadarV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_heatmap_v1', renderTheme04HeatmapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_cover_ghost_v1', renderTheme04CoverGhostV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_cards_v1', renderTheme04CardsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_gauges_v1', renderTheme04GaugesV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_cover_bento_v1', renderTheme04CoverBentoV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_cover_magazine_v1', renderTheme04CoverMagazineV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_chapter_split_v1', renderTheme04ChapterSplitV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_chapter_numbered_v1', renderTheme04ChapterNumberedV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_delta_v1', renderTheme04DeltaV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_versus_v1', renderTheme04VersusV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_trio_v1', renderTheme04TrioV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_polaroid_v1', renderTheme04PolaroidV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_verdict_v1', renderTheme04VerdictV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_treemap_v1', renderTheme04TreemapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_scoreboard_v1', renderTheme04ScoreboardV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_scorecards_v1', renderTheme04ScorecardsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_matrix_v1', renderTheme04MatrixV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_layers_v1', renderTheme04LayersV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_groupbars_v1', renderTheme04GroupbarsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_scatter_v1', renderTheme04ScatterV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_slope_v1', renderTheme04SlopeV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_waterfall_v1', renderTheme04WaterfallV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_region_v1', renderTheme04RegionV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_valuechart_v1', renderTheme04ValuechartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_filmstrip_v1', renderTheme04FilmstripV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_diptych_v1', renderTheme04DiptychV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_voices_v1', renderTheme04VoicesV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_annotated_v1', renderTheme04AnnotatedV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_imagestory_v1', renderTheme04ImagestoryV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_dumbbell_v1', renderTheme04DumbbellV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_pyramid_v1', renderTheme04PyramidV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_riskchain_v1', renderTheme04RiskchainV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_metro_v1', renderTheme04MetroV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_showcase_v1', renderTheme04ShowcaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_calendar_v1', renderTheme04CalendarV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_chainflow_v1', renderTheme04ChainflowV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_chaintable_v1', renderTheme04ChaintableV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_cover_hero_v1', renderTheme04CoverHeroV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_ledger_v1', renderTheme04LedgerV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_monthchart_v1', renderTheme04MonthchartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_quartertable_v1', renderTheme04QuartertableV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_spread_v1', renderTheme04SpreadV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme04_stacked_v1', renderTheme04StackedV1 as PptxRenderFn);
}
