// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05WaterfallV1Item {
  name: string;
  value: number;
}

export interface Theme05WaterfallV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme05WaterfallV1Item[];
  totalLabel?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05WaterfallV1Meta: LayoutMeta = {
  id: 'theme05_waterfall_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 瀑布图',
  description: '瀑布图 + 贡献明细列表',
  needsMedia: false,
  tags: ['chart', 'waterfall', 'spectrum'],
  contentShape: 'generic-chart',
};

export const theme05WaterfallV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'WATERFALL' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度利润贡献拆解' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从营收到净利润的关键增减项' },
    {
      key: 'items',
      label: '贡献项',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    { key: 'totalLabel', label: '总计标签', type: 'text', inlineEditable: true, defaultValue: '净利润' },
  ],
};

function buildWaterfallOption(items: Theme05WaterfallV1Item[]): Record<string, unknown> {
  const names = items.map((item) => item.name);
  const values = items.map((item) => item.value);
  let cumulative = 0;
  const baseData: number[] = [];
  const changeData: (number | { value: number; itemStyle: { color: string } })[] = [];

  values.forEach((v) => {
    baseData.push(cumulative);
    changeData.push(v);
    cumulative += v;
  });
  const total = cumulative;

  // 总计柱：从 0 开始到 total
  baseData.push(0);
  changeData.push({ value: total, itemStyle: { color: 'var(--lp-accent-cool)' } });

  const changeColors: string[] = values.map((v) => (v >= 0 ? 'var(--lp-accent)' : 'var(--lp-red)'));
  changeColors.push('var(--lp-accent-cool)');

  return {
    grid: { top: 40, right: 24, bottom: 72, left: 72, containLabel: false },
    xAxis: {
      type: 'category',
      data: [...names, '总计'],
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
        interval: 0,
        rotate: 30,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [
      {
        type: 'bar',
        stack: 'waterfall',
        data: baseData,
        itemStyle: { color: 'transparent' },
        barWidth: 36,
        label: { show: false },
        animationDuration: 800,
      },
      {
        type: 'bar',
        stack: 'waterfall',
        data: changeData.map((d, idx) => {
          const value = typeof d === 'number' ? d : d.value;
          const color = changeColors[idx];
          return { value, itemStyle: { color } };
        }),
        barWidth: 36,
        label: {
          show: true,
          position: 'top',
          color: 'var(--lp-ink)',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'var(--lp-font-mono)',
          formatter: (p: any) => {
            const v = p.value;
            return v >= 0 ? `+${v}` : String(v);
          },
        },
        animationDuration: 800,
      },
    ],
  };
}

export function Theme05WaterfallV1(props: Theme05WaterfallV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], totalLabel, _slideIdx, _editable } = props;
  const hasData = items.length > 0;

  return (
    <div className="lp-slide lp-theme05-waterfall">
      <div className="lp-theme05-waterfall-main lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-waterfall-canvas">
          {hasData ? (
            <LpEChart
              type="bar"
              option={buildWaterfallOption(items)}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入数据
            </div>
          )}
        </div>
      </div>
      <div className="lp-theme05-waterfall-items lp-rise">
        {items.map((item, i) => (
          <div key={i} className="lp-theme05-waterfall-item">
            <span className="lp-theme05-waterfall-item-name">
              <EditableField prop={`items.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{item.name}</EditableField>
            </span>
            <span className="lp-theme05-waterfall-item-value" style={{ color: item.value >= 0 ? 'var(--lp-accent)' : 'var(--lp-red)' }}>
              <EditableField prop={`items.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{item.value >= 0 ? `+${item.value}` : item.value}</EditableField>
            </span>
          </div>
        ))}
        {totalLabel && (
          <div className="lp-theme05-waterfall-item" style={{ borderColor: 'var(--lp-accent-cool)' }}>
            <span className="lp-theme05-waterfall-item-name">{totalLabel}</span>
            <span className="lp-theme05-waterfall-item-value" style={{ color: 'var(--lp-accent-cool)' }}>
              {items.reduce((sum, item) => sum + item.value, 0)}
            </span>
          </div>
        )}
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
