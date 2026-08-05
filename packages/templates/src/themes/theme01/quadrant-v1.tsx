// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
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
  description: '2x2 矩阵四象限分析',
  needsMedia: false,
};
export const theme01QuadrantV1Schema: PropsSchema = {
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
      key: 'xAxis',
      label: 'xAxis',
      type: 'text',
      inlineEditable: true
    },
    {
      key: 'yAxis',
      label: 'yAxis',
      type: 'text',
      inlineEditable: true
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
          inlineEditable: true
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
              inlineEditable: true
            }
          ]
        }
      ]
    }
  ]
};
export function Theme01QuadrantV1(props: Theme01QuadrantV1Props): ReactNode {
  const { kicker, title, xAxis, yAxis, quadrants = [], _slideIdx, _editable } = props;
  const safeQuadrants = quadrants.slice(0, 4);
  const defaultLabels = ['高价值 / 高可行性', '高价值 / 低可行性', '低价值 / 高可行性', '低价值 / 低可行性'];
  const colors = ['var(--lp-blue)', 'var(--lp-green)', 'var(--lp-amber)', 'var(--lp-red)'];
  return (<div className="lp-slide lp-quadrant-v1">
      <div className="lp-quadrant-v1-inner">
    {kicker && (<EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-rise">
      {kicker}
          </EditableField>)}
    <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-quadrant-v1-title lp-rise">
          {title}
    </EditableField>
    {(xAxis || yAxis) && (<div className="lp-quadrant-v1-axes lp-rise">
      {xAxis && <span className="lp-quadrant-v1-axis">X: {xAxis}</span>}
      {yAxis && <span className="lp-quadrant-v1-axis">Y: {yAxis}</span>}
          </div>)}
    {safeQuadrants.length > 0 && (<div className="lp-quadrant-v1-grid lp-rise">
      {safeQuadrants.map((q, index) => {
        const color = colors[index % colors.length];
        return (<div key={index} className="lp-card lp-quadrant-v1-card" style={{ borderTop: `4px solid ${color}` }}>
                  <EditableField prop={`quadrants.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-quadrant-v1-label">
          {q.label || defaultLabels[index] || ''}
                  </EditableField>
                  {q.items && q.items.length > 0 && (<ul className="lp-quadrant-v1-items">
                      {q.items.slice(0, 6).map((item, i) => (<li key={i}>
                          <EditableField prop={`quadrants.${index}.items.${i}`} slideIdx={_slideIdx} editable={_editable} as="span">
              {item}
                          </EditableField>
            </li>))}
          </ul>)}
        </div>);
      })}
          </div>)}
      </div>
  </div>);
}
