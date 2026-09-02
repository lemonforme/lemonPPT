// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChartStackV1Series {
  name?: string;
  values?: number[];
}

export interface Theme02ChartStackV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  unit?: string;
  labels?: string[];
  series?: Theme02ChartStackV1Series[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChartStackV1Meta: LayoutMeta = {
  id: 'theme02_chart_stack_v1',
  theme: 'theme02',
  role: 'chart',
  displayName: 'Theme 02 百分比堆叠条',
  description: '100% 堆叠水平条形图',
  needsMedia: false,
};

export const theme02ChartStackV1Schema: PropsSchema = {
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

const SERIES_COLORS = ['var(--lp-accent)', 'var(--lp-accent-2)', 'var(--lp-accent-cool)', 'var(--lp-violet)'];

export function Theme02ChartStackV1(props: Theme02ChartStackV1Props): ReactNode {
  const { kicker, title, subtitle, unit, labels = [], series = [], _slideIdx, _editable } = props;

  const safeLabels = labels
    .map((l) => (typeof l === 'string' ? l : (l as { item?: string }).item ?? ''))
    .filter((l): l is string => typeof l === 'string' && l.length > 0);
  const safeSeries = series
    .filter((s) => s && typeof s === 'object')
    .map((s) => ({
      ...s,
      values: (s.values ?? [])
        .map((v) => (typeof v === 'number' ? v : Number((v as { item?: number }).item ?? 0)))
        .filter((v) => !Number.isNaN(v)),
    }));
  const hasData = safeLabels.length > 0 && safeSeries.length > 0;

  return (
    <div className="lp-slide lp-theme02-chart-stack-v1">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-chart-stack-inner">
        <div className="lp-theme02-chart-stack-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-chart-stack-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-chart-stack-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        {unit && <div className="lp-theme02-chart-stack-unit">{unit}</div>}
        {hasData ? (
          <div className="lp-theme02-chart-stack-rows">
            {safeLabels.map((label, li) => {
              const total = safeSeries.reduce((sum, s) => sum + Math.max(0, s.values?.[li] ?? 0), 0) || 1;
              return (
                <div key={li} className="lp-theme02-chart-stack-row">
                  <EditableField prop={`labels.${li}`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chart-stack-label">
                    {label}
                  </EditableField>
                  <div className="lp-theme02-chart-stack-track">
                    {safeSeries.map((s, si) => {
                      const value = Math.max(0, s.values?.[li] ?? 0);
                      const pct = (value / total) * 100;
                      if (pct <= 0) return null;
                      const color = SERIES_COLORS[si % SERIES_COLORS.length];
                      return (
                        <div
                          key={si}
                          className="lp-theme02-chart-stack-seg"
                          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 16px ${color}` }}
                          title={`${s.name}: ${Math.round(pct)}%`}
                        >
                          {pct >= 9 && <span className="lp-theme02-chart-stack-seg-pct">{Math.round(pct)}%</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="lp-theme02-chart-stack-empty">请配置图表数据</div>
        )}
        {safeSeries.length > 0 && (
          <div className="lp-theme02-chart-stack-legend">
            {safeSeries.map((s, i) => (
              <div key={i} className="lp-theme02-chart-stack-legend-item">
                <span
                  className="lp-theme02-chart-stack-legend-dot"
                  style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }}
                />
                <EditableField prop={`series.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-chart-stack-legend-name">
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
