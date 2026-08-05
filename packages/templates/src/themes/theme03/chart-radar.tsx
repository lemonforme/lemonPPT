// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme03ChartRadarIndicator {
  name?: string;
  max?: number;
}

export interface Theme03ChartRadarDataItem {
  name?: string;
  value?: number[];
}

export interface Theme03ChartRadarProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  indicators?: Theme03ChartRadarIndicator[];
  data?: Theme03ChartRadarDataItem[];
  showInsight?: boolean;
  insight?: {
    value?: string;
    label?: string;
    description?: string;
  };
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme03ChartRadarMeta: LayoutMeta = {
  id: 'theme03_chart_radar',
  theme: 'theme03',
  role: 'chart',
  displayName: 'Theme 03 编辑风雷达图',
  description: '多维度能力对比雷达图',
  needsMedia: false,
  tags: ['chart', 'radar', 'comparison'],
  contentShape: 'radar-chart',
};

const NEUTRAL_COLORS = [
  'var(--lp-ink3)',
  'var(--lp-ink2)',
  'var(--lp-surface-strong)',
  'var(--lp-border)',
  'var(--lp-stroke)',
];

export const theme03ChartRadarSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '能力评估' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '07' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: '产品能力雷达 · 满分 100' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{竞争力}}：核心产品维度对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'indicators',
      label: '维度',
      type: 'array',
      minItems: 3,
      maxItems: 10,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'max', label: '最大值', type: 'number' },
      ],
    },
    {
      key: 'data',
      label: '数据',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      itemSchema: [
        { key: 'name', label: '名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    { key: 'showInsight', label: '重点强调', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '+13%',
        label: '平均能力提升空间',
        description: '当前版本在性能与稳定性上表现较好，但生态与易用性仍与目标存在差距。',
      },
      itemSchema: [
        { key: 'value', label: '主数值', type: 'text' },
        { key: 'label', label: '主数值说明', type: 'text' },
        { key: 'description', label: '解读文字', type: 'textarea' },
      ],
    },
    { key: 'footnoteLeft', label: '页脚左侧', type: 'text', inlineEditable: true },
    { key: 'footnoteRight', label: '页脚右侧', type: 'text', inlineEditable: true },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme03-chart-radar-title lp-rise">
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

function parseNumberArray(value?: string): number[] {
  if (!value) return [];
  return value
    .split(/[,，]/)
    .map((v) => parseFloat(v.trim()))
    .filter((v) => !Number.isNaN(v));
}

function buildOption(indicators: Theme03ChartRadarIndicator[], data: Theme03ChartRadarDataItem[]): Record<string, unknown> {
  const validIndicators = indicators
    .filter((i): i is Theme03ChartRadarIndicator => !!i && !!i.name)
    .map((i) => ({ name: i.name, max: typeof i.max === 'number' ? i.max : 100 }));

  const validData = data
    .filter((d): d is Theme03ChartRadarDataItem => !!d && !!d.name)
    .map((d, index) => ({
      value: Array.isArray(d.value) ? d.value : parseNumberArray(d.value),
      name: d.name,
      areaStyle: index === 0 ? { opacity: 0.2, color: 'var(--lp-accent)' } : undefined,
      lineStyle: { color: index === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(index - 1) % NEUTRAL_COLORS.length] },
      itemStyle: { color: index === 0 ? 'var(--lp-accent)' : NEUTRAL_COLORS[(index - 1) % NEUTRAL_COLORS.length] },
    }));

  return {
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
    },
    radar: {
      indicator: validIndicators,
      radius: '60%',
      splitNumber: 4,
      axisName: { color: 'var(--lp-ink2)', fontSize: 12, fontWeight: 600 },
      splitLine: { lineStyle: { color: 'var(--lp-divider)' } },
      splitArea: { areaStyle: { color: ['transparent', 'var(--lp-surface)'] } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
    },
    series: [
      {
        type: 'radar',
        data: validData,
        animationDuration: 800,
      },
    ],
  };
}

export function Theme03ChartRadar(props: Theme03ChartRadarProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    indicators = [],
    data = [],
    showInsight = true,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validIndicators = (indicators || []).filter((i) => i != null && !!i.name);
  const validData = (data || []).filter((d) => d != null && !!d.name);
  const hasData = validIndicators.length > 0 && validData.length > 0;
  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme03-chart-radar">
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

      <div className="lp-theme03-chart-radar-main">
        <div className="lp-theme03-chart-radar-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-radar-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className={`lp-theme03-chart-radar-body ${hasInsight ? 'lp-theme03-chart-radar-body--insight' : ''} lp-rise`}>
          <div className="lp-theme03-chart-radar-chart-wrap">
            {hasData ? (
              <LpEChart type="radar" option={buildOption(validIndicators, validData)} className="lp-theme03-chart-radar-echart" />
            ) : (
              <div className="lp-theme03-chart-radar-empty">请配置雷达维度与数据</div>
            )}
          </div>

          {hasInsight && (
            <div className="lp-theme03-chart-radar-insight lp-rise">
              {(insight.value || insight.label) && (
                <div className="lp-theme03-chart-radar-insight-headline">
                  {insight.value && (
                    <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-radar-insight-value">{insight.value}</EditableField>
                  )}
                  {insight.label && (
                    <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme03-chart-radar-insight-sub">{insight.label}</EditableField>
                  )}
                </div>
              )}
              {insight.description && (
                <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme03-chart-radar-insight-desc">{insight.description}</EditableField>
              )}
            </div>
          )}
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
