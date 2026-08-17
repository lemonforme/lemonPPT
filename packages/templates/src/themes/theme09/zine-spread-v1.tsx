// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 杂志跨页（zine_spread_v1）
 * 基底：纸 | 骨架：spread | 图位：3
 *
 * 跨页大版：左三栏文字 + 右出血大图，底部小图组。
 * 杂志「跨页 / 跨页报道」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet, Standfirst, photoSlots } from './shared.js';

export interface Theme09ZineSpreadV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  titleEn?: string;
  standfirst?: string;
  body?: string;
  pullquote?: string;
  imageUrl?: string;
  subImages?: string;
  figLabel?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ZineSpreadV1Meta: LayoutMeta = {
  id: 'theme09_zine_spread_v1',
  theme: 'theme09',
  role: 'content',
  displayName: 'Theme 09 杂志跨页',
  description: '跨页大版：左三栏文字右出血图 + 底部小图组，杂志跨页 / 报道栏',
  needsMedia: true,
  mediaSlots: [
    { name: '主影像', fieldPath: 'imageUrl', canPresetMedia: true },
    { name: '辅图', fieldPath: 'subImages', canPresetMedia: true },
  ],
  tags: ['spread', 'editorial', 'photo', 'paper'],
  contentShape: 'zine-spread',
};

export const theme09ZineSpreadV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '03' },
    { key: 'sectionEn', label: '章节英文', type: 'text', inlineEditable: true, defaultValue: 'FEATURE' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: '跨页报道' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '钱、算力与叙事的合流' },
    { key: 'titleEn', label: '英文标题', type: 'text', inlineEditable: true, defaultValue: 'Money, Compute & Narrative' },
    { key: 'standfirst', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '024 年，资本以前所未有的密度涌向少数能讲好 AGI 故事的团队 —— 单笔金额节节攀升，年未进入白热化。' },
    { key: 'body', label: '正文', type: 'textarea', inlineEditable: true, defaultValue: '与此同时，算力与数据的中游率先兑现现金流，成为更稳的下注；垂直应用则在「能否拿到续约」中被重新定价。' },
    { key: 'pullquote', label: '引语', type: 'textarea', inlineEditable: true, defaultValue: '「在这一年，每一笔大额融资，都是一次对方向的押注。」' },
    { key: 'imageUrl', label: '主影像', type: 'image', defaultValue: '' },
    { key: 'subImages', label: '辅图组', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'figLabel', label: '图号', type: 'text', inlineEditable: true, defaultValue: 'FIG. 01' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '跨页 · 报道' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '17' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09ZineSpreadV1(props: Theme09ZineSpreadV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn, standfirst, body, pullquote,
    imageUrl, figLabel,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  const subSlots = photoSlots(2, 3);
  const safeSubImages: Array<{ url?: string }> = subSlots.map(() => ({}));

  return (
    <Sheet substrate="paper" frame="spread" className="lp-theme09-zinespread">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      {/* 左侧文字区 */}
      <div className="lp-theme09-zinespread-text">
        <div className="lp-theme09-zinespread-head lp-rise">
          {titleEn && (
            <span className="lp-theme09-zinespread-num">{section || '03'}</span>
          )}
          <h2 className="lp-theme09-zinespread-title">
            <EditableField prop="title" slideIdx={s} editable={e}>{title}</EditableField>
          </h2>
          {titleEn && (
            <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-zinespread-titleen">
              {titleEn}
            </EditableField>
          )}
        </div>

        {standfirst && (
          <Standfirst text={standfirst} slideIdx={s} editable={e} prop="standfirst" columns={1} className="lp-theme09-zinespread-sf" />
        )}

        {body && (
          <div className="lp-theme09-zinespread-body">
            <EditableField prop="body" slideIdx={s} editable={e} as="p">{body}</EditableField>
          </div>
        )}

        {pullquote && (
          <aside className="lp-theme09-zinespread-pq">
            <EditableField prop="pullquote" slideIdx={s} editable={e}>{pullquote}</EditableField>
          </aside>
        )}

        <div className="lp-theme09-zinespread-subphotos">
          {subSlots.map((i) => (
            <InkPhoto
              key={i}
              prop={`subImages.${i}.url`}
              src={safeSubImages[i]?.url}
              slideIdx={s}
              editable={e}
              ratio="16:9"
              hint="上传辅图"
              showSpec={false}
            />
          ))}
        </div>

        {figLabel && (
          <span className="lp-theme09-zinespread-figlabel">
            <EditableField prop="figLabel" slideIdx={s} editable={e}>{figLabel}</EditableField>
          </span>
        )}
      </div>

      {/* 右侧出血大图 */}
      <figure className="lp-theme09-zinespread-hero">
        <InkPhoto
          prop="imageUrl"
          src={imageUrl}
          slideIdx={s}
          editable={e}
          ratio="3:4"
          fit="cover"
          hint="上传主影像"
        />
      </figure>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
