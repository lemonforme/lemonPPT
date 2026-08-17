// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 内容墙 / 团队（team_v1）
 * 情绪：ember | 骨架：grid | 图位：6
 * 等高 3×2 网格，每图配展签（姓名 + 角色）。
 * 金融编辑「研究团队 / 投委会」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10TeamV1Item {
  url?: string;
  name?: string;
  role?: string;
}
export interface Theme10TeamV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  images?: Theme10TeamV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 6;
const NAMES = ['林深', '苏黎', '周屿', '何川', '江月', '顾岚'];
const ROLES = ['权益研究', '固收研究', '量化策略', '宏观研究', '风控合规', '产品架构'];

export const theme10TeamV1Meta: LayoutMeta = {
  id: 'theme10_team_v1',
  theme: 'theme10',
  role: 'image',
  displayName: 'Theme 10 内容墙 / 团队',
  description: '等高 3×2 网格 + 每图展签',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `成员 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['team', 'grid', 'gold-index', 'ember'],
  contentShape: 'team',
};

export const theme10TeamV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '研究团队' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'The Desk' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '把判断留在桌上的人' },
    {
      key: 'images',
      label: '成员',
      type: 'array',
      minItems: 1,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, (_, i) => ({ url: '', name: NAMES[i], role: ROLES[i] })),
      itemSchema: [
        { key: 'url', label: '头像', type: 'image' },
        { key: 'name', label: '姓名', type: 'text', inlineEditable: true },
        { key: 'role', label: '角色', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '研究团队' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '28' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10TeamV1(props: Theme10TeamV1Props): ReactNode {
  const { section, mark, title, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const raw = props.images ?? [];
  const items: Theme10TeamV1Item[] = raw.map((it, i) => it ?? { name: NAMES[i], role: ROLES[i] });

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-team">
      <div className="lp-theme10-team-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-team-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        <div className="lp-theme10-stamp">{mark}</div>
      </div>

      <div className="lp-theme10-team-grid">
        {items.map((it, i) => (
          <figure key={i} className="lp-theme10-team-cell lp-rise" style={{ animationDelay: `${i * 40}ms` }}>
            <EditorialPhoto
              prop={`images.${i}.url`}
              src={it.url}
              slideIdx={s}
              editable={e}
              ratio="1:1"
              fit="cover"
              hint={`成员 ${i + 1}`}
              className="lp-theme10-team-photo"
            />
            <figcaption className="lp-theme10-team-cap">
              <EditableField prop={`images.${i}.name`} slideIdx={s} editable={e} as="span" className="t10-name">{it.name}</EditableField>
              <EditableField prop={`images.${i}.role`} slideIdx={s} editable={e} as="span" className="t10-role">{it.role}</EditableField>
            </figcaption>
          </figure>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
