// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { DeckGoal, Slide as CoreSlide } from '@lemonppt/core';
import { normalizeDeckGoal } from '@lemonppt/core';
import PptxGenJS, { type Slide as PptxSlide } from 'pptxgenjs';
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { configureTheme08, registerTheme08Renderers } from './theme08-pptx.js';
import { configureTheme09, registerTheme09Renderers } from './theme09-pptx.js';
import { configureTheme10, registerTheme10Renderers } from './theme10-pptx.js';
import { configureTheme11, registerTheme11Renderers } from './theme11-pptx.js';
import { registerTheme01Renderers, cleanupTheme01TempImages } from './theme01-pptx.js';
// 重新导出 theme01 通用渲染器，供 theme02-pptx.ts 等复用，避免 theme02→theme01→export-pptx 的循环依赖。
export { renderChartV1, renderContentV1, renderCoverV1, renderClosing, renderComparisonV1 } from './theme01-pptx.js';
import { registerTheme02Renderers } from './theme02-pptx.js';
import { registerTheme03Renderers } from './theme03-pptx.js';
import { registerTheme04Renderers } from './theme04-pptx.js';
import { registerTheme05Renderers } from './theme05-pptx.js';
import { registerTheme06Renderers } from './theme06-pptx.js';
import { registerTheme07Renderers } from './theme07-pptx.js';
import { renderTheme07SectorV1, renderTheme07TableV1 } from './theme07-pptx.js';
import { renderTheme06Bento, renderTheme06BigNumber, renderTheme06Case, renderTheme06ChainFlow, renderTheme06Chapter, renderTheme06Closing, renderTheme06CompanyProfile, renderTheme06CompanySpotlight, renderTheme06Comparison, renderTheme06ContentNumbered, renderTheme06Cover, renderTheme06CoverVariant, renderTheme06DealMap, renderTheme06ListBased, renderTheme06Matrix, renderTheme06MetricShowcase, renderTheme06Milestone, renderTheme06Process, renderTheme06Quote, renderTheme06Rank, renderTheme06RiskMatrix, renderTheme06SectorSpotlight, renderTheme06Sources, renderTheme06Statement, renderTheme06Summary, renderTheme06TechLandscape, renderTheme06Timeline, renderTheme06Toc, renderTheme06Triad } from './theme06-pptx.js';

// Load theme snapshot for PPTX export colors and gradients
// Use ESM-compatible path resolution
const _currentDir = path.dirname(fileURLToPath(import.meta.url));

function loadThemeSnapshot(): Record<string, any> {
  const possiblePaths = [
    path.resolve(_currentDir, 'theme-snapshot.json'),
    path.resolve(_currentDir, '../src/theme-snapshot.json'),
    path.resolve(_currentDir, '../theme-snapshot.json'),
  ];
  
  for (const snapshotPath of possiblePaths) {
    try {
      const content = readFileSync(snapshotPath, 'utf-8');
      console.log(`Loading theme snapshot from: ${snapshotPath}`);
      return JSON.parse(content);
    } catch {
      // Continue to next path
    }
  }
  
  console.warn('Warning: theme-snapshot.json not found in any location, using default theme configs');
  return {};
}
const THEME_SNAPSHOT = loadThemeSnapshot();

// Load layout coordinates for PPTX export
function loadLayoutCoordinates(): Record<string, any> {
  const possiblePaths = [
    path.resolve(_currentDir, 'pptx-layout-coordinates.json'),
    path.resolve(_currentDir, '../src/pptx-layout-coordinates.json'),
    path.resolve(_currentDir, '../pptx-layout-coordinates.json'),
  ];
  
  for (const coordPath of possiblePaths) {
    try {
      const content = readFileSync(coordPath, 'utf-8');
      console.log(`Loading layout coordinates from: ${coordPath}`);
      return JSON.parse(content);
    } catch {
      // Continue to next path
    }
  }
  
  console.warn('Warning: pptx-layout-coordinates.json not found, using default coordinates');
  return {};
}
const LAYOUT_COORDINATES = loadLayoutCoordinates();

// Load theme06-specific layout coordinates
function loadTheme06LayoutCoordinates(): Record<string, any> {
  const possiblePaths = [
    path.resolve(_currentDir, 'theme06-layout-coordinates.json'),
    path.resolve(_currentDir, '../src/theme06-layout-coordinates.json'),
    path.resolve(_currentDir, '../theme06-layout-coordinates.json'),
  ];
  
  for (const coordPath of possiblePaths) {
    try {
      const content = readFileSync(coordPath, 'utf-8');
      console.log(`Loading theme06 layout coordinates from: ${coordPath}`);
      return JSON.parse(content);
    } catch {
      // Continue to next path
    }
  }
  
  console.warn('Warning: theme06-layout-coordinates.json not found');
  return {};
}
const THEME06_LAYOUT_COORDINATES = loadTheme06LayoutCoordinates();

// Load theme07-specific layout coordinates (v2 coordinate system)
function loadTheme07LayoutCoordinates(): Record<string, any> {
  const possiblePaths = [
    path.resolve(_currentDir, 'theme07-layout-coordinates.json'),
    path.resolve(_currentDir, '../src/theme07-layout-coordinates.json'),
    path.resolve(_currentDir, '../theme07-layout-coordinates.json'),
  ];

  for (const coordPath of possiblePaths) {
    try {
      const content = readFileSync(coordPath, 'utf-8');
      console.log(`Loading theme07 layout coordinates from: ${coordPath}`);
      return JSON.parse(content);
    } catch {
      // Continue to next path
    }
  }

  console.warn('Warning: theme07-layout-coordinates.json not found');
  return {};
}
const THEME07_LAYOUT_COORDINATES = loadTheme07LayoutCoordinates();

// Load theme08-specific layout coordinates
function loadTheme08LayoutCoordinates(): Record<string, any> {
  const possiblePaths = [
    path.resolve(_currentDir, 'theme08-layout-coordinates.json'),
    path.resolve(_currentDir, '../src/theme08-layout-coordinates.json'),
    path.resolve(_currentDir, '../theme08-layout-coordinates.json'),
  ];

  for (const coordPath of possiblePaths) {
    try {
      const content = readFileSync(coordPath, 'utf-8');
      console.log(`Loading theme08 layout coordinates from: ${coordPath}`);
      return JSON.parse(content);
    } catch {
      // Continue to next path
    }
  }

  console.warn('Warning: theme08-layout-coordinates.json not found');
  return {};
}
const THEME08_LAYOUT_COORDINATES = loadTheme08LayoutCoordinates();

// Layout coordinate system helpers
interface PptxElementConfig {
  x: number;
  y: number;
  w?: number;
  h?: number;
  fontSize?: number;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
}

/** Convert CSS layout ID to coordinate config key */
function normalizeLayoutId(layoutId: string): string {
  // theme01_cover_v1 -> cover_v1
  const parts = layoutId.split('_');
  // Find the layout role (cover, toc, metric, stats, chart, content, comparison, timeline, table)
  const roles = ['cover', 'toc', 'metric', 'stats', 'chart', 'content', 'comparison', 'timeline', 'table', 'chapter', 'closing', 'quote', 'feature', 'gallery', 'image', 'team', 'pricing', 'faq', 'roadmap', 'process', 'quadrant', 'matrix', 'bento', 'risk', 'trend', 'scorecard', 'outlook', 'statement', 'conclusion'];
  for (const role of roles) {
    if (layoutId.includes(role)) {
      const version = parts[parts.length - 1] || 'v1';
      return `${role}_${version}`;
    }
  }
  return 'default';
}

/** Get layout coordinates by layout ID */
export function getLayoutCoordinates(layoutId: string): Record<string, any> {
  // First check theme-specific coordinates (e.g., theme06_cover_v1)
  const themeId = layoutId.split('_')[0] + '_' + layoutId.split('_')[1]; // e.g., "theme06"
  if (themeId === 'theme06') {
    const theme06Layouts = THEME06_LAYOUT_COORDINATES.layouts as Record<string, any> | undefined;
    if (theme06Layouts && theme06Layouts[layoutId]) {
      return { ...theme06Layouts[layoutId], _themeSpecific: true };
    }
  }
  if (themeId === 'theme07') {
    const theme07Layouts = THEME07_LAYOUT_COORDINATES.layouts as Record<string, any> | undefined;
    if (theme07Layouts && theme07Layouts[layoutId]) {
      return { ...theme07Layouts[layoutId], _themeSpecific: true };
    }
  }
  if (themeId === 'theme08') {
    const theme08Layouts = THEME08_LAYOUT_COORDINATES.layouts as Record<string, any> | undefined;
    if (theme08Layouts && theme08Layouts[layoutId]) {
      return { ...theme08Layouts[layoutId], _themeSpecific: true };
    }
  }
  
  // Then check generic coordinates
  const normalizedId = normalizeLayoutId(layoutId);
  const layouts = LAYOUT_COORDINATES.layouts as Record<string, any> | undefined;
  if (layouts && layouts[normalizedId]) {
    return layouts[normalizedId];
  }
  // Fallback: try broader match (just the role without version)
  if (layouts) {
    for (const [key, value] of Object.entries(layouts)) {
      const roleKey = key.split('_')[0];
      if (normalizedId.startsWith(roleKey)) {
        return value as Record<string, any>;
      }
    }
  }
  return {};
}

export interface PptxExportOptions {
  outFile: string;
  title?: string;
  subject?: string;
  author?: string;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  white: string;
  light: string;
  border: string;
  borderStrong?: string;
  surface: string;
  surfaceSolid?: string;
  surfaceElevated: string;
  accent2?: string;
  accentCool?: string;
  edge?: string;
}

interface ThemeFonts {
  heading: string;
  body: string;
  mono: string;
}

interface ThemeConfig {
  colorsLight: ThemeColors;
  colorsDark: ThemeColors;
  fonts: ThemeFonts;
  chartColors: string[];
  chartColorsDark?: string[];
}

interface ResolvedThemeConfig {
  colors: ThemeColors;
  fonts: ThemeFonts;
  chartColors: string[];
}

const THEME_CONFIGS: Record<string, ThemeConfig> = {
  theme01: {
    colorsLight: {
      primary: '1D1D1F',
      secondary: '6E6E73',
      accent: '2563EB',
      white: 'FFFFFF',
      light: 'F3F4F6',
      border: 'E5E7EB',
      surface: 'FFFFFF',
      surfaceElevated: 'F9FAFB',
    },
    colorsDark: {
      primary: 'F0F0F5',
      secondary: 'C0C0CC',
      accent: '3B82F6',
      white: '1A1A20',
      light: '25252C',
      border: '3A3A44',
      surface: '1A1A20',
      surfaceElevated: '25252C',
    },
    fonts: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    chartColors: ['2563EB', '10B981', 'F59E0B', 'EF4444', '8B5CF6', 'EC4899'],
    chartColorsDark: ['3B82F6', '34D399', 'FBBF24', 'F87171', 'A78BFA', 'F472B6'],
  },
  theme02: {
    colorsLight: {
      primary: 'F0F4F8',
      secondary: 'A0A8B0',
      accent: '00E5B0',
      white: '080A0E',
      light: '0F1218',
      border: '2A2E36',
      surface: '0F1218',
      surfaceElevated: '161A22',
    },
    colorsDark: {
      primary: 'F0F4F8',
      secondary: 'A0A8B0',
      accent: '00E5B0',
      white: '080A0E',
      light: '0F1218',
      border: '2A2E36',
      surface: '0F1218',
      surfaceElevated: '161A22',
    },
    fonts: { heading: 'Space Grotesk', body: 'Noto Sans SC', mono: 'Space Mono' },
    chartColors: ['00E5B0', 'FFD166', '00B4FF', 'FF6B6B', 'A78BFA', 'F472B6'],
  },
  theme03: {
    colorsLight: {
      primary: '05080D',
      secondary: '5A5E68',
      accent: '0077B6',
      white: 'F1F3F5',
      light: 'E5E8EB',
      border: 'D0D2D6',
      surface: 'FFFFFF',
      surfaceElevated: 'F1F3F5',
    },
    colorsDark: {
      primary: 'E8EDF3',
      secondary: '8A8F99',
      accent: '00B4FF',
      white: '05080D',
      light: '0D1118',
      border: '22262D',
      surface: '05080D',
      surfaceElevated: '0D1118',
    },
    fonts: { heading: 'Space Grotesk', body: 'Noto Sans SC', mono: 'Space Mono' },
    chartColors: ['00B4FF', 'FF2A6D', '8B5CF6', 'FF7B54', 'FF9F1C', '22D3EE'],
  },
  theme04: {
    colorsLight: {
      primary: '1A1A1A',
      secondary: '6B6B73',
      accent: '22A55C',
      white: 'FAFAF8',
      light: 'F1F1ED',
      border: 'E5E5E0',
      surface: 'FFFFFF',
      surfaceElevated: 'FAFAF8',
    },
    colorsDark: {
      primary: 'F4F4F5',
      secondary: 'A0A0A8',
      accent: '3ADE80',
      white: '0A0A0A',
      light: '121212',
      border: '2A2A2E',
      surface: '0A0A0A',
      surfaceElevated: '121212',
    },
    fonts: { heading: 'Space Grotesk', body: 'Inter', mono: 'Space Mono' },
    chartColors: ['3ADE80', 'FF6B9D', '4ECDC4', 'FFD166', 'A78BFA', 'FF8A5B'],
  },
  theme05: {
    colorsLight: {
      primary: '1A1A1A',
      secondary: '6B6B73',
      accent: 'C73E2F',
      white: 'F7F4EF',
      light: 'EDE9E2',
      border: 'DCD6CC',
      surface: 'FFFFFF',
      surfaceElevated: 'F7F4EF',
    },
    colorsDark: {
      primary: 'F4F4F5',
      secondary: 'A0A0A8',
      accent: 'E85D4E',
      white: '15151A',
      light: '1E1E24',
      border: '2A2A30',
      surface: '15151A',
      surfaceElevated: '1E1E24',
    },
    fonts: { heading: 'Inter', body: 'Inter', mono: 'Space Mono' },
    chartColors: ['E85D4E', 'F5A623', '0FA3B1', '4A58D9', '7C3AED', '22C55E'],
  },
  theme06: {
    colorsLight: {
      primary: '0F172A',
      secondary: '5A5E68',
      accent: '7BC800',
      white: 'F7F8FA',
      light: 'ECEFF3',
      border: 'D0D2D6',
      surface: 'FFFFFF',
      surfaceElevated: 'F1F3F5',
    },
    colorsDark: {
      primary: 'F2F4F7',
      secondary: 'A0A0A8',
      accent: 'B6FF2B',
      white: '0B0F17',
      light: '121926',
      border: '2A2E36',
      surface: '0B0F17',
      surfaceElevated: '151C27',
    },
    fonts: { heading: 'Inter', body: 'Inter', mono: 'Space Mono' },
    chartColors: ['B6FF2B', '00E5B0', '2E9FFF', 'FF6B45', 'A855F7', 'FFD100'],
  },
  theme07: {
    colorsLight: {
      primary: '1A1D23',
      secondary: '5A5E68',
      accent: '0E86E6',
      accent2: '12B886',
      accentCool: 'FF7A33',
      white: 'FFFFFF',
      light: 'F2F5F8',
      border: 'E2E5EA',
      surface: 'FFFFFF',
      surfaceElevated: 'F4F6F8',
    },
    colorsDark: {
      primary: 'F2F4F7',
      secondary: 'A0A0A8',
      accent: '5B9BD5',
      white: '0D100F',
      light: '151C27',
      border: '2A2E36',
      surface: '151C27',
      surfaceElevated: '1A2330',
    },
    fonts: { heading: 'Source Serif Pro', body: 'Inter', mono: 'JetBrains Mono' },
    chartColors: ['0E86E6', '12B886', 'FF7A33', '7C5CFC', '16BFD9', 'F24E7D'],
  },
  theme08: {
    colorsLight: {
      primary: '1A1812',
      secondary: '524C3D',
      accent: '8F6608',
      white: 'FDFBF4',
      light: 'FAF7EE',
      border: 'D9CFB8',
      surface: 'FFFFFF',
      surfaceElevated: 'FFFFFF',
    },
    colorsDark: {
      primary: 'F7F4EA',
      secondary: 'B8AE98',
      accent: 'FFD23F',
      white: '14130D',
      light: '1C1A12',
      border: '512810',
      surface: '211F17',
      surfaceElevated: '2C281E',
    },
    fonts: { heading: 'Noto Sans SC', body: 'Noto Sans SC', mono: 'JetBrains Mono' },
    chartColors: ['FFD23F', 'FF4D4D', '2BD2FF', 'C44DFF', '3DDC84', 'FF9F1C'],
  },
  theme09: {
    // 墨韵专色 · 杂志印刷风：双基底（纸底/墨底）按版式预分配，
    // appearance(primary/muted) 仅调专色浓度，不翻转明暗。
    colorsLight: {
      primary: '14161C',
      secondary: '3A3F4A',
      accent: 'C8102E',
      white: 'F4F1EA',
      light: 'EDE9DE',
      border: 'D5CFC0',
      surface: 'FDFCF8',
      surfaceElevated: 'FFFFFF',
    },
    colorsDark: {
      primary: 'F4F1EA',
      secondary: 'C9C6BE',
      accent: 'F04A62',
      white: '14161C',
      light: '0D0F14',
      border: '2E323C',
      surface: '1C2027',
      surfaceElevated: '242932',
    },
    fonts: { heading: 'Noto Serif SC', body: 'Noto Sans SC', mono: 'Space Mono' },
    chartColors: ['C8102E', '2B4A8B', '8F6410', '3F6B5C', '6D4C7D', 'A8562A'],
  },
  theme10: {
    // 金色指数 · 金融编辑风：墨黑金线底（始终深色），冰蓝主强调 + 香槟金/铜点睛。
    // 与 theme09 双基底不同，theme10 仅一套深色基底；具体强调色由专属渲染器按 SUBSTRATE 取色。
    colorsLight: {
      primary: 'EEF1F6',
      secondary: 'A9B2C0',
      accent: '4A7FD4',
      white: '0A0E14',
      light: '121823',
      border: '2A3340',
      surface: '121823',
      surfaceElevated: '1A2230',
    },
    colorsDark: {
      primary: 'EEF1F6',
      secondary: 'A9B2C0',
      accent: '4A7FD4',
      white: '0A0E14',
      light: '121823',
      border: '2A3340',
      surface: '121823',
      surfaceElevated: '1A2230',
    },
    fonts: { heading: 'Noto Sans SC', body: 'Noto Sans SC', mono: 'Space Mono' },
    chartColors: ['4A7FD4', 'D9B977', 'E8A23A', 'C97A52', '9A82DC', '6F9BD8'],
  },
  theme11: {
    // 流光科技 · 浅色扁平科技风：浅色底 + 多彩强调色，始终 light 外观。
    colorsLight: {
      primary: '1A202C',
      secondary: '5A6578',
      accent: '00BCD4',
      white: 'FFFFFF',
      light: 'F1F5F9',
      border: 'E2E8F0',
      surface: 'FFFFFF',
      surfaceElevated: 'F8FAFC',
    },
    colorsDark: {
      primary: '1A202C',
      secondary: '5A6578',
      accent: '00BCD4',
      white: 'FFFFFF',
      light: 'F1F5F9',
      border: 'E2E8F0',
      surface: 'FFFFFF',
      surfaceElevated: 'F8FAFC',
    },
    fonts: { heading: 'Noto Sans SC', body: 'Noto Sans SC', mono: 'Space Mono' },
    chartColors: ['00BCD4', '7C4DFF', '2979FF', 'FF9100', '00C853', 'FF5252'],
  },
};

// Helper to load theme colors from snapshot
function getSnapshotThemeColors(themeId: string, appearance: string): { colors: ThemeColors; fonts: ThemeFonts; chartColors: string[] } | null {
  const snapshotData = THEME_SNAPSHOT[themeId];
  if (!snapshotData) return null;
  
  const mode = appearance === 'light' ? 'light' : 'dark';
  const data = snapshotData[mode];
  if (!data) return null;
  
  return {
    colors: data.colors as ThemeColors,
    fonts: data.fonts as ThemeFonts,
    chartColors: data.chartColors as string[],
  };
}

// Helper to get gradient from snapshot
function getSnapshotGradient(themeId: string): { angle: number; stops: Array<{ position: number; color: string }> } | null {
  const snapshotData = THEME_SNAPSHOT[themeId];
  if (!snapshotData || !snapshotData.gradients) return null;
  
  // Return the first gradient available, or the theme-specific one
  const gradientKeys = Object.keys(snapshotData.gradients);
  if (gradientKeys.length === 0) return null;
  
  // Try to find a gradient specific to this theme
  if (snapshotData.gradients[themeId]) {
    return snapshotData.gradients[themeId];
  }
  
  // Return first available
  return snapshotData.gradients[gradientKeys[0]];
}

function resolveThemeConfig(
  theme: string | undefined,
  language: string | undefined,
  colorScheme: string = 'light',
  appearance: string = 'dark',
): ResolvedThemeConfig {
  const themeId = theme ?? 'theme01';
  const snapshotColors = getSnapshotThemeColors(themeId, appearance);
  
  // Fallback to hardcoded config if snapshot is not available
  const config = THEME_CONFIGS[themeId] ?? THEME_CONFIGS.theme01;
  const effectiveColorScheme = colorScheme || (theme === 'theme02' || theme === 'theme03' ? 'scheme-a' : theme === 'theme04' ? 'green' : 'light');

  let isDark = false;
  let colors: ThemeColors;
  let chartColors: string[];
  let resolved: ResolvedThemeConfig;

  if (theme === 'theme02') {
    isDark = true;
    colors = config.colorsDark;
    chartColors = config.chartColors;
  } else if (theme === 'theme03') {
    isDark = appearance !== 'light';
    colors = isDark ? config.colorsDark : config.colorsLight;
    const isSchemeB = effectiveColorScheme === 'scheme-b';
    const isLight03 = appearance === 'light';
    const accent = isSchemeB
      ? (isLight03 ? 'B45309' : 'FF9F1C')
      : (isLight03 ? '0077B6' : '00B4FF');
    const accent2 = isSchemeB
      ? (isLight03 ? '0077B6' : '00B4FF')
      : (isLight03 ? 'C2185B' : 'FF2A6D');
    const accentCool = isSchemeB
      ? (isLight03 ? '6B21A8' : '8B5CF6')
      : (isLight03 ? '6B21A8' : '8B5CF6');
    colors = {
      ...colors,
      accent,
      secondary: accent2,
    };
    chartColors = [accent, accent2, accentCool, isLight03 ? 'C2410C' : 'FF7B54', isLight03 ? 'B45309' : 'FF9F1C', isLight03 ? '0077B6' : '22D3EE'];
  } else if (theme === 'theme04') {
    isDark = appearance !== 'light';
    colors = isDark ? config.colorsDark : config.colorsLight;
    const isLight04 = appearance === 'light';
    const tone = ['green', 'yellow', 'blue', 'pink'].includes(colorScheme) ? colorScheme : 'green';
    const toneAccents: Record<string, { dark: string; light: string }> = {
      green: { dark: '3ADE80', light: '22A55C' },
      yellow: { dark: 'FFD166', light: 'D97706' },
      blue: { dark: '4ECDC4', light: '0D9488' },
      pink: { dark: 'FF6B9D', light: 'DB2777' },
    };
    const accent = toneAccents[tone][isLight04 ? 'light' : 'dark'];
    const accent2 = isLight04 ? 'DB2777' : 'FF6B9D';
    const accentCool = isLight04 ? '0D9488' : '4ECDC4';
    colors = {
      ...colors,
      accent,
      secondary: accent2,
    };
    chartColors = [accent, accent2, accentCool, isLight04 ? 'D97706' : 'FFD166', isLight04 ? '7C3AED' : 'A78BFA', isLight04 ? 'EA580C' : 'FF8A5B'];
  } else if (theme === 'theme05') {
    isDark = appearance !== 'light';
    colors = isDark ? config.colorsDark : config.colorsLight;
    const isLight05 = appearance === 'light';
    const scheme = ['coral', 'amber', 'teal', 'indigo', 'violet'].includes(colorScheme) ? colorScheme : 'coral';
    const schemeAccents: Record<string, { dark: string; light: string; accent2: { dark: string; light: string }; accentCool: { dark: string; light: string } }> = {
      coral: { dark: 'E85D4E', light: 'C73E2F', accent2: { dark: 'F5A623', light: 'C47B08' }, accentCool: { dark: '4A58D9', light: '3A46B0' } },
      amber: { dark: 'F5A623', light: 'C47B08', accent2: { dark: 'E85D4E', light: 'C73E2F' }, accentCool: { dark: '0FA3B1', light: '0B7A85' } },
      teal: { dark: '0FA3B1', light: '0B7A85', accent2: { dark: '4A58D9', light: '3A46B0' }, accentCool: { dark: 'F5A623', light: 'C47B08' } },
      indigo: { dark: '4A58D9', light: '3A46B0', accent2: { dark: '0FA3B1', light: '0B7A85' }, accentCool: { dark: 'F5A623', light: 'C47B08' } },
      violet: { dark: '7C3AED', light: '5B25C1', accent2: { dark: 'F5A623', light: 'C47B08' }, accentCool: { dark: '0FA3B1', light: '0B7A85' } },
    };
    const accent = schemeAccents[scheme][isLight05 ? 'light' : 'dark'];
    const accent2 = schemeAccents[scheme].accent2[isLight05 ? 'light' : 'dark'];
    const accentCool = schemeAccents[scheme].accentCool[isLight05 ? 'light' : 'dark'];
    colors = {
      ...colors,
      accent,
      secondary: accent2,
    };
    chartColors = [accent, accent2, accentCool, isLight05 ? 'C73E2F' : 'E85D4E', isLight05 ? '0B7A85' : '0FA3B1', isLight05 ? '5B25C1' : '7C3AED'];
  } else if (theme === 'theme06') {
    isDark = appearance !== 'light';
    colors = isDark ? config.colorsDark : config.colorsLight;
    const isLight06 = appearance === 'light';
    const scheme = ['volt', 'magma', 'nebula', 'nova'].includes(colorScheme) ? colorScheme : 'volt';
    const schemeAccents: Record<string, { dark: string; light: string; accent2: { dark: string; light: string }; accentCool: { dark: string; light: string } }> = {
      volt: { dark: 'B6FF2B', light: '7BC800', accent2: { dark: '00E5B0', light: '009E7A' }, accentCool: { dark: '2E9FFF', light: '1A6FD6' } },
      magma: { dark: 'FF6B45', light: 'D94E2B', accent2: { dark: 'FFC700', light: 'C78F00' }, accentCool: { dark: '00C2FF', light: '008FBF' } },
      nebula: { dark: '2E9FFF', light: '1A6FD6', accent2: { dark: 'A855F7', light: '7C2ED3' }, accentCool: { dark: '22D3EE', light: '0B9FB8' } },
      nova: { dark: 'FFD100', light: 'C78F00', accent2: { dark: 'FF6B45', light: 'D94E2B' }, accentCool: { dark: '00E5B0', light: '009E7A' } },
    };
    const accent = schemeAccents[scheme][isLight06 ? 'light' : 'dark'];
    const accent2 = schemeAccents[scheme].accent2[isLight06 ? 'light' : 'dark'];
    const accentCool = schemeAccents[scheme].accentCool[isLight06 ? 'light' : 'dark'];
    colors = {
      ...colors,
      accent,
      secondary: accent2,
      accent2,
      accentCool,
      borderStrong: isLight06 ? 'D0D2D6' : '2A2E36',
      surfaceSolid: isLight06 ? 'FFFFFF' : '151C27',
      edge: isLight06 ? 'C8CDD4' : '2A2E36',
    };
    chartColors = [accent, accent2, accentCool, isLight06 ? 'D94E2B' : 'FF6B45', isLight06 ? '009E7A' : '00E5B0', isLight06 ? '7C2ED3' : 'A855F7'];
  } else if (theme === 'theme07') {
    // theme07 冷白调研风：单一 light 外观，电光蓝主色 + 翠绿辅色 + 暖橙警示（明亮鲜艳）
    isDark = false;
    const accent2 = '12B886';
    const accentCool = 'FF7A33';
    colors = {
      ...config.colorsLight,
      accent2,
      accentCool,
      borderStrong: 'D0D2D6',
      surfaceSolid: 'FFFFFF',
    };
    chartColors = config.chartColors;
  } else if (theme === 'theme08') {
    // theme08 黑金实验风：primary(深黑/荧光金) / muted(象牙暖白/古铜金)
    const isMuted = appearance === 'muted' || appearance === 'light';
    isDark = !isMuted;
    colors = isMuted ? config.colorsLight : config.colorsDark;
    chartColors = config.chartColors;
  } else if (theme === 'theme09') {
    // theme09 墨韵专色：双基底按版式预分配，全局仅给默认纸底；
    // 墨底由专属渲染器在每一页内部按 layout 覆盖背景。
    const isMuted = appearance === 'muted' || appearance === 'light';
    isDark = false; // 默认纸底；墨底页由 theme09 渲染器覆盖
    colors = isMuted ? config.colorsLight : config.colorsLight;
    chartColors = config.chartColors;
  } else if (theme === 'theme10') {
    // theme10 金色指数：始终深色墨黑金线底，专属渲染器内部按 layout 取强调色/基底。
    isDark = true;
    colors = config.colorsDark;
    chartColors = config.chartColors;
  } else if (theme === 'theme11') {
    // theme11 流光科技：始终浅色底，情绪色由专属渲染器按 props.mood 覆盖背景。
    isDark = false;
    colors = config.colorsLight;
    chartColors = config.chartColors;
  } else {
    isDark = effectiveColorScheme === 'dark';
    colors = isDark ? config.colorsDark : config.colorsLight;
    chartColors = isDark ? (config.chartColorsDark ?? config.chartColors) : config.chartColors;
  }

  // If snapshot has data, use it as the base and overlay scheme-specific colors
  if (snapshotColors) {
    // Use snapshot colors as base
    const snapshotColorBase = snapshotColors.colors;
    
    // For themes with scheme/variant support, apply the accent overrides
    if (themeId === 'theme03') {
      const isSchemeB = effectiveColorScheme === 'scheme-b';
      const isLight03 = appearance === 'light';
      const accent = isSchemeB
        ? (isLight03 ? 'B45309' : 'FF9F1C')
        : (isLight03 ? '0077B6' : '00B4FF');
      const accent2 = isSchemeB
        ? (isLight03 ? '0077B6' : '00B4FF')
        : (isLight03 ? 'C2185B' : 'FF2A6D');
      
      colors = {
        ...snapshotColorBase,
        accent,
        secondary: accent2,
      };
      chartColors = snapshotColors.chartColors;
    } else if (themeId === 'theme04') {
      const isLight04 = appearance === 'light';
      const tone = ['green', 'yellow', 'blue', 'pink'].includes(colorScheme) ? colorScheme : 'green';
      const toneAccents: Record<string, { dark: string; light: string }> = {
        green: { dark: '3ADE80', light: '22A55C' },
        yellow: { dark: 'FFD166', light: 'D97706' },
        blue: { dark: '4ECDC4', light: '0D9488' },
        pink: { dark: 'FF6B9D', light: 'DB2777' },
      };
      const accent = toneAccents[tone][isLight04 ? 'light' : 'dark'];
      const accent2 = isLight04 ? 'DB2777' : 'FF6B9D';
      
      colors = {
        ...snapshotColorBase,
        accent,
        secondary: accent2,
      };
      chartColors = snapshotColors.chartColors;
    } else if (themeId === 'theme05') {
      const isLight05 = appearance === 'light';
      const scheme = ['coral', 'amber', 'teal', 'indigo', 'violet'].includes(colorScheme) ? colorScheme : 'coral';
      const schemeAccents: Record<string, { dark: string; light: string; accent2: { dark: string; light: string } }> = {
        coral: { dark: 'E85D4E', light: 'C73E2F', accent2: { dark: 'F5A623', light: 'C47B08' } },
        amber: { dark: 'F5A623', light: 'C47B08', accent2: { dark: 'E85D4E', light: 'C73E2F' } },
        teal: { dark: '0FA3B1', light: '0B7A85', accent2: { dark: '4A58D9', light: '3A46B0' } },
        indigo: { dark: '4A58D9', light: '3A46B0', accent2: { dark: '0FA3B1', light: '0B7A85' } },
        violet: { dark: '7C3AED', light: '5B25C1', accent2: { dark: 'F5A623', light: 'C47B08' } },
      };
      const accent = schemeAccents[scheme][isLight05 ? 'light' : 'dark'];
      const accent2 = schemeAccents[scheme].accent2[isLight05 ? 'light' : 'dark'];
      
      colors = {
        ...snapshotColorBase,
        accent,
        secondary: accent2,
      };
      chartColors = snapshotColors.chartColors;
    } else if (themeId === 'theme06') {
      const isLight06 = appearance === 'light';
      const scheme = ['volt', 'magma', 'nebula', 'nova'].includes(colorScheme) ? colorScheme : 'volt';
      const schemeAccents: Record<string, { dark: string; light: string; accent2: { dark: string; light: string }; accentCool: { dark: string; light: string } }> = {
        volt: { dark: 'B6FF2B', light: '7BC800', accent2: { dark: '00E5B0', light: '009E7A' }, accentCool: { dark: '2E9FFF', light: '1A6FD6' } },
        magma: { dark: 'FF6B45', light: 'D94E2B', accent2: { dark: 'FFC700', light: 'C78F00' }, accentCool: { dark: '00C2FF', light: '008FBF' } },
        nebula: { dark: '2E9FFF', light: '1A6FD6', accent2: { dark: 'A855F7', light: '7C2ED3' }, accentCool: { dark: '22D3EE', light: '0B9FB8' } },
        nova: { dark: 'FFD100', light: 'C78F00', accent2: { dark: 'FF6B45', light: 'D94E2B' }, accentCool: { dark: '00E5B0', light: '009E7A' } },
      };
      const accent = schemeAccents[scheme][isLight06 ? 'light' : 'dark'];
      const accent2 = schemeAccents[scheme].accent2[isLight06 ? 'light' : 'dark'];
      const accentCool = schemeAccents[scheme].accentCool[isLight06 ? 'light' : 'dark'];
      
      colors = {
        ...snapshotColorBase,
        accent,
        secondary: accent2,
        accent2,
        accentCool,
      };
      chartColors = snapshotColors.chartColors;
    } else {
      // Simple themes (theme01) - just use snapshot colors directly
      colors = snapshotColorBase;
      chartColors = snapshotColors.chartColors;
    }
    
    resolved = {
      colors,
      fonts: snapshotColors.fonts,
      chartColors,
    };
  } else {
    // Fallback to the original logic
    resolved = {
      colors,
      fonts: config.fonts,
      chartColors,
    };
  }

  // 中文场景优先使用 Noto 中文字体
  if (language === 'zh') {
    resolved.fonts = {
      heading: 'Noto Sans SC',
      body: 'Noto Sans SC',
      mono: 'Noto Sans SC',
    };
  }

  return resolved;
}

export let COLORS: ThemeColors = THEME_CONFIGS.theme01.colorsLight;
export let FONTS: ThemeFonts = THEME_CONFIGS.theme01.fonts;
export let CHART_COLORS: string[] = THEME_CONFIGS.theme01.chartColors;

// Store current gradient for background functions
let CURRENT_GRADIENT: { angle: number; stops: Array<{ position: number; color: string }> } | null = null;

/** 调试辅助：拦截 slide 的绘制调用，检测空颜色 */
function wrapSlideForColorDebug(slide: PptxSlide, index: number): PptxSlide {
  const methodsToWrap = ['addShape', 'addText', 'addChart', 'addImage'] as const;
  return new Proxy(slide, {
    get(target, prop) {
      const value = (target as any)[prop];
      if (methodsToWrap.includes(prop as any) && typeof value === 'function') {
        return function (this: any, ...args: any[]) {
          // args[0] is shapeType/text/chartType; args[1] is options for shape/chart/image, text options is args[1] for addText
          const optionsArg = prop === 'addText' ? args[1] : args[1];
          if (optionsArg && typeof optionsArg === 'object') {
            findEmptyColor(optionsArg, `${String(prop)}(slide ${index + 1})`);
          }
          return value.apply(this === undefined ? target : this, args);
        };
      }
      return value;
    },
  }) as PptxSlide;
}

function findEmptyColor(obj: any, path: string): void {
  if (!obj || typeof obj !== 'object') return;
  for (const [key, val] of Object.entries(obj)) {
    const currentPath = `${path}.${key}`;
    if ((key === 'color' || key === 'fill' || key === 'line' || key === 'chartColors' || key === 'dataLabelColor') && (val === '' || val === undefined || val === null)) {
      console.warn(`[PPTX color debug] 空颜色 @ ${currentPath}`, val, new Error().stack?.split('\n').slice(2, 6).join('\n'));
      continue;
    }
    if (key === 'color' && typeof val === 'string' && val.startsWith('var(--')) {
      console.warn(`[PPTX color debug] CSS 变量颜色未解析 @ ${currentPath}`, val, new Error().stack?.split('\n').slice(2, 6).join('\n'));
      continue;
    }
    if (typeof val === 'object') {
      findEmptyColor(val, currentPath);
    }
  }
}

export async function exportDeckToPptx(goal: DeckGoal, options: PptxExportOptions): Promise<void> {
  goal = normalizeDeckGoal(goal);
  const { outFile, title = goal.title, subject, author } = options;

  const theme = resolveThemeConfig(goal.theme, goal.language, goal.colorScheme, goal.appearance);
  COLORS = theme.colors;
  FONTS = theme.fonts;
  CHART_COLORS = theme.chartColors;

  // 注入 theme08 专属渲染器所需的状态（深浅模式随 appearance 切换）
  if (goal.theme === 'theme08') {
    configureTheme08({
      colors: COLORS,
      fonts: FONTS,
      chartColors: CHART_COLORS,
      muted: goal.appearance === 'muted' || goal.appearance === 'light',
    });
  }

  // 注入 theme09 专属渲染器所需的状态（appearance 决定专色浓度）
  if (goal.theme === 'theme09') {
    configureTheme09({
      appearance: goal.appearance === 'muted' || goal.appearance === 'light' ? 'muted' : 'primary',
      fonts: FONTS,
      chartColors: CHART_COLORS,
    });
  }
  // 注入 theme10 专属渲染器所需的状态（appearance 决定强调色浓度）
  if (goal.theme === 'theme10') {
    configureTheme10({
      appearance: goal.appearance === 'muted' || goal.appearance === 'light' ? 'muted' : 'primary',
      fonts: FONTS,
      chartColors: CHART_COLORS,
    });
  }

  // 注入 theme11 专属渲染器所需的状态（始终浅色底，appearance 仅调强调色浓度）
  if (goal.theme === 'theme11') {
    configureTheme11({
      appearance: goal.appearance === 'muted' || goal.appearance === 'light' ? 'muted' : 'primary',
      fonts: FONTS,
      chartColors: CHART_COLORS,
    });
  }

  // Load gradient from snapshot
  CURRENT_GRADIENT = getSnapshotGradient(goal.theme ?? 'theme01');

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = title;
  if (subject) pptx.subject = subject;
  if (author) pptx.author = author;

  for (const [slideIndex, slide] of goal.slides.entries()) {
    let pptxSlide = pptx.addSlide();
    if (process.env.DEBUG_PPTX_COLOR === '1') {
      pptxSlide = wrapSlideForColorDebug(pptxSlide, slideIndex);
    }
    (pptxSlide as unknown as { background: { color: string } }).background = { color: COLORS.surface };
    // theme07 冷白调研风：纯白底 + 亮色弥散光晕（优先，覆盖快照渐变）
    if (goal.theme === 'theme07') {
      addTheme07Background(pptxSlide);
    } else if (CURRENT_GRADIENT) {
      addGradientBackground(pptxSlide, CURRENT_GRADIENT);
    } else if (goal.theme === 'theme02' || goal.theme === 'theme03') {
      addTheme02Background(pptxSlide);
    } else if (goal.theme === 'theme04') {
      addTheme04Background(pptxSlide);
    } else if (goal.theme === 'theme05') {
      addTheme05Background(pptxSlide);
    } else if (goal.theme === 'theme06') {
      addTheme06Background(pptxSlide);
    }
    renderSlideToPptx(pptxSlide, slide);
  }

  try {
    await pptx.writeFile({ fileName: outFile });
  } finally {
    cleanupTempImages();
    cleanupTheme01TempImages();
  }
}

type PptxRenderFn = (slide: PptxSlide, props: unknown) => void;

/** 按 layoutId 索引的 PPTX 渲染器注册表。 */
const pptxRenderersByLayout = new Map<string, PptxRenderFn>();

function registerPptxLayoutRenderer(layoutId: string, renderFn: PptxRenderFn): void {
  pptxRenderersByLayout.set(layoutId, renderFn);
}

function resolvePptxRenderer(slide: CoreSlide): PptxRenderFn | undefined {
  return pptxRenderersByLayout.get(slide.layout);
}

function renderSlideToPptx(pptxSlide: PptxSlide, slide: CoreSlide): void {
  // theme08 拥有专属 PPTX 渲染器，优先按 layoutId 精确分发，避免被下方 theme06 的 includes() 兜底误路由。
  if (slide.layout.startsWith('theme08_')) {
    const t08 = resolvePptxRenderer(slide);
    if (t08) {
      t08(pptxSlide, slide.props);
      return;
    }
  }

  // theme09 墨韵专色：双基底（纸/墨）按版式预分配，专属渲染器内部按 layout 取基底。
  if (slide.layout.startsWith('theme09_')) {
    const t09 = resolvePptxRenderer(slide);
    if (t09) {
      t09(pptxSlide, slide.props);
      return;
    }
  }

  // theme10 金色指数：墨黑金线底，专属渲染器内部按 layout 取强调色/基底。
  if (slide.layout.startsWith('theme10_')) {
    const t10 = resolvePptxRenderer(slide);
    if (t10) {
      t10(pptxSlide, slide.props);
      return;
    }
  }

  // theme11 流光科技：浅色底 + 多彩强调色，专属渲染器按角色通用渲染。
  if (slide.layout.startsWith('theme11_')) {
    const t11 = resolvePptxRenderer(slide);
    if (t11) {
      t11(pptxSlide, slide.props);
      return;
    }
  }

  // theme01 浅色玻璃：双基底（light / tint）按版式预分配，专属渲染器内部按 layout 取基底。
  if (slide.layout.startsWith('theme01_')) {
    const t01 = resolvePptxRenderer(slide);
    if (t01) {
      t01(pptxSlide, slide.props);
      return;
    }
  }

  // theme06 所有子页面统一支持可选背景图（已有专属图片处理的版式除外）
  const theme06ExplicitImageLayouts = new Set([
    'theme06_cover_v1',
    'theme06_chapter_v1',
    'theme06_closing_v1',
    'theme06_chapter_image_v1',
  ]);
  if (
    slide.layout.startsWith('theme06_') &&
    slide.props?.imageUrl &&
    !theme06ExplicitImageLayouts.has(slide.layout)
  ) {
    addImageMaybe(pptxSlide, slide.props.imageUrl as string, 0, 0, 10, 5.625);
  }

  // 检查是否有坐标配置 - 如果有，使用 v2 坐标系统
  // 支持 theme06 专属版式坐标（带 _themeSpecific 标记）
  const coords = getLayoutCoordinates(slide.layout);
  const hasCoords = Object.keys(coords).length > 0;
  const isTheme06Specific = coords._themeSpecific === true;
  const layoutId = slide.layout;
  // 仅对"标准 layout ID"或"theme06 专属版式"启用 v2 渲染
  const standardLayoutPattern = /^theme\d+_(cover|content|metric|table_of_contents)_v\d+$/;
  const isStandardLayout = standardLayoutPattern.test(layoutId);
  const shouldUseV2 = (hasCoords && isStandardLayout) || (hasCoords && isTheme06Specific);
  
  if (shouldUseV2) {
    // 根据布局类型选择对应的 v2 渲染函数
    if (layoutId.includes('cover_product') || layoutId.includes('cover_business') || layoutId.includes('cover_manufacturing')) {
      renderTheme06CoverVariant(pptxSlide, slide.props as unknown as Theme06CoverVariantProps, layoutId);
      return;
    }
    if (layoutId.includes('cover')) {
      // Theme06 cover layouts use their own renderer with different prop structure
      if (layoutId.startsWith('theme06_')) {
        renderTheme06Cover(pptxSlide, slide.props as unknown as Theme06CoverProps, layoutId);
      } else {
        renderCoverV2(pptxSlide, slide.props as unknown as CoverV1Props, layoutId);
      }
      return;
    } else if (layoutId.includes('content_numbered')) {
      renderTheme06ContentNumbered(pptxSlide, slide.props as unknown as Theme06ContentNumberedProps, layoutId);
      return;
    } else if (layoutId.includes('content')) {
      renderContentWithCoords(pptxSlide, slide.props as unknown as ContentV1Props, layoutId);
      return;
    } else if (layoutId.includes('metric_showcase')) {
      renderTheme06MetricShowcase(pptxSlide, slide.props as unknown as Theme06MetricShowcaseProps, layoutId);
      return;
    } else if (layoutId.includes('metric')) {
      renderMetricWithCoords(pptxSlide, slide.props as unknown as MetricWithCoordsProps, layoutId);
      return;
    } else if (layoutId.includes('table_of_contents')) {
      renderTheme06Toc(pptxSlide, slide.props as unknown as Theme06TocProps, layoutId);
      return;
    } else if (layoutId.includes('toc')) {
      renderTheme06Toc(pptxSlide, slide.props as unknown as Theme06TocProps, layoutId);
      return;
    } else if (layoutId.includes('big_number')) {
      renderTheme06BigNumber(pptxSlide, slide.props, layoutId);
      return;
    } else if (layoutId.includes('chapter_numbered') || layoutId.includes('chapter_split') || layoutId.includes('chapter_focus') || layoutId.includes('chapter_image') || layoutId.includes('chapter_minimal')) {
      renderTheme06Chapter(pptxSlide, slide.props as unknown as Theme06ChapterProps, layoutId);
      return;
    } else if (layoutId.includes('chapter')) {
      renderTheme06Chapter(pptxSlide, slide.props as unknown as Theme06ChapterProps, layoutId);
      return;
    } else if (layoutId.includes('closing')) {
      renderTheme06Closing(pptxSlide, slide.props as unknown as Theme06ClosingProps, layoutId);
      return;
    } else if (layoutId.includes('timeline')) {
      renderTheme06Timeline(pptxSlide, slide.props as unknown as Theme06TimelineProps, layoutId);
      return;
    } else if (layoutId.includes('milestone')) {
      renderTheme06Milestone(pptxSlide, slide.props as unknown as Theme06MilestoneProps, layoutId);
      return;
    } else if (layoutId.includes('risk_matrix')) {
      renderTheme06RiskMatrix(pptxSlide, slide.props as unknown as Theme06RiskMatrixProps, layoutId);
      return;
    } else if (layoutId.includes('summary')) {
      renderTheme06Summary(pptxSlide, slide.props as unknown as Theme06SummaryProps, layoutId);
      return;
    } else if (layoutId.includes('quote')) {
      renderTheme06Quote(pptxSlide, slide.props as unknown as Theme06QuoteProps, layoutId);
      return;
    } else if (layoutId.includes('process')) {
      renderTheme06Process(pptxSlide, slide.props as unknown as Theme06ProcessProps, layoutId);
      return;
    } else if (layoutId.includes('method')) {
      renderTheme06Process(pptxSlide, slide.props as unknown as Theme06ProcessProps, layoutId);
      return;
    } else if (layoutId.includes('outlook')) {
      renderTheme06ListBased(pptxSlide, slide.props as unknown as Theme06ListBasedProps, layoutId);
      return;
    } else if (layoutId.includes('recap')) {
      renderTheme06ListBased(pptxSlide, slide.props as unknown as Theme06ListBasedProps, layoutId);
      return;
    } else if (layoutId.includes('statement')) {
      renderTheme06Statement(pptxSlide, slide.props as unknown as Theme06StatementProps, layoutId);
      return;
    } else if (layoutId.includes('sources')) {
      renderTheme06Sources(pptxSlide, slide.props as unknown as Theme06SourcesProps, layoutId);
      return;
    } else if (layoutId.includes('matrix')) {
      renderTheme06Matrix(pptxSlide, slide.props as unknown as Theme06MatrixProps, layoutId);
      return;
    } else if (layoutId.includes('rank')) {
      renderTheme06Rank(pptxSlide, slide.props as unknown as Theme06RankProps, layoutId);
      return;
    } else if (layoutId.includes('comparison')) {
      renderTheme06Comparison(pptxSlide, slide.props as unknown as Theme06ComparisonProps, layoutId);
      return;
    } else if (layoutId.includes('bento')) {
      renderTheme06Bento(pptxSlide, slide.props as unknown as Theme06BentoProps, layoutId);
      return;
    } else if (layoutId.includes('triad')) {
      renderTheme06Triad(pptxSlide, slide.props as unknown as Theme06TriadProps, layoutId);
      return;
    } else if (layoutId.includes('tech_landscape')) {
      renderTheme06TechLandscape(pptxSlide, slide.props as unknown as Theme06TechLandscapeProps, layoutId);
      return;
    } else if (layoutId.includes('chain_flow')) {
      renderTheme06ChainFlow(pptxSlide, slide.props as unknown as Theme06ChainFlowProps, layoutId);
      return;
    } else if (layoutId.includes('deal_map')) {
      renderTheme06DealMap(pptxSlide, slide.props as unknown as Theme06DealMapProps, layoutId);
      return;
    } else if (layoutId.includes('sector_spotlight')) {
      renderTheme06SectorSpotlight(pptxSlide, slide.props as unknown as Theme06SectorSpotlightProps, layoutId);
      return;
    } else if (layoutId.includes('company_profile')) {
      renderTheme06CompanyProfile(pptxSlide, slide.props as unknown as Theme06CompanyProfileProps, layoutId);
      return;
    } else if (layoutId.includes('company_spotlight')) {
      renderTheme06CompanySpotlight(pptxSlide, slide.props as unknown as Theme06CompanySpotlightProps, layoutId);
      return;
    } else if (layoutId.includes('case')) {
      renderTheme06Case(pptxSlide, slide.props as unknown as Theme06CaseProps, layoutId);
      return;
    }
  }
  
  // 否则使用原有渲染器
  const renderer = resolvePptxRenderer(slide);
  if (renderer) {
    renderer(pptxSlide, slide.props);
    return;
  }

  pptxSlide.addText(`Unknown layout: ${slide.layout}`, {
    x: 0.5, y: 3.5, w: 9, h: 1,
    fontSize: 18, color: 'EF4444', align: 'center',
  });
}

// ---- Layout Coordinate System (v2) ---------------------------------------

/**
 * 通用元素渲染函数 - 从坐标配置读取位置和样式
 * 这是解决版式错位问题的核心：所有布局坐标都从配置文件读取，
 * 而不是在渲染函数中硬编码。
 */
export function renderElementFromConfig(
  slide: PptxSlide,
  text: string | undefined,
  config: PptxElementConfig,
  options?: {
    color?: string;
    fontFace?: string;
  }
): boolean {
  if (!text) return false;
  
  const textOptions: any = {
    x: config.x,
    y: config.y,
    w: config.w || 8,
    h: config.h || 0.4,
    fontSize: config.fontSize || 18,
    align: config.align || 'left',
    bold: config.bold || false,
    color: options?.color || COLORS.primary,
    fontFace: options?.fontFace || FONTS.body,
  };
  
  slide.addText(text, textOptions);
  
  return true;
}

/**
 * 使用坐标配置渲染封面布局
 * 这是新系统的示例实现
 */
function renderCoverV2(slide: PptxSlide, props: CoverV1Props, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);
  
  // 背景图
  if (props.image) {
    const imgConfig = coords.image || { x: 0, y: 0, w: 10, h: 5.625 };
    addImageMaybe(slide, props.image, imgConfig.x, imgConfig.y, imgConfig.w, imgConfig.h);
  }
  
  // Kicker
  if (props.kicker && coords.kicker) {
    renderElementFromConfig(slide, props.kicker, coords.kicker, {
      color: COLORS.accent,
      fontFace: FONTS.mono,
    });
  }
  
  // Title
  if (coords.title) {
    renderElementFromConfig(slide, props.title, coords.title, {
      color: COLORS.primary,
      fontFace: FONTS.heading,
    });
  }
  
  // Subtitle
  if (props.subtitle && coords.subtitle) {
    renderElementFromConfig(slide, props.subtitle, coords.subtitle, {
      color: COLORS.secondary,
      fontFace: FONTS.body,
    });
  }
  
  // Date
  if (props.date && coords.date) {
    renderElementFromConfig(slide, props.date, coords.date, {
      color: COLORS.secondary,
      fontFace: FONTS.mono,
    });
  }
}

interface ContentV1Props {
  kicker?: string;
  title: string;
  body?: string;
  bullets?: string[];
}

/** 使用坐标配置渲染内容布局 (v2 坐标系统) */
function renderContentWithCoords(slide: PptxSlide, props: ContentV1Props, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);
  
  // Kicker
  if (props.kicker && coords.kicker) {
    renderElementFromConfig(slide, props.kicker, coords.kicker, {
      color: COLORS.accent,
      fontFace: FONTS.mono,
    });
  }
  
  // Title
  if (coords.title) {
    renderElementFromConfig(slide, props.title, coords.title, {
      color: COLORS.primary,
      fontFace: FONTS.heading,
    });
  }
  
  // Body text
  if (props.body && coords.body) {
    renderElementFromConfig(slide, props.body, coords.body, {
      color: COLORS.primary,
      fontFace: FONTS.body,
    });
  }
  
  // Bullets
  if (props.bullets && props.bullets.length > 0 && coords.bulletItem) {
    const bulletConfig = coords.bulletItem;
    let y = (coords.body?.y || 2.5) + (coords.body?.h || 2.5) + 0.3;
    
    props.bullets.forEach((bullet) => {
      // Bullet number/marker
      slide.addText('•', {
        x: bulletConfig.indentX,
        y,
        w: 0.3,
        h: bulletConfig.height,
        fontSize: bulletConfig.fontSize,
        color: COLORS.accent,
        align: 'left',
      });
      // Bullet text
      slide.addText(bullet, {
        x: bulletConfig.textStartX,
        y,
        w: 8,
        h: bulletConfig.height,
        fontSize: bulletConfig.fontSize,
        color: COLORS.primary,
        align: 'left',
        fontFace: FONTS.body,
      });
      y += bulletConfig.height + 0.1;
    });
  }
}

interface MetricWithCoordsProps {
  kicker?: string;
  title?: string;
  value?: string;
  unit?: string;
  description?: string;
  metrics?: Array<{ label: string; value: string }>;
}

/** 使用坐标配置渲染指标布局 (v2 坐标系统) */
function renderMetricWithCoords(slide: PptxSlide, props: MetricWithCoordsProps, layoutId: string): void {
  const coords = getLayoutCoordinates(layoutId);
  
  // Label/Kicker
  if (props.kicker && coords.label) {
    renderElementFromConfig(slide, props.kicker, coords.label, {
      color: COLORS.accent,
      fontFace: FONTS.mono,
    });
  }
  
  // Title
  if (props.title && coords.title) {
    renderElementFromConfig(slide, props.title, coords.title, {
      color: COLORS.primary,
      fontFace: FONTS.heading,
    });
  }
  
  // Main value
  if (props.value && coords.value) {
    const valueText = props.unit ? `${props.value}${props.unit}` : props.value;
    renderElementFromConfig(slide, valueText, coords.value, {
      color: COLORS.accent,
      fontFace: FONTS.heading,
    });
  }
  
  // Description
  if (props.description && coords.description) {
    renderElementFromConfig(slide, props.description, coords.description, {
      color: COLORS.secondary,
      fontFace: FONTS.body,
    });
  }
}

// ---- Theme06 specific renderers -------------------------------------------

export interface Theme06CoverProps {
  tag?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  metrics?: Array<{ value?: string; unit?: string; label?: string; accent?: boolean }>;
  footnoteLeft?: string;
  footnoteRight?: string;
}

/** Theme06 图谱封面专用渲染器 */

export interface Theme06BigNumberProps {
  kicker?: string;
  title?: string;
  number?: string;
  unit?: string;
  label?: string;
  description?: string;
  supporting?: Array<{ value?: string; label?: string }>;
}

/** Theme06 大数字页专用渲染器 */

// ---- Theme06 v2 Coordinate Renderers --------------------------------------

export interface Theme06ChapterProps {
  topLeftLabel?: string;
  topRightLabel?: string;
  tag?: string;
  number?: string;
  title?: string;
  subtitle?: string;
  enSubtitle?: string;
  tags?: Array<string | { item?: string }>;
  nextHint?: string;
  imageUrl?: string;
}


export interface Theme06ClosingProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  links?: Array<{ label?: string; value?: string }>;
  cta?: string;
  imageUrl?: string;
}


export interface Theme06TimelineProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  phases?: Array<{ date?: string; title?: string; description?: string }>;
  footnote?: string;
}


export interface Theme06MilestoneProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  milestones?: Array<{ date?: string; title?: string; value?: string; description?: string; focus?: boolean }>;
}


export interface Theme06MetricShowcaseProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  unit?: string;
  change?: string;
  changeLabel?: string;
  supporting?: Array<{ value?: string; label?: string }>;
}


export interface Theme06RiskMatrixProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  cells?: Array<{ level?: string; title?: string; description?: string; focus?: boolean }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}


// ---- Summary renderer -----------------------------------------------------

export interface Theme06SummaryProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  points?: Array<{ text?: string }>;
  conclusion?: { value?: string; valueLabel?: string; valueDescription?: string };
}


// ---- Quote renderer --------------------------------------------------------

export interface Theme06QuoteProps {
  accentBar?: boolean;
  quote?: string;
  quoteMark?: string;
  source?: string;
}


// ---- Process / Method renderer ---------------------------------------------

export interface Theme06ProcessProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  steps?: Array<{ title?: string; description?: string }>;
}


// ---- ListBased renderer (Outlook / Recap) ---------------------------------

export interface Theme06ListBasedProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  points?: Array<{ text?: string }>;
  steps?: Array<{ date?: string; title?: string; description?: string }>;
  valueCard?: { value?: string; valueLabel?: string };
}


// ---- Statement renderer ----------------------------------------------------

export interface Theme06StatementProps {
  kicker?: string;
  statement?: string;
  subtitle?: string;
  points?: Array<{ text?: string }>;
  source?: string;
}


// ---- Sources renderer ------------------------------------------------------

export interface Theme06SourcesProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  sources?: Array<{ text?: string }>;
}


// ---- Case renderer ---------------------------------------------------------

export interface Theme06CaseProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  company?: string;
  tagline?: string;
  metrics?: Array<{ value?: string; label?: string }>;
  cards?: Array<{ label?: string; text?: string }>;
  items?: Array<{ number?: string; title?: string; description?: string; meta?: string }>;
  imageUrl?: string;
  insight?: string;
  footnote?: string;
}


// ---- TOC renderer ----------------------------------------------------------

export interface Theme06TocProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{ number?: string; title?: string; page?: string }>;
}


// ---- Theme06 Cover Variant renderer ---------------------------------------

export interface Theme06CoverVariantProps {
  imageUrl?: string;
  badge?: string;
  tag?: string;
  headline?: string;
  hero?: string;
  title: string;
  subtitle?: string;
  kpis?: Array<{ value?: string; unit?: string; label?: string }>;
  metrics?: Array<{ value?: string; unit?: string; label?: string }>;
  bars?: Array<{ label?: string; value?: string; unit?: string; progress?: number }>;
  channels?: Array<{ name?: string; metric?: string }>;
  footnoteLeft?: string;
  footnoteRight?: string;
  [key: string]: unknown;
}


// ---- Theme06 Content Numbered renderer ------------------------------------

export interface Theme06ContentNumberedProps {
  imageUrl?: string;
  kicker?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  items?: Array<{ number?: string; title?: string; enLabel?: string; active?: boolean }>;
  footnote?: string;
  [key: string]: unknown;
}


// ---- Theme06 Phase 5 信息展示类 v2 渲染器（坐标驱动） --------------------

export interface Theme06MatrixProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  cells?: Array<{ title?: string; description?: string; focus?: boolean; level?: string }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}


export interface Theme06RankProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  rows?: Array<{ name?: string; value?: string; change?: string; highlight?: boolean }>;
}


export interface Theme06ComparisonProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  leftTitle?: string;
  rightTitle?: string;
  points?: Array<{ left?: string; right?: string; winner?: 'left' | 'right' }>;
  summaryLeft?: string;
  summaryRight?: string;
}


export interface Theme06BentoProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{ value?: string; title?: string; description?: string; accent?: boolean }>;
}


export interface Theme06TriadProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{ value?: string; title?: string; description?: string; accent?: boolean }>;
}


export interface Theme06TechLandscapeProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  topics?: Array<{ value?: string; title?: string; description?: string; accent?: boolean }>;
}


export interface Theme06ChainFlowProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  steps?: Array<{ label?: string; description?: string; value?: string }>;
  footnote?: string;
}


export interface Theme06DealMapProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  nodes?: Array<{ name?: string; category?: number }>;
  conclusion?: string;
}


export interface Theme06SectorSpotlightProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  takeaways?: string[];
  highlights?: Array<{ value?: string; label?: string; accent?: boolean }>;
  insight?: { value?: string; label?: string; description?: string };
}


export interface Theme06CompanyProfileProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  company?: string;
  tagline?: string;
  facts?: Array<{ label?: string; value?: string }>;
  metrics?: Array<{ value?: string; label?: string }>;
  narrative?: { challenge?: string; solution?: string; result?: string };
}


export interface Theme06CompanySpotlightProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  company?: string;
  tagline?: string;
  description?: string;
  stage?: string;
  location?: string;
  founded?: string;
  metrics?: Array<{ value?: string; label?: string }>;
  highlights?: Array<{ title?: string; description?: string }>;
}


// ---- Shared helpers --------------------------------------------------------

export function addKicker(slide: PptxSlide, kicker: string | undefined, x = 0.8, y = 0.8): void {
  if (!kicker) return;
  slide.addText(kicker, {
    x, y, w: 8.4, h: 0.4,
    fontSize: 14, color: COLORS.accent, align: 'left',
    fontFace: FONTS.mono,
  });
}

/** 通用渐变背景函数：从快照配置中读取渐变参数 */
function addGradientBackground(slide: PptxSlide, gradient: { angle: number; stops: Array<{ position: number; color: string }> }): void {
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: {
      color: COLORS.surface,
      gradient: {
        type: 'linear',
        angle: gradient.angle,
        stops: gradient.stops,
      },
    },
  } as any);
}

/** 为 theme02 幻灯片添加深色霓虹渐变背景。 */
function addTheme02Background(slide: PptxSlide): void {
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: {
      color: COLORS.surface,
      gradient: {
        type: 'linear',
        angle: 160,
        stops: [
          { position: 0, color: COLORS.white },
          { position: 1, color: COLORS.light },
        ],
      },
    },
  } as any);
}

/** 为 theme04 幻灯片添加玻璃糖果渐变背景。 */
export function addTheme04Background(slide: PptxSlide): void {
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: {
      color: COLORS.surface,
      gradient: {
        type: 'linear',
        angle: 155,
        stops: [
          { position: 0, color: COLORS.white },
          { position: 1, color: COLORS.light },
        ],
      },
    },
  } as any);

  // 右上角糖果色弥散光晕
  slide.addShape('ellipse', {
    x: 7.2, y: -0.8, w: 3.8, h: 2.6,
    fill: {
      color: COLORS.accent,
      transparency: 88,
    },
  } as any);

  // 左下角冷色光晕
  slide.addShape('ellipse', {
    x: -1.2, y: 4.0, w: 3.4, h: 2.2,
    fill: {
      color: '4ECDC4',
      transparency: 90,
    },
  } as any);
}

/** 为 theme05 幻灯片添加纸白/深色渐变背景与光谱色带。 */
function addTheme05Background(slide: PptxSlide): void {
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: {
      color: COLORS.surface,
      gradient: {
        type: 'linear',
        angle: 170,
        stops: [
          { position: 0, color: COLORS.white },
          { position: 1, color: COLORS.light },
        ],
      },
    },
  } as any);
}

/** 在 theme05 幻灯片底部绘制光谱色带。 */
export function addTheme05SpectrumBar(slide: PptxSlide): void {
  const colors = ['E85D4E', 'F5A623', '0FA3B1', '4A58D9', '7C3AED'];
  const barY = 5.18;
  const barH = 0.06;
  const segmentW = 10 / colors.length;
  colors.forEach((color, idx) => {
    slide.addShape('rect', {
      x: idx * segmentW, y: barY, w: segmentW, h: barH,
      fill: { color },
    } as any);
  });
}

/** 为 theme06 幻灯片添加深色图谱渐变背景。 */
function addTheme06Background(slide: PptxSlide): void {
  slide.addShape('rect', {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: {
      color: COLORS.surface,
      gradient: {
        type: 'linear',
        angle: 160,
        stops: [
          { position: 0, color: COLORS.white },
          { position: 1, color: COLORS.light },
        ],
      },
    },
  } as any);
}

/** theme07 冷白调研风：纯白底 + 亮色弥散光晕背景。 */
function addTheme07Background(slide: PptxSlide): void {
  const W = 10;
  const H = 5.625;
  // 纯白底（覆盖默认 surface，确保无灰偏）
  slide.addShape('rect', { x: 0, y: 0, w: W, h: H, fill: { color: 'FFFFFF' }, line: { type: 'none' } } as any);
  // 右上角蓝色弥散光晕
  slide.addShape('ellipse', {
    x: 7.2, y: -1.7, w: 5.0, h: 3.9,
    fill: { color: COLORS.accent, transparency: 82 },
    line: { type: 'none' },
  } as any);
  // 右侧绿色弥散光晕
  slide.addShape('ellipse', {
    x: 6.4, y: 1.0, w: 3.6, h: 3.1,
    fill: { color: COLORS.accent2, transparency: 86 },
    line: { type: 'none' },
  } as any);
  // 暖橙色小光晕
  slide.addShape('ellipse', {
    x: 5.4, y: 2.6, w: 2.9, h: 2.5,
    fill: { color: COLORS.accentCool, transparency: 88 },
    line: { type: 'none' },
  } as any);
}

/** 在 theme06 幻灯片底部绘制霓虹装饰线。 */
export function addTheme06GlowLine(slide: PptxSlide): void {
  const barY = 5.18;
  const barH = 0.04;
  const stops = [
    { position: 0, color: COLORS.white },
    { position: 0.35, color: COLORS.accent },
    { position: 0.65, color: COLORS.secondary },
    { position: 1, color: COLORS.white },
  ];
  slide.addShape('rect', {
    x: 0, y: barY, w: 10, h: barH,
    fill: {
      color: COLORS.accent,
      gradient: {
        type: 'linear',
        angle: 90,
        stops,
      },
    },
  } as any);
}

function splitBilingual(text?: string): { cn?: string; en?: string } {
  if (!text) return {};
  const parts = text.split(' / ');
  if (parts.length >= 2) return { cn: parts[0], en: parts.slice(1).join(' / ') };
  return { cn: text };
}

export function addTheme06FooterBilingual(slide: PptxSlide, footnote?: string): void {
  const parts = splitBilingual(footnote);
  if (parts.cn) {
    slide.addText(parts.cn, {
      x: 0.65, y: 5.08, w: 4.5, h: 0.22,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.heading, bold: true,
    });
  }
  if (parts.en) {
    slide.addText(parts.en, {
      x: 5.15, y: 5.08, w: 4.2, h: 0.22,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, bold: true, align: 'right',
    });
  }
}

/** theme06 标准数据卡片：实色表面 + 细边框。 */
export function addTheme06Card(slide: PptxSlide, x: number, y: number, w: number, h: number, accent = false): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: accent ? COLORS.accent : COLORS.surfaceElevated },
    line: { color: accent ? COLORS.accent : COLORS.border, width: 1 },
    rectRadius: 0.08,
  } as any);
}

/** theme06 霓虹徽章（圆角胶囊）。 */
export function addTheme06Badge(slide: PptxSlide, x: number, y: number, w: number, h: number, text: string): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.accent },
    rectRadius: h / 2,
  } as any);
  slide.addText(text, {
    x, y, w, h,
    fontSize: 10, color: COLORS.white, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.mono,
  });
}

/** theme06 进度条卡片。 */
export function addTheme06ProgressCard(
  slide: PptxSlide,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  progress: number
): void {
  addTheme06Card(slide, x, y, w, h);
  slide.addText(label, {
    x: x + 0.12, y: y + 0.1, w: w - 0.24, h: 0.24,
    fontSize: 11, color: COLORS.primary, bold: true, fontFace: FONTS.body,
  });
  slide.addText(value, {
    x: x + 0.12, y: y + 0.32, w: w - 0.24, h: 0.32,
    fontSize: 20, color: COLORS.accent, bold: true, align: 'right', fontFace: FONTS.heading,
  });
  const trackY = y + h - 0.18;
  slide.addShape('roundRect', {
    x: x + 0.12, y: trackY, w: w - 0.24, h: 0.06,
    fill: { color: COLORS.white },
    rectRadius: 0.03,
  } as any);
  const fillW = Math.max(0, Math.min(1, progress)) * (w - 0.24);
  if (fillW > 0) {
    slide.addShape('roundRect', {
      x: x + 0.12, y: trackY, w: fillW, h: 0.06,
      fill: { color: COLORS.accent },
      rectRadius: 0.03,
    } as any);
  }
}

/** theme06 时间轴节点与连线。 */
export function addTheme06TimelineNode(
  slide: PptxSlide,
  cx: number,
  cy: number,
  label: string,
  date: string,
  focus = false
): void {
  slide.addShape('ellipse', {
    x: cx - 0.15, y: cy - 0.15, w: 0.3, h: 0.3,
    fill: { color: focus ? COLORS.accent : COLORS.surfaceElevated },
    line: { color: COLORS.accent, width: 2 },
  } as any);
  slide.addText(date, {
    x: cx - 0.5, y: cy - 0.55, w: 1.0, h: 0.22,
    fontSize: 9, color: COLORS.accent, bold: true, align: 'center', fontFace: FONTS.mono,
  });
  slide.addText(label, {
    x: cx - 0.55, y: cy + 0.22, w: 1.1, h: 0.22,
    fontSize: 10, color: COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
  });
}

/** theme06 2×2 象限网格（虚线十字）。 */
export function addTheme06QuadrantGrid(slide: PptxSlide, x: number, y: number, w: number, h: number): void {
  addTheme06Card(slide, x, y, w, h);
  const midX = x + w / 2;
  const midY = y + h / 2;
  const dash = 0.06;
  const gap = 0.04;
  for (let cy = y + 0.1; cy < y + h - 0.1; cy += dash + gap) {
    slide.addShape('rect', {
      x: midX - 0.01, y: cy, w: 0.02, h: Math.min(dash, y + h - 0.1 - cy),
      fill: { color: COLORS.border },
    } as any);
  }
  for (let cx = x + 0.1; cx < x + w - 0.1; cx += dash + gap) {
    slide.addShape('rect', {
      x: cx, y: midY - 0.01, w: Math.min(dash, x + w - 0.1 - cx), h: 0.02,
      fill: { color: COLORS.border },
    } as any);
  }
}

/** theme06 气泡节点。 */
export function addTheme06Bubble(slide: PptxSlide, x: number, y: number, size: number, label: string, color: string): void {
  slide.addShape('ellipse', {
    x: x - size / 2, y: y - size / 2, w: size, h: size,
    fill: { color, transparency: 84 },
    line: { color, width: 1 },
  } as any);
  slide.addText(label, {
    x: x - size / 2, y: y - 0.15, w: size, h: 0.3,
    fontSize: 8, color: COLORS.primary, bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
  });
}

/** theme06 流程步骤卡片（带输入/输出标签）。 */
export function addTheme06StepCard(slide: PptxSlide, x: number, y: number, w: number, h: number, step: any, accent = false): void {
  addTheme06Card(slide, x, y, w, h, accent);
  slide.addText(step.title ?? '', {
    x: x + 0.1, y: y + 0.1, w: w - 0.2, h: 0.26,
    fontSize: 11, color: accent ? COLORS.white : COLORS.primary, bold: true, align: 'center', fontFace: FONTS.body,
  });
  if (step.description) {
    slide.addText(step.description, {
      x: x + 0.1, y: y + 0.36, w: w - 0.2, h: 0.5,
      fontSize: 9, color: accent ? 'FFFFFF' : COLORS.secondary, align: 'center', valign: 'top', fontFace: FONTS.body,
    });
  }
  if (step.input || step.output) {
    const ioText = [step.input ? `IN: ${step.input}` : '', step.output ? `OUT: ${step.output}` : ''].filter(Boolean).join(' / ');
    slide.addText(ioText, {
      x: x + 0.1, y: y + h - 0.32, w: w - 0.2, h: 0.22,
      fontSize: 8, color: accent ? 'FFFFFF' : COLORS.secondary, align: 'center', valign: 'middle', fontFace: FONTS.mono,
    });
  }
}

/** theme05 标准数据卡片：实色表面 + 细边框。 */
export function addTheme05Card(slide: PptxSlide, x: number, y: number, w: number, h: number, accent = false): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: accent ? COLORS.accent : COLORS.surfaceElevated },
    line: { color: accent ? COLORS.accent : COLORS.border, width: 1 },
    rectRadius: 0.08,
  } as any);
}

/** theme05 scheme 颜色到固定 hex 的映射（与运行时 CSS 变量对应）。 */
const THEME05_SCHEME_COLORS: Record<string, string> = {
  coral: 'E85D4E',
  amber: 'F5A623',
  teal: '0FA3B1',
  indigo: '4A58D9',
  violet: '7C3AED',
};

export function theme05SchemeColor(scheme?: string): string {
  return THEME05_SCHEME_COLORS[scheme || 'coral'] || COLORS.accent;
}

/** theme05 小胶囊（用于高亮标签）。 */
export function addTheme05Pill(slide: PptxSlide, x: number, y: number, w: number, h: number, text: string, color: string): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color },
    rectRadius: h / 2,
  } as any);
  slide.addText(text, {
    x, y: y + 0.02, w, h: h - 0.02,
    fontSize: 11, color: 'FFFFFF', bold: true, align: 'center', valign: 'middle', fontFace: FONTS.body,
  });
}

/** theme05 结论卡片（右侧）。 */
export function addTheme05ConclusionCard(slide: PptxSlide, x: number, y: number, w: number, h: number, conclusion: any): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.12,
  } as any);
  let cursorY = y + 0.18;
  if (conclusion?.value) {
    slide.addText(conclusion.value, {
      x: x + 0.16, y: cursorY, w: w - 0.32, h: 0.55,
      fontSize: 30, color: COLORS.accent, bold: true, fontFace: FONTS.heading,
    });
    cursorY += 0.55;
  }
  if (conclusion?.label) {
    slide.addText(conclusion.label, {
      x: x + 0.16, y: cursorY, w: w - 0.32, h: 0.22,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.body,
    });
    cursorY += 0.26;
  }
  if (conclusion?.description) {
    slide.addText(conclusion.description, {
      x: x + 0.16, y: cursorY, w: w - 0.32, h: h - (cursorY - y) - 0.2,
      fontSize: 10, color: COLORS.secondary, valign: 'top', fontFace: FONTS.body,
    });
  }
}

/** theme02 玻璃卡片：深色表面 + 细边框 + 柔和阴影。 */
export function addTheme02Card(slide: PptxSlide, x: number, y: number, w: number, h: number, radius = 0.15): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: radius,
    shadow: {
      type: 'outer',
      blur: 8,
      offset: 4,
      angle: 45,
      color: '000000',
      opacity: 0.35,
    },
  } as any);
}

export function addTitle(slide: PptxSlide, title: string, x = 0.8, y = 1.3, w = 8.4, h = 0.9, fontSize = 44): void {
  slide.addText(title, {
    x, y, w, h,
    fontSize, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
    fontFace: FONTS.heading,
  });
}

interface SimpleInsight {
  value?: string;
  label?: string;
  description?: string;
}

export function renderInsightPanel(slide: PptxSlide, insight: SimpleInsight | undefined, x: number, y: number, w: number, h: number): void {
  if (!insight || (!insight.value && !insight.label && !insight.description)) return;

  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: COLORS.surfaceElevated },
    line: { color: COLORS.border, width: 1 },
    rectRadius: 0.15,
  });

  let cursorY = y + 0.25;
  if (insight.value) {
    slide.addText(insight.value, {
      x: x + 0.2, y: cursorY, w: w - 0.4, h: 0.65,
      fontSize: 36, color: COLORS.accent, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    cursorY += 0.62;
  }
  if (insight.label) {
    slide.addText(insight.label, {
      x: x + 0.2, y: cursorY, w: w - 0.4, h: 0.3,
      fontSize: 11, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    cursorY += 0.38;
  }
  if (insight.description) {
    slide.addText(insight.description, {
      x: x + 0.2, y: cursorY, w: w - 0.4, h: h - (cursorY - y) - 0.25,
      fontSize: 12, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }
}

let exportTmpDir: string | null = null;
const dataUriToTempPath = new Map<string, string>();

function getExportTmpDir(): string | null {
  if (!exportTmpDir) {
    try {
      exportTmpDir = mkdtempSync(path.join(tmpdir(), 'lemonppt-'));
    } catch {
      return null;
    }
  }
  return exportTmpDir;
}

export function dataUriToTempFile(url: string): string | undefined {
  const cached = dataUriToTempPath.get(url);
  if (cached) return cached;

  const match = url.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return undefined;

  const mime = match[1];
  const base64 = match[2];
  const ext =
    mime === 'image/svg+xml' ? 'svg' :
    mime === 'image/png' ? 'png' :
    mime === 'image/jpeg' ? 'jpg' :
    mime === 'image/webp' ? 'webp' : 'bin';

  try {
    const buffer = Buffer.from(base64, 'base64');
    const tmpDir = getExportTmpDir();
    if (!tmpDir) return undefined;
    const fileName = `img-${crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 16)}.${ext}`;
    const filePath = path.join(tmpDir, fileName);
    writeFileSync(filePath, buffer);
    dataUriToTempPath.set(url, filePath);
    return filePath;
  } catch {
    return undefined;
  }
}

export function addImageMaybe(slide: PptxSlide, url: string | undefined, x: number, y: number, w: number, h: number): void {
  if (!url) return;

  let pathOrUrl = url;
  if (url.startsWith('data:')) {
    const tempPath = dataUriToTempFile(url);
    if (!tempPath) {
      slide.addText('[图片]', { x, y, w, h, fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle' });
      return;
    }
    pathOrUrl = tempPath;
  }

  // pptxgenjs 在 Node 环境无法直接下载远程 URL，仅当为本地文件或 base64 时可用。
  try {
    slide.addImage({ path: pathOrUrl, x, y, w, h, sizing: { type: 'crop', w, h } });
  } catch {
    slide.addText('[图片]', { x, y, w, h, fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'middle' });
  }
}

function cleanupTempImages(): void {
  dataUriToTempPath.clear();
  if (exportTmpDir) {
    try {
      rmSync(exportTmpDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
    exportTmpDir = null;
  }
}

// ---- Layout renderers ------------------------------------------------------

interface CoverV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  date?: string;
  image?: string;
}


interface TableOfContentsV1Props {
  kicker?: string;
  title: string;
  items?: string[];
}

export function renderTableOfContentsV1(slide: PptxSlide, props: TableOfContentsV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const items = (props.items || []).slice(0, 4);
  let y = 2.4;
  items.forEach((item, index) => {
    const number = String(index + 1).padStart(2, '0');
    slide.addText(number, {
      x: 0.8, y, w: 0.8, h: 0.45,
      fontSize: 18, color: COLORS.accent, align: 'left', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(item, {
      x: 1.7, y, w: 7.8, h: 0.45,
      fontSize: 26, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.75;
  });
}
interface StatsV1Props {
  kicker?: string;
  title: string;
  stats?: { label?: string; value?: string; unit?: string; change?: string }[];
  showInsight?: boolean;
  insight?: SimpleInsight;
}

export function renderStatsV1(slide: PptxSlide, props: StatsV1Props): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const cardW = (mainW - 0.4) / 2;
  const startX = 0.8;

  addKicker(slide, props.kicker);
  addTitle(slide, props.title, startX, 1.3, mainW);
  const stats = (props.stats || []).slice(0, 4);
  const positions = [
    { x: startX, y: 2.5 },
    { x: startX + cardW + 0.2, y: 2.5 },
    { x: startX, y: 4.0 },
    { x: startX + cardW + 0.2, y: 4.0 },
  ];
  stats.forEach((stat, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: cardW, h: 1.3,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    const valueText = [stat.value, stat.unit].filter(Boolean).join(' ');
    slide.addText(valueText || '-', {
      x: pos.x + 0.2, y: pos.y + 0.15, w: cardW - 0.4, h: 0.55,
      fontSize: 30, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(stat.label || '', {
      x: pos.x + 0.2, y: pos.y + 0.75, w: cardW - 1.0, h: 0.35,
      fontSize: 14, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.body,
    });
    if (stat.change) {
      slide.addText(stat.change, {
        x: pos.x + cardW - 1.0, y: pos.y + 0.75, w: 0.8, h: 0.35,
        fontSize: 14, color: COLORS.accent, align: 'right',
        fontFace: FONTS.mono,
      });
    }
  });

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

interface ChartV1InsightItem {
  label?: string;
  value?: string;
}

interface ChartV1Insight {
  headline?: string;
  subheadline?: string;
  items?: ChartV1InsightItem[];
  badge?: { text?: string; tone?: 'accent' | 'success' | 'warning' };
}

export interface ChartV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'pie';
  labels?: string[];
  data?: number[];
  unit?: string;
  insight?: ChartV1Insight;
  footnote?: string;
}

interface ChartGaugeProps {
  title?: string;
  kicker?: string;
  value?: number;
  min?: number;
  max?: number;
  unit?: string;
  insight?: ChartInsight;
}

export function renderChartGauge(slide: PptxSlide, props: ChartGaugeProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const value = props.value ?? 0;
  const min = props.min ?? 0;
  const max = Math.max(props.max ?? 100, min + 1);
  const unit = props.unit || '';
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  slide.addText(`${value}${unit}`, {
    x: 0, y: 2.4, w: 10, h: 1.0,
    fontSize: 48, bold: true, color: COLORS.accent,
    align: 'center', valign: 'middle', fontFace: FONTS.heading,
  });
  slide.addText(`${percentage.toFixed(1)}%`, {
    x: 0, y: 3.4, w: 10, h: 0.5,
    fontSize: 18, color: COLORS.secondary,
    align: 'center', valign: 'middle', fontFace: FONTS.body,
  });

  // pptxgenjs 3.12 运行时支持 doughnut，但当前类型定义较旧，使用 as any 绕过。
  slide.addChart('doughnut' as 'pie', [
    { name: '已完成', labels: ['已完成', '未完成'], values: [percentage, 100 - percentage] },
  ], {
    x: 3, y: 4.0, w: 4, h: 1.5,
    chartColors: [COLORS.accent, COLORS.border],
    showValue: false,
    holeSize: 60,
  } as any);

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);
  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }
}

interface ChartHeatmapProps {
  title?: string;
  kicker?: string;
  xAxis?: string[];
  yAxis?: string[];
  data?: Array<[string, string, number]>;
  insight?: ChartInsight;
}

export function renderChartHeatmap(slide: PptxSlide, props: ChartHeatmapProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const flat = raw.map((cell) => ({ name: `${cell[0]} / ${cell[1]}`, value: cell[2] }));
  const sorted = flat.sort((a, b) => b.value - a.value).slice(0, 12);

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);

  if (sorted.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = sorted.map((d) => d.name);
  const values = sorted.map((d) => d.value);
  const chartColors = sorted.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  const chartW = hasInsight ? 5.6 : 8.4;

  slide.addChart('bar', [{ name: props.title || '热度', labels, values }], {
    x: 0.8, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }
}

interface ChartInsight {
  value?: string;
  label?: string;
  description?: string;
}

interface ChartFunnelProps {
  title?: string;
  kicker?: string;
  subtitle?: string;
  data?: Array<{ name: string; value: number }>;
  insight?: ChartInsight;
  footnote?: string;
}

export function renderChartFunnel(slide: PptxSlide, props: ChartFunnelProps): void {
  if (props.kicker) addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const raw = props.data || [];
  const insight = props.insight || {};
  const hasInsight = !!insight.value || !!insight.label || !!insight.description;

  if (raw.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = raw.map((d) => d.name);
  const values = raw.map((d) => d.value);
  const chartColors = raw.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  const chartW = hasInsight ? 5.6 : 8.4;

  // PptxGenJS 没有真正的漏斗图，使用横向柱状图模拟漏斗层级
  slide.addChart('bar', [{ name: props.title || '漏斗', labels, values }], {
    x: 0.6, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: 'FFFFFF', transparency: 40 },
      line: { color: 'E5E7EB', width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.primary,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.6, y: 5.75, w: 8.9, h: 0.3,
      fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
    });
  }
}

interface ChartRadarProps {
  title?: string;
  kicker?: string;
  indicators?: Array<{ name: string; max: number }>;
  data?: Array<{ name: string; value: number[] }>;
  insight?: ChartInsight;
}

export function renderChartRadar(slide: PptxSlide, props: ChartRadarProps): void {
  addKicker(slide, props.kicker);
  if (props.title) addTitle(slide, props.title);
  const indicators = props.indicators || [];
  const datasets = props.data || [];

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);

  if (indicators.length === 0 || datasets.length === 0) {
    slide.addText('（暂无图表数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const labels = indicators.map((i) => i.name);
  const chartData = datasets.map((d) => ({
    name: d.name,
    labels,
    values: d.value,
  }));
  const chartColors = datasets.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);
  const chartW = hasInsight ? 5.6 : 8.4;

  // pptxgenjs 3.12 运行时支持 radar，但当前类型定义较旧，使用 as any 绕过。
  slide.addChart('radar' as any, chartData, {
    x: 0.8, y: 2.3, w: chartW, h: 3.2,
    chartColors,
    showValue: true,
    dataLabelColor: COLORS.primary,
    dataLabelFontSize: 10,
  } as any);

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 6.5, y: 2.3, w: 3.0, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 6.7, y: cursorY, w: 2.6, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 6.7, y: cursorY, w: 2.6, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }
}
interface ContentV1Props {
  kicker?: string;
  title: string;
  points?: string[];
}

interface ProcessV1Props {
  kicker?: string;
  title: string;
  steps?: string[];
}

export function renderProcessV1(slide: PptxSlide, props: ProcessV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const steps = props.steps || [];
  const count = steps.length;
  if (count === 0) {
    slide.addText('（暂无流程步骤）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const stepWidth = 8.4 / count;
  steps.forEach((step, index) => {
    const x = 0.8 + index * stepWidth;
    slide.addShape('ellipse', {
      x: x + stepWidth / 2 - 0.3, y: 2.6, w: 0.6, h: 0.6,
      fill: { color: COLORS.accent },
    });
    slide.addText(String(index + 1), {
      x: x + stepWidth / 2 - 0.3, y: 2.6, w: 0.6, h: 0.6,
      fontSize: 22, color: COLORS.white, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
    slide.addText(step, {
      x: x + 0.1, y: 3.5, w: stepWidth - 0.2, h: 1.2,
      fontSize: 18, color: COLORS.primary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface TimelineV1Props {
  kicker?: string;
  title: string;
  milestones?: { date?: string; title?: string; description?: string }[];
}

export function renderTimelineV1(slide: PptxSlide, props: TimelineV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const milestones = (props.milestones || []).slice(0, 4);
  const count = milestones.length || 1;
  const stepWidth = 8.4 / count;
  milestones.forEach((m, index) => {
    const cx = 0.8 + stepWidth * index + stepWidth / 2;
    slide.addShape('ellipse', {
      x: cx - 0.2, y: 3.0, w: 0.4, h: 0.4,
      fill: { color: COLORS.accent },
    });
    slide.addShape('line', {
      x1: 0.8 + stepWidth * index, y1: 3.2, x2: 0.8 + stepWidth * (index + 1), y2: 3.2,
      line: { color: COLORS.border, width: 2 },
    });
    slide.addText(m.date || '', {
      x: cx - stepWidth / 2 + 0.1, y: 2.4, w: stepWidth - 0.2, h: 0.4,
      fontSize: 12, color: COLORS.accent, align: 'center', valign: 'top',
      fontFace: FONTS.mono,
    });
    slide.addText(m.title || '', {
      x: cx - stepWidth / 2 + 0.1, y: 3.6, w: stepWidth - 0.2, h: 0.4,
      fontSize: 14, color: COLORS.primary, bold: true, align: 'center', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(m.description || '', {
      x: cx - stepWidth / 2 + 0.1, y: 4.05, w: stepWidth - 0.2, h: 0.8,
      fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface RoadmapV1Props {
  kicker?: string;
  title: string;
  phases?: { title?: string; description?: string; status?: string }[];
}

function renderRoadmapV1(slide: PptxSlide, props: RoadmapV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const phases = (props.phases || []).slice(0, 4);
  let y = 2.1;
  phases.forEach((phase, index) => {
    const statusColor = phase.status === '已完成' ? COLORS.accent : COLORS.secondary;
    slide.addShape('rect', {
      x: 0.8, y, w: 0.2, h: 0.7,
      fill: { color: statusColor },
    });
    slide.addText(`${index + 1}. ${phase.title || ''}`, {
      x: 1.1, y, w: 7.8, h: 0.35,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(phase.description || '', {
      x: 1.1, y: y + 0.38, w: 7.8, h: 0.45,
      fontSize: 14, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.8;
  });
}
interface TestimonialV1Props {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
}

export function renderTestimonialV1(slide: PptxSlide, props: TestimonialV1Props): void {
  slide.addText(`“${props.quote}”`, {
    x: 1, y: 1.8, w: 8, h: 2.2,
    fontSize: 34, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  if (props.avatarUrl) addImageMaybe(slide, props.avatarUrl, 4.5, 4.1, 1, 1);
  const attribution = [props.author, props.role, props.company].filter(Boolean).join(' · ');
  if (attribution) {
    slide.addText(attribution, {
      x: 1, y: 5.0, w: 8, h: 0.4,
      fontSize: 16, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.mono,
    });
  }
}

interface FaqV1Props {
  kicker?: string;
  title: string;
  items?: { q?: string; a?: string }[];
}

export function renderFaqV1(slide: PptxSlide, props: FaqV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const items = (props.items || []).slice(0, 4);
  let y = 2.0;
  items.forEach((item) => {
    slide.addText(`Q: ${item.q || ''}`, {
      x: 0.8, y, w: 8.4, h: 0.32,
      fontSize: 18, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(`A: ${item.a || ''}`, {
      x: 0.8, y: y + 0.37, w: 8.4, h: 0.43,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
    y += 0.85;
  });
}

interface FeatureV1Props {
  kicker?: string;
  title: string;
  features?: { title?: string; description?: string }[];
}

export function renderFeatureV1(slide: PptxSlide, props: FeatureV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const features = (props.features || []).slice(0, 3);
  const cardWidth = 2.6;
  const gap = 0.3;
  const startX = (10 - (features.length * cardWidth + (features.length - 1) * gap)) / 2;
  features.forEach((feature, index) => {
    const x = startX + index * (cardWidth + gap);
    slide.addShape('rect', {
      x, y: 2.8, w: cardWidth, h: 2.2,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(feature.title || '', {
      x: x + 0.15, y: 3.0, w: cardWidth - 0.3, h: 0.5,
      fontSize: 20, color: COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText(feature.description || '', {
      x: x + 0.15, y: 3.6, w: cardWidth - 0.3, h: 1.2,
      fontSize: 14, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}
interface TeamV1Props {
  kicker?: string;
  title: string;
  members?: { name?: string; role?: string; bio?: string; imageUrl?: string }[];
}

export function renderTeamV1(slide: PptxSlide, props: TeamV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const members = (props.members || []).slice(0, 4);
  const cardWidth = 2.0;
  const gap = 0.4;
  const startX = (10 - (members.length * cardWidth + (members.length - 1) * gap)) / 2;
  members.forEach((member, index) => {
    const x = startX + index * (cardWidth + gap);
    if (member.imageUrl) addImageMaybe(slide, member.imageUrl, x + 0.5, 2.7, 1, 1);
    slide.addText(member.name || '', {
      x, y: 3.85, w: cardWidth, h: 0.35,
      fontSize: 16, color: COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText(member.role || '', {
      x, y: 4.2, w: cardWidth, h: 0.3,
      fontSize: 12, color: COLORS.accent, align: 'center',
      fontFace: FONTS.mono,
    });
    slide.addText(member.bio || '', {
      x, y: 4.55, w: cardWidth, h: 0.55,
      fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}

interface PartnersV1Props {
  kicker?: string;
  title: string;
  partners?: { name?: string; logoUrl?: string }[];
}

export function renderPartnersV1(slide: PptxSlide, props: PartnersV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const partners = (props.partners || []).slice(0, 8);
  const cols = 4;
  const cellW = 2.0;
  const cellH = 1.1;
  const gapX = 0.4;
  const gapY = 0.3;
  const startX = (10 - (cols * cellW + (cols - 1) * gapX)) / 2;
  partners.forEach((partner, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = startX + col * (cellW + gapX);
    const y = 2.5 + row * (cellH + gapY);
    slide.addShape('rect', {
      x, y, w: cellW, h: cellH,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    if (partner.logoUrl) addImageMaybe(slide, partner.logoUrl, x + 0.25, y + 0.15, cellW - 0.5, cellH - 0.5);
    slide.addText(partner.name || '', {
      x, y: y + cellH - 0.25, w: cellW, h: 0.25,
      fontSize: 12, color: COLORS.secondary, align: 'center',
      fontFace: FONTS.body,
    });
  });
}

interface PricingV1Props {
  kicker?: string;
  title: string;
  tiers?: { name?: string; price?: string; period?: string; features?: string[]; cta?: string }[];
}

export function renderPricingV1(slide: PptxSlide, props: PricingV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  const tiers = (props.tiers || []).slice(0, 3);
  const cardWidth = 2.5;
  const gap = 0.35;
  const startX = (10 - (tiers.length * cardWidth + (tiers.length - 1) * gap)) / 2;
  tiers.forEach((tier, index) => {
    const x = startX + index * (cardWidth + gap);
    const isHighlight = index === 1;
    slide.addShape('rect', {
      x, y: 2.6, w: cardWidth, h: 2.6,
      fill: { color: isHighlight ? COLORS.accent : COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(tier.name || '', {
      x, y: 2.8, w: cardWidth, h: 0.4,
      fontSize: 18, color: isHighlight ? COLORS.white : COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    slide.addText([tier.price, tier.period].filter(Boolean).join(' '), {
      x, y: 3.25, w: cardWidth, h: 0.5,
      fontSize: 24, color: isHighlight ? COLORS.white : COLORS.primary, bold: true, align: 'center',
      fontFace: FONTS.heading,
    });
    const features = (tier.features || []).slice(0, 3);
    let fy = 3.85;
    features.forEach((feature) => {
      slide.addText(feature, {
        x: x + 0.15, y: fy, w: cardWidth - 0.3, h: 0.3,
        fontSize: 12, color: isHighlight ? COLORS.white : COLORS.secondary, align: 'center',
        fontFace: FONTS.body,
      });
      fy += 0.35;
    });
    if (tier.cta) {
      slide.addText(tier.cta, {
        x: x + 0.3, y: 4.8, w: cardWidth - 0.6, h: 0.3,
        fontSize: 12, color: isHighlight ? COLORS.accent : COLORS.white,
        fill: isHighlight ? { color: COLORS.white } : { color: COLORS.accent },
        align: 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    }
  });
}

interface ImageV1Props {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function renderImageV1(slide: PptxSlide, props: ImageV1Props): void {
  if (props.imageUrl) {
    addImageMaybe(slide, props.imageUrl, 0, 0, 10, 5.625);
    slide.addShape('rect', {
      x: 0, y: 0, w: 10, h: 5.625,
      fill: { color: '000000', transparency: 40 },
    });
  }
  slide.addText(props.title, {
    x: 1, y: 2.4, w: 8, h: 1.0,
    fontSize: 48, color: COLORS.white, bold: true, align: 'center',
    fontFace: FONTS.heading,
  });
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 1.5, y: 3.5, w: 7, h: 0.7,
      fontSize: 22, color: COLORS.white, align: 'center',
      fontFace: FONTS.body,
    });
  }
}

interface SwotV1Props {
  title: string;
  kicker?: string;
  strength?: string;
  weakness?: string;
  opportunity?: string;
  threat?: string;
}

export function renderSwotV1(slide: PptxSlide, props: SwotV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  render2x2Grid(slide, [
    { title: '优势 Strengths', text: props.strength || '' },
    { title: '劣势 Weaknesses', text: props.weakness || '' },
    { title: '机会 Opportunities', text: props.opportunity || '' },
    { title: '威胁 Threats', text: props.threat || '' },
  ]);
}

interface PestV1Props {
  title: string;
  kicker?: string;
  political?: string;
  economic?: string;
  social?: string;
  technological?: string;
}

export function renderPestV1(slide: PptxSlide, props: PestV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title);
  render2x2Grid(slide, [
    { title: '政治 Political', text: props.political || '' },
    { title: '经济 Economic', text: props.economic || '' },
    { title: '社会 Social', text: props.social || '' },
    { title: '技术 Technological', text: props.technological || '' },
  ]);
}

function render2x2Grid(slide: PptxSlide, cells: { title: string; text: string }[]): void {
  const positions = [
    { x: 0.8, y: 2.5 },
    { x: 5.2, y: 2.5 },
    { x: 0.8, y: 4.1 },
    { x: 5.2, y: 4.1 },
  ];
  cells.forEach((cell, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 4.0, h: 1.4,
      fill: { color: COLORS.light },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(cell.title, {
      x: pos.x + 0.15, y: pos.y + 0.1, w: 3.7, h: 0.35,
      fontSize: 16, color: COLORS.accent, bold: true, align: 'left',
      fontFace: FONTS.heading,
    });
    slide.addText(cell.text, {
      x: pos.x + 0.15, y: pos.y + 0.5, w: 3.7, h: 0.8,
      fontSize: 13, color: COLORS.primary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  });
}
// ---- Theme01 P3 special layout renderers ----------------------------------
interface Theme01GalleryV1Props {
  kicker?: string;
  title?: string;
  images?: { url?: string; caption?: string }[];
}

export function renderTheme01GalleryV1(slide: PptxSlide, props: Theme01GalleryV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Gallery');
  const images = (props.images || []).slice(0, 4);
  const positions = [
    { x: 0.8, y: 2.5 },
    { x: 5.2, y: 2.5 },
    { x: 0.8, y: 4.0 },
    { x: 5.2, y: 4.0 },
  ];
  images.forEach((image, index) => {
    const pos = positions[index];
    if (!pos) return;
    slide.addShape('rect', {
      x: pos.x, y: pos.y, w: 4.0, h: 1.3,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    if (image.url) addImageMaybe(slide, image.url, pos.x + 0.08, pos.y + 0.08, 3.84, 0.9);
    if (image.caption) {
      slide.addText(image.caption, {
        x: pos.x, y: pos.y + 1.05, w: 4.0, h: 0.25,
        fontSize: 12, color: COLORS.secondary, align: 'center',
        fontFace: FONTS.body,
      });
    }
  });
}

interface Theme01TableV1Props {
  kicker?: string;
  title?: string;
  headers?: string[];
  rows?: string[][];
  highlightFirstColumn?: boolean;
}

export function renderTheme01TableV1(slide: PptxSlide, props: Theme01TableV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Table');
  const headers = props.headers || [];
  const rows = (props.rows || []).slice(0, 6);
  if (rows.length === 0) {
    slide.addText('（暂无表格数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const colCount = Math.max(headers.length, rows[0]?.length || 1);
  const tableW = 8.4;
  const startX = 0.8;
  const startY = 2.5;
  const rowH = 0.45;
  const colW = tableW / colCount;

  // Header
  headers.forEach((header, index) => {
    const x = startX + index * colW;
    slide.addShape('rect', {
      x, y: startY, w: colW, h: rowH,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
    });
    slide.addText(header, {
      x, y: startY, w: colW, h: rowH,
      fontSize: 12, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.heading,
    });
  });

  // Rows
  rows.forEach((row, rowIndex) => {
    const y = startY + rowH * (rowIndex + 1);
    const bg = rowIndex % 2 === 0 ? COLORS.surface : COLORS.surfaceElevated;
    row.forEach((cell, colIndex) => {
      const x = startX + colIndex * colW;
      slide.addShape('rect', {
        x, y, w: colW, h: rowH,
        fill: { color: bg },
        line: { color: COLORS.border, width: 1 },
      });
      slide.addText(cell ?? '', {
        x: x + 0.06, y, w: colW - 0.12, h: rowH,
        fontSize: 11, color: props.highlightFirstColumn && colIndex === 0 ? COLORS.primary : COLORS.secondary,
        bold: props.highlightFirstColumn && colIndex === 0,
        align: colIndex === 0 ? 'left' : 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    });
  });
}

interface Theme01TagsV1Props {
  kicker?: string;
  title?: string;
  tags?: { label?: string; value?: number; tone?: 'neutral' | 'positive' | 'negative' | 'accent' }[];
}

export function renderTheme01TagsV1(slide: PptxSlide, props: Theme01TagsV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Tags');
  const tags = (props.tags || []).slice(0, 18);
  if (tags.length === 0) {
    slide.addText('（暂无标签）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const toneColors: Record<string, { text: string; bg: string }> = {
    positive: { text: '10B981', bg: 'D1FAE5' },
    negative: { text: 'EF4444', bg: 'FEE2E2' },
    accent: { text: COLORS.accent, bg: 'DBEAFE' },
  };

  let x = 0.8;
  let y = 2.5;
  const maxW = 8.4;
  const gap = 0.15;
  const tagH = 0.42;

  tags.forEach((tag) => {
    const label = tag.label ?? '';
    const valueText = tag.value !== undefined && tag.value > 0 ? ` ${tag.value}` : '';
    const text = `${label}${valueText}`;
    const textW = Math.min(Math.max(text.length * 0.09 + 0.3, 0.7), 2.2);
    const tone = toneColors[tag.tone ?? ''] ?? { text: COLORS.secondary, bg: COLORS.surfaceElevated };
    const color = tone.text;
    const bgColor = tone.bg;

    if (x + textW > 0.8 + maxW) {
      x = 0.8;
      y += tagH + gap;
    }

    slide.addShape('roundRect', {
      x, y, w: textW, h: tagH,
      fill: { color: bgColor },
      line: { color: tag.tone ? color : COLORS.border, width: 1 },
      rectRadius: 0.21,
    });
    slide.addText(text, {
      x, y, w: textW, h: tagH,
      fontSize: 11, color, bold: true, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    x += textW + gap;
  });
}

interface Theme01FilmstripV1Props {
  kicker?: string;
  title?: string;
  images?: { url?: string; caption?: string }[];
}

export function renderTheme01FilmstripV1(slide: PptxSlide, props: Theme01FilmstripV1Props): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? 'Filmstrip');
  const images = (props.images || []).slice(0, 5);
  if (images.length === 0) {
    slide.addText('（暂无影像）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const gap = 0.2;
  const frameW = (8.4 - gap * (images.length - 1)) / images.length;
  const startX = 0.8;
  const y = 2.5;
  const imgH = 2.2;

  images.forEach((image, index) => {
    const x = startX + index * (frameW + gap);
    slide.addShape('rect', {
      x, y, w: frameW, h: imgH + 0.5,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.08,
    });
    if (image.url) addImageMaybe(slide, image.url, x + 0.06, y + 0.06, frameW - 0.12, imgH);
    if (image.caption) {
      slide.addText(image.caption, {
        x, y: y + imgH + 0.08, w: frameW, h: 0.35,
        fontSize: 11, color: COLORS.secondary, align: 'center', valign: 'middle',
        fontFace: FONTS.body,
      });
    }
  });
}

// ---- Theme01 P0/P1 变体适配渲染器 -----------------------------------------
interface Theme01RoadmapV1Props {
  kicker?: string;
  title?: string;
  phases?: { phase?: string; items?: string[] }[];
}

export function renderTheme01RoadmapV1(slide: PptxSlide, props: Theme01RoadmapV1Props): void {
  const phases = (props.phases || []).map((p) => ({
    title: p.phase || '',
    description: (p.items || []).join('\n'),
  }));
  renderRoadmapV1(slide, { kicker: props.kicker, title: props.title ?? '路线图', phases });
}
// ---- Theme01 recently added layout renderers -------------------------------

interface Theme01MetricBigProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  value?: string;
  unit?: string;
  context?: string;
  metrics?: { value?: string; label?: string; accent?: boolean }[];
  footnote?: string;
  showInsight?: boolean;
  insight?: SimpleInsight;
}

export function renderTheme01MetricBig(slide: PptxSlide, props: Theme01MetricBigProps): void {
  const hasInsight = props.showInsight !== false && !!props.insight && (!!props.insight.value || !!props.insight.label || !!props.insight.description);
  const mainW = hasInsight ? 6.8 : 8.4;
  const mainX = 0.8;

  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '核心指标', mainX, 1.3, mainW);
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: mainX, y: 2.05, w: mainW, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const valueText = [props.value, props.unit].filter(Boolean).join(' ') || '0';
  slide.addText(valueText, {
    x: mainX, y: 2.7, w: mainW, h: 1.2,
    fontSize: hasInsight ? 60 : 72, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });

  if (props.context) {
    slide.addText(props.context, {
      x: mainX + (hasInsight ? 0.7 : 0.7), y: 4.0, w: hasInsight ? mainW - 1.4 : 7.0, h: 0.6,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const metrics = (props.metrics || []).filter((m) => m != null && (m.value || m.label)).slice(0, 4);
  if (metrics.length > 0) {
    const count = metrics.length;
    const gap = 0.25;
    const cardW = (mainW - gap * (count - 1)) / count;
    const startX = mainX;
    const y = 4.85;
    const h = 0.65;

    metrics.forEach((metric, index) => {
      const x = startX + index * (cardW + gap);
      const bg = metric.accent ? COLORS.accent : COLORS.surfaceElevated;
      const textColor = metric.accent ? COLORS.white : COLORS.primary;
      slide.addShape('rect', {
        x, y, w: cardW, h,
        fill: { color: bg },
        line: { color: COLORS.border, width: 1 },
        rectRadius: 0.1,
      });
      slide.addText(metric.value || '', {
        x: x + 0.1, y: y + 0.08, w: cardW - 0.2, h: 0.32,
        fontSize: 18, color: textColor, bold: true, align: 'center', valign: 'top',
        fontFace: FONTS.heading,
      });
      slide.addText(metric.label || '', {
        x: x + 0.1, y: y + 0.36, w: cardW - 0.2, h: 0.24,
        fontSize: 11, color: metric.accent ? COLORS.white : COLORS.secondary, align: 'center', valign: 'top',
        fontFace: FONTS.body,
      });
    });
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: mainX, y: 5.7, w: mainW, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }

  if (hasInsight) {
    renderInsightPanel(slide, props.insight, 8.0, 2.3, 2.4, 3.2);
  }
}

interface Theme01ChartDonutSegment {
  label?: string;
  labelEn?: string;
  value?: string;
  percent?: string;
  color?: string;
}

interface Theme01ChartDonutProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  total?: { value?: string; label?: string };
  segments?: Theme01ChartDonutSegment[];
  insight?: ChartInsight;
  footnote?: string;
}

export function renderTheme01ChartDonut(slide: PptxSlide, props: Theme01ChartDonutProps): void {
  addKicker(slide, props.kicker);
  addTitle(slide, props.title ?? '环形图');
  if (props.subtitle) {
    slide.addText(props.subtitle, {
      x: 0.8, y: 2.05, w: 8.4, h: 0.35,
      fontSize: 16, color: COLORS.secondary, align: 'left', valign: 'top',
      fontFace: FONTS.body,
    });
  }

  const rawSegments = (props.segments || [])
    .filter((s) => s != null && !!(s.label || s.value))
    .map((s) => ({ ...s }))
    .sort((a, b) => {
      const na = parseFloat(String(a.value || '0').replace(/,/g, ''));
      const nb = parseFloat(String(b.value || '0').replace(/,/g, ''));
      return nb - na;
    });

  if (rawSegments.length === 0) {
    slide.addText('（暂无环形图数据）', {
      x: 2, y: 3.2, w: 6, h: 0.8,
      fontSize: 18, color: COLORS.secondary, align: 'center', valign: 'middle',
      fontFace: FONTS.body,
    });
    return;
  }

  const totalValue = rawSegments.reduce((sum, s) => {
    return sum + parseFloat(String(s.value || '0').replace(/,/g, ''));
  }, 0);

  const segments = rawSegments.map((s, i) => {
    const n = parseFloat(String(s.value || '0').replace(/,/g, ''));
    const pct = totalValue > 0 ? Math.round((n / totalValue) * 1000) / 10 : 0;
    return {
      ...s,
      percent: s.percent || `${pct}%`,
      numericValue: n,
      color: s.color || `var(--lp-${['blue', 'green', 'amber', 'red', 'violet'][i % 5]})`,
    };
  });

  const labels = segments.map((s) => s.label || '');
  const values = segments.map((s) => s.numericValue);
  const chartColors = segments.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  const insight = props.insight;
  const hasInsight = !!insight && (!!insight.value || !!insight.label || !!insight.description);

  const chartW = hasInsight ? 4.2 : 4.8;
  slide.addChart('doughnut' as 'pie', [
    { name: props.title || '', labels, values },
  ], {
    x: 0.6, y: 2.4, w: chartW, h: 3.0,
    chartColors,
    showValue: false,
    holeSize: 60,
  } as any);

  const total = props.total || { value: String(totalValue), label: '合计' };
  const centerX = 0.6 + chartW / 2;
  slide.addText(total.value || String(totalValue), {
    x: centerX - 1.8, y: 3.4, w: 3.6, h: 0.6,
    fontSize: 28, color: COLORS.primary, bold: true, align: 'center', valign: 'middle',
    fontFace: FONTS.heading,
  });
  slide.addText(total.label || '合计', {
    x: centerX - 1.8, y: 4.0, w: 3.6, h: 0.3,
    fontSize: 12, color: COLORS.secondary, align: 'center', valign: 'top',
    fontFace: FONTS.body,
  });

  // 右侧图例列表
  const legendX = hasInsight ? 5.0 : 5.7;
  const legendW = hasInsight ? 2.6 : 3.3;
  let legendY = 2.5;
  segments.forEach((segment, index) => {
    const color = chartColors[index % chartColors.length];
    slide.addShape('ellipse', {
      x: legendX, y: legendY + 0.08, w: 0.18, h: 0.18,
      fill: { color },
    });
    slide.addText(segment.label || '', {
      x: legendX + 0.3, y: legendY, w: legendW - 1.4, h: 0.28,
      fontSize: 13, color: COLORS.primary, bold: true, align: 'left', valign: 'top',
      fontFace: FONTS.heading,
    });
    if (segment.labelEn) {
      slide.addText(segment.labelEn, {
        x: legendX + 0.3, y: legendY + 0.26, w: legendW - 1.4, h: 0.22,
        fontSize: 10, color: COLORS.secondary, align: 'left', valign: 'top',
        fontFace: FONTS.body,
      });
    }
    slide.addText(segment.percent || '', {
      x: legendX + legendW - 1.0, y: legendY, w: 0.9, h: 0.28,
      fontSize: 13, color: COLORS.accent, bold: true, align: 'right', valign: 'top',
      fontFace: FONTS.heading,
    });
    slide.addText(segment.value || '', {
      x: legendX + legendW - 1.0, y: legendY + 0.26, w: 0.9, h: 0.22,
      fontSize: 10, color: COLORS.secondary, align: 'right', valign: 'top',
      fontFace: FONTS.mono,
    });
    legendY += segment.labelEn ? 0.65 : 0.5;
  });

  if (hasInsight) {
    slide.addShape('roundRect', {
      x: 8.0, y: 2.3, w: 2.4, h: 3.2,
      fill: { color: COLORS.surfaceElevated },
      line: { color: COLORS.border, width: 1 },
      rectRadius: 0.15,
    });

    let cursorY = 2.6;
    if (insight.value) {
      slide.addText(insight.value, {
        x: 8.2, y: cursorY, w: 2.0, h: 0.6,
        fontSize: 34, fontFace: FONTS.heading, bold: true, color: COLORS.accent,
      });
      cursorY += 0.6;
    }
    if (insight.label) {
      slide.addText(insight.label, {
        x: 8.2, y: cursorY, w: 2.0, h: 0.3,
        fontSize: 10, fontFace: FONTS.body, color: COLORS.secondary,
      });
      cursorY += 0.45;
    }
    if (insight.description) {
      cursorY += 0.15;
      slide.addText(insight.description, {
        x: 8.2, y: cursorY, w: 2.0, h: 1.6,
        fontSize: 11, fontFace: FONTS.body, color: COLORS.secondary,
        valign: 'top',
      });
    }
  }

  if (props.footnote) {
    slide.addText(props.footnote, {
      x: 0.6, y: 5.7, w: 8.8, h: 0.25,
      fontSize: 11, color: COLORS.secondary, align: 'left',
      fontFace: FONTS.mono,
    });
  }
}
// ---- PPTX renderer registration -------------------------------------------

// Theme01 主题专属版式渲染器注册

// ---- Theme02 adapters ------------------------------------------------------

export interface Theme02ChapterV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  number?: string;
}


export interface Theme02ChapterV2Props {
  number?: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
}


export interface Theme02QuoteV2Props {
  quote: string;
  author?: string;
  role?: string;
  source?: string;
}


export interface Theme02NumberShowcaseV1Props {
  kicker?: string;
  title?: string;
  value?: string;
  unit?: string;
  description?: string;
  footnote?: string;
}


export interface Theme02ChartV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'area' | 'pie';
  labels?: string[];
  data?: number[];
  unit?: string;
  insight?: ChartV1Insight;
  footnote?: string;
}


export interface Theme02ContentV1Props {
  title?: string;
  subtitle?: string;
  kicker?: string;
  bullets?: string[];
}


interface Theme02DeltaItem {
  label?: string;
  previous?: number;
  current?: number;
  unit?: string;
}

export interface Theme02DeltaV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  items?: Theme02DeltaItem[];
  footnote?: string;
  showInsight?: boolean;
  insight?: SimpleInsight;
}


export interface Theme02TableOfContentsV1Props {
  title?: string;
  subtitle?: string;
  items?: Array<{ title: string; page?: string }>;
}


export interface Theme02ImageV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  image: string;
  caption?: string;
}


export interface Theme02QuoteV1Props {
  quote: string;
  author?: string;
  role?: string;
  avatar?: string;
}


export interface Theme02BentoV1Props {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items?: Array<{ label: string; value: string; unit?: string; size?: 'small' | 'medium' | 'large' }>;
  showInsight?: boolean;
  insight?: SimpleInsight;
}


export interface Theme02ProcessV1Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  steps?: Array<{ title?: string; description?: string }>;
}


interface Theme02ProgressItem {
  label?: string;
  value?: number;
  max?: number;
  unit?: string;
}

export interface Theme02ProgressV1Props {
  title?: string;
  kicker?: string;
  subtitle?: string;
  items?: Theme02ProgressItem[];
}


// ---- Theme02 Batch A adapters ------------------------------------------

interface Theme02FeatureV2Item { icon?: string; title: string; desc?: string; }
export interface Theme02FeatureV2Props {
  kicker?: string; title?: string; subtitle?: string;
  features?: Theme02FeatureV2Item[];
}


interface Theme02ChecklistV1Item { text: string; note?: string; }
export interface Theme02ChecklistV1Props {
  kicker?: string; title?: string; subtitle?: string;
  items?: Theme02ChecklistV1Item[];
}


interface Theme02StepsV1Step { title: string; desc?: string; }
export interface Theme02StepsV1Props {
  kicker?: string; title?: string; subtitle?: string;
  steps?: Theme02StepsV1Step[];
}


interface Theme02CardGridV1Card { title: string; desc?: string; tag?: string; }
export interface Theme02CardGridV1Props {
  kicker?: string; title?: string; subtitle?: string;
  cards?: Theme02CardGridV1Card[];
}


export interface Theme02HighlightV1Props {
  kicker?: string; title?: string; statement?: string; footnote?: string;
}


interface Theme02ComparisonV2Column { title: string; points?: string[]; }
export interface Theme02ComparisonV2Props {
  kicker?: string; title?: string; subtitle?: string;
  columns?: Theme02ComparisonV2Column[];
}


interface Theme02MatrixV1Quadrant { title: string; desc?: string; }
export interface Theme02MatrixV1Props {
  kicker?: string; title?: string; subtitle?: string;
  axisX?: string; axisY?: string;
  quadrants?: Theme02MatrixV1Quadrant[];
}


interface Theme02StatGridV1Stat { value: string; unit?: string; label?: string; delta?: string; }
export interface Theme02StatGridV1Props {
  kicker?: string; title?: string; subtitle?: string;
  stats?: Theme02StatGridV1Stat[];
}


export interface Theme02CoverV3Props {
  kicker?: string; title?: string; subtitle?: string; date?: string;
}


export interface Theme02ClosingV2Props {
  kicker?: string; title?: string; subtitle?: string; cta?: string;
}


// Theme02 版式复用 theme01 的渲染函数，视觉差异由主题色板控制

// ---- Theme02 Batch B/C/D adapters ------------------------------------------

export const T2_CHART = ['00E5B0', 'FFD166', '00B4FF', 'FF6B6B', 'A78BFA', 'F472B6'];

interface Theme02ChartSeries { name?: string; values?: number[]; }

export interface Theme02ChartBarV1Props {
  kicker?: string; title?: string; subtitle?: string; unit?: string;
  labels?: string[]; series?: Theme02ChartSeries[];
}

export interface Theme02ChartLineV1Props {
  kicker?: string; title?: string; subtitle?: string; unit?: string;
  labels?: string[]; series?: Theme02ChartSeries[];
}

export interface Theme02ChartAreaV1Props {
  kicker?: string; title?: string; subtitle?: string; unit?: string;
  labels?: string[]; series?: Theme02ChartSeries[];
}

export interface Theme02ChartStackV1Props {
  kicker?: string; title?: string; subtitle?: string; unit?: string;
  labels?: string[]; series?: Theme02ChartSeries[];
}

interface Theme02KpiStripV1Item { value?: string; unit?: string; label?: string; delta?: string; }
export interface Theme02KpiStripV1Props {
  kicker?: string; title?: string; subtitle?: string; items?: Theme02KpiStripV1Item[];
}

export interface Theme02BigStatV1Props {
  kicker?: string; title?: string; value?: string; unit?: string; label?: string; footnote?: string; delta?: string;
}

interface Theme02CycleV1Step { title: string; desc?: string; }
export interface Theme02CycleV1Props {
  kicker?: string; title?: string; subtitle?: string; steps?: Theme02CycleV1Step[];
}

interface Theme02SwimlaneV1Lane { name?: string; items?: string[]; }
export interface Theme02SwimlaneV1Props {
  kicker?: string; title?: string; subtitle?: string; phases?: string[]; lanes?: Theme02SwimlaneV1Lane[];
}

interface Theme02PyramidV1Level { title: string; desc?: string; }
export interface Theme02PyramidV1Props {
  kicker?: string; title?: string; subtitle?: string; levels?: Theme02PyramidV1Level[];
}

interface Theme02OrgChartV1Node { title?: string; sub?: string; }
export interface Theme02OrgChartV1Props {
  kicker?: string; title?: string; subtitle?: string; root?: Theme02OrgChartV1Node; children?: Theme02OrgChartV1Node[];
}

interface Theme02FlowV1Step { title: string; desc?: string; }
export interface Theme02FlowV1Props {
  kicker?: string; title?: string; subtitle?: string; steps?: Theme02FlowV1Step[];
}

export interface Theme02TableV2Props {
  kicker?: string; title?: string; subtitle?: string; columns?: string[]; rows?: string[][];
}

export interface Theme02ImageSplitV1Props {
  kicker?: string; title?: string; subtitle?: string; bullets?: string[]; image?: string;
}

export interface Theme02ImageGridV2Props {
  kicker?: string; title?: string; subtitle?: string; images?: string[]; captions?: string[];
}

export interface Theme02SpotlightV1Props {
  kicker?: string; title?: string; subtitle?: string; image?: string; caption?: string;
}

export interface Theme02ChapterV3Props {
  kicker?: string; number?: string; title?: string; subtitle?: string;
}

export interface Theme02SectionDividerV1Props {
  kicker?: string; title?: string; subtitle?: string; index?: string;
}

interface Theme02LogoWallV1Logo { name?: string; sub?: string; }
export interface Theme02LogoWallV1Props {
  kicker?: string; title?: string; subtitle?: string; logos?: Theme02LogoWallV1Logo[];
}


// ---- theme03 PPTX renderers ------------------------------------------------

interface Theme03TopbarProps {
  tag?: string;
  tagLabel?: string;
  topRightMeta?: string;
}

interface Theme03FooterProps {
  footnoteLeft?: string;
  footnoteRight?: string;
}

export function theme03TitleText(title: string): { text: string; options: Record<string, unknown> }[] {
  const parts = title.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part) => {
    const match = part.match(/^\{\{(.+)\}\}$/);
    if (match) {
      return { text: match[1], options: { color: COLORS.accent, bold: true } };
    }
    return { text: part, options: { color: COLORS.primary, bold: true } };
  });
}

export function addTheme03Topbar(slide: PptxSlide, props: Theme03TopbarProps): void {
  const tagText = [props.tag, props.tagLabel].filter(Boolean).join(' · ');
  if (tagText) {
    slide.addText(tagText, {
      x: 0.84375, y: 0.71875, w: 4, h: 0.25,
      fontSize: 12, color: COLORS.accent, fontFace: FONTS.mono,
      valign: 'middle',
    });
  }
  if (props.topRightMeta) {
    slide.addText(props.topRightMeta, {
      x: 5.15625, y: 0.71875, w: 4, h: 0.25,
      fontSize: 11, color: COLORS.secondary, fontFace: FONTS.mono,
      align: 'right', valign: 'middle',
    });
  }
}

export function addTheme03Footer(slide: PptxSlide, props: Theme03FooterProps): void {
  const y = 5.625 - 0.65625;
  slide.addShape('line', {
    x1: 0.84375, y1: y - 0.1, x2: 9.15625, y2: y - 0.1,
    line: { color: COLORS.border, width: 1 },
  });
  if (props.footnoteLeft) {
    slide.addText(props.footnoteLeft, {
      x: 0.84375, y: y, w: 4, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      valign: 'top',
    });
  }
  if (props.footnoteRight) {
    slide.addText(props.footnoteRight, {
      x: 5.15625, y: y, w: 4, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
      align: 'right', valign: 'top',
    });
  }
}






























export function getTheme03PricingFeatureValue(feature: { value?: string } | string | undefined): string | undefined {
  if (feature == null) return undefined;
  if (typeof feature === 'string') return feature;
  return feature.value;
}


export function getTheme03ComparisonValue(item: { value?: string } | string | undefined): string | undefined {
  if (item == null) return undefined;
  if (typeof item === 'string') return item;
  return item.value;
}

















































// ---- Theme04 renderers -----------------------------------------------------

















export function totalForSegments(segments: any[], current: any): string {
  const total = segments.reduce((sum, s) => sum + (Number(String(s.value || '0').replace(/,/g, '')) || 0), 0);
  const value = Number(String(current.value || '0').replace(/,/g, '')) || 0;
  if (total <= 0) return '0';
  return String(Math.round((value / total) * 100));
}

































interface TreemapRect {
  x: number;
  y: number;
  w: number;
  h: number;
  item: any;
}

export function layoutTreemap(items: any[], x: number, y: number, w: number, h: number): TreemapRect[] {
  const validItems = (items || []).filter((it) => (it.value ?? 0) > 0);
  if (validItems.length === 0) return [];
  if (validItems.length === 1) {
    return [{ x, y, w, h, item: validItems[0] }];
  }

  const total = validItems.reduce((sum, it) => sum + (it.value ?? 0), 0);
  const sorted = [...validItems].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

  // Split direction: favor the longer dimension
  const vertical = w >= h;
  const results: TreemapRect[] = [];
  let currentPos = vertical ? x : y;
  const primary = vertical ? w : h;

  sorted.forEach((item, idx) => {
    const ratio = (item.value ?? 0) / total;
    const size = idx === sorted.length - 1 ? (vertical ? x + w - currentPos : y + h - currentPos) : primary * ratio;
    if (vertical) {
      results.push({ x: currentPos, y, w: size, h, item });
      currentPos += size;
    } else {
      results.push({ x, y: currentPos, w, h: size, item });
      currentPos += size;
    }
  });

  return results;
}































// ---- Theme06 深色图谱风版式渲染器 -----------------------------------------






























// ---- Theme06 Phase 3/4 新版式渲染器 ---------------------------------------













// ---- Theme06 Phase 1 + Phase 2 新版式渲染器 --------------------------------

















































// ---- Theme05 光谱报告风版式渲染器 -----------------------------------------





















// ---- Theme05 Phase A / Phase B 新增版式渲染器 -----------------------------

















// ---- Theme05 Phase B 新版式渲染器 -----------------------------------------







// ---- Theme05 Phase C 版式渲染函数 -----------------------------------------













// Theme05 光谱报告风版式注册

// Phase A 回填

// Phase B 新版式

// Phase C 新版式

// Theme06 深色图谱风版式注册


// ==================== Theme07 冷白调研风 PPTX 渲染器 ====================
// 坐标系：10" × 5.625"，页面内边距 0.65"，圆角 0.08"
// 设计：冷白底 + 深墨文字 + 深靛蓝主色 + 衬线标题

/** theme07 通用装饰线（底部渐变线） */
export function addTheme07GlowLine(slide: PptxSlide): void {
  slide.addShape('line', {
    x1: 0.65, y1: 5.05, x2: 9.35, y2: 5.05,
    line: { color: COLORS.accent, width: 2, transparency: 60 },
  } as any);
}

/** theme07 通用卡片（冷白底 + 细边框 + 圆角） */
export function addTheme07Card(slide: PptxSlide, x: number, y: number, w: number, h: number, radius = 0.08, fill = COLORS.surface): void {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: fill },
    line: { color: COLORS.border, width: 1 },
    rectRadius: radius,
  } as any);
}

/** theme07 通用页脚 */
export function addTheme07Footer(slide: PptxSlide, props: any): void {
  if (props.footnoteLeft) {
    slide.addText(props.footnoteLeft, {
      x: 0.65, y: 5.2, w: 4, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono,
    });
  }
  if (props.footnoteRight) {
    slide.addText(props.footnoteRight, {
      x: 8.7, y: 5.2, w: 0.65, h: 0.25,
      fontSize: 10, color: COLORS.secondary, fontFace: FONTS.mono, align: 'right',
    });
  }
}

/** theme07 通用顶部标签（kicker） */
export function addTheme07Kicker(slide: PptxSlide, text: string, x = 0.65, y = 0.55): void {
  slide.addText(text, {
    x, y, w: 8, h: 0.3,
    fontSize: 11, color: COLORS.accent, bold: true, fontFace: FONTS.mono,
    charSpacing: 2,
  });
}

/** 将 theme07 CSS 变量名解析为 PPTX 可用 HEX（去掉 var(--lp-...) 包装） */
export function resolveTheme07CssColor(value?: string, fallback = COLORS.accent): string {
  if (!value) return fallback;
  const inner = value.replace('var(--lp-', '').replace(')', '').trim();
  const map: Record<string, string> = {
    accent: '2E5C8A',
    'accent-2': '7B9E7B',
    'accent-cool': 'B8623E',
    blue: '5B9BD5',
    ink: '1A1D23',
    ink2: '1A1D23',
    ink3: '6B7280',
    red: 'C73E2F',
    orange: 'C25E00',
    amber: 'B45309',
    green: '15803D',
    teal: '0B7A85',
    cyan: '0B7A85',
    violet: '7C2ED3',
    purple: '7C2ED3',
  };
  const hex = map[inner];
  if (hex) return hex;
  // 若已经是 6 位 HEX 则直接返回
  if (/^[0-9A-Fa-f]{6}$/.test(inner)) return inner;
  return fallback;
}



































// ============ theme07 Phase 3/4 通用渲染器 ============

/** theme07 通用赛道/垂直页渲染器（sector-layout） */

/** theme07 通用表格/结构化数据页渲染器（table-layout） */

/** theme07 通用公司案例页渲染器（company-layout） */

/** theme07 通用地理分布页渲染器（geo-layout） */

/** theme07 通用结尾/金句页渲染器（closing-layout） */

// 收尾页（引语变体）：居中大引语 + 关键词高亮（支持 [[关键词]] 语法）

// ---- Theme07 大数字版式渲染器（stat 系列，新增 4 个） ------------------

/** 单数字 Hero：巨号结论数字 + 单位 + 说明 */

/** 多数字并列：2–4 组大数字横向并列 */

/** 数字 + 图表：左侧巨号结论，右侧支撑柱状序列 */

/** 数字对比：左右巨号对峙 + 中间差值徽标 */

// Theme07 PPTX 渲染器注册

// theme07 Phase 3/4 通用渲染器注册
const THEME07_SECTOR_IDS = [
  'theme07_knowledge_v1', 'theme07_legal_v1', 'theme07_healthcare_v1', 'theme07_finance_v1',
  'theme07_compute_v1', 'theme07_chip_v1', 'theme07_robotics_v1', 'theme07_autonomy_v1',
  'theme07_safety_v1', 'theme07_content_gen_v1', 'theme07_education_v1', 'theme07_support_v1',
  'theme07_sales_v1', 'theme07_low_code_v1', 'theme07_open_source_v1', 'theme07_alignment_v1',
];
THEME07_SECTOR_IDS.forEach((id) => registerPptxLayoutRenderer(id, renderTheme07SectorV1 as PptxRenderFn));

const THEME07_TABLE_IDS = [
  'theme07_early_stage_v1', 'theme07_deal_structure_v1', 'theme07_investor_mix_v1', 'theme07_resource_v1',
  'theme07_alliance_v1', 'theme07_ecosystem_v1', 'theme07_revenue_v1', 'theme07_compliance_v1',
  'theme07_margin_v1', 'theme07_moat_v1', 'theme07_strategy_infra_v1', 'theme07_strategy_vertical_v1',
];
THEME07_TABLE_IDS.forEach((id) => registerPptxLayoutRenderer(id, renderTheme07TableV1 as PptxRenderFn));




// theme08 黑金实验风：注册全部 39 个版式专属 PPTX 渲染器
registerTheme08Renderers(registerPptxLayoutRenderer);

// theme09 墨韵专色 · 杂志印刷风：注册 P0 全部 12 个版式专属 PPTX 渲染器
registerTheme09Renderers(registerPptxLayoutRenderer);
// theme10 金色指数 · 金融编辑风：注册 P0 全部 12 个版式专属 PPTX 渲染器
registerTheme10Renderers(registerPptxLayoutRenderer);
// theme11 流光科技 · 浅色扁平科技风：注册全部版式专属 PPTX 渲染器
registerTheme11Renderers(registerPptxLayoutRenderer);
registerTheme01Renderers(registerPptxLayoutRenderer);
registerTheme02Renderers(registerPptxLayoutRenderer);
registerTheme03Renderers(registerPptxLayoutRenderer);
registerTheme04Renderers(registerPptxLayoutRenderer);
registerTheme05Renderers(registerPptxLayoutRenderer);
registerTheme06Renderers(registerPptxLayoutRenderer);
registerTheme07Renderers(registerPptxLayoutRenderer);

