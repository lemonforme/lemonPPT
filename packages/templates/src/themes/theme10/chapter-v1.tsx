// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 章节索引（chapter_v1）
 * 情绪：obsidian | 骨架：stage | 图位：0
 * 巨型序号 + 章节名 + 账本细线分组。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, normalizeStrings, type Theme10Mood } from './shared.js';

export interface Theme10ChapterV1Props {
  no?: string;
  name: string;
  items?: string[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10ChapterV1Meta: LayoutMeta = {
  id: 'theme10_chapter_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 章节索引',
  description: '巨型序号 + 章节名 + 账本细线分组',
  needsMedia: false,
  tags: ['chapter', 'index', 'gold-index', 'obsidian'],
  contentShape: 'chapter',
};

export const theme10ChapterV1Schema: PropsSchema = {
  fields: [
    { key: 'no', label: '序号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'name', label: '章节名', type: 'text', inlineEditable: true, defaultValue: '市场结构' },
    {
      key: 'items',
      label: '小节列表',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: ['总量拐点', '结构分化', '流动性重构'],
      itemSchema: [{ key: 'item', label: '条目', type: 'text' }],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'obsidian' },
  ],
};

export function Theme10ChapterV1(props: Theme10ChapterV1Props): ReactNode {
  const { no, name, items, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const list = normalizeStrings(items).slice(0, 6);

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme10-partdiv" accent>
      {no && (
        <EditableField
          prop="no"
          slideIdx={s}
          editable={e}
          as="div"
          className="lp-theme10-partdiv-no lp-rise"
        >
          {no}
        </EditableField>
      )}
      <EditableField
        prop="name"
        slideIdx={s}
        editable={e}
        as="div"
        className="lp-theme10-partdiv-name lp-rise"
        style={{ animationDelay: '60ms' }}
      >
        {name}
      </EditableField>
      {list.length > 0 && (
        <div className="lp-theme10-partdiv-list">
          {list.map((it, i) => (
            <div className="t10-row lp-rise" key={i} style={{ animationDelay: `${120 + i * 50}ms` }}>
              <b>{String(i + 1).padStart(2, '0')}</b>
              <EditableField prop={`items.${i}`} slideIdx={s} editable={e} as="span">
                {it}
              </EditableField>
            </div>
          ))}
        </div>
      )}
    </Sheet>
  );
}
