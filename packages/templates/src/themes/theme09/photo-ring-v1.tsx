// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 圆窗影像（photo_ring_v1）
 * 基底：墨 | 骨架：full-bleed | 图位：3
 *
 * 墨底上三扇圆形「镜头窗」（aperture 圆窗语汇）裱着三张影像，
 * 中央悬浮标题与引线。杂志「三视角 / 季度」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09PhotoRingV1Item {
  url?: string;
  caption?: string;
}

export interface Theme09PhotoRingV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  titleEn?: string;
  images?: Theme09PhotoRingV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 3;

export const theme09PhotoRingV1Meta: LayoutMeta = {
  id: 'theme09_photo_ring_v1',
  theme: 'theme09',
  role: 'gallery',
  displayName: 'Theme 09 圆窗影像',
  description: '墨底三扇圆形镜头窗 + 中央悬浮标题，三视角 / 季度栏',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `圆窗 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['photo', 'aperture', 'ring', 'editorial'],
  contentShape: 'photo-ring',
};

export const theme09PhotoRingV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '三视角' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Three Lenses' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '同一个季度，三种看见' },
    { key: 'titleEn', label: '英文标注', type: 'text', inlineEditable: true, defaultValue: 'One Quarter, Three Views' },
    {
      key: 'images',
      label: '圆窗',
      type: 'array',
      minItems: 2,
      maxItems: COUNT,
      defaultValue: [
        { url: '', caption: '北境 · 雪线' },
        { url: '', caption: '中原 · 麦田' },
        { url: '', caption: '南滨 · 潮间' },
      ],
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '图注', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '三视角 · 圆窗' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '30' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09PhotoRingV1(props: Theme09PhotoRingV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const raw = (props.images ?? []).slice(0, COUNT);
  const images: Theme09PhotoRingV1Item[] = Array.from({ length: COUNT }, (_, i) => raw[i] ?? {});

  return (
    <Sheet substrate="ink" frame="full-bleed" className="lp-theme09-ring" grain={false}>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-ring-inner">
        <div className="lp-theme09-ring-head lp-rise">
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-ring-title">
            {title}
          </EditableField>
          {titleEn && (
            <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-ring-en">
              {titleEn}
            </EditableField>
          )}
        </div>

        <div className="lp-theme09-ring-row">
          {images.map((it, i) => (
            <figure key={i} className="lp-theme09-ring-cell lp-rise" style={{ animationDelay: `${i * 60}ms` }}>
              <InkPhoto
                prop={`images.${i}.url`}
                src={it.url}
                slideIdx={s}
                editable={e}
                ratio="1:1"
                aperture
                hint={`圆窗 ${i + 1}`}
              />
              {it.caption && (
                <figcaption className="lp-theme09-ring-cap">
                  <EditableField prop={`images.${i}.caption`} slideIdx={s} editable={e} as="span">
                    {it.caption}
                  </EditableField>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
