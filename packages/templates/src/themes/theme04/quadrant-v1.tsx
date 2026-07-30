// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04QuadrantV1Item {
  title: string;
  description?: string;
  tags?: string[];
  tone?: 'green' | 'yellow' | 'blue' | 'pink';
}

export interface Theme04QuadrantV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  xAxisLabels?: [string, string];
  yAxisLabel?: string;
  yAxisLabels?: [string, string];
  quadrants?: Theme04QuadrantV1Item[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04QuadrantV1Meta: LayoutMeta = {
  id: 'theme04_quadrant_v1',
  theme: 'theme04',
  role: 'comparison',
  displayName: 'Theme 04 选题四象限',
  description: '2×2 玻璃糖果色象限矩阵，适合定位/策略分析',
  needsMedia: false,
  tags: ['quadrant', 'matrix', 'candy'],
  contentShape: '2x2-quadrant',
};

export const theme04QuadrantV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '选题四象限 · 资本热度 × 商业兑现' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '从「谁融得多」升级为{{「谁能兑现」}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '' },
    { key: 'xAxisLabel', label: '横轴标签', type: 'text', inlineEditable: true, defaultValue: '商业兑现度' },
    { key: 'xAxisLabels', label: '横轴两端标签', type: 'array', defaultValue: ['低 / 待验证', '高'] },
    { key: 'yAxisLabel', label: '纵轴标签', type: 'text', inlineEditable: true, defaultValue: '资本热度' },
    { key: 'yAxisLabels', label: '纵轴两端标签', type: 'array', defaultValue: ['低', '高'] },
    {
      key: 'quadrants',
      label: '象限',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { title: '明星兑现区', description: '融资热度与收入确定性兼具，「卖铲子」逻辑成立。', tags: ['CoreWeave', 'Databricks', 'Scale AI'], tone: 'green' },
        { title: '叙事泡沫区', description: '巨额融资在手，商业兑现仍受成本与监管约束。', tags: ['OpenAI', 'Anthropic', 'xAI'], tone: 'yellow' },
        { title: '隐形价值区', description: '单笔不一定最大，但落地路径与留存更清晰。', tags: ['Glean', 'Perplexity'], tone: 'blue' },
        { title: '等待验证区', description: '概念成立、规模未证，作为风险与边缘变量观察。', tags: ['长尾工具链', 'AI 安全', '早期硬件'], tone: 'pink' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        {
          key: 'tags',
          label: '标签',
          type: 'array',
          maxItems: 5,
          itemSchema: [{ key: 'value', label: '标签', type: 'text' }],
        },
        { key: 'tone', label: '色调', type: 'select', options: [{ value: 'green', label: '绿' }, { value: 'yellow', label: '黄' }, { value: 'blue', label: '蓝' }, { value: 'pink', label: '粉' }] },
      ],
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-quadrant-title lp-rise">
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

export function Theme04QuadrantV1(props: Theme04QuadrantV1Props): ReactNode {
  const { kicker, title, subtitle, xAxisLabel, xAxisLabels, yAxisLabel, yAxisLabels, quadrants, _slideIdx, _editable } = props;
  const safeQuadrants = (quadrants ?? []).slice(0, 4);
  const xLabels = (xAxisLabels ?? ['低 / 待验证', '高']) as [string, string];
  const yLabels = (yAxisLabels ?? ['低', '高']) as [string, string];

  return (
    <div className="lp-slide lp-theme04-quadrant">
      <div className="lp-theme04-quadrant-head lp-rise">
        {kicker && <div className="lp-theme04-kicker">{kicker}</div>}
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-quadrant-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-quadrant-wrap lp-rise">
        <div className="lp-theme04-quadrant-axis lp-theme04-quadrant-axis--y">
          <span className="lp-theme04-quadrant-axis-label">{yAxisLabel ?? '资本热度'}</span>
          <span className="lp-theme04-quadrant-axis-end">{yLabels[1]}</span>
        </div>
        <div className="lp-theme04-quadrant-grid">
          {safeQuadrants.map((q, idx) => (
            <div key={idx} className={`lp-theme04-quadrant-card lp-theme04-card lp-theme04-card--${q.tone ?? 'green'}`}>
              <div className="lp-theme04-quadrant-card-head">
                <span className="lp-theme04-quadrant-dot" />
                <EditableField prop={`quadrants.${idx}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme04-quadrant-card-title">{q.title}</EditableField>
                <span className="lp-theme04-quadrant-card-number">{String(idx + 1).padStart(2, '0')}</span>
              </div>
              {q.description && (
                <EditableField prop={`quadrants.${idx}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-quadrant-card-desc">{q.description}</EditableField>
              )}
              {(q.tags ?? []).length > 0 && (
                <div className="lp-theme04-quadrant-tags">
                  {(q.tags ?? []).slice(0, 5).map((tag, tidx) => (
                    <span key={tidx} className="lp-theme04-quadrant-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="lp-theme04-quadrant-axis lp-theme04-quadrant-axis--x">
          <span className="lp-theme04-quadrant-axis-label">{xAxisLabel ?? '商业兑现度'}</span>
          <span className="lp-theme04-quadrant-axis-end">{xLabels[1]}</span>
        </div>
      </div>
    </div>
  );
}
