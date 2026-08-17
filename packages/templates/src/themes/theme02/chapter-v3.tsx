// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ChapterV3Props {
  kicker?: string;
  number?: string;
  title?: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ChapterV3Meta: LayoutMeta = {
  id: 'theme02_chapter_v3',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 章节页 (描边数字)',
  description: '大号描边数字 + 分隔线章节',
  needsMedia: false,
};

export const theme02ChapterV3Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'number', label: '章节号', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
  ],
};

export function Theme02ChapterV3(props: Theme02ChapterV3Props): ReactNode {
  const { kicker, number, title, subtitle, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-chapter-v3">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-chapter-v3-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-theme02-chapter-v3-pill">
            {kicker}
          </EditableField>
        )}
        <div className="lp-theme02-chapter-v3-rule lp-theme02-chapter-v3-rule--top" />
        <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-chapter-v3-number">
          {number}
        </EditableField>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-chapter-v3-title">
          {title}
        </EditableField>
        <div className="lp-theme02-chapter-v3-rule lp-theme02-chapter-v3-rule--bottom" />
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-chapter-v3-subtitle">
            {subtitle}
          </EditableField>
        )}
      </div>
    </div>
  );
}
