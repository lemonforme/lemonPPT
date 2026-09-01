// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 术语表页（glossary_v1）
 * 情绪：daylight | 骨架：sidebar
 * 左侧标题 + 右侧术语卡片列表。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11GlossaryV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  terms?: { term: string; definition: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11GlossaryV1Meta: LayoutMeta = {
  id: 'theme11_glossary_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 术语表页',
  description: '左侧标题 + 右侧术语卡片列表',
  needsMedia: false,
  tags: ['glossary', 'content', 'sidebar', 'light-stream'],
  contentShape: 'glossary',
};

export const theme11GlossaryV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '术语表' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '关键概念速查' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'GLOSSARY' },
    { key: 'terms', label: '术语', type: 'array', maxItems: 4, defaultValue: [
      { term: 'Layout', definition: '版式，指一页幻灯片的视觉结构与内容组织方式。' },
      { term: 'Mood', definition: '情绪，主题中预定义的色彩氛围与背景渐变。' },
      { term: 'Token', definition: '设计令牌，颜色、字体、间距等视觉变量的真源。' },
      { term: 'Slot', definition: '可编辑字段或图位，用于承载用户内容。' },
    ], itemSchema: [{ key: 'term', label: '术语', type: 'text', inlineEditable: true }, { key: 'definition', label: '定义', type: 'textarea', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11GlossaryV1(props: Theme11GlossaryV1Props): ReactNode {
  const { title, subtitle, eyebrow, terms = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'accent' | 'violet' | 'orange' | 'green'> = ['accent', 'violet', 'orange', 'green'];

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme11-glossary">
      <div className="lp-theme11-glossary-left">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-glossary-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-glossary-list">
        {terms.slice(0, 4).map((t, i) => (
          <Card key={i} className={`lp-theme11-glossary-card lp-theme11-tile-tone-${tones[i % tones.length]} lp-rise`} padding="medium" style={{ animationDelay: `${i * 70}ms` }}>
            <EditableField prop={`terms.${i}.term`} slideIdx={s} editable={e} as="h3" className="lp-theme11-glossary-term">{t.term}</EditableField>
            <EditableField prop={`terms.${i}.definition`} slideIdx={s} editable={e} as="p" className="lp-theme11-glossary-def">{t.definition}</EditableField>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
