// lemonPPT - theme07 降温/下行趋势页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07CooldownV1Event {
  label?: string;
}

export interface Theme07CooldownV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  data?: number[];
  unit?: string;
  events?: Theme07CooldownV1Event[];
  conclusion?: string;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07CooldownV1Meta: LayoutMeta = {
  id: 'theme07_cooldown_v1',
  theme: 'theme07',
  role: 'chart',
  displayName: 'Theme 07 降温趋势',
  description: '面积折线图展示下行或回调趋势，支持关键事件标注',
  needsMedia: true,
  tags: ['chart', 'line', 'cooldown', 'trend'],
  contentShape: 'generic-chart',
};

export const theme07CooldownV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COOLDOWN' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资热度回落' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '季度节奏放缓与关键触发事件' },
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
    {
      key: 'events',
      label: '关键事件',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [{ label: '利率上调' }, { label: '估值回调' }, { label: 'IPO 窗口收窄' }],
      itemSchema: [{ key: 'label', label: '事件', type: 'text', inlineEditable: true }],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '2024 年下半年融资热度明显回落，宏观利率与估值预期是主要压力源。' },
    { key: 'focusIndex', label: '高亮事件', type: 'slider', min: 0, max: 3, defaultValue: 0 },
  ],
};

function buildOption(labels: string[], data: number[]): Record<string, unknown> {
  return {
    grid: { top: 48, right: 32, bottom: 72, left: 64, containLabel: false },
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
      symbolSize: 6,
      lineStyle: { width: 3, color: 'var(--lp-accent-cool)' },
      itemStyle: { color: 'var(--lp-accent-cool)' },
      areaStyle: { opacity: 0.14, color: 'var(--lp-accent-cool)' },
      animationDuration: 900,
    }],
  };
}

export function Theme07CooldownV1(props: Theme07CooldownV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, labels = [], data = [], unit, events = [], conclusion, focusIndex = 0, _slideIdx, _editable } = props;
  const normLabels = labels.map((label) => (typeof label === 'string' ? label : (label as { item?: string }).item ?? ''));
  const normData = data.map((value) => (typeof value === 'number' ? value : Number((value as { item?: number }).item ?? 0) || 0));
  const validLabels = normLabels.slice(0, normData.length);
  const validData = normData.slice(0, normLabels.length);
  const hasData = validLabels.length >= 2 && validData.length >= 2;
  const validEvents = events.filter((e): e is Theme07CooldownV1Event => e != null && !!e.label).slice(0, 4);

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
        {validEvents.length > 0 && (
          <div className="lp-theme07-trend-events">
            {validEvents.map((event, index) => (
              <div key={index} className={`lp-theme07-trend-event ${index === focusIndex ? 'lp-focus' : ''}`}>
                <span className="lp-theme07-trend-event-marker" />
                <EditableField prop={`events.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{event.label}</EditableField>
                {index === focusIndex && <span className="lp-focus-lens" aria-hidden="true" />}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="lp-theme07-chart-aside lp-rise">
        {unit && (
          <div className="lp-theme07-card">
            <div className="lp-theme07-card-label">单位</div>
            <div className="lp-theme07-card-value" style={{ fontSize: 'var(--lp-font-size-h3)' }}>{unit}</div>
          </div>
        )}
        {conclusion && (
          <div className="lp-theme07-conclusion">
            <div className="lp-theme07-conclusion-desc"><EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion}</EditableField></div>
          </div>
        )}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
