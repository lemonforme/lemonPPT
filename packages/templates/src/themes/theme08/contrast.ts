// lemonPPT - theme08 黑金实验 · 对比度工具
// 用于图表类版式（热力图等）根据单元格背景色自动选择可读文字色，
// 任意用户自定义色值都能满足 WCAG AA 对比度，避免“浅粉底白字”之类的不可读组合。

/** 解析 #rgb / #rrggbb 为 [r,g,b]（0-255）；非法输入返回 null */
function parseHex(hex: string): [number, number, number] | null {
  if (!hex || typeof hex !== 'string') return null;
  const h = hex.replace('#', '').trim();
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return [r, g, b];
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return [r, g, b];
  }
  return null;
}

/** WCAG 相对亮度（0-1） */
export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 1;
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 对比度比值（>=1） */
export function wcagContrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 根据背景色返回应使用的文字色（黑/白），确保文字与背景对比度达标。
 * 阈值取相对亮度 0.18：更暗的背景用白字，更亮的背景用深字。
 */
export function bestTextColorForBg(hex: string): string {
  const rgb = parseHex(hex);
  if (!rgb) return 'rgb(10,10,12)';
  const lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return lum < 0.18 ? '#fff' : 'rgb(10,10,12)';
}
