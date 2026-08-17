// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 术语表（glossary_v1）
 * 情绪：obsidian | 骨架：column-3 | 图位：0
 * 术语 + 释义双栏列表。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10GlossaryItem {
  term?: string;
  def?: string;
}
export interface Theme10GlossaryV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10GlossaryItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10GlossaryV1Meta: LayoutMeta = {
  id: 'theme10_glossary_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 术语表',
  description: '术语 + 释义双栏列表',
  needsMedia: false,
  tags: ['glossary', 'content', 'gold-index', 'obsidian'],
  contentShape: 'glossary',
};

export const theme10GlossaryV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'GLOSSARY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '你需要知道的五个概念' },
    {
      key: 'items',
      label: '词条',
      type: 'array',
      minItems: 0,
      maxItems: 8,
      defaultValue: [
        { term: '夏普比率', def: '单位风险的超额收益，越高越划算。' },
        { term: '最大回撤', def: '区间内从峰到谷的最大跌幅。' },
        { term: '久期', def: '债券价格对利率变动的敏感度。' },
        { term: '对冲', def: '用反向头寸抵消部分风险暴露。' },
        { term: '再平衡', def: '把组合拉回目标权重的操作。' },
        { term: 'Beta', def: '组合相对市场的系统性波动。' },
      ],
      itemSchema: [
        { key: 'term', label: '术语', type: 'text' },
        { key: 'def', label: '释义', type: 'textarea' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'obsidian' },
  ],
};

export function Theme10GlossaryV1(props: Theme10GlossaryV1Props): ReactNode {
  const { kicker, title, items, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 8);
  const half = Math.ceil(list.length / 2);
  const cols = [list.slice(0, half), list.slice(half)];

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme10-glossary" accent>
      <div className="lp-theme10-glossary-head">
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
      <div className="lp-theme10-glossary-cols">
        {cols.map((col, c) => (
          <dl className="lp-theme10-glossary-col" key={c}>
            {col.map((it, i) => {
              const gi = c * half + i;
              return (
                <div className="t10-gloss lp-rise" key={i} style={{ animationDelay: `${120 + gi * 45}ms` }}>
                  <dt className="t10-gloss-term">
                    <EditableField prop={`items.${gi}.term`} slideIdx={s} editable={e} as="span">
                      {it.term}
                    </EditableField>
                  </dt>
                  <dd className="t10-gloss-def">
                    <EditableField prop={`items.${gi}.def`} slideIdx={s} editable={e} as="span">
                      {it.def}
                    </EditableField>
                  </dd>
                </div>
              );
            })}
          </dl>
        ))}
      </div>
    </Sheet>
  );
}
