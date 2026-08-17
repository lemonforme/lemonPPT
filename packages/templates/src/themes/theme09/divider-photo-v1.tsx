import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Masthead, Sheet } from './shared.js';

export interface Theme09DividerPhotoV1Props {
  section?: string;
  sectionEn?: string;
  mark?: string;
  number?: string;
  title?: string;
  standfirst?: string;
  images?: { url?: string; caption?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09DividerPhotoV1Meta: LayoutMeta = {
  id: 'theme09_divider_photo_v1',
  theme: 'theme09',
  role: 'image',
  displayName: 'Theme 09 影像分隔',
  description: '满版影像 + 巨型半透明章节序号，作为篇章之间的呼吸页',
  needsMedia: true,
  mediaSlots: [{ name: '章节影像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['photo', 'divider', 'chapter'],
  contentShape: 'divider-photo',
};

export const theme09DividerPhotoV1Schema: PropsSchema = {
  fields: [
    { key: 'section', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '附录' },
    { key: 'sectionEn', label: '栏目(英)', type: 'text', inlineEditable: true, defaultValue: 'Appendix' },
    { key: 'mark', label: '标记', type: 'text', inlineEditable: true, defaultValue: 'ISSUE 09' },
    { key: 'number', label: '章节序号', type: 'text', inlineEditable: true, defaultValue: '07' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '透视与回望' },
    { key: 'standfirst', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '在数据与直觉之间，我们试图为这一年留下一个可以被反复翻阅的坐标。' },
    { key: 'images', label: '影像', type: 'array', defaultValue: [] },
    { key: 'folioLeft', label: '骑缝左', type: 'text', inlineEditable: true, defaultValue: '附录 · 透视' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '70' },
    { key: 'folioRight', label: '骑缝右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme09DividerPhotoV1(props: Theme09DividerPhotoV1Props): ReactNode {
  const { section, sectionEn, mark, title, standfirst, images, folioLeft, folioPage, folioRight, _slideIdx: s, _editable: e } = props;
  const img = images?.[0] ?? {};
  return (
    <Sheet frame="full-bleed" substrate="ink" className="lp-theme09-dividerphoto" cropMarks accent>
      <InkPhoto
        prop="images.0.url"
        src={img.url}
        slideIdx={s}
        editable={e}
        ratio="fill"
        fit="cover"
        scrim="full"
        hint="点击上传章节影像"
        showSpec={false}
        className="lp-theme09-dividerphoto-bg"
      />
      <div className="lp-theme09-dividerphoto-inner">
        <Masthead section={section} sectionEn={sectionEn} mark={mark} slideIdx={s} editable={e} />
        <div className="lp-theme09-dividerphoto-num" aria-hidden="true">
          <EditableField prop="number" slideIdx={s} editable={e} as="span">{props.number}</EditableField>
        </div>
        <div className="lp-theme09-dividerphoto-text">
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-dividerphoto-title">{title}</EditableField>
          {standfirst && (
            <EditableField prop="standfirst" slideIdx={s} editable={e} as="p" className="lp-theme09-dividerphoto-sub">{standfirst}</EditableField>
          )}
        </div>
        <Folio inverse left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
      </div>
    </Sheet>
  );
}
