// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03QuadrantV1Item {
  label?: string;
  items?: Array<{ value?: string } | string>;
}

export interface Theme03QuadrantV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  xAxis?: string;
  yAxis?: string;
  quadrants?: Theme03QuadrantV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03QuadrantV1Meta: LayoutMeta = {
  id: 'theme03_quadrant_v1',
  theme: 'theme03',
  role: 'comparison',
  displayName: 'Theme 03 编辑风象限',
  description: '深色代码编辑风 2×2 战略象限，scheme 三色区分',
  needsMedia: false,
  tags: ['comparison', 'quadrant', 'strategy'],
  contentShape: 'quad-matrix',
};

export const theme03QuadrantV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '战略分析' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'QUADRANT' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{优先级}}象限：价值 vs 可行性' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'xAxis', label: '横轴', type: 'text', inlineEditable: true, defaultValue: '可行性 →' },
    { key: 'yAxis', label: '纵轴', type: 'text', inlineEditable: true, defaultValue: '↑ 价值' },
    {
      key: 'quadrants',
      label: '象限',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'items', label: '子项', type: 'array', itemSchema: [{ key: 'value', label: '内容', type: 'text' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-quadrant-title lp-rise">
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

export function Theme03QuadrantV1(props: Theme03QuadrantV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, xAxis, yAxis, quadrants = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeQuadrants = quadrants.slice(0, 4);
  const defaultLabels = ['高价值 / 高可行性', '高价值 / 低可行性', '低价值 / 高可行性', '低价值 / 低可行性'];
  const accentClasses = ['lp-theme03-quadrant-card--accent', 'lp-theme03-quadrant-card--accent2', 'lp-theme03-quadrant-card--cool', 'lp-theme03-quadrant-card--muted'];

  return (
    <div className="lp-slide lp-theme03-quadrant-v1 lp-theme03-grid-bg">
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

      <div className="lp-theme03-quadrant-main">
        <div className="lp-theme03-quadrant-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {(xAxis || yAxis) && (
            <div className="lp-theme03-quadrant-axes">
              {xAxis && <span className="lp-theme03-quadrant-axis">X: {xAxis}</span>}
              {yAxis && <span className="lp-theme03-quadrant-axis">Y: {yAxis}</span>}
            </div>
          )}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-quadrant-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {safeQuadrants.length > 0 && (
          <div className="lp-theme03-quadrant-grid lp-rise">
            {safeQuadrants.map((q, idx) => (
              <div key={idx} className={`lp-theme03-quadrant-card ${accentClasses[idx % accentClasses.length]}`} style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="lp-theme03-quadrant-card-corner" aria-hidden="true" />
                <EditableField prop={`quadrants.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme03-quadrant-card-label">{q.label || defaultLabels[idx] || ''}</EditableField>
                {q.items && q.items.length > 0 && (
                  <ul className="lp-theme03-quadrant-card-items">
                    {q.items.slice(0, 5).map((item, i) => (
                      <li key={i}>
                        <EditableField prop={`quadrants.${idx}.items.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{getItemValue(item)}</EditableField>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
