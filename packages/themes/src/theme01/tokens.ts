// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * theme01 设计 Token（Vivid Pop · 活力波普）
 *
 * 整体风格：轻盈活泼 / 信息图式布局 / 色块拼贴 / 明亮强调色 / 零玻璃 / 零大卡片
 * 视觉关键词：浅白浅灰底、明亮红/黄/青/蓝点睛、图标+彩色标题组、细边框胶囊、维恩圆、时间线
 */
export const theme01Tokens = {
  id: 'theme01',
  displayName: 'Theme 01',
  description: '活力波普，轻盈信息图式布局，明亮强调色与色块拼贴，无大卡片容器',
  colors: {
    // 文字
    ink: '#1F2937',
    ink2: '#6B7280',
    ink3: '#9CA3AF',
    textInverse: '#FFFFFF',

    // 强调色
    accent: '#EF4444',
    accent2: '#FBBF24',
    accent3: '#14B8A6',
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#14B8A6',
    amber: '#FBBF24',
    violet: '#8B5CF6',
    cyan: '#06B6D4',
    pink: '#F472B6',
    orange: '#FB923C',
    lime: '#A3E635',
    series: ['#EF4444', '#FBBF24', '#14B8A6', '#3B82F6', '#8B5CF6', '#06B6D4', '#F472B6', '#FB923C'],

    // 背景 / 表面
    background: '#FFFFFF',
    backgroundAlt: '#F3F4F6',
    backgroundGradientStart: '#FFFFFF',
    backgroundGradientEnd: '#FEF3C7',
    surface: '#FFFFFF',
    surfaceStrong: '#F3F4F6',
    surfaceSolid: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    border: 'rgba(31, 41, 55, 0.12)',
    borderStrong: 'rgba(31, 41, 55, 0.20)',
    shadow: '0 12px 32px rgba(31, 41, 55, 0.08)',
    shadowSmall: '0 4px 12px rgba(31, 41, 55, 0.06)',
    shadowMedium: '0 8px 24px rgba(31, 41, 55, 0.07)',
    shadowLarge: '0 16px 40px rgba(31, 41, 55, 0.09)',

    // 柔和彩色光晕（仅作点缀，不用于玻璃）
    glowA: 'rgba(239, 68, 68, 0.12)',
    glowB: 'rgba(251, 191, 36, 0.12)',
    glowC: 'rgba(20, 184, 166, 0.12)',
  },
  fonts: {
    heading: '"Nunito", "Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    body: '"Noto Sans SC", "PingFang SC", system-ui, sans-serif',
    mono: '"Space Mono", "JetBrains Mono", ui-monospace, monospace',
    en: '"Nunito", "Noto Sans SC", system-ui, sans-serif',
  },
  spacing: {
    pagePadding: '108px',
    sectionGap: '48px',
    elementGap: '20px',
    padTop: '92px',
    padBottom: '84px',
    cardPaddingLarge: '48px 56px',
    cardPaddingMedium: '32px 28px',
  },
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '28px',
    pill: '999px',
  },
  fontSize: {
    display: '96px',
    displaySmall: '76px',
    h1: '56px',
    h2: '40px',
    h3: '28px',
    body: '20px',
    bodySmall: '16px',
    caption: '13px',
  },
  effect: {
    riseDistance: '14px',
    riseDuration: '0.55s',
  },
} as const;
