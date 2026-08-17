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

export interface Theme09FunnelStage {
  name?: string;
  value?: string | number;
}

export interface Theme09FunnelV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  stages?: Theme09FunnelStage[];
  unit?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09FunnelV1Meta: LayoutMeta = {
  id: 'theme09_funnel_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '转化漏斗',
  description: '分层漏斗 + 每层转化率挂栏，首层朱砂，墨底',
  needsMedia: false,
  tags: ['chart', 'funnel', 'conversion'],
  contentShape: 'funnel',
};

export const theme09FunnelV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '转化链路' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'FUNNEL' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '19' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '漏斗' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '每一层都在{{筛掉}}一半人' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '以曝光量为基数 100，逐层折损；括注为向下一层的转化率。',
    },
    {
      key: 'stages',
      label: '漏斗层级',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '层级名', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '指数' },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_STAGES: Theme09FunnelStage[] = [
  { name: '曝光', value: 100 },
  { name: '点击', value: 62 },
  { name: '留资', value: 38 },
  { name: '成交', value: 21 },
];

function buildOption(stages: Theme09FunnelStage[]): Record<string, unknown> {
  const c = t9ChartColors('ink');
  const ss = stages.length ? stages : DEFAULT_STAGES;

  const data = ss.map((s, i) => {
    const v = t9ParseNumber(s.value);
    const name = s.name ?? `层级 ${i + 1}`;
    const isLast = i === ss.length - 1;
    const next = isLast ? 0 : t9ParseNumber(ss[i + 1].value);
    const rate = !isLast && v > 0 ? Math.round((next / v) * 100) : 0;
    const head = `${name}   ${t9FormatNumber(v)}`;
    const text = isLast ? head : `${head}\n↓ 转化 ${rate}%`;
    return {
      name,
      value: v,
      itemStyle: {
        color: i === 0 ? c.accent : c.series[(i + 1) % c.series.length],
        borderColor: c.surfaceSolid,
        borderWidth: 2,
        opacity: 1 - i * 0.04,
      },
      // 预先算好字面量：option 经 JSON 序列化，函数式 formatter 会被丢弃。
      label: t9DataLabel(c, 'inside', {
        formatter: text,
        color: c.onAccent,
        fontFamily: c.font,
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 18,
        align: 'center',
      }),
    };
  });

  return {
    tooltip: t9Tooltip(c),
    series: [
      {
        type: 'funnel',
        left: '8%',
        right: '18%',
        top: 8,
        bottom: 8,
        minSize: '32%',
        maxSize: '96%',
        sort: 'descending',
        gap: 8,
        funnelAlign: 'center',
        labelLine: { show: false },
        emphasis: t9Emphasis(c, { label: { fontSize: 17 } }),
        itemStyle: { shadowBlur: 10, shadowColor: t9Rgba(c.ink, 0.12) },
        data,
      },
    ],
  };
}

export function Theme09FunnelV1(props: Theme09FunnelV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    stages = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-funnel">
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
            className="lp-theme09-funnel-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="funnel" option={buildOption(stages)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
