// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { HighlightBlock, IconChip, Pill, Plus, Ring, Sheet } from './shared.js';

export interface Theme01CoverV3Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  presenter?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01CoverV3Meta: LayoutMeta = {
  id: 'theme01_cover_v3',
  theme: 'theme01',
  role: 'cover',
  displayName: 'Theme 01 封面 V3',
  description: 'Bento 网格波普封面：彩色色块拼贴 + 图标徽章',
  needsMedia: false,
};

export const theme01CoverV3Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'date', label: '日期', type: 'text', inlineEditable: true },
    { key: 'presenter', label: 'presenter', type: 'text', inlineEditable: true },
  ],
};

export function Theme01CoverV3(props: Theme01CoverV3Props): ReactNode {
  const { kicker, title, subtitle, date, presenter, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="pink" frame="grid" className="lp-cover-v3">
      <Ring
        className="lp-cover-ring"
        style={{ width: 160, height: 160, top: 70, right: 420, borderColor: 'var(--lp-amber)' }}
      />
      <Plus
        className="lp-cover-plus"
        style={{ bottom: 120, right: 380, transform: 'rotate(15deg)' }}
      />
      <div className="lp-cover-main lp-rise">
        <span className="lp-cover-en" aria-hidden="true">Feature Edition</span>
        {kicker && (
          <EditableField
            prop="kicker"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-cover-kicker"
          >
            <Pill variant="fill" color="green">{kicker}</Pill>
          </EditableField>
        )}
        <EditableField
          prop="title"
          slideIdx={_slideIdx}
          editable={_editable}
          as="h1"
          className="lp-cover-title"
        >
          {title}
        </EditableField>
        {subtitle && (
          <EditableField
            prop="subtitle"
            slideIdx={_slideIdx}
            editable={_editable}
            as="p"
            className="lp-cover-subtitle"
          >
            {subtitle}
          </EditableField>
        )}
      </div>

      <HighlightBlock className="lp-cover-bento lp-cover-accent-card lp-rise" color="red">
        <IconChip className="lp-cover-bento-chip" color="amber">✦</IconChip>
        <EditableField
          prop="presenter"
          slideIdx={_slideIdx}
          editable={_editable}
          as="div"
          className="lp-cover-bento-label"
        >
          {presenter || 'Presenter'}
        </EditableField>
      </HighlightBlock>

      <div className="lp-cover-bento lp-rise">
        <div className="lp-cover-meta">
          {date && (
            <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="span">
              {date}
            </EditableField>
          )}
          <Pill variant="outline" color="blue">Theme 01</Pill>
        </div>
      </div>
    </Sheet>
  );
}
