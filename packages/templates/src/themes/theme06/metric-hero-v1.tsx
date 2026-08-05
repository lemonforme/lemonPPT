// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06MetricHeroV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  value: string;
  unit?: string;
  change?: string;
  changeLabel?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06MetricHeroV1Meta: LayoutMeta = {
  id: 'theme06_metric_hero_v1',
  theme: 'theme06',
  role: 'metric',
  displayName: 'Theme 06 指标 Hero 大数字',
  description: '全屏居中大数字 + 霓虹变化徽章 + 副标题',
  needsMedia: true,
  tags: ['metric', 'big-number', 'hero'],
  contentShape: 'metric',
};

export const theme06MetricHeroV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CORE METRIC' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度融资总额' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年大额融资事件汇总' },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '970' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'change', label: '变化值', type: 'text', inlineEditable: true, defaultValue: '+38%' },
    { key: 'changeLabel', label: '变化说明', type: 'text', inlineEditable: true, defaultValue: '年度同比增长' },
  ],
};

export function Theme06MetricHeroV1(props: Theme06MetricHeroV1Props): ReactNode {
  const { kicker, title, subtitle, value, unit, change, changeLabel, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme06-metric">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme06-metric-hero lp-rise">
          <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme06-metric-hero-value">{value}</EditableField>
          {unit && <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme06-metric-hero-unit">{unit}</EditableField>}
        </div>
        {(change || changeLabel) && (
          <div className="lp-theme06-metric-hero-change lp-rise" style={{ marginTop: '20px' }}>
            {change && <span className="lp-theme06-pill"><EditableField prop="change" slideIdx={_slideIdx} editable={_editable} as="span">{change}</EditableField></span>}
            {changeLabel && <span style={{ marginLeft: '10px', color: 'var(--lp-ink2)' }}><EditableField prop="changeLabel" slideIdx={_slideIdx} editable={_editable} as="span">{changeLabel}</EditableField></span>}
          </div>
        )}
      </div>
      <div className="lp-theme06-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
