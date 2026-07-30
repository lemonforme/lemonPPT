// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { LpEChart } from '../theme01/echart.js';

export interface Theme04RadarV1Dataset {
  name?: string;
  data?: number[];
  tone?: 'green' | 'pink' | 'blue' | 'yellow';
}

export interface Theme04RadarV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  labels?: string[];
  datasets?: Theme04RadarV1Dataset[];
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme04RadarV1Meta: LayoutMeta = {
  id: 'theme04_radar_v1',
  theme: 'theme04',
  role: 'chart',
  displayName: 'Theme 04 多维雷达图',
  description: '糖果色雷达图，适合多维能力对比',
  needsMedia: false,
  tags: ['radar', 'chart', 'candy'],
  contentShape: 'radar-chart',
};

export const theme04RadarV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: '多维能力 · RADAR' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '三类玩家的{{能力象限}}对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从融资规模、收入、技术、生态与可控性五个维度评估' },
    {
      key: 'labels',
      label: '维度标签',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: ['融资规模', '收入确定性', '技术领先', '生态广度', '可控安全'],
      itemSchema: [{ key: 'item', label: '维度', type: 'text', inlineEditable: true }],
    },
    {
      key: 'datasets',
      label: '数据集',
      type: 'array',
      minItems: 1,
      maxItems: 4,
      defaultValue: [
        { name: 'OpenAI', data: [95, 70, 98, 92, 65], tone: 'green' },
        { name: 'Anthropic', data: [90, 60, 95, 70, 90], tone: 'pink' },
        { name: 'xAI', data: [85, 40, 88, 60, 55], tone: 'blue' },
      ],
      itemSchema: [
        { key: 'name', label: '系列名', type: 'text' },
        { key: 'tone', label: '色调', type: 'select', defaultValue: 'green', options: [{ value: 'green', label: '绿' }, { value: 'pink', label: '粉' }, { value: 'blue', label: '蓝' }, { value: 'yellow', label: '黄' }] },
        {
          key: 'data',
          label: '数据',
          type: 'array',
          maxItems: 8,
          itemSchema: [{ key: 'item', label: '值', type: 'number', inlineEditable: true }],
        },
      ],
    },
    { key: 'footnote', label: '页脚', type: 'text', inlineEditable: true, defaultValue: '满分 100 · 数据为示意' },
  ],
};

function renderTitle(title: string, slideIdx?: number, editable?: boolean): ReactNode {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return (
    <EditableField prop="title" slideIdx={slideIdx} editable={editable} as="h2" className="lp-theme04-radar-title lp-rise">
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

const toneColors: Record<string, string> = {
  green: 'var(--lp-green)',
  pink: 'var(--lp-pink)',
  blue: 'var(--lp-blue)',
  yellow: 'var(--lp-yellow)',
};

function buildOption(labels: string[], datasets: Theme04RadarV1Dataset[]): Record<string, unknown> {
  const indicator = labels.map((label) => ({ name: label ?? '', max: 100 }));
  const palette = ['var(--lp-accent)', 'var(--lp-accent-2)', 'var(--lp-accent-cool)', 'var(--lp-yellow)'];
  const seriesData = datasets.map((ds, idx) => {
    const c = toneColors[ds.tone || 'green'] || palette[idx % palette.length];
    return {
      value: ds.data || [],
      name: ds.name || `Series ${idx + 1}`,
      lineStyle: { color: c, width: 3 },
      itemStyle: { color: c },
      areaStyle: { color: c, opacity: 0.12 },
      symbolSize: 8,
    };
  });

  return {
    legend: {
      data: datasets.map((ds) => ds.name || ''),
      bottom: 0,
      textStyle: { color: 'var(--lp-ink2)', fontFamily: 'var(--lp-font-mono)', fontSize: 11 },
      itemGap: 16,
    },
    radar: {
      indicator,
      radius: '62%',
      center: ['50%', '46%'],
      axisName: {
        color: 'var(--lp-ink2)',
        fontFamily: 'var(--lp-font)',
        fontSize: 12,
        fontWeight: 600,
      },
      splitArea: { areaStyle: { color: ['var(--lp-surface)', 'var(--lp-overlay)'] } },
      axisLine: { lineStyle: { color: 'var(--lp-divider)' } },
      splitLine: { lineStyle: { color: 'var(--lp-divider)' } },
    },
    series: [{
      type: 'radar',
      data: seriesData,
      animationDuration: 900,
    }],
  };
}

export function Theme04RadarV1(props: Theme04RadarV1Props): ReactNode {
  const { kicker, title, subtitle, labels = [], datasets = [], footnote, _slideIdx, _editable } = props;
  const safeLabels = labels.slice(0, 8);
  const safeDatasets = datasets.filter((d) => d != null).slice(0, 4).map((d) => ({
    ...d,
    data: (d.data || []).slice(0, safeLabels.length),
  }));
  const hasData = safeLabels.length >= 3 && safeDatasets.length > 0;

  return (
    <div className="lp-slide lp-theme04-radar">
      <div className="lp-theme04-radar-top lp-rise">
        {kicker && (
          <div className="lp-theme04-tag">
            <EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField>
          </div>
        )}
      </div>

      <div className="lp-theme04-radar-head lp-rise">
        {renderTitle(title || '', _slideIdx, _editable)}
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme04-radar-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme04-radar-body lp-rise">
        {hasData ? (
          <LpEChart type="radar" option={buildOption(safeLabels, safeDatasets)} className="lp-theme04-radar-echart" />
        ) : (
          <div className="lp-theme04-radar-empty">请配置至少 3 个维度与 1 组数据</div>
        )}
      </div>

      {footnote && (
        <div className="lp-theme04-radar-footnote lp-rise">
          <EditableField prop="footnote" slideIdx={_slideIdx} editable={_editable} as="span">{footnote}</EditableField>
        </div>
      )}
    </div>
  );
}
