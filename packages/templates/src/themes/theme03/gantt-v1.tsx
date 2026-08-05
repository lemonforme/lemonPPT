// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03GanttV1Task {
  name?: string;
  start?: number;
  end?: number;
  color?: string;
}

export interface Theme03GanttV1Phase {
  item?: string;
}

export interface Theme03GanttV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  phases?: Theme03GanttV1Phase[];
  tasks?: Theme03GanttV1Task[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03GanttV1Meta: LayoutMeta = {
  id: 'theme03_gantt_v1',
  theme: 'theme03',
  role: 'timeline',
  displayName: 'Theme 03 编辑风甘特图',
  description: '深色代码编辑风横向时间条甘特排期',
  needsMedia: false,
  tags: ['timeline', 'gantt', 'schedule'],
  contentShape: 'gantt-chart',
};

export const theme03GanttV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '项目排期' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'GANTT' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{Q3}} 关键里程碑排期' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'phases',
      label: '阶段',
      type: 'array',
      maxItems: 6,
      minItems: 1,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'tasks',
      label: 'tasks',
      type: 'array',
      maxItems: 8,
      minItems: 2,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'start', label: '开始(%)', type: 'number' },
        { key: 'end', label: '结束(%)', type: 'number' },
        { key: 'color', label: '颜色', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-gantt-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03GanttV1(props: Theme03GanttV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    phases = [],
    tasks = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;
  const safeTasks = tasks.slice(0, 8);
  const defaultColors = ['var(--lp-accent)', 'var(--lp-accent-2)', 'var(--lp-accent-cool)', 'var(--lp-ink3)', 'var(--lp-green)', 'var(--lp-amber)', 'var(--lp-red)', 'var(--lp-violet)'];
  const displayPhases = phases.length > 0 ? phases : [{ item: 'Q1' }, { item: 'Q2' }, { item: 'Q3' }, { item: 'Q4' }];

  return (
    <div className="lp-slide lp-theme03-gantt-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-gantt-main">
        <div className="lp-theme03-gantt-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-gantt-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-gantt-chart lp-rise lp-theme03-corner-bracket">
          <div className="lp-theme03-gantt-header">
            {displayPhases.map((phase, i) => (
              <div key={i} className="lp-theme03-gantt-phase">
                <EditableField prop={`phases.${i}.item`} slideIdx={_slideIdx} editable={_editable} as="span">{phase.item ?? ''}</EditableField>
              </div>
            ))}
          </div>
          <div className="lp-theme03-gantt-body">
            {safeTasks.map((task, index) => {
              const start = Math.max(0, Math.min(100, task.start ?? 0));
              const end = Math.max(start, Math.min(100, task.end ?? 100));
              const width = end - start;
              const color = task.color || defaultColors[index % defaultColors.length];
              return (
                <div key={index} className="lp-theme03-gantt-row" style={{ animationDelay: `${index * 80}ms` }}>
                  <EditableField prop={`tasks.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-gantt-task-name">
                    {task.name || ''}
                  </EditableField>
                  <div className="lp-theme03-gantt-track">
                    <div className="lp-theme03-gantt-bar" style={{ left: `${start}%`, width: `${width}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
