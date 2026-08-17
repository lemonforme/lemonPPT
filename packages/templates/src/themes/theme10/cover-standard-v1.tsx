// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 标准封面（cover_standard_v1）
 * 情绪：aurora | 骨架：sidebar | 图位：0
 * ticker 带 + 主副标 + 来源戳。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, Stamp, Ticker, type Theme10Mood } from './shared.js';

export interface Theme10CoverStandardV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  stamp?: string;
  ticker?: { code: string; value?: string; delta?: number }[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CoverStandardV1Meta: LayoutMeta = {
  id: 'theme10_cover_standard_v1',
  theme: 'theme10',
  role: 'cover',
  displayName: 'Theme 10 标准封面',
  description: '行情带 + 主副标 + 来源戳',
  needsMedia: false,
  tags: ['cover', 'standard', 'gold-index', 'aurora'],
  contentShape: 'cover-standard',
};

export const theme10CoverStandardV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'GOLD INDEX REPORT' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '2026 投研\n年度白皮书' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '数据、结构与拐点——一份写给投资人的年终答卷。' },
    { key: 'stamp', label: '来源戳', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT Research' },
    {
      key: 'ticker',
      label: '行情带',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: [
        { code: 'CSI300', value: '3,842.6', delta: 0.62 },
        { code: 'GOLD', value: '2,398', delta: 1.24 },
      ],
      itemSchema: [
        { key: 'code', label: '代码', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'delta', label: '涨跌%', type: 'number' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'aurora' },
  ],
};

export function Theme10CoverStandardV1(props: Theme10CoverStandardV1Props): ReactNode {
  const { kicker, title, subtitle, stamp, ticker, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme10-cover-standard">
      <Ticker items={ticker} slideIdx={s} editable={e} />
      <div className="lp-theme10-cover-standard-body">
        {kicker && (
          <EditableField prop="kicker" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField
          prop="title"
          slideIdx={s}
          editable={e}
          as="h1"
          className="lp-theme10-cover-atmos-title lp-rise"
          style={{ animationDelay: '60ms', fontSize: 'var(--lp-font-size-display-small)' }}
        >
          {title}
        </EditableField>
        {subtitle && (
          <EditableField
            prop="subtitle"
            slideIdx={s}
            editable={e}
            as="p"
            className="lp-theme10-cover-dusk-sub lp-rise"
            style={{ animationDelay: '120ms' }}
          >
            {subtitle}
          </EditableField>
        )}
      </div>
      <Stamp text={stamp} />
    </Sheet>
  );
}
