// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03SwotV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  strength?: string;
  weakness?: string;
  opportunity?: string;
  threat?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03SwotV1Meta: LayoutMeta = {
  id: 'theme03_swot_v1',
  theme: 'theme03',
  role: 'swot',
  displayName: 'Theme 03 编辑风 SWOT',
  description: '顶部标签 + 2×2 矩阵 + mono 象限标签',
  needsMedia: false,
  tags: ['swot', 'analysis', 'strategy'],
  contentShape: 'quad-matrix',
};

export const theme03SwotV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '战略分析' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '10' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'STRATEGY // SWOT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{SWOT}}：看清内外部环境' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'strength', label: '优势', type: 'textarea', inlineEditable: true },
    { key: 'weakness', label: '劣势', type: 'textarea', inlineEditable: true },
    { key: 'opportunity', label: '机会', type: 'textarea', inlineEditable: true },
    { key: 'threat', label: '威胁', type: 'textarea', inlineEditable: true },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-swot-title lp-rise">
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

export function Theme03SwotV1(props: Theme03SwotV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    strength,
    weakness,
    opportunity,
    threat,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const cells = [
    { key: 'strength', label: 'S', subtitle: '优势', value: strength, cls: 'lp-theme03-swot--s' },
    { key: 'weakness', label: 'W', subtitle: '劣势', value: weakness, cls: 'lp-theme03-swot--w' },
    { key: 'opportunity', label: 'O', subtitle: '机会', value: opportunity, cls: 'lp-theme03-swot--o' },
    { key: 'threat', label: 'T', subtitle: '威胁', value: threat, cls: 'lp-theme03-swot--t' },
  ];

  return (
    <div className="lp-slide lp-theme03-swot-v1">
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

      <div className="lp-theme03-swot-main">
        <div className="lp-theme03-swot-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-swot-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-swot-grid">
          {cells.map((cell, index) => (
            <div
              key={cell.key}
              className={`lp-theme03-swot-cell lp-rise ${cell.cls}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="lp-theme03-swot-label-group">
                <div className="lp-theme03-swot-label">{cell.label}</div>
                <div className="lp-theme03-swot-label-subtitle">{cell.subtitle}</div>
              </div>
              <EditableField
                prop={cell.key}
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-theme03-swot-value"
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
