// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · PEST 分析页（pest_v1）
 * 情绪：daylight | 骨架：grid
 * 四大因素纵向卡片，顶部字母标识 + 错落高度。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11PestV1Factor {
  letter: string;
  name: string;
  items: string[];
}

export interface Theme11PestV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  factors?: Theme11PestV1Factor[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11PestV1Meta: LayoutMeta = {
  id: 'theme11_pest_v1',
  theme: 'theme11',
  role: 'pest',
  displayName: 'Theme 11 PEST 分析页',
  description: '四大因素纵向卡片 + 顶部字母标识',
  needsMedia: false,
  tags: ['pest', 'analysis', 'grid', 'light-stream'],
  contentShape: '4-column',
};

export const theme11PestV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: 'PEST 环境扫描' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '宏观环境对业务的潜在影响' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'PEST' },
    {
      key: 'factors',
      label: '因素',
      type: 'array',
      maxItems: 4,
      defaultValue: [
        { letter: 'P', name: '政策', items: ['数据安全法规', '行业监管趋严', '扶持政策出台'] },
        { letter: 'E', name: '经济', items: ['企业 IT 预算收紧', 'SaaS 渗透率提升', '汇率波动'] },
        { letter: 'S', name: '社会', items: ['远程办公常态化', 'AI 接受度提高', '人才竞争激烈'] },
        { letter: 'T', name: '技术', items: ['大模型能力跃升', '多模态交互成熟', '算力成本下降'] },
      ],
      itemSchema: [
        { key: 'letter', label: '字母', type: 'text' },
        { key: 'name', label: '名称', type: 'text' },
        { key: 'items', label: '条目', type: 'array', maxItems: 5, itemSchema: [{ key: 'text', label: '条目', type: 'text' }] },
      ],
    },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

export function Theme11PestV1(props: Theme11PestV1Props): ReactNode {
  const { title, subtitle, eyebrow, factors = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const validFactors = (factors || []).filter((n): n is Theme11PestV1Factor => n != null).slice(0, 4);

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-pest">
      <div className="lp-theme11-pest-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="violet"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-pest-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-pest-grid">
        {validFactors.map((factor, i) => (
          <Card key={i} className={`lp-theme11-pest-card lp-rise lp-theme11-tile-tone-${tones[i % tones.length]}`} padding="medium" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="lp-theme11-pest-letter">
              <EditableField prop={`factors.${i}.letter`} slideIdx={s} editable={e} as="span">{factor.letter}</EditableField>
            </div>
            <EditableField prop={`factors.${i}.name`} slideIdx={s} editable={e} as="h3" className="lp-theme11-pest-name">{factor.name}</EditableField>
            <ul className="lp-theme11-pest-list">
              {(factor.items || []).slice(0, 5).map((item, j) => (
                <li key={j}>
                  <EditableField prop={`factors.${i}.items.${j}`} slideIdx={s} editable={e} as="span">{item}</EditableField>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
