import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ImageV1Props {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const imageV1Meta: LayoutMeta = {
  id: 'image_v1',
  theme: 'base',
  role: 'image',
  displayName: '全屏图片',
  description: '全屏背景图配居中标题，适合冲击力强的视觉页',
  needsMedia: true,
};

export function ImageV1(props: ImageV1Props): ReactNode {
  const { title, subtitle, imageUrl, imageAlt, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-image-v1">
      {imageUrl && (
        <img
          className="lp-image-v1-bg"
          src={imageUrl}
          alt={imageAlt || ''}
          data-lp-editable-image="true"
          data-lp-slide-idx={_slideIdx}
          data-lp-prop="imageUrl"
        />
      )}
      <div className="lp-image-v1-overlay" />
      <div className="lp-image-v1-content">
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-image-v1-title">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-image-v1-subtitle">
            {subtitle}
          </EditableField>
        )}
      </div>
    </div>
  );
}
