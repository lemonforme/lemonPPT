// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03FeatureV2Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: Array<{ title?: string; description?: string }>;
  footer?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03FeatureV2Meta: LayoutMeta = {
  id: 'theme03_feature_v2',
  theme: 'theme03',
  role: 'feature',
  displayName: 'Theme 03 编辑风案例与竞争力',
  description: '左侧固定图片区 + 右侧编号要点卡片',
  needsMedia: true,
  tags: ['feature', 'case', 'image'],
  contentShape: 'feature-image-cards',
};

export const theme03FeatureV2Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '核心能力' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'FEATURES' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'VALUE PROPOSITION' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '为何选择 {{AI 编码助手}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'imageUrl', label: '图片', type: 'image' },
    { key: 'imageAlt', label: '图片说明', type: 'text', inlineEditable: true },
    { key: 'items', label: '要点', type: 'array', minItems: 1, maxItems: 5, itemSchema: [{ key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'description', label: '描述', type: 'textarea', inlineEditable: true }] },
    { key: 'footer', label: '底部注释', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03FeatureV2(props: Theme03FeatureV2Props): ReactNode {
  const { tag, tagLabel, topRightMeta, kicker, title, subtitle, imageUrl, imageAlt, items = [], footer, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 5);

  return (
    <div className="lp-slide lp-theme03-feature-v2">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-feature-v2-main">
        <div className="lp-theme03-feature-v2-head lp-rise">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-feature-v2-kicker">{kicker}</EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme03-feature-v2-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-feature-v2-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-feature-v2-body">
          <div className="lp-theme03-feature-v2-image-wrap lp-rise">
            <LpEditableImage
              className="lp-theme03-feature-v2-image"
              src={imageUrl}
              alt={imageAlt || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop="imageUrl"
              placeholderClassName="lp-editable-image-placeholder lp-theme03-feature-v2-image-placeholder"
              placeholderText="点击上传"
            />
          </div>
          <div className="lp-theme03-feature-v2-cards">
            {safeItems.map((item, index) => (
              <div key={index} className="lp-theme03-feature-v2-card lp-rise">
                <div className="lp-theme03-feature-v2-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="lp-theme03-feature-v2-card-body">
                  <EditableField prop={`items.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme03-feature-v2-card-title">{item.title}</EditableField>
                  {item.description && (
                    <EditableField prop={`items.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-feature-v2-card-description">{item.description}</EditableField>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {footer && (
          <div className="lp-theme03-feature-v2-footer lp-rise">
            <EditableField prop="footer" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-feature-v2-footer-text">{footer}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
