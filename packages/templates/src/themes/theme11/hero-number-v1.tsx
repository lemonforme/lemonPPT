// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 巨型数字页（hero_number_v1）
 * 情绪：sunset | 骨架：stage
 * 居中展示一个超大数字 + 说明 + 辅助指标。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, Card, EditableField, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11HeroNumberV1Props {
  number: string;
  label: string;
  description?: string;
  eyebrow?: string;
  metrics?: { value: string; label: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11HeroNumberV1Meta: LayoutMeta = {
  id: 'theme11_hero_number_v1',
  theme: 'theme11',
  role: 'stats',
  displayName: 'Theme 11 巨型数字页',
  description: '居中超大数字 + 说明 + 辅助指标',
  needsMedia: false,
  tags: ['stats', 'hero', 'stage', 'light-stream'],
  contentShape: 'hero-number',
};

export const theme11HeroNumberV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'IMPACT' },
    { key: 'number', label: '主数字', type: 'textarea', inlineEditable: true, defaultValue: '3.5x' },
    { key: 'label', label: '数字标签', type: 'text', inlineEditable: true, defaultValue: '效率提升' },
    { key: 'description', label: '说明', type: 'textarea', inlineEditable: true, defaultValue: '使用 LemonPPT 的团队平均将演示制作时间缩短 3.5 倍。' },
    { key: 'metrics', label: '辅助指标', type: 'array', maxItems: 3, defaultValue: [{ value: '60+', label: '版式' }, { value: '11', label: '主题' }, { value: '3', label: '导出格式' }], itemSchema: [{ key: 'value', label: '值', type: 'text', inlineEditable: true }, { key: 'label', label: '标签', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11HeroNumberV1(props: Theme11HeroNumberV1Props): ReactNode {
  const { number, label, description, eyebrow, metrics = [], mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-hero-number">
      <div className="lp-theme11-hero-number-inner lp-rise">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <div className="lp-theme11-hero-number-value">
          <EditableField prop="number" slideIdx={s} editable={e} as="span">{number}</EditableField>
        </div>
        <EditableField prop="label" slideIdx={s} editable={e} as="h2" className="lp-theme11-hero-number-label">{label}</EditableField>
        {description && <Caption className="lp-theme11-hero-number-desc"><EditableField prop="description" slideIdx={s} editable={e} as="span">{description}</EditableField></Caption>}
        <div className="lp-theme11-hero-number-metrics">
          {metrics.slice(0, 3).map((m, i) => (
            <Card key={i} className="lp-theme11-hero-number-metric" padding="medium">
              <EditableField prop={`metrics.${i}.value`} slideIdx={s} editable={e} as="span" className="lp-theme11-metric-value">{m.value}</EditableField>
              <EditableField prop={`metrics.${i}.label`} slideIdx={s} editable={e} as="span" className="lp-theme11-metric-label">{m.label}</EditableField>
            </Card>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
