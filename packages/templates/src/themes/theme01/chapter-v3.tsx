// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Blob, Pill, Ring, Sheet } from './shared.js';

export interface Theme01ChapterV3Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ChapterV3Meta: LayoutMeta = {
  id: 'theme01_chapter_v3',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 章节页 V3',
  description: '全宽背景图 + 半透明色块标题的波普章节页',
  needsMedia: true,
};

export const theme01ChapterV3Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'imageUrl', label: '图片', type: 'image' },
    { key: 'imageAlt', label: 'imageAlt', type: 'image' },
  ],
};

export function Theme01ChapterV3(props: Theme01ChapterV3Props): ReactNode {
  const { kicker, title, subtitle, imageUrl, imageAlt, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="light" frame="full-bleed" className="lp-chapter-v3">
      <LpEditableImage
        className="lp-chapter-v3-bg"
        src={imageUrl}
        alt={imageAlt || ''}
        slideIdx={_slideIdx}
        editable={_editable}
        prop="imageUrl"
        placeholderClassName="lp-chapter-v3-bg-placeholder"
      />
      <div className="lp-chapter-v3-overlay" />
      <Blob
        className="lp-chapter-blob"
        style={{ width: 320, height: 320, bottom: -60, right: 80, background: 'var(--lp-amber)' }}
      />
      <Ring
        className="lp-chapter-ring"
        style={{ width: 140, height: 140, top: 120, right: 160, borderColor: 'var(--lp-green)' }}
      />
      <div className="lp-chapter-v3-card lp-rise">
        <span className="lp-chapter-en" aria-hidden="true">Chapter</span>
        {kicker && (
          <EditableField
            prop="kicker"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-chapter-v3-kicker"
          >
            <Pill variant="fill" color="red">{kicker}</Pill>
          </EditableField>
        )}
        <EditableField
          prop="title"
          slideIdx={_slideIdx}
          editable={_editable}
          as="h1"
          className="lp-chapter-v3-title"
        >
          {title}
        </EditableField>
        {subtitle && (
          <EditableField
            prop="subtitle"
            slideIdx={_slideIdx}
            editable={_editable}
            as="p"
            className="lp-chapter-v3-subtitle"
          >
            {subtitle}
          </EditableField>
        )}
      </div>
    </Sheet>
  );
}
