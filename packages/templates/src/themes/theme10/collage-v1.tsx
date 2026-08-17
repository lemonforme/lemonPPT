// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 自由拼贴（collage_v1）
 * 情绪：ember | 骨架：grid | 图位：4
 * 左侧大图（通栏高）+ 右侧三图竖叠，金线「胶带」图签；金融编辑「剪贴簿」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CollageV1Item {
  url?: string;
  caption?: string;
}
export interface Theme10CollageV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10CollageV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 4;

export const theme10CollageV1Meta: LayoutMeta = {
  id: 'theme10_collage_v1',
  theme: 'theme10',
  role: 'gallery',
  displayName: 'Theme 10 自由拼贴',
  description: '大图 + 三图竖叠 + 金线图签',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `图块 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['collage', 'gold-index', 'ember'],
  contentShape: 'collage',
};

export const theme10CollageV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '剪贴簿' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Scrapbook' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一张主图，三张注脚，拼成一段可被剪下的叙事' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '拼贴不追求整齐。主图定调，三张小图补叙，金线图签像被贴上去的便条。' },
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
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '剪贴簿' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '40' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10CollageV1(props: Theme10CollageV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const images: Theme10CollageV1Item[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-collage">
      <div className="lp-theme10-collage-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-collage-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-collage-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-collage-grid">
        {/* 主图：左侧通栏高 */}
        <figure className="lp-theme10-collage-hero lp-rise" style={{ animationDelay: '160ms' }}>
          <EditorialPhoto
            prop="images.0.url"
            src={images[0].url}
            slideIdx={s}
            editable={e}
            ratio="fill"
            fit="cover"
            hint="点击上传主图"
            className="lp-theme10-collage-photo"
          />
          {images[0].caption && (
            <figcaption className="lp-theme10-collage-tag">
              <EditableField prop="images.0.caption" slideIdx={s} editable={e} as="span">{images[0].caption}</EditableField>
            </figcaption>
          )}
        </figure>
        {/* 右侧三图竖叠 */}
        {images.slice(1).map((img, i) => (
          <figure className="lp-theme10-collage-cell lp-rise" style={{ animationDelay: `${200 + i * 30}ms` }} key={i + 1}>
            <EditorialPhoto
              prop={`images.${i + 1}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传图块 ${i + 2}`}
              className="lp-theme10-collage-photo"
            />
            {img.caption && (
              <figcaption className="lp-theme10-collage-tag">
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
