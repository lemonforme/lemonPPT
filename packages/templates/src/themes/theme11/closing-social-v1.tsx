// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 社交媒体结束页（closing_social_v1）
 * 情绪：aurora | 骨架：grid
 * 标题 + 社交平台卡片矩阵。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, GradientCard, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11ClosingSocialV1Props {
  title: string;
  subtitle?: string;
  links?: { platform: string; handle: string; tone?: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ClosingSocialV1Meta: LayoutMeta = {
  id: 'theme11_closing_social_v1',
  theme: 'theme11',
  role: 'closing',
  displayName: 'Theme 11 社交媒体页',
  description: '标题 + 社交平台卡片矩阵',
  needsMedia: false,
  tags: ['closing', 'social', 'light-stream'],
  contentShape: 'closing',
};

export const theme11ClosingSocialV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '关注我们' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '在社交媒体上获取最新动态与案例。' },
    {
      key: 'links',
      label: '社交链接',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { platform: '微信公众号', handle: '@lemonPPT', tone: 'green' },
        { platform: '微博', handle: '@lemonPPT官方', tone: 'orange' },
        { platform: 'LinkedIn', handle: '/company/lemonppt', tone: 'blue' },
        { platform: 'Twitter / X', handle: '@lemonppt', tone: 'cyan' },
      ],
      itemSchema: [
        { key: 'platform', label: '平台', type: 'text' },
        { key: 'handle', label: '账号', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'blue', label: 'blue' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }, { value: 'cyan', label: 'cyan' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ClosingSocialV1(props: Theme11ClosingSocialV1Props): ReactNode {
  const { title, subtitle, links = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-closing-social">
      <div className="lp-theme11-closing-social-header lp-rise">
        <SignalLine />
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-closing-social-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-closing-social-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-closing-social-grid">
        {links.map((l, i) => (
          <Card key={i} className="lp-theme11-closing-social-card lp-rise" style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}>
            <GradientCard tone={(l.tone as any) ?? 'blue'} className="lp-theme11-closing-social-badge">
              <EditableField prop={`links.${i}.platform`} slideIdx={s} editable={e} as="span">{l.platform}</EditableField>
            </GradientCard>
            <EditableField prop={`links.${i}.handle`} slideIdx={s} editable={e} as="span" className="lp-theme11-closing-social-handle">{l.handle}</EditableField>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
