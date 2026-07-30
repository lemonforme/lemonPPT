// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04ScatterV1Item {
  name: string;
  x: number;
  y: number;
  value: number;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04ScatterV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  unit?: string;
  items?: Theme04ScatterV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ScatterV1Meta: LayoutMeta = {
  id: 'theme04_scatter_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 估值散点图',
  description: '散点图展示公司估值与增长率/融资规模的关系',
  needsMedia: false,
  tags: ['chart', 'scatter', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04ScatterV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '估值分布' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI 独角兽}}估值与增速分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '横轴为估值，纵轴为同比增速，气泡大小代表累计融资额' },
    { key: 'xAxisLabel', label: 'X轴名称', type: 'text', defaultValue: '估值（亿美元）' },
    { key: 'yAxisLabel', label: 'Y轴名称', type: 'text', defaultValue: '同比增速（%）' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '散点数据',
      type: 'array',
      minItems: 3,
      maxItems: 16,
      defaultValue: [
        { name: 'OpenAI', x: 1570, y: 41, value: 970, tone: 'green' },
        { name: 'Anthropic', x: 184, y: 120, value: 77, tone: 'blue' },
        { name: 'xAI', x: 240, y: 300, value: 60, tone: 'pink' },
        { name: 'Databricks', x: 430, y: 25, value: 50, tone: 'yellow' },
        { name: 'CoreWeave', x: 70, y: 180, value: 35, tone: 'green' },
        { name: 'Scale AI', x: 138, y: 60, value: 25, tone: 'blue' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'x', label: 'X值', type: 'number' },
        { key: 'y', label: 'Y值', type: 'number' },
        { key: 'value', label: '气泡大小', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-scatter-title lp-rise">
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

function buildOption(items: Theme04ScatterV1Item[], xAxisLabel?: string, yAxisLabel?: string, unit?: string): Record<string, unknown> {
  const maxValue = Math.max(1, ...items.map((item) => item.value));
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const d = params.data;
        return `<div style="font-weight:700;margin-bottom:4px">${d.name}</div>X: ${d.value[0]}<br>Y: ${d.value[1]}%<br>规模: ${d.value[2]} ${unit || ''}`;
      },
    },
    grid: { top: 24, right: 28, bottom: 56, left: 64, containLabel: false },
    xAxis: {
      type: 'value',
      name: xAxisLabel || '',
      nameLocation: 'middle',
      nameGap: 32,
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 11 },
      nameTextStyle: { color: 'var(--lp-ink2)', fontSize: 12, fontWeight: 700 },
    },
    yAxis: {
      type: 'value',
      name: yAxisLabel || '',
      nameLocation: 'middle',
      nameGap: 44,
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 11 },
      nameTextStyle: { color: 'var(--lp-ink2)', fontSize: 12, fontWeight: 700 },
    },
    series: [{
      type: 'scatter',
      data: items.map((item) => ({
        name: item.name,
        value: [item.x, item.y, item.value],
        itemStyle: {
          color: toneMap[item.tone || 'green'],
          shadowBlur: 12,
          shadowColor: toneMap[item.tone || 'green'],
        },
        symbolSize: Math.max(16, Math.min(64, (item.value / maxValue) * 80 + 18)),
      })),
      label: {
        show: true,
        formatter: '{b}',
        position: 'top',
        color: 'var(--lp-ink)',
        fontSize: 11,
        fontWeight: 600,
      },
      animationDuration: 900,
    }],
  };
}

export function Theme04ScatterV1(props: Theme04ScatterV1Props): ReactNode {
  const { kicker, title, subtitle, xAxisLabel, yAxisLabel, unit, items, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 16);

  return (
    <div className="lp-slide lp-theme04-scatter">
      <div className="lp-theme04-scatter-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-scatter-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme04-scatter-chart lp-rise">
          <LpEChart type="scatter" option={buildOption(validItems, xAxisLabel, yAxisLabel, unit)} className="lp-theme04-scatter-echart" />
        </div>
      )}
    </div>
  );
}
