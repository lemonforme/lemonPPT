// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ClosingV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  contact?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ClosingV1Meta: LayoutMeta = {
  id: 'theme04_closing_v1',
  theme: 'theme04',
  role: 'closing',
  displayName: 'Theme 04 糖果结尾页',
  description: '居中大标题 + CTA 胶囊按钮，用于核心结论或结尾',
  needsMedia: false,
  tags: ['closing', 'statement', 'candy'],
  contentShape: 'cta',
};

export const theme04ClosingV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '结论' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '资本正在{{重新分配}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: 'AI 产业进入兑现驱动阶段，头部格局已然确立。' },
    { key: 'cta', label: '行动按钮', type: 'text', inlineEditable: true, defaultValue: '下载完整报告' },
    { key: 'contact', label: '联系信息', type: 'text', inlineEditable: true, defaultValue: 'hello@lemonforme.com' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-closing-title lp-rise">
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

export function Theme04ClosingV1(props: Theme04ClosingV1Props): ReactNode {
  const { tag, title, subtitle, cta, contact, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-closing">
      {tag && <div className="lp-theme04-tag lp-rise">{tag}</div>}
      {renderTitle(title || '', _slideIdx, _editable)}
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-closing-subtitle lp-rise">{subtitle}</EditableField>
      )}
      {cta && (
        <EditableField prop="cta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-closing-cta lp-rise">{cta}</EditableField>
      )}
      {contact && (
        <EditableField prop="contact" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-closing-contact lp-rise">{contact}</EditableField>
      )}
    </div>
  );
}
