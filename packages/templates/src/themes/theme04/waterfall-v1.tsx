// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04WaterfallV1Item {
  label: string;
  value: number;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04WaterfallV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  startLabel?: string;
  startValue?: number;
  endLabel?: string;
  unit?: string;
  items?: Theme04WaterfallV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04WaterfallV1Meta: LayoutMeta = {
  id: 'theme04_waterfall_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 资金瀑布图',
  description: '瀑布图展示资金从起点到终点的增减过程',
  needsMedia: false,
  tags: ['chart', 'waterfall', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04WaterfallV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '资金瀑布' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{全年融资}}资金流动' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从年初基数到全年总额，逐季度叠加/流失' },
    { key: 'startLabel', label: '起点标签', type: 'text', defaultValue: '年初基数' },
    { key: 'startValue', label: '起点数值', type: 'number', defaultValue: 1200 },
    { key: 'endLabel', label: '终点标签', type: 'text', defaultValue: '全年总额' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '瀑布项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { label: 'Q1 新增', value: 180, tone: 'green' },
        { label: 'Q2 新增', value: 220, tone: 'green' },
        { label: 'Q3 退出', value: -80, tone: 'pink' },
        { label: 'Q4 新增', value: 310, tone: 'green' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '数值（负数为流出）', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-waterfall-title lp-rise">
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

function buildWaterfallData(startValue: number, items: Theme04WaterfallV1Item[]): { labels: string[]; increases: (number | '-')[]; decreases: (number | '-')[]; totals: (number | '-')[] } {
  const labels = [items[0]?.label || ''];
  const increases: (number | '-')[] = [0];
  const decreases: (number | '-')[] = [0];
  const totals: (number | '-')[] = [startValue];

  let current = startValue;
  items.forEach((item, idx) => {
    if (idx === items.length - 1) return;
    const next = current + item.value;
    labels.push(item.label);
    if (item.value >= 0) {
      increases.push(item.value);
      decreases.push('-');
    } else {
      increases.push('-');
      decreases.push(Math.abs(item.value));
    }
    totals.push('-');
    current = next;
  });

  // End total
  const endValue = items.reduce((sum, item) => sum + item.value, startValue);
  labels.push(items[items.length - 1]?.label || '合计');
  increases.push('-');
  decreases.push('-');
  totals.push(endValue);

  return { labels, increases, decreases, totals };
}

function buildOption(startValue: number, items: Theme04WaterfallV1Item[], unit?: string): Record<string, unknown> {
  const { labels, increases, decreases, totals } = buildWaterfallData(startValue, items);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const label = params[0]?.axisValue;
        const parts = params.filter((p) => p.value !== '-');
        const value = parts.map((p) => `${p.seriesName}: ${p.value}`).join('<br>');
        return `<div style="font-weight:700;margin-bottom:4px">${label}</div>${value} ${unit || ''}`;
      },
    },
    grid: { top: 24, right: 24, bottom: 44, left: 64, containLabel: false },
    xAxis: {
      type: 'category',
      data: labels,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 11, fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLabel: { color: 'var(--lp-ink3)', fontSize: 11, formatter: `{value} ${unit || ''}` },
    },
    series: [
      {
        name: '增长',
        type: 'bar',
        stack: 'total',
        data: increases.map((v) => (v === '-' ? { value: 0, itemStyle: { opacity: 0 } } : { value: v, itemStyle: { color: toneMap.green, borderRadius: [4, 4, 0, 0] } })),
        label: { show: true, position: 'top', color: 'var(--lp-ink)', fontSize: 10, formatter: (p: any) => (p.value ? `+${p.value}` : '') },
      },
      {
        name: '减少',
        type: 'bar',
        stack: 'total',
        data: decreases.map((v) => (v === '-' ? { value: 0, itemStyle: { opacity: 0 } } : { value: v, itemStyle: { color: toneMap.pink, borderRadius: [0, 0, 4, 4] } })),
        label: { show: true, position: 'bottom', color: 'var(--lp-ink)', fontSize: 10, formatter: (p: any) => (p.value ? `-${p.value}` : '') },
      },
      {
        name: '合计',
        type: 'bar',
        stack: 'total',
        data: totals.map((v) => (v === '-' ? { value: 0, itemStyle: { opacity: 0 } } : { value: v, itemStyle: { color: 'var(--lp-ink3)', borderRadius: [4, 4, 4, 4] } })),
        label: { show: true, position: 'top', color: 'var(--lp-ink)', fontSize: 11, fontWeight: 700, formatter: (p: any) => (p.value ? `${p.value}` : '') },
      },
    ],
  };
}

export function Theme04WaterfallV1(props: Theme04WaterfallV1Props): ReactNode {
  const { kicker, title, subtitle, startValue = 0, items, unit, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 8);

  return (
    <div className="lp-slide lp-theme04-waterfall">
      <div className="lp-theme04-waterfall-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-waterfall-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme04-waterfall-chart lp-rise">
          <LpEChart type="bar" option={buildOption(startValue, validItems, unit)} className="lp-theme04-waterfall-echart" />
        </div>
      )}
    </div>
  );
}
