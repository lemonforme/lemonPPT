// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 杂志编辑页（editorial_v1）
 * 情绪：aurora | 骨架：split
 * 左侧大图+引言，右侧彩色要点卡片，杂志化跨页排版。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, EditorialPhoto, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11EditorialV1Item {
  label?: string;
  title?: string;
  description?: string;
  tone?: 'blue' | 'violet' | 'orange' | 'green';
}

export interface Theme11EditorialV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  quote?: string;
  author?: string;
  imageUrl?: string;
  items?: Theme11EditorialV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11EditorialV1Meta: LayoutMeta = {
  id: 'theme11_editorial_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 杂志编辑页',
  description: '左侧大图+引言，右侧彩色要点卡片',
  needsMedia: true,
  mediaSlots: [{ name: '主视觉图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['editorial', 'magazine', 'light-stream'],
  contentShape: 'editorial-spread',
};

export const theme11EditorialV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '深度特写' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'EDITORIAL' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'LIGHT STREAM · EDITION 01' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: 'AI 生成式演示的下一个十年' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从工具到创意伙伴，演示软件正在被重新定义。' },
    { key: 'quote', label: '引言', type: 'textarea', inlineEditable: true, defaultValue: '「最好的演示不是信息的搬运，而是观点的放大。」' },
    { key: 'author', label: '引言作者', type: 'text', inlineEditable: true, defaultValue: '— 设计主编' },
    { key: 'imageUrl', label: '主视觉图', type: 'image', defaultValue: '' },
    {
      key: 'items',
      label: '要点卡片',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { label: '01', title: '意图理解', description: '自动识别演讲目标与受众层级。', tone: 'blue' },
        { label: '02', title: '视觉系统', description: '主题、字体、色彩与动效统一输出。', tone: 'violet' },
        { label: '03', title: '数据叙事', description: '把枯燥数字转化为可交互的洞察。', tone: 'orange' },
        { label: '04', title: '协作闭环', description: '多人实时审阅与品牌规范校验。', tone: 'green' },
      ],
      itemSchema: [
        { key: 'label', label: '编号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'blue', label: 'blue' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT 研究出品' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: '趋势观察' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

const toneClass: Record<string, string> = {
  blue: 'lp-theme11-tile-tone-blue',
  violet: 'lp-theme11-tile-tone-violet',
  orange: 'lp-theme11-tile-tone-orange',
  green: 'lp-theme11-tile-tone-green',
};

export function Theme11EditorialV1(props: Theme11EditorialV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, quote, author, imageUrl, items, footnoteLeft, footnoteRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const validItems = (items || []).filter((i): i is Theme11EditorialV1Item => i != null).slice(0, 4);

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-editorial">
      <div className="lp-theme11-editorial-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme11-editorial-tag">
            {tag && <Tagline>{tag}</Tagline>}
            {tag && tagLabel && <span className="lp-theme11-editorial-tag-sep">·</span>}
            {tagLabel && <Tagline>{tagLabel}</Tagline>}
          </div>
        )}
        {topRightMeta && <EditableField prop="topRightMeta" slideIdx={s} editable={e} as="div" className="lp-theme11-editorial-meta">{topRightMeta}</EditableField>}
      </div>

      <div className="lp-theme11-editorial-main">
        <div className="lp-theme11-editorial-left lp-rise">
          <div className="lp-theme11-editorial-head">
            <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
            {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-editorial-sub">{subtitle}</EditableField>}
          </div>
          <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} alt="主视觉图" className="lp-theme11-editorial-image" placeholderClassName="lp-theme11-editorial-image-placeholder" />
          {quote && (
            <div className="lp-theme11-editorial-quote">
              <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote">{quote}</EditableField>
              {author && <EditableField prop="author" slideIdx={s} editable={e} as="cite">{author}</EditableField>}
            </div>
          )}
        </div>

        <div className="lp-theme11-editorial-right">
          {validItems.map((item, i) => (
            <Card key={i} className={`lp-theme11-editorial-card lp-rise ${toneClass[item.tone ?? 'blue'] ?? ''}`} padding="medium" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-theme11-editorial-card-head">
                {item.label && <EditableField prop={`items.${i}.label`} slideIdx={s} editable={e} as="span" className="lp-theme11-editorial-card-label">{item.label}</EditableField>}
                {item.title && <EditableField prop={`items.${i}.title`} slideIdx={s} editable={e} as="h4" className="lp-theme11-editorial-card-title">{item.title}</EditableField>}
              </div>
              {item.description && <EditableField prop={`items.${i}.description`} slideIdx={s} editable={e} as="p" className="lp-theme11-editorial-card-desc">{item.description}</EditableField>}
            </Card>
          ))}
        </div>
      </div>

      <div className="lp-theme11-editorial-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={s} editable={e} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={s} editable={e} as="span">{footnoteRight}</EditableField>}
      </div>
    </Sheet>
  );
}
