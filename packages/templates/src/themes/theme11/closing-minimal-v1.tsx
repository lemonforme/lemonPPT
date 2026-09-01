// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 极简结束页（closing_minimal_v1）
 * 情绪：sunset | 骨架：stage
 * 巨形感谢文字 + 副标题 + 脉冲点。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, PulseDot, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ClosingMinimalV1Props {
  title: string;
  subtitle?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ClosingMinimalV1Meta: LayoutMeta = {
  id: 'theme11_closing_minimal_v1',
  theme: 'theme11',
  role: 'closing',
  displayName: 'Theme 11 极简结束页',
  description: '巨形感谢文字 + 副标题 + 脉冲点',
  needsMedia: false,
  tags: ['closing', 'minimal', 'light-stream'],
  contentShape: 'closing',
};

export const theme11ClosingMinimalV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: 'THANK YOU' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '感谢观看，期待与你的下一次交流。' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'sunset' },
  ],
};

export function Theme11ClosingMinimalV1(props: Theme11ClosingMinimalV1Props): ReactNode {
  const { title, subtitle, mood = 'sunset', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-closing-minimal">
      <div className="lp-theme11-closing-minimal-inner lp-rise">
        <div className="lp-theme11-closing-minimal-pulse">
          <PulseDot size={12} color="var(--lp-orange)" />
        </div>
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-closing-minimal-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-closing-minimal-sub">{subtitle}</EditableField>}
      </div>
    </Sheet>
  );
}
