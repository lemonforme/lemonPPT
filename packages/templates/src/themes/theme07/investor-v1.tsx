// lemonPPT - theme07 资本关系网络页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07InvestorV1Investor {
  name?: string;
  type?: string;
  stage?: string;
}

export interface Theme07InvestorV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  hubLabel?: string;
  hubNote?: string;
  investors?: Theme07InvestorV1Investor[];
  showLabels?: boolean;
  showAnchor?: boolean;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07InvestorV1Meta: LayoutMeta = {
  id: 'theme07_investor_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 资本关系网络',
  description: '中央资本枢纽 + 环形投资机构节点，连线呈现出资关系图谱',
  needsMedia: true,
  tags: ['investor', 'network', 'graph', 'capital'],
  contentShape: 'network',
};

export const theme07InvestorV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'INVESTORS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本关系网络' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '围绕核心资本枢纽的机构出资与联投关系图谱' },
    { key: 'hubLabel', label: '枢纽名称', type: 'text', inlineEditable: true, defaultValue: '资本' },
    { key: 'hubNote', label: '枢纽说明', type: 'text', inlineEditable: true, defaultValue: '核心枢纽' },
    {
      key: 'investors',
      label: '投资机构',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [
        { name: '启明基金', type: 'VC', stage: '多轮领投' },
        { name: '红杉资本', type: 'VC', stage: '早期至后期' },
        { name: '成长资本', type: 'Growth', stage: '后期大额' },
        { name: '算力产业方', type: '战略', stage: '算力生态' },
        { name: '云服务集团', type: '战略', stage: '云+模型' },
        { name: '创始人基金', type: 'VC', stage: '早期' },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'type', label: '类型', type: 'text', inlineEditable: true },
        { key: 'stage', label: '阶段', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'showLabels', label: '显示类型/阶段', type: 'boolean', defaultValue: true },
    { key: 'showAnchor', label: '显示中央枢纽', type: 'boolean', defaultValue: true },
    { key: 'focusIndex', label: '高亮机构', type: 'slider', min: 0, max: 7, defaultValue: 0 },
  ],
};

/** 椭圆环形节点坐标（百分比），保证连线与节点严格对齐 */
function ringPoint(index: number, total: number): { x: number; y: number } {
  const angle = (-90 + (index * 360) / Math.max(1, total)) * (Math.PI / 180);
  return {
    x: 50 + 36 * Math.cos(angle),
    y: 50 + 35 * Math.sin(angle),
  };
}

export function Theme07InvestorV1(props: Theme07InvestorV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    hubLabel = '资本',
    hubNote,
    investors = [],
    showLabels = true,
    showAnchor = true,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;
  const validInvestors = (investors || [])
    .filter((i): i is Theme07InvestorV1Investor => i != null && !!i.name)
    .slice(0, 8);
  const total = validInvestors.length;
  const points = validInvestors.map((_, i) => ringPoint(i, total));

  return (
    <div className="lp-slide lp-theme07 lp-theme07-investor">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-investor-header lp-rise">
        <Theme07IconChip name="network" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {total > 0 && (
        <div className="lp-theme07-investor-network lp-rise">
          <svg
            className="lp-theme07-investor-network-links"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {points.map((p, i) => (
              <line
                key={`edge-${i}`}
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                stroke={i === focusIndex ? 'var(--lp-accent)' : 'var(--lp-edge)'}
                strokeWidth={i === focusIndex ? 2.2 : 1.2}
                strokeDasharray={i === focusIndex ? undefined : '4 3'}
                vectorEffect="non-scaling-stroke"
                opacity={i === focusIndex ? 0.95 : 0.6}
              />
            ))}
            {points.map((p, i) => (
              <circle
                key={`joint-${i}`}
                cx={p.x}
                cy={p.y}
                r="0.9"
                fill={i === focusIndex ? 'var(--lp-accent)' : 'var(--lp-accent-2)'}
                opacity="0.7"
              />
            ))}
          </svg>
          {showAnchor && (
            <div className="lp-theme07-investor-hub">
              <span className="lp-theme07-investor-hub-ring" aria-hidden="true" />
              <EditableField prop="hubLabel" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-investor-hub-label">{hubLabel}</EditableField>
              {hubNote && (
                <EditableField prop="hubNote" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-investor-hub-note">{hubNote}</EditableField>
              )}
            </div>
          )}
          {validInvestors.map((investor, index) => {
            const p = points[index] ?? { x: 50, y: 50 };
            const isFocus = index === focusIndex;
            return (
              <div
                key={index}
                className={`lp-theme07-card lp-theme07-investor-node ${isFocus ? 'lp-focus' : ''}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${index * 70}ms` }}
              >
                {isFocus && <span className="lp-focus-lens" aria-hidden="true" />}
                <div className="lp-theme07-card-accent-bar" />
                <div className="lp-theme07-investor-node-name">
                  <EditableField prop={`investors.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{investor.name}</EditableField>
                </div>
                {showLabels && (
                  <div className="lp-theme07-investor-node-meta">
                    {investor.type && <span className="lp-theme07-investor-node-type">{investor.type}</span>}
                    {investor.stage && <span className="lp-theme07-investor-node-stage">{investor.stage}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
