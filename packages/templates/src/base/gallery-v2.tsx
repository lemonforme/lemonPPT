import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface GalleryV2Props {
  kicker?: string;
  title: string;
  images?: { url?: string; caption?: string }[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const galleryV2Meta: LayoutMeta = {
  id: 'gallery_v2',
  theme: 'base',
  role: 'gallery',
  displayName: '三列图片墙',
  description: '三列图片网格配底部说明，适合场景、案例、作品集展示',
  needsMedia: true,
};

export function GalleryV2(props: GalleryV2Props): ReactNode {
  const { kicker, title, images = [], _slideIdx, _editable } = props;
  const displayImages = images.slice(0, 6);

  return (
    <div className="lp-slide lp-gallery-v2">
      <div className="lp-gallery-v2-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading">
          {title}
        </EditableField>
      </div>
      <div className="lp-gallery-v2-grid">
        {displayImages.map((image, index) => (
          <div key={index} className="lp-gallery-v2-item">
            {image.url ? (
              <img
                src={image.url}
                alt={image.caption || ''}
                data-lp-editable-image="true"
                data-lp-slide-idx={_slideIdx}
                data-lp-prop={`images.${index}.url`}
              />
            ) : (
              <div className="lp-gallery-v2-placeholder" />
            )}
            {image.caption && (
              <EditableField
                prop={`images.${index}.caption`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-gallery-v2-caption"
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
