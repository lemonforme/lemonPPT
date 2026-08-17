// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02FlowV1Step {
  title?: string;
  desc?: string;
}

export interface Theme02FlowV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  steps?: Theme02FlowV1Step[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02FlowV1Meta: LayoutMeta = {
  id: 'theme02_flow_v1',
  theme: 'theme02',
  role: 'process',
  displayName: 'Theme 02 横向流程',
  description: '步骤卡片水平流向',
  needsMedia: false,
};

export const theme02FlowV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'steps',
      label: '步骤',
      type: 'array',
      maxItems: 5,
      minItems: 2,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'desc', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02FlowV1(props: Theme02FlowV1Props): ReactNode {
  const { kicker, title, subtitle, steps = [], _slideIdx, _editable } = props;

  const safeSteps = steps.filter((s) => s && typeof s === 'object');

  return (
    <div className="lp-slide lp-theme02-flow-v1">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-flow-inner">
        <div className="lp-theme02-flow-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-flow-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-flow-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        <div className="lp-theme02-flow-track">
          {safeSteps.map((step, i) => (
            <div key={i} className="lp-theme02-flow-step-wrap">
              <div className="lp-theme02-flow-step">
                <div className="lp-theme02-flow-badge">{i + 1}</div>
                <EditableField prop={`steps.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-flow-step-title">
                  {step.title}
                </EditableField>
                {step.desc && (
                  <EditableField prop={`steps.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-flow-step-desc">
                    {step.desc}
                  </EditableField>
                )}
              </div>
              {i < safeSteps.length - 1 && <div className="lp-theme02-flow-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
