// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../../echarts/shared-chart.js';

export interface Theme06RegionRiskV1Item {
  region?: string;
  risk?: string;
  value?: number;
}

export interface Theme06RegionRiskV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  regions?: string[];
  risks?: string[];
  items?: Theme06RegionRiskV1Item[];
  conclusion?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06RegionRiskV1Meta: LayoutMeta = {
  id: 'theme06_region_risk_v1',
  theme: 'theme06',
  role: 'chart',
  displayName: 'Theme 06 区域风险热力图',
  description: '区域 × 风险维度的热力矩阵',
  needsMedia: true,
  tags: ['risk', 'region', 'heatmap', 'atlas'],
  contentShape: 'generic-chart',
};

export const theme06RegionRiskV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'REGIONAL RISK' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '区域风险热力图' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '不同地区在政策、汇率与需求侧的风险分布' },
    {
      key: 'regions',
      label: '地区',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: ['北美', '欧洲', '亚太', '拉美', '中东'],
      itemSchema: [{ key: 'item', label: '地区', type: 'text', inlineEditable: true }],
    },
    {
      key: 'risks',
      label: '风险维度',
      type: 'array',
      minItems: 2,
      maxItems: 5,
      defaultValue: ['政策', '汇率', '需求', '供应链'],
      itemSchema: [{ key: 'item', label: '维度', type: 'text', inlineEditable: true }],
    },
    {
      key: 'items',
      label: '风险数据',
      type: 'array',
      minItems: 3,
      maxItems: 30,
      defaultValue: [
        { region: '北美', risk: '政策', value: 3 }, { region: '北美', risk: '汇率', value: 5 },
        { region: '北美', risk: '需求', value: 4 }, { region: '北美', risk: '供应链', value: 5 },
        { region: '欧洲', risk: '政策', value: 6 }, { region: '欧洲', risk: '汇率', value: 7 },
        { region: '欧洲', risk: '需求', value: 5 }, { region: '欧洲', risk: '供应链', value: 4 },
        { region: '亚太', risk: '政策', value: 4 }, { region: '亚太', risk: '汇率', value: 6 },
        { region: '亚太', risk: '需求', value: 7 }, { region: '亚太', risk: '供应链', value: 6 },
        { region: '拉美', risk: '政策', value: 7 }, { region: '拉美', risk: '汇率', value: 8 },
        { region: '拉美', risk: '需求', value: 6 }, { region: '拉美', risk: '供应链', value: 7 },
        { region: '中东', risk: '政策', value: 5 }, { region: '中东', risk: '汇率', value: 6 },
        { region: '中东', risk: '需求', value: 5 }, { region: '中东', risk: '供应链', value: 8 },
      ],
      itemSchema: [
        { key: 'region', label: '地区', type: 'text' },
        { key: 'risk', label: '维度', type: 'text' },
        { key: 'value', label: '风险值', type: 'number' },
      ],
    },
    { key: 'conclusion', label: '结论', type: 'textarea', inlineEditable: true, defaultValue: '欧洲汇率与亚太需求侧风险偏高，需要针对性对冲。' },
  ],
};

function normalizeStringArray(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => (typeof item === 'string' ? item : (item as { item?: string }).item ?? ''))
    .filter((item) => item !== '');
}

function buildOption(regions: string[], risks: string[], items: Theme06RegionRiskV1Item[]): Record<string, unknown> {
  const valueMap = new Map<string, number>();
  items.forEach((i) => {
    if (i.region && i.risk) valueMap.set(`${i.region}|${i.risk}`, i.value ?? 0);
  });
  const data: number[][] = [];
  regions.forEach((region, rIndex) => {
    risks.forEach((risk, cIndex) => {
      data.push([rIndex, cIndex, valueMap.get(`${region}|${risk}`) ?? 0]);
    });
  });
  return {
    tooltip: {
      position: 'top',
      backgroundColor: 'var(--lp-surface-solid)',
      borderColor: 'var(--lp-border-strong)',
      textStyle: { color: 'var(--lp-ink)' },
      formatter: (params: { name?: string; value?: number[]; data?: number[] }) => {
        const v = params.data || params.value || [];
        return `${regions[v[0] ?? 0]} · ${risks[v[1] ?? 0]}<br/><strong>风险值 ${v[2] ?? 0}</strong>`;
      },
    },
    grid: { top: 16, right: 24, bottom: 24, left: 80, containLabel: false },
    xAxis: {
      type: 'category',
      data: regions,
      splitArea: { show: true, areaStyle: { color: ['var(--lp-surface)', 'transparent'] } },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
      axisLine: { lineStyle: { color: 'var(--lp-border)' } },
    },
    yAxis: {
      type: 'category',
      data: risks,
      splitArea: { show: true },
      axisLabel: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font)' },
      axisLine: { lineStyle: { color: 'var(--lp-border)' } },
    },
    visualMap: {
      min: 1,
      max: 10,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: -4,
      inRange: { color: ['var(--lp-surface-solid)', 'var(--lp-accent)'] },
      textStyle: { color: 'var(--lp-ink3)' },
      show: false,
    },
    series: [{
      type: 'heatmap',
      data,
      label: { show: true, color: 'var(--lp-ink)', fontFamily: 'var(--lp-font-mono)' },
      itemStyle: {
        borderColor: 'var(--lp-bg)',
        borderWidth: 2,
        borderRadius: 4,
      },
      emphasis: {
        itemStyle: { shadowBlur: 12, shadowColor: 'var(--lp-focus-glow)' },
      },
    }],
  };
}

export function Theme06RegionRiskV1(props: Theme06RegionRiskV1Props): ReactNode {
  const { kicker, title, subtitle, regions = [], risks = [], items = [], conclusion, _slideIdx, _editable } = props;
  const validRegions = normalizeStringArray(regions).slice(0, 6);
  const validRisks = normalizeStringArray(risks).slice(0, 5);
  const validItems = (items || []).filter((i): i is Theme06RegionRiskV1Item => i != null && !!i.region && !!i.risk).slice(0, 30);

  return (
    <div className="lp-slide lp-theme06-region-risk">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-region-risk-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-region-risk-body lp-rise">
        <div className="lp-theme06-region-risk-canvas">
          {validRegions.length > 0 && validRisks.length > 0 && validItems.length > 0 && (
            <LpEChart type="heatmap" option={buildOption(validRegions, validRisks, validItems)} />
          )}
        </div>
        {conclusion && (
          <div className="lp-theme06-region-risk-conclusion">
            <EditableField prop="conclusion" slideIdx={_slideIdx} editable={_editable} as="p">{conclusion}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
