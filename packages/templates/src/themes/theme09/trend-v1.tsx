// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 季度走势（trend_v1）
 * 基底：纸 | 骨架：chart-canvas | 图位：—
 *
 * 折线图 + 同比副轴：左轴绝对值（专色主线），右轴同比 %（灰色对比线）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import {
  t9AreaStyle,
  t9AxisLabel,
  t9ChartColors,
  t9DataLabel,
  t9Emphasis,
  t9Grid,
  t9Legend,
  t9ParseNumber,
  t9Rgba,
  t9SplitLine,
  t9Tooltip,
} from './chart-utils.js';

export interface Theme09TrendV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  quarters?: Array<string | { item?: string }>;
  mainSeries?: Array<string | number>;
  yoySeries?: Array<string | number>;
  mainName?: string;
  yoyName?: string;
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09TrendV1Meta: LayoutMeta = {
  id: 'theme09_trend_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '季度走势',
  description: '季度折线 + 同比副轴双 Y 轴，专色主线 + 灰色对比线，纸底',
  needsMedia: false,
  tags: ['chart', 'line', 'trend', 'quarterly', 'yoy'],
  contentShape: 'quarterly-trend',
};

export const theme09TrendV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '季度走势' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'TREND' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '16' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '走势' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '规模连续扩张，同比增速在 {{24Q4}} 见顶回落' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '左轴为季度绝对值，右轴为同比增速；两轴共用季度刻度。' },
    {
      key: 'quarters',
      label: '季度刻度',
      type: 'array',
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '季度', type: 'text' }],
    },
    { key: 'mainSeries', label: '主序列（绝对值）', type: 'array', itemSchema: [{ key: 'item', label: '数值', type: 'text' }] },
    { key: 'yoySeries', label: '同比序列（%）', type: 'array', itemSchema: [{ key: 'item', label: '同比', type: 'text' }] },
    { key: 'mainName', label: '主序列名', type: 'text', inlineEditable: true, defaultValue: '季度规模' },
    { key: 'yoyName', label: '同比序列名', type: 'text', inlineEditable: true, defaultValue: '同比增速' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿元' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: '口径：季度合并报表 · 未经审计' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'TREND / 16' },
  ],
};

const DEFAULT_QUARTERS = ['23Q1', '23Q2', '23Q3', '23Q4', '24Q1', '24Q2', '24Q3', '24Q4', '25Q1', '25Q2'];
const DEFAULT_MAIN = [48, 55, 61, 74, 82, 96, 112, 134, 148, 163];
const DEFAULT_YOY = [18.2, 21.4, 24.8, 29.6, 34.2, 38.5, 41.7, 44.3, 39.1, 32.6];

function toLabels(input: Array<string | { item?: string }>): string[] {
  return input
    .map((x) => (typeof x === 'string' ? x : (x?.item ?? '')))
    .map((x) => x.trim())
    .filter(Boolean);
}

function buildOption(
  quarters: string[],
  main: Array<string | number>,
  yoy: Array<string | number>,
  mainName: string,
  yoyName: string,
  unit: string,
): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const xs = quarters.length ? quarters : DEFAULT_QUARTERS;
  const a = (main.length ? main : DEFAULT_MAIN).map((v) => t9ParseNumber(v));
  const b = (yoy.length ? yoy : DEFAULT_YOY).map((v) => t9ParseNumber(v));

  return {
    grid: t9Grid({ left: 20, right: 24, top: 44, bottom: 36 }),
    tooltip: { ...t9Tooltip(c), trigger: 'axis' },
    legend: t9Legend(c, { top: 0, right: 0, data: [mainName, yoyName] }),
    xAxis: {
      type: 'category',
      data: xs,
      boundaryGap: false,
      axisLine: { lineStyle: { color: c.rule } },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono },
    },
    yAxis: [
      {
        type: 'value',
        name: unit ? `${mainName}（${unit}）` : mainName,
        nameTextStyle: { color: c.ink3, fontFamily: c.font, fontSize: 11, align: 'left', padding: [0, 0, 6, -8] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono },
        splitLine: t9SplitLine(c),
      },
      {
        type: 'value',
        name: `${yoyName}（%）`,
        nameTextStyle: { color: c.ink3, fontFamily: c.font, fontSize: 11, align: 'right', padding: [0, -8, 6, 0] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { ...t9AxisLabel(c, 12), fontFamily: c.fontMono, formatter: '{value}%' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        type: 'line',
        name: mainName,
        yAxisIndex: 0,
        data: a,
        smooth: 0.28,
        symbol: 'circle',
        symbolSize: 7,
        lineStyle: { color: c.accent, width: 3 },
        itemStyle: { color: c.accent, borderColor: c.surfaceSolid, borderWidth: 2 },
        areaStyle: t9AreaStyle(c.accent, 'paper'),
        label: t9DataLabel(c, 'top', { fontSize: 11, color: c.ink2 }),
        emphasis: t9Emphasis(c),
        z: 4,
      },
      {
        type: 'line',
        name: yoyName,
        yAxisIndex: 1,
        data: b,
        smooth: 0.28,
        symbol: 'emptyCircle',
        symbolSize: 6,
        lineStyle: { color: t9Rgba(c.ink3, 0.85), width: 2, type: 'dashed' },
        itemStyle: { color: c.ink3 },
        emphasis: t9Emphasis(c),
        z: 3,
      },
    ],
  };
}

export function Theme09TrendV1(props: Theme09TrendV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    quarters = [],
    mainSeries = [],
    yoySeries = [],
    mainName,
    yoyName,
    unit = '亿元',
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const nameA = mainName && mainName.trim() ? mainName : '季度规模';
  const nameB = yoyName && yoyName.trim() ? yoyName : '同比增速';

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-trend">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 auto', minHeight: 0 }}>
            {title && renderTitle(title)}
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            <LpEChart
              type="line"
              option={buildOption(toLabels(quarters), mainSeries, yoySeries, nameA, nameB, unit)}
              className="lp-theme09-chart-area"
            />
          </div>
        }
      />
    </Sheet>
  );
}
