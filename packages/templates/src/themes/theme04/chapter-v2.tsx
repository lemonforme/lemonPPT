// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04ChapterV2Props {
  number?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  description?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ChapterV2Meta: LayoutMeta = {
  id: 'theme04_chapter_v2',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 分屏章节大字页',
  description: '超大数字/字母 + 章节标题 + 分屏排版',
  needsMedia: false,
  tags: ['chapter', 'section', 'candy'],
  contentShape: 'chapter-split',
};

export const theme04ChapterV2Schema: PropsSchema = {
  fields: [
    { key: 'number', label: '章节编号', type: 'text', inlineEditable: true, defaultValue: '01' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'PART 01' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '市场{{全景}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '全年 970 亿美元 AI 大额融资全景透视' },
    { key: 'description', label: '说明', type: 'textarea', inlineEditable: true, defaultValue: '从单笔 ≥1 亿美元的融资事件出发，追踪资本在模型层、基础设施层与应用层之间的流动。' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-chapter-v2-title lp-rise">
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

export function Theme04ChapterV2(props: Theme04ChapterV2Props): ReactNode {
  const { number, kicker, title, subtitle, description, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme04-chapter-v2">
      <div className="lp-theme04-chapter-v2-left lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-chapter-v2-subtitle">{subtitle}</EditableField>
        )}
        {description && (
          <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-chapter-v2-desc">{description}</EditableField>
        )}
      </div>
      <div className="lp-theme04-chapter-v2-right lp-rise">
        <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chapter-v2-number">{number ?? '01'}</EditableField>
        <div className="lp-theme04-chapter-v2-deco" />
      </div>
    </div>
  );
}
