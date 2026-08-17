// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 陈列橱窗（showcase_v1）
 * 情绪：aurora | 骨架：stage | 图位：5
 * 左侧主图（通栏高）+ 右侧 2×2 缩略；金融编辑「陈列」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10ShowcaseV1Item {
  url?: string;
  caption?: string;
}
export interface Theme10ShowcaseV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10ShowcaseV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 5;

export const theme10ShowcaseV1Meta: LayoutMeta = {
  id: 'theme10_showcase_v1',
  theme: 'theme10',
  role: 'gallery',
  displayName: 'Theme 10 陈列橱窗',
  description: '主图 + 2×2 缩略陈列',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: i === 0 ? '主图' : `缩略 ${i}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['showcase', 'gold-index', 'aurora'],
  contentShape: 'showcase',
};

export const theme10ShowcaseV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '陈列' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Showcase' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一件主图，四张缩略，把一组作品摆进橱窗' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '陈列讲究主次。主图占住视线，缩略负责补充，读者一眼就读出重点。' },
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
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '陈列' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '42' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10ShowcaseV1(props: Theme10ShowcaseV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10ShowcaseV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme10-showcase">
      <div className="lp-theme10-showcase-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-showcase-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-showcase-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-showcase-grid">
        {/* 主图 */}
        <figure className="lp-theme10-showcase-hero lp-rise" style={{ animationDelay: '160ms' }}>
          <EditorialPhoto
            prop="images.0.url"
            src={images[0].url}
            slideIdx={s}
            editable={e}
            ratio="fill"
            fit="cover"
            hint="点击上传主图"
            className="lp-theme10-showcase-photo"
          />
          {images[0].caption && (
            <figcaption className="lp-theme10-showcase-cap">
              <EditableField prop="images.0.caption" slideIdx={s} editable={e} as="span">{images[0].caption}</EditableField>
            </figcaption>
          )}
        </figure>
        {/* 2×2 缩略 */}
        {images.slice(1).map((img, i) => (
          <figure className="lp-theme10-showcase-thumb lp-rise" style={{ animationDelay: `${200 + i * 30}ms` }} key={i + 1}>
            <EditorialPhoto
              prop={`images.${i + 1}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传缩略 ${i + 2}`}
              className="lp-theme10-showcase-photo"
            />
            {img.caption && (
              <figcaption className="lp-theme10-showcase-cap">
                <EditableField prop={`images.${i + 1}.caption`} slideIdx={s} editable={e} as="span">{img.caption}</EditableField>
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
