// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, NumberSticker, Pill, Ring, Sheet, Slash } from './shared.js';

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
  description: '左侧大号数字贴纸 + 右侧标题的波普章节页',
  needsMedia: false,
};

export const theme01ChapterV2Schema: PropsSchema = {
  fields: [
    { key: 'number', label: 'number', type: 'text', inlineEditable: true },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
  ],
};

export function Theme01ChapterV2(props: Theme01ChapterV2Props): ReactNode {
  const { number, kicker, title, subtitle, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="light" frame="split" className="lp-chapter-v2">
      <Blob
        className="lp-chapter-blob lp-chapter-blob-b"
        style={{ width: 420, height: 420, bottom: -120, right: -100, background: 'var(--lp-amber)' }}
      />
      <Blob
        className="lp-chapter-blob lp-chapter-blob-c"
        style={{ width: 240, height: 240, top: 80, right: 90, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern className="lp-chapter-dots lp-chapter-dots-left" style={{ top: 100, left: 90 }} />
      <Ring
        className="lp-chapter-ring"
        style={{ width: 130, height: 130, bottom: 120, left: 120, borderColor: 'var(--lp-red)' }}
      />
      <Slash
        className="lp-chapter-slash"
        style={{ top: 130, right: 140, height: 75, background: 'var(--lp-green)' }}
      />
      <div className="lp-chapter-v2-inner lp-rise">
        <div className="lp-chapter-v2-left">
          <EditableField
            prop="number"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-chapter-v2-number-wrap"
          >
            <NumberSticker
              outline
              value={number ?? String(_slideIdx ?? 1).padStart(2, '0')}
            />
          </EditableField>
        </div>
        <div className="lp-chapter-v2-right">
          <span className="lp-chapter-en" aria-hidden="true">Chapter</span>
          {kicker && (
            <EditableField
              prop="kicker"
              slideIdx={_slideIdx}
              editable={_editable}
              as="div"
              className="lp-chapter-v2-kicker"
            >
              <Pill variant="fill" color="green">{kicker}</Pill>
            </EditableField>
          )}
          <EditableField
            prop="title"
            slideIdx={_slideIdx}
            editable={_editable}
            as="h1"
            className="lp-chapter-v2-title"
          >
            {title}
          </EditableField>
          {subtitle && (
            <EditableField
              prop="subtitle"
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-chapter-v2-subtitle"
            >
              {subtitle}
            </EditableField>
          )}
        </div>
      </div>
    </Sheet>
  );
}
