// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  Masthead,
  Pill,
  Ring,
  Sheet,
} from './shared.js';

export interface Theme01TableV1Props {
  kicker?: string;
  title?: string;
  titleEn?: string;
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
  description: '色块拼贴风格表格数据展示，无厚重卡片',
  needsMedia: false,
};

export const theme01TableV1Schema: PropsSchema = {
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
      key: 'titleEn',
      label: '英文标题',
      type: 'text',
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

export function Theme01TableV1(props: Theme01TableV1Props): ReactNode {
  const { kicker, title, titleEn, headers = [], rows = [], highlightFirstColumn, _slideIdx, _editable } = props;
  const safeRows = rows.slice(0, 8);

  return (
    <Sheet substrate="tint" tint="blue" frame="grid" className="lp-table-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />

      <Headline
        cn={title ?? ''}
        en={titleEn}
        slideIdx={_slideIdx}
        editable={_editable}
        propCn="title"
        propEn="titleEn"
        size="large"
        className="lp-table-v1-headline lp-rise"
      />

      <div className="lp-table-v1-canvas lp-rise">
        <table className="lp-table-v1-table">
          {headers.length > 0 && (
            <thead>
              <tr>
                {headers.map((header, colIndex) => (
                  <th key={colIndex}>
                    <EditableField
                      prop={`headers.${colIndex}`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                    >
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
                  <td
                    key={colIndex}
                    data-lp-highlight={highlightFirstColumn && colIndex === 0 ? 'true' : undefined}
                  >
                    {highlightFirstColumn && colIndex === 0 ? (
                      <Pill variant="fill" color="red">
                        <EditableField
                          prop={`rows.${rowIndex}.${colIndex}`}
                          slideIdx={_slideIdx}
                          editable={_editable}
                          as="span"
                        >
                          {cell}
                        </EditableField>
                      </Pill>
                    ) : (
                      <EditableField
                        prop={`rows.${rowIndex}.${colIndex}`}
                        slideIdx={_slideIdx}
                        editable={_editable}
                        as="span"
                      >
                        {cell}
                      </EditableField>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Folio page={String(_slideIdx ?? 1).padStart(2, '0')} />

      <Blob
        className="lp-table-v1-blob"
        style={{ width: 320, height: 320, bottom: -80, right: -60, background: 'var(--lp-amber)', opacity: 0.18 }}
      />
      <DottedPattern
        className="lp-table-v1-dots"
        style={{ top: 140, right: 100, width: 140, height: 140, opacity: 0.22 }}
      />
      <Ring
        className="lp-table-v1-ring"
        style={{ width: 80, height: 80, bottom: 120, left: 90, borderColor: 'var(--lp-green)' }}
      />
    </Sheet>
  );
}
