// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { getTheme09Tokens, type Theme09Substrate } from './tokens.js';

export interface T9ChartColors {
  substrate: Theme09Substrate;
  ink: string;
  ink2: string;
  ink3: string;
  accent: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accent5: string;
  accent6: string;
  series: string[];
  rule: string;
  ruleStrong: string;
  divider: string;
  surface: string;
  surfaceSolid: string;
  surfaceStrong: string;
  border: string;
  borderStrong: string;
  onAccent: string;
  font: string;
  fontHeading: string;
  fontMono: string;
  isInk: boolean;
}

/** 按基底返回一组具体色值，供 echarts option 直接使用（不依赖 CSS 变量解析）。 */
export function t9ChartColors(substrate: Theme09Substrate = 'paper'): T9ChartColors {
  const t = getTheme09Tokens(substrate, 'primary');
  const c = t.colors;
  return {
    substrate,
    ink: c.ink,
    ink2: c.ink2,
    ink3: c.ink3,
    accent: c.accent,
    accent2: c.accent2,
    accent3: c.amber,
    accent4: c.teal,
    accent5: c.violet,
    accent6: c.orange,
    series: [...c.series],
    rule: c.rule,
    ruleStrong: c.ruleStrong,
    divider: c.rule,
    surface: c.surface,
    surfaceSolid: c.surfaceSolid,
    surfaceStrong: c.surfaceStrong,
    border: c.border,
    borderStrong: c.borderStrong,
    onAccent: substrate === 'ink' ? '#14161C' : '#FFFFFF',
    font: t.fonts.body,
    fontHeading: t.fonts.heading,
    fontMono: t.fonts.mono,
    isInk: substrate === 'ink',
  };
}

export function t9ParseNumber(v?: string | number): number {
  if (typeof v === 'number') return v;
  return parseFloat(String(v ?? '0').replace(/[, ]/g, '')) || 0;
}

/** 千分位 / 紧凑数字格式化（用于图表标签与刻度）。 */
export function t9FormatNumber(v: number, compact = false): string {
  if (compact) {
    const abs = Math.abs(v);
    if (abs >= 1e8) return `${(v / 1e8).toFixed(1)}亿`;
    if (abs >= 1e4) return `${(v / 1e4).toFixed(1)}万`;
    if (abs >= 1e3) return `${(v / 1e3).toFixed(1)}k`;
  }
  return v.toLocaleString('en-US');
}

/** 通用坐标轴文字样式（按基底取色）。 */
export function t9AxisLabel(colors: T9ChartColors, fontSize = 13): Record<string, unknown> {
  return {
    color: colors.ink2,
    fontFamily: colors.font,
    fontSize,
  };
}

export function t9Grid(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return { top: 36, right: 24, bottom: 40, left: 48, containLabel: true, ...overrides };
}

export function t9SplitLine(colors: T9ChartColors): Record<string, unknown> {
  return {
    lineStyle: {
      color: colors.divider,
      opacity: 0.7,
    },
  };
}

/** 将 #RRGGBB 转为 rgba 字符串（供 echarts 半透明填充 / 描边）。 */
export function t9Rgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 返回与 theme09 墨/纸基底匹配的 echarts tooltip 配置。
 * 墨底用深色气泡，纸底用浅色气泡，避免默认白底在墨底上刺眼。
 */
export function t9Tooltip(c: T9ChartColors, extra: Record<string, unknown> = {}): Record<string, unknown> {
  const bg = c.isInk ? 'rgba(20,22,28,0.92)' : 'rgba(255,255,255,0.94)';
  const textColor = c.isInk ? '#E8E6E3' : '#1a1a1a';
  const borderColor = c.isInk ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  return {
    trigger: 'item' as const,
    backgroundColor: bg,
    borderColor,
    borderWidth: 1,
    padding: [8, 12],
    textStyle: { color: textColor, fontSize: 13, fontFamily: c.font },
    ...extra,
  };
}

/* ═══════════════════════════════════════════════════════════════
 * 图表视觉美化 helper（V2 · 杂志印刷风）
 * ═══════════════════════════════════════════════════════════════ */

/**
 * 统一图例样式 —— 杂志风：圆角矩形 icon、细间距、衬线/无衬线混排。
 */
export function t9Legend(
  c: T9ChartColors,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    top: 4,
    right: 8,
    icon: 'roundRect',
    itemWidth: 14,
    itemHeight: 5,
    itemGap: 18,
    textStyle: {
      color: c.ink2,
      fontFamily: c.font,
      fontSize: 12,
    },
    ...overrides,
  };
}

/**
 * 数据标签（label）基础样式。
 * 用于柱状/折线/散点等 series 的 label 配置。
 */
export function t9DataLabel(
  c: T9ChartColors,
  position: string = 'top',
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    show: true,
    position,
    color: c.ink2,
    fontFamily: c.fontMono,
    fontSize: 11,
    fontWeight: 500 as number | string,
    ...overrides,
  };
}

/**
 * 柱状图圆角 + 渐变 itemStyle。
 * 返回可直接嵌入 series.itemStyle 的配置对象。
 *
 * @param color 主色（#RRGGBB）
 * @param substrate 基底，影响渐变方向和透明度
 * @param radius 圆角半径数组 [tl,tr,br,bl]
 */
export function t9BarItemStyle(
  color: string,
  substrate: Theme09Substrate = 'paper',
  radius: [number, number, number, number] = [3, 3, 0, 0],
): Record<string, unknown> {
  const light = substrate === 'ink';
  return {
    color: {
      type: 'linear' as const,
      x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: t9Rgba(color, light ? 0.95 : 0.88) },
        { offset: 1, color: t9Rgba(color, light ? 0.72 : 0.58) },
      ],
    },
    borderRadius: radius,
    borderColor: 'none',
  };
}

/** 面积图区域渐变（从实色到透明）。 */
export function t9AreaStyle(
  color: string,
  _substrate: Theme09Substrate = 'paper',
): Record<string, unknown> {
  return {
    color: {
      type: 'linear' as const,
      x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [
        { offset: 0, color: t9Rgba(color, 0.35) },
        { offset: 1, color: t9Rgba(color, 0.03) },
      ],
    },
  };
}

/** 雷达图区域半透明填充。 */
export function t9RadarAreaStyle(
  color: string,
  opacity = 0.18,
): Record<string, unknown> {
  return {
    areaStyle: { color: t9Rgba(color, opacity) },
    lineStyle: { color, width: 2, cap: 'round' as const },
  };
}

/**
 * 杂志风格动画配置：
 * - 无入场动画（静态印刷品感）
 * - emphasis 用 200ms 缓出过渡
 */
export function t9Animation(): Record<string, unknown> {
  return {
    delay: (idx: number) => idx * 40,
    duration: 600,
    easing: 'cubicOut' as string,
  };
}

/** emphasis 状态统一样式（轻微放大 + 阴影提升）。 */
export function t9Emphasis(
  c: T9ChartColors,
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    focus: 'series' as const,
    itemStyle: {
      shadowBlur: 8,
      shadowColor: t9Rgba(c.ink, 0.25),
    },
    ...overrides,
  };
}
