// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
export interface Theme01TrendV1Point {
  label?: string;
  value?: number;
}
export interface Theme01TrendV1Series {
  name?: string;
  data?: Theme01TrendV1Point[];
}
export interface Theme01TrendV1Props {
  kicker?: string;
  title?: string;
  series?: Theme01TrendV1Series[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01TrendV1Meta: LayoutMeta = {
  id: 'theme01_trend_v1',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 趋势图',
  description: '多系列折线/面积趋势图',
  needsMedia: false,
};
export const theme01TrendV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'series',
      label: '系列',
      type: 'array',
      maxItems: 4,
      minItems: 1,
      itemSchema: [
        {
          key: 'name',
          label: '系列名称',
          type: 'text',
          inlineEditable: true
        },
        {
          key: 'data',
          label: '数据点',
          type: 'array',
          maxItems: 12,
          minItems: 1,
          itemSchema: [
            {
              key: 'label',
              label: '标签',
              type: 'text',
              inlineEditable: true
            },
            {
              key: 'value',
              label: '数值',
              type: 'number',
              inlineEditable: true
            }
          ]
        }
      ]
    }
  ]
};
export function Theme01TrendV1(props: Theme01TrendV1Props): ReactNode {
  const { kicker, title, series = [], _slideIdx, _editable } = props;
  const safeSeries = series.slice(0, 4);
  const allPoints = safeSeries.flatMap((s) => s.data || []);
  const labels = Array.from(new Set(allPoints.map((p) => p.label || ''))).filter(Boolean);
  const values = safeSeries.map((s) => labels.map((label) => {
    const point = (s.data || []).find((p) => p.label === label);
    return typeof point?.value === 'number' ? point.value : 0;
  }));
  const maxValue = Math.max(1, ...values.flat());
  const chartHeight = 240;
  const chartWidth = 720;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;
  const xFor = (index: number) => padding.left + (index / (labels.length - 1 || 1)) * innerW;
  const yFor = (value: number) => padding.top + innerH - (value / maxValue) * innerH;
  const colors = ['var(--lp-blue)', 'var(--lp-green)', 'var(--lp-amber)', 'var(--lp-red)'];
  return (<div className="lp-slide lp-trend-v1">
      <div className="lp-trend-v1-inner">
    {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>)}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-trend-v1-title lp-rise">
          {title}
    </EditableField>
    <div className="lp-trend-v1-chart lp-rise">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="lp-trend-v1-svg">
      {/* grid lines */}
      {Array.from({ length: 5 }).map((_, i) => {
      const y = padding.top + (i / 4) * innerH;
      return (<line key={`h-${i}`} x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} className="lp-trend-v1-grid"/>);
    })}
      {labels.map((_, i) => {
      const x = xFor(i);
      return <line key={`v-${i}`} x1={x} y1={padding.top} x2={x} y2={padding.top + innerH} className="lp-trend-v1-grid"/>;
    })}

      {/* axes */}
      <line x1={padding.left} y1={padding.top + innerH} x2={padding.left + innerW} y2={padding.top + innerH} className="lp-trend-v1-axis"/>
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} className="lp-trend-v1-axis"/>

      {/* lines */}
      {safeSeries.map((_, seriesIdx) => {
      const seriesValues = values[seriesIdx];
      const points = seriesValues.map((value, i) => `${xFor(i)},${yFor(value)}`).join(' ');
      const areaPoints = `${xFor(0)},${padding.top + innerH} ${points} ${xFor(labels.length - 1 || 0)},${padding.top + innerH}`;
      const color = colors[seriesIdx % colors.length];
      return (<g key={seriesIdx}>
                  <polygon points={areaPoints} fill={color} fillOpacity="0.12"/>
                  <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  {seriesValues.map((value, i) => (<circle key={i} cx={xFor(i)} cy={yFor(value)} r="5" fill={color} stroke="var(--lp-white)" strokeWidth="2"/>))}
        </g>);
    })}

      {/* labels */}
      {labels.map((label, i) => (<text key={i} x={xFor(i)} y={padding.top + innerH + 22} textAnchor="middle" className="lp-trend-v1-label">
        {label}
              </text>))}
      {Array.from({ length: 5 }).map((_, i) => {
      const value = Math.round(maxValue * (1 - i / 4));
      return (<text key={i} x={padding.left - 10} y={padding.top + (i / 4) * innerH + 4} textAnchor="end" className="lp-trend-v1-label">
                  {value}
        </text>);
    })}
          </svg>
          {safeSeries.length > 0 && (<div className="lp-trend-v1-legend">
              {safeSeries.map((s, i) => (<div key={i} className="lp-trend-v1-legend-item">
                  <span className="lp-trend-v1-legend-dot" style={{ background: colors[i % colors.length] }}/>
                  <EditableField prop={`series.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">
          {s.name || `系列 ${i + 1}`}
                  </EditableField>
        </div>))}
      </div>)}
    </div>
      </div>
  </div>);
}
