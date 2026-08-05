// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme05CoverHeroV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  image?: string;
  overlayScheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05CoverHeroV1Meta: LayoutMeta = {
  id: 'theme05_cover_hero_v1',
  theme: 'theme05',
  role: 'cover',
  displayName: 'Theme 05 封面 大图主视觉',
  description: '全屏大图背景 + 渐变遮罩 + 底部大标题',
  needsMedia: true,
  tags: ['cover', 'spectrum', 'hero', 'image'],
  contentShape: 'cover',
};

export const theme05CoverHeroV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'DATA REPORT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2026 全球 AI 大额融资年报' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从资本热度看行业格局演变' },
    { key: 'image', label: '背景图', type: 'image' },
    {
      key: 'overlayScheme',
      label: '遮罩强调色',
      type: 'select',
      defaultValue: 'indigo',
      options: [
        { value: 'coral', label: '珊瑚红' },
        { value: 'amber', label: '琥珀黄' },
        { value: 'teal', label: '青绿' },
        { value: 'indigo', label: '靛蓝' },
        { value: 'violet', label: '紫罗兰' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '01' },
  ],
};

function overlayClass(scheme?: string): string {
  return `lp-theme05-cover-hero-overlay--${scheme || 'indigo'}`;
}

export function Theme05CoverHeroV1(props: Theme05CoverHeroV1Props): ReactNode {
  const { tag, title, subtitle, image, overlayScheme = 'indigo', footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-cover-hero">
      <div className="lp-theme05-cover-hero-media">
        <LpEditableImage
          src={image}
          prop="image"
          slideIdx={_slideIdx}
          editable={_editable}
          placeholderClassName="lp-theme05-cover-hero-placeholder"
          placeholderText="点击上传封面大图"
        />
      </div>
      <div className={`lp-theme05-cover-hero-overlay ${overlayClass(overlayScheme)}`} aria-hidden="true" />
      <div className="lp-theme05-cover-hero-content lp-rise">
        {tag && (
          <div className="lp-theme05-kicker">
            <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>
          </div>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme05-cover-hero-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-cover-hero-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="lp-theme05-footer lp-theme05-cover-hero-footer">
        <span className="lp-theme05-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        </span>
        <span className="lp-theme05-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
    </div>
  );
}
