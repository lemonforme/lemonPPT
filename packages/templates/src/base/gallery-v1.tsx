import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface GalleryV1Props {
  kicker?: string;
  title: string;
  images?: { url?: string; caption?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const galleryV1Meta: LayoutMeta = {
  id: 'gallery_v1',
  theme: 'base',
  role: 'gallery',
  displayName: '图片画廊',
  description: '2x2 图片网格，适合作品集或场景展示',
  needsMedia: true,
};

export function GalleryV1(props: GalleryV1Props): ReactNode {
  const { kicker, title, images = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-gallery-v1">
      <div className="lp-gallery-v1-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-gallery-v1-grid">
        {images.map((image, index) => (
          <div key={index} className="lp-gallery-v1-item">
            {image.url ? (
              <img
                src={image.url}
                alt={image.caption || ''}
                data-lp-editable-image="true"
                data-lp-slide-idx={_slideIdx}
                data-lp-prop={`images.${index}.url`}
              />
            ) : (
              <div className="lp-gallery-v1-placeholder" />
            )}
            {image.caption && (
              <EditableField
                prop={`images.${index}.caption`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-gallery-v1-caption"
              >
                {image.caption}
              </EditableField>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
