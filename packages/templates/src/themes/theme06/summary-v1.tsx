// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06SummaryV1Point {
  text?: string;
}

export interface Theme06SummaryV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  points?: Theme06SummaryV1Point[];
  value?: string;
  valueLabel?: string;
  valueDescription?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06SummaryV1Meta: LayoutMeta = {
  id: 'theme06_summary_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 结论摘要',
  description: '左侧要点列表 + 右侧高亮结论面板',
  needsMedia: true,
  tags: ['summary', 'conclusion', 'atlas'],
  contentShape: 'summary',
};

export const theme06SummaryV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SUMMARY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '核心结论' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据到洞察的关键提炼' },
    {
      key: 'points',
      label: '结论要点',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { text: 'AI 资本持续向头部大模型与基础设施集中。' },
        { text: '垂直场景应用进入规模化落地阶段。' },
        { text: 'AI 安全与合规成为新的投资热点。' },
        { text: '多模态与 Agent 架构重塑产品边界。' },
      ],
      itemSchema: [{ key: 'text', label: '要点', type: 'textarea' }],
    },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '+38%' },
    { key: 'valueLabel', label: '主数值说明', type: 'text', inlineEditable: true, defaultValue: '年度同比增长' },
    { key: 'valueDescription', label: '解读文字', type: 'textarea', inlineEditable: true, defaultValue: '核心指标连续四个季度保持双位数增长，验证产品市场契合度。' },
  ],
};

export function Theme06SummaryV1(props: Theme06SummaryV1Props): ReactNode {
  const { kicker, title, subtitle, points = [], value, valueLabel, valueDescription, _slideIdx, _editable } = props;
  const validPoints = (points || []).filter((p): p is Theme06SummaryV1Point => p != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-summary">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-summary-body lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}

        {validPoints.length > 0 && (
          <ul className="lp-theme06-summary-list">
            {validPoints.map((point, index) => (
              <li key={index} className="lp-theme06-summary-item">
                <span className="lp-theme06-summary-number">{String(index + 1).padStart(2, '0')}</span>
                <EditableField prop={`points.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{point.text || ''}</EditableField>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lp-theme06-summary-aside lp-rise">
        <div className="lp-theme06-conclusion">
          {value && (
            <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-conclusion-value">{value}</EditableField>
          )}
          {valueLabel && (
            <EditableField prop="valueLabel" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-conclusion-label">{valueLabel}</EditableField>
          )}
          {valueDescription && (
            <EditableField prop="valueDescription" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-conclusion-description">{valueDescription}</EditableField>
          )}
        </div>
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
