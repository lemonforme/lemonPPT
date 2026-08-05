// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05CaseV1Metric {
  value: string;
  label: string;
}

export interface Theme05CaseV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  company: string;
  metric: Theme05CaseV1Metric;
  challenge?: string;
  solution?: string;
  result?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05CaseV1Meta: LayoutMeta = {
  id: 'theme05_case_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 典型案例',
  description: '顶部标题 + 案例公司名称 + 大指标 + 三段式（挑战/方案/成果）',
  needsMedia: false,
  tags: ['case', 'study', 'spectrum'],
  contentShape: 'case-study',
};

export const theme05CaseV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CASE STUDY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '典型案例' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从需求到落地的完整闭环' },
    { key: 'company', label: '公司名称', type: 'text', inlineEditable: true, defaultValue: 'Anthropic' },
    {
      key: 'metric',
      label: '核心指标',
      type: 'object',
      defaultValue: { value: '9650', label: '亿美元估值' },
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
    { key: 'challenge', label: '挑战', type: 'textarea', inlineEditable: true, defaultValue: '如何在快速扩张的同时保持 AI 系统的安全性与可控性。' },
    { key: 'solution', label: '方案', type: 'textarea', inlineEditable: true, defaultValue: '引入 Constitutional AI，通过自我监督与反馈机制训练更可解释的大模型。' },
    { key: 'result', label: '成果', type: 'textarea', inlineEditable: true, defaultValue: '在一年内完成多轮大额融资，估值跃升至全球 AI 初创公司首位。' },
  ],
};

export function Theme05CaseV1(props: Theme05CaseV1Props): ReactNode {
  const { kicker, title, subtitle, company, metric, challenge, solution, result, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-case">
      <div className="lp-theme05-case-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme05-case-hero lp-rise">
        <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-case-company">{company}</EditableField>
        <div className="lp-theme05-case-metric">
          <EditableField prop="metric.value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme05-case-metric-value">{metric?.value}</EditableField>
          <EditableField prop="metric.label" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme05-case-metric-label">{metric?.label}</EditableField>
        </div>
      </div>

      <div className="lp-theme05-case-body lp-rise">
        {challenge && (
          <div className="lp-theme05-case-card lp-theme05-card">
            <div className="lp-theme05-case-card-label">挑战</div>
            <EditableField prop="challenge" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-case-card-text">{challenge}</EditableField>
          </div>
        )}
        {solution && (
          <div className="lp-theme05-case-card lp-theme05-card">
            <div className="lp-theme05-case-card-label">方案</div>
            <EditableField prop="solution" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-case-card-text">{solution}</EditableField>
          </div>
        )}
        {result && (
          <div className="lp-theme05-case-card lp-theme05-card">
            <div className="lp-theme05-case-card-label">成果</div>
            <EditableField prop="result" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-case-card-text">{result}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
