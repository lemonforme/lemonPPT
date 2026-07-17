/**
 * dark-tech 主题设计 token
 */
export const darkTechTokens = {
  id: 'dark-tech',
  displayName: '深色科技',
  description: '深色背景、霓虹青 accent，适合技术分享与产品发布会',
  colors: {
    background: '#0a0f1c',
    surface: '#111827',
    primary: '#e5e7eb',
    secondary: '#94a3b8',
    accent: '#06b6d4',
    muted: '#1f2937',
    text: '#f3f4f6',
    textInverse: '#0a0f1c',
  },
  fonts: {
    heading: 'Inter, "Noto Sans SC", system-ui, sans-serif',
    body: 'Inter, "Noto Sans SC", system-ui, sans-serif',
    mono: 'JetBrains Mono, "SF Mono", monospace',
  },
  spacing: {
    pagePadding: '48px',
    sectionGap: '32px',
    elementGap: '16px',
  },
  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '16px',
  },
} as const;
