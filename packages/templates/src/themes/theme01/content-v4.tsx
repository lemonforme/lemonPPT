// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import {
  Blob,
  DottedPattern,
  Folio,
  Headline,
  Pill,
  Ring,
  Sheet,
  Slash,
  VennCircle,
} from './shared.js';

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
  displayName: 'Theme 01 维恩主张',
  description: '居中大标题 + 淡彩半透明维恩圆',
  needsMedia: false,
};

export const theme01ContentV4Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
  ],
};

export function Theme01ContentV4(props: Theme01ContentV4Props): ReactNode {
  const { kicker, title, subtitle, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="pink" frame="stage" className="lp-content-v4">
      <Blob
        className="lp-content-v4-blob"
        style={{ width: 420, height: 420, top: -120, left: -140, background: 'var(--lp-amber)', opacity: 0.13 }}
      />
      <DottedPattern
        className="lp-content-v4-dots"
        style={{ bottom: 100, right: 90, width: 210, height: 210, opacity: 0.22 }}
      />
      <Slash
        className="lp-content-v4-slash"
        style={{ bottom: 130, left: 110, height: 70, background: 'var(--lp-green)', opacity: 0.5 }}
      />
      <Ring
        className="lp-content-v4-ring"
        style={{ top: 130, right: 130, width: 70, height: 70, borderColor: 'var(--lp-blue)' }}
      />

      <div className="lp-content-v4-statement lp-rise">
        {kicker && (
          <div className="lp-content-v4-kicker">
            <Pill variant="fill" color="violet">{kicker}</Pill>
          </div>
        )}
        <Headline cn={title || '核心主张'} size="display" className="lp-content-v4-headline" />
        {subtitle && (
          <EditableField
            prop="subtitle"
            slideIdx={_slideIdx}
            editable={_editable}
            as="p"
            className="lp-content-v4-subtitle"
          >
            {subtitle}
          </EditableField>
        )}
      </div>

      <div className="lp-content-v4-venn lp-rise">
        <VennCircle label="创新" sub="Innovation" color="red" />
        <VennCircle label="效率" sub="Efficiency" color="amber" />
        <VennCircle label="体验" sub="Experience" color="green" />
        <span className="lp-content-v4-venn-center">CORE</span>
      </div>

      <Folio
        left="STATEMENT"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
