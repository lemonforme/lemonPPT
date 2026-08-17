// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像拼贴（mosaic_v1）
 * 基底：纸 | 骨架：grid | 图位：9
 *
 * 3×3 影像拼贴墙，部分格以胶带斜贴，整体如杂志内页的图墙。
 * 杂志「影像墙 / 现场全景」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09MosaicV1Item {
  url?: string;
  caption?: string;
  tape?: boolean;
}

export interface Theme09MosaicV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  titleEn?: string;
  images?: Theme09MosaicV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 9;

export const theme09MosaicV1Meta: LayoutMeta = {
  id: 'theme09_mosaic_v1',
  theme: 'theme09',
  role: 'gallery',
  displayName: 'Theme 09 影像拼贴',
  description: '3×3 影像拼贴墙 + 胶带斜贴，影像墙 / 现场全景栏',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `影像 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['photo', 'mosaic', 'grid', 'editorial'],
  contentShape: 'mosaic',
};

export const theme09MosaicV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '影像墙' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Wall' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '九十九个清晨' },
    { key: 'titleEn', label: '英文标注', type: 'text', inlineEditable: true, defaultValue: 'Ninety-Nine Mornings' },
    {
      key: 'images',
      label: '影像',
      type: 'array',
      minItems: 4,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, (_, i) => ({
        url: '',
        caption: `现场 ${i + 1}`,
        tape: i % 3 === 1,
      })),
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '图注', type: 'text', inlineEditable: true },
        { key: 'tape', label: '胶带', type: 'boolean' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '影像墙 · 拼贴' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '44' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09MosaicV1(props: Theme09MosaicV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const raw = (props.images ?? []).slice(0, COUNT);
  const images: Theme09MosaicV1Item[] = Array.from({ length: COUNT }, (_, i) => raw[i] ?? {});

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-mosaic">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-mosaic-head lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-mosaic-title">
          {title}
        </EditableField>
        {titleEn && (
          <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-mosaic-en">
            {titleEn}
          </EditableField>
        )}
      </div>

      <div className="lp-theme09-mosaic-grid">
        {images.map((it, i) => (
          <figure key={i} className="lp-theme09-mosaic-cell lp-rise" style={{ animationDelay: `${i * 30}ms` }}>
            <InkPhoto
              prop={`images.${i}.url`}
              src={it.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              tape={it.tape}
              hint={`影像 ${i + 1}`}
            />
            {it.caption && (
              <figcaption className="lp-theme09-mosaic-cap">
                <EditableField prop={`images.${i}.caption`} slideIdx={s} editable={e} as="span">
                  {it.caption}
                </EditableField>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
