import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Folio, InkPhoto, Sheet } from './shared.js';

export interface Theme09CoverStoryV1Props {
  kicker?: string;
  title?: string;
  lead?: string;
  meta?: string;
  images?: { url?: string; caption?: string }[];
  folioLeft?: string;
  folioPage?: string;
  folioRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme09CoverStoryV1Meta: LayoutMeta = {
  id: 'theme09_coverstory_v1',
  theme: 'theme09',
  role: 'image',
  displayName: 'Theme 09 封面故事',
  description: '杂志封面故事版：竖排标题压图 + 导语块',
  needsMedia: true,
  mediaSlots: [{ name: '封面影像', fieldPath: 'images', canPresetMedia: true }],
  tags: ['photo', 'coverstory', 'editorial'],
  contentShape: 'coverstory',
};

export const theme09CoverStoryV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '栏目', type: 'text', inlineEditable: true, defaultValue: '封面故事' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '当算法开始理解沉默' },
    { key: 'lead', label: '导语', type: 'textarea', inlineEditable: true, defaultValue: '我们用了十一个月，去理解那些没有被说出口的需求——它们往往比问卷上的答案更接近真相。' },
    { key: 'meta', label: '署名', type: 'text', inlineEditable: true, defaultValue: '文 / 林深 · 图 / 陈默' },
    { key: 'images', label: '影像', type: 'array', defaultValue: [] },
    { key: 'folioLeft', label: '骑缝左', type: 'text', inlineEditable: true, defaultValue: '封面影像' },
    { key: 'folioPage', label: '页码', type: 'text', inlineEditable: true, defaultValue: '33' },
    { key: 'folioRight', label: '骑缝右', type: 'text', inlineEditable: true, defaultValue: 'LEMONPPT 2026' },
  ],
};

export function Theme09CoverStoryV1(props: Theme09CoverStoryV1Props): ReactNode {
  const { kicker, title, lead, meta, images, folioLeft, folioPage, folioRight, _slideIdx: s, _editable: e } = props;
  const img = images?.[0] ?? {};
  return (
    <Sheet frame="full-bleed" substrate="ink" className="lp-theme09-coverstory" cropMarks accent>
      <InkPhoto
        prop="images.0.url"
        src={img.url}
        slideIdx={s}
        editable={e}
        ratio="fill"
        fit="cover"
        scrim="bottom"
        hint="点击上传封面影像"
        showSpec={false}
        className="lp-theme09-coverstory-bg"
      />
      <div className="lp-theme09-coverstory-inner">
        <div className="lp-theme09-coverstory-kicker">
          <EditableField prop="kicker" slideIdx={s} editable={e} as="span">{kicker}</EditableField>
        </div>
        <div className="lp-theme09-coverstory-text">
          <EditableField prop="title" slideIdx={s} editable={e} as="h1" className="lp-theme09-coverstory-title">{title}</EditableField>
          {lead && (
            <EditableField prop="lead" slideIdx={s} editable={e} as="p" className="lp-theme09-coverstory-lead">{lead}</EditableField>
          )}
          {meta && (
            <EditableField prop="meta" slideIdx={s} editable={e} as="p" className="lp-theme09-coverstory-meta">{meta}</EditableField>
          )}
        </div>
        <Folio inverse left={folioLeft} page={folioPage} right={folioRight} slideIdx={s} editable={e} />
      </div>
    </Sheet>
  );
}
