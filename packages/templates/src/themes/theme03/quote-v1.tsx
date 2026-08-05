// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03QuoteV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  quote: string;
  author?: string;
  title?: string;
  source?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03QuoteV1Meta: LayoutMeta = {
  id: 'theme03_quote_v1',
  theme: 'theme03',
  role: 'quote',
  displayName: 'Theme 03 编辑风金句页',
  description: '深色代码编辑风金句页，几何引号装饰 + 局部强调色',
  needsMedia: false,
  tags: ['quote', 'statement', 'conclusion'],
  contentShape: 'single-quote',
};

export const theme03QuoteV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '结论' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'QUOTE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'quote', label: '引用文字', type: 'textarea', inlineEditable: true, defaultValue: 'AI 产业正在从「叙事驱动」进入「兑现驱动」的{{新阶段}}。' },
    { key: 'author', label: '作者', type: 'text', inlineEditable: true },
    { key: 'title', label: '作者职位', type: 'text', inlineEditable: true },
    { key: 'source', label: '来源', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderQuote(quote: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = quote.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="quote" slideIdx={slideIdx} editable={editable} as="blockquote" className="lp-theme03-quote-text lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03QuoteV1(props: Theme03QuoteV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, quote, author, title, source, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-quote-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-quote-main">
        <div className="lp-theme03-quote-mark lp-rise" aria-hidden="true">“</div>
        {renderQuote(quote || '', _slideIdx, _editable)}
        {(author || title || source) && (
          <div className="lp-theme03-quote-attribution lp-rise">
            {author && <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-quote-author">{author}</EditableField>}
            {title && <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-quote-title">{title}</EditableField>}
            {source && <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-quote-source">{source}</EditableField>}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
