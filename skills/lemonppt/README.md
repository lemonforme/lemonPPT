# lemonPPT Skill

本目录是 lemonPPT 的 **Agent Skill 包**，可直接复制到常见 AI Agent 的技能目录中使用。

## 适用 Agent

- Claude Code：`~/.claude/skills/lemonppt/`
- OpenAI Codex CLI：`~/.codex/skills/lemonppt/`
- Cursor：`~/.cursor/skills/lemonppt/`

## 内容说明

- `SKILL.md`：完整使用协议
- `agents/openai.yaml`：Agent tool / prompt 元数据
- `assets/`：Skill 图标
- `references/`：版式角色与字段速查
- `scripts/`：包装脚本（Agent 可通过它们调用 `lemonppt` CLI）

## 快速使用

```bash
# 安装 lemonPPT CLI
npm install -g @lemonppt/cli@0.2.0

# 启动 API 服务
lemonppt serve --port 3456

# 然后让 Agent 通过 HTTP API 或 wrapper 脚本调用
```
