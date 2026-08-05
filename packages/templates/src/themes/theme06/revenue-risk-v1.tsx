// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06RevenueRiskV1Risk {
  label?: string;
  impact?: string;
  probability?: string;
  level?: 'low' | 'medium' | 'high';
}

export interface Theme06RevenueRiskV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  risks?: Theme06RevenueRiskV1Risk[];
  totalExposure?: string;
  exposureLabel?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06RevenueRiskV1Meta: LayoutMeta = {
  id: 'theme06_revenue_risk_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 收入风险',
  description: '收入风险项列表 + 总体风险敞口',
  needsMedia: true,
  tags: ['risk', 'revenue', 'exposure', 'atlas'],
  contentShape: 'risk',
};

export const theme06RevenueRiskV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'REVENUE RISK' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '收入端主要风险' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '识别可能影响收入达成的关键变量与敞口' },
    {
      key: 'risks',
      label: '风险项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '大客户续约延迟', impact: '-12%', probability: '中', level: 'medium' },
        { label: '价格战侵蚀客单价', impact: '-8%', probability: '高', level: 'high' },
        { label: '新市场拓展不及预期', impact: '-15%', probability: '中', level: 'medium' },
        { label: '监管合规成本上升', impact: '-5%', probability: '低', level: 'low' },
      ],
      itemSchema: [
        { key: 'label', label: '风险描述', type: 'textarea', inlineEditable: true },
        { key: 'impact', label: '收入影响', type: 'text', inlineEditable: true },
        { key: 'probability', label: '发生概率', type: 'text', inlineEditable: true },
        {
          key: 'level',
          label: '风险等级',
          type: 'select',
          options: [
            { value: 'low', label: '低' },
            { value: 'medium', label: '中' },
            { value: 'high', label: '高' },
          ],
        },
      ],
    },
    { key: 'totalExposure', label: '总敞口数值', type: 'text', inlineEditable: true, defaultValue: '-$42M' },
    { key: 'exposureLabel', label: '敞口标签', type: 'text', inlineEditable: true, defaultValue: '预计收入敞口' },
  ],
};

const levelClass: Record<string, string> = {
  high: 'high',
  medium: 'medium',
  low: 'low',
};

export function Theme06RevenueRiskV1(props: Theme06RevenueRiskV1Props): ReactNode {
  const { kicker, title, subtitle, risks = [], totalExposure, exposureLabel, _slideIdx, _editable } = props;
  const validRisks = (risks || []).filter((r): r is Theme06RevenueRiskV1Risk => r != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-revenue-risk">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-revenue-risk-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-revenue-risk-body lp-rise">
        <div className="lp-theme06-revenue-risk-list">
          {validRisks.map((risk, index) => (
            <div key={index} className={`lp-theme06-revenue-risk-item ${levelClass[risk.level ?? 'medium']}`}>
              <div className="lp-theme06-revenue-risk-main">
                <EditableField prop={`risks.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-revenue-risk-label">{risk.label || ''}</EditableField>
                <div className="lp-theme06-revenue-risk-meta">
                  <span className="lp-theme06-revenue-risk-impact">{risk.impact || ''}</span>
                  <span className="lp-theme06-revenue-risk-probability">概率 {risk.probability || '-'}</span>
                </div>
              </div>
              <div className="lp-theme06-revenue-risk-badge">{risk.level?.toUpperCase() || 'MED'}</div>
            </div>
          ))}
        </div>

        <div className="lp-theme06-revenue-risk-exposure">
          <div className="lp-theme06-revenue-risk-exposure-label">{exposureLabel}</div>
          <EditableField prop="totalExposure" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-revenue-risk-exposure-value">{totalExposure || ''}</EditableField>
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
