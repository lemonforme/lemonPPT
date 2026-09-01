// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 观点陈述页（statement_v1）
 * 情绪：daylight | 骨架：stage
 * 一句话核心观点 + 高亮色块 + 说明小字。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, EditableField, GradientCard, SectionTitle, Sheet, type Theme11Mood } from './shared.js';

export interface Theme11StatementV1Props {
  statement: string;
  highlight?: string;
  caption?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11StatementV1Meta: LayoutMeta = {
  id: 'theme11_statement_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 观点陈述页',
  description: '一句话核心观点 + 高亮色块 + 说明小字',
  needsMedia: false,
  tags: ['statement', 'light-stream'],
  contentShape: 'statement',
};

export const theme11StatementV1Schema: PropsSchema = {
  fields: [
    { key: 'statement', label: '核心观点', type: 'textarea', inlineEditable: true, defaultValue: '未来的演示工具不是模板的堆砌，而是数据与设计的实时协作。' },
    { key: 'highlight', label: '高亮词', type: 'text', inlineEditable: true, defaultValue: '实时协作' },
    { key: 'caption', label: '说明', type: 'textarea', inlineEditable: true, defaultValue: '这意味着每一次编辑都能立即反映在结构、版式与品牌规范中。' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11StatementV1(props: Theme11StatementV1Props): ReactNode {
  const { statement, highlight, caption, mood = 'sunset', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="stage" className="lp-theme11-statement">
      <div className="lp-theme11-statement-inner">
        <SectionTitle tone="accent" className="lp-theme11-statement-eyebrow">INSIGHT</SectionTitle>
        <EditableField prop="statement" slideIdx={s} editable={e} as="h2" className="lp-theme11-statement-text">
          {statement}
          {highlight && (
            <GradientCard tone="blue" className="lp-theme11-statement-highlight-card">
              <span className="lp-theme11-statement-highlight">{highlight}</span>
            </GradientCard>
          )}
        </EditableField>
        {caption && <Caption className="lp-theme11-statement-caption"><EditableField prop="caption" slideIdx={s} editable={e} as="span">{caption}</EditableField></Caption>}
      </div>
    </Sheet>
  );
}
