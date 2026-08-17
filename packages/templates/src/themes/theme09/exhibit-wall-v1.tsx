// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 陈列墙（exhibit_wall_v1）
 * 基底：纸 | 骨架：grid | 图位：8
 *
 * 展墙式等高排列，每图带展签（编号+标题+副标）。
 * 杂志「陈列墙 / 展览」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet, photoSlots } from './shared.js';

interface ExhibitItem {
  title: string;
  subtitle?: string;
}

export interface Theme09ExhibitWallV1Props {
  section?: string;
  sectionEn?: string;
  title: string;
  items?: ExhibitItem[];
  images?: Array<{ url?: string; caption?: string }>;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ExhibitWallV1Meta: LayoutMeta = {
  id: 'theme09_exhibit_wall_v1',
  theme: 'theme09',
  role: 'gallery',
  displayName: 'Theme 09 陈列墙',
  description: '展墙式等高排列 + 每图展签编号标题，展览 / 陈列栏',
  needsMedia: true,
  mediaSlots: [{ name: '展品影像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['gallery', 'exhibit', 'grid', 'paper'],
  contentShape: 'exhibit-wall',
};

export const theme09ExhibitWallV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '陈列' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Exhibit · Gallery Wall' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '代表企业陈列墙' },
    { key: 'items', label: '展签列表', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'images', label: '展品图片', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '陈列 · 展墙' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '13' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_ITEMS: ExhibitItem[] = [
  { title: '前沿大模型', subtitle: 'Foundation Model' },
  { title: '算力基础设施', subtitle: 'Infrastructure' },
  { title: '垂直应用层', subtitle: 'Vertical Apps' },
];

export function Theme09ExhibitWallV1(props: Theme09ExhibitWallV1Props): ReactNode {
  const {
    section, sectionEn, title, items = [], images = [],
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const slots = photoSlots(Math.max(safeItems.length, 3), 8);
  // 兜底：保证 images 数组长度 ≥ slots 长度
  const safeImages = [...images];
  while (safeImages.length < slots.length) safeImages.push({});

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-exhibitwall">
      <Masthead section={section} sectionEn={sectionEn} slideIdx={s} editable={e} />

      <h2 className="lp-theme09-exhibitwall-title lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e}>{title}</EditableField>
      </h2>

      <div className="lp-theme09-exhibitwall-grid">
        {slots.map((i) => {
          const item = safeItems[i] || { title: `展品 ${i + 1}` };
          return (
            <figure key={i} className={`lp-theme09-exhibitwall-item ${i === 0 ? 'featured' : ''}`}>
              <InkPhoto
                prop={`images.${i}.url`}
                src={safeImages[i]?.url}
                slideIdx={s}
                editable={e}
                ratio="4:3"
                hint="上传展品影像"
              >
                <span className="lp-theme09-exhibitwall-num">{String(i + 1).padStart(2, '0')}</span>
              </InkPhoto>
              <figcaption className="lp-theme09-exhibitwall-label">
                <span className="lp-theme09-exhibitwall-label-num lp-rise">{String(i + 1).padStart(2, '0')}</span>
                <EditableField prop={`items.${i}.title`} slideIdx={s} editable={e} as="span" className="lp-theme09-exhibitwall-label-title">
                  {item.title}
                </EditableField>
                {item.subtitle && (
                  <span className="lp-theme09-exhibitwall-label-sub">{item.subtitle}</span>
                )}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
