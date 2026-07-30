// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04SpreadV1Item {
  label: string;
  value: number;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04SpreadV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme04SpreadV1Item[];
  unit?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04SpreadV1Meta: LayoutMeta = {
  id: 'theme04_spread_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 资金消长图',
  description: '双向条形图，展示增减对比或资金流动方向',
  needsMedia: false,
  tags: ['chart', 'bar', 'comparison', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04SpreadV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '资金消长' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{增减对比}}：谁在流入，谁在流出' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '正值为资金流入，负值为资金流出或收缩' },
    {
      key: 'items',
      label: '数据项',
      type: 'array',
      minItems: 2,
      maxItems: 10,
      defaultValue: [
        { label: '基础模型', value: 320, tone: 'green' },
        { label: '云算力', value: 280, tone: 'blue' },
        { label: 'AI 应用', value: 150, tone: 'pink' },
        { label: '芯片硬件', value: 120, tone: 'yellow' },
        { label: '传统软件', value: -80, tone: 'pink' },
        { label: '消费互联网', value: -120, tone: 'blue' },
      ],
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'value', label: '数值(可负)', type: 'number', inlineEditable: true },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究整理' },
  ],
};

const toneMap: Record<string, string> = {
  green: 'var(--lp-green)',
  pink: 'var(--lp-pink)',
  blue: 'var(--lp-blue)',
  yellow: 'var(--lp-yellow)',
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-spread-title lp-rise">
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

function buildOption(items: Theme04SpreadV1Item[], unit?: string): Record<string, unknown> {
  const labels = items.map((item) => item.label ?? '');

  return {
    grid: { top: 24, right: 40, bottom: 24, left: 120, containLabel: false },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLabel: {
        color: 'var(--lp-ink3)',
        fontFamily: 'var(--lp-font-mono)',
        formatter: `{value} ${unit || ''}`,
      },
    },
    yAxis: {
      type: 'category',
      data: labels,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink)',
        fontSize: 13,
        fontWeight: 700,
        fontFamily: 'var(--lp-font)',
      },
    },
    series: [
      {
        type: 'bar',
        data: items.map((item) => ({
          value: item.value,
          itemStyle: {
            color: toneMap[item.tone || 'green'],
            borderRadius: item.value >= 0 ? [0, 6, 6, 0] : [6, 0, 0, 6],
          },
        })),
        barWidth: 20,
        label: {
          show: true,
          position: 'right',
          color: 'var(--lp-ink)',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'var(--lp-font-mono)',
          formatter: `{c} ${unit || ''}`,
        },
        animationDuration: 800,
      },
    ],
  };
}

export function Theme04SpreadV1(props: Theme04SpreadV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], unit, footnote, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 10);
  const hasData = validItems.length > 0;

  return (
    <div className="lp-slide lp-theme04-spread">
      <div className="lp-theme04-spread-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-spread-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-spread-body lp-rise">
        {hasData ? (
          <LpEChart type="bar" option={buildOption(validItems, unit)} className="lp-theme04-spread-echart" />
        ) : (
          <div className="lp-theme04-spread-empty">请配置数据项</div>
        )}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-spread-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
