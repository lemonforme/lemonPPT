// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface TableOfContentsV1Props {
  kicker?: string;
  title: string;
  items?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const tableOfContentsV1Meta: LayoutMeta = {
  id: 'table_of_contents_v1',
  theme: 'base',
  role: 'tableOfContents',
  displayName: '极简目录',
  description: '标题 + 编号目录项',
  needsMedia: false,
};

export function TableOfContentsV1(props: TableOfContentsV1Props): ReactNode {
  const { kicker, title, items = [], _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-table-of-contents-v1">
      <div className="lp-toc-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-toc-title">
          {title}
        </EditableField>
        {items.length > 0 && (
          <ol className="lp-toc-list">
            {items.map((item, index) => (
              <li key={index} className="lp-toc-item">
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
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
