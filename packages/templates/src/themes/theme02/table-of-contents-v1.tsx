// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02TableOfContentsV1Props {
  title?: string;
  subtitle?: string;
  items: Array<{ title: string; page?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02TableOfContentsV1Meta: LayoutMeta = {
  id: 'theme02_table_of_contents_v1',
  theme: 'theme02',
  role: 'tableOfContents',
  displayName: 'Theme 02 霓虹目录',
  description: '章节导航 + 霓虹编号 + 玻璃卡片',
  needsMedia: false,
};

export const theme02TableOfContentsV1Schema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'items',
      label: '目录项',
      type: 'array',
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'page', label: '页码', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02TableOfContentsV1(props: Theme02TableOfContentsV1Props): ReactNode {
  const { title, subtitle, items = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-toc-v1">
      <div className="lp-theme02-toc-glow" />
      <div className="lp-theme02-toc-header">
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-toc-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-toc-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <ol className="lp-theme02-toc-list">
        {items.map((item, index) => (
          <li key={index} className="lp-theme02-toc-item lp-rise" style={{ animationDelay: `${index * 80}ms` }}>
            <span className="lp-theme02-toc-number">{String(index + 1).padStart(2, '0')}</span>
            <EditableField
              prop={`items.${index}.title`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
              className="lp-theme02-toc-text"
            >
              {item.title}
            </EditableField>
            {item.page && (
              <EditableField
                prop={`items.${index}.page`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="span"
                className="lp-theme02-toc-page"
              >
                {item.page}
              </EditableField>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
