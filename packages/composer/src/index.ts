import type { DeckGoal, LayoutMeta, Slide, SlideRole } from '@lemonppt/core';
import { listLayoutsByRole } from '@lemonppt/templates';
import { normalizeDeck } from '@lemonppt/view-model';

export interface ComposeSlideInput {
  /** 页面角色；提供 role 时 composer 会自动挑选版式 */
  role?: SlideRole;
  /** 具体版式 ID；优先级高于 role */
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
 * 只包含 props 形状相近、可安全互换的版式；
 * 更复杂的版式（如图库、团队、价格表）需要显式指定 layout。
 */
const ROLE_LAYOUT_CANDIDATES: Record<SlideRole, string[]> = {
  cover: ['minimal_cover_v1'],
  tableOfContents: ['minimal_table_of_contents_v1'],
  metric: ['minimal_metric_v1', 'minimal_metric_v2'],
  chart: ['minimal_chart_v1'],
  comparison: ['minimal_comparison_v1', 'minimal_comparison_v2'],
  process: ['minimal_process_v1'],
  quote: ['minimal_quote_v1', 'minimal_quote_v2'],
  content: ['minimal_content_v1'],
  image: ['minimal_image_v1'],
  analysis: ['minimal_swot_v1', 'minimal_pest_v1'],
  closing: ['minimal_closing_v1', 'minimal_closing_v2'],
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
  const candidates = ROLE_LAYOUT_CANDIDATES[role] ?? ['minimal_content_v1'];
  const registered = listLayoutsByRole(role).map((m: LayoutMeta) => m.id);
  const validCandidates = candidates.filter((id) => registered.includes(id));
  const pool = validCandidates.length > 0 ? validCandidates : registered.length > 0 ? registered : ['minimal_content_v1'];

  const random = seed ? createSeededRandom(`${seed}-${index}`) : Math.random;
  const idx = Math.floor(random() * pool.length);
  return pool[idx]!;
}

/**
 * 将角色/版式输入编排成完整的 DeckGoal，并通过 view-model 规范化。
 */
export function composeDeck(input: ComposeInput): DeckGoal {
  const slides: Slide[] = input.slides.map((s, index) => {
    const layout = s.layout ?? (s.role ? selectLayoutForRole(s.role, input.randomSeed, index) : 'minimal_content_v1');
    return {
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
 * 对已有的 DeckGoal 重新执行规范化（页码注入、文本截断等）。
 */
export function recomposeDeck(goal: DeckGoal): DeckGoal {
  return normalizeDeck(goal);
}
