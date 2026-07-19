/**
 * 当未配置 LLM API Key 时，基于用户输入生成一份 demo 级别的 goal.json。
 * fallback 直接产出完整 Slide（含 role + layout），仍走 recomposeDeck 规范化。
 */

import type { DeckGoal } from '@lemonppt/core';

export interface FallbackOptions {
  input: string;
  pageCount?: number;
  theme?: string;
  language?: string;
}

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

function extractTitle(input: string): string {
  const firstSentence = input.split(/[。！？\n]/)[0].trim();
  if (firstSentence.length <= 80) return firstSentence || '未命名演示';

  // 超过 80 字符时，尽量在语义边界截断，避免切断数字或关键词
  const truncated = firstSentence.slice(0, 80);
  const lastPunct = Math.max(truncated.lastIndexOf('，'), truncated.lastIndexOf('、'));
  if (lastPunct > 40) return truncated.slice(0, lastPunct);
  return truncated;
}

function inferAudience(input: string): string {
  if (input.includes('企业客户')) return '企业客户';
  if (input.includes('投资人')) return '投资人';
  if (input.includes('内部')) return '内部团队';
  return '通用观众';
}

function inferSellingPoints(input: string): string[] {
  const match = input.match(/核心卖点[：:](.+)/);
  if (match) {
    return match[1]
      .split(/[,，、]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);
  }
  return ['核心优势一', '核心优势二', '核心优势三'];
}

export function createFallbackGoal(options: FallbackOptions): DeckGoal {
  const { input, pageCount = 5, theme = 'base', language = 'zh' } = options;
  const title = extractTitle(input);
  const audience = inferAudience(input);
  const sellingPoints = inferSellingPoints(input);
  const [sp1 = '核心优势一', sp2 = '核心优势二', sp3 = '核心优势三', sp4 = '持续迭代'] = sellingPoints;

  const baseSlides: { layout: string; props: Record<string, unknown> }[] = [
    {
      layout: 'cover_v1',
      props: {
        kicker: '产品发布',
        title,
        subtitle: '由 lemonPPT 根据你的描述生成（fallback 示例）',
      },
    },
    {
      layout: 'table_of_contents_v1',
      props: {
        kicker: '目录',
        title: '内容概览',
        items: ['核心卖点', '关键数据', '实施流程', '展望未来'],
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
    {
      layout: 'metric_v1',
      props: {
        label: '效率提升',
        value: '10',
        unit: '倍',
        description: 'AI 助手帮助企业客户显著降本增效',
      },
    },
    {
      layout: 'process_v2',
      props: {
        kicker: '实施流程',
        title: '三步落地',
        steps: [
          { title: '需求调研', description: '梳理企业业务场景与关键痛点' },
          { title: '私有化部署', description: '安全接入企业知识库与系统' },
          { title: '持续运营', description: '基于使用数据不断优化效果' },
        ],
      },
    },
    {
      layout: 'chart_v1',
      props: {
        kicker: '数据洞察',
        title: '增长趋势',
        type: 'bar',
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        data: [12, 19, 28, 40],
        unit: '%',
      },
    },
    {
      layout: 'quote_v2',
      props: {
        quote: 'AI 不是替代人，而是让每个人拥有更强的创造力。',
        author: '产品团队',
        role: '产品理念',
      },
    },
    {
      layout: 'swot_v1',
      props: {
        title: 'SWOT 简析',
        strength: '深耕企业场景，私有化部署能力',
        weakness: '品牌知名度仍需建设',
        opportunity: '企业数字化转型需求旺盛',
        threat: '同类产品竞争激烈',
      },
    },
    {
      layout: 'closing_v2',
      props: {
        title: '开启智能办公新篇章',
        subtitle: '让 AI 助手成为企业增长的新引擎',
        contact: '产品团队',
        email: 'hello@lemonppt.dev',
        link: 'https://lemonppt.dev',
      },
    },
  ];

  const slides = baseSlides
    .slice(0, pageCount)
    .map((s) => ({ role: layoutToRole(s.layout), layout: s.layout, props: s.props }));

  // 如果页数少于基础版式，确保最后一页是结尾页
  const lastSlide = slides[slides.length - 1];
  if (lastSlide && lastSlide.role !== 'closing') {
    const closing = baseSlides.find((s) => layoutToRole(s.layout) === 'closing');
    if (closing) {
      slides[slides.length - 1] = {
        role: 'closing',
        layout: closing.layout,
        props: closing.props,
      };
    }
  }

  // 如果页数多于基础版式，用内容页填充
  while (slides.length < pageCount) {
    slides.splice(slides.length - 1, 0, {
      role: 'content',
      layout: 'content_v3',
      props: {
        kicker: `补充页 ${slides.length}`,
        title: '更多内容',
        points: [
          `围绕“${title}”展开说明`,
          '可替换为 AI 生成的要点',
          '保持整体叙事一致',
        ],
      },
    });
  }

  return {
    title,
    goal: input,
    audience,
    owner: 'lemonPPT',
    theme,
    language,
    pageCount,
    randomSeed: `fallback-${Date.now()}`,
    slides,
  } as DeckGoal;
}
