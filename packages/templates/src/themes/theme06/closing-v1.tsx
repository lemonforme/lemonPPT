// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme06ClosingV1Link {
  label?: string;
  value?: string;
}

export interface Theme06ClosingV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  links?: Theme06ClosingV1Link[];
  cta?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ClosingV1Meta: LayoutMeta = {
  id: 'theme06_closing_v1',
  theme: 'theme06',
  role: 'closing',
  displayName: 'Theme 06 封底致谢',
  description: '大标题 + 副标题 + 联系信息卡片 + CTA，支持可选背景图',
  needsMedia: true,
  tags: ['closing', 'contact', 'atlas'],
  contentShape: 'closing',
};

export const theme06ClosingV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'THANK YOU' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '感谢观看' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '期待与您进一步探讨 AI 投资与合作机会。' },
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    {
      key: 'links',
      label: '联系信息',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { label: '邮箱', value: 'hello@lemonppt.dev' },
        { label: '官网', value: 'lemonppt.dev' },
        { label: '地址', value: '上海市浦东新区' },
      ],
      itemSchema: [
        { key: 'label', label: '标签', type: 'text' },
        { key: 'value', label: '内容', type: 'text' },
      ],
    },
    { key: 'cta', label: '行动号召', type: 'text', inlineEditable: true, defaultValue: '立即预约演示 →' },
  ],
};

export function Theme06ClosingV1(props: Theme06ClosingV1Props): ReactNode {
  const { kicker, title, subtitle, imageUrl, links = [], cta, _slideIdx, _editable } = props;
  const validLinks = (links || []).filter((l): l is Theme06ClosingV1Link => l != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme06-closing">
      {imageUrl && (
        <div className="lp-theme06-closing-bg">
          <LpEditableImage
            prop="imageUrl"
            src={imageUrl}
            slideIdx={_slideIdx}
            editable={_editable}
            className="lp-theme06-closing-bg-img"
            placeholderClassName="lp-theme06-closing-bg-placeholder"
            placeholderText="点击上传背景图"
          />
          <div className="lp-theme06-closing-bg-overlay" aria-hidden="true" />
        </div>
      )}
      <div className="lp-theme06-closing-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-closing-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {validLinks.length > 0 && (
        <div className="lp-theme06-closing-grid lp-rise">
          {validLinks.map((link, index) => (
            <div key={index} className="lp-theme06-card">
              <div className="lp-theme06-card-label">{link.label || ''}</div>
              <EditableField prop={`links.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme06-closing-link">{link.value || ''}</EditableField>
            </div>
          ))}
        </div>
      )}

      {cta && (
        <div className="lp-theme06-closing-cta lp-rise">
          <EditableField prop="cta" slideIdx={_slideIdx} editable={_editable} as="span">{cta}</EditableField>
        </div>
      )}

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
