// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 日历热力图（calendar_v1）
 * 情绪：daylight | 骨架：chart-canvas
 * 全年活跃度日历热力图。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11CalendarOption } from './t11echart.js';

export interface Theme11CalendarV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  year?: number;
  data?: [string, number][];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11CalendarV1Meta: LayoutMeta = {
  id: 'theme11_calendar_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 日历热力图',
  description: '全年活跃度日历热力图',
  needsMedia: false,
  tags: ['chart', 'calendar', 'heatmap', 'light-stream'],
  contentShape: 'calendar',
};

function generateCalendarData(year = 2026): [string, number][] {
  const data: [string, number][] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    const base = day === 0 || day === 6 ? 0 : Math.floor(Math.random() * 60) + 10;
    if (base > 0) data.push([d.toISOString().slice(0, 10), base + Math.floor(Math.random() * 40)]);
  }
  return data;
}

export const theme11CalendarV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'ACTIVITY' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '全年活跃度热力图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '颜色越深代表当日系统活跃度越高' },
    { key: 'year', label: '年份', type: 'number', defaultValue: 2026 },
    { key: 'data', label: '日期数据', type: 'array', maxItems: 366, defaultValue: generateCalendarData(), itemSchema: [{ key: 'item', label: '日期,数值', type: 'text' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

function normalizeCalendarData(v: unknown): [string, number][] {
  if (!Array.isArray(v)) return [];
  return v
    .map((it): [string, number] => {
      if (Array.isArray(it) && it.length >= 2) return [String(it[0]), Number(it[1]) || 0];
      if (typeof it === 'string') {
        const [date, val] = it.split(',');
        return [date?.trim() ?? '', Number(val) || 0];
      }
      return ['', 0];
    })
    .filter((d) => d[0]);
}

export function Theme11CalendarV1(props: Theme11CalendarV1Props): ReactNode {
  const { title, subtitle, eyebrow, year = 2026, data = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const cleanData = normalizeCalendarData(data);
  const option = t11CalendarOption({ year, data: cleanData, max: Math.max(...cleanData.map((d) => d[1]), 1) });

  return (
    <Sheet mood={mood} frame="chart-canvas" className="lp-theme11-chart lp-theme11-calendar">
      <div className="lp-theme11-chart-head">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-chart-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-chart-subtitle">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-chart-body lp-rise">
        <div className="lp-theme11-chart-main">
          <T11EChart option={option} type="heatmap" />
        </div>
      </div>
    </Sheet>
  );
}
