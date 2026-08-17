// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02SectionDividerV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  index?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02SectionDividerV1Meta: LayoutMeta = {
  id: 'theme02_section_divider_v1',
  theme: 'theme02',
  role: 'content',
  displayName: 'Theme 02 分隔条',
  description: '横向分隔条 + 发光规则线',
  needsMedia: false,
};

export const theme02SectionDividerV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'index', label: '序号', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'text', inlineEditable: true },
  ],
};

export function Theme02SectionDividerV1(props: Theme02SectionDividerV1Props): ReactNode {
  const { kicker, title, subtitle, index, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-section-divider-v1">
      <div className="lp-orb lp-theme02-orb--accent" />
      <div className="lp-theme02-section-divider-inner">
        <div className="lp-theme02-section-divider-top">
          {index && (
            <EditableField prop="index" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-section-divider-index">
              {index}
            </EditableField>
          )}
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
        </div>
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-section-divider-title">
          {title}
        </EditableField>
        <div className="lp-theme02-section-divider-rule" />
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-section-divider-subtitle">
            {subtitle}
          </EditableField>
        )}
      </div>
    </div>
  );
}
