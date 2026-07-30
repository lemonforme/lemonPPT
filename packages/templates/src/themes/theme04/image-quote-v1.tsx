// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ImageQuoteV1Props {
  kicker?: string;
  quote: string;
  author?: string;
  source?: string;
  value?: string;
  unit?: string;
  valueLabel?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ImageQuoteV1Meta: LayoutMeta = {
  id: 'theme04_image_quote_v1',
  theme: 'theme04',
  role: 'quote',
  displayName: 'Theme 04 图文金句/论断印章',
  description: '左侧大段引用文字 + 右侧圆形印章数字',
  needsMedia: false,
  tags: ['quote', 'statement', 'candy'],
  contentShape: 'quote-with-seal',
};

export const theme04ImageQuoteV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '终审判断 · THE VERDICT' },
    { key: 'quote', label: '引用文字', type: 'textarea', inlineEditable: true, defaultValue: '这不是一次普通的风口，而是一场{{资本的总动员}}——钱、算力与共识，同时压向了同一个方向。' },
    { key: 'source', label: '来源说明', type: 'textarea', inlineEditable: true, defaultValue: '970 亿美元在一年内涌入，把「AI 是否值得」的争论，直接改写成了「谁能上车」。' },
    { key: 'author', label: '作者/报告', type: 'text', inlineEditable: true, defaultValue: '—《2024 美国大额融资 AI 公司调研报告》· 总结' },
    { key: 'value', label: '印章数值', type: 'text', inlineEditable: true, defaultValue: '970' },
    { key: 'unit', label: '印章单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'valueLabel', label: '印章标签', type: 'text', inlineEditable: true, defaultValue: 'FUNDING YEAR · 2024' },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '' },
  ],
};

function renderQuote(quote: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = quote.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="quote" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-image-quote-text lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04ImageQuoteV1(props: Theme04ImageQuoteV1Props): ReactNode {
  const { kicker, quote, author, source, value, unit, valueLabel, footnote, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-image-quote">
      <div className="lp-theme04-image-quote-left lp-rise">
        <span className="lp-theme04-image-quote-mark">"</span>
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderQuote(quote || '', _slideIdx, _editable)}
        {source && (
          <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-image-quote-source">{source}</EditableField>
        )}
        {author && (
          <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-image-quote-author">{author}</EditableField>
        )}
      </div>

      <div className="lp-theme04-image-quote-right lp-rise">
        <div className="lp-theme04-image-quote-seal">
          <div className="lp-theme04-image-quote-seal-ring" />
          <div className="lp-theme04-image-quote-seal-inner">
            <span className="lp-theme04-image-quote-seal-top">资本大年 · CONFIRMED</span>
            <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-image-quote-seal-value">{value ?? ''}</EditableField>
            {unit && <span className="lp-theme04-image-quote-seal-unit">{unit}</span>}
            {valueLabel && <span className="lp-theme04-image-quote-seal-label">{valueLabel}</span>}
          </div>
        </div>
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-image-quote-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
