#!/usr/bin/env node
// 本地验证：复杂表格 / 对比表区域截图 fallback 导出效果

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exportDeckToPptxScreenshot } from '@lemonppt/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'output');
const outFile = path.join(outDir, 'mock-table-export.pptx');

/** @type {import('@lemonppt/core').DeckGoal} */
const goal = {
  title: '2026 产品竞争分析',
  goal: '向管理层汇报核心竞品对比与关键数据',
  audience: '产品团队 / 管理层',
  owner: '产品分析组',
  theme: 'theme01',
  language: 'zh',
  pageCount: 5,
  randomSeed: 'table-fallback-demo',
  slides: [
    {
      role: 'cover',
      layout: 'theme01_cover_v1',
      props: {
        title: '2026 产品竞争分析',
        subtitle: '核心数据与横向对比',
        kicker: 'Q3 战略汇报',
      },
    },
    {
      role: 'table',
      layout: 'theme01_table_data',
      props: {
        kicker: '市场融资排行',
        title: '2026 上半年赛道融资 Top 8',
        subtitle: '数据来源：公开市场披露与第三方数据库',
        columns: [
          { key: 'rank', label: '排名', align: 'center' },
          { key: 'company', label: '公司', align: 'left' },
          { key: 'track', label: '赛道', align: 'left' },
          { key: 'amount', label: '融资额', align: 'right' },
          { key: 'round', label: '轮次', align: 'center' },
        ],
        rows: [
          { rank: '1', company: '星辰科技', track: '企业级 AI', amount: '$3.2B', round: 'E 轮' },
          { rank: '2', company: '青云智算', track: '云原生', amount: '$2.1B', round: 'D 轮' },
          { rank: '3', company: '蓝湖数据', track: '数据平台', amount: '$1.8B', round: 'C 轮' },
          { rank: '4', company: '墨染设计', track: 'AIGC 设计', amount: '$1.5B', round: 'C 轮' },
          { rank: '5', company: '极光安全', track: '零信任', amount: '$980M', round: 'B 轮' },
          { rank: '6', company: '跃迁机器人', track: '具身智能', amount: '$760M', round: 'B 轮' },
          { rank: '7', company: '深海储能', track: '新能源', amount: '$620M', round: 'A 轮' },
          { rank: '8', company: '灵犀健康', track: '数字医疗', amount: '$450M', round: 'A 轮' },
        ],
        highlightRow: 0,
        footnote: '* 仅统计公开披露的大额融资事件',
      },
    },
    {
      role: 'comparison',
      layout: 'theme01_comparison_v3',
      props: {
        kicker: '方案对比',
        title: '自研方案 vs 第三方方案',
        leftTitle: '自研',
        rightTitle: '第三方',
        rows: [
          { feature: '数据隐私', left: '完全可控', right: '依赖服务商' },
          { feature: '定制化', left: '深度定制', right: '受限于模板' },
          { feature: '集成成本', left: '一次性投入高', right: '按量付费' },
          { feature: '性能瓶颈', left: '可优化空间高', right: '受平台限制' },
          { feature: '长期运维', left: '需自建团队', right: '托管运维' },
        ],
      },
    },
    {
      role: 'table',
      layout: 'theme01_table_data',
      props: {
        kicker: '功能矩阵',
        title: '产品能力对照表',
        subtitle: '绿色表示已支持，灰色表示规划中',
        columns: [
          { key: 'module', label: '模块', align: 'left' },
          { key: 'capability', label: '能力项', align: 'left' },
          { key: 'basic', label: '基础版', align: 'center' },
          { key: 'pro', label: '专业版', align: 'center' },
          { key: 'enterprise', label: '企业版', align: 'center' },
        ],
        rows: [
          { module: '编辑器', capability: '多人在线协作', basic: '—', pro: '✓', enterprise: '✓' },
          { module: '编辑器', capability: '版本历史', basic: '—', pro: '✓', enterprise: '✓' },
          { module: '导出', capability: 'PPTX 导出', basic: '✓', pro: '✓', enterprise: '✓' },
          { module: '导出', capability: 'PDF / 图片批量导出', basic: '—', pro: '✓', enterprise: '✓' },
          { module: '品牌', capability: '自定义字体与色板', basic: '—', pro: '—', enterprise: '✓' },
          { module: '安全', capability: 'SSO / 审计日志', basic: '—', pro: '—', enterprise: '✓' },
        ],
        highlightRow: 3,
        footnote: '✓ 已上线；— 规划中或暂不支持',
      },
    },
    {
      role: 'closing',
      layout: 'theme01_closing_v1',
      props: {
        title: '下一步行动',
        subtitle: '基于数据驱动，持续迭代产品竞争力',
      },
    },
  ],
};

await mkdir(outDir, { recursive: true });

await exportDeckToPptxScreenshot(goal, {
  outFile,
  width: 1920,
  height: 1080,
  title: goal.title,
  subject: goal.goal,
  author: goal.owner,
  regionFallback: true,
  vectorizeShapes: true,
  overlayText: true,
  logger: {
    debug: (msg, ...args) => console.log(`[DEBUG] ${msg}`, ...args),
    info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
    warn: (msg, ...args) => console.warn(`[WARN] ${msg}`, ...args),
    error: (msg, ...args) => console.error(`[ERROR] ${msg}`, ...args),
  },
  onProgress: (p) => console.log('[PROGRESS]', p),
});

console.log(`\n✅ PPTX 已导出: ${outFile}`);
