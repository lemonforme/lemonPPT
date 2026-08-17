// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 出血斜切封面（cover_bleed_v1）
 * 基底：墨 | 骨架：full-bleed | 图位：0
 *
 * 专色朱砂斜切块从左侧出血压入版心，块内做网点叠印；
 * 竖排刊名嵌在色块中，右侧大字标题骑在色块切口上。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, normalizeStrings } from './shared.js';

export interface Theme09CoverBleedV1MetaItem {
  k: string;
  v: string;
}

export interface Theme09CoverBleedV1Props {
  railTop?: string;
  vertical?: string;
  railFoot?: string;
  title: string;
  subtitle?: string;
  metaItems?: Theme09CoverBleedV1MetaItem[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CoverBleedV1Meta: LayoutMeta = {
  id: 'theme09_cover_bleed_v1',
  theme: 'theme09',
  role: 'cover',
  displayName: 'Theme 09 出血斜切封面',
  description: '专色斜切出血块 + 竖排刊名 + 大字标题，视觉冲击最强的封面变体',
  needsMedia: false,
  tags: ['cover', 'bleed', 'diagonal', 'spot-color'],
  contentShape: 'cover-bleed',
};

export const theme09CoverBleedV1Schema: PropsSchema = {
  fields: [
    { key: 'railTop', label: '色块顶部标记', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09 / 2026' },
    { key: 'vertical', label: '竖排刊名', type: 'text', inlineEditable: true, defaultValue: '墨韵专刊' },
    { key: 'railFoot', label: '色块底部落款', type: 'text', inlineEditable: true, defaultValue: 'Spot-Color Editorial' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '在噪声里\n重新校准品牌的声音' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '一次关于表达、克制与长期主义的年度复盘。' },
    {
      key: 'metaItems',
      label: '底部信息',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { k: 'Published', v: '2026.08' },
        { k: 'Section', v: '品牌年鉴' },
        { k: 'Editor', v: '内容策略部' },
      ],
      itemSchema: [
        { key: 'k', label: '标签', type: 'text' },
        { key: 'v', label: '内容', type: 'text' },
      ],
    },
  ],
};

export function Theme09CoverBleedV1(props: Theme09CoverBleedV1Props): ReactNode {
  const { railTop, vertical, railFoot, title, subtitle, _slideIdx: s, _editable: e } = props;
  const metaItems = (props.metaItems ?? []).slice(0, 4);
  const titleLines = normalizeStrings(String(title ?? '').split('\n'));

  return (
    <Sheet substrate="ink" frame="full-bleed" className="lp-theme09-coverbleed" cropMarks>
      <div className="lp-theme09-coverbleed-wedge" aria-hidden="true" />

      <div className="lp-theme09-coverbleed-inner">
        <div className="lp-theme09-coverbleed-rail">
          {railTop && (
            <EditableField prop="railTop" slideIdx={s} editable={e} as="span" className="lp-theme09-coverbleed-rail-top">
              {railTop}
            </EditableField>
          )}
          {vertical && (
            <EditableField prop="vertical" slideIdx={s} editable={e} as="div" className="lp-theme09-coverbleed-vert">
              {vertical}
            </EditableField>
          )}
          {railFoot && (
            <EditableField prop="railFoot" slideIdx={s} editable={e} as="span" className="lp-theme09-coverbleed-rail-foot">
              {railFoot}
            </EditableField>
          )}
        </div>

        <div className="lp-theme09-coverbleed-main">
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-coverbleed-title lp-rise">
            {titleLines.length > 1
              ? titleLines.map((ln, i) => (
                  <span key={i} style={{ display: 'block' }}>
                    {ln}
                  </span>
                ))
              : title}
          </EditableField>
          {subtitle && (
            <EditableField
              prop="subtitle"
              slideIdx={s}
              editable={e}
              as="p"
              className="lp-theme09-coverbleed-sub lp-rise"
            >
              {subtitle}
            </EditableField>
          )}
          {metaItems.length > 0 && (
            <div className="lp-theme09-coverbleed-meta lp-rise" style={{ animationDelay: '140ms' }}>
              {metaItems.map((m, i) => (
                <div key={i} className="lp-theme09-coverbleed-meta-item">
                  <EditableField prop={`metaItems.${i}.k`} slideIdx={s} editable={e} as="span" className="lp-theme09-coverbleed-meta-k">
                    {m.k}
                  </EditableField>
                  <EditableField prop={`metaItems.${i}.v`} slideIdx={s} editable={e} as="span" className="lp-theme09-coverbleed-meta-v">
                    {m.v}
                  </EditableField>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
}
