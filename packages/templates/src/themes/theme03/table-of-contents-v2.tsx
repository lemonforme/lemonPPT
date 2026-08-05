// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03TableOfContentsV2Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  items: string[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TableOfContentsV2Meta: LayoutMeta = {
  id: 'theme03_table_of_contents_v2',
  theme: 'theme03',
  role: 'tableOfContents',
  displayName: 'Theme 03 编辑风目录 v2',
  description: '编号列表式目录',
  needsMedia: false,
  tags: ['toc', 'navigation'],
  contentShape: 'table-of-contents-list',
};

export const theme03TableOfContentsV2Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '目录' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'CONTENTS' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI · VENTURE CAPITAL // USA' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{报告}}目录' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'items', label: '目录项', type: 'array', minItems: 2, maxItems: 8, itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }] },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03TableOfContentsV2(props: Theme03TableOfContentsV2Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title = '目录', subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-toc-v2">
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

      <div className="lp-theme03-toc-v2-main">
        <div className="lp-theme03-toc-v2-head lp-rise">
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme03-toc-v2-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-toc-v2-subtitle">{subtitle}</EditableField>
          )}
        </div>
        <ol className="lp-theme03-toc-v2-list lp-rise">
          {items.map((item, index) => (
            <li key={index} className="lp-theme03-toc-v2-item">
              <span className="lp-theme03-toc-v2-number">{String(index + 1).padStart(2, '0')}</span>
              <EditableField prop={`items.${index}`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-toc-v2-text">{item}</EditableField>
            </li>
          ))}
        </ol>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
