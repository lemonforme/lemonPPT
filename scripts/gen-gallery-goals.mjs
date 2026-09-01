#!/usr/bin/env node
// lemonPPT - 为全部主题生成“真实数据”画廊 goal 文件
// 策略：
//   1. 优先复用已有的主题 goal（theme01-data-goal.json、theme02/03 sample、theme04-10 等）
//   2. 对未覆盖的版式，按主题特性回退到 sampleProps / schema 默认值
//   3. 对图片字段统一填入离线占位图，避免“无图”空白
// 输出：output/<theme>-gallery-goal.json

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getLayoutSchema, listLayoutsByTheme } from '@lemonppt/templates';
import { sampleProps } from './lib/sample-props.mjs';
import { PLACEHOLDER_IMAGES } from './lib/placeholder.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'output');

const THEMES = [
  'theme01',
  'theme02',
  'theme03',
  'theme04',
  'theme05',
  'theme06',
  'theme07',
  'theme08',
  'theme09',
  'theme10',
  'theme11',
];

const BASE_GOAL_PATHS = {
  theme01: 'output/theme01-data-goal.json',
  theme02: 'examples/theme02-sample-goal.json',
  theme03: 'examples/theme03-sample-goal.json',
  theme04: 'examples/theme04-goal.json',
  theme05: 'examples/theme05-full-audit-goal.json',
  theme06: 'examples/theme06-audit-goal.json',
  theme07: 'examples/theme07-all-goal.json',
  theme08: null,
  theme09: null,
  theme10: 'output/theme10-all-goal.json',
  theme11: null,
};

function schemaDefaultsToProps(schema) {
  if (!schema || !Array.isArray(schema.fields)) return {};
  const props = {};
  for (const f of schema.fields) {
    if (f.defaultValue !== undefined) props[f.key] = f.defaultValue;
  }
  return props;
}

function fillEmptyImages(props, layoutId) {
  const PLACEHOLDER = PLACEHOLDER_IMAGES.landscape;
  let ci = 0;
  const next = () => {
    const pool = Object.values(PLACEHOLDER_IMAGES);
    return pool[ci++ % pool.length];
  };

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach((item) => {
        if (item && typeof item === 'object') {
          if ('url' in item && !item.url) item.url = next();
          if ('src' in item && !item.src) item.src = next();
          walk(item);
        }
      });
    } else if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) {
        const v = node[k];
        if (typeof v === 'string' && !v && /image|photo|cover|src|img|logoUrl/i.test(k)) {
          node[k] = next();
        }
        walk(v);
      }
    }
  };

  walk(props);

  // 对仍为空数组的 images 注入占位项（数量不做硬性要求，至少 1 张）
  if (Array.isArray(props.images) && props.images.length === 0) {
    props.images.push({ url: PLACEHOLDER, caption: '示例图片' });
  }

  return props;
}

async function loadBaseGoal(theme) {
  const rel = BASE_GOAL_PATHS[theme];
  if (!rel) return null;
  try {
    const text = await readFile(path.join(rootDir, rel), 'utf-8');
    const goal = JSON.parse(text);
    const map = new Map((goal.slides || []).map((s) => [s.layout, s.props]));
    console.log(`  ℹ️ ${theme} 已载入基础 goal：${map.size} 个版式`);
    return map;
  } catch (e) {
    console.warn(`  ⚠️ ${theme} 基础 goal 未找到或解析失败：${e.message}`);
    return null;
  }
}

function fallbackProps(theme, meta) {
  // theme08 / theme09 / theme10 / theme11 优先使用 schema 默认值（内容已很丰富）
  if (theme === 'theme08' || theme === 'theme09' || theme === 'theme10' || theme === 'theme11') {
    const schema = getLayoutSchema(meta.id);
    const base = schemaDefaultsToProps(schema);
    if (Object.keys(base).length > 0) {
      if (base.title === undefined) base.title = `${meta.role} 示例`;
      return fillEmptyImages(base, meta.id);
    }
  }
  return sampleProps(meta);
}

async function generateThemeGoal(theme) {
  const layouts = listLayoutsByTheme(theme);
  layouts.sort((a, b) => a.id.localeCompare(b.id));

  const baseMap = await loadBaseGoal(theme);
  const slides = [];
  let fromBase = 0;
  let fromFallback = 0;

  for (const meta of layouts) {
    let props;
    if (baseMap && baseMap.has(meta.id)) {
      props = { ...baseMap.get(meta.id) };
      fromBase++;
    } else {
      props = fallbackProps(theme, meta);
      fromFallback++;
    }
    slides.push({ role: meta.role, layout: meta.id, props });
  }

  const goal = {
    title: `${theme} 真实数据画廊`,
    goal: `覆盖 ${theme} 全部版式的真实数据预览`,
    audience: '视频制作 / 产品演示',
    theme,
    language: 'zh',
    pageCount: slides.length,
    slides,
  };

  const outFile = path.join(outDir, `${theme}-gallery-goal.json`);
  await writeFile(outFile, JSON.stringify(goal, null, 2) + '\n', 'utf-8');
  console.log(`✅ ${theme}: ${slides.length} 个版式（${fromBase} 来自已有 goal，${fromFallback} 自动填充）→ ${outFile}`);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  for (const theme of THEMES) {
    await generateThemeGoal(theme);
  }
  console.log('\n全部主题画廊 goal 已生成到 output/*-gallery-goal.json');
}

main().catch((err) => {
  console.error('生成失败：', err);
  process.exit(1);
});
