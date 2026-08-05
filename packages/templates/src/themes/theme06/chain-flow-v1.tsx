// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ChainFlowV1Step {
  label: string;
  description?: string;
  value?: string;
}

export interface Theme06ChainFlowV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme06ChainFlowV1Step[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChainFlowV1Meta: LayoutMeta = {
  id: 'theme06_chain_flow_v1',
  theme: 'theme06',
  role: 'process',
  displayName: 'Theme 06 产业链流向',
  description: '横向节点链，适合展示产业链、资本流或流程阶段',
  needsMedia: true,
  tags: ['chain', 'flow', 'process', 'atlas'],
  contentShape: 'process',
};

export const theme06ChainFlowV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'VALUE CHAIN' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 产业链价值流向' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从芯片层到应用层的价值分配与关键节点' },
    {
      key: 'steps',
      label: '流程节点',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { label: '算力层', description: 'GPU / TPU / 推理集群', value: '$120B' },
        { label: '基础模型', description: '预训练大模型与 API', value: '$45B' },
        { label: '中间件', description: '向量库 / Agent / 安全', value: '$18B' },
        { label: '垂直应用', description: '医疗 / 法律 / 金融', value: '$62B' },
        { label: '终端服务', description: 'Copilot / 搜索 / 客服', value: '$89B' },
      ],
      itemSchema: [
        { key: 'label', label: '节点名', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '数据为 2026 年全球市场规模估算，单位：美元。' },
  ],
};

export function Theme06ChainFlowV1(props: Theme06ChainFlowV1Props): ReactNode {
  const { kicker, title, subtitle, steps = [], footnote, _slideIdx, _editable } = props;
  const validSteps = (steps || []).filter((s): s is Theme06ChainFlowV1Step => s != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-chain-flow">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chain-flow-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-chain-flow-body lp-rise">
        <div className="lp-theme06-chain-flow-track">
          {validSteps.map((step, index) => (
            <div
              key={index}
              className="lp-theme06-chain-flow-step"
              style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
            >
              <div className="lp-theme06-chain-flow-step-number">{String(index + 1).padStart(2, '0')}</div>
              <EditableField prop={`steps.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-chain-flow-step-label">{step.label}</EditableField>
              {step.description && (
                <EditableField prop={`steps.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-chain-flow-step-desc">{step.description}</EditableField>
              )}
              {step.value && <div className="lp-theme06-chain-flow-step-value">{step.value}</div>}
            </div>
          ))}
        </div>
        {footnote && (
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-chain-flow-footnote">{footnote}</EditableField>
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
