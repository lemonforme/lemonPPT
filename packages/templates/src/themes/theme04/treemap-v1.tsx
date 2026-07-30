// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04TreemapV1Item {
  name: string;
  value: number;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
  children?: Theme04TreemapV1Item[];
}

export interface Theme04TreemapV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme04TreemapV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04TreemapV1Meta: LayoutMeta = {
  id: 'theme04_treemap_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 资金版图树状图',
  description: '矩形树状图展示赛道/地区/公司资金分布',
  needsMedia: false,
  tags: ['chart', 'treemap', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04TreemapV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '资金版图' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI 融资}}的赛道分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '面积代表融资规模，颜色区分主要赛道' },
    { key: 'unit', label: '数值单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '版图数据',
      type: 'array',
      minItems: 2,
      maxItems: 12,
      defaultValue: [
        { name: '基础模型', value: 420, tone: 'green' },
        { name: 'AI 基础设施', value: 180, tone: 'blue' },
        { name: '应用层', value: 95, tone: 'pink' },
        { name: '机器人', value: 58, tone: 'yellow' },
        { name: '自动驾驶', value: 42, tone: 'green' },
        { name: '其他', value: 35, tone: 'blue' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-treemap-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

const toneMap: Record<string, string> = {
  green: 'var(--lp-green)',
  pink: 'var(--lp-pink)',
  blue: 'var(--lp-blue)',
  yellow: 'var(--lp-yellow)',
};

function buildTreemapOption(items: Theme04TreemapV1Item[], unit?: string): Record<string, unknown> {
  return {
    series: [{
      type: 'treemap',
      width: '100%',
      height: '100%',
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      label: {
        show: true,
        formatter: `{b}\n{c} ${unit || ''}`,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'var(--lp-ink)',
      },
      itemStyle: {
        borderColor: 'var(--lp-surface-elevated)',
        borderWidth: 2,
        borderRadius: 8,
        gapWidth: 2,
      },
      data: items.map((item) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: toneMap[item.tone || 'green'],
        },
      })),
    }],
  };
}

export function Theme04TreemapV1(props: Theme04TreemapV1Props): ReactNode {
  const { kicker, title, subtitle, unit, items, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 12);

  return (
    <div className="lp-slide lp-theme04-treemap">
      <div className="lp-theme04-treemap-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-treemap-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme04-treemap-chart lp-rise">
          <LpEChart type="treemap" option={buildTreemapOption(validItems, unit)} className="lp-theme04-treemap-echart" />
        </div>
      )}
    </div>
  );
}
