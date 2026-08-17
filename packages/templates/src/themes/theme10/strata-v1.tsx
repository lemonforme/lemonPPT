// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 横向影像带（strata_v1）
 * 情绪：obsidian | 骨架：full-bleed | 图位：4
 * 满宽四联影像带 + 图注；金融编辑「现场」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10StrataV1Item {
  url?: string;
  caption?: string;
}
export interface Theme10StrataV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10StrataV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 4;

export const theme10StrataV1Meta: LayoutMeta = {
  id: 'theme10_strata_v1',
  theme: 'theme10',
  role: 'image',
  displayName: 'Theme 10 横向影像带',
  description: '满宽四联影像带 + 图注',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `影像带 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['strata', 'gold-index', 'obsidian'],
  contentShape: 'strata',
};

export const theme10StrataV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '现场' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'On Site' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一条产线，四段被记录的停顿' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '我们用同一台相机，在四个时间点回到同一条产线，记录资本如何以不同的速度流过它。' },
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
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '现场' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '26' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10StrataV1(props: Theme10StrataV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10StrataV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme10-strata">
      <div className="lp-theme10-strata-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-strata-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-strata-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-strata-band">
        {images.map((img, i) => (
          <figure className="lp-theme10-strata-cell lp-rise" style={{ animationDelay: `${160 + i * 50}ms` }} key={i}>
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传影像带 ${i + 1}`}
              className="lp-theme10-strata-photo"
            />
            {img.caption && (
              <figcaption className="lp-theme10-strata-cap">
                <span className="t10-idx">{String(i + 1).padStart(2, '0')}</span>
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
