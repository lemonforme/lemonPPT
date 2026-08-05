// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06VerticalBarSegment {
  label: string;
  enLabel?: string;
  value: number;
  accent?: boolean;
}

export interface Theme06VerticalBarMetric {
  value: string;
  enLabel?: string;
  label: string;
  accent?: boolean;
}

export interface Theme06VerticalBarV1Props {
  imageUrl?: string;
  topLeftLabel?: string;
  topRightLabel?: string;
  title: string;
  badge?: string;
  value: string;
  unit?: string;
  valueLabel?: string;
  metrics?: Theme06VerticalBarMetric[];
  segmentTitle?: string;
  segments?: Theme06VerticalBarSegment[];
  insight?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06VerticalBarV1Meta: LayoutMeta = {
  id: 'theme06_vertical_bar_v1',
  theme: 'theme06',
  role: 'metric',
  displayName: 'Theme 06 高客单价分段条形页',
  description: '左侧大数字与支撑指标 + 右侧水平分段条形图，适合垂直赛道/高客单价分析',
  needsMedia: true,
  tags: ['metric', 'vertical', 'segment-bar', 'atlas'],
  contentShape: 'metric',
};

export const theme06VerticalBarV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'topLeftLabel', label: '左上角标签', type: 'text', inlineEditable: true, defaultValue: '[30] LEGAL AI' },
    { key: 'topRightLabel', label: '右上角标签', type: 'text', inlineEditable: true, defaultValue: '法律 AI 赛道 / LEGAL SERVICES' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '专业服务高客单价' },
    { key: 'badge', label: '左侧胶囊标签', type: 'text', inlineEditable: true, defaultValue: '法律 AI 赛道 / LEGAL' },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '26' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '亿$' },
    { key: 'valueLabel', label: '数值说明', type: 'text', inlineEditable: true, defaultValue: '赛道融资额 / FUNDING' },
    {
      key: 'metrics',
      label: '支撑指标',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { value: '6笔', enLabel: 'DEALS', label: '事件数' },
        { value: '4.3亿', enLabel: 'AVG', label: '平均单笔' },
        { value: '46%', enLabel: 'REVIEW', label: '合同审查占比', accent: true },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'enLabel', label: '英文标签', type: 'text', inlineEditable: true },
        { key: 'label', label: '中文标签', type: 'text', inlineEditable: true },
        { key: 'accent', label: '强调色背景', type: 'boolean', defaultValue: false },
      ],
    },
    { key: 'segmentTitle', label: '分段图标题', type: 'text', inlineEditable: true, defaultValue: '场景占比 / SEGMENT SPLIT' },
    {
      key: 'segments',
      label: '分段数据',
      type: 'array',
      minItems: 2,
      maxItems: 6,
      defaultValue: [
        { label: '合同审查', enLabel: 'CONTRACT REVIEW', value: 46, accent: true },
        { label: '合规审查', enLabel: 'COMPLIANCE', value: 24 },
        { label: '诉讼支持', enLabel: 'LITIGATION', value: 18 },
        { label: '法律检索', enLabel: 'LEGAL RESEARCH', value: 12 },
      ],
      itemSchema: [
        { key: 'label', label: '名称', type: 'text', inlineEditable: true },
        { key: 'enLabel', label: '英文名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'accent', label: '强调色', type: 'boolean', defaultValue: false },
      ],
    },
    { key: 'insight', label: '底部洞察', type: 'textarea', inlineEditable: true, defaultValue: '→ 法律 AI 是垂直应用商业化样本。' },
    { key: 'footnote', label: '右下角标注', type: 'text', inlineEditable: true, defaultValue: '4 SEG / TABLE' },
  ],
};

export function Theme06VerticalBarV1(props: Theme06VerticalBarV1Props): ReactNode {
  const {
    topLeftLabel,
    topRightLabel,
    title,
    badge,
    value,
    unit,
    valueLabel,
    metrics = [],
    segmentTitle,
    segments = [],
    insight,
    footnote,
    _slideIdx,
    _editable,
  } = props;

  const validMetrics = metrics
    .filter((m): m is Theme06VerticalBarMetric => m != null)
    .slice(0, 3);

  const validSegments = segments
    .filter((s): s is Theme06VerticalBarSegment => s != null)
    .map((s) => ({ ...s, value: Number(s.value) || 0 }))
    .slice(0, 6);

  const maxSegmentValue = Math.max(1, ...validSegments.map((s) => s.value));

  return (
    <div className="lp-slide lp-theme06-vertical-bar">
      <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-vertical-bar-topbar lp-rise">
        {topLeftLabel && <div className="lp-theme06-vertical-bar-toplabel">{topLeftLabel}</div>}
        {topRightLabel && <div className="lp-theme06-vertical-bar-toplabel lp-theme06-vertical-bar-toplabel--right">{topRightLabel}</div>}
      </div>

      <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title lp-theme06-vertical-bar-title lp-rise">{title}</EditableField>

      <div className="lp-theme06-vertical-bar-body">
        <div className="lp-theme06-vertical-bar-main lp-rise">
          {badge && (
            <div className="lp-theme06-pill lp-theme06-vertical-bar-badge">
              <EditableField prop="badge" slideIdx={_slideIdx} editable={_editable} as="span">{badge}</EditableField>
            </div>
          )}
          <div className="lp-theme06-vertical-bar-hero">
            <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme06-vertical-bar-value">{value}</EditableField>
            {unit && <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme06-vertical-bar-unit">{unit}</EditableField>}
          </div>
          {valueLabel && <div className="lp-theme06-vertical-bar-value-label">{valueLabel}</div>}
          {validMetrics.length > 0 && (
            <div className="lp-theme06-vertical-bar-metrics">
              {validMetrics.map((item, index) => (
                <div key={index} className={`lp-theme06-vertical-bar-metric ${item.accent ? 'lp-theme06-vertical-bar-metric--accent' : ''}`}>
                  <div className="lp-theme06-vertical-bar-metric-value">
                    <EditableField prop={`metrics.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{item.value}</EditableField>
                  </div>
                  {item.enLabel && <div className="lp-theme06-vertical-bar-metric-en">{item.enLabel}</div>}
                  <div className="lp-theme06-vertical-bar-metric-label">
                    <EditableField prop={`metrics.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{item.label}</EditableField>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lp-theme06-vertical-bar-aside lp-rise">
          {segmentTitle && <div className="lp-theme06-vertical-bar-segment-title">{segmentTitle}</div>}
          <div className="lp-theme06-vertical-bar-segments">
            {validSegments.map((item, index) => {
              const pct = Math.round((item.value / maxSegmentValue) * 100);
              return (
                <div key={index} className="lp-theme06-vertical-bar-segment">
                  <div className="lp-theme06-vertical-bar-segment-header">
                    <span className="lp-theme06-vertical-bar-segment-label">
                      <EditableField prop={`segments.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{item.label}</EditableField>
                    </span>
                    <span className="lp-theme06-vertical-bar-segment-pct">{item.value}%</span>
                  </div>
                  {item.enLabel && <div className="lp-theme06-vertical-bar-segment-en">{item.enLabel}</div>}
                  <div className="lp-theme06-vertical-bar-segment-track">
                    <div
                      className={`lp-theme06-vertical-bar-segment-fill ${item.accent ? 'lp-theme06-vertical-bar-segment-fill--accent' : ''}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lp-theme06-vertical-bar-footer lp-rise">
        {insight && (
          <div className="lp-theme06-vertical-bar-insight">
            <EditableField prop="insight" slideIdx={_slideIdx} editable={_editable} as="span">{insight}</EditableField>
          </div>
        )}
        {footnote && <div className="lp-theme06-vertical-bar-footnote">{footnote}</div>}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
    </div>
  );
}
