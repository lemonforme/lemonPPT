// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ScorecardV1Item {
  label?: string;
  score?: number;
  max?: number;
  note?: string;
}

export interface Theme03ScorecardV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  items?: Theme03ScorecardV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ScorecardV1Meta: LayoutMeta = {
  id: 'theme03_scorecard_v1',
  theme: 'theme03',
  role: 'metric',
  displayName: 'Theme 03 编辑风评分卡',
  description: '深色代码编辑风多维度评分卡 + 进度条',
  needsMedia: false,
  tags: ['metric', 'scorecard', 'progress'],
  contentShape: 'scorecard',
};

export const theme03ScorecardV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '评分卡' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'SCORE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{多维度}}评分卡' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'items',
      label: '评分项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
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

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-scorecard-v1-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03ScorecardV1(props: Theme03ScorecardV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-scorecard-v1">
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

      <div className="lp-theme03-scorecard-v1-main">
        <div className="lp-theme03-scorecard-v1-head lp-rise">
          {title && renderTitle(title, _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-scorecard-v1-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {items.length > 0 && (
          <div className="lp-theme03-scorecard-v1-list lp-rise">
            {items.map((item, index) => {
              const score = typeof item.score === 'number' ? item.score : 0;
              const max = typeof item.max === 'number' && item.max > 0 ? item.max : 100;
              const pct = Math.min(100, Math.max(0, (score / max) * 100));
              return (
                <div key={index} className="lp-theme03-scorecard-v1-row">
                  <div className="lp-theme03-scorecard-v1-info">
                    <EditableField
                      prop={`items.${index}.label`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-theme03-scorecard-v1-label"
                    >
                      {item.label || ''}
                    </EditableField>
                    <div className="lp-theme03-scorecard-v1-score-wrap">
                      <span className="lp-theme03-scorecard-v1-score">{score}</span>
                      <span className="lp-theme03-scorecard-v1-max">/ {max}</span>
                    </div>
                  </div>
                  <div className="lp-theme03-scorecard-v1-bar">
                    <div className="lp-theme03-scorecard-v1-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  {item.note && (
                    <EditableField
                      prop={`items.${index}.note`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="p"
                      className="lp-theme03-scorecard-v1-note"
                    >
                      {item.note}
                    </EditableField>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
