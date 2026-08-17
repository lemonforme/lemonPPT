// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme05 PPTX 版式专属渲染器（从 export-pptx.ts 抽出）。
// 共享基础设施（全局 helper + 通用渲染器 + 类型 + theme05 局部 helper/const）从 export-pptx.ts 导入；
// theme01 通用渲染器从 theme01-pptx.ts 复用；其他已抽出主题的渲染器从各自 theme<K>-pptx.ts 复用。
// 注册通过 registerTheme05Renderers 回调注入。

import { type Slide as PptxSlide } from 'pptxgenjs';
import { COLORS, FONTS, addTheme05Card, addTheme05SpectrumBar, CHART_COLORS, addImageMaybe, theme05SchemeColor, addTheme05Pill, addTheme05ConclusionCard, layoutTreemap } from './export-pptx.js';

function renderTheme05CoverV1(slide: PptxSlide, props: any): void {
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

  const metrics = (props.metrics || []).slice(0, 4);
  if (metrics.length > 0) {
    const cardW = 2.05;
    const startX = 7.05;
    metrics.forEach((m: any, idx: number) => {
      const y = 0.9 + idx * 1.05;
      addTheme05Card(slide, startX, y, cardW, 0.9, !!m.accent);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x: startX + 0.12, y: y + 0.12, w: cardW - 0.24, h: 0.4,
        fontSize: 26, color: m.accent ? COLORS.white : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x: startX + 0.12, y: y + 0.52, w: cardW - 0.24, h: 0.22,
        fontSize: 10, color: m.accent ? 'FFFFFF' : COLORS.secondary, fontFace: FONTS.body,
      });
    });
  }

  addTheme05SpectrumBar(slide);

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme05ChapterV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.number ?? '', {
    x: 0.65, y: 1.6, w: 8.7, h: 1.4,
    fontSize: 110, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(props.title ?? '', {
    x: 0.65, y: 3.1, w: 8.7, h: 0.9,
    fontSize: 44, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 4.05, w: 8.7, h: 0.5,
      fontSize: 16, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme05SpectrumBar(slide);
}

function renderTheme05ContentV1(slide: PptxSlide, props: any): void {
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
    addTheme05Card(slide, 5.05, y, 4.1, 0.85, true);
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

  addTheme05SpectrumBar(slide);
}

function renderTheme05MetricV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title ?? '', {
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

  const metrics = (props.metrics || []).slice(0, 4);
  if (metrics.length > 0) {
    const cardW = 2.05;
    const gap = 0.18;
    const startX = 0.65;
    metrics.forEach((m: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      const y = 4.05;
      addTheme05Card(slide, x, y, cardW, 1.1, !!m.accent);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: y + 0.15, w: cardW, h: 0.45,
        fontSize: 28, color: m.accent ? COLORS.white : COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x, y: y + 0.62, w: cardW, h: 0.25,
        fontSize: 10, color: m.accent ? 'FFFFFF' : COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ChartV1(slide: PptxSlide, props: any): void {
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
    addTheme05Card(slide, 6.45, 2.25, 2.9, 0.7);
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
    addTheme05Card(slide, 6.45, panelY, 2.9, panelH, true);
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

  addTheme05SpectrumBar(slide);
}

function renderTheme05RankV1(slide: PptxSlide, props: any): void {
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
  if (rows.length > 0) {
    const rowH = 0.48;
    const startY = 2.35;
    rows.forEach((row: any, idx: number) => {
      const y = startY + idx * (rowH + 0.1);
      const rankColor = idx === 0 ? COLORS.accent : COLORS.surfaceElevated;
      slide.addShape('roundRect', {
        x: 0.65, y, w: 0.5, h: rowH,
        fill: { color: rankColor },
        rectRadius: 0.06,
      } as any);
      slide.addText(String(row.rank ?? idx + 1), {
        x: 0.65, y, w: 0.5, h: rowH,
        fontSize: 14, color: idx === 0 ? COLORS.white : COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
      });
      slide.addText(row.name ?? '', {
        x: 1.3, y, w: 4.0, h: rowH,
        fontSize: 15, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
      });
      slide.addText(row.value ?? '', {
        x: 5.6, y, w: 1.8, h: rowH,
        fontSize: 16, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
      });
      if (row.change) {
        slide.addText(row.change, {
          x: 7.55, y: y + 0.08, w: 1.5, h: 0.32,
          fontSize: 11, color: row.positive === false ? 'E85D4E' : '22C55E', bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
        });
      }
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05HeatmapV1(slide: PptxSlide, props: any): void {
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

  const values = (props.values || []).slice(0, 12);
  const months = (props.months || []).slice(0, 12);
  if (values.length > 0) {
    const max = Math.max(...values.map((v: any) => (typeof v === 'number' ? v : Number(v.item ?? 0) || 0)), 1);
    const cols = Math.min(values.length, 6);
    const cellW = 1.35;
    const cellH = 0.9;
    const totalW = cols * cellW + (cols - 1) * 0.1;
    const startX = (10 - totalW) / 2;
    const startY = 2.4;

    const heatColor = (value: number): string => {
      const r = value / max;
      if (r > 0.75) return COLORS.accent;
      if (r > 0.5) return CHART_COLORS[1] || 'F5A623';
      if (r > 0.25) return CHART_COLORS[2] || '0FA3B1';
      return COLORS.surfaceElevated;
    };

    values.forEach((v: any, idx: number) => {
      const value = typeof v === 'number' ? v : Number(v.item ?? 0) || 0;
      const r = value / max;
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cellW + 0.1);
      const y = startY + row * (cellH + 0.12);
      slide.addShape('roundRect', {
        x, y, w: cellW, h: cellH,
        fill: { color: heatColor(value) },
        rectRadius: 0.06,
      } as any);
      slide.addText(String(value), {
        x, y: y + 0.05, w: cellW, h: 0.4,
        fontSize: 18, color: r > 0.5 ? COLORS.white : COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
      });
      if (months[idx]) {
        const monthText = typeof months[idx] === 'string' ? months[idx] : months[idx].item ?? '';
        slide.addText(monthText, {
          x, y: y + 0.48, w: cellW, h: 0.3,
          fontSize: 10, color: r > 0.5 ? 'FFFFFF' : COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.peakLabel) {
    addTheme05Card(slide, 0.65, 4.6, 4.0, 0.55, true);
    slide.addText(props.peakLabel, {
      x: 0.8, y: 4.68, w: 3.7, h: 0.38,
      fontSize: 14, color: COLORS.white, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05WaterfallV1(slide: PptxSlide, props: any): void {
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
    const labels = items.map((item: any) => item.name ?? '');
    const values = items.map((item: any) => Number(item.value ?? 0) || 0);
    let cumulative = 0;
    const baseData: number[] = [];
    const changeData: number[] = [];
    const changeColors: string[] = [];

    values.forEach((v: number) => {
      baseData.push(cumulative);
      changeData.push(v);
      changeColors.push(v >= 0 ? COLORS.accent : 'E85D4E');
      cumulative += v;
    });
    const total = cumulative;

    // 总计柱：从 0 开始到 total
    baseData.push(0);
    changeData.push(total);
    changeColors.push(CHART_COLORS[2] || '0FA3B1');

    const chartLabels = [...labels, props.totalLabel ?? '总计'];

    slide.addChart('bar' as 'bar', [
      {
        name: '基础',
        labels: chartLabels,
        values: baseData,
      },
      {
        name: '变化',
        labels: chartLabels,
        values: changeData,
      },
    ], {
      x: 0.65, y: 2.35, w: 5.6, h: 3.0,
      chartColors: [COLORS.surface, COLORS.accent],
      showValue: true,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 9,
      barGrouping: 'stacked',
      barDir: 'col',
      dataLabelPosition: 'outEnd',
    } as any);

    addTheme05Card(slide, 6.45, 2.35, 2.9, 3.0);
    items.forEach((item: any, idx: number) => {
      const y = 2.5 + idx * 0.36;
      const color = (Number(item.value ?? 0) || 0) >= 0 ? COLORS.accent : 'E85D4E';
      slide.addText(item.name ?? '', {
        x: 6.6, y, w: 1.6, h: 0.28,
        fontSize: 11, color: COLORS.primary, valign: 'middle', fontFace: FONTS.body,
      });
      slide.addText(`${(Number(item.value ?? 0) || 0) >= 0 ? '+' : ''}${item.value ?? 0}`, {
        x: 8.2, y, w: 1.0, h: 0.28,
        fontSize: 11, color, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
      });
    });
    slide.addShape('rect', {
      x: 6.6, y: 2.5 + items.length * 0.36 + 0.08, w: 2.6, h: 0.02,
      fill: { color: COLORS.border },
    } as any);
    slide.addText(props.totalLabel ?? '总计', {
      x: 6.6, y: 2.5 + items.length * 0.36 + 0.16, w: 1.6, h: 0.28,
      fontSize: 12, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText(String(total), {
      x: 8.2, y: 2.5 + items.length * 0.36 + 0.16, w: 1.0, h: 0.28,
      fontSize: 12, color: CHART_COLORS[2] || '0FA3B1', bold: true, align: 'right', valign: 'middle', fontFace: FONTS.mono,
    });
  } else {
    slide.addText('（暂无瀑布图数据）', {
      x: 0.65, y: 3.0, w: 8.7, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05QuoteV1(slide: PptxSlide, props: any): void {
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

  addTheme05SpectrumBar(slide);
}

function renderTheme05ImageV1(slide: PptxSlide, props: any): void {
  if (props.image) {
    addImageMaybe(slide, props.image, 0.65, 0.65, 5.4, 4.45);
  } else {
    slide.addShape('roundRect', {
      x: 0.65, y: 0.65, w: 5.4, h: 4.45,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    } as any);
    slide.addText('点击上传图片', {
      x: 0.65, y: 2.6, w: 5.4, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const annotation = props.annotation;
  if (annotation && (annotation.value || annotation.label)) {
    addTheme05Card(slide, 4.8, 3.8, 1.9, 1.0, true);
    if (annotation.value) {
      slide.addText(annotation.value, {
        x: 4.95, y: 3.9, w: 1.6, h: 0.4,
        fontSize: 24, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
      });
    }
    if (annotation.label) {
      slide.addText(annotation.label, {
        x: 4.95, y: 4.3, w: 1.6, h: 0.4,
        fontSize: 10, color: 'FFFFFF', align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    }
  }

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 6.35, y: 0.78, w: 3.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 6.35, y: 1.2, w: 3.0, h: 1.0,
    fontSize: 30, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addShape('rect', {
    x: 6.35, y: 2.25, w: 1.0, h: 0.05,
    fill: { color: COLORS.accent },
  } as any);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 6.35, y: 2.4, w: 3.0, h: 0.9,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05VersusV1(slide: PptxSlide, props: any): void {
  const schemeColors: Record<string, string> = {
    coral: 'E85D4E',
    amber: 'F5A623',
    teal: '0FA3B1',
    indigo: '4A58D9',
    violet: '7C3AED',
  };

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

  const cardW = 3.7;
  const cardH = 2.4;
  const cardY = 2.4;
  const badgeW = 0.9;
  const gap = 0.25;
  const leftX = (10 - cardW * 2 - badgeW - gap * 2) / 2;
  const rightX = leftX + cardW + gap + badgeW + gap;
  const badgeX = leftX + cardW + gap;

  const sides: Array<{ key: 'left' | 'right'; x: number }> = [
    { key: 'left', x: leftX },
    { key: 'right', x: rightX },
  ];

  sides.forEach(({ key, x }) => {
    const side = props[key] || {};
    const scheme = schemeColors[side.scheme] || COLORS.accent;
    slide.addShape('roundRect', {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: scheme, width: 2 },
      rectRadius: 0.08,
    } as any);
    slide.addText(side.label ?? '', {
      x: x + 0.25, y: cardY + 0.25, w: cardW - 0.5, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
    slide.addText(side.value ?? '', {
      x: x + 0.25, y: cardY + 0.75, w: cardW - 0.5, h: 0.9,
      fontSize: 52, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    if (side.unit) {
      slide.addText(side.unit, {
        x: x + 0.25, y: cardY + 1.55, w: cardW - 0.5, h: 0.3,
        fontSize: 16, color: COLORS.secondary, valign: 'top', fontFace: FONTS.heading,
      });
    }
  });

  slide.addShape('ellipse', {
    x: badgeX, y: cardY + (cardH - badgeW) / 2, w: badgeW, h: badgeW,
    fill: { color: COLORS.light },
    line: { color: COLORS.border, width: 1 },
  } as any);
  slide.addText('VS', {
    x: badgeX, y: cardY + (cardH - badgeW) / 2, w: badgeW, h: badgeW,
    fontSize: 20, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.0, w: 8.7, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ProcessV1(slide: PptxSlide, props: any): void {
  if (props.tag || props.tagLabel) {
    const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
    slide.addText(tagText, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 5.5, y: 0.78, w: 3.85, h: 0.25,
      fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.mono,
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
  if (steps.length > 0) {
    const cardW = Math.min(2.0, (8.7 - (steps.length - 1) * 0.18) / steps.length);
    const gap = 0.18;
    const totalW = steps.length * cardW + (steps.length - 1) * gap;
    const startX = (10 - totalW) / 2;
    const cardY = 2.55;
    const cardH = 2.2;

    steps.forEach((step: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      addTheme05Card(slide, x, cardY, cardW, cardH);
      slide.addShape('ellipse', {
        x: x + 0.15, y: cardY + 0.18, w: 0.42, h: 0.42,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.15, y: cardY + 0.18, w: 0.42, h: 0.42,
        fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
      slide.addText(step.title ?? '', {
        x: x + 0.65, y: cardY + 0.2, w: cardW - 0.8, h: 0.45,
        fontSize: 14, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (step.description) {
        slide.addText(step.description, {
          x: x + 0.15, y: cardY + 0.75, w: cardW - 0.3, h: cardH - 0.95,
          fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }

      if (idx < steps.length - 1) {
        const arrowX = x + cardW + 0.02;
        const arrowY = cardY + cardH / 2;
        slide.addShape('rect', {
          x: arrowX, y: arrowY - 0.01, w: gap - 0.04, h: 0.02,
          fill: { color: COLORS.border },
        } as any);
        slide.addShape('triangle', {
          x: arrowX + gap - 0.1, y: arrowY - 0.05, w: 0.08, h: 0.1,
          fill: { color: COLORS.border },
        } as any);
      }
    });
  }

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05TimelineV1(slide: PptxSlide, props: any): void {
  const schemeColors: Record<string, string> = {
    coral: 'E85D4E',
    amber: 'F5A623',
    teal: '0FA3B1',
    indigo: '4A58D9',
    violet: '7C3AED',
  };

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 5.0, h: 0.25,
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

  const phases = (props.phases || []).slice(0, 3);
  if (phases.length > 0) {
    const cardW = 2.8;
    const gap = 0.2;
    const totalW = phases.length * cardW + (phases.length - 1) * gap;
    const startX = (10 - totalW) / 2;
    const trackY = 2.55;
    const cardY = 3.15;
    const cardH = 2.15;
    const dotY = trackY + 0.05;
    const lineY = trackY + 0.24;

    // timeline line
    slide.addShape('rect', {
      x: startX + 0.4, y: lineY, w: totalW - 0.8, h: 0.02,
      fill: { color: COLORS.border },
    } as any);

    phases.forEach((phase: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      const scheme = schemeColors[phase.scheme] || COLORS.accent;

      // node dot
      slide.addShape('ellipse', {
        x: x + cardW / 2 - 0.18, y: dotY, w: 0.36, h: 0.36,
        fill: { color: scheme },
      } as any);
      slide.addText(String(idx + 1), {
        x: x + cardW / 2 - 0.18, y: dotY, w: 0.36, h: 0.36,
        fontSize: 12, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
      });
      // period
      slide.addText(phase.period ?? '', {
        x, y: trackY + 0.5, w: cardW, h: 0.22,
        fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
      });

      // card
      addTheme05Card(slide, x, cardY, cardW, cardH);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.12, y: cardY + 0.12, w: 0.5, h: 0.35,
        fontSize: 18, color: COLORS.secondary, bold: true, valign: 'top', fontFace: FONTS.mono,
      });
      if (phase.badge) {
        slide.addText(phase.badge, {
          x: x + 0.55, y: cardY + 0.14, w: cardW - 0.7, h: 0.22,
          fontSize: 9, color: scheme, fontFace: FONTS.mono, bold: true,
        });
      }
      slide.addText(phase.title ?? '', {
        x: x + 0.12, y: cardY + 0.55, w: cardW - 0.24, h: 0.4,
        fontSize: 14, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (phase.description) {
        slide.addText(phase.description, {
          x: x + 0.12, y: cardY + 0.95, w: cardW - 0.24, h: cardH - 1.05,
          fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05MatrixV1(slide: PptxSlide, props: any): void {
  const schemeColors: Record<string, string> = {
    coral: 'E85D4E',
    amber: 'F5A623',
    teal: '0FA3B1',
    indigo: '4A58D9',
    violet: '7C3AED',
  };

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

  const gridX = 1.1;
  const gridY = 2.45;
  const gridW = 7.4;
  const gridH = 2.65;

  // y-axis
  const yAxis = props.yAxis || { low: '低', high: '高' };
  slide.addText(yAxis.high ?? '高', {
    x: 0.35, y: gridY, w: 0.5, h: 0.25,
    fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
  });
  slide.addShape('rect', {
    x: 0.57, y: gridY + 0.3, w: 0.02, h: gridH - 0.55,
    fill: { color: COLORS.border },
  } as any);
  slide.addText(yAxis.low ?? '低', {
    x: 0.35, y: gridY + gridH - 0.5, w: 0.5, h: 0.25,
    fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'bottom', fontFace: FONTS.body,
  });

  const items = (props.items || []).slice(0, 4);
  if (items.length > 0) {
    const cols = 2;
    const rows = 2;
    const cardGap = 0.14;
    const cardW = (gridW - cardGap) / cols;
    const cardH = (gridH - cardGap) / rows;

    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = gridX + col * (cardW + cardGap);
      const y = gridY + row * (cardH + cardGap);
      const scheme = schemeColors[item.scheme] || COLORS.accent;
      addTheme05Card(slide, x, y, cardW, cardH);
      slide.addShape('rect', {
        x, y, w: cardW, h: 0.04,
        fill: { color: scheme },
      } as any);
      slide.addText(item.title ?? '', {
        x: x + 0.12, y: y + 0.18, w: cardW - 0.24, h: 0.35,
        fontSize: 14, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (item.description) {
        slide.addText(item.description, {
          x: x + 0.12, y: y + 0.55, w: cardW - 0.24, h: cardH - 0.65,
          fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  // x-axis
  const xAxis = props.xAxis || { low: '低', high: '高' };
  slide.addText(xAxis.low ?? '低', {
    x: gridX, y: gridY + gridH + 0.12, w: 0.5, h: 0.22,
    fontSize: 10, color: COLORS.secondary, align: 'left', fontFace: FONTS.body,
  });
  slide.addShape('rect', {
    x: gridX + 0.55, y: gridY + gridH + 0.22, w: gridW - 1.1, h: 0.02,
    fill: { color: COLORS.border },
  } as any);
  slide.addText(xAxis.high ?? '高', {
    x: gridX + gridW - 0.5, y: gridY + gridH + 0.12, w: 0.5, h: 0.22,
    fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.body,
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05QuadrantV1(slide: PptxSlide, props: any): void {
  const schemeColors: Record<string, string> = {
    coral: 'E85D4E',
    amber: 'F5A623',
    teal: '0FA3B1',
    indigo: '4A58D9',
    violet: '7C3AED',
  };

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 5.0, h: 0.25,
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

  const gridX = 1.1;
  const gridY = 2.45;
  const gridW = 7.4;
  const gridH = 2.65;

  // y-axis
  const yAxisLabel = props.yAxisLabel ?? '资本热度';
  const yLabels = props.yAxisLabels ?? ['低', '高'];
  slide.addText(yAxisLabel, {
    x: 0.05, y: gridY + gridH / 2 - 0.5, w: 0.9, h: 1.0,
    fontSize: 10, color: COLORS.accent, align: 'center', valign: 'middle', fontFace: FONTS.mono, bold: true,
  });
  slide.addShape('rect', {
    x: 0.57, y: gridY + 0.15, w: 0.02, h: gridH - 0.3,
    fill: { color: COLORS.border },
  } as any);
  slide.addText(yLabels[1] ?? '高', {
    x: 0.35, y: gridY, w: 0.5, h: 0.25,
    fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
  });
  slide.addText(yLabels[0] ?? '低', {
    x: 0.35, y: gridY + gridH - 0.25, w: 0.5, h: 0.25,
    fontSize: 10, color: COLORS.secondary, align: 'center', valign: 'bottom', fontFace: FONTS.body,
  });

  const quadrants = (props.quadrants || []).slice(0, 4);
  if (quadrants.length > 0) {
    const cols = 2;
    const rows = 2;
    const cardGap = 0.14;
    const cardW = (gridW - cardGap) / cols;
    const cardH = (gridH - cardGap) / rows;

    quadrants.forEach((q: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = gridX + col * (cardW + cardGap);
      const y = gridY + row * (cardH + cardGap);
      const scheme = schemeColors[q.scheme] || COLORS.accent;
      addTheme05Card(slide, x, y, cardW, cardH);
      slide.addShape('rect', {
        x, y, w: cardW, h: 0.04,
        fill: { color: scheme },
      } as any);
      slide.addShape('ellipse', {
        x: x + 0.12, y: y + 0.16, w: 0.1, h: 0.1,
        fill: { color: scheme },
      } as any);
      slide.addText(q.title ?? '', {
        x: x + 0.28, y: y + 0.12, w: cardW - 0.8, h: 0.35,
        fontSize: 14, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + cardW - 0.45, y: y + 0.12, w: 0.35, h: 0.3,
        fontSize: 14, color: COLORS.secondary, bold: true, align: 'right', fontFace: FONTS.mono,
      });
      if (q.description) {
        slide.addText(q.description, {
          x: x + 0.12, y: y + 0.5, w: cardW - 0.24, h: cardH - 0.95,
          fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
      const tags = (q.tags || []).slice(0, 5);
      if (tags.length > 0) {
        slide.addText(tags.join(' · '), {
          x: x + 0.12, y: y + cardH - 0.42, w: cardW - 0.24, h: 0.3,
          fontSize: 8, color: COLORS.secondary, valign: 'bottom', fontFace: FONTS.mono,
        });
      }
    });
  }

  // x-axis
  const xAxisLabel = props.xAxisLabel ?? '商业兑现度';
  const xLabels = props.xAxisLabels ?? ['低 / 待验证', '高'];
  slide.addShape('rect', {
    x: gridX + 0.2, y: gridY + gridH + 0.2, w: gridW - 0.4, h: 0.02,
    fill: { color: COLORS.border },
  } as any);
  slide.addText(xLabels[0] ?? '低', {
    x: gridX, y: gridY + gridH + 0.28, w: 0.8, h: 0.22,
    fontSize: 10, color: COLORS.secondary, align: 'left', fontFace: FONTS.body,
  });
  slide.addText(xLabels[1] ?? '高', {
    x: gridX + gridW - 0.8, y: gridY + gridH + 0.28, w: 0.8, h: 0.22,
    fontSize: 10, color: COLORS.secondary, align: 'right', fontFace: FONTS.body,
  });
  slide.addText(xAxisLabel, {
    x: gridX + gridW / 2 - 1.0, y: gridY + gridH + 0.28, w: 2.0, h: 0.22,
    fontSize: 10, color: COLORS.accent, align: 'center', fontFace: FONTS.mono, bold: true,
  });

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05RiskV1(slide: PptxSlide, props: any): void {
  const schemeColors: Record<string, string> = {
    coral: 'E85D4E',
    amber: 'F5A623',
    teal: '0FA3B1',
    indigo: '4A58D9',
    violet: '7C3AED',
  };

  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '关键风险与应对', {
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
    const rows = 2;
    const cardGap = 0.16;
    const cardW = (8.7 - cardGap) / cols;
    const cardH = (2.85 - cardGap) / rows;
    const startX = 0.65;
    const startY = 2.4;

    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + cardGap);
      const y = startY + row * (cardH + cardGap);
      const scheme = schemeColors[item.scheme] || COLORS.accent;
      addTheme05Card(slide, x, y, cardW, cardH);
      slide.addShape('rect', {
        x, y, w: cardW, h: 0.04,
        fill: { color: scheme },
      } as any);
      slide.addText(item.risk ?? '', {
        x: x + 0.12, y: y + 0.14, w: cardW - 0.6, h: 0.4,
        fontSize: 15, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + cardW - 0.45, y: y + 0.14, w: 0.35, h: 0.3,
        fontSize: 14, color: COLORS.secondary, bold: true, align: 'right', fontFace: FONTS.mono,
      });
      if (item.impact) {
        slide.addText('影响程度', {
          x: x + 0.12, y: y + 0.62, w: 0.9, h: 0.2,
          fontSize: 8, color: COLORS.secondary, fontFace: FONTS.mono, bold: true,
        });
        slide.addText(item.impact, {
          x: x + 1.05, y: y + 0.62, w: cardW - 1.2, h: 0.22,
          fontSize: 11, color: scheme, bold: true, valign: 'top', fontFace: FONTS.body,
        });
      }
      if (item.response) {
        slide.addText('应对策略', {
          x: x + 0.12, y: y + 0.92, w: 0.9, h: 0.2,
          fontSize: 8, color: COLORS.secondary, fontFace: FONTS.mono, bold: true,
        });
        slide.addText(item.response, {
          x: x + 1.05, y: y + 0.92, w: cardW - 1.2, h: cardH - 1.05,
          fontSize: 9, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05BubbleV1(slide: PptxSlide, props: any): void {
  const schemeColors: Record<string, string> = {
    coral: 'E85D4E',
    amber: 'F5A623',
    teal: '0FA3B1',
    indigo: '4A58D9',
    violet: '7C3AED',
  };

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

  const items = (props.items || []).slice(0, 16);
  if (items.length === 0) {
    addTheme05SpectrumBar(slide);
    return;
  }

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  addTheme05Card(slide, chartX, chartY, chartW, chartH);

  const plotMargin = { top: 0.3, right: 0.3, bottom: 0.5, left: 0.7 };
  const plotX = chartX + plotMargin.left;
  const plotY = chartY + plotMargin.top;
  const plotW = chartW - plotMargin.left - plotMargin.right;
  const plotH = chartH - plotMargin.top - plotMargin.bottom;

  const xs = items.map((item: any) => Number(item.x) || 0);
  const ys = items.map((item: any) => Number(item.y) || 0);
  const maxX = Math.max(1, ...xs);
  const maxY = Math.max(1, ...ys);

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
    const scheme = item.scheme || 'coral';
    const color = schemeColors[scheme] ?? COLORS.accent;
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

  addTheme05SpectrumBar(slide);
}

function renderTheme05MapV1(slide: PptxSlide, props: any): void {
  const schemeColors: Record<string, string> = {
    coral: 'E85D4E',
    amber: 'F5A623',
    teal: '0FA3B1',
    indigo: '4A58D9',
    violet: '7C3AED',
  };

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

  const items = (props.items || []).slice(0, 10);
  if (items.length === 0) {
    addTheme05SpectrumBar(slide);
    return;
  }

  const chartX = 0.65;
  const chartY = 2.45;
  const chartW = 8.7;
  const chartH = 2.85;

  addTheme05Card(slide, chartX, chartY, chartW, chartH);

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
    const scheme = item.scheme || 'coral';
    const color = schemeColors[scheme] ?? COLORS.accent;

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

  addTheme05SpectrumBar(slide);
}

function renderTheme05TableOfContentsV1(slide: PptxSlide, props: any): void {
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.2, w: 4.2, h: 0.8,
    fontSize: 42, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addShape('rect', {
    x: 0.65, y: 2.05, w: 1.4, h: 0.05,
    fill: { color: COLORS.accent },
  } as any);

  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const cols = Math.min(items.length, 2);
    const cardW = 4.0;
    const cardH = 1.05;
    const gapX = 0.2;
    const gapY = 0.18;
    const startX = 5.05;
    const startY = 0.85;

    items.forEach((item: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      addTheme05Card(slide, x, y, cardW, cardH);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.15, y: y + 0.18, w: 0.6, h: 0.6,
        fontSize: 28, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      slide.addText(item.title ?? '', {
        x: x + 0.85, y: y + 0.2, w: cardW - 1.1, h: 0.35,
        fontSize: 15, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
      });
      if (item.page) {
        slide.addText(`P.${item.page}`, {
          x: x + 0.85, y: y + 0.55, w: cardW - 1.1, h: 0.25,
          fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.mono,
        });
      }
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ClosingV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.claim ?? '', {
    x: 0.65, y: 1.6, w: 8.7, h: 1.4,
    fontSize: 42, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });

  const points = (props.points || []).slice(0, 4);
  if (points.length > 0) {
    const cardW = 2.05;
    const gap = 0.18;
    const startX = (10 - points.length * cardW - (points.length - 1) * gap) / 2;
    points.forEach((p: any, idx: number) => {
      const x = startX + idx * (cardW + gap);
      const y = 3.4;
      addTheme05Card(slide, x, y, cardW, 1.1, idx === 0);
      slide.addText(p.value ?? '', {
        x, y: y + 0.15, w: cardW, h: 0.45,
        fontSize: 28, color: idx === 0 ? COLORS.white : COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
      });
      slide.addText(p.label ?? '', {
        x, y: y + 0.62, w: cardW, h: 0.25,
        fontSize: 10, color: idx === 0 ? 'FFFFFF' : COLORS.secondary, align: 'center', fontFace: FONTS.body,
      });
    });
  }

  addTheme05SpectrumBar(slide);

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme05CoverExV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.2, w: 5.0, h: 1.6,
    fontSize: 48, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.85, w: 5.0, h: 0.6,
      fontSize: 16, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme05SpectrumBar(slide);

  const stats = (props.stats || []).slice(0, 4);
  const cardW = 2.15;
  const cardH = 1.05;
  const gapX = 0.18;
  const gapY = 0.18;
  const startX = 5.85;
  const startY = 0.95;
  stats.forEach((s: any, idx: number) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = startX + col * (cardW + gapX);
    const y = startY + row * (cardH + gapY);
    const color = theme05SchemeColor(s.scheme);
    slide.addShape('roundRect', {
      x, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    } as any);
    slide.addShape('rect', {
      x, y, w: cardW, h: 0.06,
      fill: { color },
    } as any);
    slide.addText(`${s.value ?? ''}${s.unit ?? ''}`, {
      x: x + 0.12, y: y + 0.18, w: cardW - 0.24, h: 0.42,
      fontSize: 26, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(s.label ?? '', {
      x: x + 0.12, y: y + 0.62, w: cardW - 0.24, h: 0.28,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
    });
  });

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme05CoverExV2(slide: PptxSlide, props: any): void {
  if (props.backgroundNumber) {
    slide.addText(props.backgroundNumber, {
      x: 4.5, y: 0.6, w: 5.5, h: 2.0,
      fontSize: 160, color: COLORS.primary, bold: true, align: 'right', valign: 'top', fontFace: FONTS.heading,
      transparency: 92,
    } as any);
  }

  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }

  const highlights = (props.highlights || []).slice(0, 5);
  if (highlights.length > 0) {
    let pillX = 0.65;
    const pillY = 1.2;
    highlights.forEach((h: any) => {
      const text = typeof h === 'string' ? h : h.text ?? '';
      if (!text) return;
      const color = theme05SchemeColor(typeof h === 'string' ? undefined : h.scheme);
      const approxW = Math.min(2.2, 0.24 + text.length * 0.11);
      addTheme05Pill(slide, pillX, pillY, approxW, 0.32, text, color);
      pillX += approxW + 0.12;
    });
  }

  slide.addText(props.title ?? '', {
    x: 0.65, y: 3.1, w: 8.7, h: 1.2,
    fontSize: 54, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 4.3, w: 8.7, h: 0.45,
      fontSize: 16, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme05CoverHeroV1(slide: PptxSlide, props: any): void {
  const imageUrl = props.image;
  if (imageUrl) {
    addImageMaybe(slide, imageUrl, 0, 0, 10, 5.625);
  } else {
    slide.addShape('rect', {
      x: 0, y: 0, w: 10, h: 5.625,
      fill: { color: COLORS.light },
    } as any);
    slide.addShape('rect', {
      x: 4.2, y: 2.0, w: 1.6, h: 1.6,
      fill: { color: COLORS.border },
      line: { color: COLORS.secondary, width: 1, dashType: 'dash' },
    } as any);
    slide.addText('[图片]', {
      x: 4.2, y: 2.6, w: 1.6, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  }

  // 左侧渐变遮罩：用半透明矩形从白到透明模拟
  slide.addShape('rect', {
    x: 0, y: 0, w: 5.2, h: 5.625,
    fill: {
      color: COLORS.white,
      gradient: {
        type: 'linear',
        angle: 0,
        stops: [
          { position: 0, color: COLORS.white },
          { position: 1, color: `${COLORS.white}00` as any },
        ],
      },
    },
  } as any);

  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 3.0, w: 6.5, h: 1.2,
    fontSize: 50, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 4.2, w: 6.5, h: 0.5,
      fontSize: 16, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);

  const footerText = [props.footnoteLeft, props.footnoteRight].filter(Boolean).join('     ');
  if (footerText) {
    slide.addText(footerText, {
      x: 0.65, y: 5.32, w: 8.7, h: 0.2,
      fontSize: 9, color: COLORS.secondary, align: 'center', fontFace: FONTS.mono,
    });
  }
}

function renderTheme05ChapterBigV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    slide.addText(props.tag, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.8, w: 8.7, h: 1.5,
    fontSize: 64, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 3.4, w: 8.7, h: 0.6,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme05SpectrumBar(slide);
}

function renderTheme05ChapterSplitV1(slide: PptxSlide, props: any): void {
  slide.addShape('rect', {
    x: 0, y: 0, w: 3.0, h: 5.625,
    fill: { color: COLORS.accent },
  } as any);
  slide.addText(props.number ?? '', {
    x: 0, y: 1.9, w: 3.0, h: 1.4,
    fontSize: 110, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });

  slide.addText(props.title ?? '', {
    x: 3.4, y: 1.8, w: 6.2, h: 1.2,
    fontSize: 48, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 3.4, y: 3.05, w: 6.2, h: 0.6,
      fontSize: 16, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme05SpectrumBar(slide);
}

function renderTheme05ChapterNumberedV1(slide: PptxSlide, props: any): void {
  slide.addText(props.number ?? '', {
    x: 0.65, y: 0.9, w: 8.7, h: 0.9,
    fontSize: 80, color: COLORS.accent, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(props.title ?? '', {
    x: 0.65, y: 2.0, w: 8.7, h: 1.2,
    fontSize: 54, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 3.25, w: 8.7, h: 0.5,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
  slide.addShape('rect', {
    x: 4.5, y: 3.9, w: 1.0, h: 0.05,
    fill: { color: COLORS.accent },
  } as any);
  addTheme05SpectrumBar(slide);
}

function renderTheme05ChapterImageV1(slide: PptxSlide, props: any): void {
  const imageUrl = props.image;
  if (imageUrl) {
    addImageMaybe(slide, imageUrl, 0, 0, 10, 5.625);
  } else {
    slide.addShape('rect', {
      x: 0, y: 0, w: 10, h: 5.625,
      fill: { color: COLORS.light },
    } as any);
    slide.addShape('rect', {
      x: 4.2, y: 2.0, w: 1.6, h: 1.6,
      fill: { color: COLORS.border },
      line: { color: COLORS.secondary, width: 1, dashType: 'dash' },
    } as any);
    slide.addText('[图片]', {
      x: 4.2, y: 2.6, w: 1.6, h: 0.3,
      fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
    });
  }

  // 底部渐变遮罩
  slide.addShape('rect', {
    x: 0, y: 2.8, w: 10, h: 2.825,
    fill: {
      color: COLORS.white,
      gradient: {
        type: 'linear',
        angle: 270,
        stops: [
          { position: 0, color: `${COLORS.white}00` as any },
          { position: 1, color: COLORS.white },
        ],
      },
    },
  } as any);

  slide.addText(props.number ?? '', {
    x: 0.65, y: 3.2, w: 8.7, h: 0.6,
    fontSize: 48, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
  });
  slide.addText(props.title ?? '', {
    x: 0.65, y: 3.85, w: 8.7, h: 0.9,
    fontSize: 42, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 4.75, w: 8.7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  addTheme05SpectrumBar(slide);
}

function renderTheme05MetricHeroV1(slide: PptxSlide, props: any): void {
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

  addTheme05SpectrumBar(slide);
}

function renderTheme05MetricCapacityV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.8,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.95, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 6);
  const startY = 2.55;
  const rowH = 0.55;
  items.forEach((item: any, idx: number) => {
    const y = startY + idx * rowH;
    const name = item.name ?? '';
    const value = Number(item.value) || 0;
    const max = Math.max(Number(item.max) || 100, value);
    const unit = item.unit ?? '';
    const color = theme05SchemeColor(item.scheme);

    slide.addText(name, {
      x: 0.65, y, w: 2.0, h: 0.3,
      fontSize: 12, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
    slide.addText(`${value}${unit}`, {
      x: 8.05, y, w: 1.3, h: 0.3,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.heading,
    });

    const trackX = 2.75;
    const trackW = 5.15;
    slide.addShape('roundRect', {
      x: trackX, y: y + 0.08, w: trackW, h: 0.14,
      fill: { color: COLORS.border },
      rectRadius: 0.07,
    } as any);
    const fillW = max > 0 ? (value / max) * trackW : 0;
    if (fillW > 0) {
      slide.addShape('roundRect', {
        x: trackX, y: y + 0.08, w: fillW, h: 0.14,
        fill: { color },
        rectRadius: 0.07,
      } as any);
    }
  });

  addTheme05SpectrumBar(slide);
}

function renderTheme05MetricDeltaV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const colW = 2.6;
  const startX = (10 - colW * 3 - 0.6) / 2;

  // 当前值
  slide.addShape('roundRect', {
    x: startX, y: 2.4, w: colW, h: 1.4,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.1,
  } as any);
  slide.addText(`${props.currentValue ?? ''}${props.currentUnit ?? ''}`, {
    x: startX, y: 2.55, w: colW, h: 0.55,
    fontSize: 34, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.heading,
  });
  slide.addText(props.currentLabel ?? '当前值', {
    x: startX, y: 3.15, w: colW, h: 0.25,
    fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });

  // Delta 徽章
  const deltaX = startX + colW + 0.3;
  slide.addShape('roundRect', {
    x: deltaX, y: 2.65, w: colW, h: 0.9,
    fill: { color: COLORS.accent },
    rectRadius: 0.1,
  } as any);
  slide.addText(props.delta ?? '', {
    x: deltaX, y: 2.72, w: colW, h: 0.4,
    fontSize: 28, color: COLORS.white, bold: true, align: 'center', fontFace: FONTS.heading,
  });
  slide.addText(props.deltaLabel ?? '变化', {
    x: deltaX, y: 3.15, w: colW, h: 0.25,
    fontSize: 10, color: COLORS.white, align: 'center', fontFace: FONTS.body,
  });

  // 对比值
  const prevX = deltaX + colW + 0.3;
  slide.addShape('roundRect', {
    x: prevX, y: 2.4, w: colW, h: 1.4,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.1,
  } as any);
  slide.addText(`${props.previousValue ?? ''}${props.previousUnit ?? ''}`, {
    x: prevX, y: 2.55, w: colW, h: 0.55,
    fontSize: 34, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.heading,
  });
  slide.addText(props.previousLabel ?? '对比值', {
    x: prevX, y: 3.15, w: colW, h: 0.25,
    fontSize: 10, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
  });

  // 迷你折线
  const labels = (props.labels || []).slice(0, 12);
  const data = (props.data || []).slice(0, 12).map((d: any) => Number(d) || 0);
  if (labels.length > 1 && data.length > 1) {
    slide.addChart('line', [{ name: props.title || '', labels, values: data }], {
      x: 0.85, y: 4.05, w: 8.3, h: 1.25,
      chartColors: [COLORS.accent],
      lineDataSymbol: 'none',
      lineSmooth: true,
      showLegend: false,
      showValue: false,
      catAxisHidden: true,
      valAxisHidden: true,
      gridLineColor: COLORS.surface,
    } as any);
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ChartShareV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 8);
  const hasConclusion = props.showConclusion !== false && !!props.conclusion && (!!props.conclusion.value || !!props.conclusion.label || !!props.conclusion.description);
  const chartW = hasConclusion ? 5.7 : 8.7;

  if (items.length > 0) {
    const data = items.map((item: any) => ({
      name: item.name ?? '',
      labels: [item.name ?? ''],
      values: [Number(item.value) || 0],
    }));
    slide.addChart('pie', data, {
      x: 0.65, y: 2.05, w: chartW, h: 3.0,
      chartColors: items.map((item: any) => theme05SchemeColor(item.scheme)),
      showValue: false,
      showLegend: false,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 10,
    } as any);
  } else {
    slide.addText('（暂无图表数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasConclusion) {
    addTheme05ConclusionCard(slide, 6.55, 2.05, 2.8, 3.0, props.conclusion);
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ChartStackedV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels || []).slice(0, 12);
  const rawSeries = (props.series || []).slice(0, 5);
  const series = rawSeries.map((s: any) => ({
    name: s.name ?? '',
    labels,
    values: (s.data || []).slice(0, labels.length).map((d: any) => Number(d) || 0),
  }));
  const hasConclusion = props.showConclusion !== false && !!props.conclusion && (!!props.conclusion.value || !!props.conclusion.label || !!props.conclusion.description);
  const chartW = hasConclusion ? 5.7 : 8.7;

  if (labels.length > 0 && series.length > 0) {
    slide.addChart('bar', series, {
      x: 0.65, y: 2.05, w: chartW, h: 3.0,
      chartColors: rawSeries.map((s: any) => theme05SchemeColor(s.scheme)),
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

  if (hasConclusion) {
    addTheme05ConclusionCard(slide, 6.55, 2.05, 2.8, 3.0, props.conclusion);
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ChartCurveV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels || []).slice(0, 12);
  const values = (props.data || []).slice(0, 12).map((d: any) => Number(d) || 0);
  const hasConclusion = props.showConclusion !== false && !!props.conclusion && (!!props.conclusion.value || !!props.conclusion.label || !!props.conclusion.description);
  const chartW = hasConclusion ? 5.7 : 8.7;

  if (labels.length > 0 && values.length > 0) {
    slide.addChart('line', [{ name: props.title || '', labels, values }], {
      x: 0.65, y: 2.05, w: chartW, h: 3.0,
      chartColors: [COLORS.accent],
      lineDataSymbol: 'circle',
      lineSmooth: props.smooth !== false,
      showLegend: false,
      showValue: false,
    } as any);
  } else {
    slide.addText('（暂无图表数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasConclusion) {
    addTheme05ConclusionCard(slide, 6.55, 2.05, 2.8, 3.0, props.conclusion);
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ChartPeakV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels || []).slice(0, 12);
  const values = (props.data || []).slice(0, 12).map((d: any) => Number(d) || 0);
  const peakIndex = Number(props.peakIndex) || 0;
  const hasConclusion = props.showConclusion !== false && !!props.conclusion && (!!props.conclusion.value || !!props.conclusion.label || !!props.conclusion.description);
  const chartW = hasConclusion ? 5.7 : 8.7;

  if (labels.length > 0 && values.length > 0) {
    const baseColor = CHART_COLORS[2] || COLORS.secondary;
    const peakColor = COLORS.accent;
    const chartColors = values.map((_: number, idx: number) => (idx === peakIndex ? peakColor : baseColor));
    slide.addChart('bar', [{ name: props.title || '', labels, values }], {
      x: 0.65, y: 2.05, w: chartW, h: 3.0,
      chartColors,
      barGrouping: 'clustered',
      barDir: 'col',
      showValue: false,
    } as any);

    // PEAK 标注
    const barW = chartW / Math.max(labels.length, 1);
    const maxVal = Math.max(...values, 1);
    const peakVal = values[peakIndex] ?? 0;
    const peakX = 0.65 + (peakIndex + 0.5) * barW;
    const peakY = 2.05 + 3.0 * (1 - peakVal / maxVal) - 0.35;
    slide.addText('PEAK', {
      x: peakX - 0.5, y: Math.max(2.05, peakY), w: 1.0, h: 0.22,
      fontSize: 10, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.mono,
    });
  } else {
    slide.addText('（暂无图表数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasConclusion) {
    addTheme05ConclusionCard(slide, 6.55, 2.05, 2.8, 3.0, props.conclusion);
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ChartPeaktroughV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels || []).slice(0, 12);
  const values = (props.data || []).slice(0, 12).map((d: any) => Number(d) || 0);
  const peakIndex = Number(props.peakIndex) || 0;
  const troughIndex = Number(props.troughIndex) || 0;
  const hasConclusion = props.showConclusion !== false && !!props.conclusion && (!!props.conclusion.value || !!props.conclusion.label || !!props.conclusion.description);
  const chartW = hasConclusion ? 5.7 : 8.7;

  if (labels.length > 0 && values.length > 0) {
    slide.addChart('line', [{ name: props.title || '', labels, values }], {
      x: 0.65, y: 2.05, w: chartW, h: 3.0,
      chartColors: [COLORS.accent],
      lineDataSymbol: 'circle',
      lineSmooth: true,
      showLegend: false,
      showValue: false,
    } as any);

    // 峰值/谷值椭圆标注
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values);
    const plotH = 3.0;
    const plotY = 2.05;
    const pointX = (idx: number) => 0.65 + (chartW / Math.max(labels.length - 1, 1)) * idx;
    const pointY = (idx: number) => plotY + plotH * (1 - (values[idx] - minVal) / Math.max(maxVal - minVal, 1));

    if (values[peakIndex] !== undefined) {
      const px = pointX(peakIndex);
      const py = pointY(peakIndex);
      slide.addShape('ellipse', {
        x: px - 0.2, y: py - 0.12, w: 0.4, h: 0.24,
        fill: { color: COLORS.surface },
        line: { color: COLORS.accent, width: 2 },
      } as any);
      slide.addText('PEAK', {
        x: px - 0.4, y: py - 0.4, w: 0.8, h: 0.2,
        fontSize: 9, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.mono,
      });
    }
    if (values[troughIndex] !== undefined) {
      const tx = pointX(troughIndex);
      const ty = pointY(troughIndex);
      slide.addShape('ellipse', {
        x: tx - 0.2, y: ty - 0.12, w: 0.4, h: 0.24,
        fill: { color: COLORS.surface },
        line: { color: COLORS.secondary, width: 2 },
      } as any);
      slide.addText('TROUGH', {
        x: tx - 0.45, y: ty + 0.2, w: 0.9, h: 0.2,
        fontSize: 9, color: COLORS.secondary, bold: true, align: 'center', fontFace: FONTS.mono,
      });
    }
  } else {
    slide.addText('（暂无图表数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasConclusion) {
    addTheme05ConclusionCard(slide, 6.55, 2.05, 2.8, 3.0, props.conclusion);
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ChartCumulativeV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const labels = (props.labels || []).slice(0, 12);
  const rawValues = (props.data || []).slice(0, 12).map((d: any) => Number(d) || 0);
  const cumulative: number[] = [];
  rawValues.reduce((sum: number, v: number) => {
    const next = sum + v;
    cumulative.push(next);
    return next;
  }, 0);
  const hasConclusion = props.showConclusion !== false && !!props.conclusion && (!!props.conclusion.value || !!props.conclusion.label || !!props.conclusion.description);
  const chartW = hasConclusion ? 5.7 : 8.7;

  if (labels.length > 0 && cumulative.length > 0) {
    slide.addChart('line', [{ name: props.title || '', labels, values: cumulative }], {
      x: 0.65, y: 2.05, w: chartW, h: 3.0,
      chartColors: [COLORS.accent],
      lineDataSymbol: 'circle',
      lineSmooth: false,
      showLegend: false,
      showValue: false,
    } as any);
  } else {
    slide.addText('（暂无图表数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasConclusion) {
    addTheme05ConclusionCard(slide, 6.55, 2.05, 2.8, 3.0, props.conclusion);
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05TableOfContentsV2(slide: PptxSlide, props: any): void {
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.2, w: 4.0, h: 0.9,
    fontSize: 42, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.1, w: 4.0, h: 0.4,
      fontSize: 14, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
  slide.addShape('rect', {
    x: 0.65, y: 2.6, w: 1.2, h: 0.05,
    fill: { color: COLORS.accent },
  } as any);

  const items = (props.items || []).slice(0, 6);
  const startX = 5.2;
  const startY = 1.05;
  const rowH = 0.72;
  items.forEach((item: any, idx: number) => {
    const y = startY + idx * rowH;
    const num = String(idx + 1).padStart(2, '0');
    slide.addText(num, {
      x: startX, y, w: 0.7, h: 0.5,
      fontSize: 28, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
    });
    slide.addText(item.title ?? '', {
      x: startX + 0.9, y, w: 3.2, h: 0.32,
      fontSize: 16, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
    });
    if (item.page) {
      slide.addText(`P.${item.page}`, {
        x: startX + 0.9, y: y + 0.28, w: 3.2, h: 0.22,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.mono,
      });
    }
  });

  addTheme05SpectrumBar(slide);
}

function renderTheme05ProcessV2(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.8,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.95, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const steps = (props.steps || []).slice(0, 6);
  const cardW = 8.7;
  const cardH = 0.62;
  const gapY = 0.18;
  const startX = 0.65;
  const startY = 2.5;
  steps.forEach((step: any, idx: number) => {
    const y = startY + idx * (cardH + gapY);
    const color = theme05SchemeColor(step.scheme);

    slide.addShape('roundRect', {
      x: startX, y, w: cardW, h: cardH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    } as any);
    slide.addShape('roundRect', {
      x: startX + 0.12, y: y + 0.11, w: 0.6, h: 0.4,
      fill: { color },
      rectRadius: 0.06,
    } as any);
    slide.addText(String(idx + 1).padStart(2, '0'), {
      x: startX + 0.12, y: y + 0.13, w: 0.6, h: 0.36,
      fontSize: 14, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
    slide.addText(step.title ?? '', {
      x: startX + 0.9, y: y + 0.1, w: 3.5, h: 0.25,
      fontSize: 14, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.body,
    });
    if (step.description) {
      slide.addText(step.description, {
        x: startX + 0.9, y: y + 0.32, w: 7.4, h: 0.25,
        fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
      });
    }

    if (idx < steps.length - 1) {
      const arrowY = y + cardH + gapY / 2;
      slide.addShape('triangle', {
        x: 4.9, y: arrowY - 0.08, w: 0.16, h: 0.16,
        fill: { color: COLORS.border },
      } as any);
    }
  });

  addTheme05SpectrumBar(slide);
}

function renderTheme05ComparisonV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.8,
    fontSize: 38, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.95, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const leftColor = theme05SchemeColor(props.leftScheme);
  const rightColor = theme05SchemeColor(props.rightScheme);
  const cardW = 3.6;
  const cardH = 3.0;
  const cardY = 2.25;
  const gap = 0.9;
  const startX = (10 - cardW * 2 - gap) / 2;

  // 左栏
  slide.addShape('roundRect', {
    x: startX, y: cardY, w: cardW, h: cardH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);
  slide.addShape('rect', {
    x: startX, y: cardY, w: cardW, h: 0.08,
    fill: { color: leftColor },
  } as any);
  slide.addText(props.leftTitle ?? '', {
    x: startX + 0.2, y: cardY + 0.25, w: cardW - 0.4, h: 0.35,
    fontSize: 18, color: leftColor, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  const leftItems = (props.leftItems || []).slice(0, 6);
  leftItems.forEach((item: string, idx: number) => {
    slide.addText(item, {
      x: startX + 0.3, y: cardY + 0.75 + idx * 0.38, w: cardW - 0.5, h: 0.34,
      fontSize: 12, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
    });
  });

  // VS 徽章
  const vsX = startX + cardW + gap / 2;
  slide.addShape('ellipse', {
    x: vsX - 0.35, y: cardY + cardH / 2 - 0.35, w: 0.7, h: 0.7,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
  } as any);
  slide.addText(props.vsLabel ?? 'VS', {
    x: vsX - 0.35, y: cardY + cardH / 2 - 0.15, w: 0.7, h: 0.3,
    fontSize: 16, color: COLORS.secondary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
  });

  // 右栏
  const rightX = startX + cardW + gap;
  slide.addShape('roundRect', {
    x: rightX, y: cardY, w: cardW, h: cardH,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);
  slide.addShape('rect', {
    x: rightX, y: cardY, w: cardW, h: 0.08,
    fill: { color: rightColor },
  } as any);
  slide.addText(props.rightTitle ?? '', {
    x: rightX + 0.2, y: cardY + 0.25, w: cardW - 0.4, h: 0.35,
    fontSize: 18, color: rightColor, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  const rightItems = (props.rightItems || []).slice(0, 6);
  rightItems.forEach((item: string, idx: number) => {
    slide.addText(item, {
      x: rightX + 0.3, y: cardY + 0.75 + idx * 0.38, w: cardW - 0.5, h: 0.34,
      fontSize: 12, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
    });
  });

  addTheme05SpectrumBar(slide);
}

function renderTheme05ChartFunnelV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const stages = (props.stages || []).slice(0, 8);
  const hasConclusion = props.showConclusion !== false && !!props.conclusion && (!!props.conclusion.value || !!props.conclusion.label || !!props.conclusion.description);
  const funnelW = hasConclusion ? 5.7 : 8.7;
  const startX = 0.65;
  const startY = 2.15;
  const maxH = 3.0;

  if (stages.length > 0) {
    const maxValue = Math.max(...stages.map((s: any) => Number(s.value) || 0), 1);
    const layerH = maxH / stages.length;
    const topW = funnelW;
    stages.forEach((stage: any, idx: number) => {
      const value = Number(stage.value) || 0;
      const ratio = value / maxValue;
      const upperRatio = idx === 0 ? 1 : (Number(stages[idx - 1].value) || 0) / maxValue;
      const y = startY + idx * layerH;
      const topLayerW = topW * upperRatio;
      const bottomLayerW = topW * ratio;
      const xTop = startX + (funnelW - topLayerW) / 2;
      const xBottom = startX + (funnelW - bottomLayerW) / 2;
      const color = theme05SchemeColor(stage.scheme);

      // 用梯形路径模拟漏斗层
      const path = [
        `M ${xTop} ${y}`,
        `L ${xTop + topLayerW} ${y}`,
        `L ${xBottom + bottomLayerW} ${y + layerH - 0.04}`,
        `L ${xBottom} ${y + layerH - 0.04}`,
        'Z',
      ].join(' ');
      slide.addShape('custGeom' as any, {
        x: startX, y, w: funnelW, h: layerH,
        path,
        fill: { color },
      } as any);

      slide.addText(stage.name ?? '', {
        x: startX, y: y + 0.05, w: funnelW, h: 0.22,
        fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'top', fontFace: FONTS.body,
      });
      slide.addText(String(value), {
        x: startX, y: y + layerH - 0.28, w: funnelW, h: 0.2,
        fontSize: 10, color: COLORS.white, align: 'center', valign: 'bottom', fontFace: FONTS.heading,
      });
    });
  } else {
    slide.addText('（暂无漏斗数据）', {
      x: startX, y: 3.0, w: funnelW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasConclusion) {
    addTheme05ConclusionCard(slide, 6.55, 2.05, 2.8, 3.0, props.conclusion);
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05QuoteV2(slide: PptxSlide, props: any): void {
  const color = theme05SchemeColor(props.accentScheme);
  slide.addShape('roundRect', {
    x: 0.65, y: 1.8, w: 0.1, h: 2.0,
    fill: { color },
    rectRadius: 0.05,
  } as any);

  slide.addText('“', {
    x: 1.0, y: 1.2, w: 1.0, h: 0.6,
    fontSize: 80, color: COLORS.border, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(props.quote ?? '', {
    x: 1.0, y: 2.0, w: 8.35, h: 1.6,
    fontSize: 32, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });

  const source = [props.author, props.source].filter(Boolean).join(' · ');
  if (source) {
    slide.addText(source, {
      x: 1.0, y: 3.75, w: 8.35, h: 0.25,
      fontSize: 12, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ChartGaugeV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    slide.addText(props.kicker, {
      x: 0.65, y: 0.78, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.accent, fontFace: FONTS.mono, bold: true,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 0.7,
    fontSize: 38, color: COLORS.primary, bold: true, align: 'center', valign: 'top', fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }

  const value = Number(props.value) || 0;
  const min = Number(props.min) || 0;
  const max = Math.max(Number(props.max) || 100, value, min + 1);
  const chartX = 2.5;
  const chartY = 2.25;
  const chartW = 5.0;
  const chartH = 2.8;
  const color = theme05SchemeColor(props.scheme);

  slide.addChart('doughnut' as 'pie', [
    { name: props.label || '已完成', labels: ['已完成'], values: [value - min] },
    { name: '剩余', labels: ['剩余'], values: [max - value] },
  ], {
    x: chartX, y: chartY, w: chartW, h: chartH,
    chartColors: [color, COLORS.border],
    holeSize: 65,
    showValue: false,
    showLegend: false,
  } as any);

  slide.addText(`${value}${props.unit ?? ''}`, {
    x: chartX, y: chartY + 1.05, w: chartW, h: 0.55,
    fontSize: 36, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
  slide.addText(props.label ?? '完成度', {
    x: chartX, y: chartY + 1.55, w: chartW, h: 0.25,
    fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
  });

  addTheme05SpectrumBar(slide);
}

function renderTheme05BentoV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const startY = 2.35;
    const areaH = 2.85;
    const gap = 0.16;

    if (items.length === 1) {
      renderTheme05BentoCard(slide, items[0], 0.65, startY, 8.7, areaH);
    } else if (items.length === 2) {
      const cardW = (8.7 - gap) / 2;
      items.forEach((item: any, idx: number) => {
        renderTheme05BentoCard(slide, item, 0.65 + idx * (cardW + gap), startY, cardW, areaH);
      });
    } else if (items.length === 3) {
      renderTheme05BentoCard(slide, items[0], 0.65, startY, 4.25, areaH);
      const h2 = (areaH - gap) / 2;
      renderTheme05BentoCard(slide, items[1], 5.08, startY, 4.25, h2);
      renderTheme05BentoCard(slide, items[2], 5.08, startY + h2 + gap, 4.25, h2);
    } else if (items.length === 4) {
      const cardW = (8.7 - gap) / 2;
      const cardH = (areaH - gap) / 2;
      items.forEach((item: any, idx: number) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        renderTheme05BentoCard(slide, item, 0.65 + col * (cardW + gap), startY + row * (cardH + gap), cardW, cardH);
      });
    } else {
      const cols = 3;
      const cardW = (8.7 - gap * (cols - 1)) / cols;
      const cardH = (areaH - gap) / 2;
      items.forEach((item: any, idx: number) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        renderTheme05BentoCard(slide, item, 0.65 + col * (cardW + gap), startY + row * (cardH + gap), cardW, cardH);
      });
    }
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05BentoCard(slide: PptxSlide, item: any, x: number, y: number, w: number, h: number): void {
  const color = theme05SchemeColor(item.scheme);
  addTheme05Card(slide, x, y, w, h);
  slide.addShape('rect', {
    x, y, w, h: 0.06,
    fill: { color },
  } as any);
  slide.addText(item.value ?? '', {
    x: x + 0.14, y: y + 0.18, w: w - 0.28, h: 0.55,
    fontSize: 30, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(item.title ?? '', {
    x: x + 0.14, y: y + h - 0.55, w: w - 0.28, h: 0.25,
    fontSize: 11, color: COLORS.secondary, valign: 'bottom', fontFace: FONTS.body,
  });
  if (item.description) {
    slide.addText(item.description, {
      x: x + 0.14, y: y + 0.78, w: w - 0.28, h: Math.max(0.2, h - 1.05),
      fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
}

function renderTheme05CaseV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const metric = props.metric || {};
  const leftX = 0.65;
  const leftW = 3.6;
  const rightX = 4.55;
  const rightW = 4.8;
  const startY = 2.35;

  slide.addText(props.company ?? '', {
    x: leftX, y: startY, w: leftW, h: 0.55,
    fontSize: 26, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  slide.addText(`${metric.value ?? ''}`, {
    x: leftX, y: startY + 0.7, w: leftW, h: 0.8,
    fontSize: 56, color: COLORS.accent, bold: true, valign: 'top', fontFace: FONTS.heading,
  });
  if (metric.label) {
    slide.addText(metric.label, {
      x: leftX, y: startY + 1.45, w: leftW, h: 0.3,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const sections = [
    { key: 'challenge', label: '挑战' },
    { key: 'solution', label: '方案' },
    { key: 'result', label: '成果' },
  ].filter((s) => props[s.key]);
  const cardH = sections.length > 0 ? (2.8 - 0.16 * (sections.length - 1)) / sections.length : 0;
  sections.forEach((s, idx) => {
    const y = startY + idx * (cardH + 0.16);
    addTheme05Card(slide, rightX, y, rightW, cardH, true);
    slide.addText(s.label, {
      x: rightX + 0.14, y: y + 0.1, w: 0.8, h: 0.22,
      fontSize: 10, color: COLORS.white, bold: true, fontFace: FONTS.mono,
    });
    slide.addText(props[s.key], {
      x: rightX + 0.14, y: y + 0.34, w: rightW - 0.28, h: cardH - 0.48,
      fontSize: 12, color: COLORS.white, valign: 'top', fontFace: FONTS.body,
    });
  });

  addTheme05SpectrumBar(slide);
}

function renderTheme05EditorialV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const isRight = props.imageSide === 'right';
  const imgX = isRight ? 5.05 : 0.65;
  const textX = isRight ? 0.65 : 5.05;
  const imgW = 4.3;
  const textW = 4.3;
  const bodyY = 2.35;
  const imgH = 2.85;

  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, imgX, bodyY, imgW, imgH);
  } else {
    slide.addShape('roundRect', {
      x: imgX, y: bodyY, w: imgW, h: imgH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText('点击上传大图', {
      x: imgX, y: bodyY + 1.2, w: imgW, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (props.body) {
    slide.addText(props.body, {
      x: textX, y: bodyY, w: textW, h: props.pullQuote ? 1.75 : 2.75,
      fontSize: 13, color: COLORS.primary, valign: 'top', fontFace: FONTS.body,
    });
  }

  if (props.pullQuote) {
    const quoteY = props.body ? bodyY + 1.9 : bodyY;
    slide.addShape('roundRect', {
      x: textX, y: quoteY, w: textW, h: 1.3,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addShape('rect', {
      x: textX, y: quoteY, w: 0.08, h: 1.3,
      fill: { color: COLORS.accent },
    } as any);
    slide.addText(props.pullQuote, {
      x: textX + 0.18, y: quoteY + 0.16, w: textW - 0.3, h: 0.95,
      fontSize: 13, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05GalleryV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 4);
  if (items.length > 0) {
    const startY = 2.35;
    const areaH = 2.6;
    const gap = 0.16;

    if (items.length === 1) {
      addImageMaybe(slide, items[0].imageUrl, 0.65, startY, 8.7, areaH);
      if (items[0].caption) {
        slide.addText(items[0].caption, {
          x: 0.65, y: startY + areaH + 0.08, w: 8.7, h: 0.25,
          fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
        });
      }
    } else if (items.length === 2) {
      const w = (8.7 - gap) / 2;
      items.forEach((item: any, idx: number) => {
        addImageMaybe(slide, item.imageUrl, 0.65 + idx * (w + gap), startY, w, areaH);
        if (item.caption) {
          slide.addText(item.caption, {
            x: 0.65 + idx * (w + gap), y: startY + areaH + 0.08, w, h: 0.25,
            fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
          });
        }
      });
    } else if (items.length === 3) {
      const w = (8.7 - gap) / 2;
      const h = (areaH - gap) / 2;
      addImageMaybe(slide, items[0].imageUrl, 0.65, startY, w, areaH);
      addImageMaybe(slide, items[1].imageUrl, 0.65 + w + gap, startY, w, h);
      addImageMaybe(slide, items[2].imageUrl, 0.65 + w + gap, startY + h + gap, w, h);
      [0, 1, 2].forEach((idx) => {
        if (items[idx].caption) {
          const cx = idx === 0 ? 0.65 : 0.65 + w + gap;
          const cy = idx === 0 ? startY + areaH + 0.08 : startY + h + 0.08;
          slide.addText(items[idx].caption, {
            x: cx, y: cy, w, h: 0.25,
            fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
          });
        }
      });
    } else {
      const w = (8.7 - gap) / 2;
      const h = (areaH - gap) / 2;
      items.forEach((item: any, idx: number) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        addImageMaybe(slide, item.imageUrl, 0.65 + col * (w + gap), startY + row * (h + gap), w, h);
        if (item.caption) {
          slide.addText(item.caption, {
            x: 0.65 + col * (w + gap), y: startY + row * (h + gap) + h + 0.08, w, h: 0.25,
            fontSize: 12, color: COLORS.secondary, align: 'center', fontFace: FONTS.body,
          });
        }
      });
    }
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ProfileV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const avatarX = 0.85;
  const avatarY = 2.45;
  const avatarSize = 2.2;
  addTheme05Card(slide, avatarX - 0.2, avatarY - 0.2, avatarSize + 0.4, 2.9);
  if (props.avatarUrl) {
    addImageMaybe(slide, props.avatarUrl, avatarX, avatarY, avatarSize, avatarSize);
  } else {
    slide.addShape('ellipse', {
      x: avatarX, y: avatarY, w: avatarSize, h: avatarSize,
      fill: { color: COLORS.border },
    } as any);
    slide.addText('+ 头像', {
      x: avatarX, y: avatarY + 0.85, w: avatarSize, h: 0.4,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  const mainX = 3.55;
  const mainW = 5.8;
  let cursorY = 2.45;

  slide.addText(props.name ?? '', {
    x: mainX, y: cursorY, w: mainW, h: 0.5,
    fontSize: 28, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
  });
  cursorY += 0.55;
  slide.addText(`${props.role ?? ''}  ·  ${props.company ?? ''}`, {
    x: mainX, y: cursorY, w: mainW, h: 0.28,
    fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body,
  });
  cursorY += 0.45;

  if (props.quote) {
    slide.addShape('roundRect', {
      x: mainX, y: cursorY, w: mainW, h: 0.9,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);
    slide.addText(`"${props.quote}"`, {
      x: mainX + 0.14, y: cursorY + 0.12, w: mainW - 0.28, h: 0.65,
      fontSize: 13, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.body,
    });
    cursorY += 1.05;
  }

  const facts = (props.facts || []).slice(0, 4);
  if (facts.length > 0) {
    const cols = facts.length <= 2 ? 2 : 2;
    const rows = Math.ceil(facts.length / cols);
    const gap = 0.12;
    const cardW = (mainW - gap * (cols - 1)) / cols;
    const cardH = rows === 1 ? 0.7 : 0.55;
    facts.forEach((fact: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = mainX + col * (cardW + gap);
      const y = cursorY + row * (cardH + gap);
      slide.addText(fact.label ?? '', {
        x, y, w: cardW, h: 0.18,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body,
      });
      slide.addText(fact.value ?? '', {
        x, y: y + 0.2, w: cardW, h: 0.28,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05RoadmapV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const phases = (props.phases || []).slice(0, 4);
  if (phases.length > 0) {
    const startY = 2.45;
    const cardH = 2.5;
    const gap = 0.2;
    const cardW = (8.7 - gap * (phases.length - 1)) / phases.length;
    const lineY = startY + 0.35;

    slide.addShape('rect', {
      x: 0.65, y: lineY, w: 8.7, h: 0.04,
      fill: { color: COLORS.border },
    } as any);

    phases.forEach((phase: any, idx: number) => {
      const x = 0.65 + idx * (cardW + gap);
      const color = theme05SchemeColor(phase.scheme);
      const nodeSize = 0.36;
      const nodeX = x + (cardW - nodeSize) / 2;

      slide.addShape('ellipse', {
        x: nodeX, y: lineY - nodeSize / 2 + 0.02, w: nodeSize, h: nodeSize,
        fill: { color },
      } as any);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: nodeX, y: lineY - nodeSize / 2 + 0.02, w: nodeSize, h: nodeSize,
        fontSize: 11, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
      });

      addTheme05Card(slide, x, startY + 0.7, cardW, cardH - 0.7);
      slide.addShape('rect', {
        x, y: startY + 0.7, w: cardW, h: 0.06,
        fill: { color },
      } as any);
      slide.addText(phase.period ?? '', {
        x: x + 0.12, y: startY + 0.88, w: cardW - 0.24, h: 0.2,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      });
      slide.addText(phase.title ?? '', {
        x: x + 0.12, y: startY + 1.15, w: cardW - 0.24, h: 0.35,
        fontSize: 15, color: COLORS.primary, bold: true, valign: 'top', fontFace: FONTS.heading,
      });
      if (phase.description) {
        slide.addText(phase.description, {
          x: x + 0.12, y: startY + 1.55, w: cardW - 0.24, h: 1.1,
          fontSize: 11, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
        });
      }
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05ScorecardsV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const cards = (props.cards || []).slice(0, 4);
  if (cards.length > 0) {
    const startY = 2.45;
    const gap = 0.14;
    const cardH = (2.85 - gap * (cards.length - 1)) / cards.length;

    cards.forEach((card: any, idx: number) => {
      const y = startY + idx * (cardH + gap);
      const color = theme05SchemeColor(card.scheme);
      addTheme05Card(slide, 0.65, y, 8.7, cardH);
      slide.addShape('rect', {
        x: 0.65, y, w: 0.1, h: cardH,
        fill: { color },
      } as any);
      slide.addText(card.label ?? '', {
        x: 0.9, y: y + 0.12, w: 3.8, h: cardH - 0.24,
        fontSize: 15, color: COLORS.primary, bold: true, valign: 'middle', fontFace: FONTS.heading,
      });
      const valueText = `${card.value ?? ''}${card.unit ?? ''}`;
      slide.addText(valueText, {
        x: 4.9, y: y + 0.1, w: 2.2, h: cardH - 0.2,
        fontSize: 28, color: COLORS.primary, bold: true, align: 'right', valign: 'middle', fontFace: FONTS.heading,
      });
      if (card.change) {
        const changeColor = card.positive === false ? 'E85D4E' : '22C55E';
        slide.addShape('roundRect', {
          x: 7.25, y: y + (cardH - 0.42) / 2, w: 1.0, h: 0.42,
          fill: { color: changeColor }, rectRadius: 0.21,
        } as any);
        slide.addText(card.change, {
          x: 7.25, y: y + (cardH - 0.42) / 2 + 0.02, w: 1.0, h: 0.38,
          fontSize: 12, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
        });
      }
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05DonutV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 8).filter((it: any) => it && it.name);
  const hasConclusion = props.showConclusion !== false && !!props.conclusion && (!!props.conclusion.value || !!props.conclusion.label || !!props.conclusion.description);
  const chartW = hasConclusion ? 5.4 : 8.0;
  const chartX = 0.65;
  const chartY = 2.15;

  if (items.length > 0) {
    const total = items.reduce((sum: number, it: any) => sum + (Number(it.value) || 0), 0);
    const data = items.map((it: any) => ({
      name: it.name,
      labels: [it.name],
      values: [Number(it.value) || 0],
    }));

    slide.addChart('doughnut', data, {
      x: chartX, y: chartY, w: chartW, h: 3.1,
      chartColors: items.map((it: any) => theme05SchemeColor(it.scheme)),
      holeSize: 55,
      showValue: false,
      showLegend: false,
    });

    if (total > 0) {
      slide.addText(String(total), {
        x: chartX, y: chartY + 1.2, w: chartW, h: 0.55,
        fontSize: 34, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.heading,
      });
      if (props.unit) {
        slide.addText(props.unit, {
          x: chartX, y: chartY + 1.7, w: chartW, h: 0.25,
          fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
        });
      }
    }

    const legendX = chartX + chartW + 0.25;
    const legendW = hasConclusion ? 2.7 : 3.0;
    items.slice(0, 6).forEach((it: any, idx: number) => {
      const y = chartY + idx * 0.48;
      const color = theme05SchemeColor(it.scheme);
      slide.addShape('ellipse', {
        x: legendX, y: y + 0.1, w: 0.16, h: 0.16,
        fill: { color },
      } as any);
      slide.addText(it.name, {
        x: legendX + 0.24, y, w: legendW - 0.24, h: 0.22,
        fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
      const pct = total > 0 ? Math.round(((Number(it.value) || 0) / total) * 100) : 0;
      slide.addText(`${pct}%`, {
        x: legendX + 0.24, y: y + 0.22, w: legendW - 0.24, h: 0.18,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
      });
    });
  } else {
    slide.addText('（暂无图表数据）', {
      x: chartX, y: chartY + 1.2, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (hasConclusion) {
    addTheme05ConclusionCard(slide, 6.55, chartY, 2.8, 3.1, props.conclusion);
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05RadarV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const indicators = (props.indicators || []).slice(0, 10).filter((it: any) => it && it.name);
  const rawSeries = (props.series || []).slice(0, 5).filter((it: any) => it && it.name);
  const chartX = 0.65;
  const chartY = 2.15;
  const chartW = 6.0;
  const chartH = 3.15;

  if (indicators.length > 0 && rawSeries.length > 0) {
    const labels = indicators.map((it: any) => it.name);
    const data = rawSeries.map((s: any) => ({
      name: s.name,
      labels,
      values: (Array.isArray(s.values) ? s.values : String(s.values || '').split(/[,，]/).map((v: string) => parseFloat(v.trim())).filter((v: number) => !Number.isNaN(v))).slice(0, labels.length),
    })).filter((s: any) => s.values.length > 0);

    if (data.length > 0) {
      slide.addChart('radar', data, {
        x: chartX, y: chartY, w: chartW, h: chartH,
        chartColors: rawSeries.map((s: any) => theme05SchemeColor(s.scheme)),
        showValue: false,
        showLegend: false,
      });
    }

    const legendX = chartX + chartW + 0.3;
    const legendW = 2.8;
    rawSeries.forEach((s: any, idx: number) => {
      const y = chartY + idx * 0.32;
      const color = theme05SchemeColor(s.scheme);
      slide.addShape('ellipse', {
        x: legendX, y, w: 0.14, h: 0.14,
        fill: { color },
      } as any);
      slide.addText(s.name, {
        x: legendX + 0.22, y: y - 0.02, w: legendW - 0.22, h: 0.2,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body,
      });
    });
  } else {
    slide.addText('（暂无图表数据）', {
      x: chartX, y: chartY + 1.2, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);
}

function renderTheme05TreemapV1(slide: PptxSlide, props: any): void {
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
      x: 0.65, y: 1.85, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }

  const items = (props.items || []).slice(0, 16).filter((it: any) => it && it.name);
  const chartX = 0.65;
  const chartY = 2.35;
  const chartW = 8.7;
  const chartH = 2.85;

  if (items.length > 0) {
    slide.addShape('roundRect', {
      x: chartX, y: chartY, w: chartW, h: chartH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.12,
    } as any);

    const rects = layoutTreemap(items, chartX + 0.06, chartY + 0.06, chartW - 0.12, chartH - 0.12);
    rects.forEach(({ x, y, w, h, item }) => {
      const color = theme05SchemeColor(item.scheme);
      if (w < 0.15 || h < 0.15) return;

      slide.addShape('roundRect', {
        x, y, w, h,
        fill: { color },
        rectRadius: 0.06,
      } as any);

      const label = `${item.name ?? ''}\n${item.value ?? ''}`;
      const fontSize = Math.min(13, Math.max(8, Math.min(w, h) * 6));
      slide.addText(label, {
        x: x + 0.04, y: y + 0.04, w: w - 0.08, h: h - 0.08,
        fontSize, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
      });
    });
  } else {
    slide.addText('（暂无图表数据）', {
      x: chartX, y: chartY + 1.1, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  addTheme05SpectrumBar(slide);
}

type PptxRenderFn = (slide: PptxSlide, props: unknown) => void;

export function registerTheme05Renderers(registerPptxLayoutRenderer: (id: string, fn: PptxRenderFn) => void): void {
  registerPptxLayoutRenderer('theme05_cover_v1', renderTheme05CoverV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_table_of_contents_v1', renderTheme05TableOfContentsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chapter_v1', renderTheme05ChapterV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_content_v1', renderTheme05ContentV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_metric_v1', renderTheme05MetricV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chart_v1', renderTheme05ChartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_bubble_v1', renderTheme05BubbleV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_map_v1', renderTheme05MapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_rank_v1', renderTheme05RankV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_heatmap_v1', renderTheme05HeatmapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_waterfall_v1', renderTheme05WaterfallV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_quote_v1', renderTheme05QuoteV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_image_v1', renderTheme05ImageV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_versus_v1', renderTheme05VersusV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_process_v1', renderTheme05ProcessV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_timeline_v1', renderTheme05TimelineV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_matrix_v1', renderTheme05MatrixV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_quadrant_v1', renderTheme05QuadrantV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_risk_v1', renderTheme05RiskV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_closing_v1', renderTheme05ClosingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_cover_ex_v1', renderTheme05CoverExV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_cover_ex_v2', renderTheme05CoverExV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_cover_hero_v1', renderTheme05CoverHeroV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chapter_big_v1', renderTheme05ChapterBigV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chapter_split_v1', renderTheme05ChapterSplitV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chapter_numbered_v1', renderTheme05ChapterNumberedV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chapter_image_v1', renderTheme05ChapterImageV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_metric_hero_v1', renderTheme05MetricHeroV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_metric_capacity_v1', renderTheme05MetricCapacityV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_metric_delta_v1', renderTheme05MetricDeltaV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chart_share_v1', renderTheme05ChartShareV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chart_stacked_v1', renderTheme05ChartStackedV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chart_curve_v1', renderTheme05ChartCurveV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chart_peak_v1', renderTheme05ChartPeakV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chart_peaktrough_v1', renderTheme05ChartPeaktroughV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chart_cumulative_v1', renderTheme05ChartCumulativeV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_table_of_contents_v2', renderTheme05TableOfContentsV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_process_v2', renderTheme05ProcessV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_comparison_v1', renderTheme05ComparisonV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chart_funnel_v1', renderTheme05ChartFunnelV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_quote_v2', renderTheme05QuoteV2 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_chart_gauge_v1', renderTheme05ChartGaugeV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_bento_v1', renderTheme05BentoV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_case_v1', renderTheme05CaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_donut_v1', renderTheme05DonutV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_editorial_v1', renderTheme05EditorialV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_gallery_v1', renderTheme05GalleryV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_profile_v1', renderTheme05ProfileV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_radar_v1', renderTheme05RadarV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_roadmap_v1', renderTheme05RoadmapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_scorecards_v1', renderTheme05ScorecardsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme05_treemap_v1', renderTheme05TreemapV1 as PptxRenderFn);
}
