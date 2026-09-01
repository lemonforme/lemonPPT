// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 目录 V2（table_of_contents_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + 横向卡片式目录。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, IconChip, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11TableOfContentsV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { title: string; page?: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11TableOfContentsV1Meta: LayoutMeta = {
  id: 'theme11_table_of_contents_v1',
  theme: 'theme11',
  role: 'tableOfContents',
  displayName: 'Theme 11 目录 V2',
  description: '顶部标题 + 横向卡片式目录',
  needsMedia: false,
  tags: ['contents', 'tableOfContents', 'grid', 'light-stream'],
  contentShape: 'table-of-contents',
};

export const theme11TableOfContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '目录' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从战略到执行的完整叙事' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'CONTENTS' },
    { key: 'items', label: '目录项', type: 'array', maxItems: 5, defaultValue: [{ title: '市场背景', page: '03' }, { title: '核心能力', page: '08' }, { title: '数据洞察', page: '14' }, { title: '客户案例', page: '20' }, { title: '未来规划', page: '26' }], itemSchema: [{ key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'page', label: '页码', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11TableOfContentsV1(props: Theme11TableOfContentsV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green' | 'cyan'> = ['blue', 'violet', 'orange', 'green', 'cyan'];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-toc-v1">
      <div className="lp-theme11-toc-v1-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-toc-v1-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-toc-v1-grid">
        {items.slice(0, 5).map((item, i) => (
          <Card key={i} className={`lp-theme11-toc-v1-card lp-theme11-tile-tone-${tones[i % tones.length]} lp-rise`} padding="medium" style={{ animationDelay: `${i * 70}ms` }}>
            <IconChip icon={`0${i + 1}`} tone={tones[i % tones.length]} className="lp-theme11-toc-v1-chip" />
            <EditableField prop={`items.${i}.title`} slideIdx={s} editable={e} as="span" className="lp-theme11-toc-v1-title">{item.title}</EditableField>
            {item.page && <EditableField prop={`items.${i}.page`} slideIdx={s} editable={e} as="span" className="lp-theme11-toc-v1-page">{item.page}</EditableField>}
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
