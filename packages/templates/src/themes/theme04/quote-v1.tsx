// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04QuoteV1Props {
  kicker?: string;
  quote: string;
  author?: string;
  role?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04QuoteV1Meta: LayoutMeta = {
  id: 'theme04_quote_v1',
  theme: 'theme04',
  role: 'quote',
  displayName: 'Theme 04 糖果金句页',
  description: '大号引号装饰 + 人物信息 + 焦点图片',
  needsMedia: true,
  tags: ['quote', 'statement', 'candy'],
  contentShape: 'single-quote',
};

export const theme04QuoteV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '金句' },
    { key: 'quote', label: '引用文字', type: 'textarea', inlineEditable: true, defaultValue: 'AI 产业正在从「叙事驱动」进入{{兑现驱动}}的新阶段。' },
    { key: 'author', label: '作者', type: 'text', inlineEditable: true, defaultValue: '李明远' },
    { key: 'role', label: '作者职位', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 研究负责人' },
    { key: 'image', label: '人物图片', type: 'image' },
  ],
};

function renderQuote(quote: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = quote.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="quote" slideIdx={slideIdx} editable={editable} as="blockquote" className="lp-theme04-quote-text lp-rise">
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

export function Theme04QuoteV1(props: Theme04QuoteV1Props): ReactNode {
  const { kicker, quote, author, role, image, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-quote">
      <div className="lp-theme04-quote-main lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        <div className="lp-theme04-quote-mark" aria-hidden="true">“</div>
        {renderQuote(quote || '', _slideIdx, _editable)}
        <div className="lp-theme04-quote-author">
          <LpEditableImage
            className="lp-theme04-quote-avatar"
            src={image}
            alt=""
            slideIdx={_slideIdx}
            editable={_editable}
            prop="image"
            placeholderClassName="lp-editable-image-placeholder lp-theme04-quote-avatar-placeholder"
            placeholderText=""
            showIcon={true}
          />
          <div className="lp-theme04-quote-info">
            {author && <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-quote-name">{author}</EditableField>}
            {role && <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-quote-role">{role}</EditableField>}
          </div>
        </div>
      </div>

      <div className="lp-theme04-quote-image lp-theme04-card lp-rise">
        <LpEditableImage
          className=""
          src={image}
          alt=""
          slideIdx={_slideIdx}
          editable={_editable}
          prop="image"
          placeholderClassName="lp-editable-image-placeholder"
          placeholderText="点击上传焦点图片"
          showIcon={true}
        />
      </div>
    </div>
  );
}
