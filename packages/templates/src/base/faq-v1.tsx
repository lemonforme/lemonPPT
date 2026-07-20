// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface FaqV1Props {
  kicker?: string;
  title: string;
  items?: { q?: string; a?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const faqV1Meta: LayoutMeta = {
  id: 'faq_v1',
  theme: 'base',
  role: 'faq',
  displayName: '问答页',
  description: 'FAQ 问答列表，适合澄清常见疑问',
  needsMedia: false,
};

export function FaqV1(props: FaqV1Props): ReactNode {
  const { kicker, title, items = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-faq-v1">
      <div className="lp-faq-v1-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-faq-v1-list">
        {items.map((item, index) => (
          <div key={index} className="lp-faq-v1-item">
            <div className="lp-faq-v1-question">
              <span className="lp-faq-v1-q">Q</span>
              <EditableField prop={`items.${index}.q`} slideIdx={_slideIdx} editable={_editable} as="span">
                {item.q}
              </EditableField>
            </div>
            <div className="lp-faq-v1-answer">
              <span className="lp-faq-v1-a">A</span>
              <EditableField prop={`items.${index}.a`} slideIdx={_slideIdx} editable={_editable} as="span">
                {item.a}
              </EditableField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
