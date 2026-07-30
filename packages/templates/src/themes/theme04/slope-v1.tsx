// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04SlopeV1Item {
  name: string;
  previous: number;
  current: number;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04SlopeV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  previousLabel?: string;
  currentLabel?: string;
  items?: Theme04SlopeV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04SlopeV1Meta: LayoutMeta = {
  id: 'theme04_slope_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 排名变迁斜率图',
  description: '斜率图展示对象在两个时间点的排名变化',
  needsMedia: false,
  tags: ['chart', 'slope', 'ranking', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04SlopeV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '排名变迁' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{头部项目}}排名两年变化' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '斜线向上表示排名上升，向下则表示下滑' },
    { key: 'previousLabel', label: '前期标签', type: 'text', defaultValue: '2024' },
    { key: 'currentLabel', label: '当期标签', type: 'text', defaultValue: '2026' },
    {
      key: 'items',
      label: '排名数据',
      type: 'array',
      minItems: 3,
      maxItems: 10,
      defaultValue: [
        { name: 'OpenAI', previous: 1, current: 1, tone: 'green' },
        { name: 'Anthropic', previous: 4, current: 2, tone: 'blue' },
        { name: 'xAI', previous: 8, current: 3, tone: 'pink' },
        { name: 'Databricks', previous: 2, current: 4, tone: 'yellow' },
        { name: 'CoreWeave', previous: 12, current: 5, tone: 'green' },
        { name: 'Scale AI', previous: 5, current: 6, tone: 'blue' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'previous', label: '前期排名', type: 'number' },
        { key: 'current', label: '当期排名', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-slope-title lp-rise">
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

function buildOption(items: Theme04SlopeV1Item[], previousLabel?: string, currentLabel?: string): Record<string, unknown> {
  const sorted = [...items].sort((a, b) => a.current - b.current);
  const maxRank = Math.max(...sorted.map((item) => Math.max(item.previous, item.current)), 1);

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const d = params.data;
        return `<div style="font-weight:700;margin-bottom:4px">${d.name}</div>${previousLabel || '前期'}: 第 ${d.previous} 名<br>${currentLabel || '当期'}: 第 ${d.current} 名`;
      },
    },
    grid: { top: 24, right: 80, bottom: 24, left: 80, containLabel: false },
    xAxis: {
      type: 'category',
      data: [previousLabel || '前期', currentLabel || '当期'],
      axisLine: { lineStyle: { color: 'var(--lp-divider)', width: 2 } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink)', fontSize: 14, fontWeight: 700 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: maxRank,
      inverse: true,
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 11, formatter: '第 {value} 名' },
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
    },
    series: sorted.map((item) => ({
      name: item.name,
      type: 'line',
      smooth: false,
      symbol: 'circle',
      symbolSize: 14,
      lineStyle: {
        width: 3,
        color: toneMap[item.tone || 'green'],
        shadowBlur: 8,
        shadowColor: toneMap[item.tone || 'green'],
      },
      itemStyle: {
        color: toneMap[item.tone || 'green'],
        borderWidth: 2,
        borderColor: 'var(--lp-surface-elevated)',
      },
      label: {
        show: true,
        position: 'right',
        formatter: '{a}',
        color: 'var(--lp-ink)',
        fontSize: 12,
        fontWeight: 600,
      },
      data: [
        { name: item.name, value: item.previous, previous: item.previous, current: item.current },
        { name: item.name, value: item.current, previous: item.previous, current: item.current },
      ],
      animationDuration: 800,
    })),
  };
}

export function Theme04SlopeV1(props: Theme04SlopeV1Props): ReactNode {
  const { kicker, title, subtitle, previousLabel, currentLabel, items, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 10);

  return (
    <div className="lp-slide lp-theme04-slope">
      <div className="lp-theme04-slope-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-slope-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme04-slope-chart lp-rise">
          <LpEChart type="line" option={buildOption(validItems, previousLabel, currentLabel)} className="lp-theme04-slope-echart" />
        </div>
      )}
    </div>
  );
}
