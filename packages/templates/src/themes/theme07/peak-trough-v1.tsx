// lemonPPT - theme07 峰谷分析页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07PeakTroughV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  unit?: string;
  showConclusion?: boolean;
  conclusionValue?: string;
  conclusionLabel?: string;
  conclusionDescription?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07PeakTroughV1Meta: LayoutMeta = {
  id: 'theme07_peak_trough_v1',
  theme: 'theme07',
  role: 'chart',
  displayName: 'Theme 07 峰谷分析',
  description: '同时标注峰值与谷值的折线图，适合周期波动分析',
  needsMedia: true,
  tags: ['chart', 'line', 'peak', 'trough'],
  contentShape: 'generic-chart',
};

export const theme07PeakTroughV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'PEAK & TROUGH' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资额峰谷波动' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '识别周期中的高点与低点' },
    {
      key: 'labels',
      label: '时间标签',
      type: 'array',
      minItems: 2,
      maxItems: 24,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 2,
      maxItems: 24,
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    { key: 'conclusionValue', label: '结论主数值', type: 'text', defaultValue: '2.3×' },
    { key: 'conclusionLabel', label: '结论标签', type: 'text', defaultValue: '峰谷差' },
    { key: 'conclusionDescription', label: '结论描述', type: 'textarea', defaultValue: '峰值融资额约为谷值的 2.3 倍，显示明显的季度波动。' },
  ],
};

function buildOption(labels: string[], data: number[]): Record<string, unknown> {
  const max = Math.max(...data);
  const maxIndex = data.indexOf(max);
  const min = Math.min(...data);
  const minIndex = data.indexOf(min);

  return {
    grid: { top: 48, right: 32, bottom: 64, left: 64, containLabel: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border)',
      textStyle: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)' },
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontSize: 12, fontFamily: 'var(--lp-font)', interval: Math.floor(labels.length / 6) },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [{
      type: 'line',
      data,
      smooth: true,
      symbolSize: 8,
      lineStyle: { width: 3, color: 'var(--lp-accent)' },
      itemStyle: { color: 'var(--lp-accent)' },
      areaStyle: { opacity: 0.08, color: 'var(--lp-accent)' },
      markPoint: {
        data: [
          { name: '峰值', coord: [maxIndex, max], value: max, itemStyle: { color: 'var(--lp-accent-2)' }, label: { show: true, position: 'top', color: 'var(--lp-accent-2)', fontWeight: 700, fontFamily: 'var(--lp-font-mono)' } },
          { name: '谷值', coord: [minIndex, min], value: min, itemStyle: { color: 'var(--lp-accent-cool)' }, label: { show: true, position: 'bottom', color: 'var(--lp-accent-cool)', fontWeight: 700, fontFamily: 'var(--lp-font-mono)' } },
        ],
        symbolSize: 44,
      },
      animationDuration: 900,
    }],
  };
}

export function Theme07PeakTroughV1(props: Theme07PeakTroughV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, labels = [], data = [], unit, showConclusion = true, conclusionValue, conclusionLabel, conclusionDescription, _slideIdx, _editable } = props;
  const normLabels = labels.map((label) => (typeof label === 'string' ? label : (label as { item?: string }).item ?? ''));
  const normData = data.map((value) => (typeof value === 'number' ? value : Number((value as { item?: number }).item ?? 0) || 0));
  const validLabels = normLabels.slice(0, normData.length);
  const validData = normData.slice(0, normLabels.length);
  const hasData = validLabels.length >= 2 && validData.length >= 2;

  return (
    <div className="lp-slide lp-theme07 lp-theme07-chart">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-chart-main lp-rise">
        <Theme07IconChip name="trend" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
        <div className="lp-theme07-chart-canvas">
          {hasData ? (
            <LpEChart type="line" option={buildOption(validLabels, validData)} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入至少 2 组数据
            </div>
          )}
        </div>
      </div>
      <div className="lp-theme07-chart-aside lp-rise">
        {unit && (
          <div className="lp-theme07-card">
            <div className="lp-theme07-card-accent-bar" />
            <div className="lp-theme07-card-label">单位</div>
            <div className="lp-theme07-card-value" style={{ fontSize: 'var(--lp-font-size-h3)' }}>{unit}</div>
          </div>
        )}
        {showConclusion && (
          <div className="lp-theme07-conclusion">
            {conclusionValue && <div className="lp-theme07-conclusion-value"><EditableField prop="conclusionValue" slideIdx={_slideIdx} editable={_editable} as="span">{conclusionValue}</EditableField></div>}
            {conclusionLabel && <div className="lp-theme07-conclusion-label"><EditableField prop="conclusionLabel" slideIdx={_slideIdx} editable={_editable} as="span">{conclusionLabel}</EditableField></div>}
            {conclusionDescription && <div className="lp-theme07-conclusion-desc"><EditableField prop="conclusionDescription" slideIdx={_slideIdx} editable={_editable} as="span">{conclusionDescription}</EditableField></div>}
          </div>
        )}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
