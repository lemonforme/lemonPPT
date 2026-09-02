// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
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
export interface Theme01ChartTreemapProps {
  title?: string;
  kicker?: string;
  unit?: string;
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
export const theme01ChartTreemapMeta: LayoutMeta = {
  id: 'theme01_chart_treemap',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 矩形树图',
  description: 'ECharts 矩形树图，适合展示赛道/资金流向占比',
  needsMedia: false,
};
export const theme01ChartTreemapSchema: PropsSchema = {
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
      key: 'unit',
      label: '单位',
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
export function Theme01ChartTreemap(props: Theme01ChartTreemapProps): ReactNode {
  const { title, kicker, unit, data = [], _slideIdx, _editable } = props;
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}',
    },
    series: [
      {
        type: 'treemap',
        width: '100%',
        height: '100%',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: '{b}\n{c}',
          fontSize: 14,
          fontWeight: 700,
        },
        itemStyle: {
          borderColor: 'var(--lp-white)',
          borderWidth: 2,
          gapWidth: 2,
        },
        data,
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
        style={{ bottom: 130, left: 110, height: 70, background: 'var(--lp-green)', opacity: 0.45 }}
      />
      <Ring
        className="lp-chart-v2-ring"
        style={{ top: 120, right: 110, width: 64, height: 64, borderColor: 'var(--lp-amber)' }}
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
          cn={title || '矩形树图'}
          size="large"
          slideIdx={_slideIdx}
          editable={_editable}
          propCn="title"
          className="lp-chart-headline"
        />
      </div>

      <div className="lp-chart-body lp-rise">
        <div className="lp-chart-wrapper lp-echart-wrapper">
          <LpEChart type="treemap" option={option} />
        </div>
      </div>

      {unit && (
        <div className="lp-chart-footer lp-rise">
          <div className="lp-chart-unit">
            单位：
            <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span">
              {unit}
            </EditableField>
          </div>
        </div>
      )}

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
