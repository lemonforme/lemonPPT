// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 分隔页（divider_v1）
 * 情绪：daylight | 骨架：full-bleed
 * 小节标签 + 大标题 + 信号线与色块。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, SectionTitle, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11DividerV1Props {
  label?: string;
  title: string;
  subtitle?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11DividerV1Meta: LayoutMeta = {
  id: 'theme11_divider_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 分隔页',
  description: '小节标签 + 大标题 + 信号线与色块',
  needsMedia: false,
  tags: ['divider', 'light-stream'],
  contentShape: 'divider',
};

export const theme11DividerV1Schema: PropsSchema = {
  fields: [
    { key: 'label', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'SECTION' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '深入数据层' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从宏观趋势到可执行结论' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11DividerV1(props: Theme11DividerV1Props): ReactNode {
  const { label, title, subtitle, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-divider">
      <div className="lp-theme11-divider-inner">
        {label && <SectionTitle tone="accent" className="lp-theme11-divider-label"><EditableField prop="label" slideIdx={s} editable={e} as="span">{label}</EditableField></SectionTitle>}
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-divider-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-divider-sub">{subtitle}</EditableField>}
      </div>
    </Sheet>
  );
}
