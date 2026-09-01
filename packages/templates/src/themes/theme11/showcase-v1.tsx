// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 产品展示页（showcase_v1）
 * 情绪：daylight | 骨架：full-bleed
 * 满版产品截图+悬浮特性亮点卡片，突出产品视觉冲击力。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, EditableField, EditorialPhoto, IconChip, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11ShowcaseV1Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface Theme11ShowcaseV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  caption?: string;
  features?: Theme11ShowcaseV1Feature[];
  footnote?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ShowcaseV1Meta: LayoutMeta = {
  id: 'theme11_showcase_v1',
  theme: 'theme11',
  role: 'image',
  displayName: 'Theme 11 产品展示页',
  description: '满版产品截图+悬浮特性亮点卡片',
  needsMedia: true,
  mediaSlots: [{ name: '产品截图', fieldPath: 'imageUrl', canPresetMedia: true }],
  tags: ['showcase', 'product', 'light-stream'],
  contentShape: 'product-showcase',
};

export const theme11ShowcaseV1Schema: PropsSchema = {
  fields: [
    { key: 'kicker', label: '顶部标签', type: 'text', inlineEditable: true, defaultValue: 'PRODUCT SHOWCASE' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '一站式 AI 演示工作台' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '从大纲、视觉到导出，全程智能辅助。' },
    { key: 'imageUrl', label: '产品截图', type: 'image', defaultValue: '' },
    { key: 'caption', label: '图注', type: 'textarea', inlineEditable: true, defaultValue: 'lemonPPT 编辑器界面' },
    {
      key: 'features',
      label: '特性亮点',
      type: 'array',
      maxItems: 4,
      defaultValue: [
        { title: '智能排版', description: '一句话生成多页版式', icon: '◈' },
        { title: '数据图表', description: '自动匹配图表类型与配色', icon: '▣' },
        { title: '品牌规范', description: '主题系统保证输出一致', icon: '◎' },
        { title: '多端导出', description: 'PPTX / PDF / 网页一键分发', icon: '✦' },
      ],
      itemSchema: [
        { key: 'title', label: '标题', type: 'text' },
        { key: 'description', label: '说明', type: 'textarea' },
        { key: 'icon', label: '图标', type: 'text' },
      ],
    },
    { key: 'footnote', label: '脚注', type: 'text', inlineEditable: true, defaultValue: '数据来源：lemonPPT 产品白皮书 · 2026' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'daylight' },
  ],
};

const tones: Array<'blue' | 'violet' | 'orange' | 'green'> = ['blue', 'violet', 'orange', 'green'];

export function Theme11ShowcaseV1(props: Theme11ShowcaseV1Props): ReactNode {
  const { kicker, title, subtitle, imageUrl, caption, features = [], footnote, mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const validFeatures = (features || []).filter((f): f is Theme11ShowcaseV1Feature => f != null).slice(0, 4);

  return (
    <Sheet mood={mood} frame="full-bleed" className="lp-theme11-showcase">
      <div className="lp-theme11-showcase-head lp-rise">
        {kicker && <Tagline>{kicker}</Tagline>}
        <h2 className="lp-theme11-showcase-title"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></h2>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-showcase-sub">{subtitle}</EditableField>}
      </div>

      <div className="lp-theme11-showcase-stage lp-rise">
        <div className="lp-theme11-showcase-frame">
          <EditorialPhoto prop="imageUrl" src={imageUrl} slideIdx={s} editable={e} alt="产品截图" className="lp-theme11-showcase-image" placeholderClassName="lp-theme11-showcase-image-placeholder" />
          {caption && <EditableField prop="caption" slideIdx={s} editable={e} as="div" className="lp-theme11-showcase-caption">{caption}</EditableField>}
        </div>
        <div className="lp-theme11-showcase-features">
          {validFeatures.map((f, i) => (
            <Card key={i} className={`lp-theme11-showcase-feature lp-rise lp-theme11-tile-tone-${tones[i % tones.length]}`} padding="medium" style={{ animationDelay: `${i * 80}ms` }}>
              {f.icon && <IconChip icon={f.icon} tone={tones[i % tones.length]} className="lp-theme11-showcase-feature-icon" />}
              <div>
                <EditableField prop={`features.${i}.title`} slideIdx={s} editable={e} as="h4" className="lp-theme11-showcase-feature-title">{f.title}</EditableField>
                <EditableField prop={`features.${i}.description`} slideIdx={s} editable={e} as="p" className="lp-theme11-showcase-feature-desc">{f.description}</EditableField>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {footnote && <EditableField prop="footnote" slideIdx={s} editable={e} as="div" className="lp-theme11-showcase-footnote lp-rise">{footnote}</EditableField>}
    </Sheet>
  );
}
