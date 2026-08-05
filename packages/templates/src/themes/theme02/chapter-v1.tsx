// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChapterV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  number?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChapterV1Meta: LayoutMeta = {
  id: 'theme02_chapter_v1',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 章节页',
  description: '大号章节序号 + 霓虹分隔线 + 深色背景',
  needsMedia: false,
};

export const theme02ChapterV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'number',
      label: '章节序号',
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
  ],
};

export function Theme02ChapterV1(props: Theme02ChapterV1Props): ReactNode {
  const { kicker, title, subtitle, number, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-chapter-v1">
      <div className="lp-theme02-chapter-line" />
      <div className="lp-theme02-chapter-content">
        <div className="lp-theme02-chapter-top">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
              {kicker}
            </EditableField>
          )}
          {number && (
            <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chapter-number lp-rise">
              {number}
            </EditableField>
          )}
        </div>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-chapter-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-chapter-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
    </div>
  );
}
