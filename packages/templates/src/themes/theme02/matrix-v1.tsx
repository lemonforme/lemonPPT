// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme02MatrixV1Quadrant {
  title: string;
  desc?: string;
}

export interface Theme02MatrixV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  axisX?: string;
  axisY?: string;
  quadrants?: Theme02MatrixV1Quadrant[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme02MatrixV1Meta: LayoutMeta = {
  id: 'theme02_matrix_v1',
  theme: 'theme02',
  role: 'comparison',
  displayName: 'Theme 02 四象限矩阵',
  description: '2x2 象限矩阵，带坐标轴标签',
  needsMedia: false,
};

export const theme02MatrixV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '标签', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    { key: 'axisX', label: '横轴', type: 'text', inlineEditable: true },
    { key: 'axisY', label: '纵轴', type: 'text', inlineEditable: true },
    {
      key: 'quadrants',
      label: '象限',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      itemSchema: [
        { key: 'title', label: '象限标题', type: 'text', inlineEditable: true },
        { key: 'desc', label: '象限描述', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

export function Theme02MatrixV1(props: Theme02MatrixV1Props): ReactNode {
  const { kicker, title, subtitle, axisX, axisY, quadrants = [], _slideIdx, _editable } = props;

  return (
    <div className="lp-slide lp-theme02-matrix-v1">
      <div className="lp-card lp-theme02-matrix-card lp-rise">
        <div className="lp-theme02-matrix-header">
          {kicker && (
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill">
              {kicker}
            </EditableField>
          )}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-theme02-matrix-title">
            {title}
          </EditableField>
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-matrix-subtitle">
              {subtitle}
            </EditableField>
          )}
        </div>
        <div className="lp-theme02-matrix-body">
          <div className="lp-theme02-matrix-yaxis">{axisY && <EditableField prop="axisY" slideIdx={_slideIdx} editable={_editable} as="span">{axisY}</EditableField>}</div>
          <div className="lp-theme02-matrix-grid">
            {Array.from({ length: 4 }).map((_, qi) => {
              const q = quadrants[qi];
              return (
                <div key={qi} className={`lp-theme02-matrix-cell lp-theme02-matrix-cell--${qi} lp-rise`} style={{ animationDelay: `${qi * 60}ms` }}>
                  {q && (
                    <>
                      <EditableField prop={`quadrants.${qi}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme02-matrix-cell-title">
                        {q.title}
                      </EditableField>
                      {q.desc && (
                        <EditableField prop={`quadrants.${qi}.desc`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme02-matrix-cell-desc">
                          {q.desc}
                        </EditableField>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <div className="lp-theme02-matrix-xaxis">{axisX && <EditableField prop="axisX" slideIdx={_slideIdx} editable={_editable} as="span">{axisX}</EditableField>}</div>
        </div>
      </div>
    </div>
  );
}
