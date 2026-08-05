// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
export interface Theme01ComparisonV1Props {
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
export const theme01ComparisonV1Meta: LayoutMeta = {
  id: 'theme01_comparison_v1',
  theme: 'theme01',
  role: 'comparison',
  displayName: 'Theme 01 左右对比',
  description: '玻璃卡片左右两栏对比',
  needsMedia: false,
};
export const theme01ComparisonV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'leftTitle',
      label: '左侧标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'leftPoints',
      label: '左侧要点',
      type: 'array',
      maxItems: 6,
      minItems: 2,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    },
    {
      key: 'rightTitle',
      label: '右侧标题',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'rightPoints',
      label: '右侧要点',
      type: 'array',
      maxItems: 6,
      minItems: 2,
      itemSchema: [
        {
          key: 'item',
          label: '项',
          type: 'text',
          inlineEditable: true
        }
      ]
    }
  ]
};
export function Theme01ComparisonV1(props: Theme01ComparisonV1Props): ReactNode {
  const { kicker, title, leftTitle = '方案 A', leftPoints = [], rightTitle = '方案 B', rightPoints = [], _slideIdx, _editable, } = props;
  return (<div className="lp-slide lp-comparison-v1">
      <div className="lp-comparison-inner">
    {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>)}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-comparison-title lp-rise">
          {title}
    </EditableField>
    <div className="lp-comparison-grid">
          <div className="lp-card lp-comparison-col lp-rise">
      <EditableField prop="leftTitle" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-comparison-col-title">
              {leftTitle}
      </EditableField>
      <ul className="lp-comparison-list">
              {leftPoints.map((point, index) => (<li key={index}>
                  <EditableField prop={`leftPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
          {point}
                  </EditableField>
        </li>))}
      </ul>
          </div>
          <div className="lp-card lp-comparison-col lp-rise">
      <EditableField prop="rightTitle" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-comparison-col-title">
              {rightTitle}
      </EditableField>
      <ul className="lp-comparison-list">
              {rightPoints.map((point, index) => (<li key={index}>
                  <EditableField prop={`rightPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
          {point}
                  </EditableField>
        </li>))}
      </ul>
          </div>
    </div>
      </div>
  </div>);
}
