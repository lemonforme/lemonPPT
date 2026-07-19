import type { DeckGoal, LayoutMeta, RawDeckGoal, Slide, SlideRole } from '@lemonppt/core';
import { listLayoutsByRole } from '@lemonppt/templates';
import { normalizeDeck } from '@lemonppt/view-model';

export interface ComposeSlideInput {
  /** 页面角色；提供 role 时 composer 会自动挑选版式 */
  role: SlideRole;
  /** 具体版式 ID；优先级高于自动选择 */
  layout?: string;
  /** 页面属性 */
  props?: Record<string, unknown>;
}

export interface ComposeInput {
  title: string;
  goal: string;
  audience: string;
  owner?: string;
  theme: string;
  language?: 'zh' | 'en';
  pageCount?: number;
  randomSeed?: string;
  slides: ComposeSlideInput[];
}

/**
 * 角色到候选版式的映射。
 * 覆盖当前 30 个版式，同一角色下的多个版式会在生成时随机/按 seed 轮换。
 */
const ROLE_LAYOUT_CANDIDATES: Record<SlideRole, string[]> = {
  cover: ['cover_v1'],
  tableOfContents: ['table_of_contents_v1'],
  metric: ['metric_v1', 'metric_v2'],
  stats: ['stats_v1'],
  chart: ['chart_v1', 'chart_v2'],
  comparison: ['comparison_v1', 'comparison_v2'],
  pricing: ['pricing_v1'],
  process: ['process_v1', 'process_v2'],
  timeline: ['timeline_v1'],
  roadmap: ['roadmap_v1'],
  quote: ['quote_v1', 'quote_v2'],
  testimonial: ['testimonial_v1', 'testimonial_v2'],
  content: ['content_v1', 'content_v2', 'content_v3', 'split_v1'],
  faq: ['faq_v1'],
  feature: ['feature_v1'],
  team: ['team_v1'],
  partners: ['partners_v1'],
  image: ['image_v1'],
  gallery: ['gallery_v1', 'gallery_v2'],
  swot: ['swot_v1'],
  pest: ['pest_v1'],
  closing: ['closing_v1', 'closing_v2'],
};

/**
 * 基于字符串种子生成伪随机数生成器（xorshift）。
 */
function createSeededRandom(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  }
  if (s === 0) s = 123456789;
  let x = s;
  let y = 362436069;
  let z = 521288629;
  let w = 88675123;
  return () => {
    const t = x ^ (x << 11);
    x = y;
    y = z;
    z = w;
    w = (w ^ (w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;
    return w / 0xffffffff;
  };
}

/**
 * 为指定角色挑选一个版式。
 * 优先使用运行时注册表中真实存在的版式；未注册时返回兜底版式。
 */
export function selectLayoutForRole(role: SlideRole, seed?: string, index = 0): string {
  const candidates = ROLE_LAYOUT_CANDIDATES[role] ?? ['content_v1'];
  const registered = listLayoutsByRole(role).map((m: LayoutMeta) => m.id);
  const validCandidates = candidates.filter((id) => registered.includes(id));
  const pool = validCandidates.length > 0 ? validCandidates : registered.length > 0 ? registered : ['content_v1'];

  const random = seed ? createSeededRandom(`${seed}-${index}`) : Math.random;
  const idx = Math.floor(random() * pool.length);
  return pool[idx]!;
}

/**
 * 将角色/版式输入编排成完整的 DeckGoal，并通过 view-model 规范化。
 */
export function composeDeck(input: ComposeInput): DeckGoal {
  const slides: Slide[] = input.slides.map((s, index) => {
    const layout = s.layout ?? selectLayoutForRole(s.role, input.randomSeed, index);
    return {
      role: s.role,
      layout,
      props: s.props ?? {},
    };
  });

  const draft: DeckGoal = {
    title: input.title,
    goal: input.goal,
    audience: input.audience,
    owner: input.owner,
    theme: input.theme,
    language: input.language ?? 'zh',
    pageCount: input.pageCount ?? slides.length,
    randomSeed: input.randomSeed ?? `lemon-${Date.now()}`,
    slides,
  };

  return normalizeDeck(draft);
}

/**
 * 将 Agent 原始输出（只含 role，可省略 layout）编排成完整 DeckGoal。
 */
export function composeDeckFromRaw(raw: RawDeckGoal): DeckGoal {
  return composeDeck({
    title: raw.title,
    goal: raw.goal,
    audience: raw.audience,
    owner: raw.owner,
    theme: raw.theme,
    language: raw.language,
    pageCount: raw.pageCount,
    randomSeed: raw.randomSeed,
    slides: raw.slides.map((s) => ({ role: s.role, layout: s.layout, props: s.props })),
  });
}

/**
 * 对已有的 DeckGoal 重新执行规范化（页码注入、文本截断等）。
 */
export function recomposeDeck(goal: DeckGoal): DeckGoal {
  return normalizeDeck(goal);
}
