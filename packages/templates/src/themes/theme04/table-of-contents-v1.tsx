// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04TableOfContentsV1Item {
  title: string;
  page?: string;
}

export interface Theme04TableOfContentsV1Props {
  title?: string;
  subtitle?: string;
  items?: Theme04TableOfContentsV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04TableOfContentsV1Meta: LayoutMeta = {
  id: 'theme04_table_of_contents_v1',
  theme: 'theme04',
  role: 'tableOfContents',
  displayName: 'Theme 04 糖果目录页',
  description: '左侧标题 + 右侧编号列表，玻璃卡片目录',
  needsMedia: false,
  tags: ['tableOfContents', 'agenda', 'candy'],
  contentShape: 'title-list',
};

export const theme04TableOfContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '目录' },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true, defaultValue: 'CONTENTS' },
    {
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 1,
      maxItems: 8,
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

export function Theme04TableOfContentsV1(props: Theme04TableOfContentsV1Props): ReactNode {
  const { title, subtitle, items, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-toc">
      <div className="lp-theme04-toc-head lp-rise">
        {subtitle && <div className="lp-theme04-kicker">{subtitle}</div>}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme04-toc-title">{title}</EditableField>
        )}
      </div>

      <div className="lp-theme04-toc-body lp-rise">
        {(items ?? []).slice(0, 8).map((item, idx) => (
          <div key={idx} className="lp-theme04-toc-item lp-theme04-card">
            <span className="lp-theme04-toc-number">{String(idx + 1).padStart(2, '0')}</span>
            <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-toc-text">{item.title}</EditableField>
            {item.page && (
              <EditableField prop={`items.${idx}.page`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-toc-page">{item.page}</EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
