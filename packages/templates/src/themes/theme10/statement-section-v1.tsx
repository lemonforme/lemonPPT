// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 宣言章节（statement_section_v1）
 * 情绪：obsidian | 骨架：spread | 图位：0
 * 左宣言右索引，中缝。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, normalizeStrings, type Theme10Mood } from './shared.js';

export interface Theme10StatementSectionV1Props {
  quote: string;
  items?: string[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10StatementSectionV1Meta: LayoutMeta = {
  id: 'theme10_statement_section_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 宣言章节',
  description: '左宣言右索引 + 中缝',
  needsMedia: false,
  tags: ['section', 'statement', 'gold-index', 'obsidian'],
  contentShape: 'statement-section',
};

export const theme10StatementSectionV1Schema: PropsSchema = {
  fields: [
    { key: 'quote', label: '宣言', type: 'textarea', inlineEditable: true, defaultValue: '我们研究的不是价格，而是价格背后的结构与因果。' },
    {
      key: 'items',
      label: '索引条目',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: ['总量拐点', '结构分化', '流动性重构', '风险与防御'],
      itemSchema: [{ key: 'item', label: '条目', type: 'text' }],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'obsidian' },
  ],
};

export function Theme10StatementSectionV1(props: Theme10StatementSectionV1Props): ReactNode {
  const { quote, items, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const list = normalizeStrings(items).slice(0, 6);

  return (
    <Sheet mood={mood} frame="spread" className="lp-theme10-statement-section">
      <div className="lp-theme10-statement-section-left">
        <EditableField
          prop="quote"
          slideIdx={s}
          editable={e}
          as="div"
          className="lp-theme10-statement-section-quote lp-rise"
        >
          {quote}
        </EditableField>
      </div>
      <div className="lp-theme10-statement-section-right">
        {list.map((it, i) => (
          <div className="t10-idx lp-rise" key={i} style={{ animationDelay: `${60 + i * 50}ms` }}>
            <b>{String(i + 1).padStart(2, '0')}</b>
            <EditableField prop={`items.${i}`} slideIdx={s} editable={e} as="span">
              {it}
            </EditableField>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
