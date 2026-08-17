// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 对照双图（compareimg_v1）
 * 情绪：ember | 骨架：spread | 图位：2
 * 左右双图对照（调整前/后或 A/B），每图带角标 + 图注；金融编辑「对照」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CompareImgV1Item {
  url?: string;
  tag?: string;
  caption?: string;
}
export interface Theme10CompareImgV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  images?: Theme10CompareImgV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 2;

export const theme10CompareImgV1Meta: LayoutMeta = {
  id: 'theme10_compareimg_v1',
  theme: 'theme10',
  role: 'comparison',
  displayName: 'Theme 10 对照双图',
  description: '左右双图对照 + 角标图注',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `对照图 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['compareimg', 'gold-index', 'ember'],
  contentShape: 'compareimg',
};

export const theme10CompareImgV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '横向对照' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Versus' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '同一口径下，两次结果的边界' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '我们把调整前后的两份截面放在一起，差异不在结论，而在你愿意相信哪一条边界。' },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      minItems: 1,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, () => ({ url: '', tag: '对照', caption: '' })),
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'tag', label: '角标', type: 'text', inlineEditable: true },
        { key: 'caption', label: '图注', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '横向对照' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '30' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10CompareImgV1(props: Theme10CompareImgV1Props): ReactNode {
  const { section, mark, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  // 渲染实际数组长度，而非固定补齐到 COUNT：减少条目时对应的对照格（背景 + 图注）应同步消失。
  const images: Theme10CompareImgV1Item[] = (props.images ?? []).slice(0, COUNT);

  return (
    <Sheet mood={mood} frame="spread" className="lp-theme10-compareimg">
      <div className="lp-theme10-compareimg-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-compareimg-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-compareimg-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-compareimg-grid">
        {images.map((img, i) => (
          <figure className="lp-theme10-compareimg-cell lp-rise" style={{ animationDelay: `${160 + i * 60}ms` }} key={i}>
            <span className="lp-theme10-compareimg-tag">
              <EditableField prop={`images.${i}.tag`} slideIdx={s} editable={e} as="span">{img.tag}</EditableField>
            </span>
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={img.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              fit="cover"
              hint={`点击上传对照图 ${i + 1}`}
              className="lp-theme10-compareimg-photo"
            />
            {img.caption && (
              <figcaption className="lp-theme10-compareimg-cap">
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
