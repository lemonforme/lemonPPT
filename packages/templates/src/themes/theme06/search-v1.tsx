// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06SearchV1Step {
  title?: string;
  description?: string;
  input?: string;
  output?: string;
}

export interface Theme06SearchV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme06SearchV1Step[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06SearchV1Meta: LayoutMeta = {
  id: 'theme06_search_v1',
  theme: 'theme06',
  role: 'process',
  displayName: 'Theme 06 检索流程图',
  description: '检索流程步骤 + 输入输出标签',
  needsMedia: true,
  tags: ['process', 'search', 'flow', 'atlas'],
  contentShape: 'process',
};

export const theme06SearchV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SEARCH FLOW' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '智能检索流程' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从问题理解到答案生成的端到端流程' },
    {
      key: 'steps',
      label: '流程步骤',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { title: 'Query 理解', description: '解析用户意图、实体与约束', input: '自然语言问题', output: '结构化查询' },
        { title: '向量召回', description: '在知识库中检索相关片段', input: 'Embedding', output: 'Top-K 候选' },
        { title: '重排序', description: '按相关性与可信度精排', input: '候选片段', output: '精选上下文' },
        { title: '答案生成', description: '基于上下文生成可溯源回答', input: '上下文 + 问题', output: '最终答案' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'input', label: '输入', type: 'text', inlineEditable: true },
        { key: 'output', label: '输出', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06SearchV1(props: Theme06SearchV1Props): ReactNode {
  const { kicker, title, subtitle, steps = [], _slideIdx, _editable } = props;
  const validSteps = (steps || []).filter((s): s is Theme06SearchV1Step => s != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-search">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-search-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-search-body lp-rise">
        {validSteps.length > 0 && (
          <div className="lp-theme06-search-flow">
            {validSteps.map((step, index) => (
              <div key={index} className="lp-theme06-search-step">
                <div className="lp-theme06-search-step-title">
                  <EditableField prop={`steps.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{step.title || ''}</EditableField>
                </div>
                {step.description && (
                  <div className="lp-theme06-search-step-desc">
                    <EditableField prop={`steps.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="span">{step.description}</EditableField>
                  </div>
                )}
                {(step.input || step.output) && (
                  <div className="lp-theme06-search-io">
                    {step.input && (
                      <div className="lp-theme06-search-io-row">
                        <span className="lp-theme06-search-io-label">INPUT</span>
                        <EditableField prop={`steps.${index}.input`} slideIdx={_slideIdx} editable={_editable} as="span">{step.input}</EditableField>
                      </div>
                    )}
                    {step.output && (
                      <div className="lp-theme06-search-io-row">
                        <span className="lp-theme06-search-io-label">OUTPUT</span>
                        <EditableField prop={`steps.${index}.output`} slideIdx={_slideIdx} editable={_editable} as="span">{step.output}</EditableField>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
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
