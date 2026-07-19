import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface MetricV1Props {
  label?: string;
  value: string;
  unit?: string;
  description?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const metricV1Meta: LayoutMeta = {
  id: 'metric_v1',
  theme: 'base',
  role: 'metric',
  displayName: '超大数字',
  description: '居中大字号展示核心数字，适合关键数据页',
  needsMedia: false,
};

export function MetricV1(props: MetricV1Props): ReactNode {
  const { label, value, unit, description, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-metric-v1">
      {label && (
        <EditableField prop="label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
          {label}
        </EditableField>
      )}
      <div className="lp-metric-v1-value">
        <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-metric-v1-text">
          {value}
        </EditableField>
        {unit && (
          <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-metric-v1-unit">
            {unit}
          </EditableField>
        )}
      </div>
      {description && (
        <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-metric-v1-description">
          {description}
        </EditableField>
      )}
    </div>
  );
}
