// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 卷首题词（epigraph_v1）
 * 基底：纸 | 骨架：stage | 图位：0
 *
 * 纯文字的卷首题词页：大字衬线引文 + 首字下沉 + 出处 + 分隔规线。
 * 杂志「卷首语 / 章节题词」页，无影像，靠排版承托分量。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, Masthead, Sheet, Rule } from './shared.js';

export interface Theme09EpigraphV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  quote: string;
  attribution?: string;
  attributionEn?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09EpigraphV1Meta: LayoutMeta = {
  id: 'theme09_epigraph_v1',
  theme: 'theme09',
  role: 'quote',
  displayName: 'Theme 09 卷首题词',
  description: '纯文字卷首题词，大字衬线引文 + 首字下沉 + 出处，章节题词页',
  needsMedia: false,
  mediaSlots: [],
  tags: ['text', 'epigraph', 'quote', 'editorial'],
  contentShape: 'epigraph',
};

export const theme09EpigraphV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '卷首' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Epigraph' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    {
      key: 'quote',
      label: '题词',
      type: 'textarea',
      inlineEditable: true,
      defaultValue: '我们习惯用更多功能去回答一个问题，却很少停下来问：这个问题，本身值得被回答吗？',
    },
    { key: 'attribution', label: '出处', type: 'text', inlineEditable: true, defaultValue: '—— 主编手记' },
    { key: 'attributionEn', label: '出处英文', type: 'text', inlineEditable: true, defaultValue: 'From the Editor' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '卷首 · 题词' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '03' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09EpigraphV1(props: Theme09EpigraphV1Props): ReactNode {
  const {
    section, sectionEn, mark, quote, attribution, attributionEn,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  return (
    <Sheet substrate="paper" frame="stage" className="lp-theme09-epigraph" cropMarks>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-epigraph-body lp-rise">
        <span className="lp-theme09-epigraph-mark" aria-hidden="true">❛</span>
        <EditableField prop="quote" slideIdx={s} editable={e} as="blockquote" className="lp-theme09-epigraph-quote">
          {quote}
        </EditableField>
        <Rule className="lp-theme09-epigraph-rule" />
        <div className="lp-theme09-epigraph-attr">
          {attribution && (
            <EditableField prop="attribution" slideIdx={s} editable={e} as="cite" className="lp-theme09-epigraph-attr-cn">
              {attribution}
            </EditableField>
          )}
          {attributionEn && (
            <EditableField prop="attributionEn" slideIdx={s} editable={e} as="span" className="lp-theme09-epigraph-attr-en">
              {attributionEn}
            </EditableField>
          )}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
