// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 英雄章节页（chapter_hero_v1）
 * 情绪：aurora | 骨架：full-bleed
 * 满版弥散背景 + 巨型编号水印 + 居中标题。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, PulseDot, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ChapterHeroV1Props {
  number?: string;
  title: string;
  subtitle?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChapterHeroV1Meta: LayoutMeta = {
  id: 'theme11_chapter_hero_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 英雄章节页',
  description: '满版弥散背景 + 巨型编号水印 + 居中标题',
  needsMedia: false,
  tags: ['chapter', 'hero', 'light-stream'],
  contentShape: 'chapter-hero',
};

export const theme11ChapterHeroV1Schema: PropsSchema = {
  fields: [
    { key: 'number', label: '章节编号', type: 'text', inlineEditable: true, defaultValue: '04' },
    { key: 'title', label: '章节标题', type: 'textarea', inlineEditable: true, defaultValue: '数据驱动决策' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从指标洞察到行动方案' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ChapterHeroV1(props: Theme11ChapterHeroV1Props): ReactNode {
  const { number, title, subtitle, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-chapter-hero">
      <div className="lp-theme11-chapter-hero-watermark" aria-hidden="true">{number || '01'}</div>
      <div className="lp-theme11-chapter-hero-inner lp-rise">
        <div className="lp-theme11-chapter-hero-pulse">
          <PulseDot size={12} color="var(--lp-violet)" />
        </div>
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-chapter-hero-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chapter-hero-sub">{subtitle}</EditableField>}
      </div>
    </Sheet>
  );
}
