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

### 待完成

- [ ] 在 Claude/Codex/Cursor 中实测 SKILL.md 效果并收集反馈
- [x] 为旧版 `minimal_xxx_v1` layout ID 增加向后兼容映射
- [x] 将 `packages/templates/src/minimal/` 目录重命名为 `base/`（并同步 import 路径与 README）
- [x] 补充 README 中 `npx @lemonppt/cli` 的使用方式
- [ ] 考虑创建独立 `@lemonppt/skill` 包或继续用 CLI 内置安装器
- [ ] 规划 Phase 4：版式/主题规模化与社区贡献机制

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
  - `POST /api/render`：生成 `output/index.html` 并复制 `minimal.css`
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
