// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CompanyRoundsV1Round {
  date?: string;
  round?: string;
  amount?: string;
  investor?: string;
}

export interface Theme06CompanyRoundsV1Props {
  imageUrl?: string;
  company?: string;
  tagline?: string;
  rounds?: Theme06CompanyRoundsV1Round[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CompanyRoundsV1Meta: LayoutMeta = {
  id: 'theme06_company_rounds_v1',
  theme: 'theme06',
  role: 'timeline',
  displayName: 'Theme 06 公司融资轮次时间轴',
  description: '公司名 + 标语 + 融资轮次时间轴',
  needsMedia: true,
  tags: ['company', 'timeline', 'funding', 'atlas'],
  contentShape: 'timeline',
};

export const theme06CompanyRoundsV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'company', label: '公司名称', type: 'text', inlineEditable: true, defaultValue: '星云智能' },
    { key: 'tagline', label: '公司标语', type: 'textarea', inlineEditable: true, defaultValue: '专注企业级 AI Agent 平台，累计服务 200+ 行业客户' },
    {
      key: 'rounds',
      label: '融资轮次',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { date: '2022.06', round: '种子轮', amount: '数百万', investor: '某知名天使' },
        { date: '2023.03', round: 'Pre-A', amount: '数千万', investor: '某头部 VC' },
        { date: '2024.01', round: 'A 轮', amount: '1 亿', investor: '某产业基金' },
        { date: '2025.08', round: 'B 轮', amount: '3 亿', investor: '某主权基金' },
      ],
      itemSchema: [
        { key: 'date', label: '日期', type: 'text', inlineEditable: true },
        { key: 'round', label: '轮次', type: 'text', inlineEditable: true },
        { key: 'amount', label: '金额', type: 'text', inlineEditable: true },
        { key: 'investor', label: '投资方', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06CompanyRoundsV1(props: Theme06CompanyRoundsV1Props): ReactNode {
  const { company, tagline, rounds = [], _slideIdx, _editable } = props;
  const validRounds = (rounds || []).filter((r): r is Theme06CompanyRoundsV1Round => r != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-company-rounds">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-company-rounds-header lp-rise">
        <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-company-rounds-name">{company || '公司名称'}</EditableField>
        {tagline && (
          <EditableField prop="tagline" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-company-rounds-tagline">{tagline}</EditableField>
        )}
      </div>

      <div className="lp-theme06-company-rounds-body lp-rise">
        {validRounds.length > 0 && (
          <div className="lp-theme06-company-rounds-track">
            {validRounds.map((round, index) => (
              <div key={index} className={`lp-theme06-company-rounds-item ${index === validRounds.length - 1 ? 'focus' : ''}`}>
                <div className="lp-theme06-company-rounds-dot">{index + 1}</div>
                {round.date && <div className="lp-theme06-company-rounds-date">{round.date}</div>}
                {round.round && <div className="lp-theme06-company-rounds-round">{round.round}</div>}
                {round.amount && <div className="lp-theme06-company-rounds-amount">{round.amount}</div>}
                {round.investor && <div className="lp-theme06-company-rounds-investor">{round.investor}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
