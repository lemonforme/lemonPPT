// lemonPPT - theme07 供应链战略封面
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { EditableField } from '../../editable-field.js';
import { Theme07SlideBg } from './slide-bg.js';
import { Theme07MiniBars, Theme07WatermarkNumber } from './decoration.js';
import { Theme07IconChip, Theme07DecoNodes } from './theme07-icons.js';

export interface Theme07CoverSupplyStrategyV1Kpi {
  value?: string;
  unit?: string;
  label?: string;
}

export interface Theme07CoverSupplyStrategyV1Props {
  imageUrl?: string;
  badge?: string;
  hero?: string;
  title: string;
  subtitle?: string;
  kpis?: Theme07CoverSupplyStrategyV1Kpi[];
  footnoteLeft?: string;
  footnoteRight?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme07CoverSupplyStrategyV1Meta: LayoutMeta = {
  id: 'theme07_cover_supply_strategy_v1',
  theme: 'theme07',
  role: 'cover',
  displayName: 'Theme 07 供应链战略封面',
  description: '居中 Hero + 底部 KPI 卡，适合战略主题',
  needsMedia: true,
  tags: ['cover', 'strategy', 'supply-chain'],
  contentShape: 'cover',
};

export const theme07CoverSupplyStrategyV1Schema: PropsSchema = {
  fields: [
    { key: 'imageUrl', label: '背景图片', type: 'image' },
    { key: 'badge', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'SUPPLY STRATEGY' },
    { key: 'hero', label: '英文大字', type: 'text', inlineEditable: true, defaultValue: 'RESILIENT AI SUPPLY' },
    { key: 'title', label: '主标题', type: 'text', inlineEditable: true, defaultValue: '构建有韧性的 AI 供应链' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '多元化、在地化与战略合作伙伴关系' },
    {
      key: 'kpis',
      label: '底部 KPI',
      type: 'array',
      minItems: 2,
      maxItems: 3,
      defaultValue: [
        { value: '3+', unit: '', label: '备选供应商' },
        { value: '60%', unit: '', label: '关键物料国产化' },
        { value: '18', unit: '月', label: '库存周转' },
      ],
      itemSchema: [
        { key: 'value', label: '数值', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'label', label: '标签', type: 'text' },
      ],
    },
    { key: 'footnoteLeft', label: '左页脚', type: 'text', inlineEditable: true, defaultValue: 'lemonPPT · 2026' },
    { key: 'footnoteRight', label: '右页脚', type: 'text', inlineEditable: true, defaultValue: '04' },
  ],
};

export function Theme07CoverSupplyStrategyV1(props: Theme07CoverSupplyStrategyV1Props): ReactNode {
  const { imageUrl, badge, hero, title, subtitle, kpis = [], footnoteLeft, footnoteRight, _slideIdx, _editable } = props;
  const validKpis = (kpis || []).filter((k): k is Theme07CoverSupplyStrategyV1Kpi => k != null).slice(0, 3);

  return (
    <div className="lp-slide lp-theme07 lp-theme07-cover-supply-strategy">
      <Theme07SlideBg imageUrl={imageUrl} slideIdx={_slideIdx} editable={_editable} />
      <Theme07DecoNodes />
      <Theme07WatermarkNumber number="04" />
      <div className="lp-theme07-cover-supply-strategy-center lp-rise">
        <Theme07IconChip name="globe" />
        {badge && <div className="lp-theme07-kicker">{badge}</div>}
        {hero && <div className="lp-theme07-cover-supply-strategy-hero">{hero}</div>}
        <EditableField prop="title" slideIdx={_slideIdx} editable={_editable} as="h1" className="lp-theme07-cover-title">{title}</EditableField>
        {subtitle && <EditableField prop="subtitle" slideIdx={_slideIdx} editable={_editable} as="p" className="lp-theme07-subtitle">{subtitle}</EditableField>}
      </div>
      {validKpis.length > 0 && (
        <div className="lp-theme07-cover-supply-strategy-kpis lp-rise">
          {validKpis.map((k, i) => (
            <div key={i} className="lp-theme07-card lp-theme07-cover-supply-strategy-kpi" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lp-theme07-card-value" style={{ fontSize: 'var(--lp-font-size-h2)' }}>
                <EditableField prop={`kpis.${i}.value`} slideIdx={_slideIdx} editable={_editable} as="span">{k.value || ''}</EditableField>
                {k.unit && <EditableField prop={`kpis.${i}.unit`} slideIdx={_slideIdx} editable={_editable} as="span">{k.unit}</EditableField>}
              </div>
              <div className="lp-theme07-card-label">{k.label || ''}</div>
            </div>
          ))}
        </div>
      )}
      <div className="lp-theme07-glow-line lp-rise" aria-hidden="true" />
      <div className="lp-theme07-footer">
        <span className="lp-theme07-footer-left">{footnoteLeft && <EditableField prop="footnoteLeft" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteLeft}</EditableField>}</span>
        <span className="lp-theme07-footer-right">{footnoteRight && <EditableField prop="footnoteRight" slideIdx={_slideIdx} editable={_editable} as="span">{footnoteRight}</EditableField>}</span>
      </div>
      <Theme07MiniBars count={22} />
    </div>
  );
}
