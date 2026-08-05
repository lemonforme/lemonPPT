# theme01 页面组件分析

## 一、总体规模

- **主题名称**：轻拟态风
- **总页数**：84 页
- **slot 数量**：84 个（每个 slot 只出现 1 次，即每页一种独特布局）
- **背景类**：全部为默认背景 `(default)`，通过 `aip-bg-a` / `aip-bg-b` 等 CSS 类在组件内控制

---

## 二、页面组件分类

### 2.1 封面类（7 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page001 | cover-editorial | 封面 · 编辑式双栏 |
| page002 | cover-minimal | 封面 · 居中极简 |
| page003 | cover-bento | 封面 · 模块化便当格 |
| page004 | cover-masthead | 封面 · 磨砂玻璃刊头 |
| page005 | cover | 封面 |
| page062 | hero-compute | 满版图片 · 算力新基建 |
| page063 | mag-cover | 杂志封面 · 算力军备竞赛 |

### 2.2 数据 / 指标类（6 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page006 | bignum | 大数字 · 资本体量 |
| page007 | statgrid | 关键数字一览 |
| page050 | scorecard | 标的评分卡 · 尽调五维 |
| page051 | bubble-scatter | 市销率天梯 · 估值 vs 收入 |
| page064 | arc-gauges | 关键占比 · 柱状图 |
| page074 | kpi-dial | 环形仪表 · 关键比率 |

### 2.3 图表类（27 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page012 | trend | 纵向趋势 |
| page017 | treemap | 赛道资金 · 矩形树图 |
| page018 | sankey | 资金流向 · 桑基图 |
| page019 | ranking | 头部玩家 |
| page022 | funnel | 资金集中度 · 漏斗 |
| page023 | tier-pyramid | 估值梯队 · 金字塔 |
| page031 | quadrant | 资本四象限 |
| page033 | table | 表格 · 轮次明细 |
| page053 | heatmap | 资金热力矩阵 |
| page054 | growth-bars | 增速排行 · 条形图 |
| page055 | lollipop | 吸金力排行 · 棒棒糖图 |
| page056 | slope | 资金迁移 · 斜率图 |
| page059 | stream-area | 流式面积图 · 构成演变 |
| page060 | bullet | 子弹图 · 目标达成度 |
| page061 | gantt | 甘特排期 · IPO 上市窗口 |
| page065 | radar | 三强能力雷达 |
| page066 | matrix | 能力对比矩阵 |
| page067 | waterfall | 资金瀑布 · 构成 |
| page068 | dumbbell | 估值跃迁 · 哑铃图 |
| page070 | bump-rank | 排位赛 · 座次变化 |
| page071 | stacked-mix | 构成演变 · 百分比堆叠 |
| page072 | waffle | 像形方格图 · 资金去向 |
| page075 | grouped-columns | 同比对比 · 分组柱状图 |
| page077 | diverging | 多空信号 · 双向条形 |
| page078 | polar-rose | 玫瑰图 · 赛道占比 |
| page079 | donut | 甜甜圈 · 资金来源占比 |
| page080 | mekko | 赛道 × 阶段 · 可变宽堆叠 |

### 2.4 内容 / 文本类（8 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page009 | contents | 报告导览 · 目录 |
| page010 | method | 横纵分析法 |
| page014 | chain | 产业链分层 |
| page015 | compute | 算力上游 · 卖铲子 |
| page016 | sector | 赛道分布 · 融资额占比 |
| page073 | editorial | 专题特写 · AI Agent |
| page082 | type-statement | 大字主张 · 从叙事到兑现 |
| page084 | appendix | 附录 · 数据来源 |

### 2.5 章节 / 过渡类（6 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page011 | chapter-market | 章节 · 市场全景 |
| page013 | chapter | 章节 · 横向透视 |
| page024 | chapter-case | 章节 · 典型案例 |
| page030 | banner-embodied | 前沿赛道 · 具身智能 |
| page036 | chapter-risk | 章节 · 风险与展望 |
| page041 | banner-ipo | 满版图片 · IPO 退出窗口 |

### 2.6 案例 / 对比类（7 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page025 | versus | 三强横向对比 |
| page026 | case | 典型案例 |
| page029 | case-strength | 核心竞争力 |
| page043 | split-diptych | 满版对比 · 双联画面 |
| page045 | case-xai | 典型案例 · xAI |
| page046 | case-coreweave | 典型案例 · CoreWeave |
| page081 | triptych | 满版影像 · 三联现场 |

### 2.7 时间 / 流程类（4 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page028 | timeline | 里程碑时间轴 |
| page040 | roadmap | 阶段性策略路线图 |
| page044 | monthly | 月度节奏 |
| page058 | zigzag-timeline | 年度关键节点 · 纵向时间线 |

### 2.8 金句 / 结论类（3 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page027 | quote-dario | 金句 · CEO 视角 |
| page047 | quote | 金句 · 一句话总结 |
| page083 | conclusion | 结论 |

### 2.9 其他布局（16 页）

| 页码 | Slot | 中文标签 |
|---|---|---|
| page008 | bento | 便当速览 · 一图读懂 |
| page020 | gallery | 头部玩家掠影 |
| page021 | table-top10 | 表格 · Top 10 |
| page032 | rounds | 轮次结构 |
| page034 | region | 地区分布 |
| page035 | feature-region | 湾区 · 地理护城河 |
| page037 | sticker-bubble | 大数字 · 估值泡沫 |
| page038 | risk | 风险研判 |
| page039 | outlook | 投资展望 |
| page042 | evil-trio | 三个数字 · 资本格局 |
| page048 | global-split | 全球版图 · 资金分布 |
| page049 | investors | 活跃投资机构榜 |
| page052 | collage-frontier | 贴纸拼贴 · 前沿掠影 |
| page057 | spotlight-tags | 标签化特写 · 前沿掠影 |
| page069 | sticker-wall | 年度热词 · 标签墙 |
| page076 | filmstrip | 影像长卷 · 关键时刻 |

---

## 三、关键发现

### 3.1 每个 slot 只对应一页

theme01 没有「一个 layout 模板复用多次」的设计，而是**每一页都是独立组件**。这意味着：

- 视觉表现力极强，每页都有独特设计。
- 代码量很大：84 个独立 React 组件。
- 维护成本高：新增/修改主题都需要大量设计工作。

### 3.2 图表类占最大比重

27 个图表类布局，占 theme01 的 **32%**。这反映了 Dashi 面向数据密集型汇报（融资、市场分析）的定位。

### 3.3 封面设计非常丰富

7 种封面变体，说明 Dashi 非常重视第一印象。每个变体适应不同内容密度和视觉风格。

### 3.4 没有严格的「布局模板库」

Dashi 没有抽象出通用的「双栏」「三列」模板，而是直接为每个业务场景写死排版。优点是视觉精致，缺点是扩展性差。

---

## 四、对 lemonPPT 的启示

### 4.1 不要学 Dashi 的「一页一组件」

MVP 阶段 lemonPPT 应该：

- 定义 5~8 个通用布局模板。
- 每个模板通过 props 控制内容。
- 主题通过 Token 切换视觉风格。

这样 1 个主题只需要 5~8 个组件，而不是 84 个。

### 4.2 最值得优先实现的布局

按使用频率和 MVP 价值排序：

| 优先级 | 布局 | 对应 Dashi slot |
|---|---|---|
| P0 | 封面 | cover / cover-minimal / cover-editorial |
| P0 | 目录 | contents |
| P0 | 内容页 | method / chain / compute |
| P0 | 大数字 | bignum |
| P1 | 章节页 | chapter / chapter-market |
| P1 | 对比页 | versus |
| P1 | 金句页 | quote |
| P1 | 封底/结论 | conclusion / appendix |

### 4.3 图表类可以后期引入

27 个图表布局虽然壮观，但实现成本高。lemonPPT 初期可以用：

- 简单条形图/饼图（基于 SVG 或 pptxgenjs 原生图表）
- 大数字 + 简短说明替代复杂图表
- 后续再逐步增加图表类型

---

## 五、不能踩的红线

- ❌ 不能复制 theme01 的 84 个组件代码
- ❌ 不能复用 `cover-editorial`、`bignum`、`versus` 等 slot 命名
- ❌ 不能复用页面的中文标签文案
- ❌ 不能复用具体的排版结构、配色、字体组合
- ❌ 不能复用图表的视觉样式

✅ 可以学习的是：**布局类型的规划思路**（封面、目录、内容、数据、图表、章节、对比、金句、结论）。
