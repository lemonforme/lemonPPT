// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03FeatureV1Item {
  number?: string;
  title?: string;
  description?: string;
}

export interface Theme03FeatureV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  features?: Theme03FeatureV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03FeatureV1Meta: LayoutMeta = {
  id: 'theme03_feature_v1',
  theme: 'theme03',
  role: 'feature',
  displayName: 'Theme 03 编辑风特性',
  description: '深色代码编辑风特性页，编号卡片 + 标题 + 描述',
  needsMedia: false,
  tags: ['feature', 'highlights', 'cards'],
  contentShape: 'feature-cards',
};

export const theme03FeatureV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '核心能力' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'FEATURES' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '为何选择{{该技术方案}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'features',
      label: '特性列表',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'number', label: '编号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-feature-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03FeatureV1(props: Theme03FeatureV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, features, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validFeatures = (features || []).filter((f) => f != null);

  return (
    <div className="lp-slide lp-theme03-feature-v1">
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

      <div className="lp-theme03-feature-main">
        <div className="lp-theme03-feature-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-feature-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validFeatures.length > 0 && (
          <div className="lp-theme03-feature-grid lp-rise">
            {validFeatures.map((feature, idx) => (
              <div key={idx} className="lp-theme03-feature-card">
                <div className="lp-theme03-feature-card-header">
                  <EditableField prop={`features.${idx}.number`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-feature-card-number">{feature.number ?? String(idx + 1).padStart(2, '0')}</EditableField>
                </div>
                <EditableField prop={`features.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-feature-card-title">{feature.title}</EditableField>
                <EditableField prop={`features.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-feature-card-desc">{feature.description}</EditableField>
              </div>
            ))}
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
