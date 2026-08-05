// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03DiptychContrastSide {
  label?: string;
  labelEn?: string;
  imageUrl?: string;
}

export interface Theme03DiptychContrastComparison {
  leftValue?: string;
  leftLabel?: string;
  rightValue?: string;
  rightLabel?: string;
}

export interface Theme03DiptychContrastCenterCard {
  title?: string;
  comparisons?: Theme03DiptychContrastComparison[];
  conclusion?: string;
}

export interface Theme03DiptychContrastProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title?: string;
  subtitle?: string;
  left?: Theme03DiptychContrastSide;
  right?: Theme03DiptychContrastSide;
  centerCard?: Theme03DiptychContrastCenterCard;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03DiptychContrastMeta: LayoutMeta = {
  id: 'theme03_diptych_contrast',
  theme: 'theme03',
  role: 'comparison',
  displayName: 'Theme 03 编辑风双联对比',
  description: '深色代码编辑风左右双区对比 + 中央结论卡',
  needsMedia: true,
  tags: ['comparison', 'vs', 'diptych'],
  contentShape: 'two-column-comparison',
};

export const theme03DiptychContrastSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '对比分析' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'COMPARE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{传统方案}} vs {{AI 方案}}' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'left',
      label: '左侧内容',
      type: 'object',
      itemSchema: [
        { key: 'label', label: '标题', type: 'text', inlineEditable: true },
        { key: 'labelEn', label: '英文标题', type: 'text', inlineEditable: true },
        { key: 'imageUrl', label: '背景图', type: 'image' },
      ],
    },
    {
      key: 'right',
      label: '右侧内容',
      type: 'object',
      itemSchema: [
        { key: 'label', label: '标题', type: 'text', inlineEditable: true },
        { key: 'labelEn', label: '英文标题', type: 'text', inlineEditable: true },
        { key: 'imageUrl', label: '背景图', type: 'image' },
      ],
    },
    {
      key: 'centerCard',
      label: '中央结论卡',
      type: 'object',
      itemSchema: [
        { key: 'title', label: '标题', type: 'text', inlineEditable: true },
        {
          key: 'comparisons',
          label: '对比项',
          type: 'array',
          maxItems: 3,
          itemSchema: [
            { key: 'leftValue', label: '左侧数值', type: 'text' },
            { key: 'leftLabel', label: '左侧说明', type: 'text' },
            { key: 'rightValue', label: '右侧数值', type: 'text' },
            { key: 'rightLabel', label: '右侧说明', type: 'text' },
          ],
        },
        { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-diptych-contrast-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme03-accent-text">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03DiptychContrast(props: Theme03DiptychContrastProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    left = {},
    right = {},
    centerCard = {},
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;
  const safeComparisons = (centerCard.comparisons || []).slice(0, 3);

  return (
    <div className="lp-slide lp-theme03-diptych-contrast">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme03-diptych-contrast-main">
        <div className="lp-theme03-diptych-contrast-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-diptych-contrast-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme03-diptych-contrast-grid lp-rise">
          <div className="lp-theme03-diptych-contrast-side lp-theme03-diptych-contrast-side--left">
            {left.imageUrl ? (
              <img className="lp-theme03-diptych-contrast-image" src={left.imageUrl} alt={left.label || ''} />
            ) : (
              <LpEditableImage
                className="lp-theme03-diptych-contrast-image"
                src={left.imageUrl}
                alt={left.label || ''}
                slideIdx={_slideIdx}
                editable={_editable}
                prop="left.imageUrl"
                placeholderClassName="lp-editable-image-placeholder lp-theme03-diptych-contrast-image-placeholder"
                placeholderText="左侧图片"
              />
            )}
            <div className="lp-theme03-diptych-contrast-side-label">
              {left.labelEn && <div className="lp-theme03-diptych-contrast-label-en">{left.labelEn}</div>}
              {left.label && (
                <EditableField prop="left.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-diptych-contrast-label">
                  {left.label}
                </EditableField>
              )}
            </div>
          </div>

          <div className="lp-theme03-diptych-contrast-center-card lp-rise">
            {centerCard.title && (
              <EditableField prop="centerCard.title" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-theme03-diptych-contrast-center-title">
                {centerCard.title}
              </EditableField>
            )}
            {safeComparisons.length > 0 && (
              <div className="lp-theme03-diptych-contrast-comparisons">
                {safeComparisons.map((item, index) => (
                  <div key={index} className="lp-theme03-diptych-contrast-row">
                    <div className="lp-theme03-diptych-contrast-cell lp-theme03-diptych-contrast-cell--left">
                      <EditableField prop={`centerCard.comparisons.${index}.leftValue`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-diptych-contrast-value">
                        {item.leftValue}
                      </EditableField>
                      <EditableField prop={`centerCard.comparisons.${index}.leftLabel`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-diptych-contrast-value-label">
                        {item.leftLabel}
                      </EditableField>
                    </div>
                    <div className="lp-theme03-diptych-contrast-vs">VS</div>
                    <div className="lp-theme03-diptych-contrast-cell lp-theme03-diptych-contrast-cell--right">
                      <EditableField prop={`centerCard.comparisons.${index}.rightValue`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-diptych-contrast-value">
                        {item.rightValue}
                      </EditableField>
                      <EditableField prop={`centerCard.comparisons.${index}.rightLabel`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-diptych-contrast-value-label">
                        {item.rightLabel}
                      </EditableField>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {centerCard.conclusion && (
              <EditableField prop="centerCard.conclusion" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-diptych-contrast-conclusion">
                {centerCard.conclusion}
              </EditableField>
            )}
          </div>

          <div className="lp-theme03-diptych-contrast-side lp-theme03-diptych-contrast-side--right">
            {right.imageUrl ? (
              <img className="lp-theme03-diptych-contrast-image" src={right.imageUrl} alt={right.label || ''} />
            ) : (
              <LpEditableImage
                className="lp-theme03-diptych-contrast-image"
                src={right.imageUrl}
                alt={right.label || ''}
                slideIdx={_slideIdx}
                editable={_editable}
                prop="right.imageUrl"
                placeholderClassName="lp-editable-image-placeholder lp-theme03-diptych-contrast-image-placeholder"
                placeholderText="右侧图片"
              />
            )}
            <div className="lp-theme03-diptych-contrast-side-label">
              {right.labelEn && <div className="lp-theme03-diptych-contrast-label-en">{right.labelEn}</div>}
              {right.label && (
                <EditableField prop="right.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-diptych-contrast-label">
                  {right.label}
                </EditableField>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
