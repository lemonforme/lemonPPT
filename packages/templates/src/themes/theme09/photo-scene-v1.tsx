// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 场景通栏（photo_scene_v1）
 * 基底：墨 | 骨架：full-bleed | 图位：1
 *
 * 通栏场景图 + 标签云 + 侧边导轨。
 * 杂志「场景通栏 / 视觉」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09PhotoSceneV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  tags?: string;
  caption?: string;
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PhotoSceneV1Meta: LayoutMeta = {
  id: 'theme09_photo_scene_v1',
  theme: 'theme09',
  role: 'image',
  displayName: 'Theme 09 场景通栏',
  description: '通栏场景图 + 标签云 + 侧边导轨，场景通栏 / 视觉栏',
  needsMedia: true,
  mediaSlots: [{ name: '场景影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['scene', 'full-bleed', 'photo', 'ink'],
  contentShape: 'photo-scene',
};

export const theme09PhotoSceneV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '10' },
    { key: 'sectionEn', label: '章节英文', type: 'text', inlineEditable: true, defaultValue: 'CHAPTER' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: '视觉' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '资本与算力的浪潮' },
    { key: 'titleEn', label: '英文标题', type: 'text', inlineEditable: true, defaultValue: 'Capital × Compute' },
    { key: 'tags', label: '标签云', type: 'text', inlineEditable: true, defaultValue: '2024 · 资本大年,湾区 63.9%' },
    { key: 'caption', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '在这一年，资金以前所未有的密度涌向少数团队 —— 每一笔大额融资，都是一次对方向的押注。' },
    { key: 'imageUrl', label: '场景影像', type: 'image', defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '场景 · 通栏' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '18' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09PhotoSceneV1(props: Theme09PhotoSceneV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn, tags = '', caption, imageUrl,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  const rawTags = Array.isArray(tags) ? tags.join(',') : (typeof tags === 'string' ? tags : String(tags || ''));
  const safeTags: string[] = rawTags.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean);

  return (
    <Sheet substrate="ink" frame="full-bleed" className="lp-theme09-photoscene" grain={false}>
      <InkPhoto
        prop="imageUrl"
        src={imageUrl}
        slideIdx={s}
        editable={e}
        ratio="fill"
        scrim="bottom"
        hint="上传场景影像"
      />

      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} variant="bare" />

      <div className="lp-theme09-photoscene-inner">
        <div className="lp-theme09-photoscene-head lp-rise">
          {!!titleEn && (
            <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-photoscene-en">
              {String(titleEn)}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-photoscene-title">
            {String(title)}
          </EditableField>
        </div>

        {/* 标签云 */}
        <div className="lp-theme09-photoscene-tags">
          {safeTags.map((tag, i) => (
            <span key={i} className="lp-theme09-photoscene-tag lp-rise">
              <EditableField prop={`tags.${i}`} slideIdx={s} editable={e}>{tag}</EditableField>
            </span>
          ))}
        </div>

        {caption && (
          <p className="lp-theme09-photoscene-cap lp-rise">
            <EditableField prop="caption" slideIdx={s} editable={e}>{caption}</EditableField>
          </p>
        )}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
