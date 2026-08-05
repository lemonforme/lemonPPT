// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05RiskV1Item {
  risk?: string;
  impact?: string;
  response?: string;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05RiskV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Theme05RiskV1Item[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05RiskV1Meta: LayoutMeta = {
  id: 'theme05_risk_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 风险研判',
  description: '风险列表 + 影响程度 + 应对策略，光谱色卡片',
  needsMedia: false,
  tags: ['risk', 'analysis', 'spectrum'],
  contentShape: 'title-grid',
};

export const theme05RiskV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RISK ASSESSMENT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '关键风险与应对' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '识别潜在不确定性，提前准备缓冲方案。' },
    {
      key: 'items',
      label: '风险项',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { risk: '估值回调', impact: '高', response: '优先持有收入可验证资产，减少纯叙事敞口。', scheme: 'coral' },
        { risk: '监管收紧', impact: '中', response: '布局合规工具链与模型审计能力。', scheme: 'amber' },
        { risk: '技术迭代', impact: '高', response: '保持模型接口弹性，避免单点绑定。', scheme: 'teal' },
        { risk: '人才竞争', impact: '中', response: '构建内部 AI 卓越中心，降低外部依赖。', scheme: 'indigo' },
      ],
      itemSchema: [
        { key: 'risk', label: '风险', type: 'text' },
        { key: 'impact', label: '影响程度', type: 'text' },
        { key: 'response', label: '应对策略', type: 'textarea' },
        { key: 'scheme', label: '强调色', type: 'select', options: [{ value: 'coral', label: '珊瑚' }, { value: 'amber', label: '琥珀' }, { value: 'teal', label: '青绿' }, { value: 'indigo', label: '靛蓝' }, { value: 'violet', label: '紫罗兰' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
  ],
};

function schemeClass(scheme?: string): string {
  return `lp-theme05-card--${scheme || 'coral'}`;
}

export function Theme05RiskV1(props: Theme05RiskV1Props): ReactNode {
  const { kicker, title = '关键风险与应对', subtitle, items = [], footnote, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme05-risk">
      <div className="lp-theme05-risk-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-risk-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-risk-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme05-risk-grid lp-rise">
          {validItems.map((item, index) => (
            <div key={index} className={`lp-theme05-risk-card lp-theme05-card ${schemeClass(item.scheme)}`}>
              <div className="lp-theme05-risk-card-header">
                <EditableField
                  prop={`items.${index}.risk`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-theme05-risk-card-risk"
                >
                  {item.risk || ''}
                </EditableField>
                <span className="lp-theme05-risk-card-index">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="lp-theme05-risk-card-body">
                <div className="lp-theme05-risk-card-row">
                  <span className="lp-theme05-risk-card-label">影响程度</span>
                  <EditableField
                    prop={`items.${index}.impact`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                    className="lp-theme05-risk-card-impact"
                  >
                    {item.impact || ''}
                  </EditableField>
                </div>
                <div className="lp-theme05-risk-card-row">
                  <span className="lp-theme05-risk-card-label">应对策略</span>
                  <EditableField
                    prop={`items.${index}.response`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                    className="lp-theme05-risk-card-response"
                  >
                    {item.response || ''}
                  </EditableField>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-risk-footnote">{footnote}</EditableField>
      )}

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
