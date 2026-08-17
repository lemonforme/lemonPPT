// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 杂志图文（magazine_v1）
 * 情绪：obsidian | 骨架：spread | 图位：2
 * 杂志跨页大版：左大图出血 + 右刊头 / 标题 / 导语 / 引文 + 右下小图。
 * 杂志「封面故事 / 专题」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10MagazineV1Item {
  url?: string;
  caption?: string;
}
export interface Theme10MagazineV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  pull?: string;
  images?: Theme10MagazineV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 2;

export const theme10MagazineV1Meta: LayoutMeta = {
  id: 'theme10_magazine_v1',
  theme: 'theme10',
  role: 'feature',
  displayName: 'Theme 10 杂志图文',
  description: '杂志跨页大版（左大图 + 右文 + 右下小图）',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: i === 0 ? '跨页大图' : '引文小图',
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['magazine', 'gold-index', 'obsidian'],
  contentShape: 'magazine',
};

export const theme10MagazineV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '封面故事' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Cover Story' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一季的争论，写在报表的脚注里' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '我们追踪了十二家公司的脚注变更，发现真正的变化从不出现在利润表，而藏在会计政策的那一行小字里。' },
    { key: 'pull', label: '引文', type: 'textarea', inlineEditable: true, defaultValue: '脚注，是诚实的人留给市场的暗号。' },
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
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '封面故事' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '12' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10MagazineV1(props: Theme10MagazineV1Props): ReactNode {
  const { section, mark, title, lead, pull, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  // 渲染实际数组长度，而非固定补齐到 COUNT：减少图片时右下小图应同步消失。
  const images: Theme10MagazineV1Item[] = (props.images ?? []).slice(0, COUNT);

  return (
    <Sheet mood={mood} frame="spread" className="lp-theme10-magazine">
      <div className="lp-theme10-magazine-figure">
        <EditorialPhoto
          prop="images.0.url"
          src={images[0]?.url}
          slideIdx={s}
          editable={e}
          ratio="fill"
          fit="cover"
          hint="点击上传跨页大图"
        />
        <div className="lp-theme10-magazine-scrim" aria-hidden="true" />
        {images[0]?.caption && (
          <figcaption className="lp-theme10-magazine-cap">
            <EditableField prop="images.0.caption" slideIdx={s} editable={e} as="span">{images[0].caption}</EditableField>
          </figcaption>
        )}
      </div>

      <div className="lp-theme10-magazine-body">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-magazine-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-magazine-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
        {pull && (
          <EditableField prop="pull" slideIdx={s} editable={e} as="blockquote" className="lp-theme10-magazine-pull lp-rise" style={{ animationDelay: '160ms' }}>{pull}</EditableField>
        )}
        {images[1] && (
          <EditorialPhoto
            prop="images.1.url"
            src={images[1].url}
            slideIdx={s}
            editable={e}
            ratio="16:9"
            fit="cover"
            hint="点击上传引文小图"
            className="lp-theme10-magazine-thumb"
          />
        )}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
