// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba, t9Tooltip, t9Emphasis } from './chart-utils.js';

export interface Theme09HoneycombCell {
  row?: number;
  col?: number;
  value?: string | number;
}

export interface Theme09HoneycombV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  cells?: Theme09HoneycombCell[];
  legendLow?: string;
  legendHigh?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09HoneycombV1Meta: LayoutMeta = {
  id: 'theme09_honeycomb_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '蜂巢分布',
  description: '六边形蜂巢矩阵，朱砂浓度分级表示密度，墨底',
  needsMedia: false,
  tags: ['chart', 'honeycomb', 'density', 'matrix'],
  contentShape: 'honeycomb-density',
};

export const theme09HoneycombV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '密度分布' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'HONEYCOMB' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '33' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '蜂巢' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '热度呈{{团块状}}聚集' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '每个六边形代表一个采样单元，颜色越浓表示活跃度越高。',
    },
    {
      key: 'cells',
      label: '蜂巢单元',
      type: 'array',
      itemSchema: [
        { key: 'row', label: '行', type: 'number' },
        { key: 'col', label: '列', type: 'number' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    { key: 'legendLow', label: '图例（低）', type: 'text', inlineEditable: true, defaultValue: '低活跃' },
    { key: 'legendHigh', label: '图例（高）', type: 'text', inlineEditable: true, defaultValue: '高活跃' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const HEX_PATH = 'path://M50 0 L100 25 L100 75 L50 100 L0 75 L0 25 Z';
const DEFAULT_ROWS = 5;
const DEFAULT_COLS = 12;

function makeDefaultCells(): Theme09HoneycombCell[] {
  const out: Theme09HoneycombCell[] = [];
  for (let r = 0; r < DEFAULT_ROWS; r++) {
    for (let col = 0; col < DEFAULT_COLS; col++) {
      const wave = Math.sin((r + 1) * 0.9 + (col + 1) * 0.55) + Math.cos((col + 1) * 0.3 - r * 0.7);
      out.push({ row: r, col, value: Math.round(24 + 38 * (wave + 2)) });
    }
  }
  return out;
}

const DEFAULT_CELLS: Theme09HoneycombCell[] = makeDefaultCells();

function buildOption(cells: Theme09HoneycombCell[]): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const cs = cells.length ? cells : DEFAULT_CELLS;
  const vals = cs.map((x) => t9ParseNumber(x.value));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;

  let maxRow = 0;
  let maxCol = 0;
  cs.forEach((x) => {
    maxRow = Math.max(maxRow, x.row ?? 0);
    maxCol = Math.max(maxCol, x.col ?? 0);
  });

  const rowGap = 0.93;
  const data = cs.map((x, i) => {
    const r = x.row ?? 0;
    const col = x.col ?? 0;
    const v = vals[i];
    const norm = (v - min) / span;
    return {
      name: `${r + 1}-${col + 1}`,
      value: [Number((col + (r % 2 === 1 ? 0.5 : 0)).toFixed(2)), Number((-r * rowGap).toFixed(2)), v],
      itemStyle: {
        color: t9Rgba(c.accent, 0.1 + norm * 0.82),
        borderColor: t9Rgba(c.ink, norm > 0.72 ? 0.28 : 0.1),
        borderWidth: 1,
      },
    };
  });

  return {
    tooltip: t9Tooltip(c),
    grid: { left: '2%', right: '4%', top: '2%', bottom: '10%', containLabel: false },
    xAxis: { type: 'value', min: -1.6, max: maxCol + 4.2, show: false },
    yAxis: { type: 'value', min: -(maxRow * rowGap) - 1.2, max: 1.2, show: false },
    series: [
      {
        type: 'scatter',
        symbol: HEX_PATH,
        symbolSize: [68, 78],
        clip: false,
        data,
        emphasis: t9Emphasis(c, { itemStyle: { borderColor: c.accent, borderWidth: 2 } }),
      },
    ],
  };
}

export function Theme09HoneycombV1(props: Theme09HoneycombV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    cells = [],
    legendLow,
    legendHigh,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const low = legendLow && legendLow.trim() ? legendLow : '低活跃';
  const high = legendHigh && legendHigh.trim() ? legendHigh : '高活跃';
  const steps = [0.14, 0.32, 0.5, 0.68, 0.9];

  const renderTitle = (t: string): ReactNode => {
    const parts = t.split(/(\{\{[^}]+\}\})/g);
    return (
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme09-chart-title lp-t9-serif">
        {parts.map((part, idx) => {
          const m = part.match(/^\{\{(.+)\}\}$/);
          if (m) return <em key={idx} className="lp-theme09-accent-text">{m[1]}</em>;
          return <span key={idx}>{part}</span>;
        })}
      </EditableField>
    );
  };

  return (
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-honeycomb">
      <T9ChartShell
        slideIdx={_slideIdx}
        editable={_editable}
        footnoteLeft={footnoteLeft}
        footnoteRight={footnoteRight}
        head={
          <T9ChartHeader
            section={section}
            sectionEn={sectionEn}
            mark={mark}
            kicker={kicker}
            slideIdx={_slideIdx}
            editable={_editable}
          />
        }
        body={
          <div
            className="lp-theme09-honeycomb-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="custom" option={buildOption(cells)} className="lp-theme09-chart-area" />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flex: '0 0 auto',
                fontFamily: c.font,
                fontSize: '12px',
                color: c.ink3,
              }}
            >
              <EditableField prop="legendLow" slideIdx={_slideIdx} editable={_editable} as="span">
                {low}
              </EditableField>
              <span style={{ display: 'flex', gap: '4px' }}>
                {steps.map((s, i) => (
                  <span key={i} style={{ width: '30px', height: '10px', background: t9Rgba(c.accent, s) }} />
                ))}
              </span>
              <EditableField prop="legendHigh" slideIdx={_slideIdx} editable={_editable} as="span">
                {high}
              </EditableField>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
