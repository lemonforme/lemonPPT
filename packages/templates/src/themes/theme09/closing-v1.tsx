// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme09 · 封底结语（closing_v1）
 * 基底：墨 | 骨架：full-bleed | 图位：1
 *
 * 满版影像整体压暗，居中专色栏标 + 明朝体结语大字，
 * 底部 colophon 行交代出品信息，收束整本刊物。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { InkPhoto, Sheet, normalizeStrings } from './shared.js';

export interface Theme09ClosingV1Props {
  mark?: string;
  word: string;
  subtitle?: string;
  colophon?: string[];
  imageUrl?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09ClosingV1Meta: LayoutMeta = {
  id: 'theme09_closing_v1',
  theme: 'theme09',
  role: 'closing',
  displayName: 'Theme 09 封底结语',
  description: '满版影像压暗 + 居中明朝体结语 + 版本信息 colophon',
  needsMedia: true,
  mediaSlots: [{ name: '封底影像', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['closing', 'ending', 'photo', 'ink'],
  contentShape: 'closing',
};

export const theme09ClosingV1Schema: PropsSchema = {
  fields: [
    { key: 'mark', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'End of Issue' },
    { key: 'word', label: '结语', type: 'textarea', inlineEditable: true, defaultValue: '把话说完，把纸留白' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '下一期，我们会带着这一年的争论继续往前走。感谢每一位愿意把时间交给我们的人。' },
    {
      key: 'colophon',
      label: '版本信息',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: ['ISSUE 09', '2026.08', 'LEMONPPT STUDIO'],
      itemSchema: [{ key: 'item', label: '条目', type: 'text' }],
    },
    { key: 'imageUrl', label: '封底影像', type: 'image', defaultValue: '' },
  ],
};

export function Theme09ClosingV1(props: Theme09ClosingV1Props): ReactNode {
  const { mark, word, subtitle, imageUrl, _slideIdx: s, _editable: e } = props;
  const colophon = normalizeStrings(props.colophon).slice(0, 4);

  return (
    <Sheet substrate="ink" frame="full-bleed" className="lp-theme09-closing" grain={false} cropMarks>
      <InkPhoto
        prop="imageUrl"
        src={imageUrl}
        slideIdx={s}
        editable={e}
        ratio="fill"
        scrim="full"
        hint="点击上传封底影像"
      />

      <div className="lp-theme09-closing-inner">
        {mark && (
          <EditableField prop="mark" slideIdx={s} editable={e} as="div" className="lp-theme09-closing-mark lp-rise">
            {mark}
          </EditableField>
        )}
        <EditableField prop="word" slideIdx={s} editable={e} as="h1" className="lp-theme09-closing-word lp-rise">
          {word}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme09-closing-sub lp-rise">
            {subtitle}
          </EditableField>
        )}
        {colophon.length > 0 && (
          <div className="lp-theme09-closing-colophon lp-rise" style={{ animationDelay: '140ms' }}>
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
