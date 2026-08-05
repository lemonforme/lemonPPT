// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03PestV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  political?: string;
  economic?: string;
  social?: string;
  technological?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03PestV1Meta: LayoutMeta = {
  id: 'theme03_pest_v1',
  theme: 'theme03',
  role: 'pest',
  displayName: 'Theme 03 编辑风 PEST',
  description: '深色代码编辑风 2x2 PEST 宏观环境分析矩阵',
  needsMedia: false,
  tags: ['pest', 'analysis', 'macro'],
  contentShape: 'quad-matrix',
};

export const theme03PestV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '宏观分析' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'PEST' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'MACRO ANALYSIS' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{PEST}}：看清外部环境' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'political', label: '政治环境', type: 'textarea', inlineEditable: true },
    { key: 'economic', label: '经济环境', type: 'textarea', inlineEditable: true },
    { key: 'social', label: '社会环境', type: 'textarea', inlineEditable: true },
    { key: 'technological', label: '技术环境', type: 'textarea', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-pest-title lp-rise">
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

export function Theme03PestV1(props: Theme03PestV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    political,
    economic,
    social,
    technological,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const cells = [
    { key: 'political', label: 'P', subtitle: '政治环境', value: political, cls: 'lp-theme03-pest--p' },
    { key: 'economic', label: 'E', subtitle: '经济环境', value: economic, cls: 'lp-theme03-pest--e' },
    { key: 'social', label: 'S', subtitle: '社会环境', value: social, cls: 'lp-theme03-pest--s' },
    { key: 'technological', label: 'T', subtitle: '技术环境', value: technological, cls: 'lp-theme03-pest--t' },
  ];

  return (
    <div className="lp-slide lp-theme03-pest-v1">
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

      <div className="lp-theme03-pest-main">
        <div className="lp-theme03-pest-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-pest-subtitle">{subtitle}</EditableField>
          )}
        </div>
        <div className="lp-theme03-pest-grid">
          {cells.map((cell, index) => (
            <div
              key={cell.key}
              className={`lp-theme03-pest-cell lp-rise ${cell.cls}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="lp-theme03-pest-label-group">
                <div className="lp-theme03-pest-label">{cell.label}</div>
                <div className="lp-theme03-pest-label-subtitle">{cell.subtitle}</div>
              </div>
              <EditableField
                prop={cell.key}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-theme03-pest-value"
              >
                {cell.value || cell.subtitle}
              </EditableField>
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
