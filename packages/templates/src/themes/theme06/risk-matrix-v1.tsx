// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06RiskMatrixV1Cell {
  title?: string;
  description?: string;
  level?: 'high' | 'medium' | 'low';
  focus?: boolean;
}

export interface Theme06RiskMatrixV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  cells?: Theme06RiskMatrixV1Cell[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06RiskMatrixV1Meta: LayoutMeta = {
  id: 'theme06_risk_matrix_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 风险矩阵',
  description: '2×2 风险矩阵，展示风险等级与应对策略',
  needsMedia: true,
  tags: ['risk', 'matrix', 'strategy', 'atlas'],
  contentShape: 'matrix',
};

export const theme06RiskMatrixV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RISK MATRIX' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: 'AI 投资关键风险矩阵' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按发生概率与影响程度划分的四类核心风险' },
    { key: 'xAxisLabel', label: 'X 轴标签', type: 'text', inlineEditable: true, defaultValue: '影响程度 →' },
    { key: 'yAxisLabel', label: 'Y 轴标签', type: 'text', inlineEditable: true, defaultValue: '发生概率 →' },
    {
      key: 'cells',
      label: '矩阵单元',
      type: 'array',
      minItems: 4,
      maxItems: 4,
      defaultValue: [
        { title: '技术路线不确定', description: '模型能力演进可能偏离预期，需保持多路线投入。', level: 'high', focus: true },
        { title: '监管政策收紧', description: '数据合规与内容安全要求提高，合规成本上升。', level: 'high' },
        { title: '人才竞争激烈', description: '核心算法与工程人才稀缺，招聘与留存成本持续走高。', level: 'medium' },
        { title: '客户付费意愿波动', description: '宏观经济影响企业 IT 预算，需强化 ROI 证明。', level: 'low' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        { key: 'description', label: '描述', type: 'textarea', inlineEditable: true },
        {
          key: 'level',
          label: '风险等级',
          type: 'select',
          options: [
            { value: 'high', label: '高' },
            { value: 'medium', label: '中' },
            { value: 'low', label: '低' },
          ],
        },
        { key: 'focus', label: '高亮', type: 'boolean' },
      ],
    },
  ],
};

const LEVEL_LABELS: Record<string, string> = {
  high: 'HIGH RISK',
  medium: 'MEDIUM RISK',
  low: 'LOW RISK',
};

export function Theme06RiskMatrixV1(props: Theme06RiskMatrixV1Props): ReactNode {
  const { kicker, title, subtitle, xAxisLabel, yAxisLabel, cells = [], _slideIdx, _editable } = props;
  const validCells = (cells || []).filter((c): c is Theme06RiskMatrixV1Cell => c != null).slice(0, 4);

  return (
    <div className="lp-slide lp-theme06-risk-matrix">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-risk-matrix-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-risk-matrix-body lp-rise">
        <div className="lp-theme06-risk-matrix-grid">
          {validCells.map((cell, index) => (
            <div key={index} className={`lp-theme06-risk-matrix-cell level-${cell.level || 'medium'} ${cell.focus ? 'focus' : ''}`}>
              <div className="lp-theme06-risk-matrix-level">{LEVEL_LABELS[cell.level || 'medium']}</div>
              <EditableField prop={`cells.${index}.title`} slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-risk-matrix-cell-title">{cell.title || ''}</EditableField>
              {cell.description && (
                <EditableField prop={`cells.${index}.description`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-risk-matrix-cell-desc">{cell.description}</EditableField>
              )}
            </div>
          ))}
        </div>
        <div className="lp-theme06-risk-matrix-axis">
          <span>{xAxisLabel || ''}</span>
          <span>{yAxisLabel || ''}</span>
        </div>
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
