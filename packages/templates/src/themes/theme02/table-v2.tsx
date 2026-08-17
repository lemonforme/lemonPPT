// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02TableV2Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  columns?: string[];
  rows?: string[][];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02TableV2Meta: LayoutMeta = {
  id: 'theme02_table_v2',
  theme: 'theme02',
  role: 'table',
  displayName: 'Theme 02 数据表',
  description: '紧凑数据表格',
  needsMedia: false,
};

export const theme02TableV2Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    {
      key: 'columns',
      label: '列',
      type: 'array',
      maxItems: 5,
      minItems: 1,
      itemSchema: [{ key: 'item', label: '列名', type: 'text', inlineEditable: true }],
    },
    {
      key: 'rows',
      label: '行',
      type: 'array',
      maxItems: 8,
      minItems: 1,
      itemSchema: [
        {
          key: 'item',
          label: '单元格',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
  ],
};

export function Theme02TableV2(props: Theme02TableV2Props): ReactNode {
  const { kicker, title, subtitle, columns = [], rows = [], _slideIdx, _editable } = props;

  const safeColumns = columns.filter((c): c is string => typeof c === 'string');
  const safeRows = rows.filter((r): r is string[] => Array.isArray(r));
  const colCount = Math.max(safeColumns.length, 1);

  return (
    <div className="lp-slide lp-theme02-table-v2">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-table-v2-inner">
        <div className="lp-theme02-table-v2-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <div>
            <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-table-v2-title">
              {title}
            </EditableField>
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-table-v2-subtitle">
                {subtitle}
              </EditableField>
            )}
          </div>
        </div>
        <div className="lp-theme02-table-v2-scroll">
          <table className="lp-theme02-table-v2-table">
            <thead>
              <tr>
                {safeColumns.map((col, ci) => (
                  <th key={ci}>
                    <EditableField prop={`columns.${ci}`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-table-v2-th">
                      {col}
                    </EditableField>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safeRows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 1 ? 'lp-theme02-table-v2-odd' : ''}>
                  {Array.from({ length: colCount }).map((_, ci) => (
                    <td key={ci}>
                      <EditableField prop={`rows.${ri}.${ci}`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-table-v2-td">
                        {row[ci]}
                      </EditableField>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
