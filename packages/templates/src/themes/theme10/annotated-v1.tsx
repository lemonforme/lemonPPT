// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme10 · 注解图（annotated_v1）
 * 情绪：aurora | 骨架：grid | 图位：1 + 3 条编号注解
 * 左侧底图（满高）+ 右侧编号注解列表；金融编辑「图内标注」栏。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField, EditorialPhoto, Folio, Sheet, type Theme10Mood } from './shared.js';

export interface Theme10AnnotatedV1Note {
  text?: string;
}
export interface Theme10AnnotatedV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  lead?: string;
  imageUrl?: string;
  annotations?: Theme10AnnotatedV1Note[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  mood?: Theme10Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

const COUNT = 3;

export const theme10AnnotatedV1Meta: LayoutMeta = {
  id: 'theme10_annotated_v1',
  theme: 'theme10',
  role: 'image',
  displayName: 'Theme 10 注解图',
  description: '底图 + 编号注解列表',
  needsMedia: true,
  mediaSlots: [{ name: '注解底图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['annotated', 'gold-index', 'aurora'],
  contentShape: 'annotated',
};

export const theme10AnnotatedV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '图内标注' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Annotated' },
    { key: 'mark', label: '刊标', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 10' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '一张图，三处值得被圈出来的细节' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '注解不是装饰。每一条都指向画面里一个具体的点，编号让阅读有迹可循。' },
    { key: 'imageUrl', label: '底图', type: 'image', inlineEditable: false, defaultValue: '' },
    {
      key: 'annotations',
      label: '注解',
      type: 'array',
      minItems: 1,
      maxItems: COUNT,
      defaultValue: Array.from({ length: COUNT }, () => ({ text: '' })),
      itemSchema: [{ key: 'text', label: '注解', type: 'text', inlineEditable: true }],
    },
    { key: 'folioLeft', label: '页脚左', type: 'text', inlineEditable: true, defaultValue: '图内标注' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '44' },
    { key: 'folioRight', label: '页脚右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme10AnnotatedV1(props: Theme10AnnotatedV1Props): ReactNode {
  const { section, mark, title, lead, imageUrl, folioLeft, folioPage, folioRight, mood = 'aurora', _slideIdx: s, _editable: e } = props;
  const raw = props.annotations ?? [];
  const notes: Theme10AnnotatedV1Note[] = raw.map((it) => it ?? {});

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme10-annotated">
      <div className="lp-theme10-annotated-head">
        <EditableField prop="section" slideIdx={s} editable={e} as="div" className="lp-theme10-eyelabel lp-rise">{section}</EditableField>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme10-annotated-title lp-rise" style={{ animationDelay: '60ms' }}>{title}</EditableField>
        {lead && (
          <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme10-annotated-lead lp-rise" style={{ animationDelay: '110ms' }}>{lead}</EditableField>
        )}
      </div>

      <div className="lp-theme10-annotated-body">
        <figure className="lp-theme10-annotated-figure lp-rise">
          <EditorialPhoto
            prop="imageUrl"
            src={imageUrl}
            slideIdx={s}
            editable={e}
            ratio="fill"
            fit="cover"
            hint="点击上传底图"
            className="lp-theme10-annotated-photo"
          />
        </figure>
        <aside className="lp-theme10-annotated-notes lp-rise" style={{ animationDelay: '160ms' }}>
          {notes.map((n, i) => (
            <div className="lp-theme10-annotated-item" key={i}>
              <span className="lp-theme10-annotated-no">{i + 1}</span>
              <EditableField prop={`annotations.${i}.text`} slideIdx={s} editable={e} as="span" className="lp-theme10-annotated-text">{n.text}</EditableField>
            </div>
          ))}
        </aside>
      </div>

      <Folio left={folioLeft} page={folioPage} right={folioRight} />
      <div className="lp-theme10-stamp">{mark}</div>
    </Sheet>
  );
}
