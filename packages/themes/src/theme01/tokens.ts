// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme01 设计 Token
 *
 * 整体风格：轻拟态 / 玻璃质感 / 柔和弥散渐变
 * 视觉关键词：浅色底、柔和光晕、玻璃卡片、大写英文装饰
 */
export const theme01Tokens = {
  id: 'theme01',
  displayName: 'Theme 01',
  description: '轻拟态玻璃质感，柔和弥散渐变背景',
  colors: {
    // 文字
    ink: '#2a2a30',
    ink2: '#56565c',
    ink3: '#9a9ba4',
    textInverse: '#ffffff',

    // 标签 / 强调色
    red: '#e15b4d',
    blue: '#5b9bd5',
    green: '#4caf8a',
    amber: '#e0a844',
    violet: '#7b6ad4',
    cyan: '#48a8c8',
    pink: '#d86aa3',
    series: ['#5b9bd5', '#4caf8a', '#e0a844', '#e15b4d', '#7b6ad4', '#48a8c8', '#d86aa3'],

    // 背景 / 表面
    background: '#f4f6f9',
    surface: 'rgba(255, 255, 255, 0.55)',
    surfaceStrong: 'rgba(255, 255, 255, 0.72)',
    surfaceSolid: '#ffffff',
    border: 'rgba(255, 255, 255, 0.72)',
    shadow: '0 24px 60px rgba(70, 72, 100, 0.13)',
    shadowSmall: '0 8px 24px rgba(70, 72, 100, 0.1)',

    // 弥散光晕（使用 CSS 变量覆盖）
    glowA: 'rgba(91, 155, 213, 0.22)',
    glowB: 'rgba(224, 168, 68, 0.18)',
    glowC: 'rgba(123, 106, 212, 0.16)',
  },
  fonts: {
    heading: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    body: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    mono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
    en: '"Space Mono", ui-monospace, monospace',
  },
  spacing: {
    pagePadding: '108px',
    sectionGap: '40px',
    elementGap: '16px',
    padTop: '92px',
    padBottom: '84px',
    cardPaddingLarge: '54px 64px',
    cardPaddingMedium: '34px 28px',
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px',
  },
  fontSize: {
    display: '92px',
    displaySmall: '72px',
    h1: '64px',
    h2: '48px',
    h3: '36px',
    body: '22px',
    bodySmall: '17px',
    caption: '14px',
  },
  effect: {
    glassBlur: 'blur(28px) saturate(140%)',
    glassBorder: '1px solid rgba(255, 255, 255, 0.72)',
    riseDistance: '14px',
    riseDuration: '0.55s',
  },
} as const;
