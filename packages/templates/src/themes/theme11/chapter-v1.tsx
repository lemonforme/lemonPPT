// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 章节过渡页（chapter_v1）
 * 情绪：daylight | 骨架：stage
 * 大编号 + 章节标题 + 信号线。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, GradientCard, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ChapterV1Props {
  number?: string;
  title: string;
  subtitle?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChapterV1Meta: LayoutMeta = {
  id: 'theme11_chapter_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 章节过渡页',
  description: '大编号 + 章节标题 + 信号线',
  needsMedia: false,
  tags: ['chapter', 'light-stream'],
  contentShape: 'chapter',
};

export const theme11ChapterV1Schema: PropsSchema = {
  fields: [
    { key: 'number', label: '章节编号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'title', label: '章节标题', type: 'textarea', inlineEditable: true, defaultValue: '产品能力' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从智能生成到品牌一致性' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ChapterV1(props: Theme11ChapterV1Props): ReactNode {
  const { number, title, subtitle, mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-section-hero">
      <div className="lp-theme11-section-hero-inner">
        {number && (
          <GradientCard tone="violet" className="lp-theme11-section-hero-badge lp-rise">
            <EditableField prop="number" slideIdx={s} editable={e} as="span">{number}</EditableField>
          </GradientCard>
        )}
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-section-hero-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-section-hero-sub">{subtitle}</EditableField>}
      </div>
    </Sheet>
  );
}
