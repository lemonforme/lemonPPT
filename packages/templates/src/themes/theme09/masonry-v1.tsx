// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 瀑布影像（masonry_v1）
 * 基底：纸 | 骨架：grid | 图位：8
 *
 * 瀑布流不等高排列，专色卡片穿插。
 * 杂志「瀑布影像 / 群像墙」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet, photoSlots } from './shared.js';

interface MasonryItem {
  title: string;
  subtitle?: string;
}

export interface Theme09MasonryV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  items?: MasonryItem[];
  images?: Array<{ url?: string; caption?: string }>;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09MasonryV1Meta: LayoutMeta = {
  id: 'theme09_masonry_v1',
  theme: 'theme09',
  role: 'gallery',
  displayName: 'Theme 09 瀑布影像',
  description: '瀑布流不等高排列 + 专色卡片穿插，群像墙 / 视觉墙栏',
  needsMedia: true,
  mediaSlots: [{ name: '瀑布影像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['gallery', 'masonry', 'grid', 'paper'],
  contentShape: 'masonry',
};

export const theme09MasonryV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '10' },
    { key: 'sectionEn', label: '章节英文', type: 'text', inlineEditable: true, defaultValue: 'Masonry · Visual Wall' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '瀑布影像 · 群像墙' },
    { key: 'items', label: '卡片列表', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'images', label: '图片组', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '瀑布 · 群像' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '14' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_ITEMS: MasonryItem[] = [
  { title: '发布会', subtitle: 'Launch' },
  { title: '实验室', subtitle: 'Lab' },
  { title: '创始团队', subtitle: 'Founders' },
  { title: '数据中心', subtitle: 'Data Center' },
  { title: '用户现场', subtitle: 'On-site' },
  { title: '城市夜景', subtitle: 'Night' },
];

/** 瀑布高度档位（模拟不等高） */
const HEIGHTS = ['tall', 'medium', 'short', 'tall', 'medium', 'short'];

export function Theme09MasonryV1(props: Theme09MasonryV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, items = [], images = [],
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const slots = photoSlots(Math.max(safeItems.length, 6), 8);
  const safeImages = [...images];
  while (safeImages.length < slots.length) safeImages.push({});

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-masonry">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <h2 className="lp-theme09-masonry-title lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e}>{title}</EditableField>
      </h2>

      <div className="lp-theme09-masonry-wall">
        {slots.map((i) => {
          const item = safeItems[i] || { title: `项目 ${i + 1}` };
          const h = HEIGHTS[i % HEIGHTS.length];
          return (
            <figure key={i} className={`lp-theme09-masonry-card ${h} ${i === 0 ? 'featured' : ''}`}>
              <InkPhoto
                prop={`images.${i}.url`}
                src={safeImages[i]?.url}
                slideIdx={s}
                editable={e}
                ratio="4:3"
                hint="上传影像"
              >
                <span className="lp-theme09-masonry-num">{String(i + 1).padStart(2, '0')}</span>
              </InkPhoto>
              <figcaption className="lp-theme09-masonry-caption">
                <EditableField prop={`items.${i}.title`} slideIdx={s} editable={e} as="span" className="lp-theme09-masonry-title">
                  {item.title}
                </EditableField>
                {item.subtitle && <span className="lp-theme09-masonry-sub">{item.subtitle}</span>}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
