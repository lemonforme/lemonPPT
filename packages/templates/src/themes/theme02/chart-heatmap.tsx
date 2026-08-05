// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme02ChartHeatmapInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme02ChartHeatmapProps {
  title?: string;
  kicker?: string;
  xAxis?: string[];
  yAxis?: string[];
  data?: Array<[string, string, number]>;
  showInsight?: boolean;
  insight?: Theme02ChartHeatmapInsight;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartHeatmapMeta: LayoutMeta = {
  id: 'theme02_chart_heatmap',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 热力图',
  description: '霓虹热力图，适合展示矩阵密度或时间分布',
  needsMedia: false,
};

export const theme02ChartHeatmapSchema: PropsSchema = {
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
      key: 'xAxis',
      label: 'X 轴',
      type: 'array',
      maxItems: 10,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'yAxis',
      label: 'Y 轴',
      type: 'array',
      maxItems: 10,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 2,
      maxItems: 120,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true,
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
        value: '97',
        label: '周五 18:00 活跃度峰值',
        description: '工作日晚间是用户活跃高峰，适合推送关键内容与运营活动。',
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

export function Theme02ChartHeatmap(props: Theme02ChartHeatmapProps): ReactNode {
  const { title, kicker, showInsight = true, insight, _slideIdx, _editable } = props;
  const xAxis = props.xAxis ?? ['周一', '周二', '周三', '周四', '周五'];
  const yAxis = props.yAxis ?? ['00:00', '06:00', '12:00', '18:00'];
  const data =
    props.data ??
    (xAxis.flatMap((x) => yAxis.map((y) => [x, y, Math.round(Math.random() * 100)] as [string, string, number])) as Array<
      [string, string, number]
    >);

  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);
  const maxValue = Math.max(...data.map((d) => d[2]));

  const option = {
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(8, 10, 14, 0.92)',
      borderColor: 'var(--lp-border)',
      textStyle: { color: 'var(--lp-ink)' },
    },
    grid: { top: 10, bottom: 50, left: 70, right: 20 },
    xAxis: {
      type: 'category',
      data: xAxis,
      splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
      axisLine: { lineStyle: { color: 'var(--lp-border)' } },
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 12 },
    },
    yAxis: {
      type: 'category',
      data: yAxis,
      splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
      axisLine: { lineStyle: { color: 'var(--lp-border)' } },
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 12 },
    },
    visualMap: {
      min: 0,
      max: maxValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      textStyle: { color: 'var(--lp-ink2)' },
      inRange: {
        color: ['var(--lp-surface-solid)', 'var(--lp-accent-cool)', 'var(--lp-accent)'],
      },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: true, fontSize: 12, color: 'var(--lp-ink)' },
        itemStyle: {
          borderColor: 'var(--lp-bg)',
          borderWidth: 2,
          borderRadius: 4,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 20,
            shadowColor: 'var(--lp-glow-accent)',
          },
        },
      },
    ],
  };

  return (
    <div className="lp-slide lp-theme02-chart-heatmap">
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
            <LpEChart type="heatmap" option={option} />
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
