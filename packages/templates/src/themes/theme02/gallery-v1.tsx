// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme02GalleryV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  images?: Array<{ url?: string; caption?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02GalleryV1Meta: LayoutMeta = {
  id: 'theme02_gallery_v1',
  theme: 'theme02',
  role: 'gallery',
  displayName: 'Theme 02 霓虹图集',
  description: '深色背景 + 霓虹边框图片网格展示',
  needsMedia: true,
};

export const theme02GalleryV1Schema: PropsSchema = {
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
      key: 'images',
      label: '图片',
      type: 'array',
      maxItems: 4,
      minItems: 1,
      itemSchema: [
        {
          key: 'url',
          label: '图片',
          type: 'image',
        },
        {
          key: 'caption',
          label: '说明',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
  ],
};

export function Theme02GalleryV1(props: Theme02GalleryV1Props): ReactNode {
  const { kicker, title, subtitle, images = [], _slideIdx, _editable } = props;
  const safeImages = images.slice(0, 4);

  return (
    <div className="lp-slide lp-theme02-gallery-v1">
      <div className="lp-theme02-gallery-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-gallery-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-gallery-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className={`lp-theme02-gallery-grid lp-theme02-gallery-grid--${safeImages.length}`}>
        {safeImages.map((image, index) => (
          <div key={index} className="lp-theme02-gallery-card lp-rise" style={{ animationDelay: `${index * 100}ms` }}>
            <LpEditableImage
              className="lp-theme02-gallery-image"
              src={image.url}
              alt={image.caption || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop={`images.${index}.url`}
              placeholderClassName="lp-theme02-gallery-image-placeholder"
            />
            {image.caption && (
              <EditableField
                prop={`images.${index}.caption`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-theme02-gallery-caption"
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
