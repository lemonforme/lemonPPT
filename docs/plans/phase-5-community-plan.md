# Phase 5：社区开放与发布准备

> 本文档为内部规划，不上传公开。

## 目标

在正式接受外部贡献、发布推广之前，把 lemonPPT 打磨到 **可安装、可验证、可协作** 的状态：

1. 法律与治理流程闭环（CLA、贡献指南、行为准则）。
2. 所有版式在 HTML 预览、PPTX 导出、PDF 导出三条路径上保持一致且可用。
3. SKILL.md 在真实 Agent 平台（Claude / Codex / Cursor）经过验证并迭代。
4. npm 包与 GitHub 仓库的发布/CI 流程自动化。

---

## 当前状态（截至 2026-07-20）

- ✅ 50 个共享版式 + 5 个主题专属变体 × 3 套主题
- ✅ PPTX 导出主题化（55/55 覆盖）
- ✅ Gallery + 视觉回归快照
- ✅ 本地 Agent smoke test（Trae）通过 5/6 用例
- ✅ 版式导出完整性审计（55/55 覆盖）
- ✅ CLA / 贡献指南 / 行为准则 / Issue / PR 模板
- ⏳ CLA 检查 workflow 待推送（需 `workflow` scope token）
- ⏸️ 外部 Agent 实测（无环境）
- ⏸️ npm 包未随最新改动重新发布
- ⏸️ CI / GitHub Actions（未开始）
- ⏸️ Skill 包架构决策（CLI 内置 vs 独立 `@lemonppt/skill`）

---

## 重点任务

### P0：法律与治理

| 任务 | 说明 | 产出文件 | 状态 |
|---|---|---|---|
| 贡献者许可协议 | 明确版权与专利授权 | `CLA.md` | ✅ |
| 贡献指南 | 明确 Issue/PR 模板、代码规范、版式开发流程 | `CONTRIBUTING.md` | ✅ |
| 行为准则 | 社区行为规范 | `CODE_OF_CONDUCT.md` | ✅ |
| Issue/PR 模板 | 引导用户提交有效反馈 | `.github/ISSUE_TEMPLATE/*.md`、`.github/pull_request_template.md` | ✅ |
| CLA 检查 workflow | PR 描述中必须勾选 CLA | `.github/workflows/cla.yml` | ⏳ 需带 `workflow` scope 的 token 推送 |

**约束**：CLA workflow 推送前，外部 PR 仍需人工检查 CLA 勾选。

### P0：版式导出完整性审计

- 检查 `packages/renderer/src/export-pptx.ts` 中 `renderSlideToPptx` 的 `switch` 是否覆盖所有 `listLayouts()` 返回的版式。
- 对未覆盖的版式补充 render 函数；对已覆盖的版式检查主题颜色/字体一致性。
- 脚本化审计：在 `scripts/audit-layouts.mjs` 中对比 `listLayouts()` 与 export-pptx 的 case 列表，输出缺失项。

### P0：外部 Agent 实测与 SKILL.md 迭代

- 在 Claude Code / Claude Desktop / Codex CLI / Cursor 中安装 `packages/cli/SKILL.md`。
- 运行 `docs/agent-testing-checklist.md` 中的 6 个用例，记录真实 Agent 行为偏差。
- 根据反馈迭代 SKILL.md，重点优化：
  - Agent 追问信息的时机与格式。
  - `--theme`、`--language`、`--pages` 参数传递示例。
  - 失败时的错误处理说明。

### P1：npm 发布

- 更新各 workspace 版本号到 `0.1.7`。
- 准备 granular access token（`@lemonppt` scope 读写 + 绕过 2FA）。
- 执行 `corepack pnpm -r publish`。
- 发布后验证 `npx @lemonppt/cli generate ...` 可用。

### P1：Skill 包架构决策

- 对比 Dashi PPT 的独立 skill 包形态与当前 CLI 内置 `install-skill` 方案。
- 决策：继续 CLI 内置，或拆分独立 `@lemonppt/skill` 包（含 `SKILL.md` + `install.mjs`）。
- 如拆分，需确保与 CLI 安装器并存且不重复维护 SKILL.md。

### P1：GitHub Actions CI

- 工作流 `ci.yml`：build / test / lint / typecheck。
- 工作流 `regression.yml`：gallery + snapshot，将快照作为 artifact 上传（不提交到仓库）。
- 工作流 `agent-smoke.yml`：运行 `pnpm agent:test`。

### P1：视觉回归 diff 工具

- 在 `scripts/snapshot.mjs` 基础上增加基线对比：
  - 读取 `output/snapshots/<theme>/<layout>.png` 与 `output/snapshots/baseline/...`。
  - 使用像素差生成 diff 图。
  - 在 CI 中失败时上传 diff artifact。

### P2：文档与推广

- 重写 README：快速开始、安装方式、主题与版式列表、协议声明。
- 制作 1~2 个示例 PPTX 放在 release asset 或 `examples/`。
- 可选：GitHub Pages 展示 gallery。

### P2：继续补充高价值版式（按需）

在用户反馈或 Agent 实测中发现高频缺失场景时再补充，例如：

- 产品截图 + 说明的 `showcase_v1`
- 多层级目录的 `toc_v2`
- 更复杂的 `chart_v3`（混合图表）

**约束**：暂不新增主题，聚焦版式与 Agent 体验。

---

## 里程碑

| 阶段 | 标志 | 完成后动作 |
|---|---|---|
| 5.1 闭环 | CLA + 贡献指南 + 行为准则 + Issue/PR 模板合并 | 可接受外部 Issue，PR 需勾选 CLA |
| 5.2 稳定 | 所有版式导出审计通过 + CI 绿 | 发布 `0.1.7` |
| 5.3 验证 | 外部 Agent 实测 ≥2 个平台通过用例 1/2/3 | 迭代 SKILL.md 并发布 `0.1.8` |
| 5.4 开放 | 治理文档 + 外部实测 + CI + CLA workflow 全部就绪 | 正式宣布接受外部 PR |

---

## 验收标准

- [ ] `corepack pnpm -r build && corepack pnpm test && corepack pnpm agent:test` 全部通过。
- [ ] `scripts/audit-layouts.mjs` 输出缺失版式为 0。
- [ ] CLA 流程可在线签署或 PR 检查清单可执行。
- [ ] 至少在 2 个外部 Agent 平台完成用例 1/2/3。
- [ ] npm `@lemonppt/cli` 可直接安装并使用。
- [ ] CI 在 push/PR 时自动运行并通过。

---

## 风险与依赖

| 风险 | 影响 | 缓解 |
|---|---|---|
| 无 Claude/Codex/Cursor 环境 | 外部 Agent 实测无法进行 | 优先完成本地 smoke test 与文档；后续借账号或邀请社区测试 |
| npm token 权限不足 | 无法发布 | 提前按 memory 要求申请 granular token |
| 版式导出覆盖不全 | PPTX 生成失败 | 增加审计脚本，发布前必须清零 |
| AGPL-3.0 理解门槛 | 外部贡献者犹豫 | 在 CONTRIBUTING.md 中用中文/英文解释核心义务 |
