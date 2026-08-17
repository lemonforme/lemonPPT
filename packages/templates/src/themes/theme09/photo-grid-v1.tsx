// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像九宫格（photo_grid_v1）
 * 基底：纸 | 骨架：grid | 图位：4
 *
 * 粗规线标题带 + 2×2 影像矩阵，每个图位带胶片齿孔边与图注，
 * 当前焦点图用专色描边。杂志「图辑 / 现场」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09PhotoGridV1Item {
  url?: string;
  caption?: string;
}

export interface Theme09PhotoGridV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  titleEn?: string;
  images?: Theme09PhotoGridV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PhotoGridV1Meta: LayoutMeta = {
  id: 'theme09_photo_grid_v1',
  theme: 'theme09',
  role: 'gallery',
  displayName: 'Theme 09 影像九宫格',
  description: '2×2 影像矩阵 + 图注 + 专色焦点描边，适合图辑 / 现场栏',
  needsMedia: true,
  mediaSlots: [
    { name: '影像 1', fieldPath: 'images.0.url', canPresetMedia: true },
    { name: '影像 2', fieldPath: 'images.1.url', canPresetMedia: true },
    { name: '影像 3', fieldPath: 'images.2.url', canPresetMedia: true },
    { name: '影像 4', fieldPath: 'images.3.url', canPresetMedia: true },
  ],
  tags: ['photo', 'grid', 'gallery', 'editorial'],
  contentShape: 'photo-grid',
};

export const theme09PhotoGridV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '现场' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'In Pictures' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '十二城现场' },
    { key: 'titleEn', label: '英文标注', type: 'text', inlineEditable: true, defaultValue: 'Field Notes' },
    {
      key: 'images',
      label: '影像',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { url: '', caption: '上海 · 清晨的便利店' },
        { url: '', caption: '成都 · 巷口的茶铺' },
        { url: '', caption: '深圳 · 产线夜班' },
        { url: '', caption: '西安 · 城墙下的市集' },
      ],
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '图注', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '现场 · 影像九宫格' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '16' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09PhotoGridV1(props: Theme09PhotoGridV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  // 兜底：数据缺失时仍渲染 4 个空图位，保证编辑器里上传位始终可见可点
  const rawImages = (props.images ?? []).slice(0, 4);
  const images: Theme09PhotoGridV1Item[] = rawImages.length > 0 ? rawImages : [{}, {}, {}, {}];

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-photogrid">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-photogrid-head lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-photogrid-title">
          {title}
        </EditableField>
        {titleEn && (
          <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-photogrid-en">
            {titleEn}
          </EditableField>
        )}
      </div>

      <div className="lp-theme09-photogrid-grid">
        {images.map((it, i) => (
          <figure
            key={i}
            className={`lp-theme09-photogrid-cell lp-rise${i === 0 ? ' focus' : ''}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <InkPhoto
              prop={`images.${i}.url`}
              src={it.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              sprockets
              hint={`影像 ${i + 1}`}
            />
            {it.caption && (
              <figcaption className="lp-theme09-photogrid-cap">
                <EditableField prop={`images.${i}.caption`} slideIdx={s} editable={e} as="span">
                  {it.caption}
                </EditableField>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
