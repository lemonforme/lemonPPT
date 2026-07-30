// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme04MetricBigProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  value: string;
  unit?: string;
  suffix?: string;
  label?: string;
  description?: string;
  showInsight?: boolean;
  insight?: {
    label?: string;
    value?: string;
    description?: string;
  };
  metrics?: Array<{ value: string; unit?: string; label: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04MetricBigMeta: LayoutMeta = {
  id: 'theme04_metric_big',
  theme: 'theme04',
  role: 'metric',
  displayName: 'Theme 04 糖果超大指标',
  description: '玻璃糖果风核心数据页，巨型数字 + insight 面板 + 底部指标',
  needsMedia: false,
  tags: ['metric', 'big-number', 'candy'],
  contentShape: 'single-stat-with-insight',
};

export const theme04MetricBigSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '核心数据' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: 'KEY FIGURE' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '2024 · AI VENTURE' },
    { key: 'value', label: '主数值', type: 'text', inlineEditable: true, defaultValue: '32' },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '%' },
    { key: 'suffix', label: '后缀', type: 'text', inlineEditable: true },
    { key: 'label', label: '主数值说明', type: 'text', inlineEditable: true, defaultValue: '2024 年美国 AI 吸纳的风险投资占比' },
    { key: 'description', label: '主数值描述', type: 'textarea', inlineEditable: true },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        label: '关键洞察',
        value: '全球第一',
        description: '美国继续领跑全球 AI 风险投资，中国、欧洲紧随其后。',
      },
      itemSchema: [
        { key: 'label', label: '面板标签', type: 'text' },
        { key: 'value', label: '面板数值', type: 'text' },
        { key: 'description', label: '面板解读', type: 'textarea' },
      ],
    },
    {
      key: 'metrics',
      label: '底部指标',
      type: 'array',
      minItems: 1,
      maxItems: 3,
      defaultValue: [
        { value: '970', unit: '亿美元', label: '全年总额' },
        { value: '97', unit: '笔', label: '大额事件' },
        { value: '+41%', unit: '', label: 'Q4 环比' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

export function Theme04MetricBig(props: Theme04MetricBigProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    value,
    unit,
    suffix,
    label,
    description,
    showInsight,
    insight,
    metrics,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  return (
    <div className="lp-slide lp-theme04-metric-big">
      <div className="lp-theme04-topbar">
        {(tag || tagLabel) && (
          <div className="lp-theme04-tag">
            {tag && <EditableField prop="tag" slideIdx={_slideIdx} editable={_editable} as="span">{tag}</EditableField>}
            {tag && tagLabel && <span>·</span>}
            {tagLabel && <EditableField prop="tagLabel" slideIdx={_slideIdx} editable={_editable} as="span">{tagLabel}</EditableField>}
          </div>
        )}
        {topRightMeta && (
          <EditableField prop="topRightMeta" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-topbar-right">{topRightMeta}</EditableField>
        )}
      </div>

      <div className="lp-theme04-metric-big-main">
        <div className={`lp-theme04-metric-big-hero ${showInsight ? 'lp-theme04-metric-big-hero--insight' : ''} lp-rise`}>
          <div className="lp-theme04-metric-big-value-row">
            {value && <EditableField prop="value" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-metric-big-value">{value}</EditableField>}
            {unit && <EditableField prop="unit" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-metric-big-unit">{unit}</EditableField>}
            {suffix && <EditableField prop="suffix" slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-metric-big-suffix">{suffix}</EditableField>}
          </div>
          {label && <EditableField prop="label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-metric-big-label">{label}</EditableField>}
          {description && <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-metric-big-desc">{description}</EditableField>}
        </div>

        {showInsight && insight && (
          <div className="lp-theme04-metric-big-insight lp-rise">
            {(insight.label || _editable) && (
              <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-metric-big-insight-label">{insight.label}</EditableField>
            )}
            {(insight.value || _editable) && (
              <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-metric-big-insight-value">{insight.value}</EditableField>
            )}
            {(insight.description || _editable) && (
              <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-metric-big-insight-desc">{insight.description}</EditableField>
            )}
          </div>
        )}
      </div>

      {metrics && metrics.length > 0 && (
        <div className="lp-theme04-metric-big-stats lp-rise">
          {metrics.map((metric, idx) => (
            <div key={idx} className="lp-theme04-metric-big-stat">
              <div className="lp-theme04-metric-big-stat-value">
                <EditableField prop={`metrics.${idx}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{metric.value}</EditableField>
                {metric.unit && (
                  <EditableField prop={`metrics.${idx}.unit`} slideIdx={_slideIdx} editable={_editable} as="span" className="lp-theme04-metric-big-stat-unit">{metric.unit}</EditableField>
                )}
              </div>
              <EditableField prop={`metrics.${idx}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-metric-big-stat-label">{metric.label}</EditableField>
            </div>
          ))}
        </div>
      )}

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
