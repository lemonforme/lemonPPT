// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03TagsV1Item {
  label: string;
  value?: number;
  tone?: 'neutral' | 'positive' | 'negative' | 'accent';
}

export interface Theme03TagsV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  tags?: Theme03TagsV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03TagsV1Meta: LayoutMeta = {
  id: 'theme03_tags_v1',
  theme: 'theme03',
  role: 'tags',
  displayName: 'Theme 03 编辑风标签云',
  description: '深色代码编辑风关键词标签云，代码风 mono 编号',
  needsMedia: false,
  tags: ['tags', 'keywords', 'cloud'],
  contentShape: 'tag-cloud',
};

export const theme03TagsV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '关键词' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'TAGS' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{开发者}}关注什么' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'tags',
      label: '关键词',
      type: 'array',
      minItems: 1,
      maxItems: 24,
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'neutral', label: '中性' }, { value: 'positive', label: '积极' }, { value: 'negative', label: '消极' }, { value: 'accent', label: '强调' }] },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-tags-title lp-rise">
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

function toneClass(tone?: string): string {
  switch (tone) {
    case 'positive':
      return 'lp-theme03-tags-v1-tag--positive';
    case 'negative':
      return 'lp-theme03-tags-v1-tag--negative';
    case 'accent':
      return 'lp-theme03-tags-v1-tag--accent';
    default:
      return '';
  }
}

export function Theme03TagsV1(props: Theme03TagsV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, tags = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const safeTags = tags.slice(0, 24);

  return (
    <div className="lp-slide lp-theme03-tags-v1 lp-theme03-grid-bg">
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

      <div className="lp-theme03-tags-main">
        <div className="lp-theme03-tags-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-tags-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {safeTags.length > 0 && (
          <div className="lp-theme03-tags-card lp-rise lp-theme03-corner-bracket">
            <div className="lp-theme03-tags-cloud">
              {safeTags.map((t, idx) => (
                <EditableField
                  key={idx}
                  prop={`tags.${idx}.label`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="span"
                  className={`lp-theme03-tags-v1-tag ${toneClass(t.tone)}`}
                >
                  <span className="lp-theme03-tags-v1-index">{String(idx + 1).padStart(2, '0')}</span>
                  {t.label}
                  {t.value !== undefined && t.value > 0 && <span className="lp-theme03-tags-v1-value">{t.value}</span>}
                </EditableField>
              ))}
            </div>
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
