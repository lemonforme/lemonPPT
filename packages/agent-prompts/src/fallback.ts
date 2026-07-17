/**
 * 当未配置 LLM API Key 时，基于用户输入生成一份 demo 级别的 goal.json。
 */

import type { DeckGoal } from '@lemonppt/core';

export interface FallbackOptions {
  input: string;
  pageCount?: number;
  theme?: string;
  language?: string;
}

export function createFallbackGoal(options: FallbackOptions): DeckGoal {
  const { input, pageCount = 5, theme = 'minimal', language = 'zh' } = options;
  const title = input.split(/[。！？\n]/)[0].slice(0, 30) || '未命名演示';

  const baseSlides: { layout: string; props: Record<string, unknown> }[] = [
    {
      layout: 'minimal_cover_v1',
      props: {
        kicker: '自动生成',
        title,
        subtitle: '由 lemonPPT 根据您的描述生成',
      },
    },
    {
      layout: 'minimal_table_of_contents_v1',
      props: {
        kicker: '目录',
        title: '内容概览',
        items: ['核心要点', '关键数据', '实施流程', '展望未来'],
      },
    },
    {
      layout: 'minimal_content_v2',
      props: {
        kicker: '核心要点',
        title: '本次分享的重点',
        leftPoints: [`主题：${title}`, '结构清晰，重点突出'],
        rightPoints: ['支持多主题切换', '导出可编辑 PPTX'],
      },
    },
    {
      layout: 'minimal_metric_v1',
      props: {
        label: '效率提升',
        value: '10',
        unit: '倍',
        description: '使用 lemonPPT 自动生成演示文稿',
      },
    },
    {
      layout: 'minimal_process_v2',
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
      layout: 'minimal_chart_v1',
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
      layout: 'minimal_quote_v2',
      props: {
        quote: '好的演示文稿不是信息的堆砌，而是观点的提炼。',
        author: 'lemonPPT',
        role: '设计原则',
      },
    },
    {
      layout: 'minimal_swot_v1',
      props: {
        title: 'SWOT 简析',
        strength: 'AI 自动化生成，节省时间',
        weakness: '复杂图表仍需手动调整',
        opportunity: '可扩展为企业私有化部署',
        threat: '同类产品竞争激烈',
      },
    },
    {
      layout: 'minimal_closing_v2',
      props: {
        title: '开始创作',
        subtitle: '用 lemonPPT 把你的想法变成演示',
        contact: 'lemonPPT 团队',
        email: 'hello@lemonppt.dev',
        link: 'https://lemonppt.dev',
      },
    },
  ];

  const slides = baseSlides.slice(0, pageCount);

  // 如果页数少于基础版式，确保最后一页是结尾页
  const lastSlide = slides[slides.length - 1];
  if (lastSlide && !lastSlide.layout.startsWith('minimal_closing')) {
    slides[slides.length - 1] = baseSlides.find((s) => s.layout.startsWith('minimal_closing'))!;
  }

  // 如果页数多于基础版式，用内容页填充
  while (slides.length < pageCount) {
    slides.splice(slides.length - 1, 0, {
      layout: 'minimal_content_v3',
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
