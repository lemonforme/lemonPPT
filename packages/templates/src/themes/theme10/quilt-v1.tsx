// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 拼布（quilt_v1）
 * 情绪：obsidian | 骨架：grid | 图位：8
 * 4×2 紧凑影像拼布（无线条图注）；金融编辑「图集」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10QuiltV1Item {
  url?: string;
}
export interface Theme10QuiltV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10QuiltV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 8;

export const theme10QuiltV1Meta: LayoutMeta = {
  id: 'theme10_quilt_v1',
  theme: 'theme10',
  role: 'gallery',
  displayName: 'Theme 10 拼布',
  description: '4×2 紧凑影像拼布',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `图块 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['quilt', 'gold-index', 'obsidian'],
  contentShape: 'quilt',
};

export const theme10QuiltV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '图集' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Quilt' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '八块拼布，拼出一组不用排序的视觉记忆' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '拼布不解释。它把八张图并置，让读者自己找出它们之间的缝隙与呼应。' },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      minItems: 1,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, () => ({ url: '' })),
      itemSchema: [{ key: 'url', label: '图片', type: 'image' }],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '图集' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '46' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10QuiltV1(props: Theme10QuiltV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10QuiltV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-quilt">
      <div className="lp-theme10-quilt-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-quilt-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-quilt-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-quilt-grid">
        {images.map((img, i) => (
          <figure className="lp-theme10-quilt-cell lp-rise" style={{ animationDelay: `${160 + i * 25}ms` }} key={i}>
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传图块 ${i + 1}`}
              className="lp-theme10-quilt-photo"
            />
          </figure>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
