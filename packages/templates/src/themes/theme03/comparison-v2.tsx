// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ComparisonV2Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  cards?: Array<{ label?: string; score?: number; max?: number; note?: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ComparisonV2Meta: LayoutMeta = {
  id: 'theme03_comparison_v2',
  theme: 'theme03',
  role: 'comparison',
  displayName: 'Theme 03 编辑风评分卡对比',
  description: '多维度评分卡并排对比',
  needsMedia: false,
  tags: ['comparison', 'scorecard'],
  contentShape: 'score-cards',
};

export const theme03ComparisonV2Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '对比分析' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'COMPARE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'SCORECARD // VS' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{多维度}}评分对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'cards',
      label: '卡片',
      type: 'array',
      maxItems: 4,
      minItems: 2,
      itemSchema: [
        { key: 'label', label: '名称', type: 'text', inlineEditable: true },
        { key: 'score', label: '得分', type: 'number', inlineEditable: true },
        { key: 'max', label: '满分', type: 'number', inlineEditable: true },
        { key: 'note', label: '备注', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03ComparisonV2(props: Theme03ComparisonV2Props): ReactNode {
  const { tag, tagLabel, topRightMeta, kicker, title, subtitle, cards = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeCards = cards.slice(0, 4);

  return (
    <div className="lp-slide lp-theme03-comparison-v2">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-comparison-v2-main">
        <div className="lp-theme03-comparison-v2-head lp-rise">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-comparison-v2-kicker">{kicker}</EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme03-comparison-v2-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-comparison-v2-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-comparison-v2-grid">
          {safeCards.map((card, index) => {
            const score = typeof card.score === 'number' ? card.score : Number(card.score) || 0;
            const max = (typeof card.max === 'number' && card.max > 0) ? card.max : Number(card.max) || 100;
            const pct = Math.min(100, Math.max(0, (score / max) * 100));
            return (
              <div key={index} className="lp-theme03-comparison-v2-card lp-rise">
                <EditableField prop={`cards.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme03-comparison-v2-label">{card.label}</EditableField>
                <div className="lp-theme03-comparison-v2-score-row">
                  <EditableField prop={`cards.${index}.score`} slideIdx={_slideIdx} editable={_editable} as="span" fieldType="number" className="lp-theme03-comparison-v2-score">{score}</EditableField>
                  <span className="lp-theme03-comparison-v2-max">/ {max}</span>
                </div>
                <div className="lp-theme03-comparison-v2-bar">
                  <div className="lp-theme03-comparison-v2-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <EditableField prop={`cards.${index}.note`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-comparison-v2-note">{card.note || ''}</EditableField>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
