// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05TableOfContentsV2Item {
  title: string;
  page?: string;
}

export interface Theme05TableOfContentsV2Props {
  title: string;
  subtitle?: string;
  items?: Theme05TableOfContentsV2Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05TableOfContentsV2Meta: LayoutMeta = {
  id: 'theme05_table_of_contents_v2',
  theme: 'theme05',
  role: 'tableOfContents',
  displayName: 'Theme 05 编号目录 V2',
  description: '左侧大标题 + 右侧 01-06 纵向条目',
  needsMedia: false,
  tags: ['table-of-contents', 'numbered', 'spectrum'],
  contentShape: 'table-of-contents',
};

export const theme05TableOfContentsV2Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '目录' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: 'CONTENTS' },
    {
      key: 'items',
      label: '章节',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { title: '市场背景与机会', page: '02' },
        { title: '产品方案与优势', page: '04' },
        { title: '商业模式与增长', page: '06' },
        { title: '团队与融资计划', page: '08' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'page', label: '页码', type: 'text' },
      ],
    },
  ],
};

export function Theme05TableOfContentsV2(props: Theme05TableOfContentsV2Props): ReactNode {
  const { title, subtitle, items = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-toc-v2">
      <div className="lp-theme05-toc-v2-head lp-rise">
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-toc-v2-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-toc-v2-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-underline" />
      </div>
      <div className="lp-theme05-toc-v2-list lp-rise">
        {items.map((item, i) => (
          <div key={i} className="lp-theme05-toc-v2-item" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="lp-theme05-toc-v2-number">{String(i + 1).padStart(2, '0')}</div>
            <div className="lp-theme05-toc-v2-text">
              <div className="lp-theme05-toc-v2-item-title">
                <EditableField prop={`items.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{item.title}</EditableField>
              </div>
              {item.page && (
                <div className="lp-theme05-toc-v2-page">
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
