// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01TableOfContentsV2Props {
  title?: string;
  items: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01TableOfContentsV2Meta: LayoutMeta = {
  id: 'theme01_table_of_contents_v2',
  theme: 'theme01',
  role: 'tableOfContents',
  displayName: 'Theme 01 目录 V2',
  description: '卡片网格目录，带编号与弥散背景',
  needsMedia: false,
};

export const theme01TableOfContentsV2Schema: PropsSchema = {
  fields: [
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
    {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01TableOfContentsV2(props: Theme01TableOfContentsV2Props): ReactNode {
  const { title = '目录', items = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-toc-v2">
      <div className="lp-toc-header lp-rise">
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-toc-title">
          {title}
    </EditableField>
      </div>
      <ol className="lp-toc-list lp-rise">
    {items.map((item, index) => (
          <li key={index} className="lp-toc-item">
      <span className="lp-toc-number">{String(index + 1).padStart(2, '0')}</span>
      <EditableField
              prop={`items.${index}`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
              className="lp-toc-text"
      >
              {item}
      </EditableField>
          </li>
    ))}
      </ol>
  </div>
  );
}
