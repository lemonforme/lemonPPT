// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像便当（photo_bento_v1）
 * 基底：纸 | 骨架：grid | 图位：5
 *
 * 非对称便当网格：1 张大图 + 4 张小图错落排布，每格带图注。
 * 杂志「图辑 / 概览」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09PhotoBentoV1Item {
  url?: string;
  caption?: string;
  /** 便当格型号：b 大 / s 小 */
  size?: 'b' | 's';
}

export interface Theme09PhotoBentoV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  titleEn?: string;
  images?: Theme09PhotoBentoV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 5;

export const theme09PhotoBentoV1Meta: LayoutMeta = {
  id: 'theme09_photo_bento_v1',
  theme: 'theme09',
  role: 'bento',
  displayName: 'Theme 09 影像便当',
  description: '非对称便当网格 1 大图 + 4 小图，图辑 / 概览栏',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `影像 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['photo', 'bento', 'grid', 'editorial'],
  contentShape: 'photo-bento',
};

export const theme09PhotoBentoV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '图辑' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Gallery' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一页看懂这次升级' },
    { key: 'titleEn', label: '英文标注', type: 'text', inlineEditable: true, defaultValue: 'The Upgrade at a Glance' },
    {
      key: 'images',
      label: '影像',
      type: 'array',
      minItems: 2,
      maxItems: COUNT,
      defaultValue: [
        { url: '', caption: '主视觉 · 全新首页', size: 'b' },
        { url: '', caption: '细节一', size: 's' },
        { url: '', caption: '细节二', size: 's' },
        { url: '', caption: '细节三', size: 's' },
        { url: '', caption: '细节四', size: 's' },
      ],
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '图注', type: 'text', inlineEditable: true },
        {
          key: 'size',
          label: '型号',
          type: 'select',
          options: [
            { value: 'b', label: '大图' },
            { value: 's', label: '小图' },
          ],
        },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '图辑 · 影像便当' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '18' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09PhotoBentoV1(props: Theme09PhotoBentoV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const raw = (props.images ?? []).slice(0, COUNT);
  const images: Theme09PhotoBentoV1Item[] = Array.from({ length: COUNT }, (_, i) => raw[i] ?? {});

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-bento">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-bento-head lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-bento-title">
          {title}
        </EditableField>
        {titleEn && (
          <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-bento-en">
            {titleEn}
          </EditableField>
        )}
      </div>

      <div className="lp-theme09-bento-grid">
        {images.map((it, i) => (
          <figure
            key={i}
            className={`lp-theme09-bento-cell lp-rise size-${it.size === 'b' ? 'b' : 's'}`}
            style={{ animationDelay: `${i * 45}ms` }}
          >
            <InkPhoto
              prop={`images.${i}.url`}
              src={it.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              hint={`影像 ${i + 1}`}
            />
            {it.caption && (
              <figcaption className="lp-theme09-bento-cap">
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
