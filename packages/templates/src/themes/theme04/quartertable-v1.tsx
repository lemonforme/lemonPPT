// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04QuartertableV1Row {
  quarter: string;
  metric1: string;
  metric2: string;
  metric3: string;
  change?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04QuartertableV1Summary {
  label: string;
  value: string;
}

export interface Theme04QuartertableV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  columns?: string[];
  rows?: Theme04QuartertableV1Row[];
  summary?: Theme04QuartertableV1Summary;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04QuartertableV1Meta: LayoutMeta = {
  id: 'theme04_quartertable_v1',
  theme: 'theme04',
  role: 'table',
  displayName: 'Theme 04 季度走势表',
  description: '季度指标对比表，带变化标签与汇总行',
  needsMedia: false,
  tags: ['table', 'quarterly', 'trend', 'candy'],
  contentShape: 'data-table',
};

export const theme04QuartertableV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '季度走势 · QUARTERLY TREND' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{逐季增长}}，Q4 全面提速' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '事件数、单笔均值与环比变化一览' },
    {
      key: 'columns',
      label: '表头',
      type: 'array',
      minItems: 5,
      maxItems: 5,
      defaultValue: ['季度', '事件数', '单笔均值', '核心指标', '环比变化'],
      itemSchema: [{ key: 'value', label: '标题', type: 'text' }],
    },
    {
      key: 'rows',
      label: '行数据',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { quarter: 'Q1', metric1: '18笔', metric2: '6.2亿', metric3: '112亿', change: '+12%', tone: 'green' },
        { quarter: 'Q2', metric1: '22笔', metric2: '7.8亿', metric3: '172亿', change: '+54%', tone: 'green' },
        { quarter: 'Q3', metric1: '26笔', metric2: '8.5亿', metric3: '221亿', change: '+28%', tone: 'blue' },
        { quarter: 'Q4', metric1: '31笔', metric2: '11.4亿', metric3: '353亿', change: '+60%', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'quarter', label: '季度', type: 'text' },
        { key: 'metric1', label: '指标一', type: 'text' },
        { key: 'metric2', label: '指标二', type: 'text' },
        { key: 'metric3', label: '指标三', type: 'text' },
        { key: 'change', label: '变化', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    {
      key: 'summary',
      label: '汇总行',
      type: 'object',
      defaultValue: { label: '全年合计', value: '858亿美元 · 97笔' },
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-quartertable-title lp-rise">
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
  green: 'lp-theme04-quartertable-change--green',
  pink: 'lp-theme04-quartertable-change--pink',
  blue: 'lp-theme04-quartertable-change--blue',
  yellow: 'lp-theme04-quartertable-change--yellow',
};

export function Theme04QuartertableV1(props: Theme04QuartertableV1Props): ReactNode {
  const { kicker, title, subtitle, columns, rows, summary, _slideIdx, _editable } = props;
  const safeColumns = (columns ?? ['季度', '事件数', '单笔均值', '核心指标', '环比变化']).slice(0, 5);

  return (
    <div className="lp-slide lp-theme04-quartertable">
      <div className="lp-theme04-quartertable-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-quartertable-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-quartertable-wrap lp-rise lp-theme04-card">
        <div className="lp-theme04-quartertable-header">
          {safeColumns.map((col, idx) => (
            <div key={idx} className="lp-theme04-quartertable-header-cell">{col}</div>
          ))}
        </div>
        <div className="lp-theme04-quartertable-body">
          {(rows ?? []).slice(0, 8).map((row, idx) => (
            <div key={idx} className="lp-theme04-quartertable-row">
              <div className="lp-theme04-quartertable-cell lp-theme04-quartertable-cell--quarter">
                <EditableField prop={`rows.${idx}.quarter`} slideIdx={_slideIdx} editable={_editable} as="span">{row.quarter}</EditableField>
              </div>
              <div className="lp-theme04-quartertable-cell">
                <EditableField prop={`rows.${idx}.metric1`} slideIdx={_slideIdx} editable={_editable} as="span">{row.metric1}</EditableField>
              </div>
              <div className="lp-theme04-quartertable-cell">
                <EditableField prop={`rows.${idx}.metric2`} slideIdx={_slideIdx} editable={_editable} as="span">{row.metric2}</EditableField>
              </div>
              <div className="lp-theme04-quartertable-cell">
                <EditableField prop={`rows.${idx}.metric3`} slideIdx={_slideIdx} editable={_editable} as="span">{row.metric3}</EditableField>
              </div>
              <div className="lp-theme04-quartertable-cell lp-theme04-quartertable-cell--change">
                {row.change && (
                  <span className={`lp-theme04-quartertable-change ${toneClass[row.tone ?? 'green']}`}>
                    <EditableField prop={`rows.${idx}.change`} slideIdx={_slideIdx} editable={_editable} as="span">{row.change}</EditableField>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        {summary && (
          <div className="lp-theme04-quartertable-summary">
            <EditableField prop="summary.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-quartertable-summary-label">{summary.label}</EditableField>
            <EditableField prop="summary.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-quartertable-summary-value">{summary.value}</EditableField>
          </div>
        )}
      </div>
    </div>
  );
}
