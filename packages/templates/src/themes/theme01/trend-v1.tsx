// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Headline, Pill, Plus, Ring, Sheet, Slash } from './shared.js';

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
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
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
          inlineEditable: true,
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
              inlineEditable: true,
            },
            {
              key: 'value',
              label: '数值',
              type: 'number',
              inlineEditable: true,
            },
          ],
        },
      ],
    },
  ],
};

export function Theme01TrendV1(props: Theme01TrendV1Props): ReactNode {
  const { kicker, title, series = [], _slideIdx, _editable } = props;
  const safeSeries = series.slice(0, 4);
  const allPoints = safeSeries.flatMap((s) => s.data || []);
  const labels = Array.from(new Set(allPoints.map((p) => p.label || ''))).filter(Boolean);
  const values = safeSeries.map((s) =>
    labels.map((label) => {
      const point = (s.data || []).find((p) => p.label === label);
      return typeof point?.value === 'number' ? point.value : 0;
    })
  );
  const maxValue = Math.max(1, ...values.flat());

  const chartHeight = 260;
  const chartWidth = 840;
  const padding = { top: 20, right: 30, bottom: 44, left: 56 };
  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;
  const xFor = (index: number) => padding.left + (index / (labels.length - 1 || 1)) * innerW;
  const yFor = (value: number) => padding.top + innerH - (value / maxValue) * innerH;
  const colors = ['var(--lp-blue)', 'var(--lp-green)', 'var(--lp-amber)', 'var(--lp-red)'];

  return (
    <Sheet substrate="tint" tint="amber" frame="chart-canvas" className="lp-trend-v1">
      <Blob
        className="lp-trend-v1-blob"
        style={{ width: 420, height: 420, top: -160, right: -120, background: 'var(--lp-amber)', opacity: 0.16 }}
      />
      <DottedPattern
        className="lp-trend-v1-dots"
        style={{ bottom: 80, left: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-trend-v1-slash"
        style={{ top: 120, left: 100, height: 80, background: 'var(--lp-blue)', opacity: 0.5 }}
      />
      <Ring
        className="lp-trend-v1-ring"
        style={{ width: 130, height: 130, bottom: 90, right: 100, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-trend-v1-plus"
        style={{ top: 160, right: 130, width: 34, height: 34, color: 'var(--lp-red)' }}
      />

      <div className="lp-trend-v1-content">
        <div className="lp-trend-v1-header lp-rise">
          {kicker && (
            <div className="lp-trend-v1-kicker">
              <Pill variant="outline" color="amber">
                {kicker}
              </Pill>
            </div>
          )}
          <Headline cn={title || ''} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
        </div>

        <div className="lp-trend-v1-chart lp-rise">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="lp-trend-v1-svg">
            {/* grid lines */}
            {Array.from({ length: 5 }).map((_, i) => {
              const y = padding.top + (i / 4) * innerH;
              return <line key={`h-${i}`} x1={padding.left} y1={y} x2={padding.left + innerW} y2={y} className="lp-trend-v1-grid" />;
            })}
            {labels.map((_, i) => {
              const x = xFor(i);
              return <line key={`v-${i}`} x1={x} y1={padding.top} x2={x} y2={padding.top + innerH} className="lp-trend-v1-grid" />;
            })}

            {/* axes */}
            <line x1={padding.left} y1={padding.top + innerH} x2={padding.left + innerW} y2={padding.top + innerH} className="lp-trend-v1-axis" />
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + innerH} className="lp-trend-v1-axis" />

            {/* lines */}
            {safeSeries.map((_, seriesIdx) => {
              const seriesValues = values[seriesIdx];
              const points = seriesValues.map((value, i) => `${xFor(i)},${yFor(value)}`).join(' ');
              const areaPoints = `${xFor(0)},${padding.top + innerH} ${points} ${xFor(labels.length - 1 || 0)},${padding.top + innerH}`;
              const color = colors[seriesIdx % colors.length];
              return (
                <g key={seriesIdx}>
                  <polygon points={areaPoints} fill={color} fillOpacity="0.12" />
                  <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {seriesValues.map((value, i) => (
                    <circle key={i} cx={xFor(i)} cy={yFor(value)} r="5" fill={color} stroke="var(--lp-white)" strokeWidth="2" />
                  ))}
                </g>
              );
            })}

            {/* labels */}
            {labels.map((label, i) => (
              <text key={i} x={xFor(i)} y={padding.top + innerH + 24} textAnchor="middle" className="lp-trend-v1-label">
                {label}
              </text>
            ))}
            {Array.from({ length: 5 }).map((_, i) => {
              const value = Math.round(maxValue * (1 - i / 4));
              return (
                <text key={i} x={padding.left - 12} y={padding.top + (i / 4) * innerH + 4} textAnchor="end" className="lp-trend-v1-label">
                  {value}
                </text>
              );
            })}
          </svg>

          {safeSeries.length > 0 && (
            <div className="lp-trend-v1-legend">
              {safeSeries.map((s, i) => (
                <div key={i} className="lp-trend-v1-legend-item lp-rise" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="lp-trend-v1-legend-dot" style={{ background: colors[i % colors.length] }} />
                  <EditableField prop={`series.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">
                    {s.name || `系列 ${i + 1}`}
                  </EditableField>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Folio
        left="TREND"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
