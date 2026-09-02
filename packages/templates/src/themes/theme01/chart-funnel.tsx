// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from './echart.js';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';

export interface Theme01ChartFunnelInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme01ChartFunnelProps {
  title?: string;
  kicker?: string;
  subtitle?: string;
  data?: Array<{ name: string; value: number }>;
  showInsight?: boolean;
  insight?: Theme01ChartFunnelInsight;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ChartFunnelMeta: LayoutMeta = {
  id: 'theme01_chart_funnel',
  theme: 'theme01',
  role: 'chart',
  displayName: 'Theme 01 漏斗图',
  description: 'ECharts 漏斗图，适合展示转化漏斗',
  needsMedia: false,
};

export const theme01ChartFunnelSchema: PropsSchema = {
  fields: [
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      itemSchema: [
    {
          key: 'name',
          label: '名称',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'value',
          label: '数值',
          type: 'number'
    }
      ]
  },
  {
      key: 'subtitle',
      label: '副标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'showInsight',
      label: '重点强调',
      type: 'boolean',
      defaultValue: true
  },
  {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '68%',
        label: '总体转化率',
        description: '从曝光到最终成交的漏斗整体转化表现稳定，关键流失集中在第二步。'
      },
      itemSchema: [
        {
          key: 'value',
          label: '主数值',
          type: 'text'
        },
        {
          key: 'label',
          label: '主数值说明',
          type: 'text'
        },
        {
          key: 'description',
          label: '解读文字',
          type: 'textarea'
        }
      ]
  },
  {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true
  }
  ]
};


export function Theme01ChartFunnel(props: Theme01ChartFunnelProps): ReactNode {
  const {
    title,
    kicker,
    subtitle,
    data = [],
    showInsight = true,
    insight,
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const colors = ['var(--lp-blue)', 'var(--lp-green)', 'var(--lp-amber)', 'var(--lp-red)', 'var(--lp-violet)'];

  const option = {
  tooltip: { trigger: 'item', formatter: '{b}: {c}' },
  color: colors,
  series: [
      {
    type: 'funnel',
    left: hasInsight ? '2%' : '10%',
    top: 10,
    bottom: 10,
    width: hasInsight ? '55%' : '80%',
    min: 0,
    max: data.length ? Math.max(...data.map((d) => d.value)) : 100,
    minSize: '0%',
    maxSize: '100%',
    sort: 'descending',
    gap: 3,
    label: {
      show: true,
      position: 'inside',
      fontSize: 13,
      fontWeight: 800,
      color: '#fff',
      textShadowColor: 'rgba(0,0,0,0.22)',
      textShadowBlur: 5,
      formatter: '{b}\n{c}',
    },
    labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
    itemStyle: { borderColor: 'rgba(255,255,255,0.85)', borderWidth: 2, shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.12)', shadowOffsetY: 4 },
    emphasis: {
      label: { fontSize: 15, fontWeight: 900 },
      itemStyle: {
        shadowBlur: 24,
        shadowColor: 'rgba(0,0,0,0.22)',
        shadowOffsetY: 6,
        borderWidth: 2.5,
        borderColor: 'rgba(255,255,255,0.95)',
      },
    },
    animationDuration: 900,
    animationEasing: 'cubicOut',
    data: data.map((d, i) => ({
      ...d,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: colors[i % colors.length] },
            { offset: 1, color: colors[i % colors.length] + '80' }
          ]
        }
      }
    })),
      },
  ],
  };

  return (
    <Sheet substrate="tint" tint="amber" frame="chart-canvas" className={`lp-chart-v2 ${hasInsight ? 'lp-chart-v2--with-insight' : ''}`}>
      <Blob
        className="lp-chart-v2-blob"
        style={{ width: 400, height: 400, bottom: -160, right: -120, background: 'var(--lp-amber)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-chart-v2-dots"
        style={{ top: 110, left: 90, width: 220, height: 220, opacity: 0.18 }}
      />
      <Slash
        className="lp-chart-v2-slash"
        style={{ top: 130, right: 110, height: 70, background: 'var(--lp-red)', opacity: 0.45 }}
      />
      <Ring
        className="lp-chart-v2-ring"
        style={{ bottom: 130, left: 110, width: 64, height: 64, borderColor: 'var(--lp-blue)' }}
      />
      <Plus
        className="lp-chart-v2-plus"
        style={{ top: 140, right: 120, width: 28, height: 28, color: 'var(--lp-green)' }}
      />

      <div className="lp-chart-header lp-rise">
        {kicker && (
          <div className="lp-chart-kicker">
            <Pill variant="fill" color="amber">{kicker}</Pill>
          </div>
        )}
        <Headline
          cn={title || '转化漏斗'}
          en={subtitle}
          size="large"
          slideIdx={_slideIdx}
          editable={_editable}
          propCn="title"
          propEn="subtitle"
          className="lp-chart-headline"
        />
      </div>

      <div className={`lp-chart-body ${hasInsight ? 'lp-chart-body--with-insight' : ''} lp-rise`}>
        <div className="lp-chart-wrapper lp-echart-wrapper">
          <LpEChart type="funnel" option={option} />
        </div>
        {hasInsight && (
          <div className="lp-chart-insight lp-chart-insight--funnel">
            {(insight.value || insight.label) && (
              <div className="lp-chart-insight-head">
                {insight.value && (
                  <EditableField
                    prop="insight.value"
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="div"
                    className="lp-chart-insight-headline"
                  >
                    {insight.value}
                  </EditableField>
                )}
                {insight.label && (
                  <EditableField
                    prop="insight.label"
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="div"
                    className="lp-chart-insight-subheadline"
                  >
                    {insight.label}
                  </EditableField>
                )}
              </div>
            )}
            {insight.description && (
              <EditableField
                prop="insight.description"
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-chart-insight-description"
              >
                {insight.description}
              </EditableField>
            )}
          </div>
        )}
      </div>

      {footnote && (
        <div className="lp-chart-footer lp-rise">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-chart-footnote">
            {footnote}
          </EditableField>
        </div>
      )}

      <Folio
        left="CHART"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
