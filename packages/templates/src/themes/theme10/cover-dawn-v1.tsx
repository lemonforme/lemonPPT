// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 晨光卡封面（cover_dawn_v1）
 * 情绪：ember | 骨架：sidebar | 图位：1
 * 晨光卡 + 角嵌影像。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CoverDawnV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CoverDawnV1Meta: LayoutMeta = {
  id: 'theme10_cover_dawn_v1',
  theme: 'theme10',
  role: 'cover',
  displayName: 'Theme 10 晨光卡封面',
  description: '晨光卡 + 角嵌影像',
  needsMedia: true,
  mediaSlots: [{ name: '角嵌影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['cover', 'dawn', 'gold-index', 'ember'],
  contentShape: 'cover-dawn',
};

export const theme10CoverDawnV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'MORNING NOTE' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '新一天的\n第一笔配置' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '在不确定性中，寻找可复利的确定性。' },
    { key: 'imageUrl', label: '角嵌影像', type: 'image', defaultValue: '' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

export function Theme10CoverDawnV1(props: Theme10CoverDawnV1Props): ReactNode {
  const { kicker, title, subtitle, imageUrl, mood = 'ember', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme10-cover-dawn">
      <div className="lp-theme10-cover-dawn-card">
        {(imageUrl || e) && (
          <EditorialPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={s}
            editable={e}
            ratio="4:3"
            fit="cover"
            className="lp-theme10-cover-dawn-photo"
          />
        )}
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
    </Sheet>
  );
}
