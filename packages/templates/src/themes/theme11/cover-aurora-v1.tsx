// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 极光弥散封面（cover_aurora_v1）
 * 情绪：aurora | 骨架：full-bleed | 图位：0
 * 柔和弥散渐变 + 巨型标题 + 顶部信号条 + 细网格。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, FineGrid, Sheet, SignalLine, TopBar, type Theme11Mood } from './shared.js';

export interface Theme11CoverAuroraV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  topbarLabel?: string;
  topbarStatus?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11CoverAuroraV1Meta: LayoutMeta = {
  id: 'theme11_cover_aurora_v1',
  theme: 'theme11',
  role: 'cover',
  displayName: 'Theme 11 极光弥散封面',
  description: '柔和弥散渐变 + 巨型标题 + 顶部信号条 + 细网格',
  needsMedia: false,
  tags: ['cover', 'aurora', 'light-stream'],
  contentShape: 'cover-aurora',
};

export const theme11CoverAuroraV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'LIGHT STREAM · 2026' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '让数据流动\n让洞察发生' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '面向 SaaS 与 AI 团队的浅色扁平科技演示方案。' },
    { key: 'topbarLabel', label: '顶条标题', type: 'text', defaultValue: 'lemonPPT / Theme 11', inlineEditable: true },
    { key: 'topbarStatus', label: '顶条状态', type: 'text', defaultValue: 'LIVE', inlineEditable: true },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11CoverAuroraV1(props: Theme11CoverAuroraV1Props): ReactNode {
  const { kicker, title, subtitle, topbarLabel, topbarStatus, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-cover-aurora">
      <FineGrid />
      <TopBar label={topbarLabel} status={topbarStatus} slideIdx={s} editable={e} />
      <div className="lp-theme11-cover-aurora-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={s} editable={e} as="div" className="lp-theme11-eyelabel lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme11-cover-aurora-title lp-rise" style={{ animationDelay: '60ms' }}>
          {title}
        </EditableField>
        <SignalLine className="lp-rise" />
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-cover-aurora-sub lp-rise" style={{ animationDelay: '120ms' }}>
            {subtitle}
          </EditableField>
        )}
      </div>
    </Sheet>
  );
}
