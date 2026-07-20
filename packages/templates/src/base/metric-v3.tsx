// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface MetricV3Props {
  kicker?: string;
  title: string;
  metrics?: { label?: string; value?: string; unit?: string; change?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const metricV3Meta: LayoutMeta = {
  id: 'metric_v3',
  theme: 'base',
  role: 'metric',
  displayName: '双指标对比',
  description: '两个核心指标并排对比，强调增长率',
  needsMedia: false,
};

export function MetricV3(props: MetricV3Props): ReactNode {
  const { kicker, title, metrics = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-metric-v3">
      <div className="lp-metric-v3-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-metric-v3-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="lp-metric-v3-card">
            <EditableField
              prop={`metrics.${index}.label`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-metric-v3-label"
            >
              {metric.label}
            </EditableField>
            <div className="lp-metric-v3-value-row">
              <EditableField
                prop={`metrics.${index}.value`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="span"
                className="lp-metric-v3-value"
              >
                {metric.value}
              </EditableField>
              <EditableField
                prop={`metrics.${index}.unit`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="span"
                className="lp-metric-v3-unit"
              >
                {metric.unit}
              </EditableField>
            </div>
            {metric.change && (
              <EditableField
                prop={`metrics.${index}.change`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-metric-v3-change"
              >
                {metric.change}
              </EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
