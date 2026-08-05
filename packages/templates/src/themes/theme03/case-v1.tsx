// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03CaseV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  milestones?: Array<{ date: string; title: string; description?: string }>;
  footnote?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03CaseV1Meta: LayoutMeta = {
  id: 'theme03_case_v1',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风案例页',
  description: '深色代码编辑风案例页，左图右文 + 时间线里程碑',
  needsMedia: true,
  tags: ['case', 'image-text', 'timeline'],
  contentShape: 'image-with-timeline',
};

export const theme03CaseV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '典型案例' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'CASE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{Anthropic}}：从追赶到反超' },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
    { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
    { key: 'image', label: '案例配图', type: 'image' },
    {
      key: 'milestones',
      label: '时间线',
      type: 'array',
      itemSchema: [
        { key: 'date', label: '时间', type: 'text' },
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
      ],
    },
    { key: 'footnote', label: '底部引用', type: 'textarea', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-case-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03CaseV1(props: Theme03CaseV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, description, image, milestones, footnote, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-case-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-case-main">
        <div className="lp-theme03-case-image-wrap lp-rise">
          <LpEditableImage
            className="lp-theme03-case-image"
            src={image}
            alt=""
            slideIdx={_slideIdx}
            editable={_editable}
            prop="image"
            placeholderClassName="lp-editable-image-placeholder lp-theme03-case-image-placeholder"
            placeholderText="点击上传案例配图"
          />
        </div>

        <div className="lp-theme03-case-body lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-case-subtitle">{subtitle}</EditableField>}
          {description && <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-case-desc">{description}</EditableField>}

          {milestones && milestones.length > 0 && (
            <div className="lp-theme03-case-timeline">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="lp-theme03-case-timeline-item">
                  <div className="lp-theme03-case-timeline-dot" />
                  <div className="lp-theme03-case-timeline-content">
                    <EditableField prop={`milestones.${idx}.date`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-case-timeline-date">{milestone.date}</EditableField>
                    <EditableField prop={`milestones.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-case-timeline-title">{milestone.title}</EditableField>
                    {(milestone.description || _editable) && (
                      <EditableField prop={`milestones.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-case-timeline-desc">{milestone.description}</EditableField>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {footnote && <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-case-footnote">{footnote}</EditableField>}
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
