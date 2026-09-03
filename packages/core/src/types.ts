// lemonPPT - AI-powered presentation generation
// Copyright (c) 2026 lemonforme
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * lemonPPT 核心类型定义
 * 描述 Agent 工作流与渲染引擎之间的 JSON 协议
 */

/** 页面角色，用于 Agent 选页阶段 */
export type SlideRole =
  | 'cover'
  | 'tableOfContents'
  | 'metric'
  | 'stats'
  | 'chart'
  | 'comparison'
  | 'pricing'
  | 'process'
  | 'timeline'
  | 'roadmap'
  | 'quote'
  | 'testimonial'
  | 'content'
  | 'faq'
  | 'feature'
  | 'team'
  | 'partners'
  | 'image'
  | 'gallery'
  | 'bento'
  | 'table'
  | 'tags'
  | 'filmstrip'
  | 'swot'
  | 'pest'
  | 'closing';

/** 版式标识，例如 cover_v1、metric_v2 */
export type LayoutId = string;

/** 主题标识 */
export type ThemeId = string;

/** 单页幻灯片（最终形态，必须包含版式） */
export interface Slide {
  /** 页面角色 */
  role: SlideRole;
  /** 具体版式 ID */
  layout: LayoutId;
  /** 版式所需属性 */
  props: Record<string, unknown>;
}

/** Agent 生成的原始幻灯片（可只含角色，由 composer 补全版式） */
export interface RawSlide {
  /** 页面角色 */
  role: SlideRole;
  /** 可选的具体版式 ID；留空由 composer 自动选择 */
  layout?: LayoutId;
  /** 版式所需属性 */
  props: Record<string, unknown>;
}

/** Agent 生成的原始 DeckGoal */
export interface RawDeckGoal extends Omit<DeckGoal, 'slides'> {
  slides: RawSlide[];
}

/** 媒体槽位描述（供 Agent 选页与填充使用） */
export interface MediaSlot {
  /** 槽位名称 */
  name: string;
  /** 对应 props 路径 */
  fieldPath: string;
  /** 是否允许预设媒体 */
  canPresetMedia: boolean;
  /** 当前是否已填充 */
  filled?: boolean;
}

/** 属性字段类型 */
export type PropsFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'slider'
  | 'boolean'
  | 'select'
  | 'image'
  | 'color'
  | 'array'
  | 'object';

/** 属性字段定义，用于编辑器属性面板按版式精确渲染控件 */
export interface PropsField {
  /** 字段路径，支持点号嵌套，如 items.0.title */
  key: string;
  /** 显示标签 */
  label: string;
  /** 控件类型 */
  type: PropsFieldType;
  /** 选项，仅 type === 'select' 时有效 */
  options?: { value: string; label: string }[];
  /** 默认值 */
  defaultValue?: unknown;
  /** 最小值，仅 type === 'number' | 'slider' 时有效 */
  min?: number;
  /** 最大值，仅 type === 'number' | 'slider' 时有效 */
  max?: number;
  /** 是否支持在画布上直接编辑（如简单文本） */
  inlineEditable?: boolean;
  /** 字段分组名，用于在属性面板中折叠展示 */
  group?: string;
  /** 数组项的字段定义，仅 type === 'array' 时有效 */
  itemSchema?: PropsField[];
  /** 数组最小条目数，仅 type === 'array' 时有效 */
  minItems?: number;
  /** 数组最大条目数，仅 type === 'array' 时有效 */
  maxItems?: number;
  /** 可见性条件，依赖另一个布尔字段的值 */
  visibleWhen?: { key: string; value: boolean };
}

/** 版式 Props Schema，描述该版式可编辑的内容字段 */
export interface PropsSchema {
  /** 字段列表 */
  fields: PropsField[];
}

/**
 * 版式 Prop Contract。
 * - defaultProps：由 controls 中 defaultValue 聚合而来的默认值对象。
 * - controls：编辑器控件列表，与 PropsSchema.fields 一致。
 */
export interface LayoutContract {
  /** 默认属性 */
  defaultProps: Record<string, unknown>;
  /** 编辑器控件 */
  controls: PropsField[];
}

/** 版式元数据 */
export interface LayoutMeta {
  /** 版式唯一 ID */
  id: LayoutId;
  /** 所属主题 */
  theme: ThemeId;
  /** 页面角色 */
  role: SlideRole;
  /** 显示名称 */
  displayName: string;
  /** 描述 */
  description?: string;
  /** 是否需要媒体 */
  needsMedia: boolean;
  /** 媒体槽位 */
  mediaSlots?: MediaSlot[];
  /** 语义标签，供 Agent 选页使用，如 ['hero', 'data-heavy'] */
  tags?: string[];
  /** 内容形状描述，如 'single-stat', '3-column-cards' */
  contentShape?: string;
}

/** 整个 PPT 目标 */
export interface DeckGoal {
  /** 汇报标题 */
  title: string;
  /** 汇报目标 */
  goal: string;
  /** 受众 */
  audience: string;
  /** 汇报人/团队 */
  owner?: string;
  /** 主题，由生成阶段根据 prompt 关键词决定，编辑器内不可切换 */
  theme: ThemeId;
  /** 外观模式：浅色 / 深色 / 主题 02 双配色方案 / 主题 04 糖果色调 / 主题 05 光谱强调色 / 主题 08 黑金 */
  colorScheme?: 'light' | 'dark' | 'scheme-a' | 'scheme-b' | 'green' | 'yellow' | 'blue' | 'pink' | 'coral' | 'amber' | 'teal' | 'indigo' | 'violet' | 'volt' | 'magma' | 'nebula' | 'nova' | 'obsidian-gold' | 'ink-editorial';
  /** 深浅外观模式（theme03 专用；theme08 / theme09 使用 primary/muted） */
  appearance?: 'light' | 'dark' | 'primary' | 'muted';
  /** 语言 */
  language?: 'zh' | 'en';
  /** 页数 */
  pageCount: number;
  /** 随机种子，保证选页可复现 */
  randomSeed?: string;
  /** 幻灯片列表 */
  slides: Slide[];
}

/** 渲染产物 */
export interface RenderOutput {
  /** HTML 字符串 */
  html: string;
  /** 依赖资源列表 */
  assets: string[];
}

/**
 * 单页编辑器所需数据。
 * 由服务端根据 goal 生成后注入 editor.html，主题切换时也可通过 API 重新获取。
 */
export interface EditorData {
  /** 当前 goal */
  goal: DeckGoal;
  /** 主题 ID */
  theme: string;
  /** 当前配色方案 */
  colorScheme: string;
  /** 当前外观模式 */
  appearance?: string;
  /** 画布 slides 的完整 HTML（包含 lp-deck 容器） */
  slidesMarkup: string;
  /** 每页独立 HTML，用于缩略图渲染 */
  slideHtmls: string[];
  /** 主题 CSS 变量 */
  themeCssVars: string;
  /** 编辑器顶部栏 HTML */
  editorBarMarkup: string;
  /** 左侧缩略图面板 HTML */
  leftPanelMarkup: string;
  /** 右侧属性面板 HTML */
  rightPanelMarkup: string;
  /** 添加幻灯片弹窗 HTML */
  addSlideModalMarkup: string;
  /** 编辑器交互脚本 HTML（包含 window.__lemonPPT_goal） */
  editorScriptMarkup: string;
}
