# lemonPPT

一句话生成可编辑的演示文稿。

lemonPPT 是一个基于 AI 的演示文稿生成与渲染引擎。它接收自然语言需求，自动规划页面结构、选择版式与主题，输出可在浏览器中编辑、可导出为 PPTX/PDF 的演示文稿。

## 特性

- **自然语言生成**：输入一句话需求，AI 自动输出 `goal.json` 页面规划。
- **混合架构**：共享版式组件 + 主题 Token + CSS 变量；每个页面角色按 `(role, theme)` 二维索引注册专属版式，新增主题只需补 token + CSS。
- **多主题内置**：10 套原创主题（每套均支持多种色彩方案与外观模式）
  - `theme01` 浅色玻璃质感（light / dark）
  - `theme02` 深色霓虹科技（scheme-a / scheme-b）
  - `theme03` 代码编辑器风（scheme-a / scheme-b + light / dark）
  - `theme04` 玻璃糖果风（green / yellow / blue / pink + light / dark）
  - `theme05` 光谱报告风（coral / amber / teal / indigo / violet + light / dark）
  - `theme06` 深色图谱风（volt / magma / nebula / nova + light / dark）
  - `theme07` 冷白金融投资风（cold-white / warm-gray / ink / navy + light / dark）
  - `theme08` 曜金黑金机构风（obsidian-gold / midnight-silver / graphite-rose / forest-gold）
  - `theme09` 墨韵杂志印刷风（paper / ink 双基底 + primary / muted）
  - `theme10` 金指数据指数风（gold-index / blue-index / green-index）
- **丰富版式**：覆盖封面、目录、核心数字、统计、图表、对比、流程、时间线、路线图、引用、客户证言、FAQ、图文、分屏、特性、团队、合作伙伴、价格、图库、SWOT、PEST、结尾等 23 个页面角色，注册版式 802 个。
- **浏览器编辑**：在线修改文字、替换图片、撤销/重做、自动保存到 localStorage。
- **导出能力**：一键导出可编辑 PPTX 与 PDF。
- **本地字体集成**：内置 Anton、Archivo、Caveat、IBM Plex Sans、Inter、JetBrains Mono、Newsreader、Space Grotesk、Space Mono 9 款英文字体，以及 Noto Sans SC、Noto Serif SC 2 款中文字体，均来自 Google Fonts 并使用 SIL Open Font License 1.1。
- **可扩展**：版式、主题、主题专属变体均为插件化注册，易于新增。

## 技术栈

- **Monorepo**：pnpm workspace
- **前端渲染**：React 18 + TypeScript + Tailwind CSS（主题样式使用纯 CSS）
- **后端服务**：Express + tsx
- **导出**：pptxgenjs（PPTX）、Playwright（PDF）
- **AI**：OpenAI-compatible LLM API

## 字体与许可证

项目字体资源位于 [`packages/renderer/assets/fonts`](packages/renderer/assets/fonts)，通过 `@font-face` 在浏览器渲染和 PDF 导出中加载。

- 英文字体：Anton、Archivo、Caveat、IBM Plex Sans、Inter、JetBrains Mono、Newsreader、Space Grotesk、Space Mono（均来自 Google Fonts 官方仓库）。
- 中文字体：Noto Sans SC、Noto Serif SC（来自 Google Fonts 官方仓库）。
- 所有字体均使用 [SIL Open Font License 1.1](https://scripts.sil.org/OFL) 开源许可证，详见 [`packages/renderer/assets/fonts/LICENSE.md`](packages/renderer/assets/fonts/LICENSE.md)。

## 目录结构

```
lemonPPT/
├── apps/
│   └── server/          # Express 服务与 API
├── packages/
│   ├── agent-prompts/   # AI prompt 与 goal.json 生成
│   ├── core/            # 核心类型与协议
│   ├── renderer/        # HTML/PPTX/PDF 渲染
│   ├── templates/       # 共享版式组件与主题专属变体注册
│   └── themes/          # 主题 tokens 与 CSS
├── examples/            # 示例 goal.json 与导出的 PPTX
├── output/              # 本地生成的 HTML/PPTX/PDF/gallery
├── scripts/             # CLI 脚本
├── SKILL.md             # AI Agent 使用协议
├── LICENSE              # AGPL-3.0 协议
├── CONTRIBUTING.md      # 贡献指南（当前暂不接受外部 PR）
└── README.md            # 本文件
```

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm（通过 corepack 启用）
- macOS / Linux / WSL（PDF 导出依赖 Playwright，首次使用会自动下载 Chromium）

### 安装依赖

```bash
COREPACK_INTEGRITY_KEYS=0 corepack pnpm install
```

### 通过 npm 直接使用（无需克隆仓库）

```bash
# 生成 goal.json
npx @lemonppt/cli@0.2.0 generate "AI 产品发布会" --pages 8 --out ./goal.json

# 导出 PPTX
npx @lemonppt/cli@0.2.0 export ./goal.json --pptx ./output.pptx

# 安装 AI Agent skill
npx @lemonppt/cli@0.2.0 install-skill
```

### 启动服务

```bash
COREPACK_INTEGRITY_KEYS=0 corepack pnpm --filter @lemonppt/server dev
```

服务默认运行在 `http://127.0.0.1:5300`。

### 使用浏览器编辑器

lemonPPT 采用**单页编辑器架构**：所有主题共享同一个 `/editor` 页面，主题通过 URL 参数动态加载，保证各主题编辑器头部、交互、视觉完全一致。

```bash
# 默认主题 theme01
open http://127.0.0.1:5300/editor

# 指定主题
open http://127.0.0.1:5300/editor?theme=theme02
```

- `/editor`：返回单页编辑器 HTML，不生成静态文件。
- `/api/render-editor`：返回编辑器所需的 `EditorData` JSON（包含 slides HTML、主题 CSS 变量、主题元数据等）。
  - `GET /api/render-editor?theme=theme01`：基于 `examples/sample-goal.json` 生成指定主题的渲染数据。
  - `POST /api/render-editor`：传入完整 `goal.json`，返回对应渲染数据。

### 生成 goal.json

```bash
OPENAI_API_KEY=your-key OPENAI_BASE_URL=https://api.openai.com/v1 OPENAI_MODEL=gpt-4o \
  node scripts/generate-goal.mjs "为我的 AI 创业公司做一份 10 页融资路演 PPT"
```

### 导出 PPTX / PDF

```bash
# 示例：theme01 主题
node scripts/export-pptx.mjs examples/sample-goal.json examples/sample-goal.pptx

# 导出 PDF
node scripts/export-pdf.mjs examples/sample-goal.json output/sample-goal.pdf
```

## API 列表

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/list-themes` | 列出所有可用主题与色彩方案 |
| POST | `/api/generate-goal` | 根据需求生成 goal.json |
| POST | `/api/layout-query` | 按 `theme + role + keyword` 查询候选版式 |
| POST | `/api/inspect-layout` | 查看指定版式的字段契约、默认值与媒体槽位 |
| POST | `/api/goal-scaffold` | 生成只含 role 的 goal.json 骨架 |
| POST | `/api/write-safe-props` | 规范化 props、填充默认值、报告未知字段 |
| POST | `/api/validate-goal-spec` | 独立校验 goal.json 规范 |
| POST | `/api/render` | 渲染为 HTML |
| POST | `/api/render-editor` | 渲染可编辑 HTML |
| POST | `/api/export/pptx` | 导出 PPTX |
| POST | `/api/export/pdf` | 导出 PDF |
| GET | `/editor` | 打开单页编辑器（所有主题共享同一页面） |
| GET | `/api/render-editor` | 返回指定主题的 EditorData 渲染数据 |
| POST | `/api/render-editor` | 传入 goal.json，返回 EditorData 渲染数据 |

> 对应 CLI 子命令：`generate / export / render / list-themes / layout-query / inspect-layout / goal-scaffold / write-safe-props / validate-goal-spec / install-skill / serve`。Agent YAML 接口定义见 [`packages/cli/agents/`](packages/cli/agents/)。

## 新增版式

1. 在 `packages/templates/src/themes/<theme>/` 下创建新的 React 组件。
2. 定义 `LayoutMeta` 并导出组件（`theme` 建议设置为目标主题，如 `'theme01'`）。
3. 在 `packages/templates/src/registry.tsx` 中注册。
4. 在对应主题的 CSS 中添加样式。
5. 在 `packages/renderer/src/export-pptx.ts` 中补充 PPTX 导出映射。

## 新增主题专属变体

1. 在 `packages/templates/src/themes/<theme>/` 下创建变体组件。
2. 设置 `LayoutMeta.theme` 为目标主题，`role` 为对应页面角色。
3. 使用 `registerLayout` 注册到 `(role, theme)` 二维索引。
4. 在 `packages/renderer/src/export-pptx.ts` 中补充 `(role, theme)` 的 PPTX 覆盖。

## 新增主题

1. 在 `packages/themes/src/` 新建主题目录，包含 `tokens.ts` 与 `styles.css`。
2. 在 `packages/themes/src/index.ts` 中导出并注册。
3. 在 `apps/server/src/server.ts` 的 `resolveTheme` 中会自动识别，无需硬编码。

## 环境变量

| 变量 | 说明 |
|------|------|
| `OPENAI_API_KEY` | LLM API Key |
| `OPENAI_BASE_URL` | LLM API Base URL |
| `OPENAI_MODEL` | 模型名称，例如 `gpt-4o` |

## 许可证

本项目采用 [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE) 开源协议。

lemonPPT 是独立开发的 AI 演示文稿生成工具，与第三方 PPT 工具无代码或资产层面的依赖关系。

## 贡献

当前阶段**暂不接受外部 Pull Request**。我们欢迎通过 Issue 提交建议与反馈，正式开放贡献时会提前公告贡献者协议（CLA）流程。详见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。

**重要提示**：若你将 lemonPPT 作为网络服务部署或集成到 AI Agent 中向第三方提供服务，根据 AGPL-3.0 要求，你必须向用户公开对应版本的源代码。
