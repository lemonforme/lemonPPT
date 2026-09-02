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
  Slash,
  Sheet,
} from './shared.js';

export interface Theme01FilmstripV1Props {
  kicker?: string;
  title?: string;
  titleEn?: string;
  images?: Array<{ url?: string; caption?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01FilmstripV1Meta: LayoutMeta = {
  id: 'theme01_filmstrip_v1',
  theme: 'theme01',
  role: 'gallery',
  displayName: 'Theme 01 影像长卷',
  description: '横向长卷式图片故事展示，色块拼贴点缀',
  needsMedia: true,
};

export const theme01FilmstripV1Schema: PropsSchema = {
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
      maxItems: 5,
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

export function Theme01FilmstripV1(props: Theme01FilmstripV1Props): ReactNode {
  const { kicker, title, titleEn, images = [], _slideIdx, _editable } = props;
  const safeImages = images.slice(0, 5);

  return (
    <Sheet substrate="light" frame="grid" className="lp-filmstrip-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />

      <Headline
        cn={title ?? ''}
        en={titleEn}
        slideIdx={_slideIdx}
        editable={_editable}
        propCn="title"
        propEn="titleEn"
        size="large"
        className="lp-filmstrip-v1-headline lp-rise"
      />

      <div className="lp-filmstrip-v1-track lp-rise" data-scrollbar>
        {safeImages.map((image, index) => (
          <div
            key={index}
            className="lp-filmstrip-v1-frame"
            style={{ '--f-index': index } as React.CSSProperties}
          >
            <LpEditableImage
              className="lp-filmstrip-v1-image"
              src={image.url}
              alt={image.caption || ''}
              slideIdx={_slideIdx}
              editable={_editable}
              prop={`images.${index}.url`}
              placeholderClassName="lp-filmstrip-v1-image-placeholder"
            />
            {image.caption && (
              <EditableField
                prop={`images.${index}.caption`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-filmstrip-v1-caption"
              >
                {image.caption}
              </EditableField>
            )}
          </div>
        ))}
      </div>

      <Folio page={String(_slideIdx ?? 1).padStart(2, '0')} />

      <Blob
        className="lp-filmstrip-v1-blob"
        style={{ width: 300, height: 300, bottom: -60, right: -40, background: 'var(--lp-green)', opacity: 0.16 }}
      />
      <DottedPattern
        className="lp-filmstrip-v1-dots"
        style={{ top: 150, left: 90, width: 140, height: 140, opacity: 0.22 }}
      />
      <Slash
        className="lp-filmstrip-v1-slash"
        style={{ bottom: 160, right: 140, background: 'var(--lp-red)', height: 60, opacity: 0.45 }}
      />
    </Sheet>
  );
}
