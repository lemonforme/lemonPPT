import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface CoverV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const coverV1Meta: LayoutMeta = {
  id: 'minimal_cover_v1',
  theme: 'minimal',
  role: 'cover',
  displayName: '极简封面',
  description: '居中大标题，适合正式汇报封面',
  needsMedia: true,
};

export function CoverV1(props: CoverV1Props): ReactNode {
  const { kicker, title, subtitle, date, image, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-cover-v1">
      {image && (
        <img
          className="lp-cover-image"
          src={image}
          alt=""
          data-lp-editable-image="true"
          data-lp-slide-idx={_slideIdx}
          data-lp-prop="image"
        />
      )}
      <div className="lp-cover-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-heading lp-cover-title">
          {title}
        </EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-cover-subtitle">
            {subtitle}
          </EditableField>
        )}
        {date && (
          <EditableField prop="date" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-cover-date">
            {date}
          </EditableField>
        )}
      </div>
    </div>
  );
}
