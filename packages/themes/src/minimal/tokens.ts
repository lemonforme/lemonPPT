/**
 * minimal 主题设计 token
 */
export const minimalTokens = {
  id: 'minimal',
  displayName: '极简白',
  description: '干净、专业、适合商务汇报',
  colors: {
    background: '#ffffff',
    surface: '#f8fafc',
    primary: '#0f172a',
    secondary: '#64748b',
    accent: '#3b82f6',
    muted: '#e2e8f0',
    text: '#0f172a',
    textInverse: '#ffffff',
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: {
    pagePadding: '48px',
    sectionGap: '32px',
    elementGap: '16px',
  },
  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '20px',
  },
} as const;
