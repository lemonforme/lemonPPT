// lemonPPT - theme07 风险研判页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07RiskV1Item {
  risk: string;
  impact?: string;
  response?: string;
  level?: 'high' | 'medium' | 'low';
}

export interface Theme07RiskV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme07RiskV1Item[];
  footnote?: string;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07RiskV1Meta: LayoutMeta = {
  id: 'theme07_risk_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 风险研判',
  description: '风险列表页：风险项、影响等级与应对策略',
  needsMedia: true,
  tags: ['risk', 'assessment', 'strategy'],
  contentShape: 'risk',
};

export const theme07RiskV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RISK ASSESSMENT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心风险研判' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '政策、估值、技术与市场四重风险扫描' },
    {
      key: 'items',
      label: '风险项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { risk: '监管政策不确定性', impact: '高', response: '提前布局合规能力，关注欧盟 AI Act 与中国监管动态', level: 'high' },
        { risk: '估值泡沫与回调', impact: '中高', response: '严格估值纪律，优先收入可见性高的项目', level: 'medium' },
        { risk: '技术路线迭代', impact: '中', response: '分散模型、芯片与应用层投资，降低单点风险', level: 'medium' },
        { risk: '市场周期波动', impact: '中', response: '保持现金储备，关注下游需求与利率环境', level: 'low' },
      ],
      itemSchema: [
        { key: 'risk', label: '风险名称', type: 'text', inlineEditable: true },
        { key: 'impact', label: '影响程度', type: 'text', inlineEditable: true },
        { key: 'response', label: '应对策略', type: 'textarea', inlineEditable: true },
        { key: 'level', label: '风险等级', type: 'select', options: [{ value: 'high', label: '高' }, { value: 'medium', label: '中' }, { value: 'low', label: '低' }] },
      ],
    },
    { key: 'footnote', label: '页脚说明', type: 'textarea', inlineEditable: true, defaultValue: '风险等级为相对判断，实际情况需结合具体项目评估。' },
    { key: 'focusIndex', label: '聚焦高亮项', type: 'number', defaultValue: -1, min: -1, max: 5 },
  ],
};

function levelClass(level?: string): string {
  switch (level) {
    case 'high': return 'high';
    case 'medium': return 'medium';
    case 'low': return 'low';
    default: return 'medium';
  }
}

export function Theme07RiskV1(props: Theme07RiskV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, items = [], footnote, focusIndex = -1, _slideIdx, _editable } = props;
  const validItems = (items || []).filter((item): item is Theme07RiskV1Item => item != null && !!item.risk).slice(0, 6);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-risk">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-risk-header lp-rise">
        <Theme07IconChip name="shield" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
        <div className="lp-theme07-underline" />
      </div>

      {validItems.length > 0 && (
        <div className="lp-theme07-risk-list lp-rise">
          {validItems.map((item, index) => (
            <div key={index} className={`lp-theme07-risk-card ${levelClass(item.level)} ${index === focusIndex ? 'lp-focus' : ''}`}>
              <div className="lp-theme07-risk-card-head">
                <div className="lp-theme07-risk-card-title">
                  <EditableField prop={`items.${index}.risk`} slideIdx={_slideIdx} editable={_editable} as="span">{item.risk}</EditableField>
                </div>
                <div className="lp-theme07-risk-card-impact">
                  <span className="lp-theme07-risk-level-dot" aria-hidden="true" />
                  <EditableField prop={`items.${index}.impact`} slideIdx={_slideIdx} editable={_editable} as="span">{item.impact || '中'}</EditableField>
                </div>
              </div>
              {item.response && (
                <div className="lp-theme07-risk-card-response">
                  <span className="lp-theme07-risk-response-label">应对：</span>
                  <EditableField prop={`items.${index}.response`} slideIdx={_slideIdx} editable={_editable} as="span">{item.response}</EditableField>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {footnote && (
        <div className="lp-theme07-risk-footnote lp-rise">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}

      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
