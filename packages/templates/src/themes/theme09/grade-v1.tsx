// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Rgba } from './chart-utils.js';

export interface Theme09GradeRow {
  name?: string;
  ratings?: string;
}

export interface Theme09GradeV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  columns?: string[];
  rows?: Theme09GradeRow[];
  legendA?: string;
  legendB?: string;
  legendC?: string;
  legendD?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09GradeV1Meta: LayoutMeta = {
  id: 'theme09_grade_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '评级矩阵',
  description: '评级色块矩阵 + 图例，A 级朱砂实心、B/C 专色淡染，纯 HTML 网格，纸底',
  needsMedia: false,
  tags: ['chart', 'grade', 'matrix', 'heatmap'],
  contentShape: 'grade-matrix',
};

export const theme09GradeV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '评级矩阵' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'GRADE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '48' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '评级' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '五个维度看下来，{{西部大区}} 仍需补课' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按季度复核结果分级，A 为达标领先，D 为需重点整改。' },
    { key: 'columns', label: '评估维度', type: 'array', inlineEditable: true, defaultValue: ['战略', '执行', '财务', '创新', '风控'] },
    {
      key: 'rows',
      label: '评级行',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '对象名', type: 'text' },
        { key: 'ratings', label: '各维评级（用 | 分隔）', type: 'text' },
      ],
    },
    { key: 'legendA', label: 'A 级说明', type: 'text', inlineEditable: true, defaultValue: '领先' },
    { key: 'legendB', label: 'B 级说明', type: 'text', inlineEditable: true, defaultValue: '达标' },
    { key: 'legendC', label: 'C 级说明', type: 'text', inlineEditable: true, defaultValue: '观察' },
    { key: 'legendD', label: 'D 级说明', type: 'text', inlineEditable: true, defaultValue: '整改' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_COLUMNS = ['战略', '执行', '财务', '创新', '风控'];

const DEFAULT_ROWS: Theme09GradeRow[] = [
  { name: '华东大区', ratings: 'A|A|B|B|A' },
  { name: '华北大区', ratings: 'B|A|C|B|B' },
  { name: '华南大区', ratings: 'A|B|A|C|B' },
  { name: '西部大区', ratings: 'C|B|C|D|D' },
  { name: '海外事业部', ratings: 'B|C|A|A|C' },
];

export function Theme09GradeV1(props: Theme09GradeV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    columns = [],
    rows = [],
    legendA = '领先',
    legendB = '达标',
    legendC = '观察',
    legendD = '整改',
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('paper');
  const cols = columns.length ? columns : DEFAULT_COLUMNS;
  const list = rows.length ? rows : DEFAULT_ROWS;

  const toneOf = (grade: string): { bg: string; fg: string; bd: string } => {
    const key = grade.trim().toUpperCase();
    if (key === 'A') return { bg: c.accent, fg: c.onAccent, bd: c.accent };
    if (key === 'B') return { bg: t9Rgba(c.series[1], 0.16), fg: c.series[1], bd: t9Rgba(c.series[1], 0.42) };
    if (key === 'C') return { bg: t9Rgba(c.series[3], 0.18), fg: c.series[3], bd: t9Rgba(c.series[3], 0.44) };
    return { bg: t9Rgba(c.ink3, 0.09), fg: c.ink3, bd: t9Rgba(c.ink3, 0.26) };
  };

  const legend: { grade: string; text: string }[] = [
    { grade: 'A', text: legendA },
    { grade: 'B', text: legendB },
    { grade: 'C', text: legendC },
    { grade: 'D', text: legendD },
  ];

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-grade">
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
            className="lp-theme09-grade-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-chart-area">
              <div
                className="lp-theme09-grade-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `minmax(112px, 1.25fr) repeat(${cols.length}, minmax(0, 1fr))`,
                  gridTemplateRows: `auto repeat(${list.length}, minmax(0, 1fr))`,
                  columnGap: '8px',
                  rowGap: '8px',
                }}
              >
                <div
                  style={{
                    fontFamily: c.font,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    color: c.ink3,
                    display: 'flex',
                    alignItems: 'flex-end',
                    paddingBottom: '4px',
                  }}
                >
                  维度 / 对象
                </div>
                {cols.map((col, ci) => (
                  <div
                    key={`h-${ci}`}
                    style={{
                      fontFamily: c.font,
                      fontSize: '13px',
                      fontWeight: 600,
                      color: c.ink2,
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      paddingBottom: '4px',
                      borderBottom: `1px solid ${c.rule}`,
                    }}
                  >
                    {col}
                  </div>
                ))}
                {list.flatMap((row, ri) => {
                  const grades = String(row.ratings ?? '').split('|');
                  const cells: ReactNode[] = [
                    <div
                      key={`n-${ri}`}
                      style={{
                        fontFamily: c.fontHeading,
                        fontSize: '15px',
                        fontWeight: 600,
                        color: c.ink,
                        display: 'flex',
                        alignItems: 'center',
                        paddingRight: '8px',
                      }}
                    >
                      {row.name ?? ''}
                    </div>,
                  ];
                  cols.forEach((_col, ci) => {
                    const g = (grades[ci] ?? '—').trim() || '—';
                    const tone = toneOf(g);
                    cells.push(
                      <div
                        key={`c-${ri}-${ci}`}
                        style={{
                          background: tone.bg,
                          color: tone.fg,
                          border: `1px solid ${tone.bd}`,
                          borderRadius: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: c.fontMono,
                          fontSize: '16px',
                          fontWeight: 700,
                          letterSpacing: '0.04em',
                          minHeight: '34px',
                        }}
                      >
                        {g.toUpperCase()}
                      </div>,
                    );
                  });
                  return cells;
                })}
              </div>
            </div>
            <div
              className="lp-theme09-grade-legend"
              style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', paddingTop: '2px' }}
            >
              {legend.map((item) => {
                const tone = toneOf(item.grade);
                return (
                  <span
                    key={item.grade}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontFamily: c.font, fontSize: '12px', color: c.ink3 }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        borderRadius: '3px',
                        background: tone.bg,
                        color: tone.fg,
                        border: `1px solid ${tone.bd}`,
                        fontFamily: c.fontMono,
                        fontSize: '11px',
                        fontWeight: 700,
                      }}
                    >
                      {item.grade}
                    </span>
                    {item.text}
                  </span>
                );
              })}
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
