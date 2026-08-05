// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06IndustryFinanceV1UseCase {
  title?: string;
  description?: string;
}

export interface Theme06IndustryFinanceV1Highlight {
  value?: string;
  label?: string;
  accent?: boolean;
}

export interface Theme06IndustryFinanceV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  industry?: string;
  useCases?: Theme06IndustryFinanceV1UseCase[];
  highlights?: Theme06IndustryFinanceV1Highlight[];
  insight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06IndustryFinanceV1Meta: LayoutMeta = {
  id: 'theme06_industry_finance_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 金融行业专题',
  description: '展示金融场景落地与关键业务指标',
  needsMedia: true,
  tags: ['industry', 'finance', 'spotlight', 'atlas'],
  contentShape: 'summary',
};

export const theme06IndustryFinanceV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'FINANCE SPOTLIGHT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '金融 AI 落地场景' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从智能投顾到反欺诈，AI 正在重构金融服务链路' },
    { key: 'industry', label: '行业标签', type: 'text', inlineEditable: true, defaultValue: '金融' },
    {
      key: 'useCases',
      label: '落地场景',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { title: '智能投顾', description: '基于客户画像与市场的个性化资产配置建议。' },
        { title: '反欺诈风控', description: '实时识别异常交易模式，降低欺诈损失。' },
        { title: '信贷审批', description: '融合多维度数据，提升授信效率与准确性。' },
        { title: '合规助手', description: '自动化解析监管文本并生成合规报告。' },
      ],
      itemSchema: [
        { key: 'title', label: '场景', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
      ],
    },
    {
      key: 'highlights',
      label: '关键指标',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '$45B', label: '年度投入', accent: true },
        { value: '62%', label: '风控效率提升', accent: false },
        { value: '3.2x', label: '客户转化率', accent: false },
        { value: '40%', label: '运营成本下降', accent: true },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'insight', label: '关键洞察', type: 'textarea', inlineEditable: true, defaultValue: '监管合规与数据隐私是金融 AI 规模化落地的核心变量，头部机构正通过私有化部署建立信任壁垒。' },
  ],
};

export function Theme06IndustryFinanceV1(props: Theme06IndustryFinanceV1Props): ReactNode {
  const { kicker, title, subtitle, industry, useCases = [], highlights = [], insight, _slideIdx, _editable } = props;
  const validUseCases = (useCases || []).filter((u): u is Theme06IndustryFinanceV1UseCase => u != null).slice(0, 4);
  const validHighlights = (highlights || []).filter((h): h is Theme06IndustryFinanceV1Highlight => h != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-industry-finance">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-industry-finance-header lp-rise">
        <div className="lp-theme06-industry-finance-header-main">
          {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
          )}
        </div>
        {industry && <div className="lp-theme06-industry-finance-tag">{industry}</div>}
      </div>

      <div className="lp-theme06-industry-finance-body lp-rise">
        <div className="lp-theme06-industry-finance-main">
          {validHighlights.length > 0 && (
            <div className="lp-theme06-industry-finance-highlights">
              {validHighlights.map((item, index) => (
                <div key={index} className={`lp-theme06-industry-finance-cell ${item.accent ? 'accent' : ''}`}>
                  <div className="lp-theme06-industry-finance-value">{item.value || ''}</div>
                  <div className="lp-theme06-industry-finance-label">{item.label || ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lp-theme06-industry-finance-cases">
          {validUseCases.map((item, index) => (
            <div key={index} className="lp-theme06-industry-finance-case">
              <div className="lp-theme06-industry-finance-case-no">{String(index + 1).padStart(2, '0')}</div>
              <div className="lp-theme06-industry-finance-case-content">
                <EditableField prop={`useCases.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-industry-finance-case-title">{item.title || ''}</EditableField>
                {item.description && (
                  <EditableField prop={`useCases.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-industry-finance-case-desc">{item.description}</EditableField>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {insight && (
        <div className="lp-theme06-industry-finance-insight lp-rise">
          <span className="lp-theme06-industry-finance-insight-arrow">→</span>
          <EditableField prop="insight" slideIdx={_slideIdx} editable={_editable} as="p">{insight}</EditableField>
        </div>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
