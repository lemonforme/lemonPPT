// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01RiskV1Item {
  risk?: string;
  impact?: string;
  response?: string;
}

export interface Theme01RiskV1Props {
  kicker?: string;
  title?: string;
  items?: Theme01RiskV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01RiskV1Meta: LayoutMeta = {
  id: 'theme01_risk_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 风险研判',
  description: '风险列表 + 影响程度 + 应对策略',
  needsMedia: false,
};

export const theme01RiskV1Schema: PropsSchema = {
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
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
    {
          key: 'risk',
          label: '风险',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'impact',
          label: '影响程度',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'response',
          label: '应对策略',
          type: 'text',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01RiskV1(props: Theme01RiskV1Props): ReactNode {
  const { kicker, title = '风险研判', items = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-risk-v1">
      <div className="lp-risk-v1-inner">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-risk-v1-title lp-rise">
          {title}
    </EditableField>
    {items.length > 0 && (
          <div className="lp-risk-v1-grid lp-rise">
      {items.map((item, index) => (
              <div key={index} className="lp-card lp-risk-v1-card">
        <div className="lp-risk-v1-header">
                  <EditableField
          prop={`items.${index}.risk`}
          slideIdx={_slideIdx}
          editable={_editable}
          as="h3"
          className="lp-risk-v1-risk"
                  >
          {item.risk || ''}
                  </EditableField>
                  <span className="lp-risk-v1-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="lp-risk-v1-body">
                  <div className="lp-risk-v1-row">
          <span className="lp-risk-v1-label">影响程度</span>
          <EditableField
                      prop={`items.${index}.impact`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-risk-v1-impact"
          >
                      {item.impact || ''}
          </EditableField>
                  </div>
                  <div className="lp-risk-v1-row">
          <span className="lp-risk-v1-label">应对策略</span>
          <EditableField
                      prop={`items.${index}.response`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-risk-v1-response"
          >
                      {item.response || ''}
          </EditableField>
                  </div>
        </div>
              </div>
      ))}
          </div>
    )}
      </div>
  </div>
  );
}
