# Skill 分发形态决策记录

> 日期：2026-07-21
> 状态：已决策

## 背景

lemonPPT 需要让 AI Agent（Claude / Codex / Cursor）能够理解和调用项目能力。当前实现是 CLI 内置 `install-skill` 命令，将 `SKILL.md` 安装到各 Agent 的 skill 目录。

## 备选方案

### 方案 A：继续 CLI 内置（当前方案）

- `npx @lemonppt/cli install-skill` 安装 `SKILL.md`。
- `SKILL.md` 随 CLI 包一起发布，版本与 CLI 保持一致。

**优点**：
- 维护简单，只需维护一份 `SKILL.md`。
- 用户心智统一：所有 lemonPPT 能力通过 `@lemonppt/cli` 入口获取。
- 已验证可用：`npx @lemonppt/cli@0.1.8 install-skill --claude --dry-run` 成功。

**缺点**：
- 某些 Agent 平台可能期望独立的 skill 包结构。
- 如果未来 skill 协议变得复杂，CLI 包会变大。

### 方案 B：新建独立 `@lemonppt/skill` 包

- 独立包结构：
  ```
  packages/skill/
  ├── package.json
  ├── install.mjs          # npx @lemonppt/skill 入口
  └── skill/
      ├── SKILL.md
      └── scripts/
  ```
- 用户通过 `npx @lemonppt/skill` 安装 skill。

**优点**：
- 更接近 Dashi PPT 等独立 skill 包形态。
- 某些 Agent 平台可能更偏好独立包。

**缺点**：
- 需要多维护一个包和发布流程。
- 会出现 CLI 安装器与独立包安装器并存的问题，除非废弃 CLI 安装器。
- 当前 `SKILL.md` 内容不依赖独立包的额外脚本，拆分收益有限。

## 决策

**选择方案 A：继续 CLI 内置 `install-skill`**。

理由：
1. 当前 CLI 内置方案已经跑通，实测可用。
2. `SKILL.md` 与 CLI 版本同步，避免版本碎片化。
3. 独立 skill 包在当前阶段属于过度设计；如果未来 Agent 生态对独立包有强需求，可以再拆分，且 skill 内容可直接复用。

## 后续行动

- 保持 `packages/cli/SKILL.md` 为唯一 skill 来源。
- 在 `README.md` 中继续推荐 `npx @lemonppt/cli install-skill`。
- 若未来出现以下信号，重新评估方案 B：
  - 主流 Agent 平台不再支持从 CLI 安装 skill；
  - `SKILL.md` 需要附带大量独立脚本或配置，导致 CLI 包膨胀；
  - 社区明确反馈需要独立 skill 包。
