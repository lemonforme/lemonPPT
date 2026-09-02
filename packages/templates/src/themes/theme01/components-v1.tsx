// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { LayoutMeta, PropsSchema } from '@lemonppt/core';
import type { ReactElement, ReactNode } from 'react';
import { Sheet, Masthead, Headline, Pill, Blob, DottedPattern, Ring, Plus, Slash } from './shared.js';

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
  description: 'Vivid Pop 视觉语汇总览：色彩、标签、聚焦、图表与装饰元素',
  needsMedia: false,
  tags: ['components', 'system', 'light', 'vivid-pop'],
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

const SWATCHES: Array<{ token: string; name: string; color: string }> = [
  { token: '--lp-red', name: '珊瑚红', color: 'var(--lp-red)' },
  { token: '--lp-amber', name: '琥珀黄', color: 'var(--lp-amber)' },
  { token: '--lp-green', name: '薄荷绿', color: 'var(--lp-green)' },
  { token: '--lp-cyan', name: '电光青', color: 'var(--lp-cyan)' },
  { token: '--lp-blue', name: '晴空蓝', color: 'var(--lp-blue)' },
  { token: '--lp-violet', name: '紫罗兰', color: 'var(--lp-violet)' },
  { token: '--lp-pink', name: '玫瑰粉', color: 'var(--lp-pink)' },
  { token: '--lp-orange', name: '活力橙', color: 'var(--lp-orange)' },
  { token: '--lp-lime', name: '柠檬绿', color: 'var(--lp-lime)' },
];

function Swatch({ token, name, color }: { token: string; name: string; color: string }): ReactElement {
  return (
    <div className="lp-components-swatch lp-rise">
      <span className="lp-components-swatch-chip" style={{ background: color }} aria-hidden="true" />
      <span className="lp-components-swatch-name">{name}</span>
      <span className="lp-components-swatch-token">{token}</span>
    </div>
  );
}

function MiniBars(): ReactElement {
  const heights = [38, 64, 52, 80, 46, 70];
  return (
    <svg viewBox="0 0 220 120" className="lp-components-mini-chart" role="img" aria-label="样本图表">
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
            fill={i % 2 === 0 ? 'var(--lp-red)' : 'var(--lp-blue)'}
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

      <div className="lp-components-head lp-rise">
        <Headline
          cn={title ?? 'Vivid Pop 设计系统'}
          en={subtitle ?? 'COLOR · TYPE · MOTION'}
          slideIdx={_slideIdx}
          editable={_editable}
          size="large"
        />
      </div>

      <div className="lp-components-grid">
        {/* 色板 */}
        <div className="lp-components-panel lp-components-panel--blue lp-rise" style={{ animationDelay: '60ms' }}>
          <div className="lp-components-panel-title">
            <Pill variant="outline" color="blue">Palette</Pill>
            主题色彩序列
          </div>
          <div className="lp-components-swatches">
            {SWATCHES.map((s) => (
              <Swatch key={s.token} token={s.token} name={s.name} color={s.color} />
            ))}
          </div>
        </div>

        {/* 标签与胶囊 */}
        <div className="lp-components-panel lp-components-panel--amber lp-rise" style={{ animationDelay: '120ms' }}>
          <div className="lp-components-panel-title">
            <Pill variant="outline" color="amber">Pill</Pill>
            标签与胶囊
          </div>
          <div className="lp-components-label-row">
            <Pill variant="outline" color="red">KEYWORD</Pill>
            <Pill variant="fill" color="blue">SOLID</Pill>
            <Pill variant="outline" color="green">Outline</Pill>
            <Pill variant="outline" color="violet">Tag</Pill>
          </div>
          <p className="lp-components-note">
            细边框胶囊与实心胶囊组合使用，为标题、章节与数据提供轻盈的层级标识。
          </p>
        </div>

        {/* 聚焦与色块 */}
        <div className="lp-components-panel lp-components-panel--green lp-rise" style={{ animationDelay: '180ms' }}>
          <div className="lp-components-panel-title">
            <Pill variant="outline" color="green">Highlight</Pill>
            聚焦与强调
          </div>
          <div className="lp-components-focus-row">
            <span className="lp-components-focus-block lp-components-focus-block--left">左聚焦色块</span>
            <span className="lp-components-focus-block lp-components-focus-block--right">右聚焦色块</span>
          </div>
          <p className="lp-components-note">
            通过半透明色块与圆角强调区组织信息，替代传统大卡片容器。
          </p>
        </div>

        {/* 样本图表 */}
        <div className="lp-components-panel lp-components-panel--red lp-rise" style={{ animationDelay: '240ms' }}>
          <div className="lp-components-panel-title">
            <Pill variant="outline" color="red">Chart</Pill>
            图表样本
          </div>
          <MiniBars />
          <p className="lp-components-note">
            所有版式图表经 <code>var(--lp-*)</code> 自动换色，与网页端、PPTX 端共用同一高饱和色序列。
          </p>
        </div>
      </div>

      <Blob
        className="lp-components-v1-blob"
        style={{ width: 360, height: 360, top: -140, right: -100, background: 'var(--lp-amber)', opacity: 0.12 }}
      />
      <DottedPattern
        className="lp-components-v1-dots"
        style={{ bottom: 70, left: 70, width: 200, height: 200, opacity: 0.18 }}
      />
      <Ring
        className="lp-components-v1-ring"
        style={{ width: 110, height: 110, top: 130, right: 90, borderColor: 'var(--lp-cyan)' }}
      />
      <Plus
        className="lp-components-v1-plus"
        style={{ bottom: 110, right: 120, width: 32, height: 32, color: 'var(--lp-red)' }}
      />
      <Slash
        className="lp-components-v1-slash"
        style={{ bottom: 140, left: 90, height: 70, background: 'var(--lp-violet)', opacity: 0.45 }}
      />
    </Sheet>
  );
}
