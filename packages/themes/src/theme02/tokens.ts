// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme02 设计 Token
 *
 * 整体风格：深色霓虹科技风
 * 视觉关键词：深色底、霓虹光晕、玻璃面板、科技发布会
 *
 * 支持双配色方案：
 * - scheme-a：电光青绿（#00e5b0 / #ffd166 / #00b4ff）
 * - scheme-b：靛蓝珊瑚（#6366f1 / #ff6b6b / #22d3ee）
 * 通过 data-scheme 属性切换 CSS 变量。
 */
export const theme02Tokens = {
  id: 'theme02',
  displayName: 'Theme 02',
  description: '深色霓虹科技风，电光青绿与靛蓝珊瑚双配色',
  colors: {
    // 文字
    ink: '#f0f4f8',
    ink2: 'rgba(240, 244, 248, 0.68)',
    ink3: 'rgba(240, 244, 248, 0.40)',
    textInverse: '#080a0e',

    // 强调色（默认 scheme-a）
    accent: '#00e5b0',
    accent2: '#ffd166',
    accentCool: '#00b4ff',

    // 图表配色板
    series: ['#00e5b0', '#ffd166', '#00b4ff', '#ff6b6b', '#a855f7', '#f472b6', '#22d3ee'],

    // 背景 / 表面
    background: '#080a0e',
    surface: 'rgba(255, 255, 255, 0.055)',
    surfaceStrong: 'rgba(255, 255, 255, 0.10)',
    surfaceSolid: '#0f1218',
    border: 'rgba(255, 255, 255, 0.10)',
    shadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
    shadowSmall: '0 8px 24px rgba(0, 0, 0, 0.35)',

    // 霓虹光晕
    glowA: 'rgba(0, 229, 176, 0.20)',
    glowB: 'rgba(0, 180, 255, 0.16)',
    glowC: 'rgba(255, 209, 102, 0.12)',
  },
  fonts: {
    heading: '"Space Grotesk", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    body: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    mono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
    en: '"Space Grotesk", "Space Mono", ui-monospace, monospace',
  },
  spacing: {
    pagePadding: '108px',
    sectionGap: '40px',
    elementGap: '20px',
    padTop: '92px',
    padBottom: '84px',
    cardPaddingLarge: '52px 60px',
    cardPaddingMedium: '32px 28px',
  },
  borderRadius: {
    small: '10px',
    medium: '16px',
    large: '24px',
  },
  fontSize: {
    display: '88px',
    displaySmall: '68px',
    h1: '58px',
    h2: '42px',
    h3: '32px',
    body: '22px',
    bodySmall: '17px',
    caption: '14px',
  },
  effect: {
    glassBlur: 'blur(28px) saturate(150%)',
    glassBorder: '1px solid rgba(255, 255, 255, 0.10)',
    riseDistance: '18px',
    riseDuration: '0.6s',
  },
} as const;
