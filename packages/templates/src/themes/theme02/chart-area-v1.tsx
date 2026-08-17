// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChartAreaV1Series {
  name?: string;
  values?: number[];
}

export interface Theme02ChartAreaV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  labels?: string[];
  series?: Theme02ChartAreaV1Series[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartAreaV1Meta: LayoutMeta = {
  id: 'theme02_chart_area_v1',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 堆叠面积图',
  description: '多系列堆叠面积图',
  needsMedia: false,
};

export const theme02ChartAreaV1Schema: PropsSchema = {
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
      maxItems: 3,
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
const SERIES_COLORS = ['var(--lp-accent)', 'var(--lp-accent-cool)', 'var(--lp-accent-2)'];

function renderAreas(
  labels: string[],
  series: Theme02ChartAreaV1Series[],
  prefix: string,
): ReactElement {
  const count = labels.length;
  const stepX = count > 1 ? INNER_W / (count - 1) : INNER_W / 2;
  const safeValues = series.map((s) => labels.map((_, i) => Math.max(0, s.values?.[i] ?? 0)));
  const maxVal = Math.max(1, ...labels.map((_, i) => safeValues.reduce((sum, vals) => sum + vals[i], 0)));

  const yFor = (val: number) => INNER_H - (val / maxVal) * INNER_H;
  const xFor = (i: number) => (count > 1 ? i * stepX : INNER_W / 2);

  let baseline = labels.map(() => 0);
  const layers: { color: string; d: string }[] = [];

  series.forEach((_s, si) => {
    const vals = safeValues[si];
    const top: { x: number; y: number }[] = [];
    const bottom: { x: number; y: number }[] = [];
    vals.forEach((v, i) => {
      const x = xFor(i);
      top.push({ x, y: yFor(baseline[i] + v) });
      bottom.push({ x, y: yFor(baseline[i]) });
    });
    const topD = top.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const bottomD = bottom
      .slice()
      .reverse()
      .map((p) => `L ${p.x} ${p.y}`)
      .join(' ');
    layers.push({ color: SERIES_COLORS[si % SERIES_COLORS.length], d: `${topD} ${bottomD} Z` });
    baseline = baseline.map((b, i) => b + vals[i]);
  });

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-theme02-chart-area-svg">
      <defs>
        {SERIES_COLORS.map((c, i) => (
          <linearGradient key={i} id={`${prefix}-area-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.7" />
            <stop offset="100%" stopColor={c} stopOpacity="0.12" />
          </linearGradient>
        ))}
      </defs>
      <g transform={`translate(${PAD.left}, ${PAD.top})`}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={0} y1={INNER_H * t} x2={INNER_W} y2={INNER_H * t} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        ))}
        {layers.map((layer, i) => (
          <path key={i} d={layer.d} fill={`url(#${prefix}-area-${i})`} stroke={layer.color} strokeWidth={1.5} className="lp-theme02-chart-area-path" />
        ))}
        {labels.map((label, i) => (
          <text key={i} x={xFor(i)} y={INNER_H + 22} textAnchor="middle" fill="var(--lp-ink2)" fontSize={12}>
            {label}
          </text>
        ))}
      </g>
    </svg>
  );
}

export function Theme02ChartAreaV1(props: Theme02ChartAreaV1Props): ReactNode {
  const { kicker, title, subtitle, unit, labels = [], series = [], _slideIdx, _editable } = props;

  const safeLabels = labels.filter((l): l is string => typeof l === 'string');
  const safeSeries = series.filter((s) => s && typeof s === 'object');
  const hasData = safeSeries.some((s) => (s.values ?? []).length > 0);
  const prefix = `theme02-area-${_slideIdx ?? 0}`;

  return (
    <div className="lp-slide lp-theme02-chart-area-v1">
      <div className="lp-orb lp-theme02-orb--cool" />
      <div className="lp-theme02-chart-area-inner">
        <div className="lp-theme02-chart-area-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-chart-area-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-chart-area-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        {unit && <div className="lp-theme02-chart-area-unit">{unit}</div>}
        {hasData ? (
          renderAreas(safeLabels, safeSeries, prefix)
        ) : (
          <div className="lp-theme02-chart-area-empty">请配置图表数据</div>
        )}
        {safeSeries.length > 0 && (
          <div className="lp-theme02-chart-area-legend">
            {safeSeries.map((s, i) => (
              <div key={i} className="lp-theme02-chart-area-legend-item">
                <span
                  className="lp-theme02-chart-area-legend-dot"
                  style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }}
                />
                <EditableField prop={`series.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-chart-area-legend-name">
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
