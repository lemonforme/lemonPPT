// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 马赛克拼贴（mosaic_v1）
 * 情绪：aurora | 骨架：grid | 图位：6
 * 不规则 3×3 网格拼贴（宽窄错落），下接图注；金融编辑「视觉索引」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10MosaicV1Item {
  url?: string;
  caption?: string;
}
export interface Theme10MosaicV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10MosaicV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 6;

// 不规则跨格：宽窄错落，避免与 gallery2 的等宽 3×2 雷同
const SPANS = [
  { gc: '1 / 3', gr: '1 / 2' },
  { gc: '3 / 4', gr: '1 / 2' },
  { gc: '1 / 2', gr: '2 / 3' },
  { gc: '2 / 4', gr: '2 / 3' },
  { gc: '1 / 2', gr: '3 / 4' },
  { gc: '2 / 4', gr: '3 / 4' },
];

export const theme10MosaicV1Meta: LayoutMeta = {
  id: 'theme10_mosaic_v1',
  theme: 'theme10',
  role: 'gallery',
  displayName: 'Theme 10 马赛克拼贴',
  description: '不规则 3×3 视觉索引 + 图注',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `图块 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['mosaic', 'gold-index', 'aurora'],
  contentShape: 'mosaic',
};

export const theme10MosaicV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '视觉索引' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Index' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '六帧画面，拼出一组可被检索的视觉索引' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '马赛克不是堆砌。每一块都被安排了一个位置，宽窄之间藏着阅读的次序。' },
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
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '视觉索引' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '39' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10MosaicV1(props: Theme10MosaicV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10MosaicV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-mosaic">
      <div className="lp-theme10-mosaic-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-mosaic-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-mosaic-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-mosaic-grid">
        {images.map((img, i) => (
          <figure
            className="lp-theme10-mosaic-cell lp-rise"
            style={{ gridColumn: SPANS[i].gc, gridRow: SPANS[i].gr, animationDelay: `${160 + i * 30}ms` }}
            key={i}
          >
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传图块 ${i + 1}`}
              className="lp-theme10-mosaic-photo"
            />
            {img.caption && (
              <figcaption className="lp-theme10-mosaic-cap">
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
