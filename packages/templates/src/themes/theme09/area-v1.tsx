// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9AxisLabel, t9Grid, t9SplitLine, t9Tooltip, t9Legend, t9AreaStyle, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09AreaV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  dates?: string[];
  seriesA?: (string | number)[];
  seriesB?: (string | number)[];
  seriesAName?: string;
  seriesBName?: string;
  insight?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09AreaV1Meta: LayoutMeta = {
  id: 'theme09_area_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '面积趋势',
  description: '面积趋势图 + 真值/指数双轴 + 右侧洞察栏，墨底',
  needsMedia: false,
  tags: ['chart', 'area', 'trend', 'timeseries'],
  contentShape: 'area-trend',
};

export const theme09AreaV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '规模走势' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'AREA TREND' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '14' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '趋势' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '真值与指数{{同向}}走高' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '左轴为季度真值（亿元），右轴为以首季为 100 的景气指数。',
    },
    {
      key: 'dates',
      label: '时间刻度',
      type: 'array',
      inlineEditable: true,
      defaultValue: ['22Q1', '22Q3', '23Q1', '23Q3', '24Q1', '24Q3', '25Q1'],
    },
    { key: 'seriesA', label: '真值序列', type: 'array' },
    { key: 'seriesB', label: '指数序列', type: 'array' },
    { key: 'seriesAName', label: '真值序列名', type: 'text', inlineEditable: true, defaultValue: '季度真值' },
    { key: 'seriesBName', label: '指数序列名', type: 'text', inlineEditable: true, defaultValue: '景气指数' },
    {
      key: 'insight',
      label: '侧栏洞察（换行分隔）',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '连续七个季度正增长\n24Q3 后斜率显著抬升\n指数领先真值约一个季度',
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_DATES = ['22Q1', '22Q3', '23Q1', '23Q3', '24Q1', '24Q3', '25Q1'];
const DEFAULT_A = [42, 55, 68, 79, 96, 124, 158];
const DEFAULT_B = [100, 118, 132, 145, 168, 205, 246];
const DEFAULT_INSIGHT = '连续七个季度正增长\n24Q3 后斜率显著抬升\n指数领先真值约一个季度';

function buildOption(
  dates: string[],
  seriesA: (string | number)[],
  seriesB: (string | number)[],
  nameA: string,
  nameB: string,
): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const ds = dates.length ? dates : DEFAULT_DATES;
  const a = (seriesA.length ? seriesA : DEFAULT_A).map((v) => t9ParseNumber(v));
  const b = (seriesB.length ? seriesB : DEFAULT_B).map((v) => t9ParseNumber(v));
  const colorB = c.series[3 % c.series.length];

  return {
    grid: t9Grid({ left: 24, right: 52, top: 40, bottom: 44 }),
    tooltip: { ...t9Tooltip(c), trigger: 'axis' },
    legend: t9Legend(c, { top: 0, right: 0, data: [nameA, nameB] }),
    xAxis: {
      type: 'category',
      data: ds,
      boundaryGap: false,
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono },
    },
    yAxis: [
      {
        type: 'value',
        name: nameA,
        nameTextStyle: { color: c.ink3, fontFamily: c.font, fontSize: 11, padding: [0, 0, 6, 0] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono },
        splitLine: t9SplitLine(c),
      },
      {
        type: 'value',
        name: nameB,
        nameTextStyle: { color: c.ink3, fontFamily: c.font, fontSize: 11, padding: [0, 0, 6, 0] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        type: 'line',
        name: nameA,
        yAxisIndex: 0,
        data: a,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: c.accent, width: 3 },
        itemStyle: { color: c.accent, borderColor: c.surfaceSolid, borderWidth: 2 },
        areaStyle: t9AreaStyle(c.accent, 'ink'),
        label: t9DataLabel(c, 'top', { fontSize: 11 }),
        emphasis: t9Emphasis(c),
        z: 4,
      },
      {
        type: 'line',
        name: nameB,
        yAxisIndex: 1,
        data: b,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: colorB, width: 2, type: 'dashed' },
        itemStyle: { color: colorB },
        areaStyle: t9AreaStyle(colorB, 'ink'),
        emphasis: t9Emphasis(c),
        z: 3,
      },
    ],
  };
}

export function Theme09AreaV1(props: Theme09AreaV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    dates = [],
    seriesA = [],
    seriesB = [],
    seriesAName,
    seriesBName,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const nameA = seriesAName && seriesAName.trim() ? seriesAName : '季度真值';
  const nameB = seriesBName && seriesBName.trim() ? seriesBName : '景气指数';
  const lines = (insight && insight.trim() ? insight : DEFAULT_INSIGHT)
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-area">
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
            className="lp-theme09-area-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}

            <div style={{ display: 'flex', alignItems: 'stretch', flex: '1 1 auto', minHeight: 0, gap: '26px' }}>
              <div style={{ flex: '1 1 auto', minWidth: 0, minHeight: 0, display: 'flex' }}>
                <LpEChart
                  type="line"
                  option={buildOption(dates, seriesA, seriesB, nameA, nameB)}
                  className="lp-theme09-chart-area"
                />
              </div>

              <EditableField prop="insight" slideIdx={_slideIdx} editable={_editable} as="div">
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '16px',
                    width: '212px',
                    borderLeft: `1px solid ${c.rule}`,
                    paddingLeft: '20px',
                    height: '100%',
                  }}
                >
                  {lines.map((line, i) => (
                    <span key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ width: '20px', height: '2px', background: c.accent }} />
                      <span style={{ fontFamily: c.font, fontSize: '14px', lineHeight: 1.6, color: c.ink2 }}>{line}</span>
                    </span>
                  ))}
                </span>
              </EditableField>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
