// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05BubbleV1Item {
  name: string;
  x: number;
  y: number;
  value: number;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05BubbleV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  unit?: string;
  items?: Theme05BubbleV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05BubbleV1Meta: LayoutMeta = {
  id: 'theme05_bubble_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 气泡分布图',
  description: '气泡图展示估值与增速/融资规模的多维关系',
  needsMedia: false,
  tags: ['chart', 'bubble', 'scatter', 'spectrum'],
  contentShape: 'generic-chart',
};

export const theme05BubbleV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '估值分布' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI 独角兽}}估值与增速分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '横轴为估值，纵轴为同比增速，气泡大小代表累计融资额' },
    { key: 'xAxisLabel', label: 'X轴名称', type: 'text', defaultValue: '估值（亿美元）' },
    { key: 'yAxisLabel', label: 'Y轴名称', type: 'text', defaultValue: '同比增速（%）' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '气泡数据',
      type: 'array',
      minItems: 3,
      maxItems: 16,
      defaultValue: [
        { name: 'OpenAI', x: 1570, y: 41, value: 970, scheme: 'coral' },
        { name: 'Anthropic', x: 184, y: 120, value: 77, scheme: 'teal' },
        { name: 'xAI', x: 240, y: 300, value: 60, scheme: 'indigo' },
        { name: 'Databricks', x: 430, y: 25, value: 50, scheme: 'amber' },
        { name: 'CoreWeave', x: 70, y: 180, value: 35, scheme: 'violet' },
        { name: 'Scale AI', x: 138, y: 60, value: 25, scheme: 'teal' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'x', label: 'X值', type: 'number' },
        { key: 'y', label: 'Y值', type: 'number' },
        { key: 'value', label: '气泡大小', type: 'number' },
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
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme05-bubble-title lp-rise">
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

function buildOption(items: Theme05BubbleV1Item[], xAxisLabel?: string, yAxisLabel?: string, unit?: string): Record<string, unknown> {
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
      data: items.map((item) => {
        const color = schemeColor(item.scheme);
        return {
          name: item.name,
          value: [item.x, item.y, item.value],
          itemStyle: {
            color,
            shadowBlur: 12,
            shadowColor: color,
          },
          symbolSize: Math.max(16, Math.min(64, (item.value / maxValue) * 80 + 18)),
        };
      }),
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

export function Theme05BubbleV1(props: Theme05BubbleV1Props): ReactNode {
  const { kicker, title, subtitle, xAxisLabel, yAxisLabel, unit, items, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 16);

  return (
    <div className="lp-slide lp-theme05-bubble">
      <div className="lp-theme05-bubble-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-bubble-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme05-bubble-chart lp-rise">
          <LpEChart type="scatter" option={buildOption(validItems, xAxisLabel, yAxisLabel, unit)} className="lp-theme05-bubble-echart" />
        </div>
      )}

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
