// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 方案对比（plans_v1）
 * 情绪：ember | 骨架：grid | 图位：0
 * 2–3 列方案卡 + 要点对比。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, normalizeStrings, type Theme10Mood } from './shared.js';

export interface Theme10PlanItem {
  name?: string;
  tag?: string;
  points?: unknown;
}
export interface Theme10PlansV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10PlanItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10PlansV1Meta: LayoutMeta = {
  id: 'theme10_plans_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 方案对比',
  description: '2–3 列方案卡 + 要点对比',
  needsMedia: false,
  tags: ['plans', 'content', 'gold-index', 'ember'],
  contentShape: 'plans',
};

export const theme10PlansV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'OPTIONS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三种配置方案的取舍' },
    {
      key: 'items',
      label: '方案',
      type: 'array',
      minItems: 0,
      maxItems: 3,
      defaultValue: [
        { name: '稳健', tag: '低风险', points: ['债基为主', '波动<4%', '流动性高'] },
        { name: '平衡', tag: '中风险', points: ['股债均配', '波动 6–10%', '季度再平衡'] },
        { name: '进取', tag: '高风险', points: ['权益为主', '波动>12%', '弹性收益'] },
      ],
      itemSchema: [
        { key: 'name', label: '方案名', type: 'text' },
        { key: 'tag', label: '标签', type: 'text' },
        { key: 'points', label: '要点', type: 'array' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

export function Theme10PlansV1(props: Theme10PlansV1Props): ReactNode {
  const { kicker, title, items, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const plans = (Array.isArray(items) ? items : []).slice(0, 3);

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-plans" accent>
      <div className="lp-theme10-plans-head">
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
      <div className="lp-theme10-plans-grid">
        {plans.map((pl, i) => {
          const pts = normalizeStrings(pl.points).slice(0, 5);
          return (
            <div className="lp-theme10-plans-card lp-rise" key={i} style={{ animationDelay: `${120 + i * 70}ms` }}>
              <div className="t10-plan-tag">
                <EditableField prop={`items.${i}.tag`} slideIdx={s} editable={e} as="span">
                  {pl.tag}
                </EditableField>
              </div>
              <div className="t10-plan-name">
                <EditableField prop={`items.${i}.name`} slideIdx={s} editable={e} as="span">
                  {pl.name}
                </EditableField>
              </div>
              <ul className="t10-plan-points">
                {pts.map((p, j) => (
                  <li className="t10-plan-point" key={j}>
                    <span className="t10-plan-bullet" aria-hidden="true">
                      ▸
                    </span>
                    <EditableField prop={`items.${i}.points.${j}`} slideIdx={s} editable={e} as="span">
                      {p}
                    </EditableField>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
