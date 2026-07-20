#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Agent 实测 smoke-test：在 Trae / 本地无外部 Agent 工具时，模拟 6 个 SKILL.md 用例，
 * 生成 goal.json、导出 PPTX/PDF，并输出可复现报告。
 *
 * 用法：
 *   node scripts/agent-test.mjs
 * 输出：
 *   output/agent-test/results.json
 *   output/agent-test/report.md
 */

import { generateGoal } from '@lemonppt/agent-prompts';
import { validateDeckGoal } from '@lemonppt/core';
import { composeDeck } from '@lemonppt/composer';
import { exportDeckToPptx, exportDeckToPdf } from '@lemonppt/renderer';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'output', 'agent-test');

const hasApiKey = Boolean(process.env.OPENAI_API_KEY);

const testCases = [
  {
    id: 1,
    name: '一句话主题（无 API Key）',
    prompt: '帮我做一份 PPT',
    input: '帮我做一份 PPT',
    options: { pageCount: 8, theme: 'base', language: 'zh' },
    expectFallback: true,
  },
  {
    id: 2,
    name: '详细主题（无 API Key）',
    prompt: '帮我做一份 8 页的中文 PPT，主题是“面向企业客户的 AI 助手产品发布会”，强调效率提升 10 倍、支持私有化部署、已有 50 家客户，主题用 base',
    input: '面向企业客户的 AI 助手产品发布会，核心卖点：效率提升 10 倍、支持私有化部署、服务 50+ 标杆客户',
    options: { pageCount: 8, theme: 'base', language: 'zh' },
    expectFallback: true,
  },
  {
    id: 3,
    name: '指定输出 PDF',
    prompt: '把刚才的 goal.json 导出成 PDF',
    reuse: 2,
    exportPdf: true,
  },
  {
    id: 4,
    name: '切换主题',
    prompt: '同样的内容，换成 dark-tech 主题再生成一次',
    input: '面向企业客户的 AI 助手产品发布会，核心卖点：效率提升 10 倍、支持私有化部署、服务 50+ 标杆客户',
    options: { pageCount: 8, theme: 'dark-tech', language: 'zh' },
    expectFallback: true,
  },
  {
    id: 5,
    name: '仅使用 role、不指定 layout',
    prompt: '把最后一页改成团队介绍页',
    reuse: 2,
    modify: (goal) => {
      const slides = goal.slides.map((s, i) =>
        i === goal.slides.length - 1
          ? { role: 'team', props: s.props }
          : { role: s.role, layout: s.layout, props: s.props }
      );
      return composeDeck({
        title: goal.title,
        goal: goal.goal,
        audience: goal.audience,
        owner: goal.owner,
        theme: goal.theme,
        language: goal.language,
        pageCount: goal.pageCount,
        randomSeed: goal.randomSeed,
        slides,
      });
    },
  },
  {
    id: 6,
    name: '有 API Key（如条件允许）',
    prompt: '用 OpenAI API Key 生成一份更专业的融资路演 PPT',
    input: 'AI 驱动的 SaaS 融资路演，面向早期风险投资机构，强调ARR增长、技术壁垒和团队背景',
    options: { pageCount: 10, theme: 'warm-business', language: 'zh', llm: { apiKey: process.env.OPENAI_API_KEY } },
    skipIfNoApiKey: true,
  },
];

const results = [];
const goalCache = {};

function validateGoal(goal) {
  const v = validateDeckGoal(goal);
  if (!v.success) {
    const fmt = v.errors?.format();
    return { valid: false, errors: fmt ? JSON.stringify(fmt, null, 2) : 'unknown validation error' };
  }
  return { valid: true, errors: null };
}

async function exportPptx(goal, filePath) {
  await exportDeckToPptx(goal, { outFile: filePath, title: goal.title, author: goal.owner || 'lemonPPT' });
}

async function exportPdf(goal, filePath) {
  await exportDeckToPdf(goal, { outFile: filePath });
}

async function runCase(tc) {
  const result = {
    id: tc.id,
    name: tc.name,
    prompt: tc.prompt,
    skipped: false,
    source: null,
    goalValid: false,
    validationErrors: null,
    theme: null,
    pageCount: null,
    slideCount: null,
    lastLayout: null,
    pptx: null,
    pdf: null,
    error: null,
  };

  try {
    if (tc.skipIfNoApiKey && !hasApiKey) {
      result.skipped = true;
      result.error = '未配置 OPENAI_API_KEY，跳过 API Key 用例';
      return result;
    }

    let goal;
    if (tc.reuse) {
      goal = goalCache[tc.reuse];
      if (!goal) throw new Error(`用例 ${tc.id} 依赖的用例 ${tc.reuse} 未生成`);
    } else {
      const gen = await generateGoal({ input: tc.input, ...tc.options });
      goal = gen.goal;
      result.source = gen.source;
    }

    if (tc.modify) {
      goal = tc.modify(goal);
    }

    const validation = validateGoal(goal);
    result.goalValid = validation.valid;
    result.validationErrors = validation.errors;
    result.theme = goal.theme;
    result.pageCount = goal.pageCount;
    result.slideCount = goal.slides.length;
    result.lastLayout = goal.slides[goal.slides.length - 1]?.layout ?? null;

    if (goal.pageCount !== goal.slides.length) {
      result.error = `pageCount (${goal.pageCount}) 与 slides.length (${goal.slides.length}) 不一致`;
    }

    goalCache[tc.id] = goal;

    const pptxPath = path.join(outDir, `case-${tc.id}.pptx`);
    await exportPptx(goal, pptxPath);
    result.pptx = pptxPath;

    if (tc.exportPdf) {
      const pdfPath = path.join(outDir, `case-${tc.id}.pdf`);
      await exportPdf(goal, pdfPath);
      result.pdf = pdfPath;
    }
  } catch (err) {
    result.error = err.message || String(err);
  }

  return result;
}

function buildReport(results) {
  const header = `# Agent 实测 Smoke Test 报告\n\n> 在 Trae 本地执行，模拟 SKILL.md 6 个用例。\n> 生成时间：${new Date().toISOString()}\n\n`;
  const summary = `## 汇总\n\n| 用例 | 名称 | 结果 | 来源 | 主题 | 页数 | 末页版式 | 说明 |\n|---|---|---|---|---|---|---|---|\n` +
    results.map((r) => {
      const status = r.skipped ? '跳过' : r.error ? '失败' : '通过';
      const note = r.error || (r.goalValid ? 'goal.json 合法' : r.validationErrors || 'goal.json 非法');
      return `| ${r.id} | ${r.name} | ${status} | ${r.source ?? '-'} | ${r.theme ?? '-'} | ${r.slideCount ?? '-'} | ${r.lastLayout ?? '-'} | ${note.replace(/\n/g, ' ')} |`;
    }).join('\n') +
    '\n\n';

  const details = results.map((r) => {
    const lines = [
      `### 用例 ${r.id}：${r.name}`,
      `- **用户 Prompt**：${r.prompt}`,
      `- **结果**：${r.skipped ? '跳过' : r.error ? '失败' : '通过'}`,
    ];
    if (r.source) lines.push(`- **内容来源**：${r.source}`);
    if (r.theme) lines.push(`- **主题**：${r.theme}`);
    if (r.pageCount != null) lines.push(`- **pageCount**：${r.pageCount}`);
    if (r.slideCount != null) lines.push(`- **slides.length**：${r.slideCount}`);
    if (r.lastLayout != null) lines.push(`- **末页版式**：${r.lastLayout}`);
    if (r.pptx) lines.push(`- **PPTX**：${r.pptx}`);
    if (r.pdf) lines.push(`- **PDF**：${r.pdf}`);
    if (r.validationErrors) lines.push(`- **校验错误**：\n\n\`\`\`json\n${r.validationErrors}\n\`\`\``);
    if (r.error) lines.push(`- **错误**：${r.error}`);
    return lines.join('\n');
  }).join('\n\n');

  return header + summary + details;
}

async function main() {
  await mkdir(outDir, { recursive: true });

  for (const tc of testCases) {
    console.log(`\n▶️  用例 ${tc.id}：${tc.name}`);
    const result = await runCase(tc);
    results.push(result);
    if (result.skipped) {
      console.log('   ⏭️  跳过');
    } else if (result.error) {
      console.log('   ❌ 失败：' + result.error);
    } else {
      console.log('   ✅ 通过');
    }
  }

  await writeFile(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2), 'utf-8');
  await writeFile(path.join(outDir, 'report.md'), buildReport(results), 'utf-8');

  console.log(`\n报告已生成：${path.join(outDir, 'report.md')}`);

  const failed = results.filter((r) => !r.skipped && r.error);
  if (failed.length) {
    console.error(`\n有 ${failed.length} 个用例失败`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Agent 测试失败：', err);
  process.exit(1);
});
