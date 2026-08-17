// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02CoverV3Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02CoverV3Meta: LayoutMeta = {
  id: 'theme02_cover_v3',
  theme: 'theme02',
  role: 'cover',
  displayName: 'Theme 02 霓虹封面 B',
  description: '居中标题式封面，上下光晕对称',
  needsMedia: false,
};

export const theme02CoverV3Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'date', label: '日期', type: 'text', inlineEditable: true },
  ],
};

export function Theme02CoverV3(props: Theme02CoverV3Props): ReactNode {
  const { kicker, title, subtitle, date, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-cover-v3">
      <div className="lp-theme02-orb lp-theme02-orb--accent" style={{ top: '-160px', left: '-120px', width: '480px', height: '480px' }} />
      <div className="lp-theme02-orb lp-theme02-orb--cool" style={{ bottom: '-180px', right: '-120px', width: '520px', height: '520px' }} />
      <div className="lp-theme02-cover-v3-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-cover-v3-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-cover-v3-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
        {date && (
          <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-cover-v3-date lp-rise">
            {date}
          </EditableField>
        )}
      </div>
    </div>
  );
}
