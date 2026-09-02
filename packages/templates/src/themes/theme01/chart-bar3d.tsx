// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { LpEChart } from './echart.js';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';
export interface Theme01ChartBar3dProps {
  title?: string;
  kicker?: string;
  labels?: string[];
  data?: number[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ChartBar3dMeta: LayoutMeta = {
  id: 'theme01_chart_bar3d',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 3D 柱状图',
  description: '伪 3D 柱状图，使用光影渐变营造立体冲击感',
  needsMedia: false,
};
export const theme01ChartBar3dSchema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'labels',
      label: '标签',
      type: 'array',
      maxItems: 12,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      maxItems: 12,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'number'
        }
      ]
    }
  ]
};
// 注意：adjustColor 做十六进制运算，必须喂入 hex，不能喂 var(--lp-*) 字符串
// （否则会产生 rgb(NaN)，柱子不渲染）。这里直接用 token 的 hex 值，与 ECharts 运行时调色板一致。
const THEME_COLORS = ['#EF4444', '#FBBF24', '#14B8A6', '#3B82F6', '#8B5CF6', '#06B6D4', '#F472B6', '#FB923C'];
export function Theme01ChartBar3d(props: Theme01ChartBar3dProps): ReactNode {
  const { title, kicker, _slideIdx, _editable } = props;
  const labels = props.labels ?? ['Q1', 'Q2', 'Q3', 'Q4'];
  const data = props.data ?? [120, 200, 150, 80];
  const max = Math.max(...data, 1);
  const barWidth = 32;
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '10%', right: '8%', bottom: '16%', top: '15%' },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: 'var(--lp-gray-700)', fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: 'var(--lp-gray-200)' } },
      axisLabel: { fontSize: 11, color: 'var(--lp-gray-500)' },
    },
    series: [
      // 投影
      {
        type: 'bar',
        data: data.map(() => max * 0.04),
        barWidth: barWidth * 1.2,
        barGap: '-115%',
        z: 1,
        itemStyle: {
          color: 'rgba(0,0,0,0.08)',
          borderRadius: [barWidth / 2, barWidth / 2, 0, 0],
        },
        silent: true,
        animation: false,
      },
      // 柱体
      {
        type: 'bar',
        data: data.map((value, i) => ({
          value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: lighten(THEME_COLORS[i % THEME_COLORS.length], 15) },
                { offset: 0.5, color: THEME_COLORS[i % THEME_COLORS.length] },
                { offset: 1, color: darken(THEME_COLORS[i % THEME_COLORS.length], 20) },
              ],
            },
            borderRadius: [4, 4, 0, 0],
            shadowColor: 'rgba(0,0,0,0.25)',
            shadowBlur: 8,
            shadowOffsetY: 4,
          },
        })),
        barWidth,
        z: 2,
        label: { show: true, position: 'top', fontSize: 12, fontWeight: 700, color: 'var(--lp-gray-700)' },
      },
      // 柱顶椭圆面
      {
        type: 'pictorialBar',
        symbol: 'circle',
        symbolSize: [barWidth, barWidth * 0.45],
        symbolPosition: 'end',
        symbolOffset: [0, -barWidth * 0.22],
        z: 3,
        data: data.map((value, i) => ({
          value,
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: lighten(THEME_COLORS[i % THEME_COLORS.length], 25) },
                { offset: 1, color: THEME_COLORS[i % THEME_COLORS.length] },
              ],
            },
            shadowColor: 'rgba(0,0,0,0.15)',
            shadowBlur: 4,
            shadowOffsetY: 2,
          },
        })),
        silent: true,
      },
    ],
  };
  return (
    <Sheet substrate="tint" tint="pink" frame="chart-canvas" className="lp-chart-v2">
      <Blob
        className="lp-chart-v2-blob"
        style={{ width: 400, height: 400, bottom: -160, left: -120, background: 'var(--lp-violet)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-chart-v2-dots"
        style={{ top: 110, right: 90, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-chart-v2-slash"
        style={{ bottom: 130, right: 110, height: 70, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-chart-v2-ring"
        style={{ top: 120, left: 110, width: 64, height: 64, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-chart-v2-plus"
        style={{ bottom: 120, right: 120, width: 28, height: 28, color: 'var(--lp-red)' }}
      />

      <div className="lp-chart-header lp-rise">
        {kicker && (
          <div className="lp-chart-kicker">
            <Pill variant="fill" color="violet">{kicker}</Pill>
          </div>
        )}
        <Headline
          cn={title || '季度销量对比'}
          size="large"
          slideIdx={_slideIdx}
          editable={_editable}
          propCn="title"
          className="lp-chart-headline"
        />
      </div>

      <div className="lp-chart-body lp-rise">
        <div className="lp-chart-wrapper lp-echart-wrapper">
          <LpEChart type="bar3d" option={option} />
        </div>
      </div>

      <Folio
        left="CHART"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
function lighten(hex: string, percent: number): string {
  return adjustColor(hex, percent);
}
function darken(hex: string, percent: number): string {
  return adjustColor(hex, -percent);
}
function adjustColor(hex: string, percent: number): string {
  // 防御：非 hex（如 var(--lp-*)）直接原样返回，避免产生 rgb(NaN)
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const num = Number.parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + percent * 2.55));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent * 2.55));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent * 2.55));
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
