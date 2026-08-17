// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9ParseNumber, t9Rgba, t9DataLabel } from './chart-utils.js';

export interface Theme09IcicleNode {
  name?: string;
  value?: string | number;
  children?: Theme09IcicleNode[];
}

export interface Theme09IcicleV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  data?: Theme09IcicleNode[];
  levelNames?: string[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09IcicleV1Meta: LayoutMeta = {
  id: 'theme09_icicle_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '层级冰柱',
  description: '冰柱层级图，横向展开逐层收束，专色分层，纸底',
  needsMedia: false,
  tags: ['chart', 'icicle', 'hierarchy', 'breakdown'],
  contentShape: 'icicle',
};

export const theme09IcicleV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '层级冰柱' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'ICICLE' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '27' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '拆解' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '收入结构的 {{逐层拆解}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '自左向右逐层展开：业务线 → 产品 → 交付形态。' },
    {
      key: 'data',
      label: '层级数据',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    {
      key: 'levelNames',
      label: '层级名称',
      type: 'array',
      inlineEditable: true,
      defaultValue: ['业务线', '产品', '交付形态'],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_LEVELS = ['业务线', '产品', '交付形态'];

const DEFAULT_DATA: Theme09IcicleNode[] = [
  {
    name: '模型服务',
    children: [
      { name: 'API 调用', children: [{ name: '按量计费', value: 148 }, { name: '包年套餐', value: 92 }] },
      { name: '私有化部署', children: [{ name: '一体机', value: 76 }, { name: '软件授权', value: 54 }] },
    ],
  },
  {
    name: '算力服务',
    children: [
      { name: '训练集群', children: [{ name: '整柜租赁', value: 118 }, { name: '弹性算力', value: 66 }] },
      { name: '推理加速', children: [{ name: '边缘节点', value: 48 }] },
    ],
  },
  {
    name: '行业方案',
    children: [
      { name: '金融', children: [{ name: '风控智能体', value: 62 }, { name: '投研助手', value: 41 }] },
      { name: '制造', children: [{ name: '质检视觉', value: 37 }, { name: '排产优化', value: 25 }] },
    ],
  },
];

interface FlatNode {
  name: string;
  value: number;
  depth: number;
  rootIdx: number;
  order: number;
}

/** 深度遍历，计算每个节点的聚合值（父级 = 子级之和），并按「层 → 遍历序」摊平。 */
function flatten(nodes: Theme09IcicleNode[]): { flat: FlatNode[]; depth: number } {
  const flat: FlatNode[] = [];
  let maxDepth = 0;
  let counter = 0;

  const walk = (list: Theme09IcicleNode[], depth: number, rootIdx: number): number => {
    let sum = 0;
    list.forEach((n, i) => {
      const idx = depth === 0 ? i : rootIdx;
      const order = counter++;
      const entry: FlatNode = { name: n.name ?? '', value: 0, depth, rootIdx: idx, order };
      flat.push(entry);
      if (depth > maxDepth) maxDepth = depth;
      if (n.children && n.children.length) {
        entry.value = walk(n.children, depth + 1, idx);
      } else {
        entry.value = t9ParseNumber(n.value);
      }
      sum += entry.value;
    });
    return sum;
  };

  walk(nodes, 0, 0);
  return { flat, depth: maxDepth + 1 };
}

function buildOption(data: Theme09IcicleNode[], levelNames: string[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const tree = data.length ? data : DEFAULT_DATA;
  const { flat, depth } = flatten(tree);
  const total = flat.filter((n) => n.depth === 0).reduce((s, n) => s + n.value, 0) || 1;

  // 行标签：由外部传入，不足时补「第 N 层」。
  const rows = Array.from({ length: depth }, (_, i) => levelNames[i] ?? `第 ${i + 1} 层`);

  // 每个节点一个 series：仅在自身所在层贡献数值，其余层为 0，
  // 借助 stack 让子级宽度自动对齐父级（父值 = 子值之和）。
  const series = flat
    .slice()
    .sort((a, b) => (a.depth - b.depth) || (a.order - b.order))
    .map((n) => {
      const base = c.series[n.rootIdx % c.series.length];
      const alpha = n.depth === 0 ? 1 : Math.max(0.34, 0.78 - (n.depth - 1) * 0.24);
      const share = n.value / total;
      return {
        type: 'bar',
        name: `${n.name}#${n.order}`,
        stack: 'icicle',
        barWidth: '56%',
        data: rows.map((_, ri) => (ri === n.depth ? n.value : 0)),
        itemStyle: {
          color: n.depth === 0 ? base : t9Rgba(base, alpha),
          borderColor: c.surfaceSolid,
          borderWidth: 2,
        },
        label: t9DataLabel(c, 'inside', {
          show: share >= 0.045,
          formatter: share >= 0.09 ? `${n.name}\n${n.value}` : n.name,
          color: n.depth === 0 ? c.onAccent : c.ink,
          fontFamily: c.font,
          fontSize: n.depth === 0 ? 13 : 12,
          fontWeight: n.depth === 0 ? 700 : 600,
          lineHeight: 16,
          overflow: 'truncate',
        }),
        emphasis: { disabled: true },
        tooltip: { show: false },
      };
    });

  return {
    tooltip: { show: false },
    grid: { top: 8, right: 8, bottom: 8, left: 74, containLabel: false },
    xAxis: { type: 'value', show: false, max: total },
    yAxis: {
      type: 'category',
      data: rows,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: c.ink3,
        fontFamily: c.font,
        fontSize: 12,
        fontWeight: 600,
      },
    },
    series,
  };
}

export function Theme09IcicleV1(props: Theme09IcicleV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    data = [],
    levelNames = [],
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const levels = levelNames.length ? levelNames : DEFAULT_LEVELS;

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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-icicle">
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
            className="lp-theme09-icicle-body"
            style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: '1 1 auto', minHeight: 0 }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <LpEChart type="bar" option={buildOption(data, levels)} className="lp-theme09-chart-area" />
          </div>
        }
      />
    </Sheet>
  );
}
