// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 篇章扉页（section_v1）
 * 基底：墨 | 骨架：spread | 图位：0
 *
 * 巨型专色数字从左下角出血（420px），竖排中文章节名贴右缘，
 * 中间挂英文栏目、导语与要点短横线列表。翻页节奏中的「重音」。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Sheet, normalizeStrings } from './shared.js';

export interface Theme09SectionV1Props {
  num: string;
  nameEn?: string;
  name: string;
  lede?: string;
  points?: string[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09SectionV1Meta: LayoutMeta = {
  id: 'theme09_section_v1',
  theme: 'theme09',
  role: 'content',
  displayName: 'Theme 09 篇章扉页',
  description: '巨型专色数字出血 + 竖排中文章节名，墨底重音页，用于章节切换',
  needsMedia: false,
  tags: ['section', 'chapter', 'divider', 'ink'],
  contentShape: 'section-divider',
};

export const theme09SectionV1Schema: PropsSchema = {
  fields: [
    { key: 'num', label: '章节号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'nameEn', label: '英文栏目', type: 'text', inlineEditable: true, defaultValue: 'Research Method' },
    { key: 'name', label: '章节名（竖排）', type: 'text', inlineEditable: true, defaultValue: '研究方法' },
    { key: 'lede', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '在开口问之前，先决定不问什么。本章交代样本口径、访谈框架与我们主动放弃的三类数据。' },
    {
      key: 'points',
      label: '本章要点',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: ['分层抽样：覆盖 12 城 · 6 类角色', '半结构化访谈：单场 90 分钟', '编码与校验：双人独立编码后比对'],
      itemSchema: [{ key: 'item', label: '要点', type: 'text' }],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '第一章' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '05' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'RESEARCH' },
  ],
};

export function Theme09SectionV1(props: Theme09SectionV1Props): ReactNode {
  const { num, nameEn, name, lede, folioLeft, folioPage, folioRight, _slideIdx: s, _editable: e } = props;
  const points = normalizeStrings(props.points).slice(0, 4);

  return (
    <Sheet substrate="ink" frame="spread" className="lp-theme09-section">
      <EditableField prop="num" slideIdx={s} editable={e} as="div" className="lp-theme09-section-num">
        {num}
      </EditableField>

      <div className="lp-theme09-section-inner">
        <div className="lp-theme09-section-text">
          {nameEn && (
            <EditableField prop="nameEn" slideIdx={s} editable={e} as="span" className="lp-theme09-section-en lp-rise">
              {nameEn}
            </EditableField>
          )}
          {lede && (
            <EditableField prop="lede" slideIdx={s} editable={e} as="p" className="lp-theme09-section-lede lp-rise">
              {lede}
            </EditableField>
          )}
          {points.length > 0 && (
            <div className="lp-theme09-section-points lp-rise" style={{ animationDelay: '120ms' }}>
              {points.map((t, i) => (
                <EditableField key={i} prop={`points.${i}`} slideIdx={s} editable={e} as="div" className="lp-theme09-section-point">
                  {t}
                </EditableField>
              ))}
            </div>
          )}
        </div>

        <EditableField prop="name" slideIdx={s} editable={e} as="h1" className="lp-theme09-section-vert lp-rise">
          {name}
        </EditableField>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
