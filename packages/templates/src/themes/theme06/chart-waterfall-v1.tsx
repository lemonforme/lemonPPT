// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06ChartWaterfallV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  values?: number[];
  unit?: string;
  showConclusion?: boolean;
  conclusionValue?: string;
  conclusionLabel?: string;
  conclusionDescription?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChartWaterfallV1Meta: LayoutMeta = {
  id: 'theme06_chart_waterfall_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 瀑布图',
  description: '瀑布图展示增减构成，适合财务/指标拆解',
  needsMedia: true,
  tags: ['chart', 'waterfall', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06ChartWaterfallV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'WATERFALL' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '利润增减瀑布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从收入到净利润的关键科目拆解' },
    {
      key: 'labels',
      label: '分类标签',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'values',
      label: '增减数值',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '百万元' },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    { key: 'conclusionValue', label: '结论主数值', type: 'text', defaultValue: '+24%' },
    { key: 'conclusionLabel', label: '结论标签', type: 'text', defaultValue: '净利润率' },
    { key: 'conclusionDescription', label: '结论描述', type: 'textarea', defaultValue: '成本控制与毛利率改善共同推动了净利润率提升。' },
  ],
};

function buildOption(labels: string[], values: number[]): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');
  const lastIndex = values.length - 1;

  // Agent Skill 风格：首末柱用 accent，中间柱用 muted 灰，负值用柔和红
  const colorAccent = 'var(--lp-accent)';
  const colorMuted = 'rgba(255,255,255,0.16)';
  const colorMutedRed = 'rgba(232,93,78,0.65)';

  // 计算瀑布图辅助数据
  let cumulative = 0;
  const placeholderData: number[] = [];
  const positiveData: ({ value: number | null; itemStyle: { color: string; borderRadius: number[] } } | null)[] = [];
  const negativeData: ({ value: number | null; itemStyle: { color: string; borderRadius: number[] } } | null)[] = [];

  values.forEach((value, index) => {
    const isFirst = index === 0;
    const isLast = index === lastIndex;
    const isAccent = isFirst || isLast;

    if (isLast) {
      placeholderData.push(0);
      if (value >= 0) {
        positiveData.push({ value, itemStyle: { color: colorAccent, borderRadius: [4, 4, 0, 0] } });
        negativeData.push(null);
      } else {
        positiveData.push(null);
        negativeData.push({ value: Math.abs(value), itemStyle: { color: colorAccent, borderRadius: [0, 0, 4, 4] } });
      }
      return;
    }

    placeholderData.push(cumulative);
    if (value >= 0) {
      positiveData.push({
        value,
        itemStyle: { color: isAccent ? colorAccent : colorMuted, borderRadius: [4, 4, 0, 0] },
      });
      negativeData.push(null);
      cumulative += value;
    } else {
      positiveData.push(null);
      negativeData.push({
        value: Math.abs(value),
        itemStyle: { color: isAccent ? colorAccent : colorMutedRed, borderRadius: [0, 0, 4, 4] },
      });
      cumulative += value;
    }
  });

  const helperSeries = {
    type: 'bar',
    stack: 'waterfall',
    itemStyle: { borderColor: 'transparent', color: 'transparent' },
    emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
    label: { show: false },
    data: placeholderData,
    animationDuration: 600,
  };

  const positiveSeries = {
    type: 'bar',
    stack: 'waterfall',
    label: {
      show: true,
      position: 'top',
      color: 'var(--lp-ink)',
      fontSize: 12,
      fontWeight: 700,
      fontFamily: 'var(--lp-font-mono)',
    },
    data: positiveData,
    animationDuration: 700,
  };

  const negativeSeries = {
    type: 'bar',
    stack: 'waterfall',
    label: {
      show: true,
      position: 'bottom',
      color: 'var(--lp-ink)',
      fontSize: 12,
      fontWeight: 700,
      fontFamily: 'var(--lp-font-mono)',
    },
    data: negativeData,
    animationDuration: 700,
  };

  return {
    grid: { top: 48, right: 24, bottom: 60, left: 64, containLabel: false },
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
        interval: 0,
        rotate: categoryData.length > 8 ? 30 : 0,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [helperSeries, positiveSeries, negativeSeries],
  };
}

export function Theme06ChartWaterfallV1(props: Theme06ChartWaterfallV1Props): ReactNode {
  const { kicker, title, subtitle, labels = [], values = [], unit, showConclusion = true, conclusionValue, conclusionLabel, conclusionDescription, _slideIdx, _editable } = props;

  const normLabels = labels.map((label) => (typeof label === 'string' ? label : (label as { item?: string }).item ?? ''));
  const normValues = values.map((value) => (typeof value === 'number' ? value : Number((value as { item?: number }).item ?? 0) || 0));
  const validLabels = normLabels.slice(0, normValues.length);
  const validValues = normValues.slice(0, normLabels.length);
  const hasData = validLabels.length >= 2 && validValues.length >= 2;

  return (
    <div className="lp-slide lp-theme06-chart">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chart-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>}
        <div className="lp-theme06-chart-canvas">
          {hasData ? (
            <LpEChart type="bar" option={buildOption(validLabels, validValues)} />
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
