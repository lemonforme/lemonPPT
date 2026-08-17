// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 色场分栏封面（cover_field_v1）
 * 情绪：aurora | 骨架：spread | 图位：0
 * 左文右渐变色场，中缝金线。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10CoverFieldV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  fieldNo?: string;
  fieldLabel?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10CoverFieldV1Meta: LayoutMeta = {
  id: 'theme10_cover_field_v1',
  theme: 'theme10',
  role: 'cover',
  displayName: 'Theme 10 色场分栏封面',
  description: '左文右渐变色场 + 中缝金线',
  needsMedia: false,
  tags: ['cover', 'field', 'gold-index', 'aurora'],
  contentShape: 'cover-field',
};

export const theme10CoverFieldV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'ANNUAL REVIEW' },
    { key: 'title', label: '主标题', type: 'textarea', inlineEditable: true, defaultValue: '资本的坐标\n正在重新绘制' },
    { key: 'subtitle', label: '副语', type: 'textarea', inlineEditable: true, defaultValue: '一份关于指数、结构与拐点的年终报告。' },
    { key: 'fieldNo', label: '色场编号', type: 'text', inlineEditable: true, defaultValue: '10' },
    { key: 'fieldLabel', label: '色场标签', type: 'text', inlineEditable: true, defaultValue: 'GOLD INDEX' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'obsidian', label: 'obsidian' }, { value: 'ember', label: 'ember' }], defaultValue: 'aurora' },
  ],
};

export function Theme10CoverFieldV1(props: Theme10CoverFieldV1Props): ReactNode {
  const { kicker, title, subtitle, fieldNo, fieldLabel, mood = 'aurora', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="spread" className="lp-theme10-cover-field">
      <div className="lp-theme10-cover-field-main">
        {kicker && (
          <EditableField prop="kicker" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">
            {kicker}
          </EditableField>
        )}
        <EditableField
          prop="title"
          slideIdx={s}
          editable={e}
          as="h1"
          className="lp-theme10-cover-dusk-title lp-rise"
          style={{ animationDelay: '60ms' }}
        >
          {title}
        </EditableField>
        {subtitle && (
          <EditableField
            prop="subtitle"
            slideIdx={s}
            editable={e}
            as="p"
            className="lp-theme10-cover-dusk-sub lp-rise"
            style={{ animationDelay: '120ms' }}
          >
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme10-cover-field-aside">
        <div className="t10-field-no">
          <EditableField prop="fieldNo" slideIdx={s} editable={e} as="span">
            {fieldNo}
          </EditableField>
          <div className="lp-theme10-en" style={{ fontSize: 14, marginTop: 8 }}>
            <EditableField prop="fieldLabel" slideIdx={s} editable={e} as="span">
              {fieldLabel}
            </EditableField>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
