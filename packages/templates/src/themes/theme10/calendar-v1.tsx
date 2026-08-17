// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 日历热力图（calendar_v1）
 * 情绪：ember | 骨架：chart-canvas | 角色：chart
 * GitHub 式贡献日历：列=周，行=周一..周日；颜色由值顺色阶（铜→金）。
 * 使用 echarts calendar 坐标系渲染（与 theme01–07 统一）。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';
import { T10EChart, calendarOption } from './t10echart.js';

export interface Theme10CalendarV1Props {
  section?: string;
  sectionEn?: string;
  title?: string;
  lead?: string;
  year?: number;
  weeks?: number;
  /** 扁平值序列（周优先、列内周一..周日），长度 = weeks*7 */
  values?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CalendarV1Meta: LayoutMeta = {
  id: 'theme10_calendar_v1',
  theme: 'theme10',
  role: 'chart',
  displayName: 'Theme 10 日历热力',
  description: 'GitHub 式贡献日历',
  needsMedia: false,
  tags: ['calendar', 'heatmap', 'github', 'gold-index', 'ember', 'chart'],
  contentShape: 'calendar',
};

export const theme10CalendarV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Calendar' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一格一天，把一年铺成了一面墙' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '颜色越暖，当日越活跃；横看是周，竖看是星期。' },
    { key: 'year', label: '年份', type: 'number', inlineEditable: true, defaultValue: 2025 },
    { key: 'weeks', label: '周数', type: 'number', inlineEditable: true, defaultValue: 18 },
    {
      key: 'values',
      label: '值序列(周优先,周×7,逗号分隔)',
      type: 'text',
      inlineEditable: true,
      defaultValue: Array.from({ length: 18 * 7 }, (_, i) => (Math.sin(i * 0.7) * 0.5 + 0.5).toFixed(2)).join(','),
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '趋势与时间' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '57' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

const pad2 = (n: number): string => String(n).padStart(2, '0');

export function Theme10CalendarV1(props: Theme10CalendarV1Props): ReactNode {
  const { section, title, lead, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const year = Math.max(2000, Number(props.year ?? 2025) | 0);
  const weeks = Math.max(1, Number(props.weeks ?? 18) | 0);
  const flat = (props.values ?? '')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((n) => isFinite(n));
  const cells = Array.from({ length: weeks * 7 }, (_, i) => flat[i] ?? 0);
  const maxV = cells.length ? Math.max(...cells, 1) : 1;

  // 将扁平值映射到 year 内从 1 月 1 日起的连续日期
  const values = cells.map((v, i) => {
    const d = new Date(year, 0, 1);
    d.setDate(d.getDate() + i);
    return { date: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`, value: v };
  });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme10-chart lp-theme10-cal">
      <div className="lp-theme10-chart-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-chart-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-chart-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-chart-body">
        <T10EChart option={calendarOption({ year, values, max: maxV })} />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
