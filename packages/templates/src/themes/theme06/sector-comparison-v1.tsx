// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06SectorComparisonV1Point {
  text?: string;
  winner?: 'left' | 'right' | 'tie';
}

export interface Theme06SectorComparisonV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  points?: Theme06SectorComparisonV1Point[];
  leftSummary?: string;
  rightSummary?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06SectorComparisonV1Meta: LayoutMeta = {
  id: 'theme06_sector_comparison_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 行业方案对比',
  description: '左右双栏行业方案对比，标注优势方',
  needsMedia: true,
  tags: ['comparison', 'sector', 'versus', 'atlas'],
  contentShape: 'comparison',
};

export const theme06SectorComparisonV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'BUILD VS BUY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '自研模型 vs 第三方 API' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '企业在 AI 能力建设中的两种典型路径对比' },
    { key: 'leftTitle', label: '左侧标题', type: 'text', inlineEditable: true, defaultValue: '自研模型' },
    { key: 'rightTitle', label: '右侧标题', type: 'text', inlineEditable: true, defaultValue: '第三方 API' },
    {
      key: 'points',
      label: '对比项',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { text: '数据隐私与可控性更高', winner: 'left' },
        { text: '前期投入与人才门槛更高', winner: 'right' },
        { text: '可针对业务做深度定制', winner: 'left' },
        { text: '上线速度快，即开即用', winner: 'right' },
        { text: '长期规模化成本更低', winner: 'left' },
        { text: '运维与升级责任由厂商承担', winner: 'right' },
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
    { key: 'leftSummary', label: '左侧总结', type: 'textarea', inlineEditable: true, defaultValue: '适合数据敏感、差异化要求高的头部企业。' },
    { key: 'rightSummary', label: '右侧总结', type: 'textarea', inlineEditable: true, defaultValue: '适合快速验证、资源有限的中小型团队。' },
  ],
};

export function Theme06SectorComparisonV1(props: Theme06SectorComparisonV1Props): ReactNode {
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
  const validPoints = (points || []).filter((p): p is Theme06SectorComparisonV1Point => p != null).slice(0, 6);

  return (
    <div className="lp-slide lp-theme06-sector-comparison">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-sector-comparison-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-sector-comparison-body lp-rise">
        <div className="lp-theme06-sector-comparison-col lp-theme06-sector-comparison-col--left">
          <EditableField prop="leftTitle" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-sector-comparison-col-title">{leftTitle}</EditableField>
          <ul className="lp-theme06-sector-comparison-list">
            {validPoints.map((point, index) => (
              <li
                key={index}
                className={`lp-theme06-sector-comparison-item ${point.winner === 'left' ? 'lp-theme06-sector-comparison-item--win' : ''}`}
              >
                <span className="lp-theme06-sector-comparison-marker">
                  {point.winner === 'left' ? '◆' : point.winner === 'right' ? '◇' : '•'}
                </span>
                <EditableField prop={`points.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{point.text || ''}</EditableField>
              </li>
            ))}
          </ul>
          {leftSummary && (
            <EditableField prop="leftSummary" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-sector-comparison-summary">{leftSummary}</EditableField>
          )}
        </div>

        <div className="lp-theme06-sector-comparison-divider" aria-hidden="true" />

        <div className="lp-theme06-sector-comparison-col lp-theme06-sector-comparison-col--right">
          <EditableField prop="rightTitle" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme06-sector-comparison-col-title">{rightTitle}</EditableField>
          <ul className="lp-theme06-sector-comparison-list">
            {validPoints.map((point, index) => (
              <li
                key={index}
                className={`lp-theme06-sector-comparison-item ${point.winner === 'right' ? 'lp-theme06-sector-comparison-item--win' : ''}`}
              >
                <span className="lp-theme06-sector-comparison-marker">
                  {point.winner === 'right' ? '◆' : point.winner === 'left' ? '◇' : '•'}
                </span>
                <EditableField prop={`points.${index}.text`} slideIdx={_slideIdx} editable={_editable} as="span">{point.text || ''}</EditableField>
              </li>
            ))}
          </ul>
          {rightSummary && (
            <EditableField prop="rightSummary" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-sector-comparison-summary">{rightSummary}</EditableField>
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
