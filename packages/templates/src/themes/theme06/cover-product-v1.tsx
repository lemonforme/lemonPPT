// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CoverProductV1Kpi {
  value?: string;
  unit?: string;
  label?: string;
}

export interface Theme06CoverProductV1Props {
  imageUrl?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  hero?: string;
  kpis?: Theme06CoverProductV1Kpi[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CoverProductV1Meta: LayoutMeta = {
  id: 'theme06_cover_product_v1',
  theme: 'theme06',
  role: 'cover',
  displayName: 'Theme 06 产品发布封面',
  description: '居中大标题 + 霓虹徽章 + 底部 KPI 卡片',
  needsMedia: true,
  tags: ['cover', 'product', 'launch', 'atlas'],
  contentShape: 'cover',
};

export const theme06CoverProductV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'badge', label: '徽章', type: 'text', inlineEditable: true, defaultValue: 'PRODUCT LAUNCH' },
    { key: 'hero', label: '主口号', type: 'text', inlineEditable: true, defaultValue: 'Atlas One' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '下一代智能分析平台' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '用 AI 将复杂数据转化为可执行的产业洞察' },
    {
      key: 'kpis',
      label: 'KPI 卡片',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { value: '10x', unit: '', label: '分析效率提升' },
        { value: '85%', unit: '', label: '预测准确率' },
        { value: '3', unit: '周', label: '部署周期' },
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

export function Theme06CoverProductV1(props: Theme06CoverProductV1Props): ReactNode {
  const { badge, title, subtitle, hero, kpis = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validKpis = (kpis || []).filter((k): k is Theme06CoverProductV1Kpi => k != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme06-cover-product">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-cover-product-center lp-rise">
        {badge && <div className="lp-theme06-cover-product-badge">{badge}</div>}
        {hero && (
          <EditableField prop="hero" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme06-cover-product-hero">{hero}</EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-cover-product-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validKpis.length > 0 && (
        <div className="lp-theme06-cover-product-kpis lp-rise">
          {validKpis.map((kpi, index) => (
            <div key={index} className="lp-theme06-cover-product-kpi">
              <div className="lp-theme06-cover-product-kpi-value">
                {kpi.value || ''}{kpi.unit || ''}
              </div>
              <div className="lp-theme06-cover-product-kpi-label">{kpi.label || ''}</div>
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
