// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 投资日历（calendar_v1）
 * 基底：纸 | 骨架：grid | 图位：—
 *
 * 月历网格（7 列 × 5–6 行），事件以专色圆点 + 事件名标记在日期格内。
 * 纯 CSS grid 实现，不依赖图表库。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet } from './shared.js';

export interface Theme09CalendarEvent {
  /** 日期：支持 2026-08-14 / 8/14 / 14 三种写法 */
  date?: string | number;
  name?: string;
  /** 事件类别：政策 / 数据 / 财报 / 会议 / 发行 */
  type?: string;
}

export interface Theme09CalendarV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  year?: string | number;
  month?: string | number;
  events?: Theme09CalendarEvent[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CalendarV1Meta: LayoutMeta = {
  id: 'theme09_calendar_v1',
  theme: 'theme09',
  role: 'timeline',
  displayName: '投资日历',
  description: '月历网格 + 事件圆点标记 + 类别图例，纯 CSS grid，纸底',
  needsMedia: false,
  tags: ['calendar', 'schedule', 'events', 'grid'],
  contentShape: 'calendar-month',
};

export const theme09CalendarV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '投资日历' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'CALENDAR' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '12' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '本月值得盯住的十一个时点' },
    { key: 'year', label: '年份', type: 'number', defaultValue: 2026 },
    { key: 'month', label: '月份（1-12）', type: 'number', min: 1, max: 12, defaultValue: 8 },
    {
      key: 'events',
      label: '日历事件',
      type: 'array',
      maxItems: 20,
      itemSchema: [
        { key: 'date', label: '日期', type: 'text' },
        { key: 'name', label: '事件名', type: 'text' },
        { key: 'type', label: '类别（政策/数据/财报/会议/发行）', type: 'text' },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '日历 · 时点' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '34' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

const DEFAULT_YEAR = 2026;
const DEFAULT_MONTH = 8;

const DEFAULT_EVENTS: Theme09CalendarEvent[] = [
  { date: 3, name: '制造业 PMI', type: '数据' },
  { date: 5, name: '央行公开市场操作', type: '政策' },
  { date: 7, name: '进出口数据', type: '数据' },
  { date: 11, name: '半导体龙头中报', type: '财报' },
  { date: 13, name: 'CPI / PPI', type: '数据' },
  { date: 14, name: '算力产业大会', type: '会议' },
  { date: 18, name: '国债增发招标', type: '发行' },
  { date: 20, name: 'LPR 报价', type: '政策' },
  { date: 21, name: '云厂商季报', type: '财报' },
  { date: 26, name: '工业企业利润', type: '数据' },
  { date: 28, name: '产业基金开放申购', type: '发行' },
];

const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

/** 事件类别 → 专色序列（未知类别落到灰墨）。 */
const TYPE_TONES: Array<{ key: string; tone: string }> = [
  { key: '政策', tone: 'var(--lp-accent)' },
  { key: '数据', tone: 'var(--lp-series-2)' },
  { key: '财报', tone: 'var(--lp-series-3)' },
  { key: '会议', tone: 'var(--lp-series-4)' },
  { key: '发行', tone: 'var(--lp-series-5)' },
];

function toneOf(type?: string): string {
  const t = String(type ?? '').trim();
  const hit = TYPE_TONES.find((x) => x.key === t);
  return hit ? hit.tone : 'var(--lp-ink3)';
}

function toInt(v: unknown, fallback: number): number {
  const n = typeof v === 'number' ? v : parseInt(String(v ?? '').trim(), 10);
  return Number.isFinite(n) ? n : fallback;
}

/** 从 2026-08-14 / 8/14 / 14 中取出「日」。 */
function dayOf(date?: string | number): number {
  if (typeof date === 'number') return Math.floor(date);
  const s = String(date ?? '').trim();
  if (!s) return 0;
  const parts = s.split(/[-/.]/).filter(Boolean);
  const last = parts[parts.length - 1] ?? '';
  const n = parseInt(last, 10);
  return Number.isFinite(n) ? n : 0;
}

interface DayCell {
  day: number;
  events: Theme09CalendarEvent[];
  /** 原始 events 下标，用于 EditableField 路径 */
  indices: number[];
}

export function Theme09CalendarV1(props: Theme09CalendarV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    title,
    year,
    month,
    events = [],
    folioLeft,
    folioPage,
    folioRight,
    _slideIdx: s,
    _editable: e,
  } = props;

  const y = toInt(year, DEFAULT_YEAR);
  const m = Math.min(12, Math.max(1, toInt(month, DEFAULT_MONTH)));
  const list = events.length ? events : DEFAULT_EVENTS;

  const daysInMonth = new Date(y, m, 0).getDate();
  // 周一为首列：JS 的 getDay() 中周日为 0，换算成 6。
  const firstWeekday = (new Date(y, m - 1, 1).getDay() + 6) % 7;
  const rowCount = Math.ceil((firstWeekday + daysInMonth) / 7);

  const byDay = new Map<number, DayCell>();
  list.forEach((ev, idx) => {
    const d = dayOf(ev.date);
    if (d < 1 || d > daysInMonth) return;
    const cell = byDay.get(d) ?? { day: d, events: [], indices: [] };
    cell.events.push(ev);
    cell.indices.push(idx);
    byDay.set(d, cell);
  });

  const usedTypes = TYPE_TONES.filter((t) => list.some((ev) => String(ev.type ?? '').trim() === t.key));

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-calendar">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 14, padding: '96px 60px 70px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, flex: 'none' }}>
          {title && (
            <h2 className="lp-t9-serif" style={{ margin: 0, fontSize: 30, fontWeight: 700, lineHeight: 1.26, color: 'var(--lp-ink)' }}>
              <EditableField prop="title" slideIdx={s} editable={e} as="span">
                {title}
              </EditableField>
            </h2>
          )}
          <span
            style={{
              marginLeft: 'auto',
              flex: 'none',
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 8,
              fontFamily: 'var(--lp-font-mono)',
              color: 'var(--lp-accent)',
            }}
          >
            <EditableField prop="year" slideIdx={s} editable={e} as="span" fieldType="number">
              {String(y)}
            </EditableField>
            <span aria-hidden="true" style={{ color: 'var(--lp-ink3)' }}>/</span>
            <EditableField prop="month" slideIdx={s} editable={e} as="span" fieldType="number">
              {String(m).padStart(2, '0')}
            </EditableField>
          </span>
        </div>

        {/* 星期表头 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 6,
            flex: 'none',
            borderBottom: '2px solid var(--lp-t9-rule-strong)',
            paddingBottom: 6,
          }}
        >
          {WEEK_LABELS.map((w, i) => (
            <span
              key={w}
              style={{
                fontFamily: 'var(--lp-font-mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textAlign: 'center',
                color: i >= 5 ? 'var(--lp-accent)' : 'var(--lp-ink3)',
              }}
            >
              {w}
            </span>
          ))}
        </div>

        {/* 月历网格 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: `repeat(${rowCount}, 1fr)`,
            gap: 6,
            flex: '1 1 auto',
            minHeight: 0,
          }}
        >
          {Array.from({ length: rowCount * 7 }).map((_, slot) => {
            const day = slot - firstWeekday + 1;
            const inMonth = day >= 1 && day <= daysInMonth;
            const cell = inMonth ? byDay.get(day) : undefined;
            const isWeekend = slot % 7 >= 5;

            return (
              <div
                key={slot}
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  overflow: 'hidden',
                  border: `1px solid ${cell ? 'var(--lp-border-strong)' : 'var(--lp-border)'}`,
                  background: inMonth ? (cell ? 'var(--lp-surface-solid)' : 'transparent') : 'var(--lp-overlay)',
                  padding: '6px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {inMonth && (
                  <span
                    style={{
                      flex: 'none',
                      fontFamily: 'var(--lp-font-mono)',
                      fontSize: 12,
                      fontWeight: cell ? 700 : 500,
                      color: cell ? 'var(--lp-ink)' : isWeekend ? 'var(--lp-ink3)' : 'var(--lp-ink2)',
                    }}
                  >
                    {String(day).padStart(2, '0')}
                  </span>
                )}

                {cell?.events.slice(0, 2).map((ev, k) => (
                  <span key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 5, minWidth: 0 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        flex: 'none',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: toneOf(ev.type),
                        marginTop: 5,
                      }}
                    />
                    <span
                      style={{
                        minWidth: 0,
                        fontSize: 11.5,
                        lineHeight: 1.42,
                        color: 'var(--lp-ink2)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      <EditableField prop={`events.${cell.indices[k]}.name`} slideIdx={s} editable={e} as="span">
                        {ev.name ?? ''}
                      </EditableField>
                    </span>
                  </span>
                ))}
              </div>
            );
          })}
        </div>

        {/* 类别图例 */}
        {usedTypes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 'none' }}>
            {usedTypes.map((t) => (
              <span key={t.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: t.tone }} />
                <span style={{ fontSize: 12, color: 'var(--lp-ink2)' }}>{t.key}</span>
              </span>
            ))}
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--lp-font-mono)', fontSize: 11, letterSpacing: '0.16em', color: 'var(--lp-ink3)' }}>
              {`${list.length} EVENTS`}
            </span>
          </div>
        )}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
