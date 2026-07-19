# lemonPPT

一句话生成可编辑的演示文稿。

lemonPPT 是一个基于 AI 的演示文稿生成与渲染引擎。它接收自然语言需求，自动规划页面结构、选择版式与主题，输出可在浏览器中编辑、可导出为 PPTX/PDF 的演示文稿。

## 特性

- **自然语言生成**：输入一句话需求，AI 自动输出 `goal.json` 页面规划。
- **主题系统**：内置极简白、深色科技、暖色商务三套主题，支持一键切换。
- **丰富版式**：封面、目录、核心数字、图文、对比、流程、引用、结尾、SWOT、PEST、图表等 18+ 版式。
- **浏览器编辑**：在线修改文字、替换图片、撤销/重做、自动保存到 localStorage。
- **导出能力**：一键导出可编辑 PPTX 与 PDF。
- **可扩展**：版式与主题均为插件化注册，易于新增。

## 技术栈

- **Monorepo**：pnpm workspace
- **前端渲染**：React 18 + TypeScript + Tailwind CSS（主题使用纯 CSS）
- **后端服务**：Express + tsx
- **导出**：pptxgenjs（PPTX）、Playwright（PDF）
- **AI**：OpenAI-compatible LLM API

## 目录结构

```
lemonPPT/
├── apps/
│   └── server/          # Express 服务与 API
├── packages/
│   ├── agent-prompts/   # AI prompt 与 goal.json 生成
│   ├── core/            # 核心类型与协议
│   ├── renderer/        # HTML/PPTX/PDF 渲染
│   ├── templates/       # 版式组件注册
│   └── themes/          # 主题 tokens 与 CSS
├── docs/                # 项目文档
│   ├── plans/           # 规划文档
│   ├── analysis/        # 方案分析
│   └── progress.md      # 进度记录
├── examples/            # 示例 goal.json
├── scripts/             # CLI 脚本
├── SKILL.md             # AI Agent 使用协议
├── LICENSE              # MIT 协议
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

### 启动服务

```bash
COREPACK_INTEGRITY_KEYS=0 corepack pnpm --filter @lemonppt/server dev
```

服务默认运行在 `http://127.0.0.1:5300`。

### 使用浏览器编辑器

打开 `http://127.0.0.1:5300/editor`。

切换主题：`http://127.0.0.1:5300/editor?theme=dark-tech`

### 生成 goal.json

```bash
OPENAI_API_KEY=your-key OPENAI_BASE_URL=https://api.openai.com/v1 OPENAI_MODEL=gpt-4o \
  node scripts/generate-goal.mjs "为我的 AI 创业公司做一份 10 页融资路演 PPT"
```

### 导出 PPTX / PDF

```bash
node scripts/render.mjs examples/sample-goal.json
node scripts/export-pptx.mjs examples/sample-goal.json
node scripts/export-pdf.mjs examples/sample-goal.json
```

## API 列表

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/generate-goal` | 根据需求生成 goal.json |
| POST | `/api/render` | 渲染为 HTML |
| POST | `/api/render-editor` | 渲染可编辑 HTML |
| POST | `/api/export/pptx` | 导出 PPTX |
| POST | `/api/export/pdf` | 导出 PDF |
| GET | `/editor` | 打开编辑器 |

## 新增版式

1. 在 `packages/templates/src/minimal/` 创建新的 React 组件。
2. 定义 `LayoutMeta` 并导出组件。
3. 在 `packages/templates/src/registry.tsx` 中注册。
4. 在三套主题的 CSS 中添加对应样式。

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

MIT
