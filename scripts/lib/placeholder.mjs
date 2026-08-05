#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 离线占位图片（base64 SVG），避免示例数据依赖外部图片服务。
 * 使用 SVG 可在任意分辨率下清晰渲染，且文件体积极小。
 */

function svgToDataUri(svg) {
  const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function gradientPlaceholder({ width, height, from, to, label }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="0" y="0" width="100%" height="100%" fill="rgba(255,255,255,0.06)"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${Math.max(14, Math.round(width / 32))}" fill="rgba(255,255,255,0.7)">${label}</text>
  </svg>`;
  return svgToDataUri(svg);
}

export const PLACEHOLDER_IMAGES = {
  /** 16:9 宽幅占位图，适合封面/章节背景 */
  landscape: gradientPlaceholder({
    width: 1280,
    height: 720,
    from: '#334155',
    to: '#1e293b',
    label: '点击上传图片',
  }),

  /** 竖版大图占位，适合杂志跨页 */
  portrait: gradientPlaceholder({
    width: 600,
    height: 800,
    from: '#475569',
    to: '#334155',
    label: '点击上传大图',
  }),

  /** 画廊小图占位 */
  gallery: gradientPlaceholder({
    width: 400,
    height: 300,
    from: '#64748b',
    to: '#475569',
    label: '图片占位',
  }),

  /** 头像占位 */
  avatar: gradientPlaceholder({
    width: 300,
    height: 300,
    from: '#94a3b8',
    to: '#64748b',
    label: '头像',
  }),
};
