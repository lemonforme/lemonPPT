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
  Pill,
  Ring,
  Sheet,
} from './shared.js';

export interface Theme01BentoV1Props {
  kicker?: string;
  title?: string;
  titleEn?: string;
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
  description: '色块拼贴风格的 Bento 布局，零卡片、轻量标签',
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
      key: 'titleEn',
      label: '英文标题',
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

const ACCENT_COLORS = ['red', 'blue', 'amber', 'green'] as const;

export function Theme01BentoV1(props: Theme01BentoV1Props): ReactNode {
  const { kicker, title, titleEn, items = [], _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 4);

  return (
    <Sheet substrate="tint" tint="green" frame="grid" className="lp-bento-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />

      <Headline
        cn={title ?? ''}
        en={titleEn}
        slideIdx={_slideIdx}
        editable={_editable}
        propCn="title"
        propEn="titleEn"
        size="large"
        className="lp-bento-v1-headline lp-rise"
      />

      <div className="lp-bento-v1-grid lp-rise">
        {safeItems.map((item, index) => {
          const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
          return (
            <div
              key={index}
              className={`lp-bento-v1-cell lp-bento-v1-cell--${item.span ?? 'medium'} color-${color}`}
            >
              <div className="lp-bento-v1-image-wrap">
                <LpEditableImage
                  className="lp-bento-v1-image"
                  src={item.imageUrl}
                  alt={item.title || ''}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  prop={`items.${index}.imageUrl`}
                  placeholderClassName="lp-bento-v1-image-placeholder"
                />
              </div>
              <div className="lp-bento-v1-body">
                <Pill variant="outline" color={color as 'red' | 'blue' | 'amber' | 'green'}>
                  {String(index + 1).padStart(2, '0')}
                </Pill>
                <EditableField
                  prop={`items.${index}.title`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-bento-v1-title"
                >
                  {item.title}
                </EditableField>
                {item.description && (
                  <EditableField
                    prop={`items.${index}.description`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="p"
                    className="lp-bento-v1-description"
                  >
                    {item.description}
                  </EditableField>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Folio page={String(_slideIdx ?? 1).padStart(2, '0')} />

      <Blob
        className="lp-bento-v1-blob lp-bento-v1-blob-a"
        style={{ width: 360, height: 360, top: -80, right: -80, background: 'var(--lp-amber)', opacity: 0.2 }}
      />
      <Blob
        className="lp-bento-v1-blob lp-bento-v1-blob-b"
        style={{ width: 240, height: 240, bottom: -40, left: -40, background: 'var(--lp-blue)', opacity: 0.16 }}
      />
      <DottedPattern
        className="lp-bento-v1-dots"
        style={{ bottom: 120, right: 120, width: 180, height: 180, opacity: 0.25 }}
      />
      <Ring
        className="lp-bento-v1-ring"
        style={{ width: 100, height: 100, top: 140, left: 90, borderColor: 'var(--lp-red)' }}
      />
    </Sheet>
  );
}
