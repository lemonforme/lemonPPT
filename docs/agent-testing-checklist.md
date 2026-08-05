# Agent 实测清单

> 内部文档，用于在 Claude / Codex / Cursor 等 Agent 平台实测 `SKILL.md` 效果。
> 每次测试后记录结果，积累反馈用于迭代 `SKILL.md`。

## 测试状态

| 平台 | 状态 | 备注 |
|---|---|---|
| Trae 本地 smoke test | ✅ 通过 | 使用 `scripts/agent-test.mjs` 模拟 6 个用例 |
| Claude Code / Claude Desktop | ⏸️ 未开始 | 本地无环境 |
| Codex CLI | ⏸️ 未开始 | 本地无环境 |
| Cursor | ⏸️ 未开始 | 本地无环境 |

---

## 测试目标

验证 Agent 安装 lemonPPT skill 后，能否根据用户自然语言 prompt 正确：

1. 收集必要信息（目标、受众、页数、主题、语言）
2. 调用 `lemonppt generate` 生成 `goal.json`
3. 调用 `lemonppt render` 和/或 `lemonppt export` 输出文件
4. 向用户交付 PPTX/PDF/HTML 并说明内容来源

---

## 环境准备

- [ ] 已安装 Node.js 和 npm
- [ ] 已安装对应 Agent 客户端（Claude Code / Claude Desktop / Codex CLI / Cursor）
- [ ] 已执行 `npx @lemonppt/cli install-skill --<platform>` 或手动安装 `SKILL.md`
- [ ] 准备测试目录（建议使用空目录，避免文件混淆）

---

## 测试用例

### 用例 1：一句话主题（无 API Key）

**用户输入**：
```
帮我做一份 PPT
```

**预期 Agent 行为**：
- 追问演示目标、受众、页数、主题、语言
- 使用 `lemonppt generate` 生成 `goal.json`
- 使用 `lemonppt export` 导出 PPTX/PDF
- 告知用户当前使用内置 fallback 示例内容

**记录项**：
- Agent 是否正确追问？
- 最终生成的 `goal.json` 是否合法？
- `pageCount` 是否等于 `slides.length`？
- PPTX 是否能正常打开？

---

### 用例 2：详细主题（无 API Key）

**用户输入**：
```
帮我做一份 8 页的中文 PPT，主题是“面向企业客户的 AI 助手产品发布会”，强调效率提升 10 倍、支持私有化部署、已有 50 家客户，主题用 base
```

**预期 Agent 行为**：
- 无需追问或仅确认细节
- 直接调用 `lemonppt generate ... --pages 8 --theme base --language zh`
- 生成并导出文件

**记录项**：
- Agent 是否正确解析页数、主题、语言？
- 命令参数是否正确？
- 生成的内容是否贴合主题？

---

### 用例 3：指定输出 PDF

**用户输入**：
```
把刚才的 goal.json 导出成 PDF
```

**预期 Agent 行为**：
- 调用 `lemonppt export ./goal.json --pdf ./deck.pdf`
- 返回生成的 PDF 文件

**记录项**：
- Agent 是否找到当前目录的 `goal.json`？
- PDF 是否生成成功？

---

### 用例 4：切换主题

**用户输入**：
```
同样的内容，重新用 theme01 主题生成一次
```

**预期 Agent 行为**：
- 重新运行 `lemonppt generate` 并指定 `--theme theme01`
- 或修改 `goal.json` 中的 `theme` 字段后重新 render/export

**记录项**：
- Agent 是否正确使用 theme01 主题？
- 生成的 HTML/PPTX 是否应用 theme01 样式？

---

### 用例 5：仅使用 role、不指定 layout

**用户输入**：
```
把最后一页改成团队介绍页
```

**预期 Agent 行为**：
- 修改 `goal.json` 中对应 slide 的 `role` 为 `team`
- 不填写 `layout`，让系统自动选择 `team_v1` 或 `team_v2`

**记录项**：
- Agent 是否正确理解“不手动指定 layout”的规则？
- 系统是否自动分配合适版式？

---

### 用例 6：有 API Key（如条件允许）

**用户输入**：
```
用 OpenAI API Key 生成一份更专业的融资路演 PPT
```

**预期 Agent 行为**：
- 询问或读取环境变量中的 API Key
- 调用 `lemonppt generate ... --api-key $OPENAI_API_KEY`
- 说明内容已根据主题自动生成

**记录项**：
- Agent 是否正确传递 API Key？
- 生成内容是否比 fallback 更贴合主题？
- 是否有 API 超时/报错？

---

## 记录模板

每次测试填写一条：

```markdown
### 测试记录 - YYYY-MM-DD - 平台名

- **测试人**：
- **Agent 平台**：Claude Code / Claude Desktop / Codex CLI / Cursor
- **Skill 版本**：`@lemonppt/cli@x.x.x`
- **用例编号**：1 / 2 / 3 / 4 / 5 / 6
- **用户 Prompt**：
- **Agent 实际执行命令**：
- **结果**：成功 / 部分成功 / 失败
- **生成文件**：
  - goal.json：合法 / 不合法
  - PPTX：可打开 / 不可打开
  - PDF：可打开 / 不可打开
- **发现的问题**：
  1. 问题描述
  2. 问题描述
- **建议优化**：
  - SKILL.md 某处应如何修改
  - CLI 某处应如何改进
```

---

## 验收标准

Skill 可以进入 `0.2.0` 候选前，至少满足：

- 在 2 个及以上 Agent 平台通过用例 1、2、3
- 无“致命错误”（如命令完全不执行、goal.json 非法、PPTX 无法打开）
- 收集到 ≥5 条可落地的 `SKILL.md` 改进建议

---

## 历史记录

> 每次测试后将记录追加到本节。

### 测试记录 - 2026-07-20 - Trae 本地 smoke test

- **测试人**：Trae Agent
- **Agent 平台**：Trae（本地 Node 脚本模拟）
- **Skill 版本**：`@lemonppt/cli@0.1.6`
- **用例编号**：1 / 2 / 3 / 4 / 5 / 6
- **用户 Prompt**：见 `scripts/agent-test.mjs`
- **Agent 实际执行命令**：`corepack pnpm agent:test`
- **结果**：成功（用例 6 因未配置 API Key 跳过）
- **生成文件**：
  - goal.json：合法
  - PPTX：可打开
  - PDF：可打开
- **发现的问题**：
  1. 当前无 Claude / Codex / Cursor 环境，无法验证真实 Agent 对 SKILL.md 的理解与执行顺序。
- **建议优化**：
  - 后续在真实 Agent 平台补测，重点观察 Agent 是否会追问必要信息、是否正确使用 `--theme`/`--language` 参数。
