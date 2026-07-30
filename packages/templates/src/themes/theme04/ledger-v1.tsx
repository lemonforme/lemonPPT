// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04LedgerV1Investor {
  rank?: string;
  name: string;
  deals: string;
  amount: string;
  trend?: 'up' | 'down' | 'flat';
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04LedgerV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  investors?: Theme04LedgerV1Investor[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04LedgerV1Meta: LayoutMeta = {
  id: 'theme04_ledger_v1',
  theme: 'theme04',
  role: 'table',
  displayName: 'Theme 04 投资人出手榜',
  description: '投资人排行榜样式，带排名、出手次数、金额与趋势箭头',
  needsMedia: false,
  tags: ['table', 'ranking', 'investor', 'candy'],
  contentShape: 'data-table',
};

export const theme04LedgerV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '投资人榜单 · INVESTOR LEDGER' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{出手最多}}的投资机构' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按年度出手次数排序，金额与趋势同步展示' },
    {
      key: 'investors',
      label: '投资人',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { rank: '01', name: 'Global AI Capital', deals: '18笔', amount: '$42亿', trend: 'up', tone: 'green' },
        { rank: '02', name: 'Horizon Ventures', deals: '15笔', amount: '$31亿', trend: 'up', tone: 'blue' },
        { rank: '03', name: 'Neon Fund', deals: '12笔', amount: '$24亿', trend: 'flat', tone: 'yellow' },
        { rank: '04', name: 'Quantum Partners', deals: '10笔', amount: '$19亿', trend: 'down', tone: 'pink' },
        { rank: '05', name: 'Spark AI', deals: '9笔', amount: '$15亿', trend: 'up', tone: 'green' },
      ],
      itemSchema: [
        { key: 'rank', label: '排名', type: 'text' },
        { key: 'name', label: '机构名', type: 'text' },
        { key: 'deals', label: '出手次数', type: 'text' },
        { key: 'amount', label: '金额', type: 'text' },
        { key: 'trend', label: '趋势', type: 'select', defaultValue: 'up', options: [{ value: 'up', label: '上升' }, { value: 'down', label: '下降' }, { value: 'flat', label: '持平' }] },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究整理' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-ledger-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

const toneClass: Record<string, string> = {
  green: 'lp-theme04-ledger-rank--green',
  pink: 'lp-theme04-ledger-rank--pink',
  blue: 'lp-theme04-ledger-rank--blue',
  yellow: 'lp-theme04-ledger-rank--yellow',
};

function TrendIcon({ trend }: { trend?: 'up' | 'down' | 'flat' }): ReactNode {
  if (trend === 'up') {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="lp-theme04-ledger-trend lp-theme04-ledger-trend--up">
        <path d="M7 14l5-5 5 5M12 9v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (trend === 'down') {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="lp-theme04-ledger-trend lp-theme04-ledger-trend--down">
        <path d="M7 10l5 5 5-5M12 15V5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="lp-theme04-ledger-trend lp-theme04-ledger-trend--flat">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Theme04LedgerV1(props: Theme04LedgerV1Props): ReactNode {
  const { kicker, title, subtitle, investors = [], footnote, _slideIdx, _editable } = props;
  const validInvestors = (investors || []).slice(0, 8);

  return (
    <div className="lp-slide lp-theme04-ledger">
      <div className="lp-theme04-ledger-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-ledger-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-ledger-list lp-rise">
        {validInvestors.map((investor, idx) => (
          <div key={idx} className="lp-theme04-ledger-row lp-theme04-card">
            <div className={`lp-theme04-ledger-rank ${toneClass[investor.tone ?? 'green']}`}>
              <EditableField prop={`investors.${idx}.rank`} slideIdx={_slideIdx} editable={_editable} as="span">{investor.rank || String(idx + 1).padStart(2, '0')}</EditableField>
            </div>
            <div className="lp-theme04-ledger-info">
              <EditableField prop={`investors.${idx}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-ledger-name">{investor.name}</EditableField>
            </div>
            <div className="lp-theme04-ledger-deals">
              <EditableField prop={`investors.${idx}.deals`} slideIdx={_slideIdx} editable={_editable} as="span">{investor.deals}</EditableField>
            </div>
            <div className="lp-theme04-ledger-amount">
              <EditableField prop={`investors.${idx}.amount`} slideIdx={_slideIdx} editable={_editable} as="span">{investor.amount}</EditableField>
            </div>
            <div className="lp-theme04-ledger-trend-wrap">
              <TrendIcon trend={investor.trend} />
            </div>
          </div>
        ))}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-ledger-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
