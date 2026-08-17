// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 甘特排期图（gantt_v1）
 * 情绪：aurora | 骨架：chart-canvas | 角色：chart
 * 任务工期排期（echarts custom）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, ganttOption } from './t10echart.js';

export interface Theme10GanttV1Task { name?: string; start?: number | string; end?: number | string; }
export interface Theme10GanttV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  tasks?: Theme10GanttV1Task[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10GanttV1Meta: LayoutMeta = {
  id: 'theme10_gantt_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 甘特排期图',
  description: '任务工期排期甘特图',
  needsMedia: false,
  tags: ['gantt', 'timeline', 'schedule', 'gold-index', 'aurora', 'chart'],
  contentShape: 'gantt',
};

export const theme10GanttV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '进度与排期' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Gantt' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一张图看完整条时间线' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '条越长，占用的窗口越久；错峰，是排期的艺术。' },
    {
      key: 'tasks',
      label: '任务',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { name: '立项', start: 0, end: 2 },
        { name: '调研', start: 1, end: 5 },
        { name: '设计', start: 4, end: 9 },
        { name: '开发', start: 6, end: 13 },
        { name: '内测', start: 12, end: 15 },
        { name: '上线', start: 15, end: 16 },
      ],
      itemSchema: [
        { key: 'name', label: '任务', type: 'text', inlineEditable: true },
        { key: 'start', label: '起始周', type: 'number', inlineEditable: true },
        { key: 'end', label: '结束周', type: 'number', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '进度与排期' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '62' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10GanttV1(props: Theme10GanttV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const tasks = (props.tasks ?? []).map((t, i) => ({ name: t.name ?? `任务 ${i + 1}`, start: Number(t.start ?? 0), end: Number(t.end ?? 0) }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-gantt">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={ganttOption({ tasks })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
