// lemonPPT - theme07 产业联盟环
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07AllianceV1Provider {
  name?: string;
  type?: string;
  value?: string;
}

export interface Theme07AllianceV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  centerLabel?: string;
  centerNote?: string;
  providers?: Theme07AllianceV1Provider[];
  showLoop?: boolean;
  showValues?: boolean;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07AllianceV1Meta: LayoutMeta = {
  id: 'theme07_alliance_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 产业联盟环',
  description: '中央生态联盟枢纽 + 环形云厂商节点，圆弧连线携带数值标签',
  needsMedia: true,
  tags: ['alliance', 'ring', 'network', 'chart'],
  contentShape: 'ring-map',
};

export const theme07AllianceV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'ALLIANCE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '产业联盟格局' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '云厂商与模型公司围绕算力与分发形成的结盟环' },
    { key: 'centerLabel', label: '中心名称', type: 'text', inlineEditable: true, defaultValue: '生态联盟' },
    { key: 'centerNote', label: '中心说明', type: 'text', inlineEditable: true, defaultValue: '算力 · 分发 · 数据' },
    {
      key: 'providers',
      label: '联盟成员',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { name: '云厂商 A', type: '云 + 模型', value: '12 项合作' },
        { name: '云厂商 B', type: '芯片 + 云', value: '8 项合作' },
        { name: '云厂商 C', type: '模型 + 应用', value: '18 项合作' },
        { name: '云厂商 D', type: '数据 + 平台', value: '6 项合作' },
      ],
      itemSchema: [
        { key: 'name', label: '成员名称', type: 'text', inlineEditable: true },
        { key: 'type', label: '联盟类型', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'showLoop', label: '显示外环回路', type: 'boolean', defaultValue: true },
    { key: 'showValues', label: '显示弧上数值', type: 'boolean', defaultValue: true },
    { key: 'focusIndex', label: '高亮成员', type: 'slider', min: 0, max: 5, defaultValue: 0 },
  ],
};

interface RingNode {
  x: number;
  y: number;
  ctrlX: number;
  ctrlY: number;
  midX: number;
  midY: number;
}

/** 计算环形节点、与中心相连的二次贝塞尔控制点及弧中点（均为百分比坐标） */
function buildRingNode(index: number, total: number): RingNode {
  const angle = (-90 + (index * 360) / Math.max(1, total)) * (Math.PI / 180);
  const x = 50 + 34 * Math.cos(angle);
  const y = 50 + 33 * Math.sin(angle);
  // 控制点沿中点法线方向外偏，形成柔和圆弧
  const midRawX = (50 + x) / 2;
  const midRawY = (50 + y) / 2;
  const ctrlX = midRawX + 7 * Math.cos(angle + Math.PI / 2);
  const ctrlY = midRawY + 7 * Math.sin(angle + Math.PI / 2);
  return {
    x,
    y,
    ctrlX,
    ctrlY,
    midX: 0.25 * 50 + 0.5 * ctrlX + 0.25 * x,
    midY: 0.25 * 50 + 0.5 * ctrlY + 0.25 * y,
  };
}

export function Theme07AllianceV1(props: Theme07AllianceV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    centerLabel = '生态联盟',
    centerNote,
    providers = [],
    showLoop = true,
    showValues = true,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;

  const validProviders = (providers || [])
    .filter((p): p is Theme07AllianceV1Provider => p != null && !!p.name)
    .slice(0, 6);
  const total = validProviders.length;
  const nodes = validProviders.map((_, i) => buildRingNode(i, total));

  return (
    <div className="lp-slide lp-theme07 lp-theme07-alliance-ring">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-alliance-ring-header lp-rise">
        <Theme07IconChip name="globe" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {total > 0 && (
        <div className="lp-theme07-alliance-ring-stage lp-rise">
          <svg
            className="lp-theme07-alliance-ring-arcs"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {showLoop && (
              <ellipse
                cx="50"
                cy="50"
                rx="34"
                ry="33"
                fill="none"
                stroke="var(--lp-accent-2)"
                strokeWidth="1.2"
                strokeDasharray="5 4"
                vectorEffect="non-scaling-stroke"
                opacity="0.42"
              />
            )}
            {nodes.map((node, i) => (
              <path
                key={`arc-${i}`}
                d={`M 50 50 Q ${node.ctrlX} ${node.ctrlY} ${node.x} ${node.y}`}
                fill="none"
                stroke={i === focusIndex ? 'var(--lp-accent)' : 'var(--lp-edge)'}
                strokeWidth={i === focusIndex ? 2.4 : 1.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                opacity={i === focusIndex ? 0.95 : 0.62}
              />
            ))}
          </svg>
          <div className="lp-theme07-alliance-ring-core">
            <span className="lp-theme07-alliance-ring-core-pulse" aria-hidden="true" />
            <EditableField prop="centerLabel" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-alliance-ring-core-label">{centerLabel}</EditableField>
            {centerNote && (
              <EditableField prop="centerNote" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-alliance-ring-core-note">{centerNote}</EditableField>
            )}
          </div>
          {showValues && validProviders.map((provider, index) => {
            const node = nodes[index];
            if (!node || !provider.value) return null;
            return (
              <span
                key={`value-${index}`}
                className={`lp-theme07-alliance-ring-arc-value ${index === focusIndex ? 'is-focus' : ''}`}
                style={{ left: `${node.midX}%`, top: `${node.midY}%` }}
              >
                <EditableField prop={`providers.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{provider.value}</EditableField>
              </span>
            );
          })}
          {validProviders.map((provider, index) => {
            const node = nodes[index] ?? { x: 50, y: 50, ctrlX: 50, ctrlY: 50, midX: 50, midY: 50 };
            const isFocus = index === focusIndex;
            return (
              <div
                key={index}
                className={`lp-theme07-card lp-theme07-alliance-ring-node ${isFocus ? 'lp-focus' : ''}`}
                style={{ left: `${node.x}%`, top: `${node.y}%`, animationDelay: `${index * 80}ms` }}
              >
                {isFocus && <span className="lp-focus-lens" aria-hidden="true" />}
                <div className="lp-theme07-card-accent-bar" />
                <div className="lp-theme07-alliance-ring-node-name">
                  <EditableField prop={`providers.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{provider.name}</EditableField>
                </div>
                {provider.type && (
                  <div className="lp-theme07-alliance-ring-node-type">
                    <EditableField prop={`providers.${index}.type`} slideIdx={_slideIdx} editable={_editable} as="span">{provider.type}</EditableField>
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
