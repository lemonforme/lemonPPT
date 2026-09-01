// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 结论摘要页（summary_v1）
 * 情绪：aurora | 骨架：split
 * 左侧要点列表 + 右侧高亮结论面板。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, EditableField, GradientCard, SectionTitle, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11SummaryV1Point {
  text?: string;
}

export interface Theme11SummaryV1Props {
  title?: string;
  subtitle?: string;
  points?: Theme11SummaryV1Point[];
  value?: string;
  valueLabel?: string;
  valueDescription?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11SummaryV1Meta: LayoutMeta = {
  id: 'theme11_summary_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 结论摘要',
  description: '左侧要点列表 + 右侧高亮结论面板',
  needsMedia: false,
  tags: ['summary', 'conclusion', 'light-stream'],
  contentShape: 'summary',
};

export const theme11SummaryV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心结论' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键提炼' },
    {
      key: 'points',
      label: '结论要点',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: [
        { text: 'AI 资本持续向头部大模型与基础设施集中。' },
        { text: '垂直场景应用进入规模化落地阶段。' },
        { text: 'AI 安全与合规成为新的投资热点。' },
        { text: '多模态与 Agent 架构重塑产品边界。' },
      ],
      itemSchema: [{ key: 'text', label: '要点', type: 'textarea' }],
    },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '+38%' },
    { key: 'valueLabel', label: '主数值说明', type: 'text', inlineEditable: true, defaultValue: '年度同比增长' },
    { key: 'valueDescription', label: '解读文字', type: 'textarea', inlineEditable: true, defaultValue: '核心指标连续四个季度保持双位数增长，验证产品市场契合度。' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11SummaryV1(props: Theme11SummaryV1Props): ReactNode {
  const { title, subtitle, points = [], value, valueLabel, valueDescription, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const validPoints = (points || []).filter((p): p is Theme11SummaryV1Point => p != null).slice(0, 5);

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-summary">
      <div className="lp-theme11-summary-left">
        <SectionTitle tone="accent" className="lp-theme11-summary-eyebrow">SUMMARY</SectionTitle>
        {title && (
          <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-summary-title">{title}</EditableField>
        )}
        {subtitle && <Caption className="lp-theme11-summary-sub"><EditableField prop="subtitle" slideIdx={s} editable={e} as="span">{subtitle}</EditableField></Caption>}
        {validPoints.length > 0 && (
          <ul className="lp-theme11-summary-list">
            {validPoints.map((point, index) => (
              <li key={index} className="lp-theme11-summary-item lp-rise" style={{ animationDelay: `${index * 60}ms` } as React.CSSProperties}>
                <span className="lp-theme11-summary-number">{String(index + 1).padStart(2, '0')}</span>
                <EditableField prop={`points.${index}.text`} slideIdx={s} editable={e} as="span">{point.text || ''}</EditableField>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lp-theme11-summary-right lp-rise">
        <GradientCard tone="violet" className="lp-theme11-summary-conclusion">
          {value && (
            <EditableField prop="value" slideIdx={s} editable={e} as="div" className="lp-theme11-summary-value">{value}</EditableField>
          )}
          {valueLabel && (
            <EditableField prop="valueLabel" slideIdx={s} editable={e} as="div" className="lp-theme11-summary-value-label">{valueLabel}</EditableField>
          )}
          {valueDescription && (
            <EditableField prop="valueDescription" slideIdx={s} editable={e} as="p" className="lp-theme11-summary-value-desc">{valueDescription}</EditableField>
          )}
        </GradientCard>
      </div>
    </Sheet>
  );
}
