// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 暮光对角封面（cover_dusk_v1）
 * 情绪：aurora | 骨架：full-bleed | 图位：0
 * 对角金线切分 + 巨型 mono 标题 + 顶部 ticker 带。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, Ticker, type Theme10Mood } from './shared.js';

export interface Theme10CoverDuskV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  ticker?: { code: string; value?: string; delta?: number }[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CoverDuskV1Meta: LayoutMeta = {
  id: 'theme10_cover_dusk_v1',
  theme: 'theme10',
  role: 'cover',
  displayName: 'Theme 10 暮光对角封面',
  description: '对角金线切分 + 巨型 mono 标题 + 顶部行情带',
  needsMedia: false,
  tags: ['cover', 'dusk', 'gold-index', 'aurora'],
  contentShape: 'cover-dusk',
};

export const theme10CoverDuskV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'GOLD INDEX · 2026' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '指数重构下的\n配置新秩序' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '从β到α，从总量到结构——一份面向投研的年终复盘。' },
    {
      key: 'ticker',
      label: '行情带',
      type: 'array',
      minItems: 0,
      maxItems: 8,
      defaultValue: [
        { code: 'CSI300', value: '3,842.6', delta: 0.62 },
        { code: 'SSE50', value: '2,511.3', delta: -0.18 },
        { code: 'GOLD', value: '2,398', delta: 1.24 },
        { code: 'CNY', value: '7.12', delta: 0.05 },
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

export function Theme10CoverDuskV1(props: Theme10CoverDuskV1Props): ReactNode {
  const { kicker, title, subtitle, ticker, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme10-cover-dusk">
      <Ticker items={ticker} slideIdx={s} editable={e} />
      <div className="lp-theme10-cover-dusk-grid" aria-hidden="true" />
      <div className="lp-theme10-cover-dusk-inner">
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
          className="lp-theme10-cover-dusk-title lp-rise"
          style={{ animationDelay: '60ms' }}
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
    </Sheet>
  );
}
