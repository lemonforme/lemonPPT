// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03PartnersV1Partner {
  name?: string;
  logo?: string;
}

export interface Theme03PartnersV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  partners?: Theme03PartnersV1Partner[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03PartnersV1Meta: LayoutMeta = {
  id: 'theme03_partners_v1',
  theme: 'theme03',
  role: 'partners',
  displayName: 'Theme 03 编辑风伙伴墙',
  description: '深色代码编辑风合作伙伴/客户 Logo 墙',
  needsMedia: true,
  tags: ['partners', 'logos', 'customers'],
  contentShape: 'logo-grid',
};

export const theme03PartnersV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '合作伙伴' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'PARTNERS' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '他们都在{{使用}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'partners',
      label: '合作伙伴',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text' },
        { key: 'logo', label: 'Logo', type: 'image' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-partners-title lp-rise">
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

export function Theme03PartnersV1(props: Theme03PartnersV1Props): ReactNode {
  const { tag, tagLabel, topRightMeta, title, subtitle, partners, footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validPartners = (partners || []).filter((p) => p != null);

  return (
    <div className="lp-slide lp-theme03-partners-v1">
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

      <div className="lp-theme03-partners-main">
        <div className="lp-theme03-partners-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-partners-subtitle">{subtitle}</EditableField>
          )}
        </div>

        {validPartners.length > 0 && (
          <div className="lp-theme03-partners-grid lp-rise">
            {validPartners.map((partner, idx) => (
              <div key={idx} className="lp-theme03-partners-card">
                <LpEditableImage
                  className="lp-theme03-partners-logo"
                  src={partner.logo}
                  alt={partner.name || ''}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  prop={`partners.${idx}.logo`}
                  placeholderClassName="lp-editable-image-placeholder lp-theme03-partners-logo-placeholder"
                  placeholderText="Logo"
                />
                <EditableField prop={`partners.${idx}.name`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-partners-name">{partner.name}</EditableField>
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
