<!-- lemonPPT - AI-powered presentation generation -->
<!-- Copyright (c) 2026 lemonforme -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

# lemonPPT 主题架构演进方案

> 本文档替代已合并的 `theme-strategy.md` 与 `theme-production-guide.md`。
> 目标：明确 lemonPPT 主题系统从当前"共享版式 + 主题 CSS"到未来可选的"每主题独立组件"的演进路径，同时给出可执行的主题生产工业化流程。
> 协议：AGPL-3.0-or-later

---

## 一、背景与目标

### 1.1 当前状态（2026-07-22 更新）

主题系统已收敛为 **用户侧仅暴露 `theme01` 单一主题**，`base`、`dark-tech`、`warm-business` 等旧主题已完全移除：

- **用户侧统一主题**：`theme01`（浅色玻璃质感），每个页面角色均已注册 `theme01` 专属版式，视觉完全统一。
- **已移除主题**：`base` 通用版式池、`dark-tech`（深色科技）与 `warm-business`（暖色商务）已从代码、示例、文档和输出产物中清理。
- **版式索引**：`(role, theme)` 二维索引保留，所有版式的 `meta.theme` 均为具体主题 ID（当前全部为 `theme01`）；新增主题时继续沿用该机制为每个角色注册专属版式。
- **PPTX 导出**：`packages/renderer/src/export-pptx.ts` 仅保留 theme01 专属 `layoutId` 的渲染器注册。

历史状态：MVP 阶段曾采用 `base` / `dark-tech` / `warm-business` 共享版式 + 主题 CSS 方案，并验证了生成 → 预览 → 导出全链路。后续为了让 theme01 成为真正统一的主题、避免 base 组件与 theme01 CSS 混用导致视觉不一致，已先补齐全部角色的 theme01 专属版式，再彻底删除 `base` 主题及通用版式池。

### 1.2 长期目标

参考 Dashi PPT 的 12 套主题 × 70~110 页独立组件模式，lemonPPT 希望在未来具备：

1. **更高的视觉上限**：不同主题可以有截然不同的排版、动效、装饰元素。
2. **更强的品牌差异化**：支持付费主题、高端定制、社区投稿。
3. **更灵活的 AI 生成空间**：AI 根据主题风格自动选择配色、图片、排版密度。

但 **不复制 Dashi 的具体代码、CSS、配色组合、设计资产或 Unicorn 场景 JSON**，以避免许可证污染与侵权风险。

---

## 二、术语定义

| 术语 | 含义 |
|---|---|
| **Role（页面角色）** | 页面在 deck 中承担的信息角色，如 `cover`、`metric`、`timeline`、`comparison`。 |
| **Layout（版式）** | 一个具体的 React 组件实现，对应一个 `role` 的一种视觉变体，如 `cover_v1`、`metric_v2`。 |
| **Theme（主题）** | 一套完整的设计系统，包括颜色、字体、间距、圆角、阴影、动效风格。 |
| **共享版式** | 一个版式组件通过 CSS 变量适配多个主题。 |
| **主题专属变体** | 仅对特定主题生效的独立版式组件。 |
| **全量独立组件模式** | 每个主题拥有自己完整的版式组件集合，同 `role` 在不同主题下可以有不同的 DOM 结构与布局。 |

---

## 三、三种架构模式对比

### 3.1 模式 A：共享版式 + 主题 CSS（当前）

```
packages/templates/src/base/
  ├── cover-v1.tsx      # 共享组件
  ├── metric-v1.tsx
  └── ...
packages/themes/src/
  ├── base/styles.css
  ├── dark-tech/styles.css
  └── warm-business/styles.css
```

**优点**：
- 维护成本低：新增一个版式只需写一次组件 + 一套 CSS。
- PPTX 映射简单：每个 `layoutId` 对应一个导出函数。
- 适合 MVP 和快速迭代。

**缺点**：
- 视觉上限受限：不同主题只能用同一 DOM 结构换色。
- 容易出现 CSS 覆盖战争：某主题为了突破共享结构会写大量 hack。

### 3.2 模式 B：每主题独立组件（Dashi 模式）

```
packages/templates/src/
  ├── base/
  │   ├── cover-v1.tsx
  │   └── ...
  ├── dark-tech/
  │   ├── cover-v1.tsx  # 独立实现
  │   └── ...
  └── warm-business/
      ├── cover-v1.tsx  # 独立实现
      └── ...
```

**优点**：
- 视觉上限最高：每个主题可以完全重新设计每个页面。
- 无 CSS 覆盖战争：组件与主题强绑定。
- 品牌差异化最强。

**缺点**：
- 组件数量爆炸：39 版式 × N 主题 = 39N 个组件。
- 维护成本极高：同一 bug 可能要在多处修复。
- PPTX 映射复杂：需要按 `(role, theme)` 查找映射。
- AI 训练成本高：每个主题的可用版式、最佳实践都要单独维护。
- 设计资产要求高：每个主题都需要完整的设计稿。

### 3.3 模式 C：混合架构（推荐演进路径）

```
packages/templates/src/
  └── themes/
      ├── theme01/
      │   ├── cover-v1.tsx   # theme01 专属版式
      │   └── ...
      └── neon/              # 未来新增主题（示例）
          └── cover-v1.tsx   # 主题专属变体
```

**核心机制**：注册表按 `(role, theme)` 二维索引；当前所有版式均为具体主题专属，不再保留通用共享版式兜底。新增主题时需为该主题下的每个角色注册专属版式。

**优点**：
- 视觉上限高：每个主题的每个页面都可以独立设计。
- 无 CSS 覆盖战争：组件与主题强绑定。
- 新增主题不会污染现有主题。

---

## 四、推荐路径：混合架构 → 全量独立组件

### 4.1 为什么选这条路径

1. **符合当前阶段**：项目处于版式扩展与 Agent 体验稳定期，不应过早投入大量主题组件。
2. **保留未来空间**：只要抽象层设计对，后期可以逐步用主题专属变体替换共享版式。
3. **成本可控**：前期只维护共享版式，中期对重点主题做少量变体，后期再决定是否全量独立。

### 4.2 关键抽象层：`(role, theme)` 二维索引 + layoutId 兼容

这是混合架构能否平滑演进的关键。注册表在保留 `layoutId` 索引（向后兼容、支持同一角色多个变体）的同时，新增按 `(role, theme)` 解析的能力。

```ts
// packages/templates/src/registry.ts
const registryById = new Map<string, RegisteredLayout<Record<string, unknown>>>();
const registryByRoleTheme = new Map<string, Map<string, RegisteredLayout<any>>>();

export function registerLayout<P extends Record<string, unknown>>(
  layout: RegisteredLayout<P>
): void {
  // 同时写入 layoutId 索引与 (role, theme) 索引
  registryById.set(layout.meta.id, layout as RegisteredLayout<Record<string, unknown>>);

  const role = layout.meta.role;
  const theme = layout.meta.theme;
  if (!registryByRoleTheme.has(role)) {
    registryByRoleTheme.set(role, new Map());
  }
  registryByRoleTheme.get(role)!.set(theme, layout as RegisteredLayout<any>);
}

export function getLayout(id: string): RegisteredLayout<any> | undefined {
  return registryById.get(id);
}

export function resolveLayout(role: string, theme?: string): RegisteredLayout<any> | undefined {
  const byTheme = registryByRoleTheme.get(role);
  if (!byTheme || !theme) return undefined;
  return byTheme.get(theme);
}
```

使用方式：

```ts
// theme01 专属版式：meta.theme 为具体主题 ID
registerLayout({ meta: coverV1Theme01Meta, component: CoverV1Theme01 });

// 未来新增主题专属变体：独立 layoutId，role 相同、theme 为具体主题
registerLayout({ meta: coverV1NeonMeta, component: CoverV1Neon });

// 解析时精确按 (role, theme) 查找
const layout = resolveLayout('cover', goal.theme);
```

### 4.3 PPTX 导出映射也要 theme-aware

PPTX 导出在保留 `layoutId` 映射（保证同一角色下不同变体仍按各自逻辑渲染）的同时，新增按 `(role, theme)` 的主题专属覆盖能力。

```ts
// packages/renderer/src/export-pptx.ts
const pptxRenderersByLayout = new Map<string, RenderFn>();
const pptxRenderersByRoleTheme = new Map<string, Map<string, RenderFn>>();

export function registerPptxLayoutRenderer(layoutId: string, renderFn: RenderFn): void {
  pptxRenderersByLayout.set(layoutId, renderFn);
}

export function registerPptxRoleRenderer(
  role: string,
  theme: string,
  renderFn: RenderFn
): void {
  if (!pptxRenderersByRoleTheme.has(role)) {
    pptxRenderersByRoleTheme.set(role, new Map());
  }
  pptxRenderersByRoleTheme.get(role)!.set(theme, renderFn);
}

export function resolvePptxRenderer(slide: Slide, theme?: string): RenderFn | undefined {
  // 1. 优先主题专属覆盖
  if (theme) {
    const exact = pptxRenderersByRoleTheme.get(slide.role)?.get(theme);
    if (exact) return exact;
  }
  // 2. 否则按具体 layoutId 回退
  return pptxRenderersByLayout.get(slide.layout);
}
```

### 4.4 主题包独立化

中期建议把每个主题拆成独立 npm 包：

```
packages/
  ├── themes-base/
  ├── themes-dark-tech/
  ├── themes-warm-business/
  └── themes-neon/           # 新增主题
```

或按主题组织版式：

```
packages/
  ├── themes/                # token + 共享样式
  └── templates/
      ├── base/              # 共享版式
      └── themes/
          ├── dark-tech/     # 主题专属版式
          └── warm-business/
```

独立包的好处：
- 避免单个包体积膨胀。
- 主题可以独立版本化、独立发布。
- 第三方主题可以按相同接口接入。

---

## 五、主题生产工业化流程

无论采用哪种架构，新增一套高质量原创主题都需要以下流程。

### 5.1 Step 1：主题定位（1~2 天）

回答：
- 目标用户是谁？
- 使用场景是什么？
- 视觉关键词？（极简、科技、商务、活泼、复古、高级）
- 主色倾向？

产出物：一句话风格定义 + 3~5 张参考图（只看方向，不抄具体设计）。

### 5.2 Step 2：Figma 设计系统（3~5 天）

建立：
- 颜色板：主色、辅助色、背景色、文字色、强调色。
- 字体系统：标题字体、正文字体、等宽字体、字号阶梯。
- 间距系统：页边距、栅格、元素间距。
- 组件原子：按钮、标签、卡片、分隔线、图表样式。
- 效果：圆角、阴影、透明度、渐变。

产出物：一份 Figma Design System 文件。

### 5.3 Step 3：核心页面模板设计（5~10 天）

优先设计最高频的 8~12 个页面：

1. 封面
2. 目录
3. 章节页
4. 单栏内容
5. 双栏图文
6. 三列卡片
7. 大数字页
8. 时间轴
9. 引用/金句
10. 对比页
11. 数据图表
12. 封底

产出物：Figma 里 12 张高精度页面设计稿。

### 5.4 Step 4：转代码 Token（2~3 天）

```ts
// packages/themes/src/neon/tokens.ts
export const neonTokens = {
  id: 'neon',
  displayName: '霓虹科技',
  colors: {
    background: '#050505',
    surface: '#0a0a0a',
    primary: '#e5e7eb',
    secondary: '#94a3b8',
    accent: '#00f0ff',
    muted: '#1f2937',
    text: '#f3f4f6',
    textInverse: '#050505',
  },
  fonts: {
    heading: 'Orbitron, "Noto Sans SC", sans-serif',
    body: 'Inter, "Noto Sans SC", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  spacing: {
    pagePadding: '48px',
    sectionGap: '32px',
    elementGap: '16px',
  },
  borderRadius: {
    small: '6px',
    medium: '12px',
    large: '16px',
  },
} as const;
```

### 5.5 Step 5：实现版式组件（10~20 天）

**共享版式模式下**：
- 为现有共享组件补充新主题的 CSS 变量覆盖。
- 在 `packages/themes/src/neon/styles.css` 中定义 `--lp-*` 变量。

**主题专属变体模式下**：
- 在 `packages/templates/src/themes/neon/` 下实现独立组件。
- 注册为 `registerLayout(role, 'neon', ...)`。

### 5.6 Step 6：预览与迭代（持续）

- 使用 `scripts/gallery.mjs` 生成新版式 × 新主题的预览页。
- 可选引入 Storybook 做单组件预览（成本较高，P2 备选）。

### 5.7 Step 7：导出验证（3~5 天）

- 确保 HTML 渲染效果能正确映射到 PPTX/PDF。
- 检查字体、图片、定位问题。
- 验证 PPTX 映射按 `(role, theme)` 查找是否正确。

### 5.8 Step 8：商用质量检查

- [ ] 所有颜色对比度符合 WCAG 标准。
- [ ] 字体有商用授权（推荐 SIL OFL，如 Inter、思源黑体、JetBrains Mono、霞鹜文楷）。
- [ ] 图片/图标不是 Dashi 或任何 AGPL 项目来源（推荐 Lucide、Heroicons、Phosphor、CC0 图库）。
- [ ] 每页在 16:9 比例下显示正常。
- [ ] PPTX 导出后字体、颜色、图片位置正确。
- [ ] 有完整主题说明文档和示例 deck。

---

## 六、实施路线图

### 阶段 1：抽象层改造（已完成）

目标：让 registry 和 PPTX 导出支持 `(role, theme)` 二维索引，但**不改**现有共享版式。

任务：
1. 改造 `packages/templates/src/registry.tsx`：
   - 保留 `layoutId` 索引（`getLayout`）确保向后兼容。
   - 新增 `(role, theme)` 二维索引（`resolveLayout`、`listLayoutsByRoleAndTheme`）。
   - `renderSlide` 的 `options` 增加 `theme`，找不到 `layoutId` 时按 `(role, theme)` 回退。
   - 旧版式 `theme: 'base'` 与 `theme: '*'` 等价处理，无需批量修改 39 个文件。
2. 改造 `packages/renderer/src/export-pptx.ts`：
   - 保留按 `layoutId` 注册渲染器，保证同一角色不同变体差异不丢失。
   - 新增 `registerPptxRoleRenderer` 按 `(role, theme)` 注册主题专属覆盖。
   - `renderSlideToPptx` 优先查找主题专属渲染器，找不到则回退到 `layoutId` 渲染器。
3. 改造 `packages/composer/src/index.ts`：
   - `selectLayoutForRole` 增加 `theme` 参数。
   - 优先选择当前主题专属变体，否则在通用候选中随机选择。
4. 跑通全部测试与 gallery 预览。

### 阶段 2：共享版式扩展（已完成）

目标：版式数量从 39 扩展到 50+，覆盖更多高频场景。

进展：
- 已完成 11 个新版式：
  - `cover_v2`、`content_v4`、`stats_v2`、`image_v2`、`quote_v3`、`process_v3`、`feature_v3`、`gallery_v3`、`testimonial_v3`、`comparison_v3`、`timeline_v3`
- 同时验证 `team_v2` 已完整接入注册/导出链路
- 共享版式总数：39 → 50（已达成阶段 2 目标）
- 所有新版式均完成组件、三主题 CSS、PPTX 导出与单元测试。
- 修复 composer 测试以适配多候选随机选择。
- `corepack pnpm test` 92 个测试通过，`corepack pnpm -r typecheck` 全部通过，`node scripts/gallery.mjs` 50×3 主题预览生成成功。

### 阶段 3：主题专属变体验证（已完成）

目标：对 1~2 个重点主题做 3~5 个核心版式的独立变体，验证混合架构。

已完成 5 个变体：
- `dark-tech/cover-v1`：深色科技风封面，加入动态网格背景与霓虹标题。
- `dark-tech/feature-v1`：深色科技风特性页，霓虹边框卡片 + 科技网格背景。
- `dark-tech/metric-v1`：深色科技风关键数字页，霓虹发光超大数字。
- `warm-business/timeline-v1`：暖色商务风时间轴，改用横向卡片布局。
- `warm-business/testimonial-v1`：暖色商务风客户证言，暖色卡片 + 引用标记。

任务完成情况：
1. 在 `packages/templates/src/themes/<theme>/` 下实现变体。
2. 通过 `registerLayout` 注册到 `(role, theme)` 二维索引。
3. 在 `export-pptx.ts` 中补充对应的 PPTX 导出映射。
4. 用 `scripts/gallery.mjs` 做视觉回归对比，生成 50 / 50+3 / 50+2 预览。
5. 验证：`corepack pnpm test` 102 个测试全部通过，`corepack pnpm -r typecheck` 全部通过，`corepack pnpm -r build` 成功，gallery 生成成功。

### 阶段 4：主题包独立化（3~6 个月后）

目标：把主题拆成独立包，支持第三方主题接入。

任务：
1. 按主题拆分 npm 包（如 `@lemonppt/theme-neon`）。
2. 定义主题包接口规范（必须导出 tokens、styles、可选 layouts）。
3. CLI / 编辑器支持动态加载主题包。

### 阶段 5：全量独立组件（长期，资源允许时）

目标：每个主题拥有完整的独立版式组件集合。

前提：
- 版式数量已经稳定（50+ 且不再大幅变动）。
- 设计团队能支撑每个主题完整设计稿。
- 有视觉回归测试和自动化工具。

任务：
1. 为每个主题逐一套用独立组件替换共享版式。
2. 建立每主题的设计规范与 AI prompt 库。
3. 引入社区投稿主题机制。

---

## 七、风险与应对

| 风险 | 影响 | 应对 |
|---|---|---|
| 前期抽象层设计错误，后期迁移困难 | 高 | 阶段 1 务必把 `(role, theme)` 索引和 theme-aware 导出映射做对 |
| CSS 变量耦合过深 | 中 | 共享组件只依赖基础 token，不依赖具体变量语义 |
| 同一 role 不同变体结构差异大 | 中 | 定义统一的内容契约（输入字段、视觉区域） |
| 组件数量爆炸 | 高 | 只在资源允许时进入阶段 5，中途优先用混合架构 |
| 视觉回归成本 | 中 | 每个新版式/主题必须通过 `scripts/gallery.mjs` 预览 |
| 许可证风险 | 高 | 不复制 Dashi 代码、CSS、配色、字体组合、动态背景 |

---

## 八、相关文档

| 文档 | 说明 |
|---|---|
| [`docs/plans/project-plan.md`](project-plan.md) | 整体项目规划 |
| [`docs/plans/technical-plan.md`](technical-plan.md) | 技术架构与渲染流水线 |
| [`docs/plans/phase-4-scale-plan.md`](phase-4-scale-plan.md) | Phase 4 规模化建设规划 |
| [`docs/plans/phase-5-community-plan.md`](phase-5-community-plan.md) | Phase 5 社区开放规划 |
| [`docs/decisions/skill-distribution.md`](../decisions/skill-distribution.md) | Skill 分发架构决策 |
| [`docs/analysis/dashi-ppt-license-analysis.md`](../analysis/dashi-ppt-license-analysis.md) | Dashi PPT 协议分析 |
| [`docs/progress.md`](../progress.md) | 项目进度记录 |

---

## 九、变更记录

- **2026-07-20**：合并 `docs/plans/theme-strategy.md` 与 `docs/plans/theme-production-guide.md`，新增"混合架构 → 全量独立组件"演进路径与 `(role, theme)` 抽象层设计。
