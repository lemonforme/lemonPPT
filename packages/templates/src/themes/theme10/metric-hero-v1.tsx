// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 英雄指标（metric_hero_v1）
 * 情绪：aurora | 骨架：stage | 角色：stats
 * 单一超大指标：眉标 + 巨型 mono 数值 + 单位 + 涨跌 + 语境注脚。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10MetricHeroV1Props {
  section?: string;
  title?: string;
  label?: string;
  value?: string;
  unit?: string;
  delta?: string;
  context?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10MetricHeroV1Meta: LayoutMeta = {
  id: 'theme10_metric_hero_v1',
  theme: 'theme10',
  role: 'stats',
  displayName: 'Theme 10 英雄指标',
  description: '单一超大指标 + 涨跌 + 语境',
  needsMedia: false,
  tags: ['metric', 'hero', 'stat', 'gold-index', 'aurora'],
  contentShape: 'metric-hero',
};

export const theme10MetricHeroV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一个被放大的数字' },
    { key: 'label', label: '指标名', type: 'text', inlineEditable: true, defaultValue: '管理规模' },
    { key: 'value', label: '数值', type: 'text', inlineEditable: true, defaultValue: '128.4' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿元' },
    { key: 'delta', label: '涨跌', type: 'text', inlineEditable: true, defaultValue: '+12.4%' },
    { key: 'context', label: '语境注脚', type: 'textarea', inlineEditable: true, defaultValue: '连续六个季度环比为正，份额扩张主要来自机构端配置。' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '核心指标' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '72' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10MetricHeroV1(props: Theme10MetricHeroV1Props): ReactNode {
  const { section, title, label, value, unit, delta, context, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const up = delta != null && !/^-/.test(String(delta).trim());

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme10-metric-hero" accent>
      <div className="lp-theme10-metric-hero-inner">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-metric-hero-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        <div className="lp-theme10-metric-hero-figure lp-rise" style={{ animationDelay: '120ms' }}>
          <EditableField prop="label" slideIdx={s} editable={e} as="div" className="t10-kpi-label lp-theme10-metric-hero-label">{label}</EditableField>
          <div className="t10-kpi-value">
            <EditableField prop="value" slideIdx={s} editable={e} as="span" className="t10-kpi-num lp-theme10-metric-hero-num">{value}</EditableField>
            {unit && <EditableField prop="unit" slideIdx={s} editable={e} as="span" className="t10-kpi-unit">{unit}</EditableField>}
          </div>
          {delta && <EditableField prop="delta" slideIdx={s} editable={e} as="div" className={`t10-kpi-delta ${up ? 'up' : 'down'}`}>{delta}</EditableField>}
        </div>
        {context && (
          <EditableField prop="context" slideIdx={s} editable={e} as="p" className="lp-theme10-metric-hero-context lp-rise" style={{ animationDelay: '180ms' }}>{context}</EditableField>
        )}
      </div>
      <Folio left={folioLeft} page={folioPage} right={folioRight} />
    </Sheet>
  );
}
