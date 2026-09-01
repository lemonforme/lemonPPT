// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 合作伙伴页（partners_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + Logo 卡片墙。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11PartnersV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  partners?: { name: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11PartnersV1Meta: LayoutMeta = {
  id: 'theme11_partners_v1',
  theme: 'theme11',
  role: 'partners',
  displayName: 'Theme 11 合作伙伴页',
  description: '顶部标题 + Logo 卡片墙',
  needsMedia: false,
  tags: ['partners', 'grid', 'light-stream'],
  contentShape: 'partners',
};

export const theme11PartnersV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '合作伙伴' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '他们与我们一起推动演示体验升级' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PARTNERS' },
    { key: 'partners', label: '伙伴', type: 'array', maxItems: 8, defaultValue: [{ name: 'Partner A' }, { name: 'Partner B' }, { name: 'Partner C' }, { name: 'Partner D' }, { name: 'Partner E' }, { name: 'Partner F' }], itemSchema: [{ key: 'name', label: '名称', type: 'text', inlineEditable: true }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11PartnersV1(props: Theme11PartnersV1Props): ReactNode {
  const { title, subtitle, eyebrow, partners = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-partners">
      <div className="lp-theme11-partners-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-partners-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-partners-grid">
        {partners.slice(0, 8).map((p, i) => (
          <Card key={i} className="lp-theme11-partner-card lp-rise" padding="medium" style={{ animationDelay: `${i * 50}ms` }}>
            <EditableField prop={`partners.${i}.name`} slideIdx={s} editable={e} as="span">{p.name}</EditableField>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
