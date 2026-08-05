// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01MetricV3Props {
  value?: string;
  unit?: string;
  icon?: string;
  description?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01MetricV3Meta: LayoutMeta = {
  id: 'theme01_metric_v3',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 图标大数字',
  description: '图标 + 大数字 + 说明',
  needsMedia: false,
};

export const theme01MetricV3Schema: PropsSchema = {
  fields: [
  {
      key: 'value',
      label: '数值',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'unit',
      label: '单位',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'icon',
      label: 'icon',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'description',
      label: '说明',
      type: 'textarea',
      inlineEditable: true
  }
  ]
};


export function Theme01MetricV3(props: Theme01MetricV3Props): ReactNode {
  const { value = '0', unit = '', icon = '01', description = '', _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-metric-v3">
      <div className="lp-card lp-metric-card lp-rise">
    <div className="lp-metric-icon">
          <EditableField prop="icon" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-metric-icon-text">
      {icon}
          </EditableField>
    </div>
    <div className="lp-metric-body">
          <div className="lp-metric-value">
      <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span">
              {value}
      </EditableField>
          </div>
          {unit && (
      <div className="lp-metric-unit">
              <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span">
        {unit}
              </EditableField>
      </div>
          )}
          {description && (
      <div className="lp-metric-description">
              <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p">
        {description}
              </EditableField>
      </div>
          )}
    </div>
      </div>
  </div>
  );
}
