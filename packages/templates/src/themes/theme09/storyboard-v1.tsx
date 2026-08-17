// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 分镜格（storyboard_v1）
 * 基底：纸 | 骨架：grid | 图位：6
 *
 * 2×3 分镜网格，每格带编号与图注，模拟影视分镜 / 步骤拆解。
 * 杂志「流程 / 步骤 / 现场记录」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09StoryboardV1Item {
  url?: string;
  caption?: string;
}

export interface Theme09StoryboardV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  titleEn?: string;
  images?: Theme09StoryboardV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 6;

export const theme09StoryboardV1Meta: LayoutMeta = {
  id: 'theme09_storyboard_v1',
  theme: 'theme09',
  role: 'gallery',
  displayName: 'Theme 09 分镜格',
  description: '2×3 分镜网格 + 编号图注，流程 / 步骤 / 现场记录栏',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `分镜 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['photo', 'storyboard', 'grid', 'editorial'],
  contentShape: 'storyboard',
};

export const theme09StoryboardV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '流程' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Storyboard' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一次改版的三十个昼夜' },
    { key: 'titleEn', label: '英文标注', type: 'text', inlineEditable: true, defaultValue: 'Thirty Nights of a Redesign' },
    {
      key: 'images',
      label: '分镜',
      type: 'array',
      minItems: 2,
      maxItems: COUNT,
      defaultValue: [
        { url: '', caption: '01 · 立项' },
        { url: '', caption: '02 · 调研' },
        { url: '', caption: '03 · 草图' },
        { url: '', caption: '04 · 评审' },
        { url: '', caption: '05 · 灰度' },
        { url: '', caption: '06 · 上线' },
      ],
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'caption', label: '图注', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '流程 · 分镜格' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '24' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09StoryboardV1(props: Theme09StoryboardV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const raw = (props.images ?? []).slice(0, COUNT);
  // 兜底：始终渲染 6 格，保证上传位始终可见可点
  const images: Theme09StoryboardV1Item[] = Array.from({ length: COUNT }, (_, i) => raw[i] ?? {});

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-storyboard">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-storyboard-head lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-storyboard-title">
          {title}
        </EditableField>
        {titleEn && (
          <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-storyboard-en">
            {titleEn}
          </EditableField>
        )}
      </div>

      <div className="lp-theme09-storyboard-grid">
        {images.map((it, i) => (
          <figure key={i} className="lp-theme09-storyboard-cell lp-rise" style={{ animationDelay: `${i * 45}ms` }}>
            <span className="lp-theme09-storyboard-no" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <InkPhoto
              prop={`images.${i}.url`}
              src={it.url}
              slideIdx={s}
              editable={e}
              ratio="fill"
              hint={`分镜 ${i + 1}`}
            />
            {it.caption && (
              <figcaption className="lp-theme09-storyboard-cap">
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
