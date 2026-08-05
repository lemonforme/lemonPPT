// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEditableImage } from '../../editable-image.js';

export interface Theme03CoverV1Props {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  metricValue?: string;
  metricUnit?: string;
  metricLabel?: string;
  metricDescription?: string;
  stats?: Array<{ value: string; unit?: string; label: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  image?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03CoverV1Meta: LayoutMeta = {
  id: 'theme03_cover_v1',
  theme: 'theme03',
  role: 'cover',
  displayName: 'Theme 03 编辑风封面',
  description: '深色代码编辑风封面，顶部 mono 标签，标题局部强调，右侧大数字，底部元数据',
  needsMedia: true,
  tags: ['hero', 'data-heavy', 'report'],
  contentShape: 'title-metric-footer',
};

export const theme03CoverV1Schema: PropsSchema = {
  fields: [
    {
      key: 'tag',
      label: '标签',
      type: 'text',
      inlineEditable: true,
      defaultValue: '调研报告',
    },
    {
      key: 'tagLabel',
      label: '标签编号',
      type: 'text',
      inlineEditable: true,
      defaultValue: '2024',
    },
    {
      key: 'topRightMeta',
      label: '顶部元信息',
      type: 'text',
      inlineEditable: true,
      defaultValue: 'AI · VENTURE CAPITAL // USA',
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
      defaultValue: '2024 美国大额融资 {{AI}} 公司调研报告',
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'metricValue',
      label: '主数值',
      type: 'text',
      inlineEditable: true,
      defaultValue: '970',
    },
    {
      key: 'metricUnit',
      label: '主数值单位',
      type: 'text',
      inlineEditable: true,
      defaultValue: '亿美元',
    },
    {
      key: 'metricLabel',
      label: '主数值说明',
      type: 'text',
      inlineEditable: true,
      defaultValue: '全年 AI 风险投资额',
    },
    {
      key: 'metricDescription',
      label: '主数值描述',
      type: 'textarea',
      inlineEditable: true,
    },
    {
      key: 'stats',
      label: '底部统计',
      type: 'array',
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
    {
      key: 'footnoteLeft',
      label: '页脚左侧',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'footnoteRight',
      label: '页脚右侧',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'image',
      label: '封面配图',
      type: 'image',
    },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h1" className="lp-theme03-cover-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return (
            <em key={idx} className="lp-theme03-accent-text">
              {match[1]}
            </em>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme03CoverV1(props: Theme03CoverV1Props): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    metricValue,
    metricUnit,
    metricLabel,
    metricDescription,
    stats,
    footnoteLeft,
    footnoteRight,
    image,
    _slideIdx,
    _editable,
  } = props;

  return (
    <div className="lp-slide lp-theme03-cover-v1">
      <div className="lp-theme03-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme03-tag">
            {tag && (
              <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">
                {tag}
              </EditableField>
            )}
            {tag && tagLabel && <span className="lp-theme03-tag-sep">·</span>}
            {tagLabel && (
              <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">
                {tagLabel}
              </EditableField>
            )}
          </div>
        )}
        {topRightMeta && (
          <EditableField
            prop="topRightMeta"
            slideIdx={_slideIdx}
            editable={_editable}
            as="div"
            className="lp-theme03-topbar-right"
          >
            {topRightMeta}
          </EditableField>
        )}
      </div>

      <div className="lp-theme03-cover-main">
        <div className="lp-theme03-cover-head">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField
              prop="subtitle"
              slideIdx={_slideIdx}
              editable={_editable}
              as="p"
              className="lp-theme03-cover-subtitle lp-rise"
            >
              {subtitle}
            </EditableField>
          )}
          <div className="lp-theme03-cover-image-wrap lp-rise">
            <LpEditableImage
              className="lp-theme03-cover-image"
              src={image}
              alt=""
              slideIdx={_slideIdx}
              editable={_editable}
              prop="image"
              placeholderClassName="lp-editable-image-placeholder lp-theme03-cover-image-placeholder"
              placeholderText="点击上传封面配图"
            />
          </div>
        </div>

        {(metricValue || metricLabel) && (
          <div className="lp-theme03-cover-metric lp-rise">
            <div className="lp-theme03-cover-metric-value">
              {metricValue && (
                <EditableField prop="metricValue" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-cover-metric-number">
                  {metricValue}
                </EditableField>
              )}
              {metricUnit && (
                <EditableField prop="metricUnit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-cover-metric-unit">
                  {metricUnit}
                </EditableField>
              )}
            </div>
            {metricLabel && (
              <EditableField
                prop="metricLabel"
                slideIdx={_slideIdx}
                editable={_editable}
                as="div"
                className="lp-theme03-cover-metric-label"
              >
                {metricLabel}
              </EditableField>
            )}
            {metricDescription && (
              <EditableField
                prop="metricDescription"
                slideIdx={_slideIdx}
                editable={_editable}
                as="p"
                className="lp-theme03-cover-metric-desc"
              >
                {metricDescription}
              </EditableField>
            )}
          </div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <div className="lp-theme03-cover-stats lp-rise">
          {stats.map((stat, idx) => (
            <div key={idx} className="lp-theme03-cover-stat">
              <div className="lp-theme03-cover-stat-value">
                <EditableField prop={`stats.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">
                  {stat.value}
                </EditableField>
                {stat.unit && (
                  <EditableField prop={`stats.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme03-cover-stat-unit">
                    {stat.unit}
                  </EditableField>
                )}
              </div>
              <EditableField prop={`stats.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-cover-stat-label">
                {stat.label}
              </EditableField>
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme03-hairline" />

      <div className="lp-theme03-footer">
        {footnoteLeft && (
          <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">
            {footnoteLeft}
          </EditableField>
        )}
        {footnoteRight && (
          <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">
            {footnoteRight}
          </EditableField>
        )}
      </div>
    </div>
  );
}
