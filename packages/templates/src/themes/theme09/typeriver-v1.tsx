// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 字流版面（typeriver_v1）
 * 基底：墨 | 骨架：column-3 | 图位：—
 *
 * 巨字层叠成"字流"，专色高亮关键词。
 * 杂志「标语字阵 / 关键词云」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { ColorBar, Folio, Masthead, Sheet } from './shared.js';

export interface Theme09TyperiverV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  kicker?: string;
  lines?: string;
  highlights?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09TyperiverV1Meta: LayoutMeta = {
  id: 'theme09_typeriver_v1',
  theme: 'theme09',
  role: 'quote',
  displayName: 'Theme 09 字流版面',
  description: '巨字层叠字流 + 专色高亮关键词，标语字阵 / 关键词云栏',
  needsMedia: false,
  mediaSlots: [],
  tags: ['typography', 'keywords', 'editorial', 'ink'],
  contentShape: 'typeriver',
};

export const theme09TyperiverV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: 'KEYWORDS' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: '' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: '2024' },
    { key: 'kicker', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '如果只用几个词，概括这一年的 AI 资本——' },
    { key: 'lines', label: '字流行（每行一词，逗号分隔）', type: 'text', inlineEditable: true, defaultValue: '集中,分化,押注,兑现,退潮' },
    { key: 'highlights', label: '高亮行索引（逗号分隔）', type: 'text', inlineEditable: true, defaultValue: '2' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '字流 · 标语' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '12' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09TyperiverV1(props: Theme09TyperiverV1Props): ReactNode {
  const {
    section, sectionEn, mark, kicker, lines = '', highlights = '',
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;

  const hiSet = new Set(
    String(highlights || '')
      .split(/[,，]/)
      .map((x: string) => parseInt(x.trim(), 10))
      .filter((n: number) => !isNaN(n)),
  );

  const rawLines = Array.isArray(lines) ? lines.join(',') : String(lines || '');
  const lineList = rawLines.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean);

  return (
    <Sheet substrate="ink" frame="column-3" className="lp-theme09-typeriver" accent grain={false}>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} variant="bare" />

      <div className="lp-theme09-typeriver-inner">
        {kicker && (
          <p className="lp-theme09-typeriver-kicker lp-rise">
            <EditableField prop="kicker" slideIdx={s} editable={e}>{kicker}</EditableField>
          </p>
        )}

        <div className="lp-theme09-typeriver-river">
          {lineList.map((line: string, i: number) => (
            <div
              key={i}
              className={`lp-theme09-typeriver-line ${hiSet.has(i) ? 'highlight' : ''}`}
              style={{ '--t9-river-i': String(i + 1) } as React.CSSProperties}
            >
              <EditableField
                prop={`lines.${i}`}
                slideIdx={s}
                editable={e}
                as="span"
                className="lp-theme09-typeriver-word"
              >
                {line}
              </EditableField>
              {/* 英文标注 */}
              <span className="lp-theme09-typeriver-en" aria-hidden="true">
                {['CONCENTRATION', 'DIVERGENCE', 'BIG BETS', 'DELIVERY', 'RETREAT'][i] || ''}
              </span>
            </div>
          ))}
        </div>

        <ColorBar count={5} direction="column" labeled />
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} inverse />
    </Sheet>
  );
}
