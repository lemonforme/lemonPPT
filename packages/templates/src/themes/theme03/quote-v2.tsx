// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03QuoteV2Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  quote?: string;
  author?: string;
  role?: string;
  source?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03QuoteV2Meta: LayoutMeta = {
  id: 'theme03_quote_v2',
  theme: 'theme03',
  role: 'quote',
  displayName: 'Theme 03 编辑风引述卡片',
  description: '左侧大引号 + 右侧玻璃卡片内容',
  needsMedia: false,
  tags: ['quote', 'statement'],
  contentShape: 'quote-card',
};

export const theme03QuoteV2Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '结论' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'QUOTE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '2024 · USA · AI VENTURE' },
    { key: 'quote', label: '引用', type: 'textarea', inlineEditable: true, defaultValue: 'AI 产业正在从「叙事驱动」进入「兑现驱动」的{{新阶段}}。' },
    { key: 'author', label: '作者', type: 'text', inlineEditable: true },
    { key: 'role', label: '职位', type: 'text', inlineEditable: true },
    { key: 'source', label: '来源', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03QuoteV2(props: Theme03QuoteV2Props): ReactNode {
  const { tag, tagLabel, topRightMeta, quote, author, role, source, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-quote-v2">
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

      <div className="lp-theme03-quote-v2-main">
        <div className="lp-theme03-quote-v2-mark lp-rise">“</div>
        <div className="lp-theme03-quote-v2-card lp-rise">
          <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-theme03-quote-v2-text">{quote}</EditableField>
          <div className="lp-theme03-quote-v2-meta">
            {author && <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-quote-v2-author">{author}</EditableField>}
            {role && <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-quote-v2-role">{role}</EditableField>}
            {source && <EditableField prop="source" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-quote-v2-source">{source}</EditableField>}
          </div>
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
