// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
export interface Theme01GanttV1Task {
  name?: string;
  start?: number;
  end?: number;
  color?: string;
}
export interface Theme01GanttV1Props {
  kicker?: string;
  title?: string;
  phases?: string[];
  tasks?: Theme01GanttV1Task[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01GanttV1Meta: LayoutMeta = {
  id: 'theme01_gantt_v1',
  theme: 'theme01',
  role: 'timeline',
  displayName: 'Theme 01 甘特图',
  description: '横向时间条甘特排期',
  needsMedia: false,
};
export const theme01GanttV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'phases',
      label: '阶段',
      type: 'array',
      maxItems: 6,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    },
    {
      key: 'tasks',
      label: 'tasks',
      type: 'array',
      maxItems: 8,
      minItems: 2,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true
        }
      ]
    }
  ]
};
export function Theme01GanttV1(props: Theme01GanttV1Props): ReactNode {
  const { kicker, title, phases = [], tasks = [], _slideIdx, _editable } = props;
  const safeTasks = tasks.slice(0, 8);
  const defaultColors = ['var(--lp-blue)', 'var(--lp-green)', 'var(--lp-amber)', 'var(--lp-red)', 'var(--lp-violet)', 'var(--lp-pink)', 'var(--lp-cyan)', 'var(--lp-lime)'];
  const displayPhases = phases.length > 0 ? phases : ['Q1', 'Q2', 'Q3', 'Q4'];
  return (<div className="lp-slide lp-gantt-v1">
      <div className="lp-gantt-v1-inner">
    {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>)}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-gantt-v1-title lp-rise">
          {title}
    </EditableField>
    <div className="lp-gantt-v1-chart lp-rise">
          <div className="lp-gantt-v1-header">
      {displayPhases.map((phase, i) => (<div key={i} className="lp-gantt-v1-phase">
        <EditableField prop={`phases.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {phase}
        </EditableField>
              </div>))}
          </div>
          <div className="lp-gantt-v1-body">
      {safeTasks.map((task, index) => {
      const start = Math.max(0, Math.min(100, task.start ?? 0));
      const end = Math.max(start, Math.min(100, task.end ?? 100));
      const width = end - start;
      const color = task.color || defaultColors[index % defaultColors.length];
      return (<div key={index} className="lp-gantt-v1-row">
                  <EditableField prop={`tasks.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-gantt-v1-task-name">
          {task.name || ''}
                  </EditableField>
                  <div className="lp-gantt-v1-track">
          <div className="lp-gantt-v1-bar" style={{ left: `${start}%`, width: `${width}%`, background: color }}/>
                  </div>
        </div>);
    })}
          </div>
    </div>
      </div>
  </div>);
}
