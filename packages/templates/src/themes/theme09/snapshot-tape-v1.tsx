// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 胶带速写（snapshot_tape_v1）
 * 基底：纸 | 骨架：column-3 | 图位：3
 *
 * 三栏速写照片，每帧以半透明胶带斜贴固定（印刷胶带语汇），
 * 下方手写体批注。杂志「花絮 / 随拍」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09SnapshotTapeV1Item {
  url?: string;
  note?: string;
}

export interface Theme09SnapshotTapeV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title: string;
  images?: Theme09SnapshotTapeV1Item[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 3;

export const theme09SnapshotTapeV1Meta: LayoutMeta = {
  id: 'theme09_snapshot_tape_v1',
  theme: 'theme09',
  role: 'gallery',
  displayName: 'Theme 09 胶带速写',
  description: '三栏速写照片 + 胶带斜贴 + 手写批注，花絮 / 随拍栏',
  needsMedia: true,
  mediaSlots: Array.from({ length: COUNT }, (_, i) => ({
    name: `速写 ${i + 1}`,
    fieldPath: `images.${i}.url`,
    canPresetMedia: true,
  })),
  tags: ['photo', 'tape', 'column', 'editorial'],
  contentShape: 'snapshot-tape',
};

export const theme09SnapshotTapeV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '刊头栏目', type: 'text', inlineEditable: true, defaultValue: '花絮' },
    { key: 'sectionEn', label: '刊头英文', type: 'text', inlineEditable: true, defaultValue: 'Snapshots' },
    { key: 'mark', label: '刊头右标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '现场的三张边角料' },
    {
      key: 'images',
      label: '速写',
      type: 'array',
      minItems: 2,
      maxItems: COUNT,
      defaultValue: [
        { url: '', note: '会议室窗外的雨' },
        { url: '', note: '走神时画的一笔' },
        { url: '', note: '散场后的空椅子' },
      ],
      itemSchema: [
        { key: 'url', label: '图片', type: 'image' },
        { key: 'note', label: '批注', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '花絮 · 胶带速写' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '33' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: '2026.08' },
  ],
};

export function Theme09SnapshotTapeV1(props: Theme09SnapshotTapeV1Props): ReactNode {
  const {
    section, sectionEn, mark, title,
    folioLeft, folioPage, folioRight,
    _slideIdx: s, _editable: e,
  } = props;
  const raw = (props.images ?? []).slice(0, COUNT);
  const images: Theme09SnapshotTapeV1Item[] = Array.from({ length: COUNT }, (_, i) => raw[i] ?? {});

  return (
    <Sheet substrate="paper" frame="column-3" className="lp-theme09-snaptape">
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />

      <EditableField prop="title" slideIdx={s} editable={e} as="h2" className="lp-theme09-snaptape-title lp-rise">
        {title}
      </EditableField>

      <div className="lp-theme09-snaptape-row">
        {images.map((it, i) => (
          <figure key={i} className="lp-theme09-snaptape-cell lp-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <InkPhoto
              prop={`images.${i}.url`}
              src={it.url}
              slideIdx={s}
              editable={e}
              ratio="3:4"
              tape
              hint={`速写 ${i + 1}`}
            />
            {it.note && (
              <figcaption className="lp-theme09-snaptape-note">
                <EditableField prop={`images.${i}.note`} slideIdx={s} editable={e} as="span">
                  {it.note}
                </EditableField>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
