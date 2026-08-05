// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05QuoteV1Props {
  quote: string;
  source?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05QuoteV1Meta: LayoutMeta = {
  id: 'theme05_quote_v1',
  theme: 'theme05',
  role: 'quote',
  displayName: 'Theme 05 金句页',
  description: '左侧光谱竖条 + 引用文字',
  needsMedia: false,
  tags: ['quote', 'spectrum'],
  contentShape: 'quote',
};

export const theme05QuoteV1Schema: PropsSchema = {
  fields: [
    { key: 'quote', label: '引用文字', type: 'textarea', inlineEditable: true, defaultValue: '数据不会撒谎，但它只回答你问过的问题。' },
    { key: 'source', label: '来源', type: 'text', inlineEditable: true, defaultValue: '— 首席数据官 · 李明' },
  ],
};

export function Theme05QuoteV1(props: Theme05QuoteV1Props): ReactNode {
  const { quote, source, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-quote">
      <div className="lp-theme05-quote-bar lp-rise" aria-hidden="true" />
      <div className="lp-rise">
        <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-theme05-quote-text">{quote}</EditableField>
        {source && (
          <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="cite" className="lp-theme05-quote-source">{source}</EditableField>
        )}
      </div>
    </div>
  );
}
