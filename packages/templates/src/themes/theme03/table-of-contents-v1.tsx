// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03TableOfContentsItem {
  title?: string;
  page?: string;
}

function normalizeTocItems(items?: Array<string | Theme03TableOfContentsItem | null>): Theme03TableOfContentsItem[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (item == null) return { title: '', page: '' };
    if (typeof item === 'string') return { title: item, page: '' };
    return { title: item.title ?? '', page: item.page ?? '' };
  });
}

export interface Theme03TableOfContentsV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  items?: Array<string | Theme03TableOfContentsItem>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TableOfContentsV1Meta: LayoutMeta = {
  id: 'theme03_table_of_contents_v1',
  theme: 'theme03',
  role: 'tableOfContents',
  displayName: 'Theme 03 编辑风目录',
  description: '深色代码编辑风目录页，章节条目 + 页码',
  needsMedia: false,
  tags: ['toc', 'navigation', 'outline'],
  contentShape: 'table-of-contents',
};

export const theme03TableOfContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '目录' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'CONTENTS' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{报告}}目录' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'page', label: '页码', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-toc-title lp-rise">
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

export function Theme03TableOfContentsV1(props: Theme03TableOfContentsV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, items, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validItems = normalizeTocItems(items);

  return (
    <div className="lp-slide lp-theme03-toc-v1">
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

      <div className="lp-theme03-toc-main">
        <div className="lp-theme03-toc-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-toc-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validItems.length > 0 && (
          <div className="lp-theme03-toc-list lp-rise">
            {validItems.map((item, idx) => (
              <div key={idx} className="lp-theme03-toc-item">
                <EditableField
                  prop={`items.${idx}.title`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-theme03-toc-item-title"
                >
                  {item.title}
                </EditableField>
                <div className="lp-theme03-toc-item-line" />
                <EditableField
                  prop={`items.${idx}.page`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-theme03-toc-item-page"
                >
                  {item.page}
                </EditableField>
              </div>
            ))}
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
