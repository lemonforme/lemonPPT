// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06QuoteV1Props {
  imageUrl?: string;
  quote: string;
  source?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06QuoteV1Meta: LayoutMeta = {
  id: 'theme06_quote_v1',
  theme: 'theme06',
  role: 'quote',
  displayName: 'Theme 06 金句页',
  description: '左侧霓虹竖条 + 引言 + 来源',
  needsMedia: true,
  tags: ['quote', 'atlas'],
  contentShape: 'quote',
};

export const theme06QuoteV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'quote', label: '引用文字', type: 'textarea', inlineEditable: true, defaultValue: '数据不会撒谎，但它只回答你问过的问题。' },
    { key: 'source', label: '来源', type: 'text', inlineEditable: true, defaultValue: '— 首席数据官 · 李明' },
  ],
};

export function Theme06QuoteV1(props: Theme06QuoteV1Props): ReactNode {
  const { quote, source, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme06-quote">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-quote-inner lp-rise">
        <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-theme06-quote-text">{quote}</EditableField>
        {source && (
          <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="cite" className="lp-theme06-quote-source">{source}</EditableField>
        )}
      </div>
      <div className="lp-theme06-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
