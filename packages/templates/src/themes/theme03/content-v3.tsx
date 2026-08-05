// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03ContentV3Column {
  title?: string;
  text?: string;
}

export interface Theme03ContentV3Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  columns?: Theme03ContentV3Column[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ContentV3Meta: LayoutMeta = {
  id: 'theme03_content_v3',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风三栏内容',
  description: '三栏内容卡片并排展示',
  needsMedia: false,
  tags: ['content', 'three-column'],
  contentShape: 'three-column-text',
};

export const theme03ContentV3Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '框架' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'FRAMEWORK' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI · VENTURE CAPITAL // USA' },
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三栏{{并行}}分析框架' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'columns', label: '内容栏', type: 'array', minItems: 1, maxItems: 3, itemSchema: [{ key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'text', label: '内容', type: 'textarea', inlineEditable: true }] },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme03ContentV3(props: Theme03ContentV3Props): ReactNode {
  const { tag, tagLabel, topRightMeta, kicker, title, subtitle, columns = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-content-v3">
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

      <div className="lp-theme03-content-v3-main">
        <div className="lp-theme03-content-v3-head lp-rise">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-content-v3-kicker">{kicker}</EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme03-content-v3-title">{title}</EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-content-v3-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-content-v3-columns">
          {columns.map((column, index) => (
            <div key={index} className="lp-theme03-content-v3-col lp-rise">
              <EditableField prop={`columns.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme03-content-v3-col-title">{column.title || ''}</EditableField>
              <EditableField prop={`columns.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-content-v3-col-text">{column.text || ''}</EditableField>
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
