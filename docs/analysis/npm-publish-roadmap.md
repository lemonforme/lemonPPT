# lemonPPT npm 发布与后续路线图

> 基于 `lemonPPT-skill-distribution-plan.md`、`lemonPPT-theme-strategy.md` 与当前项目进度整理的执行方案。
> 更新日期：2026-07-19

---

## 一、两份方案与当前代码的对比

### 1.1 定位差异

| 文件 | 解决什么问题 | 核心产出 |
|------|-------------|---------|
| `lemonPPT-theme-strategy.md` | 视觉系统怎么扩展 | Token 化主题、布局/主题解耦、工业化新增主题的路径 |
| `lemonPPT-skill-distribution-plan.md` | 怎么让用户/AI Agent 用上 | `npx lemonppt@latest` 安装器、SKILL.md 协议、Agent 技能目录 |

两者是**互补关系**：主题方案管"里面长什么样"，Skill 分发方案管"外面怎么用"。

### 1.2 当前代码进度对照

| 能力 | 主题策略要求 | Skill 分发要求 | 当前状态 |
|------|-------------|---------------|---------|
| 主题 Token 系统 | 必须有 | 间接需要 | 已完成：`packages/themes/src/*/tokens.ts` |
| 布局组件 | MVP 5-8 个 | 越多越好 | 已完成：30 个布局，22 个 role |
| 布局/主题解耦 | 必须解耦 | 希望解耦 | 已完成：`theme` 改为 `'base'`，layout ID 去掉 `minimal_` 前缀，目录重命名为 `base/` |
| role→layout | 需要 | 需要 | 已完成：`packages/composer` |
| PPTX 导出映射 | 需要 | 需要 | 已完成：30 个 layout 全部映射 |
| CLI 工具 | 脚本调用 | 核心入口 | 已完成：`@lemonppt/cli` |
| SKILL.md | 不需要 | 核心协议 | 已存在并随 `@lemonppt/cli` 发布 |
| install-skill | 不需要 | 核心 | 已完成：`lemonppt install-skill` 支持 Claude/Codex/Cursor |
| npm 发布 | 不需要 | 核心 | 已完成：8 个包已发布到 npm |
| 开源协议 | MIT/Apache-2.0 | MIT/Apache-2.0 | 已添加 MIT LICENSE |

### 1.3 关键发现

**发现 1：当前进度已大幅超出两份文件的 MVP**
- 主题策略建议先做 1 个主题 + 5-8 个布局，当前已有 3 个主题 + 30 个布局。
- 但这也带来隐患：如果每新增一个主题都要重做 30 个布局变体，工作量不可持续。

**发现 2：布局与主题命名已解耦**
- layout meta 的 `theme` 已改为 `'base'`，表示通用版式。
- layout ID 已去掉 `minimal_` 前缀（如 `cover_v1`）。
- 目录已从 `packages/templates/src/minimal/` 重命名为 `packages/templates/src/base/`。
- 为兼容旧 `goal.json`，在 `@lemonppt/core` 中增加了 `normalizeDeckGoal`，自动把 `minimal_xxx_v1` 映射为 `xxx_v1`、`minimal` 主题映射为 `base`。

**发现 3：Skill 分发已打通**
- `SKILL.md` 已随 `@lemonppt/cli` 发布包分发。
- `lemonppt install-skill` 命令支持安装到 Claude/Codex/Cursor 技能目录。
- `scripts/install.mjs` 保留作为本地兼容入口。

**发现 4：许可证风险已被规避**
- 主题策略明确警告不要抄袭 Dashi 的 theme01~theme12。
- 当前 3 个主题都是原创 token + 原创 CSS，没有 AGPL 污染风险。

---

## 二、风险等级评估

| 风险 | 等级 | 说明 |
|------|------|------|
| 布局命名与主题绑定 | 已解决 | 命名已解耦，旧 ID 有兼容映射 |
| Skill 分发安装器 | 已解决 | `lemonppt install-skill` 已可用 |
| npm 发布 | 已解决 | 8 个包已发布到 npm，当前版本 0.1.2 |
| Agent 实测反馈 | 已收集并迭代 | SKILL.md 已根据 0.1.1 实测反馈更新到 0.1.2 |

---

## 三、详细执行方案

> **状态更新（2026-07-20）**：阶段 A、B、C 已全部完成。下文保留原始执行步骤供复盘，后续重点进入 Agent 实测与 Phase 4 规模化。

### 阶段 A：发布 npm（已完成）

**目标**：让外部用户今天就能 `npm i -g @lemonppt/cli` 使用。

**具体步骤**：

1. **确认 npm 账号与 scope**
   - 确认拥有 `@lemonppt` scope 的发布权限
   - 如果没有，访问 https://www.npmjs.com 创建组织

2. **登录 npm**
   ```bash
   corepack pnpm login
   ```

3. **执行发布**
   ```bash
   corepack pnpm publish:packages
   ```
   这会按依赖顺序发布 8 个包：
   - `@lemonppt/core`
   - `@lemonppt/view-model`
   - `@lemonppt/themes`
   - `@lemonppt/templates`
   - `@lemonppt/composer`
   - `@lemonppt/renderer`
   - `@lemonppt/agent-prompts`
   - `@lemonppt/cli`

4. **验证安装**
   ```bash
   npm i -g @lemonppt/cli
   lemonppt generate "测试" --pages 5 --out /tmp/test.json
   lemonppt export /tmp/test.json --pptx /tmp/test.pptx
   ```

**阶段 A 完成后即可对外宣布 lemonPPT CLI 可用。**

---

### 阶段 B：修复 Skill 分发安装器（1-2 天）

**目标**：让 AI Agent 可以通过 `npx @lemonppt/cli install-skill` 或单独 skill 包完成安装。

#### 方案 B1（推荐）：把 skill 安装并入 CLI

新增 `lemonppt install-skill` 子命令，逻辑从 `scripts/install.mjs` 迁移到 `packages/cli/src/cli.ts`。

**改动清单**：
- `packages/cli/src/cli.ts`：新增 `install-skill` 命令解析
- 新建 `packages/cli/src/install-skill.ts`：从 `scripts/install.mjs` 迁移逻辑
- 修改路径解析：
  - `SKILL.md` 通过 `import.meta.resolve('@lemonppt/agent-prompts/SKILL.md')` 或类似方式定位
  - 或者把 SKILL.md 打包进 `@lemonppt/cli` 的 files 字段
- 删除或保留 `scripts/install.mjs` 作为兼容入口

**用户侧体验**：
```bash
npx @lemonppt/cli install-skill
# 自动安装到 ~/.claude/skills/lemonppt/、~/.codex/skills/lemonppt/ 等
```

#### 方案 B2：新建独立的 `@lemonppt/skill` 包

更贴近 Dashi 的结构：

```text
packages/skill/
├── package.json
├── install.mjs          # npx @lemonppt/skill 入口
├── skill/
│   ├── SKILL.md
│   └── scripts/
│       └── render.sh    # 调用 @lemonppt/cli
```

**改动清单**：
- 新建 `packages/skill/`
- 移动 `SKILL.md` 到 `packages/skill/skill/SKILL.md`
- 重写 `install.mjs` 使用 `import.meta.resolve` 定位自身包路径
- 发布 `@lemonppt/skill`

**用户侧体验**：
```bash
npx @lemonppt/skill@latest
```

**推荐选择**：
- 如果用户主要用 CLI → 选 **B1**
- 如果完全对标 Dashi 的 skill 分发模式 → 选 **B2**

---

### 阶段 C：解耦布局与主题命名（2-3 天）

**目标**：消除布局命名与 minimal 主题的绑定，让未来新增主题变体不冲突。

**具体步骤**：

1. **修改 layout meta**
   把所有 30 个布局的：
   ```ts
   theme: 'minimal'
   id: 'minimal_cover_v1'
   ```
   改为：
   ```ts
   theme: 'base'        // 或 'universal'
   id: 'cover_v1'
   ```

2. **修改 composer 的角色映射**
   `packages/composer/src/index.ts` 里的 `ROLE_LAYOUT_CANDIDATES` 需要同步更新 ID。

3. **修改 export-pptx 的 switch case**
   `packages/renderer/src/export-pptx.ts` 里的所有 `case 'minimal_xxx_v1'` 需要同步更新。

4. **修改 SKILL.md**
   `SKILL.md` 里的可用版式列表需要更新。

5. **修改测试文件**
   更新 registry test、composer test 等里引用旧 ID 的地方。

6. **目录结构调整（可选）**
   可以把 `packages/templates/src/minimal/` 重命名为 `packages/templates/src/base/`，但这一步会牵动大量 import 路径，建议分两步做。

**阶段 C 的风险**：这是一次**破坏性变更**，所有现有 goal.json 里的 `layout` 字段都会失效。  
**缓解措施**：
- 在 composer 里保留旧 ID 的别名映射一段时间
- 或者等阶段 A/B 完成、外部反馈稳定后再做

---

## 四、需要决策的问题

### 决策 1：先发布 npm，还是先做 skill 分发？
- **先发布 npm**：更快让外部开发者用到，但 Agent 一键安装体验还没好。
- **先做 skill 分发**：Agent 体验更完整，但会延迟 1-2 天发布。

**建议：先发布 npm**。因为 skill 分发最终也要依赖 npm 包，发布是基础。

### 决策 2：Skill 安装器选 B1 还是 B2？
- **B1（并入 CLI）**：更简洁，用户只需要装一个包。
- **B2（独立 skill 包）**：更接近 Dashi，未来扩展性更好。

### 决策 3：阶段 C 的命名重构现在做，还是等发布后再做？
- **现在做**：避免技术债累积，但会延迟发布 2-3 天，且是破坏性变更。
- **发布后再做**：先拿到用户反馈，但未来重构成本更高。

**建议：发布后再做**。当前命名虽然有误导性，但功能完全正常，不影响 npm 发布和 Agent 调用。

---

## 五、推荐执行顺序

1. **今天就发布 npm**（阶段 A）
2. **本周内完成 skill 安装器**（阶段 B，推荐 B1 并入 CLI）
3. **下周再做布局命名解耦**（阶段 C）

这样可以在 1-2 天内让外部用户真正用上 lemonPPT，同时逐步消除技术债。
