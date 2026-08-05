// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02CoverV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02CoverV2Meta: LayoutMeta = {
  id: 'theme02_cover_v2',
  theme: 'theme02',
  role: 'cover',
  displayName: 'Theme 02 全屏冲击封面',
  description: '全屏大字号标题 + 动态霓虹背景渐变 + 光球装饰',
  needsMedia: true,
  tags: ['hero', 'high-impact'],
};

export const theme02CoverV2Schema: PropsSchema = {
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

export function Theme02CoverV2(props: Theme02CoverV2Props): ReactNode {
  const { kicker, title, subtitle, date, image, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-cover-v2">
      <div className="lp-theme02-cover-v2-gradient" />
      <div className="lp-theme02-orb lp-theme02-orb--accent lp-theme02-cover-v2-orb-accent" />
      <div className="lp-theme02-orb lp-theme02-orb--cool lp-theme02-cover-v2-orb-cool" />
      <div className="lp-theme02-cover-v2-grid" />
      {image && (
        <img
          className="lp-theme02-cover-v2-image"
          src={image}
          alt=""
          data-lp-editable-image="true"
          data-lp-slide-idx={_slideIdx}
          data-lp-prop="image"
        />
      )}
      <div className="lp-theme02-cover-v2-overlay" />
      <div className="lp-theme02-cover-v2-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-cover-v2-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-cover-v2-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
        {date && (
          <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-cover-v2-date lp-rise">
            {date}
          </EditableField>
        )}
      </div>
    </div>
  );
}
