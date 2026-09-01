// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 极简过渡页（transition_minimal_v1）
 * 情绪：daylight | 骨架：stage
 * 巨型关键词 + 进度色点 + 副标题。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, NavDot, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11TransitionMinimalV1Props {
  keyword: string;
  subtitle?: string;
  total?: number;
  current?: number;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11TransitionMinimalV1Meta: LayoutMeta = {
  id: 'theme11_transition_minimal_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 极简过渡页',
  description: '巨型关键词 + 进度色点 + 副标题',
  needsMedia: false,
  tags: ['transition', 'minimal', 'light-stream'],
  contentShape: 'transition-minimal',
};

export const theme11TransitionMinimalV1Schema: PropsSchema = {
  fields: [
    { key: 'keyword', label: '关键词', type: 'textarea', inlineEditable: true, defaultValue: '增长' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '下一章节：数据驱动的增长策略' },
    { key: 'total', label: '总节点数', type: 'number', defaultValue: 5 },
    { key: 'current', label: '当前节点', type: 'number', defaultValue: 3 },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11TransitionMinimalV1(props: Theme11TransitionMinimalV1Props): ReactNode {
  const { keyword, subtitle, total = 5, current = 3, mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const dots = Array.from({ length: Math.max(2, Math.min(total, 8)) }, (_, i) => i + 1);

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-transition-minimal">
      <div className="lp-theme11-transition-minimal-inner lp-rise">
        <SignalLine />
        <EditableField prop="keyword" slideIdx={s} editable={e} as="h2" className="lp-theme11-transition-minimal-keyword">{keyword}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-transition-minimal-sub">{subtitle}</EditableField>}
        <div className="lp-theme11-transition-minimal-dots">
          {dots.map((_, i) => (
            <NavDot
              key={i}
              color={i < current ? 'var(--lp-accent)' : 'var(--lp-border-strong)'}
              className={`lp-theme11-transition-minimal-dot ${i < current ? 'lp-theme11-transition-minimal-dot-active' : ''}`}
            />
          ))}
        </div>
      </div>
    </Sheet>
  );
}
