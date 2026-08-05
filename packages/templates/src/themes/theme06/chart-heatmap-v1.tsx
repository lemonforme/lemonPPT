// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06ChartHeatmapV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxis?: string[];
  yAxis?: string[];
  data?: Array<[string, string, number]>;
  min?: number;
  max?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChartHeatmapV1Meta: LayoutMeta = {
  id: 'theme06_chart_heatmap_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 热力图',
  description: '矩阵热力图，适合展示密度、相关性或强度分布',
  needsMedia: true,
  tags: ['chart', 'heatmap', 'matrix', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06ChartHeatmapV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'HEATMAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '用户行为热力分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '高频交互集中在工作日晚间与周末下午' },
    {
      key: 'xAxis',
      label: 'X 轴分类',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [{ item: '周一' }, { item: '周二' }, { item: '周三' }, { item: '周四' }, { item: '周五' }],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'yAxis',
      label: 'Y 轴分类',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [{ item: '早晨' }, { item: '下午' }, { item: '晚间' }],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据 [x, y, 值]',
      type: 'array',
      minItems: 2,
      maxItems: 48,
      defaultValue: [
        { item: '周一,早晨,28' },
        { item: '周一,下午,45' },
        { item: '周一,晚间,72' },
        { item: '周二,早晨,35' },
        { item: '周二,下午,58' },
        { item: '周二,晚间,64' },
        { item: '周三,早晨,22' },
        { item: '周三,下午,61' },
        { item: '周三,晚间,80' },
        { item: '周四,早晨,40' },
        { item: '周四,下午,55' },
        { item: '周四,晚间,76' },
        { item: '周五,早晨,18' },
        { item: '周五,下午,70' },
        { item: '周五,晚间,92' },
      ],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
  ],
};

function parseHeatmapData(
  raw: Array<unknown>,
  xAxis: string[],
  yAxis: string[]
): Array<[string, string, number]> {
  const parsed: Array<[string, string, number]> = [];
  for (const item of raw) {
    if (Array.isArray(item) && item.length >= 3) {
      parsed.push([String(item[0]), String(item[1]), Number(item[2]) || 0]);
    } else if (typeof item === 'string') {
      const parts = item.split(',');
      if (parts.length >= 3) {
        parsed.push([parts[0].trim(), parts[1].trim(), Number(parts[2]) || 0]);
      }
    } else if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      const text = String(obj.item ?? obj.value ?? '');
      const parts = text.split(',');
      if (parts.length >= 3) {
        parsed.push([parts[0].trim(), parts[1].trim(), Number(parts[2]) || 0]);
      }
    }
  }
  if (parsed.length === 0) {
    return xAxis.flatMap((x) => yAxis.map((y) => [x, y, Math.round(Math.random() * 100)] as [string, string, number]));
  }
  return parsed;
}

function buildOption(
  xAxis: string[],
  yAxis: string[],
  data: Array<[string, string, number]>,
  min?: number,
  max?: number
): Record<string, unknown> {
  const values = data.map((d) => d[2]);
  const computedMax = max ?? Math.max(...values, 1);
  const computedMin = min ?? Math.min(...values, 0);

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border-strong)',
      textStyle: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)' },
      formatter: (params: { name?: string; value?: [string, string, number] | number[]; data?: [string, string, number] }) => {
        const row = (params.value as [string, string, number]) || params.data || ['', '', 0];
        return `${row[0]} · ${row[1]}<br/><strong>${row[2]}</strong>`;
      },
    },
    grid: { top: 24, right: 24, bottom: 64, left: 80, containLabel: false },
    xAxis: {
      type: 'category',
      data: xAxis,
      splitArea: { show: true, areaStyle: { color: ['var(--lp-surface)', 'transparent'] } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
      },
    },
    yAxis: {
      type: 'category',
      data: yAxis,
      splitArea: { show: true, areaStyle: { color: ['var(--lp-surface)', 'transparent'] } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
      },
    },
    visualMap: {
      min: computedMin,
      max: computedMax,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 8,
      itemWidth: 12,
      itemHeight: 100,
      textStyle: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
      inRange: {
        color: ['var(--lp-surface-strong)', 'var(--lp-accent-2)', 'var(--lp-accent)'],
      },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'var(--lp-font-mono)',
          color: 'var(--lp-text-inverse)',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'var(--lp-accent)',
            borderColor: 'var(--lp-accent)',
            borderWidth: 2,
          },
        },
        itemStyle: {
          borderColor: 'var(--lp-divider)',
          borderWidth: 1,
          borderRadius: 4,
        },
        animationDuration: 800,
      },
    ],
  };
}

export function Theme06ChartHeatmapV1(props: Theme06ChartHeatmapV1Props): ReactNode {
  const { kicker, title, subtitle, xAxis: rawX = [], yAxis: rawY = [], data: rawData = [], min, max, _slideIdx, _editable } = props;

  const normX = rawX.map((x) => (typeof x === 'string' ? x : (x as { item?: string }).item ?? '')).filter(Boolean);
  const normY = rawY.map((y) => (typeof y === 'string' ? y : (y as { item?: string }).item ?? '')).filter(Boolean);
  const xAxis = normX.length > 0 ? normX : ['周一', '周二', '周三', '周四', '周五'];
  const yAxis = normY.length > 0 ? normY : ['早晨', '下午', '晚间'];
  const data = parseHeatmapData(rawData as Array<unknown>, xAxis, yAxis);

  return (
    <div className="lp-slide lp-theme06-chart-heatmap">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chart-heatmap-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme06-chart-heatmap-canvas">
          <LpEChart type="heatmap" option={buildOption(xAxis, yAxis, data, min, max)} />
        </div>
      </div>
      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
