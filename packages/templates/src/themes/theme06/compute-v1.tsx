// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ComputeV1Layer {
  name?: string;
  description?: string;
  metric?: string;
}

export interface Theme06ComputeV1Metric {
  value?: string;
  label?: string;
  accent?: boolean;
}

export interface Theme06ComputeV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  layers?: Theme06ComputeV1Layer[];
  metrics?: Theme06ComputeV1Metric[];
  insight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ComputeV1Meta: LayoutMeta = {
  id: 'theme06_compute_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 算力专题',
  description: '展示 AI 算力基础设施的层级与关键指标',
  needsMedia: true,
  tags: ['compute', 'infrastructure', 'ai', 'atlas'],
  contentShape: 'summary',
};

export const theme06ComputeV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COMPUTE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 算力基础设施' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从芯片到集群，训练与推理的算力栈正在快速分层' },
    {
      key: 'layers',
      label: '算力层级',
      type: 'array',
      minItems: 3,
      maxItems: 5,
      defaultValue: [
        { name: '芯片层', description: 'GPU / TPU / 自研 AI 芯片', metric: 'H100 等' },
        { name: '服务器层', description: '高密度 AI 服务器与高速互联', metric: 'NVLink / IB' },
        { name: '集群层', description: '万卡级训练集群调度', metric: '10k+ GPU' },
        { name: '框架层', description: '分布式训练与推理框架', metric: 'PyTorch / JAX' },
        { name: '平台层', description: 'MaaS 与弹性算力调度', metric: 'Serverless' },
      ],
      itemSchema: [
        { key: 'name', label: '层级', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'metric', label: '指标/技术', type: 'text', inlineEditable: true },
      ],
    },
    {
      key: 'metrics',
      label: '关键指标',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '1.2 EFLOPS', label: '总算力', accent: true },
        { value: '72%', label: '集群利用率', accent: false },
        { value: '$2.1M', label: '单次训练成本', accent: false },
        { value: '38%', label: '推理成本年降', accent: true },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'insight', label: '关键洞察', type: 'textarea', inlineEditable: true, defaultValue: '推理成本下降速度超过训练成本，未来算力竞争将从“堆卡”转向“调度效率”。' },
  ],
};

export function Theme06ComputeV1(props: Theme06ComputeV1Props): ReactNode {
  const { kicker, title, subtitle, layers = [], metrics = [], insight, _slideIdx, _editable } = props;
  const validLayers = (layers || []).filter((l): l is Theme06ComputeV1Layer => l != null).slice(0, 5);
  const validMetrics = (metrics || []).filter((m): m is Theme06ComputeV1Metric => m != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-compute">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-compute-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-compute-body lp-rise">
        <div className="lp-theme06-compute-stack">
          {validLayers.map((item, index) => (
            <div key={index} className="lp-theme06-compute-layer">
              <div className="lp-theme06-compute-layer-metric">{item.metric || ''}</div>
              <EditableField prop={`layers.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-compute-layer-name">{item.name || ''}</EditableField>
              {item.description && (
                <EditableField prop={`layers.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-compute-layer-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>

        <div className="lp-theme06-compute-aside">
          {validMetrics.map((item, index) => (
            <div key={index} className={`lp-theme06-compute-metric ${item.accent ? 'accent' : ''}`}>
              <div className="lp-theme06-compute-metric-value">{item.value || ''}</div>
              <div className="lp-theme06-compute-metric-label">{item.label || ''}</div>
            </div>
          ))}
          {insight && (
            <div className="lp-theme06-compute-insight">
              <EditableField prop="insight" slideIdx={_slideIdx} editable={_editable} as="p">{insight}</EditableField>
            </div>
          )}
        </div>
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
