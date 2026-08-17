// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 结构演变（stacked_v1）
 * 基底：纸 | 骨架：chart-canvas | 图位：—
 *
 * 百分比堆叠柱状图：X 轴为时间期次，柱内分段显示结构占比变化，
 * 图下以演变箭头标注关键转折点。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet, normalizeStrings } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import {
  t9AxisLabel,
  t9ChartColors,
  t9DataLabel,
  t9Grid,
  t9Legend,
  t9ParseNumber,
  t9Rgba,
  t9SplitLine,
  t9Tooltip,
} from './chart-utils.js';

export interface Theme09StackedSeries {
  name?: string;
  /** 各期数值，支持 `12|18|24` 字符串或数组 */
  data?: string | Array<string | number | { item?: string }>;
}

export interface Theme09StackedAnnotation {
  period?: string;
  text?: string;
}

export interface Theme09StackedV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  periods?: Array<string | { item?: string }>;
  categories?: Array<string | { item?: string }>;
  series?: Theme09StackedSeries[];
  annotations?: Theme09StackedAnnotation[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09StackedV1Meta: LayoutMeta = {
  id: 'theme09_stacked_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '结构演变',
  description: '百分比堆叠柱状图 + 多期结构对比 + 转折点箭头标注，纸底',
  needsMedia: false,
  tags: ['chart', 'stacked', 'structure', 'evolution'],
  contentShape: 'stacked-percent',
};

export const theme09StackedV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '结构演变' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'STRUCTURE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '42' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '演变' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '收入结构的重心，正在向 {{应用层}} 迁移' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '柱高统一为 100%，分段长度代表该期各业务在总收入中的占比。',
    },
    { key: 'periods', label: '期次（X 轴）', type: 'array', inlineEditable: true, defaultValue: ['2022', '2023', '2024', '2025', '2026E'] },
    { key: 'categories', label: '结构类目', type: 'array', inlineEditable: true, defaultValue: ['底座算力', '平台订阅', '应用交付', '数据服务'] },
    {
      key: 'series',
      label: '各类目数据',
      type: 'array',
      maxItems: 6,
      itemSchema: [
        { key: 'name', label: '类目名称', type: 'text' },
        { key: 'data', label: '各期数值（用 | 分隔）', type: 'text' },
      ],
    },
    {
      key: 'annotations',
      label: '转折点标注',
      type: 'array',
      maxItems: 3,
      itemSchema: [
        { key: 'period', label: '对应期次', type: 'text' },
        { key: 'text', label: '标注文字', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: '口径：年度确认收入 · 剔除一次性项目' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'STRUCTURE / 42' },
  ],
};

const DEFAULT_PERIODS = ['2022', '2023', '2024', '2025', '2026E'];
const DEFAULT_CATEGORIES = ['底座算力', '平台订阅', '应用交付', '数据服务'];

const DEFAULT_SERIES: Theme09StackedSeries[] = [
  { name: '底座算力', data: '58|49|38|29|22' },
  { name: '平台订阅', data: '24|27|29|30|28' },
  { name: '应用交付', data: '12|18|25|32|38' },
  { name: '数据服务', data: '6|6|8|9|12' },
];

const DEFAULT_ANNOTATIONS: Theme09StackedAnnotation[] = [
  { period: '2024', text: '应用交付首次超过四分之一，结构拐点出现' },
  { period: '2026E', text: '底座算力占比降至两成出头，重心完成迁移' },
];

function toLabels(input: unknown, fallback: string[]): string[] {
  const list = normalizeStrings(input);
  return list.length ? list : fallback;
}

function toNumbers(v: Theme09StackedSeries['data'], len: number): number[] {
  let raw: Array<string | number> = [];
  if (Array.isArray(v)) {
    raw = v.map((x) => (typeof x === 'object' && x !== null ? ((x as { item?: string }).item ?? '') : (x as string | number)));
  } else {
    raw = String(v ?? '')
      .split(/[|、,，]/)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  const nums = raw.map((x) => t9ParseNumber(x));
  return Array.from({ length: len }, (_, i) => nums[i] ?? 0);
}

function buildOption(
  periods: string[],
  seriesList: Theme09StackedSeries[],
  categories: string[],
): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const names = seriesList.map((sr, i) => (sr.name && sr.name.trim() ? sr.name : (categories[i] ?? `类目 ${i + 1}`)));
  const matrix = seriesList.map((sr) => toNumbers(sr.data, periods.length));

  const totals = periods.map((_p, pi) => matrix.reduce((sum, row) => sum + (row[pi] ?? 0), 0));

  const series = names.map((name, si) => {
    const color = si === 0 ? c.ink3 : c.series[(si - 1) % c.series.length];
    const isLast = si === names.length - 1;
    return {
      name,
      type: 'bar',
      stack: 'percent',
      barWidth: '46%',
      barMaxWidth: 96,
      itemStyle: {
        color: t9Rgba(color, si === 0 ? 0.55 : 0.88),
        borderColor: c.surfaceSolid,
        borderWidth: 1,
        borderRadius: isLast ? ([3, 3, 0, 0] as [number, number, number, number]) : 0,
      },
      data: periods.map((_p, pi) => {
        const total = totals[pi] || 1;
        const pct = Math.round(((matrix[si]?.[pi] ?? 0) / total) * 1000) / 10;
        return {
          value: pct,
          label: t9DataLabel(c, 'inside', {
            show: pct >= 8,
            color: si === 0 ? c.ink : c.onAccent,
            fontWeight: 700,
            fontSize: 11.5,
            formatter: `${pct}%`,
          }),
        };
      }),
    };
  });

  return {
    tooltip: t9Tooltip(c, { trigger: 'axis', axisPointer: { type: 'shadow' } }),
    legend: t9Legend(c, { top: 0, left: 0, right: 'auto', itemWidth: 12, itemHeight: 8, itemGap: 16, data: names }),
    grid: t9Grid({ left: 10, right: 18, top: 42, bottom: 6 }),
    xAxis: {
      type: 'category',
      data: periods,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: c.ruleStrong } },
      axisLabel: { ...t9AxisLabel(c, 13), fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 25,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { ...t9AxisLabel(c, 11.5), formatter: '{value}%' },
      splitLine: t9SplitLine(c),
    },
    series,
  };
}

export function Theme09StackedV1(props: Theme09StackedV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    periods,
    categories,
    series = [],
    annotations = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('paper');
  const periodList = toLabels(periods, DEFAULT_PERIODS);
  const categoryList = toLabels(categories, DEFAULT_CATEGORIES);
  const seriesList = (series.length ? series : DEFAULT_SERIES).slice(0, 6);
  const notes = (annotations.length ? annotations : DEFAULT_ANNOTATIONS).slice(0, 3);
  const option = buildOption(periodList, seriesList, categoryList);

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-stacked">
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

            <LpEChart type="bar" option={option} className="lp-theme09-chart-area" />

            {notes.length > 0 && (
              <div
                style={{
                  flex: 'none',
                  display: 'flex',
                  gap: 26,
                  flexWrap: 'wrap',
                  borderTop: `1px solid ${c.rule}`,
                  paddingTop: 10,
                }}
              >
                {notes.map((note, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 9, maxWidth: 460 }}>
                    <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true" style={{ flex: 'none', marginTop: 3 }}>
                      <path d="M0 12 L12 2" stroke={c.accent} strokeWidth="1.5" fill="none" />
                      <path d="M14.6 0 L15 6.4 L8.6 6" fill={c.accent} />
                    </svg>
                    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                      <span
                        style={{
                          fontFamily: c.fontMono,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          color: c.accent,
                        }}
                      >
                        <EditableField prop={`annotations.${i}.period`} slideIdx={_slideIdx} editable={_editable} as="span">
                          {note.period ?? ''}
                        </EditableField>
                      </span>
                      <span style={{ fontSize: 12.5, lineHeight: 1.6, color: c.ink2 }}>
                        <EditableField prop={`annotations.${i}.text`} slideIdx={_slideIdx} editable={_editable} as="span">
                          {note.text ?? ''}
                        </EditableField>
                      </span>
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        }
      />
    </Sheet>
  );
}
