// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01TableDataColumn {
  key?: string;
  label?: string;
  align?: 'left' | 'right' | 'center';
}

export interface Theme01TableDataProps {
  title?: string;
  subtitle?: string;
  kicker?: string;
  columns?: Theme01TableDataColumn[];
  rows?: Record<string, string>[];
  /** 高亮行索引（单一行） */
  highlightRow?: number;
  /** @deprecated 旧版高亮行数组，兼容保留 */
  highlightRows?: number[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01TableDataMeta: LayoutMeta = {
  id: 'theme01_table_data',
  theme: 'theme01',
  role: 'table',
  displayName: 'Theme 01 数据表格',
  description: '表头 + 行数据 + 高亮行的排行表格',
  needsMedia: false,
};

export const theme01TableDataSchema: PropsSchema = {
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
      key: 'columns',
      label: '列定义',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'key', label: '字段名', type: 'text' },
        { key: 'label', label: '显示名', type: 'text' },
        {
          key: 'align',
          label: '对齐',
          type: 'select',
          options: [
            { value: 'left', label: '左对齐' },
            { value: 'right', label: '右对齐' },
            { value: 'center', label: '居中' },
          ],
        },
      ],
    },
    {
      key: 'rows',
      label: '行数据',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      itemSchema: [
        { key: 'rank', label: '排名', type: 'text' },
        { key: 'company', label: '公司', type: 'text' },
        { key: 'track', label: '赛道', type: 'text' },
        { key: 'amount', label: '融资额', type: 'text' },
      ],
    },
    {
      key: 'highlightRow',
      label: '高亮行',
      type: 'slider',
      min: 0,
      max: 11,
      defaultValue: 0,
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01TableData(props: Theme01TableDataProps): ReactNode {
  const {
    title,
    subtitle,
    kicker,
    columns = [],
    rows = [],
    highlightRow,
    highlightRows,
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const safeColumns = columns.filter((c) => c.key && c.label);
  const safeRows = (rows || [])
    .map((row, originalIndex) => ({ row, originalIndex }))
    .filter(({ row }) => row != null)
    .slice(0, 12);
  // 兼容旧版 highlightRows 数组：未设置 highlightRow 时取数组第一项
  const effectiveHighlightRow = highlightRow ?? (Array.isArray(highlightRows) && highlightRows.length ? highlightRows[0] : undefined);
  const highlighted = new Set(effectiveHighlightRow !== undefined ? [effectiveHighlightRow] : []);

  return (
    <div className="lp-slide lp-table-data">
      <div className="lp-card lp-table-data-card lp-rise">
        <div className="lp-table-data-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div className="lp-table-data-titles">
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-table-data-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-table-data-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>

        <div className="lp-table-data-wrap">
          <table className="lp-table-data-table">
            <thead>
              <tr>
                {safeColumns.map((column, index) => (
                  <th
                    key={index}
                    className="lp-table-data-th"
                    style={{ textAlign: column.align || 'left' }}
                  >
                    <EditableField
                      prop={`columns.${index}.label`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                    >
                      {column.label}
                    </EditableField>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safeRows.map(({ row, originalIndex }, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`lp-table-data-tr ${highlighted.has(rowIndex) ? 'lp-table-data-tr--highlight' : ''} lp-rise`}
                  style={{ animationDelay: `${rowIndex * 50}ms` }}
                >
                  {safeColumns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="lp-table-data-td"
                      style={{ textAlign: column.align || 'left' }}
                    >
                      <EditableField
                        prop={`rows.${originalIndex}.${column.key}`}
                        slideIdx={_slideIdx}
                        editable={_editable}
                        as="span"
                      >
                        {row[column.key || ''] ?? ''}
                      </EditableField>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {footnote && (
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-table-data-footnote">
            {footnote}
          </EditableField>
        )}
      </div>
    </div>
  );
}
