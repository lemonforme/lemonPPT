// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 研究团队（team_v1）
 * 基底：纸 | 骨架：grid | 图位：6
 *
 * 2×3 网点半调肖像卡，每张含姓名与职务，整体如杂志的「主创名单」。
 * 杂志「团队 / 主创」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09TeamV1Item {
  url?: string;
  name?: string;
  role?: string;
}

export interface Theme09TeamV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  titleEn?: string;
  images?: Theme09TeamV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 6;

export const theme09TeamV1Meta: LayoutMeta = {
  id: 'theme09_team_v1',
  theme: 'theme09',
  role: 'team',
  displayName: 'Theme 09 研究团队',
  description: '2×3 网点半调肖像卡 + 姓名职务，团队 / 主创栏',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `成员 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['photo', 'team', 'halftone', 'editorial'],
  contentShape: 'team',
};

export const theme09TeamV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '主创' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'The Team' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '写下这期特刊的人' },
    { key: 'titleEn', label: '英文标注', type: 'text', inlineEditable: true, defaultValue: 'Who Made This Issue' },
    {
      key: 'images',
      label: '成员',
      type: 'array',
      minItems: 2,
      maxItems: COUNT,
      defaultValue: [
        { url: '', name: '陈默', role: '主编' },
        { url: '', name: '苏野', role: '视觉总监' },
        { url: '', name: '周岚', role: '主笔' },
        { url: '', name: '何远', role: '摄影' },
        { url: '', name: '林夕', role: '数据' },
        { url: '', name: '江白', role: '校对' },
      ],
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'name', label: '姓名', type: 'text', inlineEditable: true },
        { key: 'role', label: '职务', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '主创 · 团队' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '46' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09TeamV1(props: Theme09TeamV1Props): ReactNode {
  const {
    section, sectionEn, mark, title, titleEn,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const raw = (props.images ?? []).slice(0, COUNT);
  const images: Theme09TeamV1Item[] = Array.from({ length: COUNT }, (_, i) => raw[i] ?? {});

  return (
    <Sheet substrate="paper" frame="grid" className="lp-theme09-team">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <div className="lp-theme09-team-head lp-rise">
        <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-team-title">
          {title}
        </EditableField>
        {titleEn && (
          <EditableField prop="titleEn" slideIdx={s} editable={e} as="span" className="lp-theme09-team-en">
            {titleEn}
          </EditableField>
        )}
      </div>

      <div className="lp-theme09-team-grid">
        {images.map((it, i) => (
          <figure key={i} className="lp-theme09-team-cell lp-rise" style={{ animationDelay: `${i * 45}ms` }}>
            <InkPhoto
              prop={`images.${i}.url`}
              src={it.url}
              slideIdx={s}
              editable={e}
              ratio="1:1"
              halftone
              hint={`成员 ${i + 1}`}
            />
            <figcaption className="lp-theme09-team-meta">
              {it.name && (
                <EditableField prop={`images.${i}.name`} slideIdx={s} editable={e} as="span" className="lp-theme09-team-name">
                  {it.name}
                </EditableField>
              )}
              {it.role && (
                <EditableField prop={`images.${i}.role`} slideIdx={s} editable={e} as="span" className="lp-theme09-team-role">
                  {it.role}
                </EditableField>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
