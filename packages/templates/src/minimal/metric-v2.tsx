import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface MetricV2Props {
  kicker?: string;
  value: string;
  unit?: string;
  description?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const metricV2Meta: LayoutMeta = {
  id: 'minimal_metric_v2',
  theme: 'minimal',
  role: 'metric',
  displayName: '核心数字',
  description: '突出展示一个核心指标',
  needsMedia: false,
};

export function MetricV2(props: MetricV2Props): ReactNode {
  const { kicker, value, unit, description, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-metric-v2">
      {kicker && (
        <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
          {kicker}
        </EditableField>
      )}
      <div className="lp-metric-value">
        <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-metric-value-text">
          {value}
        </EditableField>
        {unit && (
          <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-metric-unit">
            {unit}
          </EditableField>
        )}
      </div>
      {description && (
        <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-metric-description">
          {description}
        </EditableField>
      )}
    </div>
  );
}
