// lemonPPT - theme07 通用地理分布页骨架
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07GeoLayoutRegion {
  name?: string;
  percent?: number;
  value?: string;
  note?: string;
}

export interface Theme07GeoLayoutProps {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  regions?: Theme07GeoLayoutRegion[];
  mapLabel?: string;
  footnote?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07GeoLayoutMetaBase: Omit<LayoutMeta, 'id' | 'displayName' | 'description' | 'tags'> = {
  theme: 'theme07',
  role: 'content',
  needsMedia: true,
  contentShape: 'summary',
};

export const theme07GeoLayoutSchemaBase: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GEOGRAPHY' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '地理分布' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '核心区域与资源集中地' },
    {
      key: 'regions',
      label: '区域列表',
      type: 'array',
      minItems: 2,
      maxItems: 8,
      defaultValue: [
        { name: '北美', percent: 52, value: '520 亿', note: '美国主导' },
        { name: '中国', percent: 24, value: '240 亿', note: '大模型与应用并重' },
        { name: '欧洲', percent: 14, value: '140 亿', note: '伦敦、巴黎、柏林' },
        { name: '其他', percent: 10, value: '100 亿', note: '中东、东南亚增速快' },
      ],
      itemSchema: [
        { key: 'name', label: '区域名', type: 'text' },
        { key: 'percent', label: '占比（%）', type: 'number' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'note', label: '备注', type: 'text' },
      ],
    },
    { key: 'mapLabel', label: '地图占位标签', type: 'text', defaultValue: '地理分布示意' },
    { key: 'footnote', label: '页脚注释', type: 'textarea', defaultValue: '' },
  ],
};

export function Theme07GeoLayout(props: Theme07GeoLayoutProps): ReactNode {
  const { imageUrl, kicker, title, subtitle, regions = [], mapLabel, footnote, _slideIdx, _editable } = props;
  const validRegions = (regions || []).filter((r) => r && r.name).slice(0, 8);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-geo">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <div className="lp-theme07-geo-header lp-rise">
        <Theme07IconChip name="globe" />
        {kicker && <div className="lp-theme07-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme07-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>
        )}
      </div>
      <div className="lp-theme07-geo-body lp-rise">
        <div className="lp-theme07-geo-list">
          {validRegions.map((r, i) => (
            <div key={i} className="lp-theme07-geo-region">
              <div className="lp-theme07-geo-region-info">
                <div className="lp-theme07-geo-region-name">{r.name}</div>
                <div className="lp-theme07-geo-region-meta">
                  {r.value && <span className="lp-theme07-geo-region-value">{r.value}</span>}
                  {r.note && <span className="lp-theme07-geo-region-note">{r.note}</span>}
                </div>
              </div>
              <div className="lp-theme07-geo-region-bar">
                <div
                  className="lp-theme07-geo-region-bar-fill"
                  style={{ width: `${Math.max(0, Math.min(100, r.percent ?? 0))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="lp-theme07-geo-map">
          {imageUrl ? (
            <img src={imageUrl} alt={mapLabel || '地理分布'} className="lp-theme07-geo-map-img" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--lp-radius-large)' }} />
          ) : (
            <div className="lp-theme07-geo-deco">
              <div className="lp-theme07-geo-deco-circle" aria-hidden="true" />
              <div className="lp-theme07-geo-deco-circle" aria-hidden="true" />
              <div className="lp-theme07-geo-deco-circle" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
      <div className="lp-theme07-geo-footer">
        {footnote && <span className="lp-theme07-geo-footnote">{footnote}</span>}
      </div>
      <div className="lp-theme07-glow-line" aria-hidden="true" />
    </div>
  );
}
