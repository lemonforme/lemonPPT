// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05ChartGaugeV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  label?: string;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChartGaugeV1Meta: LayoutMeta = {
  id: 'theme05_chart_gauge_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 环形仪表盘',
  description: '单个 KPI 完成度/饱和度，中心显示数值',
  needsMedia: false,
  tags: ['chart', 'gauge', 'kpi'],
  contentShape: 'gauge',
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

export const theme05ChartGaugeV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GAUGE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '年度目标达成率' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '核心 KPI 当前完成进度' },
    { key: 'value', label: '当前值', type: 'number', inlineEditable: true, defaultValue: 78 },
    { key: 'min', label: '最小值', type: 'number', inlineEditable: true, defaultValue: 0 },
    { key: 'max', label: '最大值', type: 'number', inlineEditable: true, defaultValue: 100 },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    { key: 'label', label: '中心标签', type: 'text', inlineEditable: true, defaultValue: '达成率' },
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
};

function buildOption(value: number, min: number, max: number, scheme: string): Record<string, unknown> {
  const color = schemeColor(scheme);
  const done = Math.max(0, Math.min(value - min, max - min));
  const remain = Math.max(0, max - value);

  return {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['50%', '55%'],
        startAngle: 90,
        label: { show: false },
        emphasis: { scale: false },
        data: [
          {
            value: done,
            name: '已完成',
            itemStyle: { color, borderRadius: 4 },
          },
          {
            value: remain,
            name: '未完成',
            itemStyle: { color: 'var(--lp-surface-strong)', borderRadius: 4 },
          },
        ],
        animationDuration: 800,
        animationEasing: 'cubicOut',
      },
    ],
  };
}

export function Theme05ChartGaugeV1(props: Theme05ChartGaugeV1Props): ReactNode {
  const { kicker, title, subtitle, value, min = 0, max = 100, unit, label, scheme, _slideIdx, _editable } = props;
  const safeValue = Number(value) || 0;
  const safeMin = Number(min) || 0;
  const safeMax = Math.max(Number(max) || 100, safeMin + 1, safeValue);

  return (
    <div className="lp-slide lp-theme05-chart-gauge">
      <div className="lp-theme05-chart-gauge-content lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-chart-gauge-canvas lp-rise">
          <LpEChart type="pie" option={buildOption(safeValue, safeMin, safeMax, scheme || 'coral')} className="lp-theme05-chart-gauge-echart" />
          <div className="lp-theme05-chart-gauge-center">
            <div className="lp-theme05-chart-gauge-value">{safeValue}{unit ?? ''}</div>
            <div className="lp-theme05-chart-gauge-label">{label ?? '完成度'}</div>
          </div>
        </div>
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
