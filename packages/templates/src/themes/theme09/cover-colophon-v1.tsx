// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 版本页封面（cover_colophon_v1）
 * 基底：纸 | 骨架：column-3 | 图位：0
 *
 * 版权页式密排信息封面：双线分隔的标题带，下方四栏超细栏线密排信息，
 * 底部色标条 + 版次号。信息量最大的封面变体。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { ColorBar, Sheet, normalizeStrings } from './shared.js';

export interface Theme09CoverColophonV1Col {
  heading: string;
  lines?: string[];
}

export interface Theme09CoverColophonV1Props {
  title: string;
  titleEn?: string;
  cols?: Theme09CoverColophonV1Col[];
  footLeft?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CoverColophonV1Meta: LayoutMeta = {
  id: 'theme09_cover_colophon_v1',
  theme: 'theme09',
  role: 'cover',
  displayName: 'Theme 09 版本页封面',
  description: '版权页式四栏密排信息 + 双线标题带，适合需要交代出品方/参与人的正式文件',
  needsMedia: false,
  tags: ['cover', 'colophon', 'credits', 'paper'],
  contentShape: 'cover-colophon',
};

export const theme09CoverColophonV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '主标题', type: 'text', inlineEditable: true, defaultValue: '2026 品牌年度报告' },
    { key: 'titleEn', label: '英文标注', type: 'text', inlineEditable: true, defaultValue: 'Annual Brand Review · Vol. 09' },
    {
      key: 'cols',
      label: '信息栏',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { heading: 'Published', lines: ['出品：品牌与内容中心', '监制：战略发展部', '发行：2026 年 8 月'] },
        { heading: 'Editorial', lines: ['主编：陈书言', '责编：林之遥 / 沈墨', '校对：内容质量组'] },
        { heading: 'Design', lines: ['视觉统筹：设计中心', '版式：墨韵专色系统', '印制：本白胶版 128g'] },
        { heading: 'Contact', lines: ['brand@lemonppt.com', '内部编号 BR-2026-009', '第 02 册 / 共 06 册'] },
      ],
      itemSchema: [
        { key: 'heading', label: '栏目名', type: 'text' },
        { key: 'lines', label: '条目', type: 'array', itemSchema: [{ key: 'item', label: '行', type: 'text' }] },
      ],
    },
    { key: 'footLeft', label: '底部落款', type: 'text', inlineEditable: true, defaultValue: '© 2026 LEMONPPT · ALL RIGHTS RESERVED' },
  ],
};

export function Theme09CoverColophonV1(props: Theme09CoverColophonV1Props): ReactNode {
  const { title, titleEn, footLeft, _slideIdx: s, _editable: e } = props;
  const cols = (props.cols ?? []).slice(0, 4);

  return (
    <Sheet substrate="paper" frame="column-3" className="lp-theme09-colophon">
      <div className="lp-theme09-colophon-top lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-colophon-title">
          {title}
        </EditableField>
        {titleEn && (
          <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-colophon-en">
            {titleEn}
          </EditableField>
        )}
      </div>

      <div className="lp-theme09-colophon-cols">
        {cols.map((c, i) => {
          const lines = normalizeStrings(c.lines).slice(0, 6);
          return (
            <div key={i} className="lp-theme09-colophon-col lp-rise" style={{ animationDelay: `${60 + i * 50}ms` }}>
              <EditableField prop={`cols.${i}.heading`} slideIdx={s} editable={e} as="div" className="lp-theme09-colophon-h">
                {c.heading}
              </EditableField>
              {lines.map((ln, j) => (
                <EditableField
                  key={j}
                  prop={`cols.${i}.lines.${j}`}
                  slideIdx={s}
                  editable={e}
                  as="span"
                  className="lp-theme09-colophon-line"
                >
                  {ln}
                </EditableField>
              ))}
            </div>
          );
        })}
      </div>

      <div className="lp-theme09-colophon-foot">
        {footLeft && (
          <EditableField prop="footLeft" slideIdx={s} editable={e} as="span" className="lp-theme09-note">
            {footLeft}
          </EditableField>
        )}
        <ColorBar count={6} />
      </div>
    </Sheet>
  );
}
