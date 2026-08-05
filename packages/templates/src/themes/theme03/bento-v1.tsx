// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03BentoV1Item {
  label?: string;
  value?: string;
  unit?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface Theme03BentoV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  items?: Theme03BentoV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03BentoV1Meta: LayoutMeta = {
  id: 'theme03_bento_v1',
  theme: 'theme03',
  role: 'bento',
  displayName: 'Theme 03 编辑风 Bento',
  description: '深色代码编辑风模块化数据卡片网格',
  needsMedia: false,
  tags: ['bento', 'metrics', 'grid'],
  contentShape: 'bento-grid',
};

export const theme03BentoV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '数据看板' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'BENTO' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{增长}}引擎一览' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'items',
      label: '数据项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'size', label: '尺寸', type: 'select', options: [{ value: 'small', label: '小' }, { value: 'medium', label: '中' }, { value: 'large', label: '大' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-bento-title lp-rise">
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

export function Theme03BentoV1(props: Theme03BentoV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validItems = items.filter((i) => i != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme03-bento-v1 lp-theme03-grid-bg">
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

      <div className="lp-theme03-bento-main">
        <div className="lp-theme03-bento-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-bento-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validItems.length > 0 && (
          <div className="lp-theme03-bento-grid">
            {validItems.map((item, idx) => (
              <div
                key={idx}
                className={`lp-theme03-bento-card lp-rise lp-theme03-bento-card--${item.size || 'medium'}`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="lp-theme03-bento-card-corner" aria-hidden="true" />
                <div className="lp-theme03-bento-card-value">
                  <EditableField prop={`items.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{item.value}</EditableField>
                  {item.unit && (
                    <EditableField prop={`items.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-bento-card-unit">{item.unit}</EditableField>
                  )}
                </div>
                <EditableField prop={`items.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-bento-card-label">{item.label}</EditableField>
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
