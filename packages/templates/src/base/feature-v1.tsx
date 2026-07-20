// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface FeatureV1Props {
  kicker?: string;
  title: string;
  features?: { title?: string; description?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const featureV1Meta: LayoutMeta = {
  id: 'feature_v1',
  theme: 'base',
  role: 'feature',
  displayName: '产品特性',
  description: '三列卡片展示产品特性或优势',
  needsMedia: false,
};

export function FeatureV1(props: FeatureV1Props): ReactNode {
  const { kicker, title, features = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-feature-v1">
      <div className="lp-feature-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-feature-grid">
        {features.map((feature, index) => (
          <div key={index} className="lp-feature-card">
            <div className="lp-feature-number">{String(index + 1).padStart(2, '0')}</div>
            <EditableField
              prop={`features.${index}.title`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-feature-title"
            >
              {feature.title}
            </EditableField>
            {feature.description && (
              <EditableField
                prop={`features.${index}.description`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-feature-description"
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
