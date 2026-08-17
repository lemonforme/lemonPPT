// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 徽章墙（medallions_v1）
 * 情绪：ember | 骨架：grid | 图位：6（圆形 + 标签）
 * 3×2 圆形徽章阵列，每枚下接标签；金融编辑「荣誉墙」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10MedallionsV1Item {
  url?: string;
  label?: string;
}
export interface Theme10MedallionsV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10MedallionsV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 6;

export const theme10MedallionsV1Meta: LayoutMeta = {
  id: 'theme10_medallions_v1',
  theme: 'theme10',
  role: 'gallery',
  displayName: 'Theme 10 徽章墙',
  description: '3×2 圆形徽章 + 标签',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `徽章 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['medallions', 'gold-index', 'ember'],
  contentShape: 'medallions',
};

export const theme10MedallionsV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '荣誉墙' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Medallions' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '六枚徽章，记录一组被反复验证的判断' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '圆形把注意力收成一个点。每一枚都代表一次被市场确认过的取舍。' },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      minItems: 1,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, () => ({ url: '', label: '' })),
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '荣誉墙' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '48' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10MedallionsV1(props: Theme10MedallionsV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10MedallionsV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-medallions">
      <div className="lp-theme10-medallions-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-medallions-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-medallions-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-medallions-grid">
        {images.map((img, i) => (
          <figure className="lp-theme10-medallions-cell lp-rise" style={{ animationDelay: `${160 + i * 30}ms` }} key={i}>
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="1:1"
              fit="cover"
              hint={`点击上传徽章 ${i + 1}`}
              className="lp-theme10-medallions-photo"
            />
            {img.label && (
              <figcaption className="lp-theme10-medallions-cap">
                <EditableField prop={`images.${i}.label`} slideIdx={s} editable={e} as="span">{img.label}</EditableField>
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
