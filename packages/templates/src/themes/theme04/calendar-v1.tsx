// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04CalendarV1Event {
  month: number;
  label: string;
  value?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04CalendarV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  year?: string;
  events?: Theme04CalendarV1Event[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04CalendarV1Meta: LayoutMeta = {
  id: 'theme04_calendar_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 资本月历',
  description: '12 个月份网格，展示关键事件与数值标记',
  needsMedia: false,
  tags: ['chart', 'calendar', 'heatmap', 'candy'],
  contentShape: 'data-grid',
};

export const theme04CalendarV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '资本月历' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{全年大事}}一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '标注投融资、政策与行业里程碑的关键月份' },
    { key: 'year', label: '年份', type: 'text', inlineEditable: true, defaultValue: '2024' },
    {
      key: 'events',
      label: '月度事件',
      type: 'array',
      minItems: 1,
      maxItems: 12,
      defaultValue: [
        { month: 1, label: '算力补贴出台', value: '120亿', tone: 'blue' },
        { month: 3, label: '基础模型井喷', value: '8笔', tone: 'green' },
        { month: 5, label: '云厂商大额融资', value: '65亿', tone: 'blue' },
        { month: 6, label: '应用层爆发', value: '22笔', tone: 'pink' },
        { month: 9, label: '并购窗口打开', value: '4起', tone: 'yellow' },
        { month: 12, label: '年度收官峰值', value: '210亿', tone: 'green' },
      ],
      itemSchema: [
        { key: 'month', label: '月份(1-12)', type: 'number', min: 1, max: 12 },
        { key: 'label', label: '事件', type: 'text' },
        { key: 'value', label: '数值/备注', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究整理' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-calendar-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

const toneClass: Record<string, string> = {
  green: 'lp-theme04-calendar-cell--green',
  pink: 'lp-theme04-calendar-cell--pink',
  blue: 'lp-theme04-calendar-cell--blue',
  yellow: 'lp-theme04-calendar-cell--yellow',
};

export function Theme04CalendarV1(props: Theme04CalendarV1Props): ReactNode {
  const { kicker, title, subtitle, year, events = [], footnote, _slideIdx, _editable } = props;
  const eventMap = new Map<number, Theme04CalendarV1Event>();
  (events || []).forEach((e) => {
    if (e && e.month >= 1 && e.month <= 12) {
      eventMap.set(e.month, e);
    }
  });

  return (
    <div className="lp-slide lp-theme04-calendar">
      <div className="lp-theme04-calendar-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-calendar-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-calendar-grid lp-rise">
        {MONTH_NAMES.map((name, idx) => {
          const month = idx + 1;
          const event = eventMap.get(month);
          return (
            <div key={month} className={`lp-theme04-calendar-cell lp-theme04-card ${event ? toneClass[event.tone ?? 'green'] : ''}`}>
              <div className="lp-theme04-calendar-month">
                <span className="lp-theme04-calendar-month-name">{name}</span>
                {year && <span className="lp-theme04-calendar-year">{year}</span>}
              </div>
              {event ? (
                <div className="lp-theme04-calendar-event">
                  <EditableField prop={`events.${events.findIndex((e) => e.month === month)}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-calendar-event-label">{event.label}</EditableField>
                  {event.value && (
                    <EditableField prop={`events.${events.findIndex((e) => e.month === month)}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-calendar-event-value">{event.value}</EditableField>
                  )}
                </div>
              ) : (
                <div className="lp-theme04-calendar-empty">—</div>
              )}
            </div>
          );
        })}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-calendar-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
