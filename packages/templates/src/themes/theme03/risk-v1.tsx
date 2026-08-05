// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme03RiskV1Item {
  risk?: string;
  impact?: string;
  response?: string;
}

export interface Theme03RiskV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  items?: Theme03RiskV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03RiskV1Meta: LayoutMeta = {
  id: 'theme03_risk_v1',
  theme: 'theme03',
  role: 'content',
  displayName: 'Theme 03 编辑风风险研判',
  description: '深色代码编辑风风险列表 + 影响程度 + 应对策略',
  needsMedia: false,
  tags: ['content', 'risk', 'analysis'],
  contentShape: 'risk-cards',
};

export const theme03RiskV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '风险' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'RISK' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{风险}}研判' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      itemSchema: [
        { key: 'risk', label: '风险', type: 'text', inlineEditable: true },
        { key: 'impact', label: '影响程度', type: 'text', inlineEditable: true },
        { key: 'response', label: '应对策略', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-risk-v1-title lp-rise">
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

export function Theme03RiskV1(props: Theme03RiskV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title = '风险研判', subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme03-risk-v1">
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

      <div className="lp-theme03-risk-v1-main">
        <div className="lp-theme03-risk-v1-head lp-rise">
          {renderTitle(title, _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-risk-v1-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {items.length > 0 && (
          <div className="lp-theme03-risk-v1-grid lp-rise">
            {items.map((item, index) => (
              <div key={index} className="lp-theme03-risk-v1-card">
                <div className="lp-theme03-risk-v1-header">
                  <EditableField
                    prop={`items.${index}.risk`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="h3"
                    className="lp-theme03-risk-v1-risk"
                  >
                    {item.risk || ''}
                  </EditableField>
                  <span className="lp-theme03-risk-v1-index">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="lp-theme03-risk-v1-body">
                  <div className="lp-theme03-risk-v1-row">
                    <span className="lp-theme03-risk-v1-label">影响程度</span>
                    <EditableField
                      prop={`items.${index}.impact`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-theme03-risk-v1-impact"
                    >
                      {item.impact || ''}
                    </EditableField>
                  </div>
                  <div className="lp-theme03-risk-v1-row">
                    <span className="lp-theme03-risk-v1-label">应对策略</span>
                    <EditableField
                      prop={`items.${index}.response`}
                      slideIdx={_slideIdx}
                      editable={_editable}
                      as="span"
                      className="lp-theme03-risk-v1-response"
                    >
                      {item.response || ''}
                    </EditableField>
                  </div>
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
