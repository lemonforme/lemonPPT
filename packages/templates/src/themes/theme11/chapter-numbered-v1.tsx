// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 编号章节页（chapter_numbered_v1）
 * 情绪：daylight | 骨架：split
 * 左侧大编号与标题 + 右侧章节要点列表。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, GradientCard, IconChip, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11ChapterNumberedV1Props {
  number?: string;
  title: string;
  subtitle?: string;
  items?: string[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChapterNumberedV1Meta: LayoutMeta = {
  id: 'theme11_chapter_numbered_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 编号章节页',
  description: '左侧大编号与标题 + 右侧章节要点列表',
  needsMedia: false,
  tags: ['chapter', 'numbered', 'light-stream'],
  contentShape: 'chapter-numbered',
};

export const theme11ChapterNumberedV1Schema: PropsSchema = {
  fields: [
    { key: 'number', label: '章节编号', type: 'text', inlineEditable: true, defaultValue: '02' },
    { key: 'title', label: '章节标题', type: 'textarea', inlineEditable: true, defaultValue: '市场洞察' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本章节覆盖的关键议题' },
    { key: 'items', label: '要点', type: 'array', maxItems: 5, defaultValue: ['行业规模与增速', '竞争格局变化', '用户行为趋势', '机会窗口判断'], itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ChapterNumberedV1(props: Theme11ChapterNumberedV1Props): ReactNode {
  const { number, title, subtitle, items = [], mood = 'sunset', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green' | 'cyan'> = ['blue', 'violet', 'orange', 'green', 'cyan'];

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-chapter-numbered">
      <div className="lp-theme11-chapter-numbered-left" data-number={number}>
        {number && (
          <GradientCard tone="blue" className="lp-theme11-chapter-numbered-badge lp-rise">
            <span className="lp-theme11-chapter-numbered-label">CHAPTER</span>
            <div className="lp-theme11-chapter-numbered-number"><EditableField prop="number" slideIdx={s} editable={e} as="span">{number}</EditableField></div>
          </GradientCard>
        )}
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-chapter-numbered-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chapter-numbered-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-chapter-numbered-right">
        {items.slice(0, 5).map((item, i) => (
          <Card key={i} className="lp-theme11-chapter-numbered-item lp-theme11-tile-strong lp-rise" padding="medium" style={{ animationDelay: `${i * 60}ms` }}>
            <IconChip icon={`0${i + 1}`} tone={tones[i % tones.length]} />
            <EditableField prop={`items.${i}`} slideIdx={s} editable={e} as="span">{item}</EditableField>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
