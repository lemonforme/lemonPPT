// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Grid, t9Rgba, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09QuadrantPoint {
  name?: string;
  x?: string | number;
  y?: string | number;
  size?: string | number;
  accent?: boolean;
}

export interface Theme09QuadrantV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  points?: Theme09QuadrantPoint[];
  axisLeft?: string;
  axisRight?: string;
  axisTop?: string;
  axisBottom?: string;
  quadrant1?: string;
  quadrant2?: string;
  quadrant3?: string;
  quadrant4?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09QuadrantV1Meta: LayoutMeta = {
  id: 'theme09_quadrant_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '定位四象限',
  description: '四象限气泡定位 + 轴端说明，专色高亮主角标的，纸底',
  needsMedia: false,
  tags: ['chart', 'quadrant', 'bubble', 'positioning'],
  contentShape: 'quadrant',
};

export const theme09QuadrantV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '定位四象限' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'POSITIONING' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '43' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '站位' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '我们已站上 {{领导者}} 象限的门槛' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '横轴为执行能力，纵轴为愿景完整度，气泡大小代表市场份额。' },
    {
      key: 'points',
      label: '定位点',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'x', label: '横轴值', type: 'number' },
        { key: 'y', label: '纵轴值', type: 'number' },
        { key: 'size', label: '份额', type: 'number' },
        { key: 'accent', label: '专色高亮', type: 'boolean' },
      ],
    },
    { key: 'axisLeft', label: '左轴端说明', type: 'text', inlineEditable: true, defaultValue: '← 执行力弱' },
    { key: 'axisRight', label: '右轴端说明', type: 'text', inlineEditable: true, defaultValue: '执行力强 →' },
    { key: 'axisTop', label: '上轴端说明', type: 'text', inlineEditable: true, defaultValue: '↑ 愿景完整' },
    { key: 'axisBottom', label: '下轴端说明', type: 'text', inlineEditable: true, defaultValue: '↓ 愿景局部' },
    { key: 'quadrant1', label: '第一象限标签', type: 'text', inlineEditable: true, defaultValue: '领导者' },
    { key: 'quadrant2', label: '第二象限标签', type: 'text', inlineEditable: true, defaultValue: '远见者' },
    { key: 'quadrant3', label: '第三象限标签', type: 'text', inlineEditable: true, defaultValue: '特定领域' },
    { key: 'quadrant4', label: '第四象限标签', type: 'text', inlineEditable: true, defaultValue: '实干者' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_POINTS: Theme09QuadrantPoint[] = [
  { name: '本司', x: 46, y: 62, size: 88, accent: true },
  { name: '甲方阵营', x: 68, y: 34, size: 96 },
  { name: '新锐挑战者', x: -28, y: 58, size: 52 },
  { name: '区域龙头', x: 34, y: -26, size: 64 },
  { name: '跨界玩家', x: -54, y: 22, size: 40 },
  { name: '垂直厂商', x: -42, y: -48, size: 36 },
  { name: '开源社区', x: 12, y: 44, size: 44 },
];

interface QuadrantLabels {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  left: string;
  right: string;
  top: string;
  bottom: string;
}

function buildOption(points: Theme09QuadrantPoint[], q: QuadrantLabels): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const list = points.length ? points : DEFAULT_POINTS;
  const bound = Math.max(
    ...list.map((p) => Math.abs(t9ParseNumber(p.x))),
    ...list.map((p) => Math.abs(t9ParseNumber(p.y))),
    10,
  );
  const b = Math.ceil((bound * 1.25) / 10) * 10;
  const maxSize = Math.max(...list.map((p) => t9ParseNumber(p.size) || 1), 1);

  const data = list.map((p, i) => {
    const hi = p.accent === true;
    const color = hi ? c.accent : c.series[(i + 1) % c.series.length];
    const sz = t9ParseNumber(p.size) || maxSize * 0.4;
    return {
      name: p.name ?? '',
      value: [t9ParseNumber(p.x), t9ParseNumber(p.y)],
      symbolSize: 18 + Math.sqrt(sz / maxSize) * 34,
      itemStyle: {
        color: t9Rgba(color, hi ? 0.9 : 0.5),
        borderColor: color,
        borderWidth: hi ? 2 : 1,
      },
      label: t9DataLabel(c, 'inside', {
        color: hi ? c.onAccent : c.ink,
        fontFamily: c.font,
        fontSize: hi ? 12 : 11,
        fontWeight: hi ? 700 : 600,
        formatter: p.name ?? '',
      }),
      z: hi ? 6 : 3,
    };
  });

  const areaLabel = (text: string, position: string): Record<string, unknown> => ({
    show: true,
    position,
    distance: 12,
    color: c.ink3,
    fontFamily: c.fontHeading,
    fontSize: 13,
    fontWeight: 600,
    formatter: text,
  });

  const edgeText = (text: string, anchor: Record<string, unknown>): Record<string, unknown> => ({
    type: 'text',
    silent: true,
    z: 10,
    ...anchor,
    style: { text, fill: c.ink3, font: `600 12px ${c.font}` },
  });

  return {
    graphic: [
      edgeText(q.left, { left: 18, bottom: 6 }),
      edgeText(q.right, { right: 18, bottom: 6 }),
      edgeText(q.top, { left: 18, top: 4 }),
      edgeText(q.bottom, { left: 18, bottom: 24 }),
    ],
    grid: t9Grid({ left: 24, right: 24, top: 28, bottom: 30, containLabel: false }),
    xAxis: { type: 'value', min: -b, max: b, show: false },
    yAxis: { type: 'value', min: -b, max: b, show: false },
    series: [
      {
        type: 'scatter',
        data,
        emphasis: t9Emphasis(c, { scale: 1.06 }),
        markArea: {
          silent: true,
          data: [
            [
              { coord: [0, 0], itemStyle: { color: t9Rgba(c.accent, 0.07) }, label: areaLabel(q.q1, 'insideTopRight') },
              { coord: [b, b] },
            ],
            [
              { coord: [-b, 0], itemStyle: { color: t9Rgba(c.series[1], 0.06) }, label: areaLabel(q.q2, 'insideTopLeft') },
              { coord: [0, b] },
            ],
            [
              { coord: [-b, -b], itemStyle: { color: t9Rgba(c.ink3, 0.05) }, label: areaLabel(q.q3, 'insideBottomLeft') },
              { coord: [0, 0] },
            ],
            [
              { coord: [0, -b], itemStyle: { color: t9Rgba(c.series[3], 0.06) }, label: areaLabel(q.q4, 'insideBottomRight') },
              { coord: [b, 0] },
            ],
          ],
        },
        markLine: {
          silent: true,
          symbol: 'none',
          label: { show: false },
          lineStyle: { color: c.rule, width: 1, type: 'dashed' },
          data: [{ xAxis: 0 }, { yAxis: 0 }],
        },
      },
    ],
  };
}

export function Theme09QuadrantV1(props: Theme09QuadrantV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    points = [],
    axisLeft = '← 执行力弱',
    axisRight = '执行力强 →',
    axisTop = '↑ 愿景完整',
    axisBottom = '↓ 愿景局部',
    quadrant1 = '领导者',
    quadrant2 = '远见者',
    quadrant3 = '特定领域',
    quadrant4 = '实干者',
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

  const option = buildOption(points, {
    q1: quadrant1,
    q2: quadrant2,
    q3: quadrant3,
    q4: quadrant4,
    left: axisLeft,
    right: axisRight,
    top: axisTop,
    bottom: axisBottom,
  });

  return (
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-quadrant">
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
            className="lp-theme09-quadrant-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="scatter" option={option} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
