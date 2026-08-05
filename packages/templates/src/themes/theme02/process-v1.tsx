// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ProcessV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Array<{ title?: string; description?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ProcessV1Meta: LayoutMeta = {
  id: 'theme02_process_v1',
  theme: 'theme02',
  role: 'process',
  displayName: 'Theme 02 霓虹流程',
  description: '横向步骤流程 + 霓虹节点与连线',
  needsMedia: false,
};

export const theme02ProcessV1Schema: PropsSchema = {
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
      key: 'steps',
      label: '步骤',
      type: 'array',
      minItems: 2,
      maxItems: 8,
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

export function Theme02ProcessV1(props: Theme02ProcessV1Props): ReactNode {
  const { kicker, title, subtitle, steps = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-process-v1">
      <div className="lp-theme02-process-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-process-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-process-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-process-track">
        {steps.map((step, index) => (
          <div key={index} className="lp-theme02-process-step lp-rise" style={{ animationDelay: `${index * 90}ms` }}>
            <div className={`lp-theme02-process-node lp-theme02-process-node--${['accent', 'cool', 'warm'][index % 3]}`}>
              <span className="lp-theme02-process-node-number">{index + 1}</span>
            </div>
            <div className="lp-theme02-process-card">
              <EditableField
                prop={`steps.${index}.title`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="h3"
                className="lp-theme02-process-step-title"
              >
                {step.title}
              </EditableField>
              {step.description && (
                <EditableField
                  prop={`steps.${index}.description`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-theme02-process-step-description"
                >
                  {step.description}
                </EditableField>
              )}
            </div>
            {index < steps.length - 1 && <div className="lp-theme02-process-arrow" />}
          </div>
        ))}
      </div>
    </div>
  );
}
