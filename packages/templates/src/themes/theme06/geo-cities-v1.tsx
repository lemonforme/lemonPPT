// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import { Theme06SlideBg } from './slide-bg.js';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';

export interface Theme06GeoCitiesV1City {
  name?: string;
  value?: string;
  unit?: string;
  change?: string;
}

export interface Theme06GeoCitiesV1Props {
  imageUrl?: string;
  kicker?: string;
  title: string;
  subtitle?: string;
  cities?: Theme06GeoCitiesV1City[];
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme06GeoCitiesV1Meta: LayoutMeta = {
  id: 'theme06_geo_cities_v1',
  theme: 'theme06',
  role: 'content',
  displayName: 'Theme 06 多城市指标对比',
  description: '城市徽章 + 指标值 + 涨跌幅',
  needsMedia: true,
  tags: ['geo', 'cities', 'ranking', 'atlas'],
  contentShape: 'ranking',
};

export const theme06GeoCitiesV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'GEO CITIES' },
    { key: 'title', label: '标题', type: 'text', inlineEditable: true, defaultValue: '重点城市指标排名' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '抽象条形图呈现核心城市关键指标差异' },
    {
      key: 'cities',
      label: '城市数据',
      type: 'array',
      minItems: 3,
      maxItems: 8,
      defaultValue: [
        { name: '北京', value: '1,240', unit: '亿', change: '+12%' },
        { name: '上海', value: '1,180', unit: '亿', change: '+9%' },
        { name: '深圳', value: '980', unit: '亿', change: '+15%' },
        { name: '杭州', value: '720', unit: '亿', change: '+18%' },
        { name: '广州', value: '650', unit: '亿', change: '+7%' },
      ],
      itemSchema: [
        { key: 'name', label: '城市', type: 'text', inlineEditable: true },
        { key: 'value', label: '数值', type: 'text', inlineEditable: true },
        { key: 'unit', label: '单位', type: 'text', inlineEditable: true },
        { key: 'change', label: '变化', type: 'text', inlineEditable: true },
      ],
    },
  ],
};

function parseChange(change?: string): { positive: boolean | null; text: string } {
  const text = change ?? '';
  if (text.startsWith('+')) return { positive: true, text };
  if (text.startsWith('-')) return { positive: false, text };
  return { positive: null, text };
}

export function Theme06GeoCitiesV1(props: Theme06GeoCitiesV1Props): ReactNode {
  const { kicker, title, subtitle, cities = [], _slideIdx, _editable } = props;
  const validCities = (cities || []).filter((c): c is Theme06GeoCitiesV1City => c != null).slice(0, 8);
  const maxValue = Math.max(...validCities.map((c) => Number((c.value || '').replace(/,/g, '')) || 0), 1);

  return (
    <div className="lp-slide lp-theme06-geo-cities">
        <Theme06SlideBg imageUrl={props.imageUrl} slideIdx={props._slideIdx} editable={props._editable} />
      <div className="lp-theme06-geo-cities-header lp-rise">
        {kicker && <div className="lp-theme06-kicker">{kicker}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h2" className="lp-theme06-title">{title}</EditableField>
        {subtitle && (
          <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme06-subtitle">{subtitle}</EditableField>
        )}
      </div>

      <div className="lp-theme06-geo-cities-body lp-rise">
        {validCities.map((city, index) => {
          const numericValue = Number((city.value || '').replace(/,/g, '')) || 0;
          const width = maxValue > 0 ? `${(numericValue / maxValue) * 100}%` : '0%';
          const { positive, text } = parseChange(city.change);
          return (
            <div key={index} className={`lp-theme06-geo-cities-row ${index === 0 ? 'focus' : ''}`}>
              <div className="lp-theme06-geo-cities-badge">
                <EditableField prop={`cities.${index}.name`} slideIdx={_slideIdx} editable={_editable} as="span">{city.name || ''}</EditableField>
              </div>
              <div className="lp-theme06-geo-cities-bar" style={{ flex: 1, height: 8, background: 'var(--lp-surface)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width, height: '100%', background: 'var(--lp-accent)', boxShadow: '0 0 10px var(--lp-focus-glow)' }} />
              </div>
              <div className="lp-theme06-geo-cities-value">
                <EditableField prop={`cities.${index}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{city.value || ''}</EditableField>
                <span className="lp-theme06-geo-cities-unit">{city.unit || ''}</span>
              </div>
              {text && (
                <div className={`lp-theme06-geo-cities-change ${positive === true ? 'positive' : positive === false ? 'negative' : ''}`}>
                  {text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="lp-theme06-glow-line" aria-hidden="true" />
      <div className="lp-theme06-footer">
        <span className="lp-theme06-footer-left" />
        <span className="lp-theme06-footer-right" />
      </div>
    </div>
  );
}
