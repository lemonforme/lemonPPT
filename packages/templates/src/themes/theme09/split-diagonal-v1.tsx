import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Sheet } from './shared.js';

export interface Theme09SplitDiagonalV1Props {
  kicker?: string;
  title?: string;
  body?: string;
  accentText?: string;
  images?: { url?: string; caption?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09SplitDiagonalV1Meta: LayoutMeta = {
  id: 'theme09_split_diagonal_v1',
  theme: 'theme09',
  role: 'image',
  displayName: 'Theme 09 斜切分屏',
  description: '专色斜切把版面切成文/图两半，切口做叠印',
  needsMedia: true,
  mediaSlots: [{ name: '影像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['split', 'diagonal', 'editorial'],
  contentShape: 'split-diagonal',
};

export const theme09SplitDiagonalV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '专题' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '两种速度，同一个方向' },
    { key: 'body', label: '正文', type: 'textarea', inlineEditable: true, defaultValue: '一边是季度冲刺的节奏，一边是长期主义的耐心。我们学会在两者之间切换，而不是二选一。' },
    { key: 'accentText', label: '叠印词', type: 'text', inlineEditable: true, defaultValue: 'SPLIT' },
    { key: 'images', label: '影像', type: 'array', defaultValue: [] },
    { key: 'folioLeft', label: '骑缝左', type: 'text', inlineEditable: true, defaultValue: '斜切分屏' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '23' },
    { key: 'folioRight', label: '骑缝右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme09SplitDiagonalV1(props: Theme09SplitDiagonalV1Props): ReactNode {
  const { kicker, title, body, accentText, images, folioLeft, folioPage, folioRight, _slideIdx: s, _editable: e } = props;
  const img = images?.[0] ?? {};
  return (
    <Sheet frame="full-bleed" substrate="ink" className="lp-theme09-splitdiag" cropMarks accent>
      <div className="lp-theme09-splitdiag-shape" aria-hidden="true">
        <EditableField prop="accentText" slideIdx={s} editable={e} as="span" className="lp-theme09-splitdiag-accent">{accentText}</EditableField>
      </div>
      <InkPhoto
        prop="images.0.url"
        src={img.url}
        slideIdx={s}
        editable={e}
        ratio="fill"
        fit="cover"
        scrim="none"
        hint="点击上传影像"
        showSpec={false}
        className="lp-theme09-splitdiag-bg"
      />
      <div className="lp-theme09-splitdiag-inner">
        <div className="lp-theme09-splitdiag-kicker">
          <EditableField prop="kicker" slideIdx={s} editable={e} as="span">{kicker}</EditableField>
        </div>
        <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-splitdiag-title">{title}</EditableField>
        {body && (
          <EditableField prop="body" slideIdx={s} editable={e} as="p" className="lp-theme09-splitdiag-body">{body}</EditableField>
        )}
        <Folio inverse left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
      </div>
    </Sheet>
  );
}
