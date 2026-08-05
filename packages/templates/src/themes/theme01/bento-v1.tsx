// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme01BentoV1Props {
  kicker?: string;
  title?: string;
  items?: Array<{
    title: string;
    description?: string;
    span?: 'small' | 'medium' | 'large';
    imageUrl?: string;
  }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01BentoV1Meta: LayoutMeta = {
  id: 'theme01_bento_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 Bento 网格',
  description: '大小不一的玻璃卡片 Bento 布局',
  needsMedia: true,
};

export const theme01BentoV1Schema: PropsSchema = {
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
      key: 'items',
      label: '目录项',
      type: 'array',
      maxItems: 4,
      minItems: 2,
      itemSchema: [
        {
          key: 'imageUrl',
          label: '图片',
          type: 'image',
          inlineEditable: true,
        },
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
        {
          key: 'span',
          label: '跨度',
          type: 'select',
          options: [
            { label: '小', value: 'small' },
            { label: '中', value: 'medium' },
            { label: '大', value: 'large' },
          ],
          inlineEditable: true,
        },
      ],
    },
  ],
};

export function Theme01BentoV1(props: Theme01BentoV1Props): ReactNode {
  const { kicker, title, items = [], _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 4);

  return (
    <div className="lp-slide lp-bento-v1">
      <div className="lp-bento-v1-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-bento-v1-title lp-rise">
            {title}
          </EditableField>
        )}
      </div>
      <div className="lp-bento-v1-grid">
        {safeItems.map((item, index) => (
          <div
            key={index}
            className={`lp-card lp-bento-v1-card lp-bento-v1-card--${item.span ?? 'medium'} lp-rise`}
          >
            <LpEditableImage
              className="lp-bento-v1-image"
              src={item.imageUrl}
              alt={item.title || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop={`items.${index}.imageUrl`}
              placeholderClassName="lp-bento-v1-image-placeholder"
            />
            <div className="lp-bento-v1-card-body">
              <EditableField
                prop={`items.${index}.title`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="h3"
                className="lp-bento-v1-card-title"
              >
                {item.title}
              </EditableField>
              {item.description && (
                <EditableField
                  prop={`items.${index}.description`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="p"
                  className="lp-bento-v1-card-description"
                >
                  {item.description}
                </EditableField>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
