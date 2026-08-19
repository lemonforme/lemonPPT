// lemonPPT - theme08 黑金实验 · 场景矩阵（2×2）
// 原创实现，不复制 third-party theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface MatrixCell {
  title: string;
  desc: string;
  tags?: string[];
  dark?: boolean;
  cornerBadge?: string;
}

export interface Theme08MatrixV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  cells?: MatrixCell[]; // 固定 4 个
  xAxisLabel?: string;
  yAxisLabel?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08MatrixV1Meta: LayoutMeta = {
  id: 'theme08_matrix_v1',
  theme: 'theme08',
  role: 'swot',
  displayName: 'Theme 08 场景矩阵',
  description: '2×2 场景矩阵，区分叙事泡沫 / 明星兑现 / 等待验证 / 隐形价值',
  needsMedia: false,
  tags: ['matrix', 'quadrant', 'scenario', 'black-gold'],
  contentShape: 'quadrant',
};

export const theme08MatrixV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SCENARIO MATRIX' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '场景矩阵' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'cells',
      label: '矩阵单元',
      type: 'array',
      minItems: 4,
      maxItems: 4,
      defaultValue: [
        { title: '叙事泡沫', desc: '通用大模型赛道拥挤，但差异化不足。短期估值承压。', tags: ['通用大模型', 'AGI 实验室'], dark: false, cornerBadge: '' },
        { title: '明星兑现', desc: '头部公司开始产生正向现金流，商业化路径清晰。', tags: ['基础设施', '数据平台'], dark: true, cornerBadge: '看好参股' },
        { title: '等待验证', desc: '长尾工具和 AI 安全领域尚需时间证明价值。', tags: ['长尾工具', 'AI 安全', '早期硬件'], dark: false, cornerBadge: '' },
        { title: '隐形价值', desc: '垂直应用和企业搜索正在悄然构建护城河。', tags: ['垂直应用', '企业搜索'], dark: false, cornerBadge: '' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'desc', label: '描述', type: 'textarea' },
        { key: 'tags', label: '标签', type: 'array', itemSchema: [{ key: 'item', label: '标签', type: 'text' }] },
        { key: 'dark', label: '深色格', type: 'boolean' },
        { key: 'cornerBadge', label: '角标', type: 'text' },
      ],
    },
    { key: 'xAxisLabel', label: 'X 轴标签', type: 'text', inlineEditable: true, defaultValue: '商业兑现 →' },
    { key: 'yAxisLabel', label: 'Y 轴标签', type: 'text', inlineEditable: true, defaultValue: '↑ 资本热度' },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '09' },
  ],
};

export function Theme08MatrixV1(props: Theme08MatrixV1Props): ReactNode {
  const {
    kicker, title, subtitle,
    cells = [],
    xAxisLabel, yAxisLabel,
    footnoteLeft, footnoteRight,
    _slideIdx, _editable,
  } = props;
  const validCells = (cells || []).slice(0, 4);

  return (
    <div className="lp-slide lp-theme08 lp-theme08-matrix-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="target" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-matrix-body lp-rise">
            {validCells.map((cell, i) => (
              <div key={i} className={`lp-theme08-matrix-cell${cell.dark ? ' dark' : ' light'}`} style={{ animationDelay: `${i * 60}ms`, color: cell.dark ? 'var(--lp-inverse-panel-ink)' : undefined }}>
                {cell.cornerBadge && <span className="lp-theme08-matrix-cell-corner"><EditableField prop={`cells.${i}.cornerBadge`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.cornerBadge}</EditableField></span>}
                <div className="lp-theme08-matrix-cell-title" style={{ color: cell.dark ? 'var(--lp-inverse-panel-ink)' : undefined }}><EditableField prop={`cells.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.title}</EditableField></div>
                <div className="lp-theme08-matrix-cell-desc" style={{ color: cell.dark ? 'color-mix(in srgb, var(--lp-inverse-panel-ink) 80%, transparent)' : undefined }}><EditableField prop={`cells.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="span">{cell.desc}</EditableField></div>
                {cell.tags && cell.tags.length > 0 && (
                  <div className="lp-theme08-matrix-cell-tags">
                    {cell.tags.map((t, ti) => (
                      <span key={ti} className="lp-theme08-matrix-tag">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {(xAxisLabel || yAxisLabel) && (
            <div className="lp-theme08-matrix-axis">
              {yAxisLabel && <span className="lp-theme08-matrix-axis-y"><EditableField prop="yAxisLabel" slideIdx={_slideIdx} editable={_editable} as="span">{yAxisLabel}</EditableField></span>}
              {xAxisLabel && <span className="lp-theme08-matrix-axis-x"><EditableField prop="xAxisLabel" slideIdx={_slideIdx} editable={_editable} as="span">{xAxisLabel}</EditableField></span>}
            </div>
          )}
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
