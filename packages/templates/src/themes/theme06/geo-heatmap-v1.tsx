// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06GeoHeatmapV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxis?: Array<{ item?: string } | string>;
  yAxis?: Array<{ item?: string } | string>;
  data?: Array<[string, string, number]>;
  min?: number;
  max?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06GeoHeatmapV1Meta: LayoutMeta = {
  id: 'theme06_geo_heatmap_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 地理热力',
  description: '区域 × 指标热力图',
  needsMedia: true,
  tags: ['geo', 'heatmap', 'chart', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06GeoHeatmapV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GEO HEATMAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '区域 AI 投资热度' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '不同区域在融资、人才与政策三个维度的热度分布' },
    {
      key: 'xAxis',
      label: 'X 轴指标',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [{ item: '融资热度' }, { item: '人才密度' }, { item: '政策开放度' }],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'yAxis',
      label: 'Y 轴区域',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [{ item: '湾区' }, { item: '纽约' }, { item: '西雅图' }, { item: '波士顿' }, { item: '洛杉矶' }],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据 [x, y, 值]',
      type: 'array',
      minItems: 2,
      maxItems: 30,
      defaultValue: [
        { item: '融资热度,湾区,95' },
        { item: '人才密度,湾区,92' },
        { item: '政策开放度,湾区,78' },
        { item: '融资热度,纽约,82' },
        { item: '人才密度,纽约,85' },
        { item: '政策开放度,纽约,72' },
        { item: '融资热度,西雅图,68' },
        { item: '人才密度,西雅图,74' },
        { item: '政策开放度,西雅图,80' },
        { item: '融资热度,波士顿,58' },
        { item: '人才密度,波士顿,70' },
        { item: '政策开放度,波士顿,68' },
        { item: '融资热度,洛杉矶,52' },
        { item: '人才密度,洛杉矶,60' },
        { item: '政策开放度,洛杉矶,65' },
      ],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
  ],
};

function parseHeatmapData(raw: Array<unknown>): Array<[string, string, number]> {
  const parsed: Array<[string, string, number]> = [];
  for (const item of raw) {
    if (Array.isArray(item) && item.length >= 3) {
      parsed.push([String(item[0]), String(item[1]), Number(item[2]) || 0]);
    } else if (typeof item === 'string') {
      const parts = item.split(',');
      if (parts.length >= 3) parsed.push([parts[0].trim(), parts[1].trim(), Number(parts[2]) || 0]);
    } else if (item && typeof item === 'object') {
      const text = String((item as { item?: string }).item ?? '');
      const parts = text.split(',');
      if (parts.length >= 3) parsed.push([parts[0].trim(), parts[1].trim(), Number(parts[2]) || 0]);
    }
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
      formatter: (params: { value?: [string, string, number] }) => {
        const row = params.value || ['', '', 0];
        return `${row[0]} · ${row[1]}<br/><strong>${row[2]}</strong>`;
      },
    },
    grid: { top: 24, right: 24, bottom: 64, left: 100, containLabel: false },
    xAxis: {
      type: 'category',
      data: xAxis,
      splitArea: { show: true, areaStyle: { color: ['var(--lp-surface)', 'transparent'] } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--lp-font)' },
    },
    yAxis: {
      type: 'category',
      data: yAxis,
      splitArea: { show: true, areaStyle: { color: ['var(--lp-surface)', 'transparent'] } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 12, fontWeight: 600, fontFamily: 'var(--lp-font)' },
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

export function Theme06GeoHeatmapV1(props: Theme06GeoHeatmapV1Props): ReactNode {
  const { kicker, title, subtitle, xAxis: rawX = [], yAxis: rawY = [], data: rawData = [], min, max, _slideIdx, _editable } = props;

  const normX = rawX.map((x) => (typeof x === 'string' ? x : x.item ?? '')).filter(Boolean);
  const normY = rawY.map((y) => (typeof y === 'string' ? y : y.item ?? '')).filter(Boolean);
  const xAxis = normX.length > 0 ? normX : ['融资热度', '人才密度', '政策开放度'];
  const yAxis = normY.length > 0 ? normY : ['湾区', '纽约', '西雅图', '波士顿', '洛杉矶'];
  const data = parseHeatmapData(rawData as Array<unknown>);

  return (
    <div className="lp-slide lp-theme06-geo-heatmap">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-geo-heatmap-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme06-geo-heatmap-canvas">
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
