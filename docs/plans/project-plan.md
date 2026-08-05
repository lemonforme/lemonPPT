# lemonPPT 项目规划文档

> **项目定位**：完全自研的 AI PPT 生成 Agent 工作流项目，不依赖 `dashi-ppt-skill` 代码。
> **当前存放位置**：`/Users/apple/工作/lemonPPT/`
> **版本**：v0.1.6
> **开源协议**：AGPL-3.0-or-later

---

## 一、为什么完全自研

| 对比项 | 基于 dashi-ppt 二次开发 | 完全自研（lemonPPT） |
|---|---|---|
| 协议约束 | AGPL-3.0 传染性，网络服务需开源全部 | 采用 AGPL-3.0-or-later，独立可控 |
| 导出引擎 | `html-deck-to-pptx` 专有，不能复用 | 自研 PPTX 导出，无侵权风险 |
| 商业化自由度 | 受限 | 完全自由 |
| 短视频分享 | 容易引发协议争议 | 可安全展示全部代码与使用过程 |
| 品牌独立性 | 弱 | 强，可建立个人/团队品牌 |

结论：**为了长期商业化、短视频内容安全和社区贡献自由度，选择完全自研。**

---

## 二、项目目标

### 核心能力

1. 用户用自然语言描述 PPT 需求，Agent 输出结构化 `goal.json`。
2. 系统根据 `goal.json` 从自研模板库中组合页面，渲染成可离线打开的 HTML 翻页 PPT。
3. 提供浏览器内编辑器：改文字、换图片、调版式、换主题、拖拽排序。
4. 支持导出：HTML 离线包 / PDF / 可编辑 PPTX。
5. 所有生成与导出在本地完成，不上传用户内容。

### 质量目标

- 初期：1 套主题 + 8~12 个版式，覆盖常见汇报场景。（已完成）
- 中期：3 套主题，50+ 版式，覆盖 20 个页面角色。（当前：3 主题 / 50 个共享版式 + 5 个主题专属变体 / 约 23 角色）
- 长期：8~12 套主题，100+ 版式，支持多种图表与分析模型。

---

## 三、技术架构

```
用户自然语言需求
    ↓
Agent 规划器（LLM + prompt）
    ↓
goal.json（slides[].layout + props）
    ↓
模板库（React 版式组件）
    ↓
渲染引擎 → 静态 HTML + assets
    ↓
本地预览服务器
    ↓
导出层：PPTX / PDF / HTML
```

### 技术栈

| 模块 | 技术选型 | 说明 |
|---|---|---|
| 前端框架 | React 18 + TypeScript | 组件化版式，类型安全 |
| 样式系统 | Tailwind CSS + CSS 变量 | 支持多主题切换 |
| 动画 | GSAP | 入场动画、翻页过渡 |
| 静态渲染 | ReactDOMServer / 自建 render | 输出完整 HTML |
| 本地服务 | Express / Fastify | 预览、自动保存、导出接口 |
| PPTX 导出 | pptxgenjs | 自研映射层，保持文字可编辑 |
| PDF 导出 | Playwright | 打印/截图生成 PDF |
| 数据校验 | Zod | goal.json 与 props 校验 |
| 包管理 | pnpm workspace | 多包管理 |

---

## 四、目录结构

```
lemonPPT/
├── apps/
│   └── server/                 # 本地预览与导出服务（Node）
├── packages/
│   ├── agent-prompts/          # Agent prompt 与 fallback 内容生成
│   ├── cli/                    # 命令行工具与 SKILL.md 分发
│   ├── composer/               # 基于 role 的版式选择、页码注入、默认 props
│   ├── core/                   # goal.json 类型、schema、校验
│   ├── renderer/               # HTML 渲染引擎 + PPTX/PDF 导出
│   ├── templates/              # 版式组件库（共享组件，多主题 CSS 变量适配）
│   ├── themes/                 # 主题样式与 token
│   └── view-model/             # props 规范化、截断、数组字段补齐
├── scripts/                    # 开发脚本（gallery、snapshot、agent-test、audit-layouts 等）
├── docs/
│   ├── plans/                  # 项目规划文档
│   ├── analysis/               # 方案分析与复盘
│   └── progress.md             # 进度记录
├── README.md
├── LICENSE
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

> **与 dashi-ppt-skill 的隔离原则**：lemonPPT 目录独立，不引用上级目录任何代码或资源。

---

## 五、核心数据协议

### goal.json 示例

```json
{
  "title": "Q2 增长复盘",
  "goal": "向投资人汇报 Q2 增长情况与下半年规划",
  "audience": "投资人 / 高管",
  "owner": "增长团队",
  "theme": "minimal",
  "language": "zh",
  "pageCount": 10,
  "randomSeed": "q2-review-20260717-a1b",
  "slides": [
    {
      "layout": "cover_v1",
      "props": {
        "kicker": "增长复盘",
        "title": "Q2 增长复盘",
        "subtitle": "用户、收入与产品进展",
        "date": "2026.07"
      }
    },
    {
      "layout": "metric_v2",
      "props": {
        "kicker": "核心指标",
        "value": "120%",
        "unit": "环比增长",
        "description": "Q2 总收入相比 Q1 实现翻倍增长"
      }
    }
  ]
}
```

### 设计原则

- 每页只承载一个主要信息角色。
- `slides[].layout` 必须唯一，避免重复版式。
- `props` 只包含内容和用户明确要求调整的属性，不修改样式字段。
- 数组字段按可见数量填满真实文案，不残留模板默认文案。

---

## 六、模板库开发策略

### 页面角色（当前已覆盖）

| 角色 | 说明 | 当前版式数 |
|---|---|---|
| cover | 封面 | 2 |
| tableOfContents | 目录 | 1 |
| metric | 核心数字/指标 | 3 |
| stats | 统计摘要 | 2 |
| chart | 图表页 | 2 |
| comparison | 对比页 | 3 |
| process | 流程/时间线 | 3 |
| timeline | 时间线 | 3 |
| roadmap | 路线图 | 2 |
| quote | 引用/观点 | 3 |
| testimonial | 客户证言 | 3 |
| faq | 问答 | 1 |
| content | 图文内容 | 4 |
| split | 分栏内容 | 1 |
| feature | 产品特性 | 3 |
| team | 团队介绍 | 2 |
| partners | 合作伙伴 | 1 |
| pricing | 价格方案 | 2 |
| gallery | 图片墙 | 3 |
| image | 单图页 | 2 |
| swot | SWOT 分析 | 1 |
| pest | PEST 分析 | 1 |
| closing | 结尾/感谢 | 2 |

### 主题系统

- 用户侧统一暴露 `theme01`，`base` 通用版式池、`dark-tech`、`warm-business` 已完全移除。
- 每个页面角色均注册 `theme01` 专属版式，实现视觉完全统一；新增主题时按 `packages/themes/src/<theme>/` + `packages/templates/src/themes/<theme>/` 目录扩展，并在 `(role, theme)` 注册表中为每个角色注册专属版式。
- 使用 CSS 变量定义颜色、字体、间距、圆角。

### 视觉资产要求

| 资产 | 来源要求 |
|---|---|
| 字体 | SIL OFL 协议字体，如 Inter、思源黑体、JetBrains Mono |
| 图标 | MIT/Apache 图标库，如 Lucide、Heroicons |
| 图片/视频 | 自生成、CC0 图库、或购买可开源授权 |
| 模板设计 | 原创设计，或购买可转代码/可开源授权 |

---

## 七、导出引擎设计

### PPTX 导出

- 每个 layout 实现 `toPptx(slide, props)` 映射函数。
- 优先使用 `pptxgenjs` 原生对象：文本框、形状、图片、图表。
- 文字保持可编辑，复杂装饰 fallback 为图片。
- 支持主题颜色映射到 PPTX 主题色。

### PDF 导出

- 使用 Playwright 打开本地预览地址。
- 每页调用 `page.pdf()` 或打印模式生成单页 PDF。
- 合并为完整 PDF 文件。
