// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04GanttV1Task {
  name?: string;
  start?: number;
  end?: number;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04GanttV1Lane {
  name?: string;
  tasks?: Theme04GanttV1Task[];
}

export interface Theme04GanttV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  periods?: string[];
  lanes?: Theme04GanttV1Lane[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04GanttV1Meta: LayoutMeta = {
  id: 'theme04_gantt_v1',
  theme: 'theme04',
  role: 'roadmap',
  displayName: 'Theme 04 泳道甘特',
  description: '横向泳道甘特图，适合项目计划与资本节奏',
  needsMedia: false,
  tags: ['gantt', 'roadmap', 'candy'],
  contentShape: 'swimlane-gantt',
};

export const theme04GanttV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '项目计划 · GANTT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{资本节奏}}全年排期' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '关键事件按季度铺排，便于对齐节奏' },
    {
      key: 'periods',
      label: '时间周期',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: ['Q1', 'Q2', 'Q3', 'Q4'],
      itemSchema: [{ key: 'item', label: '周期', type: 'text', inlineEditable: true }],
    },
    {
      key: 'lanes',
      label: '泳道',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        {
          name: '叙事驱动',
          tasks: [
            { name: '早期融资', start: 0, end: 1, tone: 'green' },
            { name: '估值爆发', start: 1, end: 2, tone: 'green' },
          ],
        },
        {
          name: '算力卡位',
          tasks: [
            { name: 'GPU 锁定', start: 1, end: 3, tone: 'blue' },
            { name: '云服务扩量', start: 2, end: 4, tone: 'blue' },
          ],
        },
        {
          name: '兑现为王',
          tasks: [
            { name: 'ARR 验证', start: 3, end: 4, tone: 'yellow' },
            { name: 'IPO 准备', start: 4, end: 5, tone: 'yellow' },
          ],
        },
      ],
      itemSchema: [
        { key: 'name', label: '泳道名称', type: 'text' },
        {
          key: 'tasks',
          label: '任务条',
          type: 'array',
          maxItems: 6,
          itemSchema: [
            { key: 'name', label: '任务名', type: 'text' },
            { key: 'start', label: '开始周期索引', type: 'number' },
            { key: 'end', label: '结束周期索引', type: 'number' },
            { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
          ],
        },
      ],
    },
    { key: 'footnote', label: '页脚', type: 'text', inlineEditable: true, defaultValue: '横轴单位：季度 · 仅供参考' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-gantt-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04GanttV1(props: Theme04GanttV1Props): ReactNode {
  const { kicker, title, subtitle, periods = [], lanes = [], footnote, _slideIdx, _editable } = props;
  const safePeriods = periods.slice(0, 8);
  const safeLanes = lanes.filter((l) => l != null).slice(0, 6);
  const count = Math.max(2, safePeriods.length);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-gantt">
      <div className="lp-theme04-gantt-top lp-rise">
        {kicker && (
          <div className="lp-theme04-tag">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme04-gantt-head lp-rise">
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-gantt-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-gantt-body lp-rise">
        <div className="lp-theme04-gantt-grid" style={{ '--lp-gantt-cols': count } as React.CSSProperties}>
          <div className="lp-theme04-gantt-header">
            <div className="lp-theme04-gantt-header-cell lp-theme04-gantt-corner" />
            {safePeriods.map((period, idx) => (
              <div key={idx} className="lp-theme04-gantt-header-cell">
                <EditableField prop={`periods.${idx}.item`} slideIdx={_slideIdx} editable={_editable} as="span">{period}</EditableField>
              </div>
            ))}
          </div>

          {safeLanes.map((lane, lidx) => (
            <div key={lidx} className="lp-theme04-gantt-lane">
              <div className="lp-theme04-gantt-lane-name">
                <EditableField prop={`lanes.${lidx}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{lane.name}</EditableField>
              </div>
              <div className="lp-theme04-gantt-lane-cells">
                {safePeriods.map((_, pidx) => (
                  <div key={pidx} className="lp-theme04-gantt-cell" />
                ))}
                {(lane.tasks || []).filter((t) => t != null).slice(0, 6).map((task, tidx) => {
                  const start = Math.max(0, Math.min(count - 1, Number(task.start) || 0));
                  const end = Math.max(start + 1, Math.min(count, Number(task.end) || start + 1));
                  return (
                    <div
                      key={tidx}
                      className={`lp-theme04-gantt-bar lp-theme04-card ${toneClass[task.tone || 'green'] || ''}`}
                      style={{
                        '--lp-gantt-start': start,
                        '--lp-gantt-end': end,
                        animationDelay: `${(lidx * 2 + tidx) * 60}ms`,
                      } as React.CSSProperties}
                    >
                      <EditableField prop={`lanes.${lidx}.tasks.${tidx}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{task.name}</EditableField>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {footnote && (
        <div className="lp-theme04-gantt-footnote lp-rise">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}
    </div>
  );
}
