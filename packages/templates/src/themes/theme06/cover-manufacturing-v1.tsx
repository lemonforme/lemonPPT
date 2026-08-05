// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CoverManufacturingV1Metric {
  value?: string;
  unit?: string;
  label?: string;
}

export interface Theme06CoverManufacturingV1Props {
  imageUrl?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  headline?: string;
  metrics?: Theme06CoverManufacturingV1Metric[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CoverManufacturingV1Meta: LayoutMeta = {
  id: 'theme06_cover_manufacturing_v1',
  theme: 'theme06',
  role: 'cover',
  displayName: 'Theme 06 精益智造封面',
  description: '左侧大标题 + 右侧智能制造指标卡片',
  needsMedia: true,
  tags: ['cover', 'manufacturing', 'lean', 'atlas'],
  contentShape: 'cover',
};

export const theme06CoverManufacturingV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'badge', label: '徽章', type: 'text', inlineEditable: true, defaultValue: 'LEAN MFG' },
    { key: 'headline', label: '主口号', type: 'text', inlineEditable: true, defaultValue: '精益智造 · 数字工厂' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '下一代智能制造解决方案' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '以数据驱动生产流程优化，实现降本增效与柔性交付' },
    {
      key: 'metrics',
      label: '指标卡片',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { value: '42%', unit: '', label: '生产损耗降低' },
        { value: '3x', unit: '', label: '设备综合效率提升' },
        { value: '99.2%', unit: '', label: '订单准时交付率' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '左下角脚注', type: 'text', inlineEditable: true, defaultValue: 'CONFIDENTIAL' },
    { key: 'footnoteRight', label: '右下角脚注', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme06CoverManufacturingV1(props: Theme06CoverManufacturingV1Props): ReactNode {
  const { badge, title, subtitle, headline, metrics = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validMetrics = (metrics || []).filter((m): m is Theme06CoverManufacturingV1Metric => m != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme06-cover-manufacturing">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-cover-manufacturing-main lp-rise">
        {badge && <div className="lp-theme06-cover-manufacturing-badge">{badge}</div>}
        {headline && (
          <EditableField prop="headline" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme06-cover-manufacturing-headline">{headline}</EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-cover-manufacturing-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-cover-manufacturing-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validMetrics.length > 0 && (
        <div className="lp-theme06-cover-manufacturing-metrics lp-rise">
          {validMetrics.map((metric, index) => (
            <div key={index} className="lp-theme06-cover-manufacturing-metric">
              <div className="lp-theme06-cover-manufacturing-metric-value">
                {metric.value || ''}{metric.unit || ''}
              </div>
              <div className="lp-theme06-cover-manufacturing-metric-label">{metric.label || ''}</div>
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left">{footnoteLeft || ''}</span>
        <span className="lp-theme06-footer-right">{footnoteRight || ''}</span>
      </div>
    </div>
  );
}
