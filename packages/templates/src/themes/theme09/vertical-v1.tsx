// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 应用落地（vertical_v1）
 * 基底：纸 | 骨架：column-3 | 图位：3
 *
 * 三条垂直行业卡：影像位 + 行业标题 + 落地描述，纯 CSS 三列等宽。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09VerticalCard {
  title?: string;
  description?: string;
  image?: string;
}

export interface Theme09VerticalV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  cards?: Theme09VerticalCard[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09VerticalV1Meta: LayoutMeta = {
  id: 'theme09_vertical_v1',
  theme: 'theme09',
  role: 'feature',
  displayName: '应用落地',
  description: '三条垂直行业卡 + 影像位 + 落地描述，等宽三列，纸底',
  needsMedia: true,
  mediaSlots: [
    { name: '行业影像 1', fieldPath: 'cards.0.image', canPresetMedia: true },
    { name: '行业影像 2', fieldPath: 'cards.1.image', canPresetMedia: true },
    { name: '行业影像 3', fieldPath: 'cards.2.image', canPresetMedia: true },
  ],
  tags: ['vertical', 'industry', 'application', 'column-3', 'photo'],
  contentShape: 'vertical-cards',
};

export const theme09VerticalV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '应用落地' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'VERTICALS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '11' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三条行业赛道，已经跑出可复制的落地路径' },
    {
      key: 'cards',
      label: '行业卡',
      type: 'array',
      maxItems: 3,
      itemSchema: [
        { key: 'title', label: '行业名称', type: 'text' },
        { key: 'description', label: '落地描述', type: 'textarea' },
        { key: 'image', label: '行业影像', type: 'image' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '落地 · 行业' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '33' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_CARDS: Theme09VerticalCard[] = [
  {
    title: '智能制造',
    description: '质检与排产环节先行落地，单线人工复检工时下降 42%，模型在产线侧完成闭环迭代。',
  },
  {
    title: '金融风控',
    description: '信贷材料解析与反欺诈问询进入生产环境，单案处理时长由 26 分钟压缩至 7 分钟。',
  },
  {
    title: '医疗健康',
    description: '影像预读与随访问答形成组合方案，三甲医院试点覆盖 12 个科室，报告初稿采纳率 68%。',
  },
];

export function Theme09VerticalV1(props: Theme09VerticalV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    cards = [],
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const list = (cards.length ? cards : DEFAULT_CARDS).slice(0, 3);

  return (
    <Sheet substrate="paper" frame="column-3" className="lp-theme09-vertical">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 20, padding: '96px 60px 70px' }}>
        {title && (
          <h2
            className="lp-t9-serif"
            style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.26, color: 'var(--lp-ink)', letterSpacing: '0.01em' }}
          >
            <EditableField prop="title" slideIdx={s} editable={e} as="span">
              {title}
            </EditableField>
          </h2>
        )}

        <div style={{ display: 'flex', gap: 26, alignItems: 'stretch', flex: '1 1 auto', minHeight: 0 }}>
          {list.map((card, i) => (
            <article
              key={i}
              style={{
                flex: '1 1 0',
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                borderTop: `3px solid var(--lp-series-${(i % 6) + 1})`,
                paddingTop: 14,
              }}
            >
              <InkPhoto
                prop={`cards.${i}.image`}
                src={card.image}
                slideIdx={s}
                editable={e}
                ratio="3:2"
                hint="上传行业影像"
                style={{ flex: 'none' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--lp-font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.18em',
                    color: 'var(--lp-ink)',
                  }}
                >
                  {`V-${String(i + 1).padStart(2, '0')}`}
                </span>
              </InkPhoto>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flex: 'none' }}>
                <span
                  style={{
                    fontFamily: 'var(--lp-font-mono)',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: 'var(--lp-accent)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="lp-t9-serif" style={{ margin: 0, fontSize: 21, fontWeight: 700, lineHeight: 1.34, color: 'var(--lp-ink)' }}>
                  <EditableField prop={`cards.${i}.title`} slideIdx={s} editable={e} as="span">
                    {card.title ?? ''}
                  </EditableField>
                </h3>
              </div>

              <span style={{ display: 'block', width: 44, height: 1, background: 'var(--lp-t9-rule)', flex: 'none' }} aria-hidden="true" />

              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.78, color: 'var(--lp-ink2)', paddingRight: 6 }}>
                <EditableField prop={`cards.${i}.description`} slideIdx={s} editable={e} as="span">
                  {card.description ?? ''}
                </EditableField>
              </p>
            </article>
          ))}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
