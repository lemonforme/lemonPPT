/**
 * warm-business 主题设计 token
 */
export const warmBusinessTokens = {
  id: 'warm-business',
  displayName: '暖色商务',
  description: '米白与浅棕背景、暖橙 accent，适合温暖风格的商务汇报',
  colors: {
    background: '#faf6f1',
    surface: '#fffbf7',
    primary: '#3d2c24',
    secondary: '#8c7b70',
    accent: '#e07b39',
    muted: '#efe6dc',
    text: '#3d2c24',
    textInverse: '#fffbf7',
  },
  fonts: {
    heading: '"Noto Serif SC", "Noto Sans SC", Georgia, serif',
    body: '"Noto Sans SC", Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: {
    pagePadding: '48px',
    sectionGap: '32px',
    elementGap: '16px',
  },
  borderRadius: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
} as const;
