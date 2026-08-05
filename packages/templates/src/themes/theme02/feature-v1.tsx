// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02FeatureV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  features?: { title?: string; description?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02FeatureV1Meta: LayoutMeta = {
  id: 'theme02_feature_v1',
  theme: 'theme02',
  role: 'feature',
  displayName: 'Theme 02 霓虹特性',
  description: '深色背景 + 霓虹编号卡片三列特性展示',
  needsMedia: false,
};

export const theme02FeatureV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
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
          inlineEditable: true,
        },
        {
          key: 'description',
          label: '描述',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
  ],
};

export function Theme02FeatureV1(props: Theme02FeatureV1Props): ReactNode {
  const { kicker, title, subtitle, features = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-feature-v1">
      <div className="lp-theme02-feature-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-feature-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-feature-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-feature-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`lp-theme02-feature-card lp-rise lp-theme02-feature-card--${['accent', 'cool', 'warm'][index % 3]}`}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="lp-theme02-feature-number">{String(index + 1).padStart(2, '0')}</div>
            <EditableField
              prop={`features.${index}.title`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-theme02-feature-card-title"
            >
              {feature.title}
            </EditableField>
            {feature.description && (
              <EditableField
                prop={`features.${index}.description`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-theme02-feature-card-description"
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
