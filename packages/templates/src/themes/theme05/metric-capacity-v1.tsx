// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05MetricCapacityV1Item {
  name: string;
  value: number;
  max?: number;
  unit?: string;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05MetricCapacityV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme05MetricCapacityV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05MetricCapacityV1Meta: LayoutMeta = {
  id: 'theme05_metric_capacity_v1',
  theme: 'theme05',
  role: 'metric',
  displayName: 'Theme 05 产能/容量进度',
  description: '多个进度条展示产能、容量或完成度',
  needsMedia: false,
  tags: ['metric', 'capacity', 'progress'],
  contentShape: 'metric',
};

export const theme05MetricCapacityV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CAPACITY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '产能利用率对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '各业务线当前产能与目标产能对比' },
    {
      key: 'items',
      label: '容量项',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { name: '云端算力', value: 78, max: 100, unit: '%', scheme: 'coral' },
        { name: '存储资源', value: 62, max: 100, unit: '%', scheme: 'amber' },
        { name: '网络带宽', value: 45, max: 100, unit: '%', scheme: 'teal' },
        { name: '人力投入', value: 91, max: 100, unit: '%', scheme: 'indigo' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '当前值', type: 'number' },
        { key: 'max', label: '最大值', type: 'number' },
        { key: 'unit', label: '单位', type: 'text' },
        {
          key: 'scheme',
          label: '强调色',
          type: 'select',
          defaultValue: 'coral',
          options: [
            { value: 'coral', label: '珊瑚红' },
            { value: 'amber', label: '琥珀黄' },
            { value: 'teal', label: '青绿' },
            { value: 'indigo', label: '靛蓝' },
            { value: 'violet', label: '紫罗兰' },
          ],
        },
      ],
    },
  ],
};

function schemeColor(scheme?: string): string {
  switch (scheme) {
    case 'amber': return 'var(--lp-amber)';
    case 'teal': return 'var(--lp-teal)';
    case 'indigo': return 'var(--lp-indigo)';
    case 'violet': return 'var(--lp-violet)';
    case 'coral':
    default: return 'var(--lp-accent)';
  }
}

export function Theme05MetricCapacityV1(props: Theme05MetricCapacityV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-metric-capacity">
      {kicker && <div className="lp-theme05-kicker lp-rise">{kicker}</div>}
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title lp-rise">{title}</EditableField>
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle lp-rise">{subtitle}</EditableField>
      )}
      <div className="lp-theme05-metric-capacity-list">
        {items.map((item, i) => {
          const max = typeof item.max === 'number' && item.max > 0 ? item.max : 100;
          const value = typeof item.value === 'number' ? item.value : 0;
          const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
          return (
            <div key={i} className="lp-theme05-metric-capacity-item lp-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-theme05-metric-capacity-head">
                <EditableField prop={`items.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-metric-capacity-name">{item.name}</EditableField>
                <div className="lp-theme05-metric-capacity-number">
                  <EditableField prop={`items.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{String(value)}</EditableField>
                  {item.unit && <EditableField prop={`items.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{item.unit}</EditableField>}
                </div>
              </div>
              <div className="lp-theme05-metric-capacity-track">
                <div
                  className="lp-theme05-metric-capacity-fill"
                  style={{ width: `${pct}%`, background: schemeColor(item.scheme) }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
