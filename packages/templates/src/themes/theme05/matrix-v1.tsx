// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme05MatrixV1Item {
  title: string;
  description?: string;
  scheme?: 'coral' | 'amber' | 'teal' | 'indigo' | 'violet';
}

export interface Theme05MatrixV1Axis {
  low: string;
  high: string;
}

export interface Theme05MatrixV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxis?: Theme05MatrixV1Axis;
  yAxis?: Theme05MatrixV1Axis;
  items?: Theme05MatrixV1Item[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme05MatrixV1Meta: LayoutMeta = {
  id: 'theme05_matrix_v1',
  theme: 'theme05',
  role: 'content',
  displayName: 'Theme 05 矩阵网格',
  description: '2×2 四象限矩阵，展示分类与定位',
  needsMedia: false,
  tags: ['content', 'matrix', 'quadrant', 'spectrum'],
  contentShape: 'title-grid',
};

export const theme05MatrixV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '定位矩阵' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{赛道}}吸引力矩阵' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按市场规模与竞争密度划分的四象限' },
    { key: 'xAxis.low', label: 'X轴左端', type: 'text', defaultValue: '低规模' },
    { key: 'xAxis.high', label: 'X轴右端', type: 'text', defaultValue: '高规模' },
    { key: 'yAxis.low', label: 'Y轴下端', type: 'text', defaultValue: '低密度' },
    { key: 'yAxis.high', label: 'Y轴上端', type: 'text', defaultValue: '高密度' },
    {
      key: 'items',
      label: '矩阵项',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { title: '明星赛道', description: '规模大、竞争密度高，资本持续加注。', scheme: 'coral' },
        { title: '潜力赛道', description: '规模尚小但增速快，早期机会显著。', scheme: 'teal' },
        { title: '成熟赛道', description: '规模大但格局稳定，增量空间有限。', scheme: 'amber' },
        { title: '观望赛道', description: '规模与密度均低，仍需验证。', scheme: 'indigo' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
        { key: 'scheme', label: '强调色', type: 'select', defaultValue: 'coral', options: [{ value: 'coral', label: '珊瑚' }, { value: 'amber', label: '琥珀' }, { value: 'teal', label: '青绿' }, { value: 'indigo', label: '靛蓝' }, { value: 'violet', label: '紫罗兰' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
  ],
};

function schemeClass(scheme?: string): string {
  return `lp-theme05-card--${scheme || 'coral'}`;
}

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme05-matrix-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme05-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme05MatrixV1(props: Theme05MatrixV1Props): ReactNode {
  const { kicker, title, subtitle, xAxis, yAxis, items, footnote, _slideIdx, _editable } = props;
  const validItems = (items || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme05-matrix">
      <div className="lp-theme05-matrix-head lp-rise">
        {kicker && <div className="lp-theme05-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-matrix-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme05-matrix-body lp-rise">
        <div className="lp-theme05-matrix-yaxis">
          <span className="lp-theme05-matrix-yaxis-high">{yAxis?.high || '高'}</span>
          <span className="lp-theme05-matrix-yaxis-line" aria-hidden="true" />
          <span className="lp-theme05-matrix-yaxis-low">{yAxis?.low || '低'}</span>
        </div>

        <div className="lp-theme05-matrix-grid">
          {validItems.map((item, idx) => (
            <div key={idx} className={`lp-theme05-matrix-card lp-theme05-card ${schemeClass(item.scheme)}`} style={{ animationDelay: `${idx * 80}ms` }}>
              <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme05-matrix-card-title">{item.title}</EditableField>
              {item.description && (
                <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme05-matrix-card-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lp-theme05-matrix-xaxis lp-rise">
        <span>{xAxis?.low || '低'}</span>
        <span className="lp-theme05-matrix-xaxis-line" aria-hidden="true" />
        <span>{xAxis?.high || '高'}</span>
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme05-matrix-footnote lp-rise">{footnote}</EditableField>
      )}

      <div className="lp-theme05-footer">
        <span className="lp-theme05-footer-left" />
        <span className="lp-theme05-footer-right" />
      </div>
    </div>
  );
}
