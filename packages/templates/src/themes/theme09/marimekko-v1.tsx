// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9AxisLabel, t9Grid, t9Rgba, t9Legend, t9DataLabel } from './chart-utils.js';

export interface Theme09MarimekkoRow {
  name?: string;
  values?: string;
}

export interface Theme09MarimekkoV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  segments?: string[];
  rows?: Theme09MarimekkoRow[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09MarimekkoV1Meta: LayoutMeta = {
  id: 'theme09_marimekko_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '市占矩形',
  description: 'Marimekko 双维矩形：条带厚度映射盘子大小，内部专色分层占比，纸底',
  needsMedia: false,
  tags: ['chart', 'marimekko', 'share', 'stacked'],
  contentShape: 'marimekko',
};

export const theme09MarimekkoV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '市占矩形' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'MARIMEKKO' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '45' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '版图' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '华东仍是最大盘，{{应用层}} 在西部反超' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '条带厚度代表区域盘子大小，内部分段为各层级占比，合计 100%。' },
    { key: 'segments', label: '分层名称', type: 'array', inlineEditable: true, defaultValue: ['基础层', '工具层', '应用层', '服务层'] },
    {
      key: 'rows',
      label: '区域行',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '区域名', type: 'text' },
        { key: 'values', label: '各层数值（用 | 分隔）', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_SEGMENTS = ['基础层', '工具层', '应用层', '服务层'];

const DEFAULT_ROWS: Theme09MarimekkoRow[] = [
  { name: '华东', values: '38|24|26|12' },
  { name: '华北', values: '32|28|24|16' },
  { name: '华南', values: '26|22|34|18' },
  { name: '西部', values: '18|16|38|22' },
  { name: '海外', values: '30|30|26|14' },
];

function buildOption(segments: string[], rows: Theme09MarimekkoRow[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const segs = segments.length ? segments : DEFAULT_SEGMENTS;
  const list = rows.length ? rows : DEFAULT_ROWS;

  const matrix = list.map((r) =>
    String(r.values ?? '')
      .split('|')
      .map((v) => t9ParseNumber(v)),
  );
  const totals = matrix.map((vals) => vals.reduce((a, b) => a + b, 0) || 1);
  const grand = totals.reduce((a, b) => a + b, 0) || 1;
  const maxTotal = Math.max(...totals, 1);

  const axisNames = list.map((r, i) => `${r.name ?? ''} · ${Math.round((totals[i] / grand) * 100)}%`);

  const series: Record<string, unknown>[] = [];
  list.forEach((_row, ri) => {
    const thickness = `${(28 + (totals[ri] / maxTotal) * 60).toFixed(1)}%`;
    segs.forEach((segName, si) => {
      const raw = matrix[ri]?.[si] ?? 0;
      const pct = Math.round((raw / totals[ri]) * 1000) / 10;
      const color = si === 0 ? c.accent : c.series[(si + 1) % c.series.length];
      series.push({
        name: segName,
        type: 'bar',
        stack: `mk-${ri}`,
        barGap: '-100%',
        barCategoryGap: '18%',
        barWidth: thickness,
        itemStyle: { color: t9Rgba(color, 0.85), borderColor: c.surfaceSolid, borderWidth: 1 },
        data: list.map((__, di) =>
          di === ri
            ? {
                value: pct,
                label: t9DataLabel(c, 'inside', {
                  show: pct >= 9,
                  color: c.onAccent,
                  fontWeight: 700,
                  formatter: `${pct}%`,
                }),
              }
            : { value: 0, label: { show: false } },
        ),
      });
    });
  });

  return {
    legend: t9Legend(c, { top: 0, left: 0, right: 'auto', itemWidth: 12, itemHeight: 8, itemGap: 16, data: segs }),
    grid: t9Grid({ left: 12, right: 20, top: 40, bottom: 10 }),
    xAxis: { type: 'value', min: 0, max: 100, show: false },
    yAxis: {
      type: 'category',
      data: axisNames,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 13), fontWeight: 600 },
    },
    series,
  };
}

export function Theme09MarimekkoV1(props: Theme09MarimekkoV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    segments = [],
    rows = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-marimekko">
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
            className="lp-theme09-marimekko-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="custom" option={buildOption(segments, rows)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
