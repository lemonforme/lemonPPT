// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06ComparisonV1Point {
  text?: string;
  winner?: 'left' | 'right' | 'tie';
}

export interface Theme06ComparisonV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  points?: Theme06ComparisonV1Point[];
  leftSummary?: string;
  rightSummary?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ComparisonV1Meta: LayoutMeta = {
  id: 'theme06_comparison_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 对比分析',
  description: '左右双栏对比，突出优劣势差异',
  needsMedia: true,
  tags: ['comparison', 'versus', 'atlas'],
  contentShape: 'comparison',
};

export const theme06ComparisonV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COMPARISON' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '方案对比分析' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从效率、成本与体验三个维度评估两种路径' },
    { key: 'leftTitle', label: '左侧标题', type: 'text', inlineEditable: true, defaultValue: '传统方式' },
    { key: 'rightTitle', label: '右侧标题', type: 'text', inlineEditable: true, defaultValue: 'AI 驱动' },
    {
      key: 'points',
      label: '对比项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { text: '制作周期从 2 周缩短到 2 天', winner: 'right' },
        { text: '人力成本随页数线性增长', winner: 'left' },
        { text: '风格一致性与品牌契合度更高', winner: 'right' },
        { text: '需要人工反复校对数据', winner: 'left' },
      ],
      itemSchema: [
        { key: 'text', label: '对比描述', type: 'textarea', inlineEditable: true },
        {
          key: 'winner',
          label: '优势方',
          type: 'select',
          options: [
            { value: 'left', label: '左侧' },
            { value: 'right', label: '右侧' },
            { value: 'tie', label: '持平' },
          ],
        },
      ],
    },
    { key: 'leftSummary', label: '左侧总结', type: 'textarea', inlineEditable: true, defaultValue: '适合单页、临时性汇报，长期规模化成本较高。' },
    { key: 'rightSummary', label: '右侧总结', type: 'textarea', inlineEditable: true, defaultValue: '适合高频、标准化场景，可显著释放生产力。' },
  ],
};

export function Theme06ComparisonV1(props: Theme06ComparisonV1Props): ReactNode {
  const {
    kicker,
    title,
    subtitle,
    leftTitle = '左侧',
    rightTitle = '右侧',
    points = [],
    leftSummary,
    rightSummary,
    _slideIdx,
    _editable,
  } = props;
  const validPoints = (points || []).filter((p): p is Theme06ComparisonV1Point => p != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-comparison">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-comparison-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-comparison-body lp-rise">
        <div className="lp-theme06-comparison-col lp-theme06-comparison-col--left">
          <EditableField prop="leftTitle" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-comparison-col-title">{leftTitle}</EditableField>
          <ul className="lp-theme06-comparison-list">
            {validPoints.map((point, index) => (
              <li
                key={index}
                className={`lp-theme06-comparison-item ${point.winner === 'left' ? 'lp-theme06-comparison-item--win' : ''}`}
              >
                <span className="lp-theme06-comparison-marker">
                  {point.winner === 'left' ? '◆' : point.winner === 'right' ? '◇' : '•'}
                </span>
                <EditableField prop={`points.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{point.text || ''}</EditableField>
              </li>
            ))}
          </ul>
          {leftSummary && (
            <EditableField prop="leftSummary" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-comparison-summary">{leftSummary}</EditableField>
          )}
        </div>

        <div className="lp-theme06-comparison-divider" aria-hidden="true" />

        <div className="lp-theme06-comparison-col lp-theme06-comparison-col--right">
          <EditableField prop="rightTitle" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-comparison-col-title">{rightTitle}</EditableField>
          <ul className="lp-theme06-comparison-list">
            {validPoints.map((point, index) => (
              <li
                key={index}
                className={`lp-theme06-comparison-item ${point.winner === 'right' ? 'lp-theme06-comparison-item--win' : ''}`}
              >
                <span className="lp-theme06-comparison-marker">
                  {point.winner === 'right' ? '◆' : point.winner === 'left' ? '◇' : '•'}
                </span>
                <EditableField prop={`points.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{point.text || ''}</EditableField>
              </li>
            ))}
          </ul>
          {rightSummary && (
            <EditableField prop="rightSummary" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-comparison-summary">{rightSummary}</EditableField>
          )}
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
