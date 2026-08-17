// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 目标进度（goals_v1）
 * 情绪：ember | 骨架：column-3 | 图位：0
 * 目标卡 + 进度条。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10GoalItem {
  name?: string;
  target?: string;
  progress?: number;
}
export interface Theme10GoalsV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10GoalItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10GoalsV1Meta: LayoutMeta = {
  id: 'theme10_goals_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 目标进度',
  description: '目标卡 + 进度条',
  needsMedia: false,
  tags: ['goals', 'content', 'gold-index', 'ember'],
  contentShape: 'goals',
};

export const theme10GoalsV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'TARGETS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '本年度三项目标与进度' },
    {
      key: 'items',
      label: '目标',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [
        { name: '规模突破', target: '200 亿', progress: 72 },
        { name: '客户留存', target: '95%', progress: 88 },
        { name: '风险零事故', target: '全年', progress: 100 },
        { name: '投教覆盖', target: '500 万人', progress: 54 },
      ],
      itemSchema: [
        { key: 'name', label: '目标名', type: 'text' },
        { key: 'target', label: '目标值', type: 'text' },
        { key: 'progress', label: '进度%', type: 'number' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

export function Theme10GoalsV1(props: Theme10GoalsV1Props): ReactNode {
  const { kicker, title, items, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const list = (Array.isArray(items) ? items : []).slice(0, 4);

  return (
    <Sheet mood={mood} frame="column-3" className="lp-theme10-goals" accent>
      <div className="lp-theme10-goals-head">
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
      <div className="lp-theme10-goals-grid">
        {list.map((it, i) => {
          const pct = Math.max(0, Math.min(100, Number(it.progress ?? 0)));
          return (
            <div className="lp-theme10-goals-card lp-rise" key={i} style={{ animationDelay: `${120 + i * 60}ms` }}>
              <div className="t10-goal-top">
                <span className="t10-goal-name">
                  <EditableField prop={`items.${i}.name`} slideIdx={s} editable={e} as="span">
                    {it.name}
                  </EditableField>
                </span>
                <span className="t10-goal-target">
                  <EditableField prop={`items.${i}.target`} slideIdx={s} editable={e} as="span">
                    {it.target}
                  </EditableField>
                </span>
              </div>
              <div className="t10-goal-bar">
                <span className="t10-goal-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="t10-goal-pct">
                <EditableField prop={`items.${i}.progress`} slideIdx={s} editable={e} as="span">
                  {pct}
                </EditableField>
                %
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
