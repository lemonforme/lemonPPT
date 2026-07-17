import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ContentV2Props {
  kicker?: string;
  title: string;
  leftPoints?: string[];
  rightPoints?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const contentV2Meta: LayoutMeta = {
  id: 'minimal_content_v2',
  theme: 'minimal',
  role: 'content',
  displayName: '双列要点',
  description: '标题 + 左右两列 bullet points',
  needsMedia: false,
};

export function ContentV2(props: ContentV2Props): ReactNode {
  const { kicker, title, leftPoints = [], rightPoints = [], _slideIdx, _editable } = props;

  function renderColumn(points: string[], prefix: 'leftPoints' | 'rightPoints') {
    return (
      <ul className="lp-bullet-list lp-bullet-list-compact">
        {points.map((point, index) => (
          <li key={index}>
            <EditableField
              prop={`${prefix}.${index}`}
              slideIdx={_slideIdx}
              editable={_editable}
              as="span"
            >
              {point}
            </EditableField>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="lp-slide lp-content-v2">
      <div className="lp-content-v2-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-content-title">
          {title}
        </EditableField>
      </div>
      <div className="lp-content-v2-columns">
        <div className="lp-content-v2-column">{renderColumn(leftPoints, 'leftPoints')}</div>
        <div className="lp-content-v2-column">{renderColumn(rightPoints, 'rightPoints')}</div>
      </div>
    </div>
  );
}
