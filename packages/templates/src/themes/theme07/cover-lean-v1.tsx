// lemonPPT - theme07 精简封面
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07MiniBars, Theme07WatermarkNumber } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07CoverLeanV1Metric {
  value?: string;
  unit?: string;
  label?: string;
}

export interface Theme07CoverLeanV1Props {
  imageUrl?: string;
  badge?: string;
  title: string;
  subtitle?: string;
  headline?: string;
  metrics?: Theme07CoverLeanV1Metric[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07CoverLeanV1Meta: LayoutMeta = {
  id: 'theme07_cover_lean_v1',
  theme: 'theme07',
  role: 'cover',
  displayName: 'Theme 07 精简封面',
  description: '左侧标题 + 底部指标卡，结构更紧凑',
  needsMedia: true,
  tags: ['cover', 'lean', 'minimal'],
  contentShape: 'cover',
};

export const theme07CoverLeanV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'badge', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RESEARCH BRIEF' },
    { key: 'headline', label: '英文大标题', type: 'text', inlineEditable: true, defaultValue: 'AI INDUSTRY' },
    { key: 'title', label: '主标题', type: 'text', inlineEditable: true, defaultValue: '2026 全球 AI 产业调研报告' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从技术演进看产业格局与战略机会' },
    {
      key: 'metrics',
      label: '底部指标',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { value: '970', unit: '亿美元', label: '全年融资' },
        { value: '97', unit: '笔', label: '大额事件' },
        { value: '+41%', unit: '', label: 'Q4 环比' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '01' },
  ],
};

export function Theme07CoverLeanV1(props: Theme07CoverLeanV1Props): ReactNode {
  const { imageUrl, badge, headline, title, subtitle, metrics = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validMetrics = (metrics || []).filter((m): m is Theme07CoverLeanV1Metric => m != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-cover-lean">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <Theme07WatermarkNumber number="01" />
      <div className="lp-theme07-cover-lean-main lp-rise">
        <Theme07IconChip name="globe" />
        {badge && <div className="lp-theme07-kicker">{badge}</div>}
        {headline && <div className="lp-theme07-cover-lean-headline">{headline}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme07-cover-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validMetrics.length > 0 && (
        <div className="lp-theme07-cover-lean-metrics lp-rise">
          {validMetrics.map((m, i) => (
            <div key={i} className="lp-theme07-card lp-theme07-cover-lean-metric" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-theme07-card-value" style={{ fontSize: 'var(--lp-font-size-h2)' }}>
                <EditableField prop={`metrics.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value || ''}</EditableField>
                {m.unit && <EditableField prop={`metrics.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{m.unit}</EditableField>}
              </div>
              <div className="lp-theme07-card-label">{m.label || ''}</div>
            </div>
          ))}
        </div>
      )}
      <div className="lp-theme07-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme07-footer">
        <span className="lp-theme07-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme07-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme07MiniBars count={22} />
    </div>
  );
}
