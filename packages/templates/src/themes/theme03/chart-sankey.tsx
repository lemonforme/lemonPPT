// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartSankeyItem {
  source?: string;
  target?: string;
  value?: number;
}

export interface Theme03ChartSankeyProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  data?: Theme03ChartSankeyItem[];
  showInsight?: boolean;
  insight?: {
    value?: string;
    label?: string;
    description?: string;
  };
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartSankeyMeta: LayoutMeta = {
  id: 'theme03_chart_sankey',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风桑基图',
  description: '流量、资金或转化路径桑基图',
  needsMedia: false,
  tags: ['chart', 'sankey', 'flow'],
  contentShape: 'sankey-chart',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartSankeySchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '流量路径' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '15' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '用户旅程 · 单位：人' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{桑基图}}：用户从访问到成交的流转' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'data',
      label: '路径数据',
      type: 'array',
      minItems: 2,
      maxItems: 24,
      itemSchema: [
        { key: 'source', label: '来源', type: 'text' },
        { key: 'target', label: '去向', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
      ],
    },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '16%',
        label: '整体成交转化率',
        description: '从访问到成交的链路较长，支付到成交环节接近无流失，注册到支付仍有提升空间。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-sankey-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

function buildOption(data: Theme03ChartSankeyItem[]): Record<string, unknown> {
  const validData = data.filter((d) => d != null && d.source != null && d.target != null);
  const nodeNames = Array.from(new Set(validData.flatMap((d) => [d.source, d.target])));
  const nodes = nodeNames.map((name, index) => ({
    name,
    itemStyle: { color: index === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(index - 1) % NEUTRAL_COLORS.length] },
  }));
  const links = validData.map((d) => ({ source: d.source, target: d.target, value: d.value ?? 0 }));

  return {
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [
      {
        type: 'sankey',
        layout: 'none',
        emphasis: { focus: 'adjacency' },
        data: nodes,
        links,
        lineStyle: { color: 'gradient', curveness: 0.5 },
        label: { fontSize: 12, fontWeight: 600, color: 'var(--lp-ink2)' },
        itemStyle: { borderColor: 'var(--lp-bg)', borderWidth: 1, borderRadius: 4 },
      },
    ],
  };
}

export function Theme03ChartSankey(props: Theme03ChartSankeyProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    data = [],
    showInsight = true,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validData = (data || []).filter((d) => d != null && d.source != null && d.target != null);
  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme03-chart-sankey">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-chart-sankey-main">
        <div className="lp-theme03-chart-sankey-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-sankey-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className={`lp-theme03-chart-sankey-body ${hasInsight ? 'lp-theme03-chart-sankey-body--insight' : ''} lp-rise`}>
          <div className="lp-theme03-chart-sankey-chart-wrap">
            {validData.length > 0 ? (
              <LpEChart type="sankey" option={buildOption(validData)} className="lp-theme03-chart-sankey-echart" />
            ) : (
              <div className="lp-theme03-chart-sankey-empty">请配置桑基图路径数据</div>
            )}
          </div>

          {hasInsight && (
            <div className="lp-theme03-chart-sankey-insight lp-rise">
              {(insight.value || insight.label) && (
                <div className="lp-theme03-chart-sankey-insight-headline">
                  {insight.value && (
                    <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-sankey-insight-value">{insight.value}</EditableField>
                  )}
                  {insight.label && (
                    <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-sankey-insight-sub">{insight.label}</EditableField>
                  )}
                </div>
              )}
              {insight.description && (
                <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-sankey-insight-desc">{insight.description}</EditableField>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
