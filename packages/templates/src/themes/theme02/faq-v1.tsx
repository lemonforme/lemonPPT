// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02FaqV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{ q?: string; a?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02FaqV1Meta: LayoutMeta = {
  id: 'theme02_faq_v1',
  theme: 'theme02',
  role: 'faq',
  displayName: 'Theme 02 霓虹 FAQ',
  description: '深色背景 + 霓虹问答卡片列表',
  needsMedia: false,
};

export const theme02FaqV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'items',
      label: '问答',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
        {
          key: 'q',
          label: '问题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'a',
          label: '答案',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
  ],
};

export function Theme02FaqV1(props: Theme02FaqV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-faq-v1">
      <div className="lp-theme02-faq-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-faq-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-faq-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-faq-list">
        {items.map((item, index) => (
          <div key={index} className="lp-theme02-faq-card lp-rise" style={{ animationDelay: `${index * 80}ms` }}>
            <div className="lp-theme02-faq-question">
              <span className="lp-theme02-faq-marker lp-theme02-faq-marker--q">Q</span>
              <EditableField prop={`items.${index}.q`} slideIdx={_slideIdx} editable={_editable} as="h3">
                {item.q}
              </EditableField>
            </div>
            <div className="lp-theme02-faq-answer">
              <span className="lp-theme02-faq-marker lp-theme02-faq-marker--a">A</span>
              <EditableField prop={`items.${index}.a`} slideIdx={_slideIdx} editable={_editable} as="p">
                {item.a}
              </EditableField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
