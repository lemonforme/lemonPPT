// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { DottedPattern, HighlightBlock, LpPhoto, NumberSticker, Pill, Sheet } from './shared.js';

export interface Theme01CoverV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01CoverV2Meta: LayoutMeta = {
  id: 'theme01_cover_v2',
  theme: 'theme01',
  role: 'cover',
  displayName: 'Theme 01 封面 V2',
  description: '分屏波普封面：影像区 + 彩色大色块标题区 + 数字贴纸',
  needsMedia: true,
};

export const theme01CoverV2Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'date', label: '日期', type: 'text', inlineEditable: true },
    { key: 'image', label: 'image', type: 'image' },
  ],
};

export function Theme01CoverV2(props: Theme01CoverV2Props): ReactNode {
  const { kicker, title, subtitle, date, image, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="amber" frame="split" className="lp-cover-v2">
      <LpPhoto
        prop="image"
        src={image}
        slideIdx={_slideIdx}
        editable={_editable}
        ratio="fill"
        hint="点击上传封面影像"
        className="lp-cover-image"
      />
      <DottedPattern
        className="lp-cover-dots-side"
        style={{ top: 120, left: 60, width: 220, height: 220, opacity: 0.3 }}
      />
      <HighlightBlock className="lp-cover-content lp-rise" color="amber" curled>
        <span className="lp-cover-v2-en" aria-hidden="true">COVER STORY</span>
        {kicker && (
          <EditableField
            prop="kicker"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-cover-kicker"
          >
            <Pill variant="outline" color="red">{kicker}</Pill>
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
        <NumberSticker
          className="lp-cover-v2-sticker"
          value={String(_slideIdx ?? 1).padStart(2, '0')}
        />
        <span className="lp-cover-rule" aria-hidden="true" />
      </HighlightBlock>
    </Sheet>
  );
}
