// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 影像卡集（photo_cards_v1）
 * 基底：纸 | 骨架：grid | 图位：4
 *
 * 四张带折页角的图文卡，底部大字标题 + 描述。
 * 杂志「影像卡集 / 赛道掠影」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet, photoSlots } from './shared.js';

interface PhotoCardItem {
  title: string;
  desc?: string;
}

export interface Theme09PhotoCardsV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  cards?: PhotoCardItem[];
  images?: Array<{ url?: string; caption?: string }>;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09PhotoCardsV1Meta: LayoutMeta = {
  id: 'theme09_photo_cards_v1',
  theme: 'theme09',
  role: 'gallery',
  displayName: 'Theme 09 影像卡集',
  description: '四张折页角图文卡 + 大字标题描述，赛道掠影 / 卡片集栏',
  needsMedia: true,
  mediaSlots: [{ name: '卡片影像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['cards', 'gallery', 'grid', 'paper'],
  contentShape: 'photo-cards',
};

export const theme09PhotoCardsV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '10' },
    { key: 'sectionEn', label: '章节英文', type: 'text', inlineEditable: true, defaultValue: 'Image Cards' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '影像卡集 · 赛道掠影' },
    { key: 'cards', label: '卡片列表', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'images', label: '卡片图片', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '卡集 · 掠影' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '16' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_CARDS: PhotoCardItem[] = [
  { title: '算力基建', desc: '卖铲子的人 —— 锁定长线与稀缺算力的中游赢家' },
  { title: '头部大模型', desc: '淘金的人 —— 估值押注未来，想象与风险并存' },
  { title: '垂直应用', desc: '卖水的人 —— 嵌入工作流、拿到续约的稳健下注' },
];

export function Theme09PhotoCardsV1(props: Theme09PhotoCardsV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, cards = [], images = [],
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  const safeCards = cards.length > 0 ? cards : DEFAULT_CARDS;
  const slots = photoSlots(Math.max(safeCards.length, 3), 6);
  const safeImages = [...images];
  while (safeImages.length < slots.length) safeImages.push({});

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-photocards">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <h2 className="lp-theme09-photocards-title lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e}>{title}</EditableField>
      </h2>

      <div className="lp-theme09-photocards-deck">
        {slots.map((i) => {
          const card = safeCards[i] || { title: `卡片 ${i + 1}`, desc: '' };
          return (
            <article key={i} className={`lp-theme09-photocards-card ${i === 0 ? 'featured' : ''}`}>
              {/* 折页角装饰 */}
              <span className="lp-theme09-photocards-fold" aria-hidden="true" />

              <InkPhoto
                prop={`images.${i}.url`}
                src={safeImages[i]?.url}
                slideIdx={s}
                editable={e}
                ratio="3:4"
                hint="上传卡片影像"
              >
                <span className="lp-theme09-photocards-cardnum">{String(i + 1).padStart(2, '0')}</span>
              </InkPhoto>

              <div className="lp-theme09-photocards-body">
                <EditableField prop={`cards.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme09-photocards-card-title">
                  {card.title}
                </EditableField>
                {card.desc && (
                  <EditableField prop={`cards.${i}.desc`} slideIdx={s} editable={e} as="p" className="lp-theme09-photocards-card-desc">
                    {card.desc}
                  </EditableField>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
