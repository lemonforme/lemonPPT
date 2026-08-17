// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02FeatureV2Feature {
  icon?: string;
  title: string;
  desc?: string;
}

export interface Theme02FeatureV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  features?: Theme02FeatureV2Feature[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02FeatureV2Meta: LayoutMeta = {
  id: 'theme02_feature_v2',
  theme: 'theme02',
  role: 'feature',
  displayName: 'Theme 02 图标特性网格',
  description: '霓虹卡片网格，每项带图标 + 标题 + 描述',
  needsMedia: false,
};

export const theme02FeatureV2Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'features',
      label: '特性',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      itemSchema: [
        { key: 'icon', label: '图标(emoji)', type: 'text' },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'desc', label: '描述', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02FeatureV2(props: Theme02FeatureV2Props): ReactNode {
  const { kicker, title, subtitle, features = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-feature-v2">
      <div className="lp-theme02-orb lp-theme02-orb--accent" style={{ top: '-120px', right: '-80px', width: '420px', height: '420px' }} />
      <div className="lp-theme02-orb lp-theme02-orb--cool" style={{ bottom: '-160px', left: '-100px', width: '520px', height: '520px' }} />
      <div className="lp-card lp-theme02-feature-card lp-rise">
        <div className="lp-theme02-feature-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-feature-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-feature-subtitle">
              {subtitle}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-feature-grid">
          {features.map((f, i) => (
            <div key={i} className="lp-theme02-feature-item lp-rise" style={{ animationDelay: `${i * 60}ms` }}>
              {f.icon && <div className="lp-theme02-feature-icon">{f.icon}</div>}
              <EditableField prop={`features.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme02-feature-item-title">
                {f.title}
              </EditableField>
              {f.desc && (
                <EditableField prop={`features.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-feature-item-desc">
                  {f.desc}
                </EditableField>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
