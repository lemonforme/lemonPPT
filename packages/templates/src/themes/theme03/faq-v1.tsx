// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03FaqV1Item {
  q?: string;
  a?: string;
}

export interface Theme03FaqV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  items?: Theme03FaqV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03FaqV1Meta: LayoutMeta = {
  id: 'theme03_faq_v1',
  theme: 'theme03',
  role: 'faq',
  displayName: 'Theme 03 编辑风 FAQ',
  description: '深色代码编辑风问答页，Q/A 卡片列表',
  needsMedia: false,
  tags: ['faq', 'qna', 'questions'],
  contentShape: 'qa-list',
};

export const theme03FaqV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '常见问题' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'FAQ' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '你还想{{了解}}什么' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'items',
      label: '问答',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        { key: 'q', label: '问题', type: 'text' },
        { key: 'a', label: '答案', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-faq-title lp-rise">
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

export function Theme03FaqV1(props: Theme03FaqV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, items, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validItems = (items || []).filter((i) => i != null);

  return (
    <div className="lp-slide lp-theme03-faq-v1">
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

      <div className="lp-theme03-faq-main">
        <div className="lp-theme03-faq-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-faq-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validItems.length > 0 && (
          <div className="lp-theme03-faq-list lp-rise">
            {validItems.map((item, idx) => (
              <div key={idx} className="lp-theme03-faq-card">
                <div className="lp-theme03-faq-question">
                  <span className="lp-theme03-faq-marker lp-theme03-faq-marker--q">Q</span>
                  <EditableField prop={`items.${idx}.q`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-faq-q-text">{item.q}</EditableField>
                </div>
                <div className="lp-theme03-faq-answer">
                  <span className="lp-theme03-faq-marker lp-theme03-faq-marker--a">A</span>
                  <EditableField prop={`items.${idx}.a`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-faq-a-text">{item.a}</EditableField>
                </div>
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
