// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { Sheet, Masthead, Folio, GlassCard, Headline, Label, Focus } from './shared.js';

export interface Theme01ComponentsV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  _slideIdx?: number;
  _editable?: boolean;
  [key: string]: unknown;
}

export const theme01ComponentsV1Meta: LayoutMeta = {
  id: 'theme01_components_v1',
  theme: 'theme01',
  role: 'content',
  displayName: 'Theme 01 设计系统',
  description: '暖炭暗色编辑风 · 组件与版式系统总览（基底 / 强调 / 标签 / 聚光 / 卡片 / 图表）',
  needsMedia: false,
  tags: ['components', 'system', 'dark', 'editorial'],
  contentShape: 'components',
};

export const theme01ComponentsV1Schema: PropsSchema = {
  fields: [
    {
      key: 'kicker',
      label: '标签',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'title',
      label: '标题',
      type: 'text',
      inlineEditable: true,
    },
    {
      key: 'subtitle',
      label: '副标题',
      type: 'text',
      inlineEditable: true,
    },
  ],
};

const SWATCHES: Array<{ token: string; name: string }> = [
  { token: '--lp-accent', name: '陶土 Terracotta' },
  { token: '--lp-blue', name: '岩蓝 Slate' },
  { token: '--lp-green', name: '鼠尾草 Sage' },
  { token: '--lp-amber', name: '黄铜 Brass' },
  { token: '--lp-violet', name: '梅紫 Plum' },
  { token: '--lp-pink', name: '陶玫瑰 Rose' },
  { token: '--lp-cyan', name: '青 Teal' },
  { token: '--lp-orange', name: '焦橙 Ember' },
  { token: '--lp-lime', name: '橄榄 Olive' },
];

function Swatch({ token, name }: { token: string; name: string }): ReactElement {
  return (
    <div className="lp-components-swatch">
      <span className="lp-components-swatch-chip" style={{ background: `var(${token})` }} />
      <span className="lp-components-swatch-name">{name}</span>
      <span className="lp-components-swatch-token">{token}</span>
    </div>
  );
}

function MiniBars(): ReactElement {
  const heights = [38, 64, 52, 80, 46, 70];
  return (
    <svg viewBox="0 0 220 120" className="lp-components-mini-chart" role="img" aria-label="样本图表">
      <defs>
        <linearGradient id="lp-comp-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--lp-accent)" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {heights.map((h, i) => {
        const w = 22;
        const x = 12 + i * (w + 12);
        const y = 110 - h;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            rx={5}
            fill={i % 2 === 0 ? 'var(--lp-accent)' : 'var(--lp-blue)'}
            opacity={0.9}
          />
        );
      })}
    </svg>
  );
}

export function Theme01ComponentsV1(props: Theme01ComponentsV1Props): ReactNode {
  const { kicker, title, subtitle, _slideIdx, _editable } = props;

  return (
    <Sheet substrate="light" frame="grid" className="lp-components-v1">
      <Masthead section={kicker} sectionEn="DESIGN SYSTEM" slideIdx={_slideIdx} editable={_editable} />

      <div className="lp-components-head">
        <Headline
          cn={title ?? '暖炭暗色编辑风'}
          en={subtitle ?? 'ESPRESSO EDITORIAL'}
          slideIdx={_slideIdx}
          editable={_editable}
          size="large"
        />
      </div>

      <div className="lp-components-grid">
        {/* 色板 */}
        <GlassCard className="lp-components-panel lp-components-palette">
          <div className="lp-components-panel-title">
            <Label kind="keyword">Palette</Label> 数据色序列
          </div>
          <div className="lp-components-swatches">
            {SWATCHES.map((s) => (
              <Swatch key={s.token} token={s.token} name={s.name} />
            ))}
          </div>
        </GlassCard>

        {/* 标签三型 */}
        <GlassCard className="lp-components-panel">
          <div className="lp-components-panel-title">
            <Label kind="keyword">Label</Label> 标签三型
          </div>
          <div className="lp-components-label-row">
            <Label kind="number">01</Label>
            <Label kind="symbol">◆</Label>
            <Label kind="keyword">KEYWORD</Label>
          </div>
          <p className="lp-components-note">
            对齐 theme09「标签类型三选一」方法论：数字编号 / 符号标记 / 关键词标签，统一陶土·奶油编辑语汇。
          </p>
        </GlassCard>

        {/* 聚光切换 */}
        <GlassCard className="lp-components-panel">
          <div className="lp-components-panel-title">
            <Label kind="keyword">Focus</Label> 聚光切换
          </div>
          <Focus side="left" className="lp-components-focus-demo">
            <span className="lp-components-focus-text">左聚焦 · 聚光晕偏左</span>
          </Focus>
          <Focus side="right" className="lp-components-focus-demo">
            <span className="lp-components-focus-text">右聚焦 · 聚光晕偏右</span>
          </Focus>
        </GlassCard>

        {/* 样本图表 */}
        <GlassCard className="lp-components-panel">
          <div className="lp-components-panel-title">
            <Label kind="keyword">Chart</Label> 图表样本
          </div>
          <MiniBars />
          <p className="lp-components-note">
            所有版式图表经 <code>var(--lp-*)</code> 自动换色，与网页端、PPTX 端共用同一大地色序列。
          </p>
        </GlassCard>
      </div>

      <Folio
        left={kicker}
        page="SYSTEM"
        right="theme01 · espresso"
        slideIdx={_slideIdx}
        editable={_editable}
      />
    </Sheet>
  );
}
