# lemonPPT 视觉审查报告

> **状态**：历史记录。2026-07-22 起主题系统已收敛为 `theme01` 单主题，`base`、`dark-tech` 与 `warm-business` 已完全移除。当前视觉统一工作以 theme01 为准。

> 审查日期：2026-07-20  
> 审查范围：`base`、`dark-tech`、`warm-business` 三套主题 × 39 个版式的 HTML 预览与 PPTX 导出  
> 审查方式：基于 `scripts/gallery.mjs` 生成的静态页面 + 源码阅读  

---

## 一、总体结论

功能链路已跑通：Agent 能按 `SKILL.md` 调用 CLI，正常生成 `goal.json`、HTML 预览、PPTX 和 PDF。但**视觉表现力不足**，会直接影响用户第一印象和“是否愿意使用”的决策。

主要问题集中在四个方面：

1. **主题颜色/字体不协调** —— `base` 主题过于朴素，`dark-tech`/`warm-business` 视觉层次差异大但部分版式未适配
2. **版式间距/对齐问题** —— 新版式（v2/v3）与老版式（v1）的留白、字号、对齐方式不统一
3. **fallback 示例内容空洞** —— 无 API Key 时生成的文案高度模板化，像“占位符 PPT”
4. **PPTX 与 HTML 预览不一致** —— 导出引擎使用硬编码配色和 Inter 字体，未跟随主题

---

## 二、具体问题

### 2.1 主题颜色/字体不协调

| 问题 | 影响 | 位置 |
|---|---|---|
| `base` 主题已移除，当前唯一主题为 `theme01`，需确保所有版式均使用 theme01 样式 | 避免 base 通用版式与 theme01 CSS 混用导致视觉不一致 | `packages/themes/src/theme01/styles.css` |
| `base` 主题标题使用系统无衬线字体，中文场景下字号 72px~80px 显得笨重 | 大标题压迫感强、不够优雅 | `.lp-cover-title`、`.lp-closing-title` 等 |
| `dark-tech` 与 `warm-business` 对部分新版式（`feature_v2`、`pricing_v2`、`team_v2` 等）只做了颜色替换，未做质感适配 | 新版式在深色/暖色主题下显得扁平 | `packages/themes/src/dark-tech/styles.css`、`warm-business/styles.css` |
| 图表颜色在三个主题中均为硬编码色值（`#0071e3`、`#5e5ce6`…），与主题 accent 不一致 | 图表看起来像贴图，破坏整体风格 | `.lp-chart-color-*` |

### 2.2 版式间距/对齐问题

| 问题 | 影响 | 位置 |
|---|---|---|
| 新版式统一使用 `padding: 64px 80px`，老版式使用 `padding: 80px 96px`，混用时视觉密度不一致 | 同一 deck 中有的页拥挤、有的页空旷 | 各 `.lp-xxx-v2` / `.lp-xxx-v3` |
| `team_v2` 使用 `grid-template-columns: repeat(4, 1fr)`，但 fallback 默认只有 3 个成员，右侧大面积空白 | 布局失衡 | `.lp-team-v2-grid` |
| `pricing_v2` 高亮卡片使用 `background: var(--lp-accent)`，但 feature 列表的 `✓` 颜色在部分主题下对比度不足 | 可读性下降 | `.lp-pricing-v2-card-highlighted .lp-pricing-v2-feature-item::before` |
| `metric_v3` 双卡片在 2 列布局下，若数值较短会显得中间很空 | 重心不稳 | `.lp-metric-v3-grid` |
| 多数字体大小以 px 硬编码，未按 1280×720 画布做统一规范 | 不同页标题层级感弱 | 多处 |

### 2.3 fallback 示例内容空洞

| 问题 | 影响 | 位置 |
|---|---|---|
| `createFallbackGoal` 固定使用 9 个基础 slide，前 5 页内容几乎与输入无关 | 用户拿到一份“看起来像示例”的 PPT | `packages/agent-prompts/src/fallback.ts` |
| 关键数据页固定写死 `效率提升 10 倍`、`Q1~Q4 增长 12,19,28,40` | 即使用户主题与效率无关，也出现这些数字 | `fallback.ts` `metric_v1`、`chart_v1` props |
| 从未使用新版式（`roadmap_v2`、`pricing_v2`、`feature_v2`、`team_v2`、`metric_v3`） | 新版式在 fallback 中无法被用户看到，浪费开发成本 | `fallback.ts 基础 slide 列表` |
| 补充页文案为 `"围绕“${title}”展开说明"`，重复且无信息量 | 页数一多就非常敷衍 | `fallback.ts` 填充逻辑 |

### 2.4 PPTX 与 HTML 预览不一致

| 问题 | 影响 | 位置 |
|---|---|---|
| PPTX 导出统一使用 `COLORS = { primary: '0F172A', accent: '3B82F6', ... }`，不读取 `goal.json` 的 `theme` | 深色主题导出后仍是“商务蓝白” | `packages/renderer/src/export-pptx.ts` |
| 字体统一为 `Inter`，中文环境在 PowerPoint 中会 fallback 到系统字体，且未做中英文区分 | 中文排版松散、字号感不一致 | `export-pptx.ts` `FONTS` |
| 新版式 PPTX 导出大量依赖 `addShape('rect')` 和 `addText` 简单堆叠，缺少圆角、阴影、图标等视觉元素 | 导出文件“能看但不精美” | `renderRoadmapV2`、`renderPricingV2` 等 |
| 图片/远程 URL 在 PPTX 中显示占位符 | 含图片的页导出后效果差 | `addImageMaybe` fallback |

---

## 三、优化方案

### 3.1 短期（1~3 天，高 ROI）

#### A. 优化 fallback 内容

目标：让无 API Key 时生成的 deck 也能“看起来像为当前主题定制的”。

- 从输入中提取更多信号：
  - 数字 → 填充到 `metric_v1` / `stats_v1` / `chart_v1`
  - “团队”、“我们” → 使用 `team_v2`
  - “价格”、“套餐”、“方案” → 使用 `pricing_v2`
  - “路线图”、“规划”、“阶段” → 使用 `roadmap_v2`
  - “特性”、“功能”、“优势” → 使用 `feature_v2`
- 根据 `pageCount` 动态组合 slide，避免固定 9 页
- 默认引入至少 2 个新版式，展示最新能力
- 关键数据不再写死，而是根据输入提取或生成更合理的占位数字

#### B. 统一 `base` 主题视觉规范

- 给 `.lp-slide` 增加 subtle 背景渐变或纹理，提升质感
- 统一标题字号规范：
  - 封面主标题：64px
  - 内容页标题：44px
  - 卡片标题：24px
  - 正文：18px
- 统一卡片阴影和圆角，减少“扁平感”
- 图表颜色改为使用 CSS 变量或主题 accent 派生

#### C. 修复明显布局 bug

- `team_v2`：当成员 ≤3 时改为 3 列；成员 4 时改为 4 列
- `pricing_v2`：高亮卡片 feature 列表增加对比度
- `metric_v3`：数值区域增加背景色块或居中强化

### 3.2 中期（1~2 周）

#### D. PPTX 导出主题化

- 为每个主题定义 PPTX 配色和字体映射
- `export-pptx.ts` 读取 `goal.theme`，按主题选择 `COLORS` 和 `FONTS`
- 中文语言下使用 `'Microsoft YaHei'` / `'PingFang SC'` 等中文字体

#### E. 新版式 PPTX 视觉补强

- `roadmap_v2`、`pricing_v2`、`feature_v2`、`team_v2`、`metric_v3` 增加：
  - 圆角矩形背景
  - 主题色强调
  - 适当的阴影/边框
  - 图标或色块装饰

#### F. 建立视觉回归机制

- 在 `scripts/gallery.mjs` 基础上，增加每个版式 × 主题 × 关键尺寸的截图或 HTML 快照
- 每次修改主题/版式后，diff 快照防止回归

### 3.3 长期（1 个月内）

#### G. 主题设计系统

- 提取统一的 design tokens：间距阶梯（8/16/24/32/48/64）、字号阶梯、圆角、阴影
- 所有主题基于 tokens 重写，确保新增主题时只需改 tokens

#### H. 素材与占位图

- 提供主题相关的默认占位背景图/渐变
- 为 cover、image、gallery 等版式提供高质量的默认图片或生成式占位

---

## 四、验收标准

优化完成后，应满足：

1. 无 API Key 生成的 deck 至少包含 2 个新版式，且文案与输入主题相关度 ≥60%
2. `base` 主题在 gallery 中看起来不再像“默认模板”
3. PPTX 导出后，主题颜色与 HTML 预览一致（允许字体因 Office 环境有细微差异）
4. 同一 deck 中，各页留白、字号层级、对齐方式无明显跳变
5. `corepack pnpm test` 和 `corepack pnpm gallery` 持续通过

---

## 五、建议立即执行项

如果只能做一件，优先做 **fallback 内容优化**：

- 它不改动主题/CSS，风险最低
- 直接解决“内容空洞”问题
- 能让用户在 Agent 实测中立刻看到更丰富的版式组合

下一步可依次进行：
1. 优化 `packages/agent-prompts/src/fallback.ts`
2. 统一 `base` 主题字号/间距规范
3. 让 PPTX 导出读取主题配置
