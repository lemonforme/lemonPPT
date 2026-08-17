// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像封面（cover_photo_v1）
 * 基底：墨 | 骨架：full-bleed | 图位：1
 *
 * 满版出血影像铺底（底部压暗蒙版保证压字对比度），
 * 专色横条作栏目标记，大字标题沉底，底部 meta 行交代出处。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { InkPhoto, Sheet, normalizeStrings } from './shared.js';

export interface Theme09CoverPhotoV1Props {
  strip?: string;
  title: string;
  subtitle?: string;
  metaItems?: string[];
  imageUrl?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CoverPhotoV1Meta: LayoutMeta = {
  id: 'theme09_cover_photo_v1',
  theme: 'theme09',
  role: 'cover',
  displayName: 'Theme 09 影像封面',
  description: '满版出血影像 + 专色栏目条 + 沉底大字标题，最通用的图片型封面',
  needsMedia: true,
  mediaSlots: [{ name: '满版影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['cover', 'photo', 'full-bleed', 'hero'],
  contentShape: 'cover-photo',
};

export const theme09CoverPhotoV1Schema: PropsSchema = {
  fields: [
    { key: 'strip', label: '栏目条', type: 'text', inlineEditable: true, defaultValue: 'Annual Feature' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '一年，一百二十场对话' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '我们走过十二座城市，把品牌交回给使用它的人。' },
    {
      key: 'metaItems',
      label: '底部信息',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: ['ISSUE 09', '2026.08', '品牌与内容中心'],
      itemSchema: [{ key: 'item', label: '条目', type: 'text' }],
    },
    { key: 'imageUrl', label: '满版影像', type: 'image', defaultValue: '' },
  ],
};

export function Theme09CoverPhotoV1(props: Theme09CoverPhotoV1Props): ReactNode {
  const { strip, title, subtitle, imageUrl, _slideIdx: s, _editable: e } = props;
  const metaItems = normalizeStrings(props.metaItems).slice(0, 4);

  return (
    <Sheet substrate="ink" frame="full-bleed" className="lp-theme09-coverphoto" grain={false}>
      <InkPhoto
        prop="imageUrl"
        src={imageUrl}
        slideIdx={s}
        editable={e}
        ratio="fill"
        scrim="bottom"
        hint="点击上传满版封面影像"
      />

      <div className="lp-theme09-coverphoto-inner">
        {strip && (
          <EditableField prop="strip" slideIdx={s} editable={e} as="span" className="lp-theme09-coverphoto-strip lp-rise">
            {strip}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-coverphoto-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme09-coverphoto-sub lp-rise">
            {subtitle}
          </EditableField>
        )}
        {metaItems.length > 0 && (
          <div className="lp-theme09-coverphoto-meta lp-rise" style={{ animationDelay: '140ms' }}>
            {metaItems.map((m, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '22px' }}>
                {i > 0 && <i aria-hidden="true">/</i>}
                <EditableField prop={`metaItems.${i}`} slideIdx={s} editable={e} as="span">
                  {m}
                </EditableField>
              </span>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}
