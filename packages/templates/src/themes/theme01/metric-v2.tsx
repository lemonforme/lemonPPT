// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01MetricV2Item {
  value?: string;
  unit?: string;
  label?: string;
}

export interface Theme01MetricV2Props {
  kicker?: string;
  title?: string;
  metrics?: Theme01MetricV2Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01MetricV2Meta: LayoutMeta = {
  id: 'theme01_metric_v2',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 多指标网格',
  description: '多指标玻璃卡片网格',
  needsMedia: false,
};

export const theme01MetricV2Schema: PropsSchema = {
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
      key: 'metrics',
      label: '指标',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
    {
          key: 'value',
          label: '数值',
          type: 'number',
          inlineEditable: true
    },
    {
          key: 'unit',
          label: '单位',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01MetricV2(props: Theme01MetricV2Props): ReactNode {
  const { kicker, title, metrics = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-metric-v2">
      <div className="lp-metric-header lp-rise">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
      {kicker}
          </EditableField>
    )}
    {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-metric-title">
      {title}
          </EditableField>
    )}
      </div>
      <div className="lp-metric-grid">
    {metrics.map((metric, index) => (
          <div key={index} className="lp-card lp-metric-card lp-rise">
      <div className="lp-metric-card-value">
              <EditableField prop={`metrics.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
        {metric.value || '0'}
              </EditableField>
              {metric.unit && (
        <EditableField
                  prop={`metrics.${index}.unit`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="span"
                  className="lp-metric-card-unit"
        >
                  {metric.unit}
        </EditableField>
              )}
      </div>
      <EditableField
              prop={`metrics.${index}.label`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-metric-card-label"
      >
              {metric.label || ''}
      </EditableField>
          </div>
    ))}
      </div>
  </div>
  );
}
