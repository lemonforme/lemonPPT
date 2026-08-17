// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Rgba } from './chart-utils.js';

export interface Theme09StatItem {
  label?: string;
  value?: string;
  delta?: string;
}

export interface Theme09StatGridV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  stats?: Theme09StatItem[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09StatGridV1Meta: LayoutMeta = {
  id: 'theme09_stat_grid_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '关键指标',
  description: '四宫格指标卡，首格朱砂满铺强调，墨底',
  needsMedia: false,
  tags: ['chart', 'stat', 'kpi', 'grid'],
  contentShape: '4-metric-grid',
};

export const theme09StatGridV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '经营快照' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'KEY METRICS' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '05' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '指标' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '四个数看懂{{全年}}' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '口径统一为全年累计值，右下角为同比变化。',
    },
    {
      key: 'stats',
      label: '指标卡',
      type: 'array',
      minItems: 4,
      maxItems: 4,
      itemSchema: [
        { key: 'label', label: '指标名', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'delta', label: '同比', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_STATS: Theme09StatItem[] = [
  { label: '全年营收', value: '182.6亿', delta: '↑ 24.3%' },
  { label: '毛利率', value: '41.2%', delta: '↑ 3.1pt' },
  { label: '活跃客户', value: '9,480', delta: '↑ 12.7%' },
  { label: '研发投入', value: '27.4亿', delta: '↑ 31.5%' },
];

export function Theme09StatGridV1(props: Theme09StatGridV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    stats = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const c = t9ChartColors('ink');
  const list = (stats.length ? stats : DEFAULT_STATS).slice(0, 4);

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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-stat-grid">
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
            className="lp-theme09-stat-grid-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '10px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '16px',
                flex: '1 1 auto',
                minHeight: 0,
              }}
            >
              {list.map((s, i) => {
                const lead = i === 0;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '22px 24px',
                      background: lead ? c.accent : t9Rgba(c.ink, 0.04),
                      border: `1px solid ${lead ? c.accent : c.border}`,
                      minHeight: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        fontFamily: c.font,
                        fontSize: '14px',
                        letterSpacing: '.08em',
                        color: lead ? c.onAccent : c.ink3,
                      }}
                    >
                      <EditableField prop={`stats.${i}.label`} slideIdx={_slideIdx} editable={_editable} as="span">
                        {s.label ?? ''}
                      </EditableField>
                      <span style={{ fontFamily: c.fontMono, fontSize: '12px', color: lead ? c.onAccent : c.ink3, opacity: lead ? 1 : 0.7 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div
                      style={{
                        fontFamily: c.fontHeading,
                        fontWeight: 700,
                        fontSize: '62px',
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        color: lead ? c.onAccent : c.ink,
                      }}
                    >
                      <EditableField prop={`stats.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
                        {s.value ?? ''}
                      </EditableField>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        fontFamily: c.fontMono,
                        fontSize: '14px',
                        letterSpacing: '.04em',
                        color: lead ? c.onAccent : c.accent,
                      }}
                    >
                      <EditableField prop={`stats.${i}.delta`} slideIdx={_slideIdx} editable={_editable} as="span">
                        {s.delta ?? ''}
                      </EditableField>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
