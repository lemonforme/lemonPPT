// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChartBarV1Series {
  name?: string;
  values?: number[];
}

export interface Theme02ChartBarV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  labels?: string[];
  series?: Theme02ChartBarV1Series[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartBarV1Meta: LayoutMeta = {
  id: 'theme02_chart_bar_v1',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 分组柱状图',
  description: '多系列分组垂直柱状图',
  needsMedia: false,
};

export const theme02ChartBarV1Schema: PropsSchema = {
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
const PAD = { top: 28, right: 24, bottom: 52, left: 56 };
const INNER_W = CHART_WIDTH - PAD.left - PAD.right;
const INNER_H = CHART_HEIGHT - PAD.top - PAD.bottom;
const SERIES_COLORS = ['var(--lp-accent)', 'var(--lp-accent-2)', 'var(--lp-accent-cool)'];

function renderBars(
  labels: string[],
  series: Theme02ChartBarV1Series[],
  prefix: string,
): ReactElement {
  const count = labels.length;
  const sCount = series.length;
  const allValues = series.flatMap((s) => (s.values ?? []).filter((v): v is number => typeof v === 'number'));
  const maxVal = Math.max(1, ...allValues);
  const groupGap = 18;
  const groupW = INNER_W / Math.max(count, 1);
  const barW = sCount > 0 ? Math.min(46, (groupW - groupGap) / sCount) : groupW;

  return (
    <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="lp-theme02-chart-bar-svg">
      <defs>
        {SERIES_COLORS.map((c, i) => (
          <linearGradient key={i} id={`${prefix}-bar-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.92" />
            <stop offset="100%" stopColor={c} stopOpacity="0.18" />
          </linearGradient>
        ))}
      </defs>
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
        {labels.map((label, li) => {
          const groupX = li * groupW + groupW / 2;
          const totalBarsW = sCount * barW;
          const startX = groupX - totalBarsW / 2 - (groupGap * (sCount - 1)) / 2;
          return (
            <g key={li}>
              {series.map((s, si) => {
                const value = s.values?.[li] ?? 0;
                const h = (value / maxVal) * INNER_H;
                const x = startX + si * (barW + groupGap);
                const y = INNER_H - h;
                const color = SERIES_COLORS[si % SERIES_COLORS.length];
                return (
                  <g key={si}>
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={h}
                      rx={5}
                      fill={`url(#${prefix}-bar-${si % SERIES_COLORS.length})`}
                      stroke={color}
                      strokeWidth={1.5}
                      className="lp-theme02-chart-bar-rect"
                    />
                    <text x={x + barW / 2} y={y - 8} textAnchor="middle" fill="var(--lp-ink)" fontSize={11} fontWeight={700}>
                      {value}
                    </text>
                  </g>
                );
              })}
              <text x={groupX} y={INNER_H + 22} textAnchor="middle" fill="var(--lp-ink2)" fontSize={12}>
                {label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Theme02ChartBarV1(props: Theme02ChartBarV1Props): ReactNode {
  const { kicker, title, subtitle, unit, labels = [], series = [], _slideIdx, _editable } = props;

  const safeLabels = labels.filter((l): l is string => typeof l === 'string');
  const safeSeries = series.filter((s) => s && typeof s === 'object');
  const hasData = safeSeries.some((s) => (s.values ?? []).length > 0);
  const prefix = `theme02-bar-${_slideIdx ?? 0}`;

  return (
    <div className="lp-slide lp-theme02-chart-bar-v1">
      <div className="lp-orb lp-theme02-orb--cool" />
      <div className="lp-theme02-chart-bar-inner">
        <div className="lp-theme02-chart-bar-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-chart-bar-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-chart-bar-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        {unit && <div className="lp-theme02-chart-bar-unit">{unit}</div>}
        {hasData ? (
          renderBars(safeLabels, safeSeries, prefix)
        ) : (
          <div className="lp-theme02-chart-bar-empty">请配置图表数据</div>
        )}
        {safeSeries.length > 0 && (
          <div className="lp-theme02-chart-bar-legend">
            {safeSeries.map((s, i) => (
              <div key={i} className="lp-theme02-chart-bar-legend-item">
                <span
                  className="lp-theme02-chart-bar-legend-dot"
                  style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }}
                />
                <EditableField prop={`series.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-chart-bar-legend-name">
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
