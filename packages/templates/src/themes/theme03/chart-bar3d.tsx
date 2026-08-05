// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartBar3dItem {
  label?: string;
  value?: string;
}

export interface Theme03ChartBar3dProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  bars?: Theme03ChartBar3dItem[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartBar3dMeta: LayoutMeta = {
  id: 'theme03_chart_bar3d',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风 3D 柱状图',
  description: '伪 3D 柱状图，使用堆叠柱状图营造立体冲击感',
  needsMedia: false,
  tags: ['chart', 'bar', '3d'],
  contentShape: 'bar3d-chart',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartBar3dSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '立体对比' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '13' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '季度营收 · 单位：百万美元' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{3D 对比}}：各季度收入立体呈现' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'bars',
      label: '柱状数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function parseValue(v?: string): number {
  return parseFloat(String(v || '0').replace(/,/g, '')) || 0;
}

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-bar3d-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function buildOption(bars: Theme03ChartBar3dItem[]): Record<string, unknown> {
  const values = bars.map((b) => parseValue(b.value));
  const max = Math.max(...values, 1);
  const barWidth = 36;

  const barData = bars.map((b, index) => ({
    value: parseValue(b.value),
    itemStyle: {
      color: index === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(index - 1) % NEUTRAL_COLORS.length],
      borderRadius: [4, 4, 0, 0],
      shadowColor: 'var(--lp-shadow)',
      shadowBlur: 12,
      shadowOffsetY: 6,
    },
  }));

  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '8%', right: '6%', bottom: '14%', top: '12%' },
    xAxis: {
      type: 'category',
      data: bars.map((b) => b.label ?? ''),
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)', fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [
      {
        type: 'bar',
        data: values.map(() => max * 0.05),
        barWidth: barWidth * 1.15,
        barGap: '-115%',
        z: 1,
        itemStyle: {
          color: 'var(--lp-surface-strong)',
          borderRadius: [4, 4, 0, 0],
        },
        silent: true,
        animation: false,
      },
      {
        type: 'bar',
        data: barData,
        barWidth,
        z: 2,
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--lp-ink)',
          fontFamily: 'var(--lp-font-mono)',
        },
        animationDuration: 800,
      },
      {
        type: 'pictorialBar',
        symbol: 'circle',
        symbolSize: [barWidth, barWidth * 0.45],
        symbolPosition: 'end',
        symbolOffset: [0, -barWidth * 0.22],
        z: 3,
        data: barData.map((d) => ({ value: d.value, itemStyle: { color: d.itemStyle.color } })),
        silent: true,
      },
    ],
  };
}

export function Theme03ChartBar3d(props: Theme03ChartBar3dProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    bars = [],
    unit,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validBars = (bars || []).filter((b) => b != null && !!(b.label || b.value));

  return (
    <div className="lp-slide lp-theme03-chart-bar3d">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-chart-bar3d-main">
        <div className="lp-theme03-chart-bar3d-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-bar3d-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-chart-bar3d-body lp-rise">
          {validBars.length > 0 ? (
            <LpEChart type="bar3d" option={buildOption(validBars)} className="lp-theme03-chart-bar3d-echart" />
          ) : (
            <div className="lp-theme03-chart-bar3d-empty">请配置 3D 柱状数据</div>
          )}
          {unit && (
            <div className="lp-theme03-chart-bar3d-unit">{unit}</div>
          )}
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
