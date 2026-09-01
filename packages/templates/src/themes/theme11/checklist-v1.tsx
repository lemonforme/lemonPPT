// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 检查清单页（checklist_v1）
 * 情绪：daylight | 骨架：sidebar
 * 左侧标题 + 右侧清单项。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11ChecklistV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { text: string; checked?: boolean }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ChecklistV1Meta: LayoutMeta = {
  id: 'theme11_checklist_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 检查清单页',
  description: '左侧标题 + 右侧清单项',
  needsMedia: false,
  tags: ['checklist', 'sidebar', 'light-stream'],
  contentShape: 'checklist',
};

export const theme11ChecklistV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '上线检查清单' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '确保演示在发布前达到最佳状态' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'CHECKLIST' },
    { key: 'items', label: '检查项', type: 'array', maxItems: 6, defaultValue: [
      { text: '内容逻辑清晰，结论先行', checked: true },
      { text: '数据与图表来源可靠', checked: true },
      { text: '品牌字体与颜色一致', checked: false },
      { text: '关键页面已添加配图', checked: true },
      { text: '演讲者备注已补充', checked: false },
      { text: '导出格式已确认', checked: true },
    ], itemSchema: [{ key: 'text', label: '内容', type: 'text', inlineEditable: true }, { key: 'checked', label: '已勾选', type: 'boolean' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ChecklistV1(props: Theme11ChecklistV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme11-checklist">
      <div className="lp-theme11-checklist-left">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-checklist-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-checklist-right">
        {items.slice(0, 6).map((item, i) => (
          <Card key={i} className={`lp-theme11-checklist-item lp-rise ${item.checked ? 'lp-theme11-checklist-checked' : ''}`} padding="medium" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="lp-theme11-checklist-box" aria-hidden="true">{item.checked ? '✓' : ''}</span>
            <EditableField prop={`items.${i}.text`} slideIdx={s} editable={e} as="span">{item.text}</EditableField>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
