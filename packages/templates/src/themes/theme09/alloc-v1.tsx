// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9FormatNumber, t9Rgba, t9Tooltip, t9DataLabel, t9Emphasis } from './chart-utils.js';

export interface Theme09AllocItem {
  name?: string;
  value?: string | number;
}

export interface Theme09AllocV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Theme09AllocItem[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09AllocV1Meta: LayoutMeta = {
  id: 'theme09_alloc_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '资金用途',
  description: '环形占比 + 右侧明细列，专色分段，纸底',
  needsMedia: false,
  tags: ['chart', 'donut', 'allocation', 'part-to-whole'],
  contentShape: 'allocation',
};

export const theme09AllocV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '资金用途' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'ALLOCATION' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '24' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '分配' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '本轮资金优先投向 {{研发与产能}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '环形代表本轮融资的用途结构，右侧为逐项明细。' },
    {
      key: 'items',
      label: '用途明细',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '用途', type: 'text' },
        { key: 'value', label: '金额', type: 'text' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '万元' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_ITEMS: Theme09AllocItem[] = [
  { name: '研发投入', value: 4200 },
  { name: '产能扩建', value: 3100 },
  { name: '市场推广', value: 2400 },
  { name: '团队扩张', value: 1800 },
  { name: '战略储备', value: 1360 },
];

function buildOption(items: Theme09AllocItem[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const data = items.map((it, i) => ({
    name: it.name ?? '',
    value: t9ParseNumber(it.value),
    itemStyle: {
      color: i === 0 ? c.accent : c.series[(i + 1) % c.series.length],
      borderColor: c.surfaceSolid,
      borderWidth: 2,
    },
  }));
  return {
    tooltip: { ...t9Tooltip(c), formatter: '{b}：{c}（{d}%)' },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        data,
        label: t9DataLabel(c, 'outside', { formatter: '{d}%', fontSize: 12, fontWeight: 700 }),
        labelLine: { length: 10, length2: 10, lineStyle: { color: c.rule } },
        emphasis: t9Emphasis(c, { scale: false }),
      },
    ],
  };
}

export function Theme09AllocV1(props: Theme09AllocV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    items = [],
    unit = '万元',
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('paper');
  const list = items.length ? items : DEFAULT_ITEMS;
  const values = list.map((it) => t9ParseNumber(it.value));
  const sum = values.reduce((a, b) => a + b, 0) || 1;

  const renderTitle = (t: string): ReactNode => {
    const parts = t.split(/(\{\{[^}]+\}\})/g);
    return (
      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme09-chart-title lp-t9-serif">
        {parts.map((part, idx) => {
          const m = part.match(/^\{\{(.+)\}\}$/);
          if (m) return <em key={idx} className="lp-theme09-accent-text">{m[1]}</em>;
          return <span key={idx}>{part}</span>;
        })}
      </EditableField>
    );
  };

  return (
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-alloc">
      <T9ChartShell
        slideIdx={_slideIdx}
        editable={_editable}
        footnoteLeft={footnoteLeft}
        footnoteRight={footnoteRight}
        head={
          <T9ChartHeader
            section={section}
            sectionEn={sectionEn}
            mark={mark}
            kicker={kicker}
            slideIdx={_slideIdx}
            editable={_editable}
          />
        }
        body={
          <div
            className="lp-theme09-alloc-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 28, flex: '1 1 auto', minHeight: 0, alignItems: 'stretch' }}>
              <LpEChart type="pie" option={buildOption(list)} className="lp-theme09-chart-area" />
              <div
                style={{
                  flex: '0 0 340px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 2,
                  borderLeft: `1px solid ${c.rule}`,
                  paddingLeft: 22,
                }}
              >
                {list.map((it, i) => {
                  const v = values[i];
                  const pct = ((v / sum) * 100).toFixed(1);
                  const color = i === 0 ? c.accent : c.series[(i + 1) % c.series.length];
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 10,
                        padding: '9px 0',
                        borderBottom: i === list.length - 1 ? 'none' : `1px solid ${c.rule}`,
                      }}
                    >
                      <span style={{ width: 10, height: 10, background: color, flex: '0 0 auto', alignSelf: 'center' }} />
                      <span style={{ fontFamily: c.font, fontSize: 14, color: c.ink, flex: '1 1 auto' }}>{it.name ?? ''}</span>
                      <span style={{ fontFamily: c.fontMono, fontSize: 14, fontWeight: 700, color: c.ink }}>
                        {t9FormatNumber(v)}
                      </span>
                      <span
                        style={{
                          fontFamily: c.fontMono,
                          fontSize: 12,
                          fontWeight: 700,
                          color,
                          background: t9Rgba(color, 0.1),
                          padding: '2px 6px',
                          minWidth: 52,
                          textAlign: 'right',
                        }}
                      >
                        {pct}%
                      </span>
                    </div>
                  );
                })}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: `2px solid ${c.ink}`,
                  }}
                >
                  <span style={{ fontFamily: c.fontHeading, fontSize: 13, color: c.ink2 }}>合计（{unit}）</span>
                  <span style={{ fontFamily: c.fontMono, fontSize: 20, fontWeight: 700, color: c.accent }}>
                    {t9FormatNumber(sum)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
