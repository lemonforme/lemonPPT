// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01CaseStudyRound {
  date?: string;
  round?: string;
  valuation?: string;
  amount?: string;
}

export interface Theme01CaseStudyProps {
  title?: string;
  subtitle?: string;
  kicker?: string;
  intro?: string;
  rounds?: Theme01CaseStudyRound[];
  quote?: string;
  quoteAuthor?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01CaseStudyMeta: LayoutMeta = {
  id: 'theme01_case_study',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 案例详情',
  description: '案例标题 + 简介 + 融资时间线 + 引用',
  needsMedia: false,
};

export const theme01CaseStudySchema: PropsSchema = {
  fields: [
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'intro',
      label: '案例简介',
      type: 'textarea',
      inlineEditable: true,
    },
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
    {
      key: 'quote',
      label: '引用',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'quoteAuthor',
      label: '引用作者',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01CaseStudy(props: Theme01CaseStudyProps): ReactNode {
  const {
    title,
    subtitle,
    kicker,
    intro,
    rounds = [],
    quote,
    quoteAuthor,
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const safeRounds = (rounds || [])
    .map((round, originalIndex) => ({ round, originalIndex }))
    .filter(({ round }) => round != null && (round.date || round.round || round.amount));

  return (
    <div className="lp-slide lp-case-study">
      <div className="lp-card lp-case-study-card lp-rise">
        <div className="lp-case-study-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div className="lp-case-study-titles">
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-case-study-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-case-study-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>

        <div className="lp-case-study-body">
          {intro && (
            <EditableField prop="intro" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-case-study-intro">
              {intro}
            </EditableField>
          )}

          {safeRounds.length > 0 && (
            <div className="lp-case-study-timeline">
              {safeRounds.map(({ round, originalIndex }, index) => (
                <div key={index} className="lp-case-study-round lp-rise" style={{ animationDelay: `${index * 70}ms` }}>
                  <div className="lp-case-study-round-main">
                    <EditableField prop={`rounds.${originalIndex}.date`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-case-study-round-date">
                      {round.date}
                    </EditableField>
                    <EditableField prop={`rounds.${originalIndex}.round`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-case-study-round-name">
                      {round.round}
                    </EditableField>
                  </div>
                  <div className="lp-case-study-round-meta">
                    <EditableField prop={`rounds.${originalIndex}.valuation`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-case-study-round-valuation">
                      {round.valuation}
                    </EditableField>
                    <EditableField prop={`rounds.${originalIndex}.amount`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-case-study-round-amount">
                      {round.amount}
                    </EditableField>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {quote && (
          <div className="lp-case-study-quote">
            <EditableField prop="quote" slideIdx={_slideIdx} editable={_editable} as="blockquote" className="lp-case-study-quote-text">
              {quote}
            </EditableField>
            {quoteAuthor && (
              <EditableField prop="quoteAuthor" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-case-study-quote-author">
                —— {quoteAuthor}
              </EditableField>
            )}
          </div>
        )}

        {footnote && (
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-case-study-footnote">
            {footnote}
          </EditableField>
        )}
      </div>
    </div>
  );
}
