import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ComparisonV1Props {
  kicker?: string;
  title: string;
  leftTitle?: string;
  leftPoints?: string[];
  rightTitle?: string;
  rightPoints?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const comparisonV1Meta: LayoutMeta = {
  id: 'comparison_v1',
  theme: 'base',
  role: 'comparison',
  displayName: '左右对比',
  description: '左右两栏对比，适合优劣分析',
  needsMedia: false,
};

export function ComparisonV1(props: ComparisonV1Props): ReactNode {
  const {
    kicker,
    title,
    leftTitle = '方案 A',
    leftPoints = [],
    rightTitle = '方案 B',
    rightPoints = [],
    _slideIdx,
    _editable,
  } = props;

  return (
    <div className="lp-slide lp-comparison-v1">
      <div className="lp-comparison-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-comparison-title">
          {title}
        </EditableField>
        <div className="lp-comparison-grid">
          <div className="lp-comparison-col">
            <EditableField prop="leftTitle" slideIdx={_slideIdx} editable={_editable} as="h3">
              {leftTitle}
            </EditableField>
            <ul>
              {leftPoints.map((point, index) => (
                <li key={index}>
                  <EditableField
                    prop={`leftPoints.${index}`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                  >
                    {point}
                  </EditableField>
                </li>
              ))}
            </ul>
          </div>
          <div className="lp-comparison-col">
            <EditableField prop="rightTitle" slideIdx={_slideIdx} editable={_editable} as="h3">
              {rightTitle}
            </EditableField>
            <ul>
              {rightPoints.map((point, index) => (
                <li key={index}>
                  <EditableField
                    prop={`rightPoints.${index}`}
                    slideIdx={_slideIdx}
                    editable={_editable}
                    as="span"
                  >
                    {point}
                  </EditableField>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
