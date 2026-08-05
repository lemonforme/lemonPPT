// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme02ChartFunnelInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02ChartFunnelProps {
  title?: string;
  kicker?: string;
  subtitle?: string;
  data?: Array<{ name: string; value: number }>;
  showInsight?: boolean;
  insight?: Theme02ChartFunnelInsight;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartFunnelMeta: LayoutMeta = {
  id: 'theme02_chart_funnel',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 漏斗图',
  description: '霓虹漏斗图，适合展示层级收敛与资金集中度',
  needsMedia: false,
};

export const theme02ChartFunnelSchema: PropsSchema = {
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
      key: 'subtitle',
      label: '副标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'value',
          label: '数值',
          type: 'number',
        },
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
        value: '24%',
        label: '头部 10 家 = 全市场近 1/4',
        description: '少数独角兽反复获得巨额追加投资，头部格局已然确立。',
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
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme02ChartFunnel(props: Theme02ChartFunnelProps): ReactNode {
  const {
    title,
    kicker,
    subtitle,
    data = [],
    showInsight = true,
    insight,
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const colors = [
    'var(--lp-accent)',
    'var(--lp-accent-cool)',
    'var(--lp-accent-2)',
    'var(--lp-violet)',
    'var(--lp-cyan)',
    'var(--lp-pink)',
  ];

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
      backgroundColor: 'rgba(8, 10, 14, 0.92)',
      borderColor: 'var(--lp-border)',
      textStyle: { color: 'var(--lp-ink)' },
    },
    color: colors,
    series: [
      {
        type: 'funnel',
        left: hasInsight ? '2%' : '10%',
        top: 10,
        bottom: 10,
        width: hasInsight ? '58%' : '80%',
        min: 0,
        max: data.length ? Math.max(...data.map((d) => d.value)) : 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          fontSize: 14,
          fontWeight: 800,
          color: 'var(--lp-text-inverse)',
          formatter: '{b}\n{c}',
        },
        labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
        itemStyle: {
          borderColor: 'rgba(255,255,255,0.85)',
          borderWidth: 2,
          shadowBlur: 20,
          shadowColor: 'var(--lp-glow-accent-subtle)',
        },
        emphasis: {
          label: { fontSize: 16, fontWeight: 900 },
          itemStyle: {
            shadowBlur: 32,
            shadowColor: 'var(--lp-glow-accent)',
            borderWidth: 2.5,
            borderColor: 'rgba(255,255,255,0.95)',
          },
        },
        animationDuration: 900,
        animationEasing: 'cubicOut',
        data: data.map((d, i) => ({
          ...d,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: colors[i % colors.length] },
                { offset: 1, color: colors[i % colors.length] + '80' },
              ],
            },
          },
        })),
      },
    ],
  };

  return (
    <div className="lp-slide lp-theme02-chart-funnel">
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
              {subtitle && (
                <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-chart-subtitle">
                  {subtitle}
                </EditableField>
              )}
            </div>
          </div>
          <div className="lp-theme02-chart-wrapper lp-echart-wrapper">
            <LpEChart type="funnel" option={option} />
          </div>
          {footnote && (
            <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-footnote">
              {footnote}
            </EditableField>
          )}
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
