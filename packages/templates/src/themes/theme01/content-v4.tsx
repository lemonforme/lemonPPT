// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01ContentV4Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ContentV4Meta: LayoutMeta = {
  id: 'theme01_content_v4',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 大字主张',
  description: '全屏大字主张页 + 玻璃卡片',
  needsMedia: false,
};

export const theme01ContentV4Schema: PropsSchema = {
  fields: [
  {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
  },
  {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true
  }
  ]
};


export function Theme01ContentV4(props: Theme01ContentV4Props): ReactNode {
  const { kicker, title, subtitle, _slideIdx, _editable } = props;

  return (
  <div className="lp-slide lp-content-v4">
      <div className="lp-card lp-content-statement lp-rise">
    {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-cover-kicker">
      {kicker}
          </EditableField>
    )}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-content-title">
          {title}
    </EditableField>
    {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-content-subtitle">
      {subtitle}
          </EditableField>
    )}
      </div>
  </div>
  );
}
