// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05ChartShareV1Item {
  name: string;
  value: number;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05ChartShareV1Conclusion {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme05ChartShareV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme05ChartShareV1Item[];
  showConclusion?: boolean;
  conclusion?: Theme05ChartShareV1Conclusion;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05ChartShareV1Meta: LayoutMeta = {
  id: 'theme05_chart_share_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 占比饼图',
  description: '饼图 + 底部图例 + 结论区',
  needsMedia: false,
  tags: ['chart', 'share', 'pie', 'distribution'],
  contentShape: 'pie-legend-insight',
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

export const theme05ChartShareV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SHARE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '市场占比分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '头部企业与长尾玩家的份额对比' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    {
      key: 'items',
      label: '分类数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { name: '头部企业', value: 42, scheme: 'coral' },
        { name: '成长型企业', value: 28, scheme: 'amber' },
        { name: '初创企业', value: 18, scheme: 'teal' },
        { name: '其他', value: 12, scheme: 'indigo' },
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
        value: '42%',
        label: '头部企业市占率',
        description: '头部企业占据超过四成市场份额，行业集中度持续提升。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '主数值说明', type: 'text', inlineEditable: true },
        { key: 'description', label: '解读文字', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

function buildOption(items: Theme05ChartShareV1Item[]): Record<string, unknown> {
  const total = items.reduce((sum, item) => sum + (item.value || 0), 0);
  const data = items.map((item) => ({
    value: item.value,
    name: item.name,
    itemStyle: {
      color: schemeColor(item.scheme),
      borderColor: 'var(--lp-bg)',
      borderWidth: 3,
      borderRadius: 4,
    },
  }));

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const pct = total > 0 ? Math.round((params.value / total) * 1000) / 10 : 0;
        return `<div style="font-weight:700;margin-bottom:4px">${params.name}</div>${params.value} (${pct}%)`;
      },
    },
    legend: {
      bottom: 0,
      icon: 'circle',
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: 'var(--lp-ink2)',
        fontSize: 13,
        fontWeight: 600,
        fontFamily: 'var(--lp-font)',
      },
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: 'var(--lp-bg)',
          borderWidth: 3,
          borderRadius: 4,
        },
        label: { show: false },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 16,
            shadowColor: 'var(--lp-shadow-rgb)',
          },
        },
        data,
        animationType: 'scale',
        animationEasing: 'cubicOut',
        animationDuration: 800,
      },
    ],
  };
}

export function Theme05ChartShareV1(props: Theme05ChartShareV1Props): ReactNode {
  const { kicker, title, subtitle, unit, items = [], showConclusion = true, conclusion, _slideIdx, _editable } = props;

  const validItems = (items || []).filter((item) => item != null && !!item.name);
  const hasData = validItems.length > 0;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme05-chart-share">
      <div className="lp-theme05-chart-share-main lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme05-chart-share-canvas lp-rise">
          {hasData ? (
            <LpEChart type="pie" option={buildOption(validItems)} className="lp-theme05-chart-share-echart" />
          ) : (
            <div className="lp-theme05-chart-share-empty">请配置分类数据</div>
          )}
        </div>
      </div>
      <div className="lp-theme05-chart-share-aside lp-rise">
        {unit && (
          <div className="lp-theme05-card">
            <div className="lp-theme05-card-label">单位</div>
            <div className="lp-theme05-card-value" style={{ fontSize: 'var(--lp-font-size-h3)' }}>{unit}</div>
          </div>
        )}
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
