// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01CoverV4Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  edition?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01CoverV4Meta: LayoutMeta = {
  id: 'theme01_cover_v4',
  theme: 'theme01',
  role: 'cover',
  displayName: 'Theme 01 封面 V4',
  description: '杂志刊头式封面 + 弥散渐变',
  needsMedia: false,
};

export const theme01CoverV4Schema: PropsSchema = {
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
      key: 'edition',
      label: 'edition',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01CoverV4(props: Theme01CoverV4Props): ReactNode {
  const { kicker, title, subtitle, date, edition, _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-cover-v4">
      <div className="lp-cover-masthead lp-rise">
    <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-cover-date">
          {kicker || 'FEATURED STORY'}
    </EditableField>
    <div className="lp-cover-masthead-line" />
    <EditableField prop="edition" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-cover-date">
          {edition || 'ED. 01'}
    </EditableField>
      </div>
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-cover-title lp-rise">
    {title}
      </EditableField>
      {subtitle && (
    <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-cover-subtitle lp-rise">
          {subtitle}
    </EditableField>
      )}
      <div className="lp-cover-footer lp-rise">
    {date && (
          <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="span">
      {date}
          </EditableField>
    )}
    <span>lemonPPT</span>
      </div>
  </div>
  );
}
