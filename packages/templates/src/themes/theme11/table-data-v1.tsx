// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 指标数据表页（table_data_v1）
 * 情绪：daylight | 骨架：grid
 * 横向条形 + 数值 + 状态标签，突出数据对比。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11TableDataV1Row {
  name: string;
  value: number;
  unit?: string;
  change?: string;
  status?: string;
}

export interface Theme11TableDataV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  rows?: Theme11TableDataV1Row[];
  note?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11TableDataV1Meta: LayoutMeta = {
  id: 'theme11_table_data_v1',
  theme: 'theme11',
  role: 'table',
  displayName: 'Theme 11 指标数据表页',
  description: '横向条形 + 数值 + 状态标签',
  needsMedia: false,
  tags: ['table', 'metrics', 'grid', 'light-stream'],
  contentShape: 'table',
};

export const theme11TableDataV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '核心指标追踪' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本季度关键业务指标完成度' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'METRICS TABLE' },
    {
      key: 'rows',
      label: '指标行',
      type: 'array',
      maxItems: 8,
      defaultValue: [
        { name: '月度活跃用户', value: 92, unit: '%', change: '+12%', status: '优秀' },
        { name: '付费转化率', value: 74, unit: '%', change: '+5%', status: '良好' },
        { name: '客户留存率', value: 86, unit: '%', change: '+8%', status: '优秀' },
        { name: '平均客单价', value: 68, unit: '%', change: '+3%', status: '正常' },
        { name: 'NPS 评分', value: 58, unit: '%', change: '-2%', status: '关注' },
        { name: '服务可用性', value: 99, unit: '%', change: '+0.5%', status: '优秀' },
      ],
      itemSchema: [
        { key: 'name', label: '指标', type: 'text' },
        { key: 'value', label: '完成度', type: 'number' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'change', label: '环比', type: 'text' },
        { key: 'status', label: '状态', type: 'text' },
      ],
    },
    { key: 'note', label: '底部注释', type: 'textarea', defaultValue: '完成度以季度目标为基准，状态由自动阈值判定。' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11TableDataV1(props: Theme11TableDataV1Props): ReactNode {
  const { title, subtitle, eyebrow, rows = [], note, mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const validRows = (rows || []).filter((n): n is Theme11TableDataV1Row => n != null).slice(0, 8);
  const max = Math.max(...validRows.map((r) => r.value), 100);

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-table-data">
      <div className="lp-theme11-table-data-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="violet"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-table-data-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-table-data-list">
        {validRows.map((row, i) => (
          <Card key={i} className="lp-theme11-table-data-row lp-rise" padding="medium" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="lp-theme11-table-data-top">
              <EditableField prop={`rows.${i}.name`} slideIdx={s} editable={e} as="span" className="lp-theme11-table-data-name">{row.name}</EditableField>
              <div className="lp-theme11-table-data-right">
                <EditableField prop={`rows.${i}.status`} slideIdx={s} editable={e} as="span" className="lp-theme11-table-data-status">{row.status}</EditableField>
                <EditableField prop={`rows.${i}.change`} slideIdx={s} editable={e} as="span" className="lp-theme11-table-data-change">{row.change}</EditableField>
                <span className="lp-theme11-table-data-value">
                  <EditableField prop={`rows.${i}.value`} slideIdx={s} editable={e} as="span">{row.value}</EditableField>{row.unit ?? '%'}
                </span>
              </div>
            </div>
            <div className="lp-theme11-table-data-bar-bg">
              <div className="lp-theme11-table-data-bar-fill" style={{ width: `${(row.value / max) * 100}%` }} />
            </div>
          </Card>
        ))}
      </div>
      {note && <EditableField prop="note" slideIdx={s} editable={e} as="p" className="lp-theme11-table-data-note">{note}</EditableField>}
    </Sheet>
  );
}
