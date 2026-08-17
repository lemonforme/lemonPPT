// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02StepsV1Step {
  title: string;
  desc?: string;
}

export interface Theme02StepsV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme02StepsV1Step[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02StepsV1Meta: LayoutMeta = {
  id: 'theme02_steps_v1',
  theme: 'theme02',
  role: 'process',
  displayName: 'Theme 02 编号步骤',
  description: '横向编号步骤条，带连接线与序号光环',
  needsMedia: false,
};

export const theme02StepsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'steps',
      label: '步骤',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      itemSchema: [
        { key: 'title', label: '步骤标题', type: 'text', inlineEditable: true },
        { key: 'desc', label: '步骤描述', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02StepsV1(props: Theme02StepsV1Props): ReactNode {
  const { kicker, title, subtitle, steps = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-steps-v1">
      <div className="lp-theme02-orb lp-theme02-orb--accent" style={{ top: '-100px', right: '-60px', width: '360px', height: '360px' }} />
      <div className="lp-card lp-theme02-steps-card lp-rise">
        <div className="lp-theme02-steps-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-steps-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-steps-subtitle">
              {subtitle}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-steps-track">
          {steps.map((s, i) => (
            <div key={i} className="lp-theme02-step lp-rise" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="lp-theme02-step-index">{i + 1}</div>
              <EditableField prop={`steps.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme02-step-title">
                {s.title}
              </EditableField>
              {s.desc && (
                <EditableField prop={`steps.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-step-desc">
                  {s.desc}
                </EditableField>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
