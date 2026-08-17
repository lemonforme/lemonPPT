// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 引言（quote_v1）
 * 情绪：obsidian | 骨架：stage | 图位：—
 * 巨型引号 + mono 署名（来源 / 职务）。
 * 金融人物金句 / 卷首语栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10QuoteV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  quote?: string;
  sign?: string;
  source?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10QuoteV1Meta: LayoutMeta = {
  id: 'theme10_quote_v1',
  theme: 'theme10',
  role: 'quote',
  displayName: 'Theme 10 引言',
  description: '巨型引号 + mono 署名',
  needsMedia: false,
  mediaSlots: [],
  tags: ['quote', 'gold-index', 'obsidian'],
  contentShape: 'quote',
};

export const theme10QuoteV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '卷首语' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Opening' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'quote', label: '引言', type: 'textarea', inlineEditable: true, defaultValue: '市场奖励的从来不是正确，\n而是正确地承担了自己愿意承担的风险。' },
    { key: 'sign', label: '署名', type: 'text', inlineEditable: true, defaultValue: '— 陈知远' },
    { key: 'source', label: '来源', type: 'text', inlineEditable: true, defaultValue: '首席资产配置官 · 内部投委会' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '卷首语' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '04' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10QuoteV1(props: Theme10QuoteV1Props): ReactNode {
  const { section, mark, quote, sign, source, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme10-quote">
      <div className="lp-theme10-quote-mark" aria-hidden="true">“</div>
      <div className="lp-theme10-quote-body">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme10-quote-text lp-rise" style={{ animationDelay: '60ms' }}>
          {quote}
        </EditableField>
        <div className="lp-theme10-quote-sign lp-rise" style={{ animationDelay: '110ms' }}>
          <EditableField prop="sign" slideIdx={s} editable={e} as="span" className="t10-sign">{sign}</EditableField>
          {source && <EditableField prop="source" slideIdx={s} editable={e} as="span" className="t10-source">{source}</EditableField>}
        </div>
      </div>
      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
