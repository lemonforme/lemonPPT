// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02NumberShowcaseV1Props {
  kicker?: string;
  title?: string;
  value: string;
  unit?: string;
  description?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02NumberShowcaseV1Meta: LayoutMeta = {
  id: 'theme02_number_showcase_v1',
  theme: 'theme02',
  role: 'metric',
  displayName: 'Theme 02 数字秀',
  description: '单个大数字霓虹发光 + 标题与解读',
  needsMedia: false,
  tags: ['metric', 'high-impact', 'single-stat'],
};

export const theme02NumberShowcaseV1Schema: PropsSchema = {
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
      key: 'value',
      label: '主数值',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'unit',
      label: '单位',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'description',
      label: '解读说明',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme02NumberShowcaseV1(props: Theme02NumberShowcaseV1Props): ReactNode {
  const { kicker, title, value, unit, description, footnote, _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-number-showcase-v1">
      <div className="lp-theme02-number-showcase-v1-glow" aria-hidden="true" />
      <div className="lp-theme02-number-showcase-v1-rings" aria-hidden="true">
        <div className="lp-theme02-number-showcase-v1-ring" />
        <div className="lp-theme02-number-showcase-v1-ring lp-theme02-number-showcase-v1-ring--inner" />
      </div>
      <div className="lp-theme02-number-showcase-v1-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme02-number-showcase-v1-title lp-rise">
            {title}
          </EditableField>
        )}
        <div className="lp-theme02-number-showcase-v1-value-wrap lp-rise">
          <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-number-showcase-v1-value">
            {value}
          </EditableField>
          {unit && (
            <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme02-number-showcase-v1-unit">
              {unit}
            </EditableField>
          )}
        </div>
        {description && (
          <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-number-showcase-v1-description lp-rise">
            {description}
          </EditableField>
        )}
        {footnote && (
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme02-number-showcase-v1-footnote lp-rise">
            {footnote}
          </EditableField>
        )}
      </div>
    </div>
  );
}
