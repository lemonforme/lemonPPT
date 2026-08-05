// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06MethodV1Step {
  number?: string;
  title?: string;
  description?: string;
}

export interface Theme06MethodV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme06MethodV1Step[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06MethodV1Meta: LayoutMeta = {
  id: 'theme06_method_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 研究方法',
  description: '编号步骤卡片展示研究/分析框架',
  needsMedia: true,
  tags: ['method', 'framework', 'research', 'atlas'],
  contentShape: 'process',
};

export const theme06MethodV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RESEARCH METHOD' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '产业研究方法论' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据采集到结论输出的四步闭环' },
    {
      key: 'steps',
      label: '研究步骤',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { number: '01', title: '数据采集', description: '整合公开财报、投融资、专利与行业数据库' },
        { number: '02', title: '清洗建模', description: '构建统一指标体系，清洗异常值并标准化' },
        { number: '03', title: '交叉验证', description: '多源数据交叉验证，排除单一数据源偏差' },
        { number: '04', title: '洞察输出', description: '提炼趋势、风险与机会，形成可执行结论' },
      ],
      itemSchema: [
        { key: 'number', label: '编号', type: 'text', inlineEditable: true },
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '说明', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

export function Theme06MethodV1(props: Theme06MethodV1Props): ReactNode {
  const { kicker, title, subtitle, steps = [], _slideIdx, _editable } = props;
  const validSteps = (steps || []).filter((s): s is Theme06MethodV1Step => s != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-method">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-method-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validSteps.length > 0 && (
        <div className="lp-theme06-method-body lp-rise">
          {validSteps.map((step, index) => (
            <div key={index} className="lp-theme06-method-card">
              <div className="lp-theme06-method-number">{step.number || String(index + 1).padStart(2, '0')}</div>
              <div className="lp-theme06-method-card-title">{step.title || ''}</div>
              <div className="lp-theme06-method-card-desc">{step.description || ''}</div>
            </div>
          ))}
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
