// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 海报（poster_v1）
 * 情绪：ember | 骨架：full-bleed | 图位：1
 * 满版影像 + 底部压字大标题（金线压条 + 刊标）；金融编辑「封面故事」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10PosterV1Props {
  section?: string;
  mark?: string;
  title?: string;
  tagline?: string;
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10PosterV1Meta: LayoutMeta = {
  id: 'theme10_poster_v1',
  theme: 'theme10',
  role: 'image',
  displayName: 'Theme 10 海报',
  description: '满版影像 + 底部压字大标题',
  needsMedia: true,
  mediaSlots: [{ name: '海报影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['poster', 'gold-index', 'ember'],
  contentShape: 'poster',
};

export const theme10PosterV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '封面故事' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一个值得被印上封面的瞬间' },
    { key: 'tagline', label: '副标', type: 'textarea', inlineEditable: true, defaultValue: '海报把一句话说到底：看见，然后记住。' },
    { key: 'imageUrl', label: '满版影像', type: 'image', inlineEditable: false, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '封面故事' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '43' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10PosterV1(props: Theme10PosterV1Props): ReactNode {
  const { section, mark, title, tagline, imageUrl, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme10-poster">
      {(imageUrl || e) && (
        <div className="lp-theme10-poster-photo">
          <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} ratio="fill" fit="cover" hint="点击上传满版影像" />
          <div className="lp-theme10-poster-scrim" />
        </div>
      )}

      <div className="lp-theme10-poster-card">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-poster-kicker lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-poster-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {tagline && (
          <EditableField prop="tagline" slideIdx={s} editable={e} as="p" className="lp-theme10-poster-tagline lp-rise" style={{ animationDelay: '110ms' }}>{tagline}</EditableField>
        )}
      </div>

      <div className="lp-theme10-poster-bar" />
      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
