// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01ProcessV1Props {
  kicker?: string;
  title: string;
  steps?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ProcessV1Meta: LayoutMeta = {
  id: 'theme01_process_v1',
  theme: 'theme01',
  role: 'process',
  displayName: 'Theme 01 横向流程',
  description: '玻璃卡片横向步骤流程',
  needsMedia: false,
};

export const theme01ProcessV1Schema: PropsSchema = {
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
      key: 'steps',
      label: '步骤',
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


export function Theme01ProcessV1(props: Theme01ProcessV1Props): ReactNode {
  const { kicker, title, steps = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-process-v1">
      <div className="lp-process-inner">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-process-title lp-rise">
          {title}
    </EditableField>
    {steps.length > 0 && (
          <div className="lp-process-steps">
      {steps.map((step, index) => (
              <div key={index} className="lp-process-step lp-rise">
        <div className="lp-process-step-number">{index + 1}</div>
        <EditableField
                  prop={`steps.${index}`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-process-step-text"
        >
                  {step}
        </EditableField>
        {index < steps.length - 1 && <div className="lp-process-arrow" />}
              </div>
      ))}
          </div>
    )}
      </div>
  </div>
  );
}
