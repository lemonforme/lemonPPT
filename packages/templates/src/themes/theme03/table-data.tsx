// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03TableDataColumn {
  key?: string;
  label?: string;
  align?: 'left' | 'right' | 'center';
}

export interface Theme03TableDataProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  columns?: Theme03TableDataColumn[];
  rows?: Record<string, string>[];
  /** 高亮行索引（单一行） */
  highlightRow?: number;
  /** @deprecated 旧版高亮行数组，兼容保留 */
  highlightRows?: number[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TableDataMeta: LayoutMeta = {
  id: 'theme03_table_data',
  theme: 'theme03',
  role: 'table',
  displayName: 'Theme 03 编辑风数据表格',
  description: '深色代码编辑风数据表格，终端风格表头 + 高亮行',
  needsMedia: false,
  tags: ['table', 'data', 'ranking'],
  contentShape: 'data-table',
};

export const theme03TableDataSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '数据表' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'TABLE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{赛道}}融资排行' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
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
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-table-data-title lp-rise">
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

export function Theme03TableData(props: Theme03TableDataProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    columns = [],
    rows = [],
    highlightRow,
    highlightRows,
    footnoteLeft,
    footnoteRight,
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
    <div className="lp-slide lp-theme03-table-data lp-theme03-grid-bg">
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

      <div className="lp-theme03-table-data-main">
        <div className="lp-theme03-table-data-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-table-data-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-table-data-card lp-rise lp-theme03-corner-bracket">
          <table className="lp-theme03-table-data-table">
            {safeColumns.length > 0 && (
              <thead>
                <tr>
                  {safeColumns.map((column, index) => (
                    <th key={index} className="lp-theme03-table-data-th" style={{ textAlign: column.align || 'left' }}>
                      <EditableField prop={`columns.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">
                        {column.label}
                      </EditableField>
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {safeRows.map(({ row, originalIndex }, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`lp-theme03-table-data-tr ${highlighted.has(rowIndex) ? 'lp-theme03-table-data-tr--highlight' : ''} lp-rise`}
                  style={{ animationDelay: `${rowIndex * 50}ms` }}
                >
                  {safeColumns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="lp-theme03-table-data-td"
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
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
