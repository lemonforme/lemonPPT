// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01MetricBigCard {
  value?: string;
  label?: string;
  accent?: boolean;
}

export interface Theme01MetricBigProps {
  title?: string;
  subtitle?: string;
  kicker?: string;
  value?: string;
  unit?: string;
  context?: string;
  metrics?: Theme01MetricBigCard[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01MetricBigMeta: LayoutMeta = {
  id: 'theme01_metric_big',
  theme: 'theme01',
  role: 'metric',
  displayName: 'Theme 01 大数字页',
  description: '核心指标 + 上下文 + 底部指标卡',
  needsMedia: false,
};

export const theme01MetricBigSchema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'value',
      label: '主数值',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'unit',
      label: '单位',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'context',
      label: '上下文说明',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'metrics',
      label: '底部指标卡',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '名称', type: 'text' },
        {
          key: 'accent',
          label: '强调',
          type: 'boolean',
          defaultValue: false,
        },
      ],
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01MetricBig(props: Theme01MetricBigProps): ReactNode {
  const {
    title,
    subtitle,
    kicker,
    value = '0',
    unit = '',
    context = '',
    metrics = [],
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const safeMetrics = (metrics || []).filter((m) => m != null && (m.value || m.label));

  return (
    <div className="lp-slide lp-metric-big">
      <div className="lp-card lp-metric-big-card lp-rise">
        <div className="lp-metric-big-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div className="lp-metric-big-titles">
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-metric-big-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-metric-big-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>

        <div className="lp-metric-big-body">
          <div className="lp-metric-big-value-wrap">
            <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-metric-big-value">
              {value}
            </EditableField>
            {unit && (
              <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-metric-big-unit">
                {unit}
              </EditableField>
            )}
          </div>
          {context && (
            <EditableField prop="context" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-metric-big-context">
              {context}
            </EditableField>
          )}
        </div>

        {safeMetrics.length > 0 && (
          <div className="lp-metric-big-metrics">
            {safeMetrics.map((metric, index) => (
              <div
                key={index}
                className={`lp-metric-big-metric lp-rise ${metric.accent ? 'lp-metric-big-metric--accent' : ''}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <EditableField prop={`metrics.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-metric-big-metric-value">
                  {metric.value}
                </EditableField>
                <EditableField prop={`metrics.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-metric-big-metric-label">
                  {metric.label}
                </EditableField>
              </div>
            ))}
          </div>
        )}

        {footnote && (
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-metric-big-footnote">
            {footnote}
          </EditableField>
        )}
      </div>
    </div>
  );
}
