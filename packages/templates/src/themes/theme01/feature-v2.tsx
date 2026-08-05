// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme01FeatureV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  items?: Array<{ title?: string; description?: string }>;
  footer?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01FeatureV2Meta: LayoutMeta = {
  id: 'theme01_feature_v2',
  theme: 'theme01',
  role: 'feature',
  displayName: 'Theme 01 案例与竞争力',
  description: '左侧固定图片区 + 右侧编号要点卡片',
  needsMedia: true,
};

export const theme01FeatureV2Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'imageUrl',
      label: '图片',
      type: 'image',
    },
    {
      key: 'imageAlt',
      label: '图片说明',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'items',
      label: '要点',
      type: 'array',
      minItems: 1,
      maxItems: 5,
      itemSchema: [
        {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'description',
          label: '描述',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'footer',
      label: '底部注释',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01FeatureV2(props: Theme01FeatureV2Props): ReactNode {
  const { kicker, title, subtitle, imageUrl, imageAlt, items = [], footer, _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 5);

  return (
    <div className="lp-slide lp-feature-v2">
      <div className="lp-feature-v2-header lp-rise">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-feature-v2-title">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-feature-v2-subtitle">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-feature-v2-body">
        <div className="lp-feature-v2-image-wrap lp-rise">
          <LpEditableImage
            className="lp-feature-v2-image"
            src={imageUrl}
            alt={imageAlt || ''}
            slideIdx={_slideIdx}
            editable={_editable}
            prop="imageUrl"
            placeholderClassName="lp-feature-v2-image-placeholder"
            placeholderText="点击上传"
          />
        </div>
        <div className="lp-feature-v2-cards">
          {safeItems.map((item, index) => (
            <div key={index} className="lp-card lp-feature-v2-card lp-rise">
              <div className="lp-feature-v2-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="lp-feature-v2-card-body">
                <EditableField
                  prop={`items.${index}.title`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-feature-v2-card-title"
                >
                  {item.title}
                </EditableField>
                {item.description && (
                  <EditableField
                    prop={`items.${index}.description`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="p"
                    className="lp-feature-v2-card-description"
                  >
                    {item.description}
                  </EditableField>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {footer && (
        <div className="lp-feature-v2-footer lp-rise">
          <EditableField prop="footer" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-feature-v2-footer-text">
            {footer}
          </EditableField>
        </div>
      )}
    </div>
  );
}
