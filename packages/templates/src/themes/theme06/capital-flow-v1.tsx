// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06CapitalFlowV1Node {
  name: string;
}

export interface Theme06CapitalFlowV1Link {
  source?: string;
  target?: string;
  value?: number;
}

export interface Theme06CapitalFlowV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  nodes?: Theme06CapitalFlowV1Node[];
  links?: Theme06CapitalFlowV1Link[];
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CapitalFlowV1Meta: LayoutMeta = {
  id: 'theme06_capital_flow_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 资本流向',
  description: '桑基图展示资本从来源到去向的流向',
  needsMedia: true,
  tags: ['capital', 'flow', 'sankey', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06CapitalFlowV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CAPITAL FLOW' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本流向图谱' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从资金来源到赛道配置的完整链路' },
    {
      key: 'nodes',
      label: '节点',
      type: 'array',
      minItems: 4,
      maxItems: 16,
      defaultValue: [
        { name: 'VC 基金' },
        { name: 'PE 基金' },
        { name: '战略投资' },
        { name: '基础模型' },
        { name: '基础设施' },
        { name: '应用层' },
      ],
      itemSchema: [{ key: 'name', label: '名称', type: 'text' }],
    },
    {
      key: 'links',
      label: '流向',
      type: 'array',
      minItems: 3,
      maxItems: 24,
      defaultValue: [
        { source: 'VC 基金', target: '基础模型', value: 45 },
        { source: 'VC 基金', target: '应用层', value: 25 },
        { source: 'PE 基金', target: '基础设施', value: 30 },
        { source: 'PE 基金', target: '基础模型', value: 20 },
        { source: '战略投资', target: '基础设施', value: 18 },
        { source: '战略投资', target: '应用层', value: 12 },
      ],
      itemSchema: [
        { key: 'source', label: '来源', type: 'text' },
        { key: 'target', label: '去向', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '基础模型与基础设施吸纳了超过六成的资本，应用层仍在验证规模化路径。' },
  ],
};

function buildOption(nodes: Theme06CapitalFlowV1Node[], links: Theme06CapitalFlowV1Link[]): Record<string, unknown> {
  const nodeNames = nodes.map((n) => n.name);
  const nodeColors = ['var(--lp-accent)', 'var(--lp-accent-2)', 'var(--lp-accent-cool)', 'var(--lp-blue)', 'var(--lp-violet)', 'var(--lp-teal)'];
  return {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border-strong)',
      textStyle: { color: 'var(--lp-ink)' },
    },
    series: [{
      type: 'sankey',
      data: nodes.map((n, index) => ({ name: n.name, itemStyle: { color: nodeColors[index % nodeColors.length] } })),
      links: links
        .filter((l) => nodeNames.includes(l.source ?? '') && nodeNames.includes(l.target ?? ''))
        .map((l) => ({ source: l.source, target: l.target, value: l.value ?? 0 })),
      emphasis: { focus: 'adjacency' },
      lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.4 },
      label: { color: 'var(--lp-ink)', fontFamily: 'var(--lp-font)', fontSize: 11 },
      top: 10, bottom: 10, left: 16, right: 80,
    }],
  };
}

export function Theme06CapitalFlowV1(props: Theme06CapitalFlowV1Props): ReactNode {
  const { kicker, title, subtitle, nodes = [], links = [], conclusion, _slideIdx, _editable } = props;
  const validNodes = (nodes || []).filter((n): n is Theme06CapitalFlowV1Node => n != null && !!n.name).slice(0, 16);
  const validLinks = (links || []).filter((l): l is Theme06CapitalFlowV1Link => l != null && !!l.source && !!l.target).slice(0, 24);

  return (
    <div className="lp-slide lp-theme06-capital-flow">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-capital-flow-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-capital-flow-body lp-rise">
        <div className="lp-theme06-capital-flow-canvas">
          {validNodes.length > 0 && validLinks.length > 0 && (
            <LpEChart type="sankey" option={buildOption(validNodes, validLinks)} />
          )}
        </div>
        {conclusion && (
          <div className="lp-theme06-capital-flow-conclusion">
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
