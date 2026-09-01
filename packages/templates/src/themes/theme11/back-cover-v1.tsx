// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 封底（back_cover_v1）
 * 情绪：aurora | 骨架：full-bleed
 * 品牌标语 + 联系信息 + 弥散光装饰。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, SignalLine, type Theme11Mood } from './shared.js';

export interface Theme11BackCoverV1Props {
  brand: string;
  slogan?: string;
  contacts?: { label: string; value: string }[];
  footer?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11BackCoverV1Meta: LayoutMeta = {
  id: 'theme11_back_cover_v1',
  theme: 'theme11',
  role: 'closing',
  displayName: 'Theme 11 封底',
  description: '品牌标语 + 联系信息 + 弥散光装饰',
  needsMedia: false,
  tags: ['closing', 'back-cover', 'light-stream'],
  contentShape: 'closing',
};

export const theme11BackCoverV1Schema: PropsSchema = {
  fields: [
    { key: 'brand', label: '品牌名', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT' },
    { key: 'slogan', label: '品牌标语', type: 'textarea', inlineEditable: true, defaultValue: '把想法变成值得分享的画面。' },
    {
      key: 'contacts',
      label: '联系方式',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { label: '邮箱', value: 'hello@lemonppt.dev' },
        { label: '网站', value: 'www.lemonppt.dev' },
        { label: '地址', value: '上海市浦东新区' },
        { label: '电话', value: '+86 21 8888 8888' },
      ],
      itemSchema: [
        { key: 'label', label: '类型', type: 'text' },
        { key: 'value', label: '内容', type: 'text' },
      ],
    },
    { key: 'footer', label: '底部小字', type: 'text', inlineEditable: true, defaultValue: '© 2026 lemonforme. All rights reserved.' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11BackCoverV1(props: Theme11BackCoverV1Props): ReactNode {
  const { brand, slogan, contacts = [], footer, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-back-cover">
      <div className="lp-theme11-back-cover-inner lp-rise">
        <SignalLine />
        <EditableField prop="brand" slideIdx={s} editable={e} as="h2" className="lp-theme11-back-cover-brand">{brand}</EditableField>
        {slogan && <EditableField prop="slogan" slideIdx={s} editable={e} as="p" className="lp-theme11-back-cover-slogan">{slogan}</EditableField>}
        {contacts.length > 0 && (
          <div className="lp-theme11-back-cover-contacts">
            {contacts.map((c, i) => (
              <div key={i} className="lp-theme11-back-cover-contact">
                <span className="lp-theme11-back-cover-contact-label">{c.label}</span>
                <EditableField prop={`contacts.${i}.value`} slideIdx={s} editable={e} as="span" className="lp-theme11-back-cover-contact-value">{c.value}</EditableField>
              </div>
            ))}
          </div>
        )}
        {footer && <EditableField prop="footer" slideIdx={s} editable={e} as="div" className="lp-theme11-back-cover-footer">{footer}</EditableField>}
      </div>
    </Sheet>
  );
}
