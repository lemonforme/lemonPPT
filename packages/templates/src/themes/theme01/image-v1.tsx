// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Folio, Plus, Ring, Sheet } from './shared.js';

export interface Theme01ImageV1Props {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ImageV1Meta: LayoutMeta = {
  id: 'theme01_image_v1',
  theme: 'theme01',
  role: 'image',
  displayName: 'Theme 01 全屏图片',
  description: '全屏背景图配居中活力标题',
  needsMedia: true,
};

export const theme01ImageV1Schema: PropsSchema = {
  fields: [
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
      label: 'imageAlt',
      type: 'image',
    },
  ],
};

export function Theme01ImageV1(props: Theme01ImageV1Props): ReactNode {
  const { title, subtitle, imageUrl, imageAlt, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="light" frame="full-bleed" className="lp-image-v1">
      <LpEditableImage
        className="lp-image-bg"
        src={imageUrl}
        alt={imageAlt || ''}
        slideIdx={_slideIdx}
        editable={_editable}
        prop="imageUrl"
        placeholderClassName="lp-image-bg-placeholder"
      />
      <div className="lp-image-overlay" />
      <Ring
        className="lp-image-v1-ring"
        style={{ width: 180, height: 180, top: 90, right: 90, borderColor: 'var(--lp-amber)', opacity: 0.55 }}
      />
      <Plus
        className="lp-image-v1-plus"
        style={{ bottom: 120, left: 100, width: 40, height: 40, color: 'var(--lp-red)', opacity: 0.7 }}
      />

      <div className="lp-image-v1-content lp-rise">
        <div className="lp-image-v1-title-wrap">
          <span className="lp-image-v1-accent-bar" aria-hidden="true" />
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-image-title">
            {title}
          </EditableField>
        </div>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-image-subtitle">
            {subtitle}
          </EditableField>
        )}
      </div>

      <Folio
        left="IMAGE"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
        inverse
      />
    </Sheet>
  );
}
