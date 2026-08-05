// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06GeoDistributionV1Item {
  name: string;
  value: number;
}

export interface Theme06GeoDistributionV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme06GeoDistributionV1Item[];
  totalLabel?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06GeoDistributionV1Meta: LayoutMeta = {
  id: 'theme06_geo_distribution_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 地理分布',
  description: '城市/区域分布横向条形图',
  needsMedia: true,
  tags: ['geo', 'distribution', 'chart', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06GeoDistributionV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GEO DISTRIBUTION' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 创业公司地理分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '头部城市集中了超过七成的融资事件与人才储备' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '家公司' },
    {
      key: 'items',
      label: '数据项',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [
        { name: 'San Francisco Bay Area', value: 420 },
        { name: 'New York', value: 185 },
        { name: 'Seattle', value: 96 },
        { name: 'Boston', value: 78 },
        { name: 'Los Angeles', value: 64 },
        { name: 'Austin', value: 58 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'totalLabel', label: '总计标签', type: 'text', inlineEditable: true, defaultValue: '总计' },
  ],
};

function buildOption(items: Theme06GeoDistributionV1Item[], unit: string): Record<string, unknown> {
  const sorted = [...items].sort((a, b) => a.value - b.value);
  const names = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value);

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border-strong)',
      textStyle: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)' },
      formatter: (params: Array<{ name?: string; value?: number }>) => {
        const p = params[0];
        return `${p.name}<br/><strong>${p.value} ${unit}</strong>`;
      },
    },
    grid: { top: 16, right: 32, bottom: 16, left: 16, containLabel: true },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'var(--lp-divider)', type: 'dashed' } },
      axisLabel: { color: 'var(--lp-ink3)', fontFamily: 'var(--lp-font-mono)' },
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      axisTick: { show: false },
      axisLabel: { color: 'var(--lp-ink2)', fontWeight: 600, fontFamily: 'var(--lp-font)' },
    },
    series: [
      {
        type: 'bar',
        data: values,
        barWidth: 18,
        itemStyle: {
          color: 'var(--lp-accent)',
          borderRadius: [0, 4, 4, 0],
        },
        emphasis: {
          itemStyle: {
            color: 'var(--lp-accent-2)',
            shadowBlur: 12,
            shadowColor: 'var(--lp-accent)',
          },
        },
        label: {
          show: true,
          position: 'right',
          color: 'var(--lp-ink)',
          fontFamily: 'var(--lp-font-mono)',
          fontWeight: 700,
        },
        animationDuration: 800,
      },
    ],
  };
}

export function Theme06GeoDistributionV1(props: Theme06GeoDistributionV1Props): ReactNode {
  const { kicker, title, subtitle, unit = '', items = [], totalLabel = '总计', _slideIdx, _editable } = props;
  const validItems = (items || []).filter((item): item is Theme06GeoDistributionV1Item => item != null && !!item.name).slice(0, 8);
  const total = validItems.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

  return (
    <div className="lp-slide lp-theme06-geo-distribution">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-geo-distribution-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-geo-distribution-body lp-rise">
        <div className="lp-theme06-geo-distribution-main">
          <div className="lp-theme06-geo-distribution-canvas">
            <LpEChart type="bar" option={buildOption(validItems, unit)} />
          </div>
        </div>
        <div className="lp-theme06-geo-distribution-aside">
          <div className="lp-theme06-geo-distribution-total">
            <div className="lp-theme06-geo-distribution-total-value">{total}</div>
            <div className="lp-theme06-geo-distribution-total-label">{totalLabel} {unit}</div>
          </div>
          {validItems.slice(0, 5).map((item, index) => (
            <div key={index} className="lp-theme06-geo-distribution-market">
              <span className="lp-theme06-geo-distribution-market-name">{item.name}</span>
              <span className="lp-theme06-geo-distribution-market-value">{item.value}</span>
            </div>
          ))}
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
