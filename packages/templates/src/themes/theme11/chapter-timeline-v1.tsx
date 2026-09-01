// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 时间轴章节页（chapter_timeline_v1）
 * 情绪：sunset | 骨架：stage
 * 横向时间轴标记当前章节 + 居中标题。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ChapterTimelineV1Chapter {
  number?: string;
  label: string;
  active?: boolean;
}

export interface Theme11ChapterTimelineV1Props {
  title: string;
  subtitle?: string;
  chapters?: Theme11ChapterTimelineV1Chapter[];
  currentIndex?: number;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const defaultChapters: Theme11ChapterTimelineV1Chapter[] = [
  { number: '01', label: '背景', active: false },
  { number: '02', label: '产品', active: false },
  { number: '03', label: '案例', active: true },
  { number: '04', label: '数据', active: false },
  { number: '05', label: '展望', active: false },
];

export const theme11ChapterTimelineV1Meta: LayoutMeta = {
  id: 'theme11_chapter_timeline_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 时间轴章节页',
  description: '横向时间轴标记当前章节 + 居中标题',
  needsMedia: false,
  tags: ['chapter', 'timeline', 'light-stream'],
  contentShape: 'chapter-timeline',
};

export const theme11ChapterTimelineV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '客户案例' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '真实落地场景与成效' },
    {
      key: 'chapters',
      label: '章节节点',
      type: 'array',
      maxItems: 6,
      defaultValue: defaultChapters,
      itemSchema: [
        { key: 'number', label: '编号', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'active', label: '当前章节', type: 'boolean' },
      ],
    },
    { key: 'currentIndex', label: '当前索引', type: 'number', defaultValue: 2 },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'sunset' },
  ],
};

export function Theme11ChapterTimelineV1(props: Theme11ChapterTimelineV1Props): ReactNode {
  const { title, subtitle, chapters = defaultChapters, currentIndex = 2, mood = 'sunset', _slideIdx: s, _editable: e } = props;
  const list = chapters.slice(0, 6);

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-chapter-timeline">
      <div className="lp-theme11-chapter-timeline-inner lp-rise">
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-chapter-timeline-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chapter-timeline-sub">{subtitle}</EditableField>}
        <div className="lp-theme11-chapter-timeline-track">
          {list.map((c, i) => {
            const isActive = c.active ?? i === currentIndex;
            return (
              <div key={i} className={`lp-theme11-chapter-timeline-node ${isActive ? 'lp-theme11-chapter-timeline-node-active' : ''}`}>
                <div className="lp-theme11-chapter-timeline-dot" />
                {c.number && <span className="lp-theme11-chapter-timeline-number"><EditableField prop={`chapters.${i}.number`} slideIdx={s} editable={e} as="span">{c.number}</EditableField></span>}
                <span className="lp-theme11-chapter-timeline-label"><EditableField prop={`chapters.${i}.label`} slideIdx={s} editable={e} as="span">{c.label}</EditableField></span>
              </div>
            );
          })}
        </div>
      </div>
    </Sheet>
  );
}
