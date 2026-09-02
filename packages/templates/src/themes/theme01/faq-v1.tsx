// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, Masthead, Headline, Pill, Blob, DottedPattern } from './shared.js';

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
  description: '色块拼贴风问答列表',
  needsMedia: false,
};

export const theme01FaqV1Schema: PropsSchema = {
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
          inlineEditable: true,
        },
        {
          key: 'a',
          label: '答案',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
  ],
};

export function Theme01FaqV1(props: Theme01FaqV1Props): ReactNode {
  const { kicker, title, items = [], _slideIdx, _editable } = props;
  const safeItems = items.slice(0, 6);

  return (
    <Sheet substrate="light" frame="grid" className="lp-faq-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="Q&A" size="large" className="lp-faq-v1-headline lp-rise" />
      <div className="lp-faq-v1-list lp-rise">
        {safeItems.map((item, index) => (
          <div key={index} className="lp-faq-v1-card">
            <div className="lp-faq-v1-question">
              <Pill variant="fill" color="red">Q</Pill>
              <EditableField prop={`items.${index}.q`} slideIdx={_slideIdx} editable={_editable} as="h3">
                {item.q}
              </EditableField>
            </div>
            <div className="lp-faq-v1-answer">
              <Pill variant="fill" color="green">A</Pill>
              <EditableField prop={`items.${index}.a`} slideIdx={_slideIdx} editable={_editable} as="p">
                {item.a}
              </EditableField>
            </div>
          </div>
        ))}
      </div>
      <Blob
        className="lp-faq-v1-blob"
        style={{ width: 320, height: 320, top: -80, right: -60, background: 'var(--lp-blue)', opacity: 0.16 }}
      />
      <DottedPattern
        className="lp-faq-v1-dots"
        style={{ bottom: 100, left: 80, width: 160, height: 160, opacity: 0.22 }}
      />
    </Sheet>
  );
}
