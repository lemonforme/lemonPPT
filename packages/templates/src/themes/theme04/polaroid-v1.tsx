// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04PolaroidV1Image {
  caption?: string;
  image?: string;
}

export interface Theme04PolaroidV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  images?: Theme04PolaroidV1Image[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04PolaroidV1Meta: LayoutMeta = {
  id: 'theme04_polaroid_v1',
  theme: 'theme04',
  role: 'gallery',
  displayName: 'Theme 04 拍立得拼贴',
  description: '3-4 张拍立得风格卡片，轻微旋转错落排列',
  needsMedia: true,
  tags: ['gallery', 'polaroid', 'collage', 'candy'],
  contentShape: 'image-grid',
};

export const theme04PolaroidV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '瞬间' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{高光}}时刻' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '那些决定格局的关键画面' },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { caption: '产品发布' },
        { caption: '团队合影' },
        { caption: '用户增长' },
        { caption: '里程碑' },
      ],
      itemSchema: [
        { key: 'image', label: '图片', type: 'image' },
        { key: 'caption', label: '说明', type: 'text' },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-polaroid-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04PolaroidV1(props: Theme04PolaroidV1Props): ReactNode {
  const { kicker, title, subtitle, images, footnote, _slideIdx, _editable } = props;
  const safeImages = (images || []).slice(0, 4);
  const rotations = [-4, 3, -2, 5];

  return (
    <div className="lp-slide lp-theme04-polaroid">
      <div className="lp-theme04-polaroid-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-polaroid-subtitle">{subtitle}</EditableField>
        )}
      </div>

      {safeImages.length > 0 && (
        <div className={`lp-theme04-polaroid-grid lp-theme04-polaroid-grid--${safeImages.length} lp-rise`}>
          {safeImages.map((img, idx) => (
            <div
              key={idx}
              className="lp-theme04-polaroid-card"
              style={{ transform: `rotate(${rotations[idx] || 0}deg)` }}
            >
              <div className="lp-theme04-polaroid-image-wrap">
                <LpEditableImage
                  className="lp-theme04-polaroid-image"
                  src={img.image}
                  alt={img.caption || ''}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  prop={`images.${idx}.image`}
                  placeholderClassName="lp-editable-image-placeholder lp-theme04-polaroid-image-placeholder"
                  placeholderText="图片"
                  showIcon={true}
                />
              </div>
              {img.caption && (
                <EditableField prop={`images.${idx}.caption`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-polaroid-caption">{img.caption}</EditableField>
              )}
            </div>
          ))}
        </div>
      )}

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-polaroid-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
