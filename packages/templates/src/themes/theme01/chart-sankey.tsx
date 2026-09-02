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

export interface Theme01ChartSankeyProps {
  title?: string;
  kicker?: string;
  data?: Array<{ source: string; target: string; value: number }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ChartSankeyMeta: LayoutMeta = {
  id: 'theme01_chart_sankey',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 桑基图',
  description: 'ECharts 桑基图，适合展示流量、资金或转化路径',
  needsMedia: false,
};

export const theme01ChartSankeySchema: PropsSchema = {
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
          key: 'source',
          label: 'source',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'target',
          label: 'target',
          type: 'text',
          inlineEditable: true
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


export function Theme01ChartSankey(props: Theme01ChartSankeyProps): ReactNode {
  const { title, kicker, data = [], _slideIdx, _editable } = props;

  const nodeNames = Array.from(new Set(data.flatMap((d) => [d.source, d.target])));
  const nodes = nodeNames.map((name) => ({ name }));
  const links = data.map((d) => ({ source: d.source, target: d.target, value: d.value }));

  const option = {
  tooltip: { trigger: 'item', triggerOn: 'mousemove' },
  series: [
      {
    type: 'sankey',
    layout: 'none',
    emphasis: { focus: 'adjacency' },
    data: nodes,
    links,
    lineStyle: { color: 'gradient', curveness: 0.5 },
    label: { fontSize: 12, fontWeight: 600 },
      },
  ],
  };

  return (
    <Sheet substrate="tint" tint="blue" frame="chart-canvas" className="lp-chart-v2">
      <Blob
        className="lp-chart-v2-blob"
        style={{ width: 400, height: 400, bottom: -160, right: -120, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-chart-v2-dots"
        style={{ top: 110, left: 90, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-chart-v2-slash"
        style={{ top: 130, right: 110, height: 70, background: 'var(--lp-amber)', opacity: 0.45 }}
      />
      <Ring
        className="lp-chart-v2-ring"
        style={{ bottom: 130, left: 110, width: 64, height: 64, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-chart-v2-plus"
        style={{ bottom: 140, left: 120, width: 28, height: 28, color: 'var(--lp-red)' }}
      />

      <div className="lp-chart-header lp-rise">
        {kicker && (
          <div className="lp-chart-kicker">
            <Pill variant="fill" color="blue">{kicker}</Pill>
          </div>
        )}
        <Headline
          cn={title || '流向关系'}
          size="large"
          slideIdx={_slideIdx}
          editable={_editable}
          propCn="title"
          className="lp-chart-headline"
        />
      </div>

      <div className="lp-chart-body lp-rise">
        <div className="lp-chart-wrapper lp-echart-wrapper">
          <LpEChart type="sankey" option={option} />
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
