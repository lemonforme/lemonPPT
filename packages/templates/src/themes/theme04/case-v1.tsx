// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04CaseV1Milestone {
  date: string;
  title: string;
  subtitle?: string;
  description?: string;
  tone?: 'green' | 'yellow' | 'blue' | 'pink';
}

export interface Theme04CaseV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  quote?: string;
  author?: string;
  imageUrl?: string;
  milestones?: Theme04CaseV1Milestone[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04CaseV1Meta: LayoutMeta = {
  id: 'theme04_case_v1',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 典型案例时间线',
  description: '左侧案例标题+引言+图片，右侧时间线里程碑',
  needsMedia: true,
  mediaSlots: [{ name: '案例配图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['case', 'timeline', 'candy'],
  contentShape: 'case-study-timeline',
};

export const theme04CaseV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '典型案例 · CASE STUDY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'Anthropic' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从追赶到反超 · 估值登顶' },
    { key: 'badge', label: '徽章', type: 'text', inlineEditable: true, defaultValue: '估值 9650 亿美元 · 全球最高' },
    { key: 'imageUrl', label: '案例配图', type: 'image' },
    { key: 'quote', label: '引言', type: 'textarea', inlineEditable: true, defaultValue: '通过 Constitutional AI 构建可解释、可控的系统，比单纯追求规模更符合长远利益。' },
    { key: 'author', label: '引言作者', type: 'text', inlineEditable: true, defaultValue: '— Dario Amodei, CEO' },
    {
      key: 'milestones',
      label: '里程碑',
      type: 'array',
      minItems: 1,
      maxItems: 5,
      defaultValue: [
        { date: '2024 · 5月', title: 'Series G', subtitle: '融资 280 亿 · 估值 600 亿', description: '', tone: 'green' },
        { date: '2024 · 8月', title: 'Series H 首轮', subtitle: '融资 180 亿 · 估值 830 亿', description: '', tone: 'green' },
        { date: '2024 · 11月', title: 'Series H 扩轮', subtitle: '融资 190 亿 · 估值 9650 亿', description: '', tone: 'green' },
        { date: '2026 · 6月', title: '递交 IPO 申请', subtitle: '估值登顶 · 预计年内上市', description: '', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'date', label: '时间', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'subtitle', label: '副标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'green', label: '绿' }, { value: 'yellow', label: '黄' }, { value: 'blue', label: '蓝' }, { value: 'pink', label: '粉' }] },
      ],
    },
  ],
};

export function Theme04CaseV1(props: Theme04CaseV1Props): ReactNode {
  const { kicker, title, subtitle, badge, quote, author, imageUrl, milestones, _slideIdx, _editable } = props;
  const safeMilestones = (milestones ?? []).slice(0, 5);

  return (
    <div className="lp-slide lp-theme04-case">
      <div className="lp-theme04-case-left lp-rise">
        <div className="lp-theme04-case-head">
          {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme04-case-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-case-subtitle">{subtitle}</EditableField>
          )}
          {badge && <span className="lp-theme04-case-badge">{badge}</span>}
        </div>
        <div className="lp-theme04-case-image-wrap">
          <LpEditableImage prop="imageUrl" slideIdx={_slideIdx} editable={_editable} src={imageUrl} alt="案例配图" className="lp-theme04-case-image" placeholderText="+ 案例配图" />
        </div>
        {quote && (
          <div className="lp-theme04-case-quote">
            <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="p">{quote}</EditableField>
            {author && <EditableField prop="author" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-case-author">{author}</EditableField>}
          </div>
        )}
      </div>

      <div className="lp-theme04-case-timeline lp-rise">
        <div className="lp-theme04-case-timeline-line" />
        {safeMilestones.map((m, idx) => (
          <div key={idx} className={`lp-theme04-case-timeline-card lp-theme04-card lp-theme04-card--${m.tone ?? 'green'}`}>
            <div className={`lp-theme04-case-timeline-dot lp-theme04-case-timeline-dot--${m.tone ?? 'green'}`} />
            <EditableField prop={`milestones.${idx}.date`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-case-timeline-date">{m.date}</EditableField>
            <EditableField prop={`milestones.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-case-timeline-title">{m.title}</EditableField>
            {m.subtitle && (
              <EditableField prop={`milestones.${idx}.subtitle`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-case-timeline-subtitle">{m.subtitle}</EditableField>
            )}
            {m.description && (
              <EditableField prop={`milestones.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-case-timeline-desc">{m.description}</EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
