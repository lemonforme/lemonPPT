// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05TableOfContentsV1Item {
  title: string;
  page?: string;
}

export interface Theme05TableOfContentsV1Props {
  title: string;
  subtitle?: string;
  items?: Theme05TableOfContentsV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05TableOfContentsV1Meta: LayoutMeta = {
  id: 'theme05_table_of_contents_v1',
  theme: 'theme05',
  role: 'tableOfContents',
  displayName: 'Theme 05 光谱目录',
  description: '网格目录：章节卡片 + 编号',
  needsMedia: false,
  tags: ['table-of-contents', 'spectrum'],
  contentShape: 'table-of-contents',
};

export const theme05TableOfContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '目录' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: 'CONTENTS' },
    {
      key: 'items',
      label: '章节',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'page', label: '页码', type: 'text' },
      ],
    },
  ],
};

export function Theme05TableOfContentsV1(props: Theme05TableOfContentsV1Props): ReactNode {
  const { title, subtitle, items = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-toc">
      <div className="lp-rise">
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-underline" />
      </div>
      <div className="lp-theme05-toc-grid lp-rise">
        {items.map((item, i) => (
          <div key={i} className="lp-theme05-toc-item" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="lp-theme05-toc-number">{String(i + 1).padStart(2, '0')}</div>
            <div>
              <div className="lp-theme05-toc-title">
                <EditableField prop={`items.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{item.title}</EditableField>
              </div>
              {item.page && (
                <div className="lp-theme05-toc-page">
                  <EditableField prop={`items.${i}.page`} slideIdx={_slideIdx} editable={_editable} as="span">P.{item.page}</EditableField>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
