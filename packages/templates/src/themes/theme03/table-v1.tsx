// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03TableV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  headers?: string[];
  rows?: string[][];
  highlightFirstColumn?: boolean;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TableV1Meta: LayoutMeta = {
  id: 'theme03_table_v1',
  theme: 'theme03',
  role: 'table',
  displayName: 'Theme 03 编辑风表格',
  description: '深色代码编辑风数据表格，终端风格表头 + 分隔线',
  needsMedia: false,
  tags: ['table', 'data', 'comparison'],
  contentShape: 'data-table',
};

export const theme03TableV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '数据表' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'TABLE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{赛道}}融资对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'headers',
      label: '表头',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      itemSchema: [{ key: 'item', label: '项', type: 'text' }],
    },
    {
      key: 'rows',
      label: '行数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [{ key: 'item', label: '项', type: 'text' }],
    },
    { key: 'highlightFirstColumn', label: '首列高亮', type: 'boolean' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-table-title lp-rise">
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

export function Theme03TableV1(props: Theme03TableV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, headers = [], rows = [], highlightFirstColumn, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeRows = rows.slice(0, 8);

  return (
    <div className="lp-slide lp-theme03-table-v1 lp-theme03-grid-bg">
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

      <div className="lp-theme03-table-main">
        <div className="lp-theme03-table-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-table-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-table-card lp-rise lp-theme03-corner-bracket">
          <table className="lp-theme03-table">
            {headers.length > 0 && (
              <thead>
                <tr>
                  {headers.map((header, colIndex) => (
                    <th key={colIndex}>
                      <EditableField prop={`headers.${colIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">{header}</EditableField>
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {safeRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} data-lp-highlight={highlightFirstColumn && colIndex === 0 ? 'true' : undefined}>
                      <EditableField prop={`rows.${rowIndex}.${colIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">{cell}</EditableField>
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
