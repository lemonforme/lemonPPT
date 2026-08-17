import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09DiptychV1Item {
  url?: string;
  caption?: string;
}
export interface Theme09DiptychV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  title?: string;
  images?: Theme09DiptychV1Item[];
  note?: string;
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09DiptychV1Meta: LayoutMeta = {
  id: 'theme09_diptych_v1',
  theme: 'theme09',
  role: 'image',
  displayName: 'Theme 09 双联对照',
  description: '左右双联影像，中缝装订线，下方对照说明',
  needsMedia: true,
  mediaSlots: [{ name: '双联影像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['diptych', 'compare', 'editorial'],
  contentShape: 'diptych',
};

export const theme09DiptychV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '对照' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Diptych' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '两种此刻' },
    { key: 'images', label: '影像(2)', type: 'array', defaultValue: [] },
    { key: 'note', label: '对照说明', type: 'textarea', inlineEditable: true, defaultValue: '左边是方案 A 落地后的现场，右边是六个月后的同一位置——改变发生在不被注意的日常里。' },
    { key: 'folioLeft', label: '骑缝左', type: 'text', inlineEditable: true, defaultValue: '双联对照' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '60' },
    { key: 'folioRight', label: '骑缝右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme09DiptychV1(props: Theme09DiptychV1Props): ReactNode {
  const { section, sectionEn, mark, title, images, note, folioLeft, folioPage, folioRight, _slideIdx: s, _editable: e } = props;
  const raw = (images ?? []).slice(0, 2);
  const list: Theme09DiptychV1Item[] = [raw[0] ?? {}, raw[1] ?? {}];
  return (
    <Sheet frame="grid" substrate="paper" className="lp-theme09-diptych" cropMarks>
      <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />
      <div className="lp-theme09-diptych-inner">
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-diptych-title">{title}</EditableField>
        <div className="lp-theme09-diptych-pair">
          <figure className="lp-theme09-diptych-cell">
            <InkPhoto prop="images.0.url" src={list[0].url} slideIdx={s} editable={e} ratio="4:3" fit="cover" hint="点击上传左图" className="lp-theme09-diptych-photo" />
            {list[0].caption && <figcaption className="lp-theme09-diptych-cap"><EditableField prop="images.0.caption" slideIdx={s} editable={e} as="span">{list[0].caption}</EditableField></figcaption>}
          </figure>
          <span className="lp-theme09-diptych-spine" aria-hidden="true" />
          <figure className="lp-theme09-diptych-cell">
            <InkPhoto prop="images.1.url" src={list[1].url} slideIdx={s} editable={e} ratio="4:3" fit="cover" hint="点击上传右图" className="lp-theme09-diptych-photo" />
            {list[1].caption && <figcaption className="lp-theme09-diptych-cap"><EditableField prop="images.1.caption" slideIdx={s} editable={e} as="span">{list[1].caption}</EditableField></figcaption>}
          </figure>
        </div>
        {note && (
          <EditableField prop="note" slideIdx={s} editable={e} as="p" className="lp-theme09-diptych-note">{note}</EditableField>
        )}
      </div>
      <Folio left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
    </Sheet>
  );
}
