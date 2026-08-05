// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02TableV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  headers?: string[];
  rows?: string[][];
  highlightFirstColumn?: boolean;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02TableV1Meta: LayoutMeta = {
  id: 'theme02_table_v1',
  theme: 'theme02',
  role: 'table',
  displayName: 'Theme 02 霓虹表格',
  description: '深色背景 + 霓虹表头表格数据展示',
  needsMedia: false,
};

export const theme02TableV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'headers',
      label: '表头',
      type: 'array',
      maxItems: 8,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'rows',
      label: '行数据',
      type: 'array',
      maxItems: 8,
      minItems: 2,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'highlightFirstColumn',
      label: '首列高亮',
      type: 'boolean',
    },
  ],
};

export function Theme02TableV1(props: Theme02TableV1Props): ReactNode {
  const { kicker, title, subtitle, headers = [], rows = [], highlightFirstColumn, _slideIdx, _editable } = props;
  const safeRows = rows.slice(0, 8);

  return (
    <div className="lp-slide lp-theme02-table-v1">
      <div className="lp-theme02-table-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-table-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-table-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-table-card lp-rise">
        <table className="lp-theme02-table">
          {headers.length > 0 && (
            <thead>
              <tr>
                {headers.map((header, colIndex) => (
                  <th key={colIndex}>
                    <EditableField prop={`headers.${colIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">
                      {header}
                    </EditableField>
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
                    <EditableField prop={`rows.${rowIndex}.${colIndex}`} slideIdx={_slideIdx} editable={_editable} as="span">
                      {cell}
                    </EditableField>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
