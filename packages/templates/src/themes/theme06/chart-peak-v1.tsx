// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06ChartPeakV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  showTrough?: boolean;
  unit?: string;
  showConclusion?: boolean;
  conclusionValue?: string;
  conclusionLabel?: string;
  conclusionDescription?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChartPeakV1Meta: LayoutMeta = {
  id: 'theme06_chart_peak_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 峰值/峰谷图',
  description: '折线图峰值/峰谷标注，适合趋势转折点分析',
  needsMedia: true,
  tags: ['chart', 'line', 'peak', 'trough'],
  contentShape: 'generic-chart',
};

export const theme06ChartPeakV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'PEAK' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '趋势峰值分析' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '识别关键转折点位' },
    {
      key: 'labels',
      label: '分类标签',
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
    { key: 'showTrough', label: '同时标注谷值', type: 'boolean', defaultValue: false },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    { key: 'conclusionValue', label: '结论主数值', type: 'text', defaultValue: 'Q4' },
    { key: 'conclusionLabel', label: '结论标签', type: 'text', defaultValue: '峰值季度' },
    { key: 'conclusionDescription', label: '结论描述', type: 'textarea', defaultValue: 'Q4 融资额达到全年最高点，主要由大额后期项目驱动。' },
  ],
};

function buildOption(labels: string[], data: number[], showTrough: boolean): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');
  const max = Math.max(...data);
  const maxIndex = data.indexOf(max);
  const min = Math.min(...data);
  const minIndex = data.indexOf(min);

  const markPoints: Record<string, unknown>[] = [
    {
      name: '峰值',
      coord: [maxIndex, max],
      value: max,
      itemStyle: { color: 'var(--lp-accent)' },
      label: { show: true, position: 'top', color: 'var(--lp-accent)', fontWeight: 700, fontFamily: 'var(--lp-font-mono)' },
    },
  ];

  if (showTrough) {
    markPoints.push({
      name: '谷值',
      coord: [minIndex, min],
      value: min,
      itemStyle: { color: 'var(--lp-red)' },
      label: { show: true, position: 'bottom', color: 'var(--lp-red)', fontWeight: 700, fontFamily: 'var(--lp-font-mono)' },
    });
  }

  return {
    grid: { top: 56, right: 32, bottom: 60, left: 64, containLabel: false },
    xAxis: {
      type: 'category',
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
    series: [{
      type: 'line',
      data,
      smooth: true,
      symbolSize: 8,
      lineStyle: { width: 4, color: 'var(--lp-accent-2)' },
      itemStyle: { color: 'var(--lp-accent-2)' },
      areaStyle: { opacity: 0.12, color: 'var(--lp-accent-2)' },
      markPoint: { data: markPoints, symbolSize: 48 },
      animationDuration: 900,
    }],
  };
}

export function Theme06ChartPeakV1(props: Theme06ChartPeakV1Props): ReactNode {
  const { kicker, title, subtitle, labels = [], data = [], showTrough = false, unit, showConclusion = true, conclusionValue, conclusionLabel, conclusionDescription, _slideIdx, _editable } = props;

  const normLabels = labels.map((label) => (typeof label === 'string' ? label : (label as { item?: string }).item ?? ''));
  const normData = data.map((value) => (typeof value === 'number' ? value : Number((value as { item?: number }).item ?? 0) || 0));
  const validLabels = normLabels.slice(0, normData.length);
  const validData = normData.slice(0, normLabels.length);
  const hasData = validLabels.length >= 2 && validData.length >= 2;

  return (
    <div className="lp-slide lp-theme06-chart">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chart-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>}
        <div className="lp-theme06-chart-canvas">
          {hasData ? (
            <LpEChart type="line" option={buildOption(validLabels, validData, showTrough)} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入至少 2 组数据
            </div>
          )}
        </div>
      </div>
      <div className="lp-theme06-chart-aside lp-rise">
        {unit && (
          <div className="lp-theme06-card">
            <div className="lp-theme06-card-label">单位</div>
            <div className="lp-theme06-card-value" style={{ fontSize: 'var(--lp-font-size-h3)' }}>{unit}</div>
          </div>
        )}
        {showConclusion && (
          <div className="lp-theme06-conclusion">
            {conclusionValue && <div className="lp-theme06-conclusion-value"><EditableField prop="conclusionValue" slideIdx={_slideIdx} editable={_editable} as="span">{conclusionValue}</EditableField></div>}
            {conclusionLabel && <div className="lp-theme06-conclusion-label"><EditableField prop="conclusionLabel" slideIdx={_slideIdx} editable={_editable} as="span">{conclusionLabel}</EditableField></div>}
            {conclusionDescription && <div className="lp-theme06-conclusion-description"><EditableField prop="conclusionDescription" slideIdx={_slideIdx} editable={_editable} as="span">{conclusionDescription}</EditableField></div>}
          </div>
        )}
      </div>
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
