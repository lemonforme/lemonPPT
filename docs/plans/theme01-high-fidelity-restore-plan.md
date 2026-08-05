# Theme01 高仿但原创还原方案

> 目标：在遵守 AGPL / 版权红线的前提下，让 theme01 视觉上接近原主题 80-90%，同时保持 lemonPPT 的通用布局体系与可维护性。
> 决策：不复制 84 个独立组件，而是按「功能 + 变体」抽象为约 18-24 个原创 layout，通过 props 控制具体呈现。

---

## 1. 核心原则

- **不复制**：不使用 `cover-editorial`、`bignum`、`versus` 等原 slot 命名。
- **不搬运**：不搬运具体排版结构、中文标签、配色数值、字体组合。
- **可学习**：学习原主题的「布局类型规划思路」（封面、目录、内容、数据、图表、章节、对比、金句、结论等）。
- **可维护**：1 个功能多个变体，变体通过 props 切换，而不是每个页面独立组件。

---

## 2. 原创命名体系

| 原分类 | 原创命名示例 |
|---|---|
| 封面 | `theme01_cover_v1` / `v2` / `v3` / `v4` |
| 目录 | `theme01_toc_v1` / `v2` |
| 内容页 | `theme01_content_v1` / `v2` / `v3` / `v4` |
| 大数字 | `theme01_metric_v1` / `v2` / `v3` |
| 图表 | `theme01_chart_bar` / `line` / `pie` / `donut` / `radar` / `area` / `scatter` / `funnel` / `pyramid` / `heatmap` |
| 章节页 | `theme01_chapter_v1` / `v2` |
| 对比 | `theme01_comparison_v1` / `v2` / `v3` |
| 时间轴 | `theme01_timeline_v1` / `v2` / `v3` |
| 路线图 | `theme01_roadmap_v1` / `v2` |
| FAQ / 团队 | `theme01_faq_v1` / `team_v1` / `team_v2` |
| 金句 / 结论 | `theme01_quote_v1` / `v2` / `closing_v1` / `v2` |
| 特殊页 | `theme01_bento_v1` / `gallery_v1` / `table_v1` / `tags_v1` / `filmstrip_v1` |

---

## 3. Token 扩展计划

在现有 `theme01` Token 基础上新增：

- **扩展色板**：图表渐变、评分卡色阶、热力色阶、强调色变体。
- **字号阶梯**：新增 96px / 120px / 144px 超大标题。
- **间距系统**：新增 tighter / loose 变体。
- **玻璃 Token**：surface opacity、blur radius、shadow level。
- **图表 Token**：网格线、label、hover 状态。

所有数值均为原创，不跟原主题撞车。

---

## 4. 大屏图表底层（Apache ECharts）

为保证极强的视觉表现力、动画丰富度与数据承载能力，阶段 P2 放弃纯 SVG 自绘，改为引入 Apache ECharts：

- `LpEChart` 容器：统一通过 `data-*` 属性暴露图表类型与配置，浏览器端初始化 SVG 渲染的 ECharts 实例。
- 按需注册 ECharts 模块（SVGRenderer、TitleComponent、TooltipComponent、各类图表模块）。
- 只读导出（PDF / PPTX 截图）同样加载 `client-render.js` 并调用 `initECharts()`，确保图表被渲染后捕获。
- PPTX 导出对复杂图表做合理降级（如 treemap 拍平为 Top-10 条形图）。

---

## 5. 分阶段实施

### 阶段 P0：骨架 + 高频页

- [ ] 扩展 theme01 CSS Token。
- [ ] 新增封面变体：`theme01_cover_v2`（双栏 / 编辑式）、`theme01_cover_v3`（Bento 网格）、`theme01_cover_v4`（刊头 / 杂志式）。
- [ ] 新增目录变体：`theme01_toc_v2`（卡片网格）。
- [ ] 新增内容页变体：`theme01_content_v3`（三栏）、`theme01_content_v4`（大字主张）。
- [ ] 新增大数字变体：`theme01_metric_v2`（多指标网格）、`theme01_metric_v3`（图标 + 说明）。
- [ ] 注册到 `registry.tsx`。
- [ ] 生成 `output/theme01-p0-preview.html` 验证。

### 阶段 P1：信息页

- [x] 章节页变体：`theme01_chapter_v2`。
- [x] 对比页变体：`theme01_comparison_v2`（评分卡）、`theme01_comparison_v3`（横向对比）。
- [x] 金句 / 结论变体：`theme01_quote_v2`、`theme01_quote_v3`。
- [x] FAQ / Team 已做，补充 `theme01_team_v2`。
- [x] 所有组件注册到 `registry.tsx` 并补充 theme01 CSS。
- [x] 生成 `output/theme01-p1-preview.html` 验证。

### 阶段 P2：大屏图表家族（Apache ECharts）

#### P2-A：基础设施 + 矩形树图

- [x] 引入 Apache ECharts 并封装 `LpEChart` 组件。
- [x] 实现 `initECharts()` / `disposeECharts()` 浏览器端初始化与销毁。
- [x] 只读页面（PDF / PPTX 截图）加载 `client-render.js` 并调用 `initECharts()`。
- [x] 首个版式 `theme01_chart_treemap`（矩形树图）注册并导出 PPTX 降级方案。
- [x] 生成 `output/theme01-p2-preview.html` 验证。

#### P2-B：高频冲击图表

- [x] 桑基图 `theme01_chart_sankey`：流量/转化路径可视化。
- [x] 旭日图 `theme01_chart_sunburst`：层级占比关系可视化。
- [x] 仪表盘 `theme01_chart_gauge`：单一指标完成率可视化。
- [x] 热力图 `theme01_chart_heatmap`：矩阵密度可视化。
- [x] 漏斗图 `theme01_chart_funnel`：转化漏斗可视化。
- [x] 雷达图 `theme01_chart_radar`：多维度能力对比可视化。

#### P2-C：长尾 / 炫技图表

- [x] 3D 柱状图 `theme01_chart_bar3d`：使用 ECharts `BarChart` + `PictorialBarChart` 模拟伪 3D 圆柱。
- [x] 关系图 `theme01_chart_graph`：使用 ECharts `GraphChart` + `force` 布局展示实体关联网络。
- [x] 词云 `theme01_chart_wordcloud`：基于自定义 SVG 力导向布局实现词云。

### 阶段 P3：特殊布局

- [ ] `theme01_bento_v1`（便当网格）。
- [ ] `theme01_gallery_v1`（图片掠影）。
- [ ] `theme01_table_v1`（表格）。
- [ ] `theme01_tags_v1`（标签墙）。
- [ ] `theme01_filmstrip_v1`（影像长卷）。

---

## 6. 验收标准

每个阶段完成后：

1. `corepack pnpm -r typecheck` 通过。
2. `corepack pnpm --filter @lemonppt/templates build` 通过。
3. 生成预览 HTML：`node scripts/render-editor.mjs <test-goal>.json output/theme01-<phase>-preview.html`。
4. 用 `node scripts/dev-server.mjs` 或 `lemonppt serve` 启动本地服务，验证编辑、添加幻灯片、添加条目、导出功能正常。

---

## 7. 风险提示

- 本方案不保证 100% 规避法律风险，仅通过「原创命名、原创 Token、原创排版、原创文案」尽量降低风险。
- 最终商用前建议由法务或开源合规专员审核。
