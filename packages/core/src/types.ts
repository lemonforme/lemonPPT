/**
 * lemonPPT 核心类型定义
 * 描述 Agent 工作流与渲染引擎之间的 JSON 协议
 */

/** 页面角色，用于 Agent 选页阶段 */
export type SlideRole =
  | 'cover'
  | 'tableOfContents'
  | 'metric'
  | 'chart'
  | 'comparison'
  | 'process'
  | 'quote'
  | 'content'
  | 'image'
  | 'analysis'
  | 'closing';

/** 版式标识，例如 cover_v1、metric_v2 */
export type LayoutId = string;

/** 主题标识 */
export type ThemeId = string;

/** 单页幻灯片 */
export interface Slide {
  /** 具体版式 ID */
  layout: LayoutId;
  /** 版式所需属性 */
  props: Record<string, unknown>;
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
  /** 主题 */
  theme: ThemeId;
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
