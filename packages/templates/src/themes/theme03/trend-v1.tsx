// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03TrendV1Point {
  label?: string;
  value?: number;
}

export interface Theme03TrendV1Series {
  name?: string;
  data?: Theme03TrendV1Point[];
}

export interface Theme03TrendV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  type?: 'line' | 'area';
  series?: Theme03TrendV1Series[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TrendV1Meta: LayoutMeta = {
  id: 'theme03_trend_v1',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风趋势图',
  description: '多系列折线/面积趋势图，强调色为首条序列',
  needsMedia: false,
  tags: ['chart', 'trend', 'line', 'area'],
  contentShape: 'multi-series-trend',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03TrendV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '增长趋势' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '05' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '活跃用户 · 单位：千人' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{用户增长}}：多产品线的月度活跃用户趋势' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'type',
      label: '图表类型',
      type: 'select',
      defaultValue: 'line',
      options: [
        { value: 'line', label: '折线图' },
        { value: 'area', label: '面积图' },
      ],
    },
    {
      key: 'series',
      label: '系列',
      type: 'array',
      minItems: 1,
      maxItems: 5,
      itemSchema: [
        { key: 'name', label: '系列名称', type: 'text', inlineEditable: true },
        {
          key: 'data',
          label: '数据点',
          type: 'array',
          minItems: 2,
          maxItems: 12,
          itemSchema: [
            { key: 'label', label: '标签', type: 'text', inlineEditable: true },
            { key: 'value', label: '数值', type: 'number', inlineEditable: true },
          ],
        },
      ],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-trend-v1-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function buildOption(series: Theme03TrendV1Series[], type: 'line' | 'area'): Record<string, unknown> {
  const safeSeries = series.filter((s) => s && Array.isArray(s.data) && s.data.length > 0).slice(0, 5);
  const allLabels = Array.from(new Set(safeSeries.flatMap((s) => (s.data || []).map((p) => p.label || '')))).filter(Boolean);
  const labels = allLabels.length > 0 ? allLabels : [''];

  const echartsSeries = safeSeries.map((s, seriesIdx) => {
    const color = seriesIdx === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(seriesIdx - 1) % NEUTRAL_COLORS.length];
    const values = labels.map((label) => {
      const point = (s.data || []).find((p) => p.label === label);
      return typeof point?.value === 'number' ? point.value : 0;
    });
    return {
      name: s.name || `系列 ${seriesIdx + 1}`,
      type: 'line',
      data: values,
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 3, color },
      itemStyle: { color },
      areaStyle: type === 'area' ? { opacity: 0.18, color } : undefined,
      emphasis: { focus: 'series' },
    };
  });

  return {
    tooltip: { trigger: 'axis' },
    legend: {
      bottom: 0,
      textStyle: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
      itemStyle: { borderWidth: 0 },
    },
    grid: { top: 32, right: 24, bottom: 64, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: echartsSeries,
  };
}

export function Theme03TrendV1(props: Theme03TrendV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    type = 'line',
    series = [],
    unit,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validSeries = (series || [])
    .filter((s): s is Theme03TrendV1Series => s != null && Array.isArray(s.data))
    .slice(0, 5);
  const hasData = validSeries.length > 0;

  return (
    <div className="lp-slide lp-theme03-chart-trend-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-chart-trend-v1-main">
        <div className="lp-theme03-chart-trend-v1-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-trend-v1-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-chart-trend-v1-body lp-rise">
          {hasData ? (
            <LpEChart type="bar" option={buildOption(validSeries, type)} className="lp-theme03-chart-trend-v1-echart" />
          ) : (
            <div className="lp-theme03-chart-trend-v1-empty">请配置趋势数据</div>
          )}
          {unit && (
            <div className="lp-theme03-chart-trend-v1-unit">{unit}</div>
          )}
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
