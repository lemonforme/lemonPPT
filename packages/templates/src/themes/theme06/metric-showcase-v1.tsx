// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06MetricShowcaseV1Supporting {
  value?: string;
  label?: string;
}

export interface Theme06MetricShowcaseV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  value: string;
  unit?: string;
  change?: string;
  changeLabel?: string;
  supporting?: Theme06MetricShowcaseV1Supporting[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06MetricShowcaseV1Meta: LayoutMeta = {
  id: 'theme06_metric_showcase_v1',
  theme: 'theme06',
  role: 'metric',
  displayName: 'Theme 06 大数字展示',
  description: '中央超大数字页，适合展示核心里程碑或关键指标',
  needsMedia: true,
  tags: ['metric', 'showcase', 'big-number', 'atlas'],
  contentShape: 'metric',
};

export const theme06MetricShowcaseV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'KEY METRIC' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度活跃用户突破' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '平台在过去 12 个月内实现显著增长' },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '10M' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '用户' },
    { key: 'change', label: '变化值', type: 'text', inlineEditable: true, defaultValue: '+142%' },
    { key: 'changeLabel', label: '变化说明', type: 'text', inlineEditable: true, defaultValue: '同比增长' },
    {
      key: 'supporting',
      label: '支撑指标',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '4.8x', label: '周活跃度' },
        { value: '68%', label: '付费转化' },
        { value: '92%', label: '留存率' },
        { value: '127', label: '覆盖国家' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06MetricShowcaseV1(props: Theme06MetricShowcaseV1Props): ReactNode {
  const { kicker, title, subtitle, value, unit, change, changeLabel, supporting = [], _slideIdx, _editable } = props;
  const validSupporting = (supporting || []).filter((s): s is Theme06MetricShowcaseV1Supporting => s != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-metric-showcase">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-metric-showcase-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-metric-showcase-body lp-rise">
        <div className="lp-theme06-metric-showcase-center">
          <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-metric-showcase-value">{value}</EditableField>
          {unit && <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-metric-showcase-unit">{unit}</EditableField>}
          {change && (
            <div className="lp-theme06-metric-showcase-badge">
              {change}
              {changeLabel && <span> · {changeLabel}</span>}
            </div>
          )}
        </div>

        <div className="lp-theme06-metric-showcase-supporting">
          {validSupporting.map((item, index) => (
            <div key={index} className="lp-theme06-metric-showcase-card">
              <div className="lp-theme06-metric-showcase-card-value">{item.value || ''}</div>
              <div className="lp-theme06-metric-showcase-card-label">{item.label || ''}</div>
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
