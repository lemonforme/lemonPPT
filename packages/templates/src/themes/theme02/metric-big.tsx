// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02MetricBigCard {
  value?: string;
  label?: string;
  accent?: boolean;
}

export interface Theme02MetricBigInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02MetricBigProps {
  title?: string;
  subtitle?: string;
  kicker?: string;
  value?: string;
  unit?: string;
  context?: string;
  metrics?: Theme02MetricBigCard[];
  footnote?: string;
  showInsight?: boolean;
  insight?: Theme02MetricBigInsight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02MetricBigMeta: LayoutMeta = {
  id: 'theme02_metric_big',
  theme: 'theme02',
  role: 'metric',
  displayName: 'Theme 02 大数字页',
  description: '霓虹大数字 + 上下文 + 底部指标卡',
  needsMedia: false,
};

export const theme02MetricBigSchema: PropsSchema = {
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
    {
      key: 'showInsight',
      label: '重点强调',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '+41%',
        label: 'Q4 环比增长',
        description: '下半年增速明显加快，主要受企业客户签约驱动。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

export function Theme02MetricBig(props: Theme02MetricBigProps): ReactNode {
  const {
    title,
    subtitle,
    kicker,
    value = '0',
    unit = '',
    context = '',
    metrics = [],
    footnote,
    showInsight = true,
    insight,
    _slideIdx,
    _editable,
  } = props;

  const safeMetrics = (metrics || []).filter((m) => m != null && (m.value || m.label));

  return (
    <div className={`lp-slide lp-theme02-metric-big ${showInsight && insight ? 'lp-theme02-metric-big--insight' : ''}`}>
      <div className="lp-theme02-metric-card lp-rise">
        <div className="lp-theme02-metric-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div className="lp-theme02-metric-titles">
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-metric-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-metric-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>

        <div className="lp-theme02-metric-body">
          <div className="lp-theme02-metric-value-wrap">
            <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-metric-value">
              {value}
            </EditableField>
            {unit && (
              <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-metric-unit">
                {unit}
              </EditableField>
            )}
          </div>
          {context && (
            <EditableField prop="context" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-metric-context">
              {context}
            </EditableField>
          )}
        </div>

        {safeMetrics.length > 0 && (
          <div className="lp-theme02-metric-metrics">
            {safeMetrics.map((metric, index) => (
              <div
                key={index}
                className={`lp-theme02-metric-metric lp-rise ${metric.accent ? 'lp-theme02-metric-metric--accent' : ''}`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <EditableField prop={`metrics.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-metric-metric-value">
                  {metric.value}
                </EditableField>
                <EditableField prop={`metrics.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-metric-metric-label">
                  {metric.label}
                </EditableField>
              </div>
            ))}
          </div>
        )}

        {footnote && (
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-metric-footnote">
            {footnote}
          </EditableField>
        )}
      </div>

      {showInsight && insight && (
        <div className="lp-theme02-insight-panel lp-rise">
          <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-insight-value">
            {insight.value}
          </EditableField>
          <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-insight-label">
            {insight.label}
          </EditableField>
          {insight.description && (
            <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-insight-description">
              {insight.description}
            </EditableField>
          )}
        </div>
      )}
    </div>
  );
}
