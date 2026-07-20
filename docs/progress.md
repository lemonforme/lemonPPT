# lemonPPT 项目进度

> 记录迁移清理、MVP 功能开发与验证状态。
> 最新更新：2026-07-20

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
- [ ] 在 Claude/Codex/Cursor 中实测 SKILL.md 效果并收集反馈（当前无环境，暂缓）
- [x] 优化 fallback 内容，让无 API Key 生成的 PPT 更贴合主题
- [x] 统一 `base` 主题字号/间距/卡片视觉规范
- [x] PPTX 导出读取 `goal.theme` 并按主题配色/字体
- [x] 视觉回归：基于 gallery 生成快照，防止后续修改破坏既有版式
- [ ] ~~继续用新主题/版式脚手架补充更多版式~~（当前 5 个补充版式已完成）
- [ ] ~~新增 1 套主题验证主题系统可扩展性~~（已暂停：当前不新增主题）
- [ ] 正式开放社区贡献前完成 CLA 流程
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
