// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ContentV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  showConclusion?: boolean;
  conclusion?: { value?: string; label?: string; description?: string };
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ContentV1Meta: LayoutMeta = {
  id: 'theme06_content_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 要点内容页',
  description: '左文右要点：霓虹标题下划线 + 发光要点列表 + 可选结论面板',
  needsMedia: true,
  tags: ['content', 'bullet', 'insight'],
  contentShape: 'content',
};

export const theme06ContentV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'KEY POINTS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心要点总结' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '本章节提炼了三个关键结论' },
    {
      key: 'bullets',
      label: '要点列表',
      type: 'array',
      minItems: 1,
      maxItems: 8,
      itemSchema: [{ key: 'item', label: '要点', type: 'text', inlineEditable: true }],
    },
    { key: 'showConclusion', label: '显示结论区', type: 'boolean', defaultValue: true },
    {
      key: 'conclusion',
      label: '结论区',
      type: 'object',
      visibleWhen: { key: 'showConclusion', value: true },
      defaultValue: { value: '+38%', label: '年度同比增长', description: '核心指标连续四个季度保持双位数增长。' },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
  ],
};

export function Theme06ContentV1(props: Theme06ContentV1Props): ReactNode {
  const { kicker, title, subtitle, bullets = [], showConclusion = true, conclusion, _slideIdx, _editable } = props;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme06-content">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-content-body lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        <div className="lp-theme06-underline" />
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme06-content-aside lp-rise">
        {bullets.length > 0 && (
          <ul className="lp-theme06-bullets">
            {bullets.map((bullet, i) => (
              <li key={i} className="lp-theme06-bullet">
                <span className="lp-theme06-bullet-marker" />
                <EditableField prop={`bullets.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{bullet}</EditableField>
              </li>
            ))}
          </ul>
        )}
        {hasConclusion && (
          <div className="lp-theme06-conclusion">
            {conclusion!.value && <div className="lp-theme06-conclusion-value"><EditableField prop="conclusion.value" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.value}</EditableField></div>}
            {conclusion!.label && <div className="lp-theme06-conclusion-label"><EditableField prop="conclusion.label" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.label}</EditableField></div>}
            {conclusion!.description && <div className="lp-theme06-conclusion-description"><EditableField prop="conclusion.description" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.description}</EditableField></div>}
          </div>
        )}
      </div>
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
