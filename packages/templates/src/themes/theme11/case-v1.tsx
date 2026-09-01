// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 案例展示页（case_v1）
 * 情绪：daylight | 骨架：split
 * 左侧案例标题+引言+图片，右侧垂直时间线里程碑。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, EditorialPhoto, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11CaseV1Milestone {
  date: string;
  title: string;
  subtitle?: string;
  description?: string;
  tone?: 'blue' | 'violet' | 'orange' | 'green';
}

export interface Theme11CaseV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  quote?: string;
  author?: string;
  imageUrl?: string;
  milestones?: Theme11CaseV1Milestone[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11CaseV1Meta: LayoutMeta = {
  id: 'theme11_case_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 案例展示页',
  description: '左侧案例标题+引言+图片，右侧时间线里程碑',
  needsMedia: true,
  mediaSlots: [{ name: '案例配图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['case', 'timeline', 'light-stream'],
  contentShape: 'case-study-timeline',
};

export const theme11CaseV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CASE STUDY' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: 'LemonPPT 企业部署实践' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从内容生产瓶颈到全员创意效率提升' },
    { key: 'badge', label: '徽章', type: 'text', inlineEditable: true, defaultValue: '效率提升 340%' },
    { key: 'quote', label: '引言', type: 'textarea', inlineEditable: true, defaultValue: '「它不只是模板工具，而是把设计系统嵌入了我们的工作流。」' },
    { key: 'author', label: '引言作者', type: 'text', inlineEditable: true, defaultValue: '— 产品运营总监，某 SaaS 独角兽' },
    { key: 'imageUrl', label: '案例配图', type: 'image', defaultValue: '' },
    {
      key: 'milestones',
      label: '里程碑',
      type: 'array',
      minItems: 1,
      maxItems: 5,
      defaultValue: [
        { date: '2025 Q1', title: '需求诊断', subtitle: '识别 6 大重复设计场景', description: '市场、销售、HR 每周消耗大量时间在 PPT 美化上。', tone: 'blue' },
        { date: '2025 Q2', title: '试点上线', subtitle: '3 个部门 120 人先行', description: '通过 AI 生成初稿，设计团队专注审核与品牌把关。', tone: 'violet' },
        { date: '2025 Q3', title: '品牌规范固化', subtitle: '主题系统覆盖 11 套风格', description: '所有输出自动遵循字体、色彩与图位规范。', tone: 'orange' },
        { date: '2025 Q4', title: '全员推广', subtitle: '月度生成量破 10,000 页', description: '创意产出周期从 3 天缩短至 30 分钟。', tone: 'green' },
      ],
      itemSchema: [
        { key: 'date', label: '时间', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'subtitle', label: '副标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'blue', label: 'blue' }, { value: 'violet', label: 'violet' }, { value: 'orange', label: 'orange' }, { value: 'green', label: 'green' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

const toneClass: Record<string, string> = {
  blue: 'lp-theme11-tile-tone-blue',
  violet: 'lp-theme11-tile-tone-violet',
  orange: 'lp-theme11-tile-tone-orange',
  green: 'lp-theme11-tile-tone-green',
};

export function Theme11CaseV1(props: Theme11CaseV1Props): ReactNode {
  const { kicker, title, subtitle, badge, quote, author, imageUrl, milestones = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const validMilestones = (milestones || []).filter((m): m is Theme11CaseV1Milestone => m != null).slice(0, 5);

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-case">
      <div className="lp-theme11-case-left lp-rise">
        <div className="lp-theme11-case-head">
          {kicker && <Tagline>{kicker}</Tagline>}
          <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
          {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-case-sub">{subtitle}</EditableField>}
          {badge && <span className="lp-theme11-case-badge"><EditableField prop="badge" slideIdx={s} editable={e} as="span">{badge}</EditableField></span>}
        </div>
        <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} alt="案例配图" className="lp-theme11-case-image" placeholderClassName="lp-theme11-case-image-placeholder" />
        {quote && (
          <div className="lp-theme11-case-quote">
            <EditableField prop="quote" slideIdx={s} editable={e} as="p">{quote}</EditableField>
            {author && <EditableField prop="author" slideIdx={s} editable={e} as="span" className="lp-theme11-case-author">{author}</EditableField>}
          </div>
        )}
      </div>

      <div className="lp-theme11-case-timeline">
        <div className="lp-theme11-case-timeline-line" />
        {validMilestones.map((m, i) => (
          <div key={i} className={`lp-theme11-case-timeline-event lp-rise ${toneClass[m.tone ?? 'blue'] ?? ''}`} style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`lp-theme11-case-timeline-dot lp-theme11-case-timeline-dot-${m.tone ?? 'blue'}`} aria-hidden="true" />
            <Card className="lp-theme11-case-timeline-card" padding="medium">
              <EditableField prop={`milestones.${i}.date`} slideIdx={s} editable={e} as="span" className="lp-theme11-case-timeline-date">{m.date}</EditableField>
              <EditableField prop={`milestones.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-case-timeline-title">{m.title}</EditableField>
              {m.subtitle && <EditableField prop={`milestones.${i}.subtitle`} slideIdx={s} editable={e} as="div" className="lp-theme11-case-timeline-sub">{m.subtitle}</EditableField>}
              {m.description && <EditableField prop={`milestones.${i}.description`} slideIdx={s} editable={e} as="p" className="lp-theme11-case-timeline-desc">{m.description}</EditableField>}
            </Card>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
