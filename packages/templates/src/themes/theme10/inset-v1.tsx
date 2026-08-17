// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 满版内嵌（inset_v1）
 * 情绪：aurora | 骨架：full-bleed | 图位：1
 * 满版出血影像 + 左侧内嵌文字卡（栏标/标题/导语/批注）；金融编辑「封面式影像」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10InsetV1Note {
  label?: string;
  text?: string;
}
export interface Theme10InsetV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  imageUrl?: string;
  notes?: Theme10InsetV1Note[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10InsetV1Meta: LayoutMeta = {
  id: 'theme10_inset_v1',
  theme: 'theme10',
  role: 'image',
  displayName: 'Theme 10 满版内嵌',
  description: '满版出血影像 + 内嵌文字卡',
  needsMedia: true,
  mediaSlots: [{ name: '满版影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['inset', 'gold-index', 'aurora'],
  contentShape: 'inset',
};

export const theme10InsetV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '封面式影像' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Inset' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一幅图里，藏着整季的叙事' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '我们让影像占满整页，文字退成角落里的一张卡片——读图优先，落笔其次。' },
    { key: 'imageUrl', label: '满版影像', type: 'image', defaultValue: '' },
    {
      key: 'notes',
      label: '批注',
      type: 'array',
      minItems: 0,
      maxItems: 3,
      defaultValue: Array.from({ length: 3 }, () => ({ label: '批注', text: '' })),
      itemSchema: [
        { key: 'label', label: '批注角标', type: 'text', inlineEditable: true },
        { key: 'text', label: '批注内容', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '封面式影像' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '36' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10InsetV1(props: Theme10InsetV1Props): ReactNode {
  const {
    section, mark, title, lead, imageUrl,
    folioLeft, folioPage, folioRight, mood = 'aurora',
    _slideIdx: s, _editable: e,
  } = props;
  const notes: Theme10InsetV1Note[] = (Array.isArray(props.notes) ? props.notes : []).slice(0, 3);

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme10-inset">
      {(imageUrl || e) && (
        <div className="lp-theme10-inset-photo">
          <EditorialPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={s}
            editable={e}
            ratio="fill"
            fit="cover"
            hint="点击上传满版影像"
          />
          <div className="lp-theme10-inset-scrim" aria-hidden="true" />
        </div>
      )}

      <div className="lp-theme10-inset-card">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-inset-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-inset-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
        {notes.some((n) => n.text) && (
          <div className="lp-theme10-inset-notes">
            {notes.map((n, i) => (
              n.text ? (
                <div className="lp-theme10-inset-note" key={i}>
                  <span className="t10-leader" aria-hidden="true" />
                  <div className="t10-note-text">
                    {n.label && <EditableField prop={`notes.${i}.label`} slideIdx={s} editable={e} as="span" className="t10-label">{n.label}</EditableField>}
                    <EditableField prop={`notes.${i}.text`} slideIdx={s} editable={e} as="span" className="t10-detail">{n.text}</EditableField>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        )}
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
