#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 规范化 goal.json 的 props：填充默认值、校验未知字段、必要时替换不存在的版式
 * 用法:
 *   node scripts/write-safe-props.mjs --goal ./goal.json --write
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { validateDeckGoal } from '@lemonppt/core';
import { composeDeckFromRaw } from '@lemonppt/composer';
import { getLayout, getLayoutSchema } from '@lemonppt/templates';

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

function getDefaultValue(field) {
  if (field.defaultValue !== undefined) return field.defaultValue;
  switch (field.type) {
    case 'text':
    case 'textarea':
      return '';
    case 'number':
    case 'slider':
      return field.min ?? 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'select':
      return field.options?.[0]?.value ?? '';
    case 'image':
      return '';
    case 'color':
      return '';
    case 'object':
      return {};
    default:
      return '';
  }
}

function normalizePropsWithSchema(props, fields, prefix = '') {
  const result = {};
  const knownKeys = new Set();

  for (const field of fields || []) {
    const key = field.key;
    knownKeys.add(key);
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const current = props[key];

    if (field.type === 'array' && field.itemSchema) {
      if (!Array.isArray(current)) {
        result[key] = [];
      } else {
        result[key] = current.map((item, idx) => {
          if (item && typeof item === 'object') {
            return normalizePropsWithSchema(item, field.itemSchema, `${fullKey}.${idx}`);
          }
          return item;
        });
      }
    } else if (field.type === 'object' && field.itemSchema) {
      result[key] = normalizePropsWithSchema(
        current && typeof current === 'object' ? current : {},
        field.itemSchema,
        fullKey
      );
    } else if (current === undefined || current === null) {
      result[key] = getDefaultValue(field);
    } else {
      result[key] = current;
    }
  }

  // 保留 schema 未定义但已存在的字段（兼容自定义扩展），但过滤掉内部注入字段
  const unknownKeys = Object.keys(props).filter((k) => !knownKeys.has(k) && !k.startsWith('_'));
  for (const key of unknownKeys) {
    result[key] = props[key];
  }

  return { props: result, unknownKeys };
}

async function main() {
  const { options } = parseArgs(process.argv.slice(2));
  const goalPath = options.goal;
  const shouldWrite = options.write === true;

  if (!goalPath) {
    console.error('Error: --goal is required.');
    console.error('Usage: node scripts/write-safe-props.mjs --goal <goal.json> [--write]');
    process.exit(1);
  }

  const raw = JSON.parse(await readFile(path.resolve(goalPath), 'utf-8'));

  // 先尝试作为 rawGoal（允许省略 layout）编排成完整 deck
  const composed = composeDeckFromRaw(raw);

  const layoutChanges = [];
  const unknownFields = [];
  const safeSlides = composed.slides.map((slide, index) => {
    const originalLayout = raw.slides[index]?.layout;
    const registered = getLayout(slide.layout);
    const schema = registered ? getLayoutSchema(slide.layout) : undefined;

    if (originalLayout && originalLayout !== slide.layout) {
      layoutChanges.push({ index: index + 1, from: originalLayout, to: slide.layout });
    }

    if (!schema) {
      return { ...slide, props: slide.props };
    }

    const normalized = normalizePropsWithSchema(slide.props || {}, schema.fields);
    if (normalized.unknownKeys.length > 0) {
      unknownFields.push({ index: index + 1, layout: slide.layout, keys: normalized.unknownKeys });
    }

    return { ...slide, props: normalized.props };
  });

  const safeGoal = {
    ...composed,
    slides: safeSlides,
  };

  const validation = validateDeckGoal(safeGoal);

  const result = {
    valid: validation.success,
    validationErrors: validation.success ? undefined : validation.errors?.format(),
    layoutChanges,
    unknownFields,
    goal: safeGoal,
  };

  if (shouldWrite) {
    await writeFile(path.resolve(goalPath), JSON.stringify(safeGoal, null, 2), 'utf-8');
    console.log(`已写入规范化后的 goal.json: ${path.resolve(goalPath)}`);
  } else {
    console.log(JSON.stringify(result, null, 2));
  }

  if (!validation.success) {
    console.error('goal.json 校验失败:');
    console.error(JSON.stringify(validation.errors?.format(), null, 2));
    process.exit(1);
  }

  if (layoutChanges.length > 0) {
    console.warn(`发现 ${layoutChanges.length} 个版式被自动替换:`);
    layoutChanges.forEach((c) => console.warn(`  第 ${c.index} 页: ${c.from} → ${c.to}`));
  }

  if (unknownFields.length > 0) {
    console.warn(`发现 ${unknownFields.length} 页存在未知字段（已保留）:`);
    unknownFields.forEach((u) => console.warn(`  第 ${u.index} 页 (${u.layout}): ${u.keys.join(', ')}`));
  }

  if (layoutChanges.length === 0 && unknownFields.length === 0) {
    console.log('所有 props 已规范化，无需额外调整。');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
