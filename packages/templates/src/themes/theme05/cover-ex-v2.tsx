// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05CoverExV2Highlight {
  text: string;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05CoverExV2Props {
  tag?: string;
  title: string;
  subtitle?: string;
  backgroundNumber?: string;
  highlights?: Theme05CoverExV2Highlight[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05CoverExV2Meta: LayoutMeta = {
  id: 'theme05_cover_ex_v2',
  theme: 'theme05',
  role: 'cover',
  displayName: 'Theme 05 封面 底部大标题',
  description: '底部大标题 + 背景幽灵数字 + 顶部色块高亮',
  needsMedia: false,
  tags: ['cover', 'spectrum', 'ghost'],
  contentShape: 'cover',
};

export const theme05CoverExV2Schema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: 'DATA REPORT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '2026 全球 AI 大额融资年报' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从资本热度看行业格局演变' },
    { key: 'backgroundNumber', label: '背景大数字', type: 'text', inlineEditable: true, defaultValue: '2026' },
    {
      key: 'highlights',
      label: '顶部高亮标签',
      type: 'array',
      minItems: 0,
      maxItems: 5,
      defaultValue: [
        { text: '大额融资', scheme: 'coral' },
        { text: '行业研究', scheme: 'amber' },
        { text: '趋势洞察', scheme: 'teal' },
      ],
      itemSchema: [
        { key: 'text', label: '文字', type: 'text' },
        {
          key: 'scheme',
          label: '强调色',
          type: 'select',
          defaultValue: 'coral',
          options: [
            { value: 'coral', label: '珊瑚红' },
            { value: 'amber', label: '琥珀黄' },
            { value: 'teal', label: '青绿' },
            { value: 'indigo', label: '靛蓝' },
            { value: 'violet', label: '紫罗兰' },
          ],
        },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '01' },
  ],
};

function highlightClass(scheme?: string): string {
  return `lp-theme05-cover-ex2-highlight--${scheme || 'coral'}`;
}

export function Theme05CoverExV2(props: Theme05CoverExV2Props): ReactNode {
  const { tag, title, subtitle, backgroundNumber, highlights = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme05-cover-ex2">
      {backgroundNumber && (
        <div className="lp-theme05-cover-ex2-bg-number" aria-hidden="true">{backgroundNumber}</div>
      )}
      <div className="lp-theme05-cover-ex2-top lp-rise">
        {tag && (
          <div className="lp-theme05-kicker">
            <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>
          </div>
        )}
        {highlights.length > 0 && (
          <div className="lp-theme05-cover-ex2-highlights">
            {highlights.map((h, i) => (
              <div key={i} className={`lp-theme05-cover-ex2-highlight ${highlightClass(h.scheme)} lp-rise`} style={{ animationDelay: `${i * 60}ms` }}>
                <EditableField prop={`highlights.${i}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{h.text}</EditableField>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="lp-theme05-cover-ex2-main lp-rise">
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme05-cover-ex2-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme05-spectrum-bar lp-rise" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>
      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left">
          {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        </span>
        <span className="lp-theme05-footer-right">
          {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
        </span>
      </div>
    </div>
  );
}
