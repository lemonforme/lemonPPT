// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChartLineV1Series {
  name?: string;
  values?: number[];
}

export interface Theme02ChartLineV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  labels?: string[];
  series?: Theme02ChartLineV1Series[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartLineV1Meta: LayoutMeta = {
  id: 'theme02_chart_line_v1',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 折线图',
  description: '多系列折线图',
  needsMedia: false,
};

export const theme02ChartLineV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
    {
      key: 'labels',
      label: '标签',
      type: 'array',
      maxItems: 12,
      minItems: 1,
      itemSchema: [{ key: 'item', label: '标签', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '系列',
      type: 'array',
      maxItems: 4,
      minItems: 1,
      itemSchema: [
        { key: 'name', label: '系列名称', type: 'text', inlineEditable: true },
        {
          key: 'values',
          label: '数值',
          type: 'array',
          maxItems: 12,
          minItems: 1,
          itemSchema: [{ key: 'item', label: '数值', type: 'number' }],
        },
      ],
    },
  ],
};

const CHART_WIDTH = 920;
const CHART_HEIGHT = 380;
const PAD = { top: 28, right: 28, bottom: 52, left: 56 };
const INNER_W = CHART_WIDTH - PAD.left - PAD.right;
const INNER_H = CHART_HEIGHT - PAD.top - PAD.bottom;
const SERIES_COLORS = ['var(--lp-accent)', 'var(--lp-accent-2)', 'var(--lp-accent-cool)', 'var(--lp-violet)'];

function renderLines(
  labels: string[],
  series: Theme02ChartLineV1Series[],
): ReactElement {
  const count = labels.length;
  const allValues = series.flatMap((s) => (s.values ?? []).filter((v): v is number => typeof v === 'number'));
  const maxVal = Math.max(1, ...allValues);
  const minVal = Math.min(0, ...allValues);
  const range = maxVal - minVal || 1;
  const stepX = count > 1 ? INNER_W / (count - 1) : INNER_W / 2;

  const toPoint = (value: number, i: number) => {
    const x = count > 1 ? i * stepX : INNER_W / 2;
    const y = INNER_H - ((value - minVal) / range) * INNER_H;
    return { x, y };
  };

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-theme02-chart-line-svg">
      <g transform={`translate(${PAD.left}, ${PAD.top})`}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={0}
            y1={INNER_H * t}
            x2={INNER_W}
            y2={INNER_H * t}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={1}
          />
        ))}
        {series.map((s, si) => {
          const color = SERIES_COLORS[si % SERIES_COLORS.length];
          const pts = (s.values ?? []).map((v, i) => toPoint(typeof v === 'number' ? v : 0, i));
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
          return (
            <g key={si}>
              <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="lp-theme02-chart-line-path" />
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={5} fill="var(--lp-bg)" stroke={color} strokeWidth={2.5} />
                  <text x={p.x} y={p.y - 12} textAnchor="middle" fill="var(--lp-ink)" fontSize={11} fontWeight={700}>
                    {s.values?.[i]}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
        {labels.map((label, i) => (
          <text key={i} x={count > 1 ? i * stepX : INNER_W / 2} y={INNER_H + 22} textAnchor="middle" fill="var(--lp-ink2)" fontSize={12}>
            {label}
          </text>
        ))}
      </g>
    </svg>
  );
}

export function Theme02ChartLineV1(props: Theme02ChartLineV1Props): ReactNode {
  const { kicker, title, subtitle, unit, labels = [], series = [], _slideIdx, _editable } = props;

  const safeLabels = labels.filter((l): l is string => typeof l === 'string');
  const safeSeries = series.filter((s) => s && typeof s === 'object');
  const hasData = safeSeries.some((s) => (s.values ?? []).length > 0);

  return (
    <div className="lp-slide lp-theme02-chart-line-v1">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-chart-line-inner">
        <div className="lp-theme02-chart-line-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-chart-line-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-chart-line-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        {unit && <div className="lp-theme02-chart-line-unit">{unit}</div>}
        {hasData ? (
          renderLines(safeLabels, safeSeries)
        ) : (
          <div className="lp-theme02-chart-line-empty">请配置图表数据</div>
        )}
        {safeSeries.length > 0 && (
          <div className="lp-theme02-chart-line-legend">
            {safeSeries.map((s, i) => (
              <div key={i} className="lp-theme02-chart-line-legend-item">
                <span
                  className="lp-theme02-chart-line-legend-dot"
                  style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }}
                />
                <EditableField prop={`series.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-chart-line-legend-name">
                  {s.name}
                </EditableField>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
