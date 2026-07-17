# lemonPPT 技术方案

> 基于 Dashi PPT 架构拆解，为 lemonPPT 制定的自研替代方案。
> 核心原则：**参考架构方向，不复制代码、主题、导出引擎**。

---

## 一、Dashi PPT 架构拆解

### 1.1 整体流程

```
goal.json（JSON 计划）
   ↓
deckComposer.jsx（编排：按 role 选 layout、补默认 props）
   ↓
view-model/index.jsx（生成视图模型、规范化 props、注入页码）
   ↓
renderDeck.jsx（React SSR → 静态 HTML）
   ↓
输出 index.html + assets（自包含，可离线打开）
   ↓
预览服务器 / PPTX / PDF 导出
```

关键文件：
- 编排入口：`skills/dashi-ppt/project/src/deckComposer.jsx`
- 视图模型：`skills/dashi-ppt/project/src/view-model/index.jsx`
- SSR 渲染：`skills/dashi-ppt/project/src/renderDeck.jsx`
- 模板 HTML：`skills/dashi-ppt/project/assets/template-swiss.html`

### 1.2 核心子系统

| 模块 | 职责 |
|---|---|
| **goal.json 协议** | 定义 deck、slides、props、theme、media |
| **Slide Role 体系** | 18 种页面角色：cover / metrics / trend / comparison / distribution 等 |
| **Layout 注册表** | 每个 theme 有 70~110 个独立 React 页面组件 |
| **Props 契约** | 每个 layout 声明所需字段、类型、字数上限 |
| **预览运行时** | 浏览器端水合、编辑、翻页、主题切换 |
| **导出引擎** | 截图 PDF + 可编辑 PPTX（专有软件） |

### 1.3 主题/模板样式系统

Dashi 的模板是项目自己用 React + CSS 实现的，非外购模板库：

- **12 套主题包**：`theme01` ~ `theme12`，每套一个目录。
- **每主题 N 个页面组件**：theme01 有 84 页，theme05 有 94 页。
- **设计 Token**：颜色、字号、间距、字体栈写在各主题的 `theme.js` 中。
- **Scoped CSS**：所有样式加前缀（如 `.aip-`），避免样式泄露。
- **动态背景**：使用 Unicorn Studio 场景 JSON（流体、粒子、科技背景）。
- **自托管字体**：Anton、Archivo、Caveat、IBM Plex、Inter、JetBrains Mono、Newsreader、Space Grotesk/Mono 等。
- **中文字体**：未自托管，回退到系统字体栈。

### 1.4 导出系统（⚠️ 专有，不可复用）

Dashi 的 PPTX 导出引擎是专有软件，非 AGPL：

- 位置：`skills/dashi-ppt/project/packages/html-deck-to-pptx/`
- 协议：明确限制只能作为 Dashi PPT skill 的一部分使用，禁止提取、再分发、用于其他软件。
- 源码不开放：安装版只分发 `dist/editable.min.mjs`。

**对 lemonPPT 的影响：必须自研 PPTX 导出引擎。**

---

## 二、lemonPPT 技术方案（MVP 版）

### 2.1 技术栈

- 前端框架：React 18 + TypeScript
- 样式：Tailwind CSS
- 构建：pnpm workspace + tsx + esbuild
- 导出：pptxgenjs + Playwright

### 2.2 仓库结构

```
lemonppt/
├── apps/
│   ├── web/                 # 用户端：创建/编辑/预览 deck
│   └── server/              # 可选：AI 生成、导出任务队列
├── packages/
│   ├── core/                # goal.json 类型、校验、编排逻辑
│   ├── renderer/            # React 页面组件 + 主题
│   ├── themes/              # 设计 token、原始样式
│   ├── export-pptx/         # 自研 PPTX 导出（基于 pptxgenjs）
│   └── export-pdf/          # 截图 PDF（Playwright）
└── goal.json                # 示例/测试用 deck 计划
```

### 2.3 数据协议：lemon-goal.json

参考 Dashi，但最小化。每一页直接指定 layout + props，由 AI 负责填充内容。

```json
{
  "title": "AI 产品趋势",
  "theme": "minimal",
  "language": "zh",
  "slides": [
    {
      "layout": "cover_v1",
      "props": {
        "title": "AI 产品开发趋势",
        "subtitle": "2024-2026",
        "tags": ["Agent", "多模态"]
      }
    },
    {
      "layout": "metric_v2",
      "props": {
        "value": "78%",
        "label": "工作流渗透率"
      }
    }
  ]
}
```

### 2.4 渲染流水线

1. **校验**：用 Zod 校验 goal.json 结构和 props 类型。
2. **编排**：根据 `layout` 找到对应 React 组件，注入页码、主题上下文。
3. **SSR**：`renderToStaticMarkup` 生成 HTML，插入到模板。
4. **输出**：自包含目录（HTML + CSS + 字体 + 图片）。

### 2.5 主题与模板样式系统

MVP 阶段采用 **1 个主题 × 5~8 个基础布局**，避免 Dashi 式的庞大主题矩阵。

| 布局 | 用途 |
|---|---|
| `cover_v1` | 封面 |
| `toc_v1` | 目录 |
| `content_v1` | 图文内容 |
| `metric_v1` | 大数字 |
| `quote_v1` | 金句/观点 |
| `ending_v1` | 封底/CTA |

每个布局是一个独立 React 组件：

```tsx
// packages/renderer/src/layouts/minimal/CoverV1.tsx
export function CoverV1({ title, subtitle, tags }: CoverV1Props) {
  return (
    <div className="flex h-full flex-col justify-center bg-slate-900 p-16 text-white">
      <h1 className="text-6xl font-bold">{title}</h1>
      <p className="mt-4 text-2xl text-slate-300">{subtitle}</p>
      <div className="mt-8 flex gap-2">
        {tags.map(t => (
          <span key={t} className="rounded-full bg-blue-600 px-3 py-1">{t}</span>
        ))}
      </div>
    </div>
  );
}
```

设计 Token 单独放在 `packages/themes`：

```ts
export const minimalTheme = {
  colors: {
    bg: '#0f172a',
    text: '#ffffff',
    accent: '#3b82f6',
  },
  fonts: {
    sans: 'Inter, "PingFang SC", "Microsoft YaHei", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  spacing: { page: '64px' },
};
```

### 2.6 PPTX 导出（自研）

基于 `pptxgenjs`，自己写 HTML 布局到 PPTX 的映射层。

```ts
// packages/export-pptx/src/renderSlide.ts
import PptxGenJS from 'pptxgenjs';

export function addCoverSlide(pptx: PptxGenJS, props: CoverV1Props) {
  const slide = pptx.addSlide();
  slide.background = { color: props.theme.colors.bg };
  slide.addText(props.title, {
    x: 1, y: 2, w: 8, h: 1.5,
    fontSize: 44, color: props.theme.colors.text, bold: true,
  });
  // ...
}
```

关键难点：
- **文字排版**：HTML 的 flex/absolute 和 PPTX 的坐标系统完全不同，需要为每个布局手写映射。
- **图片**：先读取 base64 或本地路径，再 `slide.addImage`。
- **字体**：导出时指定和 HTML 一致的字体名，确保系统已安装该字体。

### 2.7 PDF 导出

用 Playwright 打开渲染好的 HTML，逐页截图合成 PDF。

```ts
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`);
const slides = await page.$$('.slide');
// 逐页截图 → pdf-lib 合并
```

### 2.8 AI 生成层

AI 的职责是把用户意图转成 `lemon-goal.json`：

1. 用户输入主题/受众/页数。
2. 系统 prompt 里注入可用 layout 列表和每个 layout 需要的 props。
3. LLM 输出 JSON。
4. 校验 → 渲染 → 预览。

---

## 三、模板样式安全策略

Dashi 的主题是原创代码，但受 AGPL 保护。lemonPPT 必须完全独立设计：

| Dashi 的 | lemonPPT 该怎么做 |
|---|---|
| 12 套主题 × 80 页 | 1 套原创主题 × 5~8 页 MVP |
| `.aip-` 前缀、玻璃拟态、Unicorn 动态背景 | 自己起前缀、自己选风格（建议从极简/扁平开始） |
| Anton/Space Mono 等字体 | 换用 SIL 开源字体，如 Inter、JetBrains Mono、思源黑体 |
| 自绘制 SVG 图标 | 使用 Phosphor / Heroicons / Lucide（MIT） |
| Unicorn Studio 动态背景 | 用 CSS 渐变、SVG 图案、或自己写的 Canvas 动画 |

推荐首套主题方向：**Minimal / 深色科技风**，容易做出高级感，且代码量小。

---

## 四、开发路线图

### Phase 1：MVP（核心渲染 + 预览）

1. 确定 MVP 主题视觉方向（颜色、字体、5 个布局线框）。
2. 定义 `lemon-goal.json` 最小协议。
3. 实现 renderer：把 5 个布局写成 React 组件，能输出静态 HTML。
4. 跑通预览：起一个本地 server 查看翻页效果。

### Phase 2：导出

5. 实现 PPTX 导出：先只做封面 + 内容页两种布局的映射。
6. 实现 PDF 导出：Playwright 截图合成。

### Phase 3：AI 与产品化

7. 接入 AI：用 prompt 生成 goal.json。
8. web 端：用户输入 → AI 生成 → 预览 → 导出。

---

## 五、关键约束清单

- [ ] 不使用 Dashi PPT 的代码、模板、视觉资产。
- [ ] PPTX 导出引擎自研，不依赖 Dashi 的 `html-deck-to-pptx`。
- [ ] 所有字体、图标、图片都有商用授权。
- [ ] 最终开源协议：MIT / Apache-2.0。
