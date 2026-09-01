// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 单指标大屏页（metric_big_v1）
 * 情绪：aurora | 骨架：stage
 * 单一超大指标 + 环形进度 + 描述。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, EditableField, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11MetricBigV1Props {
  value: string;
  label: string;
  description?: string;
  eyebrow?: string;
  progress?: number;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11MetricBigV1Meta: LayoutMeta = {
  id: 'theme11_metric_big_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 单指标大屏页',
  description: '单一超大指标 + 环形进度 + 描述',
  needsMedia: false,
  tags: ['stats', 'metric', 'stage', 'light-stream'],
  contentShape: 'metric-big',
};

export const theme11MetricBigV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PERFORMANCE' },
    { key: 'value', label: '主指标值', type: 'textarea', inlineEditable: true, defaultValue: '87%' },
    { key: 'label', label: '指标标签', type: 'text', inlineEditable: true, defaultValue: '目标完成度' },
    { key: 'description', label: '说明', type: 'textarea', inlineEditable: true, defaultValue: '本季度核心目标完成度超出预期，下阶段将聚焦用户增长。' },
    { key: 'progress', label: '进度百分比', type: 'number', defaultValue: 87 },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

function RingProgress({ value }: { value: number }): ReactNode {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);
  return (
    <svg className="lp-theme11-metric-big-ring" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r={radius} className="lp-theme11-metric-big-ring-bg" />
      <circle cx="90" cy="90" r={radius} className="lp-theme11-metric-big-ring-progress" strokeDasharray={circumference} strokeDashoffset={offset} />
    </svg>
  );
}

export function Theme11MetricBigV1(props: Theme11MetricBigV1Props): ReactNode {
  const { value, label, description, eyebrow, progress = 87, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-metric-big">
      <div className="lp-theme11-metric-big-inner lp-rise">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <div className="lp-theme11-metric-big-visual">
          <RingProgress value={progress} />
          <div className="lp-theme11-metric-big-center">
            <EditableField prop="value" slideIdx={s} editable={e} as="span" className="lp-theme11-metric-big-value">{value}</EditableField>
          </div>
        </div>
        <EditableField prop="label" slideIdx={s} editable={e} as="h2" className="lp-theme11-metric-big-label">{label}</EditableField>
        {description && <Caption className="lp-theme11-metric-big-desc"><EditableField prop="description" slideIdx={s} editable={e} as="span">{description}</EditableField></Caption>}
      </div>
    </Sheet>
  );
}
