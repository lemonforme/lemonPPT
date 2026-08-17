// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 里程碑时间轴（timeline_v1）
 * 情绪：ember | 骨架：chart-canvas | 角色：chart
 * 关键节点时间轴（echarts custom）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, timelineOption } from './t10echart.js';

export interface Theme10TimelineV1Event { year?: string; text?: string; }
export interface Theme10TimelineV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  events?: Theme10TimelineV1Event[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10TimelineV1Meta: LayoutMeta = {
  id: 'theme10_timeline_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 里程碑时间轴',
  description: '关键节点时间轴',
  needsMedia: false,
  tags: ['timeline', 'milestone', 'roadmap', 'gold-index', 'ember', 'chart'],
  contentShape: 'timeline',
};

export const theme10TimelineV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '历程与节点' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Timeline' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '沿着时间，一路向前' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '每一个节点，都是一次转折；串起来，就是这条路。' },
    {
      key: 'events',
      label: '节点',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { year: '2019', text: '立项启航' },
        { year: '2021', text: '首轮融资' },
        { year: '2023', text: '产品量产' },
        { year: '2025', text: '出海布局' },
      ],
      itemSchema: [
        { key: 'year', label: '年份', type: 'text', inlineEditable: true },
        { key: 'text', label: '事件', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '历程与节点' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '66' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10TimelineV1(props: Theme10TimelineV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const events = (props.events ?? []).map((ev, i) => ({ year: ev.year ?? String(i + 1), text: ev.text ?? '' }));

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-timeline">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={timelineOption({ events })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
