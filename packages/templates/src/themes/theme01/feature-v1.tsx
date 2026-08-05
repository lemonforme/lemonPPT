// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01FeatureV1Props {
  kicker?: string;
  title: string;
  features?: { title?: string; description?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01FeatureV1Meta: LayoutMeta = {
  id: 'theme01_feature_v1',
  theme: 'theme01',
  role: 'feature',
  displayName: 'Theme 01 产品特性',
  description: '玻璃卡片三列特性展示',
  needsMedia: false,
};

export const theme01FeatureV1Schema: PropsSchema = {
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
      key: 'features',
      label: '特性',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
    {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'description',
          label: '描述',
          type: 'textarea',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01FeatureV1(props: Theme01FeatureV1Props): ReactNode {
  const { kicker, title, features = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-feature-v1">
      <div className="lp-feature-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-feature-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-feature-grid">
    {features.map((feature, index) => (
          <div key={index} className="lp-card lp-feature-card lp-rise">
      <div className="lp-feature-number">{String(index + 1).padStart(2, '0')}</div>
      <EditableField
              prop={`features.${index}.title`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-feature-card-title"
      >
              {feature.title}
      </EditableField>
      {feature.description && (
              <EditableField
        prop={`features.${index}.description`}
        slideIdx={_slideIdx}
        editable={_editable}
        as="p"
        className="lp-feature-card-description"
              >
        {feature.description}
              </EditableField>
      )}
          </div>
    ))}
      </div>
  </div>
  );
}
