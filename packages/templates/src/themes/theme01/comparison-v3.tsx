// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Sheet, Masthead, Headline, Pill, Blob, DottedPattern } from './shared.js';

export interface Theme01ComparisonV3Props {
  kicker?: string;
  title?: string;
  leftTitle?: string;
  rightTitle?: string;
  rows?: Array<{ feature?: string; left?: string; right?: string }>;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ComparisonV3Meta: LayoutMeta = {
  id: 'theme01_comparison_v3',
  theme: 'theme01',
  role: 'comparison',
  displayName: 'Theme 01 横向对比表',
  description: '细边框胶囊标签横向逐项对比',
  needsMedia: false,
};

export const theme01ComparisonV3Schema: PropsSchema = {
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
      key: 'rows',
      label: 'rows',
      type: 'array',
      maxItems: 5,
      minItems: 2,
      itemSchema: [
        {
          key: 'feature',
          label: '特性',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'left',
          label: '左侧',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'right',
          label: '右侧',
          type: 'text',
          inlineEditable: true,
        },
      ],
    },
  ],
};

export function Theme01ComparisonV3(props: Theme01ComparisonV3Props): ReactNode {
  const { kicker, title, leftTitle = '方案 A', rightTitle = '方案 B', rows = [], _slideIdx, _editable } = props;
  const safeRows = rows.slice(0, 5);

  return (
    <Sheet substrate="light" frame="grid" className="lp-comparison-v3">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="COMPARISON" size="large" className="lp-comparison-v3-headline lp-rise" />
      <div className="lp-comparison-v3-canvas lp-rise">
        <div className="lp-comparison-v3-table">
          <div className="lp-comparison-v3-row lp-comparison-v3-row--header">
            <div className="lp-comparison-v3-cell lp-comparison-v3-feature">
              <Pill variant="outline" color="amber">维度</Pill>
            </div>
            <div className="lp-comparison-v3-cell lp-comparison-v3-left">
              <Pill variant="fill" color="blue">{leftTitle}</Pill>
            </div>
            <div className="lp-comparison-v3-cell lp-comparison-v3-right">
              <Pill variant="fill" color="green">{rightTitle}</Pill>
            </div>
          </div>
          {safeRows.map((row, index) => (
            <div key={index} className="lp-comparison-v3-row">
              <EditableField
                prop={`rows.${index}.feature`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-comparison-v3-cell lp-comparison-v3-feature"
              >
                {row.feature}
              </EditableField>
              <EditableField
                prop={`rows.${index}.left`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-comparison-v3-cell lp-comparison-v3-left"
              >
                {row.left ?? ''}
              </EditableField>
              <EditableField
                prop={`rows.${index}.right`}
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-comparison-v3-cell lp-comparison-v3-right"
              >
                {row.right ?? ''}
              </EditableField>
            </div>
          ))}
        </div>
      </div>
      <Blob
        className="lp-comparison-v3-blob"
        style={{ width: 340, height: 340, bottom: -100, right: -80, background: 'var(--lp-amber)', opacity: 0.18 }}
      />
      <DottedPattern
        className="lp-comparison-v3-dots"
        style={{ top: 140, left: 70, width: 150, height: 150, opacity: 0.22 }}
      />
    </Sheet>
  );
}
