// lemonPPT - theme07 峰值分析页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07PeakV1Props {
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

export const theme07PeakV1Meta: LayoutMeta = {
  id: 'theme07_peak_v1',
  theme: 'theme07',
  role: 'chart',
  displayName: 'Theme 07 峰值分析',
  description: '折线图峰值标注，适合趋势转折点分析',
  needsMedia: true,
  tags: ['chart', 'line', 'peak', 'trend'],
  contentShape: 'generic-chart',
};

export const theme07PeakV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'PEAK' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '全年融资峰值' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '识别关键月份的高点与驱动因素' },
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
    { key: 'conclusionValue', label: '结论主数值', type: 'text', defaultValue: 'Q4' },
    { key: 'conclusionLabel', label: '结论标签', type: 'text', defaultValue: '峰值季度' },
    { key: 'conclusionDescription', label: '结论描述', type: 'textarea', defaultValue: 'Q4 融资额达到全年最高点，主要由大额后期项目驱动。' },
  ],
};

function buildOption(labels: string[], data: number[]): Record<string, unknown> {
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
      areaStyle: { opacity: 0.1, color: 'var(--lp-accent)' },
      markPoint: {
        data: [{ type: 'max', name: '峰值', label: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font-mono)', fontSize: 10 } }],
        symbolSize: 44,
        itemStyle: { color: 'var(--lp-accent-2)' },
      },
      animationDuration: 900,
    }],
  };
}

export function Theme07PeakV1(props: Theme07PeakV1Props): ReactNode {
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
