// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06IndustryInfrastructureV1Segment {
  title?: string;
  description?: string;
  value?: string;
  accent?: boolean;
}

export interface Theme06IndustryInfrastructureV1Metric {
  value?: string;
  label?: string;
}

export interface Theme06IndustryInfrastructureV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  segments?: Theme06IndustryInfrastructureV1Segment[];
  metrics?: Theme06IndustryInfrastructureV1Metric[];
  insight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06IndustryInfrastructureV1Meta: LayoutMeta = {
  id: 'theme06_industry_infrastructure_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 基础设施专题',
  description: '展示 AI 基础设施/数据基础设施/开发者工具等底层能力板块',
  needsMedia: true,
  tags: ['industry', 'infrastructure', 'dev-tools', 'atlas'],
  contentShape: 'summary',
};

export const theme06IndustryInfrastructureV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'INFRASTRUCTURE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 基础设施版图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '算力、数据与工具链构成新一代智能底座' },
    {
      key: 'segments',
      label: '能力板块',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { title: '算力层', description: 'GPU 集群、推理优化与弹性调度平台。', value: 'L0', accent: true },
        { title: '数据层', description: '向量数据库、数据管道与标注平台。', value: 'L1', accent: false },
        { title: '模型层', description: '基础模型、微调框架与模型服务平台。', value: 'L2', accent: false },
        { title: '工具层', description: 'Agent 编排、评估治理与可观测性工具。', value: 'L3', accent: true },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'value', label: '层级', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    {
      key: 'metrics',
      label: '关键指标',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '$31B', label: '年度融资' },
        { value: '62%', label: '资本占比' },
        { value: '4.2x', label: '平均估值倍数' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'insight', label: '关键洞察', type: 'textarea', inlineEditable: true, defaultValue: '基础设施层吸纳了超过六成的 AI 投资，算力与数据成为最关键的壁垒。' },
  ],
};

export function Theme06IndustryInfrastructureV1(props: Theme06IndustryInfrastructureV1Props): ReactNode {
  const { kicker, title, subtitle, segments = [], metrics = [], insight, _slideIdx, _editable } = props;
  const validSegments = (segments || []).filter((s): s is Theme06IndustryInfrastructureV1Segment => s != null).slice(0, 6);
  const validMetrics = (metrics || []).filter((m): m is Theme06IndustryInfrastructureV1Metric => m != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-industry-infrastructure">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-industry-infrastructure-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-industry-infrastructure-body lp-rise">
        <div className="lp-theme06-industry-infrastructure-stack">
          {validSegments.map((item, index) => (
            <div key={index} className={`lp-theme06-industry-infrastructure-segment ${item.accent ? 'accent' : ''}`} style={{ animationDelay: `${index * 80}ms` }}>
              <div className="lp-theme06-industry-infrastructure-segment-meta">
                {item.value && <div className="lp-theme06-industry-infrastructure-segment-level">{item.value}</div>}
                <EditableField prop={`segments.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-industry-infrastructure-segment-title">{item.title || ''}</EditableField>
              </div>
              {item.description && (
                <EditableField prop={`segments.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-industry-infrastructure-segment-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>

        <div className="lp-theme06-industry-infrastructure-aside">
          <div className="lp-theme06-industry-infrastructure-metrics">
            {validMetrics.map((item, index) => (
              <div key={index} className="lp-theme06-industry-infrastructure-metric">
                <div className="lp-theme06-industry-infrastructure-metric-value">{item.value || ''}</div>
                <div className="lp-theme06-industry-infrastructure-metric-label">{item.label || ''}</div>
              </div>
            ))}
          </div>
          {insight && (
            <div className="lp-theme06-industry-infrastructure-insight">
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
