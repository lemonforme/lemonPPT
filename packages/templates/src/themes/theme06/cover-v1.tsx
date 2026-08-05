// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme06CoverV1Metric {
  value: string;
  unit?: string;
  label: string;
  accent?: boolean;
}

export interface Theme06CoverV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  metrics?: Theme06CoverV1Metric[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CoverV1Meta: LayoutMeta = {
  id: 'theme06_cover_v1',
  theme: 'theme06',
  role: 'cover',
  displayName: 'Theme 06 图谱封面',
  description: '深色图谱封面：左侧大标题 + 右侧封面图片占位区 + 2×2 数据节点卡 + 底部霓虹装饰线',
  needsMedia: true,
  tags: ['cover', 'atlas', 'data-report'],
  contentShape: 'cover',
};

export const theme06CoverV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'STRATEGY ATLAS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2026 全球 AI 产业投资图谱' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从资本流向看战略格局与关键节点' },
    { key: 'imageUrl', label: '封面图片', type: 'image' },
    {
      key: 'metrics',
      label: '关键指标',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '01' },
  ],
};

export function Theme06CoverV1(props: Theme06CoverV1Props): ReactNode {
  const { tag, title, subtitle, imageUrl, metrics = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme06-cover">
      <div className="lp-theme06-cover-main lp-rise">
        {tag && (
          <div className="lp-theme06-kicker">
            <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme06-cover-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme06-cover-aside lp-rise">
        <div className="lp-theme06-cover-image">
          <LpEditableImage
            prop="imageUrl"
            src={imageUrl}
            slideIdx={_slideIdx}
            editable={_editable}
            className="lp-theme06-cover-image-img"
            placeholderClassName="lp-theme06-cover-image-placeholder"
            placeholderText="点击上传封面主视觉"
          />
        </div>
        {metrics.length > 0 && metrics.map((m, i) => (
          <div key={i} className={`lp-theme06-cover-metric ${m.accent ? 'accent' : ''}`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className="lp-theme06-cover-metric-value">
              <EditableField prop={`metrics.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value}</EditableField>
              {m.unit && <EditableField prop={`metrics.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{m.unit}</EditableField>}
            </div>
            <div className="lp-theme06-cover-metric-label">
              <EditableField prop={`metrics.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label}</EditableField>
            </div>
          </div>
        ))}
      </div>
      <div className="lp-theme06-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        </span>
        <span className="lp-theme06-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
    </div>
  );
}
