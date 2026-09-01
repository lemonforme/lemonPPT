// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 目录页（contents_v1）
 * 情绪：daylight | 骨架：column-2
 * 左侧标题 + 右侧编号目录条目 + 彩色状态点。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, EditableField, IconChip, SectionTitle, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11ContentsV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  entries?: { number: string; title: string; page?: string; icon: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ContentsV1Meta: LayoutMeta = {
  id: 'theme11_contents_v1',
  theme: 'theme11',
  role: 'tableOfContents',
  displayName: 'Theme 11 目录页',
  description: '左侧标题 + 右侧编号目录条目 + 彩色状态点',
  needsMedia: false,
  tags: ['contents', 'toc', 'light-stream'],
  contentShape: 'contents',
};

export const theme11ContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '目录' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从洞察到行动的阅读路径' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'CONTENTS' },
    { key: 'entries', label: '目录项', type: 'array', maxItems: 6, defaultValue: [{ number: '01', title: '市场背景', page: '03', icon: '◎' }, { number: '02', title: '核心能力', page: '08', icon: '▣' }, { number: '03', title: '数据洞察', page: '14', icon: '◈' }, { number: '04', title: '客户案例', page: '20', icon: '◇' }, { number: '05', title: '未来规划', page: '26', icon: '✦' }], itemSchema: [{ key: 'number', label: '编号', type: 'text', inlineEditable: true }, { key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'page', label: '页码', type: 'text', inlineEditable: true }, { key: 'icon', label: '图标', type: 'text', inlineEditable: true, defaultValue: '◎' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ContentsV1(props: Theme11ContentsV1Props): ReactNode {
  const { title, subtitle, eyebrow, entries = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green' | 'cyan'> = ['blue', 'violet', 'orange', 'green', 'cyan'];

  return (
    <Sheet mood={mood} frame="column-2" className="lp-theme11-contents">
      <div className="lp-theme11-contents-left">
        {eyebrow && <EditableField prop="eyebrow" slideIdx={s} editable={e} as="span" className="lp-theme11-eyelabel">{eyebrow}</EditableField>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-contents-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-contents-right">
        {entries.slice(0, 6).map((entry, i) => (
          <div key={i} className="lp-theme11-contents-entry lp-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <IconChip icon={entry.icon} tone={tones[i % tones.length]} />
            <div className="lp-theme11-contents-entry-main">
              <EditableField prop={`entries.${i}.number`} slideIdx={s} editable={e} as="span" className="lp-theme11-contents-entry-number">{entry.number}</EditableField>
              <EditableField prop={`entries.${i}.title`} slideIdx={s} editable={e} as="span" className="lp-theme11-contents-entry-title">{entry.title}</EditableField>
            </div>
            {entry.page && <Caption className="lp-theme11-contents-entry-page"><EditableField prop={`entries.${i}.page`} slideIdx={s} editable={e} as="span">{entry.page}</EditableField></Caption>}
          </div>
        ))}
      </div>
    </Sheet>
  );
}
