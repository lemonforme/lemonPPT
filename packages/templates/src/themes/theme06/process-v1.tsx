// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ProcessV1Step {
  title?: string;
  description?: string;
}

export interface Theme06ProcessV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Theme06ProcessV1Step[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ProcessV1Meta: LayoutMeta = {
  id: 'theme06_process_v1',
  theme: 'theme06',
  role: 'process',
  displayName: 'Theme 06 流程步骤',
  description: '横向霓虹步骤流程，适合实施路径与方法论展示',
  needsMedia: true,
  tags: ['process', 'workflow', 'atlas'],
  contentShape: 'horizontal-steps',
};

export const theme06ProcessV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'PROCESS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '落地实施路径' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从需求识别到规模推广的四步闭环。' },
    {
      key: 'steps',
      label: '步骤',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { title: '需求识别', description: '梳理高频、高价值的重复性工作场景。' },
        { title: '原型验证', description: '用小范围试点验证模型能力与提效空间。' },
        { title: '工具集成', description: '嵌入现有工作流，降低使用门槛。' },
        { title: '规模推广', description: '沉淀模板与最佳实践，复制到全团队。' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
      ],
    },
    { key: 'footnote', label: '底部总标注', type: 'text', inlineEditable: true, defaultValue: '4 段 / FLOW' },
  ],
};

function splitBilingual(text?: string): { cn?: string; en?: string } {
  if (!text) return {};
  const parts = text.split(' / ');
  if (parts.length >= 2) return { cn: parts[0], en: parts.slice(1).join(' / ') };
  return { cn: text };
}

export function Theme06ProcessV1(props: Theme06ProcessV1Props): ReactNode {
  const { kicker, title, subtitle, steps = [], footnote, _slideIdx, _editable } = props;
  const validSteps = (steps || []).filter((s): s is Theme06ProcessV1Step => s != null).slice(0, 6);
  const footnoteParts = splitBilingual(footnote);

  return (
    <div className="lp-slide lp-theme06-process">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-process-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validSteps.length > 0 && (
        <div className="lp-theme06-process-flow lp-rise">
          {validSteps.map((step, index) => (
            <div key={index} className="lp-theme06-process-step" style={{ animationDelay: `${index * 90}ms` }}>
              <div className="lp-theme06-process-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="lp-theme06-process-title">
                <EditableField prop={`steps.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3">{step.title || ''}</EditableField>
              </div>
              {step.description && (
                <div className="lp-theme06-process-desc">
                  <EditableField prop={`steps.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p">{step.description}</EditableField>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        {footnote ? (
          <div className="lp-theme06-footer-bilingual">
            {footnoteParts.cn && (
              <span className="lp-theme06-footer-cn">
                <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteParts.cn}</EditableField>
              </span>
            )}
            {footnoteParts.en && (
              <span className="lp-theme06-footer-en">
                <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteParts.en}</EditableField>
              </span>
            )}
          </div>
        ) : (
          <>
            <span className="lp-theme06-footer-left" />
            <span className="lp-theme06-footer-right" />
          </>
        )}
      </div>
    </div>
  );
}
