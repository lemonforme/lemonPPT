// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Plus, Ring, SectionTitle, Sheet, normalizeStrings } from './shared.js';

export interface Theme01TableOfContentsV2Props {
  title?: string;
  items: string[];
  desc?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01TableOfContentsV2Meta: LayoutMeta = {
  id: 'theme01_table_of_contents_v2',
  theme: 'theme01',
  role: 'tableOfContents',
  displayName: 'Theme 01 目录 V2',
  description: '彩色编号网格目录',
  needsMedia: false,
};

export const theme01TableOfContentsV2Schema: PropsSchema = {
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

const TOC_EN_LABELS = ['Overview', 'Market', 'Product', 'Data', 'Team', 'Vision', 'Plan', 'Future'];

export function Theme01TableOfContentsV2(props: Theme01TableOfContentsV2Props): ReactNode {
  const { title = '目录', items = [], _slideIdx, _editable } = props;
  const list = normalizeStrings(items);

  return (
    <Sheet substrate="light" frame="stage" className="lp-toc-v2">
      <Plus
        className="lp-toc-grid-plus"
        style={{ bottom: 110, right: 110, transform: 'rotate(20deg)' }}
      />
      <Ring
        className="lp-toc-grid-ring"
        style={{ width: 140, height: 140, top: 100, left: 90, borderColor: 'var(--lp-blue)' }}
      />
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
              <span className="lp-toc-desc">{TOC_EN_LABELS[index % TOC_EN_LABELS.length]}</span>
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
