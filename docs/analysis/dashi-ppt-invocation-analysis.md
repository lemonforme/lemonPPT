# Dashi PPT 调用方式具体分析

> 分析对象：`skills/dashi-ppt/` 目录下的 Skill 接口、CLI 脚本、渲染流程与导出能力。
> 版本：`dashi-ppt-runtime@0.4.2`。
> 适用场景：评估其他 AI / Agent / 脚本如何驱动 Dashi PPT 生成演示文稿。

---

## 一、整体架构

Dashi PPT 不是一套面向公网的 SaaS API，而是一个**本地 Node.js Skill**，运行在调用方机器上。它的核心定位是：

> **“模板编排器”** —— 把一份结构化的 JSON 计划（`goal.json`）渲染成可离线打开、可编辑、可导出 PPTX/PDF 的 HTML 横向翻页 PPT。

```
┌─────────────────┐     ① 生成 goal.json      ┌──────────────────┐
│  外层 AI / 用户  │ ─────────────────────────> │  Dashi PPT Skill │
│                 │                            │  (Node.js 本地)  │
│  文档/自然语言   │     ② 渲染为 HTML deck    │                  │
│                 │ <───────────────────────── │                  │
└─────────────────┘                            └──────────────────┘
                              ③ 启动预览服务/导出 PPTX/PDF
```

**关键结论**：Dashi PPT 自身不解析文档、不理解自然语言、不提供“上传文件”接口。所有内容理解、模板选择、文案映射必须由**调用方**完成。

---

## 二、Agent 接口层

### 2.1 OpenAI/Codex Agent 定义

文件：[skills/dashi-ppt/agents/openai.yaml](file:///Users/apple/Downloads/dashi-ppt-skill-main/skills/dashi-ppt/agents/openai.yaml)

```yaml
interface:
  display_name: "Dashi PPT"
  short_description: "Generate editable HTML presentation decks"
  icon_small: "./assets/skill/dashi-ppt-small.png"
  icon_large: "./assets/skill/dashi-ppt.png"
  default_prompt: "Use $dashi-ppt to turn my presentation goal into an editable HTML deck."
```

这说明 Dashi PPT 被设计为**被宿主 Agent 调用**的 Skill。宿主 Agent 负责：

- 理解用户意图
- 选择风格（`themePack`）
- 组织内容结构
- 生成 `goal.json`
- 调用渲染脚本

### 2.2 与宿主 Agent 的交互边界

| 能力 | 宿主 Agent | Dashi PPT |
|---|---|---|
| 自然语言理解 | ✅ | ❌ |
| 文档解析 | ✅ | ❌ |
| 模板/风格选择 | ✅（决策） | ✅（提供候选） |
| 页面 layout 选择 | ✅（决策） | ✅（提供候选） |
| 文案长度控制 | ✅（按契约） | ✅（校验） |
| 渲染 HTML | ❌ | ✅ |
| 启动预览/导出 | ❌ | ✅ |

---

## 三、输入契约：goal.json

Dashi PPT 的唯一正式输入是 `goal.json`。完整结构见 [SKILL.md](file:///Users/apple/Downloads/dashi-ppt-skill-main/skills/dashi-ppt/SKILL.md) 第 142 行。

### 3.1 顶层字段

```json
{
  "title": "美国 AI 融资调研",
  "goal": "面向投资团队汇报 2024-2026 年美国 AI 大额融资结构、资本流向和后续判断",
  "audience": "投资团队 / 产业研究团队",
  "owner": "研究团队",
  "randomSeed": "ai-funding-20260609-a7k",
  "pageCount": 8,
  "themePack": "theme01",
  "language": "zh",
  "slides": [...]
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | 是 | PPT 标题 |
| `goal` | 是 | 汇报目标 |
| `audience` | 否 | 受众 |
| `owner` | 否 | 作者/团队 |
| `themePack` | 是 | 主题包，如 `theme01` ~ `theme12` |
| `language` | 否 | `zh` / `en`，默认跟随用户语言 |
| `pageCount` | 否 | 仅草稿阶段有用，交付前必须换成具体 `slides` |
| `randomSeed` | 否 | 保证 `layout:query` 选页可复现 |
| `slides` | 是 | 具体页面数组 |

### 3.2 slides 数组元素

```json
{
  "layout": "theme01_page001",
  "props": {
    "kicker": "融资调研 · VOL.01",
    "titleTop": "美国 AI",
    "titleBottom": "融资调研",
    "lead": "从资本体量、赛道结构和典型公司拆解本轮 AI 融资周期。"
  }
}
```

- `layout`：必须是主题内存在的具体页面 key，如 `theme05_page009`。
- `props`：页面可填充字段，需符合该 layout 的 `copyKeys` / `fillPlan` 契约。
- 封面只能从 `themeXX_page001` ~ `themeXX_page005` 中选 1 个。
- 同一 deck 中 `slides[].layout` 必须唯一，不可复用同一 layout。

### 3.3 不支持的内容

`goal.json` **不支持**以下输入方式：

- ❌ 直接上传原始文档（PDF/Word/Markdown）
- ❌ 只给一段长文本让 Skill 自动分页
- ❌ 只给角色（role）就交付（role 仅用于草稿选页）
- ❌ 自由 HTML slide（每页必须 `layout` + `props`）

---

## 四、CLI 脚本与调用流程

所有核心脚本位于 [skills/dashi-ppt/project/scripts/](file:///Users/apple/Downloads/dashi-ppt-skill-main/skills/dashi-ppt/project/scripts/)。

### 4.1 完整生成工作流

```bash
# 1. 选页（按角色/关键词/媒体意图）
node scripts/layout-query.mjs \
  --theme theme05 \
  --role metrics \
  --limit 8 \
  --seed "my-deck-123"

# 2. 查看页面契约（字段、长度预算、媒体槽）
node scripts/inspect-layout.mjs --compact theme05_page029

# 3. 生成 goal.json 骨架（长 deck 推荐）
node scripts/goal-scaffold.mjs \
  --title "AI 融资调研" \
  --goal "汇报美国 AI 融资情况" \
  --theme theme05 \
  --pages 12 \
  --out output/my-deck/goal.json

# 4. 填充 props 后，安全化 props 并写入
node scripts/write-safe-props.mjs --goal output/my-deck/goal.json --write

# 5. 校验 goal 规范
node scripts/validate-goal-spec.mjs output/my-deck/goal.json

# 6. 渲染 HTML deck
npm run render:goal -- output/my-deck/goal.json output/my-deck/ppt/index.html

# 7. 校验输出
node scripts/validate-swiss-deck.mjs output/my-deck/ppt/index.html
node scripts/validate-goal-copy.mjs output/my-deck/goal.json output/my-deck/ppt/index.html

# 8. 启动预览服务
node scripts/start-preview-server.mjs output/my-deck/ppt 5200

# 9. 导出 PPTX/PDF
node scripts/export-pptx.mjs output/my-deck/ppt output/my-deck/deck.pptx
node scripts/export-pptx.mjs --pdf output/my-deck/ppt output/my-deck/deck.pdf
```

### 4.2 脚本功能对照表

| 脚本 | npm script | 作用 |
|---|---|---|
| `layout-query.mjs` | `layout:query` | 按主题、角色、关键词、媒体意图筛选候选 layout |
| `inspect-layout.mjs` | `inspect:layout` | 查看指定 layout 的字段、预算、媒体槽、数组结构 |
| `goal-scaffold.mjs` | `goal:scaffold` | 自动生成长 deck 的 layout 骨架和 fillPlan |
| `write-safe-props.mjs` | `props:safe` | 规范化 props、填充默认值、校验未知字段 |
| `validate-goal-spec.mjs` | `validate:goal-spec` | 校验 goal.json 规范 |
| `render-goal-deck.jsx` | `render:goal` | 渲染 HTML deck |
| `start-preview-server.mjs` | `preview:start` | 启动本地预览/导出服务 |
| `export-pptx.mjs` | `export:pptx` / `export:pdf` | 导出可编辑 PPTX 或截图 PDF |
| `validate-swiss-deck.mjs` | `validate:swiss` | 校验渲染后的 HTML 结构 |
| `validate-goal-copy.mjs` | `validate:goal-copy` | 校验文案是否被正确覆盖 |
| `stage-media.mjs` | `media:stage` | 把用户图片/视频拷贝到 deck 目录并返回相对路径 |

---

## 五、页面选择：layout-query

### 5.1 输入参数

```bash
node scripts/layout-query.mjs \
  --theme theme05           # 主题包
  --role metrics            # 页面角色
  --keyword "bubble"        # 关键词搜索
  --needs-media             # 需要媒体槽
  --planned-images 3        # 计划使用 3 张图
  --provided-images 2       # 用户已提供 2 张图
  --image-gen               # 需要生图
  --limit 8                 # 返回候选数
  --seed "xxx"              # 随机种子
```

### 5.2 输出示例

```json
{
  "theme": "theme05",
  "role": "metrics",
  "needsMedia": false,
  "limit": 8,
  "seed": "123456789",
  "themeDisplayName": "色谱图表风",
  "count": 8,
  "layouts": [
    {"layout": "theme05_page029", "slot": "bignumber", "label": "大数字", "role": "metrics", "mediaSlots": []},
    {"layout": "theme05_page030", "slot": "stattrio", "label": "三联大数字", "role": "metrics", "mediaSlots": []}
  ]
}
```

### 5.3 可用 role

见 [skills/dashi-ppt/references/layout-roles.md](file:///Users/apple/Downloads/dashi-ppt-skill-main/skills/dashi-ppt/references/layout-roles.md)：

`cover`、`statement`、`breakdown`、`transition`、`context`、`metrics`、`trend`、`comparison`、`distribution`、`relationship`、`case`、`image`、`process`、`risks`、`observation`、`ambient`、`actions`、`result`、`team`、`closing`。

---

## 六、页面契约：inspect-layout

### 6.1 用途

拿到候选 layout 后，调用方 AI 必须查看每个 layout 能填哪些字段、字段类型、长度预算、数组数量、媒体槽位。

```bash
node scripts/inspect-layout.mjs --compact theme05_page029
```

### 6.2 关键输出字段

| 字段 | 说明 |
|---|---|
| `copyKeys` | 可直接填写的文案/数据字段路径 |
| `copyBudgets` | 字段长度预算 |
| `propShapes` | 对象/数组字段的内部结构 |
| `mediaSlots` | 图片/视频槽位定义 |
| `countBindings` | 数量参数与数组字段的绑定关系 |
| `fillPlan.text` | 文本字段及其 `maxChars` |
| `fillPlan.arrays` | 数组字段及其 `visibleCount` |
| `controlKeys` | 右侧编辑面板可调字段（非填充清单） |
| `contentLocked` | 正文是否固定，无法通过 props 修改 |

### 6.3 调用方 AI 的使用方式

1. 用 `layout:query` 拿到 8~12 个候选 layout。
2. 对候选 layout 批量 `inspect:layout --compact`。
3. 根据文档内容，选择能承载对应信息的 layout。
4. 按 `fillPlan` 把文档内容映射为 `props`。
5. 特别注意 `display` / `metric` 字段只写短词/数字，`copy` 字段按 `maxChars` 控制长度。

---

## 七、内容填充与校验

### 7.1 props:safe 的作用

```bash
node scripts/write-safe-props.mjs --goal output/my-deck/goal.json --write
```

它会：

- 规范化每个 layout 的 props
- 填充默认值
- 校验未知字段
- 处理媒体路径
- 输出 `layoutChanges`（当某个 layout 无法安全填充时，可能替换为近似 layout）

### 7.2 校验链

```bash
validate:goal-spec   # 校验 goal.json 结构、封面唯一性、字段类型等
render:goal          # 渲染 HTML
validate:swiss       # 校验 HTML 结构
validate:goal-copy   # 校验文案是否被正确覆盖
```

### 7.3 常见校验失败原因

- 使用了多个封面（`themeXX_page001~005`）
- `slides[].layout` 重复
- props 字段超长或类型错误
- 使用了自由 HTML（如 `<span>`）
- 必填字段未填
- 媒体路径不存在或不在 deck 目录内

---

## 八、渲染：render:goal

### 8.1 输入输出

```bash
npm run render:goal -- <goal.json> <output/ppt/index.html>
```

- 输入：`goal.json` 路径
- 输出：`ppt/index.html` + `ppt/assets/`

### 8.2 渲染过程

1. 读取 `goal.json`
2. `composeDeck()` 组合 deck 数据
3. `renderDeck()` 使用 React SSR 渲染为静态 HTML
4. 内联主题 CSS/JS
5. 输出可离线打开的完整 HTML

### 8.3 无验证渲染

当 goal 包含多个封面或非常规 layout 时，`validate:goal-spec` 会失败。本项目中已新增一个绕过验证的脚本：

```bash
npx tsx scripts/render-goal-deck-no-validate.jsx \
  <goal.json> \
  <output/ppt/index.html>
```

> 注意：该脚本仅用于预览/分析场景，正式交付仍建议满足校验规则。

---

## 九、预览与导出

### 9.1 启动预览服务

```bash
node scripts/start-preview-server.mjs output/my-deck/ppt 5200
```

输出示例：

```
HTTP export URL: http://127.0.0.1:5200/
HTTPS preview URL: https://MyMac.local:5200/
PID: 12345
```

- 预览服务是**守护进程**，会话结束后仍可访问。
- 支持浏览器内编辑、翻页、调整页面属性、切换动画。
- **导出 PPTX 必须使用 HTTP export URL**（`http://127.0.0.1:<port>/`）。
- 静态服务器（如 `python -m http.server`）不能替代，因为缺少导出接口。

### 9.2 导出 PPTX/PDF

#### 方式一：无浏览器会话直接导出（推荐脚本调用）

```bash
node scripts/export-pptx.mjs output/my-deck/ppt output/my-deck/deck.pptx
node scripts/export-pptx.mjs --pdf output/my-deck/ppt output/my-deck/deck.pdf
```

#### 方式二：通过预览服务导出

```bash
# 先启动预览服务
node scripts/start-preview-server.mjs output/my-deck/ppt 5200

# 再调用导出端点
# POST http://127.0.0.1:5200/api/export-editable-pptx
```

> 该端点需要同源 Origin/Referer，裸 `curl` 调用可能失败，建议用 `export-pptx.mjs`。

### 9.3 导出能力

| 格式 | 脚本 | 说明 |
|---|---|---|
| HTML | `render:goal` | 原生输出，可离线打开、可编辑 |
| PPTX | `export:pptx` | 可编辑文本对象 |
| PDF | `export:pdf` | 截图式 PDF |

---

## 十、外部 AI 如何调用 Dashi PPT

### 10.1 最小调用链路

外部 AI 要实现“文档 → PPT”，需要自己完成 ①~④，再调用 Dashi PPT 的 ⑤~⑦：

```
① 读取文档（PDF/Word/Markdown/网页）
② 理解内容：标题、目标、受众、章节、数据、结论
③ 选择 themePack 和具体 layout
④ 生成 goal.json
⑤ 调用 props:safe + validate:goal-spec
⑥ 调用 render:goal
⑦ 调用 export:pptx（可选）
```

### 10.2 推荐封装：Node.js 编排脚本

```javascript
// orchestrate-dashi-ppt.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SKILL_ROOT = './skills/dashi-ppt';
const PROJECT = `${SKILL_ROOT}/project`;

async function run(cmd, args, cwd = PROJECT) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { cwd, stdio: 'inherit' });
    p.on('close', code => code === 0 ? resolve() : reject(new Error(`exit ${code}`)));
  });
}

export async function generateDeck({ title, goal, audience, themePack, slides, outDir }) {
  const goalPath = path.join(outDir, 'goal.json');
  const pptDir = path.join(outDir, 'ppt');
  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(goalPath, JSON.stringify({
    title, goal, audience, themePack, language: 'zh', slides
  }, null, 2));

  await run('node', ['scripts/write-safe-props.mjs', '--goal', goalPath, '--write'], PROJECT);
  await run('node', ['scripts/validate-goal-spec.mjs', goalPath], PROJECT);
  await run('npx', ['tsx', 'scripts/render-goal-deck.jsx', goalPath, path.join(pptDir, 'index.html')], PROJECT);
  await run('node', ['scripts/export-pptx.mjs', pptDir, path.join(outDir, 'deck.pptx')], PROJECT);

  return { goalPath, pptDir, pptx: path.join(outDir, 'deck.pptx') };
}
```

### 10.3 文档解析 + 选页策略

外部 AI 需要实现一个“文档 → goal.json”的转换器，建议策略：

1. **提取元信息**：标题 → `title`；摘要 → `goal`；读者 → `audience`。
2. **章节识别**：把文档大纲映射为 slides。
3. **角色判定**：
   - 第一章 → `cover`
   - 目录/摘要 → `breakdown` / `statement`
   - 数据页 → `metrics` / `trend` / `comparison`
   - 案例页 → `case`
   - 结论/展望 → `observation` / `closing`
4. **调用 `layout:query`**：按角色获取候选 layout。
5. **调用 `inspect:layout`**：获取字段契约。
6. **内容映射**：按 `fillPlan` 把文档段落/数据填入 `props`。
7. **媒体处理**：如有图片，先 `media:stage` 再写入 `mediaSlots`。

---

## 十一、“上传文档选择模板生成 PPT”可行方案

### 11.1 当前不可行：Dashi PPT 没有上传接口

Dashi PPT 的输入只能是 `goal.json`，**不支持直接上传文档**。

### 11.2 可行架构：外层 Agent 封装

如果要实现“上传文档 → 选模板 → 生成 PPT”，需要在外层搭建一个 Agent/服务：

```
用户上传文档
    │
    ▼
┌─────────────────┐
│  文档解析模块    │  ← 提取标题、章节、数据、图片
│  (PDF/Word/MD)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  模板选择模块    │  ← 按内容主题推荐 themePack
│  (theme01~12)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  页面规划模块    │  ← 把章节映射为 slides + roles
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  layout:query   │  ← 获取候选 layout
│  inspect:layout │  ← 获取字段契约
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  内容填充模块    │  ← 生成 goal.json
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Dashi PPT 渲染 │  ← render:goal
│  导出 PPTX/PDF  │  ← export:pptx
└─────────────────┘
```

### 11.3 关键设计决策

| 决策点 | 建议 |
|---|---|
| 谁解析文档 | 外层 Agent（Dashi PPT 不做） |
| 谁选模板 | 外层 Agent 按内容主题决策，可询问用户确认 |
| 谁分页 | 外层 Agent 按文档大纲分页 |
| 谁填 props | 外层 Agent 按 `inspect:layout` 契约填充 |
| 图片怎么处理 | 先用 `media:stage` 拷贝到 deck 目录，再写相对路径 |
| 超长文档 | 用 `goal:scaffold` 生成长 deck 骨架，再分段填充 |

---

## 十二、限制与注意事项

### 12.1 功能限制

- ❌ 不支持直接接收文档文件作为输入
- ❌ 不支持自动生成图表数据（需调用方提供具体数值）
- ❌ 不支持自然语言直接生成完整 deck（必须转成 `goal.json`）
- ❌ 不支持同一 deck 使用多个封面
- ❌ 不支持同一 layout 在一份 deck 中重复出现

### 12.2 运行环境要求

- Node.js 20+
- npm / pnpm
- 首次运行需安装依赖
- PPTX/PDF 导出依赖 Playwright + Chromium

### 12.3 版权与合规提醒

- Dashi PPT 主题代码、视觉资产受 AGPL-3.0 保护。
- 外部 AI 调用时，只能把 Dashi PPT 作为生成引擎，不能复制其主题 CSS/Token/layout 实现到商用产品。
- 用于 lemonPPT 等后续项目时，需重新设计原创主题。

---

## 十三、总结

| 问题 | 结论 |
|---|---|
| Dashi PPT 是什么？ | 本地 Node.js Skill，输入 `goal.json`，输出 HTML/PPTX/PDF |
| 能被其他 AI 调用吗？ | 能，通过生成 `goal.json` 并调用 CLI 脚本 |
| 能上传文档直接生成吗？ | 不能，需要外层 AI 先解析文档 |
| 能选择模板吗？ | 能，通过 `themePack` 和 `layout:query` |
| 推荐调用方式？ | 外层 Agent 封装：解析文档 → 生成 goal.json → 渲染 → 导出 |

Dashi PPT 的价值在于**把结构化的内容意图稳定地渲染成视觉统一的 PPT**，而不是一个端到端的“文档理解 + 自动生成”系统。任何希望集成它的 AI 应用，都需要在 Dashi PPT 之外再搭建一层“文档理解 + 内容规划”的能力。
