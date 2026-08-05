// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06OutlookV1Step {
  title?: string;
  description?: string;
  date?: string;
}

export interface Theme06OutlookV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  points?: Array<{ text?: string }>;
  steps?: Theme06OutlookV1Step[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06OutlookV1Meta: LayoutMeta = {
  id: 'theme06_outlook_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 展望下一步',
  description: '左侧要点 + 右侧下一步时间轴',
  needsMedia: true,
  tags: ['outlook', 'next', 'atlas'],
  contentShape: 'summary',
};

export const theme06OutlookV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'OUTLOOK' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '下一步行动' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从洞察到落地的关键路径' },
    {
      key: 'points',
      label: '核心要点',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { text: '持续跟踪头部模型能力边界与成本曲线' },
        { text: '建立跨部门 AI 应用评估与治理框架' },
        { text: '优先在客服、代码、营销场景验证 ROI' },
      ],
      itemSchema: [{ key: 'text', label: '要点', type: 'textarea', inlineEditable: true }],
    },
    {
      key: 'steps',
      label: '时间轴',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { date: 'Q1', title: '试点验证', description: '选择 3 个高价值场景跑通端到端流程' },
        { date: 'Q2', title: '能力建设中台化', description: '沉淀提示词、评测与数据飞轮' },
        { date: 'Q3', title: '规模化推广', description: '复制到更多业务线并建立运营指标' },
        { date: 'Q4', title: '生态联动', description: '与模型厂商、云厂商形成战略合作' },
      ],
      itemSchema: [
        { key: 'date', label: '时间', type: 'text', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06OutlookV1(props: Theme06OutlookV1Props): ReactNode {
  const { kicker, title, subtitle, points = [], steps = [], _slideIdx, _editable } = props;
  const validPoints = (points || []).filter((p): p is { text: string } => p != null).slice(0, 4);
  const validSteps = (steps || []).filter((s): s is Theme06OutlookV1Step => s != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-outlook">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-outlook-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
        <ul className="lp-theme06-outlook-list">
          {validPoints.map((item, index) => (
            <li key={index} className="lp-theme06-outlook-item">
              <span className="lp-theme06-outlook-item-marker">{index + 1}</span>
              <EditableField prop={`points.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme06-outlook-item-text">{item.text || ''}</EditableField>
            </li>
          ))}
        </ul>
      </div>

      <div className="lp-theme06-outlook-steps lp-rise">
        {validSteps.map((step, index) => (
          <div key={index} className="lp-theme06-outlook-step">
            {step.date && <div className="lp-theme06-outlook-step-date">{step.date}</div>}
            {step.title && <div className="lp-theme06-outlook-step-title">{step.title}</div>}
            {step.description && <div className="lp-theme06-outlook-step-desc">{step.description}</div>}
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
