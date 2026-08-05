// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03CaseStudyRound {
  date?: string;
  round?: string;
  valuation?: string;
  amount?: string;
}

export interface Theme03CaseStudyProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  intro?: string;
  rounds?: Theme03CaseStudyRound[];
  quote?: string;
  quoteAuthor?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03CaseStudyMeta: LayoutMeta = {
  id: 'theme03_case_study',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风案例详情',
  description: '深色代码编辑风案例标题 + 简介 + 融资时间线 + 引用',
  needsMedia: false,
  tags: ['content', 'case', 'timeline', 'quote'],
  contentShape: 'case-study',
};

export const theme03CaseStudySchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '典型案例' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'CASE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{Anthropic}}：从追赶到反超' },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    { key: 'intro', label: '案例简介', type: 'textarea', inlineEditable: true },
    {
      key: 'rounds',
      label: '融资时间线',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'date', label: '日期', type: 'text' },
        { key: 'round', label: '轮次', type: 'text' },
        { key: 'valuation', label: '估值', type: 'text' },
        { key: 'amount', label: '金额', type: 'text' },
      ],
    },
    { key: 'quote', label: '引用', type: 'textarea', inlineEditable: true },
    { key: 'quoteAuthor', label: '引用作者', type: 'text', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-case-study-title lp-rise">
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

export function Theme03CaseStudy(props: Theme03CaseStudyProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    intro,
    rounds = [],
    quote,
    quoteAuthor,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const safeRounds = (rounds || [])
    .map((round, originalIndex) => ({ round, originalIndex }))
    .filter(({ round }) => round != null && (round.date || round.round || round.amount));

  return (
    <div className="lp-slide lp-theme03-case-study">
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

      <div className="lp-theme03-case-study-main">
        <div className="lp-theme03-case-study-body lp-rise">
          {title && renderTitle(title, _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-case-study-subtitle">{subtitle}</EditableField>
          )}
          {intro && (
            <EditableField prop="intro" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-case-study-intro">{intro}</EditableField>
          )}

          {safeRounds.length > 0 && (
            <div className="lp-theme03-case-study-timeline">
              {safeRounds.map(({ round, originalIndex }, index) => (
                <div key={index} className="lp-theme03-case-study-round lp-rise" style={{ animationDelay: `${index * 70}ms` }}>
                  <div className="lp-theme03-case-study-round-dot" />
                  <div className="lp-theme03-case-study-round-main">
                    <EditableField prop={`rounds.${originalIndex}.date`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-case-study-round-date">
                      {round.date}
                    </EditableField>
                    <EditableField prop={`rounds.${originalIndex}.round`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-case-study-round-name">
                      {round.round}
                    </EditableField>
                  </div>
                  <div className="lp-theme03-case-study-round-meta">
                    <EditableField prop={`rounds.${originalIndex}.valuation`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-case-study-round-valuation">
                      {round.valuation}
                    </EditableField>
                    <EditableField prop={`rounds.${originalIndex}.amount`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-case-study-round-amount">
                      {round.amount}
                    </EditableField>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {quote && (
          <div className="lp-theme03-case-study-quote lp-rise">
            <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-theme03-case-study-quote-text">
              {quote}
            </EditableField>
            {quoteAuthor && (
              <EditableField prop="quoteAuthor" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-case-study-quote-author">
                —— {quoteAuthor}
              </EditableField>
            )}
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
