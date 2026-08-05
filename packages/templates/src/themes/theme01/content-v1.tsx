// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01ContentV1Props {
  title?: string;
  bullets?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ContentV1Meta: LayoutMeta = {
  id: 'theme01_content_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 内容页',
  description: '玻璃卡片 + 圆点列表',
  needsMedia: false,
};

export const theme01ContentV1Schema: PropsSchema = {
  fields: [
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'bullets',
      label: '要点',
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


export function Theme01ContentV1(props: Theme01ContentV1Props): ReactNode {
  const { title = '', bullets = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-content-v1">
      <div className="lp-card lp-content-card">
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-content-title lp-rise">
          {title}
    </EditableField>
    <ul className="lp-bullet-list lp-rise">
          {bullets.map((bullet, index) => (
      <li key={index}>
              <EditableField
        prop={`bullets.${index}`}
        slideIdx={_slideIdx}
        editable={_editable}
        as="span"
              >
        {bullet}
              </EditableField>
      </li>
          ))}
    </ul>
      </div>
  </div>
  );
}
