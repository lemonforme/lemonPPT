// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme02ChartGaugeInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02ChartGaugeProps {
  title?: string;
  kicker?: string;
  value?: number;
  min?: number;
  max?: number;
  unit?: string;
  showInsight?: boolean;
  insight?: Theme02ChartGaugeInsight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartGaugeMeta: LayoutMeta = {
  id: 'theme02_chart_gauge',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 仪表盘',
  description: '霓虹仪表盘，适合展示完成率、健康度等单一指标',
  needsMedia: false,
};

export const theme02ChartGaugeSchema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
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
      label: '数值',
      type: 'number',
    },
    {
      key: 'min',
      label: '最小值',
      type: 'number',
    },
    {
      key: 'max',
      label: '最大值',
      type: 'number',
    },
    {
      key: 'unit',
      label: '单位',
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
        value: '+22%',
        label: '较上月提升',
        description: '年度目标完成率已接近 80%，按当前增速预计下季度可超额达成。',
      },
      itemSchema: [
        {
          key: 'value',
          label: '主数值',
          type: 'text',
        },
        {
          key: 'label',
          label: '主数值说明',
          type: 'text',
        },
        {
          key: 'description',
          label: '解读文字',
          type: 'textarea',
        },
      ],
    },
  ],
};

export function Theme02ChartGauge(props: Theme02ChartGaugeProps): ReactNode {
  const { title, kicker, value = 0, min = 0, max = 100, unit = '', showInsight = true, insight, _slideIdx, _editable } = props;

  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const option = {
    tooltip: {
      formatter: '{b}: {c}' + unit,
      backgroundColor: 'rgba(8, 10, 14, 0.92)',
      borderColor: 'var(--lp-border)',
      textStyle: { color: 'var(--lp-ink)' },
    },
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min,
        max,
        splitNumber: 10,
        itemStyle: { color: 'var(--lp-accent)' },
        progress: { show: true, width: 24, itemStyle: { color: 'var(--lp-accent)' } },
        pointer: {
          show: true,
          length: '70%',
          width: 6,
          itemStyle: { color: 'var(--lp-ink)' },
        },
        axisLine: {
          lineStyle: {
            width: 24,
            color: [[1, 'var(--lp-surface-strong)']],
          },
        },
        axisTick: { distance: -30, length: 8, lineStyle: { width: 1, color: 'var(--lp-ink3)' } },
        splitLine: { distance: -30, length: 16, lineStyle: { width: 2, color: 'var(--lp-ink2)' } },
        axisLabel: { distance: -18, fontSize: 12, color: 'var(--lp-ink2)' },
        detail: {
          valueAnimation: true,
          formatter: '{value}' + unit,
          fontSize: 44,
          fontWeight: 900,
          fontFamily: 'var(--lp-font-mono)',
          color: 'var(--lp-ink)',
          offsetCenter: [0, '60%'],
          textShadowBlur: 16,
          textShadowColor: 'var(--lp-glow-accent)',
        },
        data: [{ value, name: title || '' }],
        title: {
          offsetCenter: [0, '85%'],
          fontSize: 16,
          color: 'var(--lp-ink2)',
        },
      },
    ],
  };

  return (
    <div className="lp-slide lp-theme02-chart-gauge">
      <div className="lp-theme02-chart-layout">
        <div className="lp-theme02-chart-main lp-rise">
          <div className="lp-theme02-chart-header">
            {kicker && (
              <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
                {kicker}
              </EditableField>
            )}
            <div>
              <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-chart-title">
                {title}
              </EditableField>
            </div>
          </div>
          <div className="lp-theme02-chart-wrapper lp-echart-wrapper">
            <LpEChart type="gauge" option={option} />
          </div>
        </div>

        {hasInsight && (
          <div className="lp-theme02-chart-insight lp-rise">
            {(insight.value || insight.label) && (
              <div className="lp-theme02-chart-insight-headline">
                {insight.value && (
                  <EditableField
                    prop="insight.value"
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="div"
                    className="lp-theme02-chart-insight-value"
                  >
                    {insight.value}
                  </EditableField>
                )}
                {insight.label && (
                  <EditableField
                    prop="insight.label"
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="div"
                    className="lp-theme02-chart-insight-sub"
                  >
                    {insight.label}
                  </EditableField>
                )}
              </div>
            )}
            {insight.description && (
              <EditableField
                prop="insight.description"
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-theme02-chart-funnel-description"
              >
                {insight.description}
              </EditableField>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
