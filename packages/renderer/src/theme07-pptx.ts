// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
//
// theme07 PPTX 版式专属渲染器（从 export-pptx.ts 抽出）。
// 共享基础设施（全局 helper + 通用渲染器 + 类型 + theme07 局部 helper/const）从 export-pptx.ts 导入；
// theme01 通用渲染器从 theme01-pptx.ts 复用；其他已抽出主题的渲染器从各自 theme<K>-pptx.ts 复用。
// 注册通过 registerTheme07Renderers 回调注入。

import { type Slide as PptxSlide } from 'pptxgenjs';
import { addTheme07Kicker, FONTS, COLORS, addTheme07Card, addImageMaybe, addTheme07GlowLine, addTheme07Footer, resolveTheme07CssColor, getLayoutCoordinates } from './export-pptx.js';

export function renderTheme07CoverV1(slide: PptxSlide, props: any): void {
  if (props.tag) {
    addTheme07Kicker(slide, props.tag, 0.65, 0.55);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 4.7, h: 1.6,
    fontSize: 46, bold: true, fontFace: FONTS.heading, color: COLORS.primary,
    valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.65, w: 4.7, h: 0.6,
      fontSize: 15, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  // 底部标签
  if (props.tags && props.tags.length > 0) {
    const tags = props.tags.map((t: any) => typeof t === 'string' ? t : t.item).filter(Boolean);
    let tagX = 0.65;
    tags.slice(0, 6).forEach((tag: string) => {
      const w = Math.min(2.0, 0.25 + tag.length * 0.12);
      addTheme07Card(slide, tagX, 3.55, w, 0.32, 0.04, COLORS.white);
      slide.addText(tag, {
        x: tagX + 0.05, y: 3.6, w: w - 0.1, h: 0.22,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
      });
      tagX += w + 0.12;
    });
  }
  // 右侧图片区
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 5.6, 0.85, 3.75, 2.3);
  } else {
    addTheme07Card(slide, 5.6, 0.85, 3.75, 2.3, 0.08, COLORS.white);
  }
  // 右侧数据指标
  if (props.metrics && props.metrics.length > 0) {
    const metricY = 3.35;
    const metricW = 3.75 / Math.min(props.metrics.length, 4);
    props.metrics.slice(0, 4).forEach((m: any, idx: number) => {
      const x = 5.6 + idx * metricW;
      addTheme07Card(slide, x, metricY, metricW - 0.08, 0.9, 0.06, COLORS.white);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x, y: metricY + 0.12, w: metricW - 0.08, h: 0.35,
        fontSize: 20, color: m.accent ? COLORS.accent : COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      if (m.label) {
        slide.addText(m.label, {
          x, y: metricY + 0.48, w: metricW - 0.08, h: 0.2,
          fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
        });
      }
    });
  }
  addTheme07GlowLine(slide);
  addTheme07Footer(slide, props);
}

export function renderTheme07TableOfContentsV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.9, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addShape('line', {
    x1: 0.65, y1: 2.2, x2: 1.5, y2: 2.2,
    line: { color: COLORS.accent, width: 3 },
  } as any);
  if (props.entries && props.entries.length > 0) {
    const colW = 4.2;
    const rowH = 0.65;
    const startY = 2.5;
    props.entries.slice(0, 8).forEach((entry: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.65 + col * (colW + 0.3);
      const y = startY + row * rowH;
      const fill = entry.accent ? COLORS.accent : COLORS.white;
      addTheme07Card(slide, x, y, colW, rowH - 0.1, 0.08, fill);
      const numColor = entry.accent ? COLORS.white : COLORS.accent;
      const textColor = entry.accent ? COLORS.white : COLORS.primary;
      const pageColor = entry.accent ? COLORS.white : COLORS.secondary;
      slide.addText(entry.number ?? '', {
        x: x + 0.15, y: y + 0.1, w: 0.6, h: 0.35,
        fontSize: 20, color: numColor, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(entry.title ?? '', {
        x: x + 0.8, y: y + 0.13, w: colW - 1.4, h: 0.3,
        fontSize: 13, color: textColor, fontFace: FONTS.body,
      });
      if (entry.page) {
        slide.addText(entry.page, {
          x: x + colW - 0.65, y: y + 0.13, w: 0.5, h: 0.3,
          fontSize: 10, color: pageColor, fontFace: FONTS.mono, align: 'right',
        });
      }
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 4.95, w: 8.7, h: 0.3,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07ChapterV1(slide: PptxSlide, props: any): void {
  // 深色背景块
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: '11161D' },
  } as any);
  // 超大章节号
  slide.addText(props.number ?? '', {
    x: 0.65, y: 0.9, w: 3.5, h: 2.0,
    fontSize: 110, color: COLORS.accent, bold: true, fontFace: FONTS.heading, valign: 'top',
  });
  slide.addText(props.title ?? '', {
    x: 0.65, y: 2.9, w: 8.7, h: 0.85,
    fontSize: 42, bold: true, fontFace: FONTS.heading, color: COLORS.white, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 3.75, w: 8.7, h: 0.35,
      fontSize: 15, color: 'D0D4DC', fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.enSubtitle) {
    slide.addText(props.enSubtitle, {
      x: 0.65, y: 4.15, w: 8.7, h: 0.25,
      fontSize: 10, color: '8B93A3', fontFace: FONTS.mono, valign: 'top',
    });
  }
  if (props.tags && props.tags.length > 0) {
    const tagY = 4.7;
    let tagX = 0.65;
    const tags = props.tags.map((t: any) => typeof t === 'string' ? t : t.item).filter(Boolean);
    tags.slice(0, 6).forEach((tag: string) => {
      const w = Math.min(2.2, 0.3 + tag.length * 0.12);
      slide.addShape('roundRect', {
        x: tagX, y: tagY, w, h: 0.32,
        fill: { color: '1A2330' },
        line: { color: '3A4559', width: 1 },
        rectRadius: 0.04,
      } as any);
      slide.addText(tag, {
        x: tagX + 0.05, y: tagY + 0.05, w: w - 0.1, h: 0.22,
        fontSize: 10, color: 'D0D4DC', fontFace: FONTS.mono, align: 'center',
      });
      tagX += w + 0.15;
    });
  }
}

export function renderTheme07ContentV1(slide: PptxSlide, props: any): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 4.7, h: 0.8,
    fontSize: 32, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.75, w: 4.7, h: 0.5,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addShape('line', {
    x1: 0.65, y1: 2.3, x2: 1.5, y2: 2.3,
    line: { color: COLORS.accent, width: 3 },
  } as any);
  if (props.showConclusion !== false && props.conclusion) {
    const c = props.conclusion;
    addTheme07Card(slide, 0.65, 2.55, 4.7, 1.5, 0.08, COLORS.white);
    slide.addShape('rect', {
      x: 0.65, y: 2.55, w: 0.06, h: 1.5,
      fill: { color: COLORS.accent },
    } as any);
    if (c.value) {
      slide.addText(c.value, {
        x: 0.85, y: 2.7, w: 4.3, h: 0.5,
        fontSize: 32, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
    }
    if (c.label) {
      slide.addText(c.label, {
        x: 0.85, y: 3.2, w: 4.3, h: 0.25,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      });
    }
    if (c.description) {
      slide.addText(c.description, {
        x: 0.85, y: 3.5, w: 4.3, h: 0.5,
        fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    }
  }
  if (props.items && props.items.length > 0) {
    const startY = 0.95;
    const itemH = 0.75;
    props.items.slice(0, 6).forEach((item: any, idx: number) => {
      const y = startY + idx * itemH;
      addTheme07Card(slide, 5.6, y, 3.75, itemH - 0.1, 0.08, COLORS.white);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: 5.75, y: y + 0.1, w: 0.5, h: 0.35,
        fontSize: 20, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      if (item.title) {
        slide.addText(item.title, {
          x: 6.35, y: y + 0.1, w: 2.85, h: 0.3,
          fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.body,
        });
      }
      if (item.desc) {
        slide.addText(item.desc, {
          x: 6.35, y: y + 0.4, w: 2.85, h: 0.25,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }
}

export function renderTheme07SummaryV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 4.7, h: 0.7,
    fontSize: 32, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.7, w: 4.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addShape('line', {
    x1: 0.65, y1: 2.2, x2: 1.5, y2: 2.2,
    line: { color: COLORS.accent, width: 3 },
  } as any);
  if (props.points && props.points.length > 0) {
    const startY = 2.5;
    const pointH = 0.55;
    props.points.slice(0, 6).forEach((p: any, idx: number) => {
      const text = typeof p === 'string' ? p : p.text;
      const y = startY + idx * pointH;
      slide.addShape('ellipse', {
        x: 0.7, y: y + 0.1, w: 0.1, h: 0.1,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(text ?? '', {
        x: 0.95, y: y, w: 4.4, h: 0.5,
        fontSize: 13, color: COLORS.primary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }
  // 右侧指标卡
  if (props.metrics && props.metrics.length > 0) {
    const cardW = 1.78;
    const cardH = 0.85;
    props.metrics.slice(0, 4).forEach((m: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 5.6 + col * (cardW + 0.12);
      const y = 0.95 + row * (cardH + 0.12);
      addTheme07Card(slide, x, y, cardW, cardH, 0.06, COLORS.white);
      slide.addText(m.value ?? '', {
        x: x + 0.1, y: y + 0.1, w: cardW - 0.2, h: 0.35,
        fontSize: 22, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x: x + 0.1, y: y + 0.48, w: cardW - 0.2, h: 0.25,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
      });
    });
  }
  // 右侧结论面板
  if (props.conclusion) {
    addTheme07Card(slide, 5.6, 2.95, 3.75, 1.9, 0.08, COLORS.white);
    slide.addShape('rect', {
      x: 5.6, y: 2.95, w: 0.06, h: 1.9,
      fill: { color: COLORS.accent },
    } as any);
    slide.addText('CONCLUSION', {
      x: 5.85, y: 3.1, w: 3.3, h: 0.3,
      fontSize: 11, color: COLORS.accent, bold: true, fontFace: FONTS.mono, charSpacing: 2,
    });
    slide.addText(props.conclusion, {
      x: 5.85, y: 3.45, w: 3.3, h: 1.3,
      fontSize: 17, color: COLORS.primary, bold: true, fontFace: FONTS.heading, valign: 'top',
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 4.95, w: 8.7, h: 0.3,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07RankingV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.9, w: 8.7, h: 0.7,
    fontSize: 32, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addShape('line', {
    x1: 0.65, y1: 2.1, x2: 1.5, y2: 2.1,
    line: { color: COLORS.accent, width: 3 },
  } as any);
  if (props.entries && props.entries.length > 0) {
    const startY = 2.35;
    const rowH = 0.48;
    const maxValue = Math.max(1, ...props.entries.map((e: any) => parseFloat(e.value) || 0));
    props.entries.slice(0, 10).forEach((entry: any, idx: number) => {
      const y = startY + idx * rowH;
      const isAccent = entry.accent === true;
      const progress = entry.progress ?? Math.round(((parseFloat(entry.value) || 0) / maxValue) * 100);
      if (isAccent) {
        slide.addShape('roundRect', {
          x: 0.65, y, w: 8.7, h: rowH - 0.06,
          fill: { color: COLORS.accent },
          rectRadius: 0.06,
        } as any);
      } else {
        addTheme07Card(slide, 0.65, y, 8.7, rowH - 0.06, 0.06, COLORS.white);
      }
      const numColor = isAccent ? COLORS.white : COLORS.accent;
      const textColor = isAccent ? COLORS.white : COLORS.primary;
      const subColor = isAccent ? COLORS.white : COLORS.secondary;
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: 0.8, y: y + 0.06, w: 0.55, h: 0.3,
        fontSize: 17, color: numColor, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(entry.name ?? '', {
        x: 1.45, y: y + 0.08, w: 4.5, h: 0.3,
        fontSize: 14, color: textColor, bold: true, fontFace: FONTS.body,
      });
      if (entry.note) {
        slide.addText(entry.note, {
          x: 1.45, y: y + 0.28, w: 4.5, h: 0.15,
          fontSize: 9, color: subColor, fontFace: FONTS.mono,
        });
      }
      // 进度条背景
      slide.addShape('roundRect', {
        x: 5.8, y: y + 0.14, w: 2.4, h: 0.08,
        fill: { color: isAccent ? '5A7FA8' : 'E5E8ED' },
        rectRadius: 0.04,
      } as any);
      // 进度条填充
      if (progress > 0) {
        slide.addShape('roundRect', {
          x: 5.8, y: y + 0.14, w: 2.4 * (progress / 100), h: 0.08,
          fill: { color: isAccent ? COLORS.white : COLORS.accent },
          rectRadius: 0.04,
        } as any);
      }
      slide.addText(`${entry.value ?? ''}${props.unit ?? ''}`, {
        x: 8.3, y: y + 0.04, w: 0.9, h: 0.3,
        fontSize: 15, color: isAccent ? COLORS.white : COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'right',
      });
    });
  }
  if (props.legend && props.legend.length > 0) {
    let lx = 0.65;
    props.legend.slice(0, 4).forEach((item: any) => {
      slide.addShape('rect', {
        x: lx, y: 4.85, w: 0.12, h: 0.12,
        fill: { color: resolveTheme07CssColor(item.color) },
      } as any);
      slide.addText(item.label ?? '', {
        x: lx + 0.2, y: 4.82, w: 1.6, h: 0.2,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
      });
      lx += 1.8;
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.15, w: 8.7, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07CaseV1(slide: PptxSlide, props: any): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 4.7, h: 0.6,
    fontSize: 28, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.55, w: 4.7, h: 0.3,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.65, y: 1.95, w: 4.7, h: 0.6,
      fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  // 案例卡片
  if (props.cards && props.cards.length > 0) {
    const cardW = 2.85;
    const cardH = 3.3;
    const startY = 0.95;
    props.cards.slice(0, 3).forEach((card: any, idx: number) => {
      const x = 5.6 + idx * (cardW + 0.15);
      const fill = card.accent ? COLORS.accent : COLORS.white;
      addTheme07Card(slide, x, startY, cardW, cardH, 0.08, fill);
      const textColor = card.accent ? COLORS.white : COLORS.primary;
      const subColor = card.accent ? 'D0E0F0' : COLORS.secondary;
      // 卡片顶部图片区域（DROP MEDIA 占位）
      const imgAreaH = 1.35;
      const imgFill = card.accent ? '#E8F0E8' : '#F0F4EF';
      slide.addShape('roundRect', {
        x: x + 0.08, y: startY + 0.08, w: cardW - 0.16, h: imgAreaH - 0.06,
        fill: { color: imgFill }, rectRadius: 0.06,
        line: { color: card.accent ? '#B8CCB8' : '#D8E8D8', width: 0.5 },
      } as any);
      if (card.imageUrl) {
        addImageMaybe(slide, card.imageUrl, x + 0.1, startY + 0.1, cardW - 0.2, imgAreaH - 0.1);
      } else {
        // DROP MEDIA 文字
        if (card.accent) {
          slide.addShape('roundRect', {
            x: x + 0.15, y: startY + 0.15, w: 0.55, h: 0.22,
            fill: { color: '#7B9E7B' }, rectRadius: 0.11,
          } as any);
          slide.addText('重点', {
            x: x + 0.15, y: startY + 0.16, w: 0.55, h: 0.2,
            fontSize: 8, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center',
          });
        }
        slide.addText('DROP MEDIA', {
          x: x, y: startY + imgAreaH * 0.48, w: cardW, h: 0.22,
          fontSize: 9, color: '#A0C0A0', fontFace: FONTS.mono, align: 'center', charSpacing: 1.5,
        });
        if (card.company) {
          slide.addText(card.company, {
            x: x + 0.12, y: startY + imgAreaH - 0.32, w: cardW - 0.24, h: 0.22,
            fontSize: 11, bold: true, fontFace: FONTS.heading, color: subColor,
          });
        }
      }
      // 卡片内容从图片区域下方开始
      const contentStartY = startY + imgAreaH + 0.05;
      slide.addText(`案例 ${String(idx + 1).padStart(2, '0')}`, {
        x: x + 0.15, y: contentStartY, w: cardW - 0.3, h: 0.25,
        fontSize: 10, color: card.accent ? COLORS.white : COLORS.accent, bold: true, fontFace: FONTS.mono, charSpacing: 2,
      });
      if (card.company) {
        slide.addText(card.company, {
          x: x + 0.15, y: contentStartY + 0.3, w: cardW - 0.3, h: 0.4,
          fontSize: 20, color: textColor, bold: true, fontFace: FONTS.heading,
        });
      }
      if (card.tagline) {
        slide.addText(card.tagline, {
          x: x + 0.15, y: contentStartY + 0.7, w: cardW - 0.3, h: 0.28,
          fontSize: 11, color: subColor, fontFace: FONTS.body, valign: 'top',
        });
      }
      const tags = (card.tags || []).map((t: any) => typeof t === 'string' ? t : t.item).filter(Boolean);
      if (tags.length > 0) {
        let tx = x + 0.15;
        tags.slice(0, 4).forEach((tag: string) => {
          const tw = 0.25 + tag.length * 0.11;
          slide.addShape('roundRect', {
            x: tx, y: contentStartY + 1.02, w: tw, h: 0.26,
            fill: { color: card.accent ? '3A6A99' : COLORS.surface },
            rectRadius: 0.04,
          } as any);
          slide.addText(tag, {
            x: tx + 0.03, y: contentStartY + 1.04, w: tw - 0.06, h: 0.22,
            fontSize: 9, color: card.accent ? COLORS.white : COLORS.secondary, fontFace: FONTS.mono, align: 'center',
          });
          tx += tw + 0.06;
        });
      }
      if (card.metricValue || card.metricLabel) {
        slide.addShape('line', {
          x1: x + 0.15, y1: startY + cardH - 0.85, x2: x + cardW - 0.15, y2: startY + cardH - 0.85,
          line: { color: card.accent ? '5A7FA8' : COLORS.border, width: 1 },
        } as any);
        slide.addText(card.metricValue ?? '', {
          x: x + 0.15, y: startY + cardH - 0.75, w: cardW - 0.3, h: 0.4,
          fontSize: 24, color: card.accent ? COLORS.white : COLORS.accent, bold: true, fontFace: FONTS.heading,
        });
        slide.addText(card.metricLabel ?? '', {
          x: x + 0.15, y: startY + cardH - 0.35, w: cardW - 0.3, h: 0.25,
          fontSize: 9, color: subColor, fontFace: FONTS.mono,
        });
      }
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 4.95, w: 8.7, h: 0.3,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07SourcesV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.9, w: 7.2, h: 0.7,
    fontSize: 32, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.sampleSize?.value) {
    slide.addText(props.sampleSize.value, {
      x: 8.1, y: 0.85, w: 1.25, h: 0.5,
      fontSize: 40, color: COLORS.accent, bold: true, fontFace: FONTS.heading, align: 'right',
    });
    slide.addText(props.sampleSize.label ?? '', {
      x: 7.6, y: 1.35, w: 1.75, h: 0.3,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right',
    });
  }
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.4,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addShape('line', {
    x1: 0.65, y1: 2.1, x2: 1.5, y2: 2.1,
    line: { color: COLORS.accent, width: 3 },
  } as any);
  if (props.entries && props.entries.length > 0) {
    const colW = 4.2;
    const rowH = 0.65;
    const startY = 2.35;
    props.entries.slice(0, 16).forEach((entry: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.65 + col * (colW + 0.3);
      const y = startY + row * rowH;
      addTheme07Card(slide, x, y, colW, rowH - 0.08, 0.06, COLORS.white);
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: x + 0.15, y: y + 0.08, w: 0.45, h: 0.3,
        fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
      slide.addText(entry.name ?? '', {
        x: x + 0.65, y: y + 0.05, w: colW - 0.8, h: 0.25,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      if (entry.note) {
        slide.addText(entry.note, {
          x: x + 0.65, y: y + 0.28, w: colW - 0.8, h: 0.18,
          fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body,
        });
      }
      if (typeof entry.confidence === 'number') {
        const pct = Math.max(0, Math.min(100, entry.confidence));
        slide.addShape('roundRect', {
          x: x + colW - 1.05, y: y + 0.38, w: 0.9, h: 0.08,
          fill: { color: 'E5E8ED' },
          rectRadius: 0.04,
        } as any);
        slide.addShape('roundRect', {
          x: x + colW - 1.05, y: y + 0.38, w: 0.9 * (pct / 100), h: 0.08,
          fill: { color: COLORS.accent2 },
          rectRadius: 0.04,
        } as any);
        slide.addText(`${pct}/100`, {
          x: x + colW - 1.05, y: y + 0.46, w: 0.9, h: 0.15,
          fontSize: 8, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right',
        });
      }
    });
  }
  // 处理流程
  if (props.process && props.process.length > 0) {
    const steps = props.process.map((p: any) => typeof p === 'string' ? p : p.item).filter(Boolean);
    let px = 0.65;
    steps.slice(0, 6).forEach((step: string, idx: number) => {
      const pw = 0.45 + step.length * 0.12;
      slide.addShape('roundRect', {
        x: px, y: 4.55, w: pw, h: 0.32,
        fill: { color: COLORS.white },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.04,
      } as any);
      slide.addText(`${String(idx + 1).padStart(2, '0')} ${step}`, {
        x: px + 0.05, y: 4.58, w: pw - 0.1, h: 0.26,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
      });
      px += pw + 0.2;
      if (idx < steps.length - 1) {
        slide.addText('→', {
          x: px - 0.16, y: 4.55, w: 0.12, h: 0.32,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
        });
      }
    });
  }
  if (props.footnote) {
    slide.addShape('line', {
      x1: 0.65, y1: 4.9, x2: 9.35, y2: 4.9,
      line: { color: COLORS.border, width: 1 },
    } as any);
    slide.addText(props.footnote, {
      x: 0.65, y: 5.0, w: 8.7, h: 0.35,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07ChapterCapitalV1(slide: PptxSlide, props: any): void {
  renderTheme07ChapterV1(slide, props);
}

export function renderTheme07ChapterRiskV1(slide: PptxSlide, props: any): void {
  renderTheme07ChapterV1(slide, props);
}

export function renderTheme07ChapterAppendixV1(slide: PptxSlide, props: any): void {
  renderTheme07ChapterV1(slide, props);
}

export function renderTheme07MethodV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addShape('line', {
    x1: 0.65, y1: 2.15, x2: 1.5, y2: 2.15,
    line: { color: COLORS.accent, width: 3 },
  } as any);

  const steps = (props.steps || []).slice(0, 4);
  if (steps.length > 0) {
    const cardW = 8.7 / steps.length;
    const gap = 0.14;
    const usableW = cardW - gap;
    steps.forEach((step: any, idx: number) => {
      const x = 0.65 + idx * cardW;
      const y = 2.45;
      addTheme07Card(slide, x, y, usableW, 2.55, 0.08, COLORS.white);
      const num = (step.number || String(idx + 1).padStart(2, '0'));
      slide.addText(num, {
        x: x + 0.12, y: y + 0.12, w: usableW - 0.24, h: 0.4,
        fontSize: 24, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      if (step.title) {
        slide.addText(step.title, {
          x: x + 0.12, y: y + 0.62, w: usableW - 0.24, h: 0.35,
          fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.body,
        });
      }
      if (step.description) {
        slide.addText(step.description, {
          x: x + 0.12, y: y + 1.05, w: usableW - 0.24, h: 1.3,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
      if (idx < steps.length - 1) {
        slide.addText('→', {
          x: x + usableW + 0.02, y: y + 1.1, w: gap + 0.02, h: 0.3,
          fontSize: 12, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
        });
      }
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.05, w: 8.7, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07MonthlyV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const showConclusion = props.showConclusion !== false;
  const hasConclusion = showConclusion && (props.conclusionValue || props.conclusionLabel || props.conclusionDescription);
  const chartW = hasConclusion ? 5.6 : 8.7;

  const labels = (props.labels || []).slice(0, 24).map((it: any) => (typeof it === 'string' ? it : it?.item ?? ''));
  const series = (props.series || []).slice(0, 4);

  if (labels.length >= 2 && series.length > 0) {
    const chartData = series.map((s: any, idx: number) => {
      const values = (s.data || []).map((d: any) => (typeof d === 'number' ? d : Number(d?.item ?? 0) || 0));
      return {
        name: s.name || `系列 ${idx + 1}`,
        labels,
        values,
      };
    });
    slide.addChart('line', chartData, {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: ['2E5C8A', '7B9E7B', 'B8623E', '5B9BD5'],
      lineDataSymbol: 'circle',
      lineSmooth: true,
      showLegend: series.length > 1,
      showValue: false,
    } as any);
  } else {
    slide.addText('（暂无趋势数据）', {
      x: 0.65, y: 3.0, w: chartW, h: 0.6,
      fontSize: 16, color: COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.body,
    });
  }

  if (props.unit) {
    addTheme07Card(slide, 6.45, 2.25, 2.9, 0.7, 0.08, COLORS.white);
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
    addTheme07Card(slide, 6.45, panelY, 2.9, panelH, 0.08, COLORS.accent);
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

  addTheme07GlowLine(slide);
}

export function renderTheme07WaterfallV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const showConclusion = props.showConclusion !== false;
  const hasConclusion = showConclusion && (props.conclusionValue || props.conclusionLabel || props.conclusionDescription);
  const chartW = hasConclusion ? 5.6 : 8.7;

  const labels = (props.labels || []).slice(0, 12).map((it: any) => (typeof it === 'string' ? it : it?.item ?? ''));
  const values = (props.values || []).slice(0, 12).map((it: any) => (typeof it === 'number' ? it : Number(it?.item ?? 0) || 0));

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
      chartColors: [COLORS.surface, COLORS.accent2, COLORS.accentCool],
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
    addTheme07Card(slide, 6.45, 2.25, 2.9, 0.7, 0.08, COLORS.white);
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
    addTheme07Card(slide, 6.45, panelY, 2.9, panelH, 0.08, COLORS.accent);
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

  addTheme07GlowLine(slide);
}

export function renderTheme07MatrixV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  if (props.xAxisLabel) {
    slide.addText(props.xAxisLabel, {
      x: 7.2, y: 5.15, w: 2.2, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right',
    });
  }
  if (props.yAxisLabel) {
    slide.addText(props.yAxisLabel, {
      x: 0.65, y: 0.55, w: 1.5, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }

  const cells = (props.cells || []).slice(0, 4);
  const focusIndex = Math.max(0, Math.min(3, Number(props.focusIndex ?? 0)));
  if (cells.length === 4) {
    const cellW = 4.2;
    const cellH = 1.65;
    const startX = 0.65;
    const startY = 2.2;
    cells.forEach((cell: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (cellW + 0.18);
      const y = startY + row * (cellH + 0.18);
      const isFocus = cell.focus === true || idx === focusIndex;
      addTheme07Card(slide, x, y, cellW, cellH, 0.08, isFocus ? COLORS.accent : COLORS.white);
      const textColor = isFocus ? COLORS.white : COLORS.primary;
      const subColor = isFocus ? 'D0E0F0' : COLORS.secondary;
      if (cell.title) {
        slide.addText(cell.title, {
          x: x + 0.15, y: y + 0.12, w: cellW - 0.3, h: 0.35,
          fontSize: 16, color: textColor, bold: true, fontFace: FONTS.heading,
        });
      }
      if (cell.description) {
        slide.addText(cell.description, {
          x: x + 0.15, y: y + 0.55, w: cellW - 0.3, h: 0.95,
          fontSize: 10, color: subColor, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }

  // 轴线（与 HTML 十字轴对齐）：象限分隔虚线 + 箭头
  slide.addShape('line', { x1: 4.94, y1: 2.15, x2: 4.94, y2: 5.68, line: { color: COLORS.accent, width: 1, dashType: 'dash' } } as any);
  slide.addShape('line', { x1: 0.6, y1: 3.915, x2: 9.28, y2: 3.915, line: { color: COLORS.accent, width: 1, dashType: 'dash' } } as any);
  slide.addShape('triangle', { x: 9.2, y: 3.83, w: 0.14, h: 0.18, fill: { color: COLORS.accent }, rotate: 90 } as any);
  slide.addShape('triangle', { x: 4.86, y: 1.98, w: 0.18, h: 0.14, fill: { color: COLORS.accent } } as any);

  addTheme07GlowLine(slide);
}

export function renderTheme07RiskV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addShape('line', {
    x1: 0.65, y1: 2.15, x2: 1.5, y2: 2.15,
    line: { color: COLORS.accent, width: 3 },
  } as any);

  const items = (props.items || []).slice(0, 6);
  if (items.length > 0) {
    const colW = 4.2;
    const rowH = 1.05;
    const startY = 2.4;
    items.forEach((item: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = 0.65 + col * (colW + 0.18);
      const y = startY + row * rowH;
      const level = item.level === 'high' ? 'high' : item.level === 'low' ? 'low' : 'medium';
      const accentColor = level === 'high' ? COLORS.accentCool : level === 'medium' ? 'B45309' : COLORS.accent2;
      addTheme07Card(slide, x, y, colW, rowH - 0.1, 0.08, COLORS.white);
      slide.addShape('rect', {
        x, y, w: 0.05, h: rowH - 0.1,
        fill: { color: accentColor },
      } as any);
      slide.addText(item.risk ?? '', {
        x: x + 0.15, y: y + 0.1, w: colW - 0.3, h: 0.3,
        fontSize: 13, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(`影响：${item.impact ?? '中'}`, {
        x: x + 0.15, y: y + 0.38, w: colW - 0.3, h: 0.22,
        fontSize: 10, color: accentColor, fontFace: FONTS.mono,
      });
      if (item.response) {
        slide.addText(`应对：${item.response}`, {
          x: x + 0.15, y: y + 0.58, w: colW - 0.3, h: 0.35,
          fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.05, w: 8.7, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07CoverLeanV1(slide: PptxSlide, props: any): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }
  if (props.badge) {
    addTheme07Kicker(slide, props.badge);
  }
  if (props.headline) {
    slide.addText(props.headline, {
      x: 0.65, y: 0.9, w: 8.7, h: 0.35,
      fontSize: 16, color: COLORS.accent, bold: true, fontFace: FONTS.mono, charSpacing: 2,
    });
  }
  const titleY = props.headline ? 1.35 : 0.95;
  slide.addText(props.title ?? '', {
    x: 0.65, y: titleY, w: 7.2, h: 0.9,
    fontSize: 38, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: titleY + 1.0, w: 6.5, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const metrics = (props.metrics || []).slice(0, 3);
  if (metrics.length > 0) {
    const cardW = 2.75;
    const startX = 0.65;
    const gap = (8.7 - cardW * metrics.length) / (metrics.length - 1 || 1);
    metrics.forEach((m: any, idx: number) => {
      const x = metrics.length === 1 ? startX : startX + idx * (cardW + gap);
      const y = 4.2;
      addTheme07Card(slide, x, y, cardW, 0.95, 0.08, COLORS.white);
      slide.addText(`${m.value ?? ''}${m.unit ?? ''}`, {
        x: x + 0.12, y: y + 0.1, w: cardW - 0.24, h: 0.4,
        fontSize: 22, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(m.label ?? '', {
        x: x + 0.12, y: y + 0.52, w: cardW - 0.24, h: 0.3,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
      });
    });
  }
  addTheme07Footer(slide, props);
  addTheme07GlowLine(slide);
}

export function renderTheme07CoverSupplyChainV1(slide: PptxSlide, props: any): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }
  if (props.badge) {
    addTheme07Kicker(slide, props.badge);
  }
  if (props.headline) {
    slide.addText(props.headline, {
      x: 0.65, y: 0.9, w: 4.5, h: 0.35,
      fontSize: 16, color: COLORS.accent, bold: true, fontFace: FONTS.mono, charSpacing: 2,
    });
  }
  const titleY = props.headline ? 1.35 : 0.95;
  slide.addText(props.title ?? '', {
    x: 0.65, y: titleY, w: 4.5, h: 0.9,
    fontSize: 34, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: titleY + 1.0, w: 4.3, h: 0.5,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const channels = (props.channels || []).slice(0, 6);
  if (channels.length > 0) {
    const colW = 2.1;
    const rowH = 0.82;
    const startX = 5.35;
    const startY = 0.95;
    channels.forEach((c: any, idx: number) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (colW + 0.12);
      const y = startY + row * (rowH + 0.12);
      addTheme07Card(slide, x, y, colW, rowH, 0.06, COLORS.white);
      slide.addText(c.name ?? '', {
        x: x + 0.1, y: y + 0.08, w: colW - 0.2, h: 0.3,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(c.metric ?? '', {
        x: x + 0.1, y: y + 0.38, w: colW - 0.2, h: 0.3,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
      });
    });
  }
  addTheme07Footer(slide, props);
  addTheme07GlowLine(slide);
}

export function renderTheme07CoverRetailTrendV1(slide: PptxSlide, props: any): void {
  renderTheme07CoverV1(slide, props);
}

export function renderTheme07CoverSupplyStrategyV1(slide: PptxSlide, props: any): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
  }
  if (props.badge) {
    addTheme07Kicker(slide, props.badge);
  }
  if (props.hero) {
    slide.addText(props.hero, {
      x: 0.65, y: 1.0, w: 8.7, h: 0.4,
      fontSize: 18, color: COLORS.accent, bold: true, fontFace: FONTS.mono, align: 'center', charSpacing: 2,
    });
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 1.55, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, align: 'center', valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 2.35, w: 7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
    });
  }
  const kpis = (props.kpis || []).slice(0, 3);
  if (kpis.length > 0) {
    const cardW = 2.6;
    const gap = (8.7 - cardW * kpis.length) / (kpis.length - 1 || 1);
    kpis.forEach((k: any, idx: number) => {
      const x = kpis.length === 1 ? 3.7 : 0.65 + idx * (cardW + gap);
      const y = 3.4;
      addTheme07Card(slide, x, y, cardW, 1.1, 0.08, COLORS.white);
      slide.addText(`${k.value ?? ''}${k.unit ?? ''}`, {
        x: x + 0.12, y: y + 0.15, w: cardW - 0.24, h: 0.5,
        fontSize: 28, color: COLORS.accent, bold: true, fontFace: FONTS.heading, align: 'center',
      });
      slide.addText(k.label ?? '', {
        x: x + 0.12, y: y + 0.7, w: cardW - 0.24, h: 0.3,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
      });
    });
  }
  addTheme07Footer(slide, props);
  addTheme07GlowLine(slide);
}

export function renderTheme07PeakV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const labels = (props.labels || []).slice(0, 24).map((it: any) => (typeof it === 'string' ? it : it?.item ?? ''));
  const data = (props.data || []).slice(0, 24).map((it: any) => (typeof it === 'number' ? it : Number(it?.item ?? 0) || 0));
  const showConclusion = props.showConclusion !== false;
  const hasConclusion = showConclusion && (props.conclusionValue || props.conclusionLabel || props.conclusionDescription);
  const chartW = hasConclusion ? 5.6 : 8.7;
  if (labels.length >= 2 && data.length >= 2) {
    slide.addChart('line', [{ name: '趋势', labels, values: data }], {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: ['2E5C8A'],
      lineDataSymbol: 'circle',
      showValue: false,
    } as any);
  }
  if (props.unit) {
    addTheme07Card(slide, 6.45, 2.25, 2.9, 0.7, 0.08, COLORS.white);
    slide.addText('单位', { x: 6.6, y: 2.32, w: 2.6, h: 0.2, fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body });
    slide.addText(props.unit, { x: 6.6, y: 2.52, w: 2.6, h: 0.35, fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading });
  }
  if (hasConclusion) {
    const panelY = props.unit ? 3.05 : 2.25;
    const panelH = props.unit ? 2.2 : 3.0;
    addTheme07Card(slide, 6.45, panelY, 2.9, panelH, 0.08, COLORS.accent);
    let cursorY = panelY + 0.18;
    if (props.conclusionValue) {
      slide.addText(props.conclusionValue, { x: 6.65, y: cursorY, w: 2.5, h: 0.55, fontSize: 32, color: COLORS.white, bold: true, fontFace: FONTS.heading });
      cursorY += 0.58;
    }
    if (props.conclusionLabel) {
      slide.addText(props.conclusionLabel, { x: 6.65, y: cursorY, w: 2.5, h: 0.25, fontSize: 10, color: 'FFFFFF', fontFace: FONTS.body });
      cursorY += 0.32;
    }
    if (props.conclusionDescription) {
      slide.addText(props.conclusionDescription, { x: 6.65, y: cursorY, w: 2.5, h: panelH - (cursorY - panelY) - 0.25, fontSize: 10, color: 'FFFFFF', valign: 'top', fontFace: FONTS.body });
    }
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07CooldownV1(slide: PptxSlide, props: any): void {
  renderTheme07PeakV1(slide, props);
}

export function renderTheme07PeakTroughV1(slide: PptxSlide, props: any): void {
  renderTheme07PeakV1(slide, props);
}

export function renderTheme07DealSizeV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const items = (props.items || []).slice(0, 8).filter((i: any) => i && i.name);
  const hasConclusion = !!props.conclusion;
  const chartW = hasConclusion ? 5.6 : 8.7;
  if (items.length > 0) {
    const labels = items.map((i: any) => i.name);
    const values = items.map((i: any) => Number(i.value ?? 0) || 0);
    slide.addChart('pie', [{ name: '规模', labels, values }], {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: ['2E5C8A', '7B9E7B', 'B8623E', '5B9BD5', '7D8FA3', '9AAFC4'],
      showValue: true,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 9,
    } as any);
  }
  if (props.unit) {
    addTheme07Card(slide, 6.45, 2.25, 2.9, 0.7, 0.08, COLORS.white);
    slide.addText('单位', { x: 6.6, y: 2.32, w: 2.6, h: 0.2, fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body });
    slide.addText(props.unit, { x: 6.6, y: 2.52, w: 2.6, h: 0.35, fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading });
  }
  if (hasConclusion) {
    const panelY = props.unit ? 3.05 : 2.25;
    const panelH = props.unit ? 2.2 : 3.0;
    addTheme07Card(slide, 6.45, panelY, 2.9, panelH, 0.08, COLORS.white);
    slide.addText(props.conclusion, {
      x: 6.65, y: panelY + 0.18, w: 2.5, h: panelH - 0.36,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07AvgTicketV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const intervals = (props.intervals || []).slice(0, 8).map((it: any) => (typeof it === 'string' ? it : it?.item ?? ''));
  const values = (props.values || []).slice(0, 8).map((it: any) => (typeof it === 'number' ? it : Number(it?.item ?? 0) || 0));
  const hasConclusion = !!props.conclusion;
  const chartW = hasConclusion ? 5.6 : 8.7;
  if (intervals.length > 0 && values.length > 0) {
    slide.addChart('bar', [{ name: '数量', labels: intervals, values }], {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: ['2E5C8A'],
      showValue: true,
      dataLabelColor: COLORS.primary,
      dataLabelFontSize: 9,
      barGrouping: 'clustered',
      barDir: 'col',
    } as any);
  }
  if (props.unit) {
    addTheme07Card(slide, 6.45, 2.25, 2.9, 0.7, 0.08, COLORS.white);
    slide.addText('单位', { x: 6.6, y: 2.32, w: 2.6, h: 0.2, fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body });
    slide.addText(props.unit, { x: 6.6, y: 2.52, w: 2.6, h: 0.35, fontSize: 18, color: COLORS.primary, bold: true, fontFace: FONTS.heading });
  }
  if (hasConclusion) {
    const panelY = props.unit ? 3.05 : 2.25;
    const panelH = props.unit ? 2.2 : 3.0;
    addTheme07Card(slide, 6.45, panelY, 2.9, panelH, 0.08, COLORS.white);
    slide.addText(props.conclusion, {
      x: 6.65, y: panelY + 0.18, w: 2.5, h: panelH - 0.36,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07OutlookV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addShape('line', {
    x1: 0.65, y1: 2.15, x2: 1.5, y2: 2.15,
    line: { color: COLORS.accent, width: 3 },
  } as any);

  const points = (props.points || []).slice(0, 4);
  points.forEach((p: any, idx: number) => {
    const y = 2.45 + idx * 0.55;
    slide.addShape('ellipse', {
      x: 0.72, y: y + 0.06, w: 0.18, h: 0.18,
      fill: { color: COLORS.accent },
    } as any);
    slide.addText(String(idx + 1), {
      x: 0.72, y: y + 0.06, w: 0.18, h: 0.18,
      fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
    slide.addText(p.text ?? '', {
      x: 1.05, y: y, w: 4.0, h: 0.45,
      fontSize: 12, color: COLORS.primary, fontFace: FONTS.body, valign: 'top',
    });
  });

  const steps = (props.steps || []).slice(0, 4);
  steps.forEach((step: any, idx: number) => {
    const x = 5.55;
    const y = 2.25 + idx * 0.82;
    addTheme07Card(slide, x, y, 3.8, 0.74, 0.08, COLORS.white);
    slide.addText(step.date ?? '', {
      x: x + 0.1, y: y + 0.08, w: 0.8, h: 0.22,
      fontSize: 10, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
    });
    slide.addText(step.title ?? '', {
      x: x + 0.95, y: y + 0.06, w: 2.7, h: 0.25,
      fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(step.description ?? '', {
      x: x + 0.95, y: y + 0.32, w: 2.7, h: 0.35,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  });
  addTheme07GlowLine(slide);
}

export function renderTheme07RepricingV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const phases = (props.phases || []).slice(0, 5);
  if (phases.length > 0) {
    const cardW = 8.7 / phases.length - 0.15;
    phases.forEach((phase: any, idx: number) => {
      const x = 0.65 + idx * (cardW + 0.15);
      const y = 2.25;
      addTheme07Card(slide, x, y, cardW, 2.6, 0.08, COLORS.white);
      slide.addShape('ellipse', {
        x: x + 0.12, y: y + 0.12, w: 0.2, h: 0.2,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(phase.date ?? '', {
        x: x + 0.4, y: y + 0.1, w: cardW - 0.55, h: 0.25,
        fontSize: 11, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
      });
      slide.addText(phase.title ?? '', {
        x: x + 0.12, y: y + 0.45, w: cardW - 0.24, h: 0.35,
        fontSize: 14, color: COLORS.primary, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(phase.description ?? '', {
        x: x + 0.12, y: y + 0.85, w: cardW - 0.24, h: 1.6,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
      if (idx < phases.length - 1) {
        slide.addText('→', {
          x: x + cardW + 0.02, y: y + 1.1, w: 0.13, h: 0.3,
          fontSize: 12, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
        });
      }
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.05, w: 8.7, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07DealMapV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const hasConclusion = !!props.conclusion;
  const chartW = hasConclusion ? 5.6 : 8.7;
  const nodes = (props.nodes || []).slice(0, 16).filter((n: any) => n && n.name);
  if (nodes.length > 0) {
    const labels = nodes.map((n: any) => n.name);
    const values = nodes.map((n: any) => Number(n.value ?? 50) || 50);
    slide.addChart('line', [{ name: '节点', labels, values }], {
      x: 0.65, y: 2.25, w: chartW, h: 3.0,
      chartColors: ['2E5C8A'],
      showValue: false,
    } as any);
  }
  if (hasConclusion) {
    addTheme07Card(slide, 6.45, 2.25, 2.9, 3.0, 0.08, COLORS.white);
    slide.addText(props.conclusion, {
      x: 6.65, y: 2.43, w: 2.5, h: 2.64,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07ColdStartV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  if (props.title) {
    slide.addText(props.title, {
      x: 0.65, y: 0.95, w: 8.7, h: 0.6,
      fontSize: 32, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
    });
  }
  slide.addText(props.number ?? '', {
    x: 0.65, y: 1.85, w: 5.5, h: 1.2,
    fontSize: 72, bold: true, fontFace: FONTS.heading, color: COLORS.accent, valign: 'top',
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: 3.9, y: 2.25, w: 2.0, h: 0.5,
      fontSize: 24, bold: true, fontFace: FONTS.heading, color: COLORS.secondary, valign: 'top',
    });
  }
  if (props.label) {
    slide.addText(props.label, {
      x: 0.65, y: 3.15, w: 5.5, h: 0.3,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.65, y: 3.55, w: 5.2, h: 0.8,
      fontSize: 12, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const supporting = (props.supporting || []).slice(0, 3);
  supporting.forEach((item: any, idx: number) => {
    const y = 1.7 + idx * 1.05;
    addTheme07Card(slide, 6.1, y, 3.25, 0.9, 0.08, COLORS.white);
    slide.addText(item.value ?? '', {
      x: 6.25, y: y + 0.1, w: 2.95, h: 0.45,
      fontSize: 24, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    });
    slide.addText(item.label ?? '', {
      x: 6.25, y: y + 0.55, w: 2.95, h: 0.3,
      fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  });
  addTheme07GlowLine(slide);
}

export function renderTheme07AccelerateV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, align: 'center', valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 1.7, w: 7, h: 0.35,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, align: 'center', valign: 'top',
    });
  }
  slide.addText(`${props.value ?? ''}${props.unit ?? ''}`, {
    x: 0.65, y: 2.35, w: 8.7, h: 1.1,
    fontSize: 72, bold: true, fontFace: FONTS.heading, color: COLORS.accent, align: 'center', valign: 'top',
  });
  if (props.change || props.changeLabel) {
    const text = [props.change ?? '', props.changeLabel ?? ''].filter(Boolean).join(' · ');
    addTheme07Card(slide, 3.35, 3.6, 3.3, 0.65, 0.08, COLORS.white);
    slide.addText(text, {
      x: 3.5, y: 3.75, w: 3.0, h: 0.35,
      fontSize: 14, color: COLORS.accent2, bold: true, fontFace: FONTS.mono, align: 'center',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07InvestorV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const investors = (props.investors || []).slice(0, 9).filter((i: any) => i && i.name);
  if (investors.length > 0) {
    const colW = 2.8;
    const rowH = 0.9;
    const cols = 3;
    investors.forEach((inv: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = 0.65 + col * (colW + 0.12);
      const y = 2.25 + row * (rowH + 0.12);
      const isFocus = idx === 0;
      addTheme07Card(slide, x, y, colW, rowH, 0.08, isFocus ? COLORS.accent : COLORS.white);
      const textColor = isFocus ? COLORS.white : COLORS.primary;
      const subColor = isFocus ? 'D0E0F0' : COLORS.secondary;
      slide.addText(inv.name, {
        x: x + 0.12, y: y + 0.12, w: colW - 0.24, h: 0.35,
        fontSize: 15, color: textColor, bold: true, fontFace: FONTS.heading,
      });
      slide.addText([inv.type, inv.stage].filter(Boolean).join(' · '), {
        x: x + 0.12, y: y + 0.5, w: colW - 0.24, h: 0.28,
        fontSize: 9, color: subColor, fontFace: FONTS.mono,
      });
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07ActiveCapitalV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.company) {
    slide.addText(props.company, {
      x: 0.65, y: 2.15, w: 4.0, h: 0.45,
      fontSize: 22, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    });
  }
  if (props.tagline) {
    slide.addText(props.tagline, {
      x: 0.65, y: 2.6, w: 4.0, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body,
    });
  }
  const rounds = (props.rounds || []).slice(0, 6).filter((r: any) => r && r.round);
  if (rounds.length > 0) {
    const cardW = 8.7 / rounds.length - 0.15;
    rounds.forEach((r: any, idx: number) => {
      const x = 0.65 + idx * (cardW + 0.15);
      const y = 3.1;
      const isFocus = idx === rounds.length - 1;
      addTheme07Card(slide, x, y, cardW, 1.9, 0.08, isFocus ? COLORS.accent : COLORS.white);
      const textColor = isFocus ? COLORS.white : COLORS.primary;
      const subColor = isFocus ? 'D0E0F0' : COLORS.secondary;
      slide.addText(r.date ?? '', {
        x: x + 0.1, y: y + 0.1, w: cardW - 0.2, h: 0.2,
        fontSize: 10, color: isFocus ? COLORS.white : COLORS.accent, fontFace: FONTS.mono,
      });
      slide.addText(r.round, {
        x: x + 0.1, y: y + 0.35, w: cardW - 0.2, h: 0.35,
        fontSize: 14, color: textColor, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(r.amount ?? '', {
        x: x + 0.1, y: y + 0.75, w: cardW - 0.2, h: 0.45,
        fontSize: 22, color: textColor, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(r.investor ?? '', {
        x: x + 0.1, y: y + 1.25, w: cardW - 0.2, h: 0.45,
        fontSize: 9, color: subColor, fontFace: FONTS.mono, valign: 'top',
      });
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07ConcentrationV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 36, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const rows = (props.rows || []).slice(0, 10).filter((r: any) => r && r.name);
  if (rows.length > 0) {
    const rowH = 0.52;
    const startY = 2.25;
    rows.forEach((row: any, idx: number) => {
      const y = startY + idx * rowH;
      const isFocus = row.focus === true || idx === Number(props.focusIndex ?? 0);
      if (isFocus) {
        slide.addShape('roundRect', {
          x: 0.65, y, w: 8.7, h: rowH - 0.06,
          fill: { color: COLORS.accent }, rectRadius: 0.06,
        } as any);
      } else {
        addTheme07Card(slide, 0.65, y, 8.7, rowH - 0.06, 0.06, COLORS.white);
      }
      const textColor = isFocus ? COLORS.white : COLORS.primary;
      const valueColor = isFocus ? COLORS.white : COLORS.accent;
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: 0.85, y: y + 0.08, w: 0.5, h: 0.3,
        fontSize: 15, color: valueColor, bold: true, fontFace: FONTS.heading,
      });
      slide.addText(row.name, {
        x: 1.45, y: y + 0.1, w: 4.5, h: 0.3,
        fontSize: 14, color: textColor, bold: true, fontFace: FONTS.body,
      });
      slide.addText(row.value ?? '', {
        x: 6.8, y: y + 0.08, w: 1.2, h: 0.32,
        fontSize: 16, color: valueColor, bold: true, fontFace: FONTS.mono, align: 'right',
      });
      if (row.change) {
        slide.addText(row.change, {
          x: 8.1, y: y + 0.1, w: 0.9, h: 0.28,
          fontSize: 11, color: row.change.startsWith('-') ? COLORS.accentCool : COLORS.accent2, fontFace: FONTS.mono, align: 'right',
        });
      }
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07SyndicateV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.statement ?? '', {
    x: 0.65, y: 1.15, w: 8.7, h: 1.0,
    fontSize: 28, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 2.25, w: 8.7, h: 0.3,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const points = (props.points || []).slice(0, 4);
  points.forEach((p: any, idx: number) => {
    const y = 2.75 + idx * 0.55;
    slide.addShape('ellipse', {
      x: 0.72, y: y + 0.06, w: 0.18, h: 0.18,
      fill: { color: COLORS.accent },
    } as any);
    slide.addText(String(idx + 1), {
      x: 0.72, y: y + 0.06, w: 0.18, h: 0.18,
      fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
    slide.addText(p.text ?? '', {
      x: 1.05, y: y, w: 8.0, h: 0.45,
      fontSize: 12, color: COLORS.primary, fontFace: FONTS.body, valign: 'top',
    });
  });
  if (props.source) {
    slide.addText(props.source, {
      x: 0.65, y: 5.05, w: 8.7, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07SectorV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.9, w: 8.7, h: 0.75,
    fontSize: 34, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  slide.addShape('line', {
    x1: 0.65, y1: 2.1, x2: 1.5, y2: 2.1,
    line: { color: COLORS.accent, width: 3 },
  } as any);

  const leftW = 4.7;
  const rightX = 5.6;
  const rightW = 3.75;

  // 左侧描述
  if (props.description) {
    slide.addText(props.description, {
      x: 0.65, y: 2.35, w: leftW, h: 0.7,
      fontSize: 12, color: COLORS.primary, fontFace: FONTS.body, valign: 'top',
    });
  }

  // 左侧要点
  const bullets = (props.bullets || [])
    .map((b: any) => (typeof b === 'string' ? { title: b, desc: '' } : b))
    .filter((b: any) => b && (b.title || b.desc));
  if (bullets.length > 0) {
    const startY = props.description ? 3.15 : 2.35;
    const itemH = 0.55;
    bullets.slice(0, 6).forEach((item: any, idx: number) => {
      const y = startY + idx * itemH;
      slide.addText(String(idx + 1).padStart(2, '0'), {
        x: 0.65, y, w: 0.45, h: 0.35,
        fontSize: 16, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      if (item.title) {
        slide.addText(item.title, {
          x: 1.15, y, w: leftW - 0.5, h: 0.25,
          fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
        });
      }
      if (item.desc) {
        slide.addText(item.desc, {
          x: 1.15, y: y + 0.22, w: leftW - 0.5, h: 0.28,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
        });
      }
    });
  }

  // 右侧图表占位
  const hasChart = props.chartType && props.chartOption && Object.keys(props.chartOption).length > 0;
  let rightY = 0.9;
  if (hasChart) {
    addTheme07Card(slide, rightX, rightY, rightW, 1.9, 0.08, COLORS.white);
    slide.addText('CHART', {
      x: rightX, y: rightY + 0.75, w: rightW, h: 0.3,
      fontSize: 11, color: COLORS.secondary, bold: true, fontFace: FONTS.mono, align: 'center',
      charSpacing: 2,
    });
    rightY += 2.05;
  }

  // 右侧指标
  const metrics = (props.metrics || []).filter((m: any) => m && (m.value || m.label));
  if (metrics.length > 0) {
    const cardH = 0.85;
    const cols = Math.min(metrics.length, 2);
    metrics.slice(0, 4).forEach((m: any, idx: number) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cardW = (rightW - (cols - 1) * 0.1) / cols;
      const x = rightX + col * (cardW + 0.1);
      const y = rightY + row * (cardH + 0.1);
      addTheme07Card(slide, x, y, cardW, cardH, 0.06, m.accent ? COLORS.accent : COLORS.white);
      const valueColor = m.accent ? COLORS.white : COLORS.accent;
      const labelColor = m.accent ? COLORS.white : COLORS.secondary;
      slide.addText(m.value ?? '', {
        x: x + 0.08, y: y + 0.1, w: cardW - 0.16, h: 0.35,
        fontSize: 20, color: valueColor, bold: true, fontFace: FONTS.heading,
      });
      if (m.label) {
        slide.addText(m.label, {
          x: x + 0.08, y: y + 0.48, w: cardW - 0.16, h: 0.25,
          fontSize: 9, color: labelColor, fontFace: FONTS.mono,
        });
      }
    });
    rightY += Math.ceil(metrics.length / cols) * 0.95 + 0.1;
  }

  // 右侧洞察
  if (props.showInsight !== false && props.insight && (props.insight.value || props.insight.label || props.insight.description)) {
    const ins = props.insight;
    const insightH = ins.description ? 1.2 : 0.75;
    addTheme07Card(slide, rightX, rightY, rightW, insightH, 0.08, COLORS.white);
    slide.addShape('rect', {
      x: rightX, y: rightY, w: 0.06, h: insightH,
      fill: { color: COLORS.accent },
    } as any);
    let dy = 0.12;
    if (ins.value) {
      slide.addText(ins.value, {
        x: rightX + 0.15, y: rightY + dy, w: rightW - 0.3, h: 0.35,
        fontSize: 24, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      dy += 0.35;
    }
    if (ins.label) {
      slide.addText(ins.label, {
        x: rightX + 0.15, y: rightY + dy, w: rightW - 0.3, h: 0.2,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      });
      dy += 0.22;
    }
    if (ins.description) {
      slide.addText(ins.description, {
        x: rightX + 0.15, y: rightY + dy, w: rightW - 0.3, h: 0.55,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 4.95, w: 8.7, h: 0.3,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07TableV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.9, w: 8.7, h: 0.75,
    fontSize: 34, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.intro) {
    slide.addText(props.intro, {
      x: 0.65, y: props.subtitle ? 2.05 : 1.65, w: 8.7, h: 0.35,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const headers = (props.headers || [])
    .map((h: any) => (typeof h === 'string' ? h : h?.item))
    .filter(Boolean);
  const rows = (props.rows || [])
    .map((r: any) => {
      const cells = (r.cells || [])
        .slice(0, headers.length || 6)
        .map((c: any) => (typeof c === 'string' ? { value: c, accent: false } : { value: c?.value ?? '', accent: !!c?.accent }));
      return { cells, accent: !!r.accent };
    })
    .filter((r: any) => r.cells.some((c: any) => c.value));

  if (headers.length > 0 && rows.length > 0) {
    const tableW = 8.7;
    const startY = props.intro ? 2.45 : props.subtitle ? 2.1 : 1.65;
    const colW = tableW / headers.length;
    const rowH = Math.min(0.55, 3.0 / Math.max(rows.length, 5));
    const maxRows = Math.floor(3.4 / rowH);

    // 表头
    addTheme07Card(slide, 0.65, startY, tableW, rowH, 0.04, COLORS.accent);
    headers.forEach((h: string, idx: number) => {
      slide.addText(h, {
        x: 0.65 + idx * colW, y: startY + 0.08, w: colW, h: rowH - 0.16,
        fontSize: 11, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center', valign: 'middle',
      });
    });

    // 表格行
    rows.slice(0, maxRows).forEach((row: any, rIdx: number) => {
      const y = startY + (rIdx + 1) * rowH;
      const fill = row.accent ? COLORS.accent : COLORS.white;
      addTheme07Card(slide, 0.65, y, tableW, rowH - 0.02, 0.02, fill);
      row.cells.forEach((cell: any, cIdx: number) => {
        const textColor = row.accent ? COLORS.white : cell.accent ? COLORS.accent : COLORS.primary;
        slide.addText(cell.value, {
          x: 0.65 + cIdx * colW + 0.06, y: y + 0.06, w: colW - 0.12, h: rowH - 0.14,
          fontSize: 10, color: textColor, fontFace: FONTS.body, align: cIdx === 0 ? 'left' : 'center', valign: 'middle',
        });
      });
    });
  }

  if (props.conclusion) {
    slide.addText(props.conclusion, {
      x: 0.65, y: 4.7, w: 8.7, h: 0.5,
      fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 5.0, w: 8.7, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07CompanyV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.name ?? '', {
    x: 0.65, y: 0.9, w: 4.7, h: 0.75,
    fontSize: 38, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.tagline) {
    slide.addText(props.tagline, {
      x: 0.65, y: 1.6, w: 4.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  if (props.description) {
    slide.addText(props.description, {
      x: 0.65, y: props.tagline ? 2.05 : 1.6, w: 4.7, h: 1.1,
      fontSize: 12, color: COLORS.primary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const tags = (props.tags || [])
    .map((t: any) => (typeof t === 'string' ? t : t?.item))
    .filter(Boolean);
  if (tags.length > 0) {
    let tagX = 0.65;
    const tagY = 3.35;
    tags.slice(0, 6).forEach((tag: string) => {
      const w = Math.min(1.8, 0.25 + tag.length * 0.12);
      addTheme07Card(slide, tagX, tagY, w, 0.32, 0.04, COLORS.white);
      slide.addText(tag, {
        x: tagX + 0.05, y: tagY + 0.05, w: w - 0.1, h: 0.22,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
      });
      tagX += w + 0.1;
    });
  }

  const metrics = (props.metrics || []).filter((m: any) => m && (m.value || m.label));
  if (metrics.length > 0) {
    const metricY = tags.length > 0 ? 3.85 : 3.35;
    const metricW = 4.7 / Math.min(metrics.length, 4);
    metrics.slice(0, 4).forEach((m: any, idx: number) => {
      const x = 0.65 + idx * metricW;
      slide.addText(m.value ?? '', {
        x, y: metricY, w: metricW - 0.12, h: 0.35,
        fontSize: 20, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
      });
      if (m.label) {
        slide.addText(m.label, {
          x, y: metricY + 0.32, w: metricW - 0.12, h: 0.2,
          fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono,
        });
      }
    });
  }

  // 右侧图片区域（匹配参考 PPT DROP MEDIA 设计）
  const rightX = 5.6;
  const rightW = 3.75;
  const imgH = 2.6;
  const imgY = 0.85;
  addTheme07Card(slide, rightX, imgY, rightW, imgH, 0.08, COLORS.white);
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, rightX + 0.08, imgY + 0.08, rightW - 0.16, imgH - 0.16);
  } else {
    // DROP MEDIA 占位：标签 pill + 居中文字 + 底部名称
    if (props.imageTag) {
      slide.addShape('roundRect', {
        x: rightX + 0.15, y: imgY + 0.15, w: 1.1, h: 0.28,
        fill: { color: '#7B9E7B' }, rectRadius: 0.14,
      } as any);
      slide.addText(props.imageTag, {
        x: rightX + 0.15, y: imgY + 0.17, w: 1.1, h: 0.24,
        fontSize: 9, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center',
      });
    }
    slide.addText('DROP MEDIA', {
      x: rightX, y: imgY + imgH * 0.38, w: rightW, h: 0.3,
      fontSize: 11, color: '#90B090', fontFace: FONTS.mono, align: 'center', charSpacing: 2,
    });
    slide.addText(props.name ?? '', {
      x: rightX + 0.15, y: imgY + imgH - 0.45, w: rightW - 0.3, h: 0.32,
      fontSize: 16, bold: true, fontFace: FONTS.heading, color: COLORS.primary,
    });
  }

  if (props.quote) {
    addTheme07Card(slide, rightX, 3.35, rightW, 1.25, 0.08, COLORS.white);
    slide.addText(`“${props.quote}”`, {
      x: rightX + 0.12, y: 3.45, w: rightW - 0.24, h: 0.75,
      fontSize: 12, color: COLORS.primary, fontFace: FONTS.body, valign: 'top',
    });
    if (props.author) {
      slide.addText(`— ${props.author}`, {
        x: rightX + 0.12, y: 4.2, w: rightW - 0.24, h: 0.25,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 4.95, w: 8.7, h: 0.3,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07GeoV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.9, w: 8.7, h: 0.75,
    fontSize: 34, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const regions = (props.regions || [])
    .filter((r: any) => r && r.name)
    .slice(0, 8);
  const leftW = 4.7;
  const rightX = 5.6;
  const rightW = 3.75;

  if (regions.length > 0) {
    const startY = 2.15;
    const rowH = 0.55;
    regions.forEach((r: any, idx: number) => {
      const y = startY + idx * rowH;
      slide.addText(r.name, {
        x: 0.65, y, w: 1.5, h: 0.28,
        fontSize: 12, color: COLORS.primary, bold: true, fontFace: FONTS.body, valign: 'top',
      });
      const meta = [r.value, r.note].filter(Boolean).join(' · ');
      if (meta) {
        slide.addText(meta, {
          x: 2.2, y, w: 2.15, h: 0.28,
          fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, align: 'right', valign: 'top',
        });
      }
      // 进度条背景
      slide.addShape('roundRect', {
        x: 0.65, y: y + 0.3, w: leftW, h: 0.08,
        fill: { color: COLORS.light },
        rectRadius: 0.04,
      } as any);
      const pct = Math.max(0, Math.min(100, r.percent ?? 0));
      if (pct > 0) {
        slide.addShape('roundRect', {
          x: 0.65, y: y + 0.3, w: leftW * (pct / 100), h: 0.08,
          fill: { color: COLORS.accent },
          rectRadius: 0.04,
        } as any);
      }
    });
  }

  // 右侧装饰圆圈（匹配参考 PPT page053）
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, rightX + 0.1, 1.5, rightW - 0.2, 3.0);
  } else {
    // 装饰性半透明圆圈（pptxgenjs 仅支持 6 位 hex）
    slide.addShape('ellipse', {
      x: rightX + 0.3, y: 1.3, w: 2.4, h: 2.4,
      fill: { color: 'C8DCC8' }, line: { color: 'B8CCB8', width: 0.5 },
    } as any);
    slide.addShape('ellipse', {
      x: rightX + 0.8, y: 2.2, w: 1.8, h: 1.8,
      fill: { color: 'D8E8D8' }, line: { color: 'B8CCB8', width: 0.5 },
    } as any);
    slide.addShape('ellipse', {
      x: rightX + 1.6, y: 2.7, w: 1.3, h: 1.3,
      fill: { color: 'E8F2E8' }, line: { color: 'C8DCC8', width: 0.5 },
    } as any);
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 4.95, w: 8.7, h: 0.3,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07ClosingV1(slide: PptxSlide, props: any): void {
  // v2 坐标系统：从 theme07-layout-coordinates.json 读取，缺失时回退到默认值
  const coords = getLayoutCoordinates('theme07_closing_v1');
  const c = coords; // 简写
  const _x = (val: number | undefined, fallback: number) => (val ?? fallback);
  const _cx = (key: string, fallback: number) => _x((c as any)[key]?.x, fallback);
  const _cy = (key: string, fallback: number) => _x((c as any)[key]?.y, fallback);

  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }

  const images = (props.images || []).slice(0, 3);
  const hasImages = images.length > 0;
  // 有图片时内容区变窄，右侧留出图片区
  const contentW = hasImages ? 5.4 : 8.7;
  const imgAreaX = _cx('image', 6.2);
  const imgAreaW = _x(c.image?.w, 3.2);

  slide.addText(props.statement ?? '', {
    x: _cx('heading', 0.65), y: _cy('heading', 1.4), w: contentW, h: hasImages ? 1.2 : 1.6,
    fontSize: hasImages ? 32 : 40, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: _cx('title', 0.65), y: _cy('title', hasImages ? 2.55 : 3.1), w: contentW, h: 0.45,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }

  const points = (props.points || [])
    .map((p: any) => (typeof p === 'string' ? { text: p } : p))
    .filter((p: any) => p && p.text)
    .slice(0, 4);
  if (points.length > 0) {
    const startY = props.subtitle ? (hasImages ? 3.05 : 3.7) : (hasImages ? 2.55 : 3.1);
    const pointH = 0.42;
    points.forEach((p: any, idx: number) => {
      const y = startY + idx * pointH;
      slide.addShape('ellipse', {
        x: _cx('list', 0.65), y: y + 0.08, w: 0.1, h: 0.1,
        fill: { color: COLORS.accent },
      } as any);
      slide.addText(p.text, {
        x: 0.9, y, w: contentW - 0.35, h: 0.38,
        fontSize: 11, color: COLORS.primary, fontFace: FONTS.body, valign: 'top',
      });
    });
  }

  // 右侧图片区域（匹配参考 PPT page071）
  if (hasImages) {
    const imgH = 1.7;
    const imgGap = 0.15;
    images.forEach((img: any, idx: number) => {
      const iy = 1.0 + idx * (imgH + imgGap);
      addTheme07Card(slide, imgAreaX, iy, imgAreaW, imgH, 0.06, '#F0F4EF');
      if (img.url) {
        addImageMaybe(slide, img.url, imgAreaX + 0.06, iy + 0.06, imgAreaW - 0.12, imgH - 0.12);
      } else {
        // DROP MEDIA 占位
        if (img.tag) {
          slide.addShape('roundRect', {
            x: imgAreaX + 0.12, y: iy + 0.12, w: 0.9, h: 0.24,
            fill: { color: '#7B9E7B' }, rectRadius: 0.12,
          } as any);
          slide.addText(img.tag, {
            x: imgAreaX + 0.12, y: iy + 0.14, w: 0.9, h: 0.2,
            fontSize: 8, color: COLORS.white, bold: true, fontFace: FONTS.mono, align: 'center',
          });
        }
        slide.addText('DROP MEDIA', {
          x: imgAreaX, y: iy + imgH * 0.42, w: imgAreaW, h: 0.22,
          fontSize: 10, color: '#A0C0A0', fontFace: FONTS.mono, align: 'center', charSpacing: 1.5,
        });
        if (img.label) {
          slide.addText(img.label, {
            x: imgAreaX + 0.12, y: iy + imgH - 0.35, w: imgAreaW - 0.24, h: 0.25,
            fontSize: 11, bold: true, fontFace: FONTS.heading, color: COLORS.primary,
          });
        }
      }
    });
  }

  if (props.source) {
    slide.addText(`— ${props.source}`, {
      x: _cx('footer', 0.65), y: _cy('footer', 4.85), w: 8.7, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
    });
  }

  if (props.footnoteLeft || props.footnoteRight) {
    addTheme07Footer(slide, props);
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07ClosingQuoteV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  // 巨号引号装饰
  slide.addText('“', {
    x: 4.35, y: 0.45, w: 1.3, h: 1.1,
    fontSize: 80, bold: true, color: COLORS.accent, fontFace: FONTS.heading, align: 'center',
  });
  // 引语正文：将 [[关键词]] 渲染为强调色高亮 run
  const stmt = String(props.statement ?? '');
  const parts = stmt.split(/(\[\[.+?\]\])/g).filter(Boolean);
  const runs = parts.map((p: string) => {
    const m = p.match(/^\[\[(.+)\]\]$/);
    if (m) return { text: m[1], options: { color: COLORS.accent, bold: true } };
    return { text: p, options: { color: COLORS.primary } };
  });
  slide.addText(runs, {
    x: 0.8, y: 1.55, w: 8.4, h: 2.2,
    fontSize: 30, bold: true, fontFace: FONTS.heading, align: 'center', valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.95, w: 7.0, h: 0.5,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, align: 'center',
    });
  }
  if (props.source) {
    slide.addText(`— ${props.source}`, {
      x: 1.5, y: 4.55, w: 7.0, h: 0.3,
      fontSize: 12, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center',
    });
  }
  if (props.footnoteLeft || props.footnoteRight) {
    addTheme07Footer(slide, props);
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07StatHeroV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 32, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.65, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const hasImage = !!props.imageUrl;
  const numberW = hasImage ? 6.2 : 8.7;
  slide.addText(props.number ?? '', {
    x: 0.65, y: 2.35, w: numberW, h: 1.9,
    fontSize: 120, bold: true, fontFace: FONTS.heading, color: COLORS.accent, valign: 'top',
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: 0.65, y: 4.25, w: numberW, h: 0.5,
      fontSize: 24, bold: true, fontFace: FONTS.heading, color: COLORS.secondary, valign: 'top',
    });
  }
  if (props.caption) {
    slide.addText(props.caption, {
      x: 0.65, y: 4.8, w: numberW, h: 0.35,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  // 分隔标尺（纯装饰，仿 .lp-theme07-stat-hero-rule）
  if (props.showRule !== false) {
    slide.addShape('line', {
      x1: 0.65, y1: 4.15, x2: hasImage ? 6.85 : 5.0, y2: 4.15,
      line: { color: COLORS.accent, width: 1, transparency: 70 },
    } as any);
  }
  if (hasImage) {
    addImageMaybe(slide, props.imageUrl, 7.1, 2.35, 2.25, 2.35);
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07StatRowV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 32, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const stats = (props.stats || [])
    .filter((s: any) => s && s.value)
    .slice(0, 4);
  if (stats.length > 0) {
    const cols = stats.length;
    const gap = 0.2;
    const cardW = (8.7 - (cols - 1) * gap) / cols;
    const cardY = 2.3;
    const cardH = 2.05;
    const valueSize = cols >= 4 ? 38 : cols === 3 ? 44 : 52;
    stats.forEach((stat: any, idx: number) => {
      const x = 0.65 + idx * (cardW + gap);
      const focus = idx === (props.focusIndex ?? 0);
      addTheme07Card(slide, x, cardY, cardW, cardH, 0.08, focus ? COLORS.accent : COLORS.white);
      const valueColor = focus ? COLORS.white : COLORS.accent;
      const subColor = focus ? 'D0E0F0' : COLORS.secondary;
      const labelColor = focus ? COLORS.white : COLORS.primary;
      slide.addText(`${stat.value ?? ''}`, {
        x: x + 0.15, y: cardY + 0.28, w: cardW - 0.3, h: 0.8,
        fontSize: valueSize, bold: true, fontFace: FONTS.heading, color: valueColor, valign: 'top',
      });
      if (stat.unit) {
        slide.addText(stat.unit, {
          x: x + 0.15, y: cardY + 1.05, w: cardW - 0.3, h: 0.3,
          fontSize: 13, color: subColor, fontFace: FONTS.mono, valign: 'top',
        });
      }
      if (stat.label) {
        slide.addText(stat.label, {
          x: x + 0.15, y: cardY + 1.4, w: cardW - 0.3, h: 0.3,
          fontSize: 12, bold: true, color: labelColor, fontFace: FONTS.body, valign: 'top',
        });
      }
      if (props.showNotes !== false && stat.note) {
        slide.addText(stat.note, {
          x: x + 0.15, y: cardY + 1.72, w: cardW - 0.3, h: 0.25,
          fontSize: 10, color: subColor, fontFace: FONTS.mono, valign: 'top',
        });
      }
    });
  }
  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.65, y: 4.6, w: 8.7, h: 0.3,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07StatChartV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 32, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  // 左侧结论数字
  slide.addText(props.number ?? '', {
    x: 0.65, y: 2.35, w: 3.4, h: 1.8,
    fontSize: 96, bold: true, fontFace: FONTS.heading, color: COLORS.accent, valign: 'top',
  });
  if (props.unit) {
    slide.addText(props.unit, {
      x: 0.65, y: 4.1, w: 3.4, h: 0.4,
      fontSize: 20, bold: true, fontFace: FONTS.heading, color: COLORS.secondary, valign: 'top',
    });
  }
  if (props.label) {
    slide.addText(props.label, {
      x: 0.65, y: 4.55, w: 3.4, h: 0.4,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  // 右侧柱状序列
  const series = (props.series || [])
    .filter((s: any) => s && s.label != null)
    .slice(0, 8);
  if (series.length > 0) {
    const chartX = 4.5;
    const chartY = 2.45;
    const chartW = 4.5;
    const chartH = 2.0;
    const maxValue = Math.max(1, ...series.map((s: any) => Number(s.value) || 0));
    const slotW = chartW / series.length;
    const barW = slotW * 0.6;
    const points: Array<{ x: number; y: number }> = [];
    series.forEach((item: any, idx: number) => {
      const value = Number(item.value) || 0;
      const h = Math.max(0.05, (value / maxValue) * chartH);
      const x = chartX + idx * slotW + (slotW - barW) / 2;
      const y = chartY + chartH - h;
      const focus = idx === (props.focusIndex ?? 0);
      slide.addShape('rect', {
        x, y, w: barW, h,
        fill: { color: focus ? resolveTheme07CssColor('var(--lp-accent-cool)', COLORS.accent) : COLORS.accent, transparency: focus ? 0 : 25 },
        line: { type: 'none' },
      } as any);
      points.push({ x: x + barW / 2, y });
      if (props.showValues !== false) {
        slide.addText(`${item.value ?? 0}`, {
          x, y: y - 0.32, w: barW, h: 0.3,
          fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center', valign: 'top',
        });
      }
      slide.addText(`${item.label ?? ''}`, {
        x: chartX + idx * slotW, y: chartY + chartH + 0.06, w: slotW, h: 0.3,
        fontSize: 9, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center', valign: 'top',
      });
    });
    // 趋势线（连接柱顶中点）
    if (props.showTrend !== false && points.length > 1) {
      const trendColor = resolveTheme07CssColor('var(--lp-accent-2)', COLORS.accent2);
      for (let i = 0; i < points.length - 1; i++) {
        slide.addShape('line', {
          x1: points[i].x, y1: points[i].y, x2: points[i + 1].x, y2: points[i + 1].y,
          line: { color: trendColor, width: 1.5, transparency: 20 },
        } as any);
      }
    }
    if (props.chartCaption) {
      slide.addText(props.chartCaption, {
        x: chartX, y: chartY + chartH + 0.4, w: chartW, h: 0.3,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, valign: 'top',
      });
    }
  }
  addTheme07GlowLine(slide);
}

export function renderTheme07StatCompareV1(slide: PptxSlide, props: any): void {
  if (props.kicker) {
    addTheme07Kicker(slide, props.kicker);
  }
  slide.addText(props.title ?? '', {
    x: 0.65, y: 0.95, w: 8.7, h: 0.7,
    fontSize: 32, bold: true, fontFace: FONTS.heading, color: COLORS.primary, valign: 'top',
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.65, y: 1.6, w: 8.7, h: 0.4,
      fontSize: 14, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  const focusSide = props.focusSide ?? 'right';
  const cardY = 2.3;
  const cardW = 3.7;
  const cardH = 2.0;
  const sides: Array<{ data: any; focus: boolean; x: number }> = [
    { data: props.left ?? {}, focus: focusSide === 'left', x: 0.65 },
    { data: props.right ?? {}, focus: focusSide === 'right', x: 5.65 },
  ];
  sides.forEach((side) => {
    addTheme07Card(slide, side.x, cardY, cardW, cardH, 0.08, side.focus ? COLORS.accent : COLORS.white);
    const valueColor = side.focus ? COLORS.white : COLORS.accent;
    const subColor = side.focus ? 'D0E0F0' : COLORS.secondary;
    const labelColor = side.focus ? COLORS.white : COLORS.primary;
    slide.addText(`${side.data.value ?? ''}`, {
      x: side.x + 0.2, y: cardY + 0.35, w: cardW - 0.4, h: 0.9,
      fontSize: 58, bold: true, fontFace: FONTS.heading, color: valueColor, valign: 'top',
    });
    if (side.data.unit) {
      slide.addText(side.data.unit, {
        x: side.x + 0.2, y: cardY + 1.25, w: cardW - 0.4, h: 0.3,
        fontSize: 16, color: subColor, fontFace: FONTS.mono, valign: 'top',
      });
    }
    if (side.data.label) {
      slide.addText(side.data.label, {
        x: side.x + 0.2, y: cardY + 1.6, w: cardW - 0.4, h: 0.3,
        fontSize: 12, bold: true, color: labelColor, fontFace: FONTS.body, valign: 'top',
      });
    }
  });
  // 中轴
  if (props.showAxis !== false) {
    slide.addShape('line', {
      x1: 5.0, y1: cardY, x2: 5.0, y2: cardY + cardH,
      line: { color: COLORS.border, width: 1, transparency: 50 },
    } as any);
  }
  // 差值徽标
  if (props.showDelta !== false && props.delta) {
    slide.addText(props.delta, {
      x: 4.25, y: 2.95, w: 1.5, h: 0.5,
      fontSize: 24, bold: true, color: resolveTheme07CssColor('var(--lp-accent-cool)', COLORS.accentCool ?? COLORS.accent), fontFace: FONTS.heading, align: 'center', valign: 'middle',
    });
    if (props.deltaLabel) {
      slide.addText(props.deltaLabel, {
        x: 4.2, y: 3.5, w: 1.6, h: 0.3,
        fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'center', valign: 'top',
      });
    }
  }
  if (props.caption) {
    slide.addText(props.caption, {
      x: 0.65, y: 4.55, w: 8.7, h: 0.35,
      fontSize: 13, color: COLORS.secondary, fontFace: FONTS.body, valign: 'top',
    });
  }
  addTheme07GlowLine(slide);
}

type PptxRenderFn = (slide: PptxSlide, props: unknown) => void;

export function registerTheme07Renderers(registerPptxLayoutRenderer: (id: string, fn: PptxRenderFn) => void): void {
  registerPptxLayoutRenderer('theme07_cover_v1', renderTheme07CoverV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_table_of_contents_v1', renderTheme07TableOfContentsV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_chapter_v1', renderTheme07ChapterV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_chapter_capital_v1', renderTheme07ChapterCapitalV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_chapter_risk_v1', renderTheme07ChapterRiskV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_chapter_appendix_v1', renderTheme07ChapterAppendixV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_content_v1', renderTheme07ContentV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_summary_v1', renderTheme07SummaryV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_ranking_v1', renderTheme07RankingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_case_v1', renderTheme07CaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_case_grid_v1', renderTheme07CaseV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_sources_v1', renderTheme07SourcesV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_method_v1', renderTheme07MethodV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_monthly_v1', renderTheme07MonthlyV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_waterfall_v1', renderTheme07WaterfallV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_matrix_v1', renderTheme07MatrixV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_risk_v1', renderTheme07RiskV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_cover_lean_v1', renderTheme07CoverLeanV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_cover_supply_chain_v1', renderTheme07CoverSupplyChainV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_cover_retail_trend_v1', renderTheme07CoverRetailTrendV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_cover_supply_strategy_v1', renderTheme07CoverSupplyStrategyV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_peak_v1', renderTheme07PeakV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_cooldown_v1', renderTheme07CooldownV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_peak_trough_v1', renderTheme07PeakTroughV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_deal_size_v1', renderTheme07DealSizeV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_avg_ticket_v1', renderTheme07AvgTicketV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_outlook_v1', renderTheme07OutlookV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_repricing_v1', renderTheme07RepricingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_deal_map_v1', renderTheme07DealMapV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_cold_start_v1', renderTheme07ColdStartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_accelerate_v1', renderTheme07AccelerateV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_investor_v1', renderTheme07InvestorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_active_capital_v1', renderTheme07ActiveCapitalV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_concentration_v1', renderTheme07ConcentrationV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_syndicate_v1', renderTheme07SyndicateV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_company_openai_v1', renderTheme07CompanyV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_company_figure_v1', renderTheme07CompanyV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_company_ssi_v1', renderTheme07CompanyV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_geo_center_v1', renderTheme07GeoV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_region_cluster_v1', renderTheme07GeoV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_resource_triad_v1', renderTheme07GeoV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_quote_v1', renderTheme07ClosingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_closing_v1', renderTheme07ClosingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_closing_quote_v1', renderTheme07ClosingQuoteV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_forward_v1', renderTheme07ClosingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_about_lab_v1', renderTheme07ClosingV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_stat_hero_v1', renderTheme07StatHeroV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_stat_row_v1', renderTheme07StatRowV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_stat_chart_v1', renderTheme07StatChartV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_stat_compare_v1', renderTheme07StatCompareV1 as PptxRenderFn);
  // 行业纵深版式（P 批次）：统一复用通用 sector 渲染器，字段与 Theme07SectorLayoutProps 一致
  registerPptxLayoutRenderer('theme07_knowledge_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_legal_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_healthcare_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_finance_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_compute_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_chip_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_robotics_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_autonomy_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_safety_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_content_gen_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_education_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_support_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_sales_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_low_code_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_open_source_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_alignment_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_early_stage_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_deal_structure_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_investor_mix_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_resource_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_alliance_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_ecosystem_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_revenue_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_compliance_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_margin_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_moat_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_strategy_infra_v1', renderTheme07SectorV1 as PptxRenderFn);
  registerPptxLayoutRenderer('theme07_strategy_vertical_v1', renderTheme07SectorV1 as PptxRenderFn);
}
