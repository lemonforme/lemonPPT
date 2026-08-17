// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme02SpotlightV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  caption?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02SpotlightV1Meta: LayoutMeta = {
  id: 'theme02_spotlight_v1',
  theme: 'theme02',
  role: 'image',
  displayName: 'Theme 02 聚光大图',
  description: '全幅图片 + 文字叠加',
  needsMedia: true,
};

export const theme02SpotlightV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    { key: 'image', label: '图片', type: 'image' },
    { key: 'caption', label: '说明', type: 'text', inlineEditable: true },
  ],
};

export function Theme02SpotlightV1(props: Theme02SpotlightV1Props): ReactNode {
  const { kicker, title, subtitle, image, caption, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-spotlight-v1">
      <LpEditableImage
        className="lp-theme02-spotlight-media"
        src={image ?? ''}
        alt=""
        slideIdx={_slideIdx}
        editable={_editable}
        prop="image"
        placeholderClassName="lp-theme02-spotlight-placeholder"
        placeholderText="点击上传背景图"
      />
      <div className="lp-theme02-spotlight-overlay" />
      <div className="lp-theme02-spotlight-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-spotlight-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-spotlight-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
        {caption && (
          <EditableField prop="caption" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-spotlight-caption lp-rise">
            {caption}
          </EditableField>
        )}
      </div>
    </div>
  );
}
