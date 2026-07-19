# lemonPPT 下一步行动分析报告

> 基于当前进度与 docs/ 规划文档，分析各下一步选项的收益、成本与风险，供决策。
> 日期：2026-07-20

---

## 一、当前状态概览

| 维度 | 状态 |
|---|---|
| **npm 发布** | 8 个包已发布到 `0.1.3`，`npx @lemonppt/cli@0.1.3` 可正常使用 |
| **Skill 分发** | CLI 内置 `install-skill` 已支持 Claude/Codex/Cursor，`SKILL.md` 已迭代两版 |
| **布局/主题解耦** | 完成，`minimal` → `base`，旧 ID 有兼容映射 |
| **Agent 实测** | 已在本环境完成两轮测试，发现并修复标题截断、fallback 内容泛化问题 |
| **核心功能** | generate → render → export（PPTX/PDF/HTML）全链路可用 |
| **编辑器** | 浏览器端可编辑、换图、主题切换、撤销重做、导出 |
| **测试** | 47 个单元测试通过 |

**关键结论**：MVP + npm + Skill 分发的基础建设已基本完成，接下来进入**规模化与生态建设阶段**。

---

## 二、待决策事项

从 `docs/progress.md` 中提取的未完成任务：

1. 在 Claude/Codex/Cursor 中实测 SKILL.md 效果并收集反馈
2. 考虑创建独立 `@lemonppt/skill` 包或继续用 CLI 内置安装器
3. 规划 Phase 4：版式/主题规模化与社区贡献机制

---

## 三、选项分析

### 选项 A：启动 Phase 4 规模化

**目标**：让新增版式、主题和社区贡献变得工业化、可持续。

**具体工作**：

| 子任务 | 说明 | 预估工作量 |
|---|---|---|
| 版式开发脚手架 | 新增 `pnpm create-layout <role> <name>` 或脚本，自动生成组件、注册、PPTX 映射、测试模板 | 1 天 |
| 主题开发模板 | 新增 `pnpm create-theme <id>`，生成 token + CSS + 示例 goal | 0.5 天 |
| 验证现有 30 个版式跨主题兼容性 | 确保 `base` / `dark-tech` / `warm-business` 都能正常渲染 | 1 天 |
| 补充高价值版式 | 如 `timeline_v2`、`roadmap_v2`、`testimonial_v2`、`pricing_v2` 等 | 2-3 天 |
| 编写 `CONTRIBUTING.md` | 版式/主题/文档贡献规范 | 0.5 天 |
| 建立 issue/PR 模板 | 社区化基础设施 | 0.5 天 |

**收益**：
- 解决 `theme-strategy.md` 中提到的"每新增主题要重做 30 个布局"的隐患
- 为开源和社区贡献做准备
- 提升产品长期竞争力

**风险**：
- 需要持续投入设计/前端资源
- 版式质量管控成本上升

**适合**：想把 lemonPPT 做成长期开源项目、接受社区贡献。

---

### 选项 B：先决策 Skill 包架构

**目标**：确定 Skill 分发形态：继续 CLI 内置，还是独立 `@lemonppt/skill` 包。

**两种子方案**：

#### B1：继续 CLI 内置（当前方案）

- `npx @lemonppt/cli install-skill` 安装 `SKILL.md`
- 优势：维护简单、与 CLI 版本同步、用户心智统一
- 劣势：某些 Agent 平台可能期望独立的 skill 包结构

#### B2：新建独立 `@lemonppt/skill` 包

- 结构参考 `docs/plans/skill-distribution.md` 中的 MVP：
  ```
  packages/skill/
  ├── package.json
  ├── install.mjs          # npx @lemonppt/skill 入口
  └── skill/
      ├── SKILL.md
      └── scripts/
  ```
- 优势：更接近 Dashi 形态，某些平台兼容性更好
- 劣势：多一个包要发布和维护，需要决定 install.mjs 和 CLI 安装器是否并存

**收益**：
- 明确长期分发形态
- 避免未来返工

**风险**：
- 独立包如果没人用，就是维护负担
- CLI 内置方案已经能跑通主流 Agent

**适合**：想先把 Agent 分发这件事做"标准"，再进入规模化。

---

### 选项 C：继续 Agent 实测优化

**目标**：在真实的 Claude / Codex / Cursor 环境中跑多轮测试，继续打磨 SKILL.md 和 fallback。

**具体工作**：

| 子任务 | 说明 | 预估工作量 |
|---|---|---|
| 在 Claude Desktop / Claude Code 实测 | 验证 skill 安装后 Agent 是否正确调用命令 | 0.5-1 天 |
| 在 Codex CLI 实测 | 验证 Codex 对 SKILL.md 的理解 | 0.5 天 |
| 在 Cursor Agent 实测 | 验证 Cursor 的 agent 模式是否能执行 | 0.5 天 |
| 收集失败案例 | 记录 Agent 误解、命令错误、路径问题 | 持续 |
| 迭代 SKILL.md | 根据真实反馈继续优化 prompt 和示例 | 0.5-1 天 |

**收益**：
- 直接提升用户体验
- 发现 CLI/Skill 协议中隐藏的问题

**风险**：
- 需要用户实际使用这些 Agent
- 反馈周期较长，可能陷入反复微调

**适合**：认为当前 Agent 体验还不够稳定，想再打磨一轮。

---

## 四、综合评估

| 评估维度 | 选项 A Phase 4 | 选项 B Skill 架构 | 选项 C Agent 实测 |
|---|---|---|---|
| 战略价值 | 高 | 中 | 中 |
| 短期用户价值 | 中 | 中 | 高 |
| 可执行性 | 高 | 高 | 中（依赖外部 Agent） |
| 与当前进度衔接 | 自然延伸 | 决策性节点 | 继续迭代 |
| 风险 | 质量管控 | 过度设计 | 反馈不确定 |

---

## 五、推荐意见

**首选：选项 A（启动 Phase 4 规模化）**，理由：

1. 当前 npm + Skill 分发已可用，0.1.3 的 fallback 也已修复到可用水平，继续微调 SKILL.md 的边际收益递减。
2. `theme-strategy.md` 明确警告：如果每新增一个主题都要重做 30 个布局，工作量不可持续。Phase 4 的工业化脚手架能解决这个问题。
3. Phase 4 的 CONTRIBUTING.md 和模板能自然带动选项 C（Agent 实测可以由社区反馈补充）。
4. 选项 B（独立 skill 包）可以在 Phase 4 中作为"分发形态"的一个子任务快速决策，不必单独作为一个大阶段。

**建议的 Phase 4 启动顺序**：

1. 先做 **Skill 包架构决策**（半天）：决定继续 CLI 内置 or 加独立包，写进 `docs/decisions/skill-distribution.md`
2. 再做 **版式/主题脚手架**（1-1.5 天）
3. 再补 **2-3 个高价值版式**作为脚手架验证（1-2 天）
4. 最后写 **CONTRIBUTING.md** 和 issue 模板（0.5 天）

如果更担心 Agent 体验，可以把第 1 步改为**在 Claude/Codex/Cursor 中跑一轮实测**，但建议控制在 1 天内，避免无限打磨。

---

## 六、决策点

请选择：

- **A**：启动 Phase 4（我会先做 Skill 架构决策，再做脚手架）
- **B**：先做独立 `@lemonppt/skill` 包评估与实现
- **C**：继续在真实 Agent 中实测并优化 SKILL.md
