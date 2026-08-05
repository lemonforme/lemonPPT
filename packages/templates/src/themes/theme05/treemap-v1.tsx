// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme05TreemapV1Item {
  name: string;
  value: number;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05TreemapV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme05TreemapV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05TreemapV1Meta: LayoutMeta = {
  id: 'theme05_treemap_v1',
  theme: 'theme05',
  role: 'chart',
  displayName: 'Theme 05 光谱树图',
  description: '全屏矩形树图展示资金或赛道版图',
  needsMedia: false,
  tags: ['chart', 'treemap', 'spectrum', 'proportion'],
  contentShape: 'treemap-chart',
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

export const theme05TreemapV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'TREEMAP' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 赛道融资版图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '矩形面积代表该赛道年度融资总额' },
    {
      key: 'items',
      label: '树图数据',
      type: 'array',
      minItems: 2,
      maxItems: 16,
      defaultValue: [
        { name: '大模型', value: 420, scheme: 'coral' },
        { name: 'AI 基础设施', value: 310, scheme: 'amber' },
        { name: '企业智能体', value: 240, scheme: 'teal' },
        { name: '具身智能', value: 180, scheme: 'indigo' },
        { name: 'AI 安全', value: 120, scheme: 'violet' },
        { name: '垂直应用', value: 95, scheme: 'coral' },
        { name: '开发者工具', value: 70, scheme: 'amber' },
        { name: '硬件算力', value: 55, scheme: 'teal' },
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
  ],
};

function buildOption(items: Theme05TreemapV1Item[]): Record<string, unknown> {
  const sorted = [...items].filter((item) => item != null && !!item.name).sort((a, b) => (b.value || 0) - (a.value || 0));

  const data = sorted.map((item) => ({
    name: item.name,
    value: item.value || 0,
    itemStyle: {
      color: schemeColor(item.scheme),
      borderColor: 'var(--lp-bg)',
      borderWidth: 2,
      borderRadius: 4,
    },
  }));

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `<div style="font-weight:700;margin-bottom:4px">${params.name}</div>${params.value}`,
    },
    series: [
      {
        type: 'treemap',
        width: '100%',
        height: '100%',
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: '{b}\n{c}',
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--lp-text-inverse)',
          fontFamily: 'var(--lp-font)',
        },
        itemStyle: {
          borderColor: 'var(--lp-bg)',
          borderWidth: 2,
          gapWidth: 2,
          borderRadius: 4,
        },
        data,
        animationDuration: 800,
      },
    ],
  };
}

export function Theme05TreemapV1(props: Theme05TreemapV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;

  const validItems = (items || []).filter((item) => item != null && !!item.name);

  return (
    <div className="lp-slide lp-theme05-treemap">
      <div className="lp-theme05-treemap-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme05-treemap-body lp-rise">
        {validItems.length > 0 ? (
          <LpEChart type="treemap" option={buildOption(validItems)} className="lp-theme05-treemap-echart" />
        ) : (
          <div className="lp-theme05-treemap-empty">请配置树图数据</div>
        )}
      </div>

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
