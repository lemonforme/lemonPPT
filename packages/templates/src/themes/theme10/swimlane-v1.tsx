// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 泳道流程（swimlane_v1）
 * 情绪：ember | 骨架：spread | 图位：0
 * 横向阶段泳道 + 任务卡（跨职能流转）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, normalizeStrings, type Theme10Mood } from './shared.js';

export interface Theme10LaneItem {
  role?: string;
  tasks?: unknown;
}
export interface Theme10SwimlaneV1Props {
  kicker?: string;
  title?: string;
  items?: Theme10LaneItem[];
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10SwimlaneV1Meta: LayoutMeta = {
  id: 'theme10_swimlane_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 泳道流程',
  description: '横向阶段泳道 + 任务卡',
  needsMedia: false,
  tags: ['swimlane', 'content', 'gold-index', 'ember'],
  contentShape: 'swimlane',
};

export const theme10SwimlaneV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'WORKFLOW' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一笔交易在三个团队间的流转' },
    {
      key: 'items',
      label: '泳道',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [
        { role: '研究', tasks: ['宏观研判', '标的筛选', '评级更新'] },
        { role: '交易', tasks: ['下单执行', '对冲调整', '成本复核'] },
        { role: '风控', tasks: ['敞口校验', '预警触发', '合规留痕'] },
      ],
      itemSchema: [
        { key: 'role', label: '团队', type: 'text' },
        { key: 'tasks', label: '任务', type: 'array' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'ember' },
  ],
};

export function Theme10SwimlaneV1(props: Theme10SwimlaneV1Props): ReactNode {
  const { kicker, title, items, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const lanes = (Array.isArray(items) ? items : []).slice(0, 4);

  return (
    <Sheet mood={mood} frame="spread" className="lp-theme10-swimlane" accent>
      <div className="lp-theme10-swimlane-head">
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
      <div className="lp-theme10-swimlane-body">
        {lanes.map((ln, i) => {
          const tasks = normalizeStrings(ln.tasks).slice(0, 4);
          return (
            <div className="lp-theme10-swimlane-row lp-rise" key={i} style={{ animationDelay: `${100 + i * 60}ms` }}>
              <div className="t10-lane-role">
                <EditableField prop={`items.${i}.role`} slideIdx={s} editable={e} as="span">
                  {ln.role}
                </EditableField>
              </div>
              <div className="t10-lane-track">
                {tasks.map((t, j) => (
                  <span className="t10-lane-chip" key={j}>
                    <EditableField prop={`items.${i}.tasks.${j}`} slideIdx={s} editable={e} as="span">
                      {t}
                    </EditableField>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}
