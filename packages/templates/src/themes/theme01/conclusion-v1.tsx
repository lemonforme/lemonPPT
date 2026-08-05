// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01ConclusionV1Props {
  title?: string;
  subtitle?: string;
  points?: Array<{ item?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ConclusionV1Meta: LayoutMeta = {
  id: 'theme01_conclusion_v1',
  theme: 'theme01',
  role: 'closing',
  displayName: 'Theme 01 结论页',
  description: '标题 + 核心结论卡片',
  needsMedia: false,
};

export const theme01ConclusionV1Schema: PropsSchema = {
  fields: [
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true
  },
  {
      key: 'points',
      label: '要点',
      type: 'array',
      maxItems: 4,
      minItems: 2,
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


export function Theme01ConclusionV1(props: Theme01ConclusionV1Props): ReactNode {
  const { title = '结论', subtitle, points = [], _slideIdx, _editable } = props;
  const safePoints = points.slice(0, 4);

  return (
  <div className="lp-slide lp-conclusion-v1">
      <div className="lp-conclusion-v1-inner">
    {subtitle && (
          <EditableField
      prop="subtitle"
      slideIdx={_slideIdx}
      editable={_editable}
      as="div"
      className="lp-pill lp-rise"
          >
      {subtitle}
          </EditableField>
    )}
    <EditableField
          prop="title"
          slideIdx={_slideIdx}
          editable={_editable}
          as="h1"
          className="lp-head lp-conclusion-v1-title lp-rise"
    >
          {title}
    </EditableField>
    {safePoints.length > 0 && (
          <div className="lp-conclusion-v1-grid">
      {safePoints.map((point, index) => (
              <div key={index} className="lp-card lp-conclusion-v1-card lp-rise">
        <div className="lp-conclusion-v1-number">{index + 1}</div>
        <EditableField
                  prop={`points.${index}.item`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-conclusion-v1-text"
        >
                  {point?.item ?? ''}
        </EditableField>
              </div>
      ))}
          </div>
    )}
      </div>
  </div>
  );
}
