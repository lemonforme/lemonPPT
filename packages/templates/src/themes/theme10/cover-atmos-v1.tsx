// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 满版渐变大字封面（cover_atmos_v1）
 * 情绪：obsidian | 骨架：full-bleed | 图位：0
 * 满版 ember→obsidian 大字标题出血。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CoverAtmosV1Props {
  title: string;
  en?: string;
  kicker?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CoverAtmosV1Meta: LayoutMeta = {
  id: 'theme10_cover_atmos_v1',
  theme: 'theme10',
  role: 'cover',
  displayName: 'Theme 10 满版渐变大字封面',
  description: '满版大字标题出血 + 英文副标',
  needsMedia: false,
  tags: ['cover', 'atmos', 'gold-index', 'obsidian'],
  contentShape: 'cover-atmos',
};

export const theme10CoverAtmosV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PROLOGUE' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '当潮水退去，\n结构浮出水面' },
    { key: 'en', label: '英文副标', type: 'text', inlineEditable: true, defaultValue: 'After the tide recedes' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'obsidian' },
  ],
};

export function Theme10CoverAtmosV1(props: Theme10CoverAtmosV1Props): ReactNode {
  const { title, en, kicker, mood = 'obsidian', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme10-cover-atmos" accent>
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
      {en && (
        <EditableField
          prop="en"
          slideIdx={s}
          editable={e}
          as="p"
          className="lp-theme10-en lp-rise"
          style={{ animationDelay: '120ms', fontSize: 20, marginTop: 18 }}
        >
          {en}
        </EditableField>
      )}
    </Sheet>
  );
}
