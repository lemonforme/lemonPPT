// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 圆窗封面（cover_aperture_v1）
 * 基底：墨 | 骨架：stage | 图位：1
 *
 * 右侧圆形开窗露出影像，窗外做网点渐变扩散，外圈专色细环；
 * 左侧标题区走标准编辑层级。图位始终可点击上传。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { InkPhoto, Sheet, normalizeStrings } from './shared.js';

export interface Theme09CoverApertureV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  imageUrl?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CoverApertureV1Meta: LayoutMeta = {
  id: 'theme09_cover_aperture_v1',
  theme: 'theme09',
  role: 'cover',
  displayName: 'Theme 09 圆窗封面',
  description: '圆形开窗影像 + 网点渐变扩散 + 专色细环，适合人物专访/产品特写开篇',
  needsMedia: true,
  mediaSlots: [{ name: '圆窗影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['cover', 'aperture', 'photo', 'portrait'],
  contentShape: 'cover-aperture',
};

export const theme09CoverApertureV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '栏目标记', type: 'text', inlineEditable: true, defaultValue: 'Cover Story' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '看见\n那些被忽略的细节' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本期封面故事，我们把镜头对准了流程最末端的十二个人。' },
    {
      key: 'tags',
      label: '关键词',
      type: 'array',
      minItems: 0,
      maxItems: 5,
      defaultValue: ['人物访谈', '一线田野', '影像纪实'],
      itemSchema: [{ key: 'item', label: '关键词', type: 'text' }],
    },
    { key: 'imageUrl', label: '圆窗影像', type: 'image', defaultValue: '' },
  ],
};

export function Theme09CoverApertureV1(props: Theme09CoverApertureV1Props): ReactNode {
  const { tag, title, subtitle, imageUrl, _slideIdx: s, _editable: e } = props;
  const tags = normalizeStrings(props.tags).slice(0, 5);
  const titleLines = normalizeStrings(String(title ?? '').split('\n'));

  return (
    <Sheet substrate="ink" frame="stage" className="lp-theme09-coverap">
      <div className="lp-theme09-coverap-text">
        {tag && (
          <EditableField prop="tag" slideIdx={s} editable={e} as="span" className="lp-theme09-coverap-tag lp-rise">
            {tag}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-coverap-title lp-rise">
          {titleLines.length > 1
            ? titleLines.map((ln, i) => (
                <span key={i} style={{ display: 'block' }}>
                  {ln}
                </span>
              ))
            : title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme09-coverap-sub lp-rise">
            {subtitle}
          </EditableField>
        )}
        {tags.length > 0 && (
          <div className="lp-theme09-coverap-tags lp-rise" style={{ animationDelay: '140ms' }}>
            {tags.map((t, i) => (
              <EditableField key={i} prop={`tags.${i}`} slideIdx={s} editable={e} as="span">
                {t}
              </EditableField>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme09-coverap-window lp-rise" style={{ animationDelay: '90ms' }}>
        <InkPhoto
          prop="imageUrl"
          src={imageUrl}
          slideIdx={s}
          editable={e}
          ratio="1:1"
          aperture
          hint="点击上传封面影像"
        />
        <span className="lp-theme09-coverap-ring" aria-hidden="true" />
      </div>
    </Sheet>
  );
}
