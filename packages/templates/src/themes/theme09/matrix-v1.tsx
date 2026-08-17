// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9AxisLabel, t9Grid, t9SplitLine, t9Rgba, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09MatrixPoint {
  name?: string;
  x?: string | number;
  y?: string | number;
  size?: string | number;
  cat?: string;
}

export interface Theme09MatrixV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  points?: Theme09MatrixPoint[];
  xName?: string;
  yName?: string;
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

export const theme09MatrixV1Meta: LayoutMeta = {
  id: 'theme09_matrix_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '估值矩阵',
  description: '二维矩阵散点 + 四象限底色标签，零轴十字分割，纸底专色',
  needsMedia: false,
  tags: ['chart', 'matrix', 'scatter', 'quadrant'],
  contentShape: 'matrix',
};

export const theme09MatrixV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '估值矩阵' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'VALUATION MATRIX' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '42' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '坐标' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '增长与估值的 {{错位}} 正在收敛' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '横轴为估值偏离度，纵轴为营收增速，圆点大小代表在管资产规模。' },
    {
      key: 'points',
      label: '标的点',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'x', label: '横轴值', type: 'number' },
        { key: 'y', label: '纵轴值', type: 'number' },
        { key: 'size', label: '体量', type: 'number' },
        { key: 'cat', label: '分组', type: 'text' },
      ],
    },
    { key: 'xName', label: '横轴名', type: 'text', inlineEditable: true, defaultValue: '估值偏离度' },
    { key: 'yName', label: '纵轴名', type: 'text', inlineEditable: true, defaultValue: '营收增速' },
    { key: 'quadrant1', label: '第一象限标签', type: 'text', inlineEditable: true, defaultValue: '高增长 · 高估值' },
    { key: 'quadrant2', label: '第二象限标签', type: 'text', inlineEditable: true, defaultValue: '高增长 · 低估值' },
    { key: 'quadrant3', label: '第三象限标签', type: 'text', inlineEditable: true, defaultValue: '低增长 · 低估值' },
    { key: 'quadrant4', label: '第四象限标签', type: 'text', inlineEditable: true, defaultValue: '低增长 · 高估值' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_POINTS: Theme09MatrixPoint[] = [
  { name: '大模型', x: 62, y: 74, size: 96, cat: '基础层' },
  { name: '智能算力', x: 44, y: 58, size: 82, cat: '基础层' },
  { name: '具身智能', x: 78, y: 36, size: 54, cat: '前沿层' },
  { name: 'AI 应用', x: -34, y: 52, size: 68, cat: '应用层' },
  { name: '数据服务', x: -58, y: 26, size: 46, cat: '应用层' },
  { name: '安全合规', x: -46, y: -38, size: 38, cat: '治理层' },
  { name: '传统软件', x: 28, y: -56, size: 60, cat: '存量层' },
  { name: '硬件代工', x: -72, y: -64, size: 44, cat: '存量层' },
];

interface QuadrantText {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

function buildOption(points: Theme09MatrixPoint[], xName: string, yName: string, q: QuadrantText): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const list = points.length ? points : DEFAULT_POINTS;
  const bound = Math.max(
    ...list.map((p) => Math.abs(t9ParseNumber(p.x))),
    ...list.map((p) => Math.abs(t9ParseNumber(p.y))),
    10,
  );
  const b = Math.ceil((bound * 1.2) / 10) * 10;
  const maxSize = Math.max(...list.map((p) => t9ParseNumber(p.size) || 1), 1);

  const cats: string[] = [];
  list.forEach((p) => {
    const k = p.cat ?? '其他';
    if (!cats.includes(k)) cats.push(k);
  });

  const data = list.map((p) => {
    const cIdx = cats.indexOf(p.cat ?? '其他');
    const sz = t9ParseNumber(p.size) || maxSize * 0.4;
    const color = cIdx === 0 ? c.accent : c.series[(cIdx + 1) % c.series.length];
    return {
      name: p.name ?? '',
      value: [t9ParseNumber(p.x), t9ParseNumber(p.y)],
      symbolSize: 14 + Math.sqrt(sz / maxSize) * 22,
      itemStyle: { color: t9Rgba(color, 0.82), borderColor: color, borderWidth: 1 },
      label: t9DataLabel(c, 'top', {
        distance: 6,
        fontFamily: c.font,
        fontWeight: 600,
        formatter: p.name ?? '',
      }),
    };
  });

  const areaLabel = (text: string, position: string): Record<string, unknown> => ({
    show: true,
    position,
    distance: 10,
    color: c.ink3,
    fontFamily: c.font,
    fontSize: 12,
    letterSpacing: 1,
    formatter: text,
  });

  return {
    grid: t9Grid({ left: 18, right: 24, top: 34, bottom: 24 }),
    xAxis: {
      type: 'value',
      name: xName,
      nameLocation: 'end',
      nameGap: 10,
      nameTextStyle: { color: c.ink3, fontFamily: c.font, fontSize: 12, align: 'right' },
      min: -b,
      max: b,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: t9AxisLabel(c, 11),
      splitLine: t9SplitLine(c),
    },
    yAxis: {
      type: 'value',
      name: yName,
      nameLocation: 'end',
      nameGap: 12,
      nameTextStyle: { color: c.ink3, fontFamily: c.font, fontSize: 12, align: 'left' },
      min: -b,
      max: b,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: t9AxisLabel(c, 11),
      splitLine: t9SplitLine(c),
    },
    series: [
      {
        type: 'scatter',
        data,
        emphasis: t9Emphasis(c, { scale: 1.08 }),
        markArea: {
          silent: true,
          data: [
            [
              { coord: [0, 0], itemStyle: { color: t9Rgba(c.accent, 0.06) }, label: areaLabel(q.q1, 'insideTopRight') },
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

export function Theme09MatrixV1(props: Theme09MatrixV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    points = [],
    xName = '估值偏离度',
    yName = '营收增速',
    quadrant1 = '高增长 · 高估值',
    quadrant2 = '高增长 · 低估值',
    quadrant3 = '低增长 · 低估值',
    quadrant4 = '低增长 · 高估值',
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

  const option = buildOption(points, xName, yName, { q1: quadrant1, q2: quadrant2, q3: quadrant3, q4: quadrant4 });

  return (
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-matrix">
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
            className="lp-theme09-matrix-body"
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
