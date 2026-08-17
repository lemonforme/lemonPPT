// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 封底结语（closing_v1）
 * 情绪：aurora | 骨架：full-bleed | 图位：1
 * 满版影像压暗，居中专色栏标 + 结语大字，底部 colophon 行交代出品信息。
 * 与 theme09 closing 同构但换金线皮肤（EditorialPhoto）与金融编辑语汇。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Sheet, normalizeStrings, type Theme10Mood } from './shared.js';

export interface Theme10ClosingV1Props {
  mark?: string;
  word: string;
  subtitle?: string;
  colophon?: string[];
  imageUrl?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10ClosingV1Meta: LayoutMeta = {
  id: 'theme10_closing_v1',
  theme: 'theme10',
  role: 'closing',
  displayName: 'Theme 10 封底结语',
  description: '满版影像压暗 + 居中结语 + 版本信息 colophon',
  needsMedia: true,
  mediaSlots: [{ name: '封底影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['closing', 'gold-index', 'aurora'],
  contentShape: 'closing',
};

export const theme10ClosingV1Schema: PropsSchema = {
  fields: [
    { key: 'mark', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'END OF ISSUE' },
    { key: 'word', label: '结语', type: 'textarea', inlineEditable: true, defaultValue: '把配置交给时间，\n把判断留给自己' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '下一期，我们会带着这一季的争论继续往前走。感谢每一位愿意把时间交给我们的人。' },
    {
      key: 'colophon',
      label: '版本信息',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: ['ISSUE 10', '2026.08', 'LEMONPPT STUDIO'],
      itemSchema: [{ key: 'item', label: '条目', type: 'text' }],
    },
    { key: 'imageUrl', label: '封底影像', type: 'image', defaultValue: '' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'aurora' },
  ],
};

export function Theme10ClosingV1(props: Theme10ClosingV1Props): ReactNode {
  const { mark, word, subtitle, imageUrl, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const colophon = normalizeStrings(props.colophon).slice(0, 4);

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme10-closing">
      {(imageUrl || e) && (
        <div className="lp-theme10-closing-photo">
          <EditorialPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={s}
            editable={e}
            ratio="fill"
            fit="cover"
            hint="点击上传封底影像"
          />
          <div className="lp-theme10-closing-scrim" aria-hidden="true" />
        </div>
      )}

      <div className="lp-theme10-closing-inner">
        {mark && (
          <EditableField prop="mark" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">
            {mark}
          </EditableField>
        )}
        <EditableField
          prop="word"
          slideIdx={s}
          editable={e}
          as="h1"
          className="lp-theme10-closing-word lp-rise"
          style={{ animationDelay: '60ms' }}
        >
          {word}
        </EditableField>
        {subtitle && (
          <EditableField
            prop="subtitle"
            slideIdx={s}
            editable={e}
            as="p"
            className="lp-theme10-closing-sub lp-rise"
            style={{ animationDelay: '110ms' }}
          >
            {subtitle}
          </EditableField>
        )}
        {colophon.length > 0 && (
          <div className="lp-theme10-closing-colophon lp-rise" style={{ animationDelay: '160ms' }}>
            {colophon.map((c, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '26px' }}>
                {i > 0 && <i aria-hidden="true">·</i>}
                <EditableField prop={`colophon.${i}`} slideIdx={s} editable={e} as="span">
                  {c}
                </EditableField>
              </span>
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}
