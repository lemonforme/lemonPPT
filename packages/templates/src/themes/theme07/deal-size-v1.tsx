// lemonPPT - theme07 交易规模分布页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07DealSizeV1Item {
  name?: string;
  value?: number;
}

export interface Theme07DealSizeV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme07DealSizeV1Item[];
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07DealSizeV1Meta: LayoutMeta = {
  id: 'theme07_deal_size_v1',
  theme: 'theme07',
  role: 'chart',
  displayName: 'Theme 07 交易规模分布',
  description: '玫瑰饼图展示交易规模或轮次分布',
  needsMedia: true,
  tags: ['chart', 'pie', 'size', 'deal'],
  contentShape: 'generic-chart',
};

export const theme07DealSizeV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DEAL SIZE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '交易规模分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '不同规模区间的资金占比' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '拆分项',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [
        { name: '种子 - A 轮', value: 12 },
        { name: 'B - C 轮', value: 28 },
        { name: 'D 轮及以上', value: 35 },
        { name: '并购', value: 18 },
        { name: 'PIPE / 后续', value: 7 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '中后期轮次与并购占据资金主流，早期项目占比收缩。' },
  ],
};

function buildOption(items: Theme07DealSizeV1Item[], unit: string): Record<string, unknown> {
  const validItems = items.filter((i) => i != null && i.name != null);
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border)',
      textStyle: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)' },
      formatter: (params: { name?: string; value?: number; percent?: number }) => `${params.name}<br/><strong>${params.value} ${unit}</strong> (${params.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'middle',
      textStyle: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
    },
    series: [{
      type: 'pie',
      radius: ['30%', '70%'],
      center: ['38%', '50%'],
      roseType: 'area',
      itemStyle: { borderRadius: 6, borderColor: 'var(--lp-bg)', borderWidth: 2 },
      label: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font-mono)', fontSize: 12 },
      data: validItems.map((item, index) => ({
        name: item.name,
        value: item.value ?? 0,
        itemStyle: { color: `var(--lp-series-${(index % 6) + 1})` },
      })),
    }],
  };
}

export function Theme07DealSizeV1(props: Theme07DealSizeV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, unit = '', items = [], conclusion, _slideIdx, _editable } = props;
  const validItems = (items || []).filter((i): i is Theme07DealSizeV1Item => i != null && !!i.name).slice(0, 8);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-chart">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-chart-main lp-rise">
        <Theme07IconChip name="network" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
        <div className="lp-theme07-chart-canvas">
          {validItems.length > 0 ? (
            <LpEChart type="pie" option={buildOption(validItems, unit)} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入数据
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
