// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04ChartDonutSegment {
  label?: string;
  labelEn?: string;
  value?: string;
}

export interface Theme04ChartDonutTotal {
  value?: string;
  label?: string;
}

export interface Theme04ChartDonutInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme04ChartDonutProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
  title: string;
  subtitle?: string;
  total?: Theme04ChartDonutTotal;
  segments?: Theme04ChartDonutSegment[];
  showInsight?: boolean;
  insight?: Theme04ChartDonutInsight;
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04ChartDonutMeta: LayoutMeta = {
  id: 'theme04_chart_donut',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 糖果环形图',
  description: '糖果色环形图 + 中心合计 + 右侧图例与洞察面板',
  needsMedia: false,
  tags: ['chart', 'distribution', 'candy'],
  contentShape: 'donut-legend-insight',
};

const PALETTE = [
  'var(--lp-accent)',
  'var(--lp-pink)',
  'var(--lp-cyan)',
  'var(--lp-yellow)',
  'var(--lp-violet)',
  'var(--lp-orange)',
];

export const theme04ChartDonutSchema: PropsSchema = {
  fields: [
    { key: 'tag', label: '标签', type: 'text', inlineEditable: true, defaultValue: '行业分布' },
    { key: 'tagLabel', label: '标签编号', type: 'text', inlineEditable: true, defaultValue: '05' },
    { key: 'topRightMeta', label: '顶部元信息', type: 'text', inlineEditable: true, defaultValue: 'AI 编码助手使用场景 · 单位：%' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '{{场景分布}}：开发者把 AI 助手用在哪里' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true },
    {
      key: 'total',
      label: '合计',
      type: 'object',
      defaultValue: { value: '100%', label: '样本占比' },
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '说明', type: 'text' },
      ],
    },
    {
      key: 'segments',
      label: '分类数据',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { label: '代码生成', labelEn: 'Code Gen', value: '41' },
        { label: '代码补全', labelEn: 'Completion', value: '26' },
        { label: '测试用例', labelEn: 'Testing', value: '18' },
        { label: '文档注释', labelEn: 'Docs', value: '10' },
        { label: '其他', labelEn: 'Others', value: '5' },
      ],
      itemSchema: [
        { key: 'label', label: '名称', type: 'text' },
        { key: 'labelEn', label: '英文名称', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
      ],
    },
    {
      key: 'showInsight',
      label: '重点强调',
      type: 'boolean',
      defaultValue: true,
    },
    {
      key: 'insight',
      label: '洞察面板',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: {
        value: '41%',
        label: '代码生成场景占比最高',
        description: '代码生成与补全合计占开发者使用场景的 67%，是 AI 编码助手最核心的价值洼地。',
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

function parseValue(v?: string): number {
  return parseFloat(String(v || '0').replace(/,/g, '')) || 0;
}

function buildDonutOption(segments: Theme04ChartDonutSegment[]): Record<string, unknown> {
  const data = segments.map((segment, index) => ({
    value: parseValue(segment.value),
    name: segment.label ?? '',
    itemStyle: {
      color: PALETTE[index % PALETTE.length],
      borderRadius: 4,
      borderColor: 'var(--lp-bg)',
      borderWidth: 3,
    },
  }));

  return {
    tooltip: { show: false },
    series: [
      {
        type: 'pie',
        radius: ['55%', '85%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'var(--lp-bg)',
          borderWidth: 3,
        },
        label: { show: false },
        emphasis: {
          scale: false,
          itemStyle: { shadowBlur: 0 },
        },
        data,
        animationType: 'scale',
        animationEasing: 'cubicOut',
        animationDuration: 800,
      },
    ],
  };
}

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-chart-donut-title lp-rise">
      {parts.map((part, idx) => {
        const match = part.match(/^\{\{(.+)\}\}$/);
        if (match) {
          return <em key={idx} className="lp-theme04-pill">{match[1]}</em>;
        }
        return <span key={idx}>{part}</span>;
      })}
    </EditableField>
  );
}

export function Theme04ChartDonut(props: Theme04ChartDonutProps): ReactNode {
  const {
    tag,
    tagLabel,
    topRightMeta,
    title,
    subtitle,
    total = { value: '0', label: '合计' },
    segments = [],
    showInsight = true,
    insight,
    footnoteLeft,
    footnoteRight,
    _slideIdx,
    _editable,
  } = props;

  const validSegments = (segments || [])
    .filter((s): s is Theme04ChartDonutSegment => s != null && !!(s.label || s.value))
    .map((s) => ({ ...s }))
    .sort((a, b) => {
      const na = parseValue(a.value);
      const nb = parseValue(b.value);
      return nb - na;
    });

  const totalValue = validSegments.reduce((sum, s) => sum + parseValue(s.value), 0);

  function formatPercent(value: string | undefined): string {
    const n = parseValue(value);
    const pct = totalValue > 0 ? Math.round((n / totalValue) * 1000) / 10 : 0;
    return `${pct}%`;
  }

  const hasInsight = showInsight !== false && !!insight && (!!insight.value || !!insight.label || !!insight.description);

  return (
    <div className="lp-slide lp-theme04-chart-donut">
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

      <div className="lp-theme04-chart-donut-main">
        <div className="lp-theme04-chart-donut-head lp-rise">
          {renderTitle(title || '', _slideIdx, _editable)}
          {subtitle && (
            <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-chart-donut-subtitle">{subtitle}</EditableField>
          )}
        </div>

        <div className="lp-theme04-chart-donut-body">
          <div className="lp-theme04-chart-donut-chart-wrap lp-rise">
            {validSegments.length > 0 ? (
              <LpEChart type="pie" option={buildDonutOption(validSegments)} className="lp-theme04-chart-donut-echart" />
            ) : (
              <div className="lp-theme04-chart-donut-empty">请配置分类数据</div>
            )}
            <div className="lp-theme04-chart-donut-center">
              <EditableField prop="total.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chart-donut-total-value">{total.value}</EditableField>
              <EditableField prop="total.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chart-donut-total-label">{total.label}</EditableField>
            </div>
          </div>

          <div className="lp-theme04-chart-donut-side lp-rise">
            <div className="lp-theme04-chart-donut-legend">
              {validSegments.map((segment, index) => {
                const color = PALETTE[index % PALETTE.length];
                return (
                  <div key={index} className="lp-theme04-chart-donut-legend-item lp-rise" style={{ animationDelay: `${index * 60}ms` }}>
                    <span className="lp-theme04-chart-donut-legend-dot" style={{ backgroundColor: color }} />
                    <div className="lp-theme04-chart-donut-legend-text">
                      <EditableField prop={`segments.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chart-donut-legend-label">{segment.label}</EditableField>
                      {segment.labelEn && (
                        <EditableField prop={`segments.${index}.labelEn`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chart-donut-legend-en">{segment.labelEn}</EditableField>
                      )}
                    </div>
                    <div className="lp-theme04-chart-donut-legend-numbers">
                      <div className="lp-theme04-chart-donut-legend-percent">{formatPercent(segment.value)}</div>
                      <EditableField prop={`segments.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chart-donut-legend-value" chartData>{segment.value}</EditableField>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasInsight && (
              <div className="lp-theme04-chart-donut-insight">
                {(insight.value || insight.label) && (
                  <div className="lp-theme04-chart-donut-insight-headline">
                    {insight.value && (
                      <EditableField prop="insight.value" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chart-donut-insight-value">{insight.value}</EditableField>
                    )}
                    {insight.label && (
                      <EditableField prop="insight.label" slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme04-chart-donut-insight-sub">{insight.label}</EditableField>
                    )}
                  </div>
                )}
                {insight.description && (
                  <EditableField prop="insight.description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-chart-donut-insight-desc">{insight.description}</EditableField>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lp-theme04-footer">
        {footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}
        {footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}
      </div>
    </div>
  );
}
