// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04GaugesV1Gauge {
  label: string;
  value: number;
  unit?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04GaugesV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  gauges?: Theme04GaugesV1Gauge[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04GaugesV1Meta: LayoutMeta = {
  id: 'theme04_gauges_v1',
  theme: 'theme04',
  role: 'metric',
  displayName: 'Theme 04 三重仪表盘',
  description: '三个半圆弧形仪表盘，展示集中度/完成度类指标',
  needsMedia: false,
  tags: ['metric', 'gauge', 'dashboard', 'candy'],
  contentShape: 'title-grid',
};

export const theme04GaugesV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '集中度分析' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资金{{集中}}在头部' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: 'TOP3 赛道与 TOP10 公司分别拿走大部分资金' },
    {
      key: 'gauges',
      label: '仪表盘',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { label: '头部赛道占比', value: 68, unit: '%', tone: 'green' },
        { label: '头部公司集中度', value: 52, unit: '%', tone: 'blue' },
        { label: '晚期轮次占比', value: 74, unit: '%', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'label', label: '说明', type: 'text' },
        { key: 'value', label: '数值 (0-100)', type: 'number', defaultValue: 50 },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-gauges-title lp-rise">
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

function GaugeArc({ value, tone }: { value: number; tone?: string }): ReactNode {
  const radius = 80;
  const stroke = 18;
  const center = 100;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const progress = Math.max(0, Math.min(100, value)) / 100;
  const progressAngle = startAngle + (endAngle - startAngle) * progress;

  const arcPath = (a0: number, a1: number) => {
    const x0 = center + radius * Math.cos(a0);
    const y0 = center + radius * Math.sin(a0);
    const x1 = center + radius * Math.cos(a1);
    const y1 = center + radius * Math.sin(a1);
    const largeArc = a1 - a0 > Math.PI ? 1 : 0;
    return `M ${x0} ${y0} A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1}`;
  };

  const toneColor: Record<string, string> = {
    green: 'var(--lp-green)',
    pink: 'var(--lp-pink)',
    blue: 'var(--lp-blue)',
    yellow: 'var(--lp-yellow)',
  };

  return (
    <svg className="lp-theme04-gauges-arc" viewBox="0 0 200 120" aria-hidden="true">
      <path d={arcPath(startAngle, endAngle)} fill="none" stroke="var(--lp-surface-strong)" strokeWidth={stroke} strokeLinecap="round" />
      <path
        d={arcPath(startAngle, progressAngle)}
        fill="none"
        stroke={toneColor[tone ?? 'green']}
        strokeWidth={stroke}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 12px ${toneColor[tone ?? 'green']})` }}
      />
    </svg>
  );
}

export function Theme04GaugesV1(props: Theme04GaugesV1Props): ReactNode {
  const { kicker, title, subtitle, gauges, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-gauges">
      <div className="lp-theme04-gauges-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-gauges-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-gauges-grid lp-rise">
        {(gauges ?? []).slice(0, 3).map((g, idx) => (
          <div key={idx} className="lp-theme04-gauges-card lp-theme04-card">
            <div className="lp-theme04-gauges-chart">
              <GaugeArc value={g.value ?? 0} tone={g.tone} />
              <div className="lp-theme04-gauges-value">
                <EditableField prop={`gauges.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-gauges-value-number">{String(g.value ?? 0)}</EditableField>
                {g.unit && <EditableField prop={`gauges.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-gauges-value-unit">{g.unit}</EditableField>}
              </div>
            </div>
            <EditableField prop={`gauges.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-gauges-label">{g.label}</EditableField>
          </div>
        ))}
      </div>
    </div>
  );
}
