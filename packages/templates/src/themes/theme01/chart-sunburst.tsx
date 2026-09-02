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
export interface Theme01ChartSunburstProps {
  title?: string;
  kicker?: string;
  data?: Array<{
    name: string;
    value: number;
    children?: Array<{
      name: string;
      value: number;
    }>;
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ChartSunburstMeta: LayoutMeta = {
  id: 'theme01_chart_sunburst',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 旭日图',
  description: 'ECharts 旭日图，适合展示层级占比关系',
  needsMedia: false,
};
export const theme01ChartSunburstSchema: PropsSchema = {
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
          inlineEditable: true
        },
        {
          key: 'value',
          label: '数值',
          type: 'number'
        },
        {
          key: 'children',
          label: 'children',
          type: 'array',
          maxItems: 20,
          minItems: 1,
          itemSchema: []
        },
        {
          key: 'value',
          label: '数值',
          type: 'number'
        }
      ]
    }
  ]
};
export function Theme01ChartSunburst(props: Theme01ChartSunburstProps): ReactNode {
  const { title, kicker, data = [], _slideIdx, _editable } = props;
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [
      {
        type: 'sunburst',
        radius: [0, '90%'],
        data,
        label: { rotate: 'radial', fontSize: 11, fontWeight: 600 },
        itemStyle: { borderColor: 'var(--lp-white)', borderWidth: 2 },
      },
    ],
  };
  return (
    <Sheet substrate="tint" tint="amber" frame="chart-canvas" className="lp-chart-v2">
      <Blob
        className="lp-chart-v2-blob"
        style={{ width: 400, height: 400, top: -160, right: -120, background: 'var(--lp-amber)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-chart-v2-dots"
        style={{ bottom: 110, left: 90, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-chart-v2-slash"
        style={{ bottom: 130, left: 110, height: 70, background: 'var(--lp-green)', opacity: 0.45 }}
      />
      <Ring
        className="lp-chart-v2-ring"
        style={{ top: 120, right: 110, width: 64, height: 64, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-chart-v2-plus"
        style={{ top: 140, left: 120, width: 28, height: 28, color: 'var(--lp-red)' }}
      />

      <div className="lp-chart-header lp-rise">
        {kicker && (
          <div className="lp-chart-kicker">
            <Pill variant="fill" color="amber">{kicker}</Pill>
          </div>
        )}
        <Headline
          cn={title || '旭日层级'}
          size="large"
          slideIdx={_slideIdx}
          editable={_editable}
          propCn="title"
          className="lp-chart-headline"
        />
      </div>

      <div className="lp-chart-body lp-rise">
        <div className="lp-chart-wrapper lp-echart-wrapper">
          <LpEChart type="sunburst" option={option} />
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
