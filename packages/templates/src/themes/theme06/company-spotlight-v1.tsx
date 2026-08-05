// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06CompanySpotlightV1Metric {
  value?: string;
  label?: string;
}

export interface Theme06CompanySpotlightV1Highlight {
  title?: string;
  description?: string;
}

export interface Theme06CompanySpotlightV1Props {
  imageUrl?: string;
  kicker?: string;
  company: string;
  tagline?: string;
  description?: string;
  stage?: string;
  location?: string;
  founded?: string;
  metrics?: Theme06CompanySpotlightV1Metric[];
  highlights?: Theme06CompanySpotlightV1Highlight[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06CompanySpotlightV1Meta: LayoutMeta = {
  id: 'theme06_company_spotlight_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 公司 Spotlight',
  description: '单一公司案例 spotlight：大标题、核心指标与亮点叙事',
  needsMedia: true,
  tags: ['company', 'spotlight', 'case', 'atlas'],
  contentShape: 'summary',
};

export const theme06CompanySpotlightV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COMPANY SPOTLIGHT' },
    { key: 'company', label: '公司名称', type: 'text', inlineEditable: true, defaultValue: 'OpenAI' },
    { key: 'tagline', label: '一句话定位', type: 'text', inlineEditable: true, defaultValue: '引领通用人工智能研究与应用' },
    { key: 'description', label: '公司简介', type: 'textarea', inlineEditable: true, defaultValue: '从 GPT 系列模型到 ChatGPT，OpenAI 持续推动大语言模型技术的产品化与规模化落地。' },
    { key: 'stage', label: '融资阶段', type: 'text', inlineEditable: true, defaultValue: '后期轮' },
    { key: 'location', label: '总部', type: 'text', inlineEditable: true, defaultValue: 'San Francisco' },
    { key: 'founded', label: '成立时间', type: 'text', inlineEditable: true, defaultValue: '2015' },
    {
      key: 'metrics',
      label: '核心指标',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '$157B', label: '最新估值' },
        { value: '400M+', label: '周活用户' },
        { value: '75%', label: '企业订阅占比' },
        { value: '2022', label: 'ChatGPT 发布' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    {
      key: 'highlights',
      label: '关键亮点',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { title: '模型迭代', description: 'GPT-4 及后续模型在推理、代码与多模态能力上持续领先。' },
        { title: '生态构建', description: 'Plugin 与 API 生态吸引数百万开发者与企业客户。' },
        { title: '商业模式', description: '订阅与 API 双轮驱动，形成规模化收入。' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06CompanySpotlightV1(props: Theme06CompanySpotlightV1Props): ReactNode {
  const { kicker, company, tagline, description, stage, location, founded, metrics = [], highlights = [], _slideIdx, _editable } = props;
  const validMetrics = (metrics || []).filter((m): m is Theme06CompanySpotlightV1Metric => m != null).slice(0, 4);
  const validHighlights = (highlights || []).filter((h): h is Theme06CompanySpotlightV1Highlight => h != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-company-spotlight">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-company-spotlight-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="company" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-company-spotlight-name">{company}</EditableField>
        {tagline && (
          <EditableField prop="tagline" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-company-spotlight-tagline">{tagline}</EditableField>
        )}
        {description && (
          <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-company-spotlight-description">{description}</EditableField>
        )}
        <div className="lp-theme06-company-spotlight-meta">
          {stage && <span className="lp-theme06-tag">{stage}</span>}
          {location && <span className="lp-theme06-tag">{location}</span>}
          {founded && <span className="lp-theme06-tag">成立于 {founded}</span>}
        </div>
        {validMetrics.length > 0 && (
          <div className="lp-theme06-company-spotlight-metrics">
            {validMetrics.map((item, index) => (
              <div key={index} className="lp-theme06-company-spotlight-metric">
                <div className="lp-theme06-company-spotlight-metric-value">{item.value || ''}</div>
                <div className="lp-theme06-company-spotlight-metric-label">{item.label || ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme06-company-spotlight-aside lp-rise">
        {validHighlights.map((item, index) => (
          <div key={index} className="lp-theme06-company-spotlight-highlight">
            <EditableField prop={`highlights.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-company-spotlight-highlight-title">{item.title || ''}</EditableField>
            {item.description && (
              <EditableField prop={`highlights.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-company-spotlight-highlight-desc">{item.description}</EditableField>
            )}
          </div>
        ))}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
