// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, LpPhoto } from './shared.js';

export interface Theme01CoverV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01CoverV1Meta: LayoutMeta = {
  id: 'theme01_cover_v1',
  theme: 'theme01',
  role: 'cover',
  displayName: 'Theme 01 封面',
  description: '弥散渐变背景 + 玻璃质感内容区',
  needsMedia: true,
  mediaSlots: [{ name: '封面影像', fieldPath: 'image', canPresetMedia: true }],
  tags: ['cover', 'hero', 'photo', 'light'],
  contentShape: 'cover',
};

export const theme01CoverV1Schema: PropsSchema = {
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
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true
  },
  {
      key: 'date',
      label: '日期',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'image',
      label: 'image',
      type: 'image'
  }
  ]
};


export function Theme01CoverV1(props: Theme01CoverV1Props): ReactNode {
  const { kicker, title, subtitle, date, image, _slideIdx, _editable } = props;

  return (
  <Sheet substrate="light" frame="stage" className="lp-cover-v1">
      <LpPhoto
        prop="image"
        src={image}
        slideIdx={_slideIdx}
        editable={_editable}
        ratio="fill"
        hint="点击上传封面影像"
        className="lp-cover-image"
      />
      <div className="lp-cover-content">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise lp-cover-kicker">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-cover-title lp-rise">
          {title}
    </EditableField>
    {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-cover-subtitle lp-rise">
      {subtitle}
          </EditableField>
    )}
    {date && (
          <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-cover-date lp-rise">
      {date}
          </EditableField>
    )}
      </div>
  </Sheet>
  );
}
