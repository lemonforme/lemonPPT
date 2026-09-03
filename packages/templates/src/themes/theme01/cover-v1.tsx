// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, LpPhoto, Pill, Ring, Sheet, Slash } from './shared.js';

export interface Theme01CoverV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01CoverV1Meta: LayoutMeta = {
  id: 'theme01_cover_v1',
  theme: 'theme01',
  role: 'cover',
  displayName: 'Theme 01 封面',
  description: '轻盈波普封面：满版影像 + 居中标题组 + 彩色胶囊',
  needsMedia: true,
  mediaSlots: [{ name: '封面影像', fieldPath: 'image', canPresetMedia: true }],
  tags: ['cover', 'hero', 'photo', 'light'],
  contentShape: 'cover',
};

export const theme01CoverV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true, defaultValue: '封面标签' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '请输入标题' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '请输入副标题' },
    { key: 'date', label: '日期', type: 'text', inlineEditable: true, defaultValue: '2026.09.03' },
    { key: 'image', label: 'image', type: 'image' },
  ],
};

export function Theme01CoverV1(props: Theme01CoverV1Props): ReactNode {
  const { kicker, title, subtitle, date, image, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="blue" frame="stage" className="lp-cover-v1">
      <LpPhoto
        prop="image"
        src={image}
        slideIdx={_slideIdx}
        editable={_editable}
        ratio="fill"
        hint="点击上传封面影像"
        className="lp-cover-image"
      />
      <Blob
        className="lp-cover-blob lp-cover-blob-a"
        style={{ width: 420, height: 420, top: -100, right: -100, background: 'var(--lp-amber)' }}
      />
      <Blob
        className="lp-cover-blob lp-cover-blob-b"
        style={{ width: 280, height: 280, bottom: 60, left: -80, background: 'var(--lp-blue)', opacity: 0.16 }}
      />
      <DottedPattern className="lp-cover-dots" style={{ bottom: 100, left: 90 }} />
      <Ring
        className="lp-cover-ring"
        style={{ width: 120, height: 120, top: 140, right: 140, borderColor: 'var(--lp-red)' }}
      />
      <Slash
        className="lp-cover-slash"
        style={{ bottom: 180, right: 120, background: 'var(--lp-green)', height: 70 }}
      />
      <div className="lp-cover-content lp-rise">
        {kicker && (
          <EditableField
            prop="kicker"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-cover-kicker"
          >
            <Pill variant="fill" color="red">{kicker}</Pill>
          </EditableField>
        )}
        <EditableField
          prop="title"
          slideIdx={_slideIdx}
          editable={_editable}
          as="h1"
          className="lp-cover-title"
        >
          {title}
        </EditableField>
        {subtitle && (
          <EditableField
            prop="subtitle"
            slideIdx={_slideIdx}
            editable={_editable}
            as="p"
            className="lp-cover-subtitle"
          >
            {subtitle}
          </EditableField>
        )}
        {date && (
          <EditableField
            prop="date"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-cover-date"
          >
            {date}
          </EditableField>
        )}
      </div>
      <span className="lp-cover-footer-bar" aria-hidden="true" />
    </Sheet>
  );
}
