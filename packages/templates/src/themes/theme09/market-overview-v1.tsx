// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Rgba, t9ParseNumber, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09MarketPoint {
  name?: string;
  x?: string | number;
  y?: string | number;
  q?: number;
}

export interface Theme09MarketOverviewV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  quadrants?: string[];
  points?: Theme09MarketPoint[];
  trend?: string[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09MarketOverviewV1Meta: LayoutMeta = {
  id: 'theme09_market_overview_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '市场全景',
  description: '四象限指标概览 + 底部趋势条，墨底专色象限',
  needsMedia: false,
  tags: ['chart', 'quadrant', 'overview'],
  contentShape: 'quadrant-overview',
};

export const theme09MarketOverviewV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '市场全景' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'OVERVIEW' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '02' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '格局' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本向{{头部}}与{{算力}}两端聚集' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '横轴为估值强度，纵轴为融资增速；右上为最拥挤象限。' },
    {
      key: 'quadrants',
      label: '四象限名称（上左/上右/下左/下右）',
      type: 'array',
      inlineEditable: true,
      defaultValue: ['高增速 · 低估值', '高增速 · 高估值', '低增速 · 低估值', '低增速 · 高估值'],
    },
    {
      key: 'points',
      label: '散点（x/y 为 0-100，q 为象限 1-4）',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'x', label: 'X', type: 'text' },
        { key: 'y', label: 'Y', type: 'text' },
        { key: 'q', label: '象限(1-4)', type: 'text' },
      ],
    },
    {
      key: 'trend',
      label: '底部趋势条（百分比）',
      type: 'array',
      inlineEditable: true,
      defaultValue: ['18%', '26%', '31%', '25%'],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_POINTS: Theme09MarketPoint[] = [
  { name: 'OpenAI', x: 92, y: 88, q: 2 },
  { name: 'xAI', x: 78, y: 80, q: 2 },
  { name: 'Anthropic', x: 84, y: 72, q: 2 },
  { name: 'Databricks', x: 60, y: 64, q: 2 },
  { name: 'CoreWeave', x: 70, y: 55, q: 1 },
  { name: 'Cohere', x: 48, y: 58, q: 1 },
  { name: 'Mistral', x: 52, y: 46, q: 1 },
  { name: 'Inflection', x: 40, y: 38, q: 3 },
  { name: 'Stability', x: 30, y: 30, q: 3 },
  { name: 'HuggingFace', x: 58, y: 40, q: 4 },
  { name: 'Scale', x: 44, y: 42, q: 3 },
  { name: 'Perplexity', x: 66, y: 50, q: 4 },
];

function buildOption(points: Theme09MarketPoint[]): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const qColors = [c.series[0], c.series[1], c.series[2], c.series[3]];
  const quads = [
    { name: 'q1', x: [0, 50], y: [0, 50] },
    { name: 'q2', x: [50, 100], y: [0, 50] },
    { name: 'q3', x: [0, 50], y: [50, 100] },
    { name: 'q4', x: [50, 100], y: [50, 100] },
  ];
  const markAreaData = quads.map((q, i) => [
    { xAxis: q.x[0], yAxis: q.y[0], itemStyle: { color: t9Rgba(qColors[i], 0.1) } },
    { xAxis: q.x[1], yAxis: q.y[1] },
  ]);

  const data = points.map((p) => ({
    name: p.name,
    value: [t9ParseNumber(p.x), t9ParseNumber(p.y)],
    itemStyle: { color: qColors[(t9ParseNumber(p.q) - 1 + 4) % 4] },
  }));

  return {
    grid: { top: 24, right: 30, bottom: 40, left: 44, containLabel: false },
    xAxis: {
      min: 0,
      max: 100,
      splitLine: { show: false },
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    yAxis: {
      min: 0,
      max: 100,
      splitLine: { show: false },
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { show: false },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: 16,
        data,
        label: t9DataLabel(c, 'right', { fontFamily: c.font, fontSize: 12, formatter: '{b}' }),
        emphasis: t9Emphasis(c),
        markArea: {
          silent: true,
          data: markAreaData,
        },
      },
    ],
  };
}

export function Theme09MarketOverviewV1(props: Theme09MarketOverviewV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    quadrants = [],
    points = DEFAULT_POINTS,
    trend = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const pts = points.length ? points : DEFAULT_POINTS;
  const qNames = quadrants.length >= 4 ? quadrants : ['低增速·低估值', '高增速·低估值', '低增速·高估值', '高增速·高估值'];
  const trendVals = trend.length
    ? trend.map((t) => t9ParseNumber(t))
    : [18, 26, 31, 25];

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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-marketoverview">
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
          <div className="lp-theme09-marketoverview-body">
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-marketoverview-sub">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-marketoverview-chart">
              <LpEChart type="scatter" option={buildOption(pts)} className="lp-theme09-marketoverview-echart" />
              <div className="lp-theme09-marketoverview-quads">
                <span style={{ color: c.ink3 }}>{qNames[0]}</span>
                <span style={{ color: c.ink3 }}>{qNames[1]}</span>
                <span style={{ color: c.ink3 }}>{qNames[2]}</span>
                <span style={{ color: c.ink3 }}>{qNames[3]}</span>
              </div>
            </div>
            <div className="lp-theme09-marketoverview-trend">
              {trendVals.map((v, i) => (
                <div key={i} className="lp-theme09-marketoverview-seg" style={{ flex: v }}>
                  <span style={{ background: c.series[i % c.series.length] }} />
                  <b>{trend[i] ?? `${v}%`}</b>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
