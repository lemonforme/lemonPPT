// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05ContentV1Props {
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

export const theme05ContentV1Meta: LayoutMeta = {
  id: 'theme05_content_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 要点内容页',
  description: '左文右要点：标题下划线 + 彩色要点列表 + 可选结论区',
  needsMedia: false,
  tags: ['content', 'bullet', 'insight'],
  contentShape: 'content',
};

export const theme05ContentV1Schema: PropsSchema = {
  fields: [
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

export function Theme05ContentV1(props: Theme05ContentV1Props): ReactNode {
  const { kicker, title, subtitle, bullets = [], showConclusion = true, conclusion, _slideIdx, _editable } = props;
  const hasConclusion = showConclusion !== false && !!conclusion && (!!conclusion.value || !!conclusion.label || !!conclusion.description);

  return (
    <div className="lp-slide lp-theme05-content">
      <div className="lp-theme05-content-body lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme05-title">{title}</EditableField>
        <div className="lp-theme05-underline" />
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme05-content-aside lp-rise">
        {bullets.length > 0 && (
          <ul className="lp-theme05-bullets">
            {bullets.map((bullet, i) => (
              <li key={i} className="lp-theme05-bullet">
                <span className="lp-theme05-bullet-marker" />
                <EditableField prop={`bullets.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">{bullet}</EditableField>
              </li>
            ))}
          </ul>
        )}
        {hasConclusion && (
          <div className="lp-theme05-conclusion">
            {conclusion!.value && <div className="lp-theme05-conclusion-value"><EditableField prop="conclusion.value" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.value}</EditableField></div>}
            {conclusion!.label && <div className="lp-theme05-conclusion-label"><EditableField prop="conclusion.label" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.label}</EditableField></div>}
            {conclusion!.description && <div className="lp-theme05-conclusion-description"><EditableField prop="conclusion.description" slideIdx={_slideIdx} editable={_editable} as="span">{conclusion!.description}</EditableField></div>}
          </div>
        )}
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
