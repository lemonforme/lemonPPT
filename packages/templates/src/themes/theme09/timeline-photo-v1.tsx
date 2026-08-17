// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像编年（timeline_photo_v1）
 * 基底：纸 | 骨架：sidebar | 图位：4
 *
 * 左侧年份主轴（装订线式竖轴 + 年份节点），右侧四段时间影像卡片，
 * 卡片含影像 + 标题 + 说明。杂志「大事记 / 里程碑」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09TimelinePhotoV1Item {
  url?: string;
  year?: string;
  title?: string;
  note?: string;
}

export interface Theme09TimelinePhotoV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  images?: Theme09TimelinePhotoV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 4;

export const theme09TimelinePhotoV1Meta: LayoutMeta = {
  id: 'theme09_timeline_photo_v1',
  theme: 'theme09',
  role: 'timeline',
  displayName: 'Theme 09 影像编年',
  description: '左侧年份主轴 + 右侧四段影像卡片，大事记 / 里程碑栏',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `影像 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['photo', 'timeline', 'sidebar', 'editorial'],
  contentShape: 'timeline-photo',
};

export const theme09TimelinePhotoV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '大事记' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Timeline' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四年，四帧' },
    {
      key: 'images',
      label: '影像',
      type: 'array',
      minItems: 2,
      maxItems: COUNT,
      defaultValue: [
        { url: '', year: '2023', title: '起点', note: '第一版草图在白板上诞生' },
        { url: '', year: '2024', title: '打磨', note: '内测用户突破一万' },
        { url: '', year: '2025', title: '扩张', note: '三个城市同时落地' },
        { url: '', year: '2026', title: '此刻', note: '年度特刊正式付印' },
      ],
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'year', label: '年份', type: 'text', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'note', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '大事记 · 影像编年' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '40' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09TimelinePhotoV1(props: Theme09TimelinePhotoV1Props): ReactNode {
  const {
    section, sectionEn, mark, title,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const raw = (props.images ?? []).slice(0, COUNT);
  const images: Theme09TimelinePhotoV1Item[] = Array.from({ length: COUNT }, (_, i) => raw[i] ?? {});

  return (
    <Sheet substrate="paper" frame="sidebar" className="lp-theme09-tlphoto">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-tlphoto-title lp-rise">
        {title}
      </EditableField>

      <div className="lp-theme09-tlphoto-body">
        <span className="lp-theme09-tlphoto-axis" aria-hidden="true" />
        <ul className="lp-theme09-tlphoto-list">
          {images.map((it, i) => (
            <li key={i} className="lp-theme09-tlphoto-item lp-rise" style={{ animationDelay: `${i * 55}ms` }}>
              <span className="lp-theme09-tlphoto-node" aria-hidden="true" />
              <span className="lp-theme09-tlphoto-year">
                <EditableField prop={`images.${i}.year`} slideIdx={s} editable={e} as="span">
                  {it.year}
                </EditableField>
              </span>
              <figure className="lp-theme09-tlphoto-card">
                <InkPhoto
                  prop={`images.${i}.url`}
                  src={it.url}
                  slideIdx={s}
                  editable={e}
                  ratio="fill"
                  hint={`影像 ${i + 1}`}
                />
                <figcaption className="lp-theme09-tlphoto-meta">
                  <EditableField prop={`images.${i}.title`} slideIdx={s} editable={e} as="span" className="lp-theme09-tlphoto-cardtitle">
                    {it.title}
                  </EditableField>
                  {it.note && (
                    <EditableField prop={`images.${i}.note`} slideIdx={s} editable={e} as="span" className="lp-theme09-tlphoto-note">
                      {it.note}
                    </EditableField>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
