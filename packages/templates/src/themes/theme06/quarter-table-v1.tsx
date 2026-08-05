// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06QuarterTableV1Row {
  quarter?: string;
  metric1?: string;
  metric2?: string;
  metric3?: string;
  change?: string;
  tone?: 'positive' | 'negative' | 'neutral';
  focus?: boolean;
}

export interface Theme06QuarterTableV1Summary {
  label?: string;
  value?: string;
}

export interface Theme06QuarterTableV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  columns?: Array<{ item?: string } | string>;
  rows?: Theme06QuarterTableV1Row[];
  summary?: Theme06QuarterTableV1Summary;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06QuarterTableV1Meta: LayoutMeta = {
  id: 'theme06_quarter_table_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 季度数据表',
  description: '季度 Q1-Q4 数据对比表，适合财报或运营回顾',
  needsMedia: true,
  tags: ['quarter', 'table', 'financial', 'atlas'],
  contentShape: 'generic-table',
};

export const theme06QuarterTableV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'QUARTERLY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '季度核心指标追踪' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年四个季度的收入、毛利与运营利润率变化' },
    {
      key: 'columns',
      label: '表头',
      type: 'array',
      minItems: 4,
      maxItems: 5,
      defaultValue: [
        { item: '季度' },
        { item: '收入' },
        { item: '毛利' },
        { item: '运营利润率' },
        { item: '环比' },
      ],
      itemSchema: [{ key: 'item', label: '列名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'rows',
      label: '数据行',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { quarter: 'Q1', metric1: '¥1.2B', metric2: '¥480M', metric3: '12%', change: '+8%', tone: 'positive' },
        { quarter: 'Q2', metric1: '¥1.5B', metric2: '¥630M', metric3: '15%', change: '+18%', tone: 'positive' },
        { quarter: 'Q3', metric1: '¥1.8B', metric2: '¥780M', metric3: '17%', change: '+14%', tone: 'positive', focus: true },
        { quarter: 'Q4', metric1: '¥2.1B', metric2: '¥920M', metric3: '19%', change: '+12%', tone: 'positive' },
      ],
      itemSchema: [
        { key: 'quarter', label: '季度', type: 'text', inlineEditable: true },
        { key: 'metric1', label: '指标 1', type: 'text', inlineEditable: true },
        { key: 'metric2', label: '指标 2', type: 'text', inlineEditable: true },
        { key: 'metric3', label: '指标 3', type: 'text', inlineEditable: true },
        { key: 'change', label: '变化', type: 'text', inlineEditable: true },
        {
          key: 'tone',
          label: '变化色调',
          type: 'select',
          options: [
            { value: 'positive', label: '正向' },
            { value: 'negative', label: '负向' },
            { value: 'neutral', label: '中性' },
          ],
        },
        { key: 'focus', label: '高亮', type: 'boolean' },
      ],
    },
    {
      key: 'summary',
      label: '汇总',
      type: 'object',
      defaultValue: { label: '全年收入', value: '¥6.6B' },
      itemSchema: [
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06QuarterTableV1(props: Theme06QuarterTableV1Props): ReactNode {
  const { kicker, title, subtitle, columns = [], rows = [], summary, _slideIdx, _editable } = props;
  const validColumns = (columns || []).map((c) => (typeof c === 'string' ? c : c.item ?? '')).filter(Boolean);
  const displayColumns = validColumns.length >= 4 ? validColumns : ['季度', '指标 1', '指标 2', '指标 3', '环比'];
  const validRows = (rows || []).filter((r): r is Theme06QuarterTableV1Row => r != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-quarter-table">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-quarter-table-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-quarter-table-body lp-rise">
        <div className="lp-theme06-quarter-table-wrap">
          <table>
            <thead>
              <tr>
                {displayColumns.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {validRows.map((row, ridx) => (
                <tr key={ridx} className={row.focus ? 'focus' : ''}>
                  <td>
                    <EditableField prop={`rows.${ridx}.quarter`} slideIdx={_slideIdx} editable={_editable} as="span">{row.quarter || ''}</EditableField>
                  </td>
                  <td>
                    <span className="lp-theme06-quarter-table-value">
                      <EditableField prop={`rows.${ridx}.metric1`} slideIdx={_slideIdx} editable={_editable} as="span">{row.metric1 || ''}</EditableField>
                    </span>
                  </td>
                  <td>
                    <span className="lp-theme06-quarter-table-value">
                      <EditableField prop={`rows.${ridx}.metric2`} slideIdx={_slideIdx} editable={_editable} as="span">{row.metric2 || ''}</EditableField>
                    </span>
                  </td>
                  <td>
                    <span className="lp-theme06-quarter-table-value">
                      <EditableField prop={`rows.${ridx}.metric3`} slideIdx={_slideIdx} editable={_editable} as="span">{row.metric3 || ''}</EditableField>
                    </span>
                  </td>
                  <td>
                    {row.change && (
                      <span className={`lp-theme06-quarter-table-change ${row.tone || 'neutral'}`}>
                        <EditableField prop={`rows.${ridx}.change`} slideIdx={_slideIdx} editable={_editable} as="span">{row.change}</EditableField>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {summary && (
          <div className="lp-theme06-quarter-table-summary">
            <span className="lp-theme06-quarter-table-summary-label">{summary.label || ''}</span>
            <span className="lp-theme06-quarter-table-summary-value">{summary.value || ''}</span>
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
