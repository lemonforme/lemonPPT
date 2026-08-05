// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ComparisonV3Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  rows?: Array<{ feature?: string; left?: string; right?: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ComparisonV3Meta: LayoutMeta = {
  id: 'theme03_comparison_v3',
  theme: 'theme03',
  role: 'comparison',
  displayName: 'Theme 03 编辑风横向对比表',
  description: '横向逐项对比表',
  needsMedia: false,
  tags: ['comparison', 'table'],
  contentShape: 'comparison-table',
};

export const theme03ComparisonV3Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '对比分析' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'COMPARE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'TRADITIONAL VS AI' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{传统}} vs {{AI}} 横向对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'leftTitle', label: '左侧标题', type: 'text', inlineEditable: true, defaultValue: '传统方案' },
    { key: 'rightTitle', label: '右侧标题', type: 'text', inlineEditable: true, defaultValue: 'AI 方案' },
    {
      key: 'rows',
      label: '对比行',
      type: 'array',
      maxItems: 6,
      minItems: 2,
      itemSchema: [
        { key: 'feature', label: '维度', type: 'text', inlineEditable: true },
        { key: 'left', label: '左侧', type: 'text', inlineEditable: true },
        { key: 'right', label: '右侧', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03ComparisonV3(props: Theme03ComparisonV3Props): ReactNode {
  const { tag, tagLabel, topRightMeta, kicker, title, subtitle, leftTitle = '方案 A', rightTitle = '方案 B', rows = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeRows = rows.slice(0, 6);

  return (
    <div className="lp-slide lp-theme03-comparison-v3">
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

      <div className="lp-theme03-comparison-v3-main">
        <div className="lp-theme03-comparison-v3-head lp-rise">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-comparison-v3-kicker">{kicker}</EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme03-comparison-v3-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-comparison-v3-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-comparison-v3-table lp-rise">
          <div className="lp-theme03-comparison-v3-header">
            <div className="lp-theme03-comparison-v3-cell lp-theme03-comparison-v3-feature">维度</div>
            <div className="lp-theme03-comparison-v3-cell lp-theme03-comparison-v3-left-title">{leftTitle}</div>
            <div className="lp-theme03-comparison-v3-cell lp-theme03-comparison-v3-right-title">{rightTitle}</div>
          </div>
          {safeRows.map((row, index) => (
            <div key={index} className="lp-theme03-comparison-v3-row">
              <EditableField prop={`rows.${index}.feature`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-comparison-v3-cell lp-theme03-comparison-v3-feature">{row.feature}</EditableField>
              <EditableField prop={`rows.${index}.left`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-comparison-v3-cell lp-theme03-comparison-v3-left">{row.left ?? ''}</EditableField>
              <EditableField prop={`rows.${index}.right`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-comparison-v3-cell lp-theme03-comparison-v3-right">{row.right ?? ''}</EditableField>
            </div>
          ))}
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
