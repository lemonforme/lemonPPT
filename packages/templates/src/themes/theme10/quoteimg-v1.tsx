// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 引言图（quoteimg_v1）
 * 情绪：ember | 骨架：full-bleed | 图位：1 + 引述
 * 满版影像 + 居中大引述（金线引号 + 署名）；金融编辑「金句」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10QuoteImgV1Props {
  section?: string;
  mark?: string;
  quote?: string;
  attribution?: string;
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10QuoteImgV1Meta: LayoutMeta = {
  id: 'theme10_quoteimg_v1',
  theme: 'theme10',
  role: 'quote',
  displayName: 'Theme 10 引言图',
  description: '满版影像 + 居中大引述',
  needsMedia: true,
  mediaSlots: [{ name: '引言底图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['quoteimg', 'gold-index', 'ember'],
  contentShape: 'quoteimg',
};

export const theme10QuoteImgV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '金句' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'quote', label: '引述', type: 'textarea', inlineEditable: true, defaultValue: '市场从不缺少声音，缺的是把噪声听成信号的人。' },
    { key: 'attribution', label: '署名', type: 'text', inlineEditable: true, defaultValue: '— 摘自本期卷首' },
    { key: 'imageUrl', label: '满版影像', type: 'image', inlineEditable: false, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '金句' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '45' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10QuoteImgV1(props: Theme10QuoteImgV1Props): ReactNode {
  const { section, mark, quote, attribution, imageUrl, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme10-quoteimg">
      {(imageUrl || e) && (
        <div className="lp-theme10-quoteimg-photo">
          <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} ratio="fill" fit="cover" hint="点击上传满版影像" />
          <div className="lp-theme10-quoteimg-scrim" />
        </div>
      )}

      <div className="lp-theme10-quoteimg-card">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-quoteimg-kicker lp-rise">{section}</EditableField>
        <span className="lp-theme10-quoteimg-mark" aria-hidden="true">”</span>
        <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme10-quoteimg-quote lp-rise" style={{ animationDelay: '60ms' }}>{quote}</EditableField>
        {attribution && (
          <EditableField prop="attribution" slideIdx={s} editable={e} as="div" className="lp-theme10-quoteimg-attr lp-rise" style={{ animationDelay: '110ms' }}>{attribution}</EditableField>
        )}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
