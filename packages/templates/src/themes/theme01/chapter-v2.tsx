// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01ChapterV2Props {
  number?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ChapterV2Meta: LayoutMeta = {
  id: 'theme01_chapter_v2',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 章节页 v2',
  description: '左侧大编号 + 右侧标题的章节过渡页',
  needsMedia: false,
};

export const theme01ChapterV2Schema: PropsSchema = {
  fields: [
  {
      key: 'number',
      label: 'number',
      type: 'text',
      inlineEditable: true
  },
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


export function Theme01ChapterV2(props: Theme01ChapterV2Props): ReactNode {
  const { number, kicker, title, subtitle, _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-chapter-v2">
      <div className="lp-chapter-v2-inner lp-rise">
    <div className="lp-chapter-v2-left">
          <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chapter-v2-number">
      {number ?? String(_slideIdx ?? 1).padStart(2, '0')}
          </EditableField>
    </div>
    <div className="lp-chapter-v2-right">
          {kicker && (
      <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-chapter-v2-kicker">
              {kicker}
      </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-chapter-v2-title">
      {title}
          </EditableField>
          {subtitle && (
      <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-chapter-v2-subtitle">
              {subtitle}
      </EditableField>
          )}
    </div>
      </div>
  </div>
  );
}
