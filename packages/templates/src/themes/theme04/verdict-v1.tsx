// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04VerdictV1Props {
  tag?: string;
  title: string;
  subtitle?: string;
  verdict: string;
  verdictLabel?: string;
  cta?: string;
  contact?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04VerdictV1Meta: LayoutMeta = {
  id: 'theme04_verdict_v1',
  theme: 'theme04',
  role: 'closing',
  displayName: 'Theme 04 结论印章页',
  description: '大标题 + 结论词 + 圆形印章装饰的结尾页',
  needsMedia: false,
  tags: ['closing', 'verdict', 'statement', 'candy'],
  contentShape: 'cta',
};

export const theme04VerdictV1Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '最终结论' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 产业已进入{{兑现驱动}}阶段' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '头部格局确立，资本正在向执行力倾斜。' },
    { key: 'verdict', label: '结论词', type: 'text', inlineEditable: true, defaultValue: 'YES' },
    { key: 'verdictLabel', label: '结论标签', type: 'text', inlineEditable: true, defaultValue: 'VERDICT' },
    { key: 'cta', label: '行动按钮', type: 'text', inlineEditable: true, defaultValue: '下载完整报告' },
    { key: 'contact', label: '联系信息', type: 'text', inlineEditable: true, defaultValue: 'hello@lemonforme.com' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-verdict-title lp-rise">
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

export function Theme04VerdictV1(props: Theme04VerdictV1Props): ReactNode {
  const { tag, title, subtitle, verdict, verdictLabel, cta, contact, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-verdict">
      {tag && <div className="lp-theme04-tag lp-rise">{tag}</div>}
      {renderTitle(title || '', _slideIdx, _editable)}
      {subtitle && (
        <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-verdict-subtitle lp-rise">{subtitle}</EditableField>
      )}

      <div className="lp-theme04-verdict-seal lp-rise" aria-hidden="true">
        <div className="lp-theme04-verdict-seal-ring" />
        <div className="lp-theme04-verdict-seal-inner">
          {verdictLabel && <span className="lp-theme04-verdict-seal-label">{verdictLabel}</span>}
          <EditableField prop="verdict" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-verdict-seal-value">{verdict}</EditableField>
        </div>
      </div>

      {cta && (
        <EditableField prop="cta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-verdict-cta lp-rise">{cta}</EditableField>
      )}
      {contact && (
        <EditableField prop="contact" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-verdict-contact lp-rise">{contact}</EditableField>
      )}
    </div>
  );
}
