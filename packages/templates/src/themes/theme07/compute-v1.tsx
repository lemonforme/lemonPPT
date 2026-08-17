// lemonPPT - theme07 算力集群气泡页
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { CSSProperties, ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07ComputeV1Cluster {
  label?: string;
  value?: number;
  unit?: string;
  note?: string;
}

export interface Theme07ComputeV1Metric {
  value?: string;
  label?: string;
}

export interface Theme07ComputeV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  clusters?: Theme07ComputeV1Cluster[];
  metrics?: Theme07ComputeV1Metric[];
  gridDensity?: number;
  showSplit?: boolean;
  splitLabelLeft?: string;
  splitLabelRight?: string;
  focusIndex?: number;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07ComputeV1Meta: LayoutMeta = {
  id: 'theme07_compute_v1',
  theme: 'theme07',
  role: 'content',
  displayName: 'Theme 07 算力集群气泡',
  description: '算力细分赛道聚簇气泡图：气泡尺寸表示份额，底部指标芯片',
  needsMedia: true,
  tags: ['compute', 'bubble', 'cluster', 'chart'],
  contentShape: 'bubble-cluster',
};

export const theme07ComputeV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'COMPUTE' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '算力赛道集群分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '按投入规模划分的算力细分赛道，气泡面积代表资源占比' },
    {
      key: 'clusters',
      label: '赛道气泡',
      type: 'array',
      minItems: 3,
      maxItems: 6,
      defaultValue: [
        { label: '训练集群', value: 38, unit: '%', note: '大模型预训练' },
        { label: '推理集群', value: 29, unit: '%', note: '在线服务承载' },
        { label: '云服务', value: 21, unit: '%', note: '弹性算力租赁' },
        { label: '边缘算力', value: 12, unit: '%', note: '端侧与近场' },
      ],
      itemSchema: [
        { key: 'label', label: '赛道名称', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'number' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'note', label: '说明', type: 'text', inlineEditable: true },
      ],
    },
    {
      key: 'metrics',
      label: '底部指标',
      type: 'array',
      minItems: 2,
      maxItems: 4,
      defaultValue: [
        { value: '4.2x', label: '三年算力增速' },
        { value: '62%', label: '头部集中度' },
        { value: '$18B', label: '年度资本开支' },
        { value: '11', label: '主要供给方' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'label', label: '标签', type: 'text', inlineEditable: true },
      ],
    },
    { key: 'gridDensity', label: '背景点阵密度', type: 'slider', min: 6, max: 20, defaultValue: 12 },
    { key: 'showSplit', label: '显示分区线', type: 'boolean', defaultValue: true },
    { key: 'splitLabelLeft', label: '左区标签', type: 'text', defaultValue: '自建算力' },
    { key: 'splitLabelRight', label: '右区标签', type: 'text', defaultValue: '外采算力' },
    { key: 'focusIndex', label: '高亮赛道', type: 'slider', min: 0, max: 5, defaultValue: 0 },
  ],
};

/** 每个主气泡周围的卫星点偏移（百分比，相对气泡尺寸），营造「聚簇」质感 */
const SATELLITE_OFFSETS: { dx: number; dy: number; scale: number }[] = [
  { dx: -0.62, dy: -0.42, scale: 0.22 },
  { dx: 0.58, dy: -0.28, scale: 0.16 },
  { dx: 0.34, dy: 0.56, scale: 0.19 },
];

export function Theme07ComputeV1(props: Theme07ComputeV1Props): ReactNode {
  const {
    imageUrl,
    kicker,
    title,
    subtitle,
    clusters = [],
    metrics = [],
    gridDensity = 12,
    showSplit = true,
    splitLabelLeft,
    splitLabelRight,
    focusIndex = 0,
    _slideIdx,
    _editable,
  } = props;

  const validClusters = (clusters || [])
    .filter((c): c is Theme07ComputeV1Cluster => c != null && !!c.label)
    .slice(0, 6);
  const validMetrics = (metrics || [])
    .filter((m): m is Theme07ComputeV1Metric => m != null && !!m.value)
    .slice(0, 4);
  const maxValue = validClusters.reduce((acc, c) => Math.max(acc, Number(c.value) || 0), 0) || 1;
  const density = Math.max(6, Math.min(20, Math.round(gridDensity)));
  const gridStep = `${Math.round(720 / density)}px`;

  return (
    <div className="lp-slide lp-theme07 lp-theme07-compute-cluster">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-compute-cluster-header lp-rise">
        <Theme07IconChip name="layers" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validClusters.length > 0 && (
        <div
          className="lp-theme07-compute-cluster-field lp-rise"
          style={{ '--lp-theme07-grid-step': gridStep } as CSSProperties}
        >
          {showSplit && (
            <>
              <span className="lp-theme07-compute-cluster-split" aria-hidden="true" />
              {splitLabelLeft && <span className="lp-theme07-compute-cluster-split-label left">{splitLabelLeft}</span>}
              {splitLabelRight && <span className="lp-theme07-compute-cluster-split-label right">{splitLabelRight}</span>}
            </>
          )}
          {validClusters.map((cluster, index) => {
            const value = Number(cluster.value) || 0;
            const ratio = Math.sqrt(value / maxValue);
            const size = Math.round(92 + ratio * 84);
            const isFocus = index === focusIndex;
            return (
              <div key={index} className="lp-theme07-compute-cluster-item" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="lp-theme07-compute-cluster-bubble-wrap" style={{ width: `${size}px`, height: `${size}px` }}>
                  {SATELLITE_OFFSETS.map((sat, si) => (
                    <span
                      key={si}
                      className="lp-theme07-compute-cluster-satellite"
                      aria-hidden="true"
                      style={{
                        width: `${Math.round(size * sat.scale)}px`,
                        height: `${Math.round(size * sat.scale)}px`,
                        left: `${50 + sat.dx * 52}%`,
                        top: `${50 + sat.dy * 52}%`,
                      }}
                    />
                  ))}
                  <div className={`lp-theme07-compute-cluster-bubble ${isFocus ? 'is-focus' : ''}`}>
                    <span className="lp-theme07-compute-cluster-value">
                      <EditableField prop={`clusters.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span" fieldType="number" chartData>{value}</EditableField>
                      {cluster.unit && <em className="lp-theme07-compute-cluster-unit">{cluster.unit}</em>}
                    </span>
                  </div>
                </div>
                <div className="lp-theme07-compute-cluster-label">
                  <EditableField prop={`clusters.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{cluster.label}</EditableField>
                </div>
                {cluster.note && (
                  <div className="lp-theme07-compute-cluster-note">
                    <EditableField prop={`clusters.${index}.note`} slideIdx={_slideIdx} editable={_editable} as="span">{cluster.note}</EditableField>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {validMetrics.length > 0 && (
        <div className="lp-theme07-compute-cluster-metrics lp-rise">
          {validMetrics.map((metric, index) => (
            <div key={index} className="lp-theme07-compute-cluster-metric">
              <span className="lp-theme07-compute-cluster-metric-value">
                <EditableField prop={`metrics.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{metric.value}</EditableField>
              </span>
              <span className="lp-theme07-compute-cluster-metric-label">
                <EditableField prop={`metrics.${index}.label`} slideIdx={_slideIdx} editable={_editable} as="span">{metric.label || ''}</EditableField>
              </span>
            </div>
          ))}
        </div>
      )}
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
