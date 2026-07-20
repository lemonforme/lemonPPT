// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface FeatureV2Props {
  kicker?: string;
  title: string;
  features?: { title?: string; description?: string; icon?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const featureV2Meta: LayoutMeta = {
  id: 'feature_v2',
  theme: 'base',
  role: 'feature',
  displayName: '特性卡片',
  description: '三列特性卡片，带图标和说明',
  needsMedia: false,
};

export function FeatureV2(props: FeatureV2Props): ReactNode {
  const { kicker, title, features = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-feature-v2">
      <div className="lp-feature-v2-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-feature-v2-grid">
        {features.map((feature, index) => (
          <div key={index} className="lp-feature-v2-card">
            <div className="lp-feature-v2-icon">{feature.icon ?? '◆'}</div>
            <EditableField
              prop={`features.${index}.title`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="h3"
              className="lp-feature-v2-title"
            >
              {feature.title}
            </EditableField>
            <EditableField
              prop={`features.${index}.description`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-feature-v2-description"
            >
              {feature.description}
            </EditableField>
          </div>
        ))}
      </div>
    </div>
  );
}
