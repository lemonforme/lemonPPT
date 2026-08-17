// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9FormatNumber, t9Rgba } from './chart-utils.js';

export interface Theme09CrosstabCol {
  label?: string;
}

export interface Theme09CrosstabRow {
  name?: string;
  cells?: string | Array<string | number>;
}

export interface Theme09CrosstabV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  corner?: string;
  cols?: Array<Theme09CrosstabCol | string>;
  rows?: Theme09CrosstabRow[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CrosstabV1Meta: LayoutMeta = {
  id: 'theme09_crosstab_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '交叉透视',
  description: '交叉表 + 单元格网点浓度表强弱，细栏线排布，纸底',
  needsMedia: false,
  tags: ['chart', 'table', 'matrix', 'crosstab'],
  contentShape: 'crosstab',
};

export const theme09CrosstabV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '交叉透视' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'CROSSTAB' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '21' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '矩阵' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '赛道与季度的 {{强弱分布}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '网点越浓，代表该赛道在该季度的融资规模越高。' },
    { key: 'corner', label: '左上角表头', type: 'text', inlineEditable: true, defaultValue: '赛道 / 季度' },
    {
      key: 'cols',
      label: '列表头',
      type: 'array',
      itemSchema: [{ key: 'label', label: '列名', type: 'text' }],
    },
    {
      key: 'rows',
      label: '数据行',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '行名称', type: 'text' },
        { key: 'cells', label: '各列数值（逗号分隔）', type: 'text' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿元' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_COLS: string[] = ['一季度', '二季度', '三季度', '四季度'];

const DEFAULT_ROWS: Theme09CrosstabRow[] = [
  { name: '大模型', cells: [128, 164, 203, 246] },
  { name: '智能算力', cells: [96, 118, 142, 171] },
  { name: '具身智能', cells: [42, 58, 77, 104] },
  { name: 'AI 应用', cells: [64, 71, 83, 96] },
  { name: '数据服务', cells: [31, 36, 44, 52] },
];

function toCells(v?: string | Array<string | number>): Array<string | number> {
  if (Array.isArray(v)) return v;
  const s = String(v ?? '').trim();
  if (!s) return [];
  return (s.includes('|') ? s.split('|') : s.split(',')).map((x) => x.trim());
}

function toColLabel(v: Theme09CrosstabCol | string, idx: number): string {
  if (typeof v === 'string') return v;
  return v?.label ?? `第 ${idx + 1} 列`;
}

export function Theme09CrosstabV1(props: Theme09CrosstabV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    corner = '赛道 / 季度',
    cols = [],
    rows = [],
    unit,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('paper');
  const rowList = rows.length ? rows : DEFAULT_ROWS;
  const colList = cols.length ? cols.map(toColLabel) : DEFAULT_COLS;
  const matrix = rowList.map((r) => toCells(r.cells));
  const allValues = matrix.flat().map((v) => t9ParseNumber(v));
  const max = Math.max(...allValues, 1);

  const renderTitle = (t: string): ReactNode => {
    const parts = t.split(/(\{\{[^}]+\}\})/g);
    return (
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme09-chart-title lp-t9-serif">
        {parts.map((part, idx) => {
          const m = part.match(/^\{\{(.+)\}\}$/);
          if (m) return <em key={idx} className="lp-theme09-accent-text">{m[1]}</em>;
          return <span key={idx}>{part}</span>;
        })}
      </EditableField>
    );
  };

  return (
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-crosstab">
      <T9ChartShell
        slideIdx={_slideIdx}
        editable={_editable}
        footnoteLeft={footnoteLeft}
        footnoteRight={footnoteRight}
        head={
          <T9ChartHeader
            section={section}
            sectionEn={sectionEn}
            mark={mark}
            kicker={kicker}
            slideIdx={_slideIdx}
            editable={_editable}
          />
        }
        body={
          <div
            className="lp-theme09-crosstab-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', alignItems: 'stretch' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  tableLayout: 'fixed',
                  fontFamily: c.font,
                  borderTop: `2px solid ${c.ink}`,
                  borderBottom: `2px solid ${c.ink}`,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        fontFamily: c.fontHeading,
                        fontSize: 13,
                        fontWeight: 700,
                        color: c.ink2,
                        borderBottom: `1px solid ${c.rule}`,
                        borderRight: `1px solid ${c.rule}`,
                        width: '22%',
                      }}
                    >
                      {corner}
                    </th>
                    {colList.map((label, i) => (
                      <th
                        key={i}
                        style={{
                          textAlign: 'center',
                          padding: '10px 12px',
                          fontFamily: c.fontHeading,
                          fontSize: 13,
                          fontWeight: 700,
                          color: c.ink2,
                          borderBottom: `1px solid ${c.rule}`,
                          borderRight: i === colList.length - 1 ? 'none' : `1px solid ${c.rule}`,
                        }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowList.map((row, ri) => (
                    <tr key={ri}>
                      <td
                        style={{
                          padding: '9px 12px',
                          fontSize: 14,
                          fontWeight: 700,
                          color: c.ink,
                          borderBottom: `1px solid ${c.rule}`,
                          borderRight: `1px solid ${c.rule}`,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.name ?? ''}
                      </td>
                      {colList.map((_, ci) => {
                        const raw = matrix[ri]?.[ci];
                        const num = t9ParseNumber(raw);
                        const intensity = max > 0 ? num / max : 0;
                        return (
                          <td
                            key={ci}
                            style={{
                              padding: '9px 12px',
                              textAlign: 'center',
                              fontFamily: c.fontMono,
                              fontSize: 14,
                              fontWeight: intensity > 0.66 ? 700 : 500,
                              color: c.ink,
                              background: t9Rgba(c.accent, 0.05 + intensity * 0.45),
                              borderBottom: `1px solid ${c.rule}`,
                              borderRight: ci === colList.length - 1 ? 'none' : `1px solid ${c.rule}`,
                            }}
                          >
                            {raw == null || raw === '' ? '—' : t9FormatNumber(num)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: c.ink3, fontFamily: c.font }}>
              <span>低</span>
              {[0.08, 0.2, 0.32, 0.42, 0.5].map((a, i) => (
                <span key={i} style={{ width: 26, height: 10, background: t9Rgba(c.accent, a), display: 'inline-block' }} />
              ))}
              <span>高</span>
              {unit && <span style={{ marginLeft: 'auto', fontFamily: c.fontMono }}>单位：{unit}</span>}
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
