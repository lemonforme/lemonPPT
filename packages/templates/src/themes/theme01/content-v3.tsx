// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01ContentV3Column {
  title?: string;
  text?: string;
}

export interface Theme01ContentV3Props {
  kicker?: string;
  title: string;
  columns?: Theme01ContentV3Column[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ContentV3Meta: LayoutMeta = {
  id: 'theme01_content_v3',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 三栏内容',
  description: '玻璃卡片三栏内容展示',
  needsMedia: false,
};

export const theme01ContentV3Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'columns',
      label: 'columns',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      itemSchema: [
    {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'text',
          label: '内容',
          type: 'textarea',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01ContentV3(props: Theme01ContentV3Props): ReactNode {
  const { kicker, title, columns = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-content-v3">
      <div className="lp-card lp-content-card lp-rise">
    <div className="lp-content-header">
          {kicker && (
      <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
      </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-content-title">
      {title}
          </EditableField>
    </div>
    <div className="lp-content-columns">
          {columns.map((column, index) => (
      <div key={index} className="lp-card lp-content-col lp-rise">
              <EditableField
        prop={`columns.${index}.title`}
        slideIdx={_slideIdx}
        editable={_editable}
        as="h3"
        className="lp-content-col-title"
              >
        {column.title || ''}
              </EditableField>
              <EditableField
        prop={`columns.${index}.text`}
        slideIdx={_slideIdx}
        editable={_editable}
        as="p"
        className="lp-content-col-text"
              >
        {column.text || ''}
              </EditableField>
      </div>
          ))}
    </div>
      </div>
  </div>
  );
}
