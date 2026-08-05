// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05QuoteV2Props {
  quote: string;
  source?: string;
  author?: string;
  accentScheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05QuoteV2Meta: LayoutMeta = {
  id: 'theme05_quote_v2',
  theme: 'theme05',
  role: 'quote',
  description: '大引号装饰 + 关键论断 + 作者/来源',
  displayName: 'Theme 05 主张页 V2',
  needsMedia: false,
  tags: ['quote', 'claim', 'statement'],
  contentShape: 'quote',
};

export const theme05QuoteV2Schema: PropsSchema = {
  fields: [
    { key: 'quote', label: '引用文字', type: 'textarea', inlineEditable: true, defaultValue: '数据不会撒谎，但它只回答你问过的问题。' },
    { key: 'author', label: '作者', type: 'text', inlineEditable: true, defaultValue: '首席数据官 · 李明' },
    { key: 'source', label: '来源', type: 'text', inlineEditable: true, defaultValue: '2026 数据领导力峰会' },
    {
      key: 'accentScheme',
      label: '强调色',
      type: 'select',
      defaultValue: 'coral',
      options: [
        { value: 'coral', label: '珊瑚红' },
        { value: 'amber', label: '琥珀黄' },
        { value: 'teal', label: '青绿' },
        { value: 'indigo', label: '靛蓝' },
        { value: 'violet', label: '紫罗兰' },
      ],
    },
  ],
};

function schemeClass(scheme?: string): string {
  return `lp-theme05-quote-v2--${scheme || 'coral'}`;
}

export function Theme05QuoteV2(props: Theme05QuoteV2Props): ReactNode {
  const { quote, source, author, accentScheme, _slideIdx, _editable } = props;

  return (
    <div className={`lp-slide lp-theme05-quote-v2 ${schemeClass(accentScheme)}`}>
      <div className="lp-theme05-quote-v2-bar lp-rise" aria-hidden="true" />
      <div className="lp-theme05-quote-v2-content lp-rise">
        <div className="lp-theme05-quote-v2-mark">“</div>
        <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-theme05-quote-v2-text">{quote}</EditableField>
        {(author || source) && (
          <cite className="lp-theme05-quote-v2-source">
            {author && <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span">{author}</EditableField>}
            {author && source && <span> · </span>}
            {source && <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="span">{source}</EditableField>}
          </cite>
        )}
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
    </div>
  );
}
