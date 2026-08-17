// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 对开双图（photo_duo_v1）
 * 基底：纸 | 骨架：stage | 图位：2
 *
 * 左图右图对开，中缝装订线分隔，各带图注与编号。
 * 杂志「对比 / 前后 / 双视角」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Gutter, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09PhotoDuoV1Item {
  url?: string;
  caption?: string;
}

export interface Theme09PhotoDuoV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  images?: Theme09PhotoDuoV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PhotoDuoV1Meta: LayoutMeta = {
  id: 'theme09_photo_duo_v1',
  theme: 'theme09',
  role: 'image',
  displayName: 'Theme 09 对开双图',
  description: '左图右图对开 + 中缝装订线 + 图注编号，适合对比 / 前后 / 双视角',
  needsMedia: true,
  mediaSlots: [
    { name: '左图', fieldPath: 'images.0.url', canPresetMedia: true },
    { name: '右图', fieldPath: 'images.1.url', canPresetMedia: true },
  ],
  tags: ['photo', 'duo', 'compare', 'editorial'],
  contentShape: 'photo-duo',
};

export const theme09PhotoDuoV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '对比' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Versus' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '两种清晨' },
    {
      key: 'images',
      label: '影像',
      type: 'array',
      minItems: 2,
      maxItems: 2,
      defaultValue: [
        { url: '', caption: '改造前 · 散点协作' },
        { url: '', caption: '改造后 · 一条主线' },
      ],
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '图注', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '对比 · 对开双图' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '27' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09PhotoDuoV1(props: Theme09PhotoDuoV1Props): ReactNode {
  const {
    section, sectionEn, mark, title,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  // 兜底：对开双图恒为 2 格，数据缺失时补空图位，保证上传位始终可见可点
  const rawImages = (props.images ?? []).slice(0, 2);
  const images: Theme09PhotoDuoV1Item[] = [rawImages[0] ?? {}, rawImages[1] ?? {}];

  return (
    <Sheet substrate="paper" frame="stage" className="lp-theme09-photoduo">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      {title && (
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-photoduo-title lp-rise">
          {title}
        </EditableField>
      )}

      <div className="lp-theme09-photoduo-stage">
        {images.map((it, i) => (
          <figure key={i} className="lp-theme09-photoduo-cell lp-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="lp-theme09-photoduo-no" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <InkPhoto
              prop={`images.${i}.url`}
              src={it.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              hint={`图 ${i + 1}`}
            />
            {it.caption && (
              <figcaption className="lp-theme09-photoduo-cap">
                <EditableField prop={`images.${i}.caption`} slideIdx={s} editable={e} as="span">
                  {it.caption}
                </EditableField>
              </figcaption>
            )}
          </figure>
        ))}
        <Gutter />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
