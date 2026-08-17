// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 横向胶片条（filmstrip_v1）
 * 情绪：obsidian | 骨架：full-bleed | 图位：7
 * 满宽七联胶片条，每格带帧号（01–07）+ 图注；金融编辑「影像序列」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10FilmstripV1Item {
  url?: string;
  caption?: string;
}
export interface Theme10FilmstripV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10FilmstripV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 7;

export const theme10FilmstripV1Meta: LayoutMeta = {
  id: 'theme10_filmstrip_v1',
  theme: 'theme10',
  role: 'filmstrip',
  displayName: 'Theme 10 横向胶片条',
  description: '满宽七联胶片条 + 帧号',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `帧 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['filmstrip', 'gold-index', 'obsidian'],
  contentShape: 'filmstrip',
};

export const theme10FilmstripV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '影像序列' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Filmstrip' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '七帧连续，把一次转折讲完' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '胶片不删帧。我们把七个瞬间排成一条时间轴，缺口本身就是结论的一部分。' },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      minItems: 1,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, () => ({ url: '', caption: '' })),
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '图注', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '影像序列' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '34' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10FilmstripV1(props: Theme10FilmstripV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10FilmstripV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme10-filmstrip">
      <div className="lp-theme10-filmstrip-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-filmstrip-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-filmstrip-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-filmstrip-strip">
        {images.map((img, i) => (
          <figure className="lp-theme10-filmstrip-cell lp-rise" style={{ animationDelay: `${160 + i * 30}ms` }} key={i}>
            <span className="lp-theme10-filmstrip-idx">{String(i + 1).padStart(2, '0')}</span>
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传帧 ${i + 1}`}
              className="lp-theme10-filmstrip-photo"
            />
            {img.caption && (
              <figcaption className="lp-theme10-filmstrip-cap">
                <EditableField prop={`images.${i}.caption`} slideIdx={s} editable={e} as="span">{img.caption}</EditableField>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
