// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05MapV1Item {
  name: string;
  value: number;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05MapV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme05MapV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05MapV1Meta: LayoutMeta = {
  id: 'theme05_map_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 区域分布图',
  description: '横向条形图展示不同地区/区域的数值分布',
  needsMedia: false,
  tags: ['chart', 'region', 'bar', 'spectrum'],
  contentShape: 'generic-chart',
};

export const theme05MapV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '地区分布' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI 融资}}的区域分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按融资金额排序的主要地区' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '地区数据',
      type: 'array',
      minItems: 3,
      maxItems: 10,
      defaultValue: [
        { name: '北美', value: 620, scheme: 'coral' },
        { name: '中国', value: 180, scheme: 'teal' },
        { name: '欧洲', value: 95, scheme: 'indigo' },
        { name: '亚太其他', value: 48, scheme: 'amber' },
        { name: '中东', value: 18, scheme: 'violet' },
        { name: '拉美', value: 9, scheme: 'teal' },
      ],
      itemSchema: [
        { key: 'name', label: '地区', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'scheme', label: '强调色', type: 'select', defaultValue: 'coral', options: [{ value: 'coral', label: '珊瑚' }, { value: 'amber', label: '琥珀' }, { value: 'teal', label: '青绿' }, { value: 'indigo', label: '靛蓝' }, { value: 'violet', label: '紫罗兰' }] },
      ],
    },
  ],
};

const schemeMap: Record<string, string> = {
  coral: '#E85D4E',
  amber: '#F5A623',
  teal: '#0FA3B1',
  indigo: '#4A58D9',
  violet: '#7C3AED',
};

function schemeColor(scheme?: string): string {
  return schemeMap[scheme || 'coral'] || schemeMap.coral;
}

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme05-map-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme05-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function buildOption(items: Theme05MapV1Item[], unit?: string): Record<string, unknown> {
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
          color: schemeColor(item.scheme),
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

export function Theme05MapV1(props: Theme05MapV1Props): ReactNode {
  const { kicker, title, subtitle, unit, items, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 10);

  return (
    <div className="lp-slide lp-theme05-map">
      <div className="lp-theme05-map-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-map-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme05-map-chart lp-rise">
          <LpEChart type="bar" option={buildOption(validItems, unit)} className="lp-theme05-map-echart" />
        </div>
      )}

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
