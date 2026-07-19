import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ContentV3Props {
  kicker?: string;
  title: string;
  points?: string[];
  imageUrl?: string;
  imageAlt?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const contentV3Meta: LayoutMeta = {
  id: 'content_v3',
  theme: 'base',
  role: 'content',
  displayName: '图文并排',
  description: '左侧标题 + 要点，右侧图片，适合产品特性页',
  needsMedia: true,
};

export function ContentV3(props: ContentV3Props): ReactNode {
  const { kicker, title, points = [], imageUrl, imageAlt, _slideIdx, _editable } = props;
  return (
    <div className="lp-slide lp-content-v3">
      <div className="lp-content-v3-text">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-content-title">
          {title}
        </EditableField>
        {points.length > 0 && (
          <ul className="lp-bullet-list lp-bullet-list-compact">
            {points.map((point, index) => (
              <li key={index}>
                <EditableField prop={`points.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {point}
                </EditableField>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="lp-content-v3-media">
        <img
          src={imageUrl}
          alt={imageAlt || ''}
          data-lp-editable-image="true"
          data-lp-slide-idx={_slideIdx}
          data-lp-prop="imageUrl"
        />
      </div>
    </div>
  );
}
