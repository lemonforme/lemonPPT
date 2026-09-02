// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Ring, SectionTitle, Sheet, normalizeStrings } from './shared.js';

export interface Theme01TableOfContentsV1Props {
  title?: string;
  items: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01TableOfContentsV1Meta: LayoutMeta = {
  id: 'theme01_table_of_contents_v1',
  theme: 'theme01',
  role: 'tableOfContents',
  displayName: 'Theme 01 目录',
  description: '细边框目录项 + 彩色编号 + 分节标题',
  needsMedia: false,
};

export const theme01TableOfContentsV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    {
      key: 'items',
      label: '目录项',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
  ],
};

const ACCENT_COLORS = ['red', 'amber', 'green', 'blue', 'violet', 'cyan', 'pink', 'orange'] as const;

export function Theme01TableOfContentsV1(props: Theme01TableOfContentsV1Props): ReactNode {
  const { title = '目录', items = [], _slideIdx, _editable } = props;
  const list = normalizeStrings(items);

  return (
    <Sheet substrate="tint" tint="amber" frame="stage" className="lp-toc-v1">
      <Ring className="lp-toc-decor" style={{ borderColor: 'var(--lp-amber)' }} />
      <SectionTitle
        title={title}
        slideIdx={_slideIdx}
        editable={_editable}
        propTitle="title"
        className="lp-toc-header lp-rise"
      />
      <ol className="lp-toc-list lp-rise">
        {list.map((item, index) => {
          const color = ACCENT_COLORS[index % ACCENT_COLORS.length];
          const page = (_slideIdx ?? 1) + index + 1;
          return (
            <li key={index} className={`lp-toc-item lp-toc-item-${color}`}>
              <span className="lp-toc-number">{String(index + 1).padStart(2, '0')}</span>
              <EditableField
                prop={`items.${index}`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="span"
                className="lp-toc-text"
              >
                {item}
              </EditableField>
              <span className="lp-toc-line" aria-hidden="true" />
              <span className="lp-toc-page">{String(page).padStart(2, '0')}</span>
            </li>
          );
        })}
      </ol>
      <Folio
        left="CONTENTS"
        page={String(_slideIdx ?? 1).padStart(2, '0')}
        right="THEME 01"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
