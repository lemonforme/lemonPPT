// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9FormatNumber, t9Rgba } from './chart-utils.js';

export interface Theme09LedgerHeadCell {
  label?: string;
}

export interface Theme09LedgerRow {
  cols?: string | Array<string | number>;
}

export interface Theme09LedgerV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  header?: Array<Theme09LedgerHeadCell | string>;
  rows?: Theme09LedgerRow[];
  total?: string | Array<string | number>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09LedgerV1Meta: LayoutMeta = {
  id: 'theme09_ledger_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '数据台账',
  description: '账簿式表格：细栏线 + 隔行网点 + 合计行，纸底',
  needsMedia: false,
  tags: ['chart', 'table', 'ledger', 'data'],
  contentShape: 'ledger',
};

export const theme09LedgerV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '数据台账' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'LEDGER' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '23' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '明细' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '全年重点项目 {{投入台账}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按金额降序排列，合计行为全年口径汇总。' },
    {
      key: 'header',
      label: '表头',
      type: 'array',
      itemSchema: [{ key: 'label', label: '列名', type: 'text' }],
    },
    {
      key: 'rows',
      label: '台账行',
      type: 'array',
      itemSchema: [{ key: 'cols', label: '各列内容（竖线或逗号分隔）', type: 'text' }],
    },
    { key: 'total', label: '合计行（竖线分隔）', type: 'text', inlineEditable: true, defaultValue: '合计|全部项目|—|12860|100%' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_HEADER: string[] = ['编号', '项目名称', '轮次', '金额（万元）', '占比'];

const DEFAULT_ROWS: Theme09LedgerRow[] = [
  { cols: ['01', '通用大模型平台', 'C 轮', 4200, '32.7%'] },
  { cols: ['02', '智能算力中心', 'B+ 轮', 3100, '24.1%'] },
  { cols: ['03', '具身智能整机', 'B 轮', 2400, '18.7%'] },
  { cols: ['04', '行业应用中台', 'A+ 轮', 1800, '14.0%'] },
  { cols: ['05', '数据标注服务', 'A 轮', 860, '6.7%'] },
  { cols: ['06', '推理芯片验证', '天使轮', 500, '3.8%'] },
];

const DEFAULT_TOTAL: Array<string | number> = ['合计', '全部项目', '—', 12860, '100%'];

function toCells(v?: string | Array<string | number>): Array<string | number> {
  if (Array.isArray(v)) return v;
  const s = String(v ?? '').trim();
  if (!s) return [];
  return (s.includes('|') ? s.split('|') : s.split(/[,，]/)).map((x) => x.trim());
}

function toHeadLabel(v: Theme09LedgerHeadCell | string, idx: number): string {
  if (typeof v === 'string') return v;
  return v?.label ?? `第 ${idx + 1} 列`;
}

function formatCell(v: string | number | undefined): string {
  if (v == null || v === '') return '—';
  if (typeof v === 'number') return t9FormatNumber(v);
  const s = String(v).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return t9FormatNumber(t9ParseNumber(s));
  return s;
}

function isNumericCell(v: string | number | undefined): boolean {
  if (typeof v === 'number') return true;
  return /^-?[\d,]+(\.\d+)?%?$/.test(String(v ?? '').trim());
}

export function Theme09LedgerV1(props: Theme09LedgerV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    header = [],
    rows = [],
    total,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('paper');
  const head = header.length ? header.map(toHeadLabel) : DEFAULT_HEADER;
  const rowList = rows.length ? rows : DEFAULT_ROWS;
  const totalCells = total ? toCells(total) : DEFAULT_TOTAL;

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-ledger">
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
            className="lp-theme09-ledger-body"
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
                }}
              >
                <thead>
                  <tr>
                    {head.map((label, i) => (
                      <th
                        key={i}
                        style={{
                          textAlign: i === 0 ? 'left' : i >= head.length - 2 ? 'right' : 'left',
                          padding: '9px 12px',
                          fontFamily: c.fontHeading,
                          fontSize: 12.5,
                          fontWeight: 700,
                          letterSpacing: '.04em',
                          color: c.ink2,
                          borderBottom: `1px solid ${c.ink}`,
                          borderRight: i === head.length - 1 ? 'none' : `1px solid ${c.rule}`,
                          width: i === 0 ? '10%' : i === 1 ? '34%' : undefined,
                        }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowList.map((row, ri) => {
                    const cells = toCells(row.cols);
                    return (
                      <tr key={ri} style={{ background: ri % 2 === 1 ? t9Rgba(c.ink, 0.04) : 'transparent' }}>
                        {head.map((_, ci) => {
                          const v = cells[ci];
                          const numeric = isNumericCell(v);
                          return (
                            <td
                              key={ci}
                              style={{
                                padding: '8px 12px',
                                fontSize: 13.5,
                                textAlign: ci === 0 ? 'left' : numeric ? 'right' : 'left',
                                fontFamily: ci === 0 || numeric ? c.fontMono : c.font,
                                fontWeight: ci === 1 ? 600 : 400,
                                color: ci === 0 ? c.ink3 : c.ink,
                                borderBottom: `1px solid ${c.rule}`,
                                borderRight: ci === head.length - 1 ? 'none' : `1px solid ${c.rule}`,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {formatCell(v)}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: t9Rgba(c.accent, 0.08) }}>
                    {head.map((_, ci) => {
                      const v = totalCells[ci];
                      const numeric = isNumericCell(v);
                      return (
                        <td
                          key={ci}
                          style={{
                            padding: '10px 12px',
                            fontSize: 14,
                            fontWeight: 700,
                            textAlign: ci === 0 ? 'left' : numeric ? 'right' : 'left',
                            fontFamily: numeric ? c.fontMono : c.fontHeading,
                            color: ci === 0 ? c.accent : c.ink,
                            borderTop: `2px solid ${c.ink}`,
                            borderBottom: `2px solid ${c.ink}`,
                            borderRight: ci === head.length - 1 ? 'none' : `1px solid ${c.rule}`,
                          }}
                        >
                          {formatCell(v)}
                        </td>
                      );
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
