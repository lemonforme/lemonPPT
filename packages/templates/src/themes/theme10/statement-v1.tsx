// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 声明金句（statement_v1）
 * 情绪：ember | 骨架：stage | 图位：0
 * 满版金句 + mono 落款。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10StatementV1Props {
  word: string;
  sign?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10StatementV1Meta: LayoutMeta = {
  id: 'theme10_statement_v1',
  theme: 'theme10',
  role: 'quote',
  displayName: 'Theme 10 声明金句',
  description: '满版金句 + mono 落款',
  needsMedia: false,
  tags: ['statement', 'quote', 'gold-index', 'ember'],
  contentShape: 'statement',
};

export const theme10StatementV1Schema: PropsSchema = {
  fields: [
    { key: 'word', label: '金句', type: 'textarea', inlineEditable: true, defaultValue: '真正的Alpha，\n来自认知的差异化。' },
    { key: 'sign', label: '落款', type: 'text', inlineEditable: true, defaultValue: '— lemonPPT Research' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

export function Theme10StatementV1(props: Theme10StatementV1Props): ReactNode {
  const { word, sign, mood = 'ember', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme10-statement" accent>
      <EditableField
        prop="word"
        slideIdx={s}
        editable={e}
        as="div"
        className="lp-theme10-statement-word lp-rise"
      >
        {word}
      </EditableField>
      {sign && (
        <EditableField
          prop="sign"
          slideIdx={s}
          editable={e}
          as="div"
          className="lp-theme10-statement-sign lp-rise"
          style={{ animationDelay: '80ms' }}
        >
          {sign}
        </EditableField>
      )}
    </Sheet>
  );
}
