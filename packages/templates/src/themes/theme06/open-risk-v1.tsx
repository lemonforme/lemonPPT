// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06OpenRiskV1Uncertainty {
  horizon?: string;
  scenario?: string;
  impact?: string;
  probability?: string;
}

export interface Theme06OpenRiskV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  uncertainties?: Theme06OpenRiskV1Uncertainty[];
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06OpenRiskV1Meta: LayoutMeta = {
  id: 'theme06_open_risk_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 开放风险',
  description: '不确定性时间轴与情景影响评估',
  needsMedia: true,
  tags: ['risk', 'uncertainty', 'scenario', 'atlas'],
  contentShape: 'risk',
};

export const theme06OpenRiskV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'OPEN RISK' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '未来不确定性扫描' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '识别可能改变行业格局的外部变量与情景' },
    {
      key: 'uncertainties',
      label: '不确定性项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { horizon: '6 个月内', scenario: '监管细则落地', impact: '合规成本上升 10-20%', probability: '高' },
        { horizon: '12 个月内', scenario: '开源模型能力追平闭源', impact: 'API 价格下探 30%', probability: '中' },
        { horizon: '18 个月内', scenario: '地缘政治限制算力出口', impact: '区域交付周期延长', probability: '低' },
      ],
      itemSchema: [
        { key: 'horizon', label: '时间 horizon', type: 'text', inlineEditable: true },
        { key: 'scenario', label: '情景', type: 'text', inlineEditable: true },
        { key: 'impact', label: '潜在影响', type: 'textarea', inlineEditable: true },
        { key: 'probability', label: '概率', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '短期监管与中期技术迭代是最需要持续跟踪的变量。' },
  ],
};

export function Theme06OpenRiskV1(props: Theme06OpenRiskV1Props): ReactNode {
  const { kicker, title, subtitle, uncertainties = [], conclusion, _slideIdx, _editable } = props;
  const validItems = (uncertainties || []).filter((u): u is Theme06OpenRiskV1Uncertainty => u != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-open-risk">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-open-risk-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-open-risk-body lp-rise">
        <div className="lp-theme06-open-risk-timeline">
          {validItems.map((item, index) => (
            <div key={index} className="lp-theme06-open-risk-item">
              <div className="lp-theme06-open-risk-horizon">{item.horizon || ''}</div>
              <div className="lp-theme06-open-risk-dot" aria-hidden="true" />
              <div className="lp-theme06-open-risk-card">
                <EditableField prop={`uncertainties.${index}.scenario`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-open-risk-scenario">{item.scenario || ''}</EditableField>
                <div className="lp-theme06-open-risk-meta">
                  <span className="lp-theme06-open-risk-impact">{item.impact || ''}</span>
                  <span className="lp-theme06-open-risk-probability">概率 {item.probability || '-'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {conclusion && (
          <div className="lp-theme06-open-risk-conclusion">
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
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
