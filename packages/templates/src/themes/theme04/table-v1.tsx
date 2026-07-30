// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04TableV1Row {
  name: string;
  nameEn?: string;
  count: string;
  avg: string;
  ratio: number;
}

export interface Theme04TableV1Summary {
  label: string;
  count: string;
  avg: string;
}

export interface Theme04TableV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  columns?: string[];
  rows?: Theme04TableV1Row[];
  summary?: Theme04TableV1Summary;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04TableV1Meta: LayoutMeta = {
  id: 'theme04_table_v1',
  theme: 'theme04',
  role: 'table',
  displayName: 'Theme 04 轮次结构表',
  description: '带进度条的玻璃卡片表格，适合轮次/结构对比',
  needsMedia: false,
  tags: ['table', 'structure', 'candy'],
  contentShape: 'data-table',
};

export const theme04TableV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '轮次结构 · ROUND STRUCTURE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '越往后轮次，{{单笔越大}}——头部「赢家通吃」' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '「D 轮及以后」与「未标明轮次」合计占比过半，平均单笔超 15 亿美元。' },
    {
      key: 'columns',
      label: '表头',
      type: 'array',
      minItems: 4,
      maxItems: 4,
      defaultValue: ['融资轮次', '事件笔数', '平均单笔 / 亿美元', '规模对比'],
      itemSchema: [{ key: 'value', label: '标题', type: 'text' }],
    },
    {
      key: 'rows',
      label: '行数据',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { name: '种子轮', nameEn: 'Seed', count: '8笔', avg: '1.2', ratio: 8 },
        { name: 'A 轮', nameEn: 'Series A', count: '12笔', avg: '1.8', ratio: 15 },
        { name: 'B 轮', nameEn: 'Series B', count: '18笔', avg: '3.5', ratio: 28 },
        { name: 'C 轮', nameEn: 'Series C', count: '15笔', avg: '6.8', ratio: 55 },
        { name: 'D 轮及以后', nameEn: 'Series D+', count: '22笔', avg: '15.2', ratio: 90 },
        { name: '未标明轮次', nameEn: 'Undisclosed', count: '22笔', avg: '18.6', ratio: 100 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'nameEn', label: '英文名', type: 'text' },
        { key: 'count', label: '数量', type: 'text' },
        { key: 'avg', label: '平均值', type: 'text' },
        { key: 'ratio', label: '进度条比例(0-100)', type: 'number', min: 0, max: 100 },
      ],
    },
    {
      key: 'summary',
      label: '汇总行',
      type: 'object',
      defaultValue: { label: '全年合计', count: '97笔', avg: '10.0' },
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-table-title lp-rise">
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

export function Theme04TableV1(props: Theme04TableV1Props): ReactNode {
  const { kicker, title, subtitle, columns, rows, summary, _slideIdx, _editable } = props;
  const safeColumns = (columns ?? ['融资轮次', '事件笔数', '平均单笔 / 亿美元', '规模对比']).slice(0, 4);
  const maxRatio = Math.max(1, ...((rows ?? []).map((r) => Number(r.ratio) || 0)));

  return (
    <div className="lp-slide lp-theme04-table">
      <div className="lp-theme04-table-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-table-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-table-wrap lp-rise lp-theme04-card">
        <div className="lp-theme04-table-header">
          {safeColumns.map((col, idx) => (
            <div key={idx} className="lp-theme04-table-header-cell">{col}</div>
          ))}
        </div>
        <div className="lp-theme04-table-body">
          {(rows ?? []).slice(0, 8).map((row, idx) => (
            <div key={idx} className="lp-theme04-table-row">
              <div className="lp-theme04-table-cell lp-theme04-table-cell--name">
                <EditableField prop={`rows.${idx}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-table-name">{row.name}</EditableField>
                {row.nameEn && <span className="lp-theme04-table-name-en">{row.nameEn}</span>}
              </div>
              <div className="lp-theme04-table-cell lp-theme04-table-cell--count">
                <EditableField prop={`rows.${idx}.count`} slideIdx={_slideIdx} editable={_editable} as="span">{row.count}</EditableField>
              </div>
              <div className="lp-theme04-table-cell lp-theme04-table-cell--avg">
                <EditableField prop={`rows.${idx}.avg`} slideIdx={_slideIdx} editable={_editable} as="span">{row.avg}</EditableField>
              </div>
              <div className="lp-theme04-table-cell lp-theme04-table-cell--bar">
                <div className="lp-theme04-table-bar-bg">
                  <div className="lp-theme04-table-bar-fill" style={{ width: `${((Number(row.ratio) || 0) / maxRatio) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {summary && (
          <div className="lp-theme04-table-summary">
            <EditableField prop="summary.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-table-summary-label">{summary.label}</EditableField>
            <EditableField prop="summary.count" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-table-summary-count">{summary.count}</EditableField>
            <EditableField prop="summary.avg" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-table-summary-avg">{summary.avg}</EditableField>
            <div className="lp-theme04-table-summary-bar" />
          </div>
        )}
      </div>
    </div>
  );
}
