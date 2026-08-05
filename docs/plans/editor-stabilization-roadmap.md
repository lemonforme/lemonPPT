# 编辑器稳定性与架构演进规划

> 基于 `docs/analysis/lemonPPT-preview-architecture-insights.md` 与当前项目实现对比制定。
> 目标：先把当前编辑器做稳，再逐步引入 Dashi 级局部渲染与 CSS 变量驱动。

## 一、现状

### 1.1 项目架构

- Monorepo：`core / templates / themes / renderer / view-model / server`
- 渲染：服务端 `ReactDOMServer.renderToStaticMarkup` 生成静态 HTML
- 编辑器：`packages/renderer/src/editor-script.ts` 操作 `window.__lemonPPT_goal`
- 局部刷新：`refreshCurrentSlide()` 替换 `.lp-slide-wrapper.active` 的 `innerHTML`
- 右侧面板：按 `PropsSchema` 动态生成表单控件（文本/数字/textarea/select/数组滑块）
- 主题 Token：`theme01Tokens` 是 TS 对象常量，组件内仍有大量硬编码样式

### 1.2 与 Dashi 的差距

| Dashi 机制 | lemonPPT 当前状态 |
|---|---|
| 同页 SPA，无 iframe | 已基本满足（editor 在同一页） |
| 按 slide 单独 `createRoot` + React reconcile | **未实现**：当前是 `innerHTML` 全量替换，会重建 DOM、重载图片/字体、可能重播动画 |
| CSS 变量驱动视觉 | **未实现**：Token 是 TS 常量，未形成 CSS 自定义属性系统 |
| `skipMotion` 区分切页/调参 | **未实现**：调参时可能重新触发动画 |
| `flushSync` 同步提交 | 部分同步，但不是 React reconcile 路径 |
| `controls` schema 自动生成面板 | 已实现 `PropsSchema` + 动态表单，方向一致 |

## 二、分阶段规划

### 阶段 1：当前架构下把编辑器做稳（1-2 周）

**目标**：在不重写渲染层的前提下，把 bug 修完、体验兜底。

- [x] **Schema 与组件一致性**
  - 继续用 `scripts/audit-schema-props.mjs` 确保 `theme01` 所有版式的 `itemSchema` 与组件真实字段对齐。
  - 修复子属性缺失、`type` 错误（如 `text` 误写为数组，或数组被误写为 `text`）的字段。

- [x] **数组交互收尾**
  - 滑块增删条目实时同步到画布。
  - 嵌套数组在右侧面板正确渲染与编辑。
  - 新增条目生成合理的默认示例数据（对象、嵌套数组均支持）。
  - 右侧数组项中不再显示 `1 – 4` 这类冗余刻度。

- [x] **避免整页刷新**
  - `refreshCurrentSlide` 仅作为无直接编辑元素字段的兜底。
  - 文本、数字、select 等字段优先走 `syncDomFromGoal` 的精准 DOM 更新。

- [x] **ECharts 状态保持**
  - 局部刷新时先 `dispose()` 旧实例再重建，避免内存泄漏。
  - 后续阶段再优化为仅更新数据。

**阶段 1 验证结果**：`scripts/test-editor-slider.mjs` 已覆盖 `metric-v2`、`table-of-contents-v1`、`process-v1`、`trend-v1`、`chart-v1` 等版式，确认滑块增删条目、嵌套数组编辑、图表类型切换与数据修改均实时生效，新增条目包含默认示例数据。

### 阶段 2：引入客户端 React 局部渲染（已完成）

**目标**：从 `innerHTML` 替换升级到 React 原地 reconcile。

- [x] **每页 slide 独立 React root**
  - 在 `client-render.ts` 中新增 `renderSlideToRoot(container, slide, options)`，使用 `ReactDOMClient.createRoot` + `root.render()`，并在容器上缓存 root 避免重复创建。
  - `editor-script.ts` 初始化时调用 `renderAllSlidesToRoot()`，为所有 `.lp-slide-wrapper` 预创建 React root 并渲染。
  - `selectSlide` 只负责更新 active class 与右侧面板，切页不再触发重新渲染。
  - `refreshCurrentSlide` / `renderSlideToRootByIndex` 支持对任意指定 slide 进行后台更新。
  - 文本/图片编辑事件改为事件委托，避免 React reconcile 后监听器丢失。

- [x] **按 slide 拆分状态**
  - 每个 slide 拥有独立 React root，`goal.slides[idx].props` 变更时只需重新渲染对应 wrapper，不影响其他 slide。
  - 切页体验从 DOM 替换变为已渲染 slide 的直接切换。

- [x] **保持服务端导出能力**
  - 导出 PPTX/PDF 仍走 `renderToStaticMarkup`。
  - 客户端渲染仅用于编辑/预览，不影响现有导出链路。

**阶段 2 验证结果**：`scripts/test-editor-slider.mjs` 全量通过；初始化时所有 slide 均已渲染为 React root，切页无需重新构建 DOM。

### 阶段 3：主题 Token CSS 变量化（已完成）

**目标**：让视觉调参只改变量，不重绘结构。

- [x] **输出 CSS 变量**
  - 新增 `packages/templates/src/themes/theme01/tokens.ts` 作为 theme01 单一事实来源。
  - `packages/renderer/src/render.tsx` 在 `<style>` 中注入 `:root { --lp-blue, --lp-green, --lp-font, --lp-radius-medium ... }`，变量名与 `theme01.css` 保持一致。

- [x] **图表组件改用 CSS 变量（第一批）**
  - `echart.tsx` 运行时通过 `getComputedStyle` 读取 `--lp-blue` 等变量作为 ECharts theme 配色，SSR 仍用 token 兜底值。
  - 通过 `scripts/apply-css-vars.mjs` 将 `trend-v1`、`quadrant-v1`、`chart-wordcloud`、`chart-bar3d`、`chart-heatmap`、`chart-gauge`、`gantt-v1` 中的硬编码颜色/字体批量替换为 CSS 变量。

- [x] **剩余组件迁移（第二批）**
  - 扫描并替换 `chart-treemap`、`chart-sunburst`、`chart-funnel`、`chart-bar3d`、`chart-heatmap` 中残留的硬编码颜色（`#fff`、`#DBEAFE`、`#374151`）为 CSS 变量。
  - `tokens.ts` 新增 `white`、`blue100`、`gray700` 三个 token，并生成对应 `--lp-white`、`--lp-blue-100`、`--lp-gray-700` 变量。
  - `scripts/apply-css-vars.mjs` 已扩展颜色映射表，可一键对其他主题或新增组件复用。
  - 当前 theme01 下仅剩阴影 `rgba(0,0,0, ...)` 与动态计算 `rgb(...)` 未替换，属于合理保留项。

- [x] **外观模式切换（同一主题内浅色/深色切换）**
  - `tokens.ts` 新增 `theme01DarkTokens` 与 `generateThemeCssVariablesWithDark()`，一套变量同时定义 light / dark 两套值。
  - `packages/renderer/src/render.tsx` 注入 `:root` 与 `:root[data-theme="dark"]` 两套变量；`packages/themes/src/theme01/styles.css` 的 `.lp-slide` 背景渐变改用 `--lp-bg-gradient-start/end`。
  - `goal` 数据模型新增 `colorScheme: 'light' | 'dark'`（默认 `'light'`），`theme` 继续表示主题类型，由生成阶段根据 prompt 关键词决定，编辑器内不可切换。
  - 编辑器顶部下拉改为"外观"切换按钮组【浅色 | 深色】，标题不再显示具体主题名称；`editor-script.ts` 切换时仅修改 `data-theme` 与 `goal.colorScheme`，React 组件无需重新渲染。
  - `export-pptx.ts` 增加 `colorsDark` / `chartColorsDark` 配置，导出时根据 `goal.colorScheme` 输出对应配色；`export-pdf.ts` 直接复用 HTML 中的 `data-theme`，自动输出当前外观样式。
  - `scripts/test-editor-slider.mjs` 更新为点击"深色"按钮，验证切换后 `data-theme`、`--lp-bg`、`--lp-ink` 正确变化。

### 阶段 4：动画策略与高级交互（2-3 月）

**目标**：达到 Dashi 级丝滑。

- **`skipMotion` 参数**
  - 切页时播放完整入场动画。
  - 调参时传 `skipMotion: true`，只更新属性过渡。

- **`flushSync` 高频输入优化**
  - 对 slider、color picker 等连续输入，批量提交。

- **编辑器与预览器合一**
  - 把 `/editor` 从"静态 HTML + 客户端补丁"升级为真正的 SPA。
  - 右侧面板与左侧 deck 共享同一套 React 状态。

## 三、当前卡点和收益排序

当前最影响体验的是**调参时整个 slide 被 `innerHTML` 重建**：

1. 图片/字体重新加载；
2. ECharts 重新初始化；
3. 动画可能重播。

**推荐推进顺序**：

1. 先修完当前编辑器 bug（阶段 1）。
2. 把 `theme01Tokens` 转成 CSS 变量（阶段 3 基础部分）。
3. 改造 `client-render.ts`，让每页 slide 有独立 React root（阶段 2）。
4. 加入 `skipMotion` 区分切页/调参（阶段 4）。

## 四、参考文档

- `docs/analysis/lemonPPT-preview-architecture-insights.md`
- `docs/analysis/theme01-token-analysis.md`
- `packages/renderer/src/editor-script.ts`
- `packages/renderer/src/client-render.ts`
- `packages/renderer/src/render.tsx`
- `packages/themes/src/theme01/tokens.ts`
