// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 分屏章节页（chapter_split_v1）
 * 情绪：daylight | 骨架：split
 * 左侧大编号与标题 + 右侧影像。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, GradientCard, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ChapterSplitV1Props {
  number?: string;
  title: string;
  subtitle?: string;
  image?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChapterSplitV1Meta: LayoutMeta = {
  id: 'theme11_chapter_split_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 分屏章节页',
  description: '左侧大编号与标题 + 右侧影像',
  needsMedia: true,
  tags: ['chapter', 'split', 'image', 'light-stream'],
  contentShape: 'chapter-split',
};

export const theme11ChapterSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'number', label: '章节编号', type: 'text', inlineEditable: true, defaultValue: '03' },
    { key: 'title', label: '章节标题', type: 'textarea', inlineEditable: true, defaultValue: '客户案例' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '真实场景中的价值验证' },
    { key: 'image', label: '右侧影像', type: 'image', defaultValue: '' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ChapterSplitV1(props: Theme11ChapterSplitV1Props): ReactNode {
  const { number, title, subtitle, image, mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-chapter-split">
      <div className="lp-theme11-chapter-split-body lp-rise">
        {number && (
          <GradientCard tone="blue" className="lp-theme11-chapter-split-badge">
            <span className="lp-theme11-chapter-split-label">CHAPTER</span>
            <EditableField prop="number" slideIdx={s} editable={e} as="span" className="lp-theme11-chapter-split-number">{number}</EditableField>
          </GradientCard>
        )}
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-chapter-split-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chapter-split-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-chapter-split-media lp-rise">
        <EditorialPhoto src={image} prop="image" slideIdx={s} editable={e} className="lp-theme11-chapter-split-photo" />
      </div>
    </Sheet>
  );
}
