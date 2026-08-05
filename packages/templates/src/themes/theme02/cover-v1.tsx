// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02CoverV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02CoverV1Meta: LayoutMeta = {
  id: 'theme02_cover_v1',
  theme: 'theme02',
  role: 'cover',
  displayName: 'Theme 02 霓虹封面',
  description: '深色背景 + 霓虹光晕标题 + 装饰光球',
  needsMedia: true,
};

export const theme02CoverV1Schema: PropsSchema = {
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
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'date',
      label: '日期',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'image',
      label: '背景图',
      type: 'image',
    },
  ],
};

export function Theme02CoverV1(props: Theme02CoverV1Props): ReactNode {
  const { kicker, title, subtitle, date, image, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-cover-v1">
      <div className="lp-theme02-orb lp-theme02-orb-accent" style={{ top: '-120px', right: '-80px', width: '420px', height: '420px' }} />
      <div className="lp-theme02-orb lp-theme02-orb-cool" style={{ bottom: '-160px', left: '-100px', width: '520px', height: '520px' }} />
      {image && (
        <img
          className="lp-theme02-cover-image"
          src={image}
          alt=""
          data-lp-editable-image="true"
          data-lp-slide-idx={_slideIdx}
          data-lp-prop="image"
        />
      )}
      <div className="lp-theme02-cover-overlay" />
      <div className="lp-theme02-cover-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-cover-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-cover-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
        {date && (
          <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-cover-date lp-rise">
            {date}
          </EditableField>
        )}
      </div>
    </div>
  );
}
