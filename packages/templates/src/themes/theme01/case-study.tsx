// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Folio, Headline, Pill, Plus, Ring, Sheet, Slash } from './shared.js';

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

const roundColors = ['blue', 'green', 'amber', 'violet', 'red', 'cyan'] as const;

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
    <Sheet substrate="light" frame="grid" className="lp-case-study">
      <Blob
        className="lp-case-study-blob"
        style={{ width: 380, height: 380, top: -140, right: -100, background: 'var(--lp-amber)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-case-study-dots"
        style={{ bottom: 90, left: 80, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-case-study-slash"
        style={{ top: 110, left: 90, height: 70, background: 'var(--lp-blue)', opacity: 0.45 }}
      />
      <Ring
        className="lp-case-study-ring"
        style={{ width: 120, height: 120, bottom: 100, left: 80, borderColor: 'var(--lp-green)' }}
      />
      <Plus
        className="lp-case-study-plus"
        style={{ top: 140, right: 100, width: 30, height: 30, color: 'var(--lp-red)' }}
      />

      <div className="lp-case-study-content">
        <div className="lp-case-study-header lp-rise">
          {kicker && (
            <div className="lp-case-study-kicker">
              <Pill variant="outline" color="amber">
                {kicker}
              </Pill>
            </div>
          )}
          <Headline cn={title || ''} size="large" slideIdx={_slideIdx} editable={_editable} propCn="title" />
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-case-study-subtitle">
              {subtitle}
            </EditableField>
          )}
        </div>

        <div className="lp-case-study-body">
          {intro && (
            <EditableField prop="intro" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-case-study-intro lp-rise">
              {intro}
            </EditableField>
          )}

          {safeRounds.length > 0 && (
            <div className="lp-case-study-timeline">
              {safeRounds.map(({ round, originalIndex }, index) => (
                <div
                  key={index}
                  className={`lp-case-study-round lp-case-study-round--${roundColors[index % roundColors.length]} lp-rise`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div className="lp-case-study-round-main">
                    <EditableField
                      prop={`rounds.${originalIndex}.date`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="div"
                      className="lp-case-study-round-date"
                    >
                      {round.date}
                    </EditableField>
                    <EditableField
                      prop={`rounds.${originalIndex}.round`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="div"
                      className="lp-case-study-round-name"
                    >
                      {round.round}
                    </EditableField>
                  </div>
                  <div className="lp-case-study-round-meta">
                    <EditableField
                      prop={`rounds.${originalIndex}.valuation`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="div"
                      className="lp-case-study-round-valuation"
                    >
                      {round.valuation}
                    </EditableField>
                    <EditableField
                      prop={`rounds.${originalIndex}.amount`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="div"
                      className="lp-case-study-round-amount"
                    >
                      {round.amount}
                    </EditableField>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {quote && (
          <div className="lp-case-study-quote lp-rise">
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
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-case-study-footnote lp-rise">
            {footnote}
          </EditableField>
        )}
      </div>

      <Folio
        left="CASE STUDY"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
