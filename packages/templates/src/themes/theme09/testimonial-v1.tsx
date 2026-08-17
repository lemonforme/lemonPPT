// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 人物证言（testimonial_v1）
 * 基底：纸 | 骨架：column-3 | 图位：1
 *
 * 左侧网点半调人物肖像（印刷肖像语汇），右侧大字证言 + 署名与职务。
 * 杂志「用户之声 / 访谈」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09TestimonialV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  quote: string;
  name?: string;
  role?: string;
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09TestimonialV1Meta: LayoutMeta = {
  id: 'theme09_testimonial_v1',
  theme: 'theme09',
  role: 'testimonial',
  displayName: 'Theme 09 人物证言',
  description: '网点半调肖像 + 大字证言 + 署名职务，用户之声 / 访谈栏',
  needsMedia: true,
  mediaSlots: [{ name: '人物肖像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['photo', 'testimonial', 'halftone', 'editorial'],
  contentShape: 'testimonial',
};

export const theme09TestimonialV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '用户之声' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Voices' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    {
      key: 'quote',
      label: '证言',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '它没有改变我们的工作，而是改变了我们对「完成」这两个字的理解。',
    },
    { key: 'name', label: '姓名', type: 'text', inlineEditable: true, defaultValue: '林知夏' },
    { key: 'role', label: '职务', type: 'text', inlineEditable: true, defaultValue: '产品负责人 · 某科技公司' },
    { key: 'imageUrl', label: '人物肖像', type: 'image', defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '用户之声 · 证言' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '28' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09TestimonialV1(props: Theme09TestimonialV1Props): ReactNode {
  const {
    section, sectionEn, mark, quote, name, role, imageUrl,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  return (
    <Sheet substrate="paper" frame="column-3" className="lp-theme09-testi">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-testi-body">
        <figure className="lp-theme09-testi-portrait lp-rise">
          <InkPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={s}
            editable={e}
            ratio="3:4"
            halftone
            hint="点击上传人物肖像"
          />
        </figure>

        <div className="lp-theme09-testi-text lp-rise">
          <span className="lp-theme09-testi-mark" aria-hidden="true">“</span>
          <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme09-testi-quote">
            {quote}
          </EditableField>
          <div className="lp-theme09-testi-attr">
            {name && (
              <EditableField prop="name" slideIdx={s} editable={e} as="cite" className="lp-theme09-testi-name">
                {name}
              </EditableField>
            )}
            {role && (
              <EditableField prop="role" slideIdx={s} editable={e} as="span" className="lp-theme09-testi-role">
                {role}
              </EditableField>
            )}
          </div>
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
