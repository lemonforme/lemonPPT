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
export interface Theme01ChartHeatmapProps {
  title?: string;
  kicker?: string;
  xAxis?: string[];
  yAxis?: string[];
  data?: Array<[
    string,
    string,
    number
  ]>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ChartHeatmapMeta: LayoutMeta = {
  id: 'theme01_chart_heatmap',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 热力图',
  description: 'ECharts 热力图，适合展示矩阵密度或相关性',
  needsMedia: false,
};
export const theme01ChartHeatmapSchema: PropsSchema = {
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
      key: 'xAxis',
      label: 'xAxis',
      type: 'array',
      maxItems: 10,
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
      key: 'yAxis',
      label: 'yAxis',
      type: 'array',
      maxItems: 10,
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
      minItems: 2,
      maxItems: 12,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    }
  ]
};
export function Theme01ChartHeatmap(props: Theme01ChartHeatmapProps): ReactNode {
  const { title, kicker, _slideIdx, _editable } = props;
  const xAxis = props.xAxis ?? ['A', 'B', 'C', 'D'];
  const yAxis = props.yAxis ?? ['W1', 'W2', 'W3'];
  const data = props.data ?? xAxis.flatMap((x) => yAxis.map((y) => [x, y, Math.round(Math.random() * 100)] as [
    string,
    string,
    number
  ]));
  const option = {
    tooltip: { position: 'top' },
    grid: { top: 10, bottom: 40, left: 60, right: 20 },
    xAxis: { type: 'category', data: xAxis, splitArea: { show: true } },
    yAxis: { type: 'category', data: yAxis, splitArea: { show: true } },
    visualMap: {
      min: 0,
      max: Math.max(...data.map((d) => d[2])),
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: ['var(--lp-blue-100)', 'var(--lp-blue)'] },
    },
    series: [
      {
        type: 'heatmap',
        data,
        label: { show: true, fontSize: 12 },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
      },
    ],
  };
  return (
    <Sheet substrate="tint" tint="green" frame="chart-canvas" className="lp-chart-v2">
      <Blob
        className="lp-chart-v2-blob"
        style={{ width: 400, height: 400, top: -160, left: -120, background: 'var(--lp-green)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-chart-v2-dots"
        style={{ bottom: 110, right: 90, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-chart-v2-slash"
        style={{ top: 130, left: 110, height: 70, background: 'var(--lp-blue)', opacity: 0.45 }}
      />
      <Ring
        className="lp-chart-v2-ring"
        style={{ top: 120, right: 110, width: 64, height: 64, borderColor: 'var(--lp-amber)' }}
      />
      <Plus
        className="lp-chart-v2-plus"
        style={{ bottom: 140, right: 120, width: 28, height: 28, color: 'var(--lp-red)' }}
      />

      <div className="lp-chart-header lp-rise">
        {kicker && (
          <div className="lp-chart-kicker">
            <Pill variant="fill" color="green">{kicker}</Pill>
          </div>
        )}
        <Headline
          cn={title || '矩阵热力'}
          size="large"
          slideIdx={_slideIdx}
          editable={_editable}
          propCn="title"
          className="lp-chart-headline"
        />
      </div>

      <div className="lp-chart-body lp-rise">
        <div className="lp-chart-wrapper lp-echart-wrapper">
          <LpEChart type="heatmap" option={option} />
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
