// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 全幅横影（photo_panorama_v1）
 * 基底：墨 | 骨架：full-bleed | 图位：1
 *
 * 满版横幅影像铺底（底部压暗蒙版），顶部刊头，底部大字标题 + 图注横幅。
 * 杂志「跨页大图 / 卷首跨页」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09PhotoPanoramaV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  titleEn?: string;
  caption?: string;
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PhotoPanoramaV1Meta: LayoutMeta = {
  id: 'theme09_photo_panorama_v1',
  theme: 'theme09',
  role: 'image',
  displayName: 'Theme 09 全幅横影',
  description: '满版横幅影像 + 底部压暗蒙版 + 大字标题图注，跨页大图 / 卷首跨页栏',
  needsMedia: true,
  mediaSlots: [{ name: '横幅影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['photo', 'panorama', 'full-bleed', 'editorial'],
  contentShape: 'photo-panorama',
};

export const theme09PhotoPanoramaV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '跨页' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Spread' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '横贯十二座城市的，是一条看不见的主线' },
    { key: 'titleEn', label: '英文标注', type: 'text', inlineEditable: true, defaultValue: 'A Single Thread Across Twelve Cities' },
    { key: 'caption', label: '图注', type: 'text', inlineEditable: true, defaultValue: '摄影 / 品牌与内容中心 · 2026 春' },
    { key: 'imageUrl', label: '横幅影像', type: 'image', defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '跨页 · 全幅横影' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '05' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09PhotoPanoramaV1(props: Theme09PhotoPanoramaV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn, caption, imageUrl,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  return (
    <Sheet substrate="ink" frame="full-bleed" className="lp-theme09-panorama" grain={false}>
      <InkPhoto
        prop="imageUrl"
        src={imageUrl}
        slideIdx={s}
        editable={e}
        ratio="fill"
        scrim="bottom"
        hint="点击上传横幅影像"
      />

      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-panorama-inner">
        <div className="lp-theme09-panorama-head lp-rise">
          {titleEn && (
            <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-panorama-en">
              {titleEn}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-panorama-title">
            {title}
          </EditableField>
        </div>
        {caption && (
          <EditableField prop="caption" slideIdx={s} editable={e} as="p" className="lp-theme09-panorama-cap lp-rise">
            {caption}
          </EditableField>
        )}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
