// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 陈列展（exhibit_v1）
 * 情绪：aurora | 骨架：grid | 图位：1 + 展签文本
 * 左侧带框展品影像 + 右侧展签（标题/年代/说明）；金融编辑「展品」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10ExhibitV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  meta?: string;
  desc?: string;
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10ExhibitV1Meta: LayoutMeta = {
  id: 'theme10_exhibit_v1',
  theme: 'theme10',
  role: 'image',
  displayName: 'Theme 10 陈列展',
  description: '带框展品 + 展签文本',
  needsMedia: true,
  mediaSlots: [{ name: '展品影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['exhibit', 'gold-index', 'aurora'],
  contentShape: 'exhibit',
};

export const theme10ExhibitV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '展品' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Exhibit' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '展名', type: 'text', inlineEditable: true, defaultValue: '一件被摆进展柜的标本，和它背后的方法' },
    { key: 'meta', label: '展签信息', type: 'text', inlineEditable: true, defaultValue: '样本 · 2021—2026 · 数据采集' },
    { key: 'desc', label: '说明', type: 'textarea', inlineEditable: true, defaultValue: '展签不写结论，只写方法与边界。读者站在柜前，自己决定要不要相信它。' },
    { key: 'imageUrl', label: '展品影像', type: 'image', inlineEditable: false, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '展品' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '47' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10ExhibitV1(props: Theme10ExhibitV1Props): ReactNode {
  const { section, mark, title, meta, desc, imageUrl, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-exhibit">
      <div className="lp-theme10-exhibit-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-exhibit-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
      </div>

      <div className="lp-theme10-exhibit-body">
        <figure className="lp-theme10-exhibit-figure lp-rise">
          <EditorialPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={s}
            editable={e}
            ratio="fill"
            fit="cover"
            hint="点击上传展品影像"
            className="lp-theme10-exhibit-photo"
          />
        </figure>
        <aside className="lp-theme10-exhibit-label lp-rise" style={{ animationDelay: '160ms' }}>
          {meta && (
            <EditableField prop="meta" slideIdx={s} editable={e} as="div" className="lp-theme10-exhibit-meta">{meta}</EditableField>
          )}
          <div className="lp-theme10-exhibit-rule" />
          {desc && (
            <EditableField prop="desc" slideIdx={s} editable={e} as="p" className="lp-theme10-exhibit-desc">{desc}</EditableField>
          )}
        </aside>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
