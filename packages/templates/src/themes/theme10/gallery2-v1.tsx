// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 画廊六格（gallery2_v1）
 * 情绪：ember | 骨架：grid | 图位：6
 * 3×2 纯影像画廊，下接图注；金融编辑「作品集」栏（与 spark 的持仓快照区分：
 * gallery2 无涨跌幅，仅为图注式作品陈列）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10Gallery2V1Item {
  url?: string;
  caption?: string;
}
export interface Theme10Gallery2V1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10Gallery2V1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 6;

export const theme10Gallery2V1Meta: LayoutMeta = {
  id: 'theme10_gallery2_v1',
  theme: 'theme10',
  role: 'gallery',
  displayName: 'Theme 10 画廊六格',
  description: '3×2 纯影像画廊 + 图注',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `作品 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['gallery2', 'gold-index', 'ember'],
  contentShape: 'gallery2',
};

export const theme10Gallery2V1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '作品集' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Gallery' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '六件作品，一组可被反复翻看的视角' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '画廊不按涨跌排序。我们把六件作品排成两排，每个名字都值得被单独读一遍。' },
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
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '作品集' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '38' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10Gallery2V1(props: Theme10Gallery2V1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10Gallery2V1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-gallery2">
      <div className="lp-theme10-gallery2-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-gallery2-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-gallery2-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-gallery2-grid">
        {images.map((img, i) => (
          <figure className="lp-theme10-gallery2-cell lp-rise" style={{ animationDelay: `${160 + i * 30}ms` }} key={i}>
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传作品 ${i + 1}`}
              className="lp-theme10-gallery2-photo"
            />
            {img.caption && (
              <figcaption className="lp-theme10-gallery2-cap">
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
