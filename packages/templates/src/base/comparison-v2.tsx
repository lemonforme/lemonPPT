// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../editable-field.js';

export interface ComparisonV2Props {
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

export const comparisonV2Meta: LayoutMeta = {
  id: 'comparison_v2',
  theme: 'base',
  role: 'comparison',
  displayName: '优缺点对比',
  description: '左右卡片式优缺点/正反面对比',
  needsMedia: false,
};

export function ComparisonV2(props: ComparisonV2Props): ReactNode {
  const {
    kicker,
    title,
    leftTitle = '优势',
    leftPoints = [],
    rightTitle = '劣势',
    rightPoints = [],
    _slideIdx,
    _editable,
  } = props;

  return (
    <div className="lp-slide lp-comparison-v2">
      <div className="lp-comparison-v2-inner">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-kicker">
            {kicker}
          </EditableField>
        )}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-heading lp-comparison-title">
          {title}
        </EditableField>
        <div className="lp-comparison-v2-grid">
          <div className="lp-comparison-v2-card lp-comparison-v2-card-left">
            <EditableField prop="leftTitle" slideIdx={_slideIdx} editable={_editable} as="h3">
              {leftTitle}
            </EditableField>
            <ul>
              {leftPoints.map((point, index) => (
                <li key={index}>
                  <EditableField prop={`leftPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
                    {point}
                  </EditableField>
                </li>
              ))}
            </ul>
          </div>
          <div className="lp-comparison-v2-card lp-comparison-v2-card-right">
            <EditableField prop="rightTitle" slideIdx={_slideIdx} editable={_editable} as="h3">
              {rightTitle}
            </EditableField>
            <ul>
              {rightPoints.map((point, index) => (
                <li key={index}>
                  <EditableField prop={`rightPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
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
