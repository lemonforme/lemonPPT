// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04RegionV1Item {
  name: string;
  value: number;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04RegionV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme04RegionV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04RegionV1Meta: LayoutMeta = {
  id: 'theme04_region_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 地区分布图',
  description: '横向条形图展示不同地区/区域的数值分布',
  needsMedia: false,
  tags: ['chart', 'region', 'bar', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04RegionV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '地区分布' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI 融资}}的地区分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按融资金额排序的主要地区' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '地区数据',
      type: 'array',
      minItems: 3,
      maxItems: 10,
      defaultValue: [
        { name: '北美', value: 620, tone: 'green' },
        { name: '中国', value: 180, tone: 'blue' },
        { name: '欧洲', value: 95, tone: 'pink' },
        { name: '亚太其他', value: 48, tone: 'yellow' },
        { name: '中东', value: 18, tone: 'green' },
        { name: '拉美', value: 9, tone: 'blue' },
      ],
      itemSchema: [
        { key: 'name', label: '地区', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-region-title lp-rise">
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

function buildOption(items: Theme04RegionV1Item[], unit?: string): Record<string, unknown> {
  const sorted = [...items].sort((a, b) => a.value - b.value);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => `${params[0]?.name}<br>${params[0]?.value} ${unit || ''}`,
    },
    grid: { top: 24, right: 80, bottom: 24, left: 120, containLabel: false },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLabel: { color: 'var(--lp-ink3)', fontSize: 11, formatter: `{value} ${unit || ''}` },
    },
    yAxis: {
      type: 'category',
      data: sorted.map((item) => item.name),
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink)', fontSize: 13, fontWeight: 700 },
    },
    series: [{
      type: 'bar',
      data: sorted.map((item) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: toneMap[item.tone || 'green'],
          borderRadius: [0, 8, 8, 0],
        },
      })),
      barWidth: '55%',
      label: {
        show: true,
        position: 'right',
        color: 'var(--lp-ink)',
        fontSize: 12,
        fontWeight: 700,
        formatter: `{c} ${unit || ''}`,
      },
      animationDuration: 800,
    }],
  };
}

export function Theme04RegionV1(props: Theme04RegionV1Props): ReactNode {
  const { kicker, title, subtitle, unit, items, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 10);

  return (
    <div className="lp-slide lp-theme04-region">
      <div className="lp-theme04-region-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-region-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme04-region-chart lp-rise">
          <LpEChart type="bar" option={buildOption(validItems, unit)} className="lp-theme04-region-echart" />
        </div>
      )}
    </div>
  );
}
