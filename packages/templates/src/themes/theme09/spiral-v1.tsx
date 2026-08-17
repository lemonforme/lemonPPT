// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9FormatNumber, t9Rgba, t9DataLabel } from './chart-utils.js';

export interface Theme09SpiralEvent {
  label?: string;
  value?: string | number;
  year?: string;
}

export interface Theme09SpiralV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  events?: Theme09SpiralEvent[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09SpiralV1Meta: LayoutMeta = {
  id: 'theme09_spiral_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '螺旋纪程',
  description: '螺旋时间线，节点沿弧线由内向外摆放，最新节点用朱砂点亮，墨底',
  needsMedia: false,
  tags: ['chart', 'timeline', 'spiral', 'journey'],
  contentShape: 'spiral-timeline',
};

export const theme09SpiralV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '演进纪程' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'SPIRAL' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '23' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '纪程' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '八年一{{螺旋}}，越转越开阔' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '由内向外顺时针推进，半径代表规模量级，最外圈为当下。',
    },
    {
      key: 'events',
      label: '节点',
      type: 'array',
      itemSchema: [
        { key: 'year', label: '年份', type: 'text' },
        { key: 'label', label: '事件', type: 'text' },
        { key: 'value', label: '量级', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_EVENTS: Theme09SpiralEvent[] = [
  { year: '2016', label: '技术奠基', value: 12 },
  { year: '2018', label: '首个平台上线', value: 34 },
  { year: '2020', label: '规模化商用', value: 76 },
  { year: '2021', label: '生态开放', value: 128 },
  { year: '2022', label: '跨行业渗透', value: 205 },
  { year: '2023', label: '大模型接入', value: 348 },
  { year: '2024', label: '全栈自研闭环', value: 512 },
];

function buildOption(events: Theme09SpiralEvent[]): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const es = events.length ? events : DEFAULT_EVENTS;
  const n = es.length;
  const step = (Math.PI * 2) / 5;
  const r0 = 24;
  const dr = 10;
  const start = -Math.PI / 2;

  const path: number[][] = [];
  const SEG = 20;
  const total = Math.max(1, (n - 1) * SEG);
  for (let k = 0; k <= total; k++) {
    const t = k / SEG;
    const theta = start + t * step;
    const r = r0 + t * dr;
    path.push([Number((r * Math.cos(theta)).toFixed(2)), Number((r * Math.sin(theta)).toFixed(2))]);
  }

  const nodes = es.map((e, i) => {
    const theta = start + i * step;
    const r = r0 + i * dr;
    const x = Number((r * Math.cos(theta)).toFixed(2));
    const y = Number((r * Math.sin(theta)).toFixed(2));
    const last = i === n - 1;
    const color = last ? c.accent : c.series[i % c.series.length];
    const valTxt =
      e.value === undefined || e.value === '' ? '' : ` · ${t9FormatNumber(t9ParseNumber(e.value), true)}`;
    const text = `${e.year ?? ''} ${e.label ?? ''}${valTxt}`.trim();
    return {
      name: e.label ?? '',
      value: [x, y],
      symbolSize: last ? 20 : 12,
      itemStyle: { color, borderColor: c.surfaceSolid, borderWidth: 2, shadowBlur: last ? 14 : 0, shadowColor: t9Rgba(c.accent, 0.5) },
      label: t9DataLabel(c, x >= 0 ? 'right' : 'left', {
        distance: 10,
        formatter: text,
        color: last ? c.accent : c.ink2,
        fontFamily: c.font,
        fontSize: 13,
        fontWeight: last ? 700 : 400,
      }),
    };
  });

  const bound = r0 + (n - 1) * dr + 12;

  return {
    grid: { left: '27%', right: '27%', top: 6, bottom: 6, containLabel: false },
    xAxis: { type: 'value', min: -bound, max: bound, show: false },
    yAxis: { type: 'value', min: -bound, max: bound, show: false },
    series: [
      {
        type: 'line',
        data: path,
        smooth: true,
        symbol: 'none',
        silent: true,
        clip: false,
        z: 1,
        lineStyle: { color: t9Rgba(c.accent, 0.42), width: 2 },
      },
      {
        type: 'scatter',
        data: nodes,
        clip: false,
        z: 5,
        labelLayout: { hideOverlap: true },
      },
    ],
  };
}

export function Theme09SpiralV1(props: Theme09SpiralV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    events = [],
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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-spiral">
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
            className="lp-theme09-spiral-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="custom" option={buildOption(events)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
