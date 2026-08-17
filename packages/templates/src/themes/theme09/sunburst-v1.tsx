// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Tooltip, t9Emphasis } from './chart-utils.js';

export interface Theme09SunburstItem {
  name?: string;
  value?: string | number;
  children?: Theme09SunburstItem[];
}

export interface Theme09SunburstV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  data?: Theme09SunburstItem[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09SunburstV1Meta: LayoutMeta = {
  id: 'theme09_sunburst_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '层级旭日',
  description: '三层旭日，外圈标签走细体，纸底',
  needsMedia: false,
  tags: ['chart', 'hierarchy', 'part-to-whole'],
  contentShape: 'sunburst',
};

export const theme09SunburstV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '层级旭日' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'HIERARCHY' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '18' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '结构' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本按{{梯队}}逐层收束' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '由内向外：估值梯队 → 赛道 → 代表企业。' },
    {
      key: 'data',
      label: '层级数据',
      type: 'array',
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_DATA: Theme09SunburstItem[] = [
  {
    name: '头部梯队',
    children: [
      { name: '大模型', children: [{ name: 'OpenAI', value: 40 }, { name: 'Anthropic', value: 26 }, { name: 'xAI', value: 22 }] },
      { name: '算力', children: [{ name: 'CoreWeave', value: 30 }, { name: '甲骨文', value: 18 }] },
    ],
  },
  {
    name: '成长梯队',
    children: [
      { name: '应用', children: [{ name: 'Perplexity', value: 16 }, { name: 'Cohere', value: 14 }] },
      { name: '数据', children: [{ name: 'Scale', value: 12 }, { name: 'HuggingFace', value: 10 }] },
    ],
  },
  {
    name: '早期梯队',
    children: [
      { name: '芯片', children: [{ name: 'Groq', value: 8 }, { name: 'Tenstorrent', value: 6 }] },
      { name: '工具', children: [{ name: 'LangChain', value: 5 }] },
    ],
  },
];

function buildOption(data: Theme09SunburstItem[]): Record<string, unknown> {
  const c = t9ChartColors('paper');
  const tree = data.length ? data : DEFAULT_DATA;
  const palette = c.series;
  const assignColors = (nodes: Theme09SunburstItem[], depth: number): Theme09SunburstItem[] => {
    return nodes.map((n, i) => {
      const base = {
        name: n.name,
        value: n.value != null ? Number(n.value) || 0 : undefined,
        itemStyle: { color: palette[(i + depth) % palette.length] },
      };
      if (n.children) {
        return { ...base, children: assignColors(n.children, depth + 1) };
      }
      return base;
    });
  };

  return {
    tooltip: t9Tooltip(c),
    series: [
      {
        type: 'sunburst',
        radius: ['8%', '88%'],
        center: ['50%', '50%'],
        data: assignColors(tree, 0),
        label: {
          color: c.ink,
          fontFamily: c.font,
          fontSize: 12,
          minAngle: 8,
        },
        levels: [
          {},
          { r0: '8%', r: '36%', label: { rotate: 'tangential', fontSize: 13, fontWeight: 700, color: c.surfaceSolid } },
          { r0: '36%', r: '64%', label: { align: 'right', fontSize: 12, color: c.ink } },
          { r0: '64%', r: '88%', label: { position: 'outside', fontSize: 11, color: c.ink2 } },
        ],
        itemStyle: { borderColor: c.surfaceSolid, borderWidth: 1.5 },
        emphasis: t9Emphasis(c, { focus: 'ancestor' }),
      },
    ],
  };
}

export function Theme09SunburstV1(props: Theme09SunburstV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    data = [],
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
    <Sheet substrate="paper" frame="chart-canvas" className="lp-theme09-sunburst">
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
          <div className="lp-theme09-sunburst-body">
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-sunburst-sub">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-sunburst-chart">
              <LpEChart type="sunburst" option={buildOption(data)} className="lp-theme09-sunburst-echart" />
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
