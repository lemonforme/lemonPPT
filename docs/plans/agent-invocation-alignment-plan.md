# lemonPPT 外部 AI / Agent 调用能力对齐计划（方案 B）

> 目标：在保留 lemonPPT 现有「一句话生成 PPT」优势的基础上，补齐 Dashi PPT 风格的 Agent/Skill 调用边界，使外部 AI 既可端到端调用，也可精细控制选页、填充、校验、渲染、导出流程。
> 版本：v0.1.0
> 制定日期：2026-08-03

---

## 一、核心决策：方案 B

**方案 B**：保留 `lemonppt generate` 作为端到端入口，同时新增 `layout-query` / `inspect-layout` / `goal-scaffold` / `write-safe-props` / `validate-goal-spec` 等脚本，满足高级 Agent 的精细化控制需求。

理由：
- 现有 `@lemonppt/cli` 已发布，`generate`/`render`/`export` 是最简单的用户入口。
- 外部 AI Agent（Claude/Codex/Cursor）需要程序化选页、查看版式契约、校验 goal.json。
- 文档解析能力放在 lemonPPT Skill 外部，由外层 Agent 或服务负责；lemonPPT 核心保持 clean boundary。

---

## 二、最终目标形态

外部 AI 可以有三种调用方式：

### 方式 1：一句话端到端（保留现有）

```bash
lemonppt generate "面向企业客户的 AI 助手产品发布会..." --pages 8 --theme theme01 --language zh --out ./goal.json
lemonppt export ./goal.json --pptx ./deck.pptx --pdf ./deck.pdf
```

### 方式 2：Agent 精细编排（新增）

```bash
# 1. 查看可用主题
lemonppt list-themes

# 2. 按角色查候选版式
lemonppt layout-query --theme theme06 --role metric --limit 5

# 3. 查看版式字段契约
lemonppt inspect-layout theme06_metric_hero_v1

# 4. 生成骨架
lemonppt goal-scaffold --title "AI 产业投资图谱" --goal "..." --theme theme06 --pages 10 --out ./goal.json

# 5. 外层 AI 填充内容后，规范化 props
lemonppt write-safe-props ./goal.json --write

# 6. 校验
lemonppt validate-goal-spec ./goal.json

# 7. 渲染与导出
lemonppt render ./goal.json --out ./output
lemonppt export ./goal.json --pptx ./deck.pptx
```

### 方式 3：HTTP API 服务（保留并扩展）

```bash
# 启动服务
lemonppt serve --port 3456

# 或 node apps/server/src/server.ts
```

新增接口：
- `POST /api/layout-query`
- `POST /api/inspect-layout`
- `POST /api/goal-scaffold`
- `POST /api/write-safe-props`
- `POST /api/validate-goal-spec`

---

## 三、与 Dashi PPT 调用方式的对齐对照

| Dashi PPT 能力 | lemonPPT 当前状态 | 本次改动 |
|---|---|---|
| `goal.json` 是唯一正式输入 | ✅ 已有 `DeckGoal` | 无需改动 |
| 按 `role` 自动选版式 | ✅ `composer/selectLayoutForRole` | 无需改动 |
| `layout:query` | ❌ 无 | 新增 `scripts/layout-query.mjs` + CLI 子命令 |
| `inspect:layout` | ❌ 无 | 新增 `scripts/inspect-layout.mjs` + CLI 子命令 |
| `goal-scaffold` | ❌ 无 | 新增 `scripts/goal-scaffold.mjs` + CLI 子命令 |
| `write-safe-props` | ⚠️ 仅有 `normalizeDeck` | 新增 `scripts/write-safe-props.mjs` + CLI 子命令 |
| `validate-goal-spec` | ⚠️ 仅内嵌在 render/export 中 | 新增独立脚本 + CLI 子命令 |
| `render:goal` | ✅ `lemonppt render` | 无需改动 |
| `export:pptx` / `export:pdf` | ✅ `lemonppt export` | 无需改动 |
| Agent YAML 接口定义 | ❌ 无 | 新增 `packages/cli/agents/*.yaml` |
| Skill 安装器 | ⚠️ 仅有 `install-skill.ts` 复制 SKILL.md | 保持，后续增强 |
| 文档解析 | ❌ 无 | **不在本次范围**，由外层 Agent 负责 |

---

## 四、具体改动清单

### 4.1 文档层

| 文件 | 改动内容 |
|---|---|
| `docs/plans/agent-invocation-alignment-plan.md` | 本文档（已创建） |
| `SKILL.md` | 重写：明确边界、更新主题/角色/CLI、给出 Agent 调用示例 |
| `packages/cli/SKILL.md` | 通过 `copy-skill.mjs` 同步根目录 SKILL.md |
| `docs/progress.md` | 记录本次改动与验证结果 |

### 4.2 脚本层（scripts/）

| 文件 | 功能 | 输入参数 | 输出 |
|---|---|---|---|
| `scripts/layout-query.mjs` | 按 theme + role + keyword 查询候选版式 | `--theme`, `--role`, `--keyword`, `--needs-media`, `--limit`, `--seed` | JSON 版式列表 |
| `scripts/inspect-layout.mjs` | 查看指定版式的字段契约 | `layoutId`, `--compact` | JSON/表格 schema、默认值、mediaSlots |
| `scripts/goal-scaffold.mjs` | 生成只含 role 的 slides 骨架 | `--title`, `--goal`, `--audience`, `--owner`, `--theme`, `--pages`, `--language`, `--out` | goal.json |
| `scripts/write-safe-props.mjs` | 规范化 props、填充默认值、校验未知字段 | `--goal`, `--write` | 规范化后的 goal.json + 变更报告 |
| `scripts/validate-goal-spec.mjs` | 独立校验 goal.json | `--goal`, `--strict` | 校验结果 + 错误列表 |

### 4.3 CLI 层（packages/cli/）

| 文件 | 改动 |
|---|---|
| `packages/cli/src/cli.ts` | 新增子命令：`list-themes`, `layout-query`, `inspect-layout`, `goal-scaffold`, `write-safe-props`, `validate-goal-spec` |
| `packages/cli/src/index.ts` | 暴露对应的函数实现 |

### 4.4 Agent 接口层

| 文件 | 内容 |
|---|---|
| `packages/cli/agents/openai.yaml` | OpenAI Agent / GPTs 接口定义 |
| `packages/cli/agents/codex.yaml` | Codex CLI Agent 接口定义 |
| `packages/cli/agents/cursor.yaml` | Cursor Agent 接口定义 |

### 4.5 Server 层

| 文件 | 改动 |
|---|---|
| `apps/server/src/server.ts` | 新增路由：`/api/layout-query`, `/api/inspect-layout`, `/api/goal-scaffold`, `/api/write-safe-props`, `/api/validate-goal-spec` |
| `apps/server/src/public/create.html` | 主题下拉框加入 `theme06` |

### 4.6 包配置

| 文件 | 改动 |
|---|---|
| `package.json` | 新增 npm scripts：`layout:query`, `inspect:layout`, `goal:scaffold`, `props:safe`, `validate:goal-spec` |

---

## 五、实现顺序

按以下顺序执行，每步均可独立验证：

1. **重写 `SKILL.md`**（P0）
2. **新增 `scripts/layout-query.mjs`**（P0）
3. **新增 `scripts/inspect-layout.mjs`**（P0）
4. **CLI 暴露 `list-themes` / `layout-query` / `inspect-layout`**（P0）
5. **更新 `apps/server/src/public/create.html` 加入 theme06**（P0，快速修复）
6. **新增 `scripts/goal-scaffold.mjs`**（P1）
7. **新增 `scripts/write-safe-props.mjs`**（P1）
8. **新增 `scripts/validate-goal-spec.mjs`**（P1）
9. **CLI 暴露上述脚本为子命令**（P1）
10. **Server 新增 API 路由**（P1）
11. **新增 Agent YAML 接口定义**（P2）
12. **运行类型检查与 smoke test 验证**（P0）

---

## 六、验证标准

- `node scripts/layout-query.mjs --theme theme06 --role metric --limit 3` 能输出 JSON。
- `node scripts/inspect-layout.mjs theme06_metric_hero_v1` 能输出 schema。
- `node scripts/goal-scaffold.mjs --title "测试" --goal "测试目标" --theme theme06 --pages 5` 能生成合法 goal.json。
- `node scripts/write-safe-props.mjs --goal ./output/test-goal.json --write` 能规范化。
- `node scripts/validate-goal-spec.mjs --goal ./output/test-goal.json` 返回通过。
- CLI 子命令 `lemonppt list-themes`、`lemonppt layout-query`、`lemonppt inspect-layout` 可用。
- `apps/server/src/public/create.html` 下拉框包含 theme06。
- `node_modules/.bin/tsc --noEmit` 各包通过。
- `node scripts/agent-test.mjs` 通过。

---

## 七、文档解析的后续建议

虽然本次不改，但建议在下一批次实现：

- 新增 `packages/document-parser`：支持 `.txt`、`.md`、`.docx`、`.pdf` 提取为 `{title, summary, sections}`。
- `apps/server` 增加 `/api/parse-document`（multer 上传）。
- `create.html` 增加文件上传 UI。
- 新增 `packages/agent-prompts/src/document-prompt.ts`：文档结构 → goal.json 的专用 prompt。

这部分保持为外层 Agent 能力，不侵入 lemonPPT Skill 核心。

---

## 八、附录：角色表（当前已支持）

`SlideRole` 定义于 `packages/core/src/types.ts`：

cover, tableOfContents, metric, stats, chart, comparison, pricing, process, timeline, roadmap, quote, testimonial, content, faq, feature, team, partners, image, gallery, bento, table, tags, filmstrip, swot, pest, closing

---

## 九、附录：主题表（当前已支持）

| 主题 ID | 风格 | 外观/方案 |
|---|---|---|
| theme01 | 浅色玻璃质感 | light/dark |
| theme02 | 深色霓虹科技 | scheme-a/scheme-b |
| theme03 | 代码编辑器风 | scheme-a/scheme-b + light/dark |
| theme04 | 玻璃糖果风 | green/yellow/blue/pink + light/dark |
| theme05 | 光谱报告风 | coral/amber/teal/indigo/violet + light/dark |
| theme06 | 深色图谱风 | volt/magma/nebula/nova + light/dark |
