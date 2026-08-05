// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05ChartFunnelV1Stage {
  name: string;
  value: number;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05ChartFunnelV1Conclusion {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme05ChartFunnelV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  stages?: Theme05ChartFunnelV1Stage[];
  showConclusion?: boolean;
  conclusion?: Theme05ChartFunnelV1Conclusion;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChartFunnelV1Meta: LayoutMeta = {
  id: 'theme05_chart_funnel_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 漏斗图',
  description: '漏斗图展示逐层转化，右侧结论区',
  needsMedia: false,
  tags: ['chart', 'funnel', 'conversion'],
  contentShape: 'funnel-insight',
};

const schemeMap: Record<string, string> = {
  coral: '#E85D4E',
  amber: '#F5A623',
  teal: '#0FA3B1',
  indigo: '#4A58D9',
  violet: '#7C3AED',
};

function schemeColor(scheme?: string): string {
  return schemeMap[scheme || 'coral'] || schemeMap.coral;
}

export const theme05ChartFunnelV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CONVERSION' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从曝光到成交的转化漏斗' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '每一层的流失都代表可优化的空间' },
    {
      key: 'stages',
      label: '漏斗层级',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { name: '曝光', value: 100000, scheme: 'coral' },
        { name: '点击', value: 42000, scheme: 'amber' },
        { name: '访问', value: 18000, scheme: 'teal' },
        { name: '线索', value: 5600, scheme: 'indigo' },
        { name: '成交', value: 1200, scheme: 'violet' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number', inlineEditable: true },
        {
          key: 'scheme',
          label: '强调色',
          type: 'select',
          defaultValue: 'coral',
          options: [
            { value: 'coral', label: '珊瑚' },
            { value: 'amber', label: '琥珀' },
            { value: 'teal', label: '青绿' },
            { value: 'indigo', label: '靛蓝' },
            { value: 'violet', label: '紫罗兰' },
          ],
        },
      ],
    },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: {
        value: '1.2%',
        label: '最终成交转化率',
        description: '从曝光到成交的整体转化率偏低，需重点优化访问到线索环节。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '主数值说明', type: 'text', inlineEditable: true },
        { key: 'description', label: '解读文字', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

function buildOption(stages: Theme05ChartFunnelV1Stage[]): Record<string, unknown> {
  const data = stages.map((stage) => ({
    value: stage.value,
    name: stage.name,
    itemStyle: { color: schemeColor(stage.scheme) },
  }));

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `<div style="font-weight:700;margin-bottom:4px">${params.name}</div>${params.value}`,
    },
    series: [
      {
        type: 'funnel',
        top: '8%',
        bottom: '8%',
        left: '8%',
        width: '70%',
        min: 0,
        max: Math.max(...stages.map((s) => s.value || 0), 1),
        gap: 4,
        label: {
          show: true,
          position: 'inside',
          fontSize: 13,
          fontWeight: 700,
          color: '#fff',
          formatter: '{b}\n{c}',
        },
        labelLine: { show: false },
        itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 2 },
        emphasis: {
          label: { fontSize: 15 },
        },
        data,
        animationDuration: 800,
        animationEasing: 'cubicOut',
      },
    ],
  };
}

export function Theme05ChartFunnelV1(props: Theme05ChartFunnelV1Props): ReactNode {
  const { kicker, title, subtitle, stages = [], showConclusion = true, conclusion, _slideIdx, _editable } = props;

  const validStages = (stages || []).filter((s) => s != null && !!s.name).slice(0, 8);
  const hasData = validStages.length > 0;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme05-chart-funnel">
      <div className="lp-theme05-chart-funnel-main lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-chart-funnel-canvas lp-rise">
          {hasData ? (
            <LpEChart type="funnel" option={buildOption(validStages)} className="lp-theme05-chart-funnel-echart" />
          ) : (
            <div className="lp-theme05-chart-funnel-empty">请配置漏斗层级数据</div>
          )}
        </div>
      </div>
      <div className="lp-theme05-chart-funnel-aside lp-rise">
        {hasConclusion && (
          <div className="lp-theme05-conclusion">
            {conclusion!.value && <div className="lp-theme05-conclusion-value"><EditableField prop="conclusion.value" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.value}</EditableField></div>}
            {conclusion!.label && <div className="lp-theme05-conclusion-label"><EditableField prop="conclusion.label" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.label}</EditableField></div>}
            {conclusion!.description && <div className="lp-theme05-conclusion-description"><EditableField prop="conclusion.description" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.description}</EditableField></div>}
          </div>
        )}
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
