// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05RadarV1Indicator {
  name: string;
  max?: number;
}

export interface Theme05RadarV1Series {
  name: string;
  values: number[];
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05RadarV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  indicators?: Theme05RadarV1Indicator[];
  series?: Theme05RadarV1Series[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05RadarV1Meta: LayoutMeta = {
  id: 'theme05_radar_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 光谱雷达图',
  description: '雷达图展示多维能力评估',
  needsMedia: false,
  tags: ['chart', 'radar', 'spectrum', 'comparison'],
  contentShape: 'radar-chart',
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

export const theme05RadarV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RADAR' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '产品能力雷达评估' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '多维度对比核心竞品能力分布' },
    {
      key: 'indicators',
      label: '维度',
      type: 'array',
      minItems: 3,
      maxItems: 10,
      defaultValue: [
        { name: '技术领先性', max: 100 },
        { name: '商业兑现', max: 100 },
        { name: '生态规模', max: 100 },
        { name: '易用性', max: 100 },
        { name: '成本效率', max: 100 },
        { name: '安全合规', max: 100 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'max', label: '最大值', type: 'number', inlineEditable: true },
      ],
    },
    {
      key: 'series',
      label: '数据系列',
      type: 'array',
      minItems: 1,
      maxItems: 5,
      defaultValue: [
        { name: '我方产品', values: [85, 72, 68, 90, 78, 82], scheme: 'coral' },
        { name: '行业平均', values: [68, 65, 75, 70, 72, 66], scheme: 'indigo' },
      ],
      itemSchema: [
        { key: 'name', label: '系列名称', type: 'text', inlineEditable: true },
        { key: 'values', label: '数值（用逗号分隔）', type: 'text', inlineEditable: true },
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
  ],
};

function parseValues(values?: number[] | string): number[] {
  if (Array.isArray(values)) return values;
  if (typeof values === 'string') {
    return values
      .split(/[,，]/)
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !Number.isNaN(v));
  }
  return [];
}

function buildOption(indicators: Theme05RadarV1Indicator[], series: Theme05RadarV1Series[]): Record<string, unknown> {
  const validIndicators = indicators
    .filter((item) => item != null && !!item.name)
    .map((item) => ({ name: item.name, max: typeof item.max === 'number' ? item.max : 100 }));

  const validSeries = series
    .filter((item) => item != null && !!item.name)
    .map((item) => {
      const color = schemeColor(item.scheme);
      return {
        value: parseValues(item.values),
        name: item.name,
        lineStyle: { width: 3, color },
        itemStyle: { color },
        areaStyle: { opacity: 0.15, color },
        symbol: 'circle',
        symbolSize: 8,
      };
    });

  return {
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 8,
      textStyle: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
      },
    },
    radar: {
      indicator: validIndicators,
      radius: '58%',
      center: ['50%', '46%'],
      splitNumber: 4,
      axisName: {
        color: 'var(--lp-ink2)',
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'var(--lp-font)',
      },
      splitLine: { lineStyle: { color: 'var(--lp-divider)' } },
      splitArea: { areaStyle: { color: ['transparent', 'var(--lp-surface)'] } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
    },
    series: [
      {
        type: 'radar',
        data: validSeries,
        animationDuration: 900,
      },
    ],
  };
}

export function Theme05RadarV1(props: Theme05RadarV1Props): ReactNode {
  const { kicker, title, subtitle, indicators = [], series = [], _slideIdx, _editable } = props;

  const validIndicators = (indicators || []).filter((item) => item != null && !!item.name);
  const validSeries = (series || []).filter((item) => item != null && !!item.name);
  const hasData = validIndicators.length > 0 && validSeries.length > 0;

  return (
    <div className="lp-slide lp-theme05-radar">
      <div className="lp-theme05-radar-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme05-radar-body lp-rise">
        {hasData ? (
          <LpEChart type="radar" option={buildOption(validIndicators, validSeries)} className="lp-theme05-radar-echart" />
        ) : (
          <div className="lp-theme05-radar-empty">请配置雷达维度与数据系列</div>
        )}
      </div>

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
