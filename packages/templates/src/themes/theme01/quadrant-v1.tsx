// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Blob, DottedPattern, Headline, Masthead, Pill, Plus, Ring, Sheet, Slash } from './shared.js';

export interface Theme01QuadrantV1Item {
  label?: string;
  items?: string[];
}

export interface Theme01QuadrantV1Props {
  kicker?: string;
  title?: string;
  xAxis?: string;
  yAxis?: string;
  quadrants?: Theme01QuadrantV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01QuadrantV1Meta: LayoutMeta = {
  id: 'theme01_quadrant_v1',
  theme: 'theme01',
  role: 'comparison',
  displayName: 'Theme 01 四象限分析',
  description: '色块拼贴 2x2 矩阵四象限分析',
  needsMedia: false,
};

export const theme01QuadrantV1Schema: PropsSchema = {
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
      key: 'xAxis',
      label: 'X 轴',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'yAxis',
      label: 'Y 轴',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'quadrants',
      label: '象限',
      type: 'array',
      maxItems: 4,
      minItems: 2,
      itemSchema: [
        {
          key: 'label',
          label: '名称',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'items',
          label: '子项',
          type: 'array',
          maxItems: 6,
          minItems: 2,
          itemSchema: [
            {
              key: 'item',
              label: '项',
              type: 'text',
              inlineEditable: true,
            },
          ],
        },
      ],
    },
  ],
};

const QUADRANT_COLORS = ['blue', 'green', 'amber', 'red'] as const;
const DEFAULT_LABELS = ['高价值 / 高可行性', '高价值 / 低可行性', '低价值 / 高可行性', '低价值 / 低可行性'];

export function Theme01QuadrantV1(props: Theme01QuadrantV1Props): ReactNode {
  const { kicker, title, xAxis, yAxis, quadrants = [], _slideIdx, _editable } = props;
  const safeQuadrants = quadrants.slice(0, 4);

  return (
    <Sheet substrate="light" frame="grid" className="lp-quadrant-v1">
      <Masthead section={kicker} slideIdx={_slideIdx} editable={_editable} />
      <Headline cn={title ?? ''} en="MATRIX" size="large" className="lp-quadrant-v1-headline lp-rise" />
      {(xAxis || yAxis) && (
        <div className="lp-quadrant-v1-axes lp-rise">
          {xAxis && (
            <span className="lp-quadrant-v1-axis">
              <Pill variant="outline" color="violet">X</Pill>
              <EditableField prop="xAxis" slideIdx={_slideIdx} editable={_editable} as="span">
                {xAxis}
              </EditableField>
            </span>
          )}
          {yAxis && (
            <span className="lp-quadrant-v1-axis">
              <Pill variant="outline" color="violet">Y</Pill>
              <EditableField prop="yAxis" slideIdx={_slideIdx} editable={_editable} as="span">
                {yAxis}
              </EditableField>
            </span>
          )}
        </div>
      )}
      {safeQuadrants.length > 0 && (
        <div className="lp-quadrant-v1-grid lp-rise">
          {safeQuadrants.map((q, index) => {
            const color = QUADRANT_COLORS[index % QUADRANT_COLORS.length];
            return (
              <div key={index} className={`lp-quadrant-v1-card color-${color}`}>
                <div className="lp-quadrant-v1-card-accent" aria-hidden="true" />
                <span className="lp-quadrant-v1-index" aria-hidden="true">
                  Q{index + 1}
                </span>
                <EditableField
                  prop={`quadrants.${index}.label`}
                  slideIdx={_slideIdx}
                  editable={_editable}
                  as="h3"
                  className="lp-quadrant-v1-label"
                >
                  {q.label || DEFAULT_LABELS[index] || ''}
                </EditableField>
                {q.items && q.items.length > 0 && (
                  <ul className="lp-quadrant-v1-items">
                    {q.items.slice(0, 6).map((item, i) => (
                      <li key={i}>
                        <EditableField
                          prop={`quadrants.${index}.items.${i}`}
                          slideIdx={_slideIdx}
                          editable={_editable}
                          as="span"
                        >
                          {item}
                        </EditableField>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
      <Blob
        className="lp-quadrant-v1-blob"
        style={{ width: 360, height: 360, bottom: -110, left: -90, background: 'var(--lp-blue)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-quadrant-v1-dots"
        style={{ top: 150, right: 80, width: 180, height: 180, opacity: 0.22 }}
      />
      <Slash
        className="lp-quadrant-v1-slash"
        style={{ top: 120, right: 100, height: 60, background: 'var(--lp-amber)', opacity: 0.55 }}
      />
      <Plus
        className="lp-quadrant-v1-plus"
        style={{ bottom: 100, left: 90, width: 26, height: 26, color: 'var(--lp-green)' }}
      />
      <Ring
        className="lp-quadrant-v1-ring"
        style={{ bottom: 90, right: 110, width: 60, height: 60, borderColor: 'var(--lp-red)' }}
      />
    </Sheet>
  );
}
