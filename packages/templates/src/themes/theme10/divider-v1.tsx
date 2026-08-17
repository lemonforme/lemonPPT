// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 序号分章（divider_v1）
 * 情绪：ember | 骨架：stage | 图位：0
 * 居中序号 + 金线分隔。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10DividerV1Props {
  no?: string;
  name: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10DividerV1Meta: LayoutMeta = {
  id: 'theme10_divider_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 序号分章',
  description: '居中序号 + 金线分隔',
  needsMedia: false,
  tags: ['divider', 'section', 'gold-index', 'ember'],
  contentShape: 'divider',
};

export const theme10DividerV1Schema: PropsSchema = {
  fields: [
    { key: 'no', label: '序号', type: 'text', inlineEditable: true, defaultValue: '02' },
    { key: 'name', label: '分章标题', type: 'text', inlineEditable: true, defaultValue: '风险与防御' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

export function Theme10DividerV1(props: Theme10DividerV1Props): ReactNode {
  const { no, name, mood = 'ember', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme10-divider">
      {no && (
        <EditableField prop="no" slideIdx={s} editable={e} as="div" className="lp-theme10-divider-no lp-rise">
          {no}
        </EditableField>
      )}
      <div className="lp-theme10-gold-rule" />
      <EditableField
        prop="name"
        slideIdx={s}
        editable={e}
        as="div"
        className="lp-theme10-divider-name lp-rise"
        style={{ animationDelay: '80ms' }}
      >
        {name}
      </EditableField>
    </Sheet>
  );
}
