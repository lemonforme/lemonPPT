// lemonPPT - theme07 加速页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07WatermarkNumber } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07AccelerateV1Props {
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

export const theme07AccelerateV1Meta: LayoutMeta = {
  id: 'theme07_accelerate_v1',
  theme: 'theme07',
  role: 'metric',
  displayName: 'Theme 07 加速指标',
  description: '居中 Hero 大数字 + 变化徽章',
  needsMedia: true,
  tags: ['metric', 'hero', 'accelerate'],
  contentShape: 'metric',
};

export const theme07AccelerateV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'ACCELERATE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '增长速度提升' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '后期项目融资节奏明显加快' },
    { key: 'value', label: '核心数值', type: 'text', inlineEditable: true, defaultValue: '+47%' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: 'YoY' },
    { key: 'change', label: '变化值', type: 'text', inlineEditable: true, defaultValue: '+12pp' },
    { key: 'changeLabel', label: '变化说明', type: 'text', inlineEditable: true, defaultValue: '较前一年增速提升' },
  ],
};

export function Theme07AccelerateV1(props: Theme07AccelerateV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, value, unit, change, changeLabel, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme07 lp-theme07-metric-hero">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-metric-hero-main lp-rise">
        <Theme07IconChip name="trend" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
        <div className="lp-theme07-metric-hero-value">
          {value}
          {unit && <span className="lp-theme07-metric-hero-unit">{unit}</span>}
        </div>
        {(change || changeLabel) && (
          <div className="lp-theme07-metric-hero-change">
            {change && <span className="lp-theme07-metric-hero-change-value">{change}</span>}
            {changeLabel && <span className="lp-theme07-metric-hero-change-label">{changeLabel}</span>}
          </div>
        )}
      </div>
      <Theme07WatermarkNumber number="02" />
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
