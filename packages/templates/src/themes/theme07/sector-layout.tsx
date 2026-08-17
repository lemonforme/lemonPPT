// lemonPPT - theme07 通用行业/赛道专题页骨架
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart, type LpEChartType } from '../../echarts/shared-chart.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07DropMedia } from './drop-media-placeholder.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07SectorLayoutMetric {
  value?: string;
  label?: string;
  accent?: boolean;
}

export interface Theme07SectorLayoutBullet {
  title?: string;
  desc?: string;
}

export interface Theme07SectorLayoutInsight {
  value?: string;
  label?: string;
  description?: string;
}

export interface Theme07SectorLayoutProps {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  description?: string;
  bullets?: Theme07SectorLayoutBullet[];
  metrics?: Theme07SectorLayoutMetric[];
  chartType?: LpEChartType;
  chartOption?: Record<string, unknown>;
  showInsight?: boolean;
  insight?: Theme07SectorLayoutInsight;
  imageLabel?: string;
  footnote?: string;
  imageRatio?: 'portrait' | 'landscape' | 'square' | 'auto';
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07SectorLayoutMetaBase: Omit<LayoutMeta, 'id' | 'displayName' | 'description' | 'tags'> = {
  theme: 'theme07',
  role: 'content',
  needsMedia: true,
  contentShape: 'summary',
};

export const theme07SectorLayoutSchemaBase: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SECTOR SPOTLIGHT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '赛道专题' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从数据中提取关键结论' },
    { key: 'description', label: '左侧描述', type: 'textarea', inlineEditable: true, defaultValue: '' },
    {
      key: 'bullets',
      label: '要点列表',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { title: '核心趋势一', desc: '要点说明' },
        { title: '核心趋势二', desc: '要点说明' },
        { title: '核心趋势三', desc: '要点说明' },
      ],
      itemSchema: [
        { key: 'title', label: '要点标题', type: 'text' },
        { key: 'desc', label: '要点说明', type: 'textarea' },
      ],
    },
    {
      key: 'metrics',
      label: '右侧指标卡',
      type: 'array',
      minItems: 0,
      maxItems: 4,
      defaultValue: [],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'accent', label: '强调', type: 'boolean' },
      ],
    },
    { key: 'chartType', label: '图表类型', type: 'text', defaultValue: 'line' },
    { key: 'chartOption', label: '图表配置', type: 'object', defaultValue: {} },
    { key: 'showInsight', label: '显示洞察', type: 'boolean', defaultValue: true },
    {
      key: 'insight',
      label: '关键洞察',
      type: 'object',
      visibleWhen: { key: 'showInsight', value: true },
      defaultValue: { value: '3.2x', label: '投资回报率中位数', description: '在已商业化的场景中展现出显著的运营效率提升。' },
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
        { key: 'description', label: '描述', type: 'textarea' },
      ],
    },
    { key: 'footnote', label: '页脚注释', type: 'textarea', defaultValue: '' },
    { key: 'imageLabel', label: '图片区域标签', type: 'text', defaultValue: '' },
    { key: 'imageRatio', label: '图片比例', type: 'select', options: [{ value: 'landscape', label: '横向' }, { value: 'portrait', label: '纵向' }, { value: 'square', label: '方形' }, { value: 'auto', label: '自适应' }], defaultValue: 'landscape' },
  ],
};

export function Theme07SectorLayout(props: Theme07SectorLayoutProps): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    description,
    bullets = [],
    metrics = [],
    chartType,
    chartOption,
    showInsight = true,
    insight,
    imageLabel,
    footnote,
    imageRatio,
    _slideIdx,
    _editable,
  } = props;

  const validBullets = (bullets || []).filter((b) => b && (b.title || b.desc)).slice(0, 6);
  const validMetrics = (metrics || []).filter((m) => m && (m.value || m.label)).slice(0, 4);
  const hasChart = !!chartType && !!chartOption && Object.keys(chartOption).length > 0;
  const hasMetrics = validMetrics.length > 0;
  const hasInsight = showInsight && insight && (insight.value || insight.label || insight.description);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-sector">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-sector-header lp-rise">
        <Theme07IconChip name="chart" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme07-sector-body lp-rise">
        <div className="lp-theme07-sector-main">
          {description && (
            <EditableField prop="description" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-sector-desc">{description}</EditableField>
          )}
          {validBullets.length > 0 && (
            <div className="lp-theme07-sector-bullets">
              {validBullets.map((item, i) => (
                <div key={i} className="lp-theme07-sector-bullet">
                  <div className="lp-theme07-sector-bullet-number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="lp-theme07-sector-bullet-body">
                    {item.title && (
                      <EditableField prop={`bullets.${i}.title`} slideIdx={_slideIdx} editable={_editable} as="div" className="lp-theme07-sector-bullet-title">{item.title}</EditableField>
                    )}
                    {item.desc && (
                      <EditableField prop={`bullets.${i}.desc`} slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-sector-bullet-desc">{item.desc}</EditableField>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lp-theme07-sector-aside">
          {hasChart ? (
            <div className="lp-theme07-sector-chart">
              <LpEChart type={chartType} option={chartOption!} />
            </div>
          ) : null}
          {imageLabel && !hasChart ? (
            <div className="lp-theme07-sector-image">
              <Theme07DropMedia tag={kicker} label={imageLabel} imageRatio={imageRatio} />
            </div>
          ) : null}
          {hasMetrics && (
            <div className="lp-theme07-sector-metrics">
              {validMetrics.map((m, i) => (
                <div key={i} className={`lp-theme07-sector-metric ${m.accent ? 'accent' : ''}`}>
                  {m.value && <div className="lp-theme07-sector-metric-value">{m.value}</div>}
                  {m.label && <div className="lp-theme07-sector-metric-label">{m.label}</div>}
                </div>
              ))}
            </div>
          )}
          {hasInsight && (
            <div className="lp-theme07-sector-insight">
              {insight!.value && <div className="lp-theme07-sector-insight-value">{insight!.value}</div>}
              {insight!.label && <div className="lp-theme07-sector-insight-label">{insight!.label}</div>}
              {insight!.description && <div className="lp-theme07-sector-insight-desc">{insight!.description}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="lp-theme07-sector-footer">
        {footnote && <span className="lp-theme07-sector-footnote">{footnote}</span>}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
