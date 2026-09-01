// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 问答页（faq_v1）
 * 情绪：daylight | 骨架：column-2
 * 左侧标题 + 右侧 FAQ 列表。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11FaqV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { q: string; a: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11FaqV1Meta: LayoutMeta = {
  id: 'theme11_faq_v1',
  theme: 'theme11',
  role: 'faq',
  displayName: 'Theme 11 问答页',
  description: '左侧标题 + 右侧 FAQ 列表',
  needsMedia: false,
  tags: ['faq', 'column-2', 'light-stream'],
  contentShape: 'faq',
};

export const theme11FaqV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '常见问题' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '关于 LemonPPT 你可能想知道的' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'FAQ' },
    { key: 'items', label: '问答', type: 'array', maxItems: 4, defaultValue: [
      { q: '支持哪些导出格式？', a: '目前支持 PPTX、PDF 和在线分享链接。' },
      { q: '是否可以自定义品牌？', a: '团队版和企业版支持品牌规范配置。' },
      { q: 'AI 生成需要多久？', a: '通常 30 秒内完成大纲与初稿。' },
      { q: '数据是否安全？', a: '企业版支持私有化部署与 SSO。' },
    ], itemSchema: [{ key: 'q', label: '问题', type: 'text', inlineEditable: true }, { key: 'a', label: '回答', type: 'textarea', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11FaqV1(props: Theme11FaqV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="column-2" className="lp-theme11-faq">
      <div className="lp-theme11-faq-left">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-faq-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-faq-list">
        {items.slice(0, 4).map((item, i) => (
          <Card key={i} className="lp-theme11-faq-item lp-rise" padding="medium" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="lp-theme11-faq-q">
              <span className="lp-theme11-faq-q-mark">Q</span>
              <EditableField prop={`items.${i}.q`} slideIdx={s} editable={e} as="span">{item.q}</EditableField>
            </div>
            <EditableField prop={`items.${i}.a`} slideIdx={s} editable={e} as="p" className="lp-theme11-faq-a">{item.a}</EditableField>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
