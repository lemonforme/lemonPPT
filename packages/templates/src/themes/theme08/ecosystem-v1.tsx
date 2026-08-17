// lemonPPT - theme08 黑金实验 · 生态圈辐射
// 原创实现，不复制 Dashi theme08

import type { CSSProperties } from 'react';
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface EcosystemNode {
  name: string;
  value: string;
  unit?: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  offsetPx?: number;
}

export interface Theme08EcosystemV1Props {
  kicker?: string;
  hubName: string;
  hubValue: string;
  hubUnit?: string;
  hubSub?: string;
  nodes?: EcosystemNode[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08EcosystemV1Meta: LayoutMeta = {
  id: 'theme08_ecosystem_v1',
  theme: 'theme08',
  role: 'feature',
  displayName: 'Theme 08 生态圈',
  description: '中心 hub + 四周节点辐射，虚线椭圆轨道连接，适合生态/平台关系',
  needsMedia: false,
  tags: ['ecosystem', 'hub', 'radiation', 'black-gold'],
  contentShape: 'feature',
};

export const theme08EcosystemV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'NVIDIA ECOSYSTEM' },
    { key: 'hubName', label: '核心名称', type: 'text', inlineEditable: true, defaultValue: 'GPU' },
    { key: 'hubValue', label: '核心数值', type: 'text', inlineEditable: true, defaultValue: '92' },
    { key: 'hubUnit', label: '核心单位', type: 'text', inlineEditable: true, defaultValue: '亿' },
    { key: 'hubSub', label: '核心副标', type: 'text', inlineEditable: true, defaultValue: 'ECOSYSTEM CORE · 生态核心' },
    {
      key: 'nodes',
      label: '辐射节点',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      defaultValue: [
        { name: '芯片互联', value: '7', unit: '亿美元', position: 'left', offsetPx: -20 },
        { name: '推理优化', value: '9', unit: '亿美元', position: 'left', offsetPx: 20 },
        { name: 'GPU 云', value: '64', unit: '亿', position: 'right', offsetPx: -30 },
        { name: '集群管理', value: '12', unit: '亿', position: 'right', offsetPx: 30 },
      ],
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'position', label: '方位', type: 'select', options: [{ value: 'top', label: '上' }, { value: 'right', label: '右' }, { value: 'bottom', label: '下' }, { value: 'left', label: '左' }] },
        { key: 'offsetPx', label: '偏移(px)', type: 'number' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '25' },
  ],
};

function nodePositionStyle(node: EcosystemNode): CSSProperties {
  const off = Number(node.offsetPx) || 0;
  switch (node.position) {
    case 'top':
      return { top: 0, left: '50%', transform: `translateX(calc(-50% + ${off}px))` };
    case 'bottom':
      return { bottom: 0, left: '50%', transform: `translateX(calc(-50% + ${off}px))` };
    case 'right':
      return { right: 0, top: '50%', transform: `translateY(calc(-50% + ${off}px))` };
    case 'left':
    default:
      return { left: 0, top: '50%', transform: `translateY(calc(-50% + ${off}px))` };
  }
}

export function Theme08EcosystemV1(props: Theme08EcosystemV1Props): ReactNode {
  const { kicker, hubName, hubValue, hubUnit, hubSub, nodes = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (nodes || []).slice(0, 8);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-ecosystem-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="spark" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="hubName" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{hubName}</EditableField>
        </div>
        <div className="lp-theme08-body lp-theme08-ecosystem-body">
          <span
            className="lp-theme08-ecosystem-orbit"
            aria-hidden="true"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 460, height: 340, zIndex: 1 }}
          />
          <span
            className="lp-theme08-ecosystem-orbit"
            aria-hidden="true"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 580, height: 430, zIndex: 1, opacity: 0.6 }}
          />
          <div className="lp-theme08-ecosystem-hub">
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
              <EditableField prop="hubName" slideIdx={_slideIdx} editable={_editable} as="span">{hubName}</EditableField>
            </div>
            <div className="lp-theme08-ecosystem-hub-text">
              <EditableField prop="hubValue" slideIdx={_slideIdx} editable={_editable} as="span">{hubValue}</EditableField>
              {hubUnit && <span style={{ fontSize: 20 }}><EditableField prop="hubUnit" slideIdx={_slideIdx} editable={_editable} as="span">{hubUnit}</EditableField></span>}
            </div>
            {hubSub && <div className="lp-theme08-ecosystem-hub-sub"><EditableField prop="hubSub" slideIdx={_slideIdx} editable={_editable} as="span">{hubSub}</EditableField></div>}
          </div>
          {valid.map((n, i) => (
            <div key={i} className="lp-theme08-ecosystem-node lp-rise" style={{ ...nodePositionStyle(n), animationDelay: `${i * 70}ms` }}>
              <div className="lp-theme08-ecosystem-node-card">
                <div className="lp-theme08-ecosystem-node-name"><EditableField prop={`nodes.${i}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{n.name}</EditableField></div>
                <div className="lp-theme08-ecosystem-node-val">
                  <EditableField prop={`nodes.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{n.value}</EditableField>
                  {n.unit && <span className="lp-theme08-ecosystem-node-unit"><EditableField prop={`nodes.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{n.unit}</EditableField></span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
