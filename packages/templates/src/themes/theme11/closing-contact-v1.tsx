// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 联系方式结束页（closing_contact_v1）
 * 情绪：daylight | 骨架：column-2
 * 左侧标题 + 右侧联系卡片矩阵。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, IconChip, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ClosingContactV1Props {
  title: string;
  subtitle?: string;
  contacts?: { icon: string; label: string; value: string; tone?: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ClosingContactV1Meta: LayoutMeta = {
  id: 'theme11_closing_contact_v1',
  theme: 'theme11',
  role: 'closing',
  displayName: 'Theme 11 联系方式页',
  description: '左侧标题 + 右侧联系卡片矩阵',
  needsMedia: false,
  tags: ['closing', 'contact', 'light-stream'],
  contentShape: 'closing',
};

export const theme11ClosingContactV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '保持联系' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '有任何问题，欢迎通过以下方式找到我们。' },
    {
      key: 'contacts',
      label: '联系方式',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { icon: '✉', label: '邮箱', value: 'hello@lemonppt.dev', tone: 'blue' },
        { icon: '☎', label: '电话', value: '+86 21 8888 8888', tone: 'green' },
        { icon: '🌐', label: '网站', value: 'www.lemonppt.dev', tone: 'violet' },
        { icon: '📍', label: '地址', value: '上海市浦东新区', tone: 'orange' },
      ],
      itemSchema: [
        { key: 'icon', label: '图标', type: 'text' },
        { key: 'label', label: '类型', type: 'text' },
        { key: 'value', label: '内容', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'blue', label: 'blue' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }, { value: 'cyan', label: 'cyan' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11ClosingContactV1(props: Theme11ClosingContactV1Props): ReactNode {
  const { title, subtitle, contacts = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="column-2" className="lp-theme11-closing-contact">
      <div className="lp-theme11-closing-contact-left lp-rise">
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-closing-contact-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-closing-contact-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-closing-contact-right">
        {contacts.map((c, i) => (
          <Card key={i} className="lp-theme11-closing-contact-card lp-rise" style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}>
            <IconChip icon={c.icon} tone={(c.tone as any) ?? 'blue'} className="lp-theme11-closing-contact-chip" />
            <div className="lp-theme11-closing-contact-body">
              <span className="lp-theme11-closing-contact-label">{c.label}</span>
              <EditableField prop={`contacts.${i}.value`} slideIdx={s} editable={e} as="span" className="lp-theme11-closing-contact-value">{c.value}</EditableField>
            </div>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
