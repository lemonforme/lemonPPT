// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CompanyProfileV1Fact {
  label?: string;
  value?: string;
}

export interface Theme06CompanyProfileV1Metric {
  value?: string;
  label?: string;
}

export interface Theme06CompanyProfileV1Narrative {
  challenge?: string;
  solution?: string;
  result?: string;
}

export interface Theme06CompanyProfileV1Props {
  imageUrl?: string;
  kicker?: string;
  company: string;
  tagline?: string;
  facts?: Theme06CompanyProfileV1Fact[];
  metrics?: Theme06CompanyProfileV1Metric[];
  narrative?: Theme06CompanyProfileV1Narrative;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CompanyProfileV1Meta: LayoutMeta = {
  id: 'theme06_company_profile_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 公司案例',
  description: '公司案例页，展示公司概况、关键事实与叙事',
  needsMedia: true,
  tags: ['company', 'profile', 'case', 'atlas'],
  contentShape: 'case',
};

export const theme06CompanyProfileV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COMPANY PROFILE' },
    { key: 'company', label: '公司名称', type: 'text', inlineEditable: true, defaultValue: 'Nova Compute' },
    { key: 'tagline', label: '一句话介绍', type: 'textarea', inlineEditable: true, defaultValue: '专注于推理效率优化的 AI 基础设施公司，帮助大模型在端侧以更低成本运行。' },
    {
      key: 'facts',
      label: '关键事实',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '成立时间', value: '2021' },
        { label: '总部', value: 'San Francisco' },
        { label: '员工', value: '320' },
        { label: '融资阶段', value: 'Series C' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'value', label: '值', type: 'text', inlineEditable: true },
      ],
    },
    {
      key: 'metrics',
      label: '核心指标',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { value: '4.2x', label: '推理速度提升' },
        { value: '67%', label: '成本降低' },
        { value: '12M+', label: '日均请求' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    {
      key: 'narrative',
      label: '案例叙事',
      type: 'object',
      defaultValue: {
        challenge: '端侧大模型部署面临算力受限与电池续航双重约束。',
        solution: '通过模型蒸馏、量化与专用编译器栈，将推理负载压缩到消费级芯片。',
        result: '客户在生产环境中实现了 4.2 倍加速，单请求成本下降 67%。',
      },
      itemSchema: [
        { key: 'challenge', label: '挑战', type: 'textarea', inlineEditable: true },
        { key: 'solution', label: '方案', type: 'textarea', inlineEditable: true },
        { key: 'result', label: '成果', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06CompanyProfileV1(props: Theme06CompanyProfileV1Props): ReactNode {
  const { kicker, company, tagline, facts = [], metrics = [], narrative, _slideIdx, _editable } = props;
  const validFacts = (facts || []).filter((f): f is Theme06CompanyProfileV1Fact => f != null).slice(0, 4);
  const validMetrics = (metrics || []).filter((m): m is Theme06CompanyProfileV1Metric => m != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme06-company-profile">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-company-profile-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
      </div>

      <div className="lp-theme06-company-profile-body lp-rise">
        <div className="lp-theme06-company-profile-main">
          <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-company-profile-name">{company}</EditableField>
          {tagline && (
            <EditableField prop="tagline" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-company-profile-tagline">{tagline}</EditableField>
          )}

          <div className="lp-theme06-company-profile-facts">
            {validFacts.map((fact, index) => (
              <div key={index} className="lp-theme06-company-profile-fact">
                {fact.label && <span>{fact.label}: </span>}
                <strong>{fact.value || ''}</strong>
              </div>
            ))}
          </div>

          <div className="lp-theme06-company-profile-metrics">
            {validMetrics.map((metric, index) => (
              <div key={index} className="lp-theme06-company-profile-metric">
                <div className="lp-theme06-company-profile-metric-value">{metric.value || ''}</div>
                <div className="lp-theme06-company-profile-metric-label">{metric.label || ''}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-theme06-company-profile-narrative">
          {narrative?.challenge && (
            <div className="lp-theme06-company-profile-narrative-block">
              <h4>挑战</h4>
              <EditableField prop="narrative.challenge" slideIdx={_slideIdx} editable={_editable} as="p">{narrative.challenge}</EditableField>
            </div>
          )}
          {narrative?.solution && (
            <div className="lp-theme06-company-profile-narrative-block">
              <h4>方案</h4>
              <EditableField prop="narrative.solution" slideIdx={_slideIdx} editable={_editable} as="p">{narrative.solution}</EditableField>
            </div>
          )}
          {narrative?.result && (
            <div className="lp-theme06-company-profile-narrative-block">
              <h4>成果</h4>
              <EditableField prop="narrative.result" slideIdx={_slideIdx} editable={_editable} as="p">{narrative.result}</EditableField>
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
