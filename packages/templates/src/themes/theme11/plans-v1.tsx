// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 方案对比页（plans_v1）
 * 情绪：daylight | 骨架：split
 * 左侧倾斜图片 + 右侧错落方案卡片。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, EditorialPhoto, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11PlansV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  imageUrl?: string;
  plans?: { name: string; values: string[] }[];
  rows?: string[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11PlansV1Meta: LayoutMeta = {
  id: 'theme11_plans_v1',
  theme: 'theme11',
  role: 'comparison',
  displayName: 'Theme 11 方案对比页',
  description: '左侧倾斜图片 + 右侧错落方案卡片',
  needsMedia: true,
  tags: ['comparison', 'plans', 'split', 'light-stream'],
  contentShape: 'plans',
};

export const theme11PlansV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '版本对比' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '一眼看清各版本能力差异' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PLANS' },
    { key: 'imageUrl', label: '主图', type: 'image', defaultValue: '' },
    { key: 'rows', label: '对比项', type: 'array', maxItems: 4, defaultValue: ['项目数量', '主题数', '协作人数', '导出格式'], itemSchema: [{ key: 'item', label: '项目', type: 'text', inlineEditable: true }] },
    { key: 'plans', label: '方案', type: 'array', maxItems: 3, defaultValue: [
      { name: '免费版', values: ['5', '10', '1', 'PPTX'] },
      { name: '团队版', values: ['无限', '全部', '50', 'PPTX/PDF'] },
      { name: '企业版', values: ['无限', '全部', '无限', '全格式'] },
    ], itemSchema: [{ key: 'name', label: '名称', type: 'text', inlineEditable: true }, { key: 'values', label: '值', type: 'array', maxItems: 4, itemSchema: [{ key: 'item', label: '值', type: 'text', inlineEditable: true }] }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11PlansV1(props: Theme11PlansV1Props): ReactNode {
  const { title, subtitle, eyebrow, imageUrl, plans = [], rows = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange'> = ['blue', 'violet', 'orange'];

  return (
    <Sheet mood={mood} frame="split" className="lp-theme11-plans">
      <div className="lp-theme11-plans-left">
        <div className="lp-theme11-plans-left-text">
          {eyebrow && <Tagline>{eyebrow}</Tagline>}
          <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
          {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-plans-sub">{subtitle}</EditableField>}
        </div>
        <div className="lp-theme11-plans-image-frame">
          <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} alt="方案图" className="lp-theme11-plans-image" placeholderClassName="lp-theme11-plans-image-placeholder" />
        </div>
      </div>
      <div className="lp-theme11-plans-deck">
        {plans.slice(0, 3).map((plan, i) => (
          <Card key={i} className={`lp-theme11-plans-card lp-theme11-tile-tone-${tones[i % tones.length]} lp-rise`} padding="medium" style={{ animationDelay: `${i * 70}ms` }}>
            <EditableField prop={`plans.${i}.name`} slideIdx={s} editable={e} as="h3" className="lp-theme11-plans-name">{plan.name}</EditableField>
            <div className="lp-theme11-plans-rows">
              {rows.slice(0, 4).map((row, j) => (
                <div key={j} className="lp-theme11-plans-row">
                  <span className="lp-theme11-plans-row-label">{row}</span>
                  <EditableField prop={`plans.${i}.values.${j}`} slideIdx={s} editable={e} as="span" className="lp-theme11-plans-row-value">{(plan.values ?? [])[j] ?? '-'}</EditableField>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
