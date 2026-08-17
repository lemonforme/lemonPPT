// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 核查清单（checklist_v1）
 * 情绪：obsidian | 骨架：column-3 | 图位：0
 * 双栏勾选清单（合规 / 上线前核对）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CheckItem {
  text?: string;
  done?: boolean;
}
export interface Theme10ChecklistV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10CheckItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10ChecklistV1Meta: LayoutMeta = {
  id: 'theme10_checklist_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 核查清单',
  description: '双栏勾选清单',
  needsMedia: false,
  tags: ['checklist', 'content', 'gold-index', 'obsidian'],
  contentShape: 'checklist',
};

export const theme10ChecklistV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'CHECKLIST' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '上线前的最终核对' },
    {
      key: 'items',
      label: '条目',
      type: 'array',
      minItems: 0,
      maxItems: 8,
      defaultValue: [
        { text: '数据源与口径已对齐', done: true },
        { text: '回测区间覆盖牛熊', done: true },
        { text: '费率与滑点已计入', done: false },
        { text: '极端行情压力测试', done: false },
        { text: '预警线阈值已配置', done: true },
        { text: '合规与留痕就绪', done: false },
      ],
      itemSchema: [
        { key: 'text', label: '事项', type: 'text' },
        { key: 'done', label: '已勾', type: 'boolean' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'obsidian' },
  ],
};

export function Theme10ChecklistV1(props: Theme10ChecklistV1Props): ReactNode {
  const { kicker, title, items, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 8);
  const half = Math.ceil(list.length / 2);
  const cols = [list.slice(0, half), list.slice(half)];

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme10-checklist" accent>
      <div className="lp-theme10-checklist-head">
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
      <div className="lp-theme10-checklist-cols">
        {cols.map((col, c) => (
          <ul className="lp-theme10-checklist-col" key={c}>
            {col.map((it, i) => {
              const gi = c * half + i;
              return (
                <li className="t10-check lp-rise" key={i} style={{ animationDelay: `${120 + gi * 45}ms` }}>
                  <span className={`t10-check-mark ${it.done ? 'on' : ''}`} aria-hidden="true">
                    {it.done ? '✓' : '○'}
                  </span>
                  <EditableField prop={`items.${gi}.text`} slideIdx={s} editable={e} as="span" className="t10-check-text">
                    {it.text}
                  </EditableField>
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </Sheet>
  );
}
