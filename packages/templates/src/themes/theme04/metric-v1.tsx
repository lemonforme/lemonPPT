// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04MetricV1Metric {
  value: string;
  unit?: string;
  label: string;
}

export interface Theme04MetricV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  value: string;
  unit?: string;
  label?: string;
  metrics?: Theme04MetricV1Metric[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04MetricV1Meta: LayoutMeta = {
  id: 'theme04_metric_v1',
  theme: 'theme04',
  role: 'metric',
  displayName: 'Theme 04 大数字指标页',
  description: '糖果色主数值 + 玻璃卡片辅助指标网格',
  needsMedia: false,
  tags: ['metric', 'number', 'candy'],
  contentShape: 'big-number-grid',
};

export const theme04MetricV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度融资总额' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年大额融资事件汇总' },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '970' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'label', label: '主数值说明', type: 'text', inlineEditable: true, defaultValue: '全年 AI 风险投资额' },
    {
      key: 'metrics',
      label: '辅助指标',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { value: '97', unit: '笔', label: '事件笔数' },
        { value: '≈10 亿', unit: '', label: '平均单笔' },
        { value: '+41%', unit: '', label: 'Q4 环比' },
        { value: 'Q2-Q3', unit: '', label: '高峰区间' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
  ],
};

export function Theme04MetricV1(props: Theme04MetricV1Props): ReactNode {
  const { kicker, title, subtitle, value, unit, label, metrics, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-metric">
      <div className="lp-theme04-metric-top lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme04-metric-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-metric-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-metric-hero lp-rise">
        <div className="lp-theme04-metric-value-wrap">
          <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-metric-value">{value}</EditableField>
          {unit && <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-metric-unit">{unit}</EditableField>}
        </div>
        {label && (
          <EditableField prop="label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-metric-label">{label}</EditableField>
        )}
      </div>

      <div className="lp-theme04-metric-grid lp-rise">
        {(metrics ?? []).slice(0, 4).map((m, idx) => (
          <div key={idx} className="lp-theme04-metric-card lp-theme04-card">
            <div className="lp-theme04-metric-card-value">
              <EditableField prop={`metrics.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
              {m.unit && <span className="unit">{m.unit}</span>}
            </div>
            <EditableField prop={`metrics.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-metric-card-label">{m.label}</EditableField>
          </div>
        ))}
      </div>
    </div>
  );
}
