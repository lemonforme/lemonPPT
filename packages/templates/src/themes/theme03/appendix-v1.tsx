// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03AppendixV1Item {
  label?: string;
  value?: string;
}

export interface Theme03AppendixV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  sources?: Theme03AppendixV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03AppendixV1Meta: LayoutMeta = {
  id: 'theme03_appendix_v1',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风附录页',
  description: '深色代码编辑风数据来源与参考资料列表',
  needsMedia: false,
  tags: ['content', 'appendix', 'sources'],
  contentShape: 'source-list',
};

export const theme03AppendixV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '附录' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'APPENDIX' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{附录}} / 数据来源' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'sources',
      label: 'sources',
      type: 'array',
      maxItems: 10,
      minItems: 1,
      itemSchema: [
        { key: 'label', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-appendix-v1-title lp-rise">
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

export function Theme03AppendixV1(props: Theme03AppendixV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title = '附录 / 数据来源', subtitle, sources = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-appendix-v1">
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

      <div className="lp-theme03-appendix-v1-main">
        <div className="lp-theme03-appendix-v1-head lp-rise">
          {renderTitle(title, _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-appendix-v1-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {sources.length > 0 && (
          <div className="lp-theme03-appendix-v1-list lp-rise">
            {sources.map((source, index) => (
              <div key={index} className="lp-theme03-appendix-v1-row">
                {source.label && (
                  <EditableField prop={`sources.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-appendix-v1-label">
                    {source.label}
                  </EditableField>
                )}
                <EditableField prop={`sources.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-appendix-v1-value">
                  {source.value || ''}
                </EditableField>
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
