// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01MetricV1Props {
  value?: string;
  unit?: string;
  description?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01MetricV1Meta: LayoutMeta = {
  id: 'theme01_metric_v1',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 数据页',
  description: '超大数字 + 玻璃描述卡片',
  needsMedia: false,
};

export const theme01MetricV1Schema: PropsSchema = {
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
      key: 'description',
      label: '说明',
      type: 'textarea',
      inlineEditable: true
  }
  ]
};


export function Theme01MetricV1(props: Theme01MetricV1Props): ReactNode {
  const { value = '0', unit = '', description = '', _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-metric-v1">
      <div className="lp-metric-value lp-rise">
    <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span">
          {value}
    </EditableField>
      </div>
      {unit && (
    <div className="lp-metric-unit lp-rise">
          <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span">
      {unit}
          </EditableField>
    </div>
      )}
      {description && (
    <div className="lp-card lp-metric-description lp-rise">
          <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p">
      {description}
          </EditableField>
    </div>
      )}
  </div>
  );
}
