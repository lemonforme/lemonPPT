// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像长卷（filmstrip_v1）
 * 基底：墨 | 骨架：full-bleed | 图位：7
 *
 * 横向胶片长卷：7 帧影像连成一卷，上下胶片齿孔边，每帧带编号。
 * 杂志「影像连载 / 长图故事」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09FilmstripV1Item {
  url?: string;
  caption?: string;
}

export interface Theme09FilmstripV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  images?: Theme09FilmstripV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 7;

export const theme09FilmstripV1Meta: LayoutMeta = {
  id: 'theme09_filmstrip_v1',
  theme: 'theme09',
  role: 'filmstrip',
  displayName: 'Theme 09 影像长卷',
  description: '横向胶片长卷 7 帧 + 齿孔边 + 编号，影像连载 / 长图故事栏',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `帧 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['photo', 'filmstrip', 'sprockets', 'editorial'],
  contentShape: 'filmstrip',
};

export const theme09FilmstripV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '连载' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Reel' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一卷未剪辑的春天' },
    {
      key: 'images',
      label: '帧',
      type: 'array',
      minItems: 2,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, (_, i) => ({
        url: '',
        caption: `第 ${i + 1} 帧`,
      })),
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '图注', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '连载 · 影像长卷' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '36' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09FilmstripV1(props: Theme09FilmstripV1Props): ReactNode {
  const {
    section, sectionEn, mark, title,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const raw = (props.images ?? []).slice(0, COUNT);
  const images: Theme09FilmstripV1Item[] = Array.from({ length: COUNT }, (_, i) => raw[i] ?? {});

  return (
    <Sheet substrate="ink" frame="full-bleed" className="lp-theme09-filmstrip" grain={false}>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-filmstrip-inner">
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-filmstrip-title lp-rise">
          {title}
        </EditableField>

        <div className="lp-theme09-filmstrip-reel">
          {images.map((it, i) => (
            <figure key={i} className="lp-theme09-filmstrip-frame lp-rise" style={{ animationDelay: `${i * 40}ms` }}>
              <InkPhoto
                prop={`images.${i}.url`}
                src={it.url}
                slideIdx={s}
                editable={e}
                ratio="2:3"
                sprockets
                hint={`帧 ${i + 1}`}
              />
              <figcaption className="lp-theme09-filmstrip-cap">
                <span className="lp-theme09-filmstrip-no" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {it.caption && (
                  <EditableField prop={`images.${i}.caption`} slideIdx={s} editable={e} as="span">
                    {it.caption}
                  </EditableField>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
