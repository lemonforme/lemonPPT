// lemonPPT - theme07 利润率巨号数字页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { CSSProperties, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07MarginV1Aux {
  value?: string;
  label?: string;
}

export interface Theme07MarginV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  number?: string;
  unit?: string;
  label?: string;
  gaugeValue?: number;
  gaugeLabel?: string;
  aux?: Theme07MarginV1Aux[];
  note?: string;
  numberSlant?: boolean;
  showGauge?: boolean;
  showNote?: boolean;
  showLens?: boolean;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07MarginV1Meta: LayoutMeta = {
  id: 'theme07_margin_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 利润率巨号数字',
  description: '超大利润率数字 + 仪表环 + 辅助指标芯片，呈现算力成本挤压',
  needsMedia: true,
  tags: ['margin', 'big-number', 'gauge', 'stat'],
  contentShape: 'stat',
};

export const theme07MarginV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'MARGIN' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '利润率风险' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '高算力投入与竞争定价对毛利的持续挤压' },
    { key: 'number', label: '核心数字', type: 'text', inlineEditable: true, defaultValue: '38' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    { key: 'label', label: '数字说明', type: 'text', inlineEditable: true, defaultValue: '头部模型公司平均毛利率' },
    { key: 'gaugeValue', label: '仪表进度', type: 'slider', min: 0, max: 100, defaultValue: 38 },
    { key: 'gaugeLabel', label: '仪表标签', type: 'text', inlineEditable: true, defaultValue: '距健康区间 60% 仍有缺口' },
    {
      key: 'aux',
      label: '辅助指标',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { value: '-9pp', label: '同比变动' },
        { value: '46%', label: '算力成本占比' },
        { value: '21%', label: '销售费用占比' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'note', label: '脚注', type: 'textarea', inlineEditable: true, defaultValue: '注：口径为公开披露的年度毛利率中位数，未剔除一次性算力补贴。' },
    { key: 'numberSlant', label: '数字倾斜', type: 'boolean', defaultValue: true },
    { key: 'showGauge', label: '显示仪表环', type: 'boolean', defaultValue: true },
    { key: 'showNote', label: '显示脚注', type: 'boolean', defaultValue: true },
    { key: 'showLens', label: '数字聚焦镜头', type: 'boolean', defaultValue: true },
  ],
};

const GAUGE_RADIUS = 62;
/** 仪表环为 270° 开口弧线，弧长按半径换算 */
const GAUGE_ARC_LENGTH = 2 * Math.PI * GAUGE_RADIUS * 0.75;

export function Theme07MarginV1(props: Theme07MarginV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    number = '0',
    unit,
    label,
    gaugeValue = 0,
    gaugeLabel,
    aux = [],
    note,
    numberSlant = true,
    showGauge = true,
    showNote = true,
    showLens = true,
    _slideIdx,
    _editable,
  } = props;

  const validAux = (aux || []).filter((a): a is Theme07MarginV1Aux => a != null && !!a.value).slice(0, 3);
  const pct = Math.max(0, Math.min(100, Number(gaugeValue) || 0));
  const dash = (GAUGE_ARC_LENGTH * pct) / 100;

  return (
    <div className="lp-slide lp-theme07 lp-theme07-margin-hero">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-margin-hero-header lp-rise">
        <Theme07IconChip name="scale" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme07-margin-hero-body lp-rise">
        <div className="lp-theme07-margin-hero-main">
          {showGauge && (
            <div className="lp-theme07-margin-hero-gauge">
              <svg viewBox="0 0 160 160" aria-hidden="true">
                <circle
                  cx="80"
                  cy="80"
                  r={GAUGE_RADIUS}
                  fill="none"
                  stroke="var(--lp-surface-strong)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${GAUGE_ARC_LENGTH} ${2 * Math.PI * GAUGE_RADIUS}`}
                  transform="rotate(135 80 80)"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={GAUGE_RADIUS}
                  fill="none"
                  stroke="var(--lp-accent)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${2 * Math.PI * GAUGE_RADIUS}`}
                  transform="rotate(135 80 80)"
                />
              </svg>
              <span className="lp-theme07-margin-hero-gauge-value">{Math.round(pct)}%</span>
            </div>
          )}
          <div className={`lp-theme07-margin-hero-figure ${showLens ? 'lp-focus' : ''}`}>
            {showLens && <span className="lp-focus-lens" aria-hidden="true" />}
            <div
              className="lp-theme07-margin-hero-number"
              style={numberSlant ? ({ transform: 'skewX(-6deg)' } as CSSProperties) : undefined}
            >
              <EditableField prop="number" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme07-big-number-value">{number}</EditableField>
              {unit && <span className="lp-theme07-big-number-unit">{unit}</span>}
            </div>
            {label && (
              <EditableField prop="label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme07-big-number-label">{label}</EditableField>
            )}
            {showGauge && gaugeLabel && (
              <EditableField prop="gaugeLabel" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme07-margin-hero-gauge-label">{gaugeLabel}</EditableField>
            )}
          </div>
        </div>
        {validAux.length > 0 && (
          <div className="lp-theme07-margin-hero-aux">
            {validAux.map((item, index) => (
              <div key={index} className="lp-theme07-card lp-theme07-margin-hero-aux-chip" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="lp-theme07-margin-hero-aux-value">
                  <EditableField prop={`aux.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{item.value}</EditableField>
                </div>
                <div className="lp-theme07-margin-hero-aux-label">
                  <EditableField prop={`aux.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{item.label || ''}</EditableField>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showNote && note && (
        <div className="lp-theme07-margin-hero-note">
          <EditableField prop="note" slideIdx={_slideIdx} editable={_editable} as="span">{note}</EditableField>
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
