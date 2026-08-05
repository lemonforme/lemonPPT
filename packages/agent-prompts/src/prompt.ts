// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * 构建用于将自然语言需求转换为 lemonPPT goal.json 的 LLM prompt。
 * 自 0.x 起，Agent 不再直接选择版式，而是输出“页面角色(role) + props”，
 * 由 deckComposer 自动将 role 映射为最合适的版式。
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

const ROLE_CATALOG = `
可用页面角色（按内容类型选择）及其常用 props：

1. cover - 封面页
   props: { kicker?: string, title: string, subtitle?: string, date?: string, image?: string }

2. tableOfContents - 目录页
   props: { kicker?: string, title: string, items?: string[] }

3. metric - 超大数字/核心指标页
   props: { kicker?: string, label?: string, value: string, unit?: string, description?: string }

4. stats - 关键指标网格页（多指标 2x2 展示）
   props: { kicker?: string, title: string, stats?: { label?: string, value?: string, unit?: string, change?: string }[] }

5. chart - 基础图表页（柱状图/折线图/饼图）
   props: { title: string, kicker?: string, type?: 'bar' | 'line' | 'pie', labels?: string[], data?: number[], unit?: string }

6. comparison - 左右对比/优缺点对比页
   props: { kicker?: string, title: string, leftTitle?: string, leftPoints?: string[], rightTitle?: string, rightPoints?: string[] }

7. pricing - 价格方案页
   props: { kicker?: string, title: string, tiers?: { name?: string, price?: string, period?: string, features?: string[], cta?: string }[] }

8. process - 流程步骤页
   props: { kicker?: string, title: string, steps?: string[] | { title?: string; description?: string }[] }

9. timeline - 时间线/里程碑页
   props: { kicker?: string, title: string, milestones?: { date?: string, title?: string, description?: string }[] }

10. roadmap - 路线图页（阶段规划）
    props: { kicker?: string, title: string, phases?: { title?: string, description?: string, status?: string }[] }

11. quote - 居中文摘/侧栏引用页
    props: { quote: string, author?: string, source?: string, role?: string }

12. testimonial - 客户评价页（引用 + 头像/公司）
    props: { quote: string, author?: string, role?: string, avatarUrl?: string, company?: string }

13. content - 要点/双列/图文并排内容页
    props: { kicker?: string, title: string, points?: string[], leftPoints?: string[], rightPoints?: string[], imageUrl?: string, imageAlt?: string }

14. faq - 问答页
    props: { kicker?: string, title: string, items?: { q?: string, a?: string }[] }

15. feature - 产品特性页
    props: { kicker?: string, title: string, features?: { title?: string, description?: string }[] }

16. team - 团队介绍页
    props: { kicker?: string, title: string, members?: { name?: string, role?: string, bio?: string, imageUrl?: string }[] }

17. partners - 合作伙伴墙页
    props: { kicker?: string, title: string, partners?: { name?: string, logoUrl?: string }[] }

18. image - 全屏图片页
    props: { title: string, subtitle?: string, imageUrl?: string, imageAlt?: string }

19. gallery - 图片画廊页
    props: { kicker?: string, title: string, images?: { url?: string, caption?: string }[] }

20. swot - SWOT 分析页
    props: { title: string, kicker?: string, strength?: string, weakness?: string, opportunity?: string, threat?: string }

21. pest - PEST 分析页
    props: { title: string, kicker?: string, political?: string, economic?: string, social?: string, technological?: string }

22. closing - 结尾号召/联系信息页
    props: { kicker?: string, title: string, subtitle?: string, cta?: string, contact?: string, email?: string, link?: string }
`;

export function buildPrompt(context: PromptContext): string {
  const { input, pageCount = 8, theme = 'theme01', language = 'zh' } = context;

  return `你是一个专业的演示文稿规划助手。请根据用户的需求，生成一份符合 lemonPPT 格式的 goal.json。

${ROLE_CATALOG}

输出要求：
- 必须是合法 JSON，不要包含 markdown 代码块标记或额外解释。
- 顶层字段：title, goal, audience, owner, theme, language, pageCount, randomSeed, slides。
- theme 固定为 "${theme}"，language 固定为 "${language}"，pageCount 为 ${pageCount}。
- slides 数组长度必须等于 pageCount。
- 每个 slide 必须包含 role（从上述角色中选择）和 props（对应角色的字段）。
- 不要输出 layout 字段；系统会自动根据 role 选择最合适的版式。
- 不要输出 _slideIdx、_pageCount 等内部字段。
- 根据每页内容角色选择角色：封面用 cover，目录用 tableOfContents，数据/大数字用 metric/stats，图表用 chart，对比用 comparison，流程/时间线/路线用 process/timeline/roadmap，团队用 team，价格用 pricing，引用用 quote/testimonial，产品亮点/场景展示用 feature/content，FAQ 用 faq，合作伙伴墙用 partners，图片集用 gallery/image，分析用 swot/pest，结尾用 closing。
- 尽量多样化使用角色，避免连续多页使用同一个角色。
- 内容应围绕用户主题，自然、有逻辑，并符合 ${language === 'zh' ? '中文' : language} 表达习惯。禁止返回通用占位文案，如"一句话描述价值"、"补充说明"、"待替换"、"更多信息"等。
- 如果用户输入中包含数字、百分比、金额、季度、增长率等，优先用于 metric/stats/chart 角色，不要忽略。
- 为需要图片的角色（cover、image、gallery、content_v3、feature_v3、team、partners、testimonial 等）可以提供高质量图片 URL（如 https://images.unsplash.com/photo-<id>?w=1920&q=80）；若无法确保 URL 真实有效，请直接省略该图片字段，系统会自动填充占位图。
- 所有字符串字段禁止返回空字符串；所有数组字段禁止返回空数组或只包含空对象的数组。
- cover/closing/content/feature/process/timeline/roadmap/faq/pricing/partners/gallery/stats/chart/tableOfContents 必须提供 title。
- metric 角色必须提供 label 与 value（或 metrics 数组），不要提供 title。
- quote/testimonial 必须提供非空 quote 字段。
- stats 必须提供 title 与 stats 数组。
- chart 请提供真实、合理的 data 数组与 labels，labels 数量与 data 数量一致；若使用 chart_v2 数据集，labels 数量与各 dataset.data 数量也必须一致。
- stats/process/timeline/roadmap/feature/faq/team/partners/pricing/gallery/tableOfContents 等角色对应的数组字段必须非空，且每个元素的关键字段不得为空。
- swot 必须提供 strength/weakness/opportunity/threat 中的至少一个；pest 必须提供 political/economic/social/technological 中的至少一个。
- 从第 2 页开始展开核心论点，最后一页使用 closing 角色做总结或行动号召。
- randomSeed 使用一个稳定的字符串，例如 "lemon-<日期>-<序号>"。

版式字段详细说明（按 role 汇总，系统会按这些 schema 自动匹配版式）：
- content: content_v1 用 points: string[]；content_v2 用 leftPoints/rightPoints: string[]；content_v3 用 points: string[] + imageUrl: string；content_v4 用 cards: {title, description}[]。
- comparison: comparison_v1/v2 用 leftTitle/rightTitle/leftPoints/rightPoints；comparison_v3 用 leftTitle/rightTitle/rows: {feature, left, right}[]。
- metric: metric_v1/v2 用 value/unit/label/description；metric_v3 用 title + metrics: {label, value, unit, change}[]。
- chart: chart_v1 用 type/labels/data/unit；chart_v2 用 labels/datasets: {label, data, color?}[]/unit。
- process: process_v1 用 steps: string[]；process_v2/v3 用 steps: {title, description}[]。
- timeline: timeline_v1/v2 用 milestones: {date, title, description}[]；timeline_v3 用 events: {date, title, description}[]。
- roadmap: roadmap_v1 用 phases: {title, description, status}[]；roadmap_v2 用 phases: {phase, goals: string[]}[]。
- pricing: pricing_v1 用 tiers: {name, price, period, features: string[], cta}[]；pricing_v2 用 plans: {name, price, period, features: string[], highlighted}[]。
- team: team_v1 用 members: {name, role, bio, imageUrl}[]；team_v2 用 members: {name, role, bio, avatar}[]。
- feature: feature_v1/v2/v3 用 features: {title, description, icon?}[]；feature_v3 额外需要 image: string。
- image: image_v1 用 title/subtitle/imageUrl；image_v2 用 title/body/image/caption。
- gallery: images: {url, caption?}[]。
- partners: partners: {name, logoUrl?}[]。
- testimonial: quote/author/role/company/avatarUrl（或 avatar/logoUrl 视版式而定）。
- faq: items: {q, a}[]。
- swot: title + strength/weakness/opportunity/threat。
- pest: title + political/economic/social/technological。

用户需求：
"""
${input}
"""

请直接输出 goal.json：`;
}
