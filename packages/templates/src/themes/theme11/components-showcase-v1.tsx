// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme11 · 组件参考页（components_showcase_v1）
 * 情绪：daylight | 骨架：grid
 * 展示 Theme 11 设计系统：颜色、字体、卡片、图标与情绪渐变。
 */

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactNode } from 'react';
import { Card, Caption, GradientCard, IconChip, SectionTitle, Sheet, Tagline, type Theme11Mood } from './shared.js';

export interface Theme11ComponentsShowcaseV1Props {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  mood?: Theme11Mood;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme11ComponentsShowcaseV1Meta: LayoutMeta = {
  id: 'theme11_components_showcase_v1',
  theme: 'theme11',
  role: 'content',
  displayName: 'Theme 11 组件参考页',
  description: '展示颜色、字体、卡片、图标与情绪渐变的设计系统参考',
  needsMedia: false,
  tags: ['components', 'design-system', 'reference', 'light-stream'],
  contentShape: 'components-showcase',
};

export const theme11ComponentsShowcaseV1Schema: PropsSchema = {
  fields: [
    { key: 'eyebrow', label: '栏标', type: 'text', inlineEditable: true, defaultValue: 'DESIGN SYSTEM' },
    { key: 'title', label: '标题', type: 'textarea', inlineEditable: true, defaultValue: 'Theme 11\n流光科技' },
    { key: 'subtitle', label: '副标题', type: 'textarea', inlineEditable: true, defaultValue: '浅色扁平科技风：渐变、卡片、图标与字体层级一览。' },
    { key: 'mood', label: '情绪', type: 'select', options: [{ value: 'aurora', label: 'aurora' }, { value: 'daylight', label: 'daylight' }, { value: 'sunset', label: 'sunset' }], defaultValue: 'aurora' },
  ],
};

export function Theme11ComponentsShowcaseV1(props: Theme11ComponentsShowcaseV1Props): ReactNode {
  const { title = 'Theme 11\n流光科技', subtitle, eyebrow, mood = 'daylight' } = props;

  const colors = [
    { label: 'Cyan', value: '#00BCD4' },
    { label: 'Violet', value: '#7C4DFF' },
    { label: 'Blue', value: '#2979FF' },
    { label: 'Orange', value: '#FF9100' },
    { label: 'Green', value: '#00C853' },
    { label: 'Red', value: '#FF5252' },
  ];

  const moods: Theme11Mood[] = ['aurora', 'daylight', 'sunset'];

  return (
    <Sheet mood={mood} frame="grid" className="lp-theme11-components-showcase">
      <div className="lp-theme11-components-showcase-header">
        {eyebrow && <Tagline>{eyebrow}</Tagline>}
        <SectionTitle tone="accent">{title}</SectionTitle>
        {subtitle && <Caption className="lp-theme11-components-showcase-sub">{subtitle}</Caption>}
      </div>
      <div className="lp-theme11-components-showcase-grid">
        <Card className="lp-theme11-components-showcase-panel lp-rise" padding="medium">
          <h3 className="lp-theme11-components-showcase-panel-title">强调色板</h3>
          <div className="lp-theme11-components-showcase-colors">
            {colors.map((c, i) => (
              <div key={i} className="lp-theme11-components-showcase-color">
                <span className="lp-theme11-components-showcase-swatch" style={{ background: c.value }} />
                <span className="lp-theme11-components-showcase-color-label">{c.label}</span>
                <span className="lp-theme11-components-showcase-color-value">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lp-theme11-components-showcase-panel lp-rise" padding="medium">
          <h3 className="lp-theme11-components-showcase-panel-title">情绪渐变</h3>
          <div className="lp-theme11-components-showcase-moods">
            {moods.map((m, i) => (
              <div key={i} className="lp-theme11-components-showcase-mood">
                <span className={`lp-theme11-components-showcase-mood-swatch lp-theme11-components-showcase-mood--${m}`} />
                <span className="lp-theme11-components-showcase-mood-label">{m}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="lp-theme11-components-showcase-panel lp-rise" padding="medium">
          <h3 className="lp-theme11-components-showcase-panel-title">字体层级</h3>
          <div className="lp-theme11-components-showcase-type">
            <span className="lp-theme11-components-showcase-type-display">Display</span>
            <span className="lp-theme11-components-showcase-type-h1">Heading 1</span>
            <span className="lp-theme11-components-showcase-type-h2">Heading 2</span>
            <span className="lp-theme11-components-showcase-type-body">Body text for readable paragraphs.</span>
            <span className="lp-theme11-components-showcase-type-caption">Caption</span>
          </div>
        </Card>
        <div className="lp-theme11-components-showcase-chips lp-rise">
          <div className="lp-theme11-components-showcase-card-row">
            <GradientCard tone="blue" className="lp-theme11-components-showcase-card lp-rise">
              <span className="lp-theme11-components-showcase-card-label">GradientCard</span>
            </GradientCard>
            <Card className="lp-theme11-components-showcase-card lp-theme11-components-showcase-card-solid lp-rise">
              <span className="lp-theme11-components-showcase-card-label">Card</span>
            </Card>
          </div>
          <div className="lp-theme11-components-showcase-chip-row">
            <IconChip icon="◆" tone="cyan" />
            <IconChip icon="✦" tone="violet" />
            <IconChip icon="▸" tone="orange" />
          </div>
        </div>
      </div>
    </Sheet>
  );
}
