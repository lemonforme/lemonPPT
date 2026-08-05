// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01CoverV3Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  presenter?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01CoverV3Meta: LayoutMeta = {
  id: 'theme01_cover_v3',
  theme: 'theme01',
  role: 'cover',
  displayName: 'Theme 01 封面 V3',
  description: 'Bento 网格玻璃卡片封面',
  needsMedia: false,
};

export const theme01CoverV3Schema: PropsSchema = {
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
      key: 'presenter',
      label: 'presenter',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01CoverV3(props: Theme01CoverV3Props): ReactNode {
  const { kicker, title, subtitle, date, presenter, _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-cover-v3">
      <div className="lp-card lp-cover-main-card lp-rise">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-cover-kicker">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-cover-title">
          {title}
    </EditableField>
    {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-cover-subtitle">
      {subtitle}
          </EditableField>
    )}
      </div>
      <div className="lp-card lp-cover-bento-card lp-rise">
    <EditableField prop="presenter" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-cover-date">
          {presenter || 'Presenter'}
    </EditableField>
      </div>
      <div className="lp-card lp-cover-bento-card lp-rise">
    <div className="lp-cover-meta">
          {date && (
      <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="span">
              {date}
      </EditableField>
          )}
          <span>Theme 01</span>
    </div>
      </div>
  </div>
  );
}
