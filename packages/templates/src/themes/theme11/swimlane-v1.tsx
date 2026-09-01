// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 泳道图（swimlane_v1）
 * 情绪：daylight | 骨架：grid
 * 多泳道横向流程，带情绪色任务胶囊。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11SwimlaneV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  lanes?: { name: string; tasks: { label: string; tone?: 'accent' | 'violet' | 'orange' | 'green'; width?: number }[] }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11SwimlaneV1Meta: LayoutMeta = {
  id: 'theme11_swimlane_v1',
  theme: 'theme11',
  role: 'process',
  displayName: 'Theme 11 泳道图',
  description: '多泳道横向流程图',
  needsMedia: false,
  tags: ['process', 'swimlane', 'grid', 'light-stream'],
  contentShape: 'swimlane',
};

const TONE_VARS: Record<string, string> = {
  accent: 'var(--lp-accent)',
  violet: 'var(--lp-violet)',
  orange: 'var(--lp-orange)',
  green: 'var(--lp-green)',
};

export const theme11SwimlaneV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'PROCESS' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '跨部门协作流程' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '从需求提出到上线的完整泳道视图' },
    {
      key: 'lanes',
      label: '泳道',
      type: 'array',
      maxItems: 4,
      defaultValue: [
        {
          name: '产品',
          tasks: [
            { label: '需求评审', tone: 'accent', width: 18 },
            { label: 'PRD 输出', tone: 'accent', width: 22 },
            { label: '验收', tone: 'accent', width: 16 },
          ],
        },
        {
          name: '设计',
          tasks: [
            { label: '交互稿', tone: 'violet', width: 20 },
            { label: '视觉稿', tone: 'violet', width: 24 },
          ],
        },
        {
          name: '开发',
          tasks: [
            { label: '技术方案', tone: 'orange', width: 18 },
            { label: '编码实现', tone: 'orange', width: 32 },
            { label: '联调', tone: 'orange', width: 16 },
          ],
        },
        {
          name: '测试',
          tasks: [
            { label: '用例设计', tone: 'green', width: 18 },
            { label: '测试执行', tone: 'green', width: 24 },
          ],
        },
      ],
      itemSchema: [
        { key: 'name', label: '泳道名', type: 'text' },
        {
          key: 'tasks',
          label: '任务',
          type: 'array',
          maxItems: 5,
          itemSchema: [
            { key: 'label', label: '任务名', type: 'text' },
            { key: 'tone', label: '色调', type: 'select', options: [{ value: 'accent', label: 'accent' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
            { key: 'width', label: '宽度(%)', type: 'number' },
          ],
        },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11SwimlaneV1(props: Theme11SwimlaneV1Props): ReactNode {
  const { title, subtitle, eyebrow, lanes = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-swimlane">
      <div className="lp-theme11-swimlane-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-swimlane-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-swimlane-body">
        {lanes.slice(0, 4).map((lane, li) => (
          <div key={li} className="lp-theme11-swimlane-row lp-rise" style={{ animationDelay: `${li * 80}ms` } as React.CSSProperties}>
            <EditableField prop={`lanes.${li}.name`} slideIdx={s} editable={e} as="div" className="lp-theme11-swimlane-name">{lane.name}</EditableField>
            <div className="lp-theme11-swimlane-track">
              {lane.tasks?.slice(0, 6).map((task, ti) => (
                <div
                  key={ti}
                  className="lp-theme11-swimlane-task"
                  style={{ width: `${Math.max(10, Math.min(60, Number(task.width ?? 20)))}%`, background: TONE_VARS[task.tone ?? 'accent'] } as React.CSSProperties}
                >
                  <EditableField prop={`lanes.${li}.tasks.${ti}.label`} slideIdx={s} editable={e} as="span">{task.label}</EditableField>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
