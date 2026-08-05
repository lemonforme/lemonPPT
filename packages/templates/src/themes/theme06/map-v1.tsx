// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06MapV1Item {
  name?: string;
  value?: number;
}

export interface Theme06MapV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme06MapV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06MapV1Meta: LayoutMeta = {
  id: 'theme06_map_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 区域分布',
  description: '横向条形图展示不同地区/区域的数值分布',
  needsMedia: true,
  tags: ['chart', 'region', 'bar', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06MapV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'REGION' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资区域分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按融资金额排序的主要地区' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '地区数据',
      type: 'array',
      minItems: 3,
      maxItems: 10,
      defaultValue: [
        { name: '北美', value: 620 },
        { name: '中国', value: 180 },
        { name: '欧洲', value: 95 },
        { name: '亚太其他', value: 48 },
        { name: '中东', value: 18 },
        { name: '拉美', value: 9 },
      ],
      itemSchema: [
        { key: 'name', label: '地区', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
  ],
};

function buildOption(items: Theme06MapV1Item[], unit?: string): Record<string, unknown> {
  const sorted = [...items].filter((it) => it != null && it.name != null).sort((a, b) => (a.value ?? 0) - (b.value ?? 0));
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => `${params[0]?.name}<br>${params[0]?.value} ${unit || ''}`,
    },
    grid: { top: 16, right: 80, bottom: 16, left: 120, containLabel: false },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLabel: { color: 'var(--lp-ink3)', fontSize: 11, formatter: `{value} ${unit || ''}` },
    },
    yAxis: {
      type: 'category',
      data: sorted.map((it) => it.name),
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink)', fontSize: 13, fontWeight: 700 },
    },
    series: [{
      type: 'bar',
      data: sorted.map((it) => ({
        name: it.name,
        value: it.value,
        itemStyle: {
          color: 'var(--lp-accent)',
          borderRadius: [0, 8, 8, 0],
        },
      })),
      barWidth: '55%',
      label: {
        show: true,
        position: 'right',
        color: 'var(--lp-ink)',
        fontSize: 12,
        fontWeight: 700,
        formatter: `{c} ${unit || ''}`,
      },
      animationDuration: 800,
    }],
  };
}

export function Theme06MapV1(props: Theme06MapV1Props): ReactNode {
  const { kicker, title, subtitle, unit, items = [], _slideIdx, _editable } = props;
  const validItems = (items || []).filter((it) => it != null && it.name != null).slice(0, 10);

  return (
    <div className="lp-slide lp-theme06-chart lp-theme06-map">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chart-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        {validItems.length > 0 && (
          <div className="lp-theme06-chart-canvas lp-theme06-map-canvas">
            <LpEChart type="bar" option={buildOption(validItems, unit)} className="lp-theme06-map-echart" />
          </div>
        )}
      </div>

      <div className="lp-theme06-chart-aside lp-theme06-map-aside lp-rise">
        <div className="lp-theme06-card">
          <div className="lp-theme06-card-label">总计</div>
          <div className="lp-theme06-card-value">
            {validItems.reduce((sum, it) => sum + (Number(it.value) || 0), 0)}
            {unit ? <span style={{ fontSize: '0.45em', marginLeft: '0.15em' }}>{unit}</span> : null}
          </div>
        </div>
        <div className="lp-theme06-card">
          <div className="lp-theme06-card-label">主要市场</div>
          <div className="lp-theme06-card-value" style={{ fontSize: 'var(--lp-font-size-h3)' }}>
            {validItems.length > 0 ? validItems.reduce((max, it) => ((it.value ?? 0) > (max.value ?? 0) ? it : max), validItems[0]).name : '-'}
          </div>
        </div>
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
