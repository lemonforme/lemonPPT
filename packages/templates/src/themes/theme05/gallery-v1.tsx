// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme05GalleryV1Item {
  caption?: string;
  imageUrl?: string;
}

export interface Theme05GalleryV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme05GalleryV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05GalleryV1Meta: LayoutMeta = {
  id: 'theme05_gallery_v1',
  theme: 'theme05',
  role: 'image',
  displayName: 'Theme 05 图片画廊',
  description: '3-4 张图片横向排列的画廊，每张图片下方可编辑说明',
  needsMedia: true,
  tags: ['image', 'gallery', 'spectrum'],
  contentShape: 'image-gallery',
};

export const theme05GalleryV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GALLERY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '项目现场一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '用一组高清图片直观呈现关键场景。' },
    {
      key: 'items',
      label: '图片',
      type: 'array',
      minItems: 3,
      maxItems: 4,
      defaultValue: [
        { caption: '方案设计' },
        { caption: '实施过程' },
        { caption: '交付成果' },
      ],
      itemSchema: [
        { key: 'imageUrl', label: '图片', type: 'image' },
        { key: 'caption', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme05GalleryV1(props: Theme05GalleryV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;
  const safeItems = (items || []).filter((item): item is Theme05GalleryV1Item => item != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme05-gallery">
      <div className="lp-theme05-gallery-head lp-rise">
        {kicker && (
          <div className="lp-theme05-kicker">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">
          {title}
        </EditableField>
        <div className="lp-theme05-underline" />
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">
            {subtitle}
          </EditableField>
        )}
      </div>

      {safeItems.length > 0 && (
        <div className="lp-theme05-gallery-grid lp-rise">
          {safeItems.map((item, index) => (
            <div
              key={index}
              className="lp-theme05-gallery-card lp-theme05-card"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="lp-theme05-gallery-image-wrap">
                <LpEditableImage
                  src={item.imageUrl}
                  prop={`items.${index}.imageUrl`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  alt={item.caption || ''}
                  placeholderClassName="lp-theme05-gallery-image-placeholder"
                  placeholderText="点击上传图片"
                />
              </div>
              {item.caption && (
                <EditableField
                  prop={`items.${index}.caption`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-theme05-gallery-caption"
                >
                  {item.caption}
                </EditableField>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
