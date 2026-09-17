// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * CSS 高级效果矢量化解析模块（阶段 3 POC）。
 *
 * 参考 html2pptx-pro 的 CSS 解析管线，但保持手写轻量实现，
 * 仅覆盖 lemonPPT 主题中实际出现的渐变、阴影、clip-path 子集。
 */

export interface ParsedGradientStop {
  color: string;
  position: number;
}

interface RawGradientStop {
  color: string;
  position?: number;
}

export interface ParsedGradient {
  type: 'linear';
  angle: number;
  stops: ParsedGradientStop[];
}

export interface PptxGradientFill {
  type: 'linear';
  angle: number;
  stops: { color: string; position: number }[];
}

export interface PptxShadowOptions {
  type: 'outer' | 'inner';
  color: string;
  transparency: number;
  blur: number;
  angle: number;
  distance: number;
}

export interface ParsedShadow {
  type: 'outer' | 'inner';
  color: string;
  transparency: number;
  blur: number;
  angle: number;
  distance: number;
}

export interface ParsedClipPath {
  vectorizable: boolean;
  shape?: 'circle' | 'ellipse' | 'inset' | 'polygon';
  circle?: { cx: number; cy: number; radius: number };
  ellipse?: { cx: number; cy: number; rx: number; ry: number };
  inset?: { top: number; right: number; bottom: number; left: number };
  polygon?: string;
}

/**
 * 将 CSS rgb/rgba/hex 颜色值转为 PptxGenJS 可识别的 6 位十六进制（RRGGBB）。
 * 返回 { hex, alpha }，其中 hex 不含 # 前缀。
 */
export function parseCssColor(value: string): { hex: string; alpha: number } | undefined {
  if (!value || value === 'transparent' || value === 'none') return undefined;

  const clean = value.trim();

  // hex
  if (clean.startsWith('#')) {
    let hex = clean.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    } else if (hex.length === 4) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    if (hex.length === 6) {
      return { hex: hex.toUpperCase(), alpha: 1 };
    }
    if (hex.length === 8) {
      return { hex: hex.slice(0, 6).toUpperCase(), alpha: parseInt(hex.slice(6, 8), 16) / 255 };
    }
    return undefined;
  }

  // rgb / rgba
  const rgbMatch = clean.match(/rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*(?:,\s*([\d.]+)\s*)?\)/);
  if (rgbMatch) {
    const r = Math.round(parseFloat(rgbMatch[1]));
    const g = Math.round(parseFloat(rgbMatch[2]));
    const b = Math.round(parseFloat(rgbMatch[3]));
    const alpha = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return { hex: (toHex(r) + toHex(g) + toHex(b)).toUpperCase(), alpha: Number.isNaN(alpha) ? 1 : alpha };
  }

  // color(srgb r g b [/ alpha]) — Safari 输出格式
  const srgbMatch = clean.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/);
  if (srgbMatch) {
    const r = Math.round(parseFloat(srgbMatch[1]) * 255);
    const g = Math.round(parseFloat(srgbMatch[2]) * 255);
    const b = Math.round(parseFloat(srgbMatch[3]) * 255);
    const alpha = srgbMatch[4] !== undefined ? parseFloat(srgbMatch[4]) : 1;
    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return { hex: (toHex(r) + toHex(g) + toHex(b)).toUpperCase(), alpha: Number.isNaN(alpha) ? 1 : alpha };
  }

  // named colors subset
  const namedColors: Record<string, string> = {
    black: '000000',
    white: 'FFFFFF',
    red: 'FF0000',
    green: '008000',
    blue: '0000FF',
    yellow: 'FFFF00',
    cyan: '00FFFF',
    magenta: 'FF00FF',
    orange: 'FFA500',
    purple: '800080',
    pink: 'FFC0CB',
    gray: '808080',
    grey: '808080',
    transparent: '000000',
  };
  if (namedColors[clean.toLowerCase()]) {
    return { hex: namedColors[clean.toLowerCase()], alpha: clean.toLowerCase() === 'transparent' ? 0 : 1 };
  }

  return undefined;
}

/**
 * 解析 CSS 长度值，返回像素数值。
 * 支持 px、em（按默认 16px 估算）、%、rem、pt。
 */
export function parseCssLength(value: string, base = 16): number | undefined {
  if (!value || value === '0') return 0;
  const clean = value.trim().toLowerCase();
  const num = parseFloat(clean);
  if (Number.isNaN(num)) return undefined;

  if (clean.endsWith('px')) return num;
  if (clean.endsWith('em')) return num * base;
  if (clean.endsWith('rem')) return num * 16;
  if (clean.endsWith('pt')) return num * 1.333;
  if (clean.endsWith('%')) return num / 100 * base;
  if (clean.endsWith('cm')) return num * 37.795;
  if (clean.endsWith('mm')) return num * 3.78;
  if (clean.endsWith('in')) return num * 96;
  return num; // unitless fallback
}

export type GradientKind = 'linear' | 'radial' | 'conic' | 'multiple' | 'unsupported';

/**
 * 对 background-image 中的渐变组合进行粗分类。
 *
 * 返回：
 * - 'linear'：包含可解析的 linear-gradient
 * - 'radial'：仅包含 radial-gradient
 * - 'conic'：包含 conic-gradient
 * - 'multiple'：混合多种渐变
 * - 'unsupported'：无渐变或无法识别
 */
const GRADIENT_CALL_RE = /\b(?:-?(?:webkit|moz|o)-)?(?:repeating-)?(?:linear|radial|conic)-gradient\(/gi;

export function classifyGradient(value: string): GradientKind {
  if (!value || value === 'none') return 'unsupported';
  const clean = value.trim();
  const calls = clean.match(GRADIENT_CALL_RE);
  const callCount = calls?.length ?? 0;

  const hasLinear = /linear-gradient\(/i.test(clean);
  const hasRadial = /radial-gradient\(/i.test(clean);
  const hasConic = /conic-gradient\(/i.test(clean);

  if (callCount > 1) return 'multiple';

  const kinds: GradientKind[] = [];
  if (hasLinear) kinds.push('linear');
  if (hasRadial) kinds.push('radial');
  if (hasConic) kinds.push('conic');

  if (kinds.length === 0) return 'unsupported';
  if (kinds.length === 1) return kinds[0];
  return 'multiple';
}

/**
 * 解析 linear-gradient。
 *
 * 支持：
 * - linear-gradient(#ff0000, #00ff00)
 * - linear-gradient(135deg, red 0%, blue 100%)
 * - linear-gradient(to right, red, blue 50%, green)
 * - repeating-linear-gradient（按普通渐变解析，不重复）
 *
 * 返回 PptxGenJS 可用的 fill 结构。
 */
export function parseLinearGradient(value: string): ParsedGradient | undefined {
  const clean = value.trim();
  const match = clean.match(/^(?:-(?:webkit|moz|o)-)?(?:repeating-)?linear-gradient\((.*)\)$/i);
  if (!match) return undefined;

  const body = match[1].trim();
  // 先按逗号分割，但要保护括号内的逗号（如 rgba(...)、color(...)）。
  const parts = splitTopLevel(body);
  if (parts.length < 2) return undefined;

  let angle = 180; // CSS 默认从上到下
  let firstPart = parts[0].trim();
  if (firstPart.toLowerCase().startsWith('to ')) {
    angle = parseGradientDirection(firstPart);
    parts.shift();
  } else if (isAngle(firstPart)) {
    angle = parseAngle(firstPart);
    parts.shift();
  }

  const stops = parseGradientStops(parts);
  if (stops.length < 2) return undefined;

  return { type: 'linear', angle, stops };
}

function splitTopLevel(input: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of input) {
    if (char === '(') depth++;
    else if (char === ')') depth--;
    if (char === ',' && depth === 0) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) result.push(current);
  return result;
}

function isAngle(value: string): boolean {
  return /\d+(\.\d+)?(deg|rad|grad|turn)/i.test(value.trim());
}

function parseAngle(value: string): number {
  const m = value.trim().match(/(-?\d+(?:\.\d+)?)(deg|rad|grad|turn)/i);
  if (!m) return 180;
  const num = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === 'rad') return (num * 180) / Math.PI;
  if (unit === 'grad') return (num * 360) / 400;
  if (unit === 'turn') return num * 360;
  return num;
}

function parseGradientDirection(value: string): number {
  const dir = value.toLowerCase().replace('to ', '').trim();
  switch (dir) {
    case 'top':
      return 0;
    case 'right':
      return 90;
    case 'bottom':
      return 180;
    case 'left':
      return 270;
    case 'top right':
    case 'right top':
      return 45;
    case 'bottom right':
    case 'right bottom':
      return 135;
    case 'bottom left':
    case 'left bottom':
      return 225;
    case 'top left':
    case 'left top':
      return 315;
    default:
      return 180;
  }
}

const COLOR_TOKEN_RE = /^(rgba?\([^)]*\)|color\([^)]*\)|#[0-9A-Fa-f]{3,8}|[a-z]+)/i;

function parseGradientStops(parts: string[]): ParsedGradientStop[] {
  const stops: RawGradientStop[] = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    // 停止点格式：<color> [<position>%|px|em...]?；颜色可能是 rgb()/color() 函数，内部含空格和逗号。
    const colorMatch = part.match(COLOR_TOKEN_RE);
    if (!colorMatch) continue;

    const colorResult = parseCssColor(colorMatch[0]);
    if (!colorResult) continue;

    const rest = part.slice(colorMatch[0].length).trim();
    const posToken = rest.split(/\s+/).find(Boolean);

    let position: number | undefined;
    if (posToken) {
      if (posToken.endsWith('%')) {
        position = parseFloat(posToken) / 100;
      }
      // px/em/rem 等绝对位置暂不支持，保持 undefined 由后续插值处理。
    }

    stops.push({ color: colorResult.hex, position });
  }

  // 补齐首尾默认位置。
  if (stops.length > 0 && stops[0].position === undefined) stops[0].position = 0;
  if (stops.length > 1 && stops[stops.length - 1].position === undefined) stops[stops.length - 1].position = 1;

  // 线性插值中间缺失位置。
  let lastIndex = 0;
  for (let i = 1; i < stops.length; i++) {
    if (stops[i].position !== undefined) {
      const startPos = stops[lastIndex].position ?? 0;
      const endPos = stops[i].position ?? 1;
      const gap = i - lastIndex;
      for (let j = 1; j < gap; j++) {
        stops[lastIndex + j].position = startPos + ((endPos - startPos) * j) / gap;
      }
      lastIndex = i;
    }
  }

  return stops.map((s) => ({ color: s.color, position: s.position ?? 0 }));
}

/**
 * 解析 box-shadow。
 *
 * 支持：
 * - box-shadow: 2px 2px 4px rgba(0,0,0,0.3)
 * - box-shadow: inset 0 0 10px red
 * - 多组阴影（仅返回第一组外层阴影用于 POC）
 */
export function parseBoxShadow(value: string): ParsedShadow | undefined {
  if (!value || value === 'none') return undefined;

  const clean = value.trim();
  // 多组阴影取第一组。
  const firstShadow = splitTopLevel(clean)[0]?.trim();
  if (!firstShadow) return undefined;

  const tokens = firstShadow.split(/\s+/).filter(Boolean);
  let inset = false;
  let color: { hex: string; alpha: number } | undefined;
  const lengths: number[] = [];

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (lower === 'inset') {
      inset = true;
      continue;
    }
    const parsedColor = parseCssColor(token);
    if (parsedColor) {
      color = parsedColor;
      continue;
    }
    const len = parseCssLength(token);
    if (len !== undefined) {
      lengths.push(len);
    }
  }

  if (lengths.length < 2) return undefined;

  const offsetX = lengths[0];
  const offsetY = lengths[1];
  const blur = lengths[2] ?? 0;
  // lengths[3] 为 spread；PPTX 原生不直接支持，暂不解析。

  // PptxGenJS 不支持 inset shadow，但为保持数据结构完整记录。
  const angle = (Math.atan2(offsetY, offsetX) * 180) / Math.PI;
  const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

  return {
    type: inset ? 'inner' : 'outer',
    color: color?.hex ?? '000000',
    transparency: Math.round((1 - (color?.alpha ?? 1)) * 100),
    blur,
    angle,
    distance,
  };
}

/**
 * 判断 clip-path 是否可矢量化。
 *
 * PPTX 原生只支持矩形、椭圆等基本裁剪；
 * - circle / ellipse：可尝试用 PptxGenJS 椭圆形状近似。
 * - inset：可转换为带内边距的矩形（缩小绘制区域）。
 * - polygon / path / url：暂不可矢量化，应走截图 fallback。
 */
export function parseClipPath(value: string): ParsedClipPath {
  if (!value || value === 'none') return { vectorizable: true };

  const clean = value.trim();

  const circleMatch = clean.match(/^circle\(\s*([^)]*)\s*\)$/);
  if (circleMatch) {
    const args = circleMatch[1].trim();
    const radius = parseCssLength(args.split(/\s+at\s+/i)[0] ?? '') ?? 0;
    return { vectorizable: true, shape: 'circle', circle: { cx: 0.5, cy: 0.5, radius } };
  }

  const ellipseMatch = clean.match(/^ellipse\(\s*([^)]*)\s*\)$/);
  if (ellipseMatch) {
    return { vectorizable: true, shape: 'ellipse', ellipse: { cx: 0.5, cy: 0.5, rx: 0.5, ry: 0.5 } };
  }

  const insetMatch = clean.match(/^inset\(\s*([^)]*)\s*\)$/);
  if (insetMatch) {
    const parts = insetMatch[1].trim().split(/\s+/).map(parseCssLength);
    const top = parts[0] ?? 0;
    const right = parts[1] ?? top;
    const bottom = parts[2] ?? top;
    const left = parts[3] ?? right;
    return { vectorizable: true, shape: 'inset', inset: { top, right, bottom, left } };
  }

  const polygonMatch = clean.match(/^polygon\(\s*([^)]*)\s*\)$/);
  if (polygonMatch) {
    return { vectorizable: false, shape: 'polygon', polygon: polygonMatch[1] };
  }

  // path / url / unknown → 不可矢量化。
  return { vectorizable: false };
}

/**
 * 将 ParsedGradient 转换为 PPTX 渐变填充结构。
 *
 * 注意：当前项目锁定的 pptxgenjs@3.12.0 不直接支持 shape 渐变填充；
 * 若未来升级或改用支持渐变的 fork，可直接使用该结构。
 */
export function gradientToPptxFill(gradient: ParsedGradient): PptxGradientFill {
  return {
    type: 'linear',
    angle: gradient.angle,
    stops: gradient.stops.map((s) => ({ color: s.color, position: s.position })),
  };
}

/**
 * 将 ParsedShadow 转换为 PPTX 阴影选项结构。
 *
 * 注意：pptxgenjs@3.12.0 的 ShadowProps 使用 opacity/blur/offset/angle；
 * 本函数输出同时兼容常见 fork 的字段命名。
 */
export function shadowToPptxOptions(shadow: ParsedShadow): PptxShadowOptions {
  return {
    type: shadow.type,
    color: shadow.color,
    transparency: shadow.transparency,
    blur: shadow.blur,
    angle: shadow.angle,
    distance: shadow.distance,
  };
}
