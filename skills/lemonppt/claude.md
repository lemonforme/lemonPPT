# Claude Code 安装 lemonPPT Skill

## 1. 安装 CLI

```bash
cd /path/to/lemonPPT
COREPACK_INTEGRITY_KEYS=0 corepack pnpm install
corepack pnpm -r build
```

或直接安装发布版本：

```bash
npm install -g @lemonppt/cli@0.2.0
```

## 2. 自动安装 Skill

```bash
lemonppt install-skill --claude
```

安装后文件位于 `~/.claude/skills/lemonppt/`：

- `SKILL.md`：完整使用协议
- `openai.yaml`：Skill 界面元数据与 tool 定义
- `assets/`：图标
- `scripts/lemonppt.sh` / `lemonppt.ps1`：包装脚本
- `scripts/*.mjs`：可直接 `node` 执行的 Agent Skill 风格脚本
- `package.json`：提供 `npm run layout:query` 等脚本

## 3. 在 Claude Code 中使用

Claude Code 会自动读取 `~/.claude/skills/lemonppt/SKILL.md` 中的指令。当用户要求生成 PPT 时，Claude 应：

1. 生成或构造 `goal.json`
2. 调用 `lemonppt validate-goal-spec ./goal.json`
3. 调用 `lemonppt render ./goal.json --out ./output`
4. 调用 `lemonppt validate-deck ./output --goal ./goal.json`
5. 调用 `lemonppt validate-copy ./goal.json ./output`
6. 如需导出：调用 `lemonppt export ./goal.json --pptx ./deck.pptx`

> 若从源码使用，wrapper 脚本会指向 `packages/cli/dist/cli.js`，无需发布到 npm。
