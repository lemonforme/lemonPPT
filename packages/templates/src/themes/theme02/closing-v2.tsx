// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ClosingV2Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cta?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ClosingV2Meta: LayoutMeta = {
  id: 'theme02_closing_v2',
  theme: 'theme02',
  role: 'closing',
  displayName: 'Theme 02 收尾 B',
  description: '居中收尾页，大标题 + 行动号召',
  needsMedia: false,
};

export const theme02ClosingV2Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'cta', label: '行动号召', type: 'text', inlineEditable: true },
  ],
};

export function Theme02ClosingV2(props: Theme02ClosingV2Props): ReactNode {
  const { kicker, title, subtitle, cta, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-closing-v2">
      <div className="lp-theme02-orb lp-theme02-orb--accent" style={{ top: '20%', left: '-140px', width: '460px', height: '460px' }} />
      <div className="lp-theme02-orb lp-theme02-orb--cool" style={{ bottom: '10%', right: '-140px', width: '460px', height: '460px' }} />
      <div className="lp-theme02-closing-v2-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-closing-v2-title lp-rise">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-closing-v2-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
        {cta && (
          <EditableField prop="cta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-closing-v2-cta lp-rise">
            {cta}
          </EditableField>
        )}
      </div>
    </div>
  );
}
