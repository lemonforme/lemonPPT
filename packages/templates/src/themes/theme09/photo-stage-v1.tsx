// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 焦点舞台（photo_stage_v1）
 * 基底：纸 | 骨架：stage | 图位：1
 *
 * 中性纸面舞台，单幅焦点影像以「装裱」形式居中陈列，
 * 上方标题、下方图注，四角裁切线强化印刷质感。杂志「焦点 / 单图大图」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09PhotoStageV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  caption?: string;
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PhotoStageV1Meta: LayoutMeta = {
  id: 'theme09_photo_stage_v1',
  theme: 'theme09',
  role: 'image',
  displayName: 'Theme 09 焦点舞台',
  description: '单幅焦点影像居中装裱陈列，上标题下圖注，焦点 / 单图大图栏',
  needsMedia: true,
  mediaSlots: [{ name: '焦点影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['photo', 'stage', 'focus', 'editorial'],
  contentShape: 'photo-stage',
};

export const theme09PhotoStageV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '焦点' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Spotlight' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一张照片里的全部答案' },
    { key: 'caption', label: '图注', type: 'text', inlineEditable: true, defaultValue: '摄影 / 品牌与内容中心 · 2026 春' },
    { key: 'imageUrl', label: '焦点影像', type: 'image', defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '焦点 · 单图大图' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '21' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09PhotoStageV1(props: Theme09PhotoStageV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, caption, imageUrl,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  return (
    <Sheet substrate="paper" frame="stage" className="lp-theme09-stage" cropMarks>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-stage-title lp-rise">
        {title}
      </EditableField>

      <div className="lp-theme09-stage-frame lp-rise">
        <InkPhoto
          prop="imageUrl"
          src={imageUrl}
          slideIdx={s}
          editable={e}
          ratio="fill"
          hint="点击上传焦点影像"
        />
      </div>

      {caption && (
        <EditableField prop="caption" slideIdx={s} editable={e} as="p" className="lp-theme09-stage-cap lp-rise">
          {caption}
        </EditableField>
      )}

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
