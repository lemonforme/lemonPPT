// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06IndustryGrowthV1Stage {
  period?: string;
  milestone?: string;
  value?: string;
}

export interface Theme06IndustryGrowthV1Lever {
  title?: string;
  description?: string;
  metric?: string;
}

export interface Theme06IndustryGrowthV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  stages?: Theme06IndustryGrowthV1Stage[];
  levers?: Theme06IndustryGrowthV1Lever[];
  insight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06IndustryGrowthV1Meta: LayoutMeta = {
  id: 'theme06_industry_growth_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 增长专题',
  description: '展示增长阶段、关键杠杆与成果指标',
  needsMedia: true,
  tags: ['industry', 'growth', 'spotlight', 'atlas'],
  contentShape: 'timeline',
};

export const theme06IndustryGrowthV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GROWTH SPOTLIGHT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '增长飞轮拆解' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从获客到留存，识别驱动指数级增长的核心杠杆' },
    {
      key: 'stages',
      label: '增长阶段',
      type: 'array',
      minItems: 3,
      maxItems: 4,
      defaultValue: [
        { period: '获客', milestone: '病毒式传播 + 精准投放', value: '+120%' },
        { period: '激活', milestone: '缩短首次价值体验路径', value: '+45%' },
        { period: '留存', milestone: '习惯养成与社区运营', value: '+30%' },
        { period: '变现', milestone: '订阅与增值服务升级', value: '+60%' },
      ],
      itemSchema: [
        { key: 'period', label: '阶段', type: 'text', inlineEditable: true },
        { key: 'milestone', label: '关键动作', type: 'textarea', inlineEditable: true },
        { key: 'value', label: '增长指标', type: 'text', inlineEditable: true },
      ],
    },
    {
      key: 'levers',
      label: '增长杠杆',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { title: '产品驱动增长', description: '免费工具 + 付费功能分层', metric: 'PLG' },
        { title: '生态合作', description: '与平台、渠道共建场景', metric: 'PARTNER' },
        { title: '数据驱动运营', description: '实时实验与个性化触达', metric: 'DATA' },
        { title: '品牌内容', description: '行业报告 + 社区影响力', metric: 'BRAND' },
      ],
      itemSchema: [
        { key: 'title', label: '杠杆', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        { key: 'metric', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'insight', label: '关键洞察', type: 'textarea', inlineEditable: true, defaultValue: '留存是增长飞轮的放大器，获客成本下降与使用深度提升共同决定长期价值。' },
  ],
};

export function Theme06IndustryGrowthV1(props: Theme06IndustryGrowthV1Props): ReactNode {
  const { kicker, title, subtitle, stages = [], levers = [], insight, _slideIdx, _editable } = props;
  const validStages = (stages || []).filter((s): s is Theme06IndustryGrowthV1Stage => s != null).slice(0, 4);
  const validLevers = (levers || []).filter((l): l is Theme06IndustryGrowthV1Lever => l != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-industry-growth">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-industry-growth-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-industry-growth-body lp-rise">
        <div className="lp-theme06-industry-growth-timeline">
          {validStages.map((item, index) => (
            <div key={index} className="lp-theme06-industry-growth-stage">
              <div className="lp-theme06-industry-growth-stage-dot" />
              <div className="lp-theme06-industry-growth-stage-content">
                <div className="lp-theme06-industry-growth-stage-meta">
                  <span className="lp-theme06-industry-growth-stage-period">{item.period || ''}</span>
                  <span className="lp-theme06-industry-growth-stage-value">{item.value || ''}</span>
                </div>
                <EditableField prop={`stages.${index}.milestone`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-industry-growth-stage-desc">{item.milestone || ''}</EditableField>
              </div>
            </div>
          ))}
        </div>

        <div className="lp-theme06-industry-growth-aside">
          {validLevers.map((item, index) => (
            <div key={index} className="lp-theme06-industry-growth-lever">
              <div className="lp-theme06-industry-growth-lever-metric">{item.metric || ''}</div>
              <EditableField prop={`levers.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-industry-growth-lever-title">{item.title || ''}</EditableField>
              {item.description && (
                <EditableField prop={`levers.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-industry-growth-lever-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>
      </div>

      {insight && (
        <div className="lp-theme06-industry-growth-insight lp-rise">
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
