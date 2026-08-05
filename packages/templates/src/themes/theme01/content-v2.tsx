// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
export interface Theme01ContentV2Props {
  kicker?: string;
  title: string;
  leftPoints?: string[];
  rightPoints?: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}
export const theme01ContentV2Meta: LayoutMeta = {
  id: 'theme01_content_v2',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 双栏内容',
  description: '玻璃卡片双栏要点展示',
  needsMedia: false,
};
export const theme01ContentV2Schema: PropsSchema = {
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
export function Theme01ContentV2(props: Theme01ContentV2Props): ReactNode {
  const { kicker, title, leftPoints = [], rightPoints = [], _slideIdx, _editable } = props;
  return (<div className="lp-slide lp-content-v2">
      <div className="lp-content-header">
    {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>)}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-content-title lp-rise">
          {title}
    </EditableField>
      </div>
      <div className="lp-content-columns">
    <div className="lp-card lp-content-col lp-rise">
          <ul className="lp-bullet-list">
      {leftPoints.map((point, index) => (<li key={index}>
        <EditableField prop={`leftPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {point}
        </EditableField>
              </li>))}
          </ul>
    </div>
    <div className="lp-card lp-content-col lp-rise">
          <ul className="lp-bullet-list">
      {rightPoints.map((point, index) => (<li key={index}>
        <EditableField prop={`rightPoints.${index}`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {point}
        </EditableField>
              </li>))}
          </ul>
    </div>
      </div>
  </div>);
}
