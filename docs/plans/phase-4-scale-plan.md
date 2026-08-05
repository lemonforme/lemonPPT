# lemonPPT Phase 4 规模化建设规划

> 本文档为项目内部规划文件，保存在 `docs/` 目录下，不对外公开上传。
> 规划背景：v0.1.6 已完成 MIT → AGPL-3.0 协议切换并发布，接下来进入版式/主题工业化与生态建设阶段。

---

## 一、阶段目标

让 lemonPPT 从“能跑通”进入“可持续扩展”：

1. **版式生产工业化**：新增一个版式的时间从半天缩短到 30 分钟以内。
2. **主题扩展低成本化**：新增一套主题不需要重写 30 个版式，只需定义 token + 重写关键样式。
3. **社区贡献可接入**：在 CLA 准备好之前，先通过 Issue/Discussion 收集需求与反馈。
4. **Agent 体验稳定**：在 Claude / Codex / Cursor 中实测 SKILL.md，确保主流 Agent 能稳定调用。

---

## 二、优先级排序

| 优先级 | 任务 | 理由 |
|---|---|---|
| P0 | 完善版式/主题脚手架 | ✅ 已完成：`create-layout.mjs` 自动注册、导出占位、SPDX 头 |
| P0 | 补充 4~6 个高价值版式 | ✅ 已完成：`timeline_v2`、`roadmap_v2`、`pricing_v2`、`feature_v2`、`team_v2`、`metric_v3` |
| P1 | 新增 1 套原创主题 | ⏸️ 已暂停：当前聚焦版式扩展与 Agent 体验，暂不新增主题 |
| P1 | 建立版式预览/回归机制 | ✅ 已完成：`scripts/gallery.mjs` 生成 39 版式 × 3 主题预览页 |
| P1 | Agent 实测与 SKILL.md 迭代 | 直接影响用户获取和口碑 |
| P2 | 社区基础设施（Issue 模板、CLA 准备） | 为正式开放外部 PR 做准备 |

---

## 三、具体任务

### 3.1 完善版式脚手架 `scripts/create-layout.mjs`

✅ 已完成：

- [x] 自动生成 PPTX 导出映射的占位函数（在 `packages/renderer/src/export-pptx.ts` 中插入 `renderXxx`）
- [x] 自动在 `packages/templates/src/index.ts` 和 `registry.tsx` 中注册新版式
- [x] 自动在 `packages/composer/src/index.ts` 的候选列表中按 role 插入
- [x] 生成的文件自动包含 SPDX 协议头
- [x] 生成后打印“下一步检查清单”，提示开发者补充 CSS 和 PPTX 映射

验收标准：运行一次脚本后，开发者只需补充样式和导出细节即可跑通测试。

### 3.2 完善主题脚手架 `scripts/create-theme.mjs`

- [ ] 生成主题 token 文件、CSS 文件、目录结构
- [ ] 自动在 `packages/themes/src/index.ts` 注册
- [ ] 生成一个包含所有版式的示例 `goal.json`，方便快速预览
- [ ] 生成后提示：需为关键版式补充主题专属样式

### 3.3 补充高价值版式（验证脚手架）

基于现有 30 个版式，优先补充以下角色：

| 版式 | 角色 | 价值 | 状态 |
|---|---|---|---|
| `timeline_v2` | timeline | 横向/纵向时间轴，适合产品迭代、公司历程 | ✅ 已完成 |
| `roadmap_v2` | roadmap | 季度/年度路线图，带状态标签 | ✅ 已完成 |
| `pricing_v2` | pricing | 三/四列价格对比，适合 SaaS 定价页 | ✅ 已完成 |
| `feature_v2` | feature | 三列特性卡片，带图标和说明 | ✅ 已完成 |
| `team_v2` | team | 团队介绍墙，支持头像和职位 | ✅ 已完成 |
| `metric_v3` | metric | 双指标对比，强调增长率 | ✅ 已完成 |

每个新版式需完成：组件、测试、注册、PPTX 导出、三套主题 CSS、SKILL.md 更新。

### 3.4 新增 1 套原创主题（已暂停）

> 2026-07-20 决策：当前阶段不新增主题，优先完成版式扩展和 Agent 体验稳定。主题扩展机制已通过 `scripts/create-theme.mjs` 和三套现有主题得到验证，待后续需要时再启动。

候选方向（记录备用）：

- `elegant`：高级商务风，适合融资路演、咨询报告
- `neon`：霓虹科技风，适合开发者大会、产品发布
- `nature`：清新自然风，适合教育、环保、生活方式

### 3.5 建立版式预览与回归机制

当前状态：

- [x] 一个本地 dev 页面 `/gallery` 或脚本，渲染所有版式在所有主题下的静态 HTML — `scripts/gallery.mjs`
- [ ] 一个回归脚本：对每个版式 × 主题组合生成 HTML 快照，方便 diff
- [ ] 可选：引入 Storybook 单组件预览（成本较高，作为 P2 备选）

### 3.6 Agent 实测与 SKILL.md 迭代

- [ ] 在 Claude Code / Claude Desktop 安装 skill 并实测 3~5 个真实 prompt
- [ ] 在 Codex CLI 实测 `codex "帮我做一份 PPT"` 流程
- [ ] 在 Cursor Agent 模式实测
- [ ] 记录失败案例：Agent 误解、命令错误、路径问题、生成内容偏差
- [ ] 根据反馈迭代 `SKILL.md`，重点优化：
  - 主题/版式选择示例
  - 生成前信息收集 prompt
  - fallback 说明与边界情况

### 3.7 视觉与导出体验优化

根据 Agent 实测反馈，当前最大短板是“视觉效果较差”。本任务优先级上调：

- [x] **优化 fallback 内容**：基于输入提取关键词，动态选择新版式，避免固定写死数据
- [x] **统一 base 主题视觉规范**：调整 accent、卡片背景、幻灯片 subtle 渐变与顶部强调线
- [x] **修复新版式布局问题**：`team_v2` 提供 4 位默认成员填满网格、`pricing_v2` 高亮对比度已有白色覆盖
- [x] **PPTX 导出主题化**：按 `goal.theme` 选择配色和字体，中文使用合适字体
- [x] **视觉回归**：基于 gallery 生成快照，防止后续修改破坏既有版式
- [x] **本地 Agent smoke test**：在 Trae 中模拟 6 个 SKILL.md 用例并生成报告
- [ ] **外部 Agent 实测**：在 Claude / Codex / Cursor 中实测 SKILL.md 效果并收集反馈（暂缓）

### 3.8 社区基础设施

- [ ] 添加 `.github/ISSUE_TEMPLATE/bug_report.yml` 和 `feature_request.yml`
- [ ] 添加 `.github/PULL_REQUEST_TEMPLATE.md`（即使暂不接受 PR，也提前准备）
- [ ] 准备 CLA 模板（如 `docs/cla.md` 或 CLA-bot 配置），为开放 PR 做准备
- [ ] 在 README 中添加“路线图”或“已支持版式/主题”一览表

---

## 四、不做的事

为避免范围蔓延，本阶段明确不做：

- 不新建独立 `@lemonppt/skill` 包（已决策继续 CLI 内置）
- 不做复杂在线编辑器（浏览器端编辑器保持当前水平）
- 不做导出引擎重构（PPTX/PDF 保持当前 pptxgenjs + Playwright 方案）
- **用户侧统一主题**：当前 `theme01` 作为唯一用户可见主题，`base` 仅作为内部通用版式池；暂不新增其他用户主题

---

## 五、验收标准

Phase 4 阶段性完成时，应满足：

1. 运行 `node scripts/create-layout.mjs chart_v3` 后，30 分钟内可完成一个新版式并跑通测试。
2. 新增 1 套主题后，不需要修改任何版式组件的 TSX 代码，只需补充 CSS。
3. 在至少 2 个 Agent 平台（Claude / Codex / Cursor）中，skill 能稳定生成并导出 PPTX。
4. 版式总数达到 36+，主题数达到 4 套。
5. `pnpm test` 持续通过，新增版式/主题均有单元测试覆盖。

---

## 六、风险与应对

| 风险 | 影响 | 应对 |
|---|---|---|
| 新增版式质量下降 | 中 | 每版式必须有测试 + 至少 1 个 PPTX 导出验证 |
| 主题样式冲突 | 中 | 所有样式必须使用主题前缀或 CSS 变量，建立 gallery 回归 |
| Agent 实测反馈分散 | 低 | 统一使用 GitHub Issue 收集，定期归类迭代 SKILL.md |
| AGPL 引发用户顾虑 | 低 | README/LEGAL.md 已说明，必要时发 FAQ 文档 |

---

## 七、下一步立即执行项

如需立即启动，建议按以下顺序执行：

1. **优化 `scripts/create-layout.mjs`**：补齐自动注册、PPTX 占位、SPDX 头。
2. **新增 `timeline_v2`**：作为第一个“用新脚手架走完全流程”的版式。
3. **建立版式 gallery 预览脚本**：让后续所有新增版式能一键回归。
4. **在 Claude Code 实测一次完整流程**：生成、编辑、导出，记录问题。

---

*最后更新：2026-07-20*
