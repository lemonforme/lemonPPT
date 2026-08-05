// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06ChartRadarV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  indicators?: string[];
  data?: number[];
  unit?: string;
  showConclusion?: boolean;
  conclusionValue?: string;
  conclusionLabel?: string;
  conclusionDescription?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06ChartRadarV1Meta: LayoutMeta = {
  id: 'theme06_chart_radar_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 雷达图',
  description: '多维度雷达图 + 右侧洞察卡',
  needsMedia: true,
  tags: ['chart', 'radar', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06ChartRadarV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'RADAR' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '综合能力雷达' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从六个维度评估市场竞争力' },
    {
      key: 'indicators',
      label: '维度标签',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      itemSchema: [{ key: 'item', label: '项', type: 'text', inlineEditable: true }],
    },
    {
      key: 'data',
      label: '维度分值',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      itemSchema: [{ key: 'item', label: '项', type: 'number', inlineEditable: true }],
    },
    { key: 'unit', label: '单位', type: 'text', inlineEditable: true, defaultValue: '分' },
    { key: 'showConclusion', label: '重点强调', type: 'boolean', defaultValue: true },
    { key: 'conclusionValue', label: '结论主数值', type: 'text', defaultValue: '86' },
    { key: 'conclusionLabel', label: '结论标签', type: 'text', defaultValue: '综合得分' },
    { key: 'conclusionDescription', label: '结论描述', type: 'textarea', defaultValue: '产品创新能力突出，市场渗透与运营效率仍有提升空间。' },
  ],
};

function buildOption(indicators: string[], data: number[]): Record<string, unknown> {
  const validIndicators = indicators.map((label) => ({
    name: label ?? '',
    max: 100,
    axisName: {
      color: 'var(--lp-ink2)',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'var(--lp-font)',
    },
  }));

  return {
    radar: {
      indicator: validIndicators,
      radius: '65%',
      center: ['50%', '52%'],
      splitNumber: 4,
      axisNameGap: 8,
      splitArea: {
        areaStyle: {
          color: ['var(--lp-surface)', 'var(--lp-surface-solid)', 'var(--lp-surface)', 'var(--lp-surface-solid)'],
        },
      },
      splitLine: { lineStyle: { color: 'var(--lp-border)' } },
      axisLine: { lineStyle: { color: 'var(--lp-border)' } },
    },
    series: [{
      type: 'radar',
      data: [{
        value: data,
        name: '能力评分',
        areaStyle: { color: 'var(--lp-accent)', opacity: 0.2 },
        lineStyle: { color: 'var(--lp-accent)', width: 3 },
        itemStyle: { color: 'var(--lp-accent)' },
        symbolSize: 6,
      }],
      animationDuration: 900,
    }],
  };
}

export function Theme06ChartRadarV1(props: Theme06ChartRadarV1Props): ReactNode {
  const { kicker, title, subtitle, indicators = [], data = [], unit, showConclusion = true, conclusionValue, conclusionLabel, conclusionDescription, _slideIdx, _editable } = props;

  const normIndicators = indicators.map((label) => (typeof label === 'string' ? label : (label as { item?: string }).item ?? ''));
  const normData = data.map((value) => (typeof value === 'number' ? value : Number((value as { item?: number }).item ?? 0) || 0));
  const validIndicators = normIndicators.slice(0, normData.length);
  const validData = normData.slice(0, normIndicators.length);
  const hasData = validIndicators.length >= 3 && validData.length >= 3;

  return (
    <div className="lp-slide lp-theme06-chart">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-chart-main lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>}
        <div className="lp-theme06-chart-canvas">
          {hasData ? (
            <LpEChart type="radar" option={buildOption(validIndicators, validData)} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lp-ink3)' }}>
              请在右侧属性面板输入至少 3 个维度数据
            </div>
          )}
        </div>
      </div>
      <div className="lp-theme06-chart-aside lp-rise">
        {unit && (
          <div className="lp-theme06-card">
            <div className="lp-theme06-card-label">单位</div>
            <div className="lp-theme06-card-value" style={{ fontSize: 'var(--lp-font-size-h3)' }}>{unit}</div>
          </div>
        )}
        {showConclusion && (
          <div className="lp-theme06-conclusion">
            {conclusionValue && <div className="lp-theme06-conclusion-value"><EditableField prop="conclusionValue" slideIdx={_slideIdx} editable={_editable} as="span">{conclusionValue}</EditableField></div>}
            {conclusionLabel && <div className="lp-theme06-conclusion-label"><EditableField prop="conclusionLabel" slideIdx={_slideIdx} editable={_editable} as="span">{conclusionLabel}</EditableField></div>}
            {conclusionDescription && <div className="lp-theme06-conclusion-description"><EditableField prop="conclusionDescription" slideIdx={_slideIdx} editable={_editable} as="span">{conclusionDescription}</EditableField></div>}
          </div>
        )}
      </div>
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
