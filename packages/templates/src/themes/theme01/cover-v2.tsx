// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01CoverV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01CoverV2Meta: LayoutMeta = {
  id: 'theme01_cover_v2',
  theme: 'theme01',
  role: 'cover',
  displayName: 'Theme 01 封面 V2',
  description: '双栏编辑式布局 + 玻璃质感内容区',
  needsMedia: true,
};

export const theme01CoverV2Schema: PropsSchema = {
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


export function Theme01CoverV2(props: Theme01CoverV2Props): ReactNode {
  const { kicker, title, subtitle, date, image, _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-cover-v2">
      {image && (
    <img
          className="lp-cover-image"
          src={image}
          alt=""
          data-lp-editable-image="true"
          data-lp-slide-idx={_slideIdx}
          data-lp-prop="image"
    />
      )}
      <div className="lp-cover-content">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
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
  </div>
  );
}
