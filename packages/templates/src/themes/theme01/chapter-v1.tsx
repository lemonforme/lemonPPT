// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, NumberSticker, Pill, Ring, Sheet, Slash } from './shared.js';

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
  description: '轻盈波普章节页：居中标题 + 数字贴纸 + 装饰色块',
  needsMedia: false,
};

export const theme01ChapterV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
  ],
};

export function Theme01ChapterV1(props: Theme01ChapterV1Props): ReactNode {
  const { kicker, title, subtitle, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="green" frame="stage" className="lp-chapter-v1">
      <Blob
        className="lp-chapter-blob lp-chapter-blob-a"
        style={{ width: 340, height: 340, top: 40, right: 70, background: 'var(--lp-blue)' }}
      />
      <Blob
        className="lp-chapter-blob lp-chapter-blob-b"
        style={{ width: 220, height: 220, bottom: 80, left: 60, background: 'var(--lp-red)', opacity: 0.14 }}
      />
      <DottedPattern className="lp-chapter-dots" style={{ bottom: 100, left: 110 }} />
      <Ring
        className="lp-chapter-ring"
        style={{ width: 120, height: 120, top: 140, left: 140, borderColor: 'var(--lp-amber)' }}
      />
      <Slash
        className="lp-chapter-slash"
        style={{ bottom: 160, right: 130, height: 70, background: 'var(--lp-green)' }}
      />
      <div className="lp-chapter-card lp-rise">
        {kicker && (
          <EditableField
            prop="kicker"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-chapter-kicker"
          >
            <Pill variant="fill" color="blue">{kicker}</Pill>
          </EditableField>
        )}
        <NumberSticker
          className="lp-chapter-number"
          value={String(_slideIdx ?? 1).padStart(2, '0')}
        />
        <span className="lp-chapter-en" aria-hidden="true">Chapter</span>
        <EditableField
          prop="title"
          slideIdx={_slideIdx}
          editable={_editable}
          as="h1"
          className="lp-chapter-title"
        >
          {title}
        </EditableField>
        {subtitle && (
          <EditableField
            prop="subtitle"
            slideIdx={_slideIdx}
            editable={_editable}
            as="p"
            className="lp-chapter-subtitle"
          >
            {subtitle}
          </EditableField>
        )}
      </div>
    </Sheet>
  );
}
