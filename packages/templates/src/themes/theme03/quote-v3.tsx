// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03QuoteV3Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  quote?: string;
  author?: string;
  role?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03QuoteV3Meta: LayoutMeta = {
  id: 'theme03_quote_v3',
  theme: 'theme03',
  role: 'quote',
  displayName: 'Theme 03 编辑风大字金句',
  description: '全屏大字引用 + 底部作者信息',
  needsMedia: false,
  tags: ['quote', 'statement', 'hero'],
  contentShape: 'big-quote',
};

export const theme03QuoteV3Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '金句' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'QUOTE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '2024 · USA · AI VENTURE' },
    { key: 'quote', label: '引用', type: 'textarea', inlineEditable: true, defaultValue: '资本正在从叙事流向{{现金流}}。' },
    { key: 'author', label: '作者', type: 'text', inlineEditable: true },
    { key: 'role', label: '职位', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03QuoteV3(props: Theme03QuoteV3Props): ReactNode {
  const { tag, tagLabel, topRightMeta, quote, author, role, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-quote-v3">
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

      <div className="lp-theme03-quote-v3-main">
        <div className="lp-theme03-quote-v3-content lp-rise">
          <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme03-quote-v3-text">{quote}</EditableField>
          <div className="lp-theme03-quote-v3-line" />
          <div className="lp-theme03-quote-v3-meta">
            {author && <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-quote-v3-author">{author}</EditableField>}
            {role && <EditableField prop="role" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-quote-v3-role">{role}</EditableField>}
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
