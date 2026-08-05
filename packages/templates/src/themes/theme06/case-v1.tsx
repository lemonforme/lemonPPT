// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CaseV1Metric {
  value?: string;
  label?: string;
}

export interface Theme06CaseV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  company?: string;
  tagline?: string;
  metrics?: Theme06CaseV1Metric[];
  challenge?: string;
  solution?: string;
  result?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CaseV1Meta: LayoutMeta = {
  id: 'theme06_case_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 典型案例',
  description: '案例公司 + 关键指标 + 挑战/方案/成果三段式',
  needsMedia: true,
  tags: ['case', 'study', 'atlas'],
  contentShape: 'case-study',
};

export const theme06CaseV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'CASE STUDY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '典型案例' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从需求到落地的完整闭环' },
    { key: 'company', label: '公司名称', type: 'text', inlineEditable: true, defaultValue: 'Anthropic' },
    { key: 'tagline', label: '一句话说明', type: 'textarea', inlineEditable: true, defaultValue: '用 Constitutional AI 构建更可解释、更可控的大模型。' },
    {
      key: 'metrics',
      label: '关键指标',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { value: '9650', label: '亿美元估值' },
        { value: '120+', label: '企业客户' },
        { value: '3x', label: '年增速' },
      ],
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

export function Theme06CaseV1(props: Theme06CaseV1Props): ReactNode {
  const { kicker, title, subtitle, company, tagline, metrics = [], challenge, solution, result, _slideIdx, _editable } = props;
  const validMetrics = (metrics || []).slice(0, 3);

  return (
    <div className="lp-slide lp-theme06-case">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-case-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}

        <div className="lp-theme06-case-hero">
          {company && (
            <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-case-name">{company}</EditableField>
          )}
          {tagline && (
            <EditableField prop="tagline" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-case-tagline">{tagline}</EditableField>
          )}
        </div>

        {validMetrics.length > 0 && (
          <div className="lp-theme06-case-grid">
            {validMetrics.map((m, idx) => (
              <div key={idx} className="lp-theme06-card">
                <div className="lp-theme06-card-value">
                  <EditableField prop={`metrics.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{m.value || ''}</EditableField>
                </div>
                <div className="lp-theme06-card-label">
                  <EditableField prop={`metrics.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{m.label || ''}</EditableField>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme06-case-aside lp-rise">
        {challenge && (
          <div className="lp-theme06-card">
            <div className="lp-theme06-card-label">挑战</div>
            <EditableField prop="challenge" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-case-card-text">{challenge}</EditableField>
          </div>
        )}
        {solution && (
          <div className="lp-theme06-card">
            <div className="lp-theme06-card-label">方案</div>
            <EditableField prop="solution" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-case-card-text">{solution}</EditableField>
          </div>
        )}
        {result && (
          <div className="lp-theme06-card">
            <div className="lp-theme06-card-label">成果</div>
            <EditableField prop="result" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-case-card-text">{result}</EditableField>
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
