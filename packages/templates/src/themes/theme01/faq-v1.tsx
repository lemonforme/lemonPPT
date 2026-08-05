// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01FaqV1Props {
  kicker?: string;
  title?: string;
  items?: Array<{ q?: string; a?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01FaqV1Meta: LayoutMeta = {
  id: 'theme01_faq_v1',
  theme: 'theme01',
  role: 'faq',
  displayName: 'Theme 01 FAQ 页',
  description: '玻璃卡片问答列表',
  needsMedia: false,
};

export const theme01FaqV1Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [
    {
          key: 'q',
          label: '问题',
          type: 'text',
          inlineEditable: true
    },
    {
          key: 'a',
          label: '答案',
          type: 'text',
          inlineEditable: true
    }
      ]
  }
  ]
};


export function Theme01FaqV1(props: Theme01FaqV1Props): ReactNode {
  const { kicker, title, items = [], _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-faq-v1">
      <div className="lp-faq-header">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-faq-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-faq-list">
    {items.map((item, index) => (
          <div key={index} className="lp-card lp-faq-card lp-rise">
      <div className="lp-faq-question">
              <span className="lp-faq-marker lp-faq-q">Q</span>
              <EditableField prop={`items.${index}.q`} slideIdx={_slideIdx} editable={_editable} as="h3">
        {item.q}
              </EditableField>
      </div>
      <div className="lp-faq-answer">
              <span className="lp-faq-marker lp-faq-a">A</span>
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
