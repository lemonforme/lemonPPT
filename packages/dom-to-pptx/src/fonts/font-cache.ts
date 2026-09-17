// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 字体缓存扫描器（阶段 4）。
 *
 * 支持从用户指定的 fontDir 与公共字体缓存目录扫描 .ttf/.otf/.woff/.woff2，
 * 自动建立 family → file 映射，供 PPTX 嵌入时优先使用。
 */

import { readdir } from 'node:fs/promises';
import path from 'node:path';

const FONT_EXTS = new Set(['.ttf', '.otf', '.woff', '.woff2']);

/** 常见字体文件名/目录名 → CSS font-family 标准名称 */
const FAMILY_ALIASES: Record<string, string> = {
  'notosanssc': 'Noto Sans SC',
  'notoserifsc': 'Noto Serif SC',
  'spacegrotesk': 'Space Grotesk',
  'spacemono': 'Space Mono',
  'jetbrainsmono': 'JetBrains Mono',
  'ibmplexsans': 'IBM Plex Sans',
  'newsreader': 'Newsreader',
  'caveat': 'Caveat',
  'anton': 'Anton',
  'inter': 'Inter',
  'archivo': 'Archivo',
};

export interface FontCacheOptions {
  /** 用户本地字体目录（最高优先级，可覆盖缓存） */
  fontDir?: string;
  /** 公共/内置字体缓存目录（低优先级，作为 fallback） */
  fontCacheDir?: string;
}

function normalizeFamily(name: string): string {
  return name
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferFamily(dir: string, filePath: string): string {
  const relative = path.relative(dir, filePath);
  const parts = relative.split(path.sep);
  // 如果字体放在子目录中，通常目录名就是家族名（如 Inter/Inter[wght].ttf）。
  const raw = parts.length >= 2 ? parts[0] : path.basename(filePath, path.extname(filePath));
  const normalized = normalizeFamily(raw).toLowerCase().replace(/\s+/g, '');
  return FAMILY_ALIASES[normalized] || normalizeFamily(raw);
}

async function scanDirRecursive(
  root: string,
  current: string,
  registry: Record<string, string>,
): Promise<void> {
  let entries;
  try {
    entries = await readdir(current, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) {
      await scanDirRecursive(root, fullPath, registry);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!FONT_EXTS.has(ext)) continue;
      const family = inferFamily(root, fullPath);
      if (!registry[family]) {
        registry[family] = fullPath;
      }
    }
  }
}

/**
 * 扫描单个字体目录，返回 family → 字体文件路径 的映射。
 * 同一 family 多只保留第一个遇到的文件（通常目录下最先遇到的是 Regular/Variable）。
 */
export async function scanFontDir(dir: string): Promise<Record<string, string>> {
  const registry: Record<string, string> = {};
  if (!dir) return registry;
  await scanDirRecursive(dir, dir, registry);
  return registry;
}

/**
 * 构建合并后的字体注册表：fontDir 覆盖 fontCacheDir。
 */
export async function buildFontRegistry(options: FontCacheOptions): Promise<Record<string, string>> {
  const registry: Record<string, string> = {};
  if (options.fontCacheDir) {
    Object.assign(registry, await scanFontDir(options.fontCacheDir));
  }
  if (options.fontDir) {
    Object.assign(registry, await scanFontDir(options.fontDir));
  }
  return registry;
}
