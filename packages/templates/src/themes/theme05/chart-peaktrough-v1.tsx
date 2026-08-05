// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05ChartPeaktroughV1Conclusion {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme05ChartPeaktroughV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  unit?: string;
  peakIndex?: number;
  troughIndex?: number;
  showConclusion?: boolean;
  conclusion?: Theme05ChartPeaktroughV1Conclusion;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChartPeaktroughV1Meta: LayoutMeta = {
  id: 'theme05_chart_peaktrough_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 峰谷对比图',
  description: '折线图 + 峰值/谷值标注 + 结论区',
  needsMedia: false,
  tags: ['chart', 'peak', 'trough', 'line'],
  contentShape: 'line-chart',
};

export const theme05ChartPeaktroughV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'PEAK & TROUGH' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资额峰谷波动' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '标注全年最高点与最低点' },
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
    { key: 'peakIndex', label: '峰值索引', type: 'number', defaultValue: 9 },
    { key: 'troughIndex', label: '谷值索引', type: 'number', defaultValue: 3 },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: {
        value: '3.2x',
        label: '峰谷差距',
        description: '最高点融资额是最低点的 3.2 倍，市场波动显著。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

function buildOption(labels: string[], data: number[], peakIndex: number, troughIndex: number): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const resolvedPeak = typeof peakIndex === 'number' && peakIndex >= 0 && peakIndex < data.length ? peakIndex : data.indexOf(max);
  const resolvedTrough = typeof troughIndex === 'number' && troughIndex >= 0 && troughIndex < data.length ? troughIndex : data.indexOf(min);

  const markPoints = [];
  if (resolvedPeak >= 0) {
    markPoints.push({
      coord: [resolvedPeak, data[resolvedPeak] ?? max],
      value: 'PEAK',
      itemStyle: { color: 'var(--lp-accent)' },
      label: { color: 'var(--lp-text-inverse)', fontWeight: 700 },
    });
  }
  if (resolvedTrough >= 0) {
    markPoints.push({
      coord: [resolvedTrough, data[resolvedTrough] ?? min],
      value: 'TROUGH',
      itemStyle: { color: 'var(--lp-accent-cool)' },
      label: { color: 'var(--lp-text-inverse)', fontWeight: 700 },
    });
  }

  return {
    grid: { top: 40, right: 24, bottom: 52, left: 56, containLabel: false },
    tooltip: { trigger: 'axis' },
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
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [
      {
        type: 'line',
        data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 4, color: 'var(--lp-accent)' },
        itemStyle: { color: 'var(--lp-accent)' },
        areaStyle: { opacity: 0.12, color: 'var(--lp-accent)' },
        markPoint: {
          data: markPoints as any,
          symbolSize: 60,
        },
        animationDuration: 900,
      },
    ],
  };
}

export function Theme05ChartPeaktroughV1(props: Theme05ChartPeaktroughV1Props): ReactNode {
  const { kicker, title, subtitle, labels = [], data = [], unit, peakIndex, troughIndex, showConclusion = true, conclusion, _slideIdx, _editable } = props;

  const validLabels = labels.slice(0, data.length);
  const validData = data.slice(0, labels.length);
  const hasData = validLabels.length > 0 && validData.length > 0;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme05-chart-peaktrough">
      <div className="lp-theme05-chart-peaktrough-main lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-chart-peaktrough-canvas lp-rise">
          {hasData ? (
            <LpEChart type="line" option={buildOption(validLabels, validData, peakIndex ?? -1, troughIndex ?? -1)} className="lp-theme05-chart-peaktrough-echart" />
          ) : (
            <div className="lp-theme05-chart-peaktrough-empty">请配置分类与数据</div>
          )}
        </div>
      </div>
      <div className="lp-theme05-chart-peaktrough-aside lp-rise">
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
