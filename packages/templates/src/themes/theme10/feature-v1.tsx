// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 图文特写（feature_v1）
 * 情绪：obsidian | 骨架：sidebar | 图位：1
 * 左大图出血 + 右图文 + 引出线批注（mono 标签 + 细金线 leader）。
 * 金融编辑「特写」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10FeatureV1Note {
  label?: string;
  text?: string;
}
export interface Theme10FeatureV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  imageUrl?: string;
  notes?: Theme10FeatureV1Note[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const NOTES = 3;

export const theme10FeatureV1Meta: LayoutMeta = {
  id: 'theme10_feature_v1',
  theme: 'theme10',
  role: 'feature',
  displayName: 'Theme 10 图文特写',
  description: '左大图出血 + 右图文 + 引出线批注',
  needsMedia: true,
  mediaSlots: [{ name: '特写大图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['feature', 'gold-index', 'obsidian'],
  contentShape: 'feature',
};

export const theme10FeatureV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '特写' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Feature' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一笔并购案，被拆成三个可以解释的动作' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '我们用一张图讲清交易结构：谁出手、钱从哪来、风险留在了谁的表上。' },
    { key: 'imageUrl', label: '特写大图', type: 'image', defaultValue: '' },
    {
      key: 'notes',
      label: '批注',
      type: 'array',
      minItems: 0,
      maxItems: NOTES,
      defaultValue: Array.from({ length: NOTES }, (_, i) => ({ label: `批注 ${i + 1}`, text: '' })),
      itemSchema: [
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
        { key: 'text', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '特写' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '32' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10FeatureV1(props: Theme10FeatureV1Props): ReactNode {
  const { section, mark, title, lead, imageUrl, folioLeft, folioPage, folioRight, mood = 'obsidian', _slideIdx: s, _editable: e } = props;
  const raw = props.notes ?? [];
  const notes: Theme10FeatureV1Note[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="sidebar" className="lp-theme10-feature">
      <div className="lp-theme10-feature-photo">
        <EditorialPhoto
          prop="imageUrl"
          src={imageUrl}
          slideIdx={s}
          editable={e}
          ratio="fill"
          fit="cover"
          hint="点击上传特写大图"
        />
        <div className="lp-theme10-feature-scrim" aria-hidden="true" />
      </div>

      <div className="lp-theme10-feature-body">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-feature-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-feature-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}

        <div className="lp-theme10-feature-notes">
          {notes.map((n, i) => (
            <div className="lp-theme10-feature-note lp-rise" style={{ animationDelay: `${160 + i * 50}ms` }} key={i}>
              <span className="t10-leader" aria-hidden="true" />
              <div className="t10-note-text">
                <EditableField prop={`notes.${i}.label`} slideIdx={s} editable={e} as="span" className="t10-label">{n.label}</EditableField>
                <EditableField prop={`notes.${i}.text`} slideIdx={s} editable={e} as="span" className="t10-detail">{n.text}</EditableField>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
