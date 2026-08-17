// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像专题（photo_feature_v1）
 * 基底：纸 | 骨架：sidebar | 图位：1
 *
 * 右侧满版出血影像（底部压暗蒙版），左侧纸面板承载刊头 + 标题 + 导语，
 * 骑缝页脚横贯。杂志「专题开篇」的标准影像叙事结构。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet, Standfirst } from './shared.js';

export interface Theme09PhotoFeatureV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title: string;
  standfirst: string;
  caption?: string;
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PhotoFeatureV1Meta: LayoutMeta = {
  id: 'theme09_photo_feature_v1',
  theme: 'theme09',
  role: 'feature',
  displayName: 'Theme 09 影像专题',
  description: '满版影像 + 左侧纸面板标题导语，专题开篇的影像叙事版式',
  needsMedia: true,
  mediaSlots: [{ name: '专题影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['photo', 'feature', 'editorial', 'split'],
  contentShape: 'photo-feature',
};

export const theme09PhotoFeatureV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '专题' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Feature' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'kicker', label: '小标', type: 'text', inlineEditable: true, defaultValue: '现场 / On Site' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '在十二座城市的清晨里，重新认识我们的用户' },
    {
      key: 'standfirst',
      label: '导语',
      type: 'textarea',
      inlineEditable: true,
      defaultValue:
        '我们把提纲收到最短，把沉默留给对方。最有价值的答案，往往出现在对话的第三十分钟后——那些没被问卷覆盖的真实。',
    },
    { key: 'caption', label: '图注', type: 'text', inlineEditable: true, defaultValue: '摄影 / 品牌与内容中心 · 2026 春' },
    { key: 'imageUrl', label: '专题影像', type: 'image', defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '专题 · 影像叙事' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '15' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'FIELD' },
  ],
};

export function Theme09PhotoFeatureV1(props: Theme09PhotoFeatureV1Props): ReactNode {
  const {
    section, sectionEn, mark, kicker, title, standfirst, caption, imageUrl,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  return (
    <Sheet substrate="paper" frame="sidebar" className="lp-theme09-photofeat">
      <div className="lp-theme09-photofeat-panel">
        <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

        {kicker && (
          <EditableField prop="kicker" slideIdx={s} editable={e} as="span" className="lp-theme09-photofeat-kicker lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-photofeat-title lp-rise">
          {title}
        </EditableField>
        <Standfirst
          text={standfirst}
          prop="standfirst"
          slideIdx={s}
          editable={e}
          dropCap
          className="lp-rise"
        />
        {caption && (
          <EditableField prop="caption" slideIdx={s} editable={e} as="span" className="lp-theme09-photofeat-caption lp-rise">
            {caption}
          </EditableField>
        )}
      </div>

      <div className="lp-theme09-photofeat-media">
        <InkPhoto
          prop="imageUrl"
          src={imageUrl}
          slideIdx={s}
          editable={e}
          ratio="fill"
          scrim="bottom"
          hint="点击上传专题影像"
        />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
