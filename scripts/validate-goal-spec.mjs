#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 独立校验 goal.json 是否符合 lemonPPT 规范
 * 用法:
 *   node scripts/validate-goal-spec.mjs --goal ./goal.json [--strict]
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { validateDeckGoal, validateDeckGoalContent, validateSlideCount } from '@lemonppt/core';

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

async function main() {
  const { options } = parseArgs(process.argv.slice(2));
  const goalPath = options.goal;
  const strict = options.strict === true;

  if (!goalPath) {
    console.error('Error: --goal is required.');
    console.error('Usage: node scripts/validate-goal-spec.mjs --goal <goal.json> [--strict]');
    process.exit(1);
  }

  const raw = JSON.parse(await readFile(path.resolve(goalPath), 'utf-8'));

  const result = {
    file: path.resolve(goalPath),
    valid: false,
    errors: [],
    warnings: [],
  };

  // 结构校验
  const validation = validateDeckGoal(raw);
  if (!validation.success) {
    const formatted = validation.errors?.format();
    result.errors.push({ type: 'schema', detail: formatted });
  } else {
    const goal = validation.data;

    // 页数一致性
    const countErrors = validateSlideCount(goal);
    if (countErrors.length > 0) {
      result.errors.push(...countErrors.map((msg) => ({ type: 'count', detail: msg })));
    }

    // 内容字段缺失
    const contentWarnings = validateDeckGoalContent(goal);
    if (contentWarnings.length > 0) {
      if (strict) {
        result.errors.push(...contentWarnings.map((msg) => ({ type: 'content', detail: msg })));
      } else {
        result.warnings.push(...contentWarnings);
      }
    }

    // 封面/结尾检查
    const firstSlide = goal.slides[0];
    const lastSlide = goal.slides[goal.slides.length - 1];
    if (firstSlide?.role !== 'cover') {
      result.warnings.push('第一页建议使用 cover 角色');
    }
    if (lastSlide?.role !== 'closing') {
      result.warnings.push('最后一页建议使用 closing 角色');
    }

    if (result.errors.length === 0) {
      result.valid = true;
    }
  }

  console.log(JSON.stringify(result, null, 2));

  if (!result.valid) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
