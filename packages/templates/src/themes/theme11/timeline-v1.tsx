// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 时间线页（timeline_v1）
 * 情绪：sunset | 骨架：sidebar
 * 左侧标题 + 右侧垂直时间线。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11TimelineV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  events?: { time: string; title: string; desc?: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11TimelineV1Meta: LayoutMeta = {
  id: 'theme11_timeline_v1',
  theme: 'theme11',
  role: 'timeline',
  displayName: 'Theme 11 时间线页',
  description: '左侧标题 + 右侧垂直时间线',
  needsMedia: false,
  tags: ['timeline', 'sidebar', 'light-stream'],
  contentShape: 'timeline',
};

export const theme11TimelineV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '发展里程碑' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从想法到规模化产品的关键节点' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'TIMELINE' },
    { key: 'events', label: '事件', type: 'array', maxItems: 4, defaultValue: [
      { time: '2024 Q1', title: '产品立项', desc: '验证 AI 生成演示的核心假设。' },
      { time: '2024 Q2', title: '内测上线', desc: '邀请 50 个种子团队试用。' },
      { time: '2024 Q4', title: '公开版发布', desc: '支持 11 套主题与 60+ 版式。' },
      { time: '2025 Q2', title: '企业版', desc: '推出协作、品牌规范与 API。' },
    ], itemSchema: [{ key: 'time', label: '时间', type: 'text', inlineEditable: true }, { key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'desc', label: '描述', type: 'textarea', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11TimelineV1(props: Theme11TimelineV1Props): ReactNode {
  const { title, subtitle, eyebrow, events = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme11-timeline">
      <div className="lp-theme11-timeline-left">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-timeline-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-timeline-right">
        {events.slice(0, 4).map((event, i) => (
          <div key={i} className="lp-theme11-timeline-event lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`lp-theme11-timeline-dot lp-theme11-timeline-dot-${tones[i % tones.length]}`} aria-hidden="true" />
            <Card className="lp-theme11-timeline-card" padding="medium">
              <EditableField prop={`events.${i}.time`} slideIdx={s} editable={e} as="span" className="lp-theme11-timeline-time">{event.time}</EditableField>
              <EditableField prop={`events.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-timeline-card-title">{event.title}</EditableField>
              {event.desc && <EditableField prop={`events.${i}.desc`} slideIdx={s} editable={e} as="p" className="lp-theme11-timeline-card-desc">{event.desc}</EditableField>}
            </Card>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
