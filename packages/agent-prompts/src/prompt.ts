/**
 * 构建用于将自然语言需求转换为 lemonPPT goal.json 的 LLM prompt。
 */

export interface PromptContext {
  /** 用户原始输入 */
  input: string;
  /** 可选：期望页数 */
  pageCount?: number;
  /** 可选：指定主题 */
  theme?: string;
  /** 可选：目标语言 */
  language?: string;
}

const LAYOUT_CATALOG = `
可用版式（按用途选择）：

1. minimal_cover_v1 - 封面页
   props: { kicker?: string, title: string, subtitle?: string, date?: string, image?: string }

2. minimal_table_of_contents_v1 - 目录页
   props: { kicker?: string, title: string, items?: string[] }

3. minimal_metric_v1 - 超大数字页
   props: { label?: string, value: string, unit?: string, description?: string }

4. minimal_metric_v2 - 核心数字页
   props: { kicker?: string, value: string, unit?: string, description?: string }

5. minimal_content_v1 - 要点内容页
   props: { kicker?: string, title: string, points?: string[] }

6. minimal_content_v2 - 双列要点页
   props: { kicker?: string, title: string, leftPoints?: string[], rightPoints?: string[] }

7. minimal_content_v3 - 图文并排页
   props: { kicker?: string, title: string, points?: string[], imageUrl?: string, imageAlt?: string }

8. minimal_comparison_v1 - 左右对比页
   props: { kicker?: string, title: string, leftTitle?: string, leftPoints?: string[], rightTitle?: string, rightPoints?: string[] }

9. minimal_comparison_v2 - 优缺点对比页
   props: { kicker?: string, title: string, leftTitle?: string, leftPoints?: string[], rightTitle?: string, rightPoints?: string[] }

10. minimal_process_v1 - 流程步骤页
    props: { kicker?: string, title: string, steps?: string[] }

11. minimal_process_v2 - 垂直时间线页
    props: { kicker?: string, title: string, steps?: { title?: string; description?: string }[] }

12. minimal_quote_v1 - 居中文摘页
    props: { quote: string, author?: string, source?: string }

13. minimal_quote_v2 - 侧栏引用页
    props: { quote: string, author?: string, role?: string }

14. minimal_chart_v1 - 基础图表页（柱状图/折线图/饼图）
    props: { title: string, kicker?: string, type?: 'bar' | 'line' | 'pie', labels?: string[], data?: number[], unit?: string }

15. minimal_swot_v1 - SWOT 分析页
    props: { title: string, kicker?: string, strength?: string, weakness?: string, opportunity?: string, threat?: string }

16. minimal_pest_v1 - PEST 分析页
    props: { title: string, kicker?: string, political?: string, economic?: string, social?: string, technological?: string }

17. minimal_closing_v1 - 结尾号召页
    props: { kicker?: string, title: string, subtitle?: string, cta?: string }

18. minimal_closing_v2 - 联系信息结尾页
    props: { title: string, subtitle?: string, contact?: string, email?: string, link?: string }

19. minimal_image_v1 - 全屏图片页
    props: { title: string, subtitle?: string, imageUrl?: string, imageAlt?: string }

20. minimal_team_v1 - 团队介绍页
    props: { kicker?: string, title: string, members?: { name?: string, role?: string, bio?: string, imageUrl?: string }[] }

21. minimal_feature_v1 - 产品特性页
    props: { kicker?: string, title: string, features?: { title?: string, description?: string }[] }

22. minimal_timeline_v1 - 时间线页
    props: { kicker?: string, title: string, milestones?: { date?: string, title?: string, description?: string }[] }

23. minimal_pricing_v1 - 价格方案页
    props: { kicker?: string, title: string, tiers?: { name?: string, price?: string, period?: string, features?: string[], cta?: string }[] }

24. minimal_split_v1 - 图文分屏页
    props: { kicker?: string, title: string, points?: string[], imageUrl?: string, imageAlt?: string }

25. minimal_stats_v1 - 关键指标网格页
    props: { kicker?: string, title: string, stats?: { label?: string, value?: string, unit?: string, change?: string }[] }

26. minimal_gallery_v1 - 图片画廊页
    props: { kicker?: string, title: string, images?: { url?: string, caption?: string }[] }

27. minimal_faq_v1 - 问答页
    props: { kicker?: string, title: string, items?: { q?: string, a?: string }[] }

28. minimal_partners_v1 - 合作伙伴墙页
    props: { kicker?: string, title: string, partners?: { name?: string, logoUrl?: string }[] }

29. minimal_testimonial_v1 - 客户评价页
    props: { quote: string, author?: string, role?: string, avatarUrl?: string, company?: string }

30. minimal_roadmap_v1 - 路线图页
    props: { kicker?: string, title: string, phases?: { title?: string, description?: string, status?: string }[] }
`;

export function buildPrompt(context: PromptContext): string {
  const { input, pageCount = 8, theme = 'minimal', language = 'zh' } = context;

  return `你是一个专业的演示文稿规划助手。请根据用户的需求，生成一份符合 lemonPPT 格式的 goal.json。

${LAYOUT_CATALOG}

输出要求：
- 必须是合法 JSON，不要包含 markdown 代码块标记或额外解释。
- 顶层字段：title, goal, audience, owner, theme, language, pageCount, randomSeed, slides。
- theme 固定为 "${theme}"，language 固定为 "${language}"，pageCount 为 ${pageCount}。
- slides 数组长度必须等于 pageCount。
- 每个 slide 必须包含 layout（从上述版式中选择）和 props（对应版式的字段）。
- 根据每页内容角色选择版式：封面用 cover，目录用 table_of_contents，数据用 metric/chart/stats，对比用 comparison，流程用 process/timeline/roadmap，团队用 team，价格用 pricing，引用用 quote，分析用 swot/pest，产品亮点/场景展示用 split_v1，FAQ 用 faq_v1，合作伙伴墙用 partners_v1，客户评价用 testimonial_v1，图片集用 gallery_v1，结尾用 closing。
- 尽量多样化使用版式，避免连续多页使用同一个版式。
- 内容应围绕用户主题，自然、有逻辑，并符合中文表达习惯。
- 为需要图片的版式（cover、image_v1、content_v3、split_v1、gallery_v1、team_v1、partners_v1、testimonial_v1 等）提供高质量图片 URL，使用 https://images.unsplash.com/photo-<id>?w=1920&q=80 形式，id 应选用与主题相关、看起来真实存在的 Unsplash 图片编号，并确保图片风格与整体主题一致。
- chart_v1 请提供真实、合理的 data 数组与 labels，labels 数量与 data 数量一致。
- 从第 2 页开始展开核心论点，最后一页使用 closing 版式做总结或行动号召。
- randomSeed 使用一个稳定的字符串，例如 "lemon-<日期>-<序号>"。

用户需求：
"""
${input}
"""

请直接输出 goal.json：`;
}
