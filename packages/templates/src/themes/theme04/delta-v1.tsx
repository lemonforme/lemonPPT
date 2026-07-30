// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04DeltaV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  value: string;
  unit?: string;
  label?: string;
  delta: string;
  deltaLabel?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04DeltaV1Meta: LayoutMeta = {
  id: 'theme04_delta_v1',
  theme: 'theme04',
  role: 'metric',
  displayName: 'Theme 04 增长指标页',
  description: '大字号核心数值 + 增长箭头/百分比 + 说明',
  needsMedia: false,
  tags: ['metric', 'growth', 'delta', 'candy'],
  contentShape: 'title-metric',
};

export const theme04DeltaV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '增长指标' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'Q4 融资总额{{显著增长}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '环比增速创全年新高' },
    { key: 'value', label: '数值', type: 'text', inlineEditable: true, defaultValue: '412' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    { key: 'label', label: '数值说明', type: 'text', inlineEditable: true, defaultValue: 'Q4 季度总额' },
    { key: 'delta', label: '变化量', type: 'text', inlineEditable: true, defaultValue: '+41%' },
    { key: 'deltaLabel', label: '变化说明', type: 'text', inlineEditable: true, defaultValue: '环比增长' },
    { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-delta-title lp-rise">
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

function DeltaArrow({ delta }: { delta: string }): ReactNode {
  const direction = delta.startsWith('-') ? 'down' : 'up';
  return (
    <span className={`lp-theme04-delta-arrow lp-theme04-delta-arrow--${direction}`} aria-hidden="true">
      {direction === 'up' ? '▲' : '▼'}
    </span>
  );
}

export function Theme04DeltaV1(props: Theme04DeltaV1Props): ReactNode {
  const { kicker, title, subtitle, value, unit, label, delta, deltaLabel, tone, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-delta">
      <div className="lp-theme04-delta-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-delta-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-delta-main lp-rise">
        <div className={`lp-theme04-delta-card lp-theme04-card ${toneClass[tone ?? 'green'] || ''}`}>
          <div className="lp-theme04-delta-value-row">
            <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-delta-value">{value}</EditableField>
            {unit && <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-delta-unit">{unit}</EditableField>}
          </div>
          {label && (
            <EditableField prop="label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-delta-label">{label}</EditableField>
          )}
        </div>

        <div className="lp-theme04-delta-change">
          <DeltaArrow delta={delta || ''} />
          <EditableField prop="delta" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-delta-change-value">{delta}</EditableField>
          {deltaLabel && (
            <EditableField prop="deltaLabel" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-delta-change-label">{deltaLabel}</EditableField>
          )}
        </div>
      </div>
    </div>
  );
}
