// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06SizeSplitV1Item {
  name?: string;
  value?: number;
}

export interface Theme06SizeSplitV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme06SizeSplitV1Item[];
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06SizeSplitV1Meta: LayoutMeta = {
  id: 'theme06_size_split_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 规模拆分',
  description: '玫瑰饼图展示规模结构或份额拆分',
  needsMedia: true,
  tags: ['size', 'split', 'pie', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06SizeSplitV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SIZE SPLIT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '融资规模分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '不同轮次/规模区间的资金占比' },
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

function buildOption(items: Theme06SizeSplitV1Item[], unit: string): Record<string, unknown> {
  const validItems = items.filter((i) => i != null && i.name != null);
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border-strong)',
      textStyle: { color: 'var(--lp-ink)' },
      formatter: (params: { name?: string; value?: number; percent?: number }) => `${params.name}<br/><strong>${params.value} ${unit}</strong> (${params.percent}%)`,
    },
    legend: {
      orient: 'vertical',
      right: 0,
      top: 'middle',
      textStyle: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
    },
    series: [
      {
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
      },
    ],
  };
}

export function Theme06SizeSplitV1(props: Theme06SizeSplitV1Props): ReactNode {
  const { kicker, title, subtitle, unit = '', items = [], conclusion, _slideIdx, _editable } = props;
  const validItems = (items || []).filter((i): i is Theme06SizeSplitV1Item => i != null && !!i.name).slice(0, 8);

  return (
    <div className="lp-slide lp-theme06-size-split">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-size-split-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-size-split-body lp-rise">
        <div className="lp-theme06-size-split-canvas">
          {validItems.length > 0 && <LpEChart type="pie" option={buildOption(validItems, unit)} />}
        </div>
        {conclusion && (
          <div className="lp-theme06-size-split-conclusion">
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
