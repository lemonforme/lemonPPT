# Dashi PPT theme03 设计 Token 与页面组件分析

> 仅作研究参考。theme03 是 Dashi PPT 的原创设计，受 AGPL-3.0 保护，这些 Token、样式、布局不能直接用于 lemonPPT。
> 数据来源：
> - `skills/dashi-ppt/project/src/components/themes/theme03/metadata.js`
> - `skills/dashi-ppt/project/src/components/themes/theme03/source/src/theme.css`
> - `skills/dashi-ppt/project/src/components/themes/theme03/source/src/theme.js`
> - `skills/dashi-ppt/project/src/components/themes/theme03/source/src/registry.js`

---

## 一、主题定位

| 属性 | 内容 |
|---|---|
| **主题名** | 深浅代码风 |
| **英文名风格** | Editorial / Brutalist Grotesque |
| **适用场景** | 技术方案、开发者大会、系统架构、AI 工程实践、投融资研究报告 |
| **目标受众** | 工程师、技术管理者、架构师、开发者社区、投资人 |
| **视觉关键词** | 深色主导、电光蓝强调、荧光绿点缀、粗体字重、等宽标签、高对比、模块化 |
| **总页数** | 77 页 |
| **布局数量** | 77 个独立 slot（每页一种） |
| **配色方案** | 浅色 / 深色双模式 + 蓝色 / 荧光绿双强调色 |

---

## 二、设计 Token 系统

### 2.1 颜色 Token

theme03 的 Token 以 `--rd-` 为前缀，全部定义在 `.rd-slide` 作用域内，并通过 `.rd-dark` 修饰符切换深浅模式。

#### 浅色模式（默认）

| Token | 色值 | 用途 |
|---|---|---|
| `--rd-bg` | `#d6d6d3` | 页面背景（暖灰） |
| `--rd-ink` | `#161513` | 主文字（近黑） |
| `--rd-ink-2` | `#5c5b57` | 次要文字 |
| `--rd-ink-3` | `#908f8a` | 弱化信息 |
| `--rd-line` | `rgba(22,21,19,0.20)` | 边框、分割线 |
| `--rd-line-2` | `rgba(22,21,19,0.10)` | 弱化分割线 |
| `--rd-blue` | `#2742ec` | 主强调色（电光蓝） |
| `--rd-blue-ink` | `#f3f5ff` | 蓝底上的文字 |
| `--rd-lime` | `#c2f53d` | 次强调色（荧光绿） |
| `--rd-panel` | `#1a1916` | 深色面板/模块 |

#### 深色模式

| Token | 色值 | 用途 |
|---|---|---|
| `--rd-bg` | `#161513` | 页面背景（近黑） |
| `--rd-ink` | `#f3f2ee` | 主文字（米白） |
| `--rd-ink-2` | `#b8b6b0` | 次要文字 |
| `--rd-ink-3` | `#84827c` | 弱化信息 |
| `--rd-line` | `rgba(243,242,238,0.22)` | 边框、分割线 |
| `--rd-line-2` | `rgba(243,242,238,0.10)` | 弱化分割线 |
| `--rd-panel` | `#f3f2ee` | 浅色面板/模块 |

#### 图表中性色阶

用于保持图表克制，让单个强调色（蓝/绿）突出：

- 浅色：`['#2b2a27', '#56544f', '#84827c', '#a9a7a1', '#c4c2bc']`
- 深色：`['#d8d6d0', '#a9a7a1', '#84827c', '#605e59', '#46443f']`

#### 强调色切换

- `accent: 'blue'` → 主强调色为电光蓝 `#2742ec`（深色 `#6e85ff`）
- `accent: 'lime'` → 主强调色替换为荧光绿 `#c2f53d`

### 2.2 字体 Token

| Token | 字体栈 |
|---|---|
| `--rd-sans` | `"Archivo","Noto Sans SC",system-ui,sans-serif` |
| `--rd-mono` | `"Space Mono",ui-monospace,"SFMono-Regular",monospace` |

### 2.3 字号阶梯

| Token | 字号 | 用途 |
|---|---|---|
| `--rd-display` | `104px` | 超大展示标题 |
| `--rd-title` | `62px` | 页面主标题 |
| `--rd-headline` | `46px` | 二级标题 |
| `--rd-sub` | `34px` | 副标题 |
| `--rd-body` | `27px` | 正文 |
| `--rd-cap` | `24px` | 说明文字、等宽大写标签 |
| `--rd-label` | `24px` | 蓝色标签内文字 |
| `.rd-figure` | `168px` | 巨型数字 |

### 2.4 间距 Token

| Token | 数值 | 用途 |
|---|---|---|
| `--rd-pad-x` | `120px` | 左右页边距 |
| `--rd-pad-y` | `92px` | 上下页边距 |
| `--rd-gap` | `40px` | 模块间距 |

### 2.5 效果 Token

#### 蓝色标签（.rd-tag）

```css
background: var(--rd-blue);
color: var(--rd-blue-ink);
font-family: var(--rd-mono);
font-weight: 700;
font-size: var(--rd-label);
letter-spacing: 0.10em;
text-transform: uppercase;
padding: 9px 12px 8px;
```

- 荧光绿变体：`.rd-tag--lime`（`background: var(--rd-lime); color: var(--rd-ink);`）
- 幽灵变体：`.rd-tag--ghost`（透明背景）

#### 入场动画

```css
[data-deck-active] .rd-anim   { animation: rd-rise 0.55s cubic-bezier(.2,.7,.2,1) both; }
[data-deck-active] .rd-anim-2 { animation-delay: 0.07s; }
[data-deck-active] .rd-anim-3 { animation-delay: 0.14s; }
[data-deck-active] .rd-anim-4 { animation-delay: 0.21s; }

@keyframes rd-rise {
  from { transform: translateY(16px); }
  to   { transform: translateY(0); }
}
```

- 仅在 `prefers-reduced-motion: no-preference` 时生效
- 基础状态为可见终态，动画仅作增强

---

## 三、页面组件分类

### 3.1 总体统计

- **总页数**：77 页
- **独立 slot 数**：77 个
- **每页一个独特布局**：是
- **背景类**：全部为空（`bgClass: ""`），背景由组件内 CSS 控制

### 3.2 按业务类型归类

#### 封面类（5 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page001 | cover | 封面 | （默认标题） |
| page002 | coverband | 封面·横向 | （默认标题） |
| page003 | coverposter | 封面·海报 | （默认标题） |
| page004 | covergrid | 封面·网格 | （默认标题） |
| page005 | coverimage | 封面·影像 | （默认标题） |

#### 目录 / 导航类（1 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page006 | agenda | 导览 | 报告导览 / 目录 |

#### 研究方法 / 文本类（1 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page007 | method | 研究方法 | 横纵分析法 |

#### 市场全景 / 趋势类（3 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page008 | trend | 市场全景 | 逐季度融资额走势 |
| page009 | chronicle | 年度编年 | 2024 大额融资事件编年 |
| page027 | cumulative | 资金累积 | 970 亿是如何累积的 |

#### 行业 / 赛道分布类（4 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page010 | sector | 横向透视 | 行业赛道融资额占比 |
| page015 | chain | 产业链分层 | 产业链分层透视 |
| page016 | layertable | 产业链速查 | AI 产业链分层速查表 |
| page017 | vertical | 应用层 | 下游应用层 · 垂直应用 |

#### 排名 / 头部玩家类（2 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page011 | rank | 头部玩家 | 头部玩家融资排名 |
| page012 | table | 速查表 | 头部玩家融资速查表 |

#### 数据 / 指标类（4 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page013 | bubble | 融资体量 | Top 10 公司融资气泡阵 |
| page014 | quadrant | 选题四象限 | 资本热度 × 商业兑现 |
| page028 | stat | 核心数据 | 大数字 · 资本大年 |
| page070 | concentration | 三重集中 | 资本大年 · 三重集中 |

#### 融资轮次类（3 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page023 | round | 轮次结构 | 融资轮次结构对比 |
| page024 | waffle | 轮次单位图 | 97 笔大额融资 · 轮次构成 |
| page072 | tornado | 轮次背向 | 轮次结构 · 笔数 ↔ 金额 |

#### 时间序列 / 节奏类（4 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page025 | monthly | 月度明细 | 逐月融资额明细 |
| page026 | peak | 单月峰值 | 全年单月峰值 · 双峰节奏 |
| page060 | waterfall | 季度节奏 | 季度融资节奏 · 桥接图 |
| page068 | rose | 月度玫瑰 | 逐月融资 · 玫瑰图 |

#### 地理分布类（2 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page029 | geo | 地区分布 | 融资的地理版图 |
| page030 | mosaic | 地理图集 | 资本地理图集 |

#### 估值类（2 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page031 | valuationjump | 估值跃迁 | 从追赶到反超 · 估值跃迁 |
| page032 | valuation | 估值之谜 | 估值之谜 · 市销率 |

#### 风险类（3 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page033 | risk | 风险研判 | 当前市场的主要风险 |
| page034 | riskchain | 风险传导 | 风险传导链条 |
| page055 | register | 风险登记册 | 风险登记册 |

#### 投资建议 / 策略类（4 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page035 | outlook | 投资建议 | 投资建议与策略 |
| page036 | timeline | 策略时间轴 | 阶段性投资策略路线图 |
| page037 | horizon | 三视野 | 三视野投资框架 |
| page038 | takeaway | 核心结论 | 三条核心结论 |

#### 结论 / 金句 / 主张类（3 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page039 | quote | 金句页 | 结论 · 一句话总结 |
| page056 | shift | 范式转变 | 叙事驱动 → 兑现驱动 |
| page071 | statement | 资本主张 | 全幅影像主张页 |

#### 章节过渡类（1 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page022 | section | 章节页 | 结构透视与展望 |

#### 增长 / 商业模型类（9 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page040 | aarrr | AARRR | AARRR 增长漏斗模型 |
| page041 | rfm | RFM | RFM 标的分层模型 |
| page042 | maba | MABA | MABA 赛道矩阵 |
| page044 | doublediamond | 决策双钻 | 投资决策双钻 |
| page045 | swot | SWOT | SWOT 模型 |
| page046 | fiveforces | 五力 | 波特五力模型 |
| page047 | canvas | 画布 | 商业模式画布 |
| page049 | pyramid | 金字塔 | 金字塔模型 |
| page051 | flywheel | 飞轮 | 飞轮模型 |

#### 流程 / 旅程 / 路线图类（4 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page043 | gantt | 建仓甘特 | 分阶段建仓路线图 |
| page048 | journey | 旅程图 | 用户旅程地图 |
| page053 | pareto | 资本集中度 | 资本集中度 · 帕累托 |
| page057 | hypecycle | 成熟度曲线 | 技术成熟度曲线 |

#### 矩阵 / 决策类（4 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page050 | bcg | 波士顿矩阵 | BCG 波士顿矩阵 |
| page052 | pest | PEST | PEST 宏观环境分析 |
| page054 | radar | 风险雷达 | 风险信号雷达图 |
| page058 | betmatrix | 决策矩阵 | 投资标的决策矩阵 |

#### 资金流向 / 结构类（5 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page059 | share | 资本大年 | AI 占全美风投份额 |
| page061 | treemap | 资金版图 | 赛道资金版图 · 树图 |
| page062 | escalation | 单笔阶梯 | 资金巨额化 · 单笔阶梯 |
| page064 | sankey | 资本流向 | 资本流向 · 桑基图 |
| page069 | marimekko | 资金矩阵 | 产业链资金结构矩阵 |

#### 图文 / 案例类（5 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page018 | case | 典型案例 | Anthropic：从追赶到反超 |
| page019 | spotlight | 案例聚焦 | xAI 案例聚焦 |
| page020 | coreweave | 卖铲赢家 | CoreWeave 案例 |
| page021 | casecompare | 案例对比 | 三大案例对比速览 |
| page063 | gallery | 实验室影像 | 模型层头部实验室影像志 |

#### 评分 / 仪表类（3 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page065 | scorecard | 投资记分卡 | 头部标的投资记分卡 |
| page066 | gauge | 泡沫温度计 | 估值泡沫温度计 |
| page073 | moat | 护城河 | 头部公司护城河剖析 |

#### 硬件 / 供应链类（4 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page067 | embodied | 具身智能 | 下游前沿 · 具身智能 |
| page074 | supply | 算力卡脖 | 算力供应链的瓶颈 |
| page075 | chips | AI 芯片 | 上游硬件 · AI 芯片 |
| page076 | compute | 算力军备 | 算力军备竞赛 · GPU 集群 |

#### 封底类（1 页）

| 页码 | Slot | 中文标签 | 标题 |
|---|---|---|---|
| page077 | colophon | 封底 | 数据来源 / 封底 |

---

## 四、关键设计特征

### 4.1 双模式 + 双强调色

theme03 支持：

- **浅色模式**：暖灰背景 `#d6d6d3` + 深色文字
- **深色模式**：近黑背景 `#161513` + 浅色文字
- **强调色切换**：电光蓝 `#2742ec` / 荧光绿 `#c2f53d`

通过 `.rd-dark` 类切换深浅模式，通过 JS `setRDAccent()` 切换强调色。

### 4.2 强烈的编辑式排版

- 主标题使用 `Archivo` 字体，字重 800-900，负字间距
- 巨型数字 `.rd-figure` 达 `168px`
- 等宽大写标签（mono + uppercase + letter-spacing）作为视觉锚点
- 标题中部分文字使用强调色（如 "AI"、"增长"）形成节奏

### 4.3 模块化信息架构

- 每页顶部有 `.rd-topbar`：左侧蓝色标签 + 右侧 mono 说明
- 内容区域使用网格、卡片、进度条、表格等模块化呈现
- 底部常有线框（hairline）分隔页脚信息

### 4.4 图表风格

- 使用中性灰阶作为图表主色
- 强调数据点使用电光蓝或荧光绿
- 支持环形图、饼图、条形图、折线图、面积图、桑基图、树图、玫瑰图等多种类型

### 4.5 装饰元素

- 内置 12 款 3D 风格装饰图片（胜利手势、是按键、404 方块、像素幽灵等）
- 通过 `showDecor` + `decorSrc` 控制
- 装饰图可缩放（`decorScale`）

### 4.6 动效

- 入场动画：轻微上浮 `translateY(16px)`，时长 0.55s
- 强调元素可能有额外的动效（如动态背景、数字计数等）
- 尊重 `prefers-reduced-motion`

---

## 五、对 lemonPPT 的启示

### 5.1 可借鉴的设计思路

1. **双模式设计**：同时提供深色和浅色模式，通过 CSS 变量切换，适应不同演示场景。
2. **双强调色**：提供 2 套强调色（如蓝/绿），让用户根据内容情绪选择。
3. **强字重 + 负字间距**：编辑式风格的核心，适合技术/金融主题。
4. **等宽大写标签**：用 mono 字体做顶部标签和页脚信息，建立技术感。
5. **图表克制用色**：中性灰阶 + 单一强调色，避免图表视觉噪音。
6. **模块化页面结构**：顶部标签、中部内容、底部页脚的三段式结构。
7. **巨型数字**：关键数据用超大字号突出，形成视觉焦点。

### 5.2 不能复用的东西

- 具体色值（`#2742ec`、`#c2f53d`、`#d6d6d3`、`#161513` 等）
- `--rd-` 前缀命名
- `.rd-slide`、`.rd-frame`、`.rd-tag` 等类名体系
- 具体的字号阶梯数值
- 77 个 slot 的命名和结构
- 12 款 3D 装饰图片资产
- 中文标签文案

### 5.3 lemonPPT 可以走的方向

如果 lemonPPT 也想要一个「代码风/编辑风」主题，建议：

1. 重新选择一套原创配色（例如炭黑 + 珊瑚橙 + 薄荷绿，或深蓝 + 电光黄）。
2. 重新选择字体组合（例如 Space Grotesk / Inter + Noto Sans SC + JetBrains Mono）。
3. 建立自己的 Token 命名前缀（例如 `--lp-`）。
4. 先做 5~8 个通用布局，不要 77 页。
5. 支持深色/浅色双模式，但先实现深色模式作为默认。
6. 简化动效：先只做基础入场动画。

---

## 六、与 theme01、theme02 的对比

| 维度 | theme01（轻拟态风） | theme02（炫光紫绿风） | theme03（深浅代码风） |
|---|---|---|---|
| **整体亮度** | 浅色底、亮背景 | 深色底、霓虹光 | 深色/浅色双模式 |
| **主色调** | 多色柔和弥散 | 绿/紫高饱和霓虹 | 电光蓝 + 荧光绿 |
| **质感** | 玻璃拟态、毛玻璃 | 发光边框、科技光晕 | 编辑式、粗体字重、高对比 |
| **字体** | Noto Sans SC + Space Mono | Noto Sans SC + Space Grotesk + Space Mono | Archivo + Noto Sans SC + Space Mono |
| **适用场景** | 企业汇报、融资报告 | 科技发布会、路演 | 技术方案、开发者大会、投研报告 |
| **页数** | 84 页 | 74 页 | 77 页 |
| **配色方案** | 单一主题 | green / violet 双方案 | light / dark 双模式 + blue / lime 双强调 |
| **装饰元素** | 弥散渐变、玻璃卡片 | 光晕、旋转光边、3D 球体 | 3D 像素风装饰图、mono 标签 |

---

## 七、红线提醒

- ❌ 不能复制 `theme03/source/src/theme.css`、`theme.js` 代码
- ❌ 不能复用 `--rd-` Token 值
- ❌ 不能复用 `.rd-slide` 类名体系
- ❌ 不能复用 77 个 slot 的具体实现
- ❌ 不能复用 12 款 3D 装饰图片资产

✅ 可以学习的是：**双模式 Token 切换机制**、**编辑式排版逻辑**、**模块化信息架构**、**图表克制用色策略**、**mono 标签系统**。

---

## 八、生成的预览资产

本次分析同步生成了 theme03 全部 77 页的截图画廊：

- **画廊 HTML**：[output/theme03-all/gallery.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme03-all/gallery.html)
- **截图目录**：[output/theme03-all/screenshots/](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme03-all/screenshots/)
- **主 deck 预览**：[output/theme03-all/ppt/index.html](file:///Users/apple/Downloads/dashi-ppt-skill-main/output/theme03-all/ppt/index.html)

> 这些预览资产仅用于 lemonPPT 的设计研究参考，截图本身包含 Dashi PPT 的视觉表达，请勿直接作为 lemonPPT 的素材使用。
