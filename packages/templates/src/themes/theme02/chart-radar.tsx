// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme02ChartRadarInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02ChartRadarProps {
  title?: string;
  kicker?: string;
  indicators?: Array<{ name: string; max: number }>;
  data?: Array<{ name: string; value: number[] }>;
  showInsight?: boolean;
  insight?: Theme02ChartRadarInsight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartRadarMeta: LayoutMeta = {
  id: 'theme02_chart_radar',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 雷达图',
  description: '霓虹雷达图，适合展示多维度能力对比',
  needsMedia: false,
};

export const theme02ChartRadarSchema: PropsSchema = {
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
      key: 'indicators',
      label: '维度',
      type: 'array',
      maxItems: 10,
      minItems: 1,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'max',
          label: '最大值',
          type: 'number',
        },
      ],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 6,
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
          type: 'array',
          maxItems: 10,
          minItems: 1,
          itemSchema: [
            {
              key: 'item',
              label: '项',
              type: 'number',
            },
          ],
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
        value: '84.6',
        label: '当前综合能力均分',
        description: '性能与稳定性表现突出，易用性仍有提升空间，建议优先优化交互流程。',
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

export function Theme02ChartRadar(props: Theme02ChartRadarProps): ReactNode {
  const { title, kicker, showInsight = true, insight, _slideIdx, _editable } = props;
  const indicators = props.indicators ?? [
    { name: '性能', max: 100 },
    { name: '稳定性', max: 100 },
    { name: '易用性', max: 100 },
    { name: '扩展性', max: 100 },
    { name: '安全性', max: 100 },
  ];
  const data = props.data ?? [
    { name: '当前', value: [85, 90, 78, 88, 82] },
    { name: '目标', value: [95, 95, 90, 92, 95] },
  ];

  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(8, 10, 14, 0.92)',
      borderColor: 'var(--lp-border)',
      textStyle: { color: 'var(--lp-ink)' },
    },
    legend: {
      bottom: 0,
      data: data.map((d) => d.name),
      textStyle: { color: 'var(--lp-ink2)', fontSize: 12 },
      itemGap: 20,
    },
    radar: {
      indicator: indicators,
      radius: '60%',
      splitNumber: 4,
      axisName: { fontSize: 12, fontWeight: 600, color: 'var(--lp-ink2)' },
      splitLine: { lineStyle: { color: 'var(--lp-border)' } },
      splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.06)'] } },
      axisLine: { lineStyle: { color: 'var(--lp-border)' } },
    },
    series: [
      {
        type: 'radar',
        data: data.map((d, i) => ({
          value: d.value,
          name: d.name,
          areaStyle: i === 0 ? { opacity: 0.25, color: 'var(--lp-accent)' } : undefined,
          lineStyle: { width: 3 },
          symbolSize: 6,
        })),
      },
    ],
  };

  return (
    <div className="lp-slide lp-theme02-chart-radar">
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
            <LpEChart type="radar" option={option} />
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
