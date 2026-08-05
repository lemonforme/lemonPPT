#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 根据标题、目标、主题和页数生成只含 role 的 goal.json 骨架
 * 用法:
 *   node scripts/goal-scaffold.mjs --title "AI 产业投资图谱" --goal "..." --theme theme06 --pages 10 --out ./goal.json
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { selectLayoutForRole } from '@lemonppt/composer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

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

function chooseRoles(pageCount, seed) {
  const random = createSeededRandom(seed);
  // 标准结构：cover + tableOfContents + (pageCount - 3) 内容页 + closing
  if (pageCount < 3) {
    return Array.from({ length: pageCount }, () => 'content');
  }

  const roles = ['cover'];
  if (pageCount >= 4) {
    roles.push('tableOfContents');
  }

  const contentRoles = [
    'content',
    'metric',
    'chart',
    'process',
    'comparison',
    'feature',
    'timeline',
    'quote',
    'image',
    'table',
    'stats',
  ];

  const remaining = pageCount - roles.length - 1;
  for (let i = 0; i < remaining; i++) {
    const idx = Math.floor(random() * contentRoles.length);
    roles.push(contentRoles[idx]);
  }

  roles.push('closing');
  return roles;
}

async function main() {
  const { options } = parseArgs(process.argv.slice(2));

  const title = options.title;
  const goal = options.goal;
  const theme = options.theme || 'theme01';
  const pages = options.pages ? Number(options.pages) : 8;
  const language = options.language || 'zh';
  const audience = options.audience || '内部团队';
  const owner = options.owner;
  const seed = options.seed || `lemon-${Date.now()}`;
  const outFile = options.out || path.join(rootDir, 'output', 'scaffolded-goal.json');

  if (!title || !goal) {
    console.error('Error: --title and --goal are required.');
    console.error('Usage: node scripts/goal-scaffold.mjs --title T --goal G --theme <id> --pages N [--out goal.json]');
    process.exit(1);
  }

  if (pages < 1 || pages > 200) {
    console.error('Error: --pages must be between 1 and 200.');
    process.exit(1);
  }

  const roles = chooseRoles(pages, seed);
  const slides = roles.map((role, index) => {
    const layout = selectLayoutForRole(role, seed, index, theme);
    return {
      role,
      layout,
      props: {},
    };
  });

  const result = {
    title,
    goal,
    audience,
    owner,
    theme,
    language,
    pageCount: slides.length,
    randomSeed: seed,
    slides,
  };

  await mkdir(path.dirname(path.resolve(outFile)), { recursive: true });
  await writeFile(path.resolve(outFile), JSON.stringify(result, null, 2), 'utf-8');

  console.log(`已生成 goal.json 骨架: ${path.resolve(outFile)}`);
  console.log(`页数: ${slides.length}`);
  console.log(`主题: ${theme}`);
  console.log(`结构: ${roles.join(' → ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
