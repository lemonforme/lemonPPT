// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06TrendV1Event {
  label?: string;
}

export interface Theme06TrendV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  unit?: string;
  events?: Theme06TrendV1Event[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06TrendV1Meta: LayoutMeta = {
  id: 'theme06_trend_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 趋势曲线页',
  description: '折线趋势图 + 底部关键事件标注',
  needsMedia: true,
  tags: ['chart', 'line', 'trend', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06TrendV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'TREND' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '市场规模增长趋势' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '过去八个季度保持稳健上升' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'labels',
      label: '分类标签',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: ['2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'],
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [42, 55, 68, 79, 96, 118, 145, 172],
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
    {
      key: 'events',
      label: '关键事件',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [{ label: '产品发布' }, { label: '海外扩张' }, { label: '战略融资' }],
      itemSchema: [{ key: 'label', label: '事件', type: 'text', inlineEditable: true }],
    },
  ],
};

function buildOption(labels: string[], data: number[]): Record<string, unknown> {
  const categoryData = labels.map((label) => label ?? '');
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const topIndex = data.indexOf(max);

  const seriesData = data.map((value, index) => ({
    value,
    itemStyle: {
      color: index === topIndex ? 'var(--lp-accent)' : 'var(--lp-accent)',
      borderWidth: index === topIndex ? 3 : 2,
      borderColor: index === topIndex ? 'var(--lp-ink)' : 'var(--lp-accent)',
    },
    label: {
      show: index === topIndex,
      position: 'top',
      color: 'var(--lp-accent)',
      fontSize: 12,
      fontWeight: 700,
      fontFamily: 'var(--lp-font-mono)',
    },
  }));

  return {
    grid: { top: 40, right: 24, bottom: 52, left: 56, containLabel: false },
    xAxis: {
      type: 'category',
      data: categoryData,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      min: Math.floor(min * 0.9),
      splitLine: { lineStyle: { color: 'var(--lp-divider)', opacity: 0.6 } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    series: [
      {
        type: 'line',
        data: seriesData,
        smooth: true,
        symbolSize: 8,
        lineStyle: { width: 3, color: 'var(--lp-accent)', shadowColor: 'var(--lp-focus-glow)', shadowBlur: 12 },
        areaStyle: { opacity: 0.12, color: 'var(--lp-accent)' },
        animationDuration: 900,
      },
    ],
  };
}

export function Theme06TrendV1(props: Theme06TrendV1Props): ReactNode {
  const { kicker, title, subtitle, labels = [], data = [], unit, events = [], _slideIdx, _editable } = props;

  const normLabels = labels.map((label) => (typeof label === 'string' ? label : (label as { item?: string }).item ?? ''));
  const normData = data.map((value) => (typeof value === 'number' ? value : Number((value as { item?: number }).item ?? 0) || 0));
  const validLabels = normLabels.slice(0, normData.length);
  const validData = normData.slice(0, normLabels.length);
  const hasData = validLabels.length > 0 && validData.length > 0;
  const validEvents = (events || []).filter((e): e is Theme06TrendV1Event => e != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-trend">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-trend-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-trend-body lp-rise">
        <div className="lp-theme06-trend-canvas">
          {hasData ? (
            <LpEChart
              type="line"
              option={buildOption(validLabels, validData)}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入数据
            </div>
          )}
        </div>
        {validEvents.length > 0 && (
          <div className="lp-theme06-trend-events">
            {validEvents.map((event, index) => (
              <div key={index} className="lp-theme06-trend-event">
                <span className="lp-theme06-trend-event-marker" />
                <EditableField prop={`events.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{event.label || ''}</EditableField>
              </div>
            ))}
          </div>
        )}
        {unit && (
          <div className="lp-theme06-trend-unit" style={{ textAlign: 'right', fontSize: 'var(--lp-font-size-caption)', color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' }}>
            单位：{unit}
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
