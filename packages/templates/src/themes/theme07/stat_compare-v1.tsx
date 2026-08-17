// lemonPPT - theme07 数字对比版式
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07StatCompareV1Side {
  value?: string;
  unit?: string;
  label?: string;
}

export interface Theme07StatCompareV1Props {
  imageUrl?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  left?: Theme07StatCompareV1Side;
  right?: Theme07StatCompareV1Side;
  delta?: string;
  deltaLabel?: string;
  caption?: string;
  showDelta?: boolean;
  showAxis?: boolean;
  focusSide?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07StatCompareV1Meta: LayoutMeta = {
  id: 'theme07_stat_compare_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 数字对比',
  description: '左右两个巨号数字对峙，中间以差值徽标衔接，用于前后期或两方案的量级对照',
  needsMedia: true,
  tags: ['stat', 'big-number', 'compare', 'contrast'],
  contentShape: 'stat',
};

export const theme07StatCompareV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COMPARE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '两年之间的量级跃迁' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '同口径统计下，头部厂商年度算力支出的前后对比' },
    {
      key: 'left',
      label: '左侧数字',
      type: 'object',
      defaultValue: { value: '312', unit: '亿美元', label: '2024 年算力支出' },
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    {
      key: 'right',
      label: '右侧数字',
      type: 'object',
      defaultValue: { value: '806', unit: '亿美元', label: '2026 年算力支出' },
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'delta', label: '差值', type: 'text', inlineEditable: true, defaultValue: '+158%' },
    { key: 'deltaLabel', label: '差值说明', type: 'text', inlineEditable: true, defaultValue: '两年累计增幅' },
    { key: 'caption', label: '结论文案', type: 'textarea', inlineEditable: true, defaultValue: '支出增速显著快于收入增速，是毛利率承压的直接来源。' },
    { key: 'showDelta', label: '显示差值徽标', type: 'boolean', defaultValue: true },
    { key: 'showAxis', label: '显示中轴', type: 'boolean', defaultValue: true },
    {
      key: 'focusSide',
      label: '高亮一侧',
      type: 'select',
      options: [
        { value: 'none', label: '不高亮' },
        { value: 'left', label: '左侧' },
        { value: 'right', label: '右侧' },
      ],
      defaultValue: 'right',
    },
  ],
};

function CompareSide(sideProps: {
  side: 'left' | 'right';
  data: Theme07StatCompareV1Side;
  focus: boolean;
  slideIdx?: number;
  editable?: boolean;
}): ReactNode {
  const { side, data, focus, slideIdx, editable } = sideProps;
  return (
    <div className={`lp-theme07-card lp-theme07-stat-compare-side lp-theme07-stat-compare-side--${side} ${focus ? 'is-focus' : ''}`}>
      <div className="lp-theme07-stat-compare-value">
        <EditableField prop={`${side}.value`} slideIdx={slideIdx} editable={editable} as="span" className="lp-theme07-big-number-value">{data.value || '0'}</EditableField>
        {data.unit && (
          <EditableField prop={`${side}.unit`} slideIdx={slideIdx} editable={editable} as="span" className="lp-theme07-big-number-unit">{data.unit}</EditableField>
        )}
      </div>
      {data.label && (
        <EditableField prop={`${side}.label`} slideIdx={slideIdx} editable={editable} as="div" className="lp-theme07-stat-compare-label">{data.label}</EditableField>
      )}
    </div>
  );
}

export function Theme07StatCompareV1(props: Theme07StatCompareV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    left,
    right,
    delta,
    deltaLabel,
    caption,
    showDelta = true,
    showAxis = true,
    focusSide = 'right',
    _slideIdx,
    _editable,
  } = props;

  const leftData: Theme07StatCompareV1Side = left ?? {};
  const rightData: Theme07StatCompareV1Side = right ?? {};

  return (
    <div className="lp-slide lp-theme07 lp-theme07-stat-compare">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-stat-compare-header lp-rise">
        <Theme07IconChip name="scale" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        {title && <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>}
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      <div className={`lp-theme07-stat-compare-body lp-rise ${showAxis ? 'has-axis' : ''}`}>
        <CompareSide side="left" data={leftData} focus={focusSide === 'left'} slideIdx={_slideIdx} editable={_editable} />
        {showDelta && delta && (
          <div className="lp-theme07-stat-compare-delta">
            <EditableField prop="delta" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-stat-compare-delta-value">{delta}</EditableField>
            {deltaLabel && (
              <EditableField prop="deltaLabel" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-stat-compare-delta-label">{deltaLabel}</EditableField>
            )}
          </div>
        )}
        <CompareSide side="right" data={rightData} focus={focusSide === 'right'} slideIdx={_slideIdx} editable={_editable} />
      </div>
      {caption && (
        <div className="lp-theme07-stat-compare-caption">
          <EditableField prop="caption" slideIdx={_slideIdx} editable={_editable} as="span">{caption}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
