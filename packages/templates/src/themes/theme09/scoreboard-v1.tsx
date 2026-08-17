// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 年度计分榜（scoreboard_v1）
 * 基底：墨 | 骨架：chart-canvas | 图位：—
 *
 * 表格式计分板：行为参赛者，列为轮次 / 维度，末列合计，
 * 冠军行以专色描边 + 底衬高亮。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9FormatNumber, t9ParseNumber, t9Rgba } from './chart-utils.js';

export interface Theme09ScoreRow {
  name?: string;
  scores?: Array<string | number>;
}

export interface Theme09ScoreboardV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  headers?: Array<string | { label?: string }>;
  rows?: Theme09ScoreRow[];
  /** 冠军行：行下标（0 起）或行名；留空则取合计最高行 */
  highlightRow?: string | number;
  totalLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ScoreboardV1Meta: LayoutMeta = {
  id: 'theme09_scoreboard_v1',
  theme: 'theme09',
  role: 'table',
  displayName: '年度计分榜',
  description: '表格式计分板 + 轮次列 + 合计列 + 冠军行专色高亮，墨底',
  needsMedia: false,
  tags: ['table', 'scoreboard', 'ranking', 'score'],
  contentShape: 'scoreboard',
};

export const theme09ScoreboardV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '年度计分' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'SCOREBOARD' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '15' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '计分' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四个维度打分，{{头部主体}} 全年领跑' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '每项满分 25 分，合计 100 分制；评分来自季度复盘会与第三方尽调。' },
    {
      key: 'headers',
      label: '列表头',
      type: 'array',
      maxItems: 8,
      itemSchema: [{ key: 'label', label: '列名', type: 'text' }],
    },
    {
      key: 'rows',
      label: '计分行',
      type: 'array',
      maxItems: 8,
      itemSchema: [
        { key: 'name', label: '参赛者 / 指标', type: 'text' },
        { key: 'scores', label: '分数（多列）', type: 'array', itemSchema: [{ key: 'item', label: '分数', type: 'text' }] },
      ],
    },
    { key: 'highlightRow', label: '冠军行（下标或名称）', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'totalLabel', label: '合计列名', type: 'text', inlineEditable: true, defaultValue: '合计' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true, defaultValue: '口径：四维度加权 · 满分 100' },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true, defaultValue: 'SCOREBOARD / 15' },
  ],
};

const DEFAULT_HEADERS = ['技术力', '交付力', '商业化', '组织力'];

const DEFAULT_ROWS: Theme09ScoreRow[] = [
  { name: '云智科技', scores: [23, 22, 21, 19] },
  { name: '砺行智能', scores: [21, 20, 22, 18] },
  { name: '同源数据', scores: [19, 21, 18, 20] },
  { name: '天工模型', scores: [22, 17, 16, 17] },
  { name: '维格方案', scores: [17, 19, 17, 16] },
];

function toHeaderLabel(h: string | { label?: string }): string {
  return typeof h === 'string' ? h : (h?.label ?? '');
}

function toScores(v: Theme09ScoreRow['scores']): Array<string | number> {
  if (!Array.isArray(v)) return [];
  return v.map((x) => (typeof x === 'string' || typeof x === 'number' ? x : ((x as { item?: string })?.item ?? '')));
}

export function Theme09ScoreboardV1(props: Theme09ScoreboardV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    headers = [],
    rows = [],
    highlightRow,
    totalLabel = '合计',
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const rowList = rows.length ? rows : DEFAULT_ROWS;
  const colList = headers.length ? headers.map(toHeaderLabel) : DEFAULT_HEADERS;
  const matrix = rowList.map((r) => toScores(r.scores));
  const totals = matrix.map((cells) => cells.reduce<number>((sum, v) => sum + t9ParseNumber(v), 0));
  const maxTotal = Math.max(...totals, 1);

  // 冠军行：显式指定优先，其次取合计最高行。
  let championIdx = totals.indexOf(Math.max(...totals));
  if (highlightRow != null && String(highlightRow).trim() !== '') {
    const raw = String(highlightRow).trim();
    const asNum = Number(raw);
    if (Number.isInteger(asNum) && asNum >= 0 && asNum < rowList.length) {
      championIdx = asNum;
    } else {
      const byName = rowList.findIndex((r) => (r.name ?? '') === raw);
      if (byName >= 0) championIdx = byName;
    }
  }

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

  const cellBase = {
    padding: '10px 12px',
    borderBottom: `1px solid ${c.rule}`,
    fontFamily: c.fontMono,
    fontSize: 14.5,
  } as const;

  return (
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-scoreboard">
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 auto', minHeight: 0 }}>
            {title && renderTitle(title)}
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}

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
                    <th style={{ ...cellBase, width: 54, textAlign: 'left', fontFamily: c.fontMono, fontSize: 11, letterSpacing: '0.14em', color: c.ink3, fontWeight: 500 }}>
                      RK
                    </th>
                    <th style={{ ...cellBase, width: '26%', textAlign: 'left', fontFamily: c.fontHeading, fontSize: 13, fontWeight: 700, color: c.ink2 }}>
                      参赛主体
                    </th>
                    {colList.map((label, i) => (
                      <th
                        key={i}
                        style={{ ...cellBase, textAlign: 'center', fontFamily: c.fontHeading, fontSize: 13, fontWeight: 700, color: c.ink2 }}
                      >
                        {label}
                      </th>
                    ))}
                    <th
                      style={{
                        ...cellBase,
                        width: '14%',
                        textAlign: 'right',
                        fontFamily: c.fontHeading,
                        fontSize: 13,
                        fontWeight: 700,
                        color: c.accent,
                        borderLeft: `1px solid ${c.rule}`,
                      }}
                    >
                      {totalLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowList.map((row, ri) => {
                    const champ = ri === championIdx;
                    const rowBg = champ ? t9Rgba(c.accent, 0.16) : 'transparent';
                    return (
                      <tr key={ri} style={{ background: rowBg }}>
                        <td
                          style={{
                            ...cellBase,
                            color: champ ? c.accent : c.ink3,
                            fontWeight: 700,
                            borderLeft: champ ? `3px solid ${c.accent}` : '3px solid transparent',
                          }}
                        >
                          {String(ri + 1).padStart(2, '0')}
                        </td>
                        <td style={{ ...cellBase, fontFamily: c.fontHeading, fontWeight: 700, color: c.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <EditableField prop={`rows.${ri}.name`} slideIdx={_slideIdx} editable={_editable} as="span">
                            {row.name ?? ''}
                          </EditableField>
                        </td>
                        {colList.map((_, ci) => {
                          const raw = matrix[ri]?.[ci];
                          const empty = raw == null || raw === '';
                          return (
                            <td key={ci} style={{ ...cellBase, textAlign: 'center', color: champ ? c.ink : c.ink2 }}>
                              {empty ? '—' : t9FormatNumber(t9ParseNumber(raw))}
                            </td>
                          );
                        })}
                        <td
                          style={{
                            ...cellBase,
                            textAlign: 'right',
                            fontWeight: 700,
                            fontSize: 16,
                            color: champ ? c.accent : c.ink,
                            borderLeft: `1px solid ${c.rule}`,
                          }}
                        >
                          {t9FormatNumber(totals[ri])}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 底部：冠军条 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
              <span style={{ fontFamily: c.fontMono, fontSize: 11, letterSpacing: '0.2em', color: c.accent }}>CHAMPION</span>
              <span style={{ fontFamily: c.fontHeading, fontSize: 15, fontWeight: 700, color: c.ink }}>
                {rowList[championIdx]?.name ?? ''}
              </span>
              <span style={{ flex: '1 1 auto', height: 1, background: c.rule }} aria-hidden="true" />
              <span style={{ fontFamily: c.fontMono, fontSize: 12, color: c.ink3 }}>
                {`${t9FormatNumber(maxTotal)} / ${colList.length} 项`}
              </span>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
