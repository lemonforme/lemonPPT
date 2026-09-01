// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 数据表格页（table_v1）
 * 情绪：daylight | 骨架：grid
 * 表头高亮 + 斑马行 + 左侧彩色竖条，信息清晰且具设计感。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11TableV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  headers?: string[];
  rows?: string[][];
  note?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11TableV1Meta: LayoutMeta = {
  id: 'theme11_table_v1',
  theme: 'theme11',
  role: 'table',
  displayName: 'Theme 11 数据表格页',
  description: '表头高亮 + 斑马行 + 左侧彩色竖条',
  needsMedia: false,
  tags: ['table', 'data', 'grid', 'light-stream'],
  contentShape: 'table',
};

export const theme11TableV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '渠道投放效果对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '各渠道核心指标一览' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'DATA TABLE' },
    {
      key: 'headers',
      label: '表头',
      type: 'array',
      maxItems: 6,
      defaultValue: ['渠道', '曝光', '点击', '转化', 'CPA', 'ROI'],
      itemSchema: [{ key: 'name', label: '名称', type: 'text' }],
    },
    {
      key: 'rows',
      label: '行数据',
      type: 'array',
      maxItems: 8,
      defaultValue: [
        ['信息流', '1.2M', '48K', '3.2%', '¥45', '1:3.8'],
        ['搜索广告', '800K', '32K', '4.1%', '¥62', '1:4.5'],
        ['短视频', '2.1M', '120K', '2.8%', '¥38', '1:3.2'],
        ['私域社群', '300K', '18K', '6.5%', '¥22', '1:5.6'],
        ['KOL 合作', '600K', '24K', '3.5%', '¥78', '1:2.9'],
      ],
      itemSchema: [{ key: 'cells', label: '单元格', type: 'text' }],
    },
    { key: 'note', label: '底部注释', type: 'textarea', defaultValue: '数据来源：2026 Q2 投放后台，统计周期为 6 月。' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11TableV1(props: Theme11TableV1Props): ReactNode {
  const { title, subtitle, eyebrow, headers = [], rows = [], note, mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const validHeaders = (headers || []).slice(0, 6);
  const validRows = (rows || []).slice(0, 8).map((r) => (r || []).slice(0, validHeaders.length));

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-table">
      <div className="lp-theme11-table-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-table-sub">{subtitle}</EditableField>}
      </div>
      <Card className="lp-theme11-table-card lp-rise" padding="none">
        <table className="lp-theme11-table-self">
          <thead>
            <tr>
              {validHeaders.map((h, i) => (
                <th key={i}><EditableField prop={`headers.${i}`} slideIdx={s} editable={e} as="span">{h}</EditableField></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {validRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>
                    <EditableField prop={`rows.${ri}.${ci}`} slideIdx={s} editable={e} as="span">{cell ?? ''}</EditableField>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {note && <EditableField prop="note" slideIdx={s} editable={e} as="p" className="lp-theme11-table-note">{note}</EditableField>}
    </Sheet>
  );
}
