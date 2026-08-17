// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 问答（faq_v1）
 * 情绪：ember | 骨架：sidebar | 图位：0
 * 问题 + 答案列表（左栏索引，右栏释疑）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10FaqItem {
  q?: string;
  a?: string;
}
export interface Theme10FaqV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10FaqItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10FaqV1Meta: LayoutMeta = {
  id: 'theme10_faq_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 问答',
  description: '问题 + 答案列表',
  needsMedia: false,
  tags: ['faq', 'content', 'gold-index', 'ember'],
  contentShape: 'faq',
};

export const theme10FaqV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'FAQ' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '关于投资，用户最常问的' },
    {
      key: 'items',
      label: '问答',
      type: 'array',
      minItems: 0,
      maxItems: 5,
      defaultValue: [
        { q: '最低起投多少？', a: '本策略面向合格投资者，起投门槛以产品合同为准。' },
        { q: '亏损会到多少？', a: '历史最大回撤已披露，但过往业绩不代表未来表现。' },
        { q: '何时可以赎回？', a: '按开放日安排，具体以招募说明书与公告为准。' },
        { q: '费用怎么收？', a: '管理费与业绩报酬在合同中列示，无隐性收费。' },
      ],
      itemSchema: [
        { key: 'q', label: '问题', type: 'text' },
        { key: 'a', label: '答案', type: 'textarea' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

export function Theme10FaqV1(props: Theme10FaqV1Props): ReactNode {
  const { kicker, title, items, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 5);

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme10-faq" accent>
      <div className="lp-theme10-faq-rail">
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
      <div className="lp-theme10-faq-list">
        {list.map((it, i) => (
          <div className="lp-theme10-faq-row lp-rise" key={i} style={{ animationDelay: `${120 + i * 60}ms` }}>
            <div className="t10-faq-q">
              <span className="t10-faq-no" aria-hidden="true">
                Q{String(i + 1).padStart(2, '0')}
              </span>
              <EditableField prop={`items.${i}.q`} slideIdx={s} editable={e} as="span" className="t10-faq-qtext">
                {it.q}
              </EditableField>
            </div>
            <div className="t10-faq-a">
              <EditableField prop={`items.${i}.a`} slideIdx={s} editable={e} as="span">
                {it.a}
              </EditableField>
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
