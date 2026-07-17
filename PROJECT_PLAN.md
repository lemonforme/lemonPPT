# lemonPPT 项目规划文档

> **项目定位**：完全自研的 AI PPT 生成 Agent 工作流项目，不依赖 `dashi-ppt-skill` 代码，后续以宽松开源协议开源。
> **当前存放位置**：`/Users/apple/Downloads/dashi-ppt-skill-main/lemonPPT/`（临时借用大师 PPT 目录便于查看，后续可整体迁移）。
> **版本**：v0.1.0（规划版）
> **建议开源协议**：MIT 或 Apache-2.0

---

## 一、为什么完全自研

| 对比项 | 基于 dashi-ppt 二次开发 | 完全自研（lemonPPT） |
|---|---|---|
| 协议约束 | AGPL-3.0 传染性，商用需开源全部 | 自主决定，推荐 MIT/Apache-2.0 |
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

- 初期：1 套主题 + 8~12 个版式，覆盖常见汇报场景。
- 中期：3~5 套主题，50+ 版式，覆盖 10 个页面角色。
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
│   ├── editor/                 # 浏览器端编辑器（React）
│   └── server/                 # 本地预览与导出服务（Node）
├── packages/
│   ├── core/                   # goal.json 类型、schema、校验
│   ├── renderer/               # HTML 渲染引擎
│   ├── templates/              # 版式组件库
│   ├── themes/                 # 主题样式与 token
│   ├── pptx-export/            # PPTX 导出引擎（自研核心）
│   ├── pdf-export/             # PDF 导出
│   └── agent-prompts/          # Agent 技能描述与 prompt
├── assets/
│   └── fonts/                  # 可商用字体
├── docs/
│   ├── ARCHITECTURE.md         # 架构文档
│   ├── TEMPLATE_GUIDE.md       # 版式开发指南
│   ├── EXPORT_ENGINE.md        # 导出引擎设计
│   └── OPEN_SOURCE_CHECKLIST.md# 开源合规检查清单
├── README.md
├── LICENSE
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.json
```

> **与 dashi-ppt-skill 的隔离原则**：lemonPPT 目录独立，不引用上级目录任何代码或资源；后续可直接压缩/拷贝整个 `lemonPPT/` 文件夹迁移到新仓库。

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

### 页面角色（初期）

| 角色 | 说明 | 初期版式数 |
|---|---|---|
| cover | 封面 | 2 |
| tableOfContents | 目录 | 1 |
| metric | 核心数字/指标 | 2 |
| chart | 图表页 | 2 |
| comparison | 对比页 | 1 |
| process | 流程/时间线 | 1 |
| quote | 引用/观点 | 1 |
| closing | 结尾/感谢 | 1 |

### 主题系统

- 每套主题独立目录：`packages/themes/minimal/`、`packages/themes/dark-tech/`。
- 使用 CSS 变量定义颜色、字体、间距、圆角。
- 版式组件通过 `data-theme="minimal"` 自动应用主题样式。

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

### HTML 离线包

- 渲染结果写入 `dist/index.html` 和 `dist/assets/`。
- 字体、图标、媒体资源一并打包。
- 双击即可离线打开浏览。

---

## 八、Agent 工作流

1. **收集需求**：主题、受众、页数、重点结论、是否需要图片/视频。
2. **选择主题**：展示内置主题预览，等待用户确认。
3. **生成计划**：输出 `goal.json`，包含每页 `layout` 与 `props`。
4. **校验安全**：Zod 校验 goal.json，自动修复越界字段。
5. **渲染输出**：生成 HTML 并启动本地预览服务。
6. **用户编辑**：浏览器内修改文字、图片、版式、动画。
7. **导出交付**：HTML / PDF / PPTX。

### Agent Prompt 核心要求

- 不得擅自决定主题、页数、媒体策略，除非用户明确委托。
- 所有可见文案必须覆盖，不残留模板默认文字。
- 图表页的数据与结论文案必须一致。
- 输出前运行校验脚本。

---

## 九、开发路线图

### Phase 1：MVP（第 1~4 周）—— 已完成

- [x] 搭建 monorepo 目录与 pnpm workspace
- [x] 定义 `core` 包：goal.json 类型与 Zod schema
- [x] 设计并实现 1 套主题（minimal）
- [x] 实现 8 个基础版式组件
- [x] 实现 HTML 渲染引擎
- [x] 实现本地预览服务器
- [x] 编写 Agent prompt，实现自然语言 → goal.json

### Phase 2：编辑与导出（第 5~8 周）—— 已完成

- [x] 浏览器端文本编辑器
  - [x] 版式组件接入可编辑字段（`data-lp-editable`）
  - [x] `EditableField` 辅助组件
  - [x] `renderDeck(goal, { editable: true })`
  - [x] 顶部工具栏：下载 goal.json、导出 PPTX
  - [x] Server：`GET /editor` + `POST /api/render-editor`
  - [x] 编辑器 UI 升级：左侧缩略图面板、中央画布自适应缩放、右侧属性面板、选中元素高亮
- [x] 浏览器端换图能力
  - [x] 图片 URL 输入替换
  - [x] 图片本地上传输入框（转 base64 存入 goal）
  - [x] 图片占位版式与渲染支持（minimal_cover_v1）
- [x] 实现 PPTX 导出（覆盖 MVP 版式）
- [x] 实现 PDF 导出（Playwright + @media print）
- [x] 自动保存与状态管理
  - [x] localStorage 自动保存编辑状态
  - [x] 撤销 / 重做
- [x] 添加 2~3 套新主题
  - [x] dark-tech（深色科技风）
  - [x] warm-business（暖色商务风）

### Phase 3：扩展与打磨（第 9~12 周）

- [~] 扩展版式到 30~50 个（已新增 15 个版式，从 8 个扩展到 23 个）
- [x] 支持图表组件（柱状图、折线图、饼图等）
- [x] 支持分析模型版式（SWOT、PEST 等）
- [x] 完善错误处理与日志
- [x] 编写完整文档（README，后续可补充 CONTRIBUTING 与架构文档）
- [x] 添加自动化测试（vitest + supertest，21 个用例）

### Phase 4：开源准备（第 13~14 周）

- [ ] 视觉资产版权审计
- [ ] 代码原创性审计（确保无 dashi-ppt 代码残留）
- [ ] 选择并添加 LICENSE（MIT/Apache-2.0）
- [ ] 编写 README、CONTRIBUTING、CODE_OF_CONDUCT
- [ ] 迁移到独立 GitHub 仓库并开源

---

## 十、开源合规检查清单

- [ ] 所有代码均为原创或来自宽松协议依赖
- [ ] 未复制 `dashi-ppt-skill` 任何代码、模板、CSS、脚本
- [ ] 未使用 `html-deck-to-pptx` 或其他专有组件
- [ ] 字体使用 SIL OFL 或同等宽松协议
- [ ] 图标使用 MIT/Apache-2.0 协议
- [ ] 图片/视频为原创、CC0 或已购买可开源授权
- [ ] 第三方依赖协议与目标开源协议兼容
- [ ] 已添加 LICENSE 文件
- [ ] 已注明所有第三方资产来源与协议
- [ ] README 中明确说明项目为独立实现

---

## 十一、短视频内容规划

### 可安全拍摄的内容

| 方向 | 内容示例 |
|---|---|
| 从 0 构建 | "我花 X 周写了一个 AI PPT 生成器" |
| 技术拆解 | "Agent 怎么把一句话变成 10 页 PPT" |
| 设计过程 | "一个 PPT 版式从 Figma 到代码" |
| 开源历程 | "为什么我要完全自研并开源" |
| 使用演示 | "用 lemonPPT 生成一份融资路演 PPT" |
| 避坑指南 | "AI PPT 项目的协议陷阱" |

### 不建议说的内容

- "我改进了 Dashi PPT"（暗示基于其代码）
- "基于某某开源项目二开"（若实际是自研则没必要）
- 直接展示 `dashi-ppt-skill` 的代码或界面作为主内容

---

## 十二、后续迁移说明

当 lemonPPT 准备独立时，只需执行：

```bash
mv /Users/apple/Downloads/dashi-ppt-skill-main/lemonPPT /path/to/new-repo
```

然后在新仓库初始化 git：

```bash
cd /path/to/new-repo
git init
git add .
git commit -m "init: lemonPPT - self-developed AI PPT agent"
```

由于 lemonPPT 与 `dashi-ppt-skill` 无代码依赖，迁移后无协议污染风险。

---

## 十三、写在最后

lemonPPT 的核心竞争力不是代码本身，而是：

1. **稳定的版式质量**——持续积累高质量主题与版式。
2. **流畅的 Agent 工作流**——让 LLM 稳定输出可渲染的 JSON。
3. **本地优先的隐私体验**——用户内容不上云。
4. **开放的社区生态**——开源后吸引设计师与开发者贡献版式。

先跑通 MVP，再逐步扩展。第一个可用的 HTML PPT 出来，就可以开始发视频了。
