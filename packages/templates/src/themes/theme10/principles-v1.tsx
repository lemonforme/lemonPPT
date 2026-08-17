// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 投资原则（principles_v1）
 * 情绪：obsidian | 骨架：column-3 | 图位：0
 * 编号原则 + 刻度尺。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Scale, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10PrincipleItem {
  no?: string;
  name?: string;
  desc?: string;
}
export interface Theme10PrinciplesV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10PrincipleItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10PrinciplesV1Meta: LayoutMeta = {
  id: 'theme10_principles_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 投资原则',
  description: '编号原则 + 刻度尺',
  needsMedia: false,
  tags: ['principles', 'content', 'gold-index', 'obsidian'],
  contentShape: 'principles',
};

export const theme10PrinciplesV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PRINCIPLES' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '我们的五条投资原则' },
    {
      key: 'items',
      label: '原则',
      type: 'array',
      minItems: 0,
      maxItems: 6,
      defaultValue: [
        { no: '01', name: '结构优先', desc: '先看结构，再看价格；总量之外还有分化。' },
        { no: '02', name: '概率思维', desc: '用期望值替代对错，承认不确定性。' },
        { no: '03', name: '复利耐心', desc: '时间是朋友，避免频繁交易的摩擦。' },
      ],
      itemSchema: [
        { key: 'no', label: '编号', type: 'text' },
        { key: 'name', label: '名称', type: 'text' },
        { key: 'desc', label: '说明', type: 'textarea' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'obsidian' },
  ],
};

export function Theme10PrinciplesV1(props: Theme10PrinciplesV1Props): ReactNode {
  const { kicker, title, items, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 6);

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme10-principles" accent>
      <div className="lp-theme10-principles-head">
        {kicker && (
          <EditableField prop="kicker" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField
            prop="title"
            slideIdx={s}
            editable={e}
            as="h2"
            className="lp-theme10-title lp-rise"
            style={{ animationDelay: '60ms', fontSize: 'var(--lp-font-size-h1)', marginTop: 12 }}
          >
            {title}
          </EditableField>
        )}
      </div>
      <div className="lp-theme10-principles-grid">
        {list.map((it, i) => (
          <div className="lp-theme10-principles-item lp-rise" key={i} style={{ animationDelay: `${100 + i * 50}ms` }}>
            <div className="t10-no">
              <EditableField prop={`items.${i}.no`} slideIdx={s} editable={e} as="span">
                {it.no ?? String(i + 1).padStart(2, '0')}
              </EditableField>
            </div>
            <div className="t10-name">
              <EditableField prop={`items.${i}.name`} slideIdx={s} editable={e} as="span">
                {it.name}
              </EditableField>
            </div>
            <div className="t10-desc">
              <EditableField prop={`items.${i}.desc`} slideIdx={s} editable={e} as="span">
                {it.desc}
              </EditableField>
            </div>
          </div>
        ))}
      </div>
      <Scale ticks={12} majors={[0, 6, 11]} labels={['0', '50', '100']} />
    </Sheet>
  );
}
