// lemonPPT - theme08 黑金实验 · 地理分布
// 原创实现，不复制 Dashi theme08

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme08SlideBg } from './slide-bg.js';
import { Theme08MiniBars } from './decorations.js';
import { Theme08IconChip } from './theme08-icons.js';

export interface Theme08RegionV1Region {
  city: string;
  value: string;
  x?: string;
  y?: string;
}

export interface Theme08RegionV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  regions?: Theme08RegionV1Region[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme08RegionV1Meta: LayoutMeta = {
  id: 'theme08_region_v1',
  theme: 'theme08',
  role: 'image',
  displayName: 'Theme 08 地理分布',
  description: '左侧点阵地图 + 右侧城市列表，适合区域布局',
  needsMedia: false,
  tags: ['region', 'geo', 'black-gold'],
  contentShape: 'region',
};

export const theme08RegionV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'FOOTPRINT' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '全球布局' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '核心节点覆盖北美与亚洲主要创新城市。' },
    {
      key: 'regions',
      label: '城市',
      type: 'array',
      minItems: 1,
      maxItems: 6,
      defaultValue: [
        { city: 'New York', value: '32', x: '26%', y: '40%' },
        { city: 'Seattle', value: '24', x: '18%', y: '34%' },
        { city: 'San Francisco', value: '28', x: '14%', y: '46%' },
        { city: 'Beijing', value: '19', x: '78%', y: '42%' },
        { city: 'Singapore', value: '15', x: '74%', y: '62%' },
      ],
      itemSchema: [
        { key: 'city', label: '城市', type: 'text' },
        { key: 'value', label: '数值', type: 'text' },
        { key: 'x', label: 'X(%)', type: 'text' },
        { key: 'y', label: 'Y(%)', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '56' },
  ],
};

export function Theme08RegionV1(props: Theme08RegionV1Props): ReactNode {
  const { kicker, title, subtitle, regions = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const valid = (regions || []).slice(0, 6);
  return (
    <div className="lp-slide lp-theme08 lp-theme08-region-page">
      <Theme08SlideBg />
      <div className="lp-theme08-page">
        <div className="lp-theme08-section-header lp-rise">
          <Theme08IconChip name="globe" size={40} />
          {kicker && <div className="lp-theme08-kicker"><EditableField prop="kicker" slideIdx={_slideIdx} editable={_editable} as="span">{kicker}</EditableField></div>}
          <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme08-title">{title}</EditableField>
          {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme08-subtitle">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme08-body">
          <div className="lp-theme08-region lp-rise">
            <div className="lp-theme08-region-map">
              {valid.map((r, i) => (
                <span
                  key={i}
                  className={`lp-theme08-region-dot ${i % 2 === 1 ? 'sm' : ''}`}
                  style={{ left: r.x || '50%', top: r.y || '50%' }}
                  title={r.city}
                />
              ))}
            </div>
            <div className="lp-theme08-region-list">
              {valid.map((r, i) => (
                <div key={i} className="lp-theme08-region-row" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="lp-theme08-region-city"><EditableField prop={`regions.${i}.city`} slideIdx={_slideIdx} editable={_editable} as="span">{r.city}</EditableField></div>
                  <div className="lp-theme08-region-val"><EditableField prop={`regions.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{r.value}</EditableField></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="lp-theme08-glow-line" aria-hidden="true" />
      <div className="lp-theme08-footer">
        <span className="lp-theme08-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme08-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme08MiniBars count={20} />
    </div>
  );
}
