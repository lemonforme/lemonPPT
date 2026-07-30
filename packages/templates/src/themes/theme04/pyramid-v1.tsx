// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04PyramidV1Level {
  label: string;
  value: number;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04PyramidV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  unit?: string;
  items?: Theme04PyramidV1Level[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04PyramidV1Meta: LayoutMeta = {
  id: 'theme04_pyramid_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 估值金字塔',
  description: '漏斗/金字塔图展示分层估值或筛选漏斗',
  needsMedia: false,
  tags: ['chart', 'pyramid', 'funnel', 'candy'],
  contentShape: 'generic-chart',
};

export const theme04PyramidV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '估值金字塔' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{从赛道}}到龙头的估值分层' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '越靠近金字塔顶端，估值倍数与确定性同时抬升。' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿美元' },
    {
      key: 'items',
      label: '金字塔层级',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { label: '全市场', value: 970, description: '所有 AI 公司合计', tone: 'green' },
        { label: '头部 10%', value: 420, description: '估值前 10% 公司', tone: 'blue' },
        { label: '独角兽', value: 180, description: '估值 10 亿美元以上', tone: 'pink' },
        { label: '超级独角兽', value: 66, description: '单轮融资最大额', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'label', label: '层级名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-pyramid-title lp-rise">
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

function buildOption(items: Theme04PyramidV1Level[], unit?: string): Record<string, unknown> {
  const data = items.map((item) => ({
    value: item.value,
    name: item.label,
    itemStyle: { color: toneMap[item.tone || 'green'] },
    label: {
      show: true,
      position: 'inside',
      formatter: `{b}\n{c} ${unit || ''}`,
      color: 'var(--lp-text-inverse)',
      fontSize: 13,
      fontWeight: 700,
    },
  }));

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const item = items[params.dataIndex];
        if (!item) return '';
        return `<div style="font-weight:700;margin-bottom:4px">${item.label}</div>${item.value} ${unit || ''}${item.description ? `<br>${item.description}` : ''}`;
      },
    },
    series: [
      {
        name: '估值金字塔',
        type: 'funnel',
        left: '15%',
        top: 20,
        bottom: 20,
        width: '70%',
        min: 0,
        max: Math.max(...items.map((i) => i.value), 1),
        minSize: '10%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}\n{c}',
          color: 'var(--lp-text-inverse)',
          fontSize: 13,
          fontWeight: 700,
        },
        labelLine: { show: false },
        itemStyle: { borderColor: 'var(--lp-surface)', borderWidth: 2 },
        emphasis: {
          label: { fontSize: 15 },
        },
        data,
      },
    ],
  };
}

export function Theme04PyramidV1(props: Theme04PyramidV1Props): ReactNode {
  const { kicker, title, subtitle, unit, items, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 6);

  return (
    <div className="lp-slide lp-theme04-pyramid">
      <div className="lp-theme04-pyramid-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-pyramid-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme04-pyramid-chart lp-rise">
          <LpEChart type="funnel" option={buildOption(validItems, unit)} className="lp-theme04-pyramid-echart" />
        </div>
      )}
    </div>
  );
}
