# theme04 玻璃糖果风主题实施计划

> 基于 `docs/analysis/dashi-theme04-analysis.md` 与 `docs/analysis/theme04-all/` 的研究结论，结合 lemonPPT 现有主题架构制定本计划。
> 设计红线：不复制 Dashi theme04 的色值、类名、slot 结构与运行时代码；仅借鉴「多色切换 / 关键词高亮 / 杂志化排版 / 玻璃拟态」等设计思路，使用原创 Token 与组件实现。

---

## 一、目标与范围

### 1.1 主题定位
- **中文名**：玻璃糖果风
- **英文名**：Glass Candy / Editorial Pop
- **适用场景**：年轻化品牌、消费产品、创意提案、社媒感内容
- **核心视觉**：深色玻璃底 + 糖果色胶囊高光、圆润卡片、杂志化排版、关键词高亮

### 1.2 实施范围（已演进）

- **MVP 阶段已完成 8 个通用版式**（见 1.3）。
- **当前已扩展至 75 个版式**，覆盖 cover、chapter、content、metric、chart、quote、image、closing 以及 editorial、triptych、gantt、radar、heatmap、cards、gauges、treemap、scatter、waterfall、layers、riskchain、metro 等全场景组件。
- **已支持 4 套糖果色调切换**（green / yellow / blue / pink），通过 `goal.colorScheme` 与编辑器按钮切换。
- **已支持 light / dark 双外观模式**，通过 `goal.appearance` 与编辑器按钮切换。
- Dashi PPT 的 74 个 slot 已全覆盖；剩余为可选增强项，可视需求继续扩展。

完整版式清单见：[docs/analysis/theme04-missing-layouts.md](docs/analysis/theme04-missing-layouts.md)。

### 1.3 首批 8 个版式（已完成）

| 版式 ID | role | 用途 | 参考 Dashi slot | 状态 |
|---|---|---|---|---|
| `theme04_cover_v1` | `cover` | 居中主题封面，标题含胶囊高亮，底部 3 个数据胶囊 | `page001` coverHero | ✅ |
| `theme04_chapter_v1` | `content` | 章节过渡页，大号章节号 + 标题 + 装饰星芒 | `page008` section | ✅ |
| `theme04_content_v1` | `content` | 胶囊高亮内容页，左文右要点 | `page007` method | ✅ |
| `theme04_metric_v1` | `metric` | 大数字指标页，主数值 + 辅助指标网格 | `page029` bignumber | ✅ |
| `theme04_chart_v1` | `chart` | 柱状/折线图表页，可选右侧重点强调面板 | `page017` charts | ✅ |
| `theme04_quote_v1` | `quote` | 金句引用页，左侧引号装饰 + 人物信息 | `page071` manifesto | ✅ |
| `theme04_image_v1` | `image` | 图文焦点页，半幅图片 + 文字叠加 | `page058` spotlight | ✅ |
| `theme04_closing_v1` | `closing` | 核心结论/结尾页，CTA 按钮样式 | `page074` statement | ✅ |

### 1.4 已扩展完成的 67 个版式（总计 75）

除首批 8 个版式外，后续通过 Phase 1/2/3/4 补齐了 67 个版式。完整清单见 `packages/templates/src/themes/theme04/`，核心新增包括：

| 批次 | 代表版式 | 对应 Dashi slot |
|---|---|---|
| Phase 1 | `cover_ghost_v1`、`cover_bento_v1`、`cover_magazine_v1`、`chapter_split_v1`、`chapter_numbered_v1`、`cards_v1`、`gauges_v1`、`delta_v1`、`versus_v1`、`trio_v1`、`polaroid_v1`、`verdict_v1` | page003 / page004 / page044 / page061 / page069 / page009 / page020 / page031 / page033 / page046 / page060 / page072 |
| Phase 2 | `treemap_v1`、`scatter_v1`、`slope_v1`、`scoreboard_v1`、`scorecards_v1`、`matrix_v1`、`waterfall_v1`、`groupbars_v1`、`layers_v1`、`region_v1`、`valuechart_v1`、`filmstrip_v1` | page013 / page011 / page012 / page026 / page032 / page028 / page014 / page015 / page037 / page040 / page052 / page042 |
| Phase 3 | `annotated_v1`、`voices_v1`、`diptych_v1`、`riskchain_v1`、`metro_v1`、`dumbbell_v1`、`pyramid_v1`、`imagestory_v1`、`showcase_v1` | page056 / page070 / page063 / page064 / page067 / page053 / page054 / page057 / page059 |
| Phase 4 | `cover_hero_v1`、`monthchart_v1`、`stacked_v1`、`calendar_v1`、`quartertable_v1`、`spread_v1`、`chaintable_v1`、`chainflow_v1`、`ledger_v1` | page055 / page018 / page019 / page022 / page023 / page025 / page038 / page039 / page027 |

> 注：全部 75 个版式已完成注册、PPTX 导出、示例数据、角色候选映射与快照生成。

---

## 二、当前状态分析

### 2.1 现有主题架构
lemonPPT 已形成稳定的三层主题扩展模式：

1. **Token 层**：`packages/themes/src/<theme>/tokens.ts` 定义颜色、字体、间距、圆角、动效。
2. **样式层**：`packages/themes/src/<theme>/styles.css` 提供基础幻灯片样式与组件类。
3. **组件层**：`packages/templates/src/themes/<theme>/` 存放 TSX 版式组件，并在 `packages/templates/src/registry.tsx` 注册。
4. **渲染层**：`packages/renderer/src/render.tsx` 注入主题 CSS 变量；`packages/renderer/src/export-pptx.ts` 实现 PPTX 导出。
5. **脚本层**：`scripts/gallery.mjs`、`scripts/render-editor.mjs` 生成画廊与编辑器；`scripts/lib/sample-props.mjs` 提供示例数据。
6. **编排层**：`packages/composer/src/index.ts` 维护角色到候选版式的映射。

### 2.2 需要新增的文件

| 文件路径 | 说明 |
|---|---|
| `packages/themes/src/theme04/tokens.ts` | 原创 Token，含 light/dark 两套变量生成函数 |
| `packages/themes/src/theme04/styles.css` | 玻璃糖果风基础样式与 8 个版式样式 |
| `packages/templates/src/themes/theme04/*.tsx` | 8 个版式组件 + meta + schema |
| `examples/theme04-goal.json` | 8 页示例 goal，用于编辑器与导出测试 |

### 2.3 需要修改的文件

| 文件路径 | 修改点 |
|---|---|
| `packages/themes/src/index.ts` | 导入并导出 theme04Tokens；`themes` 数组加入 theme04 |
| `packages/templates/src/index.ts` | 导出 theme04 版式组件与 Token |
| `packages/templates/src/registry.tsx` | import 并 `registerLayout` 8 个 theme04 版式 |
| `packages/renderer/src/render.tsx` | CSS 变量分支加入 theme04；appearance 默认逻辑加入 theme04 |
| `packages/renderer/src/export-pptx.ts` | `THEME_CONFIGS` 增加 theme04；增加 8 个 PPTX 渲染函数并注册 |
| `scripts/gallery.mjs` | `THEMES` 加入 `'theme04'`；theme04 CSS 变量分支 |
| `scripts/render-editor.mjs` | 主题 CSS 复制列表加入 `'theme04'` |
| `scripts/lib/sample-props.mjs` | 为 8 个 theme04 版式提供示例数据 |
| `packages/composer/src/index.ts` | `ROLE_LAYOUT_CANDIDATES` 为相关角色加入 theme04 候选版式 |
| `apps/server/src/public/create.html` | 主题下拉框加入 `theme04` 选项 |

---

## 三、详细实现方案

### 3.1 Token 设计（`packages/themes/src/theme04/tokens.ts`）

#### 3.1.1 原创糖果色板
- **主强调色（糖果绿）**：`#3ADE80`
- **辅助强调色（糖果粉）**：`#FF6B9D`
- **冷强调色（糖果蓝）**：`#4ECDC4`
- **图表序列**：`[#3ADE80, #FF6B9D, #4ECDC4, #FFD166, #A78BFA, #FF8A5B]`
- **深色背景**：`#0A0A0A`，表面 `rgba(255,255,255,0.06)`
- **浅色背景（纸面）**：`#FAFAF8`，表面 `rgba(0,0,0,0.04)`，文字 `#1A1A1A`

#### 3.1.2 Token 结构
参考 `theme03/tokens.ts`，定义 `Theme04Tokens` 接口与 `theme04Tokens` 常量，并提供：

```ts
export function generateTheme04CssVariables(appearance: 'light' | 'dark' = 'dark'): string;
export function generateTheme04CssVariablesWithAppearance(): string;
```

生成的 CSS 变量统一使用 `--lp-*` 前缀，例如：
- `--lp-bg`
- `--lp-surface`
- `--lp-surface-strong`
- `--lp-ink`
- `--lp-ink2`
- `--lp-ink3`
- `--lp-accent`
- `--lp-accent-2`
- `--lp-accent-cool`
- `--lp-glow-accent`
- `--lp-radius-small / medium / large`（糖果风使用大圆角：12px / 20px / 999px）
- `--lp-font`、`--lp-font-mono`

`generateTheme04CssVariablesWithAppearance()` 输出：

```css
:root { /* dark */ }
:root[data-appearance="light"] { /* light */ }
```

### 3.2 样式文件（`packages/themes/src/theme04/styles.css`）

#### 3.2.1 基础规则
- `.lp-slide`：1280×720，深色/浅色渐变背景，使用 `var(--lp-bg)` 与糖果色弥散光晕；字体 `var(--lp-font)`。
- 切换动画复用现有 `.lp-slide-wrapper` 规则，保持默认 `data-lp-transition="none"`。
- `.lp-rise`：统一的淡入上移动画。

#### 3.2.2 主题通用类
- `.lp-theme04-tag`：等宽小标签，糖果绿背景，深色文字，圆角小。
- `.lp-theme04-pill`：胶囊高亮，用于标题中的关键词；支持玻璃态与实色两种变体。
- `.lp-theme04-card`：玻璃拟态卡片，`background: var(--lp-surface)`，`backdrop-filter: blur(20px)`，白色细边框，大圆角，柔和阴影。
- `.lp-theme04-footer`：页脚双栏，左侧页码/来源，右侧装饰星芒或 logo 区。
- `.lp-theme04-kicker`：顶部大写英文装饰文字 + 中文小标签。

#### 3.2.3 各版式样式
为 8 个版式分别定义类名：

| 版式 | 主要 CSS 类 |
|---|---|
| `cover_v1` | `.lp-theme04-cover`、`lp-theme04-cover-hero`、`lp-theme04-cover-metrics` |
| `chapter_v1` | `.lp-theme04-chapter`、`lp-theme04-chapter-number`、`lp-theme04-chapter-title` |
| `content_v1` | `.lp-theme04-content`、`lp-theme04-content-body`、`lp-theme04-pill-list` |
| `metric_v1` | `.lp-theme04-metric`、`lp-theme04-metric-value`、`lp-theme04-metric-grid` |
| `chart_v1` | `.lp-theme04-chart`、`lp-theme04-chart-wrap`、`lp-theme04-insight` |
| `quote_v1` | `.lp-theme04-quote`、`lp-theme04-quote-mark`、`lp-theme04-quote-author` |
| `image_v1` | `.lp-theme04-image`、`lp-theme04-image-overlay`、`lp-theme04-image-caption` |
| `closing_v1` | `.lp-theme04-closing`、`lp-theme04-closing-cta` |

### 3.3 版式组件（`packages/templates/src/themes/theme04/`）

每个组件统一导出：

```ts
export interface Theme04XxxV1Props { ... }
export const theme04XxxV1Meta: LayoutMeta;
export const theme04XxxV1Schema: PropsSchema;
export function Theme04XxxV1(props: Theme04XxxV1Props): ReactNode;
```

#### 3.3.1 通用 props 约定
- `_slideIdx`、`_editable`：内部渲染用。
- `title`、`subtitle`、`kicker`、`footnoteLeft`、`footnoteRight` 等字段命名与现有主题保持一致。
- 所有非图表的文本/textarea 字段设置 `inlineEditable: true`，不在右侧边栏显示。
- 数组字段使用对象数组（如 `{ value, label }`），避免 `[object Object]` 问题。
- 图片上传使用 `LpEditableImage` 组件，固定区域显示占位符。

#### 3.3.2 各版式关键 props

**theme04_cover_v1**
```ts
{
  tag?: string;
  tagLabel?: string;
  title: string;          // 可含 {{胶囊高亮}}
  subtitle?: string;
  metrics?: Array<{ value: string; unit?: string; label: string; tone?: 'green'|'pink'|'blue'|'yellow' }>;
  footnoteLeft?: string;
  footnoteRight?: string;
}
```

**theme04_chapter_v1**
```ts
{
  number: string;
  title: string;
  subtitle?: string;
  tag?: string;
}
```

**theme04_content_v1**
```ts
{
  kicker?: string;
  title: string;
  highlight?: string;     // 标题中的胶囊高亮词
  items?: Array<{ title: string; description?: string }>;
}
```

**theme04_metric_v1**
```ts
{
  kicker?: string;
  title: string;
  value: string;
  unit?: string;
  label?: string;
  metrics?: Array<{ value: string; unit?: string; label: string; tone?: string }>;
}
```

**theme04_chart_v1**
```ts
{
  kicker?: string;
  title: string;
  type: 'bar' | 'line';
  labels: string[];
  data: number[];
  unit?: string;
  showInsight?: boolean;
  insight?: { value?: string; label?: string; description?: string };
}
```

**theme04_quote_v1**
```ts
{
  quote: string;
  author?: string;
  role?: string;
  image?: string;
  kicker?: string;
}
```

**theme04_image_v1**
```ts
{
  title: string;
  subtitle?: string;
  image?: string;
  caption?: string;
  kicker?: string;
}
```

**theme04_closing_v1**
```ts
{
  title: string;
  subtitle?: string;
  cta?: string;
  contact?: string;
}
```

### 3.4 渲染器接入

#### 3.4.1 `packages/renderer/src/render.tsx`
- 在 `colorScheme` 默认值分支中加入 `theme04`：默认 `'scheme-a'`（为将来多色调占位，当前不实际切换）。
- 在 `appearance` 默认值分支中加入 `theme04`：默认 `'dark'`。
- 在 `themeCssVars` 生成分支中加入 `theme04`：调用 `generateTheme04CssVariablesWithAppearance()`。

#### 3.4.2 `packages/renderer/src/export-pptx.ts`
- 在 `THEME_CONFIGS` 增加 `theme04`：
  - `colorsDark`：深色玻璃底，主文字白色，强调色 `3ADE80`。
  - `colorsLight`：浅色纸面，主文字深灰，强调色调整为稍深的绿色（如 `22A55C`）。
  - `chartColors`：糖果序列。
- 增加背景绘制辅助函数 `addTheme04Background`（深色/浅色渐变矩形）。
- 增加 8 个渲染函数并注册：
  - `renderTheme04CoverV1`
  - `renderTheme04ChapterV1`
  - `renderTheme04ContentV1`
  - `renderTheme04MetricV1`
  - `renderTheme04ChartV1`
  - `renderTheme04QuoteV1`
  - `renderTheme04ImageV1`
  - `renderTheme04ClosingV1`

### 3.5 脚本与示例

#### 3.5.1 `scripts/lib/sample-props.mjs`
为 8 个 theme04 版式返回贴合玻璃糖果风的示例数据，例如：
- `theme04_cover_v1`：标题「资本，正在 {{重新分配}}」，底部 3 个糖果色胶囊指标。
- `theme04_chart_v1`：季度数据 + 重点强调面板。

#### 3.5.2 `scripts/gallery.mjs`
- `THEMES` 数组改为 `['theme01', 'theme02', 'theme03', 'theme04']`。
- CSS 变量分支加入 theme04，默认 appearance `dark`。

#### 3.5.3 `scripts/render-editor.mjs`
- 主题 CSS 复制循环改为 `['theme01', 'theme02', 'theme03', 'theme04']`。

#### 3.5.4 `examples/theme04-goal.json`
创建 8 页示例 deck：

```json
{
  "title": "theme04 MVP 预览",
  "goal": "玻璃糖果风 · 8 个通用版式预览",
  "audience": "品牌团队、设计师",
  "theme": "theme04",
  "language": "zh",
  "slides": [
    { "role": "cover", "layout": "theme04_cover_v1", "props": { ... } },
    { "role": "content", "layout": "theme04_chapter_v1", "props": { ... } },
    { "role": "content", "layout": "theme04_content_v1", "props": { ... } },
    { "role": "metric", "layout": "theme04_metric_v1", "props": { ... } },
    { "role": "chart", "layout": "theme04_chart_v1", "props": { ... } },
    { "role": "quote", "layout": "theme04_quote_v1", "props": { ... } },
    { "role": "image", "layout": "theme04_image_v1", "props": { ... } },
    { "role": "closing", "layout": "theme04_closing_v1", "props": { ... } }
  ]
}
```

### 3.6 编排层与前端入口

#### 3.6.1 `packages/composer/src/index.ts`
在 `ROLE_LAYOUT_CANDIDATES` 中给对应角色追加 theme04 候选：

```ts
cover: [..., 'theme04_cover_v1'],
metric: [..., 'theme04_metric_v1'],
chart: [..., 'theme04_chart_v1'],
quote: [..., 'theme04_quote_v1'],
content: [..., 'theme04_chapter_v1', 'theme04_content_v1'],
image: [..., 'theme04_image_v1'],
closing: [..., 'theme04_closing_v1'],
```

#### 3.6.2 `apps/server/src/public/create.html`
主题选择下拉框追加 `<option value="theme04">Theme 04（玻璃糖果风）</option>`。

---

## 四、依赖与限制

### 4.1 不依赖 base 主题
- theme04 必须是完整独立主题，不依赖已标记移除的 `base` 主题。
- 所有 75 个版式在 `registry.tsx` 中注册为 `theme: 'theme04'`。

### 4.2 与编辑器约束兼容
- 非图表组件的文本字段全部 `inlineEditable: true`；不在右侧边栏显示文本/textarea。
- 图表组件的 `showInsight` 开关使用 `visibleWhen` 控制相关字段显隐。
- 数组字段使用对象数组，删除按钮阻止冒泡。

### 4.3 动画与切换
- 默认切换效果保持 `data-lp-transition="none"`、80ms opacity fade。
- 版式内部动画统一使用 `.lp-rise` 类。

---

## 五、验证步骤

1. **类型检查**：`corepack pnpm -r typecheck` 或 `npx pnpm -r typecheck` 全 workspace 通过。
2. **构建**：`corepack pnpm -r build` 成功，无新增编译错误。
3. **画廊生成**：`node scripts/gallery.mjs`，确认 `output/gallery/theme04/index.html` 包含当前全部 theme04 版式且渲染正常。
4. **编辑器预览**：`node scripts/render-editor.mjs examples/theme04-goal.json output/theme04-editor.html`，浏览器打开后：
   - 所有示例页可正常切换；
   - 文字可双击编辑；
   - light/dark 与 green/yellow/blue/pink 切换按钮生效；
   - 图表正常初始化无空白。
5. **PPTX 导出**：使用编辑器或脚本导出 theme04 的 PPTX，检查所有示例页内容与颜色。
6. **CLI / Server**：
   - `node packages/cli/dist/index.js ... --theme theme04` 可渲染；
   - `apps/server` 创建页可选择 theme04 并生成 goal。

---

## 六、风险与回退

- **风险**：新增 8 个 PPTX 渲染函数可能增加 `export-pptx.ts` 长度与维护成本。
  - **缓解**：先实现最小可行版本，只覆盖文字、形状、图片与简单图表；复杂图表可先渲染为占位文本，后续迭代。
- **风险**：light 模式糖果绿在浅色纸面上对比度不足。
  - **缓解**：Token 中 light 模式使用加深后的强调色（如 `#22A55C`），并预留对比度检查。
- **风险**：`apps/server` 的测试对 `theme01.css` 有断言。
  - **缓解**：仅追加主题选项，不修改默认 theme01 行为，现有测试应保持通过。

---

## 七、后续可扩展项

1. ✅ ~~增加 yellow / blue / pink 三套强调色切换~~（已完成）。
2. ✅ ~~扩展至 20+ 版式，覆盖 bento、quadrant、timeline、roadmap 等~~（当前已达 75 个版式，bento/quadrant/timeline/roadmap 已实现）。
3. ✅ ~~继续扩展至 45+ 版式~~（当前已达 75 个版式，Dashi theme04 全部 74 个 slot 已覆盖，含 1 个额外扩展版式）。
4. ✅ ~~更新 theme04 编辑器示例页~~（已完成）：`examples/theme04-goal.json` 已包含全部 75 个版式，`output/theme04-editor.html` 已重新生成。
5. 增加动态背景（gooey / moving 等）的静态渐变替代方案。
6. 为 theme04 增加独立的 snapshot 回归测试脚本，定期生成全量版式截图用于视觉回归。

### 已完成的版式补齐阶段

| 阶段 | 目标 | 状态 |
|---|---|---|
| Phase 1 | 12 个高复用基础版式 | ✅ 已完成 |
| Phase 2 | 15 个数据可视化版式 | ✅ 已完成 |
| Phase 3 | 9 个创意排版与策略版式 | ✅ 已完成 |
| Phase 4 | 9 个低优先级/剩余版式 | ✅ 已完成 |

### 本次补齐版式（Phase 4）

| 建议版式 ID | role | 参考 Dashi slot | 状态 |
|---|---|---|---|
| `theme04_cover_hero_v1` | `cover` | page055 hero | ✅ 已完成 |
| `theme04_monthchart_v1` | `chart` | page018 monthchart | ✅ 已完成 |
| `theme04_stacked_v1` | `chart` | page019 stacked | ✅ 已完成 |
| `theme04_calendar_v1` | `chart` | page022 calendar | ✅ 已完成 |
| `theme04_quartertable_v1` | `table` | page023 quartertable | ✅ 已完成 |
| `theme04_spread_v1` | `chart` | page025 spread | ✅ 已完成 |
| `theme04_chaintable_v1` | `table` | page038 chaintable | ✅ 已完成 |
| `theme04_chainflow_v1` | `process` | page039 chainflow | ✅ 已完成 |
| `theme04_ledger_v1` | `table` | page027 ledger | ✅ 已完成 |

> Dashi theme04 的 74 个 slot 已全部覆盖；后续扩展为可选增强，不再作为必补项。
