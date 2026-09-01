// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 特性网格页（feature_grid_v1）
 * 情绪：daylight | 骨架：grid
 * 顶部标题 + 2×3 特性卡片网格。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Caption, Card, EditableField, IconChip, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11FeatureGridV1Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  items?: { title: string; desc: string; icon: string }[];
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11FeatureGridV1Meta: LayoutMeta = {
  id: 'theme11_feature_grid_v1',
  theme: 'theme11',
  role: 'feature',
  displayName: 'Theme 11 特性网格页',
  description: '顶部标题 + 2×3 特性卡片网格',
  needsMedia: false,
  tags: ['feature', 'grid', 'light-stream'],
  contentShape: 'feature-grid',
};

export const theme11FeatureGridV1Schema: PropsSchema = {
  fields: [
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: '产品能力矩阵' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '覆盖从创意到交付的完整工作流' },
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'CAPABILITIES' },
    { key: 'items', label: '特性项', type: 'array', maxItems: 6, defaultValue: [
      { title: 'AI 生成', desc: '一句话生成完整大纲与版式。', icon: '✦' },
      { title: '智能配图', desc: '自动匹配图位与上传资产。', icon: '◉' },
      { title: '数据图表', desc: '40+ 图表一键渲染。', icon: '◈' },
      { title: '品牌规范', desc: '字体、颜色、圆角全局一致。', icon: '▣' },
      { title: '多人协作', desc: '实时同步与评论反馈。', icon: '◆' },
      { title: '多格式导出', desc: 'PPTX / PDF / 在线链接。', icon: '▸' },
    ], itemSchema: [{ key: 'title', label: '标题', type: 'text', inlineEditable: true }, { key: 'desc', label: '描述', type: 'textarea', inlineEditable: true }, { key: 'icon', label: '图标', type: 'text', inlineEditable: true, defaultValue: '◆' }] },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11FeatureGridV1(props: Theme11FeatureGridV1Props): ReactNode {
  const { title, subtitle, eyebrow, items = [], mood = 'daylight', _slideIdx: s, _editable: e } = props;
  const tones: Array<'blue' | 'violet' | 'orange' | 'green' | 'cyan'> = ['blue', 'violet', 'orange', 'green', 'cyan'];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-feature-grid">
      <div className="lp-theme11-feature-grid-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent"><EditableField prop="title" slideIdx={s} editable={e} as="span">{title}</EditableField></SectionTitle>
        {subtitle && <EditableField prop="subtitle" slideIdx={s} editable={e} as="p" className="lp-theme11-feature-grid-sub">{subtitle}</EditableField>}
      </div>
      <div className="lp-theme11-feature-grid-grid">
        {items.slice(0, 6).map((item, i) => (
          <Card key={i} className="lp-theme11-feature-grid-card lp-rise" padding="medium" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="lp-theme11-feature-grid-card-head">
              <IconChip icon={item.icon} tone={tones[i % tones.length]} />
            </div>
            <EditableField prop={`items.${i}.title`} slideIdx={s} editable={e} as="h3" className="lp-theme11-feature-grid-card-title">{item.title}</EditableField>
            <Caption><EditableField prop={`items.${i}.desc`} slideIdx={s} editable={e} as="span">{item.desc}</EditableField></Caption>
          </Card>
        ))}
      </div>
    </Sheet>
  );
}
