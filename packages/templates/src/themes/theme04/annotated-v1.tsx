// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04AnnotatedV1Annotation {
  x?: number;
  y?: number;
  label?: string;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04AnnotatedV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  annotations?: Theme04AnnotatedV1Annotation[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04AnnotatedV1Meta: LayoutMeta = {
  id: 'theme04_annotated_v1',
  theme: 'theme04',
  role: 'image',
  displayName: 'Theme 04 标注特写',
  description: '大幅图片配合位置标注点与说明，适合产品/场景特写',
  needsMedia: true,
  mediaSlots: [{ name: '特写图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['image', 'annotated', 'candy'],
  contentShape: 'image-annotation',
};

export const theme04AnnotatedV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '标注特写' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{产品}}关键细节拆解' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '每一处设计都对应一个用户价值假设。' },
    { key: 'imageUrl', label: '特写图', type: 'image' },
    {
      key: 'annotations',
      label: '标注点',
      type: 'array',
      minItems: 1,
      maxItems: 5,
      defaultValue: [
        { x: 25, y: 30, label: '01', description: '极简接口降低首次使用门槛', tone: 'green' },
        { x: 72, y: 28, label: '02', description: '实时协作状态减少沟通成本', tone: 'blue' },
        { x: 55, y: 68, label: '03', description: '数据面板直接驱动决策', tone: 'pink' },
        { x: 18, y: 75, label: '04', description: '模块化架构支持快速扩展', tone: 'yellow' },
      ],
      itemSchema: [
        { key: 'x', label: 'X 位置（%）', type: 'number', defaultValue: 50 },
        { key: 'y', label: 'Y 位置（%）', type: 'number', defaultValue: 50 },
        { key: 'label', label: '标号', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：产品体验研究 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-annotated-title lp-rise">
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

export function Theme04AnnotatedV1(props: Theme04AnnotatedV1Props): ReactNode {
  const { kicker, title, subtitle, imageUrl, annotations, footnote, _slideIdx, _editable } = props;
  const safeAnnotations = (annotations || []).filter((a) => a != null).slice(0, 5);
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };

  return (
    <div className="lp-slide lp-theme04-annotated">
      <div className="lp-theme04-annotated-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-annotated-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-annotated-stage lp-rise">
        {imageUrl && (
          <div className="lp-theme04-annotated-image-wrap">
            <LpEditableImage
              className="lp-theme04-annotated-image"
              src={imageUrl}
              alt={title}
              slideIdx={_slideIdx}
              editable={_editable}
              prop="imageUrl"
              placeholderClassName="lp-editable-image-placeholder lp-theme04-annotated-image-placeholder"
              placeholderText="特写图"
            />
            {safeAnnotations.map((annotation, idx) => (
              <div
                key={idx}
                className={`lp-theme04-annotated-marker ${toneClass[annotation.tone || 'green'] || ''}`}
                style={{ left: `${annotation.x ?? 50}%`, top: `${annotation.y ?? 50}%`, animationDelay: `${idx * 100}ms` }}
              >
                <span className="lp-theme04-annotated-marker-dot" />
                <span className="lp-theme04-annotated-marker-ring" />
                <div className={`lp-theme04-annotated-tooltip ${idx % 2 === 0 ? 'lp-theme04-annotated-tooltip--top' : 'lp-theme04-annotated-tooltip--bottom'}`}>
                  {annotation.label && (
                    <EditableField prop={`annotations.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-annotated-tooltip-label">{annotation.label}</EditableField>
                  )}
                  {annotation.description && (
                    <EditableField prop={`annotations.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-annotated-tooltip-desc">{annotation.description}</EditableField>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-annotated-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
