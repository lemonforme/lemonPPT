// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChapterV2Props {
  number?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChapterV2Meta: LayoutMeta = {
  id: 'theme02_chapter_v2',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 霓虹章节页',
  description: '全屏霓虹描边章节号 + 居中标题',
  needsMedia: false,
  tags: ['chapter', 'high-impact'],
};

export const theme02ChapterV2Schema: PropsSchema = {
  fields: [
    {
      key: 'number',
      label: '章节序号',
      type: 'text',
      inlineEditable: true,
    },
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
  ],
};

export function Theme02ChapterV2(props: Theme02ChapterV2Props): ReactNode {
  const { number, kicker, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-chapter-v2">
      <div className="lp-theme02-chapter-v2-rings" aria-hidden="true">
        <div className="lp-theme02-chapter-v2-ring" />
        <div className="lp-theme02-chapter-v2-ring lp-theme02-chapter-v2-ring--inner" />
      </div>
      <div className="lp-theme02-chapter-v2-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {number && (
          <EditableField
            prop="number"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-theme02-chapter-v2-number lp-rise"
          >
            {number}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-chapter-v2-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-chapter-v2-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
    </div>
  );
}
