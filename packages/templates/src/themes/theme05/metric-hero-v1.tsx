// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05MetricHeroV1Props {
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

export const theme05MetricHeroV1Meta: LayoutMeta = {
  id: 'theme05_metric_hero_v1',
  theme: 'theme05',
  role: 'metric',
  displayName: 'Theme 05 指标 Hero 大数字',
  description: '全屏居中大数字 + 变化标签 + 副标题',
  needsMedia: false,
  tags: ['metric', 'big-number', 'hero'],
  contentShape: 'metric',
};

export const theme05MetricHeroV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CORE METRIC' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度融资总额' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年大额融资事件汇总' },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '970' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'change', label: '变化值', type: 'text', inlineEditable: true, defaultValue: '+38%' },
    { key: 'changeLabel', label: '变化说明', type: 'text', inlineEditable: true, defaultValue: '年度同比增长' },
  ],
};

export function Theme05MetricHeroV1(props: Theme05MetricHeroV1Props): ReactNode {
  const { kicker, title, subtitle, value, unit, change, changeLabel, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-metric-hero">
      <div className="lp-theme05-metric-hero-content lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-metric-hero-value-wrap lp-rise">
          <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme05-metric-hero-value">{value}</EditableField>
          {unit && <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme05-metric-hero-unit">{unit}</EditableField>}
        </div>
        {(change || changeLabel) && (
          <div className="lp-theme05-metric-hero-change lp-rise">
            {change && <span className="lp-theme05-metric-hero-change-value"><EditableField prop="change" slideIdx={_slideIdx} editable={_editable} as="span">{change}</EditableField></span>}
            {changeLabel && <span className="lp-theme05-metric-hero-change-label"><EditableField prop="changeLabel" slideIdx={_slideIdx} editable={_editable} as="span">{changeLabel}</EditableField></span>}
          </div>
        )}
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
