// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04DumbbellV1Item {
  name: string;
  start: number;
  end: number;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04DumbbellV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  startLabel?: string;
  endLabel?: string;
  unit?: string;
  items?: Theme04DumbbellV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04DumbbellV1Meta: LayoutMeta = {
  id: 'theme04_dumbbell_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 估值跃迁',
  description: '水平哑铃图展示对象在两个时点的估值/数值跃迁',
  needsMedia: false,
  tags: ['chart', 'dumbbell', 'valuation', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04DumbbellV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '估值跃迁' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI 独角兽}}估值两年跃迁' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '起点为 2024 年初估值，终点为当前估值，展示估值扩张幅度。' },
    { key: 'startLabel', label: '起点标签', type: 'text', defaultValue: '2024' },
    { key: 'endLabel', label: '终点标签', type: 'text', defaultValue: '2026' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '跃迁项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { name: 'Anthropic', start: 180, end: 615, tone: 'green' },
        { name: 'OpenAI', start: 800, end: 1570, tone: 'blue' },
        { name: 'xAI', start: 120, end: 500, tone: 'pink' },
        { name: 'Perplexity', start: 5, end: 90, tone: 'yellow' },
        { name: 'Cohere', start: 22, end: 55, tone: 'green' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'start', label: '起点数值', type: 'number' },
        { key: 'end', label: '终点数值', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-dumbbell-title lp-rise">
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

function buildOption(items: Theme04DumbbellV1Item[], startLabel: string, endLabel: string, unit?: string): Record<string, unknown> {
  const names = items.map((i) => i.name);
  const starts = items.map((i) => i.start);
  const ends = items.map((i) => i.end);
  const maxEnd = Math.max(1, ...ends);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        const idx = params[0]?.dataIndex ?? 0;
        const item = items[idx];
        if (!item) return '';
        return `<div style="font-weight:700;margin-bottom:4px">${item.name}</div>${startLabel}: ${item.start} ${unit || ''}<br>${endLabel}: ${item.end} ${unit || ''}<br>跃迁: +${item.end - item.start} ${unit || ''}`;
      },
    },
    legend: {
      data: [startLabel, `${endLabel} 增量`],
      bottom: 0,
      textStyle: { color: 'var(--lp-ink2)', fontSize: 11 },
      itemWidth: 12,
      itemHeight: 12,
    },
    grid: { top: 16, right: 40, bottom: 36, left: 120, containLabel: false },
    xAxis: {
      type: 'value',
      max: maxEnd * 1.08,
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLabel: { color: 'var(--lp-ink3)', fontSize: 11, formatter: `{value} ${unit || ''}` },
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink)', fontSize: 12, fontWeight: 700 },
    },
    series: [
      {
        name: startLabel,
        type: 'bar',
        stack: 'total',
        data: starts.map((s) => ({ value: s, itemStyle: { color: 'var(--lp-ink3)', borderRadius: [4, 0, 0, 4] } })),
        label: { show: true, position: 'insideRight', color: 'var(--lp-text-inverse)', fontSize: 10, formatter: (p: any) => p.value },
      },
      {
        name: `${endLabel} 增量`,
        type: 'bar',
        stack: 'total',
        data: items.map((i) => ({
          value: Math.max(0, i.end - i.start),
          itemStyle: { color: toneMap[i.tone || 'green'], borderRadius: [0, 4, 4, 0] },
        })),
        label: {
          show: true,
          position: 'right',
          color: 'var(--lp-ink)',
          fontSize: 11,
          fontWeight: 700,
          formatter: (p: any) => {
            const item = items[p.dataIndex];
            return item ? `${item.end}` : p.value;
          },
        },
      },
    ],
  };
}

export function Theme04DumbbellV1(props: Theme04DumbbellV1Props): ReactNode {
  const { kicker, title, subtitle, startLabel = '2024', endLabel = '2026', unit, items, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 8);

  return (
    <div className="lp-slide lp-theme04-dumbbell">
      <div className="lp-theme04-dumbbell-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-dumbbell-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme04-dumbbell-chart lp-rise">
          <LpEChart type="bar" option={buildOption(validItems, startLabel, endLabel, unit)} className="lp-theme04-dumbbell-echart" />
        </div>
      )}
    </div>
  );
}
