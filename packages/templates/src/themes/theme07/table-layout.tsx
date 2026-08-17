// lemonPPT - theme07 通用表格/结构化数据页骨架
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07TableLayoutCell {
  value?: string;
  accent?: boolean;
}

export interface Theme07TableLayoutRow {
  cells?: (string | Theme07TableLayoutCell)[];
  accent?: boolean;
}

export interface Theme07TableLayoutProps {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  headers?: string[];
  rows?: Theme07TableLayoutRow[];
  conclusion?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07TableLayoutMetaBase: Omit<LayoutMeta, 'id' | 'displayName' | 'description' | 'tags'> = {
  theme: 'theme07',
  role: 'content',
  needsMedia: true,
  contentShape: 'table',
};

export const theme07TableLayoutSchemaBase: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'TABLE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '结构化数据' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '' },
    { key: 'intro', label: '说明文字', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'headers',
      label: '表头',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: ['维度', '数值'],
      itemSchema: [{ key: 'item', label: '表头', type: 'text' }],
    },
    {
      key: 'rows',
      label: '表格行',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [
        { cells: ['项 A', '100'], accent: false },
        { cells: ['项 B', '80'], accent: false },
      ],
      itemSchema: [
        { key: 'cells', label: '单元格', type: 'array', itemSchema: [{ key: 'item', label: '值', type: 'text' }] },
        { key: 'accent', label: '强调行', type: 'boolean' },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', defaultValue: '' },
    { key: 'footnote', label: '页脚注释', type: 'textarea', defaultValue: '' },
  ],
};

function normalizeCell(cell: string | Theme07TableLayoutCell | undefined): { value: string; accent: boolean } {
  if (cell == null) return { value: '', accent: false };
  if (typeof cell === 'string') return { value: cell, accent: false };
  return { value: cell.value ?? '', accent: !!cell.accent };
}

export function Theme07TableLayout(props: Theme07TableLayoutProps): ReactNode {
  const { imageUrl, kicker, title, subtitle, intro, headers = [], rows = [], conclusion, footnote, _slideIdx, _editable } = props;
  const validHeaders = (headers || [])
    .map((h) => (typeof h === 'string' ? h : (h as { item?: string }).item))
    .filter((h): h is string => !!h)
    .slice(0, 6);
  const validRows = (rows || [])
    .map((r) => {
      const cells = (r.cells || [])
        .slice(0, validHeaders.length || 6)
        .map(normalizeCell);
      return { cells, accent: !!r.accent };
    })
    .filter((r) => r.cells.some((c) => c.value))
    .slice(0, 12);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-table">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-table-header lp-rise">
        <Theme07IconChip name="layers" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
      </div>
      {intro && (
        <EditableField prop="intro" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-table-intro">{intro}</EditableField>
      )}
      {validRows.length > 0 && validHeaders.length > 0 && (
        <div className="lp-theme07-table-wrap lp-rise">
          <div className="lp-theme07-table">
            <div className="lp-theme07-table-row lp-theme07-table-head">
              {validHeaders.map((h, i) => (
                <div key={i} className="lp-theme07-table-cell">{h}</div>
              ))}
            </div>
            {validRows.map((row, i) => (
              <div key={i} className={`lp-theme07-table-row ${row.accent ? 'accent' : ''}`}>
                {row.cells.map((cell, j) => (
                  <div key={j} className={`lp-theme07-table-cell ${cell.accent ? 'accent' : ''}`}>{cell.value}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {conclusion && (
        <div className="lp-theme07-table-conclusion lp-rise">
          <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
        </div>
      )}
      <div className="lp-theme07-table-footer">
        {footnote && <span className="lp-theme07-table-footnote">{footnote}</span>}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
