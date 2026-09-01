// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 甘特图（gantt_v1）
 * 情绪：daylight | 骨架：chart-canvas
 * 月份头 + 任务条，纯 CSS 实现，数值可编辑。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11GanttV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  months?: (string | { text?: string })[];
  tasks?: { name: string; start: number; duration: number; tone?: 'accent' | 'violet' | 'orange' | 'green' }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11GanttV1Meta: LayoutMeta = {
  id: 'theme11_gantt_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 甘特图',
  description: '月份头 + 任务条',
  needsMedia: false,
  tags: ['chart', 'gantt', 'project', 'light-stream'],
  contentShape: 'gantt',
};

const TONE_VARS: Record<string, string> = {
  accent: 'var(--lp-accent)',
  violet: 'var(--lp-violet)',
  orange: 'var(--lp-orange)',
  green: 'var(--lp-green)',
};

export const theme11GanttV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'ROADMAP' },
    { key: 'title', label: '标题', type: 'text', defaultValue: 'Q3 项目排期' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '关键任务的时间分布与并行关系' },
    { key: 'months', label: '月份', type: 'array', maxItems: 12, defaultValue: ['7月', '8月', '9月'], itemSchema: [{ key: 'item', label: '月份', type: 'text' }] },
    {
      key: 'tasks',
      label: '任务',
      type: 'array',
      maxItems: 8,
      defaultValue: [
        { name: '需求评审', start: 0, duration: 1, tone: 'accent' },
        { name: '交互设计', start: 0, duration: 2, tone: 'violet' },
        { name: '前端开发', start: 1, duration: 2, tone: 'orange' },
        { name: '后端联调', start: 1, duration: 2, tone: 'orange' },
        { name: '测试验收', start: 2, duration: 1, tone: 'green' },
      ],
      itemSchema: [
        { key: 'name', label: '任务名', type: 'text' },
        { key: 'start', label: '起始月索引', type: 'number' },
        { key: 'duration', label: '持续月数', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'accent', label: 'accent' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11GanttV1(props: Theme11GanttV1Props): ReactNode {
  const { title, subtitle, eyebrow, months = [], tasks = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const monthCount = Math.max(1, months.length);
  const monthLabels = months.map((m) => (typeof m === 'string' ? m : String((m as { text?: string })?.text ?? '')));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-gantt">
      <div className="lp-theme11-gantt-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-gantt-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-gantt-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-gantt-body lp-rise">
        <div className="lp-theme11-gantt-months">
          {monthLabels.map((m, i) => (
            <div key={i} className="lp-theme11-gantt-month">{m}</div>
          ))}
        </div>
        <div className="lp-theme11-gantt-rows">
          {tasks.slice(0, 8).map((task, i) => {
            const start = Math.max(0, Math.min(monthCount - 1, Number(task.start ?? 0)));
            const duration = Math.max(0.3, Math.min(monthCount - start, Number(task.duration ?? 1)));
            const left = (start / monthCount) * 100;
            const width = (duration / monthCount) * 100;
            return (
              <div key={i} className="lp-theme11-gantt-row" style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}>
                <EditableField prop={`tasks.${i}.name`} slideIdx={s} editable={e} as="div" className="lp-theme11-gantt-task-name">{task.name}</EditableField>
                <div className="lp-theme11-gantt-track">
                  <div
                    className="lp-theme11-gantt-bar"
                    style={{ left: `${left}%`, width: `${width}%`, background: TONE_VARS[task.tone ?? 'accent'] } as React.CSSProperties}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Sheet>
  );
}
