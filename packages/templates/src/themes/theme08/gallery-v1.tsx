// lemonPPT - theme08 黑金实验 · 照片墙
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08GalleryV1Item {
  caption: string;
  imageUrl?: string;
}

export interface Theme08GalleryV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  items?: Theme08GalleryV1Item[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08GalleryV1Meta: LayoutMeta = {
  id: 'theme08_gallery_v1',
  theme: 'theme08',
  role: 'gallery',
  displayName: 'Theme 08 照片墙',
  description: '三列图片网格 + 标题，适合作品/场景展示',
  needsMedia: true,
  tags: ['gallery', 'photo', 'black-gold'],
  contentShape: 'gallery',
};

export const theme08GalleryV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GALLERY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '场景实拍' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从实验室到发布会现场。' },
    {
      key: 'items',
      label: '图片',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { caption: '算力中心' },
        { caption: '发布现场' },
        { caption: '研发团队' },
        { caption: '客户洽谈' },
        { caption: '生态伙伴' },
        { caption: '用户社区' },
      ],
      itemSchema: [
        { key: 'caption', label: '标题', type: 'text' },
        { key: 'imageUrl', label: '图片', type: 'image' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '82' },
  ],
};

export function Theme08GalleryV1(props: Theme08GalleryV1Props): ReactNode {
  const { kicker, title, subtitle, items = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (items || []).slice(0, 6);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-gallery-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="spark" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-gallery lp-rise">
            {valid.map((it, i) => (
              <div key={i} className="lp-theme08-gallery-cell" style={{ animationDelay: `${i * 50}ms` }}>
                <LpEditableImage
                  prop={`items.${i}.imageUrl`}
                  src={it.imageUrl}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  className="lp-theme08-gallery-img"
                  placeholderClassName="lp-theme08-gallery-img-placeholder"
                  placeholderText="上传图片"
                />
                <div className="lp-theme08-gallery-cap"><EditableField prop={`items.${i}.caption`} slideIdx={_slideIdx} editable={_editable} as="span">{it.caption}</EditableField></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
