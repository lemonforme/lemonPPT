#!/usr/bin/env node
// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDeckToPptxScreenshot } from '@lemonppt/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcFile = path.join(rootDir, 'packages/renderer/src/export-pptx.ts');

const src = await readFile(srcFile, 'utf8');
const layoutIds = [...src.matchAll(/registerPptxLayoutRenderer\('([^']+)'/g)].map((m) => m[1]);

const baseProps = {
  kicker: '示例标签',
  title: '示例标题 Sample Title',
  subtitle: '这是副标题，用于覆盖所有需要 subtitle 的版式',
  date: '2026.07',
  image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1280&q=80',
  imageUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=1280&q=80',
  body: '这是正文描述，用于 image_v2 等需要 body 的版式。',
  caption: '图片说明',
  items: ['第一项内容', '第二项内容', '第三项内容', '第四项内容'],
  value: '99',
  unit: '%',
  description: '这是一个描述文本，用于 metric 版式。',
  points: ['要点一', '要点二', '要点三'],
  leftPoints: ['左侧要点一', '左侧要点二'],
  rightPoints: ['右侧要点一', '右侧要点二'],
  leftTitle: '左侧标题',
  rightTitle: '右侧标题',
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  data: [1200, 2100, 3400, 4800],
  type: 'bar',
  datasets: [
    { label: '系列 A', data: [1200, 2100, 3400, 4800], color: '2563EB' },
    { label: '系列 B', data: [800, 1500, 2200, 3100], color: '10B981' },
  ],
  steps: [
    { title: '步骤一', description: '这是步骤一的详细说明文本。' },
    { title: '步骤二', description: '这是步骤二的详细说明文本。' },
    { title: '步骤三', description: '这是步骤三的详细说明文本。' },
    { title: '步骤四', description: '这是步骤四的详细说明文本。' },
  ],
  milestones: [
    { date: '2026 Q1', title: '里程碑一', description: '完成产品原型验证。' },
    { date: '2026 Q2', title: '里程碑二', description: '发布内测版本。' },
    { date: '2026 Q3', title: '里程碑三', description: '公开上线。' },
    { date: '2026 Q4', title: '里程碑四', description: '规模化推广。' },
  ],
  phases: [
    { title: '阶段一', description: '完成核心功能开发', status: '已完成' },
    { title: '阶段二', description: '进行多主题适配', status: '进行中' },
    { title: '阶段三', description: '完善导出能力', status: '待开始' },
    { title: '阶段四', description: '开放外部集成', status: '待开始' },
  ],
  quote: '最好的 PPT 不是炫技，而是把想法清楚有力地传递出去。',
  author: '柠檬团队',
  role: '产品理念',
  source: 'lemonPPT 博客',
  company: 'lemonPPT',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  logoUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=200&q=80',
  metric: '85%',
  metricLabel: '满意度',
  features: [
    { title: 'AI 生成', description: '一句话生成完整 PPT。', icon: '✦' },
    { title: '多主题', description: '支持浅色、深色、暖色主题。', icon: '◈' },
    { title: '可导出', description: '一键导出 PPTX 与 PDF。', icon: '◉' },
  ],
  members: [
    { name: '张三', role: '创始人', bio: '负责产品战略。', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
    { name: '李四', role: '工程师', bio: '负责渲染引擎。', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
    { name: '王五', role: '设计师', bio: '负责版式系统。', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
  ],
  partners: [
    { name: 'Partner A', logoUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=200&q=80' },
    { name: 'Partner B', logoUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=200&q=80' },
    { name: 'Partner C', logoUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=200&q=80' },
    { name: 'Partner D', logoUrl: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=200&q=80' },
  ],
  tiers: [
    { name: '免费版', price: '¥0', period: '/月', features: ['基础版式', '导出 PDF', '社区支持'], cta: '开始使用' },
    { name: '专业版', price: '¥99', period: '/月', features: ['全部版式', 'PPTX 导出', '优先支持'], cta: '立即升级' },
    { name: '企业版', price: '¥999', period: '/月', features: ['自定义主题', 'API 调用', '专属客服'], cta: '联系销售' },
  ],
  plans: [
    { name: '基础', price: '¥0', period: '/月', features: ['1 个项目', 'PDF 导出', '邮件支持'], highlighted: false },
    { name: '专业', price: '¥99', period: '/月', features: ['无限项目', 'PPTX 导出', '优先支持'], highlighted: true },
    { name: '企业', price: '¥999', period: '/月', features: ['API', '私有部署', '专属客服'], highlighted: false },
  ],
  images: [
    { url: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=400&q=80', caption: '图 1' },
    { url: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=400&q=80', caption: '图 2' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', caption: '图 3' },
  ],
  cards: [
    { title: '卡片一', description: '卡片一的描述文本。' },
    { title: '卡片二', description: '卡片二的描述文本。' },
    { title: '卡片三', description: '卡片三的描述文本。' },
  ],
  events: [
    { date: '2026-01', title: '事件一', description: '事件一描述。' },
    { date: '2026-02', title: '事件二', description: '事件二描述。' },
    { date: '2026-03', title: '事件三', description: '事件三描述。' },
    { date: '2026-04', title: '事件四', description: '事件四描述。' },
  ],
  rows: [
    { feature: '维度 A', left: '支持', right: '支持' },
    { feature: '维度 B', left: '部分', right: '完整' },
    { feature: '维度 C', left: '完整', right: '部分' },
    { feature: '维度 D', left: '支持', right: '支持' },
  ],
  stats: [
    { label: '用户数', value: '12k', unit: '', change: '+20%' },
    { label: '满意度', value: '98', unit: '%', change: '+5%' },
    { label: '导出量', value: '45k', unit: '', change: '+30%' },
    { label: '模板数', value: '55', unit: '+', change: '+10' },
  ],
  metrics: [
    { label: '月活跃用户', value: '10', unit: '万', change: '+15%' },
    { label: '付费转化率', value: '4.5', unit: '%', change: '+0.8%' },
  ],
};

const overrides = {
  process_v1: { steps: ['输入需求', 'AI 生成', '在线编辑', '导出文件'] },
  faq_v1: {
    items: [
      { q: '如何开始使用？', a: '输入一句话需求即可生成。' },
      { q: '支持哪些导出格式？', a: '支持 PPTX 与 PDF。' },
      { q: '是否可编辑？', a: '支持浏览器在线编辑。' },
      { q: '是否免费？', a: '提供免费版与付费版。' },
    ],
  },
};

const slides = layoutIds.map((layout) => ({
  layout,
  role: 'content',
  props: { ...baseProps, ...(overrides[layout] || {}) },
}));

const goal = {
  title: '全部版式覆盖测试',
  goal: '验证每个版式在 PPTX 导出中的内容完整性与布局位置',
  owner: 'lemonPPT',
  theme: 'theme01',
  language: 'zh',
  pageCount: slides.length,
  randomSeed: 'all-layouts-test',
  slides,
};

const goalPath = path.join(rootDir, 'output', 'all-layouts-goal.json');
await writeFile(goalPath, JSON.stringify(goal, null, 2));

const outFile = path.join(rootDir, 'output', 'all-layouts.pptx');
await exportDeckToPptxScreenshot(goal, { outFile, title: goal.title });

console.log(`已生成 ${slides.length} 页测试 PPTX: ${outFile}`);
