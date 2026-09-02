// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  Masthead,
  Plus,
  Sheet,
} from './shared.js';

export interface Theme01GalleryV1Props {
  kicker?: string;
  title?: string;
  titleEn?: string;
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
  description: '杂志风格图片网格展示，色块拼贴点缀',
  needsMedia: true,
};

export const theme01GalleryV1Schema: PropsSchema = {
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
      key: 'titleEn',
      label: '英文标题',
      type: 'text',
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
          label: '链接',
          type: 'image',
          inlineEditable: true,
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

export function Theme01GalleryV1(props: Theme01GalleryV1Props): ReactNode {
  const { kicker, title, titleEn, images = [], _slideIdx, _editable } = props;
  const safeImages = images.slice(0, 4);
  const gridAreas = ['a', 'b', 'c', 'd'];

  return (
    <Sheet substrate="light" frame="grid" className="lp-gallery-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />

      <Headline
        cn={title ?? ''}
        en={titleEn}
        slideIdx={_slideIdx}
        editable={_editable}
        propCn="title"
        propEn="titleEn"
        size="large"
        className="lp-gallery-v1-headline lp-rise"
      />

      <div className={`lp-gallery-v1-grid lp-gallery-v1-grid--${safeImages.length} lp-rise`}>
        {safeImages.map((image, index) => (
          <div
            key={index}
            className={`lp-gallery-v1-card lp-gallery-v1-card--${gridAreas[index]}`}
          >
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

      <Folio page={String(_slideIdx ?? 1).padStart(2, '0')} />

      <Blob
        className="lp-gallery-v1-blob"
        style={{ width: 280, height: 280, top: 60, right: -60, background: 'var(--lp-pink)', opacity: 0.18 }}
      />
      <DottedPattern
        className="lp-gallery-v1-dots"
        style={{ bottom: 100, left: 80, width: 160, height: 160, opacity: 0.22 }}
      />
      <Plus
        className="lp-gallery-v1-plus"
        style={{ top: 160, right: 160, color: 'var(--lp-amber)', opacity: 0.5 }}
      />
    </Sheet>
  );
}
