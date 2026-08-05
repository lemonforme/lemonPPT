// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01ChapterV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ChapterV1Meta: LayoutMeta = {
  id: 'theme01_chapter_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 章节页',
  description: '弥散渐变章节过渡页',
  needsMedia: false,
};

export const theme01ChapterV1Schema: PropsSchema = {
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
  }
  ]
};


export function Theme01ChapterV1(props: Theme01ChapterV1Props): ReactNode {
  const { kicker, title, subtitle, _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-chapter-v1">
      <div className="lp-card lp-chapter-card lp-rise">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-chapter-kicker">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-chapter-title">
          {title}
    </EditableField>
    {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-chapter-subtitle">
      {subtitle}
          </EditableField>
    )}
      </div>
  </div>
  );
}
