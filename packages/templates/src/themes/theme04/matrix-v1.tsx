// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04MatrixV1Item {
  title: string;
  description?: string;
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04MatrixV1Axis {
  low: string;
  high: string;
}

export interface Theme04MatrixV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxis?: Theme04MatrixV1Axis;
  yAxis?: Theme04MatrixV1Axis;
  items?: Theme04MatrixV1Item[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04MatrixV1Meta: LayoutMeta = {
  id: 'theme04_matrix_v1',
  theme: 'theme04',
  role: 'content',
  displayName: 'Theme 04 矩阵网格',
  description: '2×2 四象限矩阵，展示分类与定位',
  needsMedia: false,
  tags: ['content', 'matrix', 'quadrant', 'candy'],
  contentShape: 'title-grid',
};

export const theme04MatrixV1Schema: PropsSchema = {
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
        { title: '明星赛道', description: '规模大、竞争密度高，资本持续加注。', tone: 'green' },
        { title: '潜力赛道', description: '规模尚小但增速快，早期机会显著。', tone: 'blue' },
        { title: '成熟赛道', description: '规模大但格局稳定，增量空间有限。', tone: 'yellow' },
        { title: '观望赛道', description: '规模与密度均低，仍需验证。', tone: 'pink' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 研究 · 2026' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-matrix-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04MatrixV1(props: Theme04MatrixV1Props): ReactNode {
  const { kicker, title, subtitle, xAxis, yAxis, items, footnote, _slideIdx, _editable } = props;
  const toneClass: Record<string, string> = {
    green: 'lp-theme04-card--green',
    pink: 'lp-theme04-card--pink',
    blue: 'lp-theme04-card--blue',
    yellow: 'lp-theme04-card--yellow',
  };
  const validItems = (items || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme04-matrix">
      <div className="lp-theme04-matrix-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-matrix-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-matrix-body lp-rise">
        <div className="lp-theme04-matrix-yaxis">
          <span className="lp-theme04-matrix-yaxis-high">{yAxis?.high || '高'}</span>
          <span className="lp-theme04-matrix-yaxis-line" aria-hidden="true" />
          <span className="lp-theme04-matrix-yaxis-low">{yAxis?.low || '低'}</span>
        </div>

        <div className="lp-theme04-matrix-grid">
          {validItems.map((item, idx) => (
            <div key={idx} className={`lp-theme04-matrix-card lp-theme04-card ${toneClass[item.tone || 'green'] || ''}`} style={{ animationDelay: `${idx * 80}ms` }}>
              <EditableField prop={`items.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-matrix-card-title">{item.title}</EditableField>
              {item.description && (
                <EditableField prop={`items.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-matrix-card-desc">{item.description}</EditableField>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="lp-theme04-matrix-xaxis lp-rise">
        <span>{xAxis?.low || '低'}</span>
        <span className="lp-theme04-matrix-xaxis-line" aria-hidden="true" />
        <span>{xAxis?.high || '高'}</span>
      </div>

      {footnote && (
        <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-matrix-footnote lp-rise">{footnote}</EditableField>
      )}
    </div>
  );
}
