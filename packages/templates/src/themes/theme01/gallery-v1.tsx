// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme01GalleryV1Props {
  kicker?: string;
  title?: string;
  images?: Array<{ url?: string; caption?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01GalleryV1Meta: LayoutMeta = {
  id: 'theme01_gallery_v1',
  theme: 'theme01',
  role: 'gallery',
  displayName: 'Theme 01 图片掠影',
  description: '杂志风格图片网格展示',
  needsMedia: true,
};

export const theme01GalleryV1Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'images',
      label: '图片',
      type: 'array',
      maxItems: 4,
      minItems: 1,
      itemSchema: [
    {
          key: 'url',
          label: '链接',
          type: 'image',
          inlineEditable: true
    },
    {
          key: 'caption',
          label: '说明',
          type: 'text',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01GalleryV1(props: Theme01GalleryV1Props): ReactNode {
  const { kicker, title, images = [], _slideIdx, _editable } = props;
  const safeImages = images.slice(0, 4);

  return (
  <div className="lp-slide lp-gallery-v1">
      <div className="lp-gallery-v1-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-gallery-v1-title lp-rise">
      {title}
          </EditableField>
    )}
      </div>
      <div className="lp-gallery-v1-grid">
    {safeImages.map((image, index) => (
          <div key={index} className="lp-card lp-gallery-v1-card lp-rise">
      <LpEditableImage
              className="lp-gallery-v1-image"
              src={image.url}
              alt={image.caption || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop={`images.${index}.url`}
              placeholderClassName="lp-gallery-v1-image-placeholder"
            />
      {image.caption && (
              <EditableField
        prop={`images.${index}.caption`}
        slideIdx={_slideIdx}
        editable={_editable}
        as="div"
        className="lp-gallery-v1-caption"
              >
        {image.caption}
              </EditableField>
      )}
          </div>
    ))}
      </div>
  </div>
  );
}
