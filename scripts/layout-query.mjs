#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 按主题与角色查询候选版式
 * 用法:
 *   node scripts/layout-query.mjs --theme theme06 --role metric --limit 5
 *   node scripts/layout-query.mjs --theme theme01 --role content --keyword hero --needs-media
 */
import { listLayoutsByRoleAndTheme } from '@lemonppt/templates';
import { getTheme } from '@lemonppt/themes';

function parseArgs(argv) {
  const options = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.replace(/^--/, '');
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        options[key] = next;
        i++;
      } else {
        options[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { options, positional };
}

function createSeededRandom(seed) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  }
  if (s === 0) s = 123456789;
  let x = s;
  let y = 362436069;
  let z = 521288629;
  let w = 88675123;
  return () => {
    const t = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    w = (w ^ (w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;
    return w / 0xffffffff;
  };
}

function shuffleWithSeed(array, seed) {
  const random = createSeededRandom(String(seed));
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function main() {
  const { options } = parseArgs(process.argv.slice(2));

  const theme = options.theme || 'theme01';
  const role = options.role;
  const keyword = options.keyword ? String(options.keyword).toLowerCase() : undefined;
  const needsMedia = options['needs-media'] === true;
  const limit = options.limit ? Number(options.limit) : 8;
  const seed = options.seed || `lemon-${Date.now()}`;

  const themeInfo = getTheme(theme);
  if (!themeInfo) {
    console.error(`Error: unknown theme "${theme}"`);
    process.exit(1);
  }

  if (!role) {
    console.error('Error: --role is required.');
    console.error('Usage: node scripts/layout-query.mjs --theme <theme> --role <role> [--keyword K] [--needs-media] [--limit N] [--seed S]');
    process.exit(1);
  }

  let layouts = listLayoutsByRoleAndTheme(role, theme);

  if (keyword) {
    layouts = layouts.filter((m) =>
      [m.id, m.displayName, m.description || '', ...(m.tags || []), m.contentShape || '']
        .join(' ')
        .toLowerCase()
        .includes(keyword)
    );
  }

  if (needsMedia) {
    layouts = layouts.filter((m) => m.needsMedia);
  }

  // 按 seed 洗牌后取前 limit 个，保证可复现
  const shuffled = shuffleWithSeed(layouts, `${seed}-${role}-${theme}`);
  const picked = shuffled.slice(0, limit);

  const result = {
    theme,
    themeDisplayName: themeInfo.name || theme,
    role,
    keyword: keyword || null,
    needsMedia,
    seed,
    limit,
    count: picked.length,
    totalAvailable: layouts.length,
    layouts: picked.map((m) => ({
      layout: m.id,
      displayName: m.displayName,
      description: m.description || '',
      role: m.role,
      needsMedia: m.needsMedia,
      tags: m.tags || [],
      contentShape: m.contentShape || '',
    })),
  };

  console.log(JSON.stringify(result, null, 2));
}

main();
