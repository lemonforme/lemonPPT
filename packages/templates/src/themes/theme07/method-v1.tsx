// lemonPPT - theme07 研究方法页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07MethodV1Step {
  number?: string;
  title?: string;
  description?: string;
}

export interface Theme07MethodV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme07MethodV1Step[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07MethodV1Meta: LayoutMeta = {
  id: 'theme07_method_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 研究方法',
  description: '编号步骤卡片展示研究/分析框架，适合调研报告方法论',
  needsMedia: true,
  tags: ['method', 'framework', 'research'],
  contentShape: 'process',
};

export const theme07MethodV1Schema: PropsSchema = {
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
    { key: 'footnote', label: '页脚说明', type: 'textarea', inlineEditable: true, defaultValue: '方法论会根据数据源与课题调整，本页为通用框架。' },
  ],
};

export function Theme07MethodV1(props: Theme07MethodV1Props): ReactNode {
  const { imageUrl, kicker, title, subtitle, steps = [], footnote, _slideIdx, _editable } = props;
  const validSteps = (steps || []).filter((s): s is Theme07MethodV1Step => s != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-method">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-method-header lp-rise">
        <Theme07IconChip name="compass" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
        <div className="lp-theme07-underline" />
      </div>

      {validSteps.length > 0 && (
        <div className="lp-theme07-method-body lp-rise">
          {validSteps.map((step, index) => (
            <div key={index} className="lp-theme07-method-card">
              <div className="lp-theme07-method-number">{step.number || String(index + 1).padStart(2, '0')}</div>
              <div className="lp-theme07-method-card-title">
                <EditableField prop={`steps.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{step.title || ''}</EditableField>
              </div>
              <div className="lp-theme07-method-card-desc">
                <EditableField prop={`steps.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="span">{step.description || ''}</EditableField>
              </div>
              {index < validSteps.length - 1 && <div className="lp-theme07-method-arrow" aria-hidden="true">→</div>}
            </div>
          ))}
        </div>
      )}

      {footnote && (
        <div className="lp-theme07-method-footnote lp-rise">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}

      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
