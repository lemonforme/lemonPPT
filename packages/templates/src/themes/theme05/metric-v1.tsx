// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05MetricV1Metric {
  value: string;
  unit?: string;
  label: string;
  accent?: boolean;
}

export interface Theme05MetricV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  value: string;
  unit?: string;
  metrics?: Theme05MetricV1Metric[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05MetricV1Meta: LayoutMeta = {
  id: 'theme05_metric_v1',
  theme: 'theme05',
  role: 'metric',
  displayName: 'Theme 05 大数字指标页',
  description: '主指标 + 4 个辅助指标卡片',
  needsMedia: false,
  tags: ['metric', 'kpi', 'big-number'],
  contentShape: 'metric',
};

export const theme05MetricV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CORE METRIC' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度融资总额' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年大额融资事件汇总' },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '970' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'metrics',
      label: '辅助指标',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
  ],
};

export function Theme05MetricV1(props: Theme05MetricV1Props): ReactNode {
  const { kicker, title, subtitle, value, unit, metrics = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-metric">
      {kicker && <div className="lp-theme05-kicker lp-rise">{kicker}</div>}
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title lp-rise">{title}</EditableField>
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle lp-rise">{subtitle}</EditableField>
      )}
      <div className="lp-theme05-metric-hero lp-rise">
        <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme05-metric-hero-value">{value}</EditableField>
        {unit && <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme05-metric-hero-unit">{unit}</EditableField>}
      </div>
      {metrics.length > 0 && (
        <div className="lp-theme05-metric-grid">
          {metrics.map((m, i) => (
            <div key={i} className={`lp-theme05-card ${m.accent ? 'lp-theme05-card--accent' : ''} lp-rise`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-theme05-card-value">
                <EditableField prop={`metrics.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
                {m.unit && <EditableField prop={`metrics.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{m.unit}</EditableField>}
              </div>
              <div className="lp-theme05-card-label">
                <EditableField prop={`metrics.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
