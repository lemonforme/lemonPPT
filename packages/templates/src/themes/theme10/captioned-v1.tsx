// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 图注组（captioned_v1）
 * 情绪：obsidian | 骨架：grid | 图位：3
 * 三联大图，每图下接「标题 + 两行说明」图注块；金融编辑「图说」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CaptionedV1Item {
  url?: string;
  caption?: string;
  note?: string;
}
export interface Theme10CaptionedV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10CaptionedV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 3;

export const theme10CaptionedV1Meta: LayoutMeta = {
  id: 'theme10_captioned_v1',
  theme: 'theme10',
  role: 'gallery',
  displayName: 'Theme 10 图注组',
  description: '三联大图 + 标题/说明图注',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `图 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['captioned', 'gold-index', 'obsidian'],
  contentShape: 'captioned',
};

export const theme10CaptionedV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '图说' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Plates' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三张图，各配一段值得读两遍的说明' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '图说不是图注的加长版。它把画面里没说出来的因果，补成一句话。' },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      minItems: 1,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, () => ({ url: '', caption: '', note: '' })),
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '图注标题', type: 'text', inlineEditable: true },
        { key: 'note', label: '图注说明', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '图说' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '41' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10CaptionedV1(props: Theme10CaptionedV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10CaptionedV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-captioned">
      <div className="lp-theme10-captioned-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-captioned-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-captioned-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-captioned-grid">
        {images.map((img, i) => (
          <figure className="lp-theme10-captioned-cell lp-rise" style={{ animationDelay: `${160 + i * 30}ms` }} key={i}>
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传图 ${i + 1}`}
              className="lp-theme10-captioned-photo"
            />
            <figcaption className="lp-theme10-captioned-cap">
              {img.caption && (
                <EditableField prop={`images.${i}.caption`} slideIdx={s} editable={e} as="span" className="t10-cap-title">{img.caption}</EditableField>
              )}
              {img.note && (
                <EditableField prop={`images.${i}.note`} slideIdx={s} editable={e} as="span" className="t10-cap-note">{img.note}</EditableField>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
