// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02HighlightV1Props {
  kicker?: string;
  title?: string;
  statement: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02HighlightV1Meta: LayoutMeta = {
  id: 'theme02_highlight_v1',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 关键结论',
  description: '居中大字号关键结论 / 金句卡片',
  needsMedia: false,
};

export const theme02HighlightV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '小标题', type: 'text', inlineEditable: true },
    { key: 'statement', label: '核心结论', type: 'textarea', inlineEditable: true },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true },
  ],
};

export function Theme02HighlightV1(props: Theme02HighlightV1Props): ReactNode {
  const { kicker, title, statement, footnote, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-highlight-v1">
      <div className="lp-theme02-orb lp-theme02-orb--accent" style={{ top: '-140px', left: '40%', width: '520px', height: '520px' }} />
      <div className="lp-card lp-theme02-highlight-card lp-rise">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-theme02-highlight-pill">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme02-highlight-title">
            {title}
          </EditableField>
        )}
        <EditableField prop="statement" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-highlight-statement">
          {statement}
        </EditableField>
        {footnote && (
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-highlight-footnote">
            {footnote}
          </EditableField>
        )}
      </div>
    </div>
  );
}
