// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02MetricsV1Insight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02MetricsV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  stats: Array<{ label: string; value: string; unit?: string; tone?: 'default' | 'accent' | 'cool' | 'accent2' }>;
  showInsight?: boolean;
  insight?: Theme02MetricsV1Insight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02MetricsV1Meta: LayoutMeta = {
  id: 'theme02_metrics_v1',
  theme: 'theme02',
  role: 'stats',
  displayName: 'Theme 02 霓虹指标墙',
  description: '多指标卡片网格 + 霓虹强调',
  needsMedia: false,
};

export const theme02MetricsV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'stats',
      label: '指标',
      type: 'array',
      itemSchema: [
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'tone', label: '强调色', type: 'select', options: [{ value: 'default', label: '默认' }, { value: 'accent', label: '主色' }, { value: 'cool', label: '冷色' }, { value: 'accent2', label: '次色' }] },
      ],
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
        value: '72',
        label: 'NPS 评分',
        description: '客户满意度持续保持高位，产品体验得到市场验证。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

export function Theme02MetricsV1(props: Theme02MetricsV1Props): ReactNode {
  const { kicker, title, subtitle, stats = [], showInsight = true, insight, _slideIdx, _editable } = props;

  return (
    <div className={`lp-slide lp-theme02-metrics-v1 ${showInsight && insight ? 'lp-theme02-metrics-v1--insight' : ''}`}>
      <div className="lp-theme02-metrics-main">
        <div className="lp-theme02-metrics-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
              {kicker}
            </EditableField>
          )}
          {title && (
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-metrics-title lp-rise">
              {title}
            </EditableField>
          )}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-metrics-subtitle lp-rise">
              {subtitle}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-metrics-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`lp-theme02-metrics-card lp-rise lp-theme02-metrics-card--${stat.tone || 'default'}`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <EditableField
                prop={`stats.${index}.value`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-theme02-metrics-value"
              >
                {stat.value}
              </EditableField>
              {stat.unit && (
                <EditableField
                  prop={`stats.${index}.unit`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-theme02-metrics-unit"
                >
                  {stat.unit}
                </EditableField>
              )}
              <EditableField
                prop={`stats.${index}.label`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-theme02-metrics-label"
              >
                {stat.label}
              </EditableField>
            </div>
          ))}
        </div>
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
