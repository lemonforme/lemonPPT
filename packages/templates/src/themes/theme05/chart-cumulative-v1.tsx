// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05ChartCumulativeV1Conclusion {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme05ChartCumulativeV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  unit?: string;
  showConclusion?: boolean;
  conclusion?: Theme05ChartCumulativeV1Conclusion;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChartCumulativeV1Meta: LayoutMeta = {
  id: 'theme05_chart_cumulative_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 累积图',
  description: '累积面积图 + 当前总计 + 结论区',
  needsMedia: false,
  tags: ['chart', 'cumulative', 'area'],
  contentShape: 'area-chart',
};

export const theme05ChartCumulativeV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CUMULATIVE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度融资累计走势' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年融资额逐月累计增长' },
    {
      key: 'labels',
      label: '分类标签',
      type: 'array',
      minItems: 1,
      maxItems: 24,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 24,
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: {
        value: '970',
        label: '年度累计融资额',
        description: '截至年末，全年融资累计额达到历史新高。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

function buildCumulative(data: number[]): number[] {
  let sum = 0;
  return data.map((v) => {
    sum += v ?? 0;
    return sum;
  });
}

function buildOption(labels: string[], data: number[]): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');
  const cumulative = buildCumulative(data);
  const max = Math.max(...cumulative, 1);

  return {
    grid: { top: 32, right: 24, bottom: 52, left: 56, containLabel: false },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        return `<div style="font-weight:700;margin-bottom:4px">${p.name}</div>累计：${p.value}`;
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: categoryData,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
        interval: Math.floor(categoryData.length / 6),
      },
    },
    yAxis: {
      type: 'value',
      max: Math.ceil(max * 1.1),
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [
      {
        type: 'line',
        data: cumulative,
        smooth: false,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { width: 3, color: 'var(--lp-accent)' },
        itemStyle: { color: 'var(--lp-accent)' },
        areaStyle: {
          opacity: 0.2,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'var(--lp-accent)' },
              { offset: 1, color: 'rgba(0,0,0,0)' },
            ],
          },
        },
        animationDuration: 900,
      },
    ],
  };
}

export function Theme05ChartCumulativeV1(props: Theme05ChartCumulativeV1Props): ReactNode {
  const { kicker, title, subtitle, labels = [], data = [], unit, showConclusion = true, conclusion, _slideIdx, _editable } = props;

  const validLabels = labels.slice(0, data.length);
  const validData = data.slice(0, labels.length);
  const hasData = validLabels.length > 0 && validData.length > 0;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme05-chart-cumulative">
      <div className="lp-theme05-chart-cumulative-main lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-chart-cumulative-canvas lp-rise">
          {hasData ? (
            <LpEChart type="line" option={buildOption(validLabels, validData)} className="lp-theme05-chart-cumulative-echart" />
          ) : (
            <div className="lp-theme05-chart-cumulative-empty">请配置分类与数据</div>
          )}
        </div>
      </div>
      <div className="lp-theme05-chart-cumulative-aside lp-rise">
        {unit && (
          <div className="lp-theme05-card">
            <div className="lp-theme05-card-label">单位</div>
            <div className="lp-theme05-card-value" style={{ fontSize: 'var(--lp-font-size-h3)' }}>{unit}</div>
          </div>
        )}
        {hasConclusion && (
          <div className="lp-theme05-conclusion">
            {conclusion!.value && <div className="lp-theme05-conclusion-value"><EditableField prop="conclusion.value" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.value}</EditableField></div>}
            {conclusion!.label && <div className="lp-theme05-conclusion-label"><EditableField prop="conclusion.label" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.label}</EditableField></div>}
            {conclusion!.description && <div className="lp-theme05-conclusion-description"><EditableField prop="conclusion.description" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.description}</EditableField></div>}
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
