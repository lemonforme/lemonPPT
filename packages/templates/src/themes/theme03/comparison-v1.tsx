// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ComparisonV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftItems?: Array<{ value?: string } | string>;
  rightItems?: Array<{ value?: string } | string>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ComparisonV1Meta: LayoutMeta = {
  id: 'theme03_comparison_v1',
  theme: 'theme03',
  role: 'comparison',
  displayName: 'Theme 03 编辑风对比',
  description: '深色代码编辑风左右双栏对比页',
  needsMedia: false,
  tags: ['comparison', 'vs', 'pros-cons'],
  contentShape: 'two-column-comparison',
};

export const theme03ComparisonV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '对比分析' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'COMPARE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{传统方案}} vs {{AI 方案}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'leftTitle', label: '左侧标题', type: 'text', inlineEditable: true, defaultValue: '传统方案' },
    { key: 'rightTitle', label: '右侧标题', type: 'text', inlineEditable: true, defaultValue: 'AI 方案' },
    {
      key: 'leftItems',
      label: '左侧项',
      type: 'array',
      itemSchema: [{ key: 'value', label: '内容', type: 'text' }],
    },
    {
      key: 'rightItems',
      label: '右侧项',
      type: 'array',
      itemSchema: [{ key: 'value', label: '内容', type: 'text' }],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-comparison-title lp-rise">
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

function getItemValue(item: { value?: string } | string | undefined): string | undefined {
  if (item == null) return undefined;
  if (typeof item === 'string') return item;
  return item.value;
}

export function Theme03ComparisonV1(props: Theme03ComparisonV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, leftTitle, rightTitle, leftItems = [], rightItems = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-comparison-v1">
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

      <div className="lp-theme03-comparison-main">
        <div className="lp-theme03-comparison-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-comparison-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-comparison-grid lp-rise">
          <div className="lp-theme03-comparison-column lp-theme03-comparison-column--left">
            {leftTitle && (
              <EditableField prop="leftTitle" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-comparison-column-title">{leftTitle}</EditableField>
            )}
            <ul className="lp-theme03-comparison-list">
              {leftItems.map((item, idx) => (
                <li key={idx}>
                  <EditableField prop={`leftItems.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{getItemValue(item)}</EditableField>
                </li>
              ))}
            </ul>
          </div>

          <div className="lp-theme03-comparison-vs">VS</div>

          <div className="lp-theme03-comparison-column lp-theme03-comparison-column--right">
            {rightTitle && (
              <EditableField prop="rightTitle" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-comparison-column-title">{rightTitle}</EditableField>
            )}
            <ul className="lp-theme03-comparison-list">
              {rightItems.map((item, idx) => (
                <li key={idx}>
                  <EditableField prop={`rightItems.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{getItemValue(item)}</EditableField>
                </li>
              ))}
            </ul>
          </div>
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
