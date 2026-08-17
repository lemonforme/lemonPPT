// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 三联影像（triptych_v1）
 * 情绪：ember | 骨架：grid | 图位：3
 * 三联等高影像并列，下接图注条；金融编辑「影像专题」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10TriptychV1Item {
  url?: string;
  caption?: string;
}
export interface Theme10TriptychV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10TriptychV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 3;

export const theme10TriptychV1Meta: LayoutMeta = {
  id: 'theme10_triptych_v1',
  theme: 'theme10',
  role: 'image',
  displayName: 'Theme 10 三联影像',
  description: '三联等高影像 + 图注条',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `三联图 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['triptych', 'gold-index', 'ember'],
  contentShape: 'triptych',
};

export const theme10TriptychV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '影像专题' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Triptych' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三种视角，同一笔资本流向' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '我们把镜头同时交给买方、卖方与监管，让同一宗交易在三种叙事里各自成立。' },
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
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '影像专题' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '24' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10TriptychV1(props: Theme10TriptychV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10TriptychV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-triptych">
      <div className="lp-theme10-triptych-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-triptych-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-triptych-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-triptych-grid">
        {images.map((img, i) => (
          <figure className="lp-theme10-triptych-cell lp-rise" style={{ animationDelay: `${160 + i * 60}ms` }} key={i}>
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传三联图 ${i + 1}`}
              className="lp-theme10-triptych-photo"
            />
            {img.caption && (
              <figcaption className="lp-theme10-triptych-cap">
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
