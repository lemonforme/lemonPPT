// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04RiskchainV1Risk {
  label?: string;
  description?: string;
  impact?: 'high' | 'medium' | 'low';
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04RiskchainV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  risks?: Theme04RiskchainV1Risk[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04RiskchainV1Meta: LayoutMeta = {
  id: 'theme04_riskchain_v1',
  theme: 'theme04',
  role: 'process',
  displayName: 'Theme 04 风险传导链',
  description: '横向风险节点链，展示风险传导路径与影响等级',
  needsMedia: false,
  tags: ['process', 'risk', 'chain', 'candy'],
  contentShape: 'horizontal-steps',
};

export const theme04RiskchainV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '风险传导' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{AI 投资}}的传导性风险' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从估值泡沫到监管收紧，风险如何在产业链中逐级放大。' },
    {
      key: 'risks',
      label: '风险节点',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '估值泡沫', description: '头部项目估值脱离基本面', impact: 'high', tone: 'pink' },
        { label: '算力紧缺', description: 'GPU 供应约束推高训练成本', impact: 'medium', tone: 'blue' },
        { label: '监管收紧', description: '数据合规与内容审核要求升级', impact: 'high', tone: 'pink' },
        { label: '人才流失', description: '核心研发团队被巨头挖角', impact: 'medium', tone: 'yellow' },
        { label: '商业化滞后', description: '产品收入无法覆盖高额投入', impact: 'high', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'label', label: '风险名称', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
        { key: 'impact', label: '影响等级', type: 'select', defaultValue: 'medium', options: [{ value: 'high', label: '高' }, { value: 'medium', label: '中' }, { value: 'low', label: '低' }] },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 风险研究 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-riskchain-title lp-rise">
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

const impactLabel: Record<string, string> = {
  high: '高风险',
  medium: '中风险',
  low: '低风险',
};

export function Theme04RiskchainV1(props: Theme04RiskchainV1Props): ReactNode {
  const { kicker, title, subtitle, risks, footnote, _slideIdx, _editable } = props;
  const safeRisks = (risks || []).filter((r) => r != null).slice(0, 6);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-riskchain">
      <div className="lp-theme04-riskchain-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-riskchain-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {safeRisks.length > 0 && (
        <div className="lp-theme04-riskchain-track lp-rise">
          {safeRisks.map((risk, idx) => (
            <div key={idx} className="lp-theme04-riskchain-step" style={{ animationDelay: `${idx * 90}ms` }}>
              <div className={`lp-theme04-riskchain-card lp-theme04-card ${toneClass[risk.tone || 'green'] || ''}`}>
                <div className="lp-theme04-riskchain-card-header">
                  <span className="lp-theme04-riskchain-node-number">{String(idx + 1).padStart(2, '0')}</span>
                  {risk.impact && (
                    <span className={`lp-theme04-riskchain-impact lp-theme04-riskchain-impact--${risk.impact}`}>
                      {impactLabel[risk.impact]}
                    </span>
                  )}
                </div>
                {risk.label && (
                  <EditableField prop={`risks.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-riskchain-label">{risk.label}</EditableField>
                )}
                {risk.description && (
                  <EditableField prop={`risks.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-riskchain-description">{risk.description}</EditableField>
                )}
              </div>
              {idx < safeRisks.length - 1 && (
                <div className="lp-theme04-riskchain-connector">
                  <div className="lp-theme04-riskchain-connector-line" />
                  <div className="lp-theme04-riskchain-connector-arrow" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-riskchain-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
