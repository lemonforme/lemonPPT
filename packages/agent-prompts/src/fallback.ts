// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 当未配置 LLM API Key 时，基于用户输入生成一份 demo 级别的 goal.json。
 * fallback 直接产出完整 Slide（含 role + layout），仍走 recomposeDeck 规范化。
 *
 * 优化方向：
 * - 从输入中提取关键词和数字，让内容与主题更相关
 * - 根据关键词自动选择新版式（feature_v2 / pricing_v2 / team_v2 / roadmap_v2 / timeline_v2）
 * - 避免固定写死的数据， metric / chart 使用输入中的数字或合理占位
 */

import type { DeckGoal } from '@lemonppt/core';

export interface FallbackOptions {
  input: string;
  pageCount?: number;
  theme?: string;
  language?: string;
}

const ROLE_KEYWORDS: Record<string, string[]> = {
  team: ['团队', '成员', '创始人', '员工', '我们', '介绍', '核心成员'],
  pricing: ['价格', '定价', '套餐', '付费', '方案', '订阅', '多少钱'],
  roadmap: ['路线图', '规划', '阶段', '里程碑', '季度', '年度', 'roadmap', '计划'],
  feature: ['特性', '功能', '优势', '亮点', '特点', 'feature', '卖点'],
  metric: ['指标', '数据', '增长', 'kpi', 'metric', '业绩', '营收', '效率'],
  timeline: ['时间线', '历程', '发展', '里程碑', 'timeline', '历史', '节点'],
};

const layoutToRole = (layout: string): string => {
  if (layout.startsWith('cover')) return 'cover';
  if (layout.startsWith('table_of_contents')) return 'tableOfContents';
  if (layout.startsWith('metric')) return 'metric';
  if (layout.startsWith('stats')) return 'stats';
  if (layout.startsWith('chart')) return 'chart';
  if (layout.startsWith('comparison')) return 'comparison';
  if (layout.startsWith('pricing')) return 'pricing';
  if (layout.startsWith('process')) return 'process';
  if (layout.startsWith('timeline')) return 'timeline';
  if (layout.startsWith('roadmap')) return 'roadmap';
  if (layout.startsWith('quote')) return 'quote';
  if (layout.startsWith('testimonial')) return 'testimonial';
  if (layout.startsWith('faq')) return 'faq';
  if (layout.startsWith('feature')) return 'feature';
  if (layout.startsWith('team')) return 'team';
  if (layout.startsWith('partners')) return 'partners';
  if (layout.startsWith('gallery')) return 'gallery';
  if (layout.startsWith('image')) return 'image';
  if (layout.startsWith('swot')) return 'swot';
  if (layout.startsWith('pest')) return 'pest';
  if (layout.startsWith('closing')) return 'closing';
  return 'content';
};

function detectKeywords(input: string): Record<string, boolean> {
  return Object.fromEntries(
    Object.entries(ROLE_KEYWORDS).map(([key, words]) => [
      key,
      words.some((word) => input.toLowerCase().includes(word.toLowerCase())),
    ])
  );
}

function extractTitle(input: string): string {
  const firstSentence = input.split(/[。！？\n]/)[0].trim();
  if (firstSentence.length <= 80) return firstSentence || '未命名演示';

  const truncated = firstSentence.slice(0, 80);
  const lastPunct = Math.max(truncated.lastIndexOf('，'), truncated.lastIndexOf('、'));
  if (lastPunct > 40) return truncated.slice(0, lastPunct);
  return truncated;
}

function inferAudience(input: string): string {
  if (input.includes('投资人')) return '投资人';
  if (input.includes('企业客户') || input.includes('企业')) return '企业客户';
  if (input.includes('内部')) return '内部团队';
  if (input.includes('用户')) return '终端用户';
  return '通用观众';
}

function inferSellingPoints(input: string): string[] {
  const patterns = [/核心卖点[：:](.+)/, /优势[：:](.+)/, /特点[：:](.+)/, /亮点[：:](.+)/, /卖点[：:](.+)/];
  for (const re of patterns) {
    const match = input.match(re);
    if (match) {
      const pts = match[1]
        .split(/[,，、]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 4);
      if (pts.length >= 2) return pts;
    }
  }

  const clauses = input
    .split(/[,，、。！？]/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 4 && s.length <= 30 && !/^面向/.test(s));
  if (clauses.length >= 2) return clauses.slice(0, 4);

  // 基于主题关键词生成更自然的默认卖点（优先匹配更具体的垂直领域）
  const lowered = input.toLowerCase();
  if (lowered.includes('ai') || lowered.includes('人工智能') || lowered.includes('智能')) {
    return ['智能化决策支持', '自动化流程处理', '数据驱动洞察', '持续学习优化'];
  }
  if (lowered.includes('教育') || lowered.includes('培训') || lowered.includes('学习')) {
    return ['个性化学习路径', '互动式教学体验', '学习效果追踪', '优质内容沉淀'];
  }
  if (lowered.includes('医疗') || lowered.includes('健康')) {
    return ['全病程管理', '数据互联互通', '智能辅助决策', '患者体验升级'];
  }
  if (lowered.includes('金融') || lowered.includes('财务') || lowered.includes('支付')) {
    return ['合规风控体系', '实时资金流转', '智能对账核算', '多场景覆盖'];
  }
  if (lowered.includes('电商') || lowered.includes('零售') || lowered.includes('供应链')) {
    return ['全渠道运营', '智能选品补货', '库存精益管理', '消费者精准运营'];
  }
  if (lowered.includes('数据') || lowered.includes('分析') || lowered.includes('大数据')) {
    return ['全域数据采集', '实时分析看板', '智能预测预警', '决策可视呈现'];
  }
  if (lowered.includes('营销') || lowered.includes('增长') || lowered.includes('获客')) {
    return ['精准用户触达', '全链路转化追踪', '内容智能分发', 'ROI 持续提升'];
  }
  if (lowered.includes('团队') || lowered.includes('协作') || lowered.includes('办公')) {
    return ['信息实时同步', '任务高效协同', '知识沉淀复用', '流程透明可控'];
  }
  if (lowered.includes('云') || lowered.includes('saas') || lowered.includes('平台')) {
    return ['弹性扩展能力', '降低运维成本', '快速部署上线', '多端协同支持'];
  }
  return ['显著提升效率', '降低综合成本', '优化用户体验', '支撑持续增长'];
}

function extractNumbers(input: string): number[] {
  const matches = input.match(/\d+(\.\d+)?/g);
  return matches ? matches.map(Number) : [];
}

function inferMetric(input: string, numbers: number[]): { label: string; value: string; unit: string; description: string } {
  const unitMatch = input.match(/(\d+(?:\.\d+)?)\s*([倍%万家个kK亿]+)/);
  if (unitMatch) {
    return { label: '关键指标', value: unitMatch[1]!, unit: unitMatch[2]!, description: '从主题中提取的核心数据' };
  }
  if (numbers.length > 0) {
    return { label: '关键指标', value: String(numbers[0]), unit: '%', description: '从主题中提取的核心数据' };
  }
  return { label: '效率提升', value: '85', unit: '%', description: 'AI 助手帮助企业客户显著降本增效' };
}

function inferChartData(input: string, numbers: number[]): { labels: string[]; data: number[]; unit: string } {
  const quarterMatch = input.match(/(Q[1-4][\s,，、Q]+){2,}/i);
  if (quarterMatch && numbers.length >= 2) {
    return { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: numbers.slice(0, 4), unit: '%' };
  }
  if (numbers.length >= 4) {
    return { labels: ['阶段一', '阶段二', '阶段三', '阶段四'], data: numbers.slice(0, 4), unit: '' };
  }
  if (numbers.length >= 2) {
    return { labels: numbers.map((_, i) => `节点 ${i + 1}`), data: numbers, unit: '' };
  }
  return { labels: ['Q1', 'Q2', 'Q3', 'Q4'], data: [20, 45, 70, 95], unit: '%' };
}

interface CandidateSlide {
  layout: string;
  props: Record<string, unknown>;
}

function buildCandidateSlides(
  input: string,
  title: string,
  audience: string,
  points: string[],
  numbers: number[],
  pageCount: number
): CandidateSlide[] {
  const [sp1 = '核心优势一', sp2 = '核心优势二', sp3 = '核心优势三', sp4 = '持续迭代'] = points;
  const metric = inferMetric(input, numbers);
  const chart = inferChartData(input, numbers);
  const kw = detectKeywords(input);

  const cover: CandidateSlide = {
    layout: 'cover_v1',
    props: {
      kicker: '产品发布',
      title,
      subtitle: `面向${audience}的演示方案`,
    },
  };

  const closing: CandidateSlide = {
    layout: 'closing_v2',
    props: {
      title: '开启新篇章',
      subtitle: title,
      contact: '产品团队',
      email: 'hello@lemonppt.dev',
      link: 'https://lemonppt.dev',
    },
  };

  const requiredMiddle: CandidateSlide[] = [
    {
      layout: 'table_of_contents_v1',
      props: {
        kicker: '目录',
        title: '内容概览',
        items: ['核心卖点', '关键数据', '实施流程', '未来展望'],
      },
    },
    {
      layout: 'content_v2',
      props: {
        kicker: '核心卖点',
        title: '为什么选择我们',
        leftPoints: [sp1, sp2],
        rightPoints: [sp3, sp4],
      },
    },
    kw.feature
      ? {
          layout: 'feature_v2',
          props: {
            kicker: '产品特性',
            title: '核心能力一览',
            features: [
              { title: sp1, description: '为业务场景深度优化的关键能力', icon: '◆' },
              { title: sp2, description: '显著提升效率与体验的差异化优势', icon: '◆' },
              { title: sp3, description: '面向未来扩展的长期价值支撑', icon: '◆' },
            ],
          },
        }
      : {
          layout: 'content_v3',
          props: {
            kicker: '方案介绍',
            title,
            points: [sp1, sp2, sp3],
          },
        },
    {
      layout: numbers.length > 0 ? 'metric_v1' : 'metric_v3',
      props:
        numbers.length > 0
          ? {
              kicker: '关键数据',
              label: metric.label,
              value: metric.value,
              unit: metric.unit,
              description: metric.description,
            }
          : {
              kicker: '关键数据',
              title: '核心增长指标',
              metrics: [
                { label: '效率提升', value: '10', unit: '倍', change: '+35%' },
                { label: '客户覆盖', value: '50+', unit: '家', change: '+120%' },
              ],
            },
    },
    {
      layout: 'process_v1',
      props: {
        kicker: '实施流程',
        title: '三步落地',
        steps: ['需求调研', '方案落地', '持续运营'],
      },
    },
    {
      layout: 'chart_v1',
      props: {
        kicker: '数据洞察',
        title: '增长趋势',
        type: 'bar',
        labels: chart.labels,
        data: chart.data,
        unit: chart.unit,
      },
    },
    {
      layout: 'quote_v2',
      props: {
        quote: '让技术真正服务于人，让每一次表达都更有力量。',
        author: '产品团队',
        role: '产品理念',
      },
    },
  ];

  const optionalMiddle: CandidateSlide[] = [];
  if (kw.timeline) {
    optionalMiddle.push({
      layout: 'timeline_v2',
      props: {
        kicker: '发展历程',
        title: '关键里程碑',
        milestones: [
          { date: '第一阶段', title: '产品立项', description: '验证核心场景与用户需求' },
          { date: '第二阶段', title: '快速迭代', description: '发布 MVP 并收集反馈' },
          { date: '第三阶段', title: '规模化', description: '服务更多客户，完善生态' },
        ],
      },
    });
  }
  if (kw.roadmap) {
    optionalMiddle.push({
      layout: 'roadmap_v2',
      props: {
        kicker: '产品路线图',
        title: '未来规划',
        phases: [
          { phase: '短期', goals: ['完成核心功能打磨', '验证首批客户场景'] },
          { phase: '中期', goals: ['扩展平台能力', '提升自动化水平'] },
          { phase: '长期', goals: ['构建生态闭环', '成为行业标杆'] },
        ],
      },
    });
  }
  if (kw.team) {
    optionalMiddle.push({
      layout: 'team_v2',
      props: {
        kicker: '团队介绍',
        title: '认识我们',
        members: [
          { name: '创始人', role: 'CEO', bio: '负责战略与整体方向' },
          { name: '产品负责人', role: 'CPO', bio: '聚焦用户体验与产品迭代' },
          { name: '技术负责人', role: 'CTO', bio: '主导技术架构与工程落地' },
          { name: '运营负责人', role: 'COO', bio: '推动规模化增长与客户成功' },
        ],
      },
    });
  }
  if (kw.pricing) {
    optionalMiddle.push({
      layout: 'pricing_v2',
      props: {
        kicker: '价格方案',
        title: '选择适合你的方案',
        plans: [
          { name: '基础版', price: '¥99', period: '/月', features: ['核心功能', '邮件支持'] },
          { name: '专业版', price: '¥299', period: '/月', features: ['全部功能', '优先支持', '数据分析'], highlighted: true },
          { name: '企业版', price: '定制', period: '', features: ['私有化部署', '专属客户经理', 'SLA 保障'] },
        ],
      },
    });
  }

  // 按页数裁剪：优先保留必选页，再插入关键词匹配的可选页
  const middle: CandidateSlide[] = [];
  const maxMiddle = Math.max(0, pageCount - 2);
  for (const slide of requiredMiddle) {
    if (middle.length >= maxMiddle) break;
    middle.push(slide);
  }
  for (const slide of optionalMiddle) {
    if (middle.length >= maxMiddle) break;
    // 避免与已选页面角色重复导致叙事单调
    const exists = middle.some((s) => s.layout.split('_')[0] === slide.layout.split('_')[0]);
    if (!exists) middle.push(slide);
  }

  // 若仍不足，用内容页补齐
  while (middle.length < maxMiddle) {
    middle.push({
      layout: 'content_v3',
      props: {
        kicker: `深入解读`,
        title,
        points: [`围绕“${title}”进一步展开价值`, '结合场景说明落地路径', '强调对目标受众的差异化收益'],
      },
    });
  }

  return [cover, ...middle, closing];
}

export function createFallbackGoal(options: FallbackOptions): DeckGoal {
  const { input, pageCount = 5, theme = 'theme01', language = 'zh' } = options;
  const title = extractTitle(input);
  const audience = inferAudience(input);
  const points = inferSellingPoints(input);
  const numbers = extractNumbers(input);

  const selected = buildCandidateSlides(input, title, audience, points, numbers, pageCount);

  const slides = selected.map((s) => ({ role: layoutToRole(s.layout), layout: s.layout, props: s.props }));

  return {
    title,
    goal: input,
    audience,
    owner: 'lemonppt',
    theme,
    language,
    pageCount,
    randomSeed: `fallback-${Date.now()}`,
    slides,
  } as DeckGoal;
}
