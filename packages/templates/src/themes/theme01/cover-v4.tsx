// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, Pill, Ring, Sheet } from './shared.js';

export interface Theme01CoverV4Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  edition?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01CoverV4Meta: LayoutMeta = {
  id: 'theme01_cover_v4',
  theme: 'theme01',
  role: 'cover',
  displayName: 'Theme 01 封面 V4',
  description: '杂志刊头式波普封面：色块 + 装饰线 + 信息胶囊',
  needsMedia: false,
};

export const theme01CoverV4Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'date', label: '日期', type: 'text', inlineEditable: true },
    { key: 'edition', label: 'edition', type: 'text', inlineEditable: true },
  ],
};

export function Theme01CoverV4(props: Theme01CoverV4Props): ReactNode {
  const { kicker, title, subtitle, date, edition, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="light" frame="full-bleed" className="lp-cover-v4">
      <span className="lp-cover-side-bar" aria-hidden="true" />
      <Blob
        className="lp-cover-blob lp-cover-blob-b"
        style={{ width: 480, height: 480, bottom: -140, left: -160, background: 'var(--lp-green)' }}
      />
      <Blob
        className="lp-cover-blob lp-cover-blob-c"
        style={{ width: 260, height: 260, top: 120, right: -60, background: 'var(--lp-blue)', opacity: 0.14 }}
      />
      <Ring
        className="lp-cover-ring"
        style={{ width: 140, height: 140, top: 160, right: 160, borderColor: 'var(--lp-amber)' }}
      />
      <div className="lp-cover-masthead lp-rise">
        <EditableField
          prop="kicker"
          slideIdx={_slideIdx}
          editable={_editable}
          as="span"
          className="lp-cover-masthead-kicker"
        >
          <Pill variant="fill" color="violet">{kicker || 'FEATURED STORY'}</Pill>
        </EditableField>
        <div className="lp-cover-masthead-line" />
        <EditableField
          prop="edition"
          slideIdx={_slideIdx}
          editable={_editable}
          as="span"
          className="lp-cover-masthead-edition"
        >
          {edition || 'ED. 01'}
        </EditableField>
      </div>
      <div className="lp-cover-title-wrap lp-rise">
        <span className="lp-cover-title-bg" aria-hidden="true" />
        <EditableField
          prop="title"
          slideIdx={_slideIdx}
          editable={_editable}
          as="h1"
          className="lp-cover-title"
        >
          {title}
        </EditableField>
      </div>
      {subtitle && (
        <EditableField
          prop="subtitle"
          slideIdx={_slideIdx}
          editable={_editable}
          as="p"
          className="lp-cover-subtitle lp-rise"
        >
          {subtitle}
        </EditableField>
      )}
      <div className="lp-cover-footer lp-rise">
        {date && (
          <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="span">
            {date}
          </EditableField>
        )}
        <Pill variant="outline" color="green">lemonPPT</Pill>
      </div>
      <span className="lp-cover-footer-bar" aria-hidden="true" />
    </Sheet>
  );
}
