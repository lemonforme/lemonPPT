// lemonPPT - theme08 黑金实验 · 数据表
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08TableV1Row {
  c1: string;
  c2?: string;
  c3?: string;
  c4?: string;
}

export interface Theme08TableV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  headers?: string[];
  rows?: Theme08TableV1Row[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08TableV1Meta: LayoutMeta = {
  id: 'theme08_table_v1',
  theme: 'theme08',
  role: 'table',
  displayName: 'Theme 08 数据表',
  description: '四列数据表，荧光金表头，适合明细/对比',
  needsMedia: false,
  tags: ['table', 'data', 'black-gold'],
  contentShape: 'table',
};

export const theme08TableV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'DETAIL' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '赛道明细对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按融资规模与增速排序。' },
    {
      key: 'headers',
      label: '表头',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: ['赛道', '融资(亿$)', '增速', '集中度'],
      itemSchema: [{ key: 'item', label: '表头', type: 'text' }],
    },
    {
      key: 'rows',
      label: '数据行',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { c1: '通用大模型', c2: '181', c3: '+40%', c4: 'High' },
        { c1: '基础设施', c2: '21', c3: '+35%', c4: 'Mid' },
        { c1: '具身智能', c2: '6.8', c3: '+120%', c4: 'Low' },
        { c1: '垂直应用', c2: '5.2', c3: '+80%', c4: 'Low' },
      ],
      itemSchema: [
        { key: 'c1', label: '列1', type: 'text' },
        { key: 'c2', label: '列2', type: 'text' },
        { key: 'c3', label: '列3', type: 'text' },
        { key: 'c4', label: '列4', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '63' },
  ],
};

export function Theme08TableV1(props: Theme08TableV1Props): ReactNode {
  const { kicker, title, subtitle, headers = [], rows = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validHeaders = (headers || []).slice(0, 4);
  const validRows = (rows || []).slice(0, 8);
  const colCount = Math.max(1, validHeaders.length);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-table-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="doc" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <table className="lp-theme08-table lp-rise" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {validHeaders.map((h, i) => {
                  const hText = typeof h === 'string' ? h : ((h as { item?: string }).item ?? '');
                  return (
                    <th key={i}><EditableField prop={`headers.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{hText}</EditableField></th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {validRows.map((row, r) => (
                <tr key={r} style={{ animationDelay: `${r * 40}ms` }}>
                  {Array.from({ length: colCount }).map((_, c) => {
                    const ck = ['c1', 'c2', 'c3', 'c4'][c];
                    return (
                      <td key={c}>
                        <EditableField prop={`rows.${r}.${ck}`} slideIdx={_slideIdx} editable={_editable} as="span">{row[ck as keyof Theme08TableV1Row] ?? ''}</EditableField>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
