// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 编排图文（editorial_v1）
 * 情绪：ember | 骨架：spread | 图位：1
 * 左三栏文字（导语 + 三栏正文）+ 右出血图。
 * 杂志「深度 / 专题」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, normalizeStrings, type Theme10Mood } from './shared.js';

export interface Theme10EditorialV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  body?: string[];
  imageUrl?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme10EditorialV1Meta: LayoutMeta = {
  id: 'theme10_editorial_v1',
  theme: 'theme10',
  role: 'content',
  displayName: 'Theme 10 编排图文',
  description: '三栏文字 + 右出血图',
  needsMedia: true,
  mediaSlots: [{ name: '右出血图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['editorial', 'gold-index', 'ember'],
  contentShape: 'editorial',
};

export const theme10EditorialV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '深度' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Feature' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '当流动性退潮，谁在裸泳' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '我们重看了过去三年里被忽视的三个信号：回购利率的尾部、信用利差的钝化，以及北向资金的节奏。' },
    {
      key: 'body',
      label: '三栏正文',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        '第一栏：回购市场的分层正在加剧，非银机构的融资成本在季末显著抬升，这是结构而非噪音。',
        '第二栏：信用利差对基本面的反应越来越钝，意味着定价权正在向少数交易台集中。',
        '第三栏：北向资金的节奏不再平滑，脉冲式流入往往领先于风格切换两到三周。',
      ],
      itemSchema: [{ key: 'item', label: '段落', type: 'text', inlineEditable: true }],
    },
    { key: 'imageUrl', label: '右出血图', type: 'image', defaultValue: '' },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '深度 · 专题' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '34' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10EditorialV1(props: Theme10EditorialV1Props): ReactNode {
  const { section, mark, title, lead, imageUrl, folioLeft, folioPage, folioRight, mood = 'ember', _slideIdx: s, _editable: e } = props;
  const body = normalizeStrings(props.body).slice(0, 3);

  return (
    <Sheet mood={mood} frame="spread" className="lp-theme10-editorial">
      <div className="lp-theme10-editorial-photo">
        <EditorialPhoto
          prop="imageUrl"
          src={imageUrl}
          slideIdx={s}
          editable={e}
          ratio="fill"
          fit="cover"
          hint="点击上传右出血图"
        />
        <div className="lp-theme10-editorial-photo-scrim" aria-hidden="true" />
      </div>

      <div className="lp-theme10-editorial-body">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-editorial-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-editorial-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
        <div className="lp-theme10-ledger" />
        <div className="lp-theme10-editorial-cols">
          {body.map((p, i) => (
            <p key={i} className="lp-theme10-editorial-col lp-rise" style={{ animationDelay: `${160 + i * 40}ms` }}>
              <span className="t10-col-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <EditableField prop={`body.${i}`} slideIdx={s} editable={e} as="span">{p}</EditableField>
            </p>
          ))}
        </div>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
