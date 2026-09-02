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
  IconHeading,
  NumberSticker,
  Pill,
  Plus,
  Ring,
  Sheet,
  Slash,
} from './shared.js';

export interface Theme01ContentV3Column {
  title?: string;
  text?: string;
}

export interface Theme01ContentV3Props {
  kicker?: string;
  title: string;
  columns?: Theme01ContentV3Column[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ContentV3Meta: LayoutMeta = {
  id: 'theme01_content_v3',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 三栏内容',
  description: '三栏图标标题组：强调并列结构与信息层级',
  needsMedia: false,
};

export const theme01ContentV3Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    {
      key: 'columns',
      label: 'columns',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'text', label: '内容', type: 'textarea', inlineEditable: true },
      ],
    },
  ],
};

const ACCENT_ICONS = ['●', '◆', '▲'] as const;
const ACCENT_COLORS = ['red', 'blue', 'green'] as const;

export function Theme01ContentV3(props: Theme01ContentV3Props): ReactNode {
  const { kicker, title, columns = [], _slideIdx, _editable } = props;

  return (
    <Sheet substrate="tint" tint="green" frame="column-3" className="lp-content-v3">
      <Blob
        className="lp-content-v3-blob"
        style={{ width: 360, height: 360, top: -120, left: -100, background: 'var(--lp-green)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-content-v3-dots"
        style={{ bottom: 90, right: 70, width: 190, height: 190, opacity: 0.22 }}
      />
      <Slash
        className="lp-content-v3-slash"
        style={{ top: 110, right: 120, height: 70, background: 'var(--lp-amber)', opacity: 0.55 }}
      />
      <Plus
        className="lp-content-v3-plus"
        style={{ bottom: 110, left: 100, width: 28, height: 28, color: 'var(--lp-blue)' }}
      />
      <Ring
        className="lp-content-v3-ring"
        style={{ top: 120, right: 100, width: 56, height: 56, borderColor: 'var(--lp-red)' }}
      />

      <div className="lp-content-v3-header lp-rise">
        {kicker && (
          <div className="lp-content-v3-kicker">
            <Pill variant="fill" color="green">{kicker}</Pill>
          </div>
        )}
        <Headline cn={title || '三栏内容'} size="large" className="lp-content-v3-headline" />
      </div>

      <div className="lp-content-v3-grid lp-rise">
        {columns.map((column, index) => {
          const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
          const icon = ACCENT_ICONS[index % ACCENT_ICONS.length];
          return (
            <div key={index} className={`lp-content-v3-col color-${color}`}>
              <div className="lp-content-v3-col-top">
                <NumberSticker
                  value={String(index + 1).padStart(2, '0')}
                  className={`lp-content-v3-col-number color-${color}`}
                />
                <div className="lp-content-v3-col-bar" aria-hidden="true" />
              </div>
              <IconHeading
                icon={icon}
                title={
                  <EditableField
                    prop={`columns.${index}.title`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                  >
                    {column.title || ''}
                  </EditableField>
                }
                subtitle={
                  <EditableField
                    prop={`columns.${index}.text`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                  >
                    {column.text || ''}
                  </EditableField>
                }
                color={color}
                className="lp-content-v3-col-heading"
              />
            </div>
          );
        })}
      </div>

      <Folio
        left="CONTENT"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
