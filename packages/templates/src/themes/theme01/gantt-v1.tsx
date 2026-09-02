// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Headline, Masthead, Plus, Ring, Sheet, Slash } from './shared.js';

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
  description: '色块拼贴横向时间条甘特排期',
  needsMedia: false,
};

export const theme01GanttV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
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
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'tasks',
      label: '任务',
      type: 'array',
      maxItems: 8,
      minItems: 2,
      itemSchema: [
        {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
  ],
};

const DEFAULT_COLORS = [
  'var(--lp-blue)',
  'var(--lp-green)',
  'var(--lp-amber)',
  'var(--lp-red)',
  'var(--lp-violet)',
  'var(--lp-pink)',
  'var(--lp-cyan)',
  'var(--lp-lime)',
];

export function Theme01GanttV1(props: Theme01GanttV1Props): ReactNode {
  const { kicker, title, phases = [], tasks = [], _slideIdx, _editable } = props;
  const safeTasks = tasks.slice(0, 8);
  const displayPhases = phases.length > 0 ? phases : ['Q1', 'Q2', 'Q3', 'Q4'];

  return (
    <Sheet substrate="light" frame="grid" className="lp-gantt-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="GANTT" size="large" className="lp-gantt-v1-headline lp-rise" />
      <div className="lp-gantt-v1-chart lp-rise">
        <div className="lp-gantt-v1-header">
          <div className="lp-gantt-v1-task-label">任务 / 阶段</div>
          <div className="lp-gantt-v1-phases">
            {displayPhases.map((phase, i) => (
              <div key={i} className="lp-gantt-v1-phase">
                <EditableField prop={`phases.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {phase}
                </EditableField>
              </div>
            ))}
          </div>
        </div>
        <div className="lp-gantt-v1-body">
          {safeTasks.map((task, index) => {
            const start = Math.max(0, Math.min(100, task.start ?? 0));
            const end = Math.max(start, Math.min(100, task.end ?? 100));
            const width = end - start;
            const color = task.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            return (
              <div key={index} className="lp-gantt-v1-row">
                <EditableField
                  prop={`tasks.${index}.name`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="div"
                  className="lp-gantt-v1-task-name"
                >
                  {task.name || ''}
                </EditableField>
                <div className="lp-gantt-v1-track">
                  <div
                    className="lp-gantt-v1-bar"
                    style={{ left: `${start}%`, width: `${width}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Blob
        className="lp-gantt-v1-blob"
        style={{ width: 320, height: 320, bottom: -100, right: -70, background: 'var(--lp-green)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-gantt-v1-dots"
        style={{ top: 140, left: 70, width: 180, height: 180, opacity: 0.22 }}
      />
      <Slash
        className="lp-gantt-v1-slash"
        style={{ top: 120, right: 100, height: 60, background: 'var(--lp-amber)', opacity: 0.55 }}
      />
      <Plus
        className="lp-gantt-v1-plus"
        style={{ bottom: 100, left: 90, width: 26, height: 26, color: 'var(--lp-blue)' }}
      />
      <Ring
        className="lp-gantt-v1-ring"
        style={{ bottom: 90, right: 110, width: 60, height: 60, borderColor: 'var(--lp-red)' }}
      />
    </Sheet>
  );
}
