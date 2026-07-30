// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04GroupbarsV1Series {
  name: string;
  data: number[];
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04GroupbarsV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  series?: Theme04GroupbarsV1Series[];
  unit?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04GroupbarsV1Meta: LayoutMeta = {
  id: 'theme04_groupbars_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 分组柱状图',
  description: '多系列分组柱状图，对比不同维度数据',
  needsMedia: false,
  tags: ['chart', 'bar', 'grouped', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04GroupbarsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '多维对比' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{各赛道}}季度融资对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '基础设施、应用层与基础模型三赛道走势' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'labels',
      label: '分类标签',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [{ item: 'Q1' }, { item: 'Q2' }, { item: 'Q3' }, { item: 'Q4' }],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '数据系列',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { name: '基础模型', data: [120, 150, 200, 280], tone: 'green' },
        { name: '基础设施', data: [80, 90, 110, 140], tone: 'blue' },
        { name: '应用层', data: [40, 55, 70, 95], tone: 'pink' },
      ],
      itemSchema: [
        { key: 'name', label: '系列名', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
        {
          key: 'data',
          label: '数据',
          type: 'array',
          maxItems: 8,
          itemSchema: [{ key: 'item', label: '值', type: 'number', inlineEditable: true }],
        },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-groupbars-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

const toneMap: Record<string, string> = {
  green: 'var(--lp-green)',
  pink: 'var(--lp-pink)',
  blue: 'var(--lp-blue)',
  yellow: 'var(--lp-yellow)',
};

function buildOption(labels: any[], series: Theme04GroupbarsV1Series[], unit?: string): Record<string, unknown> {
  const categoryData = labels.map((label) => (typeof label === 'string' ? label : label?.item) ?? '');

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const lines = params.map((p) => `${p.marker} ${p.seriesName}: ${p.value} ${unit || ''}`);
        return `<div style="font-weight:700;margin-bottom:4px">${params[0]?.name}</div>${lines.join('<br>')}`;
      },
    },
    legend: {
      data: series.map((s) => s.name),
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: 'var(--lp-ink2)', fontSize: 12, fontWeight: 600 },
    },
    grid: { top: 24, right: 24, bottom: 44, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      data: categoryData,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLabel: {
        color: 'var(--lp-ink3)',
        fontSize: 11,
        formatter: `{value} ${unit || ''}`,
      },
    },
    series: series.map((s) => ({
      name: s.name,
      type: 'bar',
      color: toneMap[s.tone || 'green'],
      data: (s.data || []).map((value) => ({ value, itemStyle: { borderRadius: [4, 4, 0, 0] } })),
      barGap: '15%',
      barCategoryGap: '30%',
      label: {
        show: false,
      },
      animationDuration: 700,
    })),
  };
}

export function Theme04GroupbarsV1(props: Theme04GroupbarsV1Props): ReactNode {
  const { kicker, title, subtitle, labels, series, unit, _slideIdx, _editable } = props;
  const validLabels = (labels || []).slice(0, 8);
  const validSeries = (series || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme04-groupbars">
      <div className="lp-theme04-groupbars-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-groupbars-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validLabels.length > 0 && validSeries.length > 0 && (
        <div className="lp-theme04-groupbars-chart lp-rise">
          <LpEChart type="bar" option={buildOption(validLabels, validSeries, unit)} className="lp-theme04-groupbars-echart" />
        </div>
      )}
    </div>
  );
}
