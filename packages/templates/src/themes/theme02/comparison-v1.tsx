// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02ComparisonV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftItems: string[];
  rightItems: string[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02ComparisonV1Meta: LayoutMeta = {
  id: 'theme02_comparison_v1',
  theme: 'theme02',
  role: 'comparison',
  displayName: 'Theme 02 霓虹对比',
  description: '左右双栏对比 + 霓虹强调',
  needsMedia: false,
};

export const theme02ComparisonV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'leftTitle',
      label: '左侧标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'rightTitle',
      label: '右侧标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'leftItems',
      label: '左侧项',
      type: 'array',
      itemSchema: [{ key: 'value', label: '内容', type: 'text', inlineEditable: true }],
    },
    {
      key: 'rightItems',
      label: '右侧项',
      type: 'array',
      itemSchema: [{ key: 'value', label: '内容', type: 'text', inlineEditable: true }],
    },
  ],
};

export function Theme02ComparisonV1(props: Theme02ComparisonV1Props): ReactNode {
  const { kicker, title, subtitle, leftTitle, rightTitle, leftItems = [], rightItems = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-comparison-v1">
      <div className="lp-theme02-comparison-header">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme02-comparison-title lp-rise">
            {title}
          </EditableField>
        )}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-comparison-subtitle lp-rise">
            {subtitle}
          </EditableField>
        )}
      </div>
      <div className="lp-theme02-comparison-grid">
        <div className="lp-theme02-comparison-column lp-theme02-comparison-column--left lp-rise">
          {leftTitle && (
            <EditableField prop="leftTitle" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme02-comparison-column-title">
              {leftTitle}
            </EditableField>
          )}
          <ul className="lp-theme02-comparison-list">
            {leftItems.map((item, index) => (
              <li key={index}>
                <EditableField prop={`leftItems.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {item}
                </EditableField>
              </li>
            ))}
          </ul>
        </div>
        <div className="lp-theme02-comparison-vs">VS</div>
        <div className="lp-theme02-comparison-column lp-theme02-comparison-column--right lp-rise" style={{ animationDelay: '120ms' }}>
          {rightTitle && (
            <EditableField prop="rightTitle" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme02-comparison-column-title">
              {rightTitle}
            </EditableField>
          )}
          <ul className="lp-theme02-comparison-list">
            {rightItems.map((item, index) => (
              <li key={index}>
                <EditableField prop={`rightItems.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {item}
                </EditableField>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
