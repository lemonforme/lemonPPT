// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06IndustryVerticalV1UseCase {
  title?: string;
  description?: string;
}

export interface Theme06IndustryVerticalV1Highlight {
  value?: string;
  label?: string;
  accent?: boolean;
}

export interface Theme06IndustryVerticalV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  industry?: string;
  useCases?: Theme06IndustryVerticalV1UseCase[];
  highlights?: Theme06IndustryVerticalV1Highlight[];
  insight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06IndustryVerticalV1Meta: LayoutMeta = {
  id: 'theme06_industry_vertical_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 垂直行业专题',
  description: '针对垂直行业（医疗、金融、零售等）的落地场景与关键指标',
  needsMedia: true,
  tags: ['industry', 'vertical', 'spotlight', 'atlas'],
  contentShape: 'summary',
};

export const theme06IndustryVerticalV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'INDUSTRY SPOTLIGHT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '医疗健康 AI 落地现状' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从影像辅助诊断到药物发现，AI 正在重塑研发与临床路径' },
    { key: 'industry', label: '行业标签', type: 'text', inlineEditable: true, defaultValue: '医疗健康' },
    {
      key: 'useCases',
      label: '落地场景',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { title: '影像辅助诊断', description: '准确率已接近资深医师水平，阅片效率提升 3 倍以上。' },
        { title: '药物发现', description: '利用生成式模型压缩先导化合物筛选周期。' },
        { title: '智能问诊', description: '覆盖常见症状预检与分级诊疗导流。' },
        { title: '慢病管理', description: '基于可穿戴数据的个性化干预方案。' },
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
        { value: '470+', label: '在研项目', accent: true },
        { value: '$12B', label: '年度融资', accent: false },
        { value: '38%', label: '渗透率提升', accent: false },
        { value: '24', label: '获批产品', accent: true },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'insight', label: '关键洞察', type: 'textarea', inlineEditable: true, defaultValue: '监管框架与临床验证仍是规模化落地的最大变量，率先通过审批的企业将建立显著壁垒。' },
  ],
};

export function Theme06IndustryVerticalV1(props: Theme06IndustryVerticalV1Props): ReactNode {
  const { kicker, title, subtitle, industry, useCases = [], highlights = [], insight, _slideIdx, _editable } = props;
  const validUseCases = (useCases || []).filter((u): u is Theme06IndustryVerticalV1UseCase => u != null).slice(0, 4);
  const validHighlights = (highlights || []).filter((h): h is Theme06IndustryVerticalV1Highlight => h != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-industry-vertical">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-industry-vertical-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        {industry && <div className="lp-theme06-industry-vertical-tag">{industry}</div>}
      </div>

      <div className="lp-theme06-industry-vertical-body lp-rise">
        <div className="lp-theme06-industry-vertical-main">
          {validUseCases.map((item, index) => (
            <div key={index} className="lp-theme06-industry-vertical-case">
              <EditableField prop={`useCases.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-industry-vertical-case-title">{item.title || ''}</EditableField>
              {item.description && (
                <EditableField prop={`useCases.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-industry-vertical-case-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>

        <div className="lp-theme06-industry-vertical-aside">
          <div className="lp-theme06-industry-vertical-grid">
            {validHighlights.map((item, index) => (
              <div key={index} className={`lp-theme06-industry-vertical-cell ${item.accent ? 'accent' : ''}`}>
                <div className="lp-theme06-industry-vertical-value">{item.value || ''}</div>
                <div className="lp-theme06-industry-vertical-label">{item.label || ''}</div>
              </div>
            ))}
          </div>
          {insight && (
            <div className="lp-theme06-industry-vertical-insight">
              <EditableField prop="insight" slideIdx={_slideIdx} editable={_editable} as="p">{insight}</EditableField>
            </div>
          )}
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
