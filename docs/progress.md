# lemonPPT 项目进度

> 记录迁移清理、MVP 功能开发与验证状态。
> 最新更新：2026-08-04

---

## 2026-08-04（低优先级打磨 pass）

### 已完成

- **页脚英文双语标注**
  - 在 [`packages/themes/src/theme06/styles.css`](../../packages/themes/src/theme06/styles.css) 新增 `.lp-theme06-footer-bilingual`、`.lp-theme06-footer-cn`、`.lp-theme06-footer-en` 布局与字重样式。
  - 为以下版式新增 `footnote` Props/Schema，并统一使用 `splitBilingual('中文 / ENGLISH')` 在页脚左侧显示中文、右侧显示英文：
    - `theme06_process_v1`：[`packages/templates/src/themes/theme06/process-v1.tsx`](../../packages/templates/src/themes/theme06/process-v1.tsx)
    - `theme06_timeline_v1`：[`packages/templates/src/themes/theme06/timeline-v1.tsx`](../../packages/templates/src/themes/theme06/timeline-v1.tsx)
    - `theme06_risk_v1`：[`packages/templates/src/themes/theme06/risk-v1.tsx`](../../packages/templates/src/themes/theme06/risk-v1.tsx)
    - `theme06_risk_v2`：[`packages/templates/src/themes/theme06/risk-v2.tsx`](../../packages/templates/src/themes/theme06/risk-v2.tsx)
    - `theme06_case_v2`：[`packages/templates/src/themes/theme06/case-v2.tsx`](../../packages/templates/src/themes/theme06/case-v2.tsx)
  - 同步更新 [`scripts/lib/sample-props.mjs`](../../scripts/lib/sample-props.mjs)，为上述版式提供默认 `footnote`（如 `4 段 / FLOW`、`4 项风险 / 4 RISKS`）。
  - PPTX 导出层新增 `splitBilingual` 与 `addTheme06FooterBilingual` 辅助函数（[`packages/renderer/src/export-pptx.ts`](../../packages/renderer/src/export-pptx.ts)），并在 `renderTheme06ProcessV1`、`renderTheme06TimelineV1`、`renderTheme06RiskV1` 中渲染双语页脚。

- **装饰性箭头与徽章工具类**
  - 新增 `.lp-theme06-arrow-right`（带箭头符号的强调文字链接）与 `.lp-theme06-badge`（圆角胶囊标签）工具类。
  - 为章节页、内容编号页等提供可复用的原子样式，避免每个版式重复实现。

- **字体字重不一致修复**
  - 统一 theme06 标题类 `font-weight: 800`，标签 / kicker / 编号类 `font-weight: 700`，正文与辅助文字保持 `400/500/600` 层级。
  - 受影响选择器集中在 [`packages/themes/src/theme06/styles.css`](../../packages/themes/src/theme06/styles.css)。

### 验证结果

- `corepack pnpm -r typecheck` ✅
- `corepack pnpm -r build` ✅
- `corepack pnpm gallery` + `corepack pnpm snapshot theme06` ✅（theme06 全部 88 个版式快照生成成功）
- `node scripts/generate-theme06-goal.mjs && node scripts/export-pptx.mjs examples/theme06-audit-goal.json output/theme06-audit.pptx` ✅（88 页 PPTX 导出成功）

---

## 2026-08-04（中优先级对齐 pass）

### 已完成

- **通用卡片样式增强**
  - [`packages/themes/src/theme06/styles.css`](../../packages/themes/src/theme06/styles.css) `.lp-theme06-card` 新增顶部 2px accent 线（`::before` 伪元素）。
  - 新增 `.lp-theme06-card--no-topline` 修饰符与 `.lp-theme06-card-meta` 底部元数据样式。
  - 所有现有使用 `.lp-theme06-card` 的版式自动获得顶部强调线。

- **新增 `theme06_risk_v2` 版式**
  - 组件 [`packages/templates/src/themes/theme06/risk-v2.tsx`](../../packages/templates/src/themes/theme06/risk-v2.tsx)：左侧 01/02/03/04 编号风险卡片 + 右侧 `DROP IMAGE` 占位区 + 传导说明。
  - 样式 `.lp-theme06-risk-v2-*`。
  - PPTX 导出 [`packages/renderer/src/export-pptx.ts`](../../packages/renderer/src/export-pptx.ts) `renderTheme06RiskV2`。

- **新增 `theme06_case_v2` 版式**
  - 组件 [`packages/templates/src/themes/theme06/case-v2.tsx`](../../packages/templates/src/themes/theme06/case-v2.tsx)：左侧编号案例卡片 + 右侧图片占位区 + 公司/一句话说明/传导说明。
  - 样式 `.lp-theme06-case-v2-*`。
  - PPTX 导出 `renderTheme06CaseV2`。

- **背景网格**
  - 新增 `.lp-theme06-bg-grid` 工具类，使用极淡竖线网格强化「图谱风」质感。

- **注册与集成**
  - [`packages/templates/src/registry.tsx`](../../packages/templates/src/registry.tsx) 注册两个新版式。
  - [`packages/templates/src/index.ts`](../../packages/templates/src/index.ts) 导出新版式。
  - [`packages/composer/src/index.ts`](../../packages/composer/src/index.ts) `ROLE_LAYOUT_CANDIDATES.content` 加入 `theme06_risk_v2`、`theme06_case_v2`。
  - [`scripts/lib/sample-props.mjs`](../../scripts/lib/sample-props.mjs) 为新版式提供默认数据。

### 待完成

- [ ] 通用卡片顶部线对部分版式可能有轻微视觉影响，需根据 snapshot 基线决定是否保留或调整。
- [ ] 背景网格目前为可选工具类，如效果良好可默认应用到所有 theme06 幻灯片。
- [ ] 评估 theme06 亮色模式是否必要，必要时单独规划。

---

## 2026-08-04

### 已完成

- **theme06 所有子页面统一支持可选背景图**
  - 新增通用背景图层组件 [`packages/templates/src/themes/theme06/slide-bg.tsx`](../../packages/templates/src/themes/theme06/slide-bg.tsx)。
  - 新增通用背景图样式 [`packages/themes/src/theme06/styles.css`](../../packages/themes/src/theme06/styles.css)（`.lp-theme06-slide-bg*`）。
  - 批量为 80 个 theme06 子页面增加 `imageUrl` 字段、`needsMedia: true`、Schema「背景图片」字段与 `<Theme06SlideBg />` 渲染层。
  - 已排除已有专属图片逻辑的版式：`theme06_cover_v1`、`theme06_chapter_v1`、`theme06_closing_v1`、`theme06_chapter_image_v1`。
  - PPTX 导出层统一处理背景图：
    - [`packages/renderer/src/export-pptx.ts`](../../packages/renderer/src/export-pptx.ts) `renderSlideToPptx` 在 theme06 非 cover/chapter-image 版式且有 `imageUrl` 时全屏渲染背景图。
  - 同步更新 [`scripts/lib/sample-props.mjs`](../../scripts/lib/sample-props.mjs)，所有 theme06 版式默认返回 `imageUrl: ''`。
  - 临时 PPTX 导出验证：给 `theme06_content_v1` 设置本地图片路径后导出成功，背景图正常显示。

- **theme06 瀑布图配色对齐 Dashi 风格**
  - React 组件 [`packages/templates/src/themes/theme06/chart-waterfall-v1.tsx`](../../packages/templates/src/themes/theme06/chart-waterfall-v1.tsx)：
    - 首柱、末柱使用 accent（电光青柠）。
    - 中间正向柱改为半透明灰 `rgba(255,255,255,0.16)`。
    - 中间负向柱改为柔和红 `rgba(232,93,78,0.65)`。
  - PPTX 导出 [`packages/renderer/src/export-pptx.ts`](../../packages/renderer/src/export-pptx.ts) `renderTheme06ChartWaterfallV1`：正向柱同步改为中灰，保持导出一致。

- **theme06 与 Dashi 参考对齐审计**
  - 抽样对比 Dashi theme06 参考页（003、010、017、025、030、035、040、048、050、058、060、070、079 等）与项目当前快照。
  - 形成对齐计划文档：[`docs/plans/theme06-dashi-alignment-plan.md`](../../docs/plans/theme06-dashi-alignment-plan.md)。
  - 识别高优先级差距：章节页结构、内容编号卡片列表、大图/高客单价页占位区、亮色模式。

- **theme06 高优先级版式重设计 pass**
  - 章节页 `theme06_chapter_v1` 结构对齐 Dashi：
    - Props/Schema 新增 `topLeftLabel`、`topRightLabel`、`enSubtitle`、`tags`、`nextHint`。
    - 视觉改为顶部双标签、实心大号数字、底部要点标签胶囊、右下角下转提示。
    - 组件 [`packages/templates/src/themes/theme06/chapter-v1.tsx`](../../packages/templates/src/themes/theme06/chapter-v1.tsx)，样式 [`packages/themes/src/theme06/styles.css`](../../packages/themes/src/theme06/styles.css) `.lp-theme06-chapter-*`。
    - PPTX 导出 [`packages/renderer/src/export-pptx.ts`](../../packages/renderer/src/export-pptx.ts) `renderTheme06ChapterV1` 同步更新。
  - 新增 `theme06_content_numbered_v1`：
    - 左侧标题 + 右侧 01/02/03/04 编号卡片列表，支持高亮当前项。
    - 组件 [`packages/templates/src/themes/theme06/content-numbered-v1.tsx`](../../packages/templates/src/themes/theme06/content-numbered-v1.tsx)。
    - 样式 `.lp-theme06-content-numbered-*`。
    - PPTX 导出 `renderTheme06ContentNumberedV1`。
  - 新增 `theme06_vertical_bar_v1`：
    - 左侧大数字与支撑指标 + 右侧水平分段条形图，适合垂直赛道/高客单价分析。
    - 组件 [`packages/templates/src/themes/theme06/vertical-bar-v1.tsx`](../../packages/templates/src/themes/theme06/vertical-bar-v1.tsx)。
    - 样式 `.lp-theme06-vertical-bar-*`。
    - PPTX 导出 `renderTheme06VerticalBarV1`。
  - 统一注册与导出：
    - [`packages/templates/src/registry.tsx`](../../packages/templates/src/registry.tsx) 注册两个新版式。
    - [`packages/templates/src/index.ts`](../../packages/templates/src/index.ts) 导出新版式。
    - [`packages/composer/src/index.ts`](../../packages/composer/src/index.ts) `ROLE_LAYOUT_CANDIDATES.content` 加入 `theme06_content_numbered_v1`。
  - 示例数据：[`scripts/lib/sample-props.mjs`](../../scripts/lib/sample-props.mjs) 为 `theme06_chapter_v1`、`theme06_content_numbered_v1`、`theme06_vertical_bar_v1` 提供默认数据。

### 验证结果

- `corepack pnpm -r typecheck` ✅
- `corepack pnpm -r build` ✅
- `node scripts/gallery.mjs theme06` + `node scripts/snapshot.mjs theme06` ✅（包含 `theme06_content_numbered_v1`、`theme06_vertical_bar_v1`）
- `node scripts/export-pptx.mjs examples/theme06-audit-goal.json output/theme06-audit-redesign.pptx` ✅（80 页导出成功）

### 待完成

- [ ] 通用卡片增加顶部 accent 线与底部元数据标注（中优先级）。
- [ ] 评估 theme06 亮色模式是否必要，必要时单独规划。
- [ ] 继续维护 theme06 gallery/snapshot 基线。

---

## 2026-08-03

### 已完成

- **外部 AI / Agent 调用能力对齐（方案 B）**
  - 制定并保存 [`docs/plans/agent-invocation-alignment-plan.md`](docs/plans/agent-invocation-alignment-plan.md)。
  - 重写 [`SKILL.md`](SKILL.md)：明确能力边界、更新主题/角色/CLI 命令、给出 Agent 调用示例。
  - 新增 5 个独立脚本：
    - [`scripts/layout-query.mjs`](scripts/layout-query.mjs)：按 theme + role + keyword 查询候选版式。
    - [`scripts/inspect-layout.mjs`](scripts/inspect-layout.mjs)：查看版式字段契约、默认值与媒体槽位。
    - [`scripts/goal-scaffold.mjs`](scripts/goal-scaffold.mjs)：生成只含 role 的 goal.json 骨架。
    - [`scripts/write-safe-props.mjs`](scripts/write-safe-props.mjs)：规范化 props、填充默认值、报告未知字段。
    - [`scripts/validate-goal-spec.mjs`](scripts/validate-goal-spec.mjs)：独立校验 goal.json 规范。
  - CLI 暴露新增子命令：`list-themes`、`layout-query`、`inspect-layout`、`goal-scaffold`、`write-safe-props`、`validate-goal-spec`。
  - Server 新增 5 个 API 路由：
    - `GET /api/list-themes`
    - `POST /api/layout-query`
    - `POST /api/inspect-layout`
    - `POST /api/goal-scaffold`
    - `POST /api/write-safe-props`
    - `POST /api/validate-goal-spec`
  - 新增 Agent 接口定义文件：
    - [`packages/cli/agents/openai.yaml`](packages/cli/agents/openai.yaml)
    - [`packages/cli/agents/codex.yaml`](packages/cli/agents/codex.yaml)
    - [`packages/cli/agents/cursor.yaml`](packages/cli/agents/cursor.yaml)
  - 根目录 [`package.json`](package.json) 新增 npm scripts：`layout:query`、`inspect:layout`、`goal:scaffold`、`props:safe`、`validate:goal-spec`。
  - [`packages/cli/package.json`](packages/cli/package.json) `files` 字段加入 `agents` 目录，确保发布时包含。
  - 更新 [`apps/server/src/public/create.html`](apps/server/src/public/create.html)：主题下拉框加入 `theme06`。

- **修复 theme01 process_v1 PPTX 导出崩溃**
  - 问题：`agent-test.mjs` 在无 API Key 场景下失败，错误 `newObject.text.forEach is not a function`。
  - 根因：`generateGoal` fallback 使用 `process_v2` 布局并生成 `{title, description}[]` 的 `steps`，而 `composer` 为 theme01 选择 `theme01_process_v1`（要求 `steps: string[]`）；`patchSlideContentForLayout` 只匹配无主题前缀的 `process_v1`，导致对象数组未转换。
  - 修复：
    - [`packages/agent-prompts/src/fallback.ts`](packages/agent-prompts/src/fallback.ts)：fallback 流程页改为 `process_v1` + `steps: string[]`。
    - [`packages/agent-prompts/src/patch.ts`](packages/agent-prompts/src/patch.ts)：新增 `normalizeLayoutId()`，将 `theme01_process_v1` 等带主题前缀的 layout ID 还原为版式 ID，使所有版式判断正确生效。
  - 验证：`node scripts/agent-test.mjs` 6 个用例全部通过（1 个因无 API Key 跳过）。

### 验证结果

- `node scripts/agent-test.mjs`：5 通过 / 1 跳过（无 API Key），0 失败。
- Server API 手动 curl 验证：
  - `GET /api/list-themes` 返回 6 个主题。
  - `POST /api/layout-query` 返回 theme06 metric 候选版式。
  - `POST /api/inspect-layout` 返回 `theme06_metric_hero_v1` schema。
  - `POST /api/goal-scaffold` 返回 5 页 goal.json 骨架。
  - `POST /api/write-safe-props` 与 `POST /api/validate-goal-spec` 按预期工作。
- `node_modules/.bin/tsc -p packages/agent-prompts/tsconfig.json` 通过。
- `node_modules/.bin/tsc -p packages/cli/tsconfig.json` 通过。
- `node_modules/.bin/tsc -p apps/server/tsconfig.json` 通过。

### 待完成

- [ ] 在 Claude/Codex/Cursor 中实测新的 Agent YAML 接口定义效果。
- [ ] 继续推进 theme06 Phase 3/4 剩余版式开发（进度未受本次方案 B 影响）。
- [ ] 视觉回归：维护 gallery/snapshot 基线。

---

## 2026-07-29

### 已完成

- **theme04 缺失版式对照分析与下一步计划**
  - 基于 `docs/analysis/dashi-theme04-analysis.md` 与当前代码库，整理 theme04 已实现 33 个版式、Dashi PPT 74 个 slot 中仍缺失约 41 个 slot 的对照清单。
  - 新增分析文档：[docs/analysis/theme04-missing-layouts.md](docs/analysis/theme04-missing-layouts.md)。
    - 列出全部 33 个已实现版式及其对应 Dashi slot。
    - 按业务类型分组列出 74 个 Dashi slot 的覆盖状态。
    - 将缺失版式分为高/中/低三个优先级，共 42 个候选版式。
    - 制定 Phase 1/2/3/4 执行计划，明确每阶段目标。
  - 更新实施计划：[.trae/documents/theme04-implementation-plan.md](.trae/documents/theme04-implementation-plan.md)。
    - 将实施范围从 MVP 8 个版式更新为当前 33 个版式。
    - 标记 yellow/blue/pink 多色调切换与 20+ 版式扩展为已完成。
    - 在「后续可扩展项」中引用新的缺失版式清单，并列出 Phase 1 建议优先实现的 12 个高优先级版式。
  - 确认当前 33 个 theme04 版式均已：
    - 在 `packages/templates/src/registry.tsx` 注册；
    - 在 `packages/renderer/src/export-pptx.ts` 实现 PPTX 导出；
    - 在 `scripts/lib/sample-props.mjs` 提供示例数据；
    - 在 `packages/composer/src/index.ts` 完成角色候选映射。
  - 确认 theme04 已支持 4 套糖果色调（green/yellow/blue/pink）与 light/dark 双外观切换，`render.tsx` 已提供对应编辑器按钮。
  - 建议下一步最小化行动：优先实现 `theme04_cards_v1`、`theme04_gauges_v1`、`theme04_cover_ghost_v1`。

---

## 2026-07-28

### 已完成

- **新增 theme02 高冲击力版式**
  - `theme02_cover_v2`：全屏大字号标题 + 动态霓虹背景渐变 + 光球/网格装饰，支持背景图叠加。
  - `theme02_chapter_v2`：居中布局 + 霓虹描边超大章节号 + 旋转环形背景装饰。
  - `theme02_quote_v2`：居中玻璃卡片 + 霓虹引号装饰 + 扫光 hover 动效。
  - `theme02_number_showcase_v1`：单个大数字霓虹发光 + 标题/单位/解读说明，适合核心指标冲击展示。
  - 组件文件：
    - `packages/templates/src/themes/theme02/cover-v2.tsx`
    - `packages/templates/src/themes/theme02/chapter-v2.tsx`
    - `packages/templates/src/themes/theme02/quote-v2.tsx`
    - `packages/templates/src/themes/theme02/number-showcase-v1.tsx`
  - 注册到 `packages/templates/src/registry.tsx` 与 `packages/templates/src/index.ts`。
  - 补充 `packages/themes/src/theme02/styles.css`：新增 `lp-theme02-gradient-shift`、`lp-theme02-ring-rotate`、`lp-theme02-number-pulse` 等关键帧与高冲击力版式样式。
  - 同步更新 `packages/renderer/src/export-pptx.ts`：新增 `renderTheme02ChapterV2`、`renderTheme02QuoteV2`、`renderTheme02NumberShowcaseV1` 并注册对应 layout renderer。
  - 更新 `examples/theme02-sample-goal.json`：新增 4 页示例，pageCount 从 35 调整为 39。
  - 重新生成 `output/theme02-editor.html`、`output/editor.html`、`output/gallery/theme02/index.html`。
  - 运行 `corepack pnpm -r typecheck` 与 `corepack pnpm -r build` 通过。
  - 运行 `corepack pnpm test`：8 个测试文件 / 53 个用例全部通过。
  - 运行 `corepack pnpm gallery` + `node scripts/snapshot.mjs theme02` + `corepack pnpm regression:update`，新增版式快照已纳入基线。

- **幻灯片默认切换效果改为无动画**
  - 将 renderer 与 editor-script 中所有 `slide.props.transition` 的默认值从 `'slide'` 改为 `'none'`。
  - 涉及文件：
    - `packages/renderer/src/render.tsx`（渲染 slide wrapper 与 `goTo` fallback）
    - `packages/renderer/src/editor-script.ts`（编辑器 `goTo` fallback、重建 slide wrapper、右侧属性面板默认选中）
  - 效果：新建/未显式设置切换动画的幻灯片默认直接切换，不滑动、无淡入淡出/缩放等效果；编辑器右侧「切换动画」下拉框默认显示「无动画」。
  - 已重新构建并重新生成 `output/editor.html` 与 `output/theme02-editor.html`。
  - `corepack pnpm -r typecheck`、`corepack pnpm -r build`、`corepack pnpm test` 均通过。

- **“无动画”切换效果优化为类淡入淡出**
  - 将“无动画”从完全直接跳变改为极短（80ms）的 opacity 淡入淡出，视觉上更柔和但仍无明显动画感。
  - 关键改动：
    - `packages/themes/src/theme01/styles.css` 与 `packages/themes/src/theme02/styles.css`：`.lp-deck[data-lp-transition="none"] .lp-slide-wrapper` 的 `transition` 从 `none` 改为 `opacity 80ms ease`。
    - `packages/renderer/src/render.tsx`：
      - deck 默认渲染 `data-lp-transition="none"`。
      - `goTo` 的 none 分支显式设置 deck 的 `data-lp-transition="none"`。
      - `resetTransitionState` 结束后将 deck 重置为 `data-lp-transition="none"`，避免回到 slide 动画。
    - `packages/renderer/src/editor-script.ts`：
      - `goTo` 的 none 分支显式设置 deck 的 `data-lp-transition="none"`。
      - `resetTransitionState` 结束后将 deck 重置为 `data-lp-transition="none"`。
  - 已重新构建并重新生成 `output/editor.html` 与 `output/theme02-editor.html`。
  - `corepack pnpm -r typecheck`、`corepack pnpm -r build`、`corepack pnpm test` 均通过。

- **theme02 PPTX 导出细节对齐**
  - 在 `packages/renderer/src/export-pptx.ts` 中：
    - 为 theme02 新增 `addTheme02Background()` 辅助函数，给每页添加深色线性渐变背景（从 `#080A0E` 到 `#0F1218`），与网页端 theme02 渐变风格对齐。
    - 新增 `addTheme02Card()` 辅助函数，统一为卡片/面板添加深色表面、细边框与柔和阴影，提升玻璃拟物感。
    - 在 `exportDeckToPptx` 中，当 `goal.theme === 'theme02'` 时自动调用背景函数。
    - 为 `renderTheme02ChapterV2`、`renderTheme02QuoteV2`、`renderTheme02NumberShowcaseV1`、`renderTheme02DeltaV1`、`renderTheme02BentoV1` 的关键卡片应用 `addTheme02Card()`。
  - 验证 `node scripts/export-pptx.mjs examples/theme02-sample-goal.json output/theme02-sample.pptx` 成功导出 39 页。
  - `corepack pnpm -r typecheck`、`corepack pnpm -r build`、`corepack pnpm test` 均通过。

- **theme02 编辑器体验优化**
  - 图片占位符（`packages/renderer/src/render.tsx`）：
    - 背景与边框改为基于 `--lp-ink` 的 `color-mix`，在深色主题下仍保持可见。
    - hover 状态使用 `--lp-accent` 强调色，图标放大 1.08 倍，提升交互反馈。
  - 选中高亮（`packages/renderer/src/render.tsx`）：
    - `.lp-selected` 轮廓色从固定蓝色改为 `var(--lp-accent)`。
    - 增加 4px 的柔和光晕阴影，使选中状态在深色主题下更明显。
  - 字段中文标签（`packages/renderer/src/editor-script.ts`）：
    - 补充 `FIELD_LABELS`：脚注、来源、序号、上下文、重点强调、洞察面板、原/现数值、最大值、色调、占比、颜色、排名、公司、赛道、金额、高亮行/列、左右侧标题/数值/标签、尺寸、图标、页码、图片、头像、Logo 等。
    - 补充 `LAYOUT_LABELS`：指标墙、今昔对照、对比分析、进度条、数字秀、推荐语、结束页等 theme02 版式中文名。
  - 已重新构建并重新生成 `output/editor.html`、`output/theme02-editor.html`、`output/gallery/theme02/index.html`。
  - 运行 `node scripts/snapshot.mjs theme02` + `corepack pnpm regression:update`，更新 110 张基线快照。
  - `corepack pnpm -r typecheck`、`corepack pnpm -r build`、`corepack pnpm test` 均通过。

- **修复 theme02_image_v1 背景图上传占位区**
  - 问题：`theme02_image_v1` 版式在没有 `image` 数据时直接不渲染图片元素，画布中没有可点击上传背景图的占位区。
  - 修复：
    - `packages/templates/src/themes/theme02/image-v1.tsx`：改用 `LpEditableImage` 组件替代原生 `<img>`，无图时渲染全屏占位区，提示文字为「点击上传背景图」。
    - `packages/themes/src/theme02/styles.css`：新增 `.lp-theme02-image-placeholder` 样式，使其绝对铺满整个幻灯片，背景半透明，hover 使用强调色。
    - `packages/themes/src/theme02/styles.css`：为 `.lp-theme02-image-overlay` 增加 `pointer-events: none;`，避免渐变遮罩遮挡下方的占位区点击事件。
  - 已重新构建、生成 gallery、生成 theme02 快照并更新回归基线。
  - `corepack pnpm -r typecheck`、`corepack pnpm -r build`、`corepack pnpm test` 均通过。

- **theme02 图表组件补充重点强调模块**
  - 为环形图（`chart-donut`）、热力图（`chart-heatmap`）、雷达图（`chart-radar`）、仪表盘（`chart-gauge`）统一添加 `showInsight` 开关与 `insight` 数据面板。
  - 调整图表布局：当 `showInsight=true` 时，图表区域自动收缩，右侧显示主数值、说明与解读文字，避免图例/图表与 insight 面板重叠。
  - 同步更新 PPTX 导出（`packages/renderer/src/export-pptx.ts`）：为上述图表渲染 insight 形状与文本，保持与 HTML 预览一致的左右/上下布局。
  - 运行 `corepack pnpm regression:update` 更新 theme02 图表快照基线。

- **编辑器左侧缩略图拖拽排序（PowerPoint 式体验）**
  - 缩略图元素从 `<button>` 改为 `<div role="button" tabindex="0" draggable="true">`，支持整张缩略图按住拖动。
  - 拖拽手柄保留为左上角视觉提示，设置 `pointer-events: none`，点击/拖动时事件冒泡到缩略图容器。
  - 拖拽过程中视觉反馈：
    - 被拖拽缩略图半透明 + 蓝色虚线边框（`.dragging`）。
    - 目标位置缩略图绿色高亮（`.drag-over`）。
    - 插入位置显示蓝色指示线（`.lp-thumbnail-drop-indicator`）。
  - 状态同步：拖拽释放后更新 `goal.slides` 顺序，调用 `recordHistory()`、`autoSave()`、`rebuildSlidesAndThumbnails()`，并自动跟随当前活动幻灯片。
  - 键盘可访问性：为 `role="button"` 的缩略图补充 `Enter` / `Space` 选中跳转。
  - 边界处理：
    - 只有 1 张幻灯片时不显示拖拽手柄且不可拖拽。
    - 幻灯片切换动画期间禁止拖拽。
    - 点击删除按钮区域不触发拖拽。

- **撤销/重做与 localStorage 恢复修复**
  - 修复 `restoreGoal()` 中幻灯片顺序变化判断：从对象引用比较改为 `slide.layout` 比较，使撤销/重做排序正确生效。
  - 修复从 `localStorage` 恢复时顺序变化未重建 DOM 的问题：当检测到顺序变化时设置 `needsDomRebuild = true`，调用 `rebuildSlidesAndThumbnails()` 而非仅同步文本。

- **重新生成预览与验证**
  - 重新构建 workspace：`corepack pnpm -r build` 通过。
  - 重新生成 `output/editor.html` 与 `output/theme02-editor.html`。
  - 运行 `corepack pnpm test`：8 个测试文件 / 53 个用例全部通过。
  - 使用 Playwright 做端到端拖拽验证：确认原生 `dragstart` / `drop` 事件触发，幻灯片顺序正确更新。

- **theme03 Phase 2：深浅模式与编辑器集成**
  - 扩展核心类型与 Schema：
    - `packages/core/src/types.ts`：`DeckGoal` / `RawDeckGoal` 新增 `appearance?: 'light' | 'dark'`。
    - `packages/core/src/schema.ts`：`deckGoalSchema` / `rawDeckGoalSchema` 增加 `appearance` 枚举校验。
    - `packages/core/src/normalize.ts`：为 theme03 默认设置 `appearance: 'dark'`。
  - 扩展 theme03 Token：
    - `packages/themes/src/theme03/tokens.ts` 与 `packages/templates/src/themes/theme03/tokens.ts` 同步支持 `scheme × appearance` 组合。
    - `generateTheme03CssVariablesWithSchemes()` 生成四组 CSS 变量，覆盖 scheme-a/b × dark/light。
  - 渲染层：
    - `packages/renderer/src/render.tsx`：theme03 输出 `<html data-theme="..." data-appearance="...">`；编辑器顶栏在 theme03 下显示「浅色 / 深色」切换按钮。
  - 编辑器客户端：
    - `packages/renderer/src/editor-script.ts`：新增 `syncAppearanceFromGoal()`，在初始化、外观切换、undo/redo 时同步 `data-theme`、`data-appearance` 与按钮 active 状态；theme03 下持久化 `goal.appearance`。
  - PPTX 导出：
    - `packages/renderer/src/export-pptx.ts`：`resolveThemeConfig()` 增加 `appearance` 参数；theme03 按 `appearance` 选择深浅底色，按 `colorScheme` 覆盖强调色。
  - Gallery：
    - `scripts/gallery.mjs` 注入 theme03 默认 `appearance: 'dark'`，生成 `output/gallery/theme03/index.html`。
  - 验证：
    - `corepack pnpm -r typecheck`、`corepack pnpm -r build`、`corepack pnpm test` 全部通过。
    - 生成 `output/theme03-editor.html`；浏览器验证浅色/深色按钮切换、localStorage 刷新保持、undo/redo 同步均正常。
    - 导出 `output/theme03.pptx`（dark）与 `output/theme03-light.pptx`（light），背景色分别为 `#0D0E12` 与 `#F0F1F5`。
    - 运行 `node scripts/snapshot.mjs theme03` + `corepack pnpm regression:update`，新增 theme03 8 张基线快照；回归测试通过。

- **theme03 示例文案与数据更新**
  - 将 `examples/theme03-sample-goal.json` 的主题从「2024 美国大额融资 AI 公司调研报告」更换为「2024 开发者体验与 AI 编码助手调研报告」。
  - 所有 8 页版式文案与数据全部重写，更贴合 theme03 代码编辑器风视觉：
    - 封面：核心指标改为「92% 开发者已使用 AI 编码助手」。
    - 章节页：围绕「效率 / 质量 / 体验」三重维度展开。
    - 内容页：改为「问卷 + 访谈 + 工具埋点」三维评估框架。
    - 大数字页：核心指标改为「46% 代码由 AI 生成」，洞察面板展示效率提升。
    - 排名页：改为 GitHub Copilot / Cursor / JetBrains AI 等工具周活跃使用率排名。
    - 金句页：改为 Satya Nadella 关于 AI 辅助编程的论断。
    - 案例页：改为 Cursor 从编辑器到智能协作环境的发展历程。
    - 封底：更新为 DevEx 调研数据来源与研究提示。
  - 重新生成 `output/theme03-editor.html`、`output/theme03.pptx`、`output/gallery/theme03/index.html` 与 theme03 快照。
  - 运行 `corepack pnpm -r typecheck`、`corepack pnpm -r build`、`corepack pnpm test` 全部通过。
  - 更新视觉回归基线，118 张快照全部通过。

- **修复右侧栏数组滑块越拖越少的问题**
  - 问题：当版式 Schema 未声明 `maxItems` 时，`createSchemaArraySection` 将 slider 的 `max` 回退为当前数组长度。用户减少条目后 `max` 同步缩小，导致无法恢复原有数量，也无法继续增加。
  - 修复：在 `packages/renderer/src/editor-script.ts` 中，未声明 `maxItems` 时使用 `Math.max(array.length, minItems, 6)` 作为默认上限，保证 slider 范围不会随数组缩短而收缩。
  - 验证：
    - 使用 Playwright 复现：初始 3 项，点击到 2 后 `max` 变为 2，点击到 1 后 `max` 变为 1，无法回到 3。
    - 修复后：初始 `max` 为 6，可在 1–6 之间自由拖动/点击，减少后可恢复，增加也可生效。
    - `corepack pnpm -r build`、`corepack pnpm test` 全部通过。

### 待完成

- [ ] 继续补充 theme01/theme02 剩余版式的 Props Schema 精修（如表格二维编辑、复杂图表 data 结构细化）。
- [ ] 视觉回归：继续维护 gallery/snapshot 基线，防止后续主题/版式改动破坏既有渲染效果。
- [ ] 编辑器稳定性：持续验证 contenteditable 在 React 18 异步渲染下的稳定性。

---

## 2026-07-20

### 已完成

- **文档对齐与大师 PPT 对比**
  - 阅读 `docs/plans/`、`docs/analysis/` 中所有规划文档
  - 生成 [`docs/analysis/project-alignment-report.md`](docs/analysis/project-alignment-report.md)
  - 修正 `docs/plans/project-plan.md`：协议改为 AGPL-3.0-or-later、目录结构更新为当前 workspace、版式/角色数更新
  - 修正 `docs/plans/theme-strategy.md`：当前状态改为 3 主题/39 版式、明确暂停新增主题、更新路线图
  - 修正 `docs/plans/technical-plan.md`：协议改为 AGPL-3.0-or-later、架构与版式列表更新
  - 修正 `docs/analysis/phase-4-next-step-analysis.md`：版本号 0.1.3 → 0.1.6、版式数 30 → 39、测试数 47 → 66、标记 Phase 4 已完成
  - 更新 `docs/plans/phase-5-community-plan.md`：增加 Skill 包架构决策任务、更新各任务状态

---

## 2026-07-20

### 已完成

- **npm 发布（阶段 A）**
  - 已用粒度访问令牌成功发布 8 个包到 npm registry：
    - `@lemonppt/core@0.1.0`
    - `@lemonppt/view-model@0.1.0`
    - `@lemonppt/themes@0.1.0`
    - `@lemonppt/templates@0.1.0`
    - `@lemonppt/composer@0.1.0`
    - `@lemonppt/renderer@0.1.0`
    - `@lemonppt/agent-prompts@0.1.0`
    - `@lemonppt/cli@0.1.0`
  - 通过 `npx @lemonppt/cli generate ...` 和 `npx @lemonppt/cli export --pptx ...` 端到端验证发布包可正常工作。

- **npm 补丁发布 0.1.1（2026-07-20）**
  - 8 个包全部升级到 `0.1.1`。
  - 包含主题重命名 `minimal` → `base`、版式目录重命名、向后兼容映射。
  - 通过 `npx @lemonppt/cli@0.1.1 generate ...` 和 `npx @lemonppt/cli@0.1.1 export ...` 验证发布包可正常工作。
  - `npx @lemonppt/cli@0.1.1 install-skill` 成功安装到 Claude/Codex/Cursor 技能目录。

- **npm 补丁发布 0.1.2（2026-07-20）**
  - 8 个包全部升级到 `0.1.2`。
  - 基于 Agent 实测反馈迭代 `SKILL.md`：增加生成前信息收集、 richer prompt 示例、fallback 说明。
  - 通过 `npx @lemonppt/cli@0.1.2 install-skill` 和 `npx @lemonppt/cli@0.1.2 generate/export` 验证。
  - 将 `tmp/` 目录加入 `.gitignore`，避免生成文件误提交。

- **npm 补丁发布 0.1.3（2026-07-20）**
  - 8 个包全部升级到 `0.1.3`。
  - 修复 fallback 标题被截断为 30 字符的 bug，改为 80 字符并在标点处截断。
  - fallback 内容现在会根据输入推断受众、提取核心卖点，减少自说自话。
  - 补充 `fallback.test.ts` 单元测试。
  - 通过 `npx @lemonppt/cli@0.1.3 generate/export` 验证。

- **Skill 分发安装器（阶段 B）**
  - 新增 `lemonppt install-skill` 子命令（`packages/cli/src/install-skill.ts`）。
  - 支持安装到 `~/.claude/skills/lemonppt/`、`~/.codex/skills/lemonppt/`、`~/.cursor/skills/lemonppt/`。
  - `SKILL.md` 已打包进 `@lemonppt/cli` 发布包。
  - 通过 `npx @lemonppt/cli install-skill --claude` 验证成功。

- **布局与主题命名解耦（阶段 C）**
  - 30 个版式组件的 `theme` 从 `'minimal'` 改为 `'base'`。
  - 版式 ID 从 `minimal_xxx_v1` 改为 `xxx_v1`（如 `cover_v1`、`metric_v1`）。
  - 同步更新 `composer`、`renderer/export-pptx`、`agent-prompts/fallback`、`SKILL.md`、测试与示例。
  - 提交：`refactor: decouple layout naming from minimal theme`

- **GitHub 远程仓库**
  - 已配置 `https://github.com/lemonforme/lemonPPT.git` 为 origin。
  - 已推送阶段 B、C 变更到 main 分支。

### 2026-07-20（Phase 4 规模化启动）

- **决策：继续使用 CLI 内置 `install-skill`**
  - 创建 `docs/decisions/skill-distribution-architecture.md`，决定不新建独立 `@lemonppt/skill` 包。

- **版式/主题脚手架**
  - 新增 `scripts/create-layout.mjs`：自动生成版式组件、测试文件并提示注册位置。
  - 新增 `scripts/create-theme.mjs`：自动生成主题 token、样式目录并提示注册位置。

- **新增版式 `testimonial_v2`（验证脚手架）**
  - 组件：`packages/templates/src/base/testimonial-v2.tsx`
  - 测试：`packages/templates/src/base/testimonial-v2.test.tsx`
  - 注册到 `templates/index.ts`、`templates/registry.tsx`、`composer` 候选列表
  - PPTX 导出：`packages/renderer/src/export-pptx.ts`
  - 三套主题 CSS：`base`、`dark-tech`、`warm-business`
  - 更新 `SKILL.md` 与 `packages/cli/SKILL.md`

- **社区贡献机制**
  - 新增 `CONTRIBUTING.md`：环境搭建、版式/主题开发流程、提交规范、发布流程。

- **测试配置修复**
  - `vitest.config.ts` 增加 `.test.tsx` 文件匹配，使版式组件测试生效。

- **本地验证通过**
  - `corepack pnpm -r build && corepack pnpm test`：9 个测试文件、49 个测试通过。
  - CLI render + export 成功生成 `/tmp/testimonial-v2-output/index.html` 与 `/tmp/testimonial-v2.pptx`。

### 2026-07-20（补充 chart_v2 / gallery_v2）

- **新增版式 `chart_v2`**
  - 多系列柱状图，支持多组数据对比与图例
  - 组件：`packages/templates/src/base/chart-v2.tsx`（SVG 渲染）
  - PPTX 导出：`packages/renderer/src/export-pptx.ts`（pptxgenjs 多系列柱状图）

- **新增版式 `gallery_v2`**
  - 三列图片墙，支持最多 6 张图片配说明
  - 组件：`packages/templates/src/base/gallery-v2.tsx`
  - PPTX 导出：`packages/renderer/src/export-pptx.ts`

- **注册与样式**
  - 两个版式均注册到 `templates/index.ts`、`templates/registry.tsx`、`composer` 候选列表
  - 为 `base`、`dark-tech`、`warm-business` 三个主题补充 CSS
  - 更新 `SKILL.md` 与 `packages/cli/SKILL.md`

- **测试**
  - `vitest.config.ts` 已支持 `.test.tsx`，新增两个版式测试
  - `corepack pnpm test`：11 个测试文件、53 个测试通过

- **发布 0.1.5**
  - 8 个包全部升级到 `0.1.5`
  - 通过 `npx @lemonppt/cli@0.1.5 generate/export` 端到端验证

- **本地验证通过**
  - CLI render + export 成功生成 `/tmp/new-layouts-output/index.html` 与 `/tmp/new-layouts.pptx`

### 发布 0.1.6

- 8 个可发布包全部升级到 `0.1.6`
- **协议变更**：项目主协议从 MIT 切换为 **AGPL-3.0**
  - 根目录 `LICENSE` 替换为 GNU Affero General Public License v3.0 全文
  - 所有 `package.json` 的 `license` 字段更新为 `AGPL-3.0`
  - 87 个源码/CSS 文件添加 SPDX 协议头
- **PR 策略**：当前阶段暂不接受外部 Pull Request
  - 更新 `README.md`、`SKILL.md`、`CONTRIBUTING.md`
  - 新增 `docs/LEGAL.md` 作为协议治理与合规说明
- **合规自查**
  - 依赖协议扫描通过，无与 AGPL-3.0 不兼容的强 copyleft 依赖
  - 确认无 Dashi PPT 代码或资产依赖
  - jszip 按 MIT 许可使用
- 通过 `npx @lemonppt/cli@0.1.6 generate/export` 端到端验证

### 2026-07-20（Phase 4 继续：脚手架 + timeline_v2）

- **版式脚手架升级**
  - `scripts/create-layout.mjs` 现在会自动完成：
    - 生成带 SPDX 协议头的组件和测试文件
    - 在 `packages/templates/src/index.ts` 中导出
    - 在 `packages/templates/src/registry.tsx` 中注册
    - 在 `packages/composer/src/index.ts` 的候选列表中追加（若 role 已存在）或新增
    - 在 `packages/renderer/src/export-pptx.ts` 中生成 switch case 与 `renderXxx` 占位函数
  - 修复 shebang 在 SPDX 头之前导致脚本无法运行的问题

- **新增版式 `timeline_v2`**
  - 垂直时间线布局，适合发展历程、项目里程碑
  - 组件：`packages/templates/src/base/timeline-v2.tsx`
  - 测试：`packages/templates/src/base/timeline-v2.test.tsx`
  - 三套主题 CSS：`base`、`dark-tech`、`warm-business`
  - PPTX 导出：`packages/renderer/src/export-pptx.ts`
  - 端到端验证：`npx @lemonppt/cli@0.1.6 generate/export` 成功生成 PPTX（133KB）

- **版式 Gallery 预览/回归机制**
  - 新增脚本 `scripts/gallery.mjs`
  - 一键生成 `output/gallery/<theme>/index.html`，展示所有版式 × 主题渲染效果
  - 运行命令：`corepack pnpm gallery`
  - 当前共 39 个版式 × 3 套主题

- **新增高价值版式（Phase 4 规模化）**
  - `roadmap_v2`：阶段路线图，展示季度/年度目标
  - `pricing_v2`：三列价格方案对比，支持高亮推荐
  - `feature_v2`：三列特性卡片，带图标和说明
  - `team_v2`：团队介绍墙，支持头像占位、职位、简介
  - `metric_v3`：双指标对比，强调增长率
  - 均已完成：组件、测试、注册、PPTX 导出、三套主题 CSS

- **验证**
  - `corepack pnpm -r build` 通过
  - `corepack pnpm test`：17 个测试文件、66 个测试通过
  - `corepack pnpm gallery` 成功生成 39 个版式 × 3 套主题预览页

### Agent 实测准备

- **SKILL.md 同步新版式**
  - 更新 [`SKILL.md`](file:///Users/apple/工作/lemonPPT/SKILL.md) 和 [`packages/cli/SKILL.md`](file:///Users/apple/工作/lemonPPT/packages/cli/SKILL.md) 的版式角色表
  - 新增 `metric_v3`、`timeline_v2`、`roadmap_v2`、`pricing_v2`、`feature_v2`、`team_v2`
- **实测清单**
  - 新增内部文档 [`docs/agent-testing-checklist.md`](file:///Users/apple/工作/lemonPPT/docs/agent-testing-checklist.md)
  - 覆盖 Claude / Codex / Cursor 的 6 个常用用例和记录模板
- **本地预验证**
  - `lemonppt generate` + `export --pptx --pdf` 在无 API Key 场景下成功生成文件
  - 生成 `goal.json` 合法，`pageCount` 与 `slides.length` 一致

### Agent 实测反馈与视觉优化

- **反馈**：Agent 能正常生成 PPT，但视觉效果较差
- **已产出视觉审查报告**：[`docs/visual-review.md`](file:///Users/apple/工作/lemonPPT/docs/visual-review.md)
- **主要问题**：主题颜色/字体不协调、版式间距/对齐问题、fallback 内容空洞、PPTX 与 HTML 预览不一致
- **优化优先级**：fallback 内容 > base 主题视觉规范 > PPTX 主题化

### 待完成

- [x] 本地 Agent smoke test（Trae）通过 6 个 SKILL.md 用例
- [ ] 在 Claude/Codex/Cursor 中实测 SKILL.md 效果并收集反馈（⏸️ 本地无环境，暂缓）
- [x] 优化 fallback 内容，让无 API Key 生成的 PPT 更贴合主题
- [x] 统一 `base` 主题字号/间距/卡片视觉规范
- [x] PPTX 导出读取 `goal.theme` 并按主题配色/字体
- [x] 视觉回归：基于 gallery 生成快照，防止后续修改破坏既有版式
- [ ] ~~继续用新主题/版式脚手架补充更多版式~~（当前 5 个补充版式已完成）
- [ ] ~~新增 1 套主题验证主题系统可扩展性~~（已暂停：当前不新增主题）
- [x] 完成 CLA、贡献指南、行为准则、Issue/PR 模板
- [ ] 推送 CLA 检查 workflow（需带 `workflow` scope 的 token）
- [ ] 根据社区反馈迭代 `SKILL.md` 与脚手架

> 后续详细规划见本地文档 `docs/plans/phase-5-community-plan.md`。

---

## 2026-07-19

### 已完成

- **npm 发布准备**
  - 添加 MIT LICENSE
  - 为 8 个可发布包配置发布元数据：`files`、`publishConfig.access`、`repository`、`prepublishOnly`
  - 排除测试文件出发布包（tsconfig exclude）
  - `@lemonppt/themes` 额外发布 `src/**/*.css`
  - `apps/server` 标记 `private: true`
  - 修复 CLI 包路径解析，支持从 `node_modules` 运行
  - 提交：`chore(publish): configure packages for npm release`

### 待完成

- [x] 登录 npm 并执行 `pnpm publish:packages`
- [x] 验证 `npm i -g @lemonppt/cli` 后可正常工作
- [x] 改造 `scripts/install.mjs` 支持从 npm 包运行
- [x] 解耦布局命名与 minimal 主题绑定
- [ ] 在 Claude/Codex/Cursor 中实测 SKILL.md

---

## 2026-07-17

### 已完成

- **迁移清理**
  - 明确迁移来源：`/Users/apple/Downloads/dashi-ppt-skill-main/lemonPPT/`
  - 目标目录：`/Users/apple/工作/lemonPPT/`
  - 创建 `.gitignore`，隔离 `node_modules`、`dist`、`output`、源码目录编译产物
  - 删除 `src/` 下所有 `.js` / `.d.ts` / `.map` 编译残留
  - 删除 `dist/` 目录与 `*.tsbuildinfo`
  - 初始化 Git 仓库

- **构建基线验证**
  - 通过 `corepack pnpm` 完成依赖安装
  - 全部包 `build` 与 `typecheck` 通过：
    - `@lemonppt/core`
    - `@lemonppt/themes`
    - `@lemonppt/templates`
    - `@lemonppt/renderer`
    - `@lemonppt/agent-prompts`
    - `@lemonppt/server`

- **本地预览服务器修复**
  - `POST /api/render`：生成 `output/index.html` 并复制 `base.css`
  - `POST /api/export/pptx`：生成 `output/presentation.pptx`
  - `GET /api/health`：健康检查
  - 修复 CSS 路径基于脚本位置计算，避免 `process.cwd()` 依赖

- **版式扩展（8/8，达成 Phase 1 目标）**
  - `cover_v1`
  - `table_of_contents_v1`（新增）
  - `metric_v2`
  - `comparison_v1`（新增）
  - `process_v1`（新增）
  - `content_v1`
  - `quote_v1`（新增）
  - `closing_v1`
  - 每个版式均包含：React 组件、模板注册、PPTX 导出映射、CSS 样式

- **示例与脚本**
  - 更新 `examples/sample-goal.json` 为 8 页完整示例
  - `pnpm render` 生成 HTML 演示
  - `pnpm export:pptx` 生成 PPTX 演示
  - server 端 `/api/render` 与 `/api/export/pptx` 均验证成功

- **Agent Prompt（自然语言 → goal.json）**
  - 新增 `@lemonppt/agent-prompts` 工作区包
  - 提供 `buildPrompt()`：生成结构化 LLM prompt
  - 提供 `generateGoal()`：支持 OpenAI 兼容 API 调用 + schema 校验
  - 提供未配置 API Key 时的 `fallback` 生成器
  - CLI：`pnpm generate:goal "描述" [output.json]`
  - Server：`POST /api/generate` 生成 goal.json
  - 已验证：fallback 生成 8 页 goal 并可正常渲染/导出

### 2026-07-17（Phase 2 启动）

- **浏览器端编辑器**
  - 8 个版式组件全部接入可编辑字段（`data-lp-editable`、`data-lp-slide-idx`、`data-lp-prop`）
  - 新增 `EditableField` 辅助组件：`packages/templates/src/editable-field.tsx`
  - `renderDeck(goal, { editable: true })` 生成可编辑 HTML
  - 顶部工具栏：下载 `goal.json`、导出 PPTX、导出 PDF
  - 点击文字即可编辑，失焦自动同步到 `window.__lemonPPT_goal`
  - CLI：`pnpm render:editor`
  - Server：`GET /editor` 打开示例编辑器，`POST /api/render-editor` 渲染指定 goal
  - 已验证：本地服务 `http://127.0.0.1:5300/editor` 可访问
  - **编辑器交互与 UI 升级**
    - 左侧缩略图面板：显示每页标题/版式，点击跳转
    - 中央画布自适应缩放，适配左右面板
    - 右侧属性面板：选中元素后显示字段路径与值，实时编辑
    - 选中元素高亮（蓝色外框）
    - 主题切换、撤销/重做、导出按钮整合到顶部工具栏

- **PDF 导出**
  - 新增 `exportDeckToPdf()`：`packages/renderer/src/export-pdf.ts`
  - 使用 Playwright + `@media print` 样式生成多页 PDF
  - CLI：`pnpm export:pdf`
  - Server：`POST /api/export/pdf`
  - 已验证：生成 8 页 PDF，含封面图片

- **换图能力**
  - `cover_v1` 支持 `image` 背景图
  - 示例 `sample-goal.json` 封面已添加 Unsplash 图片
  - 编辑器中点击图片即可通过 `prompt` 输入新 URL 替换
  - 已验证：`/editor` 渲染出封面背景图

### 待完成

- [x] Agent prompt：自然语言 → `goal.json`
- [x] 浏览器端编辑器：文本编辑 + props 调整
- [x] 换图能力（图片 URL）
- [x] PDF 导出
- [x] 图片上传（本地文件，转 base64 存入 goal）
- [x] 自动保存与撤销重做
- [x] 新增主题 dark-tech、warm-business
- [~] 扩展版式到 30~50 个（已新增 15 个版式，共 23 个）
- [x] 支持分析模型版式（SWOT、PEST）
- [x] 支持图表组件（柱状图、折线图、饼图）
- [x] 完善错误处理与日志
- [x] 编写项目 README 文档
- [x] 添加自动化测试（单元测试 + 端到端脚本）
- [ ] 配置 GitHub 远程仓库并首次提交
- [x] 完善 `PROJECT_PLAN.md` 中 Phase 2/3 的详细任务

- **自动化测试**
  - 引入 `vitest` + `supertest`
  - `pnpm test` 可运行全部测试
  - 覆盖：
    - `@lemonppt/core`：schema 校验、页数校验
    - `@lemonppt/templates`：版式注册、按角色过滤、渲染异常
    - `@lemonppt/renderer`：HTML 渲染、可编辑模式
    - `@lemonppt/agent-prompts`：fallback goal 生成
    - `@lemonppt/server`：健康检查、生成 goal、渲染接口
  - 当前测试用例：21 个，全部通过

### 当前状态

Phase 2 已完成；Phase 3 核心任务基本完成。Phase A/B/C（npm 发布、Skill 安装器、命名解耦）已全部完成。下一步进入 Agent 实测与工程债务清理阶段。

---

## 2026-07-23（编辑器添加幻灯片弹窗改造）

### 已完成

- **交互改造**
  - 将编辑器顶部原来的「版式下拉框 + 添加按钮」改为：保留「＋ 添加幻灯片」按钮，点击后弹出版式选择弹窗。
  - 弹窗标题：「请选择你想添加的幻灯片版式」。
  - 弹窗内容从项目注册表动态拉取所有 `theme01` 版式，按 role 排序平铺展示。

- **弹窗样式**
  - 深色背景（`#1e1e1e`）、圆角、遮罩 + 毛玻璃效果。
  - 每个版式选项包含：左侧灰色图标块（SVG）+ 右侧版式名称。
  - 悬停状态：卡片背景变亮、图标块高亮。
  - 选中状态：绿色边框（`#34d399`）、绿色文字、图标块变为绿色。
  - 底部「添加幻灯片」按钮：未选择时置灰；选中后高亮绿色。
  - 右上角关闭按钮，点击遮罩层也可关闭。

- **实现文件**
  - [`packages/renderer/src/render.tsx`](packages/renderer/src/render.tsx)：
    - 移除顶部 `lp-add-slide-layout` 下拉框。
    - 新增 `buildAddSlideModalMarkup()`，从 `@lemonppt/templates` 的 `listLayouts()` 动态读取 theme01 版式并生成弹窗 HTML。
    - 新增弹窗 CSS（`.lp-add-slide-modal*` 系列）。
  - [`packages/renderer/src/editor-script.ts`](packages/renderer/src/editor-script.ts)：
    - 绑定「添加幻灯片」按钮打开弹窗。
    - 绑定选项点击选中/取消，控制底部按钮高亮/置灰。
    - 绑定关闭按钮、遮罩关闭。
    - 点击弹窗内「添加幻灯片」按钮后，调用 `createDefaultSlide()` 添加新幻灯片并重新渲染。

- **重新生成预览**
  - 重新生成 `output/editor.html`。

### 验证

- `corepack pnpm -r build` 通过。
- `corepack pnpm test`：8 个测试文件 / 51 个用例全部通过。
- `corepack pnpm audit:layouts`：64 / 64 版式覆盖。
- `curl` 检查 `output/editor.html` 包含 73 个版式选项。
- 弹窗打开后未选择时底部按钮置灰，选择后高亮，符合截图要求。

### 2026-07-23（弹窗宽度与自定义滚动条优化）

### 已完成

- **弹窗宽度优化**
  - 弹窗最大宽度从 920px 调整为 1080px，确保一行可容纳 6 个版式选项。
  - 弹窗网格使用 `repeat(6, minmax(0, 1fr))` 并显式设置 `overflow-x: hidden`，避免产生横向滚动条。

- **jQuery 自定义滚动条**
  - 安装 `jquery@3.7.1` 与 `jquery.scrollbar@0.2.11`。
  - 在 [`packages/renderer/src/render.tsx`](packages/renderer/src/render.tsx) 中引入 jQuery、滚动条 CSS/JS，并为所有滚动容器添加 `data-scrollbar` 标记：
    - 编辑器左侧面板 `.lp-editor-left-panel`
    - 编辑器右侧面板 `.lp-editor-right-panel`
    - 添加幻灯片弹窗网格 `.lp-add-slide-grid`
    - 版式横向滚动容器 `.lp-filmstrip-v1-track`
  - 在 [`packages/renderer/src/editor-script.ts`](packages/renderer/src/editor-script.ts) 中初始化 `$('[data-scrollbar]').scrollbar()`。
  - 在 [`packages/cli/src/index.ts`](packages/cli/src/index.ts) 中复制 jQuery 与滚动条资源到输出目录 `assets/`；同时修复 `resolvePackagePath` 对主入口位于包根目录的第三方包（如 `jquery.scrollbar`）的解析。
  - 覆盖滚动条颜色：编辑器与弹窗使用浅色半透明滚动条，`filmstrip` 版式使用深色半透明滚动条，同时支持水平和垂直方向。

- **重新生成预览**
  - 重新生成 `output/editor.html`。

### 验证

- `corepack pnpm -r build` 通过。
- `corepack pnpm test`：8 个测试文件 / 51 个用例全部通过。
- `corepack pnpm audit:layouts`：64 / 64 版式覆盖。
- 输出目录 `output/editor/assets/` 包含 `jquery.min.js`、`jquery.scrollbar.min.js`、`jquery.scrollbar.css`。
- `output/editor.html` 包含 5 处 `data-scrollbar` 标记，覆盖所有已知滚动容器。

### 2026-07-23（修复滚动条导致的布局错乱）

### 问题
- 使用 `jquery.scrollbar` 插件会强制包裹 DOM 并修改容器宽度/盒模型，导致弹窗网格（Grid 布局）内容消失、页面布局错乱。

### 修复
- 移除 `jquery.scrollbar` 插件（CSS/JS 及资源复制）。
- 改为 **CSS `::-webkit-scrollbar` + Firefox `scrollbar-*` 属性** 自定义滚动条样式。
- 保留 jQuery，在 DOM Ready 时通过 `$('[data-scrollbar]').addClass('lp-custom-scrollbar')` 为所有滚动容器统一添加样式类。
- 分别定义深色主题（编辑器/弹窗）与浅色主题（filmstrip 版式）两套滚动条颜色，同时支持水平和垂直方向。
- 更新文件：
  - [`packages/renderer/src/render.tsx`](packages/renderer/src/render.tsx)：移除 jquery.scrollbar 引用，新增 `lp-custom-scrollbar` CSS。
  - [`packages/renderer/src/editor-script.ts`](packages/renderer/src/editor-script.ts)：改为用 jQuery 添加 `lp-custom-scrollbar` 类。
  - [`packages/cli/src/index.ts`](packages/cli/src/index.ts)：停止复制 jquery.scrollbar 资源，仅保留 jQuery。

### 验证
- `corepack pnpm -r build` 通过。
- `corepack pnpm test`：51 个用例通过。
- `curl` 检查 `output/editor.html` 弹窗内仍包含 73 个版式选项，`jquery.scrollbar` 引用数为 0，`lp-custom-scrollbar` 样式存在。

### 2026-07-23（Dashi 模式主题扩展：阶段一基础设施）

### 已完成

- **方案文档**
  - 保存 [`docs/plans/dashi-style-theme-evolution-plan.md`](docs/plans/dashi-style-theme-evolution-plan.md)，明确走向 Dashi 模式所需的基础设施、实施阶段、成本与红线。

- **Props Schema 类型**
  - 在 [`packages/core/src/types.ts`](packages/core/src/types.ts) 中新增：
    - `PropsFieldType` 联合类型
    - `PropsField` 字段定义（支持 text/textarea/number/boolean/select/image/color/array/object）
    - `PropsSchema` 版式 Schema
  - 扩展 `LayoutMeta`，新增 `tags` 和 `contentShape` 字段供 Agent 选页使用。

- **Registry 改造**
  - 在 [`packages/templates/src/registry.tsx`](packages/templates/src/registry.tsx) 中：
    - `RegisteredLayout` 接口新增可选 `schema?: PropsSchema`
    - 新增 `getLayoutSchema(id)` 查询函数

- **编辑器属性面板 schema 渲染**
  - 在 [`packages/renderer/src/render.tsx`](packages/renderer/src/render.tsx) 的 `buildEditorScriptMarkup` 中注入 `window.__lemonPPT_layoutSchemas`。
  - 在 [`packages/renderer/src/editor-script.ts`](packages/renderer/src/editor-script.ts) 中：
    - 读取 `window.__lemonPPT_layoutSchemas`
    - 新增 `createColorField`、`createSchemaFieldControl`、`createSchemaArraySection`、`renderSchemaFields` 等函数
    - `renderSlidePanel` 优先按 schema 渲染属性面板，无 schema 时回退到 legacy 通用推断

### 验证
- `corepack pnpm -r build` 通过。
- `corepack pnpm test`：8 个测试文件 / 51 个用例通过。
- `corepack pnpm audit:layouts`：64 / 64 版式覆盖。
- 当前未为任何版式注册 schema，编辑器仍使用 legacy 通用推断，行为与之前一致。

### 2026-07-23（Dashi 模式主题扩展：阶段二 theme01 Schema 迁移）

### 已完成

- **为 theme01 全部 63 个版式组件生成 Props Schema**
  - 在每个 [`packages/templates/src/themes/theme01/*.tsx`](packages/templates/src/themes/theme01) 组件中新增 `theme01XxxSchema: PropsSchema` 导出。
  - Schema 覆盖每个版式的全部 props 字段（跳过 `_slideIdx`、`_editable`、索引签名）。
  - 常见字段按语义推断类型：
    - `image`/`imageUrl`/`url`/`logoUrl`/`avatarUrl` → `image`
    - `description`/`bio`/`quote`/`subtitle` → `textarea`
    - `type`（bar/line/pie） → `select`
    - `status` → `select`
    - `number` → `number`，`boolean` → `boolean`
    - `string[]` → `array` of text
    - `number[]` → `array` of number
    - `Array<{...}>` → `array` of object，并递归生成 itemSchema

- **Registry 注册时传入 schema**
  - 在 [`packages/templates/src/registry.tsx`](packages/templates/src/registry.tsx) 中：
    - 每个 theme01 组件的 import 新增 schema 导入。
    - 每个 `registerLayout` 调用新增 `schema: theme01XxxSchema`。
  - 所有 64 个注册版式均已附带 schema。

- **编辑器验证**
  - 重新生成 `output/editor.html`。
  - 确认 `window.__lemonPPT_layoutSchemas` 已注入且包含 `theme01_cover_v1` 等版式 schema。

### 验证
- `corepack pnpm -r build` 通过。
- `corepack pnpm test`：8 个测试文件 / 51 个用例通过。
- `corepack pnpm audit:layouts`：64 / 64 版式覆盖。
- `corepack pnpm render:editor` 成功生成 `output/editor.html`。

### 后续可优化
- 部分版式的 schema 是自动生成的最小实现，以下字段可后续精修：
  - `table-v1` 的 `rows` 是 `string[][]`，当前退化为 text array，需支持二维表格编辑。
  - 一些未收录在中文标签映射中的字段名（如 `image`、`highlightFirstColumn`）显示为原字段名。
  - 复杂图表（treemap、sunburst、gauge 等）的内部 `data` 结构可进一步细化 itemSchema。
