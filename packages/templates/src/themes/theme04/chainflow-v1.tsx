// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ChainflowV1Step {
  label: string;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04ChainflowV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme04ChainflowV1Step[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ChainflowV1Meta: LayoutMeta = {
  id: 'theme04_chainflow_v1',
  theme: 'theme04',
  role: 'process',
  displayName: 'Theme 04 产业链流向',
  description: '横向节点+箭头连接，展示产业链各环节流向',
  needsMedia: false,
  tags: ['process', 'industry-chain', 'flow', 'candy'],
  contentShape: 'horizontal-steps',
};

export const theme04ChainflowV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '产业链流向' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 价值{{如何流动}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从算力到应用，逐层放大商业价值' },
    {
      key: 'steps',
      label: '流程节点',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '算力层', description: '芯片、云服务与数据中心', tone: 'blue' },
        { label: '模型层', description: '基础大模型与垂直模型', tone: 'green' },
        { label: '工具层', description: '训练、推理与部署工具链', tone: 'yellow' },
        { label: '应用层', description: '面向用户的最终产品', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'label', label: '节点名称', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究整理' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-chainflow-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

const toneClass: Record<string, string> = {
  green: 'lp-theme04-chainflow-step--green',
  pink: 'lp-theme04-chainflow-step--pink',
  blue: 'lp-theme04-chainflow-step--blue',
  yellow: 'lp-theme04-chainflow-step--yellow',
};

export function Theme04ChainflowV1(props: Theme04ChainflowV1Props): ReactNode {
  const { kicker, title, subtitle, steps = [], footnote, _slideIdx, _editable } = props;
  const validSteps = (steps || []).slice(0, 6);

  return (
    <div className="lp-slide lp-theme04-chainflow">
      <div className="lp-theme04-chainflow-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-chainflow-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validSteps.length > 0 && (
        <div className="lp-theme04-chainflow-track lp-rise">
          {validSteps.map((step, idx) => (
            <div key={idx} className="lp-theme04-chainflow-step-wrap" style={{ animationDelay: `${idx * 90}ms` }}>
              <div className={`lp-theme04-chainflow-step lp-theme04-card ${toneClass[step.tone ?? 'green']}`}>
                <span className="lp-theme04-chainflow-step-number">{String(idx + 1).padStart(2, '0')}</span>
                <EditableField
                  prop={`steps.${idx}.label`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-theme04-chainflow-step-title"
                >
                  {step.label}
                </EditableField>
                {step.description && (
                  <EditableField
                    prop={`steps.${idx}.description`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="p"
                    className="lp-theme04-chainflow-step-description"
                  >
                    {step.description}
                  </EditableField>
                )}
              </div>
              {idx < validSteps.length - 1 && (
                <div className="lp-theme04-chainflow-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chainflow-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
