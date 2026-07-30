// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme04FilmstripV1Item {
  image?: string;
  caption?: string;
}

export interface Theme04FilmstripV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  images?: Theme04FilmstripV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04FilmstripV1Meta: LayoutMeta = {
  id: 'theme04_filmstrip_v1',
  theme: 'theme04',
  role: 'gallery',
  displayName: 'Theme 04 胶片印样画廊',
  description: '横向胶片式图片长卷，展示连续画面',
  needsMedia: true,
  tags: ['gallery', 'filmstrip', 'images', 'candy'],
  contentShape: 'title-grid',
};

export const theme04FilmstripV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '影像长卷' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{产品故事}}胶片长卷' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '用连续画面讲述关键历程' },
    {
      key: 'images',
      label: '图片',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [
        { image: '', caption: '阶段一' },
        { image: '', caption: '阶段二' },
        { image: '', caption: '阶段三' },
        { image: '', caption: '阶段四' },
        { image: '', caption: '阶段五' },
      ],
      itemSchema: [
        { key: 'image', label: '图片', type: 'image' },
        { key: 'caption', label: '说明', type: 'text' },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-filmstrip-title lp-rise">
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

export function Theme04FilmstripV1(props: Theme04FilmstripV1Props): ReactNode {
  const { kicker, title, subtitle, images, _slideIdx, _editable } = props;
  const validImages = (images || []).slice(0, 8);

  return (
    <div className="lp-slide lp-theme04-filmstrip">
      <div className="lp-theme04-filmstrip-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-filmstrip-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-filmstrip-track lp-rise">
        {validImages.map((item, idx) => (
          <div key={idx} className="lp-theme04-filmstrip-frame" style={{ animationDelay: `${idx * 80}ms` }}>
            <div className="lp-theme04-filmstrip-frame-image">
              <LpEditableImage prop={`images.${idx}.image`} slideIdx={_slideIdx} editable={_editable} src={item.image} />
            </div>
            {item.caption && (
              <EditableField prop={`images.${idx}.caption`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-filmstrip-frame-caption">{item.caption}</EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
