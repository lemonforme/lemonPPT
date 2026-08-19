# lemonPPT

根据一句话主题、结构化需求或已有的 `goal.json`，生成精美、可编辑的 PPT（HTML/PPTX/PDF）。

> **协议声明**：lemonPPT 采用 AGPL-3.0-or-later 开源协议。若你通过 AI Agent 向第三方提供基于 lemonPPT 的服务，请遵守 AGPL-3.0 的源代码公开义务。详见项目根目录 `LICENSE` 与 `docs/LEGAL.md`。

---

## 能力边界

lemonPPT 是**结构化 goal.json → 视觉 PPT** 的渲染与导出引擎：

- ✅ 将 `goal.json` 渲染为可离线打开的 HTML deck（支持浏览器内编辑）
- ✅ 导出可编辑 PPTX 或截图 PDF
- ✅ 根据 `role` 自动挑选合适版式
- ✅ 内置自然语言 → `goal.json` 生成（`lemonppt generate`）
- ❌ **不直接解析外部文档**（Word/PDF/Markdown）；如需“上传文档生成 PPT”，外层 Agent 需先提取文本/结构，再交给 lemonPPT
- ❌ 不联网抓取网页；不生成图片/图表数据本身，但可渲染你提供的数据

---

## 使用流程

### 方式一：一句话端到端生成（最简单）

```bash
# 1. 生成 goal.json
lemonppt generate "面向企业客户的 AI 助手产品发布会，强调效率提升 10 倍、支持私有化部署、已有 50 家客户" \
  --pages 8 --theme theme01 --language zh --out ./goal.json

# 2. 导出 PPTX / PDF
lemonppt export ./goal.json --pptx ./deck.pptx --pdf ./deck.pdf

# 3. （可选）渲染可编辑 HTML 预览
lemonppt render ./goal.json --out ./output --editable
```

参数说明：

- `--pages`：页数，建议 5~20 页
- `--theme`：主题 ID，见下方「可用主题」
- `--language`：`zh` 或 `en`
- `--api-key` / `--base-url` / `--model`：可选，OpenAI 兼容 API；不传则使用内置 fallback 示例

### 方式二：Agent 精细编排

当外层 Agent 需要控制每一页的结构、版式、数据时：

```bash
# 1. 查看可用主题
lemonppt list-themes

# 2. 按角色查询候选版式
lemonppt layout-query --theme theme06 --role metric --limit 5

# 3. 查看版式字段契约
lemonppt inspect-layout theme06_metric_hero_v1

# 4. 生成只含 role 的骨架
lemonppt goal-scaffold --title "AI 产业投资图谱" --goal "..." --theme theme06 --pages 10 --out ./goal.json

# 5. 外层 Agent 填充 props 后，规范化默认值并校验未知字段
lemonppt write-safe-props ./goal.json --write

# 6. 校验 goal.json 规范
lemonppt validate-goal-spec ./goal.json

# 7. 渲染与导出
lemonppt render ./goal.json --out ./output
lemonppt export ./goal.json --pptx ./deck.pptx
```

### 方式三：HTTP API 服务

先确保已构建：`corepack pnpm -r build`（若系统未全局安装 pnpm，corepack 会自动提供）。

```bash
# 启动真正的 lemonPPT API 服务（默认 3456 端口）
lemonppt serve --port 3456

# 等价的 server 别名
lemonppt server --port 3456
```

底层启动 `apps/server/dist/index.js`，输出目录默认 `./output`。

接口：

- `POST /api/generate-goal`：自然语言 → `goal.json`
- `POST /api/render`：`goal.json` → HTML
- `POST /api/render-editor`：`goal.json` → 单页编辑器渲染数据（`EditorData` JSON），不再生成静态文件
- `POST /api/export/pptx`：`goal.json` → PPTX
- `POST /api/export/pdf`：`goal.json` → PDF
- `POST /api/layout-query`：候选版式查询
- `POST /api/inspect-layout`：版式字段契约
- `POST /api/goal-scaffold`：生成骨架
- `POST /api/write-safe-props`：规范化 props
- `POST /api/validate-goal-spec`：校验 goal.json
- `POST /api/stage-media`：上传 base64 图片到服务目录，返回可在 `goal.json` 中引用的 URL
- `GET /editor`：打开单页编辑器（所有主题共享同一页面，通过 `?theme=theme01` 切换主题）
- `GET /api/render-editor?theme=theme01`：基于示例 goal 返回指定主题的 `EditorData`

调用示例：

```bash
curl -X POST http://localhost:3456/api/render \
  -H "Content-Type: application/json" \
  -d @goal.json

curl -X POST http://localhost:3456/api/export/pptx \
  -H "Content-Type: application/json" \
  -d @goal.json \
  --output deck.pptx

curl -X POST "http://localhost:3456/api/render-editor?theme=theme02" \
  -H "Content-Type: application/json" \
  -d @goal.json

# 上传本地图片（base64）
curl -X POST http://localhost:3456/api/stage-media \
  -H "Content-Type: application/json" \
  -d '{"filename":"logo.png","data":"iVBORw0KGgoAAAANSUhEUg..."}'
```

---

## 可用主题

| 主题 ID | 风格 | 配色/外观 |
|---|---|---|
| `theme01` | 浅色玻璃质感 | light / dark |
| `theme02` | 深色霓虹科技 | scheme-a / scheme-b |
| `theme03` | 代码编辑器风 | scheme-a / scheme-b + light / dark |
| `theme04` | 玻璃糖果风 | green / yellow / blue / pink + light / dark |
| `theme05` | 光谱报告风 | coral / amber / teal / indigo / violet + light / dark |
| `theme06` | 深色图谱风 | volt / magma / nebula / nova + light / dark |
| `theme07` | 冷白金融投资风 | cold-white / warm-gray / ink / navy + light / dark |
| `theme08` | 曜金黑金机构风 | obsidian-gold / midnight-silver / graphite-rose / forest-gold |
| `theme09` | 墨韵杂志印刷风 | paper / ink 双基底 + primary / muted |
| `theme10` | 金指数据指数风 | gold-index / blue-index / green-index |

默认主题：`theme01`。

---

## goal.json 格式

```json
{
  "title": "演示文稿标题",
  "goal": "这场 PPT 希望达成什么？",
  "audience": "目标受众",
  "owner": "汇报人",
  "theme": "theme01",
  "colorScheme": "light",
  "appearance": "light",
  "language": "zh",
  "pageCount": 8,
  "randomSeed": "可选种子",
  "slides": [
    {
      "role": "cover",
      "layout": "theme01_cover_v1",
      "props": {
        "title": "标题",
        "subtitle": "副标题"
      }
    }
  ]
}
```

### 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | 是 | PPT 标题 |
| `goal` | 是 | 演示目标/背景 |
| `audience` | 是 | 受众描述 |
| `owner` | 否 | 汇报人 |
| `theme` | 是 | 主题 ID；也兼容 `themePack` 作为别名 |
| `colorScheme` | 否 | 主题专用配色方案，见「可用主题」 |
| `appearance` | 否 | `light` / `dark`，部分主题支持 |
| `language` | 否 | `zh` 或 `en`，默认 `zh` |
| `pageCount` | 否 | 总页数；留空时自动等于 `slides.length` |
| `randomSeed` | 否 | 随机种子，保证选页可复现 |
| `slides` | 是 | 幻灯片数组 |

每个 slide：

| 字段 | 必填 | 说明 |
|---|---|---|
| `role` | 否 | 页面角色，见下方「页面角色」；留空时尝试从 `layout` 推断 |
| `layout` | 否 | 具体版式 ID；留空时系统按 role 自动选择 |
| `props` | 是 | 该版式所需数据 |

> **外部 Agent 友好**：HTTP API 与 CLI 均支持 `themePack` 替代 `theme`、`pageCount` 省略、`role` 省略（系统从 `layout` ID 推断），方便被其他 Agent 调用。未提供的必填字段将自动补全。

---

## 页面角色

Agent 选页时优先只指定 `role`，由系统根据当前主题自动挑选合适版式。只有在明确需要某一款版式时才填 `layout`。

| role | 用途 |
|---|---|
| `cover` | 封面 |
| `tableOfContents` | 目录 |
| `metric` | 关键数字/指标 |
| `stats` | 统计摘要 |
| `chart` | 数据图表 |
| `comparison` | 对比页 |
| `pricing` | 价格方案 |
| `process` | 流程步骤 |
| `timeline` | 时间线 |
| `roadmap` | 路线图 |
| `quote` | 金句引用 |
| `testimonial` | 客户评价 |
| `content` | 图文内容 |
| `faq` | 问答 |
| `feature` | 产品特性 |
| `team` | 团队介绍 |
| `partners` | 合作伙伴墙 |
| `image` | 单图页 |
| `gallery` | 图片画廊 |
| `bento` | 模块化概览 |
| `table` | 表格 |
| `tags` | 标签云 |
| `filmstrip` | 胶片条 |
| `swot` | SWOT 分析 |
| `pest` | PEST 分析 |
| `closing` | 结尾/感谢 |

---

## 常见 props 字段

- `title`：页面主标题
- `kicker`：小标题/标签
- `subtitle`：副标题
- `items` / `points` / `bullets`：列表项数组
- `stats` / `metrics`：指标数组，元素通常含 `label`、`value`、`unit`、`change`
- `image` / `imageUrl`：图片 URL（远程 URL 在 PPTX 中可能显示占位符，建议用本地图片或 base64）
- `cta` / `contact` / `email` / `link`：结尾页联系方式
- `showInsight` + `insight`：图表/数据页的重点强调面板

具体字段请用 `lemonppt inspect-layout <layoutId>` 查看。

---

## CLI 命令速查

```bash
# 生成
lemonppt generate "<主题>" [--pages N] [--theme <id>] [--language zh|en] [--out goal.json] [--api-key KEY]

# 渲染
lemonppt render <goal.json> [--out ./output] [--editable]

# 导出
lemonppt export <goal.json> --pptx out.pptx [--pdf out.pdf]

# 本地服务（优先启动 API 服务；未构建时回退到静态预览）
lemonppt serve [<dir>] [--port N]
lemonppt server [<dir>] [--port N]

# 主题/版式查询
lemonppt list-themes
lemonppt layout-query --theme <id> --role <role> [--limit N] [--seed S] [--keyword K]
lemonppt inspect-layout <layoutId> [--compact]

# 骨架/校验
lemonppt goal-scaffold --title T --goal G --theme <id> --pages N --out goal.json
lemonppt write-safe-props <goal.json> [--write]
lemonppt validate-goal-spec <goal.json>

# 安装到 Agent 技能目录
lemonppt install-skill [--claude] [--codex] [--cursor] [--all]
lemonppt install-skill --target ./my-agent/skills/lemonppt
```

---

## Skill 包内 npm scripts（Dashi 风格）

将 `skills/lemonppt/` 复制到 Agent 技能目录后，也可以直接进入 skill 目录调用 npm scripts：

```bash
cd ~/.claude/skills/lemonppt

npm run layout:query -- --theme theme01 --role cover --limit 5
npm run inspect:layout -- theme01_cover_v1
npm run goal:scaffold -- --title "AI 报告" --goal "..." --theme theme01 --pages 8 --out ./goal.json
npm run props:safe -- ./goal.json --write
npm run validate:goal-spec -- ./goal.json
npm run render:goal -- ./goal.json --out ./output
npm run validate:deck -- ./output --goal ./goal.json
npm run validate:goal-copy -- ./goal.json ./output
npm run export:pptx -- ./goal.json ./deck.pptx
npm run export:pdf -- ./goal.json ./deck.pdf
npm run preview:start -- ./output --port 3456
npm run media:stage -- ./image.png --out ./output/assets
```

这些脚本本质上是调用 `lemonppt` CLI 的薄包装，因此首次使用前需要：

- 源码模式：确保项目已构建（`corepack pnpm -r build`），skill 包会被写入本地 CLI 路径；
- 发布模式：执行过 `npm install -g @lemonppt/cli`，或脚本自动通过 `npx @lemonppt/cli` 调用。

---

## 常见错误处理

1. **没有 API Key**：`lemonppt generate` 会 fallback 到内置示例内容，仍可生成完整文件。如需更贴合主题的文案，提供 `--api-key`。
2. **生成内容偏离主题**：把主题描述写得更具体，补充目标受众、核心卖点、关键数据。
3. **页数太少**：建议封面 + 目录 + 3~5 页内容 + 结尾，最少 5 页。
4. **远程图片在 PPTX 中不显示**：PPTX 导出优先使用本地图片或 base64；远程 URL 会显示占位符。
5. **校验失败**：检查 `slides.length === pageCount`、必填字段、未知 props 字段。
6. **版式不存在**：使用 `lemonppt layout-query` 查询当前主题下可用版式。

---

## Agent 调用示例

### 例 1：用户说“帮我做一份 PPT”

1. 先追问：主题、目标、受众、页数、主题风格、语言。
2. 调用 `lemonppt generate "<完整主题>" --pages N --theme <id> --language zh --out ./goal.json`。
3. 调用 `lemonppt export ./goal.json --pptx ./deck.pptx --pdf ./deck.pdf`。
4. 交付文件并说明来源。

### 例 2：用户上传了一份文档

1. 外层 Agent 自行解析文档，提取标题、摘要、章节、数据、图片。
2. 调用 `lemonppt goal-scaffold` 生成骨架。
3. 按 `lemonppt inspect-layout` 的字段契约，将文档内容映射为每页 `props`。
4. 调用 `lemonppt write-safe-props` 规范化，`lemonppt validate-goal-spec` 校验。
5. 渲染并导出。

### 例 3：用户指定某一页要“团队介绍”

1. 查看候选版式：`lemonppt layout-query --theme <id> --role team --limit 3`。
2. 查看契约：`lemonppt inspect-layout theme01_team_v1`。
3. 修改 `goal.json` 中对应 slide 的 `role` 为 `team`，按契约填充 `props`。
4. 重新渲染/导出。

---

## 注意事项

- 优先只写 `role`，不要手动指定每个 slide 的 `layout`，除非用户明确要求某一款版式。
- `goal.json` 是核心协议，生成后可以直接交给用户修改再导出。
- 同一 deck 中建议不要重复使用完全相同的 `layout`。
- 所有命令在 lemonPPT 项目根目录执行；CLI 入口为 `packages/cli/dist/cli.js` 或安装后的 `lemonppt`。
