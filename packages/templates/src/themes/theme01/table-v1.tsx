// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
export interface Theme01TableV1Props {
  kicker?: string;
  title?: string;
  headers?: string[];
  rows?: string[][];
  highlightFirstColumn?: boolean;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01TableV1Meta: LayoutMeta = {
  id: 'theme01_table_v1',
  theme: 'theme01',
  role: 'table',
  displayName: 'Theme 01 表格页',
  description: '玻璃卡片表格数据展示',
  needsMedia: false,
};
export const theme01TableV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'headers',
      label: 'headers',
      type: 'array',
      maxItems: 8,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    },
    {
      key: 'rows',
      label: 'rows',
      type: 'array',
      maxItems: 8,
      minItems: 2,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    },
    {
      key: 'highlightFirstColumn',
      label: 'highlightFirstColumn',
      type: 'boolean'
    }
  ]
};
export function Theme01TableV1(props: Theme01TableV1Props): ReactNode {
  const { kicker, title, headers = [], rows = [], highlightFirstColumn, _slideIdx, _editable } = props;
  const safeRows = rows.slice(0, 8);
  return (<div className="lp-slide lp-table-v1">
      <div className="lp-table-v1-header">
    {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>)}
    {title && (<EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-table-v1-title lp-rise">
      {title}
          </EditableField>)}
      </div>
      <div className="lp-card lp-table-v1-card lp-rise">
    <table className="lp-table-v1-table">
          {headers.length > 0 && (<thead>
              <tr>
        {headers.map((header, colIndex) => (<th key={colIndex}>
          <EditableField prop={`headers.${colIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">
                      {header}
          </EditableField>
                  </th>))}
              </tr>
      </thead>)}
          <tbody>
      {safeRows.map((row, rowIndex) => (<tr key={rowIndex}>
        {row.map((cell, colIndex) => (<td key={colIndex} data-lp-highlight={highlightFirstColumn && colIndex === 0 ? 'true' : undefined}>
          <EditableField prop={`rows.${rowIndex}.${colIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">
                      {cell}
          </EditableField>
                  </td>))}
              </tr>))}
          </tbody>
    </table>
      </div>
  </div>);
}
