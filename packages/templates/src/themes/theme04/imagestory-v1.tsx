// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04ImagestoryV1Step {
  image?: string;
  caption?: string;
  label?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04ImagestoryV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme04ImagestoryV1Step[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ImagestoryV1Meta: LayoutMeta = {
  id: 'theme04_imagestory_v1',
  theme: 'theme04',
  role: 'image',
  displayName: 'Theme 04 图片故事',
  description: '横向时间轴图片故事，展示关键节点与连续叙事',
  needsMedia: true,
  mediaSlots: [{ name: '步骤图 1', fieldPath: 'steps.0.image', canPresetMedia: true }],
  tags: ['image', 'story', 'timeline', 'candy'],
  contentShape: 'image-sequence',
};

export const theme04ImagestoryV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '图片故事' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{从 0 到 1}}的四个关键帧' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '每个节点都是产品、团队与市场共振的结果。' },
    {
      key: 'steps',
      label: '故事步骤',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '2024 Q1', caption: 'MVP 验证，首批 100 家企业试用', tone: 'green' },
        { label: '2024 Q3', caption: '产品市场契合，ARR 突破百万', tone: 'blue' },
        { label: '2025 Q1', caption: '规模化获客，团队扩张至 80 人', tone: 'pink' },
        { label: '2025 Q4', caption: '品类领先，启动全球化布局', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'image', label: '图片', type: 'image' },
        { key: 'label', label: '节点标签', type: 'text' },
        { key: 'caption', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：公司内部里程碑 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-imagestory-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04ImagestoryV1(props: Theme04ImagestoryV1Props): ReactNode {
  const { kicker, title, subtitle, steps, footnote, _slideIdx, _editable } = props;
  const safeSteps = (steps || []).filter((s) => s != null).slice(0, 4);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-imagestory">
      <div className="lp-theme04-imagestory-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-imagestory-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-imagestory-track lp-rise">
        {safeSteps.map((step, idx) => (
          <div
            key={idx}
            className={`lp-theme04-imagestory-step lp-theme04-card ${toneClass[step.tone || 'green'] || ''}`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="lp-theme04-imagestory-step-image-wrap">
              <LpEditableImage
                className="lp-theme04-imagestory-step-image"
                src={step.image}
                alt={step.caption || ''}
                slideIdx={_slideIdx}
                editable={_editable}
                prop={`steps.${idx}.image`}
                placeholderClassName="lp-editable-image-placeholder lp-theme04-imagestory-step-image-placeholder"
                placeholderText="图片"
                showIcon={true}
              />
            </div>
            <div className="lp-theme04-imagestory-step-body">
              {step.label && (
                <EditableField prop={`steps.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-imagestory-step-label">{step.label}</EditableField>
              )}
              {step.caption && (
                <EditableField prop={`steps.${idx}.caption`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-imagestory-step-caption">{step.caption}</EditableField>
              )}
            </div>
            {idx < safeSteps.length - 1 && (
              <div className="lp-theme04-imagestory-connector">
                <div className="lp-theme04-imagestory-connector-line" />
                <div className="lp-theme04-imagestory-connector-arrow" />
              </div>
            )}
          </div>
        ))}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-imagestory-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
