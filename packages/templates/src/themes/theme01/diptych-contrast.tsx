// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme01DiptychContrastSide {
  label?: string;
  labelEn?: string;
  imageUrl?: string;
}

export interface Theme01DiptychContrastComparison {
  leftValue?: string;
  leftLabel?: string;
  rightValue?: string;
  rightLabel?: string;
}

export interface Theme01DiptychContrastCenterCard {
  title?: string;
  comparisons?: Theme01DiptychContrastComparison[];
  conclusion?: string;
}

export interface Theme01DiptychContrastProps {
  kicker?: string;
  title?: string;
  left?: Theme01DiptychContrastSide;
  right?: Theme01DiptychContrastSide;
  centerCard?: Theme01DiptychContrastCenterCard;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01DiptychContrastMeta: LayoutMeta = {
  id: 'theme01_diptych_contrast',
  theme: 'theme01',
  role: 'comparison',
  displayName: 'Theme 01 双联对比',
  description: '左右双区对比 + 中央结论卡',
  needsMedia: true,
};

export const theme01DiptychContrastSchema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'left',
      label: '左侧内容',
      type: 'object',
      itemSchema: [
        {
          key: 'label',
          label: '标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'labelEn',
          label: '英文标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'imageUrl',
          label: '背景图',
          type: 'image',
        },
      ],
    },
    {
      key: 'right',
      label: '右侧内容',
      type: 'object',
      itemSchema: [
        {
          key: 'label',
          label: '标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'labelEn',
          label: '英文标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'imageUrl',
          label: '背景图',
          type: 'image',
        },
      ],
    },
    {
      key: 'centerCard',
      label: '中央结论卡',
      type: 'object',
      itemSchema: [
        {
          key: 'title',
          label: '标题',
          type: 'text',
          inlineEditable: true,
        },
        {
          key: 'comparisons',
          label: '对比项',
          type: 'array',
          maxItems: 3,
          itemSchema: [
            {
              key: 'leftValue',
              label: '左侧数值',
              type: 'text',
            },
            {
              key: 'leftLabel',
              label: '左侧说明',
              type: 'text',
            },
            {
              key: 'rightValue',
              label: '右侧数值',
              type: 'text',
            },
            {
              key: 'rightLabel',
              label: '右侧说明',
              type: 'text',
            },
          ],
        },
        {
          key: 'conclusion',
          label: '结论',
          type: 'textarea',
          inlineEditable: true,
        },
      ],
    },
    {
      key: 'footnote',
      label: '脚注',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

export function Theme01DiptychContrast(props: Theme01DiptychContrastProps): ReactNode {
  const { kicker, title, left = {}, right = {}, centerCard = {}, footnote, _slideIdx, _editable } = props;
  const safeComparisons = (centerCard.comparisons || []).slice(0, 3);

  return (
    <div className="lp-slide lp-diptych-contrast">
      <div className="lp-diptych-contrast-bg">
        <div className="lp-diptych-contrast-side lp-diptych-contrast-side--left">
          {left.imageUrl ? (
            <img className="lp-diptych-contrast-image" src={left.imageUrl} alt={left.label || ''} />
          ) : (
            <div className="lp-diptych-contrast-image-placeholder" />
          )}
          <div className="lp-diptych-contrast-side-label">
            {left.labelEn && <div className="lp-diptych-contrast-label-en">{left.labelEn}</div>}
            {left.label && (
              <EditableField prop="left.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-diptych-contrast-label">
                {left.label}
              </EditableField>
            )}
          </div>
        </div>
        <div className="lp-diptych-contrast-side lp-diptych-contrast-side--right">
          {right.imageUrl ? (
            <img className="lp-diptych-contrast-image" src={right.imageUrl} alt={right.label || ''} />
          ) : (
            <div className="lp-diptych-contrast-image-placeholder" />
          )}
          <div className="lp-diptych-contrast-side-label">
            {right.labelEn && <div className="lp-diptych-contrast-label-en">{right.labelEn}</div>}
            {right.label && (
              <EditableField prop="right.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-diptych-contrast-label">
                {right.label}
              </EditableField>
            )}
          </div>
        </div>
      </div>
      <div className="lp-diptych-contrast-content">
        {kicker && (
          <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-pill lp-diptych-contrast-kicker lp-rise">
            {kicker}
          </EditableField>
        )}
        {title && (
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-head lp-diptych-contrast-title lp-rise">
            {title}
          </EditableField>
        )}
        <div className="lp-card lp-diptych-contrast-center-card lp-rise">
          {centerCard.title && (
            <EditableField prop="centerCard.title" slideIdx={_slideIdx} editable={_editable} as="h3" className="lp-diptych-contrast-center-title">
              {centerCard.title}
            </EditableField>
          )}
          {safeComparisons.length > 0 && (
            <div className="lp-diptych-contrast-comparisons">
              {safeComparisons.map((item, index) => (
                <div key={index} className="lp-diptych-contrast-row">
                  <div className="lp-diptych-contrast-cell lp-diptych-contrast-cell--left">
                    <EditableField prop={`centerCard.comparisons.${index}.leftValue`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-diptych-contrast-value">
                      {item.leftValue}
                    </EditableField>
                    <EditableField prop={`centerCard.comparisons.${index}.leftLabel`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-diptych-contrast-value-label">
                      {item.leftLabel}
                    </EditableField>
                  </div>
                  <div className="lp-diptych-contrast-vs">VS</div>
                  <div className="lp-diptych-contrast-cell lp-diptych-contrast-cell--right">
                    <EditableField prop={`centerCard.comparisons.${index}.rightValue`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-diptych-contrast-value">
                      {item.rightValue}
                    </EditableField>
                    <EditableField prop={`centerCard.comparisons.${index}.rightLabel`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-diptych-contrast-value-label">
                      {item.rightLabel}
                    </EditableField>
                  </div>
                </div>
              ))}
            </div>
          )}
          {centerCard.conclusion && (
            <EditableField prop="centerCard.conclusion" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-diptych-contrast-conclusion">
              {centerCard.conclusion}
            </EditableField>
          )}
        </div>
        {footnote && (
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-diptych-contrast-footnote lp-rise">
            {footnote}
          </EditableField>
        )}
      </div>
    </div>
  );
}
