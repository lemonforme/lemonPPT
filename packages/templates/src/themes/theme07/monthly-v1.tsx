// lemonPPT - theme07 月度趋势页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07MonthlyV1Series {
  name: string;
  data: number[];
}

export interface Theme07MonthlyV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  series?: Theme07MonthlyV1Series[];
  unit?: string;
  showConclusion?: boolean;
  conclusionValue?: string;
  conclusionLabel?: string;
  conclusionDescription?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07MonthlyV1Meta: LayoutMeta = {
  id: 'theme07_monthly_v1',
  theme: 'theme07',
  role: 'chart',
  displayName: 'Theme 07 月度趋势',
  description: '时间序列折线图，支持多系列对比，适合月度/季度趋势展示',
  needsMedia: true,
  tags: ['chart', 'line', 'trend', 'monthly'],
  contentShape: 'generic-chart',
};

export const theme07MonthlyV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'MONTHLY TREND' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '月度融资额趋势' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年 12 个月融资节奏与峰值分布' },
    {
      key: 'labels',
      label: '时间标签',
      type: 'array',
      minItems: 2,
      maxItems: 24,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'series',
      label: '数据系列',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      itemSchema: [
        { key: 'name', label: '系列名', type: 'text', inlineEditable: true },
        {
          key: 'data',
          label: '数据',
          type: 'array',
          itemSchema: [{ key: 'item', label: '值', type: 'number', inlineEditable: true }],
        },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    { key: 'conclusionValue', label: '结论主数值', type: 'text', defaultValue: '+41%' },
    { key: 'conclusionLabel', label: '结论标签', type: 'text', defaultValue: 'Q4 环比增长' },
    { key: 'conclusionDescription', label: '结论描述', type: 'textarea', defaultValue: '年末大额交易集中落地，推动 Q4 融资额达到全年峰值。' },
  ],
};

function buildOption(labels: string[], series: Theme07MonthlyV1Series[], unit: string): Record<string, unknown> {
  const palette = ['var(--lp-accent)', 'var(--lp-accent-2)', 'var(--lp-accent-cool)', 'var(--lp-blue)'];

  return {
    grid: { top: 48, right: 32, bottom: 64, left: 64, containLabel: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border)',
      textStyle: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)' },
    },
    legend: {
      data: series.map((s) => s.name),
      top: 8,
      right: 0,
      textStyle: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)', fontSize: 12 },
      itemWidth: 16,
      itemHeight: 10,
    },
    xAxis: {
      type: 'category',
      data: labels.map((label) => label ?? ''),
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontFamily: 'var(--lp-font)',
        interval: 0,
        rotate: labels.length > 12 ? 30 : 0,
      },
    },
    yAxis: {
      type: 'value',
      name: unit,
      nameTextStyle: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)', padding: [0, 0, 0, -40] },
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: series.map((s, index) => ({
      name: s.name,
      type: 'line',
      data: s.data,
      smooth: true,
      symbolSize: 8,
      lineStyle: { width: 3, color: palette[index % palette.length] },
      itemStyle: { color: palette[index % palette.length] },
      areaStyle: index === 0 ? { opacity: 0.08, color: palette[0] } : undefined,
      markPoint: {
        data: [
          { type: 'max', name: '峰值', label: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font-mono)', fontSize: 10 } },
        ],
        symbolSize: 40,
        itemStyle: { color: palette[index % palette.length] },
      },
      animationDuration: 900,
    })),
  };
}

export function Theme07MonthlyV1(props: Theme07MonthlyV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, labels = [], series = [], unit, showConclusion = true, conclusionValue, conclusionLabel, conclusionDescription, _slideIdx, _editable } = props;

  const normLabels = labels.map((label) => (typeof label === 'string' ? label : (label as { item?: string }).item ?? ''));
  const normSeries = (series || []).map((s, i) => {
    const name = typeof s?.name === 'string' ? s.name : `系列 ${i + 1}`;
    const data = (s?.data || []).map((v) => (typeof v === 'number' ? v : Number((v as { item?: number }).item ?? 0) || 0));
    return { name, data };
  });
  const hasData = normLabels.length >= 2 && normSeries.length > 0 && normSeries.some((s) => s.data.length > 0);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-chart">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-chart-main lp-rise">
        <Theme07IconChip name="chart" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme07-chart-canvas">
          {hasData ? (
            <LpEChart type="line" option={buildOption(normLabels, normSeries, unit ?? '')} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入时间标签与数据系列
            </div>
          )}
        </div>
      </div>
      <div className="lp-theme07-chart-aside lp-rise">
        {unit && (
          <div className="lp-theme07-card">
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
