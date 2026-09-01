// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 趋势卡（trend_v1）
 * 情绪：daylight | 骨架：sidebar
 * 左侧大数字 + 右侧迷你趋势图。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, Sheet, Tagline, type Theme11Mood } from './shared.js';
import { T11EChart, t11MiniAreaOption, t11ParseVals } from './t11echart.js';

export interface Theme11TrendV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  value: string;
  label?: string;
  change?: string;
  note?: string;
  categories?: (string | { text?: string })[];
  values?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11TrendV1Meta: LayoutMeta = {
  id: 'theme11_trend_v1',
  theme: 'theme11',
  role: 'chart',
  displayName: 'Theme 11 趋势卡',
  description: '左侧大数字 + 右侧迷你趋势图',
  needsMedia: false,
  tags: ['chart', 'trend', 'sidebar', 'light-stream'],
  contentShape: 'trend',
};

export const theme11TrendV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', defaultValue: 'TREND' },
    { key: 'title', label: '标题', type: 'text', defaultValue: '月度活跃用户' },
    { key: 'subtitle', label: '副标题', type: 'textarea', defaultValue: '过去 6 个月持续增长' },
    { key: 'value', label: '核心数值', type: 'text', defaultValue: '42,380' },
    { key: 'label', label: '数值标签', type: 'text', defaultValue: 'MAU' },
    { key: 'change', label: '变化', type: 'text', defaultValue: '+12.4%' },
    { key: 'note', label: '说明', type: 'textarea', defaultValue: '新产品功能上线后，次月留存提升 6%。' },
    { key: 'categories', label: '类目', type: 'array', maxItems: 8, defaultValue: ['1月', '2月', '3月', '4月', '5月', '6月'], itemSchema: [{ key: 'item', label: '类目名', type: 'text' }] },
    { key: 'values', label: '数值(逗号分隔)', type: 'text', defaultValue: '32,34,36,39,41,42' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

export function Theme11TrendV1(props: Theme11TrendV1Props): ReactNode {
  const { title, subtitle, eyebrow, value, label, change, note, categories = [], values = '', mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const cats = categories.map((c) => (typeof c === 'string' ? c : String((c as { text?: string })?.text ?? ''))).filter(Boolean);
  const vals = t11ParseVals(values);
  const option = t11MiniAreaOption({ labels: cats.slice(0, vals.length), values: vals, color: 'var(--lp-accent)' });

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme11-trend">
      <div className="lp-theme11-trend-left lp-rise">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme11-trend-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-trend-sub">{subtitle}</EditableField>}
        <div className="lp-theme11-trend-metric">
          <EditableField prop="value" slideIdx={s} editable={e} as="span" className="lp-theme11-trend-value">{value}</EditableField>
          {label && <EditableField prop="label" slideIdx={s} editable={e} as="span" className="lp-theme11-trend-label">{label}</EditableField>}
        </div>
        {change && <EditableField prop="change" slideIdx={s} editable={e} as="div" className="lp-theme11-trend-change">{change}</EditableField>}
        {note && <EditableField prop="note" slideIdx={s} editable={e} as="p" className="lp-theme11-trend-note">{note}</EditableField>}
      </div>
      <Card className="lp-theme11-trend-chart-card lp-rise" padding="medium">
        <T11EChart option={option} type="line" />
      </Card>
    </Sheet>
  );
}
