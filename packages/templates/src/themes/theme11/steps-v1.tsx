// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 步骤流程页（steps_v1）
 * 情绪：aurora | 骨架：grid
 * 顶部标题 + 横向步骤卡片（编号 + 标题 + 描述）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11StepsV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  steps?: { title: string; desc: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11StepsV1Meta: LayoutMeta = {
  id: 'theme11_steps_v1',
  theme: 'theme11',
  role: 'process',
  displayName: 'Theme 11 步骤流程页',
  description: '顶部标题 + 横向步骤卡片',
  needsMedia: false,
  tags: ['process', 'steps', 'grid', 'light-stream'],
  contentShape: 'steps',
};

export const theme11StepsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '使用流程' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '三步完成高质量演示' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'STEPS' },
    { key: 'steps', label: '步骤', type: 'array', maxItems: 4, defaultValue: [
      { title: '输入主题', desc: '一句话描述你的演示目标。' },
      { title: 'AI 生成', desc: '自动大纲、版式与配图建议。' },
      { title: '在线编辑', desc: '拖拽调整、实时协作。' },
      { title: '导出交付', desc: 'PPTX / PDF / 链接一键分享。' },
    ], itemSchema: [{ key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'desc', label: '描述', type: 'textarea', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11StepsV1(props: Theme11StepsV1Props): ReactNode {
  const { title, subtitle, eyebrow, steps = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-steps">
      <div className="lp-theme11-steps-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-steps-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-steps-track">
        {steps.slice(0, 4).map((step, i) => (
          <div key={i} className="lp-theme11-steps-item">
            <div className={`lp-theme11-steps-connector ${i === 0 ? 'lp-theme11-steps-connector-first' : ''}`} aria-hidden="true" />
            <Card className={`lp-theme11-steps-card lp-theme11-tile-tone-${tones[i % tones.length]} lp-rise`} padding="medium" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="lp-theme11-steps-number" style={{ color: `var(--lp-${tones[i % tones.length] === 'blue' ? 'accent' : tones[i % tones.length]})` }}>0{i + 1}</span>
              <EditableField prop={`steps.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-steps-card-title">{step.title}</EditableField>
              <Caption><EditableField prop={`steps.${i}.desc`} slideIdx={s} editable={e} as="span">{step.desc}</EditableField></Caption>
            </Card>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
