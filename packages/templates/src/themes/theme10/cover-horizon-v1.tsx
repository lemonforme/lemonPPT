// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 地平线封面（cover_horizon_v1）
 * 情绪：ember | 骨架：full-bleed | 图位：0
 * 地平线渐变 + 底部金线 + 期号。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CoverHorizonV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  issue?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CoverHorizonV1Meta: LayoutMeta = {
  id: 'theme10_cover_horizon_v1',
  theme: 'theme10',
  role: 'cover',
  displayName: 'Theme 10 地平线封面',
  description: '地平线渐变 + 底部金线 + 期号',
  needsMedia: false,
  tags: ['cover', 'horizon', 'gold-index', 'ember'],
  contentShape: 'cover-horizon',
};

export const theme10CoverHorizonV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '站在周期的\n地平线上' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '回望这一年资本的涨落与重构。' },
    { key: 'issue', label: '期号', type: 'text', inlineEditable: true, defaultValue: 'VOL.10 / 2026.08' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

export function Theme10CoverHorizonV1(props: Theme10CoverHorizonV1Props): ReactNode {
  const { kicker, title, subtitle, issue, mood = 'ember', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme10-cover-horizon">
      {issue && (
        <EditableField prop="issue" slideIdx={s} editable={e} as="div" className="lp-theme10-cover-horizon-issue">
          {issue}
        </EditableField>
      )}
      <div className="lp-theme10-cover-horizon-inner">
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
