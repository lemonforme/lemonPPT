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

export function createFallbackGoal(options: FallbackOptions): DeckGoal {
  const { input, pageCount = 5, theme = 'base', language = 'zh' } = options;
  const title = input.split(/[。！？\n]/)[0].slice(0, 30) || '未命名演示';

  const baseSlides: { layout: string; props: Record<string, unknown> }[] = [
    {
      layout: 'cover_v1',
      props: {
        kicker: '自动生成',
        title,
        subtitle: '由 lemonPPT 根据您的描述生成',
      },
    },
    {
      layout: 'table_of_contents_v1',
      props: {
        kicker: '目录',
        title: '内容概览',
        items: ['核心要点', '关键数据', '实施流程', '展望未来'],
      },
    },
    {
      layout: 'content_v2',
      props: {
        kicker: '核心要点',
        title: '本次分享的重点',
        leftPoints: [`主题：${title}`, '结构清晰，重点突出'],
        rightPoints: ['支持多主题切换', '导出可编辑 PPTX'],
      },
    },
    {
      layout: 'metric_v1',
      props: {
        label: '效率提升',
        value: '10',
        unit: '倍',
        description: '使用 lemonPPT 自动生成演示文稿',
      },
    },
    {
      layout: 'process_v2',
      props: {
        kicker: '流程',
        title: '三步完成',
        steps: [
          { title: '描述需求', description: '用自然语言输入 PPT 主题与重点' },
          { title: 'AI 生成内容', description: '自动规划页面并填充文案' },
          { title: '导出演示文稿', description: '支持 PPTX、PDF 与 HTML' },
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
        quote: '好的演示文稿不是信息的堆砌，而是观点的提炼。',
        author: 'lemonPPT',
        role: '设计原则',
      },
    },
    {
      layout: 'swot_v1',
      props: {
        title: 'SWOT 简析',
        strength: 'AI 自动化生成，节省时间',
        weakness: '复杂图表仍需手动调整',
        opportunity: '可扩展为企业私有化部署',
        threat: '同类产品竞争激烈',
      },
    },
    {
      layout: 'closing_v2',
      props: {
        title: '开始创作',
        subtitle: '用 lemonPPT 把你的想法变成演示',
        contact: 'lemonPPT 团队',
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
    audience: '通用观众',
    owner: 'lemonPPT',
    theme,
    language,
    pageCount,
    randomSeed: `fallback-${Date.now()}`,
    slides,
  } as DeckGoal;
}
