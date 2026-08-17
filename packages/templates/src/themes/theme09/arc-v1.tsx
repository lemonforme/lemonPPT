// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

// 弧线连接图：纯 SVG 实现，避免 echarts graph+cartesian2d 在 SVG 渲染器中的裁切 bug。
// 节点沿基线均匀排布，弧线在上方跨接，枢纽用朱砂标出。

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet } from './shared.js';
import { T9ChartHeader, T9ChartShell } from './chart-frame.js';
import { t9ChartColors, t9Rgba } from './chart-utils.js';

export interface Theme09ArcNode {
  name?: string;
}

export interface Theme09ArcLink {
  source?: string;
  target?: string;
}

export interface Theme09ArcV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  nodes?: Theme09ArcNode[];
  links?: Theme09ArcLink[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ArcV1Meta: LayoutMeta = {
  id: 'theme09_arc_v1',
  theme: 'theme09',
  role: 'chart',
  displayName: '弧线网络',
  description: '单轴弧线连接图，节点排布于基线，弧线在上方跨接，枢纽用朱砂，墨底',
  needsMedia: false,
  tags: ['chart', 'network', 'arc', 'relationship'],
  contentShape: 'arc-diagram',
};

export const theme09ArcV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目名', type: 'text', inlineEditable: true, defaultValue: '链路图谱' },
    { key: 'sectionEn', label: '栏目英文名', type: 'text', inlineEditable: true, defaultValue: 'ARC' },
    { key: 'mark', label: '右上角标记', type: 'text', inlineEditable: true, defaultValue: '28' },
    { key: 'kicker', label: '导语标签', type: 'text', inlineEditable: true, defaultValue: '跨接' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一条基线上的{{跨层}}联结' },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '弧线跨度越大，说明两端环节的协同距离越远；朱砂点为枢纽。',
    },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      itemSchema: [{ key: 'name', label: '名称', type: 'text' }],
    },
    {
      key: 'links',
      label: '连接',
      type: 'array',
      itemSchema: [
        { key: 'source', label: '起点', type: 'text' },
        { key: 'target', label: '终点', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

const DEFAULT_NODES: Theme09ArcNode[] = [
  { name: '基础设施' },
  { name: '算力' },
  { name: '模型' },
  { name: '应用' },
];

const DEFAULT_LINKS: Theme09ArcLink[] = [
  { source: '基础设施', target: '模型' },
  { source: '算力', target: '应用' },
  { source: '基础设施', target: '应用' },
  { source: '算力', target: '模型' },
];

/** 纯 SVG 弧线图组件，不依赖 echarts */
function ArcSvg({ nodes, links }: { nodes: Theme09ArcNode[]; links: Theme09ArcLink[] }): ReactNode {
  const c = t9ChartColors('ink');
  const ns = nodes.length ? nodes : DEFAULT_NODES;
  const ls = links.length ? links : DEFAULT_LINKS;
  const names = ns.map((n, i) => n.name ?? `节点${i + 1}`);
  const count = names.length;

  // 找枢纽（度数最高）
  const degree: number[] = names.map(() => 0);
  const arcList: { s: number; t: number }[] = [];
  ls.forEach((l) => {
    const a = names.indexOf(l.source ?? '');
    const b = names.indexOf(l.target ?? '');
    if (a < 0 || b < 0 || a === b) return;
    degree[a]++;
    degree[b]++;
    if (a < b) arcList.push({ s: a, t: b });
    else arcList.push({ s: b, t: a });
  });

  let hub = 0;
  for (let i = 1; i < count; i++) if (degree[i] > degree[hub]) hub = i;

  // SVG 尺寸
  const w = 560;
  const h = 180;
  const padL = 40;
  const padR = 40;
  const padT = 20;
  const padB = 36;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const baseY = padT + plotH * 0.6; // 节点在 60% 高度处

  // 节点 x 坐标（均匀分布）
  const xPos = (i: number): number => padL + (count <= 1 ? plotW / 2 : (plotW * i) / (count - 1));

  // 弧线路径：二次贝塞尔，控制点高度与跨度成正比
  const arcPath = (s: number, t: number): string => {
    const x1 = xPos(s);
    const x2 = xPos(t);
    const mx = (x1 + x2) / 2;
    const span = Math.abs(x2 - x1);
    const cy = baseY - span * 0.45; // 控制点越高，弧线越弯
    return `M ${x1} ${baseY} Q ${mx} ${cy} ${x2} ${baseY}`;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%' }}>
      {/* 弧线 */}
      {arcList.map((a, idx) => {
        const isHubArc = a.s === hub || a.t === hub;
        const color = isHubArc ? c.accent : c.series[a.s % c.series.length];
        return (
          <path
            key={`arc-${idx}`}
            d={arcPath(a.s, a.t)}
            fill="none"
            stroke={t9Rgba(color, 0.55)}
            strokeWidth={isHubArc ? 2.4 : 1.5}
            opacity={0.9}
          />
        );
      })}

      {/* 节点 */}
      {names.map((name, i) => {
        const isHub = i === hub;
        const color = isHub ? c.accent : c.series[i % c.series.length];
        const x = xPos(i);
        const r = isHub ? 11 : 8 + Math.min(degree[i], 3) * 1.5;
        return (
          <g key={`node-${i}`}>
            <circle cx={x} cy={baseY} r={r} fill={color} stroke={c.surfaceSolid} strokeWidth={1.5} />
            {isHub ? <circle cx={x} cy={baseY} r={r + 4} fill="none" stroke={t9Rgba(c.accent, 0.3)} strokeWidth={1} /> : null}
            <text
              x={x}
              y={baseY + r + 14}
              textAnchor="middle"
              fill={isHub ? c.accent : c.ink2}
              fontFamily={c.font}
              fontSize={12}
              fontWeight={isHub ? 700 : 400}
            >
              {name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function Theme09ArcV1(props: Theme09ArcV1Props): ReactNode {
  const {
    section,
    sectionEn,
    mark,
    kicker,
    title,
    subtitle,
    nodes = [],
    links = [],
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
    <Sheet substrate="ink" frame="chart-canvas" className="lp-theme09-arc">
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
            className="lp-theme09-arc-body"
            style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, gap: '8px' }}
          >
            {subtitle && (
              <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme09-chart-subtitle">
                {subtitle}
              </EditableField>
            )}
            {title && renderTitle(title || '')}
            <div className="lp-theme09-chart-area" style={{ flex: '1 1 auto', minHeight: 0 }}>
              <ArcSvg nodes={nodes} links={links} />
            </div>
          </div>
        }
      />
    </Sheet>
  );
}
