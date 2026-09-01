// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 案例研究页（case_study_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部核心指标带 + 三栏深度分析卡片，适合深度案例拆解。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, GradientCard, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11CaseStudyV1Metric {
  label: string;
  value: string;
  unit?: string;
}

export interface Theme11CaseStudyV1Section {
  label?: string;
  title: string;
  content: string;
  highlight?: string;
}

export interface Theme11CaseStudyV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  metrics?: Theme11CaseStudyV1Metric[];
  sections?: Theme11CaseStudyV1Section[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11CaseStudyV1Meta: LayoutMeta = {
  id: 'theme11_case_study_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 案例研究页',
  description: '核心指标带 + 三栏深度分析卡片',
  needsMedia: false,
  tags: ['case-study', 'analysis', 'grid', 'light-stream'],
  contentShape: 'detailed-case',
};

export const theme11CaseStudyV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DEEP DIVE' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: 'AI 客服升级全案复盘' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从人工为主到人机协同的服务转型' },
    {
      key: 'metrics',
      label: '核心指标',
      type: 'array',
      maxItems: 4,
      defaultValue: [
        { label: '响应时长', value: '12', unit: 's' },
        { label: '解决率', value: '89', unit: '%' },
        { label: '成本下降', value: '42', unit: '%' },
        { label: '满意度', value: '4.8', unit: '/5' },
      ],
      itemSchema: [
        { key: 'label', label: '指标名', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
      ],
    },
    {
      key: 'sections',
      label: '分析模块',
      type: 'array',
      maxItems: 3,
      defaultValue: [
        { label: '01', title: '挑战', content: '高峰期客服排队严重，重复问题占用 60% 人工时长，用户满意度持续下滑。', highlight: '60%' },
        { label: '02', title: '方案', content: '接入 lemonPPT 驱动的多轮对话引擎，自动识别意图并调用知识库生成答复。', highlight: 'AI 意图识别' },
        { label: '03', title: '结果', content: '90% 常见问题实现首轮自动闭环，复杂问题无缝转人工并附带上下文摘要。', highlight: '90%' },
      ],
      itemSchema: [
        { key: 'label', label: '编号', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'content', label: '内容', type: 'textarea' },
        { key: 'highlight', label: '高亮标签', type: 'text' },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

export function Theme11CaseStudyV1(props: Theme11CaseStudyV1Props): ReactNode {
  const { kicker, title, subtitle, metrics = [], sections = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const validMetrics = (metrics || []).filter((m): m is Theme11CaseStudyV1Metric => m != null).slice(0, 4);
  const validSections = (sections || []).filter((m): m is Theme11CaseStudyV1Section => m != null).slice(0, 3);

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-case-study">
      <div className="lp-theme11-case-study-header">
        {kicker && <Tagline>{kicker}</Tagline>}
        <SectionTitle tone="violet"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-case-study-sub">{subtitle}</EditableField>}
      </div>

      <div className="lp-theme11-case-study-metrics">
        {validMetrics.map((m, i) => (
          <GradientCard key={i} tone={tones[i % tones.length]} className="lp-theme11-case-study-metric lp-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="lp-theme11-case-study-metric-value">
              <EditableField prop={`metrics.${i}.value`} slideIdx={s} editable={e} as="span">{m.value}</EditableField>
              {m.unit && <span className="lp-theme11-case-study-metric-unit"><EditableField prop={`metrics.${i}.unit`} slideIdx={s} editable={e} as="span">{m.unit}</EditableField></span>}
            </div>
            <EditableField prop={`metrics.${i}.label`} slideIdx={s} editable={e} as="div" className="lp-theme11-case-study-metric-label">{m.label}</EditableField>
          </GradientCard>
        ))}
      </div>

      <div className="lp-theme11-case-study-grid">
        {validSections.map((sec, i) => (
          <Card key={i} className={`lp-theme11-case-study-card lp-rise lp-theme11-tile-tone-${tones[i % tones.length]}`} padding="large" style={{ animationDelay: `${i * 90}ms` }}>
            <div className="lp-theme11-case-study-card-head">
              {sec.label && <span className="lp-theme11-case-study-card-label"><EditableField prop={`sections.${i}.label`} slideIdx={s} editable={e} as="span">{sec.label}</EditableField></span>}
              <EditableField prop={`sections.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-case-study-card-title">{sec.title}</EditableField>
            </div>
            {sec.highlight && <span className="lp-theme11-case-study-card-highlight"><EditableField prop={`sections.${i}.highlight`} slideIdx={s} editable={e} as="span">{sec.highlight}</EditableField></span>}
            <EditableField prop={`sections.${i}.content`} slideIdx={s} editable={e} as="p" className="lp-theme11-case-study-card-content">{sec.content}</EditableField>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
